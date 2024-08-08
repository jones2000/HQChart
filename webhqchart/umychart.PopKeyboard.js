/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置弹出键盘精灵
*/

function JSPopKeyboard()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.InputDOM=null;
    this.Title="HQChart 键盘精灵"
    this.ID=Guid();

    this.Keyboard=
    {
        Option:JSPopKeyboard.GetOption(),
        JSChart:null,
    }

    this.Inital=function()
    {
        window.addEventListener('mousedown', (e)=>{ this.OnWindowMouseDown(e)});
    }

    this.OnWindowMouseDown=function(e)
    {
        if (!this.DivDialog) return;

        console.log("[JSPopKeyboard::OnWindowMouseDown] e=", e);

        if (!this.DivDialog.contains(e.target))
        {
            this.Hide();
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement('div');
        divDom.className='jchart_pop_keyboard_dailog';
        divDom.id=this.ID;

        var divTitle=document.createElement("div");
        divTitle.className='jschart_keyboard_Title_Div';
        divTitle.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }
        divDom.appendChild(divTitle);

        var divInfoText=document.createElement("div");
        divInfoText.className="jschart_keyboard_Title";
        divInfoText.innerText=this.Title;
        this.DivInfoText=divInfoText;
        divTitle.appendChild(divInfoText);

        var divClose=document.createElement("div");
        divClose.className='jschart_keyboard_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.Hide(); }
        divTitle.appendChild(divClose);

        var divInput=document.createElement("div");
        divInput.className='jschart_keyboard_Input_Div';
        divDom.appendChild(divInput);

        var input=document.createElement("input");
        input.className="jschart_keyboard_input";
        input.addEventListener("keydown", (event)=>{ this.OnKeydown(event); });
        input.addEventListener("keyup", (event)=>{ this.OnKeyup(event); });

        divInput.appendChild(input);
       
        var divChart=document.createElement("div");
        divChart.className="jschart_keyboard_Chart_Div";
        divDom.appendChild(divChart);

        this.DivDialog=divDom;
        this.InputDOM=input;

        var chart=JSKeyboardChart.Init(divChart);
        this.Keyboard.JSChart=chart;

        this.Keyboard.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        chart.SetOption(this.Keyboard.Option);  //设置K线配置

        chart.AddEventCallback(
            {
                event:JSCHART_EVENT_ID.ON_KEYBOARD_MOUSEUP,
                callback:(event, data, chart)=>{ this.OnChartMouseUp(event, data, chart);}
            }
        )

        document.body.appendChild(divDom);
    }

    this.OnCreateHQChart=function(chart)
    {

    }

    this.OnKeydown=function(event)
    {
        var aryKey=new Set([
            40, 
            38, 
            13,
            33,
            34
        ]);

        if (aryKey.has(event.keyCode))  
        {
            this.Keyboard.JSChart.OnKeyDown(event);
        }

        if (event.keyCode==27)
        {
            this.Hide();
        }
    }

    this.OnKeyup=function(event)
    {
        var code=event.keyCode;
        if ((code>=48 && code<=57) || (code>=65 && code<=90) || (code>=97 && code<=122) || code==8)
        {
            var strText=this.InputDOM.value;
            strText=strText.toUpperCase();
            if (strText.length==0)
            {
                this.Hide();
            }
            else
            {
                this.Keyboard.JSChart.Search(strText);
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

    this.SetSymbolData=function(data)
    {
        if (!this.Keyboard.JSChart) return false;
        this.Keyboard.JSChart.SetSymbolData(data);
    }

    this.Show=function()
    {
        if (!this.DivDialog) return;

        //显示在右下方
        var height=this.DivDialog.offsetHeight;
        var width=this.DivDialog.offsetWidth;
        var xRight=window.innerWidth-5;
        var ybottom=window.innerHeight-5;
        var x=xRight-width;
        var y=ybottom-height;

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.Hide=function()
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';
        this.InputDOM.value="";
        this.Keyboard.JSChart.ClearSearch();
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        return this.DivDialog.style.visibility==='visible';
    }

    this.OnGlobalKeydown=function(event)
    {
        if (!this.DivDialog) return;

        var code=event.keyCode;
        if (!this.IsShow() && (code>=48 && code<=57) || (code>=65 && code<=90) || (code>=97 && code<=122))
        {
            this.Show();
            this.InputDOM.focus();
        }
        else if (code==27 && this.IsShow())
        {
            this.Hide();
        }
    }

    this.OnGlobalMouseDown=function(event)
    {
        if (!this.DivDialog) return;

        if (this.DivDialog.style.display=='none') return;

        if (!this.DivDialog.contains(event.target))
        {
            this.Hide();
        }
    }

    this.OnChartMouseUp=function(event, data, chart)
    {
        this.InputDOM.focus();
    }
}

JSPopKeyboard.GetOption=function()
{
    var option= 
    {
        Type:'键盘精灵',   //创建图形类型
        
        Border: //边框
        {
            Left:1,        //左边间距
            Right:1,       //右边间距
            Bottom:1,      //底部间距
            Top:1          //顶部间距
        },

        BorderLine:1|2|4|8,
        EnableResize:true
    };

    return option;
}



