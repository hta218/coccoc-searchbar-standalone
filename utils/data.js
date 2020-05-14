export const queryType = {
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

export const dataDesktop = {
	optionA: {
		right: {
			class: 'watchMovieBox',
			title: 'Xem phim online thử ngay',
			queries: [
				'Running man',
				'Kẻ cắp mặt trăng 3',
				'Sóng gió chính trường phần 5'
			]
		},
		bottom: [
			{
				class: 'newsBox',
				title: 'Tin tức',
				queries: [
					'AC Milan và ánh bình minh',
					'Nadal',
					'Khởi nghiệp'
				]
			},
			{
				class: 'movieBox',
				title: 'Lịch chiếu phim',
				queries: [
					'CGV - Hùng Vương Plaza',
					'Kẻ ngoại tộc',
					'Rạp quốc gia'
				]
			},
			{
				class: 'shoppingBox',
				title: 'Hàng hóa',
				queries: [
					'iphone 8 plus',
					'samsung galaxy S8',
					'Hạt Chia Úc 500g'
				]
			}
		]
	},
	optionB: {
		right: {
			class: 'carBox',
			title: 'Tìm kiếm xe ôtô',
			queries: [
				'mazda',
				'Ford Ranger',
				'bmw'
			]
		},
		bottom: [
			{
				class: 'soccerBox',
				title: 'Bóng đá',
				queries: [
					'bóng đá',
					'vòng loại afc cup',
					'Argentina vs Venezuela - ngày 06/09/2017'
				]
			},
			{
				class: 'weatherBox',
				title: 'Thời tiết',
				queries: [
					'Thời tiết hôm nay',
					'Thời tiết Đà Nẵng',
					'Thời tiết Hồ Chí Minh ngày mai'
				]
			},
			{
				class: 'locationBox',
				title: 'Tìm kiếm địa điểm',
				queries: [
					'Siêu thị Intimex Giảng Võ',
					'Starbucks',
					'tokyo deli'
				]
			}
		]
	}
};
