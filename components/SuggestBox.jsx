import throttle from 'lodash/throttle'
import DataCtrl, { CocCocStrings, container, isMobile, refs } from '../controllers/DataCtrl'
import DOMCtrl from '../controllers/DOMCtrl'
import styles from '../styles/SuggestBox.css'
import itemStyles from '../styles/SuggestItem.css'
import { KEYS } from '../utils/index'
import SuggestItem from './SuggestItem.jsx'

function SuggestBox() {
	function handleInputClick() {
		if (container.query) {
			container.suggestionsOpened = true
			DOMCtrl.toggleSuggestions()
		}
	}

	function clearSearch() {
		refs.clearSearch.style.display = "none"
		refs.searchInput.value = ""
		DOMCtrl.toggleSuggestions()
		container.suggestionsOpened = false
		container.query = ''
		container.suggestions = []
	}

	function handleKeyDown(e) {
		let { selected, suggestionsOpened: isOpen } = container

		if (e.keyCode === KEYS.UP) {
			if (!isOpen) { return }
			// Prevent input tag from automatic moving cursor to the start position
			e.preventDefault()
			DOMCtrl.toggleSelected("hide")
			selected -= 1
			if (selected < -1) {
				selected = CocCocStrings.SUGGESTIONS_COUNT - 1
			}
			container.selected = selected
			DOMCtrl.toggleSelected("show")
		} else if (e.keyCode === KEYS.DOWN) {
			if (!isOpen) { return }
			DOMCtrl.toggleSelected("hide")
			selected += 1
			if (selected > CocCocStrings.SUGGESTIONS_COUNT - 1) {
				selected = -1
			}
			container.selected = selected
			DOMCtrl.toggleSelected("show")
		} else if (e.keyCode === KEYS.RIGHT) {
			if (!isOpen) { return }
			if (selected === -1) {
				container.selected = 0
				DOMCtrl.toggleSelected('show')
			}
		} else if (e.keyCode === KEYS.ESC) {
			container.suggestionsOpened = false
			DOMCtrl.toggleSuggestions()
			container.selected = -1
			container.suggestionsOpened = false
			refs.searchInput.value = container.query
		} else if (e.keyCode === KEYS.ENTER) {
			DataCtrl.openSearchInNewtab(container.suggestions[selected])
		}
	}

	const initialItems = (new Array(CocCocStrings.SUGGESTIONS_COUNT))
		.fill({ suggest: '' })
		.map(item => <a className={itemStyles.item}><SuggestItem {...item} /></a>)

	const clearBtn = <span ref={ref => refs.clearSearch = ref} className={styles.clear} onclick={clearSearch}>×</span>

	return (
		<div className={styles.box} >
			<div className={styles.searchform} ref={ref => refs.searchForm = ref}>
				<input
					type="text"
					className={styles.field}
					id={CocCocStrings.COCCOC_SEARCH_INPUT_ID}
					ref={ref => refs.searchInput = ref}
					onclick={handleInputClick}
					oninput={throttle(DataCtrl.search, CocCocStrings.TROTTLE_TRESHOLD)}
					onkeydown={handleKeyDown}
				/>
				<button
					onclick={DataCtrl.openSearchInNewtab}
					className={styles.btn}
				>
					tìm kiếm
				</button>
				{isMobile ? clearBtn : null}
			</div>
			<div className={styles.suggestWraper}>
				<ul
					className={`${styles.suggestList} ${styles.suggestListStartPage}`}
					ref={ref => refs.suggestList = ref}
				>
					{initialItems}
				</ul>
			</div>
		</div>
	)
}

export default SuggestBox
