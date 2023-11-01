/////////////////////////////////////////////////////////////////////////////
// 工作线程
//
//
////////////////////////////////////////////////////////////////////////////

importScripts("../jscommon/umychart.complier.js","../jscommon/umychart.js", "../jscommon/umychart.index.data.js","../jscommon/umychart.worker.js");

JSConsole.Complier.Log=()=>{ }

function JSSampleScriptWorker()
{
    this.newMethod=HQChartScriptWorker;   //派生
    this.newMethod();
    delete this.newMethod;

    this.NetworkFilter=function(data, callback, indexInfo, message)
    {
        //数据对接
        console.log(`[JSSampleScriptWorker::NetworkFilter] [${data.Name}][${data.Explain}] data=`, data);

        if (data.Name=="JSSymbolData::GetSymbolData")
        {
            var requestData=data.Request.Data;
            if (requestData.period==5)    //5分钟K线
            {
                var symbol=requestData.symbol;
                symbol=symbol.replace(".sh","");
                //http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000001&scale=5&ma=5&datalen=1023
                var url=`https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${symbol}&scale=5&ma=5&datalen=1023`;

                console.log(`[JSSampleScriptWorker::NetworkFilter] url=${url}`);

                var response=this.HttpRequest(url);
                if (response.response)
                {
                    var recv=JSON.parse(response.response);

                    this.RecvHistoryMinuteData(recv, callback, data);
                }
            }
        }
        
    }

    this.RecvHistoryMinuteData=function(recv, callback, data)
    {
        var hqChartData={code:0, data:[] };
        hqChartData.symbol=hqChartData.name=data.Request.Data.symbol;

        var yClose=null;
        for(var i=0;i<recv.length;++i)
        {
            var item=recv[i];

            var dateTime=new Date(item.day);
            var date=dateTime.getFullYear()*10000+(dateTime.getMonth()+1)*100+dateTime.getDate();
            var time=dateTime.getHours()*100+dateTime.getMinutes();

            var close=parseFloat(item.close);
            var high=parseFloat(item.high);
            var low=parseFloat(item.low);
            var open=parseFloat(item.open);
            var vol=parseFloat(item.volume);
            var amount=null;

            if (close==null) continue;

            var newItem=[ date, yClose, open, high, low, close, vol, amount, time];
            hqChartData.data.push(newItem);

            yClose=close;
        }

       
        console.log("[JSSampleScriptWorker::RecvHistoryMinuteData] hqchartData ", hqChartData)
        callback(hqChartData);
    }

    this.HttpRequest=function(url)
    {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.onerror=(e)=>{ 
            console.log(e);
        }
        req.send();
        return req;
    }
}

var g_ScriptWorker=new JSSampleScriptWorker();


g_ScriptWorker.Create();