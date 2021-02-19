//日志输出类
var JSConsole=
{ 
    Chart:{ Log:console.log },      //图形日志
    Complier:{ Log:console.log },   //编译器日志
};

module.exports =
{
    JSConsole:
    {
        Chart: JSConsole.Chart,
        Complier:JSConsole.Complier
    }
};