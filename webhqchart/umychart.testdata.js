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
            HQData.RequestMinuteData(data, callback);
            break;
        
        case "MinuteChartContainer::RequestHistoryMinuteData":          //多日分时图
            //HQChart使用教程29-走势图如何对接第3方数据3-多日分时数据
            HQData.RequestMinuteDaysData(data, callback);
            break;

        case "MinuteChartContainer::RequestPopMinuteData":          //弹出分时图数据
            //HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据  格式跟这个一样
            HQData.RequestPopMinuteData(data, callback);
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

HQData.RequestMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::RequestMinuteData] Symbol=${symbol}`);

    setTimeout(()=>{
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
    }, 50);
}

HQData.RequestPopMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0];             //请求的股票代码
    var date=data.Request.Data.date;
    var callcation=data.Request.Data.callcation;        //集合竞价
    console.log(`[HQData::RequestPopMinuteData] Symbol=${symbol} Date=${date}`);

    setTimeout(()=>{
        var srcStock=MINUTE_1DAY_DATA.stock[0];
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

HQData.RequestRealtimeData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol[0]; //请求的股票代码

    if (data.Request.Data.symbol.length>1)  //叠加股票
    {
        var hqchartData={ stock:[], code:0 };
        var arySymbol=data.Request.Data.symbol;
        for(var i=0;i<arySymbol.length;++i)
        {
            var symbol=arySymbol[i];
            if (i==0)
            {
                var stock=KLINE_1DAY_DATA.stock[0];
                stock.name=symbol;
                stock.symbol=symbol;
                hqchartData.stock.push(stock);
            }
            else
            {
                if (symbol=="399001.sz") 
                {
                    var stock=KLINE_1DAY_OVERLAY_DATA2.stock[0];
                    stock.name=symbol;
                    stock.symbol=symbol;
                    hqchartData.stock.push(stock);
                }
                else
                {
                    var stock=KLINE_1DAY_OVERLAY_DATA.stock[0];
                    stock.name=symbol;
                    stock.symbol=symbol;
                    hqchartData.stock.push(stock);
                }
                    
            } 
        }

        callback(hqchartData);
    }
    else
    {
        console.log(`[HQData::RequestRealtimeData] Symbol=${symbol}`);
        var hqchartData=KLINE_1DAY_DATA;
        hqchartData.stock[0].name=symbol;
        hqchartData.stock[0].symbol=symbol;
        callback(hqchartData);
    }
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

    if (data.Request.Data.symbol.length>1)  //叠加股票
    {
        var hqchartData=JSON.parse(JSON.stringify(KLINE_1MINUTE_DATA));
        hqchartData.overlay=[]; //叠加数据
        var arySymbol=data.Request.Data.symbol;
        for(var i=0;i<arySymbol.length;++i)
        {
            var symbol=arySymbol[i];
            if (i==0)
            {
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
            }
            else
            {
                var testData=JSON.parse(JSON.stringify(KLINE_1MINUTE_DATA2));
                var kItem=testData.data[0];
                var price=kItem[5];
                var value=Math.ceil(Math.random()*10)/1000*price;
                var bUp=Math.ceil(Math.random()*10)>=5;
                
                if (bUp) price+=value;
                else price-=value;
                kItem[5]=price;
                kItem[3]=Math.max(price, kItem[3]);
                kItem[4]=Math.min(price, kItem[4]);
                var stock={ data:testData.data, symbol:symbol, name:symbol };
                hqchartData.overlay.push(stock);
            }
        }

        callback(hqchartData);
    }
    else
    {
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

HQData.RequestOverlayHistoryData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var hqchartData={  symbol: symbol,name: symbol };
    if (symbol=="399001.sz") 
        hqchartData.data=KLINE_DAY_OVERLAY_DATA2.data
    else 
        hqchartData.data=KLINE_DAY_OVERLAY_DATA.data
        
    callback(hqchartData);
}

HQData.RequestOverlayHistoryMinuteData=function(data, callback)
{
    data.PreventDefault=true;
    var symbol=data.Request.Data.symbol;
    var hqchartData={  symbol: symbol,name: symbol };
    hqchartData.data=KLINE_MINUTE_DATA2.data;

    callback(hqchartData);
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

            hqchartData.data.push([symbol,name]);
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
        var symbolItem={ Symbol:item[0], Name:item[1], ShortSymbol:shortSymbol, Spell:item[3], Type:item[2] };
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

    callback(arySymbol);
}


