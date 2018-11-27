/*
   各个品种分钟走势图坐标信息
*/

var MARKET_SUFFIX_NAME=
{
    SH:'.SH',
    SZ:'.SZ',
    HK:'.HK',
    SHFE: '.SHF',        //上期所 (Shanghai Futures Exchange)
    CFFEX: '.CFE',       //中期所 (China Financial Futures Exchange)
    DCE: '.DCE',         //大连商品交易所(Dalian Commodity Exchange)
    CZCE: '.CZC',        //郑州期货交易所

    IsSH: function (upperSymbol)
    {
        return upperSymbol.indexOf(this.SH)>0;
    },

    IsSZ: function (upperSymbol)
    {
        return upperSymbol.indexOf(this.SZ)>0;
    },

    IsHK: function (upperSymbol)
    {
        return upperSymbol.indexOf(this.HK) > 0;
    },

    IsSHFE: function (upperSymbol)
    {
        return upperSymbol.indexOf(this.SHFE) > 0;
    },
        
    IsCFFEX: function (upperSymbol) 
    {
        return upperSymbol.indexOf(this.CFFEX) > 0;
    },

    IsDCE: function (upperSymbol) 
    {
        return upperSymbol.indexOf(this.DCE) > 0;
    },

    IsCZCE: function (upperSymbol) 
    {
        return upperSymbol.indexOf(this.CZCE) > 0;
    }
}


//走势图分钟数据对应的时间
function MinuteTimeStringData() 
{
    this.SHSZ = null;       //上海深证交易所时间
    this.HK = null;         //香港交易所时间
    this.Futures=new Map(); //期货交易时间 key=时间名称 Value=数据

    this.Initialize = function ()  //初始化 默认只初始化沪深的 其他市场动态生成
    {
        //this.SHSZ = this.CreateSHSZData();
        //this.HK = this.CreateHKData();
    }

    this.GetSHSZ=function() //动态创建
    {
        if (!this.SHSZ) this.SHSZ=this.CreateSHSZData();
        return this.SHSZ;
    }

    this.GetHK=function()
    {
        if (!this.HK) this.HK = this.CreateHKData();
        return this.HK;
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

    this.CreateHKData = function () 
    {
        const TIME_SPLIT =
            [
                { Start: 930, End: 1200 },
                { Start: 1300, End: 1600 }
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
        if (MARKET_SUFFIX_NAME.IsSH(upperSymbol) || MARKET_SUFFIX_NAME.IsSZ(upperSymbol)) return this.GetSHSZ();
        if (MARKET_SUFFIX_NAME.IsHK(upperSymbol)) return this.GetHK();
        if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol) || MARKET_SUFFIX_NAME.IsCZCE(upperSymbol) || MARKET_SUFFIX_NAME.IsDCE(upperSymbol) || MARKET_SUFFIX_NAME.IsSHFE(upperSymbol))
        {
            var splitData = g_FuturesTimeData.GetSplitData(upperSymbol);
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
                data = SHZE_MINUTE_X_COORDINATE;
            else if (MARKET_SUFFIX_NAME.IsHK(upperSymbol))
                data = HK_MINUTE_X_COORDINATE;
            else if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol) || MARKET_SUFFIX_NAME.IsCZCE(upperSymbol) || MARKET_SUFFIX_NAME.IsDCE(upperSymbol) || MARKET_SUFFIX_NAME.IsSHFE(upperSymbol))
                return this.GetFuturesData(upperSymbol,width);
        }

        //console.log('[MiuteCoordinateData]', width);
        var result = { Count: data.Count, MiddleCount: data.MiddleCount, Data: data.GetData(width) };
        return result;
    }

    this.GetFuturesData = function (upperSymbol,width)
    {
        var splitData = g_FuturesTimeData.GetSplitData(upperSymbol);
        if (!splitData) return null;
        var stringData = g_MinuteTimeStringData.GetFutures(splitData);
        if (!stringData) return null;
        var result = { Count: stringData.length };
        var coordinate=null;
        if (width < 200) coordinate = splitData.Coordinate.Min;
        else if (width < 480) coordinate = splitData.Coordinate.Simple;
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
}

//期货不同品种 交易时间数据 
function FuturesTimeData()
{
    const TIME_SPLIT=
    [
        {
            Name:'9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [
                //9:00-10:15,10:30-11:30,13:30-15:00
                { Start: 900, End: 1015 },
                { Start: 1030, End: 1130 },
                { Start: 1300, End: 1500 }
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
                    { Value: 1330, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
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
        {

            Name:'9:15-11:30,13:00-15:15',
            Data:
            [
                { Start: 915, End: 1130 },
                { Start: 1300, End: 1515 }
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
        {
            Name:'9:30-11:30,13:00-15:00',
            Data:
            [
                { Start: 930, End: 1130 },
                { Start: 1300, End: 1500 }
            ]
        },
        {
            Name:'21:00-23:30,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [
                { Start: 2100, End: 2330 },
                { Start: 900, End: 1015 },
                { Start: 1030, End: 1130 },
                { Start: 1330, End: 1500 }
            ]
        },
        {
            Name:'21:00-1:00,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [   
                { Start: 2100, End: 2359 },
                { Start: 0, End: 100 },
                { Start: 900, End: 1015 },
                { Start: 1030, End: 1130 },
                { Start: 1300, End: 1500 }
            ]
        },
        {
            Name:'21:00-2:30,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [
                { Start: 2100, End: 2359 },
                { Start: 0, End: 230 },
                { Start: 900, End: 1015 },
                { Start: 1030, End: 1130 },
                { Start: 1300, End: 1500 }
            ]
        }
    ];

    const MAP_TWOWORDS=new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-JD', 0],
        [MARKET_SUFFIX_NAME.DCE + '-FB', 0],
        [MARKET_SUFFIX_NAME.DCE + '-BB', 0],
        [MARKET_SUFFIX_NAME.DCE + '-PP', 0],
        [MARKET_SUFFIX_NAME.DCE + '-JM', 3],
        //上期所
        [MARKET_SUFFIX_NAME.SHFE + '-CU', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-AL', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-NI', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-SN', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-ZN', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-PB', 4],
        [MARKET_SUFFIX_NAME.SHFE + '-RU', 3],
        [MARKET_SUFFIX_NAME.SHFE + '-FU', 3],
        [MARKET_SUFFIX_NAME.SHFE + '-RB', 3],
        [MARKET_SUFFIX_NAME.SHFE + '-BU', 3],
        [MARKET_SUFFIX_NAME.SHFE + '-HC', 3],
        [MARKET_SUFFIX_NAME.SHFE + '-WR', 0],
        [MARKET_SUFFIX_NAME.SHFE + '-AG', 5],
        [MARKET_SUFFIX_NAME.SHFE + '-AU', 5],
        //郑州期货交易所
        [MARKET_SUFFIX_NAME.CZCE + '-CF', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-SR', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-MA', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-ZC', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-TA', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-RM', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-OI', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-ME', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-FG', 3],
        [MARKET_SUFFIX_NAME.CZCE + '-WS', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-WT', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-GN', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-RO', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-RS', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-ER', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-RI', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-WH', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-AP', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-PM', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-QM', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-TC', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-JR', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-LR', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-SF', 0],
        [MARKET_SUFFIX_NAME.CZCE + '-SM', 0],
        //中期所 
        [MARKET_SUFFIX_NAME.CFFEX + '-TF', 1],
        [MARKET_SUFFIX_NAME.CFFEX + '-TS', 1],
        [MARKET_SUFFIX_NAME.CFFEX + '-IH', 2],
        [MARKET_SUFFIX_NAME.CFFEX + '-IC', 2],
        [MARKET_SUFFIX_NAME.CFFEX + '-IF', 2],
    ]);

    const MAP_ONEWORD=new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-C', 0],
        [MARKET_SUFFIX_NAME.DCE + '-L', 0],
        [MARKET_SUFFIX_NAME.DCE + '-V', 0],
        [MARKET_SUFFIX_NAME.DCE + '-A', 3],
        [MARKET_SUFFIX_NAME.DCE + '-B', 3],
        [MARKET_SUFFIX_NAME.DCE + '-M', 3],
        [MARKET_SUFFIX_NAME.DCE + '-Y', 3],
        [MARKET_SUFFIX_NAME.DCE + '-P', 3],
        [MARKET_SUFFIX_NAME.DCE + '-J', 3],
        [MARKET_SUFFIX_NAME.DCE + '-I', 3],
        //中期所 
        [MARKET_SUFFIX_NAME.CFFEX + '-T', 1],
    ]);

    this.GetSplitData = function (upperSymbol)
    {
        var oneWord = upperSymbol.charAt(0);
        var twoWords = upperSymbol.substr(0,2);
        var oneWordName = null, twoWordsName=null;

        if (MARKET_SUFFIX_NAME.IsDCE(upperSymbol))  //大连商品交易所
        {
            oneWordName = MARKET_SUFFIX_NAME.DCE+'-'+oneWord;
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

        if (MAP_TWOWORDS.has(twoWordsName))
        {
            var index=MAP_TWOWORDS.get(twoWordsName);
            return TIME_SPLIT[index];
        }

        if (MAP_ONEWORD.has(oneWordName))
        {
            var index =MAP_ONEWORD.get(oneWordName);
            return TIME_SPLIT[index];
        }

        return null;
    }
}

var g_MinuteTimeStringData = new MinuteTimeStringData();
var g_MinuteCoordinateData = new MinuteCoordinateData();
var g_FuturesTimeData = new FuturesTimeData();

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonCoordinateData:
    {
        MinuteCoordinateData: g_MinuteCoordinateData,
        MinuteTimeStringData: g_MinuteTimeStringData,
        MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
    }
};