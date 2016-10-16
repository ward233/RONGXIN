mui.init();

function LocalStorage() {

	/**
	 * 将json对象存储为json字面量
	 * @param {String} itemName       json对象的标示名
	 * @param {Object} itemObjContent 要存放的json对象
	 */
	this.setParseItem = function(itemName, itemObjContent) {
		localStorage.setItem(itemName, JSON.stringify(itemObjContent));
	};

	/**
	 * 得到由json字面量转化而来的json对象
	 * @param  {String} itemName
	 * @return {Object}          要取出的json对象
	 */
	this.getParseItem = function(itemName) {
		return jQuery.parseJSON(localStorage[itemName]);
	};

	/**
	 * 删除某个的信息
	 * @param  {String} itemName
	 */
	this.removeItem = function(itemName) {
		localStorage.removeItem(itemName);
	};
}

var MylocalStorage = new LocalStorage();

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

var errorVm = new Vue({
	el: '#show-error',
	data: {
		show: false,
	}
});

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
			if(data.length) {
				MylocalStorage.setParseItem("partenerData", data);
				this.partnerItems = [data.splice(0, 3), data.splice(0, 3), data.splice(0, 3)];
			}
		},
		getfooterInfoSuccess: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("footerInfoData", data);
				this.footerInfo.address = data[0].Address;
				this.footerInfo.fax = data[0].Fax;
			}
		},
	},
	created: function() {
		if(navigator.onLine) {
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetPartner.ashx", this.getPartnerSuccess); //合作伙伴处理
			ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getfooterInfoSuccess); //底部信息处理

		} else {
			if(localStorage["partenerData"] && localStorage["footerInfoData"]) {
				console.log(MylocalStorage.getParseItem("partenerData"));
				this.getPartnerSuccess(MylocalStorage.getParseItem("partenerData"));
				this.getfooterInfoSuccess(MylocalStorage.getParseItem("footerInfoData"));
			} else {

				this.show = false;
				errorVm.show = true;

			}

		}
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
			if(data.length) {
				MylocalStorage.setParseItem("bannerData", data);
				this.sliderImgs = data;
			} else {

			}

		},
		getHonor1Success: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("honor1Data", data);
				this.honorImgs = [data.splice(0, 4), data];
			} else {

			}

		},
		getNewsByType: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("newsType2Data", data);
				this.newsItems = data;
			} else {

			}

		},
		getCaseSuccess: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("caseData", data);
				this.caseItems = data;
			} else {

			}

		},

		dataInit: function() {
			if(navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetBanner.ashx", this.getBannerSuccess); //轮播图处理
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetHonor1.ashx", this.getHonor1Success); //荣誉信息处理
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsByType, {
					typeId: 2
				}); //公司动态处理ajax
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCase.ashx", this.getCaseSuccess); //成功案例处理
			} else {
				if(localStorage["bannerData"] && localStorage["honor1Data"] && localStorage["newsType2Data"] && localStorage["caseData"]) {
					this.getBannerSuccess(MylocalStorage.getParseItem("bannerData"));
					this.getHonor1Success(MylocalStorage.getParseItem("honor1Data"));
					this.getNewsByType(MylocalStorage.getParseItem("newsType2Data"));
					this.getCaseSuccess(MylocalStorage.getParseItem("caseData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}
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
			if(data.length) {

				MylocalStorage.setParseItem("aboutUsData", data);
				this.companyInfoImg1 = data[0].Image_Url;
				this.companyInfoImg2 = data[0].CulturPicture_Url;

				this.companyIntroduction = data[0].Introduction.replace(/<[^>]+>/g, "");
				this.companyCulture = data[0].Enterprise_Culture.replace(/<[^>]+>/g, "");
				this.companyCulture = [this.companyCulture.split("").splice(0, 14).join(""), this.companyCulture.split("").splice(14).join("")];
			} else {

			}

		},
		dataInit: function() {
			if(navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetInformation.ashx", this.getAboutUsInfo);
			} else {
				if(localStorage["aboutUsData"]) {

					this.getAboutUsInfo(MylocalStorage.getParseItem("aboutUsData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}
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
			if(data.length) {
				MylocalStorage.setParseItem("newsInfo1Data", data);
				this.newsInfo = this.newsInfo.concat(data.splice(2));

			} else {

			}

		},
		getNewsInfo2: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("newsInfo2Data", data);
				this.newsInfo = this.newsInfo.concat(data);
			} else {

			}

		},
		dataInit: function() {
			if(navigator.onLine) {

				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo1, {
					typeId: 2
				});
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsByType.ashx", this.getNewsInfo2, {
					typeId: 1
				});
			} else {
				if(localStorage["newsInfo1Data"] && localStorage["newsInfo2Data"]) {
					this.getNewsInfo1(MylocalStorage.getParseItem("newsInfo1Data"));
					this.getNewsInfo2(MylocalStorage.getParseItem("newsInfo2Data"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}
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
			if(data.length) {
				MylocalStorage.setParseItem("serviceInfoData", data);
				this.serviceText = [];
				for(var i = 0; i < 3; i++) {
					this.serviceBackImg[i.toString()] = data[i].Image_Url;
					this.serviceText.push({
						title: data[i].Title,
						content: data[i].Content.replace(/<[^>]+>/g, "")
					});
				}
			} else {
				console.log("数据错误");
			}

		},
		getSelectInfo: function(data) {
			if(data.length) {
				MylocalStorage.setParseItem("selectInfoData", data);
				this.serviceText2 = [];
				for(var i = 0; i < 3; i++) {
					this.serviceText2.push({
						title: data[i].Title,
						content: data[i].Content.replace(/<[^>]+>/g, "")
					});
				}
			} else {
				console.log("数据错误");
			}
		},
		dataInit: function() {
			if(navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/service_InfoImg.ashx", this.getServiceInfo);
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/select_InfoNoimg.ashx", this.getSelectInfo);

			} else {
				if(localStorage["serviceInfoData"] && localStorage["selectInfoData"]) {
					this.getServiceInfo(MylocalStorage.getParseItem("serviceInfoData"));
					this.getSelectInfo(MylocalStorage.getParseItem("selectInfoData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}

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
			if(data.length) {
				MylocalStorage.setParseItem("casePageData", data);
				this.caseItems = data;

			} else {
				console.log("数据错误");
			}

		},
		dataInit: function() {
			if(navigator.onLine) {

				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCaseAll.ashx", this.getCases);

			} else {
				if(localStorage["casePageData"]) {
					this.getCases(MylocalStorage.getParseItem("casePageData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}

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
			if(data.length) {
				MylocalStorage.setParseItem("jobData", data);
				this.jobItems = data.splice(1);

			} else {

			}

		},
		dataInit: function() {
			if(navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetJob.ashx", this.getJob);

			} else {
				if(localStorage["jobData"]) {
					this.getJob(MylocalStorage.getParseItem("jobData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}

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
			if(data.length) {
				MylocalStorage.setParseItem("contactData", data);
				this.contactInfo = data;

			} else {

			}

		},
		dataInit: function() {
			if(navigator.onLine) {

				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetContent.ashx", this.getContactInfo);

			} else {
				if(localStorage["contactData"]) {
					this.getContactInfo(MylocalStorage.getParseItem("contactData"));
				} else {

					this.show = false;
					errorVm.show = true;

				}
			}

		}
	}
});
contactUsVm.dataInit();

//数据库测试区
var db = openDatabase('testDB', '1.0', 'Test DB', 20 * 1024 * 1024);
db.transaction(function(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS news (typeId, content)');
});
var newsDetailVm = new Vue({
	el: "#news-detail",
	data: {
		show: false,
		newsDetailContent: [],
		prevName: "",
	},
	methods: {
		getNewsDetailContent: function(data) {
			if(data.length) {
				this.newsDetailContent = data[0];
				that = this;
				db.transaction(function(tx) {
					tx.executeSql('DELETE FROM News where typeId = ' + that.newsDetailContent.Id);
					tx.executeSql("INSERT INTO News (typeId, content) values(?,?)", [that.newsDetailContent.Id, JSON.stringify(that.newsDetailContent)]);
				});
				this.newsDetailContent.Create_Time = this.newsDetailContent.Create_Time.split('T')[0];
			} else {

			}

		},
		dataInit: function(typeId) {
			if(navigator.onLine) {

				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetNewsDetail.ashx", this.getNewsDetailContent, {
					Id: typeId
				});
			} else {
				that = this;
				db.transaction(function(tx) {

					tx.executeSql('SELECT * FROM News where typeId=' + typeId, [], function(tx, results) {

						if(results.rows.length) {
							that.getNewsDetailContent([jQuery.parseJSON(results.rows[0].content)]);
						} else {
							that.getNewsDetailContent("");
						}

					}, null);
				});
			}

		}
	}
});
db.transaction(function(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS cases (typeId, content)');
});
var caseDetailVm = new Vue({
	el: "#case-detail",
	data: {
		show: false,
		caseDetailContent: [],
		prevName: ""
	},
	methods: {
		getcaseDetailContent: function(data) {
			if(data.length) {
				this.caseDetailContent = data[0];

				that = this;
				db.transaction(function(tx) {
					tx.executeSql('DELETE FROM cases where typeId = ' + that.caseDetailContent.Id);
					tx.executeSql("INSERT INTO cases (typeId, content) values(?,?)", [that.caseDetailContent.Id, JSON.stringify(that.caseDetailContent)]);
				});

				that.caseDetailContent.Create_Time = that.caseDetailContent.Create_Time.split('T')[0];
			} else {

			}

		},
		dataInit: function(typeId) {
			if(navigator.onLine) {
				ajaxFunc("http://www.zjrxkj.com.cn/Ajax/GetCaseById.ashx", this.getcaseDetailContent, {
					Id: typeId
				});
			} else {
				that = this;
				db.transaction(function(tx) {

					tx.executeSql('SELECT * FROM cases where typeId=' + typeId, [], function(tx, results) {

						if(results.rows.length) {
							that.getcaseDetailContent([jQuery.parseJSON(results.rows[0].content)]);
						} else {
							that.getcaseDetailContent("");
						}

					}, null);
				});
			}
		}
	}
});

var controlShow = {
	"官方首页": mainVm,
	"关于融信": aboutUsVm,
	"新闻中心": newsCenterVm,
	"公司服务": companyServiceVm,
	"典型案例": companyCaseVm,
	"人才招聘": joinUsVm,
	"联系我们": contactUsVm,
	"新闻详情": newsDetailVm,
}

mui(".mui-off-canvas-left").on("tap", ".mui-table-view-cell", function(event) {

	controlShow[jQuery.trim(jQuery('.menu-active').text())].show = false;
	controlShow[event.target.innerText].show = true;
	headVm.h1Text = event.target.innerText;
	mui('.mui-off-canvas-wrap').offCanvas().close();

});
mui(".news-list").on("tap", "a", function(event) {

	newsDetailVm.prevName = jQuery.trim(jQuery('.menu-active').text());
	newsDetailVm.dataInit(event.target.getAttribute('data-id'));
	controlShow[newsDetailVm.prevName].show = false;
	newsDetailVm.show = true;
	jQuery("#header-menu").removeClass("mui-action-menu").addClass("mui-icon-arrowleft");
	headVm.h1Text = "新闻详情";
});
mui(".mui-bar").on("tap", ".mui-icon-arrowleft", function() {
	if(headVm.h1Text === "新闻详情") {
		newsDetailVm.show = false;
		headVm.h1Text = newsDetailVm.prevName;
		controlShow[newsDetailVm.prevName].show = true;

	} else {
		caseDetailVm.show = false;
		headVm.h1Text = caseDetailVm.prevName;
		controlShow[caseDetailVm.prevName].show = true;
	}
	jQuery("#header-menu").removeClass("mui-icon-arrowleft").addClass("mui-action-menu");

});
mui(".case-list").on("tap", "a", function(event) {

	caseDetailVm.prevName = jQuery.trim(jQuery('.menu-active').text());
	caseDetailVm.dataInit(event.target.getAttribute('data-id'));
	controlShow[caseDetailVm.prevName].show = false;
	caseDetailVm.show = true;
	jQuery("#header-menu").removeClass("mui-action-menu").addClass("mui-icon-arrowleft");
	headVm.h1Text = "案例详情";
});