//////////////////////////////////////////////////////////////
//  安装 restify, request
//
//

var restify = require('restify');
var JSIndexController=require('./jsindexcontroller').JSIndexController;


//JSCommonComplier.JSComplier.SetDomain('http://100.114.65.219');
var server = restify.createServer({name:'HQChart.testserver'});
server.use(restify.plugins.bodyParser());   //支持json post
server.use(restify.plugins.fullResponse()); //跨域
server.use(restify.plugins.gzipResponse()); //支持压缩

server.post('/api/jsindex',JSIndexController.Post);
server.get('/api', homepage);

function homepage(req, res, next)
{
  res.send({message: 'homepage'});
}

server.listen(18080, function() 
{
  console.log('%s listening at %s', server.name, server.url);
});




