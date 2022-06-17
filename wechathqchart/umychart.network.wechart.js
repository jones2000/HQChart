
/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    网络通讯
*/

function JSNetwork()
{

}

JSNetwork.IsDingTalk=false;
JSNetwork.IsUniApp=false;

JSNetwork.HttpRequest=function(obj)
{
    if (JSNetwork.IsDingTalk)
    {
        JSNetwork.DD_httpRequest(obj);
    }
    else
    {
        JSNetwork.WX_Reqeust(obj);
    }
}

JSNetwork.WX_Reqeust=function(obj)
{
    wx.request({
        url: obj.url,
        data:obj.data,
        method: obj.method,
        dataType: obj.dataType,
        success: obj.success,
        error:obj.error
        });
}


JSNetwork.DD_httpRequest=function(obj)
{
    dd.httpRequest({
        url: obj.url,
        method: obj.method,
        data:obj.data,
        dataType: obj.dataType,
        success: obj.success
      });
}


export
{
    JSNetwork
};