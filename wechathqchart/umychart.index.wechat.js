/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    指标基类及定制指标
*/

import {
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
} from './umychart.resource.wechat.js'

//图形库
import {
    JSCommonChartPaint_IChartPainting as IChartPainting,
    JSCommonChartPaint_ChartSingleText as ChartSingleText,
    JSCommonChartPaint_ChartLine as ChartLine,
    JSCommonChartPaint_ChartPointDot as ChartPointDot,
    JSCommonChartPaint_ChartStick as ChartStick,
    JSCommonChartPaint_ChartLineStick as ChartLineStick,
    JSCommonChartPaint_ChartStickLine as ChartStickLine,
    JSCommonChartPaint_ChartOverlayKLine as ChartOverlayKLine,
    JSCommonChartPaint_ChartMinuteInfo as ChartMinuteInfo,
    JSCommonChartPaint_ChartPie as ChartPie,
    JSCommonChartPaint_ChartCircle as ChartCircle,
    JSCommonChartPaint_ChartChinaMap as ChartChinaMap,
    JSCommonChartPaint_ChartRadar as ChartRadar,
} from "./umychart.chartpaint.wechat.js";

//////////////////////////////////////////////////////////
//
//  指标信息
//
function IndexInfo(name, param) 
{
    this.Name = name;                 //名字
    this.Param = param;               //参数
    this.LineColor;                 //线段颜色
    this.ReqeustData = null;          //数据请求
}

function BaseIndex(name)
 {
    this.Index;               //指标阐述
    this.Name = name;         //指标名字
    this.UpdateUICallback;    //数据到达回调

    //默认创建都是线段
    this.Create = function (hqChart, windowIndex) 
    {
        for (var i in this.Index) 
        {
            if (!this.Index[i].Name) continue;

            var maLine = new ChartLine();
            maLine.Canvas = hqChart.Canvas;
            maLine.Name = this.Name + '-' + i.toString();
            maLine.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            maLine.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
            maLine.Color = this.Index[i].LineColor;

            hqChart.ChartPaint.push(maLine);
        }
    }

    //指标不支持 周期/复权/股票等
    this.NotSupport = function (hqChart, windowIndex, message) 
    {
        var paint = hqChart.GetChartPaint(windowIndex);
        for (var i in paint) 
        {
            paint[i].Data.Data = [];    //清空数据
            if (i == 0) paint[i].NotSupportMessage = message;
        }
    }

    //格式化指标名字+参数
    //格式:指标名(参数1,参数2,参数3,...)
    this.FormatIndexTitle = function () 
    {
        var title = this.Name;
        var param = null;

        for (var i in this.Index) 
        {
            var item = this.Index[i];
            if (item.Param == null) continue;

            if (param) param += ',' + item.Param.toString();
            else param = item.Param.toString();
        }

        if (param) title += '(' + param + ')';

        return title;
    }

    this.InvokeUpdateUICallback = function (paint) 
    {
        if (typeof (this.UpdateUICallback) != 'function') return;

        let indexData = new Array();
        for (let i in paint) 
        {
            indexData.push({ Name: this.Index[i].Name, Data: paint[i].Data });
        }

        this.UpdateUICallback(indexData);
    }
}

//市场多空
function MarketLongShortIndex() 
{
    this.newMethod = BaseIndex;   //派生
    this.newMethod('市场多空');
    delete this.newMethod;

    this.Index = new Array(
        new IndexInfo("多空指标", null),
        new IndexInfo("多头区域", null),
        new IndexInfo("空头区域", null)
    );

    this.Index[0].LineColor = g_JSChartResource.Index.LineColor[0];
    this.Index[1].LineColor = g_JSChartResource.UpBarColor;
    this.Index[2].LineColor = g_JSChartResource.DownBarColor;

    this.LongShortData; //多空数据

    this.Create = function (hqChart, windowIndex) {
        for (var i in this.Index) {
            var paint = null;
            if (i == 0)
                paint = new ChartLine();
            else
                paint = new ChartStraightLine();

            paint.Color = this.Index[i].LineColor;
            paint.Canvas = hqChart.Canvas;
            paint.Name = this.Name + "-" + i.toString();
            paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData = function (hqChart, windowIndex, hisData) {
        var self = this;
        var param =
        {
            HQChart: hqChart,
            WindowIndex: windowIndex,
            HistoryData: hisData
        };

        this.LongShortData = [];

        if (param.HQChart.Period > 0)   //周期数据
        {
            this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        wx.request({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (recvData) {
                self.RecvData(recvData, param);
            }
        });

        return true;
    }

    this.RecvData = function (recvData, param) {
        if (recvData.data.data.length <= 0) return;

        var aryData = new Array();
        for (var i in recvData.data.data) {
            var item = recvData.data.data[i];
            var indexData = new SingleData();
            indexData.Date = item[0];
            indexData.Value = item[1];
            aryData.push(indexData);
        }

        var aryFittingData = param.HistoryData.GetFittingData(aryData);

        var bindData = new ChartData();
        bindData.Data = aryFittingData;
        bindData.Period = param.HQChart.Period;   //周期
        bindData.Right = param.HQChart.Right;     //复权

        this.LongShortData = bindData.GetValue();
        this.BindData(param.HQChart, param.WindowIndex, param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();

    }


    this.BindData = function (hqChart, windowIndex, hisData) {
        var paint = hqChart.GetChartPaint(windowIndex);

        if (paint.length != this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data = this.LongShortData;
        paint[0].NotSupportMessage = null;
        paint[1].Data.Data[0] = 8;
        paint[2].Data.Data[0] = 1;

        //指定[0,9]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 9, Min: 0, Count: 3 };

        var titleIndex = windowIndex + 1;

        for (var i in paint) {
            hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, this.Index[i].Name, this.Index[i].LineColor);
            if (i > 0) hqChart.TitlePaint[titleIndex].Data[i].DataType = "StraightLine";
        }

        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

        if (hqChart.UpdateUICallback) hqChart.UpdateUICallback('MarketLongShortIndex', paint, { WindowIndex: windowIndex, HistoryData: hisData });  //通知上层回调
        return true;
    }

}



module.exports =
{
    JSCommonIndex:
    {
        IndexInfo: IndexInfo,
        BaseIndex: BaseIndex,
    },

    //单个类导出
    JSCommonIndex_IndexInfo: IndexInfo,
    JSCommonIndex_BaseIndex: BaseIndex,
};
