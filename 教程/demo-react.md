
# React用例
## React创建k线图用例
```js
import React from 'react';
import HQChart from 'hqchart';

class kline extends React.Component {
    constructor(props) { //构造函数
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.state = {
            Symbol:'600000.sh',
            KLine: 
            {
                JSChart:null,
                Option:{
                    Symbol:'',
                    Type: '历史K线图', 
                    
                    Windows: //窗口指标
                    [
                        {Index:"MA",Modify: false, Change: false}, 
                        {Index:"VOL",Modify: false, Change: false}
                    ], 
             
                    IsShowCorssCursorInfo:true,
             
                    Border: //边框
                    {
                        Left:   1,
                        Right:  1, //右边间距
                        Top:    25,
                        Bottom: 25,
                    },
             
                    KLine:
                    {
                        Right:1,                            //复权 0 不复权 1 前复权 2 后复权
                        Period:0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
                        PageSize:70,
                        IsShowTooltip:true
                    }
                    
                }
            }
        }
    }
    initCanvas() {

        if (this.state.KLine.JSChart) return;

        this.state.KLine.Option.Symbol=this.state.Symbol;
        let chart=HQChart.Chart.JSChart.Init(document.getElementById("time_graph_canvas"));
        chart.SetOption(this.state.KLine.Option);
        this.state.KLine.JSChart=chart;
    }

    componentDidMount() {
        this.initCanvas()
    }
    
    componentDidUpdate() {
        this.initCanvas()
    }
    render() {
        var chartHeight = window.innerHeight-30;
        var chartWidth = window.innerWidth-30;
        var styleText = {
            width: chartWidth+'px', 
            height: chartHeight+'px',
        };
        return (
          <div style={styleText} id="time_graph_canvas">
          </div>
        )
      }
}

export default kline;
```
## React创建走势图用例
```js
import React from 'react';
import HQChart from 'hqchart';

class minute extends React.Component {
    constructor(props) { //构造函数
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.state = {
            Symbol:'600000.sh',
            Minute:
            {
                JSChart:null,
                Option:{
                    Type:'分钟走势图',   //创建图形类型
                    Symbol:'',
                    Windows: //窗口指标
                    [
                        
                    ], 
                        
                    IsAutoUpdate:true,       //是自动更新数据
                    DayCount:1,                 //1 最新交易日数据 >1 多日走势图
                    IsShowCorssCursorInfo:true, //是否显示十字光标的刻度信息
                    IsShowRightMenu:true,       //是否显示右键菜单
                    CorssCursorTouchEnd:true,
            
                    MinuteLine:
                    {
                        //IsDrawAreaPrice:false,      //是否画价格面积图
                    },
            
                    Border: //边框
                    {
                        Left:1,    //左边间距
                        Right:1,   //右边间距
                        Top:20,
                        Bottom:20
                    },
                        
                    Frame:  //子框架设置
                    [
                        {SplitCount:3,StringFormat:0},
                        {SplitCount:2,StringFormat:0},
                        {SplitCount:3,StringFormat:0},
                    ],
            
                    ExtendChart:    //扩展图形
                    [
                        //{Name:'MinuteTooltip' }  //手机端tooltip
                    ],
                }
            }
        }
    }
    initCanvas() {

        if (this.state.Minute.JSChart) return;

        this.state.Minute.Option.Symbol=this.state.Symbol;
        let chart=HQChart.Chart.JSChart.Init(document.getElementById("time_graph_canvas"));
        chart.SetOption(this.state.Minute.Option);
        this.state.Minute.JSChart=chart;
    }

    componentDidMount() {
        this.initCanvas()
    }
    
    componentDidUpdate() {
        this.initCanvas()
    }
    render() {
        var chartHeight = window.innerHeight-30;
        var chartWidth = window.innerWidth-30;
        var styleText = {
            width: chartWidth+'px', 
            height: chartHeight+'px',
        };
        return (
          <div style={styleText} id="time_graph_canvas">
          </div>
        )
      }
}

export default minute;
```


