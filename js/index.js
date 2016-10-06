mui.init();

mui('.mui-slider').slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui(".mui-bar").on("tap", ".mui-action-menu", function() {
	mui('.mui-off-canvas-wrap').offCanvas('show');
})

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
			el: '.mui-slider-group',
			data: {
				img1: data[0].Image_Url,
				img2: data[1].Image_Url,
				img3: data[2].Image_Url
			}
		})
}; // 轮播图处理函数

ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", getBannerSuccess);