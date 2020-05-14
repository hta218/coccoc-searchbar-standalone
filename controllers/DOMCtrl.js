import SuggestItem from '../components/SuggestItem.jsx'
import styles from '../styles/SuggestBox.css'
import { container, refs } from './DataCtrl'

const DOMCtrl = {
	renderSuggestions: () => {
		const { suggestList } = refs
		container.suggestions.forEach((suggest, idx) => {
			const item = suggestList.children[idx]
			if (item) {
				item.removeChild(item.firstChild)
				item.appendChild(<SuggestItem suggest={suggest} />)
			}
		})
	},

	toggleSuggestions: () => {
		const { suggestionsOpened } = container
		const method = suggestionsOpened ? 'add' : 'remove'
		const display = suggestionsOpened ? 'flex' : 'none'

		refs.searchForm.classList[method](styles.openSuggest)
		refs.suggestList.style.display = display
	},

	toggleSelected: (action) => {
		const { selected, suggestions, query } = container

		const item = refs.suggestList.children[selected]
		let selectionLength = query.length

		if (item) {
			const method = action === 'show' ? 'add' : 'remove'

			item.classList[method]("selected")
			refs.searchInput.value = suggestions[selected]

			selectionLength = suggestions[selected].length
		} else {
			refs.searchInput.value = query
		}

		if (action === 'show') {
			refs.searchInput.setSelectionRange(selectionLength, selectionLength)
		}
	},
}

window.__SBDOMCtrl = DOMCtrl

export default DOMCtrl
