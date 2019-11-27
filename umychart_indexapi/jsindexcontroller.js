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
    this.Name;
    this.Script;            //脚本 
    this.Args=[];           //参数
    this.HQDataType=HQChart.HQ_DATA_TYPE.KLINE_ID;
    this.DayCount;

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
        this.Name=this.IndexName;

        if (postData.script)
        {
            this.Script=postData.script;
        }
        else
        {
            var scriptData = new HQChart.JSIndexScript();
            var indexInfo = scriptData.Get(this.IndexName);
            if (!indexInfo)
            {
                this.ErrorMessage=`can't find ${this.IndexName}`;
                return false;
            }
            this.Script=indexInfo.Script;
            this.Name=indexInfo.Name;

            if (indexInfo.Args)
            {
                for(var i in indexInfo.Args) //变量全部转成大写
                {
                    var item=indexInfo.Args[i];
                    if (item.Name) this.Args.push({Name:item.Name, Value:item.Value});  //变量值转数值型
                }
            }
        }

        if (!this.Script)
        {
            this.ErrorMessage='script is empty';
            return false;
        }

        if (postData.args)  //参数
        {
            this.Args=[];
            for(var i in postData.args) //变量全部转成大写
            {
                var item=postData.args[i];
                if (item.name) this.Args.push({Name:item.name, Value:parseFloat(item.value)});  //变量值转数值型
            }
        }

        if (postData.maxdatacount>0) this.DataCount.MaxDataCount=parseInt(postData.maxdatacount);
        if (postData.maxminutedaycount>0) this.DataCount.MaxMinuteDayCount=parseInt(postData.maxminutedaycount);

        if (postData.period>0) this.Period=parseInt(postData.period); //周期
        if (postData.right>0) this.Right=parseInt(postData.right);    //复权
        if (postData.hqdatatype>0) this.HQDataType=parseInt(postData.hqdatatype);
        if (postData.daycount>0) this.DayCount=parseInt(postData.daycount);

        return true;
    }
    
    this.Post=function()
    {
        if (!this.GetPostData())
        {
            this.SendResult();
            return next();
        }
        
        try
        {
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
                HQDataType:this.HQDataType,
                Stock: {Symbol:this.Symbol},
                Request: this.DataCount,
                Period:this.Period , Right:this.Right
            };

            if (this.HQDataType===HQChart.HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) stockObj.DayCount=this.DayCount;

            indexConsole.ExecuteScript(stockObj);
        }
        catch(error)
        {
            this.ErrorMessage='执行异常';
            this.SendResult();
        }

        return next();
    }

    //执行脚本返回数据
    this.ExecuteFinish=function(data, jsExectute)  
    {
        this.OutData={ outvar:[], hqdatatype:this.HQDataType, name:this.Name };
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

        //var outItem={name:'MULTI_LINE', type:1};
        //var point1={Point:[{Date:20190909, Value:15.5},{Date:20190909, Value:14.5}, {Date:20190910, Value:14.2} , {Date:20190911, Value:14.05}], Color:'rgb(244,55,50)'};
        //var point2={Point:[{Date:20190812, Value:14.5}, {Date:20190815, Value:14.2} , {Date:20190822, Value:14.15}], Color:'rgb(0,55,50)'};
        //var point1={Point:[{ Date:20190925,Time:1025, Value:15.5},{Date:20190925, Time:1022, Value:14.5}, {Date:20190925, Time:1311, Value:14.6} , {Date:20190926,Time:1401, Value:14.05}], Color:'rgb(244,55,50)'};
        //var point2={Point:[{Date:20190926, Time:945, Value:14.5}, {Date:20190927, Time:1011, Value:14.2} , {Date:20190927, Time:1425, Value:14.15}], Color:'rgb(0,55,50)'};
        //outItem.Draw={ DrawType:'MULTI_LINE', DrawData:[point1,point2] };

        //var outItem={name:'MULTI_TEXT', type:1};
        //var texts=[{Date:20190926, Time:945, Value:14.5, Text:'111111',Color:'rgb(244,255,50)'}, {Date:20190927, Time:1011, Value:14.2,Text:'33333',Color:'rgb(0,55,50)'} , {Date:20190927, Time:1425, Value:14.15,Text:'22222'}];
        //outItem.Draw={ DrawType:'MULTI_TEXT', DrawData:texts };
        //this.OutData.outvar.push(outItem);


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

var g_MongoConfig;
JSIndexController.SetMongodb=function(option)
{
    g_MongoConfig={ Url:option.Url, DBName:option.DBName, TableName:option.TableName };
}

JSIndexController.LoadIndex=function(option)  //加载指标
{
    var indexData=new JSMongoIndex();
    indexData.Load(option);
}

JSIndexController.ReloadIndex=function(req, res, next)
{
    var controller=new JSUpateIndexController(req, res, next);
    controller.Post();
}

JSIndexController.SetDomain=function(domain, cacheDomain)
{
    HQChart.ScriptIndexConsole.SetDomain (domain, cacheDomain)   //修改API地址
}

//更新单个指标脚本
function JSUpateIndexController(req,res,next)
{
    this.Request=req;
    this.Response=res;
    this.Next=next;
    this.StartTime=new Date();
    this.IndexID;
    this.ErrorMessage;

    this.GetPostData=function()
    {
        var postData=this.Request.body;
        if (!postData) 
        {
            this.ErrorMessage='post data is empty';
            return false;
        }

        this.IndexID=postData.indexid;
        if (!this.IndexID) 
        {
            this.ErrorMessage='index is is empty';
            return false;
        }

        return true;
    }

    this.Post=function()
    {
        if (!this.GetPostData())
        {
            this.SendResult();
            return next();
        }

        var indexData=new JSMongoIndex();
        indexData.Load(
            {
                IndexID:this.IndexID,
                Success:(data)=> { this.UpdateSuccess(data); }
            }
        );

        return next();
    }

    this.UpdateSuccess=function(data)
    {
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
            this.Response.send({ code:0, ticket:ticket });
        }
    }
}


function JSMongoIndex()
{
    this.Load=function(option)
    {
        const MongoClient = require('mongodb').MongoClient;
        const assert = require('assert');
        const config=g_MongoConfig;
        if (!config) return;
        
        var self=this;
        MongoClient.connect(config.Url, { useUnifiedTopology: true , useNewUrlParser: true  }, 
            function(err, client) 
            {
                assert.equal(null, err);
                var db = client.db(config.DBName);
                if (option && option.IndexID)
                {
                    db.collection(config.TableName). find({'id':option.IndexID}).toArray(function(err, result) { // 返回单个查询数据
                        if (err) throw err;
                        self.RecvData(result);
                        client.close();
                        if (option && option.Success) option.Success(this.Data);
                    });
                }
                else
                {
                    db.collection(config.TableName). find({}).toArray(function(err, result) { // 返回集合中所有数据
                        if (err) throw err;
                        self.RecvData(result);
                        client.close();
                        if (option && option.Success) option.Success(this.Data);
                    });
                }
            }
        );
    }

    this.Data=[];

    this.RecvData=function(data)
    {
        this.Data=[];
        for(var i in data)
        {
            var item=data[i];
            var indexItem={Name:item.name, Args:null, Script:item.script, ID:item.id, IsMainIndex:false};
            if (item.args && item.args.length>0)
            {
                indexItem.Args=[];
                for(var j in item.args)
                {
                    var argItem=item.args[j];
                    indexItem.Args.push({Name:argItem.name, Value:argItem.value});
                }
            }

            if (item.ismainindex==true) indexItem.IsMainIndex=true;
            this.Data.push(indexItem);
        }

        console.log('[JSMongoIndex::RecvData] add index ',this.Data)
        HQChart.JSIndexScript.AddIndex(this.Data);
    }
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