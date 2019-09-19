/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    小程序信息地雷数据
*/

import {
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
} from './umychart.resource.wechat.js'

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
    TRADEDETAIL:10,              //龙虎榜

    POLICY:11                   //策略信息
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
            ["龙虎榜",      {Create:function(){ return new TradeDetail()}  }],
            ["策略选股",    {Create: function () { return new PolicyInfo() } }]
        ]
        );

    return infoMap.get(id);
}

function IKLineInfo()
{
    this.MaxReqeustDataCount=1000;
    this.StartDate=20160101;
    this.Data;

    this.GetToday=function()
    {
        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        return today;
    }
}

/*
    互动易
*/
function InvestorInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param={ HQChart:hqChart };
        this.Data=[];

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.Investor.ApiUrl,
            data:
            {
                "filed": ["question","answerdate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
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
        if (!data || !data.list || data.list.length<=0) return;

        for (var i in data.list)
        {
            var item = data.list[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.answerdate;
            infoData.Title=item.question;
            infoData.InfoType=KLINE_INFO_TYPE.INVESTOR;
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

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param={ HQChart:hqChart };
        this.Data=[];

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.Announcement.ApiUrl,
            data:
            {
                "filed": ["title","releasedate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
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
    业绩预告
*/
function PforecastInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        this.Data = [];
        var param={ HQChart:hqChart };

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.Pforecast.ApiUrl,
            data:
            {
                "field": ["pforecast.type","pforecast.reportdate","fweek"],
                "condition":
                [
                    {"item":["pforecast.reportdate","int32","gte",this.StartDate]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
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
        if (!data.stock || data.stock.length!=1) return;
        if (!data.stock[0].stockday || data.stock[0].stockday.length<=0) return;

        for (var i in data.stock[0].stockday)
        {
            var item = data.stock[0].stockday[i];
            if (item.pforecast.length>0)
            {
                var dataItem=item.pforecast[0];
                var infoData=new KLineInfoData();
                infoData.Date= item.date;
                infoData.Title=dataItem.type;
                infoData.InfoType=KLINE_INFO_TYPE.PFORECAST;
                infoData.ExtendData={ Type:dataItem.type, ReportDate:dataItem.reportdate}
                if(item.fweek)  //未来周涨幅
                {
                    infoData.ExtendData.FWeek={};
                    if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                    if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
                }
                this.Data.push(infoData);
            }
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
   投资者关系 (调研)
*/
function ResearchInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param= { HQChart:hqChart };

        this.Data=[];

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.Research.ApiUrl,
            data:
            {
                "filed": ["releasedate","researchdate","level","symbol","id"],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
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
        if (!data.list || data.list.length<=0) return;

        for (var i in data.list)
        {
            var item = data.list[i];
            var infoData=new KLineInfoData();
            infoData.ID=item.id;
            infoData.Date= item.researchdate;
            infoData.InfoType=KLINE_INFO_TYPE.RESEARCH;
            infoData.ExtendData={ Level:item.level };
            this.Data.push(infoData);

        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    大宗交易
*/
function BlockTrading()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param={ HQChart:hqChart,};
        this.Data=[];

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.BlockTrading.ApiUrl,
            data:
            {
                "field": ["blocktrading.price","blocktrading.vol","blocktrading.premium","fweek","price"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["blocktrading.vol","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
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
        if (!data || !data.stock || data.stock.length!=1) return;
        if (!data.stock[0].stockday || data.stock[0].stockday.length<=0) return;

        for (var i in data.stock[0].stockday)
        {
            var item = data.stock[0].stockday[i];
            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.BLOCKTRADING;
            infoData.ExtendData=
            {
                Price:item.blocktrading.price,          //交易价格
                Premium:item.blocktrading.premium,      //溢价 （百分比%)
                Vol:item.blocktrading.vol,              //交易金额单位（万元)
                ClosePrice:item.price,                  //收盘价
            };

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    龙虎榜
*/
function TradeDetail()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param={ HQChart:hqChart };

        this.Data=[];

        //请求数据
        wx.request({
            url: g_JSChartResource.Domain+g_JSChartResource.KLine.Info.TradeDetail.ApiUrl,
            data:
            {
                "field": ["tradedetail.typeexplain","tradedetail.type","fweek"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["tradedetail.type","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
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
        if (!data || !data.stock || data.stock.length!=1) return;
        if (!data.stock[0].stockday || data.stock[0].stockday.length<=0) return;

        for (var i in data.stock[0].stockday)
        {
            var item = data.stock[0].stockday[i];

            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.TRADEDETAIL;
            infoData.ExtendData={Detail:new Array()};

            for(var j in item.tradedetail)
            {
                var tradeItem=item.tradedetail[j]; 
                infoData.ExtendData.Detail.push({"Type":tradeItem.type,"TypeExplain":tradeItem.typeexplain});
            }

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

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

    this.PolicyList = []; //筛选的策略名字 {Name:策略名, Guid:策略的GUID}

    this.SetPolicyList=function(aryPolicy)
    {
        for(let i in aryPolicy)
        {
            this.PolicyList.push({Name:aryPolicy[i]});
        }
    }

    this.RequestData = function (hqChart) 
    {
        var self = this;
        this.Data = [];
        var param = { HQChart: hqChart };

        // setTimeout(function () { self.RecvData(null, param); }, 2000); //模拟数据到达

        //请求数据
        wx.request({
          url: g_JSChartResource.Domain + g_JSChartResource.KLine.Info.Policy.ApiUrl,
          data: {
            "symbol": [param.HQChart.Symbol],
            field: ["policy"],
            "condition": [
              { "item": ["date", "int32", "gte", this.StartDate, "lte", this.GetToday()] }],
            "start": 0,
            "end": this.MaxReqeustDataCount
          },
          method: "post",
          dataType: "json",
          success: function (recvData) {
            self.RecvData(recvData, param);
          }

        })

        return true;
    }

    this.RecvData = function (recvData, param) 
    {
        var data = recvData.data;
        if (!data.stock || data.stock.length != 1) return;
        if (!data.stock[0].stockday || data.stock[0].stockday.length <= 0) return;

        var setName=new Set();
        for(var i in this.PolicyList)   //把需要过滤的策略名字放set里, 方便后面过滤
        {
            setName.add(this.PolicyList[i].Name);
        }

        for (var i in data.stock[0].stockday)
        {
          var item = data.stock[0].stockday[i];
          var infoData = new KLineInfoData();
          infoData.Date = item.date;
          infoData.InfoType = KLINE_INFO_TYPE.POLICY;
          infoData.ExtendData = [];
          for (var j in item.policy)
          {
              var name = item.policy[j].name;
              if (setName.has(name)) infoData.ExtendData.push({ Name: name });
          }

          if (infoData.ExtendData.length>0) this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();

        if (param.HQChart.UpdateUICallback) param.HQChart.UpdateUICallback('RecvPolicyInfoData', this);
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
                if (item.length < 2) continue;
                var info = { Date: event.date, Time: item[0], Title: item[1], Type: 0 };
                this.Data.push(info);
            }
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//导出统一使用JSCommon命名空间名
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