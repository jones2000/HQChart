
HTML_PART1="""<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>  
<head>  
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />  
<meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' />
<title>HQChart-Py可视化</title>  
    <!-- 加载资源 -->
    <link rel='stylesheet' href='hqchart/umychart.resource/css/tools.css' />
    <link rel='stylesheet' href='hqchart/umychart.resource/font/iconfont.css' />
    <link rel="stylesheet" href="hqchart/umychart.resource/css/python_demo.css" />
</head>  
<body>

    <script src='hqchart/umychart.resource/js/jquery.min.js'></script>
    <script src='hqchart/umychart.resource/js/webfont.js'></script>
    <script src="hqchart/umychart.resource/js/python_demo.js"></script>
    <script src="hqchart/umychart.network.js"></script>
    <script src='hqchart/umychart.js'></script>             <!-- K线图形 -->
    <script src='hqchart/umychart.complier.js'></script>    <!-- 麦语言解析执行器 -->
    <script src='hqchart/umychart.index.data.js'></script>  <!-- 基础指标库 -->
    <script src='hqchart/umychart.style.js'></script>       <!-- 白色风格和黑色风格配置信息 -->

    <div class="tabNav" id='demoTabNav'>
        <p class='active' data-index='0'>k线图</p>
        <p data-index='1'>数据</p>
    </div>
    <div id="kline" style="width: 900px;height:400px;position: relative;"></div>
    <div id='divDataWrap'>
        <div class='headerWrap'>
            <table>
                <thead></thead>
            </table>
        </div>
        <div class="bodyWrap">
            <table>
                <tbody></tbody>
            </table>
        </div>
    </div>
    
    <script>

        //简单的把K线控件封装下
        function KLineChart(divKLine)
        {
            this.DivKLine=divKLine;
            this.Chart=JSChart.Init(divKLine);   //把K线图绑定到一个Div上
            this.Barrage;                    //弹幕输出控制器

            //K线配置信息
            this.Option= {
                Type:'历史K线图',   //创建图形类型
                
                //窗口指标
                Windows:g_KLineOption.Windows,
                Symbol:g_KLineOption.Symbol,
                IsAutoUpdate:false,       //是自动更新数据
    
                IsShowRightMenu:false,          //右键菜单
                IsShowCorssCursorInfo:true,    //是否显示十字光标的刻度信息
                CorssCursorTouchEnd:false,
    
                KLine:  //K线设置
                {
                    DragMode:1,                 //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                    Right:g_KLineOption.Right,                    //复权 0 不复权 1 前复权 2 后复权
                    Period:g_KLineOption.Period,                   //周期 0 日线 1 周线 2 月线 3 年线 
                    MaxReqeustDataCount:1000,   //数据个数
                    MaxRequestMinuteDayCount:10, //分钟数据取5天
                    PageSize:50,               //一屏显示多少数据
                    //Info:["互动易","大宗交易",'龙虎榜',"调研","业绩预告","公告"],       //信息地雷
                    IsShowTooltip:true,                 //是否显示K线提示信息
                },
    
                KLineTitle: //标题设置
                {
                    IsShowName:true,       //不显示股票名称
                    IsShowSettingInfo:true //不显示周期/复权
                },
    
                Border: //边框
                {
                    Left:80,         //左边间距
                    Right:80,       //右边间距
                    Bottom:25,      //底部间距
                    Top:25          //顶部间距
                },
                
                Frame:  //子框架设置
                [
                    {SplitCount:3,StringFormat:0, IsShowLeftText:true},
                    {SplitCount:2,StringFormat:0, IsShowLeftText:true},
                    {SplitCount:2,StringFormat:0, IsShowLeftText:true}
                ]
            };
                 
            this.Create=function()  //创建图形
            {
                var self=this;
                $(window).resize(function() { self.OnSize(); });    //绑定窗口大小变化事件

                this.OnSize();  //让K线全屏
                this.Chart.SetOption(this.Option);  //设置K线配置
            }

            this.OnSize=function()  //自适应大小调整
            {
                var height = $(window).height();
                var width = $(window).width();
                var klineHeight = height - $('#demoTabNav').outerHeight(true);
                this.DivKLine.style.top = 'px';
                this.DivKLine.style.left = 'px';
                this.DivKLine.style.width = width + 'px';
                this.DivKLine.style.height = klineHeight + 'px';
                this.Chart.OnSize();
            }
        }

        $(function () 
        {
            WebFont.load({ custom: { families: ['iconfont'] } });   //预加载下iconfont资源
            var klineControl=new KLineChart(document.getElementById('kline'));
            klineControl.Create();
        })  
        """


HTML_PART_END="""</script>  
</body>  
</html>"""