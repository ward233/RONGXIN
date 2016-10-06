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



var getBannerSuccess = function(data) {
	new Vue({
		el: '#main-slider',
		data: {
			imgs: data
		}
	})
}; // 轮播图处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", getBannerSuccess);

var getHonor1Success = function(data) {
	new Vue({
		el: '#company-honor',
		data: {
			items: [data.splice(0, 4), data]
		}
	});
}; // 资质荣誉处理函数
ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetHonor1.ashx", getHonor1Success);

var GetNewsByType = function(data) {
	new Vue({
		el: '#company-news',
		data: {
			items: data
		}
	});
}; //公司动态处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", GetNewsByType, {
	typeId: 2
}); //公司动态处理ajax

var getCaseSuccess = function(data) {
	new Vue({
		el: '#company-cases',
		data: {
			items: data
		}
	});
}; //典型案例处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCase.ashx", getCaseSuccess); //典型案例处理ajax

var getPartnerSuccess = function(data) {
	new Vue({
		el: '#company-partners',
		data: {
			itemsData: [data.splice(0, 3), data.splice(0, 3), data.splice(0, 3)]
		}
	});
}; //合作伙伴处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetPartner.ashx", getPartnerSuccess); //合作伙伴处理ajax

var getContentSuccess = function(data) {
	new Vue({
		el: '.main-footer',
		data: {
			address: data[0].Address,
			fax: data[0].Fax
		}
	});
}; //地址和传真处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", getContentSuccess); // 地址和传真ajax

