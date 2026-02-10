


class ScrollTextChart
{
    DivScrollText=null;
    Chart=null;                 //把图绑定到一个Div上

    OnClickItemCallback=null;

    //配置信息
    Option= 
    {
        Type:'跑马灯',   //创建图形类型
        EnableResize:true,

        Border: //边框
        {
            Left:0,         //左边间距
            Right:1,       //右边间距
            Bottom:0,      //底部间距
            Top:1          //顶部间距
        }
    };
    
    Create(div)  //创建图形
    {
        this.DivScrollText=div;
        this.Chart=JSScrollTextChart.Init(div);   //把成交明细图绑定到一个Div上

        //$(window).resize(()=> { this.OnSize(); });    //绑定窗口大小变化事件
       // this.OnSize();  //全屏

        //黑色风格
        //var blackStyle=HQChartStyle.GetStyleConfig(STYLE_TYPE_ID.BLACK_ID); //读取黑色风格配置
        //JSChart.SetStyle(blackStyle);
       // this.DivDeal.style.backgroundColor=blackStyle.BGColor; //设置最外面的div背景

        this.Option.EventCallback= 
        [ 
            {   //单击
                event:JSCHART_EVENT_ID.ON_CLICK_SCROLL_TEXT_ITEM, 
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

    OnClickItem(event, data, obj)
    {
        console.log('[ScrollTextChart::OnClickItem] data', data);
        
    }
}