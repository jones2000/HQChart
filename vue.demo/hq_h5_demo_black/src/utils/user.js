/*
    用户信息
*/

var g_UserResource=
{
    Domain : "https://opensource.zealink.com",               //API域名
}

function User()
{
    this.UserID=null;
    this.Password=null;

    this.UserName=null;
    this.Token=null;

    this.LogonApiUrl=g_UserResource.Domain+'/api/login';    //登录;
    this.LogoutApiUrl=g_UserResource.Domain+'/api/logout';

    this.IndexList=new Map();   //用户可以有权限查看的指标 key=ID, value={Name, ID , Date: 到期日期 }

    this.LoadCache=function()   //读取用户登录缓存
    {
        console.log('[User::LoadCache]');
        //读 token
        //读 IndexList
    }

    this.LoadCache();

    this.IsLogon=function() //是否已经登录了
    {
        return this.Token!=null;
    }

    this.RequestLogon=function(callback)
    {
        this.Token=null;    //清空
        var self=this;
        /*
        var postData={ mobile_no:this.UserID, password:this.Password };
        $.ajax({
            url: this.LogonApiUrl,
            data:JSON.stringify(postData),
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvLogonData(data, callback);
            },
            error:function(request)
            {
                self.RecvError(request);
            }
        });
        */
    }

    this.RecvLogonData=function(data,callback)
    {
        var result=data.result_code;
        var bSuccess=false;
        var message;

        if (callback) callback(bSuccess, message, this);
    }
}


var g_User=new User();

//把给外界调用的方法暴露出来
export default 
{
    Global_User: g_User,
    User:User,
    //USER_EVENT_ID: USER_EVENT_ID,
}