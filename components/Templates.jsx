import DataCtrl, { container } from '../controllers/DataCtrl';
import styles from '../styles/Mobile.SearchBar.css';

const queryType = {
	math: { icon: 'iconMath', text: 'Toán học' },
	chemistry: { icon: 'iconChemistry', text: 'Hóa học' },
	currency: { icon: 'iconCurrency', text: 'Tiền tệ' },
	weather: { icon: 'iconWeather', text: 'Thời tiết' },
	news: { icon: 'iconNews', text: 'Tin tức' },
	soccer: { icon: 'iconSport', text: 'Bóng đá' },
	movies: { icon: 'iconMovies', text: 'Xem phim' },
	horoscope: { icon: 'iconHoroscope', text: 'Cung hoàng đạo' },
	lunar_horoscope: { icon: 'iconLunarHoroscope', text: 'Tử vi' },
	unit_converter: { icon: 'iconConvertor', text: 'Đổi đơn vị' },
	qa_box: { icon: 'iconQABox', text: 'Hỏi đáp' },
	lottery: { icon: 'iconEvents', text: 'Xổ số' },
	lunar_calendar: { icon: 'iconLunar', text: 'Âm lịch' },
	corona_virus: { icon: 'iconCoronaVirus', text: 'Covid-19' }
};

function Templates() {
	const { queries = [], qaBox } = container.mainPageData

	function handleClick({ query, qrType }) {
		DataCtrl.openSearchInNewtab({ query, logData: { info: "Example query click", qrType } })
	}

	return (
		<div className={styles.examples}>
			<div className={styles.doMore}>
				<h3>Tìm nhanh đáp gọn với Cốc Cốc</h3>
				<div className={styles.gridItems}>
					<ul>
						{
							queries.map(({ query, type }) => <li key={type}>
								<a onclick={() => handleClick({ query, qrType: type })}>
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
					onclick={() => handleClick({ query: qaBox.query, qrType: qaBox.type })}
				>
					<span>{qaBox.query}</span>
				</a>
			</div>
		</div>
	);
}

export default Templates
