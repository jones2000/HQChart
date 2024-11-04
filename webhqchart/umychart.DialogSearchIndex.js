
/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置指标搜索对话框
*/


function JSDialogSearchIndex()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.TitleBox=null; //{ DivTitle, DivName, DivName }
    this.InputDom=null;
    this.Style=0;       //样式 预留

    this.HQChart=null;

    //{ WindowIndex:窗口索引, OpType:1=切换主图指标 2=添加叠加指标,  Title: };  
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

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
            if (option.IndexData) this.IndexData=option.IndexData;
        }
    }

    this.Destroy=function()
    {
        this.AryData=[];
        this.AryGroup=[];
        this.IndexData=null;
        this.InputDom=null;
       
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

        if (this.OpData.OpType==1)
        {
            if (!IFrameSplitOperator.IsNumber(this.OpData.WindowIndex)) return;
            var indexItem=cellItem.IndexItem;
            if (indexItem.Type==0)  //系统指标
            {
                this.HQChart.ChangeIndex(this.OpData.WindowIndex, indexItem.ID );
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
                    {Name:"ADTM 动态买卖气指标", ID:"ADTM", Type:0 },      //Type:0=系统指标 1=自定义通达信脚本 2=api指标
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
                    {Name:"WR 威廉指标", ID:"WR", Type:0}
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
                    {Name:"TRIX 三重指数平均线",  ID:"TRIX", Type:0 }
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
                    {Name:"VOL 成交量",           ID:"VOL", Type:0}
                ]
            },
            {
                Group:{ ID:"均线型", Name:"均线型"} , 
                AryIndex:
                [
                    {Name:"MA 均线", ID:"MA", Type:0},
                    {Name:"BBI 多空线", ID:"BBI", Type:0}
                ]
            },
            {
                Group:{ ID:"路径型", Name:"路径型"} , 
                AryIndex:
                [
                    {Name:"BOLL 布林线",          ID:"BOLL", Type:0},
                    {Name:"BOLL副图 布林线",      ID:"BOLL副图", Type:0},
                    {Name:"MIKE 麦克支撑压力",    ID:"MIKE", Type:0},
                    {Name:"ENE 轨道线",           ID:"ENE", Type:0}
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
                    {Name:"WAD 威廉多空力度线",        ID:"WAD", Type:0}
                ]
            },

            /*
            {
                Group:{ ID:"自定义", Name:"自定义"} , 
                AryIndex:
                [
                    { Name:"收盘线(后台指标)", ID:"CLOSE_LINE", Type:2, Args:null },
                    { Name:"高低均价(自定义脚本)", ID:"HIGH_LOW_AV", Type:1, Args:null , Script:"均价:(H+L)/2;高:H;低:L;", Args:[ { Name:'N', Value:20}, { Name:'M', Value:6}]},
                ]
            }
            */
        ]
       
    }

    return data;
}




