var jsEditor;
var Root = {};

var Tools = {
    init: function (defalutData) {
        var _this = this;

        _this.bindModular();
        _this.setDefault(defalutData);
    },
    setDefault: function (defalutData) {
        Root.tools.setSurplusKLineCount(defalutData.trainDataCount)
    },
    bindModular: function () {
        var _this = this;

        Root.tools = _this.getTools();
        Root.result = _this.getResult();
    },
    getTools: function () {
        return new Vue({
            el: '#tools',
            data: {
                kLineAuto:false,
                SurplusKLineCount: 0,
                buyOrSellState: 0,
                list: [],
            },
            methods: {
                nextKLine: function () {
                    jsChart.JSChartContainer.MoveNextKLineData();
                },
                buyOrSell: function () {
                    var _this = this;

                    jsChart.JSChartContainer.BuyOrSell();
                },
                setSurplusKLineCount: function (count) {
                    this.SurplusKLineCount = count;
                },
                setBuyOrSellState: function (state) {
                    this.buyOrSellState = state;
                },
                setData: function (data) {
                    var _this = this;
                    
                    _this.list = [];
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].Buy != null) {
                            _this.list.unshift({
                                op: "买入",
                                price: data[i].Buy.Price.toFixed(2),
                                profitAndLoss: "",
                                profitAndLossRatio: "",
                                profitAndLossClass: ""
                            });
                        }

                        if (data[i].Sell != null && data[i].Buy != null) {
                            var profitAndLossRatio = ((data[i].Sell.Price - data[i].Buy.Price) / data[i].Buy.Price).toFixed(2);
                            _this.list.unshift({
                                op: "卖出",
                                price: data[i].Sell.Price.toFixed(2),
                                profitAndLoss: profitAndLossRatio > 0 ? "盈利" : "亏损",
                                profitAndLossRatio: profitAndLossRatio,
                                profitAndLossClass: profitAndLossRatio > 0 ? "profit" : "loss"
                            });
                        }
                    }
                }
            },
            watch: {
                kLineAuto: function (newValue, oldValue) {
                    if (newValue) {
                        jsChart.JSChartContainer.Run();
                    }
                    else {
                        jsChart.JSChartContainer.Stop();
                    }
                },
            }
        });
    },
    getResult: function () {
        return new Vue({
            el: '#modal_result',
            data: {
                date: Common.getDate().Format("yyyy-MM-dd"),
                symbol: "",
                name: "",
                kLineDate: {
                    startDate: "",
                    endDate: ""
                },
                increase: 0,
                profitRatio: 0
            },
            methods: {
                setData: function (hqChart) {
                    var _this = this;

                    _this.symbol = hqChart.Symbol;
                    _this.name = hqChart.Name;

                    _this.kLineDate.startDate = Common.formatDate(hqChart.TrainStartEnd.Start.Date).Format("yyyy-MM-dd");
                    _this.kLineDate.endDate = Common.formatDate(hqChart.TrainStartEnd.End.Date).Format("yyyy-MM-dd");

                    _this.increase = ((hqChart.TrainStartEnd.End.Close - hqChart.TrainStartEnd.Start.Open) / hqChart.TrainStartEnd.End.Close).toFixed(2);

                    var profitCount = 0,
                        totalSellCount = 0;

                    var list = Root.tools.list;

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].op != "卖出")
                            continue;

                        totalSellCount++;

                        if (list[i].profitAndLossRatio > 0)
                            profitCount++;
                    }

                    _this.profitRatio = (profitCount / totalSellCount * 100).toFixed(2);

                    Common.showModal("modal_result");
                }
            }
        });
    },
}

var Common = {
    formatDate: function (date) {
        if (!date) return "";

        date = date + "";
        if (date.length != 8)
            return date;

        return new Date(date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8));
    },
    showModal: function (id) {
        var $this = $('#' + id),
            $modal_dialog = $this.find('.modal-dialog');

        $this.css('display', 'block');
        $modal_dialog.css({ 'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2 - 30) });
        $this.modal("show");
    },
    hideModal: function (id) {
        $('#' + id).modal("hide");
    },
    alert: function (msg, success) {
        layer.msg(msg, {
            time: 1500,
            success: success
        });
    },
    showLoading: function () {
        this.loadIndex = layer.load(0);
        return this.loadIndex;
    },
    colseLoading: function (index) {
        index = index || this.loadIndex;
        layer.close(index);
    },
    getDate: function (par) {
        var date = new Date()
        
        for (var i in par) {
            if (!par.hasOwnProperty(i)) {
                continue;
            };

            switch (i) {
                case "addDays":
                    date.setDate(date.getDate() + par[i])
                    break;
                case "addMonth":
                    date.setMonth(date.getMonth() + par[i]);
                    break;
                case "addYear":
                    date.setYear(date.getFullYear() + par[i]);
                    break;
            }
        }

        return date;
    },
}

Date.prototype.Format = function (fmt) { //author: meizz 
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

Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        } if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    } return this + "";
};