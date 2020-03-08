/*
        微信接口的个股新闻
*/

function JSNewsResource() 
{
    this.Domain = "https://opensource.zealink.com";               //API域名
    this.CacheDomain = "https://opensourcecache.zealink.com";     //缓存域名
}

var g_JSNewsResource = new JSNewsResource();


function JSNews()
{
  
}

JSNews.SetDomain = function (domain, cacheDomain) 
{
    if (domain) g_JSNewsResource.Domain = domain;
    if (cacheDomain) g_JSNewsResource.CacheDomain = cacheDomain;
}

//获取新闻列表
JSNews.GetNews=function(symbol,newsType)
{
    switch(newsType)
    {
        case NEWS_TYPE.STOCK_NEWS:
            return new StockNews(symbol);
        case NEWS_TYPE.ANNOUNCEMENT_ANALYSE:
            return new AnnouncementAnalyse(symbol);
        case NEWS_TYPE.STOCK_INTERACT:
            return new StockInteract(symbol);
        case NEWS_TYPE.STOCK_NEGATIVE:
            return new StockNegative(symbol);
        case NEWS_TYPE.STOCK_REPORT:
            return new StockReport(symbol);
    }
}
//获取新闻内容
JSNews.GetContent = function (id, newsType) {
  switch (newsType) {
    case NEWS_TYPE.STOCK_NEWS:
      return new StockNewsContent(id);
  }
}

//新闻类型
var NEWS_TYPE=
{
    STOCK_NEWS:1,              //个股新闻
    ANNOUNCEMENT_ANALYSE:2,    //公告解读
    STOCK_INTERACT:3,          //互动易
    STOCK_NEGATIVE:4,          //负面新闻
    STOCK_REPORT:5,
}

//新闻资讯基类
function INewsBase(symbol)
{
    this.Symbol = symbol;         //股票代码
    this.Name;                    //股票名称
    this.Callback;                //回调 function(info,news) info: {Start:请求的新闻起始位置 , End:新闻的结束位置 } , news 对应的 新闻类

    this.Data = new Array();                  //新闻数据  { Date:日期, Title:标题 , Source:来源, ID:新闻ID}
    this.Count;                 //一共的新闻个数
    this.CacheCount;            //已下载的新闻个数
    this.PageSize=10;           //每页的新闻个数
    this.ApiUrl;                //数据请求地址

    this.StartDate;             //开始时间
    this.EndDate;               //结束时间

    //设置默认的查询区间
    this.SetDefautQueryDate=function()
    {
        // 取最近1年的数据
        let date = new Date();
        this.StartDate = (date.getFullYear()-1) * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        this.EndDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    }

    //把查询的股票统一转化为数组
    this.GetQuerySymbol=function()
    {
        let arySymbol=new Array();
        if (typeof(this.Symbol)=='string') arySymbol.push(this.Symbol); //单个股票
        else arySymbol=this.Symbol.slice(0);

        return arySymbol;
    }

    //是否是最后一页
    this.IsEndPage=function()
    {
        if (this.Count==null || this.Count<=0) return true;

        return this.CacheCount>=this.Count;

    }

    //获取第1页
    this.GetFirstPage=function()
    {
      
    }

    //下拉获取下一页
    this.GetNextPage=function()
    {

    }
}

//新闻详情基类
function INewsContent(id) 
{
  this.ID = id;     //新闻id
  this.Symbol;      //股票代码
  this.Name;        //股票名称
  this.ApiUrl;
  this.Callback;  //回调 function(this)
  this.Data;      //数据 { Symbol:代码, Name:名称, Title:标题, Content:内容, Date:日期 .....}
  this.Error;     //如果调用失败 把错误信息写这里
 

  this.GetContent = function () 
  {

  }
}

//个股新闻
function StockNews(symbol)
{
    this.newMethod=INewsBase;   //派生
    this.newMethod(symbol);
    delete this.newMethod;

    var date = new Date();
    this.EndDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();     //获取结束时间
    this.StartDate = (date.getFullYear() - 1) * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    
    this.ApiUrl = g_JSNewsResource.Domain+'/API/NewsStockList';

    var self = this;

    //获取第1页
    this.GetFirstPage=function()
    {
      //清空数据
      this.Data = [];
      this.Count = 0;
      this.CacheCount = 0;

      $.ajax({
        url: this.ApiUrl,
        data: {
          "symbol": [this.Symbol],
          "filed": ["name", "symbol", "releasedate", "title", "id", "source"],
          "querydate": { "StartDate": this.StartDate, "EndDate": this.EndDate },
          "search": null,
          "calccount": -1,
          "start": 0,
          "end": 10,
          "userid": null
        },
        method: "POST",
        dataType: "json",
        success: function (data) {
          self.RecvData(data);
        },
        error: function (request) {
          this.RecvError(request);
        }
      });
    }


    this.RecvData = function(data)
    {
        if (this.Count <= 0) this.Count = data.count; 

        var info = {};
        info.Start = this.Data.length;
        info.End = this.Data.length;
      
        var list=data.list;
        for (var i in list)
        {
            var item = list[i];
            this.Data.push({
              ID: item.id,
              Name:item.name,
              Releasedate: item.releasedate,
              Source: item.source,
              Symbol: item.symbol,
              Title: item.title
            })
            if (i > 0)  ++info.End;
        }

        this.CacheCount = this.Data.length;
        this.InvokeCallback(info);  //通知页面
    }

    this.RecvError = function (request) {
      console.log("[StockInteract::RecvError] ", request)
    }

    this.InvokeCallback = function(){
      if (typeof (this.Callback) != 'function') return;
      
      var info = {};
      this.Callback(info,this);
    }


    //下拉获取下一页
    this.GetNextPage=function()
    {
      var self = this;

      var start = this.Data.length;
      var end = start + this.PageSize; 

      $.ajax({
        url: this.ApiUrl,
        data: {
          "symbol": [this.Symbol],
          "filed": ["name", "symbol", "releasedate", "title", "id", "source"],
          "querydate": { "StartDate": this.StartDate, "EndDate": this.EndDate },
          "search": null,
          "calccount": -1,
          "start": start,
          "end": end,
          "userid": null
        },
        method: "POST",
        dataType: "json",
        success: function (data) {
          self.RecvData(data);
        },
        error: function (request) {
          self.RecvError(request);
        }
      })
    }
}

//公告新闻
function StockReport(symbol){
  this.newMethod = INewsBase;   //派生
    this.newMethod(symbol);
    delete this.newMethod;

    this.ApiUrl = g_JSNewsResource.Domain + '/API/ReportListByES';  //走公司内网查询接口
    this.ReportType=[];                                             //公告类型数组

    //获取第1页
    this.GetFirstPage = function () 
    {
        //清空数据
        this.Data = [];
        this.Count = 0;
        this.CacheCount = 0;

        var self = this;
        let arySymbol = this.GetQuerySymbol();
        if (!this.StartDate || !this.EndDate) this.SetDefautQueryDate();
        let reportType=null;
        if (this.ReportType && this.ReportType.length > 0) reportType = this.ReportType[0]; //暂时只支持1个类型

        $.ajax({
            url: this.ApiUrl,
            data:
                {
                    "symbol": arySymbol,
                    "filed": ["symbol", "name", "releasedate", "title", "id", "source"],
                    "querydate": { "startDate": this.StartDate, "endDate": this.EndDate },
                    "search": null,
                    "calccount": 1, //返回一共的数据个数
                    "start": 0,
                    "end": this.PageSize,
                    "userid": null,
                    'type': reportType
                },
            method: "POST",
            dataType: "json",
            success: function (data) {
                self.RecvData(data);
            },
            error: function (request) {
                self.RecvError(request);
            }
        })
    }

    this.RecvData = function (recvData) 
    {
        var data = recvData;
        if (this.Count <= 0)
            this.Count = data.count;                 //一共的新闻个数

        var info = {};
        info.Start = this.Data.length;
        info.End = this.Data.length;

        for (let i in data.report) {
            let item = data.report[i];
            this.Data.push(
                {
                    Name: item.name,
                    Symbol: item.symbol,
                    ID: item.id,
                    Data: item.releasedate.substring(0, 4) + "-" + item.releasedate.substring(4, 6) + "-" + item.releasedate.substring(6, 8),
                    Title: item.title,
                    Source: item.source,
                    Type:item.type,
                    Showurl: item.showurl
                });

            if (i > 0)++info.End;
        }

        this.CacheCount = this.Data.length;
        // this.InvokeCallback(info);
        this.InvokeCallback(this.Data);
    }

    this.RecvError = function (request) 
    {
        console.log("[StockReport::RecvError] ", request)
    }

    this.InvokeCallback = function (info) 
    {
        if (typeof (this.Callback) != 'function') return;

        this.Callback(info, this);
    }

    //下拉获取下一页
    this.GetNextPage = function () 
    {
        var self = this;
        let arySymbol = this.GetQuerySymbol();
        if (!this.StartDate || !this.EndDate) this.SetDefautQueryDate();

        var start = this.Data.length;
        var end = start + this.PageSize;
        $.ajax({
            url: this.ApiUrl,
            data:
                {
                    "symbol": arySymbol,
                    "filed": ["symbol", "name", "releasedate", "title", "id", "source"],
                    "querydate": { "startDate": self.StartDate, "endDate": self.EndDate },
                    "search": null,
                    "calccount": 0, //下页页不需要统计个数了
                    "start": start,
                    "end": end,
                    "userid": null
                },
            method: "POST",
            dataType: "json",
            success: function (data) 
            {
                self.RecvData(data);
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        })
    }
}


//个股公告分析
function AnnouncementAnalyse(symbol) 
{
    this.newMethod = INewsBase;   //派生
    this.newMethod(symbol);
    delete this.newMethod;

    this.ApiUrl = g_JSNewsResource.Domain+'/API/AnnualReportAllType';
    this.Error=null;

    this.GetFirstPage = function () 
    {
      this.Error = null;  //清空错误信息
      this.Data=[];
      this.Name = null;

      var self=this;
      var date=new Date();

      // 取最近3年的数据
      var start = (date.getFullYear()-3) * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      var end = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

      $.ajax({
        url: this.ApiUrl,
        data: 
        {
          "symbol": this.Symbol,
          "querydate": { "StartDate": start, "EndDate": end }
        },
        method: "POST",
        dataType: "json",
        success: function (data) 
        {
          self.RecvData(data);
        },
        error: function (request) 
        {
          self.RecvError(request)
        }
      })
    }

    this.RecvData=function(data)
    {
        if (data.list == null) return this.InvokeCallback();

        for(var i in data.list)
        {
            var item=data.list[i];
            if (item==null || item.info==null || item.info.length<=0) continue;

            var analyseData=
            {
                Name:item.typename,
                Data:new Array()
            };

            for(var j in item.info)
            {
                var subItem=item.info[j];
                analyseData.Data.push({Date:subItem.date,Content:subItem.abstract});

                if (this.Name==null) this.Name=subItem.name;
            }

            this.Data.push(analyseData);
        }

        this.InvokeCallback();  //通知页面
    }

    this.RecvError = function (request)
    {
        console.log('[AnnouncementAnalyse:RecvError] ',"request");
        this.Error="请求失败";
    }

    this.InvokeCallback=function()
    {
        if (typeof(this.Callback)!='function') return;

        var info={};
        this.Callback(info,this);
    }

}

//互动易
function StockInteract(symbol)
{
    this.newMethod=INewsBase;   //派生
    this.newMethod(symbol);
    delete this.newMethod;

    this.ApiUrl = g_JSNewsResource.Domain+'/API/NewsInteract';

    //获取第1页
    this.GetFirstPage=function()
    {
      //清空数据
      this.Data=[];
      this.Count=0;
      this.CacheCount=0;

      var self=this;
      // 取最近1年的数据
      var date = new Date();
      var startDate = (date.getFullYear()-1) * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      var endDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

      $.ajax({
        url: this.ApiUrl,
        data: 
        {
          "symbol": [this.Symbol],
          "filed": ["symbol","questioner","question","questondate","answerer","answer","answerdate","id"],
          "querydate": { "StartDate": startDate, "EndDate": endDate },
          "search": null,
          "calccount": 1, //返回一共的数据个数
          "start": 0,
          "end": this.PageSize,
          "userid": null
        },
        method: "POST",
        dataType: "json",
        success: function (data) 
        {
          self.RecvData(data);
        },
        error: function (request) 
        {
          self.RecvError(request);
        }
      })
    }

    this.RecvData=function(data)
    {
        if (this.Count<=0)
          this.Count=data.count;                 //一共的新闻个数
        
        var info={};
        info.Start = this.Data.length;
        info.End = this.Data.length;

        for(var i in data.list)
        {
            var item=data.list[i];
            this.Data.push(
              {
                ID:item.id,
                Data: item.questondate,
                Title: item.question,
                Author: item.questioner,
                
                Data2: item.answerdate,
                Author2: item.answerer,
                Content: item.answer
              });

            if (i>0) ++info.End;
        }
        
        this.CacheCount = this.Data.length;
        this.InvokeCallback(info);
    }

    this.RecvError=function(request)
    {
      console.log("[StockInteract::RecvError] ", request)
    }

    this.InvokeCallback = function (info) 
    {
      if (typeof (this.Callback) != 'function') return;

      this.Callback(info, this);
    }

    //下拉获取下一页
    this.GetNextPage = function () 
    {
      var self = this;
      // 取最近1年的数据
      var date = new Date();
      var startDate = (date.getFullYear() - 1) * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      var endDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

      var start=this.Data.length;
      var end = start + this.PageSize;
      $.ajax({
        url: this.ApiUrl,
        data:
        {
          "symbol": [this.Symbol],
          "filed": ["symbol", "questioner", "question", "questondate", "answerer", "answer", "answerdate", "id"],
          "querydate": { "StartDate": startDate, "EndDate": endDate },
          "search": null,
          "calccount": 1, //返回一共的数据个数
          "start": start,
          "end": end,
          "userid": null
        },
        method: "POST",
        dataType: "json",
        success: function (data) {
          self.RecvData(data);
        },
        error: function (request) {
          self.RecvError(request);
        }
      })
    }

  }


//新闻详情
function StockNewsContent(id) 
{
  this.newMethod = INewsContent;   //派生
  this.newMethod(id);
  delete this.newMethod;
  
  this.ApiUrl = g_JSNewsResource.Domain+"/API/NewsStockDetail2"

  this.GetContent = function ()
  {
    var self=this;
    //清空数据
    this.Name=null;
    this.Error=null;
    this.Data=null;

    $.ajax({
      url: this.ApiUrl,
      data: {
        "userid": null, 
        "id": this.ID, 
        "symbol":this.Symbol,
        "filed": ["name", "symbol", "releasedate", "title", "id", "content", "link","source"]
      },
      method: "POST",
      dataType: "json",
      success: function (data) 
      {
          self.RecvData(data);
      },
      error: function (request) 
      {
          self.RecvError(request);
      }
    })
  }

  this.RecvData=function(data)
  {
    var detail=data.detail;
    if (detail == null) return this.InvokeCallback();

    //把API数据格式 转换成自己的对外的统一格式,
    this.Data={};
    this.Data.Date = detail.releasedate;
    this.Data.Content = detail.content;
    this.Data.Title = detail.title;
    this.Data.Source = detail.source;

    //新闻关联的其他股票列表
    var relation=new Array();
    for (var i in data.stocklist)
    {
        var item = data.stocklist[i];
        relation.push({Symbol:item.symbol,Name:item.name});
    }
    this.Data.Relation = relation;

    this.Name = detail.name;

    this.InvokeCallback();
  }

  this.RecvError=function(reqeust)
  {
      this.Error="请求失败";
      this.InvokeCallback();
  }

  this.InvokeCallback = function()
  {
    if (typeof (this.Callback) != 'function') return;

    this.Callback(this);
  }
}


//负面新闻
function StockNegative(symbol)
{
    this.newMethod=INewsBase;   //派生
    this.newMethod(symbol);
    delete this.newMethod;

    this.ApiUrl = g_JSNewsResource.Domain+'/API/NewsNegative';

    //获取第1页
    this.GetFirstPage=function()
    {
      //清空数据
      this.Data=[];
      this.Count=0;
      this.CacheCount=0;

      var self=this;
      let arySymbol=this.GetQuerySymbol();
      if (!this.StartDate || !this.EndDate) this.SetDefautQueryDate();

      $.ajax({
        url: this.ApiUrl,
        data: 
        {
          "symbol": arySymbol,
          "filed": ["symbol","name","releasedate","title","id","source"],
          "querydate": { "StartDate": this.StartDate, "EndDate": this.EndDate },
          "search": null,
          "calccount": 1, //返回一共的数据个数
          "start": 0,
          "end": this.PageSize,
          "userid": null
        },
        method: "POST",
        dataType: "json",
        success: function (data) 
        {
          self.RecvData(data);
        },
        error: function (request) 
        {
          self.RecvError(request);
        }
      })
    }

    this.RecvData=function(data)
    {
        if (this.Count<=0)
          this.Count=data.count;                 //一共的新闻个数
        
        var info={};
        info.Start = this.Data.length;
        info.End = this.Data.length;

        for(var i in data.list)
        {
            var item=data.list[i];
            this.Data.push(
              {
                ID:item.id,
                Data: item.releasedate,
                Title: item.title,
                Source:item.source
              });

            if (i>0) ++info.End;
        }
        
        this.CacheCount = this.Data.length;
        this.InvokeCallback(info);
    }

    this.RecvError=function(request)
    {
      console.log("[StockInteract::RecvError] ", request)
    }

    this.InvokeCallback = function (info) 
    {
      if (typeof (this.Callback) != 'function') return;

      this.Callback(info, this);
    }

    //下拉获取下一页
    this.GetNextPage = function () 
    {
      var self = this;

      let arySymbol=this.GetQuerySymbol();
      if (!this.StartDate || !this.EndDate) this.SetDefautQueryDate();

      var start=this.Data.length;
      var end = start + this.PageSize;
      $.ajax({
          url: this.ApiUrl,
          data:
          {
            "symbol": arySymbol,
            "filed": ["symbol","name","releasedate","title","id","source"],
            "querydate": { "StartDate": startDate, "EndDate": endDate },
            "search": null,
            "calccount": 0, //下页页不需要统计个数了
            "start": start,
            "end": end,
            "userid": null
          },
          method: "POST",
          dataType: "json",
          success: function (data) 
          {
            self.RecvData(data);
          },
          error: function (request) 
          {
            self.RecvError(request);
          }
      })
    }

  }

/* 测试

var news=JSNews.GetNews('600000.sh',NEWS_TYPE.STOCK_NEWS);

news.Callback=UpdateNews;
news.GetFirstPage();

function UpdateNews(info,news)
{
    //获取请求的数据位置
    var start=info.Start;
    var end=info.End;

    //取新闻列表
    for(var i=start;i<end && i<news.Data.length;++i)
    {
        var item =news.Data[i];
    }
}

*/