/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   跑马灯 (H5版本)
   不提供内置测试数据
*/

function JSScrollTextChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsscrolltext-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
    if(divElement.hasChildNodes())
    {
        JSConsole.Chart.Log("[JSScrollTextChart::JSScrollTextChart] divElement hasChildNodes", divElement.childNodes);
    }
    divElement.appendChild(this.CanvasElement);


    this.OnSize=function()
    {
        //画布大小通过div获取 如果有style里的大小 使用style里的
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

        JSConsole.Chart.Log(`[JSStatusBarChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSScrollTextChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        if (option.EnableResize==true) this.CreateResizeListener();

        chart.Draw();
        chart.StartScroll();

        return true;
    }

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSScrollTextChart::OnDivResize] entries=", entries);

        this.OnSize();
    }

    this.CreateJSScrollTextChartContainer=function(option)
    {
        var chart=new JSScrollTextChartContainer(this.CanvasElement);
        chart.Create(option);

        this.SetChartBorder(chart, option);

        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (option.RightToolbar) chart.SetRightToolbar(option.RightToolbar);

        //是否自动更新
        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;

        if (option.IsAutoUpdate!=null) chart.IsAutoUpdate=option.IsAutoUpdate;
        if (option.AutoUpdateFrequency>0) chart.AutoUpdateFrequency=option.AutoUpdateFrequency;

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

    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSScrollTextChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSScrollTextChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    this.ChartDestroy=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestroy) == 'function') 
        {
            this.JSChartContainer.ChartDestroy();
        }
    }

    this.Draw=function()
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Draw)=='function')
        {
            JSConsole.Chart.Log('[JSScrollTextChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }

    this.AddText=function(aryData, option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddText)=='function')
        {
            JSConsole.Chart.Log('[JSScrollTextChart:AddText] ');
            this.JSChartContainer.AddText(aryData, option);
        }
    }
}

JSScrollTextChart.Init=function(divElement)
{
    var jsChartControl=new JSScrollTextChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSScrollTextChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (JSStatusBarChart.Init()之前)
JSScrollTextChart.GetResource=function()  
{
    return g_JSChartResource;
}


function JSScrollTextChartContainer(uielement)
{
    this.ClassName='JSScrollTextChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法

    this.Canvas=uielement.getContext("2d");         //画布

    this.NetworkFilter;                                 //数据回调接口
    this.Data=
    { 
        AryText:[]      //{ AryText:[ { Text:, Color:, Font: },] }

        /*
        AryText:
        [
            { Content:[ { Text:"滚动信息1:36238347-D299-42DA-BAA2-3A3C1B5A8ACB" } ] },
            { Content:[ { Text:"滚动信息2:358D6F13-C845-4AD1-8415-A9C3A62C1F1E."}, ] },
            { Content:[ { Text:"滚动信息3:144F91C3-6181-4C47-A620-62AAFA3BB377."}, ] },
            { Content:[ { Text:"滚动信息4:BCC78A08-84B3-4A10-8CE8-13C64C72972D."}, ] },
            { Content:[ { Text:"滚动信息5:1CCF5538-E20D-4121-B6A7-5E997AEBBC60."}, ] },
            { Content:[ { Text:"滚动信息6:921156AE-05BF-4EE9-8EE0-2DFF32DC94A4."}, ] },
            { Content:[ { Text:"滚动信息7:2DBB8E54-E001-4A62-BB47-62849AEC6DA6."}, ] },
            { Content:[ { Text:"滚动信息8:FC784BDE-038C-4C8D-8858-55A3E8EEE1E5."}, ] },
            { Content:[ { Text:"滚动信息9:2BB898AF-C4D4-4430-AF60-00852F16B2B0."}, ] },
        ] 
        */
    }; 

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{ Callback:回调,}
    this.UIElement=uielement;
   
    this.IsDestroy=false;        //是否已经销毁了
    this.ScrollTimer=null;      //滚动定时器

    this.ChartDestroy=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopScroll();
    }

    this.StopScroll=function()
    {
        if (this.ScrollTimer)
        {
            clearInterval(this.ScrollTimer);
            this.ScrollTimer=null;
        }
    }

    this.StartScroll=function()
    {
        if (this.ScrollTimer) return;  

        this.ScrollTimer=setInterval(()=>
        {
            this.ScrollStep();
            
        }, 100);
    }

    this.ClearData=function()
    {
        this.Data.AryText=[];
    }

    this.AddText=function(aryData, option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) return;

        var bDraw=false;
        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            this.Data.AryText.push(item);
        }

        
        if (option)
        { 
            if (option.Draw===true) bDraw=true;
        }
        
        if (bDraw) this.Draw();
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

    this.ClearData=function()
    {
        this.Data.AryText=[];
    }

    //创建
    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建框架
        this.Frame=new JSScrollTextFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        //创建表格
        var chart=new ChartScrollText();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.Data=this.Data;
        chart.BorderData=this.BorderData;
        chart.GlobalOption=this.GlobalOption;
        chart.FixedRowData=this.FixedRowData;
        chart.SortInfo=this.SortInfo;
        this.ChartPaint[0]=chart;

        
        if (option)
        {
           
        }

        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e); }
        this.UIElement.onmouseout=(e)=>{ this.UIOnMouseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }

        /*
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        
       
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        
        */

        var frequency=500;
        this.ToolbarTimer=setInterval(()=>
        { 
            this.Draw();
        }, frequency)
    }

    this.UIOnMouseDown=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        this.ClickDownPoint={ X:e.clientX, Y:e.clientY };
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (e)   
        {
            if (e.button==0)        //左键点击
            {
                var ptClick={ X:this.ClickDownPoint.X, Y:this.ClickDownPoint.Y };
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_CLICK_SCROLL_TEXT_ITEM, ptClick, e);
            }
            else if (e.button==2)   //右键点击
            {
                this.HideAllTooltip();
                var ptClick={ X:this.ClickDownPoint.X, Y:this.ClickDownPoint.Y };
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_RCLICK_SCROLL_TEXT_ITEM, ptClick, e);
            }
        }
    }

    this.UIOnContextMenu=function(e)
    {
        if (e)  //去掉系统右键菜单
        {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.returnValue=false;
        } 
    }

    this.GetChartTooltipData=function(x,y,option)
    {
        var toolTip=new TooltipData();
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.GetTooltipData(x,y,toolTip))
            {
               return toolTip;
            }
        }

        return null;
    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.GetScrollTextChart();
        if (chart) chart.OnMouseMove(x, y, e);
    }

    this.UIOnMouseOut=function(e)
    {
        var chart=this.GetScrollTextChart();
        if (chart) chart.OnMouseOut(e);

        this.HideAllTooltip();
    }

    this.UIOnMouseleave=function(e)
    {
        var chart=this.GetScrollTextChart();
        if (chart) chart.OnMouseOut(e);

        this.HideAllTooltip();
    }


    this.TryClickPaintEvent=function(eventID, ptClick, e)
    {
        var event=this.GetEventCallback(eventID);
        if (!event) return false;

        if (ptClick.X==e.clientX && ptClick.Y==e.clientY)
        {
            var pixelTatio = GetDevicePixelRatio();
            var x = (e.clientX-uielement.getBoundingClientRect().left)*pixelTatio;
            var y = (e.clientY-uielement.getBoundingClientRect().top)*pixelTatio;

            var toolTip=new TooltipData();
            for(var i=0;i<this.ChartPaint.length;++i)
            {
                var item=this.ChartPaint[i];
                if (item.GetTooltipData(x,y,toolTip))
                {
                    if (toolTip.Data)
                    {
                        var data= { X:e.clientX, Y:e.clientY, Tooltip:toolTip, e:e };
                        event.Callback(event, data, this);
                        return true;
                    }
                }
            }
        }

        return false;
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
            item.Draw();
        }
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

    this.ReloadResource=function(option)
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

        if (this.TooltipMinuteChart) this.TooltipMinuteChart.ReloadResource(option);    //分时图
    }

    this.GetScrollTextChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return null;

        return chart;
    }

    this.HideAllTooltip=function()
    {
       
    }

    this.ScrollStep=function()
    {
        var chart=this.GetScrollTextChart();
        if (!chart) return;

        if (chart.ScrollStep())
            this.Draw();
    }

}

function JSScrollTextFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右
    this.ClassName="JSScrollTextFrame";

    this.BorderColor=g_JSChartResource.StatusBar.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.StatusBar.BorderColor;    //边框线
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
        /*
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'right';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetRight()-30;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
        */
    }
}


function ChartScrollText()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartScrollText';       //类名
    this.UIElement;
    this.GetEventCallback;              //获取事件
    this.Data;                          //数据
    this.SizeChange=true;

    this.FirstItem=null;              //第一个显示的项
    this.MouseOnItem=null;            //鼠标所在项

    this.AryRect=[];

    this.TextConfig=
    {
        Font:g_JSChartResource.ScrollText.Font,
        Color:g_JSChartResource.ScrollText.Color,
        MouseOnColor:g_JSChartResource.ScrollText.MouseOnColor,

        Margin:{ Top:g_JSChartResource.ScrollText.Margin.Top, Bottom:g_JSChartResource.ScrollText.Margin.Bottom },
        Spacing:g_JSChartResource.ScrollText.Spacing,     //间距
    }

    this.LeftMargin=g_JSChartResource.ScrollText.LeftMargin;    //左边间距
    this.RightMargin=g_JSChartResource.ScrollText.RightMargin;   //右边间距
    this.MoveStep=g_JSChartResource.ScrollText.MoveStep;    //每次滚动步长

    this.ReloadResource=function(resource)
    {
        this.TextConfig.Font=g_JSChartResource.ScrollText.Font;
        this.TextConfig.Color=g_JSChartResource.ScrollText.Color;
        this.TextConfig.Spacing=g_JSChartResource.ScrollText.Spacing;
        this.TextConfig.Margin.Top=g_JSChartResource.ScrollText.Margin.Top;
        this.TextConfig.Margin.Bottom=g_JSChartResource.ScrollText.Margin.Bottom;

        this.LeftMargin=g_JSChartResource.ScrollText.LeftMargin;    //左边间距
        this.RightMargin=g_JSChartResource.ScrollText.RightMargin;   //右边间距
    }

    this.GetDataIndex=function(finderItem)
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.AryText)) return -1;

        for(var i=0;i<this.Data.AryText.length;++i)
        {
            var item=this.Data.AryText[i];
            if (item===finderItem) return i;
        }
        return -1;
    }

    this.OnMouseMove=function(x, y, e)
    {
        var tooltip={ };
        if (this.GetTooltipData(x,y,tooltip))
        {
            this.MouseOnItem=tooltip.Data;
        }
        else
        {
            this.MouseOnItem=null;
        }
    }

    this.OnMouseOut=function(e)
    {
        this.MouseOnItem=null;
    }

    this.GetClientRect=function()
    {
        var border=this.ChartBorder.GetBorder();    
        var rtClient = { Left:border.Left, Right:border.Right, Top:border.Top, Bottom:border.Bottom };
        rtClient.Left+=this.LeftMargin;
        rtClient.Right-=this.RightMargin;
        rtClient.Width=rtClient.Right-rtClient.Left;
        rtClient.Height=rtClient.Bottom-rtClient.Top;

        return rtClient;
    }

    this.Draw=function()
    {
        this.AryRect=[];
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.AryText)) return;

        var rtClient = this.GetClientRect();
        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(rtClient.Left,rtClient.Top,rtClient.Width,rtClient.Height);
        this.Canvas.clip();

        this.Canvas.textBaseline="bottom";
        this.Canvas.textAlign="left";

        var config=this.TextConfig;
        
        var y=rtClient.Bottom;
        var x=rtClient.Left;
        var startIndex=-1;
        if (this.FirstItem) startIndex=this.GetDataIndex(this.FirstItem);
        if (startIndex<0) 
        {
            this.FirstItem=this.Data.AryText[0];
            this.FirstItem.Move={ XOffset:0}
            startIndex=0;
        }

        if (this.FirstItem.Move && IFrameSplitOperator.IsNumber(this.FirstItem.Move.XOffset)) x-=this.FirstItem.Move.XOffset;

        for(var i=startIndex;i<this.Data.AryText.length;++i)
        {
            var item=this.Data.AryText[i];
            if (!IFrameSplitOperator.IsNonEmptyArray(item.Content)) continue;

            var itemWidth=0;
            var rtText={ Left:x, Right:x, Top: rtClient.Top, Bottom:rtClient.Bottom };
            for(j=0; j<item.Content.length;++j)
            {
                var subItem=item.Content[j];
                var color=this.TextConfig.Color;
                var font=this.TextConfig.Font;
                if (subItem.Color) color=subItem.Color;
                if (subItem.Font) font=subItem.Font;

                //鼠标在上面的颜色
                if (this.MouseOnItem)
                {
                    if (this.MouseOnItem.Data==item) color=this.TextConfig.MouseOnColor;
                }

                this.Canvas.font=font;
                this.Canvas.fillStyle=color;

                var textWidth=this.Canvas.measureText(subItem.Text).width;
                var yText=rtClient.Bottom-config.Margin.Bottom;
                this.Canvas.fillText(subItem.Text,x,yText);

                x+=textWidth;
                itemWidth+=textWidth
            }

            rtText.Right=x;
            this.AryRect.push( { Rect:rtText, Data:item } );
            x+=config.Spacing;

            if (x>=rtClient.Right) break;

            if (item==this.FirstItem)
            {
                item.Move.ContentWidth=itemWidth;
                item.Move.Width=itemWidth+config.Spacing;
            }
        }

        for(var i=0;i<this.Data.AryText.length;++i)
        {
            if (x>=rtClient.Right) break;

            var item=this.Data.AryText[i];
            if (item==this.FirstItem) break;
            if (!IFrameSplitOperator.IsNonEmptyArray(item.Content)) continue;

            var rtText={ Left:x, Right:x, Top: rtClient.Top, Bottom:rtClient.Bottom };
            for(j=0; j<item.Content.length;++j)
            {
                var subItem=item.Content[j];
                var color=this.TextConfig.Color;
                var font=this.TextConfig.Font;
                if (subItem.Color) color=subItem.Color;
                if (subItem.Font) font=subItem.Font;

                //鼠标在上面的颜色
                if (this.MouseOnItem)
                {
                    if (this.MouseOnItem.Data==item) color=this.TextConfig.MouseOnColor;
                }

                var textWidth=this.Canvas.measureText(subItem.Text).width;

                this.Canvas.font=font;
                this.Canvas.fillStyle=color;
                this.Canvas.fillText(subItem.Text,x,y);

                x+=textWidth;
                itemWidth+=textWidth
            }

            rtText.Right=x;
            this.AryRect.push( { Rect:rtText, Data:item } );

            x+=config.Spacing;
        }
       
        this.Canvas.restore();
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i=0;i<this.AryRect.length;++i)
        {
            var item=this.AryRect[i];
            if (Path2DHelper.PtInRect(x,y, item.Rect))
            {
                tooltip.Data=item;
                tooltip.ChartPaint=this;
                tooltip.Type=1;
                return true;
            }
        }

        return false;
    }

    this.ScrollStep=function()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.AryText)) return false;
        if (!this.FirstItem) return false;
        if (this.MouseOnItem) return true;

        var width=this.FirstItem.Move.Width;
        var xOffset=this.FirstItem.Move.XOffset+this.MoveStep;
        if (xOffset>=width)
        {
            var startIndex=this.GetDataIndex(this.FirstItem);
            var nextIndex=(startIndex+1)%this.Data.AryText.length;
            this.FirstItem=this.Data.AryText[nextIndex];
            this.FirstItem.Move={ XOffset:xOffset-width }
        }
        else
        {
            this.FirstItem.Move.XOffset=xOffset;
        }

        return true;
    }
}






