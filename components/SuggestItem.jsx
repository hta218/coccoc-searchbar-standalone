import escapeRegExp from 'lodash/escapeRegExp';
import DataCtrl, { container } from '../controllers/DataCtrl';
import styles from '../styles/SuggestItem.css';

const SuggestItem = props => {
	const { suggest } = props;
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
		DataCtrl.openSearchInNewtab(suggest)
	}

	return (
		<div
			className={styles.itemInner}
			onclick={handleClick}
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
