/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   股票列表 (H5版本)
*/

//单元个类型
var CELL_TYPE_ID=
{
    CELL_NONE_ID:0,
    CELL_INTEGER_ID:1,      //整型
    CELL_STRING_ID:2,
    CELL_STOCK_NAME_ID:3,   //股票名称
    CELL_STOCK_CODE_ID:4,   //股票代码
    CELL_STOCK_PRICE_ID:5,  //价格字段
    CELL_PERCENTAGE_ID:6,   //百分比
    CELL_BIG_NUMBER_ID:7,   //大数值数据
    CELL_DOUBLE_ID:8,       //浮点型
}

//表头单元类型
var HEAD_CELL_TYPE_ID=
{
    CELL_STRING_ID:2,   //字符串
    CELL_SELECT_ID:5    //下拉选择框
};


//行数据
function JsCellItem()
{
    this.Type=CELL_TYPE_ID.CELL_STRING_ID;   //0=数值 1=字符串
    this.Value=null;         //原始数值
    this.Text='';           //显示文本
    this.CSS;               //对应css样式的名字
    this.Element;           //td
    this.UpdateStatus={ Value:false, CSS:false };   //是否需要更新
    this.Index;

    this.Build=function(index, trElement)
    {
        this.Index=index;
        if (index<trElement.cells.length)
        {
            if (this.Element!=trElement.cells[index])
            {
                this.Element=trElement.cells[index];
                this.UpdateStatus={ Value:true, CSS:true }; 
            }
        }
        else 
        {
            this.Element=trElement.insertCell(index);
            this.UpdateStatus={ Value:true, CSS:true }; 
        }
        
        this.Update();
    }

    this.Update=function()
    {
        if (!this.Element) return;

        if (this.UpdateStatus.Value==true) this.Element.innerHTML=this.Text;
        if (this.UpdateStatus.CSS==true) this.Element.className=this.CSS;

        this.UpdateStatus.Value=false;
        this.UpdateStatus.CSS=false;
    }


    this.SetValue=function(value, option)   //option: { Type:单元个类型}
    {
        if (!option || !option.Type) this.SetStringValue(value.toString());

        switch(option.Type)
        {
            case CELL_TYPE_ID.CELL_STOCK_NAME_ID:
            case CELL_TYPE_ID.CELL_STOCK_CODE_ID:
                this.SetStringValue(value,option);
                break;
            case CELL_TYPE_ID.CELL_STOCK_PRICE_ID:
                this.SetPriceValue(value,option);
                break;
            case CELL_TYPE_ID.CELL_PERCENTAGE_ID:
                this.SetPercentageValue(value,option);
                break;
            case CELL_TYPE_ID.CELL_BIG_NUMBER_ID:
                this.SetBigNumberValue(value,option);
                break;
            case CELL_TYPE_ID.CELL_NONE_ID:
                this.SetNoneValue(value,option);
                break;
            case CELL_TYPE_ID.CELL_DOUBLE_ID:
                this.SetDoubleValue(value,option)
                break;
            case CELL_TYPE_ID.CELL_INTEGER_ID:
                this.SetIntegerValue(value,option);
                break;
        }
    }

    this.ChangeType=function(option)
    {
        if (!opton) return;

        var value=this.Value;   //先读取值
        this.SetValue(value,option);
    }

    this.SetPercentageValue=function(value, option)
    {
        this.Value=value;
        if (JSTableHelper.IsNumber(value)) this.SetText(value.toFixed(option.Dec)+'%');
        else this.SetText(option.NullText);

        if (value>option.CompareValue) this.SetCSS(option.CSS[0]);
        else if (value<option.CompareValue) this.SetCSS(option.CSS[1]);
        else  this.SetCSS(option.CSS[2]);
    }

    this.SetPriceValue=function(value, option)
    {
        if (value==this.Value) return;

        this.Value=value;
        if (!JSTableHelper.IsNumber(value)) this.SetText(option.NullText);
        else this.SetText(value.toFixed(option.Dec));

        if (value>option.CompareValue) this.SetCSS(option.CSS[0]);
        else if (value<option.CompareValue) this.SetCSS(option.CSS[1]);
        else  this.SetCSS(option.CSS[2]);
    }

    this.SetBigNumberValue=function(value, option)
    {
        this.Value=value;
        this.SetText(JSTableHelper.FormatValueString(value,option.Dec[0],option.Dec[1]));
        this.UpdateStatus.Value=true;

        this.SetOption(option);
    }

    this.SetDoubleValue=function(value, option)
    {
        this.Type=CELL_TYPE_ID.CELL_DOUBLE_ID;
        this.Value=value;
        if (JSTableHelper.IsNumber(value)) this.SetText(value.toFixed(opton.Dec)); //TO:格式化类
        else this.SetText(option.NullText);
        this.UpdateStatus.Value=true;

        this.SetOption(option);
    }

    this.SetIntegerValue=function(value,option)
    {
        this.Type=CELL_TYPE_ID.CELL_INTEGER_ID;
        this.Value=value;
        if (JSTableHelper.IsNumber(value)) this.SetText(parseInt(value).toString()); //TO:格式化类
        else this.SetText(option.NullText);

        this.SetOption(option);
    }

    this.SetNoneValue=function(value,option)
    {
        this.Type=CELL_TYPE_ID.CELL_NONE_ID;
        this.Value=value;
        this.SetText(opton.NullText);

        this.SetOption(option);
    }

    this.SetStringValue=function(value, option)
    {
        this.Type=CELL_TYPE_ID.CELL_STRING_ID;
        this.Value=value;
        this.SetText(value);

        this.SetOption(option);
    }


    this.SetCSS=function(css)
    {
        if (!css) return;

        if (css!=this.CSS)
        {
            this.CSS=css;
            this.UpdateStatus.CSS=true;
        }
    }

    this.SetType=function(type)
    {
        if (JSTableHelper.IsNumber(type)) this.Type=type;
    }

    this.SetText=function(text)
    {
        if (this.Text!=text)
        {
            this.Text=text;
            this.UpdateStatus.Value=true;
        }
    }

    this.SetOption=function(option)
    {
        if (!option) return;

        this.SetCSS(option.CSS);
        this.SetType(option.Type);
    }
}

JsCellItem.GetCellRule=function(type)
{
    const CELL_RULE_MAP=new Map
    ([
        [CELL_TYPE_ID.CELL_STOCK_NAME_ID, {Type:CELL_TYPE_ID.CELL_STOCK_NAME_ID, CSS:'jscell-stock-name'} ],
        [CELL_TYPE_ID.CELL_STOCK_CODE_ID, {Type:CELL_TYPE_ID.CELL_STOCK_CODE_ID, CSS:'jscell-stock-code'} ],
        [CELL_TYPE_ID.CELL_NONE_ID, {Type:CELL_TYPE_ID.CELL_NONE_ID, CSS:'jscell-none', NullText:''}],

        [CELL_TYPE_ID.CELL_PERCENTAGE_ID, 
            {
                Type:CELL_TYPE_ID.CELL_PERCENTAGE_ID, 
                CSS:["jscell-value-up","jscell-value-down","jscell-value-unchanged"], 
                CompareValue:0,     //对比值
                Dec:2,   //小数位数
                NullText:'--'
            }
        ],

        [CELL_TYPE_ID.CELL_STOCK_PRICE_ID, 
            {
                Type:CELL_TYPE_ID.CELL_PERCENTAGE_ID, 
                CSS:["jscell-value-up","jscell-value-down","jscell-value-unchanged"], 
                CompareValue:0,     //填前收盘价
                Dec:2,   //小数位数,
                NullText:'--'
            }
        ],

        [CELL_TYPE_ID.CELL_BIG_NUMBER_ID, { Type:CELL_TYPE_ID.CELL_BIG_NUMBER_ID, CSS:'jscell-big-number', Dec:[2,2] }],
        [CELL_TYPE_ID.CELL_INTEGER_ID, { Type:CELL_TYPE_ID.CELL_INTEGER_ID, CSS:'jscell-number', NullText:'--' }],
        [CELL_TYPE_ID.CELL_DOUBLE_ID, { Type:CELL_TYPE_ID.CELL_DOUBLE_ID, CSS:'jscell-number', NullText:'--' }]
    ]);

    if (CELL_RULE_MAP.has(type)) return CELL_RULE_MAP.get(type);

    return null;
}

function JsRowItem()
{
    this.Cells=[];
    this.Index;
    this.Element;       //tr
    this.Key;           //主键 修改使用

    this.SetCell=function(index, value, option)
    {
        var cell=new JsCellItem();
        cell.SetValue(value, option);
        this.Cells[index]=cell;
        return cell;
    }

    this.InsertCell=function(index, value, option)
    {
        var cell=new JsCellItem();
        cell.SetValue(value, option);
        this.Cells.splice(index,0,cell);
        return cell;
    }

    this.RemoveCell=function(index)
    {
        var cell=this.Cells.splice(index,1);
        return cell;
    }

    this.Build=function(index, bodyElement)
    {
        this.Index=index;
        if (index<bodyElement.rows.length)
            this.Element=bodyElement.rows[index];
        else 
            this.Element=bodyElement.insertRow(index);
        
        for(var i in this.Cells)
        {
            var cellItem=this.Cells[i];
            cellItem.Build(i, this.Element);
        }

        var cellCount=this.Cells.length;
        while(cellCount<this.Element.cells.length)
        {
            this.Element.deleteCell(-1);
        }
    }

    this.Update=function()
    {
        if (!this.Element) return;

        for(var i in this.Cells)
        {
            var cellItem=this.Cells[i];
            cellItem.Update();
        }
    }
}

function JsHeadCellItem()
{
    this.CSS;               //对应css样式的名字
    this.Element; 
    this.Text; 
    this.Index;
    this.Text;
    this.RowSpan;
    this.ColSpan;
    this.UpdateStatus={ Value:false, CSS:false, RowSpan:false, ColSpan:false };   //是否需要更新
    this.CreateElement; //自定义创建元素
    this.Identfiy=JSTableHelper.CreateGuid();

    this.Children=[];
    
    this.Build=function(index, trElement)
    {
        this.Index=index;
        if (index<trElement.cells.length)
            this.Element=trElement.cells[index];
        else 
            this.Element=trElement.insertCell(index);

        this.Update();
    }

    this.Update=function()
    {
        if (!this.Element) return;

        if (this.CreateElement)
        {
            this.CreateElement(this, this.ID);
            return;
        }

        if (this.UpdateStatus.Value==true) this.Element.innerHTML=this.Text;
        if (this.UpdateStatus.CSS==true) this.Element.className=this.CSS;
        if (this.UpdateStatus.RowSpan==true) this.Element.rowSpan=this.RowSpan;
        if (this.UpdateStatus.ColSpan==true) this.Element.colSpan=this.ColSpan;

        this.UpdateStatus.Value=false;
        this.UpdateStatus.CSS=false;
        this.UpdateStatus.RowSpan=false;
        this.UpdateStatus.ColSpan=false;
    }

    this.SetText=function(text,option)
    {
        if (text!=this.Text)
        {
            this.Text=text;
            this.UpdateStatus.Value=true;
        }

        if (option)
        {
            if (option.CSS)
            {
                if (this.CSS!=option.CSS)
                {
                    this.CSS=option.CSS;
                    this.UpdateStatus.CSS=true;
                }
            }

            if (option.RowSpan && option.RowSpan!=this.RowSpan) 
            {
                this.RowSpan=option.RowSpan;
                this.UpdateStatus.RowSpan=true;
            }

            if (option.ColSpan && option.ColSpan!=this.ColSpan) 
            {
                this.ColSpan=option.ColSpan;
                this.UpdateStatus.ColSpan=true;
            }

            if (option.ID) this.Identfiy=option.ID;
            if (option.CreateElement) this.CreateElement=option.CreateElement;
        }
    }
}

JsHeadCellItem.GetCellRule=function(type)
{
    const CELL_RULE_MAP=new Map
    ([
        [HEAD_CELL_TYPE_ID.CELL_STRING_ID, {Type:HEAD_CELL_TYPE_ID.CELL_STRING_ID, CSS:'jshcell-string'} ]
    ]);

    if (CELL_RULE_MAP.has(type)) return CELL_RULE_MAP.get(type);

    return null;
}

function JsHeadRowItem()
{
    this.CSS;               //对应css样式的名字
    this.Element;           //<tr>
    this.Index;
    this.Cells=[];
    
    this.Build=function(index,headElement)
    {
        this.Index=index;
        if (index<headElement.rows.length)
            this.Element=headElement.rows[index];
        else 
            this.Element=headElement.insertRow(index);

        for(var i in this.Cells)
        {
            var item=this.Cells[i];
            item.Build(i, this.Element);
        }
    }

    this.InsertCell=function(index, text, option)
    {
        var cell=new JsHeadCellItem();
        cell.SetText(text, option);
        this.Cells.splice(index,0,cell);
        return cell;
    } 
}

function JsTableHead()
{
    this.Element;   //<thead>
    this.Rows=[];   // JsHeadRowItem

    this.Build=function()
    {
        for(var i in this.Rows)
        {
            var rowItem=this.Rows[i];
            rowItem.Build(i,this.Element);
        }
    }

    this.InsertRow=function(index)
    {
        var row=new JsHeadRowItem();
        this.Rows[index]=row;

        return row;
    }

    this.RowCount=function()
    {
        return this.Rows.length;
    }

    this.GetRow=function(rowIndex, rowColunm)   //获取表头单元格数据
    {
        return this.Rows[rowIndex].Cells[rowColunm];
    }
}

function JSTable(divElement,option)
{
    this.DivElement=divElement;
    this.Rows=[];   //行
    this.Head=new JsTableHead();

    this.TableElement=document.createElement("table");
    if (option && option.CSS) this.TableElement.className=option.CSS;
    else this.TableElement.className='jstable jstable-metrics jstable-bordered ';
    this.TableElement.id=JSTableHelper.CreateGuid();
    divElement.appendChild(this.TableElement);

    //表头
    this.Head.Element=document.createElement("thead");
    this.TableElement.appendChild(this.Head.Element);

    //标题
    this.BodyElement=document.createElement("tbody");
    this.TableElement.appendChild(this.BodyElement);

    //更新数据及行列
    this.Build=function()
    {
        this.Head.Build();

        for(var i in this.Rows)
        {
            var rowItem=this.Rows[i];
            rowItem.Build(i,this.BodyElement);
        }

        //删除多余的行
        var rowCount=this.Rows.length;
        while(rowCount<this.BodyElement.rows.length)
        {
            this.BodyElement.deleteRow(-1);
        }
    }

    //更新数据 行列不发生变化调用
    this.Update=function()  
    {
        for(var i in this.Rows)
        {
            var rowItem=this.Rows[i];
            rowItem.Update();
        }
    }

    this.InsertRow=function(index, row)
    {
        this.Rows.splice(index, 0, row);
        return row;
    }

    this.RemoveRow=function(index)  //删除行
    {
        var row=this.Rows.splice(index, 1);
        return row;
    }

    this.RemoveColumn=function(index)   //删除列
    {
        for(var i in this.Rows)
        {
            var item=this.Rows[i];
            item.RemoveCell(index);
        }
    }

    this.ClearRows=function()
    {
        this.Rows=[];
    }

    this.InsertColumn=function(index, data)    //添加列 data:{ Value:, Option }
    {
        if (Array.isArray(data))
        {
            for(var i in this.Rows)
            {
                var item=this.Rows[i];
                if (i<data.length)
                {
                    const dataItem=data[i];
                    item.InsertCell(index,dataItem.Value, dataItem.Option);
                }
                else
                {
                    item.InsertCell(index,null,JsCellItem.GetCellRule(CELL_TYPE_ID.CELL_NONE_ID));
                }
            }
        }
        else
        {
            for(var i in this.Rows)
            {
                var item=this.Rows[i];
                item.InsertCell(index,data.Value, data.Option);
            }
        }
    }

    //设置单元格数据
    this.SetCellValue=function(rowIndex, colIndex, value, option)
    {
        if (rowIndex>=this.Rows.length) return;
        var row=this.Rows[rowIndex];
        if (colIndex>=row.Cells.length) return;

        row.Cells[colIndex].SetValue(value,option);
    }

    this.GetRowCount=function()
    {
        return this.Rows.length;
    }

    //排序
    this.Sort=function(orderID, colIndex)    //0=不排序 1=升序 2=降序
    {
        if (orderID==1)
        {
            this.Rows.sort((a,b)=>
            {
                return a.Cells[colIndex].Value-b.Cells[colIndex].Value;
            })
        }
        else if (orderID==2)
        {
            this.Rows.sort((a,b)=>
            {
                return b.Cells[colIndex].Value-a.Cells[colIndex].Value;
            })
        }
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////
//  公共方法
//
//
//

function JSTableHelper() 
{

}

JSTableHelper.CreateGuid=function()
{
    function S4()
    {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//是否是数值
JSTableHelper.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//是否是整形
JSTableHelper.IsInteger=function(x) 
{
    return (typeof x === 'number') && (x % 1 === 0);
}

//数据输出格式化 floatPrecision=原始小数位数  changedfloatPrecision=转换以后的小数位数
JSTableHelper.FormatValueString=function(value, floatPrecision, changedfloatPrecision, languageID)
{
    if (!JSTableHelper.IsNumber(value))
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
        return value.toFixed(floatPrecision);
    else if (absValue < 100000000)
        return (value/10000).toFixed(changedfloatPrecision)+"万";
    else if (absValue < 1000000000000)
        return (value/100000000).toFixed(changedfloatPrecision)+"亿";
    else
        return (value/1000000000000).toFixed(changedfloatPrecision)+"万亿";
}

