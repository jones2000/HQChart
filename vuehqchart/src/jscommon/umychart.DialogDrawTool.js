/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置画图工具 设置框
*/

var JS_DRAWTOOL_MENU_ID=
{
    CMD_SELECTED_ID:1,
    CMD_CHANGE_LINE_COLOR_ID:2,
    CMD_DELETE_ALL_DRAW_CHART_ID:3,
    CMD_ERASE_DRAW_CHART_ID:4,
    CMD_ENABLE_MAGNET_ID:5,   //画图工具磁体功能
    CMD_DELETE_DRAW_CHART_ID:6,

    CMD_CHANGE_FONT_COLOR_ID:7, //切换字体颜色
    CMD_CHANGE_BG_COLOR_ID:8,    //切换背景色
    CMD_CHANGE_BORDER_COLOR_ID:9,   //边框颜色
};

function JSDialogDrawTool()
{
    this.AryChartGroup=
    [
         { 
            Title:"线段", 
            AryChart:
            [
                { Title: '线段', ClassName: 'hqchart_drawtool icon-draw_line', Type:0, Data:{ ID:"线段" } },
                { Title: '线段信息', ClassName: 'hqchart_drawtool icon-infoline', Type:0, Data:{ ID:"InfoLine" } },
                { Title: '射线', ClassName: 'hqchart_drawtool icon-draw_rays', Type:0, Data:{ ID:"射线" } },
                { Title: "趋势线角度", ClassName:"hqchart_drawtool icon-qushixianjiaodu", Type:0, Data:{ ID:"TrendAngle" }},
                { Title: '标价线', ClassName: 'hqchart_drawtool icon-price_line', Type:0, Data:{ ID:"标价线" } },
                { Title: '垂直线', ClassName: 'hqchart_drawtool icon-vertical_line', Type:0, Data:{ ID:"垂直线" } },
                { Title: '十字线', ClassName: 'hqchart_drawtool icon-tubiao_shizixian', Type:0, Data:{ ID:"十字线" } },
                { Title: '箭头', ClassName: 'hqchart_drawtool icon-bottom-arrow-solid', Type:0, Data:{ ID:"箭头" } },
                { Title: '大箭头', ClassName: 'hqchart_drawtool icon-big_arrow', Type:0, Data:{ ID:"ArrowMarker" } },
                { Title: '趋势线', ClassName: 'hqchart_drawtool icon-draw_trendline', Type:0, Data:{ ID:"趋势线" } },
                { Title: '水平线', ClassName: 'hqchart_drawtool icon-draw_hline', Type:0, Data:{ ID:"水平线" } },
                { Title: '水平射线', ClassName: 'hqchart_drawtool icon-tubiao_shuipingshexian', Type:0, Data:{ ID:"水平射线" } },
                { Title: '涂鸦线段', ClassName: 'hqchart_drawtool icon-draw_line', Type:0, Data:{ ID:"涂鸦线段" } },
                { Title: '阻速线', ClassName: 'hqchart_drawtool icon-draw_resline', Type:0, Data:{ ID:"阻速线" } },
                { Title: '通达信阻速线', ClassName: 'hqchart_drawtool icon-draw_resline', Type:0, Data:{ ID:"阻速线2" } },
                { Title: '江恩角度线', ClassName: 'hqchart_drawtool icon-jiangenjiaoduxian', Type:0, Data:{ ID:"江恩角度线" } },
                { Title: '通达信江恩角度线', ClassName: 'hqchart_drawtool icon-jiangenjiaoduxian', Type:0, Data:{ ID:"江恩角度线2" } },
            ]
        }, 
        {
            Title:"通道",
            AryChart:
            [
                { Title: '平行线', ClassName: 'hqchart_drawtool icon-draw_parallel_lines', Type:0, Data:{ ID:"平行线" } }, 
                { Title: '水平线段', ClassName: 'hqchart_drawtool icon-draw_hlinesegment', Type:0, Data:{ ID:"水平线段" } },
                { Title: '平行射线', ClassName: 'hqchart_drawtool icon-draw_p_rays_lines', Type:0, Data:{ ID:"平行射线" } }, 
                { Title: '平行通道', ClassName: 'hqchart_drawtool icon-draw_parallelchannel',Type:0, Data:{ ID:"平行通道" } },
                { Title: '价格通道线', ClassName: 'hqchart_drawtool icon-draw_pricechannel', Type:0, Data:{ ID:"价格通道线" } },
                { Title: '箱型线', ClassName: 'hqchart_drawtool icon-draw_box', Type:0, Data:{ ID:"箱型线" }  },
                { Title:"不相交通道", ClassName:"hqchart_drawtool icon-buxiangjiaojiao", Type:0, Data:{ ID:"DisjointChannel"} },
                { Title:"平滑顶/底", ClassName:"hqchart_drawtool icon-tubiao_buxiangjiaotongdao", Type:0, Data:{ ID:"FlatTop"}},

                { Title: "波段线", ClassName:'hqchart_drawtool icon-draw_waveband',  Type:0, Data:{ ID:"波段线" }  },
                { Title: "百分比线", ClassName:'hqchart_drawtool icon-PercentageLine',  Type:0, Data:{ ID:"百分比线" }  },
                { Title: "黄金分割", ClassName:'hqchart_drawtool icon-GoldenSection',  Type:0, Data:{ ID:"黄金分割" }  },

                { Title: "线形回归线", ClassName:'hqchart_drawtool icon-linear_3',  Type:0, Data:{ ID:"线形回归线" }  },
                { Title: "线形回归带", ClassName:'hqchart_drawtool icon-linear_1',  Type:0, Data:{ ID:"线形回归带" }  },
                { Title: "延长线形回归带", ClassName:'hqchart_drawtool icon-linear_2',  Type:0, Data:{ ID:"延长线形回归带" }  },
            ]
        },
        { 
            Title:"形状",
            AryChart:
            [
                { Title: '圆弧线', ClassName: 'hqchart_drawtool icon-draw_arc', Type:0, Data:{ ID:"圆弧线" }  },
                { Title: '矩形', ClassName: 'hqchart_drawtool icon-rectangle', Type:0, Data:{ ID:"矩形" } },
                { Title: '平行四边形', ClassName: 'hqchart_drawtool icon-draw_quadrangle', Type:0, Data:{ ID:"平行四边形" }  },
                { Title: '三角形', ClassName: 'hqchart_drawtool icon-draw_triangle', Type:0, Data:{ ID:"三角形" }  },
                { Title: '圆', ClassName: 'hqchart_drawtool icon-draw_circle', Type:0, Data:{ ID:"圆" }  },
                { Title: '对称角度', ClassName: 'hqchart_drawtool icon-draw_symangle', Type:0, Data:{ ID:"对称角度" }  },
            ]
        },
        {
            Title:"波浪线",
            AryChart:
            [
                { Title: 'M头W底', ClassName: 'hqchart_drawtool icon-draw_wavemw', Type:0, Data:{ ID:"M头W底" } },
                { Title: '头肩型', ClassName: 'hqchart_drawtool icon-draw_head_shoulders_bt', Type:0, Data:{ ID:"头肩型" } },
                { Title: '波浪尺', ClassName: 'hqchart_drawtool icon-waveruler', Type:0, Data:{ ID:"波浪尺" } },
                { Title: 'AB波浪尺', ClassName: 'hqchart_drawtool icon-waveruler', Type:0, Data:{ ID:"AB波浪尺" } },
                
            ]
        },
        {
            Title:"斐波那契",
            AryChart:
            [
                { Title: '斐波那契周期线', ClassName: 'hqchart_drawtool icon-feibonaqizhouqixian', Type:0, Data:{ ID:"斐波那契周期线" } },
                { Title: '斐波那契楔形', ClassName: 'hqchart_drawtool icon-feibonaqiqixing', Type:0, Data:{ ID:"FibWedge" } },
                { Title: '斐波那契回撤', ClassName: 'hqchart_drawtool icon-feibonaqihuiche', Type:0, Data:{ ID:"FibRetracement" } },
                { Title: '斐波那契速度阻力扇', ClassName: 'hqchart_drawtool icon-feibonaqisuduzulishan', Type:0, Data:{ ID:"FibSpeedResistanceFan" } },
            ]
        },
        {
            Title:"测量工具",
            AryChart:
            [
                { Title: '价格范围', ClassName: 'hqchart_drawtool icon-shijianfanwei', Type:0, Data:{ ID:"PriceRange" }  },
                { Title: '时间范围', ClassName: 'hqchart_drawtool icon-jiagefanwei', Type:0, Data:{ ID:"DateRange" }  },
                { Title: "价格和时间范围", ClassName:"hqchart_drawtool icon-jiagefanwei", Type:0, Data:{ ID:"DatePriceRange" } },
                { Title: "监测线", ClassName:"hqchart_drawtool icon-jiance", Type:0, Data:{ ID:"MonitorLine"} },
            ]
        },
        {
            Title:"文字",
            AryChart:
            [
                { Title:"文字", ClassName: 'hqchart_drawtool icon-draw_text', Type:0, Data:{ ID:"文本" } },
                { Title:"锚点文字", ClassName: 'hqchart_drawtool icon-maodianwenzi', Type:0, Data:{ ID:"AnchoredText"  } },
                { Title:"注释", ClassName: 'hqchart_drawtool icon-maodian ', Type:0, Data:{ ID:"Note"} },
                { Title: '价格标签', ClassName: 'hqchart_drawtool icon-Tooltip', Type:0, Data:{ ID:"PriceLabel" }  },
                { Title: '价格注释', ClassName: 'hqchart_drawtool icon-tooltiptext', Type:0, Data:{ ID:"PriceNote" }  },
                { Title: '向上箭头', ClassName: 'iconfont icon-arrow_up', Type:0, Data:{ ID:"icon-arrow_up" } }, 
                { Title: '向下箭头', ClassName: 'iconfont icon-arrow_down', Type:0, Data:{ ID:"icon-arrow_down" } },
                { Title: '向左箭头', ClassName: 'iconfont icon-arrow_left', Type:0, Data:{ ID:"icon-arrow_left" }},
                { Title: '向右箭头', ClassName: 'iconfont icon-arrow_right', Type:0, Data:{ ID:"icon-arrow_right" }},
            ]
        }
        
    ];

    this.ToolConfig=
    {
        Title:"工具",
        AryTool:
        [
            { Title:"选中", ClassName:'hqchart_drawtool icon-arrow', Type:1, Data:{ID:JS_DRAWTOOL_MENU_ID.CMD_SELECTED_ID} },
            { Title:'尺子', ClassName: 'hqchart_drawtool icon-ruler', Type:0, Data:{ ID:"尺子" } },
            { Title:"磁铁", ClassName:'hqchart_drawtool icon-xifu', Type:2, Data:{ID:JS_DRAWTOOL_MENU_ID.CMD_ENABLE_MAGNET_ID} },
            { Title:"点击切换颜色", ClassName: 'hqchart_drawtool icon-fangkuai', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID }},
            { Title:"擦除画线", ClassName: 'hqchart_drawtool icon-a-xiangpicachuxiangpica', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_ERASE_DRAW_CHART_ID }},
            { Title:"删除所有画线", ClassName: 'hqchart_drawtool icon-recycle_bin', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_DELETE_ALL_DRAW_CHART_ID }}
        ]
    };


    this.DivDialog=null;
    this.AryDivChart=[];
    this.HQChart=null;
    this.LineColor='rgb(255,140,0)';
    this.LineColorIndex=0;
    this.RandomLineColor=["rgb(255,69,0)", "rgb(0,191,255)", "rgb(255,0,255)", "rgb(255,105,180)"];
    this.LineWidth=1*GetDevicePixelRatio();
    this.ColumnCount=5

    this.DragTitle=null;

    this.Inital=function(hqchart)
    {
       this.LineColor=g_JSChartResource.DrawPicture.LineColor[0];
       this.RandomLineColor.splice(0,0,this.LineColor);
       this.HQChart=hqchart;
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_DrawTool_Dialog_Div';

        var divTitle=document.createElement("div");
        divTitle.className='UMyChart_DrawTool_Title_Div';
        divTitle.innerText="画图工具";
        divTitle.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }

        var divClose=document.createElement("div");
        divClose.className='UMyChart_DrawTool_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.Close(e); }
        divTitle.appendChild(divClose);

        divDom.appendChild(divTitle);

        var table=document.createElement("table");
        table.className="UMyChart_DrawTool_Table";
        divDom.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_DrawTool_Tbody";
        table.appendChild(tbody);

        for(var i=0;i<this.AryChartGroup.length;++i)
        {
            var item=this.AryChartGroup[i];
            if (!IFrameSplitOperator.IsNonEmptyArray(item.AryChart)) continue;

            this.CreateChartGroupItem(item, tbody);

            var trDom=document.createElement("tr");
            trDom.className='UMyChart_DrawTool_Group_End_Tr';
            tbody.appendChild(trDom);
        }

        //工具栏
        this.CreateToolGroup(tbody);

        this.DivDialog=divDom;

        document.body.appendChild(divDom);
    }

    this.Destroy=function()
    {
        this.AryDivChart=[];
        if (this.DivDialog) document.body.removeChild(this.DivDialog);
        this.DivDialog=null;
    }

    this.CreateChartGroupItem=function(groupItem, tbody)
    {
        var trDom=document.createElement("tr");
        trDom.className='UMyChart_DrawTool_Group_Tr';
        tbody.appendChild(trDom);

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_DrawTool_Group_Td";
        tdDom.innerText=groupItem.Title;
        tdDom.colSpan=this.ColumnCount;
        trDom.appendChild(tdDom);

        var chartCount=groupItem.AryChart.length;
        for(var i=0,j=0;i<chartCount;)
        {
            var trDom=document.createElement("tr");
            trDom.className='UMyChart_DrawTool_Tr';

            for(j=0;j<this.ColumnCount && i<chartCount; ++j, ++i)
            {
                var item=groupItem.AryChart[i];
                this.CreateChartItem(item, trDom);
            }

            tbody.appendChild(trDom);
        }
    }

    this.CreateChartItem=function(item, trDom)
    {
        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_DrawTool_Td";
        tdDom.title=item.Title;
        trDom.appendChild(tdDom);

        var spanDom=document.createElement("span");
        spanDom.className=item.ClassName;
        spanDom.classList.add("UMyChart_DrawTool_Span");
        tdDom.appendChild(spanDom);

        var data={ Item:item, TD:tdDom, Span:spanDom };
        tdDom.onmousedown=(e)=> { this.OnClickItem(e, data); };   //点击

        this.AryDivChart.push(data);
    }

    this.OnClickItem=function(e, data)
    {
        console.log('[JSDialogDrawTool::OnClickChartItem] ', data);
        if (!data.Item || !data.Item.Data) return;

        var type=data.Item.Type;
        var id=data.Item.Data.ID;
        if (type==2 && id==JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID)
        {
            this.OnChangeLineColor(data);
        }
        else if (type==2 && id==JS_DRAWTOOL_MENU_ID.CMD_DELETE_ALL_DRAW_CHART_ID)
        {
            this.DeleteAllChart();
        }
        else if (type==2 &&  id==JS_DRAWTOOL_MENU_ID.CMD_ERASE_DRAW_CHART_ID)
        {
            this.ClearAllSelectedChart();
            this.ClearCurrnetDrawPicture();
            this.EnableEraseChart(true);
        }
        else if (type==1 && id==JS_DRAWTOOL_MENU_ID.CMD_SELECTED_ID)
        {
            this.ClearAllSelectedChart();
            this.ClearCurrnetDrawPicture();
            this.EnableEraseChart(false);
        }
        else if (type==2 && id==JS_DRAWTOOL_MENU_ID.CMD_ENABLE_MAGNET_ID)
        {
            this.ChangeMagnet(data);
        }
        else if (type==0)
    
        {
            this.ClearAllSelectedChart();
            this.EnableEraseChart(false);
            data.Span.classList.remove("UMyChart_DrawTool_Span");
            data.Span.classList.add("UMyChart_DrawTool_Span_Selected");
            this.CreateDrawPicture(data);
        }
    }

    //清空选中状态
    this.ClearAllSelectedChart=function()
    {
        for(var i=0;i<this.AryDivChart.length;++i)
        {
            var item=this.AryDivChart[i];
            if (item.Item.Type==2) continue;

            item.Span.classList.remove("UMyChart_DrawTool_Span_Selected");
            item.Span.classList.add("UMyChart_DrawTool_Span");
        }
    }

    this.CreateToolGroup=function(tbody)
    {
        var trDom=document.createElement("tr");
        trDom.className='UMyChart_DrawTool_Group_Tr';
        tbody.appendChild(trDom);

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_DrawTool_Group_Td";
        tdDom.innerText=this.ToolConfig.Title;
        tdDom.colSpan=this.ColumnCount;
        trDom.appendChild(tdDom);

        var chartCount=this.ToolConfig.AryTool.length;
        for(var i=0,j=0;i<chartCount;)
        {
            var trDom=document.createElement("tr");
            trDom.className='UMyChart_DrawTool_Tr';

            for(j=0;j<this.ColumnCount && i<chartCount; ++j, ++i)
            {
                var item=this.ToolConfig.AryTool[i];
                this.CreateToolItem(item, trDom);
            }

            tbody.appendChild(trDom);
        }
    }

    this.CreateToolItem=function(item, trDom)
    {
        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_DrawTool_Td";
        tdDom.title=item.Title;
        trDom.appendChild(tdDom);
        
        var spanDom=document.createElement("span");
        spanDom.className=item.ClassName;
        spanDom.classList.add("UMyChart_DrawTool_Span");
        tdDom.appendChild(spanDom);
        var data={ Item:item, TD:tdDom, Span:spanDom };

        if (item.Type==2 && item.Data.ID==JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID)   //颜色
        {
            spanDom.style['color']=this.LineColor;
        }
        
        tdDom.onmousedown=(e)=> { this.OnClickItem(e, data); };   //点击

        this.AryDivChart.push(data);
    }


    
    this.OnChangeLineColor=function(data)
    {
        ++this.LineColorIndex;
        var index=this.LineColorIndex%this.RandomLineColor.length;
        this.LineColor=this.RandomLineColor[index];

        data.Span.style['color']=this.LineColor;
    }

    //清空所有画图工具
    this.DeleteAllChart=function()
    {
        if (!this.HQChart) return;

        this.HQChart.ClearChartDrawPicture();
    }

    this.SetEraseChartButtonStatus=function(enable)
    {
        for(var i=0;i<this.AryDivChart.length;++i)
        {
            var item=this.AryDivChart[i];
            if (item.Item.Type==2 && item.Item.Data && item.Item.Data.ID==JS_DRAWTOOL_MENU_ID.CMD_ERASE_DRAW_CHART_ID)
            {
                if (enable)
                {
                    if (item.Span.classList.contains("UMyChart_DrawTool_Span"))
                    {
                        item.Span.classList.replace("UMyChart_DrawTool_Span", "UMyChart_DrawTool_Span_Selected");
                    }
                }
                else
                {
                    if (item.Span.classList.contains("UMyChart_DrawTool_Span_Selected"))
                    {
                        item.Span.classList.replace("UMyChart_DrawTool_Span_Selected","UMyChart_DrawTool_Span");
                    }
                }
                break;
            }
        }
    }

    this.EnableEraseChart=function(enable)
    {
        if (!this.HQChart) return;

        if (this.HQChart.EnableEraseChartDrawPicture==enable) return;

        this.HQChart.EnableEraseChartDrawPicture=enable;

        this.SetEraseChartButtonStatus(enable);
    }

    this.ChangeMagnet=function(data)
    {
        if (!this.HQChart) return;

        var enable=true;
        if (this.HQChart.ChartDrawOption.Magnet)
        {
            var item=this.HQChart.ChartDrawOption.Magnet;
            var enable=!item.Enable;
        }

        if (enable) 
        {
            this.HQChart.SetChartDrawOption({ Magnet:{ Enable:enable, Type:0 }});
            data.Span.classList.remove("UMyChart_DrawTool_Span");
            data.Span.classList.add("UMyChart_DrawTool_Span_Selected");
        }
        else 
        {
            this.HQChart.SetChartDrawOption({ Magnet:{ Enable:false }});
            data.Span.classList.remove("UMyChart_DrawTool_Span_Selected");
            data.Span.classList.add("UMyChart_DrawTool_Span");
        }
    }

    this.CreateDrawPicture=function(data)
    {
        if (!this.HQChart) return null;

        var option=
        { 
            LineColor:this.LineColor,   //线段颜色
            LineWidth:this.LineWidth,   //线段宽度
            PointColor:this.LineColor    //点颜色
        };

        var name=data.Item.Data.ID;
        if (["icon-arrow_up","icon-arrow_down","icon-arrow_left", "icon-arrow_right"].includes(name)) option=null;
        else if (name=="InfoLine") option.FormatLabelTextCallback=(lableInfo)=>{ this.ChartInfoLine_FormatLabelText(lableInfo); }
        else if (name=="MonitorLine") option.FormatLabelTextCallback=(lableInfo)=>{ this.ChartDrawMonitorLine_FormatLabelText(lableInfo); }
        

        this.HQChart.CreateChartDrawPicture(name, option, (chart)=>{ this.OnFinishDrawPicture(chart, data); });
    }

    this.ClearCurrnetDrawPicture=function()
    {
        if (this.HQChart) this.HQChart.ClearCurrnetDrawPicture();
    }

    //画图工具绘制完成
    this.OnFinishDrawPicture=function(chart, data)
    {
        data.Span.classList.remove("UMyChart_DrawTool_Span_Selected");
        data.Span.classList.add("UMyChart_DrawTool_Span");
    }

    this.Show=function(x, y)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }

    this.OnMouseDownTitle=function(e)
    {
        if (!this.DivDialog) return;

        var dragData={ X:e.clientX, Y:e.clientY };
        dragData.YOffset=e.clientX - this.DivDialog.offsetLeft;
        dragData.XOffset=e.clientY - this.DivDialog.offsetTop;
        this.DragTitle=dragData;

        document.onmousemove=(e)=>{ this.DocOnMouseMoveTitle(e); }
        document.onmouseup=(e)=>{ this.DocOnMouseUpTitle(e); }
    }

    this.DocOnMouseMoveTitle=function(e)
    {
        if (!this.DragTitle) return;

        var left = e.clientX - this.DragTitle.YOffset;
        var top = e.clientY - this.DragTitle.XOffset;

        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+ this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=window.innerHeight) top=window.innerHeight-this.DivDialog.offsetHeight-5;

        this.DivDialog.style.left = left + 'px';
        this.DivDialog.style.top = top + 'px';

        if(e.preventDefault) e.preventDefault();
    }

    this.DocOnMouseUpTitle=function(e)
    {
        this.DragTitle=null;
        this.onmousemove = null;
        this.onmouseup = null;
    }

    this.ChartInfoLine_FormatLabelText=function(labelInfo)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(labelInfo.AryValue)) return;
        if (!labelInfo.Data || !IFrameSplitOperator.IsNonEmptyArray(labelInfo.Data.Data)) return;
        for(var i=0;i<labelInfo.AryValue.length;++i)
        {
            var item=labelInfo.AryValue[i];
            if (!IFrameSplitOperator.IsNumber(item.XValue) || item.XValue<0) return;
        }

        var startIndex=labelInfo.AryValue[0].XValue;
        var endIndex=labelInfo.AryValue[1].XValue;
        var startItem=labelInfo.Data.Data[startIndex];
        var endItem=labelInfo.Data.Data[endIndex];
        if (!startItem || !endItem) return;

        var isMinutePeriod=ChartData.IsMinutePeriod(labelInfo.Data.Period, true);
        labelInfo.AryText=[];
        labelInfo.AryText.push({ Name:"起始日期: ", Text:IFrameSplitOperator.FormatDateString(startItem.Date), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });
        if (isMinutePeriod) labelInfo.AryText.push({ Name:"起始时间: ", Text:IFrameSplitOperator.FormatTimeString(startItem.Time, "HH:MM"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });

        labelInfo.AryText.push({ Name:"结束日期: ", Text:IFrameSplitOperator.FormatDateString(endItem.Date), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });
        if (isMinutePeriod) labelInfo.AryText.push({ Name:"结束时间: ", Text:IFrameSplitOperator.FormatTimeString(endItem.Time, "HH:MM"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });

        //示例：计算一个斜率数据
        var x=labelInfo.AryPoint[1].X-labelInfo.AryPoint[0].X;
        var y=labelInfo.AryPoint[1].Y-labelInfo.AryPoint[0].Y;
        var text="--";
        if (x!=0) text=`${(y/x).toFixed(4)}`;
        labelInfo.AryText.push({ Name:"斜率: ", Text:text, NameColor:"rgb(0,0,0)", TextColor:"rgb(238, 0, 238)"});
        labelInfo.AryText.push({ Name:"其他: ", Text:'......', NameColor:"rgb(0,0,0)", TextColor:"rgb(156, 156, 156)"});
    }

    this.ChartDrawMonitorLine_FormatLabelText=function(labelInfo)
    {
        if (!labelInfo.Data || !IFrameSplitOperator.IsNonEmptyArray(labelInfo.Data.Data)) return;
        if (!IFrameSplitOperator.IsNumber(labelInfo.StartIndex) || labelInfo.StartIndex<0) return;

        var startItem=labelInfo.Data.Data[labelInfo.StartIndex];
        var endItem=labelInfo.Data.Data[labelInfo.Data.Data.length-1];
        labelInfo.YValue=endItem.Close;
        var isMinutePeriod=ChartData.IsMinutePeriod(labelInfo.Data.Period, true);

        labelInfo.AryText=[];
        labelInfo.AryText.push({ Name:"起始: ", Text:IFrameSplitOperator.FormatDateString(startItem.Date,"MM-DD"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });
        if (isMinutePeriod) labelInfo.AryText.push({ Name:"起始: ", Text:IFrameSplitOperator.FormatTimeString(startItem.Time, "HH:MM"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });

        labelInfo.AryText.push({ Name:"最新: ", Text:IFrameSplitOperator.FormatDateString(endItem.Date,"MM-DD"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });
        if (isMinutePeriod) labelInfo.AryText.push({ Name:"最新: ", Text:IFrameSplitOperator.FormatTimeString(endItem.Time, "HH:MM"), NameColor:"rgb(0,0,0)", TextColor:"rgb(30,10,30)" });

        labelInfo.AryText.push({ Name:"ɑ: ", Text:"--.--", NameColor:"rgb(0, 0 ,255)", TextColor:"rgb(255, 165, 0)"});
        labelInfo.AryText.push({ Name:"β: ", Text:"--.--", NameColor:"rgb(0 ,0 ,255)", TextColor:"rgb(238 ,121, 66)"});
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// 修改画图工具
//
//
////////////////////////////////////////////////////////////////////////////////////
function JSDialogModifyDraw()
{
    this.DivDialog=null;
    this.HQChart;
    this.ChartPicture;
    //按钮
    this.ColorButton=null;
    this.BGColorButton=null;
    this.FontColorButton=null;
    this.BorderColorButton=null;

    this.RandomLineColor=["rgb(255,69,0)", "rgb(173,255,47)", "rgb(238,154,73)", "rgb(255,105,180)"];               //线段颜色
    this.RandomBGColor=["rgba(210,251,209，0.8)", "rgb(217,217,253)", "rgb(255,208,204)", "rgb(252,249,206)"];      //背景颜色
    this.RandomFontColor=["rgb(0,0,0)", "rgb(255, 0, 0)", "rgb(20, 255, 0)", "rgb(255, 0, 255)"];                   //文字颜色
    this.RandomBorderColor=["rgb(0,0,0)", "rgb(5, 246, 143)", "rgb(139, 137, 137)", "rgb(255, 20, 147)"];           //边框颜色

    this.AryButton=
    [
        { Title:"修改线段颜色", ClassName: 'hqchart_drawtool icon-huabi', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID }},
        { Title:"修改字体颜色", ClassName: 'hqchart_drawtool icon-zitiyanse', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_CHANGE_FONT_COLOR_ID }},
        { Title:"修改背景颜色", ClassName: 'hqchart_drawtool icon-zitibeijingse', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BG_COLOR_ID }},
        { Title:"修改边框颜色", ClassName: 'hqchart_drawtool icon-biankuang', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BORDER_COLOR_ID }},
        { Title:"删除图形", ClassName: 'hqchart_drawtool icon-recycle_bin', Type:2, Data:{ ID:JS_DRAWTOOL_MENU_ID.CMD_DELETE_DRAW_CHART_ID }}
    ];
   
    this.Inital=function(hqchart)
    {
       this.HQChart=hqchart;
    }

    this.Destroy=function()
    {
        this.ChartPicture=null;
        this.ColorButton=null;
        if (this.DivDialog)
        {
            document.body.remove(this.DivDialog);
            this.DivDialog=null;
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_Draw_Modify_Dialog_Div';

        var drgDiv=document.createElement("div");
        drgDiv.className="UMyChart_Draw_Modify_Dialog_Drag_Div";
        drgDiv.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }
        divDom.appendChild(drgDiv);

        var spanDom=document.createElement("span");
        spanDom.className="hqchart_drawtool icon-tuodong";
        spanDom.classList.add("UMyChart_DrawTool_Span");
        drgDiv.appendChild(spanDom);

        for(var i=0;i<this.AryButton.length;++i)
        {
            var item=this.AryButton[i];
            this.CreateButtonItem(item, divDom);
        }

        this.DivDialog=divDom;
        document.body.appendChild(divDom);
    }

    this.CreateButtonItem=function(item, parentDivDom)
    {
        var divItem=document.createElement("div");
        divItem.className="UMyChart_Draw_Modify_Dialog_Button_Div";

        var spanTooltip=document.createElement("span");
        spanTooltip.className="UMyChart_Draw_Modify_Tooltip";
        spanTooltip.innerText=item.Title;
        divItem.appendChild(spanTooltip);


        var spanDom=document.createElement("span");
        spanDom.className=item.ClassName;
        spanDom.classList.add("UMyChart_DrawTool_Span");
        divItem.appendChild(spanDom);
       

        var data={ Div:divItem, Span:spanDom, Parent:parentDivDom, Item:item, Tooltip:spanTooltip };
        divItem.onmousedown=(e)=> { this.OnClickButton(e, data); };   //点击

        divItem.onmouseover=(e)=> { this.OnHoverButton(e, data); }
        divItem.onmouseout=(e)=>{ this.OnLeaveButton(e, data); }

        switch(item.Data.ID)
        {
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID:
                this.ColorButton=data;
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BG_COLOR_ID:
                this.BGColorButton=data;
                divItem.style.display="none";
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_FONT_COLOR_ID:
                this.FontColorButton=data;
                divItem.style.display="none";
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BORDER_COLOR_ID:
                this.BorderColorButton=data;
                divItem.style.display="none";
                break;

        }

        parentDivDom.appendChild(divItem);
    }

    this.OnClickButton=function(e, data)
    {
        console.log('[JSDialogModifyDraw::OnClickButton] ', data);
        if (!data.Item || !data.Item.Data) return;

        var id=data.Item.Data.ID;
        switch(id)
        {
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_LINE_COLOR_ID:
                this.ModifyLineColor();
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_DELETE_DRAW_CHART_ID:
                this.DeleteDrawPicture();
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BG_COLOR_ID:
                this.ModifyBGColor();
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_FONT_COLOR_ID:
                this.ModifyFontColor();
                break;
            case JS_DRAWTOOL_MENU_ID.CMD_CHANGE_BORDER_COLOR_ID:
                this.ModifyBorderColor();
                break;
        }
    }

    this.OnHoverButton=function(e, data)
    {
        //var x=e.clientX;
        //data.Tooltip.style.left=x+"px";
        data.Tooltip.style.display="inline";
    }

    this.OnLeaveButton=function(e, data)
    {
        data.Tooltip.style.display="none";
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.ChartPicture=null;
        this.DivDialog.style.visibility='hidden';
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        return this.DivDialog.style.visibility==='visible';
    }

    this.DeleteDrawPicture=function()
    {
        if (this.ChartPicture && this.HQChart)
        {
            this.HQChart.ClearChartDrawPicture(this.ChartPicture);
        }

        this.Close();
    }

    this.ShowButton=function(dom, diaplay)
    {
        if (dom.style.display==diaplay) return;
        dom.style.display=diaplay;
    }

    this.GetRandomColor=function(currentColor, randomLineColor)
    {
        var colorIndex=0;
        for(var i=0;i<randomLineColor.length;++i)
        {
            if (currentColor==randomLineColor[i]) 
            {
                colorIndex=i+1;
                break;
            }
        }

        colorIndex=colorIndex%randomLineColor.length;
        var color=randomLineColor[colorIndex];

        return color;
    }

    this.ModifyLineColor=function()
    {
        if (!this.ChartPicture || !this.HQChart) return;

        var color=this.GetRandomColor(this.ChartPicture.LineColor, this.RandomLineColor);

        this.ChartPicture.LineColor = color;
        this.ChartPicture.PointColor = color;

        if (this.ColorButton) this.ColorButton.Span.style['color']=color;

        if (this.HQChart.ChartDrawStorage) this.HQChart.ChartDrawStorage.SaveDrawData(this.ChartPicture);   //保存下

        this.HQChart.Draw();
    }

    this.ModifyFontColor=function()
    {
        if (!this.ChartPicture || !this.HQChart) return;

        
        if (this.ChartPicture.ClassName=="ChartDrawNote")
        {
            var color=this.GetRandomColor(this.ChartPicture.NoteTextColor, this.RandomFontColor);
            this.ChartPicture.NoteTextColor=color;
        }
        else
        {
            var color=this.GetRandomColor(this.ChartPicture.TextColor, this.RandomFontColor);
            this.ChartPicture.TextColor=color;
        }
       

        if (this.FontColorButton) this.FontColorButton.Span.style['color']=color;

        if (this.HQChart.ChartDrawStorage) this.HQChart.ChartDrawStorage.SaveDrawData(this.ChartPicture);   //保存下

        this.HQChart.Draw();
    }

    this.ModifyBGColor=function()
    {
        if (!this.ChartPicture || !this.HQChart) return;

        if (this.ChartPicture.ClassName=="ChartDrawNote")
        {
            var color=this.GetRandomColor(this.ChartPicture.NoteBGColor, this.RandomBGColor);
            this.ChartPicture.NoteBGColor=color;
        }
        else
        {
            var color=this.GetRandomColor(this.ChartPicture.BGColor, this.RandomBGColor);
            this.ChartPicture.BGColor=color;
        }
       
        if (this.BGColorButton) this.BGColorButton.Span.style['color']=color;
        if (this.HQChart.ChartDrawStorage) this.HQChart.ChartDrawStorage.SaveDrawData(this.ChartPicture);   //保存下

        this.HQChart.Draw();
    }

    this.ModifyBorderColor=function()
    {
        if (!this.ChartPicture || !this.HQChart) return;

        if (this.ChartPicture.ClassName=="ChartDrawNote")
        {
            var color=this.GetRandomColor(this.ChartPicture.NoteBorderColor, this.RandomBorderColor);
            this.ChartPicture.NoteBorderColor=color;
        }
        else
        {
            var color=this.GetRandomColor(this.ChartPicture.BorderColor, this.RandomBorderColor);
            this.ChartPicture.BorderColor=color;
        }
        
       
        if (this.BorderColorButton) this.BorderColorButton.Span.style['color']=color;
        if (this.HQChart.ChartDrawStorage) this.HQChart.ChartDrawStorage.SaveDrawData(this.ChartPicture);   //保存下

        this.HQChart.Draw();
    }

    this.Show=function(x, y)
    {
        if (!this.DivDialog) this.Create();

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.SetChartPicture=function(chart)
    {
        this.ChartPicture=chart;

        var bShowLineColor=true, bShowBGColor=false, bShowFontColor=false, bShowBorderColor=false;
        var bgColor=null, fontColor=null,borderColor=null;
        var ARRAY_TEXT_CHART=['ChartDrawPriceLabel', "ChartDrawAnchoredText","ChartDrawPriceNote"];
        if (ARRAY_TEXT_CHART.includes(chart.ClassName))
        {
            bShowBGColor=true;
            bShowFontColor=true;
            bShowBorderColor=true;
            bgColor=chart.BGColor;
            fontColor=chart.TextColor;
            borderColor=chart.BorderColor;
        }
        else if (chart.ClassName=="ChartDrawNote")
        {
            bShowBGColor=true;
            bShowFontColor=true;
            bShowBorderColor=true;
            bgColor=chart.NoteBGColor;
            fontColor=chart.NoteTextColor;
            borderColor=chart.NoteBorderColor;
        }
        
        if (this.ColorButton)
        {
            var item=this.ColorButton;
            this.ShowButton(item.Div, bShowLineColor?"inline":"none");
            if (bShowLineColor)
            {
                item.Span.style['color']=chart.LineColor;
            }
        }

        if (this.BGColorButton)
        {
            var item=this.BGColorButton;
            this.ShowButton(item.Div, bShowBGColor?"inline":"none");
            if (bShowBGColor)
            {
                item.Span.style['color']=bgColor;
            }
        }

        if (this.FontColorButton)
        {
            var item=this.FontColorButton;
            this.ShowButton(item.Div, bShowFontColor?"inline":"none");
            if (bShowFontColor)
            {
                item.Span.style['color']=fontColor;
            }
        }

        if (this.BorderColorButton)
        {
            var item=this.BorderColorButton;
            this.ShowButton(item.Div, bShowBorderColor?"inline":"none");
            if (bShowBorderColor)
            {
                item.Span.style['color']=borderColor;
            }
        }
        
    }

    this.OnMouseDownTitle=function(e)
    {
        if (!this.DivDialog) return;

        var dragData={ X:e.clientX, Y:e.clientY };
        dragData.YOffset=e.clientX - this.DivDialog.offsetLeft;
        dragData.XOffset=e.clientY - this.DivDialog.offsetTop;
        this.DragTitle=dragData;

        document.onmousemove=(e)=>{ this.DocOnMouseMoveTitle(e); }
        document.onmouseup=(e)=>{ this.DocOnMouseUpTitle(e); }
    }

    this.DocOnMouseMoveTitle=function(e)
    {
        if (!this.DragTitle) return;

        var left = e.clientX - this.DragTitle.YOffset;
        var top = e.clientY - this.DragTitle.XOffset;

        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+ this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=window.innerHeight) top=window.innerHeight-this.DivDialog.offsetHeight-5;

        this.DivDialog.style.left = left + 'px'
        this.DivDialog.style.top = top + 'px'

        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }

    this.DocOnMouseUpTitle=function(e)
    {
        this.DragTitle=null;
        this.onmousemove = null;
        this.onmouseup = null;
    }
}





