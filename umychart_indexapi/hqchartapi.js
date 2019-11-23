//////////////////////////////////////////////////////////////
//  安装 restify, request
//
//

var restify = require('restify');
var JSIndexController=require('./jsindexcontroller').JSIndexController;
var config=require('./hqchartconfig').Config;

if (!config) config={ Port:18080 };

if (config.Monogdb && config.Monogdb.Url)
{
  JSIndexController.SetMongodb(config.Monogdb);

  console.log('[HQChartApi] load index script from mongo .....');
  JSIndexController.LoadIndex();
}

//JSCommonComplier.JSComplier.SetDomain('http://100.114.65.219');
var server = restify.createServer({name:'HQChart.testserver'});
server.use(restify.plugins.bodyParser());   //支持json post
server.use(restify.plugins.fullResponse()); //跨域
server.use(restify.plugins.gzipResponse()); //支持压缩

server.post('/api/jsindex',JSIndexController.Post);
server.post('/api/reloadindex',JSIndexController.ReloadIndex);
server.get('/api', homepage);

function homepage(req, res, next)
{
  res.send(200,{message: 'homepage'});
  return next();
}

console.log(`[HQChartApi] Start server Port=${config.Port} ......`);
server.listen(config.Port, function() 
{
  console.log('%s listening at %s', server.name, server.url);
});




