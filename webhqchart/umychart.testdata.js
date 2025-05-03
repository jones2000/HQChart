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
        //HQChart使用教程29-走势图如何对接第3方数据1
        case 'MinuteChartContainer::RequestMinuteData':                 //分时图数据对接
            //HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据
            HQData.Minute_RequestMinuteData(data, callback);
            break;
        
        case "MinuteChartContainer::RequestHistoryMinuteData":          //多日分时图
            //HQChart使用教程29-走势图如何对接第3方数据3-多日分时数据
            HQData.Minute_RequestHistoryMinuteData(data, callback);
            break;
        
        case "MinuteChartContainer::RequestOverlayMinuteData":          //单日叠加
            HQData.Minute_RequestOverlayMinuteData(data, callback);
            break;

        case "MinuteChartContainer::RequestOverlayHistoryMinuteData":       //叠加多日
            HQData.Minute_RequestOverlayHistoryMinuteData(data, callback);  
            break;

        case "MinuteChartContainer::RequestPopMinuteData":          //弹出分时图数据
            //HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据  格式跟这个一样
            HQData.Minute_RequestPopMinuteData(data, callback);
            break;

        //HQChart使用教程30-K线图如何对接第3方数据1
        case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
            //HQChart使用教程30-K线图如何对接第3方数据2-日K数据
            HQData.RequestHistoryData(data,callback);
            break;
        case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
            //HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据
            HQData.RequestRealtimeData(data,callback);
            break;
        case 'KLineChartContainer::RequestFlowCapitalData':             //流通股本
            //HQChart使用教程30-K线图如何对接第3方数据4-流通股本数据
            HQData.RequestFlowCapitalData(data,callback);
            break;

        case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
            //HQChart使用教程30-K线图如何对接第3方数据3-1分钟K数据
            HQData.RequestHistoryMinuteData(data, callback);
            break;
        case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
            //HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据
            HQData.RequestMinuteRealtimeData(data,callback);
            break;

        case "JSSymbolData::GetVariantData":                            //额外的变量数据
            //HQChart使用教程30-K线图如何对接第3方数据29-板块字符串函数数据[GNBLOCK,GNBLOCKNUM......]
            HQData.RequestIndexVariantData(data,callback);
            break;

        case "JSSymbolData::GetCustomFunctionData":                      //自定义函数数据下载
            HQData.CustomFunction_RequestData(data,callback);
            break;

        case "JSSymbolData::GetCustomVariantData":                       //自定义函数数据下载
            HQData.CustomVarData_RequestData(data,callback);
            break;

        case "JSSymbolData::GetOtherSymbolData":
            //HQChart使用教程30-K线图如何对接第3方数据31-获取指定品种的K线数据
            HQData.RequestOtherSymbolData(data, callback);
            break;

        case "AnnouncementInfo::RequestData":
            //HQChart使用教程30-K线图如何对接第3方数据20-信息地雷公告数据
            HQData.AnnouncementInfo_RequestData(data,callback);
            break;

        case "JSSymbolData::GetLatestData":
            //HQChart使用教程30-K线图如何对接第3方数据30-即时行情数据DYNAINFO
            HQData.RequestLatestData(data,callback);
            break;


        case "KLineChartContainer::RequestOverlayHistoryData":      //叠加股票
            //HQChart使用教程30-K线图如何对接第3方数据16-日K叠加股票
            HQData.RequestOverlayHistoryData(data, callback);
            break;

        case "KLineChartContainer::RequestOverlayHistoryMinuteData":
            //HQChart使用教程30-K线图如何对接第3方数据17- 分钟K叠加股票
            HQData.RequestOverlayHistoryMinuteData(data, callback);
            break;

        case "PforecastInfo::RequestData":
            HQData.PforecastInfo_RequestData(data,callback);
            break;

        case "InvestorInfo::RequestData":
            HQData.InvestorInfo_RequestData(data,callback);
            break;

        case "ResearchInfo::RequestData":
            HQData.ResearchInfo_RequestData(data,callback);
            break;

        case "BlockTrading::RequestData":
            HQData.BlockTrading_RequestData(data,callback);
            break;

        case "TradeDetail::RequestData":
            HQData.TradeDetail_RequestData(data,callback);
            break;

        case "JSSymbolData::GetFinance":    //财务数据
            HQData.Finance_RequestData(data,callback);
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

        case "JSSymbolData::GetIndexData":
            HQData.INDEX_RequestData(data,callback);
            break;

        //////////////////////////////////////////////////////
        //报价列表数据
        case "JSReportChartContainer::RequestStockListData":
            //HQChart使用教程95-报价列表对接第3方数据1-码表数据
            HQData.Report_RequestStockListData(data, callback);          //码表
            break;

        case "JSReportChartContainer::RequestMemberListData":           //板块成分
            //HQChart使用教程95-报价列表对接第3方数据2-板块成分数据
            HQData.Report_RequestMemberListDat(data, callback);
            break;
        case "JSDealChartContainer::RequestStockData":                  //股票数据更新
            //HQChart使用教程95-报价列表对接第3方数据3-股票数据
            HQData.Report_RequestStockData(data, callback);
            break;
        case "JSDealChartContainer::RequestStockSortData":              //股票排序数据
            //HQChart使用教程95-报价列表对接第3方数据4-股票排序数据
            HQData.Report_RequestStockSortData(data, callback);
            break;
        case "JSDealChartContainer::RequestVirtualStockData":
            HQData.Report_RequestVirtualStockData(data, callback);         //股票数据 虚拟表格
            break;

        case "APIScriptIndex::ExecuteScript":   //测试指标
            HQData.Report_APIIndex(data, callback);
            break;


        /////////////////////////////////////////////////////////////////
        //
        case "KLineChartContainer::RequestVolumeProfileData":       //成交量分布图
            HQData.RequestVolumeProfileData(data, callback);
            break;

    }
}

HQData.Minute_RequestMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var callcation=data.Request.Data.callcation;        //集合竞价
    var bBuySellBar=data.Request.Data.IsShowBuySellBar;
    console.log(`[HQData::RequestMinuteData] Symbol=${symbol}`);

    setTimeout(()=>{
        var fullData=HQData.GetDayMinuteDataBySymbol(symbol);
        var srcStock=fullData[0];
        var stockItem={ date:srcStock.date, minute:srcStock.minute, yclose:srcStock.yclose, symbol:symbol, name:symbol };
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

        var lastPrice=stockItem.minute[stockItem.minute.length-1].price;

        if (bBuySellBar)    //盘口分析
        {
            var aryBuy=[];
            var value=lastPrice+0.01;
            for(var i=0;i<10;++i)
            {
                aryBuy.push({Price:value, Type:1, Vol:HQData.GetRandomTestData(1000,10000) });
                value+=0.02;
            }
    
            var arySell=[];
            for(var i=0;i<10;++i)
            {
                arySell.push({Price:value, Type:2, Vol:HQData.GetRandomTestData(1000,10000) });
                value+=0.02;
            }

            stockItem.BuySellData={ AryBuy:aryBuy, ArySell:arySell };
        }

        //测试用 这里可以修改数据
        //var lastItem=srcStock.minute[srcStock.minute.length-1];
        //lastItem.price+=Math.ceil(Math.random()*10)/1000*lastItem.price;
        /*
        for(var i=0;i<srcStock.minute.length;++i)
        {
            var item=srcStock.minute[i];
            if (item.amount<1000000) item.amount*=100000;
        }
        */

        stockItem.minute.length=50;

        var hqchartData={code:0, stock:[stockItem] };
    

        callback(hqchartData);
    }, 50);
}

HQData.Minute_RequestMinuteDataV2=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::Minute_RequestMinuteDataV2] Symbol=${symbol}`);

    setTimeout(()=>
    {
        var fullData=HQData.GetDayMinuteDataBySymbol(symbol);
        var srcStock=fullData[0];
        var stockItem={ date:srcStock.date, minute:srcStock.minute, yclose:srcStock.yclose, symbol:symbol, name:symbol };

        if (callcation.Before)
        {
            var TEST_BEFORE_DATA=
            [
                [8.52, 50000, 30000, 1, 200000],
                [8.53, 55000, 40000, 0, 80000],
                [8.52, 40000, 60000, 1, 80000],
                [8.55, 30000, 21000, 2, 44000],
                [8.51, 21000, 25000, 2, 40000],
                [8.50, 36000, 55000, 2, 60000],
                [8.49, 10000, 20000, 2, 33000],
            ];

            var date=new Date(parseInt(stockItem.date/10000),(stockItem.date/100%100-1),stockItem.date%100, 9, 15, 0);
            var count=10*60;    //9:15-9:25
            var before=[];
            for(var i=0;i<count;++i)
            {
                var time=date.getHours()*10000+date.getMinutes()*100+date.getSeconds();
                var testIndex=Math.floor(Math.random()*10)%TEST_BEFORE_DATA.length;
                var testData=TEST_BEFORE_DATA[testIndex];
                var item=[ time, null, null, null, null, null ];
                if (i%20==0 || i==count-1) 
                {
                    item=[ time, testData[0], testData[1], testData[2], testData[3], (testData[1]+testData[2])*1.5 ];
                }
                before.push(item);
                date.setSeconds(date.getSeconds()+1);
            }

            //before.length=200;
            var beforeinfo={ totalcount:count, ver:2.0 };

            stockItem.before=before;
            stockItem.beforeinfo=beforeinfo;

            var TEST_AFTER_DATA=
            [
                [8.51, 40000, 30000, 1, 80000],
                [8.51, 55000, 60000, 0, 150000],
                [8.51, 30000, 60000, 1, 160000],
                [8.51, 35000, 21000, 2, 50000],
                [8.51, 21000, 35000, 2, 70000],
                [8.51, 26000, 55000, 2, 100000],
                [8.51, 30000, 10000, 2, 50000],
            ];

            var date=new Date(parseInt(stockItem.date/10000),(stockItem.date/100%100-1),stockItem.date%100, 14, 57, 0);
            var count=3*60;    //14:57-15:00
            var after=[];
            for(var i=0;i<count;++i)
            {
                var time=date.getHours()*10000+date.getMinutes()*100+date.getSeconds();
                var testIndex=Math.floor(Math.random()*10)%TEST_AFTER_DATA.length;
                var testData=TEST_AFTER_DATA[testIndex];
                var item=[ time, null, null, null, null, null ];
                if (i%10==0 || i==count-1) 
                {
                    item=[ time, testData[0], testData[1], testData[2], testData[3], (testData[1]+testData[2])*1.5 ];
                }
                after.push(item);
                date.setSeconds(date.getSeconds()+1);
            }

            var afterinfo={ totalcount:count, ver:2.0 };
            stockItem.after=after;
            stockItem.afterinfo=afterinfo;
        }

        //stockItem.minute.length=0;

        var hqchartData={code:0, stock:[stockItem] };
        callback(hqchartData);
    }, 50);
}

HQData.Minute_RequestPopMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var date=data.Request.Data.date;
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::RequestPopMinuteData] Symbol=${symbol} Date=${date}`);

    setTimeout(()=>{
        var fullData=HQData.GetDayMinuteDataBySymbol(symbol);
        var srcStock=fullData[0];
        var stockItem={ date:date, minute:[], yclose:srcStock.yclose, symbol:srcStock.symbol, name:srcStock.symbol, IsHistoryMinute:true };
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

        for(var i=0;i<srcStock.minute.length;++i)
        {
            var item=srcStock.minute[i];
            var newItem=CloneData(item);
            newItem.date=date;

            stockItem.minute.push(newItem);
        }

        var hqchartData={code:0, stock:[stockItem] };
    

        callback(hqchartData);
    }, 50);
}


HQData.KLine_RequestMulitDayMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;                //请求的股票代码

    console.log(`[HQData::KLine_RequestMulitDayMinuteData] Symbol=${symbol}`);

    var fullData=HQData.GetMulitDayMinuteDataBySymbol(symbol);

    var aryKLine=[];
    var aryBreakPoint=[];
    for(var i=fullData.length-1;i>=0;--i)
    {
        var dayItem=fullData[i];
        var yClose=dayItem.yclose
        for(var j=0;j<dayItem.minute.length;++j)
        {
            var minItem=dayItem.minute[j];
            var kItem=[dayItem.date, yClose, minItem[1], minItem[2], minItem[3], minItem[4],minItem[5],minItem[6], minItem[0] ];
            aryKLine.push(kItem);
        }

        aryBreakPoint.push({ Date:dayItem.date, Time:1500 })
    }

    var hqchartData={ name:symbol, symbol:symbol, data:aryKLine, ver:2.0, AryBreakPoint:aryBreakPoint };
    callback(hqchartData);
}


HQData.Minute_RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;                //请求的股票代码
    var dayCount=data.Request.Data.daycount;
    var callcation=data.Request.Data.callcation;        //集合竞价
    var bBuySellBar=data.Request.Data.IsShowBuySellBar;
  
    console.log(`[HQData::Minute_RequestHistoryMinuteData] Symbol=${symbol}`);

    var fullData=HQData.GetMulitDayMinuteDataBySymbol(symbol);
    
    var aryDay=[];
    if (dayCount>fullData.length) dayCount=fullData.length;
    aryDay=fullData.slice(0,dayCount);
    for(var i=0; i<aryDay.length; ++i)
    {
        var item=aryDay[i];
       
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

            item.before=before;
            item.beforeinfo=beforeinfo;
        }
    }

    if (bBuySellBar)    //盘口分析
    {
        var dayItem=aryDay[0];
        var lastPrice=dayItem.minute[dayItem.minute.length-1][4];

        var aryBuy=[];
        var value=lastPrice+0.01;
        for(var i=0;i<10;++i)
        {
            aryBuy.push({Price:value, Type:1, Vol:HQData.GetRandomTestData(1000,10000) });
            value+=0.02;
        }

        var arySell=[];
        for(var i=0;i<10;++i)
        {
            arySell.push({Price:value, Type:2, Vol:HQData.GetRandomTestData(1000,10000) });
            value+=0.02;
        }

        dayItem.BuySellData={ AryBuy:aryBuy, ArySell:arySell };
    }
   
    var hqchartData={code:0, data:aryDay, name:symbol, symbol: symbol};

    //hqchartData.data[0].minute.length=45;

    callback(hqchartData);
}


HQData.Minute_RequestOverlayMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var date=data.Request.Data.days[0];
    
    var fullData=HQData.GetMulitDayMinuteDataBySymbol(symbol);
    var aryDay=HQData.GetMulitDayMinuteDataByDate(fullData, [date]);

    var hqchartData={ code:0, data:aryDay, name:symbol, symbol:symbol  };
    callback(hqchartData);
}

HQData.Minute_RequestOverlayHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var aryDate=data.Request.Data.days;
    var fullData=HQData.GetMulitDayMinuteDataBySymbol(symbol);
    var aryDay=HQData.GetMulitDayMinuteDataByDate(fullData, aryDate);

    var hqchartData={ code:0, data:aryDay, name:symbol, symbol:symbol  };
    callback(hqchartData);
}

HQData.RequestHistoryData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol; //请求的股票代码
    var count=data.Request.Data.count
    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);

    var fullData=HQData.GetDayKLineDataBySymbol(symbol);
    var aryData=[];
    if (IFrameSplitOperator.IsNonEmptyArray(fullData))
    {
        var dataCount=fullData.length;
        var start=dataCount-count;
        if (start<0) start=0;
        aryData=fullData.slice(start);

        /*
        for(var i=aryData.length-5;i<aryData.length;++i)
        {
            var item=aryData[i];
            item[13]=true;
        }
        */
    }
    
    var hqchartData={ name:symbol, symbol:symbol, data:aryData, ver:2.0 };
   
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

HQData.RequestRealtimeData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var end=data.Request.Data.dateRange.End;
    var endDate=end.Date;
    var aryStock=[];
    var hqchart=data.Self;
    var kData=hqchart.GetKData();
    for(var i=kData.Data.length-1;i>=0;--i)
    {
        var item=kData.Data[i];
        if (!item.IsVirtual) 
        {
            endDate=item.Date;
            break;
        }
    }

    for(var i=0;i<data.Request.Data.symbol.length;++i)
    {
        var item=data.Request.Data.symbol[i];
        var fullData=HQData.GetDayKLineDataBySymbol(item);
        if (!IFrameSplitOperator.IsNonEmptyArray(fullData)) continue;

        var aryData=HQData.GetKLineDataByDate(fullData, endDate, 20999999);
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) continue;

        var kItem=aryData[0];
        var price=kItem[5];
        var value=Math.ceil(Math.random()*10)/1000*price;
        var bUp=Math.ceil(Math.random()*10)>=5;
        if (bUp) price+=value;
        else price-=value;

        var stockItem={ symbol:item, name:item };
        stockItem.date=kItem[0];
        stockItem.yclose=kItem[1];
        stockItem.open=kItem[2];
        stockItem.high=Math.max(kItem[3],price);
        stockItem.low=Math.min(kItem[4],price);
        stockItem.price=price;
        stockItem.vol=kItem[6];
        stockItem.amount=kItem[7];

        aryStock.push(stockItem);
    }

    var hqchartData={ code:0, stock:aryStock };

   
    callback(hqchartData);
    
}




HQData.RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;    //请求的股票代码
    var count=data.Request.Data.count*200;  //请求的数据长度
    console.log(`[HQData::RequestHistoryMinuteData] Symbol=${symbol}`);

    var fullData=HQData.GetM1KLineDataBySymbol(symbol);
    var aryData=[];
    if (IFrameSplitOperator.IsNonEmptyArray(fullData))
    {
        var dataCount=fullData.length;
        var start=dataCount-count;
        if (start<0) start=0;
        aryData=fullData.slice(start);
    }

    
    var hqchartData={ name:symbol, symbol:symbol, data:aryData, ver:2.0 };
    callback(hqchartData);
}


HQData.RequestMinuteRealtimeData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var end=data.Request.Data.dateRange.End;
    var endDate=end.Date;
    var endTime=end.Time;

    var aryOverlay=[ ];     //叠加
    var aryMainData=[];     //主图
    for(var i=0;i<data.Request.Data.symbol.length;++i)
    {
        var symbol=data.Request.Data.symbol[i];
        var fullData=HQData.GetM1KLineDataBySymbol(symbol);
        if (!IFrameSplitOperator.IsNonEmptyArray(fullData)) continue;

        var aryData=HQData.GetKLineDataByDateTime(fullData, endDate, endTime, 20999999, 9999);
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) continue;

        var kItem=JSON.parse(JSON.stringify(aryData[0]));

        //生成随机测试数据
        var price=kItem[5];
        var value=Math.ceil(Math.random()*10)/5000*price;
        var bUp=Math.ceil(Math.random()*10)>=5;
        
        if (bUp) price+=value;
        else price-=value;
        kItem[5]=price;
        kItem[3]=Math.max(price, kItem[3]);
        kItem[4]=Math.min(price, kItem[4]);

        if (i==0)
        {
            aryMainData.push(kItem);
        }
        else
        {
            var stock={ data:[kItem], symbol:symbol, name:symbol };
            aryOverlay.push(stock);
        }
    }

    var symbol=data.Request.Data.symbol[0]; //请求的股票代码
    var hqchartData={ name:symbol, symbol:symbol, ver:2.0, data:aryMainData };
    if (IFrameSplitOperator.IsNonEmptyArray(aryOverlay)) hqchartData.overlay=aryOverlay;
   
    callback(hqchartData);
}


HQData.RequestIndexVariantData=function(data,callback)
{
    data.PreventDefault=true;
    var varName=data.Request.Data.VariantName;  //变量名称
    if (varName=="FROMOPEN") 
    {
        var hqchartData={  };
        //单数据
        hqchartData.Data={ Date:20230707, Value:240 };
        hqchartData.DataType=1;
        callback(hqchartData);
    }
    else if (varName=="FGBLOCK")
    {
        var hqchartData={ DataType:1, Data:{Value:"融资融券 大盘股 MSCI成份 周期股 沪股通标的"} }; //返回所属风格板块.
        callback(hqchartData);
    }
    else if (varName=="GNBLOCK")
    {
        var hqchartData={ DataType:1,  Data:{ Value:"含可转债 跨境支付CIPS"} }; //返回所属概念板块.
        callback(hqchartData);
    }
    else if (varName=="HYBLOCK")
    {
        var hqchartData={ DataType:1,  Data:{Value:"全国性银行"}}; //返回品种所属行业.
        callback(hqchartData);
    }
    else if (varName=="DYBLOCK")
    {
        var hqchartData={ DataType:1, Data:{Value:"上海板块"} }; //返回品种所属地域..
        callback(hqchartData);
    }
    else if (varName=="CAPITAL")
    {
        var hqchartData={ DataType:1, Data:{ Value:29352177375 } }; // 当前流通股本,单位为手,债券1手为10张,其它为100
        callback(hqchartData);
    }
    else if (varName=="LARGEINTRDVOL")
    {
        //测试数据
        var kData=data.Self.Data;
        var hqchartData={ DataType:2, Data:[] };
        var testValue=0.15;
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            hqchartData.Data.push({ Date:kItem.Date, Time:kItem.Time, Value:kItem.Vol*testValue });
            testValue+=0.01;
            if (testValue>0.23) testValue=0.15;
        }
        callback(hqchartData);
    }
    else if (varName=="LARGEOUTTRDVOL")
    {
        //测试数据
        var kData=data.Self.Data;
        var hqchartData={ DataType:2, Data:[] };
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            hqchartData.Data.push({ Date:kItem.Date, Time:kItem.Time, Value:kItem.Vol*0.17 });
        }
        callback(hqchartData);
    }
    else if (varName=="EXCHANGE" || varName=="HSL")
    {
        var kData=data.Self.Data;
        var hqchartData={ DataType:0, Data:[], Ver:2.0 };
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            var value=HQData.GetRandomTestData(1,10);
            hqchartData.Data.push({ Date:kItem.Date, Time:kItem.Time, Value:value });
        }

        callback(hqchartData);
    }
    else
    {
        var error= `变量'${varName}' 没有对接数据. [HQData.RequestIndexVariantData]`;
        var hqchartData={ Error:error }; 
        callback(hqchartData);
    }

}

HQData.CustomFunction_RequestData=function(data, callback)
{
    data.PreventDefault=true;
    var funcName=data.Request.Data.FunctionName;
    var hqchartData=null;

    if (funcName=='L2_VOL')
    {
        var args=data.Request.Data.JobItem.Args;
        var param=[ args[0].Value, args[1].Value ];

        var hqchartData={ DataType:2, Data:[] };
        var kData=data.Self.Data;
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            hqchartData.Data.push({ Date:kItem.Date, Time:kItem.Time, Value:kItem.Vol/3 });
        }
    }
    else
    {
        var error= `函数'${funcName}' 没有对接数据. [HQData.CustomFunction_RequestData]`;
        var hqchartData={ Error:error }; 
    }
    
    callback(hqchartData);
}

HQData.CustomVarData_RequestData=function(data, callback)
{
    data.PreventDefault=true;
    var varName=data.Request.Data.VariantName;
    if (varName=="DCLOSE")
    {
        var hqchartData={ DataType:2, Data:[] };
        var kData=data.Self.Data;
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            hqchartData.Data.push({ Date:kItem.Date, Time:kItem.Time, Value:kItem.Close });
        }

        callback(hqchartData);
    }
    else
    {
        var error= `变量'${varName}' 没有对接数据. [HQData.CustomVarData_RequestData]`;
        var hqchartData={ Error:error }; 
        callback(hqchartData);
    }


}

HQData.RequestOtherSymbolData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var period=data.Request.Data.period;
    var right=data.Request.Data.right;
    var start=data.Request.Data.dateRange.Start;
    var end=data.Request.Data.dateRange.End;

    var aryData=[];
    if (ChartData.IsDayPeriod(period,true)) 
    {
        var fullData=HQData.GetDayKLineDataBySymbol(symbol);
        if (IFrameSplitOperator.IsNonEmptyArray(fullData))
            aryData=HQData.GetKLineDataByDate(fullData, start.Date, end.Date);
    }
    else if (ChartData.IsMinutePeriod(period,true)) 
    {
        var fullData=this.GetM1KLineDataBySymbol(symbol);
        if (IFrameSplitOperator.IsNonEmptyArray(fullData))
            aryData=HQData.GetKLineDataByDateTime(fullData, start.Date, start.Time, end.Date, end.Time);
    }

    var hqchartData={ name:symbol, name:symbol, data:aryData };
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

        var year=parseInt(kItem.Date/10000);  //年份
        var month=parseInt(kItem.Date/100)%100;
        var reprotDate=0;
        if (month>10) reprotDate=year*10000+1231;
        else if (month>6) reprotDate=year*10000+930;
        else if (month>3) reprotDate=year*10000+630;
        else reprotDate=year*10000+331;

        var itemReport={ date:kItem.Date, time:kItem.Time, title:`业绩预增`, reportdate:reprotDate, fweek:{ week1:0.04, week4:0.02 } }

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

HQData.ResearchInfo_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Symbol;

    var hqchartData={ symbol:symbol, list:[] };

    var kData=data.HQChart.ChartPaint[0].Data;
    for(var i=0, j=1;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        if (i%20!=4) continue;

        var itemReport={ researchdate:kItem.Date, id:i, level:[j%4], type:"xxx调研。" };

        hqchartData.list.push(itemReport);

        ++j;
    }

    callback(hqchartData);
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
    var fullData=HQData.GetDayKLineDataBySymbol(symbol);
    if (IFrameSplitOperator.IsNonEmptyArray(fullData))
    {
        var item=fullData[fullData.length-1];   //取最后一条数据
        switch(id)
        {
            case 3:
                value=item[1];
                break;
            case 4:
                value=item[2];
                break;
            case 5:
                value=item[3];
                break;
            case 6:
                value=item[4];
                break;
            case 7:
                value=item[5];
                break;
            case 8:
                value=item[6];
                break;
        }
    }
    

    var hqchartData={ symbol:symbol, ver:2.0, data:[ {id:id, value:value }]};

    callback(hqchartData);
}

HQData.RequestOverlayHistoryData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var first=data.Request.Data.first;
    var fullData=HQData.GetDayKLineDataBySymbol(symbol);
    var aryData=[];

    if (IFrameSplitOperator.IsNonEmptyArray(fullData))
    {
        aryData=HQData.GetKLineDataByDate(fullData, first.date, 20999999)
    }

    //aryData=aryData.slice(aryData.length-20);

    var hqchartData={  code:0, symbol: symbol,name: symbol, ver:2.0, data:aryData };

    callback(hqchartData);
}

HQData.RequestOverlayHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var first=data.Request.Data.first;
    var aryData=[];
   
    var fullData=HQData.GetM1KLineDataBySymbol(symbol);
    if (fullData)
    {
        aryData=HQData.GetKLineDataByDateTime(fullData, first.date, first.time, 20999999, 9999)
    }

    var hqchartData={  symbol: symbol,name: symbol, ver:2.0, data:aryData };

    callback(hqchartData);
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


HQData.Finance_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var id=data.Request.Data.id;
    var hqchartData=null;
    if (id==7)  // 流通股本(随时间可能有变化)
    {
        hqchartData=TEST_FINANCE_7.data;
    }
    else 
    {
        var error= `Finance(${id}) 没有对接数据. [HQData.Finance_RequestData]`;
        hqchartData={ Error:error }; 
    }

    if (hqchartData) callback(hqchartData);
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


HQData.INDEX_RequestData=function(data,callback)
{
    data.PreventDefault=true;
    var period=data.Period;
    var symbol=data.Request.Data.symbol;
    var indexSymbol="000001.sh";
    var dateRange=data.Request.Data.dateRange;
    var aryData=[];
    if (ChartData.IsMinutePeriod(period, true))
    {
        var fullData=HQData.GetM1KLineDataBySymbol(symbol);
        if (fullData) aryData=HQData.GetKLineDataByDateTime(fullData, dateRange.Start.Date, dateRange.Start.Time, dateRange.End.Date, dateRange.End.Time);
    }
    else if (ChartData.IsDayPeriod(period,true))
    {
        var fullData=HQData.GetDayKLineDataBySymbol(indexSymbol);
        if (fullData) aryData=HQData.GetKLineDataByDate(fullData, dateRange.Start.Date, dateRange.End.Date);
    }

    var hqchartData={ name:indexSymbol, symbol:indexSymbol, data:aryData, ver:2.0 };

    callback(hqchartData);
}

//////////////////////////////////////////////////////////////////////////////////////
// 报价列表
//
//
/////////////////////////////////////////////////////////////////////////////////////

//码表
HQData.Report_RequestStockListData=function(data, callback)
{
    data.PreventDefault=true;

    var hqchartData={ data:[] };
    
    if (IFrameSplitOperator.IsNonEmptyArray(SHSZ_STOCK_LIST_TEST_DATA.symbol))
    {
        //0=证券代码 1=股票名称
        for(var i=0;i<SHSZ_STOCK_LIST_TEST_DATA.symbol.length;++i)
        {
            var symbol=SHSZ_STOCK_LIST_TEST_DATA.symbol[i];
            var name=SHSZ_STOCK_LIST_TEST_DATA.name[i];
            var item=[symbol,name];
            //item[88]=1;
            hqchartData.data.push(item);
        }
    }

    console.log("[HQData.Report_RequestStockListData] hqchartData",hqchartData);
    callback(hqchartData);

}

//空码表
HQData.Report_RequestStockListData_Empty=function(data, callback)          
{
    data.PreventDefault=true;
    var hqchartData={ data:[] };
    console.log("[HQData.Report_RequestStockListData_EMPTY] hqchartData",hqchartData);
    callback(hqchartData);
}

HQData.Report_RequestMemberVirtualListData=function(data, callback, option)
{
    var symbol=data.Request.Data.symbol;    //板块代码
    data.PreventDefault=true;

    var hqchartData= { symbol:symbol , name:symbol, data:[] , code:0, Virtual:{ Count:option.Virtual.Count } };

    for(var i=0; i<SHSZ_STOCK_LIST_TEST_DATA.symbol.length && i<50; ++i )
    {
        hqchartData.data.push(SHSZ_STOCK_LIST_TEST_DATA.symbol[i]);
    }

    callback(hqchartData);
}

//板块|行业等成分列表
HQData.Report_RequestMemberListDat=function(data, callback)
{
    var symbol=data.Request.Data.symbol;    //板块代码
    data.PreventDefault=true;

    var hqchartData= { symbol:symbol , name:symbol, data:[] , code:0 };
    var testDataCount=SHSZ_STOCK_LIST_TEST_DATA.symbol.length;
    var testIndex=Math.round(Math.random()*(testDataCount-100));
    var count=parseInt(Math.random()*(200)+100); ;

    for(var i=testIndex, j=0; i<SHSZ_STOCK_LIST_TEST_DATA.symbol.length && j<count; ++i, ++j)
    {
        hqchartData.data.push(SHSZ_STOCK_LIST_TEST_DATA.symbol[i]);
    }

    callback(hqchartData);
}

HQData.Report_RequestStockData=function(data, callback)
{
    var stocks=data.Request.Data.stocks;    //股票列表
    data.PreventDefault=true;

    setTimeout(()=>
    {
        var mapStock=new Map();
        for(var i=0;i<stocks.length;++i)
        {
            var item=stocks[i];
            mapStock.set(item.Symbol,{ Symbol:item.Symbol, Data:null });
        }

        if (IFrameSplitOperator.IsNonEmptyArray(SHSZ_STOCK_LIST_TEST_DATA.symbol))
        {
            for(var i=0;i<SHSZ_STOCK_LIST_TEST_DATA.symbol.length;++i)
            {
                var symbol=SHSZ_STOCK_LIST_TEST_DATA.symbol[i];
                if (!mapStock.has(symbol)) continue;
                var item=mapStock.get(symbol);
                var name=SHSZ_STOCK_LIST_TEST_DATA.name[i];
                var price=SHSZ_STOCK_LIST_TEST_DATA.close[i];
                var vol=SHSZ_STOCK_LIST_TEST_DATA.vol[i];
                var newItem=
                [
                    symbol, 
                    name, 
                    SHSZ_STOCK_LIST_TEST_DATA.yclose[i],
                    SHSZ_STOCK_LIST_TEST_DATA.open[i],
                    SHSZ_STOCK_LIST_TEST_DATA.high[i],
                    SHSZ_STOCK_LIST_TEST_DATA.low[i],
                    price,
                    vol,
                    SHSZ_STOCK_LIST_TEST_DATA.amount[i],
                ];

                //买价 量
                newItem[9]=price+0.05;
                newItem[10]=10;

                //卖价 量
                newItem[11]=price-0.06;
                newItem[12]=5;

                //均价
                newItem[13]=price-0.03;   
                
                //内盘
                newItem[18]=vol/4;  
                //外盘 
                newItem[19]=vol/5;  

                newItem[14]=vol*1.5;   //流通股本
                newItem[15]=vol*1.8;  //总股本

                //换手率
                newItem[23]=(Math.round(Math.random()*60))/100;

                //名字字段
                var symbolEx={ Text:name };
                if (i%20==5)
                    symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}, { Text:'\ue627', Color:'#1c65db'} ] };
                else if (i%20==9)
                    symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}] } ;
                else if (i%20==18)
                    symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue627', Color:'#1c65db'}] } ;

                newItem[27]=symbolEx;


                newItem[38]=HQData.GetRandomTestData(10,20000);        //持仓量
                newItem[39]=HQData.GetRandomTestData(10,100);        //结算价
                newItem[40]=HQData.GetRandomTestData(10,100);        //昨结算价
                newItem[41]=HQData.GetRandomTestData(10,20000);        //开仓量
                newItem[42]=HQData.GetRandomTestData(10,20000);        //平仓量

                //1,3,5,10,15 涨速%
                newItem[43]=HQData.GetRandomTestData(-90,90); 
                newItem[44]=HQData.GetRandomTestData(-90,90); 
                newItem[45]=HQData.GetRandomTestData(-90,90); 
                newItem[46]=HQData.GetRandomTestData(-90,90); 
                newItem[47]=HQData.GetRandomTestData(-90,90); 


                //扩展数据 (定制数据)
                var extendData=[];
                newItem[30]=extendData;

                //行业
                extendData[0]="行业X";
                //地区
                extendData[1]="地区X";
                
                //PE|PB
                extendData[2]=(Math.round(Math.random()*60))/100;
                extendData[3]=(Math.round(Math.random()*60))/100;
                extendData[4]=(Math.round(Math.random()*60))/100;
                extendData[5]=(Math.round(Math.random()*60))/100;

            
                //周涨幅
                extendData[6]=(Math.round(Math.random()*60))/100;
                extendData[7]=(Math.round(Math.random()*60))/100;
                extendData[8]=(Math.round(Math.random()*60))/100;


                newItem[32]=HQData.Report_CreateMinuteData(newItem[2]);

                //K线
                var kData={ Data:[newItem[3], newItem[4], newItem[5], newItem[6]] };
                newItem[33]=kData;


                newItem[101]=HQData.GetRandomTestData(-9990,10000000);
                newItem[201]=`A-[${HQData.GetRandomTestData(-90,90)}]-B`;


                newItem[301]=HQData.GetRandomTestData(0,100)/100;
                newItem[302]=HQData.GetRandomTestData(0,100)/100;
                

                item.Data=newItem;
            }
        }

        var hqchartData={  data:[], code:0 };

        for(var mapItem of mapStock)
        {
            var item=mapItem[1];
            if (!item.Data) continue;

            hqchartData.data.push(item.Data);
        }

        callback(hqchartData);
    }, 500);
}

HQData.Report_CreateMinuteData=function(yClose)
{
    var minuteData={ Data:[], Max:null, Min:null, Count:242, YClose:yClose };
    var TEST_DATA=[0.01, -0.02, 0.03, -0.05, -0.01, 0.02, 0.05, 0.01, 0.04, -0.04];
    var value=yClose;
    for(var i=0;i<minuteData.Count;++i)
    {
        var index=Math.ceil(Math.random()*10);
    
        value+=(yClose*TEST_DATA[index%TEST_DATA.length]);	//生成模拟的数据
        minuteData.Data[i]=value;
    
        if (minuteData.Max==null || minuteData.Max<value) minuteData.Max=value;
        if (minuteData.Min==null || minuteData.Min>value) minuteData.Min=value;
    }

    if (value>yClose) 
    {
        minuteData.Color="rgb(255,0,0)";
        minuteData.AreaColor="rgba(255,0,0,0.2)";
    }
    else if (value<yClose)
    {
        minuteData.Color="rgb(4,139,34)";
        minuteData.AreaColor="rgba(4,139,34,0.2)";
    }
    
    return minuteData;
}

HQData.Report_RequestStockSortData=function(data, callback)
{
    var blockID=data.Request.Data.symbol;       //板块代码
    var range=data.Request.Data.range;          //排序范围
    var column=data.Request.Data.column;        //排序列信息
    var sortType=data.Request.Data.sort;        //排序方向
    var pageSize=data.Request.Data.pageSize;
    data.PreventDefault=true;

    var start=range.start;
    var end=range.end;
    if (start>0) start-=pageSize;
    if (start<0) start=0;
    end+=pageSize;

    var aryData=data.Self.Data.Data.slice(); //所有的股票
    var mapStock=new Map();
    var count=end-start+1;
    for(var i = 0; i < count; i++)
    {
        var index = Math.floor(Math.random()*(aryData.length-1));
        var symbol =  aryData[index];
        mapStock.set(symbol, { Symbol:symbol, Index:i+start, Data:null });
        aryData.splice(index, 1);
    }

    if (IFrameSplitOperator.IsNonEmptyArray(SHSZ_STOCK_LIST_TEST_DATA.symbol))
    {
        for(var i=0;i<SHSZ_STOCK_LIST_TEST_DATA.symbol.length;++i)
        {
            var symbol=SHSZ_STOCK_LIST_TEST_DATA.symbol[i];
            if (!mapStock.has(symbol)) continue;
            var item=mapStock.get(symbol);
            var name=SHSZ_STOCK_LIST_TEST_DATA.name[i];
            var price=SHSZ_STOCK_LIST_TEST_DATA.close[i];
            var vol=SHSZ_STOCK_LIST_TEST_DATA.vol[i];
            var newItem=
            [
                symbol, 
                name, 
                SHSZ_STOCK_LIST_TEST_DATA.yclose[i],
                SHSZ_STOCK_LIST_TEST_DATA.open[i],
                SHSZ_STOCK_LIST_TEST_DATA.high[i],
                SHSZ_STOCK_LIST_TEST_DATA.low[i],
                price,
                vol,
                SHSZ_STOCK_LIST_TEST_DATA.amount[i],
            ];

            //买价 量
            newItem[9]=price+0.05;
            newItem[10]=10;

            //卖价 量
            newItem[11]=price-0.06;
            newItem[12]=5;

            //均价
            newItem[13]=price-0.03;   
            
            //内盘
            newItem[18]=vol/4;  
            //外盘 
            newItem[19]=vol/5;  

            newItem[14]=vol*1.5;   //流通股本
            newItem[15]=vol*1.8;  //总股本

            //换手率
            newItem[23]=(Math.round(Math.random()*60))/100;

            //名字字段
            var symbolEx={ Text:name };
            if (i%20==5)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}, { Text:'\ue627', Color:'#1c65db'} ] };
            else if (i%20==9)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}] } ;
            else if (i%20==18)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue627', Color:'#1c65db'}] } ;

            newItem[27]=symbolEx;


            //扩展数据 (定制数据)
            var extendData=[];
            newItem[30]=extendData;

            //行业
            extendData[0]="行业X";
            //地区
            extendData[1]="地区X";
            
            //PE|PB
            extendData[2]=(Math.round(Math.random()*60))/100;
            extendData[3]=(Math.round(Math.random()*60))/100;
            extendData[4]=(Math.round(Math.random()*60))/100;
            extendData[5]=(Math.round(Math.random()*60))/100;

            
            //周涨幅
            extendData[6]=(Math.round(Math.random()*60))/100;
            extendData[7]=(Math.round(Math.random()*60))/100;
            extendData[8]=(Math.round(Math.random()*60))/100;
                

            item.Data=newItem;
        }
    }

    var hqchartData={ data:[], index:[], filedindex:column.index, sort:sortType, symbol:blockID };

    for(var mapItem of mapStock)
    {
        var item=mapItem[1];
        if (!item.Data) continue;

        hqchartData.data.push(item.Data);
        hqchartData.index.push(item.Index);
    }
    
    callback(hqchartData);
}


HQData.Report_RequestVirtualStockData=function(data, callback)
{
    var blockID=data.Request.Data.symbol;       //板块代码
    var range=data.Request.Data.range;          //排序范围
    var column=data.Request.Data.column;        //排序列信息
    var sortType=data.Request.Data.sort;        //排序方向
    var pageSize=data.Request.Data.pageSize;
    data.PreventDefault=true;

    var start=range.start;
    var end=range.end;
    if (start>0) start-=pageSize;
    if (start<0) start=0;
    end+=pageSize;

    var count=end-start+1;
    
    var aryData=[];
    var aryIndex=[];

    if (IFrameSplitOperator.IsNonEmptyArray(SHSZ_STOCK_LIST_TEST_DATA.symbol))
    {
        var randomStart = Math.floor(Math.random()*(SHSZ_STOCK_LIST_TEST_DATA.symbol.length-1));
        var symbolCount=SHSZ_STOCK_LIST_TEST_DATA.symbol.length;
        for(var i=0;i<count;++i)
        {
            var dataIndex=(randomStart+i)%symbolCount;
            var symbol=SHSZ_STOCK_LIST_TEST_DATA.symbol[dataIndex];
            var name=SHSZ_STOCK_LIST_TEST_DATA.name[dataIndex];
            var price=SHSZ_STOCK_LIST_TEST_DATA.close[dataIndex];
            var vol=SHSZ_STOCK_LIST_TEST_DATA.vol[dataIndex];
            var newItem=
            [
                symbol, 
                name, 
                SHSZ_STOCK_LIST_TEST_DATA.yclose[dataIndex],
                SHSZ_STOCK_LIST_TEST_DATA.open[dataIndex],
                SHSZ_STOCK_LIST_TEST_DATA.high[dataIndex],
                SHSZ_STOCK_LIST_TEST_DATA.low[dataIndex],
                price,
                vol,
                SHSZ_STOCK_LIST_TEST_DATA.amount[dataIndex],
            ];

            //买价 量
            newItem[9]=price+0.05;
            newItem[10]=10;

            //卖价 量
            newItem[11]=price-0.06;
            newItem[12]=5;

            //均价
            newItem[13]=price-0.03;   
            
            //内盘
            newItem[18]=vol/4;  
            //外盘 
            newItem[19]=vol/5;  

            newItem[14]=vol*1.5;   //流通股本
            newItem[15]=vol*1.8;  //总股本

            //换手率
            newItem[23]=(Math.round(Math.random()*60))/100;

            //名字字段
            var symbolEx={ Text:name };
            if (i%20==5)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}, { Text:'\ue627', Color:'#1c65db'} ] };
            else if (i%20==9)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue629', Color:'rgb(255,165,0)'}] } ;
            else if (i%20==18)
                symbolEx.Symbol={ Family:'iconfont', Size:16,  Data:[ { Text:'\ue627', Color:'#1c65db'}] } ;

            newItem[27]=symbolEx;


            //扩展数据 (定制数据)
            var extendData=[];
            newItem[30]=extendData;

            //行业
            extendData[0]="行业X";
            //地区
            extendData[1]="地区X";
            
            //PE|PB
            extendData[2]=(Math.round(Math.random()*60))/100;
            extendData[3]=(Math.round(Math.random()*60))/100;
            extendData[4]=(Math.round(Math.random()*60))/100;
            extendData[5]=(Math.round(Math.random()*60))/100;

            
            //周涨幅
            extendData[6]=(Math.round(Math.random()*60))/100;
            extendData[7]=(Math.round(Math.random()*60))/100;
            extendData[8]=(Math.round(Math.random()*60))/100;


            newItem[351]={Title:"启动"};
            newItem[352]={Title:"加入"};


            aryData.push(newItem);
            aryIndex.push(start+i);
        }
    }

    var hqchartData={ data:aryData, index:aryIndex, filedindex:-1, sort:sortType, symbol:blockID };

    if (column)  hqchartData.filedindex=column.index;

    callback(hqchartData);
}



HQData.Keyboard_RequestSymbolList=function(data, callback)
{
    //加载数据
    var recv={ symbollist:SYMBOL_LIST };
    var arySymbol=[];
    for(var i=0;i<recv.symbollist.length;++i)
    {
        var item=recv.symbollist[i];
        var shortSymbol=item[0];
        shortSymbol=shortSymbol.replace(".sh", "");
        shortSymbol=shortSymbol.replace(".sz", "");
        var symbolItem={ Symbol:item[0], Name:item[1], ShortSymbol:shortSymbol, Spell:item[3], Type:item[2], Data:{ Symbol:item[0], Type:0 }  };
        if (symbolItem.Type=="EQA") 
        {
            symbolItem.TypeName="股票";
        }
        else if (symbolItem.Type=="IDX") 
        {
            symbolItem.TypeName="指数";
            symbolItem.Color="rgb(30,144,255)";
        }

        arySymbol.push(symbolItem);
    }

    arySymbol.push( { Symbol:"ICL8.cfe", Name:"中证主连", ShortSymbol:"ICL8", Spell:"ICL8", Type:"期货", TypeName:"期货", Data:{ Symbol:"ICL8.cfe", Type:0 }  } );
    arySymbol.push( { Symbol:"IML8.cfe", Name:"中千主连", ShortSymbol:"IML8", Spell:"IML8", Type:"期货", TypeName:"期货", Data:{ Symbol:"IML8.cfe", Type:0 }  } );
    arySymbol.push( { Symbol:"IFL8.cfe", Name:"沪深主连", ShortSymbol:"IFL8", Spell:"IFL8", Type:"期货", TypeName:"期货", Data:{ Symbol:"IFL8.cfe", Type:0 }  } );

    arySymbol.push( { Symbol:"01", Name:"分时成交明细", TypeName:"功能键", Priority:1, Color:"rgb(220,20,60)" , Data:{ PageName:"分时成交明细", Type:2 }} );
    arySymbol.push( { Symbol:"02", Name:"分价表", TypeName:"功能键", Priority:1, Color:"rgb(220,20,60)" ,Data:{ PageName:"分价表", Type:2 }} );
    arySymbol.push( { Symbol:"06", Name:"自选股", TypeName:"功能键", Priority:1 , Color:"rgb(220,20,60)", Data:{ PageName:"自选股", Type:2 }} );

    arySymbol.push( { Symbol:"MACD", Name:"平滑异同平均线", TypeName:"指标", Priority:2 , Color:"rgb(0,144,255)", Data:{ Index:"MACD", Type:1 }} );
    arySymbol.push( { Symbol:"RSI", Name:"相对强弱指标", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)",Data:{ Index:"RSI", Type:1 }}  );
    arySymbol.push( { Symbol:"MA", Name:"均线", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"MA", Type:1 } } );
    arySymbol.push( { Symbol:"BOLL", Name:"布林线", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"BOLL", Type:1 } } );
    arySymbol.push( { Symbol:"KDJ", Name:"随机指标", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"KDJ", Type:1 } } );
    arySymbol.push( { Symbol:"SKDJ", Name:"慢速随机指标", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"SKDJ", Type:1 } } );
    arySymbol.push( { Symbol:"KD", Name:"随机指标KD", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"KD", Type:1 } } );
    arySymbol.push( { Symbol:"MARSI", Name:"相对强弱平均线", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"MARSI", Type:1 } } );
    arySymbol.push( { Symbol:"VMACD", Name:"量平滑异同平均", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"VMACD", Type:1 } } );
    arySymbol.push( { Symbol:"AMO", Name:"成交金额", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"AMO", Type:1 } } );
    arySymbol.push( { Symbol:"SQJZ", Name:"神奇九转", TypeName:"指标", Priority:2, Color:"rgb(0,144,255)" ,Data:{ Index:"SQJZ", Type:1 } } );
    
    callback(arySymbol);
}


HQData.GetRandomTestData=function(min, max)   //测试数据
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}


HQData.GetM1KLineDataBySymbol=function(symbol)
{
    var data=null;
    switch(symbol)
    {
        case "000001.sh":
            data=SH_000001_M1_KLINE;
            break;
        case "000300.sh":
            data=SH_000300_M1_KLINE;
            break;
        case "399001.sz":
            data=SZ_399001_M1_KLINE;
            break;
        case "000001.sz":
            data=SZ_000001_M1_KLINE;
            break;
        case "600000.sh":
            data=SH_600000_M1_KLINE;
            break;
        case "000151.sz":
            data=SZ_000151_M1_KLINE;
            break;
        case "399005.sz":
            data=SZ_399005_M1_KLINE;
            break;
        case "399006.sz":
            data=SZ_399006_M1_KLINE;
            break;
        case "ICL8.cfe":
            data=CFE_ICL8_M1_KLINE;
            break;
        case "IML8.cfe":
            data=CFE_IML8_M1_KLINE;
            break;
        case "IFL8.cfe":
            data=CFE_IFL8_M1_KLINE;
            break;
        default:
            data=SZ_000001_M1_KLINE;
            break;
    }
    
    if (!data) return null;

    return data.data;
}

HQData.GetDayKLineDataBySymbol=function(symbol)
{
    var data=null;
    switch(symbol)
    {
        case "000001.sh":
            data=SH_000001_DAY_KLINE;
            break;
        case "000300.sh":
            data=SH_000300_DAY_KLINE;
            break;

        case "399001.sz":
            data=SZ_399001_DAY_KLINE;
            break;
        case "000001.sz":
            data=SZ_000001_DAY_KLINE;
            break;
        case "600000.sh":
            data=SH_600000_DAY_KLINE;
            break;
        case "000151.sz":
            data=SZ_000151_DAY_KLINE;
            break;
        case "399005.sz":
            data=SZ_399005_DAY_KLINE;
            break;
        case "399006.sz":
            data=SZ_399006_DAY_KLINE;
            break;
        case "ICL8.cfe":
            data=CFE_ICL8_DAY_KLINE;
            break;
        case "IML8.cfe":
            data=CFE_IML8_DAY_KLINE;
            break;
        case "IFL8.cfe":
            data=CFE_IFL8_DAY_KLINE;
            break;
        default:
            data=SZ_000001_DAY_KLINE;
            break;
    }
   
    if (!data) return null;

    return data.data;
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
        if (date>=startDate && date<=endDate)
            aryData.push(kItem);
    }

    return aryData;
}

//日线随机K线
HQData.GetKLineRandomDayData=function(fullData, startDate, dayCount)
{
    var startIndex=-1;
    var startItem=null;
    for(var i=0;i<fullData.length;++i)
    {
        var kItem=fullData[i];
        if (kItem[0]==startDate)
        {
            startIndex=i;
            startItem=kItem;
            break;
        }
    }

    if (!startItem) return null;

    var date=startItem[0];
    var year=parseInt(date/10000);
    var month=parseInt(date/100)%100;
    var day=date%100;
    var newDate=new Date(year,month-1, day);

    var yClose=startItem[1];
    var aryData=[];
    for(var i=0; i<dayCount; ++i)
    {
        newDate.setDate(newDate.getDate()+1);
        var week=newDate.getDay();
        if (week==0 || week==6) continue;

        var date=newDate.getFullYear()*10000+(newDate.getMonth()+1)*100+newDate.getDate();

        var index=startIndex-i-1;
        var kItem=fullData[index];

        var newItem=[date, yClose, kItem[2], kItem[3], kItem[4],kItem[5]];
        newItem[13]=true;

        aryData.push(newItem);

        yClose=newItem[5];
    }

    return aryData;
}


HQData.GetDayMinuteDataBySymbol=function(symbol)
{
    var data=null;
    var upperSymbol=null;
    if (symbol) upperSymbol=symbol.toUpperCase();
    switch(upperSymbol)
    {
        case "000001.SZ":
            data=SZ_000001_1DAY_MINUTE;
            break;
        case "600000.SH":
            data=SH_600000_1DAY_MINUTE;
            break;
        case "000151.SZ":
            data=SZ_000151_1DAY_MINUTE;
            break;
        case "IM2503.CF":
            data=CF_IM2503_1DAY_MINUTE;
            break;
        default:
            data=SZ_000151_1DAY_MINUTE;
            break;
    }

    if (!data) return null;

    //生成测试均价
    var total=0, count=0;
    for(var i=0;i<data.stock[0].minute.length;++i)
    {
        var item=data.stock[0].minute[i];
        if (IFrameSplitOperator.IsPlusNumber(item.price))
        {
            total+=item.price;
            ++count;
            item.avprice=total/count;
        }
    }

    /*
    var aryMinute=[];
    for(var i=0;i<data.stock[0].minute.length;++i)
    {
        var item=data.stock[0].minute[i];
        var newItem=
        { 
            price:item.price,
            open:item.open,
            low:item.low,
            high:item.high,
            vol:item.vol,
            amount:item.amount,
            time:item.time,
        }

        aryMinute.push(newItem);
    }

    data.stock[0].minute=aryMinute;
    */

    return data.stock;
}

HQData.GetMulitDayMinuteDataBySymbol=function(symbol)
{
    var data=null;
    switch(symbol)
    {
        case "000001.sz":
            data=SZ_000001_5DAY_MINUTE;
            break;
        case "600000.sh":
            data=SH_600000_5DAY_MINUTE;
            break;
        case "000151.sz":
            data=SZ_000151_5DAY_MINUTE;
            break;
        default:
            data=SZ_000151_5DAY_MINUTE;
            break;
    }

    if (!data) return null;

    //生成测试均价
    for(var i=0;i<data.data.length;++i)
    {
        var dayItem=data.data[i];
        var total=0, count=0;
        for(var j=0;j<dayItem.minute.length;++j)
        {
            var item=dayItem.minute[j];
            if (IFrameSplitOperator.IsPlusNumber(item[2]))
            {
                total+=item[2];
                ++count;
                item[7]=total/count;
            }
        }
    }
    
    return data.data;
}

HQData.GetMulitDayMinuteDataByDate=function(aryDay, aryDate)
{
    var aryData=[];
    if (!IFrameSplitOperator.IsNonEmptyArray(aryDay)) return aryData;
    
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


HQData.Report_APIIndex=function(data, callback)
{
    var request=data.Request;
    if (request.Data.indexname=='API-MULTI_POINT')
        HQData.APIIndex_MULTI_POINT(data, callback);
    else if (request.Data.indexname=="API-DRAWTEXTREL")
        HQData.APIIndex_DRAWTEXTREL(data, callback);
    else if (request.Data.indexname=="API-DRAWCOLORKLINE")
        HQData.APIIndex_DRAWCOLORKLINE(data, callback);
    else if (request.Data.indexname=="API-DRAWBAND")
        HQData.APIIndex_DRAWBAND(data, callback);
    else if (request.Data.indexname=="API-MULTI_LINE")
        HQData.APIIndex_MULTI_LINE(data, callback);
    else if (request.Data.indexname=="API-MULTI_SVGICON")
        HQData.APIIndex_MULTI_SVGICON(data, callback);
    else if (request.Data.indexname=="API-DRAWTEXT_LINE")
        HQData.APIIndex_DRAWTEXT_LINE(data, callback);
    else if (request.Data.indexname=="API_DRAW_SIMPLE_TABLE")
        HQData.APIIndex_DRAW_SIMPLE_TABLE(data, callback);
    else if (request.Data.indexname=="API_DRAW_SIMPLE_PIE")
        HQData.APIIndex_DRAW_SIMPLE_PIE(data, callback);
    else if (request.Data.indexname=="API_DRAW_SIMPLE_DOUGHNUT")
        HQData.APIIndex_DRAW_SIMPLE_DOUGHNUT(data, callback);
    else if (request.Data.indexname=="API_DRAW_SIMPLE_RADAR")
        HQData.APIIndex_DRAW_SIMPLE_RADAR(data, callback);
    else if (request.Data.indexname=="API_MULTI_BAR")
        HQData.APIIndex_MULTI_BAR(data, callback);
    else if (request.Data.indexname=="API_MULTI_TEXT")
        HQData.APIIndex_MULTI_TEXT(data, callback);
    else if (request.Data.indexname=="API_PARTLINE")
        HQData.APIIndex_PARTLINE(data, callback);
    else if (request.Data.indexname=="API_CHANNELV2")
        HQData.APIIndex_CHANNEL_V2(data, callback);
    else if (request.Data.indexname=="API_DRAWKLINE")
        HQData.APIIndex_DRAWKLINE(data, callback);
    else if (request.Data.indexname=="API_TITLE")
        HQData.APIIndex_TITLE(data, callback);
    else if (request.Data.indexname=="API_SCATTER_PLOT_V2")
        HQData.APIIndex_SCATTER_PLOT_V2(data, callback);
    else if (request.Data.indexname=="API_KLINE_TABLE")
        HQData.APIIndex_KLINE_TABLE(data, callback);
    else if (request.Data.indexname=="API_DRAWSVG")
        HQData.APIIndex_DRAWSVG(data, callback); 
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
    callback(apiData);
}

HQData.APIIndex_DRAWTEXTREL=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var closeLine={ name:'价', type:0, data:kData.GetClose(), color:"rgb(255, 52, 179)" };

    var divText=
    { 
        name:'DRAWTEXTREL', type:1, 
        Draw: 
        { 
            DrawType:'DRAWTEXTREL', 
            DrawData: 
            {
                Point: {X: 500, Y: 500 },
                Text: "!!!!前方高能!!!!"
            },

            Font:"20px 微软雅黑"
        },
        color:"rgb(255,0,0)",

        DrawVAlign:1,
        DrawAlign:1,
    }

    var divText2=
    { 
        name:'DRAWTEXTABS', type:1, 
        Draw: 
        { 
            DrawType:'DRAWTEXTABS', 
            DrawData: 
            {
                Point: {X: 5, Y: 5 },
                Text: "后台指标示例"
            },

            Font:"24px 微软雅黑"
        },
        color:"rgb(255,200,0)",

        DrawVAlign:2,
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate() ,time:kData.GetTime(), outvar:[closeLine,divText, divText2] } 
    };
   
    console.log('[HQData::APIIndex_DRAWTEXTREL] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAWCOLORKLINE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var aryTestKData=[];
    var aryTestkData2=[];
    for(var i=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        if (i%5==3) aryTestKData[i]={ Open:item.Open, High:item.High, Low:item.Low, Close:item.Close };
        else aryTestKData[i]=null;

        if (i%13==5) aryTestkData2[i]={ Open:item.Open, High:item.High, Low:item.Low, Close:item.Close };
        else aryTestkData2[i]=null;
    }

    var varKLine={ type:1, name:"条件K线", Draw:{ DrawData:aryTestKData, DrawType:'DRAWCOLORKLINE', IsEmptyBar:false, Color:"rgb(100,0,100)"} }; 
    var varKLine2={ type:1, name:"条件K线2", Draw:{ DrawData:aryTestkData2, DrawType:'DRAWCOLORKLINE', IsEmptyBar:false, Color:"rgb(255, 140, 0)"} }; 

    var hqchartData=
    { 
        outdata:
        { 
            date:kData.GetDate(), time:kData.GetTime(), 
            outvar:[ varKLine, varKLine2] 
        } , 
        code:0
    };

    console.log("[HQData.APIIndex_DRAWCOLORKLINE] DRAWCOLORKLINE=",hqchartData);

    callback(hqchartData);
}


HQData.APIIndex_DRAWBAND=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();


    var bandData=
    { 
        name:"DRAWBAND", type:1, 
        Draw:
        { 
            Name:"DRAWBAND",
            DrawType:"DRAWBAND",
            DrawData:[],
            Color:["rgb(220,20,60)","rgb(34,139,34)"]
        },
    };

    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        bandData.Draw.DrawData[i]={ Value:kItem.Close, Value2:kItem.Open };
    }

    //var closeLine={ Name:'收', Type:0, Data:aryClose };
    //var openLine={ Name:'开', Type:0, Data:aryOpen};

    var hqchartData=
    { 
        outdata:{ date:kData.GetDate(), time:kData.GetTime(), outvar:[ bandData, ] } , 
        code:0
    };

    callback(hqchartData);
}


HQData.APIIndex_MULTI_LINE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var line3= 
    { 
        name:'MULTI_LINE', type:1, 
        
        Draw: 
        { 
            DrawType:'MULTI_LINE', DrawData:[],
            LineWidth:5,
            Arrow: 
            { 
                Start:true,     //是否绘制开始箭头 <-
                End:true,       //是否绘制结束箭头 ->
                Angle:30,       //三角斜边一直线夹角
                Length:10,      //三角斜边长度
                LineWidth:4,    //箭头粗细
            }
        }, //绘制线段数组

        IsShowTitle:true,
    };

    var point3=
    {
        Color:'rgb(255,0,255)', 
        Point:[]
    }

    for(var i=kData.Data.length-10;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        point3.Point.push({Date:item.Date, Time:item.Time, Value:item.High});
    }
    line3.Draw.DrawData.push(point3);


    var point1={ Color:'rgb(0,0,255)', Point:[] };
    var point2={ Color:'rgb(255,140,0)', Point:[] };
    var point3={ Color:'rgb(255, 255, 0)', Point:[] };
    var colorLine= 
    { 
        name:'MULTI_LINE', type:1, 
        
        Draw: 
        { 
            DrawType:'MULTI_LINE', DrawData:[point1,point2,point3],
            LineWidth:2,
        }, //绘制线段数组

        IsShowTitle:false
    };


    var index=kData.Data.length-50;
    if (index<0) index=0;
    for(var j=0; index<kData.Data.length && j<10; ++index, ++j)
    {
        var item=kData.Data[index];
        point1.Point.push({Date:item.Date, Time:item.Time, Value:item.Close});
    }

    --index;
    for(var j=0; index<kData.Data.length && j<10; ++index, ++j)
    {
        var item=kData.Data[index];
        point2.Point.push({Date:item.Date, Time:item.Time, Value:item.Close});
    }

    --index;
    for(var j=0; index<kData.Data.length && j<10; ++index, ++j)
    {
        var item=kData.Data[index];
        point3.Point.push({Date:item.Date, Time:item.Time, Value:item.Close});
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[line3,colorLine] } 
    };
    
    console.log('[HQData.APIIndex_MULTI_LINE] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_MULTI_SVGICON=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var iconData= 
    { 
        name:'MULTI_SVGICON', type:1, 
        Draw: 
        { 
            DrawType:'MULTI_SVGICON', 
            DrawData: 
            {
                Family:'iconfont', 
                Icon:
                [
                    //{ Date:20190916, Value:"High", Symbol:'\ue611', Color:'rgb(240,0,0)', Baseline:2 , YMove:-5},  //0 居中 1 上 2 下
                    //{ Date:20190919, Value:15.3, Symbol:'\ue615', Color:'rgb(240,240,0)', Baseline:2 },
                    //{ Date:20190909, Value:15.4, Symbol:'\ue615', Color:'rgb(240,100,30)'}
                ] 
            },

           
        } //绘制图标数组
    };

    var TEST_ICON_SYMBOL=['\ue678', '\ue66e', "\ue66b"];
    var TEST_ICON_COLOR=["'rgb(240,0,0)", "rgb(240,100,30)", "rgb(138,43, 226)", "rgb(151,255,255)", "rgb(255, 20, 147)"];

    for(var i=kData.Data.length-20, j=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];

        if (i%3!=1) continue;

        var iconIndex=Math.ceil(Math.random()*10) % TEST_ICON_SYMBOL.length;
        var colorIndex=Math.ceil(Math.random()*10) % TEST_ICON_COLOR.length;

        if (j==2)
        {
            var iconItem=
            {
                Date:item.Date, Time:item.Time, 
                Value:item.High,
                Symbol:TEST_ICON_SYMBOL[iconIndex], 
                Color:TEST_ICON_COLOR[colorIndex], 
                Baseline:2,
                YMove:-35,
                Line:{ Color:"rgb(153,50,204)", KData:"H", Width:1, Offset:[3,10], Dash:[5,5] },
            };

            var iconItem2=
            {
                Date:item.Date, Time:item.Time, 
                Value:item.Low,
                Symbol:TEST_ICON_SYMBOL[iconIndex], 
                Color:TEST_ICON_COLOR[colorIndex], 
                Baseline:2,
                YMove:50,
            };

            iconData.Draw.DrawData.Icon.push(iconItem2);
        }
        else if (j==3)
        {
            var iconItem=
            {
                Date:item.Date, Time:item.Time, 
                Value:"L",
                Symbol:TEST_ICON_SYMBOL[iconIndex], 
                Color:TEST_ICON_COLOR[colorIndex], 
                Baseline:1,
                YMove:5,
            };
        }
        else if (j==4)
        {
            var iconItem=
            {
                Date:item.Date, Time:item.Time, 
                Value:item.Low*0.95,
                Symbol:TEST_ICON_SYMBOL[iconIndex], 
                Color:TEST_ICON_COLOR[colorIndex], 
                Baseline:1,
                YMove:5,
                Line:{ Color:"rgb(153,50,204)", KData:"L", Width:1, Offset:[3,10], Dash:[5,5] },
                Text:"提示信息:<br>这个是提示信息"
            };
        }
        else
        {
            var iconItem=
            {
                Date:item.Date, Time:item.Time, 
                Value:item.High,
                Symbol:TEST_ICON_SYMBOL[iconIndex], 
                Color:TEST_ICON_COLOR[colorIndex], 
                Baseline:2,
                YMove:-20,
                Text:
                { 
                    AryText:
                    [
                        { Title:"日期:", Text:`${item.Date}`, Color:"rgb(230,230,230)", Align:"Left"},
                        { Title:"提示:", Text:"提示信息xxxxx", Color:"rgb(250,0,0)",Align:"Left"}
                    ] 
                },

                //Line:{ Color:"rgb(153,50,204)", KData:"H", Width:1, Offset:[3,10], Dash:[5,5] },
            };


            /*
            if (j%5==1)
                iconItem.Image={ Data:image1, Width:32, Height:32 };
            else if (j%5==3)
                iconItem.Image={ Data:image2, Width:32, Height:32 };
            */
        }

        iconData.Draw.DrawData.Icon.push(iconItem);
        ++j;
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate() , outvar:[iconData] } 
    };

    
    console.log('[HQData.APIIndex_MULTI_SVGICON] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAWTEXT_LINE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var lastItem=kData.Data[kData.Data.length-1];
    var price=(lastItem.High+lastItem.Low)/2+0.3;

    var lineData= 
    { 
        name:'DRAWTEXT_LINE', type:1, 
        Draw: 
        { 
            DrawType:'DRAWTEXT_LINE', 
            DrawData: 
            {
                Price:price,
                Text:
                { 
                    Title:`价格:${price.toFixed(2)}`, 
                    Color:"rgb(255, 165, 0)",
                }, 

                Line:
                { 
                    Type:1,  //Type 0=不画 1=直线 2=虚线
                    //LineDash:[10,10],
                    Color:"rgb(200,200,0)", 
                    //Width:1,
                },   
            }
        } 
    };

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate() , outvar:[lineData] } 
    };

    
    console.log('[HQData.APIIndex_DRAWTEXT_LINE] apiData ', apiData);
    callback(apiData);
}

HQData.APIIndex_DRAW_SIMPLE_TABLE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var tableData= 
    { 
        name:'DRAW_SIMPLE_TABLE', type:1, 
        Draw: 
        { 
            DrawType:'DRAW_SIMPLE_TABLE', 
            DrawData: 
            {
                //BGColor:"rgba(250,250,210,0.8)",
                //BorderColor:"rgb(0,0,255)",
                //TextColor:"rgb(0,191,255)",
                TableData:
                [
                    { AryCell:[{ Text:"股票代码"}, { Text:"主营业务", TextAlign:'center'}, { Text:"每股收益(元)"}] },
                    { AryCell:[{ Text:"美丽生态"}, { Text:"园林绿化"}, { Text:"13.5", Color:"rgb(139,0,139)"}] },
                    { AryCell:[{ Text:"深物业A"}, { Text:"房地产及相关业务", BGColor:"rgb(200,200,200)"}, { Text:"0.12"}] },
                    { AryCell:[{ Text:"深科技"}, { Text:"计算机硬件、通讯设备等"}, { Text:"5.4"}] },
                ],

                //TextFont:{ Size:16, Name:"微软雅黑"},
                //XOffset:-10,
                //YOffset:-15,
            }
        } 
    };

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime() , outvar:[tableData] } 
    };

    
    console.log('[HQData.APIIndex_DRAW_SIMPLE_TABLE] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAW_SIMPLE_PIE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var tableData= 
    { 
        name:'DRAW_SIMPLE_PIE', type:1, 
        Draw: 
        { 
            DrawType:'DRAW_SIMPLE_PIE', 
            DrawData: 
            {
                //BGColor:"rgba(250,250,210,0.8)",
                //BorderColor:"rgb(110,110,110)",
                //TextColor:"rgb(0,191,255)",
                Data:
                [
                    { Value:10, Text:"数据1:10", Color:"rgba(255,182,193,0.8)", TextColor:"rgb(250,250,250)", LineColor:"rgb(255,182,193)"},
                    { Value:70, Text:"数据2:70", Color:"rgba(255,0,255,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(255,0,255)"},
                    { Value:110, Text:"数据3:110", Color:"rgba(72,61,139,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(72,61,139)"},
                    { Value:210, Text:"数据4:210", Color:"rgba(0,191,255,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(0,191,255)"},
                    { Value:310, Text:"数据5:310", Color:"rgba(255,140,0,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(255,140,0)"},
                ],

                //TextFont:{ Size:16, Name:"微软雅黑"},
                //XOffset:-10,
                //YOffset:-15,
                Radius:80,
            }
        } 
    };

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime() , outvar:[tableData] } 
    };

    
    console.log('[HQData.APIIndex_DRAW_SIMPLE_PIE] apiData ', apiData);
    callback(apiData);
}

HQData.APIIndex_DRAW_SIMPLE_DOUGHNUT=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var tableData= 
    { 
        name:'DRAW_SIMPLE_DOUGHNUT', type:1, 
        Draw: 
        { 
            DrawType:'DRAW_SIMPLE_DOUGHNUT', 
            DrawData: 
            {
                //BGColor:"rgba(250,250,210,0.8)",
                //BorderColor:"rgb(110,110,110)",
                //TextColor:"rgb(0,191,255)",
                Data:
                [
                    { Value:100, Text:"数据1:10", Color:"rgba(255,182,193,0.8)", TextColor:"rgb(250,250,250)", LineColor:"rgb(255,182,193)"},
                    { Value:70, Text:"数据2:70", Color:"rgba(255,0,255,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(255,0,255)"},
                    { Value:110, Text:"数据3:110", Color:"rgba(72,61,139,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(72,61,139)"},
                    { Value:210, Text:"数据4:210", Color:"rgba(0,191,255,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(0,191,255)"},
                    { Value:310, Text:"数据5:310", Color:"rgba(255,140,0,0.8)",TextColor:"rgb(250,250,250)", LineColor:"rgb(255,140,0)"},
                ],

                //TextFont:{ Size:16, Name:"微软雅黑"},
                //XOffset:-10,
                //YOffset:-15,
                Radius:80,
            }
        } 
    };

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime() , outvar:[tableData] } 
    };

    
    console.log('[HQData.APIIndex_DRAW_SIMPLE_PIE] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAW_SIMPLE_RADAR=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var tableData= 
    { 
        name:'DRAW_SIMPLE_RADAR', type:1, 
        Draw: 
        { 
            DrawType:'DRAW_SIMPLE_RADAR', 
            DrawData: 
            {
                //BGColor:"rgba(250,250,210,0.8)",
                //BorderColor:"rgb(110,110,110)",
                //TextColor:"rgb(0,191,255)",
                Data:
                [
                    { Value:10, Name:"1月", Group:"组1"},
                    { Value:70, Name:"2月", Group:"组1"},
                    { Value:80, Name:"3月", Group:"组1"},
                    { Value:10, Name:"4月", Group:"组1"},
                    { Value:40, Name:"5月", Group:"组1"},
                    { Value:60, Name:"6月", Group:"组1"},
                    { Value:66, Name:"7月", Group:"组1"},
                    { Value:69, Name:"8月", Group:"组1"},
                    { Value:80, Name:"9月", Group:"组1"},
                    { Value:30, Name:"10月", Group:"组1"},
                    { Value:20, Name:"11月", Group:"组1"},
                    { Value:68, Name:"12月", Group:"组1"},
                ],

                AryIndex:
                [
                    { Name:"1月" },
                    { Name:"2月" },
                    { Name:"3月" },
                    { Name:"4月" },
                    { Name:"5月" },
                    { Name:"6月" },
                    { Name:"7月" },
                    { Name:"8月" },
                    { Name:"9月" },
                    { Name:"10月" },
                    { Name:"11月" },
                    { Name:"12月" },
                ],

                //TextFont:{ Size:16, Name:"微软雅黑"},
                //XOffset:-10,
                //YOffset:-15,
                Radius:50,
            }
        } 
    };

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime() , outvar:[tableData] } 
    };

    
    console.log('[HQData.APIIndex_DRAW_SIMPLE_RADAR] apiData ', apiData);
    callback(apiData);
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
        }, //绘制柱子数组
        IsShowTitle:true,
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
        //Width:10
    };

    var point2=
    { 
        Color:'rgb(55,228,181)',            //颜色
        BorderColor:"rgb(255,165,0)",       //边框景色
        Type:2,
        Name:"柱子下部",
        Point:
        [
            //{Date:20190916, Time: Value:15.5, Value2:0 },
        ],
        //Width:10
    };

    for(var i=0;i<kData.Data.length;++i)
    {
        var item=kData.Data[i];
        ///point.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2, Value2:item.High});
        ///point2.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2, Value2:item.Low});

        point.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2+HQData.GetRandomTestData(2,10), Value2:item.High});
        point2.Point.push({Date:item.Date, Time:item.Time, Value:(item.High+item.Low)/2-HQData.GetRandomTestData(2,10), Value2:item.Low});
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
    callback(apiData);

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
    callback(apiData);
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
    callback(apiData);
}


HQData.APIIndex_CHANNEL_V2=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var channelData= 
    { 
        name:'通道示例', type:1, 
        Draw: 
        { 
            DrawType:'JS_CHART_CHANNEL_V2', 
            DrawData:
            {
                AryData:[]
            }
        } 
    };

    var aryTestData=kData.GetCloseMA(10);
    var ARRAY_COLOR=["rgb(0, 0 ,255)", "rgb(255,0,255)", "rgb(255,165,0)"];
    var colorIndex=0;
    for(var i=20;i<kData.Data.length;++i)
    {
        var index=i%15;
        var kItem=kData.Data[i];
        var value=aryTestData[i];
        var value2=value*1.03;
        var item={ Date:kItem.Date, Time:kItem.Time, Value: value, Value2:value2 };
        //var item={ Date:kItem.Date, Time:kItem.Time, Value: kItem.Close*(1.05), Value2:kItem.Close };

        item.Color=ARRAY_COLOR[colorIndex%ARRAY_COLOR.length];
        channelData.Draw.DrawData.AryData.push(item);

        if (index==0 && i>0) ++colorIndex;
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[channelData] } 
    };

    console.log('[HQData.APIIndex_CHANNEL_V2] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAWKLINE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var klineData=
    { 
        name:"DRAWKLINE", type:1, 
        Draw:
        { 
            Name:"DRAWKLINE",
            DrawType:"DRAWKLINE",
            DrawData:[],
            Config:{ IsShowMaxMinPrice:true, IsShowKTooltip:true, Symbol:"000001.sh", Name:"上证指数11" }
        },
        IsShowTitle:true,
    };

    var aryDate=[];
    var aryTime=[];
    for(var i=100;i<kData.Data.length-100;++i)
    {
        var kItem=kData.Data[i];
        var newItem=
        { 
            YClose:kItem.YClose, 
            Open:kItem.Open, 
            High:kItem.High, 
            Low:kItem.Low, 
            Close:kItem.Close, 
            Date:kItem.Date, 
            Time:kItem.Time,
            Vol:kItem.Vol,
        };

        klineData.Draw.DrawData.push(newItem);

        aryDate.push(kItem.Date);
        aryTime.push(kItem.Time);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:aryDate, time:aryTime, outvar:[ klineData] } 
    };

    console.log('[HQData.APIIndex_DRAWKLINE] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_TITLE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var textData={ name:"标题", type:10, color:"rgb(0,128,128)", data:[], };    //名字
    var closeData={ name:"收盘价", type:0, color:"rgb(255,165,0)", data:[] } ;    //

    var titleData=
    { 
        name:"我的指标标题", type:1, 
        Draw:
        { 
            Name:"指标标题测试",
            DrawType:"DRAWTITLE",
            DrawData:{ AryTitle:[] },
        },
    };

    for(var i=0;i<kData.Data.length-30;++i)
    {
        var kItem=kData.Data[i];
        
        closeData.data.push(kItem.Close);

        titleData.Draw.DrawData.AryTitle.push(
            {
                Date:kItem.Date, Time:kItem.Time,

                AryText:
                [
                    { Name:`收`, Text:`${kItem.Close.toFixed(2)}`, Color:"rgb(200,10,10)",},
                    { Name:`开`, Text:`${kItem.Open.toFixed(2)}`, Color:"rgb(0,200,10)", LeftSpace:2 },
                    { Name:"标题1", Text:"1xxxxx", Color:"rgb(100,200,10)", LeftSpace:2},
                    { Name:"标题2", Text:"2xxxxx", Color:"rgb(200,200,10)", LeftSpace:2},
                    { Name:"标题3", Text:"3xxxxx", Color:"rgb(100,70,80)", LeftSpace:2},
                ]
            });

        //textData.data.push(`价格:${kItem.Close.toFixed(2)}`);
    }


    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[ titleData, closeData] },

        //error: { message:"无权限查看指标“测试指标1”" }
    };

    console.log('[HQData.APIIndex_TITLE] apiData ', apiData);
    callback(apiData);
}

HQData.APIIndex_SCATTER_PLOT_V2=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();

    var pointData=
    { 
        name:"SCATTER_PLOT_V2", type:1, 
        Draw:
        { 
            Name:"SCATTER_PLOT_V2",
            DrawType:"SCATTER_PLOT_V2",
            DrawData:[],
            Config:{  Color:"rgb(100,100,0)", Radius:5 },
        },
    };

    for(var i=0;i<kData.Data.length;++i)
    {
        var kItem=kData.Data[i];
        
        var item={ Date:kItem.Date, Time:kItem.Time, Value:kItem.High, Color:"rgb(0,0,0)", IsEmpty:true };
        if (kItem.Close>kItem.Open) 
        {
            item.ColorBorder="rgb(0,250,0)";
            item.Text={ Text:`${kItem.High.toFixed(2)}`, Color:"rgb(250,250,250)", BaseLine:1, YOffset:8, Align:2, BG:{ Color:"rgb(255,140,0)", MarginLeft:5, MarginRight:5, YOffset:5, MarginTop:8, MarginBottom:1 }};
        }
        else  
        {
            item.ColorBorder="rgb(250,0,0)";
            item.Text=
            { 
                Text:`${kItem.High.toFixed(2)}`, Color:"rgb(178,34,34)", BaseLine:2, YOffset:10, Align:2,
                //BG:{ Color:"rgb(255,255,0)" }
            };
        }


        item.Tooltip=
        [
            {Title:"日期", Text:`${kItem.Date}`},
            {Title:"最高", Text:`${kItem.High.toFixed(2)}`, TextColor:"rgb(250,0,0)"},
            {Title:"最低", Text:`${kItem.Low.toFixed(2)}`,TextColor:"rgb(0,255,0)" },
        ]
        pointData.Draw.DrawData.push(item);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[ pointData] },

        //error: { message:"无权限查看指标“测试指标1”" }
    };

    console.log('[HQData.APIIndex_SCATTER_PLOT_V2] apiData ', apiData);
    callback(apiData);
}

HQData.APIIndex_KLINE_TABLE=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=data.HQChart.GetKData(); //hqchart图形的分钟数据

    var tableData= 
    { 
        name:'KLINE_TABLE', type:1, 
        Draw: 
        { 
            DrawType:'KLINE_TABLE', 
            DrawData:[ ] ,                                      //数据  [ [ { Text, Color: BGColor }, ...... ], [],]
            RowCount:4,
            RowName:[ {Name:"账户1",TextAlign:"center"}, {Name:"账户2",TextAlign:"center"}, {Name:"账户3",TextAlign:"center"},{Name:"账户4", TextAlign:"center"}],

            Config:
            {
                BGColor:"rgb(0,0,0)",
                BorderColor:"rgb(220,220,220)",
                TextColor:"rgb(250,250,250)",
                ItemMergin:{ Left:2, Right:2, Top:4, Bottom:4, YOffset:3 },
                RowNamePosition:3,
                TextFont:{ Family:'微软雅黑' , FontMaxSize:14*GetDevicePixelRatio(), },
                RowHeightType:1,
            }
        },
        
    };

    var ACCOUNT_TEST_DATA=
    [
        { Name:"账户1", DayCount:5, OperatorID:0 },
        { Name:"账户2", DayCount:10, OperatorID:0 },
        { Name:"账户3", DayCount:4, OperatorID:0 },
        { Name:"账户4", DayCount:8, OperatorID:0 },
    ]
    
    for(var i=0;i<kData.Data.length;++i)   
    {
        var kItem=kData.Data[i];

        //一列数据
        var colItem={ Date:kItem.Date, Time:kItem.Time, Data:[ ] };

        for(var j=0;j<ACCOUNT_TEST_DATA.length;++j)
        {
            var accountItem=ACCOUNT_TEST_DATA[j];
            if (i%accountItem.DayCount==0)
            {
                accountItem.OperatorID++;
                if (accountItem.OperatorID>=3) accountItem.OperatorID=0;

                if (accountItem.OperatorID==1)
                {
                    colItem.Data[j]= 
                    {
                        Text:"买", Color:"rgb(250,250,250)", BGColor:'rgb(250,0,0)', TextAlign:"center",
                        Tooltip:
                        {
                            AryText:
                            [
                                {Title:"日期", Text:`${kItem.Date}`},
                                {Title:"买入价", Text:`${kItem.Close.toFixed(2)}`, TextColor:"rgb(250,0,0)"},
                                {Title:"数量", Text:`${HQData.GetRandomTestData(100,400).toFixed(0)}`,TextColor:"rgb(255,165,0)" },
                            ]
                        }
                    };
                }
                else if (accountItem.OperatorID==2)
                {
                    colItem.Data[j]= 
                    {
                        Text:"卖", Color:"rgb(250,250,250)", BGColor:'rgb(34,139,34)', TextAlign:"center",
                        Tooltip:
                        {
                            AryText:
                            [
                                {Title:"日期", Text:`${kItem.Date}`},
                                {Title:"卖入价", Text:`${kItem.Close.toFixed(2)}`, TextColor:"rgb(34,139,34)"},
                                {Title:"数量", Text:`${HQData.GetRandomTestData(100,400).toFixed(0)}`,TextColor:"rgb(255,165,0)" },
                            ]
                        }
                    };
                }
                    
            }
            else
            {
                if (accountItem.OperatorID==0) continue;    //空闲

                if (accountItem.OperatorID==1)
                    colItem.Data[j]= {Text:"持", Color:"rgb(250,250,250)", BGColor:'rgb(255,140,0)',TextAlign:"center"};
            }
        }

        tableData.Draw.DrawData.push(colItem);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[tableData] } 
    };

    console.log('[KLineChart::APIIndex_KLINE_TABLE] apiData ', apiData);
    callback(apiData);
}


HQData.APIIndex_DRAWSVG=function(data, callback)
{
    data.PreventDefault=true;
    var hqchart=data.HQChart;
    var kData=hqchart.GetKData();
    var kCount=kData.Data.length;

    var SVGData= 
    { 
        name:'买卖图标', type:1, 
        Draw: 
        { 
            DrawType:'DRAWSVG', 
            Family:'iconfont', 
            TextFont:`${12*GetDevicePixelRatio()}px 微软雅黑`,
            EnableClick:true,
            EnalbeDetailNoOverlap:true,
            Data: 
            [
                /*
                { Date:kData.Data[kCount-30].Date, Value:15.5, Text:'15.5' , Guid:"jj_1"},
                */
            ],
            
            /*
            BuildKeyCallback:(item)=>
            {
                return `${item.Date}`;
            }
            */
        } //绘制文字
    };

    var TEST_ICON_COLOR=["rgb(240,0,0)", "rgb(240,100,30)", "rgb(138,43, 226)", "rgb(151,255,255)", "rgb(255, 20, 147)"];

    var count=1;
    for(var i=0 ;i<kCount;++i)
    {
        var item=kData.Data[i];
        if (i%10!=3) continue;
        count++;

        var text=`提示信息:<br>日期:${IFrameSplitOperator.FormatDateString(item.Date)}<br>信息描述:太极（Tai Chi），即是阐明宇宙从无极而太极，以至万物化生的过程。`;
        if (IFrameSplitOperator.IsNumber(item.Time)) text=`提示信息:<br>日期:${IFrameSplitOperator.FormatDateString(item.Date)}<br>时间:${item.Time}`;
       
        var colorIndex=Math.ceil(Math.random()*10) % (TEST_ICON_COLOR.length-1);

        var drawItem=
        { 
            Date:item.Date, Time:item.Time, Value:"H", ID:count,
            Text:{Content:`${count}`, Color:"rgb(0,0,0)", YOffset:-14},
            SVG: { Symbol:"\ue6a7", Color:TEST_ICON_COLOR[colorIndex], Size:32*GetDevicePixelRatio(),YOffset:-5 },
            Tooltip:
            { 
                Text:text,
                Ver:2.0,
                AryText:
                [
                    { Text:"提示信息", TextColor:"rgb(255,215,0)"},
                    { Text:`ID:${count}`, TextColor:"rgb(255,215,0)"},
                    { Title:"日期", Text:`${IFrameSplitOperator.FormatDateString(item.Date)}`},
                    { Title:"信息描述", Text:`太极生两仪，两仪生四象!!!`, TextColor:"rgb(255,0,255)"}
                ]
            },
            Line: { Color:"rgb(255,0,255)", Dash:[5,5], Value:"C", Width:1, SVGBlank:4 },

            Detail:
            { 
                Content:
                [ 
                    {Text:"买:11.99", Color:"rgb(255,100,100)" }, 
                    {Text:"涨幅:90.0%", Color:"rgb(230,230,0)"}
                ] ,
                Font:`${12*GetDevicePixelRatio()}px 微软雅黑`,
                ItemSpace:3, 
                YOffset:-5, 
                XOffset:2,
                BGColor:"rgba(0, 0, 0, 0.8)", 
                BorderColor:"rgb(255, 185, 15)" ,
                LeftMargin:3,
                RightMargin:4
            },
        };

        if (count%20==1) drawItem.Value="Top";

        SVGData.Draw.Data.push(drawItem);
    }

    var apiData=
    {
        code:0, 
        stock:{ name:hqchart.Name, symbol:hqchart.Symbol }, 
        outdata: { date:kData.GetDate(), time:kData.GetTime(), outvar:[SVGData] } 
    };

    console.log('[HQData.APIIndex_DRAWSVG] apiData ', apiData);
    callback(apiData);
}


HQData.RequestVolumeProfileData=function(data, callback)
{
    var request=data.Request;
    var startIndex=request.Start.DataIndex;
    var endIndex=request.End.DataIndex;

    var hqchart=data.Self;
    var kData=hqchart.GetKData();

    var maxPrice=null,minPrice=null;
    for(var i=startIndex;i<=endIndex && i<kData.Data.length; ++i)
    {
        var kItem=kData.Data[i];
        if (!kItem) continue;
        
        if (maxPrice==null || maxPrice<kItem.High) maxPrice=kItem.High;
        if (minPrice==null || minPrice>kItem.Low) minPrice=kItem.Low;
    }

    var aryData=[];
    var step=0.1;
    for(var i=minPrice, j=0;i<=maxPrice; i+=step, ++j)
    {
        var item=
        {
            Price:i, 
            Vol:
            [
                {
                    Value:HQData.GetRandomTestData(0,500)*1000, 
                    //Color:"rgba(103,179,238,0.8)",
                    ColorID:0,
                }, 
                {
                    Value:HQData.GetRandomTestData(0,500)*1000, 
                    //Color:"rgba(237,208,105,0.8)",
                    ColorID:1,
                }
            ]
        };

        item.TotalVol={ Value:item.Vol[0].Value+ item.Vol[1].Value, ColorID:0 };

        if (j>5)
        {
            item.Vol[0].ColorID=2;
            item.Vol[1].ColorID=3;
            item.TotalVol.ColorID=2;
        }

        aryData.push(item);
    }

    var hqchartData={ Data:aryData, MaxPrice:maxPrice, MinPrice:minPrice, PriceOffset:step, code:0 };

    console.log('[HQData.RequestVolumeProfileData] hqchartData=', hqchartData);

    callback(hqchartData);
}


