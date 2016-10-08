mui.init();

mui('#main-slider').slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui(".mui-bar").on("tap", ".mui-action-menu", function() {
	mui('.mui-off-canvas-wrap').offCanvas('show');
});

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

var ajaxFunc = function(urlText, successFun, data) {
	jQuery.ajax({
		url: urlText,
		type: "POST",
		dataType: "jsonp", //数据类型为jsonp
		jsonp: "callback", //服务端用于接收callback调用的function名的参数
		data: data || "",
		timeout: 5000,
		success: successFun
	});
}; // ajax简化函数
var headVm = new Vue({
	el: "#header",
	data: {
		h1Text: "融信科技"
	}
});

headVm.$watch('h1Text', function(val) {
	jQuery('.mui-off-canvas-left .mui-table-view-cell').filter(function() {
		jQuery(this).removeClass('menu-active');
		return jQuery.trim(jQuery(this).text()) === val;
	}).addClass('menu-active');
});

var indexFooterVm = new Vue({
	el: '#index-footer',
	data: {
		partnerItems: [], //合作伙伴
		footerInfo: { //底部信息
			address: "",
			fax: ""
		},
	},
	methods: {
		getPartnerSuccess: function(data) {
			this.partnerItems = [data.splice(0, 3), data.splice(0, 3), data.splice(0, 3)];
		},
		getfooterInfoSuccess: function(data) {
			this.footerInfo.address = data[0].Address;
			this.footerInfo.fax = data[0].Fax;
		},
	},
	created: function() {
		ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetPartner.ashx", this.getPartnerSuccess); //合作伙伴处理
		ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getfooterInfoSuccess); //底部信息处理
	}
});

var mainVm = new Vue({ //主页的vue实例
	el: 'main',
	data: {
		show: true,
		sliderImgs: [1, 2, 3], //轮播图用的图片 在ajax函数调用之前 页面用的就是这些值 
		honorImgs: [], //荣誉图片
		newsItems: [], //新闻动态
		caseItems: [], //典型案例

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

		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", this.getBannerSuccess); //轮播图处理
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetHonor1.ashx", this.getHonor1Success); //荣誉信息处理
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsByType, {
				typeId: 2
			}); //公司动态处理ajax
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCase.ashx", this.getCaseSuccess); //成功案例处理

		}
	}
});
mainVm.dataInit();

var aboutUsVm = new Vue({
	el: '#about-us',
	data: {
		show: false,
		companyIntroduction: "",
		companyInfoImg1: "",
		companyInfoImg2: "",
		companyCulture: []
	},
	methods: {
		getAboutUsInfo: function(data) {
			this.companyInfoImg1 = data[0].Image_Url;
			this.companyInfoImg2 = data[0].CulturPicture_Url;

			this.companyIntroduction = data[0].Introduction.replace(/<[^>]+>/g, "");
			this.companyCulture = data[0].Enterprise_Culture.replace(/<[^>]+>/g, "");
			this.companyCulture = [this.companyCulture.split("").splice(0, 14).join(""), this.companyCulture.split("").splice(14).join("")];

		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetInformation.ashx", this.getAboutUsInfo);
		}
	}
});
aboutUsVm.dataInit();

var newsCenterVm = new Vue({
	el: "#news-center",
	data: {
		show: false,
		newsInfo: [],
	},
	methods: {
		getNewsInfo1: function(data) {
			this.newsInfo = this.newsInfo.concat(data.splice(2));
		},
		getNewsInfo2: function(data) {
			this.newsInfo = this.newsInfo.concat(data);
		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo1, {
				typeId: 2
			})
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo2, {
				typeId: 1
			})
		}
	}
});
newsCenterVm.dataInit();

var companyServiceVm = new Vue({
	el: "#company-service",
	data: {
		show: false,
		serviceBackImg: {
			"0": "",
			"1": "",
			"2": ""
		},
		serviceText: [{
			title: "",
			content: ""
		}, {
			title: "",
			content: ""
		}, {
			title: "",
			content: ""
		}],
		serviceText2: [{
			title: "",
			content: ""
		}, {
			title: "",
			content: ""
		}, {
			title: "",
			content: ""
		}]
	},
	methods: {
		getServiceInfo: function(data) {
			this.serviceText = [];
			for(var i = 0; i < 3; i++) {
				this.serviceBackImg[i.toString()] = data[i].Image_Url;
				this.serviceText.push({
					title: data[i].Title,
					content: data[i].Content.replace(/<[^>]+>/g, "")
				});
			}
		},
		getSelectInfo: function(data) {
			this.serviceText2 = [];
			for(var i = 0; i < 3; i++) {
				this.serviceText2.push({
					title: data[i].Title,
					content: data[i].Content.replace(/<[^>]+>/g, "")
				});
			}
		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/service_InfoImg.ashx", this.getServiceInfo);
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/select_InfoNoimg.ashx", this.getSelectInfo);
		}
	}
});
companyServiceVm.dataInit();

var companyCaseVm = new Vue({
	el: '#company-cases',
	data: {
		show: false,
		caseItems: [],
	},
	methods: {
		getCases: function(data) {
			this.caseItems = data;
		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCaseAll.ashx", this.getCases);
		}
	}
});
companyCaseVm.dataInit();
var joinUsVm = new Vue({
	el: "#join-us",
	data: {
		show: false,
		jobItems: [],
	},
	methods: {
		getJob: function(data) {
			this.jobItems = data.splice(1);

		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetJob.ashx", this.getJob);
		}
	}
})
joinUsVm.dataInit();

var contactUsVm = new Vue({
	el: "#contact-us",
	data: {
		show: false,
		contactInfo: [{
			Company_Name: "",
			Address: "",
			Url: "",
			Contact: "",
			Phone: "",
			Fax: "",
			PostCodes: "",
			Mail: ""
		}]
	},
	methods: {
		getContactInfo: function(data) {
			this.contactInfo = data;
		},
		dataInit: function() {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getContactInfo);
		}
	},
	created: function() {

	}
})
contactUsVm.dataInit();
mui(".mui-off-canvas-left").on("tap", ".mui-table-view-cell", function(event) {
	var controlShow = {
		"官方首页": mainVm,
		"关于融信": aboutUsVm,
		"新闻中心": newsCenterVm,
		"公司服务": companyServiceVm,
		"典型案例": companyCaseVm,
		"人才招聘": joinUsVm,
		"联系我们": contactUsVm
	}
	controlShow[jQuery.trim(jQuery('.menu-active').text())].show = false;
	controlShow[event.target.innerText].show = true;
	headVm.h1Text = event.target.innerText;
	mui('.mui-off-canvas-wrap').offCanvas().close();

});

