import DataCtrl, { CocCocStrings, container, isMobile, isCocCoc } from '../controllers/DataCtrl.js';
import DOMCtrl from '../controllers/DOMCtrl';
import mobileStyles from '../styles/Mobile.SearchBar.css';
import desktopStyles from '../styles/SearchBar.css';
import SuggestBox from './SuggestBox.jsx';
import Templates from './Templates.jsx';

const styles = isMobile ? mobileStyles : desktopStyles

const SearchBar = () => {
	document.body.addEventListener("click", e => {
		if (e.target.getAttribute("id") !== CocCocStrings.COCCOC_SEARCH_INPUT_ID) {
			DOMCtrl.hideSelected()
			DataCtrl.setSelected(-1)
			container.suggestionsOpened = false
			DOMCtrl.toggleSuggestions()
		}
	})

	const doodleQuery = container.mainPageData.logo.query

	return (
		<div className={`${styles.searchBar} ${styles.startScreen}`}>
			<div className={styles.header}>
				<h1 className={styles.logo}>
					<a
						className={styles.logoLink}
						onclick={() => DataCtrl.openSearchInNewtab({ query: doodleQuery, logData: { info: "Doodle click" } })}
					>
						<img src={container.mainPageData.logo.image} alt="Cốc Cốc search" />
					</a>
				</h1>
				<div className={styles.wrapSB}>
					<SuggestBox />
				</div>
				{(isMobile && isCocCoc) ? <Templates /> : null}
			</div>
		</div>
	)
}

export default SearchBar
