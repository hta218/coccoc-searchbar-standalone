import throttle from 'lodash/throttle'
import DataCtrl, { CocCocStrings, container, isMobile, refs, isCocCoc } from '../controllers/DataCtrl'
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
		container.suggestionsOpened = false
		DOMCtrl.toggleSuggestions()
		DataCtrl.clearSearch()
	}

	function handleKeyDown(e) {
		let { selected, suggestionsOpened: isOpen, suggestions, query } = container

		if (e.keyCode === KEYS.UP) {
			if (!isOpen) { return }
			// Prevent input tag from automatic moving cursor to the start position
			e.preventDefault()
			DOMCtrl.hideSelected()

			selected -= 1
			if (selected < -1) {
				selected = CocCocStrings.SUGGESTIONS_COUNT - 1
			}

			DataCtrl.setSelected(selected)
			DOMCtrl.showSelected()
		} else if (e.keyCode === KEYS.DOWN) {
			if (!isOpen) { return }
			DOMCtrl.hideSelected()

			selected += 1
			if (selected > CocCocStrings.SUGGESTIONS_COUNT - 1) {
				selected = -1
			}

			DataCtrl.setSelected(selected)
			DOMCtrl.showSelected()
		} else if (e.keyCode === KEYS.RIGHT) {
			if (!isOpen) { return }
			if (selected === -1) {
				DataCtrl.setSelected(0)
				DOMCtrl.showSelected()
			}
		} else if (e.keyCode === KEYS.ESC) {
			container.suggestionsOpened = false
			DOMCtrl.toggleSuggestions()
			DOMCtrl.hideSelected()
			DataCtrl.setSelected(-1)
		} else if (e.keyCode === KEYS.ENTER) {
			DataCtrl.openSearchInNewtab({ query: suggestions[selected] })
		}
	}

	const initialItems = (new Array(CocCocStrings.SUGGESTIONS_COUNT))
		.fill({ suggest: '' })
		.map(item => <a className={itemStyles.item}><SuggestItem {...item} /></a>)

	const clearBtn = <span ref={ref => refs.clearSearch = ref} className={styles.clear} onclick={clearSearch}>×</span>
	const searchIcon = <span className={styles.searchIcon} />

	return (
		<div className={`${styles.box} ${isCocCoc ? styles.ccBrowser : ""}`}>
			<div className={styles.searchform} ref={ref => refs.searchForm = ref}>
				{ (!isMobile && !isCocCoc) ? searchIcon : null }
				<input
					type="text"
					placeholder="Từ khóa tìm kiếm"
					className={styles.field}
					id={CocCocStrings.COCCOC_SEARCH_INPUT_ID}
					ref={ref => refs.searchInput = ref}
					onclick={handleInputClick}
					oninput={throttle(DataCtrl.search, CocCocStrings.THROTTLE_THRESHOLD)}
					onkeydown={handleKeyDown}
				/>
				<button
					onclick={() => DataCtrl.openSearchInNewtab({ query: refs.searchInput.value, logData: { info: "Search button click" } })}
					className={styles.searchBtn}
				>
					Tìm với Cốc Cốc
				</button>
				{isMobile ? clearBtn : null}
			</div>
			<div className={styles.suggestWraper}>
				<ul
					className={styles.suggestList}
					ref={ref => refs.suggestList = ref}
				>
					{initialItems}
				</ul>
			</div>
		</div>
	)
}

export default SuggestBox
