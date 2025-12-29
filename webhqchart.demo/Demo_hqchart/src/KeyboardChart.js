

class KeyboardChart
{
    HQKeyboard=new JSPopKeyboard();
    HQData=new HQData();            //数据
    AryDiv=[];  //{ DivID:, DOM: }

    OnSelectedItemCallback=null;
    OnShowCallback=null;

    constructor()
    {

    }

    Create(aryDiv)
    {
        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        this.HQKeyboard.Keyboard.Option.Column[0].MaxText="擎擎8888";
        //this.HQKeyboard.Keyboard.Option.Column[2].MaxText="擎擎擎擎擎擎";

        this.HQKeyboard.Keyboard.Option.EventCallback=
        [
            {
                event:JSCHART_EVENT_ID.ON_KEYBOARD_SELECTED,    //切换股票
                callback:(event, data, obj)=> { this.OnSelectedItem(event, data, obj); }
            },
            {
                event:JSCHART_EVENT_ID.ON_KEYBOARD_SHOW,
                callback:(event, data, obj)=>{ this.OnShow(event, data, obj); }
            }
        ]

        this.HQKeyboard.Inital();
        this.HQKeyboard.Create();

        if (IFrameSplitOperator.IsNonEmptyArray(aryDiv))
        {
            for(var i=0;i<aryDiv.length;++i)
            {
                var id=aryDiv[i];
                var domItem=document.getElementById(id);
                this.AryDiv.push({DivID:id, DOM:domItem });
            }
        }
        

        this.HQData.Keyboard_RequestSymbolList({ AryMarket:[ { Market:"SH"}, { Market:"SZ" } ] }, (data)=>{ this.HQKeyboard.SetSymbolData(data); });   //请求码表数据

        document.addEventListener('keydown', (event) =>
        {
            this.OnKeydown(event);
        });

        document.addEventListener("mousedown", (event)=>
        {  
            this.OnMouseDown(event);
        });
        
    }

    OnKeydown(event)
    {
        for(var i=0;i<this.AryDiv.length;++i)
        {
            var item=this.AryDiv[i];
            if (!item.DOM) item.DOM=document.getElementById(item.DivID); 

            if (!item.DOM) continue;

            if (item.DOM.contains(event.target)) //在K线上才出来键盘精灵
            {
                this.HQKeyboard.OnGlobalKeydown(event) 
            }
        }
    }

    OnMouseDown(event)
    {
        this.HQKeyboard.OnGlobalMouseDown(event)
    }

    OnSelectedItem(event, data, obj)
    {
        console.log("[KeyboardChart::OnSelectedItem] data", data)
        this.HQKeyboard.Hide();

        if (!data || !data.RowData) return;

        if (this.OnSelectedItemCallback) this.OnSelectedItemCallback(data);
    }

    OnShow(event, data, obj)
    {
        console.log("[KeyboardChart::OnShow] data", data)
        if (this.OnShowCallback) this.OnShowCallback(data);
    }

    Show()
    {
        if (!this.HQKeyboard) return;
        this.HQKeyboard.PopKeyboard();
    }

    ReloadResource()
    {
        if (this.HQKeyboard) this.HQKeyboard.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }
}