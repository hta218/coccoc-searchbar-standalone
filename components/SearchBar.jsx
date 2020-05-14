import DataCtrl, { CocCocStrings, container, isMobile } from '../controllers/DataCtrl.js';
import DOMCtrl from '../controllers/DOMCtrl';
import mobileStyles from '../styles/Mobile.SearchBar.css';
import desktopStyles from '../styles/SearchBar.css';
import SuggestBox from './SuggestBox.jsx';
import Templates from './Templates.jsx';

const styles = isMobile ? mobileStyles : desktopStyles

const SearchBar = () => {
	document.body.addEventListener("click", e => {
		if (e.target.getAttribute("id") !== CocCocStrings.COCCOC_SEARCH_INPUT_ID) {
			container.suggestionsOpened = false
			DOMCtrl.toggleSuggestions()
		}
	})

	return (
		<div className={styles.searchBar}>
			<div className={styles.header}>
				<h1 className={styles.logo}>
					<a
						className={styles.logoLink}
						onclick={() => DataCtrl.openSearchInNewtab('')}
					>
						<img src={container.mainPageData.logo.image} alt="Cốc Cốc search" />
					</a>
				</h1>
				<div className={styles.wrapSB}>
					<SuggestBox />
				</div>

				{isMobile ? <Templates /> : null}
			</div>
		</div>
	)
}

export default SearchBar
