/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    分析家脚本翻译器
*/

import { JSConsole } from "./umychart.console.wechat.js"

import {
    ErrorHandler,
    JSComplier,
    JSParser,
    Syntax,
    JS_EXECUTE_JOB_ID,
    g_JSComplierResource,
} from "./umychart.complier.wechat";

import 
{ 
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'


//脚本说明
function JSExplainer(ast,option)
{
    this.AST=ast;
    this.ErrorHandler=new ErrorHandler();
    this.ErrorCallback;             //执行错误回调
    this.UpdateUICallback;
    this.CallbackParam;
    this.JobList=[];                //执行的任务队列
    this.VarTable=new Map();        //变量表
    this.OutVarTable=[];            //输出变量

    //脚本自动变量表, 只读
    this.ConstVarTable=new Map(
    [
        //个股数据
        ['CLOSE',"收盘价"],['VOL',"成交量"],['OPEN',"开盘价"],['HIGH',"最高价"],['LOW',"最低价"],['AMOUNT',"成交量"],
        ['C',"收盘价"],['V',"成交量"],['O',"开盘价"],['H',"最高价"],['L',"最低价"],['AMO',"成交量"], 
        ['VOLR',"量比"], ['VOLINSTK',"持仓量"], ["OPI","持仓量"], ["ZSTJJ","均价"], ["QHJSJ","结算价"], ["SETTLE", "结算价"],

        //日期类
        ['DATE',"日期"],['YEAR',"年份"],['MONTH',"月份"],['PERIOD', "周期"],['WEEK',"星期"],["TIME","时间"],

        //大盘数据
        ['INDEXA',"大盘成交额"],['INDEXC',"大盘收盘价"],['INDEXH',"大盘最高价"],['INDEXL',"大盘最低价"],['INDEXO',"大盘开盘价"],['INDEXV',"大盘成交量"],
        ['INDEXADV',"大盘上涨家数"],['INDEXDEC',"´大盘下跌家数"],

        ["ADVANCE","上涨家数"], ['DECLINE', "下跌家数"],

        ['FROMOPEN',"当前离开盘分钟数"], 
        ['TOTALFZNUM', "总分钟数"], 

        ['CURRBARSCOUNT',"到最后交易的周期"], //到最后交易日的周期数
        ['TOTALBARSCOUNT',"总的周期数"],
        ['ISLASTBAR',"是否是最后一个周期"],     //判断是否为最后一个周期
        ['BARSTATUS',"数据位置状态"],     //BARSTATUS返回数据位置信息,1表示第一根K线,2表示最后一个数据,0表示中间位置.

        ['CAPITAL',"当前流通股本(手)"], ["TOTALCAPITAL","当前总股本(手)"], 
        ['EXCHANGE',"换手率"],   //换手率
        ['SETCODE', "市场类型"],  //市场类型
        ['CODE',"品种代码"],      //品种代码
        ['STKNAME',"品种名称"],   //品种名称
        ["TQFLAG","当前复权状态"],    //TQFLAG  当前的复权状态,0:无复权 1:前复权 2:后复权 

        ['HYBLOCK',"所属行业"],   //所属行业板块
        ['DYBLOCK',"所属地域"],   //所属地域板块
        ['GNBLOCK',"所属概念"],   //所属概念
        ["FGBLOCK","所属风格板块"],  
        ["ZSBLOCK","所属指数板块"], 
        ["ZHBLOCK",'所属组合板块'],   
        ["ZDBLOCK",'所属自定义板块'], 
        ["HYZSCODE","所属行业的板块指数代码"],  

        ["GNBLOCKNUM","所属概念板块的个数"],    
        ["FGBLOCKNUM","所属风格板块的个数"],    
        ["ZSBLOCKNUM","所属指数板块的个数"],
        ["ZHBLOCKNUM","所属组合板块的个数"],
        ["ZDBLOCKNUM","所属自定义板块的个数"],

        ["HYSYL","指数市盈率或个股所属行业的市盈率"],
        ["HYSJL","指数市净率或个股所属行业的市净率"],

        ['DRAWNULL',"无效数据"]

    ]);   

    if (option)
    {
        if (option.Callback) this.UpdateUICallback=option.Callback;
        if (option.CallbackParam) this.CallbackParam=option.CallbackParam;
        if (option.Arguments) this.Arguments=option.Arguments;
    }

    this.Run=function()
    { 
        try
        {  
            this.OutVarTable=[];
            this.VarTable=new Map();
            JSConsole.Complier.Log('[JSExecute::JSExplainer] Load Arguments', this.Arguments);
            for(let i in this.Arguments)    //预定义的变量
            {
                let item =this.Arguments[i];
                this.VarTable.set(item.Name,item.Value);
            }

            let data=this.RunAST();//执行脚本
            JSConsole.Complier.Log('[JSExplainer.Run] explain finish', data);
            if (this.UpdateUICallback) //回调发送结果, 可以支持异步
            {
                JSConsole.Complier.Log('[JSExplainer.Run] invoke UpdateUICallback.');
                this.UpdateUICallback(data);
            }
        }
        catch(error)
        {
            JSConsole.Complier.Log('[JSExplainer.Run] throw error ', error);
            if (this.ErrorCallback) 
            {
                this.ErrorCallback(error, this.OutVarTable);
            }
        }
    }


    this.RunAST=function()
    {
        if (!this.AST) this.ThrowError();
        if (!this.AST.Body) this.ThrowError();

        for(let i in this.AST.Body)
        {
            let item =this.AST.Body[i];
            this.VisitNode(item);

            //输出变量
            if (item.Type==Syntax.ExpressionStatement && item.Expression)
            {
                if (item.Expression.Type==Syntax.AssignmentExpression)
                {
                    if (item.Expression.Operator==':' && item.Expression.Left)
                    {
                        let assignmentItem=item.Expression;
                        let varName=assignmentItem.Left.Name;
                        let outVar=`输出${varName}: ${this.VarTable.get(varName)}`;
                        this.OutVarTable.push({ Name:varName, Data:outVar,Type:0});
                    }
                    else if (item.Expression.Operator==':=' && item.Expression.Left)
                    {
                        let assignmentItem=item.Expression;
                        let varName=assignmentItem.Left.Name;
                        let outVar=`赋值${varName}: ${this.VarTable.get(varName)}`;
                        this.OutVarTable.push({ Name:varName, Data:outVar,Type:0, IsOut:false });
                    }
                }
                else if (item.Expression.Type==Syntax.CallExpression)
                {
                    let callItem=item.Expression;
                    if (this.IsDrawFunction(callItem.Callee.Name))
                    {
                        let outVar=callItem.Out;
                        var drawName=callItem.Callee.Name;
                        this.OutVarTable.push({Name:drawName, Draw:`输出: ${outVar}`, Type:1});
                    }
                    else
                    {
                        let outVar=callItem.Out;
                        varName=`__temp_c_${callItem.Callee.Name}_${i}__`;
                        this.OutVarTable.push({Name:varName, Data:`输出: ${outVar}`,Type:0, NoneName:true});
                    }
                }
                else if (item.Expression.Type==Syntax.Identifier)
                {
                    let varName=item.Expression.Name;
                    let outVar=this.ReadVariable(varName,item.Expression);
                    varName="__temp_i_"+i+"__";
                    this.OutVarTable.push({Name:varName, Data:`输出: ${outVar}`, Type:0, NoneName:true});
                }
                else if (item.Expression.Type==Syntax.Literal)  //常量
                {
                    let outVar=item.Expression.Value;
                    if (IFrameSplitOperator.IsString(outVar) && outVar.indexOf("$")>0)
                        outVar=this.GetOtherSymbolExplain({ Literal:outVar }, item);
                    varName="__temp_li_"+i+"__";
                    var type=0;
                    this.OutVarTable.push({Name:varName, Data:`输出: ${outVar}`, Type:0, NoneName:true});
                }
                else if (item.Expression.Type==Syntax.BinaryExpression) // CLOSE+OPEN;
                {
                    var varName="__temp_b_"+i+"__";
                    let outVar=item.Expression.Out;
                    this.OutVarTable.push({Name:varName, Data:`输出: ${outVar}`,Type:0, NoneName:true});
                }
                else if (item.Expression.Type==Syntax.LogicalExpression)    //逻辑语句 如 T1 AND T2 
                {
                    var varName="__temp_l_"+i+"__";
                    let outVar=item.Expression.Out;
                    this.OutVarTable.push({Name:varName, Data:`输出: ${outVar}`,Type:0, NoneName:true});
                }
                else if (item.Expression.Type==Syntax.SequenceExpression)
                {
                    let varName;
                    let drawName;
                    let draw;
                    let color;
                    let lineWidth;
                    let colorStick=false;
                    let pointDot=false;
                    let circleDot=false;
                    let lineStick=false;
                    let stick=false;
                    let volStick=false;
                    let isShow=true;
                    let isExData=false;
                    let isDotLine=false;
                    let isOverlayLine=false;    //叠加线
                    var isNoneName=false;
                    //显示在位置之上,对于DRAWTEXT和DRAWNUMBER等函数有用,放在语句的最后面(不能与LINETHICK等函数共用),比如:
                    //DRAWNUMBER(CLOSE>OPEN,HIGH,CLOSE),DRAWABOVE;
                    var isDrawAbove=false;      
                    for(let j in item.Expression.Expression)
                    {
                        let itemExpression=item.Expression.Expression[j];
                        if (itemExpression.Type==Syntax.AssignmentExpression && itemExpression.Operator==':' && itemExpression.Left)
                        {
                            varName=itemExpression.Left.Name;
                            let varValue=this.VarTable.get(varName);
                            this.VarTable.set(varName,varValue);            //把常量放到变量表里
                        }
                        else if (itemExpression.Type==Syntax.Identifier)
                        {
                            let value=itemExpression.Name;
                            if (value==='COLORSTICK') colorStick=true;
                            else if (value==='POINTDOT') pointDot=true;
                            else if (value==='CIRCLEDOT') circleDot=true;
                            else if (value==='DOTLINE') isDotLine=true;
                            else if (value==='LINESTICK') lineStick=true;
                            else if (value==='STICK') stick=true;
                            else if (value==='VOLSTICK') volStick=true;
                            else if (value==="DRAWABOVE") isDrawAbove=true;
                            else if (value.indexOf('COLOR')==0) color=value;
                            else if (value.indexOf('LINETHICK')==0) lineWidth=value;
                            else if (value.indexOf('NODRAW')==0) isShow=false;
                            else if (value.indexOf('EXDATA')==0) isExData=true; //扩展数据, 不显示再图形里面
                            else if (value.indexOf('LINEOVERLAY')==0) isOverlayLine=true;
                            else 
                            {
                                varName=itemExpression.Name;
                                let varValue=this.ReadVariable(varName,itemExpression);
                                varName="__temp_si_"+i+"__";
                                isNoneName=true;
                                this.VarTable.set(varName,varValue);            //放到变量表里
                            }
                        }
                        else if(itemExpression.Type==Syntax.Literal)    //常量
                        {
                            let aryValue=itemExpression.Value;
                            varName=itemExpression.Value.toString();
                            isNoneName=true;
                            this.VarTable.set(varName,aryValue);    //把常量放到变量表里
                        }
                        else if (itemExpression.Type==Syntax.CallExpression)
                        {
                            if (this.IsDrawFunction(itemExpression.Callee.Name))
                            {
                                draw=itemExpression.Out;
                                drawName=itemExpression.Callee.Name;
                            }
                            else
                            {
                                let varValue=itemExpression.Out;
                                varName=`__temp_sc_${itemExpression.Callee.Name}_${i}__`;
                                isNoneName=true;
                                this.VarTable.set(varName,varValue);
                            }
                        }
                        else if (itemExpression.Type==Syntax.BinaryExpression)
                        {
                            varName="__temp_sb_"+i+"__";
                            let aryValue=itemExpression.Out;
                            isNoneName=true;
                            this.VarTable.set(varName,aryValue);
                        }
                    }

                    var outValue;
                    if (draw) outValue=`输出: ${draw}`;
                    else if (isNoneName) outValue=`输出: ${this.VarTable.get(varName)}`;
                    else outValue=`输出${varName}: ${this.VarTable.get(varName)}`;
                    
                    if (color) outValue+=`,颜色${this.GetColorExplain(color)}`;
                    if (lineWidth) outValue+=`,线段粗细${this.GetLineWidthExplain(lineWidth)}`;
                    if (isShow==false) outValue+=",不显示"; 
                    if (isDotLine==true) outValue+=",画虚线";
                    if (isDrawAbove==true) outValue+=',显示在位置之上';

                    if (pointDot && varName)   //圆点
                    {
                        outValue+=",画小圆点线";
                        let value={Name:varName, Data:outValue, Radius:g_JSChartResource.POINTDOT.Radius, Type:3};
                        this.OutVarTable.push(value);
                    }
                    else if (circleDot && varName)  //圆点
                    {
                        outValue+=",画小圆圈线";
                        let value={Name:varName, Data:outValue, Radius:g_JSChartResource.CIRCLEDOT.Radius, Type:3};
                        this.OutVarTable.push(value);
                    }
                    else if (lineStick && varName)  //LINESTICK  同时画出柱状线和指标线
                    {
                        outValue+=",画出柱状线和指标线";
                        let value={Name:varName, Data:outValue, Type:4};
                        this.OutVarTable.push(value);
                    }
                    else if (stick && varName)  //STICK 画柱状线
                    {
                        outValue+=",画柱状线";
                        let value={Name:varName, Data:outValue, Type:5};
                        this.OutVarTable.push(value);
                    }
                    else if (volStick && varName)   //VOLSTICK   画彩色柱状线
                    {
                        outValue+=",画成交量柱状线";
                        let value={Name:varName, Data:outValue, Type:6};
                        this.OutVarTable.push(value);
                    }
                    else if (varName && color) 
                    {
                        let value={Name:varName, Data:outValue, Color:color, Type:0};
                        this.OutVarTable.push(value);
                    }
                    else if (draw)  //画图函数
                    {
                        var outVar={ Name:drawName, Data:outValue, Type:1 };
                        this.OutVarTable.push(outVar);
                    }
                    else if (colorStick && varName)  //CYW: SUM(VAR4,10)/10000, COLORSTICK; 画上下柱子
                    {
                        outValue+=",画彩色柱状线";
                        let value={Name:varName, Data:outValue, Color:color, Type:2};
                        this.OutVarTable.push(value);
                    }
                    else if (varName)
                    {
                        let value={Name:varName, Data:outValue,Type:0};
                        this.OutVarTable.push(value);
                    }
                }
            }
        }

        JSConsole.Complier.Log('[JSExplainer::Run]', this.VarTable);
        return this.OutVarTable;
    }

    this.VisitNode=function(node)
    {
        switch(node.Type)
        {
            case Syntax.SequenceExpression:
                this.VisitSequenceExpression(node);
                break;
            case Syntax.ExpressionStatement:
                this.VisitNode(node.Expression);
                break;
            case Syntax.AssignmentExpression:
                this.VisitAssignmentExpression(node);
                break;
            case Syntax.BinaryExpression:
            case Syntax.LogicalExpression:
                this.VisitBinaryExpression(node);
                break;
            case Syntax.CallExpression:
                this.VisitCallExpression(node);
                break;
        }
    }

    this.VisitSequenceExpression=function(node)
    {
        for(let i in node.Expression)
        {
            let item =node.Expression[i];
            this.VisitNode(item);
        }
    }

    //函数调用
    this.VisitCallExpression=function(node)
    {
        let funcName=node.Callee.Name;
        let args=[];
        for(let i in node.Arguments)
        {
            let item=node.Arguments[i];
            let value;
            if (item.Type==Syntax.BinaryExpression || item.Type==Syntax.LogicalExpression) 
                value=this.VisitBinaryExpression(item);
            else if (item.Type==Syntax.CallExpression)
                value=this.VisitCallExpression(item);
            else
                value=this.GetNodeValue(item);
            args.push(value);
        }

        JSConsole.Complier.Log('[JSExplainer::VisitCallExpression]' , funcName, '(', args.toString() ,')');

        if (g_JSComplierResource.IsCustomFunction(funcName))
        {
            var data=this.Algorithm.CallCustomFunction(funcName, args, this.SymbolData, node);
            node.Out=[];
            node.Draw=null;

            if (data)
            {
                if (data.Out) node.Out=data.Out;
                if (data.Draw) node.Draw=data.Draw;
            }

            return node.Out;
        }

        node.Out=this.CallFunctionExplain(funcName, args, node);
        return node.Out;
    }

    this.FUNCTION_INFO_LIST=new Map(
        [
            ["REF",     { Name:"REF", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日前的${args[0]}`; } } ],
            ["REFX",    { Name:"REFX", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日后的${args[0]}`; } } ],
            ["REFV",    { Name:"REFV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日前的(未作平滑处理)${args[0]}`; } } ],
            ["REFXV",   { Name:"REFXV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日后的(未作平滑处理)${args[0]}`; } } ],

            ["REFDATE", { Name:"REFDATE", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日${args[0]}`; } } ],
            ["COUNT",   { Name:"COUNT", Param:{ Count:2 }, ToString:function(args) { return `统计${args[1]}日中满足${args[0]}的天数`; } } ],
            ["BARSLASTCOUNT", { Name:"BARSLASTCOUNT", Param:{ Count:1 }, ToString:function(args) { return `条件${args[0]}连续成立次数`; } } ],
            ["BARSCOUNT",   { Name:"BARSCOUNT", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}有效数据周期数`; } } ],
            ["BARSLAST",    { Name:"BARSLAST", Param:{ Count:1 }, ToString:function(args) { return `上次${args[0]}不为0距今天数`; } } ],
            ["BARSNEXT",    { Name:"BARSNEXT", Param:{ Count:1 }, ToString:function(args) { return `下次${args[0]}不为0距今天数`; } } ],
            ["BARSSINCEN",  { Name:"BARSSINCEN", Param:{ Count:2 }, ToString:function(args) { return `在${args[1]}周期内首次${args[0]}距今天数`; } } ],
            ["BARSSINCE",   { Name:"BARSSINCE", Param:{ Count:1 }, ToString:function(args) { return `首次${args[0]}距今天数`; } } ],
            ["HHV", { Name:"HHV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的最高值`; } } ],
            ["LLV", { Name:"LLV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的最低值`; } } ],

            ["HOD", { Name:"HOD", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的高值名次`; } } ],
            ["LOD", { Name:"LOD", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的低值名次`; } } ],
            ["REVERSE", { Name:"REVERSE", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的相反数`; } } ],
            ["FILTER", { Name:"FILTER", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日过滤`; } } ],
            ["FILTERX", { Name:"FILTERX", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日反向过滤`; } } ],
            ["SUMBARS", { Name:"SUMBARS", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}累加至${args[1]}的天数`; } } ],
            ["MA", { Name:"MA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日简单移动平均`; } } ],
            ["SMA", { Name:"SMA", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}的${args[1]}日[${args[2]}日权重]移动平均`; } } ],
            ["MEMA", { Name:"MEMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日平滑移动平均`; } } ],
            ["EMA", { Name:"EMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日指数移动平均`; } } ],
            ["EXPMA", { Name:"EXPMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日指数移动平均`; } } ],
            ["WMA", { Name:"WMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日加权移动平均`; } } ],
            ["DMA", { Name:"DMA", Param:{ Count:2 }, ToString:function(args) { return `以${args[1]}为权重${args[0]}的动态移动平均`; } } ],
            ["XMA", { Name:"XMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日偏移移动平均`; } } ],

            ["RANGE", { Name:"RANGE", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}位于${args[1]}和${args[2]}之间`; } } ],
            ["CONST", { Name:"CONST", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的最后一日值`; } } ],
            ["TOPRANGE", { Name:"TOPRANGE", Param:{ Count:1 }, ToString:function(args) { return `当前值是近${args[0]}周期的最大值`; } } ],
            ["LOWRANGE", { Name:"LOWRANGE", Param:{ Count:1 }, ToString:function(args) { return `当前值是近${args[0]}周期的最小值`; } } ],
            ["FINDHIGH", { Name:"FINDHIGH", Param:{ Count:4 }, ToString:function(args) { return `${args[0]}在${args[1]}日前的${args[2]}天内第${args[3]}个最高价`; } } ],
            ["FINDHIGHBARS", { Name:"FINDHIGHBARS", Param:{ Count:4 }, ToString:function(args) { return `${args[0]}在${args[1]}日前的${args[2]}天内第${args[3]}个最高价到当前周期的周期数`; } } ],
            ["FINDLOW", { Name:"FINDLOW", Param:{ Count:4 }, ToString:function(args) { return `${args[0]}在${args[1]}日前的${args[2]}天内第${args[3]}个最低价`; } } ],
            ["FINDLOWBARS", { Name:"FINDLOWBARS", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}在${args[1]}日前的${args[2]}天内第${args[3]}个最低价到当前周期的周期数`; } } ],
            ["SUM", { Name:"SUM", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}${args[1]}日累加`; } } ],
            ["MULAR", { Name:"MULAR", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}和${args[1]}日累乘`; } } ],
            ["AMA", { Name:"AMA", Param:{ Count:2 }, ToString:function(args) { return `以${args[1]}为权重${args[0]}的自适应均线`; } } ],
            ["TMA", { Name:"TMA", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}的${args[1]}日[${args[2]}日权重]移动平均`; } } ],
            ["CROSS", { Name:"CROSS", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}上穿${args[1]}`; } } ],
            ["LONGCROSS", { Name:"LONGCROSS", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}小于${args[1]}保持${args[2]}个交易日后交叉上穿`; } } ],
            ["UPNDAY", { Name:"UPNDAY", Param:{ Count:2 }, ToString:function(args) { return `最近${args[1]}日${args[0]}连涨`; } } ],
            ["DOWNNDAY", { Name:"DOWNNDAY", Param:{ Count:2 }, ToString:function(args) { return `最近${args[1]}日${args[0]}连跌`; } } ],
            ["NDAY", { Name:"NDAY", Param:{ Count:3 }, ToString:function(args) { return `最近${args[2]}日${args[0]}一直大于${args[1]}`; } } ],
            ["EXIST", { Name:"EXIST", Param:{ Count:2 }, ToString:function(args) { return `最近${args[1]}日存在${args[0]}`; } } ],
            ["EXISTR", { Name:"EXISTR", Param:{ Count:3 }, ToString:function(args) { return `从前${args[1]}日到前${args[2]}日存在${args[0]}`; } } ],
            ["EVERY", { Name:"EVERY", Param:{ Count:2 }, ToString:function(args) { return `最近${args[1]}日一直存在${args[0]}`; } } ],
            ["LAST", { Name:"LAST", Param:{ Count:3 }, ToString:function(args) { return `从前${args[1]}日到前${args[2]}日持续${args[0]}`; } } ],
            ["NOT", { Name:"NOT", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}取反`; } } ],
            ["IF", { Name:"IF", Param:{ Count:3 }, ToString:function(args) { return `如果${args[0]},返回${args[1]},否则返回${args[2]}`; } } ],
            ["IFF", { Name:"IFF", Param:{ Count:3 }, ToString:function(args) { return `如果${args[0]},返回${args[1]},否则返回${args[2]}`; } } ],
            ["IFN", { Name:"IFN", Param:{ Count:3 }, ToString:function(args) { return `如果${args[0]},返回${args[1]},否则返回${args[2]}`; } } ],

            ["MAX", { Name:"MAX", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}和${args[1]}的较大值`; } } ],
            ["MIN", { Name:"MIN", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}和${args[1]}的较小值`; } } ],
            ["ACOS", { Name:"ACOS", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的反余弦`; } } ],
            ["ASIN", { Name:"ASIN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的反正弦`; } } ],
            ["ATAN", { Name:"ATAN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的反正切`; } } ],
            ["COS", { Name:"COS", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的余弦`; } } ],
            ["SIN", { Name:"SIN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的正弦`; } } ],
            ["TAN", { Name:"TAN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的正切`; } } ],
            ["EXP", { Name:"EXP", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的指数`; } } ],
            ["LN", { Name:"LN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的自然对数`; } } ],
            ["LOG", { Name:"LOG", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的对数`; } } ],
            ["SQRT", { Name:"SQRT", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的开方`; } } ],
            ["ABS", { Name:"ABS", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的绝对值`; } } ],
            ["POW", { Name:"POW", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}乘幂`; } } ],
            ["CEILING", { Name:"CEILING", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的向上舍入`; } } ],
            ["FLOOR", { Name:"FLOOR", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的向上舍入`; } } ],
            ["INTPART", { Name:"INTPART", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的整数部分`; } } ],
            ["BETWEEN", { Name:"BETWEEN", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}位于${args[1]}和${args[2]}之间`; } } ],
            ["FRACPART", { Name:"FRACPART", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的小数部分`; } } ],
            ["ROUND", { Name:"ROUND", Param:{ Count:1 }, ToString:function(args) { return `对${args[0]}(进行)四舍五入`; } } ],
            ["ROUND2", { Name:"ROUND2", Param:{ Count:2 }, ToString:function(args) { return `对${args[0]}(进行)四舍五入`; } } ],
            ["SIGN", { Name:"SIGN", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的符号`; } } ],
            ["MOD", { Name:"MOD", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}关于${args[1]}的模`; } } ],
            ["RAND", { Name:"RAND", Param:{ Count:1 }, ToString:function(args) { return `随机正整数`; } } ],

            ["AVEDEV", { Name:"AVEDEV", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日平均绝对偏差`; } } ],
            ["DEVSQ", { Name:"DEVSQ", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日数据偏差平方和`; } } ],
            ["FORCAST", { Name:"FORCAST", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日线性回归预测值`; } } ],
            ["TSMA", { Name:"TSMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}在${args[1]}个周期内的时间序列三角移动平均`; } } ],
            ["SLOPE", { Name:"SLOPE", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日线性回归斜率`; } } ],
            ["STD", { Name:"STD", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日估算标准差`; } } ],
            ["STDP", { Name:"STDP", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日总体标准差`; } } ],
            ["STDDEV", { Name:"STDDEV", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日标准偏差`; } } ],
            ["VAR", { Name:"VAR", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日估算样本方差`; } } ],
            ["VARP", { Name:"VARP", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日总体样本方差`; } } ],
            ["COVAR", { Name:"COVAR", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}和${args[1]}的${args[2]}周期的协方差`; } } ],
            ["RELATE", { Name:"RELATE", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}和${args[1]}的${args[0]}周期的相关系数`; } } ],
            ["BETA", { Name:"BETA", Param:{ Count:1 }, ToString:function(args) { return `β(Beta)系数`; } } ],
            ["BETAEX", { Name:"BETAEX", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}和${args[1]}的${args[2]}周期的相关放大系数`; } } ],

            ["COST", { Name:"COST", Param:{ Count:1 }, ToString:function(args) { return `获利盘为${args[0]}%的成本分布`; } } ],
            ["WINNER", { Name:"WINNER", Param:{ Count:1 }, ToString:function(args) { return `以${args[0]}计算的获利盘比例`; } } ],
            ["LWINNER", { Name:"LWINNER", Param:{ Count:2 }, ToString:function(args) { return `最近${args[0]}日那部分成本以${args[1]}价格卖出的获利盘比例`; } } ],
            ["PWINNER", { Name:"PWINNER", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}日前那部分成本以${args[1]}价格卖出的获利盘比例`; } } ],
            ["COSTEX", { Name:"COSTEX", Param:{ Count:2 }, ToString:function(args) { return `位于价格${args[0]}和${args[1]}间的成本`; } } ],
            ["PPART", { Name:"PPART", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}日前那部分成本占总成本的比例`; } } ],

            ["SAR", { Name:"SAR", Param:{ Count:3 }, ToString:function(args) { return `步长为${args[1]}极限值为${args[0]}的${args[2]}日抛物转向`; } } ],
            ["SARTURN", { Name:"SARTURN", Param:{ Count:3 }, ToString:function(args) { return `步长为${args[1]}极限值为${args[0]}的${args[2]}日抛物转向点`; } } ],

            //字符串函数
            ["CON2STR", { Name:"CON2STR", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}转为字符串`; } } ],
            ["VAR2STR", { Name:"VAR2STR", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}转为字符串`; } } ],
            ["STR2CON", { Name:"STR2CON", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}转为数字`; } } ],
            ["STRLEN", { Name:"STRLEN", Param:{ Count:1 }, ToString:function(args) { return `得到${args[0]}字符串长度`; } } ],
            ["STRCAT", { Name:"STRCAT", Param:{ Count:2 }, ToString:function(args) { return `字符串相加`; } } ],
            ["VARCAT", { Name:"VARCAT", Param:{ Count:2 }, ToString:function(args) { return `字符串相加`; } } ],
            ["STRSPACE", { Name:"STRSPACE", Param:{ Count:1 }, ToString:function(args) { return `字符串${args[0]}加一空格`; } } ],
            ["SUBSTR", { Name:"SUBSTR", Param:{ Count:3 }, ToString:function(args) { return `字符串${args[0]}中取一部分`; } } ],
            ["STRCMP", { Name:"STRCMP", Param:{ Count:2 }, ToString:function(args) { return `字符串${args[0]}和字符串${args[1]}比较`; } } ],
            ["FINDSTR", { Name:"FINDSTR", Param:{ Count:2 }, ToString:function(args) { return `字符串${args[0]}中查找字符串${args[1]}`; } } ],
            ["NAMEINCLUD", { Name:"NAMEINCLUD", Param:{ Count:1 }, ToString:function(args) { return `查找品种名称中包含${args[0]}`; } } ],
            ["CODELIKE", { Name:"CODELIKE", Param:{ Count:1 }, ToString:function(args) { return `查找品种名称中包含${args[0]}`; } } ],
            ["INBLOCK", { Name:"AVEDEV", Param:{ Count:1 }, ToString:function(args) { return `属于${args[0]}板块`; } } ],
            

            [
                "HHVBARS", 
                { 
                    Name:"HHVBARS", Param:{ Count:2 }, 
                    ToString:function(args) 
                    { 
                        if (args[1]==0) return `历史${args[0]}新高距今天数`;
                        return `${args[1]}日内${args[0]}新高距今天数`;
                    } 
                } 
            ],

            [
                "LLVBARS", 
                { 
                    Name:"LLVBARS", Param:{ Count:2 }, 
                    ToString:function(args) 
                    { 
                        if (args[1]==0) return `历史${args[0]}新低距今天数`;
                        return `${args[1]}日内${args[0]}新低距今天数`; 
                    } 
                } 
            ]
        ]
    );

    this.CallFunctionExplain=function(funcName, args, node)
    {
        if (this.FUNCTION_INFO_LIST.has(funcName))
        {
            var item=this.FUNCTION_INFO_LIST.get(funcName);
            if (item.Param.Count!=args.length)
                this.ThrowUnexpectedNode(node,`函数${funcName}参数个数不正确. 需要${item.Param.Count}个参数`);
            return item.ToString(args);
        }

        switch(funcName)
        {
            case "CALCSTOCKINDEX":
                return `引用${args[0]}的${args[1]}指标第${args[2]}个输出值`;

            case "PEAK":
            case "PEAKBARS":
            case "ZIG":
            case "ZIGA":
            case "TROUGH":
            case "TROUGHBARS":
                return this.GetZIGExplain(funcName,args);

            case "FINANCE":
                return this.GetFinanceExplain(args);
            case "DYNAINFO":
                return this.GetDynainfoExplain(args);
            
            case 'CLOSE':
            case 'C':
            case 'VOL':
            case 'V':
            case 'OPEN':
            case 'O':
            case 'HIGH':
            case 'H':
            case 'LOW':
            case 'L':
            case 'AMOUNT':
            case 'AMO':
                return this.GetOtherSymbolExplain( {FunctionName:funcName, Args:args} ,node);

            //绘图函数
            case "PLOYLINE":
                return `当满足条件${args[0]}时以${args[1]}位置为顶点画折线连接`;
            case "DRAWLINE":
                return `当满足条件${args[0]}时,在${args[1]}位置画直线起点，当满足条件${args[2]}时,在${args[3]}位置画直线终点,${args[4]}表示是否延长`;
            case "DRAWSL":
                return `当满足条件${args[0]}时,在${args[1]}位置画斜线线性回归,${args[2]}斜率,${args[3]}长度,${args[4]}方向`;
            case "DRAWKLINE":
                return 'K线';
            case "DRAWICON":
                return `当满足条件${args[0]}时,在${args[1]}位置画${args[2]}号图标`;
            case "DRAWTEXT":
                return `当满足条件${args[0]}时,在${args[1]}位置书写文字`;
            case "DRAWTEXT_FIX":
                return `当满足条件${args[0]}时,在横轴${args[1]}纵轴${args[2]}位置书写文字`;
            case "DRAWNUMBER":
                return `当满足条件${args[0]}时,在${args[1]}位置书写数字`;
            case "DRAWNUMBER_FIX":
                return `当满足条件${args[0]}时,在横轴${args[1]}纵轴${args[2]}位置书写数字`;
            case "RGB":
                return `自定色[${args[0]},${args[1]},${args[2]}]`;
            case "DRAWBAND":
                return '画带状线';
            case "DRAWRECTREL":
                return "相对位置上画矩形.";
            case "DRAWGBK":
                return "填充背景";
            case "STICKLINE":
                var barType="";
                if (args[4]==-1) barType="虚线空心柱";
                else if (args[4]==0) barType="实心柱";
                else barType="实线空心柱";
                return `当满足条件${args[0]}时, 在${args[1]}和${args[2]}位置之间画柱状线,宽度为${args[3]},${barType}`;

            default:
                this.ThrowUnexpectedNode(node,`函数${funcName}不存在`);
        }
    }

    this.GetDynainfoExplain=function(args)
    {
        const DATA_NAME_MAP=new Map(
        [
            [3,"前收盘价"], [4,"开盘价"], [5,"最高价"], [6,"最低价"], [7,"现价"], [8,'总量'], [9,"现量"],
            [10,"总金额"], [11,"均价"], [12,"日涨跌"], [13,"振幅"], [14,"涨幅"], [15,"开盘时的成交金额"],
            [16,"前5日每分钟均量"], [17,"量比"], [18,"上涨家数"], [19,"下跌家数"]
        ]);

        var id=args[0];
        if (DATA_NAME_MAP.has(id)) return DATA_NAME_MAP.get(id);

        return `即时行情[${id}]`;
    }

    this.GetFinanceExplain=function(args)
    {
        const DATA_NAME_MAP=new Map(
        [
            [1,"总股本"], [2,"市场类型"], [3,"沪深品种类型"], [4,"沪深行业代码"], [5,"B股"], [6,"H股"], [7,"流通股本[股]"], [8,"股东人数[户]"], [9,"资产负债率%"],
            [10,"总资产"], [11,"流动资产"], [12,"固定资产"], [13,"无形资产"], [15,"流动负债"], [16,"少数股东权益"]
            
        ]);
        var id=args[0];

        if (DATA_NAME_MAP.has(id)) return DATA_NAME_MAP.get(id);

        return `财务数据[${id}]`;
    }

    this.GetZIGExplain=function(funcName,args)
    {
        var value=args[0];
        if (value==0) value="开盘价";
        else if (value==1) value="最高价";
        else if (value==2) value="最低价";
        else if (value==3) value="收盘价";

        switch(funcName)
        {
        case "PEAK":
            return `${value}的${args[1]}%之字转向的前${args[2]}个波峰值`;
        case "PEAKBARS":
            return `${value}的${args[1]}5%之字转向的前${args[2]}个波峰位置`;
        case "ZIG":
            return `${value}的${args[1]}的之字转向`;
        case "ZIGA":
            return `${value}变化${args[1]}的之字转向`;
        case "TROUGH":
            return `${value}的${args[1]}%之字转向的前${args[2]}个波谷值`;
        case "TROUGHBARS":
            return `${value}的${args[1]}%之字转向的前${args[2]}个波谷位置`;
        }
    }

    this.GetColorExplain=function(colorName)
    {
        const COLOR_MAP=new Map(
        [
            ['COLORBLACK','黑色'],['COLORBLUE','蓝色'],['COLORGREEN','绿色'],['COLORCYAN','青色'],['COLORRED','红色'],
            ['COLORMAGENTA','洋红色'],['COLORBROWN','棕色'],['COLORLIGRAY','淡灰色'],['COLORGRAY','深灰色'],['COLORLIBLUE','淡蓝色'],       
            ['COLORLIGREEN','淡绿色'],['COLORLICYAN','淡青色'],['COLORLIRED','淡红色'],['COLORLIMAGENTA','淡洋红色'],['COLORWHITE','白色'],['COLORYELLOW','黄色']
        ]);

        if (COLOR_MAP.has(colorName)) return COLOR_MAP.get(colorName);

        //COLOR 自定义色
        //格式为COLOR+“RRGGBB”：RR、GG、BB表示红色、绿色和蓝色的分量，每种颜色的取值范围是00-FF，采用了16进制。
        //例如：MA5：MA(CLOSE，5)，COLOR00FFFF　表示纯红色与纯绿色的混合色：COLOR808000表示淡蓝色和淡绿色的混合色。
        if (colorName.indexOf('COLOR')==0) return '#'+colorName.substr(5);

        return 'rgb(30,144,255)';
    }

    this.GetLineWidthExplain=function(lineWidth)
    {
        var width=parseInt(lineWidth.replace("LINETHICK",""));
        if (IFrameSplitOperator.IsPlusNumber(width)) return width;
        return 1;
    }

    this.SymbolPeriodExplain=function(valueName,period)
    {
        const mapStockDataName=new Map(
        [
            ['CLOSE',"收盘价"],["C","收盘价"],['VOL',"成交量"],['V',"成交量"], ['OPEN',"开盘价"], ['O',"开盘价"], 
            ['HIGH',"最高价"],['H',"最高价"], ['LOW',"最低价"],['L',"最低价"],['AMOUNT',"成交金额"],['AMO',"成交金额"], 
            ['VOLINSTK',"持仓量"]
        ]);
        //MIN1,MIN5,MIN15,MIN30,MIN60,DAY,WEEK,MONTH,SEASON,YEAR
        const mapPeriodName=new Map(
        [
            ["MIN1","1分钟"], ["MIN5", "5分钟"], ["MIN15", "15分钟"], ["MIN30","30分钟"],["MIN60","60分钟"],
            ["DAY","日"],["WEEK","周"], ["MONTH", "月"], ['SEASON',"季"], ["YEAR", "年"],["WEEK2","双周"], ["HALFYEAR", "半年"]
        ]);

        var dataName=valueName;
        if (mapStockDataName.has(valueName)) dataName=mapStockDataName.get(valueName);

        var periodName=period;
        if (mapPeriodName.has(period)) periodName=mapPeriodName.get(period);

        return `${dataName}[取${periodName}数据]`;
    }

    this.GetOtherSymbolExplain=function(obj, node)
    {
        const mapStockDataName=new Map(
        [
            ['CLOSE',"收盘价"],["C","收盘价"],['VOL',"成交量"],['V',"成交量"], ['OPEN',"开盘价"], ['O',"开盘价"], 
            ['HIGH',"最高价"],['H',"最高价"], ['LOW',"最低价"],['L',"最低价"],['AMOUNT',"成交金额"],['AMO',"成交金额"], 
            ['VOLINSTK',"持仓量"]
        ]);
            
        if (obj.FunctionName)
        {
            var args=obj.Args;
            var dataName=mapStockDataName.get(obj.FunctionName);
            return `[${args[0]}]${dataName}`;
        }
        else if (obj.Literal)
        {
            var value=obj.Literal.toUpperCase();
            var args=value.split("$");
            if (!mapStockDataName.has(args[1])) return "";
            var symbol=args[0];
            var dataName=mapStockDataName.get(args[1]);
            return `[${symbol}]${dataName}`;
        }
    }

    this.IsDrawFunction=function(name)
    {
        let setFunctionName=new Set(
        [
            "STICKLINE","DRAWTEXT",'SUPERDRAWTEXT','DRAWLINE','DRAWBAND','DRAWKLINE','DRAWKLINE_IF','PLOYLINE',
            'POLYLINE','DRAWNUMBER',"DRAWNUMBER_FIX",'DRAWICON','DRAWCHANNEL','PARTLINE','DRAWTEXT_FIX','DRAWGBK','DRAWTEXT_LINE','DRAWRECTREL',"DRAWTEXTABS",
            'DRAWOVERLAYLINE',"FILLRGN", "FILLRGN2","FILLTOPRGN", "FILLBOTTOMRGN", "FILLVERTICALRGN","FLOATRGN","DRAWSL", "DRAWGBK2"
        ]);
        if (setFunctionName.has(name)) return true;
    
        return false;
    }

    //赋值
    this.VisitAssignmentExpression=function(node)
    {
        let left=node.Left;
        if (left.Type!=Syntax.Identifier) this.ThrowUnexpectedNode(node);

        let varName=left.Name;

        let right=node.Right;
        let value=null;
        if (right.Type==Syntax.BinaryExpression || right.Type==Syntax.LogicalExpression)
            value=this.VisitBinaryExpression(right);
        else if (right.Type==Syntax.CallExpression)
            value=this.VisitCallExpression(right);
        else if (right.Type==Syntax.Literal)
        {
            value=right.Value;
            if (IFrameSplitOperator.IsString(value) && right.Value.indexOf("$")>0)
                value=this.GetOtherSymbolExplain({ Literal:value }, node);
        }
        else if (right.Type==Syntax.Identifier) //右值是变量
            value=this.ReadVariable(right.Name,right);
        else if (right.Type==Syntax.MemberExpression)
            value=this.ReadMemberVariable(right);
        else if (right.Type==Syntax.UnaryExpression)
        {
            if (right.Operator=='-') 
            {
                var tempValue=this.GetNodeValue(right.Argument);
                value='-'+tempValue;
            }
            else 
            {
                value=right.Argument.Value;
            }
        }

        JSConsole.Complier.Log('[JSExplainer::VisitAssignmentExpression]' , varName, ' = ',value);
        this.VarTable.set(varName,value);
    }

    //逻辑运算
    this.VisitBinaryExpression=function(node)
    {
        let stack=[];
        stack.push(node);
        let temp=null;

        while(stack.length!=0)
        {
            temp=stack[stack.length-1];
            if (temp.Left && node!=temp.Left && node!=temp.Right)
            {
                stack.push(temp.Left);
            }
            else if (temp.Right && node!=temp.Right)
            {
                stack.push(temp.Right);
            }
            else
            {
                let value=stack.pop();
                if (value.Type==Syntax.BinaryExpression)    //只遍历操作符就可以
                {
                    let leftValue=this.GetNodeValue(value.Left);
                    let rightValue=this.GetNodeValue(value.Right);

                    JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] BinaryExpression',value , leftValue, rightValue);
                    value.Out=null; //保存中间值

                    value.Out=`(${leftValue} ${value.Operator} ${rightValue})`;
                    if (leftValue=="收盘价" && rightValue=="开盘价") 
                    {
                        if (value.Operator==">") value.Out='(收阳线)';
                        else if (value.Operator=="<") value.Out='(收阴线)';
                        else if (value.Operator=="=") value.Out='(平盘)';
                    }
                    else if (leftValue=="开盘价" && rightValue=="收盘价")
                    {
                        if (value.Operator=="<") value.Out='(收阳线)';
                        else if (value.Operator==">") value.Out='(收阴线)';
                        else if (value.Operator=="=") value.Out='(平盘)';
                    }
                        
                    JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] BinaryExpression',value);
                }
                else if (value.Type==Syntax.LogicalExpression)
                {
                    let leftValue=this.GetNodeValue(value.Left);
                    let rightValue=this.GetNodeValue(value.Right);

                    JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] LogicalExpression',value , leftValue, rightValue);
                    value.Out=null; //保存中间值

                    switch(value.Operator)
                    {
                        case '&&':
                        case 'AND':
                            value.Out=`(${leftValue} 并且 ${rightValue})`;
                            break;
                        case '||':
                        case 'OR':
                            value.Out=`(${leftValue} 或者 ${rightValue})`;
                            break;
                    }

                    JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] LogicalExpression',value);
                }
                
                node=temp;
            }
        }

        return node.Out;

    }

    this.GetNodeValue=function(node)
    {
        switch(node.Type)
        {
            case Syntax.Literal:    //数字
                return node.Value;
            case Syntax.UnaryExpression:
                if (node.Operator=='-') 
                {
                    let value=this.GetNodeValue(node.Argument);
                    return '-'+value;
                }
                return node.Argument.Value;
            case Syntax.Identifier:
                let value=this.ReadVariable(node.Name,node);
                return value;
            case Syntax.BinaryExpression:
            case Syntax.LogicalExpression:
                return node.Out;
            case Syntax.CallExpression:
                return this.VisitCallExpression(node);
            default:
                this.ThrowUnexpectedNode(node);
        }
    }

    //读取变量
    this.ReadVariable=function(name,node)
    {
        if (this.ConstVarTable.has(name)) 
        {
            let data=this.ConstVarTable.get(name);
            return data;
        }

        if (g_JSComplierResource.IsCustomVariant(name)) return this.ReadCustomVariant(name,node); //读取自定义变量

        if (this.VarTable.has(name)) return this.VarTable.get(name);

        if (name.indexOf('#')>0)
        {
            var aryPeriod=name.split('#');
            return this.SymbolPeriodExplain(aryPeriod[0],aryPeriod[1]);
        }

        this.ThrowUnexpectedNode(node, '变量'+name+'不存在');
        return name;
    }

    this.ThrowUnexpectedNode=function(node,message)
    {
        let marker=node.Marker;
        let msg=message || "执行异常";
       
        return this.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg);
       
    }

    this.ThrowError=function()
    {

    }
}


JSComplier.Explain=function(code,option, errorCallback)
{
    //异步调用
    //var asyncExecute= async function() es5不能执行 去掉异步
    var asyncExplain= function()
    {
        try
        {
            JSConsole.Complier.Log('[JSComplier.Explain]',code,option);

            JSConsole.Complier.Log('[JSComplier.Explain] parser .....');
            let parser=new JSParser(code);
            parser.Initialize();
            let program=parser.ParseScript(); 
            
            let ast=program;
            JSConsole.Complier.Log('[JSComplier.Explain] parser finish.', ast);

            JSConsole.Complier.Log('[JSComplier.Explain] explain .....');
            let execute=new JSExplainer(ast,option);
            execute.ErrorCallback=errorCallback;            //执行错误回调
            execute.JobList=parser.Node.GetDataJobList();
            execute.JobList.push({ID:JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT});
            let result=execute.Run();

        }catch(error)
        {
            JSConsole.Complier.Log(error);

            if (errorCallback) errorCallback(error, option.CallbackParam);
        }
    }

    asyncExplain();

    JSConsole.Complier.Log('[JSComplier.Explain] async explain.');
}