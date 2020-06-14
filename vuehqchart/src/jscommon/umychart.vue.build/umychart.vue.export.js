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
    HistoryData:HistoryData,    //K线数据结构
    MARKET_SUFFIX_NAME:MARKET_SUFFIX_NAME,  // 判断股票属性
    IFrameSplitOperator:IFrameSplitOperator,//格式化字符串方法
    JSKLineInfoMap:JSKLineInfoMap,
    JSCHART_EVENT_ID:JSCHART_EVENT_ID,      //可以订阅的事件类型
    JSCHART_OPERATOR_ID:JSCHART_OPERATOR_ID,    //图形控制类型
    JSAlgorithm:JSAlgorithm,                //算法类
    JSComplier:JSComplier,                  //指标编译器
    JSIndexScript:JSIndexScript,            //系统指标库
    GetDevicePixelRatio,GetDevicePixelRatio,
    
    ScriptIndexConsole:ScriptIndexConsole,  //指标执行 无UI
    //style.js相关
    STYLE_TYPE_ID:STYLE_TYPE_ID,
    HQChartStyle:HQChartStyle,              //预定义全局的配色 黑

    JSConsole:JSConsole,    //日志输出
}