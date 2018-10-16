/////////////////////////////////////////////////////////////////////////
// 通达信语法 webapi 处理类
//

var JSComplier=require('./umychart.complier.node').JSCommonComplier.JSComplier;


////////////////////////////////////////////////////////////////////////////
// 单脚本  多股票 返回数据>0的股票
//  symbol:[] 股票列表
//  code: 脚本
//  args: 脚本参数 (可选)
//  datecount: 日线数据计算多少天 (可选)
//  daycount： 分钟数据计算多少天 (可选)
//  period:  周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 (可选)
//  right:   复权 0 不复权 1 前复权 2 后复权(可选)
//  
/*  post 数据:
{
    "symbol":["600000.sh","000001.sz","000008.sz","000017.sz","000056.sz","000338.sz","000408.sz","000415.sz","000498.sz","000557.sz"],
    "code":"LC:= REF(CLOSE,1);RSI1:=SMA(MAX(CLOSE-LC,0),6,1)/SMA(ABS(CLOSE-LC),6,1)*100;OUT:CROSS(RSI1,20);"
    "args":[{"name":"N1","value":10},{"name":"N2","value":12}],
    "datecount":200, 
}
*/

function JSComplierController(req,res,next)
{
    this.Request=req;
    this.Response=res;
    this.Next=next;

    this.DateCount=300;
    this.DayCount=20;
    this.Period=0;
    this.Right=0;

    this.StockList;
    this.Code;
    this.StartTime=new Date();

    this.Result={};     //返回数据
    this.CacheData;
    
    this.Post=function()
    {
        var postData=this.Request.body;
        if (!postData) return this.Error({Message:'post data is empty'});

        this.StockList=postData.symbol;
        if (!this.StockList || !this.StockList.length) return this.Error({Message:'symbol is empty'});

        this.Code=postData.code;
        if (!this.Code) return this.Error({Message:'code is empty'});

        var args=[];
        if (postData.args) 
        {
            for(let i in postData.args) //变量全部转成大写
            {
                var item=postData.args[i];
                if (item.Name) args.push({Name:item.name, Value:parseFloat(item.value)});  //变量值转数值型
            }
        }

        if (postData.datecount) this.DateCount=postData.datecount;
        if (postData.daycount) this.DayCount=postData.daycount;
        if (postData.period) this.Period=postData.period;
        if (postData.right) this.Right=postData.right;

        var self=this;
        this.CacheData=new Map();

        for(let i in this.StockList)
        {
            var symbol=this.StockList[i];
            let option=
            {
                HQDataType:0,
                Symbol:symbol, Name:null,Data:null,
                MaxReqeustDataCount:this.DateCount, MaxRequestMinuteDayCount:this.DayCount,
                Right:this.Right, Period:this.Period,
                Arguments:args,
                CallbackParam: { Symbol:symbol },
                Callback:function(data,param)       //数据计算完成回调
                { 
                    self.RecvExecuteData(data,param);
                },
                ErrorCallback:function(e,param)
                {
                    self.ErrorExecute(e,param);
                }
            }

            var run=JSComplier.Execute(this.Code,option);
        };

        next();
    }

    this.Get=function()
    {

    }

    //执行脚本返回数据
    this.RecvExecuteData=function(data,param)  
    {
        console.log(data);  //单个股票计算结果
        this.CacheData.set(param.Symbol,data);

        if (this.CacheData.size==this.StockList.length) //等所有股票计算完了 返回数据 result
        {
            this.SendResult();
        }
    }

    //执行脚本错误
    this.ErrorExecute=function(e,param)
    {
        this.CacheData.set(param.Symbol,null);

        if (this.CacheData.size==this.StockList.length) //等所有股票计算完了 返回数据 result
        {
           this.SendResult();
        }
    }

    this.AnalysisData=function(data)
    {
        var result=[];
        for(let item of data)
        {
            var stockData=item[1];
            if (stockData==null || !stockData.length) continue;

            var outData=stockData[0];
            if (outData.Data==null || !outData.Data.length) continue;

            var value=outData.Data[outData.Data.length-1];  //选中最后一天数据结果>0的数据
            if (!value) continue;

            var date=null;
            for(let i in stockData)
            {
                var itemData=stockData[i];
                if (itemData.Type===100 && itemData.Name==='TradeDate' && itemData.Data.length>outData.Data.length-1)
                {
                    date=itemData.Data[outData.Data.length-1];
                    break;
                }
            }
            
            result.push({Symbol:item[0], Value:value, Date:date});
        }

        return result;
    }

    this.SendResult=function()
    {
        this.Result.Data=this.AnalysisData(this.CacheData);
        var nowDate=new Date();
        this.Result.Ticket=nowDate.getTime() - this.StartTime.getTime();

        //字段全部小写
        var result={ ticket:this.Result.Ticket, data:this.Result.Data, code:this.Code };
        this.Response.header("Access-Control-Allow-Origin", "*");
        this.Response.send(result);
    }

    this.Error=function(e)
    {

    }
}

JSComplierController.Post=function(req, res, next)
{
    var controller=new JSComplierController(req,res,next);
    controller.Post();
}


///////////////////////////////////////////////////////////////////////
// 多脚本 多股票  交集|并集 开发中
//
function JSCommonMultiComplier(req,res,next)
{
    this.Request=req;
    this.Response=res;
    this.Next=next;

    this.StockList;
    this.Code;
    this.StartTime=new Date();

    this.Result={};     //返回数据
    this.CacheData;
}

JSCommonMultiComplier.Post=function(req, res, next)
{
    var controller=new JSCommonMultiComplier(req,res,next);
    controller.Post();
}


//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonComplierController:
    {
        JSComplierController: JSComplierController,
        JSCommonMultiComplier: JSComplierController,
    },

};


/*  
//测试用例
var server = restify.createServer({name:'jccomplier.testserver'});
server.use(restify.plugins.bodyParser());   //支持json post
server.use(restify.plugins.fullResponse()); //跨域
server.use(restify.plugins.gzipResponse()); //支持压缩

server.post('/api/jscomplier',JSComplierController.Post);

server.listen(18080, function() 
{
  console.log('%s listening at %s', server.name, server.url);
});
*/