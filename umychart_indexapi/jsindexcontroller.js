/////////////////////////////////////////////////////////////////////////
// 通达信语法 webapi 处理类
//

var HQChart=require('./jscommon/umychart.node');


////////////////////////////////////////////////////////////////////////////
//  symbol:[] 股票列表
//  code: 脚本
//  args: 脚本参数 (可选)
//  maxdatacount: 日线数据计算多少天 (可选)
//  maxminutedaycount： 分钟数据计算多少天 (可选)
//  period:  周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 (可选)
//  right:   复权 0 不复权 1 前复权 2 后复权(可选)
//  
/*  post 数据:
{
    "symbol":"600000.sh",
    "indexname":"MA",
    "args":[{"name":"N1","value":10},{"name":"N2","value":12}],
    "maxdatacount":200, 
}

返回数据
{
    "code":0, 0=成功 1=失败
    "ticket":131,
    "outdata":
    [
        date:[],
        time:[],
        outvar:[{name:'ma1', data:[]}, .....]
        stock: { name: , symbol:}
    ],
*/

function JSIndexController(req,res,next)
{
    this.Request=req;
    this.Response=res;
    this.Next=next;
    this.StartTime=new Date();

    this.DataCount={ MaxDataCount: 500, MaxMinuteDayCount:5 };
    this.Period=0;
    this.Right=0;
    this.Symbol;
    this.IndexName;
    this.Script;            //脚本 
    this.Args=[];           //参数

    this.ErrorMessage=null;      //脚本执行错误
    this.OutData;           //输出变量值 {outvar:[{name: , data:[] }], date:[], time:[] }
    
    this.GetPostData=function()
    {
        var postData=this.Request.body;
        if (!postData) 
        {
            this.ErrorMessage='post data is empty';
            return false;
        }

        this.Symbol=postData.symbol;
        if (!this.Symbol) 
        {
            this.ErrorMessage='symbol is empty';
            return false;
        }

        this.IndexName=postData.indexname;
        if (!this.IndexName) 
        {
            this.ErrorMessage='index name is empty';
            return false;
        }

        var scriptData = new HQChart.JSIndexScript();
        var indexInfo = scriptData.Get(this.IndexName);
        if (!indexInfo)
        {
            this.ErrorMessage=`can't find ${this.IndexName}`;
            return false;
        }
        this.Script=indexInfo.Script;

        if (postData.args)  //参数
        {
            for(var i in postData.args) //变量全部转成大写
            {
                var item=postData.args[i];
                if (item.name) this.Args.push({Name:item.name, Value:parseFloat(item.value)});  //变量值转数值型
            }
        }
        else if (indexInfo.Args)
        {
            for(var i in indexInfo.Args) //变量全部转成大写
            {
                var item=indexInfo.Args[i];
                if (item.Name) this.Args.push({Name:item.Name, Value:item.Value});  //变量值转数值型
            }
        }

        if (postData.maxdatacount>0) this.DataCount.MaxDataCount=postData.maxdatacount;
        if (postData.maxminutedaycount>0) this.DataCount.MaxMinuteDayCount=postData.maxminutedaycount;

        if (postData.period>0) this.Period=postData.period; //周期
        if (postData.right>0) this.Right=postData.right;    //复权

        return true;
    }
    
    this.Post=function()
    {
        if (!this.GetPostData())
        {
            this.SendResult();
            return;
        }
        
        var self=this;
        var obj=
        {
            Name:this.IndexName, ID:this.IndexName, 
            Args:this.Args,
            Script:this.Script,
            ErrorCallback:function(error) { self.ExecuteError(error); },
            FinishCallback:function(data, jsExectute) { self.ExecuteFinish(data, jsExectute); }
        }

        var indexConsole=new HQChart.ScriptIndexConsole(obj);

        var stockObj=
        {
            HQDataType:HQChart.HQ_DATA_TYPE.KLINE_ID,
            Stock: {Symbol:this.Symbol},
            Request: this.DataCount,
            Period:this.Period , Right:this.Right
        };

        indexConsole.ExecuteScript(stockObj);

        next();
    }

    //执行脚本返回数据
    this.ExecuteFinish=function(data, jsExectute)  
    {
        this.OutData={outvar:[]};
        this.OutData.date=data.Date;
        if(data.Time) this.OutData.time=data.Time;
        this.OutData.stock={ name:data.Stock.Name, symbol:data.Stock.Symbol };

        this.OutData.args=[];
        if (this.Args)
        {
            for(var i in this.Args)
            {
                var item=this.Args[i];
                this.OutData.args.push({name:item.Name, value:item.Value});
            }
        }

        for(var i in data.Out)
        {
            var item=data.Out[i];
            var outItem={name:item.Name, data:item.Data, type:item.Type};
            if (item.Color) outItem.color=item.Color;
            if (item.LineWidth) outItem.linewidth=item.LineWidth;
            if (item.IsShow==false) outItem.isshow = false;
            if (item.IsExData==true) outItem.isexdata = true;
            if (item.Draw) outItem.Draw=item.Draw;  //Draw里面数据太多了, 返回数据字段就不转写成小写了, 太麻烦了
            this.OutData.outvar.push(outItem);
        }

        this.SendResult();
    }

    //执行脚本错误
    this.ExecuteError=function(error)
    {
        this.ErrorMessage=error;
        this.SendResult();
    }

    this.SendResult=function()
    {
        var nowDate=new Date();
        var ticket=nowDate.getTime() - this.StartTime.getTime();

        this.Response.header("Access-Control-Allow-Origin", "*");
        if (this.ErrorMessage)
        {
            //返回数据 json 字段全部小写
            this.Response.send({ code:1, error:this.ErrorMessage, ticket:ticket });
        }
        else
        {
            //返回数据 json 字段全部小写
            this.Response.send({ code:0, outdata:this.OutData, ticket:ticket });
        }
    }
}

JSIndexController.Post=function(req, res, next)
{
    var controller=new JSIndexController(req,res,next);
    controller.Post();
}


//导出统一使用JSCommon命名空间名
module.exports=
{
    JSIndexController: JSIndexController,
};


/*  
//测试用例
var server = restify.createServer({name:'jccomplier.testserver'});
server.use(restify.plugins.bodyParser());   //支持json post
server.use(restify.plugins.fullResponse()); //跨域
server.use(restify.plugins.gzipResponse()); //支持压缩

server.post('/api/jscomplier',JSComplierController.Post);
server.post('/api/jsmcomplier',JSCommonMultiComplier.Post);

server.listen(18080, function() 
{
  console.log('%s listening at %s', server.name, server.url);
});
*/