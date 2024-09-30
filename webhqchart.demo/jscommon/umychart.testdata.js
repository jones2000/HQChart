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
    }
}

HQData.Minute_RequestMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::RequestMinuteData] Symbol=${symbol}`);

    setTimeout(()=>{
        var fullData=HQData.GetDayMinuteDataBySymbol(symbol);
        var srcStock=fullData[0];
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


HQData.Minute_RequestHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;                //请求的股票代码
    var dayCount=data.Request.Data.daycount;
    var callcation=data.Request.Data.callcation;        //集合竞价
  
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
   
    var hqchartData={code:0, data:aryDay, name:symbol, symbol: symbol};

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

    arySymbol.push( { Symbol:"01", Name:"分时成交明细", TypeName:"功能键", Priority:1, Color:"rgb(220,20,60)" , Data:{ PageName:"分时成交明细", Type:2 }} );
    arySymbol.push( { Symbol:"02", Name:"分价表", TypeName:"功能键", Priority:1, Color:"rgb(220,20,60)" ,Data:{ PageName:"分价表", Type:2 }} );
    arySymbol.push( { Symbol:"06", Name:"自选股", TypeName:"功能键", Priority:1 , Color:"rgb(220,20,60)", Data:{ PageName:"自选股", Type:2 }} );

    arySymbol.push( { Symbol:"MACD", Name:"平滑异同平均线", TypeName:"指标", Priority:2 , Color:"rgb(0,0,255)", Data:{ Index:"MACD", Type:1 }} );
    arySymbol.push( { Symbol:"RSI", Name:"相对强弱指标", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)",Data:{ Index:"RSI", Type:1 }}  );
    arySymbol.push( { Symbol:"MA", Name:"均线", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"MA", Type:1 } } );
    arySymbol.push( { Symbol:"BOLL", Name:"布林线", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"BOLL", Type:1 } } );
    arySymbol.push( { Symbol:"KDJ", Name:"随机指标", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"KDJ", Type:1 } } );
    arySymbol.push( { Symbol:"SKDJ", Name:"慢速随机指标", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"SKDJ", Type:1 } } );
    arySymbol.push( { Symbol:"KD", Name:"随机指标KD", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"KD", Type:1 } } );
    arySymbol.push( { Symbol:"MARSI", Name:"相对强弱平均线", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"MARSI", Type:1 } } );
    arySymbol.push( { Symbol:"VMACD", Name:"量平滑异同平均", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"VMACD", Type:1 } } );
    arySymbol.push( { Symbol:"AMO", Name:"成交金额", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"AMO", Type:1 } } );
    arySymbol.push( { Symbol:"SQJZ", Name:"神奇九转", TypeName:"指标", Priority:2, Color:"rgb(0,0,255)" ,Data:{ Index:"SQJZ", Type:1 } } );
    
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

HQData.GetDayMinuteDataBySymbol=function(symbol)
{
    var data=null;
    switch(symbol)
    {
        case "000001.sz":
            data=SZ_000001_1DAY_MINUTE;
            break;
        case "600000.sh":
            data=SH_600000_1DAY_MINUTE;
            break;
        case "000151.sz":
            data=SZ_000151_1DAY_MINUTE;
            break;
        default:
            data=SZ_000151_1DAY_MINUTE;
            break;
    }

    if (!data) return null;

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

    /*
    var aryDay=[];
    for(var i=0;i<data.data.length;++i)
    {
        var dayItem=data.data[i];
        
        var newDayItem={ minute:[],  date:dayItem.date, close:dayItem.close, yclose:dayItem.yclose };
        for(var j=0;j<dayItem.minute.length;++j)
        {
            var item=dayItem.minute[j];
            newDayItem.minute[j]=item.slice(0,7);
        }


        aryDay.push(newDayItem);
    }
    data.data=aryDay;
    */


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


