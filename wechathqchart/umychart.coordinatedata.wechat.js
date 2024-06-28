/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    各个品种分钟走势图坐标信息
*/

import { ChartData } from "./umychart.data.wechat";

function GetLocalTime(i)    //得到标准时区的时间的函数
{
    if (typeof i !== 'number') return;
    var d = new Date();
    //得到1970年一月一日到现在的秒数
    var len = d.getTime();
    //本地时间与GMT时间的时间偏移差
    var offset = d.getTimezoneOffset() * 60000;
    //得到现在的格林尼治时间
    var utcTime = len + offset;
    return new Date(utcTime + 3600000 * i);
}

var MARKET_SUFFIX_NAME=
{
    SH:'.SH',
    SZ:'.SZ',
    SHSZ_C_Index:'.CI',     //自定义指数
    BJ:".BJ",               //北交所 BeiJing stock exchange

    SHO:'.SHO',          //上海交易所 股票期权
    SZO:".SZO",          //深证交易所 股票期权
    HK:'.HK',
    FHK: '.FHK',         //港股期货 
    SHFE: '.SHF',        //上期所 (Shanghai Futures Exchange)
    SHFE2: '.SHFE',       //上期所 (Shanghai Futures Exchange)
    CFFEX: '.CFE',       //中期所 (China Financial Futures Exchange)
    CFFEX2:'.CFFEX',     //中期所 (China Financial Futures Exchange)
    DCE: '.DCE',         //大连商品交易所(Dalian Commodity Exchange)
    CZCE: '.CZC',        //郑州期货交易所
    GZFE:".GZFE",        //广州期货交易所

    USA: '.USA',         //美股
    FTSE: '.FTSE',       //富时中国

    BIT: '.BIT',         //数字货币 如比特币
    BIZ: '.BIZ',         //数字货币

    FOREX:'.FOREX',      //外汇 (Foreign Exchange)

    NYMEX: '.NYMEX',      //纽约商品期货交易所(New York Mercantile Exchange)
    COMEX: ".COMEX",      //纽约商品期货交易所(New York Mercantile Exchange)
    NYBOT: ".NYBOT",      //美國紐約商品交易所
    CBOT: ".CBOT",        //芝商所
    LME:".LME",          //伦敦金属交易所
    TOCOM:".TOCOM",      //东京商品交易所（TOCOM）
    IPE:".IPE",          //美国洲际交易所 （ICE EUROPE）

    TW:".TW",            //台湾股票 9:00-13:30
    JP:".JP",            //日本股票 9:00-11:30, 12:30-15:00

    //越南股市
    HSX:".HSX",         //HSX胡志明交易所
    HNX:".HNX",         //HNX河內交易所
    UPCOM:".UPCOM",     //UPCOM未上市公司交易所

    ET: '.ET',           //其他未知的品种

    IsET: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.ET) > 0;
    },

    IsETShowAvPrice: function (upperSymbol)   //是否显示均价
    {
        return false;
    },

    IsHSX:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.HSX)>0;
    },

    IsHNX:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.HNX)>0;
    },

    IsUPCOM:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.UPCOM)>0;
    },

    IsNYMEX: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.NYMEX) > 0;
    },

    IsCOMEX: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.COMEX) > 0;
    },

    IsNYBOT: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.NYBOT) > 0;
    },

    IsCBOT: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.CBOT) > 0;
    },

    IsLME: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.LME) > 0;
    },

    IsTOCOM:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.TOCOM)>0;
    },

    IsIPE:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.IPE)>0;
    },

    IsForeignExchange(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.FOREX) > 0;
    },

    IsFTSE: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.FTSE) > 0;
    },

    IsFHK: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.FHK) > 0;
    },

    IsBIT: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        if (upperSymbol.indexOf(this.BIT) > 0) return true;
        if (upperSymbol.indexOf(this.BIZ) > 0) return true;
        return false;
    },

    IsUSA: function (upperSymbol) //是否是美股
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.USA) > 0;
    },

    IsSH: function (upperSymbol)
    {
        //需要精确匹配最后3位
        var pos = upperSymbol.length-this.SH.length;
        var find = upperSymbol.indexOf(this.SH);
        return find == pos;
    },

    IsSZ: function (upperSymbol)
    {
        var pos = upperSymbol.length - this.SZ.length;
        var find = upperSymbol.indexOf(this.SZ);
        return find == pos;
    },

    IsBJ:function(upperSymbol)
    {
        var pos = upperSymbol.length - this.BJ.length;
        var find = upperSymbol.indexOf(this.BJ);
        return find == pos;
    },

    //自定义指数
    IsSHSZCustomIndex:function(upperSymbol)
    {
        var pos = upperSymbol.length - this.SHSZ_C_Index.length;
        var find = upperSymbol.indexOf(this.SHSZ_C_Index);
        return find == pos;
    },

    IsSHO: function (upperSymbol) 
    {
        var pos = upperSymbol.length - this.SHO.length;
        var find = upperSymbol.indexOf(this.SHO);
        return find == pos;
    },

    IsSZO: function(upperSymbol)
    {
        var pos = upperSymbol.length - this.SZO.length;
        var find = upperSymbol.indexOf(this.SZO);
        return find == pos;
    },

    IsHK: function (upperSymbol)
    {
        var pos = upperSymbol.length - this.HK.length;
        var find = upperSymbol.indexOf(this.HK);
        return find == pos;
    },

    IsTW:function(upperSymbol)
    {
        var pos = upperSymbol.length - this.TW.length;
        var find = upperSymbol.indexOf(this.TW);
        return find == pos;
    },

    IsJP:function(upperSymbol)
    {
        var pos = upperSymbol.length - this.JP.length;
        var find = upperSymbol.indexOf(this.JP);
        return find == pos;
    },

    IsSHFE: function (upperSymbol)
    {
        if (!upperSymbol) return false;
        if (upperSymbol.indexOf(this.SHFE) > 0) return true;
        if (upperSymbol.indexOf(this.SHFE2) > 0) return true;
        return false;
    },
        
    IsCFFEX: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        if (upperSymbol.indexOf(this.CFFEX) > 0) return true;
        if (upperSymbol.indexOf(this.CFFEX2) > 0) return true;
        return false;
    },

    IsDCE: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.DCE) > 0;
    },

    IsCZCE: function (upperSymbol) 
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.CZCE) > 0;
    },

    IsGZFE:function(upperSymbol)
    {
        if (!upperSymbol) return false;
        return upperSymbol.indexOf(this.GZFE) > 0;
    },

    IsChinaFutures: function (upperSymbol)   //是否是国内期货
    {
        if (!upperSymbol) return false;

        return this.IsCFFEX(upperSymbol) || this.IsCZCE(upperSymbol) || this.IsDCE(upperSymbol) || this.IsSHFE(upperSymbol) || this.IsGZFE(upperSymbol) ;
    },

    IsFutures: function (upperSymbol) //是否是期货 包含国外的
    {
        if (!upperSymbol) return false;
        
        return this.IsChinaFutures(upperSymbol) ||
            this.IsNYMEX(upperSymbol) || this.IsCOMEX(upperSymbol) || this.IsNYBOT(upperSymbol) || this.IsCBOT(upperSymbol) ||
            this.IsLME(upperSymbol);
    },

    IsSHSZ: function (upperSymbol)            //是否是沪深的股票
    {
        return this.IsSZ(upperSymbol) || this.IsSH(upperSymbol) || this.IsSHSZCustomIndex(upperSymbol);
    },

    IsSHSZFund: function (upperSymbol)        //是否是交易所基金
    {
        if (!upperSymbol) return false;

        if (this.IsSH(upperSymbol)) //51XXXX.SH
        {
            if (upperSymbol.charAt(0) == '5' && upperSymbol.charAt(1) == '1') return true;
        }
        else if (this.IsSZ(upperSymbol)) //15XXXX.sz, 16XXXX.sz, 17XXXX.sz, 18XXXX.sz
        {
            if (upperSymbol.charAt(0) == '1' &&
                (upperSymbol.charAt(1) == '5' || upperSymbol.charAt(1) == '6' || upperSymbol.charAt(1) == '7' || upperSymbol.charAt(1) == '8')) return true;
        }

        return false;
    },

    IsSHSZIndex: function (symbol)     //是否是沪深指数代码
    {
        if (!symbol) return false;
        
        var upperSymbol = symbol.toUpperCase();
        if (this.IsSH(upperSymbol)) 
        {
            var temp = upperSymbol.replace('.SH', '');
            if (upperSymbol.charAt(0) == '0' && parseInt(temp) <= 3000) return true;

        }
        else if (this.IsSZ(upperSymbol)) 
        {
            if (upperSymbol.charAt(0) == '3' && upperSymbol.charAt(1) == '9') return true;
        }
        else if (this.IsSHSZCustomIndex(upperSymbol))  //自定义指数
        {
            return true;
        }

        return false;
    },

    IsSHSZStockA: function (symbol) //是否是沪深A股
    {
        if (!symbol) return false;
        var upperSymbol = symbol.toUpperCase();
        if (this.IsSH(upperSymbol)) 
        {
            var temp = upperSymbol.replace('.SH', '');
            if (upperSymbol.charAt(0) == '6') return true;
        }
        else if (this.IsSZ(upperSymbol)) 
        {
            if (upperSymbol.charAt(0) == '0') 
            {
                if (upperSymbol.charAt(1) == '0' && upperSymbol.charAt(2) == '2') return true;  //002 中小板
                if (upperSymbol.charAt(1) != '7' && upperSymbol.charAt(1) != '8') return true;
            }
            else if (upperSymbol.charAt(0)=='3')
            {
                if (upperSymbol.charAt(1)=='0')
                {
                    if (upperSymbol.charAt(2)=='0') return true;    //创业板 300XXX.sz
                    if (upperSymbol.charAt(2)=='1') return true;    //创业板 301XXX.sz
                }
            }
        }

        return false;
    },

    IsBJStock:function(symbol)  //北交所股票
    {
        if (!symbol) return false;
        var upperSymbol=symbol.toUpperCase();
        if (!this.IsBJ(upperSymbol)) return false;

        var value=upperSymbol.charAt(0);

        if (value=='4' || value=='8') return true;

        return false;
    },

    IsSHStockSTAR: function (symbol)   // 是否是科创板 Sci-Tech innovAtion boaRd (STAR Market)
    {
        if (!symbol) return false;
        var upperSymbol = symbol.toUpperCase();
        if (!this.IsSH(upperSymbol)) return false;
        if (upperSymbol.charAt(0) == '6' && upperSymbol.charAt(1) == '8' && upperSymbol.charAt(2) == '8')
            return true;

        return false;
    },

    GetMarketStatus: function (symbol)    //获取市场状态 0=闭市 1=盘前 2=盘中 3=盘后
    {
        if (!symbol) return 0;
        var upperSymbol = symbol.toUpperCase();
        var nowDate = new Date();
        var day = nowDate.getDay();
        var time = nowDate.getHours() * 100 + nowDate.getMinutes();

        if (this.IsUSA(upperSymbol)) 
        {
            var usaDate = GetLocalTime(-4);
            var day = usaDate.getDay();
            var time = usaDate.getHours() * 100 + usaDate.getMinutes();
            if (day == 6 || day == 0) return 0;   //周末

            //9:30 - 16:00 考虑夏令时间时间增加1小时 9:30 - 17:00
            if (time > 1730) return 3;
            if (time < 930) return 1;

            return 2;
        }
        else if (this.IsBIT(upperSymbol))   //数字货币24小时
        {
            return 2;
        }
        else if (this.IsForeignExchange(upperSymbol))   //外汇24小时
        {
            return 2;
        }
        else if (this.IsFTSE(upperSymbol))  //富时中国 9:00-16:30 17:00-04:45
        {
            if (day == 6 || day == 0) return 0;   //周末
            if (time >= 830 && time <= 2359) return 2;
            if (time >= 0 && time <= 500) return 2;
            return 0;
        }
        else if (this.IsFHK(upperSymbol))   //港股指数期货 9:15-12:00 13:00-16:30 17:15-01:00
        {
            if (day == 6 || day == 0) return 0;   //周末
            if (time >= 900 && time <= 2359) return 2;
            if (time >= 0 && time <= 120) return 2;
            return 0;
        }
        else if (this.IsET(upperSymbol)) 
        {
            return this.GetETMarketStatus(symbol);
        }
        else if (this.IsHK(upperSymbol))    //港股
        {
            if (day == 6 || day == 0) return 0;   //周末
            if (time > 1630) return 3;
            if (time < 925) return 1;
            return 2;
        }
        else if (this.IsTW(upperSymbol))    //台湾股票 上午9：00——下午1：30
        {
            if(day == 6 || day== 0) return 0;   //周末
            if(time>1410) return 3;
            if(time<820) return 1;
            return 2;   
        }
        else if (this.IsJP(upperSymbol))    //日本股票 9:00-11:30 12:30-15:00
        {
            if(day == 6 || day== 0) return 0;   //周末
            if(time>1520) return 3;
            if(time<830) return 1;
            return 2;
        }
        else if (this.IsNYMEX(upperSymbol)) 
        {
            return this.GetNYMEXMarketStatus(upperSymbol);
        }
        else if (this.IsCOMEX(upperSymbol))
        {
            return this.GetCOMEXMarketStatus(upperSymbol);
        }
        else if (this.IsNYBOT(upperSymbol))
        {
            return this.GetNYBOTMarketStatus(upperSymbol);
        }
        else if (this.IsCBOT(upperSymbol))
        {
            return this.GetCBOTMarketStatus(upperSymbol);
        }
        else if (this.IsChinaFutures(upperSymbol))  //国内期货
        {
            if(day == 6 || day== 0) return 0;   //周末

            //21:00-2:30
            if(time>=2100) return 2;
            if (time<=240) return 2;

            //8:55-11:30, 13:00-15:00
            if(time>=830 && time<=1510) return 2;

            return 1;
        }
        else    //9:30 - 15:40
        {
            if (day == 6 || day == 0) return 0;   //周末
            if (time > 1540) return 3;
            if (time < 925) return 1;
            return 2;
        }

    },

    GetDefaultDecimal:function(symbol)
    {
        return 2;
    },

    GetSHDecimal:function(symbol)
    {
        return 2;
    },

    GetSZDecimal:function(symbol)
    {
        return 2;
    },
    
    GetFHKDecimal: function (symbol)  //港股指数期货 小数位数
    {
        return 0;
    },

    GetFTSEDecimal: function (symbol) //富时中国A50期货 小数位数
    {
        return 0;
    },

    GetForeignExchangeDecimal:function(symbol)
    {
        return 4;
    },

    GetBITDecimal: function (symbol) 
    {
        return 2;
    },

    GetETDecimal: function (symbol) 
    {
        return 2;
    },

    GetHKDecimal:function(symbol)
    {
        return 2;
    },

    GetTWDecimal:function(symbol)
    {
        return 2;
    },

    GetJPDecimal:function(symbol)
    {
        return 2;
    },

    GetHSXDecimal:function(symbol)
    {
        return 2;
    },

    GetHNXDecimal:function(symbol)
    {
        return 2;
    },

    GetUPCOMDecimal:function(symbol)
    {
        return 2;
    },

    GetSHODecimal: function (symbol) 
    {
        return 4;
    },

    GetNYMEXDecimal: function (symbol)    //纽约期货交易所
    {
        return g_NYMEXTimeData.GetDecimal(symbol);
    },

    GetCOMEXDecimal:function(symbol)
    {
        return g_COMEXTimeData.GetDecimal(symbol);
    },

    GetNYBOTDecimal:function(symbol)
    {
        return g_NYBOTTimeData.GetDecimal(symbol);
    },

    GetCBOTDecimal:function(symbol)
    {
        return g_CBOTTimeData.GetDecimal(symbol);
    },

    GetLMEDecimal:function(symbol)
    {
        return g_LMETimeData.GetDecimal(symbol);
    },

    GetTOCOMDecimal:function(symbol)
    {
        return g_TOCOMTimeData.GetDecimal(symbol);
    },

    GetIPEDecimal:function(symbol)
    {
        return g_IPETimeData.GetDecimal(symbol);
    },

    GetETMarketStatus: function (symbol) 
    {
        // 0=闭市 1=盘前 2=盘中 3=盘后
        return 2;
    },

    GetCOMEXMarketStatus:function(symbol)
    {
        return g_COMEXTimeData.GetMarketStatus(symbol);
    },

    GetNYBOTMarketStatus:function(symbol)
    {
        return g_NYBOTTimeData.GetMarketStatus(symbol);
    },

    GetCBOTMarketStatus:function(symbol)
    {
        return g_CBOTTimeData.GetMarketStatus(symbol);
    },

    GetNYMEXMarketStatus: function (symbol) 
    {
        return g_NYMEXTimeData.GetMarketStatus(symbol);
    },

    GetLimitPriceRange:function(symbol, name) //涨停范围
    {
        if (!this.IsSHSZStockA(symbol)) return null;
        if (this.IsSHStockSTAR(symbol)) return {Max:0.2 , Min:-0.2};    //科创板 [20%- -20%]
        
        if (!name) return null;
        if (name.indexOf('ST')>=0) return { Max:0.05, Min:-0.05 }; //ST 股票 [5% - -5%]
        
        return {Max:0.1 , Min:-0.1}; //[10% - -10%]
    },

    IsEnableRight:function(period, symbol, rightFormula)    //是否支持复权
    {
        if (!MARKET_SUFFIX_NAME.IsSHSZStockA(symbol) && !MARKET_SUFFIX_NAME.IsBJStock(symbol)) return false;
        if (ChartData.IsNumber(rightFormula) && rightFormula>=1) return true;        //复权因子复权
        if (ChartData.IsMinutePeriod(period,true)) return false;                    //内置分钟K线不支持复权

        //内置日线线支持复权,其他不支持复权
        return false;
    }

}


//走势图分钟数据对应的时间
function MinuteTimeStringData() 
{
    this.SHSZ = null;       //上海深证交易所时间
    this.HK = null;         //香港交易所时间
    this.Futures=new Map(); //期货交易时间 key=时间名称 Value=数据
    this.USA = null;        //美股交易时间
    this.FTSE = null;         //富时中国
    this.FHK = null;          //港股指数期货
    this.BIT=null;          //数字货币
    this.TW=null;           //台湾股票
    this.JP=null;           //日本股票

    this.Initialize = function ()  //初始化 默认只初始化沪深的 其他市场动态生成
    {
        //this.SHSZ = this.CreateSHSZData();
        //this.HK = this.CreateHKData();
    }

    this.GetET = function (upperSymbol)   //当天所有的分钟
    {
        throw { Name: 'MinuteTimeStringData::GetET', Error: 'not implement' };
    }

    this.GetSHSZ=function(upperSymbol) //动态创建
    {
        if (!this.SHSZ) this.SHSZ=this.CreateSHSZData();
        return this.SHSZ;
    }

    this.GetBJ=function(upperSymbol)
    {
        if (!this.BJ) this.BJ=this.CreateBJData();
        return this.BJ;
    }

    this.GetSHO = function () 
    {
        if (!this.SHO) this.SHO = this.CreateSHOData();
        return this.SHO;
    }

    this.GetHK=function(upperSymbol)
    {
        if (!this.HK) this.HK = this.CreateHKData();
        return this.HK;
    }

    this.GetTW=function(upperSymbol)
    {
        if (this.TW) this.TW=this.CreateTWData();
        return this.TW;
    }

    this.GetJP=function(upperSymbol)
    {
        if (this.JP) this.JP=this.CreateJPData();
        return this.JP;
    }

    this.GetHSX=function(upperSymbol)
    {
        if (this.HSX) this.HSX=this.CreateHSXData();
        return this.HSX;
    }

    this.GetHNX=function(upperSymbol)
    {
        if (this.HNX) this.HSX=this.CreateHNXData();
        return this.HNX;
    }

    this.GetUPCOM=function(upperSymbol)
    {
        if (this.UPCOM) this.UPCOM=this.CreateUPCOMData();
        return this.UPCOM;
    }

    this.GetFutures=function(splitData)
    {
        if (!this.Futures.has(splitData.Name)) 
        {
            var data = this.CreateTimeData(splitData.Data);
            this.Futures.set(splitData.Name,data);
        }
        
        return this.Futures.get(splitData.Name);
    }

    this.GetUSA=function()
    {
        if (!this.USA) this.USA=this.CreateUSAData();
        return this.USA;
    }

    this.GetFTSE = function () 
    {
        if (!this.FTSE) this.FTSE = this.CreateFTSEData();
        return this.FTSE;
    }

    this.GetFHK = function () 
    {
        if (!this.FHK) this.FHK = this.CreateFHKData();
        return this.FHK;
    }

    this.GetBIT=function(upperSymbol)
    {
        if (!this.BIT) this.BIT=this.CreateBITData();
        return this.BIT;
    }

    this.GetForeignExchange=function()
    {
        if (!this.ForeEx) this.ForeEx=this.CreateForeignExchangeData();
        return this.ForeEx;
    }

    this.CreateSHSZData = function () 
    {
        const TIME_SPLIT =
            [
                { Start: 925, End: 925 },
                { Start: 930, End: 1130 },
                { Start: 1300, End: 1500 }
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateSHOData = function () 
    {
        const TIME_SPLIT =
            [
                { Start: 930, End: 1129 },
                { Start: 1300, End: 1500 }
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateHKData = function () 
    {
        const TIME_SPLIT =
            [
                { Start: 930, End: 1200 },
                { Start: 1300, End: 1600 }
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateTWData=function()
    {
        const TIME_SPLIT =
            [
                { Start: 900, End: 1330 }
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateJPData=function()
    {
        const TIME_SPLIT =
        [
            { Start: 900, End: 1130 },
            { Start: 1230, End: 1500 }
        ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateHSXData=function()
    {
        throw {Name:'MinuteTimeStringData::CreateHSXData', Error:'not implement'};
    }

    this.CreateHNXData=function()
    {
        throw {Name:'MinuteTimeStringData::CreateHNXData', Error:'not implement'};
    }

    this.CreateUPCOMData=function()
    {
        throw {Name:'MinuteTimeStringData::CreateUPCOMData', Error:'not implement'};
    }

    this.CreateUSAData=function()
    {
        //美国夏令时
        const TIME_SUMMER_SPLIT =
            [
                { Start: 2130, End: 2359 },
                { Start: 0, End: 400 }
            ];
            
        //非夏令时
        const TIME_SPLIT =
            [
                { Start: 2230, End: 2359 },
                { Start: 0, End: 500 }
            ];

        //使用美国本地时间
        const TIME_LOCAL_SPLIT =
            [
                { Start: 930, End: 1600 }   //美国东部时间9:30到16:00
            ];

        return this.CreateTimeData(TIME_LOCAL_SPLIT); 
    }

    this.CreateFTSEData = function () 
    {
        const TIME_SPLIT =
            [
                { Start: 1700, End: 2359 },
                { Start: 0, End: 445 },
                { Start: 900, End: 1630 }
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateFHKData = function () 
    {
        //港股指数期货 9:15-12:00 13:00-16:30 17:15-01:00
        const TIME_SPLIT =
            [
                { Start: 1715, End: 2359 },
                { Start: 0, End: 100 },
                { Start: 915, End: 1200 },
                { Start: 1300, End: 1630 },
            ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateForeignExchangeData=function()
    {
         //外汇 7:00 - 6:59
         const TIME_SPLIT=           
         [
             { Start:600, End:2359 },
             { Start:0,  End:559 },
         ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateBITData=function()
    {
        //数字货币 7:00 - 6:59
        const TIME_SPLIT=           
        [
            { Start:600, End:2359 },
            { Start:0,  End:559 },
        ];

        return this.CreateTimeData(TIME_SPLIT);
    }

    this.CreateTimeData = function (timeSplit) 
    {
        var data = [];
        for (var i in timeSplit) 
        {
            var item = timeSplit[i];
            for (var j = item.Start; j <= item.End; ++j) 
            {
                if (j % 100 >= 60) continue;    //大于60分钟的数据去掉
                data.push(j);
            }
        }
        return data;
    }

    this.GetTimeData = function (symbol) 
    {
        if (!symbol) return this.SHSZ;

        var upperSymbol = symbol.toLocaleUpperCase(); //转成大写
        if (MARKET_SUFFIX_NAME.IsSH(upperSymbol) || MARKET_SUFFIX_NAME.IsSZ(upperSymbol) || MARKET_SUFFIX_NAME.IsSHSZIndex(upperSymbol)) return this.GetSHSZ(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsBJ(upperSymbol)) return this.GetBJ(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsSHO(upperSymbol) || MARKET_SUFFIX_NAME.IsSZO(upperSymbol)) return this.GetSHO();
        if (MARKET_SUFFIX_NAME.IsHK(upperSymbol)) return this.GetHK(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsTW(upperSymbol)) return this.GetTW(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsJP(upperSymbol)) return this.GetJP(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsUSA(upperSymbol)) return this.GetUSA(true);
        if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol) || MARKET_SUFFIX_NAME.IsCZCE(upperSymbol) || MARKET_SUFFIX_NAME.IsDCE(upperSymbol) || MARKET_SUFFIX_NAME.IsSHFE(upperSymbol) || MARKET_SUFFIX_NAME.IsGZFE(upperSymbol))
        {
            var splitData = g_FuturesTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }
        if (MARKET_SUFFIX_NAME.IsForeignExchange(upperSymbol)) return this.GetForeignExchange();
        if (MARKET_SUFFIX_NAME.IsFTSE(upperSymbol)) return this.GetFTSE();
        if (MARKET_SUFFIX_NAME.IsFHK(upperSymbol)) return this.GetFHK();
        if (MARKET_SUFFIX_NAME.IsET(upperSymbol)) return this.GetET(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsBIT(upperSymbol)) return this.GetBIT(upperSymbol);

        //越南股市
        if (MARKET_SUFFIX_NAME.IsHSX(upperSymbol)) return this.GetHSX(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsHNX(upperSymbol)) return this.GetHNX(upperSymbol);
        if (MARKET_SUFFIX_NAME.IsUPCOM(upperSymbol)) return this.GetUPCOM(upperSymbol);

        if (MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol))    //纽约期货交易所
        {
            var splitData = g_NYMEXTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsCOMEX(upperSymbol))    //纽约期货交易所
        {
            var splitData = g_COMEXTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsNYBOT(upperSymbol))    //纽约期货交易所
        {
            var splitData = g_NYBOTTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsCBOT(upperSymbol))    //芝商所
        {
            var splitData = g_CBOTTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsLME(upperSymbol))    //伦敦LME
        {
            var splitData = g_LMETimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsTOCOM(upperSymbol))    //东京商品交易所（TOCOM）
        {
            var splitData = g_TOCOMTimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }

        if (MARKET_SUFFIX_NAME.IsIPE(upperSymbol))    //东京商品交易所（TOCOM）
        {
            var splitData = g_IPETimeData.GetSplitData(upperSymbol);
            if (!splitData) return null;
            return this.GetFutures(splitData);
        }
    }
}

//走势图刻度分钟线
function MinuteCoordinateData() 
{
    //沪深走势图时间刻度
    const SHZE_MINUTE_X_COORDINATE =
        {
            Full:   //完整模式
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [31, 0, "RGB(200,200,200)", "10:00"],
                [61, 0, "RGB(200,200,200)", "10:30"],
                [91, 0, "RGB(200,200,200)", "11:00"],
                [122, 1, "RGB(200,200,200)", "13:00"],
                [152, 0, "RGB(200,200,200)", "13:30"],
                [182, 0, "RGB(200,200,200)", "14:00"],
                [212, 0, "RGB(200,200,200)", "14:30"],
                [242, 1, "RGB(200,200,200)", "15:00"], // 15:00
            ],
            Simple: //简洁模式
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [61, 0, "RGB(200,200,200)", "10:30"],
                [122, 1, "RGB(200,200,200)", "13:00"],
                [182, 0, "RGB(200,200,200)", "14:00"],
                [242, 1, "RGB(200,200,200)", "15:00"]
            ],
            Min:   //最小模式     
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [122, 1, "RGB(200,200,200)", "13:00"],
                [242, 1, "RGB(200,200,200)", "15:00"]
            ],

            Count: 243,
            MiddleCount: 122,

            GetData: function (width) 
            {
                if (width < 200) return this.Min;
                else if (width < 400) return this.Simple;

                return this.Full;
            }
        };

    //上海股票期权时间刻度
    const SHO_MINUTE_X_COORDINATE =
    {
        Full:   //完整模式
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [30, 0, "RGB(200,200,200)", "10:00"],
                [60, 0, "RGB(200,200,200)", "10:30"],
                [90, 0, "RGB(200,200,200)", "11:00"],
                [120, 1, "RGB(200,200,200)", "13:00"],
                [150, 0, "RGB(200,200,200)", "13:30"],
                [180, 0, "RGB(200,200,200)", "14:00"],
                [210, 0, "RGB(200,200,200)", "14:30"],
                [240, 1, "RGB(200,200,200)", "15:00"], // 15:00
            ],
        Simple: //简洁模式
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [60, 0, "RGB(200,200,200)", "10:30"],
                [120, 1, "RGB(200,200,200)", "13:00"],
                [180, 0, "RGB(200,200,200)", "14:00"],
                [240, 1, "RGB(200,200,200)", "15:00"]
            ],
        Min:   //最小模式     
            [
                [0, 0, "rgb(200,200,200)", "09:30"],
                [120, 1, "RGB(200,200,200)", "13:00"],
                [240, 1, "RGB(200,200,200)", "15:00"]
            ],

        Count: 241,
        MiddleCount: 120,

        GetData: function (width) {
            if (width < 200) return this.Min;
            else if (width < 400) return this.Simple;

            return this.Full;
        }
    };

    //港股走势图时间刻度
    const HK_MINUTE_X_COORDINATE =
    {
        Full:   //完整模式
        [
            [0, 1, "RGB(200,200,200)", "09:30"],
            [30, 0, "RGB(200,200,200)", "10:00"],
            [60, 1, "RGB(200,200,200)", "10:30"],
            [90, 0, "RGB(200,200,200)", "11:00"],
            [120, 1, "RGB(200,200,200)", "11:30"],
            [151, 0, "RGB(200,200,200)", "13:00"],
            [181, 1, "RGB(200,200,200)", "13:30"],
            [211, 0, "RGB(200,200,200)", "14:00"],
            [241, 1, "RGB(200,200,200)", "14:30"],
            [271, 0, "RGB(200,200,200)", "15:00"],
            [301, 1, "RGB(200,200,200)", "15:30"],
            [331, 1, "RGB(200,200,200)", "16:00"]
        ],
        Simple: //简洁模式
        [
            [0, 1, "RGB(200,200,200)", "09:30"],
            [60, 1, "RGB(200,200,200)", "10:30"],
            [120, 1, "RGB(200,200,200)", "11:30"],
            [211, 0, "RGB(200,200,200)", "14:00"],
            [271, 0, "RGB(200,200,200)", "15:00"],
            [331, 1, "RGB(200,200,200)", "16:00"]
        ],
        Min:   //最小模式     
        [
            [0, 1, "RGB(200,200,200)", "09:30"],
            [151, 0, "RGB(200,200,200)", "13:00"],
            [331, 1, "RGB(200,200,200)", "16:00"]
        ],

        Count: 332,
        MiddleCount: 151,

        GetData: function (width) 
        {
            if (width < 200) return this.Min;
            else if (width < 450) return this.Simple;

            return this.Full;
        }
    };

    //美股走势图时间刻度
    const USA_MINUTE_X_COORDINATE =
    {
        /*
        Full:   //完整模式
        [
            [0, 0, "rgb(200,200,200)", "21:30"],
            [60, 0, "RGB(200,200,200)", "22:30"],
            [120, 1, "RGB(200,200,200)", "23:30"],
            [210, 0, "RGB(200,200,200)", "01:00"],
            [270, 0, "RGB(200,200,200)", "02:00"],
            [330, 0, "RGB(200,200,200)", "03:00"],
            [390, 0, "RGB(200,200,200)", "04:00"],
        ],
        Simple: //简洁模式
        [
            [0, 0, "rgb(200,200,200)", "21:30"],
            [160, 1, "RGB(200,200,200)", "00:00"],
            [270, 0, "RGB(200,200,200)", "02:00"],
            [390, 0, "RGB(200,200,200)", "04:00"],
        ],
        Min:   //最小模式     
        [
            [0, 0, "rgb(200,200,200)", "21:30"],
            [160, 1, "RGB(200,200,200)", "00:00"],
            [390, 0, "RGB(200,200,200)", "04:00"],
        ],
        */

        //美国本地时间
        Full:   //完整模式
        [
            [0, 0, "rgb(200,200,200)", "9:30"],
            [30, 0, "RGB(200,200,200)", "10:00"],
            [90, 1, "RGB(200,200,200)", "11:00"],
            [150, 0, "RGB(200,200,200)", "12:00"],
            [210, 0, "RGB(200,200,200)", "13:00"],
            [270, 0, "RGB(200,200,200)", "14:00"],
            [330, 0, "RGB(200,200,200)", "15:00"],
            [390, 0, "RGB(200,200,200)", "16:00"],
        ],
        Simple: //简洁模式
        [
            [30, 0, "rgb(200,200,200)", "10:00"],
            [150, 1, "RGB(200,200,200)", "12:00"],
            [270, 0, "RGB(200,200,200)", "14:00"],
            [390, 0, "RGB(200,200,200)", "16:00"],
        ],
        Min:   //最小模式     
        [
            [30, 0, "rgb(200,200,200)", "10:00"],
            [210, 1, "RGB(200,200,200)", "13:00"],
            [390, 0, "RGB(200,200,200)", "16:00"],
        ],

        Count: 391,
        MiddleCount: 211,

        GetData: function (width) 
        {
            if (width < 200) return this.Min;
            else if (width < 400) return this.Simple;

            return this.Full;
        }
    };

    //富时中国
    const FTSE_MINUTE_X_COORDINATE =
    {
        Full:   //完整模式
            [
                [0, 1, "RGB(200,200,200)", "17:00"],
                //[60, 0, "RGB(200,200,200)", "18:00"],
                [120, 1, "RGB(200,200,200)", "19:00"],
                //[180, 0, "RGB(200,200,200)", "20:00"],
                [240, 1, "RGB(200,200,200)", "21:00"],
                //[300, 0, "RGB(200,200,200)", "22:00"],
                [360, 1, "RGB(200,200,200)", "23:00"],
                //[420, 0, "RGB(200,200,200)", "00:00"],
                [480, 1, "RGB(200,200,200)", "01:00"],
                //[540, 0, "RGB(200,200,200)", "02:00"],
                [600, 1, "RGB(200,200,200)", "03:00"],
                //[660, 1, "RGB(200,200,200)", "04:00"],
                [706, 1, "RGB(200,200,200)", "09:00"],
                //[766, 1, "RGB(200,200,200)", "10:00"],
                [826, 1, "RGB(200,200,200)", "11:00"],
                //[886, 1, "RGB(200,200,200)", "12:00"],
                [946, 1, "RGB(200,200,200)", "13:00"],
                //[1006, 1, "RGB(200,200,200)", "14:00"],
                [1066, 1, "RGB(200,200,200)", "15:00"],
                [1156, 1, "RGB(200,200,200)", "16:30"],
            ],
        Simple: //简洁模式
            [
                [0, 1, "RGB(200,200,200)", "17:00"],
                //[60, 0, "RGB(200,200,200)", "18:00"],
                //[120, 1, "RGB(200,200,200)", "19:00"],
                //[180, 0, "RGB(200,200,200)", "20:00"],
                [240, 1, "RGB(200,200,200)", "21:00"],
                //[300, 0, "RGB(200,200,200)", "22:00"],
                //[360, 1, "RGB(200,200,200)", "23:30"],
                //[420, 0, "RGB(200,200,200)", "00:00"],
                [480, 1, "RGB(200,200,200)", "01:00"],
                //[540, 0, "RGB(200,200,200)", "02:00"],
                //[600, 1, "RGB(200,200,200)", "03:00"],
                //[660, 1, "RGB(200,200,200)", "04:00"],
                [706, 1, "RGB(200,200,200)", "09:00"],
                //[766, 1, "RGB(200,200,200)", "10:00"],
                //[826, 1, "RGB(200,200,200)", "11:00"],
                //[886, 1, "RGB(200,200,200)", "12:00"],
                [946, 1, "RGB(200,200,200)", "13:00"],
                //[1006, 1, "RGB(200,200,200)", "14:00"],
                //[1066, 1, "RGB(200,200,200)", "15:00"],
                [1156, 1, "RGB(200,200,200)", "16:30"],
            ],
        Min:   //最小模式     
            [
                [0, 1, "RGB(200,200,200)", "17:00"],
                [706, 1, "RGB(200,200,200)", "09:00"],
                [1156, 1, "RGB(200,200,200)", "16:30"],
            ],

        Count: 1157,
        MiddleCount: 707,

        GetData: function (width) {
            if (width < 200) return this.Min;
            else if (width < 450) return this.Simple;

            return this.Full;
        }
    };

    //港股指数期货
    const FHK_MINUTE_X_COORDINATE =
    {
        Full:   //完整模式
            [
                [0, 1, "RGB(200,200,200)", "17:15"],
                //[45, 0, "RGB(200,200,200)", "18:00"],
                [105, 1, "RGB(200,200,200)", "19:00"],
                //[165, 0, "RGB(200,200,200)", "20:00"],
                [225, 1, "RGB(200,200,200)", "21:00"],
                //[285, 0, "RGB(200,200,200)", "22:00"],
                [345, 1, "RGB(200,200,200)", "23:00"],
                //[405, 0, "RGB(200,200,200)", "00:00"],
                [466, 0, "RGB(200,200,200)", "09:15"],
                //[511, 1, "RGB(200,200,200)", "10:00"],
                [571, 1, "RGB(200,200,200)", "11:00"],
                //[632, 1, "RGB(200,200,200)", "13:00"],
                [692, 1, "RGB(200,200,200)", "14:00"],
                //[752, 1, "RGB(200,200,200)", "15:00"],
                [843, 1, "RGB(200,200,200)", "16:30"],
            ],
        Simple: //简洁模式
            [
                [0, 1, "RGB(200,200,200)", "17:15"],
                //[45, 0, "RGB(200,200,200)", "18:00"],
                //[105, 1, "RGB(200,200,200)", "19:00"],
                //[165, 0, "RGB(200,200,200)", "20:00"],
                [225, 1, "RGB(200,200,200)", "21:00"],
                //[285, 0, "RGB(200,200,200)", "22:00"],
                //[345, 1, "RGB(200,200,200)", "23:00"],
                //[405, 0, "RGB(200,200,200)", "00:00"],
                [466, 0, "RGB(200,200,200)", "09:15"],
                //[511, 1, "RGB(200,200,200)", "10:00"],
                //[571, 1, "RGB(200,200,200)", "11:00"],
                [632, 1, "RGB(200,200,200)", "13:00"],
                //[692, 1, "RGB(200,200,200)", "14:00"],
                //[752, 1, "RGB(200,200,200)", "15:00"],
                [843, 1, "RGB(200,200,200)", "16:30"],
            ],
        Min:   //最小模式     
            [
                [0, 1, "RGB(200,200,200)", "17:15"],
                [466, 0, "RGB(200,200,200)", "09:15"],
                [843, 1, "RGB(200,200,200)", "16:30"],
            ],

        Count: 843,
        MiddleCount: 466,

        GetData: function (width) {
            if (width < 200) return this.Min;
            else if (width < 450) return this.Simple;

            return this.Full;
        }
    };

    //外汇
    const FOREX_MINUTE_X_COORDINATE=
    {
        Full:   //完整模式
        [
            [0, 1, "RGB(200,200,200)", "06:00"],
            [120, 1, "RGB(200,200,200)", "08:00"],
            [240, 1, "RGB(200,200,200)", "10:00"],
            [360, 1, "RGB(200,200,200)", "12:00"],
            [480, 0, "RGB(200,200,200)", "14:00"],
            [600, 1, "RGB(200,200,200)", "16:00"],
            [720, 1, "RGB(200,200,200)", "18:00"],
            [840, 1, "RGB(200,200,200)", "20:00"],
            [960, 1, "RGB(200,200,200)", "22:00"],
            [1080, 1, "RGB(200,200,200)", "0:00"],
            [1200, 1, "RGB(200,200,200)", "02:00"],
            [1320, 1, "RGB(200,200,200)", "04:00"],
        ],
        Simple: //简洁模式
        [
            [0, 1, "RGB(200,200,200)", "06:00"],
            [240, 1, "RGB(200,200,200)", "10:00"],
            [480, 0, "RGB(200,200,200)", "14:00"],
            [720, 1, "RGB(200,200,200)", "18:00"],
            [960, 1, "RGB(200,200,200)", "22:00"],
            [1200, 1, "RGB(200,200,200)", "02:00"],
        ],
        Min:   //最小模式     
        [
            [0, 1, "RGB(200,200,200)", "06:00"],
            [480, 0, "RGB(200,200,200)", "14:00"],
            [960, 1, "RGB(200,200,200)", "22:00"],
        ],

        Count: 1440,
        MiddleCount: 600,

        GetData: function (width) 
        {
            if (width < 200) return this.Min;
            else if (width < 450) return this.Simple;

            return this.Full;
        }
    }

    //台湾股票
    const TW_MINUTE_X_COORDINATE=
    {
        Full:   //完整模式
        [
            [0, 1, "RGB(200,200,200)", "09:00"],
            [30, 0, "RGB(200,200,200)", "09:30"],
            [60, 1, "RGB(200,200,200)", "10:00"],
            [90, 0, "RGB(200,200,200)", "10:30"],
            [120, 1, "RGB(200,200,200)", "11:00"],
            [150, 0, "RGB(200,200,200)", "11:30"],
            [180, 1, "RGB(200,200,200)", "12:00"],
            [210, 0, "RGB(200,200,200)", "12:30"],
            [240, 1, "RGB(200,200,200)", "13:00"],
            [270, 0, "RGB(200,200,200)", "13:30"],
        ],
        Simple: //简洁模式
        [
            [0, 1, "RGB(200,200,200)", "09:00"],
            [60, 1, "RGB(200,200,200)", "10:00"],
            [120, 1, "RGB(200,200,200)", "11:00"],
            [180, 1, "RGB(200,200,200)", "12:00"],
            [270, 0, "RGB(200,200,200)", "13:30"],
        ],
        Min:   //最小模式     
        [
            [0, 1, "RGB(200,200,200)", "09:00"],
            [60, 1, "RGB(200,200,200)", "11:00"],
            [270, 0, "RGB(200,200,200)", "13:30"],
        ],

        Count: 271,
        MiddleCount: 151,

        GetData: function (width) 
        {
            if (width < 200) return this.Min;
            else if (width < 450) return this.Simple;

            return this.Full;
        }
    }

    this.GetCoordinateData = function (symbol, width) 
    {
        var data = null;
        if (!symbol) 
        {
            data = SHZE_MINUTE_X_COORDINATE;    //默认沪深股票
        }
        else 
        {
            var upperSymbol = symbol.toLocaleUpperCase(); //转成大写
            if (MARKET_SUFFIX_NAME.IsSH(upperSymbol) || MARKET_SUFFIX_NAME.IsSZ(upperSymbol))
                data = this.GetSHSZData(upperSymbol, width); 
            else if (MARKET_SUFFIX_NAME.IsBJ(upperSymbol))
                data=this.GetBJData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsSHO(upperSymbol) || MARKET_SUFFIX_NAME.IsSZO(upperSymbol))
                data = this.GetSHOData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsHK(upperSymbol))
                data=this.GetHKData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsTW(upperSymbol))
                data=this.GetTWData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsJP(upperSymbol))
                data=this.GetJPData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol) || MARKET_SUFFIX_NAME.IsCZCE(upperSymbol) || MARKET_SUFFIX_NAME.IsDCE(upperSymbol) || MARKET_SUFFIX_NAME.IsSHFE(upperSymbol) || MARKET_SUFFIX_NAME.IsGZFE(upperSymbol))
                return this.GetChinatFuturesData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsUSA(upperSymbol))
                data = this.GetUSAData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsFTSE(upperSymbol, width))
                data = this.GetFTSEData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsFHK(upperSymbol, width))
                data = this.GetFHKData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsForeignExchange(upperSymbol))
                data=this.GetForeignExchangeData(upperSymbol);
            else if (MARKET_SUFFIX_NAME.IsET(upperSymbol))
                data = this.GetETData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol, width))
                return data = this.GetNYMEXData(upperSymbol, width);
            else if (MARKET_SUFFIX_NAME.IsCOMEX(upperSymbol,width))
                return  data=this.GetCOMEXData(upperSymbol,width);
             else if (MARKET_SUFFIX_NAME.IsNYBOT(upperSymbol,width))
                return  data=this.GetNYBOTData(upperSymbol,width);
             else if (MARKET_SUFFIX_NAME.IsCBOT(upperSymbol,width))
                return  data=this.GetCBOTData(upperSymbol,width);
             else if (MARKET_SUFFIX_NAME.IsLME(upperSymbol,width))
                return  data=this.GetLMEData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsTOCOM(upperSymbol))
                return  data=this.GetTOCOMData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsIPE(upperSymbol))
                return  data=this.GetIPEData(upperSymbol,width);
            else if ((MARKET_SUFFIX_NAME.IsBIT(upperSymbol,width)))
                data=this.GetBITData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsHSX(upperSymbol))
                return  data=this.GetHSXData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsHNX(upperSymbol))
                return  data=this.GetHNXData(upperSymbol,width);
            else if (MARKET_SUFFIX_NAME.IsUPCOM(upperSymbol))
                return  data=this.GetUPCOMData(upperSymbol,width);
        }

        //console.log('[MiuteCoordinateData]', width);
        var result = { Count: data.Count, MiddleCount: data.MiddleCount, Data: data.GetData(width) };
        return result;
    }

    this.GetSHSZData = function (upperSymbol, width) 
    {
        var result = SHZE_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetBJData=function(upperSymbol,width)
    {
        var result=SHZE_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetUSAData=function(upperSymbol,width)
    {
        var result=USA_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetHKData=function(upperSymbol,width)
    {
        var result=HK_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetTWData=function(upperSymbol,width)
    {
        return TW_MINUTE_X_COORDINATE;
    }

    this.GetFuturesData = function (upperSymbol,width,timeData)
    {
        var splitData = timeData.GetSplitData(upperSymbol);
        if (!splitData) return null;
        var stringData = g_MinuteTimeStringData.GetFutures(splitData);
        if (!stringData) return null;
        var result = { Count: stringData.length };
        var coordinate=null;
        var minWidth=200, simpleWidth=480;
        /*
        if (splitData.Name =='21:00-1:00,9:00-10:15,10:30-11:30,13:30-15:00')
        {
            minWidth=250;
            simpleWidth=500;
        }
        */
        
        if (width < minWidth) coordinate = splitData.Coordinate.Min;
        else if (width < simpleWidth) coordinate = splitData.Coordinate.Simple;
        else coordinate = splitData.Coordinate.Full;
        
        var data=[];
        for(var i=0;i<stringData.length;++i)
        {
            var value = stringData[i];
            for(var j=0;j<coordinate.length;++j)
            {
                var coordinateItem = coordinate[j];
                if (value == coordinateItem.Value)
                {
                    var item = [i, 0, 'RGB(200,200,200)', coordinateItem.Text];
                    data.push(item);
                    break;
                }
            }
        }

        result.Data = data;
        return result;
    }

    this.GetChinatFuturesData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_FuturesTimeData);
    }

    this.GetNYMEXData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_NYMEXTimeData);
    }

    this.GetCOMEXData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_COMEXTimeData);
    }

    this.GetNYBOTData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_NYBOTTimeData);
    }

    this.GetCBOTData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_CBOTTimeData);
    }

    this.GetLMEData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_LMETimeData);
    }

    this.GetTOCOMData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_TOCOMTimeData);
    }

    this.GetIPEData=function(upperSymbol,width)
    {
        return this.GetFuturesData(upperSymbol,width, g_IPETimeData);
    }

    this.GetFTSEData = function (upperSymbol, width) 
    {
        var result = FTSE_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetFHKData = function (upperSymbol, width) 
    {
        var result = FHK_MINUTE_X_COORDINATE;
        return result
    }

    this.GetForeignExchangeData=function(upperSymbol,width)
    {
        var result=FOREX_MINUTE_X_COORDINATE;  
        return result;
    }

    this.GetETData = function (upperSymbol, width) 
    {
        throw { Name: 'MinuteCoordinateData::GetETData', Error: 'not implement' };
    }

    this.GetBITData=function(upperSymbol,width)
    {
        throw { Name: 'MinuteCoordinateData::GetBITData', Error: 'not implement' };
    }

    this.GetSHOData = function (upperSymbol, width) 
    {
        var result = SHO_MINUTE_X_COORDINATE;
        return result;
    }

    this.GetJPData=function(upperSymbol,width)
    {
        throw {Name:'MinuteCoordinateData::GetJPData', Error:'not implement'};
    }

    this.GetHSXData=function(upperSymbol,width)
    {
        throw {Name:'MinuteCoordinateData::GetHSXData', Error:'not implement'};
    }

    this.GetHNXData=function(upperSymbol,width)
    {
        throw {Name:'MinuteCoordinateData::GetHNXData', Error:'not implement'};
    }

    this.GetUPCOMData=function(upperSymbol,width)
    {
        throw {Name:'MinuteCoordinateData::GetUPCOMData', Error:'not implement'};
    }
}


//期货不同品种 交易时间数据 
function FuturesTimeData()
{
    this.TIME_SPLIT=
    [
        //ID=0 9:00-10:15,10:31-11:30,13:31-15:00
        {
            Name:'9:00-10:15,10:31-11:30,13:31-15:00',
            Data:
            [
                //9:00-10:15,10:30-11:30,13:30-15:00
                { Start: 900, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 930, Text: '9:30' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },
        //ID=1 9:30-11:30,13:01-15:15
        {

            Name:'9:30-11:30,13:01-15:15',
            Data:
            [
                { Start: 930, End: 1130 },
                { Start: 1301, End: 1515 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1515, Text: '15:15' },
                ],
                Simple: //简洁模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1515, Text: '15:15' },
                ],
                Min:   //最小模式  
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1515, Text: '15:15' },
                ]
            }
        },
        //ID=2 '9:30-11:30,13:01-15:00'
        {
            Name:'9:30-11:30,13:00-15:00',
            Data:
            [
                { Start: 930, End: 1130 },
                { Start: 1301, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },
        {
            Name:'21:00-23:30,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [
                { Start: 2100, End: 2330 },
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1031, Text: '10:30' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },

        //ID=4 21:00-1:00,9:01-10:15,10:31-11:30,13:31-15:00
        {
            Name:'21:00-1:00,9:01-10:15,10:31-11:30,13:31-15:00',
            Data:
            [   
                { Start: 2100, End: 2359 },
                { Start: 0, End: 100 },
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1031, Text: '10:30' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1031, Text: '10:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },

        //ID=5 21:00-2:30,9:01-10:15,10:31-11:30,13:31-15:00
        {
            Name:'21:00-2:30,9:01-10:15,10:31-11:30,13:31-15:00',
            Data:
            [
                { Start: 2100, End: 2359 },
                { Start: 0, End: 230 },
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1031, Text: '10:30' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },

        //ID:6 21:00-23:00,9:01-10:15,10:30-11:30,13:31-15:00
        {
            Name:'21:00-23:00,9:01-10:15,10:30-11:30,13:31-15:00',
            Data:
            [
                { Start: 2100, End: 2300 },
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },
        {

            Name:'9:00-11:30,13:00-15:00',
            Data:
            [
                { Start: 900, End: 1130 },
                { Start: 1300, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },
        {
            Name:'21:00-23:00,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [
                { Start: 2100, End: 2300 },
                { Start: 900, End: 1015 },
                { Start: 1030, End: 1130 },
                { Start: 1330, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },

        //ID=9 9:01-10:15,10:31-11:30,13:31-15:00
        {
            Name:'9:01-10:15,10:31-11:30,13:31-15:00',
            Data:
            [
                //9:01-10:15,10:31-11:30,13:31-15:00
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1331, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 901, Text: '9:00' },
                    { Value: 930, Text: '9:30' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 901, Text: '9:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 901, Text: '9:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        }
    ];

    this.MAP_TWOWORDS = new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-JD', {Time:0,Decimal:0,Name:"鸡蛋"}],
        [MARKET_SUFFIX_NAME.DCE + '-FB', {Time:0,Decimal:2,Name:"纤板"}],
        [MARKET_SUFFIX_NAME.DCE + '-BB', {Time:0,Decimal:2,Name:"胶板"}],
        [MARKET_SUFFIX_NAME.DCE + '-PP', {Time:6,Decimal:0,Name:"丙烯"}],
        [MARKET_SUFFIX_NAME.DCE + '-JM', {Time:6,Decimal:1,Name:'焦煤'}],
        [MARKET_SUFFIX_NAME.DCE + '-EG', {Time:6,Decimal:0,Name:'乙二醇'}],
        [MARKET_SUFFIX_NAME.DCE + '-EB', {Time:6,Decimal:0,Name:'苯乙烯'}],
        [MARKET_SUFFIX_NAME.DCE + '-CS', {Time:6,Decimal:0,Name:'淀粉'}],
        [MARKET_SUFFIX_NAME.DCE + '-PG', {Time:6,Decimal:0,Name:'液化气'}],
        [MARKET_SUFFIX_NAME.DCE + '-RR', {Time:6,Decimal:0,Name:'梗米'}],
        [MARKET_SUFFIX_NAME.DCE + '-LH', {Time:0,Decimal:0,Name:'生猪'}],

        //上期所
        [MARKET_SUFFIX_NAME.SHFE + '-CU', {Time:4,Decimal:0,Name:"铜"}],
        [MARKET_SUFFIX_NAME.SHFE + '-AL', {Time:4,Decimal:0,Name:"铝"}],
        [MARKET_SUFFIX_NAME.SHFE + '-NI', {Time:4,Decimal:0,Name:"镍"}],
        [MARKET_SUFFIX_NAME.SHFE + '-SN', {Time:4,Decimal:0,Name:'沪锡'}],
        [MARKET_SUFFIX_NAME.SHFE + '-ZN', {Time:4,Decimal:0,Name:"沪锌"}],
        [MARKET_SUFFIX_NAME.SHFE + '-PB', {Time:4,Decimal:0,Name:'沪铅'}],
        [MARKET_SUFFIX_NAME.SHFE + '-RU', {Time:6,Decimal:0,Name:"天然橡胶"}],
        [MARKET_SUFFIX_NAME.SHFE + '-FU', {Time:6,Decimal:0,Name:"燃料油"}],
        [MARKET_SUFFIX_NAME.SHFE + '-RB', {Time:6,Decimal:0,Name:"螺纹钢"}],
        [MARKET_SUFFIX_NAME.SHFE + '-BU', {Time:6,Decimal:0,Name:'石油沥青'}],
        [MARKET_SUFFIX_NAME.SHFE + '-HC', {Time:6,Decimal:0,Name:"热轧卷板"}],
        [MARKET_SUFFIX_NAME.SHFE + '-SP', {Time:6,Decimal:0,Name:"纸浆"}],
        [MARKET_SUFFIX_NAME.SHFE + '-WR', {Time:0,Decimal:0,Name:"线材"}],
        [MARKET_SUFFIX_NAME.SHFE + '-AG', {Time:5,Decimal:0,Name:"白银"}],
        [MARKET_SUFFIX_NAME.SHFE + '-AU', {Time:5,Decimal:2,Name:"黄金"}],
        [MARKET_SUFFIX_NAME.SHFE + '-SS', {Time:4,Decimal:0,Name:'不锈钢'}],
        [MARKET_SUFFIX_NAME.SHFE + '-AO', {Time:4,Decimal:0,Name:'氧化铝'}],
        [MARKET_SUFFIX_NAME.SHFE + '-BR', {Time:6,Decimal:0,Name:'合成橡胶'}],
        
        //上期能源
        [MARKET_SUFFIX_NAME.SHFE + '-NR', {Time:6,Decimal:1,Name:'20号胶'}],
        [MARKET_SUFFIX_NAME.SHFE + '-SC', {Time:5,Decimal:1,Name:'原油'}],
        [MARKET_SUFFIX_NAME.SHFE + '-LU', {Time:6,Decimal:0,Name:'低硫燃油'}],
        [MARKET_SUFFIX_NAME.SHFE + '-BC', {Time:4,Decimal:0,Name:'国际铜'}],
        [MARKET_SUFFIX_NAME.SHFE + '-EC', {Time:0,Decimal:0,Name:'集运指数'}],

        //郑州期货交易所
        [MARKET_SUFFIX_NAME.CZCE + '-CF', {Time:6,Decimal:0,Name:"棉花"}],
        [MARKET_SUFFIX_NAME.CZCE + '-SR', {Time:6,Decimal:0,Name:"白糖"}],
        [MARKET_SUFFIX_NAME.CZCE + '-MA', {Time:6,Decimal:0,Name:"甲醇"}],
        [MARKET_SUFFIX_NAME.CZCE + '-ZC', {Time:6,Decimal:1,Name:'动力煤'}],
        [MARKET_SUFFIX_NAME.CZCE + '-TA', {Time:6,Decimal:0,Name:"精对苯二甲酸(PTA)"}],
        [MARKET_SUFFIX_NAME.CZCE + '-RM', {Time:6,Decimal:0,Name:'菜籽粕'}],
        [MARKET_SUFFIX_NAME.CZCE + '-OI', {Time:6,Decimal:0,Name:"菜籽油"}],
        [MARKET_SUFFIX_NAME.CZCE + '-ME', {Time:3,Decimal:0,Name:"甲醇(老)"}],
        [MARKET_SUFFIX_NAME.CZCE + '-FG', {Time:6,Decimal:0,Name:'平板玻璃'}],
        [MARKET_SUFFIX_NAME.CZCE + '-WS', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-WT', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-GN', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-RO', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-RS', {Time:0,Decimal:0,Name:"菜籽"}],
        [MARKET_SUFFIX_NAME.CZCE + '-ER', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-RI', {Time:0,Decimal:0,Name:"早籼稻"}],
        [MARKET_SUFFIX_NAME.CZCE + '-WH', {Time:0,Decimal:0,Name:"强麦"}],
        [MARKET_SUFFIX_NAME.CZCE + '-AP', {Time:0,Decimal:0,Name:"苹果"}],
        [MARKET_SUFFIX_NAME.CZCE + '-PM', {Time:0,Decimal:0,Name:"普麦"}],
        [MARKET_SUFFIX_NAME.CZCE + '-QM', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-TC', {Time:0,Decimal:0}],
        [MARKET_SUFFIX_NAME.CZCE + '-JR', {Time:0,Decimal:0,Name:"粳稻"}],
        [MARKET_SUFFIX_NAME.CZCE + '-LR', {Time:0,Decimal:0,Name:"晚籼稻"}],
        [MARKET_SUFFIX_NAME.CZCE + '-SF', {Time:0,Decimal:0,Name:"硅铁"}],
        [MARKET_SUFFIX_NAME.CZCE + '-SM', {Time:0,Decimal:0,Name:"锰硅"}],
        [MARKET_SUFFIX_NAME.CZCE + '-CJ', {Time:0,Decimal:2, Name:"红枣"}],
        [MARKET_SUFFIX_NAME.CZCE + '-CY', {Time:6,Decimal:0, Name:"棉纱"}],
        [MARKET_SUFFIX_NAME.CZCE + '-UR', {Time:0,Decimal:0, Name:"尿素"}],
        [MARKET_SUFFIX_NAME.CZCE + '-SA', {Time:6,Decimal:0, Name:"纯碱"}],
        [MARKET_SUFFIX_NAME.CZCE + '-PF', {Time:6,Decimal:0, Name:"短纤"}],
        [MARKET_SUFFIX_NAME.CZCE + '-PK', {Time:0,Decimal:0, Name:"花生"}],
        
        //中期所
        [MARKET_SUFFIX_NAME.CFFEX + '-TF', {Time:1,Decimal:3,Name:"二债"}],
        [MARKET_SUFFIX_NAME.CFFEX + '-TS', {Time:1,Decimal:3,Name:"五债"}],
        [MARKET_SUFFIX_NAME.CFFEX + '-IH', {Time:2,Decimal:1,Name:'上证股指期货'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-IC', {Time:2,Decimal:1,Name:'中证股指期货'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-IF', {Time:2,Decimal:1,Name:'沪深股指期货'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-IM', {Time:2,Decimal:1,Name:'中证1000股指期货'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-IO', {Time:2,Decimal:1,Name:'沪深300股指期权'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-MO', {Time:2,Decimal:1,Name:'中证1000股指期权'}],
        [MARKET_SUFFIX_NAME.CFFEX + '-HO', {Time:2,Decimal:1,Name:'上证50股指期权'}],

        //广州期货交易所
        [MARKET_SUFFIX_NAME.GZFE+'-SI', {Time:0,Decimal:2,Name:"工业硅"}],
        [MARKET_SUFFIX_NAME.GZFE+'-LC', {Time:0,Decimal:2,Name:"碳酸锂"}]
    ]);

    this.MAP_ONEWORD = new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-C', {Time:6,Decimal:0,Name:"玉米"}],
        [MARKET_SUFFIX_NAME.DCE + '-L', {Time:6,Decimal:0,Name:"乙烯"}],
        [MARKET_SUFFIX_NAME.DCE + '-V', {Time:6,Decimal:0,Name:"PVC"}],
        [MARKET_SUFFIX_NAME.DCE + '-A', {Time:6,Decimal:0,Name:"豆一"}],
        [MARKET_SUFFIX_NAME.DCE + '-B', {Time:6,Decimal:0,Name:"豆二"}],
        [MARKET_SUFFIX_NAME.DCE + '-M', {Time:6,Decimal:0,Name:"豆粕"}],
        [MARKET_SUFFIX_NAME.DCE + '-Y', {Time:6,Decimal:0,Name:"豆油"}],
        [MARKET_SUFFIX_NAME.DCE + '-P', {Time:6,Decimal:0,Name:"棕榈"}],
        [MARKET_SUFFIX_NAME.DCE + '-J', {Time:6,Decimal:1,Name:'焦炭'}],
        [MARKET_SUFFIX_NAME.DCE + '-I', {Time:6,Decimal:1,Name:"铁矿"}],
        //中期所 
        [MARKET_SUFFIX_NAME.CFFEX + '-T', { Time: 1, Decimal: 3, Name:"十债"}],
    ]);

    this.GetData = function (upperSymbol) 
    {
        var oneWord = upperSymbol.charAt(0);
        var twoWords = upperSymbol.substr(0, 2);
        var oneWordName = null, twoWordsName = null;

        if (MARKET_SUFFIX_NAME.IsDCE(upperSymbol))  //大连商品交易所
        {
            oneWordName = MARKET_SUFFIX_NAME.DCE + '-' + oneWord;
            twoWordsName = MARKET_SUFFIX_NAME.DCE + '-' + twoWords;
        }
        else if (MARKET_SUFFIX_NAME.IsSHFE(upperSymbol))  //上期所
        {
            oneWordName = MARKET_SUFFIX_NAME.SHFE + '-' + oneWord;
            twoWordsName = MARKET_SUFFIX_NAME.SHFE + '-' + twoWords;
        }
        else if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol))  //中期所 
        {
            oneWordName = MARKET_SUFFIX_NAME.CFFEX + '-' + oneWord;
            twoWordsName = MARKET_SUFFIX_NAME.CFFEX + '-' + twoWords;
        }
        else if (MARKET_SUFFIX_NAME.IsCZCE(upperSymbol))  //郑州期货交易所
        {
            oneWordName = MARKET_SUFFIX_NAME.CZCE + '-' + oneWord;
            twoWordsName = MARKET_SUFFIX_NAME.CZCE + '-' + twoWords;
        }
        else if (MARKET_SUFFIX_NAME.IsGZFE(upperSymbol))    //广州期货交易所
        {
            oneWordName = MARKET_SUFFIX_NAME.GZFE + '-' + oneWord;
            twoWordsName = MARKET_SUFFIX_NAME.GZFE + '-' + twoWords;
        }

        if (this.MAP_TWOWORDS.has(twoWordsName)) 
        {
            return this.MAP_TWOWORDS.get(twoWordsName);
        }

        if (this.MAP_ONEWORD.has(oneWordName)) 
        {
            return this.MAP_ONEWORD.get(oneWordName);
        }

        return null;
    }

    this.GetSplitData = function (upperSymbol)
    {
        var data = this.GetData(upperSymbol);
        if (!data) return null;

        return this.TIME_SPLIT[data.Time];
    }

    this.GetDecimal = function (upperSymbol)    //期货价格小数位数
    {
        var data = this.GetData(upperSymbol);
        if (!data) return 2;

        return data.Decimal;
    }

    //添加新品种
    this.AddNewFutures=function(obj)    //{ Suffix:后缀, Symbol:品种代码, Time:交易时间段, Decimal:小数位数, Name:名字 }
    {
        if (!obj) return;

        var key=obj.Suffix+'-'+obj.Symbol;
        var item={ Time:obj.Time, Decimal:obj.Decimal, Name:obj.Name };
        if (obj.Symbol.length==1)
        {
            this.MAP_ONEWORD.set(key, item);
        }
        else if (obj.Symbol.length==2)
        {
            this.MAP_TWOWORDS.set(key, item);
        }
    }
}

//纽约商品期货交易所 交易时间数据 
function NYMEXTimeData() 
{
    this.MarketSuffix=".NYMEX";
    this.TimeType=0; // 0=标准时间 1=夏令时间 

    //标准时间
    this.TIME_SPLIT =
    [
        {
            Name: '6:00-5:00',
            Data:
                [
                    //6:00 - 5:00
                    { Start: 600, End: 2359 },
                    { Start: 0, End: 500 },
                ],
            Coordinate:
            {
                Full://完整模式
                    [
                        { Value: 600, Text: '6:00' },
                        { Value: 800, Text: '8:00' },
                        { Value: 1000, Text: '10:00' },
                        { Value: 1200, Text: '12:00' },
                        { Value: 1400, Text: '14:00' },
                        { Value: 1600, Text: '16:00' },
                        { Value: 1800, Text: '18:00' },
                        { Value: 2000, Text: '20:00' },
                        { Value: 2200, Text: '22:00' },
                        { Value: 0, Text: '0:00' },
                        { Value: 200, Text: '2:00' },
                        { Value: 400, Text: '4:00' },
                    ],
                Simple: //简洁模式
                    [
                        { Value: 600, Text: '6:00' },
                        //{ Value: 800, Text: '8:00' },
                        { Value: 1000, Text: '10:00' },
                        //{ Value: 1200, Text: '12:00' },
                        { Value: 1400, Text: '14:00' },
                        //{ Value: 1600, Text: '16:00' },
                        { Value: 1800, Text: '18:00' },
                        //{ Value: 2000, Text: '20:00' },
                        { Value: 2200, Text: '22:00' },
                        //{ Value: 0, Text: '0:00' },
                        { Value: 200, Text: '2:00' }
                        //{ Value: 400, Text: '4:00' },
                    ],
                Min:   //最小模式  
                    [
                        { Value: 600, Text: '6:00' },
                        { Value: 1800, Text: '18:00' },
                        { Value: 500, Text: '5:00' }
                    ]
            }
        }
    ]

    //美国夏时令
    this.TIME_SPLIT2=
    [
        {
            Name:'7:00-6:00',
            Data:
            [
                //6:00 - 5:00
                { Start: 700, End: 2359 },
                { Start: 0, End: 600 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' },
                    { Value: 500, Text: '5:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 700, Text: '7:00' },
                    //{ Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    //{ Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    //{ Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    //{ Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    //{ Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                    //{ Value: 500, Text: '5:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 500, Text: '5:00' }
                ]
            }
        }
    ]

    this.FUTURES_LIST=
    [
        { Symbol:"CL", Decimal:2, Time:0 }, //原油
        { Symbol:"NG", Decimal:3, Time:0 }, //天然气
        { Symbol:"RB", Decimal:4, Time:0 }, //汽油
        { Symbol:"PL", Decimal:1, Time:0 }, //铂金
        { Symbol:"PA", Decimal:2, Time:0 }, //钯金
        { Symbol:"HR", Decimal:0, Time:0 }, //热轧钢卷
        { Symbol:"QM", Decimal:3, Time:0 }, //迷你原油
        { Symbol:"HO", Decimal:4, Time:0 }, //燃油
    ]

    this.GetFuturesInfo=function(upperSymbol)
    {
        if (upperSymbol.indexOf(this.MarketSuffix)<=0) return null;

        for(var i in this.FUTURES_LIST)
        {
            var item=this.FUTURES_LIST[i];
            if (upperSymbol.indexOf(item.Symbol)==0)
            {
                return item;
            }
        }

        return null;
    }

    this.GetSplitData = function (upperSymbol) 
    {
        //夏令和标准时间切换
        var timeSplit=this.TimeType==0 ? this.TIME_SPLIT : this.TIME_SPLIT2;
        var find=this.GetFuturesInfo(upperSymbol);
        if (find) return timeSplit[find.Time];

        return timeSplit[0];
    }

    this.GetDecimal = function (upperSymbol) 
    {
        var find=this.GetFuturesInfo(upperSymbol);
        if (find) return find.Decimal;

        return 3;
    }

    this.GetMarketStatus = function (upperSymbol) // 0=闭市 1=盘前 2=盘中 3=盘后
    {
        var usaDate=GetLocalTime(-4);   //需要转成美国时间的 周6 周日
        var nowDate= new Date();
        var day = usaDate.getDay();
        var time = nowDate.getHours() * 100 + nowDate.getMinutes();
        if(day == 6 || day== 0) return 0;   //周末
        if(time>430 && time<730) return 1;

        return 2;   
    }

    this.AddNewFutures=function(obj) //修改或添加品种 obj={ Symbol:品种代码, Time:时间id, Decimal:小数位数, Name:名字 }
    {
        if (!obj) return;

        var newItem={ Symbol:obj.Symbol, Time:obj.Time, Decimal:obj.Decimal, Name:obj.Name };
        for(var i=0;i<this.FUTURES_LIST.length;++i)
        {
            var item=this.FUTURES_LIST[i];
            if (item.Symbol==newItem.Symbol) 
            {
                this.FUTURES_LIST[i]=newItem;
                return;
            }
        }
        
        this.FUTURES_LIST.push(newItem);
    }
}

//纽约金属交易所（COMEX）
function COMEXTimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.FUTURES_LIST=
    [
        { Symbol:"GC", Decimal:1, Time:0, Name:"COMEX黄金"}, //COMEX黄金
        { Symbol:"QO", Decimal:2, Time:0, Name:"迷你黄金" }, //迷你黄金
        { Symbol:"MG", Decimal:1, Time:0, Name:"微型黄金" }, //微型黄金
        { Symbol:"QI", Decimal:4, Time:0, Name:"迷你白银" }, //迷你白银
        { Symbol:"SI", Decimal:3, Time:0, Name:"COMEX白银" }, //COMEX白银
        { Symbol:"HG", Decimal:4, Time:0, Name:"COMEX铜" }  //COMEX铜
    ]

    this.MarketSuffix=".COMEX";
}

//纽约期货交易所（ICEUS-NYBOT）
function NYBOTTimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    //美国标准时间
    this.TIME_SPLIT=
    [
        {
            Name:'9:00-2:20',
            Data:
            [
                //9:00-2:20
                { Start: 900, End: 2359 },
                { Start: 0, End: 220 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 100, Text: '1:00' }
                ]
            }
        },
        {
            Name:'15:30-1:00',
            Data:
            [
                //9:00-2:20
                { Start: 1530, End: 2359 },
                { Start: 0, End: 100 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 1600, Text: '16:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 100, Text: '1:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1600, Text: '17:00' },
                    { Value: 1800, Text: '18:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 0, Text: '0:00' },
                    //{ Value: 100, Text: '1:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 1600, Text: '16:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 100, Text: '1:00' }
                ]
            }
        }
    ]

    //美国夏时令
    this.TIME_SPLIT2=
    [
        {
            Name:'10:00-3:20',
            Data:
            [
                //9:00-2:20
                { Start: 1000, End: 2359 },
                { Start: 0, End: 320 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 1000, Text: '10:00' },
                    //{ Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    //{ Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    //{ Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    //{ Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 1000, Text: '10:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        },
        {
            Name:'16:30-2:00',
            Data:
            [
                { Start: 1630, End: 2359 },
                { Start: 0, End: 200 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 1700, Text: '17:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 100, Text: '1:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 1900, Text: '19:00' },
                    //{ Value: 2000, Text: '20:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    //{ Value: 0, Text: '0:00' },
                    { Value: 100, Text: '1:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 1700, Text: '17:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        }
    ]

    this.FUTURES_LIST=
    [
        { Symbol:"SB", Decimal:2, Time:1 }, //11号白糖
        { Symbol:"CT", Decimal:2, Time:0 }, //棉花
        //{ Symbol:"KC", Decimal:2, Time:0 }, //咖啡
        //{ Symbol:"DX", Decimal:2, Time:0 }, //美元指数
        //{ Symbol:"CC", Decimal:2, Time:0 }  //可可
    ]

    this.MarketSuffix=".NYBOT";

    this.GetMarketStatus=function(upperSymbol) // 0=闭市 1=盘前 2=盘中 3=盘后
    {
        var usaDate=GetLocalTime(-4);   //需要转成美国时间的 周6 周日
        var day = usaDate.getDay();
        var time = usaDate.getHours() * 100 + usaDate.getMinutes();
        if(day == 6 || day== 0) return 0;   //周末

        var find=this.GetFuturesInfo(upperSymbol);
        if (!find) return 2;
        
        if (find.Symbol=="SB")  //Sugar No. 11 Futures 03:30 - 13:00
        {
            if (time>300 && time<1400) return 2;
        }
        else if (find.Symbol=="CT") //美棉 21:00-14:20 
        {
            if( (time>=0 && time<=1500 ) || (time>=2000 && time<=2359) ) return 2;
            return 1;
        }

        return 0;   
    }
}

//芝加哥期货交易所
function CBOTTimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    //标准时间
    this.TIME_SPLIT=
    [
        //ID=0 8:00-2:20
        {
            Name:'8:00-2:20',
            Data:
            [
                //6:00 - 5:00
                { Start: 800, End: 2359 },
                { Start: 0, End: 220 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    //{ Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    //{ Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        },
        //ID=1 8:00-2:45
        {
            Name:'8:00-2:45',
            Data:
            [
                //6:00 - 5:00
                { Start: 800, End: 2359 },
                { Start: 0, End: 245 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    //{ Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    //{ Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        },
        //ID=2 6:00-5:00
        {
            Name:'6:00-5:00',
            Data:
            [
                //6:00 - 5:00
                { Start: 600, End: 2359 },
                { Start: 0, End: 500 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 600, Text: '6:00' },
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' },
                    { Value: 400, Text: '4:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 600, Text: '6:00' },
                    //{ Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    //{ Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    //{ Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    //{ Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    //{ Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                    //{ Value: 400, Text: '4:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 600, Text: '6:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 500, Text: '5:00' }
                ]
            }
        },
        //ID=3 08:00-20:45 21:31-02:20
        {
            Name:'08:00-20:45 21:31-02:20',
            Data:
            [
                { Start: 800, End: 2045 },
                { Start: 2131, End: 2359 },
                { Start: 0, End: 220 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    //{ Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    //{ Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        },

        //ID=4 8:00-20:45 21:31-2:45
        {
            Name:'8:00-2:45',
            Data:
            [
                { Start: 800, End: 2045 },
                { Start: 2131, End: 2359 },
                { Start: 0, End: 245 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    //{ Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    //{ Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        },

        //ID=5 06:00-04:15 04:31-05:00
        {
            Name:'06:00-04:15 04:31-05:00',
            Data:
            [
                { Start: 600, End: 2359 },
                { Start: 0, End: 415 },
                { Start: 431, End: 500 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 600, Text: '6:00' },
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' },
                    { Value: 400, Text: '4:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 600, Text: '6:00' },
                    //{ Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    //{ Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    //{ Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    //{ Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    //{ Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                    //{ Value: 400, Text: '4:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 600, Text: '6:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 500, Text: '5:00' }
                ]
            }
        }
    ]

    //夏令时间
    this.TIME_SPLIT2=
    [
        //ID=0 9:00-3:20
        {
            Name:'9:00-3:20',
            Data:
            [
                { Start: 900, End: 2359 },
                { Start: 0, End: 320 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' }
                    //{ Value: 300, Text: '3:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 300, Text: '3:00' }
                ]
            }
        },
        //ID=1 9:00-3:45
        {
            Name:'9:00-3:45',
            Data:
            [
                { Start: 900, End: 2359 },
                { Start: 0, End: 345 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' }
                    //{ Value: 300, Text: '3:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 300, Text: '3:00' }
                ]
            }
        },
        //ID=2 7:00-6:00
        {
            Name:'7:00-6:00',
            Data:
            [
                { Start: 700, End: 2359 },
                { Start: 0, End: 600 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' },
                    { Value: 500, Text: '5:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 700, Text: '7:00' },
                    //{ Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    //{ Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    //{ Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    //{ Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    //{ Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                    //{ Value: 500, Text: '5:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 500, Text: '5:00' }
                ]
            }
        },
        //ID=3 09:00-21:45 22:31-03:20
        {
            Name:'09:00-21:45 22:31-03:20',
            Data:
            [
                { Start: 900, End: 2145 },
                { Start: 2231, End: 2359 },
                { Start: 0, End: 320 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' }
                    //{ Value: 300, Text: '3:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 300, Text: '3:00' }
                ]
            }
        },

        //ID=4 09:00-21:45 22:31-03:45
        {
            Name:'09:00-21:45 22:31-03:45',
            Data:
            [
                { Start: 900, End: 2145 },
                { Start: 2231, End: 2359 },
                { Start: 0, End: 345 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' }
                    //{ Value: 300, Text: '3:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 300, Text: '3:00' }
                ]
            }
        },

        //ID=5 07:00-05:15 05:31-06:00
        {
            Name:'07:00-05:15 05:31-06:00',
            Data:
            [
                { Start: 700, End: 2359 },
                { Start: 0, End: 515 },
                { Start: 531, End: 600 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' },
                    { Value: 500, Text: '5:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 700, Text: '7:00' },
                    //{ Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    //{ Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    //{ Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    //{ Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    //{ Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                    //{ Value: 500, Text: '5:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 700, Text: '7:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 500, Text: '5:00' }
                ]
            }
        }
    ]

    this.FUTURES_LIST=
    [
        { Symbol:"ZC", Decimal:2, Time:0, Name:"玉米" }, //玉米
        { Symbol:"XC", Decimal:2, Time:1, Name:"迷你玉米" }, //迷你玉米
        { Symbol:"ZS", Decimal:2, Time:0, Name:'大豆' }, //大豆
        { Symbol:"XK", Decimal:2, Time:1, Name:"迷你大豆" }, //迷你大豆
        { Symbol:"ZL", Decimal:2, Time:0, Name:"豆油"}, //豆油
        { Symbol:"ZR", Decimal:2, Time:0, Name:"稻谷" }, //稻谷
        { Symbol:"ZO", Decimal:2, Time:0, Name:"燕麦" }, //燕麦
        { Symbol:"ZW", Decimal:2, Time:0, Name:'小麦'}, //小麦
        { Symbol:"XW", Decimal:2, Time:1, Name:"迷你小麦" }, //迷你小麦
        { Symbol:"ZM", Decimal:1, Time:0, Name:"豆粕" }, //豆粕

        { Symbol:"EH", Decimal:3, Time:2 }, //乙醇

        { Symbol:"YM", Decimal:0, Time:2, Name:"小型道指"}, //小型道指
        { Symbol:"ES", Decimal:2, Time:2, Name:"小型标普" }, //小型标普
        { Symbol:"NQ", Decimal:2, Time:2, Name:"小型纳指" }, //小型纳指

        { Symbol:"TY", Decimal:4, Time:2, Name:"10年美国债" }, //10年美国债
        { Symbol:"TU", Decimal:4, Time:2, Name:"2年美国债" }, //2年美国债
        { Symbol:"FV", Decimal:4, Time:2, Name:"5年美国债" }, //5年美国债
        { Symbol:"US", Decimal:4, Time:2, Name:"30年美国债" }, //30年美国债
        { Symbol:"UL", Decimal:4, Time:2, Name:"超国债" }, //超国债
    ]

    this.MarketSuffix=".CBOT";
}

//伦敦金属交易所 LME
function LMETimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    //标准时间
    this.TIME_SPLIT=
    [
        {
            Name:'LME 9:00-3:00',
            Data:
            [
                { Start: 900, End: 2359 },
                { Start: 0, End: 300 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' },
                    { Value: 300, Text: '3:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    //{ Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    //{ Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    //{ Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    //{ Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' }
                   // { Value: 300, Text: '3:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 300, Text: '3:00' }
                ]
            }
        }
    ]

    //夏令
    this.TIME_SPLIT=
    [
        {
            Name:'LME 8:00-2:00',
            Data:
            [
                { Start: 800, End: 2359 },
                { Start: 0, End: 200 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    //{ Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    //{ Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    //{ Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    //{ Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' }
                    //{ Value: 200, Text: '2:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 200, Text: '2:00' }
                ]
            }
        }
    ]

    this.FUTURES_LIST=
    [
        { Symbol:"SN", Decimal:0, Time:0, Name:"LME锡" }, //综合锡03
        { Symbol:"AH", Decimal:2, Time:0, Name:"LME铝" }, //综合铝03
        { Symbol:"PB", Decimal:2, Time:0, Name:"LME铅" }, //综合铅03
        { Symbol:"ZS", Decimal:2, Time:0, Name:"LME锌" }, //综合锌03
        { Symbol:"CA", Decimal:2, Time:0, Name:"LME铜" }, //综合铜03
        { Symbol:"NI", Decimal:0, Time:0, Name:"LME镍" }, //综合镍03
    ]

    this.MarketSuffix=".LME";
}

//东京商品交易所（TOCOM）
function TOCOMTimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.TimeType=0;

    this.TIME_SPLIT=
    [
        //ID=0 15:30-04:30 07:46-14:15
        {
            Name:'15:30-04:30 07:46-14:15',
            Data:
            [
                { Start: 1530,  End: 2359},
                { Start: 0,     End: 430 },
                { Start: 746,   End: 1415 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 1530, Text: '15:30' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' },
                    { Value: 300, Text: '3:00' },
                    { Value: 430, Text: '4:30' },
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1415, Text: '14:15' }
                ],
                Simple: //简洁模式
                [
                    { Value: 1530, Text: '15:30' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 100, Text: '1:00' },
                    { Value: 430, Text: '4:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1415, Text: '14:15' }
                ],
                Min:   //最小模式  
                [
                    { Value: 1530, Text: '15:30' },
                    { Value: 100, Text: '1:00' },
                    { Value: 1415, Text: '14:15' }
                ]
            }
        }
    ];

    this.FUTURES_LIST=
    [
        { Symbol:"JRV", Decimal:0, Time:0, Name:"东京TSR20橡胶" }, 
        { Symbol:"JPL", Decimal:0, Time:0, Name:"东京铂金" }, 
        { Symbol:"JAU", Decimal:0, Time:0, Name:"东京黄金" }, 
        { Symbol:"JCO", Decimal:0, Time:0, Name:"中东原油" }, 
        { Symbol:"JRU", Decimal:1, Time:0, Name:"东京RSS3橡胶橡胶" }, 
        { Symbol:"JAG", Decimal:1, Time:0, Name:"日白银" } ,
        { Symbol:"JPA", Decimal:1, Time:0, Name:"日钯金" } 
    ]

    this.MarketSuffix=".TOCOM";
}

//美国洲际交易所（ICE EUROPE）
function IPETimeData()
{
    this.newMethod=NYMEXTimeData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.MarketSuffix=".IPE";

     //美国标准时间
    this.TIME_SPLIT=
    [
        //ID=0 8:00-6:00
        {
            Name:'8:00-6:00',
            Data:
            [
                { Start: 800, End: 2359 },
                { Start: 0, End: 600 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 1800, Text: '18:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 200, Text: '2:00' },
                    { Value: 400, Text: '4:00' },
                    { Value: 600, Text: '6:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 1200, Text: '12:00' },
                    { Value: 1600, Text: '16:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 0, Text: '0:00' },
                    { Value: 400, Text: '4:00' },
                    { Value: 600, Text: '6:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 800, Text: '8:00' },
                    { Value: 2000, Text: '20:00' },
                    { Value: 600, Text: '6:00' }
                ]
            }
        }
    ]
 
    //美国夏时令
    this.TIME_SPLIT2=
    [
        //ID=0 09:00-07:00
        {
            Name:'09:00-07:00',
            Data:
            [
                { Start: 900, End: 2359 },
                { Start: 0, End: 700 },
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1500, Text: '15:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 1900, Text: '19:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 300, Text: '3:00' },
                    { Value: 500, Text: '5:00' },
                    { Value: 700, Text: '7:00' }
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1300, Text: '13:00' },
                    { Value: 1700, Text: '17:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 1, Text: '1:00' },
                    { Value: 500, Text: '5:00' },
                    { Value: 700, Text: '7:00' }
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 2100, Text: '21:00' },
                    { Value: 700, Text: '7:00' }
                ]
            }
        }
    ]

    this.FUTURES_LIST=
    [
        { Symbol:"RC", Decimal:2, Time:0, Name:"罗布斯塔咖啡" }, 
        { Symbol:"W", Decimal:2, Time:0, Name:"白糖" }, 
        { Symbol:"C", Decimal:2, Time:0, Name:"伦敦可可" }, 
        { Symbol:"R", Decimal:2, Time:0, Name:"长期英国国债" }, 
        { Symbol:"L", Decimal:2, Time:0, Name:"3个月英镑利率" },
        { Symbol:"T", Decimal:2, Time:0, Name:"WTI原油" },
        { Symbol:"G", Decimal:2, Time:0, Name:"低硫柴油" },
        { Symbol:"B", Decimal:2, Time:0, Name:"布伦特原油" }  
    ]
}

var g_MinuteTimeStringData = new MinuteTimeStringData();
var g_MinuteCoordinateData = new MinuteCoordinateData();
var g_FuturesTimeData = new FuturesTimeData();
var g_NYMEXTimeData = new NYMEXTimeData();
var g_COMEXTimeData=new COMEXTimeData();
var g_NYBOTTimeData=new NYBOTTimeData();
var g_CBOTTimeData=new CBOTTimeData();
var g_LMETimeData=new LMETimeData();
var g_TOCOMTimeData=new TOCOMTimeData();
var g_IPETimeData=new IPETimeData();


function GetfloatPrecision(symbol)  //获取小数位数
{
    var defaultfloatPrecision = 2;    //默认2位
    if (!symbol) return defaultfloatPrecision;
    var upperSymbol = symbol.toUpperCase();

    //全部由外部控制
    if (typeof(MARKET_SUFFIX_NAME.GetCustomDecimal)=='function') return MARKET_SUFFIX_NAME.GetCustomDecimal(upperSymbol);

    if (MARKET_SUFFIX_NAME.IsSHSZFund(upperSymbol)) defaultfloatPrecision = 3;    //基金3位小数
    else if (MARKET_SUFFIX_NAME.IsSHO(upperSymbol) || MARKET_SUFFIX_NAME.IsSZO(upperSymbol)) defaultfloatPrecision = MARKET_SUFFIX_NAME.GetSHODecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol)) defaultfloatPrecision = g_FuturesTimeData.GetDecimal(upperSymbol);  //期货小数位数读配置
    else if (MARKET_SUFFIX_NAME.IsFHK(upperSymbol)) defaultfloatPrecision = MARKET_SUFFIX_NAME.GetFHKDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsFTSE(upperSymbol)) defaultfloatPrecision = MARKET_SUFFIX_NAME.GetFTSEDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsForeignExchange(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetForeignExchangeDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsBIT(upperSymbol)) defaultfloatPrecision = MARKET_SUFFIX_NAME.GetBITDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsET(upperSymbol)) defaultfloatPrecision = MARKET_SUFFIX_NAME.GetETDecimal(upperSymbol); 
    else if (MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol)) defaultfloatPrecision=g_NYMEXTimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsCOMEX(upperSymbol)) defaultfloatPrecision=g_COMEXTimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsNYBOT(upperSymbol)) defaultfloatPrecision=g_NYBOTTimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsCBOT(upperSymbol)) defaultfloatPrecision=g_CBOTTimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsTOCOM(upperSymbol)) defaultfloatPrecision=g_TOCOMTimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsIPE(upperSymbol)) defaultfloatPrecision=g_IPETimeData.GetDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsHK(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetHKDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsTW(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetTWDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsJP(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetJPDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsHSX(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetHSXDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsHNX(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetHNXDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsUPCOM(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetUPCOMDecimal(upperSymbol);

    else if (MARKET_SUFFIX_NAME.IsSZ(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetSZDecimal(upperSymbol);
    else if (MARKET_SUFFIX_NAME.IsSH(upperSymbol)) defaultfloatPrecision=MARKET_SUFFIX_NAME.GetSHDecimal(upperSymbol);

    else defaultfloatPrecision=MARKET_SUFFIX_NAME.GetDefaultDecimal(upperSymbol);

    return defaultfloatPrecision;
}

//导出统一使用JSCommon命名空间名
var JSCommonCoordinateData=
{
    MinuteCoordinateData: g_MinuteCoordinateData,
    MinuteTimeStringData: g_MinuteTimeStringData,
    MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
    GetfloatPrecision: GetfloatPrecision
};

export
{
    JSCommonCoordinateData,

    MARKET_SUFFIX_NAME,
    g_FuturesTimeData,
    g_NYMEXTimeData,
    g_COMEXTimeData,
    g_NYBOTTimeData,
    g_LMETimeData,
    g_CBOTTimeData,
    g_TOCOMTimeData,
    g_IPETimeData,
    GetfloatPrecision,

    g_MinuteCoordinateData,
    g_MinuteTimeStringData
};

/*
module.exports =
{
    JSCommonCoordinateData:
    {
        MinuteCoordinateData: g_MinuteCoordinateData,
        MinuteTimeStringData: g_MinuteTimeStringData,
        MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
        GetfloatPrecision: GetfloatPrecision
    },

    JSCommonCoordinateData_MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
    JSCommonCoordinateData_Global_FuturesTimeData: g_FuturesTimeData,
    JSCommonCoordinateData_Global_NYMEXTimeData: g_NYMEXTimeData,
    JSCommonCoordinateData_Global_COMEXTimeData: g_COMEXTimeData,
    JSCommonCoordinateData_Global_NYBOTTimeData: g_NYBOTTimeData,
    JSCommonCoordinateData_Global_LMETimeData: g_LMETimeData,
    JSCommonCoordinateData_Global_CBOTTimeData: g_CBOTTimeData,
    JSCommonCoordinateData_Global_TOCOMTimeData: g_TOCOMTimeData,
    JSCommonCoordinateData_Global_IPETimeData: g_IPETimeData,
    JSCommonCoordinateData_GetfloatPrecision: GetfloatPrecision,
};
*/