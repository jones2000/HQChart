/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装键盘精灵控件 (页面版 不支持手机)
*/



function JSKeyboardChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

     //h5 canvas
     this.CanvasElement=document.createElement("canvas");
     this.CanvasElement.className='jskeyboard-drawing';
     this.CanvasElement.id=Guid();
     this.CanvasElement.setAttribute("tabindex",0);
     if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
     if(divElement.hasChildNodes())
     {
         JSConsole.Chart.Log("[JSKeyboardChart::JSRepoJSKeyboardChartrtChart] divElement hasChildNodes", divElement.childNodes);
     }
     divElement.appendChild(this.CanvasElement);


    this.OnSize=function()
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

        JSConsole.Chart.Log(`[JSKeyboardChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSKeyboardChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        //注册事件
        if (option.EventCallback)
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        if (option.EnableResize==true) this.CreateResizeListener();

        chart.Draw();
    }

    this.CreateJSKeyboardChartContainer=function(option)
    {
        var chart=new JSKeyboardChartContainer(this.CanvasElement);
        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;
        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (IFrameSplitOperator.IsNumber(option.BorderLine)) chart.Frame.BorderLine=option.BorderLine;

        this.SetChartBorder(chart, option);

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

    this.SetChartBorder=function(chart, option)
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

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSKeyboardChart::OnDivResize] entries=", entries);
        this.OnSize();
    }

    /////////////////////////////////////////////////////////////////////////////
    //对外接口
    this.SetColumn=function(aryColumn, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.SetColumn(aryColumn,option);
    }

    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    this.ChartDestory=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestory) == 'function') 
        {
            this.JSChartContainer.ChartDestory();
        }
    }

    this.Draw=function()
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Draw)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }

    this.SetSymbolData=function(arySymbol)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Draw)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:SetSymbolData] ', arySymbol);
            this.JSChartContainer.SetSymbolData(arySymbol);
        }
    }

    this.Search=function(strText)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Search)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:Search] ', strText);
            this.JSChartContainer.Search(strText);
        }
    }

    this.OnKeyDown=function(event)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.OnKeyDown)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:OnKeyDown] ', event);
            this.JSChartContainer.OnKeyDown(event);
        }
    }

    this.ClearSearch=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ClearSearch)=='function')
        {
            JSConsole.Chart.Log('[JSKeyboardChart:ClearSearch] ', option);
            this.JSChartContainer.ClearSearch(option);
        }
    }
}

JSKeyboardChart.Init=function(divElement)
{
    var jsChartControl=new JSKeyboardChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSKeyboardChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}


function JSKeyboardChartContainer(uielement)
{
    this.ClassName='JSKeyboardChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法
    this.Canvas=uielement.getContext("2d");         //画布
    this.ShowCanvas=null;

    this.NetworkFilter;                                 //数据回调接口
    this.Data={ XOffset:0, YOffset:0, Data:[] };        //股票列表
    this.MapSymbol=new Map();
    this.SourceData={ Data:[] }                                //码表数据 Data:[ { Symbol:, Spell, Name:, Color:}] 

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.UIElement=uielement;
    this.LastPoint=new Point();     //鼠标位置
   
    //拖拽滚动条
    this.DragYScroll=null;  //{Start:{x,y}, End:{x, y}}

    this.IsDestroy=false;        //是否已经销毁了

    this.ChartDestory=function()    //销毁
    {
        this.IsDestroy=true;
    }

    this.ClearSearch=function(option)
    {
        this.Data.Data=[];
        this.Data.XOffset=0;
        this.Data.YOffset=0;

        if (option && option.Redraw==true) this.Draw();
    }

    this.Search=function(strText)
    {
        var aryExactQuery=[];   //精确查询
        var aryFuzzyQuery=[];   //模糊查询
        this.MapSymbol.clear();
        this.Data.Data=[];
        this.Data.XOffset=0;
        this.Data.YOffset=0;

        var strSearch=strText.trim();
        if (strSearch.length>0)
        {
            for(var i=0;i<this.SourceData.Data.length;++i)
            {
                var item=this.SourceData.Data[i];
                if (this.SearchSymbol(item, strSearch, aryExactQuery, aryFuzzyQuery)) continue;
                else if (this.SearchSpell(item, strSearch, aryExactQuery, aryFuzzyQuery)) continue;
            }
        }
        
        if (IFrameSplitOperator.IsNonEmptyArray(aryExactQuery) || IFrameSplitOperator.IsNonEmptyArray(aryFuzzyQuery))
            this.Data.Data=aryExactQuery.concat(aryFuzzyQuery);

        this.ChartPaint[0].SelectedRow=0;
        this.ChartPaint[0].SizeChange=true;

        JSConsole.Chart.Log(`[JSKeyboardChart:Search] search=${strSearch}, source=${this.SourceData.Data.length} match=${this.Data.Data.length}`);

        this.Draw();
    }

    this.SearchSymbol=function(item, strText, aryExactQuery, aryFuzzyQuery)
    {
        var find=item.Symbol.indexOf(strText);
        if (find<0) return false;

        if (find==0) aryExactQuery.push(item.Symbol);
        else aryFuzzyQuery.push(item.Symbol);

        this.MapSymbol.set(item.Symbol, item);
        
        return true;
    }

    this.SearchSpell=function(item, strText, aryExactQuery, aryFuzzyQuery)
    {
        if (!IFrameSplitOperator.IsString(item.Spell)) return false;

        var find=item.Spell.indexOf(strText);

        if (find!=0) return false;

        aryExactQuery.push(item.Symbol);
        this.MapSymbol.set(item.Symbol, item);

        return true;
    }


    this.SetSymbolData=function(arySymbol)
    {
        this.SourceData.Data=arySymbol;
        
        /*
        //测试
        this.MapSymbol.clear();
        for(var i=0;i<this.SourceData.Data.length && i<3050 ;++i)
        {
            var item=this.SourceData.Data[i];
            this.Data.Data.push(item.Symbol);
            this.MapSymbol.set(item.Symbol, item);
        }
        this.ChartPaint[0].SelectedRow=0;
        */
    }

    //创建
    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建框架
        this.Frame=new JSKeyboardFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        //创建表格
        var chart=new ChartSymbolList();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetStockDataCallback=(symbol)=>{ return this.GetStockData(symbol);}
        chart.Data=this.Data;
        this.ChartPaint[0]=chart;

        chart.VScrollbar=new ChartKeyboardVScrollbar();
        chart.VScrollbar.Frame=this.Frame;
        chart.VScrollbar.Canvas=this.Canvas;
        chart.VScrollbar.ChartBorder=this.Frame.ChartBorder;
        chart.VScrollbar.Report=chart;

        if (option)
        {
            
        }

        var bRegisterKeydown=true;
        var bRegisterWheel=true;

        if (option)
        {
            if (option.KeyDown===false) 
            {
                bRegisterKeydown=false;
                JSConsole.Chart.Log('[JSKeyboardChartContainer::Create] not register keydown event.');
            }

            if (option.Wheel===false) 
            {
                bRegisterWheel=false;
                JSConsole.Chart.Log('[JSKeyboardChartContainer::Create] not register wheel event.');
            }
        }

        if (bRegisterKeydown) this.UIElement.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true);            //键盘消息
        if (bRegisterWheel) this.UIElement.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true);                  //上下滚动消息

        
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
    }

    this.Draw=function()
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

    this.GetStockData=function(symbol)
    {
        if (!this.MapSymbol.has(symbol)) return null;
        
        return this.MapSymbol.get(symbol);
    }


    this.ResetStatus=function()
    {
        this.Data.XOffset=0;
        this.Data.YOffset=0;
    }

    this.ResetSelectStatus=function()
    {
        var chart=this.GetReportChart();
        if (chart)
        {
            chart.SelectedRow=-1;
            chart.SelectedFixedRow=-1;
        } 
    }

    //设置事件回调
    //{event:事件id, callback:回调函数}
    this.AddEventCallback=function(object)
    {
        if (!object || !object.event || !object.callback) return;

        var data={Callback:object.callback, Source:object};
        this.mapEvent.set(object.event,data);
    }

    this.RemoveEventCallback=function(eventid)
    {
        if (!this.mapEvent.has(eventid)) return;

        this.mapEvent.delete(eventid);
    }

    this.GetEventCallback=function(id)  //获取事件回调
    {
        if (!this.mapEvent.has(id)) return null;
        var item=this.mapEvent.get(id);
        return item;
    }

    this.OnSize=function()
    {
        if (!this.Frame) return;

        this.SetSizeChange(true);
        this.Draw();
    }

    this.SetSizeChange=function(bChanged)
    {
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var chart=this.ChartPaint[i];
            if (chart) chart.SizeChange=bChanged;
        }
    }


    this.OnWheel=function(e)    //滚轴
    {
        JSConsole.Chart.Log('[JSKeyboardChartContainer::OnWheel]',e);
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);
        if (!isInClient) return;

        var chart=this.ChartPaint[0];
        if (!chart) return;

        var wheelValue=e.wheelDelta;
        if (!IFrameSplitOperator.IsObjectExist(e.wheelDelta))
            wheelValue=e.deltaY* -0.01;

        if (wheelValue<0)   //下一页
        {
            if (this.GotoNextPage(this.PageUpDownCycle)) 
            {
                this.Draw();
            }
        }
        else if (wheelValue>0)  //上一页
        {
            if (this.GotoPreviousPage(this.PageUpDownCycle)) 
            {
                this.Draw();
            }
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnKeyDown=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        var keyID = e.keyCode ? e.keyCode :e.which;
        switch(keyID)
        {
            case 33:    //page up
                if (this.GotoPreviousPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                }
                break;
            case 34:    //page down
                if (this.GotoNextPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                }
                break;
            case 38:    //up
                var result=this.MoveSelectedRow(-1);
                if (result)
                {
                    if (result.Redraw) this.Draw();
                }
                break;
            case 40:    //down
                var result=this.MoveSelectedRow(1)
                if (result)
                {
                    if (result.Redraw) this.Draw();
                }
                break;
            case 37: //left
                if (this.MoveXOffset(-1)) this.Draw();
                break
            case 39: //right
                if (this.MoveXOffset(1)) this.Draw();
                break;
            case 13: //Enter
                this.OnSelectedSymbol();
                break;
        }

        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnSelectedSymbol=function()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;

        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var data=chart.GetSelectedSymbol();

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_KEYBOARD_SELECTED)
        if (event && event.Callback)
        {
            event.Callback(event, { Data:data }, this);
        }
    }

    this.UIOnDblClick=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (chart) 
        {
            if (chart.OnDblClick(x,y,e)) this.OnSelectedSymbol();
        }
    }

    this.UIOnMouseDown=function(e)
    {
        this.DragYScroll=null;
        this.DragMove={ Click:{ X:e.clientX, Y:e.clientY }, Move:{X:e.clientX, Y:e.clientY}, PreMove:{X:e.clientX, Y:e.clientY } };

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (chart) 
        {
            var clickData=chart.OnMouseDown(x,y,e);
            if (!clickData) return;
            //if (e.button!=0) return;

            if ((clickData.Type==2) && (e.button==0 || e.button==2))  //点击行
            {
                if (clickData.Redraw==true)
                    this.Draw();
            }
            else if (clickData.Type==5 && e.button==0)  //右侧滚动条
            {
                var scroll=clickData.VScrollbar;
                if (scroll.Type==1) //顶部按钮
                {
                    if (this.MoveYOffset(-1)) 
                        this.Draw();
                }
                else if (scroll.Type==2)   //底部按钮
                {
                    if (this.MoveYOffset(1)) 
                        this.Draw();
                }
                else if (scroll.Type==3)    //滚动条
                {
                    this.DragYScroll={ Click:{X:x, Y:y}, LastMove:{X:x, Y:y} };
                }
                else if (scroll.Type==4)    //滚动条内部
                {
                    if (this.SetYOffset(scroll.Pos)) 
                        this.Draw();
                }
            }
        }

        document.onmousemove=(e)=>{ this.DocOnMouseMove(e); }
        document.onmouseup=(e)=> { this.DocOnMouseUp(e); }
    }

    //去掉右键菜单
    this.UIOnContextMenu=function(e)
    {
        e.preventDefault();
    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
    }

    this.UIOnMounseOut=function(e)
    {
       
    }

    this.UIOnMouseleave=function(e)
    {
        
    }

    this.DocOnMouseMove=function(e)
    {
        this.DragMove.PreMove.X=this.DragMove.Move.X;
        this.DragMove.PreMove.Y=this.DragMove.Move.Y;
        this.DragMove.Move.X=e.clientX;
        this.DragMove.Move.Y=e.clientX;

        //if (this.DragMove.Move.X!=this.DragMove.PreMove.X || this.DragMove.Move.Y!=this.DragMove.PreMove.Y)
        //    this.StopAutoDragScrollTimer();

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (this.DragYScroll)
        {
            var chart=this.ChartPaint[0];
            if (!chart || !chart.VScrollbar) return;

            this.DragYScroll.LastMove.X=x;
            this.DragYScroll.LastMove.Y=y;

            var pos=chart.VScrollbar.GetScrollPostionByPoint(x,y);
            if (this.SetYOffset(pos)) 
                this.Draw();
        }
    }

    this.DocOnMouseUp=function(e)
    {
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null; 

        this.DragYScroll=null;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_KEYBOARD_MOUSEUP)
        if (event && event.Callback)
        {
            event.Callback(event, {  }, this);
        }
    }
    

    this.GetMoveAngle=function(pt,pt2)  //计算角度
    {
        var xMove=Math.abs(pt.X-pt2.X);
        var yMove=Math.abs(pt.Y-pt2.Y);
        var angle=Math.atan(xMove/yMove)*180/Math.PI;
        return angle;
    }

    this.PreventTouchEvent=function(e)
    {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    }

    this.OnDragYOffset=function(drag, touches, moveUpDown, e)
    {
        if (moveUpDown<5) return false

        var isUp=true;
        if (drag.LastMove.Y<touches[0].clientY) isUp=false;     //Down

        var oneStep=this.YStepPixel;
        if (oneStep<=0) oneStep=5;

        var step=parseInt(moveUpDown/oneStep); 
        if (step<=0) return false

        if (isUp==false) step*=-1;

        if (this.MoveYOffset(step, this.DragPageCycle))
        {
            drag.IsYMove=true;
            this.Draw();
            this.DelayUpdateStockData();
        }

        return true;
    }

    this.OnDragXOffset=function(drag, touches, moveLeftRight, e)
    {
        if (moveLeftRight<5) return false;

        var isLeft=true;
        if (drag.LastMove.X<touches[0].clientX) isLeft=false;//右移数据

        var oneStep=this.XStepPixel;
        if (oneStep<=0) oneStep=5;

        var step=parseInt(moveLeftRight/oneStep);  //除以4个像素
        if (step<=0) return false;

        if (!isLeft) step*=-1;

        if (this.MoveXOffset(step))
        {
            drag.IsXMove=true;
            this.Draw();
        }

        return true;
    }

    this.GetReportChart=function()
    {
        var chart=this.ChartPaint[0];
        return chart;
    }

    this.GotoNextPage=function(bCycle) //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;
        if (this.Data.YOffset+pageSize>=this.Data.Data.length) 
        {
            if (bCycle===true)
            {
                this.Data.YOffset=0;    //循环到第1页
                return true;
            }
            else
            {
                return false;
            }
        }

        this.Data.YOffset+=pageSize;
        var showDataCount=this.Data.Data.length-this.Data.YOffset;

        chart.SelectedRow=this.Data.YOffset;
        return true;
    }

    this.GotoPreviousPage=function(bCycle)  //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;
        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;

        if (this.Data.YOffset<=0) 
        {
            if (bCycle===true)
            {
                this.Data.YOffset=this.Data.Data.length-pageSize;   //循环到最后一页
                return true;
            }
            else
            {
                return false;
            }
        }
        
        var offset=this.Data.YOffset;
        offset-=pageSize;
        if (offset<0) offset=0;
        this.Data.YOffset=offset;
        chart.SelectedRow=this.Data.YOffset;

        return true;
    }

    this.MoveYOffset=function(setp, bCycle) //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageStatus=chart.GetCurrentPageStatus();
        if (pageStatus.IsSinglePage) return false;

        if (setp>0) //向上
        {
            var count=this.Data.Data.length;
            var pageSize=pageStatus.PageSize;
            var offset=this.Data.YOffset;
            if (bCycle)
            {
                for(var i=0;i<setp;++i)
                {
                    ++offset;
                    if (offset+pageSize>count) offset=0;
                }
            }
            else
            {
                if (offset+pageSize>=count) return false;

                for(var i=0;i<setp;++i)
                {
                    if (offset+pageSize+1>count) break;
                    ++offset;
                }
            }

            this.Data.YOffset=offset;
            return true;
        }
        else if (setp<0)   //向下
        {
            setp=Math.abs(setp);
            var offset=this.Data.YOffset;
            if (bCycle)
            {
                var pageSize=pageStatus.PageSize;
                for(var i=0;i<setp;++i)
                {
                    --offset;
                    if (offset<0) offset=this.Data.Data.length-pageSize;
                }
            }
            else
            {
                if (this.Data.YOffset<=0) return false;
                for(var i=0;i<setp;++i)
                {
                    if (offset-1<0) break;
                    --offset;
                }
            }

            this.Data.YOffset=offset;
            return true;
        }

        return false;
    }

    this.GotoLastPage=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        //显示最后一屏
        var pageSize=chart.GetPageSize(true);
        var offset=this.Data.Data.length-pageSize;
        if (offset<0) offset=0;
        this.Data.DataOffset=offset;
    }

    this.SetColumn=function(aryColunm, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetColumn(aryColunm);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.ReloadResource=function(option)
    {
        this.Frame.ReloadResource(option);
        
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.ReloadResource) item.ReloadResource(option);
        }

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    this.MoveSelectedRow=function(step)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var result={ Redraw:false };  //Redraw=重绘
        
        //可翻页模式
        var pageStatus=chart.GetCurrentPageStatus();
        var pageSize=pageStatus.PageSize;
        var selected=pageStatus.SelectedRow;

        if (step>0)
        {
            if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
            {
                chart.SelectedRow=pageStatus.Start;
                result.Redraw=true;
                return result;
            }

            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
                ++selected;
                if (selected>pageStatus.End) ++offset;

                if (selected>=this.Data.Data.length)
                   break;

                result.Redraw=true;
                chart.SelectedRow=selected;
                this.Data.YOffset=offset;
            }

            return result;
        }
        else if (step<0)
        {
            if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
            {
                chart.SelectedRow=pageStatus.End;
                result.Redraw=true;
                return result;
            }

            step=Math.abs(step);
            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
                --selected;
                if (selected<pageStatus.Start) --offset;

                if (selected<0)
                    break;

                result.Redraw=true;
                chart.SelectedRow=selected;
                this.Data.YOffset=offset;
            }

            return result;
        }
    }

    this.SetYOffset=function(pos)
    {
        if (!IFrameSplitOperator.IsNumber(pos)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var maxOffset=chart.GetYScrollRange();
        if (pos<0) pos=0;
        if (pos>maxOffset) pos=maxOffset;

        this.Data.YOffset=pos;

        return true;
    }
}

function JSKeyboardFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右

    this.BorderColor=g_JSChartResource.Keyboard.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(option)
    {
        this.BorderColor=g_JSChartResource.Keyboard.BorderColor;    //边框线
        this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
        this.LogoTextFont=g_JSChartResource.FrameLogo.Font;
    }

    this.Draw=function()
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;

        if (!IFrameSplitOperator.IsNumber(this.BorderLine))
        {
            this.Canvas.strokeStyle=this.BorderColor;
            this.Canvas.strokeRect(left,top,width,height);
        }
        else
        {
            this.Canvas.strokeStyle=this.BorderColor;
            this.Canvas.beginPath();

            if ((this.BorderLine&1)>0) //上
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(right,top);
            }

            if ((this.BorderLine&2)>0)  //下
            {
                this.Canvas.moveTo(left,bottom);
                this.Canvas.lineTo(right,bottom);
            }

            if ((this.BorderLine&4)>0)  //左
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(left,bottom);
            }

            if ((this.BorderLine&8)>0)    //右
            {
                this.Canvas.moveTo(right,top);
                this.Canvas.lineTo(right,bottom);
            }
              
            this.Canvas.stroke();
        }
    }

    this.DrawLogo=function()
    {
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'right';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetRight()-30;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
    }
}



var KEYBOARD_COLUMN_ID=
{
    SHORT_SYMBOL_ID:0,  //不带后缀代码
    SYMBOL_ID:1,     
    NAME_ID:2,      //简称
    TYPE_ID:3,       //类型
    TYPE_NAME_ID:4,      //类型中文名字
}


function ChartSymbolList()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartSymbolList';       //类名
    this.UIElement;
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件
    this.Data;                          //数据 { XOffset:0, YOffset:0, Data:['600000.sh', '000001.sz'] }
    this.SizeChange=true;

    this.SelectedRow=-1;                //选中行ID
    this.IsDrawBorder=false;            //是否绘制单元格边框

    this.ShowSymbol=[];                 //显示的股票列表 { Index:序号(排序用), Symbol:股票代码 }

    this.VScrollbar;                    //竖向滚动条
   
    this.BorderColor=g_JSChartResource.Keyboard.BorderColor;          //边框线
    this.SelectedColor=g_JSChartResource.Keyboard.SelectedColor;      //选中行
    this.TextColor=g_JSChartResource.Keyboard.TextColor;              //文字颜色

    //表格内容配置
    this.ItemFontConfig={ Size:g_JSChartResource.Keyboard.Item.Font.Size, Name:g_JSChartResource.Keyboard.Item.Font.Name };
    this.ItemMergin=
    { 
        Left:g_JSChartResource.Keyboard.Item.Mergin.Left, 
        Right:g_JSChartResource.Keyboard.Item.Mergin.Right, 
        Top:g_JSChartResource.Keyboard.Item.Mergin.Top, 
        Bottom:g_JSChartResource.Keyboard.Item.Mergin.Bottom 
    };
    
    //缓存
    this.ItemFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemSymbolFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameHeight=0;
    this.RowCount=0;            //一屏显示行数
    this.RowHeight=0;           //行高度

    this.Column=    //{ Type:列id, Title:标题, TextAlign:文字对齐方式, MaxText:文字最大宽度 , TextColor:文字颜色, Sort:0=不支持排序 1=本地排序 0=远程排序 }
    [
        { Type:KEYBOARD_COLUMN_ID.SHORT_SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null, MaxText:"888888" },
        { Type:KEYBOARD_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, MaxText:"擎擎擎擎擎擎" },
        //{ Type:KEYBOARD_COLUMN_ID.TYPE_ID, Title:"类型", TextAlign:"right", Width:null, MaxText:"擎擎擎擎" },
        { Type:KEYBOARD_COLUMN_ID.TYPE_NAME_ID, Title:"类型", TextAlign:"right", Width:null, MaxText:"擎擎擎擎" },
        
    ];

    this.RectClient={ };

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.Keyboard.BorderColor;          //边框线
        this.SelectedColor=g_JSChartResource.Keyboard.SelectedColor;      //选中行
        this.TextColor=g_JSChartResource.Keyboard.TextColor;              //文字颜色

        if (this.VScrollbar) this.VScrollbar.ReloadResource(resource);
    }

    this.SetColumn=function(aryColumn)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;
    }

    this.Draw=function()
    {
        this.ShowSymbol=[ ];

        if (this.SizeChange) this.CalculateSize();
        else this.UpdateCacheData();

        var bShowVScrollbar=this.IsShowVScrollbar();
        this.Canvas.save();

        this.Canvas.beginPath();
        this.Canvas.rect(this.RectClient.Left,this.RectClient.Top+1,(this.RectClient.Right-this.RectClient.Left),(this.RectClient.Bottom-(this.RectClient.Top+1)));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();

        this.DrawBody();
        this.Canvas.restore();
        
        this.DrawBorder();

        if (this.VScrollbar && bShowVScrollbar)
        {
            var bottom=this.ChartBorder.GetBottom();
            this.VScrollbar.DrawScrollbar(this.RectClient.Left,this.RectClient.Top+2, this.RectClient.Right+this.VScrollbar.ButtonSize+2, bottom-2);
        }

        this.SizeChange=false;
    }

    //更新缓存变量
    this.UpdateCacheData=function()
    {
        this.RectClient.Left=this.ChartBorder.GetLeft();
        this.RectClient.Right=this.ChartBorder.GetRight();
        this.RectClient.Top=this.ChartBorder.GetTop();
        this.RectClient.Bottom=this.ChartBorder.GetBottom();

        var bShowVScrollbar=this.IsShowVScrollbar();
        if (bShowVScrollbar && this.VScrollbar && this.VScrollbar.Enable)
        {
            this.RectClient.Right-=(this.VScrollbar.ButtonSize+2);
        }
    }

    this.GetPageSize=function(recalculate) //recalculate 是否重新计算
    {
        if (recalculate) this.CalculateSize();
        var size=this.RowCount;
        return size;
    }

    this.GetCurrentPageStatus=function()    //{ Start:起始索引, End:结束索引（数据）, PageSize:页面可以显示几条记录, IsEnd:是否是最后一页, IsSinglePage:是否只有一页数据}
    {
        var result={ Start:this.Data.YOffset, PageSize:this.RowCount, IsEnd:false, SelectedRow:this.SelectedRow, IsSinglePage:false, DataCount:0 };
        if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Data))
        {
            result.End=this.Data.YOffset+this.RowCount-1;
            result.IsSinglePage=this.Data.Data.length<=this.RowCount;
            result.DataCount=this.Data.Data.length;
            if (result.End>=this.Data.Data.length-1) result.IsEnd=true;
            if (result.End>=this.Data.Data.length) result.End=this.Data.Data.length-1;
        }
        else
        {
            result.Star=0;
            result.End=0;
            result.IsEnd=true;
            result.IsSinglePage=true;
        }

        return result;
    }

    this.CalculateSize=function()   //计算大小
    {
        if (this.VScrollbar && this.VScrollbar.Enable) this.VScrollbar.CalculateSize();

        this.UpdateCacheData();

        var pixelRatio=GetDevicePixelRatio();
        this.ItemFont=`${this.ItemFontConfig.Size*pixelRatio}px ${ this.ItemFontConfig.Name}`;
        this.RowHeight=this.GetFontHeight(this.ItemFont,"擎")+ this.ItemMergin.Top+ this.ItemMergin.Bottom;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        this.Canvas.font=this.ItemFont;
        var itemWidth=0;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            itemWidth=this.Canvas.measureText(item.MaxText).width;
            item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;

            if (i==this.Column.length-1)    //最后一列
            {
                if (left+item.Width<right) item.Width=right-left;
            }

            left+=item.Width;
        }

        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top)/this.RowHeight);
    }

    this.DrawText=function(text, textAlign, x, y, textWidth)
    {
        if (textAlign=='center')
        {
            x=x+textWidth/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=x+textWidth;
            this.Canvas.textAlign="right";
        }
        else
        {
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="middle";
        this.Canvas.fillText(text,x,y);
    }

    this.DrawBorder=function()
    {
        if (!this.IsDrawBorder) return;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=this.RectClient.Bottom;

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.beginPath();
       
        this.Canvas.moveTo(left,ToFixedPoint(top));
        this.Canvas.lineTo(right,ToFixedPoint(top));

        var rowTop=top+this.RowHeight;
        var rotBottom=rowTop;
        //横线
        for(var i=0;i<this.RowCount;++i)
        {
            var drawTop=ToFixedPoint(rowTop);
            this.Canvas.moveTo(left,drawTop);
            this.Canvas.lineTo(right,drawTop);
            rotBottom=rowTop;
            rowTop+=this.RowHeight;
        }

        //竖线
        var columnLeft=left;
        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var drawLeft=ToFixedPoint(columnLeft+item.Width);
            this.Canvas.moveTo(drawLeft,top);
            this.Canvas.lineTo(drawLeft,rotBottom);

            columnLeft+=item.Width;
        }

        this.Canvas.stroke();
    }

    this.GetSelectedSymbol=function()
    {
        if (this.SelectedRow<0 || this.SelectedRow>=this.Data.Data.length) return null;

        return { Symbol: this.Data.Data[this.SelectedRow], RowID: this.SelectedRow };
    }

    this.DrawBody=function()
    {
        if (!this.Data) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        this.Canvas.font=this.ItemFont;
        var top=this.RectClient.Top;
        var left=this.RectClient.Left;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;

        var textTop=top;
        this.Canvas.font=this.ItemFont;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];

            var bFillRow=false;
            if (i==this.SelectedRow) bFillRow=true; //选中行

            if (bFillRow)
            {
                this.Canvas.fillStyle=this.SelectedColor;
                this.Canvas.fillRect(left+1,textTop,rowWidth,this.RowHeight);   
            }

            this.DrawRow(symbol, textTop, i);

            this.ShowSymbol.push( { Index:i, Symbol:symbol } );

            textTop+=this.RowHeight;
        }
    }

    this.DrawRow=function(symbol, top, dataIndex, rowType)  //rowType 0=表格行 1=顶部固定行 2=拖拽行
    {
        var left=this.RectClient.Left;
        var chartRight=this.RectClient.Right;
        var data= { Symbol:symbol , Stock:null, Block:null };
        if (this.GetStockDataCallback) data.Stock=this.GetStockDataCallback(symbol);

        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top, rowType);
            left+=item.Width;

            if (left>=chartRight) break;
        }
    }

    this.DrawItem=function(index, data, column, left, top, rowType)
    {
        var itemWidth=column.Width;
        var x=left+this.ItemMergin.Left;
        var textWidth=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var stock=data.Stock;
        var drawInfo={ Text:null, TextColor:this.TextColor , TextAlign:column.TextAlign };
        if (column.Type==KEYBOARD_COLUMN_ID.SHORT_SYMBOL_ID)
        {
            if (stock && stock.ShortSymbol) drawInfo.Text=stock.ShortSymbol;
            else drawInfo.Text=data.Symbol;

            if (stock.Color) drawInfo.TextColor=stock.Color;
        }
        else if (column.Type==KEYBOARD_COLUMN_ID.NAME_ID)
        {
            if (stock && stock.Name) 
            {
                drawInfo.Text=this.TextEllipsis(stock.Name, textWidth, column.MaxText);
                if (stock.Color) drawInfo.TextColor=stock.Color;
            }
        }
        else if (column.Type==KEYBOARD_COLUMN_ID.TYPE_NAME_ID)
        {
            if (stock && stock.TypeName) 
            {
                drawInfo.Text=this.TextEllipsis(stock.TypeName, textWidth, column.MaxText);
                if (stock.Color) drawInfo.TextColor=stock.Color;
            }
        }

        this.DrawItemText(drawInfo.Text, drawInfo.TextColor, drawInfo.TextAlign, x, top, textWidth);
    }

    this.DrawItemText=function(text, textColor, textAlign, left, top, width)
    {
        if (!text) return;

        var x=left;
        if (textAlign=='center')
        {
            x=left+width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=left+width-2;
            if (left+width-2>this.RectClient.Right) x=this.RectClient.Right-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="middle";
        this.Canvas.fillStyle=textColor;
        this.Canvas.fillText(text,x,top+this.ItemMergin.Top+this.RowHeight/2);
    }

    //字体由外面设置
    this.TextEllipsis=function(text, maxWidth, maxText)
    {
        if (!text) return null;
        
        if (text.length<maxText.length) return text;

        var start=maxText.length-3;
        if (start<0) return null;
        var newText=text.slice(0,start);
        for(var i=start;i<text.length;++i)
        {
            var value=newText + text[i] + "...";
            var width=this.Canvas.measureText(value).width;
            if (width>maxWidth) 
            {
                newText+="...";
                break;
            }
            newText+=text[i];
        }

        return newText;
    }

    this.GetFontHeight=function(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    this.OnMouseDown=function(x,y,e)    //Type: 2=行
    {
        if (!this.Data) return null;
        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};

        if (this.UIElement)
            var uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else
            var uiElement={Left:null, Top:null};

        if (this.VScrollbar)
        {
            var item=this.VScrollbar.OnMouseDown(x,y,e);
            if (item) return { Type:5, VScrollbar:item };   //右侧滚动条
        }

        var row=this.PtInBody(x,y);
        if (row)
        {
            var bRedraw=true;
            if (this.SelectedModel==0) 
            {
                if (this.SelectedRow==row.Index) bRedraw=false;
                this.SelectedRow=row.Index;
                this.SelectedFixedRow=-1;
            }
            else 
            {
                if (this.SelectedRow==row.DataIndex) bRedraw=false;
                this.SelectedRow=row.DataIndex;
                this.SelectedFixedRow=-1;
            }
    
            var eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_ROW;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_REPORT_ROW;
            
            this.SendClickEvent(eventID, { Data:row, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement });

            return { Type:2, Redraw:bRedraw, Row:row };  //行
        }

        return null;
    }

    this.OnDrawgRow=function(x, y, e) //Type: 5=顶部  6=空白行 2=行 7=底部
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var topOffset=this.RowHeight/2;
        var top=this.RectClient.Top+this.HeaderHeight;
        var right=this.ChartBorder.GetChartWidth();
        var textTop=top;

        if (y<textTop+topOffset) return { Type:5 };


        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];
            var rtRow={ Left:0, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };
            rtRow.Top+=topOffset;
            rtRow.Bottom+=topOffset;

            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ DataIndex:i, Index:j , Symbol:symbol, Pos:0 };
                if (j==0) data.Pos=1;
                else if (j==this.RowCount-1) data.Pos=2;
                return { Type: 2, Data:data };
            }

            textTop+=this.RowHeight;
        }

        if (j<this.RowCount) return { Type:6 };

        return { Type:7 };
    }

    this.OnDblClick=function(x,y,e)
    {
        if (!this.Data) return false;

        var row=this.PtInBody(x,y);
        if (row) return true;

        return false;
    }

    this.PtInBody=function(x,y)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var top=this.RectClient.Top;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;
 
        var textTop=top;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];
            var rtRow={ Left:left, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };

            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ Rect:rtRow, DataIndex:i, Index:j , Symbol:symbol };
                data.Item=this.PtInItem(x,y, rtRow.Top, rtRow.Bottom);
                return data;
            }

            textTop+=this.RowHeight;
        }

        return null;
    }

    this.PtInItem=function(x,y, top, bottom)
    {
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        var textLeft=left;
        //固定列
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var header={Left:textLeft, Right:textLeft+item.Width, Top:top, Bottom:bottom };

            if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
            {
                return { Rect:header, Column:item, Index:i };
            }

            textLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (textLeft>=right) break;
            
            var header={Left:textLeft, Right:textLeft+item.Width, Top:top, Bottom:bottom };

            if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
            {
                return { Rect:header, Column:item, Index:i };
            }
            textLeft+=item.Width;
        } 

        return null;
    }

    this.IsPtInBody=function(x,y)
    {
        var top=this.RectClient.Top;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var bottom=this.RectClient.Bottom;

        if (x>=left && x<=right && y>=top && y<=bottom) return true;

        return false;
    }

    this.SendClickEvent=function(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
    }

    this.GetYScrollRange=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return 0;

        var maxOffset=this.Data.Data.length-this.RowCount;

        return maxOffset;
    }

    //大于1屏数据 显示滚动条
    this.IsShowVScrollbar=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        
        return this.Data.Data.length>this.RowCount;
    }
}

//纵向滚动条
function ChartKeyboardVScrollbar()
{
    this.newMethod=ChartVScrollbar;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartKeyboardVScrollbar';
    this.Enable=true;

    this.ScrollBarHeight=g_JSChartResource.Keyboard.VScrollbar.ScrollBarHeight;
    this.ButtonColor=g_JSChartResource.Keyboard.VScrollbar.ButtonColor;
    this.BarColor=g_JSChartResource.Keyboard.VScrollbar.BarColor;
    this.BorderColor=g_JSChartResource.Keyboard.VScrollbar.BorderColor;
    this.BGColor=g_JSChartResource.Keyboard.VScrollbar.BGColor;
    this.Mergin={ Left:2, Right:2, Top:2, Bottom:2 };
    this.BarWithConfig={ Size:g_JSChartResource.Keyboard.VScrollbar.BarWidth.Size };

    this.ReloadResource=function(resource)
    {
        this.ScrollBarHeight=g_JSChartResource.Keyboard.VScrollbar.ScrollBarHeight;
        this.ButtonColor=g_JSChartResource.Keyboard.VScrollbar.ButtonColor;
        this.BarColor=g_JSChartResource.Keyboard.VScrollbar.BarColor;
        this.BorderColor=g_JSChartResource.Keyboard.VScrollbar.BorderColor;
        this.BGColor=g_JSChartResource.Keyboard.VScrollbar.BGColor;
        this.BarWithConfig={ Size:g_JSChartResource.Keyboard.VScrollbar.BarWidth.Size };
    }

    this.IsShowCallback=function()
    {
        return true;
    }
}

