var Global = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        $(document).click(function () {
            ContextMenu.hide();
            Tools.hide();
        });
    }
}

var ContextMenu = {
    init: function () {
        this.bindData();
        this.bindEvent();
    },
    bindData: function () {
        var _this = this;

        var $body = $("body");

        var $topMenu = $("<div />")
        $topMenu.attr("id", "topMenu").addClass("context-menu-wrapper topmenu").hide();
        $body.append($topMenu);

        var $topTable = $("<table />");
        $topTable.attr({ id: "topTable", cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
        $topMenu.append($topTable);

        $topTable.append(_this.getTr(_this.getData()));

        for (var i = 0; i < _this.getData().length; i++) {
            var isHasChildren = typeof _this.getData()[i].children != "undefined";

            if (isHasChildren) {

                var $childMenu = $("<div />");
                $childMenu.attr({ id: "childMenu" + i, "data-index": i }).addClass("context-menu-wrapper").hide();;
                $body.append($childMenu);

                var $childTable = $("<table />");
                $childTable.attr({ id: "childTable" + i, cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
                $childMenu.append($childTable);

                $childTable.append(_this.getTr(_this.getData()[i].children));
            }
        }
    },
    bindEvent: function () {
        var _this = this;

        $("#topTable tr").mouseenter(function () {
            var $this = $(this),
                index = $this.index(),
                $topMenu = $("#topMenu"),
                $child = $("#childMenu" + index),
                trWidth = $this.outerWidth(),
                trHeight = $this.outerHeight();

            var left = $topMenu.position().left + trWidth + 1;
            var top = $topMenu.position().top + (trHeight * index);

            if (_this._data.windowWidth - left < trWidth) //超过了右边距
                left = left - trWidth - $topMenu.outerWidth() - 2;

            if (_this._data.windowHeight - top < $child.outerHeight())//超过了下边距
                top = $topMenu.position().top + $topMenu.outerHeight() - $child.outerHeight();

            $("[id^='childMenu']").hide();
            $child.css({ left: left + "px", top: top + "px" }).show();
        }).mouseleave(function () {
            var index = $(this).index();
            setTimeout(function () {
                if ($("#childMenu" + index).attr("data-isShow") != 1) {
                    $("#childMenu" + index).hide();
                }
            }, 10)

        }).click(function () {
            var $this = $(this);
            var index = $this.index();

            if ($.type(_this.getData()[index].click) == "function") {
                _this.getData()[index].click();
                _this.hide();
            }
        });

        $("[id^='childMenu']").mouseenter(function () {
            $(this).attr("data-isShow", "1");
        }).mouseleave(function () {
            $(this).attr("data-isShow", "0");
        });

        $("[id^='childMenu'] tr").click(function () {
            var $this = $(this);
            var divIndex = parseInt($this.closest("div").attr("data-index"));
            var trIndex = $this.index();

            if ($.type(_this.getData()[divIndex].children[trIndex].click) == "function") {
                _this.getData()[divIndex].children[trIndex].click();
                _this.hide();
            }
        });
    },
    getData: function () {
        var _this = this;

        return data = [{
            text: "切换周期",
            children: Event.getPeriod()
        }, {
            text: "行情复权",
            children: Event.getRight()
        }, {
            text: "指标",
            children: Event.getIndex(parseInt(_this._data.windowIndex) || 1)
        }];
    },
    getTr: function (list) {
        var result = [];

        for (var i = 0; i < list.length; i++) {
            var $tr = $("<tr />");
            $tr.addClass("font_Arial context-menu");

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
    },
    show: function () {
        var _this = this;
        var $topMenu = $("#topMenu"),
            topWidth = $topMenu.outerWidth(),
            topHeight = $topMenu.outerHeight();

        var x = _this._data.x,
            y = _this._data.y;
        

        if (_this._data.windowWidth - x < topWidth) //超过了右边距
            x = x - topWidth;
        
        if (_this._data.windowHeight - y < topHeight)//超过了下边距
            y = y - topHeight;

        $topMenu.css({ left: x + "px", top: y + "px" }).show();
    },
    hide: function () {
        $("#topMenu").hide();
        $("[id^='childMenu']").hide();
    },
    data: function (data) {
        var _this = this;
        if (arguments.length == 1) {
            _this._data = data;
        }
        else {
            return _this._data
        }
    },
    _data: {}
}

var Tools = {
    init: function () {
        this.bindData();
        this.bindEvent();
    },
    bindData: function () {
        var _this = this;

        var $body = $("body");

        var list = _this.getData();

        var temp = 0;
        for (var i = 0; i < list.length; i++) {
            var isHasChildren = typeof list[i].children != "undefined";

            var $div = $("<div />").addClass("item button").html(list[i].text);
            $(".tools").append($div);

            
            if (isHasChildren) {
                $body.append($("<div />").attr("data-index", i).addClass("list").css({ left: $div.position().left + "px", top: $div.outerHeight() - 1 + "px" }));
                for (var j = 0; j < list[i].children.length; j++) {
                    $(".list").eq(i - temp).append($("<div />").addClass("item").html(list[i].children[j].text));
                }
            } else {
                temp++;
            }
        }
    },
    bindEvent: function () {
        var _this = this;

        var list = _this.getData();

        $(".button").each(function (i) {
            $(this).click(function (e) {
                var isHasChildren = typeof list[i].children != "undefined";

                if (isHasChildren) {
                    _this.hide();
                    $(".list[data-index='" + i + "']").show();
                } else {

                    list[i].click();
                }

                e.stopPropagation();
            });
        });

        $(".list").each(function () {
            var index = parseInt($(this).attr("data-index"));
            $(this).find(".item").each(function (j) {
                $(this).click(function () {
                    list[index].children[j].click();
                });
                
            });
        });
    },
    getData: function () {
        return [{
            text: "周期",
            children: Event.getPeriod()
        }, {
            text: "复权",
            children: Event.getRight()
        }, {
            text: "叠加",
            children: [{
                text: "上证指数",
                click: function () {
                    chart.OverlaySymbol('000001.sh', chart);
                }
            }]
        }, {
            text: "指标",
            children: Event.getIndex(1)
        }];
    },
    hide: function () {
        $(".list").hide();
    }
}

var Event = {
    getPeriod: function () {
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
    getRight:function(){
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
    getIndex:function(windowIndex){
        return [{
            text: "均线",
            click: function () {
                chart.ChangeIndex(windowIndex, '均线')
            }
        }, {
            text: "BOLL",
            click: function () {
                chart.ChangeIndex(windowIndex, 'BOLL')
            }
        }, {
            text: "MACD",
            click: function () {
                chart.ChangeIndex(windowIndex, 'MACD')
            }
        }, {
            text: "KDJ",
            click: function () {
                chart.ChangeIndex(windowIndex, 'KDJ')
            }
        }, {
            text: "VOL",
            click: function () {
                chart.ChangeIndex(windowIndex, 'VOL')
            }
        }, {
            text: "RSI",
            click: function () {
                chart.ChangeIndex(windowIndex, 'RSI')
            }
        }, {
            text: "BRAR",
            click: function () {
                chart.ChangeIndex(windowIndex, 'BRAR')
            }
        }, {
            text: "WR",
            click: function () {
                chart.ChangeIndex(windowIndex, 'WR')
            }
        }, {
            text: "BIAS",
            click: function () {
                chart.ChangeIndex(windowIndex, 'BIAS')
            }
        }, {
            text: "OBV",
            click: function () {
                chart.ChangeIndex(windowIndex, 'OBV')
            }
        }, {
            text: "DMI",
            click: function () {
                chart.ChangeIndex(windowIndex, 'DMI')
            }
        }, {
            text: "CR",
            click: function () {
                chart.ChangeIndex(windowIndex, 'CR')
            }
        }, {
            text: "PSY",
            click: function () {
                chart.ChangeIndex(windowIndex, 'PSY')
            }
        }, ]
    }
}