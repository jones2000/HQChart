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

    IsHK: function (upperSymbol)
    {
        var pos = upperSymbol.length - this.HK.length;
        var find = upperSymbol.indexOf(this.HK);
        return find == pos;
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
    },

    IsChinaFutures: function (upperSymbol)   //是否是国内期货
    {
        return this.IsCFFEX(upperSymbol) || this.IsCZCE(upperSymbol) || this.IsDCE(upperSymbol) || this.IsSHFE(upperSymbol);
    },

    IsSHSZ: function (upperSymbol)            //是否是沪深的股票
    {
        return this.IsSZ(upperSymbol) || this.IsSH(upperSymbol);
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
        else if (upperSymbol.indexOf('.CI') > 0)  //自定义指数
        {
            return true;
        }

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

    this.GetUSA=function()
    {
        if (!this.USA) this.USA=this.CreateUSAData();
        return this.USA;
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
                    { Value: 1031, Text: '10:30' },
                    { Value: 1100, Text: '11:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1000, Text: '10:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 900, Text: '9:00' },
                    { Value: 1331, Text: '13:30' },
                    { Value: 1500, Text: '15:00' },
                ]
            }
        },
        {

            Name:'9:15-11:30,13:00-15:15',
            Data:
            [
                { Start: 915, End: 1130 },
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
                    { Value: 1301, Text: '13:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1515, Text: '15:15' },
                ],
                Simple: //简洁模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1301, Text: '13:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1515, Text: '15:15' },
                ],
                Min:   //最小模式  
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1301, Text: '13:00' },
                    { Value: 1515, Text: '15:15' },
                ]
            }
        },
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
                    { Value: 1301, Text: '13:00' },
                    { Value: 1330, Text: '13:30' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1430, Text: '14:30' },
                    { Value: 1500, Text: '15:00' },
                ],
                Simple: //简洁模式
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1030, Text: '10:30' },
                    { Value: 1301, Text: '13:00' },
                    { Value: 1400, Text: '14:00' },
                    { Value: 1500, Text: '15:00' },
                ],
                Min:   //最小模式  
                [
                    { Value: 930, Text: '9:30' },
                    { Value: 1301, Text: '13:00' },
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
        {
            Name:'21:00-1:00,9:00-10:15,10:30-11:30,13:30-15:00',
            Data:
            [   
                { Start: 2100, End: 2359 },
                { Start: 0, End: 100 },
                { Start: 901, End: 1015 },
                { Start: 1031, End: 1130 },
                { Start: 1301, End: 1500 }
            ],
            Coordinate:
            {
                Full://完整模式
                [
                    { Value: 2100, Text: '21:00' },
                    { Value: 2200, Text: '22:00' },
                    { Value: 2300, Text: '23:00' },
                    { Value: 901, Text: '9:00' },
                    { Value: 1030, Text: '10:30' },
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
        {
            Name:'21:00-2:30,9:00-10:15,10:30-11:30,13:30-15:00',
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
        {
            Name: '21:00-23:00,9:00-10:15,10:30-11:30,13:30-15:00',
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
                        { Value: 1031, Text: '10:30' },
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
        }
    ];

    const MAP_TWOWORDS = new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-JD', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-FB', { Time: 0, Decimal: 2 }],
        [MARKET_SUFFIX_NAME.DCE + '-BB', { Time: 0, Decimal: 2 }],
        [MARKET_SUFFIX_NAME.DCE + '-PP', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-JM', { Time: 3, Decimal: 1 }],
        //上期所
        [MARKET_SUFFIX_NAME.SHFE + '-CU', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-AL', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-NI', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-SN', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-ZN', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-PB', { Time: 4, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-RU', { Time: 6, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-FU', { Time: 6, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-RB', { Time: 6, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-BU', { Time: 6, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-HC', { Time: 6, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-WR', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-AG', { Time: 5, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.SHFE + '-AU', { Time: 5, Decimal: 2 }],
        //郑州期货交易所
        [MARKET_SUFFIX_NAME.CZCE + '-CF', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-SR', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-MA', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-ZC', { Time: 3, Decimal: 1 }],
        [MARKET_SUFFIX_NAME.CZCE + '-TA', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-RM', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-OI', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-ME', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-FG', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-WS', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-WT', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-GN', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-RO', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-RS', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-ER', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-RI', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-WH', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-AP', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-PM', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-QM', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-TC', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-JR', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-LR', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-SF', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.CZCE + '-SM', { Time: 0, Decimal: 0 }],
        //中期所 
        [MARKET_SUFFIX_NAME.CFFEX + '-TF', { Time: 1, Decimal: 3 }],
        [MARKET_SUFFIX_NAME.CFFEX + '-TS', { Time: 1, Decimal: 3 }],
        [MARKET_SUFFIX_NAME.CFFEX + '-IH', { Time: 2, Decimal: 1 }],
        [MARKET_SUFFIX_NAME.CFFEX + '-IC', { Time: 2, Decimal: 1 }],
        [MARKET_SUFFIX_NAME.CFFEX + '-IF', { Time: 2, Decimal: 1 }],
    ]);

    const MAP_ONEWORD = new Map([
        //大连商品交易所
        [MARKET_SUFFIX_NAME.DCE + '-C', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-L', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-V', { Time: 0, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-A', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-B', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-M', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-Y', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-P', { Time: 3, Decimal: 0 }],
        [MARKET_SUFFIX_NAME.DCE + '-J', { Time: 3, Decimal: 1 }],
        [MARKET_SUFFIX_NAME.DCE + '-I', { Time: 3, Decimal: 1 }],
        //中期所 
        [MARKET_SUFFIX_NAME.CFFEX + '-T', { Time: 1, Decimal: 3 }],
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

        if (MAP_TWOWORDS.has(twoWordsName)) 
        {
            return MAP_TWOWORDS.get(twoWordsName);
        }

        if (MAP_ONEWORD.has(oneWordName)) 
        {
            return MAP_ONEWORD.get(oneWordName);
        }

        return null;
    }

    this.GetSplitData = function (upperSymbol)
    {
        var data = this.GetData(upperSymbol);
        if (!data) return null;

        return TIME_SPLIT[data.Time];
    }

    this.GetDecimal = function (upperSymbol)    //期货价格小数位数
    {
        var data = this.GetData(upperSymbol);
        if (!data) return 2;

        return data.Decimal;
    }
}

var g_MinuteTimeStringData = new MinuteTimeStringData();
var g_MinuteCoordinateData = new MinuteCoordinateData();
var g_FuturesTimeData = new FuturesTimeData();


function GetfloatPrecision(symbol)  //获取小数位数
{
    var defaultfloatPrecision = 2;    //默认2位
    if (!symbol) return defaultfloatPrecision;
    var upperSymbol = symbol.toUpperCase();

    if (MARKET_SUFFIX_NAME.IsSHSZFund(upperSymbol)) defaultfloatPrecision = 3;    //基金3位小数
    else if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol)) defaultfloatPrecision = g_FuturesTimeData.GetDecimal(upperSymbol);  //期货小数位数读配置

    return defaultfloatPrecision;
}

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonCoordinateData:
    {
        MinuteCoordinateData: g_MinuteCoordinateData,
        MinuteTimeStringData: g_MinuteTimeStringData,
        MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
        GetfloatPrecision: GetfloatPrecision,
    },
};