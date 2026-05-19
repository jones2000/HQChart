/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    全局变量 枚举定义
*/

//周期条件枚举
var CONDITION_PERIOD =
{
    MINUTE_ID: 101,            //分钟      走势图
    MULTIDAY_MINUTE_ID: 102,   //多日分钟  走势图
    HISTORY_MINUTE_ID: 103,    //历史分钟  走势图

    //K线周期
    KLINE_DAY_ID: 0,
    KLINE_WEEK_ID: 1,
    KLINE_MONTH_ID: 2,
    KLINE_YEAR_ID: 3,
    KLINE_MINUTE_ID: 4,
    KLINE_5_MINUTE_ID: 5,
    KLINE_15_MINUTE_ID: 6,
    KLINE_30_MINUTE_ID: 7,
    KLINE_60_MINUTE_ID: 8,
};

//显示小数位数枚举
var DECIMAL_ID=
{
    SYMBOL_DECIMAL: -10,   //品种小数位数
    SYMBOL_DECIMAL1: -11,   //品种小数位数+1
    SYMBOL_DECIMAL2: -12,   //品种小数位数+2

    Includes:function(value) 
    {
        if (value==this.SYMBOL_DECIMAL || value==this.SYMBOL_DECIMAL1 || value==this.SYMBOL_DECIMAL2) return true;

        return false;
    }
}


export
{
    DECIMAL_ID,
    CONDITION_PERIOD,
};