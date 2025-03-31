
/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置指标搜索对话框 修改指标参数对话框
*/


function JSDialogSearchIndex()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.TitleBox=null; //{ DivTitle, DivName, DivName }
    this.InputDom=null;
    this.Style=0;       //样式 预留

    this.HQChart=null;

    //{ WindowIndex:窗口索引, OpType:1=切换主图指标 2=添加叠加指标 3=新增指标窗口,  Title: };  
    this.OpData=null;        

    this.TitleColor=g_JSChartResource.DialogSearchIndex.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogSearchIndex.TitleBGColor;
    this.BGColor=g_JSChartResource.DialogSearchIndex.BGColor;
    this.BorderColor=g_JSChartResource.DialogSearchIndex.BorderColor;
    this.IndexNameColor=g_JSChartResource.DialogSearchIndex.IndexNameColor;
    this.GroupNameColor=g_JSChartResource.DialogSearchIndex.GroupNameColor;
    this.InputTextColor=g_JSChartResource.DialogSearchIndex.InputTextColor;

    this.MaxRowCount=30;    //行
    this.ColCount=3;        //列
    this.MaxGroupCount=10;  //分类最多个数

    this.AryData=[];
    this.AryGroup=[];   //分类
    this.IndexData=JSDialogSearchIndex.GetDefaultIndexData();

    this.RestoreFocusDelay=800;

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
            if (option.IndexData) this.IndexData=option.IndexData;
            if (IFrameSplitOperator.IsNumber(option.MaxRowCount)) this.MaxRowCount=option.MaxRowCount;
        }
    }

    this.Destroy=function()
    {
        this.AryData=[];
        this.AryGroup=[];
        this.IndexData=null;
        this.InputDom=null;
        this.HQChart=null;

        if (this.DivDialog) 
        {
            document.body.removeChild(this.DivDialog);
            this.DivDialog=null;
        }
    }

    this.OnClickColseButton=function(e)
    {
        this.Close(e);
    }

    //设置当前窗口数据
    this.SetOpData=function(data)
    {
        this.OpData=data;
    }

    this.Close=function(e)
    {
        this.OpData=null;
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';

        if (this.HQChart) this.HQChart.RestoreFocus(this.RestoreFocusDelay);
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

    this.Show=function(x, y, groupID)
    {
        if (!this.DivDialog) return;

        if (this.HQChart) this.HQChart.ClearRestoreFocusTimer();
        
        if (!groupID) groupID=this.IndexData.Data[0].Group.ID;
        
        this.UpdateGroupData();
        this.ChangeGroup(groupID);

        if (this.OpData && this.OpData.Title) this.TitleBox.DivName.innerText=this.OpData.Title;

        if (!IFrameSplitOperator.IsNumber(x) || !IFrameSplitOperator.IsNumber(y))   //默认居中显示
        {
            var rtClient=this.HQChart.UIElement.getBoundingClientRect();
            x=rtClient.left+(rtClient.right-rtClient.left-this.DivDialog.offsetWidth)/2;
            y=rtClient.top+(rtClient.bottom-rtClient.top-this.DivDialog.offsetHeight)/2;
        }

        this.InputDom.value="";

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_SearchIndex_Dialog_Div';

        //对话框标题栏
        var divTitle=document.createElement("div");
        divTitle.className='UMyChart_SearchIndex_Title_Div';
        divTitle.onmousedown=(e)=>{   this.OnMouseDownTitle(e);}
        divDom.appendChild(divTitle);

        var divName=document.createElement("div");
        divName.className='UMyChart_SearchIndex_Name_Div';
        divName.innerText="指标搜索";
        divTitle.appendChild(divName);

        var divClose=document.createElement("div");
        divClose.className='UMyChart_SearchIndex_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.OnClickColseButton(e); }
        divTitle.appendChild(divClose);
        
        //整个框子
        var divFrame=document.createElement("div");
        divFrame.className="UMyChart_SearchIndex_Frome_Div";
        divDom.appendChild(divFrame);

        //搜索框
        var divInput=document.createElement("div");
        divInput.className="UMyChart_SearchIndex_Input_Div";
        divFrame.appendChild(divInput);

        var input=document.createElement("input");
        input.className='UMyChart_SearchIndex_Input';
        input.type="text";
        input.placeholder="输入指标名称"
        input.addEventListener("input", (e)=>{this.OnInputSearch(e); })
        divInput.appendChild(input);
        this.InputDom=input;

        //分类+指标内容
        var divContainer=document.createElement("div");
        divContainer.className="UMyChart_SearchIndex_Container_Div";
        divDom.appendChild(divContainer);

        //分类
        var divGroup=document.createElement("div");
        divGroup.className="UMyChart_SearchIndex_GroupList_Div";
        divContainer.appendChild(divGroup);

        for(var i=0, j=0;i<this.MaxGroupCount;++i)
        {
            var groupItem={ Div:null, Span:null };
            var divItem=document.createElement("div");
            divItem.className="UMyChart_SearchIndex_Group_Div";
            divGroup.appendChild(divItem);
            groupItem.Div=divItem;

            var spanDom=document.createElement("span");
            spanDom.className='UMyChart_SearchIndex_Group_Span';
            spanDom.innerText='分类名称';
            divItem.appendChild(spanDom);
            groupItem.Span=spanDom;

            spanDom.onmousedown=(e)=>{ this.OnClickGroup(e); }

            this.AryGroup.push(groupItem);
        }


        //表格
        var divTable=document.createElement("div");
        divTable.className='UMyChart_SearchIndex_Table_Div';
        divContainer.appendChild(divTable);
        
        var table=document.createElement("table");
        table.className="UMyChart_SearchIndex_Table";
        divTable.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_SearchIndex_Tbody";
        table.appendChild(tbody);

        this.AryData=[];
       
        for(var i=0, j=0;i<this.MaxRowCount;++i)
        {
            var rowItem={ Tr:null, AryCell:[] };

            var trDom=document.createElement("tr");
            trDom.className='UMyChart_SearchIndex_Group_Tr';
            tbody.appendChild(trDom);
            rowItem.Tr=trDom;

            for(j=0; j<this.ColCount;++j)
            {
                var cellItem=this.CreateCellDOM(i,j,trDom);
                rowItem.AryCell.push(cellItem);
            }

            this.AryData.push(rowItem);
        }
        
        document.body.appendChild(divDom);

        this.DivName=divName;
        this.DivDialog=divDom;
        this.TitleBox={ DivTitle:divTitle, DivName:divName, DivColor:divClose };

        this.UpdateStyle();
    }

    this.CreateCellDOM=function(rowID, colID, trDom)
    {
        var cellItem={ Td:null, Span:null, RowID:rowID, ColID:colID, IndexItem:null };
        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_SearchIndex_Text_Td";   //指标名称
        trDom.appendChild(tdDom);
        cellItem.Td=tdDom;

        var spanDom=document.createElement("span");
        spanDom.className='UMyChart_SearchIndex_Text_Span';
        spanDom.innerText='指标名称';
        spanDom.onmousedown=(e)=>{ this.OnClickIndex(e, cellItem); }
        tdDom.appendChild(spanDom);
        cellItem.Span=spanDom;

        return cellItem;
    }


    this.OnClickIndex=function(e, cellItem)
    {
        if (!this.OpData) return;
        if (!cellItem || !cellItem.IndexItem) return;

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.SEARCH_DIALOG_ON_CLICK_INDEX);
        if (event && event.Callback)
        {
            var sendData={ OpData:this.OpData, IndexData:cellItem.IndexItem, HQChart:this.HQChart, PreventDefault:false };
            event.Callback(event, sendData, this);

            if (sendData.PreventDefault==true) return;   //已被上层处理了
        }
        
        if (this.OpData.OpType==1)
        {
            if (!IFrameSplitOperator.IsNumber(this.OpData.WindowIndex)) return;
            var indexItem=cellItem.IndexItem;
            if (indexItem.Type==0 )  //系统指标 
            {
                this.HQChart.ChangeIndex(this.OpData.WindowIndex, indexItem.ID );
            }
            else if(indexItem.Type==4 || indexItem.Type==5) //五彩K线
            {
                this.HQChart.ChangeInstructionIndex(indexItem.ID);
            }
            else if (indexItem.Type==1) //自定义脚本指标
            {
                var indexData={ ID:indexItem.ID, Name:indexItem.Name, Script:indexItem.Script, Args:indexItem.Args };
                this.HQChart.ChangeScriptIndex(this.OpData.WindowIndex, indexData);
            }
            else if (indexItem.Type==2) //api指标
            {
                var indedData={ API: { ID:indexItem.ID, Name:indexItem.Name, Args:indexItem.Args, Url:'local'} };
                this.HQChart.ChangeAPIIndex(this.OpData.WindowIndex, indedData);
            }
            else if (indexItem.Type==3) //指标模板
            {
                this.HQChart.ChangeIndexTemplate(indexItem.TemplateData)
            }
        }
        else if (this.OpData.OpType==2)
        {
            if (!IFrameSplitOperator.IsNumber(this.OpData.WindowIndex)) return;
            var indexItem=cellItem.IndexItem;

            if (indexItem.Type==0)  //系统指标
            {
                var obj={ WindowIndex:this.OpData.WindowIndex, IndexName:indexItem.ID };
                this.HQChart.AddOverlayIndex(obj);
            }
            else if (indexItem.Type==1) //自定义脚本指标
            {
                var obj={ WindowIndex:this.OpData.WindowIndex, IndexName:indexItem.ID, Name:indexItem.Name, Script:indexItem.Script, Args:indexItem.Args };
                this.HQChart.AddOverlayIndex(obj);
            }
            else if (indexItem.Type==2) //api指标
            {
                var obj={ WindowIndex:this.OpData.WindowIndex, API: { ID:indexItem.ID, Name:indexItem.Name, Args:indexItem.Args, Url:'local'} };
                this.HQChart.AddOverlayIndex(obj);
            }
            else if (indexItem.Type==3) //指标模板
            {
                this.HQChart.ChangeIndexTemplate(indexItem.TemplateData)
            }
            else if(indexItem.Type==4 || indexItem.Type==5) //五彩K线
            {
                this.HQChart.ChangeInstructionIndex(indexItem.ID);
            }
        }
        else if (this.OpData.OpType==3) //新增加指标窗口
        {
            var indexItem=cellItem.IndexItem;
            if (indexItem.Type==0)  //系统指标
            {
                this.HQChart.AddIndexWindow(indexItem.ID, this.OpData);
            }
            else if (indexItem.Type==1) //自定义脚本指标
            {
                var indexData={ ID:indexItem.ID, Name:indexItem.Name, Script:indexItem.Script, Args:indexItem.Args };
                this.HQChart.AddScriptIndexWindow(indexData, this.OpData);
            }
            else if (indexItem.Type==2) //api指标
            {
                var indexData={ API: { ID:indexItem.ID, Name:indexItem.Name, Args:indexItem.Args, Url:'local'} };
                this.HQChart.AddAPIIndexWindow(indexData, this.OpData);
            }
            else if (indexItem.Type==3) //指标模板
            {
                this.HQChart.ChangeIndexTemplate(indexItem.TemplateData)
            }
        }
        
    }

    this.OnClickGroup=function(e)
    {
        if (!e.target) return false;
        var groupID=e.target.dataset.groupid;
        if (!groupID) return false;

        this.ChangeGroup(groupID);
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
        if (this.TitleColor) this.TitleBox.DivName.style['color']=this.TitleColor;

        if (this.InputTextColor) this.InputDom.style['color']=this.InputTextColor;
    };

    this.ChangeGroup=function(groupID)
    {
        if (!this.IndexData) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.IndexData.Data)) return;

        var findItem=null;
        for(var i=0; i<this.IndexData.Data.length; ++i)
        {
            var item=this.IndexData.Data[i];
            if (item.Group.ID==groupID)
            {
                findItem=item;
                break;
            }
        }

        if (!findItem) return;

        this.UpdateTableData(findItem);
    }

    //左侧分类
    this.UpdateGroupData=function()
    {
        var index=0;
        for(index=0; index<this.IndexData.Data.length && index<this.AryGroup.length; ++index)
        {
            var item=this.IndexData.Data[index];
            var cell=this.AryGroup[index];
            cell.Span.innerText=item.Group.Name;
            cell.Span.dataset.groupid=item.Group.ID;
            cell.Span.dataset.groupname=item.Group.Name;
            cell.Span.style.color=this.GroupNameColor;

            if (cell.Div.style.display=="none") cell.Div.style.display="";
        }

        for(; index<this.AryGroup.length; ++index)
        {
            var cell=this.AryGroup[index];
            cell.Div.style.display="none";
        }
    }

    this.UpdateTableData=function(data)
    {   
        var rowIndex=0;
        for(var j=0, index=0;rowIndex<this.AryData.length && index<data.AryIndex.length ;++rowIndex)
        {
            var row=this.AryData[rowIndex];
            var cellCount=0;
            for(j=0;j<row.AryCell.length;++j)
            {
                var cell=row.AryCell[j];
                if (index<data.AryIndex.length)
                {
                    var indexItem=data.AryIndex[index];
                    cell.Span.innerText=indexItem.Name;
                    cell.Span.style.color=this.IndexNameColor;
                    if (cell.Td.style.display=="none") cell.Td.style.display="";
                    cell.IndexItem=indexItem;
                    ++index;
                    ++cellCount;
                }
                else
                {
                    cell.Td.style.display="none";
                }
            }

            if (cellCount>0)
            {
                if (row.Tr.style.display=="none") row.Tr.style.display="";
            }
            else
            {
                row.Tr.style.display=="none";
            }
        }

        for(; rowIndex<this.AryData.length; ++rowIndex)
        {
            var row=this.AryData[rowIndex];
            row.Tr.style.display="none";
        }
    }

    //搜索
    this.OnInputSearch=function(e)
    {
        var strSearh=e.target.value;
        var aryIndex=[];

        var aryData=this.SeachIndex(strSearh);
        var setIndex=new Set();
        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            var key=`${item.ID}-${item.Type}`;
            setIndex.add(key);
            aryIndex.push(item);
        }

        //内置指标
        var scriptData = new JSIndexScript();
        var result=scriptData.Search(strSearh);
        if (IFrameSplitOperator.IsNonEmptyArray(result))
        {
            for(var i=0;i<result.length;++i)
            {
                var id=result[i];
                var key=`${id}-0`;
                if (setIndex.has(key)) continue;

                var item={Name:id, ID:id, Type:0 };
                aryIndex.push(item);
            }
        }

        this.UpdateTableData({ AryIndex:aryIndex })
    }

    this.SeachIndex=function(strSearch)
    {
        if (!this.IndexData || !IFrameSplitOperator.IsNonEmptyArray(this.IndexData.Data)) return [];

        var aryData=[];
        var upperSearch=strSearch.toUpperCase();
        for(var i=0,j=0;i<this.IndexData.Data.length;++i)
        {
            var groupItem=this.IndexData.Data[i];
            for(j=0;j<groupItem.AryIndex.length;++j)
            {
                var item=groupItem.AryIndex[j];
                if (item.Name.indexOf(strSearch)>=0 || item.Name.indexOf(upperSearch)>=0)
                {
                    aryData.push(item);
                }
            }
        }

        return aryData;
    }

    //配色修改
    this.ReloadResource=function(option)
    {
        this.TitleColor=g_JSChartResource.DialogSearchIndex.TitleColor;
        this.TitleBGColor=g_JSChartResource.DialogSearchIndex.TitleBGColor;
        this.BGColor=g_JSChartResource.DialogSearchIndex.BGColor;
        this.BorderColor=g_JSChartResource.DialogSearchIndex.BorderColor;
        this.IndexNameColor=g_JSChartResource.DialogSearchIndex.IndexNameColor;
        this.GroupNameColor=g_JSChartResource.DialogSearchIndex.GroupNameColor;
        this.InputTextColor=g_JSChartResource.DialogSearchIndex.InputTextColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();
    }

}


JSDialogSearchIndex.GetDefaultIndexData=function()
{
    var data=
    {
        Name:"内置指标分类",
        Data:
        [
            { 
                Group:{ ID:"超买超卖型", Name:"超买超卖型"} , 
                AryIndex:
                [
                    {Name:"ADTM 动态买卖气指标", ID:"ADTM", Type:0 },      //Type:0=系统指标 1=自定义通达信脚本 2=api指标 3=指标模板 4=交易系统 5=五彩K线 
                    {Name:"BIAS 乖离率", ID:"BIAS", Type:0},
                    {Name:"BIAS36 三六乖离", ID:"BIAS36", Type:0 },
                    {Name:"BIAS_QL 乖离率-传统版", ID:"BIAS_QL", Type:0 },
                    {Name:"CCI 商品路径指标",ID:"CCI", Type:0 },
                    {Name:"FSL 分水岭",ID:"FSL", Type:0},
                    {Name:"KDJ 随机指标",ID:"KDJ", Type:0},
                    {Name:"MTM 动量线", ID:"MTM", Type:0},
                    {Name:"OSC 变动速率线", ID:"OSC", Type:0},
                    {Name:"RSI 相对强弱指标", ID:"RSI", Type:0},
                    {Name:"ROC 变动率指标", ID:"ROC", Type:0},
                    {Name:"WR 威廉指标", ID:"WR", Type:0},
                    {Name:"UDL 引力线", ID:"UDL", Type:0},
                    {Name:"LWR 威廉指标", ID:"LWR", Type:0},
                    {Name:"MARSI 相对强弱平均线", ID:"MARSI", Type:0},
                    {Name:"ACCER 幅度涨速", ID:"ACCER", Type:0},
                    {Name:"CYD 承接因子", ID:"CYD", Type:0},
                    {Name:"CYF 市场能量", ID:"CYF", Type:0},
                    {Name:"ADTM 动态买卖气指标", ID:"ADTM", Type:0},
                    {Name:"ATR 真实波幅", ID:"ATR", Type:0},
                    {Name:"DKX 多空线", ID:"DKX", Type:0},
                    {Name:"TAPI 加权指数成交值", ID:"TAPI", Type:0},
                ]
            },

            {
                Group:{ ID:"趋势型", Name:"趋势型"}, 
                AryIndex:
                [
                    {Name:"CHO 济坚指数",         ID:"CHO", Type:0 },
                    {Name:"DMA 平均差",           ID:"DMA", Type:0 },
                    {Name:"DMI 趋向指标",         ID:"DMI", Type:0 },
                    {Name:"EMV 简易波动指标",     ID:"EMV", Type:0 },
                    {Name:"MACD 平滑异同平均",    ID:"MACD", Type:0 },
                    {Name:"TRIX 三重指数平均线",  ID:"TRIX", Type:0 },
                    {Name:"UOS 终极指标",         ID:"UOS", Type:0 },
                    {Name:"TRIX 三重指数平均线",  ID:"TRIX", Type:0 },
                    {Name:"VMACD 量平滑异同平均",  ID:"VMACD", Type:0 },

                    {Name:"VMACD 量平滑异同平均",  ID:"VMACD", Type:0 },
                    {Name:"SMACD 单线平滑异同平均线",  ID:"SMACD", Type:0 },
                    {Name:"QACD 快速异同平均",  ID:"QACD", Type:0 },
                    {Name:"VPT 量价曲线",  ID:"VPT", Type:0 },
                    {Name:"WVAD 威廉变异离散量",  ID:"WVAD", Type:0 },

                    {Name:"DBQR 对比强弱",  ID:"DBQR", Type:0 },
                    {Name:"WVAD 威廉变异离散量",  ID:"WVAD", Type:0 },
                    {Name:"JS 加速线",  ID:"JS", Type:0 },
                    {Name:"CYE 市场趋势",  ID:"CYE", Type:0 },
                    {Name:"QR 强弱指标",  ID:"QR", Type:0 },
                    {Name:"GDX 轨道线",  ID:"GDX", Type:0 },
                    {Name:"JLHB 绝路航标",  ID:"JLHB", Type:0 },
                ]
            },

            { 
                Group:{ ID:"成交量型", Name:"成交量型"}, 
                AryIndex:
                [
                    {Name:"HSL 换手率",           ID:"HSL", Type:0},
                    {Name:"OBV 累积能量线",       ID:"OBV", Type:0},
                    {Name:"NVI 负成交量",         ID:"NVI", Type:0},
                    {Name:"PVI 正成交量",         ID:"PVI", Type:0},
                    {Name:"VOL 成交量",           ID:"VOL", Type:0},
                    {Name:"VOL-TDX 成交量(虚拟)",           ID:"VOL-TDX", Type:0},
                    {Name:"AMO 成交金额",           ID:"AMO", Type:0},
                    {Name:"AMO-TDX 成交金额(虚拟)",           ID:"AMO-TDX", Type:0},
                    {Name:"VRSI 相对强弱量",           ID:"VRSI", Type:0},
                    {Name:"HSCOL 换手柱",           ID:"HSCOL", Type:0},
                    {Name:"DBQRV 对比强弱量",           ID:"DBQRV", Type:0},
                    {Name:"DBLB 对比量比",           ID:"DBLB", Type:0},
                    {Name:"WSBVOL 维斯波成交量",           ID:"WSBVOL", Type:0},

                    {Name:"CCYD 持仓异动(适用于期货)",           ID:"CCYD", Type:0},
                    {Name:"CCL 持仓量(适用于期货)",           ID:"CCL", Type:0},
                ]
            },
            {
                Group:{ ID:"均线型", Name:"均线型"} , 
                AryIndex:
                [
                    {Name:"MA 均线", ID:"MA", Type:0},
                    {Name:"MA4 4根均线", ID:"MA4", Type:0},
                    {Name:"MA5 5根均线", ID:"MA5", Type:0},
                    {Name:"MA7 6根均线", ID:"MA6", Type:0},
                    {Name:"MA7 7根均线", ID:"MA7", Type:0},
                    {Name:"MA8 8根均线", ID:"MA8", Type:0},
                    {Name:"BBI 多空线", ID:"BBI", Type:0},
                    {Name:"ACD 升降线", ID:"ACD", Type:0},
                    {Name:"EXPMA 指数平均线", ID:"EXPMA", Type:0},
                    {Name:"EXPMA_S 指数平均线-副图", ID:"EXPMA_S", Type:0},
                    {Name:"HMA 高价平均线", ID:"HMA", Type:0},
                    {Name:"LMA 低价平均线", ID:"LMA", Type:0},
                    {Name:"VMA 变异平均线", ID:"VMA", Type:0},
                    {Name:"AMV 成本价均线", ID:"AMV", Type:0},
                    {Name:"BBIBOLL 多空布林线", ID:"BBIBOLL", Type:0},
                    {Name:"ALLIGAT 鳄鱼线", ID:"ALLIGAT", Type:0},
                    {Name:"GMMA 顾比均线", ID:"GMMA", Type:0},
                ]
            },
            {
                Group:{ ID:"路径型", Name:"路径型"} , 
                AryIndex:
                [
                    {Name:"BOLL 布林线",          ID:"BOLL", Type:0},
                    {Name:"BOLL 布林线-副图",      ID:"BOLL副图", Type:0},
                    {Name:"MIKE 麦克支撑压力",    ID:"MIKE", Type:0},
                    {Name:"ENE 轨道线",           ID:"ENE", Type:0},
                    {Name:"PBX 瀑布线",           ID:"PBX", Type:0},
                    {Name:"XS 薛斯通道",           ID:"XS", Type:0},
                    {Name:"XS2 薛斯通道II",           ID:"XS2", Type:0},
                    {Name:"DC 唐奇安通道",           ID:"DC", Type:0}
                ]
            },
            {
                Group:{ ID:"能量型", Name:"能量型"} , 
                AryIndex:
                [
                    {Name:"BRAR 情绪指标",            ID:"BRAR", Type:0},
                    {Name:"CYR 市场强弱",             ID:"CYR", Type:0},
                    {Name:"MASS 梅斯线",              ID:"MASS", Type:0},
                    {Name:"PSY 心理线",               ID:"PSY", Type:0},
                    {Name:"CR 带状能量线",            ID:"CR", Type:0},
                    {Name:"VR 成交量变异率",          ID:"VR", Type:0},
                    {Name:"WAD 威廉多空力度线",        ID:"WAD", Type:0},
                    {Name:"PCNT 幅度比",        ID:"PCNT", Type:0}
                ]
            },
            {
                Group:{ ID:"大势型", Name:"大势型"}, 
                AryIndex:
                [
                    {Name:"ABI 绝对广量指标",         ID:"ABI", Type:0 },
                    {Name:"ADL 腾落指标",             ID:"ADL", Type:0 },
                ]
            },

            {
                Group:{ ID:"五彩K线", Name:"五彩K线"} , 
                AryIndex:
                [
                    {Name:"五彩K线-十字星",            ID:"五彩K线-十字星", Type:5},
                    {Name:"五彩K线-早晨之星",          ID:"五彩K线-早晨之星", Type:5},
                    {Name:"五彩K线-黄昏之星",          ID:"五彩K线-黄昏之星", Type:5},
                    {Name:"五彩K线-长十字",            ID:"五彩K线-长十字", Type:5},

                    {Name:"五彩K线-身怀六甲",          ID:"五彩K线-身怀六甲", Type:5},
                    {Name:"五彩K线-三个白武士",        ID:"五彩K线-三个白武士", Type:5},
                    {Name:"五彩K线-三只乌鸦",          ID:"五彩K线-三只乌鸦", Type:5},
                    {Name:"五彩K线-光头阳线",          ID:"五彩K线-光头阳线", Type:5},

                    {Name:"五彩K线-光脚阴线",          ID:"五彩K线-光脚阴线线", Type:5},
                    {Name:"五彩K线-垂死十字",          ID:"五彩K线-垂死十字", Type:5},
                    {Name:"五彩K线-早晨十字星",        ID:"五彩K线-早晨十字星", Type:5},
                    {Name:"五彩K线-黄昏十字星",        ID:"五彩K线-黄昏十字星", Type:5},

                    {Name:"五彩K线-射击之星",          ID:"五彩K线-射击之星", Type:5},
                    {Name:"五彩K线-倒转锤头",          ID:"五彩K线-倒转锤头", Type:5},
                    {Name:"五彩K线-锤头",              ID:"五彩K线-锤头", Type:5},
                    {Name:"五彩K线-吊颈",              ID:"五彩K线-吊颈星", Type:5},

                    {Name:"五彩K线-穿头破脚",              ID:"五彩K线-穿头破脚", Type:5},
                    {Name:"五彩K线-出水芙蓉",              ID:"五彩K线-出水芙蓉", Type:5},
                    {Name:"五彩K线-乌云盖顶",              ID:"五彩K线-乌云盖顶", Type:5},
                    {Name:"五彩K线-曙光初现",              ID:"五彩K线-曙光初现", Type:5},

                    {Name:"五彩K线-十字胎",               ID:"五彩K线-十字胎", Type:5},
                    {Name:"五彩K线-剑",                  ID:"五彩K线-剑", Type:5},
                    {Name:"五彩K线-平顶",                ID:"五彩K线-平顶", Type:5},
                    {Name:"五彩K线-平底",                ID:"五彩K线-平底", Type:5},

                    {Name:"五彩K线-大阳烛",              ID:"五彩K线-大阳烛", Type:5},
                    {Name:"五彩K线-大阴烛",              ID:"五彩K线-大阴烛", Type:5},

                    {Name:"五彩K线-好友反攻",              ID:"五彩K线-好友反攻", Type:5},
                    {Name:"五彩K线-跳空缺口",              ID:"五彩K线-跳空缺口", Type:5},

                    {Name:"五彩K线-双飞乌鸦",              ID:"五彩K线-双飞乌鸦", Type:5},
                    {Name:"五彩K线-上升三部曲",              ID:"五彩K线-上升三部曲", Type:5},
                    {Name:"五彩K线-下跌三部曲",              ID:"五彩K线-下跌三部曲", Type:5},
                    {Name:"五彩K线-长下影",                 ID:"五彩K线-长下影", Type:5},

                    {Name:"五彩K线-长上影",                 ID:"五彩K线-长上影", Type:5},
                    {Name:"五彩K线-分离",                 ID:"五彩K线-分离", Type:5},

                ]
            },
            {
                Group:{ ID:"交易系统", Name:"交易系统"} , 
                AryIndex:
                [
                    {Name:"交易系统-BIAS",            ID:"交易系统-BIAS", Type:4},
                    {Name:"交易系统-CCI",            ID:"交易系统-CCI", Type:4},
                    {Name:"交易系统-DMI",            ID:"交易系统-DMI", Type:4},
                    {Name:"交易系统-KD",            ID:"交易系统-KD", Type:4},

                    {Name:"交易系统-BOLL",            ID:"交易系统-BOLL", Type:4},
                    {Name:"交易系统-KDJ",            ID:"交易系统-KDJ", Type:4},
                    {Name:"交易系统-MACD",            ID:"交易系统-MACD", Type:4},
                    {Name:"交易系统-KD",            ID:"交易系统-KD", Type:4},

                    {Name:"交易系统-MTM",            ID:"交易系统-MTM", Type:4},
                    {Name:"交易系统-PSY",            ID:"交易系统-PSY", Type:4},
                    {Name:"交易系统-ROC",            ID:"交易系统-ROC", Type:4},
                    {Name:"交易系统-RSI",            ID:"交易系统-RSI", Type:4},

                    {Name:"交易系统-VR",            ID:"交易系统-VR", Type:4},
                    {Name:"交易系统-DPSJ",           ID:"交易系统-DPSJ", Type:4},

                ]
            },

            
            {
                Group:{ ID:"自定义", Name:"自定义"} , 
                AryIndex:
                [
                    { Name:"收盘线(后台指标)", ID:"CLOSE_LINE", Type:2, Args:null },
                    { Name:"高低均价(自定义脚本)", ID:"HIGH_LOW_AV", Type:1, Args:null , Script:"均价:(H+L)/2;高:H;低:L;", Args:[ { Name:'N', Value:20}, { Name:'M', Value:6}]},
                ]
            },
            {
                Group:{ ID:"组合指标", Name:"组合指标" } , 
                AryIndex:
                [
                    { 
                        Name:"BOLL+ENE+KDJ", ID:"9E154D3C-A4D4-40DD-8D8F-2C499F35E31B", Type:3,
                        TemplateData:
                        {
                            Windows:
                            [
                                { Index:"BOLL" },
                                { Index:"ENE" },
                                { Index:"KDJ"}
                            ]
                        }

                    },

                    { 
                        Name:"MA_OSC+DPO_RSI", ID:"E828DD1C-D41B-4888-9CB5-4CA1D84F7B50", Type:3, 
                        TemplateData:
                        {
                            Windows:
                            [
                                //{ API:{ Name:"后台指标ID", ID:"后台指标ID", Url:'local' } },
                                { Index:'MA', },
                                { Index:"DPO" },
                            ],

                            OverlayIndex: //叠加指标设置
                            [
                                {
                                    Index:'OSC', Windows:0, 
                                    //IsShareY:true,ShowRightText:false 
                                },
                                {
                                    Index:'RSI', Windows:1, 
                                    //ShowRightText:false 
                                },
                            ], 
                            
                            //KLine:{ Period:5, }
                        }
                    },
                ]
            }
            
        ]
       
    }

    return data;
}



function JSDialogModifyIndexParam()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.TitleBox=null; //{ DivTitle, DivName, DivName }
    this.Style=0;       //样式 预留

    this.TitleColor=g_JSChartResource.DialogModifyIndexParam.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogModifyIndexParam.TitleBGColor;
    this.BGColor=g_JSChartResource.DialogModifyIndexParam.BGColor;
    this.BorderColor=g_JSChartResource.DialogModifyIndexParam.BorderColor;
    this.ParamNameColor=g_JSChartResource.DialogModifyIndexParam.ParamNameColor;
    this.InputTextColor=g_JSChartResource.DialogModifyIndexParam.InputTextColor;

    this.MaxRowCount=30;    //行

    this.HQChart=null;

    this.AryData=[];
    this.IndexData=null;    //指标数据 { WindowsIndex:, Type:1=主图 2=叠加, Identify, IndexScript: }
    this.Arguments=[];           //参数备份

    this.RestoreFocusDelay=800;

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
            if (IFrameSplitOperator.IsNumber(option.MaxRowCount)) this.MaxRowCount=option.MaxRowCount;
        }
    }


    this.Destroy=function()
    {
        this.AryData=[];
        this.HQChart=null;

        if (this.DivDialog) 
        {
            document.body.removeChild(this.DivDialog);
            this.DivDialog=null;
        }
    }

    this.Show=function(x,y)
    {
        if (!this.DivDialog) return;

        if (this.HQChart) this.HQChart.ClearRestoreFocusTimer();

        this.UpdateParam();

        if (this.IndexData && this.IndexData.Title) this.TitleBox.DivName.innerText=this.IndexData.Title;

        if (!IFrameSplitOperator.IsNumber(x) || !IFrameSplitOperator.IsNumber(y))   //默认居中显示
        {
            var rtClient=this.HQChart.UIElement.getBoundingClientRect();
            x=rtClient.left+(rtClient.right-rtClient.left-this.DivDialog.offsetWidth)/2;
            y=rtClient.top+(rtClient.bottom-rtClient.top-this.DivDialog.offsetHeight)/2;
        }

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.OnClickColseButton=function(e)
    {
        this.RestoreParam();    //还原参数
        this.Close(e);
    }

    this.OnClickRestoreButton=function(e)
    {
        var aryText=this.Arguments;
        if (!aryText) aryText=[];
        this.UpdateParamTable(aryText);
        this.RestoreParam();
    }

    this.OnClickOkButton=function(e)
    {
        this.Close(e);
    }

    this.Close=function(e)
    {
        this.IndexData=null;
        this.Arguments=[];
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';

        if (this.HQChart) this.HQChart.RestoreFocus(this.RestoreFocusDelay);
    }

    this.SetIndexData=function(data)
    {
        this.IndexData=data;
        this.BackupParam();
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

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_ModifyIndexParam_Dialog_Div';

        //对话框标题栏
        var divTitle=document.createElement("div");
        divTitle.className='UMyChart_ModifyIndexParam_Title_Div';
        divTitle.onmousedown=(e)=>{   this.OnMouseDownTitle(e);}
        divDom.appendChild(divTitle);

        var divName=document.createElement("div");
        divName.className='UMyChart_ModifyIndexParam_Name_Div';
        divName.innerText="指标参数修改";
        divTitle.appendChild(divName);

        var divClose=document.createElement("div");
        divClose.className='UMyChart_ModifyIndexParam_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.OnClickColseButton(e); }
        divTitle.appendChild(divClose);
        
        //整个框子
        var divFrame=document.createElement("div");
        divFrame.className="UMyChart_ModifyIndexParam_Frome_Div";
        divDom.appendChild(divFrame);

        //表格
        var divTable=document.createElement("div");
        divTable.className='UMyChart_ModifyIndexParam_Table_Div';
        divFrame.appendChild(divTable);
        
        var table=document.createElement("table");
        table.className="UMyChart_ModifyIndexParam_Table";
        divTable.appendChild(table);

        /*
        var thead=document.createElement("thead");
        table.appendChild(thead);

        var trDom=document.createElement("tr");
        trDom.className='UMyChart_ModifyIndexParam_head_Tr';
        thead.appendChild(trDom);

        var thDom=document.createElement("th");
        thDom.className="UMyChart_ModifyIndexParam_Th"; 
        thDom.innerText="变量";
        trDom.appendChild(thDom);

        var thDom=document.createElement("th");
        thDom.className="UMyChart_ModifyIndexParam_Th"; 
        thDom.innerText="数值";
        trDom.appendChild(thDom);

        var thDom=document.createElement("th");
        thDom.className="UMyChart_ModifyIndexParam_Th"; 
        thDom.innerText="说明";
        trDom.appendChild(thDom);
        */


        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_ModifyIndexParam_Tbody";
        table.appendChild(tbody);

        this.AryData=[];
        for(var i=0;i<this.MaxRowCount;++i)
        {
            var rowItem=this.CreateRowDOM(i, tbody)

            this.AryData.push(rowItem);
        }

        var divButton=document.createElement("div");
        divButton.className='UMyChart_ModifyIndexParam_Button_Div';
        divFrame.appendChild(divButton);

        var btnRestore=document.createElement("button");
        //btnRestore.className="UMyChart_ModifyIndexParam_button";
        btnRestore.innerText="恢复默认";
        btnRestore.addEventListener("mousedown", (e)=>{ this.OnClickRestoreButton(e); });
        divButton.appendChild(btnRestore);

        var btnOk=document.createElement("button");
        //btnOk.className="UMyChart_ModifyIndexParam_button";
        btnOk.innerText="确认";
        btnOk.addEventListener("mousedown", (e)=>{ this.OnClickOkButton(e); })
        divButton.appendChild(btnOk);
        
        document.body.appendChild(divDom);

        this.DivName=divName;
        this.DivDialog=divDom;
        this.TitleBox={ DivTitle:divTitle, DivName:divName, DivColor:divClose };

        this.UpdateStyle();
    }

    this.CreateRowDOM=function(index, tbody)
    {
        var rowItem={ Tr:null, TdName:null, SpanName:null, TdValue:null, Input:null, ParamItem:null };

        var trDom=document.createElement("tr");
        trDom.className='UMyChart_ModifyIndexParam_Tr';
        tbody.appendChild(trDom);
        rowItem.Tr=trDom;

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_ModifyIndexParam_Name_Td";   //指标名称
        trDom.appendChild(tdDom);
        rowItem.TdName=tdDom;

        var spanDom=document.createElement("span");
        spanDom.className='UMyChart_ModifyIndexParam_Name_Span';
        spanDom.innerText='参数';
        tdDom.appendChild(spanDom);
        rowItem.SpanName=spanDom;

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_ModifyIndexParam_Value_Td";   //指标名称
        trDom.appendChild(tdDom);
        rowItem.TdValue=tdDom;

        var input=document.createElement("input");
        input.className='UMyChart_ModifyIndexParam_Input';
        input.type="number";
        input.step=1;
        input.addEventListener("mouseup", (e)=>{ this.OnParamMouseUp(e)});
        input.addEventListener("keyup", (e)=>{ this.OnParamKeyUp(e)})
        tdDom.appendChild(input);
        rowItem.Input=input;

        return rowItem;
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
        if (this.TitleColor) this.TitleBox.DivName.style['color']=this.TitleColor;
    };

    this.UpdateParamTable=function(aryText)
    {
        var index=0;
        for(index=0; index<aryText.length && index<this.AryData.length; ++index)
        {
            var item=aryText[index];
            var row=this.AryData[index];
            row.SpanName.innerText=`${item.Name}: `;
            row.SpanName.style.color=this.ParamNameColor;

            row.Input.value=item.Value;
            row.Input.style.color=this.InputTextColor;
            row.Input.dataset.paramid=item.Index;

            if (row.Tr.style.display=="none") row.Tr.style.display="";
        }

        for(; index<this.AryData.length; ++index)
        {
            var row=this.AryData[index];
            row.Tr.style.display="none";
            row.Input.dataset.paramid=-1;
        }
    }

    this.UpdateParam=function()
    {
        var aryText=[];
        var indexScript=this.IndexData.IndexScript;
        if (indexScript && IFrameSplitOperator.IsNonEmptyArray(indexScript.Arguments))
        {
            for(var i=0;i<indexScript.Arguments.length;++i)
            {
                var item=indexScript.Arguments[i];
                aryText.push({ Name:item.Name, Value:item.Value, Index:i });
            }
        }

        this.UpdateParamTable(aryText);
    }

    this.RestoreParam=function()
    {
        if (!this.IndexData || !this.IndexData.IndexScript) return;
        var indexScript=this.IndexData.IndexScript;

        if (!IFrameSplitOperator.IsNonEmptyArray(indexScript.Arguments)) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Arguments)) return;

        var bUpdate=false;
        for(var i=0;i<this.Arguments.length;++i)
        {
            var oldItem=this.Arguments[i];
            var item=indexScript.Arguments[i];
            if (oldItem.Value!=item.Value)
            {
                item.Value=oldItem.Value;
                bUpdate=true;
            }
        }

        if (!bUpdate) return;

        if (this.IndexData.Type==1) this.HQChart.UpdateWindowIndex(this.IndexData.WindowIndex);
        else if (this.IndexData.Type==2) this.HQChart.UpdateOverlayIndex(this.IndexData.Identify);
    }

    this.BackupParam=function()
    {
        this.Arguments=[];

        if (!this.IndexData || !this.IndexData.IndexScript) return;
        var indexScript=this.IndexData.IndexScript;
        if (IFrameSplitOperator.IsNonEmptyArray(indexScript.Arguments))
        {
            for(var i=0;i<indexScript.Arguments.length;++i)
            {
                var item=indexScript.Arguments[i];
                this.Arguments.push({Name:item.Name, Value:item.Value, Index:i});
            }
        }
    }

    this.OnParamMouseUp=function(e)
    {
        var input=e.target;
        var value=input.value;
        var id=input.dataset.paramid;

        this.ModifyParam(id, parseInt(value));
    }

    this.OnParamKeyUp=function(e)
    {
        var input=e.target;
        var value=input.value;
        var id=input.dataset.paramid;

        this.ModifyParam(id, parseInt(value));
    }

    this.ModifyParam=function(id, value)
    {   
        if (!this.IndexData || !this.IndexData.IndexScript) return;

        var indexScript=this.IndexData.IndexScript;
        var item=indexScript.Arguments[id];
        if (!item) return;
        if (item.Value==value) return;

        item.Value=value;

        

        if (this.IndexData.Type==1) 
        {
            this.HQChart.UpdateWindowIndex(this.IndexData.WindowIndex);
        }
        else if (this.IndexData.Type==2) 
        {
            this.HQChart.UpdateOverlayIndex(this.IndexData.Identify);
        }
    }
}




