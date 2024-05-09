/////////////////////////////////////////////////////////////////////
//  模拟测试数据
//  
//
/////////////////////////////////////////////////////////////////////


function HQData()  { }

HQData.Explain="本地测试数据";

HQData.NetworkFilter=function(data, callback)
{
    console.log(`[HQData::NetworkFilter] ${HQData.Explain}`, data);

    switch(data.Name) 
    {
        case 'MinuteChartContainer::RequestMinuteData':                 //分时图数据对接
            HQData.RequestMinuteData(data, callback);
            break;
        case "MinuteChartContainer::RequestHistoryMinuteData":          //多日分时图
            HQData.RequestMinuteDaysData(data, callback);
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

        case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
            HQData.RequestHistoryMinuteData(data, callback);
            break;
        case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
            HQData.RequestMinuteRealtimeData(data,callback);
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

        case "JSSymbolData::GetLatestData":
            HQData.RequestLatestData(data,callback);
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
    }
}

HQData.RequestMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::RequestMinuteData] Symbol=${symbol}`);
    
    var srcStock=MINUTE_1DAY_DATA.stock[0];
    var stockItem={ date:srcStock.date, minute:srcStock.minute, yclose:srcStock.yclose, symbol:srcStock.symbol, name:srcStock.name };
    if (callcation.Before)
    {
        var before=
        [
            //[交易时间, 价格，成交量， 成交金额, 日期（可选，YYYYMMDD)],
            [915, srcStock.yclose,0,0],
            [916, srcStock.yclose+0.01,0,0],
            [917, srcStock.yclose+0.03,0,0],
            [918, srcStock.yclose+0.02,0,0],
            [919, srcStock.yclose+0.02,0,0],
            [920, srcStock.yclose+0.01,0,0],
            [921, srcStock.yclose,0,0],
            [922, srcStock.yclose-0.02,0,0],
            [923, srcStock.yclose-0.03,0,0],
            [924, srcStock.yclose,0,0],
            [925, srcStock.yclose,0,0],
        ];

        var beforeinfo={ totalcount:11, ver:1.0 };

        stockItem.before=before;
        stockItem.beforeinfo=beforeinfo;
    }

    var hqchartData={code:0, stock:[stockItem] };
   

    callback(hqchartData);
}

HQData.RequestMinuteDaysData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
    var dayCount=data.Request.Data.daycount;
    var callcation=data.Request.Data.callcation;        //集合竞价
  
    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);
    
    var hqchartData={code:0, data:[] };
    hqchartData.symbol=MINUTE_5DAY_DATA.symbol;
    hqchartData.name=MINUTE_5DAY_DATA.symbol;

    for(var i=0;i<dayCount && i<MINUTE_5DAY_DATA.data.length;++i)
    {
        var item=MINUTE_5DAY_DATA.data[i];
        var dayItem={minute:item.minute, yclose:item.yclose, date:item.date };
        if (callcation.Before)
        {
            var before=
            [
                //[交易时间, 价格，成交量， 成交金额, 日期（可选，YYYYMMDD)],
                [915, item.yclose,0,0],
                [916, item.yclose+0.01,0,0],
                [917, item.yclose+0.03,0,0],
                [918, item.yclose+0.02,0,0],
                [919, item.yclose+0.02,0,0],
                [920, item.yclose+0.01,0,0],
                [921, item.yclose,0,0],
                [922, item.yclose-0.02,0,0],
                [923, item.yclose-0.03,0,0],
                [924, item.yclose,0,0],
                [925, item.yclose,0,0],
            ];

            var beforeinfo={ totalcount:11, ver:1.0 };

            dayItem.before=before;
            dayItem.beforeinfo=beforeinfo;
        }

        hqchartData.data.push(dayItem);
    }
   
    callback(hqchartData);
}

HQData.RequestHistoryData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
  
    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);
    
    var hqchartData=KLINE_DAY_DATA;
    hqchartData.symbol=symbol;
    hqchartData.name=symbol;
   
    callback(hqchartData);
}

HQData.RequestFlowCapitalData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码

    console.log(`[HQData::RequestFlowCapitalData] Symbol=${symbol}`);

    var hqchartData=KLINE_CAPITAL_DATA;
    callback(hqchartData);
}

HQData.RequestRealtimeData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码

    console.log(`[HQData::RequestRealtimeData] Symbol=${symbol}`);

    var hqchartData=KLINE_1DAY_DATA;
    hqchartData.stock[0].name=symbol;
    hqchartData.stock[0].symbol=symbol;
    callback(hqchartData);
}


HQData.RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码

    console.log(`[HQData::RequestHistoryMinuteData] Symbol=${symbol}`);

    var hqchartData=KLINE_MINUTE_DATA;
    hqchartData.name=symbol;
    hqchartData.symbol=symbol;
    callback(hqchartData);

}


HQData.RequestMinuteRealtimeData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码

    console.log(`[HQData::RequestMinuteRealtimeData] Symbol=${symbol}`);

    var hqchartData=JSON.parse(JSON.stringify(KLINE_1MINUTE_DATA));

    var kItem=hqchartData.data[0];
    var price=kItem[5];
    var value=Math.ceil(Math.random()*10)/1000*price;
    var bUp=Math.ceil(Math.random()*10)>=5;
    
    if (bUp) price+=value;
    else price-=value;
    kItem[5]=price;
    kItem[3]=Math.max(price, kItem[3]);
    kItem[4]=Math.min(price, kItem[4]);
    
    hqchartData.name=symbol;
    hqchartData.symbol=symbol;
    callback(hqchartData);
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
        callback(hqchartData);
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
    callback(hqchartData);
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

    callback(hqchartData);
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

    callback(hqchartData);
}

HQData.InvestorInfo_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback(TEST_NEWSINTERACT_DATA);
}

HQData.BlockTrading_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback(TEST_BLOCK_TRADING_DATA);
}

HQData.TradeDetail_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    callback(TEST_TRADE_DETAL_DATA);
}

HQData.RequestLatestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];
    var id=data.Args[0];
    var value=1;
    switch(id)
    {
        case 3:
            value=KLINE_1DAY_DATA.stock[0].yclose;
            break;
        case 4:
            value=KLINE_1DAY_DATA.stock[0].open;
            break;
        case 5:
            value=KLINE_1DAY_DATA.stock[0].high;
            break;
        case 6:
            value=KLINE_1DAY_DATA.stock[0].low;
            break;
        case 7:
            value=KLINE_1DAY_DATA.stock[0].price;
            break;
        case 8:
            value=KLINE_1DAY_DATA.stock[0].vol;
            break;
    }

    var hqchartData={ symbol:symbol, ver:2.0, data:[ {id:id, value:value }]};

    callback(hqchartData);
}
