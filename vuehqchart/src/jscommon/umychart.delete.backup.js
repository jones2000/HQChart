//市场多空
function MarketLongShortIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Long-Short');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("多头区域",null),
        new IndexInfo("空头区域",null),
        new IndexInfo("市场多空指标",null),
    );

    this.Index[0].LineColor=g_JSChartResource.UpBarColor;
    this.Index[1].LineColor=g_JSChartResource.DownBarColor;
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[0];

    this.LongShortData; //多空数据

    this.CreateChart=function(id) 
    {
        if (id==2){
          var newChartLine = new ChartLine();
          newChartLine.LineWidth = 2;
          return newChartLine;
        }

        return new ChartStraightLine();
    }

    this.GetOutData=function()
    {
        return { LongShortData:this.LongShortData };
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            this.SendEvent(hqChart,windowIndex,hisData,"不支持周期切换");
            return false;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
                self.SendEvent(hqChart,windowIndex,hisData);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.LongShortData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=this.CreatePaints(hqChart,windowIndex);
        var isOverlay=this.IsOverlay();
        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[2].Data.Data=this.LongShortData;
        paint[0].Data.Data[0]=8;
        paint[1].Data.Data[0]=1;

        var titleIndex=windowIndex+1;

        //指定[0,9]
        if (isOverlay) 
        {
            this.OverlayIndex.Frame.Frame.YSpecificMaxMin={Max:9,Min:0,Count:3};
            var titlePaint=hqChart.TitlePaint[titleIndex];
            var titleInfo={ Data:[], Title:'' };
            titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
            for(var i in paint)
            {
                var titleData=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
                if (i!=2) titleData.DataType="StraightLine";
                titlePaint.OverlayIndex.get(this.OverlayIndex.Identify).Data[i]=titleData;
            }
        }
        else  
        {
            hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:9,Min:0,Count:3};
            for(var i in paint)
            {
                hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
                if (i!=2) hqChart.TitlePaint[titleIndex].Data[i].DataType="StraightLine";
            }
        }

        return true;
    }

}

//市场择时
function MarketTimingIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Timing');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("因子择时",null)
    );

    this.TimingData; //择时数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor

    this.CreateChart=function(id) 
    {
        return new ChartMACD();
    }

    this.GetOutData=function()
    {
        return { TimingData:this.TimingData };
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            this.SendEvent(hqChart,windowIndex,hisData,"不支持周期切换");
            return false;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
                self.SendEvent(hqChart,windowIndex,hisData);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[2];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.TimingData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=this.CreatePaints(hqChart,windowIndex);
        var isOverlay=this.IsOverlay();

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.TimingData;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        if (isOverlay) 
        {
            var titlePaint=hqChart.TitlePaint[titleIndex];
            var titleInfo={ Data:[], Title:'' };
            titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
            for(var i in paint)
            {
                var titleData=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
                titleData.StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
                titleData.FloatPrecision=0;
                titlePaint.OverlayIndex.get(this.OverlayIndex.Identify).Data[i]=titleData;
            }
        }
        else
        {
            for(var i in paint)
            {
                hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
                hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
                hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
            }
        }

        return true;
    }
}

//市场关注度
function MarketAttentionIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Attention');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("市场关注度",null)
    );

    this.Data; //关注度数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor;
    this.ApiUrl=g_JSChartResource.Index.MarketAttentionApiUrl;

    this.CreateChart=function(id) 
    {
        return new ChartMACD();
    }

    this.GetOutData=function()
    {
        return { Data:this.Data };
    }

    //调整框架
    this.SetFrame=function(hqChart,windowIndex,hisData)
    {
        var isOverlay=this.IsOverlay();
        if (isOverlay)
            this.OverlayIndex.Frame.Frame.YSpecificMaxMin={Max:6,Min:0,Count:3};
        else
            hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:6,Min:0,Count:3};
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            this.SendEvent(hqChart,windowIndex,hisData,"不支持周期切换");
            return false;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
                self.SendEvent(hqChart,windowIndex,hisData);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);
        this.SetFrame(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=this.CreatePaints(hqChart,windowIndex);
        var isOverlay=this.IsOverlay();

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;
        if (isOverlay) 
        {
            var titlePaint=hqChart.TitlePaint[titleIndex];
            var titleInfo={ Data:[], Title:'' };
            titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
            for(var i in paint)
            {
                var titleData=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
                titleData.StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
                titleData.FloatPrecision=0;
                titlePaint.OverlayIndex.get(this.OverlayIndex.Identify).Data[i]=titleData;
            }
        }
        else
        {
            for(var i in paint)
            {
                hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
                hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
                hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
            }
        }

        return true;
    }
}


/*
    行业,指数热度
*/
function MarketHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Heat');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("热度",5),
        new IndexInfo('MA',10),
        new IndexInfo('MA',null)
    );

    this.Data; //关注度数据

    this.ApiUrl=g_JSChartResource.Index.MarketHeatApiUrl;

    this.Index[0].LineColor=g_JSChartResource.FrameSplitTextColor;
    this.Index[1].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[1];

    this.CreateChart=function(id) 
    {
        if (id==0) return new ChartMACD();

        return new ChartLine();
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=this.CreatePaints(hqChart,windowIndex);
        var isOverlay=this.IsOverlay();

        if (paint.length!=this.Index.length) return false;

        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var MA=HQIndexFormula.MA(this.Data,this.Index[0].Param);
        paint[1].Data.Data=MA;

        var MA2=HQIndexFormula.MA(this.Data,this.Index[1].Param);
        paint[2].Data.Data=MA2;

        var titleIndex=windowIndex+1;

        if (isOverlay) 
        {
            var titlePaint=hqChart.TitlePaint[titleIndex];
            var titleInfo={ Data:[], Title:'' };
            titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
            for(var i in paint)
            {
                var name=''
                if(i==0) name=hqChart.Name+this.Index[i].Name;
                else name="MA"+this.Index[i-1].Param;
                var titleData=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
                titleData.StringFormat=STRING_FORMAT_TYPE.DEFAULT;
                titleData.FloatPrecision=2;
                titlePaint.OverlayIndex.get(this.OverlayIndex.Identify).Data[i]=titleData;
            }
        }
        else
        {
            for(var i in paint)
            {
                var name="";    //显示的名字特殊处理
                if(i==0) name=hqChart.Name+this.Index[i].Name;
                else name="MA"+this.Index[i-1].Param;

                hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
                hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.DEFAULT;
                hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=2;
            }
        }

        //hqChart.TitlePaint[titleIndex].Explain="热度说明";

        return true;
    }

}

//自定义指数热度
function CustonIndexHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Heat');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo('区域',3),
        new IndexInfo("热度指数",10),
        new IndexInfo('MA',5),
        new IndexInfo('MA',10)
    );

    this.Data; //关注度数据

    this.ApiUrl=g_JSChartResource.Index.CustomIndexHeatApiUrl;

    this.Index[1].LineColor=g_JSChartResource.Index.LineColor[1];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[2];
    this.Index[3].LineColor=g_JSChartResource.Index.LineColor[3];

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0) 
            {
                paint = new ChartStraightArea();
            }
            else 
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.ApiUrl,
            data:
            {
               "stock":param.HQChart.CustomStock,
               "date":{"startdate":param.HQChart.QueryDate.Start,"enddate":param.HQChart.QueryDate.End},
               "day":[this.Index[0].Param,this.Index[1].Param],
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data==null || recvData.data.length<0) return;

        //JSConsole.Chart.Log(recvData.data);
        var aryData=new Array();
        for(let i in recvData.data)
        {
            let item=recvData.data[i];
            let indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        let paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].NotSupportMessage=null;
        paint[0].Data.Data=
        [
          { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '热度1', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '热度2', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.4, Value2: 0.8, Color: 'rgb(255,106,106)', Title: '热度3', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.8, Value2: 1, Color: 'rgb(208, 32 ,144)', Title: '热度4', TitleColor:'rgb(245,255 ,250)'}
        ];
        
        paint[1].Data.Data = this.Data;
        
        let MA=HQIndexFormula.MA(this.Data,this.Index[2].Param);
        paint[2].Data.Data=MA;

        let MA2=HQIndexFormula.MA(this.Data,this.Index[3].Param);
        paint[3].Data.Data=MA2;

         //指定框架最大最小[0,1]
         hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };

        let titleIndex=windowIndex+1;

        for(let i=1;i<paint.length;++i)
        {
            let name=this.Index[i].Name;    //显示的名字特殊处理
            if (name=='MA') name="MA"+this.Index[i].Param;

            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.DEFAULT;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=2;
        }

        hqChart.TitlePaint[titleIndex].Title='热度'+'('+this.Index[0].Param+','+this.Index[1].Param+','+this.Index[2].Param+','+this.Index[3].Param+')';

        return true;
    }

}


/*
    本福特系数(财务粉饰)
*/
function BenfordIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('财务粉饰');
    delete this.newMethod;

    this.Index = new Array(
        new IndexInfo('区域', null),
        new IndexInfo("系数", null)
      );

    this.Data; //财务数据

    this.ApiUrl=g_JSChartResource.Index.StockHistoryDayApiUrl;

    this.Index[0].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[1].LineColor='rgb(105,105,105)';

    this.CreateChart=function(id) 
    {
        if (id==0) return new ChartStraightArea();

        return new ChartLineMultiData();
    }

    this.GetOutData=function()
    {
        return { Data:this.Data };
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period!=2)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"只支持月线");
            param.HQChart.Draw();
            this.SendEvent(hqChart,windowIndex,hisData,"只支持月线");
            return false;
        }

        var aryField=["finance.benford","announcement2.quarter","announcement1.quarter","announcement3.quarter","announcement4.quarter"];
        var aryCondition=
            [  
                {item:["date","int32","gte","20130101"]},
                {item:[ "announcement1.year","int32","gte",0,
                        "announcement2.year","int32","gte",0,
                        "announcement3.year","int32","gte",0,
                        "announcement4.year","int32","gte",0,
                        "or"]}
            ];
        //请求数据
        JSNetwork.HttpRequest({
            url: this.ApiUrl,
            data:
            {
               "symbol":[param.HQChart.Symbol],
               "field":aryField,
               "condition":aryCondition
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
                self.SendEvent(hqChart,windowIndex,hisData);
            }
        });

        return true;
    }

    this.JsonDataToMapSingleData=function(recvData)
    {
        var stockData=recvData.stock[0].stockday;
        var mapData=new Map();
        for(var i in stockData)
        {
            var item=stockData[i];
            var indexData=new SingleData();
            indexData.Date=item.date;
            indexData.Value=new Array();
            if (item.finance1!=null && item.announcement1!=null)
            {
                let year=item.announcement1.year;
                let quarter=item.announcement1.quarter;
                let value=item.finance1.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance2!=null && item.announcement2!=null)
            {
                let year=item.announcement2.year;
                let quarter=item.announcement2.quarter;
                let value=item.finance2.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance3!=null && item.announcement3!=null)
            {
                let year=item.announcement3.year;
                let quarter=item.announcement3.quarter;
                let value=item.finance3.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }
            if (item.finance4!=null && item.announcement4!=null)
            {
                let year=item.announcement4.year;
                let quarter=item.announcement4.quarter;
                let value=item.finance4.benford;
                indexData.Value.push({Year:year,Quarter:quarter,Value:value});
            }

            mapData.set(indexData.Date,indexData);
        }

        var aryData=new Array();
        for( var item of mapData)
        {
            aryData.push(item[1]);
        }

        return aryData;
    }

    this.RecvData=function(recvData,param)
    {
        JSConsole.Chart.Log(recvData);
        if (recvData.stock==null || recvData.stock.length<=0) return;

        var aryData=this.JsonDataToMapSingleData(recvData);

        var aryFittingData=param.HistoryData.GetFittingMonthData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=this.CreatePaints(hqChart,windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].NotSupportMessage = null;

        paint[0].Data.Data=
        [
          { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '安全区', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '预警区', TitleColor:'rgb(245,255 ,250)'},
          { Value: 0.4, Value2: 1, Color: 'rgb(255,106,106)', Title: '警示区', TitleColor:'rgb(245,255 ,250)'}
        ];
        
        paint[1].Data.Data = this.Data;
        
        //指定框架最大最小[0,1]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };
    
        var titleIndex = windowIndex + 1;
    
        hqChart.TitlePaint[titleIndex].Data[1] = new DynamicTitleData(paint[1].Data, this.Index[1].Name, this.Index[1].LineColor);
        hqChart.TitlePaint[titleIndex].Data[1].DataType = "MultiReport";
         
        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

        return true;
    }
}


/*
    点位研判函数

    HJ_1:=REF(LOW,1);
    HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
    HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
    HJ_4:=LLV(LOW,34);
    HJ_5:=HHV(HJ_3,34);
    HJ_6:=IF(LLV(LOW,56),1,0);
    HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
    HJ_8:=HJ_7>REF(HJ_7,1);
    HJ_9:=REF(LLV(LOW,100),3);
    HJ_10:=REFDATE(HJ_9,DATE);
    HJ_11:=LOW=HJ_10;
    HJ_12:=HJ_8 AND HJ_11;
    HJ_13:=HJ_12>REF(HJ_12,1);
    启动买点:HJ_13>REF(HJ_13,1),COLORRED,LINETHICK1;
*/
function LighterIndex3()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('点位研判函数');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("启动买点",null)
    );

    this.Index[0].LineColor='rgb(255,0,0)';

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        var closeData=hisData.GetClose();
        var highData=hisData.GetHigh();
        var lowData=hisData.GetLow();

        //HJ_1:=REF(LOW,1);
        var hj_1=HQIndexFormula.REF(lowData,1);

        //HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
        var hj_2=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.SMA(HQIndexFormula.ABS(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1)),13,1),
                HQIndexFormula.SMA(HQIndexFormula.MAX(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1),0),13,1)
            ),
            100
        );

        //HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
        var hj_3=HQIndexFormula.EMA(
            HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_MULTIPLY(closeData,1.2),HQIndexFormula.ARRAY_MULTIPLY(hj_2,13),HQIndexFormula.ARRAY_DIVIDE(hj_2,13)),
            13
        );
        
        //HJ_4:=LLV(LOW,34);
        var hj_4=HQIndexFormula.LLV(lowData,34);

        //HJ_5:=HHV(HJ_3,34);
        var hj_5=HQIndexFormula.HHV(hj_3,34);

        //HJ_6:=IF(LLV(LOW,56),1,0);
        var hj_6=HQIndexFormula.ARRAY_IF(HQIndexFormula.LLV(lowData,56),1,0);

        //HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
        //hj_7_temp=(HJ_3+HJ_5*2)/2,0)  太长了 这部分单独算下
        var hj_7_temp=HQIndexFormula.ARRAY_DIVIDE(HQIndexFormula.ARRAY_ADD(hj_3,HQIndexFormula.ARRAY_MULTIPLY(hj_5,2)),2);

        var hj_7=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.EMA(
                    HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_LTE(lowData,hj_4),hj_7_temp,0),
                    3
                ),
                618
            ),
            hj_6
        );

        //HJ_8:=HJ_7>REF(HJ_7,1);
        var hj_8=HQIndexFormula.ARRAY_GT(hj_7,HQIndexFormula.REF(hj_7,1));

        //HJ_9:=REF(LLV(LOW,100),3);
        var hj_9=HQIndexFormula.REF(HQIndexFormula.LLV(lowData,100),3);

        //HJ_10:=REFDATE(HJ_9,DATE); 用当日的数据 产生数组
        var hj_10=HQIndexFormula.REFDATE(hj_9,-1);

        //HJ_11:=LOW=HJ_10;
        var hj_11=HQIndexFormula.ARRAY_EQ(lowData,hj_10);

        //HJ_12:=HJ_8 AND HJ_11;
        var hj_12=HQIndexFormula.ARRAY_AND(hj_8,hj_11);
       
        var buyData=null;
        paint[0].Data.Data=hj_12;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
        }

        hqChart.TitlePaint[titleIndex].Title=this.FormatIndexTitle();

        return true;
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////
//      指标计算方法
//
//
//

function HQIndexFormula()
{

}

//指数平均数指标 EMA(close,10)
HQIndexFormula.EMA=function(data,dayCount)
{
    var result = [];

    var offset=0;
    if (offset>=data.length) return result;

    //取首个有效数据
    for(;offset<data.length;++offset)
    {
        if (data[offset]!=null && !isNaN(data[offset]))
            break;
    }

    var p1Index=offset;
    var p2Index=offset+1;

    result[p1Index]=data[p1Index];
    for(var i=offset+1;i<data.length;++i,++p1Index,++p2Index)
    {
        result[p2Index]=((2*data[p2Index]+(dayCount-1)*result[p1Index]))/(dayCount+1);
    }

    return result;
}

HQIndexFormula.SMA=function(data,n,m)
{
    var result = [];

    var i=0;
    var lastData=null;
    for(;i<data.length; ++i)
    {
        if (data[i]==null || isNaN(data[i])) continue;
        lastData=data[i];
        result[i]=lastData; //第一天的数据
        break;
    }

    for(++i;i<data.length;++i)
    {
        result[i]=(m*data[i]+(n-m)*lastData)/n;
        lastData=result[i];
    }

    return result;
}


/*
    求动态移动平均.
    用法: DMA(X,A),求X的动态移动平均.
    算法: 若Y=DMA(X,A)则 Y=A*X+(1-A)*Y',其中Y'表示上一周期Y值,A必须小于1.
    例如:DMA(CLOSE,VOL/CAPITAL)表示求以换手率作平滑因子的平均价
*/
HQIndexFormula.DMA=function(data,data2)
{
    var result = [];
    if (data.length<0 || data.length!=data2.length) return result;

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index]) && data2[index]!=null && !isNaN(data2[index]))
        {
            result[index]=data[index];
            break;
        }
    }

    for(index=index+1;index<data.length;++index)
    {
        if (data[index]==null || data2[index]==null)
            result[index]=null;
        else
        {
            if (data[index]<1)
                result[index]=(data2[index]*data[index])+(1-data2[index])*result[index-1];
            else
                result[index]= data[index];
        }
    }

    return result;
}


HQIndexFormula.HHV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var max=-10000;
    for(var i=n,j=0;i<data.length;++i,++j)
    {
        if(i<n+max)
        {
            max=data[i]<data[max]?max:i;
        }
        else
        {
            for(j=(max=i-n+1)+1;j<=i;++j)
            {
                if(data[j]>data[max])
                    max = j;
            }
        }

        result[i] = data[max];
    }

    return result;
}

HQIndexFormula.LLV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var min=-10000;

    for(var i=n;i<data.length;++i,++j)
    {
        if(i<n+min)
        {
            min=data[i]>data[min]?min:i;
        }
        else
        {
            for(var j=(min=i-n+1)+1;j<=i;++j)
            {
                if(data[j]<data[min])
                    min = j;
            }
        }
        result[i] = data[min];
    }

    return result;
}

HQIndexFormula.REF=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;
    if (n>=data.length) return result;

    result=data.slice(0,data.length-n);

    for(var i=0;i<n;++i)
        result.unshift(null);

    return result;
}

HQIndexFormula.REFDATE=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;

    //暂时写死取最后一个
    n=data.length-1;
    for(var i in data)
    {
        result[i]=data[n];
    }

    return result;
}



HQIndexFormula.SUM=function(data,n)
{
    var result=[];

    if (n==0)
    {
        result[0]=data[0];

        for (var i=1; i<data.length; ++i)
        {
            result[i] = result[i-1]+data[i];
        }
    }
    else
    {

        for(var i=n-1,j=0;i<data.length;++i,++j)
        {
            for(var k=0;k<n;++k)
            {
                if (k==0) result[i]=data[k+j];
                else result[i]+=data[k+j];
            }
        }
    }

    return result;
}

//两个数组相减
HQIndexFormula.ARRAY_SUBTRACT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null || isNaN(data[i]))
                result[i]=null;
            else
                result[i]=data[i]-data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=data[i]-data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data==data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_EQ=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]==data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i]==data2[i] ? 1:0);
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.ARRAY_IF=function(data,trueData,falseData)
{
    var result=[];
    var IsNumber=[typeof(trueData)=="number",typeof(falseData)=="number"];
    for(var i in data)
    {
        if (data[i])
        {
            if (IsNumber[0]) result[i]=trueData;
            else result[i]=trueData[i];
        }
        else
        {
            if (IsNumber[1]) result[i]=falseData;
            else result[i]=falseData[i];
        }
    }

    return result;
}

HQIndexFormula.ARRAY_AND=function(data,data2)
{
   var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] && data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i] && data2[i] ? 1:0);
            else
                result[i]=0;
        }
    }

    return result;
}
HQIndexFormula.ARRAY_OR=function(data, data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] || data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i < data.length && data[i])
            {
                result[i] = 1;
                continue;
            }
            if (i < data2.length && data2[i])
            {
                result[i] = 1;
                continue;
            }
            result[i] = 0;    
        }
    }

    return result;
}
//数组相乘
//支持多个参数累乘 如:HQIndexFormula.ARRAY_MULTIPLY(data,data2,data3,data3) =data*data2*data3*data4
HQIndexFormula.ARRAY_MULTIPLY=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                if (data[i]==null || isNaN(data[i]))
                    result[i]=null;
                else
                    result[i]=data[i]*data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                    result[i]=data[i]*data2[i];
                else
                    result[i]=null;
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_MULTIPLY(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_MULTIPLY(result,arguments[i]);
    }

    return result;
}

//数组相除
HQIndexFormula.ARRAY_DIVIDE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=data[i]/data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if(data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i]))
                    result[i]=null;
                else if (data2[i]==0)
                    result[i]=null;
                else
                    result[i]=data[i]/data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组相加
//支持多个参数累加 如:HQIndexFormula.ARRAY_ADD(data,data2,data3,data3) =data+data2+data3+data4
HQIndexFormula.ARRAY_ADD=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                result[i]=data[i]+data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                {
                    if (data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i])) result[i]=null
                    else result[i]=data[i]+data2[i];
                }
                else
                {
                    result[i]=null;
                }
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_ADD(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_ADD(result,arguments[i]);
    }

    return result;
}

HQIndexFormula.MAX=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.max(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.max(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.MIN=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.min(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.min(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}


HQIndexFormula.ABS=function(data)
{
    var result=[];
    for(var i in data)
    {
        if (data[i]==null) result[i]=null;
        else result[i]=Math.abs(data[i]);
    }

    return result;
}


HQIndexFormula.MA=function(data,dayCount)
{
    var result=[];

    for (var i = 0, len = data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += data[i - j];
        }
        result[i]=sum / dayCount;
    }
    return result;
}

/*
    加权移动平均
    返回加权移动平均
    用法:EXPMA(X,M):X的M日加权移动平均
    EXPMA[i]=buffer[i]*para+(1-para)*EXPMA[i-1] para=2/(1+__para)
*/
HQIndexFormula.EXPMA=function(data,dayCount)
{
    var result=[];
    if (dayCount>=data.length) return result;

    var i=dayCount;
    for(;i<data.length;++i) //获取第1个有效数据
    {
        if (data[i]!=null)
        {
            result[i]=data[i];
            break;
        }
    }

    for (i=i+1; i < data.length; ++i)
    {
        if (result[i-1]!=null && data[i]!=null)
            result[i]=(2*data[i]+(dayCount-1)*result[i-1])/(dayCount+1);
        else if (result[i-1]!=null)
            result[i]=result[i-1];
    }

    return result;
}

//加权平滑平均,MEMA[i]=SMA[i]*para+(1-para)*SMA[i-1] para=2/(1+__para)
HQIndexFormula.EXPMEMA=function(data,dayCount)
{
    var result=[];
    if (dayCount>=data.length) return result;

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index] && !isNaN(data[index])) break;
    }

    var sum=0;
    for(var i=0; index<data.length && i<dayCount;++i, ++index)
    {
        if (data[index] && !isNaN(data[index]))
            sum+=data[index];
        else
            sum+=data[index-1];
    }

    result[index-1]=sum/dayCount;
    for(;index<data.length;++index)
	{
        if(result[index-1]!=null && data[index]!=null)
            result[index]=(2*data[index]+(dayCount-1)*result[index-1])/(dayCount+1);
        else if(result[index-1]!=null)
            result[index] = result[index-1];
	}

    return result;
}


HQIndexFormula.STD=function(data,n)
{
    var result=[];

    var total=0;
    var averageData=[]; //平均值
    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=data[i-j];
        }

        averageData[i]=total/n;
    }

    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=Math.pow((data[i-j]-averageData[i]),2);
        }

        result[i]=Math.sqrt(total/n);
    }


    return result;
}

//平均绝对方差
HQIndexFormula.AVEDEV=function(data,n)
{
    var result=[];

    var total=0;
    var averageData=[]; //平均值
    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=data[i-j];
        }

        averageData[i]=total/n;
    }

    for(var i=n-1;i<data.length;++i)
    {
        total=0;
        for(var j=0;j<n;++j)
        {
            total+=Math.abs(data[i-j]-averageData[i]);
        }

        result[i]=total/n;
    }


    return result;
}

HQIndexFormula.COUNT=function(data,n)
{
    var result=[];


    for(var i=n-1;i<data.length;++i)
    {
        var count=0;
        for(var j=0;j<n;++j)
        {
            if (data[i-j]) ++count;
        }

        result[i]=count;
    }

    return result;
}

//上穿
HQIndexFormula.CROSS=function(data,data2)
{
    var result=[];
    if (data.length!=data2.length) return result=[];

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index])  && data2[index]!=null && isNaN(data2[index]))
            break;
    }

    for(++index;index<data.length;++index)
    {
        result[index]= (data[index]>data2[index]&&data[index-1]<data2[index-1])?1:0;
    }

    return result;
}

//累乘
HQIndexFormula.MULAR=function(data,n)
{
    var result=[];
    if(data.length<n) return result;

    var index=n;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index]))
        {
            result[index]=data[index];
            break;
        }
    }

    for(++index;index<data.length;++index)
    {
        result[index]=result[index-1]*data[index];
    }

    return result;
}


HQIndexFormula.STICKLINE=function(data,price1,price2)
{
    var result=[];
    if(data.length<=0) return result;

    var IsNumber=typeof(price1)=="number";
    var IsNumber2=typeof(price2)=="number";
   

    for(var i in data)
    {
        result[i]=null;
        if (isNaN(data[i])) continue;
        if (!data[i]) continue;

        if (IsNumber && IsNumber2)
        {
            result[i]={Value:price1,Value2:price2};
        }
        else if (IsNumber && !IsNumber2)
        {
            if (isNaN(price2[i])) continue;
            result[i]={Value:price1,Value2:price2[i]};
        }
        else if (!IsNumber && IsNumber2)
        {
            if (isNaN(price1[i])) continue;
            result[i]={Value:price1[i],Value2:price2};
        }
        else
        {
            if (isNaN(price1[i]) || isNaN(price2[i])) continue;
            result[i]={Value:price1[i],Value2:price2[i]};
        }
    }

    return result;
}



/*
    中国地图
*/


function ChartChinaMap()
{   
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ImageData=null;
    this.Left;
    this.Top;
    this.Width;
    this.Height;
    this.ImageWidth;
    this.ImageHeight;

    this.DefaultColor=[217,222,239];

    this.Color=
    [
        {Name:'海南',       Color:'rgb(217,222,223)'},
        {Name:'内蒙古',     Color:'rgb(217,222,225)'},
        {Name:'新疆',       Color:'rgb(217,222,226)'},
        {Name:'青海',       Color:'rgb(217,222,227)'},
        {Name:'西藏',       Color:'rgb(217,222,228)'},
        {Name:'云南',       Color:'rgb(217,222,229)'},
        {Name:'黑龙江',     Color:'rgb(217,222,230)'},
        {Name:'吉林',       Color:'rgb(217,222,231)'},
        {Name:'辽宁',       Color:'rgb(217,222,232)'},
        {Name:'河北',       Color:'rgb(217,222,233)'},
        {Name:'山东',       Color:'rgb(217,222,234)'},
        {Name:'江苏',       Color:'rgb(217,222,235)'},
        {Name:'浙江',       Color:'rgb(217,222,236)'},
        {Name:'福建',       Color:'rgb(217,222,237)'},
        {Name:'广东',       Color:'rgb(217,222,238)'},
        {Name:'广西',       Color:'rgb(217,222,239)'},
        {Name:'贵州',       Color:'rgb(217,222,240)'},
        {Name:'湖南',       Color:'rgb(217,222,241)'},
        {Name:'江西',       Color:'rgb(217,222,242)'},
        {Name:'安徽',       Color:'rgb(217,222,243)'},
        {Name:'湖北',       Color:'rgb(217,222,244)'},
        {Name:'重庆',       Color:'rgb(217,222,245)'},
        {Name:'四川',       Color:'rgb(217,222,246)'},
        {Name:'甘肃',       Color:'rgb(217,222,247)'},
        {Name:'陕西',       Color:'rgb(217,222,248)'},
        {Name:'山西',       Color:'rgb(217,222,249)'},
        {Name:'河南',       Color:'rgb(217,222,250)'}
    ];

    this.Draw=function()
    {
        let left=this.ChartBorder.GetLeft()+1;
        let right=this.ChartBorder.GetRight()-1;
        let top=this.ChartBorder.GetTop()+1;
        let bottom=this.ChartBorder.GetBottom()-1;
        let width=this.ChartBorder.GetWidth()-2;
        let height=this.ChartBorder.GetHeight()-2;

        let imageWidth=CHINA_MAP_IMAGE.width;
        let imageHeight=CHINA_MAP_IMAGE.height;

        let drawImageWidth=imageWidth;
        let drawImageHeight=imageHeight;

        if (height<drawImageHeight || width<drawImageWidth) 
        {
            this.ImageData=null;
            return;
        }

        if (this.Left!=left || this.Top!=top || this.Width!=width || this.Height!=height || this.ImageWidth!=imageWidth || this.ImageHeight!=imageHeight)
        {
            this.ImageData=null;

            this.ImageWidth=imageWidth;
            this.ImageHeight=imageHeight;
            this.Left=left;
            this.Top=top;
            this.Width=width;
            this.Height=height;

            JSConsole.Chart.Log(imageWidth,imageHeight);
        }
        
        if (this.ImageData==null)
        {
            this.Canvas.drawImage(CHINA_MAP_IMAGE,0,0,imageWidth,imageHeight,left,top,drawImageWidth,drawImageHeight);
            this.ImageData=this.Canvas.getImageData(left,top,drawImageWidth,drawImageHeight);

            let defaultColorSet=new Set();  //默认颜色填充的色块
            let colorMap=new Map();         //定义颜色填充的色块

            let nameMap=new Map();
            if (this.Data.length>0)
            {
                for(let i in this.Data)
                {
                    let item=this.Data[i];
                    nameMap.set(item.Name,item.Color)
                }
            }

            JSConsole.Chart.Log(this.Data);
            for(let i in this.Color)
            {
                let item=this.Color[i];
                if (nameMap.has(item.Name))
                {
                    colorMap.set(item.Color,nameMap.get(item.Name));
                }
                else
                {
                    defaultColorSet.add(item.Color);
                }
            }

            var color;
            for (let i=0;i<this.ImageData.data.length;i+=4)
            {
                color='rgb('+ this.ImageData.data[i] + ',' + this.ImageData.data[i+1] + ',' + this.ImageData.data[i+2] + ')';

                if (defaultColorSet.has(color))
                {
                    this.ImageData.data[i]=this.DefaultColor[0];
                    this.ImageData.data[i+1]=this.DefaultColor[1];
                    this.ImageData.data[i+2]=this.DefaultColor[2];
                }
                else if (colorMap.has(color))
                {
                    let colorValue=colorMap.get(color);
                    this.ImageData.data[i]=colorValue[0];
                    this.ImageData.data[i+1]=colorValue[1];
                    this.ImageData.data[i+2]=colorValue[2];
                }
            }
            this.Canvas.clearRect(left,top,drawImageWidth,drawImageHeight);
            this.Canvas.putImageData(this.ImageData,left,top,0,0,drawImageWidth,drawImageHeight);
        }
        else
        {
            this.Canvas.putImageData(this.ImageData,left,top,0,0,drawImageWidth,drawImageHeight);
        }
    }
}



/*
    饼图
*/
function ChartPie()
{   
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Radius = 100; //半径默认值
    this.Distance = 30; //指示线超出圆饼的距离
    this.txtLine = 20; // 文本下划线
    this.paddingX = 20 / 3;// 设置文本的移动
    
    // return;
    this.Draw=function()
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length>0)) return this.DrawEmptyData();

        let left=this.ChartBorder.GetLeft();
        let right=this.ChartBorder.GetRight();
        let top=this.ChartBorder.GetTop();
        let bottom=this.ChartBorder.GetBottom();
        let width=this.ChartBorder.GetWidth();
        let height=this.ChartBorder.GetHeight();

        if(isNaN(this.Radius)){
            let str = this.Radius.replace("%","");
            str = str/100;
            if(width >= height){
                this.Radius = str*height;
            }
            if(width < height) this.Radius = str*width;
        }


        this.Canvas.save();
        this.Canvas.translate(width/2,height/2);

        let totalValue=0;   //求和
        for(let i in this.Data.Data)
        {
            totalValue += this.Data.Data[i].Value;
        }
        let start = 0;
        let end = 0;
        //画饼图
        for(let i in this.Data.Data)
        {
            let item =this.Data.Data[i];
            let rate=(item.Value/totalValue).toFixed(2); //占比
            //JSConsole.Chart.Log('[ChartPie::Draw]', i, rate, item);

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0,0);

            end += rate*2*Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0,0,this.Radius,start,end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();
            
            // 绘制直线
            this.Canvas.beginPath();
            this.Canvas.strokeStyle = item.Color;
            this.Canvas.moveTo(0,0);
            let x = (this.Radius + this.Distance)*Math.cos(end- (end-start)/2);
            let y = (this.Radius + this.Distance)*Math.sin(end - (end-start)/2);
            this.Canvas.lineTo(x,y);
            // JSConsole.Chart.Log(x,y,"xy")
            
            // 绘制横线
            let txtLine = this.txtLine;
            let paddingX = this.paddingX;
            this.Canvas.textAlign = 'left';
            if( end - (end-start)/2 < 1.5*Math.PI && end - (end-start)/2 > 0.5*Math.PI ){
                
                txtLine = - this.txtLine;
                paddingX = - this.paddingX;
                this.Canvas.textAlign = 'right';
            }
            this.Canvas.lineTo( x + txtLine, y );
            this.Canvas.stroke();

             // 写文字
             if(item.Text){
                 this.Canvas.fillText( item.Text, x + txtLine + paddingX, y );
             }else{
                 let text = `${item.Name}:${item.Value}`;
                 this.Canvas.fillText( text, x + txtLine + paddingX, y );
             }
            

            start += rate*2*Math.PI;//起始角度
        }

        this.Canvas.restore();
    }

    //空数据
    this.DrawEmptyData=function()
    {
        JSConsole.Chart.Log('[ChartPie::DrawEmptyData]')
    }
}


/*
    雷达图
*/
function ChartRadar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BorderPoint=[];    //边框点
    this.DataPoint=[];      //数据点
    this.CenterPoint={};
    this.StartAngle=0;
    this.Color='rgb(198,198,198)';
    this.AreaColor='rgba(242,154,118,0.4)';    //面积图颜色
    this.AreaLineColor='rgb(242,154,118)';
    this.TitleFont=24*GetDevicePixelRatio()+'px 微软雅黑';
    this.TitleColor='rgb(102,102,102)';
    this.BGColor = ['rgb(255,255,255)', 'rgb(224,224,224)']//背景色

    this.DrawBorder=function()  //画边框
    {
        if (this.BorderPoint.length<=0) return;

        this.Canvas.font=this.TitleFont;
        this.Canvas.strokeStyle = this.Color;
        const aryBorder=[1,0.8,0.6,0.4,0.2];
        for (let j in aryBorder)
        {
            var rate = aryBorder[j];
            var isFirstDraw=true;
            for(let i in this.BorderPoint)
            {
                var item=this.BorderPoint[i];
                item.X = this.CenterPoint.X + item.Radius * Math.cos(item.Angle * Math.PI / 180) * rate;
                item.Y = this.CenterPoint.Y + item.Radius * Math.sin(item.Angle * Math.PI / 180) * rate;
                if (isFirstDraw)
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(item.X,item.Y);
                    isFirstDraw=false;
                }
                else
                {
                    this.Canvas.lineTo(item.X,item.Y);
                }
            }

            this.Canvas.closePath();
            this.Canvas.stroke();
            this.Canvas.fillStyle = this.BGColor[j%2==0?0:1];
            this.Canvas.fill();
        }

        this.Canvas.beginPath();
        for(let i in this.BorderPoint)
        {
            var item=this.BorderPoint[i];
            item.X = this.CenterPoint.X + item.Radius * Math.cos(item.Angle * Math.PI / 180);
            item.Y = this.CenterPoint.Y + item.Radius * Math.sin(item.Angle * Math.PI / 180);
            this.Canvas.moveTo(this.CenterPoint.X,this.CenterPoint.Y);
            this.Canvas.lineTo(item.X,item.Y);
            this.DrawText(item);
        }
        this.Canvas.stroke();
    }

    this.DrawArea=function()
    {
        if (!this.DataPoint || this.DataPoint.length<=0) return;

        this.Canvas.fillStyle = this.AreaColor;
        this.Canvas.strokeStyle = this.AreaLineColor;
        this.Canvas.beginPath();
        var isFirstDraw=true;
        for(let i in this.DataPoint)
        {
            var item=this.DataPoint[i];
            if (isFirstDraw)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(item.X,item.Y);
                isFirstDraw=false;
            }
            else
            {
                this.Canvas.lineTo(item.X,item.Y);
            }
        }

        this.Canvas.closePath();
        this.Canvas.fill();
        this.Canvas.stroke();
    }

    this.DrawText=function(item)
    {
        if (!item.Text) return;
          
        //JSConsole.Chart.Log(item.Text, item.Angle);
        this.Canvas.fillStyle = this.TitleColor;
        var xText = item.X, yText = item.Y;

        //显示每个角度的位置
        if (item.Angle > 0 && item.Angle < 45) {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'middle';
            xText += 2;
        }
        else if (item.Angle >= 0 && item.Angle < 90) {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'top';
            xText += 2;
        }
        else if (item.Angle >= 90 && item.Angle < 135) {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'top';
            xText -= 2;
        }
        else if (item.Angle >= 135 && item.Angle < 180) {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'top';
            xText -= 2;
        }
        else if (item.Angle >= 180 && item.Angle < 225) {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'middle';
            xText -= 2;
        }
        else if (item.Angle >= 225 && item.Angle <= 270) {
            this.Canvas.textAlign = 'center';
            this.Canvas.textBaseline = 'bottom';
        }
        else if (item.Angle > 270 && item.Angle < 315) {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'bottom';
            xText += 2;
        }
        else {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'middle';
            xText += 2;
        }

        this.Canvas.fillText(item.Text, xText, yText);
    }

    this.Draw=function()
    {
        this.BorderPoint=[];
        this.DataPoint=[];
        this.CenterPoint={};
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length>0))
            this.CalculatePoints(null);
        else 
            this.CalculatePoints(this.Data.Data);

        this.DrawBorder();
        this.DrawArea();
    }

    this.CalculatePoints=function(data)
    {
        let left=this.ChartBorder.GetLeft();
        let right=this.ChartBorder.GetRight();
        let top=this.ChartBorder.GetTop();
        let bottom=this.ChartBorder.GetBottom();
        let width=this.ChartBorder.GetWidth();
        let height=this.ChartBorder.GetHeight();

        let ptCenter={X:left+width/2, Y:top+height/2};  //中心点
        let radius=Math.min(width/2,height/2)-2         //半径
        let count=Math.max(5,data?data.length:0);
        let averageAngle=360/count;
        for(let i=0;i<count;++i)
        {
            let ptBorder = { Index: i, Radius: radius, Angle: i * averageAngle + this.StartAngle };
            let angle = ptBorder.Angle;

            if (data && i<data.length)
            {
                var item=data[i];
                let ptData={Index:i,Text:item.Text};
                ptBorder.Text=item.Name;
                if (!item.Value)
                {
                    ptData.X=ptCenter.X;
                    ptData.Y=ptCenter.Y;
                } 
                else
                {
                    var value=item.Value;
                    if (value>=1) value=1;
                    var dataRadius=radius*value;
                    ptData.X=ptCenter.X+dataRadius*Math.cos(angle*Math.PI/180);
                    ptData.Y=ptCenter.Y+dataRadius*Math.sin(angle*Math.PI/180);
                }

                this.DataPoint.push(ptData);
            }

            this.BorderPoint.push(ptBorder);
        }

        this.CenterPoint=ptCenter;
    }

    //空数据
    this.DrawEmptyData=function()
    {
        JSConsole.Chart.Log('[ChartPie::DrawEmptyData]')
    }
}
