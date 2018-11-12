var jsEditor;
var Root = {};

var Tools = {
    init: function () {
        var _this = this;

        _this.bindModular();
    },
    bindModular: function () {
        var _this = this;

        Root.list = _this.getList();
    },
    getList: function () {
        return new Vue({
            el: '#tools',
            data: {
                list: [],

                activeIndex: -1,
            },
            methods: {
                getList: function () {
                    var _this = this;

                    for (var i = 1; i <= 7; i++) {
                        _this.list.push(i);
                    }
                },
                select: function (index) {
                    var _this = this;

                    _this.activeIndex = index;
                    jsChart.ChangeDayCount(_this.list[index]);
                }
            },
            created: function () {
                this.getList();
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