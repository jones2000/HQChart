<template>
    <div class="stockkline" ref='stockkline'>
        <!-- 周期工具条  !-->
        <div class='periodbar' ref='divperiodbar'>
            <div class="preiod">
                <a class="item" v-for='(navItem,idx) in PeriodBar.Menu' :key='idx' :class='PeriodBar.Selected == idx ? "active":""'
                    href="javascript:;" @click='OnClickPeriodMenu(idx,$event)'>{{navItem}}</a>
            </div>
        </div>

        <!--  图形操作工具条  !-->
        <div class='chartbar' ref='divchartbar' id='chartbar'>
            <!-- 分时图设置导航条 -->
            <div id='barForMinute' v-show="Minute.IsShow">
                <div class="item" v-for='(menuOne,index) in Minute.Toolbar.Data' :key='menuOne.Text' @click="OnClickToolBar('minute',menuOne,index)">
                    <p class="menuOne" :class='{light:Minute.Toolbar.Selected == index}'>
                        <span>{{menuOne.Text}}</span>
                        <i class="iconfont" :class='Minute.Toolbar.Selected == index ? "icon-shang" : "icon-xia"'></i>
                    </p>
                    <ul class="menuTwo" v-show='Minute.Toolbar.Selected == index ? true:false'>
                        <li v-for='(menuItem,ind) in menuOne.Menu' :class='{active:menuOne.Selected.indexOf(ind)>=0}' :key='ind'
                            @click.stop="OnClickToolBarMenu('minute',menuOne,menuItem,ind)">{{menuItem.Name}}</li>
                    </ul>
                </div>
            </div>

          <!-- k线设置导航条 -->
          <div id='barForKLine' v-show="KLine.IsShow">
                <div v-bind:class="[menuOne.IsShow==true? 'item':'hide_item']" v-for='(menuOne,index) in KLine.Toolbar.Data' :key='menuOne.Text' v-show="KLineItemShow[index]" @click="OnClickToolBar('kline',menuOne,index)" >
                    <p class="menuOne" :class='{light:KLine.Toolbar.Selected == index}' v-show='menuOne.IsShow'>
                            <span>{{menuOne.Text}}</span>
                            <i class='iconfont' :class='KLine.Toolbar.Selected == index ? "icon-shang" : "icon-xia"'></i>
                    </p>
                    <ul class="menuTwo" v-show='KLine.Toolbar.Selected == index ? true:false'>
                        <li v-for='(menuItem,ind) in menuOne.Menu' :class='{active:menuOne.Selected.indexOf(ind)>=0}' :key='ind'
                            @click.stop="OnClickToolBarMenu('kline',menuOne,menuItem,ind)">{{menuItem.Name}}</li>
                    </ul>
                </div>
          </div>
          
        </div>
        <div class="brushTool" v-if="DrawTool.IsShow">
            <Stockdrawtool @CurrentIcon = "CurrentIcon" @isShowBrushTool="isShowBrushTool" :topheight="topheight" :totalheight="totalheight"></Stockdrawtool>
        </div>   
        <!-- 走势图 和 K线图  !-->
        <div :id='ID' ref='divchart' style="width:100%;height:100%">
            <div class='minute' id="minute" ref="minute"  v-show="Minute.IsShow"></div>
            <div class='kline' id="kline" ref='kline'  v-show="KLine.IsShow"></div>
        </div>

        <!-- 底部指标工具条  !-->
        <div class="indexbar" v-show='Minute.IsShow' ref='minuteindexbar'>
            <span v-for='(item,index) in Minute.IndexBar.Menu' :key='index' :class='{active:Minute.IndexBar.Selected.indexOf(index)>=0}'
                @click="OnClickIndexBar('minute',item,index)">{{item}}</span>
        </div>
        <div class="indexbar" v-show='KLine.IsShow' ref='klineindexbar'>
            <span v-for='(item,index) in KLine.IndexBar.Menu' :key='index' :class='{active:KLine.IndexBar.Selected.indexOf(index)>=0}'
                @click="OnClickIndexBar('kline',item,index)">{{item}}</span>
        </div>

    </div>
</template>

<script type="text/javascript">

import $ from 'jquery'
import JSCommon from '../umychart.vue/umychart.vue.js'
import '../../jscommon/umychart.resource/font/iconfont.css'
import '../../jscommon/umychart.resource/css/tools.css'
import Stockdrawtool from './stockdrawtool.vue'

function DefaultData()
{

}

//分钟数据默认配置
DefaultData.GetMinuteOption=function()
{
    const option=
    {
        Type: '分钟走势图', //历史分钟走势图
        Symbol: null,
        IsAutoUpdate: true, //是自动更新数据
        Windows:
        [
            { Index: "MACD" }
        ],
        DayCount: 1,

        IsShowRightMenu: false,         //右键菜单
        IsShowCorssCursorInfo: true,    //是否显示十字光标的刻度信息

        Border: //边框
        {
            Left: 60, //左边间距
            Right: 60, //右边间距
            Top: 25,
            Bottom: 20
        },

        KLineTitle: //标题设置
        {
            
        },

        Frame: //子框架设置,刻度小数位数设置
        [
            { SplitCount: 5, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 }
        ]
    };

    return option;
}

DefaultData.GetKLineOption=function()
{
    const option=
    {
        Type: '历史K线图',
        Windows: 
        [
            { Index: "均线" },
            { Index: "VOL" },
        ], //窗口指标
        Symbol: null,
        IsAutoUpdate: true, //是自动更新数据
        IsShowRightMenu: false, //右键菜单

        KLine: 
        {
            DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right: 1, //复权 0 不复权 1 前复权 2 后复权
            Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
            MaxReqeustDataCount: 1000, //日线数据最近1000天
            MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
            PageSize: 50, //一屏显示多少数据 
            IsShowTooltip: true //是否显示K线提示信息
        },

        KLineTitle: //标题设置
        {
            
        },

        Border: //边框
        {
            Left: 1, //左边间距
            Right: 60, //右边间距
            Top: 25
        },

        Frame: //子框架设置
        [
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false }
        ]
    };

    return option;
}

DefaultData.GetPeriodData=function(name)
{
    const mapPeriod=new Map([
                    ["分时",{Value:1,KLineShow:false,MinuteShow:true}],
                    ["五日",{Value:5,KLineShow:false,MinuteShow:true}],
                    ["日线",{Value:0,KLineShow:true,MinuteShow:false}],
                    ["周线",{Value:1,KLineShow:true,MinuteShow:false}],
                    ["月线",{Value:2,KLineShow:true,MinuteShow:false}],
                    ["年线",{Value:3,KLineShow:true,MinuteShow:false}],
                    ["1分钟",{Value:4,KLineShow:true,MinuteShow:false}],
                    ["5分钟",{Value:5,KLineShow:true,MinuteShow:false}],
                    ["15分钟",{Value:6,KLineShow:true,MinuteShow:false}],
                    ["30分钟",{Value:7,KLineShow:true,MinuteShow:false}],
                    ["60分钟",{Value:8,KLineShow:true,MinuteShow:false}],
                ]);
    if (!mapPeriod.has(name)) return null;

    return mapPeriod.get(name);
}

DefaultData.GetPeriodMenu=function()
{
    const data=
    [
        '分时', '五日', 
        '日线', '周线', '月线', '年线', 
        '1分钟', '5分钟', '15分钟', '30分钟', '60分钟'
    ];

    return data;
}

//分钟工具条菜单ID
var MINUTE_TOOLBAR_ID=
{
    INDEX_ID:0, // 指标
}

DefaultData.GetMinuteToolbar=function()
{
    let data=
    {
        Data:[],
        Selected:-1,
    }

    let indexMenu=
    {
        Text: '副图指标',
        Selected: [],
        Menu: 
        [ 
            {Name:"MACD"}, {Name:"DMI"}, {Name:"DMA"}, {Name:"BRAR"}, 
            {Name:"KDJ"}, {Name:"RSI"}, {Name:"WR"}, {Name:"CCI"}, {Name:"TRIX"}
        ]
    }

    data.Data[MINUTE_TOOLBAR_ID.INDEX_ID]=indexMenu;

    return data;
}

var KLINE_TOOLBAR_ID=
{
    RIGHT_ID:0,        //复权
    KLINE_INFO_ID:1,    //信息地雷
    COLOR_INDEX_ID:2,   //五彩K线
    TRADE_INDEX_ID:3,   //专家系统
    OVERLAY_ID:4,       //叠加股票
    MOUSE_DRAG_ID:5,    //鼠标拖拽
    WINDOW_COUNT_ID:6,  //窗口个数
    KLINE_TYPE_ID:7,    //主图线型 
}

DefaultData.GetKLineToolbar=function()
{
    let data=
    {
        Data:[],
        Selected:-1,
    };

    let rightMenu=
    {
        Text: '复权处理',
        Selected: [],
        Menu: [ {Name:'不复权',Value:0}, {Name:'前复权', Value:1} , {Name:'后复权', Value:2} ],
        IsShow:true,
    };

    let colorIndexMenu=
    {
        Text: '五彩K线',
        Selected: [],
        Menu: 
        [
            {Name:"十字星", Value:'五彩K线-十字星'}, {Name:"早晨之星", Value:'五彩K线-早晨之星'}, 
            {Name:"垂死十字", Value:'五彩K线-垂死十字'}, {Name:"三只乌鸦", Value:'五彩K线-三只乌鸦'},
            {Name:"光脚阴线", Value:'五彩K线-光脚阴线'}, {Name:"黄昏之星", Value:'五彩K线-黄昏之星'} 
        ],
        IsShow:true,
    };

    let tradeIndexMenu=
    {
        Text: '专家系统',
        Selected: [],
        Menu: 
        [
            {Name:"BIAS", Value:'交易系统-BIAS'}, {Name:"CCI", Value:'交易系统-CCI'}, 
            {Name:"DMI", Value:'交易系统-DMI'}, {Name:"KD", Value:'交易系统-KD'}, 
            {Name:"BOLL", Value:'交易系统-BOLL'}, {Name:"KDJ", Value:'交易系统-KDJ'}
        ],
        IsShow:true,
    };

    //叠加股票
    let overlayMenu=
    {
        Text: '叠加品种',
        Selected: [],
        Menu: 
        [
            {Name:"上证指数", Value:'000001.sh'}, {Name:"深证成指", Value:'399001.sz'}, 
            {Name:"中小板指", Value:'399005.sz'}, {Name:"创业板指", Value:'399006.sz'}, 
            {Name:"沪深300", Value:'000300.sh'}
        ],
        IsShow:true,
    }

    let klineTypeMenu=
    {
        Text: '主图线型',
        Selected: [],
        Menu: [{Name:"空心K线",Value:3}, {Name:"实心K线",Value:0}, {Name:"美国线",Value:2}, {Name:"收盘线",Value:1}],
        IsShow:true,
    };

    let windowCountMenu=
    {
        Text: '窗口个数',
        Selected: [],
        Menu: 
        [
            {Name:"1个窗口",Value:1}, {Name:"2个窗口",Value:2}, {Name:"3个窗口",Value:3}, 
            {Name:"4个窗口",Value:4}, {Name:"5个窗口",Value:5}
        ],
        IsShow:true,
    };

    let klineInfoMenu=
    {
        Text: '信息地雷',
        Selected: [],
        Menu: 
        [
            {Name:"公告", }, {Name:"业绩预告",}, {Name:"调研",}, 
            {Name:"大宗交易",}, {Name:"龙虎榜",},{Name:"互动易",},
        ],
        IsShow:true,
    };

    let mouseDragMenu=
    {
        Text: '工具',
        Selected: [],
        Menu: 
        [
            {Name:"禁止拖拽", Value:0}, {Name:"启动拖拽", Value:1}, {Name:"区间选择",Value:2},{Name:"画图工具",Value:3}
        ],
        IsShow:true,
    };

    data.Data[KLINE_TOOLBAR_ID.RIGHT_ID]=rightMenu;
    data.Data[KLINE_TOOLBAR_ID.COLOR_INDEX_ID]=colorIndexMenu;
    data.Data[KLINE_TOOLBAR_ID.TRADE_INDEX_ID]=tradeIndexMenu;
    data.Data[KLINE_TOOLBAR_ID.OVERLAY_ID]=overlayMenu;
    data.Data[KLINE_TOOLBAR_ID.KLINE_TYPE_ID]=klineTypeMenu;
    data.Data[KLINE_TOOLBAR_ID.WINDOW_COUNT_ID]=windowCountMenu;
    data.Data[KLINE_TOOLBAR_ID.KLINE_INFO_ID]=klineInfoMenu;
    data.Data[KLINE_TOOLBAR_ID.MOUSE_DRAG_ID]=mouseDragMenu;
    
    return data;
}



export default 
{
    name:'StockKLine',
    //外部传入的参数
    props: 
    [
        'DefaultPeriod',   //周期  分时,五日,日线
        'DefaultSymbol',   //默认股票
        'KLineOption',
        'MinuteOption',
        'TradeInfoTabWidth',
    ],
    components:{Stockdrawtool},
    data()
    {
        let data=
        { 
            Symbol:'600000.sh',
            ID:JSCommon.JSChart.CreateGuid(),
            topheight: 0,
            totalheight: 0,
            Minute:
            {
                JSChart:null, Option:DefaultData.GetMinuteOption(), 
                IsShow:true,   //是否显示
                IndexBar: //底部指标工具
                {
                    Menu:["MACD", "DMI", "DMA", "BRAR", "KDJ", "RSI", "WR", "CCI", "TRIX",'涨跌趋势'], 
                    Selected:[]
                },
                Toolbar:DefaultData.GetMinuteToolbar(),    //工具菜单
            },
            KLine:
            {
                JSChart:null,Option:DefaultData.GetKLineOption(), 
                IsShow:false,
                IndexBar: //底部指标工具
                {
                    Menu:['BBI', 'MA', 'HMA', 'LMA', 'VMA', 'BOLL', 'SKDJ', 'KDJ', 'MACD', 'RSI', 'OBV', 'BIAS'],
                    Selected:[] 
                },
                Toolbar:DefaultData.GetKLineToolbar(),
            },
            PeriodBar:  //周期菜单工具条
            {
                Menu:DefaultData.GetPeriodMenu(),
                IsShow:true,
                Selected:0, //当前选中的菜单
            },

            TradeInfoTab:
            {
                IsShow:true,    //买卖盘是否显示
                Width:230,      //买卖盘宽度
            },
            KLineItemShow:[false,false,false,false,false,false,false,false],
            
            Event:
            {
                ChangePeriodEvent:null, //周期改变事件 function(name)
            },

            DrawTool:
            {
                IsShow:false,
            }
        }

        return data;
    },

    created:function()
    {
        //处理默认传入的参数
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol; //默认股票
        if (this.DefaultPeriod) //默认周期
        {
            var period=DefaultData.GetPeriodData(this.DefaultPeriod);
            if (period)
            {
                this.Minute.IsShow=period.MinuteShow;
                this.KLine.IsShow=period.KLineShow;
                if (period.KLineShow) this.KLine.Option.Period=period.Value;
                if (period.MinuteShow) this.Minute.Option.DayCount=period.Value;
                //修改周期工具条菜单选中
                const menu=DefaultData.GetPeriodMenu();
                let selected=menu.indexOf(this.DefaultPeriod);
                this.PeriodBar.Selected=selected;
            }
        }

        if (this.KLineOption) this.SetDefaultKLineOption(this.KLineOption);
        if (this.MinuteOption) this.SetDefaultMinuteOption(this.MinuteOption);
        if (this.TradeInfoTabWidth>0) this.TradeInfoTab.Width=this.TradeInfoTabWidth;
    },

    mounted:function()
    {
        console.log(`[StockKLine::mounted]`);
        this.OnSize();

        if (this.Minute.IsShow) this.CreateMinuteChart();
        else if (this.KLine.IsShow) this.CreateKLineChart();

        this.UpateMenuStatus();
        
        var self=this;
        document.addEventListener('click', (e) => 
        {
            //弹出菜单 在其他区域点击 自动隐藏
            if (!$('#chartbar').is(e.target) && $('#chartbar').has(e.target).length === 0) 
                self.HideToolbarPopMenu();
        });
    },

    methods:
    {
        OnSize:function()
        {
            var stockKLine=this.$refs.stockkline;
            var divPeriodBar=this.$refs.divperiodbar;
            var divChart=this.$refs.divchart;
            var divChartBar=this.$refs.divchartbar;

            var minuteIndexBar=this.$refs.minuteindexbar;
            var klineIndexBar=this.$refs.klineindexbar;
            var indexBarHeight=minuteIndexBar.offsetHeight+klineIndexBar.offsetHeight;

            var height= stockKLine.offsetHeight;
            var width = stockKLine.offsetWidth;
            var chartHeight=height - divPeriodBar.offsetHeight - divChartBar.offsetHeight - indexBarHeight; //图形高度=总高-周期工具条高-子工具条高-底部指标工具条高
            var chartWidth=width;

            //总高度
            this.totalheight = height;
            // 画笔工具总高度需减去的高度
            this.topheight = divPeriodBar.offsetHeight + divChartBar.offsetHeight;

            divChart.style.width=chartWidth+'px';
            divChart.style.height=chartHeight+'px';
            
            var divMinute=this.$refs.minute;
            divMinute.style.width=chartWidth+'px';
            divMinute.style.height=chartHeight+'px';
            if (this.Minute.JSChart) this.Minute.JSChart.OnSize();

            var divKline=this.$refs.kline;
            divKline.style.width=chartWidth+'px';
            divKline.style.height=chartHeight+'px';
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize();

            if (this.KLine.JSChart)
            {
                let chart=this.KLine.JSChart.JSChartContainer;
                let StockChip=chart.GetExtendChartByClassName('StockChip');
                if (StockChip)
                {
                    klineIndexBar.style.width=(width-this.TradeInfoTab.Width)+'px';
                }
                else
                {
                    klineIndexBar.style.width='100%';
                }
            }

            if(this.KLine.IsShow){
                var totalWidth = width - 20;
                var dispalyAry = [];
                if(this.IsSHSZIndex){ //是指数
                    var startIndex = 2, endIndex = 7;
                    dispalyAry = [false,false,true,true,true,true,true,true];
                }else{
                    var startIndex = 0, endIndex = 7;
                    dispalyAry = [true,true,true,true,true,true,true,true];
                }
                var currentWdith = 0;
                var itemHeight = $('#barForKLine>.item').outerWidth(true);
                for(let i = startIndex; i <= endIndex; i++){
                    currentWdith += itemHeight;
                    if(currentWdith <= totalWidth){
                        dispalyAry[i] = true;
                    }else{
                        dispalyAry[i] = false;
                    }
                }
                this.KLineItemShow = dispalyAry;
            }
           
            console.log(`[StockKLine::OnSize] Chart:(${width},${height})`);
        },

        //创建日线图
        CreateMinuteChart:function()
        {
            if (this.Minute.JSChart) return;
            this.Minute.Option.Symbol=this.Symbol;
            let chart=JSCommon.JSChart.Init(this.$refs.minute);
            chart.SetOption(this.Minute.Option);
            this.Minute.JSChart=chart;

            this.UpdateIndexBarSelected();
        },

        //历史K线周期切换
        ChangeKLinePeriod:function(period)
        {
            if (!this.KLine.JSChart)    //不存在创建
            {
                this.KLine.Option.Period=period;
                this.CreateKLineChart();
            }
            else
            {
                this.KLine.JSChart.ChangePeriod(period);
            }
        },

        //走势图多日切换
        ChangeMinutePeriod:function(period)
        {
            if (!this.Minute.JSChart)   //不存在创建
            {
                this.Minute.Option.DayCount=period;
                this.CreateMinuteChart();
            }
            else
            {
                this.Minute.JSChart.ChangeDayCount(period);
            }
        },

        //创建K线图
        CreateKLineChart:function()
        {
            if (this.KLine.JSChart) return;
            this.KLine.Option.Symbol=this.Symbol;
            let chart=JSCommon.JSChart.Init(this.$refs.kline);
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart=chart;

            this.UpdateIndexBarSelected();
        },

        //走势图 K线图 周期切换
        ChangeChartPeriod:function(name)
        {
            var period=DefaultData.GetPeriodData(name);
            if (!period) return;
            if (period.KLineShow) this.ChangeKLinePeriod(period.Value);
            this.KLine.IsShow=period.KLineShow;
            if (period.MinuteShow) this.ChangeMinutePeriod(period.Value);
            this.Minute.IsShow=period.MinuteShow;
        },

        ChangeSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            this.Symbol=symbol;
            if (this.KLine.JSChart) this.KLine.JSChart.ChangeSymbol(this.Symbol);
            if (this.Minute.JSChart) this.Minute.JSChart.ChangeSymbol(this.Symbol);

            this.UpateMenuStatus();
            
        },

        //更新菜单 
        UpateMenuStatus:function()
        {
            //指数隐藏复权，信息地雷
            var isIndex=JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.RIGHT_ID].IsShow=!isIndex;
            this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.KLINE_INFO_ID].IsShow=!isIndex;
        },

        SetDefaultKLineOption:function(option)
        {
            if (option.Windows) this.KLine.Option.Windows=option.Windows;
            if (option.TradeIndex) this.KLine.Option.TradeIndex=option.TradeIndex;
            if (option.ColorIndex) this.KLine.Option.ColorIndex=option.ColorIndex;
            if (option.KLine)
            {
                if (option.KLine.Info) this.KLine.Option.KLine.Info=option.KLine.Info;
                if (option.KLine.Right>=0) this.KLine.Option.KLine.Right=option.KLine.Right;
            }
        },

        SetDefaultMinuteOption:function(option)
        {
            if (option.Windows) this.Minute.Option.Windows=option.Windows;
        },

        //更新指标工具菜单选中
        UpdateIndexBarSelected:function()
        {
            if (this.KLine.JSChart && this.KLine.JSChart.JSChartContainer)
            {
                this.KLine.IndexBar.Selected=[];
                var aryIndex=this.KLine.JSChart.JSChartContainer.GetIndexInfo();
                for(var i=0;i<2 && i<aryIndex.length;++i)
                {
                    var item=aryIndex[i];
                    var index=this.KLine.IndexBar.Menu.indexOf(item.ID);
                    if (index>=0) this.KLine.IndexBar.Selected.push(index);
                }
            }

            if (this.Minute.JSChart && this.Minute.JSChart.JSChartContainer)
            {
                this.Minute.IndexBar.Selected=[];
                var aryIndex=this.Minute.JSChart.JSChartContainer.GetIndexInfo();
                for(var i=0;i<2 && i<aryIndex.length;++i)
                {
                    var item=aryIndex[i];
                    var index=this.Minute.IndexBar.Menu.indexOf(item.ID);
                    if (index>=0) this.Minute.IndexBar.Selected.push(index);
                }
            }
        },

        UpdateMinuteIndexMenu:function()
        {
            var aryIndex=this.Minute.JSChart.JSChartContainer.GetIndexInfo();
            var indexMenu=this.Minute.Toolbar.Data[MINUTE_TOOLBAR_ID.INDEX_ID];
            indexMenu.Selected=[];
            const aryMenu=indexMenu.Menu.map(item=> item.Name);
            for(var i=0;i<2 && i<aryIndex.length;++i)
            {
                var item=aryIndex[i];
                var index=aryMenu.indexOf(item.ID);
                if (index>=0) indexMenu.Selected.push(index);
            }
        },

        //复权菜单
        UpateKLineRightMenu:function()
        {
            var rightValue=this.KLine.JSChart.JSChartContainer.Right;
            var rightMenu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.RIGHT_ID];
            rightMenu.Selected=[];
            const aryMenu=rightMenu.Menu.map(function(item,index)
            {
                if (item.Value===rightValue) rightMenu.Selected.push(index);
            });
        },

        //五彩K线
        UpateColorIndexMenu:function()
        {
            var colorIndexMenu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.COLOR_INDEX_ID];
            colorIndexMenu.Selected=[];
            const aryMenu=colorIndexMenu.Menu.map(item=>item.Value);
            const DELETE_MENU_NAME='取消';
            if (this.KLine.JSChart.JSChartContainer.ColorIndex)
            {
                var id=this.KLine.JSChart.JSChartContainer.ColorIndex.ID;
                var index=aryMenu.indexOf(id);
                if (index>=0) colorIndexMenu.Selected.push(index);
                if (aryMenu.indexOf(DELETE_MENU_NAME)<0)
                {
                    var chart=this.KLine.JSChart;
                    var delMenu={Name:DELETE_MENU_NAME, Value:DELETE_MENU_NAME, OnClick:function() {chart.CancelInstructionIndex();} };
                    colorIndexMenu.Menu.push(delMenu);
                }
            }
            else    //删除'删除五彩K线' 菜单
            {
                var newMenu=[];
                colorIndexMenu.Menu.map(function(item,index){
                    if (item.Name!=DELETE_MENU_NAME) newMenu.push(item);
                })

                colorIndexMenu.Menu=newMenu;
            }
        },

        UpateTradeIndexMenu:function()
        {
            var tradeIndexMenu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.TRADE_INDEX_ID];
            tradeIndexMenu.Selected=[];
            const aryMenu=tradeIndexMenu.Menu.map(item=>item.Value);
            const DELETE_MENU_NAME='取消';
            if (this.KLine.JSChart.JSChartContainer.TradeIndex)
            {
                var id=this.KLine.JSChart.JSChartContainer.TradeIndex.ID;
                var index=aryMenu.indexOf(id);
                if (index>=0) tradeIndexMenu.Selected.push(index);
                if (aryMenu.indexOf(DELETE_MENU_NAME)<0)
                {
                    var chart=this.KLine.JSChart;
                    var delMenu={Name:DELETE_MENU_NAME, Value:DELETE_MENU_NAME, OnClick:function() {chart.CancelInstructionIndex();} };
                    tradeIndexMenu.Menu.push(delMenu);
                }
            }
            else    //删除'删除五彩K线' 菜单
            {
                var newMenu=[];
                tradeIndexMenu.Menu.map(function(item,index){
                    if (item.Name!=DELETE_MENU_NAME) newMenu.push(item);
                })

                tradeIndexMenu.Menu=newMenu;
            }
        },

        UpdateOverlayMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.OVERLAY_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(item=>item.Value);
            var chart=this.KLine.JSChart.JSChartContainer;
            const DELETE_MENU_NAME='取消叠加';
            if (chart.OverlayChartPaint && chart.OverlayChartPaint[0] && chart.OverlayChartPaint[0].Symbol)
            {
                var symbol=chart.OverlayChartPaint[0].Symbol;
                var index=aryMenu.indexOf(symbol);
                if (index>=0) menu.Selected.push(index);
               
                if (aryMenu.indexOf(DELETE_MENU_NAME)<0)
                {
                    var chart=this.KLine.JSChart;
                    var delMenu={Name:DELETE_MENU_NAME, Value:DELETE_MENU_NAME, OnClick:function() {chart.ClearOverlaySymbol();} };
                    menu.Menu.push(delMenu);
                }
            }
            else
            {
                var newMenu=[];
                menu.Menu.map(function(item,index){
                    if (item.Name!=DELETE_MENU_NAME) newMenu.push(item);
                })

                menu.Menu=newMenu;
            }
        },

        //K线类型
        UpdateKLineTypeMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.KLINE_TYPE_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(item=>item.Value);
            var index=aryMenu.indexOf(this.KLine.JSChart.JSChartContainer.KLineDrawType);
            if (index>=0) menu.Selected.push(index);
        },

        // 窗口个数
        UpdateWindowCountMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.WINDOW_COUNT_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(item=>item.Value);
            var count=this.KLine.JSChart.JSChartContainer.Frame.SubFrame.length;
            var index=aryMenu.indexOf(count);
            if (index>=0) menu.Selected.push(index);
        },

        UpdateKLineInfoMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.KLINE_INFO_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(function(item,index)
            {
                var classInfo=JSCommon.JSKLineInfoMap.GetClassInfo(item.Name);
                if (classInfo) return classInfo.ClassName;
                else return item.Name;
            });

            var jsChart=this.KLine.JSChart;
            var chart=jsChart.JSChartContainer;
            var aryInfo=[];
            for(var i in chart.ChartInfo)
            {
                var item=chart.ChartInfo[i];
                var index=aryMenu.indexOf(item.ClassName);
                if (index>=0) menu.Selected.push(index);
            }

            const DELETE_MENU_NAME='取消';
            if(chart.ChartInfo && chart.ChartInfo.length>0)
            {
                if (aryMenu.indexOf(DELETE_MENU_NAME)<0)
                {
                    var delMenu={Name:DELETE_MENU_NAME, Value:DELETE_MENU_NAME, OnClick:function() {jsChart.ClearKLineInfo();} };
                    menu.Menu.push(delMenu);
                }
            }
            else
            {
                var newMenu=[];
                menu.Menu.map(function(item,index){
                    if (item.Name!=DELETE_MENU_NAME) newMenu.push(item);
                })

                menu.Menu=newMenu;
            }
        },

        UpdateMouseDragMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.MOUSE_DRAG_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(item=>item.Value);
            var index=aryMenu.indexOf(this.KLine.JSChart.JSChartContainer.DragMode);
            if (index>=0) menu.Selected.push(index);
        },

        //隐藏2级工具条弹出菜单
        HideToolbarPopMenu:function()
        {
            this.KLine.Toolbar.Selected=-1;
            this.Minute.Toolbar.Selected=-1;
        },

        ShowStockChip:function(isShow)
        {
            var chart=this.KLine.JSChart.JSChartContainer;
            chart.StockChipWidth=this.TradeInfoTab.Width;   //设置移动筹码宽度
            var StockChip=chart.GetExtendChartByClassName('StockChip');
            if (isShow)
            {
                if (StockChip) return;
                var option={Name:'筹码分布', IsAutoIndent:1, ShowType:1};
                var extendChart=chart.CreateExtendChart(option.Name, option);   //创建扩展图形
                chart.Frame.ChartBorder.Right+=chart.StockChipWidth;
                chart.SetSizeChage(true);
                chart.Draw();
            }
            else
            {
                if (!StockChip) return;
                chart.DeleteExtendChart(StockChip); 
                if (StockChip.Chart.IsAutoIndent==1)
                {
                    chart.Frame.ChartBorder.Right-=chart.StockChipWidth;
                    chart.SetSizeChage(true);
                    chart.Draw();
                }
            }
        },

        ///////////////////////////////////////////////////////////////////////
        //菜单工具条事件
        OnClickPeriodMenu:function(idx, event)
        {
            var name = event.currentTarget.text;
            this.PeriodBar.Selected = idx;
            this.ChangeChartPeriod(name);
            if (this.Event.ChangePeriodEvent) this.Event.ChangePeriodEvent(name);
        },

        OnClickIndexBar:function(chartType,name,index)
        {
            switch(chartType)
            {
                case 'minute':
                    this.Minute.JSChart.ChangeIndex(1,name);
                    break;
                case 'kline':
                    this.KLine.JSChart.ChangeIndex(1,name);
                    break;
                default:
                    return;
            }

            this.UpdateIndexBarSelected();
        },

        //一级菜单
        OnClickToolBar:function(chartType,menu,index)
        {
            console.log("[OnClickToolBar] ",chartType,menu,index);

            if (chartType=='minute')
            {
                if (this.Minute.Toolbar.Selected==index) this.Minute.Toolbar.Selected=-1;
                else this.Minute.Toolbar.Selected=index;

                switch(menu.Text)
                {
                    case '副图指标':
                        this.UpdateMinuteIndexMenu();
                        break;
                }

                console.log("[OnClickToolBar] ",this.Minute.Toolbar.Selected);
            }
            else if (chartType=='kline')
            {
                if (this.KLine.Toolbar.Selected==index) this.KLine.Toolbar.Selected=-1;
                else this.KLine.Toolbar.Selected=index;

                switch(menu.Text)
                {
                    case '复权处理':
                        this.UpateKLineRightMenu();
                        break;
                    case '五彩K线':
                        this.UpateColorIndexMenu();
                        break;
                    case '专家系统':
                        this.UpateTradeIndexMenu();
                        break;
                    case '叠加品种':
                        this.UpdateOverlayMenu();
                        break;
                    case "主图线型":
                        this.UpdateKLineTypeMenu();
                        break;
                     case '窗口个数':
                        this.UpdateWindowCountMenu();
                        break;
                    case '信息地雷':
                        this.UpdateKLineInfoMenu();
                        break;
                    case '工具': 
                        this.UpdateMouseDragMenu();
                        break;
                }

            }
            
        },

        //2级菜单
        OnClickToolBarMenu:function(chartType,mainMenu,secMenu,index)
        {
            console.log("[OnClickToolBarMenu] ",mainMenu,secMenu,index);
            if (chartType=='minute')
            {
                switch(mainMenu.Text)
                {
                    case '副图指标':
                        this.Minute.JSChart.ChangeIndex(1,secMenu.Name);
                        this.UpdateIndexBarSelected();
                        break;
                }
                this.Minute.Toolbar.Selected = -1; //下标不相等，隐藏二级菜单
            }
            else if (chartType=='kline')
            {
                switch(mainMenu.Text)
                {
                    case '复权处理':
                        this.KLine.JSChart.ChangeRight(secMenu.Value);
                        break;
                    case '五彩K线':
                        if (secMenu.OnClick) secMenu.OnClick();
                        else this.KLine.JSChart.ChangeInstructionIndex(secMenu.Value)
                        break;
                    case '专家系统':
                        if (secMenu.OnClick) secMenu.OnClick();
                        else this.KLine.JSChart.ChangeInstructionIndex(secMenu.Value)
                        break;
                    case '叠加品种':
                        if (secMenu.OnClick) secMenu.OnClick();
                        else this.KLine.JSChart.OverlaySymbol(secMenu.Value);
                        break;
                    case '主图线型':
                        this.KLine.JSChart.ChangeKLineDrawType(secMenu.Value);
                        break;
                    case '窗口个数':
                        this.KLine.JSChart.ChangeIndexWindowCount(secMenu.Value);
                        break;
                    case '信息地雷':
                        if (secMenu.OnClick) secMenu.OnClick();
                        else this.KLine.JSChart.AddKLineInfo(secMenu.Name,true);
                        break;
                    case '工具': 
                        console.log('[StockKLine::OnClickToolBarMenu] click dragmode ',this.KLine.JSChart.JSChartContainer);
                        if(secMenu.Value != 3)
                        {
                            this.KLine.JSChart.JSChartContainer.DragMode=secMenu.Value;
                        }
                        else
                        { //画图工具
                            console.log('[StockKLine::OnClickToolBarMenu] click draw tool');
                            //获取到工具的名称：线段
                            //this.KLine.JSChart.JSChartContainer.CreateChartDrawPicture('名称')
                            this.DrawTool.IsShow = true;
                        }
                        break;
                }
                this.KLine.Toolbar.Selected=-1;
            }
        },

        CurrentIcon(name)
        {
            console.log('[StockKLine::CurrentIcon] click', name);
            this.KLine.JSChart.JSChartContainer.CreateChartDrawPicture(name);
            if(name==='全部删除'){
                 this.KLine.JSChart.JSChartContainer.ClearChartDrawPicture();
            }
        },

        isShowBrushTool( brushTool){
            this.DrawTool.IsShow = brushTool;
        },

    }
}


</script>


<style scoped lang="scss">

$border: 1px solid #e1ecf2;

* {
    font: 14px/normal "Microsoft Yahei";
    color: #666;
    padding: 0;
    margin: 0;
}

/*链接不显示下划线*/
a 
{
    text-decoration: none;
}

.stockkline 
{
    width:100%;
    height:100%;

    .brushTool{
        position: relative;
        left:0;
        bottom: 0;
    }
}

.minute
{
    left:0px;
    top:0px;
    position: relative;
    width:100%;
    height:100%;
}

.kline
{
    left:0px;
    top:0px;
    position: relative;
    width:100%;
    height:100%;
}

/* 周期菜单 */
.periodbar 
{
    height: 36px;
    background-color: #217cd9;
    padding-left: 36px;
    padding-right: 30px;
    overflow: hidden;
}

.periodbar .item 
{
    color: #fff;
    display: inline-block;
    font-size: 14px;
    line-height: 1;
    padding: 4px 12px;
    margin-top: 8px;
    margin-right: 26px;
    border-radius: 10px;
}

.periodbar .item.active 
{
    color: #217cd9;
    background-color: #fff;
}

/*底部指标*/
.indexbar 
{
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    background-color: #e1ecf2;
}

.indexbar span 
{
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    flex-grow: 1;
}

.indexbar span.active 
{
    color: #fff;
    background-color: #125fd9;
}

/*图形操作工具条 */
.chartbar
{
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    border-bottom: 1px solid #d9d9d9;
    position: relative;
    z-index: 999;

    //隐藏菜单
    #barForMinute,#barForKLine>.hide_item
    {
        display: inline-block;
        cursor: pointer;
        //height: 32px;
        line-height: 32px;
        padding-top: 6px;
        position: relative;
        box-sizing: border-box;
    }

    #barForMinute,#barForKLine>.item 
    {
        display: inline-block;
        cursor: pointer;
        //height: 32px;
        line-height: 32px;
        width:104px;
        padding-top: 6px;
        position: relative;
        margin-right: 15px;
        box-sizing: border-box;

        .menuOne 
        {
            border: 1px solid;
            border-color: transparent;
            border-bottom: none;
            display: inline-block;
            width: 100%;
            height: 26px;
            vertical-align: top;
            padding: 0 14px 6px 14px;
            box-sizing: border-box;
        }

        .menuOne:hover,
        .menuOne.light 
        {
            border-color: #d9d9d9;

            >span 
            {
                color: #217cd9;
            }
        }

        .menuTwo 
        {
            position: absolute;
            background-color: #fff;
            top: 32px;
            left: 0;
            border: 1px solid #d9d9d9;
            border-top: none;
            box-sizing: border-box;
            width: 100%;

            >li 
            {
                padding: 0 12px;
                line-height: 32px;
            }

            >li:hover,
            >li.active 
            {
                color: #217cd9;
            }
        }
    }

    >.item:nth-child(1) 
    {
        .menuOne {
            padding: 0 10px;
        }
    }

    >.item:nth-child(7) {
        .menuOne {
            padding: 0 30px;
        }
    }

    .iconfont {
        font-size: 13px;
    }
}

</style>