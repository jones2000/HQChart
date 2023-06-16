
/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   阿里云api网关网络请求模块
*/

function JSAliYunNetwork()
{
    this.AliYunUrl=[];  //需要验证的阿里账户的域名
    this.AppCode;

    this.HttpRequest = function(obj)
    {
        $.ajax(
            { 
                headers: this.AppCode,
                url: obj.url, data: obj.data,
                type:obj.type, dataType: obj.dataType,async:obj.async, 
                success: obj.success,
                error: obj.error,
            }
        );
    }   
}



// var g_AilYunNetwork=new JSAliYunNetwork();  //初始化一个全局的变量
/* g_AilYunNetwork.AliYunUrl[0]="xxxxxxx"; //域名 或 具体的地址
//设置账户密码
{ 
    Authorization:'APPCODE 4333fc85c1284212a4724d7159304e70'
}

//替换默认的网络请求接口
JSNetwork.HttpRequest= function (obj)
{
    g_AilYunNetwork.HttpRequest(obj);
}
*/
