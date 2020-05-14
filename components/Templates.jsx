import DataCtrl, { container } from '../controllers/DataCtrl';
import styles from '../styles/Mobile.SearchBar.css';
import { queryType } from '../utils/data';

function Templates() {
	const { queries = [], qaBox } = container.mainPageData

	return (
		<div className={styles.examples}>
			<div className={styles.doMore}>
				<h3>Tìm nhanh đáp gọn với Cốc Cốc</h3>
				<div className={styles.gridItems}>
					<ul>
						{
							queries.map(({ query, type }) => <li key={type}>
								<a
									className={styles.exampleLink}
									onclick={() => DataCtrl.openSearchInNewtab(query)}
								>
									<span className={styles.icon}>
										<img src={require(`../public/img/startscreen/icons/${queryType[type].icon}.svg`)} alt={query} />
									</span>
									<span className={styles.name}>{queryType[type].text}</span>
								</a>
							</li>)
						}
					</ul>
				</div>
			</div>
			<div className={styles.didUK}>
				<h3>Tìm kiếm mẹo với Cốc Cốc Search</h3>
				<a
					className={styles.qaBox}
					onclick={() => DataCtrl.openSearchInNewtab(qaBox.query)}
				>
					<span>{qaBox.query}</span>
				</a>
			</div>
		</div>
	);
}

export default Templates
