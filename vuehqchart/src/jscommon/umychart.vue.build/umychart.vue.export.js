import $ from 'jquery'

//把给外界调用的方法暴露出来
export default {
    jsChartInit: JSChart.Init,
    jsChartStyle:JSChart.SetStyle,
    // IsIndexSymbol:IsIndexSymbol,
    // BaseIndex:BaseIndex,
    // ChartLine:ChartLine,
    // ChartKLine:ChartKLine,
    // ChartMACD:ChartMACD,
    // DynamicTitleData:DynamicTitleData,
    // ChartVolStick:ChartVolStick,
    // SingleData:SingleData,
    // ChartData:ChartData

    //类导出
    JSChart:JSChart,        //行情图形库
    ChartData:ChartData,    //数据类
    SingleData:SingleData,
    HistoryData:HistoryData,    //K线数据结构
    MARKET_SUFFIX_NAME:MARKET_SUFFIX_NAME,  // 判断股票属性
    IFrameSplitOperator:IFrameSplitOperator,//格式化字符串方法
    FrameSplitKLinePriceY:FrameSplitKLinePriceY,
    FrameSplitKLineX:FrameSplitKLineX,
    JSKLineInfoMap:JSKLineInfoMap,
    JSCHART_EVENT_ID:JSCHART_EVENT_ID,      //可以订阅的事件类型
    JSCHART_OPERATOR_ID:JSCHART_OPERATOR_ID,    //图形控制类型
    JSCHART_DATA_FIELD_ID:JSCHART_DATA_FIELD_ID,//图形字段
    JSCHART_CUSTOM_YCOORDINATE_ID:JSCHART_CUSTOM_YCOORDINATE_ID,    //自定义刻度类型
    JSAlgorithm:JSAlgorithm,                //算法类
    JSComplier:JSComplier,                  //指标编译器
    JSIndexScript:JSIndexScript,            //系统指标库
    GetDevicePixelRatio,GetDevicePixelRatio,
    
    ScriptIndexConsole:ScriptIndexConsole,  //指标执行 无UI
    //style.js相关
    STYLE_TYPE_ID:STYLE_TYPE_ID,
    HQChartStyle:HQChartStyle,              //预定义全局的配色 黑

    JSConsole:JSConsole,    //日志输出

    KLineTooltipPaint:KLineTooltipPaint,    //K线tooltip
    MinuteTooltipPaint:MinuteTooltipPaint,  //走势图tooltip

    ChartDrawTwoPointDemo:ChartDrawTwoPointDemo,        //画图工具2个点例子
    ChartDrawThreePointDemo:ChartDrawThreePointDemo,    //画图工具3个点例子

    CoordinateInfo:CoordinateInfo,

    //成交明细
    JSDealChart:JSDealChart,
    DEAL_COLUMN_ID:DEAL_COLUMN_ID,

    //报价列表
    JSReportChart:JSReportChart,
    REPORT_COLUMN_ID:REPORT_COLUMN_ID,

    //T型报价
    JSTReportChart:JSTReportChart,
    TREPORT_COLUMN_ID:TREPORT_COLUMN_ID,

    //键盘精灵
    JSKeyboardChart:JSKeyboardChart,
    KEYBOARD_COLUMN_ID:KEYBOARD_COLUMN_ID,
    JSPopKeyboard:JSPopKeyboard,

    //X轴滚动条
    JSScrollBarChart:JSScrollBarChart,

    //图形基类导出
    IChartPainting:IChartPainting,              //图形
    IExtendChartPainting:IExtendChartPainting,  //扩展图形
    IChartTitlePainting:IChartTitlePainting,    //标题类
    IChartDrawPicture:IChartDrawPicture,        //画图工具
    DynamicTitleData:DynamicTitleData,          //指标标题数据

    CONDITION_PERIOD:CONDITION_PERIOD,          //指标周期条件枚举

    //内部图形导出
    ChartMinuteVolumBar:ChartMinuteVolumBar,    //成交量柱子
    ChartKLine:ChartKLine,                      //K线图

    KLineFrame:KLineFrame,                      //K线框架

    JSCHART_WORKER_MESSAGE_ID:JSCHART_WORKER_MESSAGE_ID,

    JS_Frame:
    {
        KLineFrame:KLineFrame,
        KLineHScreenFrame:KLineHScreenFrame,
    },

    //新个导出 根据大类分组
    JS_ChangeStringFormat:
    {
        IChangeStringFormat:IChangeStringFormat,            //数据格式化
        HQMinuteTimeStringFormat:HQMinuteTimeStringFormat,  //分时图X轴 十字光标输出格式化
        HQDateStringFormat:HQDateStringFormat,              //K线图X轴  十字光标输出格式化
        HQPriceStringFormat:HQPriceStringFormat,            //分时图,K线图Y轴 十字光标输出格式化
    },

    //所有的枚举
    JS_ID:
    {
        JSCHART_EVENT_ID:JSCHART_EVENT_ID,
        JSCHART_OPERATOR_ID:JSCHART_OPERATOR_ID,
        JSCHART_DRAG_ID:JSCHART_DRAG_ID,
        JSCHART_BUTTON_ID:JSCHART_BUTTON_ID,
        JSCHART_DATA_FIELD_ID:JSCHART_DATA_FIELD_ID,
        JSCHART_WORKER_MESSAGE_ID:JSCHART_WORKER_MESSAGE_ID,
        JSCHART_MENU_ID:JSCHART_MENU_ID
    },


    HQChartScriptWorker:HQChartScriptWorker,    //计算工作线程

    JSPopMenu:JSPopMenu,    //弹出菜单
    JSDialogDrawTool:JSDialogDrawTool,  //画图工具对话框
    
}