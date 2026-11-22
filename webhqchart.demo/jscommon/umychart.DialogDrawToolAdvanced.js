/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置画图工具高级设置框
   1.警告线设置
*/

class IJSDialogAdvancedSetting
{
    static MapClass=new Map();

    static Create(className, option)
    {
        if (!IJSDialogAdvancedSetting.MapClass.has(className)) 
        {
            JSConsole.Chart.Warn(`[IJSDialogAdvancedSetting::Create] can't find class=${className}.`);
            return null;
        }

        var item=IJSDialogAdvancedSetting.MapClass.get(className);
        return item.Create();
    }

    constructor()
    {
        this.ClassName="IJSDialogAdvancedSetting";
        this.HQChart = null;
        this.DivDialog = null;
        this.TitleDOM=null;
        this.DragTitle=null;

        this.ModifyButton=null;
        this.CreateButton=null;
        this.OkButton=null;

        this.ChartPicture=null;
        this.DataBackUp=null;       //数据备份

        this.InputDelay={ Timer:null, Delay:500 };       //输入防抖
       
    }

    Inital(chart, option)
    {
        this.HQChart = chart;
    }

    

    Destroy()
    {
        if (this.DivDialog) 
        {
            if (document && document.body && document.body.removeChild) document.body.removeChild(this.DivDialog);
            this.DivDialog=null;
        }
    }

    Create()
    {
        if(this.DivDialog) return;

        this.CreateDialog();
        this.BindControl();
        this.BindDragTitle();
    }

    //隐藏窗口
    Hidden()
    {
        if(this.DivDialog)
        {
            this.DivDialog.style.visibility = "hidden";
        }
    }

    Close()
    {
        throw new Error("子类没有实现 IJSDialogAdvancedSetting::Close()");
    }

    Show(x, y, option)
    {
        throw new Error("子类没有实现 IJSDialogAdvancedSetting::Show()");
    }

    Cancel()
    {
        throw new Error("子类没有实现 IJSDialogAdvancedSetting::Cancel()");
    }

    SetTitle(title)
    {
        this.TitleDOM.innerText=title;
    }

    ClearDelayTimer()
    {
        clearTimeout(this.InputDelay.Timer);
        this.InputDelay.Timer=null;
    }

    Save()
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        //保存到缓存
        if (this.HQChart.ChartDrawStorage) this.HQChart.ChartDrawStorage.SaveDrawData(this.ChartPicture);
    }

    IsModifyMode()
    {
        return this.Type===1;
    }

    ///////////////////////////////////////////////////////////////////////
    //内部函数

    GetTemplateHtml()
    {
        throw new Error("子类必须实现 GetTemplateHtml()");
    }

    CreateDialog()
    {
        if(this.DivDialog) return;

        let html = this.GetTemplateHtml();
        let div = document.createElement("div");
        div.innerHTML = html;
        this.DivDialog = div.firstElementChild;
        document.body.appendChild(this.DivDialog);

        this.TitleDOM=this.DivDialog.querySelector(".js-title-name");
    }

    // 简单拖拽（标题栏拖动）
    BindDragTitle()
    {
        var divTitle = this.DivDialog.querySelector(".js-title");
        divTitle.onmousedown = (e)=>{ this.OnMouseDownTitle(e); }
    }

    //绑定控件和事件
    BindControl()
    {
        

       
    }

    //拖动
    OnMouseDownTitle(e)
    {
        if (!this.DivDialog) return;

        var dragData={ X:e.clientX, Y:e.clientY };
        dragData.YOffset=e.clientX - this.DivDialog.offsetLeft;
        dragData.XOffset=e.clientY - this.DivDialog.offsetTop;
        this.DragTitle=dragData;

        document.onmousemove=(e)=>{ this.DocOnMouseMoveTitle(e); }
        document.onmouseup=(e)=>{ this.DocOnMouseUpTitle(e); }
    }

    DocOnMouseMoveTitle(e)
    {
        if (!this.DragTitle) return;

        var scrollPos=GetScrollPosition();
        var left = e.clientX - this.DragTitle.YOffset;
        var top = e.clientY - this.DragTitle.XOffset;

        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+ this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=(window.innerHeight+scrollPos.Top)) top=(window.innerHeight-this.DivDialog.offsetHeight-5)+scrollPos.Top;

        this.DivDialog.style.left = left + 'px';
        this.DivDialog.style.top = top + 'px';

        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }

    DocOnMouseUpTitle(e)
    {
        this.DragTitle=null;

        document.onmousemove = null;
        document.onmouseup = null;
    }
}

class ColorControl
{
    constructor(config)
    {
        this.DivDialog=null;
        //线段颜色
        this.ColorPicker=null;
        this.ColorButton=null;
        this.ColorPreviewDOM=null;
        this.ColorTextDOM=null;
        this.AlphaPicker=null;
        this.AlphaTextDOM=null;
        this.OnColorChangeCallback=null;

        this.EnableCheckbox=null;

        this.CSSSelectorConfig=
        {
            ColorPicker:null,       //".js-line-color",
            ColorButton:null,       //".js-line-color-btn",
            ColorPreviewDOM:null,   //".UMyChart_AlertSetting_Color_Preview",
            ColorTextDOM:null,      //".UMyChart_AlertSetting_Color_Text",
            Checkbox:null,

            AlphaPicker: null,  //".js-text-alpha-picker",
            AlphaTextDOM:null,  // ".js-text-alpha-text"
        }

        if (config.CSSSelector)
        {
            var item=config.CSSSelector;
            var dest=this.CSSSelectorConfig;

            dest.ColorPicker=item.ColorPicker;
            dest.ColorButton=item.ColorButton;
            dest.ColorPreviewDOM=item.ColorPreviewDOM;
            dest.ColorTextDOM=item.ColorTextDOM;
            dest.Checkbox=item.Checkbox;
            dest.AlphaPicker=item.AlphaPicker;
            dest.AlphaTextDOM=item.AlphaTextDOM;
        }
    }

    BindControl(domDialog)
    {
        this.DivDialog=domDialog;
        // 线段颜色选择
        var config=this.CSSSelectorConfig;
        this.ColorPicker = this.DivDialog.querySelector(config.ColorPicker);
        this.ColorButton = this.DivDialog.querySelector(config.ColorButton);
        this.ColorPreviewDOM = this.ColorButton.querySelector(config.ColorPreviewDOM);
        this.ColorTextDOM = this.ColorButton.querySelector(config.ColorTextDOM);

        if (config.AlphaPicker && config.AlphaTextDOM)
        {
            this.AlphaPicker = this.DivDialog.querySelector(config.AlphaPicker);
            this.AlphaTextDOM = this.DivDialog.querySelector(config.AlphaTextDOM);
            this.AlphaPicker.oninput = ()=>
            {
                var alpha = Number(this.AlphaPicker.value);
                this.AlphaTextDOM.textContent = alpha.toFixed(2);
                if (this.OnColorChangeCallback) this.OnColorChangeCallback(this.GetColor());
            }
        }

        this.ColorButton.onclick = () => 
        {
            this.ColorPicker.click();
        };

        this.ColorPicker.oninput = () => 
        {
            const color = this.ColorPicker.value;
            this.ColorPreviewDOM.style.background = color;
            this.ColorTextDOM.textContent = this.GetColorName(color);

            if (this.OnColorChangeCallback)  this.OnColorChangeCallback(this.GetColor());
        };

        if (config.Checkbox)
        {
            this.EnableCheckbox = this.DivDialog.querySelector(config.Checkbox);
            this.EnableCheckbox.addEventListener("change", ()=>
            {
                var enable=this.IsEnableColor();
                this.EnableColor(enable);
                this.OnColorChangeCallback(this.GetColor());
            });
        }
    }

    SetColor(color)
    {
        if (color===null)
        {
            if (this.EnableCheckbox) this.EnableCheckbox.checked = false;
            this.EnableColor(false);
        }
        else
        {
            if (IChartDrawPicture.IsRGBAColor(color))
            {
                var data=IChartDrawPicture.RGBAToRGB(color);
                color=data.Color;

                if (this.AlphaPicker) this.AlphaPicker.value = data.Alpha;
                if (this.AlphaTextDOM) this.AlphaTextDOM.textContent = data.Alpha.toFixed(2);
            }
            else
            {
                if (this.AlphaPicker) this.AlphaPicker.value = 1;
                if (this.AlphaTextDOM) this.AlphaTextDOM.textContent = "1.00";
            }

            this.ColorPicker.value = color;
            this.ColorPreviewDOM.style.background = color;
            this.ColorTextDOM.textContent = this.GetColorName(color);
            if (this.EnableCheckbox) this.EnableCheckbox.checked = true;
            this.EnableColor(true);
        }
    }

    GetColor()
    {
        if (this.EnableCheckbox && this.EnableCheckbox.checked===false) return null;

        var color=this.ColorPreviewDOM.style.background;    //rgb
        var alpha=1;
        if (this.AlphaPicker) alpha=Number(this.AlphaPicker.value);
        if (alpha<1) color=IChartDrawPicture.ColorToRGBA(color,alpha);
        return color;
    }

    GetColorName(color)
    {
        if (IChartDrawPicture.IsHexColor(color)) return color;

        return IChartDrawPicture.RGBToHex(color);
    }

    EnableColor(value)
    {
        if (!this.EnableCheckbox) return;
        
        this.ColorPicker.disabled = !value;
        if (this.AlphaPicker) this.AlphaPicker.disabled = !value;
        if (value) this.ColorButton.classList.remove("disabled");
        else this.ColorButton.classList.add("disabled");
    }

    IsEnableColor()
    {
        if(!this.EnableCheckbox) return false;
        return this.EnableCheckbox.checked;
    }
}

class FontControl
{
    static ParseFontString(fontStr)
    {
        var pixelRatio=GetDevicePixelRatio();
        const result = 
        {
            IsBold: false,
            IsItalic: false,
            FontSize: 14,
            FontFamily: "Microsoft YaHei",
        };

        if (!fontStr || typeof fontStr !== "string")
        {
            return result;
        }

        const parts = fontStr.split(/\s+/);
        const sizeReg = /^(\d+)px$/;
        let hitSize = false;
        const styleParts = [];
        const familyParts = [];
        let sizePart = "";

        for (const p of parts)
        {
            if (!hitSize && sizeReg.test(p))
            {
                sizePart = p;
                hitSize = true;
                continue;
            }
            if (!hitSize)
            {
                styleParts.push(p);
            }
            else
            {
                familyParts.push(p);
            }
        }

        for (const s of styleParts)
        {
            if (s === "bold") result.IsBold = true;
            if (s === "italic") result.IsItalic = true;
        }

        if (sizePart)
        {
            const num = parseInt(sizePart, 10);
            if (!isNaN(num))
            {
                result.FontSize = num;
                result.FontSize/=pixelRatio;
            }
        }

        if (familyParts.length > 0)
        {
            result.FontFamily = familyParts.join(" ");
        }

        return result;
    }

    constructor(config)
    {
        this.DivDialog = null;
        // 控件DOM
        this.FontFamilySelect = null;
        this.FontSizeSelect = null;
        this.BoldBtn = null;
        this.ItalicBtn = null;

        this.OnFontChangeCallback = null;

        this.CSSSelectorConfig =
        {
            FontFamily: null,    // ".js-font-family"
            FontSize: null,      // ".js-font-size"
            BoldBtn: null,       // ".js-bold"
            ItalicBtn: null,     // ".js-italic"
        }

        if (config.CSSSelector)
        {
            var item = config.CSSSelector;
            var dest = this.CSSSelectorConfig;

            dest.FontFamily = item.FontFamily;
            dest.FontSize = item.FontSize;
            dest.BoldBtn = item.BoldBtn;
            dest.ItalicBtn = item.ItalicBtn;
        }
    }

    BindControl(domDialog)
    {
        this.DivDialog = domDialog;
        var config = this.CSSSelectorConfig;

        this.FontFamilySelect = this.DivDialog.querySelector(config.FontFamily);
        this.FontSizeSelect = this.DivDialog.querySelector(config.FontSize);
        this.BoldBtn = this.DivDialog.querySelector(config.BoldBtn);
        this.ItalicBtn = this.DivDialog.querySelector(config.ItalicBtn);

        // 粗体点击切换 active
        this.BoldBtn.onclick = () =>
        {
            this.BoldBtn.classList.toggle('active');
            if (this.OnFontChangeCallback) this.OnFontChangeCallback(this.GetFont());
        };

        // 斜体点击切换 active
        this.ItalicBtn.onclick = () =>
        {
            this.ItalicBtn.classList.toggle('active');
            if (this.OnFontChangeCallback) this.OnFontChangeCallback(this.GetFont());
        };

        // 字体下拉变化
        this.FontFamilySelect.onchange = () =>
        {
            if (this.OnFontChangeCallback) this.OnFontChangeCallback(this.GetFont());
        };

        // 字号下拉变化
        this.FontSizeSelect.onchange = () =>
        {
            if (this.OnFontChangeCallback) this.OnFontChangeCallback(this.GetFont());
        };
    }

    /**
     * 设置字体，传入标准 ctx.font 字符串："italic bold 14px Microsoft YaHei"
     * @param {string} fontStr
     */
    SetFont(font)
    {
        var fontInfo=null;
        if (IFrameSplitOperator.IsObject(font))
        {
            //{ Family:'微软雅黑', Size:20, Weight:null, Style:null };    //Weight(bold 粗体), Style(italic)
            fontInfo=
            {
                IsBold: font.Weight=="bold",
                IsItalic: font.Style=="italic",
                FontSize: font.Size || 14,
                FontFamily: font.Family || "Microsoft YaHei",
            }
        }
        else
        {
            fontInfo = FontControl.ParseFontString(font);
        }
        

        // 回填字体下拉
        const familyOpt = Array.from(this.FontFamilySelect.options).find(opt => opt.value === fontInfo.FontFamily);
        if (familyOpt)
        {
            this.FontFamilySelect.value = fontInfo.FontFamily;
        }

        // 回填字号下拉
        const sizeOpt = Array.from(this.FontSizeSelect.options).find(opt => Number(opt.value) === fontInfo.FontSize);
        if (sizeOpt)
        {
            this.FontSizeSelect.value = fontInfo.FontSize;
        }

        // 粗斜按钮状态
        if (fontInfo.IsBold)
            this.BoldBtn.classList.add('active');
        else
            this.BoldBtn.classList.remove('active');

        if (fontInfo.IsItalic)
            this.ItalicBtn.classList.add('active');
        else
            this.ItalicBtn.classList.remove('active');
    }

    /**
     * 获取拼接好的 ctx.font 字符串
     */
    GetFont()
    {
        const fontFamily = this.FontFamilySelect.value;
        const fontSize = Number(this.FontSizeSelect.value);
        const bold = this.BoldBtn.classList.contains('active');
        const italic = this.ItalicBtn.classList.contains('active');
        const pixelRatio=GetDevicePixelRatio();

        const arr = [];
        if (italic) arr.push('italic');
        if (bold) arr.push('bold');
        arr.push(`${fontSize*pixelRatio}px`);
        arr.push(fontFamily);
        var text=arr.join(' ');

        var result=
        {
            IsBold: bold,
            IsItalic: italic,
            FontSize: fontSize,
            FontFamily: fontFamily,
            Text: text
        };

        return result;
    }
}

class TabControl
{
    constructor(config)
    {
        this.DivDialog = null;
        // 控件DOM
        this.TabDOMList=null;
        this.TabPanelDOMList=null;
        this.CurrentTabID = null;

        this.OnTabChangeCallback = null;

        this.CSSSelectorConfig =
        {
            TabDOMList: null,    // ".js-font-family"
            TabPanelDOMList: null,      // ".js-font-size"
        }

        if (config.CSSSelector)
        {
            var item = config.CSSSelector;
            var dest = this.CSSSelectorConfig;

            dest.TabDOMList = item.TabDOMList;
            dest.TabPanelDOMList = item.TabPanelDOMList;
        }
    }

    BindControl(domDialog)
    {
        this.DivDialog = domDialog;
        this.TabDOMList = domDialog.querySelectorAll(this.CSSSelectorConfig.TabDOMList);
        this.TabPanelDOMList = domDialog.querySelectorAll(this.CSSSelectorConfig.TabPanelDOMList);

        this.TabDOMList.forEach(tab =>
        {
            tab.addEventListener('click', () =>
            {
                const tabKey = tab.dataset.tab;
                this.SwitchTab(tabKey);
            });
        });

        // 初始化激活第一个active的tab
        const activeTab = domDialog.querySelector(this.CSSSelectorConfig.TabDOMList + '.active');
        if (activeTab)
        {
            this.CurrentTabID = activeTab.dataset.tab;
        }
    }

    SwitchTab(tabID)
    {
        if (!tabID) return;
        this.CurrentTabID = tabID;

        // 切换tab激活样式
        this.TabDOMList.forEach(tab =>
        {
            tab.classList.toggle('active', tab.dataset.tab === tabID);
        });
        // 切换面板显示
        this.TabPanelDOMList.forEach(panel =>
        {
            panel.classList.toggle('active', panel.dataset.tab === tabID);
        });

        // 触发回调
        if (typeof this.OnTabChangeCallback === 'function')
        {
            this.OnTabChangeCallback(tabID);
        }
    }

    //外部手动获取当前tab
    GetCurrentTabID()
    {
        return this.CurrentTabID;
    }

    // 外部手动切换
    SetCurrentTab(tabID)
    {
        this.SwitchTab(tabID);
    }
}

class ChartPictureInfoControl
{
    constructor(config)
    {
        this.DivDialog = null;
        // 控件DOM
        this.StockNameDOM=null;
        this.PeriodDOM=null;
        this.ClassNameDOM=null;
        this.WindowDOM=null;

        this.CSSSelectorConfig=
        {
            StockNameDOM:null,       
            PeriodDOM:null,   
            ClassNameDOM:null, 
            WindowDOM:null,
        }

        if(config?.CSSSelector)
        {
            const item = config.CSSSelector;
            const dest = this.CSSSelectorConfig;
            if(item.StockNameDOM) dest.StockNameDOM = item.StockNameDOM;
            dest.PeriodDOM = item.PeriodDOM;
            dest.ClassNameDOM = item.ClassNameDOM;
            dest.WindowDOM = item.WindowDOM;
        }
    }

    BindControl(domDialog)
    {
        this.DivDialog = domDialog;
        const cfg = this.CSSSelectorConfig;
        this.StockNameDOM = domDialog.querySelector(cfg.StockNameDOM);
        this.PeriodDOM = domDialog.querySelector(cfg.PeriodDOM);
        this.ClassNameDOM = domDialog.querySelector(cfg.ClassNameDOM);
        this.WindowDOM = domDialog.querySelector(cfg.WindowDOM);
        // 纯文本，无输入事件绑定
    }

    SetChartPicture(chart)
    {
        if (!chart) return;

        if (this.StockNameDOM) this.StockNameDOM.textContent = chart.Symbol ?? "";
        if (this.PeriodDOM) this.PeriodDOM.textContent = ChartData.GetPeriodName(chart.Period);
        if (this.ClassNameDOM) this.ClassNameDOM.textContent = chart.ClassName ?? "";
        if (this.WindowDOM) this.WindowDOM.textContent = chart.Frame.Identify ?? "";
    }
}

class PointControl
{
    constructor(config)
    {
        this.DivDialog = null;
        // 控件DOM
        this.RowDOM=null;
        this.ValueInput=null;
        this.XInput=null;
        this.DateDOM=null;
        this.TimeDOM=null;

        this.ChartClassName=null;
        this.Period=null;

        this.InputConfig={ X:{ Dec:0, Step:1 }, Y:{ Dec:2, Step:0.01 } };

        this.OnPointChangeCallback = null;
        this.GetKItemCallback=null;

        this.CSSSelectorConfig=
        {
            RowDOM:null,       //{ CSS: ".js-point-row", DataIndex: 0 },
            ValueInput:null,   //".js-point-price",
            XInput:null,       //".js-point-date-text",
            DateDOM:null,
            TimeDOM:null,
        }

        if(config?.CSSSelector)
        {
            const item = config.CSSSelector;
            const dest = this.CSSSelectorConfig;
            if(item.RowDOM) dest.RowDOM = {...dest.RowDOM, ...item.RowDOM};
            dest.ValueInput = item.ValueInput;
            dest.XInput = item.XInput;
            dest.TimeDOM = item.TimeDOM;
            dest.DateDOM = item.DateDOM;
        }
    }

    BindControl(domDialog)
    {
        this.DivDialog = domDialog;
        const {RowDOM} = this.CSSSelectorConfig;
        // 拼接选择器：.js-point-row[data-index="0"]
        const rowSelector = `${RowDOM.CSS}[data-index="${RowDOM.DataIndex}"]`;
        this.RowDOM = domDialog.querySelector(rowSelector);
        if (!this.RowDOM) return;
        
        const row = this.RowDOM;
        this.ValueInput = row.querySelector(this.CSSSelectorConfig.ValueInput);
        this.XInput = row.querySelector(this.CSSSelectorConfig.XInput);
        this.TimeDOM = row.querySelector(this.CSSSelectorConfig.TimeDOM);
        this.DateDOM = row.querySelector(this.CSSSelectorConfig.DateDOM);

        this.ValueInput.addEventListener('input', () => { this.OnPointChange(); });
        this.ValueInput.addEventListener('wheel', (e) => 
        {
            e.preventDefault();
            var config=this.InputConfig.Y;
            const step = config.Step;
            let val = Number(this.ValueInput.value || 0);
            if (e.deltaY < 0) val += step;
            else val -= step;
            this.ValueInput.value = val.toFixed(config.Dec);
            this.OnPointChange();
        });

        this.XInput.addEventListener('input', () => 
        { 
            this.OnPointChange(); 
            this.UpdateDateTime();
        });
        this.XInput.addEventListener('wheel', (e) => 
        {
            e.preventDefault();
            var config=this.InputConfig.X;
            const step = config.Step;
            let val = Number(this.XInput.value || 0);
            if (e.deltaY < 0) val += step;
            else val -= step;
            this.XInput.value = val.toFixed(config.Dec);
            this.OnPointChange();
            this.UpdateDateTime();
        });
    }

    SetYValue(value)
    {
        var config=this.InputConfig.Y;
        this.ValueInput.value=value.toFixed(config.Dec);
    }

    SetXValue(value)
    {
        var config=this.InputConfig.X;
        this.XInput.value=value.toFixed(config.Dec);
        this.UpdateDateTime();
    }

    SetChartInfo(data)
    {
        this.ChartClassName=data.ClassName;
        this.Period=data.Period;
        if (this.ChartClassName=="ChartDrawAnchoredText")  this.InputConfig={ X:{ Dec:2, Step:0.01 }, Y:{ Dec:2, Step:0.01 } };
        else this.InputConfig={ X:{ Dec:0, Step:1 }, Y:{ Dec:2, Step:0.01 } };
    }

    Reset()
    {
        this.ChartClassName=null;
        this.Period=null;
        this.InputConfig={ X:{ Dec:0, Step:1 }, Y:{ Dec:2, Step:0.01 } };
    }

    ShowRow(bShow)
    {
        this.RowDOM.style.display=bShow===true?null:"none";
    }

    OnPointChange()
    {
        var yValue=Number(this.ValueInput.value);
        var xValue=Number(this.XInput.value);
        var index=this.CSSSelectorConfig.RowDOM.DataIndex;
        if (this.OnPointChangeCallback) this.OnPointChangeCallback( {Index:index, XValue:xValue, YValue:yValue});
    }

    UpdateDateTime()
    {
        var xValue=Number(this.XInput.value);
        var datetime={ Date:null, Time:null };
        if (this.ChartClassName=="ChartDrawAnchoredText")
        {

        }
        else
        {
            var kItem=null;
            if (this.GetKItemCallback) kItem=this.GetKItemCallback(xValue);
            if (kItem)
            {
                datetime.Date=kItem.Date;
                if (IFrameSplitOperator.IsNumber(kItem.Time)) datetime.Time=kItem.Time;
            }
        }
        
        var date="----/----", time="--:--";
        if (IFrameSplitOperator.IsNumber(datetime.Date)) date=IFrameSplitOperator.FormatDateString(datetime.Date,"YYYY-MM-DD");
        if (IFrameSplitOperator.IsNumber(datetime.Time)) time=IFrameSplitOperator.FormatTimeString(datetime.Time,"HH:MM");

        this.DateDOM.textContent = date;
        this.TimeDOM.textContent = time;
    }

}

//警告线设置
class JSDialogAlertSetting extends IJSDialogAdvancedSetting
{
    static CLASS_NAME="JSDialogAlertSetting";

    constructor()
    {
        super();

        this.ClassName=JSDialogAlertSetting.CLASS_NAME;
        this.ValueInput=null;
        this.NameInput=null;
        this.ValueTypeDOM=null;
        this.CompareTypeDOM=null;

        //线段颜色
        this.LineColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-line-color",
                ColorButton:".js-line-color-btn",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
            }
        });
 
        this.FrameID=-1;
        this.Type=0;    //0=创建 1=修改
        this.AryIndex=[];   //{ Type:0=K线|1=指标,  ID:"指标ID", Name:"指标名称", ValueName:"数据名称" }, //Compare:{ Type:, Value: }
    }

    

    GetTemplateHtml()
    {
        var html = `
        <div class="UMyChart_AlertSetting_Dialog_Div">
            <div class="UMyChart_DrawTool_Advanced_Title_Div js-title">
                <span class="UMyChart_DrawTool_Advanced_Name_Div js-title-name">预警线设置</span>
                <span class="UMyChart_DrawTool_Advanced_Close_Div js-close">×</span>
            </div>
            <div class="UMyChart_DrawTool_Advanced_Content_Wrap">
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <div class="UMyChart_AlertSetting_Label">名字</div>
                    <input class="UMyChart_AlertSetting_Name_Input js-name" type="text" placeholder="线段名称默认为空"/>
                </div>
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <label class="UMyChart_AlertSetting_Label">线段</label>
                    <div class="UMyChart_AlertSetting_Color_Wrap">
                        <input type="color" class="UMyChart_AlertSetting_Color_Picker js-line-color" value="#FFA500"/>
                        <button type="button" class="UMyChart_AlertSetting_Color_Btn js-line-color-btn" title="选择线段颜色">
                            <span class="UMyChart_AlertSetting_Color_Preview" style="background:#FFA500;"></span>
                            <span class="UMyChart_AlertSetting_Color_Text">橙色</span>
                        </button>
                    </div>
                </div>
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <div class="UMyChart_AlertSetting_Label">条件</div>
                    <select class="UMyChart_AlertSetting_Select js-value-type" name="value-type">
                        <option>价格</option>
                    </select>
                    <select class="UMyChart_AlertSetting_Select js-compare-type" name="compare-type">
                        <option value=${JSCHART_WARINGLINE_ID.CROSSING}>穿越</option>
                        <option value=${JSCHART_WARINGLINE_ID.CROSSING_UP}>上穿</option>
                        <option value=${JSCHART_WARINGLINE_ID.CROSSING_DOWN}>下穿</option>
                        <option value=${JSCHART_WARINGLINE_ID.GREATER_THAN}>大于</option>
                        <option value=${JSCHART_WARINGLINE_ID.LESS_THAN}>小于</option>
                        <!--
                        <option value=${JSCHART_WARINGLINE_ID.ENTERING_CHANNEL}>进入通道</option>
                        <option value=${JSCHART_WARINGLINE_ID.EXITING_CHANNEL}>离开通道</option>
                        <option value=${JSCHART_WARINGLINE_ID.INSIDE_CHANNEL}>在通道内</option>
                        <option value=${JSCHART_WARINGLINE_ID.OUTSIDE_CHANNEL}>在通道外</option>
                        -->
                        <option value=${JSCHART_WARINGLINE_ID.MOVING_UP}>上涨</option>
                        <option value=${JSCHART_WARINGLINE_ID.MOVING_DOWN}>下跌</option>
                        <option value=${JSCHART_WARINGLINE_ID.MOVING_UP_PERCENT}>涨幅超过百分比</option>
                        <option value=${JSCHART_WARINGLINE_ID.MOVING_DOWN_PERCENT}>跌幅超过百分比</option>
                    </select>
                </div>
                
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <div class="UMyChart_AlertSetting_Label"></div>
                    <select class="UMyChart_AlertSetting_Select js-value-type">
                        <option>数值</option>
                    </select>
                    <div class="UMyChart_AlertSetting_ValueInput_Wrap">
                        <input class="UMyChart_AlertSetting_Value_Input js-value" type="number" step="0.01"/>
                        <div class="UMyChart_AlertSetting_ValueBtn_Group">
                            <button class="UMyChart_AlertSetting_Value_Btn Up">▲</button>
                            <button class="UMyChart_AlertSetting_Value_Btn Down">▼</button>
                        </div>
                    </div>
                </div>
                <!--
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <div class="UMyChart_AlertSetting_Label">触发模式</div>
                    <select class="UMyChart_AlertSetting_Select js-trigger">
                        <option value="once">Only Once</option>
                        <option value="every">Every Time</option>
                    </select>
                </div>
                <div class="UMyChart_DrawTool_Advanced_Row">
                    <label class="UMyChart_AlertSetting_Label">有效期</label>
                    <select class="UMyChart_AlertSetting_Select js-expire">
                        <option>Open-ended alert</option>
                    </select>
                </div>
                -->
            </div>
            <div class="UMyChart_AlertSetting_Footer_Div">
                <button class="UMyChart_AlertSetting_Btn_Cancel js-cancel">取消</button>
                <button class="UMyChart_AlertSetting_Btn_Create js-modify">保存</button>
                <button class="UMyChart_AlertSetting_Btn_Create js-create">创建</button>
            </div>
        </div>`;

        return html;
    }

    BindControl()
    {
        //按钮
        this.ModifyButton=this.DivDialog.querySelector(".js-modify");
        this.CreateButton=this.DivDialog.querySelector(".js-create");

        this.DivDialog.querySelector(".js-close").onclick = ()=>{ this.Close(); };
        this.DivDialog.querySelector(".js-cancel").onclick = ()=>{ this.Cancel(); };
        this.ModifyButton.onclick = ()=>{ this.ModifyWarningLine(); };
        this.CreateButton.onclick = ()=>{ this.CreateWarningLine(); };


        
        this.IndexDOM=this.DivDialog.querySelector(".js-value-type");
        this.CompareTypeDOM=this.DivDialog.querySelector(".js-compare-type");
        this.NameInput=this.DivDialog.querySelector(".js-name");

        this.NameInput.addEventListener("change", ()=>
        { 
            this.ClearDelayTimer();
            var strName = String(this.NameInput.value);
            this.ModifyLineName(strName); 
        })

        this.NameInput.addEventListener('input', ()=>{ this.DelayModifyLineName();});
        this.CompareTypeDOM.addEventListener("change", (e)=>{ this.ModifyCompareType(e); })

        // 数值加减箭头
        this.ValueInput = this.DivDialog.querySelector(".js-value");

        const btnUp = this.DivDialog.querySelector(".UMyChart_AlertSetting_Value_Btn.Up");
        const btnDown = this.DivDialog.querySelector(".UMyChart_AlertSetting_Value_Btn.Down");
        const step = 0.01;
        btnUp.onclick = ()=>
        {
            let v = Number(this.ValueInput.value || 0);
            this.ValueInput.value = (v + step).toFixed(2);
            this.DelayModifyLineYValue();
        };

        btnDown.onclick = ()=>
        {
            let v = Number(this.ValueInput.value || 0);
            this.ValueInput.value = (v - step).toFixed(2);
            this.DelayModifyLineYValue()
        };

        this.ValueInput.addEventListener("change", ()=>
        { 
            this.ClearDelayTimer();
            var yValue = parseFloat(this.ValueInput.value);
            this.ModifyLineYValue(yValue); 
        })

        this.ValueInput.addEventListener('input', ()=>{ this.DelayModifyLineYValue();});
        this.ValueInput.addEventListener('wheel', (e) => 
        {
            e.preventDefault(); // 阻止页面滚动
            let v = Number(this.ValueInput.value || 0);
            
            if (e.deltaY < 0) v += step;    // 滚轮向上 +
            else v -= step;  //// 滚轮向下 -
            
            this.ValueInput.value = v.toFixed(2);
            this.DelayModifyLineYValue();
        });


        this.LineColorCtrl.BindControl(this.DivDialog);
        this.LineColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyLineColor(color); }
    }

    SetModifySetting(data)
    {
        this.Type=1;
        if (!data) return false;
        if (!data.Chart) return false;

        this.ChartPicture=data.Chart;
        this.DataBackUp={ Name:null, Condition:{ Compare:null,Index:null } };

        this.SetTitle(`修改预警线 [窗口序号:${this.ChartPicture.Frame.Identify}] [股票代码:${this.ChartPicture.Symbol}]`)
        this.SetLineColor(this.ChartPicture.LineColor);
        this.DataBackUp.LineColor=this.ChartPicture.LineColor;
        var dec=GetfloatPrecision(this.ChartPicture.Symbol);  //小数位数

        if (this.ChartPicture.Name) 
        {
            this.NameInput.value=this.ChartPicture.Name;
            this.DataBackUp.Name=this.ChartPicture.Name;
        }

        var cond=this.ChartPicture.ConditionConfig;
        if (cond.Compare)
        {
            var item=cond.Compare
            if (IFrameSplitOperator.IsNumber(item.Value)) this.ValueInput.value=item.Value.toFixed(dec);
            this.CompareTypeDOM.value=item.Type;
            this.DataBackUp.Condition.Compare=CloneData(item);
        }

        if (cond.Index)
        {
            var item=cond.Index;
            var name=`${item.Name}-${item.ValueName}`;
            var optionItem = new Option(name, 0);   //new Option(显示文本, value值)
            this.IndexDOM.append(optionItem);
            this.AryIndex.push(item);
            this.DataBackUp.Condition.Index=CloneData(item);
        }
       
        this.ModifyButton.style.display="";
    }

    SetCreateSetting(option)
    {
        this.Type=0;
        this.FrameID=option.FrameID;
        if (IFrameSplitOperator.IsNonEmptyArray(option.AryIndex)) this.AryIndex=option.AryIndex.slice();

        this.SetTitle(`新建预警线 [窗口序号:${option.FrameID}]  [股票代码:${option.Stock.Symbol}]`);

        var dec=GetfloatPrecision(option.Stock.Symbol);;  //小数位数

        for(var i=0;i<this.AryIndex.length;++i)
        {
            var item=this.AryIndex[i];
            var name=`${item.Name}-${item.ValueName}`;
            var optionItem = new Option(name, i);   //new Option(显示文本, value值)
            this.IndexDOM.append(optionItem);
        }

        if (option.Compare)
        {
            if (IFrameSplitOperator.IsNumber(option.Compare.Value)) this.ValueInput.value=option.Compare.Value.toFixed(dec);
        }

        var lineColor=g_JSChartResource.DrawPicture.LineColor[0];
        if (option.Color) lineColor=option.Color;
        
        this.SetLineColor(lineColor);

        this.CreateButton.style.display="";
    }

    Show(x, y, option)
    {
        if(!this.DivDialog) this.Create();

        this.IndexDOM.innerHTML="";
        this.AryIndex=[];
        this.ChartPicture=null;
        this.NameInput.value=null;
        this.ValueInput.value=null;
        this.CompareTypeDOM.value=JSCHART_WARINGLINE_ID.CROSSING;
        this.ModifyButton.style.display="none";
        this.CreateButton.style.display="none";
        

        if (option)
        {
            if (option.Type===1)
            {
                this.SetModifySetting(option);
            }
            else
            {
                this.SetCreateSetting(option);
            }
        }

        // 回填默认值
        if(option)
        {
            if(option.value !== undefined) this.DivDialog.querySelector(".js-value").value = option.value;
            if(option.trigger === "once") this.DivDialog.querySelector(".js-trigger").value = "once";
            else if(option.trigger === "every") this.DivDialog.querySelector(".js-trigger").value = "every";
        }

        this.DivDialog.style.visibility = "visible";
        this.DivDialog.style.left = (x || 300) + "px";
        this.DivDialog.style.top = (y || 150) + "px";
    }

    Close()
    {
        this.ClearDelayTimer();
        this.Hidden();
    }

    //创建预警线
    CreateWarningLine()
    {
        var value=Number(this.ValueInput.value);
        var id=Number(this.IndexDOM.value);
        var index=this.AryIndex[id];
        var compareType=Number(this.CompareTypeDOM.value);
        var color=this.LineColorCtrl.GetColor();
        var name=this.NameInput.value;
       
        //条件配置
        var condition=
        { 
            Index:index, 
            Compare:{ Type:compareType, Value:value }
        };   

        var drawPictrue=
        { 
            Name:name,
            ClassName:"ChartDrawWarningLine",    
            LineColor:color,             
            Value:[ { XValue:0, YValue:value, DeltaValue:null } ],    
            FrameID:this.FrameID,
            Condition:condition,
        };

        if (this.HQChart)
        {
            this.HQChart.AddChartDrawPicture(drawPictrue, { Save:true });
            this.HQChart.Draw();
        }

        this.Close();
    }

    //修改预警线
    ModifyWarningLine()
    {
        this.Save();
        this.Close();
    }

    Cancel()
    {
        if (this.Type===1 && this.ChartPicture && this.DataBackUp) //还原
        {
            this.ChartPicture.Name=this.DataBackUp.Name;
            this.ChartPicture.LineColor=this.DataBackUp.LineColor;
            this.ChartPicture.ConditionConfig.Compare=this.DataBackUp.Condition.Compare;
            this.ChartPicture.ConditionConfig.Index=this.DataBackUp.Condition.Index;
            this.ChartPicture.Value[0].YValue=this.DataBackUp.Condition.Compare.Value;
            this.ChartPicture.ValueToPoint(); 

            this.HQChart.Draw();
        }

        this.Close();
    }

    GetColorName(color)
    {
        if (IChartDrawPicture.IsHexColor(color)) return color;
        
        return IChartDrawPicture.RGBToHex(color);
    }

    SetLineColor(color)
    {
        this.LineColorCtrl.SetColor(color);
    }

    ModifyLineColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);

        this.ChartPicture.LineColor=color;
        this.HQChart.DrawDynamicInfo();
    }

    ModifyLineYValue(yValue)
    {
        if (!IFrameSplitOperator.IsNumber(yValue)) return;
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (this.ChartPicture.Value[0]===yValue) return;

        this.ChartPicture.Value[0].YValue=yValue;
        this.ChartPicture.ValueToPoint(); 
        this.HQChart.Draw();
    }

    DelayModifyLineYValue()
    {
        this.ClearDelayTimer();
        this.InputDelay.Timer = setTimeout(() => 
        {
            var yValue = Number(this.ValueInput.value);
            this.ModifyLineYValue(yValue);
        }, this.InputDelay.Delay);
    }

    ModifyLineName(name)
    {
        if (IFrameSplitOperator.IsString(name)) this.ChartPicture.Name=name;
        else this.ChartPicture.Name=null;
    }

    DelayModifyLineName()
    {
        clearTimeout(this.InputDelay.Timer);
        this.InputDelay.Timer = setTimeout(() => 
        {
            var strName = String(this.NameInput.value);
            this.ModifyLineName(strName);
        }, this.InputDelay.Delay);
    }

   

    ModifyCompareType(e)
    {
        const value = Number(e.target.value);   
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        this.ChartPicture.ConditionConfig.Compare.Type=value;
    }
}

////////////////////////////////////////////////////////////////////////
// 文本设置
// ChartDrawPictureText, ChartDrawAnchoredText, ChartDrawNote
//
///////////////////////////////////////////////////////////////////////
class JSDialogTextSetting extends IJSDialogAdvancedSetting
{
    static CLASS_NAME="JSDialogTextSetting";

    static CHART_ATTRIBUTE=new Map
    ([
        ["ChartDrawPriceNote", { ClassName:"ChartDrawPriceNote", Attr:{ Font:true, Text:false, TextColor:true, LineColor:true, BGColor:true, BorderColor:true, IconColor:false }} ],
        ["ChartDrawPriceLabel", { ClassName:"ChartDrawPriceLabel", Attr:{ Font:true, Text:false, TextColor:true, LineColor:false, BGColor:true, BorderColor:true, IconColor:false }} ],
        ["ChartDrawPictureText", { ClassName:"ChartDrawPictureText", Attr:{ Font:true, Text:true, TextColor:true, LineColor:false, BGColor:false, BorderColor:false, IconColor:false }} ],
        ["ChartDrawAnchoredText", { ClassName:"ChartDrawAnchoredText", Attr:{ Font:true, Text:true, TextColor:true, LineColor:false, BGColor:true, BorderColor:true, IconColor:false }} ],
        ["ChartDrawNote", { ClassName:"ChartDrawNote", Attr:{ Font:true, Text:true, TextColor:true, LineColor:false, BGColor:true, BorderColor:true, IconColor:true }} ],
    ]);

    constructor()
    {
        super();

        this.ClassName=JSDialogTextSetting.CLASS_NAME;

        //tab
        this.TabControl=new TabControl(
        {
            CSSSelector:
            {
                TabDOMList: ".js-tab",
                TabPanelDOMList: ".js-tab-panel"
            }
        });

        //文字颜色
        this.TextColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-text-color-picker",
                ColorButton:".js-text-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                AlphaPicker:".js-text-alpha-picker",
                AlphaTextDOM:".js-text-alpha-text"
            }
        });

        //背景色
        this.BGColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-bg-color-picker",
                ColorButton:".js-bg-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                Checkbox:".js-has-bg",
                AlphaPicker:".js-bg-alpha-picker",
                AlphaTextDOM:".js-bg-alpha-text"
            }
        });
        this.BGColorRowDOM=null;

        //边框色
        this.BorderColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-border-color-picker",
                ColorButton:".js-border-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                Checkbox:".js-has-border",
                AlphaPicker:".js-border-alpha-picker",
                AlphaTextDOM:".js-border-alpha-text"
            }
        });
        this.BorderColorRowDOM=null;

        this.TextInput=null;
        this.TextRowDOM=null;

        //字体设置
        this.FontCtrl=new FontControl(
        {
            CSSSelector:
            {
                FontFamily: ".js-font-family",
                FontSize: ".js-font-size",
                BoldBtn: ".js-bold",
                ItalicBtn: ".js-italic"
            }
        })

        //图标
        this.IconColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-icon-color-picker",
                ColorButton:".js-icon-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
            }
        });

        this.IconSizeSelect = null;
        this.IconRowDOM=null;

        this.LineColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-line-color-picker",
                ColorButton:".js-line-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                AlphaPicker:".js-line-alpha-picker",
                AlphaTextDOM:".js-line-alpha-text"
            }
        });
        this.LineRowDOM=null;

        //坐标
        this.AryPointCtrl=
        [
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 0 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 1 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 2 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 3 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 4 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 5 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
        ];


        this.ChartInfoCtrl=new ChartPictureInfoControl(
        {
            CSSSelector: 
            {
                StockNameDOM: ".js-info-stock",
                PeriodDOM: ".js-info-period",
                ClassNameDOM: ".js-info-name",
                WindowDOM: ".js-info-window"
            }
        });
    }

    GetTemplateHtml()
    {
        // 这里只放通达信风格面板html（你要的：只要tab下面内容，通达信灰白传统样式）
        return `
           <div class="UMyChart_TextSetting_Dialog_Div">
                <div class="UMyChart_DrawTool_Advanced_Title_Div js-title">
                    <span class="UMyChart_DrawTool_Advanced_Name_Div js-title-name">文字设置</span>
                    <span class="UMyChart_DrawTool_Advanced_Close_Div js-close">×</span>
                </div>
                <!-- Tab 栏 -->
                <div class="UMyChart_DrawTool_Tab_Bar">
                    <div class="UMyChart_DrawTool_Tab js-tab active" data-tab="style">样式</div>
                    <div class="UMyChart_DrawTool_Tab js-tab" data-tab="point">坐标</div>
                    <div class="UMyChart_DrawTool_Tab js-tab" data-tab="info">信息</div>
                </div>

                <div class="UMyChart_DrawTool_Advanced_Content_Wrap">
                    <!-- Tab1：风格 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel active" data-tab="style">
                        <!-- 颜色 + 字号 + 粗斜 -->
                        <div class="UMyChart_DrawTool_Advanced_Row">
                            <div class="UMyChart_AlertSetting_Label">文字颜色</div>
                            <div class="UMyChart_AlertSetting_Color_Wrap">
                                <input type="color" class="UMyChart_AlertSetting_Color_Picker js-text-color-picker" value="#000000"/>
                                <button type="button" class="UMyChart_AlertSetting_Color_Btn js-text-color" title="选择文字颜色">
                                    <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                    <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                </button>

                                <!-- 透明度滑块 + 文字 -->
                                <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                <span class="UMyChart_DrawTool_Alpha_Text js-text-alpha-text">30%</span>
                                <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-text-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row">
                            <div class="UMyChart_AlertSetting_Label">字体</div>
                            <!-- 新增字体下拉框 -->
                            <select class="UMyChart_AlertSetting_Select js-font-family">
                                <option value="Microsoft YaHei">微软雅黑</option>
                                <option value="SimSun">宋体</option>
                                <option value="SimHei">黑体</option>
                                <option value="KaiTi">楷体</option>
                                <option value="Arial">Arial</option>
                                <option value="Courier New">Courier New</option>
                            </select>
                            <select class="UMyChart_DrawTool_Advanced_FontSize_Select js-font-size">
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14" selected>14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                                <option value="20">20</option>
                                <option value="22">22</option>
                                <option value="24">24</option>
                                <option value="26">26</option>
                                <option value="28">28</option>
                                <option value="30">30</option>
                            </select>
                            <div class="UMyChart_AlertSetting_StyleBtn_Wrap">
                                <button class="UMyChart_TextSetting_StyleBtn js-bold">B</button>
                                <button class="UMyChart_TextSetting_StyleBtn js-italic">I</button>
                            </div>
                        </div>

                        <!-- 文本输入框 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-text-row">
                            <div class="UMyChart_AlertSetting_Label">文本</div>
                            <textarea class="UMyChart_TextSetting_Textarea js-text-content" placeholder="输入文字"></textarea>
                        </div>

                        <!-- 背景 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-bg-row">
                            <div class="UMyChart_AlertSetting_Label">背景颜色</div>
                            <label class="UMyChart_TextSetting_CheckLabel">
                                <input type="checkbox" class="js-has-bg"> 开启
                            </label>
                            <div class="UMyChart_AlertSetting_Color_Wrap">
                                <input type="color" class="UMyChart_AlertSetting_Color_Picker js-bg-color-picker" value="#ffffff"/>
                                <button type="button" class="UMyChart_AlertSetting_Color_Btn js-bg-color" title="选择背景颜色">
                                    <span class="UMyChart_AlertSetting_Color_Preview" style="background:#ffffff;"></span>
                                    <span class="UMyChart_AlertSetting_Color_Text">白色</span>
                                </button>
                                <!-- 透明度滑块 + 文字 -->
                                <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                <span class="UMyChart_DrawTool_Alpha_Text js-bg-alpha-text">30%</span>
                                <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-bg-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                            </div>
                        </div>
                        <!-- 边框 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-border-row">
                            <div class="UMyChart_AlertSetting_Label">边框颜色</div>
                            <label class="UMyChart_TextSetting_CheckLabel">
                                <input type="checkbox" class="js-has-border"> 开启
                            </label>
                            <div class="UMyChart_AlertSetting_Color_Wrap">
                                <input type="color" class="UMyChart_AlertSetting_Color_Picker js-border-color-picker" value="#000000"/>
                                <button type="button" class="UMyChart_AlertSetting_Color_Btn js-border-color" title="选择边框颜色">
                                    <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                    <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                </button>
                                <!-- 透明度滑块 + 数值 -->
                                <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                <span class="UMyChart_DrawTool_Alpha_Text js-border-alpha-text">30%</span>
                                <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-border-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                            </div>
                        </div>

                        <!-- 图标 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-icon-row">
                            <div class="UMyChart_AlertSetting_Label">图标</div>
                            <div class="UMyChart_TextSetting_IconSize_Wrap">
                                <div class="UMyChart_AlertSetting_Color_Wrap">
                                    <input type="color" class="UMyChart_AlertSetting_Color_Picker js-icon-color-picker" value="#000000"/>
                                    <button type="button" class="UMyChart_AlertSetting_Color_Btn js-icon-color" title="选择图标颜色">
                                        <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                        <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                    </button>
                                </div>
                                <!-- 新增：图标大小下拉 -->
                                <select class="UMyChart_DrawTool_Advanced_FontSize_Select js-icon-size" style="margin-left:8px;">
                                    <option value="22">22</option>
                                    <option value="26">26</option>
                                    <option value="32">32</option>
                                    <option value="34">34</option>
                                    <option value="36">36</option>
                                    <option value="38">38</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                        </div>

                        <!-- 线段设置 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-line-row">
                            <div class="UMyChart_AlertSetting_Label">线段颜色</div>
                            <div class="UMyChart_TextSetting_Line_Wrap">
                                <div class="UMyChart_AlertSetting_Color_Wrap">
                                    <input type="color" class="UMyChart_AlertSetting_Color_Picker js-line-color-picker" value="#000000"/>
                                    <button type="button" class="UMyChart_AlertSetting_Color_Btn js-line-color" title="选择线段颜色">
                                        <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                        <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                    </button>
                                    <!-- 透明度滑块 + 数值 -->
                                    <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                    <span class="UMyChart_DrawTool_Alpha_Text js-line-alpha-text">30%</span>
                                    <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-line-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                                </div>
                                <!--
                                <select class="UMyChart_DrawTool_Advanced_FontSize_Select js-line-width">
                                    <option value="1">1</option>
                                    <option value="2" selected>2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="8">8</option>
                                </select>
                                <select class="UMyChart_AlertSetting_Select js-line-style">
                                    <option value="solid">实线</option>
                                    <option value="dashed">虚线</option>
                                    <option value="dotted">点线</option>
                                    <option value="dashdot">点划线</option>
                                </select>
                                -->
                            </div>
                        </div>
                    </div>

                    <!-- Tab2：坐标 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel" data-tab="point">
                        <!-- 定位点0 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="0">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#1</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点1 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="1">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#2</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点2 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="2">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#3</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点3 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="3">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#4</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点4 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="4">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#5</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点5 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="5">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#6</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tab3：信息 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel" data-tab="info">
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">股票</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-stock"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">周期</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-period"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">名称</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-name"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">窗口序号</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-window"></span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="UMyChart_AlertSetting_Footer_Div">
                    <button class="UMyChart_AlertSetting_Btn_Cancel js-cancel">取消</button>
                    <button class="UMyChart_AlertSetting_Btn_Create js-ok">确定</button>
                </div>
            </div>
         </div>
        `;
    }

    BindControl()
    {
        this.TabControl.BindControl(this.DivDialog);

        this.TextColorCtrl.BindControl(this.DivDialog);
        this.TextColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyTextColor(color); }

        this.BGColorCtrl.BindControl(this.DivDialog);
        this.BGColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyBGColor(color); }
        this.BGColorRowDOM=this.DivDialog.querySelector(".js-bg-row");

        this.BorderColorCtrl.BindControl(this.DivDialog);
        this.BorderColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyBorderColor(color); }
        this.BorderColorRowDOM=this.DivDialog.querySelector(".js-border-row");

        this.IconColorCtrl.BindControl(this.DivDialog);
        this.IconColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyIconColor(color); }
        this.IconSizeSelect=this.DivDialog.querySelector(".js-icon-size");
        this.IconSizeSelect.onchange=()=>{ var size=Number(this.IconSizeSelect.value); this.ModifyIconSize(size); }
        this.IconRowDOM=this.DivDialog.querySelector(".js-icon-row");

        this.FontCtrl.BindControl(this.DivDialog);
        this.FontCtrl.OnFontChangeCallback=(font)=>{ this.ModifyTextFont(font); }

        this.OkButton=this.DivDialog.querySelector(".js-ok");
        this.OkButton.onclick = ()=>{ this.Ok(); };

        this.TextInput=this.DivDialog.querySelector(".js-text-content");
        this.TextRowDOM=this.DivDialog.querySelector(".js-text-row");

        this.TextInput.addEventListener("change", ()=>
        { 
            this.ClearDelayTimer();
            var text = this.TextInput.value;
            this.ModifyText(text); 
        })

        this.TextInput.addEventListener('input', ()=>{ this.DelayModifyText();});


        this.LineColorCtrl.BindControl(this.DivDialog);
        this.LineColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyLineColor(color); };
        this.LineRowDOM=this.DivDialog.querySelector(".js-line-row");

        this.AryPointCtrl.forEach((item)=>
        {
            item.BindControl(this.DivDialog);
            item.OnPointChangeCallback=(data)=>{ this.DelayModifyPointValue(data); }
            item.GetKItemCallback=(data)=>{ return this.GetKItem(data); }
        });

        this.ChartInfoCtrl.BindControl(this.DivDialog);

        this.DivDialog.querySelector(".js-close").onclick = ()=>{ this.Close(); };
        this.DivDialog.querySelector(".js-cancel").onclick = ()=>{ this.Cancel(); };
    }

    Show(x, y, option)
    {
        if(!this.DivDialog) this.Create();

        this.ChartPicture=null;
        this.TextInput.value="";
        this.DataBackUp=null;
        this.AryPointCtrl.forEach((item)=>{ item.Reset();});
        
        if (option)
        {
            if (option.Type===1) this.SetModifySetting(option);
            else return;
        }

        this.DivDialog.style.visibility = "visible";
        this.DivDialog.style.left = (x || 300) + "px";
        this.DivDialog.style.top = (y || 150) + "px";
    }

    GetKItem(index)
    {
        if (!IFrameSplitOperator.IsNumber(index) || index<0) return null;
        if (!this.HQChart) return null;

        var kData=this.HQChart.GetKData();
        if (!kData || !IFrameSplitOperator.IsNonEmptyArray(kData.Data)) return datetime;

        var kItem=kData.Data[index];

        return kItem;
    }

    ModifyLineColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);
        
        DrawToolHelper.SetLineColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true});
    }

    ModifyIconColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color); 

        this.ChartPicture.LineColor=color;
        this.HQChart.DrawDynamicInfo();
    }

    ModifyTextColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        DrawToolHelper.SetTextColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true } );
    }

    ModifyBGColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);

        DrawToolHelper.SetBGColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true});
        
        this.HQChart.DrawDynamicInfo();
    }

    ModifyBorderColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);

        DrawToolHelper.SetBorderColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true });
    }

    DelayModifyText()
    {
        this.ClearDelayTimer();
        this.InputDelay.Timer = setTimeout(() => 
        {
            var text=this.TextInput.value;
            this.ModifyText(text);
        }, this.InputDelay.Delay);
    }

    ModifyText(text)
    {
        if (!IFrameSplitOperator.IsString(text)) return;
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        DrawToolHelper.SetText(this.ChartPicture, text, { HQChart:this.HQChart, DrawDynamicInfo:true });
    }

    ModifyTextFont(font)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        if (["ChartDrawPictureText","ChartDrawAnchoredText","ChartDrawPriceLabel"].includes(this.ChartPicture.ClassName))
        {
            this.ChartPicture.FontOption.Family=font.FontFamily;
            this.ChartPicture.FontOption.Size=font.FontSize;
            this.ChartPicture.FontOption.Weight=font.IsBold?"bold":null;
            this.ChartPicture.FontOption.Style=font.IsItalic?"italic":null;
        }
        else if (this.ChartPicture.ClassName=="ChartDrawNote")
        {
            this.ChartPicture.NoteFontOption.Family=font.FontFamily;
            this.ChartPicture.NoteFontOption.Size=font.FontSize;
            this.ChartPicture.NoteFontOption.Weight=font.IsBold?"bold":null;
            this.ChartPicture.NoteFontOption.Style=font.IsItalic?"italic":null;
        }
        else
        {
            if (this.ChartPicture.Font==font.Text) return;
            this.ChartPicture.Font=font.Text;
        }
        
        this.HQChart.DrawDynamicInfo();
    }

    ModifyIconSize(size)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (this.ChartPicture.FontOption.Size==size) return;

        this.ChartPicture.FontOption.Size=size;
        this.HQChart.DrawDynamicInfo();
    }

    ModifyPointValue(data)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        var index=data.Index;
        var yValue=data.YValue;
        var xValue=data.XValue;
        if (!IFrameSplitOperator.IsNumber(yValue) || !IFrameSplitOperator.IsNumber(xValue)) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.ChartPicture.Value)) return;
        if (index<0 || index>=this.ChartPicture.Value.length) return;

        var item=this.ChartPicture.Value[index];
        item.YValue=yValue;
        item.XValue=xValue;
        this.ChartPicture.ValueToPoint(); 
        this.HQChart.Draw();
    }

    DelayModifyPointValue(data)
    {
        this.ClearDelayTimer();
        this.InputDelay.Timer = setTimeout(() => 
        {
            this.ModifyPointValue(data);
        }, this.InputDelay.Delay);
    }

    SetModifySetting(data)
    {
        this.Type=1;
        if (!data) return false;
        if (!data.Chart) return false;

        this.ChartPicture=data.Chart;
        this.DataBackUp={ Name:null };

        var title="文字";
        if (IFrameSplitOperator.IsString(this.ChartPicture.Description)) title=this.ChartPicture.Description;

        this.SetTitle(`${title} - 高级设置`);

        if (!JSDialogTextSetting.CHART_ATTRIBUTE.has(this.ChartPicture.ClassName)) return false;

        var finder=JSDialogTextSetting.CHART_ATTRIBUTE.get(this.ChartPicture.ClassName);
        var config=finder.Attr;

        if (config.Font===true) //字体
        {
            var font=DrawToolHelper.GetTextFont(this.ChartPicture);
            this.FontCtrl.SetFont(font);
            this.DataBackUp.Font=font;
        }
       
        if (config.TextColor===true)    //文字颜色
        {
            var color=DrawToolHelper.GetTextColor(this.ChartPicture);
            this.TextColorCtrl.SetColor(color);
            this.DataBackUp.TextColor=color;
        }

        if (config.Text===true) //文本内容
        {
            var content=DrawToolHelper.GetText(this.ChartPicture);
            this.TextInput.value=content.Text;
            this.DataBackUp.Text=content.Source;
            this.TextRowDOM.style.display=null;  
        }
        else
        {
            this.TextRowDOM.style.display="none";
        }
       
        if (config.BGColor===true)  //文字背景色
        {
            var color=DrawToolHelper.GetBGColor(this.ChartPicture);
            this.BGColorCtrl.SetColor(color);
            this.DataBackUp.BGColor=color;
            this.BGColorRowDOM.style.display=null;
        }
        else
        {
            this.BGColorRowDOM.style.display="none";
        }

        if (config.BorderColor===true)  //边框颜色
        {
            var color=DrawToolHelper.GetBorderColor(this.ChartPicture);
            this.BorderColorCtrl.SetColor(color);
            this.DataBackUp.BorderColor=color;
            this.BorderColorRowDOM.style.display=null;
        }
        else
        {
            this.BorderColorRowDOM.style.display="none";
        }

        if (config.LineColor===true)    //线段颜色
        {
            var color=DrawToolHelper.GetLineColor(this.ChartPicture);
            this.LineColorCtrl.SetColor(color);
            this.DataBackUp.LineColor=color;  
            this.LineRowDOM.style.display=null;  //线段
        }
        else
        {
            this.LineRowDOM.style.display='none';
        }

        if (config.IconColor===true)
        {
            this.IconColorCtrl.SetColor(this.ChartPicture.LineColor);       //图标
            this.IconSizeSelect.value=this.ChartPicture.FontOption.Size;    //图标大小
            this.DataBackUp.Icon={ Color:this.ChartPicture.LineColor, Size:this.ChartPicture.FontOption.Size };
            this.IconRowDOM.style.display=null;  //图标
        }
        else
        {
            this.IconRowDOM.style.display="none";
        }

        //点
        var aryValue=this.ChartPicture.Value;
        var count=Math.min(aryValue.length, this.AryPointCtrl.length);
        for(var i=0; i<count; ++i)
        {
            var item=aryValue[i];
            var ptCtrl=this.AryPointCtrl[i];
            ptCtrl.SetChartInfo({ ClassName:this.ChartPicture.ClassName, Period:this.HQChart.Period} );
            ptCtrl.SetYValue(item.YValue);
            ptCtrl.SetXValue(item.XValue);
            ptCtrl.ShowRow(true);
        }

        for(var i=count;i<this.AryPointCtrl.length;++i)
        {
            var ptCtrl=this.AryPointCtrl[i];
            ptCtrl.ShowRow(false);
        }
        this.DataBackUp.Value=CloneData(this.ChartPicture.Value);

        this.ChartInfoCtrl.SetChartPicture(this.ChartPicture);
    }

    Close()
    {
        this.ClearDelayTimer();
        this.Hidden();
    }

    Cancel()
    {
        this.ClearDelayTimer();

        if (this.Type===1 && this.ChartPicture && this.DataBackUp) //还原
        {
            if (JSDialogTextSetting.CHART_ATTRIBUTE.has(this.ChartPicture.ClassName))
            {
                var finder=JSDialogTextSetting.CHART_ATTRIBUTE.get(this.ChartPicture.ClassName);
                var config=finder.Attr;

                if (config.Font===true) //字体
                    DrawToolHelper.SetTextFont(this.ChartPicture,this.DataBackUp.Font);
       
                if (config.TextColor===true)    //文字颜色
                    DrawToolHelper.SetTextColor(this.ChartPicture,this.DataBackUp.TextColor);

                if (config.Text===true) //文本内容
                    DrawToolHelper.SetText(this.ChartPicture,this.DataBackUp.Text);
        
                if (config.BGColor===true)  //文字背景色
                    DrawToolHelper.SetBGColor(this.ChartPicture,this.DataBackUp.BGColor);

                if (config.BorderColor===true)  //边框颜色
                    DrawToolHelper.SetBorderColor(this.ChartPicture, this.DataBackUp.BorderColor);
              
                if (config.LineColor===true)    //线段颜色
                    DrawToolHelper.SetLineColor(this.ChartPicture,this.DataBackUp.LineColor);
            

                if (config.IconColor===true)
                {
                    this.ChartPicture.LineColor=this.DataBackUp.Icon.Color;
                    this.ChartPicture.FontOption.Size=this.DataBackUp.Icon.Size;
                }

                this.ChartPicture.Value=this.DataBackUp.Value;

                this.HQChart.Draw();
            }
        }

        this.DataBackUp=null;
        this.Close();
    }

    Ok()
    {
        this.Save();
        this.Close();
    }
}


class JSDialogLineSetting extends IJSDialogAdvancedSetting
{
    static CLASS_NAME="JSDialogLineSetting";
    
    static CHART_ATTRIBUTE=new Map
    ([
        ["ChartDrawPictureLine", { ClassName:"ChartDrawPictureLine", Attr:{ LineColor:true, LineWidth:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureHaflLine", { ClassName:"ChartDrawPictureHaflLine", Attr:{ LineColor:true, LineWidth:true,BGColor:false, BorderColor:false }} ],
        ["ChartDrawArrowLine", { ClassName:"ChartDrawArrowLine", Attr:{ LineColor:true, BGColor:false, LineWidth:true,BorderColor:false }} ],
        ["ChartDrawPictureHorizontalLine", { ClassName:"ChartDrawPictureHorizontalLine", Attr:{ LineColor:true, LineWidth:true,BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureHorizontalRay", { ClassName:"ChartDrawPictureHorizontalRay", Attr:{ LineColor:true, LineWidth:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureTrendLine", { ClassName:"ChartDrawPictureTrendLine", Attr:{ LineColor:true, LineWidth:true, BGColor:false, BorderColor:false }} ],

        ["ChartDrawPictureRect", { ClassName:"ChartDrawPictureRect", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureArc", { ClassName:"ChartDrawPictureArc", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureWaveMW", { ClassName:"ChartDrawPictureWaveMW", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawHeadShouldersBT", { ClassName:"ChartDrawHeadShouldersBT", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureParallelLines", { ClassName:"ChartDrawPictureParallelLines", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPicturePriceChannel", { ClassName:"ChartDrawPicturePriceChannel", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawParallelRaysLines", { ClassName:"ChartDrawParallelRaysLines", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureGannFan", { ClassName:"ChartDrawPictureGannFan", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureGannFanV2", { ClassName:"ChartDrawPictureGannFanV2", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureResistanceLine", { ClassName:"ChartDrawPictureResistanceLine", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        ["ChartDrawPictureResistanceLineV2", { ClassName:"ChartDrawPictureResistanceLineV2", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],


        //TODO:第3个点是通过宽度算出来的
        ["ChartDrawPictureParallelChannel", { ClassName:"ChartDrawPictureParallelChannel", Attr:{ LineColor:true, BGColor:false, BorderColor:false }} ],
        
    ]);
   
    constructor()
    {
        super();

        this.ClassName=JSDialogTextSetting.CLASS_NAME;

        //tab
        this.TabControl=new TabControl(
        {
            CSSSelector:
            {
                TabDOMList: ".js-tab",
                TabPanelDOMList: ".js-tab-panel"
            }
        });

        
        //背景色
        this.BGColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-bg-color-picker",
                ColorButton:".js-bg-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                Checkbox:".js-has-bg",
                AlphaPicker:".js-bg-alpha-picker",
                AlphaTextDOM:".js-bg-alpha-text"
            }
        });
        this.BGColorRowDOM=null;

        //边框色
        this.BorderColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-border-color-picker",
                ColorButton:".js-border-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                Checkbox:".js-has-border",
                AlphaPicker:".js-border-alpha-picker",
                AlphaTextDOM:".js-border-alpha-text"
            }
        });
        this.BorderColorRowDOM=null;

        this.LineColorCtrl=new ColorControl(
        {
            CSSSelector:
            {
                ColorPicker:".js-line-color-picker",
                ColorButton:".js-line-color",
                ColorPreviewDOM:".UMyChart_AlertSetting_Color_Preview",
                ColorTextDOM:".UMyChart_AlertSetting_Color_Text",
                AlphaPicker:".js-line-alpha-picker",
                AlphaTextDOM:".js-line-alpha-text"
            }
        });
        this.LineRowDOM=null;

        //坐标
        this.AryPointCtrl=
        [
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 0 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 1 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 2 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 3 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 4 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
            new PointControl(
            {
                CSSSelector: 
                {
                    RowDOM: { CSS: ".js-point-row", DataIndex: 5 },
                    ValueInput: ".js-point-y",
                    XInput: ".js-point-x",
                    DateDOM:".js-point-date",
                    TimeDOM:".js-point-time"
                }
            }),
        ];

        //线段宽
        this.LineWidthSelect = null;
        this.LineStyleRowDOM=null;


        this.ChartInfoCtrl=new ChartPictureInfoControl(
        {
            CSSSelector: 
            {
                StockNameDOM: ".js-info-stock",
                PeriodDOM: ".js-info-period",
                ClassNameDOM: ".js-info-name",
                WindowDOM: ".js-info-window"
            }
        });
    }

    GetTemplateHtml()
    {
        // 这里只放通达信风格面板html（你要的：只要tab下面内容，通达信灰白传统样式）
        return `
           <div class="UMyChart_TextSetting_Dialog_Div">
                <div class="UMyChart_DrawTool_Advanced_Title_Div js-title">
                    <span class="UMyChart_DrawTool_Advanced_Name_Div js-title-name">文字设置</span>
                    <span class="UMyChart_DrawTool_Advanced_Close_Div js-close">×</span>
                </div>
                <!-- Tab 栏 -->
                <div class="UMyChart_DrawTool_Tab_Bar">
                    <div class="UMyChart_DrawTool_Tab js-tab active" data-tab="style">样式</div>
                    <div class="UMyChart_DrawTool_Tab js-tab" data-tab="point">坐标</div>
                    <div class="UMyChart_DrawTool_Tab js-tab" data-tab="info">信息</div>
                </div>

                <div class="UMyChart_DrawTool_Advanced_Content_Wrap">
                    <!-- Tab1：风格 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel active" data-tab="style">
                        <!-- 线段设置 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-line-row">
                            <div class="UMyChart_AlertSetting_Label">线段颜色</div>
                            <div class="UMyChart_TextSetting_Line_Wrap">
                                <div class="UMyChart_AlertSetting_Color_Wrap">
                                    <input type="color" class="UMyChart_AlertSetting_Color_Picker js-line-color-picker" value="#000000"/>
                                    <button type="button" class="UMyChart_AlertSetting_Color_Btn js-line-color" title="选择线段颜色">
                                        <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                        <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                    </button>
                                    <!-- 透明度滑块 + 数值 -->
                                    <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                    <span class="UMyChart_DrawTool_Alpha_Text js-line-alpha-text">30%</span>
                                    <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-line-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                                </div>
                                <!--
                                <select class="UMyChart_DrawTool_Advanced_FontSize_Select js-line-width">
                                    <option value="1">1</option>
                                    <option value="2" selected>2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="8">8</option>
                                </select>
                                <select class="UMyChart_AlertSetting_Select js-line-style">
                                    <option value="solid">实线</option>
                                    <option value="dashed">虚线</option>
                                    <option value="dotted">点线</option>
                                    <option value="dashdot">点划线</option>
                                </select>
                                -->
                            </div>
                        </div>

                        <!-- 线段宽度 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-line2-row">
                            <div class="UMyChart_AlertSetting_Label">线段宽度</div>
                            <select class="UMyChart_DrawTool_Advanced_FontSize_Select js-line-width">
                                <option value="1">1.0</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2.0</option>
                                <option value="2.5">2.5</option>
                                <option value="3">3.0</option>
                                <option value="3.5">3.5</option>
                                <option value="4">4.0</option>
                                <option value="4.4">4.4</option>
                                <option value="5">5.0</option>
                                <option value="5.5">5.5</option>
                                <option value="6">6.0</option>
                                <option value="6.5">6.5</option>
                            </select>
                        </div>
                        

                        <!-- 背景 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-bg-row">
                            <div class="UMyChart_AlertSetting_Label">背景颜色</div>
                            <label class="UMyChart_TextSetting_CheckLabel">
                                <input type="checkbox" class="js-has-bg"> 开启
                            </label>
                            <div class="UMyChart_AlertSetting_Color_Wrap">
                                <input type="color" class="UMyChart_AlertSetting_Color_Picker js-bg-color-picker" value="#ffffff"/>
                                <button type="button" class="UMyChart_AlertSetting_Color_Btn js-bg-color" title="选择背景颜色">
                                    <span class="UMyChart_AlertSetting_Color_Preview" style="background:#ffffff;"></span>
                                    <span class="UMyChart_AlertSetting_Color_Text">白色</span>
                                </button>
                                <!-- 透明度滑块 + 文字 -->
                                <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                <span class="UMyChart_DrawTool_Alpha_Text js-bg-alpha-text">30%</span>
                                <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-bg-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                            </div>
                        </div>

                        <!-- 边框 -->
                        <div class="UMyChart_DrawTool_Advanced_Row js-border-row">
                            <div class="UMyChart_AlertSetting_Label">边框颜色</div>
                            <label class="UMyChart_TextSetting_CheckLabel">
                                <input type="checkbox" class="js-has-border"> 开启
                            </label>
                            <div class="UMyChart_AlertSetting_Color_Wrap">
                                <input type="color" class="UMyChart_AlertSetting_Color_Picker js-border-color-picker" value="#000000"/>
                                <button type="button" class="UMyChart_AlertSetting_Color_Btn js-border-color" title="选择边框颜色">
                                    <span class="UMyChart_AlertSetting_Color_Preview" style="background:#000000;"></span>
                                    <span class="UMyChart_AlertSetting_Color_Text">黑色</span>
                                </button>
                                <!-- 透明度滑块 + 数值 -->
                                <span class="UMyChart_DrawTool_Alpha_Label">透明度</span>
                                <span class="UMyChart_DrawTool_Alpha_Text js-border-alpha-text">30%</span>
                                <input type="range" class="UMyChart_DrawTool_Alpha_Picker js-border-alpha-picker" min="0" max="1" step="0.01" value="0.3">
                            </div>
                        </div>
                    </div>

                    <!-- Tab2：坐标 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel" data-tab="point">
                        <!-- 定位点0 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="0">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#1</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点1 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="1">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#2</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点2 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="2">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#3</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点3 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="3">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#4</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点4 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="4">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#5</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                        <!-- 定位点5 -->
                        <div class="UMyChart_DrawTool_Advanced_Row point-item-row js-point-row" data-index="5">
                            <div class="UMyChart_DrawTool_Point-Col point-col-name">#6</div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-value">
                                <span>Y:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_Y_Input js-point-y" value="6.03" step="0.01">
                            </div>
                            <div class="UMyChart_DrawTool_Point-Col point-col-time">
                                <span>X:</span>
                                <input type="number" class="UMyChart_DrawTool_Point_X_Input js-point-x" value="6" step="1">
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-date">2026-06-04</span>
                                <span class="UMyChart_DrawTool_Point_X_DateTime js-point-time">00:00:00</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tab3：信息 -->
                    <div class="UMyChart_DrawTool_TabPanel js-tab-panel" data-tab="info">
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">股票</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-stock"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">周期</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-period"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">名称</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-name"></span>
                            </div>
                        </div>
                        <div class="UMyChart_DrawTool_Advanced_Row js-info-row">
                            <div class="UMyChart_AlertSetting_Label">窗口序号</div>
                            <div>
                                <span class="UMyChart_AlertSetting_Text js-info-window"></span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="UMyChart_AlertSetting_Footer_Div">
                    <button class="UMyChart_AlertSetting_Btn_Cancel js-cancel">取消</button>
                    <button class="UMyChart_AlertSetting_Btn_Create js-ok">确定</button>
                </div>
            </div>
         </div>
        `;
    }

    BindControl()
    {
        this.TabControl.BindControl(this.DivDialog);

        this.BGColorCtrl.BindControl(this.DivDialog);
        this.BGColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyBGColor(color); }
        this.BGColorRowDOM=this.DivDialog.querySelector(".js-bg-row");

        this.BorderColorCtrl.BindControl(this.DivDialog);
        this.BorderColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyBorderColor(color); }
        this.BorderColorRowDOM=this.DivDialog.querySelector(".js-border-row");

        this.OkButton=this.DivDialog.querySelector(".js-ok");
        this.OkButton.onclick = ()=>{ this.Ok(); };

        this.LineColorCtrl.BindControl(this.DivDialog);
        this.LineColorCtrl.OnColorChangeCallback=(color)=>{ this.ModifyLineColor(color); };
        this.LineRowDOM=this.DivDialog.querySelector(".js-line-row");

        this.AryPointCtrl.forEach((item)=>
        {
            item.BindControl(this.DivDialog);
            item.OnPointChangeCallback=(data)=>{ this.DelayModifyPointValue(data); }
            item.GetKItemCallback=(data)=>{ return this.GetKItem(data); }
        });

        this.LineWidthSelect=this.DivDialog.querySelector(".js-line-width");
        this.LineStyleRowDOM=this.DivDialog.querySelector(".js-line2-row");
        // 字体下拉变化
        this.LineWidthSelect.onchange = () =>
        {
            var value=Number(this.LineWidthSelect.value);
            this.ModifyLineWidth(value);
        };

        this.ChartInfoCtrl.BindControl(this.DivDialog);

        this.DivDialog.querySelector(".js-close").onclick = ()=>{ this.Close(); };
        this.DivDialog.querySelector(".js-cancel").onclick = ()=>{ this.Cancel(); };
    }

    Show(x, y, option)
    {
        if(!this.DivDialog) this.Create();

        this.ChartPicture=null;
        this.DataBackUp=null;
        this.AryPointCtrl.forEach((item)=>{ item.Reset();});
        
        if (option)
        {
            if (option.Type===1) this.SetModifySetting(option);
            else return;
        }

        this.DivDialog.style.visibility = "visible";
        this.DivDialog.style.left = (x || 300) + "px";
        this.DivDialog.style.top = (y || 150) + "px";
    }

    GetKItem(index)
    {
        if (!IFrameSplitOperator.IsNumber(index) || index<0) return null;
        if (!this.HQChart) return null;

        var kData=this.HQChart.GetKData();
        if (!kData || !IFrameSplitOperator.IsNonEmptyArray(kData.Data)) return datetime;

        var kItem=kData.Data[index];

        return kItem;
    }

    ModifyLineColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);
        
        DrawToolHelper.SetLineColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true});
    }

    ModifyLineWidth(value)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        
        DrawToolHelper.SetLineWidth(this.ChartPicture, value, { HQChart:this.HQChart, DrawDynamicInfo:true});
    }

    ModifyBGColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);

        DrawToolHelper.SetBGColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true});
        
        this.HQChart.DrawDynamicInfo();
    }

    ModifyBorderColor(color)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;
        if (IChartDrawPicture.IsHexColor(color)) color=IChartDrawPicture.HexToRGB(color);

        DrawToolHelper.SetBorderColor(this.ChartPicture, color, { HQChart:this.HQChart, DrawDynamicInfo:true });
    }

    ModifyPointValue(data)
    {
        if (this.Type!==1) return;
        if (!this.ChartPicture) return;

        var index=data.Index;
        var yValue=data.YValue;
        var xValue=data.XValue;
        if (!IFrameSplitOperator.IsNumber(yValue) || !IFrameSplitOperator.IsNumber(xValue)) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.ChartPicture.Value)) return;
        if (index<0 || index>=this.ChartPicture.Value.length) return;

        var item=this.ChartPicture.Value[index];
        item.YValue=yValue;
        item.XValue=xValue;
        this.ChartPicture.ValueToPoint(); 
        this.HQChart.Draw();
    }

    DelayModifyPointValue(data)
    {
        this.ClearDelayTimer();
        this.InputDelay.Timer = setTimeout(() => 
        {
            this.ModifyPointValue(data);
        }, this.InputDelay.Delay);
    }

    SetModifySetting(data)
    {
        this.Type=1;
        if (!data) return false;
        if (!data.Chart) return false;

        this.ChartPicture=data.Chart;
        this.DataBackUp={ Name:null };

        var title="画图工具";
        if (IFrameSplitOperator.IsString(this.ChartPicture.Description)) title=this.ChartPicture.Description;

        this.SetTitle(`${title} - 高级设置`);

        if (!JSDialogLineSetting.CHART_ATTRIBUTE.has(this.ChartPicture.ClassName)) return false;

        var finder=JSDialogLineSetting.CHART_ATTRIBUTE.get(this.ChartPicture.ClassName);
        var config=finder.Attr;

        if (config.LineColor===true)    //线段颜色
        {
            var color=DrawToolHelper.GetLineColor(this.ChartPicture);
            this.LineColorCtrl.SetColor(color);
            this.DataBackUp.LineColor=color;  
            this.LineRowDOM.style.display=null;  //线段
        }
        else
        {
            this.LineRowDOM.style.display='none';
        }

        if (config.LineWidth===true)
        {
            var value=DrawToolHelper.GetLineWidth(this.ChartPicture);
            this.LineWidthSelect.value=value;
            this.DataBackUp.LineWidth=value;  
            this.LineStyleRowDOM.style.display=null;  //线段
        }
        else
        {
            this.LineRowDOM.style.display='none';
        }

        if (config.BGColor===true)  //文字背景色
        {
            var color=DrawToolHelper.GetBGColor(this.ChartPicture);
            this.BGColorCtrl.SetColor(color);
            this.DataBackUp.BGColor=color;
            this.BGColorRowDOM.style.display=null;
        }
        else
        {
            this.BGColorRowDOM.style.display="none";
        }

        if (config.BorderColor===true)  //边框颜色
        {
            var color=DrawToolHelper.GetBorderColor(this.ChartPicture);
            this.BorderColorCtrl.SetColor(color);
            this.DataBackUp.BorderColor=color;
            this.BorderColorRowDOM.style.display=null;
        }
        else
        {
            this.BorderColorRowDOM.style.display="none";
        }

        //点
        var aryValue=this.ChartPicture.Value;
        var count=Math.min(aryValue.length, this.AryPointCtrl.length);
        for(var i=0; i<count; ++i)
        {
            var item=aryValue[i];
            var ptCtrl=this.AryPointCtrl[i];
            ptCtrl.SetChartInfo({ ClassName:this.ChartPicture.ClassName, Period:this.HQChart.Period} );
            ptCtrl.SetYValue(item.YValue);
            ptCtrl.SetXValue(item.XValue);
            ptCtrl.ShowRow(true);
        }

        for(var i=count;i<this.AryPointCtrl.length;++i)
        {
            var ptCtrl=this.AryPointCtrl[i];
            ptCtrl.ShowRow(false);
        }
        this.DataBackUp.Value=CloneData(this.ChartPicture.Value);

        this.ChartInfoCtrl.SetChartPicture(this.ChartPicture);
    }

    Close()
    {
        this.ClearDelayTimer();
        this.Hidden();
    }

    Cancel()
    {
        this.ClearDelayTimer();

        if (this.Type===1 && this.ChartPicture && this.DataBackUp) //还原
        {
            if (JSDialogLineSetting.CHART_ATTRIBUTE.has(this.ChartPicture.ClassName))
            {
                var finder=JSDialogLineSetting.CHART_ATTRIBUTE.get(this.ChartPicture.ClassName);
                var config=finder.Attr;

                if (config.BGColor===true)  //背景色
                    DrawToolHelper.SetBGColor(this.ChartPicture,this.DataBackUp.BGColor);

                if (config.BorderColor===true)  //边框颜色
                    DrawToolHelper.SetBorderColor(this.ChartPicture, this.DataBackUp.BorderColor);
              
                if (config.LineColor===true)    //线段颜色
                    DrawToolHelper.SetLineColor(this.ChartPicture,this.DataBackUp.LineColor);

                if (config.LineWidth===true)    //线段宽
                    DrawToolHelper.SetLineWidth(this.ChartPicture,this.DataBackUp.LineWidth);
            
                this.ChartPicture.Value=this.DataBackUp.Value;

                this.HQChart.Draw();
            }
        }

        this.DataBackUp=null;
        this.Close();
    }

    Ok()
    {
        this.Save();
        this.Close();
    }
}



IJSDialogAdvancedSetting.MapClass.set(JSDialogAlertSetting.CLASS_NAME, { Create:function(){ return new JSDialogAlertSetting() }});
IJSDialogAdvancedSetting.MapClass.set(JSDialogTextSetting.CLASS_NAME, { Create:function(){ return new JSDialogTextSetting() }});
IJSDialogAdvancedSetting.MapClass.set(JSDialogLineSetting.CLASS_NAME, { Create:function(){ return new JSDialogLineSetting() }});



