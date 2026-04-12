/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    小程序信息地雷数据
*/
import { JSConsole } from "./umychart.console.wechat.js"

import {
    g_JSChartResource,
} from './umychart.resource.wechat.js'

import 
{
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

var KLINE_INFO_TYPE=
{
    INVESTOR:1,         //互动易
    ANNOUNCEMENT:2,     //公告
    PFORECAST:3,        //业绩预告

    ANNOUNCEMENT_QUARTER_1:4,   //一季度报
    ANNOUNCEMENT_QUARTER_2:5,   //半年报
    ANNOUNCEMENT_QUARTER_3:6,   //2季度报
    ANNOUNCEMENT_QUARTER_4:7,   //年报

    RESEARCH:8,                 //调研
    BLOCKTRADING:9,             //大宗交易
    DRAGON_TIGER:10,            //龙虎榜
    DIVIDEND:12,                //除权

    POLICY:20                   //策略信息
}

function KLineInfoData()
{
    this.ID;
    this.Date;
    this.Title;
    this.InfoType;
    this.ExtendData;    //扩展数据
}

/*
    信息地雷
    信息地雷列表
*/
function JSKLineInfoMap()
{
}

JSKLineInfoMap.Get=function(id)
{
    var infoMap=new Map(
        [
            ["互动易",      {Create:function(){ return new InvestorInfo()}  }],
            ["公告",        {Create:function(){ return new AnnouncementInfo()}  }],
            ["业绩预告",    {Create:function(){ return new PforecastInfo()}  }],
            ["调研",        {Create:function(){ return new ResearchInfo()}  }],
            ["大宗交易",    {Create:function(){ return new BlockTrading()}  }],
            ["龙虎榜",      {Create:function(){ return new DragonTigerInfo()}  }],
            ["策略",    {Create: function () { return new PolicyInfo() } }],
            ['除权',        { Create:function() { return new DividendInfo() }}],
        ]
        );

    return infoMap.get(id);
}

function IKLineInfo()
{
    this.MaxRequestDataCount=1000;
    this.StartDate=20160101;
    this.Data;
    this.ClassName='IKLineInfo';
    this.Explain="IKLineInfo";

    this.GetToday=function()
    {
        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        return today;
    }

    this.RequestData=function(hqChart, obj)
    {
        var self = this;
        var param={ HQChart:hqChart };
        this.Data=[];

        if (this.NetworkFilter(hqChart,obj)) return; //已被上层替换,不调用默认的网络请求

        JSConsole.Chart.Warn(`[InvestorInfo::RequestData] ${this.ClassName} NetworkFilter error.`);
    }

    this.GetRequestData=function(hqChart)
    {
        var obj=
        { 
            Symbol:hqChart.Symbol ,
            MaxRequestDataCount: hqChart.MaxRequestDataCount,            //日线数据个数
            MaxRequestMinuteDayCount:hqChart.MaxRequestMinuteDayCount,    //分钟数据请求的天数
            Period:hqChart.Period       //周期
        };

        //K线数据范围
        var hisData=null;
        if (hqChart.ChartOperator_Temp_GetHistroyData)  hisData=hqChart.ChartOperator_Temp_GetHistroyData();
        if (hisData)
            obj.DateRange=hisData.GetDateRange();
        
        return obj;
    }

    this.NetworkFilter=function(hqChart,callInfo)
    {
        if (!hqChart.NetworkFilter) return false;

        var self=this;

        var param=
        {
            HQChart:hqChart,
        };

        var obj=
        {
            Name:`${this.ClassName}::RequestData`, //类名::函数
            Explain:this.Explain,
            Request:this.GetRequestData(hqChart), 
            Self:this,
            HQChart:hqChart,
            CallInfo:callInfo,
            PreventDefault:false
        };

        if (callInfo) 
        {
            if (callInfo.Update==true) 
            {
                obj.Update={ Start:{ Date: callInfo.StartDate } };
                param.Update={ Start:{ Date: callInfo.StartDate } };
            }

            obj.CallFunctionName=callInfo.FunctionName; //内部调用函数名
        }

        hqChart.NetworkFilter(obj, function(data) 
        { 
            self.RecvData(data,param);
        });

        if (obj.PreventDefault==true) return true;   //已被上层替换,不调用默认的网络请求
        
        return false;
    }

    this.ReadArrayText=function(infoData, recv)
    {
        if(!IFrameSplitOperator.IsNonEmptyArray(recv.aryText)) return;
        if (!infoData.ExtendData) infoData.ExtendData={ };
        if (!Array.isArray(infoData.ExtendData.AryText)) infoData.ExtendData.AryText=[];

        for(var i=0;i<recv.aryText.length;++i)
        {
            var item=recv.aryText[i];
            infoData.ExtendData.AryText.push({ Name:item.name, Value:item.value, Type:item.type })
        }
    }
}

/*
    互动易 2.0
*/
function InvestorInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="InvestorInfo";
    this.Explain="互动易";

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0;i<data.list.length; ++i)
        {
            var item = data.list[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.date;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.INVESTOR;
            this.ReadArrayText(infoData, item);
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    公告
*/
function AnnouncementInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='AnnouncementInfo';
    this.Explain="公告";

    this.RequestData=function(hqChart, obj)
    {
        var self = this;
        var param={ HQChart:hqChart };

        if (obj && obj.Update===true)   //更新模式 不清内存数据
        {

        }
        else
        {
            this.Data=[];
        }

        if (this.NetworkFilter(hqChart, obj)) return; //已被上层替换,不调用默认的网络请求
        
        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.Announcement.ApiUrl,
            data:
            {
                "filed": ["title","releasedate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxRequestDataCount,
            },
            method:"post",
            dataType: "json",
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!data) return;
        if (!data.report || data.report.length<=0) return;

        for (var i in data.report)
        {
            var item = data.report[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.releasedate;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT;
            for(var j in item.type)
            {
                var typeItem=item.type[j];
                switch(typeItem)
                {
                    case "一季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1;
                        break;
                    case "半年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2;
                        break;
                    case "三季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3;
                        break;
                    case "年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4;
                        break;
                }
            }
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    业绩预告 2.0
*/
function PforecastInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='PforecastInfo';
    this.Explain='业绩预告';

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0; i<data.list.length; ++i)
        {
            var item = data.list[i];
            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.Title=item.title;
            infoData.ReportDate=item.reportDate;
            infoData.InfoType=KLINE_INFO_TYPE.PFORECAST;
            infoData.ExtendData={ AryData:[], AryText:[] };
            for(var j=0;j<item.aryData.length;++j)
            {
                var dataItem=item.aryData[j];
                infoData.ExtendData.AryData.push({ Name:dataItem.name, Text:dataItem.text, Content:dataItem.Content});
            }

            this.ReadArrayText(infoData, item);
            
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
   投资者关系 (调研) 2.0
*/
function ResearchInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ResearchInfo';
    this.Explain='投资者关系';

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0; i<data.list.length; ++i)
        {
            var item = data.list[i];
            var infoData=new KLineInfoData();
            infoData.ID=item.id;
            infoData.Date= item.date;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.RESEARCH;
            infoData.ExtendData=
            { 
                Researcher:item.researcher,     //调研人员 
                Place:item.place,               //地点
                Count:item.count,               //机构个数
                Receptionist:item.receptionist, //接待人会员
                Date:item.startDate,            //调研日期
                AryText:[],
            };
            this.ReadArrayText(infoData, item);
            this.Data.push(infoData);

        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    大宗交易2.0
*/
function BlockTrading()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='BlockTrading';
    this.Explain='大宗交易';

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!data || !IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0; i<data.list.length; ++i)
        {
            var item=data.list[i];
            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.BLOCKTRADING;
            infoData.ExtendData=
            {
                Price:item.price,          //交易价格
                Premium:item.premium,      //溢价 （百分比%)
                Vol:item.vol,              //交易金额单位（万元)
                ClosePrice:item.close,     //收盘价
            };

            this.ReadArrayText(infoData, item);
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    龙虎榜 2.0
*/
function DragonTigerInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='DragonTigerInfo';
    this.Explain='龙虎榜';

    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!data || !IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0; i<data.list.length; ++i)
        {
            var item=data.list[i];

            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.DRAGON_TIGER;
            infoData.ExtendData=
            {
                BuyAmount:item.buyAmount,       //机构买入总额
                SellAmount:item.sellAmount,     //机构卖出总额
                NetBuyAmount:item.netBuyAmount, //机构买入净额
                NetBuyRatio:item.netBuyRatio,   //净买额占总成交比
                Amount:item.amount              //市场总成交额
            };
            this.ReadArrayText(infoData, item);
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//除权 2.0
function DividendInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='DividendInfo';
    this.Explain='除权';
    
    this.RecvData=function(recvData,param)
    {
        var data=recvData.data;
        if (!data || !IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0;i<data.list.length;++i)
        {
            var item=data.list[i];

            var infoData=new KLineInfoData();
            infoData.ID=item.id;
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.DIVIDEND;
            infoData.Title=item.title;
            infoData.ExtendData={ Type:item.type, url:item.url };
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//策略信息
function PolicyInfo() 
{
    this.newMethod = IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='PolicyInfo';
    this.Explain='策略信息';
    this.PolicyList = []; //筛选的策略名字 {Name:策略名, Guid:策略的GUID}

    this.SetPolicyList=function(aryPolicy)
    {
        for(let i in aryPolicy)
        {
            this.PolicyList.push({Name:aryPolicy[i]});
        }
    }

    this.RecvData = function (recvData, param) 
    {
        var data=recvData.data;
        if (!data || !IFrameSplitOperator.IsNonEmptyArray(data.list)) return;

        for(var i=0;i<data.list.length;++i)
        {
            var item=data.list[i];
            var infoData = new KLineInfoData();
            infoData.Date = item.date;
            infoData.InfoType = KLINE_INFO_TYPE.POLICY;
            infoData.ExtendData ={ AryData:[] };
            if (!IFrameSplitOperator.IsNonEmptyArray(item.policy)) continue;

            for (var j=0;j<item.policy.length;++j)
            {
                var name = item.policy[j].name;
                infoData.ExtendData.AryData.push({ Name: name });
            }
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
//  走势图信息地雷
//
//
////////////////////////////////////////////////////////////////////////////////////////////
function JSMinuteInfoMap() { }

JSMinuteInfoMap.InfoMap = new Map(
[
    ["大盘异动", { Create: function () { return new MarketEventInfo() } }],
]);

JSMinuteInfoMap.Get = function (id) 
{
    return JSMinuteInfoMap.InfoMap.get(id);
}

function IMinuteInfo() 
{
    this.Data;
    this.ClassName = 'IMinuteInfo';
}

//////////////////////////////////////////////////////////////////////
//  大盘异动
// 结构 {Date:日期 Time:时间, Title:标题, Type:0 }
////////////////////////////////////////////////////////////////////
function MarketEventInfo() 
{
    this.newMethod = IMinuteInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'MarketEventInfo';

    this.RequestData = function (hqChart) 
    {
        var self = this;
        this.Data = [];
        var param =
        {
            HQChart: hqChart
        };

        var url = g_JSChartResource.CacheDomain + '/cache/analyze/shszevent/marketevent/concept/' + hqChart.TradeDate + '.json';

        if (hqChart.NetworkFilter) {
            var obj =
            {
                Name: 'MarketEventInfo::RequestData', //类名::
                Explain: '大盘异动',
                Request: { Url: url, Type: 'Get', Data: { Date: hqChart.TradeDate, Symbol: hqChart.Symbol } },
                Self: this,
                PreventDefault: false
            };
            hqChart.NetworkFilter(obj, function (data) 
            {
                self.RecvData(data, param);
                param.HQChart.UpdataChartInfo();
                param.HQChart.Draw();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        //请求数据
        wx.request({
            url: url,
            method: "get",
            dataType: "json",
            success: function (recvData) {
                self.RecvData(recvData, param);
            },
            error: function (http, e) {
                console.warn("[MarketEventInfo::RequestData] error, http ", e, http);
            }
        });

        return true;
    }

    this.RecvData = function (recvData, param) 
    {
        var data=recvData.data;
        for (var i in data.event) 
        {
            var event = data.event[i];
            for (var j in event.data) 
            {
                var item = event.data[j];
                if (Array.isArray(item))
                {
                    if (item.length < 2) continue;
                    var info = { Date: event.date, Time: item[0], Title: item[1], Type: 0 };
                    this.Data.push(info);
                }
                else    //2.0 格式
                {
                    if (!IFrameSplitOperator.IsNumber(item.Date) || !IFrameSplitOperator.IsNumber(item.Time) || !item.Title) continue;
                    var info={ Date:item.Date, Time:item.Time, Title:item.Title, Type:0 };
                    if (item.Color) info.Color=item.Color;
                    if (item.BGColor) info.BGColor=item.BGColor;
                    if (IFrameSplitOperator.IsNumber(item.Price)) info.Price=item.Price;
                    if (item.Content) info.Content=item.Content;
                    if (item.Link) info.Link=item.Link;
                    this.Data.push(info);
                }
            }
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//导出统一使用JSCommon命名空间名
export
{
    JSKLineInfoMap,
    KLINE_INFO_TYPE,
    JSMinuteInfoMap,
};

/*
module.exports =
{
    JSCommonKLineInfo:
    {
        JSKLineInfoMap: JSKLineInfoMap,
        KLINE_INFO_TYPE: KLINE_INFO_TYPE,
        JSMinuteInfoMap: JSMinuteInfoMap,
    },

    //单个类导出
    JSCommon_JSKLineInfoMap: JSKLineInfoMap,
    JSCommon_KLINE_INFO_TYPE: KLINE_INFO_TYPE,
    JSCommon_JSMinuteInfoMap: JSMinuteInfoMap,
};
*/