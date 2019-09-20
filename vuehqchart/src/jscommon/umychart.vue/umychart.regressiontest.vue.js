/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   个股指标回测
*/


/*
    指标回测
    计算: Trade: {Count 交易次数  Days:交易天数 Success:成功交易次数 Fail:失败交易次数}
          Day: {Count:总运行  Max:最长运行 Min:最短运行 Average:平均运行}
          Profit: 总收益 StockProfit:个股收益  Excess:超额收益 MaxDropdown:最大回撤 Beta:β(Beta)系数(指标里面需要又大盘数据)
          NetValue: [ {Date:日期, Net:净值, Close:股票收盘价, IndexClose:大盘的收盘价}, ]
*/


function RegressionTest()
{
    //只读数据不能修改
    this.HistoryData;   //K线数据
    this.BuyData;       //策略买数据
    this.SellData;      //策略卖数据
    this.IndexClose;    //大盘收盘价
    this.NetCalculateModel=0;   //净值及收益计算模型 0=使用B点开盘价计算 1=使用B点下一天的开盘价计算

    this.InitialCapital=10000;  //初始资金1W

    //计算结果数据
    this.Data=new Map(); //key:DATA_NAME value:数据

    this.SetPolicyData=function(obj)    //设置策略结果的数据 {KLineData:个股K线数据, BuyData:策略买数据, SellData:策略卖数据, IndexClose:大盘收盘价}
    {
        this.HistoryData=obj.KLineData; //K线数据
        this.BuyData=obj.BuyData;       //策略买数据
        this.SellData=obj.SellData;     //策略卖数据
        if (obj.IndexClose) this.IndexClose=obj.IndexClose; //大盘收盘价 如果没有大盘数据 就不计算β(Beta)系数 和指数涨幅数据
    }

    this.ClearData=function()       //清空所有的结果数据
    {
        this.Data=new Map()
    }

    this.GetBSData=function(startDate)  //BS点配对 { B:[{Data:K线数据, Count:天数, NextOpen:下一天的开盘价 }], S:{Data:K线数据}}
    {
        var index=null;
        for(var i=0;i<this.HistoryData.length;++i)
        {
            var item=this.HistoryData[i];
            if (item.Date>=startDate) 
            {
                index=i;
                break;
            }
        }
        if (index===null) return null;

        console.log(`[RegressionTest::GetBSData] startDate=${startDate} index=${index}`);
        var aryBS=[];
        var bsItem=null;
        for(var i=index;i<this.HistoryData.length;++i)
        {
            var buyItem=this.BuyData[i];
            var sellItem=this.SellData[i];
            var kLineItem=this.HistoryData[i];
            if (bsItem===null)
            {
                if (buyItem>0)
                {
                    var bItem={Data:kLineItem, Count:0 };
                    if (i+1<this.HistoryData.length) bItem.NextOpen=this.HistoryData[i+1].Open;    //获取下一天的开盘价
                    bsItem={ B:[bItem], S:null};  //B可以多个，S一个
                }
            }
            else
            {
                for(var j in bsItem.B) ++bsItem.B[j].Count; //天数+1
                if (buyItem>0)
                {
                    var bItem={Data:kLineItem, Count:0};
                    if (i+1<this.HistoryData.length) bItem.NextOpen=this.HistoryData[i+1].Open;    //获取下一天的开盘价
                    bsItem.B.push(bItem);
                }
                else if (sellItem>0)
                {
                    bsItem.S={Data:kLineItem};
                    aryBS.push(bsItem);
                    bsItem=null;
                }
            }
        }

        var data={StartDate:this.HistoryData[index].Date, StartIndex:index, Count:this.HistoryData.length-index, BSData:aryBS };

        console.log('[RegressionTest::GetBSData] data',data);
        return data;
    }

    this.Calculate=function(data)
    {
        var day={ Count:data.Count, Max:null, Min:null, Average:null }; //Count:总运行  Max:最长运行 Min:最短运行 Average:平均运行
        var trade={Count:0, Days:0, Success:0 , Fail:0, SuccessRate:0};    //Count 交易次数  Days:交易天数 Success:成功交易次数 Fail:失败交易次数

        for(var i in data.BSData)  
        {
            var item=data.BSData[i];
            for(var j in item.B)
            {
                var bItem=item.B[j];
                if (day.Max===null) day.Max=bItem.Count;
                else if (day.Max<bItem.Count) day.Max=bItem.Count;

                if (day.Min===null) day.Min=bItem.Count;
                else if (day.Min>bItem.Count) day.Min=bItem.Count;

                ++trade.Count;
                trade.Days+=bItem.Count; 

                if (item.S.Data.Close>bItem.Data.Open) ++trade.Success;
                else ++trade.Fail;
            }
        }

        if (trade.Count>0) 
        {
            day.Average=trade.Days/trade.Count;
            trade.SuccessRate=trade.Success/trade.Count;
        }

        //计算收益(总收益)
        var profit=1,buyPrice;
        for(var i in data.BSData)
        {
            var item=data.BSData[i];
            if (this.NetCalculateModel===1 && item.B[0].NextOpen>0 ) buyPrice=item.B[0].NextOpen;
            else buyPrice=item.B[0].Data.Open;
            var sellPrice=item.S.Data.Close;
            var value=(sellPrice-buyPrice)/buyPrice+1;
            profit*=value;
        }
        profit-=1;  //公式:[（1+收益1）*（1+收益2）*（1+收益3）……（1+收益n）-1] x 100%

        //标的证券收益
        var yClose=this.HistoryData[data.StartIndex].Close; //使用前收盘
        var close=this.HistoryData[this.HistoryData.length-1].Close; //最后一个大盘收盘价
        var stockProfit=(close-yClose)/yClose;

        console.log(`[RegressionTest::Calculate] stock profit first[${this.HistoryData[data.StartIndex].Date}, YClose=${this.HistoryData[data.StartIndex].YClose}] end[${this.HistoryData[this.HistoryData.length-1].Date}, Close=${this.HistoryData[this.HistoryData.length-1].Close}]`);

        var netValue=this.CaclulateNetValue(data);
        var maxDropdown=null, beta=null;
        if (netValue && netValue.length>0) 
        {
            maxDropdown=this.CaclulateMaxDropdown(netValue);
            if (this.IndexClose) beta=this.CaclulateBeta(netValue);
        }

        //Profit:收益  StockProfit:标的证券收益 Excess:超额收益(加上BS配对的数据)
        var result={ Day:day, Trade:trade, Profit:profit, StockProfit:stockProfit, Excess:profit-stockProfit, NetValue:netValue, MaxDropdown:maxDropdown, Beta:beta,BSDataPair:data.BSData};

        console.log('[RegressionTest::Calculate] NetCalculateModel, result ',this.NetCalculateModel, result);
        return result;
    }

    this.CaclulateNetValue=function(data)   //计算净值
    {
        var index=data.StartIndex;

        var aryDay=[];  //{Close:收盘 , Open:开盘, Position:持仓数量, Cache:现金 , MarketValue:总市值}
        var lastDayItem={Position:0, Cache:this.InitialCapital };
        var bsItem=null, buyPrice;
        for(var i=index;i<this.HistoryData.length;++i)
        {
            var buyItem=this.BuyData[i];
            var sellItem=this.SellData[i];
            var kLineItem=this.HistoryData[i];
            var dayItem={Date:kLineItem.Date, Position:lastDayItem.Position, Cache:lastDayItem.Cache, Open:kLineItem.Open, Close:kLineItem.Close};
            dayItem.MarketValue=dayItem.Position*dayItem.Close+dayItem.Cache;   //市值 股票+现金

            if (bsItem===null)
            {
                if (buyItem>0)  //买
                {
                    bsItem={ B:{Data:kLineItem}, S:null};
                    if (this.NetCalculateModel===1 && i+1<this.HistoryData.length && this.HistoryData[i+1].Open>0)
                        buyPrice=this.HistoryData[i+1].Open;    //使用B点下一天的开盘价买
                    else 
                        buyPrice=dayItem.Open;

                    let position=parseInt(dayItem.Cache/buyPrice);      //开盘价买
                    let cache=dayItem.Cache-buyPrice*position;          //剩余的现金

                    dayItem.Position=position;
                    dayItem.Cache=cache;
                    dayItem.MarketValue=dayItem.Position*dayItem.Close+dayItem.Cache;   //市值 股票+现金
                }
            }
            else
            {
                if (sellItem>0) //卖
                {
                    bsItem.S={Data:kLineItem};
                    bsItem=null;

                    let stockValue=dayItem.Position*dayItem.Close;  //卖掉的股票钱
                    dayItem.Position=0;
                    dayItem.Cache+=stockValue;      //卖掉的钱放到现金里面
                    dayItem.MarketValue=dayItem.Position*dayItem.Close+dayItem.Cache;   //市值 股票+现金
                }
            }

            //缓存上一天的数据
            lastDayItem.Position=dayItem.Position;
            lastDayItem.Cache=dayItem.Cache;

            dayItem.Net=dayItem.MarketValue/this.InitialCapital;        //净值
            if (this.IndexClose) dayItem.IndexClose=this.IndexClose[i]; //指数收盘价
            aryDay.push(dayItem);
        }

        //console.log('[RegressionTest::CaclulateNetValue] aryDay',aryDay);
        if (aryDay.length<=0) return  [];

        var netValue=[];    //净值 {Date:日期, Net:净值, Close:股票收盘价, IndexClose:大盘的收盘价}
        for(var i=0;i<aryDay.length;++i)
        {
            var item=aryDay[i];
            var dataItem={ Net:item.Net, Date:item.Date, Close:item.Close };
            if (item.IndexClose) dataItem.IndexClose=item.IndexClose;
            netValue.push(dataItem);
        }

        //console.log('[RegressionTest::CaclulateNetValue] netValue',netValue);

        return netValue;
    }

    this.CaclulateMaxDropdown=function(data) //最大回撤
    {
        var maxNet=data[0].Net;    //最大净值
        var maxValue=0;
        var maxDay;
        for(var i=1;i<data.length;++i)
        {
            var item=data[i];
            var value=1-(item.Net/maxNet);  //1-策略当日净值 / 当日之前策略最大净值
            if (maxValue<value) 
            {
                maxValue=value;
                maxDay=item;
            }
            if (maxNet<item.Net) maxNet=item.Net;   //取当前最大的净值
        }

        console.log('[RegressionTest::CaclulateMaxDropdown] maxDay',maxDay);
        return maxValue;
    }

    this.CaclulateBeta=function(data)   //β(Beta)系数，参数是净值数组NetValue
    {
        var lastItem=data[0];   //上一天的数据
        var indexProfit=[];     //大盘涨幅
        var bsProfit=[];        //策略涨幅
        var indexProfitTotal=0, bsProfitTotal=0;
        for(var i=1; i<data.length; ++i)
        {
            indexProfit[i-1]=0;
            bsProfit[i-1]=0;

            var item=data[i];

            if (item.IndexClose>0 && lastItem.IndexClose>0) indexProfit[i-1]=(item.IndexClose-lastItem.IndexClose)/lastItem.IndexClose;
            if (item.Net>0 && lastItem.Net>0) bsProfit[i-1]=(item.Net-lastItem.Net)/lastItem.Net;
            //if (item.Close>0 && lastItem.Close>0) bsProfit[i-1]=(item.Close-lastItem.Close)/lastItem.Close;

            indexProfitTotal+=indexProfit[i-1];
            bsProfitTotal+=bsProfit[i-1];
            
            lastItem=item;
        }

        var averageIndexProfit=indexProfitTotal/indexProfit.length;
        var averageBSProfit=bsProfitTotal/bsProfit.length;

        var betaCOV=0;  //协方差
        for(var i=0;i<indexProfit.length;++i)
        {
            betaCOV+=(bsProfit[i]-averageBSProfit)*(indexProfit[i]-averageIndexProfit);
        }

        var betaVAR=0;  //标准差：方差的开2次方
        for(var i=0;i<indexProfit.length;++i)
        {
            betaVAR+=(indexProfit[i]-averageIndexProfit)*(indexProfit[i]-averageIndexProfit);
        }

        return betaCOV/betaVAR;
    }

    this.Execute=function(obj)   //开始计算[ { Name:名字 , Date:起始日期 格式(20180101) }, ....]
    {

        for(var i in obj )
        {
            var item=obj[i];
            if (this.Data.has(item.Name))   //已经计算过了不计算
            {
                console.log(`[RegressionTest::Execute] id=${i} Name=${item.Name} Date:${item.Date} is exsit.`);
                continue;
            }

            console.log(`[RegressionTest::Execute] id=${i} Name=${item.Name} Date:${item.Date}`);
            var data=this.GetBSData(item.Date);
            var result=this.Calculate(data);
            this.Data.set(item.Name, result);
        }
    }

}


//计算叠加数据 (日期必须匹配)
RegressionTest.CaclulateOverlayData=function(obj)    //{Main:主数据, Sub:[]//多组叠加数据}
{
    if (!obj.Main || !obj.Sub) return null;
    var count=obj.Main.length;
    for(var i in obj.Sub)
    {
        var item=obj.Sub[i];
        if (item.length!=count) 
        {
            console.log(`[RegressionTest::OverlayData] id=${i} data count not match. MainData count=${count}`);
            return null;
        }
    }

    var result=[];    //[0]:主数据 , [1...]:叠加数据 

    var firstData={Sub:[]};
    firstData.Main=obj.Main[0];
    result.push([]);
    for(var i=0;i<obj.Sub.length;++i)
    {
        var subData=obj.Sub[i];
        firstData.Sub[i]=subData[0];
        result.push([]);
    }
    
    for(var i=0;i<obj.Main.length;++i)
    {
        var value=obj.Main[i];
        var valuePer=(value-firstData.Main)/firstData.Main;
        result[0][i]=valuePer;

        for(var j=0;j<obj.Sub.length;++j)
        {
            var subData=obj.Sub[j];
            var subValue=subData[i];
            var subValuePer=(subValue-firstData.Sub[j])/firstData.Sub[j];
            result[j+1][i]=subValuePer;
        }
    }

    return result;
}


RegressionTest.GetPolicyData=function(data)     //获取指标数据里面需要计算回测的数据
{
    var policyData={KLineData:null, IndexClose:null, BuyData:null, SellData:null};
    policyData.KLineData=data.HistoryData.Data;   //个股K线数据,

    for(var i in data.OutVar)
    {
        var item=data.OutVar[i];
        if (item.Name=='INDEXCLOSE') 
        {
            policyData.IndexClose=item.Data;   //绑定大盘收盘数据
        }
        else if (item.Name=='DRAWICON') //买卖盘BS函数
        {
            if (item.Draw && item.Draw.Icon)  
            {
                if (item.Draw.Icon.ID===13) policyData.BuyData=item.Draw.DrawData; //买
                else if (item.Draw.Icon.ID===14) policyData.SellData=item.Draw.DrawData; //卖
            }
        }
    }

    if (policyData.KLineData && policyData.BuyData && policyData.SellData) return policyData;

    return null;
}



/*暴露外部用的方法*/
export default 
{
    RegressionTest:RegressionTest,  //个股单策略回测
}