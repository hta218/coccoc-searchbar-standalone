(function() {
	var NtpSearchSuggestAction = {
		REQUEST_SENT: 0,
		REQUEST_CANCELED: 1,
		RESPONSE_RECEIVED: 2,
		REQUEST_FAILED: 3
	};
	var autoFocus = true;
	// window.ntp.autoFocusSwitch = function(state) {
	// 	autoFocus = state;
	// };

	var NtpSearchAction = {
		BUTTON_CLICKED: 0,
		ENTER_PRESED: 1,
		SUGGEST_SELECTED: 2
	};

	function removeTone(s) {
		return s.toLowerCase()
			.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
			.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
			.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
			.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
			.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
			.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
			.replace(/đ/g, 'd');
	}

	function CoccocSearchString() {
		this._lastQuery = '';
		this.url = null;
		this._currentSuggestionIndex = -1;

		this._currentRequest = null;

		this._container = document.querySelector('#search');
		this._suggestions = document.querySelector('#search-suggestions');
		this._searchString = document.querySelector('#search-string');
		this._searchButton = document.querySelector('#search-button');

		this.hidden = true;
		this._init();
	}

	CoccocSearchString.prototype = {
		constructor: CoccocSearchString,
		TROTTLE_TRESHOLD: 200,
		COCCOC_SEARCH_URL: 'https://coccoc.com/search#query={{query}}&s=nt',
		COCCOC_SUGGEST_URL: 'https://coccoc.com/composer/autocomplete?q={{term}}&s=nt',
		SUGGEST_ITEM_TEMPLATE: '',

		_init: function() {
			var self = this;

			document.addEventListener('keypress', this._onKeyPress.bind(this), false);
			document.addEventListener('click', function(e) {
				if (e.target !== self._searchString) {
					self.hidden = true;
				}
			}, false);

			this.fetch = function() {
				setTimeout(function() {
					self._showSuggestions();
				}, 0);
			};

			this._container.addEventListener('input', this.fetch, false);
			this._container.addEventListener('keydown', this._onKeyDown.bind(this), false);
			this._searchButton.addEventListener('click', this._search.bind(this, NtpSearchAction.BUTTON_CLICKED), false);
			this._suggestions.addEventListener('click', this._onSuggestionClick.bind(this), false);
			this._suggestions.addEventListener('mousemove', this._onMouseMove.bind(this), false);

			// this._fetchSuggestions = ntp.throttle(this._fetchSuggestions.bind(this), this.TROTTLE_TRESHOLD);
		},

		_isNewQuery: function() {
			return this.query !== this._lastQuery;
		},

		_search: function(source) {
			var query = this.query;
			if (query.trim() !== '') {
				window.dispatchEvent(new Event('search_run'));
				setTimeout(function() {
					source = source || NtpSearchAction.BUTTON_CLICKED;
					ntp.logAction('webSearchAction', source);
					ntp.log('Search', { query: query });
					this.hidden = true;
					if (this.url) {
						location.href = this.url;
					} else {
						location.href = this.COCCOC_SEARCH_URL.replace('{{query}}', encodeURIComponent(query));
					}
				}.bind(this));
			}
		},

		_stop: function(e) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.preventDefault();
		},

		_createSuggestionNodes: function(n) {
			var el = document.createElement('li');
			var fragment = document.createDocumentFragment();
			el.innerHTML = this.SUGGEST_ITEM_TEMPLATE;
			while (n--) {
				fragment.appendChild(el.cloneNode());
			}
			this._suggestions.appendChild(fragment);
			fragment = null;
			el = null;
		},

		_onSuggestionClick: function(e) {
			var el = e.target.closest('li');
			var index = Array.prototype.indexOf.call(this._suggestions.children, el);
			if (el) {
				this._selectSuggestion(el);
				this._search(NtpSearchAction.SUGGEST_SELECTED);
				ntp.log('clickAutoComplete', {
					query: el.innerText.trim(),
					position: index,
					originalQuery: this._lastQuery
				});
			}
		},

		_onMouseMove: function(e) {
			if (e.target.tagName === 'LI') {
				this._activateSuggestion(e.target);
			}
		},

		_onKeyDown: function(e) {
			switch (e.keyCode) {
				case 13:
					this._search(NtpSearchAction.ENTER_PRESED);
					break;
				case 8:
					this.fetch();
					break;
				case 38:
					this._prev(e);
					break;
				case 40:
					this._next(e);
					break;
				case 27:
					this.url = null;
					this.query = this._lastQuery;
					this.hidden = true;
					break;
				default:
					// do nothing
			}
		},

		_onKeyPress: function(e) {
			var ch = String.fromCharCode(e.charCode);
			if (ch !== ' ' && e.target !== this._searchString && autoFocus) {
				this._searchString.focus();
			}
		},

		_fillSuggestionContents: function(node, suggest, title, url) {
			var text;
			title = title || I18N['search-navigate-to-site'];

			// navigational query
			if (url) {
				node.dataset.url = url;
				url = url.replace(/^[^:/]+:\/\//, '');
				text = '<span class="nav-url">' + this._highlight(suggest, this.query) + '</span> – ' + title;
			} else {
				delete node.dataset.url;
				text = this._highlight(suggest, this.query);
			}
			node.innerHTML = text;
			node.classList[url ? 'add' : 'remove']('navigation');
		},

		_populate: function(suggestions, titles, urls) {
			var suggestLength = suggestions.length;
			var suggestionNodes = this._suggestions.querySelectorAll('li');
			var nodesLength = suggestionNodes.length;
			titles = titles || [];
			urls = urls || [];

			if (nodesLength < suggestLength) {
				this._createSuggestionNodes(suggestLength - nodesLength);
				this._populate(suggestions, titles, urls);
				return;
			}

			for (var i = 0; i < nodesLength; ++i) {
				if (i < suggestLength) {
					this._fillSuggestionContents(suggestionNodes[i], suggestions[i], titles[i], urls[i]);
					// suggestionNodes[i].innerHTML = this._highlight(suggestions[i], this.query);
				}
				suggestionNodes[i][i < suggestLength ? 'removeAttribute' : 'setAttribute']('hidden', true);
			}
		},
		_selectSuggestion: function(node) {
			this._activateSuggestion(node);
			if (node) {
				if (node.classList.contains('navigation')) {
					this.url = node.dataset.url;
					this.query = document.querySelector('.nav-url', node).textContent;
				} else {
					this.url = null;
					this.query = node.textContent;
				}
			}
		},

		_activateSuggestion: function(node) {
			if (node && node.classList.contains('active')) {
				return;
			}
			var suggestionNodes = this._suggestions.querySelectorAll('li:not([hidden])');
			for (var i = 0; i < suggestionNodes.length; ++i) {
				if (node === suggestionNodes[i]) {
					this._currentSuggestionIndex = i;
					suggestionNodes[i].classList.add('active');
				} else {
					suggestionNodes[i].classList.remove('active');
				}
			}
		},

		_showSuggestions: function() {
			var query = this.query;

			if (query.trim() === '') {
				this._lastQuery = query;
				this.hidden = true;
				return;
			}

			if (!this._isNewQuery()) {
				return;
			}

			this.url = null;
			this._cancelRequest();
			this._fetchSuggestions();
		},

		_fetchSuggestions: function() {
			var query = this.query, self = this;

			this._lastQuery = query;

			// TODO: use ntp.getJSON
			var ajax = new XMLHttpRequest();
			ajax.open('get', this.COCCOC_SUGGEST_URL.replace('{{term}}', encodeURIComponent(query)), true);

			ajax.addEventListener('load', function () {
				/* eslint-disable no-invalid-this */
				var json = this.responseText;
				var data = {};

				var actionResult = NtpSearchSuggestAction.RESPONSE_RECEIVED;
				try {
					data = JSON.parse(json);
				} catch (oO) {
					actionResult = NtpSearchSuggestAction.INVALID_JSON;
				}
				ntp.logAction('webSearchSuggestAction', actionResult);

				if (data.suggestions && data.suggestions.length) {
					self._populate(data.suggestions, data.titles, data.urls);
					self.hidden = false;
				} else {
					self.hidden = true;
				}
				self._currentRequest = null;
			}, false);
			/* eslint-enable no-invalid-this */
			ajax.addEventListener('error', function() {
				ntp.logAction('webSearchSuggestAction', NtpSearchSuggestAction.REQUEST_FAILED);
			});

			ajax.send(null);
			ntp.logAction('webSearchSuggestAction', NtpSearchSuggestAction.REQUEST_SENT);
			this._currentRequest = ajax;
		},

		_cancelRequest: function() {
			if (this._currentRequest) {
				this._currentRequest.abort();
				ntp.logAction('webSearchSuggestAction', NtpSearchSuggestAction.REQUEST_CANCELED);
				this._currentRequest = null;
			}
		},

		_move: function(n, e) {
			if (this.hidden) {
				return;
			}
			var suggestionNodes = this._suggestions.querySelectorAll('li:not([hidden])');
			var l = suggestionNodes.length;
			var index = this._currentSuggestionIndex + n;
			if (index >= l) {
				index = -1;
			} else if (index < -1) {
				index = l - 1;
			}
			this._currentSuggestionIndex = index;
			this._updateActiveSuggestion();
			this._stop(e);
		},

		_next: function(e) {
			this._move(1, e);
		},

		_prev: function(e) {
			this._move(-1, e);
		},

		_updateActiveSuggestion: function() {
			var index = this._currentSuggestionIndex;
			var suggestionNode = this._suggestions.querySelectorAll('li:not([hidden])')[index];
			this._selectSuggestion(suggestionNode);
			if (index === -1 && this._isNewQuery()) {
				this.query = this._lastQuery;
			}
		},

		_highlightRecursive: function(suggest, queries) {
			if (!queries.length) {
				return suggest;
			}

			var query = queries.shift();
			var l = query.length;
			var suggestPlain = removeTone(suggest);
			var queryPlain = removeTone(query);
			var index = suggestPlain.indexOf(queryPlain);
			var lastIndex = 0;
			var a = [];

			if (index !== -1) {
				a.push(suggest.slice(lastIndex, index));
				a.push('<b>' + suggest.substr(index, l) + '</b>');
				lastIndex = index + l;
			}
			a.push(this._highlightRecursive(suggest.slice(lastIndex), queries));

			return a.join('');
		},

		_highlight: function(suggest, query) {
			return this._highlightRecursive(suggest, query.split(' '));
		},

		set hidden(val) {
			this._hidden = val;
			this._suggestions[!this._hidden ? 'removeAttribute' : 'setAttribute']('hidden', true);
			if (!this._hidden) {
				this._currentSuggestionIndex = -1;
				this._updateActiveSuggestion();
				this._suggestions.parentNode.classList.add('search-suggestions');
			} else {
				this._suggestions.parentNode.classList.remove('search-suggestions');
				this._cancelRequest();
			}
		},

		get hidden() {
			return this._hidden;
		},

		get query() {
			return this._searchString.value;
		},

		set query(val) {
				this._searchString.value = val;
				this._searchString.focus();
			}
		};

	// window.ntp.ui.CoccocSearchString = CoccocSearchString;
	window.CoccocSearchString = CoccocSearchString
})();
