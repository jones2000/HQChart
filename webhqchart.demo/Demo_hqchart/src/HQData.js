

function HQChartWSClient()
{
    this.TargetExtensionID=EnvironmentVariable.TargetExtensionID;   //"ephokbeacgjbmodlebliolkjnmcddojn";
    this.ClientName=EnvironmentVariable.ClientName;                 //"HQChartWSClient_1";
    this.Port=null;
    this.MapCallback=new Map(); //key=id

    this.Create=function()
    {
        try
        {
            this.Port=chrome.runtime.connect(this.TargetExtensionID, { name:this.ClientName });
            this.Port.onMessage.addListener((msg)=>
            {
            this.OnRecvMessage(msg)
            });
        }
        catch(error)
        {

        }
    }

    this.OnRecvMessage=function(msg)
    {
        console.log("[HQChartWSClient::OnRecvMessage] 收到消息:", msg);
        if (!msg || !msg.Data || !msg.Data.ExtendData) return;

        var id=msg.Data.ID;
        if (!this.MapCallback.has(id)) return;

        var callbackInfo=this.MapCallback.get(id);
        if (callbackInfo.ExtendID!=msg.Data.ExtendData.ExtendID) return;   //扩展ID不匹配
        this.MapCallback.delete(id);

        callbackInfo.Callback(msg.Data);   
    }

    this.SendMessage=function(msg, callback)
    {
        if (!this.Port) return false;
    }

    this.Subscribe=function(msg, callbackInfo)
    {
        if (!this.Port) return false;

        this.MapCallback.set(callbackInfo.ID, callbackInfo);    //保存数据接收回调

        this.Port.postMessage(msg);
    }

    //单次请求
    this.Request=function(msg, callbackInfo)
    {
        if (!this.Port) return false;

        this.MapCallback.set(callbackInfo.ID, callbackInfo);    //保存数据接收回调

        this.Port.postMessage(msg);
    }
}


class HQData
{ 
    WSClient=null;
    ID=Guid();

    RequestStockData_ID=`${this.ID}-RequestStockData`;

    RequestMinuteData_ID=`${this.ID}-RequestMinuteData`;

    RequestKLineData_ID=`${this.ID}-Request-KLineData`;
    RequestKLineRealtimeData_ID=`${this.ID}-Request-KLineData`;

    RequestKLineMinuteData_ID=`${this.ID}-Request-KLineData`;
    RequestKLineMinuteRealtimeData_ID=`${this.ID}-Request-KLineData`;
    RequestKLineFlowCapitalData_ID=`${this.ID}-FlowCapitalData`;

    RequestDealData_ID=`$${this.ID}-Request-DealData`;

    RequestStockInfoData_ID=`${this.ID}-RequestStockInfoData`

    Counter=1;

    MapSelfBlcok = new Map();  //自选股数据缓存

    SetSelfBlock(blockSymbol, arySymbol)
    {
        this.MapSelfBlcok.set(blockSymbol, {Symbol:blockSymbol, ArySymbol:arySymbol} );
    }

    NetworkFilter(data, callback, option)
    {
         console.log(`[HQData::NetworkFilter] ${data.Name} - ${data.Explain}`);

        switch(data.Name) 
        {
            //////////////////////////////////////////////////////
            //报价列表数据
            case "JSReportChartContainer::RequestStockListData":
                //HQChart使用教程95-报价列表对接第3方数据1-码表数据
                this.Report_RequestStockListData_Empty(data, callback, option);             //码表
                break;
            case "JSReportChartContainer::RequestMemberListData":                           //板块成分
                //HQChart使用教程95-报价列表对接第3方数据2-板块成分数据
                this.Report_RequestMemberListDat(data, callback, option);
                break;
            case "JSDealChartContainer::RequestStockData":                  //股票数据更新
                //HQChart使用教程95-报价列表对接第3方数据3-股票数据
                this.Report_RequestStockData(data, callback, option);
                break;
            case "MinuteChartContainer::RequestPopMinuteData":          //弹出分时图数据
                //HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据  格式跟这个一样
                this.Report_RequestPopMinuteData(data, callback, option);
                break;

            /////////////////////////////////////////////////////////////////////
            //走势图 HQChart使用教程29-走势图如何对接第3方数据1
            case 'MinuteChartContainer::RequestMinuteData':                 //分时图数据对接
                //HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据
                this.Minute_RequestMinuteData(data, callback, option);
                break;
            case "MinuteChartContainer::RequestOverlayMinuteData":          //单日叠加
                //HQChart使用教程29-走势图如何对接第3方数据7-叠加股票最新分时数据
                this.Minute_RequestOverlayMinuteData(data, callback, option);
                break;


            /////////////////////////////////////////////////////////////
            //K线图
            case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
                //HQChart使用教程30-K线图如何对接第3方数据2-日K数据
                this.KLine_RequestHistoryData(data, callback, option);
                break;

            case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
                //HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据
                this.KLine_RequestRealtimeData(data,callback,option);
                break;

            case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
                //HQChart使用教程30-K线图如何对接第3方数据3-1分钟K数据
                this.KLine_RequestHistoryMinuteData(data, callback,option);
                break;

            case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
                //HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据
                this.KLine_RequestMinuteRealtimeData(data,callback, option);
                break;

            case "KLineChartContainer::RequestOverlayHistoryData":      //叠加股票日线
                //HQChart使用教程30-K线图如何对接第3方数据16-日K叠加股票
                this.KLine_RequestOverlayHistoryData(data, callback, option);
                break;

            case "KLineChartContainer::RequestOverlayHistoryMinuteData":
                //HQChart使用教程30-K线图如何对接第3方数据17- 分钟K叠加股票
                this.KLine_RequestOverlayHistoryMinuteData(data, callback, option);
                break;

            case 'KLineChartContainer::RequestFlowCapitalData':             //流通股本
                //HQChart使用教程30-K线图如何对接第3方数据4-流通股本数据
                this.KLine_RequestFlowCapitalData(data,callback,option);
                break;

            case "JSSymbolData::GetIndexData":
                //HQChart使用教程30-K线图如何对接第3方数据28-大盘数据[INDEXA,INDEXC......]
                this.KLine_INDEX_RequestData(data, callback, option);
                break;
            case "JSSymbolData::GetLatestData":
                //HQChart使用教程30-K线图如何对接第3方数据30-即时行情数据DYNAINFO
                this.KLine_RequestLatestData(data, callback, option);
                break;

            case "JSSymbolData::GetOtherSymbolData":
                //HQChart使用教程30-K线图如何对接第3方数据31-获取指定品种的K线数据
                this.KLine_RequestOtherSymbolData(data, callback, option);
                break;
            case 'JSSymbolData::GetSymbolData':   
                //HQChart使用教程30-K线图如何对接第3方数据38-通达信指标K线数据
                this.KLine_RequestSymbolData(data, callback, option);        //计算指标需要的K线数据
                break;

            case "JSSymbolData::GetVariantData":                            //额外的变量数据
                //HQChart使用教程30-K线图如何对接第3方数据29-板块字符串函数数据[GNBLOCK,GNBLOCKNUM......]
                this.KLine_RequestVariantData(data, callback, option);
                break;
            case "JSSymbolData::GetFinance":    //财务数据
                //HQChart使用教程30-K线图如何对接第3方数据23- FINANCE函数数据
                this.KLine_RequestFinanceData(data, callback, option);
                break;

            /////////////////////////////////////////////////////////////////////////////////////
            //成交明细
            case 'JSDealChartContainer::RequestDealData':               //全量数据下载
                this.Deal_RequestHistoryData(data, callback, option);
                break;
            case "JSDealChartContainer::RequestDealUpdateData":
                this.Deal_RequestUpdateData(data, callback, option);
                break;

            ////////////////////////////////////////////////////////////////////////////
            //
            case  "JSStockInfoChartContainer::RequestStockData":
                this.StockInfo_RequestStockData(data, callback, option);
                break;


        }
    }

    //空码表
    Report_RequestStockListData_Empty(data, callback, option)          
    {
        data.PreventDefault=true;
        var hqchartData={ data:[] };
        console.log("[HQData.Report_RequestStockListData_EMPTY] hqchartData",hqchartData);
        callback(hqchartData);
    }

    //板块|行业等成分列表
    Report_RequestMemberListDat(data, callback, option)
    {
        var symbol=data.Request.Data.symbol;    //板块代码
        data.PreventDefault=true;

        var hqchartData= { symbol:symbol , name:symbol, data:[] , code:0 };
        if (this.MapSelfBlcok.has(symbol))
        {
            var item=this.MapSelfBlcok.get(symbol);
            hqchartData.data=item.ArySymbol.slice();
        }

        callback(hqchartData);
    }

    Report_RequestStockData(data, callback, option)
    {
        var aryStock=data.Request.Data.stocks;    //股票列表
        data.PreventDefault=true;

        var bMinuteLine=false, kLineConfig=null;
        var reportCtrl=data.Self;
        var reportChart=reportCtrl.GetReportChart();
        if (reportChart && IFrameSplitOperator.IsNonEmptyArray(reportChart.Column))
        {
            for(var i=0;i<reportChart.Column.length;++i)
            {
                var item=reportChart.Column[i];
                if (item.Type==REPORT_COLUMN_ID.CLOSE_LINE_ID)   //收盘线
                    bMinuteLine=true;
                else if (item.Type==REPORT_COLUMN_ID.KLINE_ID) //K线
                    kLineConfig={ Period:0, Right:0, Count:20 };
            }
        }

        if (option) option.Report=data.Self;

        var arySymbol=[];
        for (var i=0; i<aryStock.length; ++i)
        {
            arySymbol.push({ Symbol:aryStock[i].Symbol, Fields:{ MinuteClose:bMinuteLine, KLine:kLineConfig } } ); //MinuteClose=走势图线 KLine=k线图
        }

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:1,
                ID:this.RequestStockData_ID,
                ArySymbol:arySymbol,
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:this.RequestStockData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Report_RecvStockData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    Report_RecvStockData(recv, callback, option)
    {
        var hqchartData={ data:[], code:0 };
        var report=null;
        if (option && option.Report) report=option.Report;

        function __Temp_CheckPriceChange(symbol, price, filedName, colID)
        {
            if (!symbol || !IFrameSplitOperator.IsNumber(price)) return false;
            if (!report) return false;
            if (!report.MapStockData.has(symbol)) return false;
            var stockItem=report.MapStockData.get(symbol);
            var value=stockItem[filedName]
            if (!IFrameSplitOperator.IsNumber(value)) return false;
            if (price===value) return false;

            var flashData={ ID:colID, Color:null, Count:1 }; //4=最新价
            if (price>value) flashData.Color="rgba(205,92,92,0.4)";
            else flashData.Color="rgba(46,139,87,0.4)";   

            report.SetFlashBGItem(symbol, flashData);
        }

        if (IFrameSplitOperator.IsNonEmptyArray(recv.AryData))
        {
            for(var i=0;i<recv.AryData.length;++i)
            {
                var stockItem=recv.AryData[i];
                var item=[];
                item[0]=stockItem.Symbol;

                item[1]=stockItem.Name;               //名称
                item[2]=stockItem.YClose;             //昨收
                item[3]=stockItem.Open;               //今开
                item[4]=stockItem.High;               //最高
                item[5]=stockItem.Low;                //最低
                item[6]=stockItem.Close;              //最新价
                item[7]=stockItem.Vol;                //成交量
                item[8]=stockItem.Amount;             //成交额
                item[9]=stockItem.BidPrice;           //买一价
                item[11]=stockItem.AskPrice;          //卖一价
                item[35]=stockItem.Time;               //时间
                item[36]=stockItem.Date;               //日期

                item[21]=stockItem.Increase;           //涨幅%
                item[22]=stockItem.UpDown;             //涨跌
                item[24]=stockItem.Amplitude;          //振幅%

                item[38]=stockItem.Position;           //持仓量
                item[39]=stockItem.FClose;             //结算价
                item[40]=stockItem.YFClose;            //昨结算价

                __Temp_CheckPriceChange(stockItem.Symbol, stockItem.Close, "Price", REPORT_COLUMN_ID.PRICE_ID);
                __Temp_CheckPriceChange(stockItem.Symbol, stockItem.BidPrice, "BuyPrice", REPORT_COLUMN_ID.BUY_PRICE_ID);
                __Temp_CheckPriceChange(stockItem.Symbol, stockItem.AskPrice, "SellPrice", REPORT_COLUMN_ID.SELL_PRICE_ID);

                if (stockItem.Minute)   //分时图
                {
                    var minData=stockItem.Minute;
                    var newData={ Data:minData.AryClose, Max:null, Min:null, Count:Math.max(242,minData.AryClose.length), YClose:minData.YClose };
                    for(var j=0;j<newData.Data.length;++j)
                    {
                        var value=newData.Data[j];
                        if (newData.Max==null || newData.Max<value) newData.Max=value;
                        if (newData.Min==null || newData.Min>value) newData.Min=value;
                    }

                    item[32]=newData;
                }

                if (stockItem.KLine) //K线图
                {
                    var kData=stockItem.KLine;
                    var newData={ AryData:[] };
                    for(var j=0;j<kData.Data.length;++j)
                    {
                        var kItem=kData.Data[j];
                        newData.AryData.push( [ kItem.Open, kItem.High, kItem.Low, kItem.Close] );
                    }
                    item[33]=newData;
                }
                

                hqchartData.data.push(item);
            }
        }

        callback(hqchartData);
    }

    Report_RequestPopMinuteData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];             //请求的股票代码
        var date=data.Request.Data.date;

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:3,
                ID:this.RequestMinuteData_ID,
                ArySymbol:[{Symbol:symbol} ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:this.RequestMinuteData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Minute_RecvMinuteData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    //单日分时图
    Minute_RequestMinuteData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];             //请求的股票代码
        console.log(`[HQData::Minute_RequestMinuteData] Symbol=${symbol}, Update=${data.Self.DataStatus.LatestDay}`);

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:3,
                ID:this.RequestMinuteData_ID,
                ArySymbol:[{Symbol:symbol} ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:this.RequestMinuteData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Minute_RecvMinuteData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    Minute_RecvMinuteData(recv, callback, option)
    {
        var hqchartData={ code:0, stock:[] };
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryMinute=item.Data;
                var stockItem={ date:item.Date, minute:[], yclose:item.YClose, symbol:item.Symbol, name:item.Name };
                for(var j=0;j<aryMinute.length;++j)
                {
                    var subItem=aryMinute[j];
                    var minItem=
                    {
                        date:subItem.Date,
                        time:subItem.Time,
                        price:subItem.Price,
                        avprice:subItem.AvPrice,
                        open:subItem.Price,
                        low:subItem.Price,
                        high:subItem.Price,
                        vol:subItem.Vol,
                        amount:subItem.Amount
                    };

                    stockItem.minute.push(minItem);
                }

                hqchartData.stock.push(stockItem);
            }
        }

        callback(hqchartData);
    }

    //单日分时图叠加
    Minute_RequestOverlayMinuteData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var date=data.Request.Data.days[0];

        if (option) 
        {
            option.HQChart=data.Self;
            option.Symbol=symbol;
            option.Date=date;
        }

        var extendID=this.Counter++;

        var requestID=`${this.ID}-${extendID}`;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:3,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol, Date:date } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Minute_RecvOverlayMinuteData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    Minute_RecvOverlayMinuteData(recv, callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=option.Symbol;
        var hqchartData={ code:0,  symbol:symbol, name:symbol, data:[] };
        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryMinute=item.Data;
                var stockItem={ date:item.Date, minute:[], yclose:item.YClose, symbol:item.Symbol, name:item.Name };
                for(var j=0;j<aryMinute.length;++j)
                {
                    var subItem=aryMinute[j];
                    var minItem=[];
                    minItem[0]=subItem.Time;
                    minItem[1]=subItem.Price;
                    minItem[2]=subItem.Price;
                    minItem[3]=subItem.Price;
                    minItem[4]=subItem.Price;
                    minItem[5]=subItem.Vol;
                    minItem[6]=subItem.Amount;
                    minItem[7]=subItem.AvPrice;
                    minItem[8]=subItem.Date;

                    stockItem.minute.push(minItem);
                }

                hqchartData.data.push(stockItem);
            }
        }

        callback(hqchartData);
    }



    KLine_RequestHistoryData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;    //请求的股票代码
        var right=data.Request.Data.right;     //复权
        var period=data.Request.Data.period;    //周期
        console.log(`[HQData::KLine_RequestHistoryData] Symbol=${symbol}, Right=${right} Period=${period}`);

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:100,
                ID:this.RequestKLineData_ID,
                ArySymbol:[{ Symbol:symbol, Period:period, Right:right, Count:640 } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:this.RequestKLineData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvHistoryData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    KLine_RecvHistoryData(recv, callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;
        var hqchartData={ name:symbol, symbol:symbol, data:[], ver:2.0 };
        var bFlowCapital=false;
        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                if (item.FlowCapital===true) bFlowCapital=true;
                if (IFrameSplitOperator.IsNonEmptyArray(aryKLine))
                {
                    for(var j=0;j<aryKLine.length;++j)
                    {
                        var item=aryKLine[j];
                        var kItem=[];
                        kItem[0]=item.Date;
                        kItem[1]=item.YClose;
                        kItem[2]=item.Open;
                        kItem[3]=item.High;
                        kItem[4]=item.Low;
                        kItem[5]=item.Close;
                        kItem[6]=item.Vol;
                        kItem[7]=item.Amount;
                        if (bFlowCapital) kItem[15]=item.FlowCapital;
                        hqchartData.data.push(kItem);
                    }
                }
                
                break;
            }
        }

        if (hqchart && bFlowCapital) hqchart.FlowCapitalReady=true;

        callback(hqchartData);
    }

    KLine_RequestRealtimeData(data,callback,option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];    //请求的股票代码
        var right=data.Request.Data.right;      //复权
        var period=data.Request.Data.period;    //周期
        var dateRange=data.Request.Data.dateRange;
        console.log(`[HQData::KLine_RequestHistoryData] Symbol=${symbol}, Right=${right} Period=${period}`);

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:100,
                ID:this.RequestKLineRealtimeData_ID,
                ArySymbol:[{ Symbol:symbol, Period:period, Right:right, Count:3, DateRange:dateRange } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        //叠加股票数据
        for(var i=1;i<data.Request.Data.symbol.length;++i)
        {
            var symbol=data.Request.Data.symbol[i];
            msg.Data.ArySymbol.push({ Symbol:symbol, Period:period, Count:3});
        }

        var callbackInfo=
        {
            ID:this.RequestKLineRealtimeData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvRealtimeData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);

    }

    KLine_RecvRealtimeData(recv,callback,option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;
        var stockItem={ symbol:symbol, name:symbol, data:[] }
        var hqchartData={ stock:[stockItem], Ver:3.0 };

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) stockItem.name=item.Name;
                if (IFrameSplitOperator.IsNonEmptyArray(aryKLine))
                {
                    for(var j=0;j<aryKLine.length;++j)
                    {
                        var item=aryKLine[j];
                        var kItem=[];
                        kItem[0]=item.Date;
                        kItem[1]=item.YClose;
                        kItem[2]=item.Open;
                        kItem[3]=item.High;
                        kItem[4]=item.Low;
                        kItem[5]=item.Close;
                        kItem[6]=item.Vol;
                        kItem[7]=item.Amount;

                        stockItem.data.push(kItem);
                    }
                }
            }
            else
            {
                var aryKLine=item.Data;
                var overlayStock={ symbol:item.Symbol, name:item.Symbol, data:[] };
                if (item.Name) overlayStock.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;

                    overlayStock.data.push(kItem);
                }

                hqchartData.stock.push(overlayStock);
            }
        }

        callback(hqchartData);
    }


    KLine_RequestHistoryMinuteData(data, callback,option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;    //请求的股票代码
        var right=data.Request.Data.right;     //复权
        var period=data.Request.Data.period;    //周期
        console.log(`[HQData::KLine_RequestHistoryMinuteData] Symbol=${symbol}, Right=${right} Period=${period}`);

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:101,
                ID:this.RequestKLineMinuteData_ID,
                ArySymbol:[{ Symbol:symbol, Period:period, Right:right, Count:640 } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:this.RequestKLineMinuteData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvHistoryMinuteData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    KLine_RecvHistoryMinuteData(data, callback,option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;
        var hqchartData={ name:symbol, symbol:symbol, data:[], ver:2.0 };

        for(var i=0;i<data.AryData.length;++i)
        {
            var item=data.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;
                    kItem[8]=item.Time;

                    hqchartData.data.push(kItem);
                }
                break;
            }
        }

        //if (hqchart) hqchart.FlowCapitalReady=true;

        callback(hqchartData);
    }


    KLine_RequestMinuteRealtimeData(data,callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];    //请求的股票代码
        var right=data.Request.Data.right;     //复权
        var period=data.Request.Data.period;    //周期
        var dateRange=data.Request.Data.dateRange;
        console.log(`[HQData::KLine_RequestHistoryMinuteData] Symbol=${symbol}, Right=${right} Period=${period}`);

        if (option) option.HQChart=data.Self;

        var extendID=this.Counter++;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:101,
                ID:this.RequestKLineMinuteRealtimeData_ID,
                ArySymbol:[{ Symbol:symbol, Period:period, Right:right, Count:3, DateRange:dateRange } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        //叠加股票数据
        for(var i=1;i<data.Request.Data.symbol.length;++i)
        {
            var symbol=data.Request.Data.symbol[i];
            msg.Data.ArySymbol.push({ Symbol:symbol, Period:period, Count:3});
        }

        var callbackInfo=
        {
            ID:this.RequestKLineMinuteRealtimeData_ID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvMinuteRealtimeData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    KLine_RecvMinuteRealtimeData(recv,callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;
        var hqchartData={ name:symbol, symbol:symbol, data:[], ver:2.0 , overlay:[]};

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;
                    kItem[8]=item.Time;

                    hqchartData.data.push(kItem);
                }
            }
            else
            {
                var aryKLine=item.Data;
                var stockItem={ symbol:item.Symbol, name:item.Symbol, data:[] }
                if (item.Name) stockItem.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;
                    kItem[8]=item.Time;

                    stockItem.data.push(kItem);
                }

                hqchartData.overlay.push(stockItem);
            }
        }

        callback(hqchartData);
    }


    KLine_RequestOverlayHistoryData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var first=data.Request.Data.first;

        var symbol=data.Request.Data.symbol;    //请求的股票代码
        var period=data.Request.Data.period;    //周期
        console.log(`[HQData::KLine_RequestOverlayHistoryData] Symbol=${symbol}, Period=${period}`);

        if (option) 
        {
            option.HQChart=data.Self;
            option.Symbol=symbol;
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:100,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol, Period:period, Count:640 } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvOverlayHistoryData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    KLine_RecvOverlayHistoryData(recv, callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=option.Symbol;
        var hqchartData={ name:symbol, symbol:symbol, data:[] };

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;

                    hqchartData.data.push(kItem);
                }
                break;
            }
        }

        callback(hqchartData);
    }


    KLine_RequestOverlayHistoryMinuteData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var first=data.Request.Data.first;

        var symbol=data.Request.Data.symbol;    //请求的股票代码
        var period=data.Request.Data.period;    //周期
        console.log(`[HQData::KLine_RequestOverlayHistoryMinuteData] Symbol=${symbol}, Period=${period}`);

        if (option) 
        {
            option.HQChart=data.Self;
            option.Symbol=symbol;
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:101,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol, Period:period, Count:640 } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvOverlayHistoryMinuteData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    KLine_RecvOverlayHistoryMinuteData(recv, callback, option)
    {
        var symbol=option.Symbol;
        var hqchartData={  symbol: symbol,name: symbol, ver:2.0, data:[] };

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;
                    kItem[8]=item.Time;

                    hqchartData.data.push(kItem);
                }
                break;
            }
        }

        callback(hqchartData);
    }


    KLine_RequestFlowCapitalData(data,callback,option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];

        if (option) 
        {
            option.HQChart=data.Self;
            option.Symbol=symbol;
        }

        var extendID=this.Counter++;
        var requestID=this.RequestKLineFlowCapitalData_ID;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:200,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol } ],
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvFlowCapitalData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    KLine_RecvFlowCapitalData(recv, callback, option)
    {
        var hqchartData={ stock:[ ], code:0 };
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;

        var symbol=hqchart.Symbol;
        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var stockItem={ stockday:[], symbol:symbol };
                if (IFrameSplitOperator.IsNonEmptyArray(item.Data))
                {
                    for(var j=0;j<item.Data.length;++j)
                    {
                        var subItem=item.Data[j];
                        if (!IFrameSplitOperator.IsNumber(subItem.ListA) || subItem.ListA<=0) continue;
                        var newItem={ date:subItem.Date, capital: { a: subItem.ListA }};
                        stockItem.stockday.push(newItem);
                    }
                }

                hqchartData.stock.push(stockItem);
                break;
            }
        }

        callback(hqchartData);
    }


    KLine_INDEX_RequestData(data,callback, option)
    {
        data.PreventDefault=true;
        var period=data.Period;
        var symbol=data.Request.Data.symbol;
        var indexSymbol="000001.sh";
        if (MARKET_SUFFIX_NAME.IsSHSZStockA(symbol))
        {
            if (MARKET_SUFFIX_NAME.IsSH(symbol)) indexSymbol="000001.sh";
            else if (MARKET_SUFFIX_NAME.IsSZ(symbol)) indexSymbol="399001.sz";
        }
        var dateRange=data.Request.Data.dateRange;
        var aryData=[];

        if (option)
        {
            option.HQChart=data.Self;
            option.IndexSymbol=indexSymbol;
            option.Symbol=symbol;
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;
        
        if (ChartData.IsMinutePeriod(period, true)) //分钟周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:101,
                    ID:requestID,
                    ArySymbol:[{ Symbol:indexSymbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_INDEX_RecvMinuteData(recv, callback, option);
                }
            }
        }
        else if (ChartData.IsDayPeriod(period,true))    //日线周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:100,
                    ID:requestID,
                    ArySymbol:[{ Symbol:indexSymbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_INDEX_RecvDayData(recv, callback, option);
                }
            }
        }
        else
        {
            return;
        }

        

        this.WSClient.Request(msg, callbackInfo);
    }


    KLine_INDEX_RecvDayData(recv,callback, option)
    {
        var indexSymbol=option.IndexSymbol;
        var hqchartData=this.JonsToKLine_DayData(indexSymbol, recv);

        callback(hqchartData);
    }

    KLine_INDEX_RecvMinuteData(recv, callback, option)
    {
        var indexSymbol=option.IndexSymbol;
        var hqchartData=this.JosnToKLine_MinuteData(indexSymbol, recv);

        callback(hqchartData);
    }

    KLine_RequestLatestData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol[0];
        if (option)
        {
            option.HQChart=data.Self;
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:2,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol, Fields:{ ShareCapital:true } } ],   //ShareCaptial 股本数据
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.KLine_RecvLatestDataV2(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


     KLine_RecvLatestDataV2(recv, callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;
        var symbol=hqchart.Symbol;
        var hqchartData={ code:0, data:[ ], ver:2.0 };
        var value=null;
        for(var i=0;i<recv.AryData.length;++i)
        {
            var stockItem=recv.AryData[i];
            if (stockItem.Symbol==symbol)
            {
                hqchartData.data.push({ id:3, value: stockItem.YClose });  //DYNAINFO(3)  昨收盘价 即时行情数据 期货和期权品种为昨结算价
                hqchartData.data.push({ id:4, value: stockItem.Open });    //DYNAINFO(4)  开盘价 即时行情数据 在开盘前,值为0,在使用时需要判断(否则分时指标时会影响纵坐标轴)   
                hqchartData.data.push({ id:5, value: stockItem.High });    //DYNAINFO(5)  最高价 即时行情数据 在开盘前,值为0,在使用时需要判断(否则分时指标时会影响纵坐标轴)
                hqchartData.data.push({ id:6, value: stockItem.Low });     //DYNAINFO(6)  最低价 即时行情数据 在开盘前,值为0,在使用时需要判断(否则分时指标时会影响纵坐标轴)
                hqchartData.data.push({ id:7, value: stockItem.Close });   //DYNAINFO(7)  现价 即时行情数据 没有现价时(比如在开盘前),返回昨收盘价 盘中可能一直在变化,判断相等时须谨慎
                hqchartData.data.push({ id:8, value: stockItem.Vol });     //DYNAINFO(8)  成交量 即时行情数据
                hqchartData.data.push({ id:9, value: stockItem.LastTrade });     //DYNAINFO(9) 现量 即时行情数据
                hqchartData.data.push({ id:10,value: stockItem.Amount });  //DYNAINFO(10) 总金额 即时行情数据

                //hqchartData.data.push({ id:11,value: stockItem.AvPrice });  //DYNAINFO(11) 均价 即时行情数据

                //涨跌
                if (IFrameSplitOperator.IsNumber(stockItem.YClose) && IFrameSplitOperator.IsNumber(stockItem.Close))
                {
                    value=stockItem.Close-stockItem.YClose;
                    hqchartData.data.push({ id:12, value: value }); //DYNAINFO(12) 日涨跌 即时行情数据
                }

                //振幅
                if (IFrameSplitOperator.IsNumber(stockItem.Low) && IFrameSplitOperator.IsNumber(stockItem.High) && IFrameSplitOperator.IsNumber(stockItem.YClose) && stockItem.YClose!=0)
                {
                    value=(stockItem.High-stockItem.Low)/stockItem.YClose*100;
                    hqchartData.data.push({ id:13, value: value }); //DYNAINFO(13) 振幅 即时行情数据 转换成幅度需要乘100
                }
                    
                //涨幅
                if (IFrameSplitOperator.IsNumber(stockItem.YClose) && stockItem.YClose!=0 && IFrameSplitOperator.IsNumber(stockItem.Close))
                {
                    value=(stockItem.Close-stockItem.YClose)/stockItem.YClose*100;
                    hqchartData.data.push({ id:14, value: value }); //DYNAINFO(14) 涨幅 即时行情数据(沪深京早盘竞价期间使用匹配价的涨幅) 转换成幅度需要乘100
                }

                //买卖盘
                if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Buys))
                {
                    var BUY_PRICE_ID=[20,71,75,79,83], BUY_VOL_ID=[58,72,76,80,84]
                    for(var i=0;i<stockItem.Buys.length && i<BUY_PRICE_ID.length;++i)
                    {
                        var item=stockItem.Buys[i];
                        if (IFrameSplitOperator.IsNumber(item.Price)) hqchartData.data.push({ id:BUY_PRICE_ID[i], value: item.Price });
                        if (IFrameSplitOperator.IsNumber(item.Vol)) hqchartData.data.push({ id:BUY_VOL_ID[i], value: item.Vol });
                    }
                }

                //卖盘
                if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Sells))
                {
                    var SELL_PRICE_ID=[21,73,77,81,85], SELL_VOL_ID=[59,74,78,82,86]
                    for(var i=0;i<stockItem.Sells.length && i<SELL_PRICE_ID.length;++i)
                    {
                        var item=stockItem.Sells[i];
                        if (IFrameSplitOperator.IsNumber(item.Price)) hqchartData.data.push({ id:SELL_PRICE_ID[i], value: item.Price });
                        if (IFrameSplitOperator.IsNumber(item.Vol)) hqchartData.data.push({ id:SELL_VOL_ID[i], value: item.Vol });
                    }
                }

                hqchartData.data.push({ id:22,value: stockItem.InVol });   //DYNAINFO(22) 返回内盘,板块指数则返回跌停家数 即时行情数据
                hqchartData.data.push({ id:23,value: stockItem.OutVol });   //DYNAINFO(23) 返回外盘,板块指数则返回涨停家数 即时行情数据

                hqchartData.data.push({ id:26,value: stockItem.UpLimit });    //DYNAINFO(26) 返回涨停价 即时行情数据
                hqchartData.data.push({ id:27,value: stockItem.DownLimit });    //DYNAINFO(27) 返回跌停价 即时行情数据

                //DYNAINFO(37) 换手率(序列数据,每个周期的数据不同,使用的流通股本为最近数据) 转换成幅度需要乘100 比如DYNAINFO(37)>0.1表示换手超过10%
                //流通股的数据（股)
                if (stockItem.ShareCapital)
                {
                    var subItem=stockItem.ShareCapital;
                    if (IFrameSplitOperator.IsNumber(subItem.ListA)) hqchartData.data.push({ id:37,value: subItem.ListA });
                }

                hqchartData.data.push({ id:40,value: stockItem.PE_TTM });    //DYNAINFO(40) 市盈率(根据最近12个月的每股收益得到的市盈率) 即时行情数据 沪深京品种有效

                break;
            }
           
        }

        callback(hqchartData);
    }


    KLine_RecvLatestData(recv, callback, option)
    {
        var hqchart=null;
        if (option && option.HQChart) hqchart=option.HQChart;
        var symbol=hqchart.Symbol;
        var hqchartData={ code:0, stock:[ ], };

        for(var i=0;i<recv.AryData.length;++i)
        {
            var stockItem=recv.AryData[i];
            if (stockItem.Symbol==symbol)
            {
                var item={ }
                item.symbol=stockItem.Symbol;
                item.name=stockItem.Name;                   //名称
                item.yclose=stockItem.YClose;               //昨收
                item.open=stockItem.Open;                   //今开
                item.high=stockItem.High;                   //最高
                item.low=stockItem.Low;                     //最低
                item.price=stockItem.Close;                 //最新价
                item.vol=stockItem.Vol;                     //成交量
                item.amount=stockItem.Amount;               //成交额
                //涨幅
                if (IFrameSplitOperator.IsNumber(stockItem.YClose) && stockItem.YClose!=0 && IFrameSplitOperator.IsNumber(stockItem.Close))
                    item.increase=(stockItem.Close-stockItem.YClose)/stockItem.YClose;
                //振幅
                if (IFrameSplitOperator.IsNumber(stockItem.Low) && IFrameSplitOperator.IsNumber(stockItem.High))
                    item.amplitude=stockItem.High-stockItem.Low;
                //涨跌
                if (IFrameSplitOperator.IsNumber(stockItem.YClose) && IFrameSplitOperator.IsNumber(stockItem.Close))
                    item.updown=stockItem.Close-stockItem.YClose;


                //item[9]=stockItem.BidPrice;           //买一价
                //item[11]=stockItem.AskPrice;          //卖一价
                //item[35]=stockItem.Time;               //时间
                //item[36]=stockItem.Date;               //日期

                hqchartData.stock.push(item);
                break;
            }
           
        }

        callback(hqchartData);
    }


    KLine_RequestOtherSymbolData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var period=data.Request.Data.period;
        var right=data.Request.Data.right;
        var dateRange=data.Request.Data.dateRange;
        //var start=data.Request.Data.dateRange.Start;
        //var end=data.Request.Data.dateRange.End;

        if (option) 
        {
            option.Symbol=symbol
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;
        
        if (ChartData.IsMinutePeriod(period, true)) //分钟周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:101,
                    ID:requestID,
                    ArySymbol:[{ Symbol:symbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvOtherSymbol_MinuteData(recv, callback, option);
                }
            }
        }
        else if (ChartData.IsDayPeriod(period,true))    //日线周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:100,
                    ID:requestID,
                    ArySymbol:[{ Symbol:symbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvOtherSymbol_DayData(recv, callback, option);
                }
            }
        }
        else
        {
            return;
        }

        this.WSClient.Request(msg, callbackInfo);

    }

    KLine_RecvOtherSymbol_DayData(recv, callback, option)
    {
        var symbol=null;
        if (option) symbol=option.Symbol;
        var hqchartData=this.JonsToKLine_DayData(symbol, recv);

        callback(hqchartData);
    }

    KLine_RecvOtherSymbol_MinuteData(recv, callback, option)
    {
        var symbol=null;
        if (option) symbol=option.Symbol;
        var hqchartData=this.JosnToKLine_MinuteData(symbol, recv);

        callback(hqchartData);
    }

    KLine_RequestSymbolData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var period=data.Request.Data.period;
        var right=data.Request.Data.right;
        var dateRange=data.Request.Data.dateRange;
        //var start=data.Request.Data.dateRange.Start;
        //var end=data.Request.Data.dateRange.End;

        if (option) 
        {
            option.Symbol=symbol;
        }

        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;
        
        if (ChartData.IsMinutePeriod(period, true)) //分钟周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:101,
                    ID:requestID,
                    ArySymbol:[{ Symbol:symbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvSymbol_DayData(recv, callback, option);
                }
            }
        }
        else if (ChartData.IsDayPeriod(period,true))    //日线周期
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:100,
                    ID:requestID,
                    ArySymbol:[{ Symbol:symbol, Period:period, Right:0, Count:640, Range:dateRange } ],
                    ExtendData:{ ExtendID:extendID },
                }
            };

            var callbackInfo=
            {
                ID:requestID,
                ExtendID:extendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvSymbol_MinuteData(recv, callback, option);
                }
            }
        }
        else
        {
            return;
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    KLine_RecvSymbol_MinuteData(recv, callback, option)
    {
        var symbol=null;
        if (option) symbol=option.Symbol;
        var hqchartData=this.JosnToKLine_MinuteData(symbol, recv);

        callback(hqchartData);
    }

    KLine_RecvSymbol_DayData(recv, callback, option)
    {
        var symbol=null;
        if (option) symbol=option.Symbol;
        var hqchartData=this.JonsToKLine_DayData(symbol, recv);

        callback(hqchartData);
    }


    KLine_RequestVariantData(data, callback, option)
    {
        data.PreventDefault=true;
        var varName=data.Request.Data.VariantName;  //变量名称
        var symbol=data.Request.Data.symbol;
        var idData=this.GenerateUniqueID();

        //TOTALCAPITAL  当前总股本,单位为手,债券1手为10张,其它为100
        //CAPITAL       当前流通股本,单位为手,债券1手为10张,其它为100 对于可转债,为剩余规模(1000张)
        if (varName=="CAPITAL" || varName=="TOTALCAPITAL") 
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:200, ID:idData.ID,
                    ArySymbol:[{ Symbol:symbol, Count:1 } ], ExtendData:{ ExtendID:idData.ExtendID },
                }
            };

            if (option) 
            {
                option.VariantName=varName;
                option.Symbol=symbol;
            }
            
            
            var callbackInfo=
            {
                ID:idData.ID,
                ExtendID:idData.ExtendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvVariant_Capital_Data(recv, callback, option);
                }
            }

            this.WSClient.Request(msg, callbackInfo);
        }
       
        else
        {
            var error= `变量'${varName}' 没有对接数据. [HQData::KLine_RequestVariantData]`;
            var hqchartData={ Error:error }; 
            callback(hqchartData);
        }
        
    }

    KLine_RecvVariant_Capital_Data(recv, callback, option)
    {
        var hqchartData={ DataType:0, Data:null };
        var varName=null, symbol=null;
        if (option) 
        {
            varName=option.VariantName;
            symbol=option.Symbol;
        }

        if (recv && IFrameSplitOperator.IsNonEmptyArray(recv.AryData))
        {
            var stockItem=recv.AryData[0];
            if (stockItem && IFrameSplitOperator.IsNonEmptyArray(stockItem.Data) && stockItem.Data[0])
            {
                if (stockItem.Symbol==symbol)
                {
                    var item=stockItem.Data[0];
                    if (varName=="CAPITAL")
                    {
                        hqchartData.DataType=1; //单值数据
                        hqchartData.Data={ Date:item.Date, Value:item.ListA/100 }; //单位为手
                    }
                    else if (varName=="TOTALCAPITAL")
                    {
                        hqchartData.DataType=1; //单值数据
                        hqchartData.Data={ Date:item.Date, Value:item.Total/100 }; //单位为手
                    }
                }
            }
        }
        
        callback(hqchartData);
    }


    KLine_RequestFinanceData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var id=data.Request.Data.id;
        var idData=this.GenerateUniqueID();

        //FINANCE(1) 总股本(序列数据,随时间每天可能变化)
        //FINANCE(7)  流通股本(序列数据,随时间每天可能变化)
        if (id==1 || id==7) 
        {
            var msg=
            {
                MessageID:3,
                Data:
                {
                    Type:200, ID:idData.ID,
                    ArySymbol:[{ Symbol:symbol, Count:120 } ], ExtendData:{ ExtendID:idData.ExtendID },
                }
            };

            if (option) 
            {
                option.Symbol=symbol;
                option.FinanceID=id;
            }
            
            
            var callbackInfo=
            {
                ID:idData.ID,
                ExtendID:idData.ExtendID,
                Callback:(recv)=>
                {
                    this.KLine_RecvFinanceData(recv, callback, option);
                }
            }

            this.WSClient.Request(msg, callbackInfo);
        }
        else
        {
            var error= `Finance(${id}) 没有对接数据. [HQData::KLine_RequestFinanceData]`;
            var hqchartData={ Error:error }; 
            callback(hqchartData);
        }
    }

    KLine_RecvFinanceData(recv, callback, option)
    {
        var financeID=0;
        var symbol=null;
        if (option)
        {
            financeID=option.FinanceID;
            symbol=option.Symbol;
        }

        var aryData=[]
        if (financeID==1 || financeID==7)
        {
            if (IFrameSplitOperator.IsNonEmptyArray(recv.AryData) && recv.AryData[0])
            {
                var stockItem=recv.AryData[0];
                if (stockItem.Symbol=symbol && IFrameSplitOperator.IsNonEmptyArray(stockItem.Data))
                {
                    for(var i=0; i<stockItem.Data.length; ++i)
                    {
                        var item=stockItem.Data[i];
                        var date=null, value=null;
                        if (!IFrameSplitOperator.IsNumber(item.Date)) continue;
                        if (financeID==1)
                        {
                            if (IFrameSplitOperator.IsNumber(item.Total)) value=item.Total;
                        } 
                        else if (financeID==7)
                        {
                            if (IFrameSplitOperator.IsNumber(item.ListA)) value=item.ListA;
                        }

                        aryData.push({ Date:item.Date, Value:value});
                    }
                }
            }
        }

        callback(aryData);
    }

    //分价表
    Deal_Price_RequestHistoryData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
       
        var extendID=this.Counter++;
        var requestID=this.RequestDealData_ID;
        if (option)
        {
            
        }

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:6, 
                ID:requestID,
                ArySymbol:[{ Symbol:symbol } ], ExtendData:{ ExtendID:extendID },
            }
        };

        if (option) 
        {
            option.HQChart=data.Self;
        }
        
        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Deal_Price_RecvHistoryData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    Deal_Price_RecvHistoryData(recv, callback, option)
    {
        var hqchart=null, symbol=null;
        if (option) hqchart=option.HQChart;
        if (hqchart) symbol=hqchart.Symbol;

        var hqchartData={ symbol:symbol, detail:[], yclose:null, UpdateType:1 };
        if (recv && IFrameSplitOperator.IsNonEmptyArray(recv.AryData))
        {
            for(var  i=0;i<recv.AryData.length;++i)
            {
                var stockItem=recv.AryData[i];
                if (stockItem.Symbol==symbol)
                {
                    if (IFrameSplitOperator.IsNumber(stockItem.YClose)) hqchartData.yclose=stockItem.YClose;
                    if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Data))
                    {
                        var maxRate=0;
                        for(var j=0;j<stockItem.Data.length;++j)
                        {
                            var priceItem=stockItem.Data[j];
                            var item=[]
                            item[1]=priceItem.Price;
                            item[2]=priceItem.Vol;
                            item[101]=priceItem.BidRate;
                            item[102]=priceItem.Rate;
                            item[103]=priceItem.Vol;
                            if (maxRate<priceItem.Rate) maxRate=priceItem.Rate;
                            hqchartData.detail.push(item);
                        }

                        //item[50]={ Value:[priceItem.Rate/100], Color:[0,1] };
                        maxRate*=(1+0.1);
                        if (IFrameSplitOperator.IsPlusNumber(maxRate))
                        {
                            for(var j=0;j<hqchartData.detail.length;++j)
                            {
                                var item=hqchartData.detail[j];
                                var price=item[1];
                                var colorIndex=0;
                                if (price<hqchartData.yclose) colorIndex=1;
                                else if (price==hqchartData.yclose) colorIndex=2;
                                item[50]={ Value:[item[102]/maxRate], Color:[colorIndex] };
                            }
                        }
                        
                    }

                    break;
                }


            }
        }

        callback(hqchartData);
    }

    //成交明细
    Deal_RequestHistoryData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var showType=0;
        var count=50;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Count)) count=option.Count;
            if (IFrameSplitOperator.IsNumber(option.ShowType)) showType=option.ShowType;
        }

        if (showType==3 || showType==2)    //分价表
        {
            this.Deal_Price_RequestHistoryData(data, callback, option);
            return;
        }

        var extendID=this.Counter++;
        var requestID=this.RequestDealData_ID;
        var dataType=4;
        if (showType==1) dataType=5;
        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:dataType, 
                ID:requestID,
                ArySymbol:[{ Symbol:symbol, Count:count } ], ExtendData:{ ExtendID:extendID },
            }
        };

        if (option) 
        {
            option.HQChart=data.Self;
        }
        
        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Deal_RecvHistoryData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }


    Deal_RecvHistoryData(recv, callback, option)
    {
        var hqchart=null, symbol=null;
        if (option) hqchart=option.HQChart;
        if (hqchart) symbol=hqchart.Symbol;
        
        var hqchartData=this.JsonToDetailData(symbol, recv);
        callback(hqchartData);
    }

    Deal_RequestUpdateData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        var showType=0;
        if (option && IFrameSplitOperator.IsNumber(option.ShowType)) showType=option.ShowType;
        if (showType==3 || showType==2)    //分价表
        {
            this.Deal_Price_RequestHistoryData(data, callback, option);
            return;
        }

        var extendID=this.Counter++;
        var requestID=this.RequestDealData_ID;
        var tickData=data.Self.Data;
        var dataID=-1;
        if (tickData && IFrameSplitOperator.IsNonEmptyArray(tickData.Data)) dataID=tickData.Data[tickData.Data.length-1].ID;

        var count=10;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Count)) count=option.Count;

            if (option.ShowType===0)
            {
                count=50;
                dataID=-1;
            }

             option.DataID=dataID;
        }

        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:4, ID:requestID,
                ArySymbol:[{ Symbol:symbol, Count:count } ], ExtendData:{ ExtendID:extendID },
            }
        };

        if (option) 
        {
            option.HQChart=data.Self;
        }
        
        
        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.Deal_RecvUpdateData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    Deal_RecvUpdateData(recv, callback, option)
    {
        var hqchart=null, symbol=null,  startID=-1, showType=0;
        if (option) 
        {
            hqchart=option.HQChart;
            startID=option.DataID;
        }
        if (hqchart) symbol=hqchart.Symbol;
       
        
        var hqchartData=this.JsonToDetailData(symbol, recv);
        if (hqchartData && IFrameSplitOperator.IsNonEmptyArray(hqchartData.detail))
        {
            var aryFilterData=[];
            for(var i=0;i<hqchartData.detail.length;++i)
            {
                var item=hqchartData.detail[i];
                if (item[6]>startID) aryFilterData.push(item);
            }

            hqchartData.detail=aryFilterData;
        }

        if (hqchartData && option && option.ShowType===0) hqchartData.UpdateType=1;

        callback(hqchartData);
    }


    JsonToDetailData(symbol, recv)
    {
        var hqchartData={ symbol:symbol, detail:[], yclose:null, yfclose:null };
        if (!recv || !IFrameSplitOperator.IsNonEmptyArray(recv.AryData)) return hqchartData;

        var upperSymbol=null;
        if (symbol) upperSymbol=symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol)) //期货
        {
            for(var i=0;i<recv.AryData.length;++i)
            {
                var stockItem=recv.AryData[i];
                if (stockItem.Symbol==symbol)
                {
                    if (IFrameSplitOperator.IsNumber(stockItem.YClose)) hqchartData.yclose=stockItem.YClose;
                    if (IFrameSplitOperator.IsNumber(stockItem.YFClose)) hqchartData.yfclose=stockItem.YFClose;
                    if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Data))
                    {
                        for(var j=0;j<stockItem.Data.length;++j)
                        {
                            var tickItem=stockItem.Data[j];
                            var item=[]
                            item[0]=tickItem.Time;
                            item[1]=tickItem.Price;
                            item[2]=tickItem.Vol;
                            item[6]=tickItem.ID;

                            var color=null;
                            if (tickItem.Type==1) color="rgb(238,21,21)";       //开仓
                            else if (tickItem.Type==2) color="rgb(25,158,0)";   //平仓
                            item[201]={ Text:tickItem.PositionChange.toFixed(0), TextColor:color };
                            item[202]={ Text:tickItem.Flag, TextColor:color };

                            hqchartData.detail.push(item);
                        }
                    }
                    break;
                }
            }
        }
        else
        {
            for(var i=0;i<recv.AryData.length;++i)
            {
                var stockItem=recv.AryData[i];
                if (stockItem.Symbol==symbol)
                {
                    if (IFrameSplitOperator.IsNumber(stockItem.YClose)) hqchartData.yclose=stockItem.YClose;
                    if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Data))
                    {
                        for(var j=0;j<stockItem.Data.length;++j)
                        {
                            var tickItem=stockItem.Data[j];
                            var item=[]
                            item[0]=tickItem.Time;
                            item[1]=tickItem.Price;
                            item[2]=tickItem.Vol;
                            item[3]=tickItem.Amount;
                            item[4]=tickItem.Type=="B"?1:2;
                            item[6]=tickItem.ID;

                            hqchartData.detail.push(item);
                        }
                    }
                    break;
                }
            }
        }

        return hqchartData;
    }

    //买卖5档
    StockInfo_RequestStockData(data, callback, option)
    {
        data.PreventDefault=true;
        var symbol=data.Request.Data.symbol;
        
        if (option)
        {
            option.HQChart=data.Self;
        }

        var extendID=this.Counter++;
        var requestID=this.RequestStockInfoData_ID;
        
        var msg=
        {
            MessageID:3,
            Data:
            {
                Type:2,
                ID:requestID,
                ArySymbol:[{ Symbol:symbol} ],   
                ExtendData:{ ExtendID:extendID },
            }
        };

        var callbackInfo=
        {
            ID:requestID,
            ExtendID:extendID,
            Callback:(recv)=>
            {
                this.StockInfo_RecvStockData(recv, callback, option);
            }
        }

        this.WSClient.Request(msg, callbackInfo);
    }

    StockInfo_RecvStockData(recv, callback, option)
    {
        var hqchart=null, symbol=null;
        if (option) hqchart=option.HQChart;
        if (hqchart) symbol=hqchart.Symbol;

        var hqchartData=this.JsonToStockInfo_StockData(symbol, recv);
        callback(hqchartData);
    }

    JsonToStockInfo_StockData(symbol, recv)
    {
        var hqchartData={ symbol:symbol,name:symbol, yclose:null, yfclose:null, data:[] };    //data:[ { Name:"", Value: }]
        if (!recv || !IFrameSplitOperator.IsNonEmptyArray(recv.AryData)) return hqchartData;
        
        for(var i=0;i<recv.AryData.length;++i)
        {
            var stockItem=recv.AryData[i];
            if (stockItem.Symbol==symbol)
            {
                var upperSymbol=null;
                if (symbol) upperSymbol=symbol.toUpperCase();
                if (IFrameSplitOperator.IsNumber(stockItem.YClose)) hqchartData.yclose=stockItem.YClose;
                if (IFrameSplitOperator.IsNumber(stockItem.YFClose)) hqchartData.yfclose=stockItem.YFClose;
                if (stockItem.Name) hqchartData.name=stockItem.Name;

                var volBase=1;
                if (MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol)) volBase=100;
                if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Buys))
                {
                    var aryValue=[];
                    for(var j=0;j<stockItem.Buys.length;++j)
                    {
                        var item=stockItem.Buys[j];
                        aryValue[j]={ Price:item.Price, Vol:item.Vol/volBase };
                    }

                    hqchartData.data.push({ Name:"Buys", Value:aryValue });
                }

                if (IFrameSplitOperator.IsNonEmptyArray(stockItem.Sells))
                {
                    var aryValue=[];
                    for(var j=0;j<stockItem.Sells.length;++j)
                    {
                        var item=stockItem.Sells[j];
                        aryValue[j]={ Price:item.Price, Vol:item.Vol/volBase };
                    }

                    hqchartData.data.push({ Name:"Sells", Value:aryValue });
                }
                
                hqchartData.data.push({ Name:"Symbol", Value:{ Text:symbol } });
                if (IFrameSplitOperator.IsNumber(stockItem.YClose)) hqchartData.data.push({ Name:"YClose", Value:{ Value:stockItem.YClose } });
                if (IFrameSplitOperator.IsNumber(stockItem.Price)) hqchartData.data.push({ Name:"Price", Value:{ Value:stockItem.Price } });
                if (IFrameSplitOperator.IsNumber(stockItem.Open)) hqchartData.data.push({ Name:"Open", Value:{ Value:stockItem.Open } });
                if (IFrameSplitOperator.IsNumber(stockItem.High)) hqchartData.data.push({ Name:"High", Value:{ Value:stockItem.High } });
                if (IFrameSplitOperator.IsNumber(stockItem.Low)) hqchartData.data.push({ Name:"Low", Value:{ Value:stockItem.Low } });
                if (IFrameSplitOperator.IsNumber(stockItem.UpLimit)) hqchartData.data.push({ Name:"UpLimit", Value:{ Value:stockItem.UpLimit } });
                if (IFrameSplitOperator.IsNumber(stockItem.DownLimit)) hqchartData.data.push({ Name:"DownLimit", Value:{ Value:stockItem.DownLimit } });

                if (IFrameSplitOperator.IsNumber(stockItem.DownLimit)) hqchartData.data.push({ Name:"OutVol", Value:{ Value:stockItem.OutVol/volBase } });  //转成手
                if (IFrameSplitOperator.IsNumber(stockItem.DownLimit)) hqchartData.data.push({ Name:"InVol", Value:{ Value:stockItem.InVol/volBase } });    //转成手

                if (IFrameSplitOperator.IsNumber(stockItem.UpDown)) hqchartData.data.push({ Name:"UpDown", Value:{ Value:stockItem.UpDown } });
                if (IFrameSplitOperator.IsNumber(stockItem.Increase)) hqchartData.data.push({ Name:"Increase", Value:{ Value:stockItem.Increase } });

                if (IFrameSplitOperator.IsNumber(stockItem.Vol)) hqchartData.data.push({ Name:"Vol", Value:{ Value:stockItem.Vol/volBase } }); //转成手
                if (IFrameSplitOperator.IsNumber(stockItem.Amount)) hqchartData.data.push({ Name:"Amount", Value:{ Value:stockItem.Amount } });
                if (IFrameSplitOperator.IsNumber(stockItem.PE_TTM)) hqchartData.data.push({ Name:"PE_TTM", Value:{ Value:stockItem.PE_TTM } }); //市盈率(TTM)
                if (IFrameSplitOperator.IsNumber(stockItem.PB)) hqchartData.data.push({ Name:"PB", Value:{ Value:stockItem.PB } }); //市净率

                if (IFrameSplitOperator.IsNumber(stockItem.FlowMarketValue)) hqchartData.data.push({ Name:"FlowMarketValue", Value:{ Value:stockItem.FlowMarketValue } });      //流通市值
                if (IFrameSplitOperator.IsNumber(stockItem.TotalMarketValue)) hqchartData.data.push({ Name:"TotalMarketValue", Value:{ Value:stockItem.TotalMarketValue } });   //总市值
                if (IFrameSplitOperator.IsNumber(stockItem.Exchange)) hqchartData.data.push({ Name:"Exchange", Value:{ Value:stockItem.Exchange } });       //换手率%
                if (IFrameSplitOperator.IsNumber(stockItem.Amplitude)) hqchartData.data.push({ Name:"Amplitude", Value:{ Value:stockItem.Amplitude } });     //振幅%

                if (IFrameSplitOperator.IsNumber(stockItem.Position)) hqchartData.data.push({ Name:"Position", Value:{ Value:stockItem.Position } });    //持仓量
                if (IFrameSplitOperator.IsNumber(stockItem.FClose)) hqchartData.data.push({ Name:"FClose", Value:{ Value:stockItem.FClose } });    //结算价
                if (IFrameSplitOperator.IsNumber(stockItem.YFClose)) hqchartData.data.push({ Name:"YFClose", Value:{ Value:stockItem.YFClose } });    //昨结算价

                break;
            }
        }
        
        return hqchartData;
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    //

    JosnToKLine_MinuteData(symbol, recv)
    {
        var hqchartData={ name:symbol, symbol:symbol, data:[], ver:2.0 };
        if (!recv || !IFrameSplitOperator.IsNonEmptyArray(recv.AryData)) return hqchartData;
       
        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;
                    kItem[8]=item.Time;

                    hqchartData.data.push(kItem);
                }
                break;
            }
        }

        return hqchartData;
    }

    JonsToKLine_DayData(symbol, recv)
    {
        var hqchartData={ name:symbol, symbol:symbol, data:[], ver:2.0 };
        if (!recv || !IFrameSplitOperator.IsNonEmptyArray(recv.AryData)) return hqchartData;

        for(var i=0;i<recv.AryData.length;++i)
        {
            var item=recv.AryData[i];
            if (item.Symbol==symbol)
            {
                var aryKLine=item.Data;
                if (item.Name) hqchartData.name=item.Name;
                for(var j=0;j<aryKLine.length;++j)
                {
                    var item=aryKLine[j];
                    var kItem=[];
                    kItem[0]=item.Date;
                    kItem[1]=item.YClose;
                    kItem[2]=item.Open;
                    kItem[3]=item.High;
                    kItem[4]=item.Low;
                    kItem[5]=item.Close;
                    kItem[6]=item.Vol;
                    kItem[7]=item.Amount;

                    hqchartData.data.push(kItem);
                }
                break;
            }
        }

        return hqchartData;
    }


    GenerateUniqueID()
    {
        var extendID=this.Counter++;
        var requestID=`${this.ID}-${extendID}`;

        return { ID:requestID, ExtendID:extendID };
    }

    
    
}

