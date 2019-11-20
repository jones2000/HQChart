<template>
    <div class="stockkline" ref='stockkline' :class='blackStyle ? "klineDarkTheme" :"klineLightTheme"'>
        
        <!-- 指数选项卡  !-->
        <div ref='divperiodtooltab'>
            <div class="periodbar" v-if="isIndex && isNoFullChart">
                <div class="preiod">
                    <div class="itemList">
                        <a class="item" v-for='(navItem,idx) in compositeTab.Menu' :key='idx' :class='compositeTab.Selected == idx ? "active":""'
                            @click='checkFlatTab(idx)'>{{navItem}}</a>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="compositeTab.Selected === 0">
            <!-- 周期工具条  !-->
            <div :class="isIndex?'periodIndexbar':'periodbar'" ref='divperiodbar'>
                <div class="preiod">
                    <div class="itemList">
                        <a class="item" v-for='(navItem,idx) in PeriodBar.Menu' :key='idx' :class='PeriodBar.Selected == idx ? "active":""'
                            @click='OnClickPeriodMenu(idx,$event)'>{{navItem}}</a>
                    </div>
                    
                    <div class="lineGroup">
                        <!-- <div class="lineSelect" id="curveLineTypeMenu" style="width: 104px" v-if="isIndex">
                            <p class="menuOne light" @click="toggleSingleMenu('curveLineType')">
                                <i class='iconfont icon-line_p1'></i>
                                <span>{{curveLineTypeMenu.Text}}</span>
                                <i :class='curveLineTypeMenu.Opened > 0 ? "el-icon-caret-top" : "el-icon-caret-bottom"'></i>
                            </p>
                            <ul class="menuTwo" v-show='curveLineTypeMenu.Opened > 0'>
                                <li
                                    v-for="(item, index) in curveLineTypeMenu.Menu"
                                    :key="item.Name"
                                    :class='{active:curveLineTypeMenu.Selected === index}'
                                    @click.stop="changeSingleMenuValue('curveLineType', item, index)">
                                    <i class='iconfont' :class="item.icon"></i> {{item.Name}}
                                </li>
                            </ul>
                        </div> -->
                        <div style="width: 72px; padding-top: 9px"><el-checkbox v-if="Minute.IsShow" @change="valueChange">面积图</el-checkbox></div>
                        <div class="fullChart">
                            <div class="noFull" @click="fullChart" v-if="isNoFullChart"></div>
                            <div class="isFull" @click="fullChart" v-if="!isNoFullChart"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!--  图形操作工具条  !-->
            <div class='chartbar' ref='divchartbar' id='chartbar' v-show="KLine.IsShow">
                <!-- 分时图设置导航条 -->
                <!-- <div id='barForMinute' v-show="Minute.IsShow">
                    <div class="item" v-for='(menuOne,index) in Minute.Toolbar.Data' :key='menuOne.Text' @click="OnClickToolBar('minute',menuOne,index)">
                        <p class="menuOne" :class='{light:Minute.Toolbar.Selected == index}'>
                            <span>{{menuOne.Text}}</span>
                            <i :class='Minute.Toolbar.Selected == index ? "el-icon-caret-top" : "el-icon-caret-bottom"'></i>
                        </p>
                        <ul class="menuTwo" v-show='Minute.Toolbar.Selected == index ? true:false'>
                            <li v-for='(menuItem,ind) in menuOne.Menu' :class='{active:menuOne.Selected.indexOf(ind)>=0}' :key='ind'
                                @click.stop="OnClickToolBarMenu('minute',menuOne,menuItem,ind)">{{menuItem.Name}}</li>
                        </ul>
                    </div>
                </div> -->

                <!-- k线设置导航条  -->
                <div id='barForKLine'>
                    <div :class="[menuOne.IsShow==true? 'item':'hide_item']" v-for='(menuOne,index) in KLine.Toolbar.Data' :key='menuOne.Text' v-show="KLineItemShow[index]" @click="OnClickToolBar('kline',menuOne,index)" >
                        <p class="menuOne" :class='{light:KLine.Toolbar.Selected == index}' v-show='menuOne.IsShow'>
                                <span>{{menuOne.Text}}</span>
                                <i :class='KLine.Toolbar.Selected == index ? "el-icon-caret-top" : "el-icon-caret-bottom"'></i>
                        </p>
                        <ul class="menuTwo" v-show='KLine.Toolbar.Selected == index ? true:false'>
                            <li v-for='(menuItem,ind) in menuOne.Menu' :class='{active:menuOne.Selected.indexOf(ind)>=0}' :key='ind'
                                @click.stop="OnClickToolBarMenu('kline',menuOne,menuItem,ind)">{{menuItem.Name}}</li>
                        </ul>
                    </div>
                    <div id="contrastStockMenu" class="item" v-if="KLine.IsShow && isIndex">
                        <p class="menuOne" @click="toggleSingleMenu('contrastStock')">
                            <span>{{contrastStockMenu.Text}}</span>
                            <i :class='contrastStockMenu.Opened > 0 ? "el-icon-caret-top" : "el-icon-caret-bottom"'></i>
                        </p>
                        <ul class="menuTwo" v-show='contrastStockMenu.Opened > 0'>
                            <li
                                v-for="(item, index) in contrastStockMenu.Menu"
                                :key="item.Name"
                                :class='{active:contrastStockMenu.Selected === index}'
                                @click.stop="changeSingleMenuValue('contrastStock', item, index)">
                                {{item.Name}}
                            </li>
                            <li
                                v-if="contrastStockMenu.Selected > -1"
                                @click.stop="changeSingleMenuValue('contrastStock', null, -1)">
                                取消对比
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="brushTool" v-if="DrawTool.IsShow">
                <Stockdrawtool @CurrentIcon = "CurrentIcon" @IsShowBrushTool="isShowBrushTool" :topheight="topheight" :totalheight="totalheight"></Stockdrawtool>
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
        <div class="historyLine" v-show="compositeTab.Selected === 1">
            <div class="historyPeriodbar">
                <div class="preiod">
                    <div style="margin-right: 10px">
                        时间周期:
                        <el-date-picker
                            v-model="value7"
                            @change="historyDataChange"
                            size="small"
                            format="yyyyMMdd"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :popper-class="blackStyle?'dark-theme-picker':''"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>
                    <div style="margin-right: 10px">
                        <div class="lineSelect" id="dataFrequencyMenu">
                            <p class="menuOne" @click="toggleSingleMenu('dataFrequency')">
                                <span>{{dataFrequencyMenu.Text}}</span>
                                <i :class='dataFrequencyMenu.Opened > 0 ? "el-icon-caret-top" : "el-icon-caret-bottom"'></i>
                            </p>
                            <ul class="menuTwo" v-show='dataFrequencyMenu.Opened > 0'>
                                <li
                                    v-for="(item, index) in dataFrequencyMenu.Menu"
                                    :key="item.Name"
                                    :class='{active:dataFrequencyMenu.Selected === index}'
                                    @click.stop="changeSingleMenuValue('dataFrequency', item, index)">
                                    {{item.Name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="downloadHistroyData" @click="downloadHistroyData">下载数据</div>
                </div>
            </div>
            <el-table
                :height="historyTableHeight"
                :data="PageData"
                style="width: 100%">
                <el-table-column
                    prop="Date"
                    label="日期">
                </el-table-column>
                <el-table-column
                    prop="MaxPrice"
                    label="最高价">
                </el-table-column>
                <el-table-column
                    prop="Open"
                    label="开盘价">
                </el-table-column>
                <el-table-column
                    prop="MinPrice"
                    label="最低价">
                </el-table-column>
                <el-table-column
                    prop="Close"
                    label="收盘价">
                </el-table-column>
                <el-table-column
                    prop="Vol"
                    label="成交量">
                </el-table-column>
                <el-table-column
                    prop="Amount"
                    label="成交额">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script type="text/javascript">

import $ from 'jquery'
import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
import JSCommonStock from 'hqchart/src/jscommon/umychart.vue/umychart.stock.vue.js'
import StringFormat from 'hqchart/src/jscommon/umychart.vue/stockstringformat.js'
import Stockdrawtool from '../../../components/stockdrawtool.vue'

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
        MinuteLine:
        {
            //IsDrawAreaPrice:false,      //是否画价格面积图
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
    // COLOR_INDEX_ID:2,   //五彩K线
    // TRADE_INDEX_ID:3,   //专家系统
    // OVERLAY_ID:4,       //叠加股票
    // IMPORTANT_MATTERS:1,    //重大事项
    MOUSE_DRAG_ID:2,    //工具
    KLINE_TYPE_ID:3,    //主图线型 
    WINDOW_COUNT_ID:4,  //窗口个数
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

    let klineTypeMenu=
    {
        Text: '主图线型',
        Selected: [],
        Menu: [{Name:"空心K线",Value:3}, {Name:"实心K线",Value:0}, {Name:"美国线",Value:2}, {Name:"收盘线",Value:1}],
        IsShow:true,
    };

    // let klineInfoMenu = 
    // {
    //     Text: '重大事项',
    //     Selected: [],
    //     Menu: [
    //             {Name:"定期报告",Value:"公告"}, 
    //             {Name:"业绩报告",Value:"业绩预告"},
    //             {Name:"公开信息",Value:"公开信息"}, 
    //             {Name:"分红派息",Value:"分红派息"}, 
    //             {Name:"融资激励",Value:"融资激励"},
    //             {Name:"高管交易",Value:"高管交易"}, 
    //             {Name:"股东交易",Value:"股东交易"}, 
    //             {Name:"大宗交易",Value:"大宗交易"}
    //         ],
    //     IsShow:true,
    // }

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
        Text: '重大事项',//信息地雷
        Selected: [],
        Menu: 
        [
            {Name:"公告", }, {Name:"业绩预告",}, {Name:"调研",}, 
            {Name:"大宗交易",}, {Name:"龙虎榜",},{Name:"互动易",},
        ],
        IsShow:true,
    };

    

    data.Data[KLINE_TOOLBAR_ID.RIGHT_ID]=rightMenu;
    // data.Data[KLINE_TOOLBAR_ID.IMPORTANT_MATTERS]=ImportantMatters;
    // data.Data[KLINE_TOOLBAR_ID.COLOR_INDEX_ID]=colorIndexMenu;
    // data.Data[KLINE_TOOLBAR_ID.TRADE_INDEX_ID]=tradeIndexMenu;
    // data.Data[KLINE_TOOLBAR_ID.OVERLAY_ID]=overlayMenu;
    data.Data[KLINE_TOOLBAR_ID.KLINE_TYPE_ID]=klineTypeMenu;
    data.Data[KLINE_TOOLBAR_ID.WINDOW_COUNT_ID]=windowCountMenu;
    data.Data[KLINE_TOOLBAR_ID.KLINE_INFO_ID]=klineInfoMenu;
    data.Data[KLINE_TOOLBAR_ID.MOUSE_DRAG_ID]=mouseDragMenu;
    return data;
}



let curveLineTypeMenu=
{
    Text: '曲线',
    Opened: false,
    Menu: 
    [
        {
            Name:"折线",
            icon: 'icon-line_p2'
        },
        {
            Name:"面积",
            icon: 'icon-line_p3'
        },
        {
            Name:"K线",
            icon: 'icon-line_p4'
        }
    ],
    IsShow:true,
    Selected:-1,
};


let compositeTab=
{
    Menu:
    [
        '行情', '历史数据',
        // '样本', '相关产品'
    ],
    IsShow:true,
    Selected:0,
}

let contrastStockMenu=
{
    Text: '指数对比',
    Opened: false,
    Menu: 
    [
        {Name:"上证指数", Value:'000001.sh'}, {Name:"深证成指", Value:'399001.sz'}, 
        {Name:"中小板指", Value:'399005.sz'}, {Name:"创业板指", Value:'399006.sz'}, 
        {Name:"沪深300", Value:'000300.sh'}
    ],
    IsShow:true,
    Selected:-1
};

let dataFrequencyMenu = 
{
    Text: '频率',
    Opened: false,
    Menu: 
    [
        {Name:"日度", Value:'0'},
        {Name:"周度", Value:'1'}, 
        {Name:"月度", Value:'2'}
    ],
    IsShow:true,
    Selected:0
};

function convertTime(UTCDateString){
    if (!UTCDateString) {
        return;
      }
      function formatFunc(str) {
        //格式化显示
        return str > 9 ? str : "0" + str;
      }

      var date = new Date(UTCDateString);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());

      var dateStr = year + mon + day;
      return dateStr;
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
        "isNoFullChart",
        "blackStyle"
        // 'TradeInfoTabWidth',
    ],
    components:{Stockdrawtool},
    data()
    {
        let data=
        { 
            Symbol:'600000.sh',
            ID:HQChart.Chart.JSChart.CreateGuid(),
            topheight: 0,
            totalheight: 0,
            Minute:
            {
                JSChart:null,
                Option:DefaultData.GetMinuteOption(), 
                IsShow:true,   //是否显示
                IndexBar: //底部指标工具
                {
                    Menu:['RSI','MACD','KDJ','BOLL','DMI','CCI','OBV','SKDJ','BIAS'], 
                    // Menu:["MACD", '量比', "DMI", "DMA", "BRAR", "KDJ", "RSI", "WR", "CCI", "TRIX",'涨跌趋势'], 
                    Selected:[]
                },
                Toolbar:DefaultData.GetMinuteToolbar(),    //工具菜单
            },
            KLine:
            {
                JSChart:null,
                Option:DefaultData.GetKLineOption(), 
                IsShow:false,
                IndexBar: //底部指标工具
                {
                    Menu:['RSI','MACD','KDJ','BOLL','DMI','CCI','OBV','SKDJ','BIAS'],
                    // Menu:['BBI', 'MA', 'HMA', 'LMA', 'VMA', 'BOLL', 'SKDJ', 'KDJ', 'MACD', 'RSI', 'OBV', 'BIAS'],
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
            KLineItemShow:[true,true,true,true],
            
            Event:
            {
                ChangePeriodEvent:null, //周期改变事件 function(name)
            },

            DrawTool:
            {
                IsShow:false,
            },
            isIndex: false,
            curveLineTypeMenu,
            compositeTab,
            contrastStockMenu,
            HistoryData:null,
            SomeDatesDay:[],
            PageData: [],
            historyTableHeight: 0,
            value7: (function(){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                return [start, end]
            })(),
            pickerOptions2:{
                shortcuts: [{
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '今年以来',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(end.getFullYear()+'/1/1');
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近5年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 5);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            dataFrequencyMenu,
            currentColor:"",
        }

        return data;
    },

    created:function()
    {
        //处理默认传入的参数
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol; //默认股票
        this.contrastStockMenu.Menu = contrastStockMenu.Menu.filter(item => {
            return this.Symbol !== item.Value;
        })
        this.isIndex = HQChart.Chart.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
        if (this.DefaultPeriod) //默认周期
        {
            var period=DefaultData.GetPeriodData(this.DefaultPeriod);
            if (period)
            {
                this.Minute.IsShow=period.MinuteShow;
                this.KLine.IsShow=period.KLineShow;
                if (period.KLineShow) this.KLine.Option.Period=period.Value;
                if (period.MinuteShow){
                    this.Minute.Option.DayCount=period.Value;
                    //规避如果缺省不是日线，第一次切换历史K线时，都显示日K
                    this.KLine.Option.Period=DefaultData.GetPeriodData("日线");;
                }
                //修改周期工具条菜单选中
                const menu=DefaultData.GetPeriodMenu();
                let selected=menu.indexOf(this.DefaultPeriod);
                this.PeriodBar.Selected=selected;
            }
        }
        // console.log("[stockLine :: created]");
        if (this.KLineOption) this.SetDefaultKLineOption(this.KLineOption);
        if (this.MinuteOption) this.SetDefaultMinuteOption(this.MinuteOption);
        // if (this.TradeInfoTabWidth>0) this.TradeInfoTab.Width=this.TradeInfoTabWidth;
    },

    mounted:function()
    {
        // console.log(`[StockKLine::mounted]`);
        this.OnSize();

        if (this.Minute.IsShow) {
            this.CreateMinuteChart();
            //规避如果缺省不是日线，第一次切换历史K线时，都显示日K
            this.CreateKLineChart();
        }
        else if (this.KLine.IsShow) this.CreateKLineChart();

        this.UpateMenuStatus();
        
        const needHidePopMenu = [
            {
                'query': '#barForKLine .item',
                'obj': this.KLine.Toolbar,
                'field': 'Selected'
            },
            {
                'query': '#barForMinute .item',
                'obj': this.Minute.Toolbar,
                'field': 'Selected'
            },
            {
                'query': '#curveLineTypeMenu',
                'obj': this.curveLineTypeMenu,
                'field': 'Opened'
            },
            {
                'query': '#contrastStockMenu',
                'obj': this.contrastStockMenu,
                'field': 'Opened'
            }
        ]
        document.addEventListener('click', (e) => 
        {
            
            //弹出菜单 在其他区域点击 自动隐藏
            needHidePopMenu.forEach(item => {
                var $ele = $(item.query);
                if (!$ele.is(e.target) && $ele.has(e.target).length === 0){
                    item.obj[item.field] = -1;
                }
            })
            
        });

        this.HistoryData = JSCommonStock.JSStock.GetHistoryDayData(this.Symbol);
        this.HistoryData.InvokeUpdateUICallback = this.HistoryDataCallback;
        this.HistoryData.RequestData();

    },
    methods:
    {
        downloadHistroyData() {
            var index = this.dataFrequencyMenu.Selected;
            var val = this.dataFrequencyMenu.Menu[index].Value;
            $.ajax({
                url: 'http://opensource.zealink.com/api/KLineCSV',
                type:"post",
                dataType: 'json',
                data:{
                    "Symbol": this.Symbol,
                    "QueryDate": {
                        "StartDate": convertTime(this.value7[0]),
                        "EndDate": convertTime(this.value7[1])
                    },
                    "Period": +val
                },
                async:true,
                success: function (data) 
                {
                    if(data.code == 0){
                        var relativeUrl = data.relativeurl;
                        window.open('https://downloadcache.zealink.com/'+relativeUrl);
                    }
                },
                error: function (request) 
                {
                    console.log(request.message);
                }
            });
        },
        historyDataChange() {
            this.changeDateType();
        },
        changeDateType(){
            
            var data = [];
            var index = this.dataFrequencyMenu.Selected;
            var val = this.dataFrequencyMenu.Menu[index].Value;
            switch(+val){
                case 0:
                    data = this.KLineDayData;
                    break;
                case 1:
                    data = this.KLineWeekData;
                    break;
                case 2:
                    data = this.KLineMonthData;
                    break;
            }
            console.log('[historydayline::DefaultDateType]data:',data);
            this.GetSomeDatesData(data);
        },
        HistoryDataCallback() {
            var data = this.HistoryData.Data;
            this.KLineDayData = data.KLine;
            this.KLineWeekData = this.HistoryData.GetWeekData();
            this.KLineMonthData = this.HistoryData.GetMonthData();
            this.changeDateType()
        },
        
        GetSomeDatesData(data){
            this.SomeDatesDay.splice(0,this.SomeDatesDay.length);
            const StartDate = convertTime(this.value7[0])
            const EndDate = convertTime(this.value7[1])
            console.log(StartDate, EndDate)
            for(let i = 0; i < data.length; i++){
                var item = data[i];
                if(item.Date >= StartDate && item.Date <= EndDate){
                    var obj = {
                        Date: item.Date,
                        MaxPrice: StringFormat.StockStringFormat.FormatValueString(item.High,2),
                        Open: StringFormat.StockStringFormat.FormatValueString(item.Open,2),
                        MinPrice: StringFormat.StockStringFormat.FormatValueString(item.Low,2),
                        Close: StringFormat.StockStringFormat.FormatValueString(item.Close,2),
                        YClose: StringFormat.StockStringFormat.FormatValueString(item.YClose,2),
                        Vol: item.Vol,
                        Amount: StringFormat.StockStringFormat.FormatValueString(item.Amount,2)
                    };
                    this.SomeDatesDay.push(obj);
                }
            }
            this.PageData = this.SomeDatesDay;
        },
        valueChange(val) {
            this.Minute.JSChart.JSChartContainer.ChartPaint[0].IsDrawArea = val.target.checked
            this.Minute.JSChart.JSChartContainer.Draw()
        },
        checkFlatTab(index) {
            this.compositeTab.Selected = index;
            this.$nextTick(() => {
                this.OnSize();
            })
        },
        toggleSingleMenu(rust) {
            let data;
            if(rust === 'curveLineType'){
                data = this.curveLineTypeMenu;
            }else if(rust === 'contrastStock'){
                data = this.contrastStockMenu;
            }else if(rust === 'dataFrequency'){
                data = this.dataFrequencyMenu;
            }else{
                console.error('显示下拉框出错！')
                return;
            }
            if(data.Opened > 0){
                data.Opened = -1;
            } else{
                data.Opened = 1;
            }
        },
        changeSingleMenuValue(rust, item, index) {
            let data;
            if(rust === 'curveLineType'){
                data = this.curveLineTypeMenu;
            }else if(rust === 'contrastStock'){
                data = this.contrastStockMenu;
            }else if(rust === 'dataFrequency'){
                data = this.dataFrequencyMenu;
            }else{
                console.error('选项错误！')
                return;
            }
            data.Selected = index;
            data.Opened=-1;
            
            if(rust === 'contrastStock'){
                if(item && item.Value){
                    this.KLine.JSChart.OverlaySymbol(item.Value);
                }else{
                    this.KLine.JSChart.ClearOverlaySymbol();
                }
            }else if(rust === 'dataFrequency'){
                this.changeDateType();
            }
        },
        OnSize:function()
        {
            var stockKLine=this.$refs.stockkline;
            var divPeriodBar=this.$refs.divperiodbar;
            var divPeriodToolTab=this.$refs.divperiodtooltab;
            var divChart=this.$refs.divchart;
            var divChartBar=this.$refs.divchartbar;

            var minuteIndexBar=this.$refs.minuteindexbar;
            var klineIndexBar=this.$refs.klineindexbar;
            var indexBarHeight=minuteIndexBar.offsetHeight+klineIndexBar.offsetHeight;

            var height= stockKLine.offsetHeight;
            var width = stockKLine.offsetWidth;
            //图形高度=总高-周期工具条高-子工具条高-底部指标工具条高
            var chartHeight=height - divPeriodToolTab.offsetHeight - divPeriodBar.offsetHeight - divChartBar.offsetHeight - indexBarHeight; 
            console.log("[onSize]",height , divPeriodBar.offsetHeight , divChartBar.offsetHeight , indexBarHeight);
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

            this.historyTableHeight = chartHeight-40;
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
            HQChart.Chart.jsChartStyle(this.blackStyle);
            let chart=HQChart.Chart.JSChart.Init(this.$refs.minute);
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
            HQChart.Chart.jsChartStyle(this.blackStyle);
            let chart=HQChart.Chart.JSChart.Init(this.$refs.kline);
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart=chart;
            
            this.KLine.JSChart.ChangeScriptIndex(0, 
                { 
                    Name: "MA", 
                    Script: 'MA5:MA(CLOSE,M1);\n\
                            MA10:MA(CLOSE,M2);\n\
                            MA20:MA(CLOSE,M3);\n\
                            MA30:MA(CLOSE,M4);', 
                    Args: [
                        { Name:'M1', Value:5}, 
                        { Name:'M2', Value:10 }, 
                        { Name:'M3', Value:20},
                        { Name:'M4', Value:30}
                    ], 
                    "Modify": false, 
                    "Change": false
                }
            );

            this.KLine.JSChart.ChangeScriptIndex(1, 
                { 
                    Name: "VOL", 
                    Script: 'VOL:VOL,VOLSTICK;\n\
                            MA5:MA(VOL,M1);\n\
                            MA10:MA(VOL,M2);', 
                    Args: [
                        { Name:'M1', Value:5}, 
                        { Name:'M2', Value:10}
                    ], 
                    "Modify": false, 
                    "Change": false
                }
            );

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
            var _this = this;
            setTimeout(function(){
                _this.OnSize();
            },50)
            
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
            console.log("[stockLine :: UpateMenuStatus]");
            var isIndex = HQChart.Chart.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
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
            if (option.MinuteLine) this.Minute.Option.MinuteLine = option.MinuteLine;
        },

        //更新指标工具菜单选中
        UpdateIndexBarSelected:function()
        {
            if (this.KLine.JSChart && this.KLine.JSChart.JSChartContainer)
            {
                this.KLine.IndexBar.Selected=[];
                var aryIndex=this.KLine.JSChart.JSChartContainer.GetIndexInfo();
                for(var i=0;i<aryIndex.length;++i)
                {
                    var item=aryIndex[i];
                    if(item.ID == "BOLL副图") item.ID = "BOLL";//副图指标中的【BOLL】即对应K线图中的【BOLL副图】
                    var index=this.KLine.IndexBar.Menu.indexOf(item.ID);
                    if (index>=0) this.KLine.IndexBar.Selected.push(index);
                }
            }

            if (this.Minute.JSChart && this.Minute.JSChart.JSChartContainer)
            {
                this.Minute.IndexBar.Selected=[];
                var aryIndex=this.Minute.JSChart.JSChartContainer.GetIndexInfo();
                for(var i=0;i<aryIndex.length;++i)
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

        //专家系统
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
                var classInfo=HQChart.Chart.JSKLineInfoMap.GetClassInfo(item.Name);
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

        //鼠标拖拽
        UpdateMouseDragMenu:function()
        {
            var menu=this.KLine.Toolbar.Data[KLINE_TOOLBAR_ID.MOUSE_DRAG_ID];
            menu.Selected=[];
            const aryMenu=menu.Menu.map(item=>item.Value);
            var index=aryMenu.indexOf(this.KLine.JSChart.JSChartContainer.DragMode);
            if (index>=0) menu.Selected.push(index);
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
            if(this.PeriodBar.Selected == idx) return;
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
                    this.Minute.JSChart.ChangeIndex(2,name);
                    break;
                case 'kline':
                    if(name == "BOLL") name="BOLL副图";//副图指标中的【BOLL】即对应K线图中的【BOLL副图】
                    this.KLine.JSChart.ChangeIndex(2,name);
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
                    case "重大事项"://'信息地雷':
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
                    case "重大事项"://'信息地雷':
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
            var self=this;
            this.KLine.JSChart.JSChartContainer.CreateChartDrawPicture(name, function(drawChart) { self.OnFinishDraw(drawChart); });
            if(name==='全部删除'){
                 this.KLine.JSChart.JSChartContainer.ClearChartDrawPicture();
            }
        },

        OnFinishDraw(drawChart)
        {
            console.log('[StockKLine::OnFinishDraw] finish',drawChart);
        },

        isShowBrushTool( brushTool){
            this.DrawTool.IsShow = brushTool;
        },

        //全屏查看
        fullChart(){
            this.$emit("changeFullChart");
        }

    }
}


</script>


<style lang="scss">
$border: 1px solid #e1ecf2;

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
.klineLightTheme{
    .periodbar{
        background:#eff5ff;
        border-color:#dde4f4;
        color:#1e52a6;
        .active{
            background: #fff;
            border-top: 2px solid #1e52a6;
            border-left:1px solid #dde4f4;
            border-right: 1px solid #dde4f4;
            border-bottom: 1px solid #fff;
        }
    }
    .lineGroup{
        .el-checkbox{
            color:#1f2d3d; 
        }
    }
    .indexbar{
        background:#e1ecf2;
    }
    .menuTwo{
        background-color: #eff5ff;
    }
    .periodIndexbar .preiod .itemList{
        background: #eff5ff;
        border: 1px solid #dde4f4;
        .item{
            color: #666;
            &.active{
                color: #fff;
                background-color: #1e52a6;
            }
        }
    }
}
.klineDarkTheme{
    .periodbar{
        background:#313b4c;
        border-color:#232f43;
        color:#fff;
        .active{
            background: #000;
            border-top: 2px solid #3f9eff;
            border-left:1px solid #313b4c;
            border-right: 1px solid #313b4c;
            border-bottom: 1px solid #000;
        }
    }
    .lineGroup{
        .el-checkbox{
            color:#fff;  
        }
    }
    .indexbar{
        background:#232f43;
    }
    .menuTwo{
        background-color: #000;
    }
    .periodIndexbar .preiod .itemList{
        background: #232f43;
        border: 1px solid #232f43;
        .item{
            color: #fff;
            &.active{
                background-color: #3f9eff
            }
        }
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
	border: solid 1px;
    padding-left: 36px;
    padding-right: 30px;
    
    .preiod{
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .itemList{
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
    .fullChart{
        cursor: pointer;
        width: 20px;
        height: 36px;
        display: inline-block;
        box-sizing: border-box;
        div{
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-top:8px;
        }
        .noFull{
            background: url(../../../assets/chart_setting_icons.png) 0px -24px no-repeat;
        }
        .isFull{
            background: url(../../../assets/chart_setting_icons.png) -1px 0px no-repeat;
        }
    }
    .item 
    {
        // color: #1e52a6;
        display: inline-block;
        font-size: 14px;
        line-height: 1;
        padding: 4px 12px;
        margin-right: 26px;
        cursor: pointer;
    }
    .active//白色
    {
        display: inline-block;
        height: 28px;
        padding: 0;
        border-radius: 0px;
        line-height: 28px;
        margin-top: 6px;
        padding: 0 12px;
    }
}

.periodIndexbar 
{
    position: relative;
    z-index: 999;
    .preiod{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .itemList{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-right: 80px;
        }
    }
    .fullChart{
        cursor: pointer;
        width: 20px;
        height: 36px;
        display: inline-block;
        box-sizing: border-box;
        div{
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-top:8px;
        }
        .noFull{
            background: url(../../../assets/chart_setting_icons.png) 0px -24px no-repeat;
        }
        .isFull{
            background: url(../../../assets/chart_setting_icons.png) -1px 0px no-repeat;
        }
    }
    .item 
    {
        display: inline-block;
        font-size: 14px;
        line-height: 25px;
        padding: 0 12px;
        cursor: pointer;
    }
}
.lineGroup{
    display: flex;
}


/*底部指标*/
.indexbar 
{
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
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

.historyPeriodbar{
    height: 40px;
    position: relative;
    z-index: 1;
    .preiod{
        display: flex;
        align-items: center;
    }
    .downloadHistroyData{
        width: 100px;
        height: 26px;
        line-height: 26px;
        font-size: 15px;
        color: #fff;
        background: #1e52a6;
        border-radius: 1px;
        cursor: pointer;
        text-align: center;
    }
    .item 
    {
        color: #1e52a6;
        display: inline-block;
        font-size: 14px;
        line-height: 1;
        padding: 4px 12px;
        margin-right: 26px;
        cursor: pointer;
    }
    .item.active 
    {
        display: inline-block;
        height: 28px;
        background: #fff;
        padding: 0;
        border-radius: 0px;
        border-top: 2px solid #1e52a6;
        line-height: 28px;
        margin-top: 6px;
        padding: 0 12px;
        border-left:1px solid #dde4f4;
        border-right: 1px solid #dde4f4;
        border-bottom: 1px solid #fff;
    }
}

/*图形操作工具条 */
.chartbar
{
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    border-bottom: 1px solid #d9d9d9;
    position: relative;
    z-index: 998;

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

    @at-root .lineSelect,
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
            padding: 0 12px 6px 12px;
            box-sizing: border-box;
        }

        .menuOne:hover,
        .menuOne.light 
        {
            // border-color: #d9d9d9;

            >span 
            {
                color: #217cd9;
            }
        }

        .menuTwo 
        {
            position: absolute;
            //#fff;
            top: 32px;
            left: 0;
            border: 1px solid #dde4f4;//#d9d9d9;
            // border-top: none;
            box-sizing: border-box;
            width: 100%;

            >li 
            {
                padding: 0 12px;
                line-height: 28px;
            }

            >li:hover,
            >li.active 
            {
                color: #217cd9;
            }
        }

    }
    
    @at-root .lineSelect{
        margin: 0;
        .menuOne{
            padding: 4px 0;
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

.icon-line_p1:after,
.icon-line_p2:after,
.icon-line_p3:after,
.icon-line_p4:after{
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}
.icon-line_p1:after{
    background: url("../../../assets/icon1.png");
}
.icon-line_p2:after{
    background: url("../../../assets/icon2.png");
}
.icon-line_p3:after{
    background: url("../../../assets/icon3.png");
}
.icon-line_p4:after{
    background: url("../../../assets/icon4.png");
}

</style>
<style lang="scss">
.historyLine{
    .el-table__header-wrapper thead div,
    .el-table th{
        background: #eff5ff;
    }
}
.target-panel,
.parameter{
    position: fixed;
    color: #000;
}
.target-header strong,
.parameter strong{
    top: 6px;
}
.target-header strong{
    cursor: pointer;
    &:hover{
        color: #0182d4;
    }
}
.klineDarkTheme .historyLine{
    .el-table__body-wrapper::-webkit-scrollbar-track-piece,
    .el-table__body-wrapper::-webkit-scrollbar-corner,
    .el-table__body-wrapper::-webkit-scrollbar-track{
        background: #232f43;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb{
        background:#999999;
    }
    .el-table{
        background-color: #000;
        border-color: #313b4c;
    }
    .el-table::before,
    .el-table::after{
        background-color: #313b4c;
    }
    .el-table__header-wrapper thead div,
    .el-table th{
        background: #232f43;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td{
        background: #333;
    }
    .el-table__header-wrapper thead div,
    .el-table{
        color: #fff;
    }
    .el-table td,
    .el-table th.is-leaf{
        border-color: #313b4c;
    }

    .el-table tr{
        background: #000;
    }
    .el-input__inner{
        background-color: #232f43;
        border-color: #313b4c;
        color: #fff;
    }
}
.dark-theme-picker{
    &.el-picker-panel{
        color: #bcbcbc;
        background: #000;
        border-color: #313b4c;
        box-shadow: 0 2px 6px #333;
    }
    .el-picker-panel__sidebar{
        color: #eee;
        background: #000;
        border-color: #313b4c;
    }
    .el-picker-panel__shortcut{
        color: #eee;
        &:hover{
            background-color: #232f43;
        }
    }
    .el-date-range-picker__content.is-left{
        border-color: #313b4c;
    }
    .el-date-table td.available:hover{
        color: #fff;
        background-color: #333;
    }
    .el-date-table td.in-range{
        background-color: #232f43;
        color: #eee;
        &:hover{
            background-color: #284f90;
        }
    }
    .el-date-table td.end-date,
    .el-date-table td.start-date{
        background-color: #277dd4 !important;
    }
    .el-date-table td.next-month,
    .el-date-table td.prev-month{
        color: #ccc;
    }
}
.klineLightTheme{
    .jchart-klineinfo-tooltip,.jchart-tooltip{
        background: #fff !important;
    }
}
.closeBtn .move-area{
  background:none;
}

// 黑色版本样式
.klineDarkTheme{
    .jchart-klineinfo-tooltip,.jchart-tooltip{
        background: #313b4c !important;
    }

    #toolBox{
      background: #313b4c !important;
    }

    #toolBox ul .closeBtn .move-area{
      background: #313b4c !important;
    }

  
}

.icon-setting .close-tar{
    overflow : inherit;
}

// #icon-guanbi path,#icon-xianduan path,#icon-shexian path{
//   fill:#fff;
// }
</style>
