///////////////////////////////////////////////////////////////////////////////////
//  工作线程计算指标示例
//
//
//////////////////////////////////////////////////////////////////////////////////

function HQChartScriptWorker()
{
    this.Status=0;  //0=空闲  1=运行
    this.Create=function()
    {
        addEventListener('message', (obj)=>{ this.OnRecvMessage(obj); });
    }

    this.NetworkFilter=function(data, callback, indexInfo)
    {
        JSConsole.Complier.Log(`[HQChartScriptWorker::NetworkFilter] [${data.Name}][${data.Explain}] data=`, data);
        //数据下载
    }

    this.ExecuteScript=function(indexData, message)
    {
        var scriptObj={ };
        
        if (indexData.Script)
        {
            scriptObj.Name=indexData.Name;
            scriptObj.ID=indexData.Index;
            scriptObj.Script=indexData.Script;
        }
        else
        {
            if (!indexData.Index) return false;
            var scriptData = new JSIndexScript();
            var finder = scriptData.Get(indexData.Index);
            if (!finder) return false;

            scriptObj.ID=indexData.Index;
            scriptObj.Name=finder.Name;
            scriptObj.Script=finder.Script;
            scriptObj.Args=finder.Args;
        }

        if (indexData.Args) scriptObj.Args=indexData.Args;
        if (IFrameSplitOperator.IsBool(message.IsApiPeriod)) scriptObj.IsApiPeriod=message.IsApiPeriod;

        var indexInfo={ Name:scriptObj.Name, ID:scriptObj.ID, Script:scriptObj.Script, Args:scriptObj.Args, Guid:message.Guid };
        scriptObj.ErrorCallback=(error)=>{ this.OnExecuteError(error, indexInfo, message); };
        scriptObj.FinishCallback=(data, jsExectute)=>{ this.OnExecuteFinish(data, indexInfo, jsExectute, message); };
        scriptObj.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback, indexInfo, message); };

        JSConsole.Complier.Log('[HQChartScriptWorker::ExecuteScript] scriptObj=',scriptObj);

        var indexConsole=new ScriptIndexConsole(scriptObj);

        var hisData=null;
        if (message && message.Data)
        {
            hisData=new ChartData();
            hisData.Data=message.Data;
            hisData.Right=message.Right;
            hisData.Period=message.Period;
            hisData.DataType=message.DataType; //0=日线 1=分钟
            hisData.Symbol=message.symbol;
        }

        var stockObj=
        {
            HQDataType:HQ_DATA_TYPE.KLINE_ID,
            Stock: { Symbol:message.Symbol },
            Request: { MaxDataCount: 500, MaxMinuteDayCount:5 },
            Period:message.Period , Right:message.Right,
            Data:hisData
        };

        if (IFrameSplitOperator.IsNumber(message.HQDataType)) stockObj.HQDataType=message.HQDataType;
       

        indexConsole.ExecuteScript(stockObj);
    }

    this.OnRecvMessage=function(message)
    {
        var data=message.data;
        if (!data) return;

        if (data.ID==JSCHART_WORKER_MESSAGE_ID.EXECUTE_SCRIPT)
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(data.AryIndex)) return;

            for(var i=0;i<data.AryIndex.length;++i)
            {
                var item=data.AryIndex[i];
                this.Status=1;  //执行状态
                this.ExecuteScript(item,data);
            }

            this.Status=0;
        }
    }
    
    this.OnExecuteFinish=function(data, indexInfo, jsExectute, jobInfo)
    {
        var message={ Data:data, IndexInfo:indexInfo , ID:JSCHART_WORKER_MESSAGE_ID.FINISH_EXECUTE_SCRIPT, JobInfo:jobInfo };
        postMessage(message);
    }

    this.OnExecuteError=function(error, indexInfo, jobData)
    {
        var message={ IndexInfo:indexInfo, ID:JSCHART_WORKER_MESSAGE_ID.ERROR_EXECUTE_SCRIPT, Error:error };
        postMessage(message);
    }
}

