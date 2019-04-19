const app = getApp();
Page({
	data: {

		star: ['1', '2', '3', '4', '5'],//星星
		obj: [],//星座名
		objMsg: [],//今日星座运势
		bojdis: [],//星座描述
		showCon: false,//是否展示星座
		showBtn: false,//是否展示按钮
		dataName: "本周",//何时的运势
		list: [//星座集合
			{
				"astroid": "1",
				"astroname": "白羊座",
				"date": "3.21~4.19",
				"pic": "../../images/xingzuo1.png"
			},
			{
				"astroid": "2",
				"astroname": "金牛座",
				"date": "4.20~5.20",
				"pic": "../../images/xingzuo2.png"
			},
			{
				"astroid": "3",
				"astroname": "双子座",
				"date": "5.21~6.21",
				"pic": "../../images/xingzuo3.png"
			},
			{
				"astroid": "4",
				"astroname": "巨蟹座",
				"date": "6.22~7.22",
				"pic": "../../images/xingzuo4.png"
			},
			{
				"astroid": "5",
				"astroname": "狮子座",
				"date": "7.23~8.22",
				"pic": "../../images/xingzuo5.png"
			},
			{
				"astroid": "6",
				"astroname": "处女座",
				"date": "8.23~9.22",
				"pic": "../../images/xingzuo6.png"
			},
			{
				"astroid": "7",
				"astroname": "天秤座",
				"date": "9.23~10.23",
				"pic": "../../images/xingzuo7.png"
			},
			{
				"astroid": "8",
				"astroname": "天蝎座",
				"date": "10.24~11.22",
				"pic": "../../images/xingzuo8.png"
			},
			{
				"astroid": "9",
				"astroname": "射手座",
				"date": "11.23~12.21",
				"pic": "../../images/xingzuo9.png"
			},
			{
				"astroid": "10",
				"astroname": "摩羯座",
				"date": "12.22~1.19",
				"pic": "../../images/xingzuo10.png"
			},
			{
				"astroid": "11",
				"astroname": "水瓶座",
				"date": "1.20~2.18",
				"pic": "../../images/xingzuo11.png"
			},
			{
				"astroid": "12",
				"astroname": "双鱼座",
				"date": "2.19~3.20",
				"pic": "../../images/xingzuo12.png"
			}
		]
	},
	onLoad: function (e) {

		this.setData({
			xingzuo: e.id,
		})
		app.getList(this, e.id)
	},
	onReady: function () {
		// Do something when page ready.
	},
	onShow: function () {

		// Do something when page show.
	},
	onHide: function () {
		// Do something when page hide.
	},
	onUnload: function () {
		// Do something when page close.
	},
	onPullDownRefresh: function () {
		// Do something when pull down.
	},
	onReachBottom: function () {
		// Do something when page reach bottom.
	},
	onShareAppMessage: function () {
		// return custom share data when user share.
	},
	showMsg(e) {
		this.setData({
			showBtn: !this.data.showBtn,
			setDay: true
		})
	},
	showCon(e) {

		this.setData({
			showCon: !this.data.showCon,
		})
	},
	showConno(e) {

	},
	setDay(e) {
		let that = this;
		this.setData({
			showBtn: !this.data.showBtn,
			setDay: true
		})
		swan.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
		switch (e.currentTarget.dataset.id) {

			case '0':
				that.setData({
					objMsg: that.data.obj.today,
					bojdis: that.data.obj.week,
					dataName: "本周",
				})
				break;
			case '1':
				that.setData({
					objMsg: that.data.obj.today,
					bojdis: that.data.obj.week,
					dataName: "本周",
				})
				break;
			case '2':
				that.setData({
					objMsg: that.data.obj.today,
					bojdis: that.data.obj.month,
					dataName: "本月",
				})
				break;
			case '3':
				that.setData({
					objMsg: that.data.obj.today,
					bojdis: that.data.obj.year,
					dataName: "本年",
				})
				break;
			case '4':
				that.setData({
					objMsg: that.data.obj.tomorrow,
					bojdis: that.data.obj.week,
					dataName: "本周",
				})
				break;
		}
	},
	goInfo(e) {
		swan.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
		this.setData({
			showCon: !this.data.showCon,
		})
		app.getList(this, e.currentTarget.dataset.id)
	}

});