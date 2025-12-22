class StatusBarChart
{
    DivStatusBar=null;
    Chart=null;                 //把图绑定到一个Div上
    HQData=new HQData();        //数据

    OnClickStockCallback=null;
    OnClickRightToolbarCallback=null;
    

    //K线配置信息
    Option= 
    {
        Type:'底部状态栏',   //创建图形类型
        
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:5000,   //数据更新频率
        EnableResize:true,

        Column:
        [
            { 
                Symbol:"000001.sh",
                Column:
                [
                    { Name:"名称", Key:"Name", Text:"000001", },
                    { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1, MaxText:"88888.88" }, 
                    { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%", MaxText:"888.88%"  }, 
                    { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                    { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ColorID:1 }
                ]
            },

            { 
                Symbol:"399001.sz", 
                Column:
                [
                    { Name:"名称", Key:"Name", Text:"399001", },
                    { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, 
                    { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, 
                    { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                    { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ColorID:1 }
                ]
            },
            { 
                Symbol:"399006.sz", 
                Column:
                [
                    { Name:"名称", Key:"Name", Text:"399006", },
                    { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, 
                    { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, 
                    { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                    { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ColorID:1 }
                ]
            },
            { 
                Symbol:"000688.sh", 
                Column:
                [
                    { Name:"名称", Key:"Name", Text:"000688", },
                    { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, 
                    { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, 
                    { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                    { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ColorID:1 }
                ]
            }
        ],

        RightToolbar:
        {
            AryButton:
            [
                { ID:2, Type:1, Icon:[{ Symbol:"\ue609", Color:"rgb(180,180,180)"} ] }, //设置

                //网络
                { 
                    ID:1, Type:2, Icon:[{ Symbol:"\ue6d0", Color:"rgb(180,180,180)"} ], 
                    Flash:
                    {
                        AryIcon:
                        [
                            [{ Symbol:"\ue6cb", Color:"rgb(112,128,144)"}],
                            [{ Symbol:"\ue6cb", Color:"rgb(30,144,255)"}],
                            //[{ Symbol:"\ue6cb", Color:"rgb(0,191,255)"}],
                        ]
                    }
                },
            ]
        },
        
        Border: //边框
        {
            Left:0,         //左边间距
            Right:1,       //右边间距
            Bottom:0,      //底部间距
            Top:1          //顶部间距
        }
    };
    
    Create(divInfo)  //创建图形
    {
        this.DivStockInfo=divInfo;
        this.Chart=JSStatusBarChart.Init(divInfo);   //把成交明细图绑定到一个Div上

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        //$(window).resize(()=> { this.OnSize(); });    //绑定窗口大小变化事件
       // this.OnSize();  //全屏

        //黑色风格
        //var blackStyle=HQChartStyle.GetStyleConfig(STYLE_TYPE_ID.BLACK_ID); //读取黑色风格配置
        //JSChart.SetStyle(blackStyle);
       // this.DivDeal.style.backgroundColor=blackStyle.BGColor; //设置最外面的div背景

        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };
        this.Option.Symbol=this.Symbol;

        this.Option.EventCallback= 
        [ 
            {   //单击
                event:JSCHART_EVENT_ID.ON_CLICK_STATUSBAR_ITEM, 
                callback:(event, data, obj)=>{ this.OnClickItem(event, data, obj); }  
            },
        ];

        this.OnCreate();

        this.Chart.SetOption(this.Option);  //设置配置
    }

    OnCreate()
    {

    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

    NetworkFilter(data, callback)
    {
        console.log('[StatusBarChart::NetworkFilter] data', data);
        var option={ ChartName:"StatusBarChart" };
        switch(data.Name)
        {
            default:
                this.HQData.NetworkFilter(data, callback, option);  
                break;
        }
    }

    OnClickItem(event, data, obj)
    {
        console.log('[StatusBarChart::OnClickItem] data', data);
        if (!data.Tooltip) return;
        
        var item=data.Tooltip.Data;
        if (item.Type===1)
        {
            var symbol=item.Data.Symbol;    //切换股票
            if (this.OnClickStockCallback) this.OnClickStockCallback({ Symbol:symbol}, item);
        }
        else if (item.Type==2)
        {
            if (this.OnClickRightToolbarCallback) this.OnClickRightToolbarCallback({ ID:item.Data.ID }, item);
        }
    }
}