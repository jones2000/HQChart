var jsEditor;
var Root = {};

var Tools = {
    init: function (defalutData) {
        var _this = this;

        _this.bindEvent();
        _this.bindModular();
        _this.setDefault(defalutData);
    },
    setDefault: function (defalutData) {
        $('#tools_code').val(defalutData.script);
        jsEditor = CodeMirror.fromTextArea($('#tools_code').get(0), {
            mode: "javascript",
            gutter: true,
            lineNumbers: true
        })
        jsEditor.setSize('99.8%', 257);
        jsEditor.gutter = true;

        Root.top.indexName = defalutData.indexName;
        Root.top.symbol = defalutData.symbol;

        for (let i in defalutData.args) {
            Root.table.list[i].name.value = defalutData.args[i].Name;
            Root.table.list[i].min.value = 1;
            Root.table.list[i].max.value = 100;
            Root.table.list[i].value.value = defalutData.args[i].Value;
        }

        setTimeout(function () {
            var $tradeDate = $("#txt_tradeDate");
            if ($tradeDate.length > 0) {
                $tradeDate.datepicker({
                    language: 'zh-CN',
                    autoclose: true,
                    todayHighlight: true,
                    format: "yyyy-mm-dd"
                }).on('changeDate', function (el) {
                    if (el.date != undefined) {
                        jsChart.ChangeTradeDate(parseInt(el.date.Format("yyyyMMdd")));
                    }
                });

                $tradeDate.datepicker("setDate", Common.formatDate(defalutData.tradeDate));
            }
        }, 200);
    },
    bindEvent: function () {
        
    },
    bindModular: function () {
        var _this = this;

        Root.top = _this.getTop();
        Root.table = _this.getTable();
        Root.cache = _this.getCache();
    },
    getTop: function () {
        return new Vue({
            el: '#tools_top',
            data: {
                indexName: "",
                symbol: "",
                changeIndex: 1,
                isDebug: JS_EXECUTE_DEBUG_LOG,
                scriptType:1
            },
            methods: {
                execute: function () {
                    var _this = this;

                    if (_this.scriptType == 2) {
                        jsChart.ChangePyScriptIndex(parseInt(_this.changeIndex), { Name: _this.indexName, Script: jsEditor.doc.getValue(), Args: Root.table.getArgs(), "Modify": false, "Change": false });
                    } else {
                        jsChart.ChangeScriptIndex(parseInt(_this.changeIndex), { Name: _this.indexName, Script: jsEditor.doc.getValue(), Args: Root.table.getArgs(), "Modify": false, "Change": false });
                    }
                },
                change: function () {
                    jsChart.ChangeSymbol(this.symbol);
                },
                changeDebug: function () {
                    var _this = this;
                    _this.isDebug = !_this.isDebug;

                    JS_EXECUTE_DEBUG_LOG = _this.isDebug;
                },
                save: function () {
                    var _this = this;

                    var cacheValue = Root.cache.getValue();

                    var hasIndex = -1;

                    for (var i = 0; i < cacheValue.length; i++) {
                        if (cacheValue[i].name == _this.indexName) {
                            hasIndex = i;
                            break;
                        }
                    }

                    var data = {
                        indexName: Root.top.indexName,
                        code: jsEditor.doc.getValue(),
                        args: Root.table.getValue()
                    };

                    if (hasIndex > -1 && confirm("【" + _this.indexName + "】已存在，是否覆盖？")) {
                        cacheValue[hasIndex].value = data;
                    } else {
                        cacheValue.push({
                            name: _this.indexName,
                            value: data
                        });
                    }

                    Root.cache.setValue(cacheValue);
                }
            },
            watch: {
                scriptType: function (newValue, oldValue) {
                    if (newValue == 1)
                        codemirror_is_caseSensitive = false
                    else
                        codemirror_is_caseSensitive = true;
                },
                
            }
        });
    },
    getTable: function () {
        return new Vue({
            el: '#tools_table',
            data: {
                list:[]
            },
            methods: {
                initList: function () {
                    var _this = this;
                    var delfaultLength = 5;

                    for (var i = 0; i < delfaultLength; i++) {
                        _this.list.push({
                            name: { value: "", isEdit: false },
                            min: { value: "", isEdit: false },
                            max: { value: "", isEdit: false },
                            value: { value: "", isEdit: false },
                        });
                    }
                },
                openEdit: function (index, type) {
                    var _this = this;

                    _this.list[index][type].isEdit = true;
                },
                closeEdit: function (index, type) {
                    var _this = this;

                    if (_this.list[index][type].value == "") {
                        _this.list[index][type].isEdit = true;
                    }
                    else {
                        _this.list[index][type].isEdit = false;
                    }
                },
                getArgs: function () {
                    var _this =this;

                    var args = [];

                    for (var i = 0; i < _this.list.length; i++) {
                        var name = _this.list[i].name.value,
                            value = _this.list[i].value.value;

                        if (!name || !value)
                            continue;

                        value = parseInt(value);

                        args.push({
                            Name: name,
                            Value: value
                        });
                    }

                    return args;
                },
                getValue: function () {
                    return this.list;
                },
                setValue: function (list) {
                    for (var i = 0; i < list.length; i++) {
                        list[i].name.isEdit = false;
                        list[i].min.isEdit = false;
                        list[i].max.isEdit = false;
                        list[i].value.isEdit = false;
                    }

                    this.list = list;
                },
                clear: function () {
                    var _this = this;

                    for (var i = 0; i < _this.list.length; i++) {
                        if (!_this.list[i].name.value && !_this.list[i].value.value)
                            continue;

                        _this.list[i].name.value = "";
                        _this.list[i].name.isEdit = true;

                        _this.list[i].value.value = "";
                        _this.list[i].value.isEdit = true;
                    }
                }
            },
            created: function () {
                this.initList();
            }
        });
    },
    getCache: function () {
        return new Vue({
            el: '#tools_cache',
            data: {
                list: [],

                activeIndex: -1,

                cacheKye: "i_s_c"
            },
            methods: {
                getList: function () {
                    var _this = this;

                    _this.list = _this.getValue();
                },
                getValue: function () {
                    var _this = this;

                    var cacheValue = localStorage[_this.cacheKye] || [];
                    cacheValue = typeof cacheValue == "string" ? JSON.parse(cacheValue) : cacheValue;

                    return cacheValue;
                },
                setValue: function (val) {
                    var _this = this;

                    localStorage[_this.cacheKye] = JSON.stringify(val);

                    _this.getList();
                },
                select: function (index) {
                    var _this = this;

                    _this.activeIndex = index;

                    var data = _this.getValue()[index].value;

                    Root.top.indexName = data.indexName;
                    jsEditor.setValue(data.code);
                    Root.table.setValue(data.args);
                },
                _delete: function (index) {
                    var _this = this;

                    var list = _this.getValue();

                    if (confirm("是否删除【" + list[index].name + "】")) {
                        list.splice(index, 1);

                        _this.setValue(list);
                    }
                }
            },
            created: function () {
                this.getList();
            }
        });
    }
}

var Common = {
    formatDate: function (date) {
        if (!date) return "";

        date = date + "";
        if (date.length != 8)
            return date;

        return new Date(date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8));
    }
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