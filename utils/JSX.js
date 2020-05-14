// import 'mdn-polyfills/Node.prototype.append.js';

class JSX {
	constructor({ strings } = {}) {
		this.strings = strings || {};
		this.component = this.component.bind(this);
		return this.component;
	}
		/* eslint-disable class-methods-use-this, complexity */
	component(tagName, attrs, ...children) {
		if (children) {
			children = children.filter((val) => val !== null);
		}
		const dataSet = [];

		if (typeof tagName === 'function') {
			// Override children
			attrs = attrs || {};
			Object.defineProperty(attrs, 'children', { value: children, writable: true });
			return tagName(attrs);
		}
		if (attrs) {
			//if (attrs?.i18n && children) {
				//for (let i = 0; i < children.length; i++) {
					//if (typeof children[i] === 'string') {
						//children[i] = this.strings[children[i]] || children[i];
					//}
					//// eslint-disable-next-line no-undef
				//}
				//delete attrs.i18n;
			//}
			//if (attrs.i18n) {
				//// todo - traverse children, find just String, localize them as i18n
				//delete attrs.i18n;
			//}
			if (attrs.dataSet) {
				for (const key of Object.keys(dataSet)) {
					dataSet.push({ key, value: attrs[key] });
				}
			}
			if (attrs.class) {
				attrs.className = attrs.class;
				delete attrs.class;
			}
		} else {
			attrs = null;
		}
		const elem = tagName !== 'fragment' ?
			Object.assign(document.createElement(tagName), attrs) :
			document.createDocumentFragment();
			for (const child of children) {
				if (Array.isArray(child)) { elem.append(...child); } else { elem.append(child); }
			}

		if (typeof tagName === 'function') {
			if (Array.isArray(attrs.children)) {
				for (const child of attrs.children) {
					if (Array.isArray(child)) { elem.append(...child); } else { elem.append(child); }
				}
			}
		}

		if (typeof tagName !== 'function') {
			if (attrs?.dataSet) {
				for (const key in attrs.dataSet) {
					if (attrs.dataSet.hasOwnProperty(key)) {
						elem.dataset[key] = attrs.dataSet[key];
					}
				}
			}

			if (typeof attrs?.ref === 'function') {
					attrs.ref(elem);
			}

			// Append style
			if (attrs?.style) {
				Object.assign(elem.style, attrs.style);
			}
		}
		return elem;
	}
}
export default new JSX();
