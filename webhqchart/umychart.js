/*
    封装图形控件
*/

function JSChart(divElement)
{
    this.DivElement=divElement;
    this.DivToolElement=null;           //工具条
    this.JSChartContainer;              //画图控件

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jschart-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if(!divElement.hasChildNodes("canvas")){
        divElement.appendChild(this.CanvasElement);
    }

    //改参数div
    this.ModifyIndexDialog=new ModifyIndexDialog(divElement);
    this.ChangeIndexDialog=new ChangeIndexDialog(divElement);
    this.KLineInfoTooltip=new KLineInfoTooltip(divElement);
    this.MinuteDialog=new MinuteDialog(divElement);

    this.OnSize=function()
    {
        //画布大小通过div获取
        var height=parseInt(this.DivElement.style.height.replace("px",""));
        if (this.ToolElement)
        {
            //TODO调整工具条大小
            height-=this.ToolElement.style.height.replace("px","");   //减去工具条的高度
        }

        this.CanvasElement.height=height;
        this.CanvasElement.width=parseInt(this.DivElement.style.width.replace("px",""));
        this.CanvasElement.style.width=this.CanvasElement.width+'px';
        this.CanvasElement.style.height=this.CanvasElement.height+'px';

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.CanvasElement.height*=pixelTatio;
        this.CanvasElement.width*=pixelTatio;

        if (this.JSChartContainer && this.JSChartContainer.Frame)
            this.JSChartContainer.Frame.SetSizeChage(true);

        if (this.JSChartContainer) this.JSChartContainer.Draw();
    }

    //手机屏需要调整 间距
    this.AdjustChartBorder=function(chart)
    {
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率

        chart.Frame.ChartBorder.Left*=pixelTatio;
        chart.Frame.ChartBorder.Right*=pixelTatio;
        chart.Frame.ChartBorder.Top*=pixelTatio;
        chart.Frame.ChartBorder.Bottom*=pixelTatio;
    }

    this.AdjustTitleHeight=function(chart)
    {
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率

        for(let i in chart.Frame.SubFrame)
        {
            chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight*=pixelTatio;
        }

        chart.ChartCorssCursor.TextHeight*=pixelTatio;  //十字光标文本信息高度
    }

    //历史K线图
    this.CreateKLineChartContainer=function(option)
    {
        var chart=null;
        if (option.Type==="历史K线图横屏") chart=new KLineChartHScreenContainer(this.CanvasElement);
        else chart=new KLineChartContainer(this.CanvasElement);

        //创建改参数div
        chart.ModifyIndexDialog=this.ModifyIndexDialog;
        chart.ChangeIndexDialog=this.ChangeIndexDialog;
        chart.KLineInfoTooltip=this.KLineInfoTooltip;
        chart.MinuteDialog=this.MinuteDialog;
        
        //右键菜单
        if (option.IsShowRightMenu==true) chart.RightMenu=new KLineRightMenu(this.DivElement);
        if (option.ScriptError) chart.ScriptErrorCallback=option.ScriptError;

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.DragMode>=0) chart.DragMode=option.KLine.DragMode;
            if (option.KLine.Right>=0) chart.Right=option.KLine.Right;
            if (option.KLine.Period>=0) chart.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) chart.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.IndexTreeApiUrl) chart.ChangeIndexDialog.IndexTreeApiUrl=option.KLine.IndexTreeApiUrl;
            if (option.KLine.KLineDoubleClick==false) chart.MinuteDialog=this.MinuteDialog=null;
            if (option.KLine.IndexTreeApiUrl!=null) chart.ChangeIndexDialog.IndexTreeApiUrl=option.KLine.IndexTreeApiUrl;
            if (option.KLine.PageSize>0)  chart.PageSize=option.KLine.PageSize;
            if (option.KLine.IsShowTooltip==false) chart.IsShowTooltip=false;
            if (option.KLine.MaxRequestMinuteDayCount>0) chart.MaxRequestMinuteDayCount=option.KLine.MaxRequestMinuteDayCount;
            if (option.KLine.DrawType) chart.KLineDrawType=option.KLine.DrawType;
        }

        if (!option.Windows || option.Windows.length<=0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
        }

        this.AdjustChartBorder(chart);

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
            }
        }

        if(option.KLineTitle)
        {
            if(option.KLineTitle.IsShowName==false) chart.TitlePaint[0].IsShowName=false;
            if(option.KLineTitle.IsShowSettingInfo==false) chart.TitlePaint[0].IsShowSettingInfo=false;
            if(option.KLineTitle.IsShow == false) chart.TitlePaint[0].IsShow = false;
        }

        //叠加股票
        if (option.Overlay && option.Overlay.length)
        {
            chart.OverlayChartPaint[0].Symbol= option.Overlay[0].Symbol;
        }

        //创建子窗口的指标
        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                chart.WindowIndex[i]=new ScriptIndex(item.Name,item.Script,item.Args,item);    //脚本执行
            }
            else
            {
                let indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[i]=indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock=item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args,indexInfo);    //脚本执行
                }

            }

            if (item.Modify!=null)
                chart.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null)
                chart.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }
        this.AdjustTitleHeight(chart);

        return chart;
    }

    //自定义指数历史K线图
    this.CreateCustomKLineChartContainer=function(option)
    {
        var chart=new CustomKLineChartContainer(this.CanvasElement);

        //创建改参数div
        chart.ModifyIndexDialog=this.ModifyIndexDialog;
        chart.ChangeIndexDialog=this.ChangeIndexDialog;
        chart.KLineInfoTooltip=this.KLineInfoTooltip;
        chart.MinuteDialog=this.MinuteDialog;
        
        //右键菜单
        if (option.IsShowRightMenu==true) chart.RightMenu=new KLineRightMenu(this.DivElement);

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.DragMode>=0) chart.DragMode=option.KLine.DragMode;
            if (option.KLine.Right>=0) chart.Right=option.KLine.Right;
            if (option.KLine.Period>=0) chart.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) chart.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.IndexTreeApiUrl) chart.ChangeIndexDialog.IndexTreeApiUrl=option.KLine.IndexTreeApiUrl;
            if (option.KLine.KLineDoubleClick==false) chart.MinuteDialog=this.MinuteDialog=null;
            if (option.KLine.IndexTreeApiUrl!=null) chart.ChangeIndexDialog.IndexTreeApiUrl=option.KLine.IndexTreeApiUrl;
            if (option.KLine.PageSize>0)  chart.PageSize=option.KLine.PageSize;
            if (option.KLine.IsShowTooltip==false) chart.IsShowTooltip=false;
        }

        if (option.CustomStock) chart.CustomStock=option.CustomStock;
        if (option.QueryDate) chart.QueryDate=option.QueryDate;

        if (!option.Windows || option.Windows.length<=0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        }

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
            }
        }

        if(option.KLineTitle)
        {
            if(option.KLineTitle.IsShowName==false) chart.TitlePaint[0].IsShowName=false;
            if(option.KLineTitle.IsShowSettingInfo==false) chart.TitlePaint[0].IsShowSettingInfo=false;
        }

        //创建子窗口的指标
        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                chart.WindowIndex[i]=new ScriptIndex(item.Name,item.Script,item.Args,item);    //脚本执行
            }
            else
            {
                let indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[i]=indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock=item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args,indexInfo);    //脚本执行
                }
            }
           
            if (item.Modify!=null)
                chart.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null)
                chart.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }

        return chart;
    }

    //分钟走势图
    this.CreateMinuteChartContainer=function(option)
    {
        var chart=null;
        if (option.Type==="分钟走势图横屏") chart=new MinuteChartHScreenContainer(this.CanvasElement);
        else chart=new MinuteChartContainer(this.CanvasElement);

        var windowsCount=2;
        if (option.Windows && option.Windows.length>0) windowsCount+=option.Windows.length; //指标窗口从第3个窗口开始

        chart.Create(windowsCount);                            //创建子窗口

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
        }
        this.AdjustChartBorder(chart);

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
            }
        }

        //分钟数据指标从第3个指标窗口设置
        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                chart.WindowIndex[2+parseInt(i)]=new ScriptIndex(item.Name,item.Script,item.Args);    //脚本执行
            }
            else
            {
                var indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[2+parseInt(i)]=indexItem.Create();       //创建子窗口的指标
                    chart.CreateWindowIndex(2+parseInt(i));
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    chart.WindowIndex[2+parseInt(i)] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args);    //脚本执行
                }
            }

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[2+parseInt(i)].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }
        this.AdjustTitleHeight(chart);

        return chart;
    }

    //历史分钟走势图
    this.CreateHistoryMinuteChartContainer=function(option)
    {
        var chart=new HistoryMinuteChartContainer(this.CanvasElement);

        var windowsCount=2;
        if (option.Windows && option.Windows.length>0) windowsCount+=option.Windows.length; //指标窗口从第3个窗口开始

        chart.Create(windowsCount);                            //创建子窗口

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
        }

        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                chart.WindowIndex[2+parseInt(i)]=new ScriptIndex(item.Name,item.Script,item.Args);    //脚本执行
            }
            else
            {
                var indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[2+parseInt(i)]=indexItem.Create();       //创建子窗口的指标
                    chart.CreateWindowIndex(2+parseInt(i));
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    chart.WindowIndex[2+parseInt(i)] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args);    //脚本执行
                }
            }

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[2+parseInt(i)].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }

        chart.TradeDate=20181009;
        if (option.HistoryMinute.TradeDate) chart.TradeDate=option.HistoryMinute.TradeDate;
        if (option.HistoryMinute.IsShowName!=null) chart.TitlePaint[0].IsShowName=option.HistoryMinute.IsShowName;  //动态标题是否显示股票名称
        if (option.HistoryMinute.IsShowDate!=null) chart.TitlePaint[0].IsShowDate=option.HistoryMinute.IsShowDate;  //动态标题是否显示日期

        return chart;
    }

    this.CreateKLineTrainChartContainer=function(option)
    {
        var chart=new KLineTrainChartContainer(this.CanvasElement);

        if (option.ScriptError) chart.ScriptErrorCallback=option.ScriptError;

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.Right>=0) chart.Right=option.KLine.Right;
            if (option.KLine.Period>=0) chart.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) chart.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.PageSize>0)  chart.PageSize=option.KLine.PageSize;
            if (option.KLine.IsShowTooltip==false) chart.IsShowTooltip=false;
            if (option.KLine.MaxRequestMinuteDayCount>0) chart.MaxRequestMinuteDayCount=option.KLine.MaxRequestMinuteDayCount;
            if (option.KLine.DrawType) chart.KLineDrawType=option.KLine.DrawType;
            
        }

        if (option.Train)
        {
            if (option.Train.DataCount) chart.TrainDataCount=option.Train.DataCount;
            if (option.Train.Callback) chart.TrainCallback=option.Train.Callback;
        }

        if (!option.Windows || option.Windows.length<=0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
        }

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
            }
        }

        //股票名称 日期 周期都不显示
        chart.TitlePaint[0].IsShowName=false;
        chart.TitlePaint[0].IsShowSettingInfo=false;
        chart.TitlePaint[0].IsShowDateTime=false;

        //创建子窗口的指标
        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                chart.WindowIndex[i]=new ScriptIndex(item.Name,item.Script,item.Args,item);    //脚本执行
            }
            else
            {
                let indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[i]=indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock=item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args,indexInfo);    //脚本执行
                }

            }

            if (item.Modify!=null)
                chart.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null)
                chart.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }

        return chart;
    }

    //根据option内容绘制图形
    this.SetOption=function(option)
    {
        var chart=null;
        switch(option.Type)
        {
            case "历史K线图":
            case '历史K线图横屏':
                chart=this.CreateKLineChartContainer(option);
                break;
            case "自定义指数历史K线图":
                chart=this.CreateCustomKLineChartContainer(option);
                break;
            case "分钟走势图":
            case "分钟走势图横屏":
                chart=this.CreateMinuteChartContainer(option);
                break;
            case "历史分钟走势图":
                chart=this.CreateHistoryMinuteChartContainer(option);
                break;
            case 'K线训练':
                chart=this.CreateKLineTrainChartContainer(option);
                break;
            case "简单图形":
                return this.CreateSimpleChart(option);
            case "饼图":
                return this.CreatePieChart(option);
            case '地图':
                return this.CreateMapChart(option);
            default:
                return false;
        }

        if (!chart) return false;

        //是否自动更新
        if(option.IsAutoUpate!=null) chart.IsAutoUpate=option.IsAutoUpate;

        //设置股票代码
        if (!option.Symbol) return false;
        chart.Draw();
        chart.ChangeSymbol(option.Symbol);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份
        this.JSChartContainer.Draw();
    }

    this.CreateSimpleChart=function(option)
    {
        var chart=new SimlpleChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl=option.MainDataControl;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        }

        
        chart.Draw();
        chart.RequestData();

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份
        this.JSChartContainer.Draw();
    }

    //创建饼图
    this.CreatePieChart=function(option)
    {
        var chart=new PieChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl=option.MainDataControl;

        if(option.Radius) chart.Radius = option.Radius;
        
        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        }
        
        chart.Draw();
        chart.RequestData();

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份
        this.JSChartContainer.Draw();
        
    }

    this.CreateMapChart=function(option)
    {
        var chart=new MapChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl=option.MainDataControl;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        }
        
        chart.Draw();
        chart.RequestData();

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份
        this.JSChartContainer.Draw();
    }

    //创建工具条
    this.CreateToolbar=function(option)
    {

    }

    //创建设置div窗口
    this.CreateSettingDiv=function(option)
    {

    }

    this.Focus=function()
    {
        if (this.CanvasElement) this.CanvasElement.focus();
    }

    //切换股票代码接口
    this.ChangeSymbol=function(symbol)
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol);
    }

    //K线切换指标
    this.ChangeIndex=function(windowIndex,indexName)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeIndex)=='function')
            this.JSChartContainer.ChangeIndex(windowIndex,indexName);
    }

    this.ChangeScriptIndex=function(windowIndex,indexData)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeScriptIndex)=='function')
        this.JSChartContainer.ChangeScriptIndex(windowIndex,indexData);
    }

    //K线周期切换
    this.ChangePeriod=function(period)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangePeriod)=='function')
            this.JSChartContainer.ChangePeriod(period);
    }

    //K线复权切换
    this.ChangeRight=function(right)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeRight)=='function')
            this.JSChartContainer.ChangeRight(right);
    }

    this.ChangMainDataControl=function(dataControl)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.SetMainDataConotrl)=='function') 
            this.JSChartContainer.SetMainDataConotrl(dataControl);
    }

    //设置强制横屏
    this.ForceLandscape=function(bForceLandscape)
    {
        if (this.JSChartContainer) 
        {
            console.log("[JSChart::ForceLandscape] bForceLandscape="+bForceLandscape);
            this.JSChartContainer.IsForceLandscape=bForceLandscape;
        }
    }

    //锁指标
    this.LockIndex=function(lockData)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.LockIndex)=='function')
        {
            console.log('[JSChart:LockIndex] lockData', lockData);
            this.JSChartContainer.LockIndex(lockData);
        }
    }

    //历史分钟数据 更改日期
    this.ChangeTradeDate=function(tradeDate)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ChangeTradeDate)=='function')
        {
            console.log('[JSChart:ChangeTradeDate] date', tradeDate);
            this.JSChartContainer.ChangeTradeDate(tradeDate);
        }
    }
}

//初始化
JSChart.Init=function(divElement)
{
    var jsChartControl=new JSChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

JSChart.SetDomain=function(domain,cacheDomain)
{
    if (domain) g_JSChartResource.Domain=domain;
    if (cacheDomain) g_JSChartResource.CacheDomain=cacheDomain;
}

//自定义风格
JSChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取设备分辨率比
JSChart.GetDevicePixelRatio=function()
{
    return GetDevicePixelRatio();
}

/*//把给外界调用的方法暴露出来
export default {
    jsChartInit: JSChart.Init
}*/

/*
    图形控件
*/
function JSChartContainer(uielement)
{
    this.ClassName='JSChartContainer';
    var _self = this;
    this.Frame;                                     //框架画法
    this.ChartPaint=new Array();                    //图形画法
    this.ChartPaintEx=[];                           //图形扩展画法
    this.ChartInfo=new Array();                     //K线上信息地雷
    this.ExtendChartPaint=new Array();              //扩展画法
    this.TitlePaint=new Array();                    //标题画法
    this.OverlayChartPaint=new Array();             //叠加信息画法
    this.ChartDrawPicture=new Array();              //画图工具
    this.CurrentChartDrawPicture=null;              //当前的画图工具
    this.SelectChartDrawPicture=null;               //当前选中的画图
    this.ChartCorssCursor;                          //十字光标
    this.ChartSplashPaint=null;                     //等待提示
    this.Canvas=uielement.getContext("2d");         //画布
    this.UIElement=uielement;
    this.MouseDrag;
    this.DragMode=1;                                //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择

    this.CursorIndex=0;             //十字光标X轴索引
    this.LastPoint=new Point();     //鼠标位置
    this.IsForceLandscape=false;    //是否强制横屏

    //tooltip提示信息
    this.Tooltip=document.createElement("div");
    this.Tooltip.className='jschart-tooltip';
    this.Tooltip.style.background=g_JSChartResource.TooltipBGColor;
    this.Tooltip.style.opacity=g_JSChartResource.TooltipAlpha;
    this.Tooltip.id=Guid();
    uielement.parentNode.appendChild(this.Tooltip);
    this.IsShowTooltip=true;    //是否显示K线tooltip

    //区间选择
    this.SelectRect=document.createElement("div");
    this.SelectRect.className="jschart-selectrect";
    this.SelectRect.style.background=g_JSChartResource.SelectRectBGColor;
    //this.SelectRect.style.opacity=g_JSChartResource.SelectRectAlpha;
    this.SelectRect.id=Guid();
    uielement.parentNode.appendChild(this.SelectRect);

    //坐标轴风格方法 double-更加数值型分割  price-更加股票价格分割
    this.FrameSplitData=new Map();
    this.FrameSplitData.set("double",new SplitData());
    this.FrameSplitData.set("price",new PriceSplitData());

    uielement.onmousemove=function(e)
    {
        var x = e.clientX-this.getBoundingClientRect().left;
        var y = e.clientY-this.getBoundingClientRect().top;

        //加载数据中,禁用鼠标事件
        if (this.JSChartContainer.ChartSplashPaint && this.JSChartContainer.ChartSplashPaint.IsEnableSplash == true) return;

        if(this.JSChartContainer)
            this.JSChartContainer.OnMouseMove(x,y,e);
    }

    uielement.oncontextmenu=function(e)
    {
        var x = e.clientX-this.getBoundingClientRect().left;
        var y = e.clientY-this.getBoundingClientRect().top;

        if(this.JSChartContainer && typeof(this.JSChartContainer.OnRightMenu)=='function')
            this.JSChartContainer.OnRightMenu(x,y,e);   //右键菜单事件

        return false;
    }

    uielement.onmousedown=function(e)
    {
        if(!this.JSChartContainer) return;
        if(this.JSChartContainer.DragMode==0) return;

        if (this.JSChartContainer.TryClickLock)
        {
            var x = e.clientX-this.getBoundingClientRect().left;
            var y = e.clientY-this.getBoundingClientRect().top;
            if (this.JSChartContainer.TryClickLock(x,y)) return;
        }

        this.JSChartContainer.HideSelectRect();
        //rectContextMenu.hide();

        var drag=
        {
            "Click":{},
            "LastMove":{},  //最后移动的位置
        };

        drag.Click.X=e.clientX;
        drag.Click.Y=e.clientY;
        drag.LastMove.X=e.clientX;
        drag.LastMove.Y=e.clientY;

        this.JSChartContainer.MouseDrag=drag;
        document.JSChartContainer=this.JSChartContainer;
        this.JSChartContainer.SelectChartDrawPicture=null;
        if (this.JSChartContainer.CurrentChartDrawPicture)  //画图工具模式
        {
            this.JSChartContainer.SetChartDrawPictureFirstPoint(drag.Click.X,drag.Click.Y);
        }
        else    //是否在画图工具上
        {
            var drawPictrueData={};
            drawPictrueData.X=e.clientX-this.getBoundingClientRect().left;
            drawPictrueData.Y=e.clientY-this.getBoundingClientRect().top;
            if (this.JSChartContainer.GetChartDrawPictureByPoint(drawPictrueData))
            {
                drawPictrueData.ChartDrawPicture.Status=20;
                drawPictrueData.ChartDrawPicture.ValueToPoint();
                drawPictrueData.ChartDrawPicture.MovePointIndex=drawPictrueData.PointIndex;
                this.JSChartContainer.CurrentChartDrawPicture=drawPictrueData.ChartDrawPicture;
                this.JSChartContainer.SelectChartDrawPicture=drawPictrueData.ChartDrawPicture;
            }
        }

        uielement.ondblclick=function(e)
        {
            var x = e.clientX-this.getBoundingClientRect().left;
            var y = e.clientY-this.getBoundingClientRect().top;

            if(this.JSChartContainer)
                this.JSChartContainer.OnDoubleClick(x,y,e);
        }

        document.onmousemove=function(e)
        {
            if(!this.JSChartContainer) return;
            //加载数据中,禁用鼠标事件
            if (this.JSChartContainer.ChartSplashPaint && this.JSChartContainer.ChartSplashPaint.IsEnableSplash == true) return;

            var drag=this.JSChartContainer.MouseDrag;
            if (!drag) return;

            var moveSetp=Math.abs(drag.LastMove.X-e.clientX);

            if (this.JSChartContainer.CurrentChartDrawPicture)
            {
                var drawPicture=this.JSChartContainer.CurrentChartDrawPicture;
                if (drawPicture.Status==1 || drawPicture.Status==2)
                {
                    if(Math.abs(drag.LastMove.X-e.clientX)<5 && Math.abs(drag.LastMove.Y-e.clientY)<5) return;
                    if(this.JSChartContainer.SetChartDrawPictureSecondPoint(e.clientX,e.clientY))
                    {
                        this.JSChartContainer.DrawDynamicInfo();
                    }
                }
                else if (drawPicture.Status==20)    //画图工具移动
                {
                    if(Math.abs(drag.LastMove.X-e.clientX)<5 && Math.abs(drag.LastMove.Y-e.clientY)<5) return;

                    if(this.JSChartContainer.MoveChartDrawPicture(e.clientX-drag.LastMove.X,e.clientY-drag.LastMove.Y))
                    {
                        this.JSChartContainer.DrawDynamicInfo();
                    }
                }

                drag.LastMove.X=e.clientX;
                drag.LastMove.Y=e.clientY;
            }
            else if (this.JSChartContainer.DragMode==1)  //数据左右拖拽
            {
                if (moveSetp<5) return;

                var isLeft=true;
                if (drag.LastMove.X<e.clientX) isLeft=false;//右移数据

                if(this.JSChartContainer.DataMove(moveSetp,isLeft))
                {
                    this.JSChartContainer.UpdataDataoffset();
                    this.JSChartContainer.UpdatePointByCursorIndex();
                    this.JSChartContainer.UpdateFrameMaxMin();
                    this.JSChartContainer.ResetFrameXYSplit();
                    this.JSChartContainer.Draw();
                }

                drag.LastMove.X=e.clientX;
                drag.LastMove.Y=e.clientY;
            }
            else if (this.JSChartContainer.DragMode==2) //区间选择
            {
                yMoveSetp=Math.abs(drag.LastMove.Y-e.clientY);

                if (moveSetp<5 && yMoveSetp<5) return;

                this.JSChartContainer.ShowSelectRect(drag.Click.X,drag.Click.Y,e.clientX,e.clientY);

                drag.LastMove.X=e.clientX;
                drag.LastMove.Y=e.clientY;
            }
        };

        document.onmouseup=function(e)
        {
            //清空事件
            document.onmousemove=null;
            document.onmouseup=null;

            if (this.JSChartContainer && this.JSChartContainer.CurrentChartDrawPicture)
            {
                if (this.JSChartContainer.CurrentChartDrawPicture.Status==2)
                {
                    if (this.JSChartContainer.FinishChartDrawPicturePoint())
                        this.JSChartContainer.DrawDynamicInfo();
                }
                else if (this.JSChartContainer.CurrentChartDrawPicture.Status==20)
                {
                    if (this.JSChartContainer.FinishMoveChartDrawPicture())
                        this.JSChartContainer.DrawDynamicInfo();
                }
            }
            else if (this.JSChartContainer && this.JSChartContainer.DragMode==2)  //区间选择
            {
                var drag=this.JSChartContainer.MouseDrag;

                var selectData=new SelectRectData();
                //区间起始位置 结束位子
                selectData.XStart=drag.Click.X;
                selectData.XEnd=drag.LastMove.X;
                selectData.JSChartContainer=this.JSChartContainer;

                if (this.JSChartContainer.GetSelectRectData(selectData))
                {
                    rectContextMenu.show({
                        x:drag.LastMove.X,
                        y:drag.LastMove.Y,
                        position:_self.Frame.Position,
                        data: [{
                            text: "区间统计",
                            click: function (selectData){
                                selectData.JSChartContainer.HideSelectRect();
                                Interval.show(selectData);
                            }},{
                                text:'形态选股',
                                click:function(selectData){
                                    selectData.JSChartContainer.HideSelectRect();
                                    //形态选股
                                    //选出相似度>.90的股票
                                    var scopeData={Plate:["CNA.ci"],Minsimilar:0.85};
                                    Common.showLoad();
                                    selectData.JSChartContainer.RequestKLineMatch(selectData,scopeData,function(data){
                                        KLineMatch.show(data);
                                    });
                                }

                            }],

                        returnData:selectData
                    });

                    //形态选股
                    //选出相似度>.90的股票
                    //var scopeData={Plate:["S24.ci"],Minsimilar:0.85};
                    //this.JSChartContainer.RequestKLineMatch(this.JSChartContainer,selectData,scopeData);
                }
            }

            //清空数据
            this.JSChartContainer.MouseDrag=null;
            this.JSChartContainer.CurrentChartDrawPicture=null;
            this.JSChartContainer=null;
        }
    }

    //判断是单个手指
    this.IsPhoneDragging=function(e)
    {
        // console.log(e);
        var changed=e.changedTouches.length;
        var touching=e.touches.length;

        return changed==1 && touching==1;
    }

    //是否是2个手指操所
    this.IsPhonePinching=function(e)
    {
        var changed=e.changedTouches.length;
        var touching=e.touches.length;

        return (changed==1 || changed==2) && touching==2;
    }

    this.GetToucheData=function(e, isForceLandscape)
    {
        var touches=new Array();
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        for(var i=0; i<e.touches.length; ++i)
        {
            var item=e.touches[i];
            if (isForceLandscape)
            {
                touches.push(
                    {
                        clientX:item.clientY*pixelTatio, clientY:item.clientX*pixelTatio, 
                        pageX:item.pageY*pixelTatio, pageY:item.pageX*pixelTatio
                    });
            }
            else
            {
                touches.push(
                    {
                        clientX:item.clientX*pixelTatio, clientY:item.clientY*pixelTatio, 
                        pageX:item.pageX*pixelTatio, pageY:item.pageY*pixelTatio
                    });
            }
        }

        return touches;
    }

    //手机拖拽
    uielement.ontouchstart=function(e)
    {
        if(!this.JSChartContainer) return;
        if(this.JSChartContainer.DragMode==0) return;

        this.JSChartContainer.PhonePinch=null;

        e.preventDefault();
        var jsChart=this.JSChartContainer;

        if (jsChart.IsPhoneDragging(e))
        {
            //长按2秒,十字光标
            var timeout=setTimeout(function()
            {
                if (drag.Click.X==drag.LastMove.X && drag.Click.Y==drag.LastMove.Y) //手指没有移动，出现十字光标
                {
                    var mouseDrag=jsChart.MouseDrag;
                    jsChart.MouseDrag=null;
                    //移动十字光标
                    var pixelTatio = GetDevicePixelRatio();
                    var x = drag.Click.X-uielement.getBoundingClientRect().left*pixelTatio;
                    var y = drag.Click.Y-uielement.getBoundingClientRect().top*pixelTatio;
                    jsChart.OnMouseMove(x,y,e);
                }

            }, 1000);

            var drag=
            {
                "Click":{},
                "LastMove":{},  //最后移动的位置
            };

            var touches=jsChart.GetToucheData(e,jsChart.IsForceLandscape);

            drag.Click.X=touches[0].clientX;
            drag.Click.Y=touches[0].clientY;
            drag.LastMove.X=touches[0].clientX;
            drag.LastMove.Y=touches[0].clientY;

            this.JSChartContainer.MouseDrag=drag;
            document.JSChartContainer=this.JSChartContainer;
            this.JSChartContainer.SelectChartDrawPicture=null;
            if (this.JSChartContainer.CurrentChartDrawPicture)  //画图工具模式
            {
                return;
            }
        }
        else if (jsChart.IsPhonePinching(e))
        {
            var phonePinch=
            {
                "Start":{},
                "Last":{}
            };

            var touches=jsChart.GetToucheData(e,jsChart.IsForceLandscape);

            phonePinch.Start={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
            phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};

            this.JSChartContainer.PhonePinch=phonePinch;
            document.JSChartContainer=this.JSChartContainer;
            this.JSChartContainer.SelectChartDrawPicture=null;
        }

        uielement.ontouchmove=function(e)
        {
            if(!this.JSChartContainer) return;
            e.preventDefault();

            var touches=jsChart.GetToucheData(e,this.JSChartContainer.IsForceLandscape);

            if (jsChart.IsPhoneDragging(e))
            {
                var drag=this.JSChartContainer.MouseDrag;
                if (drag==null)
                {
                    var pixelTatio = GetDevicePixelRatio();
                    var x = touches[0].clientX-this.getBoundingClientRect().left*pixelTatio;
                    var y = touches[0].clientY-this.getBoundingClientRect().top*pixelTatio;
                    if (this.JSChartContainer.IsForceLandscape) y=this.getBoundingClientRect().width-touches[0].clientY;    //强制横屏Y计算
                    this.JSChartContainer.OnMouseMove(x,y,e);
                }
                else
                {
                    var moveSetp=Math.abs(drag.LastMove.X-touches[0].clientX);
                    moveSetp=parseInt(moveSetp);
                    if (this.JSChartContainer.DragMode==1)  //数据左右拖拽
                    {
                        if (moveSetp<5) return;

                        var isLeft=true;
                        if (drag.LastMove.X<touches[0].clientX) isLeft=false;//右移数据

                        if(this.JSChartContainer.DataMove(moveSetp,isLeft))
                        {
                            this.JSChartContainer.UpdataDataoffset();
                            this.JSChartContainer.UpdatePointByCursorIndex();
                            this.JSChartContainer.UpdateFrameMaxMin();
                            this.JSChartContainer.ResetFrameXYSplit();
                            this.JSChartContainer.Draw();
                        }

                        drag.LastMove.X=touches[0].clientX;
                        drag.LastMove.Y=touches[0].clientY;
                    }
                }
            }else if (jsChart.IsPhonePinching(e))
            {
                var phonePinch=this.JSChartContainer.PhonePinch;
                if (!phonePinch) return;

                var yHeight=Math.abs(touches[0].pageY-touches[1].pageY);
                var yLastHeight=Math.abs(phonePinch.Last.Y-phonePinch.Last.Y2);
                var yStep=yHeight-yLastHeight;
                if (Math.abs(yStep)<5) return;

                if (yStep>0)    //放大
                {
                    var cursorIndex={};
                    cursorIndex.Index=parseInt(Math.abs(this.JSChartContainer.CursorIndex-0.5).toFixed(0));
                    if (!this.JSChartContainer.Frame.ZoomUp(cursorIndex)) return;
                    this.JSChartContainer.CursorIndex=cursorIndex.Index;
                    this.JSChartContainer.UpdatePointByCursorIndex();
                    this.JSChartContainer.UpdataDataoffset();
                    this.JSChartContainer.UpdateFrameMaxMin();
                    this.JSChartContainer.Draw();
                    this.JSChartContainer.ShowTooltipByKeyDown();
                }
                else        //缩小
                {
                    var cursorIndex={};
                    cursorIndex.Index=parseInt(Math.abs(this.JSChartContainer.CursorIndex-0.5).toFixed(0));
                    if (!this.JSChartContainer.Frame.ZoomDown(cursorIndex)) return;
                    this.JSChartContainer.CursorIndex=cursorIndex.Index;
                    this.JSChartContainer.UpdataDataoffset();
                    this.JSChartContainer.UpdatePointByCursorIndex();
                    this.JSChartContainer.UpdateFrameMaxMin();
                    this.JSChartContainer.Draw();
                    this.JSChartContainer.ShowTooltipByKeyDown();
                }

                phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
            }
        };

        uielement.ontouchend=function(e)
        {
            clearTimeout(timeout);
        }

    }

    this.Draw=function()
    {
        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.Canvas.lineWidth=pixelTatio;       //手机端需要根据分辨率比调整线段宽度

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)
        {
            this.ChartSplashPaint.Draw();
            return;
        }
        //框架
        this.Frame.Draw();

        //框架内图形
        for (var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (item.IsDrawFirst)
                item.Draw();
        }

        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw();
        }

        for(var i in this.ChartPaintEx)
        {
            var item=this.ChartPaintEx[i];
            item.Draw();
        }

        //叠加股票
        for(var i in this.OverlayChartPaint)
        {
            var item=this.OverlayChartPaint[i];
            item.Draw();
        }

        //框架外图形
        for(var i in this.ExtendChartPaint)
        {
            var item=this.ExtendChartPaint[i];
            item.Draw();
        }

        this.Frame.DrawInsideHorizontal();
        this.Frame.DrawLock();
        this.Frame.Snapshot();

        if (this.LastPoint.X!=null || this.LastPoint.Y!=null)
        {
            if (this.ChartCorssCursor)
            {
                this.ChartCorssCursor.LastPoint=this.LastPoint;
                this.ChartCorssCursor.Draw();
            }
        }

        for(var i in this.TitlePaint)
        {
            var item=this.TitlePaint[i];
            if (!item.IsDynamic) continue;

            item.CursorIndex=this.CursorIndex;
            item.Draw();
        }

        for(var i in this.ChartDrawPicture)
        {
            var item=this.ChartDrawPicture[i];
            item.Draw();
        }

        if (this.CurrentChartDrawPicture && this.CurrentChartDrawPicture.Status!=10)
        {
            this.CurrentChartDrawPicture.Draw();
        }

    }

    //画动态信息
    this.DrawDynamicInfo=function()
    {
        if (this.Frame.ScreenImageData==null) return;

        var isErase=false;
        if (this.ChartCorssCursor)
        {
            if (this.ChartCorssCursor.PointX!=null || this.ChartCorssCursor.PointY!=null)
                isErase=true;
        }

        if (isErase) this.Canvas.putImageData(this.Frame.ScreenImageData,0,0);

        if (this.ChartCorssCursor)
        {
            this.ChartCorssCursor.LastPoint=this.LastPoint;
            this.ChartCorssCursor.Draw();
        }

        for(var i in this.TitlePaint)
        {
            var item=this.TitlePaint[i];
            if (!item.IsDynamic) continue;

            item.CursorIndex=this.CursorIndex;
            item.Draw();
        }

        for(var i in this.ChartDrawPicture)
        {
            var item=this.ChartDrawPicture[i];
            item.Draw();
        }

        if (this.CurrentChartDrawPicture && this.CurrentChartDrawPicture.Status!=10)
        {
            this.CurrentChartDrawPicture.Draw();
        }
    }

    this.OnMouseMove=function(x,y,e)
    {
        this.LastPoint.X=x;
        this.LastPoint.Y=y;
        this.CursorIndex=this.Frame.GetXData(x);

        var drawPictrueData={};
        drawPictrueData.X=x;
        drawPictrueData.Y=y;
        if (this.GetChartDrawPictureByPoint(drawPictrueData))
        {
            this.UIElement.style.cursor="pointer";
        }
        else
        {
            this.UIElement.style.cursor="default";
        }

        this.DrawDynamicInfo();

        if (this.IsShowTooltip)
        {
            var toolTip=new TooltipData();
            for(var i in this.ChartPaint)
            {
                var item=this.ChartPaint[i];
                if (item.GetTooltipData(x,y,toolTip))
                {
                    break;
                }
            }

            if (!toolTip.Data)
            {
                for(var i in this.OverlayChartPaint)
                {
                    var item=this.OverlayChartPaint[i];
                    if (item.GetTooltipData(x,y,toolTip))
                    {
                        break;
                    }
                }
            }

            if (toolTip.Data)
            {
                this.ShowTooltip(x,y,toolTip);
            }
            else
            {
                this.HideTooltip();
            }
        }
    }

    this.OnKeyDown=function(e)
    {
        var keyID = e.keyCode ? e.keyCode :e.which;
        switch(keyID)
        {
            case 37: //left
                if (this.CursorIndex<=0.99999)
                {
                    if (!this.DataMoveLeft()) break;
                    this.UpdataDataoffset();
                    this.UpdatePointByCursorIndex();
                    this.UpdateFrameMaxMin();
                    this.Draw();
                    this.ShowTooltipByKeyDown();
                }
                else
                {
                    --this.CursorIndex;
                    this.UpdatePointByCursorIndex();
                    this.DrawDynamicInfo();
                    this.ShowTooltipByKeyDown();
                }
                break;
            case 39: //right
                var xPointcount=0;
                if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount;
                else xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
                if (this.CursorIndex+1>=xPointcount)
                {
                    if (!this.DataMoveRight()) break;
                    this.UpdataDataoffset();
                    this.UpdatePointByCursorIndex();
                    this.UpdateFrameMaxMin();
                    this.Draw();
                    this.ShowTooltipByKeyDown();
                }
                else
                {
                    //判断是否在最后一个数据上
                    var data=null;
                    if (!this.Frame.Data) data=this.Frame.Data;
                    else data=this.Frame.SubFrame[0].Frame.Data;
                    if (!data) break;
                    if (this.CursorIndex+data.DataOffset+1>=data.Data.length) break;

                    ++this.CursorIndex;
                    this.UpdatePointByCursorIndex();
                    this.DrawDynamicInfo();
                    this.ShowTooltipByKeyDown();
                }
                break;
            case 38:    //up
                var cursorIndex={};
                cursorIndex.Index=parseInt(Math.abs(this.CursorIndex-0.5).toFixed(0));
                if (!this.Frame.ZoomUp(cursorIndex)) break;
                this.CursorIndex=cursorIndex.Index;
                this.UpdatePointByCursorIndex();
                this.UpdataDataoffset();
                this.UpdateFrameMaxMin();
                this.Draw();
                this.ShowTooltipByKeyDown();
                break;
            case 40:    //down
                var cursorIndex={};
                cursorIndex.Index=parseInt(Math.abs(this.CursorIndex-0.5).toFixed(0));
                if (!this.Frame.ZoomDown(cursorIndex)) break;
                this.CursorIndex=cursorIndex.Index;
                this.UpdataDataoffset();
                this.UpdatePointByCursorIndex();
                this.UpdateFrameMaxMin();
                this.Draw();
                this.ShowTooltipByKeyDown();
                break;
            case 46:    //del
                if (!this.SelectChartDrawPicture) break;
                var drawPicture=this.SelectChartDrawPicture;
                this.SelectChartDrawPicture=null;
                this.ClearChartDrawPicture(drawPicture);    //删除选中的画图工具
                break;
            default:
                return;
        }

        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnDoubleClick=function(x,y,e)
    {
        //console.log(e);
    }

    this.UpdatePointByCursorIndex=function()
    {
        this.LastPoint.X=this.Frame.GetXFromIndex(this.CursorIndex);

        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var data=this.Frame.Data;
        if (data.DataOffset+index>=data.Data.length)
        {
            return;
        }
        var close=data.Data[data.DataOffset+index].Close;

        this.LastPoint.Y=this.Frame.GetYFromData(close);
    }

    this.ShowTooltipByKeyDown=function()
    {
        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var data=this.Frame.Data;

        var toolTip=new TooltipData();
        toolTip.Data=data.Data[data.DataOffset+index];
        toolTip.ChartPaint=this.ChartPaint[0];

        this.ShowTooltip(this.LastPoint.X,this.LastPoint.Y,toolTip);
    }

    this.ShowTooltip=function(x,y,toolTip)
    {
        if (!this.IsShowTooltip) return;
        
        var format=new HistoryDataStringFormat();
        format.Value=toolTip;
        if (!format.Operator()) return;

        var scrollPos=GetScrollPosition();
        var left = x+ this.UIElement.getBoundingClientRect().left+scrollPos.Left;
        var top = y+this.UIElement.getBoundingClientRect().top+8+scrollPos.Top;
        var width=157;
        this.Tooltip.style.width = width+"px";
        this.Tooltip.style.height =180+"px";
        if (toolTip.ChartPaint.Name=="Overlay-KLine")  this.Tooltip.style.height =195+"px";
        this.Tooltip.style.position = "absolute";
        if (left+width>this.UIElement.getBoundingClientRect().right+scrollPos.Left)
            this.Tooltip.style.left = (left-width) + "px";
        else
            this.Tooltip.style.left = left + "px";
        this.Tooltip.style.top = top + "px";
        this.Tooltip.innerHTML=format.Text;
        this.Tooltip.style.display = "block";
    }

    this.HideTooltip=function()
    {
        this.Tooltip.style.display = "none";
    }

    this.ShowSelectRect=function(x,y,x2,y2)
    {
        var left = x;
        var top = y;

        var scrollPos=GetScrollPosition();
        var borderRight=this.Frame.ChartBorder.GetRight()+this.UIElement.getBoundingClientRect().left+scrollPos.Left;
        var borderLeft=this.Frame.ChartBorder.GetLeft()+this.UIElement.getBoundingClientRect().left+scrollPos.Left;

        if (x>borderRight) x=borderRight;
        if (x2>borderRight) x2=borderRight;

        if (x<borderLeft) x=borderLeft;
        if (x2<borderLeft) x2=borderLeft;

        if (x>x2) left=x2;
        if (y>y2) top=y2;

        width=Math.abs(x-x2);
        height=Math.abs(y-y2);

        this.SelectRect.style.width = width+"px";
        this.SelectRect.style.height =height+"px";
        this.SelectRect.style.position = "absolute";
        this.SelectRect.style.left = left + scrollPos.Left+"px";
        this.SelectRect.style.top = top + scrollPos.Top+"px";
        this.SelectRect.style.display = "block";
    }

    this.HideSelectRect=function()
    {
        this.SelectRect.style.display = "none";
    }

    this.ResetFrameXYSplit=function()
    {
        if (typeof(this.Frame.ResetXYSplit)=='function')
            this.Frame.ResetXYSplit();
    }

    this.UpdateFrameMaxMin=function()
    {
        var frameMaxMinData=new Array();

        var chartPaint=new Array();

        for(var i in this.ChartPaint)
        {
            chartPaint.push(this.ChartPaint[i]);
        }
        for(var i in this.OverlayChartPaint)
        {
            chartPaint.push(this.OverlayChartPaint[i]);
        }

        for(var i in chartPaint)
        {
            var paint=chartPaint[i];
            var range=paint.GetMaxMin();
            if (range==null || range.Max==null || range.Min==null) continue;
            var frameItem=null;
            for(var j in frameMaxMinData)
            {
                if (frameMaxMinData[j].Frame==paint.ChartFrame)
                {
                    frameItem=frameMaxMinData[j];
                    break;
                }
            }

            if (frameItem)
            {
                if (frameItem.Range.Max<range.Max) frameItem.Range.Max=range.Max;
                if (frameItem.Range.Min>range.Min) frameItem.Range.Min=range.Min;
            }
            else
            {
                frameItem={};
                frameItem.Frame=paint.ChartFrame;
                frameItem.Range=range;
                frameMaxMinData.push(frameItem);
            }
        }

        for(var i in frameMaxMinData)
        {
            var item=frameMaxMinData[i];
            if (!item.Frame || !item.Range) continue;
            if (item.Range.Max==null || item.Range.Min==null) continue;
            if (item.Frame.YSpecificMaxMin)
            {
                item.Frame.HorizontalMax=item.Frame.YSpecificMaxMin.Max;
                item.Frame.HorizontalMin=item.Frame.YSpecificMaxMin.Min;
            }
            else
            {
                item.Frame.HorizontalMax=item.Range.Max;
                item.Frame.HorizontalMin=item.Range.Min;
            }
            item.Frame.XYSplit=true;
        }
    }

    this.DataMoveLeft=function()
    {
        var data=null;
        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;
        if (data.DataOffset<=0) return false;
        --data.DataOffset;
        return true;
    }

    this.DataMoveRight=function()
    {
        var data=null;
        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;

        var xPointcount=0;
        if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount;
        else xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (xPointcount+data.DataOffset>=data.Data.length) return false;

        ++data.DataOffset;
        return true;
    }

    this.UpdataDataoffset=function()
    {
        var data=null;
        if (this.Frame.Data)
            data=this.Frame.Data;
        else
            data=this.Frame.SubFrame[0].Frame.Data;

        if (!data) return;

        for(var i in this.ChartPaint)
        {
            var item =this.ChartPaint[i];
            if (!item.Data) continue;
            item.Data.DataOffset=data.DataOffset;
        }

        for(var i in this.OverlayChartPaint)
        {
            var item =this.OverlayChartPaint[i];
            if (!item.Data) continue;
            item.Data.DataOffset=data.DataOffset;
        }
    }

    this.DataMove=function(step,isLeft)
    {
        var data=null;

        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;

        var xPointcount=0;
        if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount;
        else xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (isLeft) //-->
        {
            if (xPointcount+data.DataOffset>=data.Data.length) return false;

            data.DataOffset+=step;

            if (data.DataOffset+xPointcount>=data.Data.length)
                data.DataOffset=data.Data.length-xPointcount;

            return true;
        }
        else        //<--
        {
            if (data.DataOffset<=0) return false;

            data.DataOffset-=step;
            if (data.DataOffset<0) data.DataOffset=0;

            return true;
        }
    }

    //获取鼠标在当前子窗口id
    this.GetSubFrameIndex=function(x,y)
    {
        if (!this.Frame.SubFrame || this.Frame.SubFrame.length<=0) return -1;

        for(var i in this.Frame.SubFrame)
        {
            var frame=this.Frame.SubFrame[i].Frame;
            var left=frame.ChartBorder.GetLeft();
            var top=frame.ChartBorder.GetTop();
            var height=frame.ChartBorder.GetHeight();
            var width=frame.ChartBorder.GetWidth();

            this.Canvas.rect(left,top,width,height);
            if (this.Canvas.isPointInPath(x,y)) return parseInt(i);

        }
        return 0;
    }

    //根据X坐标获取数据索引
    this.GetDataIndexByPoint=function(x)
    {
        var frame=this.Frame;
        if (this.Frame.SubFrame && this.Frame.SubFrame.length>0) frame=this.Frame.SubFrame[0].Frame;

        var data=null;
        if (this.Frame.Data)
            data=this.Frame.Data;
        else
            data=this.Frame.SubFrame[0].Frame.Data;

        if (!data || !frame) return;

        var index=parseInt(frame.GetXData(x));

        //console.log('x='+ x +' date='+data.Data[data.DataOffset+index].Date);
        return data.DataOffset+index;
    }

    //获取主数据
    this.GetSelectRectData=function(selectData)
    {
        if (Math.abs(selectData.XStart-selectData.XEnd)<5) return false;

        var data=null;
        if (this.Frame.Data)
            data=this.Frame.Data;
        else
            data=this.Frame.SubFrame[0].Frame.Data;

        if (!data) return false;

        var start=this.GetDataIndexByPoint(selectData.XStart);
        var end=this.GetDataIndexByPoint(selectData.XEnd);

        if (Math.abs(start-end)<2) return false;

        selectData.Data=data;
        if (start>end)
        {
            selectData.Start=end;
            selectData.End=start;
        }
        else
        {
            selectData.Start=start;
            selectData.End=end;
        }

        return true;
    }

    //获取当前的点对应的 画图工具的图形
    //data.X data.Y 鼠标位置  返回 data.ChartDrawPicture 数据在画图工具 data.PointIndex 在画图工具对应点索引
    this.GetChartDrawPictureByPoint=function(data)
    {
        for(var i in this.ChartDrawPicture)
        {
            var item =this.ChartDrawPicture[i];
            var pointIndex=item.IsPointIn(data.X,data.Y);
            if (pointIndex>=0)
            {
                data.ChartDrawPicture=item;
                data.PointIndex=pointIndex;
                return true;
            }
        }

        return false;
    }
}

function GetDevicePixelRatio()
{
    return window.devicePixelRatio || 1;
}

function OnKeyDown(e)
{
    if(this.JSChartContainer)
        this.JSChartContainer.OnKeyDown(e);
}

function ToFixed(number, precision)
{
    var b = 1;
    if (isNaN(number)) return number;
    if (number < 0) b = -1;
    var multiplier = Math.pow(10, precision);
    var value=Math.round(Math.abs(number) * multiplier) / multiplier * b;

    var s = value.toString();
    var rs = s.indexOf('.');
    if (rs < 0 && precision>0)
    {
        rs = s.length;
        s += '.';
    }

    while (s.length <= rs + precision)
    {
        s += '0';
    }

    return s;
}

Number.prototype.toFixed = function( precision )
{
    return ToFixed(this,precision)
}

function Guid()
{
    function S4()
    {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function GetScrollPosition()
{
    var scrollPos={};
    var scrollTop=0;
    var scrollLeft=0;
    if(document.documentElement && document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
        scrollLeft=document.documentElement.scrollLeft;
    }else if(document.body)
    {
        scrollTop=document.body.scrollTop;
        scrollLeft=document.body.scrollLeft;
    }

    scrollPos.Top=scrollTop;
    scrollPos.Left=scrollLeft;
    return scrollPos;
}

//修正线段有毛刺
function ToFixedPoint(value)
{
    return parseInt(value)+0.5;
}

function ToFixedRect(value)
{
    // With a bitwise or.
    //rounded = (0.5 + somenum) | 0;
    // A double bitwise not.
    //rounded = ~~ (0.5 + somenum);
    // Finally, a left bitwise shift.
    var rounded;
    return rounded = (0.5 + value) << 0;
}



function Point()
{
    this.X;
    this.Y;
}

function SelectRectData()
{
    this.Data;                  //主数据
    this.JSChartContainer;      //行情控件

    this.Start; //数据起始位子
    this.End;   //数据结束位置

    this.XStart;//X坐标起始位置
    this.XEnd;  //X位置结束为止
}

//坐标信息
function CoordinateInfo()
{
    this.Value;                                                 //坐标数据
    this.Message=new Array();                                   //坐标输出文字信息
    this.TextColor=g_JSChartResource.FrameSplitTextColor        //文字颜色
    this.Font=g_JSChartResource.FrameSplitTextFont;             //字体
    this.LineColor=g_JSChartResource.FrameSplitPen;             //线段颜色
}


//边框信息
function ChartBorder()
{
    this.UIElement;

    //四周间距
    this.Left=50;
    this.Right=80;
    this.Top=50;
    this.Bottom=50;
    this.TitleHeight=24;    //标题高度

    this.GetChartWidth=function()
    {
        return this.UIElement.width;
    }

    this.GetChartHeight=function()
    {
        return this.UIElement.height;
    }

    this.GetLeft=function()
    {
        return this.Left;
    }

    this.GetRight=function()
    {
        return this.UIElement.width-this.Right;
    }

    this.GetTop=function()
    {
        return this.Top;
    }

    this.GetTopEx=function()    //去掉标题
    {
        return this.Top+this.TitleHeight;
    }

    this.GetBottom=function()
    {
        return this.UIElement.height-this.Bottom;
    }

    this.GetWidth=function()
    {
        return this.UIElement.width-this.Left-this.Right;
    }

    this.GetHeight=function()
    {
        return this.UIElement.height-this.Top-this.Bottom;
    }

    this.GetHeightEx=function() //去掉标题的高度
    {
        return this.UIElement.height-this.Top-this.Bottom-this.TitleHeight;
    }

    this.GetRightEx=function()  //横屏去掉标题高度的
    {
        return this.UIElement.width-this.Right-this.TitleHeight;
    }

    this.GetWidthEx=function()  //横屏去掉标题宽度
    {
        return this.UIElement.width-this.Left-this.Right-this.TitleHeight;
    }

    this.GetTitleHeight=function()
    {
        return this.TitleHeight;
    }
}

function IChartFramePainting()
{
    this.HorizontalInfo=new Array();    //Y轴
    this.VerticalInfo=new Array();      //X轴

    this.Canvas;                        //画布

    this.Identify;                      //窗口标识

    this.ChartBorder;
    this.PenBorder=g_JSChartResource.FrameBorderPen;        //边框颜色
    this.TitleBGColor=g_JSChartResource.FrameTitleBGColor;  //标题背景色
    this.IsShow=true;                   //是否显示
    this.SizeChange=true;               //大小是否改变
    this.XYSplit=true;                  //XY轴坐标信息改变

    this.HorizontalMax;                 //Y轴最大值
    this.HorizontalMin;                 //Y轴最小值
    this.XPointCount=10;                //X轴数据个数

    this.YSplitOperator;               //Y轴分割
    this.XSplitOperator;               //X轴分割
    this.Data;                         //主数据

    this.IsLocked=false;               //是否上锁
    this.LockPaint = null;

    this.YSpecificMaxMin=null;         //指定Y轴最大最小值

    this.Draw=function()
    {
        this.DrawFrame();
        this.DrawBorder();

        this.SizeChange=false;
        this.XYSplit=false;
    }

    this.DrawFrame=function() { }

    //画边框
    this.DrawBorder=function()
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;

        this.Canvas.strokeStyle=this.PenBorder;
        this.Canvas.strokeRect(left,top,width,height);
    }

    //画标题背景色
    this.DrawTitleBG=function()
    {
        if (this.ChartBorder.TitleHeight<=0) return;

        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetTopEx());
        var width=right-left;
        var height=bottom-top;

        this.Canvas.fillStyle=this.TitleBGColor;
        this.Canvas.fillRect(left,top,width,height);
    }

    this.DrawLock=function()
    {
        if (this.IsLocked)
        {
            if (this.LockPaint == null)
                this.LockPaint = new ChartLock();
            this.LockPaint.Canvas=this.Canvas;
            this.LockPaint.ChartBorder=this.ChartBorder;
            this.LockPaint.ChartFrame=this;
            this.LockPaint.Draw();
        }
    }

    //设施上锁
    this.SetLock=function(lockData)
    {
        if (!lockData)  //空数据不上锁
        {
            this.IsLocked=false;
            return;
        }

        this.IsLocked=true;
        if (!this.LockPaint) this.LockPaint=new ChartLock();    //创建锁

        if (lockData.Callback) this.LockPaint.Callback=lockData.Callback;       //回调
        if (lockData.IndexName) this.LockPaint.IndexName=lockData.IndexName;    //指标名字
        if (lockData.ID) this.LockPaint.LockID=lockData.ID;                     //锁ID
        if (lockData.BG) this.LockPaint.BGColor=lockData.BG;                    //背景色 
        if (lockData.Text) this.LockPaint.Title= lockData.Text;   
        if (lockData.TextColor) this.LockPaint.TextColor=lockData.TextColor;  
        if (lockData.Font) this.LockPaint.Font=lockData.Font;
        if (lockData.Count) this.LockPaint.LockCount=lockData.Count;
    }
}

//空框架只画边框
function NoneFrame()
{
    this.newMethod=IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Snapshot=function()
    {

    }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }
}

function AverageWidthFrame()
{
    this.newMethod=IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DataWidth=50;
    this.DistanceWidth=10;

    this.DrawFrame=function()
    {
        if (this.XPointCount>0)
        {
            let dInterval=this.ChartBorder.GetWidth()/(6*this.XPointCount); //分6份, 数据4 间距2
            this.DistanceWidth=2*dInterval;
			this.DataWidth=4*dInterval;
        }

        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetYFromData=function(value)
    {
        if(value<=this.HorizontalMin) return this.ChartBorder.GetBottom();
        if(value>=this.HorizontalMax) return this.ChartBorder.GetTopEx();

        var height=this.ChartBorder.GetHeightEx()*(value-this.HorizontalMin)/(this.HorizontalMax-this.HorizontalMin);
        return this.ChartBorder.GetBottom()-height;
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var borderRight=this.ChartBorder.Right;
        var borderLeft=this.ChartBorder.Left;

        var yPrev=null; //上一个坐标y的值
        for(var i=this.HorizontalInfo.length-1; i>=0; --i)  //从上往下画分割线
        {
            var item=this.HorizontalInfo[i];
            var y=this.GetYFromData(item.Value);
            if (y!=null && Math.abs(y-yPrev)<15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle=item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left,ToFixedPoint(y));
            this.Canvas.lineTo(right,ToFixedPoint(y));
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0]!=null && borderLeft>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillText(item.Message[0],left-2,y);
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1]!=null && borderRight>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillText(item.Message[1],right+2,y);
            }

            yPrev=y;
        }
    }

    //Y刻度画在左边内部
    this.DrawInsideHorizontal = function () 
    {
        if (this.IsHScreen===true) return;  //横屏不画

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopEx();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;
        if (borderLeft >= 10) return;

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
        {
        var item = this.HorizontalInfo[i];
        var y = this.GetYFromData(item.Value);
        if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

        //坐标信息 左边 间距小于10 画在内部
        if (item.Message[0] != null && borderLeft < 10) 
        {
            if (item.Font != null) this.Canvas.font = item.Font;
            this.Canvas.fillStyle = item.TextColor;
            this.Canvas.textAlign = "left";
            if (y >= bottom - 2)
            this.Canvas.textBaseline = 'bottom';
            else if (y <= top + 2)
            this.Canvas.textBaseline = 'top';
            else
            this.Canvas.textBaseline = "middle";
            this.Canvas.fillText(item.Message[0], left + 1, y);
        }

        yPrev = y;
        }
    }

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount;

        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetRight();
        }
        else
        {
            var offset=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*index/count;
            return offset;
        }
    }

    //画X轴
    this.DrawVertical=function()
    {
        var top=this.ChartBorder.GetTopEx();
        var bottom=this.ChartBorder.GetBottom();
        var right=this.ChartBorder.GetRight();

        var xPrev=null; //上一个坐标x的值
        for(var i in this.VerticalInfo)
        {
            var x=this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x>=right) break;
            if (xPrev!=null && Math.abs(x-xPrev)<80) continue;

            this.Canvas.strokeStyle=this.VerticalInfo[i].LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(x),top);
            this.Canvas.lineTo(ToFixedPoint(x),bottom);
            this.Canvas.stroke();

            if (this.VerticalInfo[i].Message[0]!=null)
            {
                if (this.VerticalInfo[i].Font!=null)
                    this.Canvas.font=this.VerticalInfo[i].Font;

                this.Canvas.fillStyle=this.VerticalInfo[i].TextColor;
                var testWidth=this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x<testWidth/2)
                {
                    this.Canvas.textAlign="left";
                    this.Canvas.textBaseline="top";
                }
                else
                {
                    this.Canvas.textAlign="center";
                    this.Canvas.textBaseline="top";
                }
                this.Canvas.fillText(this.VerticalInfo[i].Message[0],x,bottom);
            }

            xPrev=x;
        }
    }

    //Y坐标转y轴数值
    this.GetYData=function(y)
    {
        if (y<this.ChartBorder.GetTopEx()) return this.HorizontalMax;
		if (y>this.ChartBorder.GetBottom()) return this.HorizontalMin;

		return (this.ChartBorder.GetBottom()-y)/this.ChartBorder.GetHeightEx()*(this.HorizontalMax-this.HorizontalMin)+this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData=function(x)
    {
        if (x<=this.ChartBorder.GetLeft()) return 0;
		if (x>=this.ChartBorder.GetRight()) return this.XPointCount;

		return (x-this.ChartBorder.GetLeft())*(this.XPointCount*1.0/this.ChartBorder.GetWidth());
    }
}

function MinuteFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount-1;

        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetRight();
        }
        else
        {
            var offset=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*index/count;
            return offset;
        }
    }
}

//走势图 横屏框架
function MinuteHScreenFrame()
{
    this.newMethod=MinuteFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen=true;        //是否是横屏

    //画标题背景色
    this.DrawTitleBG=function()
    {
        if (this.ChartBorder.TitleHeight<=0) return;

        var left=ToFixedPoint(this.ChartBorder.GetRightEx());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=this.ChartBorder.TitleHeight;
        var height=bottom-top;

        this.Canvas.fillStyle=this.TitleBGColor;
        this.Canvas.fillRect(left,top,width,height);
    }

    //Y坐标转y轴数值
    this.GetYData=function(x)
    {
        if (x<this.ChartBorder.GetLeft()) return this.HorizontalMin;
		if (x>this.ChartBorder.GetRightEx()) return this.HorizontalMax;

		return (x-this.ChartBorder.GetLeft())/this.ChartBorder.GetWidthEx()*(this.HorizontalMax-this.HorizontalMin)+this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData=function(y)
    {
        if (y<=this.ChartBorder.GetTop()) return 0;
		if (y>=this.ChartBorder.GetBottom()) return this.XPointCount;

		return (y-this.ChartBorder.GetTop())*(this.XPointCount*1.0/this.ChartBorder.GetHeight());
    }

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount-1;

        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetTop();
            else return this.ChartBorder.GetBottom();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetTop();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetBottom();
        }
        else
        {
            var offset=this.ChartBorder.GetTop()+this.ChartBorder.GetHeight()*index/count;
            return offset;
        }
    }

    
    this.GetYFromData=function(value)
    {
        if(value<=this.HorizontalMin) return this.ChartBorder.GetLeft();
        if(value>=this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width=this.ChartBorder.GetWidthEx()*(value-this.HorizontalMin)/(this.HorizontalMax-this.HorizontalMin);
        return this.ChartBorder.GetLeft()+width;
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
        var top=this.ChartBorder.GetTop();
        var bottom=this.ChartBorder.GetBottom();
        var borderTop=this.ChartBorder.Top;
        var borderBottom=this.ChartBorder.Bottom;

        var yPrev=null; //上一个坐标y的值
        for(var i=this.HorizontalInfo.length-1; i>=0; --i)  //从左往右画分割线
        {
            var item=this.HorizontalInfo[i];
            var y=this.GetYFromData(item.Value);
            if (y!=null && Math.abs(y-yPrev)<15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle=item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y),top);
            this.Canvas.lineTo(ToFixedPoint(y),bottom);
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0]!=null && borderTop>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="middle";

                var xText=y,yText=top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1]!=null && borderBottom>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                var xText=y,yText=bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev=y;
        }
    }

    //画X轴
    this.DrawVertical=function()
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRightEx();
        var bottom=this.ChartBorder.GetBottom();

        var xPrev=null; //上一个坐标x的值
        for(var i in this.VerticalInfo)
        {
            var x=this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x>=bottom) break;
            if (xPrev!=null && Math.abs(x-xPrev)<80) continue;

            this.Canvas.strokeStyle=this.VerticalInfo[i].LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left,ToFixedPoint(x));
            this.Canvas.lineTo(right,ToFixedPoint(x));
            this.Canvas.stroke();

            if (this.VerticalInfo[i].Message[0]!=null)
            {
                if (this.VerticalInfo[i].Font!=null)
                    this.Canvas.font=this.VerticalInfo[i].Font;

                this.Canvas.fillStyle=this.VerticalInfo[i].TextColor;
                var testWidth=this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x<testWidth/2)
                {
                    this.Canvas.textAlign="left";
                    this.Canvas.textBaseline="top";
                }
                else
                {
                    this.Canvas.textAlign="center";
                    this.Canvas.textBaseline="top";
                }

                var xText=left,yText=x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, 0);
                this.Canvas.restore();
            }

            xPrev=x;
        }
    }
}

//K线框架
function KLineFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ToolbarID=Guid();  //工具条Div id

    this.ModifyIndex=true;  //是否显示'改参数'菜单
    this.ChangeIndex=true;  //是否显示'换指标'菜单

    this.ModifyIndexEvent;  //改参数 点击事件
    this.ChangeIndexEvent;   //换指标 点击事件

    this.DrawToolbar=function()
    {
        var divToolbar=document.getElementById(this.ToolbarID);
        if (!divToolbar)
        {
            divToolbar=document.createElement("div");
            divToolbar.className='klineframe-toolbar';
            divToolbar.id=this.ToolbarID;
            //为divToolbar添加属性identify
            divToolbar.setAttribute("identify",this.Identify.toString());
            this.ChartBorder.UIElement.parentNode.appendChild(divToolbar);
        }

        if (!this.ModifyIndex && !this.ChangeIndex)
        {
            divToolbar.style.display='none';
            return;
        }

        var toolbarWidth=100;
        var toolbarHeight=this.ChartBorder.GetTitleHeight();
        var left=this.ChartBorder.GetRight()-toolbarWidth;
        var top=this.ChartBorder.GetTop();
        var spanIcon = "<span class='parameters icon iconfont icon-canshushezhi' id='modifyindex' style='cursor:pointer;'></span>&nbsp;&nbsp;" +
            "<span class='target icon iconfont icon-shezhi-tianchong' id='changeindex' style='cursor:pointer;'></span>";
        var scrollPos=GetScrollPosition();
        left = left+ this.ChartBorder.UIElement.getBoundingClientRect().left+scrollPos.Left;
        top = top+this.ChartBorder.UIElement.getBoundingClientRect().top+scrollPos.Top;
        divToolbar.style.left = left + "px";
        divToolbar.style.top = top + "px";
        divToolbar.style.width=toolbarWidth+"px";
        divToolbar.style.height=toolbarHeight+'px';
        divToolbar.innerHTML=spanIcon;

        var chart=this.ChartBorder.UIElement.JSChartContainer;
        var identify=this.Identify;
        if (!this.ModifyIndex)  //隐藏'改参数'
            $("#"+divToolbar.id+" .parameters").hide();
        else if (typeof(this.ModifyIndexEvent)=='function')  //绑定点击事件
            $("#"+divToolbar.id+" .parameters").click(
                {
                    Chart:this.ChartBorder.UIElement.JSChartContainer,
                    Identify:this.Identify
                },this.ModifyIndexEvent);

        if (!this.ChangeIndex)  //隐藏'换指标'
            $("#"+divToolbar.id+" .target").hide();
        else if (typeof(this.ChangeIndexEvent)=='function')
            $("#"+divToolbar.id+" .target").click(
                {
                    Chart:this.ChartBorder.UIElement.JSChartContainer,
                    Identify:this.Identify
                },this.ChangeIndexEvent);

        divToolbar.style.display = "block";
    }

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();

        if (this.SizeChange==true) this.CalculateDataWidth();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
        this.DrawToolbar();
    }

    this.GetXFromIndex=function(index)
    {
        if (index < 0) index = 0;
	    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset=this.ChartBorder.GetLeft()+2+this.DistanceWidth/2+this.DataWidth/2;
        for(var i=1;i<=index;++i)
        {
            offset+=this.DistanceWidth+this.DataWidth;
        }

        return offset;
    }

    //计算数据宽度
    this.CalculateDataWidth=function()
    {
        if (this.XPointCount<2) return;

        var width=this.ChartBorder.GetWidth()-4;

        for(var i=0;i<ZOOM_SEED.length;++i)
        {
            if((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width)
            {
                this.ZoomIndex=i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                if (i == 0) break;      // 如果是最大的缩放因子，不再调整数据宽度

                this.TrimKLineDataWidth(width);
                return;
            }
        }
    }

    this.TrimKLineDataWidth=function(width)
    {
        while(true)
        {
            if((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width)
            {
                this.DataWidth -= 0.01;
                break;
            }
            this.DataWidth += 0.01;
        }
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    this.CalculateCount=function(zoomIndex)
    {
        var width=this.ChartBorder.GetWidth();

        return parseInt(width/(ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp=function(cursorIndex)
    {
        if (this.ZoomIndex<=0) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex>this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;

        --this.ZoomIndex;
        var xPointCount=this.CalculateCount(this.ZoomIndex);

        this.XPointCount=xPointCount;

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	    this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetWidth());

        if (lastDataIndex>=this.Data.Data.length)
        {
            this.Data.DataOffset=this.Data.Data.length-this.XPointCount-2;
            cursorIndex.Index=this.Data.Data.length-this.Data.DataOffset-1;
        }
        else
        {
            if (lastDataIndex<this.XPointCount)
            {
                this.Data.DataOffset=0;
                cursorIndex.Index=lastCursorIndex;
            }
            else
            {
                this.Data.DataOffset = lastDataIndex - this.XPointCount+1;
                cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;
            }
        }

        return true;
    }

    this.ZoomDown=function(cursorIndex)
    {
        if (this.ZoomIndex+1>=ZOOM_SEED.length) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex>=this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;
        var xPointCount=this.CalculateCount(this.ZoomIndex+1);

        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        this.XPointCount=xPointCount;
        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	    this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetWidth());

        if (lastDataIndex-xPointCount+1<0)
            this.Data.DataOffset=0;
        else
            this.Data.DataOffset = lastDataIndex - this.XPointCount+1;

        cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;

        return true;
    }
}

//K线横屏框架
function KLineHScreenFrame()
{
    this.newMethod=KLineFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen=true;        //是否是横屏

    //画标题背景色
    this.DrawTitleBG=function()
    {
        if (this.ChartBorder.TitleHeight<=0) return;

        var left=ToFixedPoint(this.ChartBorder.GetRightEx());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=this.ChartBorder.TitleHeight;
        var height=bottom-top;

        this.Canvas.fillStyle=this.TitleBGColor;
        this.Canvas.fillRect(left,top,width,height);
    }

    this.DrawToolbar=function()
    {
        return;
    }

    this.GetYFromData=function(value)
    {
        if(value<=this.HorizontalMin) return this.ChartBorder.GetLeft();
        if(value>=this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width=this.ChartBorder.GetWidthEx()*(value-this.HorizontalMin)/(this.HorizontalMax-this.HorizontalMin);
        return this.ChartBorder.GetLeft()+width;
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
        var top=this.ChartBorder.GetTop();
        var bottom=this.ChartBorder.GetBottom();
        var borderTop=this.ChartBorder.Top;
        var borderBottom=this.ChartBorder.Bottom;

        var yPrev=null; //上一个坐标y的值
        for(var i=this.HorizontalInfo.length-1; i>=0; --i)  //从左往右画分割线
        {
            var item=this.HorizontalInfo[i];
            var y=this.GetYFromData(item.Value);
            if (y!=null && Math.abs(y-yPrev)<15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle=item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y),top);
            this.Canvas.lineTo(ToFixedPoint(y),bottom);
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0]!=null && borderTop>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="middle";

                var xText=y,yText=top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1]!=null && borderBottom>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                var xText=y,yText=bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev=y;
        }
    }

    this.GetXFromIndex=function(index)
    {
        if (index < 0) index = 0;
	    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset=this.ChartBorder.GetTop()+2+this.DistanceWidth/2+this.DataWidth/2;
        for(var i=1;i<=index;++i)
        {
            offset+=this.DistanceWidth+this.DataWidth;
        }

        return offset;
    }

    //画X轴
    this.DrawVertical=function()
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRightEx();
        var bottom=this.ChartBorder.GetBottom();

        var xPrev=null; //上一个坐标x的值
        for(var i in this.VerticalInfo)
        {
            var x=this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x>=bottom) break;
            if (xPrev!=null && Math.abs(x-xPrev)<80) continue;

            this.Canvas.strokeStyle=this.VerticalInfo[i].LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left,ToFixedPoint(x));
            this.Canvas.lineTo(right,ToFixedPoint(x));
            this.Canvas.stroke();

            if (this.VerticalInfo[i].Message[0]!=null)
            {
                if (this.VerticalInfo[i].Font!=null)
                    this.Canvas.font=this.VerticalInfo[i].Font;

                this.Canvas.fillStyle=this.VerticalInfo[i].TextColor;
                var testWidth=this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x<testWidth/2)
                {
                    this.Canvas.textAlign="left";
                    this.Canvas.textBaseline="top";
                }
                else
                {
                    this.Canvas.textAlign="center";
                    this.Canvas.textBaseline="top";
                }

                var xText=left,yText=x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, 0);
                this.Canvas.restore();
            }

            xPrev=x;
        }
    }

    //Y坐标转y轴数值
    this.GetYData=function(x)
    {
        if (x<this.ChartBorder.GetLeft()) return this.HorizontalMin;
		if (x>this.ChartBorder.GetRightEx()) return this.HorizontalMax;

		return (x-this.ChartBorder.GetLeft())/this.ChartBorder.GetWidthEx()*(this.HorizontalMax-this.HorizontalMin)+this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData=function(y)
    {
        if (y<=this.ChartBorder.GetTop()) return 0;
		if (y>=this.ChartBorder.GetBottom()) return this.XPointCount;

		return (y-this.ChartBorder.GetTop())*(this.XPointCount*1.0/this.ChartBorder.GetHeight());
    }

    //计算数据宽度
    this.CalculateDataWidth=function()
    {
        if (this.XPointCount<2) return;

        var width=this.ChartBorder.GetHeight()-4;

        for(var i=0;i<ZOOM_SEED.length;++i)
        {
            if((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width)
            {
                this.ZoomIndex=i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                if (i == 0) break;      // 如果是最大的缩放因子，不再调整数据宽度

                this.TrimKLineDataWidth(width);
                return;
            }
        }
    }

    this.CalculateCount=function(zoomIndex) //计算当天的缩放比例下 一屏显示的数据个数
    {
        var width=this.ChartBorder.GetHeight();
        return parseInt(width/(ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp=function(cursorIndex)
    {
        if (this.ZoomIndex<=0) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex>this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;

        --this.ZoomIndex;
        var xPointCount=this.CalculateCount(this.ZoomIndex);

        this.XPointCount=xPointCount;

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	    this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetHeight());

        if (lastDataIndex>=this.Data.Data.length)
        {
            this.Data.DataOffset=this.Data.Data.length-this.XPointCount-2;
            cursorIndex.Index=this.Data.Data.length-this.Data.DataOffset-1;
        }
        else
        {
            if (lastDataIndex<this.XPointCount)
            {
                this.Data.DataOffset=0;
                cursorIndex.Index=lastCursorIndex;
            }
            else
            {
                this.Data.DataOffset = lastDataIndex - this.XPointCount+1;
                cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;
            }
        }

        return true;
    }

    this.ZoomDown=function(cursorIndex)
    {
        if (this.ZoomIndex+1>=ZOOM_SEED.length) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex>=this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;
        var xPointCount=this.CalculateCount(this.ZoomIndex+1);

        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        this.XPointCount=xPointCount;
        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	    this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetHeight());

        if (lastDataIndex-xPointCount+1<0)
            this.Data.DataOffset=0;
        else
            this.Data.DataOffset = lastDataIndex - this.XPointCount+1;

        cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;

        return true;
    }
}

function SubFrameItem()
{
    this.Frame;
    this.Height;
}

//行情框架
function HQTradeFrame()
{
    this.SubFrame=new Array();              //SubFrameItem 数组
    this.SizeChange=true;                   //大小是否改变
    this.ChartBorder;
    this.Canvas;                            //画布
    this.ScreenImageData;                   //截图
    this.Data;                              //主数据
    this.Position;                          //画布的位置
    this.SizeChange=true;

    this.CalculateChartBorder=function()    //计算每个子框架的边框信息
    {
        if (this.SubFrame.length<=0) return;

        var top=this.ChartBorder.GetTop();
        var height=this.ChartBorder.GetHeight();
        var totalHeight=0;

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            totalHeight+=item.Height;
        }

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.ChartBorder.Top=top;
            item.Frame.ChartBorder.Left=this.ChartBorder.Left;
            item.Frame.ChartBorder.Right=this.ChartBorder.Right;
            var frameHeight=height*(item.Height/totalHeight)+top;
            item.Frame.ChartBorder.Bottom=this.ChartBorder.GetChartHeight()-frameHeight;
            top=frameHeight;
        }

    }

    this.Draw=function()
    {
        if (this.SizeChange===true) this.CalculateChartBorder();

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.Draw();
        }

        this.SizeChange=false;
    }
    this.DrawLock=function()
    {
        for (var i in this.SubFrame)
        {
            var item = this.SubFrame[i];
            item.Frame.DrawLock();
        }
    }

    this.DrawInsideHorizontal = function () 
    {
        for (var i in this.SubFrame) 
        {
          var item = this.SubFrame[i];
          if (item.Frame.DrawInsideHorizontal) item.Frame.DrawInsideHorizontal();
        }
      }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.SizeChange=sizeChange;
        }

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }

    //图形快照
    this.Snapshot=function()
    {
        this.ScreenImageData=this.Canvas.getImageData(0,0,this.ChartBorder.GetChartWidth(),this.ChartBorder.GetChartHeight());
    }

    this.GetXData=function(x)
    {
        return this.SubFrame[0].Frame.GetXData(x);
    }

    this.GetYData=function(y)
    {
        var frame;
        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            var left=item.Frame.ChartBorder.GetLeft();
            var top=item.Frame.ChartBorder.GetTopEx();
            var width=item.Frame.ChartBorder.GetWidth();
            var height=item.Frame.ChartBorder.GetHeightEx();

            item.Frame.Canvas.beginPath();
            item.Frame.Canvas.rect(left,top,width,height);
            if (item.Frame.Canvas.isPointInPath(left,y))
            {
                frame=item.Frame;
                break;
            }
        }

        if (frame!=null) return frame.GetYData(y);
    }

    this.GetXFromIndex=function(index)
    {
        return this.SubFrame[0].Frame.GetXFromIndex(index);
    }

    this.GetYFromData=function(value)
    {
        return this.SubFrame[0].Frame.GetYFromData(value);
    }

    this.ZoomUp=function(cursorIndex)
    {
        var result=this.SubFrame[0].Frame.ZoomUp(cursorIndex);
        for(var i=1;i<this.SubFrame.length;++i)
        {
            this.SubFrame[i].Frame.XPointCount= this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex= this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth= this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth= this.SubFrame[0].Frame.DistanceWidth;
        }

        return result;
    }

    this.ZoomDown=function(cursorIndex)
    {
        var result=this.SubFrame[0].Frame.ZoomDown(cursorIndex);
        for(var i=1;i<this.SubFrame.length;++i)
        {
            this.SubFrame[i].Frame.XPointCount= this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex= this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth= this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth= this.SubFrame[0].Frame.DistanceWidth;
        }

        return result;
    }

    //设置重新计算刻度坐标
    this.ResetXYSplit=function()
    {
        for(let i in this.SubFrame)
        {
            this.SubFrame[i].Frame.XYSplit=true;
        }
    }
}

//行情框架横屏
function HQTradeHScreenFrame()
{
    this.newMethod=HQTradeFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen=true;        //是否是横屏

    this.CalculateChartBorder=function()    //计算每个子框架的边框信息
    {
        if (this.SubFrame.length<=0) return;

        var right=this.ChartBorder.Right;
        var left=this.ChartBorder.GetRight();
        var width=this.ChartBorder.GetWidth();
        var totalHeight=0;

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            totalHeight+=item.Height;
        }

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.ChartBorder.Top=this.ChartBorder.Top;
            item.Frame.ChartBorder.Bottom=this.ChartBorder.Bottom;

            var frameWidth=width*(item.Height/totalHeight);
            item.Frame.ChartBorder.Right=right;
            item.Frame.ChartBorder.Left=left-frameWidth;
            
            right+=frameWidth;
            left-=frameWidth;
        }
    }

    this.GetYData=function(x)
    {
        var frame;
        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            var left=item.Frame.ChartBorder.GetLeft();
            var top=item.Frame.ChartBorder.GetTop();
            var width=item.Frame.ChartBorder.GetWidthEx();
            var height=item.Frame.ChartBorder.GetHeight();

            item.Frame.Canvas.beginPath();
            item.Frame.Canvas.rect(left,top,width,height);
            if (item.Frame.Canvas.isPointInPath(x,top))
            {
                frame=item.Frame;
                break;
            }
        }

        if (frame!=null) return frame.GetYData(x);
    }
}


function SimpleChartFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ScreenImageData;                   //截图
    this.Position;                          //画布的位置

    this.DrawFrame=function()
    {
        if (this.XPointCount>0)
        {
            let dInterval=this.ChartBorder.GetWidth()/(6*this.XPointCount); //分6份, 数据4 间距2
            this.DistanceWidth=2*dInterval;
			this.DataWidth=4*dInterval;
        }

        this.SplitXYCoordinate();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex=function(index)
    {
        if (index < 0) index = 0;
	    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset=this.ChartBorder.GetLeft()+2+this.DistanceWidth/2+this.DataWidth/2;
        for(var i=1;i<=index;++i)
        {
            offset+=this.DistanceWidth+this.DataWidth;
        }

        return offset;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    //图形快照
    this.Snapshot=function()
    {
        this.ScreenImageData=this.Canvas.getImageData(0,0,this.ChartBorder.GetChartWidth(),this.ChartBorder.GetChartHeight());
    }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }
}


//历史K线数据
function HistoryData()
{
    this.Date;
    this.YClose;
    this.Open;
    this.Close;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.Time;
}

//数据复制
HistoryData.Copy=function(data)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose;
    newData.Open=data.Open;
    newData.Close=data.Close;
    newData.High=data.High;
    newData.Low=data.Low;
    newData.Vol=data.Vol;
    newData.Amount=data.Amount;
    newData.Time=data.Time;

    return newData;
}

//数据复权拷贝
HistoryData.CopyRight=function(data,seed)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose*seed;
    newData.Open=data.Open*seed;
    newData.Close=data.Close*seed;
    newData.High=data.High*seed;
    newData.Low=data.Low*seed;

    newData.Vol=data.Vol;
    newData.Amount=data.Amount;

    return newData;
}

function MinuteData()
{
    this.Close;
    this.Open;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.DateTime;
    this.Increate;
    this.Risefall;
    this.AvPrice;
}

//单指标数据
function SingleData()
{
    this.Date;  //日期
    this.Value; //数据  (可以是一个数组)
}

var KLINE_INFO_TYPE=
{
    INVESTOR:1,         //互动易
    ANNOUNCEMENT:2,     //公告
    PFORECAST:3,        //业绩预告

    ANNOUNCEMENT_QUARTER_1:4,   //一季度报
    ANNOUNCEMENT_QUARTER_2:5,   //半年报
    ANNOUNCEMENT_QUARTER_3:6,   //2季度报
    ANNOUNCEMENT_QUARTER_4:7,   //年报

    RESEARCH:8,                 //调研
    BLOCKTRADING:9,             //大宗交易
    TRADEDETAIL:10              //龙虎榜


}

function KLineInfoData()
{
    this.ID;
    this.Date;
    this.Title;
    this.InfoType;
    this.ExtendData;    //扩展数据
}

function ChartData()
{
    this.Data=new Array();
    this.DataOffset=0;                        //数据偏移
    this.Period=0;                            //周期 0 日线 1 周线 2 月线 3年线
    this.Right=0;                             //复权 0 不复权 1 前复权 2 后复权

    this.Data2=new Array();                   //第1组数据 走势图:历史分钟数据

    this.GetCloseMA=function(dayCount)
    {
        var result=new Array();
        for (var i = 0, len = this.Data.length; i < len; i++)
        {
            if (i < dayCount)
            {
                result[i]=null;
                continue;
            }

            var sum = 0;
            for (var j = 0; j < dayCount; j++)
            {
                sum += this.Data[i - j].Close;
            }
            result[i]=sum / dayCount;
        }
        return result;
    }

    this.GetVolMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Vol;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    this.GetAmountMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Amount;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    //获取收盘价
    this.GetClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Close;
        }

        return result;
    }

    this.GetYClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].YClose;
        }

        return result;
    }

    this.GetHigh=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].High;
        }

        return result;
    }

    this.GetLow=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Low;
        }

        return result;
    }

    this.GetOpen=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Open;
        }

        return result;
    }

    this.GetVol=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Vol;
        }

        return result;
    }

    this.GetAmount=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Amount;
        }

        return result;
    }

    this.GetYear=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date/10000);
        }

        return result;
    }

    this.GetMonth=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date%10000/100);
        }

        return result;
    }

    //计算分钟
    this.GetMinutePeriodData=function(period)
    {
        var result = new Array();
        var periodDataCount = 5;
        if (period == 5)
            periodDataCount = 5;
        else if (period == 6)
            periodDataCount = 15;
        else if (period == 7)
            periodDataCount = 30;
        else if (period == 8)
            periodDataCount = 60;
        else
            return this.Data;
        var bFirstPeriodData = false;
        var newData = null;
        for (var i = 0; i < this.Data.length; )
        {
            bFirstPeriodData = true;
            for (var j = 0; j < periodDataCount && i < this.Data.length; ++i)
            {
                if (bFirstPeriodData)
                {
                    newData = new HistoryData();
                    result.push(newData);
                    bFirstPeriodData = false;
                }
                var minData = this.Data[i];
                if (minData == null)
                {
                    ++j;
                    continue;    
                } 
                if (minData.Time == 925 || minData.Time == 930 || minData.Time == 1300)
                    ;
                else
                    ++j;
                newData.Date = minData.Date;
                newData.Time = minData.Time;
                if (minData.Open==null || minData.Close==null)
                    continue;
                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=minData.Open;
                    newData.High=minData.High;
                    newData.Low=minData.Low;
                    newData.YClose=minData.YClose;
                    newData.Close=minData.Close;
                    newData.Vol=minData.Vol;
                    newData.Amount=minData.Amount;      
                }
                else
                {
                    if (newData.High<minData.High) 
                        newData.High=minData.High;
                    if (newData.Low>minData.Low) 
                        newData.Low=minData.Low;
                    newData.Close=minData.Close;
                    newData.Vol+=minData.Vol;
                    newData.Amount+=minData.Amount;
                }
            }
        }
        return result;
    }

    //计算周,月,年
    this.GetDayPeriodData=function(period)
    {
        var result=new Array();
        var index=0;
        var startDate=0;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];

            switch(period)
            {
                case 1: //周线
                    var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new HistoryData();
                newData.Date=dayData.Date;
                result.push(newData);

                if (dayData.Open==null || dayData.Close==null) continue;

                newData.Open=dayData.Open;
                newData.High=dayData.High;
                newData.Low=dayData.Low;
                newData.YClose=dayData.YClose;
                newData.Close=dayData.Close;
                newData.Vol=dayData.Vol;
                newData.Amount=dayData.Amount;
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Open==null || dayData.Close==null) continue;

                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=dayData.Open;
                    newData.High=dayData.High;
                    newData.Low=dayData.Low;
                    newData.YClose=dayData.YClose;
                    newData.Close=dayData.Close;
                    newData.Vol=dayData.Vol;
                    newData.Amount=dayData.Amount;
                }
                else
                {
                    if (newData.High<dayData.High) newData.High=dayData.High;
                    if (newData.Low>dayData.Low) newData.Low=dayData.Low;

                    newData.Close=dayData.Close;
                    newData.Vol+=dayData.Vol;
                    newData.Amount+=dayData.Amount;
                    newData.Date=dayData.Date;
                }
            }
        }

        return result;
    }

    //周期数据 1=周 2=月 3=年
    this.GetPeriodData=function(period)
    {
        if (period==1 || period==2 || period==3) return this.GetDayPeriodData(period);
        if (period==5 || period==6 || period==7 || period==8) return this.GetMinutePeriodData(period);
    }

    //复权  0 不复权 1 前复权 2 后复权
    this.GetRightDate=function(right)
    {
        var result=[];
        if (this.Data.length<=0) return result;

        if (right==1)
        {
            var index=this.Data.length-1;
            var seed=1; //复权系数
            var yClose=this.Data[index].YClose;

            result[index]=HistoryData.Copy(this.Data[index]);

            for(--index; index>=0; --index)
            {
                if (yClose!=this.Data[index].Close) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                yClose=this.Data[index].YClose;
            }

            for(; index>=0; --index)
            {
                if(yClose!=this.Data[index].Close)
                    seed *= yClose/this.Data[index].Close;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                yClose=this.Data[index].YClose;
            }
        }
        else if (right==2)
        {
            var index=0;
            var seed=1;
            var close=this.Data[index].Close;
            result[index]=HistoryData.Copy(this.Data[index]);

            for(++index;index<this.Data.length;++index)
            {
                if (close!=this.Data[index].YClose) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                close=this.Data[index].Close;
            }

            for(;index<this.Data.length;++index)
            {
                if(close!=this.Data[index].YClose)
                    seed *= close/this.Data[index].YClose;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                close=this.Data[index].Close;
            }
        }

        return result;
    }

    //叠加数据和主数据拟合,去掉主数据没有日期的数据
    this.GetOverlayData=function(overlayData)
    {
        var result=[];

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                result[i]=new HistoryData();
                result[i].Date=overlayData[j].Date;
                result[i].YClose=overlayData[j].YClose;
                result[i].Open=overlayData[j].Open;
                result[i].High=overlayData[j].High;
                result[i].Low=overlayData[j].Low;
                result[i].Close=overlayData[j].Close;
                result[i].Vol=overlayData[j].Vol;
                result[i].Amount=overlayData[j].Amount;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }


    /*
        技术指标数据方法
    */
    //以主图数据 拟合,返回 SingleData 数组
    this.GetFittingData=function(overlayData)
    {
        var result=new Array();

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=null;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                var item=new SingleData();
                item.Date=overlayData[j].Date;
                item.Value=overlayData[j].Value;
                result[i]=item;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new SingleData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }


    //把财报数据拟合到主图数据,返回 SingleData 数组
    this.GetFittingFinanceData=function(financeData)
    {
        var result=[];

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j+1<financeData.length)
            {
                if (financeData[j].Date<date && financeData[j+1].Date<=date)
                {
                    ++j;
                    continue;
                }
            }

            var item=new SingleData();
            item.Date=date;
            item.Value=financeData[j].Value;
            item.FinanceDate=financeData[j].Date;   //财务日期 调试用
            result[i]=item;

            ++i;
        }

        return result;
    }

    //市值计算 financeData.Value 是股数
    this.GetFittingMarketValueData=function(financeData)
    {
        var result=[];

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;
            var price=this.Data[i].Close;

            if (j+1<financeData.length)
            {
                if (financeData[j].Date<date && financeData[j+1].Date<=date)
                {
                    ++j;
                    continue;
                }
            }

            var item=new SingleData();
            item.Date=date;
            item.Value=financeData[j].Value*price;  //市值计算 收盘价*股数
            item.FinanceDate=financeData[j].Date;   //财务日期 调试用
            result[i]=item;

            ++i;
        }

        return result;
    }

    //月线数据拟合
    this.GetFittingMonthData=function(overlayData)
    {
        var result=new Array();

        var preDate=null;
        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=null;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                var item=new SingleData();
                item.Date=overlayData[j].Date;
                item.Value=overlayData[j].Value;
                item.Text=overlayData[j].Text;
                result[i]=item;
                ++j;
                ++i;
            }
            else if (preDate!=null && preDate<overlayDate && date>overlayDate)
            {
                var item=new SingleData();
                item.Date=date;
                item.OverlayDate=overlayData[j].Date;
                item.Value=overlayData[j].Value;
                item.Text=overlayData[j].Text;
                result[i]=item;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new SingleData();
                result[i].Date=date;
                ++i;
            }

            preDate=date;
        }

        return result;
    }

    this.GetValue=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            if (this.Data[i] && this.Data[i].Value!=null)
            { 
                if (!isNaN(this.Data[i].Value))
                    result[i]=this.Data[i].Value;
                else if (this.Data[i].Value instanceof Array)   //支持数组
                    result[i]=this.Data[i].Value;
                else
                    result[i]=null;
            }
            else
                result[i]=null;
        }

        return result;
    }

    this.GetPeriodSingleData=function(period)
    {
        var result=new Array();
        var index=0;
        var startDate=0;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];
            if (dayData==null || dayData.Date==null) continue;

            switch(period)
            {
                case 1: //周线
                    var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new SingleData();
                newData.Date=dayData.Date;
                newData.Value=dayData.Value;
                result.push(newData);
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Value==null || isNaN(dayData.Value)) continue;
                if (newData.Value==null || isNaN(newData.Value)) newData.Value=dayData.Value;
            }
        }

        return result;
    }

    /*
        分钟数据方法
        this.GetClose()     每分钟价格
        this.GetVol()       每分钟成交量
    */

    //分钟均线
    this.GetMinuteAvPrice=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].AvPrice;
        }

        return result;
    }
}

ChartData.GetFirday=function(value)
{
    var date=new Date(parseInt(value/10000),(value/100%100-1),value%100);
    var day=date.getDay();
    if (day==5) return value;

    var timestamp=date.getTime();
    if (day<5)
    {
        var prevTimestamp=(24*60*60*1000)*(5-day);
        timestamp+=prevTimestamp;
    }
    else
    {
        var prevTimestamp=(24*60*60*1000)*(day-5);
        timestamp-=prevTimestamp;
    }

    date.setTime(timestamp);
    var fridayDate= date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
    var week=date.getDay();
    return fridayDate;

}

function TooltipData()              //提示信息
{
    this.ChartPaint;
    this.Data;
}

function Rect(x,y,width,height)
{
    this.X=x,
    this.Y=y;
    this.Width=width;
    this.Height=height;
}

//图新画法接口类
function IChartPainting()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.Data=new ChartData();          //数据区

    this.NotSupportMessage=null;
    this.MessageFont=g_JSChartResource.Index.NotSupport.Font;
    this.MessageColor=g_JSChartResource.Index.NotSupport.TextColor;
    this.IsDrawFirst=false;
    this.IsShow=true;

    this.Draw=function()
    {

    }

    this.DrawNotSupportmessage=function()
    {
        this.Canvas.font=this.MessageFont;
        this.Canvas.fillStyle=this.MessageColor;

        var left=this.ChartBorder.GetLeft();
        var width=this.ChartBorder.GetWidth();
        var top=this.ChartBorder.GetTopEx();
        var height=this.ChartBorder.GetHeightEx();

        var x=left+width/2;
        var y=top+height/2;

        this.Canvas.textAlign="center";
        this.Canvas.textBaseline="middle";
        this.Canvas.fillText(this.NotSupportMessage,x,y);
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        return false;
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null || isNaN(value)) continue;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }
}


//缩放因子
var ZOOM_SEED=
[
    [49,10],	[46,9],		[43,8],
    [41,7.5],	[39,7],		[37,6],
    [31,5.5],	[27,5],		[23,4.5],
    [21,4],		[18,3.5],	[16,3],
    [13,2.5],	[11,2],		[8,1.5],
    [6,1],		[3,0.6],	[2.2,0.5],
    //太多了卡,
    //[1.1,0.3],
    //[0.9,0.2],	[0.7,0.15],
    //[0.6,0.12],	[0.5,0.1],	[0.4,0.08],
    //[0.3,0.06],	[0.2,0.04],	[0.1,0.02]
];

//K线画法 支持横屏
function ChartKLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DrawType=0;    // 0=K线  1=收盘价线 2=美国线
    this.CloseLineColor=g_JSChartResource.CloseLineColor;
    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.UnchagneColor=g_JSChartResource.UnchagneBarColor;          //平盘
    this.TooltipRect=new Array();           //2位数组 0 数据序号 1 区域

    this.IsShowMaxMinPrice=true;                 //是否显示最大最小值
    this.IsShowKTooltip=true;                    //是否显示K线tooltip
    this.TextFont=g_JSChartResource.KLine.MaxMin.Font;
    this.TextColor=g_JSChartResource.KLine.MaxMin.Color;

    this.InfoData;      //信息地雷 key=日期  value=信息数据
    this.InfoDiv=new Array();

    this.InfoTooltipEvent;  //信息地雷悬停事件

    this.DrawAKLine=function()  //美国线
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        if (isHScreen) xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var ptMax={X:null,Y:null,Value:null,Align:'left'};
        var ptMin={X:null,Y:null,Value:null,Align:'left'};
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);

            if (ptMax.Value==null || ptMax.Value<data.High)     //求最大值
            {
                ptMax.X=x;
                ptMax.Y=yHigh;
                ptMax.Value=data.High;
                ptMax.Align=j<xPointCount/2?'left':'right';
            }

            if (ptMin.Value==null || ptMin.Value>data.Low)      //求最小值
            {
                ptMin.X=x;
                ptMin.Y=yLow;
                ptMin.Value=data.Low;
                ptMin.Align=j<xPointCount/2?'left':'right';
            }

            if (data.Open<data.Close) this.Canvas.strokeStyle=this.UpColor; //阳线
            else if (data.Open>data.Close) this.Canvas.strokeStyle=this.DownColor; //阳线
            else this.Canvas.strokeStyle=this.UnchagneColor; //平线

            this.Canvas.beginPath();   //最高-最低
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            
            this.Canvas.stroke();

            if (dataWidth>=4)
            {
                this.Canvas.beginPath();    //开盘
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yOpen),left);
                    this.Canvas.lineTo(ToFixedPoint(yOpen),x);
                }
                else
                {
                    this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                    this.Canvas.lineTo(x,ToFixedPoint(yOpen));
                }
                this.Canvas.stroke();

                this.Canvas.beginPath();    //收盘
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yClose),right);
                    this.Canvas.lineTo(ToFixedPoint(yClose),x);
                }
                else
                {
                    this.Canvas.moveTo(right,ToFixedPoint(yClose));
                    this.Canvas.lineTo(x,ToFixedPoint(yClose));
                }
                this.Canvas.stroke();
            }

            if(this.Data.DataType==0)
            {
                var infoItem={Xleft:left,XRight:right, YMax:yHigh, YMin:yLow, DayData:data, Index:j};
                this.DrawInfoDiv(infoItem);
            }
        }

        if (this.IsShowMaxMinPrice) 
        {   
            if (isHScreen) this.HScreenDrawMaxMinPrice(ptMax,ptMin);
            else this.DrawMaxMinPrice(ptMax,ptMin);
        }
    }

    this.DrawCloseLine=function()   //收盘价线
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        if (isHScreen) xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        this.Canvas.beginPath();
        this.Canvas.strokeStyle=this.CloseLineColor;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yClose=this.ChartFrame.GetYFromData(data.Close);

            if (bFirstPoint)
            {
                if (isHScreen) this.Canvas.moveTo(yClose,x);
                else this.Canvas.moveTo(x,yClose);
                bFirstPoint=false;
            }
            else
            {
                if (isHScreen) this.Canvas.lineTo(yClose,x);
                else this.Canvas.lineTo(x,yClose);
            }
        }

        if (bFirstPoint==false) this.Canvas.stroke();
    }

    this.Draw=function()
    {
        this.ClearInfoDiv();
        this.TooltipRect=[];

        if (this.DrawType==1) 
        {
            this.DrawCloseLine();
            return;
        }
        else if (this.DrawType==2)
        {
            this.DrawAKLine();
            return;
        }

        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var ptMax={X:null,Y:null,Value:null,Align:'left'};
        var ptMin={X:null,Y:null,Value:null,Align:'left'};
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);
            var y=yHigh;

            if (ptMax.Value==null || ptMax.Value<data.High)     //求最大值
            {
                ptMax.X=x;
                ptMax.Y=yHigh;
                ptMax.Value=data.High;
                ptMax.Align=j<xPointCount/2?'left':'right';
            }

            if (ptMin.Value==null || ptMin.Value>data.Low)      //求最小值
            {
                ptMin.X=x;
                ptMin.Y=yLow;
                ptMin.Value=data.Low;
                ptMin.Align=j<xPointCount/2?'left':'right';
            }

            if (data.Open<data.Close)       //阳线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.UpColor;
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
                        this.Canvas.stroke();
                        y=yClose;
                    }
                    else
                    {
                        y=yClose;
                    }

                    this.Canvas.fillStyle=this.UpColor;
                    if (yOpen-y<1)  this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));

                    if (data.Open>data.Low)
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.strokeStyle=this.UpColor;
                    this.Canvas.stroke();
                }
            }
            else if (data.Open>data.Close)  //阴线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.DownColor;
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                        this.Canvas.stroke();
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen
                    }

                    this.Canvas.fillStyle=this.DownColor;
                    if (yClose-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yClose-y));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.strokeStyle=this.DownColor;
                    this.Canvas.stroke();
                }
            }
            else // 平线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.UnchagneColor;
                    this.Canvas.beginPath();
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),y);
                        this.Canvas.lineTo(ToFixedPoint(x),yOpen);
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen;
                    }

                    this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(y));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                    }

                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.strokeStyle=this.UnchagneColor;
                    this.Canvas.stroke();
                }
            }

            //添加tooltip区域
            if (this.IsShowKTooltip)
            {
                var yTop=Math.min(yOpen,yClose);
                var yBottom=Math.max(yOpen,yClose);
                if (Math.abs(yOpen-yClose)<5)   //高度太小了, 上下各+5px
                {
                    yTop=Math.max(yHigh,yTop-5);
                    yBottom=Math.min(yLow,yBottom+5);
                }
                var rect=new Rect(left,yTop,dataWidth,yBottom-yTop);
                //this.Canvas.fillStyle="rgb(0,0,100)";
                //this.Canvas.fillRect(rect.X,rect.Y,rect.Width,rect.Height);
                this.TooltipRect.push([i,rect]);    //[0]数据索引 [1]数据区域
            }

            if(this.Data.DataType==0)
            {
                var infoItem={Xleft:left,XRight:right, YMax:yHigh, YMin:yLow, DayData:data, Index:j};
                this.DrawInfoDiv(infoItem);
            }
        }

        if (this.IsShowMaxMinPrice) this.DrawMaxMinPrice(ptMax,ptMin);
    }

    this.HScreenDraw=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var ptMax={X:null,Y:null,Value:null,Align:'left'};
        var ptMin={X:null,Y:null,Value:null,Align:'left'};
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);
            var y=yHigh;

            if (ptMax.Value==null || ptMax.Value<data.High)     //求最大值
            {
                ptMax.X=x;
                ptMax.Y=yHigh;
                ptMax.Value=data.High;
                ptMax.Align=j<xPointCount/2?'left':'right';
            }

            if (ptMin.Value==null || ptMin.Value>data.Low)      //求最小值
            {
                ptMin.X=x;
                ptMin.Y=yLow;
                ptMin.Value=data.Low;
                ptMin.Align=j<xPointCount/2?'left':'right';
            }

            if (data.Open<data.Close)       //阳线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.UpColor;
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yClose),ToFixedPoint(x));
                        this.Canvas.stroke();
                        y=yClose;
                    }
                    else
                    {
                        y=yClose;
                    }

                    this.Canvas.fillStyle=this.UpColor;
                    if (Math.abs(yOpen-y)<1)  this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth),);

                    if (data.Open>data.Low)
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh,ToFixedPoint(x),);
                    this.Canvas.lineTo(yLow,ToFixedPoint(x));
                    this.Canvas.strokeStyle=this.UpColor;
                    this.Canvas.stroke();
                }
            }
            else if (data.Open>data.Close)  //阴线
            {
                
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.DownColor;
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yOpen),ToFixedPoint(x));
                        this.Canvas.stroke();
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen
                    }

                    this.Canvas.fillStyle=this.DownColor;
                    if (Math.abs(yClose-y)<1) this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yClose-y),ToFixedRect(dataWidth));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                    this.Canvas.lineTo(yLow,ToFixedPoint(x));
                    this.Canvas.strokeStyle=this.DownColor;
                    this.Canvas.stroke();
                }
                
            }
            else // 平线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.UnchagneColor;
                    this.Canvas.beginPath();
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.moveTo(y,ToFixedPoint(x));
                        this.Canvas.lineTo(yOpen,ToFixedPoint(x));
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen;
                    }

                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(left));
                    this.Canvas.lineTo(ToFixedPoint(y),ToFixedPoint(right));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                    }

                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                    this.Canvas.lineTo(yLow,ToFixedPoint(x));
                    this.Canvas.strokeStyle=this.UnchagneColor;
                    this.Canvas.stroke();
                }
            }
        }

        if (this.IsShowMaxMinPrice) this.HScreenDrawMaxMinPrice(ptMax,ptMin);
    }

    this.DrawMaxMinPrice=function(ptMax,ptMin)
    {
        if (ptMax.X==null || ptMax.Y==null || ptMax.Value==null) return;
        if (ptMin.X==null || ptMin.Y==null || ptMin.Value==null) return;

        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign=ptMax.Align;
        this.Canvas.textBaseline='top';
        var left=ptMax.Align=='left'?ptMax.X+10:ptMax.X-10;
        this.Canvas.fillText(ptMax.Value.toFixed(2),left,ptMax.Y);

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMax.X,ptMax.Y);
        this.Canvas.lineTo(left,ptMax.Y+8);
        this.Canvas.strokeStyle=this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();

        this.Canvas.textAlign=ptMin.Align;
        this.Canvas.textBaseline='bottom';
        var left=ptMin.Align=='left'?ptMin.X+10:ptMin.X-10;
        this.Canvas.fillText(ptMin.Value.toFixed(2),left,ptMin.Y);

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMin.X,ptMin.Y);
        this.Canvas.lineTo(left,ptMin.Y-8);
        this.Canvas.strokeStyle=this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
    }

    this.HScreenDrawMaxMinPrice=function(ptMax,ptMin)   //横屏模式下显示最大最小值
    {
        if (ptMax.X==null || ptMax.Y==null || ptMax.Value==null) return;
        if (ptMin.X==null || ptMin.Y==null || ptMin.Value==null) return;

        var xText=ptMax.Y;
        var yText=ptMax.X;
        this.Canvas.save(); 
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign=ptMax.Align;
        this.Canvas.textBaseline='top';
        var left=ptMax.Align=='left'?10:-10;
        this.Canvas.fillText(ptMax.Value.toFixed(2),left,0);

        this.Canvas.restore();

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMax.Y,ptMax.X);
        this.Canvas.lineTo(ptMax.Y-8,ptMax.X+left);
        this.Canvas.strokeStyle=this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();

        
        var xText=ptMin.Y;
        var yText=ptMin.X;
        this.Canvas.save(); 
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign=ptMin.Align;
        this.Canvas.textBaseline='bottom';
        var left=ptMin.Align=='left'?10:-10;
        this.Canvas.fillText(ptMin.Value.toFixed(2),left,0);
        this.Canvas.restore();

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMin.Y,ptMin.X,);
        this.Canvas.lineTo(ptMin.Y+8,ptMin.X+left);
        this.Canvas.strokeStyle=this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
    }

    this.ClearInfoDiv=function()
    {
        if (this.InfoDiv.length<=0) return;

        for(var i in this.InfoDiv)
        {
            var item=this.InfoDiv[i];
            var div=document.getElementById(item.id);
            this.ChartBorder.UIElement.parentNode.removeChild(div);
        }

        this.InfoDiv=[];
    }

    //画某一天的信息地雷
    this.DrawInfoDiv=function(item)
    {
        if (!this.InfoData || this.InfoData.length<=0) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;

        var infoData=this.InfoData.get(item.DayData.Date.toString());
        if (!infoData || infoData.Data.length<=0) return;

        var divInfo=document.createElement("div");
        divInfo.className='kline-info';
        divInfo.id=Guid();
        var iconWidth=Math.abs(item.Xleft-item.XRight);
        if (iconWidth>16)
        {
            iconWidth=16;
            item.Xleft=item.Xleft+(Math.abs(item.Xleft-item.XRight)-iconWidth)/2;
        }

        var text='', title='';
        var mapImage=new Map();
        for(var i in infoData.Data)
        {
            var infoItem=infoData.Data[i];
            var iconSrc=JSKLineInfoMap.GetIconUrl(infoItem.InfoType);
            var imageInfo=mapImage.get(infoItem.InfoType);
            if (!imageInfo)
            {
                divInfo.innerHTML+="<img src='"+iconSrc+"'"+ " infotype='"+infoItem.InfoType+"' />";
                mapImage.set(infoItem.InfoType,new Array(infoItem) );
            }
            else
            {
                imageInfo.push(infoItem);
            }
            title+='\n'+infoItem.Title;
        }

        //divInfo.innerHTML=text;
        var scrollPos=GetScrollPosition();
        var left = item.Xleft+ this.ChartBorder.UIElement.getBoundingClientRect().left+scrollPos.Left;
        var top = item.YMax+this.ChartBorder.UIElement.getBoundingClientRect().top+scrollPos.Top-5;

        divInfo.style.left = left + "px";
        divInfo.style.top = top-(mapImage.size*16) + "px";
        //divInfo.title=title;
        this.ChartBorder.UIElement.parentNode.appendChild(divInfo);

        if (this.InfoTooltipEvent && this.InfoTooltipEvent.length>=2)
        {
            if (typeof(this.InfoTooltipEvent[0])=='function')
            {
                var chart=this.ChartBorder.UIElement.JSChartContainer;
                var self=this;
                mapImage.forEach(function(item,key,data)
                {
                    //绑定鼠标悬浮消息
                    $("#"+divInfo.id+" img[infotype='"+key+"']").mouseover(
                    {
                            Chart:chart,    //图形类
                            InfoType:key,   //信息地雷类型
                            InfoList:item,  //信息数据列表
                    },
                    self.InfoTooltipEvent[0]);
                });
            }

            if (typeof(this.InfoTooltipEvent[1])=='function')
            {
                var chart=this.ChartBorder.UIElement.JSChartContainer;
                var self=this;
                mapImage.forEach(function(item,key,data)
                {
                    //绑定鼠标离开
                    $("#"+divInfo.id+" img[infotype='"+key+"']").mouseleave(
                    {
                            Chart:chart,    //图形类
                    },
                    self.InfoTooltipEvent[1]);
                });
            }
        }

        this.InfoDiv.push(divInfo);
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i in this.TooltipRect)
        {
            var rect=this.TooltipRect[i][1];
            this.Canvas.beginPath();
            this.Canvas.rect(rect.X,rect.Y,rect.Width,rect.Height);
            if (this.Canvas.isPointInPath(x,y))
            {
                var index=this.TooltipRect[i][0];
                tooltip.Data=this.Data.Data[index];
                tooltip.ChartPaint=this;
                return true;
            }
        }
        return false;
    }

    //计算当天显示数据的最大最小值
    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Max=null;
        range.Min=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            if (range.Max==null) range.Max=data.High;
            if (range.Min==null) range.Min=data.Low;

            if (range.Max<data.High) range.Max=data.High;
            if (range.Min>data.Low) range.Min=data.Low;
        }

        return range;
    }
}

/*
    K线画法 只有线段
*/
function ChartKLine2()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.UnchagneColor=g_JSChartResource.UnchagneBarColor;      //平盘

    this.Draw=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);
            var y=yHigh;

            if (data.Open<data.Close)       //阳线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(x,ToFixedPoint(yOpen));

                this.Canvas.moveTo(x,ToFixedPoint(yClose));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.UpColor;
                this.Canvas.stroke();
            }
            else if (data.Open>data.Close)  //阴线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(x,ToFixedPoint(yOpen));

                this.Canvas.moveTo(x,ToFixedPoint(yClose));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.DownColor;
                this.Canvas.stroke();
            }
            else // 平线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.UnchagneColor;
                this.Canvas.stroke();
            }

        }
    }

     //计算当天显示数据的最大最小值
     this.GetMaxMin=function()
     {
         var xPointCount=this.ChartFrame.XPointCount;
         var range={};
         range.Max=null;
         range.Min=null;
         for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
         {
             var data=this.Data.Data[i];
             if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

             if (range.Max==null) range.Max=data.High;
             if (range.Min==null) range.Min=data.Low;

             if (range.Max<data.High) range.Max=data.High;
             if (range.Min>data.Low) range.Min=data.Low;
         }

         return range;
     }
}

//K线叠加 支持横屏
function ChartOverlayKLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(65,105,225)";
    this.MainData;                  //主图K线数据
    this.SourceData;                //叠加的原始数据
    this.Name="ChartOverlayKLine";
    this.Title;

    this.Draw=function()
    {
        if (!this.MainData || !this.Data) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        this.TooltipRect=[];
        var isFristDraw=true;

        var firstOpen=null; //主线数据第1个收盘价
        for(var i=this.Data.DataOffset,j=0;i<this.MainData.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.MainData.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            firstOpen=data.Close;
            break;
        }

        if (firstOpen==null) return;

        var firstOverlayOpen=null;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (!data || data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            if (firstOverlayOpen==null) firstOverlayOpen=data.Open;

            if (isFristDraw)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.fillStyle=this.Color;
                this.Canvas.beginPath();
                isFristDraw=false;
            }

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low/firstOverlayOpen*firstOpen);
            var yHigh=this.ChartFrame.GetYFromData(data.High/firstOverlayOpen*firstOpen);
            var yOpen=this.ChartFrame.GetYFromData(data.Open/firstOverlayOpen*firstOpen);
            var yClose=this.ChartFrame.GetYFromData(data.Close/firstOverlayOpen*firstOpen);
            var y=yHigh;

            if (data.Open<data.Close)       //阳线
            {
                if (dataWidth>=4)
                {
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
                        y=yClose;
                    }
                    else
                    {
                        y=yClose;
                    }

                    this.Canvas.fillStyle=this.Color;
                    if (yOpen-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));

                    if (data.Open>data.Low)
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                    }
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yLow);
                    this.Canvas.lineTo(ToFixedPoint(x),yHigh);
                }
            }
            else if (data.Open>data.Close)  //阴线
            {
                this.Canvas.strokeStyle=this.Color;
                if (data.High>data.Close)   //上影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                    y=yOpen;
                }
                else
                {
                    y=yOpen
                }

                this.Canvas.fillStyle=this.Color;
                if (yOpen-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);
                else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yClose-y));

                if (data.Open>data.Low) //下影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
            }
            else // 平线
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (data.High>data.Close)   //上影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));

                    y=yOpen;
                }
                else
                {
                    y=yOpen;
                }

                this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(y));

                if (data.Open>data.Low) //下影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
            }

            //添加tooltip区域
            {
                var yTop=Math.min(yLow,yHigh,yOpen,yClose);
                var yBottom=Math.max(yLow,yHigh,yOpen,yClose);
                var rect=new Rect(left,yTop,dataWidth,yBottom-yTop);
                //this.Canvas.fillStyle="rgb(0,0,100)";
                //this.Canvas.fillRect(rect.X,rect.Y,rect.Width,rect.Height);
                this.TooltipRect.push([i,rect]);    //[0]数据索引 [1]数据区域
            }
        }

        if (isFristDraw==false) this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Max=null;
        range.Min=null;

        if (!this.MainData || !this.Data) return range;

        var firstOpen=null; //主线数据第1个收盘价
        for(var i=this.Data.DataOffset,j=0;i<this.MainData.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.MainData.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            firstOpen=data.Close;
            break;
        }

        if (firstOpen==null) return range;

        var firstOverlayOpen=null;
        var high,low;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (!data || data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            if (firstOverlayOpen==null) firstOverlayOpen=data.Open;

            high=data.High/firstOverlayOpen*firstOpen;
            low=data.Low/firstOverlayOpen*firstOpen;
            if (range.Max==null) range.Max=high;
            if (range.Min==null) range.Min=low;

            if (range.Max<high) range.Max=high;
            if (range.Min>low) range.Min=low;
        }

        return range;
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i in this.TooltipRect)
        {
            var rect=this.TooltipRect[i][1];
            this.Canvas.beginPath();
            this.Canvas.rect(rect.X,rect.Y,rect.Width,rect.Height);
            if (this.Canvas.isPointInPath(x,y))
            {
                var index=this.TooltipRect[i][0];
                tooltip.Data=this.Data.Data[index];
                tooltip.ChartPaint=this;
                return true;
            }
        }
        return false;
    }
}

//历史成交量柱子  ！！！不用了
function ChartKVolumeBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.Data.Data[i];
                if (data.Vol==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var y=this.ChartFrame.GetYFromData(data.Vol);

                if (data.Close>data.Open)
                    this.Canvas.fillStyle=this.UpColor;
                else
                    this.Canvas.fillStyle=this.DownColor;

                //高度调整为整数
                var height=ToFixedRect(yBottom-y);
                y=yBottom-height;
                this.Canvas.fillRect(ToFixedRect(left),y,ToFixedRect(dataWidth),height);
            }
        }
        else    //太细了直接话线
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.Data.Data[i];
                if (data.Vol==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var y=this.ChartFrame.GetYFromData(data.Vol);
                var x=this.ChartFrame.GetXFromIndex(j);

                if (data.Close>data.Open)
                    this.Canvas.strokeStyle=this.UpColor;
                else
                    this.Canvas.strokeStyle=this.DownColor;

                var x=this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),y);
                this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (range.Max==null) range.Max=data.Vol;

            if (range.Max<data.Vol) range.Max=data.Vol;
        }

        return range;
    }
}

//分钟成交量 支持横屏
function ChartMinuteVolumBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(200,200,200)";

    this.Draw=function()
    {
        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var vol=this.Data.Data[i];
            if (!vol) continue;

            var y=this.ChartFrame.GetYFromData(vol);
            var x=this.ChartFrame.GetXFromIndex(i);
            if (x>chartright) break;

            if (drawCount==0) this.Canvas.beginPath();

            this.Canvas.moveTo(ToFixedPoint(x),y);
            this.Canvas.lineTo(ToFixedPoint(x),yBottom);

            ++drawCount;
        }

        if (drawCount>0)
        {
            this.Canvas.strokeStyle=this.Color;
            this.Canvas.stroke();
        }
    }

    this.HScreenDraw=function()
    {
        var chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var vol=this.Data.Data[i];
            if (!vol) continue;

            var y=this.ChartFrame.GetYFromData(vol);
            var x=this.ChartFrame.GetXFromIndex(i);
            if (x>chartright) break;

            if (drawCount==0) this.Canvas.beginPath();

            this.Canvas.moveTo(y,ToFixedPoint(x));
            this.Canvas.lineTo(yBottom,ToFixedPoint(x));

            ++drawCount;
        }

        if (drawCount>0)
        {
            this.Canvas.strokeStyle=this.Color;
            this.Canvas.stroke();
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var vol=this.Data.Data[i];
            if (range.Max==null) range.Max=vol;

            if (range.Max<vol) range.Max=vol;
        }

        return range;
    }
}


//线段 支持横屏
function ChartLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.LineWidth;                 //线段宽度
    this.DrawType=0;                //画图方式  0=无效数平滑  1=无效数不画断开

    this.Draw=function()
    {
        if (!this.IsShow)
            return;
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        switch(this.DrawType)
        {
            case 0:
                return this.DrawLine();
            case 1: 
                return this.DrawStraightLine();
        }
    }

    this.DrawLine=function()
    {
        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;
        
        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();
        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    //无效数不画
    this.DrawStraightLine=function()
    {
        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();
        this.Canvas.strokeStyle=this.Color;

        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) 
            {
                if (drawCount>0) this.Canvas.stroke();
                bFirstPoint=true;
                drawCount=0;
                continue;
            }

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }
}


//POINTDOT 圆点 支持横屏
function ChartPointDot()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.Radius=1;                  //点半径

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen===true) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        this.Canvas.fillStyle=this.Color;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.beginPath();
            if (bHScreen) this.Canvas.arc(y, x, this.Radius, 0, Math.PI*2, true);
            else this.Canvas.arc(x, y, this.Radius, 0, Math.PI*2, true);
            this.Canvas.closePath();
            this.Canvas.fill();
        }

        this.Canvas.restore();
    }
}

//通达信语法  STICK 支持横屏
function ChartStick()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.LineWidth;               //线段宽度

    this.DrawLine=function()
    {
        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen===true) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();
        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y,x);
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;
            }
            else
            {
                if (isHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.DrawStick=function()
    {
        if (!this.Data || !this.Data.Data) return;

        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDrawStick();
            return;
        }

        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;
        var yBottom=this.ChartBorder.GetBottom();

        this.Canvas.save();
        this.Canvas.strokeStyle=this.Color;
        if (this.LineWidth) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            var xFix=parseInt(x.toString())+0.5;
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix,y);  
            this.Canvas.lineTo(xFix,yBottom);
            this.Canvas.stroke();
        }

        this.Canvas.restore();
    }

    this.HScreenDrawStick=function()
    {
        var chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;
        var xLeft=this.ChartBorder.GetLeft();

        this.Canvas.save();
        this.Canvas.strokeStyle=this.Color;
        if (this.LineWidth) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.beginPath();
            this.Canvas.moveTo(xLeft,x);  
            this.Canvas.lineTo(y,x);
            this.Canvas.stroke();
        }

        this.Canvas.restore();
    }

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
    }
}

//通达信语法 LINESTICK 支持横屏
function ChartLineStick()
{
    this.newMethod=ChartStick;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
        this.DrawLine();
    }
}

//通达信语法 VOLSTICK 支持横屏
function ChartVolStick()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.HistoryData;               //历史数据

    this.Draw=function()
    {
        if (this.ChartFrame.IsHScreen===true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var y=this.ChartFrame.GetYFromData(value);

                if (kItem.Close>=kItem.Open)
                    this.Canvas.fillStyle=this.UpColor;
                else
                    this.Canvas.fillStyle=this.DownColor;

                //高度调整为整数
                var height=ToFixedRect(yBottom-y);
                y=yBottom-height;
                this.Canvas.fillRect(ToFixedRect(left),y,ToFixedRect(dataWidth),height);
            }
        }
        else    //太细了直接话线
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var y=this.ChartFrame.GetYFromData(value);
                var x=this.ChartFrame.GetXFromIndex(j);
                if (x>chartright) break;

                if (kItem.Close>kItem.Open)
                    this.Canvas.strokeStyle=this.UpColor;
                else
                    this.Canvas.strokeStyle=this.DownColor;

                var x=this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),y);
                this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                this.Canvas.stroke();
            }
        }
    }

    this.HScreenDraw=function() //横屏画法
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
        var chartBottom=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartBottom) break;

                var y=this.ChartFrame.GetYFromData(value);

                if (kItem.Close>=kItem.Open)
                    this.Canvas.fillStyle=this.UpColor;
                else
                    this.Canvas.fillStyle=this.DownColor;

                //高度调整为整数
                var height=ToFixedRect(y-yBottom);
                this.Canvas.fillRect(yBottom,ToFixedRect(left),height,ToFixedRect(dataWidth));
            }
        }
        else    //太细了直接话线
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var y=this.ChartFrame.GetYFromData(value);
                var x=this.ChartFrame.GetXFromIndex(j);
                if (x>chartBottom) break;

                if (kItem.Close>kItem.Open)
                    this.Canvas.strokeStyle=this.UpColor;
                else
                    this.Canvas.strokeStyle=this.DownColor;

                var x=this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(y,ToFixedPoint(x));
                this.Canvas.lineTo(yBottom,ToFixedPoint(x));
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (range.Max==null) range.Max=value;

            if (range.Max<value) range.Max=value;
        }

        return range;
    }
}



//线段 多数据(一个X点有多条Y数据) 支持横屏
function ChartLineMultiData()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)"; //线段颜色

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var aryValue=this.Data.Data[i];
            if (aryValue==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            if (x>chartright) break;

            for(var index in aryValue)
            {
                var value =aryValue[index].Value;
                
                var y=this.ChartFrame.GetYFromData(value);

                if (bFirstPoint)
                {
                    this.Canvas.strokeStyle=this.Color;
                    this.Canvas.beginPath();
                    if (isHScreen) this.Canvas.moveTo(y,x);
                    else this.Canvas.moveTo(x,y);
                    bFirstPoint=false;
                }
                else
                {
                    if (isHScreen) this.Canvas.lineTo(y,x);
                    else this.Canvas.lineTo(x,y);
                }

                ++drawCount;
            }
        }

        if (drawCount>0)
            this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var aryValue=this.Data.Data[i];
            if (aryValue==null) continue;

            for(var index in aryValue)
            {
                var value=aryValue[index].Value;
                if (range.Max==null) range.Max=value;
                if (range.Min==null) range.Min=value;

                if (range.Max<value) range.Max=value;
                if (range.Min>value) range.Min=value;
            }
        }

        return range;
    }
}

//柱子 支持横屏
function ChartStickLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";               //线段颜色
    this.LineWidth=2*GetDevicePixelRatio();     //线段宽度

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        
        var LineWidth=this.LineWidth;
        if (dataWidth<=4) LineWidth=GetDevicePixelRatio();
        else if (dataWidth<LineWidth) LineWidth=parseInt(dataWidth);
        this.Canvas.strokeStyle=this.Color;
        this.Canvas.lineWidth=LineWidth;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var price=value.Value;
            var price2=value.Value2;
            if (price2==null) price2=0;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(price);
            var y2=this.ChartFrame.GetYFromData(price2);

            if (x>chartright) break;

            if (isHScreen)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(y,ToFixedPoint(x));
                this.Canvas.lineTo(y2,ToFixedPoint(x));
                this.Canvas.stroke();
            }
            else
            {
                var xFix=parseInt(x.toString())+0.5;
                this.Canvas.beginPath();
                this.Canvas.moveTo(xFix,y);  
                this.Canvas.lineTo(xFix,y2);
                this.Canvas.stroke();
            }
        }

        this.Canvas.restore();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (data == null) continue;
            var value2=data.Value2;
            if (value2==null) value2=0;
            if (data==null || isNaN(data.Value) ||isNaN(value2)) continue;

            
            var valueMax=Math.max(data.Value,value2);
            var valueMin=Math.min(data.Value,value2);
            
            if (range.Max==null) range.Max=valueMax;
            if (range.Min==null) range.Min=valueMin;

            if (range.Max<valueMax) range.Max=valueMax;
            if (range.Min>valueMin) range.Min=valueMin;
        }

        return range;
    }
}

function ChartText()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.TextFont="14px 微软雅黑";

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i in this.Data.Data)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var price=value.Value;
            var position=value.Position;

            if (position=='Left')
            {
                var x=this.ChartFrame.GetXFromIndex(0);
                var y=this.ChartFrame.GetYFromData(price);

                if (x>chartright) continue;

                this.Canvas.textAlign='left';
                this.Canvas.textBaseline='middle';
                this.Canvas.fillStyle=value.Color;
                this.Canvas.font=this.TextFont;
                this.Canvas.fillText(value.Message,x,y);
            }

        }

    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i in this.Data.Data)
        {
            var data=this.Data.Data[i];
            if (data==null || isNaN(data.Value)) continue;

            var value=data.Value;
            
            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }
}

/*
    文字输出 支持横屏
    数组不为null的数据中输出 this.Text文本
*/
function ChartSingleText()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";           //线段颜色
    this.TextFont="14px 微软雅黑";           //线段宽度
    this.Text;
    this.TextAlign='left';

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true)
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var isArrayText=Array.isArray(this.Text);
        var text;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.textAlign=this.TextAlign;
            this.Canvas.textBaseline='middle';
            this.Canvas.fillStyle=this.Color;
            this.Canvas.font=this.TextFont;

            if (isArrayText)
            {
                text=this.Text[i];
                if (!text) continue;
                this.DrawText(text,x,y,isHScreen);
            }
            else
            {
                this.DrawText(this.Text,x,y,isHScreen);
            }
        }
    }

    this.DrawText=function(text,x,y,isHScreen)
    {
        if (isHScreen)
        {
            this.Canvas.save(); 
            this.Canvas.translate(y, x);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();
        }
        else
        {
            this.Canvas.fillText(text,x,y);
        }
    }
}

//直线 水平直线 只有1个数据
function ChartStraightLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色

    this.Draw=function()
    {
        if (!this.Data || !this.Data.Data) return;
        if (this.Data.Data.length!=1) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yValue=this.Data.Data[0];
        var y=this.ChartFrame.GetYFromData(yValue);
        var xLeft=this.ChartFrame.GetXFromIndex(0);
        var xRight=this.ChartFrame.GetXFromIndex(xPointCount-1);

        var yFix=parseInt(y.toString())+0.5;
        this.Canvas.beginPath();
        this.Canvas.moveTo(xLeft,yFix);
        this.Canvas.lineTo(xRight,yFix);
        this.Canvas.strokeStyle=this.Color;
        this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if (!this.Data || !this.Data.Data) return range;
        if (this.Data.Data.length!=1) return range;

        range.Min=this.Data.Data[0];
        range.Max=this.Data.Data[0];

        return range;
    }
}

/*  
    水平面积 只有1个数据
    Data 数据结构 
    Value, Value2  区间最大最小值
    Color=面积的颜色
    Title=标题 TitleColor=标题颜色
    支持横屏
*/
function ChartStraightArea() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)";   //线段颜色
    this.Font ='11px 微软雅黑';

    this.Draw = function () 
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var left = this.ChartBorder.GetLeft();
        var xPointCount = this.ChartFrame.XPointCount;

        var xRight = this.ChartFrame.GetXFromIndex(xPointCount - 1);

        for(let i in this.Data.Data)
        {
            let item=this.Data.Data[i];
            if (item==null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color==null) continue;

            let valueMax=Math.max(item.Value,item.Value2);
            let valueMin=Math.min(item.Value,item.Value2);

            var yTop=this.ChartFrame.GetYFromData(valueMax);
            var yBottom=this.ChartFrame.GetYFromData(valueMin);

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(yTop), ToFixedRect(xRight - left), ToFixedRect(yBottom - yTop));

            if(item.Title && item.TitleColor)
            {
              this.Canvas.textAlign = 'right';
              this.Canvas.textBaseline = 'middle';
              this.Canvas.fillStyle = item.TitleColor;
              this.Canvas.font = this.Font;
              let y = yTop + (yBottom - yTop)/2;
              this.Canvas.fillText(item.Title, xRight, y);
            }
        }
    }

    this.HScreenDraw=function()
    {
        var bottom = this.ChartBorder.GetBottom();
        var top=this.ChartBorder.GetTop();
        var height=this.ChartBorder.GetHeight();

        for(let i in this.Data.Data)
        {
            let item=this.Data.Data[i];
            if (item==null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color==null) continue;

            let valueMax=Math.max(item.Value,item.Value2);
            let valueMin=Math.min(item.Value,item.Value2);

            var yTop=this.ChartFrame.GetYFromData(valueMax);
            var yBottom=this.ChartFrame.GetYFromData(valueMin);

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(yBottom), ToFixedRect(top), ToFixedRect(yTop-yBottom),ToFixedRect(height));

            if(item.Title && item.TitleColor)
            {
                var xText=yTop + (yBottom - yTop)/2;
                var yText=bottom;
                this.Canvas.save(); 
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);

                this.Canvas.textAlign = 'right';
                this.Canvas.textBaseline = 'middle';
                this.Canvas.fillStyle = item.TitleColor;
                this.Canvas.font = this.Font;
                this.Canvas.fillText(item.Title, 0, -2);

                this.Canvas.restore();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if (!this.Data || !this.Data.Data) return range;
        
        for (let i in this.Data.Data)
        {
          let item = this.Data.Data[i];
            if (item==null || isNaN(item.Value) || isNaN(item.Value2)) continue;

            let valueMax=Math.max(item.Value,item.Value2);
            let valueMin=Math.min(item.Value,item.Value2);

            if (range.Max==null) range.Max=valueMax;
            if (range.Min==null) range.Min=valueMin;

            if (range.Max<valueMax) range.Max=valueMax;
            if (range.Min>valueMin) range.Min=valueMin;
        }

        return range;
    }
}

//分钟线 支持横屏
function ChartMinutePriceLine()
{
    this.newMethod=ChartLine;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen===true) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y,x);
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;
            }
            else
            {
                if (isHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
            }

            ++drawCount;
        }

        if (drawCount>0)
            this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        if (this.YClose==null) return range;

        range.Min=this.YClose;
        range.Max=this.YClose;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        if (range.Max==this.YClose && range.Min==this.YClose)
        {
            range.Max=this.YClose+this.YClose*0.1;
            range.Min=this.YClose-this.YClose*0.1;
            return range;
        }

        var distance=Math.max(Math.abs(this.YClose-range.Max),Math.abs(this.YClose-range.Min));
        range.Max=this.YClose+distance;
        range.Min=this.YClose-distance;

        return range;
    }
}

//MACD森林线 支持横屏
function ChartMACD()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        var drawCount=0;
        var yBottom=this.ChartFrame.GetYFromData(0);
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            var xFix=parseInt(x.toString())+0.5;    //毛边修正
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix,yBottom);
            this.Canvas.lineTo(xFix,y);

            if (value>=0) this.Canvas.strokeStyle=this.UpColor;
            else this.Canvas.strokeStyle=this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }
    }

    this.HScreenDraw=function()
    {
        var chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);
        
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.beginPath();
            this.Canvas.moveTo(yBottom,ToFixedPoint(x));
            this.Canvas.lineTo(y,ToFixedPoint(x));

            if (value>=0) this.Canvas.strokeStyle=this.UpColor;
            else this.Canvas.strokeStyle=this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }
    }
}

//柱子
function ChartBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpBarColor=g_JSChartResource.UpBarColor;
    this.DownBarColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;

        var bFirstPoint=true;
        var drawCount=0;
        var yBottom=this.ChartFrame.GetYFromData(0);
        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);   //调整为整数
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                if (value==null || value==0) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var x=this.ChartFrame.GetXFromIndex(j);
                var y=this.ChartFrame.GetYFromData(value);


                if (value>0) this.Canvas.fillStyle=this.UpBarColor;
                else this.Canvas.fillStyle=this.DownBarColor;

                //高度调整为整数
                var height=ToFixedRect(Math.abs(yBottom-y));
                if(yBottom-y>0) y=yBottom-height;
                else y=yBottom+height;
                this.Canvas.fillRect(ToFixedRect(left),y,ToFixedRect(dataWidth),height);
            }
        }
        else    //太细了 直接画柱子
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                if (value==null || value==0) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var x=this.ChartFrame.GetXFromIndex(j);
                var y=this.ChartFrame.GetYFromData(value);

                if (value>0) this.Canvas.strokeStyle=this.UpBarColor;
                else this.Canvas.strokeStyle=this.DownBarColor;

                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),y);
                this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (range.Max==null) range.Max=value;
            if (range.Max<value) range.Max=value;
        }

        return range;
    }
}
// 面积图
function ChartBand()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.IsDrawFirst = true;

    this.FirstColor = g_JSChartResource.Index.LineColor[0];
    this.SecondColor = g_JSChartResource.Index.LineColor[1];

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var x = 0;
        var y = 0;
        var y2 = 0;
        var firstlinePoints = [];
        var secondlinePoints = [];
        var lIndex = 0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var value=this.Data.Data[i];
            if (value==null || value.Value==null || value.Value2 == null) continue;
            x=this.ChartFrame.GetXFromIndex(j);
            y=this.ChartFrame.GetYFromData(value.Value);
            y2 = this.ChartFrame.GetYFromData(value.Value2);
            firstlinePoints[lIndex] = {x:x,y:y};
            secondlinePoints[lIndex] = {x:x,y:y2};
            lIndex++;
        }
        if (firstlinePoints.length > 1)
        {
            this.Canvas.save();
            this.Canvas.beginPath();
            for (var i = 0; i < firstlinePoints.length; ++i)
            {
                if (i == 0)
                    this.Canvas.moveTo(firstlinePoints[i].x, firstlinePoints[i].y);
                else
                    this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
            }  
            for (var j = secondlinePoints.length-1; j >= 0; --j)
            {
                this.Canvas.lineTo(secondlinePoints[j].x, secondlinePoints[j].y);
            }  
            this.Canvas.closePath();
            this.Canvas.clip();
            this.Canvas.beginPath();
            this.Canvas.moveTo(firstlinePoints[0].x, this.ChartBorder.GetBottom());
            for (var i = 0; i < firstlinePoints.length; ++i)
            {
                this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
            }
            this.Canvas.lineTo(firstlinePoints[firstlinePoints.length-1].x, this.ChartBorder.GetBottom());
            this.Canvas.closePath();
            this.Canvas.fillStyle = this.FirstColor;
            this.Canvas.fill();
            this.Canvas.beginPath();
            this.Canvas.moveTo(secondlinePoints[0].x, this.ChartBorder.GetBottom());
            for (var i = 0; i < secondlinePoints.length; ++i)
            {
                this.Canvas.lineTo(secondlinePoints[i].x, secondlinePoints[i].y);
            }
            this.Canvas.lineTo(secondlinePoints[secondlinePoints.length-1].x, this.ChartBorder.GetBottom());
            this.Canvas.closePath();
            this.Canvas.fillStyle = this.SecondColor;
            this.Canvas.fill();
            this.Canvas.restore();
        }
    }
    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null || value.Value==null || value.Value2 == null) continue;
            var maxData = value.Value>value.Value2?value.Value:value.Value2;
            var minData = value.Value<value.Value2?value.Value:value.Value2;
            if (range.Max==null) 
                range.Max = maxData;
            else if (range.Max < maxData)
                range.Max = maxData;
            
            if (range.Min==null)
                range.Min = minData;
            else if (range.Min > minData)
                range.Min = minData; 
        }

        return range;
    }
}

//锁  支持横屏
function ChartLock()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.WidthDiv = 0.2;  // 框子宽度占比
    this.LockCount = 20; // 锁最新的几个数据
    this.BGColor = g_JSChartResource.LockBGColor;
    this.TextColor = g_JSChartResource.LockTextColor;
    this.Font = g_JSChartResource.DefaultTextFont;
    this.Title = '🔒开通权限';
    this.LockRect=null; //上锁区域
    this.LockID;        //锁ID
    this.Callback;      //回调
    this.IndexName;     //指标名字

    this.Draw=function()
    {
        this.LockRect=null;
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.ChartFrame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var xOffset = this.ChartBorder.GetRight();
        var lOffsetWidth = 0;
        if (this.ChartFrame.Data != null)
        {
            var dataWidth=this.ChartFrame.DataWidth;
            var distanceWidth=this.ChartFrame.DistanceWidth;
            xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
            var chartright=this.ChartBorder.GetRight();
            var xPointCount=this.ChartFrame.XPointCount;
            for(var i=this.ChartFrame.Data.DataOffset,j=0;i<this.ChartFrame.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.ChartFrame.Data.Data[i];
                if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
            }
            lOffsetWidth = (dataWidth + distanceWidth) * this.LockCount;    
        }
        if (lOffsetWidth == 0)
        {
            lOffsetWidth = (xOffset - this.ChartBorder.GetLeft()) * this.WidthDiv;
        }
        var lLeft = xOffset - lOffsetWidth;
        if (lLeft < this.ChartBorder.GetLeft())
            lLeft = this.ChartBorder.GetLeft();
        var lHeight = this.ChartBorder.GetBottom() - this.ChartBorder.GetTop();
        var lWidth = this.ChartBorder.GetRight() - lLeft;
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.fillRect(lLeft, this.ChartBorder.GetTop(), lWidth, lHeight);
        var xCenter = lLeft + lWidth / 2;
        var yCenter = this.ChartBorder.GetTop() + lHeight / 2;
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.Title, xCenter, yCenter);

        this.LockRect={Left:lLeft,Top:this.ChartBorder.GetTop(),Width:lWidth,Heigh:lHeight};    //保存上锁区域
    }

    this.HScreenDraw=function()
    {
        var xOffset = this.ChartBorder.GetBottom();

        var lOffsetWidth = 0;
        if (this.ChartFrame.Data != null)
        {
            var dataWidth=this.ChartFrame.DataWidth;
            var distanceWidth=this.ChartFrame.DistanceWidth;
            xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
            var chartright=this.ChartBorder.GetBottom();
            var xPointCount=this.ChartFrame.XPointCount;
            //求最后1个数据的位置
            for(var i=this.ChartFrame.Data.DataOffset,j=0;i<this.ChartFrame.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.ChartFrame.Data.Data[i];
                if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
            }
            lOffsetWidth = (dataWidth + distanceWidth) * this.LockCount;    
        }
        if (lOffsetWidth == 0)
        {
            lOffsetWidth = (xOffset - this.ChartBorder.GetTop()) * this.WidthDiv;
        }

        var lLeft = xOffset - lOffsetWidth;
        if (lLeft < this.ChartBorder.GetTop()) lLeft = this.ChartBorder.GetTop();
        var lHeight =  this.ChartBorder.GetRight()-this.ChartBorder.GetLeft();
        var lWidth = this.ChartBorder.GetBottom() - lLeft;
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.fillRect(this.ChartBorder.GetLeft(), lLeft,lHeight,lWidth);

        var xCenter = this.ChartBorder.GetLeft() + lHeight / 2;
        var yCenter = lLeft + lWidth / 2;
        this.Canvas.save(); 
        this.Canvas.translate(xCenter, yCenter);
        this.Canvas.rotate(90 * Math.PI / 180);
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.Title, 0, 0);
        this.Canvas.restore();

        this.LockRect={Left:this.ChartBorder.GetLeft(),Top:lLeft,Width:lHeight,Heigh:lWidth};    //保存上锁区域
    }

    //x,y是否在上锁区域
    this.GetTooltipData=function(x,y,tooltip)
    {
        if (this.LockRect==null) return false;

        this.Canvas.beginPath();
        this.Canvas.rect(this.LockRect.Left,this.LockRect.Top,this.LockRect.Width,this.LockRect.Heigh);
        if (this.Canvas.isPointInPath(x,y))
        {
            tooltip.Data={ ID:this.LockID, Callback:this.Callback, IndexName:this.IndexName };
            tooltip.ChartPaint=this;
            return true;
        }
        
        return false;
    }
}

//买卖盘
function ChartBuySell()
{
    this.newMethod=ChartSingleText;   //派生
    this.newMethod();
    delete this.newMethod;

    this.TextFont=g_JSChartResource.KLineTrain.Font;                //"bold 14px arial";           //买卖信息字体
    this.LastDataIcon=g_JSChartResource.KLineTrain.LastDataIcon; //{Color:'rgb(0,0,205)',Text:'↓'};
    this.BuyIcon=g_JSChartResource.KLineTrain.BuyIcon; //{Color:'rgb(0,0,205)',Text:'B'};
    this.SellIcon=g_JSChartResource.KLineTrain.SellIcon; //{Color:'rgb(0,0,205)',Text:'S'};
    this.BuySellData=new Map();   //{Date:日期, Op:买/卖 0=buy 1=sell}
    this.LastData={}; //当前屏最后一个数据

    this.Draw=function()
    {
        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen===true) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.font=this.TextFont;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;
            if (x>chartright) break;

            this.LastData={ID:j,Data:value};

            if (!this.BuySellData.has(value.Date)) continue;
            var bsItem=this.BuySellData.get(value.Date);
            var x=this.ChartFrame.GetXFromIndex(j);
            var yHigh=this.ChartFrame.GetYFromData(value.High);
            var yLow=this.ChartFrame.GetYFromData(value.Low);
            if (bsItem.Op==0)   //买 标识在最低价上
            {
                this.Canvas.textAlign='center';
                this.Canvas.textBaseline='top';
                this.Canvas.fillStyle=this.BuyIcon.Color;
                this.DrawText(this.BuyIcon.Text,x,yLow,isHScreen);
            }
            else    //买 标识在最高价上
            {
                this.Canvas.textAlign='center';
                this.Canvas.textBaseline='bottom';
                this.Canvas.fillStyle=this.SellIcon.Color;
                this.DrawText(this.SellIcon.Text,x,yHigh,isHScreen);
            }
        }

        var x=this.ChartFrame.GetXFromIndex(this.LastData.ID);
        var yHigh=this.ChartFrame.GetYFromData(this.LastData.Data.High);
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='bottom';
        this.Canvas.fillStyle=this.LastDataIcon.Color;
        this.Canvas.font=this.TextFont;
        this.DrawText(this.LastDataIcon.Text,x,yHigh,isHScreen);
    }
}

/*
    饼图
*/
function ChartPie()
{   
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Radius = 100; //半径默认值
    this.Distance = 30; //指示线超出圆饼的距离
    this.txtLine = 20; // 文本下划线
    this.paddingX = 20 / 3;// 设置文本的移动
    
    // return;
    this.Draw=function()
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length>0)) return this.DrawEmptyData();

        let left=this.ChartBorder.GetLeft();
        let right=this.ChartBorder.GetRight();
        let top=this.ChartBorder.GetTop();
        let bottom=this.ChartBorder.GetBottom();
        let width=this.ChartBorder.GetWidth();
        let height=this.ChartBorder.GetHeight();

        if(isNaN(this.Radius)){
            let str = this.Radius.replace("%","");
            str = str/100;
            if(width >= height){
                this.Radius = str*height;
            }
            if(width < height) this.Radius = str*width;
        }


        this.Canvas.translate(width/2,height/2);

        let totalValue=0;   //求和
        for(let i in this.Data.Data)
        {
            totalValue += this.Data.Data[i].Value;
        }
        let start = 0;
        let end = 0;
        //画饼图
        for(let i in this.Data.Data)
        {
            let item =this.Data.Data[i];
            let rate=(item.Value/totalValue).toFixed(2); //占比
            //console.log('[ChartPie::Draw]', i, rate, item);

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0,0);

            end += rate*2*Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0,0,this.Radius,start,end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();
            
            // 绘制直线
            this.Canvas.beginPath();
            this.Canvas.strokeStyle = item.Color;
            this.Canvas.moveTo(0,0);
            let x = (this.Radius + this.Distance)*Math.cos(end- (end-start)/2);
            let y = (this.Radius + this.Distance)*Math.sin(end - (end-start)/2);
            this.Canvas.lineTo(x,y);
            // console.log(x,y,"xy")
            
            // 绘制横线
            let txtLine = this.txtLine;
            let paddingX = this.paddingX;
            this.Canvas.textAlign = 'left';
            if( end - (end-start)/2 < 1.5*Math.PI && end - (end-start)/2 > 0.5*Math.PI ){
                
                txtLine = - this.txtLine;
                paddingX = - this.paddingX;
                this.Canvas.textAlign = 'right';
            }
            this.Canvas.lineTo( x + txtLine, y );
            this.Canvas.stroke();

             // 写文字
             if(item.Text){
                 this.Canvas.fillText( item.Text, x + txtLine + paddingX, y );
             }else{
                 let text = `${item.Name}:${item.Value}`;
                 this.Canvas.fillText( text, x + txtLine + paddingX, y );
             }
            

            start += rate*2*Math.PI;//起始角度
        }

        


    }

    //空数据
    this.DrawEmptyData=function()
    {
        console.log('[ChartPie::DrawEmptyData]')
    }
}

/*
    中国地图
*/


function ChartChinaMap()
{   
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ImageData=null;
    this.Left;
    this.Top;
    this.Width;
    this.Height;
    this.ImageWidth;
    this.ImageHeight;

    this.DefaultColor=[217,222,239];

    this.Color=
    [
        {Name:'海南',       Color:'rgb(217,222,223)'},
        {Name:'内蒙古',     Color:'rgb(217,222,225)'},
        {Name:'新疆',       Color:'rgb(217,222,226)'},
        {Name:'青海',       Color:'rgb(217,222,227)'},
        {Name:'西藏',       Color:'rgb(217,222,228)'},
        {Name:'云南',       Color:'rgb(217,222,229)'},
        {Name:'黑龙江',     Color:'rgb(217,222,230)'},
        {Name:'吉林',       Color:'rgb(217,222,231)'},
        {Name:'辽宁',       Color:'rgb(217,222,232)'},
        {Name:'河北',       Color:'rgb(217,222,233)'},
        {Name:'山东',       Color:'rgb(217,222,234)'},
        {Name:'江苏',       Color:'rgb(217,222,235)'},
        {Name:'浙江',       Color:'rgb(217,222,236)'},
        {Name:'福建',       Color:'rgb(217,222,237)'},
        {Name:'广东',       Color:'rgb(217,222,238)'},
        {Name:'广西',       Color:'rgb(217,222,239)'},
        {Name:'贵州',       Color:'rgb(217,222,240)'},
        {Name:'湖南',       Color:'rgb(217,222,241)'},
        {Name:'江西',       Color:'rgb(217,222,242)'},
        {Name:'安徽',       Color:'rgb(217,222,243)'},
        {Name:'湖北',       Color:'rgb(217,222,244)'},
        {Name:'重庆',       Color:'rgb(217,222,245)'},
        {Name:'四川',       Color:'rgb(217,222,246)'},
        {Name:'甘肃',       Color:'rgb(217,222,247)'},
        {Name:'陕西',       Color:'rgb(217,222,248)'},
        {Name:'山西',       Color:'rgb(217,222,249)'},
        {Name:'河南',       Color:'rgb(217,222,250)'}
    ];

    this.Draw=function()
    {
        let left=this.ChartBorder.GetLeft()+1;
        let right=this.ChartBorder.GetRight()-1;
        let top=this.ChartBorder.GetTop()+1;
        let bottom=this.ChartBorder.GetBottom()-1;
        let width=this.ChartBorder.GetWidth()-2;
        let height=this.ChartBorder.GetHeight()-2;

        let imageWidth=CHINA_MAP_IMAGE.width;
        let imageHeight=CHINA_MAP_IMAGE.height;

        let drawImageWidth=imageWidth;
        let drawImageHeight=imageHeight;

        if (height<drawImageHeight || width<drawImageWidth) 
        {
            this.ImageData=null;
            return;
        }

        if (this.Left!=left || this.Top!=top || this.Width!=width || this.Height!=height || this.ImageWidth!=imageWidth || this.ImageHeight!=imageHeight)
        {
            this.ImageData=null;

            this.ImageWidth=imageWidth;
            this.ImageHeight=imageHeight;
            this.Left=left;
            this.Top=top;
            this.Width=width;
            this.Height=height;

            console.log(imageWidth,imageHeight);
        }
        
        if (this.ImageData==null)
        {
            this.Canvas.drawImage(CHINA_MAP_IMAGE,0,0,imageWidth,imageHeight,left,top,drawImageWidth,drawImageHeight);
            this.ImageData=this.Canvas.getImageData(left,top,drawImageWidth,drawImageHeight);

            let defaultColorSet=new Set();  //默认颜色填充的色块
            let colorMap=new Map();         //定义颜色填充的色块

            let nameMap=new Map();
            if (this.Data.length>0)
            {
                for(let i in this.Data)
                {
                    let item=this.Data[i];
                    nameMap.set(item.Name,item.Color)
                }
            }

            console.log(this.Data);
            for(let i in this.Color)
            {
                let item=this.Color[i];
                if (nameMap.has(item.Name))
                {
                    colorMap.set(item.Color,nameMap.get(item.Name));
                }
                else
                {
                    defaultColorSet.add(item.Color);
                }
            }

            var color;
            for (let i=0;i<this.ImageData.data.length;i+=4)
            {
                color='rgb('+ this.ImageData.data[i] + ',' + this.ImageData.data[i+1] + ',' + this.ImageData.data[i+2] + ')';

                if (defaultColorSet.has(color))
                {
                    this.ImageData.data[i]=this.DefaultColor[0];
                    this.ImageData.data[i+1]=this.DefaultColor[1];
                    this.ImageData.data[i+2]=this.DefaultColor[2];
                }
                else if (colorMap.has(color))
                {
                    let colorValue=colorMap.get(color);
                    this.ImageData.data[i]=colorValue[0];
                    this.ImageData.data[i+1]=colorValue[1];
                    this.ImageData.data[i+2]=colorValue[2];
                }
            }
            this.Canvas.clearRect(left,top,drawImageWidth,drawImageHeight);
            this.Canvas.putImageData(this.ImageData,left,top,0,0,drawImageWidth,drawImageHeight);
        }
        else
        {
            this.Canvas.putImageData(this.ImageData,left,top,0,0,drawImageWidth,drawImageHeight);
        }
    }
}

/*
    扩展图形
*/

function IExtendChartPainting()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.Data=new ChartData();          //数据区

    //上下左右间距
    this.Left=5;
    this.Right=5;
    this.Top=5;
    this.Bottom=5;

    this.Draw=function()
    {

    }

}

function StockInfoExtendChartPaint()
{
    this.newMethod=IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Left=80;
    this.Right=1;
    this.Top=1;
    this.Bottom=1;

    this.BorderColor=g_JSChartResource.FrameBorderPen;

    this.Symbol;
    this.Name;

    this.TitleFont=["14px 微软雅黑"];

    this.Draw=function()
    {
        var left=this.ChartBorder.GetRight()+this.Left;
        var right=this.ChartBorder.GetChartWidth()-this.Right;
        var y=this.Top+18;
        var middle=left+(right-left)/2;

        if (this.Symbol && this.Name)
        {
            this.Canvas.font=this.TitleFont[0];

            this.Canvas.textAlign="right";
            this.Canvas.textBaseline="bottom";
            this.Canvas.fillText(this.Symbol,middle-2,y);

            this.Canvas.textAlign="left";
            this.Canvas.fillText(this.Name,middle+2,y);
        }
        ;
        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.moveTo(left,y);
        this.Canvas.lineTo(right,y);
        this.Canvas.stroke();

        y+=30;

        this.DrawBorder();
    }

    this.DrawBorder=function()
    {
        var left=this.ChartBorder.GetRight()+this.Left;
        var right=this.ChartBorder.GetChartWidth()-this.Right;
        var top=this.Top;
        var bottom=this.ChartBorder.GetChartHeight()-this.Bottom;

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.strokeRect(left,top,(right-left),(bottom-top));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//坐标分割
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function IFrameSplitOperator()
{
    this.ChartBorder;                   //边框信息
    this.Frame;                         //框架信息
    this.FrameSplitData;                //坐标轴分割方法
    this.SplitCount=5;                  //刻度个数
    this.StringFormat=0;                //刻度字符串格式

    //////////////////////
    // data.Min data.Max data.Interval data.Count
    //
    this.IntegerCoordinateSplit=function(data)
    {
        var splitItem=this.FrameSplitData.Find(data.Interval);
        if (!splitItem) return false;

        if (data.Interval==splitItem.Interval) return true;

        //调整到整数倍数,不能整除的 +1
        var fixMax=parseInt((data.Max/(splitItem.FixInterval)+0.5).toFixed(0))*splitItem.FixInterval;
        var fixMin=parseInt((data.Min/(splitItem.FixInterval)-0.5).toFixed(0))*splitItem.FixInterval;
        if (data.Min==0) fixMin=0;  //最小值是0 不用调整了.

        var count=0;
        for(var i=fixMin;(i-fixMax)<0.00000001;i+=splitItem.FixInterval)
        {
            ++count;
        }

        data.Interval=splitItem.FixInterval;
        data.Max=fixMax;
        data.Min=fixMin;
        data.Count=count;

        return true;
    }
}

//字符串格式化 千分位分割
IFrameSplitOperator.FormatValueThousandsString=function(value,floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    var result='';
    var num=value.toFixed(floatPrecision);
    while (num.length > 3)
    {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

//数据输出格式化 floatPrecision=小数位数
IFrameSplitOperator.FormatValueString=function(value, floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    if (value<0.00000000001 && value>-0.00000000001)
    {
        return "0";
    }

    var absValue = Math.abs(value);
    if (absValue < 10000)
    {
        return value.toFixed(floatPrecision);
    }
    else if (absValue < 100000000)
    {
        return (value/10000).toFixed(floatPrecision)+"万";
    }
    else if (absValue < 1000000000000)
    {
        return (value/100000000).toFixed(floatPrecision)+"亿";
    }
    else
    {
        return (value/1000000000000).toFixed(floatPrecision)+"万亿";
    }

    return TRUE;
}

IFrameSplitOperator.FormatDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var day=value%100;

    return year.toString()+'-'+month.toString()+'-'+day.toString();
}

IFrameSplitOperator.FormatTimeString=function(value)
{
    var hour=parseInt(value/100);
    var minute=value%100;
    var strHour=hour>=10?hour.toString():'0'+hour.toString();
    var strMinute=minute>=10?minute.toString():'0'+minute.toString();

    return strHour+':'+ strMinute;
}

//报告格式化
IFrameSplitOperator.FormatReportDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var monthText;
    switch(month)
    {
        case 3:
            monthText="一季度报";
            break;
        case 6:
            monthText="半年报";
            break;
        case 9:
            monthText="三季度报";
            break;
        case 12:
            monthText="年报";
            break;
    }

    return year.toString()+ monthText;
}

IFrameSplitOperator.FormatDateTimeString=function(value,isShowDate)
{
    var aryValue=value.split(' ');
    if (aryValue.length<2) return "";
    var time=parseInt(aryValue[1]);
    var minute=time%100;
    var hour=parseInt(time/100);
    var text=(hour<10? ('0'+hour.toString()):hour.toString()) + ':' + (minute<10?('0'+minute.toString()):minute.toString());

    if (isShowDate==true)
    {
        var date=parseInt(aryValue[0]);
        var year=parseInt(date/10000);
        var month=parseInt(date%10000/100);
        var day=date%100;
        text=year.toString() +'-'+ (month<10? ('0'+month.toString()) :month.toString()) +'-'+ (day<10? ('0'+day.toString()):day.toString()) +" " +text;
    }

    return text;
}

function FrameSplitKLinePriceY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        var splitData={};
        splitData.Max=this.Frame.HorizontalMax;
        splitData.Min=this.Frame.HorizontalMin;
        splitData.Count=this.SplitCount;
        splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        this.IntegerCoordinateSplit(splitData);

        this.Frame.HorizontalInfo=[];

        for(var i=0,value=splitData.Min;i<splitData.Count;++i,value+=splitData.Interval)
        {
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=value;

            if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
            {
                var floatPrecision=2;
                if (!isNaN(value) && Math.abs(value) > 1000) floatPrecision=0;
                this.Frame.HorizontalInfo[i].Message[1]=value.toFixed(floatPrecision);
            }
            else
            {
                this.Frame.HorizontalInfo[i].Message[1]=value.toFixed(2);
            }
            this.Frame.HorizontalInfo[i].Message[0]=this.Frame.HorizontalInfo[i].Message[1];
            //this.Frame.HorizontalInfo[i].Font="14px 微软雅黑";
            //this.Frame.HorizontalInfo[i].TextColor="rgb(100,0,200)";
            //this.Frame.HorizontalInfo[i].LineColor="rgb(220,220,220)";
        }

        this.Frame.HorizontalMax=splitData.Max;
        this.Frame.HorizontalMin=splitData.Min;
    }

}

function FrameSplitY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        var splitData={};
        splitData.Max=this.Frame.HorizontalMax;
        splitData.Min=this.Frame.HorizontalMin;
        if(this.Frame.YSpecificMaxMin)
        {
            splitData.Count=this.Frame.YSpecificMaxMin.Count;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        }
        else
        {
            splitData.Count=this.SplitCount;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
            this.IntegerCoordinateSplit(splitData);
        }

        this.Frame.HorizontalInfo=[];

        for(var i=0,value=splitData.Min;i<splitData.Count;++i,value+=splitData.Interval)
        {
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=value;

            if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
            {
                var floatPrecision=2;
                if (!isNaN(value) && Math.abs(value) > 1000) floatPrecision=0;
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(value,floatPrecision);
            }
            else
            {
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(value,2);
            }
            
            this.Frame.HorizontalInfo[i].Message[0]=this.Frame.HorizontalInfo[i].Message[1];
            //this.Frame.HorizontalInfo[i].Font="14px 微软雅黑";
            //this.Frame.HorizontalInfo[i].TextColor="rgb(100,0,200)";
            //this.Frame.HorizontalInfo[i].LineColor="rgb(220,220,220)";
        }

        this.Frame.HorizontalMax=splitData.Max;
        this.Frame.HorizontalMin=splitData.Min;
    }
}

function FrameSplitKLineX()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息

    this.Operator=function()
    {
        if (this.Frame.Data==null) return;
        this.Frame.VerticalInfo=[];
        var xOffset=this.Frame.Data.DataOffset;
        var xPointCount=this.Frame.XPointCount;

        var lastYear=null, lastMonth=null;
        var minDistance=12;
        for(var i=0, index=xOffset, distance=minDistance;i<xPointCount && index<this.Frame.Data.Data.length ;++i,++index)
        {
            var year=parseInt(this.Frame.Data.Data[index].Date/10000);
            var month=parseInt(this.Frame.Data.Data[index].Date/100)%100;

            if (distance<minDistance ||
                (lastYear!=null && lastYear==year && lastMonth!=null && lastMonth==month))
            {
                lastMonth=month;
                ++distance;
                continue;
            }

            var info= new CoordinateInfo();
            info.Value=index-xOffset;
            var text;
            if (lastYear==null || lastYear!=year)
            {
                text=year.toString();
            }
            else if (lastMonth==null || lastMonth!=month)
            {
                text=month.toString()+"月";
            }

            lastYear=year;
            lastMonth=month;
            if (this.ShowText)
            {
                info.Message[0]=text;
            }

            this.Frame.VerticalInfo.push(info);
            distance=0;
        }
    }
}

function FrameSplitMinutePriceY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;                        //昨收
    this.Data;                          //分钟数据
    this.AverageData;                   //分钟均线数据
    this.SplitCount=7;

    this.Operator=function()
    {
        this.Frame.HorizontalInfo=[];
        if (!this.Data) return;

        var max=this.YClose;
        var min=this.YClose;

        for(var i in this.Data.Data)
        {
            if (this.Data.Data[i]==null) continue;
            if (max<this.Data.Data[i]) max=this.Data.Data[i];
            if (min>this.Data.Data[i]) min=this.Data.Data[i];
        }

        if (this.AverageData)
        {
            for(var i in this.AverageData.Data)
            {
                if (this.AverageData.Data[i]==null) continue;
                if (max<this.AverageData.Data[i]) max=this.AverageData.Data[i];
                if (min>this.AverageData.Data[i]) min=this.AverageData.Data[i];
            }
        }

        
        if (this.YClose==max && this.YClose==min)
        {
            max=this.YClose+this.YClose*0.1;
            min=this.YClose-this.YClose*0.1
        }
        else
        {
            var distanceValue=Math.max(Math.abs(this.YClose-max),Math.abs(this.YClose-min));
            max=this.YClose+distanceValue;
            min=this.YClose-distanceValue;
        }

        console.log('[FrameSplitMinutePriceY]', max,min);

        var showCount=this.SplitCount;
        var distance=(max-min)/(showCount-1);
        for(var i=0;i<showCount;++i)
        {
            var price=min+(distance*i);
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=price;

            if (i>0)
            {
                if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
                {
                    var floatPrecision=2;
                    if (!isNaN(price) && Math.abs(price) > 1000) floatPrecision=0;
                    this.Frame.HorizontalInfo[i].Message[0]=IFrameSplitOperator.FormatValueString(price,floatPrecision);
                }
                else
                {
                    this.Frame.HorizontalInfo[i].Message[0]=IFrameSplitOperator.FormatValueString(price,2);
                }
                var per=(price/this.YClose-1)*100;
                if (per>0) this.Frame.HorizontalInfo[i].TextColor=g_JSChartResource.UpTextColor;
                else if (per<0) this.Frame.HorizontalInfo[i].TextColor=g_JSChartResource.DownTextColor;
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(per,2)+'%'; //百分比
            }
        }

        this.Frame.HorizontalMax=max;
        this.Frame.HorizontalMin=min;
    }

}

//沪深走势图时间刻度
var SHZE_MINUTE_X_COORDINATE=
[
    [0,     0,"rgb(200,200,200)",   "09:30"],
    [31,	0,"RGB(200,200,200)",	"10:00"],
	[61,	0,"RGB(200,200,200)",	"10:30"],
	[91,	0,"RGB(200,200,200)",	"11:00"],
	[122,	1,"RGB(200,200,200)",	"13:00"],
	[152,	0,"RGB(200,200,200)",	"13:30"],
	[182,	0,"RGB(200,200,200)",	"14:00"],
	[212,	0,"RGB(200,200,200)",	"14:30"],
	[242,	1,"RGB(200,200,200)",	""] // 15:00
];

//港股走势图时间刻度
var HK_MINUTE_X_COORDINATE=
[
    [0,		1,"RGB(200,200,200)",	"09:30"],
	[30,	0,"RGB(200,200,200)",	"10:00"],
	[60,	1,"RGB(200,200,200)",	"10:30"],
	[90,	0,"RGB(200,200,200)",	"11:00"],
	[120,	1,"RGB(200,200,200)",	"11:30"],
	[151,	0,"RGB(200,200,200)",	"13:00"],
	[181,	1,"RGB(200,200,200)",	"13:30"],
	[211,	0,"RGB(200,200,200)",	"14:00"],
	[241,	1,"RGB(200,200,200)",	"14:30"],
	[271,	0,"RGB(200,200,200)",	"15:00"],
	[301,	1,"RGB(200,200,200)",	"15:30"],
	[331,	1,"RGB(200,200,200)",	""] //16:00
];

function FrameSplitMinuteX()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息
    this.Symbol=null;                   //股票代码 x轴刻度根据股票类型来调整

    this.Operator=function()
    {
        this.Frame.VerticalInfo=[];
        var xPointCount=this.Frame.XPointCount;

        //默认沪深股票
        var xcoordinate=SHZE_MINUTE_X_COORDINATE;
        this.Frame.XPointCount=243;

        if(this.Symbol!=null)
        {   //港股用港股的刻度 及数据个数
            if (this.Symbol.indexOf('.hk')>0) 
            {
                xcoordinate=HK_MINUTE_X_COORDINATE;
                this.Frame.XPointCount=332;
            }
        }

        for(var i in xcoordinate)
        {
            var info=new CoordinateInfo();
            info.Value=xcoordinate[i][0];
            if (this.ShowText)
                info.Message[0]=xcoordinate[i][3];
            this.Frame.VerticalInfo[i]=info;
        }
    }
}

function FrameSplitXData()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息

    this.Operator=function()
    {
        if (this.Frame.Data==null || this.Frame.XData==null) return;
        this.Frame.VerticalInfo=[];
        var xOffset=this.Frame.Data.DataOffset;
        var xPointCount=this.Frame.XPointCount;

        for(var i=0, index=xOffset; i<xPointCount && index<this.Frame.Data.Data.length ;++i,++index)
        {
            var info= new CoordinateInfo();
            info.Value=index-xOffset;
            
            if (this.ShowText)
                info.Message[0]=this.Frame.XData[i];

            this.Frame.VerticalInfo.push(info);
            distance=0;
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
//十字光标
function ChartCorssCursor()
{
    this.Frame;
    this.Canvas;                            //画布
    this.PenColor=g_JSChartResource.CorssCursorPenColor;        //十字线颜色
    this.Font=g_JSChartResource.CorssCursorTextFont;            //字体
    this.TextColor=g_JSChartResource.CorssCursorTextColor;      //文本颜色
    this.TextBGColor=g_JSChartResource.CorssCursorBGColor;      //文本背景色
    this.TextHeight=20;                     //文本字体高度
    this.LastPoint;

    this.PointX;
    this.PointY;

    this.StringFormatX;
    this.StringFormatY;

    this.IsShowText=true;   //是否显示十字光标刻度
    this.IsShow=true;

    this.Draw=function()
    {
        if (!this.LastPoint) return;

        var x=this.LastPoint.X;
        var y=this.LastPoint.Y;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);

        this.PointY=null;
        this.PointY==null;

        if (!isInClient) return;

        if (this.Frame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        var top=this.Frame.ChartBorder.GetTopEx();
        var bottom=this.Frame.ChartBorder.GetBottom();

        this.PointY=[[left,y],[right,y]];
        this.PointX=[[x,top],[x,bottom]];

        //十字线
        this.Canvas.save();
        this.Canvas.strokeStyle=this.PenColor;
        this.Canvas.setLineDash([3,2]);   //虚线
        //this.Canvas.lineWidth=0.5
        this.Canvas.beginPath();

        this.Canvas.moveTo(left,ToFixedPoint(y));
        this.Canvas.lineTo(right,ToFixedPoint(y));

        if (this.Frame.SubFrame.length>0)
        {
            for(var i in this.Frame.SubFrame)
            {
                var frame=this.Frame.SubFrame[i].Frame;
                top=frame.ChartBorder.GetTopEx();
                bottom=frame.ChartBorder.GetBottom();
                this.Canvas.moveTo(ToFixedPoint(x),top);
                this.Canvas.lineTo(ToFixedPoint(x),bottom);
            }
        }
        else
        {
            this.Canvas.moveTo(ToFixedPoint(x),top);
            this.Canvas.lineTo(ToFixedPoint(x),bottom);
        }

        this.Canvas.stroke();
        this.Canvas.restore();

        var xValue=this.Frame.GetXData(x);
        var yValue=this.Frame.GetYData(y);

        this.StringFormatX.Value=xValue;
        this.StringFormatY.Value=yValue;

        if (this.IsShowText && this.StringFormatY.Operator() && (this.Frame.ChartBorder.Left>=30 || this.Frame.ChartBorder.Right>=30))
        {
            var text=this.StringFormatY.Text;
            this.Canvas.font=this.Font;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素

            if (this.Frame.ChartBorder.Left>=30)
            {
                this.Canvas.fillStyle=this.TextBGColor;
                this.Canvas.fillRect(left-2,y-this.TextHeight/2,-textWidth,this.TextHeight);
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,left-4,y,textWidth);
            }

            if (this.Frame.ChartBorder.Right>=30)
            {
                this.Canvas.fillStyle=this.TextBGColor;
                this.Canvas.fillRect(right+2,y-this.TextHeight/2,textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,right+4,y,textWidth);
            }
        }

        if (this.IsShowText && this.StringFormatX.Operator())
        {
            var text=this.StringFormatX.Text;
            this.Canvas.font=this.Font;

            this.Canvas.fillStyle=this.TextBGColor;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素
            if (x-textWidth/2<3)    //左边位置不够了, 顶着左边画
            {
                this.Canvas.fillRect(x-1,bottom+2,textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,x+1,bottom+2,textWidth);
            }
            else if (x+textWidth/2>=right)
            {
                this.Canvas.fillRect(right-textWidth,bottom+2,textWidth,this.TextHeight);
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,right-2,bottom+2,textWidth);
            }
            else
            {
                this.Canvas.fillRect(x-textWidth/2,bottom+2,textWidth,this.TextHeight);
                this.Canvas.textAlign="center";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,x,bottom+2,textWidth);
            }
        }
    }

    this.HScreenDraw=function()
    {
        var x=this.LastPoint.X;
        var y=this.LastPoint.Y;

        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRightEx();
        var top=this.Frame.ChartBorder.GetTop();
        var bottom=this.Frame.ChartBorder.GetBottom();

        this.PointY=[[left,y],[right,y]];
        this.PointX=[[x,top],[x,bottom]];

        //十字线
        this.Canvas.save();
        this.Canvas.strokeStyle=this.PenColor;
        this.Canvas.setLineDash([3,2]);   //虚线
        //this.Canvas.lineWidth=0.5
        this.Canvas.beginPath();

        //画竖线
        this.Canvas.moveTo(ToFixedPoint(x),top);
        this.Canvas.lineTo(ToFixedPoint(x),bottom);

        //画横线
        if (this.Frame.SubFrame.length>0)
        {
            for(var i in this.Frame.SubFrame)
            {
                var frame=this.Frame.SubFrame[i].Frame;
                this.Canvas.moveTo(frame.ChartBorder.GetLeft(),ToFixedPoint(y));
                this.Canvas.lineTo(frame.ChartBorder.GetRightEx(),ToFixedPoint(y));
            }
        }
        else
        {
            this.Canvas.moveTo(left,ToFixedPoint(y));
            this.Canvas.lineTo(right,ToFixedPoint(y));
        }

        this.Canvas.stroke();
        this.Canvas.restore();

        var xValue=this.Frame.GetXData(y);
        var yValue=this.Frame.GetYData(x);

        this.StringFormatX.Value=xValue;
        this.StringFormatY.Value=yValue;

        if (this.IsShowText && this.StringFormatY.Operator() && (this.Frame.ChartBorder.Left>=30 || this.Frame.ChartBorder.Right>=30))
        {
            var text=this.StringFormatY.Text;
            this.Canvas.font=this.Font;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素

            if (this.Frame.ChartBorder.Top>=30)
            {
                var xText=x;
                var yText=top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                
                this.Canvas.fillStyle=this.TextBGColor;
                this.Canvas.fillRect(0,-(this.TextHeight/2),-textWidth,this.TextHeight);
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,-2,-(this.TextHeight/2),textWidth);

                this.Canvas.restore();
            }

            if (this.Frame.ChartBorder.Bottom>=30)
            {
                var xText=x;
                var yText=bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                
                this.Canvas.fillStyle=this.TextBGColor;
                this.Canvas.fillRect(0,-(this.TextHeight/2),textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,2,-(this.TextHeight/2),textWidth);

                this.Canvas.restore();
            }
        }

        if (this.IsShowText && this.StringFormatX.Operator())
        {
            var text=this.StringFormatX.Text;
            this.Canvas.font=this.Font;

            this.Canvas.fillStyle=this.TextBGColor;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素
            if (y-textWidth/2<3)    //左边位置不够了, 顶着左边画
            {
                var xText=left;
                var yText=y;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(0,0,textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,2,0,textWidth);

                this.Canvas.restore();
            }
            else
            {
                var xText=left;
                var yText=y;

                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(-textWidth/2,0,textWidth,this.TextHeight);
                this.Canvas.textAlign="center";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,0,0,textWidth);

                this.Canvas.restore();
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
// 等待提示
function ChartSplashPaint()
{
    this.Frame;
    this.Canvas;                            //画布
    this.Font=g_JSChartResource.DefaultTextFont;            //字体
    this.TextColor=g_JSChartResource.DefaultTextColor;      //文本颜色
    this.IsEnableSplash=false;
    this.SplashTitle='数据加载中';

    this.Draw=function()
    {
        if (!this.IsEnableSplash) return;

        if (this.Frame.IsHScreen===true)
        {
            this.HScreenDraw();
            return;
        }

        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.font=this.Font;
        this.Canvas.fillText(this.SplashTitle,xCenter,yCenter);
    }

    this.HScreenDraw=function() //横屏
    {
        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;

        this.Canvas.save();
        this.Canvas.translate(xCenter, yCenter);
        this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.font=this.Font;
        this.Canvas.fillText(this.SplashTitle,0,0);

        this.Canvas.restore();
    }
}

/////////////////////////////////////////////////////////////////////////////////
//
function IChangeStringFormat()
{
    this.Data;
    this.Value;     //数据
    this.Text;      //输出字符串

    this.Operator=function()
    {
        return false;
    }
}


function HQPriceStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;

        this.Text=IFrameSplitOperator.FormatValueString(this.Value,2);
        return true;
    }
}

function HQDateStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;
        if (!this.Data) return false;

        var index=Math.abs(this.Value-0.5);
        index=parseInt(index.toFixed(0));
        if (this.Data.DataOffset+index>=this.Data.Data.length) return false;
        var currentData = this.Data.Data[this.Data.DataOffset+index];
        this.Text=IFrameSplitOperator.FormatDateString(currentData.Date);
        if (this.Data.Period >= 4) // 分钟周期
        {
            var time = IFrameSplitOperator.FormatTimeString(currentData.Time);
            this.Text = this.Text + "  " + time;
        }

        return true;
    }
}

function HQMinuteTimeStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;

        var index=Math.abs(this.Value);
        index=parseInt(index.toFixed(0));

        if(index == 0)
        {
            this.Text="9:25";
        }
        else if(index<122)
        {
            var time=9*60+30+index-1;
            var minute=time%60;
            if (minute<10) this.Text= parseInt(time/60)+":"+'0'+minute;
            else this.Text= parseInt(time/60)+":"+minute;
        }
        else if(index<243)
        {
            var time=13*60+index-(122);
            var minute=time%60;
            if (minute<10) this.Text= parseInt(time/60)+":"+'0'+minute;
            else this.Text= parseInt(time/60)+":"+minute;
        }
        else
        {
            this.Text="15:00";
        }

        return true;
    }
}


//行情tooltip提示信息格式
var WEEK_NAME=["日","一","二","三","四","五","六"];
function HistoryDataStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

    this.VolColor=g_JSChartResource.DefaultTextColor;
    this.AmountColor=g_JSChartResource.DefaultTextColor;

    this.Operator=function()
    {
        var data=this.Value.Data;
        if (!data) return false;

        var date=new Date(parseInt(data.Date/10000),(data.Date/100%100-1),data.Date%100);
        var title2=WEEK_NAME[date.getDay()];
        if (this.Value.ChartPaint.Data.Period >= 4) // 分钟周期
        {
            var hour=parseInt(data.Time/100);
            var minute=data.Time%100;
            var strHour=hour>=10?hour.toString():"0"+hour.toString();
            var strMinute=minute>=10?minute.toString():"0"+minute.toString();
            title2 = strHour + ":" + strMinute;
        }
        var strText=
            "<span class='tooltip-title'>"+data.Date+"&nbsp&nbsp"+title2+"</span>"+
            "<span class='tooltip-con'>开盘:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Open,data.YClose)+";'>"+data.Open.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>最高:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.High,data.YClose)+";'>"+data.High.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>最低:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Low,data.YClose)+";'>"+data.Low.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>收盘:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Close,data.YClose)+";'>"+data.Close.toFixed(2)+"</span><br/>"+
            //"<span style='color:"+this.YClose+";font:微软雅黑;font-size:12px'>&nbsp;前收: "+IFrameSplitOperator.FormatValueString(data.YClose,2)+"</span><br/>"+
            "<span class='tooltip-con'>数量:</span>"+
            "<span class='tooltip-num' style='color:"+this.VolColor+";'>"+IFrameSplitOperator.FormatValueString(data.Vol,2)+"</span><br/>"+
            "<span class='tooltip-con'>金额:</span>"+
            "<span class='tooltip-num' style='color:"+this.AmountColor+";'>"+IFrameSplitOperator.FormatValueString(data.Amount,2)+"</span><br/>";

        //叠加股票
        if (this.Value.ChartPaint.Name=="Overlay-KLine")
        {
            var title="<span style='color:rgb(0,0,0);font:微软雅黑;font-size:12px;text-align:center;display: block;'>"+this.Value.ChartPaint.Title+"</span>";
            strText=title+strText;
        }

        this.Text=strText;
        return true;
    }

    this.GetColor=function(price,yclse)
    {
        if(price>yclse) return this.UpColor;
        else if (price<yclse) return this.DownColor;
        else return this.UnchagneColor;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                      标题
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function IChartTitlePainting()
{
    this.Frame;
    this.Data=new Array();
    this.Canvas;                        //画布
    this.IsDynamic=false;               //是否是动态标题
    this.Position=0;                    //标题显示位置 0 框架里的标题  1 框架上面
    this.CursorIndex;                   //数据索引
    this.Font=g_JSChartResource.TitleFont;
    this.Title;                         //固定标题(可以为空)
    this.TitleColor=g_JSChartResource.DefaultTextColor;
}

var PERIOD_NAME=["日线","周线","月线","年线","1分","5分","15分","30分","60分","",""];
var RIGHT_NAME=['不复权','前复权','后复权'];

function DynamicKLineTitlePainting()
{
    this.newMethod=IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic=true;
    this.IsShow=true;       //是否显示

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

    this.VolColor=g_JSChartResource.DefaultTextColor;
    this.AmountColor=g_JSChartResource.DefaultTextColor;

    this.Symbol;
    this.Name;

    this.IsShowName=true;           //是否显示股票名称
    this.IsShowSettingInfo=true;    //是否显示设置信息(周期 复权)
    this.IsShowDateTime=true;       //是否显示日期

    this.Draw=function()
    {
        if (!this.IsShow) return;
        if (this.CursorIndex==null || !this.Data) return;
        if (this.Data.length<=0) return;

        if (this.Frame.IsHScreen===true)
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var dataIndex=this.Data.DataOffset+index;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;
        if (dataIndex<0) return;

        var item=this.Data.Data[dataIndex];

        var left=this.Frame.ChartBorder.GetLeft();
        //var bottom=this.Frame.ChartBorder.GetTop()-this.Frame.ChartBorder.Top/2;
        var bottom=this.Frame.ChartBorder.GetTop();
        var right=this.Frame.ChartBorder.GetRight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="ideographic";
        this.Canvas.font=this.Font;

        if (this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.IsShowSettingInfo)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var periodName=PERIOD_NAME[this.Data.Period];
            var rightName=RIGHT_NAME[this.Data.Right];
            var text="("+periodName+" "+rightName+")";
            if(item.Time!=null)  text="("+periodName+")";           //分钟K线没有复权
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.IsShowDateTime)    //是否显示日期
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var text=IFrameSplitOperator.FormatDateString(item.Date);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if(item.Time!=null && !isNaN(item.Time) && item.Time>0)
        {
            var text=IFrameSplitOperator.FormatTimeString(item.Time);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.GetColor(item.Open,item.YClose);
        var text="开:"+item.Open.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.High,item.YClose);
        var text="高:"+item.High.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Low,item.YClose);
        var text="低:"+item.Low.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Close,item.YClose);
        var text="收:"+item.Close.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }

    this.HScreenDraw=function()
    {
        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var dataIndex=this.Data.DataOffset+index;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;
        if (dataIndex<0) return;

        var item=this.Data.Data[dataIndex];

        var right=this.Frame.ChartBorder.GetHeight();

        var xText=this.Frame.ChartBorder.GetRight();
        var yText=this.Frame.ChartBorder.GetTop();
        
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="ideographic";
        this.Canvas.font=this.Font;

        var left=2;
        var bottom=-2;
        if (this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.IsShowSettingInfo)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var periodName=PERIOD_NAME[this.Data.Period];
            var rightName=RIGHT_NAME[this.Data.Right];
            var text="("+periodName+" "+rightName+")";
            if(item.Time!=null)  text="("+periodName+")";           //分钟K线没有复权
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.UnchagneColor;
        var text=IFrameSplitOperator.FormatDateString(item.Date);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        if(item.Time!=null && !isNaN(item.Time) && item.Time>0)
        {
            var text=IFrameSplitOperator.FormatTimeString(item.Time);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.GetColor(item.Open,item.YClose);
        var text="开:"+item.Open.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.High,item.YClose);
        var text="高:"+item.High.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Low,item.YClose);
        var text="低:"+item.Low.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Close,item.YClose);
        var text="收:"+item.Close.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }

    this.GetColor=function(price,yclse)
    {
        if(price>yclse) return this.UpColor;
        else if (price<yclse) return this.DownColor;
        else return this.UnchagneColor;
    }

}

function DynamicMinuteTitlePainting()
{
    this.newMethod=DynamicKLineTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;
    this.IsShowDate=false;  //标题是否显示日期
    this.IsShowName=true;   //标题是否显示股票名字

    this.Draw=function()
    {
        if (!this.IsShow) return;
        if (this.CursorIndex==null || !this.Data || !this.Data.Data) return;
        if (this.Data.Data.length<=0) return;

        if (this.Frame.IsHScreen===true)
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        //var index=Math.abs(this.CursorIndex-0.5);
        var index=this.CursorIndex;
        index=parseInt(index.toFixed(0));
        var dataIndex=index+this.Data.DataOffset;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;

        var item=this.Data.Data[dataIndex];

        var left=this.Frame.ChartBorder.GetLeft();
        var bottom=this.Frame.ChartBorder.GetTop()-this.Frame.ChartBorder.Top/2;
        var right=this.Frame.ChartBorder.GetRight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="middle";
        this.Canvas.font=this.Font;

        if(this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.UnchagneColor;
        var text=IFrameSplitOperator.FormatDateTimeString(item.DateTime,this.IsShowDate);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        if (item.Close!=null)
        {
            this.Canvas.fillStyle=this.GetColor(item.Close,this.YClose);
            var text="价格:"+item.Close.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (item.AvPrice!=null)
        {
            this.Canvas.fillStyle=this.GetColor(item.AvPrice,this.YClose);
            var text="均价:"+item.AvPrice.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }

    this.HScreenDraw=function()
    {
        var xText=this.Frame.ChartBorder.GetRight();
        var yText=this.Frame.ChartBorder.GetTop();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        var index=this.CursorIndex;
        index=parseInt(index.toFixed(0));
        var dataIndex=index+this.Data.DataOffset;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;

        var item=this.Data.Data[dataIndex];

        var left=2;
        var bottom=-2;    //上下居中显示
        var right=this.Frame.ChartBorder.GetHeight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        this.Canvas.font=this.Font;

        if(this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.UnchagneColor;
        var text=IFrameSplitOperator.FormatDateTimeString(item.DateTime,this.IsShowDate);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        if (item.Close!=null)
        {
            this.Canvas.fillStyle=this.GetColor(item.Close,this.YClose);
            var text="价格:"+item.Close.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (item.AvPrice!=null)
        {
            this.Canvas.fillStyle=this.GetColor(item.AvPrice,this.YClose);
            var text="均价:"+item.AvPrice.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }
}

//字符串输出格式
var STRING_FORMAT_TYPE =
{
    DEFAULT: 1,     //默认 2位小数 单位自动转化 (万 亿)
    THOUSANDS:21,   //千分位分割
};

function DynamicTitleData(data,name,color)
{
    this.Data=data;
    this.Name=name;
    this.Color=color;   //字体颜色
    this.DataType;      //数据类型
    this.StringFormat=STRING_FORMAT_TYPE.DEFAULT;   //字符串格式
    this.FloatPrecision=2;                          //小数位数
}

function DynamicChartTitlePainting()
{
    this.newMethod=IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic=true;
    this.Data=new Array();
    this.Explain;

    this.FormatValue=function(value,item)
    {
        if (item.StringFormat==STRING_FORMAT_TYPE.DEFAULT)
            return IFrameSplitOperator.FormatValueString(value,item.FloatPrecision);
        else if (item.StringFormat=STRING_FORMAT_TYPE.THOUSANDS)
            return IFrameSplitOperator.FormatValueThousandsString(value,item.FloatPrecision);
    }

    this.FormatMultiReport=function(data,format)
    {
        var text="";
        for(var i in data)
        {
            var item = data[i];
            let quarter=item.Quarter;
            let year=item.Year;
            let value=item.Value;

            if (text.length>0) text+=',';

            text+=year.toString();
            switch(quarter)
            {
                case 1:
                    text+='一季报 ';
                    break;
                case 2:
                    text+='半年报 ';
                    break;
                case 3:
                    text+='三季报 ';
                    break;
                case 4:
                    text+='年报 ';
                    break;
            }

            text+=this.FormatValue(value,format);
        }

        return text;
    }

    this.Draw=function()
    {
        if (this.CursorIndex==null ) return;
        if (!this.Data) return;
        if (this.Frame.ChartBorder.TitleHeight<5) return;

        if (this.Frame.IsHScreen===true)
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        var left=this.Frame.ChartBorder.GetLeft()+1;
        var bottom=this.Frame.ChartBorder.GetTop()+this.Frame.ChartBorder.TitleHeight/2;    //上下居中显示
        var right=this.Frame.ChartBorder.GetRight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="middle";
        this.Canvas.font=this.Font;

        if (this.Title)
        {
            this.Canvas.fillStyle=this.TitleColor;
            var textWidth=this.Canvas.measureText(this.Title).width+2;
            this.Canvas.fillText(this.Title,left,bottom,textWidth);
            left+=textWidth;
        }

        for(var i in this.Data)
        {
            var item=this.Data[i];
            if (!item || !item.Data || !item.Data.Data || !item.Name) continue;

            if (item.Data.Data.length<=0) continue;

            var value=null;
            var valueText=null;
            if (item.DataType=="StraightLine")  //直线只有1个数据
            {
                value=item.Data.Data[0];
                valueText=this.FormatValue(value,item);
            }
            else
            {
                var index=Math.abs(this.CursorIndex-0.5);
                index=parseInt(index.toFixed(0));
                if (item.Data.DataOffset+index>=item.Data.Data.length) continue;

                value=item.Data.Data[item.Data.DataOffset+index];
                if (value==null) continue;

                if (item.DataType=="HistoryData-Vol")
                {
                    value=value.Vol;
                    valueText=this.FormatValue(value,item);
                }
                else if (item.DataType=="MultiReport")
                {
                    valueText=this.FormatMultiReport(value,item);
                }
                else
                {
                    valueText=this.FormatValue(value,item);
                }
            }

            this.Canvas.fillStyle=item.Color;

            var text=item.Name+":"+valueText;
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.Explain)   //说明信息
        {
            this.Canvas.fillStyle=this.TitleColor;
            var text="说明:"+this.Explain;
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth<right)
            {
                this.Canvas.fillText(text,left,bottom,textWidth);
                left+=textWidth;
            }
        }
    }

    this.HScreenDraw=function()
    {
        var xText=this.Frame.ChartBorder.GetRightEx();
        var yText=this.Frame.ChartBorder.GetTop();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        var left=1;
        var bottom=-this.Frame.ChartBorder.TitleHeight/2;    //上下居中显示
        var right=this.Frame.ChartBorder.GetHeight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="middle";
        this.Canvas.font=this.Font;

        if (this.Title)
        {
            this.Canvas.fillStyle=this.TitleColor;
            var textWidth=this.Canvas.measureText(this.Title).width+2;
            this.Canvas.fillText(this.Title,left,bottom,textWidth);
            left+=textWidth;
        }

        for(var i in this.Data)
        {
            var item=this.Data[i];
            if (!item || !item.Data || !item.Data.Data || !item.Name) continue;

            if (item.Data.Data.length<=0) continue;

            var value=null;
            var valueText=null;
            if (item.DataType=="StraightLine")  //直线只有1个数据
            {
                value=item.Data.Data[0];
                valueText=this.FormatValue(value,item);
            }
            else
            {
                var index=Math.abs(this.CursorIndex-0.5);
                index=parseInt(index.toFixed(0));
                if (item.Data.DataOffset+index>=item.Data.Data.length) continue;

                value=item.Data.Data[item.Data.DataOffset+index];
                if (value==null) continue;

                if (item.DataType=="HistoryData-Vol")
                {
                    value=value.Vol;
                    valueText=this.FormatValue(value,item);
                }
                else if (item.DataType=="MultiReport")
                {
                    valueText=this.FormatMultiReport(value,item);
                }
                else
                {
                    valueText=this.FormatValue(value,item);
                }
            }

            this.Canvas.fillStyle=item.Color;

            var text=item.Name+":"+valueText;
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.Explain)   //说明信息
        {
            this.Canvas.fillStyle=this.TitleColor;
            var text="说明:"+this.Explain;
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth<right)
            {
                this.Canvas.fillText(text,left,bottom,textWidth);
                left+=textWidth;
            }
        }
    }
}


/*
    画图工具
*/
function IChartDrawPicture()
{
    this.Frame;
    this.Canvas;
    this.Point=new Array()                      //画图的点
    this.Value=new Array();                     //XValue,YValue
    this.PointCount=2;                          //画点的个数
    this.Status=0;                              //0 开始画 1 完成第1个点  2 完成第2个点    10 完成 20 移动
    this.MovePointIndex=null;                        //移动哪个点 0-10 对应Point索引  100 整体移动

    this.LineColor=g_JSChartResource.DrawPicture.LineColor[0];                            //线段颜色
    this.PointColor=g_JSChartResource.DrawPicture.PointColor[0];

    this.Draw=function()
    {

    }

    //Point => Value
    this.PointToValue=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        for(var i in this.Point)
        {
            var item=this.Point[i];
            var xValue=parseInt(this.Frame.GetXData(item.X))+data.DataOffset;
            var yValue=this.Frame.GetYData(item.Y);

            this.Value[i]={};
            this.Value[i].XValue=xValue;
            this.Value[i].YValue=yValue;
        }

        return true;
    }

    this.IsPointIn=function(x,y)
    {
        return false;
    }

    //Value => Point
    this.ValueToPoint=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        this.Point=[];
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);
            this.Point[i]=pt;
        }
    }

    //xStep,yStep 移动的偏移量
    this.Move=function(xStep,yStep)
    {
        if (this.Status!=20) return fasle;
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        if (this.MovePointIndex==100)    //整体移动
        {
            for(var i in this.Point)
            {
                this.Point[i].X+=xStep;
                this.Point[i].Y+=yStep;
            }
        }
        else if (this.MovePointIndex==0 || this.MovePointIndex==1)
        {
            this.Point[this.MovePointIndex].X+=xStep;
            this.Point[this.MovePointIndex].Y+=yStep;
        }
    }

    this.ClipFrame=function()
    {
        var left=this.Frame.ChartBorder.GetLeft();
        var top=this.Frame.ChartBorder.GetTopEx();
        var width=this.Frame.ChartBorder.GetWidth();
        var height=this.Frame.ChartBorder.GetHeightEx();

        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(left,top,width,height);
        this.Canvas.clip();
    }

    //计算需要画的点的坐标
    this.CalculateDrawPoint=function()
    {
        if (this.Status<2) return null;
        if(!this.Point.length || !this.Frame) return null;

        var drawPoint=new Array();
        if (this.Status==10)
        {
            var data=this.Frame.Data;
            if (!data) return null;

            for(var i in this.Value)
            {
                var item=this.Value[i];
                var pt=new Point();
                pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
                pt.Y=this.Frame.GetYFromData(item.YValue);
                drawPoint.push(pt);
            }
        }
        else
        {
            drawPoint=this.Point;
        }

        return drawPoint;
    }

    this.DrawPoint=function(aryPoint)
    {
        if (!aryPoint || aryPoint.length<=0) return;

        //画点
        this.ClipFrame();
        for(var i in aryPoint)
        {
            var item=aryPoint[i];

            this.Canvas.beginPath();
            this.Canvas.arc(item.X,item.Y,5,0,360,false);
            this.Canvas.fillStyle=this.PointColor;      //填充颜色
            this.Canvas.fill();                         //画实心圆
            this.Canvas.closePath();
        }

        this.Canvas.restore();
    }
}

/*
    画图工具-线段
*/

function ChartDrawPictureLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint) return;

        this.ClipFrame();

        for(var i in drawPoint)
        {
            var item=drawPoint[i];
            if (i==0)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(item.X,item.Y);
            }
            else
            {
                this.Canvas.lineTo(item.X,item.Y);
            }

        }

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }


    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在线段上
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return 100;

        return -1;
    }
}

/*
    画图工具-射线
*/
function ChartDrawPictureHaflLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        this.Canvas.beginPath();
        this.Canvas.moveTo(drawPoint[0].X,drawPoint[0].Y);
        this.Canvas.lineTo(drawPoint[1].X,drawPoint[1].Y);

        var endPoint=this.CalculateEndPoint(drawPoint);
        this.Canvas.lineTo(endPoint.X,endPoint.Y);

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    this.CalculateEndPoint=function(aryPoint)
    {
        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();

        var a=aryPoint[1].X-aryPoint[0].X;
        var b=aryPoint[1].Y-aryPoint[0].Y;

        if (a>0)
        {
            var a1=right-aryPoint[0].X;
            var b1=a1*b/a;
            var y=b1+aryPoint[0].Y;

            var pt=new Point();
            pt.X=right;
            pt.Y=y;
            return pt;
        }
        else
        {
            var a1=aryPoint[0].X-left;
            var b1=a1*b/Math.abs(a);
            var y=b1+aryPoint[0].Y;

            var pt=new Point();
            pt.X=left;
            pt.Y=y;
            return pt;
        }
    }


    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在线段上
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return 100;

        return -1;
    }
}

/*
    画图工具-矩形
*/
function ChartDrawPictureRect()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        this.Canvas.beginPath();
        this.Canvas.rect(drawPoint[0].X,drawPoint[0].Y,drawPoint[1].X-drawPoint[0].X,drawPoint[1].Y-drawPoint[0].Y);

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在矩形边框上
        var linePoint=[ {X:aryPoint[0].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[0].Y}];
        if (this.IsPointInLine(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[1].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[1].Y}];
        if (this.IsPointInLine2(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[1].X,Y:aryPoint[1].Y},{X:aryPoint[0].X,Y:aryPoint[1].Y}];
        if (this.IsPointInLine(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[0].X,Y:aryPoint[1].Y},{X:aryPoint[0].X,Y:aryPoint[0].Y}];
        if (this.IsPointInLine2(linePoint,x,y))
            return 100;

        return -1;
    }

    //点是否在线段上 水平线段
    this.IsPointInLine=function(aryPoint,x,y)
    {
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return true;
    }

    //垂直线段
    this.IsPointInLine2=function(aryPoint,x,y)
    {
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X-5,aryPoint[0].Y);
        this.Canvas.lineTo(aryPoint[0].X+5,aryPoint[0].Y);
        this.Canvas.lineTo(aryPoint[1].X+5,aryPoint[1].Y);
        this.Canvas.lineTo(aryPoint[1].X-5,aryPoint[1].Y);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return true;
    }
}

/*
    画图工具-弧形
*/
function ChartDrawPictureArc()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        //this.Canvas.beginPath();
        //this.Canvas.rect(drawPoint[0].X,drawPoint[0].Y,drawPoint[1].X-drawPoint[0].X,drawPoint[1].Y-drawPoint[0].Y);
        if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第一象限
        {
            var a = drawPoint[1].X - drawPoint[0].X;
            var b = drawPoint[0].Y - drawPoint[1].Y;
            var step = (a > b) ? 1/a : 1 / b;
            var xcenter = drawPoint[0].X;
            var ycenter = drawPoint[1].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 1.5*Math.PI; i < 2*Math.PI; i+=step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter+b*Math.sin(i)*-1);
            }
            for (var j = 0; j <= 0.5*Math.PI; j += step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(j), ycenter+b*Math.sin(j)*-1);
            }
        }
        else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第二象限
        {
            var a = drawPoint[0].X - drawPoint[1].X;
            var b = drawPoint[0].Y - drawPoint[1].Y;
            var step = (a > b) ? 1/a:1/b;
            var xcenter = drawPoint[1].X;
            var ycenter = drawPoint[0].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 0; i <= Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }
        else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第三象限
        {
            var a = drawPoint[0].X - drawPoint[1].X;
            var b = drawPoint[1].Y - drawPoint[0].Y;
            var step = (a > b) ? 1/a:1/b;
            var xcenter = drawPoint[0].X;
            var ycenter = drawPoint[1].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 0.5*Math.PI; i <= 1.5*Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }
        else if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第四象限
        {
            var a = drawPoint[1].X - drawPoint[0].X;
            var b = drawPoint[1].Y - drawPoint[0].Y;
            var step = (a > b) ? 1/a : 1/b;
            var xcenter = drawPoint[1].X;
            var ycenter = drawPoint[0].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = Math.PI; i <= 2*Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }


        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        //this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在弧线上
        var ArcPoint=[ {X:aryPoint[0].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[1].Y}];
        if (this.IsPointInArc(ArcPoint, x, y))
            return 100;

        return -1;
    }
    this.IsPointInArc=function(aryPoint,x,y)
    {
        if (aryPoint.length != 2)
         return false;
        if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第一象限
        {
             var a = aryPoint[1].X - aryPoint[0].X;
             var b = aryPoint[0].Y - aryPoint[1].Y;
             var step = (a > b) ? 1/a : 1 / b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[0].X;
             var ycenter = aryPoint[1].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 1.5*Math.PI; i < 2*Math.PI; i+=step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter+b*Math.sin(i)*-1);
             }
             for (var j = 0; j <= 0.5*Math.PI; j += step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(j), ycenter+b*Math.sin(j)*-1);
             }
             for (var k = 0.5*Math.PI; k >= 0; k -= stepiner)
             {
                 this.Canvas.lineTo(xcenter+ainer*Math.cos(k), ycenter + biner*Math.sin(j)*-1);
             }
             for (var l = 2*Math.PI; l >= 1.5*Math.PI; l -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer*Math.cos(l), ycenter + biner*Math.sin(l)*-1);
             }
             this.Canvas.closePath();
        }
         else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第二象限
         {
             var a = aryPoint[0].X - aryPoint[1].X;
             var b = aryPoint[0].Y - aryPoint[1].Y;
             var step = (a > b) ? 1/a:1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
             var xcenter = aryPoint[1].X;
             var ycenter = aryPoint[0].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 0; i <= Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = Math.PI; j >= 0; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第三象限
         {
             var a = aryPoint[0].X - aryPoint[1].X;
             var b = aryPoint[1].Y - aryPoint[0].Y;
             var step = (a > b) ? 1/a:1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[0].X;
             var ycenter = aryPoint[1].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 0.5*Math.PI; i <= 1.5*Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = 1.5*Math.PI; j >= 0.5*Math.PI; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         else if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第四象限
         {
             var a = aryPoint[1].X - aryPoint[0].X;
             var b = aryPoint[1].Y - aryPoint[0].Y;
             var step = (a > b) ? 1/a : 1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[1].X;
             var ycenter = aryPoint[0].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = Math.PI; i <= 2*Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = 2*Math.PI; j >= Math.PI; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer*Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         if (this.Canvas.isPointInPath(x,y))
            return true;
         else
            return false;

    }

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  数据分割
//  [0]=Start起始 [1]=End结束 [2]=FixInterval修正的间隔 [3]=Increase
//
function SplitData()
{
    this.Data=[
        [0.000001,	0.000002,	0.000001,	0.0000001],
        [0.000002,	0.000004,	0.000002,	0.0000002],
        [0.000004,	0.000005,	0.000004,	0.0000001],
        [0.000005,	0.00001,	0.000005,	0.0000005],

        [0.00001,	0.00002,	0.00001,	0.000001],
        [0.00002,	0.00004,	0.00002,	0.000002],
        [0.00004,	0.00005,	0.00004,	0.000001],
        [0.00005,	0.0001,		0.00005,	0.000005],

        [0.0001,		0.0002,		0.0001,	0.00001],
        [0.0002,		0.0004,		0.0002,	0.00002],
        [0.0004,		0.0005,		0.0004,	0.00001],
        [0.0005,		0.001,		0.0005,	0.00005],

        [0.001,		0.002,		0.001,	0.0001],
        [0.002,		0.004,		0.002,	0.0002],
        [0.004,		0.005,		0.004,	0.0001],
        [0.005,		0.01,		0.005,	0.0005],

        [0.01,		0.02,		0.01,	0.001],
        [0.02,		0.04,		0.02,	0.002],
        [0.04,		0.05,		0.04,	0.001],
        [0.05,		0.1,		0.05,	0.005],

        [0.1,		0.2,		0.1,	0.01],
        [0.2,		0.4,		0.2,	0.02],
        [0.4,		0.5,		0.4,	0.01],
        [0.5,		1,			0.5,	0.05],

        [1,		2,		1,	0.05],
        [2,		4,		2,	0.05],
        [4,		5,		4,	0.05],
        [5,		10,		5,	0.05],

        [10,		12,		10,	2],
        [20,		40,		20,	5],
        [40,		50,		40,	2],
        [50,		100,	50,	10],

        [100,		200,		100,	10],
        [200,		400,		200,	20],
        [400,		500,		400,	10],
        [500,		1000,		500,	50],

        [1000,		2000,		1000,	50],
        [2000,		4000,		2000,	50],
        [4000,		5000,		4000,	50],
        [5000,		10000,		5000,	100],

        [10000,		20000,		10000,	1000],
        [20000,		40000,		20000,	2000],
        [40000,		50000,		40000,	1000],
        [50000,		100000,		50000,	5000],

        [100000,		200000,		100000,	10000],
        [200000,		400000,		200000,	20000],
        [400000,		500000,		400000,	10000],
        [500000,		1000000,	500000,	50000],

        [1000000,		2000000,		1000000,	100000],
        [2000000,		4000000,		2000000,	200000],
        [4000000,		5000000,		4000000,	100000],
        [5000000,		10000000,		5000000,	500000],

        [10000000,		20000000,		10000000,	1000000],
        [20000000,		40000000,		20000000,	2000000],
        [40000000,		50000000,		40000000,	1000000],
        [50000000,		100000000,		50000000,	5000000],

        [100000000,		200000000,		100000000,	10000000],
        [200000000,		400000000,		200000000,	20000000],
        [400000000,		500000000,		400000000,	10000000],
        [500000000,		1000000000,		500000000,	50000000],

        [1000000000,		2000000000,		1000000000,	100000000],
        [2000000000,		4000000000,		2000000000,	200000000],
        [4000000000,		5000000000,		4000000000,	100000000],
        [5000000000,		10000000000,	5000000000,	500000000]
    ];

    this.Find=function(interval)
    {
        for(var i in this.Data)
        {
            var item =this.Data[i];
            if (interval>item[0] && interval<=item[1])
            {
                var result={};
                result.FixInterval=item[2];
                result.Increase=item[3];
                return result;
            }
        }

        return null;
    }
}

function PriceSplitData()
{
    this.newMethod=SplitData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Data=[
        [0.000001,	0.000002,	0.000001,	0.0000001],
        [0.000002,	0.000004,	0.000002,	0.0000002],
        [0.000004,	0.000005,	0.000004,	0.0000001],
        [0.000005,	0.00001,	0.000005,	0.0000005],

        [0.00001,	0.00002,	0.00001,	0.000001],
        [0.00002,	0.00004,	0.00002,	0.000002],
        [0.00004,	0.00005,	0.00004,	0.000001],
        [0.00005,	0.0001,		0.00005,	0.000005],

        [0.0001,		0.0002,		0.0001,	0.00001],
        [0.0002,		0.0004,		0.0002,	0.00002],
        [0.0004,		0.0005,		0.0004,	0.00001],
        [0.0005,		0.001,		0.0005,	0.00005],

        [0.001,		0.002,		0.001,	0.0001],
        [0.002,		0.004,		0.002,	0.0002],
        [0.004,		0.005,		0.004,	0.0001],
        [0.005,		0.01,		0.005,	0.0005],

        [0.01,		0.02,		0.01,	0.001],
        [0.02,		0.04,		0.02,	0.002],
        [0.04,		0.05,		0.04,	0.001],
        [0.05,		0.1,		0.05,	0.005],

        [0.1,		0.2,		0.1,	0.01],
        [0.2,		0.4,		0.2,	0.02],
        [0.4,		0.5,		0.2,	0.01],
        [0.5,		0.8,		0.2,	0.05],
        [0.8,		1,			0.5,	0.05],

        [1,		2,		1,	0.05],
        [2,		4,		2,	0.05],
        [4,		5,		4,	0.05],
        [5,		10,		5,	0.05],

        [10,		12,		10,	2],
        [20,		40,		20,	5],
        [40,		50,		40,	2],
        [50,		100,	50,	10],

        [100,		200,		100,	10],
        [200,		400,		200,	20],
        [400,		500,		400,	10],
        [500,		1000,		500,	50],

        [1000,		2000,		1000,	50],
        [2000,		4000,		2000,	50],
        [4000,		5000,		4000,	50],
        [5000,		10000,		5000,	100],

        [10000,		20000,		10000,	1000],
        [20000,		40000,		20000,	2000],
        [40000,		50000,		40000,	1000],
        [50000,		100000,		50000,	5000],

        [100000,		200000,		100000,	10000],
        [200000,		400000,		200000,	20000],
        [400000,		500000,		400000,	10000],
        [500000,		1000000,	500000,	50000],

        [1000000,		2000000,		1000000,	100000],
        [2000000,		4000000,		2000000,	200000],
        [4000000,		5000000,		4000000,	100000],
        [5000000,		10000000,		5000000,	500000],

        [10000000,		20000000,		10000000,	1000000],
        [20000000,		40000000,		20000000,	2000000],
        [40000000,		50000000,		40000000,	1000000],
        [50000000,		100000000,		50000000,	5000000],

        [100000000,		200000000,		100000000,	10000000],
        [200000000,		400000000,		200000000,	20000000],
        [400000000,		500000000,		400000000,	10000000],
        [500000000,		1000000000,		500000000,	50000000],

        [1000000000,		2000000000,		1000000000,	100000000],
        [2000000000,		4000000000,		2000000000,	200000000],
        [4000000000,		5000000000,		4000000000,	100000000],
        [5000000000,		10000000000,	5000000000,	500000000]
    ];
}

/////////////////////////////////////////////////////////////////////////////
//   全局配置颜色
//
//
function JSChartResource()
{
    this.TooltipBGColor="rgb(255, 255, 255)"; //背景色
    this.TooltipAlpha=0.92;                  //透明度

    this.SelectRectBGColor="rgba(1,130,212,0.06)"; //背景色
 //   this.SelectRectAlpha=0.06;                  //透明度

    this.UpBarColor="rgb(238,21,21)";
    this.DownBarColor="rgb(25,158,0)";
    this.UnchagneBarColor="rgb(0,0,0)";

    this.Minute={};
    this.Minute.VolBarColor="rgb(238,127,9)";
    this.Minute.PriceColor="rgb(50,171,205)";
    this.Minute.AvPriceColor="rgb(238,127,9)";

    this.DefaultTextColor="rgb(43,54,69)";
    this.DefaultTextFont=14*GetDevicePixelRatio() +'px 微软雅黑';
    this.TitleFont=13*GetDevicePixelRatio() +'px 微软雅黑';

    this.UpTextColor="rgb(238,21,21)";
    this.DownTextColor="rgb(25,158,0)";
    this.UnchagneTextColor="rgb(0,0,0)";
    this.CloseLineColor='rgb(178,34,34)';

    this.FrameBorderPen="rgb(225,236,242)";
    this.FrameSplitPen="rgb(225,236,242)";      //分割线
    this.FrameSplitTextColor="rgb(117,125,129)";   //刻度文字颜色
    this.FrameSplitTextFont=14*GetDevicePixelRatio() +"px 微软雅黑";     //坐标刻度文字字体
    this.FrameTitleBGColor="rgb(246,251,253)";  //标题栏背景色

    this.CorssCursorBGColor="rgb(43,54,69)";            //十字光标背景
    this.CorssCursorTextColor="rgb(255,255,255)";
    this.CorssCursorTextFont=14*GetDevicePixelRatio() +"px 微软雅黑";
    this.CorssCursorPenColor="rgb(130,130,130)";           //十字光标线段颜色

    this.LockBGColor = "rgb(220, 220, 220)";
    this.LockTextColor = "rgb(210, 34, 34)";

    this.Domain="https://opensource.zealink.com";               //API域名
    this.CacheDomain="https://opensourcecache.zealink.com";     //缓存域名

    this.KLine={
            MaxMin: {Font:12*GetDevicePixelRatio() +'px 微软雅黑',Color:'rgb(43,54,69)'},   //K线最大最小值显示
            Info:  //信息地雷
            {
                Investor:
                {
                    ApiUrl:'https://opensource.zealink.com/API/NewsInteract', //互动易
                    Icon:'https://opensourcecache.zealink.com/cache/test/investor.png',
                },
                Announcement:                                           //公告
                {
                    ApiUrl:'https://opensource.zealink.com/API/ReportList',
                    Icon:'https://opensourcecache.zealink.com/cache/test/announcement.png',
                    IconQuarter:'https://opensourcecache.zealink.com/cache/test/announcement2.png',  //季报
                },
                Pforecast:  //业绩预告
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/pforecast.png',
                },
                Research:   //调研
                {
                    ApiUrl:'https://opensource.zealink.com/API/InvestorRelationsList',
                    Icon:'https://opensourcecache.zealink.com/cache/test/research.png',
                },
                BlockTrading:   //大宗交易
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/blocktrading.png',
                },
                TradeDetail:    //龙虎榜
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/tradedetail.png',
                }

            }
        };

    this.Index={};
    //指标线段颜色
    this.Index.LineColor=
    [
        "rgb(255,174,0)",
        "rgb(25,199,255)",
        "rgb(175,95,162)",
        "rgb(236,105,65)",
        "rgb(68,114,196)",
        "rgb(229,0,79)",
        "rgb(0,128,255)",
        "rgb(252,96,154)",
        "rgb(42,230,215)",
        "rgb(24,71,178)",

    ];

    //历史数据api
    this.Index.StockHistoryDayApiUrl="https://opensource.zealink.com/API/StockHistoryDay";
    //市场多空
    this.Index.MarketLongShortApiUrl="https://opensource.zealink.com/API/FactorTiming";
    //市场关注度
    this.Index.MarketAttentionApiUrl="https://opensource.zealink.com/API/MarketAttention";
    //行业,指数热度
    this.Index.MarketHeatApiUrl="https://opensource.zealink.com/API/MarketHeat";
    //自定义指数热度
    this.Index.CustomIndexHeatApiUrl="https://opensource.zealink.com/API/QuadrantCalculate";

    //指标不支持信息
    this.Index.NotSupport={Font:"14px 微软雅黑", TextColor:"rgb(52,52,52)"};

    //画图工具
    this.DrawPicture={};
    this.DrawPicture.LineColor=
    [
        "rgb(30,144,255)",
    ];

    this.DrawPicture.PointColor=
    [
        "rgb(105,105,105)",
    ];

    this.KLineTrain =
    {
        Font:'bold 14px arial',
        LastDataIcon: {Color:'rgb(0,0,205)',Text:'⬇'},
        BuyIcon: {Color:'rgb(0,205,102 )',Text:'B'},
        SellIcon: {Color:'rgb(255,127,36 )',Text:'S'}
    };

    //自定义风格
    this.SetStyle=function(style)
    {
        if (style.TooltipBGColor) this.TooltipBGColor = style.TooltipBGColor;
        if (style.TooltipAlpha) this.TooltipAlpha = style.TooltipAlpha;
        if (style.SelectRectBGColor) this.SelectRectBGColor = style.SelectRectBGColor;
        if (style.UpBarColor) this.UpBarColor = style.UpBarColor;
        if (style.DownBarColor) this.DownBarColor = style.DownBarColor;
        if (style.UnchagneBarColor) this.UnchagneBarColor = style.UnchagneBarColor;
        if (style.Minute) 
        {
            if (style.Minute.VolBarColor) this.Minute.VolBarColor = style.Minute.VolBarColor;
            if (style.Minute.PriceColor) this.Minute.PriceColor = style.Minute.PriceColor;
            if (style.Minute.AvPriceColor) this.Minute.AvPriceColor = style.Minute.AvPriceColor;
        }

        if (style.DefaultTextColor) this.DefaultTextColor = style.DefaultTextColor;
        if (style.DefaultTextFont) this.DefaultTextFont = style.DefaultTextFont;
        if (style.TitleFont) this.TitleFont = style.TitleFont;
        if (style.UpTextColor) this.UpTextColor = style.UpTextColor;
        if (style.DownTextColor) this.DownTextColor = style.DownTextColor;
        if (style.UnchagneTextColor) this.UnchagneTextColor = style.UnchagneTextColor;
        if (style.CloseLineColor) this.CloseLineColor = style.CloseLineColor;
        if (style.FrameBorderPen) this.FrameBorderPen = style.FrameBorderPen;
        if (style.FrameSplitPen) this.FrameSplitPen = style.FrameSplitPen;
        if (style.FrameSplitTextColor) this.FrameSplitTextColor = style.FrameSplitTextColor;
        if (style.FrameSplitTextFont) this.FrameSplitTextFont = style.FrameSplitTextFont;
        if (style.FrameTitleBGColor) this.FrameTitleBGColor = style.FrameTitleBGColor;
        if (style.CorssCursorBGColor) this.CorssCursorBGColor = style.CorssCursorBGColor;
        if (style.CorssCursorTextColor) this.CorssCursorTextColor = style.CorssCursorTextColor;
        if (style.CorssCursorTextFont) this.CorssCursorTextFont = style.CorssCursorTextFont;
        if (style.CorssCursorPenColor) this.CorssCursorPenColor = style.CorssCursorPenColor;
        if (style.KLine) this.KLine = style.KLine;

        if (style.Index) 
        {
            if (style.Index.LineColor) this.Index.LineColor = style.Index.LineColor;
            if (style.Index.NotSupport) this.Index.NotSupport = style.Index.NotSupport;
        }
        
        if (style.ColorArray) this.ColorArray = style.ColorArray;

        if (style.DrawPicture)
        {
            this.DrawPicture.LineColor = style.DrawPicture.LineColor;
            this.DrawPicture.PointColor = style.DrawPicture.PointColor;
        }
    }
}

var g_JSChartResource=new JSChartResource();



/*
    指标列表 指标信息都在这里,不够后面再加字段
*/
function JSIndexMap()
{

}

JSIndexMap.Get=function(id)
{
    var indexMap=new Map(
    [
        //公司自己的指标
        ["市场多空",    {IsMainIndex:false,  Create:function(){ return new MarketLongShortIndex()}  }],
        ["市场择时",    {IsMainIndex:false,  Create:function(){ return new MarketTimingIndex()}  }],
        ["市场关注度",  {IsMainIndex:false,  Create:function(){ return new MarketAttentionIndex()}  }],
        ["指数热度",    {IsMainIndex:false,  Create:function(){ return new MarketHeatIndex()}  }],
        ["财务粉饰",    {IsMainIndex:false,  Create:function(){ return new BenfordIndex()}  }],

        ["自定义指数热度", {IsMainIndex:false,  Create:function(){ return new CustonIndexHeatIndex()} , Name:'自定义指数热度'} ],

        //能图指标
        ["能图-趋势",       {IsMainIndex:false,  Create:function(){ return new LighterIndex1()},   Name:'大盘/个股趋势'  }],
        ["能图-位置研判",   {IsMainIndex:false,  Create:function(){ return new LighterIndex2()},   Name:'位置研判'  }],
        ["能图-点位研判",   {IsMainIndex:false,  Create:function(){ return new LighterIndex3()},   Name:'点位研判'  }],
    ]
    );

    return indexMap.get(id);
}

////////////////////////////////////////////////////////////////////////////////////////////////
//      指标计算方法
//
//
//

function HQIndexFormula()
{

}

//指数平均数指标 EMA(close,10)
HQIndexFormula.EMA=function(data,dayCount)
{
    var result = [];

    var offset=0;
    if (offset>=data.length) return result;

    //取首个有效数据
    for(;offset<data.length;++offset)
    {
        if (data[offset]!=null && !isNaN(data[offset]))
            break;
    }

    var p1Index=offset;
    var p2Index=offset+1;

    result[p1Index]=data[p1Index];
    for(var i=offset+1;i<data.length;++i,++p1Index,++p2Index)
    {
        result[p2Index]=((2*data[p2Index]+(dayCount-1)*result[p1Index]))/(dayCount+1);
    }

    return result;
}

HQIndexFormula.SMA=function(data,n,m)
{
    var result = [];

    var i=0;
    var lastData=null;
    for(;i<data.length; ++i)
    {
        if (data[i]==null || isNaN(data[i])) continue;
        lastData=data[i];
        result[i]=lastData; //第一天的数据
        break;
    }

    for(++i;i<data.length;++i)
    {
        result[i]=(m*data[i]+(n-m)*lastData)/n;
        lastData=result[i];
    }

    return result;
}


/*
    求动态移动平均.
    用法: DMA(X,A),求X的动态移动平均.
    算法: 若Y=DMA(X,A)则 Y=A*X+(1-A)*Y',其中Y'表示上一周期Y值,A必须小于1.
    例如:DMA(CLOSE,VOL/CAPITAL)表示求以换手率作平滑因子的平均价
*/
HQIndexFormula.DMA=function(data,data2)
{
    var result = [];
    if (data.length<0 || data.length!=data2.length) return result;

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index]) && data2[index]!=null && !isNaN(data2[index]))
        {
            result[index]=data[index];
            break;
        }
    }

    for(index=index+1;index<data.length;++index)
    {
        if (data[index]==null || data2[index]==null)
            result[index]=null;
        else
        {
            if (data[index]<1)
                result[index]=(data2[index]*data[index])+(1-data2[index])*result[index-1];
            else
                result[index]= data[index];
        }
    }

    return result;
}


HQIndexFormula.HHV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var max=-10000;
    for(var i=n,j=0;i<data.length;++i,++j)
    {
        if(i<n+max)
        {
            max=data[i]<data[max]?max:i;
        }
        else
        {
            for(j=(max=i-n+1)+1;j<=i;++j)
            {
                if(data[j]>data[max])
                    max = j;
            }
        }

        result[i] = data[max];
    }

    return result;
}

HQIndexFormula.LLV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var min=-10000;

    for(var i=n;i<data.length;++i,++j)
    {
        if(i<n+min)
        {
            min=data[i]>data[min]?min:i;
        }
        else
        {
            for(var j=(min=i-n+1)+1;j<=i;++j)
            {
                if(data[j]<data[min])
                    min = j;
            }
        }
        result[i] = data[min];
    }

    return result;
}

HQIndexFormula.REF=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;
    if (n>=data.length) return result;

    result=data.slice(0,data.length-n);

    for(var i=0;i<n;++i)
        result.unshift(null);

    return result;
}

HQIndexFormula.REFDATE=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;

    //暂时写死取最后一个
    n=data.length-1;
    for(var i in data)
    {
        result[i]=data[n];
    }

    return result;
}



HQIndexFormula.SUM=function(data,n)
{
    var result=[];

    if (n==0)
    {
        result[0]=data[0];

        for (var i=1; i<data.length; ++i)
        {
            result[i] = result[i-1]+data[i];
        }
    }
    else
    {

        for(var i=n-1,j=0;i<data.length;++i,++j)
        {
            for(var k=0;k<n;++k)
            {
                if (k==0) result[i]=data[k+j];
                else result[i]+=data[k+j];
            }
        }
    }

    return result;
}

//两个数组相减
HQIndexFormula.ARRAY_SUBTRACT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null || isNaN(data[i]))
                result[i]=null;
            else
                result[i]=data[i]-data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=data[i]-data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data==data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_EQ=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]==data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i]==data2[i] ? 1:0);
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.ARRAY_IF=function(data,trueData,falseData)
{
    var result=[];
    var IsNumber=[typeof(trueData)=="number",typeof(falseData)=="number"];
    for(var i in data)
    {
        if (data[i])
        {
            if (IsNumber[0]) result[i]=trueData;
            else result[i]=trueData[i];
        }
        else
        {
            if (IsNumber[1]) result[i]=falseData;
            else result[i]=falseData[i];
        }
    }

    return result;
}

HQIndexFormula.ARRAY_AND=function(data,data2)
{
   var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] && data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i] && data2[i] ? 1:0);
            else
                result[i]=0;
        }
    }

    return result;
}
HQIndexFormula.ARRAY_OR=function(data, data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] || data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i < data.length && data[i])
            {
                result[i] = 1;
                continue;
            }
            if (i < data2.length && data2[i])
            {
                result[i] = 1;
                continue;
            }
            result[i] = 0;    
        }
    }

    return result;
}
//数组相乘
//支持多个参数累乘 如:HQIndexFormula.ARRAY_MULTIPLY(data,data2,data3,data3) =data*data2*data3*data4
HQIndexFormula.ARRAY_MULTIPLY=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                if (data[i]==null || isNaN(data[i]))
                    result[i]=null;
                else
                    result[i]=data[i]*data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                    result[i]=data[i]*data2[i];
                else
                    result[i]=null;
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_MULTIPLY(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_MULTIPLY(result,arguments[i]);
    }

    return result;
}

//数组相除
HQIndexFormula.ARRAY_DIVIDE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=data[i]/data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if(data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i]))
                    result[i]=null;
                else if (data2[i]==0)
                    result[i]=null;
                else
                    result[i]=data[i]/data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组相加
//支持多个参数累加 如:HQIndexFormula.ARRAY_ADD(data,data2,data3,data3) =data+data2+data3+data4
HQIndexFormula.ARRAY_ADD=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                result[i]=data[i]+data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                {
                    if (data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i])) result[i]=null
                    else result[i]=data[i]+data2[i];
                }
                else
                {
                    result[i]=null;
                }
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_ADD(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_ADD(result,arguments[i]);
    }

    return result;
}

HQIndexFormula.MAX=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.max(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.max(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.MIN=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.min(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.min(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}


HQIndexFormula.ABS=function(data)
{
    var result=[];
    for(var i in data)
    {
        if (data[i]==null) result[i]=null;
        else result[i]=Math.abs(data[i]);
    }

    return result;
}


HQIndexFormula.MA=function(data,dayCount)
{
    var result=[];

    for (var i = 0, len = data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += data[i - j];
        }
        result[i]=sum / dayCount;
    }
    return result;
}

/*
    加权移动平均
    返回加权移动平均
    用法:EXPMA(X,M):X的M日加权移动平均
    EXPMA[i]=buffer[i]*para+(1-para)*EXPMA[i-1] para=2/(1+__para)
*/
HQIndexFormula.EXPMA=function(data,dayCount)
{
    var result=[];
    if (dayCount>=data.length) return result;

    var i=dayCount;
    for(;i<data.length;++i) //获取第1个有效数据
    {
        if (data[i]!=null)
        {
            result[i]=data[i];
            break;
        }
    }

    for (i=i+1; i < data.length; ++i)
    {
        if (result[i-1]!=null && data[i]!=null)
            result[i]=(2*data[i]+(dayCount-1)*result[i-1])/(dayCount+1);
        else if (result[i-1]!=null)
            result[i]=result[i-1];
    }

    return result;
}

//加权平滑平均,MEMA[i]=SMA[i]*para+(1-para)*SMA[i-1] para=2/(1+__para)
HQIndexFormula.EXPMEMA=function(data,dayCount)
{
    var result=[];
    if (dayCount>=data.length) return result;

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index] && !isNaN(data[index])) break;
    }

    var sum=0;
    for(var i=0; index<data.length && i<dayCount;++i, ++index)
    {
        if (data[index] && !isNaN(data[index]))
            sum+=data[index];
        else
            sum+=data[index-1];
    }

    result[index-1]=sum/dayCount;
    for(;index<data.length;++index)
	{
        if(result[index-1]!=null && data[index]!=null)
            result[index]=(2*data[index]+(dayCount-1)*result[index-1])/(dayCount+1);
        else if(result[index-1]!=null)
            result[index] = result[index-1];
	}

    return result;
}


HQIndexFormula.STD=function(data,n)
{
    var result=[];

    var total=0;
    var averageData=[]; //平均值
    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=data[i-j];
        }

        averageData[i]=total/n;
    }

    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=Math.pow((data[i-j]-averageData[i]),2);
        }

        result[i]=Math.sqrt(total/n);
    }


    return result;
}

//平均绝对方差
HQIndexFormula.AVEDEV=function(data,n)
{
    var result=[];

    var total=0;
    var averageData=[]; //平均值
    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=data[i-j];
        }

        averageData[i]=total/n;
    }

    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=Math.abs(data[i-j]-averageData[i]);
        }

        result[i]=total/n;
    }


    return result;
}

HQIndexFormula.COUNT=function(data,n)
{
    var result=[];


    for(var i=n-1;i<data.length;++i)
    {
        var count=0;
        for(var j=0;j<n;++j)
        {
            if (data[i-j]) ++count;
        }

        result[i]=count;
    }

    return result;
}

//上穿
HQIndexFormula.CROSS=function(data,data2)
{
    var result=[];
    if (data.length!=data2.length) return result=[];

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index])  && data2[index]!=null && isNaN(data2[index]))
            break;
    }

    for(++index;index<data.length;++index)
    {
        result[index]= (data[index]>data2[index]&&data[index-1]<data2[index-1])?1:0;
    }

    return result;
}

//累乘
HQIndexFormula.MULAR=function(data,n)
{
    var result=[];
    if(data.length<n) return result;

    var index=n;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index]))
        {
            result[index]=data[index];
            break;
        }
    }

    for(++index;index<data.length;++index)
    {
        result[index]=result[index-1]*data[index];
    }

    return result;
}


HQIndexFormula.STICKLINE=function(data,price1,price2)
{
    var result=[];
    if(data.length<=0) return result;

    var IsNumber=typeof(price1)=="number";
    var IsNumber2=typeof(price2)=="number";
   

    for(var i in data)
    {
        result[i]=null;
        if (isNaN(data[i])) continue;
        if (!data[i]) continue;

        if (IsNumber && IsNumber2)
        {
            result[i]={Value:price1,Value2:price2};
        }
        else if (IsNumber && !IsNumber2)
        {
            if (isNaN(price2[i])) continue;
            result[i]={Value:price1,Value2:price2[i]};
        }
        else if (!IsNumber && IsNumber2)
        {
            if (isNaN(price1[i])) continue;
            result[i]={Value:price1[i],Value2:price2};
        }
        else
        {
            if (isNaN(price1[i]) || isNaN(price2[i])) continue;
            result[i]={Value:price1[i],Value2:price2[i]};
        }
    }

    return result;
}

/////////////////////////////////////////////////////////////////////////////////////////////
//  K线图 控件
//  this.ChartPaint[0] K线画法 这个不要修改
//
//
function KLineChartContainer(uielement)
{
    var _self =this;
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName='KLineChartContainer';
    this.WindowIndex=new Array();
    this.Symbol;
    this.Name;
    this.Period=0;                      //周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
    this.Right=0;                       //复权 0 不复权 1 前复权 2 后复权
    this.SourceData;                    //原始的历史数据
    this.MaxReqeustDataCount=3000;      //数据个数
    this.MaxRequestMinuteDayCount=5;    //分钟数据请求的天数
    this.PageSize=200;                  //每页数据个数
    this.KLineDrawType=0;
    this.ScriptErrorCallback;           //脚本执行错误回调

    //this.KLineApiUrl="http://opensource.zealink.com/API/KLine2";                      //历史K线api地址
    this.KLineApiUrl="https://opensource.zealink.com/API/KLine2";                        //历史K线api地址
    this.MinuteKLineApiUrl='https://opensource.zealink.com/API/KLine3';                  //历史分钟数据
    this.RealtimeApiUrl="https://opensource.zealink.com/API/Stock";                      //实时行情api地址
    this.KLineMatchUrl="https://opensource.zealink.com/API/KLineMatch";                  //形态匹配

    this.MinuteDialog;  //双击历史K线 弹出分钟走势图
    this.RightMenu;     //右键菜单

    //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new HQTradeFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;

            this.TitlePaint.push(titlePaint);
        }

        this.UIElement.addEventListener("keydown", OnKeyDown, true);    //键盘消息
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new KLineFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            frame.Identify=i;                   //窗口序号

            if (this.ModifyIndexDialog) frame.ModifyIndexEvent=this.ModifyIndexDialog.DoModal;        //绑定菜单事件
            if (this.ChangeIndexDialog) frame.ChangeIndexEvent=this.ChangeIndexDialog.DoModal;

            frame.HorizontalMax=20;
            frame.HorizontalMin=10;

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
                //frame.IsLocked = true;
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitKLineX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;

            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;

            for(var j=frame.HorizontalMin;j<=frame.HorizontalMax;j+=1)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=j;
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=j.toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }

    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        var kline=new ChartKLine();
        kline.Canvas=this.Canvas;
        kline.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        kline.ChartFrame=this.Frame.SubFrame[0].Frame;
        kline.Name="Main-KLine";
        kline.DrawType=this.KLineDrawType;
        if (this.KLineInfoTooltip) kline.InfoTooltipEvent=[this.KLineInfoTooltip.DoModal,this.KLineInfoTooltip.Leave]; //鼠标悬停, 鼠标离开

        this.ChartPaint[0]=kline;

        this.TitlePaint[0]=new DynamicKLineTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;

        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;

    }

    //绑定主图K线数据
    this.BindMainData=function(hisData,showCount)
    {
        this.ChartPaint[0].Data=hisData;
        for(var i in this.Frame.SubFrame)
        {
            var item =this.Frame.SubFrame[i].Frame;
            item.XPointCount=showCount+5;
            item.Data=this.ChartPaint[0].Data;
        }

        this.TitlePaint[0].Data=this.ChartPaint[0].Data;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=this.Name;

        this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount;
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=dataOffset;
    }

    //创建指定窗口指标
    this.CreateWindowIndex=function(windowIndex)
    {
        this.WindowIndex[windowIndex].Create(this,windowIndex);
    }

    this.BindIndexData=function(windowIndex,hisData)
    {
        if (!this.WindowIndex[windowIndex]) return;
        if (typeof(this.WindowIndex[windowIndex].RequestData)=="function")  //数据需要另外下载的.
        {
            this.WindowIndex[windowIndex].RequestData(this,windowIndex,hisData);
            return;
        }
        if (typeof(this.WindowIndex[windowIndex].ExecuteScript)=='function')
        {
            this.WindowIndex[windowIndex].ExecuteScript(this,windowIndex,hisData);
            return;
        }

        this.WindowIndex[windowIndex].BindData(this,windowIndex,hisData);
    }

    //获取子窗口的所有画法
    this.GetChartPaint=function(windowIndex)
    {
        var paint=new Array();
        for(var i in this.ChartPaint)
        {
            if (i==0) continue; //第1个K线数据除外

            var item=this.ChartPaint[i];
            if (item.ChartFrame==this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    this.RequestHistoryData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.Draw();
        $.ajax({
            url: this.KLineApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol"
                ],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxReqeustDataCount
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistroyData(data);
            }
        });
    }

    this.RecvHistroyData=function(data)
    {
        var aryDayData=KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=0;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=this.Right;
        bindData.Period=this.Period;
        bindData.DataType=0;

        if (bindData.Right>0)    //复权
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0 && bindData.Period<=3)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }
        
        //请求叠加数据 (主数据下载完再下载))
        this.RequestOverlayHistoryData();

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    this.ReqeustHistoryMinuteData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.Draw();
        $.ajax({
            url: this.MinuteKLineApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol"
                ],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxRequestMinuteDayCount
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteHistroyData(data);
            }
        });
    }


    this.RecvMinuteHistroyData=function(data)
    {
        var aryDayData=KLineChartContainer.JsonDataToMinuteHistoryData(data);
        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=1;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=this.Right;
        bindData.Period=this.Period;
        bindData.DataType=1; 

        if (bindData.Period>=5)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }
    
        this.OverlayChartPaint[0].Data=null; //分钟数据不支持叠加 清空

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //请求实时行情数据
    this.ReqeustRealtimeData=function()
    {
        var self=this;

        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "time"
                ],
                "symbol": [self.Symbol],
                "start": -1
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvRealtimeData(data);
            }
        });
    }

    this.RecvRealtimeData=function(data)
    {
        var realtimeData=KLineChartContainer.JsonDataToRealtimeData(data);
        if (this.Symbol==data.symbol)
        {
            if (this.SourceData.Data[this.SourceData.Data.length-1].Date==realtimeData.Date)    //实时行情数据更新
            {
                var item =this.SourceData.Data[this.SourceData.Data.length-1];
                item.Close=realtimeData.Close;
                item.High=realtimeData.High;
                item.Low=realtimeData.Low;
                item.Vol=realtimeData.Vol;
                item.Amount=realtimeData.Amount;
            }
        }
    }

    //周期切换
    this.ChangePeriod=function(period)
    {
        if (this.Period==period) return;

        var isDataTypeChange=false;
        switch(period)
        {
            case 0:     //日线
            case 1:     //周
            case 2:     //月
            case 3:     //年
                if (this.SourceData.DataType!=0) isDataTypeChange=true;
                break;
            case 4:     //1分钟
            case 5:     //5分钟
            case 6:     //15分钟
            case 7:     //30分钟
            case 8:     //60分钟
                if (this.SourceData.DataType!=1) isDataTypeChange=true;
                break;
        }
        
        this.Period=period;
        if (isDataTypeChange==false)
        {
            this.Update();
            return;
        }

        if (this.Period<=3)
        {
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else 
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }  
    }

    //复权切换
    this.ChangeRight=function(right)
    {
        if (IsIndexSymbol(this.Symbol)) return; //指数没有复权

        if (right<0 || right>2) return;

        if (this.Right==right) return;

        this.Right=right;

        this.Update();
    }

    //删除某一个窗口的指标
    this.DeleteIndexPaint=function(windowIndex)
    {
        let paint=new Array();  //踢出当前窗口的指标画法
        for(let i in this.ChartPaint)
        {
            let item=this.ChartPaint[i];

            if (i==0 || item.ChartFrame!=this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=null;
        this.Frame.SubFrame[windowIndex].Frame.IsLocked=false;          //解除上锁

        this.ChartPaint=paint;

         //清空东条标题
         var titleIndex=windowIndex+1;
         this.TitlePaint[titleIndex].Data=[];
         this.TitlePaint[titleIndex].Title=null;
    }

    //切换成 脚本指标
    this.ChangeScriptIndex=function(windowIndex,indexData)
    {
        this.DeleteIndexPaint(windowIndex);
        this.WindowIndex[windowIndex]=new ScriptIndex(indexData.Name,indexData.Script,indexData.Args,indexData);    //脚本执行

        var bindData=this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex,bindData);   //执行脚本

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //切换指标 指定切换窗口指标
    this.ChangeIndex=function(windowIndex,indexName)
    {
        var indexItem=JSIndexMap.Get(indexName);
        if (!indexItem) 
        {
            //查找系统指标
            let scriptData = new JSIndexScript();
            let indexInfo = scriptData.Get(indexName);
            if (!indexInfo) return;
            if (indexInfo.IsMainIndex) 
            {
                windowIndex = 0;  //主图指标只能在主图显示
            }
            else 
            {
                if (windowIndex == 0) windowIndex = 1;  //幅图指标,不能再主图显示
            }
            let indexData = { Name: indexInfo.Name, Script: indexInfo.Script, Args: indexInfo.Args };
            return this.ChangeScriptIndex(windowIndex, indexData);
        }

        //主图指标
        if (indexItem.IsMainIndex)
        {
            if (windowIndex>0)  windowIndex=0;  //主图指标只能在主图显示
        }
        else
        {
            if (windowIndex==0) windowIndex=1;  //幅图指标,不能再主图显示
        }

        var paint=new Array();  //踢出当前窗口的指标画法
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];

            if (i==0 || item.ChartFrame!=this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=null;
        this.Frame.SubFrame[windowIndex].Frame.IsLocked=false;      //解除上锁

        this.ChartPaint=paint;

        //清空东条标题
        var titleIndex=windowIndex+1;
        this.TitlePaint[titleIndex].Data=[];
        this.TitlePaint[titleIndex].Title=null;

        this.WindowIndex[windowIndex]=indexItem.Create();
        this.CreateWindowIndex(windowIndex);

        var bindData=this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex,bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //锁|解锁指标 { Index:指标名字,IsLocked:是否要锁上,Callback:回调 }
    this.LockIndex=function(lockData)
    {
        if (!lockData) return;
        if (!lockData.IndexName) return;

        for(let i in this.WindowIndex)
        {
            let item=this.WindowIndex[i];
            if (!item) conintue;
            if (item.Name==lockData.IndexName)
            {
                item.SetLock(lockData);
                this.Update();
                break;
            }
        }
    }

    this.TryClickLock=function(x,y)
    {
        for(let i in this.Frame.SubFrame)
        {
            var item=this.Frame.SubFrame[i];
            if (!item.Frame.IsLocked) continue;
            if (!item.Frame.LockPaint) continue;

            var tooltip=new TooltipData();
            if (!item.Frame.LockPaint.GetTooltipData(x,y,tooltip)) continue;

            tooltip.HQChart=this;
            if (tooltip.Data.Callback) tooltip.Data.Callback(tooltip);
            return true;
        }

        return false;
    }

    this.Update=function()
    {
        if (!this.SourceData) return;

        var bindData=new ChartData();
        bindData.Data=this.SourceData.Data;
        bindData.Period=this.Period;
        bindData.Right=this.Right;
        bindData.DataType=this.SourceData.DataType;

        if (bindData.Right>0 && bindData.Period<=3)    //复权(日线数据才复权)
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0 && bindData.Period!=4)   //周期数据 (0= 日线,4=1分钟线 不需要处理)
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }

        //叠加数据周期调整
        if (this.OverlayChartPaint[0].SourceData)
        {
            if(this.Period>=4)  //分钟不支持 清空掉
            {   
                this.OverlayChartPaint[0].Data=null;
            }
            else
            {   //日线叠加
                var bindData=new ChartData();
                bindData.Data=this.OverlayChartPaint[0].SourceData.Data;
                bindData.Period=this.Period;
                bindData.Right=this.Right;

                if (bindData.Right>0 && !IsIndexSymbol(this.OverlayChartPaint[0].Symbol))       //复权数据
                {
                    var rightData=bindData.GetRightDate(bindData.Right);
                    bindData.Data=rightData;
                }

                var aryOverlayData=this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
                bindData.Data=aryOverlayData;

                if (bindData.Period>0)   //周期数据
                {
                    var periodData=bindData.GetPeriodData(bindData.Period);
                    bindData.Data=periodData;
                }

                this.OverlayChartPaint[0].Data=bindData;
            }
        }

        this.ReqeustKLineInfoData();
        
        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //切换股票代码
    this.ChangeSymbol=function(symbol)
    {
        this.Symbol=symbol;
        if (IsIndexSymbol(symbol)) this.Right=0;    //指数没有复权

        if (this.Period<=3)
        {
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else 
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }  
    }

    this.ReqeustKLineInfoData=function()
    {
        if (this.ChartPaint.length>0)
        {
            var klinePaint=this.ChartPaint[0];
            klinePaint.InfoData=new Map();
        }

        //信息地雷信息
        for(var i in this.ChartInfo)
        {
            this.ChartInfo[i].RequestData(this);
        }
    }

    //设置K线信息地雷
    this.SetKLineInfo=function(aryInfo,bUpdate)
    {
        for(var i in aryInfo)
        {
            var infoItem=JSKLineInfoMap.Get(aryInfo[i]);
            if (!infoItem) continue;
            var item=infoItem.Create();
            item.MaxReqeustDataCount=this.MaxReqeustDataCount;
            this.ChartInfo.push(item);
        }

        if (bUpdate==true) this.ReqeustKLineInfoData();
    }

    //叠加股票 只支持日线数据
    this.OverlaySymbol=function(symbol)
    {
        if (!this.OverlayChartPaint[0].MainData) return false;

        this.OverlayChartPaint[0].Symbol=symbol;

        if (this.Period<=3) this.RequestOverlayHistoryData();                  //请求日线数据
        
        return true;
    }

    this.RequestOverlayHistoryData=function()
    {
        if (!this.OverlayChartPaint.length) return;

        var symbol=this.OverlayChartPaint[0].Symbol;
        if (!symbol) return;

        var self = this;

         //请求数据
         $.ajax({
            url: this.KLineApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high"
                ],
                "symbol": symbol,
                "start": -1,
                "count": this.MaxReqeustDataCount
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvOverlayHistoryData(data);
            }
        });
    }

    this.RecvOverlayHistoryData=function(data)
    {
        var aryDayData=KLineChartContainer.JsonDataToHistoryData(data);

        //原始叠加数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=0;

        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Period=this.Period;
        bindData.Right=this.Right;
        bindData.DataType=0;

        if (bindData.Right>0 && !IsIndexSymbol(data.symbol))    //复权数据 ,指数没有复权)
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        var aryOverlayData=this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
        bindData.Data=aryOverlayData;

        if (bindData.Period>0)   //周期数据
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        this.OverlayChartPaint[0].Data=bindData;
        this.OverlayChartPaint[0].SourceData=sourceData;
        this.OverlayChartPaint[0].Title=data.name;
        this.OverlayChartPaint[0].Symbol=data.symbol;

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

    }

    //取消叠加股票
    this.ClearOverlaySymbol=function()
    {
        this.OverlayChartPaint[0].Symbol=null;
        this.OverlayChartPaint[0].Data=null;
        this.OverlayChartPaint[0].SourceData=null;
        this.OverlayChartPaint[0].TooltipRect=[];

        this.UpdateFrameMaxMin();
        this.Draw();
    }

    //创建画图工具
    this.CreateChartDrawPicture=function(name)
    {
        var drawPicture=null;
        switch(name)
        {
            case "线段":
                drawPicture=new ChartDrawPictureLine();
                break;
            case "射线":
                drawPicture=new ChartDrawPictureHaflLine();
                break;
            case "矩形":
                drawPicture=new ChartDrawPictureRect();
                break;
            case "圆弧线":
                drawPicture=new ChartDrawPictureArc();
                break;

            default:
                return false;
        }

        drawPicture.Canvas=this.Canvas;
        drawPicture.Status=0;
        this.CurrentChartDrawPicture=drawPicture;
        return true;
    }

    this.SetChartDrawPictureFirstPoint=function(x,y)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (!this.Frame.SubFrame || this.Frame.SubFrame.length<=0) return false;

        for(var i in this.Frame.SubFrame)
        {
            var frame=this.Frame.SubFrame[i].Frame;
            var left=frame.ChartBorder.GetLeft();
            var top=frame.ChartBorder.GetTopEx();
            var height=frame.ChartBorder.GetHeight();
            var width=frame.ChartBorder.GetWidth();

            this.Canvas.rect(left,top,width,height);
            if (this.Canvas.isPointInPath(x,y))
            {
                drawPicture.Frame=frame;
                break;
            }
        }

        if (!drawPicture.Frame) return false;

        drawPicture.Point[0]=new Point();
        drawPicture.Point[0].X=x-this.UIElement.getBoundingClientRect().left;
        drawPicture.Point[0].Y=y-this.UIElement.getBoundingClientRect().top;
        drawPicture.Status=1;   //第1个点完成
    }

    this.SetChartDrawPictureSecondPoint=function(x,y)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;

        drawPicture.Point[1]=new Point();
        drawPicture.Point[1].X=x-this.UIElement.getBoundingClientRect().left;
        drawPicture.Point[1].Y=y-this.UIElement.getBoundingClientRect().top;

        drawPicture.Status=2;   //设置第2个点
    }

    //xStep,yStep 移动的偏移量
    this.MoveChartDrawPicture=function(xStep,yStep)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;

        //console.log("xStep="+xStep+" yStep="+yStep);
        drawPicture.Move(xStep,yStep);

        return true;
    }

    this.FinishChartDrawPicturePoint=function()
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (drawPicture.PointCount!=drawPicture.Point.length) return false;

        drawPicture.Status=10;  //完成
        drawPicture.PointToValue();

        this.ChartDrawPicture.push(drawPicture);
        this.CurrentChartDrawPicture=null;

        return true;
    }


    //注册鼠标右键事件
    this.OnRightMenu=function(x,y,e)
    {
        if (this.RightMenu)
        {
            e.data={Chart:this};
            this.RightMenu.DoModal(e);
        }
    }



    this.FinishMoveChartDrawPicture=function()
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (drawPicture.PointCount!=drawPicture.Point.length) return false;

        drawPicture.Status=10;  //完成
        drawPicture.PointToValue();

        this.CurrentChartDrawPicture=null;
        return true;
    }

    //清空所有的画线工具
    this.ClearChartDrawPicture=function(drawPicture)
    {
        if (!drawPicture)
        {
            this.ChartDrawPicture=[];
            this.Draw();
        }
        else
        {
            for(var i in this.ChartDrawPicture)
            {
                if (this.ChartDrawPicture[i]==drawPicture)
                {
                    this.ChartDrawPicture.splice(i,1);
                    this.Draw();
                }
            }
        }
    }

    //形态匹配
    // scopeData.Plate 板块范围 scopeData.Symbol 股票范围
    this.RequestKLineMatch=function(selectRectData,scopeData,fun)
    {
        var _self =this;

        var aryDate=new Array();
        var aryValue=new Array();

        for(var i=selectRectData.Start;i<selectRectData.End && i<selectRectData.Data.Data.length;++i)
        {
            aryDate.push(selectRectData.Data.Data[i].Date);
            aryValue.push(selectRectData.Data.Data[i].Close);
        }

        //请求数据
        $.ajax({
            url: this.KLineMatchUrl,
            data:
            {
                "userid": "guest",
                "plate": scopeData.Plate,
                "period": this.Period,
                "right": this.Right,
                "dayregion": 365,
                "minsimilar": scopeData.Minsimilar,
                "sampledate":aryDate,
                "samplevalue":aryValue
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                if($.type(fun) == "function")
                {
                   // console.log(data);
                    fun(data);
                }
            }
        });
    }

    //更新信息地雷
    this.UpdataChartInfo=function()
    {
        //TODO: 根据K线数据日期来做map, 不在K线上的合并到下一个k线日期里面
        var mapInfoData=new Map();

        for(var i in this.ChartInfo)
        {
            var infoData=this.ChartInfo[i].Data;
            for(var j in infoData)
            {
                var item=infoData[j];
                if (mapInfoData.has(item.Date.toString()))
                {
                    mapInfoData.get(item.Date.toString()).Data.push(item);
                }
                else
                {

                    mapInfoData.set(item.Date.toString(),{Data:new Array(item)});
                }
            }
        }

        var klinePaint=this.ChartPaint[0];
        klinePaint.InfoData=mapInfoData;
    }

    //更新窗口指标
    this.UpdateWindowIndex=function(index)
    {
        var bindData=new ChartData();
        bindData.Data=this.SourceData.Data;
        bindData.Period=this.Period;
        bindData.Right=this.Right;

        if (bindData.Right>0)    //复权
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0)   //周期数据
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        if (typeof(this.WindowIndex[index].ExecuteScript)=='function')
        {
            var hisData=this.ChartPaint[0].Data;
            this.WindowIndex[index].ExecuteScript(this,index,hisData);
        }
        else
        {
            this.WindowIndex[index].BindData(this,index,bindData);
        }

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //修改参数指标
    this.ChangeWindowIndexParam=function(index)
    {
        this.WindowIndex[index].Index[0].Param+=1;
        this.WindowIndex[index].Index[1].Param+=1;

        this.UpdateWindowIndex(index);
    }


    this.OnDoubleClick=function(x,y,e)
    {
        if (!this.MinuteDialog) return;

        var tooltip=new TooltipData();
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (item.GetTooltipData(x,y,tooltip))
            {
                break;
            }
        }

        if (!tooltip.Data) return;

        e.data={Chart:this,Tooltip:tooltip};

        this.MinuteDialog.DoModal(e);
    }

    //this.RecvKLineMatchData=function(data)
    //{
    //    console.log(data);
    //}

}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToHistoryData=function(data)
{
    var list = data.data;
    var aryDayData=new Array();
    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7;
    for (var i = 0; i < list.length; ++i)
    {
        var item = new HistoryData();

        item.Date = list[i][date];
        item.Open = list[i][open];
        item.YClose = list[i][yclose];
        item.Close = list[i][close];
        item.High = list[i][high];
        item.Low = list[i][low];
        item.Vol = list[i][vol];    //原始单位股
        item.Amount = list[i][amount];

        if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除

        aryDayData.push(item);
    }

    return aryDayData;
}

KLineChartContainer.JsonDataToRealtimeData=function(data)
{
    var item=new HistoryData();
    item.Date=data.stock[0].date;
    item.Open=data.stock[0].open;
    item.YClose=data.stock[0].yclose;
    item.High=data.stock[0].high;
    item.Low=data.stock[0].low;
    item.Vol=data.stock[0].vol/100; //原始单位股
    item.Amount=data.stock[0].amount;
}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToMinuteHistoryData=function(data)
{
    var list = data.data;
    var aryDayData=new Array();
    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, time = 8;
    for (var i = 0; i < list.length; ++i)
    {
        var item = new HistoryData();

        item.Date = list[i][date];
        item.Open = list[i][open];
        item.YClose = list[i][yclose];
        item.Close = list[i][close];
        item.High = list[i][high];
        item.Low = list[i][low];
        item.Vol = list[i][vol]/100;    //原始单位股
        item.Amount = list[i][amount];
        item.Time=list[i][time];

       // if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除

        aryDayData.push(item);
    }
    // 无效数据处理
    for(var i = 0; i < aryDayData.length; ++i)
    {
        var minData = aryDayData[i];
        if (minData == null) coninue;
        if (isNaN(minData.Open) || minData.Open <= 0 || isNaN(minData.High) || minData.High <= 0 || isNaN(minData.Low) || minData.Low <= 0 
            || isNaN(minData.Close) || minData.Close <= 0 || isNaN(minData.YClose) || minData.YClose <= 0)
        {
            if (i == 0)
            {
                if (minData.YClose > 0)
                {
                    minData.Open = minData.YClose;
                    minData.High = minData.YClose;
                    minData.Low = minData.YClose;
                    minData.Close = minData.YClose;
                }
            }
            else // 用前一个有效数据填充
            {
                for(var j = i-1; j >= 0; --j)
                {
                    var minData2 = aryDayData[j];
                    if (minData2 == null) coninue;
                    if (minData2.Open > 0 && minData2.High > 0 && minData2.Low > 0 && minData2.Close > 0)
                    {
                        if (minData.YClose <= 0) minData.YClose = minData2.Close;
                        minData.Open = minData2.Open;
                        minData.High = minData2.High;
                        minData.Low = minData2.Low;
                        minData.Close = minData2.Close;
                        break;
                    }
                }
            }    
        }
    }
    return aryDayData;
}


///////////////////////////////////////////////////////////////////////////////////////////
//  走势图
//
function MinuteChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName='MinuteChartContainer';
    this.WindowIndex=new Array();
    this.Symbol;
    this.Name;
    this.SourceData;                          //原始的历史数据
    this.IsAutoUpate=false;                   //是否自动更新行情数据
    this.TradeDate=0;                         //行情交易日期

    this.MinuteApiUrl="https://opensource.zealink.com/API/Stock";

     //手机拖拽
     uielement.ontouchstart=function(e)
     {
         if(!this.JSChartContainer) return;
         if(this.JSChartContainer.DragMode==0) return;
 
         this.JSChartContainer.PhonePinch=null;
 
         e.preventDefault();
         var jsChart=this.JSChartContainer;
 
         if (jsChart.IsPhoneDragging(e))
         {
             var drag=
             {
                 "Click":{},
                 "LastMove":{},  //最后移动的位置
             };
 
             var touches=jsChart.GetToucheData(e,jsChart.IsForceLandscape);
 
             drag.Click.X=touches[0].clientX;
             drag.Click.Y=touches[0].clientY;
             drag.LastMove.X=touches[0].clientX;
             drag.LastMove.Y=touches[0].clientY;
 
             document.JSChartContainer=this.JSChartContainer;
             this.JSChartContainer.SelectChartDrawPicture=null;
             if (jsChart.ChartCorssCursor.IsShow === true)    //移动十字光标
             {
                var pixelTatio = GetDevicePixelRatio();
                var x = drag.Click.X-this.getBoundingClientRect().left*pixelTatio;
                var y = drag.Click.Y-this.getBoundingClientRect().top*pixelTatio;
                jsChart.OnMouseMove(x, y, e);
             }
         }
 
         uielement.ontouchmove=function(e)
         {
             if(!this.JSChartContainer) return;
             e.preventDefault();
 
             var touches=jsChart.GetToucheData(e,this.JSChartContainer.IsForceLandscape);
             if (jsChart.IsPhoneDragging(e))
             {
                 var drag=this.JSChartContainer.MouseDrag;
                 if (drag==null)
                 {
                     var pixelTatio = GetDevicePixelRatio();
                     var x = touches[0].clientX-this.getBoundingClientRect().left*pixelTatio;
                     var y = touches[0].clientY-this.getBoundingClientRect().top*pixelTatio;
                     this.JSChartContainer.OnMouseMove(x,y,e);
                 }
             }
         };
 
         uielement.ontouchend=function(e)
         {
             clearTimeout(timeout);
         }
 
     }

    //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQMinuteTimeStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建框架容器
        this.Frame=new HQTradeFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=25;
        this.Frame.ChartBorder.Left=50;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;

            this.TitlePaint.push(titlePaint);
        }

        this.UIElement.addEventListener("keydown", OnKeyDown, true);    //键盘消息
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new MinuteFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            if (i<2) frame.ChartBorder.TitleHeight=0;
            frame.XPointCount=243;

            var DEFAULT_HORIZONTAL=[9,8,7,6,5,4,3,2,1];
            frame.HorizontalMax=DEFAULT_HORIZONTAL[0];
            frame.HorizontalMin=DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length-1];

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitMinutePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitMinuteX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;
            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;
            frame.XSplitOperator.Operator();

            for(var j in DEFAULT_HORIZONTAL)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=DEFAULT_HORIZONTAL[j];
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=DEFAULT_HORIZONTAL[j].toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }

    //删除某一个窗口的指标
    this.DeleteIndexPaint=function(windowIndex)
    {
        let paint=new Array();          //踢出当前窗口的指标画法
        for(let i in this.ChartPaint)
        {
            let item=this.ChartPaint[i];

            if (i==0 || item.ChartFrame!=this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=null;
        this.Frame.SubFrame[windowIndex].Frame.IsLocked=false;          //解除上锁

        this.ChartPaint=paint;

         //清空东条标题
         var titleIndex=windowIndex+1;
         this.TitlePaint[titleIndex].Data=[];
         this.TitlePaint[titleIndex].Title=null;
    }


    this.CreateStockInfo=function()
    {
        this.ExtendChartPaint[0]=new StockInfoExtendChartPaint();
        this.ExtendChartPaint[0].Canvas=this.Canvas;
        this.ExtendChartPaint[0].ChartBorder=this.Frame.ChartBorder;
        this.ExtendChartPaint[0].ChartFrame=this.Frame;

        this.Frame.ChartBorder.Right=300;
    }

    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        //分钟线
        var minuteLine=new ChartMinutePriceLine();
        minuteLine.Canvas=this.Canvas;
        minuteLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        minuteLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        minuteLine.Name="Minute-Line";
        minuteLine.Color=g_JSChartResource.Minute.PriceColor;

        this.ChartPaint[0]=minuteLine;

        //分钟线均线
        var averageLine=new ChartLine();
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        averageLine.Name="Minute-Average-Line";
        averageLine.Color=g_JSChartResource.Minute.AvPriceColor;
        this.ChartPaint[1]=averageLine;

        var averageLine=new ChartMinuteVolumBar();
        averageLine.Color=g_JSChartResource.Minute.VolBarColor;
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[1].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[1].Frame;
        averageLine.Name="Minute-Vol-Bar";
        this.ChartPaint[2]=averageLine;


        this.TitlePaint[0]=new DynamicMinuteTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;

        /*
        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;
        */

    }

     //切换成 脚本指标
     this.ChangeScriptIndex=function(windowIndex,indexData)
     {
         this.DeleteIndexPaint(windowIndex);
         this.WindowIndex[windowIndex]=new ScriptIndex(indexData.Name,indexData.Script,indexData.Args);    //脚本执行
 
         var bindData=this.SourceData;
         this.BindIndexData(windowIndex,bindData);   //执行脚本
 
         this.UpdataDataoffset();           //更新数据偏移
         this.UpdateFrameMaxMin();          //调整坐标最大 最小值
         this.Draw();
     }

    //切换股票代码
    this.ChangeSymbol=function(symbol)
    {
        this.Symbol=symbol;
        this.RequestData();
    }

    this.RequestData=function()
    {
        this.RequestMinuteData();               //请求数据
    }

    //请求分钟数据
    this.RequestMinuteData=function()
    {
        var self=this;

        $.ajax({
            url: self.MinuteApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "minute",
                    "time",
                    "minutecount",
                ],
                "symbol": [self.Symbol],
                "start": -1
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvMinuteData(data);
            }
        });
    }

    this.RecvMinuteData=function(data)
    {
        var aryMinuteData=MinuteChartContainer.JsonDataToMinuteData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryMinuteData;

        this.TradeDate=data.stock[0].date;

        this.SourceData=sourceData;
        this.Symbol=data.stock[0].symbol;
        this.Name=data.stock[0].name;

        this.BindMainData(sourceData,data.stock[0].yclose);

        if (this.Frame.SubFrame.length>2)
        {
            var bindData=new ChartData();
            bindData.Data=aryMinuteData;
            for(var i=2; i<this.Frame.SubFrame.length; ++i)
            {
                this.BindIndexData(i,bindData);
            }
        }

        for(let i in this.Frame.SubFrame)
        {
            var item=this.Frame.SubFrame[i];
            item.Frame.XSplitOperator.Symbol=this.Symbol;
        }

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        this.AutoUpdata();
    }

    //数据自动更新
    this.AutoUpdata=function()
    {
        var _self = this;

        if (!this.IsAutoUpate) return;

        //9:30 - 15:40 非周6，日 每隔30秒更新一次 this.RequestMinuteData();
        var nowDate= new Date(),
            day = nowDate.getDay(),
            time = nowDate.getHours() * 100 + nowDate.getMinutes();

        if(day == 6 || day== 0) return ;

        if(time>1540) return ;

        if(time <930){
            setTimeout(function(){
                _self.AutoUpdata();
            },30000);
        }else{
            setTimeout(function(){
                _self.RequestMinuteData();
            },30000);
        }
    }

    this.BindIndexData=function(windowIndex,hisData)
    {
        if (!this.WindowIndex[windowIndex]) return;

        if (typeof(this.WindowIndex[windowIndex].RequestData)=="function")          //数据需要另外下载的.
        {
            this.WindowIndex[windowIndex].RequestData(this,windowIndex,hisData);
            return;
        }
        if (typeof(this.WindowIndex[windowIndex].ExecuteScript)=='function')
        {
            this.WindowIndex[windowIndex].ExecuteScript(this,windowIndex,hisData);
            return;
        }

        this.WindowIndex[windowIndex].BindData(this,windowIndex,hisData);
    }

    //绑定分钟数据
    this.BindMainData=function(minuteData,yClose)
    {
        //分钟数据
        var bindData=new ChartData();
        bindData.Data=minuteData.GetClose();
        this.ChartPaint[0].Data=bindData;
        this.ChartPaint[0].YClose=yClose;
        this.ChartPaint[0].NotSupportMessage=null;

        this.Frame.SubFrame[0].Frame.YSplitOperator.YClose=yClose;
        this.Frame.SubFrame[0].Frame.YSplitOperator.Data=bindData;

        //均线
        bindData=new ChartData();
        bindData.Data=minuteData.GetMinuteAvPrice();
        this.ChartPaint[1].Data=bindData;

        this.Frame.SubFrame[0].Frame.YSplitOperator.AverageData=bindData;

        //成交量
        bindData=new ChartData();
        bindData.Data=minuteData.GetVol();
        this.ChartPaint[2].Data=bindData;

        this.TitlePaint[0].Data=this.SourceData;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=this.Name;
        this.TitlePaint[0].YClose=yClose;

        if (this.ExtendChartPaint[0])
        {
            this.ExtendChartPaint[0].Symbol=this.Symbol;
            this.ExtendChartPaint[0].Name=this.Name;
        }

        /*
        this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount;
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=dataOffset;
        */
    }

    //获取子窗口的所有画法
    this.GetChartPaint=function(windowIndex)
    {
        var paint=new Array();
        for(var i in this.ChartPaint)
        {
            if (i<3) continue; //分钟 均线 成交量 3个线不能改

            var item=this.ChartPaint[i];
            if (item.ChartFrame==this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    //创建指定窗口指标
    this.CreateWindowIndex=function(windowIndex)
    {
        this.WindowIndex[windowIndex].Create(this,windowIndex);
    }
}

//API 返回数据 转化为array[]
MinuteChartContainer.JsonDataToMinuteData=function(data)
{
    var aryMinuteData=new Array();
    for(var i in data.stock[0].minute)
    {
        var jsData=data.stock[0].minute[i];
        var item=new MinuteData();

        item.Close=jsData.price;
        item.Open=jsData.open;
        item.High=jsData.high;
        item.Low=jsData.low;
        item.Vol=jsData.vol/100; //原始单位股
        item.Amount=jsData.amount;
        if (i==0)      //第1个数据 写死9：25
            item.DateTime=data.stock[0].date.toString()+" 0925";
        else
            item.DateTime=data.stock[0].date.toString()+" "+jsData.time.toString();
        item.Increate=jsData.increate;
        item.Risefall=jsData.risefall;
        item.AvPrice=jsData.avprice;

        //价格是0的 都用空
        if (item.Open<=0) item.Open=null;
        if (item.Close<=0) item.Close=null;
        if (item.AvPrice<=0) item.AvPrice=null;
        if (item.High<=0) item.High=null;
        if (item.Low<=0) item.Low=null;

        aryMinuteData[i]=item;
    }

    return aryMinuteData;
}

/*
    历史分钟走势图
*/
function HistoryMinuteChartContainer(uielement)
{
    this.newMethod=MinuteChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.HistoryMinuteApiUrl="https://opensourcecache.zealink.com/cache/minuteday/day/";
    this.ClassName='HistoryMinuteChartContainer';

    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        //分钟线
        var minuteLine=new ChartMinutePriceLine();
        minuteLine.Canvas=this.Canvas;
        minuteLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        minuteLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        minuteLine.Name="Minute-Line";
        minuteLine.Color=g_JSChartResource.Minute.PriceColor;

        this.ChartPaint[0]=minuteLine;

        //分钟线均线
        var averageLine=new ChartLine();
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        averageLine.Name="Minute-Average-Line";
        averageLine.Color=g_JSChartResource.Minute.AvPriceColor;
        this.ChartPaint[1]=averageLine;

        var averageLine=new ChartMinuteVolumBar();
        averageLine.Color=g_JSChartResource.Minute.VolBarColor;
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[1].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[1].Frame;
        averageLine.Name="Minute-Vol-Bar";
        this.ChartPaint[2]=averageLine;


        this.TitlePaint[0]=new DynamicMinuteTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;
        this.TitlePaint[0].IsShowDate=true;

        /*
        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;
        */

    }

    //设置交易日期
    this.ChangeTradeDate=function(trdateDate)
    {
        if (!trdateDate) return;

        this.TradeDate=trdateDate;
        this.RequestData(); //更新数据
    }

    this.RequestData=function()
    {
        var date=new Date();
        var nowDate=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        if (nowDate==this.TradeDate) this.RequestMinuteData();
        else this.RequestHistoryMinuteData();
    }

    //请求分钟数据
    this.RequestHistoryMinuteData=function()
    {
        var _self=this;
        var url=this.HistoryMinuteApiUrl+this.TradeDate.toString()+"/"+this.Symbol+".json";

        $.ajax({
            url: url,
            type:"get",
            dataType: "json",
            async:true,
            success: function (data)
            {
                _self.RecvHistoryMinuteData(data);
            },
            error:function(reqeust)
            {
                _self.RecvHistoryMinuteError(reqeust);
            }
        });
    }

    this.RecvHistoryMinuteError=function(reqeust)
    {
        if (reqeust.status!=404) return;

        var sourceData=new ChartData();
        this.SourceData=sourceData;

        for(var i in this.ChartPaint)
        {
            this.ChartPaint[i].Data=sourceData;
            if (i==0) this.ChartPaint[i].NotSupportMessage='没有权限访问!';
        }

        this.TitlePaint[0].Data=this.SourceData;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=null;

        this.Draw();
    }

    this.RecvHistoryMinuteData=function(data)
    {
        var aryMinuteData=HistoryMinuteChartContainer.JsonDataToMinuteData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryMinuteData;

        this.TradeDate=data.date;

        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;

        this.BindMainData(sourceData,data.day.yclose);

        if (this.Frame.SubFrame.length>2)
        {
            var bindData=new ChartData();
            bindData.Data=aryMinuteData;
            for(var i=2; i<this.Frame.SubFrame.length; ++i)
            {
                this.BindIndexData(i,bindData);
            }
        }

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        //this.AutoUpdata();
    }

}

//API 返回数据 转化为array[]
HistoryMinuteChartContainer.JsonDataToMinuteData=function(data)
{
    var aryMinuteData=new Array();
    for(var i in data.minute.time)
    {
        var item=new MinuteData();

        if (data.minute.price[i]<=0 && i>0) //当前这一分钟价格为空,使用上一分钟的数据
        {
            item.Close=aryMinuteData[i-1].Close;
            item.Open=aryMinuteData[i-1].Close;
            item.High=item.Close;
            item.Low=item.Close;
            item.Vol=data.minute.vol[i]; //原始单位股
            item.Amount=data.minute.amount[i];
            item.DateTime=data.date.toString()+" "+data.minute.time[i].toString();
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice=aryMinuteData[i-1].AvPrice;
        }
        else
        {
            item.Close=data.minute.price[i];
            item.Open=data.minute.open[i];
            item.High=data.minute.high[i];
            item.Low=data.minute.low[i];
            item.Vol=data.minute.vol[i]; //原始单位股
            item.Amount=data.minute.amount[i];
            item.DateTime=data.date.toString()+" "+data.minute.time[i].toString();
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice=data.minute.avprice[i];
        }

        //价格是0的 都用空
        if (item.Open<=0) item.Open=null;
        if (item.Close<=0) item.Close=null;
        if (item.AvPrice<=0) item.AvPrice=null;
        if (item.High<=0) item.High=null;
        if (item.Low<=0) item.Low=null;

        aryMinuteData[i]=item;
    }

    return aryMinuteData;
}

/////////////////////////////////////////////////////////////////////////////
//  自定义指数
//
function CustomKLineChartContainer(uielement)
{
    this.newMethod=KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName='CustomKLineChartContainer';
    this.CustomKLineApiUrl="https://opensource.zealink.com/API/IndexCalculate";                        //自定义指数计算地址
    this.CustomStock;   //成分
    this.QueryDate={Start:20180101,End:20180627} ;     //计算时间区间

    this.RequestHistoryData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.Draw();
        $.ajax({
            url: this.CustomKLineApiUrl,
            data:
            {
                "stock": self.CustomStock,
                "Name": self.Symbol,
                "date": { "startdate":self.QueryDate.Start,"enddate":self.QueryDate.End }
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistroyData(data);
            }
        });
    }

    this.RecvHistroyData=function(data)
    {
        var aryDayData=KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=0;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=this.Right;
        bindData.Period=this.Period;
        bindData.DataType=0;

        if (bindData.Right>0)    //复权
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0 && bindData.Period<=3)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
        
    }

}

////////////////////////////////////////////////////////////////////////////////
//  K线训练
//
function KLineTrainChartContainer(uielement)
{
    this.newMethod=KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.BuySellPaint;          //买卖点画法
    this.TrainDataCount=300;    //训练数据个数
    this.AutoRunTimer=null;     //K线自动前进定时器
    this.BuySellData=[];        //模拟买卖数据 {Buy:{Price:价格,Date:日期} , Sell:{Price:价格,Date:日期} 
    this.TrainDataIndex;        //当前训练的数据索引
    this.TrainCallback;         //训练回调 (K线每前进一次就调用一次)
    this.DragMode=0;

    this.TrainStartEnd={};

    //TODO: 鼠标键盘消息全部要禁掉
    this.OnKeyDown=function(e)
    {
        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();    
        else e.returnValue = false;
    }

    this.CreateBuySellPaint=function()  //在主窗口建立以后 创建买卖点
    {
        var chart=new ChartBuySell();
        chart.Canvas=this.Canvas;
        chart.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        chart.ChartFrame=this.Frame.SubFrame[0].Frame;
        chart.Name="KLine-Train-BuySell";
        this.ChartPaintEx[0]=chart;
    }

    this.BindMainData=function(hisData,showCount)   //数据到达绑定主图K线数据
    {
        this.ChartPaint[0].Data=hisData;
        for(var i in this.Frame.SubFrame)
        {
            var item =this.Frame.SubFrame[i].Frame;
            item.XPointCount=showCount;
            item.Data=this.ChartPaint[0].Data;
        }

        this.TitlePaint[0].Data=this.ChartPaint[0].Data;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=this.Name;

        this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        if (!this.ChartPaintEx[0]) this.CreateBuySellPaint();
        this.ChartPaintEx[0].Data=this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount-this.TrainDataCount-20;   //随机选一段数据进行训练
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=dataOffset;

        this.TrainDataIndex=this.CursorIndex;

        this.TrainStartEnd.Start=hisData.Data[this.TrainDataIndex+dataOffset-1];
    }

    this.Run=function()
    {
        if (this.AutoRunTimer) return;
        if (this.TrainDataCount<=0) return;

        var self=this;
        this.AutoRunTimer=setInterval(function()
        {
            if (!self.MoveNextKLineData()) clearInterval(self.AutoRunTimer);
        }, 1000);
    }

    this.MoveNextKLineData=function()
    {
        if (this.TrainDataCount<=0) return false;

        var xPointcount=0;
        if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount; //数据个数
        if (this.TrainDataIndex+1>=xPointcount)
        {
            this.CursorIndex=this.TrainDataIndex;
            if (!this.DataMoveRight()) return false;
            this.UpdataDataoffset();
            this.UpdatePointByCursorIndex();
            this.UpdateFrameMaxMin();
            this.Draw();
            ++this.TrainDataIndex;
            --this.TrainDataCount;

            if (this.TrainDataCount<=0) 
            {
                this.FinishTrainData();
                this.UpdateTrainUICallback();
                return false;
            }

            this.UpdateTrainUICallback();
            return true;
        }

        return false;
    }

    this.UpdateTrainUICallback=function()
    {
        var buySellPaint=this.ChartPaintEx[0];
        var lastData=buySellPaint.LastData.Data;
        this.TrainStartEnd.End=lastData;

        if (this.TrainCallback) this.TrainCallback(this);
    }

    this.FinishTrainData=function()
    {
        var buySellPaint=this.ChartPaintEx[0];
        if (buySellPaint && this.BuySellData.length)    //取最后1条数据 看是否卖了
        {
            var lastData=buySellPaint.LastData.Data;
            var item=this.BuySellData[this.BuySellData.length-1];
            if (!item.Sell)
            {
                item.Sell={Price:lastData.Close,Date:lastData.Date};
                buySellPaint.BuySellData.set(lastData.Date,{Op:1});
            }
        } 
    }

    this.GetLastBuySellData=function()   //取最后1条数据
    {
        var buySellPaint=this.ChartPaintEx[0];
        if (!buySellPaint) return null;

        if (this.BuySellData.length)   
        {
            var item=this.BuySellData[this.BuySellData.length-1];
            return item;
        } 

        return null;
    }

    this.GetOperator=function()     //获取当前是卖/买
    {
        var buySellData=this.GetLastBuySellData();
        if (buySellData && buySellData.Buy && !buySellData.Sell) return 1;

        return 0;
    }

    this.Stop=function()
    {
        if (this.AutoRunTimer!=null) clearInterval(this.AutoRunTimer);
        this.AutoRunTimer=null;
    }

    this.BuyOrSell=function()   //模拟买卖
    {
        var buySellPaint=this.ChartPaintEx[0];
        var lastData=buySellPaint.LastData.Data;
        var buySellData=this.GetLastBuySellData();
        if (buySellData && buySellData.Buy && !buySellData.Sell)
        {
            buySellData.Sell={Price:lastData.Close,Date:lastData.Date};
            buySellPaint.BuySellData.set(lastData.Date,{Op:1});
            this.MoveNextKLineData();
            return;
        }
        
        this.BuySellData.push({ Buy:{Price:lastData.Close,Date:lastData.Date}, Sell:null });
        buySellPaint.BuySellData.set(lastData.Date,{Op:0});
        this.MoveNextKLineData();
    }
}

////////////////////////////////////////////////////////////////////////////////
//  K线横屏显示
//
function KLineChartHScreenContainer(uielement)
{
    this.newMethod=KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName='KLineChartHScreenContainer';

    this.OnMouseMove=function(x,y,e)
    {
        this.LastPoint.X=x;
        this.LastPoint.Y=y;
        this.CursorIndex=this.Frame.GetXData(y);

        this.DrawDynamicInfo();
    }

    uielement.onmousedown=function(e)   //鼠标拖拽
    {
        if(!this.JSChartContainer) return;
        if(this.JSChartContainer.DragMode==0) return;

        if (this.JSChartContainer.TryClickLock)
        {
            var x = e.clientX-this.getBoundingClientRect().left;
            var y = e.clientY-this.getBoundingClientRect().top;
            if (this.JSChartContainer.TryClickLock(x,y)) return;
        }


        var drag=
        {
            "Click":{},
            "LastMove":{},  //最后移动的位置
        };

        drag.Click.X=e.clientX;
        drag.Click.Y=e.clientY;
        drag.LastMove.X=e.clientX;
        drag.LastMove.Y=e.clientY;

        this.JSChartContainer.MouseDrag=drag;
        document.JSChartContainer=this.JSChartContainer;
        this.JSChartContainer.SelectChartDrawPicture=null;

        uielement.ondblclick=function(e)
        {
            var x = e.clientX-this.getBoundingClientRect().left;
            var y = e.clientY-this.getBoundingClientRect().top;

            if(this.JSChartContainer)
                this.JSChartContainer.OnDoubleClick(x,y,e);
        }

        document.onmousemove=function(e)
        {
            if(!this.JSChartContainer) return;
            //加载数据中,禁用鼠标事件
            if (this.JSChartContainer.ChartSplashPaint && this.JSChartContainer.ChartSplashPaint.IsEnableSplash == true) return;

            var drag=this.JSChartContainer.MouseDrag;
            if (!drag) return;

            var moveSetp=Math.abs(drag.LastMove.Y-e.clientY);

            if (this.JSChartContainer.DragMode==1)  //数据左右拖拽
            {
                if (moveSetp<5) return;

                var isLeft=true;
                if (drag.LastMove.Y<e.clientY) isLeft=false;//右移数据

                if(this.JSChartContainer.DataMove(moveSetp,isLeft))
                {
                    this.JSChartContainer.UpdataDataoffset();
                    this.JSChartContainer.UpdatePointByCursorIndex();
                    this.JSChartContainer.UpdateFrameMaxMin();
                    this.JSChartContainer.ResetFrameXYSplit();
                    this.JSChartContainer.Draw();
                }

                drag.LastMove.X=e.clientX;
                drag.LastMove.Y=e.clientY;
            }
        };

        document.onmouseup=function(e)
        {
            //清空事件
            document.onmousemove=null;
            document.onmouseup=null;

            //清空数据
            this.JSChartContainer.MouseDrag=null;
            this.JSChartContainer.CurrentChartDrawPicture=null;
            this.JSChartContainer=null;
        }
    }

      //手机拖拽
      uielement.ontouchstart=function(e)
      {
          if(!this.JSChartContainer) return;
          if(this.JSChartContainer.DragMode==0) return;
  
          this.JSChartContainer.PhonePinch=null;
  
          e.preventDefault();
          var jsChart=this.JSChartContainer;
  
          if (jsChart.IsPhoneDragging(e))
          {
              //长按2秒,十字光标
              var timeout=setTimeout(function()
              {
                  if (drag.Click.X==drag.LastMove.X && drag.Click.Y==drag.LastMove.Y) //手指没有移动，出现十字光标
                  {
                      var mouseDrag=jsChart.MouseDrag;
                      jsChart.MouseDrag=null;
                      //移动十字光标
                      var pixelTatio = GetDevicePixelRatio();
                      var x = drag.Click.X-uielement.getBoundingClientRect().left*pixelTatio;
                      var y = drag.Click.Y-uielement.getBoundingClientRect().top*pixelTatio;
                      jsChart.OnMouseMove(x,y,e);
                  }
  
              }, 1000);
  
              var drag=
              {
                  "Click":{},
                  "LastMove":{},  //最后移动的位置
              };
  
              var touches=jsChart.GetToucheData(e,false);
  
              drag.Click.X=touches[0].clientX;
              drag.Click.Y=touches[0].clientY;
              drag.LastMove.X=touches[0].clientX;
              drag.LastMove.Y=touches[0].clientY;
  
              this.JSChartContainer.MouseDrag=drag;
              document.JSChartContainer=this.JSChartContainer;
              this.JSChartContainer.SelectChartDrawPicture=null;
          }
          else if (jsChart.IsPhonePinching(e))
          {
              var phonePinch=
              {
                  "Start":{},
                  "Last":{}
              };
  
              var touches=jsChart.GetToucheData(e,false);
  
              phonePinch.Start={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
              phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
  
              this.JSChartContainer.PhonePinch=phonePinch;
              document.JSChartContainer=this.JSChartContainer;
              this.JSChartContainer.SelectChartDrawPicture=null;
          }
  
          uielement.ontouchmove=function(e)
          {
              if(!this.JSChartContainer) return;
              e.preventDefault();
  
              var touches=jsChart.GetToucheData(e,false);
  
              if (jsChart.IsPhoneDragging(e))
              {
                  var drag=this.JSChartContainer.MouseDrag;
                  if (drag==null)
                  {
                      var pixelTatio = GetDevicePixelRatio();
                      var x = touches[0].clientX-this.getBoundingClientRect().left*pixelTatio;
                      var y = touches[0].clientY-this.getBoundingClientRect().top*pixelTatio;
                      this.JSChartContainer.OnMouseMove(x,y,e);
                  }
                  else
                  {
                      var moveSetp=Math.abs(drag.LastMove.Y-touches[0].clientY);
                      moveSetp=parseInt(moveSetp);
                      if (this.JSChartContainer.DragMode==1)  //数据左右拖拽
                      {
                          if (moveSetp<5) return;
  
                          var isLeft=true;
                          if (drag.LastMove.Y<touches[0].clientY) isLeft=false;//右移数据
  
                          if(this.JSChartContainer.DataMove(moveSetp,isLeft))
                          {
                              this.JSChartContainer.UpdataDataoffset();
                              this.JSChartContainer.UpdatePointByCursorIndex();
                              this.JSChartContainer.UpdateFrameMaxMin();
                              this.JSChartContainer.ResetFrameXYSplit();
                              this.JSChartContainer.Draw();
                          }
  
                          drag.LastMove.X=touches[0].clientX;
                          drag.LastMove.Y=touches[0].clientY;
                      }
                  }
              }else if (jsChart.IsPhonePinching(e))
              {
                  var phonePinch=this.JSChartContainer.PhonePinch;
                  if (!phonePinch) return;
  
                  var yHeight=Math.abs(touches[0].pageX-touches[1].pageX);
                  var yLastHeight=Math.abs(phonePinch.Last.X-phonePinch.Last.X2);
                  var yStep=yHeight-yLastHeight;
                  if (Math.abs(yStep)<5) return;
  
                  if (yStep>0)    //放大
                  {
                      var cursorIndex={};
                      cursorIndex.Index=parseInt(Math.abs(this.JSChartContainer.CursorIndex-0.5).toFixed(0));
                      if (!this.JSChartContainer.Frame.ZoomUp(cursorIndex)) return;
                      this.JSChartContainer.CursorIndex=cursorIndex.Index;
                      this.JSChartContainer.UpdatePointByCursorIndex();
                      this.JSChartContainer.UpdataDataoffset();
                      this.JSChartContainer.UpdateFrameMaxMin();
                      this.JSChartContainer.Draw();
                      this.JSChartContainer.ShowTooltipByKeyDown();
                  }
                  else        //缩小
                  {
                      var cursorIndex={};
                      cursorIndex.Index=parseInt(Math.abs(this.JSChartContainer.CursorIndex-0.5).toFixed(0));
                      if (!this.JSChartContainer.Frame.ZoomDown(cursorIndex)) return;
                      this.JSChartContainer.CursorIndex=cursorIndex.Index;
                      this.JSChartContainer.UpdataDataoffset();
                      this.JSChartContainer.UpdatePointByCursorIndex();
                      this.JSChartContainer.UpdateFrameMaxMin();
                      this.JSChartContainer.Draw();
                      this.JSChartContainer.ShowTooltipByKeyDown();
                  }
  
                  phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
              }
          };
  
          uielement.ontouchend=function(e)
          {
              clearTimeout(timeout);
          }
  
      }

    //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new HQTradeHScreenFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;

            this.TitlePaint.push(titlePaint);
        }

        this.UIElement.addEventListener("keydown", OnKeyDown, true);    //键盘消息
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new KLineHScreenFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            frame.Identify=i;                   //窗口序号

            if (this.ModifyIndexDialog) frame.ModifyIndexEvent=this.ModifyIndexDialog.DoModal;        //绑定菜单事件
            if (this.ChangeIndexDialog) frame.ChangeIndexEvent=this.ChangeIndexDialog.DoModal;

            frame.HorizontalMax=20;
            frame.HorizontalMin=10;

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
                //frame.IsLocked = true;
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitKLineX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;

            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;

            for(var j=frame.HorizontalMin;j<=frame.HorizontalMax;j+=1)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=j;
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=j.toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
//  走势图横屏显示
//
function MinuteChartHScreenContainer(uielement)
{
    this.newMethod=MinuteChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName='MinuteChartHScreenContainer';

    this.OnMouseMove=function(x,y,e)
    {
        this.LastPoint.X=x;
        this.LastPoint.Y=y;
        this.CursorIndex=this.Frame.GetXData(y);

        this.DrawDynamicInfo();
    }

     //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQMinuteTimeStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建框架容器
        this.Frame=new HQTradeHScreenFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=25;
        this.Frame.ChartBorder.Left=50;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;

            this.TitlePaint.push(titlePaint);
        }

        this.UIElement.addEventListener("keydown", OnKeyDown, true);    //键盘消息
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new MinuteHScreenFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            if (i<2) frame.ChartBorder.TitleHeight=0;
            frame.XPointCount=243;

            var DEFAULT_HORIZONTAL=[9,8,7,6,5,4,3,2,1];
            frame.HorizontalMax=DEFAULT_HORIZONTAL[0];
            frame.HorizontalMin=DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length-1];

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitMinutePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitMinuteX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;
            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;
            frame.XSplitOperator.Operator();

            for(var j in DEFAULT_HORIZONTAL)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=DEFAULT_HORIZONTAL[j];
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=DEFAULT_HORIZONTAL[j].toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }

}


////////////////////////////////////////////////////////////////////////////////
//  简单的图形框架
//
function SimlpleChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.MainDataControl;    //主数据类(对外的接口类)
    //this.SubDataControl=new Array();

    //创建
    this.Create=function()
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        //this.ChartCorssCursor=new ChartCorssCursor();
        //this.ChartCorssCursor.Canvas=this.Canvas;
        //this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
        //this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new SimpleChartFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        if (this.ChartCorssCursor) this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateMainChart();

        this.UIElement.addEventListener("keydown", OnKeyDown, true);    //键盘消息
    }

    this.SetMainDataConotrl=function(dataControl)
    {
        if (!dataControl) return;

        this.MainDataControl=dataControl;
        this.ChartPaint=[]; //图形

        this.CreateMainChart();
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart=function()
    {
        if (!this.MainDataControl) return;

        for(let i in this.MainDataControl.DataType)
        {
           let item=this.MainDataControl.DataType[i];
           if (item.Type=="BAR")
           {
               var chartItem=new ChartBar();
               chartItem.Canvas=this.Canvas;
               chartItem.ChartBorder=this.Frame.ChartBorder;
               chartItem.ChartFrame=this.Frame;
               chartItem.Name=item.Name;
               if (item.Color) chartItem.UpBarColor=item.Color;
               if (item.Color2) chartItem.DownBarColor=item.Color2;

               this.ChartPaint.push(chartItem);
           }
           else if (item.Type=="LINE")
           {
                var chartItem=new ChartLine();
                chartItem.Canvas=this.Canvas;
                chartItem.ChartBorder=this.Frame.ChartBorder;
                chartItem.ChartFrame=this.Frame;
                chartItem.Name=item.Name;
                if (item.Color) chartItem.Color=item.Color;

                this.ChartPaint.push(chartItem);
           }
        }

        this.Frame.YSplitOperator=new FrameSplitY();
        this.Frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
        this.Frame.YSplitOperator.Frame=this.Frame;
        this.Frame.YSplitOperator.ChartBorder=this.Frame.ChartBorder;

        this.Frame.XSplitOperator=new FrameSplitXData();
        this.Frame.XSplitOperator.Frame=this.Frame;
        this.Frame.XSplitOperator.ChartBorder=this.Frame.ChartBorder;


       // this.TitlePaint[0]=new DynamicKLineTitlePainting();
       // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
       // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData=function()
    {
        if(!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer=this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData=function(dataControl)
    {   

        let lCount=0;
        for(let i in dataControl.Data)
        {
            let itemData=new ChartData();
            itemData.Data=dataControl.Data[i];
            this.ChartPaint[i].Data=itemData;
            if (lCount<itemData.Data.length) lCount=itemData.Data.length;
        }

        this.Frame.XPointCount=lCount;
        this.Frame.Data=this.ChartPaint[0].Data;
        this.Frame.XData=dataControl.XData;

        this.UpdateFrameMaxMin();               //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

}

////////////////////////////////////////////////////////////////////////////////
//  饼图图形框架
//
function PieChartContainer(uielement)
{
    this.Radius;    //半径
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.MainDataControl;    //主数据类(对外的接口类)

    //鼠标移动
    this.OnMouseMove=function(x,y,e)
    {

    }

    //创建
    this.Create=function()
    {
        this.UIElement.JSChartContainer=this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new NoneFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;
        this.CreateMainChart();
    }

    this.SetMainDataConotrl=function(dataControl)
    {
        if (!dataControl) return;

        this.MainDataControl=dataControl;
        this.ChartPaint=[]; //图形

        this.CreateMainChart();
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart=function()
    {
        if (!this.MainDataControl) return;

        for(let i in this.MainDataControl.DataType)
        {
           let item=this.MainDataControl.DataType[i];
           if (item.Type=="PIE")
           {

               var chartItem=new ChartPie();
               chartItem.Canvas=this.Canvas;
               chartItem.ChartBorder=this.Frame.ChartBorder;
               chartItem.ChartFrame=this.Frame;
               chartItem.Name=item.Name;

               if(this.Radius) chartItem.Radius = this.Radius;

               this.ChartPaint.push(chartItem);
           }
        }

       // this.TitlePaint[0]=new DynamicKLineTitlePainting();
       // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
       // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData=function()
    {
        if(!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer=this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData=function(dataControl)
    {
        for(let i in dataControl.Data)
        {
            let itemData=new ChartData();
            itemData.Data=dataControl.Data[i];
            this.ChartPaint[i].Data=itemData;
        }
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

}

//地图
function MapChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.MainDataControl;    //主数据类(对外的接口类)

    //鼠标移动
    this.OnMouseMove=function(x,y,e)
    {

    }

    //创建
    this.Create=function()
    {
        this.UIElement.JSChartContainer=this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new NoneFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;
        this.CreateMainChart();
    }

    this.SetMainDataConotrl=function(dataControl)
    {
        if (!dataControl) return;

        this.MainDataControl=dataControl;
        this.ChartPaint=[]; //图形

        this.CreateMainChart();
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart=function()
    {
        if (!this.MainDataControl) return;

        let chartItem=new ChartChinaMap();
        chartItem.Canvas=this.Canvas;
        chartItem.ChartBorder=this.Frame.ChartBorder;
        chartItem.ChartFrame=this.Frame;
        chartItem.Name=this.MainDataControl.DataType[0].Name;

        if(this.Radius) chartItem.Radius = this.Radius;

        this.ChartPaint.push(chartItem);
           
       // this.TitlePaint[0]=new DynamicKLineTitlePainting();
       // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
       // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData=function()
    {
        if(!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer=this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData=function(dataControl)
    {
        this.ChartPaint[0].Data=dataControl.Data[0];

        this.Frame.SetSizeChage(true);
        this.Draw();
    }
}




//////////////////////////////////////////////////////////
//
//  指标信息
//
function IndexInfo(name,param)
{
    this.Name=name;                 //名字
    this.Param=param;               //参数
    this.LineColor;                 //线段颜色
    this.ReqeustData=null;          //数据请求
}

function BaseIndex(name)
{
    this.Index;         //指标阐述
    this.Name=name;     //指标名字
    this.Script=null;   //通达信脚本

    //默认创建都是线段
    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            if (!this.Index[i].Name) continue;

            var maLine=new ChartLine();
            maLine.Canvas=hqChart.Canvas;
            maLine.Name=this.Name+'-'+i.toString();
            maLine.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            maLine.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            maLine.Color=this.Index[i].LineColor;

            hqChart.ChartPaint.push(maLine);
        }
    }

    //指标不支持 周期/复权/股票等
    this.NotSupport=function(hqChart,windowIndex,message)
    {
        var paint=hqChart.GetChartPaint(windowIndex);
        for(var i in paint)
        {
            paint[i].Data.Data=[];    //清空数据
            if (i==0) paint[i].NotSupportMessage=message;
        }
    }

    //格式化指标名字+参数
    //格式:指标名(参数1,参数2,参数3,...)
    this.FormatIndexTitle=function()
    {
        var title=this.Name;
        var param=null;

        for(var i in this.Index)
        {
            var item = this.Index[i];
            if (item.Param==null) continue;

            if (param)
                param+=','+item.Param.toString();
            else
                param=item.Param.toString();
        }

        if (param)
        {
            title+='('+param+')';
        }

        return title;
    }
}

//市场多空
function MarketLongShortIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Long-Short');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("市场多空指标",null),
        new IndexInfo("多头区域",null),
        new IndexInfo("空头区域",null)
    );

    this.Index[0].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[1].LineColor=g_JSChartResource.UpBarColor;
    this.Index[2].LineColor=g_JSChartResource.DownBarColor;

    this.LongShortData; //多空数据

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0)
                paint=new ChartLine();
            else
                paint=new ChartStraightLine();

            paint.Color=this.Index[i].LineColor;
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.LongShortData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.LongShortData;
        paint[0].NotSupportMessage=null;
        paint[1].Data.Data[0]=8;
        paint[2].Data.Data[0]=1;

        //指定[0,9]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:9,Min:0,Count:3};

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
            if (i>0) hqChart.TitlePaint[titleIndex].Data[i].DataType="StraightLine";
        }

        return true;
    }

}

//市场择时
function MarketTimingIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Timing');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("因子择时",null)
    );

    this.TimingData; //择时数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=new ChartMACD();
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[2];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.TimingData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.TimingData;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
        }

        return true;
    }
}

//市场关注度
function MarketAttentionIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Attention');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("市场关注度",null)
    );

    this.Data; //关注度数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor;
    this.ApiUrl=g_JSChartResource.Index.MarketAttentionApiUrl;

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=new ChartMACD();   //柱子
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //调整框架
    this.SetFrame=function(hqChart,windowIndex,hisData)
    {
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:6,Min:0,Count:3};
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);
        this.SetFrame(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
        }

        return true;
    }
}


/*
    行业,指数热度
*/
function MarketHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Heat');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("热度",5),
        new IndexInfo('MA',10),
        new IndexInfo('MA',null)
    );

    this.Data; //关注度数据

    this.ApiUrl=g_JSChartResource.Index.MarketHeatApiUrl;

    this.Index[0].LineColor=g_JSChartResource.FrameSplitTextColor;
    this.Index[1].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[1];

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0) 
            {
                paint=new ChartMACD();   //柱子
            }
            else 
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var MA=HQIndexFormula.MA(this.Data,this.Index[0].Param);
        paint[1].Data.Data=MA;

        var MA2=HQIndexFormula.MA(this.Data,this.Index[1].Param);
        paint[2].Data.Data=MA2;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            var name="";    //显示的名字特殊处理
            if(i==0)
                name=hqChart.Name+this.Index[i].Name;
            else
                name="MA"+this.Index[i-1].Param;

            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.DEFAULT;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=2;
        }

        //hqChart.TitlePaint[titleIndex].Explain="热度说明";

        return true;
    }

}

//自定义指数热度
function CustonIndexHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Heat');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo('区域',3),
        new IndexInfo("热度指数",10),
        new IndexInfo('MA',5),
        new IndexInfo('MA',10)
    );

    this.Data; //关注度数据

    this.ApiUrl=g_JSChartResource.Index.CustomIndexHeatApiUrl;

    this.Index[1].LineColor=g_JSChartResource.Index.LineColor[1];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[2];
    this.Index[3].LineColor=g_JSChartResource.Index.LineColor[3];

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0) 
            {
                paint = new ChartStraightArea();
            }
            else 
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: this.ApiUrl,
            data:
            {
               "stock":param.HQChart.CustomStock,
               "date":{"startdate":param.HQChart.QueryDate.Start,"enddate":param.HQChart.QueryDate.End},
               "day":[this.Index[0].Param,this.Index[1].Param],
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data==null || recvData.data.length<0) return;

        //console.log(recvData.data);
        var aryData=new Array();
        for(let i in recvData.data)
        {
            let item=recvData.data[i];
            let indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        let paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].NotSupportMessage=null;
        paint[0].Data.Data=
        [
          { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '热度1', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '热度2', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.4, Value2: 0.8, Color: 'rgb(255,106,106)', Title: '热度3', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.8, Value2: 1, Color: 'rgb(208, 32 ,144)', Title: '热度4', TitleColor:'rgb(245,255 ,250)'}
        ];
        
        paint[1].Data.Data = this.Data;
        
        let MA=HQIndexFormula.MA(this.Data,this.Index[2].Param);
        paint[2].Data.Data=MA;

        let MA2=HQIndexFormula.MA(this.Data,this.Index[3].Param);
        paint[3].Data.Data=MA2;

         //指定框架最大最小[0,1]
         hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };

        let titleIndex=windowIndex+1;

        for(let i=1;i<paint.length;++i)
        {
            let name=this.Index[i].Name;    //显示的名字特殊处理
            if (name=='MA') name="MA"+this.Index[i].Param;

            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.DEFAULT;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=2;
        }

        hqChart.TitlePaint[titleIndex].Title='热度'+'('+this.Index[0].Param+','+this.Index[1].Param+','+this.Index[2].Param+','+this.Index[3].Param+')';

        return true;
    }

}


/*
    本福特系数(财务粉饰)
*/
function BenfordIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('财务粉饰');
    delete this.newMethod;

    this.Index = new Array(
        new IndexInfo('区域', null),
        new IndexInfo("系数", null),
      );

    this.Data; //财务数据

    this.ApiUrl=g_JSChartResource.Index.StockHistoryDayApiUrl;

    this.Index[0].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[1].LineColor='rgb(105,105,105)';

    this.Create=function(hqChart,windowIndex)
    {
        for (var i in this.Index) 
        {
            var paint = null;
            if (i == 0)
                paint = new ChartStraightArea();
            else if (i==1)
                paint = new ChartLineMultiData();

            if (paint)
            {
                paint.Color = this.Index[i].LineColor;
                paint.Canvas = hqChart.Canvas;
                paint.Name = this.Name + "-" + i.toString();
                paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
                paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

                hqChart.ChartPaint.push(paint);
            }
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period!=2)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"只支持月线");
            param.HQChart.Draw();
            return false;
        }

        var aryField=["finance.benford","announcement2.quarter","announcement1.quarter","announcement3.quarter","announcement4.quarter"];
        var aryCondition=
            [  
                {item:["date","int32","gte","20130101"]},
                {item:[ "announcement1.year","int32","gte",0,
                        "announcement2.year","int32","gte",0,
                        "announcement3.year","int32","gte",0,
                        "announcement4.year","int32","gte",0,
                        "or"]}
            ];
        //请求数据
        $.ajax({
            url: this.ApiUrl,
            data:
            {
               "symbol":[param.HQChart.Symbol],
               "field":aryField,
               "condition":aryCondition
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.JsonDataToMapSingleData=function(recvData)
    {
        var stockData=recvData.stock[0].stockday;
        var mapData=new Map();
        for(var i in stockData)
        {
            var item=stockData[i];
            var indexData=new SingleData();
            indexData.Date=item.date;
            indexData.Value=new Array();
            if (item.finance1!=null && item.announcement1!=null)
            {
                let year=item.announcement1.year;
                let quarter=item.announcement1.quarter;
                let value=item.finance1.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance2!=null && item.announcement2!=null)
            {
                let year=item.announcement2.year;
                let quarter=item.announcement2.quarter;
                let value=item.finance2.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance3!=null && item.announcement3!=null)
            {
                let year=item.announcement3.year;
                let quarter=item.announcement3.quarter;
                let value=item.finance3.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance4!=null && item.announcement4!=null)
            {
                let year=item.announcement4.year;
                let quarter=item.announcement4.quarter;
                let value=item.finance4.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }

            mapData.set(indexData.Date,indexData);
        }

        var aryData=new Array();
        for( var item of mapData)
        {
            aryData.push(item[1]);
        }

        return aryData;
    }

    this.RecvData=function(recvData,param)
    {
        console.log(recvData);
        if (recvData.stock==null || recvData.stock.length<=0) return;

        var aryData=this.JsonDataToMapSingleData(recvData);

        var aryFittingData=param.HistoryData.GetFittingMonthData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].NotSupportMessage = null;

        paint[0].Data.Data=
        [
          { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '安全区', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '预警区', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.4, Value2: 1, Color: 'rgb(255,106,106)', Title: '警示区', TitleColor:'rgb(245,255 ,250)'}
        ];
        
        paint[1].Data.Data = this.Data;
        
        //指定框架最大最小[0,1]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };
    
        var titleIndex = windowIndex + 1;
    
        hqChart.TitlePaint[titleIndex].Data[1] = new DynamicTitleData(paint[1].Data, this.Index[1].Name, this.Index[1].LineColor);
        hqChart.TitlePaint[titleIndex].Data[1].DataType = "MultiReport";
         
        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

        return true;
    }
}



///////////////////////////////////////////////////////////////////////
//  能图指标
//

/*
    大盘趋势函数
    个股趋势函数

    上线:=SMA(C,6.5,1);
    下线:=SMA(C,13.5,1);
    STICKLINE(上线>下线 , 上线,下线 ,2, 0),COLORRED,LINETHICK2;
    STICKLINE(下线>上线,上线,下线,2,0),COLORBLUE,LINETHICK2;
*/

function LighterIndex1()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Lighter-Trend');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("STICKLINE",null),
        new IndexInfo('STICKLINE',null)
    );

    this.Index[0].LineColor='rgb(255,0,0)';
    this.Index[1].LineColor='rgb(0,0,255)';

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=new ChartStickLine();
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name;
            paint.Name=this.Name+'-'+i.toString();
            paint.Color=this.Index[i].LineColor;
            paint.LineWidth=2;
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            hqChart.ChartPaint.push(paint);
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=2) return false;

        var closeData=hisData.GetClose();
        var upData=HQIndexFormula.SMA(closeData,6.5,1);
        var downData=HQIndexFormula.SMA(closeData,13.5,1);

        var stickLine=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(upData,downData),upData,downData);;
        var stickLine2=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(downData,upData),upData,downData);;

        paint[0].Data.Data=stickLine;
        paint[1].Data.Data=stickLine2;

        var titleIndex=windowIndex+1;
        hqChart.TitlePaint[titleIndex].Title="大盘/个股 趋势函数";

        return true;
    }
}

/*
    位置研判函数
    N:=34;M:=3;
    28,COLORFFFFFF;
    STICKLINE(C>0,0,2,5,0),COLOR00008A;
    STICKLINE(C>0,2,5,5,0),COLOR85008A;
    STICKLINE(C>0,5,10,5,0),COLOR657600;
    STICKLINE(C>0,10,21.5,5,0),COLOR690079;
    STICKLINE(C>0,21.5,23,5,0),COLOR79B715;
    STICKLINE(C>0,23,28,5,0),COLOR00008A;
    VAR1:=EMA(100*(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N)),M)/4,COLORFFFF00,LINETHICK2;

    财貌双拳:VAR1,COLORFFFF00,LINETHICK2;
    DRAWTEXT(CURRBARSCOUNT=128,1,'底部区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,3.5,'介入区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,7.5,'稳健区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,16,'高位区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,22,'风险区域'),COLOR0000FF;
    DRAWTEXT(CURRBARSCOUNT=128,25.5,'顶部区域'),COLORFF00FF;
*/

function LighterIndex2()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('位置研判函数');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("STICKLINE",34),
        new IndexInfo('STICKLINE',3),
        new IndexInfo('STICKLINE',null),
        new IndexInfo('STICKLINE',null),
        new IndexInfo('STICKLINE',null),
        new IndexInfo('STICKLINE',null),
        new IndexInfo('LINE',null),
        new IndexInfo('TEXT',null)
    );

    this.Index[0].LineColor='rgb(0,0,138)';
    this.Index[1].LineColor='rgb(133,0,138)';
    this.Index[2].LineColor='rgb(101,118,0)';
    this.Index[3].LineColor='rgb(105,0,121)';
    this.Index[4].LineColor='rgb(121,183,21)';
    this.Index[5].LineColor='rgb(0,0,138)';
    this.Index[6].LineColor='rgb(255,0,0)';

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (this.Index[i].Name=='LINE')
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }
            else if (this.Index[i].Name=='TEXT')
            {
                paint=new ChartText();
            }
            else
            {
                paint=new ChartStickLine();
                paint.Color=this.Index[i].LineColor;
                paint.LineWidth=5;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name;
            paint.Name=this.Name+'-'+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            hqChart.ChartPaint.push(paint);
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        var closeData=hisData.GetClose();
        var highData=hisData.GetHigh();
        var lowData=hisData.GetLow();

        paint[0].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),0,2);
        paint[1].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),2,5);
        paint[2].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),5,10);
        paint[3].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),10,21.5);
        paint[4].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),21.5,23,5);
        paint[5].Data.Data=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(closeData,0),23,28,5);

        //VAR1:=EMA(100*(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N)),M)/4
        var lineData=HQIndexFormula.ARRAY_DIVIDE(
            HQIndexFormula.EMA(
                HQIndexFormula.ARRAY_MULTIPLY(
                    HQIndexFormula.ARRAY_DIVIDE(
                        HQIndexFormula.ARRAY_SUBTRACT(closeData,HQIndexFormula.LLV(lowData,this.Index[0].Param)),
                        HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.HHV(highData,this.Index[0].Param),HQIndexFormula.LLV(lowData,this.Index[0].Param))
                    ),
                    100),
                this.Index[1].Param),
            4
        );

        paint[6].Data.Data=lineData;

        //DRAWTEXT(CURRBARSCOUNT=128,1,'底部区域'),COLOR00FFFF;
        //DRAWTEXT(CURRBARSCOUNT=128,3.5,'介入区域'),COLOR00FFFF;
        //DRAWTEXT(CURRBARSCOUNT=128,7.5,'稳健区域'),COLOR00FFFF;
        //DRAWTEXT(CURRBARSCOUNT=128,16,'高位区域'),COLOR00FFFF;
        //DRAWTEXT(CURRBARSCOUNT=128,22,'风险区域'),COLOR0000FF;
        //DRAWTEXT(CURRBARSCOUNT=128,25.5,'顶部区域'),COLORFF00FF;

        var TextData=new Array();
        TextData[0]={Value:1,   Message:'底部区域',Color:'rgb(0,255,255)',Position:'Left'};
        TextData[1]={Value:3.5, Message:'介入区域',Color:'rgb(0,255,255)',Position:'Left'};
        TextData[2]={Value:7.5, Message:'稳健区域',Color:'rgb(0,255,255)',Position:'Left'};
        TextData[3]={Value:16,  Message:'高位区域',Color:'rgb(0,255,255)',Position:'Left'};
        TextData[4]={Value:22,  Message:'风险区域',Color:'rgb(0,0,255)',Position:'Left'};
        TextData[5]={Value:25.5,Message:'顶部区域',Color:'rgb(255,0,255)',Position:'Left'};

        paint[7].Data.Data=TextData;

        var titleIndex=windowIndex+1;
        hqChart.TitlePaint[titleIndex].Data[0]=new DynamicTitleData(paint[6].Data,"财貌双拳",paint[6].Color);

        hqChart.TitlePaint[titleIndex].Title=this.FormatIndexTitle();

        return true;
    }
}


/*
    点位研判函数

    HJ_1:=REF(LOW,1);
    HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
    HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
    HJ_4:=LLV(LOW,34);
    HJ_5:=HHV(HJ_3,34);
    HJ_6:=IF(LLV(LOW,56),1,0);
    HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
    HJ_8:=HJ_7>REF(HJ_7,1);
    HJ_9:=REF(LLV(LOW,100),3);
    HJ_10:=REFDATE(HJ_9,DATE);
    HJ_11:=LOW=HJ_10;
    HJ_12:=HJ_8 AND HJ_11;
    HJ_13:=HJ_12>REF(HJ_12,1);
    启动买点:HJ_13>REF(HJ_13,1),COLORRED,LINETHICK1;
*/
function LighterIndex3()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('点位研判函数');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("启动买点",null)
    );

    this.Index[0].LineColor='rgb(255,0,0)';

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        var closeData=hisData.GetClose();
        var highData=hisData.GetHigh();
        var lowData=hisData.GetLow();

        //HJ_1:=REF(LOW,1);
        var hj_1=HQIndexFormula.REF(lowData,1);

        //HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
        var hj_2=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.SMA(HQIndexFormula.ABS(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1)),13,1),
                HQIndexFormula.SMA(HQIndexFormula.MAX(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1),0),13,1)
            ),
            100
        );

        //HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
        var hj_3=HQIndexFormula.EMA(
            HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_MULTIPLY(closeData,1.2),HQIndexFormula.ARRAY_MULTIPLY(hj_2,13),HQIndexFormula.ARRAY_DIVIDE(hj_2,13)),
            13
        );
        
        //HJ_4:=LLV(LOW,34);
        var hj_4=HQIndexFormula.LLV(lowData,34);

        //HJ_5:=HHV(HJ_3,34);
        var hj_5=HQIndexFormula.HHV(hj_3,34);

        //HJ_6:=IF(LLV(LOW,56),1,0);
        var hj_6=HQIndexFormula.ARRAY_IF(HQIndexFormula.LLV(lowData,56),1,0);

        //HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
        //hj_7_temp=(HJ_3+HJ_5*2)/2,0)  太长了 这部分单独算下
        var hj_7_temp=HQIndexFormula.ARRAY_DIVIDE(HQIndexFormula.ARRAY_ADD(hj_3,HQIndexFormula.ARRAY_MULTIPLY(hj_5,2)),2);

        var hj_7=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.EMA(
                    HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_LTE(lowData,hj_4),hj_7_temp,0),
                    3
                ),
                618
            ),
            hj_6
        );

        //HJ_8:=HJ_7>REF(HJ_7,1);
        var hj_8=HQIndexFormula.ARRAY_GT(hj_7,HQIndexFormula.REF(hj_7,1));

        //HJ_9:=REF(LLV(LOW,100),3);
        var hj_9=HQIndexFormula.REF(HQIndexFormula.LLV(lowData,100),3);

        //HJ_10:=REFDATE(HJ_9,DATE); 用当日的数据 产生数组
        var hj_10=HQIndexFormula.REFDATE(hj_9,-1);

        //HJ_11:=LOW=HJ_10;
        var hj_11=HQIndexFormula.ARRAY_EQ(lowData,hj_10);

        //HJ_12:=HJ_8 AND HJ_11;
        var hj_12=HQIndexFormula.ARRAY_AND(hj_8,hj_11);
       
        var buyData=null;
        paint[0].Data.Data=hj_12;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
        }

        hqChart.TitlePaint[titleIndex].Title=this.FormatIndexTitle();

        return true;
    }
}


/*
    信息地雷
*/

/*
    信息地雷列表
*/
function JSKLineInfoMap()
{
}

JSKLineInfoMap.Get=function(id)
{
    var infoMap=new Map(
        [
            ["互动易",      {Create:function(){ return new InvestorInfo()}  }],
            ["公告",        {Create:function(){ return new AnnouncementInfo()}  }],
            ["业绩预告",    {Create:function(){ return new PforecastInfo()}  }],
            ["调研",        {Create:function(){ return new ResearchInfo()}  }],
            ["大宗交易",    {Create:function(){ return new BlockTrading()}  }],
            ["龙虎榜",      {Create:function(){ return new TradeDetail()}  }]
        ]
        );

    return infoMap.get(id);
}

JSKLineInfoMap.GetIconUrl=function(type)
{
    switch(type)
    {
        case KLINE_INFO_TYPE.INVESTOR:
            return g_JSChartResource.KLine.Info.Investor.Icon;
            break;
        case KLINE_INFO_TYPE.PFORECAST:
            return g_JSChartResource.KLine.Info.Pforecast.Icon;
        case KLINE_INFO_TYPE.ANNOUNCEMENT:
            return g_JSChartResource.KLine.Info.Announcement.Icon;
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4:
            return g_JSChartResource.KLine.Info.Announcement.IconQuarter;
        case KLINE_INFO_TYPE.RESEARCH:
            return g_JSChartResource.KLine.Info.Research.Icon;
        case KLINE_INFO_TYPE.BLOCKTRADING:
            return g_JSChartResource.KLine.Info.BlockTrading.Icon;
        case KLINE_INFO_TYPE.TRADEDETAIL:
            return g_JSChartResource.KLine.Info.TradeDetail.Icon;
        default:
            return g_JSChartResource.KLine.Info.Announcement.Icon;
    }
}


function IKLineInfo()
{
    this.MaxReqeustDataCount=1000;
    this.StartDate=20160101;
    this.Data;

    this.GetToday=function()
    {
        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        return today;
    }
}


/*
    互动易
*/
function InvestorInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Investor.ApiUrl,
            data:
            {
                "filed": ["question","answerdate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.list.length<=0) return;

        for(var i in recvData.list)
        {
            var item=recvData.list[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.answerdate;
            infoData.Title=item.question;
            infoData.InfoType=KLINE_INFO_TYPE.INVESTOR;
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    公告
*/
function AnnouncementInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Announcement.ApiUrl,
            data:
            {
                "filed": ["title","releasedate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.report.length<=0) return;

        for(var i in recvData.report)
        {
            var item=recvData.report[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.releasedate;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT;
            for(var j in item.type)
            {
                var typeItem=item.type[j];
                switch(typeItem)
                {
                    case "一季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1;
                        break;
                    case "半年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2;
                        break;
                    case "三季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3;
                        break;
                    case "年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4;
                        break;
                }
            }
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    业绩预告
*/
function PforecastInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Pforecast.ApiUrl,
            data:
            {
                "field": ["pforecast.type","pforecast.reportdate","fweek"],
                "condition":
                [
                    {"item":["pforecast.reportdate","int32","gte",this.StartDate]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];
            if (item.pforecast.length>0)
            {
                var dataItem=item.pforecast[0];
                var infoData=new KLineInfoData();
                infoData.Date= item.date;
                infoData.Title=dataItem.type;
                infoData.InfoType=KLINE_INFO_TYPE.PFORECAST;
                infoData.ExtendData={ Type:dataItem.type, ReportDate:dataItem.reportdate}
                if(item.fweek)  //未来周涨幅
                {
                    infoData.ExtendData.FWeek={};
                    if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                    if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
                }
                this.Data.push(infoData);
            }
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
   投资者关系 (调研)
*/
function ResearchInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Research.ApiUrl,
            data:
            {
                "filed": ["releasedate","researchdate","level","symbol","id"],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.list.length<=0) return;

        for(var i in recvData.list)
        {
            var item=recvData.list[i];
            var infoData=new KLineInfoData();
            infoData.ID=item.id;
            infoData.Date= item.researchdate;
            infoData.InfoType=KLINE_INFO_TYPE.RESEARCH;
            infoData.ExtendData={ Level:item.level };
            this.Data.push(infoData);

        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    大宗交易
*/
function BlockTrading()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.BlockTrading.ApiUrl,
            data:
            {
                "field": ["blocktrading.price","blocktrading.vol","blocktrading.premium","fweek","price"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["blocktrading.vol","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];
            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.BLOCKTRADING;
            infoData.ExtendData=
            {
                Price:item.blocktrading.price,          //交易价格
                Premium:item.blocktrading.premium,      //溢价 （百分比%)
                Vol:item.blocktrading.vol,              //交易金额单位（万元)
                ClosePrice:item.price,                  //收盘价
            };

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    龙虎榜
*/
function TradeDetail()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.TradeDetail.ApiUrl,
            data:
            {
                "field": ["tradedetail.typeexplain","tradedetail.type","fweek"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["tradedetail.type","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];

            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.TRADEDETAIL;
            infoData.ExtendData={Detail:new Array()};

            for(var j in item.tradedetail)
            {
                var tradeItem=item.tradedetail[j]; 
                infoData.ExtendData.Detail.push({"Type":tradeItem.type,"TypeExplain":tradeItem.typeexplain});
            }

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//是否是指数代码
function IsIndexSymbol(symbol)
{
    var upperSymbol=symbol.toUpperCase();
    if (upperSymbol.indexOf('.SH')>0)
    {
        upperSymbol=upperSymbol.replace('.SH','');
        if (upperSymbol.charAt(0)=='0' && parseInt(upperSymbol)<=3000) return true;

    }
    else if (upperSymbol.indexOf('.SZ')>0)
    {
        upperSymbol=upperSymbol.replace('.SZ','');
        if (upperSymbol.charAt(0)=='3' && upperSymbol.charAt(1)=='9') return true;
    }
    else if (upperSymbol.indexOf('.CI')>0)  //自定义指数
    {
        return true;
    }

    return false;
}

//设置窗口基类
function IDivDialog(divElement)
{
    this.DivElement=divElement;     //父节点
    this.ID=null;                   //div id
    this.TimeOut=null;                   //定时器

    //隐藏窗口
    this.Hide=function()
    {
        $("#"+this.ID).hide();
    }

    //显示窗口
    this.Show=function(left,top,width,height)
    {
        //显示位置
        $("#"+this.ID).css({'display':'block','top':top+'px', "left":left+'px', "width":width+'px', "height":height+'px' });
    }
}


//修改指标
function ModifyIndexDialog(divElement)
{
    this.newMethod=IDivDialog;   //派生
    this.newMethod(divElement);
    delete this.newMethod;

    this.Title={ ID:Guid() };      //标题
    this.ParamList={ID:Guid() };   //参数列表  class='parameter-content'
    this.ParamData=[];              //{ ID:参数ID, Value:参数值}

    //创建
    this.Create=function()
    {
        this.ID=Guid();

        var div=document.createElement('div');
        div.className='jchart-modifyindex-box';
        div.id=this.ID;
        div.innerHTML=
        "<div class='parameter'>\
            <div class='parameter-header'>\
                <span></span>\
                <strong id='close' class='icon iconfont icon-guanbi'></strong>\
            </div>\
            <div class='parameter-content'><input/>MA</div>\
        <div class='parameter-footer'>\
            <button class='submit' >确定</button>\
            <button class='cancel' >取消</button>\
        </div>\
        </div>";

        this.DivElement.appendChild(div);

        //确定按钮
        $("#"+this.ID+" .submit").click(
            {
                divBox:this,
            },
            function(event)
            {
                event.data.divBox.Hide();
            });

        //给一个id 后面查找方便
        var titleElement=div.getElementsByTagName('span')[0];
        titleElement.id=this.Title.ID;

        var paramListElement=div.getElementsByClassName('parameter-content')[0];
        paramListElement.id=this.ParamList.ID;
    }

    //设置标题
    this.SetTitle=function(title)
    {
        $("#"+this.Title.ID).html(title);
    }

    //清空参数
    this.ClearParamList=function()
    {
        $("#"+this.ParamList.ID).empty();
        this.ParamData=[];
    }

    this.BindParam=function(chart,identify)
    {
        var windowIndex=chart.WindowIndex[identify];
        for(var i in windowIndex.Arguments)
        {
            var item=windowIndex.Arguments[i];
            if (item.Name==null || isNaN(item.Value)) break;

            var guid=Guid();
            var param = '<input class="row-line" id="'+guid+'" value="'+item.Value+'" type="number" step="1"/>'+ item.Name +'<br>';
            $("#"+this.ParamList.ID).append(param);

            this.ParamData.push({ID:guid,Value:item.Value});
        }

        //绑定参数修改事件
        for(var i in this.ParamData)
        {
            var item=this.ParamData[i];
            $("#"+item.ID).mouseup(
                {
                    Chart:chart,
                    Identify:identify,
                    ParamIndex:i   //参数序号
                },
                function(event)
                {
                    var value = parseInt($(this).val());                            //获取当前操作的input属性值，转化为整型
                    var chart=event.data.Chart;
                    var identify=event.data.Identify;
                    var paramIndex=event.data.ParamIndex;

                    chart.WindowIndex[identify].Arguments[paramIndex].Value = value;    //为参数属性重新赋值
                    chart.UpdateWindowIndex(identify);                              //调用更新窗口指标函数，参数用来定位窗口
                }
            )

            $("#"+item.ID).keyup(
                {
                    Chart:chart,
                    Identify:identify,
                    ParamIndex:i   //参数序号
                },
                function(event)
                {
                    var value = parseInt($(this).val());                            //获取当前操作的input属性值，转化为整型
                    var chart=event.data.Chart;
                    var identify=event.data.Identify;
                    var paramIndex=event.data.ParamIndex;

                    chart.WindowIndex[identify].Arguments[paramIndex].Value = value;    //为参数属性重新赋值
                    chart.UpdateWindowIndex(identify);                              //调用更新窗口指标函数，参数用来定位窗口
                }
            )
        }
    }

    //绑定取消事件
    this.BindCancel=function(chart,identify)
    {
        //取消按钮事件
        $("#"+this.ID+" .cancel").click(
            {
                Chart:chart,
                Identify:identify,
            },
            function(event)
            {
                var chart=event.data.Chart;
                var identify=event.data.Identify;

                chart.ModifyIndexDialog.RestoreParam(chart.WindowIndex[identify]);
                chart.UpdateWindowIndex(identify);
                chart.ModifyIndexDialog.Hide();
            }
        );

        //关闭和取消是一样的
        $("#"+this.ID+" #close").click(
            {
                Chart:chart,
                Identify:identify,
            },
            function(event)
            {
                var chart=event.data.Chart;
                var identify=event.data.Identify;

                chart.ModifyIndexDialog.RestoreParam(chart.WindowIndex[identify]);
                chart.UpdateWindowIndex(identify);
                chart.ModifyIndexDialog.Hide();
            }
        );
    }

    //还原参数
    this.RestoreParam=function(windowIndex)
    {
        for(var i in this.ParamData)
        {
            var item=this.ParamData[i];
            windowIndex.Arguments[i].Value=item.Value;
        }
    }

    //显示
    this.DoModal=function(event)
    {
        var chart=event.data.Chart;
        var identify=event.data.Identify;
        var dialog=chart.ModifyIndexDialog;

        if(!dialog) return;

        if (dialog.ID==null) dialog.Create();   //第1次 需要创建div
        dialog.SetTitle(chart.WindowIndex[identify].Name+" 指标参数设置");      //设置标题
        dialog.ClearParamList();            //清空参数
        dialog.BindParam(chart,identify);   //绑定参数
        dialog.BindCancel(chart,identify);  //绑定取消和关闭事件

        //居中显示
        var border=chart.Frame.ChartBorder;
        var scrollPos=GetScrollPosition();
        var left=border.GetLeft()+border.GetWidth()/2;
        var top=border.GetTop()+border.GetHeight()/2;
        left = left + border.UIElement.getBoundingClientRect().left+scrollPos.Left;
        top = top+ border.UIElement.getBoundingClientRect().top+scrollPos.Top;

        dialog.Show(left,top,200,200);      //显示

    }
}




//换指标
function ChangeIndexDialog(divElement)
{
    this.newMethod=IDivDialog;   //派生
    this.newMethod(divElement);
    delete this.newMethod;

    this.DivElement=divElement;   //父节点
    this.IndexTreeApiUrl="https://opensourcecache.zealink.com/cache/hqh5/index/commonindextree.json";      //数据下载地址

    this.Create=function()
    {
        var div=document.createElement('div');
        div.className='jchart-changeindex-box';
        div.id=this.ID;
        div.innerHTML=
        '<div class="target-panel">\n' +
            '            <div class="target-header">\n' +
            '                <span>换指标</span>\n' +
            '                <strong class="close-tar icon iconfont icon-guanbi"></strong>\n' +
            '            </div>\n' +
            '            <div class="target-content">\n' +
            '                <div class="target-left">\n' +
            '                    <input type="text">\n' +
            '                    <ul></ul>\n' +
            '                </div>\n' +
            '                <div class="target-right">\n' +
            '                    <ul></ul>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>';

        this.DivElement.appendChild(div);
    }

    //下载数据 如果上次下载过可以 可以不用下载
    this.ReqeustData=function()
    {
        if($(".target-left ul li").length>0){
            return false;
        }
        var url = this.IndexTreeApiUrl;
        $.ajax({
            url: url,
            type: 'get',
            success: function (res) {
                var item = res.list;
                changeIndexLeftList(item);   //处理左侧list列表
                changeIndexRightList(item);  //处理右侧内容列表
            }
        });

        //处理左侧list列表
        function changeIndexLeftList(item) {
            $.each(item,function(i,result){
                var htmlList;
                htmlList = '<li>' + result.node + '</li>';
                $(".target-left ul").append(htmlList);
            });
            //默认选中第一项
            $(".target-left ul li:first-child").addClass("active-list");
        }
        //处理右侧内容列表
        function changeIndexRightList(listNum) {
            var contentHtml;
            var conData = [];
            $.each(listNum,function(index,result){
                conData.push(result.list);
            })
            //页面初始化时显示第一个列表分类下的内容
            $.each(conData[0],function (i, res) {
                contentHtml = '<li id='+res.id+'>'+ res.name +'</li>';
                $(".target-right ul").append(contentHtml);
            })
            //切换list
            $(".target-left ul").delegate("li","click",function () {
                $(this).addClass("active-list").siblings().removeClass("active-list");
                var item = $(this).index();
                $(".target-right ul").html("");
                $.each(conData[item],function (i, res) {
                    contentHtml = '<li id='+res.id+'>'+ res.name +'</li>';
                    $(".target-right ul").append(contentHtml);
                })
            })
        }
    }

    this.BindClose=function(chart)
    {
        //关闭按钮
        $("#"+this.ID+" .close-tar").click(
            {
                Chart:chart
            },
            function(event)
            {
                var chart=event.data.Chart;
                chart.ChangeIndexDialog.Hide();
            }
        );
    }

    this.DoModal=function(event)
    {
        var chart=event.data.Chart;
        var identify=event.data.Identify;
        var dialog=chart.ChangeIndexDialog;

        if(!dialog) return;

        if (dialog.ID==null) dialog.Create();   //第1次 需要创建div
        dialog.ReqeustData();   //下载数据

        //切换窗口指标类型  每次委托事件执行之前，先用undelegate()解除之前的所有绑定
        changeIndeWindow();
        function changeIndeWindow() {
            $(".target-right ul").undelegate().delegate("li","click",function () {
                var idV = $(this).attr("id");
                chart.ChangeIndex(identify,idV);
                $(this).addClass("active-list").siblings().removeClass("active-list");
            });
        }

        //关闭弹窗
        dialog.BindClose(chart);

        //居中显示
        var border=chart.Frame.ChartBorder;
        var scrollPos=GetScrollPosition();
        var left=border.GetLeft()+border.GetWidth()/2;
        var top=border.GetTop()+border.GetHeight()/2;
        left = left + border.UIElement.getBoundingClientRect().left+scrollPos.Left;
        top = top+ border.UIElement.getBoundingClientRect().top+scrollPos.Top;
        dialog.Show(left,top,200,200);

    }
}


//信息地理tooltip
function KLineInfoTooltip(divElement)
{
    this.newMethod=IDivDialog;   //派生
    this.newMethod(divElement);
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

    this.Create=function()
    {
        this.ID=Guid();

        var div=document.createElement('div');
        div.className='jchart-klineinfo-tooltip';
        div.id=this.ID;
        div.innerHTML="<div class='title-length'></div>";
        this.DivElement.appendChild(div);
    }


    this.BindInfoList=function(infoType,infoList)
    {
        var strBox="<div class='total-list'>共"+infoList.length+"条</div>";
        var strText=[];
        for(var i in infoList)
        {
            var item=infoList[i];
            var strOld=item.Date;
            if(infoType==KLINE_INFO_TYPE.PFORECAST)
            {
                var reportDate=item.ExtendData.ReportDate;
                var year=parseInt(reportDate/10000);  //年份
                var day=reportDate%10000;   //比较 这个去掉年份的日期
                var reportType;
                if(day == 1231){
                    reportType = "年报"
                }else if(day == 331){
                    reportType = "一季度报"
                }else if(day == 630){
                    reportType = "半年度报"
                }else if(day == 930){
                    reportType = "三季度报"
                }

                var weekData="";
                if (item.ExtendData.FWeek)
                {
                    if (item.ExtendData.FWeek.Week1!=null) weekData+="一周后涨幅:<i class='increase' style='color:"+this.GetColor(item.ExtendData.FWeek.Week1.toFixed(2))+"'>"+ item.ExtendData.FWeek.Week1.toFixed(2)+"%</i>";
                    if (item.ExtendData.FWeek.Week4!=null) weekData+="&nbsp;四周后涨幅:<i class='increase' style='color:"+this.GetColor(item.ExtendData.FWeek.Week4.toFixed(2))+"'>"+ item.ExtendData.FWeek.Week4.toFixed(2)+"%</i>";
                    if (weekData.length>0) weekData="<br/>&nbsp;&nbsp;<i class='prorecast-week'>"+weekData+"</i>";
                }
                var strDate=item.Date.toString();
                var strNew=strDate.substring(0,4)+"-"+strDate.substring(4,6)+"-"+strDate.substring(6,8);  //转换时间格式
                strText+="<span>"+strNew+"&nbsp;&nbsp;"+year+reportType+item.Title+"&nbsp;"+weekData+"</span>";

            }
            else if (infoType==KLINE_INFO_TYPE.RESEARCH)    //调研单独处理
            {
                var levels=item.ExtendData.Level;
                var recPerson=[];
                if(levels.length==0){
                    recPerson = "<i>无</i>"
                }else{
                    for(var j in levels)
                    {
                        if(levels[j]==0){
                            recPerson+="<i style='color:#00a0e9'>证券代表&nbsp;&nbsp;&nbsp;</i>";
                        }else if(levels[j]==1){
                            recPerson+="<i>董秘&nbsp;&nbsp;&nbsp;</i>";
                        }else if(levels[j]==2){
                            recPerson+="<i style='color:#00a0e9'>总经理&nbsp;&nbsp;&nbsp;</i>";
                        }else if(levels[j]==3){
                            recPerson+="<i style='color:#00a0e9'>董事长&nbsp;&nbsp;&nbsp;</i>";
                        }
                    }
                }
                var strDate=item.Date.toString();
                var strNew=strDate.substring(0,4)+"-"+strDate.substring(4,6)+"-"+strDate.substring(6,8);  //转换时间格式
                strText+="<span>"+strNew+"&nbsp;&nbsp;&nbsp;接待:&nbsp;&nbsp;&nbsp;"+recPerson+"</span>";
            }else if(infoType==KLINE_INFO_TYPE.BLOCKTRADING)
            {
                var showPriceInfo = item.ExtendData;
                var strDate=item.Date.toString();
                var strNew=strDate.substring(0,4)+"-"+strDate.substring(4,6)+"-"+strDate.substring(6,8);  //转换时间格式
                strText+="<span><i class='date-tipbox'>"+strNew+"</i>&nbsp;&nbsp;<i class='tipBoxTitle'>成交价:&nbsp;"+showPriceInfo.Price.toFixed(2)+"</i><i class='tipBoxTitle'>收盘价:&nbsp;"+showPriceInfo.ClosePrice.toFixed(2)+
                    "</i><br/><i class='rate-discount tipBoxTitle'>溢折价率:&nbsp;<strong style='color:"+ this.GetColor(showPriceInfo.Premium.toFixed(2))+"'>"+
                    showPriceInfo.Premium.toFixed(2)+"%</strong></i><i class='tipBoxTitle'>成交量(万股):&nbsp;"+showPriceInfo.Vol.toFixed(2)+"</i></span>";
            }
            else if (infoType==KLINE_INFO_TYPE.TRADEDETAIL) //龙虎榜
            {
                /*var detail=[
                    "日价格涨幅偏离值达到9.89%",
                    "日价格涨幅偏离值达格涨幅偏离值达格涨幅偏离值达到9.89%"
                ]*/
                var detail=item.ExtendData.Detail;
                //格式：日期 上榜原因: detail[0].TypeExplain
                //                    detail[1].TypeExplain
                //      一周后涨幅: xx 四周后涨幅: xx
                var str=strOld.toString();
                var strNew=str.substring(0,4)+"-"+str.substring(4,6)+"-"+str.substring(6,8);  //转换时间格式
                var reasons = [];
                for(var i in detail){
                    reasons += "<i>"+detail[i].TypeExplain+"</i><br/>"
                    // reasons += detail[i] + "<br/>"
                }

                strText = "<span><i class='trade-time'>"+strNew+"&nbsp;&nbsp;&nbsp;上榜原因:&nbsp;&nbsp;</i><i class='reason-list'>"+reasons+"</i><br/><i class='trade-detall'>一周后涨幅:&nbsp;<strong style='color:"+
                    this.GetColor(item.ExtendData.FWeek.Week1.toFixed(2))+"'>"+ item.ExtendData.FWeek.Week1.toFixed(2)+
                    "%</strong>&nbsp;&nbsp;&nbsp;四周后涨幅:&nbsp;<strong style='color:"+this.GetColor(item.ExtendData.FWeek.Week4.toFixed(2))+";'>"+
                    item.ExtendData.FWeek.Week4.toFixed(2)+"%</strong></i></span>";
            }
            else
            {
                var str=strOld.toString();
                var strNew=str.substring(0,4)+"-"+str.substring(4,6)+"-"+str.substring(6,8);  //转换时间格式
                strText+="<span>"+strNew+"&nbsp;&nbsp;&nbsp;"+item.Title+"</span>";
            }
        }
        var titleInnerBox = $(".title-length").html(strText);

        $("#"+this.ID).html(titleInnerBox);

        //当信息超过8条时，添加“共XX条”统计总数
        if(infoList.length > 8){
            $("#"+this.ID).append(strBox);
        }
    }


    this.GetColor=function(price)
    {
        if(price>0) return this.UpColor;
        else if (price<0) return this.DownColor;
        else return this.UnchagneColor;
    }

    //显示窗口，改函数仅为KLineInfoTooltip使用
    this.Show=function(left,top,width,height,tooltip,times)
    {
        //显示位置
        $("#"+this.ID).css({'display':'block','top':top+'px', "left":left+'px', "width":width+'px', "height":height+'px' });

        function toolHide() {
            tooltip.Hide();
        }

        if (this.TimeOut!=null)
            clearTimeout(this.TimeOut); //清空上一次的定时器,防止定时器不停的被调用

        //设置窗口定时隐藏
        this.TimeOut=setTimeout(toolHide,times);

    }


    this.DoModal=function(event)
    {
        var chart=event.data.Chart;
        var infoType=event.data.InfoType;   //信息地雷类型
        var infoList=event.data.InfoList;    //信息数据列表
        var tooltip=chart.KLineInfoTooltip;

        if(!tooltip) return;
        if (tooltip.ID==null) tooltip.Create();   //第1次 需要创建div

        tooltip.BindInfoList(infoType,infoList);

        var left=event.pageX;
        var top=event.pageY+10;
        var widthTool=380;
        var heightTool=$("#"+tooltip.ID).height();

        if((left + widthTool) > chart.UIElement.getBoundingClientRect().width){
            left = left - widthTool;
        }
        /*if(top+heightTool>chart.UIElement.getBoundingClientRect().height){
            top=top-heightTool-45;
        }*/

        tooltip.Show(left,top,widthTool,"auto",tooltip,8000);
    }

    //鼠标离开
    this.Leave=function(event)
    {
        var chart=event.data.Chart;
        var tooltip=chart.KLineInfoTooltip;

        if(!tooltip || tooltip.ID==null) return;

        tooltip.Hide();
    }
}


//历史K线上双击 弹出分钟走势图框
function MinuteDialog(divElement)
{
    this.newMethod=IDivDialog;   //派生
    this.newMethod(divElement);
    delete this.newMethod;


    this.JSChart=null;
    this.Height=500;
    this.Width=600;
    this.Symbol;
    this.TradeDate;
    this.HistoryData;


    this.Create=function()
    {
        this.ID=Guid();
        var div=document.createElement('div');
        div.className='jchart-kline-minute-box';
        div.id=this.ID;
        div.innerHTML="<div><div class='minute-dialog-title'><span></span><strong class='close-munite icon iconfont icon-guanbi'></strong></div></div>";
        div.style.width=this.Height+'px';
        div.style.height=this.Width+'px';

        this.DivElement.appendChild(div);
        this.JSChart=JSChart.Init(div);


        var option=
        {
            Type:'历史分钟走势图',
            Symbol:this.Symbol,     //股票代码
            IsAutoUpate:false,       //是自动更新数据

            IsShowRightMenu:false,   //右键菜单
            HistoryMinute: { TradeDate:this.TradeDate, IsShowName:false, IsShowDate:false }   //显示的交易日期
        };

        this.JSChart.SetOption(option);
    }

    this.BindClose=function(chart)
    {
        //关闭按钮
        $("#"+this.ID+" .close-munite").click(
            {
                Chart:chart
            },
            function(event)
            {
                var chart=event.data.Chart;
                chart.MinuteDialog.Hide();
            }
        );
    }

    this.DoModal=function(event)
    {
        this.UpColor=g_JSChartResource.UpTextColor;
        this.DownColor=g_JSChartResource.DownTextColor;
        this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

        var chart=event.data.Chart;
        var tooltip=event.data.Tooltip;
        var dialog=chart.MinuteDialog;

        dialog.Symbol=chart.Symbol;
        dialog.TradeDate=tooltip.Data.Date;

        if(!dialog) return;
        if (dialog.ID==null)
        {
            dialog.Create();   //第1次 需要创建div
        }
        else
        {
            dialog.JSChart.JSChartContainer.TradeDate=dialog.TradeDate;
            dialog.JSChart.ChangeSymbol(this.Symbol);
        }

        var left=event.clientX;
        var top=event.clientY+10;

        dialog.Show(500,100,600,500);
        dialog.JSChart.OnSize();

        this.BindClose(chart);

        this.GetColor=function(price,yclse)
        {
            if(price>yclse) return this.UpColor;
            else if (price<yclse) return this.DownColor;
            else return this.UnchagneColor;
        }

        var strName = event.data.Chart.Name;
        var strData=event.data.Tooltip.Data;
        var date=new Date(parseInt(strData.Date/10000),(strData.Date/100%100-1),strData.Date%100);
        var strDate = strData.Date.toString();
        var strNewDate=strDate.substring(0,4)+"-"+strDate.substring(4,6)+"-"+strDate.substring(6,8);  //转换时间格式
        var str = "<span>"+strName+"</span>"+"<span>"+strNewDate+"</span>&nbsp;"+
            "<span style='color:"+this.GetColor(strData.Open,strData.YClose)+";'>开:"+strData.Open.toFixed(2)+"</span>"+
            "<span style='color:"+this.GetColor(strData.High,strData.YClose)+";'>高:"+strData.High.toFixed(2)+"</span>"+
            "<span style='color:"+this.GetColor(strData.Low,strData.YClose)+";'>低:"+strData.Low.toFixed(2)+"</span>"+
            "<span style='color:"+this.GetColor(strData.Close,strData.YClose)+";'>收:"+strData.Close.toFixed(2)+"</span>"+
            "<span style='color:"+this.VolColor+";'>量:"+IFrameSplitOperator.FormatValueString(strData.Vol,2)+"</span>"+
            "<span style='color:"+this.AmountColor+";'>额:"+IFrameSplitOperator.FormatValueString(strData.Amount,2)+"</span>";
        $(".minute-dialog-title span").html(str);
    }
}



//K线右键菜单类
// id:"kLinde"
function KLineRightMenu(divElement)
{
    this.newMethod=IDivDialog;   //派生
    this.newMethod(divElement);
    delete this.newMethod;

    this.option={};

    this.Create = function () {
        var _self = this;

        this.ID=Guid();

        _self.BindData();
        _self.BindEvent();
    }
    this.BindData=function(){
        var _self = this;

        var id=this.DivElement.id;
        var $body=$("#"+id);

        var $topMenu = $("<div />");
        $topMenu.attr("id", "topMenu_"+_self.ID).addClass("context-menu-wrapper topmenu").hide();
        $body.append($topMenu);

        var $topTable = $("<table />");
        $topTable.attr({ id: "topTable_" + _self.ID, cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
        $topMenu.append($topTable);

        $topTable.append(childrenList(_self.option.data));

        for (var i = 0; i < _self.option.data.length; i++) {
            var isHasChildren = typeof _self.option.data[i].children != "undefined";

            if (isHasChildren) {

                var $childMenu = $("<div />");
                $childMenu.attr({ id: "childMenu_"+_self.ID + i, "data-index": i }).addClass("context-menu-wrapper").hide();
                $body.append($childMenu);

                var $childTable = $("<table />");
                $childTable.attr({ id: "childTable_" + _self.ID + i, cellspacing: "0", cellpadding: "0" }).addClass("context-menu");
                $childMenu.append($childTable);

                $childTable.append(childrenList(_self.option.data[i].children));
            }
        }

        function childrenList(list) {
            var result = [];

            for (var i = 0; i < list.length; i++) {
                var isBorder = typeof list[i].isBorder != "undefined" && list[i].isBorder;

                var $tr = $("<tr />");
                $tr.addClass("font_Arial context-menu");
                if (isBorder)
                    $tr.addClass("border");

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
        }
    }

    this.Show=function (obj) {
        var _self = this;
        $.extend(_self.option, obj);

        //判断是否重复创建
        if (!_self.ID) _self.Create();

        var $topMenu = $("#topMenu_"+_self.ID),
            topWidth = $topMenu.outerWidth(),
            topHeight = $topMenu.outerHeight();

        var x = _self.option.x,
            y = _self.option.y;

        if (topWidth > _self.option.position.X + _self.option.position.W- x) //超过了右边距
            x = x - topWidth;

        if (topHeight > _self.option.position.Y +_self.option.position.H - y)//超过了下边距
            y = y - topHeight;

        $topMenu.hide();
        $topMenu.css({ position:"absolute",left: x + "px", top: y + "px" }).show();

        this.isInit = true;
    }

    this.Hide=function () {
        var _self = this;

        $("#topMenu_" + _self.ID).hide();
        $("[id^='childMenu_" + _self.ID + "']").hide();
    }

    this.BindEvent=function () {
        var _self = this;
        var $childMenu = $("[id^='childMenu_" + _self.ID + "']");

        $("#topTable_" + _self.ID).find("tr").mouseenter(function () {
            var $this = $(this),
                index = $this.index(),
                $topMenu = $("#topMenu_" + _self.ID),
                $child = $("#childMenu_" + _self.ID + index),
                trWidth = $this.outerWidth(),
                trHeight = $this.outerHeight();

            var left = $topMenu.position().left + trWidth + 1;
            var top = $topMenu.position().top + (trHeight * index);

            if (trWidth > _self.option.position.X + _self.option.position.W - left) //超过了右边距
                left = left - trWidth - $topMenu.outerWidth() - 2;

            if ($child.outerHeight() > _self.option.position.Y +_self.option.position.H - top)//超过了下边距
                top = $topMenu.position().top + $topMenu.outerHeight() - $child.outerHeight();

            $childMenu.hide();
            $child.css({ left: left + "px", top: top + "px" }).show();
        }).mouseleave(function () {
            var index = $(this).index();
            setTimeout(function () {
                if ($("#childMenu_" + _self.ID + index).attr("data-isShow") != 1) {
                    $("#childMenu_" + _self.ID + index).hide();
                }
            }, 10)

        }).click(function () {
            var $this = $(this);
            var index = $this.index();

            if ($.type(_self.option.data[index].click) == "function") {
                _self.option.data[index].click(_self.option.returnData);
                $this.hide();
            }
        });


        $childMenu.mouseenter(function () {
            $(this).attr("data-isShow", "1");
        }).mouseleave(function () {
            $(this).attr("data-isShow", "0");
        });

        $childMenu.find("tr").click(function () {
            var $this = $(this);
            var divIndex = parseInt($this.closest("div").attr("data-index"));
            var trIndex = $this.index();

            if ($.type(_self.option.data[divIndex].children[trIndex].click) == "function") {
                _self.option.data[divIndex].children[trIndex].click(_self.option.windowIndex || 1);
                $childMenu.hide();
            }
        });
    }

    this.GetPeriod=function (chart) {
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
        },{
            text: "1分",
            click: function () {
                chart.ChangePeriod(4);
            }
        },{
            text: "5分",
            click: function () {
                chart.ChangePeriod(5);
            }
        },{
            text: "15分",
            click: function () {
                chart.ChangePeriod(6);
            }
        },{
            text: "30分",
            click: function () {
                chart.ChangePeriod(7);
            }
        },{
            text: "60分",
            click: function () {
                chart.ChangePeriod(8);
            }
        }]
    }

    this.GetRight=function(chart){
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
    }

    this.GetIndex=function (chart) {
        return [{
            text: "均线",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, '均线')
            }
        }, {
            text: "BOLL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BOLL')
            },
            isBorder:true
        }, {
            text: "MACD",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'MACD')
            }
        }, {
            text: "KDJ",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'KDJ')
            }
        }, {
            text: "VOL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'VOL')
            }
        }, {
            text: "RSI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'RSI')
            }
        }, {
            text: "BRAR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BRAR')
            }
        }, {
            text: "WR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'WR')
            }
        }, {
            text: "BIAS",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'BIAS')
            }
        }, {
            text: "OBV",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'OBV')
            }
        }, {
            text: "DMI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'DMI')
            }
        }, {
            text: "CR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'CR')
            }
        }, {
            text: "PSY",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'PSY')
            }
        }, {
            text: "CCI",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'CCI')
            }
        }, {
            text: "DMA",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'DMA')
            }
        }, {
            text: "TRIX",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'TRIX')
            }
        }, {
            text: "VR",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'VR')
            }
        }, {
            text: "EMV",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'EMV')
            }
        }, {
            text: "ROC",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'ROC')
            }
        }, {
            text: "MIM",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'MIM')
            }
        }, {
            text: "FSL",
            click: function (windowIndex) {
                chart.ChangeIndex(windowIndex, 'FSL')
            }
        }, ]
    }
    this.GetOverlay=function (chart) {
        return [{
            text: "上证指数",
            click: function () {
                chart.OverlaySymbol('000001.sh');
            }
        },{
            text: "深证成指",
            click: function () {
                chart.OverlaySymbol('399001.sz');
            }
        }, {
            text: "中小板指",
            click: function () {
                chart.OverlaySymbol('399005.sz');
            }
        }, {
            text: "创业板指",
            click: function () {
                chart.OverlaySymbol('399006.sz');
            }
        }, {
            text: "沪深300",
            click: function () {
                chart.OverlaySymbol('000300.sh');
            }
        }, {
            text: "取消叠加",
            click: function () {
                chart.ClearOverlaySymbol();
            }
        }];
    }

    this.DoModal=function(event)
    {
        var chart=event.data.Chart;
        var rightMenu=chart.RightMenu;
        var x = event.offsetX;
        var y = event.offsetY;

        var dataList=[{
            text: "切换周期",
            children: this.GetPeriod(chart)
        }, {
            text: "行情复权",
            children: this.GetRight(chart)
        }, {
            text: "指标",
            children: this.GetIndex(chart)
        }, {
            text: "叠加品种",
            children: this.GetOverlay(chart)
        }];

        if(IsIndexSymbol(chart.Symbol)){
            dataList.splice(1,1);
        }

        var identify=event.data.Identify;
        rightMenu.Show({
            windowIndex :identify,
            x:x+chart.UIElement.offsetLeft,
            y:y+chart.UIElement.offsetTop,
            position:chart.Frame.Position,
            data:dataList
        })

        $(document).click(function () {
            rightMenu.Hide();
        });
    }
}





