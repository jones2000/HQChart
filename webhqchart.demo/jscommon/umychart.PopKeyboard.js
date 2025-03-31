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
    this.TitleBox=null; //{ DivTitle, DivName, }
    this.InputDOM=null;
    this.Title="HQChart 键盘精灵"
    this.ID=Guid();
    this.ActiveDOM=null;    //启动键盘精灵是的控件
    this.InputStatus=0;     //0=空闲  1=输入中 


    this.BGColor=g_JSChartResource.DialogPopKeyboard.BGColor;
    this.TitleColor=g_JSChartResource.DialogPopKeyboard.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogPopKeyboard.TitleBGColor;
    this.BorderColor=g_JSChartResource.DialogPopKeyboard.BorderColor;

    this.InputBGColor=g_JSChartResource.DialogPopKeyboard.Input.BGColor;
    this.InputTextColor=g_JSChartResource.DialogPopKeyboard.Input.TextColor;

    this.Keyboard=
    {
        Option:JSPopKeyboard.GetOption(),
        JSChart:null,
    }

    this.Inital=function(option)
    {
        if (option)
        {
            if (IFrameSplitOperator.IsBool(option.EnableResize))  this.Keyboard.Option.EnableResize=option.EnableResize;
        }

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

    this.Destroy=function()
    {
        if (this.DivDialog) document.body.removeChild(this.DivDialog);

        this.DivDialog=null;
        this.TitleBox=null;
        if (!this.Keyboard.JSChart) this.Keyboard.JSChart.ChartDestory();
        this.Keyboard.JSChart=null;

        window.removeEventListener('mousedown', (e)=>{ this.OnWindowMouseDown(e)}); //注销监听
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

        this.TitleBox={ DivTitle:divTitle, DivName:divInfoText, DivClose:divClose };

        var divInput=document.createElement("div");
        divInput.className='jschart_keyboard_Input_Div';
        divDom.appendChild(divInput);

        var input=document.createElement("input");
        input.className="jschart_keyboard_input";
        input.addEventListener("keydown", (event)=>{ this.OnKeydown(event); });
        input.addEventListener("keyup", (event)=>{ this.OnKeyup(event); });

        input.addEventListener("compositionstart", (event)=>{ this.OnCompositionStart(event); });
        input.addEventListener("compositionupdate", (event)=>{ this.OnCompositionUpdate(event);} );
        input.addEventListener("compositionend", (event)=>{ this.OnCompositionEnd(event);} );

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


        this.UpdateStyle();

        document.body.appendChild(divDom);
    }

    this.OnCreateHQChart=function(chart)
    {

    }


    this.OnCompositionStart=function(event)
    {
        this.InputStatus=1;
    }

    this.OnCompositionUpdate=function(event)
    {

    }

    this.OnCompositionEnd=function(event)
    {
        this.InputStatus=0;
    }

    this.OnKeydown=function(event)
    {
        if (this.InputStatus!=0) return;

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
        if (this.InputStatus!=0) return;
        
        var code=event.keyCode;

        if (code==8)   //删除
        {
            var strText=this.InputDOM.value;
            if (strText.length==0)  
            {
                this.Hide();    //只有按了删除 才能隐藏
                return;
            }
        }
    
        if ((code>=48 && code<=57) || (code>=65 && code<=90) || (code>=96 && code<=122) || code==8)
        {
            var strText=this.InputDOM.value;
            strText=strText.toUpperCase();
            this.Keyboard.JSChart.Search(strText);
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

        if (!this.Keyboard.Option.EnableResize) //自动调整大小
        {
            if (this.Keyboard.JSChart) this.Keyboard.JSChart.OnSize();
        }

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
        if (this.ActiveDOM)
        {
            if (this.ActiveDOM.focus) this.ActiveDOM.focus();   //把焦点换回去
            this.ActiveDOM=null;
        }
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
        if (code==116) return;  //F5不处理

        if (!this.IsShow() && (code>=48 && code<=57) || (code>=65 && code<=90) || (code>=96 && code<=122))
        {
            this.Show();
            this.InputDOM.focus();
            if (this.InputDOM.value=="") 
            {
                this.InputDOM.value=event.key;
                event.preventDefault();
            }
            if (event.target) this.ActiveDOM=event.target;
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


    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.InputBGColor) this.InputDOM.style['background-color']=this.InputBGColor;
        if (this.InputTextColor) this.InputDOM.style['color']=this.InputTextColor;


        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
        if (this.TitleColor) 
        {
            this.TitleBox.DivName.style['color']=this.TitleColor;
            this.TitleBox.DivClose.style['color']=this.TitleColor;
        }
        
    }

    this.ReloadResource=function(option)
    {
        this.BGColor=g_JSChartResource.DialogPopKeyboard.BGColor;
        this.TitleColor=g_JSChartResource.DialogPopKeyboard.TitleColor;
        this.TitleBGColor=g_JSChartResource.DialogPopKeyboard.TitleBGColor;
        this.BorderColor=g_JSChartResource.DialogPopKeyboard.BorderColor;
    
        this.InputBGColor=g_JSChartResource.DialogPopKeyboard.Input.BGColor;
        this.InputTextColor=g_JSChartResource.DialogPopKeyboard.Input.TextColor;

        if (this.Keyboard.JSChart) 
        {
            this.Keyboard.JSChart.ReloadResource();
            this.Keyboard.JSChart.Draw();
        }

        if (!this.DivDialog) return;
        this.UpdateStyle();
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
        EnableResize:false,

        //{ Type:列id, Title:标题, TextAlign:文字对齐方式, MaxText:文字最大宽度 , TextColor:文字颜色, Sort:0=不支持排序 1=本地排序 0=远程排序 }
        Column:   
        [
            { Type:KEYBOARD_COLUMN_ID.SHORT_SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null, MaxText:"888888" },
            { Type:KEYBOARD_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, MaxText:"擎擎擎擎擎擎擎擎" },
            { Type:KEYBOARD_COLUMN_ID.TYPE_NAME_ID, Title:"类型", TextAlign:"right", Width:null, MaxText:"擎擎擎擎擎" },
        ]
    };

    return option;
}



