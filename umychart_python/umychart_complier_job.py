###############################################################################################
#
#   基础|财务|日线 等数据
#
#################################################################################################

import sys

class JS_EXECUTE_JOB_ID :
    JOB_DOWNLOAD_SYMBOL_DATA=1         # 下载股票的K线数据
    JOB_DOWNLOAD_INDEX_DATA=2          # 下载大盘的K线数据
    JOB_DOWNLOAD_SYMBOL_LATEST_DATA=3  # 最新的股票行情数据
    JOB_DOWNLOAD_INDEX_INCREASE_DATA=4 # 涨跌股票个数统计数据
    JOB_DOWNLOAD_VOLR_DATA=5           # 5日量比均量下载量比数据

    # 财务函数
    JOB_DOWNLOAD_TOTAL_EQUITY_DATA=100          # 总股本（万股）
    JOB_DOWNLOAD_FLOW_EQUITY_DATA=101           # 流通股本（万股）
    JOB_DOWNLOAD_PER_U_PROFIT_DATA=102          # 每股未分配利润
    JOB_DOWNLOAD_PER_NETASSET_DATA=103          # 每股净资产
    JOB_DOWNLOAD_PER_C_RESERVE_DATA=104         # 每股资本公积金
    JOB_DOWNLOAD_PER_S_EARNING_DATA=105         # 每股收益 
    JOB_DOWNLOAD_PER_S_EARNING2_DATA=106        # 每股收益(折算为全年收益),对于沪深品种有效
    JOB_DOWNLOAD_RELEASE_DATE_DATA=107          # 上市的天数
    JOB_DOWNLOAD_N_PROFIT_DATA=108              # 净利润
    JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA=109      # 流通市值
    JOB_DOWNLOAD_MARKETVALUE_DATA=110           # 总市值
    JOB_DOWNLOAD_PROFIT_YOY_DATA=111            # 利润同比 (Profit year on year)
    JOB_DOWNLOAD_AL_RATIO_DATA=112              # 资产负债率 (asset-liability ratio)
    JOB_DOWNLOAD_DIVIDEND_YIELD_DATA=113        # 股息率


    JOB_DOWNLOAD_CAPITAL_DATA=200               # 流通股本（手）
    JOB_DOWNLOAD_EXCHANGE_DATA=201              # 换手率 成交量/流通股本*100

   
    JOB_DOWNLOAD_MARGIN_BALANCE=1000           # 融资融券余额
    JOB_DOWNLOAD_MARGIN_RATE=1001              # 融资占比

    JOB_DOWNLOAD_MARGIN_BUY_BALANCE=1010       # 买入信息-融资余额
    JOB_DOWNLOAD_MARGIN_BUY_AMOUNT=1011        # 买入信息-买入额
    JOB_DOWNLOAD_MARGIN_BUY_REPAY=1012         # 买入信息-偿还额
    JOB_DOWNLOAD_MARGIN_BUY_NET=1013           # 买入信息-融资净买入

    JOB_DOWNLOAD_MARGIN_SELL_BALANCE=1020      # 卖出信息-融券余量
    JOB_DOWNLOAD_MARGIN_SELL_VOLUME=1021       # 卖出信息-卖出量
    JOB_DOWNLOAD_MARGIN_SELL_REPAY=1022        # 卖出信息-偿还量
    JOB_DOWNLOAD_MARGIN_SELL_NET=1023          # 卖出信息-融券净卖出

    JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE=2000             # 负面新闻统计
    JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH=2001             # 机构调研
    JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT=2002             # 互动易
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE=2003         # 股东增持
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2=2004        # 股东减持
    JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER=2005          # 信托持股
    JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING=2006         # 大宗交易
    JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS=2007          # 官网新闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS=2008          # 高管要闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE=2009               # 股权质押

    JOB_DOWNLOAD_HK_TO_SH=2050,      # 北上流入上证
    JOB_DOWNLOAD_HK_TO_SZ=2051,      # 北上流入深证
    JOB_DOWNLOAD_HK_TO_SH_SZ=2052,   # /北上流总的
    

    JOB_RUN_SCRIPT=10000, # 执行脚本

    @staticmethod
    def GetFinnanceJobID(value):
        dataMap= {
            1:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA,         # FINANCE(1)   总股本（万股）
            7:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA,          # FINANCE(7)   流通股本（万股）
            9:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA,           # FINANCE(9)   资产负债率 (asset-liability ratio)
            18:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA,     # FINANCE(18)  每股公积金
            30:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA,          # FINANCE(30)  净利润
            32:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA,      # FINANCE(32)  每股未分配利润
            33:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA,    # FINANCE(33)  每股收益(折算为全年收益),对于沪深品种有效
            34:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA,      # FINANCE(34)  每股净资产
            38:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA,     # FINANCE(38)  每股收益(最近一期季报)
            40:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA,  # FINANCE(40)  流通市值 
            41:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA,       # FINANCE(41)  总市值
            42:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_RELEASE_DATE_DATA,      # FINANCE(42)  上市的天数
            43:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA,        # FINANCE(43)  利润同比 (Profit year on year)
            45:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA,    # FINANCE(45)  股息率

            200:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA,          # 流通股本（手）
            201:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA          # 换手率 成交量/流通股本
        }
    
        return dataMap.get(value)
    

    @staticmethod # 融资融券
    def GetMarginJobID(value) :
        dataMap={
            1:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE,          # 换MARGIN(1)   融资融券余额
            2:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE,             # 换MARGIN(2)   融资占比

            3:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE,       # 换MARGIN(3)   买入信息-融资余额
            4:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT,        # 换MARGIN(4)   买入信息-买入额
            5:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY,         # 换MARGIN(5)   买入信息-偿还额
            6:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET,           # 换MARGIN(6)   买入信息-融资净买入

            7:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE,      # 换MARGIN(7)   卖出信息-融券余量
            8:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,       # 换MARGIN(8)   卖出信息-卖出量
            9:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY,        # 换MARGIN(9)   卖出信息-偿还量
            10:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET,         # 换MARGIN(10)  卖出信息-融券净卖出 
        }
    
        return dataMap.get(value)
    

    @staticmethod # 北上资金
    def GetHK2SHSZJobID(value) :
        dataMap={
            1:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_HK_TO_SH_SZ,          # HK2SHSZ(1)   北上流总的
            2:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_HK_TO_SH,             # HK2SHSZ(2)   北上流入上证
            3:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_HK_TO_SZ,             # HK2SHSZ(3)   北上流入深证
        }

        return dataMap.get(value)
    

    @staticmethod   # 资讯类
    def GetNewsAnalysisID(value):
        dataMap={
            1:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE,          # NEWS(1)   负面新闻统计
            2:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH,          # NEWS(2)   机构调研统计
            3:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT,          # NEWS(3)   互动易
            4:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE,      # NEWS(4)   股东增持
            5:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2,     # NEWS(5)   股东减持
            6:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER,       # NEWS(6)   信托持股
            7:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING,      # NEWS(7)   大宗交易
            8:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS,       # NEWS(8)   官网新闻
            9:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS,       # NEWS(9)   高管要闻
            10:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE,           # NEWS(10)  股权质押    
        }

        return dataMap.get(value)


class JobItem :
    def __init__(self, id, symbol=None) :
        self.ID=id  # 任务ID
        self.Symbol=symbol  # 任务的代码 可以为空


class HQ_DATA_TYPE :
    KLINE_ID=0             # K线
    MINUTE_ID=2            # 当日走势图
    HISTORY_MINUTE_ID=3    # 历史分钟走势图
    MULTIDAY_MINUTE_ID=4   # 多日走势图



class RequestOption :
    def __init__(self, maxDataCount=500, maxMinuteDayCount=5) :
        self.MaxDataCount= maxDataCount
        self.MaxMinuteDayCount=maxMinuteDayCount

class SymbolOption :
    def __init__(self, symbol='600000.sh' ,hqDataType=HQ_DATA_TYPE.KLINE_ID, right=0, period=0, reqeust=RequestOption(maxDataCount=1000,maxMinuteDayCount=5),args=None) :
        self.HQDataType=hqDataType  # 数据类型
        self.Symbol=symbol  # 股票代码
        self.Right=right    # 复权
        self.Period=period  # 周期
        self.MaxRequestDataCount=reqeust.MaxDataCount
        self.MaxRequestMinuteDayCount=reqeust.MaxMinuteDayCount
        self.Arguments=args # 指标参数




