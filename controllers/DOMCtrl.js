import SuggestItem from '../components/SuggestItem.jsx'
import styles from '../styles/SuggestBox.css'
import { CocCocStrings, container, refs } from './DataCtrl'

const DOMCtrl = {
	renderSuggestions: () => {
		const { suggestList } = refs
		const { suggestions } = container

		for (let i = 0; i < CocCocStrings.SUGGESTIONS_COUNT; i++) {
			const item = suggestList.children[i]
			if (item) {
				if (i < suggestions.length) {
					item.removeChild(item.firstChild)
					item.appendChild(<SuggestItem suggest={suggestions[i]} />)
					item.style.display = "block"
				} else {
					item.style.display = "none"
				}
			}
		}
	},

	toggleSuggestions: () => {
		const { suggestionsOpened } = container
		const method = suggestionsOpened ? 'add' : 'remove'
		const display = suggestionsOpened ? 'flex' : 'none'

		refs.searchForm.classList[method](styles.openSuggest)
		refs.suggestList.style.display = display
	},

	showSelected: () => {
		const { selected, suggestions, query } = container

		const item = refs.suggestList.children[selected]
		let selectionLength = query.length

		if (item) {
			item.dataset.selected = true
			selectionLength = suggestions[selected].length
		}

		refs.searchInput.setSelectionRange(selectionLength, selectionLength)
	},

	hideSelected: () => {
		const { selected } = container
		const item = refs.suggestList.children[selected]

		if (item) {
			item.dataset.selected = false
		}
	}
}

window.__SBDOMCtrl = DOMCtrl

export default DOMCtrl
