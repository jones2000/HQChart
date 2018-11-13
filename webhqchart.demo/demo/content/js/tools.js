Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/*公共方法*/
var Common = {
    formatDate: function (_date, format) {
        if (!_date) return "";

        if (!format) format = "yyyy-MM-dd";

        var date = _date + "";
        if (date.length != 8)
            return date;

        return new Date(date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)).Format(format);
    },
    formatBillion: function (num) {
        if (!num) return "";

        var result = "";

        var strValue = num + "";
        var negative = "";
        var _decimal = "";


        if (strValue.indexOf(".") > -1) {
            var temp = strValue.split('.');
            strValue = temp[0];
            _decimal = temp[1];
        }

        if (strValue.indexOf("-") > -1) {
            negative = "-";
            strValue = strValue.split('-')[1];
        }

        if (strValue.length >= 11) {
            result = negative + Math.floor(parseInt(strValue) / 100000000) + "亿";
        } else if (strValue.length >= 9 && strValue.length <= 10) {
            result = negative + (parseInt(strValue) / 100000000).toFixed(2) + "亿";
        } else if (strValue.length >= 5 && strValue.length <= 8) {
            result = negative + Math.floor(parseInt(strValue) / 10000) + "万";
        } else {
            result = strValue;
        }

        return result;
    },
    showLoad: function () {
        this.showMask();
        $(".spinner").show();
    },
    hideLoad: function () {
        this.hideMask();
        $(".spinner").hide();
    },
    showMask:function(){
        $(".spinnerBg").show();
    },
    hideMask:function(){
        $(".spinnerBg").hide();
    }
}

/*全局函数*/
var Global = {
    init: function () {
        this.bindData();
        this.bindEvent();
    },
    bindData:function(){
        setTimeout(() => {
            $(".spinnerBg").height($("body").outerHeight());    
        }, 0);
    },
    bindEvent: function () {
        $(document).click(function () {
            // kLindeContextMenu.hide();
            Tools.hide();
        });
    }
}

/*工具条*/
var Tools = {
    init: function () {
        this.bindData();
        this.bindEvent();
    },
    bindData: function () {
        var _this = this;

        var $body = $("body"),
            $tools = $(".tools");

        tools();
        selected();
        drawing();

        function tools(){

            var list = _this.getToolsData();

            var temp = 0;
            for (var i = 0; i < list.length; i++) {
                var isHasChildren = typeof list[i].children != "undefined";

                var $div = $("<div />").addClass("item button").html(list[i].text);
                $tools.append($div);

            
                if (isHasChildren) {
                    $body.append($("<div />").attr("data-index", i).addClass("dropdownList").css({ left: $div.position().left + "px", top: $div.outerHeight() - 1 + "px" }));
                    for (var j = 0; j < list[i].children.length; j++) {
                        $(".dropdownList").eq(i - temp).append($("<div />").addClass("item").html(list[i].children[j].text));
                    }
                } else {
                    temp++;
                }
            }
        }

        function selected(){

            //return;
            if(chart.DragMode == 0) return;

            var list = [{
                text: "数据拖拽",
                value :1
            }, {
                text: "区间选择",
                value: 2
            }]

            $tools.after($("<div />").addClass("selected").append("<ul />"));

            $(".selected ul").append("<li />");

            var result = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].value == chart.DragMode) {
                    result.unshift(list[i]);
                } else {
                    result.push(list[i]);
                }
            }
            
            for (var i = 0; i < result.length; i++) {
                $(".selected li").append($("<a>").html(result[i].text).attr({ "href": "javascript:;", "data-value": result[i].value }));
            }
        }

        function drawing() {
            $(".selected").after($("<div />").addClass("drawing"));

            var $drawing = $(".drawing");
            $drawing.append($("<div />").addClass("lable").html("画图工具"));

            var list = _this.getDrawingData();

            for (var i = 0; i < list.length; i++) {
                $drawing.append($("<div />").addClass("item").attr("data-index", i).html(list[i].text));
            }
        }
    },
    bindEvent: function () {
        var _this = this;

        var ToolsData = _this.getToolsData();
        var DrawingData = _this.getDrawingData();

        $(".button").each(function (i) {
            $(this).click(function (e) {
                var isHasChildren = typeof ToolsData[i].children != "undefined";

                if (isHasChildren) {
                    var $this = $(".dropdownList[data-index='" + i + "']");
                    if ($this.is(":hidden")) {
                        _this.hide();
                        $this.show();
                    } else {
                        $this.hide();
                    }
                } else {
                    ToolsData[i].click($(this));
                }

                e.stopPropagation();
            });
        });

        $(".dropdownList").each(function () {
            var index = parseInt($(this).attr("data-index"));
            $(this).find(".item").each(function (j) {
                $(this).click(function () {
                    ToolsData[index].children[j].click(1);
                });
                
            });
        });

        $(".selected li").click(function () {

            var $firstA = $(this).find("a:eq(0)");
            
            if (parseInt($firstA.css("marginTop")) == 0) {
                $firstA.css("marginTop", "-38px");
                chart.DragMode = parseInt($(this).find("a:eq(1)").attr("data-value"))
            } else {
                $firstA.css("marginTop", "0px");
                chart.DragMode = parseInt($firstA.attr("data-value"));
            }
        });

        $(".drawing .item").click(function () {
            var index = parseInt($(this).attr("data-index"));

            $(".drawing .item").removeClass("active");
            $(this).addClass("active");
            DrawingData[index].click();
        });
    },
    getToolsData: function () {
        return [{
            text: "周期",
            children: Event.getPeriod()
        }, {
            text: "复权",
            children: Event.getRight()
        }, {
            text: "叠加",
            children: Event.getOverlay()
        }, {
            text: "指标",
            children: Event.getIndex()
        }, ];
    },
    getDrawingData: function () {
        return [{
            text: "线段",
            click: function () {
                chart.CreateChartDrawPicture("线段");
            }
        }, {
            text: "射线",
            click: function () {
                chart.CreateChartDrawPicture("射线");
            }
        }, {
            text: "矩形",
            click: function () {
                chart.CreateChartDrawPicture("矩形");
            }
        }, {
            text: "圆弧线",
            click: function () {
                chart.CreateChartDrawPicture("圆弧线");
            }
        }, ];
    },
    hide: function () {
        $(".dropdownList").hide();
    }
}

/*事件方法*/
/*var Event = {
    getPeriod: function (chart) {
        return [{
            text: "日线",
            click: function () {
                chart.ChangePeriod(0);
            }
        }, {
            text: "周线",
            click: function () {
                chart.ChangePeriod(1);
            }
        }, {
            text: "月线",
            click: function () {
                chart.ChangePeriod(2);
            }
        }, {
            text: "年线",
            click: function () {
                chart.ChangePeriod(3);
            }
        }]
    },
    getRight:function(chart){
        return [{
            text: "不复权",
            click: function () {
                chart.ChangeRight(0);
            }
        }, {
            text: "前复权",
            click: function () {
                chart.ChangeRight(1);
            }
        }, {
            text: "后复权",
            click: function () {
                chart.ChangeRight(2);
            }
        }];
    },
    getIndex: function (chart) {
        return [{
            text: "均线",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, '均线')
            }
        }, {
            text: "BOLL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BOLL')
            },
            isBorder:true
        }, {
            text: "MACD",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'MACD')
            }
        }, {
            text: "KDJ",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'KDJ')
            }
        }, {
            text: "VOL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'VOL')
            }
        }, {
            text: "RSI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'RSI')
            }
        }, {
            text: "BRAR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BRAR')
            }
        }, {
            text: "WR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'WR')
            }
        }, {
            text: "BIAS",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BIAS')
            }
        }, {
            text: "OBV",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'OBV')
            }
        }, {
            text: "DMI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'DMI')
            }
        }, {
            text: "CR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'CR')
            }
        }, {
            text: "PSY",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'PSY')
            }
        }, {
            text: "CCI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'CCI')
            }
        }, {
            text: "DMA",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'DMA')
            }
        }, {
            text: "TRIX",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'TRIX')
            }
        }, {
            text: "VR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'VR')
            }
        }, {
            text: "EMV",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'EMV')
            }
        }, {
            text: "ROC",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'ROC')
            }
        }, {
            text: "MIM",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'MIM')
            }
        }, {
            text: "FSL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'FSL')
            }
        }, ]
    },
    getOverlay: function (chart) {
        return [{
            text: "上证指数",
            click: function () {
                chart.OverlaySymbol('000001.sh');
            }
        },{
            text: "深证成指",
            click: function () {
                chart.OverlaySymbol('399001.sz');
            }
        }, {
            text: "中小板指",
            click: function () {
                chart.OverlaySymbol('399005.sz');
            }
        }, {
            text: "创业板指",
            click: function () {
                chart.OverlaySymbol('399006.sz');
            }
        }, {
            text: "沪深300",
            click: function () {
                chart.OverlaySymbol('000300.sh');
            }
        }, {
            text: "取消叠加",
            click: function () {
                chart.ClearOverlaySymbol();
            }
        }];
    }
}*/

/*区间统计*/
var Interval = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _self = this;

        $(".interval .closeBtn").click(function () {
            $(".interval").hide();
            Common.hideMask();
        });

        $(".interval .dateChange").click(function () {
            var op = $(this).attr("data-op");

            switch (op) {
                case "1":
                    if (_self.data.Start > 1)
                        _self.data.Start--;
                        $(this).addClass("changColorR").siblings().removeClass("changColorL");
                    break;
                case "2":
                    if (_self.data.Start < _self.data.End )
                        _self.data.Start++;
                        $(this).addClass("changColorL").siblings().removeClass("changColorR");
                    break;
                case "3":
                    if (_self.data.End > _self.data.Start)
                        _self.data.End--;
                        $(this).addClass("changColorR").siblings().removeClass("changColorL");
                    break;
                case "4":
                    if ((_self.data.End + 1) < _self.data.Data.Data.length)
                        _self.data.End++;
                        $(this).addClass("changColorL").siblings().removeClass("changColorR");
                    break;
            }

            _self.calculation();
        });

    },
    show: function (data) {
        var _self = this;
        _self.data = data;

        if (_self.data.End > _self.data.Data.Data.length) _self.data.End = _self.data.Data.Data.length - 1;

        _self.calculation();

        var $this = $(".interval"),
            left = ($(window).width() - $this.outerWidth(true)) / 2,
            top = ($(window).height() - $this.outerHeight(true)) / 2;
        $this.css({ left: left + "px", top: top + "px" }).show();
        Common.showMask();
    },
    calculation: function () {
        var _self = this;
        var list = [];

        for (var i = _self.data.Start; i <= _self.data.End; i++) {
            list.push(_self.data.Data.Data[i]);
        }
        
        var result = {
            startDate: list[0].Date,
            endDate: list[list.length - 1].Date,
            count: list.length,
            yClose: list[0].YClose,
            high: list[0].High,
            low: list[0].Low,
            close: list[list.length - 1].Close,
            avg: 0,
            increase: 0,
            vol: 0,
            amount: 0,
            amplitude: 0
        };

        for (var i = 0; i < list.length; i++) {
            if (list[i].High > result.high) result.high = list[i].High;
            if (list[i].Low < result.low) result.low = list[i].Low;

            result.vol += list[i].Vol;
            result.amount += list[i].Amount;
        }

        result.avg = result.amount / result.vol;
        result.increase = (result.close - result.yClose) / result.yClose *100;
        result.amplitude = (result.high - result.low) / result.yClose * 100;

        $(".startDate").html(Common.formatDate(result.startDate));
        $(".endDate").html(Common.formatDate(result.endDate));
        $(".totalCount").html(result.count);
        $(".yclose").html(result.yClose.toFixed(2));
        $(".high").html(result.high.toFixed(2));
        $(".low").html(result.low.toFixed(2));
        $(".close").html(result.close.toFixed(2));
        $(".avg").html(result.avg.toFixed(2));
        $(".increase").html(result.increase.toFixed(2) + "%");
        $(".vol").html(Common.formatBillion(result.vol));
        $(".amount").html(Common.formatBillion(result.amount));
        $(".amplitude").html(result.amplitude.toFixed(2) + "%");

        if (result.increase > 0) {
            $(".increase,.close").removeClass("greenColor").addClass("redColor");
        } else {
            $(".increase,.close").removeClass("redColor").addClass("greenColor");
        }
    },
    data: null
}

/*形态选股*/
var KLineMatch = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _self = this;

        $(".kLineMatch .closeBtn").click(function () {
            $(".kLineMatch").hide();
            Common.hideMask();
        });

        $(".kLineMatch .list").scroll(function(){

            if($(this).scrollTop() +$(this).outerHeight(true) >= $(this)[0].scrollHeight * 0.9){
                _self.data.pageInfo.pageIndex ++;
                if(_self.data.pageInfo.pageIndex <= _self.data.pageInfo.pageCount)
                    _self.setHtml();
            }
            
        });
    },
    show: function (data) {
        var _self = this;
        _self.data.data =data;
     
        if (data.code != 0) {
            alert(data.message);
            return;
        }

        $(".kLineMatch .list").html("");
        _self.data.pageInfo.pageIndex =1;
        _self.data.pageInfo.pageCount = Math.ceil(data.match.length / _self.data.pageInfo.pageSize);

        _self.setHtml();
        $(".kLineMatch .totalCount").html(data.match.length);

        var $this = $(".kLineMatch"),
            left = ($(window).width() - $this.outerWidth(true)) / 2,
            top = ($(window).height() - $this.outerHeight(true)) / 2;
        $this.css({ left: left + "px", top: top + "px" }).show();
        Common.hideLoad();
        Common.showMask();
    },
    setHtml:function(){
        var _self = this;
        var html = [];

        var data = _self.data.data;
            
        for (var i = (_self.data.pageInfo.pageIndex-1) * _self.data.pageInfo.pageSize; i < data.match.length && i < (_self.data.pageInfo.pageIndex) * _self.data.pageInfo.pageSize; i++) {
            html.push('<div class="item">');
            html.push('<div class="name">'+ data.match[i].name+'</div>');
            html.push('<div class="time">' + Common.formatDate(data.match[i].data[0].start, "yy/MM/dd") + '-' + Common.formatDate(data.match[i].data[0].end, "yy/MM/dd") + '</div>');
            html.push('<div class="similar">'+data.match[i].data[0].similar.toFixed(2) +'</div>');
            html.push('</div>');
        }

        var $list = $(".kLineMatch .list");

        if(_self.data.pageInfo.pageIndex == 1)
            $list.html(html.join(''));
        else
            $list.append(html.join(''));
    },
    data:{
        data:null,
        pageInfo :{
            pageIndex :1,
            pageSize :30,
            pageCount :0
        }
    }
}

/*右键菜单*/
/*
function ContextMenu(option) {
    this.option = option || {};
    this.isInit = false;
}

ContextMenu.prototype = {
    init: function () {
        var _self = this;

        _self.bindData();
        _self.bindEvent();

        _self.isInit = true;
    },
    bindData: function () {
        var _self = this;

        var $body = $("body");

        var $topMenu = $("<div />")
        $topMenu.attr("id", "topMenu_"+_self.option.id).addClass("context-menu-wrapper topmenu").hide();
        $body.append($topMenu);

        var $topTable = $("<table />");
        $topTable.attr({ id: "topTable_" + _self.option.id, cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
        $topMenu.append($topTable);

        $topTable.append(getTr(_self.option.data));

        for (var i = 0; i < _self.option.data.length; i++) {
            var isHasChildren = typeof _self.option.data[i].children != "undefined";

            if (isHasChildren) {

                var $childMenu = $("<div />");
                $childMenu.attr({ id: "childMenu_"+_self.option.id + i, "data-index": i }).addClass("context-menu-wrapper").hide();;
                $body.append($childMenu);

                var $childTable = $("<table />");
                $childTable.attr({ id: "childTable_" + _self.option.id + i, cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
                $childMenu.append($childTable);


                $childTable.append(getTr(_self.option.data[i].children));
            }
        }

        function getTr(list) {
            var result = [];

            for (var i = 0; i < list.length; i++) {
                var isBorder = typeof list[i].isBorder != "undefined" && list[i].isBorder;

                var $tr = $("<tr />");
                $tr.addClass("font_Arial context-menu");
                if (isBorder)
                    $tr.addClass("border");

                var $td1 = $("<td />");
                $td1.addClass("spacer context-menu");

                var $td2 = $("<td />");
                $td2.addClass("text").html(list[i].text)

                var $td3 = $("<td />");
                $td3.addClass("right shortcut");

                var $td4 = $("<td />");
                $td4.addClass(typeof list[i].children != "undefined" ? "submenu-arrow" : "context-menu spacer");

                $tr.append($td1).append($td2).append($td3).append($td4);

                result.push($tr);
            }
            return result;
        }
    },
    bindEvent: function () {
        var _self = this;
        var $childMenu = $("[id^='childMenu_" + _self.option.id + "']");

        $("#topTable_" + _self.option.id).find("tr").mouseenter(function () {
            var $this = $(this),
                index = $this.index(),
                $topMenu = $("#topMenu_" + _self.option.id),
                $child = $("#childMenu_" + _self.option.id + index),
                trWidth = $this.outerWidth(),
                trHeight = $this.outerHeight();

            var left = $topMenu.position().left + trWidth + 1;
            var top = $topMenu.position().top + (trHeight * index);

            if (trWidth > _self.option.position.X + _self.option.position.W - left) //超过了右边距
                left = left - trWidth - $topMenu.outerWidth() - 2;

            if ($child.outerHeight() > _self.option.position.Y +_self.option.position.H - top)//超过了下边距
                top = $topMenu.position().top + $topMenu.outerHeight() - $child.outerHeight();

            $childMenu.hide();
            $child.css({ left: left + "px", top: top + "px" }).show();
        }).mouseleave(function () {
            var index = $(this).index();
            setTimeout(function () {
                if ($("#childMenu_" + _self.option.id + index).attr("data-isShow") != 1) {
                    $("#childMenu_" + _self.option.id + index).hide();
                }
            }, 10)

        }).click(function () {
            var $this = $(this);
            var index = $this.index();

            if ($.type(_self.option.data[index].click) == "function") {
                _self.option.data[index].click(_self.option.returnData);
                _self.hide();
            }
            
        });

        $childMenu.mouseenter(function () {
            $(this).attr("data-isShow", "1");
        }).mouseleave(function () {
            $(this).attr("data-isShow", "0");
        });

        $childMenu.find("tr").click(function () {
            var $this = $(this);
            var divIndex = parseInt($this.closest("div").attr("data-index"));
            var trIndex = $this.index();
        
            if ($.type(_self.option.data[divIndex].children[trIndex].click) == "function") {
                _self.option.data[divIndex].children[trIndex].click(_self.option.windowIndex || 1);
                _self.hide();
            }
        });
    },

    show: function (obj) {
        var _self = this;
        $.extend(_self.option, obj);

        if (!_self.isInit)
            _self.init();
       
        var $topMenu = $("#topMenu_"+_self.option.id),
            topWidth = $topMenu.outerWidth(),
            topHeight = $topMenu.outerHeight();

        var x = _self.option.x,
            y = _self.option.y;

        if (topWidth > _self.option.position.X + _self.option.position.W- x) //超过了右边距
            x = x - topWidth;

        if (topHeight > _self.option.position.Y +_self.option.position.H - y)//超过了下边距
            y = y - topHeight;

        _self.hide();
        $topMenu.css({ left: x + "px", top: y + "px" }).show();
    },
    hide: function () {
        var _self = this;

        $("#topMenu_" + _self.option.id).hide();
        $("[id^='childMenu_" + _self.option.id + "']").hide();
    }
}

var KLineInfoEvent=
{
    MouseOverEvent:function(event)  //鼠标悬停
    {

    }
}
*/
