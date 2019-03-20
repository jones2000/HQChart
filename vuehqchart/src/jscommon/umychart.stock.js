////////////////////////////////////////////////////////////////////////////////////////
//  股票数据
//
///////////////////////////////////////////////////////////////////////////////////////

function JSStockResource() 
{
  this.Domain = "https://opensource.zealink.com";               //API域名
  this.CacheDomain = "https://opensourcecache.zealink.com";     //缓存域名
}

var g_JSStockResource = new JSStockResource();

//领涨领跌
function IndexTopData()
{
    this.Stop;      //停牌
    this.Down;      //下跌
    this.Up;        //上涨
    this.Unchanged; //平盘
    this.UpStock={"Symbol":null,"Name":null};    //领涨
    this.DownStock={"Symbol":null,"Name":null};  //领跌
}

function IndexHeatData()
{
    this.Good;  //健康度
    //this.Date;  //日期
    this.GoodIncrease={"Day1":null,'Week1':null,"Week4":null};  //周涨幅
}

function SortData(field,order,tagID)
{
    this.arySymbol=new Array();         //成分
    this.SortField=field;               //排序字段
    this.Order=order;                   //1 降, -1 升
    this.TagID=new Set([tagID]);             //绑定的元素id
}

//财务数据
function FinanceData()
{
    this.ROE;           //净资产收益率

    this.Date;          //报告日期,
    this.PerSEarning;   //每股收益
    this.EPS;           //滚动每股收益
    this.PerNetAsset;   //每股净资产

    this.NProfit;       //净利润
    this.NProfitIncrease;   //净利润涨幅 （当年净利润-上一年）/上一年*100

    this.NnetProfit;        //扣非净利润
    this.NnProfitIncrease;  //扣非净利润涨幅  （当年扣非净利润-上一年）/上一年*100
    this.NnProfitSpeed;     //扣非净利润涨速  （当前扣非净利润/上一年-1）/（上一年/上上年-1）
    this.Benford;           //财务粉饰
    
    //TODO:财务数据要了后面再加

    this.SetData=function(data)
    {
        if (!isNaN(data.roe)) this.ROE=data.roe;
        if (!isNaN(data.finance.date)) this.Date=data.finance.date;
        if (!isNaN(data.finance.persearning)) this.PerSEarning=data.finance.persearning;
        if (!isNaN(data.finance.eps)) this.EPS=data.finance.eps;
        if (!isNaN(data.finance.pernetasset)) this.PerNetAsset=data.finance.pernetasset;
        if (!isNaN(data.finance.nprofit)) this.NProfit=data.finance.nprofit;
        if (!isNaN(data.finance.nprofitincrease)) this.NProfitIncrease=data.finance.nprofitincrease;
        if (!isNaN(data.finance.nnetprofit)) this.NnetProfit=data.finance.nnetprofit;
        if (!isNaN(data.finance.nnprofitincrease)) this.NnProfitIncrease=data.finance.nnprofitincrease;
        if (!isNaN(data.finance.nnprofitspeed)) this.NnProfitSpeed=data.finance.nnprofitspeed;
        if (!isNaN(data.finance.benford)) this.Benford = data.finance.benford;
    }
}

//是否是指数代码(是一个单独的类，从umychart.js复制来的)
function IsIndexSymbol(symbol)
{
    var upperSymbol=symbol.toUpperCase();
    if (upperSymbol.indexOf('.SH')>0)
    {
        upperSymbol=upperSymbol.replace('.SH','');
        if (upperSymbol.charAt(0)=='0' && parseInt(upperSymbol)<=3000) return true;

    }
    else if (upperSymbol.indexOf('.SZ')>0)
    {
        upperSymbol=upperSymbol.replace('.SZ','');
        if (upperSymbol.charAt(0)=='3' && upperSymbol.charAt(1)=='9') return true;
    }
    else if (upperSymbol.indexOf('.CI')>0)  //自定义指数
    {
        return true;
    }

    return false;
}

function StockData(symbol)
{
    this.Symbol=symbol;     //股票代码
    this.Name;              //股票名称

    //基础数据
    this.Open;      //开盘
    this.Price;     //最新
    this.High;      //最高
    this.Low;       //最低
    this.YClose;    //前收盘
    this.Vol        //成交量
    this.Amount;    //成交金额
    this.Date;      //交易日期
    this.Time;      //交易时间
    this.ExchangeRate;  //换手率
    this.Amplitude;     //振幅

    this.Increase;  //涨幅
    this.MaxPrice;  //涨停价
    this.MinPrice;  //跌停价
    this.RFPrice    //涨跌额 (Price-YClose)

    this.IndexTop;  //涨跌家数
    this.Week;      //周涨幅

    this.Heat;      //热度
    //获取热度数据,不要直接使用变量获取
    this.GetHeatData=function(tagID)
    {
        this.HeatTagID.add(tagID);
        return this.Heat;
    }

    //成分排序
    this.Sort=new Map();   //key=排序字段-排序方式 value=SortData 一个控件之能有1个排序规则
    this.GetSortData=function(tagID,field,order)
    {
        var key=field.toString()+'-'+order.toString();
        if (!this.Sort.has(key))
        {
            var data=new SortData(field,order,tagID);
            this.Sort.set(key,data);
            return data;
        }

        var data=this.Sort.get(key);
        data.TagID.add(tagID);
        return data;
    }

    this.Buy5;  //五档买
    this.GetBuy5=function(tagID)
    {
        this.BuySellTagID.add(tagID);
        return this.Buy5;
    }

    this.Sell5; //五档卖
    this.GetSell5=function(tagID)
    {
        this.BuySellTagID.add(tagID);
        return this.Sell5;
    }

    this.Deal;  //分笔 最新10条
    this.GetDeal=function(tagID)
    {
        this.DealTagID.add(tagID);
        return this.Deal;
    }

    this.MarketValue;       //总市值
    this.FlowMarketValue;   //流通市值
    this.Bookrate;          //委比
    this.Bookdiffer;        //委差
    this.PE;
    this.PB;
    this.GetDerivative=function(tagID,field)
    {
        this.DerivativeTagID.add(tagID);

        switch(field)
        {
            case STOCK_FIELD_NAME.MARKET_VALUE:
                return this.MarketValue;
            case STOCK_FIELD_NAME.FLOW_MARKET_VALUE:
                return this.FlowMarketValue;
            case STOCK_FIELD_NAME.BOOK_RATE:
                return this.Bookrate;
            case STOCK_FIELD_NAME.BOOK_DIFFER:
                return this.Bookdiffer;
            case STOCK_FIELD_NAME.PE:
                return this.PE;
            case STOCK_FIELD_NAME.PB:
                return this.PB;
        }
    }

    
    this.Finance;           //财务数据     
    this.GetFinance=function(tagID,field)
    {
        if (!this.Finance)  //只请求一次
        {
            this.FinanceTagID.add(tagID);
            return null;
        }

        switch(field)
        {
            case STOCK_FIELD_NAME.ROE:
                return this.Finance.ROE;
            case STOCK_FIELD_NAME.FINANCE_DATE:
                return this.Finance.Date;
            case STOCK_FIELD_NAME.FINANCE_PERSEARNING:
                return this.Finance.PerSEarning;
            case STOCK_FIELD_NAME.FINANCE_PERNETASSET:
                return this.Finance.PerNetAsset;
            case STOCK_FIELD_NAME.FINANCE_NPROFIT:
                return this.Finance.NProfit;
            case STOCK_FIELD_NAME.FINANCE_NPROFITINCREASE:
                return this.Finance.NProfitIncrease;
            case STOCK_FIELD_NAME.FINANCE_NNETPROFIT:
                return this.Finance.NnetProfit;
            case STOCK_FIELD_NAME.FINANCE_NNPROFITINCREASE:
                return this.Finance.NnProfitIncrease;
            case STOCK_FIELD_NAME.FINANCE_NNPROFITSPEED:
                return this.Finance.NnProfitSpeed;
            case STOCK_FIELD_NAME.FINANCE_EPS:
                return this.Finance.EPS;
            case STOCK_FIELD_NAME.FINANCE_BENFORD:
                return this.Finance.Benford;
        }
    }

    this.TagID=new Set();       //绑定的控件id
    this.HeatTagID=new Set();   //需要热度的控件id
    this.BuySellTagID=new Set();//买卖盘的控件id
    this.DealTagID=new Set();   //分笔的控件id
    this.DerivativeTagID=new Set(); //衍生数据
    this.FinanceTagID=new Set();    //财务数据 (就请求1次)

    this.AttachTagID=function(id)
    {
        this.TagID.add(id);
    }

    this.RemoveTagID=function(id)
    {
        this.TagID.delete(id);
        this.HeatTagID.delete(id);
        this.BuySellTagID.delete(id);
        this.DealTagID.delete(id);
        this.DerivativeTagID.delete(id);
        this.FinanceTagID.delete(id);

        for(var item of this.Sort)
        {
            item[1].TagID.delete(id);
        }
    }

    //设置基础数据
    this.SetBaseData=function(data)
    {
        this.Name=data.name;
        this.YClose=data.yclose;
        this.Price=data.price;
        this.High=data.high;
        this.Low=data.low;
        this.Open=data.open;
        this.Vol=data.vol;
        this.Amount=data.amount;
        this.Date=data.date;
        this.Time=data.time;
        this.Increase=data.increase;
        if (!isNaN(data.exchangerate)) this.ExchangeRate=data.exchangerate;
        if (!isNaN(data.amplitude)) this.Amplitude=data.amplitude;
        
        if (this.Name.indexOf('ST')>=0)
        {
            this.MaxPrice=(1+0.05)*this.Open;
            this.MinPrice=(1-0.05)*this.OPen;
        }
        else
        {
            this.MaxPrice=(1+0.1)*this.Open;
            this.MinPrice=(1-0.1)*this.OPen;
        }

        if (this.Price && this.YClose)
            this.RFPrice=this.Price-this.YClose;

        //周涨幅
        if (data.week)
        {
            this.Week={};
            this.Week.Week1=data.week.week1;
            this.Week.Week4=data.week.week4;
            this.Week.Week13=data.week.week13;
            this.Week.Week26=data.week.week26;
            this.Week.Week52=data.week.week52;
        }
    }

    this.SetDerivativeData=function(data)
    {
        this.MarketValue=data.marketvalue;           //总市值
        this.FlowMarketValue=data.flowmarketvalue;   //流通市值
        this.Bookrate=data.bookrate;                 //委比
        this.Bookdiffer=data.bookdiffer;            //委差
        this.PE=data.pe;                            //市盈率
        this.PB=data.pb;                            //市净率
    }

    this.SetFinanceData=function(data)
    {
        console.log(data);
        if (!data.finance) return;

        this.Finance=new FinanceData();
        this.Finance.SetData(data);  
    }

    //指数基础数据
    this.SetIndexBaseData=function(data)
    {
        this.SetBaseData(data);

        var topData=new IndexTopData();
        if(data.indextop){
            topData.Up=data.indextop.up;
            topData.Down=data.indextop.down;
            topData.Unchanged=data.indextop.unchanged;
            topData.Stop=data.indextop.stop;

            topData.UpStock.Symbol=data.indextop.upstock.symbol;
            topData.UpStock.Name=data.indextop.upstock.name;

            topData.DownStock.Symbol=data.indextop.downstock.symbol;
            topData.DownStock.Name=data.indextop.downstock.name;
        }

        this.IndexTop=topData;
    }

    //五档买卖盘
    this.SetBuySellData=function(data)
    {
        this.SetBaseData(data);
        this.Buy5=new Array();
        this.Sell5=new Array();

        for(var i in data.buy)
        {
            var item=data.buy[i];

            this.Buy5.push({"Price":item.price,"Vol":item.vol});
        }

        for(var i in data.sell)
        {
            var item=data.sell[i];
            this.Sell5.push({"Price":item.price,"Vol":item.vol});
        }
    }

    //分笔
    this.SetDealData=function(data)
    {
        this.Price=data.price;
        this.High=data.high;
        this.Low=data.low;
        this.Vol=data.vol;
        this.Amount=data.amount;
        this.Date=data.date;
        this.Time=data.time;
        this.Increase=data.increase;

        this.Deal=new Array();
        for(var i in data.deal)
        {
            var item=data.deal[i];
            if (isNaN(item.price) || isNaN(item.time)) continue;

            this.Deal.push({"Price":item.price,"Amount":item.amount,"Vol":item.vol,"Time":item.time});
        }
    }

    //热度
    this.SetHeatData=function(data)
    {
        var heatData=new IndexHeatData();
        heatData.Good=data.quadrant.good;
        heatData.GoodIncrease.Day1=data.quadrant.gincrease.day1;
        heatData.GoodIncrease.Week1=data.quadrant.gincrease.week1;
        heatData.GoodIncrease.Week4=data.quadrant.gincrease.week4;

        this.Heat=heatData;
    }

}

/////////////////////////////////////////////////////////////////////////////////////
//
//

//股票字段枚举
var STOCK_FIELD_NAME=
{
    SYMBOL:0,
    NAME:1,
    OPEN:2,
    PRICE:3,
    HIGH:4,
    LOW:5,
    YCLOSE:6,
    VOL:7,          //成交量
    AMOUNT:8,       //成交金额
    DATE:9,
    TIME:10,
    INCREASE:11,
    BUY5:12,        //5档买
    SELL5:13,       //5挡卖
    DEAL:14,        //分笔
    AMPLITUDE:15,   //振幅

    MARKET_VALUE:16,            //总市值
    FLOW_MARKET_VALUE:17,       //流通市值

    BOOK_RATE:18,    //委比
    BOOK_DIFFER:19,  //委差

    PE:20,      //市盈率=股价/滚动EPS
    PB:21,      //市净率=股价/每股净资产
    EXCHANGE_RATE:23,    //换手率

    //财务数据
    ROE:24,                 //净资产收益率
    FINANCE_DATE:25,        //报告日期
    FINANCE_PERSEARNING:26, //每股收益
    FINANCE_PERNETASSET:27, //每股净资产

    FINANCE_NPROFIT:28,             //净利润
    FINANCE_NPROFITINCREASE:29,     //净利润涨幅 （当年净利润-上一年）/上一年*100

    FINANCE_NNETPROFIT:30,           //扣非净利润
    FINANCE_NNPROFITINCREASE:31,    //扣非净利润涨幅  （当年扣非净利润-上一年）/上一年*100
    FINANCE_NNPROFITSPEED:32,       //扣非净利润涨速（当前扣非净利润/上一年-1）/（上一年/上上年-1）
    FINANCE_EPS:33,                 //滚动EPS

    MAX_PRICE:34,       //涨停价
    MIN_PRICE:35,       //跌停价
    RISE_FALL_PRICE:36, //涨跌额

    FINANCE_BENFORD:37, //财务粉饰


    INDEXTOP:100,
    WEEK:101,
    HEAT:102
};

function StockRead(stock,tagID)
{
    this.JSStock=stock;
    this.TagID=tagID;

    this.Get=function(symbol,field)
    {
        var data=stock.Get(symbol,this.TagID);
        if(!data) return null;

        switch(field)
        {
            case STOCK_FIELD_NAME.SYMBOL:
                return data.Symbol;
            case STOCK_FIELD_NAME.NAME:
                return data.Name;
            case STOCK_FIELD_NAME.OPEN:
                return data.Open;
            case STOCK_FIELD_NAME.PRICE:
                return data.Price;
            case STOCK_FIELD_NAME.YCLOSE:
                return data.YClose;
            case STOCK_FIELD_NAME.HIGH:
                return data.High;
            case STOCK_FIELD_NAME.LOW:
                return data.Low;
            case STOCK_FIELD_NAME.VOL:
                return data.Vol;
            case STOCK_FIELD_NAME.AMOUNT:
                return data.Amount;
            case STOCK_FIELD_NAME.DATE:
                return data.Date;
            case STOCK_FIELD_NAME.TIME:
                return data.Time;
            case STOCK_FIELD_NAME.INCREASE:
                return data.Increase;
            case STOCK_FIELD_NAME.EXCHANGE_RATE:
                return data.ExchangeRate;
            case STOCK_FIELD_NAME.AMPLITUDE:
                return data.Amplitude;
            case STOCK_FIELD_NAME.MAX_PRICE:
                return data.MaxPrice;
            case STOCK_FIELD_NAME.MIN_PRICE:
                return data.MinPrice;
            case STOCK_FIELD_NAME.RISE_FALL_PRICE:
                return data.RFPrice;
            
            case STOCK_FIELD_NAME.INDEXTOP:
                return data.IndexTop;
            case STOCK_FIELD_NAME.WEEK:
                return data.Week;
            case STOCK_FIELD_NAME.HEAT:
                return data.GetHeatData(this.TagID);
            case STOCK_FIELD_NAME.BUY5:
                return data.GetBuy5(this.TagID);
            case STOCK_FIELD_NAME.SELL5:
                return data.GetSell5(this.TagID);
            case STOCK_FIELD_NAME.DEAL:
                return data.GetDeal(this.TagID);

            //实时计算的衍生数据
            case STOCK_FIELD_NAME.MARKET_VALUE:
            case STOCK_FIELD_NAME.FLOW_MARKET_VALUE:
            case STOCK_FIELD_NAME.BOOK_RATE:
            case STOCK_FIELD_NAME.BOOK_DIFFER:
            case STOCK_FIELD_NAME.PE:
            case STOCK_FIELD_NAME.PB:
                return data.GetDerivative(this.TagID,field);

            //财务数据
            case STOCK_FIELD_NAME.ROE:
            case STOCK_FIELD_NAME.FINANCE_DATE:
            case STOCK_FIELD_NAME.FINANCE_PERSEARNING:
            case STOCK_FIELD_NAME.FINANCE_PERNETASSET:
            case STOCK_FIELD_NAME.FINANCE_NPROFIT:
            case STOCK_FIELD_NAME.FINANCE_NPROFITINCREASE:
            case STOCK_FIELD_NAME.FINANCE_NNETPROFIT:
            case STOCK_FIELD_NAME.FINANCE_NNPROFITINCREASE:
            case STOCK_FIELD_NAME.FINANCE_NNPROFITSPEED:
            case STOCK_FIELD_NAME.FINANCE_EPS:
            case STOCK_FIELD_NAME.FINANCE_BENFORD:
                return data.GetFinance(this.TagID,field);

            default:
                return null;
        }
    }

    //symbol=指数或板块  field=排序字段  order=排序方式
    this.GetSort=function(symbol,field,order)
    {
        var data=stock.Get(symbol,this.TagID);
        if (data==null) return data;

        return data.GetSortData(this.TagID,field,order);
    }

    //读取完成 isUpdate 是否马上更新数据
    this.EndRead=function(isUpdate)
    {
        if (isUpdate==true) this.JSStock.ReqeustData();
    }

    //批量设置查询数据字段
    this.SetQueryField=function(symbol, aryField)
    {
        for(var i in aryField)
        {
            this.Get(symbol,aryField[i])
        }
    }

}


//初始化
JSStock.Init=function()
{
    var stock=new JSStock();
    return stock;
}

JSStock.SetDomain = function (domain, cacheDomain) 
{
    if (domain) g_JSStockResource.Domain = domain;
    if (cacheDomain) g_JSStockResource.CacheDomain = cacheDomain;
  }

//获取股票搜索类
JSStock.GetSearchStock=function(callback)
{
    return new SearchStock(callback);
}

//短线精灵
JSStock.GetShortTerm = function (symbol) 
{
    return new ShortTerm(symbol);
}

var RECV_DATA_TYPE=
{
    BASE_DATA:1,        //股票行情基础数据
    INDEX_BASE_DATA:2,  //指数行情基础数据(包含 涨跌家数)
    HEAT_DATA:3,        //热度数据
    SORT_DATA:4,        //排序数据
    BUY_SELL_DATA:5,    //买卖盘数据
    DEAL_DATA:6,        //分笔数据
    DERIVATIVE_DATA:7,  //实时衍生数据
    FINANCE_DATA:8,     //财务数据
    SEARCH_STOCK_DATA:9,//股票搜索

    SELF_STOCK_DATA:10, //自选股数据
    LOGON_DATA:11,      //登陆信息
    BLOCK_MEMBER_DATA: 13,  //板块成员
    SHORT_TERM_DATA:14      //短线精灵
}

function JSStock()
{
    this.MapStock=new Map();    //key=symbol, value=StockData
    this.MapTagCallback=new Map();  //callback(tagID,arySymbol(更新的股票代码),dataType,this)
    this.RequestVersion=new Array([100,100,100]);

    this.RealtimeApiUrl=g_JSStockResource.Domain+"/API/Stock";
    this.PlateQuadrantApiUrl=g_JSStockResource.Domain+"/API/StockPlateQuadrant";    //热度api

    this.IsAutoUpdate=true;
    this.AutoUpateTimeout=15000;    //更新频率
    this.Timeout;

    this.IsWechatApp=false; //是否是小程序模式

    this.GetStockRead=function(tagID,callback)
    {
        for(var item of this.MapStock)
        {
            item[1].RemoveTagID(tagID);
        }

        this.MapTagCallback.set(tagID,callback);

        var read=new StockRead(this,tagID);
        return read;
    }

    //取消某一个控件订阅的股票推送
    this.Unsubscribe=function(tagID)
    {
        for(var item of this.MapStock)
        {
            item[1].RemoveTagID(tagID);
        }
    }

    //获取一个股票
    this.Get=function(symbol,tagID)
    {
        if (!this.MapStock.has(symbol))
        {
            this.MapStock.set(symbol,new StockData(symbol));
        }

        var data=this.MapStock.get(symbol);
        if (tagID) data.AttachTagID(tagID);
        return data;
    }

    
    this.RequestData=function()
    {
        var arySymbol=new Array();  //股票
        var aryIndex=new Array();   //指数
        var aryHeat=new Array();    //热度
        var aryBuySell=new Array(); //5当买卖盘
        var aryDeal=new Array();    //分笔
        var aryDerivative=new Array();  //实时衍生数据
        var aryFinance=new Array();     //财务数据

        for(var item of this.MapStock)
        {
            if (item[1].BuySellTagID.size>0)
            {
                aryBuySell.push(item[0]);
            }
            else
            {
                if (IsIndexSymbol(item[0])) 
                    aryIndex.push(item[0]);
                else 
                    arySymbol.push(item[0]);
            }

            if(item[1].HeatTagID.size>0)
                aryHeat.push(item[0])

            if (item[1].DealTagID.size>0)
                aryDeal.push(item[0]);

            if (item[1].DerivativeTagID.size>0)
                aryDerivative.push(item[0]);
            
            if (item[1].FinanceTagID.size>0)
                aryFinance.push(item[0]);
        }

        if (aryBuySell.length>0) this.RequestBuySellData(aryBuySell);
        if (arySymbol.length>0) this.RequestBaseData(arySymbol);
        if (aryIndex.length>0) this.RequestIndexBaseData(aryIndex);
        if (aryHeat.length>0) this.RequestIndexHeatData(aryHeat);
        if (aryDeal.length>0) this.RequestDealData(aryDeal);
        if (aryDerivative.length>0) this.RequestDerivativeData(aryDerivative);
        if (aryFinance.length>0) this.RequestFinanceData(aryFinance);

        this.ReqeustAllSortData();    //成分排序
    }

    this.ReqeustData=this.RequestData;  //老的接口名字写错了

    //请求基础数据
    this.RequestBaseData=function(arySymbol)
    {
        var self=this;
       
        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "time",
                    "week",
                    "increase",
                    "exchangerate",
                    "amplitude"
                ],
                "symbol": arySymbol,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvData(data,RECV_DATA_TYPE.BASE_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.BASE_DATA);
            }
        });
    }

    //请求实时衍生数据
    this.RequestDerivativeData=function(arySymbol)
    {
        var self=this;
       
        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "marketvalue",
                    "flowmarketvalue",
                    "pe",
                    "pb",
                    "bookrate",
                    "bookdiffer",
                ],
                "symbol": arySymbol,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvData(data,RECV_DATA_TYPE.DERIVATIVE_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.DERIVATIVE_DATA);
            }
        });
    }

    //请求财务数据
    this.RequestFinanceData=function(arySymbol)
    {
        var self=this;
       
        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "roe",
                    "finance"
                ],
                "symbol": arySymbol,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvData(data,RECV_DATA_TYPE.FINANCE_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.FINANCE_DATA);
            }
        });
    }

     //请求买卖盘
     this.RequestBuySellData=function(arySymbol)
     {
         var self=this;
        
         $.ajax({
             url: this.RealtimeApiUrl,
             data:
             {
                 "field": [
                     "name",
                     "symbol",
                     "yclose",
                     "open",
                     "price",
                     "high",
                     "low",
                     "vol",
                     "amount",
                     "date",
                     "time",
                     "week",
                     "increase",
                     "buy",
                     "sell",
                     "exchangerate",
                     "amplitude"
                 ],
                 "symbol": arySymbol,
             },
             type:"post",
             dataType: "json",
             async:true,
             success: function (data)
             {
                 self.RecvData(data,RECV_DATA_TYPE.BUY_SELL_DATA);
             },
             error:function(request)
             {
                 self.RecvError(request,RECV_DATA_TYPE.BUY_SELL_DATA);
             }
         });
     }

     //请求分笔
     this.RequestDealData=function(arySymbol)
     {
         var self=this;
        
         $.ajax({
             url: this.RealtimeApiUrl,
             data:
             {
                 "field": [
                     "name",
                     "symbol",
                     "price",
                     "high",
                     "low",
                     "vol",
                     "amount",
                     "date",
                     "time",
                     "increase",
                     "deal",
                 ],
                 "symbol": arySymbol,
             },
             type:"post",
             dataType: "json",
             async:true,
             success: function (data)
             {
                 self.RecvData(data,RECV_DATA_TYPE.DEAL_DATA);
             },
             error:function(request)
             {
                 self.RecvError(request,RECV_DATA_TYPE.DEAL_DATA);
             }
         });
     }

    //指数基础数据(包含上涨下跌家数)
    this.RequestIndexBaseData=function(arySymbol)
    {
        var self=this;
       
        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "time",
                    "week",
                    "indextop",
                    "increase"
                ],
                "symbol": arySymbol,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                console.log(data)
                self.RecvData(data,RECV_DATA_TYPE.INDEX_BASE_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.INDEX_BASE_DATA);
            }
        });
    }

    //热度
    this.RequestIndexHeatData=function(arySymbol)
    {
        var self=this;
       
        $.ajax({
            url: this.PlateQuadrantApiUrl,
            data:
            {
                "plate": arySymbol,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvData(data,RECV_DATA_TYPE.HEAT_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.HEAT_DATA);
            }
        });
    }

    //排序
    this.ReqeustAllSortData=function()
    {
        var arySort=new Array();
        for(var item of this.MapStock)
        {
            if (!IsIndexSymbol(item[0])) continue;
            if (item[1].Sort==null || item[1].Sort.size<=0) continue;

            for(var sortItem of item[1].Sort)
            {
                var sortData=sortItem[1];
                var data={ "Plate":item[0], "SortField":sortData.SortField, "Order":sortData.Order, "TagID":sortData.TagID };
                arySort.push(data);
            }
        }
       
        for(var i in arySort)
        {
            var sortItem=arySort[i];
            this.ReqeustSortData(sortItem);
        }
    }

    this.ReqeustSortData=function(sortItem)
    {
        var self=this;
        var sortData=sortItem;
        var sortFiled="";

        //字段id 转换成字段名字
        switch(sortData.SortField)
        {
            case STOCK_FIELD_NAME.INCREASE:
                sortFiled='increase';
                break;
            case STOCK_FIELD_NAME.PRICE:
                sortFiled='price';
                break;
            default:
                return;
        }
        
        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "time",
                    "week",
                    "increase",
                    "exchangerate"
                ],
                "plate": [sortItem.Plate],
                "orderfield":sortFiled,
                "order":sortItem.Order,
                "ordernull":1,      //过滤null字段
                "filterstop":1      //过滤掉停牌数据
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvData(data,RECV_DATA_TYPE.SORT_DATA,sortData);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.SORT_DATA,sortData);
            }
        });
    }

    this.RecvError=function(request,datatype,requestData)
    {
        console.log("RecvError: datatype="+ datatype.toString());
        console.log(request);

        var self=this;
        if (this.Timeout) clearTimeout(this.Timeout);   //清空定时器
        this.Timeout=setTimeout(function() {  self.ReqeustData();},this.AutoUpateTimeout*2);
    }

    this.RecvData=function(data,datatype,requestData)
    {
        var mapTagData;   //key=界面元素id, value=更新的股票列表
        
        switch(datatype)
        {
            case RECV_DATA_TYPE.BASE_DATA:
            case RECV_DATA_TYPE.INDEX_BASE_DATA:
                mapTagData=this.RecvBaseData(data,datatype);
                break;
            case RECV_DATA_TYPE.HEAT_DATA:
                mapTagData=this.RecvHeatData(data,datatype);
                break;
            case RECV_DATA_TYPE.SORT_DATA:
                mapTagData=this.RecvSortData(data,datatype,requestData);
                break;
            case RECV_DATA_TYPE.BUY_SELL_DATA:
                mapTagData=this.RecvBuySellData(data,datatype);
                break;
            case RECV_DATA_TYPE.DEAL_DATA:
                mapTagData=this.RecvDealData(data,datatype);
                break;
            case RECV_DATA_TYPE.DERIVATIVE_DATA:
                mapTagData=this.RecvDerivativeData(data,datatype);
                break;
            case RECV_DATA_TYPE.FINANCE_DATA:
                mapTagData=this.RecvFinanceData(data,datatype);
                break;
        }

        for(var value of mapTagData)
        {
            if (!this.MapTagCallback.has(value[0])) continue;

            this.MapTagCallback.get(value[0])(value[0],value[1],datatype,this);
        }

        var self=this;
        if (this.IsAutoUpdate)
        {
            if (this.Timeout) clearTimeout(this.Timeout);   //清空定时器
            //周日 周6 不更新， [9：15-3：30]以外的时间不更新
            var today=new Date();
            var time=today.getHours()*100+today.getMinutes();
            if (today.getDay()>0 && today.getDay()<6 && time>=915 && time<1530)
                this.Timeout=setTimeout(function() {  self.ReqeustData();},this.AutoUpateTimeout);
        }
    }


    this.RecvBaseData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.stock)
        {
            var item =data.stock[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;

            switch(datatype)
            {
                case RECV_DATA_TYPE.BASE_DATA:
                    stockData.SetBaseData(item);
                    break;
                case RECV_DATA_TYPE.INDEX_BASE_DATA:
                    stockData.SetIndexBaseData(item);
                    break;
                default:
                    continue;
            }

            if (stockData.TagID.size>0) 
            {
                for(var id of stockData.TagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvBuySellData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.stock)
        {
            var item =data.stock[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;

            stockData.SetBuySellData(item);

            if (stockData.TagID.size>0) 
            {
                for(var id of stockData.TagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }

            if (stockData.BuySellTagID.size>0)
            {
                for(var id of stockData.BuySellTagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvDerivativeData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.stock)
        {
            var item =data.stock[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;

            stockData.SetDerivativeData(item);

            if (stockData.DerivativeTagID.size>0) 
            {
                for(var id of stockData.DerivativeTagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvFinanceData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.stock)
        {
            var item =data.stock[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;

            stockData.SetFinanceData(item);

            if (stockData.FinanceTagID.size>0) 
            {
                for(var id of stockData.FinanceTagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvDealData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.stock)
        {
            var item =data.stock[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;

            stockData.SetDealData(item);

            if (stockData.DealTagID.size>0) 
            {
                for(var id of stockData.DealTagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvHeatData=function(data,datatype)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        for(var i in data.data)
        {
            var item = data.data[i];
            var stockData=this.MapStock.get(item.symbol);
            if (!stockData) continue;
            
            stockData.SetHeatData(item);

            if (stockData.HeatTagID.size>0) 
            {
                for(var id of stockData.HeatTagID)
                {
                    if (mapTagData.has(id)) 
                    {
                        mapTagData.get(id).push(stockData.Symbol);
                    }
                    else 
                    {
                        mapTagData.set(id, new Array(stockData.Symbol));
                    }
                }
            }
        }

        return mapTagData;
    }

    this.RecvSortData=function(data,datatype,sortItem)
    {
        var mapTagData=new Map();   //key=界面元素id, value=更新的股票列表
        var arySymbol=new Array();
        var stockData=this.MapStock.get(sortItem.Plate);

        for(var i in data.stock)
        {
            var item=data.stock[i];
            arySymbol.push(item.symbol);

            if (this.MapStock.has(item.symbol))
            {
                var itemData=this.MapStock.get(item.symbol);
                itemData.SetBaseData(item);
            }
            else
            {
                var itemData=new StockData(item.symbol);
                itemData.SetBaseData(item);
                this.MapStock.set(item.symbol,itemData);
            }
        }

        var key=sortItem.SortField.toString()+'-'+sortItem.Order.toString();
        if (!stockData.Sort.has(key)) return mapTagData;

        var sortData=stockData.Sort.get(key);
        sortData.arySymbol=arySymbol;

        for(var item of sortItem.TagID)
        {
            mapTagData.set(item,new Array([stockData.Symbol]));
        }

        return mapTagData;
    }



    
}

//股票搜索返回数据
function SearchStock(callback)
{
    this.SearchStockApiUrl=g_JSStockResource.Domain+"/API/StockSpell";
    this.UpdateUICallback=callback;
    this.PageSize=50;      //一页几个数据

    this.Count;             //一共的个数
    this.EndOffset;         //当前缓存数据的最后一个位移

    this.Data=new Array();
    this.Search="";
    this.SearchType=0;

    this.Search=function(input,type)
    {
        if (this.Search==input && this.SearchType==type)
        {

        }
        else
        {
            this.Search=input;
            this.SearchType=type;
            this.Count=0;
            this.EndOffset=0;
            this.Data=[];
            var end=this.PageSize-1;
            this.ReqeustSearchStock(this.Search,this.SearchType,this.EndOffset,end);
        }
    }

    this.IsEndPage=function()
    {
        if (this.Count<=0) return true;

        return this.EndOffset>this.Count-1;
    }

    this.NextPage=function()
    {
        if (this.EndOffset+1>this.Count) return;

        var end=this.EndOffset+this.PageSize;
        this.ReqeustSearchStock(this.Search,this.SearchType,this.EndOffset,end);
    }

    ///////////////////////////////////////////////////////////////////////
    //查询股票
    this.ReqeustSearchStock=function(input,type,start,end)
    {
        var self=this;

        $.ajax({
            url: this.SearchStockApiUrl,
            data:
            {
                "input":input,
                "start":start,
                "end":end
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvSearchStockData(data,RECV_DATA_TYPE.SEARCH_STOCK_DATA);
            },
            error:function(request)
            {
                self.RecvError(request,RECV_DATA_TYPE.SEARCH_STOCK_DATA);
            }
        });
         
    }

    this.RecvSearchStockData=function(data)
    {
        for(var i in data.stock)
        {
            var item=data.stock[i];
            this.Data.push({"Name":item.name,"Symbol":item.symbol,"Type":item.type});
        }

        if (data.count==0)
        {
            this.Count=0;
            this.EndOffset=0;
        }
        else
        {
            if (this.Count==0) this.Count=data.count;

            this.EndOffset=data.end;
            if (this.Count>0 && this.EndOffset>this.Count) this.EndOffset=this.Count-1;
        }

        if (typeof(this.UpdateUICallback)=='function') this.UpdateUICallback(this);

    }

    this.RecvError=function(request,type)
    {
        console.log("[SearchStock::RecvError] datatype="+ type.toString());
        console.log(request);

        if (typeof(this.UpdateUICallback)=='function') this.UpdateUICallback(this,"error");

    }
}

//数据基类
function IStockData() 
{
    this.IsAutoUpdate = true;           //是否自动更新
    this.AutoUpateTimeout = 5000;       //更新频率
    this.Timeout;   //定时器
    this.ApiUrl;
    this.Data;      //数据
    this.UpdateUICallback;             //回调函数

    this.RequestData = function () {

    }

    this.Stop = function () 
    {
        // console.log("[IStockData::Stop] stop update.")
        this.IsAutoUpdate = false;
        if (this.Timeout) clearTimeout(this.Timeout);   //清空定时器
    }

    this.AutoUpate = function () 
    {
        if (this.Timeout) clearTimeout(this.Timeout);   //清空定时器

        if (!this.IsAutoUpdate) return;

        //周日 周6 不更新， [9：30-3：30]以外的时间不更新
        var self = this;
        let today = new Date();
        let time = today.getHours() * 100 + today.getMinutes();
        if (today.getDay() > 0 && today.getDay() < 6 && time >= 930 && time < 1530)
            this.Timeout = setTimeout(function () {
                self.RequestData();
            }, this.AutoUpateTimeout);

    }
}

//短线精灵 只获取最新数据
function ShortTerm(symbol) 
{
    this.newMethod = IStockData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Symbol = symbol; //数组
    this.ApiUrl = g_JSStockResource.Domain + "/API/StockShortTerm";
    this.Count = 20;  //请求数据个数

    this.RequestData = function () 
    {
        var self = this;
        let data={count:this.Count};
        if (this.Symbol) data.symbol=this.Symbol;

        $.ajax({
            url: this.ApiUrl,
            data: data,
            type:"post",
            dataType: 'json',
            async:true,
            success: function (data) 
            {
                self.RecvData(data, RECV_DATA_TYPE.SHORT_TERM_DATA);
            },
            fail: function (request) 
            {
                self.RecvError(request, RECV_DATA_TYPE.SHORT_TERM_DATA);
            }
        });
    }

    this.RecvData = function (data, dataType) {

        this.Data = [];
        for (let i in data.shortterm) {
            let item = data.shortterm[i];
            this.Data.push({
                Date: item.date,
                Name: item.name,
                Symbol: item.symbol,
                Time: item.time,
                Content: item.content,
                TypeInfo: item.typeinfo,
                Type: item.type
            });
        }

        if (this.UpdateUICallback) this.UpdateUICallback(this);

        this.AutoUpate();
    }

    this.RecvError = function (request, dataType) {

    }
}
