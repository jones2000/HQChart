
/////////////////////////////////////////////////////////////////////
//  模拟测试数据V2
//  
//
/////////////////////////////////////////////////////////////////////
import { JSNetwork } from "./umychart.network.wechart.js"

var TEST_URL="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.testdata/";

function HQData()  { }

HQData.Explain="本地测试数据";

HQData.NetworkFilter=function(data, callback)
{
    console.log(`[HQData::NetworkFilter] ${HQData.Explain}`, data);

    switch(data.Name) 
    {
        case 'MinuteChartContainer::RequestMinuteData':                 //分时图数据对接
            HQData.Minute_RequestMinuteData(data, callback);
            break;
        case "MinuteChartContainer::RequestHistoryMinuteData":          //多日分时图
            HQData.Minute_RequestHistoryMinuteData(data, callback);
            break;

        case "MinuteChartContainer::RequestOverlayMinuteData":
            HQData.Minute_RequestOverlayMinuteData(data, callback);
            break;

        case "MinuteChartContainer::RequestOverlayHistoryMinuteData":
            HQData.Minute_RequestOverlayHistoryMinuteData(data, callback);
            break;

        case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
            HQData.RequestHistoryData(data,callback);
            break;
        case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
            HQData.RequestRealtimeData(data,callback);
            break;
        case 'KLineChartContainer::RequestFlowCapitalData':             //流通股本
            HQData.RequestFlowCapitalData(data,callback);
            break;

        case "APIScriptIndex::ExecuteScript":                       //后台指标
            HQData.RequestAPIIndexData(data,callback);
            break;

        case "KLineChartContainer::RequestOverlayHistoryData":          //叠加股票
            //HQChart使用教程30-K线图如何对接第3方数据16-日K叠加股票
            HQData.RequestOverlayHistoryData(data, callback);
            break;

        case "KLineChartContainer::RequestOverlayHistoryMinuteData":
            //HQChart使用教程30-K线图如何对接第3方数据17- 分钟K叠加股票
            HQData.RequestOverlayHistoryMinuteData(data, callback);
            break;

        case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
            HQData.RequestHistoryMinuteData(data, callback);
            break;
        case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
            HQData.RequestMinuteRealtimeData(data,callback);
            break;

        case "KLineChartContainer::RequestDragDayData":              //拖动下载
            HQData.RequestDragDayData(data, callback);
            break;

        case "KLineChartContainer::RequestDragMinuteData":           //分钟拖动下载
            HQData.RequestDragMinuteData(data, callback);
            break;

        case "JSSymbolData::GetVariantData":                            //额外的变量数据
            HQData.RequestIndexVariantData(data,callback);
            break;

        case "JSSymbolData::GetOtherSymbolData":
            HQData.RequestOtherSymbolData(data, callback);
            break;

        case "AnnouncementInfo::RequestData":
            HQData.AnnouncementInfo_RequestData(data,callback);
            break;

        case "PforecastInfo::RequestData":
            HQData.PforecastInfo_RequestData(data,callback);
            break;

        case "InvestorInfo::RequestData":
            HQData.InvestorInfo_RequestData(data,callback);
            break;

        case "ResearchInfo::RequestData":
            break;

        case "BlockTrading::RequestData":
            HQData.BlockTrading_RequestData(data,callback);
            break;

        case "TradeDetail::RequestData":
            HQData.TradeDetail_RequestData(data,callback);
            break;

        case "JSSymbolData::GetGPJYValue":
            HQData.GPJYValue_RequestData(data,callback);
            break;
        case "JSSymbolData::GetSCJYValue":
            HQData.SCJYValue_RequestData(data,callback);
            break;
        case "JSSymbolData::GetBKJYValue":
            HQData.BKJYValue_RequestData(data,callback);
            break;

        case "JSSymbolData::GetGPJYOne":
            HQData.GPJYOne_RequestData(data,callback);
            break;
        case "JSSymbolData::GetSCJYOne":
            HQData.SCJYOne_RequestData(data,callback);
            break;
        case "JSSymbolData::GetBKJYOne":
            HQData.BKJYOne_RequestData(data,callback);
            break;
        case "JSSymbolData::GetFinValue":
            HQData.FinValue_RequestData(data,callback);
            break;
        case "JSSymbolData::GetFinOne":
            HQData.FinOne_RequestData(data,callback);
            break;
    }
}



HQData.Minute_RequestMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var dayCount=data.Request.Data.daycount;
    console.log(`[HQData::Minute_RequestMinuteData] Symbol=${symbol}`);

    this.GetDayMinuteDataBySymbol(symbol, (fullData)=>
    {
        var stockItem=fullData[0];
        //stockItem.minute.length=20;
        var hqchartData={ code:0, name:symbol, symbol: symbol, stock:[stockItem]};
    
        callback({data:hqchartData});
    });
    
}

HQData.Minute_RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
    var dayCount=data.Request.Data.daycount;
    console.log(`[HQData::Minute_RequestHistoryMinuteData] Symbol=${symbol}`);

    this.GetMulitDayMinuteDataBySymbol(symbol, (fullData)=>
    {
        var hqchartData={ code:0, data:[], name:symbol, symbol: symbol };

        var start=fullData.length-dayCount;
        if (start<0) start=0;
    
        hqchartData.data=fullData.slice(start);
        
        callback({data:hqchartData});
    });
  
}

HQData.Minute_RequestOverlayMinuteData=function (data, callback) 
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var date=data.Request.Data.days[0];

    HQData.GetMulitDayMinuteDataBySymbol(symbol,(fullData)=>
    {
        var aryDay=HQData.GetMulitDayMinuteDataByDate(fullData, [date]);

        var hqchartData={ code:0, data:aryDay, name:symbol, symbol:symbol  };
        callback({data:hqchartData});
    });
    
}

HQData.Minute_RequestOverlayHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var aryDate=data.Request.Data.days;
    HQData.GetMulitDayMinuteDataBySymbol(symbol, (fullData)=>
    {
        var aryDay=HQData.GetMulitDayMinuteDataByDate(fullData, aryDate);
        var hqchartData={ code:0, data:aryDay, name:symbol, symbol:symbol  };
        callback({data:hqchartData});
    });
    
}

HQData.RequestHistoryData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
    var count=data.Request.Data.count
    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);
    
    var hqchart=data.Self;
   HQData.GetDayKLineDataBySymbol(symbol, (fullData)=>
    {
        var aryData=[];
        if (HQData.IsNonEmptyArray(fullData))
        {
            var dataCount=fullData.length;
            var start=dataCount-count;
            if (start<0) start=0;
            aryData=fullData.slice(start);
        }

        //生成流通股测试数据
        var testFlowCapital=28103805551;
        for(var i=0;i<aryData.length;++i)
        {
            var kItem=aryData[i];
            kItem[15]=testFlowCapital;
            
            if (i%2==0) testFlowCapital+=HQData.GetRandomTestData(0,2000);
            else testFlowCapital-=HQData.GetRandomTestData(0,2000);
        }

        var hqchartData={ name:symbol, symbol:symbol, data:aryData, ver:2.0 };

        hqchart.FlowCapitalReady=true;
        callback({data:hqchartData});
    });
}

HQData.RequestFlowCapitalData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码

    console.log(`[HQData::RequestFlowCapitalData] Symbol=${symbol}`);

    var hqchartData=KLINE_CAPITAL_DATA;
    callback({data:hqchartData});
}

HQData.RequestRealtimeData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var end=data.Request.Data.dateRange.End;
    var endDate=end.Date;
    var aryStock=[];

    for(var i=0;i<data.Request.Data.symbol.length;++i)
    {
        var item=data.Request.Data.symbol[i];
        HQData.GetDayKLineDataBySymbol(item, (fullData, symbol)=>
        {
            if (!HQData.IsNonEmptyArray(fullData)) return;

            var aryData=HQData.GetKLineDataByDate(fullData, endDate, 20999999);
            if (!HQData.IsNonEmptyArray(aryData)) return;
    
            var kItem=aryData[0];
            var price=kItem[5];
            var value=Math.ceil(Math.random()*10)/1000*price;
            var bUp=Math.ceil(Math.random()*10)>=5;
            if (bUp) price+=value;
            else price-=value;
    
            var stockItem={ symbol:symbol, name:symbol };
            stockItem.date=kItem[0];
            stockItem.yclose=kItem[1];
            stockItem.open=kItem[2];
            stockItem.high=Math.max(kItem[3],price);
            stockItem.low=Math.min(kItem[4],price);
            stockItem.price=price;
            stockItem.vol=kItem[6];
            stockItem.amount=kItem[7];
    
            aryStock.push(stockItem);

            if (aryStock.length==data.Request.Data.symbol.length)
            {
                var hqchartData={ code:0, stock:aryStock };
                callback({data:hqchartData});
            }
        });
        
    }
}


HQData.RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
    var count=data.Request.Data.count*200;  //请求的数据长度

    console.log(`[HQData::RequestHistoryMinuteData] Symbol=${symbol}`);

    HQData.GetM1KLineDataBySymbol(symbol, (fullData)=>
    {
        var aryData=[];
        if (HQData.IsNonEmptyArray(fullData))
        {
            var dataCount=fullData.length;
            var start=dataCount-count;
            if (start<0) start=0;
            aryData=fullData.slice(start);
        }
    
        var hqchartData={ name:symbol, symbol:symbol, data:aryData, ver:2.0 };
    
        callback({data:hqchartData});
    });
}


HQData.RequestMinuteRealtimeData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var end=data.Request.Data.dateRange.End;
    var endDate=end.Date;
    var endTime=end.Time;

    console.log(`[HQData::RequestMinuteRealtimeData] Symbol=${symbol}`);

    var aryOverlay=[ ];     //叠加
    var aryMainData=[];     //主图
    var recvCount=0;
    for(var i=0;i<data.Request.Data.symbol.length;++i)
    {
        var symbol=data.Request.Data.symbol[i];
        HQData.GetM1KLineDataBySymbol(symbol, (fullData, code)=>
        {
            ++recvCount;

            if (!HQData.IsNonEmptyArray(fullData)) return;

            var aryData=HQData.GetKLineDataByDateTime(fullData, endDate, endTime, 20999999, 9999);
            if (!HQData.IsNonEmptyArray(aryData)) return;
    
            var kItem=JSON.parse(JSON.stringify(aryData[0]));
    
            //生成随机测试数据
            var price=kItem[5];
            var value=Math.ceil(Math.random()*10)/10000*price;
            var bUp=Math.ceil(Math.random()*10)>=5;
            
            if (bUp) price+=value;
            else price-=value;
            kItem[5]=price;
            kItem[3]=Math.max(price, kItem[3]);
            kItem[4]=Math.min(price, kItem[4]);
    
            if (recvCount==1)
            {
                aryMainData.push(kItem);
            }
            else
            {
                var stock={ data:[kItem], symbol:code, name:code };
                aryOverlay.push(stock);
            }           

            if (recvCount==data.Request.Data.symbol.length)
            {
                var hqchartData={ name:symbol, symbol:symbol, ver:2.0, data:aryMainData };
                if (HQData.IsNonEmptyArray(aryOverlay)) hqchartData.overlay=aryOverlay;
                callback({data:hqchartData});
            }
        });
       
    }

   
   
   
}


HQData.RequestIndexVariantData=function(data,callback)
{
    var varName=data.Request.Data.VariantName;  //变量名称
    if (varName=="FROMOPEN") 
    {
        var hqchartData={  };
        //单数据
        hqchartData.Data={ Date:20230707, Value:240 };
        hqchartData.DataType=1;
        callback({data:hqchartData});
    }

}

HQData.RequestOtherSymbolData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var period=data.Request.Data.period;
    var right=data.Request.Data.right;
    var hqchartData=null;
    if (ChartData.IsDayPeriod(period,true)) hqchartData=KLINE_DAY_DATA2;
    else if (ChartData.IsMinutePeriod(period,true)) hqchartData=KLINE_MINUTE_DATA2;
    hqchartData.name=symbol;
    hqchartData.symbol=symbol;
    callback({data:hqchartData});
}

HQData.AnnouncementInfo_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    var hqchartData={ symbol:symbol, report:[] };

    var kData=data.HQChart.ChartPaint[0].Data;
    for(var i=0, j=1;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%10!=4) continue;

        var itemReport={ releasedate:kItem.Date, time:kItem.Time, title:`公告(${j}) xxxx`, }

        hqchartData.report.push(itemReport);

        ++j;
    }

    callback({data:hqchartData});
}


HQData.PforecastInfo_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    var hqchartData={ symbol:symbol, report:[] };

    var kData=data.HQChart.ChartPaint[0].Data;
    for(var i=0, j=1;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%10!=4) continue;

        var itemReport={ date:kItem.Date, time:kItem.Time, title:`公告(${j}) xxxx`, }

        hqchartData.report.push(itemReport);

        ++j;
    }

    callback({data:hqchartData});
}

HQData.InvestorInfo_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback({data:TEST_NEWSINTERACT_DATA});
}

HQData.BlockTrading_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback({data:TEST_BLOCK_TRADING_DATA});
}

HQData.TradeDetail_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback({data:TEST_TRADE_DETAL_DATA});
}

//GPJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据(取1或2),TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理;2表示没有数据则为0.
HQData.GPJYValue_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var type=data.Request.Data.Args[2];

    var aryData=[];
    var kData=data.Self.Data;
    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%50==15)
        {
            var value=HQData.GetRandomTestData(10,100)
            aryData.push({ Date:kItem.Date, Time:kItem.Time, Value:value });
        }
    }
    
    callback(aryData);
}

HQData.SCJYValue_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var type=data.Request.Data.Args[2];

    var aryData=[];
    var kData=data.Self.Data;
    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%50==20)
        {
            var value=HQData.GetRandomTestData(1000,2000)
            aryData.push({ Date:kItem.Date, Time:kItem.Time, Value:value });
        }
    }
    
    callback(aryData);
}

HQData.BKJYValue_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var type=data.Request.Data.Args[2];

    var aryData=[];
    var kData=data.Self.Data;
    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%60==33)
        {
            var value=HQData.GetRandomTestData(500,1000)
            aryData.push({ Date:kItem.Date, Time:kItem.Time, Value:value });
        }
    }
    
    callback(aryData);
}

HQData.GPJYOne_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var year=data.Request.Data.Args[2];
    var day=data.Request.Data.Args[3];

    var value=HQData.GetRandomTestData(800,1200);
    callback({ Date:20230509, Value:value});
}

HQData.SCJYOne_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var year=data.Request.Data.Args[2];
    var day=data.Request.Data.Args[3];

    var value=HQData.GetRandomTestData(400,500);
    callback({ Date:20230509, Value:value});
}

HQData.BKJYOne_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var n=data.Request.Data.Args[1];
    var year=data.Request.Data.Args[2];
    var day=data.Request.Data.Args[3];

    var value=HQData.GetRandomTestData(900,2000);
    callback({ Date:20230509, Value:value});
}

HQData.FinValue_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];

    var aryData=[];
    var kData=data.Self.Data;
    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%60==21)
        {
            var value=HQData.GetRandomTestData(10,20)
            aryData.push({ Date:kItem.Date, Time:kItem.Time, Value:value });
        }
    }
    
    callback(aryData);
}

HQData.FinOne_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var id=data.Request.Data.Args[0];
    var year=data.Request.Data.Args[1];
    var day=data.Request.Data.Args[2];

    var value=HQData.GetRandomTestData(80,90);
    callback({ Date:20230509, Value:value});
}

HQData.RequestOverlayHistoryData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var first=data.Request.Data.first;
    var fullData=HQData.GetDayKLineDataBySymbol(symbol, (fullData)=>
    {
        var aryData=[];
        if (HQData.IsNonEmptyArray(fullData))
        {
            aryData=HQData.GetKLineDataByDate(fullData, first.date, 20999999)
        }
    
        var hqchartData={  code:0, symbol: symbol,name: symbol, ver:2.0, data:aryData };
    
        callback({data:hqchartData});
    });
    
}

HQData.RequestOverlayHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var first=data.Request.Data.first;
    var aryData=[];
   
    HQData.GetM1KLineDataBySymbol(symbol, (fullData, symbol)=>
    {
        if (fullData)
        {
            aryData=HQData.GetKLineDataByDateTime(fullData, first.date, first.time, 20999999, 9999)
        }
    
        var hqchartData={  symbol: symbol,name: symbol, ver:2.0, data:aryData };
    
        callback({data:hqchartData});
    });
   
}

HQData.RequestDragDayData=function(data, callback)
{
    data.PreventDefault=true;
    var dataCount=data.Option.XShowCount;
    var symbol=data.Request.Data.symbol;        //请求的股票代码
    var firstDateTime=data.Request.Data.first;
    var aryOverlay=data.Request.Data.overlay;   //叠加股票

    console.log(`[HQData::RequestDragDayData] Symbol=${symbol} date=${firstDateTime.date} time=${firstDateTime.time}`);

    var self=data.Self;
    self.IsOnTouch = false;
    self.LastMovePoint=null;

    var option=data.Option;
    var title=`拖动下载数据中...... 起始位置 ${firstDateTime.date}, 下载数据个数${dataCount}`
    self.EnableSplashScreen({Title:title, Draw:true });

   
    var findIndex=-1;
    var date=firstDateTime.date;
    HQData.GetDayKLineDataBySymbol(symbol, (fullData)=>
    {
        if (date==null) 
        {
            findIndex=fullData.length-1;
        }
        else
        {
            for(var i=0;i<fullData.length;++i)
            {
                var kItem=fullData[i];
                var value=kItem[0];
                if (value>=date)
                {
                    findIndex=i;
                    break;
                }
            }
        }
            
        if (findIndex<=0)   //数据到头了
        {
            var hqchartData={ name:symbol, symbol:symbol, code:0, ver:2, data:[] };
            self.ChartSplashPaint.EnableSplash(false);
            callback(hqchartData);
            alert("数据到头了，没有数据了!!")
            return;   
        }

        var downloadCount=100;  //下载100个数据
        var startIndex=findIndex-downloadCount;
        if (startIndex<0) startIndex=0;
        var hqchartData={ name:symbol, symbol:symbol, code:0, ver:2, data:[] };
        for(var i=startIndex; i<findIndex; ++i)
        {
            hqchartData.data.push(fullData[i]);
        }
    
        option.DataOffset=-parseInt(dataCount/2); //当前屏数据往前移动
       

        console.log('[HQData::RequestDragDayData] ', hqchartData);

        if (HQData.IsNonEmptyArray(aryOverlay))
        {
            hqchartData.overlay=[];
            var startDate=hqchartData.data[0][0];
            var endDate=hqchartData.data[hqchartData.data.length-1][0];
            for(var i=0;i<aryOverlay.length;++i)
            {
                var item=aryOverlay[i];
                HQData.GetDayKLineDataBySymbol(item.symbol, (overlayFullData, code)=>
                {
                    var aryData=HQData.GetKLineDataByDate(overlayFullData, startDate, endDate);
                    hqchartData.overlay.push({ symbol:code, name:code, data:aryData});

                    if (hqchartData.overlay.length==aryOverlay.length)
                    {
                        self.ChartSplashPaint.EnableSplash(false);
                        callback({data:hqchartData});
                    }
                });
                
            }
        }
        else
        {
            self.ChartSplashPaint.EnableSplash(false);
            callback({data:hqchartData});
        }
    });

}


HQData.RequestDragMinuteData=function (data, callback) 
{
    data.PreventDefault=true;
    var dataCount=data.Option.XShowCount;
    var symbol=data.Request.Data.symbol;        //请求的股票代码
    var firstDateTime=data.Request.Data.first;
    var aryOverlay=data.Request.Data.overlay;   //叠加股票

    console.log(`[HQData::RequestDragMinuteData] Symbol=${symbol} date=${firstDateTime.date} time=${firstDateTime.time}`);

    var self=data.Self;
    self.IsOnTouch = false;
    self.LastMovePoint=null;
    var option=data.Option;
    var title=`拖动下载数据中...... 起始位置 ${firstDateTime.date} ${firstDateTime.time}, 下载数据个数${dataCount}`
    self.EnableSplashScreen({ Title:title, Draw:true });

   
    HQData.GetM1KLineDataBySymbol(symbol, (fullData)=>
    {
        var findIndex=-1;
        if (firstDateTime.date==null)
        {
            findIndex=fullData.length-1;
        }
        else
        {
            var dateTime=firstDateTime.date*10000+firstDateTime.time;
            for(var i=0;i<fullData.length;++i)
            {
                var kItem=fullData[i];
                var value=kItem[0]*10000+kItem[8];
                if (value>=dateTime)
                {
                    findIndex=i;
                    break;
                }
            }
        }
        
        if (findIndex<=0)   //数据到头了
        {
            var hqchartData={ name:symbol, symbol:symbol, code:0, ver:2, data:[] };
            self.ChartSplashPaint.EnableSplash(false);
            callback(hqchartData);
            alert("数据到头了，没有数据了!!")
            return;   
        }

        var donwloadCount=100;
        var startIndex=findIndex-donwloadCount;
        if (startIndex<0) startIndex=0;
        var hqchartData={ name:symbol, symbol:symbol, code:0, ver:2, data:[] };
        for(var i=startIndex; i<findIndex; ++i)
        {
            hqchartData.data.push(fullData[i]);
        }

        option.DataOffset=-parseInt(dataCount/2); //当前屏数据往前移动

        if (HQData.IsNonEmptyArray(aryOverlay))
        {
            hqchartData.overlay=[];
            var startDate=hqchartData.data[0][0];
            var startTime=hqchartData.data[0][8]
            var endDate=hqchartData.data[hqchartData.data.length-1][0];
            var endTime=hqchartData.data[hqchartData.data.length-1][8];
            for(var i=0;i<aryOverlay.length;++i)
            {
                var item=aryOverlay[i];
                HQData.GetM1KLineDataBySymbol(item.symbol, (overlyFullData, code)=>
                {
                    var aryData=this.GetKLineDataByDateTime(overlyFullData, startDate, startTime ,endDate, endTime);
                    hqchartData.overlay.push({ symbol:code, name:code, data:aryData});

                    if (hqchartData.overlay.length==aryOverlay.length)
                    {
                        self.ChartSplashPaint.EnableSplash(false);
                        console.log('[KLineChart::RequestDragMinuteData] ', hqchartData);
                        callback({data:hqchartData});
                    }
                });
            }
        }
        else
        {
            self.ChartSplashPaint.EnableSplash(false);
            console.log('[KLineChart::RequestDragMinuteData] ', hqchartData);
            callback({data:hqchartData});
        }

    });
    
}


HQData.GetRandomTestData=function(min, max)   //测试数据
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

HQData.GetM1KLineDataBySymbol=function(symbol, callback)
{
    var value=symbol;
    switch(symbol)
    {
        case "000001.sh":
        case "000300.sh":
        case "399001.sz":
        case "000001.sz":
        case "600000.sh":
        case "000151.sz":
        case "399005.sz":
        case "399006.sz":
            break;
        default:
            value="000001.sh"
            break;
    }

    var url=`${TEST_URL}M1KLine/${value}.minute.kline.json`;
    JSNetwork.HttpRequest({
        url: url,
        method: "get",
        dataType: "json",
        success: function (data) 
        {
            callback(data.data.data, symbol);
        }
        });
}

HQData.GetDayKLineDataBySymbol=function(symbol, callback)
{
    var value=symbol;
    switch(symbol)
    {
        case "000001.sh":
        case "000300.sh":
        case "399001.sz":
        case "000001.sz":
        case "600000.sh":
        case "000151.sz":
        case "399005.sz":
        case "399006.sz":
            break;
        default:
            value="000001.sh"
            break;
    }

    var url=`${TEST_URL}DayKLine/${value}.day.kline.json`;

    JSNetwork.HttpRequest({
        url: url,
        method: "get",
        dataType: "json",
        success: function (data) 
        {
            callback(data.data.data, symbol);
        }
        });
}

HQData.GetKLineDataByDateTime=function(fullData, startDate, startTime, endDate, endTime)
{
    var start=startDate*10000+startTime;
    var end=endDate*10000+endTime;

    var aryData=[];
    for(var i=0;i<fullData.length;++i)
    {
        var kItem=fullData[i];
        var date=kItem[0];
        var time=kItem[8];
        var dateTime=date*10000+time;
        if (dateTime>=start && dateTime<=end)
            aryData.push(kItem);
    }

    return aryData;
}

HQData.GetKLineDataByDate=function(fullData, startDate, endDate)
{
    var aryData=[];
    for(var i=0;i<fullData.length;++i)
    {
        var kItem=fullData[i];
        var date=kItem[0];
        kItem[15]=29352177224;
        if (date>=startDate && date<=endDate)
            aryData.push(kItem);
    }

    return aryData;
}

HQData.GetMulitDayMinuteDataBySymbol=function(symbol, callback)
{ 
    var value=symbol;
    switch(symbol)
    {
        case "000001.sz":
        case "600000.sh":
        case "000151.sz":
            break;
        default:
            value="000151.sz";
            break;
    }

    var url=`${TEST_URL}Day5Minute/${value}.5day.minute.json`;

    JSNetwork.HttpRequest({
        url: url,
        method: "get",
        dataType: "json",
        success: function (data) 
        {
            callback(data.data.data, symbol);
        }
        });
}

HQData.GetDayMinuteDataBySymbol=function(symbol, callback)
{
    var value=symbol;
    switch(symbol)
    {
        case "000001.sz":
        case "600000.sh":
        case "000151.sz":
            break;
        default:
            value="000151.sz"
            break;
    }

    var url=`${TEST_URL}DayMinute/${value}.1day.minute.json`;

    JSNetwork.HttpRequest({
        url: url,
        method: "get",
        dataType: "json",
        success: function (data) 
        {
            callback(data.data.stock, symbol);
        }
        });
}

HQData.GetMulitDayMinuteDataByDate=function(aryDay, aryDate)
{
    var aryData=[];
    if (!HQData.IsNonEmptyArray(aryDay)) return aryData;
    
    for(var i=0;i<aryDay.length;++i)
    {
        var item=aryDay[i];
        if (aryDate.includes(item.date))
        {
            aryData.push(item);
        }
    }

    return aryData;
}


//是否是非空的数组
HQData.IsNonEmptyArray=function(ary)
{
    if (!ary) return false;
    if (!Array.isArray(ary)) return false;

    return ary.length>0;
}


HQData.RequestAPIIndexData=function(data,callback)
{
    var request=data.Request;
    switch(request.Data.indexname)
    {
        case "API_MULTI_SVGICON":
            HQData.APIIndex_MULTI_SVGICON(data, callback);
            break;
        case 'API-MULTI_POINT':
            HQData.APIIndex_MULTI_POINT(data, callback);
            break;
        case "API_MULTI_BAR":
            HQData.APIIndex_MULTI_BAR(data, callback);
            break;
        case "API_MULTI_TEXT":
            HQData.APIIndex_MULTI_TEXT(data, callback);
            break;
        case "API_PARTLINE":
            HQData.APIIndex_PARTLINE(data, callback);
            break;
    }
}

HQData.APIIndex_MULTI_SVGICON=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.ChartPaint[0].Data;
    var iconData= 
    { 
        name:'MULTI_SVGICON', type:1, 
        Draw: 
        { 
            DrawType:'MULTI_SVGICON', 
            DrawData: 
            {
                Family:'js-iconfont', 
                Icon:
                [
                    //{ Date:20190916, Value:"High", Symbol:'\ue611', Color:'rgb(240,0,0)', Baseline:2 , YMove:-5},  //0 居中 1 上 2 下
                    //{ Date:20190919, Value:15.3, Symbol:'\ue615', Color:'rgb(240,240,0)', Baseline:2 },
                    //{ Date:20190909, Value:15.4, Symbol:'\ue615', Color:'rgb(240,100,30)'}
                ] 
            }
        } //绘制图标数组
    };

    var imageItem=hqchart.UIElement.CanvasNode.node.createImage();
    imageItem.src=imageData1;
    
    for(var i=0, j=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        if (i%10!=3) continue;

        var iconItem=
        {
            Date:item.Date, Time:item.Time, 
            Value:item.High,
            Baseline:2,
            YMove:-30,
            Image:{ Data:imageItem, Width:32, Height:32 },
            Line:{ Color:"rgb(153,50,204)", KData:"H", Width:1, Offset:[3,10], Dash:[5,5] },
        };

        iconData.Draw.DrawData.Icon.push(iconItem);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate() , outvar:[iconData] } 
    };

   
    console.log('[HQData::APIIndex_MULTI_SVGICON] apiData ', apiData);
    callback({data:apiData});
}

HQData.APIIndex_MULTI_POINT=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var pointData= 
    { 
        name:'MULTI_POINT', type:1, 
        Draw: 
        { 
            DrawType:'MULTI_POINT', 
            DrawData:[],
        } 
    };

    var point=
    { 
        Color:'rgb(211,211,211)', 
        BGColor:"rgb(255,215,0)",
        PointRadius:10,
        LineWidth:2,
        Name:"最低价",
        Point:[ ] 
    };

    for(var i=kData.Data.length-1, j=0; i>=0 && j<6; i-=5, ++j)
    {
        var item=kData.Data[i];
        point.Point.push({Date:item.Date, Time:item.Time, Value:"LOW"});
    }

    pointData.Draw.DrawData.push(point);
    

    var point=
    { 
        Color:'rgb(148,0,211)', 
        BGColor:"rgb(30,144,255)",
        PointRadius:5,
        LineWidth:1,
        Name:"中间价",
        Point:[ ] 
    };

    for(var i=kData.Data.length-3, j=0; i>=0 && j<5; i-=6, ++j)
    {
        var item=kData.Data[i];
        point.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2});
    }

    pointData.Draw.DrawData.push(point);

    var apiData=
    { 
        code:0, stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(),  outvar: [pointData] } 
    };
               
    console.log('[HQData.APIIndex_MULTI_POINT] apiData ', apiData);
    callback({data:apiData});
}

HQData.APIIndex_MULTI_BAR=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var barData= 
    { 
        name:'MULTI_BAR', type:1, 
        Draw: 
        { 
            DrawType:'MULTI_BAR', 
            DrawData:[] 
        } //绘制柱子数组
    };

    //第一组柱子
    var point=
    { 
        Color:'rgb(148,0,211)', //颜色
        Type:0,
        Name:"柱子上部",
        Point:
        [
            //{Date:20190916, Time: Value:15.5, Value2:0 },
        ],
        Width:10
    };

    var point2=
    { 
        Color:'rgb(55,228,181)', //颜色
        Type:1,
        Name:"柱子下部",
        Point:
        [
            //{Date:20190916, Time: Value:15.5, Value2:0 },
        ],
        Width:20
    };

    for(var i=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        point.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2, Value2:item.High});
        point2.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2, Value2:item.Low});
    }



    barData.Draw.DrawData.push(point);
    barData.Draw.DrawData.push(point2);

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime() , outvar:[barData] } 
    };

    
    console.log('[HQData.APIIndex_MULTI_BAR] apiData ', apiData);
    callback({data:apiData});

}

HQData.APIIndex_MULTI_TEXT=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var SVGData= 
    { 
        name:'MULTI_TEXT', type:1, 
        Draw: 
        { 
            DrawType:'MULTI_TEXT', 
            DrawData: []
        } //绘制文字
    };

    var ARRAY_COLOR=['rgb(255,248,220)','rgb(230,230,250)','rgb(100,149,237)','rgb(32,178,170)','rgb(152,251,152)','rgb(128,128,0)','rgb(255,165,0)','rgb(255,160,122)','rgb(205,92,92)']

    for(var i=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        if (i%5!=3) continue;

        var colorIndex=Math.ceil(Math.random()*ARRAY_COLOR.length-1);
        var drawItem=
        { 
            Date:item.Date, Time:item.Time, Value:"H", Text:`最高：${item.High.toFixed(2)}`,Color:ARRAY_COLOR[colorIndex], Baseline:2, YMove:-2
        };

        var colorIndex=Math.ceil(Math.random()*ARRAY_COLOR.length-1);
        var drawItem2=
        { 
            Date:item.Date, Time:item.Time, Value:item.Low, Text:`最低:${item.Low.toFixed(2)}`,Color:ARRAY_COLOR[colorIndex], Baseline:1, YMove:2
        };

        SVGData.Draw.DrawData.push(drawItem);
        SVGData.Draw.DrawData.push(drawItem2);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[SVGData] } 
    };

    console.log('[HQData.APIIndex_MULTI_TEXT] apiData ', apiData);
    callback({data:apiData});
}

HQData.APIIndex_PARTLINE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();


    var lineData= 
    { 
        name:'PARTLINE', type:1, 
        Draw: 
        { 
            DrawType:'PARTLINE', 
            DrawData: [],
            LineWidth:"LINETHICK2",
            IsDotLine:true,
            LineDash:[10,5]
        } 
    };

    var colorIndex=0;
    var ARRAY_COLOR=["rgb(0, 0 ,255)", "rgb(255,0,255)", "rgb(255,165,0)"];
    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];

        var color=ARRAY_COLOR[colorIndex%ARRAY_COLOR.length];

        lineData.Draw.DrawData.push({ Value:kItem.Close, RGB:color});

        if (i%10==3) ++colorIndex;
    }


    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[lineData] } 
    };

    console.log('[HQData.APIIndex_PARTLINE] apiData ', apiData);
    callback({data:apiData});
}

var imageData1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEVHcEwMftIDLmcCMnwLUH4AHEYTmeoGXboBHkkctPUAFzsSlOkWoOsYqvESZMMGM3wBLW4ABhICOokBJFgBLG0Tj90Sk+MSlOUXqPAZrfMCOYUDQZgLcM4KaMgOftYQiN4Ofdr///8BN4gIUK8cUJsCO5AJV7kANYcHTKoJU7QHSKUGRZ8DOYz7+/oKXsICPZQDQpwJWr4XSZYIP5Dc4uQzdcUrXqc6aKoRgeUPas8CeN8BatAaUqEyYKQjWKQNc9cPed8Vke8XmPIBbt4UX7wANYsBPpkuZbA8brPs7u4STaIDhuwCP6YeXbEbVahAc7psb+WHb+b19fUya7cASbAAi91Ofr6RyfdZbOUCU8CsWOStr6y/wsEWVq94ceYCm+MnVZsjY7kHvu42fMwCMJ8Fgua8WNoAYtzQ0NKM4Pi/SuNzZWSYmZkCUtk+d8JGf8cAq+cRhegPQ5QduPwES7cVjOy6VeZRY+Pd6/d53Pfq9PskZ78JZM0MYcjFiuwBW8dOda4CP7Hm6uZBaOTKys+VbuYDYskbs/wARbuHrNva3Ne6ws0CLpjbgy6sSN+q5/pqXEbz/P4kxO5Hz/KjcOewdOcm0PNdiMBmYuAdfdwAHY/zwWlUZZFQcNW1f9ugk3uhoZ9rtO2vsbH84aJ2ZU9totBzbne5urZd1PNEv+4aJd0YqP0occdUj9PimkBakMpq2fUGL44XoPhHcaEshNqd5vqBb1KKiIeNd8veyqrJROz306D86bPAPeJPsOs3m+M1MOD+9NG6qNh9YNmCYuIYsfHrz45mgqXUax+kZk3LUhPtqVF7lbkAEXkeddKZOyuvv75YTn7A1OGvIAPlPQJ5e4KXrbIOOsomsuYhoeK11POAv/PF3fVro+GOk9FtisyDpNCNgOnHQgfEcuq57vyUX+HAdV/BVzH/9+aTg2rYm4GuXMEcZNzs1PUGP9ukOsAtUdCZZ9oxg/gulet0ottFb5kuM1eYaFv/dB5RpOUSotCXyOmSw88yUOFHcEwCBSBnQ7a7AAABAHRSTlMAMCDsCFoWO207RPgp8vv+sSyzhcVNjV/TnHHhqNmd2vz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z//////////////////////////////////////////////////////////////wDs64HOaQAABqBJREFUSMd9lgdUU1cYx8MSiwKuOlpt+5I8yB6ETEgCzU4zxEAKJtFgoEBZhULZIhTBIoKALaAUQRyAWKl71T3qQmud3Xs5u/c5/W6CNnBs/+fk3Hfyfr97v3tfcu8jEMZk3MRHvDJxHOH/Mm7GrJnBJ+peHEldXd2J4JmzZvyXNHFWcN3mbU97JTY29ultm+uCZ018CO4/PXhzbJ4oL6+wsDDWE7jKyxOJRIXbgqf7j+V9Zm7OixEBn/eMV1JTU0WiVEmMaNtMn9H8oxNiY2JAkKT+ePD9Zx/k/Z5Dhal8V4dCUTjh0dG8SA6CRNTzQTM2OpfOfbe//qpLIfI2fCbEyOVyiaSnGCFMr2D1uzfpsG/2n72iiJnwoCr/J0ViuVzR8R6iddXVkQ+is29cp8Mw3d7fLmcqYp68P/PpeWKxPKoDumdWR6Yf7XruQW5e2YR4u/27y5ffSRNNH1n/p8RicZQc+HmR6V2NjY3PQ95CubvRPg/Dqu3rstZ99e7XyVFPeZ7HEzEVYnE51KOrr+ma3zj/JQhy9t3duAl4XXr37iyb/cK770TJn3D/HobLK8orP0T80e9fXbx4/nyPsu/mFeifqatZ172729b9KwgVw+hXMkPOqqgVl2LM+qPHlq4C43NQGhs/70L9M6s32bKybFlrd62/oKxlyWeAMFvMqkADRC4/dnwpGO5BFt8u7ftjQySz2m6Demxrd63MFJSzWOWzQZhTwWJVfoDNS/+oPS4ubumqVa923WZizUMti/p/b7NfzIIBoP/M7VEsFpc1B6YQwmUlDTKx6uXtcxcsQMaXezCsOaO1pWWhJNt59aqt+1vo/9RwJQjckHEEH2iStmBY/UdFcz0GCM07+1pbTyQo0q45L9q+XQ/8DheXxQ0L4/oQAllh3IKfMGb6x0WJHuP4nuamkr6+lhdSFWnZ1zrXrlyZuX3Y5UJ8GDeQEAhtwSvYvOWvFyUiIy7u2J4vMkpKXlu0UJKWnX2nKnPl+u3iQZdLCSDVLVBHhJcT3cbxT5t2ZmS0LnohAQnZb/6yfnt5RYiLrwSeGgYCNPEeoagosX1u+6dfNGU0DcEAqKJbb54P/RnWM4TvFkhugXRfeBmKal8A/TdBQWiAtI788w3JsOxKJRKopBGBhIQaEBITi+ZmZJTsRPzCVEnaDvL5hpwtgyFcLgiIp1BBoFJIhldgle4NHD58uKhkqC9jCPEJEsUO02qDcsuWwcEypTKnjOogUUYEiuGTZl3NtYGBgcM9rf1DrS0evkPfYODzXblhYcqy5JzkZCOFQiGBAJ5hQ2lkzb07A38f7L/ej3DEy2kp8dxcPj8XrU5yjhEKotHcAo3mFgazbx28fqP/OvSeIJF7eOVWEKhUKolqMSKeRgEBWg4ShhWHbtw4eCMhQR4FAb6An8vfqszJhcmSHGYH4ulugU5Tf1wamb5j6189fx6Kqq2traysFBuAL4MnFJ+TCzzFaHEgnk4LJPhAo7aWFqdvsB04cikqiZsEqTA0xOcmxwMan5MDk6RoNCa6ns7h0AMJvtCoBcXF6fb9R45crCxYBklKWV1VthWtCsVotVBoFJrWaOKYOCD4EvwfB4NzqTRyb++R3pPiZVVVVQUpqw0ki9XsIDmMVqsRijdpTXq6Sc3hPA5b0xS6moOfay7ee+DAmjVrLUnLChpWpyQbtWaz2WIxQ9d0Gl0rkKmj9Wo2fQr8RR+js9VsZ7Gu98DJNW+sWHE6kw58m8Zo1Vo0Go3ZbKJzNFqZXi1Qs9mcx0Dw5bHZbNUn3/TuB/7tM59dMKQ42szAagFvs2qtGoFWJmNHR+NsNs8XbUxTOHCZv7d3zVnEnzntsFg1Jg4dotdHywTCNm20gJ0vYOM4Z4p75wvC4brh3MmzMMDXX2V2LtHKhNEQPYSjpguFwOPSCBwS5NlcJ3FwouOHU2+sOL2xU2vVCoVLhAKBTIYkmVAIVzguJTNwhnrSyO7t68cmlpUxOjvz9QBDhBCpQCCQSoGWRah4UrKKwWD7+d4/IAKIeASPly9dQmbwyGRnNBkS7f44yfkqFVkaATxODPj3CBrPYBAZDFWEEEpVMXAej8fmoeAqFY8sdcJNuD3e+5CbSsThKyIxQiqUOp3k+3E6pVInL5xIhNtTRx+jATAPSHg4Iz/CK/k8IsKJuF/A2IN68iToxeOMihsPnzT5Ie8CAdNCcZxBHBMGjodOC/B/6MuGf9DUaX6h4d54eKjftKlB/v/9PuM/OShgvFcCgiaPof8BP+OinY+ZbFsAAAAASUVORK5CYII="

/*暴露外部用的方法*/
export 
{
    HQData
}
