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
                { Title: '射线', ClassName: 'hqchart_drawtool icon-draw_rays', Type:0, Data:{ ID:"射线" } },
                { Title: '标价线', ClassName: 'hqchart_drawtool icon-price_line', Type:0, Data:{ ID:"标价线" } },
                { Title: '垂直线', ClassName: 'hqchart_drawtool icon-vertical_line', Type:0, Data:{ ID:"垂直线" } },
                { Title: '箭头', ClassName: 'hqchart_drawtool icon-draw_rays', Type:0, Data:{ ID:"箭头" } },
                { Title: '趋势线', ClassName: 'hqchart_drawtool icon-draw_trendline', Type:0, Data:{ ID:"趋势线" } },
                { Title: '水平线', ClassName: 'hqchart_drawtool icon-draw_hline', Type:0, Data:{ ID:"水平线" } },
                { Title: '涂鸦线段', ClassName: 'hqchart_drawtool icon-draw_line', Type:0, Data:{ ID:"涂鸦线段" } },
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
                { Title: '箱型线', ClassName: 'iconfont icon-draw_box', Type:0, Data:{ ID:"箱型线" }  },
                { Title:"不相交通道", ClassName:"hqchart_drawtool icon-buxiangjiaojiao", Type:0, Data:{ ID:"DisjointChannel"} },
                { Title:"平滑顶/底", ClassName:"hqchart_drawtool icon-tubiao_buxiangjiaotongdao", Type:0, Data:{ ID:"FlatTop"}}
            ]
        },
        { 
            Title:"多边形",
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
            Title:"测量工具",
            AryChart:
            [
                { Title: '价格范围', ClassName: 'hqchart_drawtool icon-shijianfanwei', Type:0, Data:{ ID:"PriceRange" }  },
                { Title: '时间范围', ClassName: 'hqchart_drawtool icon-jiagefanwei', Type:0, Data:{ ID:"DateRange" }  },
            ]
        },
        {
            Title:"文字",
            AryChart:
            [
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
    this.ColumnCount=4;

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
        document.body.remove(this.DivDialog);
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

    this.CreateDrawPicture=function(data)
    {
        if (!this.HQChart) return null;

        var option=
        { 
            LineColor:this.LineColor,   //线段颜色
            LineWidth:this.LineWidth,   //线段宽度
            //PointColor:'rgba(255,130,71,0.5)'    //点颜色
        };

        var name=data.Item.Data.ID;
        if (["icon-arrow_up","icon-arrow_down","icon-arrow_left", "icon-arrow_right"].includes(name)) option=null;

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

        this.DivDialog.style.left = left + 'px'
        this.DivDialog.style.top = top + 'px'
    }

    this.DocOnMouseUpTitle=function(e)
    {
        this.DragTitle=null;
        this.onmousemove = null;
        this.onmouseup = null;
    }
}





