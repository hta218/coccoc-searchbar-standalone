import escapeRegExp from 'lodash/escapeRegExp';
import DataCtrl, { container, isCocCoc, refs } from '../controllers/DataCtrl';
import DOMCtrl from '../controllers/DOMCtrl';
import styles from '../styles/SuggestItem.css';

const SuggestItem = props => {
	const { suggest, index } = props;
	const query = escapeRegExp(container.query);

	const startSub = suggest.search(query.toLowerCase());
	const endSub = startSub + query.length;

	let substrStart = '';
	let substrSelected = '';
	let substrEnd = '';

	let url = '';
	let text = '';

	if (props.url) {
		url = <a href={props.url}>{props.url}</a>;
	} else if (startSub >= 0) {
		substrStart = suggest.slice(0, startSub);
		substrSelected = <b>{suggest.slice(startSub, endSub)}</b>;
		substrEnd = suggest.slice(endSub, suggest.length);
	} else {
		substrStart = suggest;
	}

	if (props.title) {
		text = <b>{props.title}</b>;
	}

	function handleClick() {
		DataCtrl.openSearchInNewtab({ query: suggest, logData: { info: "Suggest item click", query: suggest } })
	}

	function handleMouseMove() {
		// refs.searchInput.value = container.query
		DOMCtrl.hideSelected()
		DataCtrl.setSelected(index, false)
		DOMCtrl.showSelected()
	}

	function handleMouseLeave() {
		DOMCtrl.hideSelected()
		DataCtrl.setSelected(-1, false)
	}

	return (
		<div
			className={`${styles.itemInner} ${isCocCoc ? styles.ccBrowser : ""}`}
			dataSet={{ indx: index }}
			onclick={handleClick}
			onmousemove={handleMouseMove}
			onmouseleave={handleMouseLeave}
		>
			{url}
			{substrStart}
			{substrSelected}
			{substrEnd}
			{text}
		</div>
	)
};

export default SuggestItem;
