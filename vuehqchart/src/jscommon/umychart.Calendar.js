/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装日历控件 (H5版本)
   使用新的class语法
*/

class JSCalendarChart
{
    DivElement=null;
    JSChartContainer=null;              //表格控件
    ResizeListener=null;                //大小变动监听
    CanvasElement=null;

    constructor(divElement)
    {
        this.DivElement=divElement;

        //h5 canvas
        this.CanvasElement=document.createElement("canvas");
        this.CanvasElement.className='jsorderlist-drawing';
        this.CanvasElement.id=Guid();
        this.CanvasElement.setAttribute("tabindex",0);
        if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
        if(divElement.hasChildNodes())
        {
            JSConsole.Chart.Log("[JSCalendarChart::JSOrderChart] divElement hasChildNodes", divElement.childNodes);
        }
        divElement.appendChild(this.CanvasElement);
    }

    OnSize()
    {
        //画布大小通过div获取
        var height=this.DivElement.offsetHeight;
        var width=this.DivElement.offsetWidth;
        if (this.DivElement.style.height && this.DivElement.style.width)
        {
            if (this.DivElement.style.height.includes("px"))
                height=parseInt(this.DivElement.style.height.replace("px",""));
            if (this.DivElement.style.width.includes("px"))
                width=parseInt(this.DivElement.style.width.replace("px",""));
        }
        
        this.CanvasElement.height=height;
        this.CanvasElement.width=width;
        this.CanvasElement.style.width=this.CanvasElement.width+'px';
        this.CanvasElement.style.height=this.CanvasElement.height+'px';

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.CanvasElement.height*=pixelTatio;
        this.CanvasElement.width*=pixelTatio;

        JSConsole.Chart.Log(`[JSCalendarChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    SetOption(option)
    {
        var chart=this.CreateJSCalendarChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        //注册事件
        if (IFrameSplitOperator.IsNonEmptyArray(option.EventCallback))
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        if (option.EnableResize==true) this.CreateResizeListener();

        //if (option.FloatTooltip && option.FloatTooltip.Enable) chart.InitalFloatTooltip(option.FloatTooltip);   //提示信息

        chart.GotoToday();
        chart.Draw();
    }

    CreateResizeListener()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSCalendarChart::OnDivResize] entries=", entries);
        this.OnSize();
    }

    CreateJSCalendarChartContainer(option)
    {
        var chart=new JSCalendarChartContainer(this.CanvasElement);
        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;

        this.SetChartBorder(chart, option);

        //是否自动更新
        if (option.IsAutoUpdate!=null) chart.IsAutoUpdate=option.IsAutoUpdate;
        if (option.AutoUpdateFrequency>0) chart.AutoUpdateFrequency=option.AutoUpdateFrequency;

        var calendarChart=chart.GetCalendarChart();

        //注册事件
        if (option.EventCallback)
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        return chart;
    }

    SetChartBorder(chart, option)
    {
        if (!option.Border) return;

        var item=option.Border;
        if (IFrameSplitOperator.IsNumber(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
        if (IFrameSplitOperator.IsNumber(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
        if (IFrameSplitOperator.IsNumber(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        if (IFrameSplitOperator.IsNumber(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        chart.Frame.ChartBorder.Left*=pixelTatio;
        chart.Frame.ChartBorder.Right*=pixelTatio;
        chart.Frame.ChartBorder.Top*=pixelTatio;
        chart.Frame.ChartBorder.Bottom*=pixelTatio;
    }

    //事件回调
    AddEventCallback(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSCalendarChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    ReloadResource(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSCalendarChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    ChartDestroy()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestroy) == 'function') 
        {
            this.JSChartContainer.ChartDestroy();
        }
    }

    SetMarkData(aryData, opiton)
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.SetMarkData) == 'function') 
        {
            this.JSChartContainer.SetMarkData(aryData, opiton);
        }
    }


    //初始化 静态方法
    static Init(divElement)
    {
        var jsChartControl=new JSCalendarChart(divElement);
        jsChartControl.OnSize();

        return jsChartControl;
    }
}

class JSCalendarChartContainer
{
    ClassName='JSCalendarChartContainer';
    Frame;                                     //框架画法
    ChartPaint=[];                             //图形画法
    Canvas=null;         //画布

    NetworkFilter=null;                                                     //数据回调接口
    Data=
    { 
        Current:{ Year:null, Month:null,},  //标题栏显示年和月份
        Days:[ ], // 日期 { Text:, Date:, Week:1, Type: 0 当前月 -1 上个月 1=下个月 }
        Months:[], //月份 { Text:"1月", Date:20260100, Month:1 }
        MapDayMarks:new Map(),   //日期标记 key=date vallue={ Date:, Type, }
    };                                        
    
    //事件回调
    MapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    AutoUpdateTimer=null;
    AutoUpdateFrequency=15000; //更新频率

    FloatTooltip=null;          //提示浮框
    
    UIElement=null;
    LastPoint={ X:null, Y:null };     //鼠标位置

    //MouseOnStatus:{ RowIndex:行, ColumnIndex:列} 
    LastMouseStatus={ MoveStatus:null, TooltipStatus:null, MouseOnStatus:null };

    //日期限制
    DateLimit={ End:{ Enable:false, Date:null }, Start:{ Enable:false, Date:null } };

    IsDestroy=false;        //是否已经销毁了

    constructor(uielement)
    {
        this.Canvas=uielement.getContext("2d");         //画布
        this.UIElement=uielement;
    }

    ChartDestroy()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();

        this.DestroyFloatTooltip();
    }

    HideFloatTooltip()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Hide();
    }

    DestroyFloatTooltip()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Destroy();
        this.FloatTooltip=null;
    }

    InitalFloatTooltip(option)
    {
        if (this.FloatTooltip) return;

        this.FloatTooltip=new JSFloatTooltip();
        this.FloatTooltip.Inital(this, option);
        this.FloatTooltip.Create();
    }

    DrawFloatTooltip(point,toolTip)
    {
        if (!this.FloatTooltip) return;

        this.UpdateFloatTooltip(point, toolTip)
    }

    HideAllTooltip()
    {
        this.HideFloatTooltip();
    }

    //设置事件回调
    //{event:事件id, callback:回调函数}
    AddEventCallback(object)
    {
        if (!object || !object.event || !object.callback) return;

        var data={Callback:object.callback, Source:object};
        this.MapEvent.set(object.event,data);
    }

    //创建
    //windowCount 窗口个数
    Create(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建框架
        this.Frame=new JSCalendarFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        //创建表格
        var chart=new ChartCalendar();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.Data=this.Data;
        chart.DateLimit=this.DateLimit;
        chart.SetOption(option);
        this.ChartPaint[0]=chart;

        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.BorderLine)) this.Frame.BorderLine=option.BorderLine;   //边框
            if (option.GotoBasePage)
            {
                var item=option.GotoBasePage;
                if (IFrameSplitOperator.IsNumber(item.Frequency)) this.GotoBasePageConfig.Frequency=item.Frequency;
                if (IFrameSplitOperator.IsBool(item.Enable)) this.GotoBasePageConfig.Enable=item.Enable;
            }

            if (option.DateLimit)
            {
                var item=option.DateLimit;
                if (item.End)
                {
                    var subItem=item.End;
                    if (IFrameSplitOperator.IsBool(subItem.Enable)) this.DateLimit.End.Enable=subItem.Enable;
                    if (subItem.Date===null || IFrameSplitOperator.IsNumber(subItem.Date)) this.DateLimit.End.Date=subItem.Date;
                }
                if (item.Start)
                {
                    var subItem=item.Start;
                    if (IFrameSplitOperator.IsBool(subItem.Enable)) this.DateLimit.End.Enable=subItem.Enable;
                    if (subItem.Date===null || IFrameSplitOperator.IsNumber(subItem.Date)) this.DateLimit.End.Date=subItem.Date;
                }
            }
        }

        var bRegisterKeydown=true;
        var bRegisterWheel=true;

        if (option)
        {
            if (option.KeyDown===false) 
            {
                bRegisterKeydown=false;
                JSConsole.Chart.Log('[JSOrderChartContainer::Create] not register keydown event.');
            }

            if (option.Wheel===false) 
            {
                bRegisterWheel=false;
                JSConsole.Chart.Log('[JSOrderChartContainer::Create] not register wheel event.');
            }

            if (IFrameSplitOperator.IsBool(option.EnableSelected)) chart.SelectedData.Enable=option.EnableSelected;
        }

        //if (bRegisterKeydown) this.UIElement.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true);            //键盘消息
        if (bRegisterWheel) this.UIElement.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true);                  //上下滚动消息

        
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        //this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        //this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        
    }

    UIOnMouseDown(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.GetCalendarChart();
        if (!chart) return false;
        
        var clickData=chart.OnMouseDown(x,y,e);
        if (!clickData) return;

        if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.YEAR_UP_ARROW_ID) 
        {
            this.GotoPreviousYear({ Draw:true }); 
        }
        else if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.YEAR_DOWN_ARROW_ID)
        {
            this.GotoNextYear({ Draw:true });
        }
        else if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_UP_ARROW_ID) 
        {
            this.GotoPreviousMonth({ Draw:true }); 
        }
        else if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_DOWN_ARROW_ID) 
        {
            this.GotoNextMonth({ Draw:true });
        }
        else if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_TITLE_ID)
        {
            chart.ChangeType(1);
            var year=this.Data.Current.Year;
            this.GotoMulitMonth(year,1, {Draw:true});
        }
        else if (clickData.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_CELL_ID)
        {
            chart.ChangeType(0);
            var date=clickData.Data.Date;
            var year=parseInt(date/10000);
            var month=parseInt(date/100)%100;
            this.GotoMonth(year, month, { Draw:true });
        }
        else if (clickData.Type==JSCHART_CALENDAR_BUTTON_ID.DAY_CELL_ID)
        {
            var eventID=JSCHART_EVENT_ID.ON_CLICK_CALENDAR_DAY_CELL;
            if (e && e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_CALENDAR_DAY_CELL;

            var sendData={ Data:clickData.Data, X:x, Y:y, e:e, PreventDefault:false }
            this.SendClickEvent(eventID, sendData);
            if (sendData.PreventDefault) return;

            chart.SetSelectedDay([{Date:clickData.Data.Date}]);

            this.Draw();
        }

    }

    GetEventCallback(id)  //获取事件回调
    {
        if (!this.MapEvent.has(id)) return null;
        var item=this.MapEvent.get(id);
        return item;
    }

    SendClickEvent(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
    }

    UIOnMouseMove(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        
        var oldMouseOnStatus=this.LastMouseStatus.MouseOnStatus;
        this.LastMouseStatus.OnMouseMove=null;

        var bDrawTooltip=false;
        if (this.LastMouseStatus.TooltipStatus) bDrawTooltip=true;
        this.LastMouseStatus.TooltipStatus=null;
        var chartTooltipData=null;
        this.LastMouseStatus.OnMouseMove={ X:x, Y:y };
        var mouseStatus={ Cursor:"default", Name:"Default"};;   //鼠标状态
        
        var chart=this.GetCalendarChart();
        var bDraw=false;
        var cell=null;
        if (chart)
        {
            var data=chart.OnMouseOn(x, y, e);  //单元格提示信息
            if (data)
            {
                if (data.Redraw===true) bDraw=data.Redraw;
                if (data.Cell)
                {
                    cell=data.Cell;
                    bDrawTooltip=true;
                }
                //this.LastMouseStatus.TooltipStatus={ X:x, Y:y, Data:tooltipData, ClientX:e.clientX, ClientY:e.clientY };
            }
        }

        if (bDraw) this.Draw();

        //this.SendMouseOnEvent({ Data:cell, X:x, Y:y, FuncName:"UIOnMouseMove" });

        if (this.LastMouseStatus.TooltipStatus) 
        {
            var xTooltip = e.clientX-this.UIElement.getBoundingClientRect().left;
            var yTooltip = e.clientY-this.UIElement.getBoundingClientRect().top;
            //this.DrawFloatTooltip({X:xTooltip, Y:yTooltip, YMove:20/pixelTatio},this.LastMouseStatus.TooltipStatus.Data);
        }
        else
        {
            this.HideFloatTooltip();
        }
    }

    UIOnMouseleave(e)
    {
        this.ClearMoveOnStatus("UIOnMouseleave");

        this.HideAllTooltip();
    }

    UIOnMounseOut(e)
    {
        this.ClearMoveOnStatus("UIOnMouseleave");

        this.HideAllTooltip();
    }

    ClearMoveOnStatus(funcName)
    {
        var chart=this.GetCalendarChart();
        if (!chart) return;

        if (!chart.MoveOnData.Data) return;
        
        chart.MoveOnData.Data=null;
        this.Draw();
    }

    OnWheel(e)    //滚轴
    {
        JSConsole.Chart.Log('[JSCalendarChartContainer::OnWheel]',e);
        if (!this.Data) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);
        if (!isInClient) return;

        var chart=this.GetCalendarChart();
        if (!chart) return;
        
        var wheelValue=e.wheelDelta;
        if (!IFrameSplitOperator.IsObjectExist(e.wheelDelta))
            wheelValue=e.deltaY* -0.01;

        var option={ };
        
        var pageType=0;
        var bDraw=false;
        if (wheelValue<0)   //下
        {
            this.HideAllTooltip();
            if (chart.Type===1)
            {
                if (this.MoveNextMulitMonth(option)) bDraw=true;
            }
            else
            {
                if (this.MoveNextWeek(option)) bDraw=true;
            }
        }
        else if (wheelValue>0)  //上
        {
            this.HideAllTooltip();
            if (chart.Type===1)
            {
                if (this.MovePreviousMulitMonth(option)) bDraw=true;
            }
            else
            {
                if (this.MovePreviousWeek(option)) bDraw=true;
            }
        }

        if (bDraw) this.Draw();

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    MoveNextWeek(option)
    {
        var chart=this.GetCalendarChart();
        if (!chart) return;
        var range=chart.GetDateLimitRange();
        var end=range.End;
        var item=this.Data.Days[14];
        if (item.Date>=end) return false;

        var aryDay=[];
        var endDate=null;
        for(var i=7; i<this.Data.Days.length;++i)
        {
            var item=this.Data.Days[i];
            aryDay.push(item);
            endDate=item.Date;
        }

        var year=parseInt(endDate/10000);
        var month=parseInt(endDate/100)%100;
        var day=endDate%100;

        var curDate=new Date(year,month-1, day);

        for(var i=0; i<7; ++i)
        {
            curDate.setDate(curDate.getDate() + 1);
            var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100+curDate.getDate();
            var dayItem={ Day: curDate.getDate(), Week:this.GetWeekDayNum(curDate), Date:date, Type:-1 };
            dayItem.Text=`${dayItem.Day}`
            aryDay.push(dayItem);
        }

        this.Data.Days=aryDay;
        this.CalculateCurrentMonth();

        return true;
    }

    MovePreviousWeek(option)
    {
        var aryDay=this.Data.Days.slice();
        var startDate=aryDay[0].Date;
        
        var year=parseInt(startDate/10000);
        var month=parseInt(startDate/100)%100;
        var day=startDate%100;

        var curDate=new Date(year,month-1, day);
        for(var i=0; i<7; ++i)
        {
            curDate.setDate(curDate.getDate() - 1);
            var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100+curDate.getDate();
            var dayItem={ Day: curDate.getDate(), Week:this.GetWeekDayNum(curDate), Date:date, Type:-1 };
            dayItem.Text=`${dayItem.Day}`
            aryDay.unshift(dayItem);
        }

        if (aryDay.length>42) aryDay.length=42;

        this.Data.Days=aryDay;
        this.CalculateCurrentMonth();

        return true;
    }

    CalculateCurrentMonth()
    {
        var mapMonth=new Map();
        for(var i=0; i<this.Data.Days.length;++i)
        {
            var item=this.Data.Days[i];
            var value=parseInt(item.Date/100);
            if (mapMonth.has(value))
            {
                mapMonth.get(value).Count++;
            }
            else
            {
                mapMonth.set(value, { Month: value, Count:1 });
            }
        }

        var maxItem=null;
        for (var mapItem of mapMonth) 
        {
            // 首次赋值 或 当前值更大则替换
            if (!maxItem || mapItem[1].Count > maxItem.Count) 
                maxItem=mapItem[1];
        }

        for(var i=0; i<this.Data.Days.length;++i)
        {
            var item=this.Data.Days[i];
            var value=parseInt(item.Date/100);
            if (value>maxItem.Month) item.Type=1;
            else if (value<maxItem.Month) item.Type=-1;
            else item.Type=0;
        }

        this.Data.Current.Year=parseInt(maxItem.Month/100);
        this.Data.Current.Month=maxItem.Month%100;
    }


    GetCalendarChart()
    {
        return this.ChartPaint[0];
    }

    Draw()
    {
        if (this.UIElement.width<=0 || this.UIElement.height<=0) return; 

        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.Canvas.lineWidth=pixelTatio;       //手机端需要根据分辨率比调整线段宽度

        this.Frame.Draw();
        this.Frame.DrawLogo();
       
        //框架内图形
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.IsDrawFirst)
                item.Draw();
        }

        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw();
        }
    }

    OnSize()
    {
        if (!this.Frame) return;

        this.SetSizeChange(true);

        this.Draw();
    }

    SetSizeChange(bChanged)
    {
        var chart=this.GetCalendarChart();
        if (chart) chart.SizeChange=bChanged;
    }

    GetWeekDayNum(date)
    {
        const d = date.getDay();
        return d === 0 ? 7 : d;
    };

    GetDays(year, month)
    {
        // 当月第一天
        const firstDate = new Date(year, month - 1, 1);
        // 当月最后一天
        const lastDate = new Date(year, month, 0);
        const dayCount = lastDate.getDate();

        // getDay：0周日 1周一 ... 6周六
        // 转换规则：周一=0，周日=6
        let firstDayIndex = firstDate.getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        // ========== 1、前置填充上个月日期 ==========
        const aryPreDay=[];
        // 上月最后一天
        const prevLastDate = new Date(year, month - 1, 0);
        for (var i = firstDayIndex; i >= 0; i--) 
        {
            var curDate = new Date(prevLastDate);
            curDate.setDate(prevLastDate.getDate() - i);
            var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100+curDate.getDate();
            aryPreDay.push({ Day: curDate.getDate(), Week:this.GetWeekDayNum(curDate), Date:date, Type:-1 });
        }

        // ========== 2、填充当月全部日期 ==========
        const aryDays = [];
        for (var d = 1; d <= dayCount; d++) 
        {
            var curDate = new Date(year, month - 1, d);
            var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100+curDate.getDate();
            aryDays.push({ Day: curDate.getDate(), Week:this.GetWeekDayNum(curDate), Date:date, Type:0 });
        }

        // 合并前置 + 当月
        var allDays = [...aryPreDay, ...aryDays];

        // ========== 3、尾部填充下个月日期，凑满7天整行 ==========
        var fillCount = 6*7-allDays.length;
        if (fillCount>0) 
        {
            // 下月第一天
            let nextDate = new Date(year, month, 1);
            for (var i = 1; i <= fillCount; i++) 
            {
                var curDate = new Date(nextDate);
                curDate.setDate(nextDate.getDate() + i - 1);
                var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100+curDate.getDate();
                allDays.push({ Day: curDate.getDate(), Week:this.GetWeekDayNum(curDate),  Date:date, Type:1 });
            }
        }

        return allDays;
    }

    GetMonths(year, month)
    {
        const curDate = new Date(year, month - 1, 1);

        var aryMonth=[];
        for(var i=0;i<16;++i)
        {
            var month=curDate.getMonth()+1;
            var date=curDate.getFullYear()*10000+(curDate.getMonth()+1)*100;

            aryMonth.push({ Month:curDate.getMonth()+1, Date:date })
            curDate.setMonth(curDate.getMonth()+1);
        }

        return aryMonth;
    }

    GotoToday(option)
    {
        var chart=this.GetCalendarChart();
        if (!chart) return;

        var today=new Date();
        var year=today.getFullYear();
        var month=today.getMonth()+1;

        if (chart.Type===1) this.GotoMulitMonth(year, 1, option);
        else this.GotoMonth(year, month, option);
    }

    GotoMonth(year, month, option)
    {
        var aryDay=this.GetDays(year, month);

        this.Data.Days=[];
        for(var i=0;i<aryDay.length;++i)
        {
            var item=aryDay[i];
            var dayItem={ Date:item.Date, Type:item.Type, Week:item.Week, Day:item.Day };
            dayItem.Text=`${dayItem.Day}`
            this.Data.Days.push(dayItem);
        }

        this.Data.Current.Year=year;
        this.Data.Current.Month=month;

        if (option)
        {
            if (option.Draw===true) this.Draw();
        }
    }

    GotoNextMonth(option)
    {
        var curDate=new Date(this.Data.Current.Year,this.Data.Current.Month-1, 1);
        curDate.setMonth(curDate.getMonth()+1);

        var year=curDate.getFullYear();
        var month=curDate.getMonth()+1;

        var chart=this.GetCalendarChart();
        if (!chart) return;
        var range=chart.GetDateLimitRange();
        var end=parseInt(range.End/100);
        if (year*100+month>end) return false;

        this.GotoMonth(year, month, option);
    }

    GotoPreviousMonth(option)
    {
        var curDate=new Date(this.Data.Current.Year,this.Data.Current.Month-1, 1);
        curDate.setMonth(curDate.getMonth()-1);

        var year=curDate.getFullYear();
        var month=curDate.getMonth()+1;

        this.GotoMonth(year, month, option);
    }



    GotoMulitMonth(year, month, option)
    {
        var aryMonth=this.GetMonths(year, month);

        this.Data.Months=[];
        for(var i=0;i<aryMonth.length;++i)
        {
            var item=aryMonth[i];
            var dayItem={ Date:item.Date, Month:item.Month };
            dayItem.Text=`${dayItem.Month}月`;
            this.Data.Months.push(dayItem);
        }

        var item=this.Data.Months[9];
        var curYear=parseInt(item.Date/10000);

        for(var i=0;i<this.Data.Months.length;++i)
        {
            var item=this.Data.Months[i];
            var value=parseInt(item.Date/10000);
            if (value>curYear) item.Type=1;
            else if (value<curYear) item.Type=-1;
            else item.Type=0;
        }

        this.Data.Current.Year=curYear;
        this.Data.Current.Month=null;

        if (option)
        {
            if (option.Draw===true) this.Draw();
        }
    }

    GotoNextYear(option)
    {
        var item=this.Data.Months[0];
        var year=parseInt(item.Date/10000);
        var month=parseInt(item.Date/100)%100;

        var curDate=new Date(year,month-1, 1);
        curDate.setFullYear(curDate.getFullYear()+1);

        var year=curDate.getFullYear();

        var chart=this.GetCalendarChart();
        if (!chart) return;
        var range=chart.GetDateLimitRange();
        var end=parseInt(range.End/10000);
        if (year>end) return false;

        this.GotoMulitMonth(year,1,option);
    }

    GotoPreviousYear(option)
    {
        var item=this.Data.Months[0];
        var year=parseInt(item.Date/10000);
        var month=parseInt(item.Date/100)%100;

        var curDate=new Date(year,month-1, 1);
        curDate.setFullYear(curDate.getFullYear()-1);

        this.GotoMulitMonth(curDate.getFullYear(),1,option);
    }

    MoveNextMulitMonth(option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Months)) return false;

        var chart=this.GetCalendarChart();
        if (!chart) return;
        var range=chart.GetDateLimitRange();
        var end=range.End;
        var item=this.Data.Months[8];
        if (item.Date>end) return false;


        var item=this.Data.Months[0];
        var year=parseInt(item.Date/10000);
        var month=parseInt(item.Date/100)%100;

        var curDate=new Date(year,month-1, 1);
        curDate.setMonth(curDate.getMonth()+4);

        this.GotoMulitMonth(curDate.getFullYear(),curDate.getMonth()+1,option);

        return true;
    }

    MovePreviousMulitMonth(option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Months)) return false;

        var item=this.Data.Months[0];
        var year=parseInt(item.Date/10000);
        var month=parseInt(item.Date/100)%100;

        var curDate=new Date(year,month-1, 1);
        curDate.setMonth(curDate.getMonth()-4);

        this.GotoMulitMonth(curDate.getFullYear(),curDate.getMonth()+1,option);

        return true;
    }

    ReloadResource(option)
    {
        this.Frame.ReloadResource(option);
        
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.ReloadResource) item.ReloadResource(option);
        }

        if (option && (option.Redraw || option.Draw))
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    ClearMarks()
    {
        this.Data.MapDayMarks=new Map();
    }

    //{ Date:20250101, Type:0, Color:可选, Radius:可选,  YOffset:可选 }
    SetMarkData(aryData, option)
    {
        this.Data.MapDayMarks=new Map();
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) return;

        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            if (!IFrameSplitOperator.IsPlusNumber(item.Date)) continue;

            this.Data.MapDayMarks.set(item.Date, item);
        }

        if (option)
        {
            if (option.Draw===true) this.Draw();
        }
    }
}


var JSCHART_CALENDAR_BUTTON_ID=
{
    MONTH_TITLE_ID:0,
    YEAR_TITLE_ID:1,

    DAY_CELL_ID:11,
    MONTH_CELL_ID:12,

    MONTH_UP_ARROW_ID:51,
    MONTH_DOWN_ARROW_ID:52,

    YEAR_UP_ARROW_ID:53,
    YEAR_DOWN_ARROW_ID:54,
};

class JSCalendarFrame
{
    ChartBorder;
    Canvas;                            //画布

    //BorderColor=g_JSChartResource.DealList.BorderColor;    //边框线

    LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    LogoTextFont=g_JSChartResource.FrameLogo.Font;

    ReloadResource(resource)
    {
        this.BorderColor=g_JSChartResource.DealList.BorderColor;    //边框线
        this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
        this.LogoTextFont=g_JSChartResource.FrameLogo.Font;
    }

    Draw(option)
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;
    }

    DrawLogo()
    {
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetLeft()+5;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
    }
}

class ChartCalendar
{
    Canvas=null;                        //画布
    ChartBorder=null;                   //边框信息
    ChartFrame=null;                    //框架画法
    Name=null;                          //名称
    ClassName='ChartCalendar';     //类名
    IsDrawFirst=false;
    GetEventCallback=null;
    Data=null;                          //数据 { Days:[ { Date:, Text: } ], Offset: }
    SizeChange=true;
    Type=0;                             //0=日 1=月 2=年

    TitleConfig=
    { 
        IsShow:g_JSChartResource.Calendar.Title.IsShow, 
        HRate:g_JSChartResource.Calendar.Title.HRate, 
        Color:g_JSChartResource.Calendar.Title.Color,
        BGMargin:CloneData(g_JSChartResource.Calendar.Title.BGMargin),
        Arrow:CloneData(g_JSChartResource.Calendar.Title.Arrow),
        MoveOn:CloneData(g_JSChartResource.Calendar.Title.MoveOn),
        Font:CloneData(g_JSChartResource.Calendar.Title.Font),
    } // HRate=高度占比

    WeekTitleConfig=
    { 
        Color:g_JSChartResource.Calendar.WeekTitle.Color,
        HRate:g_JSChartResource.Calendar.WeekTitle.HRate,  
        Type:g_JSChartResource.Calendar.WeekTitle.Type,     //Type 0=1-7 1=1-5
        AryText:[ "", "一", "二", "三", "四", "五", "六", "日" ],
        Font:CloneData(g_JSChartResource.Calendar.WeekTitle.Font)
    };     

    DayConfig=
    { 
        Text:CloneData(g_JSChartResource.Calendar.Day.Text),
        MoveOn:CloneData(g_JSChartResource.Calendar.Day.MoveOn),
        Today:CloneData(g_JSChartResource.Calendar.Day.Today),
        Font:CloneData(g_JSChartResource.Calendar.Day.Font),
        Selected:CloneData(g_JSChartResource.Calendar.Day.Selected),
    }

    MarkDayConfig=
    {
        Dots:CloneData(g_JSChartResource.Calendar.MarkDay.Dots),
    }

    MonthConfig=
    {
        Text:CloneData(g_JSChartResource.Calendar.Month.Text),
        MoveOn:CloneData(g_JSChartResource.Calendar.Month.MoveOn),
        Today:CloneData(g_JSChartResource.Calendar.Month.Today),
        Font:CloneData(g_JSChartResource.Calendar.Month.Font),
    }

    ArySelectedDay=[ ];      //选中的日期 [{ Date:20260618 } ]

    //缓存
    RectClient=null;
    MoveOnData={ Data:null, Enable:true };                         //鼠标在上面
    AryCellRect=[];

    SetOption(option)
    {
        if (!option) return;

        if (option.Title)
        {
            var item=option.Title;
            if (IFrameSplitOperator.IsBool(item.IsShow)) this.TitleConfig.IsShow=item.IsShow;
            if (IFrameSplitOperator.IsNumber(item.Type)) this.Type=item.Type;
        }
    }

    ReloadResource(resource)
    {
        this.TitleConfig.HRate=g_JSChartResource.Calendar.Title.HRate;
        this.TitleConfig.Color=g_JSChartResource.Calendar.Title.Color;
        this.TitleConfig.BGMargin=CloneData(g_JSChartResource.Calendar.Title.BGMargin);
        this.TitleConfig.Arrow=CloneData(g_JSChartResource.Calendar.Title.Arrow);
        this.TitleConfig.MoveOn=CloneData(g_JSChartResource.Calendar.Title.MoveOn);
        this.TitleConfig.Font=CloneData(g_JSChartResource.Calendar.Title.Font);
        
        this.WeekTitleConfig.Color=g_JSChartResource.Calendar.WeekTitle.Color;
        this.WeekTitleConfig.HRate=g_JSChartResource.Calendar.WeekTitle.HRate;  
        this.WeekTitleConfig.Type=g_JSChartResource.Calendar.WeekTitle.Type;    
        this.WeekTitleConfig.Font=CloneData(g_JSChartResource.Calendar.WeekTitle.Font);
         
        this.DayConfig.Text=CloneData(g_JSChartResource.Calendar.Day.Text);
        this.DayConfig.MoveOn=CloneData(g_JSChartResource.Calendar.Day.MoveOn);
        this.DayConfig.Today=CloneData(g_JSChartResource.Calendar.Day.Today);
        this.DayConfig.Font=CloneData(g_JSChartResource.Calendar.Day.Font);
        this.DayConfig.Selected=CloneData(g_JSChartResource.Calendar.Day.Selected);

        this.MarkDayConfig.Dots=CloneData(g_JSChartResource.Calendar.MarkDay.Dots),
    
   
        this.MonthConfig.Text=CloneData(g_JSChartResource.Calendar.Month.Text);
        this.MonthConfig.MoveOn=CloneData(g_JSChartResource.Calendar.Month.MoveOn);
        this.MonthConfig.Today=CloneData(g_JSChartResource.Calendar.Month.Today);
        this.MonthConfig.Font=CloneData(g_JSChartResource.Calendar.Month.Font);
    }

    ChangeType(type)
    {
        this.Type=type;
        this.SizeChange=true;
    }

    Draw()
    {
        this.AryCellRect=[];
        if (this.SizeChange) this.CalculateSize();

        
        if (this.Type===1)
        {
            this.DrawTitle();
            this.DrawMonths();
        }
        else if (this.Type===2)
        {
            this.DrawTitle();
            this.DrawYears();
        }
        else
        {
            this.DrawTitle();
            this.DrawWeekTitle();
            this.DrawDays();
        }

        this.SizeChange=false;
    }

    GetWeekTitleInfo()
    {
        if (this.WeekTitleConfig.Type===1) return { Count:5, AryWeek:[ 1,2,3,4,5 ] }
        else return { Count:7, AryWeek:[1,2,3,4,5,6,7]};
    }


    CalculateDayModeSize()
    {
        var border=this.ChartBorder.GetBorder();
        var weekTitle=this.GetWeekTitleInfo();
        var colCount=weekTitle.Count;

        this.RectClient={ Left:border.Left, Top:border.Top, Bottom:border.Bottom, Right:border.Right };
        this.RectClient.Width=this.RectClient.Right-this.RectClient.Left;
        this.RectClient.Height=this.RectClient.Bottom-this.RectClient.Top;
        var weekHeight=this.RectClient.Height*this.WeekTitleConfig.HRate;
        var titleHeight=0;
        if (this.TitleConfig.IsShow) titleHeight=this.RectClient.Height*this.TitleConfig.HRate;
        this.RectClient.WeekHeight=weekHeight;
        this.RectClient.TitleHeight=titleHeight;

        var dateHeight=this.RectClient.Height-weekHeight-titleHeight;
        this.RectClient.Cell={ Width:this.RectClient.Width/colCount, Height:dateHeight/6 };
    }

    CalculateMonthModeSize()
    {
        var border=this.ChartBorder.GetBorder();
        var colCount=4;

        this.RectClient={ Left:border.Left, Top:border.Top, Bottom:border.Bottom, Right:border.Right };
        this.RectClient.Width=this.RectClient.Right-this.RectClient.Left;
        this.RectClient.Height=this.RectClient.Bottom-this.RectClient.Top;
        var titleHeight=0;
        if (this.TitleConfig.IsShow) titleHeight=this.RectClient.Height*this.TitleConfig.HRate;
        this.RectClient.TitleHeight=titleHeight;

        var dateHeight=this.RectClient.Height-titleHeight;
        this.RectClient.Cell={ Width:this.RectClient.Width/colCount, Height:dateHeight/4 };
    }

    CalculateSize()   //计算大小
    {
        if (this.Type===1) this.CalculateMonthModeSize();
        else this.CalculateDayModeSize();
    }

    DrawTitleMoveOnBG(rtBG, config)
    {
        if (!config || !config.BGColor) return;

        if (config.Type===1)
        {
            this.Canvas.fillStyle=config.BGColor;
            this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
        }
        else
        {
            var radius=[3];
            if (config.RoundRect && IFrameSplitOperator.IsNonEmptyArray(config.RoundRect.Radius)) radius=config.RoundRect.Radius;
            var path=new Path2D();
            path.roundRect(ToFixedPoint(rtBG.Left), ToFixedPoint(rtBG.Top), ToFixedRect(rtBG.Width), ToFixedRect(rtBG.Height), radius);
            this.Canvas.fillStyle=config.BGColor;
            this.Canvas.fill(path);
        }
    }

    DrawTitle()
    {
        var config=this.TitleConfig;
        if (!config.IsShow) return;

        if (!this.Data || !this.Data.Current) return;

        if (this.Type==1) var text=`${this.Data.Current.Year}年`;
        else var text=`${this.Data.Current.Year}年${this.Data.Current.Month}月`;

        var top=this.RectClient.Top;
        var left=this.RectClient.Left;
        var cellSize=this.RectClient.Cell;
        const fontSize = this.RectClient.TitleHeight*config.Font.SizeRate;
        var font=`${fontSize}px ${config.Font.Family}`;

        this.Canvas.font=font;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";

        var margin=config.BGMargin;
        var rtCell={ Left:left+margin.Left, Top:top+margin.Top, Width:this.RectClient.Width-2*cellSize.Width-(margin.Left+margin.Right), Height:this.RectClient.TitleHeight-(margin.Top+margin.Bottom) };
        rtCell.Right=rtCell.Left+rtCell.Width;
        rtCell.Bottom=rtCell.Top+rtCell.Height;

        var btnTitleID=JSCHART_CALENDAR_BUTTON_ID.MONTH_TITLE_ID;
        if (this.Type===1) btnTitleID=JSCHART_CALENDAR_BUTTON_ID.YEAR_TITLE_ID;
        this.AryCellRect.push({ Type:btnTitleID, Rect:rtCell, Data:this.Data.Current });

        var bMoveOnTitle=false;
        if (this.MoveOnData && this.MoveOnData.Data)
        {
            var item=this.MoveOnData.Data;
            if (item.Type===btnTitleID)
            {
                this.DrawTitleMoveOnBG(rtCell, config.MoveOn);
                bMoveOnTitle=true;
            }
        }
        
        var xText=left+cellSize.Width*0.3;
        var yText=this.RectClient.Top+this.RectClient.TitleHeight/2+fontSize/2;
        var color=config.Color;
        if (bMoveOnTitle && config.MoveOn.Color) color=config.MoveOn.Color;
        this.Canvas.fillStyle=color;
        this.Canvas.fillText(text, xText, yText);

        // 上下箭头
        var rtDown={ Top:rtCell.Top, Bottom:rtCell.Bottom, Width:rtCell.Height, Height:rtCell.Height };
        rtDown.Right=this.RectClient.Right-cellSize.Width*0.3;
        rtDown.Left=rtDown.Right-rtDown.Width;
        var btnDownID=JSCHART_CALENDAR_BUTTON_ID.MONTH_DOWN_ARROW_ID;
        if (this.Type===1) btnDownID=JSCHART_CALENDAR_BUTTON_ID.YEAR_DOWN_ARROW_ID;

        this.AryCellRect.push({ Type:btnDownID, Rect:rtDown, Data:null });

        var bMoveOnArrow=false;
        if (this.MoveOnData && this.MoveOnData.Data)
        {
             var item=this.MoveOnData.Data;
            if (item.Type===btnDownID)
            {
                this.DrawTitleMoveOnBG(rtDown, config.MoveOn);
                bMoveOnArrow=true;
            }
        }

        this.DrawTitleArrow(rtDown, 1);

        var rtUp={ Top:rtCell.Top, Bottom:rtCell.Bottom, Width:rtCell.Height, Height:rtCell.Height };
        rtUp.Right=rtDown.Left-cellSize.Width*0.1;
        rtUp.Left=rtUp.Right-rtUp.Width;
        var btnUpID=JSCHART_CALENDAR_BUTTON_ID.MONTH_UP_ARROW_ID;
        if (this.Type===1) btnUpID=JSCHART_CALENDAR_BUTTON_ID.YEAR_UP_ARROW_ID;

        this.AryCellRect.push({ Type:btnUpID, Rect:rtUp, Data:null });

        var bMoveOnArrow=false;
        if (this.MoveOnData && this.MoveOnData.Data)
        {
            var item=this.MoveOnData.Data;
            if (item.Type===btnUpID)
            {
                this.DrawTitleMoveOnBG(rtUp, config.MoveOn);
                bMoveOnArrow=true;
            }
        }

        this.DrawTitleArrow(rtUp, 0);

    }

    DrawTitleArrow(rtCell, type)
    {
        var config=this.TitleConfig;
        const scale = config.Arrow.Scale;       // 缩放比值，1=最大
        const triSide = rtCell.Width * scale;
        const triH = Math.sqrt(3) / 2 * triSide;

        // 区域内居中偏移
        const offsetX = (rtCell.Width - triSide) / 2;
        const offsetY = (rtCell.Height - triH) / 2;

        // 三角形起始坐标（加上rtCell左上角）
        const x0 = rtCell.Left + offsetX;
        const y0 = rtCell.Top + offsetY;

        // 绘制等边三角形
        if (type===0)
        {
            this.Canvas.beginPath();
            this.Canvas.moveTo(x0 + triSide / 2, y0);        // 顶部顶点
            this.Canvas.lineTo(x0, y0 + triH);                // 左下角
            this.Canvas.lineTo(x0 + triSide, y0 + triH);      // 右下角
            this.Canvas.closePath();
        }
        else
        {
            this.Canvas.beginPath();
            this.Canvas.moveTo(x0, y0);
            this.Canvas.lineTo(x0 + triSide, y0);
            this.Canvas.lineTo(x0 + triSide / 2, y0 + triH);
            this.Canvas.closePath();
        }
        
        this.Canvas.fillStyle = config.Arrow.Color;
        this.Canvas.fill();
    }

    DrawWeekTitle()
    {
        var config=this.WeekTitleConfig;
        var weekTitle=this.GetWeekTitleInfo();
        var colCount=weekTitle.Count;

        var yTop=this.RectClient.Top+this.RectClient.TitleHeight;
        var left=this.RectClient.Left;
        var cellSize=this.RectClient.Cell;
        const fontSize = this.RectClient.WeekHeight*config.Font.SizeRate;
        var font=`${fontSize}px ${config.Font.Family}`;

        this.Canvas.font=font;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";

        var xCell=left, yCell=yTop;
        for(var i=0; i<colCount; ++i)
        {
            var value=weekTitle.AryWeek[i];
            var text=config.AryText[value];

            var rtCell={ Left:xCell, Top:yCell, Width:cellSize.Width, Height:this.RectClient.WeekHeight };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;

            if ((i%2)===0)
            {
                //this.Canvas.fillStyle="rgb(250,100,0)";
                //this.Canvas.fillRect(rtCell.Left,rtCell.Top,rtCell.Width,rtCell.Height);
            }

            if (text)
            {
                var textWidth=this.Canvas.measureText(text).width;
                var xText=rtCell.Left+(rtCell.Width-textWidth)/2;
                var yText=rtCell.Top+rtCell.Height/2+fontSize/2;

                this.Canvas.fillStyle=config.Color;
                this.Canvas.fillText(text, xText, yText);
            }

            xCell=rtCell.Right;
        }
    }

    DrawMonths()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Months)) return;

        var colCount=4;
        var config=this.MonthConfig;
        var cellSize=this.RectClient.Cell;
        const dayFontSize = Math.min(cellSize.Width, cellSize.Height)*config.Font.SizeRate;
        var dayFont=`${dayFontSize}px ${config.Font.Family}`;

        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100;
        var range=this.GetDateLimitRange();

        this.Canvas.font=dayFont;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        
        var left=this.RectClient.Left;
        var xCell=left, yCell=this.RectClient.Top+this.RectClient.TitleHeight;
        var xText, yText;
        for(var i=0, j=0; i<this.Data.Months.length;++i)
        {
            var dayItem=this.Data.Months[i];
            var rtCell={ Left:xCell, Top:yCell, Width:cellSize.Width, Height:cellSize.Height };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;

            var bDisable=(dayItem.Date>range.End || dayItem.Date<range.Start);

            var bMoveOn=false;
            var bToday=false;
            if (today===dayItem.Date)
            {
                this.Canvas.fillStyle=config.Today.BGColor;
                var radius=Math.min(cellSize.Width, cellSize.Height)*0.40;
                var x=rtCell.Left+rtCell.Width/2, y=rtCell.Top+rtCell.Height/2;
                this.Canvas.beginPath();
                this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
                this.Canvas.fill();
                bToday=true;
            }
            else if (this.MoveOnData && this.MoveOnData.Data)
            {
                var item=this.MoveOnData.Data;
                if (item.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_CELL_ID && item.Data.Date==dayItem.Date)
                {
                    if (config.MoveOn.BGColor)
                    {
                        this.Canvas.fillStyle=config.MoveOn.BGColor;
                        var radius=Math.min(cellSize.Width, cellSize.Height)*0.42;
                        var x=rtCell.Left+rtCell.Width/2, y=rtCell.Top+rtCell.Height/2;
                        this.Canvas.beginPath();
                        this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
                        this.Canvas.fill();

                        //this.Canvas.fillRect(rtCell.Left,rtCell.Top,rtCell.Width,rtCell.Height);
                    }
                    bMoveOn=true;
                }
            }

            if (!bDisable) this.AryCellRect.push({ Type:JSCHART_CALENDAR_BUTTON_ID.MONTH_CELL_ID, Rect:rtCell, Data:dayItem });
           
            if (dayItem.Text)
            {
                var textWidth=this.Canvas.measureText(dayItem.Text).width;
                xText=rtCell.Left+(rtCell.Width-textWidth)/2;
                yText=rtCell.Top+rtCell.Height/2+dayFontSize/2+config.Text.YOffset;

                var color=config.Text.Color[0];
                if (dayItem.Type!==0) color=config.Text.Color[1];
                if (bDisable) color=config.Text.Color[2];
                if (bMoveOn && config.MoveOn.Color) color=config.MoveOn.Color;
                if (bToday && config.Today.Color)  color=config.Today.Color;

                this.Canvas.fillStyle=color;
                this.Canvas.fillText(dayItem.Text, xText, yText);
            }
            
            xCell=rtCell.Right;
            if (j>0 && ((j+1)%colCount)==0)     //换行
            {
                yCell=rtCell.Bottom;
                xCell=left
            }
                
            ++j;
        }
    }

    DayYears()
    {

    }

    IsSelectedDay(date)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.ArySelectedDay)) return false;

        for(var i=0;i<this.ArySelectedDay.length;++i)
        {
            var item=this.ArySelectedDay[i];
            if (item.Date==date) return true;
        }

        return false;
    }

    GetDateLimitRange()
    {
        var range={ Start:0, End:99999999 };    //范围
        if (!this.DateLimit) return range;

        if (this.DateLimit.End)
        {
            var item=this.DateLimit.End;
            if (item.Enable)
            {
                var date=new Date();
                range.End=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
                if (IFrameSplitOperator.IsPlusNumber(item.Date)) range.End=item.Date;
            }
        }

        if (this.DateLimit.Start)
        {
            var item=this.DateLimit.Start;
            if (item.Enable)
            {
            if (IFrameSplitOperator.IsPlusNumber(item.Date)) range.Start=item.Date;
            }
        }

        return range;
    }

    GetMarkItemByDate(date)
    {
        if (!this.Data.MapDayMarks.has(date)) return null;

        return this.Data.MapDayMarks.get(date);
    }

    DrawDays()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Days)) return;

        var weekTitle=this.GetWeekTitleInfo();
        var colCount=weekTitle.Count;
        var config=this.DayConfig;
        var cellSize=this.RectClient.Cell;
        const dayFontSize = Math.min(cellSize.Width, cellSize.Height)*config.Font.SizeRate;;
        var dayFont=`${dayFontSize}px ${config.Font.Family}`;

        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        var range=this.GetDateLimitRange();

        this.Canvas.font=dayFont;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        
        var left=this.RectClient.Left;
        var xCell=left, yCell=this.RectClient.Top+this.RectClient.WeekHeight+this.RectClient.TitleHeight;
        var xText, yText;
        for(var i=0, j=0; i<this.Data.Days.length;++i)
        {
            var dayItem=this.Data.Days[i];
            var rtCell={ Left:xCell, Top:yCell, Width:cellSize.Width, Height:cellSize.Height };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;

            if (!weekTitle.AryWeek.includes(dayItem.Week)) continue;

            var bDisable=(dayItem.Date>range.End || dayItem.Date<range.Start);
            
            var bMoveOn=false;
            var bToday=false;
            if (today===dayItem.Date)
            {
                this.Canvas.fillStyle=config.Today.BGColor;
                var radius=Math.min(cellSize.Width, cellSize.Height)*config.Today.RadiusRate;
                var x=rtCell.Left+rtCell.Width/2, y=rtCell.Top+rtCell.Height/2;
                this.Canvas.beginPath();
                this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
                this.Canvas.fill();
                bToday=true;
            }
            else if (this.MoveOnData && this.MoveOnData.Data)
            {
                var item=this.MoveOnData.Data;
                if (item.Type===JSCHART_CALENDAR_BUTTON_ID.DAY_CELL_ID && item.Data.Date==dayItem.Date)
                {
                    if (config.MoveOn.BGColor)
                    {
                        this.Canvas.fillStyle=config.MoveOn.BGColor;
                        var radius=Math.min(cellSize.Width, cellSize.Height)*config.MoveOn.RadiusRate;
                        var x=rtCell.Left+rtCell.Width/2, y=rtCell.Top+rtCell.Height/2;
                        this.Canvas.beginPath();
                        this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
                        this.Canvas.fill();

                        //this.Canvas.fillRect(rtCell.Left,rtCell.Top,rtCell.Width,rtCell.Height);
                    }
                    bMoveOn=true;
                }
            }

            if (this.IsSelectedDay(dayItem.Date))
            {
                var radius=Math.min(cellSize.Width, cellSize.Height)*config.Selected.RadiusRate;
                var x=rtCell.Left+rtCell.Width/2, y=rtCell.Top+rtCell.Height/2;
                var color=config.Selected.BorderColor[0];
                if (bToday) 
                {
                    radius-=2;
                    color=config.Selected.BorderColor[1];
                }
                this.Canvas.strokeStyle=color;
                this.Canvas.beginPath();
                this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
                this.Canvas.closePath();
                this.Canvas.stroke();
            }

            if (!bDisable)
                this.AryCellRect.push({ Type:JSCHART_CALENDAR_BUTTON_ID.DAY_CELL_ID, Rect:rtCell, Data:dayItem  });
        
            yText=rtCell.Top+rtCell.Height/2+dayFontSize/2+config.Text.YOffset; //文字底部
            if (dayItem.Text)
            {
                var textWidth=this.Canvas.measureText(dayItem.Text).width;
                xText=rtCell.Left+(rtCell.Width-textWidth)/2;

                var color=config.Text.Color[0];
                if (dayItem.Type!==0) color=config.Text.Color[1];
                if (bDisable) color=config.Text.Color[2];
                if (bMoveOn && config.MoveOn.Color) color=config.MoveOn.Color;
                if (bToday && config.Today.Color)  color=config.Today.Color;

                this.Canvas.fillStyle=color;
                this.Canvas.fillText(dayItem.Text, xText, yText);
            }

            var markItem=this.GetMarkItemByDate(dayItem.Date);
            
            if (markItem) this.DrawMarkDay(dayItem, markItem, rtCell, yText);
            
            xCell=rtCell.Right;
            if (j>0 && ((j+1)%colCount)==0)     //换行
            {
                yCell=rtCell.Bottom;
                xCell=left
            }
                
            ++j;
        }
    }

    DrawMarkDay(dayItem, markItem, rtCell, yText)
    {
        var config=this.MarkDayConfig;
        var radius=config.Dots.Radius;
        var yOffset=config.Dots.YOffset;
        var color=config.Dots.Color;

        if (markItem.Color) color=markItem.Color;
        if (IFrameSplitOperator.IsNumber(markItem.YOffset)) yOffset=markItem.YOffset;
        if (IFrameSplitOperator.IsNumber(markItem.Radius)) radius=markItem.Radius;

        var x=rtCell.Left+rtCell.Width/2;
        var y=yText+yOffset;
        this.Canvas.fillStyle=color;
        this.Canvas.beginPath();
        this.Canvas.arc(x, y, radius, 0, Math.PI * 2);
        this.Canvas.fill();
    }

    PtInCell(x,y)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryCellRect)) return null;

        for(var i=0;i<this.AryCellRect.length;++i)
        {
            var item=this.AryCellRect[i];
            var rtCell=item.Rect;
            if (x>=rtCell.Left && x<=rtCell.Right && y>=rtCell.Top && y<=rtCell.Bottom)
            {
                var data={ Rect:rtCell, Type:item.Type, Data:item.Data };
                return data;
            }
        }

        return null;
    }

    OnMouseOn(x,y,e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};
        var uiElement;
        if (this.UIElement) uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else uiElement={Left:null, Top:null};

        var bDraw=false;
        var cell=this.PtInCell(x,y);
        if (cell)
        {
            bDraw=false;
            var selData=this.MoveOnData.Data;
            if (selData && cell.Type==selData.Type)
            {
                if (cell.Type===JSCHART_CALENDAR_BUTTON_ID.DAY_CELL_ID || cell.Type===JSCHART_CALENDAR_BUTTON_ID.MONTH_CELL_ID)
                {
                    if (cell.Data.Date!=selData.Data.Date)
                    {
                        this.MoveOnData.Data={ Type:cell.Type, Data:cell.Data };
                        bDraw=true;
                    }
                }
            }
            else
            {
                this.MoveOnData.Data={ Type:cell.Type, Data:cell.Data };
                bDraw=true;
            }

            return { Redraw:bDraw, Cell:cell }
        }


        if (this.MoveOnData.Data)
        {
            this.MoveOnData.Data=null;
            bDraw=true;
        }

        return { Redraw:bDraw, Cell:null }
    }


    OnMouseDown(x,y,e)
    {
        var cell=this.PtInCell(x,y);
        if (!cell) return null;

        var bDraw=false;
        
        return { Type:cell.Type, Redraw:bDraw, Data:cell.Data };
    }

    SetSelectedDay(aryData)
    {
        this.ArySelectedDay=[];
        if (IFrameSplitOperator.IsNonEmptyArray(aryData)) this.ArySelectedDay=aryData.slice();
    }

}



