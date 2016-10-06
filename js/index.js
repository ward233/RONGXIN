mui.init();

mui('#main-slider').slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui(".mui-bar").on("tap", ".mui-action-menu", function() {
	mui('.mui-off-canvas-wrap').offCanvas('show');
})

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});


var ajaxFunc = function(urlText, successFun, data) {
	$.ajax({
		url: urlText,
		type: "POST",
		dataType: "jsonp", //数据类型为jsonp
		jsonp: "callback", //服务端用于接收callback调用的function名的参数
		data: data ? data : "",
		timeout: 5000,
		success: successFun
	});
}; // ajax简化函数

var mainVm = new Vue({
	el: 'main',
	data: {
		sliderImgs:[1,2,3], //在ajax函数调用之前 页面用的就是这些值
		honorImgs: [],
		newsItems: [],
		caseItems: [],
		partnerItems: [],
		footerInfo: {address: "",fax: ""},
	},
	methods: {
		getBannerSuccess: function(data) {
			this.sliderImgs = data;
		},
		getHonor1Success: function(data) {
			this.honorImgs = [data.splice(0, 4), data];
		},
		getNewsByType: function(data) {
			this.newsItems = data;
		},
		getCaseSuccess: function(data) {
			this.caseItems = data;
		},
		getPartnerSuccess: function(data) {
			this.partnerItems = [data.splice(0, 3), data.splice(0, 3), data.splice(0, 3)];
		},
		getfooterInfoSuccess: function(data) {
			this.footerInfo.address = data[0].Address;
			this.footerInfo.fax = data[0].Fax;
		}
	}
});
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", mainVm.getBannerSuccess); //轮播图处理
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetHonor1.ashx", mainVm.getHonor1Success); //荣誉信息处理
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", mainVm.getNewsByType, {
	typeId: 2
}); //公司动态处理ajax
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCase.ashx", mainVm.getCaseSuccess); //成功案例处理
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetPartner.ashx", mainVm.getPartnerSuccess); //合作伙伴处理
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", mainVm.getfooterInfoSuccess); //底部信息处理
