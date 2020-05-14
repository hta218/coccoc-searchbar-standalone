import SearchBar from "./components/SearchBar.jsx"
import DataCtrl from './controllers/DataCtrl'

function renderSearchBar(selector) {
	DataCtrl
		.fetchExampleQueries()
		.then(() => {
			window.document.querySelector(selector).appendChild(<SearchBar />)
		})
		.catch(console.error)
}

window.__renderSearchBar = renderSearchBar
