/////////////////////////////////////////////////////////////////////////////////////
//  股票分析思维导图
//  注:include umychart.js
/////////////////////////////////////////////////////////////////////////////////////

var JSMIND_NODE_ID =
{
    TABLE_NODE:1,        //表格节点
    TEXT_NODE:2,         //文本节点
    KLINE_NODE:3         //K线图
}

function JSMindNode()
{
    this.Name;
    this.ID=Guid();
    this.Title;
    this.ChartPaint=[];

    this.Data;              //原始的数据
    this.Position={};       //绘制的位置{X:, Y:, Width, Height}
    this.ScpritOption;      //脚本指标设置 {}  
    this.NodeType=0;

    this.Scprit;            //ScriptIndexConsole
    this.Children=[];       //子节点

    this.CreateScprit=function(obj)
    {
        var indexOption=
        { 
            Name:obj.Name, ID:this.ID, Args:obj.Args, Script:obj.Script, IsSectionMode:obj.IsSectionMode,
            ErrorCallback:obj.ErrorCallback, FinishCallback:obj.FinishCallback 
        };
        console.log('[JSMindNode::CreateScprit] indexOption, node ' , indexOption, this)
        this.Scprit=new ScriptIndexConsole(indexOption);
    }

    this.SetSelected=function(selected)
    {
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            item.IsSelected=selected;
        }
    }

    this.Move=function(xStep, yStep)
    {
        this.Position.X+=xStep;
        this.Position.Y+=yStep;
    }

    this.Draw=function()
    {
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            item.Draw();
        }
    }

    this.SetData=function(data,jsExectute)
    {
        switch(this.NodeType)
        {
            case JSMIND_NODE_ID.TABLE_NODE:
                return this.SetTableData(data,jsExectute);
            default:
                return false;
        }
    }

    this.SetTableData=function(data,jsExectute)
    {
        this.Data=data;
        
        var outVar=data.Out;
        var header=[], body=[];
        var headerFont=new JSFont();
        var colFont=new JSFont();
        headerFont.Color='rgb(51,51,51)';
        colFont.Color='rgb(51,51,51)'
        for(var i in outVar)
        {
            var item=outVar[i];
            var headerItem={Name:item.Name, Font:headerFont};
            header.push(headerItem);

            var colItem={Text:item.Data.toString(), Value:item.Data };
            body.push(colItem);
        }


        var chart=this.ChartPaint[0];
        chart.Data={ Header:[header], Body:[body] };
        return true;
    }

    this.SetSizeChange=function(bChanged)
    {
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            item.SizeChange=bChanged;
        }
    }
}

function JSFont()
{
    this.Color='rgb(0,0,0)';                 //颜色, 
    this.Name='微软雅黑';       //字体名字,
    this.Size=12;              // 字体大小

    this.GetFont=function()
    {
        return `${this.Size*GetDevicePixelRatio()}px ${this.Name}`;
    }

    this.GetFontHeight=function()
    {
        return this.Size*GetDevicePixelRatio();
    }
}


function JSMindContainer(uielement)
{
    this.ClassName='JSMindContainer';
    this.Frame;                                     //框架画法
    this.Nodes=[];      //JSMindNode
    this.Canvas=uielement.getContext("2d");         //画布
    this.LinesPaint=new NodeLinesPaint();
    this.LinesPaint.Canvas=this.Canvas;
    this.UIElement=uielement;
    this.MouseDrag;
    this.DragMode=1; 
    this.SelectedNode=null;     //当前选中节点
    this.Symbol;
    
    this.Create=function(obj)
    {
        this.UIElement.JSMindContainer=this;
    }

    uielement.onmousedown=function(e)
    {
        if(!this.JSMindContainer) return;
        var self=this.JSMindContainer;
        if(self.DragMode==0) return;

        var drag=
        {
            "Click":{},
            "LastMove":{}  //最后移动的位置
        };

        drag.Click.X=e.clientX;
        drag.Click.Y=e.clientY;
        drag.LastMove.X=e.clientX;
        drag.LastMove.Y=e.clientY;

        self.MouseDrag=drag;
        document.JSMindContainer=self;
        var oldSelectedNode=self.SelectedNode;
        var pixelTatio = GetDevicePixelRatio();

        var pt={};
        pt.X=(e.clientX-this.getBoundingClientRect().left)*pixelTatio;
        pt.Y=(e.clientY-this.getBoundingClientRect().top)*pixelTatio;
        var selectedNode=self.GetNodeByPoint(pt);
        self.SelectedNode=selectedNode;

        if (selectedNode!=oldSelectedNode)
        {
            if (oldSelectedNode) oldSelectedNode.SetSelected(false);
            if (selectedNode) selectedNode.SetSelected(true);
            self.Draw();
        }
        
        /*
        uielement.ondblclick=function(e)
        {
            var x = e.clientX-this.getBoundingClientRect().left;
            var y = e.clientY-this.getBoundingClientRect().top;

            if(this.JSChartContainer)
                this.JSChartContainer.OnDoubleClick(x,y,e);
        }
        */

        document.onmousemove=function(e)
        {
            if(!this.JSMindContainer) return;
            var self=this.JSMindContainer;
            var drag=self.MouseDrag;
            if (!drag) return;

            var moveSetp=Math.abs(drag.LastMove.X-e.clientX);

            if (self.SelectedNode)
            {
                if(Math.abs(drag.LastMove.X-e.clientX)<5 && Math.abs(drag.LastMove.Y-e.clientY)<5) return;

                if(self.MoveNode(e.clientX-drag.LastMove.X,e.clientY-drag.LastMove.Y))
                {
                    self.Draw();
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
            console.log('[JSMindContainer::document.onmouseup]',e);
            this.JSMindContainer.UIElement.style.cursor="default";
            this.JSMindContainer.MouseDrag=null;
            this.JSMindContainer=null;
        }
    }

    this.Draw=function()
    {
        if (this.UIElement.width<=0 || this.UIElement.height<=0) return; 
        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);

        for(var i in this.Nodes)
        {
            var item=this.Nodes[i];
            item.Draw();
        }

        this.LinesPaint.SetNodes(this.Nodes);
        this.LinesPaint.Draw();
    }

    this.GetNodeByPoint=function(pt)
    {
        for(var i in this.Nodes)
        {
            var node=this.Nodes[i];
            for(var j in node.ChartPaint)
            {
                var item=node.ChartPaint[j];
                if (item.IsPointIn(pt)==1) return node;
            }
        }

        return null;
    }

    this.MoveNode=function(xStep,yStep)
    {
        if (!this.SelectedNode) return false;

        this.SelectedNode.Move(xStep,yStep);
        return true;
    }

    //添加一个节点 {Name:, Title:, DataScprit:, NodeType:}
    this.AddNode=function(obj,nodeType)  
    {
        if (nodeType==JSMIND_NODE_ID.KLINE_NODE) return this.AddKLineNode(obj);

        var self=this;
        var node=new JSMindNode();
        node.Name=obj.Name;
        if (obj.Title) node.Title=obj.Title;
        if (obj.ID) node.ID=obj.ID; //外部可以指定id,但必须是唯一的
        node.NodeType=nodeType;
        node.Position=obj.Position;
        if (obj.Index)  //创建指标脚本
        {
            var indexInfo=
            {
                Name:obj.Index.Name, Args:obj.Index.Args, Script:obj.Index.Script, IsSectionMode:false,
                ErrorCallback: function(error) { self.ExecuteError(node,error); },
                FinishCallback:function(data, jsExectute) { self.ExecuteFinish(node, data, jsExectute); }
            };

            if (obj.Index.IsSectionMode==true) indexInfo.IsSectionMode=true;
            node.CreateScprit(indexInfo);
        }

        var chart=null;
        switch(nodeType)
        {
            case JSMIND_NODE_ID.TABLE_NODE:
                chart=new TableNodeChartPaint();
                if (obj.ShowMode>=1) chart.ShowMode=obj.ShowMode;    //显示模式
                break;
            case JSMIND_NODE_ID.TEXT_NODE:
                chart=new TextNodeChartPaint()
                if (obj.Content) chart.Data.Content=obj.Content;
                break;
            default:
                return null;
        }

        chart.Canvas=this.Canvas;
        chart.Title=obj.Title;
        chart.Position=node.Position;
        node.ChartPaint.push(chart);
        this.Nodes.push(node);

        return node;
    }

    this.AddTableNode=function(obj)
    {
        return this.AddNode(obj,JSMIND_NODE_ID.TABLE_NODE);
    }

    this.AddTextNode=function(obj)
    {
        return this.AddNode(obj,JSMIND_NODE_ID.TEXT_NODE);
    }

    this.AddKLineNode=function(obj)
    {
        var self=this;
        var node=new JSMindNode();
        node.Name=obj.Name;
        if (obj.Title) node.Title=obj.Title;
        if (obj.ID) node.ID=obj.ID; //外部可以指定id,但必须是唯一的
        node.NodeType=JSMIND_NODE_ID.KLINE_NODE;
        node.Position=obj.Position;

        chart=new KLineNodeChartPaint();
        chart.Canvas=this.Canvas;
        chart.Title=obj.Title;
        chart.SetOption(obj);
        chart.Position=node.Position;
        node.ChartPaint.push(chart);
        this.Nodes.push(node);
        return node;
    }

    this.ExecuteAllScript=function()
    {
        var stockObj=
        {
            HQDataType:HQ_DATA_TYPE.KLINE_ID,
            Stock: {Symbol:this.Symbol},
            Request: { MaxDataCount: 500, MaxMinuteDayCount:5 },
            Period:0 , Right:0
        };

        for(var i in this.Nodes)
        {
            var item=this.Nodes[i];
            if (item.NodeType==JSMIND_NODE_ID.KLINE_NODE)
            {
                item.ChartPaint[0].ChangeSymbol(this.Symbol);
            }
            else
            {
                if (!item.Scprit) continue;
                item.Scprit.ExecuteScript(stockObj);
            }
        }
    }

    this.ExecuteError=function(node,error)
    {
        console.log('[JSMindContainer::ExecuteError] node, error ', node, error);
    }

    this.ExecuteFinish=function(node, data, jsExectute)
    {
        console.log('[JSMindContainer::ExecuteFinish] node, data, jsExectute ', node, data, jsExectute);

        if (node.SetData(data,jsExectute)) 
        {
            node.SetSizeChange(true);
            this.Draw();
        }
    }

    this.LoadNodeData=function(data)    //加载节点树
    {
        for(var i in data.Root)
        {
            var item=data.Root[i];
            this.LoadRootNode(item);
        }

        if (data.Lines) this.LoadNodeLines(data);
    }

    this.LoadRootNode=function(node)    //加载主节点
    {
        var jsNode=this.AddNode(node, node.Type);

        if (node.Children)
        {
            for(var j in node.Children)
            {
                var childItem=node.Children[j];
                this.LoadChildNode(childItem,jsNode);
            }
        }
    }

    this.LoadChildNode=function(node,parentJSNode)  //加载子节点
    {
        if (!node || !parentJSNode)  return;

        var jsNode=this.AddNode(node,node.Type);
        if (!jsNode) return;

        if (node.Children)
        {
            for(var i in item.Children)
            {
                var childItem=item.Children[i];
                this.LoadChildNode(childItem,jsNode);
            }
        }

        parentJSNode.Children.push(jsNode);
    }

    this.LoadNodeLines=function(data)
    {
        var lines=data.Lines;
        var linesData=[];
        for(var i in lines)
        {
            var item=lines[i];
            var line={Start:item.Start, End:item.End, Type:0 };
            if (item.Type>=1) line.Type=item.Type;
            linesData.push(line);
        }

        this.LinesPaint.Data=linesData;
    }
}  


function INodeChartPainting()
{
    this.Canvas;                            //画布
    this.ChartBorder;                       //边框信息
    this.Name;                              //名称
    this.ClassName='INodeChartPainting';    //类名
    this.SizeChange=true;
    this.IsSelected=false;                  //是否被选中
    this.SelectedColor='rgb(0,40,40)';      //选中点颜色
    this.SelectedPointSize=4*GetDevicePixelRatio();

    this.Title;                             //标题
    this.TitleFont=new JSFont();
    this.TittleBG='rgb(220,220,220)';       //标题背景颜色
    this.PenBorder="rgb(105,105,105)";      //边框颜色
    this.PixelRatio=GetDevicePixelRatio();;
    
    this.Data;                              //数据区
    this.Position;

    this.Draw=function() { }

    this.ToInt=function(value)
    {
        return Math.floor(value+0.5);
    }

    this.IsNull=function(value)
    {
        if (value===undefined) return true;
        if (value===null) return true;
        return false;
    }

    this.IsPointIn=function(pt) // -1=不在上面, 0=表头 
    {
        return -1;
    }
}



function TableNodeChartPaint()
{
    this.newMethod=INodeChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='TableNodeChartPaint';    //类名
    this.Data={Header:[], Body:[]};
    //this.Data; [ [{ Name:列名1, Font:字体设置, ColFont:列字体(缺省使用Font) }, { Name:列名2, Font:字体设置 },], [{Text:显示内容, Value:数值, Font:}, ] ]
    /*
    this.Data={
        Header:[ [
            { Name:'列名1', Font:new JSFont() }, 
            { Name:'列名2', Font:new JSFont(), ColFont:new JSFont() },
            { Name:'列名3', Font:new JSFont(), ColFont:new JSFont() }
        ] ],
        Body:[ 
            [ {Text:'显示内容1-1', Value:1 },  {Text:'显示内容1-2', Value:1 }, {Text:'显示内容1-3', Value:1 } ],  
            [ {Text:'显示内容(擎擎擎擎擎擎擎)2-1', Value:1 },  {Text:'显示内容2-2', Value:1 } ,{Text:'显示内容2-3', Value:1 }],
            [ {Text:'显示内容3-1', Value:1 },  {Text:'显示内容(擎擎擎擎擎)3-2', Value:1 } ,{Text:'显示内容3-3', Value:1 }],
            [ {Text:'显示内容4-1', Value:1 },  {Text:'显示内容4-2', Value:1 } ,{Text:'显示内容(擎擎)4-3', Value:1 }]
        ]
    };
    */
    this.ShowMode=1;    //1 横向显示  2 竖向显示

    this.HeaderCache;   //横向 [ {Height:宽度 } ] | 竖向  [{Width:高度}]
    this.ColumeCache;   //[ {Height:, ColFont:}]  | 竖向  [ {Width:} ]
    this.RowHeightCache; //[{Height:,RowFont:}]
    this.WidthCache;    //整个宽度
    this.HeightCache;   //整个高度
    this.TitleHeightCache;

    this.X=0;
    this.Y=0;
    this.Width=0;

    this.ColMargin={ Left:5, Top:5, Right:5, Bottom:5 };
    this.TitleMargin={ Left:5, Top:5, Right:5, Bottom:5 };
    this.HeaderMargin={ Left:5, Top:5, Right:5, Bottom:5 };

    this.Draw=function()
    {
        this.X=this.Position.X;
        this.Y=this.Position.Y;
        this.Width=this.Position.Width;
        this.PixelRatio=GetDevicePixelRatio();

        if (this.ShowMode==2)
        {
            if (this.SizeChange==true) this.CacluateSize2();
            this.DrawBorder2();
            this.DrawTitle();
            this.DrawHeader2();
            this.DrawBody2();
        }
        else
        {
            if (this.SizeChange==true) this.CacluateSize()
            this.DrawBorder();
            this.DrawTitle();
            this.DrawHeader();
            this.DrawBody();
        }

        this.DrawSelectPoint();

        this.SizeChange=false;
    }

    this.DrawTitle=function()
    {
        var pixelRatio=this.PixelRatio;
        var titleHeight=this.TitleHeightCache;
        this.Canvas.font=this.TitleFont.GetFont();

        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.TitleFont.Color;
        this.Canvas.fillText(this.Title,this.X+this.ToInt(this.WidthCache/2),this.Y+this.ToInt(titleHeight/2));

        this.Y+=this.TitleHeightCache;
    }

    this.DrawHeader=function()
    {
        var x=this.X, y=this.Y;
        var aryHeader=this.Data.Header;
        var pixelRatio=this.PixelRatio;
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='bottom';
        for(var i in aryHeader)
        {
            var header=aryHeader[i];
            var cacheItem=this.HeaderCache[i];
            var headerHeight=cacheItem.Height;
            var left=x, top=y;
            for(var j in header)
            {
                var item=header[j];
                var itemWidth=this.ColumeCache[j].Width;
                this.Canvas.font=item.Font.GetFont();
                this.Canvas.fillStyle=item.Font.Color;
                this.Canvas.fillText(item.Name,left+this.ToInt((itemWidth)/2),top+headerHeight-this.ColMargin.Bottom*pixelRatio);

                left+=itemWidth;
            }
            y+=headerHeight;
        }

        this.Y=y;
    }

    this.DrawBody=function()
    {
        var x=this.X, y=this.Y;
        var body=this.Data.Body;
        var pixelRatio=this.PixelRatio;
        this.Canvas.textAlign='left';
        this.Canvas.textBaseline='bottom';
        var rowHeight=this.RowHeightCache;
        for(var i in body)
        {
            var row=body[i];
            var left=x, top=y;
            for(var j in row)
            {
                var font=this.ColumeCache[j].Font;
                var colWidth=this.ColumeCache[j].Width;
                var item=row[j];
                this.Canvas.font=font.GetFont();   //计算宽度

                this.Canvas.font=font.GetFont();
                this.Canvas.fillStyle=font.Color;
                this.Canvas.fillText(item.Text,left+this.ColMargin.Left*pixelRatio,top+rowHeight-this.ColMargin.Bottom*pixelRatio);
                left+=colWidth;
            }
            y+=rowHeight;
        }
    }

    this.DrawBorder=function()
    {
        this.Canvas.strokeStyle=this.PenBorder;
        var left=this.X,top=this.Y;
        var right=left+this.WidthCache;

        if (this.TittleBG)  //标题背景
        {
            this.Canvas.fillStyle=this.TittleBG;
            this.Canvas.fillRect(left, top,this.WidthCache,this.TitleHeightCache);
        }

        this.Canvas.beginPath();    //标题
        this.Canvas.moveTo(left,ToFixedPoint(top+this.TitleHeightCache));
        this.Canvas.lineTo(right,ToFixedPoint(top+this.TitleHeightCache));
        top+=this.TitleHeightCache;
        var tableTop=top;

        for(var i in this.HeaderCache)  //标题
        {
            var item=this.HeaderCache[i];
            this.Canvas.moveTo(left,ToFixedPoint(top+item.Height));
            this.Canvas.lineTo(right,ToFixedPoint(top+item.Height));
            top+=item.Height;
        }
        
        var body=this.Data.Body;
        for(var i in body)          //行
        {
            if (i<body.length-1)
            {
                this.Canvas.moveTo(left,ToFixedPoint(top+this.RowHeightCache));
                this.Canvas.lineTo(right,ToFixedPoint(top+this.RowHeightCache));
            }
            top+=this.RowHeightCache
        }

        for(var i in this.ColumeCache)
        {
            var item=this.ColumeCache[i];
            if (i<this.ColumeCache.length-1)
            {
                this.Canvas.moveTo(ToFixedPoint(left+item.Width),ToFixedPoint(tableTop));
                this.Canvas.lineTo(ToFixedPoint(left+item.Width),ToFixedPoint(top));
            }
            left+=item.Width;
        }

        //四周边框
        this.Canvas.moveTo(ToFixedPoint(this.X),ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(top));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(top));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(this.Y));

        this.Canvas.stroke();
    }

    this.CacluateSize=function()
    {
        var pixelRatio=this.PixelRatio;
        this.HeaderCache=[];
        this.ColumeCache=[];
        this.RowHeightCache=null;
        this.WidthCache=null;
        this.HeightCache=0;
        this.TitleHeightCache=null;

        this.TitleHeightCache=this.TitleFont.GetFontHeight()+(this.TitleMargin.Top+this.TitleMargin.Bottom)*pixelRatio;
        this.Canvas.font=this.TitleFont.GetFont();
        this.WidthCache=this.Canvas.measureText(this.Title).width+(this.TitleMargin.Left+this.TitleMargin.Right)*pixelRatio;
        this.HeightCache+=this.TitleHeightCache;

        var aryHeader=this.Data.Header;
        for(var i in aryHeader)
        {
            var header=aryHeader[i];
            var headerCache={ Height:null };
            this.RowHeightCache=null;
            for(var j in header)
            {
                var item=header[j];
                var fontHeight=item.Font.GetFontHeight()+(this.HeaderMargin.Top+this.HeaderMargin.Bottom)*pixelRatio;
                if (headerCache.Height==null || headerCache.Height<fontHeight) headerCache.Height=fontHeight;    //表头高度

                this.Canvas.font=item.Font.GetFont();   //计算宽度
                var textWidth=this.ToInt(this.Canvas.measureText(item.Name).width+(this.HeaderMargin.Left+this.HeaderMargin.Right)*pixelRatio);

                var colFont=item.ColFont? item.ColFont:item.Font;   //行高
                var rowHeight=colFont.GetFontHeight()+(this.ColMargin.Top+this.ColMargin.Bottom)*pixelRatio;
                if (this.RowHeightCache==null || this.RowHeightCache<rowHeight) this.RowHeightCache=rowHeight;
                if (this.IsNull(this.ColumeCache[j]))
                {
                    this.ColumeCache[j]={ Font:colFont, Width:textWidth };
                }
                else
                {
                    var colItem=this.ColumeCache[j];
                    colItem.Font=colFont;
                    if (colItem.Width<textWidth) colItem.Width=textWidth;
                }
            }

            this.HeaderCache[i]=headerCache;
            this.HeightCache+=headerCache.Height;
        }

        //计算表格每列最大宽度
        var body=this.Data.Body;
        for(var i in body)
        {
            var row=body[i];
            for(var j in row)
            {
                var font=this.ColumeCache[j].Font;
                var item=row[j];
                this.Canvas.font=font.GetFont();   //计算宽度
                var textWidth=this.ToInt(this.Canvas.measureText(item.Text).width+(this.ColMargin.Left+this.ColMargin.Right)*pixelRatio);
                if (this.ColumeCache[j].Width<textWidth) this.ColumeCache[j].Width=textWidth;
            }

            this.HeightCache+=this.RowHeightCache;
        }

        var totalWidth=0;
        for(var i in this.ColumeCache)
        {
            totalWidth+=this.ColumeCache[i].Width;
        }

        if (totalWidth>this.WidthCache)
        {
            this.WidthCache=totalWidth;
        }
    }

    //横向
    this.CacluateSize2=function()
    {
        var pixelRatio=this.PixelRatio;
        this.HeaderCache=[];
        this.ColumeCache=[];
        this.RowHeightCache=[];
        this.WidthCache=null;
        this.HeightCache=0;
        this.TitleHeightCache=null;

        this.TitleHeightCache=this.TitleFont.GetFontHeight()+(this.TitleMargin.Top+this.TitleMargin.Bottom)*pixelRatio;
        this.Canvas.font=this.TitleFont.GetFont();
        this.WidthCache=this.Canvas.measureText(this.Title).width+(this.TitleMargin.Left+this.TitleMargin.Right)*pixelRatio;
        this.HeightCache+=this.TitleHeightCache;

        var aryHeader=this.Data.Header;
        for(var i in aryHeader)
        {
            var header=aryHeader[i];
            var headerCache=null;
            if (this.IsNull(this.HeaderCache[i]))   headerCache={ Width:null };
            else headerCache=this.HeaderCache[i];

            for(var j in header)
            {
                var item=header[j];
                var fontHeight=item.Font.GetFontHeight()+(this.HeaderMargin.Top+this.HeaderMargin.Bottom)*pixelRatio;

                this.Canvas.font=item.Font.GetFont();   //计算宽度
                var textWidth=this.ToInt(this.Canvas.measureText(item.Name).width+(this.HeaderMargin.Left+this.HeaderMargin.Right)*pixelRatio);
                if (headerCache.Width==null || headerCache.Width<textWidth) headerCache.Width=textWidth;

                var colFont=item.ColFont? item.ColFont:item.Font;   //行高
                var rowCache=null;
                if (this.IsNull(this.RowHeightCache[j]))
                {
                    rowCache={ Height:fontHeight, RowFont:colFont};
                    this.RowHeightCache[j]=rowCache;
                }
                else
                {
                    rowCache=this.RowHeightCache[j];
                    if (rowCache.Heigh<fontHeight) rowCache.Heigh=fontHeight;
                    rowCache.RowFont=colFont;
                }
            }

            this.HeaderCache[i]=headerCache;
        }

        //计算表格每列最大宽度
        var body=this.Data.Body;
        for(var i in body)
        {
            var row=body[i];
            var colCache=null;
            if (this.IsNull(this.ColumeCache[i]))
            {
                colCache={Width:null};
                this.ColumeCache[i]=colCache;
            }
            else
            {
                colCache=this.ColumeCache[j];
            }

            for(var j in row)
            {
                var font=this.RowHeightCache[j].RowFont;
                var item=row[j];
                this.Canvas.font=font.GetFont();   //计算宽度
                var textWidth=this.ToInt(this.Canvas.measureText(item.Text).width+(this.ColMargin.Left+this.ColMargin.Right)*pixelRatio);
                if (colCache.Width<textWidth) colCache.Width=textWidth;
            }
        }

        var totalWidth=0;
        for(var i in this.HeaderCache)
        {
            totalWidth+=this.HeaderCache[i].Width;
        }

        for(var i in this.ColumeCache)
        {
            totalWidth+=this.ColumeCache[i].Width;
        }

        if (totalWidth>this.WidthCache)
        {
            this.WidthCache=totalWidth;
        }

        for(var i in this.RowHeightCache)
        {
            this.HeightCache+=this.RowHeightCache[j].Height;
        }
    }

    this.DrawHeader2=function()
    {
        var x=this.X, y=this.Y;
        var aryHeader=this.Data.Header;
        var pixelRatio=this.PixelRatio;
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='bottom';
        for(var i in aryHeader)
        {
            var header=aryHeader[i];
            var cacheItem=this.HeaderCache[i];
            var headerWidth=cacheItem.Width;
            var left=x, top=y;
            for(var j in header)
            {
                var item=header[j];
                var itemHeight=this.RowHeightCache[i].Height;
                this.Canvas.font=item.Font.GetFont();
                this.Canvas.fillStyle=item.Font.Color;
                this.Canvas.fillText(item.Name,left+this.ToInt((headerWidth)/2),top+itemHeight-this.ColMargin.Bottom*pixelRatio);

                top+=itemHeight;
            }
            x+=headerWidth;
        }

        this.X=x;
    }

    this.DrawBody2=function()
    {
        var x=this.X, y=this.Y;
        var body=this.Data.Body;
        var pixelRatio=this.PixelRatio;
        this.Canvas.textAlign='left';
        this.Canvas.textBaseline='bottom';

        var left=x, top=y;
        for(var i in body)
        {
            var row=body[i];
            var colWidth=this.ColumeCache[i].Width;
            var top=y;
            for(var j in row)
            {
                var font=this.RowHeightCache[j].RowFont;
                var colHeight=this.RowHeightCache[j].Height;
                var item=row[j];
               
                this.Canvas.font=font.GetFont();
                this.Canvas.fillStyle=font.Color;
                this.Canvas.fillText(item.Text,left+this.ColMargin.Left*pixelRatio,top+colHeight-this.ColMargin.Bottom*pixelRatio);
                top+=colHeight;
            }

            left+=colWidth;
        }
    }

    this.DrawBorder2=function()
    {
        this.Canvas.strokeStyle=this.PenBorder;
        var left=this.X,top=this.Y;
        var right=left+this.WidthCache;

        if (this.TittleBG)  //标题背景
        {
            this.Canvas.fillStyle=this.TittleBG;
            this.Canvas.fillRect(left, top,this.WidthCache,this.TitleHeightCache);
        }

        this.Canvas.beginPath();    //标题
        this.Canvas.moveTo(left,ToFixedPoint(top+this.TitleHeightCache));
        this.Canvas.lineTo(right,ToFixedPoint(top+this.TitleHeightCache));
        top+=this.TitleHeightCache;
        var tableTop=top;

        for(var i in this.RowHeightCache)
        {
            if (i<this.RowHeightCache.length-1)
            {
                var item=this.RowHeightCache[i];
                this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(top+item.Height));
                this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(top+item.Height));
            }
            top+=item.Height;
        }

        left=this.X;
        for(var i in this.HeaderCache)  //标题
        {
            var item=this.HeaderCache[i];
            this.Canvas.moveTo(ToFixedPoint(left+item.Width),ToFixedPoint(tableTop));
            this.Canvas.lineTo(ToFixedPoint(left+item.Width),ToFixedPoint(top));
            left+=item.Width;
        }

        for(var i in this.ColumeCache)
        {
            var item=this.ColumeCache[i];
            if (i<this.ColumeCache.length-1)
            {
                this.Canvas.moveTo(ToFixedPoint(left+item.Width),ToFixedPoint(tableTop));
                this.Canvas.lineTo(ToFixedPoint(left+item.Width),ToFixedPoint(top));
            }
            left+=item.Width;
        }


        //四周边框
        this.Canvas.moveTo(ToFixedPoint(this.X),ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(top));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(top));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(this.Y));

        this.Canvas.stroke();
    }


    this.DrawSelectPoint=function()
    {
        if (!this.IsSelected) return;

        var pointSize=this.SelectedPointSize;
        var left=this.Position.X, top=this.Position.Y;
        var right=left+this.WidthCache, bottom=top+this.HeightCache;
        this.Canvas.fillStyle=this.SelectedColor;
        this.Canvas.fillRect(left,top,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),top,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,top,pointSize,pointSize);

        this.Canvas.fillRect(left,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);

        this.Canvas.fillRect(left,bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,bottom-pointSize,pointSize,pointSize);
    }

    this.IsPointIn=function(pt) // -1=不在上面, 0=表头 
    {
        var left=this.Position.X;
        var top=this.Position.Y;
        var right=left+this.WidthCache;
        var bottom=top+this.TitleHeightCache;

        if (pt.X>left && pt.X<right && pt.Y>top && pt.Y<bottom) return 1;
        
        return -1;
    }
}

function TextNodeChartPaint()
{
    this.newMethod=INodeChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='TextNodeChartPaint';    //类名
    this.TitleMargin={ Left:5, Top:5, Right:5, Bottom:5 };
    this.ContentMargin={ Left:5, Top:5, Right:5, Bottom:5 };
    this.ContentFont=new JSFont();
    this.Data={};
    //this.Data={ Content:内容 }

    //临时变量
    this.X=0;
    this.Y=0;
    this.WidthCache;
    this.HeightCache;
    this.TitleHeightCache;
    
    this.Draw=function()
    {
        this.X=this.Position.X;
        this.Y=this.Position.Y;
        this.PixelRatio=GetDevicePixelRatio();

        if (this.SizeChange) this.CacluateSize();

        this.DrawBorder();
        this.DrawTitle();
        this.DrawContent();

        this.DrawSelectPoint();

        this.SizeChange=false;
    }

    this.CacluateSize=function()
    {
        var pixelRatio=this.PixelRatio;
        this.WidthCache=0;
        this.HeightCache=0
        this.TitleHeightCache=null;

        this.TitleHeightCache=this.TitleFont.GetFontHeight()+(this.TitleMargin.Top+this.TitleMargin.Bottom)*pixelRatio;
        this.Canvas.font=this.TitleFont.GetFont();
        this.WidthCache=this.Canvas.measureText(this.Title).width+(this.TitleMargin.Left+this.TitleMargin.Right)*pixelRatio;
        this.HeightCache+=this.TitleHeightCache;

        if (this.Data && this.Data.Content)
        {
            this.Canvas.font=this.ContentFont.GetFont();
            var contentHeight=this.ContentFont.GetFontHeight()+(this.ContentMargin.Top+this.ContentMargin.Bottom)*pixelRatio;
            this.HeightCache+=contentHeight;
            var contentWidth=this.Canvas.measureText(this.Data.Content).width+(this.ContentMargin.Left+this.ContentMargin.Right)*pixelRatio;
            if (contentWidth>this.WidthCache) this.WidthCache=contentWidth;
        }

        if (this.WidthCache<this.Position.Width) this.Width=this.Position.Width;
    }

    this.DrawTitle=function()
    {
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.font=this.TitleFont.GetFont();

        this.Canvas.fillStyle=this.TitleFont.Color;
        this.Canvas.fillText(this.Title,this.X+this.ToInt(this.WidthCache/2),this.Y+this.ToInt(this.TitleHeightCache/2));

        this.Y+=this.TitleHeightCache;
    }

    this.DrawContent=function()
    {
        if (!this.Data || !this.Data.Content) return;

        var pixelRatio=this.PixelRatio;
        this.Canvas.textAlign='left';
        this.Canvas.textBaseline='bottom';
        this.Canvas.font=this.ContentFont.GetFont();
        this.Canvas.fillStyle=this.ContentFont.Color;

        this.Canvas.fillText(this.Data.Content,this.X+this.ContentMargin.Left*pixelRatio,this.Position.Y+this.HeightCache-this.ContentMargin.Bottom*pixelRatio);
    }

    this.DrawBorder=function()
    {
        this.Canvas.strokeStyle=this.PenBorder;
        var left=this.X,top=this.Y;
        var right=left+this.WidthCache;
        var bottom=top+this.HeightCache;

        if (this.TittleBG)  //标题背景
        {
            this.Canvas.fillStyle=this.TittleBG;
            this.Canvas.fillRect(left, top,this.WidthCache,this.TitleHeightCache);
        }

        this.Canvas.beginPath();    //标题
        this.Canvas.moveTo(left,ToFixedPoint(top+this.TitleHeightCache));
        this.Canvas.lineTo(right,ToFixedPoint(top+this.TitleHeightCache));
        top+=this.TitleHeightCache;
        var tableTop=top;

        //四周边框
        this.Canvas.moveTo(ToFixedPoint(this.X),ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(bottom));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(bottom));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(this.Y));

        this.Canvas.stroke();
    }

    this.IsPointIn=function(pt) // -1=不在上面, 0=表头 
    {
        var left=this.Position.X;
        var top=this.Position.Y;
        var right=left+this.WidthCache;
        var bottom=top+this.TitleHeightCache;

        if (pt.X>left && pt.X<right && pt.Y>top && pt.Y<bottom) return 1;
        
        return -1;
    }

    this.DrawSelectPoint=function()
    {
        if (!this.IsSelected) return;

        var pointSize=this.SelectedPointSize;
        var left=this.Position.X, top=this.Position.Y;
        var right=left+this.WidthCache, bottom=top+this.HeightCache;
        this.Canvas.fillStyle=this.SelectedColor;
        this.Canvas.fillRect(left,top,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),top,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,top,pointSize,pointSize);

        this.Canvas.fillRect(left,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);

        this.Canvas.fillRect(left,bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,bottom-pointSize,pointSize,pointSize);
    }
}

function NodeLinesPaint()   //节点间连线
{
    this.ClassName='NodeLinesPaint'; 
    this.Data=[];   //[{ Start:, End: , Type:}
    this.Nodes=new Map();   //key:id value:node 方便查找使用map
    this.Canvas;                            //画布
    this.SetNodes=function(nodes)
    {
        this.Nodes.clear();
        for(var i in nodes)
        {
            var item=nodes[i];
            this.Nodes.set(item.ID,item);
        }
    }

    this.Draw=function()
    {
        for(var i in this.Data)
        {
            var item=this.Data[i];
            var startNode=this.Nodes.get(item.Start);
            var endNode=this.Nodes.get(item.End);
            if (!startNode || !endNode) continue;
            var startChart=startNode.ChartPaint[0];
            var endChart=endNode.ChartPaint[0];

            var line=this.GetLineDirection(startChart,endChart);

            this.Canvas.strokeStyle=this.PenBorder;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(line.Start.X),ToFixedPoint(line.Start.Y));
            this.Canvas.lineTo(ToFixedPoint(line.End.X), ToFixedPoint(line.End.Y));
            this.Canvas.stroke();
        }
    }

    this.GetLineDirection=function(start,end)   //获取2个图新的线段位置 1-8 随时针8个方位
    {
        //图形中心点
        var left=start.Position.X;
        var top=start.Position.Y;
        var width=start.WidthCache;
        var height=start.HeightCache;
        var p1={ X: left+width/2, Y: top+height/2 };    //中心点

        left2=end.Position.X;
        top2=end.Position.Y;
        width2=end.WidthCache;
        height2=end.HeightCache;
        var p2={ X: left2+width2/2, Y: top2+height2/2 };    //中心点

        var angle = this.GetAngle(p1,p2);               //角度
        var angle2=this.GetAngle(p2,p1); 

        console.log('[NodeLinesPaint::GetLineDirection] p1, p2, angle', p1, p2, angle,angle2);

        var linePt;
        if (angle>325 || angle<=35 ) linePt={X:left+width/2, Y:top};
        else if (angle>35 && angle<=55) linePt={X:left+width, Y:top};
        else if (angle>55 && angle<=125) linePt={X:left+width, Y:top+height/2};
        else if (angle>125 && angle<=145) linePt={X:left+width, Y:top+height};
        else if (angle>145 && angle<=215) linePt={X:left+width/2, Y:top+height};
        else if (angle>215 && angle<=235) linePt={X:left, Y:top+height};
        else if (angle>235 && angle<=305) linePt={X:left, Y:top+height/2};
        else if (angle>305 && angle<=325) linePt={X:left, Y:top};

        var linePt2;
        if (angle2>325 || angle2<=35 ) linePt2={X:left2+width2/2, Y:top2};
        else if (angle2>35 && angle2<=55) linePt2={X:left2+width2, Y:top2};
        else if (angle2>55 && angle2<=125) linePt2={X:left2+width2, Y:top2+height2/2};
        else if (angle2>125 && angle2<=145) linePt2={X:left2+width2, Y:top2+height2};
        else if (angle2>145 && angle2<=215) linePt2={X:left2+width2/2, Y:top2+height2};
        else if (angle2>215 && angle2<=235) linePt2={X:left2, Y:top2+height2};
        else if (angle2>235 && angle2<=305) linePt2={X:left2, Y:top2+height2/2};
        else if (angle2>305 && angle2<=325) linePt2={X:left2, Y:top2};

        console.log('[NodeLinesPaint::GetLineDirection] linePt linePt2 ', linePt,linePt2);
        return {Start:linePt, End:linePt2};
    }

    this.GetAngle=function(p1, p2)
    {
        var x = Math.abs(p1.X-p2.X);
        var y = Math.abs(p1.Y-p2.Y);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

        if(p2.X>p1.X && p2.Y>p1.Y) angle = 180 - angle;         //第2个点在第四象限
        if(p2.X==p1.X && p2.Y>p1.Y) angle = 180;                //第2个点在y轴负方向上
        if(p2.X>p1.X && p2.Y==p1.Y) angle = 90;                 //第2个点在x轴正方向上
        if(p2.X<p1.X && p2.Y>p1.Y) angle = 180+angle;           //第2个点在第三象限
        if(p2.X<p1.X&&p2.Y==p1.Y) angle = 270;                  //第2个点在x轴负方向
        if(p2.X<p1.X&&p2.Y<p1.Y) angle = 360 - angle;           //第2个点在第二象限
        
        return angle;
    }
}


function JSMind(divElement)
{
    this.DivElement=divElement;
    this.JSMindContainer;              //画图控件

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsmind-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if(!divElement.hasChildNodes("canvas")) { divElement.appendChild(this.CanvasElement); }

    this.OnSize=function()
    {
        //画布大小通过div获取
        var height=parseInt(this.DivElement.style.height.replace("px",""));

        this.CanvasElement.height=height;
        this.CanvasElement.width=parseInt(this.DivElement.style.width.replace("px",""));
        this.CanvasElement.style.width=this.CanvasElement.width+'px';
        this.CanvasElement.style.height=this.CanvasElement.height+'px';

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.CanvasElement.height*=pixelTatio;
        this.CanvasElement.width*=pixelTatio;

        console.log(`[JSMind::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSMindContainer && this.JSMindContainer.Frame)
            this.JSMindContainer.Frame.SetSizeChange(true);

        if (this.JSMindContainer) this.JSMindContainer.Draw();
    }

    this.SetOption=function(option)
    {
        var chart=new JSMindContainer(this.CanvasElement);
        chart.Create({});
        if (option.NodeTree) chart.LoadNodeData(option.NodeTree);

        if (option.Symbol) chart.Symbol=option.Symbol;

        chart.ExecuteAllScript();

        this.JSMindContainer=chart;
        this.DivElement.JSMind=this;   //div中保存一份
        this.JSMindContainer.Draw();
    }

    this.AddTextNode=function(obj)
    {
        if (this.JSMindContainer && typeof(this.JSMindContainer.AddTextNode)=='function')
            this.JSMindContainer.AddTextNode(obj);
    }

    this.AddTableNode=function(obj)
    {
        if (this.JSMindContainer && typeof(this.JSMindContainer.AddTableNode)=='function')
            this.JSMindContainer.AddTableNode(obj);
    }
}


//初始化
JSMind.Init=function(divElement)
{
    var jsChartControl=new JSMind(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//边框信息
function NodeChartBorder()
{
    //四周间距
    this.Left=50;
    this.Right=80;
    this.Top=0;
    this.Bottom=50;
    this.TitleHeight=24;    //标题高度
    this.TopSpace=0;
    this.BottomSpace=0;

    this.X=10;
    this.Y=10;
    this.Width=500;
    this.Height=400;

    this.GetChartWidth=function()
    {
        return this.Width;
    }

    this.GetChartHeight=function()
    {
        return this.Height;
    }

    this.GetLeft=function()
    {
        return this.X+this.Left;
    }

    this.GetRight=function()
    {
        return this.X+this.Width-this.Right;
    }

    this.GetTop=function()
    {
        return this.Y+this.Top;
    }

    this.GetTopEx=function()    //去掉标题，上面间距
    {
        return this.Y+this.Top+this.TitleHeight+this.TopSpace;
    }

    this.GetTopTitle=function() //去掉标题
    {
        return this.Y+this.Top+this.TitleHeight;
    }

    this.GetBottom=function()
    {
        return this.Y+this.Height-this.Bottom;
    }

    this.GetBottomEx=function()
    {
        return this.Y+this.Height-this.Bottom-this.BottomSpace;
    }

    this.GetWidth=function()
    {
        return this.Width-this.Left-this.Right;
    }

    this.GetHeight=function()
    {
        return this.Height-this.Top-this.Bottom;
    }

    this.GetHeightEx=function() //去掉标题的高度, 上下间距
    {
        return this.Height-this.Top-this.Bottom-this.TitleHeight-this.TopSpace-this.BottomSpace;
    }

    this.GetRightEx=function()  //横屏去掉标题高度的 上面间距
    {
        return this.UIElement.width-this.Right-this.TitleHeight- this.TopSpace;
    }

    this.GetWidthEx=function()  //横屏去掉标题宽度 上下间距
    {
        return this.UIElement.width-this.Left-this.Right-this.TitleHeight- this.TopSpace - this.BottomSpace;
    }

    this.GetLeftEx = function () //横屏
    {
        return this.Left+this.BottomSpace;
    }

    this.GetRightTitle = function ()//横屏
    {
        return this.UIElement.width - this.Right - this.TitleHeight;
    }

    this.GetTitleHeight=function()
    {
        return this.TitleHeight;
    }
}

//K线节点
function KLineNodeChartPaint(canvasElement)
{
    this.newMethod=INodeChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='KLineNodeChartPaint';    //类名
    this.TitleMargin={ Left:5, Top:5, Right:5, Bottom:5 };

    this.Period=0;                      //周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
    this.Right=0;                       //复权 0 不复权 1 前复权 2 后复权
    this.SourceData;                    //原始的历史数据
    this.MaxReqeustDataCount=3000;      //数据个数
    this.MaxRequestMinuteDayCount=5;    //分钟数据请求的天数
    this.PageSize=200;                  //每页数据个数
   

    this.Frame;                              //框架画法
    this.ChartPaint=[];                      //图形画法
    this.WindowIndex=[];
    this.TitlePaint=[];                    //标题画法
    this.KLineApiUrl=g_JSChartResource.Domain+"/API/KLine2";                        //历史K线api地址
    this.MinuteKLineApiUrl=g_JSChartResource.Domain+'/API/KLine3';                  //历史分钟数据
    this.CursorIndex=0;             //十字光标X轴索引
    this.LastPoint=new Point();     //鼠标位置

    this.FrameSplitData=new Map();
    this.FrameSplitData.set("double",new SplitData());
    this.FrameSplitData.set("price",new PriceSplitData());

    this.WidthCache;
    this.HeightCache;

    this.Draw=function()
    {
        if (this.X!=this.Position.X || this.Y!=this.Position.Y || !this.WidthCache!=this.Position.Width || this.HeightCache!=this.Position.Height)
        {
            this.CacluateTitleSize();

            this.X=this.Position.X;
            this.Y=this.Position.Y;
            this.WidthCache=this.Position.Width;
            this.HeightCache=this.Position.Height;

            this.Frame.ChartBorder.X=this.X;
            this.Frame.ChartBorder.Y=this.Y+this.TitleHeightCache;
            this.Frame.ChartBorder.Width=this.WidthCache;
            this.Frame.ChartBorder.Height=this.HeightCache-this.TitleHeightCache;

            this.Frame.SetSizeChage(true);
        }
        
        this.PixelRatio=GetDevicePixelRatio();

        this.DrawBorder();
        this.DrawTitle();

        this.Canvas.save();
        this.Canvas.lineWidth=this.PixelRatio;       //手机端需要根据分辨率比调整线段宽度

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)
        {
            this.Frame.Draw();
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

        if (this.Frame.DrawOveraly)
            this.Frame.DrawOveraly();   //画叠加指标

        //固定扩展图形
        for(var i in this.ExtendChartPaint)
        {
            var item=this.ExtendChartPaint[i];
            if (!item.IsDynamic && item.IsAnimation==false) item.Draw();
        }

        if (this.Frame.DrawInsideHorizontal) this.Frame.DrawInsideHorizontal();
        this.Frame.DrawLock();
        this.Frame.Snapshot();

        this.Canvas.restore();

        this.DrawSelectPoint();

        this.SizeChange=false;
    }

    this.CacluateTitleSize=function()
    {
        var pixelRatio=this.PixelRatio;
        this.TitleHeightCache=null;

        this.TitleHeightCache=this.TitleFont.GetFontHeight()+(this.TitleMargin.Top+this.TitleMargin.Bottom)*pixelRatio;
        this.Canvas.font=this.TitleFont.GetFont();
        this.TitleWidthCache=this.Canvas.measureText(this.Title).width+(this.TitleMargin.Left+this.TitleMargin.Right)*pixelRatio;
    }

    this.DrawTitle=function()
    {
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.font=this.TitleFont.GetFont();

        this.Canvas.fillStyle=this.TitleFont.Color;
        this.Canvas.fillText(this.Title,this.X+this.ToInt(this.WidthCache/2),this.Y+this.ToInt(this.TitleHeightCache/2));
    }

    this.DrawBorder=function()
    {
        this.Canvas.strokeStyle=this.PenBorder;
        var left=this.X,top=this.Y;
        var right=left+this.WidthCache;
        var bottom=top+this.HeightCache;

        if (this.TittleBG)  //标题背景
        {
            this.Canvas.fillStyle=this.TittleBG;
            this.Canvas.fillRect(left, top,this.WidthCache,this.TitleHeightCache);
        }

        this.Canvas.beginPath();    //标题
        this.Canvas.moveTo(left,ToFixedPoint(top+this.TitleHeightCache));
        this.Canvas.lineTo(right,ToFixedPoint(top+this.TitleHeightCache));
        top+=this.TitleHeightCache;
        var tableTop=top;

        //四周边框
        this.Canvas.moveTo(ToFixedPoint(this.X),ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(this.Y));
        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(bottom));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(bottom));
        this.Canvas.lineTo(ToFixedPoint(this.X), ToFixedPoint(this.Y));

        this.Canvas.stroke();
    }

    this.DrawSelectPoint=function()
    {
        if (!this.IsSelected) return;

        var pointSize=this.SelectedPointSize;
        var left=this.Position.X, top=this.Position.Y;
        var right=left+this.WidthCache, bottom=top+this.HeightCache;
        this.Canvas.fillStyle=this.SelectedColor;
        this.Canvas.fillRect(left,top,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),top,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,top,pointSize,pointSize);

        this.Canvas.fillRect(left,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,this.ToInt(top+this.HeightCache/2),pointSize,pointSize);

        this.Canvas.fillRect(left,bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(this.ToInt(left+(this.WidthCache/2)),bottom-pointSize,pointSize,pointSize);
        this.Canvas.fillRect(right-pointSize,bottom-pointSize,pointSize,pointSize);
    }

    this.IsPointIn=function(pt) // -1=不在上面, 0=表头 
    {
        var left=this.Position.X;
        var top=this.Position.Y;
        var right=left+this.WidthCache;
        var bottom=top+this.TitleHeightCache;

        if (pt.X>left && pt.X<right && pt.Y>top && pt.Y<bottom) return 1;
        
        return -1;
    }

    this.SetOption=function(option)
    {
        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.Right>=0) this.Right=option.KLine.Right;
            if (option.KLine.Period>=0) this.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) this.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            //if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.MaxRequestMinuteDayCount>0) this.MaxRequestMinuteDayCount=option.KLine.MaxRequestMinuteDayCount;
            if (option.KLine.DrawType) this.KLineDrawType=option.KLine.DrawType;
            if (option.KLine.FirstShowDate>20000101) this.CustomShow={ Date:option.KLine.FirstShowDate };
        }

        if (!option.Windows || option.Windows.length<=0) return null;
        this.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) this.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) this.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) this.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) this.Frame.ChartBorder.Bottom=option.Border.Bottom;
        }

        if (option.KLine)
        {
            if (option.KLine.PageSize > 0)  //一屏显示的数据个数
            {
                this.PageSize = option.KLine.PageSize;
            }
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (!this.Frame.SubFrame[i]) continue;
                if (item.SplitCount) this.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) this.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
                if (!isNaN(item.Height)) this.Frame.SubFrame[i].Height = item.Height;
                if (item.IsShowLeftText===false || item.IsShowLeftText===true) 
                {
                    this.Frame.SubFrame[i].Frame.IsShowYText[0]=item.IsShowLeftText;
                    this.Frame.SubFrame[i].Frame.YSplitOperator.IsShowLeftText=item.IsShowLeftText;            //显示左边刻度
                }
                if (item.IsShowRightText===false || item.IsShowRightText===true) 
                {
                    this.Frame.SubFrame[i].Frame.IsShowYText[1]=item.IsShowRightText;
                    this.Frame.SubFrame[i].Frame.YSplitOperator.IsShowRightText=item.IsShowRightText;         //显示右边刻度
                }
            }
        }

        let scriptData = new JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script)
            {
                this.WindowIndex[i]=new ScriptIndex(item.Name,item.Script,item.Args,item);    //脚本执行
            }
            else
            {
                let indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    this.WindowIndex[i]=indexItem.Create();
                    this.CreateWindowIndex(i);
                }
                else
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock=item.Lock;
                    indexInfo.ID=item.Index;
                    this.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args,indexInfo);    //脚本执行
                }

            }

            if (item.Modify!=null) this.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null) this.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;
            if (item.Close!=null) this.Frame.SubFrame[i].Frame.CloseIndex=item.Close;
            if (item.Overlay!=null) this.Frame.SubFrame[i].Frame.OverlayIndex=item.Overlay;

            if (!isNaN(item.TitleHeight)) this.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }
    }

    //创建指标窗口 windowCount 窗口个数
    this.Create=function(windowCount)
    {
        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame=new HQTradeFrame();
        this.Frame.CalculateChartBorder=this.Frame.CalculateChartBorder2;
        this.Frame.ChartBorder=new NodeChartBorder();
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=1;
        this.Frame.ChartBorder.Right=1;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
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
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new NodeChartBorder();

            var frame=new KLineFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            frame.Identify=i;                   //窗口序号

            frame.HorizontalMax=20;
            frame.HorizontalMin=10;

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
                frame.YSplitOperator.SplitCount=3;
                var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
                border.BottomSpace=12*pixelTatio;  //主图上下留空间
                border.TopSpace=12*pixelTatio;
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
                frame.YSplitOperator.SplitCount=2;
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

        this.ChartPaint[0]=kline;
        this.TitlePaint[0]=new DynamicKLineTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;
        this.TitlePaint[0].OverlayChartPaint=this.OverlayChartPaint;    //绑定叠加

        /*
        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        paint.DrawType=this.KLineDrawType;
        this.OverlayChartPaint[0]=paint;
        */
    }

    //绑定主图K线数据
    this.BindMainData=function(hisData,showCount)
    {
        this.ChartPaint[0].Data=hisData;
        this.ChartPaint[0].Symbol=this.Symbol;
        for(var i in this.Frame.SubFrame)
        {
            var item =this.Frame.SubFrame[i].Frame;
            item.XPointCount=showCount;
            item.Data=this.ChartPaint[0].Data;
        }

        //this.TitlePaint[0].Data=this.ChartPaint[0].Data;                    //动态标题
        //this.TitlePaint[0].Symbol=this.Symbol;
        //this.TitlePaint[0].Name=this.Name;

        //this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        //this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount;
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        //this.ChartCorssCursor.StringFormatY.Symbol=this.Symbol;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=hisData.Data.length-1-dataOffset;
        if (this.CursorIndex<0) this.CursorIndex=0; //不一定对啊

        if (this.CustomShow) //定制显示 1次有效
        {
            this.SetCustomShow(this.CustomShow,hisData);
            this.CustomShow=null;
        }
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

    //切换股票代码
    this.ChangeSymbol=function(symbol)
    {
        this.Symbol=symbol;
        if (IsIndexSymbol(symbol)) this.Right=0;    //指数没有复权

        //清空指标
        if (this.Frame && this.Frame.SubFrame)
        {
            for(var i=0;i<this.Frame.SubFrame.length;++i)
            {
                this.DeleteIndexPaint(i);
            }
        }

        if (this.Period<=3)
        {
            this.RequestHistoryData();                  //请求日线数据
            //this.ReqeustKLineInfoData();
        }
        else 
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }  
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
        
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=null;    //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.IsLocked=false;          //解除上锁
        this.Frame.SubFrame[windowIndex].Frame.YSplitScale = null;      //清空固定刻度

        this.ChartPaint=paint;

        //清空东条标题
        //var titleIndex=windowIndex+1;
        //this.TitlePaint[titleIndex].Data=[];
        //this.TitlePaint[titleIndex].Title=null;
    }

    this.RequestHistoryData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.FlowCapitalReady=false;
        this.Draw();
        $.ajax({
            url: this.KLineApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol"],
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
                self.RecvHistoryData(data);
                //self.AutoUpdate();
            }
        });
    }

    this.RecvHistoryData=function(data)
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
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);
        //this.BindInstructionIndexData(bindData);    //执行指示脚本

        var firstSubFrame;
        for(var i=0; i<this.Frame.SubFrame.length; ++i) //执行指标
        {
            if (i==0) firstSubFrame=this.Frame.SubFrame[i].Frame;
            this.BindIndexData(i,bindData);
        }

        if (firstSubFrame && firstSubFrame.YSplitOperator)
        {
            firstSubFrame.YSplitOperator.Symbol=this.Symbol;
            firstSubFrame.YSplitOperator.Data=this.ChartPaint[0].Data;         //K线数据
        }
        
        //this.RequestFlowCapitalData();      //请求流通股本数据 (主数据下载完再下载)
        //this.RequestOverlayHistoryData();   //请求叠加数据 (主数据下载完再下载)

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
        this.UpdatePointByCursorIndex();   //更新十字光标位子

        /*
        //叠加指标
        for(var i=0;i<this.Frame.SubFrame.length;++i)
        {
            var item=this.Frame.SubFrame[i];
            for(var j in item.OverlayIndex)
            {
                var overlayItem=item.OverlayIndex[j];
                this.BindOverlayIndexData(overlayItem,i,bindData)
            }
        }
        */
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

        //叠加指标当前显示的数据偏移
        for (var i in this.Frame.SubFrame)
        {
            var subFrame=this.Frame.SubFrame[i];
            for(var j in subFrame.OverlayIndex)
            {
                var overlayItem=subFrame.OverlayIndex[j];
                for(var k in overlayItem.ChartPaint)
                {
                    var item=overlayItem.ChartPaint[k];
                    if (!item.Data) continue;
                    item.Data.DataOffset=data.DataOffset;
                }
            }
        }

    }

    this.UpdateFrameMaxMin=function()
    {
        var frameMaxMinData=new Array();

        var chartPaint=new Array();

        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (item.IsShow==false) continue;   //隐藏的图形不计算
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

        //更新子坐标
        for(var i in this.Frame.SubFrame)
        {
            var subFrame=this.Frame.SubFrame[i];
            for(var j in subFrame.OverlayIndex)
            {
                var overlayItem=subFrame.OverlayIndex[j];
                overlayItem.UpdateFrameMaxMin();
            }
        }
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

    //显示隐藏主图K线
    this.ShowKLine=function(isShow)
    {
        if (this.ChartPaint.length<=0 || !this.ChartPaint[0]) return;
        this.ChartPaint[0].IsShow=isShow;
    }

}