import DOMCtrl from './DOMCtrl'
import LogCtrl from './LogCtrl'

export const CocCocStrings = {
	COCCOC_MAIN_PAGE: '/composer/main_page',
	COCCOC_SUGGEST_URL: '/composer/autocomplete?q={{term}}&s=nt',
	COCCOC_SEARCH_URL: '/search?query={{query}}&s=nt',
	COCCOC_LOG_URL: '/log',
	COCCOC_SEARCH_INPUT_ID: 'coccoc-searchbar-input',
	PUBLIC_DIR: '../public',
	THROTTLE_THRESHOLD: 200,
	SUGGESTIONS_COUNT: 10,
}

export const container = {
	query: '',
	selected: -1,
	suggestions: [],
	suggestionsOpened: false,
	mainPageData: {}
}

export const refs = {
	searchInput: null,
	clearSearch: null,
	searchForm: null,
	suggestList: null,
}

export const isMobile = (window.innerWidth <= 767)

const DataCtrl = {
	fetchExampleQueries: () => {
		return new Promise((resolve, reject) => {
			fetch(CocCocStrings.COCCOC_MAIN_PAGE)
				.then(res => res.json())
				.then(data => {
					container.mainPageData = data || {}
					const defLogo = { image: require(`../public/img/logo.svg`), query: "" }

					// Get the right doodle
					if (data.doodle && data.doodle[0]) {
						const today = +new Date()
						const logo = data.doodle.find(dod => (dod.start_date * 1000) <= today && today <= (dod.end_date * 1000))
						logo.query = (logo.search_url || "").split("?query=")[1]
						container.mainPageData.logo = logo || defLogo
					} else {
						container.mainPageData.logo = defLogo
					}

					// Separate queries and qaBox
					if (data.example_queries && data.example_queries[0]) {
						container.mainPageData.queries = data.example_queries.filter(q => q.type !== 'qa_box')
						container.mainPageData.qaBox = data.example_queries.find(q => q.type === 'qa_box')
					}

					resolve()
				})
				.catch(reject)
		})
	},

	search: () => {
		container.query = refs.searchInput.value
		const fetchURL = CocCocStrings.COCCOC_SUGGEST_URL.replace('{{term}}', container.query)
		fetch(fetchURL)
			.then(res => res.text())
			.then(text => {
				if (text) {
					const data = JSON.parse(text)
					if (data.suggestions) {
						container.suggestions = data.suggestions
						DOMCtrl.renderSuggestions()
						container.suggestionsOpened = true
						DOMCtrl.toggleSuggestions('show')
						refs.clearSearch.style.display = "flex"
					}
				} else {
					container.suggestions = []
					container.suggestionsOpened = false
					refs.clearSearch.style.display = "none"
					DOMCtrl.toggleSuggestions('hide')
				}
			})
			.catch(console.error)
	},

	openSearchInNewtab({ query = container.query, logData = {} }) {
		const qr = typeof query === 'string' ? query : container.query
		const url = CocCocStrings.COCCOC_SEARCH_URL.replace('{{query}}', qr)
		console.log(6996, query, logData)
		LogCtrl.clickOccur({ url, type: "Click", ...logData })
		window.open(url, "_blank")
	}
}

window.__SBdata = {
	container,
	refs,
	isMobile
}
export default DataCtrl
