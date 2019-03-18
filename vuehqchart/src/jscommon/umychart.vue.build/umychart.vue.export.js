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
    MARKET_SUFFIX_NAME:MARKET_SUFFIX_NAME,  // 判断股票属性
    IFrameSplitOperator:IFrameSplitOperator,//格式化字符串方法
    JSKLineInfoMap:JSKLineInfoMap,
    
}