var jsEditor;
var Root = {};

var Tools = {
    init: function (defalutData) {
        var _this = this;

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
    bindModular: function () {
        var _this = this;

        Root.plate = _this.getPlate();
        Root.top = _this.getTop();
        Root.table = _this.getTable();
        Root.code = _this.getCode();
        Root.cache = _this.getCache();
        Root.policyParameter = _this.getPolicyParameter();
        Root.policySuccess = _this.getPolicySuccess();
    },
    getTop: function () {
        return new Vue({
            el: '#tools_top',
            data: {
                indexName: "",
                symbol: "",
                changeIndex: 1,
                isDebug: JS_EXECUTE_DEBUG_LOG,

                tweenedExecutePolicyTotalCount:0,
                executePolicyTotalCount: 0,

                tweenedExecutePolicySuccessCount:0,
                executePolicySuccessCount: 0,

                isInExecutePolicy:false         //是否执行策略中
            },
            methods: {
                execute: function () {
                    var _this = this;

                    jsChart.ChangeScriptIndex(parseInt(_this.changeIndex), { Name: _this.indexName, Script: jsEditor.doc.getValue(), Args: Root.table.getArgs(), "Modify": false, "Change": false });
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
                },
                showPolicyParameter: function () {
                    Root.policyParameter.reset();
                    Common.showModal('modal_parameter')
                },
                executePolicy: function () {
                    var _this = this;

                    var symbolList = Root.plate.getValue()
                    var parameterData= Root.policyParameter.getValue();

                    if (symbolList.length == 0) {
                        Common.alert("请选择板块");
                        return;
                    }

                    if (isNaN(parameterData.dateCount)) {
                        Common.alert("日线计算天数错误");
                        return;
                    }

                    Common.hideModal('modal_parameter');

                    _this.executePolicySuccessCount = 0;
                    _this.executePolicyTotalCount = symbolList.length;
                    Root.policySuccess.clear();
                    
                    _this.isInExecutePolicy = true;

                    var tempList = getTempList(symbolList);

                    for (var i = 0; i < tempList.length; i++) {
                        getData(tempList[i], i,
                            function (list, index) {
                                for (var i = 0; i < list.length; i++) {

                                    var dateIndex = getIndexByDate(Root.policySuccess.list, list[i].date)
                                    if (dateIndex > -1) {

                                        for (var j = 0; j < list[i].symbols.length; j++) {
                                            Root.policySuccess.list[dateIndex].infoList.push({
                                                symbol: list[i].symbols[j],
                                                value: list[i].values[j]
                                            });
                                        }

                                    } else {

                                        var item ={
                                            date: list[i].date,
                                            showDate: Common.formatDate(list[i].date).Format("yyyy-MM-dd"),
                                            isShow:true,
                                            infoList: []
                                        };

                                        for(var j=0;j<list[i].symbols.length;j++){
                                            item.infoList.push({
                                                symbol: list[i].symbols[j],
                                                value: list[i].values[j]
                                            })
                                        }
                                        
                                        Root.policySuccess.list.push(item);

                                        Root.policySuccess.list.sort(function (a,b) {
                                            return b.date - a.date;
                                        })
                                    }


                                    //for (int i = 1; i < arr.length; i++) {
                                    //    var j = i;
                                    //    while (j > 0 && arr[j] < arr[j - 1]) {
                                    //        swap(arr,j,j-1);
                                    //        j--;
                                    //    }
                                    //}

                                }

                                _this.executePolicySuccessCount += tempList[index].length;

                                if (_this.executePolicySuccessCount == _this.executePolicyTotalCount) {
                                    _this.isInExecutePolicy = false;
                                }
                        },
                            function (index) {
                            _this.executePolicySuccessCount += tempList[index].length;

                            if (_this.executePolicySuccessCount == _this.executePolicyTotalCount) {
                                _this.isInExecutePolicy = false;
                            }
                        });
                    }
                    
                    function getTempList(symbolList) {
                        var pageSize = 200,
                            pageCount = Math.ceil(symbolList.length / pageSize);

                        var result = [];
                        for (var i = 0; i < pageCount; i++) {
                            if (i == pageCount - 1) {
                                result.push(getSymbolList(i * pageSize, symbolList.length));
                            } else {
                                result.push(getSymbolList(i * pageSize, (i + 1) * pageSize));
                            }
                        }

                        return result;

                        function getSymbolList(start, end) {
                            var result = [];
                            for (var i = start; i < end; i++) {
                                result.push(symbolList[i]);
                            }

                            return result;
                        }
                    }
                    
                    function getData(symbolList, index, successCallback, errorCallback) {
                        var url = "http://nodejs.zealink.com/api/jscomplier";
                        _this.$http.post(url, {
                            symbol: symbolList,
                            code: Root.code.getValue().replace(/[\n\r]/g, ''),
                            args: Root.table.getArgs(true),
                            datecount: parameterData.dateCount,
                            right: parameterData.right
                        }, {
                            emulateJSON: true
                        }).then(function (res) {
                            if (typeof successCallback == "function") {
                                successCallback(res.data.data, index);
                            }
                        }, function () {
                            if (typeof errorCallback == "function") {
                                errorCallback(index);
                            }
                        });
                    }

                    function getIndexByDate(list, date) {
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].date == date) {
                                return i;
                            }
                        }

                        return -1;
                    }

                }

            },
            watch: {
                executePolicyTotalCount: function (newValue, oldValue) {
                    var vm = this
                    function animate() {
                        if (TWEEN.update()) {
                            requestAnimationFrame(animate)
                        }
                    }
                    new TWEEN.Tween({ tweeningNumber: oldValue })
                      .easing(TWEEN.Easing.Quadratic.Out)
                      .to({ tweeningNumber: newValue }, 500)
                      .onUpdate(function () {
                          vm.tweenedExecutePolicyTotalCount = this.tweeningNumber.toFixed(0)
                      })
                      .start()
                    animate()
                },
                executePolicySuccessCount: function (newValue, oldValue) {
                    var vm = this
                    function animate() {
                        if (TWEEN.update()) {
                            requestAnimationFrame(animate)
                        }
                    }
                    new TWEEN.Tween({ tweeningNumber: oldValue })
                      .easing(TWEEN.Easing.Quadratic.Out)
                      .to({ tweeningNumber: newValue }, 500)
                      .onUpdate(function () {
                          vm.tweenedExecutePolicySuccessCount = this.tweeningNumber.toFixed(0)
                      })
                      .start()
                    animate()
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
                getArgs: function (isLowerCase) {
                    var _this = this;

                    var args = [];

                    for (var i = 0; i < _this.list.length; i++) {
                        var name = _this.list[i].name.value,
                            value = _this.list[i].value.value;

                        if (!name || !value)
                            continue;

                        value = parseInt(value);

                        if (isLowerCase) {
                            args.push({
                                name: name,
                                value: value
                            });
                        } else {
                            args.push({
                                Name: name,
                                Value: value
                            });
                        }
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
    getCode: function () {
        function code() {

        }

        code.prototype.getValue = function () {
            return jsEditor.doc.getValue();
        }
        
        return new code();
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
    },
    getPlate: function () {
        return new Vue({
            el: '#plate',
            data: {
                plate: {
                    list: []
                },
                tweenedSelectPlateCount: 0,
                selectPlateCount: 0,

                tweenedSelectStockCount:0,
                selectStockCount: 0,

                symbolList:[]
            },
            methods: {
                getList: function () {
                    var _this = this;

                    var url = "http://project.api.umydata.com/conf/api/GetPlateListByType";
                    _this.$http.post(url, {
                        typeList: [1]
                    }, {
                        emulateJSON: true
                    }).then(function (res) {
                        for (var i = 0; i < res.data.list.length; i++) {
                            var item = res.data.list[i];

                            _this.plate.list.push({
                                symbol: item.symbol,
                                name: item.name,
                                isSelect: false
                            });
                        }

                        var otherPlateList = [{
                            symbol: "SHA.ci",
                            name: "沪市A股",
                            isSelect: false
                        }, {
                            symbol: "SME.ci",
                            name: "中小板股票",
                            isSelect: false
                        }, {
                            symbol: "SZA.ci",
                            name: "深市A股",
                            isSelect: false
                        }, {
                            symbol: "000300.sh",
                            name: "沪深300",
                            isSelect: false
                        }]

                        for (var i = 0; i < otherPlateList.length; i++) {
                            _this.plate.list.push(otherPlateList[i]);
                        }
                    });
                },
                selectPlate: function (item, type) {
                    var _this = this;

                    for (var i = 0; i < _this.plate.list.length; i++) {
                        if (_this.plate.list[i].symbol == item.symbol) {
                            _this.plate.list[i].isSelect = !_this.plate.list[i].isSelect;
                            break;
                        }
                    }

                    _this.calculationPlate();
                },
                selectAll: function (type) {
                    var _this = this;

                    for (var i = 0; i < _this.plate.list.length; i++) {
                        _this.plate.list[i].isSelect = true;
                    }

                    _this.calculationPlate();
                },
                reverseSelect: function (type) {
                    var _this = this;

                    for (var i = 0; i < _this.plate.list.length; i++) {
                        _this.plate.list[i].isSelect = !_this.plate.list[i].isSelect;
                    }

                    _this.calculationPlate();
                },
                calculationPlate: function () {
                    var _this = this;
                    var selectPlateList = [];

                    for (var i = 0; i < _this.plate.list.length; i++) {
                        if (_this.plate.list[i].isSelect) {
                            selectPlateList.push(_this.plate.list[i].symbol);
                        }
                    }

                    _this.symbolList = [];

                    if (selectPlateList.length == 0) {
                        _this.selectPlateCount = selectPlateList.length;
                        _this.selectStockCount = _this.symbolList.length;

                        return;
                    }

                    var url = "http://47.94.36.50/api/GetStockListByPlate";
                    _this.$http.post(url, {
                        plateList: selectPlateList
                    }, {
                        emulateJSON: true
                    }).then(function (res) {
                        for (var i = 0; i < res.data.list.length; i++) {
                            _this.symbolList.push(res.data.list[i].symbol);
                        }

                        _this.selectPlateCount = selectPlateList.length;
                        _this.selectStockCount = _this.symbolList.length;
                    });
                },
                getValue: function () {
                    return this.symbolList;
                }
            },
            created: function () {
                var _this = this;
                _this.getList();
            },
            watch: {
                selectPlateCount: function (newValue, oldValue) {
                    var vm = this
                    function animate() {
                        if (TWEEN.update()) {
                            requestAnimationFrame(animate)
                        }
                    }
                    new TWEEN.Tween({ tweeningNumber: oldValue })
                      .easing(TWEEN.Easing.Quadratic.Out)
                      .to({ tweeningNumber: newValue }, 500)
                      .onUpdate(function () {
                          vm.tweenedSelectPlateCount = this.tweeningNumber.toFixed(0)
                      })
                      .start()
                    animate()
                },
                selectStockCount: function (newValue, oldValue) {
                    var vm = this
                    function animate() {
                        if (TWEEN.update()) {
                            requestAnimationFrame(animate)
                        }
                    }
                    new TWEEN.Tween({ tweeningNumber: oldValue })
                      .easing(TWEEN.Easing.Quadratic.Out)
                      .to({ tweeningNumber: newValue }, 500)
                      .onUpdate(function () {
                          vm.tweenedSelectStockCount = this.tweeningNumber.toFixed(0)
                      })
                      .start()
                    animate()
                },
            }
        });
    },
    getPolicyParameter: function () {
        return new Vue({
            el: '#policyParameter',
            data: {
                right: 0,
                dateCount_radio: 365,
                dateCount_txt: ""
            },
            methods: {
                getValue: function () {
                    var _this = this;

                    return {
                        right: _this.right,
                        dateCount: _this.dateCount_radio || _this.dateCount_txt
                    }
                },
                reset: function () {
                    var _this = this;

                    _this.right = 0;
                    _this.dateCount_radio = 365;;
                    _this.dateCount_txt = "";
                }
            },
            watch: {
                dateCount_radio: function (newValue, oldValue) {

                    if (newValue == "") {
                        this.dateCount_txt = "";
                    }
                },
                dateCount_txt: function (newValue, oldValue) {
                    this.dateCount_txt = this.dateCount_txt.replace(/[^\d]/g, '')
                }
            },
            directives: {
                focus: {
                    // 指令的定义
                    update: function (el) {
                        el.focus()
                    }
                }
            },
        });
    },
    getPolicySuccess: function () {
        return new Vue({
            el: '#policySuccess',
            data: {
                list: [],

                activeSymbol: "",
            },
            methods: {
                clear: function () {
                    var _this = this;

                    _this.list = [];
                    _this.activeSymbol = "";
                },
                select: function (symbol) {
                    this.activeSymbol = symbol;

                    Root.top.symbol = symbol;
                    Root.top.change();
                },
                showOrHide: function (index) {
                    this.list[index].isShow = !this.list[index].isShow;
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