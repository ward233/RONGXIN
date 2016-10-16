//mui功能配置区
mui.init();

//首页轮播图的播放周期设置
mui('#main-slider').slider({
	interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});

//设置标题栏的工具图标点击后打开侧栏
mui(".mui-bar").on("tap", ".mui-action-menu", function() {
	mui('.mui-off-canvas-wrap').offCanvas('show');
});

// 自定义滚动条的滚动系数设置
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});



//新建一个数据库 该数据会在新闻详情和案例详情中用到
var db = openDatabase('RONGXINDB', '1.0', 'Test DB', 20 * 1024 * 1024);

//增强localStorage的功能，让它可以直接操作json对象
var MylocalStorage = {
	setParseItem: function(itemName, itemObjContent) {
		localStorage.setItem(itemName, JSON.stringify(itemObjContent));
	},
	getParseItem: function(itemName) {
		return jQuery.parseJSON(localStorage[itemName]);
	}
};
// ajax的简化函数
var ajaxFunc = function(urlText, successFun, errorFunc, data) {
	jQuery.ajax({
		url: urlText,
		type: "POST",
		dataType: "jsonp", //数据类型为jsonp
		jsonp: "callback", //服务端用于接收callback调用的function名的参数
		data: data || "",
		timeout: 500,
		success: function(data) {
			if (data.length) {
				successFun(data);
			}
		},
		error: errorFunc
	});
};

//以上为初始化区域

//标题模块
var headVm = new Vue({
	el: "#header",
	data: {
		h1Text: "融信科技"
	}
});

//错误显示模块
var errorVm = new Vue({
	el: '#show-error',
	data: {
		show: false,
	}
});

// 底部通用信息模块
var indexFooterVm = new Vue({
	el: '#index-footer',
	data: {
		show: true,
		partnerItems: [], //合作伙伴
		footerInfo: { //底部信息
			address: "暂无数据",
			fax: "暂无数据"
		},
	},
	methods: {
		getPartnerSuccess: function(data) {
			MylocalStorage.setParseItem("partenerData", data);
			this.partnerItems = [data.splice(0, 3), data.splice(0, 3), data.splice(0, 3)];
		},
		getfooterInfoSuccess: function(data) {
			MylocalStorage.setParseItem("footerInfoData", data);
			this.footerInfo.address = data[0].Address;
			this.footerInfo.fax = data[0].Fax;
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetPartner.ashx", this.getPartnerSuccess, this.errorFunc); //合作伙伴处理
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getfooterInfoSuccess, this.errorFunc); //底部信息处理
			} else {
				if (localStorage["partenerData"] && localStorage["footerInfoData"]) {
					this.getPartnerSuccess(MylocalStorage.getParseItem("partenerData"));
					this.getfooterInfoSuccess(MylocalStorage.getParseItem("footerInfoData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	},
	ready: function() {
		this.dataInit();
	}
});

// 首页模块
var mainVm = new Vue({ //主页的vue实例
	el: 'main',
	data: {
		show: true,
		name: '融信科技',
		sliderImgs: [1, 2, 3], //轮播图用的图片 在ajax函数调用之前 页面用的就是这些值
		honorImgs: [], //荣誉图片
		newsItems: [], //新闻动态
		caseItems: [], //典型案例

	},
	methods: {
		getBannerSuccess: function(data) {
			MylocalStorage.setParseItem("bannerData", data);
			this.sliderImgs = data;
		},
		getHonor1Success: function(data) {
			MylocalStorage.setParseItem("honor1Data", data);
			this.honorImgs = [data.splice(0, 4), data];
		},
		getNewsByType: function(data) {
			MylocalStorage.setParseItem("newsType2Data", data);
			this.newsItems = data;
		},
		getCaseSuccess: function(data) {
			MylocalStorage.setParseItem("caseData", data);
			this.caseItems = data;
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", this.getBannerSuccess, this.errorFunc); //轮播图处理
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetHonor1.ashx", this.getHonor1Success, this.errorFunc); //荣誉信息处理
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsByType, this.errorFunc, {
					typeId: 2
				}); //公司动态处理ajax
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCase.ashx", this.getCaseSuccess, this.errorFunc); //成功案例处理
			} else {
				if (localStorage["bannerData"] && localStorage["honor1Data"] && localStorage["newsType2Data"] && localStorage["caseData"]) {
					this.getBannerSuccess(MylocalStorage.getParseItem("bannerData"));
					this.getHonor1Success(MylocalStorage.getParseItem("honor1Data"));
					this.getNewsByType(MylocalStorage.getParseItem("newsType2Data"));
					this.getCaseSuccess(MylocalStorage.getParseItem("caseData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			console.log(this);
			this.show = false;
			errorVm.show = true;
		}
	},
	ready: function() {
		this.dataInit();
	}
});

//关于我们模块
var aboutUsVm = new Vue({
	el: '#about-us',
	data: {
		show: false,
		name: '关于融信',
		companyIntroduction: "",
		companyInfoImg1: "",
		companyInfoImg2: "",
		companyCulture: []
	},
	methods: {
		getAboutUsInfo: function(data) {
			MylocalStorage.setParseItem("aboutUsData", data);
			this.companyInfoImg1 = data[0].Image_Url;
			this.companyInfoImg2 = data[0].CulturPicture_Url;
			this.companyIntroduction = data[0].Introduction.replace(/<[^>]+>/g, "");
			this.companyCulture = data[0].Enterprise_Culture.replace(/<[^>]+>/g, "");
			this.companyCulture = [this.companyCulture.split("").splice(0, 14).join(""), this.companyCulture.split("").splice(14).join("")];
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetInformation.ashx", this.getAboutUsInfo, this.errorFunc);
			} else {
				if (localStorage["aboutUsData"]) {
					this.getAboutUsInfo(MylocalStorage.getParseItem("aboutUsData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//新闻中心模块
var newsCenterVm = new Vue({
	el: "#news-center",
	data: {
		show: false,
		name: '新闻中心',
		newsInfo: [],
	},
	methods: {
		getNewsInfo1: function(data) {
			MylocalStorage.setParseItem("newsInfo1Data", data);
			this.newsInfo = this.newsInfo.concat(data.splice(2));
		},
		getNewsInfo2: function(data) {
			MylocalStorage.setParseItem("newsInfo2Data", data);
			this.newsInfo = this.newsInfo.concat(data);
		},
		dataInit: function() {
 			this.newsInfo = [];
			if (navigator.onLine) {

				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo1, this.errorFunc, {
					typeId: 2
				});
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo2, this.errorFunc, {
					typeId: 1
				});
			} else {
				if (localStorage["newsInfo1Data"] && localStorage["newsInfo2Data"]) {
					this.getNewsInfo1(MylocalStorage.getParseItem("newsInfo1Data"));
					this.getNewsInfo2(MylocalStorage.getParseItem("newsInfo2Data"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//企业服务模块
var companyServiceVm = new Vue({
	el: "#company-service",
	data: {
		show: false,
		name: '公司服务',
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
			MylocalStorage.setParseItem("serviceInfoData", data);
			this.serviceText = [];
			for (var i = 0; i < 3; i++) {
				this.serviceBackImg[i.toString()] = data[i].Image_Url;
				this.serviceText.push({
					title: data[i].Title,
					content: data[i].Content.replace(/<[^>]+>/g, "")
				});
			}
		},
		getSelectInfo: function(data) {
			MylocalStorage.setParseItem("selectInfoData", data);
			this.serviceText2 = [];
			for (var i = 0; i < 3; i++) {
				this.serviceText2.push({
					title: data[i].Title,
					content: data[i].Content.replace(/<[^>]+>/g, "")
				});
			}
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/service_InfoImg.ashx", this.getServiceInfo, this.errorFunc);
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/select_InfoNoimg.ashx", this.getSelectInfo, this.errorFunc);
			} else {
				if (localStorage["serviceInfoData"] && localStorage["selectInfoData"]) {
					this.getServiceInfo(MylocalStorage.getParseItem("serviceInfoData"));
					this.getSelectInfo(MylocalStorage.getParseItem("selectInfoData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//企业案例模块
var companyCaseVm = new Vue({
	el: '#company-cases',
	data: {
		show: false,
		name: '典型案例',
		caseItems: [],
	},
	methods: {
		getCases: function(data) {
			MylocalStorage.setParseItem("casePageData", data);
			this.caseItems = data;
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCaseAll.ashx", this.getCases, this.errorFunc);
			} else {
				if (localStorage["casePageData"]) {
					this.getCases(MylocalStorage.getParseItem("casePageData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//加入我们模块
var joinUsVm = new Vue({
	el: "#join-us",
	data: {
		show: false,
		name: '人才招聘',
		jobItems: [],
	},
	methods: {
		getJob: function(data) {
			MylocalStorage.setParseItem("jobData", data);
			this.jobItems = data.splice(1);
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetJob.ashx", this.getJob, this.errorFunc);
			} else {
				if (localStorage["jobData"]) {
					this.getJob(MylocalStorage.getParseItem("jobData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

// 联系我们模块
var contactUsVm = new Vue({
	el: "#contact-us",
	data: {
		show: false,
		name: '联系我们',
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
			MylocalStorage.setParseItem("contactData", data);
			this.contactInfo = data;
		},
		dataInit: function() {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getContactInfo, this.errorFunc);
			} else {
				if (localStorage["contactData"]) {
					this.getContactInfo(MylocalStorage.getParseItem("contactData"));
				} else {
					this.show = false;
					errorVm.show = true;
				}
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//新闻详情模块
var newsDetailVm = new Vue({
	el: "#news-detail",
	data: {
		show: false,
		name: '新闻详情',
		newsDetailContent: [],
		prevName: "",
	},
	init: function() {
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS news (typeId, content)');
		});
	},
	methods: {
		getNewsDetailContent: function(data) {
			this.newsDetailContent = data[0];
			that = this;
			db.transaction(function(tx) {
				tx.executeSql('DELETE FROM News where typeId = ' + that.newsDetailContent.Id);
				tx.executeSql("INSERT INTO News (typeId, content) values(?,?)", [that.newsDetailContent.Id, JSON.stringify(that.newsDetailContent)]);
			});
			this.newsDetailContent.Create_Time = this.newsDetailContent.Create_Time.split('T')[0];
		},
		dataInitByType: function(typeId) {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsDetail.ashx", this.getNewsDetailContent, this.errorFunc, {
					Id: typeId
				});
			} else {
				that = this;
				db.transaction(function(tx) {
					tx.executeSql('SELECT * FROM News where typeId=' + typeId, [], function(tx, results) {
						if (results.rows.length) {
							that.getNewsDetailContent([jQuery.parseJSON(results.rows[0].content)]);
						} else {
							that.show = false;
							errorVm.show = true;
						}
					}, null);
				});
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//案例详情模块
var caseDetailVm = new Vue({
	el: "#case-detail",
	data: {
		show: false,
		name: '案例详情',
		caseDetailContent: [],
		prevName: ""
	},
	init: function() {
		//典型案例的数据表创建语句
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS cases (typeId, content)');
		});
	},
	methods: {
		getcaseDetailContent: function(data) {
			this.caseDetailContent = data[0];
			var that = this;
			db.transaction(function(tx) {
				tx.executeSql('DELETE FROM cases where typeId = ' + that.caseDetailContent.Id);
				tx.executeSql("INSERT INTO cases (typeId, content) values(?,?)", [that.caseDetailContent.Id, JSON.stringify(that.caseDetailContent)]);
			});
			that.caseDetailContent.Create_Time = that.caseDetailContent.Create_Time.split('T')[0];

		},
		dataInitByType: function(typeId) {
			if (navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCaseById.ashx", this.getcaseDetailContent, this.errorFunc, {
					Id: typeId
				});
			} else {
				var that = this;
				db.transaction(function(tx) {

					tx.executeSql('SELECT * FROM cases where typeId=' + typeId, [], function(tx, results) {

						if (results.rows.length) {
							that.getcaseDetailContent([jQuery.parseJSON(results.rows[0].content)]);
						} else {
							that.show = false;
							errorVm.show = true;
						}

					}, null);
				});
			}
		},
		errorFunc: function() {
			this.show = false;
			errorVm.show = true;
		}
	}
});

//模块名与模块的映射表
var controlShow = {
	"融信科技": mainVm,
	"关于融信": aboutUsVm,
	"新闻中心": newsCenterVm,
	"公司服务": companyServiceVm,
	"典型案例": companyCaseVm,
	"人才招聘": joinUsVm,
	"联系我们": contactUsVm,
	"新闻详情": newsDetailVm,
	'案例详情': caseDetailVm
};

//给每个模块设置当模块的show为true时 模块数据初始化 标题名改变
Object.keys(controlShow).forEach(function(element, index) {
	controlShow[element].$watch('show', function(show) {
		if (show === true) {
			mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0, 0, 0);
			(this.dataInit && this.dataInit()); //如果模块有初始化方法 就初始化。
			headVm.h1Text = this.name;
		}
	});
});

//观察标题栏标题的变化从而动态改变侧栏活动栏的样式
headVm.$watch('h1Text', function(val) {
	jQuery('.mui-off-canvas-left .mui-table-view-cell').filter(function() {
		jQuery(this).removeClass('menu-active');
		return jQuery.trim(jQuery(this).text()) === val;
	}).addClass('menu-active');
});

//侧栏切换功能语句
mui(".mui-off-canvas-left").on("tap", ".mui-table-view-cell", function(event) {
	mui('.mui-off-canvas-wrap').offCanvas().close();
	if (jQuery("#header-menu").hasClass('mui-icon-arrowleft')) {
		jQuery("#header-menu").removeClass("mui-icon-arrowleft").addClass("mui-action-menu");
	}
	var activeVmText = headVm.h1Text;
	var wantshowVmText = event.target.innerText;
	controlShow[activeVmText].show = false;
	controlShow[wantshowVmText].show = true;
});

var showDetail = function(className, modelVm) {
	mui(className).on("tap", "a", function(event) {

		modelVm.prevName = jQuery.trim(jQuery('.menu-active').text());
		modelVm.dataInitByType(event.target.getAttribute('data-id'));
		controlShow[modelVm.prevName].show = false;
		modelVm.show = true;
		jQuery("#header-menu").removeClass("mui-action-menu").addClass("mui-icon-arrowleft");
	});
};

showDetail(".news-list", newsDetailVm);
showDetail(".case-list", caseDetailVm);

mui(".mui-bar").on("tap", ".mui-icon-arrowleft", function() {
	controlShow[headVm.h1Text].show = false;
	controlShow[controlShow[headVm.h1Text].prevName].show = true;
	jQuery("#header-menu").removeClass("mui-icon-arrowleft").addClass("mui-action-menu");
});

jQuery('#header .mui-spinner').hide();
jQuery(document).ajaxStart(function() {
	jQuery('#header .mui-spinner').show(0);
});
jQuery(document).ajaxStop(function() {
	jQuery('#header .mui-spinner').hide(0);
});
