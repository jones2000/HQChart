/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   分析家语法编译执行器 (H5版本)
*/

//日志输出类
if (!JSConsole)
{
    var JSConsole=
    { 
        Chart:{ Log:console.log, Warn:console.warn },      //图形日志
        Complier:{ Log:console.log, Warn:console.warn }    //编译器日志
    };
}

//API默认地址
var g_JSComplierResource=
{
    Domain : "http://127.0.0.1:8080",               //API域名
    CacheDomain : "http://127.0.0.1:8087",          //缓存域名

    DrawIcon:
    {  
        Family:'iconfont', 
        Data:new Map([
            [1, { Text:'\ue660', Color:'rgb(243,28,15)'}],    //向上箭头
            [2, { Text:'\ue661', Color:'rgb(87,247,41)'}],    //向下箭头
            [3, { Text:'\ue662', Color:'rgb(237,153,0)'}],
            [4, { Text:'\ue663', Color:'rgb(237,153,0)'}],  
            [5, { Text:'\ue664', Color:'rgb(237,153,0)'}],  
            [6, { Text:'\ue665', Color:'rgb(140,57,208)'}],  
            [7, { Text:'\ue666', Color:'rgb(246,135,37)'}],  
            [8, { Text:'\ue667', Color:'rgb(85,231,56)'}],  
            [9, { Text:'\ue668', Color:'rgb(227,61,41)'}], 

            [10, { Text:'\ue669', Color:'rgb(216,78,48)'}], 
            [11, { Text:'\ue66a', Color:'rgb(249,187,0)'}],    //点赞
            [12, { Text:'\ue66b', Color:'rgb(249,187,0)'}], 
            [13, { Text:'\ue66c', Color:'rgb(216,42,0)'}], 
            [14, { Text:'\ue66d', Color:'rgb(58,90,236)'}], 
            [15, { Text:'\ue66e', Color:'rgb(227,149,0)'}], 
            [16, { Text:'\ue66f', Color:'rgb(208,82,78)'}], 
            [17, { Text:'\ue670', Color:'rgb(234,114,26)'}], 
            [18, { Text:'\ue671', Color:'rgb(116,25,255)'}], 
            [19, { Text:'\ue672', Color:'rgb(102,9,11)'}], 

            [20, { Text:'\ue673', Color:'rgb(127,125,137)'}],
            [21, { Text:'\ue674', Color:'rgb(110,188,255)'}],
            [22, { Text:'\ue675', Color:'rgb(238,79,51)'}],
            [23, { Text:'\ue676', Color:'rgb(244,71,0)'}],
            [24, { Text:'\ue677', Color:'rgb(102,183,248)'}],
            [25, { Text:'\ue678', Color:'rgb(234,88,231)'}],
            [26, { Text:'\ue679', Color:'rgb(242,171,0)'}],
            [27, { Text:'\ue67a', Color:'rgb(87,247,168)'}],
            [28, { Text:'\ue67b', Color:'rgb(97,204,113)'}],
            [29, { Text:'\ue67c', Color:'rgb(84,115,193)'}],

            [30, { Text:'\ue67d', Color:'rgb(141,51,255)'}],
            [31, { Text:'\ue67e', Color:'rgb(200,126,24)'}],
            [32, { Text:'\ue67f', Color:'rgb(195,41,32)'}],
            [33, { Text:'\ue68f', Color:'rgb(215,85,194)'}],
            [34, { Text:'\ue690', Color:'rgb(250,222,105)'}],
            [35, { Text:'\ue691', Color:'rgb(112,249,224)'}],
            [36, { Text:'\ue692', Color:'rgb(217,107,98)'}],
            [37, { Text:'\ue693', Color:'rgb(114,231,17)'}],
            [38, { Text:'\ue694', Color:'rgb(238,31,25)'}],
            [39, { Text:'\ue695', Color:'rgb(92,247,113)'}],

            [40, { Text:'\ue696', Color:'rgb(175,175,175)'}],
            [41, { Text:'\ue697', Color:'rgb(252,228,23)'}],
            [42, { Text:'\ue698', Color:'rgb(88,195,235)'}],
            [43, { Text:'\ue699', Color:'rgb(55,74,94)'}],
            [44, { Text:'\ue69a', Color:'rgb(248,175,33)'}],
            [45, { Text:'\ue69b', Color:'rgb(194,180,112)'}],
            [46, { Text:'\ue69c', Color:'rgb(50,153,28)'}],
            [47, { Text:'\ue69d', Color:'rgb(17,65,152)'}],
            [48, { Text:'\ue69e', Color:'rgb(194,55,26)'}],
            [49, { Text:'\ue69f', Color:'rgb(243,0,0)'}],

            /*
            [11,{ Text:'\ue624', Color:'rgb(245,159,40)'}],     
            [12,{ Text:'\ue600', Color:'rgb(245,159,40)'}],
            [13,{Text:'\ue70f',Color:'rgb(209,37,35)'}, ],      //B
            [14,{Text:'\ue64c',Color:'rgb(127,209,59)'} ],      //S
            [9, {Text:'\ue626',Color:'rgb(245,159,40)'} ],      //$
            [36,{Text:'\ue68c',Color:'rgb(255,106,106)'} ],     //关闭 红色
            [37,{Text:'\ue68c',Color:'rgb(46,139,87)'} ],       //关闭 绿色
            [38,{Text:'\ue68d',Color:'rgb(238,44,44)'} ],       //▲
            [39,{Text:'\ue68e',Color:'rgb(0,139,69)'} ],        //▼
            [46,{Text:'\ue64d',Color:'rgb(51,51,51)'} ],        //message
            */
        ])
    },

    CustomDrawIcon:
    {
        Data:new Map()  //自定义图标 key=id 
                        //value={ID:, Text:, Color, Family: }   //svg
                        //value={ ID:1, Symbol:'↑', Color:'rgb(238,44,44)' } //文字
    },

    CustomFunction: //定制函数
    {
        Data:new Map()  //自定义函数 key=函数名, Value:{ID:函数名, Callback: }
    },

    CustomVariant:  //自定义变量
    {
        Data:new Map()  //自定义函数 key=变量名, Value:{ Name:变量名, Description:描述信息 }
    },

    CustomDataFunction: //自定义数据函数 
    {
        //自定义函数 key=变量名, Value:{ Name:变量名, Description:描述信息, ArgCount:参数个数 }
        Data:new Map(
        [
            [
                "L2_VOLNUM",
                { 
                    Name:"L2_VOLNUM",
                    Description:"单数分档,按: N(0--1):(超大+大)/(中+小),M(0--1):买/卖二类,沪深京品种的资金流向,仅日线以上周期,用于特定版本", 
                    ArgCount:2 
                }
            ],
            [
                "L2_VOL", 
                { 
                    Name:"L2_VOL",
                    Description:"成交量分档,按: N(0--3):超大/大/中/小四档处理,M(0--3):买入/卖出/主买/主卖四类,沪深京品种的资金流向,仅日线以上周期,用于特定版本", 
                    ArgCount:2 
                }
            ],
            [
                "L2_AMO", 
                { 
                    Name:"L2_AMO",
                    Description:"成交额分档,按: N(0--3):超大/大/中/小四档处理,M(0--3):买入/卖出/主买/主卖四类,沪深京品种的资金流向,仅日线以上周期,用于特定版本", 
                    ArgCount:2 
                }
            ]
        ])  
    },

    GetDrawIcon:function(id)
    {
        var icon;
        if (g_JSComplierResource.CustomDrawIcon.Data.has(id))
        {
            const iconfont=g_JSComplierResource.CustomDrawIcon.Data.get(id);
            if (iconfont.Symbol)    //文字
                icon={ Symbol:iconfont.Symbol, Color:iconfont.Color, IconFont:false, ID:id };
            else    //SVG图标
                icon={ Symbol:iconfont.Text, Color:iconfont.Color, Family:iconfont.Family, IconFont:true, ID:id };
            return icon;
        }

        if (g_JSComplierResource.DrawIcon.Data.has(id))
        {
            const iconfont=g_JSComplierResource.DrawIcon.Data.get(id);
            icon={ Symbol:iconfont.Text, Color:iconfont.Color, Family:g_JSComplierResource.DrawIcon.Family, IconFont:true, ID:id };
            return icon;
        }

        return null;
    },

    GetDrawTextIcon:function(id)
    {
        //图标对应的字符代码
        let mapIcon=new Map([
            [1,{Symbol:'↑',Color:'rgb(238,44,44)'} ],[2,{Symbol:'↓',Color:'rgb(0,139,69)'} ],
            [3,{Symbol:'😧'} ],[4,{Symbol:'😨'} ],[5,{Symbol:'😁'} ],[6,{Symbol:'😱'} ],
            [7,{Symbol:'B',Color:'rgb(238,44,44)'} ],[8,{Symbol:'S',Color:'rgb(0,139,69)'} ],
            [9,{Symbol:'💰'} ],[10,{Symbol:'📪'} ],[11,{Symbol:'👆'} ],[12,{Symbol:'👇'} ],
            [13,{Symbol:'B',Color:'rgb(178,34,34)'}, ],[14,{Symbol:'S',Color:'rgb(0,139,69)'} ],
            [36,{Symbol:'Χ',Color:'rgb(238,44,44)'} ],[37,{Symbol:'X',Color:'rgb(0,139,69)'} ],
            [38,{Symbol:'▲',Color:'rgb(238,44,44)'} ],[39,{Symbol:'▼',Color:'rgb(0,139,69)'} ],
            [40,{Symbol:'◉',Color:'rgb(238,44,44)'}], [41,{Symbol:'◈',Color:'rgb(238,44,44)'}],
            [42,{Symbol:'📌'}], [43,{Symbol:'💎'}], [44,{Symbol:'🥇'}],[45,{Symbol:'🥈'}],[46,{Symbol:'🥉'}],[47,{Symbol:'🏅'}]
        ]);

        var icon=mapIcon.get(id);
        return icon;
    },

    IsCustomFunction:function(name)
    {
        if (g_JSComplierResource.CustomFunction.Data.has(name)) return true;
        return false;
    },

    IsCustomVariant:function(name)
    {
        if (g_JSComplierResource.CustomVariant.Data.has(name)) return true;
        return false;
    },

    IsCustomDataFunction:function(name)
    {
        if (g_JSComplierResource.CustomDataFunction.Data.has(name)) return true;
        return false;
    }
}

var Messages = {
    BadGetterArity: 'Getter must not have any formal parameters',
    BadSetterArity: 'Setter must have exactly one formal parameter',
    BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
    ConstructorIsAsync: 'Class constructor may not be an async method',
    ConstructorSpecialMethod: 'Class constructor may not be an accessor',
    DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
    DefaultRestParameter: 'Unexpected token =',
    DuplicateBinding: 'Duplicate binding %0',
    DuplicateConstructor: 'A class may only have one constructor',
    DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
    ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
    GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
    IllegalBreak: 'Illegal break statement',
    IllegalContinue: 'Illegal continue statement',
    IllegalExportDeclaration: 'Unexpected token',
    IllegalImportDeclaration: 'Unexpected token',
    IllegalLanguageModeDirective: 'Illegal \'use strict\' directive in function with non-simple parameter list',
    IllegalReturn: 'Illegal return statement',
    InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
    InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
    InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
    InvalidLHSInForIn: 'Invalid left-hand side in for-in',
    InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
    InvalidModuleSpecifier: 'Unexpected token',
    InvalidRegExp: 'Invalid regular expression',
    LetInLexicalBinding: 'let is disallowed as a lexically bound name',
    MissingFromClause: 'Unexpected token',
    MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
    NewlineAfterThrow: 'Illegal newline after throw',
    NoAsAfterImportNamespace: 'Unexpected token',
    NoCatchOrFinally: 'Missing catch or finally after try',
    ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
    Redeclaration: '%0 \'%1\' has already been declared',
    StaticPrototype: 'Classes may not have static property named prototype',
    StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
    StrictDelete: 'Delete of an unqualified identifier in strict mode.',
    StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
    StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
    StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
    StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
    StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
    StrictModeWith: 'Strict mode code may not include a with statement',
    StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
    StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
    StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
    StrictReservedWord: 'Use of future reserved word in strict mode',
    StrictVarName: 'Variable name may not be eval or arguments in strict mode',
    TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
    UnexpectedEOS: 'Unexpected end of input',
    UnexpectedIdentifier: 'Unexpected identifier',
    UnexpectedNumber: 'Unexpected number',
    UnexpectedReserved: 'Unexpected reserved word',
    UnexpectedString: 'Unexpected string',
    UnexpectedTemplate: 'Unexpected quasi %0',
    UnexpectedToken: 'Unexpected token %0',
    UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
    UnknownLabel: 'Undefined label \'%0\'',
    UnterminatedRegExp: 'Invalid regular expression: missing /'
};

var Regex = {
    // Unicode v8.0.0 NonAsciiIdentifierStart:
    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
    // Unicode v8.0.0 NonAsciiIdentifierPart:
    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
}

var Character =
{
    FromCodePoint: function (cp) {
        return (cp < 0x10000) ? String.fromCharCode(cp) :
            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
                String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
    },

    //是否是空格 https://tc39.github.io/ecma262/#sec-white-space
    IsWhiteSpace:function(cp)
    {
        return (cp === 0x20) || (cp === 0x09) || (cp === 0x0B) || (cp === 0x0C) || (cp === 0xA0) ||
            (cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0);
    },

    //是否换行 https://tc39.github.io/ecma262/#sec-line-terminators
    IsLineTerminator:function(cp)
    {
        return (cp === 0x0A) || (cp === 0x0D) || (cp === 0x2028) || (cp === 0x2029);
    },

    // https://tc39.github.io/ecma262/#sec-names-and-keywords
    IsIdentifierStart:function(cp)
    {
        return (cp === 0x24) || (cp === 0x5F) ||
            (cp >= 0x41 && cp <= 0x5A) ||
            (cp >= 0x61 && cp <= 0x7A) ||
            (cp === 0x5C) ||
            //【】▲▼
            (cp===0x3010 || cp===0x3011 || cp===0x25B2 || cp===0x25BC) ||
            ((cp >= 0x80) && Regex.NonAsciiIdentifierStart.test(Character.FromCodePoint(cp)));
    },

    IsIdentifierPart: function (cp) 
    {
        return (cp === 0x24) || (cp === 0x5F) ||
            (cp >= 0x41 && cp <= 0x5A) ||
            (cp >= 0x61 && cp <= 0x7A) ||
            (cp >= 0x30 && cp <= 0x39) ||
            (cp === 0x5C) || (cp===0x23) ||
            //【】▲▼
            (cp===0x3010 || cp===0x3011 || cp===0x25B2 || cp===0x25BC) ||
            ((cp >= 0x80) && Regex.NonAsciiIdentifierPart.test(Character.FromCodePoint(cp)));
    },

    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
    IsDecimalDigit: function (cp) 
    {
        return (cp >= 0x30 && cp <= 0x39); // 0..9
    },

    IsHexDigit: function (cp) 
    {
        return (cp >= 0x30 && cp <= 0x39) || (cp >= 0x41 && cp <= 0x46) || (cp >= 0x61 && cp <= 0x66); // a..f
    },

    isOctalDigit: function (cp) 
    {
        return (cp >= 0x30 && cp <= 0x37); // 0..7
    }
}

var TOKEN_NAME={};
TOKEN_NAME[1 /* BooleanLiteral */] = 'Boolean';
TOKEN_NAME[2 /* EOF */] = '<end>';
TOKEN_NAME[3 /* Identifier */] = 'Identifier';
TOKEN_NAME[4 /* Keyword */] = 'Keyword';
TOKEN_NAME[5 /* NullLiteral */] = 'Null';
TOKEN_NAME[6 /* NumericLiteral */] = 'Numeric';
TOKEN_NAME[7 /* Punctuator */] = 'Punctuator';
TOKEN_NAME[8 /* StringLiteral */] = 'String';
TOKEN_NAME[9 /* RegularExpression */] = 'RegularExpression';
TOKEN_NAME[10 /* Template */] = 'Template';

//公共方法
function JSComplierHelper()
{
    
}

JSComplierHelper.GetPeriodInfo=function(obj)
{
    const PERIOD_LIST=
    [
        {Name:'MIN1', Period:4, Order:1},
        {Name:'MIN5', Period:5, Order:2},
        {Name:'MIN15', Period:6, Order:3},
        {Name:'MIN30', Period:7, Order:4},
        {Name:'MIN60', Period:8, Order:5},

        {Name:'DAY',    Period:0, Order:1000},
        {Name:'MULTIDAY',    Period:40002, Order:1002},
        {Name:'DAY2',    Period:40002, Order:1002},
        {Name:'DAY3',    Period:40003, Order:1003},
        {Name:'DAY4',    Period:40004, Order:1004},
        {Name:'DAY5',    Period:40005, Order:1005},
        {Name:'WEEK',   Period:1, Order:1005},

        {Name:'DAY6',    Period:40006, Order:1006},
        {Name:'DAY7',    Period:40007, Order:1007},
        {Name:'DAY8',    Period:40008, Order:1008},
        {Name:'DAY9',    Period:40009, Order:1009},
        {Name:'DAY10',   Period:40009, Order:1010},
        {Name:"WEEK2",   Period:21,    Order:1010},

        {Name:'DAY11',    Period:40011, Order:1011},
        {Name:'DAY12',    Period:40012, Order:1012},
        {Name:'DAY13',    Period:40013, Order:1013},
        {Name:'DAY14',    Period:40014, Order:1014},

        {Name:'MONTH',  Period:2, Order:1030},
        {Name:"SEASON", Period:9, Order:1090},
        {Name:"HALFYEAR", Period:22, Order:1180},
        {Name:"YEAR",   Period:3, Order:1365}
    ];

    if (obj.Name)
    {
        for(var i in PERIOD_LIST)
        {
            if (obj.Name && PERIOD_LIST[i].Name==obj.Name) 
                return PERIOD_LIST[i];
        }

        return null;
    }

    if (IFrameSplitOperator.IsNumber(obj.PeriodID))
    {
        for(var i in PERIOD_LIST)
        {
            if (PERIOD_LIST[i].Period==obj.PeriodID)
                return PERIOD_LIST[i];
        }

        return null;
    }

    return null;
}

JSComplierHelper.GetConvertValueName=function(funcName)
{
    var valueName;
    if (funcName=='COVER_C') valueName='CLOSE';
    else if (funcName=='COVER_O') valueName="OPEN";
    else if (funcName=='COVER_H') valueName="HIGH";
    else if (funcName=='COVER_L') valueName="LOW";
    else if (funcName=='COVER_A') valueName="AMOUNT";
    else if (funcName=='COVER_V') valueName="VOL";

    return valueName;
}
        


//编译异常, 错误类
function ErrorHandler()
{
    this.Error=[];

    this.RecordError=function(error)
    {
        this.Error.push(error);
    }

    this.ConstructError=function(msg,column)
    {
        let error=new Error(msg);
        //通过自己抛异常并自己截获 来获取调用堆栈信息
        try
        {
            throw error;
        }
        catch(base)
        {
            if (Object.create && Object.defineProperties)
            {
                error=Object.create(base);
                error.Column=column;
            }
        }

        return error;
    }

    this.CreateError=function(index, line, col, description, word)
    {
        let msg='Line ' + line + ': ' + description;
        let error=this.ConstructError(msg,col);
        error.Index=index;
        error.LineNumber=line;
        error.Description=description;
        error.Word=word;    //错误单词
        return error;
    }

    this.ThrowError=function(index, line, col, description, word)
    {
        let error=this.CreateError(index,line,col,description,word);
        throw error;
    }

    //重新下载数据
    this.ThrowDownloadJob=function(index, line, col, description,job)
    {
        let error=this.CreateError(index,line,col,description);
        error.Job=job;
        throw error;
    }
}

//扫描类
function Scanner(code, ErrorHandler)
{
    this.Source=code;
    this.ErrorHandler=ErrorHandler;
    this.Length=code.length;
    this.Index=0;
    this.LineNumber=(code.length>0)?1:0;
    this.LineStart=0;
    this.CurlyStack=[];

    this.SaveState=function()   //保存当前扫描状态
    {
        return { Index:this.Index, LineNumber:this.LineNumber, LineStart:this.LineStart };
    }

    this.RestoreState=function(state)   //还原扫描状态
    {
        this.Index=state.Index;
        this.LineNumber=state.LineNumber;
        this.LineStart=state.LineStart;
    }

    this.IsEOF=function()     //否是已经结束
    {
        return this.Index>=this.Length;
    }

    this.IsKeyword=function(id)
    {
        return false;
    }

    this.CodePointAt = function (i) 
    {
        let cp = this.Source.charCodeAt(i);
        if (cp >= 0xD800 && cp <= 0xDBFF) 
        {
            let second = this.Source.charCodeAt(i + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) {
                var first = cp;
                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            }
        }
        return cp;
    }

    this.Lex=function()
    {
        if (this.IsEOF()) return { Type:2/*EOF*/, Value:'', LineNumber:this.LineNumber, LineStart:this.LineStart, Start:this.Index, End:this.Index };
        let cp=this.Source.charCodeAt(this.Index);

        //变量名 或 关键字
        if (Character.IsIdentifierStart(cp)) return this.ScanIdentifier();

        //( ) ; 开头 操作符扫描
        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) return this.ScanPunctuator();

        //' " 开头 字符串扫描
        if (cp === 0x27 || cp === 0x22) return this.ScanStringLiteral();

        //. 开头 浮点型
        if (cp==0x2E)
        {
            if (Character.IsDecimalDigit(this.Source.charCodeAt(this.Index + 1))) 
                return this.ScanNumericLiteral();

            return this.ScanPunctuator();
        }

        //数字
        if (Character.IsDecimalDigit(cp))  return this.ScanNumericLiteral();
        
        if (cp >= 0xD800 && cp < 0xDFFF)
        {
            if (Character.IsIdentifierStart(this.CodePointAt(this.Index))) return this.ScanIdentifier();
        }

        return this.ScanPunctuator();

    }

    //关键字 变量名 https://tc39.github.io/ecma262/#sec-names-and-keywords
    this.ScanIdentifier=function()
    {
        let type;
        let start=this.Index;
        //0x5C 反斜杠
        let id=(this.Source.charCodeAt(start)=== 0x5C) ? this.GetComplexIdentifier() : this.GetIdentifier();

        if (id.length) type=3;                      //Identifier
        else if (this.IsKeyword(id)) type=4;        //Keyword
        else if (id==null) type=5;                  //NullLiteral
        else if (id=='true' || id=='false') type=1; //BooleanLiteral
        else type=3;                                //Identifier

        if (type!=3  && (start+id.length!=this.Index))
        {
            let restore=this.Index;
            this.Index=start;
            throw Messages.InvalidEscapedReservedWord;
            this.Index=restore;
        }

        if (id=='AND' || id=='OR') type=7 /*Punctuator*/;

        return { Type:type, Value:id, LineNumber:this.LineNumber, LineStart:this.LineStart, Start:start, End:this.Index};
    }

    this.GetIdentifier=function()
    {
        let start=this.Index++; //start 保存进来的位置
        while(!this.IsEOF())
        {
            let ch=this.Source.charCodeAt(this.Index);
            if (ch==0x5C) 
            {
                this.Index=start;
                return this.GetComplexIdentifier();
            }
            else if (ch >= 0xD800 && ch < 0xDFFF)
            {
                this.Index=start;
                return this.GetComplexIdentifier();
            }

            if (Character.IsIdentifierPart(ch)) ++this.Index;
            else break;
        }

        return this.Source.slice(start,this.Index);
    }

    //操作符 https://tc39.github.io/ecma262/#sec-punctuators
    this.ScanPunctuator=function()
    {
        let start=this.Index;
        let str=this.Source[this.Index];
        switch(str)
        {
            case '(':
                ++this.Index;
                break;
            case ')':
            case ';':
            case ',':
                ++this.Index;
                break;
            case '.':
                ++this.Index;
                /*if (this.Source[this.Index] === '.' && this.Source[this.Index + 1] === '.') 
                {
                    //Spread operator: ...
                    this.Index += 2;
                    str = '...';
                }
                */
                break;
            default:
                str=this.Source.substr(this.Index,3);
                if (str=='AND') 
                {
                    this.Index+=3;
                }
                else
                {
                    str = this.Source.substr(this.Index, 2);
                    if (str === '&&' || str === '||' || str === '==' || str === '!=' || str === '<=' || str === '>=' || str === '=>' || str==':=' || str=='OR' || str=='<>')
                    {
                        this.Index += 2;
                    }
                    else 
                    {
                        str=this.Source[this.Index];
                        if ('<>=!+-*%&|^/:'.indexOf(str) >= 0) ++this.Index;
                    }
                }
        }

        if (this.Index==start) 
           this.ThrowUnecpectedToken();

        return { Type:7/*Punctuator*/, Value:str, LineNumber:this.LineNumber, LineStart:this.LineStart, Start:start, End:this.Index };
    }

    //字符串 https://tc39.github.io/ecma262/#sec-literals-string-literals
    this.ScanStringLiteral=function()
    {
        let start=this.Index;
        let quote=this.Source[this.Index];

        ++this.Index;
        var octal=false;
        let str='';
        while(!this.IsEOF())
        {
            let ch=this.Source[this.Index++];
            if (ch==quote) 
            {
                quote='';
                break;
            }
            else if (ch=='\\')  //字符串转义
            {
                throw "not complete";
            }
            else if (Character.IsLineTerminator(ch.charCodeAt(0))) 
            {
                break;
            }
            else
            {
                str+=ch;
            }
        }

        if (quote!='')
        {
            this.Index=start;
            this.ThrowUnecpectedToken();
        }

        return {Type:8/*StringLiteral*/, Value:str, LineNumber:this.LineNumber, LineStart:this.LineStart, Start:start, End:this.Index};
    }

    this.ScanNumericLiteral=function()
    {
        let start=this.Index;
        let ch=this.Source[this.Index];
        let num='';
        if (ch!='.')
        {
            num=this.Source[this.Index++];
            ch=this.Source[this.Index];
            // Hex number starts with '0x'. 16进制
            if (num=='0')
            {
                if (ch=='x' || ch=='X')
                {
                    ++this.Index;
                    return this.ScanHexLiteral(start);
                }
            }

            while(Character.IsDecimalDigit(this.Source.charCodeAt(this.Index)))
            {
                num+=this.Source[this.Index++];
            }
            
            ch=this.Source[this.Index];
        }

        if (ch=='.')
        {
            num+=this.Source[this.Index++];
            while(Character.IsDecimalDigit(this.Source.charCodeAt(this.Index)))
            {
                num+=this.Source[this.Index++];
            }
            ch=this.Source[this.Index];
        }

        //科学计数法
        if (ch=='e' || ch=='E')
        {
            num+=this.Source[this.Index++];
            ch=this.Source[this.Index];
            if (ch=='+' || ch=='-') num+=this.Source[this.Index];
            if (Character.IsDecimalDigit(this.Source.charCodeAt(this.Index)))
            {
                while(Character.IsDecimalDigit(this.Source.charCodeAt(this.Index)))
                {
                    num+=this.Source[this.Index++];
                }
            }
            else
            {
                this.ThrowUnecpectedToken();
            }
        }

        if (Character.IsIdentifierStart(this.Source.charCodeAt(this.Index)))
        {
            this.ThrowUnecpectedToken();
        }

        return { Type:6/*NumericLiteral*/, Value:parseFloat(num), LineNumber:this.LineNumber, LineStart:this.LineStart, Start:start, End:this.Index };
    }

    //空格 或 注释
    this.ScanComments=function()
    {
        let comments;
        let start=(this.Index==0);
        while(!this.IsEOF())
        {
            let ch=this.Source.charCodeAt(this.Index);
            if (Character.IsWhiteSpace(ch)) //过滤掉空格
            {
                ++this.Index;
            }
            else if (Character.IsLineTerminator(ch))
            {
                ++this.Index;
                if (ch==0x0D && this.Source.charCodeAt(this.Index)==0x0A) ++this.Index; //回车+换行
                ++this.LineNumber;
                this.LineStart=this.Index;
                start=true;
            }
            else if (ch==0x2F)      // //注释
            {
                ch=this.Source.charCodeAt(this.Index+1);
                if (ch==0x2F)
                {
                    this.Index+=2;
                    let comment=this.SkipSingleLineComment(2);
                    start=true;
                }
                else
                {
                    break;
                }
            }
            else if (ch==0x7B)      //{ }  注释
            {
                this.Index+=1;
                let comment = this.SkipMultiLineComment();
            }
            else 
            {
                break;
            }
        }

        return comments;
    }

    this.SkipMultiLineComment=function()
    {
        var comments = [];
        while(!this.IsEOF())
        {
            var ch=this.Source.charCodeAt(this.Index);
            if (Character.IsLineTerminator(ch))
            {
                ++this.LineNumber;
                ++this.Index;
                this.LineStart=this.Index;
            }
            else if (ch==0x7D)
            {
                this.Index+=1;
                return comments;
            }
            else
            {
                ++this.Index;
            }
        }

        return comments;
    }

    //单行注释 https://tc39.github.io/ecma262/#sec-comments
    this.SkipSingleLineComment=function(offset)
    {
        let comments=[];
        while(!this.IsEOF())
        {
            let ch=this.Source.charCodeAt(this.Index);
            ++this.Index;
            if (Character.IsLineTerminator(ch))
            {
                if (ch === 13 && this.Source.charCodeAt(this.Index) === 10) 
                    ++this.Index;

                ++this.LineNumber;
                this.LineStart=this.Index;
                return comments;
            }
        }

        return comments;
    }

    this.ThrowUnecpectedToken=function(message,word)
    {
        if (!message) message = Messages.UnexpectedTokenIllegal;
	    return this.ErrorHandler.ThrowError(this.Index, this.LineNumber, this.Index - this.LineStart + 1, message, word);
    }

}

function Tokenizer(code)
{
    this.ErrorHandler=new ErrorHandler();   //错误信息处理类
    this.Scanner=new Scanner(code,this.ErrorHandler);
    this.Buffer=[];

    this.GetNextToken=function()
    {
        if (this.Buffer.length==0)
        {
            let comments=this.Scanner.ScanComments();
            if (!this.Scanner.IsEOF())
            {
                let token=this.Scanner.Lex();

                let entry={ Type:TOKEN_NAME[token.Type], Value:this.Scanner.Source.slice(token.Start, token.End)};

                this.Buffer.push(entry);
            }
        }

        return this.Buffer.shift();
    }
}

var Syntax = {
    AssignmentExpression: 'AssignmentExpression',
    AssignmentPattern: 'AssignmentPattern',
    ArrayExpression: 'ArrayExpression',
    ArrayPattern: 'ArrayPattern',
    ArrowFunctionExpression: 'ArrowFunctionExpression',
    AwaitExpression: 'AwaitExpression',
    BlockStatement: 'BlockStatement',
    BinaryExpression: 'BinaryExpression',
    BreakStatement: 'BreakStatement',
    CallExpression: 'CallExpression',
    CatchClause: 'CatchClause',
    ClassBody: 'ClassBody',
    ClassDeclaration: 'ClassDeclaration',
    ClassExpression: 'ClassExpression',
    ConditionalExpression: 'ConditionalExpression',
    ContinueStatement: 'ContinueStatement',
    DoWhileStatement: 'DoWhileStatement',
    DebuggerStatement: 'DebuggerStatement',
    EmptyStatement: 'EmptyStatement',
    ExportAllDeclaration: 'ExportAllDeclaration',
    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
    ExportNamedDeclaration: 'ExportNamedDeclaration',
    ExportSpecifier: 'ExportSpecifier',
    ExpressionStatement: 'ExpressionStatement',
    ForStatement: 'ForStatement',
    ForOfStatement: 'ForOfStatement',
    ForInStatement: 'ForInStatement',
    FunctionDeclaration: 'FunctionDeclaration',
    FunctionExpression: 'FunctionExpression',
    Identifier: 'Identifier',
    IfStatement: 'IfStatement',
    ImportDeclaration: 'ImportDeclaration',
    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
    ImportSpecifier: 'ImportSpecifier',
    Literal: 'Literal',
    LabeledStatement: 'LabeledStatement',
    LogicalExpression: 'LogicalExpression',
    MemberExpression: 'MemberExpression',
    MetaProperty: 'MetaProperty',
    MethodDefinition: 'MethodDefinition',
    NewExpression: 'NewExpression',
    ObjectExpression: 'ObjectExpression',
    ObjectPattern: 'ObjectPattern',
    Program: 'Program',
    Property: 'Property',
    RestElement: 'RestElement',
    ReturnStatement: 'ReturnStatement',
    SequenceExpression: 'SequenceExpression',
    SpreadElement: 'SpreadElement',
    Super: 'Super',
    SwitchCase: 'SwitchCase',
    SwitchStatement: 'SwitchStatement',
    TaggedTemplateExpression: 'TaggedTemplateExpression',
    TemplateElement: 'TemplateElement',
    TemplateLiteral: 'TemplateLiteral',
    ThisExpression: 'ThisExpression',
    ThrowStatement: 'ThrowStatement',
    TryStatement: 'TryStatement',
    UnaryExpression: 'UnaryExpression',
    UpdateExpression: 'UpdateExpression',
    VariableDeclaration: 'VariableDeclaration',
    VariableDeclarator: 'VariableDeclarator',
    WhileStatement: 'WhileStatement',
    WithStatement: 'WithStatement',
    YieldExpression: 'YieldExpression'
};


function Node(ErrorHandler)
{
    this.IsNeedIndexData=false;         //是否需要大盘数据
    this.IsNeedLatestIndexData=false;   //是否需要下载最新大盘数据
    this.IsNeedSymbolData=false;        //是否需要下载股票数据
    this.IsNeedMarginData=new Set();
    this.IsNeedNewsAnalysisData=new Set();      //新闻统计数据
    this.NeedBlockIncreaseData=[];              //是否需要市场涨跌股票数据统计
    this.IsNeedSymbolExData=new Set();          //下载股票行情的其他数据
    this.NeedHK2SHSZData=[];                    //下载北上资金数据
    this.IsNeedSectionFinance=new Map();        //下载截面财务数据 { key= 报告期 , Set() 字段}

    this.FunctionData=[];                       //{ID:,  Args:,  FunctionName: }
                                                //FINVALUE(ID),FINONE(ID,Y,MMDD)
    this.Dynainfo=[];   //最新的个股行情数据 {ID:,  Args:,  FunctionName: }

    this.IsAPIData=[]       //加载API数据

    this.ExecuteIndex=[];       //执行调用指标
    this.OtherSymbolData=[];    //其他股票数据 key=股票代码(小写)
    this.PeriodSymbolData=[];   //跨周期数据 { Period:, VarName: }

    this.ErrorHandler=ErrorHandler;

    this.GetDataJobList=function()  //下载数据任务列表
    {
        let jobs=[];
        if (this.IsNeedSymbolData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA});
        if (this.IsNeedIndexData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA});
        if (this.IsNeedLatestIndexData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_LATEST_INDEX_DATA});

        //最新的个股行情数据
        for(var i=0;i<this.Dynainfo.length;++i)
        {
            var item=this.Dynainfo[i];
            jobs.push(item);
        }

        //涨跌停家数统计
        for(var i in this.NeedBlockIncreaseData)    
        {
            jobs.push(this.NeedBlockIncreaseData[i]);
        }

        //加载融资融券
        for(var jobID of this.IsNeedMarginData)
        {
            jobs.push({ID:jobID});
        }

        //加载北上资金
        for(var i in this.NeedHK2SHSZData)
        {
            jobs.push(this.NeedHK2SHSZData[i]);
        }

        //加载新闻统计
        for(var jobID of this.IsNeedNewsAnalysisData)
        {
            jobs.push({ID:jobID});
        }

        //行情其他数据
        for(var jobID of this.IsNeedSymbolExData)
        {
            jobs.push({ID:jobID});
        }

        //获取截面数据下载任务
        for(var item of this.IsNeedSectionFinance)
        {
            jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_SF, SF:item});
        }

        for(var i in this.IsAPIData)
        {
            var item=this.IsAPIData[i];
            jobs.push(item);
        }

        for(var i in this.ExecuteIndex)
        {
            var item=this.ExecuteIndex[i];
            jobs.push(item);
        }

        for(var i in this.OtherSymbolData)
        {
            var item=this.OtherSymbolData[i];
            jobs.push(item);
        }

        for(var i in this.PeriodSymbolData)
        {
            var item=this.PeriodSymbolData[i];
            jobs.push(item);
        }

        for(var i in this.FunctionData)
        {
            var item=this.FunctionData[i];
            jobs.push(item);
        }

        return jobs;
    }

    this.VerifySymbolVariable=function(varName, token)
    {
        let setIndexName=new Set(['INDEXA','INDEXC','INDEXH','INDEXL',"INDEXO","INDEXV",'INDEXDEC','INDEXADV']);
        if (setIndexName.has(varName)) 
        {
            this.IsNeedIndexData=true;
            return;
        }

        let setSymbolDataName=new Set(['CLOSE','C','VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT','AMO','VOLINSTK']);
        if (setSymbolDataName.has(varName)) 
        {
            this.IsNeedSymbolData=true;
            return;
        }

        if (varName==='VOLR')
        {
            if (!this.IsNeedSymbolExData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA))
                this.IsNeedSymbolExData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA);
        }

        //CAPITAL流通股本(手), EXCHANGE 换手率, TOTALCAPITAL 总股本(手)
        let setVariantName=new Set(
        [
            "CAPITAL","TOTALCAPITAL","EXCHANGE",
            "HYBLOCK","DYBLOCK","GNBLOCK","FGBLOCK","ZSBLOCK","ZHBLOCK","ZDBLOCK","HYZSCODE",
            "GNBLOCKNUM","FGBLOCKNUM","ZSBLOCKNUM","ZHBLOCKNUM","ZDBLOCKNUM",
            "HYSYL","HYSJL","FROMOPEN",
            //资金流向
            "LARGEINTRDVOL","LARGEOUTTRDVOL",
            "TRADENUM","TRADEINNUM","TRADEOUTNUM",
            "LARGETRDINNUM","LARGETRDOUTNUM",
            "CUR_BUYORDER","CUR_SELLORDER",
            "ACTINVOL","ACTOUTVOL",
            "BIDORDERVOL","BIDCANCELVOL","AVGBIDPX", 
            "OFFERORDERVOL","OFFERCANCELVOL","AVGOFFERPX", 
        ]);

        if (setVariantName.has(varName))
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VARIANT, VariantName:varName };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (varName=='ADVANCE' || varName=="DECLINE")
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA, IsSelfSymbol:true, FunctionName:varName };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.NeedBlockIncreaseData.push(item);  
            return;
        }

        if (varName.indexOf('#')>0)
        {
            var aryWrods = varName.split('#');
            if (aryWrods.length!=2)
            {
                var errorMessage=`${varName}, 跨周期语法错误, 变量名#周期`;
                this.ThrowUnexpectedToken(token,errorMessage);
            }
            else
            {
                const VAR_NAME=["C", "CLOSE", "O","OPEN", "H","HIGH", "L", "LOW", "AMOUNT", "AMO", "VOL", "V" , "VOLINSTK"];
                if (VAR_NAME.indexOf(aryWrods[0])<0)
                {
                    var errorMessage=`${varName}, 跨周期语法错误, 数据只支持'OPEN,HIGH,LOW,CLOSE,VOL,AMOUNT,VOLINSTK'`;
                    this.ThrowUnexpectedToken(token,errorMessage);
                }

                const VAR_PERIOD_NAME=
                [
                    "MIN1","MIN5","MIN15","MIN30","MIN60","MIN120","MIN240","DAY","WEEK","MONTH","SEASON","YEAR","HALFYEAR","WEEK2",
                    "MULTIDAY","DAY2","DAY3","DAY4","DAY5","DAY6","DAY7","DAY8","DAY9","DAY10",
                    "DAY11","DAY12","DAY13","DAY14","DAY15"
                ];
                if (VAR_PERIOD_NAME.indexOf(aryWrods[1])<0)
                {
                    var errorMessage=`${varName}, 跨周期语法错误， 周期只支持'MIN1,MIN5,MIN15,MIN30,MIN60,DAY,WEEK,MONTH,SEASON,YEAR'`;
                    this.ThrowUnexpectedToken(token,errorMessage);
                }

                var item={ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_PERIOD_DATA, VarName:varName, ValueName:aryWrods[0], PeriodName:aryWrods[1] };
                if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
                this.PeriodSymbolData.push(item);
            }

            return;
        }

        if (g_JSComplierResource.IsCustomVariant(varName)) //自定义函数
        {
            var item={ VariantName:varName, ID:JS_EXECUTE_JOB_ID.JOB_CUSTOM_VARIANT_DATA };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }
    }

    this.VerifySymbolLiteral=function(value,token)
    {
        if (IFrameSplitOperator.IsString(value))
        {
            if (value.indexOf('$')>0)
            {
                var aryValue=value.split('$');
                if (aryValue.length!=2) return;

                var item= { Literal:value, ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_OTHER_SYMBOL_DATA };
                if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
    
                this.OtherSymbolData.push(item);
            }
        }
    }

    this.VerifySymbolFunction=function(callee,args, token)
    {
        //自定义函数 可以覆盖系统内置函数
        if (g_JSComplierResource.IsCustomFunction(callee.Name)) 
        {
            var item={FunctionName:callee.Name, ID:JS_EXECUTE_JOB_ID.JOB_CUSTOM_FUNCTION_DATA, Args:args}
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber};
            this.FunctionData.push(item);
            return;
        }

        //自定义数据函数
        if (g_JSComplierResource.IsCustomDataFunction(callee.Name))
        {
            var item={FunctionName:callee.Name, ID:JS_EXECUTE_JOB_ID.JOB_CUSTOM_DATA_FUNCTION, Args:args}
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber};
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=='DYNAINFO') 
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA, Args:args,  FunctionName:callee.Name };
            this.Dynainfo.push(item);
            return;
        }

        //财务函数
        if (callee.Name=='FINANCE')
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINANCE, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=="FINVALUE")
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINVALUE, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=="FINONE")
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINONE, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=='GPJYVALUE')
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GPJYVALUE, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=="SCJYVALUE")
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SCJYVALUE, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name==='MARGIN')
        {
            let jobID=JS_EXECUTE_JOB_ID.GetMarginJobID(args[0].Value);
            if (jobID && !this.IsNeedMarginData.has(jobID))  this.IsNeedMarginData.add(jobID);
            return;
        }

        if (callee.Name==='NEWS')
        {
            let jobID=JS_EXECUTE_JOB_ID.GetNewsAnalysisID(args[0].Value);
            if (jobID && !this.IsNeedNewsAnalysisData.has(jobID))  this.IsNeedNewsAnalysisData.add(jobID);
            return;
        }

        if (callee.Name==='HK2SHSZ')    //北上资金
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_HK_TO_SHSZ, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.NeedHK2SHSZData.push(item);
            return;
        }

        if (callee.Name=='COST' || callee.Name=='WINNER' || callee.Name=='PPART' || callee.Name=='COSTEX' ||
            callee.Name=='LWINNER' || callee.Name=='PWINNER')   //需要流通股
        {
            //下载流通股
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINANCE, Args:[7],  FunctionName:"FINANCE", FunctionName2:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name=="INBLOCK")
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VARIANT, VariantName:"INBLOCK" }; //下载所有板块
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }

        if (callee.Name==='BETA')    //beta需要下载上证指数
        {
            this.IsNeedIndexData=true;
            return;
        }

        if (callee.Name=='UPCOUNT' || callee.Name=='DOWNCOUNT')    //上涨下跌个数
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA, Args:args, FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.NeedBlockIncreaseData.push(item);  
            return;
        }

        if (callee.Name=='STKINDI' || callee.Name=='CALCSTOCKINDEX') //指标调用
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.ExecuteIndex.push(item);
            return;
        }

        //"MA.MA1"(10,5,5)"
        if (callee.Type==Syntax.Literal)
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX, Args:args,  FunctionName:callee.Value, DynamicName:callee.Value };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.ExecuteIndex.push(item);
            return;
        }

        if (callee.Name=='COVER_C' || callee.Name=='COVER_O' || callee.Name=='COVER_H' || callee.Name=='COVER_L' || callee.Name=='COVER_A' || callee.Name=='COVER_V')   //跨周期函数
        {
            var periodName=args[0].Value;
            const VAR_PERIOD_NAME=["MIN1","MIN5","MIN15","MIN30","MIN60","DAY","WEEK","MONTH","SEASON","YEAR"];
            if (VAR_PERIOD_NAME.indexOf(periodName)<0)
            {
                var errorMessage=`${callee.Name}, 跨周期函数错误， 周期只支持'MIN1,MIN5,MIN15,MIN30,MIN60,DAY,WEEK,MONTH,SEASON,YEAR'`;
                this.ThrowUnexpectedToken(token,errorMessage);
            }

            var valueName=JSComplierHelper.GetConvertValueName(callee.Name);
            var item={ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_PERIOD_DATA, FunctionName:callee.Name, ValueName:valueName, PeriodName:periodName };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.PeriodSymbolData.push(item);
            return;
        }

        if (callee.Name=='SF')  //Section finance
        {
            let period=JS_EXECUTE_JOB_ID.GetSectionReportPeriod(args[0].Value,args[1].Value); //报告期
            if (!period) return;
            let jobID=JS_EXECUTE_JOB_ID.GetSectionFinanceID(args[2].Value);
            if (!jobID) return;
            var sfkey=period.Year+ '-' + period.Quarter;

            if (!this.IsNeedSectionFinance.has(sfkey)) 
            {
                var finacne={ Period:period, Fields:new Set([jobID]) };
                this.IsNeedSectionFinance.set(sfkey, finacne);
            }
            else
            {
                var finacne=this.IsNeedSectionFinance.get(sfkey);
                if (!finacne.Fields.has(jobID)) finacne.Fields.add(jobID);
            }
            
            return;
        }

        if (callee.Name=="LOADAPIDATA") //加载API数据
        {
            var item= { Name:callee.Name, ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA,Args:args };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber};

            this.IsAPIData.push(item);
            return;
        }

        let setStockDataName=new Set(['CLOSE',"C",'VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT','AMO','VOLINSTK']);
        if (setStockDataName.has(callee.Name)) 
        {
            var item= { Name:callee.Name, ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_OTHER_SYMBOL_DATA,Args:args };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber};

            this.OtherSymbolData.push(item);
            return;
        }

    }

    this.VerifyMemberVariable=function(object,property,token)
    {
        var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX,  Member:{Object:object, Property:property} };
        if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
        this.ExecuteIndex.push(item);
        return;
    }

    this.ExpressionStatement=function(expression)
    {
        return { Type:Syntax.ExpressionStatement, Expression:expression };
    }

    this.Script=function(body)
    {
        return {Type:Syntax.Program, Body:body, SourceType:'通达信脚本' };
    } 

    this.SequenceExpression=function(expression)
    {
        return {Type:Syntax.SequenceExpression, Expression:expression };
    }

    this.BinaryExpression=function(operator, left, right) 
    {
        let logical = (operator === '||' || operator === '&&' || operator=='AND' || operator=='OR');
        let type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;

        return { Type:type, Operator:operator, Left:left, Right:right };
    }

    this.Literal=function(value,raw,token)
    {
        this.VerifySymbolLiteral(value, token);
        return { Type:Syntax.Literal, Value:value, Raw:raw };
    }

    this.Identifier=function(name, token)
    {
        this.VerifySymbolVariable(name, token);

        return { Type:Syntax.Identifier, Name:name};
    }

    //成员变量, 不需要检测
    this.MemberIdentifier=function(name, token)
    {
        return { Type:Syntax.Identifier, Name:name};
    }

    this.AssignmentExpression=function (operator, left, right) 
    {
        return { Type:Syntax.AssignmentExpression, Operator:operator, Left:left, Right:right };
    }

    this.UnaryExpression=function(operator, argument) 
    {
        return { Type:Syntax.UnaryExpression, Operator:operator, Argument:argument, Prefix:true };
    }

    this.EmptyStatement=function() 
    {
        return { Type:Syntax.EmptyStatement };
    }

    this.CallExpression=function(callee, args, token) 
    {
        this.VerifySymbolFunction(callee, args, token);

        return { Type:Syntax.CallExpression, Callee:callee, Arguments:args };
    }

    this.StaticMemberExpression=function(object, property,token)
    {
        this.VerifyMemberVariable(object,property, token);
        return { Type:Syntax.MemberExpression, Computed:false, Object:object, Property:property };
    }

    this. Directive=function(expression, directive)
    {
        return { Type:Syntax.ExpressionStatement, Expression : expression, Directive: directive };
    }

    ////////////////////////////////////////////////////////////////
    this.ThrowUnexpectedToken=function(token,message)
    {
        throw this.UnexpectedTokenError(token,message);
    }

    this.UnexpectedTokenError=function(token,message)
    {
        let msg=message || Messages.UnexpectedToken;
        let value='ILLEGAL';
        if (token)
        {
            if (!message) { }
            value=token.Value;
        }

        msg=msg.replace("%0",value);
        if (token && typeof(token.LineNumber)=='number')
        {
            let index=token.Start;
            let line=token.LineNumber;
            let column=-1
            return this.ErrorHandler.CreateError(index,line,column,msg);
        }
    }
}



function JSParser(code)
{
    this.ErrorHandler=new ErrorHandler();
    this.Scanner=new Scanner(code, this.ErrorHandler);
    this.Node=new Node(this.ErrorHandler);   //节点创建

    this.LookAhead={Type:2, Value:'', LineNumber:this.Scanner.LineNumber, LineStart:0, Start:0, End:0 };
    this.HasLineTerminator=false;
    this.Context = {
        IsModule: false,
        await: false,
        allowIn: true,
        allowStrictDirective: true,
        allowYield: true,
        FirstCoverInitializedNameError: null,
        IsAssignmentTarget: false,
        IsBindingElement: false,
        InFunctionBody: false,
        inIteration: false,
        inSwitch: false,
        labelSet: {},
        Strict: false
    };

    this.PeratorPrecedence = 
    {
        ')': 0,
        ';': 0,
        ',': 0,
        ']': 0,
        '||': 1,
        'OR':1,
        '&&': 2,
        'AND':2,
        '|': 3,
        '^': 4,
        '&': 5,
        '==': 6,
        '=': 6,
        '!=': 6,
        '<>':6,
        '===': 6,
        '!==': 6,
        '<': 7,
        '>': 7,
        '<=': 7,
        '>=': 7,
        '<<': 8,
        '>>': 8,
        '>>>': 8,
        '+': 9,
        '-': 9,
        '*': 11,
        '/': 11,
        '%': 11
    };

    this.StartMarker={Index:0, Line: this.Scanner.LineNumber, Column:0 };
    this.LastMarker={Index:0, Line: this.Scanner.LineNumber, Column:0 };

    this.Initialize=function()
    {
        this.NextToken();
        this.LastMarker={ Index:this.Scanner.Index, Line:this.Scanner.LineNumber, Column:this.Scanner.Index-this.Scanner.LineStart };
    }
    

    this.CreateNode=function()
    {
        return { Index:this.StartMarker.Index, Line:this.StartMarker.Line, Column:this.StartMarker.Column };
    }

    this.StartNode=function(token, lastLineStart)
    {
        if (lastLineStart==void 0) { lastLineStart=0; }

        let column = token.Start - token.LineStart;
	    let line = token.LineNumber;
        if (column < 0) 
        {
	        column += lastLineStart;
	        line--;
        }
        
	    return { Index: token.Start, Line: line, Column: column };
    }

    this.Match=function(value)
    {
        return this.LookAhead.Type==7 /*Punctuator*/ && this.LookAhead.Value==value;
    }

    this.Expect=function(value, message)
    {
        let token=this.NextToken();
        if (token.Type!=7 /*Punctuator*/ || token.Value!=value)
            this.ThrowUnexpectedToken(token, message);
    }

    //是否是赋值操作符
    this.MatchAssign=function()
    {
        if (this.LookAhead.Type!=7 /*Punctuator*/) return false;
        let op=this.LookAhead.Value;

        return op==':' || op==':=';
    }

    this.GetTokenRaw=function(token)
    {
        return this.Scanner.Source.slice(token.Start, token.End);
    }

    this.NextToken=function()
    {
        let token=this.LookAhead;
        this.LastMarker.Index=this.Scanner.Index;
        this.LastMarker.Line=this.Scanner.LineNumber;
        this.LastMarker.Column=this.Scanner.Index-this.Scanner.LineStart;
        this.CollectComments(); //过滤注释 空格

        if (this.Scanner.Index !== this.StartMarker.Index) 
        {
            this.StartMarker.Index = this.Scanner.Index;
            this.StartMarker.Line = this.Scanner.LineNumber;
            this.StartMarker.Column = this.Scanner.Index - this.Scanner.LineStart;
        }

        let next=this.Scanner.Lex();
        this.HasLineTerminator=(token.LineNumber!=next.LineNumber);
        if (next && this.Context.Strict && next.Type==3/*Identifier */)
        {
            //TODO:
        }

        this.LookAhead=next;

        return token;
    }

    this.CollectComments=function()
    {
        this.Scanner.ScanComments();
    }

    this.ParseScript=function()
    {
        let node=this.CreateNode();
        let body=this.ParseDirectivePrologues();
        
        while(this.LookAhead.Type!=2 /*EOF*/)
        {
            body.push(this.ParseStatementListItem())
        }

        return this.Finalize(node,this.Node.Script(body));
    }

    //https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
    this.ParseDirective=function()
    {
        let token=this.LookAhead;
        let node=this.CreateNode();
        let expr=this.ParseExpression();

        let directive = (expr.Type === Syntax.Literal) ? this.GetTokenRaw(token).slice(1, -1) : null;
        this.ConsumeSemicolon();

        return this.Finalize(node, directive ? this.Node.Directive(expr, directive) : this.Node.ExpressionStatement(expr));
    }

    this.ParseDirectivePrologues=function()
    {
        let firstRestricted=null;
        let body=[];
        while(true)
        {
            let token=this.LookAhead;
            if (token.Type!=8 /*StringLiteral*/) break;

            let statement=this.ParseDirective();
            body.push(statement);
        }

        return body;
    }

    // https://tc39.github.io/ecma262/#sec-block
    this.ParseStatementListItem=function()
    {
        let statement;
        this.Context.IsAssignmentTarget=true;
        this.Context.IsBindingElement=true;
        if (this.LookAhead.Type==4 /*Keyword*/)
        {

        }
        else
        {
            statement=this.ParseStatement();
        }

        return statement;
    }

    // https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
    this.ParseStatement=function()
    {
        let statement;
        switch(this.LookAhead.Type)
        {
            case 1 /* BooleanLiteral */:
            case 5 /* NullLiteral */:
            case 6 /* NumericLiteral */:
            case 8 /* StringLiteral */:
            case 10 /* Template */:
            case 9 /* RegularExpression */:
                statement = this.ParseExpressionStatement();
                break;
            case 7 /* Punctuator */:
                let value = this.LookAhead.Value;
                if (value === '(') statement = this.ParseExpressionStatement();
                else if (value === ';') statement = this.ParseEmptyStatement();
                else statement = this.ParseExpressionStatement();
                break;
            case 3 /* Identifier */:
                statement = this.ParseLabelledStatement();
                break;
            case 4 /* Keyword */:
                break;
            default:
                statement="error";
        }

        return statement;
    }
    
    // https://tc39.github.io/ecma262/#sec-empty-statement
    this.ParseEmptyStatement=function()
    {
        let node=this.CreateNode();
        this.Expect(';');
        return this.Finalize(node, this.Node.EmptyStatement());
    }

    //https://tc39.github.io/ecma262/#sec-labelled-statements
    this.ParseLabelledStatement=function()
    {
        let node=this.CreateNode();
        let expr=this.ParseExpression();
        this.ConsumeSemicolon();
        let statement = new this.Node.ExpressionStatement(expr);

        return this.Finalize(node, statement);
    }

    // https://tc39.github.io/ecma262/#sec-comma-operator
    this.ParseExpression=function()
    {
        let startToken=this.LookAhead;
        let expr=this.IsolateCoverGrammar(this.ParseAssignmentExpression);
        if (this.Match(','))
        {
            let expressions=[];
            expressions.push(expr);
            while(this.LookAhead.Type!=2 /*EOF*/)
            {
                if (!this.Match(',')) break;
                this.NextToken();
                expressions.push(this.IsolateCoverGrammar(this.ParseAssignmentExpression));
            }

            expr=this.Finalize(this.StartNode(startToken),this.Node.SequenceExpression(expressions));
        }

        return expr;
    }

    this.ParseAssignmentExpression=function()
    {
        let expr;

        let startToken=this.LookAhead;
        let token=startToken;
        expr=this.ParseConditionalExpression();

        if (this.MatchAssign())
        {
            if (!this.Context.IsAssignmentTarget) 
            {
                let marker=expr.Marker;
                this.ThrowUnexpectedError(marker.Index,marker.Line,marker.Column,Messages.InvalidLHSInAssignment);
            }

            if (!this.Match('=') && !this.Match(':'))
            {
                this.Context.IsAssignmentTarget=false;
                this.Context.IsBindingElement=false;
            }
            else
            {
                this.ReinterpretExpressionAsPattern(expr);
            }

            token=this.NextToken();
            let operator=token.Value;
            let right=this.IsolateCoverGrammar(this.ParseAssignmentExpression);
            expr=this.Finalize(this.StartNode(startToken), this.Node.AssignmentExpression(operator, expr, right));
            this.Context.FirstCoverInitializedNameError=null;
        }

        return expr;
    }

    this.ParseConditionalExpression=function()
    {
        let startToken=this.LookAhead;
        let expr=this.InheritCoverGrammar(this.ParseBinaryExpression);

        return expr;
    }

    this.ParseBinaryExpression=function()
    {
        let startToken=this.LookAhead;
        let expr=this.InheritCoverGrammar(this.ParseExponentiationExpression);
        let token=this.LookAhead;
        var prec=this.BinaryPrecedence(token);
        if (prec>0)
        {
            this.NextToken();
            this.Context.IsAssignmentTarget=false;
            this.Context.IsBindingElement=false;
            let markers=[startToken,this.LookAhead];
            let left=expr;
            let right=this.IsolateCoverGrammar(this.ParseExponentiationExpression);
            let stack=[left,token.Value,right];
            let precedences = [prec];
            while(true)
            {
                prec=this.BinaryPrecedence(this.LookAhead);
                if (prec<=0) break;

                while(stack.length>2 && prec<=precedences[precedences.length-1])
                {
                    right=stack.pop();
                    let operator=stack.pop();
                    precedences.pop();
                    left=stack.pop();
                    markers.pop();
                    let node=this.StartNode(markers[markers.length - 1]);
                    stack.push(this.Finalize(node, this.Node.BinaryExpression(operator, left, right)));
                }

                //Shift
                stack.push(this.NextToken().Value);
                precedences.push(prec);
                markers.push(this.LookAhead);
                stack.push(this.IsolateCoverGrammar(this.ParseExponentiationExpression));
            }

            let i=stack.length-1;
            expr=stack[i];
            let lastMarker=markers.pop();
            while(i>1)
            {
                let marker=markers.pop();
                let lastLineStart=lastMarker && lastMarker.LineStart;
                let node=this.StartNode(marker, lastLineStart);
                let operator=stack[i-1];
                expr=this.Finalize(node, this.Node.BinaryExpression(operator, stack[i - 2], expr));
                i-=2;
                lastMarker=marker;
            }
        }

        return expr;
    }

    this.ParseExponentiationExpression=function()
    {
        let startToken=this.LookAhead;
        let expr=this.InheritCoverGrammar(this.ParseUnaryExpression);

        return expr;
    }

    this.ParseUnaryExpression=function()
    {
        let expr;
        if (this.Match('+') || this.Match('-'))
        {
            let node=this.StartNode(this.LookAhead);
            let token=this.NextToken();
            expr=this.InheritCoverGrammar(this.ParseUnaryExpression);
            expr=this.Finalize(node, this.Node.UnaryExpression(token.Value, expr));
            this.Context.IsAssignmentTarget=false;
            this.Context.IsBindingElement=false;
        }
        else
        {
            expr=this.ParseUpdateExpression();
        }

        return expr;
    }

    // https://tc39.github.io/ecma262/#sec-update-expressions
    this.ParseUpdateExpression=function()
    {
        let expr;
        let startToken=this.LookAhead;
        expr=this.InheritCoverGrammar(this.ParseLeftHandSideExpressionAllowCall);

        return expr;
    }

    this.ParseLeftHandSideExpressionAllowCall=function()
    {
        let startToken=this.LookAhead;
        let expr;
        expr=this.InheritCoverGrammar(this.ParsePrimaryExpression);

        while(true)
        {
            if (this.Match('.')) 
            {
                this.Context.IsBindingElement = false;
                this.Context.IsAssignmentTarget = true;
                this.Expect('.');
                const property = this.ParseMemberIdentifierName();
                expr = this.Finalize(this.StartNode(startToken), this.Node.StaticMemberExpression(expr, property,startToken));

            }
            else if (this.Match('('))
            {
                this.Context.IsBindingElement=false;
                this.Context.IsAssignmentTarget=false;
                var args=this.ParseArguments(); //解析 调用参数
                expr=this.Finalize(this.StartNode(startToken), this.Node.CallExpression(expr,args,startToken));
            }
            else
            {
                break;
            }
        }

        return expr;
    }

    /*
    BooleanLiteral = 1,
    EOF=2,
    Identifier=3,
    Keyword=4,
    NullLiteral=5,
    NumericLiteral=6,
    Punctuator=7,
    StringLiteral=9,
    RegularExpression=9,
    Template=10
    */
    this.IsIdentifierName=function(token) 
    {
        return token.Type === 3 //Identifier 
            || token.Type === 4 //Keyword 
            || token.Type === 1 //BooleanLiteral 
            || token.Type === 5 ;//NullLiteral;
    }

    this.ParseIdentifierName=function()
    {
        const node = this.CreateNode();
        const token = this.NextToken();
        if (!this.IsIdentifierName(token)) 
        {
            this.ThrowUnexpectedToken(token);
        }

        return this.Finalize(node, this.Node.Identifier(token.Value, token));
    }

    this.ParseMemberIdentifierName=function()
    {
        const node = this.CreateNode();
        const token = this.NextToken();
        if (!this.IsIdentifierName(token)) 
        {
            this.ThrowUnexpectedToken(token);
        }

        return this.Finalize(node, this.Node.MemberIdentifier(token.Value, token));
    }

    // https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
    this.ParseArguments=function()
    {
        this.Expect('(');
        var args=[];
        if (!this.Match(')'))
        {
            while(true)
            {
                let expr=this.IsolateCoverGrammar(this.ParseAssignmentExpression);
                args.push(expr);

                if (this.Match(')')) break;

                this.ExpectCommaSeparator();

                if (this.Match(')')) break;
            }
        }

        this.Expect(')');
        return args;
    }

    // Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
    this.ExpectCommaSeparator=function()
    {
        this.Expect(',',"函数参数格式错误");
    }

    // https://tc39.github.io/ecma262/#sec-primary-expression
    this.ParsePrimaryExpression=function()
    {
        let node=this.CreateNode();
        let expr;
        var token, raw;
        switch(this.LookAhead.Type)
        {
            case 3:/* Identifier */
                token=this.NextToken();
                expr=this.Finalize(node, this.Node.Identifier(token.Value, token));
                break;
            case 6:/* NumericLiteral */
            case 8:/* StringLiteral */
                this.Context.IsAssignmentTarget=false;
                this.Context.IsBindingElement=false;
                token=this.NextToken();
                raw=this.GetTokenRaw(token);
                expr=this.Finalize(node, this.Node.Literal(token.Value,raw,token));
                break;
            case 7:/* Punctuator */
                switch(this.LookAhead.Value)
                {
                    case '(':
                        this.Context.IsBindingElement=false;
                        expr=this.InheritCoverGrammar(this.ParseGroupExpression);
                        break;
                    default:
                        expr=this.ThrowUnexpectedToken(this.NextToken())
                }
                break;
            default:
                expr = this.ThrowUnexpectedToken(this.NextToken());
        }

        return expr;
    }

    this.ParseGroupExpression=function()
    {
        let expr;
        this.Expect('(');
        if (this.Match(')'))
        {
            this.NextToken();
        }
        else
        {
            let startToken=this.LookAhead;
            let params=[];
            let arrow=false;
            this.Context.IsBindingElement=true;
            expr=this.InheritCoverGrammar(this.ParseAssignmentExpression);
            if (this.Match(','))
            {
                let expressions=[];
                this.Context.IsAssignmentTarget=false;
                expressions.push(expr);
                while(this.LookAhead.Type!=2 /* EOF */)
                {
                    if (!this.Match(',')) break;

                    this.NextToken();
                    if (this.Match(')'))
                    {

                    }
                }
            }

            if (!arrow)
            {
                this.Expect(')');
                this.Context.IsBindingElement=false;
            }
        }

        return expr;
    }

    // https://tc39.github.io/ecma262/#sec-expression-statement
    this.ParseExpressionStatement=function()
    {
        let node=this.CreateNode();
        let expr=this.ParseExpression();
        this.ConsumeSemicolon();

        return this.Finalize(node,this.Node.ExpressionStatement(expr));
    }

    this.ConsumeSemicolon=function()
    {
        if (this.Match(';')) 
        {
            this.NextToken();
        }
        else if (!this.HasLineTerminator)
        {
            //if (this.LookAhead.Type!=2/*EOF*/ && !this.Match('}'))

            this.LastMarker.Index=this.StartMarker.Index;
            this.LastMarker.Line=this.StartMarker.Line;
            this.LastMarker.Column=this.StartMarker.Column;
        }
    }

    this.ReinterpretExpressionAsPattern=function(expr)
    {
        switch(expr.Type)
        {
            case Syntax.Identifier:
            case Syntax.MemberExpression:
            case Syntax.AssignmentExpression:
                break;
            default:
                break;
        }
    }

    this.Finalize=function(marker,node)
    {
        node.Marker={ Line:marker.Line, Column:marker.Column, Index:marker.Index };
        return node;
    }

    this.BinaryPrecedence = function (token) 
    {
        let op = token.Value;
        let precedence;

        if (token.Type === 7 /* Punctuator */) precedence = this.PeratorPrecedence[op] || 0;
        else precedence = 0;
        
        return precedence;
    };

    this.IsolateCoverGrammar=function(parseFunction)
    {
        let previousIsBindingElement=this.Context.IsBindingElement;
        let previousIsAssignmentTarget=this.Context.IsAssignmentTarget;
        let previousFirstCoverInitializedNameError=this.Context.FirstCoverInitializedNameError;

        this.Context.IsBindingElement=true;
        this.Context.IsAssignmentTarget=true;
        this.Context.FirstCoverInitializedNameError=null;
        let result=parseFunction.call(this);

        if (this.Context.FirstCoverInitializedNameError!=null)
        {
            //错误 this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
        }

        this.Context.IsBindingElement=previousIsBindingElement;
        this.Context.IsAssignmentTarget=previousIsAssignmentTarget;
        this.Context.FirstCoverInitializedNameError=previousFirstCoverInitializedNameError;

        return result;
    }

    this.InheritCoverGrammar = function (parseFunction) 
    {
        let previousIsBindingElement = this.Context.IsBindingElement;
        let previousIsAssignmentTarget = this.Context.IsAssignmentTarget;
        let previousFirstCoverInitializedNameError = this.Context.FirstCoverInitializedNameError;
        this.Context.IsBindingElement = true;
        this.Context.IsAssignmentTarget = true;
        this.Context.FirstCoverInitializedNameError = null;

        let result = parseFunction.call(this);

        this.Context.IsBindingElement = this.Context.IsBindingElement && previousIsBindingElement;
        this.Context.IsAssignmentTarget = this.Context.IsAssignmentTarget && previousIsAssignmentTarget;
        this.Context.FirstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.Context.FirstCoverInitializedNameError;

        return result;
    };

    this.ThrowUnexpectedToken=function(token,message)
    {
        throw this.UnexpectedTokenError(token,message);
    }

    this.ThrowUnexpectedError=function(index,line,column,message)
    {
        let msg=message || "执行异常";
       
        return this.ErrorHandler.ThrowError(index,line,column,msg);
    }

    this.UnexpectedTokenError=function(token,message)
    {
        let msg=message || Messages.UnexpectedToken;
        let value='ILLEGAL';
        if (token)
        {
            if (!message)
            {

            }
            value=token.Value;
        }

        msg=msg.replace("%0",value);
        if (token && typeof(token.LineNumber)=='number')
        {
            let index=token.Start;
            let line=token.LineNumber;
            let lastMarkerLineStart=this.LastMarker.Index-this.LastMarker.Column;
            let column=token.Start-lastMarkerLineStart+1;
            return this.ErrorHandler.CreateError(index,line,column,msg);
        }
        else
        {
            let index=this.LastMarker.Index;
            let line=this.LastMarker.Line;
            let column=this.LastMarker.Column+1;
            return this.ErrorHandler.CreateError(index,line,column,msg);
        }
    }
}


/*
    算法类
*/
function JSAlgorithm(errorHandler,symbolData)
{
    this.ErrorHandler=errorHandler;
    this.SymbolData=symbolData; //股票数据

    //相加
    this.Add=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值相加
        if (isNumber && isNumber2) return data+data2;

        //都是数组相加
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( this.IsNumber(data[i]) && this.IsNumber(data2[i]) ) result[i]=data[i]+data2[i];
                }
            }

            return result;
        }

        //单数据和数组相加
        let value;
        let aryData;
        if (isNumber) 
        {
            value=data;
            aryData=data2;
        }
        else
        {
            value=data2;
            aryData=data;
        }

        for(let i in aryData)
        {
            result[i]=null;
            if (this.IsNumber(aryData[i]) && this.IsNumber(value)) result[i]=value+aryData[i];
        }

        return result;
    }

    //相减
    this.Subtract=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

         //单数值相减
         if (isNumber && isNumber2) return data-data2;

         //都是数组相减
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( this.IsNumber(data[i]) &&  this.IsNumber(data2[i]) ) result[i]=data[i]-data2[i];
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (this.IsNumber(data) && this.IsNumber(data2[i])) result[i]=data-data2[i];
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (this.IsNumber(data[i]) && this.IsNumber(data2)) result[i]=data[i]-data2;
            }
        }

        return result;
    }

    //相乘
    this.Multiply=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值相乘
        if (isNumber && isNumber2) return data*data2;

        //都是数组相乘
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( this.IsNumber(data[i]) && this.IsNumber(data2[i]) ) result[i]=data[i]*data2[i];
                }
            }

            return result;
        }

        //单数据和数组相乘
        let value;
        let aryData;
        if (isNumber) 
        {
            value=data;
            aryData=data2;
        }
        else
        {
            value=data2;
            aryData=data;
        }

        for(let i in aryData)
        {
            result[i]=null;
            if (this.IsNumber(aryData[i]) && this.IsNumber(value)) result[i]=value*aryData[i];
        }

        return result;
    }

    //相除
    this.Divide=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值相除
        if (isNumber && isNumber2) 
        {
            if (data2==0) return null;  //除0判断
            return data/data2;
        }

        //都是数组相除
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( this.IsNumber(data[i]) && this.IsDivideNumber(data2[i]) ) result[i]=data[i]/data2[i];
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( this.IsNumber(data) && this.IsDivideNumber(data2[i]) ) result[i]=data/data2[i];
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( this.IsNumber(data[i]) && this.IsDivideNumber(data2) ) result[i]=data[i]/data2;
            }
        }

        return result;

    }

    //大于
    this.GT=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data>data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                    if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]>data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data>data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                if (!IFrameSplitOperator.IsVaild(data2)) continue;

                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]>data2 ? 1 : 0);
            }
        }

        return result;
    }

    //大于等于
    this.GTE=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data>=data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                    if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                    result[i]=(data[i]>=data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                result[i]=(data>=data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                if (!IFrameSplitOperator.IsVaild(data2)) continue;

                result[i]=(data[i]>=data2 ? 1 : 0);
            }
        }

        return result;
    }

    //小于
    this.LT=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data<data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                    if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                    result[i]=(data[i]<data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                result[i]=(data<data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                if (!IFrameSplitOperator.IsVaild(data2)) continue;

                result[i]=(data[i]<data2 ? 1 : 0);
            }
        }

        return result;
    }

    //小于等于
    this.LTE=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data>=data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                    if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                    result[i]=(data[i]<=data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;

                result[i]=(data<=data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                if (!IFrameSplitOperator.IsVaild(data2)) continue;

                result[i]=(data[i]<=data2 ? 1 : 0);
            }
        }

        return result;
    }

    //等于
    this.EQ=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data==data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]==data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data==data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]==data2 ? 1 : 0);
            }
        }

        return result;
    }

    //不等于
    this.NEQ=function(data,data2)
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data!=data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]!=data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber && Array.isArray(data2))   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data!=data2[i] ? 1 : 0);
            }
        }
        else if (isNumber2 && Array.isArray(data))          //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]!=data2 ? 1 : 0);
            }
        }

        return result;
    }

    //AND  &&
    this.And=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值 &&
        if (isNumber && isNumber2) return (data && data2 ? 1 : 0);

        //都是数组 &&
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i] && data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data && data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i] && data2 ? 1 : 0);
            }
        }

        return result;
    }

    //OR  ||
    this.Or=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值 &&
        if (isNumber && isNumber2) return (data || data2 ? 1 : 0);

        //都是数组 &&
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i] || data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data || data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i] || data2 ? 1 : 0);
            }
        }

        return result;
    }

    this.IF=function(data,trueData,falseData)
    {
        let isNumber=this.IsNumber(data);
        let isNumber2=this.IsNumber(trueData);
        let isNumber3=this.IsNumber(falseData);

        var isArray2=Array.isArray(trueData);
        var isArray3=Array.isArray(falseData);
        
        //单数值
        if (isNumber) 
        {
            if (isNumber2 && isNumber3) return data?trueData:falseData;

            return data? trueData:falseData;
        }
        
        //都是数组
        let result=[];
        for(let i in data)
        {
            if (data[i])
            {
                if (isNumber2) result[i]=trueData;
                else if (isArray2) result[i]=trueData[i];
                else result[i]=null;
            }
            else
            {
                if (isNumber3) result[i]=falseData;
                else if (isArray3) result[i]=falseData[i];
                else result[i]=null;
            }
        }

        return result;
    }

    /*
    根据条件求不同的值,同IF判断相反.
    用法: IFN(X,A,B)若X不为0则返回B,否则返回A
    例如: IFN(CLOSE>OPEN,HIGH,LOW)表示该周期收阴则返回最高值,否则返回最低值
    */

    this.IFN=function(data,trueData,falseData)
    {
        return this.IF(data,falseData,trueData);
    }

    //指标函数 函数名全部大写

    //引用若干周期前的数据(平滑处理).
    //用法: REF(X,A),引用A周期前的X值.A可以是变量.
    //平滑处理:当引用不到数据时进行的操作.此函数中,平滑时使用上一个周期的引用值.
    //例如: REF(CLOSE,BARSCOUNT(C)-1)表示第二根K线的收盘价.
    this.REF=function(data,n)
    {
        let result=[];
        if (typeof(n)=='number')
        {
            if (IFrameSplitOperator.IsNumber(data)) //单数值
            {
                if (n<0) return result;
                var kData=this.SymbolData.Data.Data;
                if (!kData || kData.length<=0) return result;
                var count=kData.length;
                for(var i=n;i<count;++i)
                {
                    result[i]=data;
                }
            }
            else
            {
                if (data.length<=0) return result;
                if (n>=data.length) return result;
    
                result=data.slice(0,data.length-n);
    
                //平滑处理
                var firstData=data[0];
                for(let i=0;i<n;++i)
                    result.unshift(firstData);
            }
        }
        else    //n 为数组的情况
        {
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;
                var value=n[i];
                if (value>=0 && value<=i) result[i]=data[i-value];
                else if (i) result[i]=result[i-1];
                else result[i]=data[i];
            }
        }

        return result; 
    }

    //引用若干周期前的数据(未作平滑处理).
    //用法: REFV(X,A),引用A周期前的X值.A可以是变量.
    //平滑处理:当引用不到数据时进行的操作.
    //例如: REFV(CLOSE,BARSCOUNT(C)-1)表示第二根K线的收盘价.
    this.REFV=function(data,n)
    {
        let result=[];
        if (typeof(n)=='number')
        {
            if (data.length<=0) return result;
            if (n>=data.length) return result;

            result=data.slice(0,data.length-n);

            for(let i=0;i<n;++i)    //不作平滑处理
                result.unshift(null);
        }
        else    //n 为数组的情况
        {
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;
                var value=n[i];
                if (value>=0 && value<=i) result[i]=data[i-value];
            }
        }

        return result; 
    }

    //属于未来函数,引用若干周期后的数据(平滑处理).
    //用法: REFX(X,A),引用A周期后的X值.A可以是变量.
    //平滑处理:当引用不到数据时进行的操作.此函数中,平滑时使用上一个周期的引用值.
    //例如: TT:=IF(C>O,1,2);
    //      REFX(CLOSE,TT);表示阳线引用下一周期的收盘价,阴线引用日后第二周期的收盘价.
    this.REFX=function(data,n)
    {
        let result=[];
        if (typeof(n)=='number')
        {
            if (data.length<=0) return result;
            if (n>=data.length) 
            {
                if (data.length>0) return data[data.length-1];  //取最后一个数据

                return result;
            }

            result=data.slice(n,data.length);

            //平滑处理
            var lastData=data[data.length-1];
            for(let i=0;i<n;++i)
                result.push(lastData);
        }
        else    //n 为数组的情况
        {
            var dataCount=data.length;
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;
                var value=n[i];
                if (value>=0 && value+i<dataCount) result[i]=data[i+value];
                else if (i) result[i]=result[i-1];
                else result[i]=data[i];
            }
        }

        return result; 
    }

    //属于未来函数,引用若干周期后的数据(未作平滑处理).
    //用法:REFXV(X,A),引用A周期后的X值.A可以是变量.
    //平滑处理:当引用不到数据时进行的操作.
    //例如: REFXV(CLOSE,1)表示下一周期的收盘价,在日线上就是明天收盘价
    this.REFXV=function(data,n)
    {
        let result=[];
        if (typeof(n)=='number')
        {
            if (data.length<=0) return result;
            if (n>=data.length) return result;

            result=data.slice(n,data.length);

            //平滑处理
            for(let i=0;i<n;++i)
                result.push(null);
        }
        else    //n 为数组的情况
        {
            var dataCount=data.length;
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;
                var value=n[i];
                if (value>=0 && value+i<dataCount) result[i]=data[i+value];
            }
        }

        return result; 
    }

    //求最大值.
    //用法:MAX(A,B,C,D ..... ) 返回A,B,C,D ..... 中的较大值 
    //例如: MAX(CLOSE-OPEN,0)表示若收盘价大于开盘价返回它们的差值,否则返回0
    this.MAX=function(args, node)
    {
        if (args.length==0) this.ThrowUnexpectedNode(node,'MAX() Error: 参数个数不能为0');
        if (args.length==1) return args[0];

        var aryData=[], aryNumber=[];
        for(var i in args)
        {
            var item=args[i];
            if (IFrameSplitOperator.IsNumber(item)) aryNumber.push(item);
            else if (Array.isArray(item)) aryData.push(item);
        }

        var maxNumber=null;
        if (aryNumber.length>0)
        {
            maxNumber=aryNumber[0];
            for(var i=1; i<aryNumber.length; ++i)
            {
                maxNumber=Math.max(maxNumber,aryNumber[i]);
            }
        }

        var maxAryData=null;
        if (aryData.length>0)
        {
            maxAryData=aryData[0].slice(0);
            for(var i=1;i<aryData.length;++i)
            {
                var dataItem=aryData[i];
                for(var j in dataItem)
                {
                    var maxItem=maxAryData[j];
                    var item=dataItem[j];
                    if (!IFrameSplitOperator.IsNumber(maxItem)) continue;
                    if (!IFrameSplitOperator.IsNumber(item))
                    {
                        maxAryData[j]=null;
                        continue;
                    }
                        
                    maxAryData[j]=Math.max(maxItem,item);
                }
            }
        }

        if (maxAryData==null && maxNumber!=null) return maxNumber;
        if (maxAryData && maxNumber==null) return maxAryData;

        for(var i in maxAryData)
        {
            if (!IFrameSplitOperator.IsNumber(maxAryData[i])) continue;
            maxAryData[i]=Math.max(maxAryData[i],maxNumber);
        }
        
        return maxAryData;
    }

    //求最小值.
    //用法:MIN(A,B, C, D .....)返回A,B, C ,D ......中的较小值
    //例如:MIN(CLOSE,OPEN)返回开盘价和收盘价中的较小值
    this.MIN=function(args, node)
    {
        if (args.length==0) this.ThrowUnexpectedNode(node,'MIN() Error: 参数个数不能为0');
        if (args.length==1) return args[0];

        var aryData=[], aryNumber=[];
        for(var i in args)
        {
            var item=args[i];
            if (IFrameSplitOperator.IsNumber(item)) aryNumber.push(item);
            else if (Array.isArray(item)) aryData.push(item);
        }

        var minNumber=null;
        if (aryNumber.length>0)
        {
            minNumber=aryNumber[0];
            for(var i=1; i<aryNumber.length; ++i)
            {
                minNumber=Math.min(minNumber,aryNumber[i]);
            }
        }

        var minAryData=null;
        if (aryData.length>0)
        {
            minAryData=aryData[0].slice(0);
            for(var i=1;i<aryData.length;++i)
            {
                var dataItem=aryData[i];
                for(var j in dataItem)
                {
                    var minItem=minAryData[j];
                    var item=dataItem[j];
                    if (!IFrameSplitOperator.IsNumber(minItem)) continue;
                    if (!IFrameSplitOperator.IsNumber(item))
                    {
                        minAryData[j]=null;
                        continue;
                    }
                        
                    minAryData[j]=Math.min(minItem,item);
                }
            }
        }

        if (minAryData==null && minNumber!=null) return minNumber;
        if (minAryData && minNumber==null) return minAryData;

        for(var i in minAryData)
        {
            if (!IFrameSplitOperator.IsNumber(minAryData[i])) continue;
            minAryData[i]=Math.min(minAryData[i],minNumber);
        }
        
        return minAryData;
    }

    //取正数
    this.ABS=function(data)
    {
        let result=[];

        for(let i in data)
        {
            result[i]=null;
            if (!isNaN(data[i])) result[i]=Math.abs(data[i]);
        }

        return result;
    }

    this.MA=function(data,dayCount)
    {
        let result=[];
        if (dayCount<=0) return result;
        
        if (!Array.isArray(dayCount))
        {
            dayCount=parseInt(dayCount);    //转整形
            if (dayCount<=0) dayCount=1;
            if (!data || !data.length) return result;
            
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                if (this.IsNumber(data[i])) break;
            }

            var data=data.slice(0); //复制一份数据出来
            for(var days=0;i<data.length;++i,++days)
            {
                if (days<dayCount-1)
                {
                    result[i]=null;
                    continue;
                }

                let preValue=data[i-(dayCount-1)];
                let sum=0;
                for(let j=dayCount-1;j>=0;--j)
                {
                    var value=data[i-j];
                    if (!this.IsNumber(value)) 
                    {
                        value=preValue;  //空数据就取上一个数据
                        data[i-j]=value; 
                    }
                    else 
                    {
                        preValue=value;
                    }
                    sum+=value;
                }

                result[i]=sum/dayCount;
            }
        }
        else
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=dayCount.length) continue;
                var sumCount=dayCount[i];
                if (!this.IsNumber(sumCount)) continue;
                if (sumCount<=0) continue;
                
                var sum=0;
                var count=0;
                for(var j=i, k=0;j>=0 && k<sumCount;--j,++k)
                {
                    sum+=data[j];
                    ++count;
                }
                if (count>0) result[i]=sum/count;
            }
        }

        return result;
    }

    //指数平均数指标 EMA(close,10)
    //N  支持周期数组
    this.EMA=function(data,dayCount)
    {
        var result = [];
        if (data.length<=0) return result;

        if (Array.isArray(dayCount))
        {
            for(var i=0;i<dayCount.length;++i)
            {
                var period=dayCount[i];
                if (!this.IsNumber(period)) continue;
                period=parseInt(period);    //周期用整数
                if (period<=0) continue;

                if (period>i+1) period=i+1;
                //EMA(N) = 2/(N+1)*C + (N-1)/(N+1)*EMA', EMA'为前一天的ema
                var EMAFactor=[ 2/ (period + 1), (period - 1) / (period + 1)];

                var ema=null;
                var lastEMA=null;
                for(var j=0;j<period;++j)
                {
                    var index=i-(period-j-1);
                    var value=data[index];
                    if (!this.IsNumber(value)) coninue;
                    if (lastEMA==null)
                    {
                        ema=value;  //第一个EMA为第一个数据的价格
                        lastEMA=ema;  
                    }
                    else
                    {
                        ema = EMAFactor[0] * value + EMAFactor[1] * lastEMA;
                        lastEMA=ema;
                    } 
                }

                result[i]=ema;
            }

        }
        else
        {
            dayCount=parseInt(dayCount);    //转整形
            if (dayCount<=0) return result;
            
            var offset=0;
            //取首个有效数据
            for(;offset<data.length;++offset)
            {
                if (data[offset]!=null && !isNaN(data[offset]))
                    break;
            }
    
            var p1Index=offset;
            var p2Index=offset+1;
    
            result[p1Index]=data[p1Index];
            for(var i=offset+1;i<data.length;++i,++p1Index,++p2Index)
            {
                result[p2Index]=((2*data[p2Index]+(dayCount-1)*result[p1Index]))/(dayCount+1);
            }
        }

        return result;
    }

    this.XMA=function(data,n)
    {
        var result=[];
        var offset=0;
        for(;offset<data.length;++offset)
        {
            if (this.IsNumber(data[offset])) break;
        }

        var p = parseInt((n - 2) / 2);
	    var sum = 0;
        var count = 0, start=0, end = 0;
    
        for(var i=offset, j=0; i<data.length; ++i)
        {
            start = i - p - 1;
            end = i + (n - p) - 1;
            for (j = start; j < end; ++j)
            {
                if (j >= 0 && j<data.length) 
                {
                    if (this.IsNumber(data[j]))
                    {
                        sum += data[j];
                        ++count;
                    }
                }
            }
    
            if (count!=0) result[i]=(sum / count);
            else result[i]=null;

            sum = 0;
            count = 0;
        }

        return result;
    }

    /* 
        SMA 移动平均
        返回移动平均。
        用法：　SMA(X，N，M)　X的N日移动平均，M为权重，如Y=(X*M+Y'*(N-M))/N 
    */
    this.SMA=function(data,n,m)
    {
        var result = [];

        if (Array.isArray(n))
        {
            for( var i=0;i<n.length;++i)
            {
                var period=n[i];
                if (!this.IsNumber(period)) continue;
                period=parseInt(period);
                if (period<=0) continue;
                if (period>i+1) period=i+1;
                
                var lastSMA=null;
                var sma=null;
                for(var j=0;j<period;++j)
                {
                    var index=i-(period-j-1);
                    var item=data[index];
                    if (!this.IsNumber(item)) continue;
                    if (lastSMA==null) 
                    {
                        lastSMA=item;
                        sma=item;
                    }
                    else
                    {
                        sma=(m*item+(period-m)*lastSMA)/period;
                        lastSMA=sma;
                    }
                }

                result[i]=sma;
            }
        }
        else
        {
            var i=n;
            var lastData=null;
            for(;i<data.length; ++i)
            {
                if (data[i]==null || isNaN(data[i])) continue;
                lastData=data[i];
                result[i]=lastData; //第一天的数据
                break;
            }
    
            for(++i;i<data.length;++i)
            {
                result[i]=(m*data[i]+(n-m)*lastData)/n;
                lastData=result[i];
            }
        }

        return result;
    }

    /*
    求动态移动平均.
    用法: DMA(X,A),求X的动态移动平均.
    算法: 若Y=DMA(X,A)则 Y=A*X+(1-A)*Y',其中Y'表示上一周期Y值,A必须小于1.
    例如:DMA(CLOSE,VOL/CAPITAL)表示求以换手率作平滑因子的平均价
    */
    this.DMA=function(data,data2)
    {
        var result = [];
        if (data.length<0 || data.length!=data2.length) return result;

        var index=0;
        for(;index<data.length;++index)
        {
            if (data[index]!=null && !isNaN(data[index]) && data2[index]!=null && !isNaN(data2[index]))
            {
                result[index]=data[index];
                break;
            }
        }

        for(index=index+1;index<data.length;++index)
        {
            if (data[index]==null || data2[index]==null)
                result[index]=null;
            else
            {
                if (data2[index]<1)
                    result[index]=(data2[index]*data[index])+(1-data2[index])*result[index-1];
                else
                    result[index]= data[index];
            }
        }

        return result;
    }
    /*
    返回加权移动平均
    用法:WMA(X,N):X的N日加权移动平均.
    算法:Yn=(1*X1+2*X2+...+n*Xn)/(1+2+...+n)
     */
    this.WMA=function(data, dayCount)
    {
        let result=[];
        if (!data || !data.length) return result;

        if (Array.isArray(dayCount))
        {
            for(i=0;i<dayCount.length && i<data.length;++i)
            {
                result[i]=null;
                var period=dayCount[i];
                if (period<=0) continue;
                var start=0,value=0, index=0, preValue=0;
                for(var j=0;j<period;++j)
                {
                    index=i-(period-j-1);
                    value=data[index];
                    start=j;
                    if (this.IsNumber(value))
                    {
                        preValue=value;
                        break;
                    }
                }

                if (start>=period) continue;
                var sum=0, count=0;
                for(var j=start, k=1;j<period; ++j, ++k)
                {
                    index=i-(period-j-1);
                    value=data[index];
                    if (this.IsNumber(value))
                        preValue=value;
                    else
                        value=preValue;

                    count += k;
                    sum += value * k;
                }

                result[i] = sum / count;
            }

            return result;
        }
        else
        {
            if (dayCount<=0) return [];
            var i = 0;
            for(i = 0; i < data.length && !this.IsNumber(data[i]); ++i)
            {
                result[i] = null;
            }
            var data = data.slice(0);
            for(var days=0; i < data.length; ++i,++days)
            {
                if (days < dayCount-1)
                {
                    result[i] = null;
                    continue;
                }
                var preValue = data[i - (dayCount-1)];
                var sum = 0;
                var count = 0;
                for (var j = dayCount-1; j >= 0; --j)
                {
                var value = data[i-j];
                if (!this.IsNumber(value))
                {
                    value = preValue;
                    data[i-j] = value;
                }
                else
                        preValue = value;

                    count += dayCount - j;
                    sum += value * (dayCount - j);
                }
                result[i] = sum / count;
            }
            return result;
        }
    }
    /*
    返回平滑移动平均
    用法:MEMA(X,N):X的N日平滑移动平均,如Y=(X+Y'*(N-1))/N
    MEMA(X,N)相当于SMA(X,N,1)
    */
    this.MEMA=function(data, dayCount)
    {
        let result=[];
        if (!data || !data.length) return result;
        var i = 0, j = 0;
        for (j = 0; j < data.length && !this.IsNumber(data[j]); ++j)
        {
            result[j] = null;
        }
        i = j;
        if (dayCount < 1 || i+dayCount >= data.length) return result;
        var sum = 0;
        var data = data.slice(0);
        for (; i < j+dayCount; ++i)
        {
            result[i] = null;
            if (!this.IsNumber(data[i]) && i-1 >= 0)
                data[i] = data[i-1];
            sum += data[i];
        }
        result[i-1] = sum / dayCount;
        for (; i < data.length; ++i)
        {
            if (this.IsNumber(result[i-1]) && this.IsNumber(data[i]))
                result[i] = (data[i]+result[i-1]*(dayCount-1)) / dayCount;
            else if (i-1 > -1 && this.IsNumber(result[i-1]))
                result[i] = result[i-1];
            else
                result[i] = null;    
        }
        return result;
    }
    /*
    加权移动平均
    返回加权移动平均
    用法:EXPMA(X,M):X的M日加权移动平均
    EXPMA[i]=buffer[i]*para+(1-para)*EXPMA[i-1] para=2/(1+__para)
    */
    this.EXPMA=function(data,dayCount)
    {
        let result=[];
        if (dayCount>=data.length) return result;
    
        let i=dayCount;
        for(;i<data.length;++i) //获取第1个有效数据
        {
            if (data[i]!=null)
            {
                result[i]=data[i];
                break;
            }
        }
    
        for (i=i+1; i < data.length; ++i)
        {
            if (result[i-1]!=null && data[i]!=null)
                result[i]=(2*data[i]+(dayCount-1)*result[i-1])/(dayCount+1);
            else if (result[i-1]!=null)
                result[i]=result[i-1];
        }
    
        return result;
    }

    //加权平滑平均,MEMA[i]=SMA[i]*para+(1-para)*SMA[i-1] para=2/(1+__para)
    this.EXPMEMA=function(data,dayCount)
    {
        var result=[];
        if (dayCount>=data.length) return result;

        var index=0;
        for(;index<data.length;++index)
        {
            if (data[index] && !isNaN(data[index])) break;
        }

        var sum=0;
        for(var i=0; index<data.length && i<dayCount;++i, ++index)
        {
            if (data[index] && !isNaN(data[index]))
                sum+=data[index];
            else
                sum+=data[index-1];
        }

        result[index-1]=sum/dayCount;
        for(;index<data.length;++index)
        {
            if(result[index-1]!=null && data[index]!=null)
                result[index]=(2*data[index]+(dayCount-1)*result[index-1])/(dayCount+1);
            else if(result[index-1]!=null)
                result[index] = result[index-1];
        }

        return result;
    }
    /*
    向前累加到指定值到现在的周期数.
    用法:SUMBARS(X,A):将X向前累加直到大于等于A,返回这个区间的周期数
    例如:SUMBARS(VOL,CAPITAL)求完全换手到现在的周期数
     */
    this.SUMBARS=function(data, data2)
    {
        var result = [];
        if (!data || !data.length || !data2 || !data2.length) return result;
        var start = 0, i = 0, j = 0;
        for(; start < data.length && !this.IsNumber(data[start]); ++start)
        {
            result[start] = null;
        }
        
        for (i = data.length-1; i >= start; --i)
        {
            var total = 0;
            for (j = i, total = 0; j >= start && total < data2[i]; --j)
                total += data[j];
            if (j < start) result[i] = null;
            else result[i] = i - j;
        }
        for(i = start+1; i < data.length; ++i)
        {
            if (result[i]==null)
                result[i] = result[i-1];
        }
        return result;
    }
    /*
    求相反数.
    用法:REVERSE(X)返回-X.
    例如:REVERSE(CLOSE)返回-CLOSE
     */
    this.REVERSE=function(data)
    {
        if (this.IsNumber(data))
        {
            return 0-data;
        }

        var result = [];
        var i = 0;
        for (; i<data.length && !this.IsNumber(data[i]); ++i)
        {
            result[i] = null;
        }

        for (; i < data.length; ++i)
        {
            if (!this.IsNumber(data[i]))
                result[i] = null;
            else
                result[i] = 0-data[i];
        }
        return result;
    }

    /*
    统计满足条件的周期数.
	用法:COUNT(X, N), 统计N周期中满足X条件的周期数, 若N<0则从第一个有效值开始.
    例如 :COUNT(CLOSE>OPEN, 20)表示统计20周期内收阳的周期数
    N 支持数组
    */
    this.COUNT=function(data,n)
    {
        if (Array.isArray(n))
        {
            var start=null;
            var dataCount=data.length;
            for(var i=0;i<dataCount;++i) 
            {
                if (this.IsNumber(data[i])) 
                {
                    start=i;
                    break;
                }
            }
            if (start==null) return [];

            var result=[];
            var count=0;
            for(var i=0;i<n.length;++i)
            {
                var period=n[i];

                if (period==0)
                {
                    result[i]=0;
                    continue;
                }

                if (!IFrameSplitOperator.IsNumber(period) ) period=i+1;   //无效周期 第一个有效值开始.
                else if (period<0) period=i+1;

                count=0;
                for(var j=i, k=0 ;j>=0 && k<period ;--j,++k)    //当前往前period天 统计
                {
                    if (data[j]) ++count;
                }

                result[i]=count;
            }

            return result;
        }
        else
        {
            var period=n;
            var dataCount=data.length;
            var period=period<1?dataCount:period;
    
            var i=0,j=0;
            for(;i<dataCount;++i)   // 取第1个有效数据
            {
                if (this.IsNumber(data[i])) break;
            }
    
            var result=[];
            var days=0;
            for(;i<dataCount && j<period; ++i,++j)
            {
                days=data[i]?days+1:days;
                result[i]=days;
            }
            
            for(;i<dataCount;++i)
            {
                if (data[i-period] && days) days--;
    
                days=data[i] ? days+1 : days;
                result[i]=days;
            }
    
            return result;
        }
    }

    /*
    HHV 最高值
    求最高值。
    用法：　HHV(X，N)　求N周期内X最高值，N=0则从第一个有效值开始。
    例如：　HHV(HIGH,30)　表示求30日最高价。
    */
    this.HHV=function(data,n)
    {
        let result = [];
        if (Array.isArray(n))
        {
            var max=null;
            for(var i=0,j=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;

                max=null;
                var count=n[i];
                if (count>0 && count<=i)
                {
                    for(j=i-count;j<=i;++j)
                    {
                        if (max==null || max<data[j]) max=data[j];
                    }
                }
                else
                {
                    count=i;
                    for(j=0;j<=i;++j)
                    {
                        if (max==null || max<data[j]) max=data[j];
                    }
                }

                result[i]=max;
            }
        }
        else
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(data)) return result;
            n=parseInt(n);
            if (n<=0) n=data.length;
            else if (n>data.length) n=data.length;

            var nStart=this.GetFirstVaildIndex(data);
            if (nStart>=data.length) return result;

            var nMax=nStart;
            if (nMax<data.length) result[nMax]=data[nMax];
            for(var i=nMax+1,j=2;i<data.length && j<n;++i,++j)
            {
                if (data[i]>=data[nMax]) nMax=i;
                result[i]=data[nMax];
            }

            for(;i<data.length;++i)
            {
                if (i-nMax<n) 
                {
                    nMax=data[i]<data[nMax]?nMax:i;
                }
                else
                {
                    for(j=nMax=(i-n+1);j<=i;++j)
                    {
                        nMax=data[j]<data[nMax]?nMax:j;
                    }
                }

                result[i]=data[nMax];
            }
        }

        return result;
    }

    /*
    HV(X,N)：求X在N个周期内（不包含当前k线）的最高值。

    注：
    1、若N为0则从第一个有效值开始算起(不包含当前K线)；
    2、当N为有效值，但当前的k线数不足N根，按照实际的根数计算，第一根k线返回空值；
    3、N为空值时，返回空值。
    4、N可以是变量。

    例1：
    HH:HV(H,10);//求前10根k线的最高点。
    例2：
    N:=BARSLAST(DATE<>REF(DATE,1))+1;
    ZH:VALUEWHEN(DATE<>REF(DATE,1),HV(H,N));//在分钟周期上，求昨天最高价。
    例3：
    HV(H,5) 和 REF(HHV(H,5),1) 的结果是一样的，用HV编写更加方便。
    */
    this.HV=function(data,n)
    {
        var result=this.HHV(data,n);
        return this.REF(result,1);
    }

    /*
    LLV 最低值
    求最低值。
    用法：　LLV(X，N)　求N周期内X最低值，N=0则从第一个有效值开始。
    例如：　LLV(LOW，0)　表示求历史最低价。
    */
    this.LLV=function(data,n)
    {
        var result = [];
        if (Array.isArray(n))
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;

                var min=null;
                var count=n[i];
                if (count>0 && count<=i)
                {
                    for(var j=i-count;j<=i;++j)
                    {
                        if (min==null || min>data[j]) min=data[j];
                    }
                }
                else
                {
                    count=i;
                    for(var j=0;j<=i;++j)
                    {
                        if (min==null || min>data[j]) min=data[j];
                    }
                }

                result[i]=min;
            }
        }
        else
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(data)) return result;
            n=parseInt(n);
            if (n<=0) n=data.length;
            else if (n>data.length) n=data.length;

            var nStart=this.GetFirstVaildIndex(data);
            if (nStart>=data.length) return result;

            var nMin=nStart;
            if (nMin<data.length) result[nMin]=data[nMin];
            for(var i=nMin+1,j=2;i<data.length && j<n;++i,++j)
            {
                if (data[i]<=data[nMin]) nMin=i;
                result[i]=data[nMin];
            }

            for(;i<data.length;++i)
            {
                if (i-nMin<n) 
                {
                    nMin=data[i]>data[nMin]?nMin:i;
                }
                else
                {
                    for(j=nMin=(i-n+1);j<=i;++j)
                    {
                        nMin=data[j]>data[nMin]?nMin:j;
                    }
                }

                result[i]=data[nMin];
            }
        }

        return result;
    }

    /*
    LV(X,N) 求X在N个周期内的最小值（不包含当前k线）

    注：
    1、若N为0则从第一个有效值开始算起;
    2、当N为有效值，但当前的k线数不足N根，按照实际的根数计算;
    3、N为空值时，返回空值。
    4、N可以是变量。

    例1：
    LL:LV(L,10);//求前面10根k线的最低点。（不包含当前k线）
    例2：
    N:=BARSLAST(DATE<>REF(DATE,1))+1;//分钟周期，日内k线根数
    ZL:VALUEWHEN(DATE<>REF(DATE,1),LV(L,N));//在分钟周期上，求昨天最低价。
    例3：
    LV(L,5) 和 REF(LLV(L,5),1) 的结果是一样的，用LV编写更加方便。
    */

    this.LV=function(data,n)
    {
        var result=this.LLV(data,n);
        return this.REF(result,1);
    }

    this.STD=function(data,n)
    {
        var result=[];
        
        if (!Array.isArray(data)) return result;
        var nStart=this.GetFirstVaildIndex(data);
        if (!IFrameSplitOperator.IsNumber(n)) return result;
        if(nStart+n>data.length || n<1) return result;

        var i=nStart, j=0, bFirst=true, dTotal=0, dAvg=0;
        for(i+=n-1;i<data.length;++i)
        {
            dTotal = 0;
            if(bFirst)
            {
                bFirst = false;
                for(j=i-n+1;j<=i;++j)
                {
                    dAvg += data[j];
                }
                    
                dAvg /= n;
            }
            else
            {
                dAvg += (data[i]-data[i-n])/n;
            }

            for(j=i-n+1;j<=i;++j)
            {
                dTotal += (data[j]-dAvg)*(data[j]-dAvg);
            }
			

		    result[i] = Math.sqrt(dTotal/(n-1));
        }

        return result;
    }



    //STDDEV(X,N) 返回标准偏差
    //将标准差除以样本大小N的平方根即可得出标准误差。标准误差 = σ/sqrt(n)
    this.STDDEV=function(data,n)
    {
        var result=[];
        
        if (!Array.isArray(data)) return result;
        var nStart=this.GetFirstVaildIndex(data);
        if (!IFrameSplitOperator.IsNumber(n)) return result;
        if(nStart+n>data.length || n<1) return result;

        var i=nStart, j=0, bFirst=true, dTotal=0, dAvg=0;
        for(i+=n-1;i<data.length;++i)
        {
            dTotal = 0;
            if(bFirst)
            {
                bFirst = false;
                for(j=i-n+1;j<=i;++j)
                {
                    dAvg += data[j];
                }
                    
                dAvg /= n;
            }
            else
            {
                dAvg += (data[i]-data[i-n])/n;
            }

            for(j=i-n+1;j<=i;++j)
            {
                dTotal += (data[j]-dAvg)*(data[j]-dAvg);
            }
			

		    result[i] = Math.sqrt(dTotal/(n-1))/Math.sqrt(n);
        }

        return result;
    }

    //平均绝对方差
    this.AVEDEV=function(data,n)
    {
        var result=[];

        var total=0;
        var averageData=[]; //平均值
        for(var i=n-1;i<data.length;++i)
        {
            total=0;
            for(var j=0;j<n;++j)
            {
                total+=data[i-j];
            }

            averageData[i]=total/n;
        }

        for(var i=n-1;i<data.length;++i)
        {
            total=0;
            for(var j=0;j<n;++j)
            {
                total+=Math.abs(data[i-j]-averageData[i]);
            }

            result[i]=total/n;
        }


        return result;
    }

    //上穿
    this.CROSS=function(data,data2)
    {
        var result=[];
        
        if (Array.isArray(data) && Array.isArray(data2))
        {
            if (data.length!=data2.length) return result=[];

            var index=0;
            for(;index<data.length;++index)
            {
                if (this.IsNumber(data[index])  && this.IsNumber(data2[index]))
                    break;
            }

            for(++index;index<data.length;++index)
            {
                result[index]= (data[index]>data2[index] && data[index-1]<data2[index-1]) ? 1:0;
            }
        }
        else if (Array.isArray(data) && typeof(data2)=='number')
        {
            var index=0;
            for(;index<data.length;++index)
            {
                if (this.IsNumber(data[index])) break;
            }

            for(++index;index<data.length;++index)
            {
                result[index]= (data[index]>data2 && data[index-1]<data2) ? 1:0;
            }
        }
        else if (typeof(data)=='number' && Array.isArray(data2))
        {
            var index=0;
            for(;index<data2.length;++index)
            {
                if (this.IsNumber(data2[index])) break;
            }

            for(++index;index<data2.length;++index)
            {
                result[index]= (data2[index]<data && data2[index-1]>data) ? 1:0;
            }
        }

        return result;
    }

    /*
    CROSSDOWN(A,B)：表示当A从上方向下穿B，成立返回1(Yes)，否则返回0(No)

    注：1、CROSSDOWN(A,B)等同于CROSS(B,A)，CROSSDOWN(A,B)编写更利于理解

    例1：
    MA5:=MA(C,5);
    MA10:=MA(C,10);
    CROSSDOWN(MA5,MA10)//MA5下穿MA10
    */
    this.CROSSDOWN=function(data,data2)
    {
        return this.CROSS(data2,data);
    }

    /*
    CROSSUP(A,B) 表当A从下方向上穿过B，成立返回1(Yes)，否则返回0(No)

    注：
    1、CROSSUP(A,B)等同于CROSS(A,B)，CROSSUP(A,B)编写更利于理解。

    例1：
    MA5:=MA(C,5);
    MA10:=MA(C,10);
    CROSSUP(MA5,MA10),ICON(1,'ICO4');//MA5上穿MA10，标注红箭头。
    //CROSSUP(MA5,MA10),ICON(1,'ICO4'); 与  CROSSUP(MA5,MA10)=1,ICON(1,'ICO4');表达同等意义
    */

    this.CROSSUP=function(data,data2)
    {
        return this.CROSS(data,data2);
    }

    //累乘
    this.MULAR=function(data,n)
    {
        var result=[];
        if (!Array.isArray(n))
        {
            if(data.length<n) return result;
            if (n==0)
            {
                var index=n;
                for(;index<data.length;++index)
                {
                    if (this.IsNumber(data[index]))
                    {
                        result[index]=data[index];
                        break;
                    }
                }

                for(++index;index<data.length;++index)
                {
                    result[index]=result[index-1]*data[index];
                }
            }
            else
            {
                for(var i=n-1,j=0;i<data.length;++i,++j)
                {
                    for(var k=0;k<n;++k)
                    {
                        if (k==0) result[i]=data[k+j];
                        else result[i]*=data[k+j];
                    }
                }
            }
            
        }
        else
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var totalCount=n[i];
                if (!this.IsNumber(totalCount)) continue;
                totalCount=parseInt(totalCount);
                if (totalCount<0) continue;

                for(var j=i, k=0 ;j>=0 && k<totalCount ;--j,++k)
                {
                    if (k==0) result[i]=data[j];
                    else result[i]*=data[j];
                }
            }
        }
        

        return result;
    }

    this.SUM=function(data,n)
    {
        var result=[];

        if (!Array.isArray(n))
        { 
            if (n<=0)
            {
                var start=-1;
                for(var i=0; i<data.length; ++i)    //取第1个有效数
                {
                    if (IFrameSplitOperator.IsNumber(data[i]))
                    {
                        start=i;
                        break;
                    }
                }

                if (start<0) return result;

                result[start]=data[start];
        
                for (var i=start+1; i<data.length; ++i)
                {
                    result[i] = result[i-1]+data[i];
                }
            }
            else
            {
                result[0]=data[0];
                for(var i=1;i<n && i<data.length;++i)   //前面小于N周期的累加
                {
                    result[i] = result[i-1]+data[i];
                }

                for(var i=n-1,j=0;i<data.length;++i,++j)
                {
                    for(var k=0;k<n;++k)
                    {
                        if (k==0) result[i]=data[k+j];
                        else result[i]+=data[k+j];
                    }
                }
            }
        }
        else
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var totalCount=n[i];
                if (!(totalCount>0)) continue;

                for(var j=i, k=0 ;j>=0 && k<totalCount ;--j,++k)
                {
                    if (k==0) result[i]=data[j];
                    else result[i]+=data[j];
                }
            }
        }
    
        return result;
    }

    /*
        BARSCOUNT 有效数据周期数
        求总的周期数。
        用法：　BARSCOUNT(X)　第一个有效数据到当前的天数。
        例如：　BARSCOUNT(CLOSE)　对于日线数据取得上市以来总交易日数，对于分笔成交取得当日成交笔数，对于1分钟线取得当日交易分钟数。
    */
    this.BARSCOUNT=function(data)
    {
        let result=[];
        let days=null;
        for(let i in data)
        {
            result[i]=0;
            if (days==null)
            {
                if (!this.IsNumber(data[i])) continue;

                days=0;
            }
                
            result[i]=days;
            ++days;
        }

        return result;
    }

    //DEVSQ 数据偏差平方和
    //DEVSQ(X，N) 　返回数据偏差平方和。
    this.DEVSQ=function(data,n)
    {
        if (this.IsNumber(data) && this.IsNumber(n))
            return 0;

        var result=[];
        if (Array.isArray(data))
        {
            var num = null;
            if (Array.isArray(n))   //取最后一个有效数
            {
               for(var i=n.length-1;i>=0;--i)
               {
                   if (this.IsNumber(n[i]))
                   {
                        num = parseInt(n[i]);
                        break;
                   }
               }
            }
            else
            {
                num = parseInt(n);
            }

            if (!this.IsNumber(num)) return result;
            
            var datanum = data.length;
            var i = 0, j = 0, k = 0;
            var E = 0, DEV = 0;
            for(i = 0; i < datanum && !this.IsNumber(data[i]); ++i)
            {
                result[i] = null;
            }
            if (num < 1 || i+num>datanum) return result;
            for(E=0; i < datanum && j < num; ++i,++j)
                E += data[i]/num;
            if (j == num)
            {
                DEV = 0;
                for(i--; k < num; k++)
                    DEV += (data[i-k]-E) * (data[i-k]-E);
                result[i] = DEV;
                i++;
            }
            for(; i < datanum; ++i)
            {
                E += (data[i] - data[i-num]) / num;
                for(DEV=0, k = 0; k < num; ++k)
                    DEV += (data[i-k]-E) * (data[i-k]-E);
                result[i] = DEV;
            }
        }
        
        return result;
    }

    //NOT 取反
    //求逻辑非。
    //用法：　NOT(X)　返回非X，即当X=0时返回1，否则返回0。
    //例如：　NOT(ISUP)　表示平盘或收阴。
    this.NOT=function(data)
    {
        let isNumber=typeof(data)=='number';
        if (isNumber) return data? 0:1;

        let result=[];
        for(let i in data)
        {
            result[i]=null;
            if (this.IsNumber(data[i])) result[i]=data[i]?0:1;
        }

        return result;
    }

    //FORCAST 线性回归预测值
    //FORCAST(X，N)　 返回线性回归预测值。
    this.FORCAST=function(data,n)
    {
        var result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        if (num < 1 || num >= datanum)
            return result;
        var Ex = 0, Ey = 0, Sxy = 0, Sxx = 0, Const, Slope;
        var i, j,x;
        for(j = 0; j < datanum && !this.IsNumber(data[j]); ++j)
        {
            result[j] = null;
        }
        for(i = j+num-1; i < datanum; ++i)
        {
           Ex = Ey = Sxy = Sxx = 0;
           for(j = 0, x=num; j < num && j <= i; ++j, --x)
           {
               Ex += x;
               Ey += data[i - j];
           }
           Ex /= num;
           Ey /= num;
           for(j = 0, x=num; j < num && j <= i; ++j,--x)
           {
               Sxy += (x-Ex)*(data[i-j]-Ey);
               Sxx += (x-Ex)*(x-Ex);
           }
           Slope = Sxy / Sxx;
           Const = Ey - Ex*Slope;
           result[i] = Slope * num + Const;
        }

        return result;
    }

    //TSMA(X,N)：求X在N个周期内的时间序列三角移动平均
    //TSMA(a,n) 算法如下：
    //ysum=a[i]+a[i-1]+...+a[i-n+1]
    //xsum=i+i-1+..+i-n+1
    //xxsum=i*i+(i-1)*(i-1)+...+(i-n+1)*(i-n+1)
    //xysum=i*a[i]+(i-1)*a[i-1]+...+(i-n+1)*a[i-n+1]
    //k=(xysum -(ysum/n)*xsum)/(xxsum- xsum/n * xsum) //斜率
    //b= ysum/n - k*xsum/n
    //forcast[i]=k*i+b //线性回归
    //tsma[i] = forcast[i]+k  //线性回归+斜率
    this.TSMA=function(data,n)
    {
        var result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        if (num < 1 || num >= datanum)
            return result;
        var Ex = 0, Ey = 0, Sxy = 0, Sxx = 0, Const, Slope;
        var i, j,x;
        for(j = 0; j < datanum && !this.IsNumber(data[j]); ++j)
        {
            result[j] = null;
        }
        for(i = j+num-1; i < datanum; ++i)
        {
           Ex = Ey = Sxy = Sxx = 0;
           for(j = 0, x=num; j < num && j <= i; ++j, --x)
           {
               Ex += x;
               Ey += data[i - j];
           }
           Ex /= num;
           Ey /= num;
           for(j = 0, x=num; j < num && j <= i; ++j,--x)
           {
               Sxy += (x-Ex)*(data[i-j]-Ey);
               Sxx += (x-Ex)*(x-Ex);
           }
           Slope = Sxy / Sxx;
           Const = Ey - Ex*Slope;
           result[i] = (Slope * num + Const) + Slope;
        }

        return result;
    }

    //SLOPE 线性回归斜率
    //SLOPE(X，N)　 返回线性回归斜率。
    this.SLOPE=function(data,n)
    {
        let result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        if (n<1 || !data.length) return result;
        if (n>=data.length) return result;

        let start=0;
        for(let i=0;i<data.length;++i,++start)
        {
            result[i]=null;
            if (this.IsNumber(data[i])) break;
        }

        let x,y,xy,xx;
        for(let i=start+n-1;i<data.length;++i)
        {
            result[i]=null;
            x=y=xy=xx=0;
            for(var j=0;j<n && j<=i; ++j)
            {
                x+=(i-j);       //数据索引相加
                y+=data[i-j];   //数据相加
            }

            x=x/n; y=y/n;
            for(j=0;j<n && j<=i; ++j)
            {
                xy+=(i-j-x)*(data[i-j]-y);
                xx+=(i-j-x)*(i-j-x);
            }

            if (xx) result[i]= xy/xx;
            else if (i) result[i]=result[i-1];
        }

        return result;
    }

    //STDP 总体标准差
    //STDP(X，N)　 返回总体标准差。
    this.STDP=function(data,n)
    {
        var result=[];
        if (!Array.isArray(data)) return result;
        var nStart=this.GetFirstVaildIndex(data);
        if (!IFrameSplitOperator.IsNumber(n)) return result;
        if(nStart+n>data.length || n<1) return result;

        var i=nStart, j=0, bFirst=true, dTotal=0, dAvg=0;
        for(i+=n-1;i<data.length;++i)
        {
            dTotal = 0;
            if(bFirst)
            {
                bFirst = false;
                for(j=i-n+1;j<=i;++j)
                {
                    dAvg += data[j];
                }
                    
                dAvg /= n;
            }
            else
            {
                dAvg += (data[i]-data[i-n])/n;
            }

            for(j=i-n+1;j<=i;++j)
            {
                dTotal += (data[j]-dAvg)*(data[j]-dAvg);
            }
			

		    result[i] = Math.sqrt(dTotal/n);
        }

        return result;
    }

    //VAR 估算样本方差
    //VAR(X，N)　 返回估算样本方差。
    this.VAR=function(data,n)
    {
        if (this.IsNumber(data) && this.IsNumber(n)) return 0;

        var result=[];
        if (Array.isArray(data) && this.IsNumber(n))
        {
            var num = parseInt(n);
            var datanum = data.length;
            if (num <= 0 || num >= datanum) return result;

            var i, j;
            for(i = 0; i < datanum && !this.IsNumber(data[i]); ++i)
            {
                result[i] = null;
            }
            var SigmaPowerX, SigmaX;
            for (j = 0, i = i+num-1; i < datanum; ++i)
            {
                SigmaPowerX = SigmaX = 0;
                for(j=0; j < num && j <= i; ++j)
                {
                    SigmaPowerX += data[i-j] * data[i-j];
                    SigmaX += data[i-j];
                }
                result[i] = (num*SigmaPowerX - SigmaX*SigmaX) / num * (num -1);
            }
        }
        else if (Array.isArray(data) && Array.isArray(n))
        {
            var start=this.GetFirstVaildIndex(data);

            for(var i=start; i<data.length; ++i)
            {
                var SigmaPowerX = SigmaX = 0;
                if (!this.IsNumber(n[i])) continue;
                var num=parseInt(n[i]);

                if (num <= 0 || i-(num-1)<0) continue;

                for (var j = 0; j<num; ++j)
                {
                    SigmaPowerX += data[i-j] * data[i-j];
                    SigmaX += data[i-j];
                }

                result[i] = (num*SigmaPowerX - SigmaX*SigmaX) / num * (num -1);
            }
        }

        return result;
    }

    //VARP 总体样本方差
    //VARP(X，N)　 返回总体样本方差 。
    this.VARP=function(data,n)
    {
        var result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        if (num < 1 || num >= datanum)
            return result;
        var i = 0, j = 0;
        for(i = 0; i < datanum && !this.IsNumber(data[i]); ++i)
        {
            result[i] = null;
        }
        var SigmaPowerX = 0, SigmaX = 0;
        for (; i < datanum && j < num; ++i, ++j)
        {
            SigmaPowerX += data[i] * data[i];
            SigmaX += data[i];
        }
        if (j == num)
            result[i-1] = (num*SigmaPowerX - SigmaX*SigmaX) / (num*num);
        for(; i < datanum; ++i)
        {
            SigmaPowerX += data[i]*data[i] - data[i-num]*data[i-num];
            SigmaX += data[i] - data[i-num];
            result[i] = (num*SigmaPowerX - SigmaX*SigmaX) / (num*num);
        }

        return result;
    }

    //RANGE(A,B,C)表示A>B AND A<C;
    this.RANGE=function(data,range,range2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(range)=='number';
        let isNumber3=typeof(range2)=='number';

        if (isNumber && isNumber2 && isNumber3)
        {
            if (data>Math.min(range,range2) && data<Math.max(range,range2)) return 1;
            else return 0;
        }

        let result=[];
        let value, rangeValue,rangValue2;
        for(let i=0; i<data.length; ++i)
        {
            result[i]=null;
            value=data[i];
            if (!this.IsNumber(value)) continue;

            if (!isNumber2) 
            {
                if (i>=range.length) continue;

                rangeValue=range[i];
            }
            else 
            {
                rangeValue=range;
            }
            if (!this.IsNumber(rangeValue)) continue;

            if (!isNumber3) 
            {
                if (i>=range2.length) continue;

                rangeValue2=range2[i];
            }
            else 
            {
                rangeValue2=range2;
            }
            if (!this.IsNumber(rangeValue2)) continue;


            result[i]= (value>Math.min(rangeValue,rangeValue2) && value<Math.max(rangeValue,rangeValue2)) ? 1:0;
        }

        return result;
    }

    /*
    是否存在.
    例如: EXIST(CLOSE>OPEN,10) 
    表示10日内存在着阳线
    */
    this.EXIST=function(data,n)
    {
        if (typeof(data)=='number') return 0;

        if (Array.isArray(n))
        {
            var result=[];
            if (data.length<=0) return result;

            for( var i in data) //初始化
            {
                result[i]=0;
            }

            for(var i=0;i<n.length && i<data.length;++i)
            {
                var period=n[i];
                if (!this.IsNumber(period)) continue;
                period=parseInt(period);
                if (period<=0) continue;
                if (period>i+1) period=i+1;

                var bExist=false;
                var index=0, value=0;
                for(var j=0;j<period;++j)
                {
                    index=i-(period-j-1);
                    value=data[i];
                    if (this.IsNumber(value) && value>0)
                    {
                        bExist=true;
                        break;
                    }
                }

                result[i]=bExist?1:0;
            }

            return result;
        }
        else
        {
            n=parseInt(n);
            var latestID=null; //最新满足条件的数据索引
            var result=[];
            var value;
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                value=data[i];
                if (this.IsNumber(value) && value>0) latestID=i;
    
                if (latestID!=null && i-latestID<n) result[i]=1;
                else result[i]=0;
            }
    
            return result;
        }
    }

    /*
    过滤连续出现的信号.
    用法:TFILTER(买入条件,卖出条件,N);过滤掉买入(卖出)信号发出后,下一个反向信号发出前的所有买入(卖出)信号.

    N=1表示仅对买入信号过滤;
    N=2表示仅对卖出信号过滤;
    N=0表示对买入和卖出信号都过滤,返回1,2表示买入或卖出条件成立;
    同一K线上只能有一个信号;

    例如:
    ENTERLONG:TFILTER(买入,卖出,1);
    EXITLONG:TFILTER(买入,卖出,2);

    TFILTER(D,K,1) 等价于 D AND COUNT(D, BARSLAST(K)) == 1
    TFILTER(D,K,2) 等价于 K AND COUNT(K, BARSLAST(D)) == 1
    TFILTER(D,K,0) 需要做个判断，如果满足  D AND COUNT(D, BARSLAST(K)) == 1 则返回1，如果满足  K AND COUNT(K, BARSLAST(D)) == 1 则返回2
    */
    this.TFILTER=function(data,data2,n)
    {
        
        if (!this.IsNumber(n)) return [];
        if (n==1)
        {
            return this.And(data,this.EQ(this.COUNT(data,this.BARSLAST(data2)),1));
        }
        else if (n==2)
        {
            return this.And(data2,this.EQ(this.COUNT(data2,this.BARSLAST(data)),1));
        }
        else if (n==0)
        {
            var result=this.And(data2,this.EQ(this.COUNT(data2,this.BARSLAST(data)),1));
            var value=this.And(data2,this.EQ(this.COUNT(data2,this.BARSLAST(data)),1));
            
            for(var i=0; i<result.length; ++i)
            {
                var item=value[i];
                if (item>0) result[i]=2;
            }

            return result;
        }
        
        return [];
    }

    /*
    过滤连续出现的信号.
    用法:FILTER(X,N):X满足条件后,将其后N周期内的数据置为0,N为常量.
    例如:
    FILTER(CLOSE>OPEN,5)查找阳线,5天内再次出现的阳线不被记录在内
    */
    this.FILTER=function(data,n)
    {
        var result=[];
        for(let i=0,j=0; i<data.length; ++i)
        {
            if (data[i])
            {
                result[i]=1;
                for(j=0;j<n && j+i+1<data.length;++j)
                {
                    result[j+i+1]=0;
                }
                i+=n;
            }
            else
            {
                result[i]=0;
            }
        }

        return result;
    }

    //反向过滤连续出现的信号.
    //用法:FILTERX(X,N):X满足条件后,将其前N周期内的数据置为0,N为常量.
    //例如:FILTERX(CLOSE>OPEN,5)查找阳线,前5天内出现过的阳线不被记录在内
    this.FILTERX=function(data, n, node)
    {
        var result=[];
        for(let i=0,j=0; i<data.length; ++i)
        {
            if (data[i])
            {
                result[i]=1;
                for(j=0;j<n && i-j-1>=0;++j)
                {
                    result[i-j-1]=0;
                }
                i+=n;
            }
            else
            {
                result[i]=0;
            }
        }

        return result;
    }

    //上一次条件成立到当前的周期数.
    //用法:BARSLAST(X):上一次X不为0到现在的周期数
    //例如:BARSLAST(CLOSE/REF(CLOSE,1)>=1.1)表示上一个涨停板到当前的周期数
    this.BARSLAST=function(data)
    {
        var result=[];
        if (!data) return result;

        let day=null;
        for(let i=0;i<data.length;++i)
        {
            result[i]=null;

            if (data[i]>0)  day=0;
            else if (day!=null) ++day;

            if (day!=null) result[i]=day;
        }

        return result;
    }

    //倒数第N次成立时距今的周期数.
    //用法:BARSLASTS(X,N):X倒数第N满足到现在的周期数,N支持变量
    this.BARSLASTS=function(data, n, node)
    {
        var result=[];
        if (!data) return result;
        if (n<=0) n=data.length;

        var day=null;
        var SingleValue=0;  //单词数
        var periodCount=0;
        for(let i=0;i<data.length;++i)
        {
            result[i]=null;
            var value=data[i];

            if (value>0)  
            {
                if (day==null) 
                {
                    day=0;
                    ++periodCount;
                }
                else
                {
                    ++periodCount;
                    if (periodCount>n) day-=SingleValue;
                }

                SingleValue=0;
            }
            else 
            {
                if (day!=null) 
                {
                    ++day;
                    ++SingleValue;
                }
            }

            if (day!=null) result[i]=day;
        }

        return result;
    }

    /*
    N周期内第一个条件成立到当前的周期数.
    用法:
    BARSSINCEN(X,N):N周期内第一次X不为0到现在的天数,N为常量
    例如:
    BARSSINCEN(HIGH>10,10)表示10个周期内股价超过10元时到当前的周期数
    */
    this.BARSSINCEN=function(data,n)
    {
        var result=[];
        if (this.IsNumber(n) && Array.isArray(data))
        {
            var nPeriod=n;
            if (nPeriod<1) nPeriod=data.length;
            var i=this.GetFirstVaildIndex(data);
            if (i>=data.length) return result;
            var j=0;
            if (i <= nPeriod - 1) j = nPeriod - 1;
	        else j = i;

            result[j] = j - i;

            for (; j < data.length; ++j)
            {
                if (this.IsNumber(result[j - 1]))
                {
                    if (result[j - 1] + 1 < nPeriod)
                    {
                        result[j] = result[j - 1] + 1;
                    }
                    else
                    {
                        for (var k = j - nPeriod+1; k <= j; ++k)
                        {
                            if (!(Math.abs(data[k]) < 0.000001))
                            {
                                result[j] = j - k;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    if (!(Math.abs(data[j]) < 0.000001))
                        result[j] = 0;
                }
            }
        }

        return result;
    }

    /*
    第一个条件成立到当前的周期数.
    用法:
    BARSSINCE(X):第一次X不为0到现在的天数
    例如:
    BARSSINCE(HIGH>10)表示股价超过10元时到当前的周期数
    */
    this.BARSSINCE=function(data)
    {
        var result=[];
        var day=null;

        for(let i=0;i<data.length;++i)
        {
            result[i]=null;
            if (day==null)
            {
                if (data[i]) day=0;
            }
            else
            {
                ++day;
            }

            if (day) result[i]=day;
        }

        return result;
    }

    /*三角函数调用 func 三角函数 
    反正切值. 用法: ATAN(X)返回X的反正切值
    余弦值.  用法: COS(X)返回X的余弦值
    正弦值.  用法: SIN(X)返回X的正弦值
    正切值.  用法: TAN(X)返回X的正切值

    求自然对数. 用法: LN(X)以e为底的对数 例如: LN(CLOSE)求收盘价的对数
    求10为底的对数. 用法: LOG(X)取得X的对数 例如: LOG(100)等于2
    指数. 用法: EXP(X)为e的X次幂 例如: EXP(CLOSE)返回e的CLOSE次幂
    开平方. 用法: SQRT(X)为X的平方根 例如: SQRT(CLOSE)收盘价的平方根
    */
    this.Trigonometric=function(data,func)
    {
        if (!Array.isArray(data))
        {
            if (this.IsNumber(data)) return func(data);

            return null;
        }
        else
        {
            var result=[];
            for(let i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) result[i]=func(item);
                else result[i]=null;
            }

            return result;
        }
    }

    //反正弦值. 用法: ASIN(X)返回X的反正弦值
    this.ASIN=function(data)
    {
        if (!Array.isArray(data))
        {
            if (this.IsNumber(data)) return Math.acos(data);

            return null;
        }
        else
        {
            var result=[];
            for(let i in data)
            {
                var item=data[i];
                result[i]=null;
                if (this.IsNumber(item)) 
                {
                    if (item>=-1 && item<=1) 
                    {
                        result[i]=Math.asin(item);
                    }
                    else if (i-1>=0)
                    {
                        var preItem=result[i-1];
                        if (this.IsNumber(preItem)) result[i]=preItem;
                    }
                }
            }

            return result;
        }
    }


    //反余弦值. 用法: ACOS(X)返回X的反余弦值
    this.ACOS=function(data)
    {
        if (!Array.isArray(data))
        {
            if (this.IsNumber(data)) return Math.acos(data);

            return null;
        }
        else
        {
            var result=[];
            for(let i in data)
            {
                var item=data[i];
                result[i]=null;
                if (this.IsNumber(item)) 
                {
                    if (item>=-1 && item<=1) 
                    {
                        result[i]=Math.acos(item);
                    }
                    else if (i-1>=0)
                    {
                        var preItem=result[i-1];
                        if (this.IsNumber(preItem)) result[i]=preItem;
                    }
                }
            }

            return result;
        }
    }

    /*
    LAST(X,A,B):持续存在.
    用法:
    LAST(CLOSE>OPEN,10,5) 
    表示从前10日到前5日内一直阳线
    若A为0,表示从第一天开始,B为0,表示到最后日止
    */
    this.LAST=function(data,n,n2)
    {
        if (!Array.isArray(data)) return [];
        
        var result=[];
        var lCount=data.length;
        var nStart = n;
        var nEnd = n2, k = 0, i = 0, j = 0, t = 0;
        for (; k < lCount; ++k)
        {
            if (data[k]) break;
        }

        for (i = k, t = k - nEnd + 1; i<lCount; ++i, ++t)
        {
            j = (nStart == 0) ? k : Math.max(k, i - nStart);
            for (; j < t; ++j)
            {
                if (data[j]<=0)
                {
                    break;
                }
            }

            result[i]=(j<t ? 0 : 1);
        }
        
        return result;
    }

    /*
    属于未来函数,之字转向.
    用法: ZIG(K,N),当价格变化量超过N%时转向,K表示0:开盘价,1:最高价,2:最低价,3:收盘价,其余:数组信息
    例如: ZIG(3,5)表示收盘价的5%的ZIG转向
    */
    this.ZIG=function(data,n)
    {
        var hisData=this.SymbolData.Data;
        var result=[];
        if (typeof(data)=='number')
        {
            switch(data)
            {
                case 0:
                    data=hisData.GetOpen();
                    break;
                case 1:
                    data=hisData.GetHigh();
                    break;
                case 2:
                    data=hisData.GetLow();
                    break;
                case 3:
                    data=hisData.GetClose();
                    break;
                default:
                    return result;
            }
        }

        return this.ZIG_Calculate(data,n);
    }

    this.GetFirstVaildIndex=function(data)
    {
        for (var i = 0; i <data.length; ++i)
        {
            if (this.IsNumber(data[i]))
                return i;
        }
    
        return data.length;
    }

    this.ZIG_Calculate=function(data,dRate)
    {
        var dest=[];
        var nDataCount=data.length;
        var m=this.GetFirstVaildIndex(data);
	    var i = 0, lLastPos = 0, lState = 0, j = 0;
        var dif = 0;
        for (i = m + 1, lLastPos = lState = m; i<nDataCount - 1 && lState == m; ++i)
        {
            lState = Math.abs(data[i] - data[m]) * 100 >= dRate*data[m] ? (data[i]>data[m] ? i : -i) : m;
        }

        for (; i<nDataCount - 1; ++i)
        {
            if (data[i] >= data[i - 1] && data[i] >= data[i + 1])
            {
                if (lState<0)
                {
                    if ((data[i] - data[-lState]) * 100<dRate*data[-lState]) continue;
                    else
                    {
                        dif = (data[lLastPos] - data[j = -lState]) / (-lState - lLastPos);
                        dest[j--]=data[-lState];
                        for (; j >= lLastPos; j--)
                            dest[j]=data[-lState] + (-lState - j)*dif;
                        lLastPos = -lState;
                        lState = i;
                    }
                }
                else if (data[i]>data[lState])  lState = i;
            }
            else if (data[i] <= data[i - 1] && data[i] <= data[i + 1])
            {
                if (lState>0)
                {
                    if ((data[lState] - data[i]) * 100<dRate*data[lState]) continue;
                    else
                    {
                        dif = (data[lState] - data[j = lLastPos]) / (lState - lLastPos);
                        dest[j++]=data[lLastPos];
                        for (; j <= lState; ++j)
                            dest[j]=data[lLastPos] + (j - lLastPos)*dif;
                        lLastPos = lState;
                        lState = -i;
                    }
                }
                else if (data[i]<data[-lState]) lState = -i;
            }
        }

        if (Math.abs(lState) >= nDataCount - 2)
        {
            if (lState>0 && data[nDataCount - 1] >= data[lState]) lState = nDataCount - 1;
            if (lState<0 && data[nDataCount - 1] <= data[-lState]) lState = 1 - nDataCount;
        }

        if (lState>0)
        {
            dif = (data[lState] - data[j = lLastPos]) / (lState - lLastPos );
            dest[j++]=data[lLastPos];
            for (; j <= lState; ++j)
                dest[j]=data[lLastPos] + (j - lLastPos)*dif;
        }
        else
        {
            dif = (data[lLastPos] - data[j = -lState]) / (-lState - lLastPos);
            dest[j--]=data[-lState];
            for (; j >= lLastPos; j--)
                dest[j]=(data[-lState] + (-lState - j)*dif);
        }
        if ((lState = Math.abs(lState))<nDataCount - 1)
        {
            if (data[nDataCount - 1] >= data[lState])
            {
                dif = (data[nDataCount - 1] - data[j = lState]) / (nDataCount - lState);
                dest[j++]=(data[lState]);
                for (; j<nDataCount; ++j)
                    dest[j]=(data[lState] + (j - lState)*dif);
            }
            else
            {
                dif = (data[lState] - data[j = nDataCount - 1]) / (nDataCount - lState);
                dest[j--]=(data[nDataCount - 1]);
                for (; j >= lState; j--)
                    dest[j]=(data[nDataCount - 1] + (nDataCount - j)*dif);
            }
        }

        return dest;
    }

    this.JSDraw=null;
    this.CalculateZIGLine=function(firstData,secondData,thridData,data,result)
    {
        if (this.JSDraw==null) this.JSDraw=new JSDraw(this.ErrorHandler);
        var isUp=secondData.Up;
        var findData=firstData;
        if (isUp)
        {
            for(var i=firstData.ID+1;i<thridData.ID;++i)  //查找最高点
            {
                var subItem=data[i];
                if (!this.IsNumber(subItem)) continue;
                if (findData.Value<subItem) findData={ID:i, Value:subItem};
            }
        }
        else
        {
            for(var i=firstData.ID+1;i<thridData.ID;++i)  //查找最低点
            {
                var subItem=data[i];
                if (!this.IsNumber(subItem)) continue;
                if (findData.Value>subItem) findData={ID:i, Value:subItem};
            }
        }

        secondData.Value=findData.Value;
        secondData.ID=findData.ID;

        var lineCache={ Start:{ID:firstData.ID, Value:firstData.Value}, End:{ID:secondData.ID,Value:secondData.Value}}; 
        var lineData=this.JSDraw.CalculateDrawLine(lineCache);//计算2个点的线上 其他点的数值
        for(var i in lineData)
        {
            var lineItem=lineData[i];
            result[lineItem.ID]=lineItem.Value;
        }

        if (thridData.ID==data.length-1)    //最后一组数据
        {
            //最后2个点的数据连成线
            lineCache={ Start:{ID:secondData.ID, Value:secondData.Value}, End:{ID:thridData.ID,Value:thridData.Value} };
            lineData=this.JSDraw.CalculateDrawLine(lineCache);//计算2个点的线上 其他点的数值
            for(var i in lineData)
            {
                var lineItem=lineData[i];
                result[lineItem.ID]=lineItem.Value;
            }
        }
        else
        {
            firstData.ID=secondData.ID;
            firstData.Value=secondData.Value;

            secondData.ID=thridData.ID;
            secondData.Value=thridData.Value;
            secondData.Up=firstData.Value < secondData.Value;
        }
    }

    /*
    属于未来函数,前M个ZIG转向波谷到当前距离.
    用法:
    TROUGHBARS(K,N,M)表示之字转向ZIG(K,N)的前M个波谷到当前的周期数,M必须大于等于1
    例如:
    TROUGHBARS(2,5,2)表示%5最低价ZIG转向的前2个波谷到当前的周期数
    */
    this.TROUGHBARS=function(data,n,n2)
    {
        var zigData=this.ZIG(data,n);   //计算ZIG
        var dest=[];

        var lEnd =n2;
        if (lEnd<1) return dest;

        var nDataCount = zigData.length;
        var trough = [];
        for(var i=0;i<lEnd;++i) trough[i]=0;
        var lFlag = 0;
        var i = this.GetFirstVaildIndex(zigData) + 1;
        for (lEnd--; i<nDataCount && zigData[i]>zigData[i - 1]; ++i);

        for (; i<nDataCount && zigData[i]<zigData[i - 1]; ++i);

        for (trough[0] = --i; i<nDataCount - 1; ++i)
        {
            if (zigData[i]<zigData[i + 1])
            {
                if (lFlag)
                {
                    if (lEnd)
                    {
                        var tempTrough=trough.slice(0);
                        for(var j=0;j<lEnd;++j)
                        {
                            trough[j+1]=tempTrough[j];
                        }
                    } 
                    trough[lFlag = 0] = i;
                }
            }
            else lFlag = 1;
            if (trough[lEnd]) dest[i]=(i - trough[lEnd]);
        }
        if (trough[lEnd]) dest[i]=(i - trough[lEnd]);

        return dest;
    }

    this.TROUGH=function(data,n,n2)
    {
        var zigData=this.ZIG(data,n);   //计算ZIG
        var dest=[];

        var End=n2;
        if(End<1) return dest;

        var nDataCount = zigData.length;
        var trough=[];
        for(var i=0;i<End;++i) trough[i]=0;
        var i=1,Flag=0;
        var i = this.GetFirstVaildIndex(zigData) + 1;

        for(End--; i<nDataCount && zigData[i]>zigData[i-1]; ++i);

        for(; i<nDataCount && zigData[i]<zigData[i-1]; ++i);

        for(trough[0]=--i;i<nDataCount-1;++i)
        {	
            if(zigData[i]<zigData[i+1])
            {	
                if(Flag) 
                {	
                    if(End) 
                    {
                        var tempTrough=trough.slice(0);
                        for(var j=0;j<End;++j)
                        {
                            trough[j+1]=tempTrough[j];
                        }
                    }
                    trough[Flag=0]=i;
                }
            }
            else Flag=1;
            if(trough[End]) dest[i]=zigData[trough[End]];
        }
        if(trough[End]) dest[i]=zigData[trough[End]];

        return dest;
    }

    /*
    属于未来函数,前M个ZIG转向波峰到当前距离.
    用法:
    PEAKBARS(K,N,M)表示之字转向ZIG(K,N)的前M个波峰到当前的周期数,M必须大于等于1
    例如:
    PEAKBARS(0,5,1)表示%5开盘价ZIG转向的上一个波峰到当前的周期数
    */
    this.PEAKBARS=function(data,n,n2)
    {
        var zigData=this.ZIG(data,n);   //计算ZIG
        var dest=[];

        var nDataCount = zigData.length;
        var lEnd = n2;
        if (lEnd < 1) return dest;

        var peak = [];
        for(var i=0;i<lEnd;++i) peak[i]=0;
        var lFlag = 0;
        
        var i = this.GetFirstVaildIndex(zigData) + 1;
        for (lEnd--; i<nDataCount && zigData[i]<zigData[i - 1]; ++i);

        for (; i<nDataCount && zigData[i]>zigData[i - 1]; ++i);

        for (peak[0] = --i; i<nDataCount - 1; ++i)
        {
            if (zigData[i]>zigData[i + 1])
            {
                if (lFlag)
                {
                    if (lEnd) 
                    {
                        var tempPeak=peak.slice(0);
                        for(var j=0;j<lEnd;++j)
                        {
                            peak[j+1]=tempPeak[j];
                        }
                    }
                    peak[lFlag = 0] = i;
                }
            }
            else lFlag = 1;
            if (peak[lEnd]) dest[i]=(i - peak[lEnd]);
        }
        if (peak[lEnd])dest[i]=(i - peak[lEnd]);

        return dest;
    }

    this.PEAK=function(data,n,n2)
    {
        var zigData=this.ZIG(data,n);   //计算ZIG
        var dest=[];

        var nDataCount = zigData.length;
        var lEnd = n2;
        if (lEnd < 1) return dest;

        var lFlag = 0;
        var peak = [];
        for(var i=0;i<lEnd;++i) peak[i]=0;
        
        var i = this.GetFirstVaildIndex(zigData) + 1;
        for (lEnd--; i<nDataCount && zigData[i]<zigData[i - 1]; ++i);

        for (; i<nDataCount && zigData[i]>zigData[i - 1]; ++i);

        for (peak[0] = --i; i<nDataCount - 1; ++i)
        {
            if (zigData[i]>zigData[i + 1])
            {
                if (lFlag)
                {
                    if (lEnd) 
                    {
                        var tempPeak=peak.slice(0);
                        for(var j=0;j<lEnd;++j)
                        {
                            peak[j+1]=tempPeak[j];
                        }
                    }
                    peak[lFlag = 0] = i;
                }
            }
            else lFlag = 1;
            if (peak[lEnd]) dest[i]=(zigData[peak[lEnd]]);
        }
        if (peak[lEnd]) dest[i]=(zigData[peak[lEnd]]);
        
        return dest;
    }

    /*
    一直存在.
    例如:
    EVERY(CLOSE>OPEN,N) 
    表示N日内一直阳线(N应大于0,小于总周期数,N支持变量)
    */
    this.EVERY=function(data,n)
    {
        var result=[];
        if (n<1) return result;
        if (IFrameSplitOperator.IsNumber(n)) 
        {
            n=parseInt(n);
            var i=0;
            for(;i<data.length;++i)
            {
                result[i]=null;
                if (this.IsNumber(data[i])) break;
            }

            var flag=0;
            for(;i<data.length;++i)
            {
                if (data[i]) flag+=1;
                else flag=0;
                
                if (flag==n)
                {
                    result[i]=1;
                    --flag;
                }
                else 
                {
                    result[i]=0;
                }
            }
        }
        else if (Array.isArray(n))
        {
            for(var i=0;i<n.length;++i)
            {
                var value=n[i];
                result[i]=null;
                if (!IFrameSplitOperator.IsPlusNumber(value)) continue;
                value=parseInt(value);

                var flag=0;
                for(var j=i, k=0; j>=0 && k<value; --j, ++k)
                {
                    if (data[j]) ++flag;
                }

                result[i]=(flag==value?1:0);
            }
        }
        return result;
    }

    /*
    成本分布情况.
    用法:
    COST(10),表示10%获利盘的价格是多少,即有10%的持仓量在该价格以下,其余90%在该价格以上,为套牢盘
    该函数仅对日线分析周期有效
    */
    this.COST=function(data, node)
    {
        var result=[];
        var rate=data/100;
        if(rate<0.000001 || rate>1) return result;
    
        var kData=this.SymbolData.Data.Data;
        if (!kData || kData.length<=0) return result;
        var aryCapital=this.SymbolData.GetStockCacheData({ FunctionName:"FINANCE", Args:[7], ArgCount:1, Node:node } ); //流通股本

        var dMaxPrice=kData[0].High,dMinPrice=kData[0].Low;
        for(var i=0;i<kData.length;++i)
        {
            var item=kData[i];
            dMinPrice = Math.min(dMinPrice,item.Low);
            dMaxPrice = Math.max(dMaxPrice,item.High);
        }

        if (dMinPrice > 2000 || dMinPrice < 0 || dMaxPrice>2000 || dMinPrice < 0)
            this.ThrowUnexpectedNode(node,'COST() 历史K线最大最小值错误, 超出(0,1000)范围');

        var lMaxPrice = parseInt(dMaxPrice * 100 + 1);
        var lMinPrice = parseInt(dMinPrice * 100 - 1);
        var lLow = 0, lHigh = 0, lClose = 0;
        //去掉小数
        dMaxPrice = lMaxPrice / 100.0;
        dMinPrice = lMinPrice / 100.0;
        var lSpeed = lMaxPrice - lMinPrice + 1;
        if (lSpeed < 1) return result;
        
        var aryVolPrice=[],aryPerVol=[];
        for(var i=0;i<lSpeed;++i)
        {
            aryVolPrice[i]=0;
            aryPerVol[i]=0;
        }

        var dHSL = 0, dTotalVol = 0, dVol = 0, dCost=0;
        for(var i=0;i<kData.length;++i)
        {
            if (i >= aryCapital.length) continue;
            if (aryCapital[i]>1)
            {
                var kItem=kData[i]
                dHSL = kItem.Vol/aryCapital[i];

                for( var j=0;j<lSpeed;j++) 
                    aryVolPrice[j]*=(1-dHSL);

                lLow=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Low *100)))-lMinPrice;
                lHigh=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.High*100)))-lMinPrice;
                lClose=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Close*100)))-lMinPrice;

                for(var j=0;j<lSpeed;++j) aryPerVol[j]=0;

                var lHalf =parseInt((lLow + lHigh + 2 * lClose) / 4);
                if (lHalf == lHigh || lHalf == lLow)
                {
                    aryPerVol[lHalf] += kItem.Vol;
                }
                else
                {
                    var	dVH = kItem.Vol / (lHalf - lLow);
                    for (var k = lLow; k<lHalf; ++k)
                    {
                        aryPerVol[k] += (k - lLow)*(dVH / (lHalf - lLow));
                    }
                    for (k; k <= lHigh; ++k)
                    {
                        aryPerVol[k] += (k - lHigh)*(dVH / (lHalf - lHigh));
                    }
                }

                var dTotalVol = 0;
                for (var j = lLow; j <= lHigh; j++)
                {
                    aryVolPrice[j] += aryPerVol[j];
                }

                for (var j = 0; j < lSpeed; j++)
                {
                    dTotalVol += aryVolPrice[j];
                }

                for(j=0,dCost=dVol=0;j<lSpeed;++j)
                {	
                    dVol+=aryVolPrice[j];
                    if(dVol>=dTotalVol*rate)
                    {	
                        dCost=(dMaxPrice-dMinPrice)*j/lSpeed+dMinPrice;
                        break;
                    }
                }
            }

            result[i]=dCost;
        }

        return result;
    }

    /*
    this.COST=function(data)
    {
        var result=[];
        var exchangeID=201;
        var exchangeData=this.SymbolData.GetFinanceCacheData(exchangeID);    //换手率
        if (!exchangeData) return result;

        var isNumber=Array.isArray(data)?false:true;
        var singleData=null;
        if (isNumber) singleData=parseFloat(data);
        var compareData=null;

        for(let i=this.SymbolData.Data.Data.length-1, j=0,k=0 ; i>=0; --i)
        {
            result[i]=null;
            var chipData=this.CalculateChip(i,exchangeData,this.SymbolData.Data.Data,1);
            if (chipData.Max==null || chipData.Min==null || chipData.Max<=0 || chipData.Min<=0) continue;

            var max=parseInt(chipData.Max*100);
            var min=parseInt(chipData.Min*100);
           
            if (singleData!=null) 
            {
                compareData=singleData;
            }
            else 
            {
                if (i>=data.length) continue;
                compareData=data[i];
            }
            
            var totalVol=0,vol=0;
            var aryMap=new Map();
            for(j=i; j>=0; --j)
            {
                var item=chipData.Data[j];
                var start=parseInt(item.Low*100);
                var end=parseInt(item.High*100);
                if ((end-start+1)<=0) continue;

                var iAverageVolume=item.Vol;
                iAverageVolume=iAverageVolume/(end-start+1);
                if (iAverageVolume<=0) continue;

                for(k=start;k<=end && k<=max;++k)
                {
                    if (aryMap.has(k)) 
                    {
                        vol=aryMap.get(k);
                        aryMap.set(k,vol+iAverageVolume);
                    }
                    else
                    {
                        aryMap.set(k,iAverageVolume);
                    }
                }

                totalVol+=item.Vol;
            }

            //计算获利盘
            vol=0;
            for(var priceData of aryMap)
            {
                vol+=priceData[1];
                result[i]=priceData[0]/100;
                if (vol/totalVol*100>compareData)
                    break;
            }
        }

        return result;
    }
    */

    /*
    获利盘比例.
    用法:
    WINNER(CLOSE),表示以当前收市价卖出的获利盘比例,例如返回0.1表示10%获利盘;WINNER(10.5)表示10.5元价格的获利盘比例
    该函数仅对日线分析周期有效
    */
    this.WINNER=function(data, node)
    {
        var result=[];
        var kData=this.SymbolData.Data.Data;
        if (!kData || kData.length<=0) return result;
        var aryCapital=this.SymbolData.GetStockCacheData({ FunctionName:"FINANCE", Args:[7], ArgCount:1, Node:node } ); //流通股本

        var dMaxPrice=kData[0].High,dMinPrice=kData[0].Low;
        for(var i=0;i<kData.length;++i)
        {
            var item=kData[i];
            dMinPrice = Math.min(dMinPrice,item.Low);
            dMaxPrice = Math.max(dMaxPrice,item.High);
        }

        if (dMinPrice > 5000 || dMinPrice < 0 || dMaxPrice>5000 || dMinPrice < 0)
            this.ThrowUnexpectedNode(node,'WINNER() 历史K线最大最小值错误, 超出(0,5000)范围');

        var lMaxPrice = parseInt(dMaxPrice * 100 + 1);
	    var lMinPrice = parseInt(dMinPrice * 100 - 1);
	    var lLow = 0, lHigh = 0, lClose = 0;
        //去掉小数
        dMaxPrice = lMaxPrice / 100.0;
        dMinPrice = lMinPrice / 100.0;
	    var lSpeed = lMaxPrice - lMinPrice + 1;
        if (lSpeed < 1) return result;
        
        var aryVolPrice=[],aryPerVol=[];
        for(var i=0;i<lSpeed;++i)
        {
            aryVolPrice[i]=0;
            aryPerVol[i]=0;
        }

        var dHSL = 0, dTotalVol = 0, dVol = 0;
        for(var i=0;i<kData.length;++i)
        {
            if (i >= aryCapital.length) continue;
            if (!(aryCapital[i]>1)) continue;
            var kItem=kData[i]
            dHSL = kItem.Vol/aryCapital[i];

            for( var j=0;j<lSpeed;j++) 
                aryVolPrice[j]*=(1-dHSL);

            lLow=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Low *100)))-lMinPrice;
            lHigh=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.High*100)))-lMinPrice;
            lClose=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Close*100)))-lMinPrice;

            for(var j=0;j<lSpeed;++j) aryPerVol[j]=0;

            var lHalf =parseInt((lLow + lHigh + 2 * lClose) / 4);
            if (lHalf == lHigh || lHalf == lLow)
            {
                aryPerVol[lHalf] += kItem.Vol;
            }
            else
            {
                var	dVH = kItem.Vol / (lHalf - lLow);
                for (var k = lLow; k<lHalf; ++k)
                {
                    aryPerVol[k] += (k - lLow)*(dVH / (lHalf - lLow));
                }
                for (k; k <= lHigh; ++k)
                {
                    aryPerVol[k] += (k - lHigh)*(dVH / (lHalf - lHigh));
                }
            }

            var dTotalVol = 0;
            for (var j = lLow; j <= lHigh; j++)
            {
                aryVolPrice[j] += aryPerVol[j];
            }

            for (var j = 0; j < lSpeed; j++)
            {
                dTotalVol += aryVolPrice[j];
            }

            if (Array.isArray(data))
                lHigh = parseInt(Math.min((data[i] * 100) - lMinPrice, lSpeed - 1));
            else
                lHigh = parseInt(Math.min((data * 100) - lMinPrice, lSpeed - 1));

            for (var j = 0, dVol = 0; j <= lHigh; j++)
            {
                dVol += aryVolPrice[j];
            }

            if (dTotalVol > 0) result[i]=dVol / dTotalVol;
            else if (i - 1 >= 0) result[i] = result[i - 1];
        }
    
        return result;
    }

    /*
    this.WINNER=function(data)
    {
        var result=[];
        var exchangeID=201;
        var exchangeData=this.SymbolData.GetFinanceCacheData(exchangeID);    //换手率
        if (!exchangeData) return result;

        var isNumber=Array.isArray(data)?false:true;
        var singleData=null;
        if (isNumber) singleData=parseInt(parseFloat(data)*100);
        var compareData=null;

        for(let i=this.SymbolData.Data.Data.length-1, j=0,k=0 ; i>=0; --i)
        {
            result[i]=null;
            var chipData=this.CalculateChip(i,exchangeData,this.SymbolData.Data.Data,1);
            if (chipData.Max==null || chipData.Min==null || chipData.Max<=0 || chipData.Min<=0) continue;

            var max=parseInt(chipData.Max*100);
            var min=parseInt(chipData.Min*100);
           
            if (singleData!=null) 
            {
                compareData=singleData;
            }
            else 
            {
                if (i>=data.length) continue;
                compareData=parseInt(data[i]*100);
            }
            
            var totalVol=0,vol=0;
            for(j=i; j>=0; --j)
            {
                var item=chipData.Data[j];
                var start=parseInt(item.Low*100);
                var end=parseInt(item.High*100);
                if ((end-start+1)<=0) continue;

                var iAverageVolume=item.Vol;
                iAverageVolume=iAverageVolume/(end-start+1);
                if (iAverageVolume<=0) continue;

                var profitVol=0;    //获利的成交量
                if (compareData>end) profitVol=item.Vol;
                else if (compareData<start) profitVol=0;
                else profitVol=item.Vol*(compareData-start+1)/(end-start+1);

                vol+=profitVol;
                totalVol+=item.Vol;
            }

            if (totalVol>0) result[i]=vol/totalVol;
        }

        return result;
    }
    */

    /*
    区间成本.
    用法:
    例如COSTEX(CLOSE,REF(CLOSE,1)),表示近两日收盘价格间筹码的成本
    该函数仅对日线分析周期有效
    */
    this.COSTEX=function(data, data2, node)
    {
        var result=[];
        var kData=this.SymbolData.Data.Data;
        if (!kData || kData.length<=0) return result;
        var aryCapital=this.SymbolData.GetStockCacheData({ FunctionName:"FINANCE", Args:[7], ArgCount:1, Node:node } ); //流通股本

        var dMaxPrice=kData[0].High,dMinPrice=kData[0].Low;
        for(var i=0;i<kData.length;++i)
        {
            var item=kData[i];
            dMinPrice = Math.min(dMinPrice,item.Low);
            dMaxPrice = Math.max(dMaxPrice,item.High);
        }

        if (dMinPrice > 5000 || dMinPrice < 0 || dMaxPrice>5000 || dMinPrice < 0)
            this.ThrowUnexpectedNode(node,'COSTEX() 历史K线最大最小值错误, 超出(0,5000)范围');

        var lMaxPrice = parseInt(dMaxPrice * 100 + 1);
        var lMinPrice = parseInt(dMinPrice * 100 - 1);
        var lLow = 0, lHigh = 0, lClose = 0;
        //去掉小数
        dMaxPrice = lMaxPrice / 100.0;
        dMinPrice = lMinPrice / 100.0;
        var lSpeed = lMaxPrice - lMinPrice + 1;
        if (lSpeed < 1) return result;
        
        var aryVolPrice=[],aryPerVol=[];
        for(var i=0;i<lSpeed;++i)
        {
            aryVolPrice[i]=0;
            aryPerVol[i]=0;
        }

        var dHSL = 0, dTotalVol = 0, dVol = 0, dVola=0, dPerVola=0, dVolb=0, dPerVolb=0;
        for(var i=0, j=0;i<kData.length;++i)
        {
            if (i >= aryCapital.length) continue;
            if (aryCapital[i]>1)
            {
                var kItem=kData[i]
                dHSL = kItem.Vol/aryCapital[i];

                for( var j=0;j<lSpeed;j++) 
                    aryVolPrice[j]*=(1-dHSL);

                lLow=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Low *100)))-lMinPrice;
                lHigh=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.High*100)))-lMinPrice;
                lClose=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Close*100)))-lMinPrice;

                for(var j=0;j<lSpeed;++j) aryPerVol[j]=0;

                var lHalf =parseInt((lLow + lHigh + 2 * lClose) / 4);
                if (lHalf == lHigh || lHalf == lLow)
                {
                    aryPerVol[lHalf] += kItem.Vol;
                }
                else
                {
                    var	dVH = kItem.Vol / (lHalf - lLow);
                    for (var k = lLow; k<lHalf; ++k)
                    {
                        aryPerVol[k] += (k - lLow)*(dVH / (lHalf - lLow));
                    }
                    for (k; k <= lHigh; ++k)
                    {
                        aryPerVol[k] += (k - lHigh)*(dVH / (lHalf - lHigh));
                    }
                }

                dTotalVol = 0;
                for (var j = lLow; j <= lHigh; j++)
                {
                    aryVolPrice[j] += aryPerVol[j];
                }

                for (var j = 0; j < lSpeed; j++)
                {
                    dTotalVol += aryVolPrice[j];
                }

                if (Array.isArray(data)) lHigh = parseInt(Math.min((data[i] * 100) - lMinPrice, lSpeed - 1));
                else lHigh = parseInt(Math.min((data * 100) - lMinPrice, lSpeed - 1));
                for (j = 0, dVola = 0, dPerVola = 0; j <= lHigh; j++)
                {
                    dVola += aryVolPrice[j];
                    dPerVola += (0.01*(j + lMinPrice))*aryVolPrice[j];
                }

                if (Array.isArray(data2)) lHigh = parseInt(Math.min((data2[i] * 100) - lMinPrice, lSpeed - 1));
                else lHigh = parseInt(Math.min((data2 * 100) - lMinPrice, lSpeed - 1));
                for (j = 0,  dVolb = 0, dPerVolb = 0; j <= lHigh; j++)
                {
                    dVolb += aryVolPrice[j];
                    dPerVolb += (0.01*(j + lMinPrice))*aryVolPrice[j];
                }

                dVol = dVola - dVolb;
			    dPerVolRange = dPerVola - dPerVolb;
			    if (Math.abs(dPerVolRange) > 0.001 && dVol!=0 ) result[i]=dPerVolRange / dVol;
			    else if (i-1>=0) result[i] = result[i - 1];
            }
        }

        return result;
    }

    /*
    远期成本分布比例.
    用法:
    PPART(10),表示10前的成本占总成本的比例,0.2表示20%
    */
    this.PPART=function(n,node)
    {
        var result=[];
        var startDay=n;
        if (startDay<0) return result;

        var kData=this.SymbolData.Data.Data;
        if (!kData || kData.length<=0) return result;
        var aryCapital=this.SymbolData.GetStockCacheData({ FunctionName:"FINANCE", Args:[7], ArgCount:1, Node:node } ); //流通股本
        
        for (var i = startDay, j = 0; i < kData.length; ++i)
        {
            var start = i - startDay;
            if (start < 0) continue;
            
            var partVol = 0;
            for (j = 0; j < startDay; ++j)	//前n日成交量和
            {
                var kItem=kData[j + start];
                partVol += kItem.Vol;
            }
    
            if (i < aryCapital.length)
            {
                if (aryCapital[i]>0)
                {
                    var value=1 - (partVol / aryCapital[i]);
                    result[i]=value;
                }
            }
        }

        return result;
    }

    /*
    近期获利盘比例.
    用法: LWINNER(5,CLOSE),表示最近5天的那部分成本以当前收市价卖出的获利盘比例
    例如: 返回0.1表示10%获利盘
    */
    this.LWINNER=function(n, data, node)
    {
        var startDay =n;
        if (startDay<=0) this.ThrowUnexpectedNode(node,'LWINNER() 第1个参数错误');

        var result=[];
        var kData=this.SymbolData.Data.Data;
        if (!kData || kData.length<=0) return result;
        var aryCapital=this.SymbolData.GetStockCacheData({ FunctionName:"FINANCE", Args:[7], ArgCount:1, Node:node } ); //流通股本
        var dTotalVol=0,dVol=0;
        for (var i = startDay-1, j=0, k=0 ; i < kData.length; ++i)
        {
            var index = i - startDay + 1;

            var dMaxPrice=kData[index].High,dMinPrice=kData[index].Low;
            for(var j=0;j<startDay;++j)
            {
                var item=kData[index+j];
                dMinPrice = Math.min(dMinPrice,item.Low);
                dMaxPrice = Math.max(dMaxPrice,item.High);
            }

            if (dMinPrice > 5000 || dMinPrice < 0 || dMaxPrice>5000 || dMinPrice < 0)
                this.ThrowUnexpectedNode(node,'LWINNER() 历史K线最大最小值错误, 超出(0,5000)范围');

            var lMaxPrice = parseInt(dMaxPrice * 100 + 1);
            var lMinPrice = parseInt(dMinPrice * 100 - 1);
            var lLow = 0, lHigh = 0, lClose = 0;
            dMaxPrice = lMaxPrice / 100.0;
            dMinPrice = lMinPrice / 100.0;
            var lSpeed = lMaxPrice - lMinPrice + 1;
            if (lSpeed < 1) return result;
            
            var aryVolPrice=[],aryPerVol=[];
            for(var j=0;j<lSpeed;++j)
            {
                aryVolPrice[j]=0;
                aryPerVol[j]=0;
            }

            for (j = 0; j<startDay; ++j)
		    {
                var capital=aryCapital[index + j];
                if (capital<1) continue;
                
                var kItem=kData[index + j];
                var dHSL = kItem.Vol / capital;
                for (k = 0; k < lSpeed; k++)
                {
                    aryVolPrice[k] *= (1 - dHSL);
                }

                lLow=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Low *100)))-lMinPrice;
                lHigh=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.High*100)))-lMinPrice;
                lClose=parseInt(Math.min(lMaxPrice,Math.max(lMinPrice,kItem.Close*100)))-lMinPrice;
    
                for(var k=0;k<lSpeed;++k) aryPerVol[k]=0;

                var lHalf =parseInt((lLow + lHigh + 2 * lClose) / 4);
                if (lHalf == lHigh || lHalf == lLow)
                {
                    aryPerVol[lHalf] += kItem.Vol;
                }
                else
                {
                    var	dVH = kItem.Vol / (lHalf - lLow);
                    for (let k = lLow; k<lHalf; ++k)
                    {
                        aryPerVol[k] += (k - lLow)*(dVH / (lHalf - lLow));
                    }
                    for (let k; k <= lHigh; ++k)
                    {
                        aryPerVol[k] += (k - lHigh)*(dVH / (lHalf - lHigh));
                    }
                }
    
                dTotalVol = 0;
                for (var k = lLow; k <= lHigh; k++)
                {
                    aryVolPrice[k] += aryPerVol[k];
                }
            }

            for (var j = 0; j < lSpeed; j++)
            {
                dTotalVol += aryVolPrice[j];
            }

            if (Array.isArray(data)) 
                lHigh = parseInt(Math.min((data[i] * 100) - lMinPrice, lSpeed - 1));
            else 
                lHigh = parseInt(Math.min((data * 100) - lMinPrice, lSpeed - 1));

            dVol = 0; 
            for (k = 0 ; k <= lHigh; k++)
            {
                dVol += aryVolPrice[k];
            }
            
            if (dTotalVol > 0 && dVol > 0 && dVol <= dTotalVol) result[i]=dVol / dTotalVol;
            else if (i - 1 >= 0) result[i] = result[i - 1];
        }

        return result;
    }

    this.PWINNER=function(n, data, node)
    {
        var result=[];
        return result;
    }

    //计算截至到某一天的历史所有筹码
    this.CalculateChip=function(index,exchangeData,hisData,dRate)
    {
        var result={Min:null,Max:null,Data:[]};
        var seed=1;//筹码历史衰减换手系数
        var max=null, min=null;
        for(let i=index; i>=0; --i)
        {
            let item={};    //Vol:量 High:最高 Low:最低
            var kData=hisData[i];
            if (i==index) item.Vol=kData.Vol*exchangeData[i];
            else item.Vol=kData.Vol*seed;

            item.Date=kData.Date;
            item.High=kData.High;
            item.Low=kData.Low;

            if (max==null) max=item.High;
            else if (max<item.High) max=item.High;
            if (min==null) min=item.Low;
            else if (min<item.Low) min=item.Low;

            result.Data[i]=item;

            seed*=(1-(exchangeData[i]/100)*dRate);	//换手率累乘
        }

        result.Max=max;
        result.Min=min;

        return result;
    }

    /*
    返回是否连涨周期数.
    用法:
    UPNDAY(CLOSE,M)
    表示连涨M个周期,M为常量
    */
    this.UPNDAY=function(data,n)
    {
        var result=[];
        if (n<1) return result;
        if (data==null || n>data.length) return result;

        var days=0;
        for(let i=0;i<data.length;++i)
        {
            result[i]=0;
            if (i-1<0) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data[i-1])) //无效数都不算连涨
            {
                days=0;
                continue;
            }

            if (data[i]>data[i-1]) ++days;
            else days=0;

            if (days==n)
            {
                result[i]=1;
                --days;
            }
        }

        return result;
    }

    /*
    返回是否连跌周期.
    用法:
    DOWNNDAY(CLOSE,M)
    表示连跌M个周期,M为常量
    */
    this.DOWNNDAY=function(data,n)
    {
        var result=[];
        if (n<1) return result;
        if (data==null || n>data.length) return result;

        var days=0;
        for(let i=0;i<data.length;++i)
        {
            result[i]=0;
            if (i-1<0) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data[i-1])) //无效数都不算连涨
            {
                days=0;
                continue;
            }

            if (data[i]<data[i-1]) ++days;
            else days=0;

            if (days==n)
            {
                result[i]=1;
                --days;
            }
        }

        return result;
    }

    /*
    返回是否持续存在X>Y
    用法:
    NDAY(CLOSE,OPEN,3)
    表示连续3日收阳线
    */
    this.NDAY=function(data,data2,n)
    {
        var result=[];
        if (n<1) return result;
        if (!Array.isArray(data) && !Array.isArray(data2)) return result; 
        if (data==null || data2==null ) return result;

        if (Array.isArray(data) && Array.isArray(data2))
        {
            if (n>=data.length || n>=data2.length) return result;
            var count=Math.max(data.length,data2.length);
            var days=0;
            for(let i=0;i<count;++i)
            {
                result[i]=0;
                if (i>=data.length || i>=data2.length) continue;
                if (!this.IsNumber(data[i]) || !this.IsNumber(data2[i]))
                {
                    days=0;
                    continue;
                }

                if (data[i]>data2[i]) ++days;
                else days=0;

                if (days==n)
                {
                    result[i]=1;
                    --days;
                }
            }
        }
        else if (Array.isArray(data) && !Array.isArray(data2))
        {
            if (n>=data.length || !this.IsNumber(data2)) return;
            var days=0;
            for(let i in data)
            {
                result[i]=0;
                if (!this.IsNumber(data[i])) 
                {
                    days=0;
                    continue;
                }

                if (data[i]>data2) ++days;
                else days=0;

                if (days==n)
                {
                    result[i]=1;
                    --days;
                }
            }
        }
        else if (!Array.isArray(data) && Array.isArray(data2))
        {
            if (n>=data2.length || !this.IsNumber(data)) return;
            var days=0;
            for(let i in data2)
            {
                result[i]=0;
                if (!this.IsNumber(data2[i])) 
                {
                    days=0;
                    continue;
                }

                if (data>data2[i]) ++days;
                else days=0;

                if (days==n)
                {
                    result[i]=1;
                    --days;
                }
            }
        }

        return result;
    }

    /*
    两条线维持一定周期后交叉.
    用法:LONGCROSS(A,B,N)表示A在N周期内都小于B,本周期从下方向上穿过B时返回1,否则返回0
    */
    this.LONGCROSS=function(data,data2,n)
    {
        var result=[];
        var count=Math.max(data.length,data2.length);
        for(let i=0;i<count;++i)
        {
            result[i]=0;
            if (i-1<0) continue;
            if (i>=data.length || i>=data2.length) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data2[i]) || !this.IsNumber(data[i-1]) || !this.IsNumber(data2[i-1])) continue;

            if (data[i]>data2[i] && data[i-1]<data2[i-1]) result[i]=1;
        }

        for(let i=0,j=0;i<count;++i)
        {
            if (!result[i]) continue;

            for(j=1;j<=n && i-j>=0;++j)
            {
                if (data[i-j]>=data2[i-j]) 
                {
                    result[i]=0;
                    break;
                }
            }
        }

        return result;
    }

    this.ISVALID=function(data)
    {
        if (Array.isArray(data))
        {
            var result=[];
            for(var i=0;i<data.length;++i)
            {
                var item=data[i];
                if (item) result[i]=1;
                else result[i]=0;
            }

            return result;
        }
        else
        {
            if (data) return 1;
            else return 0;
        }
    }

    /*
    EXISTR(X,A,B):是否存在(前几日到前几日间).
    例如: EXISTR(CLOSE>OPEN,10,5) 
    表示从前10日内到前5日内存在着阳线
    若A为0,表示从第一天开始,B为0,表示到最后日止
    */
    this.EXISTR=function(data,n,n2)
    {
        var result=[];
        if (!Array.isArray(data)) return result;

        n=parseInt(n);
        n2=parseInt(n2);
        if (n<=0) n=data.length;
        if (n2<=0) n2=1;
        if (n2>n) return result;

        var result=[];
        var value;
        for(let i=0,j=0;i<data.length;++i)
        {
            result[i]=null;
            if (i-n<0 || i-n2<0) continue;

            result[i]=0;
            for(j=n;j>=n2;--j)
            {
                var value=data[i-j];
                if (this.IsNumber(value) && value)
                {
                    result[i]=1;
                    break;
                }
            }
        }

        return result;
    }

    /*
    RELATE(X,Y,N) 返回X和Y的N周期的相关系数
    RELATE(X,Y,N)=(∑[(Xi-Avg(X))(Yi-Avg(y))])/N ÷ √((∑(Xi-Avg(X))^2)/N * (∑(Yi-Avg(Y))^2)/N)
    其中 avg(x)表示x的N周期均值：  avg(X) = (∑Xi)/N  
    √(...)表示开平方
    */
    this.RELATE=function(data,data2,n)
    {
        var result=[];
        if (n<1) n=1;

        if (!Array.isArray(data)|| !Array.isArray(data2)) return result;

        var dataAverage=this.CalculateAverage(data,n);
        var data2Average=this.CalculateAverage(data2,n);

        var count=Math.max(data.length,data2.length);
        for(let i=0,j=0;i<count;++i)
        {
            result[i]=null;

            if (i>=data.length || i>=data2.length || i>=dataAverage.length || i>=data2Average.length) continue;

            var average=dataAverage[i];
            var average2=data2Average[i];

            var total=0,total2=0,total3=0;
            for(j=i-n+1;j<=i;++j)
            {
                total+=(data[j]-average)*(data2[j]-average2);   //∑[(Xi-Avg(X))(Yi-Avg(y))])
                total2+=Math.pow(data[j]-average,2);            //∑(Xi-Avg(X))^2
                total3+=Math.pow(data2[j]-average2,2);          //∑(Yi-Avg(Y))^2)
            }

            result[i]=(total/n)/(Math.sqrt(total2/n)*Math.sqrt(total3/n));
        }

        return result;
    }

    //计算数组n周期内的均值
    this.CalculateAverage=function(data,n)
    {
        var result=[];
        if (n<1) return result;

        var total=0;

        for(var i=0;i<data.length;++i)  //去掉开始的无效数
        {
            if (this.IsNumber(data[i])) break;
        }

        for(;i<data.length && i<n;++i)  //计算第1个周期的数据
        {
            result[i]=null;
            var value=data[i];
            if (!this.IsNumber(value)) continue;
            total+=value;
        }
        result[i-1]=total/n;

        for(;i<data.length;++i)         //计算后面的周期数据
        {
            var value=data[i];
            var preValue=data[i-n];     //上一个周期的第1个数据
            if (!this.IsNumber(value)) value=0;
            if (!this.IsNumber(preValue)) preValue=0;

            total=total-preValue+value; //当前周期的数据 等于上一个周期数据 去掉上一个周期的第1个数据 加上这个周期的最后1个数据
            result[i]=total/n;
        }

        return result;
    }

    /*
    COVAR(X,Y,N) 返回X和Y的N周期的协方差
    */
    this.COVAR=function(data,data2,n)
    {
        if (this.IsNumber(data) || this.IsNumber(data2)) return 0;

        var result=[];
        if (n<1) n=1;

        if (!Array.isArray(data)|| !Array.isArray(data2)) return result;

        var dataAverage=this.CalculateAverage(data,n);
        var data2Average=this.CalculateAverage(data2,n);

        var count=Math.max(data.length,data2.length);

        var count=Math.max(data.length,data2.length);
        for(let i=0,j=0;i<count;++i)
        {
            result[i]=null;

            if (i>=data.length || i>=data2.length || i>=dataAverage.length || i>=data2Average.length) continue;

            var average=dataAverage[i];
            var average2=data2Average[i];

            var total=0;
            for(j=i-n+1;j<=i;++j)
            {
                total+=(data[j]-average)*(data2[j]-average2);   
            }

            result[i]=(total/n);
        }


        return result;
    }

    /*
    求上一高点到当前的周期数.
    用法:
    HHVBARS(X,N):求N周期内X最高值到当前周期数,N=0表示从第一个有效值开始统计
    例如:
    HHVBARS(HIGH,0)求得历史新高到到当前的周期数
    */
    this.HHVBARS=function(data,n)
    {
        var result=[];
        if (!Array.isArray(data)) return result;
        if (Array.isArray(n))
        {
            for(var i=0;i<n.length;++i)
            {
                result[i]=null;
                var period=n[i];
                if (!this.IsNumber(period)) continue;

                var start=i-period;
                if (start<0) start=0;
                var nMax=null;
                var j=start;
                for(; j<data.length;++j)
                {
                    if (this.IsNumber(data[j]))
                    {
                        nMax=j;
                        break;
                    }
                }

                for(var k=0; j<data.length && k<period;++k, ++j)
                {
                    if (data[j]>=data[nMax]) nMax=j;
                }

                if (nMax!=null)
                    result[i]=(i-nMax);
            }
        }
        else
        {
            if (n<1) n=data.length;

            var nMax=null;  //最大值索引
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                if (this.IsNumber(data[i])) 
                {
                    nMax=i;
                    break;
                }
            }

            var j=0;
            for(i=nMax+1;i<data.length && j<n ;++i,++j) //求第1个最大值
            {
                if (data[i]>=data[nMax]) nMax=i;
                if(n==data.length) result[i]=(i-nMax);
            }

            for(;i<data.length;++i)
            {
                if (i-nMax<n)
                {
                    if (data[i]>=data[nMax]) nMax=i;
                }
                else
                {
                    nMax=i-n+1;
                    for(j=nMax;j<=i;++j)    //计算区间最大值
                    {
                        if (data[j]>=data[nMax]) nMax=j;
                    }
                }

                result[i]=i-nMax;
            }
        }

        return result;
    }

    /*
    求上一低点到当前的周期数.
    用法: LLVBARS(X,N):求N周期内X最低值到当前周期数,N=0表示从第一个有效值开始统计
    例如: LLVBARS(HIGH,20)求得20日最低点到当前的周期数
    */
    this.LLVBARS=function(data,n)
    {
        var result=[];
        if (!Array.isArray(data)) return result;

        if (Array.isArray(n))
        {
            for(var i=0;i<n.length;++i)
            {
                result[i]=null;
                var period=n[i];
                if (!this.IsNumber(period)) continue;

                var start=i-period;
                if (start<0) start=0;
                var nMin=null;
                var j=start;
                for(; j<data.length;++j)
                {
                    if (this.IsNumber(data[j]))
                    {
                        nMin=j;
                        break;
                    }
                }

                for(var k=0; j<data.length && k<period;++k, ++j)
                {
                    if (data[j]<=data[nMin]) nMin=j;
                }

                if (nMin!=null)
                    result[i]=(i-nMin);
            }
        }
        else
        {
            if (n<1) n=data.length;

            var nMin=null;  //最小值索引
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                if (this.IsNumber(data[i])) 
                {
                    nMin=i;
                    break;
                }
            }

            var j=0;
            for(i=nMin+1;i<data.length && j<n ;++i,++j) //求第1个最大值
            {
                if (data[i]<=data[nMin]) nMin=i;
                if(n==data.length) result[i]=(i-nMin);
            }

            for(;i<data.length;++i)
            {
                if (i-nMin<n)
                {
                    if (data[i]<=data[nMin]) nMin=i;
                }
                else
                {
                    nMin=i-n+1;
                    for(j=nMin;j<=i;++j)    //计算区间最小值
                    {
                        if (data[j]<=data[nMin]) nMin=j;
                    }
                }

                result[i]=i-nMin;
            }
        }

        return result;
    }

    /*
    β(Beta)系数
    BETA(N) 返回当前证券N周期收益与对应大盘指数收益相比的贝塔系数
    需要下载上证指数历史数据
    涨幅(X)=(现价-上一个交易日收盘价）/上一个交易日收盘价
    公式=股票和指数协方差/指数方差
    */
    this.BETA=function(n)
    {
        var result=[];
        var stockData= this.SymbolData.Data;
        var indexData=this.SymbolData.IndexData;
        if (n<=0) n=1;

        var stockProfit=[]; //股票涨幅
        var indexProfit=[]; //指数涨幅

        for(let i=0;i<stockData.Data.length;++i)
        {
            stockProfit[i]=0;
            indexProfit[i]=0;

            var stockItem=stockData.Data[i];
            var indexItem=indexData.Data[i];

            if (stockItem.Close>0 && stockItem.YClose>0) stockProfit[i]=(stockItem.Close-stockItem.YClose)/stockItem.YClose;
            if (indexItem.Close>0 && indexItem.YClose>0) indexProfit[i]=(indexItem.Close-indexItem.YClose)/indexItem.YClose;
        }

        //计算均值数组
        var averageStockProfit=this.CalculateAverage(stockProfit,n);    
        var averageIndexProfit=this.CalculateAverage(indexProfit,n);

        for(var i=0,j=0;i<stockData.Data.length;++i)
        {
            result[i]=null;

            if (i>=stockProfit.length || i>=indexProfit.length || i>=averageStockProfit.length || i>=averageIndexProfit.length) continue;

            var averageStock=averageStockProfit[i];
            var averageIndex=averageIndexProfit[i];

            var covariance=0;   //协方差
            var variance=0;     //方差
            for(j=i-n+1;j<=i;++j)
            {
                var value=(indexProfit[j]-averageIndex);
                var value2=(stockProfit[j]-averageStock);
                covariance+=value*value2; 
                variance+=value*value; 
            }

            if (this.IsDivideNumber(variance) && this.IsNumber(covariance))
                result[i]=covariance/variance;  //(covariance/n)/(variance/n)=covariance/variance;
        }

        return result;
    }

    /*
    用法:BETA2(X,Y,N)为X与Y的N周期相关放大系数,表示Y变化1%,则X将变化N%
    例如:BETA2(CLOSE,INDEXC,10)表示收盘价与大盘指数之间的10周期相关放大率
    */
    this.BETA2=function(x,y,n)
    {
        var result=[];
        if (n<=0) n=1;

        var xProfit=[null]; //x数据的涨幅
        var yProfit=[null]; //y数据的涨幅

        var count=Math.max(x.length,y.length);

        var lastItem={X:x[0], Y:y[0]};
        for(var i=1;i<count;++i)
        {
            xProfit[i]=0;
            yProfit[i]=0;

            var xItem=x[i];
            var yItem=y[i];

            if (lastItem.X>0) xProfit[i]=(xItem-lastItem.X)/lastItem.X;
            if (lastItem.Y>0) yProfit[i]=(yItem-lastItem.Y)/lastItem.Y;

            lastItem={X:xItem, Y:yItem};
        }

        //计算均值数组
        var averageXProfit=this.CalculateAverage(xProfit,n);    
        var averageYProfit=this.CalculateAverage(yProfit,n);

        for(var i=0,j=0;i<count;++i)
        {
            result[i]=null;

            if (i>=xProfit.length || i>=yProfit.length || i>=averageXProfit.length || i>=averageYProfit.length) continue;

            var averageX=averageXProfit[i];
            var averageY=averageYProfit[i];

            var covariance=0;   //协方差
            var variance=0;     //方差
            for(j=i-n+1;j<=i;++j)
            {
                var value=(xProfit[j]-averageX);
                var value2=(yProfit[j]-averageY);
                covariance+=value*value2; 
                variance+=value*value; 
            }

            if (this.IsDivideNumber(variance) && this.IsNumber(covariance))
                result[i]=covariance/variance;  //(covariance/n)/(variance/n)=covariance/variance;
        }

        return result;
    }

    /*
    抛物转向.
    用法:
    SAR(N,S,M),N为计算周期,S为步长,M为极值
    例如:
    SAR(10,2,20)表示计算10日抛物转向,步长为2%,极限值为20%
    */
    this.SAR=function(n,step,exValue)
    {
        var result=[];
        var stockData= this.SymbolData.Data;
        if (n>=stockData.Data.length) return result;

        var high=null,low=null;
        for(var i=0;i<n;++i)
        {
            var item=stockData.Data[i];
            if (high==null) high=item.High;
            else if (high<item.High) high=item.High;
            if (low==null) low=item.Low;
            else if (low>item.Low) low=item.Low;
        }

        const SAR_LONG=0, SAR_SHORT=1;
        var position=SAR_LONG;
        result[n-1]=low;
        var nextSar=low, sip=stockData.Data[0].High,af=step/100;
        for(var i=n;i<stockData.Data.length;++i)
        {
            var ysip=sip;
            var item=stockData.Data[i];
            var yitem=stockData.Data[i-1];

            if (position==SAR_LONG)
            {
                if (item.Low<result[i-1])
                {
                    position=SAR_SHORT;
                    sip=item.Low;
                    af=step/100;
                    nextSar =Math.max(item.High,yitem.High);
				    nextSar =Math.max(nextSar,ysip+af*(sip-ysip));
                }
                else
                {
                    position = SAR_LONG;
                    if(item.High>ysip)
                    {	
                        sip=item.High;
                        af=Math.min(af+step/100,exValue/100);
                    }
                    nextSar=Math.min(item.Low,yitem.Low);
                    nextSar=Math.min(nextSar,result[i-1]+af*(sip-result[i-1]));
                }
            }
            else if (position==SAR_SHORT)
            {
                if(item.High>result[i-1])
                {
                    position=SAR_LONG;
                    sip=item.High;
                    af=step/100;
                    nextSar =Math.min(item.Low,yitem.Low);
                    nextSar =Math.min(nextSar,result[i-1]+af*(sip-ysip));
                }
                else
                {
                    position = SAR_SHORT;
                    if(item.Low<ysip)
                    {	
                        sip=item.Low;
                        af=Math.min(af+step/100,exValue/100);
                    }
                    nextSar=Math.max(item.High,yitem.High);
                    nextSar=Math.max(nextSar,result[i-1]+af*(sip-result[i-1]));
                }
            }

            result[i]=nextSar;
        }

        return result;
    }

    /*
    抛物转向点.
    用法:
    SARTURN(N,S,M),N为计算周期,S为步长,M为极值,若发生向上转向则返回1,若发生向下转向则返回-1,否则为0
    其用法与SAR函数相同
    */
    this.SARTURN=function(n,step,exValue)
    {
        var result=[];
        var sar=this.SAR(n,step,exValue);
        var stockData= this.SymbolData.Data;
        var index=0;
        for(index=0;index<sar.length;++index)
        {
                if (this.IsNumber(sar[index])) break;
        }
        var flag=0;
        if (index<stockData.Data.length) flag=stockData.Data[index].Close>sar[index];

        for(var i=index+1;i<stockData.Data.length;++i)
        {
            var item=stockData.Data[i];
            if (item.Close<sar[i] && flag) result[i]=-1;
            else result[i]= (item.Close>sar[i] && !flag)? 1:0;
            
            flag=item.Close>sar[i];
        }

        return result;
    }

    /*
    属于未来函数,将当前位置到若干周期前的数据设为1.
    用法:
    BACKSET(X,N),若X非0,则将当前位置到N周期前的数值设为1.
    例如:
    BACKSET(CLOSE>OPEN,2)若收阳则将该周期及前一周期数值设为1,否则为0
    */
    this.BACKSET=function(condition,n)
    {
        var result=[];
        if (!condition) return result;
        var dataCount=condition.length;
        if (!this.IsNumber(dataCount) || dataCount<=0) return result;

        if (Array.isArray(n))
        {
            for(var i=0;i<dataCount;++i)    //初始化0
            {
                result[i]=0;
            }

            for(var i=0;i<dataCount;++i)
            {
                var value=condition[i];
                var period=n[i];
                if (this.IsNumber(value) && value && this.IsNumber(period))
                {
                    for(var j=i,k=0; j>=0 && k<period; --j,++k)
                    {
                        result[j]=1;
                    }
                }
            }
        }
        else
        {
            for(var i=0;i<dataCount;++i)    //初始化0
            {
                result[i]=0;
            }
    
            for(var pos=0;pos<dataCount;++pos)
            {
                if (this.IsNumber(condition[pos])) break;
            }
            if (pos==dataCount) return result;
    
            var num=Math.min(dataCount-pos,Math.max(n,1));
    
            for(var i=dataCount-1,j=0;i>=0;--i)
            {
                var value=condition[i];
                if (this.IsNumber(value) && value)
                {
                    for(j=i;j>i-num;--j)
                    {
                        result[j]=1;
                    }
                }
            }
    
            if (condition[i]) 
            {
                for(j=i;j>=pos;--j) result[j]=1;
            }
        }
        return result;
    }

    //用法:BETWEEN(A,B,C)表示A处于B和C之间时返回1,否则返回0 
    //例如:BETWEEN(CLOSE,MA(CLOSE,20),MA(CLOSE,10))表示收盘价介于10日均线和20日均线之间
    this.BETWEEN=function(condition, data, data2)
    {
        var result=[];
        var isNumber=typeof(condition)=='number';
        var isNumber2=typeof(data)=='number';
        var isNumber3=typeof(data2)=='number';

        if (isNumber && isNumber2 && isNumber3)   //单数值
        {
            return (condition>=data && condition<=data2) ? 1 : 0;
        }

        for(var i in condition)
        {
            result[i]=0;
            var item=condition[i];
            var left=null, right=null;

            if (isNumber2) left=data;
            else if (i<data.length-1) left=data[i];
            
            if (isNumber3) right=data2;
            else if (i<data2.length-1) right=data2[i];

            if (left==null || right==null) continue;

            if (left>right)
            {
                if (item>=right && item<=left) 
                    result[i]=1;
            }
            else
            {
                if (item<=right && item>=left) 
                    result[i]=1;
            }
        }

        return result;
    }

    //STRCAT(A,B):将两个字符串A,B(非序列化)相加成一个字符串C.
    //用法: STRCAT('多头','开仓')将两个字符串'多头','开仓'相加成一个字符串'多头开仓'
    this.STRCAT=function(str1, str2)
    {
        var result=[];
        if (IFrameSplitOperator.IsString(str1) && IFrameSplitOperator.IsString(str2))
            result=str1+str2;
        return result;
    }

    //VARCAT(A,B):将两个字符串A,B相加成一个字符串C.
    //用法: DRAWTEXT(CLOSE>OPEN,LOW,VARCAT('多头',VAR2STR(C,2))) 将两个字符串相加成一个字符串并按条件显示出来
    this.VARCAT=function(data,data2)
    {
        var result=[];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            var nCount=Math.max(data.length, data2.length);
            var strValue="";
            for(var i=0;i<nCount;++i)
            {
                result[i]=null;
                strValue="";
                if (i<data.length)
                {
                    var item=data[i];
                    if (IFrameSplitOperator.IsString(item)) 
                        strValue+=item;
                }

                if (i<data2.length)
                {
                    var item=data2[i];
                    if (IFrameSplitOperator.IsString(item)) 
                        strValue+=item;
                }

                if (strValue!="")
                    result[i]=strValue;
            }
        }
        else if (IFrameSplitOperator.IsString(data) && Array.isArray(data2))
        {
            for(var i=0;i<data2.length;++i)
            {
                result[i]=null;
                var item=data2[i];
                if (IFrameSplitOperator.IsString(item))
                {
                    result[i]=data+item;
                }
            }            
        }
        else if (Array.isArray(data) && IFrameSplitOperator.IsString(data2))
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var item=data[i];
                if (IFrameSplitOperator.IsString(item))
                {
                    result[i]=item+data2;
                }
            }          
        }
        else if (IFrameSplitOperator.IsString(data) && IFrameSplitOperator.IsString(data2))
        {
            result=data+data2;
        }

        return result;
    }

    //FINDSTR(A,B):在字符串A中查找字符串B,如果找到返回1,否则返回0.
    //用法: FINDSTR('多头开仓','开仓')在字符串'多头开仓'中查找字符串'开仓',返回1
    this.FINDSTR=function(data, data2)
    {
        var result=[];
        var str, str2;
        if (IFrameSplitOperator.IsNumber(data)) str=data.toString();
        else str=data;
        if (IFrameSplitOperator.IsNumber(data2)) str2=data2.toString();
        else str2=data2;

        if (IFrameSplitOperator.IsString(str) && IFrameSplitOperator.IsString(str2))
        {
            if (str.indexOf(str2)>=0) return 1;
            else return 0;
        }
        else if (Array.isArray(data) && IFrameSplitOperator.IsString(str2))
        {
            for(var i=0;i<data.length;++i)
            {
                var item=data[i];
                if (IFrameSplitOperator.IsString(item)) 
                {
                    result[i]=item.indexOf(str2)>=0?1:0;
                }
                else if (IFrameSplitOperator.IsNumber(item))
                {
                    str=item.toString();
                    result[i]=str.indexOf(str2)>=0?1:0;
                }
                else
                {
                    result[i]=0;
                }
            }
        }

        return result;
    }

    this.STRLEN=function(data)
    {
        if (IFrameSplitOperator.IsString(data)) return data.length;

        if (Array.isArray(data))
        {
            var result=[];
            for(var i=0;i<data.length;++i)
            {
                var item=data[i];
                if (IFrameSplitOperator.IsString(item)) result[i]=item.length;
                else result[i]=null;
            }

            return result;
        }

        return null;
    }

    this.STRCMP=function(data, data2)
    {
        if (IFrameSplitOperator.IsString(data) && IFrameSplitOperator.IsString(data2))
        {
            return data==data2? 1:0;
        }

        return null;
    }

    //STRSPACE(A):字符串附带一空格
    this.STRSPACE=function(data)
    {
        var result=[];
        if (Array.isArray(data))
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var item=data[i];
                if (IFrameSplitOperator.IsString(item))
                    result[i]=item+' ';
            }
        }
        else
        {
            if (IFrameSplitOperator.IsString(data))
                result=data+" ";
        }

        return result;
    }

    //CON2STR(A,N):取A最后的值(非序列值)转为字符串,小数位数N.
    //用法: CON2STR(FINANCE(20),3)表示取营业收入,以3位小数转为字符串
    this.CON2STR=function(data,n)
    {
        var result=[];
        if (Array.isArray(data))
        {
            for(var i=data.length-1 ; i>=0; --i)
            {
                var item=data[i];
                if (this.IsNumber(item))
                {
                    result=item.toFixed(n);
                    return result;
                }
            }
        }
        else
        {
            if (this.IsNumber(data)) 
                result=data.toFixed(n);
        }

        return result;
    }

    //VAR2STR(A,N):取A的每一个值转为字符串,小数位数N.
    //用法: VAR2STR(C,3)表示取收盘价,以3位小数转为字符串
    this.VAR2STR=function(data,n)
    {
        var result=[];
        if (Array.isArray(data))
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var item=data[i];
                if (this.IsNumber(item))
                    result[i]=item.toFixed(n);
            }
        }
        else
        {
            if (this.IsNumber(data))
                result=data.toFixed(n);
        }

        return result;
    }

    this.MOD=function(data, data2)
    {
        var result=[];
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值
        if (isNumber && isNumber2) 
        {
            return JSAlgorithm.MOD(data,data2);
        }
        else if (!isNumber && !isNumber2) //都是数组相加
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( this.IsNumber(data[i]) && this.IsNumber(data2[i]) ) result[i]=JSAlgorithm.MOD(data[i],data2[i]);
                }
            }

            return result;
        }
        else if (isNumber && !isNumber2)  //单数字 数组
        {
            for(var i in data2)
            {
                result[i]=null;
                if (this.IsNumber(data) && this.IsNumber(data2[i])) result[i]=JSAlgorithm.MOD(data,data2[i]);
            }

            return result;
        }
        else if (!isNumber && isNumber2)  //数组 单数字
        {
            for(var i in data)
            {
                result[i]=null;
                if (this.IsNumber(data[i]) && this.IsNumber(data2)) result[i]=JSAlgorithm.MOD(data[i],data2);
            }

            return result;
        }

        return result;
    }

    this.POW=function(data, n)
    {
        var result=[];
        if (Array.isArray(data) && Array.isArray(n))
        {
            for(var i=0;i<data.length;++i)
            {
                var value=data[i];
                var value2=n[i];
                if (this.IsNumber(value) && this.IsNumber(value2)) result[i]=Math.pow(value,value2);
                else result[i]=null;
            }
        }
        else if (IFrameSplitOperator.IsNumber(data) && Array.isArray(n))
        {
            for(var i=0;i<n.length;++i)
            {
                var item=n[i];
                if (this.IsNumber(item)) result[i]=Math.pow(data,item);
                else result[i]=null;
            }
        }
        else if (IFrameSplitOperator.IsNumber(data) && IFrameSplitOperator.IsNumber(n))
        {
            return Math.pow(data,n);
        }
        else if (Array.isArray(data) && IFrameSplitOperator.IsNumber(n))
        {
            for(var i=0; i<data.length;++i)
            {
                var item=data[i];
                if (this.IsNumber(item)) result[i]=Math.pow(item,n);
                else result[i]=null;
            }
        }
        
        return result;
    }

    this.CEILING=function(data)
    {
        let isNumber=typeof(data)=='number';
        if (isNumber) return parseInt(data);

        var result=[];
        for(var i in data)
        {
            var item=data[i];
            if (this.IsNumber(item)) result[i]=parseInt(item);
            else result[i]=null;
        }

        return result;
    }

    this.FLOOR=function(data)
    {
        let isNumber=typeof(data)=='number';
        if (isNumber) return parseInt((data-1));

        var result=[];
        for(var i in data)
        {
            var item=data[i];
            if (this.IsNumber(item)) result[i]=parseInt((item-1));
            else result[i]=null;
        }

        return result;
    }

    this.ZTPRICE=function(data, rate)
    {
        if (!this.IsNumber(rate)) return null;

        if (Array.isArray(data))
        {
            var result=[];
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) result[i]=(1+rate)*item;
                else result[i]=null;
            }
    
            return result;
        }
        else if (this.IsNumber(data))
        {
            var result=(1+rate)*data;
            return result;
        }
    }

    this.DTPRICE=function(data, rate)
    {
        if (!this.IsNumber(rate)) return null;

        if (Array.isArray(data))
        {
            var result=[];
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) result[i]=(1-rate)*item;
                else result[i]=null;
            }
    
            return result;
        }
        else if (this.IsNumber(data))
        {
            var result=(1-rate)*data;
            return result;
        }
        
    }

    /*
    FRACPART(A)	 取得小数部分
    含义:FRACPART(A)返回数值的小数部分
    阐释:例如FRACPART(12.3)求得0.3,FRACPART(-3.5)求得-0.5
    */
    this.FRACPART=function(data)
    {
        if (Array.isArray(data))
        {
            var result=[];
            var integer=0;
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) 
                {
                    integer=parseInt(item);
                    result[i]=item-integer;
                }
                else result[i]=null;
            }
    
            return result;
        }
        else if (this.IsNumber(data))
        {
            integer=parseInt(data);
            var result=data-integer;
            return result;
        }
    }

    /*
    取符号.
    用法:
    SIGN(X),返回X的符号.当X>0,X=0,X<0分别返回1,0,-1
    */
    this.SIGN=function(data)
    {
        if (Array.isArray(data))
        {
            var result=[];
            for(var i=0;i<data.length;++i)
            {
                var item=data[i];
                result[i]=null;
                if (!IFrameSplitOperator.IsNumber(item)) continue;

                if (item>0) result[i]=1;
                else if (item==0) result[i]=0;
                else result[i]=-1;
            }

            return result;
        }
        else
        {
            if (data>0) return 1;
            else if (data==0) return 0;
            else return -1;
        }
    }

    /*
    统计连续满足条件的周期数.
    用法: BARSLASTCOUNT(X),统计连续满足X条件的周期数.
    例如: BARSLASTCOUNT(CLOSE>OPEN)表示统计连续收阳的周期数
    */
    this.BARSLASTCOUNT=function(data)
    {
        var result=null;
        if (Array.isArray(data))
        {
            result=[];
            if (data.length>0)
            {
                var count=0;
                for(var i=data.length-1;i>=0;--i)
                {
                    count=0;
                    for(var j=i;j>=0;--j)
                    {
                        if (data[j]) ++count;
                        else break;
                    }
                    result[i]=count;
                }
            }
        }
        else
        {
            if (data) result=1;
            else result=0;
        }
        return result;
    }

    //取整.
    //用法: INTPART(A)返回沿A绝对值减小方向最接近的整数
    //例如:INTPART(12.3)求得12,INTPART(-3.5)求得-3
    this.INTPART=function(data)
    {
        var result=null;
        if (Array.isArray(data))
        {
            result=[];
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) result[i]=parseInt(item);
                else result[i]=null;
            }
        }
        else if (this.IsNumber(data))
        {
            result=parseInt(data);
        }

        return result;
    }

    //用法:CONST(A),取A最后的值为常量.
    //例如:CONST(INDEXC),表示取大盘现价
    this.CONST=function(data)
    {
        if (Array.isArray(data))
        {
            var count=data.length;
            if (count>0)
                return data[count-1];
            
            return null;
        }
        else
        {
            return data;
        }
    }

    //当前值是近多少周期内的最大值.
    //用法: TOPRANGE(X):X是近多少周期内X的最大值
    //例如: TOPRANGE(HIGH)表示当前最高价是近多少周期内最高价的最大值
    this.TOPRANGE=function(data)
    {
        if (this.IsNumber(data)) return 0;
        
        var result=[];

        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1; i>=0;--i)
            {
                result[i]=0;
                var item=data[i];
                if (!this.IsNumber(item)) continue;

                var value=0;
                for(var j=i-1;j>=0;--j)
                {
                    if (data[j]>item)
                    {
                        break;
                    }
                    ++value;
                }

                result[i]=value;

            }
        }

        return result;
    }

    //当前值是近多少周期内的最小值.
    //用法:LOWRANGE(X):X是近多少周期内X的最小值
    //例如:LOWRANGE(LOW)表示当前最低价是近多少周期内最低价的最小值
    this.LOWRANGE=function(data)
    {
        if (this.IsNumber(data)) return 0;

        var result=[];

        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1; i>=0;--i)
            {
                result[i]=0;
                var item=data[i];
                if (!this.IsNumber(item)) continue;

                var value=0;
                for(var j=i-1;j>=0;--j)
                {
                    if (data[j]<item)
                    {
                        break;
                    }
                    ++value;
                }

                result[i]=value;

            }
        }

        return result;
    }

    //N周期前的M周期内的第T个最小值.
    //用法:FINDLOW(VAR,N,M,T):VAR在N日前的M天内第T个最低价
    this.FINDLOW=function(data,n,m,t)
    {
        if (this.IsNumber(data)) return data;
        
        var result=[];
        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                result[i]=null;
                var aryValue=[];
                for(var j=n;j<m;++j)
                {
                    var index=i-j;
                    if (index<0) break;
                    var item=data[index];
                    if (this.IsNumber(item)) aryValue.push(item);
                }

                if (aryValue.length>0)
                {
                    aryValue.sort(function(a,b) { return a-b;});
                    var index=t-1;
                    if (index<0) index=0;
                    else if (index>=aryValue.length) index=aryValue.length-1;
                    result[i]=aryValue[index];
                }
            }
        }

        return result;
    }

    //N周期前的M周期内的第T个最大值.
    //用法:FINDHIGH(VAR,N,M,T):VAR在N日前的M天内第T个最高价
    this.FINDHIGH=function(data,n,m,t)
    {
        if (this.IsNumber(data)) return data;
        
        var result=[];
        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                result[i]=null;
                var aryValue=[];
                for(var j=n;j<m;++j)
                {
                    var index=i-j;
                    if (index<0) break;
                    var item=data[index];
                    if (this.IsNumber(item)) aryValue.push(item);
                }

                if (aryValue.length>0)
                {
                    aryValue.sort(function(a,b) { return b-a;});
                    var index=t-1;
                    if (index<0) index=0;
                    else if (index>=aryValue.length) index=aryValue.length-1;
                    result[i]=aryValue[index];
                }
            }
        }

        return result;
    }

    //N周期前的M周期内的第T个最大值到当前周期的周期数.
    //用法:FINDHIGHBARS(VAR,N,M,T):VAR在N日前的M天内第T个最高价到当前周期的周期数
    this.FINDHIGHBARS=function(data, n, m, t)
    {
        if (this.IsNumber(data)) return (m-n-t);
        
        var result=[];
        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                result[i]=null;
                var aryValue=[];
                for(var j=n;j<m;++j)
                {
                    var index=i-j;
                    if (index<0) break;
                    var item=data[index];
                    if (this.IsNumber(item)) aryValue.push({ Value:item, Period:j });
                }

                if (aryValue.length>0)
                {
                    aryValue.sort(function(a,b) { return b.Value-a.Value;});
                    var index=t-1;
                    if (index<0) index=0;
                    else if (index>=aryValue.length) index=aryValue.length-1;
                    result[i]=aryValue[index].Period;
                }
            }
        }

        return result;
    }

    //N周期前的M周期内的第T个最小值到当前周期的周期数.
    //用法:FINDLOWBARS(VAR,N,M,T):VAR在N日前的M天内第T个最低价到当前周期的周期数.
    this.FINDLOWBARS=function(data, n, m, t)
    {
        if (this.IsNumber(data)) return (m-n-t);
        
        var result=[];
        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                result[i]=null;
                var aryValue=[];
                for(var j=n;j<m;++j)
                {
                    var index=i-j;
                    if (index<0) break;
                    var item=data[index];
                    if (this.IsNumber(item)) aryValue.push({ Value:item, Period:j });
                }

                if (aryValue.length>0)
                {
                    aryValue.sort(function(a,b) { return a.Value-b.Value;});
                    var index=t-1;
                    if (index<0) index=0;
                    else if (index>=aryValue.length) index=aryValue.length-1;
                    result[i]=aryValue[index].Period;
                }
            }
        }

        return result;
    }

    //求高值名次.
    //用法:HOD(X,N):求当前X数据是N周期内的第几个高值,N=0则从第一个有效值开始.
    //例如:HOD(HIGH,20)返回是20日的第几个高价
    this.HOD=function(data, n)
    {
        var result=[];
        if (IFrameSplitOperator.IsNumber(data)) return 1;

        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                var value=data[i];
                if (!IFrameSplitOperator.IsNumber(value)) continue;
                if (Array.isArray(n)) var subCount=parseInt(n[i]);
                else var subCount=parseInt(n);
                if (n<=0) subCount=i;
                var index=1;
                for(var j=i-1, k=1; j>=0 && k<subCount; --j, ++k)
                {
                    var item=data[j];
                    if (IFrameSplitOperator.IsNumber(item) && item>value) ++index;
                }

                result[i]=index;
            }
        }

        return result;
    }

    //求低值名次.
    //用法:LOD(X,N):求当前X数据是N周期内的第几个低值,N=0则从第一个有效值开始.
    //例如:LOD(LOW,20)返回是20日的第几个低价
    this.LOD=function(data, n)
    {
        var result=[];
        if (IFrameSplitOperator.IsNumber(data)) return 1;

        if (Array.isArray(data))
        {
            var count=data.length;
            for(var i=count-1;i>=0;--i)
            {
                var value=data[i];
                if (!IFrameSplitOperator.IsNumber(value)) continue;
                if (Array.isArray(n)) var subCount=parseInt(n[i]);
                else var subCount=parseInt(n);
                if (n<=0) subCount=i;
                var index=1;
                for(var j=i-1, k=1; j>=0 && k<subCount; --j, ++k)
                {
                    var item=data[j];
                    if (IFrameSplitOperator.IsNumber(item) && item<value) ++index;
                }

                result[i]=index;
            }
        }

        return result;
    }

    //属于未来函数,下一次条件成立到当前的周期数.
    //用法:BARSNEXT(X):下一次X不为0到现在的天数
    //例如:BARSNEXT(CLOSE/REF(CLOSE,1)>=1.1)表示下一个涨停板到当前的周期数
    this.BARSNEXT=function(data)
    {
        if (!Array.isArray(data)) return 0;

        var result=[];

        for(var i=0;i<data.length;++i)
        {
            result[i]=0;
            for(var j=i, k=0;j<data.length;++j, ++k)
            {
                var item=data[j];
                if (item>0) 
                {
                    result[i]=k;
                    break;
                }
            }
        }


        return result;
    }

    //取随机数.
    //用法:RAND(N),返回一个范围在1-N的随机整数
    this.RAND=function(n)
    {
        if (Array.isArray(n))
        {
            var result=[];
            for(var i in n)
            {
                result[i]=null;
                var item=n[i];
                var value=parseInt(item);
                if (value<=0) continue;

                result[i]=Math.ceil(Math.random()*value);
            }

            return result;
        }
        else
        {
            var value=parseInt(n);
            if (value<=0) return null;

            var stockData= this.SymbolData.Data;
            var count=stockData.Data.length;
            var result=[];
            for(var i=0;i<count;++i)
            {
                result[i]=Math.ceil(Math.random()*value);
            }
            
            return result;
        }
    }

    //求自适应均线值.
    //用法:AMA(X,A),A为自适应系数,必须小于1.
    //算法:Y=Y'+A*(X-Y').初值为X
    this.AMA=function(data,n)
    {
        var result=[];
        var period;
        if (Array.isArray(n))
        {
            //取最新的一个数据做为自适应系数
            for(var i=data.length-1;i>=0;--i)
            {
                if (this.IsNumber(n[i]))
                {
                    period=n[i];
                    break;
                }
            }
        }
        else 
        {
            period=n;
        }
        
        if (this.IsNumber(period))
        {
            if (period>1) return result;
            var index=0;
            var value=0;
            for(index;index<data.length;++index)
            {
                result[index]=null;
                if (this.IsNumber(data[index]))
                {
                    value=data[index];
                    result[index]=value;
                    break;
                }
            }

            for(var i=index+1;i<data.length;++i)
            {
                var item=data[i];
                result[i]=result[i-1]+period*(item-result[i-1]);
            }
        }
        
        return result;
    }

    //返回移动平均
    //用法:TMA(X,A,B),A和B必须小于1,算法	Y=(A*Y'+B*X),其中Y'表示上一周期Y值.初值为X
    this.TMA=function(data, a, b)
    {
        var result=[];
        if (this.IsNumber(a) && a<=1 && this.IsNumber(b) && b<1)
        {
            var bFirstFind=false;
            var proValue;   //上一个值
            for(var i in data)
            {
                result[i]=null;
                if (bFirstFind==false)
                {
                    var item=data[i];
                    if (this.IsNumber(item))
                    {
                        result[i]=item;
                        proValue=result[i];
                        bFirstFind=true;
                    }
                }
                else
                {
                    var item=data[i];
                    if (!this.IsNumber(item)) continue;
                    result[i]=a*result[i-1]+b*item;
                    proValue=result[i];
                }
            }
        }

        return result;
    }

    this.ROUND=function(data)
    {
        if (this.IsNumber(data))
        {
            return Math.round(data);
        }
        
        var result=[];
        if (Array.isArray(data))
        {
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item)) 
                    result[i]=Math.round(item);
                else
                    result[i]=null;
            }
        }

        return result;
    }

    this.ROUND2=function(data,n)
    {
        var ROUND2_SEED=
        [
            1,10,100,1000,
            10000,
            100000,
            1000000,
            10000000,
            100000000,
            1000000000,
            10000000000,
            100000000000,
            1000000000000
        ];
        var decimal=0;
        if (this.IsNumber(n)) decimal=parseInt(n);
        if (n<0) decimal=0;
        else if (n>=ROUND2_SEED.length) decimal=ROUND2_SEED.length-1;

        if (this.IsNumber(data))
        {
            return Math.round(data*ROUND2_SEED[decimal])/ROUND2_SEED[decimal];
        }

        var result=[];
        if (Array.isArray(data))
        {
            for(var i in data)
            {
                var item=data[i];
                if (this.IsNumber(item))
                {
                    result[i]=Math.round(item*ROUND2_SEED[decimal])/ROUND2_SEED[decimal];
                }
                else
                {
                    result[i]=null;
                }
            }
        }

        return result;
    }

    /* 文华
    TRMA(X,N)： 求X在N个周期的三角移动平均值。

    算法：三角移动平均线公式，是采用算数移动平均，并且对第一个移动平均线再一次应用算数移动平均。
    TRMA(X,N) 算法如下
    ma_half= MA(X,N/2)
    trma=MA(ma_half,N/2)

    注：
    1、N包含当前k线。
    2、当N为有效值，但当前的k线数不足N根，函数返回空值。
    3、N为0或空值的情况下，函数返回空值。

    例1：
    TRMA5:TRMA(CLOSE,5);//计算5个周期内收盘价的三角移动平均。(N不能被2整除)
    //TRMA(CLOSE,5)=MA(MA(CLOSE,(5+1)/2)),(5+1)/2);
    例2:
    TRMA10:TRMA(CLOSE,10);// 计算10个周期内收盘价的三角移动平均。(N能被2整除)
    TRMA(CLOSE,10)=MA(MA(CLOSE,10/2),(10/2)+1));
    */

    this.TRMA=function(data,n)
    {
        if (!this.IsNumber(n) || n<=0) return [];
        n=parseInt(n);
        var nFalf=0,nFalf2=0;
        if (n%2==0) 
        {
            nFalf=parseInt(n/2);
            nFalf2=nFalf+1;
        }
        else 
        {
            nFalf=parseInt((n+1)/2);
            nFalf2=nFalf;
        }

        var maFalf=this.MA(data,nFalf);
        var result=this.MA(maFalf,nFalf2);
        return result;
    }

    //VALUEWHEN(COND,X) 
    //当COND条件成立时,取X的当前值,否则取VALUEWHEN的上个值.
    this.VALUEWHEN=function(cond,data)
    {
        if (Array.isArray(cond))
        {
            var result=[];
            if (Array.isArray(data))
            {
                var preValue=null;
                for(var i in cond)
                {
                    if (i>=data.length)
                    {
                        result[i]=preValue;
                        continue;
                    }

                    var item=data[i];
                    if (cond[i])
                    {
                        result[i]=item;
                        preValue=item;
                    }
                    else
                    {
                        result[i]=preValue;
                    }
                }
            }
            else
            {
                var preValue=null;
                for(var i in cond)
                {
                    if (cond[i]) 
                    {
                        result[i]=data;
                        preValue=data;
                    }
                    else
                    {
                        result[i]=preValue;
                    }
                }
            }

            return result;
        }
        else
        {
            return cond? 1:0;
        }
    }

    /*
    HARMEAN(X,N) 求X在N个周期内的调和平均值。

    算法举例：HARMEAN(X,5)=1/[(1/X1+1/X2+1/X3+1/X4+1/X5)/5]

    注：
    1、N包含当前k线。
    2、调和平均值与倒数的简单平均值互为倒数。
    3、当N为有效值，但当前的k线数不足N根，函数返回空值。
    4、N为0或空值的情况下，函数返回空值。
    5、X为0或空值的情况下，函数返回空值。
    6、N可以为变量。

    例：HM5:=HARMEAN(C,5);//求5周期收盘价的调和平均值。
    */
    this.HARMEAN=function(data, n)
    {
        var result=[];

        if (Array.isArray(data))
        {
            if (Array.isArray(n))
            {
                for(var i=0;i<data.length;++i)
                {
                    if (i>=n.length) 
                    {
                        result[i]=null;
                        continue;
                    }

                    var count=parseInt(n[i]);
                    if (count<=0 || count>i) 
                    {
                        result[i]=null;
                        continue;
                    }

                    var sum=0;
                    for(var j=0;j<count;++j)
                    {
                        var item=data[i-j];
                        if (!this.IsNumber(item) || item==0)
                        {
                            sum=null;
                            break;
                        }

                        sum+=1/item;
                    }

                    if (sum==null)
                    {
                        result[i]=null;
                    }
                    else
                    {
                        result[i]=1/(sum/count);
                    }
                }
            }
            else if (this.IsNumber(n))
            {
                n=parseInt(n);
                if (n<=0) return result;

                for(var i=0;i<data.length;++i)
                {
                    if (n>i) 
                    {
                        result[i]=null;
                        continue;
                    }

                    var sum=0;
                    for(var j=0;j<n;++j)
                    {
                        var item=data[i-j];
                        if (!this.IsNumber(item) || item==0)
                        {
                            sum=null;
                            break;
                        }

                        sum+=1/item;
                    }

                    if (sum==null)
                    {
                        result[i]=null;
                    }
                    else
                    {
                        result[i]=1/(sum/n);
                    }
                }
            }
        }

        return result;
    }

    //指定日期到1990.12.19的天数.
    //用法: DATETODAY(date)
    //DATETODAY(date).返回date到1990.12.19的天数.有效日期为(901219-1341231)
    //例如: DATETODAY(901219)返回0.
    this.DATETODAY=function(data)
    {
        var result=[];
        var startDate=new Date('1990-12-19')
        var startValue=19901219;
        var ONE_DAY=1000 * 60 * 60 * 24
        if (Array.isArray(data))
        {
            for(var i in data)
            {
                result[i]=null;
                var item=data[i];
                if (!this.IsNumber(item)) continue;
                var value=item+19000000;
                if (value<startValue) continue;
                var year=parseInt(value/10000);
                var month=parseInt((value%10000)/100);
                var day=parseInt(value%100);
                var dateItem=new Date(`${year}-${month}-${day}`);
                result[i]=Math.round((dateItem-startDate)/ONE_DAY);
            }
        }
        else if (this.IsNumber(data))
        {
            var value=data+19000000;
            if (value>=startValue)
            {
                var year=parseInt(value/10000);
                var month=parseInt((value%10000)/100);
                var day=parseInt(value%100);
                var dateItem=new Date(`${year}-${month}-${day}`);
                return Math.round((dateItem-dateItem)/ONE_DAY);
            }
        }

        return result;
    }

    //求1990.12.19后第若干天的日期.
    //用法:DAYTODATE(N)
    //DAYTODATE(N).返回1990.12.19后第N天的日期.有效天数为(0-20000)
    //例如:DAYTODATE(0)返回901219.
    this.DAYTODATE=function(data)
    {
        var startDate=new Date('1990-12-19')
        var result=[];

        if (Array.isArray(data))
        {
            for(var i in data)
            {
                result[i]=null;
                var item=data[i];
                if (!this.IsNumber(item)) continue;
                startDate.setDate(startDate.getDate()+item);
                var value=startDate.getFullYear()*10000+(startDate.getMonth()+1)*100+startDate.getDate();
                value-=19000000;
                result[i]=value;
                startDate.setDate(startDate.getDate()-item);
            }
        }
        else if (this.IsNumber(data))
        {
            startDate.setDate(startDate.getDate()+data);
            var value=startDate.getFullYear()*10000+(startDate.getMonth()+1)*100+startDate.getDate();
            value-=19000000;
            return value;
        }

        return result;
    }

    /*
    求指定时刻距0时有多长时间.
    用法:
    TIMETOSEC(time)
    TIMETOSEC(time).返回time时刻距0时有多长时间,单位为秒.有效时间为(0-235959)
    例如:
    TIMETOSEC(93000)返回34200.
    */
    this.TIMETOSEC=function(time)
    {
        var hour=parseInt(time/10000);
        var minute=parseInt((time%10000)/100);
        var sec=time%100;

        var value=hour*60*60+minute*60+sec;

        return value;
    }

    /*
    求0时后若干秒是什么时间.
    用法:
    SECTOTIME(N)
    SECTOTIME(N).返回0时后N秒是什么时间.有效秒数为(0-86399)
    例如:
    SECTOTIME(34200)返回93000.
    */
    this.SECTOTIME=function(data)
    {
        var daySec = 24 *  60 * 60;
        var hourSec=  60 * 60;
        var minuteSec=60;
        var dd = Math.floor(data / daySec);
        var hh = Math.floor((data % daySec) / hourSec);
        var mm = Math.floor((data % hourSec) / minuteSec);
        var ss=data%minuteSec;

        var value=hh*10000+mm*100+ss;
        return value;
    }

    //用法:ANY(CLOSE>OPEN,10),表示前10日内存在着阳线
    this.ANY=function(data, n)
    {
        if (n<=0) n=1;

        var result=[];
        if (Array.isArray(data))
        {
            if (n>=data.length) return 0;

            for(var i=n, j=0;i<data.length;++i)
            {
                var value=0;
                for(j=0;j<n;++j)
                {
                    var item=data[i-j];
                    if (item>0)
                    {
                        value=1;
                        break;
                    }
                }

                result[i]=value;
            }

            return result;
        }
        else if (IFrameSplitOperator.IsNumber(data))
        {
            if (data<=0) return 0;
            if (n>=this.SymbolData.Data.Data.length) return 0;

            for(var i=n; i<this.SymbolData.Data.Data.length; ++i)
            {
                result[i]=1;
            }
            return result;
        }
        else
        {
            return 0;
        }
    }

    //用法:ALL(CLOSE>OPEN,10),表示前10日内一直阳线
    this.ALL=function(data, n)
    {
        if (n<=0) n=1;

        var result=[];
        if (Array.isArray(data))
        {
            if (n>=data.length) return 0;

            for(var i=n, j=0;i<data.length;++i)
            {
                var value=1;
                for(j=0;j<n;++j)
                {
                    var item=data[i-j];
                    if (!(item>0))
                    {
                        value=0;
                        break;
                    }
                }

                result[i]=value;
            }

            return result;
        }
        else if (IFrameSplitOperator.IsNumber(data))
        {
            if (data<=0) return 0;
            if (n>=this.SymbolData.Data.Data.length) return 0;

            for(var i=n; i<this.SymbolData.Data.Data.length; ++i)
            {
                result[i]=1;
            }
            
            return result;
        }
        else
        {
            return 0;
        }
    }

    /*
    TESTSKIP(A):满足A则直接返回.
    用法:
    TESTSKIP(A) 
    表示如果满足条件A则该公式直接返回,不再计算接下来的表达式 注意:A为非序列数据,只取最后一个数据
    */
    this.TESTSKIP=function(data, node)
    {
        if (Array.isArray(data))
        {
            if (data.length<=0) return false;
            var item=data[data.length-1];
            if (!item) return false;

            return true;
        }
        else if (IFrameSplitOperator.IsNumber(data))
        {
            if (data<=0) return false;
            return true;
        }
        else
        {
            if (!data) return false;
            return true;
        }
    }

    /*根据条件执行不同的语句,可中止(根据序列的最后一个数值来判断).
    用法:
    IFC(X,A,B)若X不为0则执行A,否则执行B.IFC与IF函数的区别:根据X的值来选择性执行A、B表达式.
    例如:
    IFC(CLOSE>OPEN,HIGH,TESTSKIP(1));L;表示当日收阳则返回最高值,并执行下一句"L;",否则退出公式计算
    */
    this.IFC=function(data)
    {
        if (Array.isArray(data))
        {
            var item=data[data.length-1];
            if (IFrameSplitOperator.IsNumber(item)) return item>0;
            return false;
        }
        else if (IFrameSplitOperator.IsNumber(data))
        {
            return data>0;
        }
        else
        {
            return false;
        }
    }

    /*
    有效数据右对齐.
    用法:
    ALIGNRIGHT(X)有效数据向右移动,左边空出来的周期填充无效值
    例如:TC:=IF(CURRBARSCOUNT=2 || CURRBARSCOUNT=5,DRAWNULL,C);XC:ALIGNRIGHT(TC);删除了两天的收盘价,并将剩余数据右移
    */
    this.ALIGNRIGHT=function(data)
    {
        if (Array.isArray(data))
        {
            var result=[];
            var index=data.length-1;
            for(var i=data.length-1;i>=0;--i)
            {
                var item=data[i];
                if (IFrameSplitOperator.IsNumber(item) || IFrameSplitOperator.IsString(item))
                {
                    result[index]=item;
                    --index;
                }
            }

            for(var i=index;i>=0;--i)
            {
                result[i]=null;
            }

            return result;
        }
        else
        {
            return data;
        }
    }

    /*
    向前累加到指定值到现在的周期数.
    用法:
    SUMBARS(X,A):将X向前累加直到大于等于A,返回这个区间的周期数,若所有的数据都累加后还不能达到A,则返回此时前面的总周期数.
    例如:SUMBARS(VOL,CAPITAL)求完全换手到现在的周期数
    */
    this.SUMBARS=function(data, data2)
    {
        var isArray=Array.isArray(data);
        var isArray2=Array.isArray(data2);
        var isNumber=IFrameSplitOperator.IsNumber(data);
        var isNumber2=IFrameSplitOperator.IsNumber(data2);

        var result=[];
        if (isArray && isNumber2)
        {
            for(var i=0, n=0;i<data.length;++i)
            {
                var sum=0;
                var n=0;
                for(var j=i-1; j>=0; --j, ++n)
                {
                    var item=data[i];
                    if (!IFrameSplitOperator.IsNumber(item)) continue;

                    sum+=data[j];
                    if (sum>data2)
                    {
                        break;
                    }
                }

                result[i]=n;
            }
        }
        else if (isArray && isArray2)
        {
            var count=Math.max(data.length, data2.length);
            for(var i=0;i<count;++i)
            {
                result[i]=null;
                var sum=0;
                var n=0;
                var value=data2[i];
                if (!IFrameSplitOperator.IsNumber(value)) continue;

                for(var j=i-1; j>=0; --j,++n)
                {
                    var item=data[i];
                    if (!IFrameSplitOperator.IsNumber(item)) continue;
                    sum+=data[j];
                    if (sum>value)
                    {
                        break;
                    }
                }

                result[i]=n;
            }
        }
        else if (isNumber && isArray2)
        {
            for(var i=0;i<data2.length;++i)
            {
                result[i]=null;
                var sum=0;
                var n=0;
                var value=data2[i];
                if (!IFrameSplitOperator.IsNumber(value)) continue;
                for(var j=i-1; j>=0; --j, ++n)
                {
                    sum+=data;
                    if (sum>value)
                    {
                        break;
                    }
                }

                result[i]=n;
            }
        }
        else if (isNumber && isNumber2)
        {
            //TODO: 后面再写吧
        }


        return result;
    }


    //格式化字符串 "{0}-{1}", C, O;  小数位数 {0:0.00}
    this.STRFORMAT=function(strFormat,args,node)
    {
        var aryParam=strFormat.match(/{[0-9.:]+}/g);

        if (!IFrameSplitOperator.IsNonEmptyArray(aryParam)) return null;

        var mapParam=new Map(); //key=index, value={Text}
        var maxIndex=-1;
        for(var i=0;i<aryParam.length;++i)
        {
            var item=aryParam[i];
            if (item.length<3) continue;

            var value=item.slice(1, item.length-1);
            var index=-1,decimal=-1;
            if (value.indexOf(":")>0)
            {
                var aryTemp=value.split(":");
                if (aryTemp)
                {
                    if (aryTemp[0])
                        index=parseInt(aryTemp[0]);

                    if (aryTemp[1])
                    {
                        if (aryTemp[1].indexOf(".")>=0)
                        {
                            var zeroCount=0;
                            var strTemp=aryTemp[1];
                            for(var j=strTemp.length-1; j>=0; --j)
                            {
                                if (strTemp[j]=="0") ++zeroCount;
                                else break;
                            }
    
                            if (zeroCount>0) decimal=zeroCount;
                        }
                        else if (aryTemp[1]=="0")
                        {
                            decimal=0;
                        }
                    }
                    
                }
                
            }
            else
            {
                index=parseInt(value);
            }

            if (index<0) continue;

            var paramItem={ Src:item, Index:index, Text:null, Decimal:null };
            if (decimal>=0) paramItem.Decimal=decimal;

            if (maxIndex<index) maxIndex=index;

            mapParam.set(index, paramItem);
        }

        var isArray=false;  //是否输出数组字符串
        var maxCount=0;
        for(var i=1;i<args.length;++i)
        {
            var item=args[i];
            if (Array.isArray(item))
            {
                isArray=true;
                if (maxCount<item.length) maxCount=item.length;
            }
        }

        if (isArray)
        {
            var result=[];

            for(var i=0;i<maxCount;++i)
            {
                var strItem=strFormat;
                
                for(var item of mapParam)
                {
                    var paramInfo=item[1];
                    var paramItem=args[paramInfo.Index+1];
                    var text="null";
                    if (paramItem)
                    {
                        if (Array.isArray(paramItem))
                        {
                            var value=paramItem[i];
                            if (value) 
                            {
                                if (IFrameSplitOperator.IsNumber(paramInfo.Decimal))
                                    text=`${value.toFixed(paramInfo.Decimal)}`;
                                else
                                    text=`${value}`;
                            }
                        }
                        else
                        {
                            text=`${paramItem}`;
                        }
                    }

                    strItem=strItem.replace(paramInfo.Src, text);
                }

                result[i]=strItem;
            }

            return result;
        }
        else
        {
            var result=strFormat;

            for(var item of mapParam)
            {
                var paramInfo=item[1];
                var paramItem=args[paramInfo.Index+1];
                var text="null";
                if (paramItem)
                {
                    text=`${paramItem}`;
                }

                result=result.replace(paramInfo.Src, text);
            }

            return result;
        }
    }

    //函数调用
    this.CallFunction=function(name,args,node,symbolData)
    {
        switch(name)
        {
            case 'MAX':
            case "MAX6":
                return this.MAX(args,node);
            
            case 'MIN':
            case "MIN6":
                return this.MIN(args,node);
            case 'REF':
                return this.REF(args[0], args[1]);
            case "REFV":
                return this.REFV(args[0], args[1]);
            case 'REFX':
                return this.REFX(args[0], args[1]);
            case "REFXV":
                return this.REFXV(args[0], args[1]);
            case "REFX1":   //文华函数
                return this.REFX(args[0], args[1]);
            case 'ABS':
                return this.ABS(args[0]);
            case 'MA':
                return this.MA(args[0], args[1]);
            case "EMA":
                return this.EMA(args[0], args[1]);
            case "SMA":
                return this.SMA(args[0], args[1],args[2]);
            case "DMA":
                return this.DMA(args[0], args[1]);
            case "XMA":
                return this.XMA(args[0], args[1]);
            case 'EXPMA':
                return this.EXPMA(args[0], args[1]);
            case 'EXPMEMA':
                return this.EXPMEMA(args[0], args[1]);
            case 'COUNT':
                return this.COUNT(args[0], args[1]);
            case 'LLV':
                return this.LLV(args[0], args[1]);
            case "LV":
                return this.LV(args[0], args[1]);
            case 'LLVBARS':
                return this.LLVBARS(args[0], args[1]);
            case 'HHV':
                return this.HHV(args[0], args[1]);
            case 'HV':
                return this.HV(args[0], args[1]);
            case 'HHVBARS':
                return this.HHVBARS(args[0], args[1]);
            case 'MULAR':
                return this.MULAR(args[0], args[1]);
            case 'CROSS':
                return this.CROSS(args[0], args[1]);
            case 'LONGCROSS':
                return this.LONGCROSS(args[0], args[1], args[2]);
            case "ISVALID":
                return this.ISVALID(args[0]);
            case "CROSSDOWN":
                return this.CROSSDOWN(args[0], args[1]);
            case "CROSSUP":
                return this.CROSSUP(args[0], args[1]);
            case 'AVEDEV':
                return this.AVEDEV(args[0], args[1]);
            case 'STD':
                return this.STD(args[0], args[1]);
            case "STDDEV":
                return this.STDDEV(args[0], args[1]);
            case 'IF':
            case 'IFF':
            case "IFELSE":
                return this.IF(args[0], args[1], args[2]);
            case 'IFN':
                return this.IFN(args[0], args[1], args[2]);
            case 'NOT':
                return this.NOT(args[0]);
            case 'SUM':
                return this.SUM(args[0], args[1]);
            case 'RANGE':
                return this.RANGE(args[0],args[1],args[2]);
            case 'EXIST':
                return this.EXIST(args[0],args[1]);
            case 'EXISTR':
                return this.EXISTR(args[0],args[1],args[2]);
            case 'FILTER':
                return this.FILTER(args[0],args[1]);
            case 'TFILTER':
                return this.TFILTER(args[0],args[1],args[2]);
            case "FILTERX":
                return this.FILTERX(args[0],args[1],node);
            case 'SLOPE':
                return this.SLOPE(args[0],args[1]);
            case 'BARSLAST':
                return this.BARSLAST(args[0]);
            case "BARSLASTS":
                //this.ThrowUnexpectedNode(node,`函数'BARSLASTS'还在开发中`, name);
                return this.BARSLASTS(args[0],args[1],node);
            case 'BARSCOUNT':
                return this.BARSCOUNT(args[0]);
            case 'BARSSINCEN':
                return this.BARSSINCEN(args[0],args[1]);
            case 'BARSSINCE':
                return this.BARSSINCE(args[0]);
            case 'LAST':
                return this.LAST(args[0],args[1],args[2]);
            case 'EVERY':
                return this.EVERY(args[0],args[1]);
			case 'DEVSQ':
                return this.DEVSQ(args[0], args[1]);
            case 'ZIG':
                return this.ZIG(args[0],args[1]);
            case 'TROUGHBARS':
                return this.TROUGHBARS(args[0],args[1],args[2]);
            case "TROUGH":
                return this.TROUGH(args[0],args[1],args[2]);
            case 'PEAKBARS':
                return this.PEAKBARS(args[0],args[1],args[2]);
            case 'PEAK':
                return this.PEAK(args[0],args[1],args[2]);
            case 'COST':
                return this.COST(args[0]);
            case 'WINNER':
                return this.WINNER(args[0],node);
            case 'PPART':
                return this.PPART(args[0],node);
            case "COSTEX":
                return this.COSTEX(args[0],args[1],node);
            case "LWINNER":
                return this.LWINNER(args[0],args[1],node);
            case "PWINNER":
                return this.PWINNER(args[0],args[1],node);
            case 'FORCAST':
                return this.FORCAST(args[0], args[1]);
            case "TSMA":
                return this.TSMA(args[0], args[1]);
            case 'STDP':
                return this.STDP(args[0], args[1]);
            case 'VAR':
                return this.VAR(args[0], args[1]);
            case 'VARP':
                return this.VARP(args[0], args[1]);
            case 'UPNDAY':
                return this.UPNDAY(args[0],args[1]);
            case 'DOWNNDAY':
                return this.DOWNNDAY(args[0],args[1]);
            case 'NDAY':
                return this.NDAY(args[0],args[1],args[2]);
            case 'RELATE':
                return this.RELATE(args[0],args[1],args[2]);
            case 'COVAR':
                return this.COVAR(args[0],args[1],args[2]);
            case 'BETA':
                return this.BETA(args[0]);
            case 'BETA2':
                return this.BETA2(args[0],args[1],args[2]);
            case 'WMA':
                return this.WMA(args[0], args[1]);
            case 'MEMA':
                return this.MEMA(args[0], args[1]);
            case 'SUMBARS':
                return this.SUMBARS(args[0], args[1]);
            case 'REVERSE':
                return this.REVERSE(args[0]);
            case 'SAR':
                return this.SAR(args[0], args[1], args[2]);
            case 'SARTURN':
                return this.SARTURN(args[0], args[1], args[2]);
            case 'BACKSET':
                return this.BACKSET(args[0], args[1]);
            case 'BETWEEN':
                return this.BETWEEN(args[0], args[1], args[2]);
            case 'STRCAT':
                return this.STRCAT(args[0], args[1]);
            case 'CON2STR':
                return this.CON2STR(args[0], args[1]);
            case "VAR2STR":
                return this.VAR2STR(args[0], args[1]);
            case "VARCAT":
                return this.VARCAT(args[0], args[1]);
            case "STRSPACE":
                return this.STRSPACE(args[0]);
            case "FINDSTR":
                return this.FINDSTR(args[0], args[1]);
            case "STRCMP":
                return this.STRCMP(args[0], args[1]);
            case "STRLEN":
                return this.STRLEN(args[0]);
            case "STRFORMAT":
                return this.STRFORMAT(args[0], args, node);
            case 'DTPRICE':
                return this.DTPRICE(args[0], args[1]);
            case 'ZTPRICE':
                return this.ZTPRICE(args[0], args[1]);
            case 'MOD':
                return this.MOD(args[0],args[1]);
            case 'POW':
                return this.POW(args[0],args[1]);
            case 'CEILING':
                return this.CEILING(args[0]);
            case 'FLOOR':
                return this.FLOOR(args[0]);
            case 'FRACPART':
                return this.FRACPART(args[0]);
            case "SIGN":
                return this.SIGN(args[0]);
            case 'BARSLASTCOUNT':
                return this.BARSLASTCOUNT(args[0]);
            case 'INTPART':
                return this.INTPART(args[0]);
            case "CONST":
                return this.CONST(args[0]);
            case "TOPRANGE":
                return this.TOPRANGE(args[0]);
            case "LOWRANGE":
                return this.LOWRANGE(args[0]);
            case "FINDLOW":
                return this.FINDLOW(args[0],args[1],args[2],args[3]);
            case "FINDLOWBARS":
                return this.FINDLOWBARS(args[0],args[1],args[2],args[3]);
            case "FINDHIGH":
                return this.FINDHIGH(args[0],args[1],args[2],args[3]);
            case "FINDHIGHBARS":
                return this.FINDHIGHBARS(args[0],args[1],args[2],args[3]);
            case "BARSNEXT":
                return this.BARSNEXT(args[0]);

            case "HOD":
                return this.HOD(args[0], args[1]);
            case "LOD":
                return this.LOD(args[0], args[1]);
            case "AMA":
                return this.AMA(args[0], args[1]);
            case "TMA":
                return this.TMA(args[0],args[1],args[2]);
            case "ROUND":
                return this.ROUND(args[0]);
            case "ROUND2":
                return this.ROUND2(args[0],args[1]);
            case "TRMA":
                return this.TRMA(args[0],args[1]);
            case "VALUEWHEN":
                return this.VALUEWHEN(args[0],args[1]);
            case "HARMEAN":
                return this.HARMEAN(args[0],args[1]);
            case "DATETODAY":
                return this.DATETODAY(args[0]);
            case "DAYTODATE":
                return this.DAYTODATE(args[0]);
            case "TIMETOSEC":
                return this.TIMETOSEC(args[0]);
            case "SECTOTIME":
                return this.SECTOTIME(args[0]);

            case "ANY":
                return this.ANY(args[0],args[1]);
            case "ALL":
                return this.ALL(args[0],args[1]);

            case "TESTSKIP":
                return this.TESTSKIP(args[0],node);

            case "SUMBARS":
                return this.SUMBARS(args[0],args[1]);
            case "ALIGNRIGHT":
                return this.ALIGNRIGHT(args[0]);
          
            //三角函数
            case 'ATAN':
                return this.Trigonometric(args[0],Math.atan);
            case 'ACOS':
                return this.ACOS(args[0]);
            case 'ASIN':
                return this.ASIN(args[0]);
            case 'COS':
                return this.Trigonometric(args[0],Math.cos);
            case 'SIN':
                return this.Trigonometric(args[0],Math.sin);
            case 'TAN':
                return this.Trigonometric(args[0],Math.tan);
            case 'LN':
                return this.Trigonometric(args[0],Math.log);
            case 'LOG':
                return this.Trigonometric(args[0],Math.log10);
            case 'EXP':
                return this.Trigonometric(args[0],Math.exp);
            case 'SQRT':
                return this.Trigonometric(args[0],Math.sqrt);
            case "RAND":
                return this.RAND(args[0]);
            default:
                this.ThrowUnexpectedNode(node,'函数'+name+'不存在', name);
        }
    }

    //调用自定义函数 返回数据格式{Out:输出数据, Draw:绘图数据(可选)}
    this.CallCustomFunction=function(name, args, symbolData, node)
    {
        var functionInfo=g_JSComplierResource.CustomFunction.Data.get(name);
        var dwonloadData=symbolData.GetStockCacheData({ CustomName:name, Node:node });
        if (!functionInfo.Invoke)
            return { Out: dwonloadData }

        JSConsole.Complier.Log('[JSAlgorithm::CallCustomFunction] call custom function functionInfo=',functionInfo);

        var self=this;
        var obj=
        {
            Name:name,
            Args:args,
            Symbol:symbolData.Symbol, Period:symbolData.Period, Right:symbolData.Right, 
            KData:symbolData.Data,  //K线数据
            DownloadData:dwonloadData,
            ThrowError:function(error)
            {
                self.ThrowUnexpectedNode(node, error);
            }
        };

        return functionInfo.Invoke(obj);
    }

    this.ThrowUnexpectedNode=function(node,message,word)
    {
        let marker=node.Marker;
        let msg=message || "执行异常";
       
        return this.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg,word);
       
    }
}

//是否有是有效的数字
JSAlgorithm.prototype.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//是否有是有效的除数
JSAlgorithm.prototype.IsDivideNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;
    if (value==0) return false;

    return true;
}

//取模
JSAlgorithm.MOD=function(number,divisor)
{
    if( (number < 0 && divisor < 0) || (number >=0 && divisor >= 0))     //同号
    {   
        if(parseInt(number) == number && parseInt(divisor) == divisor)  //全为整数
        {        
            return number%divisor;
        }
        else  //被除数-(整商×除数)之后在第一位小数位进行四舍五入
        {
            var value = parseFloat((number - (Math.floor(number/divisor) * divisor)).toFixed(1));
            return value;
        }
    }
    else    //异号
    {   
        var absNumber = Math.abs(number);        //绝对值
        var absDivisor = Math.abs(divisor);      //绝对值
        var value = Math.abs(Math.abs(divisor) * (Math.floor(absNumber/absDivisor) + 1) - Math.abs(number));
        if(divisor < 0) value = -value
        return value;
    }     
}

/*
   绘图函数 
*/
function JSDraw(errorHandler,symbolData)
{
    this.ErrorHandler=errorHandler;
    this.SymbolData=symbolData;

    this.DRAWTEXT=function(condition,price,text)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWTEXT',Text:text};

        if (Array.isArray(condition))
        {
            if (condition.length<=0) return result;

            var IsNumber=this.IsNumber(price);
            var isFixedPosition=false;
            if (price==="TOP"|| price==="BOTTOM")
            {
                result.FixedPosition=price;
                isFixedPosition=true;
            }
            
            for(var i in condition)
            {
                drawData[i]=null;
    
                if (isNaN(condition[i]) || !condition[i]) continue;
    
                if (IsNumber || isFixedPosition) 
                {
                    drawData[i]=price;
                }
                else 
                {
                    if (this.IsNumber(price[i])) drawData[i]=price[i];
                }
            }
        }
        else if (this.IsNumber(condition) && condition)
        {
            var IsNumber=this.IsNumber(price);
            var isFixedPosition=false;
            if (price==="TOP"|| price==="BOTTOM")
            {
                result.FixedPosition=price;
                isFixedPosition=true;
            }

            for(var i=0;i<this.SymbolData.Data.Data.length;++i)
            {
                if (IsNumber || isFixedPosition) 
                {
                    drawData[i]=price;
                }
                else 
                {
                    if (this.IsNumber(price[i])) drawData[i]=price[i];
                }
            }
        }
        
        return result;
    }

    this.DRAWTEXT_FIX=function(condition,x,y,type,text)
    {
        var drawData={ Value:[], Text:[]  };
        var result={DrawData:drawData, DrawType:'DRAWTEXT_FIX', Text:null, Position:{ X:x, Y:y, Type:type } };
        if (condition.length<=0) return result;

        if (Array.isArray(condition))
        {
            
            for(var i in condition)
            {
                drawData.Text[i]=null;
                drawData.Value[i]=0;
                if (isNaN(condition[i]) || !condition[i]) continue;
    
                drawData.Value[i]=1;
                drawData.Text[i]=text;
            }
        }
        else
        {
            if(condition) 
            {
                for(var i=0;i<this.SymbolData.Data.Data.length;++i)
                {
                    drawData.Text[i]=text;
                    drawData.Value[i]=1;
                }
            }
        }
        
        return result;
    }

    //direction 文字Y轴位置 0=middle 1=价格的顶部 2=价格的底部
    //offset 文字Y轴偏移
    this.SUPERDRAWTEXT=function(condition,price,text,direction,offset)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'SUPERDRAWTEXT',Text:text,YOffset:offset,Direction:direction,TextAlign:'center'};
        if (condition.length<=0) return result;

        var IsNumber=typeof(price)=="number";

        for(var i in condition)
        {
            drawData[i]=null;

            if (isNaN(condition[i]) || !condition[i]) continue;

            if (IsNumber) 
            {
                drawData[i]=price;
            }
            else 
            {
                if (this.IsNumber(price[i])) drawData[i]=price[i];
            }
        }

        return result;
    }

    /*
    STICKLINE 绘制柱线
    在图形上绘制柱线。
    用法：　STICKLINE(COND，PRICE1，PRICE2，WIDTH，EMPTY)，当COND条件满足时，在PRICE1和PRICE2位置之间画柱状线，宽度为WIDTH(10为标准间距)，EMPTH不为0则画空心柱。
    例如：　STICKLINE(CLOSE>OPEN，CLOSE，OPEN，0.8，1)表示画K线中阳线的空心柱体部分。
    */
    this.STICKLINE=function(condition,data,data2,width,type)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'STICKLINE',Width:width, Type:type};
        if (result.Width<0) result.Width=3;    //<0的宽度 使用K线宽度

        var IsNumber=typeof(data)=="number";
        var IsNumber2=typeof(data2)=="number";

        if (Array.isArray(condition))   //数组
        {
            if(condition.length<=0) return result;
            for(var i in condition)
            {
                drawData[i]=null;
    
                if (isNaN(condition[i]) || !condition[i]) continue;
    
                if (IsNumber && IsNumber2)
                {
                    drawData[i]={Value:data,Value2:data2};
                }
                else if (IsNumber && !IsNumber2)
                {
                    if (isNaN(data2[i])) continue;
                    drawData[i]={Value:data,Value2:data2[i]};
                }
                else if (!IsNumber && IsNumber2)
                {
                    if (isNaN(data[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2};
                }
                else
                {
                    if (isNaN(data[i]) || isNaN(data2[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2[i]};
                }
            }
        }
        else    //单值
        {
            if(!condition) return result;

            for(var i=0;i<this.SymbolData.Data.Data.length;++i) //以K线长度为数据长度
            {
                drawData[i]=null;

                if (IsNumber && IsNumber2)
                {
                    drawData[i]={Value:data,Value2:data2};
                }
                else if (IsNumber && !IsNumber2)
                {
                    if (!IFrameSplitOperator.IsNumber(data2[i])) continue;
                    drawData[i]={Value:data,Value2:data2[i]};
                }
                else if (!IsNumber && IsNumber2)
                {
                    if (!IFrameSplitOperator.IsNumber(data[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2};
                }
                else
                {
                    if (!IFrameSplitOperator.IsNumber(data[i]) || !IFrameSplitOperator.IsNumber(data2[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2[i]};
                }
            }
        }
   
        

        return result;
    }

    /*
    DRAWLINE 绘制直线段
    在图形上绘制直线段。
    用法：　DRAWLINE(COND1，PRICE1，COND2，PRICE2，EXPAND)
    当COND1条件满足时，在PRICE1位置画直线起点，当COND2条件满足时，在PRICE2位置画直线终点，EXPAND为延长类型。
    例如：　DRAWLINE(HIGH>=HHV(HIGH,20),HIGH,LOW<=LLV(LOW,20),LOW,1)　表示在创20天新高与创20天新低之间画直线并且向右延长。
    */
    this.DRAWLINE=function(condition,data,condition2,data2,expand)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWLINE', Expand:expand};

        if(condition.length<=0) return result;
        let count=Math.max(condition.length,condition2.length);

        let bFirstPoint=false;
        let bSecondPont=false;
        let lineCache={Start:{ },End:{ }, List:new Array()};

        for(let i=0;i<count;++i)
        {
            drawData[i]=null;
            if (i<condition.length && i<condition2.length)
            {
                if (bFirstPoint==false && bSecondPont==false)
                {
                    if (condition[i]==null || !condition[i]) continue;

                    bFirstPoint=true;
                    lineCache.Start={ID:i, Value:data[i]};  //第1个点
                }
                else if (bFirstPoint==true && bSecondPont==false)
                {
                    var bCondition2=(condition2[i]!=null && condition2[i]); //条件2
                    if (!bCondition2) 
                    {
                        if (condition[i] ) //条件1满足
                            lineCache.Start={ID:i, Value:data[i]};  //移动第1个点
                        continue;
                    }

                    if (bCondition2)
                    {
                        bSecondPont=true;
                        lineCache.End={ID:i, Value:data2[i]};   //第2个点
                    }
                }
                else if (bFirstPoint==true && bSecondPont==true)
                {
                    var bCondition2=(condition2[i]!=null && condition2[i]); //条件2
                    if (bCondition2)    //条件2满足
                    {
                        lineCache.End={ID:i, Value:data2[i]};   //移动第2个点
                    }
                    else if (condition[i])  //条件1满足
                    {
                        let lineData=this.CalculateDrawLine(lineCache);     //计算2个点的线上 其他点的数值

                        for(let j in lineData)
                        {
                            let item=lineData[j];
                            drawData[item.ID]=item.Value;
                        }

                        if (expand==1) this.CalculateDrawDataExtendLine(drawData, lineCache.Start.ID-2);//右延长线

                        bFirstPoint=bSecondPont=false;
                        lineCache={Start:{ },End:{ }};

                        bFirstPoint=true;
                        bSecondPont=false;
                        lineCache.Start={ID:i, Value:data[i]};  //第1个点
                    }
                }
            }

            //最后一组线
            if (bFirstPoint==true && bSecondPont==true)
            {
                let lineData=this.CalculateDrawLine(lineCache);     
                for(let j in lineData)
                {
                    let item=lineData[j];
                    drawData[item.ID]=item.Value;
                }
            }
        }

        if (expand==1) this.CalculateDrawDataExtendLine(drawData);//右延长线

        return result;
    }

    /*
    画出带状线.
    用法: DRAWBAND(VAL1,COLOR1,VAL2,COLOR2),当VAL1>VAL2时,在VAL1和VAL2之间填充COLOR1;当VAL1<VAL2时,填充COLOR2,这里的颜色均使用RGB函数计算得到.
    例如: DRAWBAND(OPEN,RGB(0,224,224),CLOSE,RGB(255,96,96));
    */
    this.DRAWBAND=function(data,color,data2,color2)
    {
        if (IFrameSplitOperator.IsNumber(color)) color=`rgb(${color},0,0)`;
        if (IFrameSplitOperator.IsNumber(color2)) color2=`rgb(${color2},0,0)`;
        var drawData=[];
        var result={DrawData:drawData, DrawType:'DRAWBAND', Color:[null, null]};  //颜色使用小写字符串
        if (color) result.Color[0]=color.toLowerCase();
        if (color2) result.Color[1]=color2.toLowerCase();

        var isNumber=IFrameSplitOperator.IsNumber(data);
        var isNumber2=IFrameSplitOperator.IsNumber(data2);
        if (!isNumber && !isNumber2)
        {
            var count=Math.max(data.length, data2.length);
            for(var i=0;i<count;++i)
            {
                var item={Value:null, Value2:null};
                if (i<data.length) item.Value=data[i];
                if (i<data2.length) item.Value2=data2[i];
                drawData.push(item);
            }
        }
        else if (isNumber && !isNumber2)
        {
            var count=data2.length;
            for(var i=0;i<count;++i)
            {
                var item={Value:data, Value2:null};
                if (i<data2.length) item.Value2=data2[i];
                drawData.push(item);
            }
        }
        else if (!isNumber && isNumber2)
        {
            var count=data.length;
            for(var i=0;i<count;++i)
            {
                var item={Value:null, Value2:data2};
                if (i<data.length) item.Value=data[i];
                drawData.push(item);
            }
        }
        else if (isNumber && isNumber2)
        {
            var count=this.SymbolData.Data.Data.length;
            for(var i=0;i<count;++i)
            {
                var item={Value:data, Value2:data2};
                drawData.push(item);
            }
        }
        

        return result;
    }

    this.GetDataByIndex=function(data, index)
    {
        var result={Result:false , Data:null };
        if (this.IsNumber(data)) 
        {
            result.Result=true;
            result.Data=data;
        }
        else
        {
            if (index<data.length)
            {
                result.Result=true;
                result.Data=data[index];
            }
            else
            {
                result.Result=false;
            }
        }

        return result;        
    }

    /*
    FILLRGN(MA1>MA2, MA1,MA2),colorred 
    表示MA1>MA2时以红色填充MA1和MA2之间的区域
    */
    this.FILLRGN=function(condition, data,data2)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'FILLRGN'}; 
        var isNumber=this.IsNumber(data);
        var isNumber2=this.IsNumber(data2);

        if (Array.isArray(condition))   //数组
        {
            for(var i in condition)
            {
                drawData[i]=null;
                var condItem=condition[i];
                if (!condItem) continue;
                
                var value=this.GetDataByIndex(data, i);
                if (!value.Result) continue;

                var value2=this.GetDataByIndex(data2, i);
                if (!value2.Result) continue;

                var item={ Value:value.Data, Value2:value2.Data };
                drawData[i]=item;
            }
        }
        else
        {
            if (condition)
            {
                for(var i=0;i<this.SymbolData.Data.Data.length;++i) //以K线长度为数据长度
                {
                    drawData[i]=null;

                    var value=this.GetDataByIndex(data, i);
                    if (!value.Result) continue;

                    var value2=this.GetDataByIndex(data2, i);
                    if (!value2.Result) continue;

                    var item={ Value:value.Data, Value2:value2.Data };
                    drawData[i]=item;
                }
            }
        }

        return result;
    }

    //DRAWKLINE(HIGH,OPEN,LOW,CLOSE).
    //用法:以HIGH为最高价,OPEN为开盘价,LOW为最低,CLOSE收盘画K线
    this.DRAWKLINE=function(high,open,low,close)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWKLINE'};
        let count=Math.max(high.length, open.length,low.length,close.length);

        for(let i=0;i<count;++i)
        {
            let item={Open:null,High:null, Low:null, Close:null};

            if (i<high.length && i<open.length && i<low.length && i<close.length)
            {
                item.Open=open[i];
                item.High=high[i];
                item.Low=low[i];
                item.Close=close[i];
            }

            drawData[i]=item;
        }


        return result;
    }

    //满足条件画一根K线
    this.DRAWKLINE_IF=function(condition,high,open,low,close)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWKLINE_IF'};
        let count=Math.max(condition.length,high.length, open.length,low.length,close.length);

        for(let i=0;i<count;++i)
        {
            let item={Open:null,High:null, Low:null, Close:null};

            if (i<high.length && i<open.length && i<low.length && i<close.length && i<condition.length)
            {
                if (condition[i])
                {
                    item.Open=open[i];
                    item.High=high[i];
                    item.Low=low[i];
                    item.Close=close[i];
                }
            }

            drawData[i]=item;
        }


        return result;
    }

    //叠加一个K线
    this.DRAWOVERLAYKLINE=function(open, high, low, close)
    {
        var drawData=[];
        var result={DrawData:drawData, DrawType:'DRAWOVERLAYKLINE'};
        var count=Math.max(high.length, open.length,low.length,close.length);

        var kData=this.SymbolData.Data.Data;
        for(var i=0;i<count;++i)
        {
            var item={Open:null,High:null, Low:null, Close:null};
            var kItem=kData[i];
            if (i<high.length && i<open.length && i<low.length && i<close.length && 
                IFrameSplitOperator.IsNumber(open[i]) && IFrameSplitOperator.IsNumber(high[i]) && IFrameSplitOperator.IsNumber(low[i]) && IFrameSplitOperator.IsNumber(low[i]))
            {

                item.Open=open[i];
                item.High=high[i];
                item.Low=low[i];
                item.Close=close[i];
                item.Date=kItem.Date;
                if (IFrameSplitOperator.IsNumber(kItem.Time)) item.Time=kItem.Time;
            }

            drawData[i]=item;
        }

        return result;
    }

    /*
    DRAWCOLORKLINE 绘制K线
    用法：
    DRAWCOLORKLINE(Cond,Color,Empty);
    满足Cond条件时，按照Color颜色绘制K线，根据Empty标志判断是空心还是实心。COLOR代表颜色，Empty非0为空心。

    注：
    不支持将该函数定义为变量，即不支持下面的写法：
    A:DRAWCOLORKLINE(Cond,Color,Empty);

    例：
    DRAWCOLORKLINE(C>O,COLORBLUE,0);//收盘价大于开盘价，用蓝色绘制实心K线
    */
    this.DRAWCOLORKLINE=function(condition, color, empty)
    {
        let drawData=[];
        let result={ DrawData:drawData, DrawType:'DRAWCOLORKLINE', IsEmptyBar:!(empty==0), Color:color }; 

        if (Array.isArray(condition))   //数组
        {
            for(var i=0; i<condition.length && i<this.SymbolData.Data.Data.length; ++i)
            {
                drawData[i]=null;
                var condItem=condition[i];
                if (!condItem) continue;
                var kItem=this.SymbolData.Data.Data[i];
                if (!kItem) continue;

                drawData[i]={Open:kItem.Open,High:kItem.High, Low:kItem.Low, Close:kItem.Close};
            }
        }
        else
        {
            if (condition)
            {
                for(var i=0;i<this.SymbolData.Data.Data.length;++i) //以K线长度为数据长度
                {
                    drawData[i]=null;
                    var kItem=this.SymbolData.Data.Data[i];
                    if (!kItem) continue;
                    drawData[i]={Open:kItem.Open,High:kItem.High, Low:kItem.Low, Close:kItem.Close };
                }
            }
        }

        return result;
    }

    /*
    PLOYLINE 折线段
    在图形上绘制折线段。
    用法：　PLOYLINE(COND，PRICE)，当COND条件满足时，以PRICE位置为顶点画折线连接。
    例如：　PLOYLINE(HIGH>=HHV(HIGH,20),HIGH)表示在创20天新高点之间画折线。
    */
    this.POLYLINE=function(condition,data)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'POLYLINE'};
        let isNumber=IFrameSplitOperator.IsNumber(data);

        let bFirstPoint=false;
        let bSecondPont=false;
        if (isNumber)
        {
            if (this.IsNumber(condition))
            {
                if (condition) 
                {
                    var count=this.SymbolData.Data.Data.length;
                    for(var i=0;i<count;++i )
                    {
                        drawData[i]=data;
                    }
                }
            }
            else if (Array.isArray(condition))
            {
                var bFind=false;
                for(var i=0; i<condition.length; ++i)
                {
                    drawData[i]=null;
                    if (bFind)
                    {
                        drawData[i]=data;
                    }
                    else
                    {
                        if (!condition[i]) continue;
                        
                        bFind=true;
                        drawData[i]=data;
                    }
                }
            }
        }
        else
        {
            if (IFrameSplitOperator.IsNumber(condition))
            {
                if (!condition) return result;
                let lineCache={Start:{ },End:{ }, List:[]};
                for(var i=0;i<data.length;++i)
                {
                    drawData[i]=null;
                    if (bFirstPoint==false && bSecondPont==false)
                    {
                        if (!this.IsNumber(data[i])) continue;

                        bFirstPoint=true;
                        lineCache.Start={ID:parseInt(i), Value:data[i]};  //第1个点
                    }
                    else if (bFirstPoint==true && bSecondPont==false)
                    {
                        if (!this.IsNumber(data[i])) continue;

                        lineCache.End={ID:parseInt(i), Value:data[i]};   //第2个点
                        //根据起始点和结束点 计算中间各个点的数据
                        let lineData=this.CalculateDrawLine(lineCache);     //计算2个点的线上 其他点的数值

                        for(let j in lineData)
                        {
                            let item=lineData[j];
                            drawData[item.ID]=item.Value;
                        }

                        let start={ ID:lineCache.End.ID,Value:lineCache.End.Value };
                        lineCache={Start:start,End:{ } };
                    }
                }

                this.CalculateDrawDataExtendLine(drawData);
            }
            else
            {
                let lineCache={Start:{ },End:{ }, List:[]};
                for(let i in condition)
                {
                    drawData[i]=null;
                    if (bFirstPoint==false && bSecondPont==false)
                    {
                        if (condition[i]==null || !condition[i]) continue;
                        if (i>=data.length || !this.IsNumber(data[i])) continue;

                        bFirstPoint=true;
                        lineCache.Start={ID:parseInt(i), Value:data[i]};  //第1个点
                    }
                    else if (bFirstPoint==true && bSecondPont==false)
                    {
                        if (condition[i]==null || !condition[i]) continue;
                        if (i>=data.length || !this.IsNumber(data[i])) continue;

                        lineCache.End={ID:parseInt(i), Value:data[i]};   //第2个点
                        //根据起始点和结束点 计算中间各个点的数据
                        let lineData=this.CalculateDrawLine(lineCache);     //计算2个点的线上 其他点的数值

                        for(let j in lineData)
                        {
                            let item=lineData[j];
                            drawData[item.ID]=item.Value;
                        }

                        let start={ ID:lineCache.End.ID,Value:lineCache.End.Value };
                        lineCache={Start:start,End:{ } };
                    }
                }

                this.CalculateDrawDataExtendLine(drawData);
            }
        }

        return result
    }

    this.CalculateDrawDataExtendLine=function(drawData, maxCount)
    {
        if (maxCount<0) return;

        var x2=null;
        var count=drawData.length;
        if (this.IsNumber(maxCount) && maxCount<count) count=maxCount;
        for(var i=count-1;i>=0;--i)
        {
            if (this.IsNumber(drawData[i]))
            {
                x2=i;
                break;
            }
        }
        //y3=(y1-y2)*(x3-x1)/(x2-x1)
        if (x2!=null && x2-1>=0)
        {
            var x1=x2-1;
            for(var i=x2+1;i<count;++i)
            {
                var y1=drawData[x1];
                var y2=drawData[x2];
                var y3=(y1-y2)*(i-x1)/(x2-x1);
                if (y1-y3<0) break;
                drawData[i]=y1-y3;
            }
        }
    }

    /*
    画出数字.
    用法:
    DRAWNUMBER(COND,PRICE,NUMBER),当COND条件满足时,在PRICE位置书写数字NUMBER.
    例如:
    DRAWNUMBER(CLOSE/OPEN>1.08,LOW,C)表示当日实体阳线大于8%时在最低价位置显示收盘价.
    decimal=小数位数 默认2
    */
    this.DRAWNUMBER=function(condition,data,data2,decimal)
    {
        let drawData={ Value:[], Text:[] };
        let result={ DrawData:drawData, DrawType:'DRAWNUMBER' };
        var dec=2;  //小数位数
        if (IFrameSplitOperator.IsNumber(decimal)) dec=decimal;

        var priceData={ DataType:0, SingleValue:null, ArrayValue:null };    //SingleValue=单值 ArrayValue=数组    
        if (Array.isArray(data))
        {
            priceData.ArrayValue=data;
            priceData.DataType=2;
        } 
        else 
        {
            if (data==="TOP"|| data==="BOTTOM") result.FixedPosition=data;
            priceData.SingleValue=data;
            priceData.DataType=1;
        }

        var numberData={  DataType:0, SingleValue:null,ArrayValue:null };
        if (Array.isArray(data2)) 
        {
            numberData.ArrayValue=data2;
            numberData.DataType=2;
        }
        else    
        {   //单值
            numberData.SingleValue=data2;
            numberData.DataType=1;
            if (IFrameSplitOperator.IsNumber(data2))
            {
                if (IFrameSplitOperator.IsInteger(data2)) numberData.SingleValue=data2.toString();
                else text=data2.toFixed(dec);
            }
        }

        if (Array.isArray(condition))
        {
            for(var i=0; i<condition.length; ++i)
            {
                drawData.Value[i]=null;
                if (!condition[i]) continue;

                drawData.Value[i]=this.DRAWNUMBER_Temp_PriceItem(i,priceData);
                drawData.Text[i]=this.DRAWNUMBER_Temp_NumberItem(i,numberData,dec);
            }
        }
        else if (this.IsNumber(condition) && condition)
        {
            for(var i=0;i<this.SymbolData.Data.Data.length;++i)
            {
                drawData.Value[i]=this.DRAWNUMBER_Temp_PriceItem(i,priceData);
                drawData.Text[i]=this.DRAWNUMBER_Temp_NumberItem(i,numberData,dec);
            }
        }

        return result;
    }

    this.DRAWNUMBER_Temp_PriceItem=function(index, priceData)
    {
        if (!priceData) return null;
        if (priceData.DataType==1) return priceData.SingleValue;

        if (!IFrameSplitOperator.IsNonEmptyArray(priceData.ArrayValue)) return null;

        return priceData.ArrayValue[index];
    }

    this.DRAWNUMBER_Temp_NumberItem=function(index,numberData,decimal)
    {
        if (!numberData) return null;

        if (numberData.DataType==1) return numberData.SingleValue;

        if (!IFrameSplitOperator.IsNonEmptyArray(numberData.ArrayValue)) return null;

        var value=numberData.ArrayValue[index];
        if (this.IsNumber(value))
        {
            if (IFrameSplitOperator.IsInteger(value)) return value.toString();
            else return value.toFixed(decimal);
        }

        return value.toString();
    }

    /*
    固定位置显示数字.
    用法: DRAWNUMBER_FIX(COND,X,Y,TYPE,NUMBER),当COND条件满足时,在当前指标窗口内(X,Y)位置书写数字NUMBER,X,Y为书写点在窗口中相对于左上角的百分比,TYPE:0为左对齐,1为右对齐.
    例如: DRAWNUMBER_FIX(CURRBARSCOUNT=1 AND CLOSE/OPEN>1.08,0.5,0.5,0,C)表示最后一个交易日实体阳线大于8%时在窗口中间位置显示收盘价.
    */
    this.DRAWNUMBER_FIX=function(condition,x,y,align,data)
    {
        var drawData={ Value:[], Text:[],  };
        var result={ DrawData:drawData, DrawType:'DRAWNUMBER_FIX', Position:{ X:x, Y:y, Type:align } };
        var isNumber=IFrameSplitOperator.IsNumber(data);

        if (Array.isArray(condition))
        {
            for(var i in condition)
            {
                drawData.Text[i]=null;
                drawData.Value[i]=null;
                if (!condition[i]) continue;

                if (isNumber) 
                {
                    drawData.Text[i]=this.RemoveZero(data.toFixed(2));
                    drawData.Value[i]=data;
                }
                else 
                {
                    if (i>=data.length || !IFrameSplitOperator.IsNumber(data[i])) continue;

                    var item=data[i];
                    drawData.Text[i]=this.RemoveZero(item.toFixed(2));
                    drawData.Value[i]=item;
                }
            }
        }
        else
        {
            if(!condition)
            {
                
            }
            else
            {
                for(var i=0;i<this.SymbolData.Data.Data.length;++i)
                {
                    if (isNumber) 
                    {
                        drawData.Text[i]=this.RemoveZero(data.toFixed(2));
                        drawData.Value[i]=data;
                    } 
                    else
                    {
                        if (i>=data.length || !IFrameSplitOperator.IsNumber(data[i])) continue;

                        var item=data[i];
                        drawData.Text[i]=this.RemoveZero(item.toFixed(2));
                        drawData.Value[i]=item;
                    }
                }
            }
        }

        return result;
    }

    /*
    通达信语法：
    在图形上绘制小图标.
    用法:
    DRAWICON(COND,PRICE,TYPE),当COND条件满足时,在PRICE位置画TYPE号图标(TYPE为1--41).
    例如:
    DRAWICON(CLOSE>OPEN,LOW,1)表示当收阳时在最低价位置画1号图标.

    文华语法：
    DRAWICON：绘制小图标。
    用法：
    DRAWICON(COND,PRICE,ICON);
    当COND条件满足时,在PRICE位置画图标ICON。

    注：
    1、该函数可以指定位置PRICE标注图标ICON
    2、ICON位置可以写成'ICON'的形式，也可以写为数字的形式，即DRAWICON(COND,PRICE,'ICO1');等价于DRAWICON(COND,PRICE,1);
    3、不支持将该函数定义为变量，即不支持下面的写法：
    A:DRAWICON(COND,PRICE,ICON);
    4、该函数可以用ALIGN，VALIGN设置图标的对齐方式。

    例1：
    DRAWICON(CLOSE<OPEN,LOW,'ICO1');//在阴线的最低价上画出图标ICON1。
    写完“DRAWICON(CLOSE<OPEN,LOW,” 以后，点击插入图标按钮，再单击选中的图标插入到函数中，图标用'ICO1'~'ICO105'（或1~105）表示。

    例2：
    MA5:=MA(C,5);
    DRAWICON(C>MA5,MA5,2);//表示在收盘价大于5周期均线的k线对应的MA5数值位置上画出图标ICON2。
    写完“DRAWICON(C>MA5,MA5,” 以后，点击插入图标按钮，再单击选中的图标插入到函数中，图标用ICO1~ICO105（或1~105）表示。
    */
    this.DRAWICON=function(condition,data,type)
    {
        if (IFrameSplitOperator.IsString(type)) //把ICO1=>1
        {
            var value=type.replace('ICO',"");
            type=parseInt(value);
        } 

        var icon=g_JSComplierResource.GetDrawIcon(type);
        if (!icon) g_JSComplierResource.GetDrawTextIcon(type);
        if (!icon) icon={Symbol:'🚩'};

        let drawData=[];
        let result={ DrawData:drawData, DrawType:'DRAWICON',Icon:icon, IconType:type };
        if (condition.length<=0) return result;

        var IsNumber=typeof(data)=="number";
        if (typeof(condition)=='number')
        {
            if (!condition) return result;

            for(var i=0;i<this.SymbolData.Data.Data.length;++i)
            {
                if (IsNumber) 
                {
                    drawData[i]=data;
                }
                else 
                {
                    if (i<data.length && this.IsNumber(data[i])) drawData[i]=data[i];
                    else drawData[i]=null;
                }
            }
            return result;
        }

        for(var i in condition)
        {
            drawData[i]=null;

            if (!condition[i]) continue;

            if (IsNumber) 
            {
                drawData[i]=data;
            }
            else 
            {
                if (this.IsNumber(data[i])) drawData[i]=data[i];
            }
        }

        return result;
    }

    /*
    ICON：在k线图上，显示小图标。

    用法：ICON(TYPE,ICON);
    当TYPE为1，则在K线最高价位置显示图标ICON，当TYPE为0，则在最低价位置显示
    图标ICON。

    注：
    1、该函数与判断条件连用，如：COND,ICON(TYPE,ICON);
    2、该函数支持在函数后设置垂直对齐方式：VALIGN0（上对齐）、VALIGN1（中对齐）、VALIGN2（下对齐）
    即可以写为如下格式：
    CLOSE<OPEN,ICON(1,'阴'),VALIGN0;

    例1：
    CLOSE>OPEN,ICON(1,'ICO1');//表示K线收盘大于开盘时，在最高价上显示图标1。
    写完“ICON(1,” 以后，点击插入图标按钮，再单击选中的图标插入到函数中，图标用
    'ICO1'~'ICO105'表示
    */
    this.ICON=function(position, type)
    {
        if (IFrameSplitOperator.IsString(type)) //把ICO1=>1
        {
            var value=type.replace('ICO',"");
            type=parseInt(value);
        } 

        var icon=g_JSComplierResource.GetDrawIcon(type);
        if (!icon) g_JSComplierResource.GetDrawTextIcon(type);
        if (!icon) icon={Symbol:'🚩'};

        let drawData=[];
        let result={DrawData:drawData, DrawType:'ICON',Icon:icon};

        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            var kItem=this.SymbolData.Data.Data[i];
            if (!kItem) continue;

            if (position==0) drawData[i]=kItem.Low;
            else if (position==1) drawData[i]=kItem.High;
        }

        return result;
    }

    /*
    含义:在图形上显示图标，鼠标移近时显示文字。
    用法:
    TIPICON(COND,PRICE,TYPE, TEXT),当COND条件满足时,在PRICE位置显示图标(TYPE) 若PRICE="TOP", "BOTTOM" 顶部或底部输出图标
    */

    this.TIPICON=function(condition, data, type, text)
    {
        if (IFrameSplitOperator.IsString(type)) //把ICO1=>1
        {
            var value=type.replace('ICO',"");
            type=parseInt(value);
        } 

        var icon=g_JSComplierResource.GetDrawIcon(type);

        let drawData=[];
        let result={ DrawData:drawData, DrawType:'TIPICON',Icon:icon, IconType:type, Text:text };
        if (condition.length<=0) return result;

        var IsNumber=typeof(data)=="number";

        if (IFrameSplitOperator.IsNumber(condition))
        {
            if (!condition) return result;

            for(var i=0;i<this.SymbolData.Data.Data.length;++i)
            {
                if (IsNumber) 
                {
                    drawData[i]=data;
                }
                else 
                {
                    if (i<data.length && IFrameSplitOperator.IsNumber(data[i])) drawData[i]=data[i];
                    else drawData[i]=null;
                }
            }
        }
        else if (Array.isArray(condition))
        {
            for(var i=0; i<condition.length; ++i)
            {
                drawData[i]=null;
    
                if (!condition[i]) continue;
    
                if (IsNumber) 
                {
                    drawData[i]=data;
                }
                else 
                {
                    if (IFrameSplitOperator.IsNumber(data[i])) drawData[i]=data[i];
                }
            }
        }

        return result;
    }

    /*
    绘制通道
    condition:条件
    data,data2:通道顶部和底部
    borderColor: 通道顶部和底部线段颜色RGB(24,30,40) 不填就不画
    borderWidth: 通道顶部和底部线段宽度
    areaColor: 通道面积颜色 RGB(200,30,44) 不填使用默认颜色
    dotted: 通道顶部和底部虚线设置 '3,4' , 不填默认 3,3
    */
    this.DRAWCHANNEL=function(condition, data, data2, borderColor, borderWidth, dotted, areaColor)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWCHANNEL', Border:{ }};
        if (condition.length<=0) return result;

        if (borderColor) result.Border.Color=borderColor;
        if (areaColor) result.AreaColor=areaColor;
        if (borderWidth>0) result.Border.Width=borderWidth;
        if (dotted) 
        {
            if (dotted=='0') 
            {
                result.Border.Dotted=[];
            }
            else
            {
                let ary=dotted.split(',');
                result.Border.Dotted=[];
                for(var i in ary)
                {
                    var item=ary[i];
                    if (!item) continue;
                    var value=parseInt(ary[i]);
                    if (!IFrameSplitOperator.IsNumber(value)) continue;
                    if (value<=0) continue;
                    result.Border.Dotted.push(value);
                }
                if (result.Border.Dotted.length<=0) result.Border.Dotted=null;
            }
        }

        var IsNumber=typeof(data)=="number";
        var IsNumber2=typeof(data2)=="number";
        if (typeof(condition)=='number')
        {
            if (!condition) return result;  //条件是否

            for(var i=0;i<this.SymbolData.Data.Data.length;++i)
            {
                drawData[i]=null;

                if (IsNumber && IsNumber2)
                {
                    drawData[i]={Value:data,Value2:data2};
                }
                else if (IsNumber && !IsNumber2)
                {
                    if (isNaN(data2[i])) continue;
                    drawData[i]={Value:data,Value2:data2[i]};
                }
                else if (!IsNumber && IsNumber2)
                {
                    if (isNaN(data[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2};
                }
                else
                {
                    if (isNaN(data[i]) || isNaN(data2[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2[i]};
                }
            }
        }
        else
        {
            for(var i=0;i<condition.length;++i)
            {
                drawData[i]=null;

                if (isNaN(condition[i]) || !condition[i]) continue;

                if (IsNumber && IsNumber2)
                {
                    drawData[i]={Value:data,Value2:data2};
                }
                else if (IsNumber && !IsNumber2)
                {
                    if (isNaN(data2[i])) continue;
                    drawData[i]={Value:data,Value2:data2[i]};
                }
                else if (!IsNumber && IsNumber2)
                {
                    if (isNaN(data[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2};
                }
                else
                {
                    if (isNaN(data[i]) || isNaN(data2[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2[i]};
                }
            }
        }

        return result;
    }

    this.RGB=function(r,g,b)
    {
        var rgb=`RGB(${r},${g},${b})`;
        return rgb;
    }

    this.RGBA=function(r,g,b,a)
    {
        var rgba=`RGB(${r},${g},${b},${a})`;
        return rgba;
    }

    this.UPCOLOR=function(color)
    {
        return color;
    }

    this.DOWNCOLOR=function(color)
    {
        return color;
    }

    this.STICKTYPE=function(value)
    {
        return value;
    }

    //数据左右偏移
    this.XMOVE=function(offset)
    {
        return offset;
    }

    //数据上下偏移
    this.YMOVE=function(offset)
    {
        return offset;
    }

    this.KLINETYPE=function(type)
    {
        return type;
    }

    this.FIRSTDRAW=function(value)
    {
        return value;
    }


    /*
    SOUND 播放声音。用法：SOUND(NAME)，播放NAME
    注：
    1、点击设置声音按钮，在弹出来的界面中设置声音，声音用字符'A'~'J'表示。
    2、自定义声音可以在设置菜单的设置声音文件中设置
    3、条件如果一直满足，则只播放一次，不重复播放。
    4、历史数据不触发该函数

    例：
    CLOSE>OPEN,SOUND('A');//表示K线收盘大于开盘时，播放声音"A"
    */

    this.SOUND=function(value)
    {
        return { Name:"SOUND", Value: value };
    }

    /*
    PLAYSOUND 条件满足时，播放指定声音。用法：PLAYSOUND(COND, 'N') 当条件满足时，播放声音'N'
    注：
    1、点击设置声音按钮，在弹出来的界面中设置声音，声音用字符'A'~'J'表示。
    2、自定义声音可以在设置菜单的设置声音文件中设置
    3、条件如果一直满足，则只播放一次，不重复播放。
    4、历史数据不触发该函数

    例：
    PLAYSOUND(CLOSE>OPEN,'A');//表示CLOSE>OPEN时播放自定义声音'A'。
    */

    this.PLAYSOUND=function(cond, value)
    {
        return null;
    }

    //用法:PARTLINE(PRICE,COND1,COLOR1,COND2,COLOR2...),
    //绘制PRICE线,当COND1条件满足时,用COLOR1颜色,当COND2条件满足时,用COLOR2颜色,否则不绘制,从COLOR1之后的参数均可以省略,最多可以有10组条件
    //例如:PARTLINE(CLOSE,CLOSE>OPEN,RGB(255,0,0),CLOSE<OPEN,RGB(0,255,0),1,RGB(0,0,255))
    //表示画收盘价线,阳线时用红色,阴线时用绿色,平盘用蓝色.注意最后一个条件为1,表示前面都不满足时必然满足这个条件
    this.PARTLINE=function(args)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'PARTLINE'};
        if (args.length<3) return result;

        var data=args[0];
        var condition=[];
        for(var i=1;i<args.length && i+1<args.length;i+=2)
        {
            condition.push({Cond:args[i], RGB:args[i+1]});
        }

        for(var i in data)
        {
            var drawItem={Value:null, RGB:null};
            drawData[i]=drawItem;

            var value=data[i];
            if (!this.IsNumber(value)) continue;

            var rgb=null;
            for(var j in condition)
            {
                var item=condition[j];
                if (Array.isArray(item.Cond))
                {
                    if (i<item.Cond.length && item.Cond[i])
                    {
                        rgb=item.RGB;
                        break;
                    }
                }
                else 
                {
                    if (this.IsNumber(item.Cond) && item.Cond)  //单数值条件
                    {
                        rgb=item.RGB;
                        break;
                    }
                }
            }

            if (rgb) 
            {
                drawItem.Value=value;
                drawItem.RGB=rgb;
            }
        }

        return result;
    }

    //函数:FILLRGN,根据条件用RGN颜色填充区域
    //用法：FILLRGN(PRICE1,PRICE2,COND1,COLOR1,COND2,COLOR2...),填充PRICE1到PRICE2之间的区域，当COND1条件满足时,用COLOR1颜色，当COND2条件满足时,用COLOR2颜色，否则不填充，从COLOR1之后的参数均可以省略，最多可以有15组条件。
    //例如：FILLRGN(CLOSE,OPEN,CLOSE>OPEN,RGB(255,0,0),CLOSE<OPEN,RGB(0,255,0))表示填充开盘价和收盘价之间的区域，阳线时用红色，阴线时用绿色，平盘不绘制。
    this.FILLRGN2=function(args)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'FILLRGN2'};
        if (args.length<4) return result;


        var price=args[0];
        var price2=args[1];
        var condition=[];
        for(var i=2;i<args.length && i+1<args.length;i+=2)
        {
            condition.push({Cond:args[i], Color:args[i+1]});
        }

        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            drawData[i]=null;

            var drawItem={ Value:null, Value2:null, Color:null };

            for(var j in condition)
            {
                var item=condition[j];
                if (Array.isArray(item.Cond))
                {
                    if (i<item.Cond.length && item.Cond[i])
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
                else 
                {
                    if (this.IsNumber(item.Cond) && item.Cond)  //单数值条件
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
            }

            if (!drawItem.Color) continue;

            if (Array.isArray(price))
            {
                if (i>=price.length) continue;
                if (!this.IsNumber(price[i])) continue;
                drawItem.Value=price[i];
            }
            else if (this.IsNumber(price))
            {
                drawItem.Value=price;
            }
            else
            {
                continue;
            }

            if (Array.isArray(price2))
            {
                if (i>=price2.length) continue;
                if (!this.IsNumber(price2[i])) continue;
                drawItem.Value2=price2[i];
            }
            else if　(this.IsNumber(price2))
            {
                drawItem.Value2=price2;
            }
            else
            {
                continue;
            }
             
            drawData[i]=drawItem;
        }

        return result;
    }

    //用法:FLOATRGN(PRICE,WIDTH,COND1,COLOR1,COND2,COLOR2...),以PRICE为基础填充宽度为WIDTH像素的区域,WIDTH为负则向下填充,当COND1条件满足时,用COLOR1颜色,当COND2条件满足时,用COLOR2颜色,否则不填充,从COND1之后的参数均可以省略,最多可以有10组条件
    //例如:FLOATRGN(CLOSE,VOL/HHV(VOL,10)*15,CLOSE>OPEN,RGB(255,0,0),1,RGB(0,255,0))表示沿收盘价填充宽度为成交量的区域,区域最大宽度为15像素,阳线时用红色,阴线时用绿色。
    this.FLOATRGN=function(args)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'FLOATRGN'};
        if (args.length<4) return result;

        var price=args[0];
        var width=args[1];
        var condition=[];
        for(var i=2;i<args.length && i+1<args.length;i+=2)
        {
            condition.push({Cond:args[i], Color:args[i+1]});
        }

        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            drawData[i]=null;

            var drawItem={ Value:null, Value2:null, Color:null };

            for(var j in condition)
            {
                var item=condition[j];
                if (Array.isArray(item.Cond))
                {
                    if (i<item.Cond.length && item.Cond[i])
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
                else 
                {
                    if (this.IsNumber(item.Cond) && item.Cond)  //单数值条件
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
            }

            if (!drawItem.Color) continue;

            if (Array.isArray(price))
            {
                if (i>=price.length) continue;
                if (!this.IsNumber(price[i])) continue;
                drawItem.Value=price[i];
            }
            else if (this.IsNumber(price))
            {
                drawItem.Value=price;
            }
            else
            {
                continue;
            }

            if (Array.isArray(width))
            {
                if (i>=width.length) continue;
                if (!this.IsNumber(width[i])) continue;
                drawItem.Value2=width[i];
            }
            else if　(this.IsNumber(width))
            {
                drawItem.Value2=width;
            }
            else
            {
                continue;
            }
             
            drawData[i]=drawItem;
        }

        return result;
    }

    //函数:FILLTOPRGN / FILLBOTTOMRGN 根据条件填充顶部或底部区域
    //用法 FILLTOPRGN(PRICE, COND1, COLOR, COND2, COLOR2)
    this.FILLBGRGN=function(type,args)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:(type==1 ?'FILLTOPRGN':"FILLBOTTOMRGN")};
        if (args.length<3) return result;

        var price=args[0];
        var condition=[];
        for(var i=1;i<args.length && i+1<args.length;i+=2)
        {
            condition.push({Cond:args[i], Color:args[i+1]});
        }

        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            drawData[i]=null;
            var drawItem={ Value:null, Color:null };

            for(var j in condition)
            {
                var item=condition[j];
                if (Array.isArray(item.Cond))
                {
                    if (i<item.Cond.length && item.Cond[i])
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
                else 
                {
                    if (this.IsNumber(item.Cond) && item.Cond)  //单数值条件
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
            }

            if (!drawItem.Color) continue;

            if (Array.isArray(price))
            {
                if (i>=price.length) continue;
                if (!this.IsNumber(price[i])) continue;
                drawItem.Value=price[i];
            }
            else if (this.IsNumber(price))
            {
                drawItem.Value=price;
            }
            else
            {
                continue;
            }

            drawData[i]=drawItem;
        }

        return result;
    }

    //函数:FILLVERTICALRGN 根据条件填充顶部到底部区域
    //用法 FILLVERTICALRGN(COND1, COLOR, COND2, COLOR2)
    this.FILLVERTICALRGN=function(args)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:"FILLVERTICALRGN"};
        if (args.length<2) return result;

        var condition=[];
        for(var i=0;i<args.length && i+1<args.length;i+=2)
        {
            condition.push({Cond:args[i], Color:args[i+1]});
        }

        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            drawData[i]=null;
            var drawItem={ Color:null };

            for(var j in condition)
            {
                var item=condition[j];
                if (Array.isArray(item.Cond))
                {
                    if (i<item.Cond.length && item.Cond[i])
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
                else 
                {
                    if (this.IsNumber(item.Cond) && item.Cond)  //单数值条件
                    {
                        drawItem.Color=item.Color;
                        break;
                    }
                }
            }

            if (!drawItem.Color) continue;

            drawData[i]=drawItem;
        }

        return result;
    }

    //填充背景.
    //用法: DRAWGBK(COND,COLOR1,COLOR2,colorAngle)  colorAngle=渐近色角度
    //例如: DRAWGBK(O>C,RGB(0,255,0),RGB(255,0,0),0);
    this.DRAWGBK=function(condition, color, color2, colorAngle)
    {
        let drawData={ Color:[],  Angle:colorAngle };
        if (color) drawData.Color.push(color);
        if (color2) drawData.Color.push(color2);

        let result={DrawData:null, DrawType:'DRAWGBK'};
        if (Array.isArray(condition))
        {
            for(var i in condition)
            {
                var item=condition[i];
                if (item) 
                {
                    result.DrawData=drawData;
                    break;
                }
            }
        }
        else
        {
            if (condition) result.DrawData=drawData;
        }

        return result;
    }

    this.DRAWGBK2=function(condition, color, color2, colorAngle)
    {
        let drawData={ Color:[],  Angle:colorAngle };
        if (color) drawData.Color.push(color);
        if (color2) drawData.Color.push(color2);

        let result={DrawData:null, DrawType:'DRAWGBK2'};
        if (Array.isArray(condition))
        {
            drawData.Data=[];
            for(var i in condition)
            {
                var item=condition[i];
                drawData.Data[i]=item ? 1:0;
            }

            result.DrawData=drawData;
        }
        else
        {
            if (condition) 
            {
                result.DrawData=drawData;
                result.DrawType="DRAWGBK";
            }
        }

        return result;
    }

    //填充部分背景.
    //用法:
    //DRAWGBK_DIV(COND,COLOR1,COLOR2,填色方式,填充范围),填充满足COND条件的背景区域
    //填色方式:0是上下渐进 1是左右渐进 2是用COLOR1画框线 3是用COLOR1画框线, 用COLOR2填充
    //填充范围:0为整个区域 1为最高最低区 2为开盘收盘区 
    //例如:
    //DRAWGBK_DIV(C>O,RGB(0,255,0),RGB(255,0,0),0,0);
    this.DRAWGBK_DIV=function(condition, color, color2, colorType, fillType)
    {
        var drawData={ AryColor:[color, color2], ColorType:colorType, FillType:fillType, Data:[] }; 
        var result={ DrawData:drawData, DrawType:'DRAWGBK_DIV' };
        if (!this.SymbolData || !this.SymbolData.Data || !IFrameSplitOperator.IsNonEmptyArray(this.SymbolData.Data.Data)) return result;

        var aryKData=this.SymbolData.Data.Data;
        if (Array.isArray(condition))
        {
           for(var i=0; i<aryKData.length; ++i)
           {
                var condItem=condition[i];
                var item=null;
                if (condItem) 
                {
                    var kItem=aryKData[i];
                    if (fillType==1) item={ AryValue:[kItem.High, kItem.Low] }
                    else if (fillType==2) item={ AryValue:[kItem.Open, kItem.Close] }
                    else item={ AryValue:null };
                }
                drawData.Data[i]=item;
           } 
        }
        else 
        {
            if (condition)
            {
                for(var i=0; i<aryKData.length; ++i)
                {
                    var kItem=aryKData[i];
                    var item=null;

                    if (fillType==1) item={ AryValue:[kItem.High, kItem.Low] }
                    else if (fillType==2) item={ AryValue:[kItem.Open, kItem.Close] }
                    else item={ AryValue:null };
                     
                    drawData.Data[i]=item;
                } 
            }
        }

        return result;
    }


    //画文字 及线段
    this.DRAWTEXT_LINE=function(condition, price, text, textcolor, fontSize, linetype, linecolor)
    {
        let drawData={ Text:{ Title:text, Color:textcolor }, Line:{ Type:linetype, Color:linecolor } };
        if (fontSize<=0) fontSize=12;
        drawData.Text.Font=fontSize*GetDevicePixelRatio()+'px 微软雅黑'; 

        let result={DrawData:null, DrawType:'DRAWTEXT_LINE'};
        
        if (Array.isArray(condition))
        {
            var item=null;
            if (IFrameSplitOperator.IsNonEmptyArray(condition))
                item=condition[condition.length-1]; //取最后一个数值

            if (item) 
            {
                if (Array.isArray(price)) drawData.Price=price[condition.length-1];
                else drawData.Price=price;
                result.DrawData=drawData;
            }
        }
        else
        {
            if (condition) 
            {
                if (Array.isArray(price)) 
                {
                    var value=null;
                    if (price.length>0) value=price[price.length-1];
                    drawData.Price=value;
                }
                else 
                {
                    drawData.Price=price;
                }
                result.DrawData=drawData;
            }
        }

        return result;
    }

    // 相对位置上画矩形.
    //用法: DRAWRECTREL(LEFT,TOP,RIGHT,BOTTOM,COLOR),以图形窗口(LEFT,TOP)为左上角,(RIGHT,BOTTOM)为右下角绘制矩形,坐标单位是窗口沿水平和垂直方向的1/1000,取值范围是0—999,超出范围则可能显示在图形窗口外,矩形中间填充颜色COLOR,COLOR为0表示不填充.
    //例如: DRAWRECTREL(0,0,500,500,RGB(255,255,0))表示在图形最左上部1/4位置用黄色绘制矩形
    this.DRAWRECTREL=function(left, top, right,bottom, color)
    {
        
        let drawData={ Rect:{Left:Math.min(left,right), Top:Math.min(top,bottom), Right:Math.max(right,left), Bottom:Math.max(bottom,top) }, Color:color };
        if (color==0) drawData.Color=null;
        let result={DrawData:drawData, DrawType:'DRAWRECTREL'};

        return result;
    }

    //DRAWTEXTREL(X,Y,TEXT),在图形窗口(X,Y)坐标位置书写文字TEXT，坐标单位是窗口沿水平和垂直方向的1/1000，X、Y取值范围是0—999,超出范围则可能显示在图形窗口外。
    //例如：DRAWTEXTREL(500,500,'注意')表示在图形中间位置显示'注意'字样。
    this.DRAWTEXTREL=function(x, y, text)
    {
        let drawData={ Point:{X:x, Y:y} };
        if (IFrameSplitOperator.IsString(text))
            drawData.Text=text;
        else if (IFrameSplitOperator.IsNonEmptyArray(text)) 
            drawData.Text=text[0];
        
        let result={DrawData:drawData, DrawType:'DRAWTEXTREL'};

        return result;
    }

    //DRAWTEXTABS(X,Y,TEXT),在图形窗口(X,Y)坐标位置书写文字TEXT，坐标单位是像素,图形窗口左上角坐标为(0,0)。
    //例如：DRAWTEXTABS(0,0,'注意')表示在图形最左上角位置显示'注意'字样。
    this.DRAWTEXTABS=function(x, y, text)
    {
        let drawData={ Point:{X:x, Y:y} };
        if (IFrameSplitOperator.IsString(text))
            drawData.Text=text;
        else if (IFrameSplitOperator.IsNonEmptyArray(text)) 
            drawData.Text=text[0];
        
        let result={DrawData:drawData, DrawType:'DRAWTEXTABS'};

        return result;
    }

    //画百分比叠加线
    this.DRAWOVERLAYLINE=function(data, mainData, title)
    {
        let drawData={ Data:data, MainData:mainData };
        if (title && typeof(title)=='string') drawData.Title=title;
        let result={ DrawData:drawData, DrawType:'DRAWOVERLAYLINE' };
       
        return result;
    }

    //绘制斜线.
    //用法:DRAWSL(COND,PRICE,SLOPE,LEN,DIRECT),当COND条件满足时,在PRICE位置画斜线,SLOPE为斜率,LEN为长度,DIRECT为0向右延伸,1向左延伸,2双向延伸.
    //注意:
    //1.K线间的纵向高度差为SLOPE;
    //2.SLOPE为0时,为水平线;
    //3.SLOPE为10000时,为垂直线,LEN为向上的像素高度,DIRECT表示向上或向下延伸;
    //4.SLOPE和LEN支持变量;
    this.DRAWSL=function(condition, data, slope, len, direct)
    {
        let drawData={ Data:[], Option:[] };
        let result={ DrawData:drawData, DrawType:'DRAWSL' };
        var isNumber=this.IsNumber(data);

        if (Array.isArray(condition))
        {
            for(var i in condition)
            {
                drawData.Data[i]=null;
                if (!condition[i]) continue;

                if (isNumber) 
                {
                    drawData.Data[i]=data;
                    drawData.Option[i]={Slope:slope, Length:len, Direct:direct };
                }
                else
                {
                    if (i<data.length && this.IsNumber(data[i]))
                    {
                        drawData.Data[i]=data[i];
                        drawData.Option[i]={Slope:slope, Length:len, Direct:direct };
                    }
                }
            }
        }
        else
        {
            if (condition)
            {
                var count=this.SymbolData.Data.Data.length;
                for(var i=0; i<count; ++i)
                {
                    drawData.Data[i]=null;
                    if (isNumber) 
                    {
                        drawData.Data[i]=data;
                        drawData.Option[i]={Slope:slope, Length:len, Direct:direct };
                    }
                    else
                    {
                        if (i<data.length && this.IsNumber(data[i]))
                        {
                            drawData.Data[i]= data[i];
                            drawData.Option[i]={Slope:slope, Length:len, Direct:direct };
                        }
                    }
                }
            }
        }
        
        return result;
    }

    //含义:在图形上绘制垂直线。
    //用法:
    //VERTLINE(COND,TYPE),当COND条件满足时,沿垂直方向绘制TYPE类型的线段,TYPE=0表示实线，1表示虚线'---'，2表示点线'...'，3表示点划线'-.-.-'，4表示点点划线'-..-..-'。
    //例如：VERTLINE(HIGH>=HHV(HIGH,20),1)表示在创20天新高画垂直虚线。

    this.VERTLINE=function(condition, type)
    {
        let drawData={ Data:[], LineType:type };
        let result={ DrawData:drawData, DrawType:'VERTLINE' };
        if (Array.isArray(condition))
        {
            for(var i=0;i<condition.length;++i)
            {
                var item=condition[i];
                if (item) drawData.Data[i]=1;
                else drawData.Data[i]=0;
            }
        }
        else
        {

        }

        return result;
    }

    //含义:在图形上绘制水平线。
    //用法:
    //HORLINE(COND,PRICE,TYPE,EXTEND),当COND条件满足时,在PRICE位置沿水平方向绘制TYPE类型的线段,TYPE=0表示实线，1表示虚线'---'，2表示点线'...'，3表示点划线'-.-.-'，4表示点点划线'-..-..-'。EXTEND=1 表示向左延长，=2表示向右延长，=3表示左右延长。
    //例如：HORLINE(HIGH>=HHV(HIGH,20),HIGH,1,2)表示在创20天新高时画水平虚线向右延伸。
    this.HORLINE=function(condition, data, type, extend)
    {
        let drawData={ Data:[], LineType:type, Extend:extend };
        let result={ DrawData:drawData, DrawType:'HORLINE' };
        if (Array.isArray(condition) && Array.isArray(data))
        {
            for(var i=0;i<condition.length;++i)
            {
                var item=condition[i];
                drawData.Data[i]=null;
                if (!item) continue;
                if (i>=data.length) continue;
                var value=data[i];
                if (IFrameSplitOperator.IsNumber(value)) drawData.Data[i]=value;
            }
        }
        else if (Array.isArray(condition) && IFrameSplitOperator.IsNumber(data))
        {
            for(var i=0;i<condition.length;++i)
            {
                var item=condition[i];
                drawData.Data[i]=null;
                if (!item) continue;
                drawData.Data[i]=data;
            }
        }
        else if (IFrameSplitOperator.IsNumber(condition) && condition)
        {
            if (this.SymbolData && this.SymbolData.Data && this.SymbolData.Data.Data)
            {
                if (Array.isArray(data))
                {
                    var count=this.SymbolData.Data.Data.length;
                    for(var i=0; i<count; ++i)
                    {
                        drawData.Data[i]=null;
                        if (i>=data.length) continue;
                        var value=data[i];
                        if (IFrameSplitOperator.IsNumber(value)) drawData.Data[i]=value;
                    }
                }
                else if (IFrameSplitOperator.IsNumber(data))
                {
                    var count=this.SymbolData.Data.Data.length;
                    for(var i=0; i<count; ++i)
                    {
                        drawData.Data[i]=data;
                    }
                }
            }
        }

        return result;
    }

    //该函数和DRAWTEXT连用
    //{ Color:背景色, Border:边框颜色, Margin=[上,下,左, 右] }
    this.BACKGROUND=function(color, borderColor, left, right, top, bottom)
    {
        var bg={ Margin:[0,1,1,1] };
        if (color) bg.Color=color;
        if (borderColor) bg.Border=borderColor;
        if (IFrameSplitOperator.IsNumber(left)) bg.Margin[2]=left;
        if (IFrameSplitOperator.IsNumber(right)) bg.Margin[3]=right;
        if (IFrameSplitOperator.IsNumber(top)) bg.Margin[0]=top;
        if (IFrameSplitOperator.IsNumber(bottom)) bg.Margin[1]=bottom;

        return bg;
    }

    //该函数和DRAWTEXT, DRAWICON连用
    //{ color:线段颜色, lineWidth:宽度 lineType:线段样式0=直线 1=虚线}
    this.CKLINE=function(color, lineWidth, lineType, lineDotted)
    {
        var drawData={ Color:color, LineWidth: 1, LineType:0, LineDot:[3,3] };
        if (IFrameSplitOperator.IsPlusNumber(lineWidth)) drawData.LineWidth=lineWidth;
        if (IFrameSplitOperator.IsPlusNumber(lineType)) drawData.LineType=lineType;
        if (lineDotted) 
        {
            let ary=lineDotted.split(',');
            var dotted=[];
            for(var i in ary)
            {
                var item=ary[i];
                if (!item) continue;
                var value=parseInt(ary[i]);
                if (value<=0) continue;
                dotted.push(value);
            }

            if (dotted.length>0) drawData.LineDotted=dotted;
        }

        drawData.Data=[];
        for(var i=0;i<this.SymbolData.Data.Data.length;++i)
        {
            var item=this.SymbolData.Data.Data[i];
            drawData.Data[i]={ High:item.High, Low:item.Low };
        }
        
        return drawData;
    }


    //多头建仓(买入开仓).
    //参数1为触发条件,参数2为标记放置位置.此函数只适用于特定版本交易模式下.
    //例如: BUY(CROSS(A,B),LOW),当A上穿B时,在LOW处画标记,同时突出提示或直接下单,如果LOW改为DRAWNULL,就不画标记.(分时图上不支持)
    this.BUY=function(condition, data, iconSymbol, color)
    {
        var iconInfo={ Color:"rgb(0,255,0)", Type:"SVG", Icon:'\ue660' };
        if (IFrameSplitOperator.IsString(iconSymbol)) iconInfo.Icon=iconSymbol;
        if (color) iconInfo.Color=color;
        var result=this.CalculateTradeData(condition, data, iconInfo);
        result.DrawType='BUY';
        return result;
    }

    this.BUYSHORT=function(condition, data, iconSymbol, color)
    {
        var iconInfo={ Color:"rgb(0,255,0)", Type:"SVG", Icon:'\ue660' };
        if (IFrameSplitOperator.IsString(iconSymbol)) iconInfo.Icon=iconSymbol;
        if (color) iconInfo.Color=color;
        var result=this.CalculateTradeData(condition, data, iconInfo);
        result.DrawType='BUYSHORT';
        return result;
    }

    //多头平仓(卖出平仓).
    //参数1为触发条件,参数2为标记放置位置.此函数只适用于特定版本交易模式下.
    //例如: SELL(CROSS(A,B),HIGH),当A上穿B时,在HIGH处画标记,同时突出提示或直接下单,如果HIGH改为DRAWNULL,就不画标记.(分时图上不支持)
    this.SELL=function(condition, data, iconSymbol,color)
    {
        var iconInfo={ Color:"rgb(255,0,0)", Type:"SVG", Icon:'\ue661' };
        if (IFrameSplitOperator.IsString(iconSymbol)) iconInfo.Icon=iconSymbol;
        if (color) iconInfo.Color=color;
        var result=this.CalculateTradeData(condition, data, iconInfo);
        result.DrawType='SELL';
        return result;
    }

    this.SELLSHORT=function(condition, data, iconSymbol,color)
    {
        var iconInfo={ Color:"rgb(255,0,0)", Type:"SVG", Icon:'\ue661' };
        if (IFrameSplitOperator.IsString(iconSymbol)) iconInfo.Icon=iconSymbol;
        if (color) iconInfo.Color=color;
        var result=this.CalculateTradeData(condition, data, iconInfo);
        result.DrawType='SELLSHORT';
        return result;
    }

    this.CalculateTradeData=function(condition, data, IconInfo)
    {
        var aryData=[];
        var aryIcon=[];
        var result={ DrawData:{ Data:aryData, Icons:aryIcon } };

        if (Array.isArray(condition))
        {
            var isAryPosition=Array.isArray(data);
            for(var i=0;i<condition.length;++i)
            {
                aryData[i]=0;
                aryIcon[i]=null
                if (!condition[i]) continue;

                aryData[i]=1;

                if (isAryPosition) aryIcon[i]={ Value:data[i], Type:IconInfo.Type, Color:IconInfo.Color, Icon:IconInfo.Icon };
                else aryIcon[i]={ Value:data, Type:IconInfo.Type, Color:IconInfo.Color, Icon:IconInfo.Icon };
            }
        }
        else if (IFrameSplitOperator.IsNumber(condition) && condition>0)
        {
            
        }

        return result;
    }
}


JSDraw.prototype.CalculateDrawLine=function(lineCache)
{
    lineCache.List=[];
    for(let i=lineCache.Start.ID; i<=lineCache.End.ID; ++i) lineCache.List.push(i);

    let height=Math.abs(lineCache.Start.Value-lineCache.End.Value);
    let width=lineCache.List.length-1;

    var result=[];
    result.push({ID:lineCache.Start.ID, Value:lineCache.Start.Value});  //第1个点

    if (lineCache.Start.Value>lineCache.End.Value)
    {
        for(let i=1;i<lineCache.List.length-1;++i)
        {
            var value=height*(lineCache.List.length-1-i)/width+lineCache.End.Value;
            result.push({ID:lineCache.List[i], Value:value});
        }
    }
    else
    {
        for(let i=1;i<lineCache.List.length-1;++i)
        {
            var value=height*i/width+lineCache.Start.Value;
            result.push({ID:lineCache.List[i], Value:value});
        }
    }

    result.push({ID:lineCache.End.ID, Value:lineCache.End.Value});      //最后一个点

    return result;
}

//是否有是有效的数字
JSDraw.prototype.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

JSDraw.prototype.IsDrawFunction=function(name)
{
    let setFunctionName=new Set(
    [
        "STICKLINE","DRAWTEXT",'SUPERDRAWTEXT','DRAWLINE','DRAWBAND','DRAWKLINE',"DRAWKLINE1",'DRAWKLINE_IF',"DRAWCOLORKLINE",'PLOYLINE',"DRAWOVERLAYKLINE",
        'POLYLINE','DRAWNUMBER',"DRAWNUMBER_FIX",'DRAWICON','DRAWCHANNEL','PARTLINE','DRAWTEXT_FIX','DRAWGBK','DRAWTEXT_LINE','DRAWRECTREL',"DRAWTEXTABS","DRAWTEXTREL",
        'DRAWOVERLAYLINE',"FILLRGN", "FILLRGN2","FILLTOPRGN", "FILLBOTTOMRGN", "FILLVERTICALRGN","FLOATRGN","DRAWSL", "DRAWGBK2","DRAWGBK_DIV",
        "VERTLINE","HORLINE","TIPICON",
        "BUY","SELL","SELLSHORT","BUYSHORT",
    ]);
    if (setFunctionName.has(name)) return true;

    return false;
}

JSDraw.prototype.RemoveZero = function (strValue)
{
    while(strValue.length>0)
    {
        var index=strValue.length-1;
        var ch=strValue[index];
        if (ch=="0")
        {
            strValue=strValue.substr(0,index);
        }
        else if (ch==".")
        {
            strValue=strValue.substr(0,index);
            break;
        }
        else
        {
            break;
        }
    }

    return strValue;
}

//http://www.newone.com.cn/helpcontroller/index?code=zszy_pc
var DYNAINFO_ARGUMENT_ID=
{
    YCLOSE:3,
    OPEN:4,
    HIGH:5,
    LOW:6,
    CLOSE:7,
    VOL:8,
    AMOUNT:10,
    AMPLITUDE:13,   //振幅
    INCREASE:14,    //涨幅
    EXCHANGERATE:37,    //换手率
};

function JSSymbolData(ast,option,jsExecute)
{
    this.AST=ast;               //语法树
    this.Execute=jsExecute;

    this.Symbol='600000.sh';
    this.Name;
    this.Data=null;             //个股数据
    this.PeriodData=new Map();  //跨周期数据 {Key=period, value=[histroydata]}
    this.IsApiPeriod=false;     //是否是后台api周期数据
    this.SourceData=null;       //不复权的个股数据
    this.MarketValue=null;      //总市值
    this.Period=0;              //周期
    this.Right=0;               //复权
    this.DataType=0;            //默认K线数据 2=分钟走势图数据 3=多日分钟走势图
    this.IsBeforeData=false;    //当日走势图数据是否包含开盘前数据
    this.DayCount;              //多日分时图天数
    this.Arguments=[];          //指标参数

    this.KLineApiUrl= g_JSComplierResource.Domain+"/API/KLine2";                   //日线
    this.MinuteKLineApiUrl= g_JSComplierResource.Domain+'/API/KLine3';             //分钟K线
    this.RealtimeApiUrl= g_JSComplierResource.Domain+'/API/stock';                 //实时行情
    this.HistoryMinuteApiUrl=g_JSChartResource.Domain+'/API/StockMinuteData';      //历史分钟数据(多日分时图)
    this.StockHistoryDayApiUrl= g_JSComplierResource.Domain+'/API/StockHistoryDay';    //历史财务数据
    this.StockHistoryDay3ApiUrl= g_JSComplierResource.Domain+'/API/StockHistoryDay3';  //历史财务数据
    this.StockHistoryDay2ApiUrl= g_JSComplierResource.Domain+'/API/StockHistoryDay2';  //历史财务数据
    this.StockNewsAnalysisApiUrl= g_JSComplierResource.CacheDomain+'/cache/newsanalyze';                //新闻分析数据
    this.HKToSHSZApiUrl=    //北上资金 !!顺序不要变 后面都是写死的
    [ 
        g_JSComplierResource.CacheDomain+'/cache/historyday/all/hk2shsz.json',      //日线数据
        g_JSComplierResource.CacheDomain+'/cache/analyze/hk2shsz/hk2shsz.json',     //最新分钟
        g_JSComplierResource.Domain+'/API/HKToSHSZMinuteData',                      //多日分时分钟
        g_JSComplierResource.CacheDomain+'/cache/analyze/hk2szshanalyze'            //个股的北上
    ] ;          

    this.MaxRequestDataCount=1000;
    this.MaxRequestMinuteDayCount=5;
    this.KLineDateTimeRange;        //请求的K线日期范围

    this.LatestData=new Map();  //最新行情 key=id value=数据
    this.IndexData;             //大盘指数
    this.LatestIndexData;       //最新大盘数据
    this.MarginData=new Map();  //融资融券
    this.HKToSHSZData=new Map();    //北上资金
    this.NewsAnalysisData=new Map();    //新闻统计
    this.ExtendData=new Map();          //其他的扩展数据
    this.UserData=new Map();            //用户数据
    this.CustomAPIData=new Map();       //自定义API数据
    this.ScriptIndexOutData=new Map();  //调用脚本执行返回的数据
    this.OtherSymbolData=new Map();     //其他股票信息 key=symbol value=[historydata]

    //股票数据缓存 key=函数名(参数)  { Data: value=拟合的数据 , Error: } 
    //FinValue(id)
    this.StockData=new Map();        

    this.SectionFinanceData=new Map();  //截面报告数据
    this.ThrowSFPeirod=new Set();       //重新获取数据

    this.NetworkFilter;                 //网络请求回调 function(data, callback);
    this.DrawInfo;
    
   
    //使用option初始化
    if (option)
    {
        if (option.HQDataType) this.DataType=option.HQDataType;
        if (option.Data) 
        {
            this.Data=option.Data;
            if (this.DataType!=HQ_DATA_TYPE.MINUTE_ID && this.DataType!=HQ_DATA_TYPE.MULTIDAY_MINUTE_ID && this.DataType!=HQ_DATA_TYPE.HISTORY_MINUTE_ID)   //分钟走势图数据 没有周期和复权
            {
                this.Period=option.Data.Period; //周期
                this.Right=option.Data.Right;   //复权
            }
            //this.Data=null;
        }

        if (option.SourceData) this.SourceData=option.SourceData;
        if (option.Symbol) this.Symbol=option.Symbol;
        if (option.Name) this.Name=option.Name;
        if (option.MaxRequestDataCount>0) this.MaxRequestDataCount=option.MaxRequestDataCount;
        if (option.MaxRequestMinuteDayCount>0) this.MaxRequestMinuteDayCount=option.MaxRequestMinuteDayCount;
        if (option.KLineApiUrl) this.KLineApiUrl=option.KLineApiUrl;
        if (option.Right) this.Right=option.Right;
        if (option.Period) this.Period=option.Period;
        if (option.IsBeforeData===true) this.IsBeforeData=option.IsBeforeData;
        if (option.NetworkFilter) this.NetworkFilter=option.NetworkFilter;
        if (option.DayCount>0) this.DayCount=option.DayCount;
        if (option.Arguments) this.Arguments=option.Arguments;
        if (option.KLineRange) this.KLineDateTimeRange=option.KLineRange;
        if (option.IsApiPeriod) this.IsApiPeriod=option.IsApiPeriod;
        if (option.DrawInfo) this.DrawInfo=option.DrawInfo;
    }

    this.RecvError=function(request)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvError] ajax error.',request.status);
        throw {FunctionName:'RecvError', Request:request};
    }


    this.GetLatestDataKey=function(key)
    {
        var key=`DYNAINFO-${key}`;
        return key;
    }

    //最新行情
    this.GetLatestData=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 1);
        var lID=aryArgs[0];
        var key=this.GetLatestDataKey(lID);

        if (this.LatestData.has(key)) return this.Execute.RunNextJob();

        var self=this;

        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSSymbolData::GetLatestData', //类名::
                Explain:'DYNAINFO()',
                Args:aryArgs,
                Request:{ Url:self.RealtimeApiUrl,  Type:'POST' ,
                    Data: { symbol:[this.Symbol], field: ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","exchangerate","amplitude"] } }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvLatestData(data);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        JSNetwork.HttpRequest({
            url: self.RealtimeApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","exchangerate","amplitude"],
                "symbol": [this.Symbol]
            },
            type:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                self.RecvLatestData(recvData);
                self.Execute.RunNextJob();
            },
            error: function(request)
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvLatestData=function(data)
    {
        if (data.ver==2.0) 
        {
            this.RecvLatestDataVer2(data);
            return;
        }

        if (!data.stock || data.stock.length!=1) return;

        let stock=data.stock[0];
        if (!stock) return;

        if (IFrameSplitOperator.IsNumber(stock.yclose)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.YCLOSE,stock.yclose);
        if (IFrameSplitOperator.IsNumber(stock.open)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.OPEN,stock.open);
        if (IFrameSplitOperator.IsNumber(stock.high)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.HIGH,stock.high);
        if (IFrameSplitOperator.IsNumber(stock.low)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.LOW,stock.low);
        if (IFrameSplitOperator.IsNumber(stock.price)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.CLOSE,stock.price);
        if (IFrameSplitOperator.IsNumber(stock.vol)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.VOL,stock.vol);
        if (IFrameSplitOperator.IsNumber(stock.amount)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.AMOUNT,stock.amount);
        if (IFrameSplitOperator.IsNumber(stock.increase)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.INCREASE,stock.increase);
        if (IFrameSplitOperator.IsNumber(stock.exchangerate)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.EXCHANGERATE,stock.exchangerate);
        if (IFrameSplitOperator.IsNumber(stock.amplitude)) this.LatestData.set(DYNAINFO_ARGUMENT_ID.AMPLITUDE,stock.amplitude);
       
        /*
        this.LatestData={ Symbol:stock.symbol, Name:stock.name, Date:stock.date, Time:stock.time,
            YClose:stock.yclose,Price:stock.price, Open:stock.open, High:stock.high, Low:stock.low, Vol:stock.vol, Amount:stock.amount, 
            Increase:stock.increase, Exchangerate:stock.exchangerate, Amplitude:stock.amplitude};
        */

        JSConsole.Complier.Log('[JSSymbolData::RecvLatestData] symbol, LatestData', stock.symbol, this.LatestData);
    }

    //data:[{ id:, value: }]
    this.RecvLatestDataVer2=function(data)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(data.data)) return;

        var symbol=data.symbol;
        for(var i=0;i<data.data.length;++i)
        {
            var item=data.data[i];
            if (!item) continue;
            if (!IFrameSplitOperator.IsNumber(item.id)) continue;
            if (IFrameSplitOperator.IsNumber(item.value) || IFrameSplitOperator.IsString(item.value))
            {
                JSConsole.Complier.Log(`[JSSymbolData::RecvLatestDataVer2] symbol=${symbol} DYNAINFO(${item.id})=${item.value}.`);
                this.LatestData.set(item.id, item.value);
            }
                
        }

        JSConsole.Complier.Log('[JSSymbolData::RecvLatestDataVer2]', this.LatestData);
    }

    this.GetLatestCacheData=function(dataname)
    {
        if (this.LatestData.has(dataname)) return this.LatestData.get(dataname);

        return null;
    }

    this.GetLatestIndexData=function()
    {
        if (this.LatestIndexData) return this.Execute.RunNextJob();

        var self=this;

        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSSymbolData::GetLatestIndexData', //类名:: 函数
                Explain:'最新大盘数据',
                Request:{ Url:self.RealtimeApiUrl,  Type:'POST' ,
                    Data: { symbol:['000001.sh'], field: ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","amplitude"] } }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvLatestIndexData(data);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        JSNetwork.HttpRequest({
            url: self.RealtimeApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","amplitude"],
                "symbol": ['000001.sh']
            },
            type:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                self.RecvLatestIndexData(recvData);
                self.Execute.RunNextJob();
            },
            error: function(request)
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvLatestIndexData=function(data)
    {
        if (!data.stock || data.stock.length!=1) return;

        let stock=data.stock[0];
        this.LatestIndexData={ Symbol:stock.symbol, Name:stock.name, Date:stock.date, Time:stock.time,
            YClose:stock.yclose,Price:stock.price, Open:stock.open, High:stock.high, Low:stock.low, Vol:stock.vol, Amount:stock.amount, 
            Increase:stock.increase, Amplitude:stock.amplitude};

        JSConsole.Complier.Log('[JSSymbolData::RecvLatestIndexData]', this.LatestIndexData);
    }

    this.GetVolRateData=function(job,node)
    {
        var volrKey=job.ID.toString()+'-VolRate-'+this.Symbol;
        if (this.ExtendData.has(volrKey)) return this.Execute.RunNextJob();

        var self=this;
        var dayCount=30;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var dayCount=1;
            if (this.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) dayCount=this.DayCount;
            var obj=
            {
                Name:'JSSymbolData::GetVolRateData', //类名:: 函数
                Explain:'分时量比数据(成交量)',
                Request:
                { 
                    Url:self.KLineApiUrl,  Type:'POST' ,
                    Data: { symbol:self.Symbol, dayCount:dayCount, field: ["name","symbol","vol"], period:0, right:0, dateRange:dateRange } 
                }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                self.RecvVolRateData(recvData,volrKey);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        JSNetwork.HttpRequest({
            url: self.KLineApiUrl,
            data:
            {
                "field":  ["name","symbol","vol"],
                "symbol": self.Symbol,
                "start": -1,
                "count": dayCount
            },
            type:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                self.RecvVolRateData(recvData,volrKey);
                self.Execute.RunNextJob();
            },
            error: function(request)
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvVolRateData=function(data,key)
    {
        var sumVol=0,avgVol5=0;
        var mapAvgVol5=new Map();
        if (data.Ver==2.0)  // {Ver:2.0 , data:[ [日期,5日vol均值]] }
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(data.data)) return;
            for(var i=0;i<data.data.length;++i) 
            {
                var item=data.data[i];
                if (!IFrameSplitOperator.IsNonEmptyArray(item)) continue;
                if (item.length<2) continue;
                if (IFrameSplitOperator.IsNumber(item[0]) && IFrameSplitOperator.IsPlusNumber(item[1]))
                {
                    mapAvgVol5.set(item[0],{ AvgVol5:item[1] } );
                }
            }
        }
        else
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(data.data)) return;

            var minuteCount=241;
            if (IFrameSplitOperator.IsNumber(data.minutecount)) minuteCount=data.minutecount;
            for(var i=0,j=0,dayCount=0;i<data.data.length;++i)  //每天的5日成交均量
            {
                sumVol=0;
                for(j=i,dayCount=0;j>=0 && dayCount<5;--j, ++dayCount)
                {
                    var item=data.data[j];
                    if (IFrameSplitOperator.IsNumber(item[6])) 
                        sumVol+=item[6];
                }
    
                if (dayCount>0) 
                {
                    avgVol5=sumVol/dayCount/minuteCount;
                    var item=data.data[i];
                    mapAvgVol5.set(item[0],
                        { 
                            //for debug
                            //Vol5:sumVol, MinuteCount:minuteCount,,Count:dayCount, 
                            AvgVol5:avgVol5
                        } );
                }
            }
        }
       
        if (mapAvgVol5.size>0) this.ExtendData.set(key,mapAvgVol5);
        JSConsole.Complier.Log('[JSSymbolData::RecvVolRateData]', mapAvgVol5);
    }

    this.GetVolRateCacheData=function(node)
    {
        var key=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA.toString()+'-VolRate-'+this.Symbol;
        if (!key || !this.ExtendData.has(key)) this.Execute.ThrowUnexpectedNode(node,'不支持VOLR');

        var result=[];
        var mapAvgVol5=this.ExtendData.get(key);
        var totalVol=0, preDate=0, avgVol5=null;
        for(var i=0, j=0;i<this.Data.Data.length;++i)
        {
            result[i]=null;
            var item=this.Data.Data[i];
            if (preDate!=item.Date)
            {
                avgVol5=null;
                j=0;
                totalVol=0;

                if (mapAvgVol5.has(item.Date)) 
                {
                    var volItem=mapAvgVol5.get(item.Date);
                    avgVol5=volItem.AvgVol5;
                }
               
                preDate=item.Date;
            }

            if (avgVol5==null) continue;

            totalVol+=item.Vol;
            result[i]=totalVol/(j+1)/avgVol5*100;
            ++j;
        }

        return result;
    }

    //获取大盘指数数据
    this.GetIndexData=function()
    {
        if (this.IndexData) return this.Execute.RunNextJob();

        var self=this;
        if (ChartData.IsDayPeriod(this.Period,true))     //请求日线数据 9=季线
        {
            if (this.NetworkFilter)
            {
                var dateRange=this.Data.GetDateRange();
                var obj=
                {
                    Name:'JSSymbolData::GetIndexData', //类名::
                    Explain:'大盘数据',
                    Period:self.Period,
                    Request:
                    { 
                        Url:self.KLineApiUrl,  Type:'POST' ,
                        Data: 
                        { 
                            field:[ "name", "symbol","yclose","open","price","high","low","vol",'up','down','stop','unchanged'],
                            indexSymbol:"000001.sh", symbol: this.Symbol, period:this.Period,
                            dateRange:dateRange 
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };
                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvIndexHistroyData(data);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol",'up','down','stop','unchanged'],
                    "symbol": '000001.sh',
                    "start": -1,
                    "count": self.MaxRequestDataCount+500   //多请求2年的数据 确保股票剔除停牌日期以后可以对上
                },
                type:"post",
                dataType: "json",
                async:true, 
                success: function (recvData)
                {
                    self.RecvIndexHistroyData(recvData);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else  if (ChartData.IsMinutePeriod(this.Period, true))          //请求分钟数据
        {
            if (this.NetworkFilter)
            {
                var dateRange=this.Data.GetDateRange();
                var obj=
                {
                    Name:'JSSymbolData::GetIndexData', //类名::
                    Explain:'大盘数据',
                    Period:self.Period,
                    Request:{ Url:self.MinuteKLineApiUrl,  Type:'POST' ,
                        Data: 
                        { 
                            field:["name","symbol","yclose","open","price","high","low","vol"],
                            indexSymbol:"000001.sh", symbol: this.Symbol, period:this.Period,
                            dateRange:dateRange 
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };
                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvIndexMinuteHistroyData(data);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: self.MinuteKLineApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol"],
                    "symbol": '000001.sh',
                    "start": -1,
                    "count": self.MaxRequestMinuteDayCount+5
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvIndexMinuteHistroyData(data);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }

    }

    this.RecvIndexHistroyData=function(data)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvIndexHistroyData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        this.IndexData=new ChartData();
        this.IndexData.DataType=0; /*日线数据 */
        this.IndexData.Data=hisData;

        if (this.IsApiPeriod==true)
        {
            this.IndexData.Period=this.Period;
            this.IndexData.Data=this.Data.FixKData(hisData,this.Period);
        }
        else
        {
            var aryOverlayData=this.SourceData.GetOverlayData(this.IndexData.Data);      //和主图数据拟合以后的数据
            this.IndexData.Data=aryOverlayData;
    
            if (ChartData.IsDayPeriod(this.Period,false))   //周期数据
            {
                let periodData=this.IndexData.GetPeriodData(this.Period);
                this.IndexData.Data=periodData;
            }
        }
    }

    this.RecvIndexMinuteHistroyData=function(data)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvIndexMinuteHistroyData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        this.IndexData=new ChartData();
        this.IndexData.DataType=1; /*分钟线数据 */
        this.IndexData.Data=hisData;

        if (this.IsApiPeriod==true)
        {
            this.IndexData.Period=this.Period;
            this.IndexData.Data=this.Data.FixKData(hisData,this.Period);
        }
        else
        {
            if (ChartData.IsMinutePeriod(this.Period,false))   //周期数据
            {
                let periodData=this.IndexData.GetPeriodData(this.Period);
                this.IndexData.Data=periodData;
            }
        }
    }

    this.GetOtherSymbolParam=function(name)
    {
        var args=name.split("$");
        var setStockDataName=new Set(['CLOSE',"C",'VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT','AMO','VOLINSTK']);
        if (!setStockDataName.has(args[1])) return null;
        
        var symbol=args[0];
        if (symbol.length==6)
        {
            if (symbol[0]=="6" || symbol[0]=="5" || symbol[0]=="8" || symbol[0]=="9")
                symbol+=".SH";
            else if (symbol[0]=='0' || symbol[0]=='1' || symbol[0]=='2' || symbol[0]=='3')
                symbol+='.SZ';
        }
        else if (symbol.indexOf("SZ")==0)
        {
            symbol=symbol.substr(2)+".SZ";
        }
        else if (symbol.indexOf("SH")==0)
        {
            symbol=symbol.substr(2)+".SH";
        }
        else if (symbol.indexOf("_")>0)
        {
            var arySymbol=symbol.split("_");
            symbol=`${arySymbol[1]}.${arySymbol[0]}`;
        }
        else 
            return null;

        return { Symbol:symbol.toLowerCase(), DataName:args[1] };
        
    }

    //获取其他股票数据
    this.GetOtherSymbolData=function(job)
    {
        var symbol=this.Symbol;
        if (job.Literal)
        {
            var args=this.GetOtherSymbolParam(job.Literal.toUpperCase());
            if (!args)
            {
                var token=job.Token;
                this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.Literal} Error.`);
            }

            symbol=args.Symbol;
        }
        else
        {
            var args=job.Args;
            if (args.length>0)
            {
                var item=args[0];
                if (item.Type==Syntax.Literal) 
                {
                    symbol=item.Value;
                }
                else if (item.Type==Syntax.Identifier)  //变量 !!只支持默认的变量值
                {
                    var isFind=false;
                    for(var j in this.Arguments)
                    {
                        const argItem=this.Arguments[j];
                        if (argItem.Name==item.Name)
                        {
                            symbol=argItem.Value;
                            isFind=true;
                            break;
                        }
                    }
    
                    if (!isFind) 
                    {
                        var token=job.Token;
                        this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.FunctionName}() Error: can't read ${item.Name}`);
                    }
                }
            }
        }
       

        job.Symbol=symbol.toLowerCase();
        if (job.Symbol==this.Symbol) return this.Execute.RunNextJob();
        if (this.OtherSymbolData.has(job.Symbol)) return this.Execute.RunNextJob();

        var self=this;
        if (this.DataType==HQ_DATA_TYPE.KLINE_ID && ChartData.IsDayPeriod(this.Period,true))     //请求日线数据
        {
            if (this.NetworkFilter)
            {
                var dateRange=this.Data.GetDateRange();
                var obj=
                {
                    Name:'JSSymbolData::GetOtherSymbolData', //类名::函数名
                    Explain:'指定个股数据',
                    Request:
                    { 
                        Data: 
                        { 
                            symbol:job.Symbol,
                            right:self.Right,
                            period:self.Period,
                            dateRange:dateRange
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };
                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvOtherSymbolKData(data,job);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol"],
                    "symbol": job.Symbol,
                    "start": -1,
                    "count": self.MaxRequestDataCount+500   //多请求2年的数据 确保股票剔除停牌日期以后可以对上
                },
                type:"post",
                dataType: "json",
                async:true, 
                success: function (recvData)
                {
                    self.RecvOtherSymbolKDayData(recvData,job);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else  if (ChartData.IsMinutePeriod(this.Period, true) || this.DataType==HQ_DATA_TYPE.MINUTE_ID || this.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)          //请求分钟数据
        {
            if (this.NetworkFilter)
            {
                var dateRange=this.Data.GetDateRange();
                var obj=
                {
                    Name:'JSSymbolData::GetOtherSymbolData', //类名::函数名
                    Explain:'指定个股数据',
                    Request:
                    { 
                        Data: 
                        { 
                            symbol:job.Symbol,
                            right:self.Right,
                            period:self.Period,
                            dateRange:dateRange
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };
                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvOtherSymbolKData(data,job);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: self.MinuteKLineApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol"],
                    "symbol": job.Symbol,
                    "start": -1,
                    "count": self.MaxRequestMinuteDayCount+5
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvOtherSymbolKMinuteData(data,job);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
    }

    //第3方数据对接
    this.RecvOtherSymbolKData=function(data,job)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvOtherSymbolKData] recv data' , data);

        var kData=new ChartData();
        var hisData=null;
        var period=this.Period;
        if (this.DataType==HQ_DATA_TYPE.KLINE_ID && ChartData.IsDayPeriod(this.Period,true))    //日线数据 
        {
            hisData=this.JsonDataToHistoryData(data);
            kData.DataType=0; 
        }
        else    //分钟线数据
        {
            hisData=this.JsonDataToMinuteHistoryData(data);
            kData.DataType=1; 
            //走势图使用1分钟K线模式
            if (this.DataType==HQ_DATA_TYPE.MINUTE_ID || this.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) 
                period=4;
        }
        
        kData.Period=this.Period;
        kData.Right=this.Right;

        kData.Data=this.Data.FixKData(hisData,period);
        this.OtherSymbolData.set(job.Symbol, kData);
    }

    this.RecvOtherSymbolKDayData=function(data,job)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvOtherSymbolKDayData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        var kData=new ChartData();
        kData.DataType=0; //日线数据 
        kData.Data=hisData;

        var aryOverlayData=this.SourceData.GetOverlayData(kData.Data);      //和主图数据拟合以后的数据
        kData.Data=aryOverlayData;

        if (ChartData.IsDayPeriod(this.Period,false))   //周期数据
        {
            let periodData=kData.GetPeriodData(this.Period);
            kData.Data=periodData;
        }

        this.OtherSymbolData.set(job.Symbol, kData);
    }

    this.RecvOtherSymbolKMinuteData=function(data, job)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvOtherSymbolKMinuteData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        var kData=new ChartData();
        kData.DataType=1; /*分钟线数据 */
        kData.Data=hisData;

        if (ChartData.IsMinutePeriod(this.Period,false))   //周期数据
        {
            let periodData=kData.GetPeriodData(this.Period);
            kData.Data=periodData;
        }

        this.OtherSymbolData.set(job.Symbol, kData);
    }

    this.GetOtherSymolCacheData=function(obj)
    {
        var symbol,dataName;
        if (obj.FunctionName)
        {
            dataName=obj.FunctionName;
            var args=obj.Args;
            if (args.length<=0) return this.GetSymbolCacheData(dataName);
            symbol=args[0].toString().toLowerCase();
        }
        else if (obj.Literal)
        {
            var args=this.GetOtherSymbolParam(obj.Literal.toUpperCase());
            if (!args) return [];
            symbol=args.Symbol;
            dataName=args.DataName;
        }
        
        if (symbol==this.Symbol) return this.GetSymbolCacheData(dataName);
        if (!this.OtherSymbolData.has(symbol)) return [];

        var kData=this.OtherSymbolData.get(symbol);
        var upperSymbol=symbol.toUpperCase();

        switch(dataName)
        {
            case 'CLOSE':
            case 'C':
                return kData.GetClose();
            case 'VOL':
            case 'V':
                if (MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol)) 
                    return kData.GetVol(100);   //A股的 把股转成手
                return kData.GetVol();
            case 'OPEN':
            case 'O':
                return kData.GetOpen();
            case 'HIGH':
            case 'H':
                return kData.GetHigh();
            case 'LOW':
            case 'L':
                return kData.GetLow();
            case 'AMOUNT':
            case 'AMO':
                return kData.GetAmount();
            case 'VOLINSTK':
                return kData.GetPosition();
        }
    }

    //获取大盘指数缓存数据
    this.GetIndexCacheData=function(dataName)
    {
        if (!this.IndexData) return  new Array();

        switch(dataName)
        {
        case 'INDEXA':
            return this.IndexData.GetAmount();
        case 'INDEXC':
            return this.IndexData.GetClose();
        case 'INDEXH':
            return this.IndexData.GetHigh();
        case 'INDEXL':
            return this.IndexData.GetLow();
        case 'INDEXO':
            return this.IndexData.GetOpen();
        case 'INDEXV':
            return this.IndexData.GetVol();
        case 'INDEXADV':
            return this.IndexData.GetUp();
        case 'INDEXDEC':
            return this.IndexData.GetDown();
        }
    }

    //指数转成对应的板块
    this.GetBlockSymbol=function(symbol)    
    {
        //中文对应板块代码
        const BLOCK_CN_NAME_MAP=new Map([ ["沪深A股","CNA.ci"], ["创业板","GEM.ci"], ["沪市A股","SHA.ci"], ["中小板","SME.ci"], ["深市A股","SZA.ci"] ]);
        if (BLOCK_CN_NAME_MAP.has(symbol)) return BLOCK_CN_NAME_MAP.get(symbol);

        if (!symbol) return null;
        var blockSymbol=null;
        var upperSymbol=symbol.toUpperCase();

        if (upperSymbol.indexOf('.SH')>0 || upperSymbol.indexOf('.SZ')>0 ) 
        {
            const INDEX_SYMBOL_SET=new Set(["000001.SH", "000003.SH", "000016.SH", "000300.SH", "000905.SH", "399001.SZ", " 399005.SZ", "399006.SZ"]);
            if (!INDEX_SYMBOL_SET.has(upperSymbol)) return null;

            blockSymbol=symbol.replace('.SH','.sh');
            blockSymbol=symbol.replace('.SZ','.sz');
        }
        else if (symbol.indexOf('.CI')>0) 
        {
            blockSymbol=symbol.replace('.CI','.ci');
        }

        /*
        const SYMBOL_TO_BLOCK_MAP=new Map([
            ["000001.SH","SME.ci"],
            ["399001.SZ","SZA.ci"],["399001.SZ"," GEM.ci"],["399005.SZ","SME.ci"]
        ]);

        if (SYMBOL_TO_BLOCK_MAP.has(upperSymbol)) return SYMBOL_TO_BLOCK_MAP.get(upperSymbol);

        if(upperSymbol.indexOf('.CI')<0) return null;
        */

        return blockSymbol;
    }

    //分钟涨幅股票个数统计数据下载
    this.GetIndexIncreaseData=function(job)
    {
        var symbol=null;
        if (job.IsSelfSymbol)
        {
            symbol=this.Symbol;
        }
        else
        {
            if (!job.Args || job.Args.length<=0)
            {
                var token=job.Token;
                this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.FunctionName} Error: 参数不能为空`);
            }
            symbol=job.Args[0].Value;
        }

        var blockSymbol=this.GetBlockSymbol(symbol);
        if (!blockSymbol)  
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.FunctionName} Error: can't support ${symbol}`);
        }

        var upKey=job.ID.toString()+'-UpCount-'+blockSymbol;
        var downKey=job.ID.toString()+'-DownCount-'+blockSymbol;
        if (this.ExtendData.has(upKey) && this.ExtendData.has(downKey)) return this.Execute.RunNextJob();

        var self=this;

        if (this.NetworkFilter)
        {
            var dataType={Type: this.DataType};
            if (this.DataType===HQ_DATA_TYPE.KLINE_ID) dataType.Period=this.Period;
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetIndexIncreaseData', //类名::
                Explain:'涨停家数统计',
                DateRange:dateRange,
                DataType:dataType,
                Request:{ Url:'数据地址',  Type:'POST' ,
                    Data: { symbol:this.Symbol, blocksymbol:blockSymbol, field: ["up", "down"] } }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(data) 
            { 
                if (this.DataType===HQ_DATA_TYPE.KLINE_ID) this.RecvHistoryIncreaseDataV2(data, {UpKey:upKey,DownKey:downKey});
                else this.RecvMinuteIncreaseDataV2(data, {UpKey:upKey,DownKey:downKey});
                
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        if (this.DataType===HQ_DATA_TYPE.MINUTE_ID || this.DataType===HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)  //走势图数据
        {
            var apiUrl=g_JSComplierResource.CacheDomain+'/cache/analyze/increaseanalyze/'+blockSymbol+'.json';
            JSConsole.Complier.Log('[JSSymbolData::GetIndexIncreaseData] minute Get url=' , apiUrl);
            JSNetwork.HttpRequest({
                url: apiUrl,
                type:"get",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvMinuteIncreaseData(data, {UpKey:upKey,DownKey:downKey});
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else if (this.DataType===HQ_DATA_TYPE.KLINE_ID && ChartData.IsDayPeriod(this.Period,true)) //K线图 日线
        {
            JSConsole.Complier.Log('[JSSymbolData::GetIndexIncreaseData] K day Get url=' , self.KLineApiUrl);
            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "symbol": blockSymbol,
                    "start": -1,
                    "count": self.MaxRequestDataCount,
                    "field":['up', 'down']
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvHistoryIncreaseData(data, {UpKey:upKey,DownKey:downKey});
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else
        {
            this.Execute.RunNextJob();
        }
    }


    //格式{ ver：2.0 data:[{date, time, up, down}, .....]}
    this.RecvHistoryIncreaseDataV2=function(data,key)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvHistoryIncreaseData] recv data, key' , data,key);

        var upData=[],downData=[];
        for(var i in data.data)
        {
            var item=data.data[i];
            let upItem=new SingleData();
            let downItem=new SingleData();
            var date=item[0];
            var time=null;
            upItem.Date=date;
            downItem.Date=date;
            if (ChartData.IsMinutePeriod(this.Period,true) && IFrameSplitOperator.IsNumber(item[1])) 
            {
                time=item[1];
                upItem.Time=time;
                downItem.Time=time;
            }
            
            upItem.Value=item[2];
            upData[i]=upItem;
            
            downItem.Value=item[3];
            downData[i]=downItem;
        }

        var upFixedData=this.Data.GetFittingData2(upData,0);
        var downFixedData=this.Data.GetFittingData2(downData,0);

        this.ExtendData.set(key.UpKey,upFixedData);
        this.ExtendData.set(key.DownKey,downFixedData);
    }

    this.RecvHistoryIncreaseData=function(data,key)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvHistoryIncreaseData] recv data' , data);

        var upData=[],downData=[];
        for(var i in data.data)
        {
            var item=data.data[i];
            let upItem=new SingleData();
            let downItem=new SingleData();
            upItem.Date=item[0];
            upItem.Value=item[8];
            upData[i]=upItem;
            downItem.Date=item[0];
            downItem.Value=item[9];
            downData[i]=downItem;
        }

        var upFixedData, downFixedData;
        if (this.SourceData) upFixedData=this.SourceData.GetFittingData(upData);
        else upFixedData=this.Data.GetFittingData(aryData);

        if (this.SourceData) downFixedData=this.SourceData.GetFittingData(downData);
        else downFixedData=this.Data.GetFittingData(aryData);

        this.ExtendData.set(key.UpKey,upFixedData);
        this.ExtendData.set(key.DownKey,downFixedData);
    }

    this.RecvMinuteIncreaseDataV2=function(data, key)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteIncreaseDataV2] recv data, key' , data, key);
    }

    this.RecvMinuteIncreaseData=function(data,key)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteIncreaseData] recv data' , data);
        if (!data.minute) return;
        var minuteData=data.minute;
        if (!minuteData.time || !minuteData.up || !minuteData.down) return;
        var upData=[],downData=[];

        if (this.IsBeforeData)
        {
            for(var i=0, j=0;i<this.Data.Data.length;++i)
            {
                upData[i]=null;
                downData[i]=null;
                var item=this.Data.Data[i];
                if (item.Before) continue;  //盘前数据
                var dateTime=item.DateTime; //日期加时间
                if (!dateTime) continue;
                var aryValue=dateTime.split(' ');
                if (aryValue.length!=2) continue;
                var date=parseInt(aryValue[0]);
                if (date!=data.date) continue;

                upData[i]=minuteData.up[j];
                downData[i]=minuteData.down[j];
                ++j;
            }
        }
        else
        {
            for(var i=0, j=0;i<this.Data.Data.length;++i)
            {
                upData[i]=null;
                downData[i]=null;
                var item=this.Data.Data[i];
                var dateTime=item.DateTime; //日期加时间
                if (!dateTime) continue;
                var aryValue=dateTime.split(' ');
                if (aryValue.length!=2) continue;
                var date=parseInt(aryValue[0]);
                if (date!=data.date) continue;

                upData[i]=minuteData.up[j];
                downData[i]=minuteData.down[j];
                ++j;
            }
        }

        this.ExtendData.set(key.UpKey,upData);
        this.ExtendData.set(key.DownKey,downData);
    }

    //分钟涨幅股票个数统计数据
    this.GetIndexIncreaseCacheData=function(funcName,symbol,node)
    {
        var blockSymbol=this.GetBlockSymbol(symbol);
        if (!blockSymbol) this.Execute.ThrowUnexpectedNode(node,'不支持函数'+funcName+'('+symbol+')');

        var key;
        if (funcName=='UPCOUNT' || funcName=='ADVANCE') key=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA.toString()+'-UpCount-'+blockSymbol;
        else if (funcName=='DOWNCOUNT' || funcName=='DECLINE') key=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA.toString()+'-DownCount-'+blockSymbol;
        
        if (!key || !this.ExtendData.has(key)) this.Execute.ThrowUnexpectedNode(node,'不支持函数'+funcName+'('+symbol+')');

        if (this.DataType===HQ_DATA_TYPE.MINUTE_ID || this.DataType===HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)  //分时图
        {
            return this.ExtendData.get(key);
        }
        else if (this.DataType===HQ_DATA_TYPE.KLINE_ID && ChartData.IsDayPeriod(this.Period,true))  //K线图
        {
            var data=this.ExtendData.get(key);
            var bindData=new ChartData();
            bindData.Data=data;
            bindData.Period=this.Period;    //周期

            if (bindData.Period>0)          //周期数据
            {
                var periodData=bindData.GetPeriodSingleData(bindData.Period);
                bindData.Data=periodData;
            }

            return bindData.GetValue();
        }
        else
        {
            return null;
        }
    }


    this.GetSymbolData=function()
    {
        if (this.Data) return this.Execute.RunNextJob();

        let self=this;

        if (this.DataType===HQ_DATA_TYPE.MINUTE_ID)  //当天分钟数据
        {
            JSNetwork.HttpRequest({
                url: self.RealtimeApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","minute","time","minutecount"],
                    "symbol": [self.Symbol],
                    "start": -1
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (recvData)
                {
                    self.RecvMinuteData(recvData);
                    self.Execute.RunNextJob();
                }
            });
            return;
        }

        if (this.DataType===HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)
        {
            JSNetwork.HttpRequest({
                url: self.HistoryMinuteApiUrl,
                data:
                {
                    "symbol": self.Symbol,
                    "daycount": self.DayCount
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (recvData)
                {
                    self.RecvMultiDayMinuteData(recvData);
                    self.Execute.RunNextJob();
                }
            });
            return;
        }

        if (ChartData.IsDayPeriod(this.Period,true))     //请求日线数据
        {
            if (this.NetworkFilter)
            {
                var obj=
                {
                    Name:'JSSymbolData::GetSymbolData',
                    Explain:"日线数据",
                    Request:
                    { Url:self.RealtimeApiUrl,  Type:'POST' ,
                        Data: 
                        {
                            "field": [ "name", "symbol","yclose","open","price","high","low","vol"],
                            "symbol": self.Symbol,
                            "start": -1,
                            "count": self.MaxRequestDataCount,
                            "period":this.Period,
                            "right":this.Right
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };

                if (this.KLineDateTimeRange)
                {
                    obj.Request.KLineDataTimeRange={Start:{ Date:this.KLineDateTimeRange.Start.Date},  End:{ Date:this.KLineDateTimeRange.End.Date} };
                    if (this.IsNumber(this.KLineDateTimeRange.Start.Time)) obj.Request.KLineDataTimeRange.Start.Time=this.KLineDateTimeRange.Start.Time;
                    if (this.IsNumber(this.KLineDateTimeRange.End.Time)) obj.Request.KLineDataTimeRange.End.Time=this.KLineDateTimeRange.End.Time;
                }

                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvHistroyData(data);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol"],
                    "symbol": self.Symbol,
                    "start": -1,
                    "count": self.MaxRequestDataCount
                },
                type:"post",
                dataType: "json",
                async:true, 
                success: function (recvData)
                {
                    self.RecvHistroyData(recvData);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period) || ChartData.IsMilliSecondPeriod(this.Period))               //请求分钟数据
        {
            if (this.NetworkFilter)
            {
                var obj=
                {
                    Name:'JSSymbolData::GetSymbolData',
                    Explain:"分钟K线数据",
                    Request:
                    { Url:self.MinuteKLineApiUrl,  Type:'POST' ,
                        Data: 
                        {
                            "field": ["name","symbol","yclose","open","price","high","low","vol"],
                            "symbol": self.Symbol,
                            "start": -1,
                            "count": self.MaxRequestMinuteDayCount,
                            "period":this.Period,
                            "right":this.Right
                        } 
                    },
                    Self:this,
                    PreventDefault:false
                };

                if (this.KLineDateTimeRange)
                {
                    obj.Request.KLineDataTimeRange={Start:{ Date:this.KLineDateTimeRange.Start.Date},  End:{ Date:this.KLineDateTimeRange.End.Date} };
                    if (this.IsNumber(this.KLineDateTimeRange.Start.Time)) obj.Request.KLineDataTimeRange.Start.Time=this.KLineDateTimeRange.Start.Time;
                    if (this.IsNumber(this.KLineDateTimeRange.End.Time)) obj.Request.KLineDataTimeRange.End.Time=this.KLineDateTimeRange.End.Time;
                }

                this.NetworkFilter(obj, function(data) 
                { 
                    self.RecvMinuteHistroyData(data);
                    self.Execute.RunNextJob();
                });

                if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
            }

            JSNetwork.HttpRequest({
                url: this.MinuteKLineApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol"],
                    "symbol": self.Symbol,
                    "start": -1,
                    "count": self.MaxRequestMinuteDayCount
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvMinuteHistroyData(data);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
    }

    this.RecvHistroyData=function(data)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvHistroyData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        this.Data=new ChartData();
        this.Data.DataType=0; /*日线数据 */
        this.Data.Data=hisData;
        this.SourceData=new ChartData;
        this.SourceData.Data=hisData;

        if (this.IsApiPeriod)   //后台周期 前端不处理
        {

        }
        else
        {
            if (this.Right>0)    //复权
            {
                let rightData=this.Data.GetRightData(this.Right);
                this.Data.Data=rightData;
            }
    
            if (ChartData.IsDayPeriod(this.Period,false))   //周期数据
            {
                let periodData=this.Data.GetPeriodData(this.Period);
                this.Data.Data=periodData;
            }
        }

        this.Data.Right=this.Right;
        this.Data.Period=this.Period;
        this.Name=data.name;
    }

    this.RecvMinuteHistroyData=function(data)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteHistroyData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        this.Data=new ChartData();
        this.Data.DataType=1; /*分钟线数据 */
        this.Data.Data=hisData;
        this.SourceData=new ChartData;
        this.SourceData.Data=hisData;

        if (this.IsApiPeriod)   //后台周期 前端不处理
        {

        }
        else
        {
            if (ChartData.IsMinutePeriod(this.Period,false))   //周期数据
            {
                let periodData=this.Data.GetPeriodData(this.Period);
                this.Data.Data=periodData;
            }
        }

        this.Data.Period=this.Period;
        this.Name=data.name;
    }

    //最新的分钟数据走势图
    this.RecvMinuteData=function(data)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteData] recv data' , data);

        var aryMinuteData=this.JsonDataToMinuteData(data);
        this.Data=new ChartData();
        this.Data.DataType=2; /*分钟走势图数据 */
        this.Data.Data=aryMinuteData;

        this.Name=data.stock[0].name;
    }

    this.RecvMultiDayMinuteData=function(data)
    {
        var aryMinuteData=this.JsonDataToMultiDayMinuteData(data);
        this.Data=new ChartData();
        this.Data.DataType=2; /*分钟走势图数据 */
        this.Data.Data=aryMinuteData;

        this.Name=data.name;
    }

    this.GetSymbolCacheData=function(dataName)
    {
        if (!this.Data) return new Array();

        var upperSymbol=this.Symbol.toUpperCase();

        switch(dataName)
        {
            case 'CLOSE':
            case 'C':
                return this.Data.GetClose();
            case 'VOL':
            case 'V':
                if (MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol) && this.DataType==HQ_DATA_TYPE.KLINE_ID) //!! A股K线量单位时股，分时图单位还是手
                    return this.Data.GetVol(100);   //A股的 把股转成手
                return this.Data.GetVol();
            case 'OPEN':
            case 'O':
                return this.Data.GetOpen();
            case 'HIGH':
            case 'H':
                return this.Data.GetHigh();
            case 'LOW':
            case 'L':
                return this.Data.GetLow();
            case 'AMOUNT':
            case 'AMO':
                return this.Data.GetAmount();

            case "OPI":         //文华 持仓量
            case 'VOLINSTK':    //通达信 持仓量
                return this.Data.GetPosition();

            
            case "ZSTJJ":      //均价
                return this.Data.GetAvPrice();
            
            case "SETTLE":  //文华 结算价
            case "QHJSJ":   //通达信 结算价
                return this.Data.GetSettlementPrice();  //结算价

            case "ISEQUAL": //平盘
                return this.Data.GetIsEqual();
            case "ISUP":    //收阳
                return this.Data.GetIsUp();
            case "ISDOWN":  //收阴
                return this.Data.GetIsDown();
        }
    }

    this.GetSymbolPeriodData=function(job)
    {
        var periodID=JSComplierHelper.GetPeriodInfo({ Name:job.PeriodName }).Period;
        var periodInfo={ PeriodID:periodID, PeriodName:job.PeriodName };
        //同周期不请求
        if (periodID==this.Period) this.Execute.RunNextJob(); 
        if (this.IsApiPeriod)
        {
            if (this.PeriodData.has(job.PeriodName)) return this.Execute.RunNextJob();
        }
        else
        {
            if (ChartData.IsDayPeriod(periodID,true)) 
            {
                if (ChartData.IsDayPeriod(this.Period,true)) return this.Execute.RunNextJob();
                periodInfo={PeriodID:0, PeriodName:'DAY' };
            }
            else if (ChartData.IsMinutePeriod(periodID,true))
            {
                if (ChartData.IsMinutePeriod(this.Period,true)) return this.Execute.RunNextJob();
                periodInfo={ PeriodID:4, PeriodName:"MIN1" };
            } 
            else
            {
                return this.Execute.RunNextJob();
            }
        }

        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSSymbolData::GetSymbolPeriodData',
                Explain:"跨周期数据",
                Request:
                { 
                    Data: 
                    {
                        "field": [ 'symbol','name', job.ValueName ],
                        "period":job.PeriodName,
                        "symbol": self.Symbol,
                    } 
                },
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvSymbolPeriodData(data, periodInfo);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        if (ChartData.IsMinutePeriod(periodID,true))
        {
            JSNetwork.HttpRequest({
                url: this.MinuteKLineApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol"],
                    "symbol": self.Symbol,
                    "start": -1,
                    "count": self.MaxRequestMinuteDayCount
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvSymbolPeriodData(data,periodInfo);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else if (ChartData.IsDayPeriod(periodID,true))
        {
            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol"],
                    "symbol": self.Symbol,
                    "start": -1,
                    "count": self.MaxRequestDataCount
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (data)
                {
                    self.RecvSymbolPeriodData(data, periodInfo);
                    self.Execute.RunNextJob();
                },
                error: function(request)
                {
                    self.RecvError(request);
                }
            });
        }
        else
        {
            return this.Execute.RunNextJob();
        }

    }

    this.RecvSymbolPeriodData=function(data, periodInfo)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvSymbolPeriodData] data, periodInfo ' , data, periodInfo);

        if (ChartData.IsDayPeriod(periodInfo.PeriodID,true)) 
        {
            var hisData=this.JsonDataToHistoryData(data);
            var dayData=new ChartData();
            dayData.DataType=0;     //日线数据
            dayData.Data=hisData;   //保存原始数据 不复权
            dayData.Right=0;
            dayData.Period=periodInfo.PeriodID;
            this.PeriodData.set(periodInfo.PeriodName, dayData);
        }
        else if (ChartData.IsMinutePeriod(periodInfo.PeriodID,true))
        {
            var hisData=this.JsonDataToMinuteHistoryData(data);
            var minData=new ChartData();
            minData.DataType=1;     //分钟线数据
            minData.Data=hisData;
            minData.Right=0;
            minData.Period=periodInfo.PeriodID;
            this.PeriodData.set(periodInfo.PeriodName, minData);
        }
    }

    this.GetSymbolPeriodCacheData=function(valueName,periodName)
    {
        var periodInfo=JSComplierHelper.GetPeriodInfo({Name:periodName});
        if (this.Period==periodInfo.Period)
            return this.GetSymbolCacheData(valueName);

        var hisData=null;
        if (this.IsApiPeriod)
        {
            var curPeriodInfo=JSComplierHelper.GetPeriodInfo({PeriodID:this.Period});
            if (!curPeriodInfo) return null;
            if (curPeriodInfo.Order>periodInfo.Order) return null;   //只能小周期转大周期

            if (!this.PeriodData.has(periodName)) return null;
            hisData=this.PeriodData.get(periodName);
            hisData=hisData.Data;
        }
        else
        {
            var curPeriodInfo=JSComplierHelper.GetPeriodInfo({PeriodID:this.Period});
            if (!curPeriodInfo) return null;

            if (curPeriodInfo.Order>periodInfo.Order) return null;   //只能小周期转大周期

            if (ChartData.IsDayPeriod(periodInfo.Period,true) && ChartData.IsMinutePeriod(this.Period,true))
            {
                var dayData=this.PeriodData.get('DAY'); //日线
                if (periodInfo.Period==0) hisData=dayData.Data;
                else hisData=dayData.GetPeriodData(periodInfo.Period);  //日线周期
            }
            else
            {
                var bindData=new ChartData();
                bindData.Data=this.SourceData.Data;
                bindData.Period=this.Period;
                bindData.Right=this.Right;

                if (ChartData.IsDayPeriod(periodInfo.Period,true) && bindData.Right>0) //日线数据才复权
                {
                    var rightData=bindData.GetRightData(bindData.Right);
                    bindData.Data=rightData;
                }

                hisData=bindData.GetPeriodData(periodInfo.Period);
            }
        }

        var data=this.Data.ConverPeriod(hisData, this.Period, periodInfo.Period);
        var result=new ChartData();
        result.Data=data;

        var upperSymbol=this.Symbol.toUpperCase();
        switch(valueName)
        {
            case 'C':
            case "CLOSE":
                return result.GetClose();
            case 'O':
            case "OPEN":
                return result.GetOpen();
            case 'H':
            case "HIGH":
                return result.GetHigh();
            case 'L':
            case "LOW":
                return result.GetLow();
            case 'AMO':
            case "AMOUNT":
                return result.GetAmount();
            case 'V':
            case "VOL":
                if (MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol)) 
                    return result.GetVol(100);
                return result.GetVol();
            case "VOLINSTK":
                return result.GetPosition();
            default:
                return null;
        }
    }

    this.GetSymbolPeriodCacheData2=function(valueName,periodName,n)
    {
        var periodInfo=JSComplierHelper.GetPeriodInfo({Name:periodName});
        if (!periodInfo) return null;

        var curPeriodInfo=JSComplierHelper.GetPeriodInfo({PeriodID:this.Period});
        if (!curPeriodInfo) return null;

        if (curPeriodInfo.Order>periodInfo.Order) return null;   //只能小周期转大周期

        var result;
        if (curPeriodInfo.Period==periodInfo.Period) 
        {
            result=this.Data;
        }
        else
        {
            var hisData;
            if (this.IsApiPeriod)
            {
                if (!this.PeriodData.has(periodName)) return null;
                hisData=this.PeriodData.get(periodName);
            }
            else
            {
                if (ChartData.IsMinutePeriod(curPeriodInfo.Period,true) && ChartData.IsDayPeriod(periodInfo.Period,true))
                {
                    var dayData=this.PeriodData.get('DAY'); //日线
                    if (periodInfo.Period==0) hisData=dayData;
                    else hisData=dayData.GetPeriodData(periodInfo.Period);  //日线周期
                }
                else
                {
                    var bindData=new ChartData();
                    bindData.Data=this.SourceData.Data;
                    bindData.Period=this.Period;
                    bindData.Right=this.Right;

                    if (ChartData.IsDayPeriod(periodInfo.Period,true) && bindData.Right>0) //日线数据才复权
                    {
                        var rightData=bindData.GetRightData(bindData.Right);
                        bindData.Data=rightData;
                    }

                    hisData=bindData.GetPeriodData(periodInfo.Period);
                }
            }

            var data=this.Data.ConverPeriod(hisData, this.Period, periodInfo.Period);
            var result=new ChartData();
            result.Data=data;
        }

        if (IFrameSplitOperator.IsPlusNumber(n))
        {
            var refResult=new ChartData();
            var data=result.GetRef(n);
            refResult.Data=data;
            result=refResult;
        }

        var upperSymbol=this.Symbol.toUpperCase();

        switch(valueName)
        {
            case 'C':
            case "CLOSE":
                return result.GetClose();
            case 'O':
            case "OPEN":
                return result.GetOpen();
            case 'H':
            case "HIGH":
                return result.GetHigh();
            case 'L':
            case "LOW":
                return result.GetLow();
            case 'AMO':
            case "AMOUNT":
                return result.GetAmount();
            case 'V':
            case "VOL":
                if (MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol)) 
                    return result.GetVol(100);
                return result.GetVol();
            case "VOLINSTK":
                return result.GetPosition();
            default:
                return null;
        }
    }

    this.GetCurrBarsCount=function()
    {
        let result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        let lCount=this.Data.Data.length;
        for(let i=lCount-1;i>=0;--i)
            result.push(i+1);   //数据从0开始

        return result;
    }

    //BARPOS 返回从第一根K线开始到当前的周期数。
    //注：
    //1、BARPOS返回本地已有的K线根数，从本机上存在的数据开始算起。
    //2、本机已有的第一根K线上返回值为1。
    this.GetBarPos=function()
    {
        let result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        let lCount=this.Data.Data.length;
        for(let i=0;i<lCount;++i)
            result.push(i+1);   

        return result;
    }

    this.GetTotalTradeMinuteCount=function()
    {
        var data=g_MinuteCoordinateData.GetCoordinateData(this.Symbol);
        if (data && data.Count>0) return data.Count-1;
        return 242;
    }

    this.GetTotalBarsCount=function()
    {
        let lCount=this.Data.Data.length;
        return lCount;
    }

    this.GetIsLastBar=function()
    {
        let result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result

        let lCount=this.Data.Data.length;
        for(let i=0;i<lCount;++i)
        {
            if (i==lCount-1) result.push(1);
            else result.push(0);
        }

        return result;
    }

    //BARSTATUS返回数据位置信息,1表示第一根K线,2表示最后一个数据,0表示中间位置.
    //例如:BARSTATUS=2表示当天是该数据的最后一个周期.
    this.GetBarStatus=function()
    {
        let result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result

        let lCount=this.Data.Data.length;
        for(var i=0 ;i<lCount;++i)
        {
            if (i==0) result[i]=1;
            else if (i==lCount-1) result[i]=2;
            else result[i]=0;
        }

        return result;
    }

    //求真实波幅, (最高-最低),(最高-昨收),(最低-昨收)三者绝对值中的最大值.
    //用法:
    //TR,求真实波幅.
    //例如:ATR:=MA(TR,10);
    //表示求真实波幅的10周期均值
    this.GetTRData=function(node)
    {
        var result=[];
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return result;

        let lCount=this.Data.Data.length;
        for(var i=0 ;i<lCount;++i)
        {
            var item=this.Data.Data[i];
            var max=null;
            if (IFrameSplitOperator.IsNumber(item.High) && IFrameSplitOperator.IsNumber(item.Low))
            {
                var value=Math.abs(item.High-item.Low);
                if (max==null || max<value) max=value;
            }

            if (IFrameSplitOperator.IsNumber(item.High) && IFrameSplitOperator.IsNumber(item.YClose))
            {
                var value=Math.abs(item.High-item.YClose);
                if (max==null || max<value) max=value;
            }

            if (IFrameSplitOperator.IsNumber(item.YClose) && IFrameSplitOperator.IsNumber(item.Low))
            {
                var value=Math.abs(item.Low-item.YClose);
                if (max==null || max<value) max=value;
            }

            result[i]=max;
        }


        return result;
    }

    //融资融券函数
    this.GetMarginCacheData=function(id, node)
    {
        let jobID=JS_EXECUTE_JOB_ID.GetMarginJobID(id);
        if (!jobID) this.Execute.ThrowUnexpectedNode(node,'不支持MARGIN('+id+')');
        if(this.MarginData.has(jobID)) return this.MarginData.get(jobID);

        return [];
    }

    //下融资融券
    this.GetMarginData=function(jobID)
    {
        if (this.MarginData.has(jobID)) return this.Execute.RunNextJob();

        JSConsole.Complier.Log('[JSSymbolData::GetMarginData] jobID=', jobID);
        var self=this;
        let fieldList=["name","date","symbol"];
        
        switch(jobID)
        {
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:           //融资融券余额
            fieldList.push("margin.balance");
            break;
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:              //融资占比
            fieldList.push("margin.rate");
            break;
    
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE:       //买入信息-融资余额
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT:        //买入信息-买入额
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY:         //买入信息-偿还额
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET:           //买入信息-融资净买入
            fieldList.push("margin.buy");
            break;
    
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE:      //卖出信息-融券余量
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME:       //卖出信息-卖出量
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY:        //卖出信息-偿还量
        case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET:          //卖出信息-融券净卖出
            fieldList.push("margin.sell");
            break;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.StockHistoryDayApiUrl,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "orderfield":"date"
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvMarginData(recvData,jobID);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvMarginData=function(data,jobID)
    {
        JSConsole.Complier.Log(data);
        if (!data.stock || data.stock.length!=1) return;

        let stock=data.stock[0];
        var aryData=new Array();
        var aryData2=[], aryData3=[], aryData4=[];  //其他3个数据
        for(let i in stock.stockday)    
        {
            var item=stock.stockday[i];
            var marginData=item.margin;
            if (!marginData) continue;

            let indexData=new SingleData();
            indexData.Date=item.date;

            switch(jobID)
            {
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:
                    if (!this.IsNumber(marginData.balance)) continue;
                    indexData.Value=marginData.balance; //融资融券余额
                    aryData.push(indexData);
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:
                    if (!this.IsNumber(marginData.rate)) continue;
                    indexData.Value=marginData.rate;    //融资占比
                    aryData.push(indexData);
                    break;

                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE:       //买入信息-融资余额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT:        //买入信息-买入额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY:         //买入信息-偿还额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET:           //买入信息-融资净买入
                    var buyData=marginData.buy;
                    if (!buyData) continue;
                    if (!this.IsNumber(buyData.balance) || !this.IsNumber(buyData.amount) || !this.IsNumber(buyData.repay) || !this.IsNumber(buyData.net)) continue;

                    indexData.Value=buyData.balance;
                    var indexData2=new SingleData();
                    indexData2.Date=item.date;
                    indexData2.Value=buyData.amount;
                    var indexData3=new SingleData();
                    indexData3.Date=item.date;
                    indexData3.Value=buyData.repay;
                    var indexData4=new SingleData();
                    indexData4.Date=item.date;
                    indexData4.Value=buyData.net;

                    aryData.push(indexData);
                    aryData2.push(indexData2);
                    aryData3.push(indexData3);
                    aryData4.push(indexData4);
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE:      //卖出信息-融券余量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME:       //卖出信息-卖出量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY:        //卖出信息-偿还量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET:          //卖出信息-融券净卖出
                    var sellData=marginData.sell;
                    if (!sellData) continue;
                    if (!this.IsNumber(sellData.balance) || !this.IsNumber(sellData.volume) || !this.IsNumber(sellData.repay) || !this.IsNumber(sellData.net)) continue;

                    indexData.Value=buyData.balance;
                    var indexData2=new SingleData();
                    indexData2.Date=item.date;
                    indexData2.Value=buyData.volume;
                    var indexData3=new SingleData();
                    indexData3.Date=item.date;
                    indexData3.Value=buyData.repay;
                    var indexData4=new SingleData();
                    indexData4.Date=item.date;
                    indexData4.Value=buyData.net;

                    aryData.push(indexData);
                    aryData2.push(indexData2);
                    aryData3.push(indexData3);
                    aryData4.push(indexData4);
                    break;
                default:
                    continue;
            }
        }

        var allData=[];
        if (jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE || jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE)
        {
            allData.push({JobID:jobID,Data:aryData});
        }
        else if (jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE || jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT ||
            jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY || jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET)
        {
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE,Data:aryData});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT,Data:aryData2});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY,Data:aryData3});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET,Data:aryData4});
        }
        else if (jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE || jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME ||
            jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY || jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET)
        {
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE,Data:aryData});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,Data:aryData2});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY,Data:aryData3});
            allData.push({JobID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET,Data:aryData4});
        }

        for(let i in allData)
        {
            let aryFixedData=this.SourceData.GetFittingData(allData[i].Data);

            var bindData=new ChartData();
            bindData.Data=aryFixedData;
            bindData.Period=this.Period;    //周期

            if (bindData.Period>0)          //周期数据
            {
                var periodData=bindData.GetPeriodSingleData(bindData.Period);
                bindData.Data=periodData;
            }

            let data=bindData.GetValue();
            this.MarginData.set(allData[i].JobID,data);
        }
    }

    this.GetNewsAnalysisCacheData=function(id,node)
    {

        let jobID=JS_EXECUTE_JOB_ID.GetNewsAnalysisID(id);
        if (!jobID) this.Execute.ThrowUnexpectedNode(node,'不支持NEWS('+id+')');
        if(this.NewsAnalysisData.has(jobID)) return this.NewsAnalysisData.get(jobID);

        return [];
    }

    this.GetHKToSHSZData=function(job)
    {
        var args=job.Args;
        var code=this.Symbol;
        if (args.length>0)
        {
            var item=args[0];
            if (item.Type==Syntax.Literal) 
            {
                code=item.Value;
            }
            else if (item.Type==Syntax.Identifier)  //变量 !!只支持默认的变量值
            {
                var isFind=false;
                for(var j in this.Arguments)
                {
                    const argItem=this.Arguments[j];
                    if (argItem.Name==item.Name)
                    {
                        code=argItem.Value;
                        isFind=true;
                        break;
                    }
                }

                if (!isFind) 
                {
                    var token=job.Token;
                    this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`HK2SHSZ() Error: can't read ${item.Name}`);
                }
            }
        }

        job.Symbol=code;

        if (code==1 || code==2 || code==3)    //下载全市场数据
            this.GetHKToSHSZMarketData(code,job);
        else
            this.GetHKToSHSZStockData(code,job);      //下载个股数据
    }

    this.GetHKToSHSZStockData=function(symbol,job)
    {
        if (this.HKToSHSZData.has(symbol)) return this.Execute.RunNextJob();

        var upperSymbol=symbol.toLowerCase();   //代码小写
        var self=this;
        var url=`${this.HKToSHSZApiUrl[3]}/${upperSymbol}.json`;
        //请求数据
        JSNetwork.HttpRequest({
            url: url,
            type:"get",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvHKToSHSZStockData(recvData,job);
                self.Execute.RunNextJob();
            },
            error:function(request)
            {
                console.warn(`[JSSymbolData::GetHKToSHSZStockData] request url=${url} failed. error=${request.status}`);
                self.RecvHKToSHSZStockData(null,job);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvHKToSHSZStockData=function(data,job)
    {
        if (!data) return;

        var symbol=data.symbol;
        var upperSymbol=symbol.toUpperCase();
        var aryData=[];
        for(var i=0;i<data.date.length;++i)
        {
            var item=new SingleData();
            item.Date=data.date[i];
            item.Value=data.vol[i];   //股
            aryData.push(item);
        }

        var aryFixedData=this.Data.GetFittingData(aryData);
        var bindData=new ChartData();
        bindData.Data=aryFixedData;
        bindData.Period=this.Period;    //周期

        if (bindData.Period>0)          //周期数据
        {
            var periodData=bindData.GetPeriodSingleData(bindData.Period);
            bindData.Data=periodData;
        }

        var data=bindData.GetValue();
        this.HKToSHSZData.set(upperSymbol,data);
    }

    this.GetHKToSHSZMarketData=function(symbol,job)
    {
        if (this.HKToSHSZData.has(symbol)) return this.Execute.RunNextJob();

        var url, dataType=0;
        if (this.DataType===HQ_DATA_TYPE.MINUTE_ID) dataType=1;
        else if (this.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) dataType=2;
        else if (this.Period<=3) dataType=0;

        url=this.HKToSHSZApiUrl[dataType];
        var self=this;
        JSConsole.Complier.Log(`[JSSymbolData::GetHKToSHSZMarketData] code=${symbol} url=${url}, dataType=${dataType}`);

        if (dataType===2)   //多日分时数据 (取这个股票的多日日期对应的北上数据)
        {
            //请求数据
            JSNetwork.HttpRequest({
                url: url,
                data:
                {
                    "symbol": this.Symbol,
                    'daycount': this.MaxRequestMinuteDayCount
                },
                type:"post",
                dataType: "json",
                async:true,
                success: function (recvData)
                {
                    self.RecvMulitMinuteHKToSHSZData(recvData,job);
                    self.Execute.RunNextJob();
                }
            });
        }
        else
        {
            //请求数据
            JSNetwork.HttpRequest({
                url: url,
                type:"get",
                dataType: "json",
                async:true,
                success: function (recvData)
                {
                    if (dataType==0) self.RecvHKToSHSZData(recvData,job);
                    else if (dataType==1) self.RecvMinuteHKToSHSZData(recvData,job);
                    self.Execute.RunNextJob();
                }
            });
        }
        
    }

    this.RecvMinuteHKToSHSZData=function(data,job)
    {
        var arySHSZData=[], arySHData=[], arySZData=[];
        if (this.IsBeforeData)
        {
            for( i in this.SourceData.Data)
            {
                var item=this.SourceData.Data[i];
                if (item.Before)
                {
                    arySHSZData.push(null);
                    arySHData.push(null);
                    arySZData.push(null);
                }
                else
                {
                    break;
                }
            }

            for(var i=0;i<data.time.length;++i)
            {
                var time=data.time[i];
                if (time===925) continue;

                var SHValue=data.hk2sh[i];
                var SZValue=data.hk2sz[i];
                var total=SHValue+SZValue;
    
                arySHSZData.push(total);
                arySHData.push(SHValue);
                arySZData.push(SZValue);
            }
        }
        else
        {
            for(var i=0;i<data.time.length;++i)
            {
                var time=data.time[i];
                var SHValue=data.hk2sh[i];
                var SZValue=data.hk2sz[i];
                var total=SHValue+SZValue;
    
                arySHSZData.push(total);
                arySHData.push(SHValue);
                arySZData.push(SZValue);
            }
        }

        var allData=
        [
            {Data:arySHSZData, ID:1}, 
            {Data:arySHData,ID:2}, 
            {Data:arySZData,ID:3}
        ];

        for(var i in allData)
        {
            var item=allData[i];
            this.HKToSHSZData.set(item.ID,item.Data);
        }
    }

    this.RecvHKToSHSZData=function(data,job)
    {
        var arySHSZData=[], arySHData=[], arySZData=[];
        for(var i=0;i<data.date.length;++i)
        {
            var date=data.date[i];
            var SHValue=data.hk2sh[i]*1000000;  //单位是百万
            var SZValue=data.hk2sz[i]*1000000;  //单位是百万
            var total=SHValue+SZValue;

            let itemSHSZData=new SingleData();
            itemSHSZData.Date=date;
            itemSHSZData.Value=total;

            let itemSHData=new SingleData();
            itemSHData.Date=date;
            itemSHData.Value=SHValue;

            let itemSZData=new SingleData();
            itemSZData.Date=date;
            itemSZData.Value=SZValue;

            arySHSZData.push(itemSHSZData);
            arySHData.push(itemSHData);
            arySZData.push(itemSZData);
        }

        var allData=
        [
            {Data:arySHSZData, ID:1}, 
            {Data:arySHData,ID:2 }, 
            {Data:arySZData,ID:3 }
        ];

        for(let i in allData)
        {
            let aryFixedData=this.Data.GetFittingData(allData[i].Data);

            var bindData=new ChartData();
            bindData.Data=aryFixedData;
            bindData.Period=this.Period;    //周期

            if (bindData.Period>0)          //周期数据
            {
                var periodData=bindData.GetPeriodSingleData(bindData.Period);
                bindData.Data=periodData;
            }

            let data=bindData.GetValue();
            this.HKToSHSZData.set(allData[i].ID,data);
        }
    }

    this.RecvMulitMinuteHKToSHSZData=function(data,job)   //多日分时图北上资金
    {
        if (!data.data || data.data.length<=0) return;

        var arySHSZData=[], arySHData=[], arySZData=[];
        for(var i=0 ,j=0;i<this.Data.Data.length && j<data.data.length; )
        {
            arySHSZData[i]=null;
            arySHData[i]=null;
            arySZData[i]=null;
            var item=this.Data.Data[i];
            var dateTime=item.DateTime; //日期加时间
            if (!dateTime) 
            {
                ++i;
                continue;
            }
            var aryValue=dateTime.split(' ');
            if (aryValue.length!=2) 
            {
                ++i;
                continue;
            }
            var date=parseInt(aryValue[0]);
            var day=data.data[j];
            if (!day.minute || day.minute.length<=0)
            {
                ++j;
                continue;
            }

            if (day.date>date)
            {
                ++i;
                continue;
            }
            else if (day.date<date)
            {
                ++j;
                continue;
            }

            for(var k in day.minute)
            {
                var timeItem=day.minute[k];

                var SHValue=timeItem[1];
                var SZValue=timeItem[2];
                var total=SHValue+SZValue;

                arySHSZData[i]=total;
                arySHData[i]=SHValue;
                arySZData[i]=SZValue;
                ++i;
            }

            ++j;
        }

        var allData=
        [
            {Data:arySHSZData, ID:1}, 
            {Data:arySHData,ID:2}, 
            {Data:arySZData,ID:3}
        ];

        for(var i in allData)
        {
            var item=allData[i];
            this.HKToSHSZData.set(item.ID,item.Data);
        }
        
    }

    //北上资金函数
    this.GetHKToSHSZCacheData=function(code, node)
    {
        //if (!this.HKToSHSZData.has(code)) this.Execute.ThrowUnexpectedNode(node,`不支持HK2SHSZ(${code})`);
        if (!code) code=this.Symbol;
        if (typeof(code)=='string') code=code.toUpperCase();
        if(this.HKToSHSZData.has(code)) return this.HKToSHSZData.get(code);
        return [];
    }

    //下载新闻统计
    this.GetNewsAnalysisData=function(jobID)
    {
        if (this.NewsAnalysisData.has(jobID)) return this.Execute.RunNextJob();

        var self=this;
        var mapFolder=new Map([
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE,     "negative"],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH,     'research'],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT,     'interact'],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE, 'holderchange'],      //NEWS(4)   股东增持
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2,'holderchange'],      //NEWS(5)   股东减持
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER,  'trustholder'],       //NEWS(6)   信托持股
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING, 'Blocktrading'],      //NEWS(7)   大宗交易
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS,  'companynews'],       //NEWS(8)   官网新闻
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS,  'topmanagers'],       //NEWS(9)   高管要闻
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE,       'Pledge'],            //NEWS(10)  股权质押
        ]);

        if (!mapFolder.has(jobID))
        {
            this.Execute.RunNextJob();
            return;
        }
        var folderName=mapFolder.get(jobID);
        var url=this.StockNewsAnalysisApiUrl+'/'+folderName+'/'+this.Symbol+'.json';

        //请求数据
        JSNetwork.HttpRequest({
            url: url,
            type:"get",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvNewsAnalysisData(recvData,jobID);
                self.Execute.RunNextJob();
            },
            error:function(request, textStatus)
            {
                self.RecvNewsAnalysisDataError(request, textStatus,jobID);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvNewsAnalysisDataError=function(request, textStatus,jobID)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvNewsAnalysisDataError] ajax error.',request.status);

        //没有新闻使用0数据填充
        var aryData=[];
        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=new SingleData();
            item.Date=this.Data.Data[i].Date;
            item.Value=0
            aryData.push(item);
        }

        var bindData=new ChartData();
        bindData.Data=aryData;
        this.NewsAnalysisData.set(jobID,bindData.GetValue());
    }

    this.RecvNewsAnalysisData=function(data,jobID)
    {
        if (!data.data || !data.date) return;
        if (data.data.length<=0 || data.data.length!=data.date.length) return;
        
        JSConsole.Complier.Log('[JSSymbolData::RecvNewsAnalysisData] jobID',jobID, data.update);
        if (jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE|| jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2)
        {
            var aryData=[], aryData2=[];
            for(var i=0;i<data.data.length;++i)
            {
                var item=new SingleData();
                item.Date=data.date[i];
                item.Value=data.data[i];
                if (this.IsNumber(item.Value)) aryData.push(item);

                if (i<data.data2.length)
                {
                    item=new SingleData();
                    item.Date=data.date[i];
                    item.Value=data.data2[i];
                    if (this.IsNumber(item.Value)) aryData2.push(item);
                }
            }

            let aryFixedData=this.Data.GetFittingData2(aryData,0);
            var bindData=new ChartData();
            bindData.Data=aryFixedData;
            this.NewsAnalysisData.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE,bindData.GetValue());

            aryFixedData=this.Data.GetFittingData2(aryData2,0);
            bindData=new ChartData();
            bindData.Data=aryFixedData;
            this.NewsAnalysisData.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2,bindData.GetValue());
        }
        else
        {
            var aryData=[];
            for(var i=0;i<data.data.length;++i)
            {
                var item=new SingleData();
                item.Date=data.date[i];
                item.Value=data.data[i];
                aryData.push(item);
            }

            let aryFixedData=this.Data.GetFittingData2(aryData,0);
            var bindData=new ChartData();
            bindData.Data=aryFixedData;
            this.NewsAnalysisData.set(jobID,bindData.GetValue());
        }
    }

    this.GetSectionFinanceData=function(job)
    {
        var sfKey=job.SF[0];
        var period=job.SF[1].Period;
        if (this.SectionFinanceData.has(sfKey)) return this.Execute.RunNextJob();

        JSConsole.Complier.Log(`[JSSymbolData::GetSectionFinanceData] ${period.Year}-${period.Quarter}`);
        var fieldName='announcement'+period.Quarter;
        var self=this;
        var fieldList=["name","date","symbol", fieldName,'finance'+period.Quarter];
        var cond=[fieldName+'.year', "int32", "eq", period.Year.toString() ];

        //请求数据
        JSNetwork.HttpRequest({
            url: this.StockHistoryDayApiUrl,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "condition":[{item:cond}]
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvSectionFinanceData(recvData,job);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvSectionFinanceData=function(data,job)
    {
        if (!data.stock || data.stock.length!=1) return;
        var stockItem=data.stock[0];
        if (!stockItem.stockday || stockItem.stockday.length<=0) return;
        var dayItem=stockItem.stockday[0];
        var period=job.SF[1].Period;
        var finance=null;
        if (period.Quarter===1) finance=dayItem.finance1;
        else if (period.Quarter===2) finance=dayItem.finance2;
        else if (period.Quarter===3) finance=dayItem.finance3;
        else if (period.Quarter===4) finance=dayItem.finance4;
        if (!finance) return;
        
        var data=new Map([
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_01,finance.currentassets],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_02,finance.monetaryfunds],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_03,finance.inventory],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_04,finance.currentliabilities],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_05,finance.ncurrentliabilities],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_06,finance.expenses3],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_07,finance.investmentincome],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_08,finance.pcnprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_09,finance.nnetprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_10,finance.npersearning],

            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_11,finance.woewa],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_12,finance.inprocess],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_13,finance.accdepreciation],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_14,finance.mholderprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_15,finance.lossexchange],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_16,finance.baddebts],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_17,finance.fixedassets],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_18,finance.curdepreciation],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_19,finance.orevenues],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_20,finance.moprofit],

            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_21,finance.oprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_22,finance.nprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_23,finance.areceivable],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_24,finance.financialcost],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_25,finance.ccfo],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_26,finance.totalassets],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_27,finance.totalliabilities],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_28,finance.totalownersequity],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_29,finance.grossmargin],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_30,finance.percreserve],

            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_31,finance.peruprofit],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_32,finance.persearning],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_33,finance.pernetasset],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_34,finance.perccfo],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_38,finance.alratio],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_39,finance.profityoy],
        ]);

        if (period.Quarter===4) //年报才有的数据
        {
            data.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_35,finance.nnprofitincrease);
            data.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_36,finance.nnprofitspeed);
            data.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_37,finance.nprofitincrease);
        }

        var sfKey=job.SF[0];
        this.SectionFinanceData.set(sfKey,data);
    }

    this.GetSectionFinanceCacheData=function(year,quarter,fieldName,node)
    {
        var period=JS_EXECUTE_JOB_ID.GetSectionReportPeriod(year,quarter);
        if (!period) this.Execute.ThrowUnexpectedNode(node,`不支持FS(${year}, ${quarter}, '${fieldName}') 报告期错误`);
        var id=JS_EXECUTE_JOB_ID.GetSectionFinanceID(fieldName);
        if (!id) this.Execute.ThrowUnexpectedNode(node,`不支持FS(${year}, ${quarter},'${fieldName}') 财务数据字段名称错误`);

        var sfKey=period.Year+'-'+period.Quarter;
        if (!this.SectionFinanceData.has(sfKey) && !this.ThrowSFPeirod.has(sfKey)) //动态下载的数据, 抛异常以后重新下载执行
        {
            this.ThrowSFPeirod.add(sfKey);  //抛过的异常就不抛了
            var job={ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_SF, SF:[sfKey, {Period:period, Fields:new Set([id])}]};
            this.Execute.ThrowDownloadSF(node, job, `FS(${year}, ${quarter}, '${fieldName}') 动态下载`);
        }

        if (!this.SectionFinanceData.has(sfKey)) 
            return this.Execute.ThrowUnexpectedNode(node,`不支持FS(${year}, ${quarter}, '${fieldName}') 没有这期财务数据`);

        var financeData=this.SectionFinanceData.get(sfKey);
        if (!financeData.has(id)) this.Execute.ThrowUnexpectedNode(node,`不支持FS(${year}, ${quarter}, '${fieldName}') 没有这期财务数据字段`);

        return financeData.get(id);
    }

    this.GetFinOne=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 3);
        var key=this.GetStockDataKey(jobItem,aryArgs);
        if (this.StockData.has(key)) return this.Execute.RunNextJob();
        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetFinOne', //类名::
                Explain:'财务数据FINONE(ID,Y,MMDD)',
                JobID:jobItem.ID,
                Request:{ Url:self.StockHistoryDayApiUrl, Type:'POST', Data:{ Args:aryArgs, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                self.RecvStockValue(recvData,jobItem,key,1);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var apiDownload=new DownloadFinOneData( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl, 
                Args:aryArgs,
                DataKey:key,
                Callback:function(recvData, jobItem, key) 
                { 
                    self.RecvStockValue(recvData, jobItem, key,1);
                    self.Execute.RunNextJob();
                },
                ErrorCallback:function(strError)
                {
                    self.AddStockValueError(key,strError);
                }
            });

        apiDownload.Download();
    }

    this.GetStockDataKey=function(jobItem, aryArgs)
    {
        var key=jobItem.FunctionName;
        if (aryArgs.length>0)
        {
            key+="(";
            for(var i=0;i<aryArgs.length;++i)
            {
                if (i>0) key+=",";
                key+=aryArgs[i].toString();
            }
            key+=")";
        }

        return key;
    }

    this.GetFinValue=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 1);
        var lID=aryArgs[0];
        var key=this.GetStockDataKey(jobItem,aryArgs);
        if (this.StockData.has(key)) return this.Execute.RunNextJob();
        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetFinValue', //类名::
                Explain:'财务数据FINVALUE(ID)',
                JobID:jobItem.ID,
                Request:{ Url:self.StockHistoryDayApiUrl, Type:'POST', Data:{ id:lID, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                self.RecvStockValue(recvData,jobItem,key,0);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var apiDownload=new DownloadFinValueData( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl, 
                Args:aryArgs,
                DataKey:key,
                Callback:function(recvData, jobItem, key) 
                { 
                    self.RecvStockValue(recvData, jobItem, key,0);
                    self.Execute.RunNextJob();
                },
                ErrorCallback:function(strError)
                {
                    self.AddStockValueError(key,strError);
                }
            });

        apiDownload.Download();
    }

    this.GetFinance=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 1);
        var lID=aryArgs[0];
        var key=this.GetStockDataKey(jobItem,aryArgs);
        if (this.StockData.has(key)) return this.Execute.RunNextJob();

        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetFinance', //类名::
                Explain:'财务数据FINANCE(ID)',
                JobID:jobItem.ID,
                Request:{ Url:self.RealtimeApiUrl, Type:'POST', Data:{ id:lID, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                if (recvData.Error) self.AddStockValueError(key,recvData.Error);
                else self.RecvStockValue(recvData,jobItem,key,0);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var apiDownload=new DownloadFinanceData( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl, 
                RealtimeUrl:this.RealtimeApiUrl,
                Args:aryArgs,
                DataKey:key,
                Callback:function(recvData, jobItem, key) 
                { 
                    self.RecvStockValue(recvData, jobItem, key,0);
                    self.Execute.RunNextJob();
                },
                ErrorCallback:function(strError)
                {
                    self.AddStockValueError(key,strError);
                }
            });

        apiDownload.Download();
    }

    this.GetGPJYValue=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 3);
        var key=this.GetStockDataKey(jobItem,aryArgs);
        if (this.StockData.has(key)) return this.Execute.RunNextJob();

        var self=this;
        //TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
        var dataType=aryArgs[2]==1?0:2;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetGPJYValue', //类名::
                Explain:'股票交易类数据GPJYVALUE(ID,N,TYPE)',
                JobID:jobItem.ID,
                Request:{ Url:self.StockHistoryDayApiUrl, Type:'POST', Data:{ Args:aryArgs, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                self.RecvStockValue(recvData,jobItem,key,dataType);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var apiDownload=new DownloadGPJYValue( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl,
                Args:aryArgs,
                DataKey:key,
                Callback:function(recvData, jobItem, key) 
                { 
                    self.RecvStockValue(recvData, jobItem, key,dataType);
                    self.Execute.RunNextJob();
                },
                ErrorCallback:function(strError)
                {
                    self.AddStockValueError(key,strError);
                }
            });

        apiDownload.Download();
    }

    this.GetSCJYValue=function(jobItem)
    {
        var aryArgs=this.JobArgumentsToArray(jobItem, 3);
        var key=this.GetStockDataKey(jobItem,aryArgs);
        if (this.StockData.has(key)) return this.Execute.RunNextJob();

        var self=this;
        //TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
        var dataType=aryArgs[2]==1?0:2;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetSCJYValue', //类名::
                Explain:'股票交易类数据SCJYVALUE(ID,N,TYPE)',
                JobID:jobItem.ID,
                Request:{ Url:self.StockHistoryDayApiUrl, Type:'POST', Data:{ Args:aryArgs, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                self.RecvStockValue(recvData,jobItem,key,dataType);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var apiDownload=new DownloadSCJYValue( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl,
                Args:aryArgs,
                DataKey:key,
                Callback:function(recvData, jobItem, key) 
                { 
                    self.RecvStockValue(recvData, jobItem, key,dataType);
                    self.Execute.RunNextJob();
                },
                ErrorCallback:function(strError)
                {
                    self.AddStockValueError(key,strError);
                }
            });

        apiDownload.Download();
    }

    this.GetVariantData=function(jobItem)
    {
        var key=jobItem.VariantName;
        if (this.StockData.has(key)) return this.Execute.RunNextJob();

        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetVariantData', //类名::函数名
                Explain:'变量数据下载',
                JobID:jobItem.ID,
                Request:{ Url:"数据地址", Type:'POST', Data:{ VariantName:jobItem.VariantName, symbol: this.Symbol, daterange:dateRange } },
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                if (recvData.Error) 
                {
                    self.AddStockValueError(key,recvData.Error);
                }
                else
                {
                    var dataType=0;
                    if (IFrameSplitOperator.IsNumber(recvData.DataType)) dataType=recvData.DataType;
                    self.RecvStockValue(recvData.Data,jobItem,key,dataType);
                }
               
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        var errorCallback=function(strError)
        {
            self.AddStockValueError(key,strError);
        };

        var apiDownload;
        if (jobItem.VariantName=="CAPITAL" || jobItem.VariantName=="TOTALCAPITAL" || jobItem.VariantName=="EXCHANGE")
        {
            var callback=function(recvData, jobItem, key) 
            { 
                self.RecvStockValue(recvData, jobItem, key,0);
                self.Execute.RunNextJob();
            };

            apiDownload=new DownloadFinanceData( 
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl, 
                RealtimeUrl:this.RealtimeApiUrl,
                Args:[jobItem.VariantName],
                DataKey:key,
                Callback:callback,
                ErrorCallback:errorCallback
            });
        }
        else if (jobItem.VariantName=="HYBLOCK" || jobItem.VariantName=="DYBLOCK" || jobItem.VariantName=="GNBLOCK")
        {
            var callback=function(recvData, jobItem, key, dataType) 
            { 
                self.RecvStockValue(recvData, jobItem, key, dataType);
                self.Execute.RunNextJob();
            };

            apiDownload=new DownloadGroupData(
            {
                Job:jobItem, 
                Symbol:this.Symbol, 
                Url:this.StockHistoryDayApiUrl, 
                RealtimeUrl:this.RealtimeApiUrl,
                Args:[jobItem.VariantName],
                DataKey:key,
                Callback:callback,
                ErrorCallback:errorCallback
            });
        }
        else if (jobItem.VariantName=="INBLOCK")
        {
            var errorMessage=`${jobItem.VariantName}, 请对接外部数据.`;
            this.AddStockValueError(key,errorMessage);
            this.Execute.RunNextJob();
            return;
        }
        else
        {
            var errorMessage=`不支持变量${jobItem.VariantName}, 请对接外部数据.`;
            this.AddStockValueError(key,errorMessage);
            this.Execute.RunNextJob();
            return;
        }

        apiDownload.Download();
    }

    //自定义变量数据下载
    this.GetCustomVariantData=function(jobItem)
    {
        var key=jobItem.VariantName;
        if (this.StockData.has(key)) return this.Execute.RunNextJob();

        var variantInfo=g_JSComplierResource.CustomVariant.Data.get(key);
        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetCustomVariantData', //类名::函数名
                Explain:'自定义变量数据下载',
                JobID:jobItem.ID,
                Request:
                { 
                    Url:"数据地址", Type:'POST', 
                    Data:{ VariantName:jobItem.VariantName, symbol: this.Symbol, daterange:dateRange, period:this.Period, right:this.Right } 
                },
                Self:this,
                VariantInfo:variantInfo,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                if (recvData.Error) self.AddStockValueError(key,recvData.Error);
                else self.RecvStockValue(recvData.Data,jobItem,key,recvData.DataType);
                self.Execute.RunNextJob();
            });
        }
        else
        {
            this.AddStockValueError(key, `自定义变量${key}下载失败`);
            this.Execute.RunNextJob();
        }
    }

    this.GetCustomFunctionData=function(jobItem)
    { 
        var key=jobItem.FunctionName;
        var functionInfo=g_JSComplierResource.CustomFunction.Data.get(key);
        if (!functionInfo.IsDownload) return this.Execute.RunNextJob();
        if (this.StockData.has(key)) return this.Execute.RunNextJob();  //一个函数只能缓存一个数据, 保存多个外部自己保存

        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetCustomFunctionData', //类名::函数名
                Explain:'自定义函数数据下载',
                JobID:jobItem.ID,
                Request:
                { 
                    Url:"数据地址", Type:'POST', 
                    Data:
                    { 
                        FunctionName:jobItem.FunctionName, 
                        symbol: this.Symbol, daterange:dateRange,
                        JobItem:jobItem, //函数编译信息
                        period:this.Period,
                        right:this.Right,
                    } 
                },
                Self:this,
                FunctionInfo:functionInfo,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                if (recvData.Error) self.AddStockValueError(key,recvData.Error);
                else self.RecvStockValue(recvData.Data,jobItem,key,recvData.DataType);
                self.Execute.RunNextJob();
            });
        }
        else
        {
            this.AddStockValueError(key, `自定义函数${key}下载失败`);
            this.Execute.RunNextJob();
        }
    }


    this.GetCustomFunctionDataV2=function(jobItem)
    {
        var funcName=jobItem.FunctionName;
        var functionInfo=g_JSComplierResource.CustomDataFunction.Data.get(funcName);
        if (!functionInfo) return;

        var aryArgs=this.JobArgumentsToArray(jobItem, functionInfo.ArgCount);
        var key=this.GetStockDataKey(jobItem,aryArgs);
        
        if (this.StockData.has(key)) return this.Execute.RunNextJob();  //一个函数只能缓存一个数据, 保存多个外部自己保存

        var self=this;
        if (this.NetworkFilter)
        {
            var dateRange=this.Data.GetDateRange();
            var obj=
            {
                Name:'JSSymbolData::GetCustomFunctionData', //类名::函数名
                Explain:'自定义函数数据下载',
                JobID:jobItem.ID,
                Request:
                { 
                    Url:"数据地址", Type:'POST', 
                    Data:
                    { 
                        FunctionName:jobItem.FunctionName, 
                        symbol: this.Symbol, daterange:dateRange,
                        JobItem:jobItem, //函数编译信息
                        Key:key,
                        period:this.Period,
                        right:this.Right,
                    } 
                },
                Self:this,
                FunctionInfo:functionInfo,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(recvData) 
            { 
                if (recvData.Error) self.AddStockValueError(key,recvData.Error);
                else self.RecvStockValue(recvData.Data,jobItem,key,recvData.DataType);
                self.Execute.RunNextJob();
            });
        }
        else
        {
            this.AddStockValueError(key, `自定义函数${key}下载失败`);
            this.Execute.RunNextJob();
        }
    }

    this.RecvStockValue=function(recvData,jobItem,key,dataType)
    {
        if (!recvData)
        {
            JSConsole.Complier.Log(`[JSSymbolData::RecvStockValue] key=${key} data is null`);
            return;
        }

        if (dataType==0)
        {
            if (Array.isArray(recvData))
            {
                var kdata=this.Data;   //K线
                var aryFittingData;
                if (this.DataType==HQ_DATA_TYPE.KLINE_ID)
                {
                    if (ChartData.IsDayPeriod(this.Period,true))
                        aryFittingData=kdata.GetFittingFinanceData(recvData);        //数据和主图K线拟合
                    else if (ChartData.IsMinutePeriod(this.Period,true))
                        aryFittingData=kdata.GetMinuteFittingFinanceData(recvData);  //数据和主图K线拟合
                    else 
                        return;
                }
                else
                {
                    aryFittingData=kdata.GetMinuteFittingFinanceData(recvData);     //数据和主图分时拟合
                }
                
                var bindData=new ChartData();
                bindData.Data=aryFittingData;
                var result=bindData.GetValue();

                if (key=="EXCHANGE")    //计算换手率=成交量/流通股本*100
                {
                    for(var i in result)
                    {
                        var kitem=kdata.Data[i];
                        if (IFrameSplitOperator.IsPlusNumber(result[i]))
                            result[i]=kitem.Vol/result[i] * 100;
                    }
                }
        
                this.StockData.set(key,{ Data:result });
            }
            else 
            {
                this.StockData.set(key,{ Data:recvData.Value });
            }
        }
        else if (dataType==1)   //单数值
        {
            this.StockData.set(key,{ Data:recvData.Value });
        }
        else if (dataType==2)
        {
            var kdata=this.Data;   //K线
            var aryFittingData;
            if (this.DataType==HQ_DATA_TYPE.KLINE_ID)
            {
                if (ChartData.IsDayPeriod(this.Period,true))
                    aryFittingData=kdata.GetFittingTradeData(recvData, 0);        //数据和主图K线拟合
                else if (ChartData.IsMinutePeriod(this.Period,true))
                    aryFittingData=kdata.GetMinuteFittingTradeData(recvData, 0);  //数据和主图K线拟合
                else if (ChartData.IsTickPeriod(this.Period))
                    aryFittingData=kdata.GetMinuteFittingTradeData(recvData, 0);  //数据和主图K线拟合
                else 
                    return;
            }
            else
            {
                aryFittingData=kdata.GetMinuteFittingTradeData(recvData, 0);  //数据和主图分钟拟合
            }
    
            var bindData=new ChartData();
            bindData.Data=aryFittingData;
            var result=bindData.GetValue();
    
            this.StockData.set(key,{ Data:result });
        }
    }

    this.AddStockValueError=function(key, message)
    {
        this.StockData.set(key,{ Error:message  });
    }

    this.GetStockCacheData=function(obj)
    {
        var key;
        if (obj.FunctionName)
            key=this.GetStockDataKey({FunctionName:obj.FunctionName}, obj.Args);
        else if (obj.VariantName)
            key=obj.VariantName;
        else if (obj.CustomName)
            key=obj.CustomName;  //自定义名字
        else
            return null;

        if (!this.StockData.has(key)) return null;
        var data=this.StockData.get(key);

        if (data.Error) this.Execute.ThrowUnexpectedNode(obj.Node, data.Error);
        return data.Data;
    }

    this.IsInBlock=function(blockName, node)
    {
        var data=this.GetStockCacheData({ VariantName:"INBLOCK", Node:node });
        if (!data) return 0;
        var aryBlock=data.split('|');
        for(var i=0; i<aryBlock.length; ++i)
        {
            var item=aryBlock[i];
            if (item==blockName) return 1;
        }

        return 0;
    }

    this.JobArgumentsToArray=function(job, lCount)
    {
        var args=job.Args;
        if (args.length!=lCount) 
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.FunctionName}() Error: argument count error.`);
        }

        var aryValue=[];
        for(var i=0;i<args.length;++i)
        {
            var item=args[i];
            if (IFrameSplitOperator.IsNumber(item))
            {
                aryValue.push(item);
            }
            else if (item.Type==Syntax.Literal) 
            {
                aryValue.push(item.Value);
            }
            else if (item.Type==Syntax.Identifier)  //变量 !!只支持默认的变量值
            {
                var isFind=false;
                for(var j in this.Arguments)
                {
                    const argItem=this.Arguments[j];
                    if (argItem.Name==item.Name)
                    {
                        aryValue.push(argItem.Value);
                        isFind=true;
                        break;
                    }
                }

                if (!isFind) 
                {
                    var token=job.Token;
                    this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`${job.FunctionName}() Error: can't read ${item.Name}`);
                }
            }
        }

        return aryValue;
    }

    this.DownloadCustomAPIData=function(job)
    {
        if (!this.NetworkFilter) return this.Execute.RunNextJob();

        var args=[];
        for(var i in job.Args)
        {
            var item=job.Args[i];
            if (item.Type==Syntax.Literal) 
            {
                args.push(item.Value);
            }
            else if (item.Type==Syntax.Identifier)  //变量 !!只支持默认的变量值
            {
                var isFind=false;
                for(var j in this.Arguments)
                {
                    const argItem=this.Arguments[j];
                    if (argItem.Name==item.Name)
                    {
                        args.push(argItem.Value);
                        isFind=true;
                        break;
                    }
                }

                if (!isFind) 
                {
                    var token=job.Token;
                    this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`LoadAPIData() Error: can't read ${item.Name}`);
                }
            }
            else 
            {
                return this.Execute.RunNextJob();
            }
        }

        var self=this;
        var obj=
        {
            Name:'JSSymbolData::DownloadCustomAPIData', //类名::函数名
            Explain:'下载自定义api数据',
            Period:this.Period,
            Right:this.Right,
            Symbol:this.Symbol,
            KData:this.Data,        //K线数据
            Cache:this.CustomAPIData,
            Args:args,
            Self:this,
            PreventDefault:false
        };

        this.NetworkFilter(obj, function(data) 
        { 
            self.RecvCustomAPIData(data,args);
            self.Execute.RunNextJob();
        });

        if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求

        this.Execute.RunNextJob();
    }

    /*
    recvData: 
    { 
        Type: 0=集合数据(默认)  1=单列数据
        DataType: 0=K线类数据  1=财务类数据
    }
    */
    this.RecvCustomAPIData=function(recvData,args)
    {
        if (!recvData) return;

        if (recvData.Type==1) 
            this.RecvCustomAPISingleData(recvData,args);
        else 
            this.RecvCustomAPIGroupData(recvData,args);
    }

    //集合数据
    this.RecvCustomAPIGroupData=function(recvData,args)
    {
        if (!recvData || !recvData.data) return;

        var data=recvData.data;
        var apiKey=this.GenerateCustomAPIKey(args);
        if (ChartData.IsMinutePeriod(this.Period,true)) //分钟 TODO:
        {
            if (!data.date || !data.time) return;

            var date=data.date;
            var time=data.time;
            for (var key in data)
            {
                if (key=='date' || key=='time') continue;
                var item=data[key];
            }
        }
        else if (ChartData.IsDayPeriod(this.Period,true))
        {
            if (!data.date) return;

            var date=data.date;
            var result={ __Type__:"Object" };
            for (var key in data)
            {
                if (key=='date') continue;

                var item=data[key];
                if (Array.isArray(item))
                {
                    var value=this.FittingCustomAPIArray(item,date);
                    result[key]=value;
                }
                else if (this.IsNumber(item))
                {
                    result[key]=item;
                }
            }

            this.CustomAPIData.set(apiKey, result);
        }
    }

    //单列数据
    this.RecvCustomAPISingleData=function(recvData,args)
    {
        var data=recvData.data;
        var apiKey=this.GenerateCustomAPIKey(args);
        if (ChartData.IsMinutePeriod(this.Period,true)) //分钟 TODO:
        {
            if (!data.date || !data.time) return;

            var date=data.date;
            var time=data.time;
            for (var key in data)
            {
                if (key=='date' || key=='time') continue;
                var item=data[key];
            }
        }
        else if (ChartData.IsDayPeriod(this.Period,true))   //日线
        {
            if (!data.date) return;

            var date=data.date;
            var value=data.value;

            var result=null;
            if (Array.isArray(value))
            {
                if (recvData.DataType==1) result=this.FittingCustomAPIFinanceArray(value,date);
                else result=this.FittingCustomAPIArray(value,date);
            }
            else
            {
                result=value;
            }

            this.CustomAPIData.set(apiKey, result);
        }
    }

    //财务数据拟合
    this.FittingCustomAPIFinanceArray=function(data, date, time)
    {
        var kdata=this.Data;   //K线
        var arySingleData=[];

        for(var i in data)
        {
            var value=data[i];
            var indexItem=new SingleData();
            indexItem.Date=date[i];
            if (time && i<time.length) indexItem.Time=time[i];
            indexItem.Value=value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (ChartData.IsDayPeriod(this.Period,true))
            aryFittingData=kdata.GetFittingFinanceData(arySingleData);        
        else if (ChartData.IsMinutePeriod(this.Period,true))
            aryFittingData=kdata.GetMinuteFittingFinanceData(arySingleData); 
        else 
            return null;

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        var result=bindData.GetValue();
        return result;
    }

    //K线类数据拟合
    this.FittingCustomAPIArray=function(data,date,time)
    {
        var kdata=this.Data;   //K线

        var arySingleData=[];
        for(var i in data)
        {
            var value=data[i];
            var indexItem=new SingleData(); //单列指标数据
            indexItem.Date=date[i];
            if (time && i<time.length) indexItem.Time=time[i];
            indexItem.Value=value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (ChartData.IsDayPeriod(this.Period,true))
            aryFittingData=kdata.GetFittingData(arySingleData);        //数据和主图K线拟合
        else if (ChartData.IsMinutePeriod(this.Period,true))
            aryFittingData=kdata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合
        else 
            return null;

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        var result=bindData.GetValue();
        return result;
    }

    this.GenerateCustomAPIKey=function(args)
    {
        if (args.length<=0) return '__12_EMPTY_ARGS__';

        var key='';
        for(var i in args)
        {
            if (key.length>0) key+=','
            key+=args[i];
        }

        return key;
    }

    this.GetCustomApiData=function(args)
    {
        var key=this.GenerateCustomAPIKey(args);

        if (!this.CustomAPIData.has(key)) 
        {
            JSConsole.Complier.Log(`[JSSymbolData::GetCustomApiData] can't find api data key=[${key}]`);
            return null;
        }

        return this.CustomAPIData.get(key);
    }

    this.ReadArgumentValue=function(item, result)    //读取变量值
    {
        result.Name=item.Name;
        if (item.Type==Syntax.Literal)
        {
            result.Value=item.Value;
            return true;
        }

        if (item.Type==Syntax.Identifier)
        {
            var isFind=false;
            for(var i in this.Arguments)
            {
                const argItem=this.Arguments[i];
                if (argItem.Name==item.Name)
                {
                    result.Value=argItem.Value;
                    isFind=true;
                    return true;
                }
            }

            if (!isFind) 
            {
                result.Error=`can't read ${item.Name}` ;
                return false;
            }
        }

        result.Error=`can't read ${item.Name}, type error.`;
        return false;
    }

    this.ReadIndexFunctionOut=function(item, result)
    {
        var indexParam={};
        if (typeof(item)=== 'object')
        {
            if (!this.ReadArgumentValue(item,indexParam))
            {
                result.Error=indexParam.Error;
                return false;
            }
        }
        else
        {
            indexParam.Value=item;
        }

        result.OutIndex=indexParam.Value;
        result.Out=null;
        return true;
    }

    //MA.MA1#WEEK
    this.ReadIndexFunctionValue=function(item, result)  //返回 {Period:周期, Out:输出变量, Error:, Name:脚本名字 }
    {
        var indexParam={};
        if (typeof(item)=== 'object')
        {
            if (!this.ReadArgumentValue(item,indexParam))
            {
                result.Error=indexParam.Error;
                return false;
            }
        }
        else
        {
            indexParam.Value=item;
        }
        
        var pos=indexParam.Value.indexOf("\.");
        if (pos!=-1)
        {
            result.Name=indexParam.Value.slice(0, pos);     //名字
            var pos2=indexParam.Value.indexOf('#', pos+1);
            if (pos2!=-1)
            {
                result.Out=indexParam.Value.slice(pos+1, pos2); //输出变量
                result.Period=indexParam.Value.slice(pos2+1);     //周期
            }
            else
            {
                result.Out=indexParam.Value.slice(pos+1);
            }
        }
        else
        {
            var pos2=indexParam.Value.indexOf('#');
            if (pos2!=-1)
            {
                result.Name=indexParam.Value.slice(0,pos2);
                result.Period=indexParam.Value.slice(pos2+1);     //周期
            }
            else
            {
                result.Name=indexParam.Value;
            }
        }

        const PERIOD_MAP=new Map([
            ["DAY",0 ], ["WEEK", 1 ], ["MONTH",2 ], ["SEASON",9 ], ["YEAR", 3], ["HALFYEAR",22], ["WEEK2",21],
            ["MIN1", 4], ["MIN5", 5 ], ["MIN15", 6 ], ["MIN30",7 ], ["MIN60", 8 ],["MIN120",11],["MIN240",12],

            ["DAY2", 40002],["MULTIDAY",40002],["DAY3", 40003],["DAY4", 40004],["DAY5",40005],
            ["DAY6", 40006],["DAY7", 40007],["DAY8", 40008],["DAY9", 40009],["DAY10",40010],
            ["DAY11", 40011],["DAY12", 40012],["DAY13", 40013],["DAY14", 40014],["DAY15", 40015],
        ]);

        if (result.Period)
        {
            if (!PERIOD_MAP.has(result.Period))
            {
                result.Error=`${result.Period}, 周期错误`;
                return false;
            }
            result.PeriodID=PERIOD_MAP.get(result.Period);
        }
        return true;
    }

    this.ReadSymbolArgumentValue=function(item, result) //返回{ Value:股票代码, Error:错误信息}
    {
        var readArgument={};
        if (typeof(item)=== 'object')
        {
            if (!this.ReadArgumentValue(item,readArgument))
            {
                result.Error=readArgument.Error;
                return false;
            }
        }
        else
        {
            readArgument.Value=item;
        }

        if (readArgument.Value=='') readArgument.Value=this.Symbol; //缺省使用股票代码

        var symbol=readArgument.Value;

        //支持 SH60000, SZ000001
        //A股后缀小写
        if (symbol.indexOf('.SH')>0) result.Symbol=symbol.replace('.SH', ".sh");
        else if (symbol.indexOf('.SZ')>0) result.Symbol=symbol.replace('.SZ', ".sz");
        else if (symbol.indexOf("SH")==0) result.Symbol=symbol.slice(2)+".sh";
        else if (symbol.indexOf("SZ")==0) result.Symbol=symbol.slice(2)+".sz";
        else result.Symbol=symbol;

        return true;
    }

    this.ReadIndexArgumentValue=function(args, result)
    {
        result.Args=[];
        for(var i in result.SytemIndex.Args)    //复制参数
        {
            var item=result.SytemIndex.Args[i];
            result.Args.push({Value:item.Value, Name:item.Name});
        }

        if (args.length>2 && result.SytemIndex.Args && result.SytemIndex.Args.length>0)
        {
            for(var i=2, j=0; i<args.length && j<result.SytemIndex.Args.length; ++i, ++j)
            {
                var readArgument={};
                var item=args[i];
                if (typeof(item)=== 'object')
                {
                    if (!this.ReadArgumentValue(item,readArgument))
                    {
                        result.Error=readArgument.Error;
                        return false;
                    }
                }
                else
                {
                    readArgument.Value=item;
                }

                result.Args[j].Value=readArgument.Value;
            }
        }

        return true;
    }

    //key= (代码,周期),指标(参数) => 输出
    this.GenerateScriptIndexKey=function(indexInfo)
    {
        var indexParam='';
        var args=indexInfo.Args;
        for(var i in args)
        {
            if (indexParam.length>0) indexParam+=',';
            var item=args[i];
            indexParam+=item.Value.toString();
        }

        var out="ALL";
        if (indexInfo.Out) out=indexInfo.Out;
        else if (IFrameSplitOperator.IsPlusNumber(indexInfo.OutIndex)) out=`Out[${indexInfo.OutIndex-1}]`;
        var key=`(${indexInfo.Symbol},${indexInfo.PeriodID}), ${indexInfo.Name}(${indexParam})=>${out}`;

        return key;
    }

    //TMP2:=KDJ.K#WEEK;
    this.CallMemberScriptIndex=function(job)
    {
        if (job.Member.Object.Type!=Syntax.Identifier ||job.Member.Property.Type!=Syntax.Identifier)
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallMemberScriptIndex() Error: 参数错误`);
        }

        var objName=job.Member.Object.Name;
        var PropertyName=job.Member.Property.Name;
        if (PropertyName=="" || PropertyName==null)
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallMemberScriptIndex() Error: ${objName}.${PropertyName} 指标输出变量错误`);
        }
        
        if (this.Execute.VarTable.has(objName))
        {
            var memberValue=this.Execute.VarTable.get(objName);
            if (memberValue.hasOwnProperty(PropertyName))
            {
                JSConsole.Complier.Log(`[JSSymbolData::CallMemberScriptIndex] index data ${objName}.${PropertyName} in cache.`);
                return this.Execute.RunNextJob();
            }
        }
            
        var callInfo=objName+"."+PropertyName;
        var indexInfo={ Job:job, PeriodID:this.Period , Symbol:this.Symbol };
        if (!this.ReadIndexFunctionValue(callInfo,indexInfo))     //读取指标
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallMemberScriptIndex() Error: '${callInfo}' ${indexInfo.Error}`);
        }

        var systemIndex=new JSIndexScript();
        var systemItem=systemIndex.Get(indexInfo.Name);
        if (!systemItem)
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallMemberScriptIndex() Error: '${callInfo}' ${indexInfo.Name} 指标不存在`);
        }

        if (Array.isArray(systemItem.Args) && systemItem.Args.length>0)
        {
            indexInfo.Args=[];
            for(var i in systemItem.Args)    //复制参数
            {
                var item=systemItem.Args[i];
                indexInfo.Args.push({Value:item.Value, Name:item.Name});
            }
        }

        JSConsole.Complier.Log('[JSSymbolData::CallMemberScriptIndex] call script index', indexInfo);

        var dateTimeRange=this.Data.GetDateRange();

        var option=
        {
            HQDataType:this.DataType,
            Symbol:indexInfo.Symbol,
            Name:'',
            Right:this.Right,           //复权
            Period:indexInfo.PeriodID,  //周期
            Data:null,
            SourceData:null,
            Callback:(outVar,job, symbolData)=> { 
                this.RecvMemberScriptIndexData(outVar,job,symbolData);
                this.Execute.RunNextJob();
            },
            CallbackParam:indexInfo,
            Async:true,
            MaxRequestDataCount:this.MaxRequestDataCount+30*2,
            MaxRequestMinuteDayCount:this.MaxRequestMinuteDayCount+2,
            Arguments:indexInfo.Args,
            //Condition:this.Condition,
            IsBeforeData:this.IsBeforeData,
            NetworkFilter:this.NetworkFilter,
            IsApiPeriod:this.IsApiPeriod,
            KLineRange:dateTimeRange    //K线数据范围
        };

        //执行脚本
        var run=JSComplier.Execute(systemItem.Script,option,(error, indexInfo)=>{this.ExecuteScriptIndexError(error,indexInfo)});
        
    }

    this.CallDynamicScriptIndex=function(job, varTable)
    {
        var callInfo=job.DynamicName;
        var indexInfo={ Job:job, PeriodID:this.Period , Symbol:this.Symbol };
        if (!this.ReadIndexFunctionValue(callInfo,indexInfo))     //读取指标
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallDynamicScriptIndex() Error: '${callInfo}' ${indexInfo.Error}`);
        }

        var systemIndex=new JSIndexScript();    //系统指标
        var systemItem=systemIndex.Get(indexInfo.Name);
        if (!systemItem)
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallDynamicScriptIndex() Error: '${callInfo}' ${indexInfo.Name} 指标不存在`);
        }

        indexInfo.SytemIndex=systemItem;    
        if (!this.ReadDynamicIndexArgumentValue(job.Args, indexInfo, varTable))
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallDynamicScriptIndex() ${indexInfo.Name} 指标参数错误 : ${indexInfo.Error} `);
        }

        JSConsole.Complier.Log('[JSSymbolData::CallMemberScriptIndex] call script index', indexInfo);

        var dateTimeRange=this.Data.GetDateRange();

        var option=
        {
            HQDataType:this.DataType,
            Symbol:indexInfo.Symbol,
            Name:'',
            Right:this.Right,           //复权
            Period:indexInfo.PeriodID,  //周期
            Data:null,
            SourceData:null,
            Callback:(outVar,job, symbolData)=> { 
                this.RecvDynamicScriptIndexData(outVar,job,symbolData);
                this.Execute.RunNextJob();
            },
            CallbackParam:indexInfo,
            Async:true,
            MaxRequestDataCount:this.MaxRequestDataCount+30*2,
            MaxRequestMinuteDayCount:this.MaxRequestMinuteDayCount+2,
            Arguments:indexInfo.Args,
            //Condition:this.Condition,
            IsBeforeData:this.IsBeforeData,
            NetworkFilter:this.NetworkFilter,
            IsApiPeriod:this.IsApiPeriod,
            KLineRange:dateTimeRange    //K线数据范围
        };

        //执行脚本
        var run=JSComplier.Execute(systemItem.Script,option,(error, indexInfo)=>{this.ExecuteScriptIndexError(error,indexInfo)});
    }

    this.ReadDynamicIndexArgumentValue=function(args, result, varTable)
    {
        result.Args=[];
        for(var i =0;i<result.SytemIndex.Args.length; ++i)    //复制参数
        {
            var item=result.SytemIndex.Args[i];
            result.Args.push({ Value:item.Value, Name:item.Name, IsDefault:true });
        }

        if (!IFrameSplitOperator.IsNonEmptyArray(args)) return true;

        for(var i=0;i<args.length;++i)
        {
            var item=args[i];
            var argItem=result.Args[i];
            if (!argItem) continue;
            if (item.Type==Syntax.Literal)
            {
                argItem.Value=item.Value;
                argItem.IsDefault=false;
            }
            else if (item.Type==Syntax.Identifier)  //支持传参
            {
                if (varTable.has(item.Name))
                {
                    argItem.Value=varTable.get(item.Name);
                    argItem.IsDefault=false;
                }
            }
        }

        return true;
    }

    /*****************************************************************************************************************************
        脚本调用

        STKINDI
        STKINDI('600000.sh','MA.MA1#WEEK',5,10,20,30,60,120);
        1=股票代码 2=指标名字.输出变量#周期, 3....参数

        CALCSTOCKINDEX
        用法:CALCSTOCKINDEX(品种代码,指标名称,指标线),返回该指标相应输出的计算值.
        例如:
        CALCSTOCKINDEX('SH600000','KDJ',3)表示上证600000的KDJ指标第3个输出即J之值,第一个参数可在前面加SZ(深市),SH(沪市),BJ(京市),或市场_,,
        CALCSTOCKINDEX('47_IFL0','MACD',2)表示IFL0品种的MACD指标第2个输出值.

        "MA.MA1"(6,12,18)

    *******************************************************************************************************************************/
    this.CallScriptIndex=function(job, varTable)
    {
        if (job.Member) return this.CallMemberScriptIndex(job);
        if (job.DynamicName) return this.CallDynamicScriptIndex(job, varTable);

        if (!job.Args || !(job.Args.length>=2)) 
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() Error: ${job.FunctionName} 参数错误`);
        }

        var indexInfo={ Job:job, PeriodID:this.Period };
        if (!this.ReadSymbolArgumentValue(job.Args[0],indexInfo))  //读取代码
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() Error: ${indexInfo.Error}`);
        }

        if (!this.ReadIndexFunctionValue(job.Args[1],indexInfo))     //读取指标
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() Error: ${indexInfo.Error}`);
        }

        if (job.FunctionName=="CALCSTOCKINDEX")
        {
            if (!this.ReadIndexFunctionOut(job.Args[2],indexInfo))     //读取返回值索引
            {
                var token=job.Token;
                this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() Error: ${indexInfo.Error}`);
            }
        }

        var systemIndex=new JSIndexScript();
        var systemItem=systemIndex.Get(indexInfo.Name);
        if (!systemItem)
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() ${indexInfo.Name} 指标不存在`);
        }

        indexInfo.SytemIndex=systemItem;    //系统指标
        if (!this.ReadIndexArgumentValue(job.Args,indexInfo))
        {
            var token=job.Token;
            this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() ${indexInfo.Name} 指标参数错误 : ${indexInfo.Error} `);
        }

        JSConsole.Complier.Log('[JSSymbolData::CallScriptIndex] call script index', indexInfo);
        var DateTimeRange=null;
        if (this.Data && this.Data.Data.length>0)
        {
            var start=this.Data.Data[0];
            var end=this.Data.Data[this.Data.Data.length-1];
            DateTimeRange=
            {
                Start:{Date:start.Date, Time: start.Time},
                End:{Date:end.Date, Time: end.Time},
            }
        }

        var option=
        {
            HQDataType:this.DataType,
            Symbol:indexInfo.Symbol,
            Name:'',
            Right:this.Right,           //复权
            Period:indexInfo.PeriodID,  //周期
            Data:null,
            SourceData:null,
            Callback:(outVar,job, symbolData)=> { 
                this.RecvScriptIndexData(outVar,job,symbolData);
                this.Execute.RunNextJob();
            },
            CallbackParam:indexInfo,
            Async:true,
            MaxRequestDataCount:this.MaxRequestDataCount+30*2,
            MaxRequestMinuteDayCount:this.MaxRequestMinuteDayCount+2,
            Arguments:indexInfo.Args,
            //Condition:this.Condition,
            IsBeforeData:this.IsBeforeData,
            NetworkFilter:this.NetworkFilter,
            IsApiPeriod:this.IsApiPeriod,
            KLineRange:DateTimeRange    //K线数据范围
        };

        //执行脚本
        var run=JSComplier.Execute(indexInfo.SytemIndex.Script,option,(error, indexInfo)=>{this.ExecuteScriptIndexError(error,indexInfo)});
    }

    this.RecvMemberScriptIndexData=function(outVar,indexInfo,symbolData)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMemberScriptIndexData] ', outVar, indexInfo, symbolData);
        var kLine=symbolData.Data.Data;
        var aryOutVar=outVar;
        var data=this.Data.FitKLineIndex(kLine,aryOutVar,this.Period,indexInfo.PeriodID);

        var member=indexInfo.Job.Member;
        var objName=member.Object.Name;
        var propertyName=member.Property.Name;

        var memberValue={};
        if (this.Execute.VarTable.has(objName))
            memberValue=this.Execute.VarTable.get(objName);
        else
            this.Execute.VarTable.set(objName, memberValue);

        //保存所有的指标数据, 下面用到了就可以不用算了
        for(var i in data)
        {
            var key=outVar[i].Name;
            if (indexInfo.Period) key+='#'+indexInfo.Period;    //带周期的变量
            memberValue[key]=data[i].Data;
        }
    }

    this.RecvDynamicScriptIndexData=function(outVar,indexInfo,symbolData)
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvDynamicScriptIndexData] ', outVar, indexInfo, symbolData);
        var kLine=symbolData.Data.Data;
        var aryOutVar=outVar;
        var data=this.Data.FitKLineIndex(kLine,aryOutVar,this.Period,indexInfo.PeriodID);

        var objName=indexInfo.Name;
        var memberValue={};
        if (this.Execute.VarTable.has(objName))
            memberValue=this.Execute.VarTable.get(objName);
        else
            this.Execute.VarTable.set(objName, memberValue);

        var strValue="";
        for(var i=0; i<indexInfo.Args.length; ++i)
        {
            var item=indexInfo.Args[i];
            if (item.IsDefault===false)
            {
                if (strValue.length>0) strValue+=","; 
                strValue+=`${item.Value}`;
            }
        }
        var strArgs=`(${strValue})`;

        //保存所有的指标数据, 下面用到了就可以不用算了
        for(var i=0; i<data.length; ++i)
        {
            var key=`${outVar[i].Name}#${strArgs}`;
            if (indexInfo.Period) key+='#'+indexInfo.Period;    //带周期的变量
            
            memberValue[key]=data[i].Data;
        } 
    }

    this.RecvScriptIndexData=function(outVar,indexInfo,symbolData)
    {
        var key=this.GenerateScriptIndexKey(indexInfo);
        JSConsole.Complier.Log('[JSSymbolData::RecvScriptIndexData] ', outVar, indexInfo, symbolData, key);

        var kLine=symbolData.Data.Data;
        var aryOutVar=outVar;
        if (indexInfo.Out)
        {
            for(var i=0;i<outVar.length; ++i)
            {
                var item=outVar[i];
                if (item.Name==indexInfo.Out) 
                {
                    aryOutVar=[item];
                    break;
                }
            }

            var data=this.Data.FitKLineIndex(kLine,aryOutVar,this.Period,indexInfo.PeriodID);
            this.ScriptIndexOutData.set(key,data[0].Data);
        }
        else if (IFrameSplitOperator.IsPlusNumber(indexInfo.OutIndex))
        {
            var index=indexInfo.OutIndex-1;

            aryOutVar=[outVar[index]];
            var data=this.Data.FitKLineIndex(kLine,aryOutVar,this.Period,indexInfo.PeriodID);
            this.ScriptIndexOutData.set(key,data[0].Data);
        }
        else
        {
            var data=this.Data.FitKLineIndex(kLine,aryOutVar,this.Period,indexInfo.PeriodID);
            var result={ __Type__:"Object" };
            for(var i in data)
            {
                var item=data[i];
                result[item.Name]=item.Data;
            }
            this.ScriptIndexOutData.set(key,result);
        } 
    }

    this.ExecuteScriptIndexError=function(error,indexInfo)
    {
        var token=indexInfo.Job.Token;
        this.Execute.ErrorHandler.ThrowError(token.Index,token.Line,0,`CallScriptIndex() ${indexInfo.Name} 指标执行错误 : ${error} `);
    }

    this.GetScriptIndexOutData=function(args,node, funcName)
    {
        var indexInfo={ PeriodID:this.Period };
        if (!this.ReadSymbolArgumentValue(args[0],indexInfo))  //读取代码
            this.Execute.ThrowUnexpectedNode(node,`${funcName}() 股票代码错误: ${indexInfo.Error}`);

        if (!this.ReadIndexFunctionValue(args[1],indexInfo))     //读取指标
            this.Execute.ThrowUnexpectedNode(node,`${funcName}() 指标错误: ${indexInfo.Error}`);

        if (funcName=="CALCSTOCKINDEX")
        {
            if (!this.ReadIndexFunctionOut(args[2],indexInfo))     //读取返回值索引
                this.Execute.ThrowUnexpectedNode(node, `${funcName}() Error: ${indexInfo.Error}`);
        }

        var systemIndex=new JSIndexScript();
        var systemItem=systemIndex.Get(indexInfo.Name);
        if (!systemItem)
            this.Execute.ThrowUnexpectedNode(node,`${funcName}() 指标错误: ${indexInfo.Name} 指标不存在`);

        indexInfo.SytemIndex=systemItem;    //系统指标
        if (!this.ReadIndexArgumentValue(args,indexInfo))
            this.Execute.ThrowUnexpectedNode(node,`${funcName}()  指标参数错误: ${indexInfo.Error}`);

        var key=this.GenerateScriptIndexKey(indexInfo);
        if (!this.ScriptIndexOutData.has(key)) return null;

        return this.ScriptIndexOutData.get(key);
    }

    this.JsonDataToHistoryData=function(data)
    {
        var list = data.data;
        var aryDayData=new Array();
        var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7;
        var up=8,down=9,stop=10,unchanged=11;
        for (var i = 0; i < list.length; ++i)
        {
            var item = new HistoryData();

            item.Date = list[i][date];
            item.Open = list[i][open];
            item.YClose = list[i][yclose];
            item.Close = list[i][close];
            item.High = list[i][high];
            item.Low = list[i][low];
            item.Vol = list[i][vol];    //原始单位股
            item.Amount = list[i][amount];
            //上涨 下跌家数
            if (list[i].length>up) item.Up=list[i][up];
            if (list[i].length>down) item.Down=list[i][down];
            if (list[i].length>stop) item.Stop=list[i][stop];
            if (list[i].length>unchanged) item.Unchanged=list[i][unchanged];

            if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除

            aryDayData.push(item);
        }

        return aryDayData;
    }

    this.JsonDataToMinuteHistoryData=function(data)
    {
        var list = data.data;
        var aryDayData=new Array();
        var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, time = 8;
        for (var i = 0; i < list.length; ++i)
        {
            let item = new HistoryData();

            item.Date = list[i][date];
            item.Open = list[i][open];
            item.YClose = list[i][yclose];
            item.Close = list[i][close];
            item.High = list[i][high];
            item.Low = list[i][low];
            item.Vol = list[i][vol];    //原始单位股
            item.Amount = list[i][amount];
            item.Time=list[i][time];

        // if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除
            aryDayData.push(item);
        }

        // 无效数据处理
        for(let i = 0; i < aryDayData.length; ++i)
        {
            var minData = aryDayData[i];
            if (minData == null) coninue;
            if (isNaN(minData.Open) || minData.Open <= 0 || isNaN(minData.High) || minData.High <= 0 || isNaN(minData.Low) || minData.Low <= 0 
                || isNaN(minData.Close) || minData.Close <= 0 || isNaN(minData.YClose) || minData.YClose <= 0)
            {
                if (i == 0)
                {
                    if (minData.YClose > 0)
                    {
                        minData.Open = minData.YClose;
                        minData.High = minData.YClose;
                        minData.Low = minData.YClose;
                        minData.Close = minData.YClose;
                    }
                }
                else // 用前一个有效数据填充
                {
                    for(let j = i-1; j >= 0; --j)
                    {
                        var minData2 = aryDayData[j];
                        if (minData2 == null) coninue;
                        if (minData2.Open > 0 && minData2.High > 0 && minData2.Low > 0 && minData2.Close > 0)
                        {
                            if (minData.YClose <= 0) minData.YClose = minData2.Close;
                            minData.Open = minData2.Open;
                            minData.High = minData2.High;
                            minData.Low = minData2.Low;
                            minData.Close = minData2.Close;
                            break;
                        }
                    }
                }    
            }
        }
        return aryDayData;
    }

    //API 返回数据 转化为array[]
    this.JsonDataToMinuteData=function(data)
    {
        var aryMinuteData=new Array();
        for(var i in data.stock[0].minute)
        {
            var jsData=data.stock[0].minute[i];
            var item=new MinuteData();

            item.Close=jsData.price;
            item.Open=jsData.open;
            item.High=jsData.high;
            item.Low=jsData.low;
            item.Vol=jsData.vol; //股
            item.Amount=jsData.amount;
            if (i==0)      //第1个数据 写死9：25
                item.DateTime=data.stock[0].date.toString()+" 0925";
            else
                item.DateTime=data.stock[0].date.toString()+" "+jsData.time.toString();
            item.Date=data.stock[0].date;
            item.Time=jsData.time;
            item.Increase=jsData.increase;
            item.Risefall=jsData.risefall;
            item.AvPrice=jsData.avprice;

            aryMinuteData[i]=item;
        }

        return aryMinuteData;
    }

    //多日日线数据API 转化成array[];
    this.JsonDataToMultiDayMinuteData=function(data)
    {
        var symbol=data.symbol;
        var upperSymbol=symbol.toUpperCase();
        var isSHSZ=MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);
        var isFutures=MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol);
        var result=[];
        for(var i in data.data)
        {
            var minuteData=[];
            var dayData=data.data[i];
            var date=dayData.date;
            var yClose=dayData.yclose;  //前收盘 计算涨幅
            var preClose=yClose;        //前一个数据价格
            var preAvPrice=null;           //上一个均价
            //var preAvPrice=data.stock[0].yclose;    //前一个均价
            for(var j in dayData.minute)
            {
                var jsData=dayData.minute[j];
                if (jsData[2]) preClose=jsData[2];  //保存上一个收盘数据
                var item=new MinuteData();
                item.Close=jsData[2];
                item.Open=jsData[1];
                item.High=jsData[3];
                item.Low=jsData[4];
                item.Vol=jsData[5]/100; //原始单位股
                item.Amount=jsData[6];
                if (7<jsData.length && jsData[7]>0) 
                {
                    item.AvPrice=jsData[7];    //均价
                    preAvPrice=jsData[7];
                }
                item.DateTime=date.toString()+" "+jsData[0].toString();
                item.Date=date
                item.Time=jsData[0];
                
                if (!item.Close)    //当前没有价格 使用上一个价格填充
                {
                    item.Close=preClose;   
                    item.Open=item.High=item.Low=item.Close;
                }

                if (!item.AvPrice && preAvPrice) item.AvPrice=preAvPrice;

                if (item.Close && yClose) item.Increase = (item.Close - yClose)/yClose*100;
                else item.Increase=null;
                if (j==0)      //第1个数据 写死9：25
                {
                    if (isSHSZ) item.DateTime=date.toString()+" 0925";
                    item.IsFristData=true;
                }

                //价格是0的 都用空
                if (item.Open<=0) item.Open=null;
                if (item.Close<=0) item.Close=null;
                if (item.AvPrice<=0) item.AvPrice=null;
                if (item.High<=0) item.High=null;
                if (item.Low<=0) item.Low=null;
                if (item.AvPrice<=0) item.AvPrice=null;

                minuteData[j]=item;
            }

            var newData=new ChartData();
            newData.Data=minuteData;
            newData.YClose=yClose;
            newData.Close=dayData.close;
            newData.Date=date;

            result.push(newData);
        }

        var minuteData=[];
        for(var i=result.length-1; i>=0;--i)
        {
            var item=result[i];
            for(var j in item.Data)
            {
                minuteData.push(item.Data[j]);
            }
        }
        
        return minuteData;
    }

    //CODELIKE 模糊股票代码
    this.CODELIKE=function(value)
    {
        if (this.Symbol && this.Symbol.indexOf(value)==0) return 1;
        return 0;
    }

    this.NAMELIKE=function(value)
    {
        if (this.Name && this.Name.indexOf(value)==0) return 1;
        return 0;
    }

    /*
    SETCODE 市场类型
    0:深圳 1:上海,47:中金所期货 28:郑州商品 29:大连商品 30:上海商品,27:香港指数 31:香港主板,48:香港创业板... 
    */
    this.SETCODE=function()
    {
        if (this.Symbol.indexOf('.sh')) return 1;
        if (this.Symbol.indexOf('.sz')) return 0;

        return 0;
    }

    this.GetSymbol=function()
    {
        return this.Symbol;
    }

    this.GetName=function()
    {
        return this.Name;
    }

    this.DATE=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            result[i]=item.Date-19000000;
        }

        return result;
    }

   

    this.YEAR=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Date))
                result[i]=parseInt(item.Date/10000);
            else
                result[i]=null;
        }

        return result;
    }

    this.DAY=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Date))
                result[i]=parseInt(item.Date%100);
            else
                result[i]=null;
        }

        return result;
    }

    this.MONTH=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Date))
                result[i]=parseInt(item.Date%10000/100);
            else
                result[i]=null;
        }

        return result;
    }

    this.TIME=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Time))
                result[i]=item.Time;
            else
                result[i]=0;
        }

        return result;
    }

    /*
        取得该周期的时分秒,适用于日线以下周期.
        用法: TIME2
        函数返回有效值范围为(000000-235959)
    */
    this.TIME2=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Time))
                result[i]=item.Time*100;
            else
                result[i]=0;
        }

        return result;
    }

    this.DateTime=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        var isKLineMinute=ChartData.IsMinutePeriod(this.Period, true);
        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            if (isKLineMinute)
            {
                result[i]=item.Date*10000+item.Time;
            }
            else
            {
                result[i]=item.Date;
            }
        }

        return result;
    }

    //星期 1-7
    this.WEEK=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        var tempDate=new Date();
        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            result[i]=null;
            if (!this.IsNumber(item.Date)) continue;

            var year=parseInt(item.Date/10000);
            var month=parseInt(item.Date%10000/100);
            var day=item.Date%100;
            
            tempDate.setFullYear(year,month-1,day);
            result[i]=tempDate.getDay();
        }

        return result;
    }

    /*
    取得该周期的日期离今天的天数.
    用法: DAYSTOTODAY
    */
    this.DAYSTOTODAY=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        var nowDate=new Date();
        var endDate=new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
        for(let i=0; i<this.Data.Data.length; ++i)
        {
            var item=this.Data.Data[i];
            result[i]=null;
            if (!this.IsNumber(item.Date)) continue;

            var year=parseInt(item.Date/10000);
            var month=parseInt(item.Date%10000/100);
            var day=item.Date%100;
            
            var beginDate=new Date(year,month-1,day);
            var diffDays = Math.ceil((endDate - beginDate)/(24*60*60*1000));
            result[i]=diffDays;
        }

        return result;
    }

    /*
    取得该周是年内第几个周.
    用法:WEEKOFYEAR
    */
    this.WEEKOFYEAR=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            result[i]=null;
            if (!this.IsNumber(item.Date)) continue;

            var year=parseInt(item.Date/10000);
            var month=parseInt(item.Date%10000/100);
            var day=item.Date%100;
            
            var endDate=new Date(year,month-1,day);
            var beginDate=new Date(year,0,1);
            var diffDays = Math.ceil((endDate - beginDate)/(24*60*60*1000));
            diffDays+=((beginDate.getDay() + 1) - 1);
            var week = Math.ceil(diffDays/7);
            var value=week;

            result[i]=value;
        }

        return result;
    }

    this.GetYearWeek=function(endDate)
    {
        var beginDate = new Date(endDate.getFullYear(), 0, 1);
        //星期从0-6,0代表星期天，6代表星期六
        var endWeek = endDate.getDay();
        if (endWeek == 0) endWeek = 7;
        var beginWeek = beginDate.getDay();
        if (beginWeek == 0) beginWeek = 7;
        //计算两个日期的天数差
        var millisDiff = endDate.getTime() - beginDate.getTime();
        var dayDiff = Math.floor(( millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
        return Math.ceil(dayDiff / 7) + 1;
    }

    this.REFDATE=function(data,date)
    {
        var result=null;
        var findDate=null;
        if (Array.isArray(date)) 
        {
            if (date.length>0) findDate=date[date.length-1];
        }
        else if (this.IsNumber(date))
        {
            findDate=date;
        }

        if (findDate==null) return null;
        if (findDate<5000000) findDate+=19000000;

        var index=null;
        for(let i in this.Data.Data)   //查找日期对应的索引
        {
            if (this.Data.Data[i].Date==findDate) 
            {
                index=parseInt(i);
                break;
            }
        }

        if (index==null || index>=data.length) return null;

        return data[index];
    }

    //用法:结果从0到11,依次分别是1/5/15/30/60分钟,日/周/月,多分钟,多日,季,年
    this.PERIOD=function()
    {
        //Period周期 0=日线 1=周线 2=月线 3=年线 9=季线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
        const PERIOD_MAP=[5,6,7,11, 0,1,2,3,4,5, 9];
        if (this.Period>=0 && this.Period<=PERIOD_MAP.length-1)
            return PERIOD_MAP[this.Period];
        
        return this.Period;
    } 

    this.GetDrawNull=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            result[i]=null;
        }

        return result;
    }

    this.HOUR=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return result;

        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];

            result[i]=0;
            if (IFrameSplitOperator.IsNumber(item.Time)) result[i]=parseInt(item.Time/100);
        }

        return result;
    }

    this.MINUTE=function()
    {
        var result=[];
        if (!this.Data || !this.Data.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return result;

        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];

            result[i]=0;
            if (IFrameSplitOperator.IsNumber(item.Time)) result[i]=item.Time%100;
        }

        return result;
    }

    /*
    飞狐函数 SYSPARAM
    SYSPARAM(1)画面上光标位置(K线序号)
    SYSPARAM(2)主图可见K线最初位置
    SYSPARAM(3)主图可见K线最后位置，注意：该函数仅K线图形分析且打开十字光标时有效,否则返回值不确定
    SYSPARAM(4)主图可见K线最高价，注意：该函数仅K线图形分析且打开十字光标时有效,否则返回值不确定
    SYSPARAM(5)主图可见K线最低价，注意：该函数仅K线图形分析且打开十字光标时有效,否则返回值不确定
    SYSPARAM(6)画面上光标数值，注意：该函数仅K线图形分析且打开十字光标时有效,否则返回值不确定
    */
    this.SysParam=function(id, jsExec)
    {
        if (!this.DrawInfo) return [];

        if (id==2)
        {
            jsExec.IsUsePageData=true;
            if (IFrameSplitOperator.IsNumber(this.DrawInfo.Start)) 
                return this.DrawInfo.Start+1;
        }
        else if (id==3)
        {
            jsExec.IsUsePageData=true;
            if (IFrameSplitOperator.IsNumber(this.DrawInfo.End)) 
                return this.DrawInfo.End+1;
        }
        else if (id==4)
        {
            jsExec.IsUsePageData=true;
            if (!IFrameSplitOperator.IsNumber(this.DrawInfo.End) ||!IFrameSplitOperator.IsNumber(this.DrawInfo.Start)) return [];
            if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return [];

            var high=null;
            for(var i=this.DrawInfo.Start; i<=this.DrawInfo.End && i<this.Data.Data.length; ++i)
            {
                var item=this.Data.Data[i];
                if (!IFrameSplitOperator.IsNumber(item.High)) continue;
                if (high==null) high=item.High;
                else if(high<item.High) high=item.High;
            }

            return high;
        }
        else if (id==5)
        {
            jsExec.IsUsePageData=true;
            if (!IFrameSplitOperator.IsNumber(this.DrawInfo.End) ||!IFrameSplitOperator.IsNumber(this.DrawInfo.Start)) return [];
            if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return [];

            var low=null;
            for(var i=this.DrawInfo.Start;i<=this.DrawInfo.End && i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                if (!IFrameSplitOperator.IsNumber(item.Low)) continue;
                if (low==null) low=item.Low;
                else if(low>item.Low) low=item.Low;
            }

            return low;
        }

        return [];
    }
}

//是否有是有效的数字
JSSymbolData.prototype.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

JSSymbolData.prototype.IsDivideNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;
    if (value==0) return false;

    return true;
}


JSSymbolData.prototype.JsonDataToFinance=function(data)
{
    var financeData;

    for(let i=1;i<=4;++i)
    {
        switch(i)
        {
            case 1:
                var finance=data.finance1;
                var announcement=data.announcement1;
                break;
            case 2:
                var finance=data.finance2;
                var announcement=data.announcement2;
                break;
            case 3:
                var finance=data.finance3;
                var announcement=data.announcement3;
                break;
            case 4:
                var finance=data.finance4;
                var announcement=data.announcement4;
                break;
            default:
                break;
        }

        if (!finance || !announcement || !this.IsNumber(announcement.year) || !this.IsNumber(announcement.quarter)) continue;
        if (financeData)    //如果存在1天公布多个报告期数据 只取最新的一个公告期数据
        {
            if (financeData.Announcement.year<announcement.year)
                financeData={Date:data.date, Finance:finance, Announcement:announcement};
        }
        else
        {
            financeData={Date:data.date, Finance:finance, Announcement:announcement};
        }

    }

    return financeData;
}

var JS_EXECUTE_DEBUG_LOG=false;


var JS_EXECUTE_JOB_ID=
{
    JOB_DOWNLOAD_SYMBOL_DATA:1, //下载股票的K线数据
    JOB_DOWNLOAD_INDEX_DATA:2,  //下载大盘的K线数据
    JOB_DOWNLOAD_SYMBOL_LATEST_DATA:3,  //最新的股票行情数据
    JOB_DOWNLOAD_INDEX_INCREASE_DATA:4, //涨跌股票个数统计数据
    JOB_DOWNLOAD_VOLR_DATA:5,           //5日量比均量下载量比数据
    JOB_DOWNLOAD_LATEST_INDEX_DATA:8,   //下载最新大盘数据
    JOB_DOWNLOAD_OTHER_SYMBOL_DATA:9,   //下载其他股票的K线数据
    JOB_DOWNLOAD_SYMBOL_PERIOD_DATA:10, //下载周期数据

    JOB_DOWNLOAD_FINVALUE:301,                  //引用专业财务数据 FINVALUE(ID),ID为数据编号
    JOB_DOWNLOAD_FINONE:302,                    //引用指定年和月日的某类型的财务数据 FINONE(ID,Y,MMDD),ID为数据编号,Y和MMDD表示年和月日.
    JOB_DOWNLOAD_FINANCE:303,                   //FINANCE(ID) 基础财务数据
    JOB_DOWNLOAD_GPJYVALUE:304,                 //引用股票交易类数据 GPJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
    JOB_DOWNLOAD_VARIANT:305,                   //CAPITAL , TOTALCAPITAL, EXCHANGE
    JOB_DOWNLOAD_SCJYVALUE:306,                 //引用市场总的交易类数据.SCJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
    
    
   
    JOB_DOWNLOAD_MARGIN_BALANCE:1000,           //融资融券余额
    JOB_DOWNLOAD_MARGIN_RATE:1001,              //融资占比

    JOB_DOWNLOAD_MARGIN_BUY_BALANCE:1010,       //买入信息-融资余额
    JOB_DOWNLOAD_MARGIN_BUY_AMOUNT:1011,        //买入信息-买入额
    JOB_DOWNLOAD_MARGIN_BUY_REPAY:1012,         //买入信息-偿还额
    JOB_DOWNLOAD_MARGIN_BUY_NET:1013,           //买入信息-融资净买入

    JOB_DOWNLOAD_MARGIN_SELL_BALANCE:1020,      //卖出信息-融券余量
    JOB_DOWNLOAD_MARGIN_SELL_VOLUME:1021,       //卖出信息-卖出量
    JOB_DOWNLOAD_MARGIN_SELL_REPAY:1022,        //卖出信息-偿还量
    JOB_DOWNLOAD_MARGIN_SELL_NET:1023,          //卖出信息-融券净卖出

    JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE:2000,             //负面新闻统计
    JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH:2001,             //机构调研
    JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT:2002,             //互动易
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE:2003,         //股东增持
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2:2004,        //股东减持
    JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER:2005,          //信托持股
    JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING:2006,         //大宗交易
    JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS:2007,          //官网新闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS:2008,          //高管要闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE:2009,               //股权质押

    JOB_DOWNLOAD_HK_TO_SH:2050,      //北上流入上证
    JOB_DOWNLOAD_HK_TO_SZ:2051,      //北上流入深证
    JOB_DOWNLOAD_HK_TO_SH_SZ:2052,   //北上流总的

    JOB_DOWNLOAD_HK_TO_SHSZ:2053,   //个股北上流入

    

    JOB_CUSTOM_FUNCTION_DATA:6000,       //自定义函数
    JOB_CUSTOM_VARIANT_DATA:6001,        //自定义变量
    JOB_CUSTOM_DATA_FUNCTION:6002,     //自定义数据函数
    //截面数据
    //财务数据 SF(公告期,数据名称)   如: SF(201901,"流动资产");
    JOB_DOWNLOAD_SECTION_SF:20000,

    JOB_DOWNLOAD_SECTION_F_01:20001,    //currentassets 流动资产
    JOB_DOWNLOAD_SECTION_F_02:20002,    //monetaryfunds 货币资金
    JOB_DOWNLOAD_SECTION_F_03:20003,    //inventory 存货
    JOB_DOWNLOAD_SECTION_F_04:20004,    //currentliabilities 流动负债
    JOB_DOWNLOAD_SECTION_F_05:20005,    //ncurrentliabilities 非流动负债
    JOB_DOWNLOAD_SECTION_F_06:20006,    //3expenses 三项费用
    JOB_DOWNLOAD_SECTION_F_07:20007,    //investmentincome 投资收益
    JOB_DOWNLOAD_SECTION_F_08:20008,    //pcnprofit 归母净利润
    JOB_DOWNLOAD_SECTION_F_09:20009,    //nnetprofit 扣非净利润
    JOB_DOWNLOAD_SECTION_F_10:20010,    //npersearning 扣非每股收益
    JOB_DOWNLOAD_SECTION_F_11:20011,    //woewa 加权平均净资产收益
    JOB_DOWNLOAD_SECTION_F_12:20012,    //inprocess 在建工程
    JOB_DOWNLOAD_SECTION_F_13:20013,    //accdepreciation 累计折旧
    JOB_DOWNLOAD_SECTION_F_14:20014,    //mholderprofit 少数股东利润
    JOB_DOWNLOAD_SECTION_F_15:20015,    //lossexchange 汇兑损益
    JOB_DOWNLOAD_SECTION_F_16:20016,    //baddebts 坏账计提
    JOB_DOWNLOAD_SECTION_F_17:20017,    //fixedassets 固定资产
    JOB_DOWNLOAD_SECTION_F_18:20018,    //curdepreciation 当期折旧
    JOB_DOWNLOAD_SECTION_F_19:20019,    //orevenues 营业总收入
    JOB_DOWNLOAD_SECTION_F_20:20020,    //moprofit 主营业务利润
    JOB_DOWNLOAD_SECTION_F_21:20021,    //oprofit 营业利润
    JOB_DOWNLOAD_SECTION_F_22:20022,    //nprofit 净利润
    JOB_DOWNLOAD_SECTION_F_23:20023,    //areceivable 应收账款
    JOB_DOWNLOAD_SECTION_F_24:20024,    //financialcost 财务费用
    JOB_DOWNLOAD_SECTION_F_25:20025,    //ccfo 经营性现金流
    JOB_DOWNLOAD_SECTION_F_26:20026,    //totalassets 资产总计
    JOB_DOWNLOAD_SECTION_F_27:20027,    //totalliabilities 负债总计
    JOB_DOWNLOAD_SECTION_F_28:20028,    //totalownersequity 所有者权益总计
    JOB_DOWNLOAD_SECTION_F_29:20029,    //grossmargin 毛利率
    JOB_DOWNLOAD_SECTION_F_30:20030,    //percreserve 每股资本公积金
    JOB_DOWNLOAD_SECTION_F_31:20031,    //peruprofit 每股未分配利润
    JOB_DOWNLOAD_SECTION_F_32:20032,    //persearning 每股收益
    JOB_DOWNLOAD_SECTION_F_33:20033,    //pernetasset 每股净资产
    JOB_DOWNLOAD_SECTION_F_34:20034,    //perccfo 每股经营性现金流
    JOB_DOWNLOAD_SECTION_F_35:20035,    //nnprofitincrease finance4特有,扣非净利润涨幅
    JOB_DOWNLOAD_SECTION_F_36:20036,    //nnprofitspeed finance4特有,扣非净利润涨速
    JOB_DOWNLOAD_SECTION_F_37:20037,    //nprofitincrease finance4特有,净利润涨幅
    JOB_DOWNLOAD_SECTION_F_38:20038,    //alratio 资产负债率（数值乘以100）
    JOB_DOWNLOAD_SECTION_F_39:20039,    //profityoy 利润同比%（数值乘以100）

    JOB_DOWNLOAD_CUSTOM_API_DATA:30000,     //自定义数据

    //调用其他脚本指标 
    //KDJ.K , KDJ.K#WEEK
    //STKINDI('600000.sh','MA.MA1#WEEK',5,10,20,30,60,120);
    //CALCSTOCKINDEX('SH600000','KDJ',3)表示上证600000的KDJ指标第3个输出即J之值,第一个参数可在前面加SZ(深市),SH(沪市),BJ(京市)
    //"MA.MA(5,5,5)" 调用动态指标
    JOB_EXECUTE_INDEX:30010,   

    JOB_RUN_SCRIPT:10000, //执行脚本

    //融资融券
    GetMarginJobID:function(value)
    {
        let dataMap=new Map([
            [1,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE],          //MARGIN(1)   融资融券余额
            [2,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE],             //MARGIN(2)   融资占比

            [3,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE],       //MARGIN(3)   买入信息-融资余额
            [4,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT],        //MARGIN(4)   买入信息-买入额
            [5,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY],         //MARGIN(5)   买入信息-偿还额
            [6,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET],           //MARGIN(6)   买入信息-融资净买入

            [7,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE],      //MARGIN(7)   卖出信息-融券余量
            [8,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME],       //MARGIN(8)   卖出信息-卖出量
            [9,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY],        //MARGIN(9)   卖出信息-偿还量
            [10,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET],         //MARGIN(10)  卖出信息-融券净卖出 
        ]);
    
        if (dataMap.has(value)) return dataMap.get(value);
    
        return null;
    },

    GetNewsAnalysisID:function(value)
    {
        let dataMap=new Map([
            [1,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE],          //NEWS(1)   负面新闻统计
            [2,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH],          //NEWS(2)   机构调研统计
            [3,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT],          //NEWS(3)   互动易
            [4,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE],      //NEWS(4)   股东增持
            [5,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2],     //NEWS(5)   股东减持
            [6,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER],       //NEWS(6)   信托持股
            [7,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING],      //NEWS(7)   大宗交易
            [8,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS],       //NEWS(8)   官网新闻
            [9,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS],       //NEWS(9)   高管要闻
            [10,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE],           //NEWS(10)  股权质押    
        ]);

        if (dataMap.has(value)) return dataMap.get(value);
    
        return null;
    },

    //财务截面数据 分报告期
    GetSectionFinanceID:function(value)
    {
        let dataMap=new Map([
            ['流动资产', JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_01],
            ['货币资金', JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_02],
            ['存货', JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_03],
            ['流动负债', JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_04],
            ['非流动负债',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_05],
            ['三项费用',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_06],
            ['投资收益',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_07],
            ['归母净利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_08],
            ['扣非净利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_09],
            ['扣非每股收益',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_10],
            ['加权平均净资产收益',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_11],
            ['在建工程',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_12],
            ['累计折旧',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_13],
            ['少数股东利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_14],
            ['汇兑损益',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_15],
            ['坏账计提',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_16],
            ['固定资产',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_17],
            ['当期折旧',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_18],
            ['营业总收入',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_19],
            ['主营业务利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_20],
            ['营业利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_21],
            ['净利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_22],
            ['应收账款',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_23],
            ['财务费用',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_24],
            ['经营性现金流',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_25],
            ['资产总计',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_26],
            ['负债总计',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_27],
            ['所有者权益总计',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_28],
            ['毛利率',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_29],
            ['每股资本公积金',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_30],
            ['每股未分配利润',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_31],
            ['每股收益',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_32],
            ['每股净资产',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_33],
            ['每股经营性现金流',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_34],
            ['扣非净利润涨幅',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_35],
            ['扣非净利润涨速',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_36],
            ['净利润涨幅',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_37],
            ['资产负债率',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_38],
            ['利润同比',JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_F_39],
        ]);

        if (dataMap.has(value)) return dataMap.get(value);

        return null;
    },

    //获取报告期 2018, 1 
    GetSectionReportPeriod:function(year,quarter)  
    {
        if (year>=2000 && quarter>=1 && quarter<=4) 
            return { Year:year, Quarter:quarter };
        return null;
    }

};

function JSExecute(ast,option)
{
    this.AST=ast;   //语法树

    this.ErrorHandler=new ErrorHandler();
    this.VarTable=new Map();        //变量表
    this.VarDrawTable=new Map();    //绘图变量表
    this.OutVarTable=[];   //输出变量
    this.Arguments=[];
    this.ErrorCallback;             //执行错误回调
    this.GetEventCallback;
    this.IsUsePageData=false;
    this.IndexCtrl;
    this.Debug=0;   //0=非debug模式 1=debug 模式
    this.DebugFilter;
    this.Interrupt={ Exit:false };  //中断信息

    //脚本自动变量表, 只读
    this.ConstVarTable=new Map([
        //个股数据
        ['CLOSE',null],['VOL',null],['OPEN',null],['HIGH',null],['LOW',null],['AMOUNT',null],
        ['C',null],['V',null],['O',null],['H',null],['L',null],['AMO',null], 
        ['VOLR',null],      //量比
        ['VOLINSTK',null], ["OPI",null],    //持仓量
        ["QHJSJ",null], ["SETTLE",null],    //结算价
        ["ZSTJJ",null],     //分时图均价线,对于分时图周期指标有效.
        ["ISEQUAL",null], ["ISUP",null],["ISDOWN"], //ISUP=收阳 ISEQUAL=平盘 ISDOWN=收阴

        //日期类
        ['DATE',null],['YEAR',null],['MONTH',null],['PERIOD', null],['WEEK',null],['WEEKDAY',null],["TIME",null],["DAY",null],["DATETIME",null],["TIME2",null],
        ["WEEKOFYEAR", null],["DAYSTOTODAY", null],

        ["HOUR",null],["MINUTE",null],

        //大盘数据
        ['INDEXA',null],['INDEXC',null],['INDEXH',null],['INDEXL',null],['INDEXO',null],['INDEXV',null],
        ['INDEXADV',null],['INDEXDEC',null],

        ["ADVANCE",null],['DECLINE', null],

        ['FROMOPEN',null],      //已开盘有多长分钟
        ['TOTALFZNUM', null],   //该品种的每天的总交易分钟数.

        ['CURRBARSCOUNT',null], //到最后交易日的周期数
        ['TOTALBARSCOUNT',null],
        ['ISLASTBAR',null],     //判断是否为最后一个周期
        ['BARSTATUS',null],     //BARSTATUS返回数据位置信息,1表示第一根K线,2表示最后一个数据,0表示中间位置.

        ["BARPOS", null],   //返回从第一根K线开始到当前的周期数

        ['CAPITAL',null],   //流通股本（手）
        ["TOTALCAPITAL",null], //TOTALCAPITAL  当前总股本 手
        ['EXCHANGE',null],   //换手率
        ['SETCODE', null],  //市场类型
        ['CODE',null],      //品种代码
        ['STKNAME',null],   //品种名称
        ["TQFLAG",null],    //TQFLAG  当前的复权状态,0:无复权 1:前复权 2:后复权 

        ['HYBLOCK',null],   //所属行业板块
        ['DYBLOCK',null],   //所属地域板块
        ['GNBLOCK',null],   //所属概念
        ["FGBLOCK",null],   //所属风格板块
        ["ZSBLOCK",null],   //所属指数板块
        ["ZHBLOCK",null],   //所属组合板块
        ["ZDBLOCK",null],   //所属自定义板块
        ["HYZSCODE",null],  

        ["GNBLOCKNUM",null],    //所属概念板块的个数
        ["FGBLOCKNUM",null],    //所属风格板块的个数
        ["ZSBLOCKNUM",null],    //所属指数板块的个数
        ["ZHBLOCKNUM",null],    //所属组合板块的个数
        ["ZDBLOCKNUM",null],    //所属自定义板块的个数

        ["HYSYL",null],         //指数市盈率或个股所属行业的市盈率
        ["HYSJL",null],         //指数市净率或个股所属行业的市净率

        ['DRAWNULL',null],
        ["NULL",null],

        ["MACHINEDATE",null],["MACHINETIME",null],["MACHINEWEEK",null],

        ["TR", null], //真实波幅
        ["AUTOFILTER", null],

        ['LARGEINTRDVOL', null],    //逐笔买入大单成交量,相当于L2_VOL(0,0)+L2_VOL(1,0),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ['LARGEOUTTRDVOL', null],    //逐笔卖出大单成交量,相当于L2_VOL(0,1)+L2_VOL(1,1),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["TRADENUM", null],         //逐笔成交总单数,沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["TRADEINNUM", null],       //逐笔买入成交单数,相当于L2_VOLNUM(0,0)+L2_VOLNUM(1,0),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["TRADEOUTNUM", null],      //逐笔卖出成交单数,相当于L2_VOLNUM(0,1)+L2_VOLNUM(1,1),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["LARGETRDINNUM", null],    //逐笔买入大单成交单数,相当于L2_VOLNUM(0,0),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["LARGETRDOUTNUM", null],   //逐笔卖出大单成交单数,相当于L2_VOLNUM(0,1),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["CUR_BUYORDER", null],     //总委买量,序列数据,专业版等(资金流向功能)沪深京品种行情专用
        ["CUR_SELLORDER", null],    //总委卖量,序列数据,专业版等(资金流向功能)沪深京品种行情专用
        ["ACTINVOL", null],         //主动买成交量,相当于L2_VOL(0,2)+L2_VOL(1,2)+L2_VOL(2,2)+L2_VOL(3,2),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["ACTOUTVOL", null],        //主动卖成交量,相当于L2_VOL(0,3)+L2_VOL(1,3)+L2_VOL(2,3)+L2_VOL(3,3),沪深京品种的资金流向,仅日线以上周期,用于特定版本
        ["BIDORDERVOL", null],      //累计总有效委买量,专业版等(资金流向功能)沪深京品种行情专用 累计总有效委买量-累计总有效撤买量=总买+总成交量
        ["BIDCANCELVOL", null],     //累计总有效撤买量,专业版等(资金流向功能)沪深京品种行情专用  累计总有效委买量-累计总有效撤买量=总买+总成交量
        ["AVGBIDPX", null],         //专业版等(资金流向功能)沪深京品种行情专用:最新委买均价
        ["OFFERORDERVOL", null],    //累计总有效委卖量,专业版等(资金流向功能)沪深京品种行情专用  累计总有效委卖量-累计总有效撤卖量=总卖+总成交量
        ["OFFERCANCELVOL", null],   //累计总有效撤卖量,专业版等(资金流向功能)沪深京品种行情专用  累计总有效委卖量-累计总有效撤卖量=总卖+总成交量
        ["AVGOFFERPX", null],       //专业版等(资金流向功能)沪深京品种行情专用:最新委卖均价
        //["", null],
    ]);   

    this.SymbolData=new JSSymbolData(this.AST,option,this);
    this.Algorithm=new JSAlgorithm(this.ErrorHandler,this.SymbolData);
    this.Draw=new JSDraw(this.ErrorHandler,this.SymbolData);
    
    this.JobList=[];            //执行的任务队列

    this.UpdateUICallback=null; //回调
    this.CallbackParam=null;
    this.IsSectionMode=false;

    if (option)
    {
        if (option.Callback) this.UpdateUICallback=option.Callback;
        if (option.CallbackParam) 
        {
            this.CallbackParam=option.CallbackParam;
            if (this.CallbackParam.HQChart)
                this.GetEventCallback=(id)=> { return this.CallbackParam.HQChart.GetEventCallback(id); }
        }
        if (option.Arguments) this.Arguments=option.Arguments;
        if (option.IsSectionMode) this.IsSectionMode=option.IsSectionMode;
        if (option.Self) this.IndexCtrl=option.Self;
        //调试模式信息
        if (IFrameSplitOperator.IsNumber(option.Debug)) this.Debug=option.Debug;
        if (option.DebugFilter) this.DebugFilter=option.DebugFilter;
    }

    this.Execute=function()
    {
        this.OutVarTable=[];
        this.VarTable=new Map();
        this.VarDrawTable=new Map();    //绘图变量表
        JSConsole.Complier.Log('[JSExecute::Execute] Load Arguments', this.Arguments);
        for(let i in this.Arguments)    //预定义的变量
        {
            let item =this.Arguments[i];
            this.VarTable.set(item.Name,item.Value);
        }

        this.RunNextJob();
    }

    this.RunNextJob=function()
    {
        if (this.JobList.length<=0) return;

        JSConsole.Complier.Log('[JSExecute::Execute] JobList', this.JobList);
        var jobItem=this.JobList.shift();

        switch(jobItem.ID)
        {
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA:
                return this.SymbolData.GetSymbolData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_PERIOD_DATA:
                return this.SymbolData.GetSymbolPeriodData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA:
                return this.SymbolData.GetIndexData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_LATEST_INDEX_DATA:
                return this.SymbolData.GetLatestIndexData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA:
                return this.SymbolData.GetIndexIncreaseData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA:
                return this.SymbolData.GetLatestData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA:  //量比
                return this.SymbolData.GetVolRateData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_OTHER_SYMBOL_DATA:  //指定股票数据
                return this.SymbolData.GetOtherSymbolData(jobItem);
            
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_RELEASE_DATE_DATA:
                return this.SymbolData.GetCompanyReleaseDate(jobItem.ID);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE:       //买入信息-融资余额
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT:        //买入信息-买入额
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY:         //买入信息-偿还额
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET:           //买入信息-融资净买入
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE:      //卖出信息-融券余量
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME:       //卖出信息-卖出量
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY:        //卖出信息-偿还量
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET:          //卖出信息-融券净卖出
                return this.SymbolData.GetMarginData(jobItem.ID);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE:             //负面新闻
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH:             //机构调研
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT:             //互动易
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE:         //股东增持
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2:        //股东减持
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER:          //信托持股
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING:         //大宗交易
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS:          //官网新闻
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS:          //高管要闻
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE:               //股权质押
                return this.SymbolData.GetNewsAnalysisData(jobItem.ID);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_HK_TO_SHSZ:
                return this.SymbolData.GetHKToSHSZData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SECTION_SF:
                return this.SymbolData.GetSectionFinanceData(jobItem);   //财务截面报告数据

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINONE:
                return this.SymbolData.GetFinOne(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINVALUE:
                return this.SymbolData.GetFinValue(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINANCE:
                return this.SymbolData.GetFinance(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GPJYVALUE:
                return this.SymbolData.GetGPJYValue(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SCJYVALUE:
                return this.SymbolData.GetSCJYValue(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VARIANT:    //CAPITAL, TOTALCAPITAL 
                return this.SymbolData.GetVariantData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_VARIANT_DATA:
                return this.SymbolData.GetCustomVariantData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_FUNCTION_DATA:
                return this.SymbolData.GetCustomFunctionData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_DATA_FUNCTION:
                return this.SymbolData.GetCustomFunctionDataV2(jobItem);


            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA:
                return this.SymbolData.DownloadCustomAPIData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX:
                return this.SymbolData.CallScriptIndex(jobItem, this.VarTable);

            case JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT:
                if (this.Debug===1 && this.DebugFilter) 
                    return this.DebugRun();
                else 
                    return this.Run();
        }
    }

    this.ReadSymbolData=function(name,node)
    {
        switch(name)
        {
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
            case "OPI":
            case 'VOLINSTK':
            case "SETTLE":
            case "QHJSJ":
            case "ZSTJJ":
            case "ISEQUAL": //平盘
            case "ISUP":    //收阳
            case "ISDOWN":  //收阴
                return this.SymbolData.GetSymbolCacheData(name);
            case 'VOLR':
                return this.SymbolData.GetVolRateCacheData(node);

            case "TR":  //TR,求真实波幅.
                return this.SymbolData.GetTRData(node);

            //大盘数据
            case 'INDEXA':
            case 'INDEXC':
            case 'INDEXH':
            case 'INDEXH':
            case 'INDEXO':
            case 'INDEXV':
            case 'INDEXL':
            case 'INDEXADV':
            case 'INDEXDEC':
                return this.SymbolData.GetIndexCacheData(name);
            case 'CURRBARSCOUNT':
                return this.SymbolData.GetCurrBarsCount();
            case "BARPOS":
                return this.SymbolData.GetBarPos();
            case "TOTALBARSCOUNT":
                return this.SymbolData.GetTotalBarsCount();
            case "TOTALFZNUM":
                return this.SymbolData.GetTotalTradeMinuteCount();
            case 'ISLASTBAR':
                return this.SymbolData.GetIsLastBar();
            case "BARSTATUS":
                return this.SymbolData.GetBarStatus();

            case "TOTALCAPITAL":
            case 'CAPITAL':
            case 'EXCHANGE':

            case "HYBLOCK":
            case "DYBLOCK":
            case "GNBLOCK":
            case "FGBLOCK":
            case "ZSBLOCK":
            case "ZHBLOCK":
            case "ZDBLOCK":
            case "HYZSCODE":

            case "GNBLOCKNUM":
            case "FGBLOCKNUM":
            case "ZSBLOCKNUM":
            case "ZHBLOCKNUM":
            case "ZDBLOCKNUM":

            case "HYSYL":
            case "HYSJL":

            case 'FROMOPEN':

            case "LARGEINTRDVOL":
            case "LARGEOUTTRDVOL":
            case "TRADENUM":
            case "TRADEINNUM":
            case "TRADEOUTNUM":
            case "LARGETRDINNUM": 
            case "LARGETRDOUTNUM":
            case "CUR_BUYORDER":
            case "CUR_SELLORDER": 
            case "ACTINVOL":
            case "ACTOUTVOL":
            case "BIDORDERVOL":
            case "BIDCANCELVOL":
            case "AVGBIDPX":
            case "OFFERORDERVOL":
            case "OFFERCANCELVOL":
            case "AVGOFFERPX":
                return this.SymbolData.GetStockCacheData({ VariantName:name, Node:node });
            case 'SETCODE':
                return this.SymbolData.SETCODE();
            case 'CODE':
                return this.SymbolData.GetSymbol();
            case 'STKNAME':
                return this.SymbolData.GetName();

            case "TIME":
                return this.SymbolData.TIME();
            case "TIME2":
                return this.SymbolData.TIME2();
            case 'DATE':
                return this.SymbolData.DATE();
            case "DATETIME":
                return this.SymbolData.DateTime();
            case 'YEAR':
                return this.SymbolData.YEAR();
            case 'MONTH':
                return this.SymbolData.MONTH();
            case 'WEEK':
            case "WEEKDAY":
                return this.SymbolData.WEEK();
            case "DAY":
                return this.SymbolData.DAY();
            case 'PERIOD':
                return this.SymbolData.PERIOD();

            case "HOUR":
                return this.SymbolData.HOUR();
            case "MINUTE":
                return this.SymbolData.MINUTE();

            case 'DRAWNULL':
            case "NULL":
                return this.SymbolData.GetDrawNull();

            case 'ADVANCE':
            case 'DECLINE':
                return this.SymbolData.GetIndexIncreaseCacheData(name,this.SymbolData.Symbol,node);

            case "TQFLAG":
                return this.SymbolData.Right;

            case "MACHINEDATE":
                {
                    var now=new Date();
                    return (now.getFullYear()*10000+(now.getMonth()*1)*100+now.getDate())-19000000;
                }
            case "MACHINETIME":
                {
                    var now=new Date();
                    return now.getHours()*10000+(now.getMinutes()*1)*100+now.getSeconds();
                }
            case "MACHINEWEEK":
                {
                    var now=new Date();
                    return now.getDay();
                }
            case "WEEKOFYEAR":
                return this.SymbolData.WEEKOFYEAR();
            case "DAYSTOTODAY":
                return this.SymbolData.DAYSTOTODAY();
        }

        this.ThrowUnexpectedNode(node, '变量'+name+'不存在', name);
    }

    this.ReadCustomVariant=function(name,node)
    {
        return this.SymbolData.GetStockCacheData({ VariantName:name, Node:node });
    }

    //读取变量
    this.ReadVariable=function(name,node)
    {
        if (this.ConstVarTable.has(name)) 
        {
            let data=this.ConstVarTable.get(name);

            if (data==null) //动态加载,用到再加载
            {
                data=this.ReadSymbolData(name,node);
                this.ConstVarTable.set(name,data);
            }

            return data;
        }

        if (g_JSComplierResource.IsCustomVariant(name)) return this.ReadCustomVariant(name,node); //读取自定义变量

        if (this.VarTable.has(name)) return this.VarTable.get(name);

        if (name.indexOf('#')>0)
        {
            var aryPeriod=name.split('#');
            return this.SymbolData.GetSymbolPeriodCacheData(aryPeriod[0],aryPeriod[1]);
        }

        if (name.indexOf("COLOR")==0)
        {
            var colorValue=JSComplier.ColorVarToRGB(name);
            if (colorValue) return colorValue;
        }

        this.ThrowUnexpectedNode(node, '变量'+name+'不存在', name);
        return null;
    }

    this.ReadMemberVariable=function(node)
    {
        var obj=node.Object;
        var member=node.Property;

        let maiObj;
        if (obj.Type==Syntax.BinaryExpression || obj.Type==Syntax.LogicalExpression ) 
            maiObj=this.VisitBinaryExpression(obj);
        else if (obj.Type==Syntax.CallExpression)
            maiObj=this.VisitCallExpression(obj);
        else
            maiObj=this.GetNodeValue(obj);

        if (!maiObj) return null;
        var value=maiObj[member.Name];
        if (value) return value;

        return null;
    }

    //单数据转成数组 个数和历史数据一致
    this.SingleDataToArrayData=function(value)
    {
        let count=this.SymbolData.Data.Data.length;
        let result=[];
        for(let i=0;i<count;++i)
        {
            result[i]=value;
        }

        return result;
    }

    this.RunAST=function()
    {
        if (!this.AST) this.ThrowError();
        if (!this.AST.Body) this.ThrowError();

        for(let i=0; i<this.AST.Body.length; ++i)
        {
            let item =this.AST.Body[i];
            this.RunASTNode(item,i);
            if (this.Interrupt && this.Interrupt.Exit)
            {
                JSConsole.Complier.Log('[JSExecute::RunAST] Interrupt', this.Interrupt);    //中断退出
                break;
            }
        }

        JSConsole.Complier.Log('[JSExecute::RunAST]', this.VarTable);

        return this.OutVarTable;
    }

    this.RunASTNode=function(item, lineID)
    {
        this.VisitNode(item);

        var i=lineID;
        //输出变量
        if (item.Type==Syntax.ExpressionStatement && item.Expression)
        {
            if (item.Expression.Type==Syntax.AssignmentExpression)
            {
                if (item.Expression.Operator==':' && item.Expression.Left)
                {
                    let assignmentItem=item.Expression;
                    let varName=assignmentItem.Left.Name;
                    let outVar=this.VarTable.get(varName);
                    if (this.VarDrawTable.has(varName)) //绘图函数赋值
                    {
                        let draw=this.VarDrawTable.get(varName);
                        this.OutVarTable.push({Name:draw.Name, Draw:draw, Type:1});
                    }
                    else
                    {
                        var type=0;
                        if (outVar && typeof(outVar)=='object' && outVar.__Type__=='Object')
                        {
                            type=1000;
                        }
                        else if (!this.IsSectionMode && !Array.isArray(outVar)) 
                        {
                            if (typeof(outVar)=='string') 
                            {
                                var floatValue=parseFloat(outVar);
                                if (IFrameSplitOperator.IsNumber(floatValue))
                                {
                                    outVar=this.SingleDataToArrayData(floatValue);
                                }
                                else
                                {
                                    outVar=this.SingleDataToArrayData(outVar);
                                    type=1001;
                                }
                                    
                            }
                            else outVar=this.SingleDataToArrayData(outVar);
                        }

                        this.OutVarTable.push({Name:varName, Data:outVar,Type:type});
                    }
                }
            }
            else if (item.Expression.Type==Syntax.CallExpression)
            {
                let callItem=item.Expression;
                if (this.Draw.IsDrawFunction(callItem.Callee.Name) )
                {
                    let draw=callItem.Draw;
                    draw.Name=callItem.Callee.Name;
                    this.OutVarTable.push({Name:draw.Name, Draw:draw, Type:1});
                }
                else if (callItem.Callee.Name==="IFC" && callItem.Draw)
                {
                    let draw=callItem.Draw;
                    draw.Name=draw.DrawType;
                    this.OutVarTable.push({Name:draw.Name, Draw:draw, Type:1});
                }
                else
                {
                    let outVar=callItem.Out;
                    varName=`__temp_c_${callItem.Callee.Name}_${i}__`;
                    var type=0;
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    this.OutVarTable.push({Name:varName, Data:outVar,Type:type,NoneName:true});
                }
            }
            else if (item.Expression.Type==Syntax.Identifier)
            {
                let varName=item.Expression.Name;
                let outVar=this.ReadVariable(varName,item.Expression);
                var type=0;
                if (outVar && typeof(outVar)=='object' && outVar.__Type__=='Object')
                {
                    type=1000;
                }
                else if (!this.IsSectionMode && !Array.isArray(outVar)) 
                {
                    if (typeof(outVar)=='string') outVar=this.SingleDataToArrayData(parseFloat(outVar));
                    else outVar=this.SingleDataToArrayData(outVar);
                }

                varName="__temp_i_"+i+"__";
                this.OutVarTable.push({Name:varName, Data:outVar, Type:type, NoneName:true});
            }
            else if (item.Expression.Type==Syntax.Literal)  //常量
            {
                let outVar=item.Expression.Value;
                if (IFrameSplitOperator.IsString(outVar) && outVar.indexOf("$")>0)
                    outVar=this.SymbolData.GetOtherSymolCacheData({ Literal:outVar });
                varName="__temp_li_"+i+"__";
                var type=0;
                if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                this.OutVarTable.push({Name:varName, Data:outVar, Type:type, NoneName:true});
            }
            else if (item.Expression.Type==Syntax.BinaryExpression)
            {
                var varName="__temp_b_"+i+"__";
                let outVar=item.Expression.Out;
                var type=0;
                if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                this.OutVarTable.push({Name:varName, Data:outVar,Type:type, NoneName:true});
            }
            else if (item.Expression.Type==Syntax.LogicalExpression)    //逻辑语句 如 T1 AND T2 
            {
                var varName="__temp_l_"+i+"__";
                let outVar=item.Expression.Out;
                var type=0;
                if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                this.OutVarTable.push({Name:varName, Data:outVar,Type:type, NoneName:true});
            }
            else if (item.Expression.Type==Syntax.UnaryExpression)
            {
                var varName="__temp_u_"+i+"__";
                var varInfo={ };
                if (this.ReadUnaryExpression(item.Expression, varInfo))
                {
                    var type=0;
                    this.OutVarTable.push({Name:varName, Data:varInfo.OutVar,Type:type, NoneName:true});
                }
            }
            else if (item.Expression.Type==Syntax.MemberExpression) //MA.MA2
            {
                var outVar=this.ReadMemberVariable(item.Expression);
                if (outVar)
                {
                    var type=0;
                    var varName="__temp_di_"+i+"__";
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    this.OutVarTable.push({Name:varName, Data:outVar,Type:type, NoneName:true});
                }
            }
            else if (item.Expression.Type==Syntax.SequenceExpression)
            {
                let varName;
                let draw;
                let color, upColor, downColor, stickType;
                let lineWidth;
                let colorStick=false;
                let pointDot=false;
                let upDownDot=false;
                let circleDot=false;
                let lineStick=false;
                let stick=false;
                let volStick=false;
                let lineArea=false;
                let stepLine=false;
                let isShow=true;
                let isExData=false;
                let isDotLine=false;
                let isOverlayLine=false;    //叠加线
                let isSingleLine=false;     //独立线段
                var isNoneName=false;
                var isShowTitle=true;
                //显示在位置之上,对于DRAWTEXT和DRAWNUMBER等函数有用,放在语句的最后面(不能与LINETHICK等函数共用),比如:
                //DRAWNUMBER(CLOSE>OPEN,HIGH,CLOSE),DRAWABOVE;
                var isDrawAbove=false;
                var isDrawCenter=false;   
                var isDrawBelow=false;
                //VALIGN0,VALIGN1,VALIGN2 设置文字垂直对齐方式（上中下）
                //ALIGN0,ALIGN1,ALIGN2 设置文字水平对齐方式（左中右）
                var drawAlign=-1, drawVAlign=-1;
                var fontSize=-1;
                var bgConfig=null;    //背景设置
                var vLineConfig=null;
                var isFirstDraw=null;
                let xOffset=null, yOffset=null;
                var klineType=null;
                for(let j=0; j<item.Expression.Expression.length; ++j)
                {
                    let itemExpression=item.Expression.Expression[j];
                    if (itemExpression.Type==Syntax.AssignmentExpression && itemExpression.Operator==':' && itemExpression.Left)
                    {
                        if (j==0)
                        {
                            varName=itemExpression.Left.Name;
                            let varValue=this.VarTable.get(varName);
                            if (this.VarDrawTable.has(varName))         //绘图函数赋值
                            {
                                draw=this.VarDrawTable.get(varName);
                            }
                            else if (!Array.isArray(varValue)) 
                            {
                                varValue=this.SingleDataToArrayData(varValue); 
                                this.VarTable.set(varName,varValue);            //把常量放到变量表里
                            } 
                        }
                        else
                        {
                           
                        }
                    }
                    else if (itemExpression.Type==Syntax.Identifier)
                    {
                        let value=itemExpression.Name;
                        if (value==='COLORSTICK') colorStick=true;
                        else if (value==='POINTDOT') pointDot=true;
                        else if (value==='CIRCLEDOT') circleDot=true;
                        else if (value==='DOTLINE') isDotLine=true;
                        else if (value=="UPDOWNDOT") upDownDot=true;
                        else if (value==='LINESTICK') lineStick=true;
                        else if (value==='STICK') stick=true;
                        else if (value==='VOLSTICK') volStick=true;
                        else if (value=="LINEAREA") lineArea=true;
                        else if (value==="DRAWABOVE") isDrawAbove=true;
                        else if (value==="DRAWCENTER") isDrawCenter=true;
                        else if (value=="DRAWBELOW") isDrawBelow=true;
                        else if (value=="STEPLINE") stepLine=true;
                        else if (value=="SINGLELINE") isSingleLine=true;
                        else if (value.indexOf('COLOR')==0) color=value;
                        else if (value.indexOf("RGBX")==0 && value.length==10) color=value; //RGBX+“RRGGBB”
                        else if (value.indexOf('LINETHICK')==0) lineWidth=value;
                        

                        else if (value=="ALIGN0") drawAlign=0;
                        else if (value=="ALIGN1") drawAlign=1;
                        else if (value=="ALIGN2") drawAlign=2;
                       
                        else if (value=="VALIGN0") drawVAlign=0;
                        else if (value=="VALIGN1") drawVAlign=1;
                        else if (value=="VALIGN2") drawVAlign=2;
                       
                        else if (value.indexOf('NODRAW')==0) isShow=false;
                        else if (value.indexOf('EXDATA')==0) isExData=true; //扩展数据, 不显示再图形里面
                        else if (value.indexOf('LINEOVERLAY')==0) isOverlayLine=true;
                        else if (value.indexOf("NOTEXT")==0 || value.indexOf("NOTITLE")==0) isShowTitle=false; //标题不显示
                        else if (value.indexOf("FONTSIZE")==0)
                        {
                            var strFontSize=value.replace("FONTSIZE","");
                            fontSize=parseInt(strFontSize);
                        }
                        else 
                        {
                            if (j==0)
                            {
                                varName=itemExpression.Name;
                                let varValue=this.ReadVariable(varName,itemExpression);
                                if (!Array.isArray(varValue)) varValue=this.SingleDataToArrayData(varValue); 
                                varName="__temp_si_"+i+"__";
                                isNoneName=true;
                                this.VarTable.set(varName,varValue);            //放到变量表里
                            }
                        }
                    }
                    else if(itemExpression.Type==Syntax.Literal)    //常量
                    {
                        if (j==0)
                        {
                            let aryValue=this.SingleDataToArrayData(itemExpression.Value);
                            varName=itemExpression.Value.toString();
                            this.VarTable.set(varName,aryValue);    //把常量放到变量表里
                        }
                    }
                    else if (itemExpression.Type==Syntax.CallExpression)
                    {
                        if (j==0)
                        {
                            if (this.Draw.IsDrawFunction(itemExpression.Callee.Name))
                            {
                                draw=itemExpression.Draw;
                                draw.Name=itemExpression.Callee.Name;
                            }
                            else
                            {
                                let varValue=itemExpression.Out;
                                varName=`__temp_sc_${itemExpression.Callee.Name}_${i}__`;
                                isNoneName=true;
                                this.VarTable.set(varName,varValue);
                            }
                        }
                        else
                        {
                            if (itemExpression.Callee.Name=="RGB" || itemExpression.Callee.Name=="RGBA")
                            {
                                color=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="UPCOLOR")
                            {
                                upColor=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="DOWNCOLOR")
                            {
                                downColor=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="STICKTYPE")
                            {
                                stickType=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="XMOVE")
                            {
                                xOffset=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="YMOVE")
                            {
                                yOffset=itemExpression.Out;
                            }
                            else if (itemExpression.Callee.Name=="FIRSTDRAW")
                            {
                                if (itemExpression.Out===0) isFirstDraw=false;
                                else if (itemExpression.Out===1) isFirstDraw=true;
                            }
                            else if (itemExpression.Callee.Name=="SOUND")
                            {
                                var event=this.GetSoundEvent();
                                if (event)
                                {

                                }
                                varName=null;
                            }
                            else if (itemExpression.Callee.Name=="ICON")
                            {
                                let drawCond=this.VarTable.get(varName);
                                if (drawCond)
                                {
                                    draw=this.GetOutIconData(drawCond,itemExpression.Draw);
                                    if (draw) draw.Name=itemExpression.Callee.Name;
                                }

                                varName=null;
                            }
                            else if (itemExpression.Callee.Name=="BACKGROUND")
                            {
                                bgConfig=itemExpression.Draw;
                                varName=null;
                            }
                            else if (itemExpression.Callee.Name=="CKLINE")
                            {
                                vLineConfig=itemExpression.Draw;
                                varName=null;
                            }
                            else if (itemExpression.Callee.Name=="KLINETYPE")
                            {
                                klineType=itemExpression.Out;
                            }
                        }
                    }
                    else if (itemExpression.Type==Syntax.BinaryExpression)
                    {
                        if (j==0)
                        {
                            varName="__temp_sb_"+i+"__";
                            let aryValue=itemExpression.Out;
                            isNoneName=true;
                            this.VarTable.set(varName,aryValue);
                        }
                       
                    }
                    else if (itemExpression.Type==Syntax.UnaryExpression)
                    {
                        if (j==0)
                        {
                            varName="__temp_su_"+i+"__";
                            var varInfo={ };
                            if (this.ReadUnaryExpression(itemExpression, varInfo))
                            {
                                isNoneName=true;
                                this.VarTable.set(varName,varInfo.OutVar);
                            }
                        }
                    }
                    else if (itemExpression.Type==Syntax.MemberExpression)  //"MA.MA2"(5,12,29), COLORRED;
                    {
                        if (j==0)
                        {
                            var outVar=this.ReadMemberVariable(itemExpression);
                            if (outVar)
                            {
                                if (!Array.isArray(outVar)) varValue=this.SingleDataToArrayData(outVar); 
                                isNoneName=true;
                                varName="__temp_di_"+i+"__";
                                this.VarTable.set(varName,outVar);    //把常量放到变量表里
                            }
                        }
                    }
                }

                if (pointDot && varName)   //圆点
                {
                    let outVar=this.VarTable.get(varName);
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    let value={Name:varName, Data:outVar, Radius:g_JSChartResource.POINTDOT.Radius, Type:3};
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (circleDot && varName)  //圆点
                {
                    let outVar=this.VarTable.get(varName);
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    let value={Name:varName, Data:outVar, Radius:g_JSChartResource.CIRCLEDOT.Radius, Type:3};
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (upDownDot && varName)   //彩色点
                {
                    let outVar=this.VarTable.get(varName);
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    let value={Name:varName, Data:outVar, Radius:g_JSChartResource.CIRCLEDOT.Radius, Type:3, UpDownDot:true };
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (lineStick && varName)  //LINESTICK  同时画出柱状线和指标线
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar, Type:4};
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (stick && varName)  //STICK 画柱状线
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar, Type:5};
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (volStick && varName)   //VOLSTICK   画彩色柱状线
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar, Type:6};
                    if (color) value.Color=color;
                    if (upColor) value.UpColor=upColor;
                    if (downColor) value.DownColor=downColor;
                    if (lineWidth) value.LineWidth=lineWidth;
                    if (IFrameSplitOperator.IsNumber(stickType)) value.StickType=stickType;
                    this.OutVarTable.push(value);
                }
                else if (lineArea && varName)   //LINEAREA 面积
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar, Type:9};
                    if (color) value.Color=color;
                    if (upColor) value.UpColor=upColor;
                    if (downColor) value.DownColor=downColor;
                    if (lineWidth) value.LineWidth=lineWidth;
                    this.OutVarTable.push(value);
                }
                else if (colorStick && varName)  //CYW: SUM(VAR4,10)/10000, COLORSTICK; 画上下柱子
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar, Color:color, Type:2};
                    if (lineWidth) value.LineWidth=lineWidth;
                    if (color) value.Color=color;
                    if (upColor) value.UpColor=upColor;
                    if (downColor) value.DownColor=downColor;
                    this.OutVarTable.push(value);
                }
                else if (varName && color && !draw) 
                {
                    let outVar=this.VarTable.get(varName);
                    if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
                    let value={Name:varName, Data:outVar, Color:color, Type:0};
                    if (lineWidth) value.LineWidth=lineWidth;
                    if (isShow == false) value.IsShow = false;
                    if (isExData==true) value.IsExData = true;
                    if (isDotLine==true) value.IsDotLine=true;
                    if (isOverlayLine==true) value.IsOverlayLine=true;
                    if (isSingleLine==true) value.IsSingleLine=true;
                    if (isNoneName==true) value.NoneName=true;
                    if (isShowTitle==false) value.IsShowTitle=false;
                    if (stepLine==true) value.Type=7;
                    this.OutVarTable.push(value);
                }
                else if (draw)  //画图函数
                {
                    var outVar={Name:draw.Name, Draw:draw, Type:1};
                    if (color) outVar.Color=color;
                    if (isDotLine==true) outVar.IsDotLine=true;
                    if (lineWidth) outVar.LineWidth=lineWidth;
                    if (isDrawAbove) outVar.IsDrawAbove=true;
                    if (isDrawCenter) outVar.IsDrawCenter=true;
                    if (isDrawBelow) outVar.IsDrawBelow=true;
                    if (drawAlign>=0) outVar.DrawAlign=drawAlign;
                    if (drawVAlign>=0) outVar.DrawVAlign=drawVAlign;
                    if (fontSize>0) outVar.DrawFontSize=fontSize;
                    if (bgConfig) outVar.Background=bgConfig;
                    if (vLineConfig) outVar.VerticalLine=vLineConfig;
                    if (IFrameSplitOperator.IsNumber(xOffset)) outVar.XOffset=xOffset;
                    if (IFrameSplitOperator.IsNumber(yOffset)) outVar.YOffset=yOffset;
                    if (IFrameSplitOperator.IsBool(isFirstDraw)) outVar.IsFirstDraw=isFirstDraw;
                    if (IFrameSplitOperator.IsNumber(klineType)) outVar.KLineType=klineType;
                    this.OutVarTable.push(outVar);
                }
                else if (varName)
                {
                    let outVar=this.VarTable.get(varName);
                    let value={Name:varName, Data:outVar,Type:0};
                    if (color) value.Color=color;
                    if (lineWidth) value.LineWidth=lineWidth;
                    if (isShow==false) value.IsShow=false;
                    if (isExData==true) value.IsExData = true;
                    if (isDotLine==true) value.IsDotLine=true;
                    if (isOverlayLine==true) value.IsOverlayLine=true;
                    if (isSingleLine==true) value.IsSingleLine=true;
                    if (isShowTitle==false) value.IsShowTitle=false;
                    if (stepLine==true) value.Type=7;
                    this.OutVarTable.push(value);
                }
            }
        }
    }

    this.ReadUnaryExpression=function(item, varInfo)
    {
        var argument=item.Argument;
        var outVar=null;
        if (argument.Type==Syntax.Literal)
        {
            outVar=argument.Value;
            if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
        }
        else if (argument.Type==Syntax.Identifier)
        {
            var varName=argument.Name;
            outVar=this.ReadVariable(varName,item.Expression);
            if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
        }
        else if (argument.Type==Syntax.BinaryExpression)
        {
            outVar=argument.Out;
            if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
        }
        else if (argument.Type==Syntax.CallExpression)
        {
            var callItem=argument;
            if (this.Draw.IsDrawFunction(callItem.Callee.Name) )
            {
                return false;
            }
            else if (callItem.Callee.Name==="IFC" && callItem.Draw)
            {
                return false;
            }
            else
            {
                outVar=callItem.Out;
                if (!Array.isArray(outVar)) outVar=this.SingleDataToArrayData(outVar);
            }
        }
        else
        {
            return false;
        }
        
        if (item.Operator=='-')
        {
            if (outVar) outVar=this.Algorithm.Subtract(0,outVar);
        }

        varInfo.OutVar=outVar;
        return true;
    }

    this.GetOutIconData=function(cond, iconDraw)
    {
        if (Array.isArray(cond))
        {
            for(var i=0; i<cond.length && i<iconDraw.DrawData.length; ++i)
            {
                var item=cond[i];
                if (item<=0) iconDraw.DrawData[i]=null;
            }

            return iconDraw;
        }

        if (cond) return iconDraw;

        return null;
    }

    this.GetSoundEvent=function()
    {
        if (!this.GetEventCallback) return null;
        return this.GetEventCallback(JSCHART_EVENT_ID.ON_PLAY_SOUND);
    }

    this.Run=function()
    { 
        try
        {                       
            let data=this.RunAST();//执行脚本
            JSConsole.Complier.Log('[JSComplier.Run] execute finish', data);
            if (this.IndexCtrl) this.IndexCtrl.Status=0;
        
            if (this.UpdateUICallback) 
            {
                JSConsole.Complier.Log('[JSComplier.Run] invoke UpdateUICallback.');
                if (this.CallbackParam && this.CallbackParam.Job && this.CallbackParam.Job.ID==JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX)
                {
                    this.UpdateUICallback(data,this.CallbackParam, this.SymbolData);
                }
                else
                {
                    if (this.CallbackParam && this.CallbackParam.Self && this.CallbackParam.Self.ClassName==='ScriptIndexConsole') this.CallbackParam.JSExecute=this;
                    if (this.IsUsePageData==true) this.CallbackParam.Self.IsUsePageData=true;
                    this.UpdateUICallback(data,this.CallbackParam);
                }
            }
        }
        catch(error)
        {
            JSConsole.Complier.Log(error);
            if (error.Job)
            {
                JSConsole.Complier.Log('[JSComplier.Run] download job and reexectue', error.Job);
                this.JobList.push(error.Job);
                this.JobList.push({ID:JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT});
                this.Execute();
            }
            else if (this.ErrorCallback) 
            {
                if (this.IndexCtrl) this.IndexCtrl.Status=0;
                this.ErrorCallback(error, this.CallbackParam);
            }
        }
    }


    this.DebugRun_End=function()
    {
        var data=this.OutVarTable;
        JSConsole.Complier.Log('[JSComplier.DebugRun_End] execute finish', data);
        if (this.IndexCtrl) this.IndexCtrl.Status=0;
    
        if (this.UpdateUICallback) 
        {
            JSConsole.Complier.Log('[JSComplier.DebugRun_End] invoke UpdateUICallback.');
            if (this.CallbackParam && this.CallbackParam.Job && this.CallbackParam.Job.ID==JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX)
            {
                this.UpdateUICallback(data,this.CallbackParam, this.SymbolData);
            }
            else
            {
                if (this.CallbackParam && this.CallbackParam.Self && this.CallbackParam.Self.ClassName==='ScriptIndexConsole') this.CallbackParam.JSExecute=this;
                if (this.IsUsePageData==true) this.CallbackParam.Self.IsUsePageData=true;
                this.UpdateUICallback(data,this.CallbackParam);
            }
        }
    }

    this.DebugRun_Next=function(debugCtrl)
    {
        if (debugCtrl.ExeLine<debugCtrl.LineCount)
        {
            var item =this.AST.Body[debugCtrl.ExeLine];
            this.RunASTNode(item);
            ++debugCtrl.ExeLine;

            this.DebugFilter(debugCtrl, ()=>
            {
                this.DebugRun_Next(debugCtrl);
            });
        }
        else
        {
            this.DebugRun_End();
            debugCtrl.Status=2;
            this.DebugFilter(debugCtrl,null);
        }
    }

    //debug模式
    this.DebugRun=function()
    {
        try
        {                       
            if (!this.AST) this.ThrowError();
            if (!this.AST.Body) this.ThrowError();

            var debugCtrl={ LineCount:this.AST.Body.length, ExeLine:0, Self:this, Status:1 };

            this.DebugFilter(debugCtrl, ()=>
            {
                this.DebugRun_Next(debugCtrl);
            });
        }
        catch(error)
        {
            if (this.ErrorCallback) 
            {
                if (this.IndexCtrl) this.IndexCtrl.Status=0;
                this.ErrorCallback(error, this.CallbackParam);
            }
        }
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
            case Syntax.UnaryExpression:
                this.VisitUnaryExpression(node);
                break;
        }
    }

    this.VisitUnaryExpression=function(node)
    {
        if (node.Operator=='-') 
        {
            var tempValue=this.GetNodeValueEx(node.Argument);
            var value=this.Algorithm.Subtract(0,tempValue);
        }
        else 
        {
            var value=node.Argument.Value;
        }

        return value;
    }

    this.VisitSequenceExpression=function(node)
    {
        for(let i in node.Expression)
        {
            let item =node.Expression[i];
            this.VisitNode(item);
        }
    }

    this.GetDynamicScriptIndex=function(node, args)
    {
        var dynamicName=node.Callee.Value;
        var aryValue=dynamicName.split(".");
        if (aryValue.length!=2) 
        {
            this.ThrowUnexpectedNode(node,`调用指标格式'${dynamicName}'错误`);
        }

        var name=aryValue[0];
        var outName=aryValue[1];
        var period=null;
        var pos=outName.indexOf('#');
        if (pos!=-1)
        {
            period=outName.slice(pos+1);     //周期
            outName=outName.slice(0,pos);
        }

        var strValue="";
        for(var i=0; i<args.length; ++i)
        {
            var value=args[i];
            if (strValue.length>0) strValue+=","; 
            strValue+=`${value}`;
        }
        var strArgs=`(${strValue})`;
        var key=`${outName}#${strArgs}`;
        if (period) key+=`#${period}`;
       
        if (!this.VarTable.has(name)) return null;
        var indexData=this.VarTable.get(name);
        var value=indexData[key];
        return value;
    }

    //函数调用
    this.VisitCallExpression=function(node)
    {
        var funcName=node.Callee.Name;
        var args=[];
        for(var i=0;i<node.Arguments.length;++i)
        {
            var item=node.Arguments[i];
            var value;

            if (funcName==="IFC" && i>=1) 
                break;   //IFC先处理第1个条件参数

            if (item.Type==Syntax.BinaryExpression || item.Type==Syntax.LogicalExpression) 
                value=this.VisitBinaryExpression(item);
            else if (item.Type==Syntax.CallExpression)
                value=this.VisitCallExpression(item);
            else
                value=this.GetNodeValue(item);

            args.push(value);
        }

        if (node.Callee.Type==Syntax.Literal)
        {
            node.Out=[];
            node.Draw=null;
            var data=this.GetDynamicScriptIndex(node, args);
            if (data) node.Out=data;
            return node.Out;
        }

        if (funcName==="IFC")
        {
            //IFC(X,A,B)若X不为0则执行A,否则执行B.IFC与IF函数的区别:根据X的值来选择性执行A、B表达式.
            var bResult=this.Algorithm.IFC(args[0]);
            var item=bResult? node.Arguments[1] : node.Arguments[2];

            var value;

            if (item.Type==Syntax.BinaryExpression || item.Type==Syntax.LogicalExpression) 
                value=this.VisitBinaryExpression(item);
            else if (item.Type==Syntax.CallExpression)
                value=this.VisitCallExpression(item);
            else
                value=this.GetNodeValue(item);

            node.Out=value;
            if (item.Draw) node.Draw=item.Draw;
            return node.Out;
        }

        //JSConsole.Complier.Log('[JSExecute::VisitCallExpression]' , funcName, '(', args.toString() ,')');

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

        if (g_JSComplierResource.IsCustomDataFunction(funcName))
        {
            var functionInfo=g_JSComplierResource.CustomDataFunction.Data.get(funcName);
            node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:functionInfo.ArgCount, Node:node } );
            node.Draw=null;

            return  node.Out;
        }

        switch(funcName)
        {
            case 'DYNAINFO':    //行情最新数据
                node.Out=this.SymbolData.GetLatestCacheData(args[0]);
                break;
            case 'STICKLINE':
                node.Draw=this.Draw.STICKLINE(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'DRAWTEXT':
                node.Draw=this.Draw.DRAWTEXT(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case 'DRAWTEXT_FIX':
                node.Draw=this.Draw.DRAWTEXT_FIX(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'SUPERDRAWTEXT':
                node.Draw=this.Draw.SUPERDRAWTEXT(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'DRAWICON':
                node.Draw=this.Draw.DRAWICON(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case "ICON":
                node.Draw=this.Draw.ICON(args[0],args[1]);
                node.Out=[];
                break;
            case "TIPICON":
                node.Draw=this.Draw.TIPICON(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case "BACKGROUND":
                node.Draw=this.Draw.BACKGROUND(args[0],args[1],args[2],args[3],args[4],args[5]);
                node.Out=[];
                break;
            case "CKLINE":
                node.Draw=this.Draw.CKLINE(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'DRAWLINE':
                node.Draw=this.Draw.DRAWLINE(args[0],args[1],args[2],args[3],args[4]);
                node.Out=node.Draw.DrawData;
                break;
            case 'DRAWBAND':
                node.Draw=this.Draw.DRAWBAND(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case "FILLRGN":
                if (args.length>=4) node.Draw=this.Draw.FILLRGN2(args);
                else node.Draw=this.Draw.FILLRGN(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case "FLOATRGN":
                node.Draw=this.Draw.FLOATRGN(args);
                node.Out=[];
                break;
            case "FILLTOPRGN":
                node.Draw=this.Draw.FILLBGRGN(1, args);
                node.Out=[];
                break;
            case "FILLBOTTOMRGN":
                node.Draw=this.Draw.FILLBGRGN(0, args);
                node.Out=[];
                break;
            case "FILLVERTICALRGN":
                node.Draw=this.Draw.FILLVERTICALRGN(args);
                node.Out=[];
                break;
            case 'DRAWKLINE':
            case "DRAWKLINE1":
                node.Draw=this.Draw.DRAWKLINE(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case 'DRAWKLINE_IF':
                node.Draw=this.Draw.DRAWKLINE_IF(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case "KLINETYPE":   //K线类型 和DRAWKLINE连用
                node.Out=this.Draw.KLINETYPE(args[0]);
                break;
            case "DRAWOVERLAYKLINE":
                node.Draw=this.Draw.DRAWOVERLAYKLINE(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case "DRAWCOLORKLINE":
                node.Draw=this.Draw.DRAWCOLORKLINE(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case 'PLOYLINE':
            case 'POLYLINE':
                node.Draw=this.Draw.POLYLINE(args[0],args[1]);
                node.Out=node.Draw.DrawData;
                break;
            case 'DRAWNUMBER':
                node.Draw=this.Draw.DRAWNUMBER(args[0],args[1],args[2], args[3]);
                node.Out=node.Draw.DrawData.Value;
                break;
            case "DRAWNUMBER_FIX":
                node.Draw=this.Draw.DRAWNUMBER_FIX(args[0],args[1],args[2],args[3],args[4]);
                node.Out=node.Draw.DrawData.Value;
                break;
            case "DRAWCHANNEL":
                node.Draw=this.Draw.DRAWCHANNEL(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
                node.Out=[];
                break;
            case 'RGB':
                node.Out=this.Draw.RGB(args[0],args[1],args[2]);
                break;
            case "RGBA":
                node.Out=this.Draw.RGBA(args[0],args[1],args[2],args[3]);
                break;
            case "UPCOLOR":
                node.Out=this.Draw.UPCOLOR(args[0]);
                break;
            case "DOWNCOLOR":
                node.Out=this.Draw.DOWNCOLOR(args[0]);
                break;
            case "STICKTYPE":   //柱子类型
                node.Out=this.Draw.STICKTYPE(args[0]);
                break;
            case "XMOVE":
                node.Out=this.Draw.XMOVE(args[0]);
                break;
            case "YMOVE":
                node.Out=this.Draw.YMOVE(args[0]);
                break;
            case "FIRSTDRAW":
                node.Out=this.Draw.FIRSTDRAW(args[0]);
                break;
            case 'PARTLINE':
                node.Draw=this.Draw.PARTLINE(args);
                node.Out=[];
                break;
            case 'DRAWGBK':
                node.Draw=this.Draw.DRAWGBK(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case 'DRAWGBK2':
                node.Draw=this.Draw.DRAWGBK2(args[0],args[1],args[2],args[3]);
                node.Out=[];
                break;
            case "DRAWGBK_DIV":
                node.Draw=this.Draw.DRAWGBK_DIV(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'DRAWTEXT_LINE':
                node.Draw=this.Draw.DRAWTEXT_LINE(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
                node.Out=[];
                break;
            case 'DRAWRECTREL':
                node.Draw=this.Draw.DRAWRECTREL(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case "DRAWTEXTREL":
                node.Draw=this.Draw.DRAWTEXTREL(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case "DRAWTEXTABS":
                node.Draw=this.Draw.DRAWTEXTABS(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case "DRAWOVERLAYLINE":
                node.Draw=this.Draw.DRAWOVERLAYLINE(args[0],args[1],args[2]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case "DRAWSL":
                node.Draw=this.Draw.DRAWSL(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case "VERTLINE":
                node.Draw=this.Draw.VERTLINE(args[0],args[1]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case "HORLINE":
                node.Draw=this.Draw.HORLINE(args[0],args[1],args[2],args[3]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case 'CODELIKE':
                node.Out=this.SymbolData.CODELIKE(args[0]);
                break;
            case 'NAMELIKE':
            case "NAMEINCLUDE":
                node.Out=this.SymbolData.NAMELIKE(args[1]);
                break;
            case 'REFDATE':
                node.Out=this.SymbolData.REFDATE(args[0],args[1]);
                break;
            case 'FINANCE':
                node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:1, Node:node } );
                break;
            case "FINVALUE":
                node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:1, Node:node } );
                break;
            case "FINONE":
                node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:3, Node:node } );
                break;
            case "GPJYVALUE":
                node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:3, Node:node } );
                break;
            case "SCJYVALUE":
                node.Out=this.SymbolData.GetStockCacheData( {FunctionName:funcName, Args:args, ArgCount:3, Node:node } );
                break;
            case "MARGIN":
                node.Out=this.SymbolData.GetMarginCacheData(args[0],node);
                break;
            case "HK2SHSZ":
                node.Out=this.SymbolData.GetHKToSHSZCacheData(args[0],node);
                break;
            case "NEWS":
                node.Out=this.SymbolData.GetNewsAnalysisCacheData(args[0],node);
                break;
            case 'UPCOUNT':
            case 'DOWNCOUNT':
                node.Out=this.SymbolData.GetIndexIncreaseCacheData(funcName,args[0],node);
                break;
            case 'SF':
                node.Out=this.SymbolData.GetSectionFinanceCacheData(args[0],args[1],args[2],node);
                break;
            case 'LOADAPIDATA':
                node.Out=this.SymbolData.GetCustomApiData(args);
                break;
            case "STKINDI":
            case "CALCSTOCKINDEX":
                node.Out=this.SymbolData.GetScriptIndexOutData(args,node,funcName);
                break;
            case "SOUND":
                node.Draw=this.Draw.SOUND(args[0]);
                node.Out=[];
                break;
            case "PLAYSOUND":
                node.Draw=this.Draw.PLAYSOUND(args[0],args[1]);
                node.Out=[];
                break;
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
                node.Out=this.SymbolData.GetOtherSymolCacheData( {FunctionName:funcName, Args:args} );
                break;
            case "INBLOCK":
                node.Out=this.SymbolData.IsInBlock(args[0],node);
                break;

            case 'COVER_C':
            case 'COVER_O':
            case 'COVER_H':
            case 'COVER_L':
            case 'COVER_A':
            case 'COVER_V':
                if (args.length==2) return this.SymbolData.GetSymbolPeriodCacheData2(JSComplierHelper.GetConvertValueName(funcName),args[0],args[1]);
                return this.SymbolData.GetSymbolPeriodCacheData(JSComplierHelper.GetConvertValueName(funcName),args[0]);

            case "SYSPARAM":
                node.Out=this.SymbolData.SysParam(args[0], this);
                break;

            case "TESTSKIP":
                var bExit=this.Algorithm.TESTSKIP(args[0],node);
                node.Out=null;
                if (bExit) 
                {
                    this.Interrupt.Exit=true;
                    if (node && node.Marker) 
                    {
                        var marker=node.Marker;
                        this.Interrupt.Line=marker.Line;
                        this.Interrupt.Index=marker.Index;
                        this.Interrupt.Column=marker.Column;
                    }
                }
                break;

            //交易函数
            case "BUY":
                node.Draw=this.Draw.BUY(args[0],args[1],args[2],args[3]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case "SELL":
                node.Draw=this.Draw.SELL(args[0],args[1],args[2],args[3]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case "SELLSHORT":
                node.Draw=this.Draw.SELLSHORT(args[0],args[1],args[2],args[3]);
                node.Out=node.Draw.DrawData.Data;
                break;
            case "BUYSHORT":
                node.Draw=this.Draw.BUYSHORT(args[0],args[1],args[2],args[3]);
                node.Out=node.Draw.DrawData.Data;
                break;

            default:
                node.Out=this.Algorithm.CallFunction(funcName, args, node, this.SymbolData);
                break;
        }

        return node.Out;
    }

    //赋值
    this.VisitAssignmentExpression=function(node)
    {
        let left=node.Left;
        if (left.Type!=Syntax.Identifier) this.ThrowUnexpectedNode(node);

        let varName=left.Name;

        let right=node.Right;
        let value=null, drawValue=null;
        if (right.Type==Syntax.BinaryExpression || right.Type==Syntax.LogicalExpression)
            value=this.VisitBinaryExpression(right);
        else if (right.Type==Syntax.CallExpression)
        {
            value=this.VisitCallExpression(right);
            if (right.Draw) drawValue=right.Draw;
        }
        else if (right.Type==Syntax.Literal)
        {
            value=right.Value;
            if (IFrameSplitOperator.IsString(value) && right.Value.indexOf("$")>0)
                value=this.SymbolData.GetOtherSymolCacheData( {Literal:value} );
        }
        else if (right.Type==Syntax.Identifier) //右值是变量
            value=this.ReadVariable(right.Name,right);
        else if (right.Type==Syntax.MemberExpression)
            value=this.ReadMemberVariable(right);
        else if (right.Type==Syntax.UnaryExpression)
            value=this.VisitUnaryExpression(right);

        if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitAssignmentExpression]' , varName, ' = ',value);

        if (drawValue) this.VarDrawTable.set(varName, drawValue);
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

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] BinaryExpression',value , leftValue, rightValue);
                    value.Out=null; //保存中间值

                    switch(value.Operator)
                    {
                        case '-':
                            value.Out=this.Algorithm.Subtract(leftValue,rightValue);
                            break;
                        case '*':
                            value.Out=this.Algorithm.Multiply(leftValue,rightValue);
                            break;
                        case '/':
                            value.Out=this.Algorithm.Divide(leftValue,rightValue)
                            break;
                        case '+':
                            value.Out=this.Algorithm.Add(leftValue,rightValue);
                            break;
                        case '>':
                            value.Out=this.Algorithm.GT(leftValue,rightValue);
                            break;
                        case '>=':
                            value.Out=this.Algorithm.GTE(leftValue,rightValue);
                            break;
                        case '<':
                            value.Out=this.Algorithm.LT(leftValue,rightValue);
                            break;
                        case '<=':
                            value.Out=this.Algorithm.LTE(leftValue,rightValue);
                            break;
                        case '==':
                        case '=':   //= 比较
                            value.Out=this.Algorithm.EQ(leftValue,rightValue);
                            break;
                        case '!=':
                        case '<>':
                            value.Out=this.Algorithm.NEQ(leftValue,rightValue);
                            break;
                    }

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] BinaryExpression',value);
                }
                else if (value.Type==Syntax.LogicalExpression)
                {
                    let leftValue=this.GetNodeValue(value.Left);
                    let rightValue=this.GetNodeValue(value.Right);

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] LogicalExpression',value , leftValue, rightValue);
                    value.Out=null; //保存中间值

                    switch(value.Operator)
                    {
                        case '&&':
                        case 'AND':
                            value.Out=this.Algorithm.And(leftValue,rightValue);
                            break;
                        case '||':
                        case 'OR':
                            value.Out=this.Algorithm.Or(leftValue,rightValue);
                            break;
                    }

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] LogicalExpression',value);
                }
                
                node=temp;
            }
        }

        return node.Out;

    }

    //获取节点值，BinaryExpression，LogicalExpression会重新计算
    this.GetNodeValueEx=function(item)
    {
        var value=null;
        if (item.Type==Syntax.BinaryExpression || item.Type==Syntax.LogicalExpression) 
            value=this.VisitBinaryExpression(item);
        else if (item.Type==Syntax.CallExpression)
            value=this.VisitCallExpression(item);
        else
            value=this.GetNodeValue(item);

        return value;
    }

    this.GetNodeValue=function(node)
    {
        switch(node.Type)
        {
            case Syntax.Literal:    //数字
                return node.Value;
            case Syntax.UnaryExpression:
                var value=this.VisitUnaryExpression(node);
                return value;
            case Syntax.Identifier:
                var value=this.ReadVariable(node.Name,node);
                return value;
            case Syntax.BinaryExpression:
            case Syntax.LogicalExpression:
                return node.Out;
            case Syntax.CallExpression:
                return this.VisitCallExpression(node);
            case Syntax.MemberExpression:
                return this.ReadMemberVariable(node);
            default:
                this.ThrowUnexpectedNode(node);
        }
    }

    this.ThrowUnexpectedNode=function(node,message,word)
    {
        let marker=node.Marker;
        let msg=message || "执行异常";
       
        return this.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg, word);
       
    }

    this.ThrowDownloadSF=function(node,job,message)
    {
        let marker=node.Marker;
        let msg=message;

        return this.ErrorHandler.ThrowDownloadJob(marker.Index,marker.Line,marker.Column,msg,job);
    }

    this.ThrowError=function()
    {

    }
}

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
    this.MaxValueLength=150;        //最长的字符

    //脚本自动变量表, 只读
    this.ConstVarTable=new Map(
    [
        //个股数据
        ['CLOSE',"收盘价"],['VOL',"成交量"],['OPEN',"开盘价"],['HIGH',"最高价"],['LOW',"最低价"],['AMOUNT',"成交量"],
        ['C',"收盘价"],['V',"成交量"],['O',"开盘价"],['H',"最高价"],['L',"最低价"],['AMO',"成交量"], 
        ['VOLR',"量比"], ['VOLINSTK',"持仓量"], ["OPI","持仓量"], ["ZSTJJ","均价"], ["QHJSJ","结算价"], ["SETTLE", "结算价"],

        //日期类
        ['DATE',"日期"],['YEAR',"年份"],['MONTH',"月份"],["DAY","日"],['PERIOD', "周期"],['WEEK',"星期"],["TIME","时间"],

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

        ['DRAWNULL',"无效数据"],
        ["TR", "求真实波幅"],

        ["LARGEINTRDVOL","逐笔买入大单成交量"],
        ["LARGEOUTTRDVOL","逐笔卖出大单成交量"],
        ["TRADENUM", "逐笔成交总单数"],         
        ["TRADEINNUM", "逐笔买入成交单数"],       
        ["TRADEOUTNUM", "逐笔卖出成交单数"],      
        ["LARGETRDINNUM", "逐笔买入大单成交单数"],   
        ["LARGETRDOUTNUM", "逐笔卖出大单成交单数"],  
        ["CUR_BUYORDER", "总委买量"],    
        ["CUR_SELLORDER", "总委卖量"],   
        ["ACTINVOL", "主动买成交量"],         
        ["ACTOUTVOL", "主动卖成交量"],        
        ["BIDORDERVOL", "累计总有效委买量"],     
        ["BIDCANCELVOL", "累计总有效撤买量"],    
        ["AVGBIDPX", "最新委买均价"],         
        ["OFFERORDERVOL", "累计总有效委卖量"],   
        ["OFFERCANCELVOL", "累计总有效撤卖量"],   
        ["AVGOFFERPX", "最新委卖均价"],

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

        for(var i=0; i<this.AST.Body.length; ++i)
        {
            //console.log(`[JSExplainer::RunAST] ${i}`);
            var item =this.AST.Body[i];
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
                else if (item.Expression.Type==Syntax.UnaryExpression) //一元运算 如-C, -7, -(C+10)
                {
                    var varName="__temp_l_"+i+"__";
                    var argument=item.Expression.Argument;
                    let outVar=null;
                    if (argument.Type==Syntax.Literal)
                    {
                        outVar=argument.Value;
                    }
                    else if (argument.Type==Syntax.Identifier)
                    {
                        let varName=argument.Name;
                        outVar=this.ReadVariable(varName,item.Expression);
                    }
                    else if (argument.Type==Syntax.BinaryExpression)
                    {
                        outVar=argument.Out;
                    }

                    if (item.Expression.Operator=='-') 
                    {
                        outVar=`-${outVar}`;
                    }

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
                    var fontSize=-1;
                    var drawAlign=-1, drawVAlign=-1;
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
                            this.VarTable.set(varName,this.ConvertToShortValue(varValue));            //把常量放到变量表里
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

                            else if (value=="ALIGN0") drawAlign=0;
                            else if (value=="ALIGN1") drawAlign=1;
                            else if (value=="ALIGN2") drawAlign=2;
                       
                            else if (value=="VALIGN0") drawVAlign=0;
                            else if (value=="VALIGN1") drawVAlign=1;
                            else if (value=="VALIGN2") drawVAlign=2;

                            else if (value.indexOf('NODRAW')==0) isShow=false;
                            else if (value.indexOf('EXDATA')==0) isExData=true; //扩展数据, 不显示再图形里面
                            else if (value.indexOf('LINEOVERLAY')==0) isOverlayLine=true;
                            else if (value.indexOf("FONTSIZE")==0)
                            {
                                var strFontSize=value.replace("FONTSIZE","");
                                fontSize=parseInt(strFontSize);
                            }
                            else 
                            {
                                varName=itemExpression.Name;
                                let varValue=this.ReadVariable(varName,itemExpression);
                                varName="__temp_si_"+i+"__";
                                isNoneName=true;
                                this.VarTable.set(varName,this.ConvertToShortValue(varValue));            //放到变量表里
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
                            if (j==0)
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
                        }
                        else if (itemExpression.Type==Syntax.BinaryExpression)
                        {
                            varName="__temp_sb_"+i+"__";
                            let aryValue=itemExpression.Out;
                            isNoneName=true;
                            this.VarTable.set(varName,aryValue);
                        }
                        else if (itemExpression.Type==Syntax.UnaryExpression)
                        {
                            varName="__temp_sb_"+i+"__";
                            var argument=itemExpression.Argument;
                            let aryValue=null;
                            if (argument.Type==Syntax.Literal)
                            {
                                aryValue=argument.Value;
                            }
                            else if (argument.Type==Syntax.Identifier)
                            {
                                let varName=argument.Name;
                                aryValue=this.ReadVariable(varName,item.Expression);
                            }
                            else if (argument.Type==Syntax.BinaryExpression)
                            {
                                aryValue=argument.Out;
                            }
                            
                            if (itemExpression.Operator=='-')
                            {
                                aryValue=`-${aryValue}`;
                            }
                            
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
                        let value={Name:varName, Draw:outValue, Radius:g_JSChartResource.POINTDOT.Radius, Type:3};
                        this.OutVarTable.push(value);
                    }
                    else if (circleDot && varName)  //圆点
                    {
                        outValue+=",画小圆圈线";
                        let value={Name:varName, Draw:outValue, Radius:g_JSChartResource.CIRCLEDOT.Radius, Type:3};
                        this.OutVarTable.push(value);
                    }
                    else if (lineStick && varName)  //LINESTICK  同时画出柱状线和指标线
                    {
                        outValue+=",画出柱状线和指标线";
                        let value={Name:varName, Draw:outValue, Type:4};
                        this.OutVarTable.push(value);
                    }
                    else if (stick && varName)  //STICK 画柱状线
                    {
                        outValue+=",画柱状线";
                        let value={Name:varName, Draw:outValue, Type:5};
                        this.OutVarTable.push(value);
                    }
                    else if (volStick && varName)   //VOLSTICK   画彩色柱状线
                    {
                        outValue+=",画成交量柱状线";
                        let value={Name:varName, Draw:outValue, Type:6};
                        this.OutVarTable.push(value);
                    }
                    else if (varName && color) 
                    {
                        let value={Name:varName, Data:outValue, Color:color, Type:0};
                        this.OutVarTable.push(value);
                    }
                    else if (draw)  //画图函数
                    {
                        var outVar={ Name:drawName, Draw:outValue, Type:1 };
                        this.OutVarTable.push(outVar);
                    }
                    else if (colorStick && varName)  //CYW: SUM(VAR4,10)/10000, COLORSTICK; 画上下柱子
                    {
                        outValue+=",画彩色柱状线";
                        let value={Name:varName, Draw:outValue, Color:color, Type:2};
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
            case Syntax.UnaryExpression:
                this.VisitUnaryExpression(node);
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

    this.VisitUnaryExpression=function(node)
    {
        if (node.Operator=='-') 
        {
            let value=this.GetNodeValueEx(node.Argument);
            return '-'+value;
        }

        return node.Argument.Value;
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

        if (node.Callee.Type==Syntax.Literal)
        {
            var dynamicName=node.Callee.Value;
            node.Out=`指标引用'${dynamicName}'`;
            return node.Out;
        }

        if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExplainer::VisitCallExpression]' , funcName, '(', args.toString() ,')');

        if (g_JSComplierResource.IsCustomFunction(funcName))
        {
            var functionInfo=g_JSComplierResource.CustomFunction.Data.get(funcName);
            if (!functionInfo.Description) node.Out=`自定义函数${funcName}`;
            else node.Out=functionInfo.Description;

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
            ["BARSLASTS",    { Name:"BARSLASTS", Param:{ Count:2 }, ToString:function(args) { return `倒数第N次成立时距今的周期数`; } } ],
            
            ["BARSNEXT",    { Name:"BARSNEXT", Param:{ Count:1 }, ToString:function(args) { return `下次${args[0]}不为0距今天数`; } } ],
            ["BARSSINCEN",  { Name:"BARSSINCEN", Param:{ Count:2 }, ToString:function(args) { return `在${args[1]}周期内首次${args[0]}距今天数`; } } ],
            ["BARSSINCE",   { Name:"BARSSINCE", Param:{ Count:1 }, ToString:function(args) { return `首次${args[0]}距今天数`; } } ],
            ["HHV", { Name:"HHV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的最高值`; } } ],
            ["LLV", { Name:"LLV", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的最低值`; } } ],
            ["ZTPRICE", { Name:"ZTPRICE", Param:{ Count:2 }, ToString:function(args) { return '计算涨停价'; } } ],
            ["DTPRICE", { Name:"DTPRICE", Param:{ Count:2 }, ToString:function(args) { return '计算跌停价'; } } ],
            ["BACKSET", { Name:"BACKSET", Param:{ Count:2 }, ToString:function(args) { return `若${args[0]}则将最近${args[1]}周期置为1`; } } ],

            ["HOD", { Name:"HOD", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的高值名次`; } } ],
            ["LOD", { Name:"LOD", Param:{ Count:2 }, ToString:function(args) { return `${args[1]}日内${args[0]}的低值名次`; } } ],
            ["REVERSE", { Name:"REVERSE", Param:{ Count:1 }, ToString:function(args) { return `${args[0]}的相反数`; } } ],
            ["FILTER", { Name:"FILTER", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日过滤`; } } ],
            ["FILTERX", { Name:"FILTERX", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日反向过滤`; } } ],
            ["TFILTER", { Name:"TFILTER", Param:{Count:3}, ToString:function(args) { return `信号过滤(多头)`; } }],
            ["SUMBARS", { Name:"SUMBARS", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}累加至${args[1]}的天数`; } } ],
            ["MA", { Name:"MA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日简单移动平均`; } } ],
            ["SMA", { Name:"SMA", Param:{ Count:3 }, ToString:function(args) { return `${args[0]}的${args[1]}日[${args[2]}日权重]移动平均`; } } ],
            ["MEMA", { Name:"MEMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日平滑移动平均`; } } ],
            ["EMA", { Name:"EMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日指数移动平均`; } } ],
            ["EXPMA", { Name:"EXPMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日指数移动平均`; } } ],
            ["EXPMEMA", { Name:"EXPMEMA", Param:{ Count:2 }, ToString:function(args) { return `${args[0]}的${args[1]}日指数平滑移动平均`; } }],
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
            ["IFC", { Name:"IFC", Param:{ Count:3 }, ToString:function(args) { return `如果${args[0]},返回${args[1]},否则返回${args[2]}`; } } ],
            ["TESTSKIP", { Name:"TESTSKIP", Param:{ Count:1 }, ToString:function(args) { return `如果满足条件${args[0]},公式返回`; } } ],
            ["VALUEWHEN", { Name:"VALUEWHEN", Param:{ Count:2 }, ToString:function(args) { return `如果${args[0]},返回${args[1]},否则返回上个输出值 `; } } ],

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
            ["NAMEINCLUDE", { Name:"NAMEINCLUDE", Param:{ Count:1 }, ToString:function(args) { return `查找品种名称中包含${args[0]}`; } } ],
            ["CODELIKE", { Name:"CODELIKE", Param:{ Count:1 }, ToString:function(args) { return `查找品种名称中包含${args[0]}`; } } ],
            ["INBLOCK", { Name:"AVEDEV", Param:{ Count:1 }, ToString:function(args) { return `属于${args[0]}板块`; } } ],
            ["STKINDI",{ Name:"STKINDI", Param:{ Dynamic:true }, ToString:function(args) { return "指标引用"; } }],
            ["STRFORMAT",{ Name:"STRFORMAT", Param:{ Dynamic:true }, ToString:function(args) { return `格式化${args[0]}字符串`; } }],
            ["NAMELIKE",{ Name:"NAMELIKE", Param:{ Count:1 }, ToString:function(args) { return `品种名称是否以'${args[0]}'开头`; } }],

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
            ],

            ["L2_VOLNUM", { Name:"L2_VOLNUM", Param:{ Count:2 }, ToString:function(args) { return `单数分档`; } }],
            ["L2_VOL", { Name:"L2_VOL", Param:{ Count:2 }, ToString:function(args) { return `成交量分档`; } }],
            ["L2_AMO", { Name:"L2_AMO", Param:{ Count:2 }, ToString:function(args) { return `成交额分档`; } }],
            
        ]
    );

    this.CallFunctionExplain=function(funcName, args, node)
    {
        if (this.FUNCTION_INFO_LIST.has(funcName))
        {
            var item=this.FUNCTION_INFO_LIST.get(funcName);

            if (item.Param.Dynamic===true)  //动态参数
            {

            }
            else
            {
                if (item.Param.Count!=args.length)
                this.ThrowUnexpectedNode(node,`函数${funcName}参数个数不正确. 需要${item.Param.Count}个参数`);
            }
 
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
            case "DRAWKLINE1":
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
            case "RGBA":
                return `自定色[${args[0]},${args[1]},${args[2]},${args[3]}]`;
            case "DRAWBAND":
                return '画带状线';
            case "DRAWRECTREL":
                return "相对位置上画矩形.";
            case "DRAWGBK":
                return "填充背景";
            case "TIPICON":
                return `当满足条件${args[0]}时,在${args[1]}位置画${args[2]}号图标`;
            case "STICKLINE":
                var barType="";
                if (args[4]==-1) barType="虚线空心柱";
                else if (args[4]==0) barType="实心柱";
                else barType="实线空心柱";
                return `当满足条件${args[0]}时, 在${args[1]}和${args[2]}位置之间画柱状线,宽度为${args[3]},${barType}`;
            case "PARTLINE":
                return "画折线"

            case "SELL":
                return "卖出平仓";
            case "BUY":
                return "买入开仓";
            case "SELLSHORT":
                return "卖出开仓";
            case "BUYSHORT":
                return "买入平仓";

            case "YMOVE":
                return;
            case "BACKGROUND":
                return "绘制背景";
            case "UPCOLOR":
                return `上涨颜色${args[0]}`;
            case "DOWNCOLOR":
                return `下跌颜色${args[0]}`;
            case "STICKTYPE":
            case "FIRSTDRAW":
                return "";


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
            "STICKLINE","DRAWTEXT",'SUPERDRAWTEXT','DRAWLINE','DRAWBAND','DRAWKLINE',"DRAWKLINE1",'DRAWKLINE_IF','PLOYLINE',
            'POLYLINE','DRAWNUMBER',"DRAWNUMBER_FIX",'DRAWICON','DRAWCHANNEL','PARTLINE','DRAWTEXT_FIX','DRAWGBK','DRAWTEXT_LINE','DRAWRECTREL',"DRAWTEXTABS",
            'DRAWOVERLAYLINE',"FILLRGN", "FILLRGN2","FILLTOPRGN", "FILLBOTTOMRGN", "FILLVERTICALRGN","FLOATRGN","DRAWSL", "DRAWGBK2",
            "BUY","BUYSHORT","SELL","SELLSHORT",
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
            value=this.VisitUnaryExpression(right);

        if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExplainer::VisitAssignmentExpression]' , varName, ' = ',value);

        this.VarTable.set(varName,this.ConvertToShortValue(value));
    }

    this.ConvertToShortValue=function(value)
    {
        var maxLength=this.MaxValueLength;
        if (value && value.length>=maxLength)
        {
            var shortValue=value.slice(0, maxLength-10);
            shortValue+="......";
            return shortValue;
        }
       
        return value;
    }

    this.ReadMemberVariable=function(node)
    {
        var obj=node.Object;
        var member=node.Property;

        let maiObj;
        if (obj.Type==Syntax.BinaryExpression || obj.Type==Syntax.LogicalExpression ) 
            maiObj=this.VisitBinaryExpression(obj);
        else if (obj.Type==Syntax.CallExpression)
            maiObj=this.VisitCallExpression(obj);
        else
        {
            if (member.Name.indexOf('#')>0)
            {
                var aryValue=member.Name.split("#");
                var value=`${obj.Name}的${aryValue[0]}[周期${aryValue[1]}]`;
            }
            else
            {
                var value=`${obj.Name}的${member.Name}`;
            }
            return value;
        }

        if (!maiObj) return null;
        var value=maiObj[member.Name];
        if (value) return value;

        return null;
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

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] BinaryExpression',value , leftValue, rightValue);
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
                        
                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] BinaryExpression',value);
                }
                else if (value.Type==Syntax.LogicalExpression)
                {
                    let leftValue=this.GetNodeValue(value.Left);
                    let rightValue=this.GetNodeValue(value.Right);

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitBinaryExpression] LogicalExpression',value , leftValue, rightValue);
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

                    if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExplainer::VisitBinaryExpression] LogicalExpression',value);
                }
                
                node=temp;
            }
        }

        return node.Out;

    }

    this.GetNodeValueEx=function(node)
    {
        var value=null;
        if (node.Type==Syntax.BinaryExpression || node.Type==Syntax.LogicalExpression) 
            value=this.VisitBinaryExpression(node);
        else if (node.Type==Syntax.CallExpression)
            value=this.VisitCallExpression(node);
        else
            value=this.GetNodeValue(node);

        return value;
    }

    this.GetNodeValue=function(node)
    {
        switch(node.Type)
        {
            case Syntax.Literal:    //数字
                return node.Value;
            case Syntax.UnaryExpression:
                return this.VisitUnaryExpression(node);
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

        if (g_JSComplierResource.IsCustomVariant(name)) 
        {
            var variantInfo=g_JSComplierResource.CustomVariant.Data.get(name); //读取自定义变量
            if (variantInfo.Description) return variantInfo.Description;
            else return name;
        }

        if (this.VarTable.has(name)) return this.VarTable.get(name);

        if (name.indexOf('#')>0)
        {
            var aryPeriod=name.split('#');
            return this.SymbolPeriodExplain(aryPeriod[0],aryPeriod[1]);
        }

        if (name=="AUTOFILTER") //信号过滤
        {
            return this.AUTOFILTER();
        }

        this.ThrowUnexpectedNode(node, '变量'+name+'不存在');
        return name;
    }

    this.AUTOFILTER=function()
    {
        //TODO:过滤信号
        return null;
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

//对外导出类
function JSComplier()
{
    
}


//词法分析
JSComplier.Tokenize=function(code)
{
    JSConsole.Complier.Log('[JSComplier.Tokenize]', code);
    let tokenizer=new Tokenizer(code);
    let tokens=[];
    try
    {
        while(true)
        {
            let token=tokenizer.GetNextToken();
            if (!token) break;

            tokens.push(token);
        }
    }
    catch(e)
    {

    }

    return tokens;
}

//语法解析 生成抽象语法树(Abstract Syntax Tree)
JSComplier.Parse=function(code)
{
    JSConsole.Complier.Log('[JSComplier.Parse]',code);

    let parser=new JSParser(code);
    parser.Initialize();
    let program=parser.ParseScript();
    let ast=program;
    return ast;
}

/*
    执行
    option.Symbol=股票代码
    option.Name=股票名称
    option.Data=这个股票的ChartData
    option.Right=复权
    option.MaxRequestDataCount=请求数据的最大个数
*/

function timeout(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  
JSComplier.Execute=function(code,option,errorCallback)
{
    //异步调用
    //var asyncExecute= async function() es5不能执行 去掉异步
    var asyncExecute= function()
    {
        try
        {
            if (option.Self) option.Self.Status=1;
            JSConsole.Complier.Log('[JSComplier.Execute]',code,option);

            JSConsole.Complier.Log('[JSComplier.Execute] parser .....');
            let parser=new JSParser(code);
            parser.Initialize();
            let program=parser.ParseScript(); 
            
            let ast=program;
            JSConsole.Complier.Log('[JSComplier.Execute] parser finish.', ast);

            if (option.Self) option.Self.Status=2;
            JSConsole.Complier.Log('[JSComplier.Execute] execute .....');
            let execute=new JSExecute(ast,option);
            execute.ErrorCallback=errorCallback;        //执行错误回调
            execute.JobList=parser.Node.GetDataJobList();
            if (option.ClassName=='ScriptIndexConsole' && !option.Data) execute.JobList.unshift({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA});
            execute.JobList.push({ID:JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT});

            if (option.Self) option.Self.Status=3;
            let result=execute.Execute();
            
        }catch(error)
        {
            JSConsole.Complier.Log(error);
            if (errorCallback) errorCallback(error, option.CallbackParam);
            if (option.Self) option.Self.Status=0;
        }
    }

    asyncExecute();

    JSConsole.Complier.Log('[JSComplier.Execute] async execute.');
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


JSComplier.SetDomain = function (domain, cacheDomain)   //修改API地址
{
    if (domain) g_JSComplierResource.Domain = domain;
    if (cacheDomain) g_JSComplierResource.CacheDomain = cacheDomain;
}


JSComplier.AddIcon=function(obj)    //添加一个obj={ID:, Text:, Color, Family: }
{
    g_JSComplierResource.CustomDrawIcon.Data.set(obj.ID, obj);
}

JSComplier.AddFunction=function(obj)    //添加函数 { Name:函数名, Description:描述信息, IsDownload:是否需要下载数据, Invoke:函数执行(可选) }
{
    if (!obj || !obj.Name) return;

    var ID=obj.Name.toUpperCase();
    g_JSComplierResource.CustomFunction.Data.set(ID, obj);
}

JSComplier.AddVariant=function(obj) //{ Name:变量名, Description:描述信息 }
{
    if (!obj || !obj.Name) return;

    var ID=obj.Name.toUpperCase();
    g_JSComplierResource.CustomVariant.Data.set(ID, obj);
}


JSComplier.ColorVarToRGB=function(colorName)
{
    let COLOR_MAP=new Map(
    [
        ['COLORBLACK','rgb(0,0,0)'],
        ['COLORBLUE','rgb(18,95,216)'],
        ['COLORGREEN','rgb(25,158,0)'],
        ['COLORCYAN','rgb(0,255,198)'],
        ['COLORRED','rgb(238,21,21)'],
        ['COLORMAGENTA','rgb(255,0,222)'],
        ['COLORBROWN','rgb(149,94,15)'],
        ['COLORLIGRAY','rgb(218,218,218)'],      //画淡灰色
        ['COLORGRAY','rgb(133,133,133)'],        //画深灰色
        ['COLORLIBLUE','rgb(94,204,255)'],       //淡蓝色
        ['COLORLIGREEN','rgb(183,255,190)'],      //淡绿色
        ['COLORLICYAN','rgb(154,255,242)'],      //淡青色
        ['COLORLIRED','rgb(255,172,172)'],       //淡红色
        ['COLORLIMAGENTA','rgb(255,145,241)'],   //淡洋红色
        ['COLORWHITE','rgb(255,255,255)'],       //白色
        ['COLORYELLOW','rgb(255,198,0)']
    ]);

    if (COLOR_MAP.has(colorName)) return COLOR_MAP.get(colorName);

    //COLOR 自定义色
    //格式为COLOR+“BBGGRR”：BB、GG、RR表示蓝色、绿色和红色的分量，每种颜色的取值范围是00-FF，采用了16进制。
    //例如：MA5:MA(CLOSE,5)，COLOR00FFFF表示纯红色与纯绿色的混合色：COLOR808000表示淡蓝色和淡绿色的混合色。
    if (colorName.indexOf('COLOR')==0)
    {
        var strColor=colorName.substr(5);
        if (strColor.length!=6) return null;
    
        var value=strColor.substr(0,2);
        var b=parseInt(value,16);
        value=strColor.substr(2,2);
        var g=parseInt(value,16);
        value=strColor.substr(4,2);
        var r=parseInt(value,16);
        
        return `rgb(${r},${g},${b})`;
    }


    //格式为RGBX+“RRGGBB”：RR、GG、BB表示红色、绿色和的蓝色分量，每种颜色的取值范围是00-FF，采用了16进制。
    //例如：MA5:MA(CLOSE,5)，RGBXFFFF00表示纯红色与纯绿色的混合色：RGBX008080表示淡蓝色和淡绿色的混合色。
    if (colorName.indexOf("RGBX")==0)
    {
        var strColor=colorName.substr(4);
        if (strColor.length!=6) return null;

        var value=strColor.substr(0,2);
        var r=parseInt(value,16);
        value=strColor.substr(2,2);
        var g=parseInt(value,16);
        value=strColor.substr(4,2);
        var b=parseInt(value,16);
        
        return `rgb(${r},${g},${b})`;
    }


    return null;
}

var HQ_DATA_TYPE=
{
    KLINE_ID:0,         //K线
    MINUTE_ID:2,        //当日走势图
    HISTORY_MINUTE_ID:3,//历史分钟走势图
    MULTIDAY_MINUTE_ID:4,//多日走势图
};

// 图形指标名字
var SCRIPT_CHART_NAME=
{
    OVERLAY_BARS:"OVERLAY_BARS",     //叠加柱子图
    KLINE_TABLE:"KLINE_TABLE",
    SCATTER_PLOT:"SCATTER_PLOT",     //散点图
}


// 外部对接API指标数据及图形
function ScriptIndexChartFactory()
{
    this.DataMap=new Map(); //["图形名字", {} ]
    
    this.Add=function(name, option)
    {
        this.DataMap.set(name, 
            { 
                MinuteFittingCallback:option.MinuteFittingCallback,
                KLineFittingCallback:option.KLineFittingCallback,
                CreateChartCallback:option.CreateChartCallback,
                FormatTitleCallback:option.FormatTitleCallback,
            } 
        );
    }

    this.Get=function(name)
    {
        if (!this.DataMap.has(name)) return null;
        return this.DataMap.get(name);
    }

    this.Has=function(name)
    {
        return this.DataMap.has(name);
    }
}

var g_ScriptIndexChartFactory=new ScriptIndexChartFactory();


//脚本指标
//name=指标名字 args=参数名字 参数值
function ScriptIndex(name,script,args,option)
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod(name);
    delete this.newMethod;

    this.ClassName="ScriptIndex";
    this.Script=script;
    this.Arguments=[];
    this.OutVar=[];
    this.ID;                //指标ID
    this.FloatPrecision=2;  //小数位数
    this.StringFormat;
    this.IsShowIndexTitle=true; //是否显示指标标题
    this.KLineType=null;    //K线显示类型
    this.InstructionType;   //五彩K线, 交易指标
    this.YSpecificMaxMin=null;  //最大最小值
    this.YSplitScale=null;      //固定刻度
    this.Condition=null;        //限制条件
    this.OutName=null;          //动态输出指标名字
    this.YSplitType;

    //指标上锁配置信息
    this.IsLocked=false;    //是否锁住指标
    this.LockCallback=null;
    this.LockID=null;
    this.LockBG=null;       //锁背景色
    this.LockTextColor=null;
    this.LockText=null;
    this.LockFont=null;
    this.LockCount=20;
    this.LockMinWidth=null;
    this.TitleFont=g_JSChartResource.TitleFont;     //标题字体
    this.IsShortTitle=false;                        //是否显示指标参数
    this.IsUsePageData=false;                       //是否使用了K线界面数据

    this.YAxis=null;    //Y轴刻度设置  { FloatPrecision， StringFormat, EnableRemoveZero }
    
    //调试信息
    this.Debug; // { Callback:, Count: }

    this.IsSync=false;      //是否是同步计算 (无数据请求)
    this.IsShow=true;       //是否显示图形

    this.RunCount=0;        //已执行次数
    this.MaxRunCount=-1;    //最大执行次数 -1=无限

    if (option)
    {
        if (option.FloatPrecision>=0) this.FloatPrecision=option.FloatPrecision;
        if (option.StringFormat>0) this.StringFormat=option.StringFormat;
        if (IFrameSplitOperator.IsBool(option.IsShowIndexTitle)) this.IsShowIndexTitle=option.IsShowIndexTitle;
        if (option.ID) this.ID=option.ID;
        if (option.KLineType>=0 || option.KLineType===-1) this.KLineType=option.KLineType;
        if (option.InstructionType) this.InstructionType=option.InstructionType;
        if (option.YSpecificMaxMin) this.YSpecificMaxMin=option.YSpecificMaxMin;
        if (option.YSplitScale) this.YSplitScale=option.YSplitScale;
        if (option.Condition) this.Condition=option.Condition;
        if (option.TitleFont) this.TitleFont=option.TitleFont;
        if (option.IsShortTitle) this.IsShortTitle=option.IsShortTitle;
        if (option.OutName) this.OutName=option.OutName;
        if (IFrameSplitOperator.IsNumber(option.YSplitType)) this.YSplitType=option.YSplitType;
        if (IFrameSplitOperator.IsBool(option.IsSync)) this.IsSync=option.IsSync;
        if (IFrameSplitOperator.IsNumber(option.MaxRunCount)) this.MaxRunCount=option.MaxRunCount;

        if (option.Debug) 
        {
            if (IFrameSplitOperator.IsPlusNumber(option.Debug.Count) && option.Debug.Callback)
            {
                this.Debug={ Count:option.Debug.Count, Callback:option.Debug.Callback }
            }
        }
    }

    if (option && option.Lock) 
    {
        if (option.Lock.IsLocked==true) this.IsLocked=true;  //指标上锁
        if (option.Lock.Callback) this.LockCallback=option.Lock.Callback;    //锁回调
        if (option.Lock.ID) this.LockID=option.Lock.ID;                      //锁ID
        if (option.Lock.BG) this.LockBG=option.Lock.BG;
        if (option.Lock.TextColor) this.LockTextColor=option.Lock.TextColor;
        if (option.Lock.Text) this.LockText=option.Lock.Text;
        if (option.Lock.Font) this.LockFont=option.Lock.Font;
        if (option.Lock.Count) this.LockCount=option.Lock.Count;
        if (option.Lock.MinWidth) this.LockMinWidth=option.Lock.MinWidth*GetDevicePixelRatio();
    }

    if (option && option.YAxis)
    {
        this.YAxis={ };
        if (IFrameSplitOperator.IsNumber(option.YAxis.FloatPrecision)) this.YAxis.FloatPrecision=option.YAxis.FloatPrecision;
        if (IFrameSplitOperator.IsNumber(option.YAxis.StringFormat)) this.YAxis.StringFormat=option.YAxis.StringFormat;
        if (IFrameSplitOperator.IsBool(option.YAxis.EnableRemoveZero)) this.YAxis.EnableRemoveZero=option.YAxis.EnableRemoveZero;
        if (IFrameSplitOperator.IsBool(option.YAxis.ExcludeValue)) this.YAxis.ExcludeValue=option.YAxis.ExcludeValue;    //不参数Y轴的计算
        
    }

    if (args) this.Arguments=args;

    this.CopyTo=function(dest)   //赋值到新实例出来
    {
        dest.FloatPrecision=this.FloatPrecision;
        dest.StringFormat=this.StringFormat;
        dest.KLineType=this.KLineType;
        dest.InstructionType=this.InstructionType;
        dest.Condition=this.Condition;
        dest.TitleFont=this.TitleFont;
        dest.IsShortTitle=this.IsShortTitle;
        dest.OutName=this.OutName;

        dest.Arguments=this.Arguments;
        dest.Script=this.Script;
        dest.Name=this.Name;
        dest.ID=this.ID;
    }

    this.SetLock=function(lockData)
    {
        if (lockData.IsLocked==true) 
        {
            this.IsLocked=true;  //指标上锁
            if (lockData.Callback) this.LockCallback=lockData.Callback;    //锁回调
            if (lockData.ID) this.LockID=lockData.ID;                      //锁ID
            if (lockData.BG) this.LockBG=lockData.BG;
            if (lockData.TextColor) this.LockTextColor=lockData.TextColor;
            if (lockData.Text) this.LockText=lockData.Text;
            if (lockData.Font) this.LockFont=lockData.Font;
            if (lockData.Count) this.LockCount=lockData.Count;
            if (lockData.MinWidth) this.LockMinWidth=lockData.MinWidth*GetDevicePixelRatio();
        }
        else
        {   //清空锁配置信息
            this.IsLocked=false;    //是否锁住指标
            this.LockCallback=null;
            this.LockID=null;
            this.LockBG=null;       //锁背景色
            this.LockTextColor=null;
            this.LockText=null;
            this.LockFont=null;
            this.LockCount=20;
        }
    }

    //是否超出执行的最大次数
    this.IsExcessRunCount=function()
    {
        if (this.MaxRunCount<0) return false;   //没有限制

        return this.RunCount>=this.MaxRunCount;
    }

    this.ExecuteScript=function(hqChart,windowIndex,hisData)
    {
        this.OutVar=[];
        let self = this;
        let param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData,
            Self:this
        };

        //数据类型
        let hqDataType=HQ_DATA_TYPE.KLINE_ID;   //默认K线
        if (hqChart.ClassName==='MinuteChartContainer' || hqChart.ClassName==='MinuteChartHScreenContainer') 
        {
            if (hqChart.DayCount>1) hqDataType=HQ_DATA_TYPE.MULTIDAY_MINUTE_ID; //多日分钟
            else hqDataType=HQ_DATA_TYPE.MINUTE_ID;                             //分钟数据
        }
        else if (hqChart.ClassName==='HistoryMinuteChartContainer') 
        {
            hqDataType=HQ_DATA_TYPE.HISTORY_MINUTE_ID;   //历史分钟
        }
        let option=
        {
            HQDataType:hqDataType,
            Symbol:hqChart.Symbol, 
            Name:hqChart.Name,
            Data:hisData,
            SourceData:hqChart.SourceData,
            Callback:this.RecvResultData, CallbackParam:param,
            Async:true,
            MaxRequestDataCount:hqChart.MaxRequestDataCount,
            MaxRequestMinuteDayCount:hqChart.MaxRequestMinuteDayCount,
            Arguments:this.Arguments,
            Condition:this.Condition,
            IsBeforeData:hqChart.IsBeforeData,
            IsApiPeriod:hqChart.IsApiPeriod,
            DrawInfo:null,
            Self:this,
        };

        if (this.Debug && IFrameSplitOperator.IsPlusNumber(this.Debug.Count) && this.Debug.Callback)
        {
            --this.Debug.Count;

            option.Debug=1;
            option.DebugFilter=this.Debug.Callback;
        }

        if (hqChart)    //当前屏K线信息
        {
            if (hqChart.ChartPaint[0]) 
            {
                var item=hqChart.ChartPaint[0];
                if (item && item.DrawKRange) option.DrawInfo={Start:item.DrawKRange.Start, End:item.DrawKRange.End };
            }
        }

        if (hqDataType===HQ_DATA_TYPE.HISTORY_MINUTE_ID) option.TrateDate=hqChart.TradeDate;
        if (hqDataType===HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) option.DayCount=hqChart.DayCount;
        if (hqChart.NetworkFilter) option.NetworkFilter=hqChart.NetworkFilter;

        if (this.Condition && !this.IsMeetCondition(param,option))
        {
            this.ShowConditionError(param, this.Condition.Message);
            return;
        }

        ++this.RunCount;
        let code=this.Script;
        let run=JSComplier.Execute(code,option,hqChart.ScriptErrorCallback);
    }

    //是否符合限制条件
    this.IsMeetCondition=function(param,option)
    {
        JSConsole.Complier.Log('[ScriptIndex::IsMeetCondition] ', this.Condition);
        if (this.Condition.Period)      //周期是否满足
        {
            if (!this.IsMeetPeriodCondition(param,option)) return false;
            if (!this.IsMeetIncludeCondition(param,option)) return false;
        }

        return true;
    }

    //周期是否满足条件
    this.IsMeetPeriodCondition=function(param,option)
    {
        if (!this.Condition.Period) return true;

        for(var i in this.Condition.Period)
        {
            var item=this.Condition.Period[i];
            switch(item)
            {
                case CONDITION_PERIOD.MINUTE_ID:
                    if (option.HQDataType==HQ_DATA_TYPE.MINUTE_ID) return true;
                    break;
                case CONDITION_PERIOD.MULTIDAY_MINUTE_ID:
                    if (option.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) return true;
                    break;
                case CONDITION_PERIOD.KLINE_DAY_ID:
                case CONDITION_PERIOD.KLINE_WEEK_ID:
                case CONDITION_PERIOD.KLINE_MONTH_ID:
                case CONDITION_PERIOD.KLINE_YEAR_ID:
                case CONDITION_PERIOD.KLINE_TWOWEEK_ID:
                case CONDITION_PERIOD.KLINE_QUARTER_ID:

                case CONDITION_PERIOD.KLINE_MINUTE_ID:
                case CONDITION_PERIOD.KLINE_5_MINUTE_ID:
                case CONDITION_PERIOD.KLINE_15_MINUTE_ID:
                case CONDITION_PERIOD.KLINE_30_MINUTE_ID:
                case CONDITION_PERIOD.KLINE_60_MINUTE_ID:
                    if (param.HQChart.Period==item) return true;
                    break;
            }
        }

        return false;
    }

    this.IsMeetIncludeCondition=function(param,option)
    {
        if (!this.Condition.Include || this.Condition.Include.length<=0) return true;

        var symbol=param.HQChart.Symbol;
        if (symbol) symbol=symbol.toUpperCase();
        for(var i in this.Condition.Include)
        {
            var item=this.Condition.Include[i];
            if (symbol==item) return true;
        }
        return false;
    }

    //显示指标不符合条件
    this.ShowConditionError=function(param,msg)
    {
        var hqChart=param.HQChart;
        var windowIndex=param.WindowIndex;

        hqChart.DeleteIndexPaint(windowIndex);
        if (windowIndex==0) hqChart.ShowKLine(true);

        var message='指标不支持当前品种或周期';
        if (msg) message=msg;

        let line=new ChartLine();
        line.Canvas=hqChart.Canvas;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        line.NotSupportMessage=message;
        hqChart.ChartPaint.push(line);
        
        hqChart.UpdataDataoffset();           //更新数据偏移
        hqChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        hqChart.Draw();
    }

    this.RecvResultData=function(outVar,param)
    {
        let hqChart=param.HQChart;
        let windowIndex=param.WindowIndex;
        let hisData=param.HistoryData;
        param.Self.OutVar=outVar;
        param.Self.BindData(hqChart,windowIndex,hisData);

        if (param.Self.IsLocked==false) //不上锁
        {
            param.HQChart.Frame.SubFrame[windowIndex].Frame.SetLock(null);
        }
        else    //上锁
        {
            let lockData={ IsLocked:true,Callback:param.Self.LockCallback,IndexName:param.Self.Name ,ID:param.Self.LockID,
                BG:param.Self.LockBG,Text:param.Self.LockText,TextColor:param.Self.LockTextColor, Font:param.Self.LockFont, Count:param.Self.LockCount, MinWidth:param.Self.LockMinWidth };
            param.HQChart.Frame.SubFrame[windowIndex].Frame.SetLock(lockData);
        }

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值

        if (param.Self.IsSync===false)    //异步需要马上刷新，同步主图数据更新的时候会刷新的
            param.HQChart.Draw();

        if (hqChart.GetIndexEvent)
        {
            var event=hqChart.GetIndexEvent();  //指标计算完成回调
            if (event)
            {
                var self=param.Self;
                var data={ OutVar:self.OutVar, WindowIndex: windowIndex, Name: self.Name, Arguments: self.Arguments, HistoryData: hisData, 
                        Stock: {Symbol:hqChart.Symbol,Name:hqChart.Name} };
                event.Callback(event,data,self);
            }
        }
    }

    //给图形设置指标名字
    this.SetChartIndexName=function(chart)
    {
        if (this.Name) chart.IndexName=this.Name;
        else if (this.ID) chart.IndexName==this.ID;

        if (this.ID) chart.IndexID=this.ID;

        if (this.YAxis)
        {
            if (IFrameSplitOperator.IsBool(this.YAxis.ExcludeValue)) chart.IsExcludeYValue=this.YAxis.ExcludeValue;
        }

        chart.Script=this;  //指标内容绑定上去
    }

    //设置标题数据
    this.SetTitleData=function(titleData, chart)
    {
        titleData.ChartClassName=chart.ClassName;
        titleData.IsVisible=chart.IsVisible;
    }

    //自定义图形配色
    this.ReloadChartResource=function(hqChart, windowIndex, chart)
    {
        var event=hqChart.GetEventCallback(JSCHART_EVENT_ID.ON_RELOAD_INDEX_CHART_RESOURCE);  //指标计算完成回调
        if (!event || !event.Callback) return;
        
        var sendData={ Chart:chart, IndexName:this.Name,IndexID:this.ID,  HQChart:hqChart, WindowIndex:windowIndex };
        event.Callback(event,sendData,this);
    }

    this.CreateLine=function(hqChart,windowIndex,varItem, id, lineType)
    {
        if (lineType==7) var line=new ChartStepLine();
        else var line=new ChartLine();

        line.Canvas=hqChart.Canvas;
        line.DrawType=1;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        line.Identify=this.Guid;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (lineType==8)
        {
            line.DrawType=2;
            line.BreakPoint=varItem.BreakPoint;
        }

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }

        if (varItem.IsDotLine) line.IsDotLine=true; //虚线
        if (varItem.IsShow==false) line.IsShow=false;
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;

        this.ReloadChartResource(hqChart,windowIndex,line);

        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {

        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {

        }
        else
        {
            if (varItem.NoneName) 
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color);
            else
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

            this.SetTitleData(hqChart.TitlePaint[titleIndex].Data[id],line);
        }
        
        this.SetChartIndexName(line);
        hqChart.ChartPaint.push(line);
    }

    this.CreateArea=function(hqChart, windowIndex, varItem, id,)
    {
        var line=new ChartArea();

        line.Canvas=hqChart.Canvas;
        line.DrawType=1;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        line.Identify=this.Guid;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.DownColor) 
        {
            line.AreaColor=varItem.DownColor;
        }
        else if (varItem.UpColor)
        {
            line.AreaColor=varItem.UpColor;
            line.AreaDirection=1;
        }

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (IFrameSplitOperator.IsPlusNumber(width)) line.LineWidth=width;
        }

        if (IFrameSplitOperator.IsNonEmptyArray(varItem.LineDash)) line.LineDash=varItem.LineDash; //虚线
        if (varItem.IsShow==false) line.IsShow=false;
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;
        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {

        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {

        }
        else
        {
            if (varItem.NoneName) 
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color);
            else
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

            hqChart.TitlePaint[titleIndex].Data[id].ChartClassName=line.ClassName;
        }
        
        this.SetChartIndexName(line);
        hqChart.ChartPaint.push(line);
    }

    this.CreateOverlayLine=function(hqChart,windowIndex,varItem,id,lineType)
    {
        if (lineType==7) var line=new ChartStepLine();
        var line=new ChartSubLine();
        line.Canvas=hqChart.Canvas;
        line.DrawType=1;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }

        if (varItem.IsDotLine) line.IsDotLine=true; //虚线
        if (varItem.IsShow==false) line.IsShow=false;
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);
        hqChart.TitlePaint[titleIndex].Data[id].ChartClassName=line.ClassName;

        hqChart.ChartPaint.push(line);
    }

    this.CreateSingleLine=function(hqChart,windowIndex,varItem,id,lineType)
    {
        var line=new ChartSingleLine();
        line.Canvas=hqChart.Canvas;
        line.DrawType=1;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        line.Identify=this.Guid;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }

        if (varItem.IsDotLine) line.IsDotLine=true; //虚线
        if (varItem.IsShow==false) line.IsShow=false;

        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;

        this.ReloadChartResource(hqChart,windowIndex,line);
        
        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {

        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {

        }
        else
        {
            if (varItem.NoneName) 
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color);
            else
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

            this.SetTitleData(hqChart.TitlePaint[titleIndex].Data[id],line);
        }
        
        this.SetChartIndexName(line);
        hqChart.ChartPaint.push(line);
    }

    //创建柱子
    this.CreateBar=function(hqChart,windowIndex,varItem,id)
    {
        let bar=new ChartStickLine();
        bar.Canvas=hqChart.Canvas;
        if (varItem.Draw.Width>0) bar.Width=varItem.Draw.Width;
        else bar.Width=0;

        bar.Name=varItem.Name;
        bar.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        bar.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) bar.Color=this.GetColor(varItem.Color);
        else bar.Color=this.GetDefaultColor(id);
        
        let titleIndex=windowIndex+1;
        bar.Data.Data=varItem.Draw.DrawData;
        bar.BarType=varItem.Draw.Type;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        this.SetChartIndexName(bar);
        hqChart.ChartPaint.push(bar);
    }

    //创建文本
    this.CreateText=function(hqChart,windowIndex,varItem,id,resource)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;

        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.Direction=1;
        if (varItem.IsDrawBelow===true) chartText.Direction=2;

        let titleIndex=windowIndex+1;
        if (varItem.Draw.Position) chartText.Position=varItem.Draw.Position;    //赋值坐标
        if (varItem.Draw.DrawData) chartText.Data.Data=varItem.Draw.DrawData;
        chartText.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.Direction=1;
            else if (varItem.DrawVAlign==1) chartText.Direction=0;
            else if (varItem.DrawVAlign==2) chartText.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        this.SetChartIndexName(chartText);
        hqChart.ChartPaint.push(chartText);
    }

    //DRAWNUMBER
    this.CreateDrawNumber=function(hqChart,windowIndex,varItem,id)
    {
        var chartText=new ChartDrawNumber();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.TextBaseline='bottom'
        if (varItem.IsDrawBelow===true) chartText.TextBaseline='top';

        chartText.Data.Data=varItem.Draw.DrawData.Value;
        chartText.Text=varItem.Draw.DrawData.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;

        //指定输出位置
        if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
        else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;
        
        let titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
    }

    //DRAWTEXT
    this.CreateDrawTextV2=function(hqChart,windowIndex,varItem,id)
    {
        var chartText=new ChartDrawText();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.TextBaseline='bottom'
        if (varItem.IsDrawBelow===true) chartText.TextBaseline='top';

        if (varItem.Draw.DrawData) chartText.Data.Data=varItem.Draw.DrawData;
        chartText.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;
        //指定输出位置
        if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
        else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;

        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chartText.ShowOffset.Y=varItem.YOffset;
        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chartText.ShowOffset.X=varItem.XOffset;
        
        let titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        this.SetChartIndexName(chartText);
        hqChart.ChartPaint.push(chartText);
    }

    //COLORSTICK 
    this.CreateMACD=function(hqChart,windowIndex,varItem,id)
    {
        let chartMACD=new ChartMACD();
        chartMACD.Canvas=hqChart.Canvas;
        chartMACD.Identify=this.Guid;
        chartMACD.Name=varItem.Name;
        chartMACD.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartMACD.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.LineWidth) 
        {
            var width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chartMACD.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chartMACD.Data.Data=varItem.Data;
        var clrTitle=this.GetDefaultColor(id);
        if (varItem.Color) clrTitle=this.GetColor(varItem.Color);
        if (varItem.UpColor) chartMACD.UpColor=varItem.UpColor;
        if (varItem.DownColor) chartMACD.DownColor=varItem.DownColor;

        this.ReloadChartResource(hqChart,windowIndex,chartMACD);

        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chartMACD.Data,varItem.Name,clrTitle);

        this.SetChartIndexName(chartMACD);
        hqChart.ChartPaint.push(chartMACD);
    }

    this.CreatePointDot=function(hqChart,windowIndex,varItem,id, hisData)
    {
        let pointDot=new ChartPointDot();
        pointDot.Canvas=hqChart.Canvas;
        pointDot.Name=varItem.Name;
        pointDot.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        pointDot.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) pointDot.Color=this.GetColor(varItem.Color);
        else pointDot.Color=this.GetDefaultColor(id);

        if (varItem.Radius) pointDot.Radius=varItem.Radius;

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) pointDot.Radius=width;
        }

        if (IFrameSplitOperator.IsBool(varItem.UpDownDot)) 
        {
            pointDot.EnableUpDownColor=varItem.UpDownDot;
            pointDot.HistoryData=hisData;
        }

        let titleIndex=windowIndex+1;
        pointDot.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(pointDot.Data,varItem.Name,pointDot.Color);

        this.SetChartIndexName(pointDot);
        hqChart.ChartPaint.push(pointDot);
    }

    this.CreateStick=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        this.ReloadChartResource(hqChart,windowIndex,chart);

        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateLineStick=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartLineStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        hqChart.ChartPaint.push(chart);
    }

    this.CreateStraightLine=function(hqChart,windowIndex,varItem,id)
    {
        let line=new ChartLine();
        line.DrawType=1;
        line.Canvas=hqChart.Canvas;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Draw.DrawData;

        if (varItem.Name=="DRAWLINE") 
            hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color);

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

        hqChart.ChartPaint.push(line);
    }

    this.CreateVolStick=function(hqChart,windowIndex,varItem,id,hisData)
    {
        let chart=new ChartVolStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.KLineDrawType=hqChart.KLineDrawType;  //设置K线显示类型
        chart.Identify=this.Guid;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;
        if (IFrameSplitOperator.IsNumber(varItem.StickType)) chart.BarType=varItem.StickType;
        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (IFrameSplitOperator.IsPlusNumber(width)) chart.BarWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        chart.HistoryData=hisData;
        this.ReloadChartResource(hqChart,windowIndex,chart);

        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);
        hqChart.TitlePaint[titleIndex].Data[id]=titleData;
        this.SetTitleData(titleData,chart);
        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateBand=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartBand();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.FirstColor = varItem.Draw.Color[0];
        chart.SecondColor = varItem.Draw.Color[1];
        chart.Data.Data=varItem.Draw.DrawData;

        if (IFrameSplitOperator.IsBool(varItem.IsFirstDraw)) chart.IsDrawFirst=varItem.IsFirstDraw;

        var titleIndex=windowIndex+1;
        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);
        titleData.DataType=chart.ClassName;
        titleData.ExtendData={ Color:[chart.FirstColor, chart.SecondColor] };
        hqChart.TitlePaint[titleIndex].Data[id]=titleData;

        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateFillRGN=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartLineArea();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.Data.Data=varItem.Draw.DrawData;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        hqChart.ChartPaint.push(chart);
    }

    this.CreateFillRGN2=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartFillRGN();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.Data.Data=varItem.Draw.DrawData;

        hqChart.ChartPaint.push(chart);
    }

    this.CreateFillBGRGN=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartFillBGRGN();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.Data.Data=varItem.Draw.DrawData;

        hqChart.ChartPaint.push(chart);
    }

    this.CreateFLOATRGN=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartFLOATRGN();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.Data.Data=varItem.Draw.DrawData;

        hqChart.ChartPaint.push(chart);
    }

    //创建K线图
    this.CreateKLine=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartKLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.Identify=this.Guid;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data=varItem.Draw.DrawData;
        chart.IsShowMaxMinPrice=false;
        chart.IsShowKTooltip=false;
        if (IFrameSplitOperator.IsNumber(varItem.KLineType)) chart.DrawType=varItem.KLineType;

        if (varItem.Color)  //如果设置了颜色,使用外面设置的颜色
            chart.UnchagneColor=chart.DownColor=chart.UpColor=this.GetColor(varItem.Color);

        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateOverlayKLine=function(hqChart,windowIndex,varItem,id)
    {
        var chart=null;
        if (hqChart.IsKLineContainer()) chart=new ChartOverlayKLine();
        else if (hqChart.IsMinuteContainer()) chart=new ChartOverlayMinutePriceLine();
        else return;

        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.Identify=this.Guid;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);    //如果设置了颜色,使用外面设置的颜色
        else chart.Color=this.GetDefaultColor(id);

        chart.Data.Data=varItem.Draw.DrawData;
        chart.MainData=hqChart.ChartPaint[0].Data;//绑定K线

        hqChart.ChartPaint.push(chart);
    }

    this.CreateDrawColorKLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartColorKline();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.DrawName="DRAWCOLORKLINE";
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data=varItem.Draw.DrawData;
        if (IFrameSplitOperator.IsBool(varItem.Draw.IsEmptyBar)) chart.IsEmptyBar=varItem.Draw.IsEmptyBar;
        if (varItem.Draw.Color) chart.Color=varItem.Draw.Color;
        hqChart.ChartPaint.push(chart);
    }

    this.CreatePolyLine=function(hqChart,windowIndex,varItem,id)
    {
        let line=new ChartLine();
        line.Canvas=hqChart.Canvas;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);
        if (varItem.IsDotLine) line.IsDotLine=true; //虚线

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Draw.DrawData;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,' ',line.Color); //给一个空的标题

        hqChart.ChartPaint.push(line);
    }

    this.CreateChartSlopeLine=function(hqChart,windowIndex,varItem,id)
    {
        let line=new ChartSlopeLine();
        line.Canvas=hqChart.Canvas;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);
        if (varItem.IsDotLine) line.IsDotLine=true; //虚线

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Draw.DrawData.Data;
        line.Option=varItem.Draw.DrawData.Option;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color); //给一个空的标题

        hqChart.ChartPaint.push(line);
    }

    this.CreateChartVericaltLine=function(hqChart,windowIndex,varItem,id)
    {
        var chart=new ChartVericaltLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        this.SetChartLineDash(chart,varItem.Draw.DrawData);
        chart.Data.Data=varItem.Draw.DrawData.Data;

        hqChart.ChartPaint.push(chart);
    }

    this.SetChartLineDash=function(chart, option)
    {
        if (IFrameSplitOperator.IsNumber(option.LineType))
        {
            var lineType=option.LineType;
            var pixelRatio=GetDevicePixelRatio();
            switch(lineType)
            {
                case 1:
                    chart.LineType=[10*pixelRatio,10*pixelRatio];
                    break;
                case 2:
                    chart.LineType=[0,10*pixelRatio];
                    chart.LineCap="square";
                    break;
                case 3:
                    chart.LineType=[10*pixelRatio, 3*pixelRatio, 3*pixelRatio, 3*pixelRatio];
                    break;
                case 4:
                    chart.LineType=[10*pixelRatio, 3*pixelRatio, 3*pixelRatio, 3*pixelRatio,3*pixelRatio,3*pixelRatio];
                    break;
            }
        }
        else if (IFrameSplitOperator.IsString(option.LineType))
        {
            var aryString=option.LineType.split(',');
            var aryLinType=[];
            for(var i=0;i<aryString.length;++i)
            {
                aryLinType.push(parseInt(aryString[i]));
            }
            chart.LineType=aryLinType;
        }
    }

    this.CreateChartHorizontalLine=function(hqChart,windowIndex,varItem,id)
    {
        var chart=new ChartHorizontalLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        this.SetChartLineDash(chart,varItem.Draw.DrawData);
        chart.ExtendType=varItem.Draw.DrawData.Extend;
        chart.Data.Data=varItem.Draw.DrawData.Data;

        hqChart.ChartPaint.push(chart);
    }


    this.CreateBackgroud=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartBackground();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Color=drawData.Color;
            chart.ColorAngle=drawData.Angle;

            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

        hqChart.ChartPaint.push(chart);
    }

    this.CreateBackgroundDiv=function(hqChart,windowIndex,varItem,id)
    {
        var chart=new ChartBackgroundDiv();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.AryColor=drawData.AryColor;
            chart.ColorType=drawData.ColorType;
            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

        hqChart.ChartPaint.push(chart);
    }

    this.CreateLineMultiData=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartLineMultiData();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Color=drawData.Color;
            if (drawData.PointColor)  chart.PointColor=drawData.PointColor;
            if (IFrameSplitOperator.IsPlusNumber(drawData.PointRadius)) chart.PointRadius=drawData.PointRadius;
            if (IFrameSplitOperator.IsPlusNumber(drawData.LineWidth)) chart.LineWidth=drawData.LineWidth;
            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

        let titleIndex=windowIndex+1;
        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color); //标题
        titleData.DataType="MULTI_POINT_LINE";
        hqChart.TitlePaint[titleIndex].Data[id]=titleData;

        hqChart.ChartPaint.push(chart);
    }

    this.CreateTradeIcon=function(hqChart,windowIndex,varItem,id)
    {
        var chart=new ChartTradeIcon();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data=varItem.Draw.DrawData.Data;
        chart.AryIcon=varItem.Draw.DrawData.Icons;
        chart.TradeType=varItem.Draw.DrawType;

        //修改颜色
        if (varItem.Color && IFrameSplitOperator.IsNonEmptyArray(chart.AryIcon))
        {
            for(var i=0;i<chart.AryIcon.length;++i)
            {
                var item=chart.AryIcon[i];
                if (!item || !item.Color) continue;

                item.Color=varItem.Color;
            }
        }

        //图片大小
        if (varItem.DrawFontSize>0) chart.SVG.Size=varItem.DrawFontSize*GetDevicePixelRatio();    //图标大小

        hqChart.ChartPaint.push(chart);
    }

    this.CreateTextLine=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartTextLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Text=drawData.Text;
            chart.Line=drawData.Line;
            chart.Price=drawData.Price;
        }

        hqChart.ChartPaint.push(chart);
    }

    this.CreateNumberText=function(hqChart,windowIndex,varItem,id)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;

        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();
        chartText.TextAlign="center";
        
        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawAbove) chartText.Direction=1;
        else chartText.Direction=2;

        if (varItem.Draw.Position) chartText.Position=varItem.Draw.Position;    //赋值坐标

        let titleIndex=windowIndex+1;
        chartText.Data.Data=varItem.Draw.DrawData.Value;
        chartText.Text=varItem.Draw.DrawData.Text;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        this.SetChartIndexName(chartText);
        hqChart.ChartPaint.push(chartText);
    }

    this.CreateDrawText=function(hqChart,windowIndex,varItem,id)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();
        
        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawAbove) chartText.Direction=1;
        else chartText.Direction=0;

        if (varItem.DrawFontSize>0) chartText.TextFont=`${varItem.DrawFontSize*GetDevicePixelRatio()}px 微软雅黑`;    //临时用下吧

        let titleIndex=windowIndex+1;
        chartText.DrawData=varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        this.SetChartIndexName(chartText);
        hqChart.ChartPaint.push(chartText);
    }

    //创建图标
    this.CreateIcon=function(hqChart,windowIndex,varItem,id)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;
        chartText.TextAlign='center';

        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.Direction=2;
        if (varItem.IsDrawAbove) chartText.Direction=1;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.Direction=1;
            else if (varItem.DrawVAlign==1) chartText.Direction=0;
            else if (varItem.DrawVAlign==2) chartText.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        let titleIndex=windowIndex+1;
        chartText.Data.Data=varItem.Draw.DrawData;
        var icon=varItem.Draw.Icon;
        if (icon.IconFont==true)
        {
            chartText.IconFont={ Family:icon.Family, Text:icon.Symbol, Color:icon.Color };
            if (varItem.Color) chartText.IconFont.Color=this.GetColor(varItem.Color);
        }
        else
        {
            chartText.Text=icon.Symbol;
            if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
            else if (icon.Color) chartText.Color=icon.Color;
            else chartText.Color='rgb(0,0,0)';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chartText.ShowOffset.X=varItem.XOffset;
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chartText.ShowOffset.Y=varItem.YOffset;

        
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        this.SetChartIndexName(chartText);
        hqChart.ChartPaint.push(chartText);
    }

    this.CreateTipIcon=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartDrawSVG();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (hqChart.ChartPaint[0].IsMinuteFrame())
            chart.Data=hqChart.SourceData;
        else
            chart.Data=hqChart.ChartPaint[0].Data;  //绑定K线
        
        chart.Family=varItem.Draw.Icon.Family;
        chart.TextFont=g_JSChartResource.TIPICON.TextFont;
        
        var svgSize=g_JSChartResource.TIPICON.Size;
        var svgColor=g_JSChartResource.TIPICON.Color;
        var svgYOffset=0;
        var svgVAlign=2;    //上下对齐方式
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) svgYOffset=varItem.YOffset;
        if (varItem.Color) svgColor=this.GetColor(varItem.Color);
        if (varItem.DrawFontSize>0) svgSize=varItem.DrawFontSize;
        if (varItem.DrawVAlign>=0) svgVAlign=varItem.DrawVAlign;   

        if (varItem.Draw && IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.DrawData) && varItem.Draw.Icon)
        {
            var drawData=varItem.Draw.DrawData;
            var aryData=[];
            var isArrayTip=Array.isArray(varItem.Draw.Text);
            var singleTip=null;
            if (!isArrayTip && varItem.Draw.Text) singleTip={ Text:varItem.Draw.Text };

            for(var j=0;j<drawData.length;++j)
            {
                var item=drawData[j];
                if (!IFrameSplitOperator.IsNumber(item)) continue;

                var svgItem=
                { 
                    Index:j, Value:item, 
                    SVG:{ Symbol:varItem.Draw.Icon.Symbol, Size:svgSize, Color:svgColor, YOffset:svgYOffset, VAlign:svgVAlign }
                };

                if (isArrayTip)
                {
                    var text=varItem.Draw.Text[j];
                    if (text) svgItem.Tooltip={ Text:text };
                }
                else
                {
                    svgItem.Tooltip=singleTip;
                }

                aryData.push(svgItem);
            }

            chart.Texts= aryData;
        }

        hqChart.ChartPaint.push(chart);
    }

    //创建通道
    this.CreateChannel=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartChannel();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if(varItem.Draw.AreaColor) chart.AreaColor=varItem.Draw.AreaColor;
        else if (varItem.Color) chart.AreaColor=this.GetColor(varItem.Color);
        else chart.AreaColor=this.GetDefaultColor(id);

        if (varItem.Draw.Border.Color) chart.LineColor=varItem.Draw.Border.Color;
        else chart.LineColor=null;

        if (varItem.Draw.Border.Dotted) chart.LineDotted=varItem.Draw.Border.Dotted;
        if (varItem.Draw.Border.Width>0) chart.LineWidth=varItem.Draw.Border.Width;

        //let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        hqChart.ChartPaint.push(chart);
    }

    this.CreatePartLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartPartLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (IFrameSplitOperator.IsPlusNumber(width)) chart.LineWidth=width;
        }

        chart.Data.Data=varItem.Draw.DrawData;

        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Lines=varItem.Draw.DrawData; 
        if (varItem.Draw.Name) chart.Name=varItem.Draw.Name;
        if (varItem.Draw.LineDash) chart.LineDash=varItem.Draw.LineDash;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsBool(varItem.Draw.IsFullRangeMaxMin)) chart.IsFullRangeMaxMin=varItem.Draw.IsFullRangeMaxMin;

        if(varItem.Draw.Arrow)  //箭头配置
        {
            var item=varItem.Draw.Arrow;
            if (item.Start==true) chart.Arrow.Start=true;
            if (item.End==true) chart.Arrow.End=true;
            if (IFrameSplitOperator.IsNumber(item.Angle)) chart.ArrawAngle=item.Angle;
            if (IFrameSplitOperator.IsNumber(item.Length)) chart.ArrawLength=item.Length;
            if (IFrameSplitOperator.IsNumber(item.LineWidth)) chart.ArrawLineWidth=item.LineWidth;
        }

        this.ReloadChartResource(hqChart, windowIndex, chart);
        
        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);

         var titleIndex=windowIndex+1;
        var titleData=new DynamicTitleData(chart.Data,chart.Name, null);
        titleData.DataType="ChartMultiLine";
        titleData.Lines=chart.Lines;
        hqChart.TitlePaint[titleIndex].Data[i]=titleData;
    }

    this.CreateMultiPoint=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiPoint();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.PointGroup=varItem.Draw.DrawData; 
        if (varItem.Draw.Name) chart.Name=varItem.Draw.Name;
        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);

         var titleIndex=windowIndex+1;
        var titleData=new DynamicTitleData(chart.Data,chart.Name, null);
        titleData.DataType="ChartMultiPoint";
        titleData.PointGroup=chart.PointGroup;
        hqChart.TitlePaint[titleIndex].Data[i]=titleData;
    }

    this.CreateMultiBar=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartMultiBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Bars=varItem.Draw.DrawData; 

        var titleIndex=windowIndex+1;
        var titleData=new DynamicTitleData({ KData:chart.Data, BarData:chart.Bars },varItem.Name,null);
        titleData.IsShow=false;
        titleData.DataType="MULTI_BAR";
        hqChart.TitlePaint[titleIndex].Data[id]=titleData;

        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiText=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiText();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData; 
        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiSVGIcon=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiSVGIconV2();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Family=varItem.Draw.DrawData.Family;
        chart.AryIcon= varItem.Draw.DrawData.Icon;
        chart.BuildCacheData();
        this.SetChartIndexName(chart);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateChartDrawSVG=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartDrawSVG();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (hqChart.ChartPaint[0].IsMinuteFrame())
            chart.Data=hqChart.SourceData;
        else
            chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        if (IFrameSplitOperator.IsBool(varItem.Draw.DrawData.EnableTooltip)) chart.EnableTooltip=varItem.Draw.DrawData.EnableTooltip;
        if (IFrameSplitOperator.IsBool(varItem.Draw.DrawData.IsDrawFirst)) chart.IsDrawFirst=varItem.Draw.DrawData.IsDrawFirst;
        chart.Family=varItem.Draw.DrawData.Family;
        chart.TextFont=varItem.Draw.DrawData.TextFont;
        chart.Texts= varItem.Draw.DrawData.Data;
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMulitHtmlDom=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiHtmlDom();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.HQChart=hqChart;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData;
        chart.DrawCallback= varItem.Draw.Callback;
        hqChart.ChartPaint.push(chart);
    }

    this.CreateStackedBar=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartStackedBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.HQChart=hqChart;
        chart.Identify=this.Guid;

        chart.Data.Data=varItem.Draw.DrawData;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarColor)) chart.BarColor=varItem.Draw.BarColor;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarName)) chart.BarName=varItem.Draw.BarName;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.BarType)) chart.BarType=varItem.Draw.BarType;
        hqChart.ChartPaint.push(chart);

        var titleIndex=windowIndex+1;

        var titleData=new DynamicTitleData(chart.Data,chart.BarName,chart.BarColor);
        titleData.DataType="ChartStackedBar";
        hqChart.TitlePaint[titleIndex].Data[i]=titleData;
    }

    this.CreateKLineTable=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartKLineTable();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.HQChart=hqChart;
        chart.Identify=this.Guid;

        chart.Data.Data=varItem.Draw.DrawData;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.RowCount)) chart.RowCount=varItem.Draw.RowCount;
        if (IFrameSplitOperator.IsBool(varItem.Draw.IsShowRowName)) chart.IsShowRowName=varItem.Draw.IsShowRowName;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.RowName)) chart.RowName=varItem.Draw.RowName;
        if (varItem.Draw.BGColor) chart.BGColor=varItem.Draw.BGColor;

        hqChart.ChartPaint.push(chart);

        var titleIndex=windowIndex+1;

        var titleData=new DynamicTitleData(chart.Data,chart.BarName,chart.BarColor);
        titleData.DataType="ChartKLineTable";
        hqChart.TitlePaint[titleIndex].Data[i]=titleData;
    }

    this.CreateScatterPlot=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartScatterPlot();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.HQChart=hqChart;
        chart.Identify=this.Guid;

        chart.Data.Data=varItem.Draw.DrawData;
        chart.Color=varItem.Draw.Color;
        chart.Radius=varItem.Draw.Radius;

        hqChart.ChartPaint.push(chart);
    }

    this.CreateColorKLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartColorKline();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.KLineColor= varItem.Draw.DrawData.KLine;
        if (varItem.Color) chart.Color=varItem.Color;
        hqChart.ChartPaint.push(chart);
    } 

    this.CreateRectangle=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartRectangle();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Color=[varItem.Draw.DrawData.Color];
        chart.Rect=varItem.Draw.DrawData.Rect;
        if (varItem.Color) chart.BorderColor=this.GetColor(varItem.Color);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateScriptOverlayLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartOverlayLine();
        chart.Canvas=hqChart.Canvas;
        chart.DrawType=1;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(i);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        if (varItem.IsDotLine) chart.IsDotLine=true; //虚线
        if (varItem.IsShow==false) chart.IsShow=false;

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData.Data;
        chart.MainData.Data=varItem.Draw.DrawData.MainData;

        if (varItem.Draw.DrawData.Title)
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(chart.Data,varItem.Draw.DrawData.Title,chart.Color);

        hqChart.ChartPaint.push(chart);
    }

    //创建K线
    this.CreateSelfKLine=function(hqChart,windowIndex,hisData)
    {
        let chart=new ChartKLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name="Self Kline";
        chart.Identify=this.Guid;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hisData
        chart.IsShowMaxMinPrice=false;
        chart.IsShowKTooltip=false;
        chart.DrawType=this.KLineType;

        hqChart.ChartPaint.push(chart);
    }

    this.BindInstructionData=function(hqChart,windowIndex,hisData)  //绑定指示指标
    {
        if (this.OutVar==null || this.OutVar.length<0) return;

        //参数
        var indexParam='';
        for(let i in this.Arguments)
        {
            let item=this.Arguments[i];
            if (indexParam.length>0) indexParam+=',';
            indexParam+=item.Value.toString();
        }
        if (indexParam.length>0) indexParam='('+indexParam+')';

        if (this.InstructionType==2)        //五彩K线
        {
            let varItem=this.OutVar[this.OutVar.length-1]; //取最后一组数据作为指示数据
            hqChart.SetInstructionData(this.InstructionType, {Data:varItem.Data, Name:this.Name, Param:indexParam, ID:this.ID });       //设置指示数据
            return true;
        }
        else if (this.InstructionType==1)   //交易系统
        {
            var buyData, sellData;
            for(var i in this.OutVar)
            {
                let item=this.OutVar[i];
                if (item.Name=='ENTERLONG') buyData=item.Data;
                else if (item.Name=='EXITLONG') sellData=item.Data;
            }

            hqChart.SetInstructionData(this.InstructionType, {Buy:buyData, Sell:sellData, Name:this.Name, Param:indexParam, ID:this.ID});       //设置指示数据
            return true;
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        if (windowIndex==0 && this.InstructionType)
        {
            this.BindInstructionData(hqChart,windowIndex,hisData);
            return;
        }

        //清空主指标图形
        hqChart.DeleteIndexPaint(windowIndex);
        if (windowIndex==0) hqChart.ShowKLine(true);

        if (this.OutVar==null || this.OutVar.length<0) return;

        //叠加一个K线背景
        if (this.KLineType!=null)
        {
            if (this.KLineType===0 || this.KLineType===1 || this.KLineType===2) this.CreateSelfKLine(hqChart,windowIndex,hisData);
            else if (this.KLineType===-1 && windowIndex==0) hqChart.ShowKLine(false);
        }

        if (windowIndex>=1 && hqChart.Frame)
        {
            //Y轴刻度格式 默认跟标题栏一致
            var ySpliter=hqChart.Frame.SubFrame[windowIndex].Frame.YSplitOperator;
            if (ySpliter)
            {
                ySpliter.Reset();
                ySpliter.FloatPrecision=this.FloatPrecision;
                if (this.YAxis) ySpliter.SetOption(this.YAxis);
            }
           
            if (this.YSpecificMaxMin)  hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=this.YSpecificMaxMin;  //最大最小值
            if (this.YSplitScale)   hqChart.Frame.SubFrame[windowIndex].Frame.YSplitScale=this.YSplitScale;             //固定刻度
        }

        if (IFrameSplitOperator.IsNumber(this.YSplitType)) hqChart.Frame.SubFrame[windowIndex].Frame.YSplitOperator.SplitType=this.YSplitType;

        /*
        if (this.Name=='MA')    //测试多线段
        {
            var point1={Point:[{Index:300, Value:15.5}, {Index:301, Value:14.2} , {Index:304, Value:14.05}], Color:'rgb(244,55,50)'};
            var point2={Point:[{Index:307, Value:14.5}, {Index:308, Value:14.2} , {Index:309, Value:14.15}], Color:'rgb(0,55,50)'};
            var testData={ Name:'MULTI_LINE', Type:1,Draw:{ DrawType:'MULTI_LINE', DrawData:[point1,point2] } };
            this.OutVar.push(testData);
        }
        */
        
        for(let i=0; i<this.OutVar.length; ++i)
        {
            let item=this.OutVar[i];
            if (item.IsExData===true) continue; //扩展数据不显示图形
            if (item.Type==1000 || item.Type==1001) continue;      //数据集合, 字符串

            if (item.Type==0)  
            {
                if (item.IsOverlayLine) this.CreateOverlayLine(hqChart,windowIndex,item,i,item.Type);
                else if (item.IsSingleLine) this.CreateSingleLine(hqChart,windowIndex,item,i,item.Type);
                else this.CreateLine(hqChart,windowIndex,item,i,item.Type);
            }
            else if (item.Type==1)
            {
                switch(item.Draw.DrawType)
                {
                    case 'STICKLINE':
                        this.CreateBar(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT':
                        this.CreateDrawTextV2(hqChart,windowIndex,item,i);
                        break;
                    case 'SUPERDRAWTEXT':
                        this.CreateText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWLINE':
                        this.CreateStraightLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWBAND':
                        this.CreateBand(hqChart,windowIndex,item,i);
                        break;
                    case "FILLRGN":
                        this.CreateFillRGN(hqChart,windowIndex,item,i);
                        break;
                    case "FILLRGN2":
                        this.CreateFillRGN2(hqChart,windowIndex,item,i);
                        break;
                    case "FILLTOPRGN":
                    case "FILLBOTTOMRGN":
                    case "FILLVERTICALRGN":
                        this.CreateFillBGRGN(hqChart,windowIndex,item,i);
                        break;
                    case "FLOATRGN":
                        this.CreateFLOATRGN(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE':
                    case "DRAWKLINE1":
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWOVERLAYKLINE":
                        this.CreateOverlayKLine(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWCOLORKLINE":
                        this.CreateDrawColorKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE_IF':
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'POLYLINE':
                        this.CreatePolyLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWGBK':
                    case "DRAWGBK2":
                        this.CreateBackgroud(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWGBK_DIV":
                        this.CreateBackgroundDiv(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT_LINE':
                        this.CreateTextLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWNUMBER':
                        this.CreateDrawNumber(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWNUMBER_FIX":
                    case 'DRAWTEXT_FIX':
                        this.CreateNumberText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWICON':
                        this.CreateIcon(hqChart,windowIndex,item,i);
                        break;
                    case "ICON":
                        this.CreateIcon(hqChart,windowIndex,item,i);
                        break;
                    case "TIPICON":
                        this.CreateTipIcon(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWCHANNEL':
                        this.CreateChannel(hqChart,windowIndex,item,i);
                        break;
                    case 'PARTLINE':
                        this.CreatePartLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWRECTREL':
                        this.CreateRectangle(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWTEXTABS":
                    case "DRAWTEXTREL":
                        this.CreateDrawText(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWOVERLAYLINE":
                        this.CreateScriptOverlayLine(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWSL":
                        this.CreateChartSlopeLine(hqChart,windowIndex,item,i);
                        break;
                    case "VERTLINE":
                        this.CreateChartVericaltLine(hqChart,windowIndex,item,i);
                        break;
                    case "HORLINE":
                        this.CreateChartHorizontalLine(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_LINE':
                        this.CreateMultiLine(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_POINT":
                        this.CreateMultiPoint(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_BAR':
                        this.CreateMultiBar(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_TEXT':
                        this.CreateMultiText(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_SVGICON':
                        this.CreateMultiSVGIcon(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWSVG":
                        this.CreateChartDrawSVG(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_HTMLDOM":
                        this.CreateMulitHtmlDom(hqChart,windowIndex,item,i);
                        break;
                    case "COLOR_KLINE":
                        this.CreateColorKLine(hqChart,windowIndex,item,i);
                        break;
                    case "KLINE_BG":
                        this.CreateBackgroud(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_POINT_LINE":
                        this.CreateLineMultiData(hqChart,windowIndex,item,i);
                        break;
                    case "BUY":
                    case "SELL":
                    case "SELLSHORT":
                    case "BUYSHORT":
                        this.CreateTradeIcon(hqChart,windowIndex,item,i);
                        break;

                    case SCRIPT_CHART_NAME.OVERLAY_BARS:
                        this.CreateStackedBar(hqChart,windowIndex,item,i);
                        break;
                    case SCRIPT_CHART_NAME.KLINE_TABLE:
                        this.CreateKLineTable(hqChart,windowIndex,item,i);
                        break;
                    case SCRIPT_CHART_NAME.SCATTER_PLOT:
                        this.CreateScatterPlot(hqChart,windowIndex,item,i);
                        break;
                    default:
                        {
                            var find=g_ScriptIndexChartFactory.Get(item.Draw.DrawType);  //外部挂接
                            if (find && find.CreateChartCallback)
                                find.CreateChartCallback(hqChart,windowIndex,item,i, this);
                        }
                        break;
                }
            }
            else if (item.Type==2)
            {
                this.CreateMACD(hqChart,windowIndex,item,i);
            }
            else if (item.Type==3)
            {
                this.CreatePointDot(hqChart,windowIndex,item,i, hisData);
            }
            else if (item.Type==4)
            {
                this.CreateLineStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==5)
            {
                this.CreateStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==6)
            {
                this.CreateVolStick(hqChart,windowIndex,item,i,hisData);
            }
            else if (item.Type==7)
            {
                this.CreateLine(hqChart,windowIndex,item,i, item.Type);
            }
            else if (item.Type==8)
            {
                this.CreateLine(hqChart,windowIndex,item,i, item.Type);
            }
            else if (item.Type==9)
            {
                this.CreateArea(hqChart,windowIndex,item,i);
            }

            var titlePaint=hqChart.TitlePaint[windowIndex+1];
            if (titlePaint &&  titlePaint.Data && i<titlePaint.Data.length) //设置标题数值 小数位数和格式
            {
                if (this.StringFormat>0) titlePaint.Data[i].StringFormat=this.StringFormat;
                if (this.FloatPrecision>=0) titlePaint.Data[i].FloatPrecision=this.FloatPrecision;

                if (this.OutName && this.OutName.length>0 && this.Arguments && this.Arguments.length>0)
                {
                    titlePaint.SetDynamicTitle(this.OutName,this.Arguments);
                }
            }
        }

        let titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.Title=this.Name;
        titlePaint.Identify=this.Guid;    //指标ID
        titlePaint.ArgumentsText=null;
        titlePaint.Script=this;
        titlePaint.IsShowMainIndexTitle=this.IsShowIndexTitle;
        
        if (!this.IsShortTitle)
        {
            let indexParam='';
            for(let i=0; i<this.Arguments.length; ++i)
            {
                let item=this.Arguments[i];
                if (indexParam.length>0) indexParam+=',';
                indexParam+=item.Value.toString();
            }

            if (indexParam.length>0) titlePaint.ArgumentsText=`(${indexParam})`;
        }

        if (this.TitleFont) titlePaint.Font=this.TitleFont;

        return true;
    }


    //给一个默认的颜色
    this.GetDefaultColor=function(id)
    {
        let COLOR_ARRAY=null;
        //使用全局线段配置
        if (g_JSChartResource && g_JSChartResource.Index && g_JSChartResource.Index.LineColor)
        {
            COLOR_ARRAY=g_JSChartResource.Index.LineColor;
        }

        if (!COLOR_ARRAY || !Array.isArray(COLOR_ARRAY))
        {
            COLOR_ARRAY=
            [
                "rgb(255,174,0)",
                "rgb(25,199,255)",
                "rgb(175,95,162)",
                "rgb(236,105,65)",
                "rgb(68,114,196)",
                "rgb(229,0,79)",
                "rgb(0,128,255)",
                "rgb(252,96,154)",
                "rgb(42,230,215)",
                "rgb(24,71,178)",
            ];
        }

        let number=parseInt(id);
        return COLOR_ARRAY[number%(COLOR_ARRAY.length-1)];
    }

    //获取颜色
    this.GetColor=function(colorName)
    {
        if (colorName.indexOf("RGB(")==0) return colorName.toLowerCase();
        if (colorName.indexOf("rgb(")==0) return colorName;
        if (colorName.indexOf("RGBA(")==0) return colorName.toLowerCase();
        if (colorName.indexOf("rgba(")==0) return colorName;


        var color=JSComplier.ColorVarToRGB(colorName);
        if (color) return color;

        return 'rgb(30,144,255)';

        /*
        let COLOR_MAP=new Map([
            ['COLORBLACK','rgb(0,0,0)'],
            ['COLORBLUE','rgb(18,95,216)'],
            ['COLORGREEN','rgb(25,158,0)'],
            ['COLORCYAN','rgb(0,255,198)'],
            ['COLORRED','rgb(238,21,21)'],
            ['COLORMAGENTA','rgb(255,0,222)'],
            ['COLORBROWN','rgb(149,94,15)'],
            ['COLORLIGRAY','rgb(218,218,218)'],      //画淡灰色
            ['COLORGRAY','rgb(133,133,133)'],        //画深灰色
            ['COLORLIBLUE','rgb(94,204,255)'],       //淡蓝色
            ['COLORLIGREEN','rgb(183,255,190)'],      //淡绿色
            ['COLORLICYAN','rgb(154,255,242)'],      //淡青色
            ['COLORLIRED','rgb(255,172,172)'],       //淡红色
            ['COLORLIMAGENTA','rgb(255,145,241)'],   //淡洋红色
            ['COLORWHITE','rgb(255,255,255)'],       //白色
            ['COLORYELLOW','rgb(255,198,0)']
        ]);

        if (COLOR_MAP.has(colorName)) return COLOR_MAP.get(colorName);

        //COLOR 自定义色
        //格式为COLOR+“RRGGBB”：RR、GG、BB表示红色、绿色和蓝色的分量，每种颜色的取值范围是00-FF，采用了16进制。
        //例如：MA5：MA(CLOSE，5)，COLOR00FFFF　表示纯红色与纯绿色的混合色：COLOR808000表示淡蓝色和淡绿色的混合色。
        if (colorName.indexOf('COLOR')==0) return '#'+colorName.substr(5);

        return 'rgb(30,144,255)';
        */
    }
}

function OverlayScriptIndex(name,script,args,option)
{
    this.newMethod=ScriptIndex;   //派生
    this.newMethod(name,script,args,option);
    delete this.newMethod;

    this.ClassName="OverlayScriptIndex";
    //叠加指标
    this.OverlayIndex=null; // { IsOverlay:true, Identify:overlayFrame.Identify, WindowIndex:windowIndex, Frame:overlayFrame }

    //显示指标不符合条件
    this.ShowConditionError=function(param,msg)
    {
        var hqChart=param.HQChart;
        var windowIndex=param.WindowIndex;

        var message='指标不支持当前品种或周期';
        if (msg) message=msg;

        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        frame.ChartPaint=[];
        
        var chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.NotSupportMessage=message;
        frame.ChartPaint.push(chart);
        hqChart.Draw();
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        if (!this.OverlayIndex || this.OverlayIndex.IsOverlay!=true) return;

        this.OverlayIndex.Frame.ChartPaint=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(this.OutVar)) return;

        //修改Y轴分割方式
        var ySpliter=this.OverlayIndex.Frame.Frame.YSplitOperator;
        if (ySpliter)
        {
            ySpliter.Reset();
            ySpliter.FloatPrecision=this.FloatPrecision;
            if (IFrameSplitOperator.IsNumber(this.YSplitType)) ySpliter.SplitType=this.YSplitType;
            if (this.YAxis) ySpliter.SetOption(this.YAxis);
        }
        
        //指标名字
        var titleInfo={ Data:[], Title:this.Name, Frame:this.OverlayIndex.Frame.Frame, Script:this, IsShowIndexTitle:this.IsShowIndexTitle };
        let indexParam='';
        for(var i in this.Arguments)
        {
            let item=this.Arguments[i];
            if (indexParam.length>0) indexParam+=',';
            indexParam+=item.Value.toString();
        }
        if (indexParam.length>0) titleInfo.Title=this.Name+'('+indexParam+')';

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
        
        if (this.OutName && this.OutName.length>0 && this.Arguments && this.Arguments.length>0)
        {
            titlePaint.SetDynamicTitle(this.OutName,this.Arguments, this.OverlayIndex.Identify);
        }

        this.OverlayIndex.Frame.Frame.Title=this.Name;    //给子框架设置标题
        if (hqChart.Frame.SubFrame[windowIndex])
        {
            var mainFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            if (mainFrame) this.OverlayIndex.Frame.Frame.XPointCount=mainFrame.XPointCount; //跟主窗口同步下页面显示数据个数
        }

        for(var i=0; i<this.OutVar.length; ++i)
        {
            let item=this.OutVar[i];
            if (item.IsExData===true) continue; //扩展数据不显示图形

            if (item.Type==0)  
            {
                this.CreateLine(hqChart,windowIndex,item,i,item.Type);
            }
            else if (item.Type==1)
            {
                switch(item.Draw.DrawType)
                {
                    case 'STICKLINE':
                        this.CreateBar(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT':
                        this.CreateDrawTextV2(hqChart,windowIndex,item,i);
                        break;
                    case 'SUPERDRAWTEXT':
                        this.CreateText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWLINE':
                        this.CreateStraightLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWBAND':
                        this.CreateBand(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE':
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE_IF':
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'POLYLINE':
                        this.CreatePolyLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWGBK':
                    case "DRAWGBK2":
                        this.CreateBackgroud(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWNUMBER':
                    case "DRAWNUMBER_FIX":  
                    case 'DRAWTEXT_FIX':  
                        this.CreateNumberText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWICON':
                        this.CreateIcon(hqChart,windowIndex,item,i);
                        break;
                    case "TIPICON":
                        this.CreateTipIcon(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWCHANNEL':
                        this.CreateChannel(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT_LINE':
                        this.CreateTextLine(hqChart,windowIndex,item,i);
                        break;
                    case "VERTLINE":
                        this.CreateChartVericaltLine(hqChart,windowIndex,item,i);
                        break;
                    case "HORLINE":
                        this.CreateChartHorizontalLine(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_LINE':
                        this.CreateMultiLine(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_POINT":
                        this.CreateMultiPoint(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_BAR':
                        this.CreateMultiBar(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_TEXT':
                        this.CreateMultiText(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_SVGICON':
                        this.CreateMultiSVGIcon(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWSVG":
                        this.CreateChartDrawSVG(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_HTMLDOM":
                        this.CreateMulitHtmlDom(hqChart,windowIndex,item,i);
                        break;

                    case "KLINE_BG":
                        this.CreateBackgroud(hqChart,windowIndex,item,i);
                        break;

                    case 'PARTLINE':
                        this.CreatePartLine(hqChart,windowIndex,item,i);
                        break;

                    case "DRAWTEXTABS":
                    case "DRAWTEXTREL":
                        this.CreateDrawText(hqChart,windowIndex,item,i);
                        break;

                    case SCRIPT_CHART_NAME.OVERLAY_BARS:
                        this.CreateStackedBar(hqChart,windowIndex,item,i);
                        break;

                    default:
                        {
                            var find=g_ScriptIndexChartFactory.Get(item.Draw.DrawType);  //外部挂接
                            if (find && find.CreateChartCallback)
                                find.CreateChartCallback(hqChart,windowIndex,item,i, this);
                        }
                        break;
                }
            }
            else if (item.Type==2)
            {
                this.CreateMACD(hqChart,windowIndex,item,i);
            }
            else if (item.Type==3)
            {
                this.CreatePointDot(hqChart,windowIndex,item,i, hisData);
            }
            else if (item.Type==4)
            {
                this.CreateLineStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==5)
            {
                this.CreateStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==6)
            {
                this.CreateVolStick(hqChart,windowIndex,item,i,hisData);
            }
            else if (item.Type==7)
            {
                this.CreateLine(hqChart,windowIndex,item,i,item.Type);
            }
            else if (item.Type==8)
            {
                this.CreateLine(hqChart,windowIndex,item,i, item.Type);
            }

            var titleData=titleInfo.Data[i];
            if (titleData)
            {
                if (this.FloatPrecision>=0) titleData.FloatPrecision=this.FloatPrecision;
                if (IFrameSplitOperator.IsNumber(this.StringFormat)) titleData.StringFormat=this.StringFormat;
            }
        }

        
        /*
        hqChart.TitlePaint[titleIndex].Title=this.Name;

        let indexParam='';
        for(let i in this.Arguments)
        {
            let item=this.Arguments[i];
            if (indexParam.length>0) indexParam+=',';
            indexParam+=item.Value.toString();
        }

        if (indexParam.length>0) hqChart.TitlePaint[titleIndex].Title=this.Name+'('+indexParam+')';
        */

        return true;
    }

    //指标执行完成
    this.RecvResultData=function(outVar,param)
    {
        let hqChart=param.HQChart;
        let windowIndex=param.WindowIndex;
        let hisData=param.HistoryData;
        param.Self.OutVar=outVar;
        param.Self.BindData(hqChart,windowIndex,hisData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值

        if (param.Self.IsSync===false)    //异步需要马上刷新，同步主图数据更新的时候会刷新的
            param.HQChart.Draw();

        var event=hqChart.GetOverlayIndexEvent();  //指标计算完成回调
        if (event)
        {
            var self=param.Self;
            var data={ OutVar:self.OutVar, WindowIndex: windowIndex, Name: self.Name, Arguments: self.Arguments, HistoryData: hisData, 
                    Identify:self.OverlayIndex.Identify,
                    Stock: {Symbol:hqChart.Symbol,Name:hqChart.Name} };
            event.Callback(event,data,self);
        }
    }

    //自定义图形配色
    this.ReloadChartResource=function(hqChart, windowIndex, chart)
    {
        var event=hqChart.GetEventCallback(JSCHART_EVENT_ID.ON_RELOAD_OVERLAY_INDEX_CHART_RESOURCE);  //指标计算完成回调
        if (!event || !event.Callback) return;
        
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var script=frame.Script;

        var sendData={ Chart:chart, IndexName:script.Name,IndexID:script.ID, HQChart:hqChart, WindowIndex:windowIndex, Guid:overlayIndex.Identify };
        event.Callback(event,sendData,this);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //  图形创建
    /////////////////////////////////////////////////////////////////////////////////////

    this.CreateLine=function(hqChart,windowIndex,varItem,id,lineType)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        if (lineType==7) var chart=new ChartStepLine();
        else var chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.DrawType=1;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (lineType==8)
        {
            chart.DrawType=2;
            chart.BreakPoint=varItem.BreakPoint;
        }

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        if (varItem.IsShow==false) chart.IsShow=false;
        chart.Data.Data=varItem.Data;
        this.ReloadChartResource(hqChart, windowIndex, chart);

        let titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);
        this.SetTitleData(titleData,chart);
       
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    //创建柱子
    this.CreateBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStickLine();
        chart.Canvas=hqChart.Canvas;
        if (varItem.Draw.Width>0) chart.Width=varItem.Draw.Width;
        else chart.Width=1;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);
        
        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateDrawText=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.IsDrawAbove) chart.Direction=1;
        else chart.Direction=0;

        chart.DrawData=varItem.Draw.DrawData;
        if (varItem.DrawFontSize>0) chart.TextFont=`${varItem.DrawFontSize*GetDevicePixelRatio()}px 微软雅黑`;    //临时用下吧

        frame.ChartPaint.push(chart);
    }

    //DRAWTEXT
    this.CreateDrawTextV2=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chartText=new ChartDrawText();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=frame.Frame.ChartBorder;
        chartText.ChartFrame=frame.Frame;
        chartText.Identify=overlayIndex.Identify;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.TextBaseline='bottom'
        if (varItem.IsDrawBelow===true) chartText.TextBaseline='top';

        if (varItem.Draw.DrawData) chartText.Data.Data=varItem.Draw.DrawData;
        chartText.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;
        //指定输出位置
        if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
        else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;
        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chartText.ShowOffset.X=varItem.XOffset;
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chartText.ShowOffset.Y=varItem.YOffset;
        
        //let titleIndex=windowIndex+1;
        frame.ChartPaint.push(chartText);
    }

    //创建文本
    this.CreateText=function(hqChart,windowIndex,varItem,id, drawName)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        let titleIndex=windowIndex+1;
        if (varItem.Draw.Position) chart.Position=varItem.Draw.Position;    //赋值坐标
        if (varItem.Draw.DrawData) chart.Data.Data=varItem.Draw.DrawData;
        chart.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chart.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chart.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chart.TextAlign=varItem.Draw.TextAlign;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        frame.ChartPaint.push(chart);
    }

    //COLORSTICK 
    this.CreateMACD=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMACD();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var clrTitle=this.GetDefaultColor(id);
        if (varItem.Color) clrTitle=this.GetColor(varItem.Color);
        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;

        this.ReloadChartResource(hqChart, windowIndex, chart);

        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,clrTitle);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreatePointDot=function(hqChart,windowIndex,varItem,id,hisData)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartPointDot();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.Radius) chart.Radius=varItem.Radius;

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.Radius=width;
        }

        if (IFrameSplitOperator.IsBool(varItem.UpDownDot)) 
        {
            chart.EnableUpDownColor=varItem.UpDownDot;
            chart.HistoryData=hisData;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateStick=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        this.ReloadChartResource(hqChart, windowIndex, chart);

        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateLineStick=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLineStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateStraightLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLine();
        chart.DrawType=1;
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateVolStick=function(hqChart,windowIndex,varItem,id,hisData)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartVolStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.KLineDrawType=hqChart.KLineDrawType;  //设置K线显示类型
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;
        if (IFrameSplitOperator.IsNumber(varItem.StickType)) chart.BarType=varItem.StickType;
        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (IFrameSplitOperator.IsPlusNumber(width)) chart.BarWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        chart.HistoryData=hisData;
        this.ReloadChartResource(hqChart, windowIndex, chart);
        
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;

        this.SetTitleData(titleData,chart);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateBand=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartBand();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.FirstColor = varItem.Draw.Color[0];
        chart.SecondColor = varItem.Draw.Color[1];
        chart.Data.Data=varItem.Draw.DrawData;

        if (IFrameSplitOperator.IsBool(varItem.IsFirstDraw)) chart.IsDrawFirst=varItem.IsFirstDraw;

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    //创建K线图
    this.CreateKLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartKLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data.Data=varItem.Draw.DrawData;
        chart.IsShowMaxMinPrice=false;
        chart.IsShowKTooltip=false;

        if (varItem.Color)  //如果设置了颜色,使用外面设置的颜色
            chart.UnchagneColor=chart.DownColor=chart.UpColor=this.GetColor(varItem.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreatePolyLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(line.Data,' ',line.Color); //给一个空的标题

        frame.ChartPaint.push(chart);
    }

    this.CreateNumberText=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        chart.TextAlign="center";
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawAbove) chart.Direction=1;
        else chart.Direction=2;

        if (varItem.Draw.Position) chart.Position=varItem.Draw.Position;    //赋值坐标

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData.Value;
        chart.Text=varItem.Draw.DrawData.Text;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateTextLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartTextLine();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Text=drawData.Text;
            chart.Line=drawData.Line;
            chart.Price=drawData.Price;
        }

        frame.ChartPaint.push(chart);
    }

    this.CreateStackedBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStackedBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarColor)) chart.BarColor=varItem.Draw.BarColor;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarName)) chart.BarName=varItem.Draw.BarName;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.BarType)) chart.BarType=varItem.Draw.BarType;

        chart.Data.Data=varItem.Draw.DrawData;

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData(chart.Data,chart.BarName,chart.BarColor);
        titleData.DataType="ChartStackedBar";
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;
        
        frame.ChartPaint.push(chart);
    }

    //创建图标
    this.CreateIcon=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;
        chart.TextAlign='center';

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chart.Direction=1;
            else if (varItem.DrawVAlign==1) chart.Direction=0;
            else if (varItem.DrawVAlign==2) chart.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chart.TextAlign="left";
            else if (varItem.DrawAlign==1) chart.TextAlign="center";
            else if (varItem.DrawAlign==2) chart.TextAlign='right';
        }

        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chart.ShowOffset.X=varItem.XOffset;
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chart.ShowOffset.Y=varItem.YOffset;
       
        chart.Data.Data=varItem.Draw.DrawData;
        var icon=varItem.Draw.Icon;
        if (icon.IconFont==true)
        {
            chart.IconFont={ Family:icon.Family, Text:icon.Symbol, Color:icon.Color };
        }
        else
        {
            chart.Text=icon.Symbol;
            if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
            else if (icon.Color) chart.Color=icon.Color;
            else chart.Color='rgb(0,0,0)';
        }
        

        //var titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateTipIcon=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartDrawSVG();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (hqChart.ChartPaint[0].IsMinuteFrame())
            chart.Data=hqChart.SourceData;
        else
            chart.Data=hqChart.ChartPaint[0].Data;  //绑定K线
        
        chart.Family=varItem.Draw.Icon.Family;
        chart.TextFont=g_JSChartResource.TIPICON.TextFont;
        
        var svgSize=g_JSChartResource.TIPICON.Size;
        var svgColor=g_JSChartResource.TIPICON.Color;
        var svgYOffset=0;
        var svgVAlign=2;    //上下对齐方式
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) svgYOffset=varItem.YOffset;
        if (varItem.Color) svgColor=this.GetColor(varItem.Color);
        if (varItem.DrawFontSize>0) svgSize=varItem.DrawFontSize;
        if (varItem.DrawVAlign>=0) svgVAlign=varItem.DrawVAlign;   

        if (varItem.Draw && IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.DrawData) && varItem.Draw.Icon)
        {
            var drawData=varItem.Draw.DrawData;
            var aryData=[];
            var isArrayTip=Array.isArray(varItem.Draw.Text);
            var singleTip=null;
            if (!isArrayTip && varItem.Draw.Text) singleTip={ Text:varItem.Draw.Text };

            for(var j=0;j<drawData.length;++j)
            {
                var item=drawData[j];
                if (!IFrameSplitOperator.IsNumber(item)) continue;

                var svgItem=
                { 
                    Index:j, Value:item, 
                    SVG:{ Symbol:varItem.Draw.Icon.Symbol, Size:svgSize, Color:svgColor, YOffset:svgYOffset, VAlign:svgVAlign }
                };

                if (isArrayTip)
                {
                    var text=varItem.Draw.Text[j];
                    if (text) svgItem.Tooltip={ Text:text };
                }
                else
                {
                    svgItem.Tooltip=singleTip;
                }

                aryData.push(svgItem);
            }

            chart.Texts= aryData;
        }

        frame.ChartPaint.push(chart);
    }


    //创建通道
    this.CreateChannel=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartChannel();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if(varItem.Draw.AreaColor) chart.AreaColor=varItem.Draw.AreaColor;
        else if (varItem.Color) chart.AreaColor=this.GetColor(varItem.Color);
        else chart.AreaColor=this.GetDefaultColor(id);

        if (varItem.Draw.Border.Color) chart.LineColor=varItem.Draw.Border.Color;
        else chart.LineColor=null;

        if (varItem.Draw.Border.Dotted) chart.LineDotted=varItem.Draw.Border.Dotted;
        if (varItem.Draw.Border.Width>0) chart.LineWidth=varItem.Draw.Border.Width;

        //let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        frame.ChartPaint.push(chart);
    }

    //
    this.CreatePartLine=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartPartLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (IFrameSplitOperator.IsPlusNumber(width)) chart.LineWidth=width;
        }

        chart.Data.Data=varItem.Draw.DrawData;
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiLine=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Lines=varItem.Draw.DrawData; 
        if (varItem.Draw.LineDash) chart.LineDash=varItem.Draw.LineDash;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsBool(varItem.Draw.IsFullRangeMaxMin)) chart.IsFullRangeMaxMin=varItem.Draw.IsFullRangeMaxMin;

        if(varItem.Draw.Arrow)  //箭头配置
        {
            var item=varItem.Draw.Arrow;
            if (item.Start==true) chart.Arrow.Start=true;
            if (item.End==true) chart.Arrow.End=true;
            if (IFrameSplitOperator.IsNumber(item.Angle)) chart.ArrawAngle=item.Angle;
            if (IFrameSplitOperator.IsNumber(item.Length)) chart.ArrawLength=item.Length;
            if (IFrameSplitOperator.IsNumber(item.LineWidth)) chart.ArrawLineWidth=item.LineWidth;
        }

        this.ReloadChartResource(hqChart, windowIndex, chart);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiPoint=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiPoint();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.PointGroup=varItem.Draw.DrawData; 
        frame.ChartPaint.push(chart);
    }

    this.CreateBackgroud=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartBackground();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Color=drawData.Color;
            chart.ColorAngle=drawData.Angle;

            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

        frame.ChartPaint.push(chart);
    }

    this.CreateMultiBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Bars=varItem.Draw.DrawData; 

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData({ KData:chart.Data, BarData:chart.Bars },varItem.Name,null);
        titleData.IsShow=false;
        titleData.DataType="MULTI_BAR";
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiText=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiText();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData; 
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiSVGIcon=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiSVGIconV2();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Family=varItem.Draw.DrawData.Family;
        chart.AryIcon= varItem.Draw.DrawData.Icon;
        chart.BuildCacheData();
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateChartDrawSVG=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartDrawSVG();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (hqChart.ChartPaint[0].IsMinuteFrame())
            chart.Data=hqChart.SourceData;
        else
            chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        
        if (IFrameSplitOperator.IsBool(varItem.Draw.DrawData.EnableTooltip)) chart.EnableTooltip=varItem.Draw.DrawData.EnableTooltip;
        if (IFrameSplitOperator.IsBool(varItem.Draw.DrawData.IsDrawFirst)) chart.IsDrawFirst=varItem.Draw.DrawData.IsDrawFirst;
        chart.Family=varItem.Draw.DrawData.Family;
        chart.TextFont=varItem.Draw.DrawData.TextFont;
        chart.Texts= varItem.Draw.DrawData.Data;
        if (varItem.Draw.AutoPosition) chart.AutoPosition=varItem.Draw.AutoPosition;

        this.ReloadChartResource(hqChart, windowIndex, chart);
        
        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }


    this.CreateMulitHtmlDom=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiHtmlDom();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.HQChart=hqChart;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData;
        chart.DrawCallback= varItem.Draw.Callback;
        frame.ChartPaint.push(chart);
    }

    this.CreateChartVericaltLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartVericaltLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.HQChart=hqChart;

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        this.SetChartLineDash(chart,varItem.Draw.DrawData);
        chart.Data.Data=varItem.Draw.DrawData.Data;

        frame.ChartPaint.push(chart);
    }

    this.CreateChartHorizontalLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartHorizontalLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.HQChart=hqChart;

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        this.SetChartLineDash(chart,varItem.Draw.DrawData);
        chart.ExtendType=varItem.Draw.DrawData.Extend;
        chart.Data.Data=varItem.Draw.DrawData.Data;

       frame.ChartPaint.push(chart);
    }

    //创建K线
    this.CreateSelfKLine=function(hqChart,windowIndex,hisData)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartKLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name="Self Kline"
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hisData
        chart.IsShowMaxMinPrice=false;
        chart.IsShowKTooltip=false;
        chart.DrawType=this.KLineType;

        frame.ChartPaint.push(chart);
    }

    //给一个默认的颜色
    this.GetDefaultColor=function(id)
    {
        let COLOR_ARRAY=
        [
            "rgb(24,71,178)",
            "rgb(42,230,215)",
            "rgb(252,96,154)",
            "rgb(0,128,255)",
            "rgb(229,0,79)",
            "rgb(68,114,196)",
            "rgb(255,174,0)",
            "rgb(25,199,255)",
            "rgb(175,95,162)",
            "rgb(236,105,65)",
        ];

        let number=parseInt(id);
        return COLOR_ARRAY[number%(COLOR_ARRAY.length-1)];
    }
}

//后台执行指标
function APIScriptIndex(name,script,args,option, isOverlay)
{
    if (isOverlay) this.newMethod=OverlayScriptIndex;   
    else this.newMethod=ScriptIndex;
    this.newMethod(name,script,args,option);
    delete this.newMethod;

    this.ClassName="APIScriptIndex";
    this.IsOverlayIndex=(isOverlay==true);  //是否是叠加指标
    this.ApiUrl;    //指标执行api地址
    this.HQDataType;
    this.Version=1; //1=默认数据格式  1=新的.net数据格式

    if (option && option.API) 
    {
        if (option.API.Url) this.ApiUrl=option.API.Url;
        if (option.API.Name) this.Name=this.ID=option.API.Name;
        if (option.API.ID) this.ID=option.API.ID;
        if (option.API.Version>0) this.Version=option.API.Version;
        if (option.API.IsUsePageData===true) this.IsUsePageData=option.API.IsUsePageData;
    }

    this.Super_CopyTo=this.CopyTo;  //父类方法
    this.CopyTo=function(dest)      //赋值到新实例出来
    {
        this.Super_CopyTo(dest);

        dest.ApiUrl=this.ApiUrl;
        dest.Version=this.Version;
        dest.IsOverlayIndex=this.IsOverlayIndex;
    }

    //接收到订阅指标数据
    this.RecvSubscribeData=function(data, hqChart, windowIndex, hisData)
    {
        if (this.Version==2)
            this.RecvAPIData2(data,hqChart,windowIndex,hisData);
        else 
            this.RecvAPIData(data,hqChart,windowIndex,hisData);
    }

    this.ExecuteScript=function(hqChart,windowIndex,hisData)
    {
        JSConsole.Complier.Log('[APIScriptIndex::ExecuteScript] name, Arguments ', this.Name,this.Arguments );

        //数据类型
        let hqDataType=HQ_DATA_TYPE.KLINE_ID;   //默认K线
        var dateRange=null;
        if (hqChart.ClassName==='MinuteChartContainer' || hqChart.ClassName==='MinuteChartHScreenContainer') 
        {
            if (hqChart.DayCount>1) hqDataType=HQ_DATA_TYPE.MULTIDAY_MINUTE_ID; //多日分钟
            else hqDataType=HQ_DATA_TYPE.MINUTE_ID;                             //分钟数据

            dateRange=hisData.GetDateRange();
        }
        else if (hqChart.ClassName==='HistoryMinuteChartContainer') 
        {
            hqDataType=HQ_DATA_TYPE.HISTORY_MINUTE_ID;   //历史分钟
        }
        else 
        {
            dateRange=hisData.GetDateRange();
        }

        var args=[];
        if (this.Arguments)
        {
            for(var i in this.Arguments)
            {
                var item=this.Arguments[i];
                args.push({name:item.Name, value:item.Value});
            }
        }

        var requestCount;
        if (hqChart.GetRequestDataCount) requestCount=hqChart.GetRequestDataCount();
        var self=this;
        var postData =
        { 
            indexname:this.ID,  symbol: hqChart.Symbol, script:this.Script, args:args,
            period:hqChart.Period, right:hqChart.Right, hqdatatype: hqDataType
        };

        if (dateRange) postData.DateRange=dateRange;

        if (requestCount)
        {
            postData.maxdatacount=requestCount.MaxRequestDataCount;
            postData.maxminutedaycount=requestCount.MaxRequestMinuteDayCount;
        }

        if (hqDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID || hqDataType==HQ_DATA_TYPE.MINUTE_ID) postData.daycount=hqChart.DayCount;
        this.HQDataType=hqDataType;

        ++this.RunCount;

        if (hqChart.NetworkFilter)
        {
            var obj=
            {
                Name:'APIScriptIndex::ExecuteScript', //类名::
                Explain:'指标计算',
                Request:{ Url:self.ApiUrl,  Type:'POST', Data: postData }, 
                Self:this,
                HQChart:hqChart,
                PreventDefault:false
            };
            
            hqChart.NetworkFilter(obj, function(data) 
            { 
                if (self.Version==2)
                    self.RecvAPIData2(data,hqChart,windowIndex,hisData);
                else 
                    self.RecvAPIData(data,hqChart,windowIndex,hisData);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        JSNetwork.HttpRequest({
            url: self.ApiUrl,
            data: postData, 
            type:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                self.RecvAPIData(recvData,hqChart,windowIndex,hisData);
            },
            error: function(request)
            {
                self.RecvError(request);
            }
        });
    }

    //py 后台指标计算格式
    this.RecvAPIData2=function(data,hqChart,windowIndex,hisData)
    {
        JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData2] recv data ', this.Name,data );
        //if (data.code!=0) return;

        if (this.HQDataType==HQ_DATA_TYPE.KLINE_ID)
        {
            this.OutVar=this.ConvertToLocalData(data,hqChart);
            JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData2] conver to OutVar ', this.OutVar);
        }
        else if (this.HQDataType==HQ_DATA_TYPE.MINUTE_ID)
        {
            this.OutVar=this.ConvertToLocalData(data,hqChart);
            JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData2] conver to OutVar ', this.OutVar);
        }
        else if (this.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)
        {
            this.OutVar=this.ConvertToLocalData(data,hqChart);
            JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData2] conver to OutVar ', this.OutVar);
        }

        this.BindData(hqChart,windowIndex,hisData);
        
        hqChart.UpdataDataoffset();           //更新数据偏移
        hqChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        hqChart.Draw();

        if (hqChart.GetIndexEvent)
        {
            var event=hqChart.GetIndexEvent();  //指标计算完成回调
            if (event)
            {
                var data={ OutVar:this.OutVar, WindowIndex: windowIndex, Name: this.Name, Arguments: this.Arguments, HistoryData: hisData, 
                        Stock: {Symbol:hqChart.Symbol,Name:hqChart.Name} };
                event.Callback(event,data,this);
            }
        }
    }

    this.ConvertToLocalData=function(jsonData, hqChart)
    {
        var outVar=jsonData.OutVar;
        if (hqChart.ClassName=="MinuteChartContainer" || hqChart.ClassName=="MinuteChartHScreenContainer")
        {
            var kdata=hqChart.SourceData;
            var aryDataIndex=kdata.GetAPIDataIndex(jsonData.Date,jsonData.Time);
        }
        else
        { 
            var kdata=hqChart.ChartPaint[0].Data;
            if (ChartData.IsDayPeriod(jsonData.Period,true))
                var aryDataIndex=kdata.GetAPIDataIndex(jsonData.Date);
            else
                var aryDataIndex=kdata.GetAPIDataIndex(jsonData.Date,jsonData.Time);
        }

        var localOutVar=[];
        for(var i in outVar)
        {
            var item=outVar[i];
            var outItem={ Type:item.Type, Name:item.Name };

            if (item.Type==0)
            {
                outItem.Data=[];
                for(var j=0;j<aryDataIndex.length;++j)
                {
                    var indexItem=aryDataIndex[j];
                    if (indexItem.Index<0) outItem.Data[j]=null;
                    else outItem.Data[j]=item.Data[indexItem.Index];
                }

                if (outItem.Name && outItem.Name.indexOf("@NODRAW@")>=0)
                    outItem.Name=outItem.Name.replace("@NODRAW@","");

            }
            else if (item.Type==1)  //绘图函数
            {
                outItem.Name=item.DrawType;
                outItem.Draw={ DrawType:item.DrawType };
                var draw=item.Draw;
                switch(item.DrawType)
                {
                    case "STICKLINE":
                        {
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var price=draw.Price[index];
                                var price2=draw.Price2[index];
                                if ( !IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(price2))
                                    continue;

                                drawData[j]={ Value:price, Value2:price2 };
                            }
                            outItem.Draw.DrawData=drawData;
                            outItem.Draw.Width=draw.Width;
                            outItem.Draw.Type=draw.Empty;
                        }
                        break;
                    case "DRAWTEXT":
                        {
                            var drawData=[];
                            var aryText=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var price=draw.Price[index];
                                if ( IFrameSplitOperator.IsNumber(price))
                                {
                                    drawData[j]=price;
                                }

                                if (Array.isArray(draw.Text))    //字符串数组
                                {
                                    var item=draw.Text[index];
                                    if (IFrameSplitOperator.IsString(item)) aryText[j]=item;
                                }
                            }

                            if (Array.isArray(draw.Text))  outItem.Draw.Text=aryText;
                            else outItem.Draw.Text=draw.Text;

                            outItem.Draw.DrawData=drawData;
                        }
                        break;
                    case "DRAWNUMBER":
                        {
                            var drawData={Value:[], Text:[]};
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData.Value[j]=null;
                                drawData.Text[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var price=draw.Price[index];
                                var number=draw.Number[index];
                                if ( !IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(number)) continue;

                                drawData.Value[j]=price;
                                drawData.Text[j]=number.toFixed(2);
                            }
                            outItem.Draw.DrawData=drawData;
                        }
                        break;
                    case "DRAWBAND":
                        {
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var price=draw.Val1[index];
                                var price2=draw.Val2[index];
                                if ( !IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(price2)) continue;

                                drawData[j]={ Value:price, Value2:price2 };
                            }
                            outItem.Draw.DrawData=drawData;
                            outItem.Draw.Color=[null, null];
                            if (draw.Color1) outItem.Draw.Color[0]=draw.Color1.toLowerCase();
                            if (draw.Color2) outItem.Draw.Color[1]=draw.Color2.toLowerCase();
                        }
                        break;
                    case "DRAWKLINE":
                        {
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                var item={ Open:null,High:null, Low:null, Close:null };
                                drawData[j]=item;

                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;

                                var high=draw.High[index];
                                var low=draw.Low[index];
                                var open=draw.Open[index];
                                var close=draw.Close[index];
                                if ( IFrameSplitOperator.IsPlusNumber(high) && IFrameSplitOperator.IsPlusNumber(low) &&
                                    IFrameSplitOperator.IsPlusNumber(open) && IFrameSplitOperator.IsPlusNumber(close)) 
                                {
                                    item.Open=open;
                                    item.Close=close;
                                    item.High=high;
                                    item.Low=low;
                                }
                            }
                            outItem.Draw.DrawData=drawData;
                        }
                        break;
                    case "DRAWTEXT_FIX":
                        {
                            var drawData={ Value:[], Text:[] };
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData.Value[j]=0;
                                drawData.Text[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var condItem=draw.Cond[index];
                                if (!condItem) continue;

                                drawData.Value[j]=1;
                                drawData.Text[j]=draw.Text;
                            }
                            outItem.Draw.DrawData=drawData;
                            outItem.Draw.Position={ X:draw.X, Y:draw.Y, Type:draw.Type };
                        }
                        break;
                    case "DRAWNUMBER_FIX":
                        {
                            var drawData={ Value:[], Text:[] };
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData.Value[j]=null;
                                drawData.Text[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var value=draw.Number[index];
                                if (!IFrameSplitOperator.IsNumber(value)) continue;

                                drawData.Value[j]=value;
                                drawData.Text[j]=IFrameSplitOperator.RemoveZero(value.toFixed(2));
                            }
                            outItem.Draw.DrawData=drawData;
                            outItem.Draw.Position={ X:draw.X, Y:draw.Y, Type:draw.Type };
                        }
                        break;
                    case "DRAWICON":
                        {
                            var icon=g_JSComplierResource.GetDrawIcon(draw.Type);
                            if (!icon) g_JSComplierResource.GetDrawTextIcon(draw.Type);
                            if (!icon) icon={Symbol:'🚩'};
                            outItem.Draw.Icon=icon;
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;
                                
                                var value=draw.Price[index];
                                if (!IFrameSplitOperator.IsNumber(value)) continue;

                                drawData[j]=value;
                            }
                            outItem.Draw.DrawData=drawData;
                        }
                        break;
                    case "PARTLINE":
                        {
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]={Value:null, RGB:null};
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;

                                var color=draw.Color[index];
                                if (!IFrameSplitOperator.IsString(color)) continue;
                                var value=draw.Price[index];
                                if (!IFrameSplitOperator.IsNumber(value)) continue;

                                drawData[j].Value=value;
                                drawData[j].RGB=color;
                            }

                            outItem.Draw.DrawData=drawData;
                        }
                        break;
                    case "FILLRGN":
                        {
                            var drawData=[];
                            for(var j=0;j<aryDataIndex.length;++j)
                            {
                                drawData[j]=null;
                                var indexItem=aryDataIndex[j];
                                var index=indexItem.Index;
                                if (index<0) continue;

                                var color=draw.Color[index];
                                if (!IFrameSplitOperator.IsString(color)) continue;
                                var value=draw.Price[index];
                                if (!IFrameSplitOperator.IsNumber(value)) continue;
                                var value2=draw.Price2[index];
                                if (!IFrameSplitOperator.IsNumber(value2)) continue;

                                drawData[j]={ Value:value, Value2:value2, Color:color };
                            }

                            outItem.Draw.DrawData=drawData;
                            outItem.Draw.DrawType="FILLRGN2";
                        }
                        break;
                    default:
                        continue;
                }
            }
            else
            {
                continue;
            }

            for(var i in item.Attribute)
            {
                var attr=item.Attribute[i];
                switch(attr)
                {
                    case "COLORSTICK":
                        outItem.Type=2; //画上下柱子
                        break;
                    case "POINTDOT":
                        outItem.Radius=g_JSChartResource.POINTDOT.Radius;
                        outItem.Type=3;
                        break;
                    case "CIRCLEDOT":
                        outItem.Radius=g_JSChartResource.CIRCLEDOT.Radius;
                        outItem.Type=3;
                        break;
                    case "DOTLINE":
                        outItem.IsDotLine=true;
                        break;
                    case "DRAWABOVE":
                        outItem.IsDrawAbove=true;
                        break;
                    case "LINESTICK":
                        outItem.Type=4;
                        break;
                    case "STICK":       //STICK 画柱状线
                        outItem.Type=5;
                        break;
                    case "VOLSTICK":    //成交量柱子
                        outItem.Type=6;
                        break;
                    case "LINEAREA":
                        outItem.Type=9; //面积
                        break;
                    case "NODRAW":  //不画该线
                        outItem.IsShow = false;
                        break;
                    case "NONE_OUT_NAME":   //不显示标题
                        outItem.NoneName=true;
                        break;
                    case "NOTEXT":  //不显示标题
                        outItem.IsShowTitle=false;
                        break;
                }
                
               
                if (attr.indexOf('COLOR')==0)
                {
                    outItem.Color=attr;
                }
                else if (attr.indexOf('LINETHICK')==0) 
                {
                    outItem.LineWidth=attr;
                }
            }

            localOutVar.push(outItem);
        }

        return localOutVar;
    }

    this.RecvAPIData=function(data,hqChart,windowIndex,hisData)
    {
        JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData] recv data ', this.Name,data );
        if (data.code!=0) return;

        if (hqChart.EnableVerifyRecvData)
        {
            if (!data.stock || hqChart.Symbol!=data.stock.symbol) 
            {
                JSConsole.Chart.Warn(`[APIScriptIndex::RecvAPIData] recv data symbol not match. HQChart[${hqChart.Symbol}]`);
                return;
            }
        }

        if (data.error && IFrameSplitOperator.IsString(data.error.message))
        {
            var param=
            {
                HQChart:hqChart,
                WindowIndex:windowIndex,
                HistoryData:hisData,
                Self:this
            };


            this.ShowConditionError(param, data.error.message);
            return;
        }

        if (data.outdata && data.outdata.name) this.Name=data.outdata.name;

        if (data.outdata.args)  //外部修改参数
        {
            this.Arguments=[];
            for(var i in data.outdata.args)
            {
                var item= data.outdata.args[i];
                this.Arguments.push({Name:item.name, Value:item.value});
            }
        }

        if (this.HQDataType==HQ_DATA_TYPE.KLINE_ID)
        {
            this.OutVar=this.FittingData(data.outdata,hqChart);
            JSConsole.Complier.Log('[APIScriptIndex::RecvAPIData] conver to OutVar ', this.OutVar);
        }
        else
        {
            this.OutVar=this.FittingMinuteData(data.outdata,hqChart);   //走势图数据
        }
        this.BindData(hqChart,windowIndex,hisData);

        if (this.IsLocked==false) //不上锁
        {
            hqChart.Frame.SubFrame[windowIndex].Frame.SetLock(null);
        }
        else    //上锁
        {
            let lockData={ IsLocked:true,Callback:this.LockCallback,IndexName:this.Name ,ID:this.LockID,
                BG:this.LockBG,Text:this.LockText,TextColor:this.LockTextColor, Font:this.LockFont, Count:this.LockCount, MinWidth:this.LockMinWidth };
            hqChart.Frame.SubFrame[windowIndex].Frame.SetLock(lockData);
        }

        hqChart.UpdataDataoffset();           //更新数据偏移
        hqChart.UpdateFrameMaxMin();          //调整坐标最大 最小值

        if (data.Redraw===false)    //是否重绘
        {

        }
        else
        {
            if (this.IsSync===false)    //同步的指标不用刷新
                hqChart.Draw();
        }

        if (hqChart.GetIndexEvent)
        {
            var event=hqChart.GetIndexEvent();  //指标计算完成回调
            if (event)
            {
                var data={ OutVar:this.OutVar, WindowIndex: windowIndex, Name: this.Name, Arguments: this.Arguments, HistoryData: hisData, 
                        Stock: {Symbol:hqChart.Symbol,Name:hqChart.Name} };
                event.Callback(event,data,this);
            }
        }
    }

    this.FittingArray=function(sourceData,date,time,hqChart,arrayType)  //arrayType 0=单值数组 1=结构体
    {
        var kdata=hqChart.ChartPaint[0].Data;   //K线

        var arySingleData=[];
        for(var i in sourceData)
        {
            var value=sourceData[i];
            var indexItem=new SingleData(); //单列指标数据
            indexItem.Date=date[i];
            if (time && i<time.length) indexItem.Time=time[i];
            indexItem.Value=value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (ChartData.IsDayPeriod(hqChart.Period,true))
            aryFittingData=kdata.GetFittingData(arySingleData);        //数据和主图K线拟合
        else
            aryFittingData=kdata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        var result;
        if (arrayType==1) result=bindData.GetObject();
        else result=bindData.GetValue();
        return result;
    }

    this.FittingMultiLine=function(sourceData,date,time,hqChart)
    {
        var kdata=hqChart.ChartPaint[0].Data;   //K线

        if (ChartData.IsDayPeriod(hqChart.Period,true))  //日线
        {
            var kdata=hqChart.ChartPaint[0].Data;   //K线

            var aryPoint=[];
            for(var i in sourceData)
            {
                var item=sourceData[i];
                for(var j in item.Point)
                {
                    var point=item.Point[j];
                    aryPoint.push(point);
                }
            }

            aryPoint.sort(function(a,b) { return a.Date-b.Date; });
            kdata.GetDateIndex(aryPoint);
            return sourceData;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period,true) || ChartData.IsTickPeriod(hqChart.Period) || ChartData.IsSecondPeriod(hqChart.Period)) //分钟线
        {
            var kdata=hqChart.ChartPaint[0].Data;   //K线

            var aryPoint=[];
            for(var i in sourceData)
            {
                var item=sourceData[i];
                for(var j in item.Point)
                {
                    var point=item.Point[j];
                    aryPoint.push(point);
                }
            }

            aryPoint.sort(function(a,b) 
                { 
                    if (a.Date==b.Date) return a.Time-b.Time;
                    return a.Date-b.Date; 
                }
            );

            kdata.GetDateTimeIndex(aryPoint);
            return sourceData;
        }
        else if (this.HQDataType==HQ_DATA_TYPE.MINUTE_ID || this.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)
        {
            var minuteData=hqChart.SourceData;

            var aryPoint=[];
            for(var i in sourceData)
            {
                var item=sourceData[i];
                for(var j in item.Point)
                {
                    var point=item.Point[j];
                    aryPoint.push(point);
                }
            }

            aryPoint.sort(function(a,b) 
                { 
                    if (a.Date==b.Date) return a.Time-b.Time;
                    return a.Date-b.Date; 
                }
            );

            minuteData.GetDateTimeIndex(aryPoint);
            return sourceData;
        }
        
        return null;
    }

    this.FittingMultiText=function(sourceData,date,time,hqChart)
    {
        if (ChartData.IsDayPeriod(hqChart.Period,true))  //日线
        {
            var kdata=hqChart.ChartPaint[0].Data;   //K线

            sourceData.sort(function(a,b) { return a.Date-b.Date; });
            kdata.GetDateIndex(sourceData);
            return sourceData;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period,true) || ChartData.IsTickPeriod(hqChart.Period) || ChartData.IsSecondPeriod(hqChart.Period) || ChartData.IsMilliSecondPeriod(hqChart.Period)) //分钟线
        {
            var kdata=hqChart.ChartPaint[0].Data;   //K线

            sourceData.sort(function(a,b) 
                { 
                    if (a.Date==b.Date) return a.Time-b.Time;
                    return a.Date-b.Date; 
                }
            );

            kdata.GetDateTimeIndex(sourceData);
            return sourceData;
        }
        else if (this.HQDataType==HQ_DATA_TYPE.MINUTE_ID || this.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)
        {
            var minuteData=hqChart.SourceData;

            sourceData.sort(function(a,b) 
                { 
                    if (a.Date==b.Date) return a.Time-b.Time;
                    return a.Date-b.Date; 
                }
            );

            minuteData.GetDateTimeIndex(sourceData);
            return sourceData;
        }
        
        return null;
    }

    this.FittingData=function(jsonData, hqChart)
    {
        var outVar=jsonData.outvar;
        var date=jsonData.date;
        var time=jsonData.time;
        var kdata=hqChart.ChartPaint[0].Data;

        //把数据拟合到kdata上
        var result=[];
        if (!outVar) return result;
        
        for(var i=0;i<outVar.length; ++i)
        {
            var item=outVar[i];
            var indexData=[];
            var outVarItem={Name:item.name,Type:item.type};
            if (item.color) outVarItem.Color=item.color;
            if (IFrameSplitOperator.IsBool(item.IsShowTitle)) outVarItem.IsShowTitle = item.IsShowTitle;  //是否显示指标标题
            if (item.data)
            {
                outVarItem.Data=this.FittingArray(item.data,date,time,hqChart);

                if (item.color) outVarItem.Color=item.color;
                if (item.linewidth) outVarItem.LineWidth=item.linewidth; 
                if (IFrameSplitOperator.IsBool(item.isshow)) outVarItem.IsShow = item.isshow;  //是否绘制线段
                if (item.isexdata==true) outVarItem.IsExData = true;
                if (item.BreakPoint) outVarItem.BreakPoint=item.BreakPoint;

                result.push(outVarItem);
            }
            else if (item.Draw)
            {
                var draw=item.Draw;
                var drawItem={};
                if (draw.DrawType=='DRAWICON')  //图标
                {
                    drawItem.Icon=draw.Icon;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='DRAWTEXT') //文本
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='STICKLINE')    //柱子
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.Width=draw.Width;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="DRAWBAND")
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    drawItem.Color=draw.Color;  
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_LINE')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    if (IFrameSplitOperator.IsNonEmptyArray(drawItem.DrawData))
                    {
                        for(var k=0; k<drawItem.DrawData.length; ++k)
                        {
                            this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                        }
                    }
                    
                    outVarItem.Draw=drawItem;
                    if (draw.LineDash) drawItem.LineDash=draw.LineDash;
                    if (IFrameSplitOperator.IsBool(draw.IsFullRangeMaxMin)) drawItem.IsFullRangeMaxMin=draw.IsFullRangeMaxMin;
                    if (draw.Arrow) drawItem.Arrow=draw.Arrow;
                    if (IFrameSplitOperator.IsNumber(draw.LineWidth)) drawItem.LineWidth=draw.LineWidth;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_POINT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    if (IFrameSplitOperator.IsNonEmptyArray(drawItem.DrawData))
                    {
                        for(var k=0; k<drawItem.DrawData.length; ++k)
                        {
                            this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                        }
                    }
                    
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_BAR')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType==SCRIPT_CHART_NAME.OVERLAY_BARS)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.BarName=draw.BarName;
                    drawItem.BarColor=draw.BarColor;
                    drawItem.LineWidth=draw.LineWidth;
                    drawItem.BarType=draw.BarType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType==SCRIPT_CHART_NAME.SCATTER_PLOT)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    //默认的值
                    drawItem.Color=draw.Color;  
                    drawItem.Radius=draw.Radius;
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType==SCRIPT_CHART_NAME.KLINE_TABLE)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    drawItem.RowCount=draw.RowCount;
                    drawItem.RowName=draw.RowName;
                    drawItem.IsShowRowName=draw.IsShowRowName;
                    drawItem.BGColor=draw.BGColor;
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_TEXT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_SVGICON')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ Icon:draw.DrawData.Icon, Family:draw.DrawData.Family };
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='DRAWSVG')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    if (draw.AutoPosition) drawItem.AutoPosition=draw.AutoPosition;
                    drawItem.DrawData={ Data:this.FittingMultiText(draw.Data,date,time,hqChart), Family:draw.Family, TextFont:draw.TextFont, EnableTooltip:draw.EnableTooltip, IsDrawFirst:draw.IsDrawFirst };
                    this.GetKLineData(drawItem.DrawData.Data, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="MULTI_HTMLDOM")    //外部自己创建dom
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.Callback=draw.Callback;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="COLOR_KLINE")
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    var klineOption=this.FittingMultiText(draw.DrawData.KLine,date,time,hqChart);
                    var mapKLineOption=new Map();
                    for(var i in klineOption)
                    {
                        var item=klineOption[i];
                        mapKLineOption.set(item.Index,item);
                    }

                    drawItem.DrawData={ KLine:mapKLineOption };
                    if (draw.Color)  outVarItem.Color=draw.Color;
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="KLINE_BG")
                {
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ };
                    drawItem.DrawData.Color=draw.Color;
                    drawItem.DrawData.Angle=draw.Angle;
                    if (draw.Ver==2.0) drawItem.DrawData.Data=this.FittingKLineBG_V2(draw.DrawData, hqChart);
                    else drawItem.DrawData.Data=this.FittingKLineBG(draw.DrawData, hqChart);

                    outVarItem.Draw=drawItem;
                    outVarItem.Name=draw.DrawType;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_POINT_LINE')
                {
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ };
                    drawItem.DrawData.Color=draw.Color;
                    drawItem.DrawData.PointRadius=draw.PointRadius;
                    drawItem.DrawData.PointColor=draw.PointColor;
                    drawItem.DrawData.LineWidth=draw.LineWidth;
                    drawItem.DrawData.Data=this.FittingMultiPointLine(draw.DrawData, hqChart);

                    outVarItem.Draw=drawItem;
                    //outVarItem.Name=draw.DrawType;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=="PARTLINE")
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);

                    outVarItem.Draw=drawItem;
                    if (draw.LineWidth) outVarItem.LineWidth=draw.LineWidth;
                    
                    result.push(outVarItem);
                }
                else
                {
                    var find=g_ScriptIndexChartFactory.Get(draw.DrawType);  //外部挂接
                    if (find && find.KLineFittingCallback)
                    {
                        if (find.KLineFittingCallback(item, outVarItem, { Date:date, Time:time, HQChart:hqChart }, this)) 
                            result.push(outVarItem);
                    }
                }
            }
        }

        return result;
    }

    // h, high, low l. c, close
    this.GetKLineData=function(data,hqChart)
    {
        if (!data) return;
        if (!Array.isArray(data)) return;

        if (this.HQDataType==HQ_DATA_TYPE.MINUTE_ID || this.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID)
            var kData=hqChart.SourceData;   //走势图分钟数据
        else 
            var kData=hqChart.ChartPaint[0].Data;   //K线

        for(var i in data)
        {
            var item=data[i];
            if (!IFrameSplitOperator.IsString(item.Value)) continue;
            if (!IFrameSplitOperator.IsNumber(item.Index)) continue;
            if (item.Index<0 || item.Index>=kData.Data.length) continue;
            var valueName=item.Value.toUpperCase();
            var kItem=kData.Data[item.Index];
            switch(valueName)
            {
                case "HIGH":
                case "H":
                    item.Value=kItem.High;
                    break;
                case "L":
                case "LOW":
                    item.Value=kItem.Low;
                    break;
                case "C":
                case "CLOSE":
                    item.Value=kItem.Close;
                    break;
            }
        }
    }

    this.FittingKLineBG=function(data, hqChart)
    {
        var kData=hqChart.ChartPaint[0].Data;   //K线
        var result=[];
        if (ChartData.IsDayPeriod(hqChart.Period,true))  //日线
        {
            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length;)
            {
                result[i]=0;
                var kItem=kData.Data[i];
                if (j>=data.length) 
                {
                    ++i;
                    continue;
                }
                var dataItem=data[j];

                if (dataItem.Date<kItem.Date)
                {
                    ++j;
                }
                else if (dataItem.Date>kItem.Date)
                {
                    ++i;
                }
                else
                {
                    bFill=true;
                    result[i]=1;
                    ++j;
                    ++i;
                }
            }

            if (bFill) return result;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period,true)) //分钟线
        {
            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length;)
            {
                result[i]=0;
                var kItem=kData.Data[i];
                if (j>=data.length) 
                {
                    ++i;
                    continue;
                }
                var dataItem=data[j];

                if (dataItem.Date<kItem.Date || (dataItem.Date==kItem.Date && dataItem.Time<kItem.Time))
                {
                    ++j;
                }
                else if (dataItem.Date>kItem.Date || (dataItem.Date==kItem.Date && dataItem.Time>kItem.Time))
                {
                    ++i;
                }
                else
                {
                    bFill=true;
                    result[i]=1;
                    ++j;
                    ++i;
                }
            }

            if (bFill) return result;
        }
        
        return null;
    }

    this.FittingKLineBG_V2=function(data, hqChart)  //2.0版本通过  [{ Start:, End: }, .....]来填充背景色
    {
        var kData=hqChart.ChartPaint[0].Data;   //K线
        var result=[];
        if (ChartData.IsDayPeriod(hqChart.Period,true))  //日线
        {
            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length;++i)
            {
                result[i]=0;
                var kItem=kData.Data[i];
                var date=kItem.Date;
                for(j=0;j<data.length;++j)
                {
                    var rangeItem=data[j];
                    if (date>=rangeItem.Start.Date && date<=rangeItem.End.Date)
                    {
                        result[i]=1;
                        bFill=true;
                        break;
                    }

                }
            }

            if (bFill) return result;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period,true)) //分钟线
        {
            var aryRange=[];
            for(var i=0;i<data.length;++i)
            {
                var item=data[i];
                var startDatetime=item.Start.Date*10000;
                if (IFrameSplitOperator.IsNumber(item.Start.Time)) startDatetime+=item.Start.Time;
                var endDatetime=item.End.Date*10000;
                if (IFrameSplitOperator.IsNumber(item.End.Time)) endDatetime+=item.End.Time;

                aryRange.push({ Start:startDatetime , End:endDatetime});
            }

            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length; ++i)
            {
                result[i]=0;
                var kItem=kData.Data[i];

                var date=kItem.Date*10000+kItem.Time;
                for(j=0;j<aryRange.length;++j)
                {
                    var rangeItem=aryRange[j];
                    if (date>=rangeItem.Start && date<=rangeItem.End)
                    {
                        result[i]=1;
                        bFill=true;
                        break;
                    }
                }
            }

            if (bFill) return result;
        }
        
        return null;
    }

    this.FittingMinuteData=function(jsonData, hqChart)
    {
        var outVar=jsonData.outvar;
        var date=jsonData.date;
        var time=jsonData.time;
        var result=[];
        
        for(var i=0;i<outVar.length;++i)
        {
            var item=outVar[i];
            var outVarItem={Name:item.name,Type:item.type}
            if (item.data)
            {
                outVarItem.Data=this.FittingMinuteArray(item.data,date,time,hqChart);
                if (item.color) outVarItem.Color=item.color;
                if (item.linewidth>=1) outVarItem.LineWidth=item.linewidth;
                if (item.isshow==false) outVarItem.IsShow = false;
                if (item.isexdata==true) outVarItem.IsExData = true;
                if (item.BreakPoint) outVarItem.BreakPoint=item.BreakPoint;
                if (item.UpColor) outVarItem.UpColor=item.UpColor;
                if (item.DownColor) outVarItem.DownColor=item.DownColor;

                result.push(outVarItem);
            }
            else if (item.Draw)
            {
                var draw=item.Draw;
                var drawItem={};
                if (draw.DrawType=='DRAWICON')  //图标
                {
                    drawItem.Icon=draw.Icon;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='DRAWTEXT') //文本
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='STICKLINE')    //柱子
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.Width=draw.Width;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType==SCRIPT_CHART_NAME.OVERLAY_BARS)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.BarName=draw.BarName;
                    drawItem.BarColor=draw.BarColor;
                    drawItem.LineWidth=draw.LineWidth;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_LINE')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    for(var k in drawItem.DrawData)
                    {
                        this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                    }
                    
                    outVarItem.Draw=drawItem;
                    if (draw.LineDash) drawItem.LineDash=draw.LineDash;
                    if (draw.Arrow) drawItem.Arrow=draw.Arrow;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_POINT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    if (IFrameSplitOperator.IsNonEmptyArray(drawItem.DrawData))
                    {
                        for(var k=0; k<drawItem.DrawData.length; ++k)
                        {
                            this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                        }
                    }
                    
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_TEXT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_SVGICON')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ Icon:draw.DrawData.Icon, Family:draw.DrawData.Family };
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='DRAWSVG')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    if (draw.AutoPosition) drawItem.AutoPosition=draw.AutoPosition;
                    drawItem.DrawData={ Data:this.FittingMultiText(draw.Data,date,time,hqChart), Family:draw.Family, TextFont:draw.TextFont ,EnableTooltip:draw.EnableTooltip,IsDrawFirst:draw.IsDrawFirst };
                    this.GetKLineData(drawItem.DrawData.Data, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="MULTI_HTMLDOM")    //外部自己创建dom
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.Callback=draw.Callback;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else
                {
                    var find=g_ScriptIndexChartFactory.Get(draw.DrawType);  //外部挂接
                    if (find && find.MinuteFittingCallback)
                    {
                        if (find.MinuteFittingCallback(item, outVarItem, { Date:date, Time:time, HQChart:hqChart }, this)) 
                            result.push(outVarItem);
                    }
                }
            }
        }

        return result;
    }

    //matchType 0=精确匹配（默认) 5=模糊匹配
    this.FittingMinuteArray=function(sourceData,date,time,hqChart,matchType)
    {
        var minutedata=hqChart.SourceData;;   //分钟线

        var arySingleData=[];
        for(var i in sourceData)
        {
            var value=sourceData[i];
            var indexItem=new SingleData(); //单列指标数据
            indexItem.Date=date[i];
            if (time && i<time.length) indexItem.Time=time[i];
            indexItem.Value=value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (matchType==5) 
            aryFittingData=minutedata.GetMinuteFittingDataV2(arySingleData);  //数据和主图K线拟合
        else 
            aryFittingData=minutedata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合 精确匹配（默认)

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        var result=bindData.GetValue();
        return result;
    }

    this.FittingMultiPointLine=function(data, hqChart)
    {
        var period=hqChart.Period;              //周期
        var arySrouceData=data.Data;
        var aryData=[];
        if (ChartData.IsDayPeriod(period,true))  //日线
        {
            //arySrouceData.sort((a,b)=> { return a.Date-b.Date});
            var firstItem=arySrouceData[0];
            var kdata=hqChart.ChartPaint[0].Data;   //K线
            var firstKItem=kdata.Data[0];
            var kIndex=0, dataIndex=0;
            if (firstItem.Date>firstKItem.Date)
            {
                var preIndex=0;
                for(kIndex=0;kIndex<kdata.Data.length;++kIndex)
                {
                    var kItem=kdata.Data[kIndex];
                    if (kItem.Date==firstItem.Date) 
                        break;
                    if (kItem.Date>firstItem.Date)
                    {
                        kIndex=preIndex;
                        break;
                    }
                    preIndex=kIndex;
                }
            }
            else
            {
                for(dataIndex=0;dataIndex<arySrouceData.length;++dataIndex)
                {
                    var item=arySrouceData[dataIndex];
                    if (item.Date>=firstKItem.Date) 
                        break;
                }
            }
            
            var preItem=null;
            for(var i=kIndex, j=dataIndex; i<kdata.Data.length && j<arySrouceData.length; )
            {
                var kItem=kdata.Data[i];
                var item=arySrouceData[j];
                if (item.Date<=kItem.Date)
                {
                    if (!aryData[i]) aryData[i]=[];
                    aryData[i].push({Date:item.Date, Value:item.Value, Data:item.Data, KDate:kItem.Date, Type:1 });
                    preItem=item;
                    ++j;
                }
                else
                {
                    if (preItem && !aryData[i]) aryData[i]={ Date:preItem.Date, Value:preItem.Value , Type: 0 };
                    ++i;
                }
            }

            if (preItem)
            {
                for( ;i<kdata.Data.length; ++i) //补齐最后的数据
                {
                    if (!aryData[i]) aryData[i]={ Date:preItem.Date, Value:preItem.Value , Type: 0 };
                }
            }
            

           
            return aryData;
        }
        else if (ChartData.IsMinutePeriod(period,true)) //分钟线
        {
            var kdata=hqChart.ChartPaint[0].Data;   //K线
            
            return aryData;
        }
    }

}

// 本地json数据指标
function LocalJsonDataIndex(name,args,option)
{
    this.newMethod=ScriptIndex;   //派生
    this.newMethod(name,null,args,null);
    delete this.newMethod;

    this.JsonData;  //json格式数据
    if (option.JsonData) this.JsonData=option.JsonData;

    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        if (!this.JsonData)
        {
            console.warn("[LocalJsonDataIndex::RequestData] JsonData is null");
            if (param.HQChart.ScriptErrorCallback) param.HQChart.ScriptErrorCallback('json 数据不能为空');
            return;
        }

        this.OutVar=this.FittingData(this.JsonData,hisData);
        this.BindData(hqChart,windowIndex,hisData);
    }

    this.FittingData=function(jsonData, hisData)
    {
        outVar=jsonData.OutVar;
        date=jsonData.Date;
        time=jsonData.Time;

        result=[];

        for(i in outVar)
        {
            item=outVar[i];
            JSConsole.Complier.Log('[LocalJsonDataIndex::FittingData] item', item);
            if (item.Type!=0 && item.Type!=3)   //复杂的图形不支持
            {
                console.warn("[LocalJsonDataIndex::FittingData] can't support ", item.Name, item.Type);
                continue; 
            }
            
            var indexData=[];
            outVarItem={Name:item.Name,Type:item.Type}
            for(j in item.Data)
            {
                var indexItem=new SingleData(); //单列指标数据
                indexItem.Date=date[j];
                if (time && j<time.length) indexItem.Time=time[j];
                indexItem.Value=item.Data[j];
                indexData.push(indexItem);
            }

            if (hisData.Period<4)
                var aryFittingData=hisData.GetFittingData(indexData); //数据和主图K线拟合
            else
                var aryFittingData=hisData.GetMinuteFittingData(indexData); //数据和主图K线拟合
            var bindData=new ChartData();
            bindData.Data=aryFittingData;
            outVarItem.Data=bindData.GetValue();
            result.push(outVarItem)
        }

        return result;
    }
}


////////////////////////////////////////////////////////////////////////
//  无UI指标执行
// obj: { Name:指标名字 , ID:指标ID , Script:指标脚本, Args:指标参数, ErrorCallback:错误回调 }
//
///////////////////////////////////////////////////////////////////////
function ScriptIndexConsole(obj)    
{
    this.ID;                //指标ID
    this.Name;              //指标名字
    this.Script;            //脚本
    this.Arguments=[];      //参数
    this.ClassName='ScriptIndexConsole';
    this.ErrorCallback;     //执行错误回调
    this.FinishCallback;    //执行完成回调
    this.IsSectionMode=false;   //截面报表模式
    this.NetworkFilter;         //数据接口
    this.IsApiPeriod=false;

    if (obj)
    {
        if (obj.Name) this.Name=obj.Name;
        if (obj.Script) this.Script=obj.Script;
        if (obj.ID) this.ID=obj.ID;
        if (obj.Args) this.Arguments=obj.Args;
        if (obj.ErrorCallback) this.ErrorCallback=obj.ErrorCallback;
        if (obj.FinishCallback) this.FinishCallback=obj.FinishCallback;
        if (obj.IsSectionMode) this.IsSectionMode=obj.IsSectionMode;
        if (obj.NetworkFilter) this.NetworkFilter=obj.NetworkFilter;
        if (IFrameSplitOperator.IsBool(obj.IsApiPeriod)) this.IsApiPeriod=obj.IsApiPeriod;
    }

    //执行脚本
    //obj:
    //     HQDataType:(HQ_DATA_TYPE), Period:周期, Right:复权
    //     Stock: {Name:, Symbol:}, Request: { MaxDataCount:请求K线数据个数, MaxMinuteDayCount:请求分钟数据天数, TradeDate: 历史走势图才用}, :
    //     Data: 当前计算数据(周期|复权以后), Source:  原始股票数据 
    this.ExecuteScript=function(obj)
    {
        this.OutVar=[];
        let param= { Self:this };

        let option=
        {
            HQDataType:obj.HQDataType,
            Symbol:obj.Stock.Symbol, 
            Name:obj.Stock.Name,
            Period:obj.Period,
            Right:obj.Right,
            Callback:this.RecvResultData, CallbackParam:param,
            Async:true,
            MaxRequestDataCount:obj.Request.MaxDataCount,
            MaxRequestMinuteDayCount:obj.Request.MaxMinuteDayCount,
            Arguments:this.Arguments,
            IsSectionMode:this.IsSectionMode,
            ClassName:'ScriptIndexConsole',
            NetworkFilter:this.NetworkFilter,
            IsApiPeriod:this.IsApiPeriod,
            Self:this,
        };

        if (obj.HQDataType===HQ_DATA_TYPE.HISTORY_MINUTE_ID) option.TrateDate=obj.Request.TradeDate;
        if (obj.HQDataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) option.DayCount=obj.DayCount;
        if (obj.Data) option.Data=obj.Data; //K线数据
        
        let code=this.Script;
        let run=JSComplier.Execute(code,option,this.ErrorCallback);
    }

    this.RecvResultData=function(outVar,param)
    {
        var self=param.Self;
        var jsExec=param.JSExecute;

        var date=null;
        if (jsExec.SymbolData.Data)
            date=jsExec.SymbolData.Data.GetDate();
        
        var result=
        { 
            Out:outVar, 
            Date:date,  //日期对应 上面的数据
            Stock:{ Name:jsExec.SymbolData.Name, Symbol:jsExec.SymbolData.Symbol }, //股票信息
            Index: { Name:self.Name, ID:self.ID }   //指标信息
        };

        if (jsExec.SymbolData.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID || jsExec.SymbolData.DataType==HQ_DATA_TYPE.MINUTE_ID) result.Time=jsExec.SymbolData.Data.GetTime();
        else if (jsExec.SymbolData.DataType==HQ_DATA_TYPE.KLINE_ID && ChartData.IsMinutePeriod(jsExec.SymbolData.Period,true)) result.Time=jsExec.SymbolData.Data.GetTime();
        //JSConsole.Complier.Log('[ScriptIndexConsole::RecvResultData] outVar ', outVar);
        if (self.FinishCallback) self.FinishCallback(result, param.JSExecute);
    }
}

ScriptIndexConsole.SetDomain = function (domain, cacheDomain)   //修改API地址
{
    JSComplier.SetDomain(domain,cacheDomain);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//内置财务数据下载
//
function DownloadFinValueData(obj)
{
    this.Url=obj.Url;
    this.Job=obj.Job;
    this.Symbol=obj.Symbol;
    this.Args=obj.Args;
    this.DataKey=obj.DataKey;
    this.RecvCallback=obj.Callback;
    this.ErrorCallback=obj.ErrorCallback;

    this.Download=function()
    {
        var self=this;
        var fieldList=this.GetFieldList();
        if (!fieldList)
        {
            message=`${this.Job.FunctionName}(${this.Args[0]}) can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey);
            return;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.Url,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "condition":[ {"item":["finance","doc","exists","true"]}] ,
                "start": 0,
                "end": 200
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData);
                if (data) //排序
                    data.sort(function (a, b) { return (a.Date - b.Date) });

                self.RecvCallback(data, self.Job, self.DataKey);
            }
        });
    }

    this.ToHQChartData=function(recvData)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;

        var aryData=[];
        var setDate=new Set();  //有重复数据 去掉
        var stock=recvData.stock[0];
        for(var i in stock.stockday)
        {
            var item=stock.stockday[i];
            if (item.announcement1)
            {
                var hqchartItem=this.ToHQChartItemData(item.announcement1, item.finance1, item);
                if (hqchartItem && !setDate.has(hqchartItem.Date)) 
                {
                    aryData.push(hqchartItem);
                    setDate.add(hqchartItem.Date);
                }
            }

            if (item.announcement2)
            {
                var hqchartItem=this.ToHQChartItemData(item.announcement2, item.finance2, item);
                if (hqchartItem && !setDate.has(hqchartItem.Date)) 
                {
                    aryData.push(hqchartItem);
                    setDate.add(hqchartItem.Date);
                }
            }

            if (item.announcement3)
            {
                var hqchartItem=this.ToHQChartItemData(item.announcement3, item.finance3, item);
                if (hqchartItem && !setDate.has(hqchartItem.Date)) 
                {
                    aryData.push(hqchartItem);
                    setDate.add(hqchartItem.Date);
                }
            }

            if (item.announcement4)
            {
                var hqchartItem=this.ToHQChartItemData(item.announcement4, item.finance4, item);
                if (hqchartItem && !setDate.has(hqchartItem.Date)) 
                {
                    aryData.push(hqchartItem);
                    setDate.add(hqchartItem.Date);
                }
            }
        }

        return aryData;
    }

    //{ Date：日期 , Value:数值 }
    this.ToHQChartItemData=function(announcement, finance, sourceItem)
    {
        var id=this.Args[0];
        var date=announcement.year*10000;
        var quarter=announcement.quarter;
        switch(quarter)
        {
            case 1:
                date+=331;
                break;
            case 2:
                date+=630;
                break;
            case 3:
                date+=930;
                break;
            case 4:
                date+=1231;
                break;
            default:
                return null;
        }

        var result={ Date:date, Value:0 };
        switch(id)
        {
            case 0:
                result.Value=date%1000000;  //0--返回报告期(YYMMDD格式),150930表示为2015年第三季
                break;
            case 1:
                result.Value=finance.persearning;
                break;
            case 3:
                result.Value=finance.peruprofit;
                break;
            case 4:
                result.Value=finance.pernetasset;
                break;
            case 5:
                result.Value=finance.percreserve;
                break;
            case 6:
                result.Value=finance.woewa;
                break;
            case 7:
                result.Value=finance.perccfo;
                break;
            case 8:
                result.Value=finance.monetaryfunds;
                break;
            case 11:
                result.Value=finance.areceivable;
                break;
        }

        return result;
    }

    this.GetFieldList=function()
    {
        var id=this.Args[0];
        switch(id)
        {
            case 0:
                return ["finance.date"];
            case 1: //persearning	每股收益
                return ["finance.persearning"];
            case 3: //peruprofit	每股未分配利润
                return ["finance.peruprofit"];
            case 4: //pernetasset	每股净资产
                return ["finance.pernetasset"];
            case 5: //percreserve	每股资本公积金
                return ["finance.percreserve"];
            case 6: //woewa	加权平均净资产收益
                return ["finance.woewa"];
            case 7: //perccfo	每股经营性现金流
                return ["finance.perccfo"];
            case 8: //monetaryfunds	货币资金
                return ["finance.monetaryfunds"];
            case 11: //areceivable	应收账款
                return ["finance.areceivable"];
            default:
                return null;
        }
    }
}

/////////////////////////////////////////////////////////
// 内置财务数据下载 某一期的数据
//
function DownloadFinOneData(obj)
{
    this.newMethod=DownloadFinValueData;   //派生
    this.newMethod(obj);
    delete this.newMethod;

    this.Download=function()
    {
        var self=this;
        var fieldList=this.GetFieldList();
        if (!fieldList)
        {
            message=`${this.Job.FunctionName}(${this.Args[0]}, ${this.Args[1]}, ${this.Args[2]}) can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey);
            return;
        }

        var aryCondition=[ {"item":["finance","doc","exists","true"] } ];

        var year=this.Args[1];
        var month=this.Args[2];
        var dataIndex=0;
        var dataEnd=3;
        var preYear=null;
        if (year==0 && month==0)    //如果Y和MMDD都为0,表示最新的财报;
        {

        }
        else if (year==0 && month<300)  //如果Y为0,MMDD为小于300的数字,表示最近一期向前推MMDD期的数据,如果是331,630,930,1231这些,表示最近一期的对应季报的数据;
        {
            dataIndex=month;
            dataEnd=200;
        }
        else if (month==0 && year<1000) //如果Y为0,MMDD为小于300的数字,表示最近一期向前推MMDD期的数据,如果是331,630,930,1231这些,表示最近一期的对应季报的数据;
        {
            preYear=year;
        }
        else if (year>1909)
        {
            if (month==331) 
            {
                aryCondition=
                [
                    {"item":["announcement1.year","int32","eq",year]},
                    {"item":["finance1","doc","exists","true"]}
                ];

                fieldList.push("announcement1.year");
                fieldList.push("announcement1.quarter");
            }
            else if (month==630)
            {
                aryCondition=
                [
                    {"item":["announcement2.year","int32","eq",year]},
                    {"item":["finance2","doc","exists","true"]}
                ];

                fieldList.push("announcement2.year");
                fieldList.push("announcement2.quarter");
            }
            else if (month==930)
            {
                aryCondition=
                [
                    {"item":["announcement3.year","int32","eq",year]},
                    {"item":["finance3","doc","exists","true"]}
                ];

                fieldList.push("announcement4.year");
                fieldList.push("announcement4.quarter");
            }
            else
            {
                aryCondition=
                [
                    {"item":["announcement4.year","int32","eq",year]},
                    {"item":["finance4","doc","exists","true"]}
                ];

                fieldList.push("announcement4.year");
                fieldList.push("announcement4.quarter");
            }
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.Url,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "condition":aryCondition,
                "start": 0,
                "end": dataEnd
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData);
                var result=null;
                if (data && data.length>0) 
                {
                    data.sort(function (a, b) { return (b.Date-a.Date) });
                    if (preYear==null)
                        result=data[dataIndex];   //返回一个数据
                    else 
                        result=self.GetPreYearData(data, preYear);
                }
                self.RecvCallback(result, self.Job, self.DataKey);
            }
        });
    }

    this.GetPreYearData=function(data, preYear)
    {
        //331,630,930,1231这些,表示最近一期的对应季报的数据;
        if (preYear==331 || preYear==630|| preYear==930 || preYear==1231)
        {
            for(var i in data)
            {
                var item=data[i];
                if (item.Date%10000==preYear) return item;
            }
        }
        else
        {   
            //如果MMDD为0,Y为一数字,表示最近一期向前推Y年的同期数据;
            var month=data[0].Date%1000;
            for(var i=1, j=0; i<data.length ;++i)
            {
                var item=data[i];
                if (item.Date%10000==month)
                {
                    ++j;
                    if (j==preYear) return item;
                }
            }

            return null;
        }
    }
}


function DownloadFinanceData(obj)
{
    this.Url=obj.Url;
    this.RealtimeUrl=obj.RealtimeUrl;
    this.Job=obj.Job;
    this.Symbol=obj.Symbol;
    this.Args=obj.Args;
    this.DataKey=obj.DataKey;
    this.RecvCallback=obj.Callback;
    this.ErrorCallback=obj.ErrorCallback;
    
    this.Download=function()
    {
        var id=this.Args[0];
        switch(id)
        {
            case 1: //FINANCE(1) 总股本(随时间可能有变化) 股
            case 7: //FINANCE(7) 流通股本(随时间可能有变化) 股
            case "EXCHANGE": //换手率
                this.DownloadHistoryData(id);
                break;
            case 3:
                this.GetSymbolType(id);
                break;

            case 9:     //FINANCE(9)  资产负债率
            case 18:    //FINANCE(18)  每股公积金
            case 30:    //FINANCE(30)  净利润
            case 32:    //FINANCE(32)  每股未分配利润
            case 33:    //FINANCE(33)  每股收益(折算为全年收益),对于沪深品种有效
            case 34:    //FINANCE(34)  每股净资产
            case 38:    //FINANCE(38)  每股收益(最近一期季报)
            case 40:    //FINANCE(40)  流通市值 
            case 41:    //FINANCE(41)  总市值
            case 42:    //FINANCE(42)  上市的天数
            case 43:    //FINANCE(43)  利润同比

            case "CAPITAL":
            case "TOTALCAPITAL":

            //定制
            case 100:   //股东人数
                this.DownloadRealtimeData(id);
                break;
            
            default:
                this.DownloadRealtimeData(id);
                break;
        }
    }

    //FINANCE(3) 沪深品种类型
    //0:指数,1:A股主板,2:中小板,3:创业板,4:科创板,5:B股,6:债券,7:基金,8:权证,9:其它,10:非沪深品种
    this.GetSymbolType=function(id)
    {
        var value=1;
        if (MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol)) value=0;
        var data={ Date:null, Value:value };
        this.RecvCallback(data,this.Job, this.DataKey);
    }

    //最新一期数据
    this.DownloadRealtimeData=function(id)
    {
        var self=this;
        var fieldList=this.GetFieldList();
        if (!fieldList)
        {
            if (this.Job.FunctionName2) message=`${this.Job.FunctionName2} can't support.`;
            else if (this.Job.FunctionName) message=`${this.Job.FunctionName}(${this.Args[0]}) can't support.`;
            else message=`${this.Args[0]} can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey);
            return;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.RealtimeUrl,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "condition":[ ] ,
                "start": 0,
                "end": 10
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.RealtimeDataToHQChartData(recvData);
                self.RecvCallback(data, self.Job, self.DataKey);
            }
        });
    }

    //历史数据
    this.DownloadHistoryData=function(id)
    {
        var self=this;
        var fieldList=this.GetFieldList();
        if (!fieldList)
        {
            message=`${this.Job.FunctionName}(${this.Args[0]}) can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey);
            return;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.Url,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "condition":[ ] ,
                "start": 0,
                "end": 200
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData);
                if (data) //排序
                    data.sort(function (a, b) { return (a.Date - b.Date) });

                self.RecvCallback(data, self.Job, self.DataKey);
            }
        });
    }

    this.GetFieldList=function()
    {
        var id=this.Args[0];
        switch(id)
        {
            case 1:
                return ["capital.total", "capital.date"];
            case 7:
                return ["capital.a", "capital.date"];
            case "EXCHANGE":
                return ["capital.a", "capital.date"];

            case 9:
                return ["finance.peruprofit","symbol","date"];
            case 18:
                return ["finance.percreserve","symbol","date"];
            case 30:
                return ["finance.nprofit","symbol","date"];
            case 32:
                return ["finance.peruprofit","symbol","date"];
            case 33:
                return ["finance.persearning","symbol","date"];
            case 34:
                return ["finance.pernetasset","symbol","date"];
            case 38:
                return ["finance.persearning","symbol","date"];
            case 40:
                return ["capital.a", "capital.date","symbol","date", "price"];
            case 41:
                return ["capital.total", "capital.date","symbol","date","price"];
            case "CAPITAL":
                return ["capital.a", "capital.date","symbol","date"];
            case "TOTALCAPITAL":
                return ["capital.total", "capital.date","symbol","date"];
            case 42:
                return ["company.releasedate","symbol","date"];
            case 43:
                return ["dividendyield","symbol","date"];
            case 100:
                return ["shareholder","symbol","date"]
            default:
                return null;
        }
    }

    //最新报告期数据
    this.RealtimeDataToHQChartData=function(recvData,id)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;
        var stock=recvData.stock[0];
        var id=this.Args[0];
        var date=stock.date;
        switch(id)
        {
            case 9:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.peruprofit };
            case 18:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.percreserve };
            case 30:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.nprofit };
            case 32:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.peruprofit };
            case 33:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.persearning };
            case 34:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.pernetasset };
            case 38:
                if (!stock.finance) return null;
                return { Date:date, Value:stock.finance.persearning };
            case 40:    //FINANCE(40)  流通市值
                if (!stock.capital) return null;
                return { Date:date, Value:stock.capital.a*stock.price };    //流通股*最新价格
            case 41:   //FINANCE(41)  总市值 
                if (!stock.capital) return null;
                return { Date:date, Value:stock.capital.total*stock.price };    //总股本*最新价格
            case 42:    //FINANCE(42)  上市的天数
                if (!stock.company) return null;
                {
                    var releaseDate=stock.company.releasedate;
                    var year=parseInt(releaseDate/10000);
                    var month=parseInt((releaseDate%10000)/100);
                    var day=releaseDate%100;
                    var firstDate=new Date(year, month-1, day);
                    var nowDate=new Date();
                    var days=parseInt((nowDate.getTime()-firstDate.getTime())/(1000 * 60 * 60 * 24));
                    return { Date:date, Value:days+1 };
                }
            case 43:
                if (!stock.dividendyield) return null;
                return { Date:date, Value:stock.dividendyield.quarter4 };
            case 100:
                if (!stock.shareholder) return null;
                return { Date:date, Value:stock.shareholder.count };
            case "CAPITAL": 
                if (!stock.capital) return null;
                return { Date:date, Value:stock.capital.a/100 };    //当前流通股本 手
            case "TOTALCAPITAL":
                if (!stock.capital) return null;
                return { Date:date, Value:stock.capital.total/100 };    //当前流通股本 手    
        }
    }

    //历史数据转
    this.ToHQChartData=function(recvData)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;

        var aryData=[];
        var setDate=new Set();  //有重复数据 去掉
        var stock=recvData.stock[0];
        var id=this.Args[0];
        for(var i in stock.stockday)
        {
            var item=stock.stockday[i];

            var hqchartItem=this.ToHQChartItemData(item,id);
            if (hqchartItem && !setDate.has(hqchartItem.Date)) 
            {
                aryData.push(hqchartItem);
                setDate.add(hqchartItem.Date);
            }
        }

        return aryData;
    }

    this.ToHQChartItemData=function(item, id)
    {
        if (!item) return null;
        var date=item.date;
        switch(id)
        {
            case 1:
                if (!item.capital) return null;
                return { Date:date, Value:item.capital.total };
            case 7:
            case "EXCHANGE":    //换手率 历史流通股本
                if (!item.capital) return null;
                return { Date:date, Value:item.capital.a };
               
            default:
                return null;
        }
    }
}

function DownloadGPJYValue(obj)
{
    this.Url=obj.Url;
    this.RealtimeUrl=obj.RealtimeUrl;
    this.Job=obj.Job;
    this.Symbol=obj.Symbol;
    this.Args=obj.Args;
    this.DataKey=obj.DataKey;
    this.RecvCallback=obj.Callback;
    this.ErrorCallback=obj.ErrorCallback;

    this.Download=function()
    {
        var self=this;
        var fieldList=this.GetFieldList();
        if (!fieldList)
        {
            message=`${this.Job.FunctionName}(${this.Args[0]}, ${this.Args[1]}, ${this.Args[2]}) can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey, true);
            return;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.Url,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
                "orderfield":"date",             
                "order":-1,   
                "start":0,
                "end":5
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData);
                if (data && data.length>0) 
                {
                    data.sort(function (a, b) { return (a.Date-b.Date) });
                }
                self.RecvCallback(data, self.Job, self.DataKey);
            }
        });
    }

    this.GetFieldList=function()
    {
        var id=this.Args[0];
        switch(id)
        {
            case 1: //1--股东人数 股东户数(户)           
                return ["shareholder", "date", "symbol"];
            case 2: //2--龙虎榜   买入总计(万元) 卖出总计(万元)
                return ["tradedetail.buy","tradedetail.sell", "date", "symbol"];
            case 3: //3--融资融券1 融资余额(万元) 融券余量(股)
                return ["margin","date", "symbol"];
            case 4: //4--大宗交易 成交均价(元) 成交额(万元)
                return ["blocktrading.amount","blocktrading.price","date", "symbol"]
            default:
                return null;
        }
    }

    this.ToHQChartData=function(recvData)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;

        var aryData=[];
        var setDate=new Set();  //有重复数据 去掉
        var stock=recvData.stock[0];
        var id=this.Args[0];
        var subID=this.Args[1];
        for(var i in stock.stockday)
        {
            var item=stock.stockday[i];

            var hqchartItem=this.ToHQChartItemData(item,id,subID);
            if (hqchartItem && !setDate.has(hqchartItem.Date)) 
            {
                aryData.push(hqchartItem);
                setDate.add(hqchartItem.Date);
            }
        }

        return aryData;
    }

    this.ToHQChartItemData=function(item, id, subID)
    {
        if (!item) return null;
        var date=item.date;
        switch(id)
        {
            case 1:
                if (!item.shareholder) return null;
                return { Date:date, Value:item.shareholder.count };
            case 2:
                if (!item.tradedetail && item.tradedetail[0]) return null;
                if (subID==0)
                    return { Date:date, Value:item.tradedetail[0].buy };
                else 
                    return { Date:date, Value:item.tradedetail[0].sell };
            case 3:
                if (!item.margin) return null;
                if (subID==0)
                {
                    if (item.margin.buy)
                        return { Date:date, Value:item.margin.buy.balance };
                }
                else
                {
                    if (item.margin.sell)
                        return { Date:date, Value:item.margin.sell.balance };
                }
                return null;
            case 4:
                if (!item.blocktrading) return null;
                if (subID==0)
                    return { Date:date, Value:item.blocktrading.price };
                else
                    return { Date:date, Value:item.blocktrading.amount };
            default:
                return null;
        }
    }
}



/*
引用市场总的交易类数据.如果指标支持云数据函数,则不需要[专业财务数据]下载.
SCJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理

市场交易类数据函数，数据编号如下:
1--融资融券       沪深融资余额(万元) 沪深融券余额(万元)
2--陆股通资金流入 沪股通流入金额(亿元) 深股通流入金额(亿元)
3--沪深涨停股个数 涨停股个数  曾涨停股个数 [注：该指标展示20160926日之后的数据]
4--沪深跌停股个数 跌停股个数  曾跌停股个数
5--上证50股指期货  净持仓(手)[注：该指标展示20171009日之后的数据]
6--沪深300股指期货 净持仓(手) [注：该指标展示20171009日之后的数据]
7--中证500股指期货 净持仓(手) [注：该指标展示20171009日之后的数据]
8--ETF基金规模数据 ETF基金规模(亿) ETF净申赎(亿)
9--每周新增投资者 新增投资者(万户)
10--增减持统计    增持额(万元)  减持额(万元)[注：部分公司公告滞后,造成每天查看的数据可能会不一样] 
11--大宗交易      溢价的大宗交易额(万元) 折价的大宗交易额(万元)
12--限售解禁      限售解禁计划额(亿元)  限售解禁股份实际上市金额(亿元)[注：该指标展示201802月之后的数据;部分股票的解禁日期延后，造成不同日期提取的某天的计划额可能不同]
13--分红          市场总分红额(亿元)[注：除权派息日的A股市场总分红额] 
14--募资          市场总募资额(亿元)[注：发行日期/除权日期的首发、配股和增发的总募资额] 
15--打板资金    封板成功资金(亿元) 封板失败资金(亿元) [注：该指标展示20160926日之后的数据]
*/
function DownloadSCJYValue(obj)
{
    this.Url=obj.Url;
    //this.RealtimeUrl=obj.RealtimeUrl;
    this.Job=obj.Job;
    this.Symbol=obj.Symbol;
    this.Args=obj.Args;
    this.DataKey=obj.DataKey;
    this.RecvCallback=obj.Callback;
    this.ErrorCallback=obj.ErrorCallback;
    
    this.Download=function()
    {
        var self=this;
        var query=this.GetQueryCondtion();
        if (!query)
        {
            message=`${this.Job.FunctionName}(${this.Args[0]}, ${this.Args[1]}, ${this.Args[2]}) can't support.`;
            this.ErrorCallback(message);
            self.RecvCallback(null, self.Job, self.DataKey, true);
            return;
        }

        //请求数据
        JSNetwork.HttpRequest({
            url: this.Url,
            data:
            {
                "field": query.Field,
                "symbol": query.Symbol,
                "condition":query.Cond ,
                "start": 0,
                "end": 2000
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData);
                if (data) //排序
                    data.sort(function (a, b) { return (a.Date - b.Date) });

                self.RecvCallback(data, self.Job, self.DataKey);
            }
        });

    }

    this.GetQueryCondtion=function()
    {
        var day=new Date();
        var endDate=day.getFullYear()*10000+(day.getMonth()+1)*100+day.getDate();
        day.setDate(day.getDate()-100); //取最近1000条数据
        var startDate=day.getFullYear()*10000+(day.getMonth()+1)*100+day.getDate()
        var id=this.Args[0];
        switch(id)
        {
            case 1:
                var data=
                {
                    Symbol:["CNA.ci"],
                    Field:["margin"], 
                    Cond:
                    [
                        {"item":["date","int32","gte",startDate.toString(),"lte",endDate.toString()]}, 
                        {"item":["margin","doc","exists","true"]}
                    ]
                }
                return data;
        }
    }

    this.ToHQChartData=function(recvData)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;

        var aryData=[];
        var setDate=new Set();  //有重复数据 去掉
        var stock=recvData.stock[0];
        var id=this.Args[0];
        var subID=this.Args[1];
        for(var i in stock.stockday)
        {
            var item=stock.stockday[i];

            var hqchartItem=this.ToHQChartItemData(item,id,subID);
            if (hqchartItem && !setDate.has(hqchartItem.Date)) 
            {
                aryData.push(hqchartItem);
                setDate.add(hqchartItem.Date);
            }
        }

        return aryData;
    }

    this.ToHQChartItemData=function(item, id, subID)
    {
        if (!item) return null;
        var date=item.date;
        var subItem=null;
        switch(id)
        {
            case 1:
                if (!item.margin) return null;
                subItem=item.margin;
                if (subID==1)
                {
                    if (!subItem.buy || !IFrameSplitOperator.IsNumber(subItem.buy.balance)) return null;
                    return { Date:date, Value:subItem.buy.balance }
                }
                else
                {
                    if (!IFrameSplitOperator.IsNumber(subItem.sell.balance)) return null;
                    return { Date:date, Value:subItem.sell.balance }
                }
                
            default:
                return null;
        }
    }
}

function DownloadGroupData(obj)
{
    this.Url=obj.Url;
    this.RealtimeUrl=obj.RealtimeUrl;
    this.Job=obj.Job;
    this.Symbol=obj.Symbol;
    this.Args=obj.Args;
    this.DataKey=obj.DataKey;
    this.RecvCallback=obj.Callback;
    this.ErrorCallback=obj.ErrorCallback;

    this.Download=function()
    {
        var varName=this.Args[0];
        switch(varName)
        {
            case "HYBLOCK":
            case "DYBLOCK":
            case "GNBLOCK":
                this.DownloadGroupName(varName);
                break;
        }
    }

    this.DownloadGroupName=function(blockType)
    {
        var self=this;
        var field=["name","symbol"];
        if (blockType=="HYBLOCK") field.push("industry");
        else if (blockType=="DYBLOCK") field.push("region");
        else if (blockType=="GNBLOCK") field.push("concept");

        JSNetwork.HttpRequest({
            url: self.RealtimeUrl,
            data:
            {
                "field": field,
                "symbol": [this.Symbol]
            },
            type:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                var data=self.RecvGroupName(recvData);
                self.RecvCallback(data, self.Job, self.DataKey, 1);
            },
            error: function(request)
            {
                self.ErrorCallback(request);
            }
        });
    }

    this.RecvGroupName=function(recvData)
    {
        if (!recvData.stock || recvData.stock.length!=1) return null;
        var stock=recvData.stock[0];
        var varName=this.Args[0];
        var value=null;
        if (varName=="HYBLOCK")
        {
            var industry=stock.industry;
            if (!industry) return null;
            var value;
            for(var i in industry)
            {
                var item=industry[i];
                value=item.name;
            }
        }
        else if (varName=="DYBLOCK")
        {
            var region=stock.region;
            if (!region) return null;
            for(var i in region)
            {
                var item=region[i];
                value=item.name;
            }
        }
        else if (varName=="GNBLOCK")
        {
            var concept=stock.concept;
            if (!concept) return null;
            value="";
            for(var i in concept)
            {
                var item=concept[i];
                if (value.length>0) value+=' ';
                value+=item.name;
            }
            
        }

        return { Value:value };
    }
}

/* 测试例子
var code1='VARHIGH:IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;';
var code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);';
var code3='mm1=1-2*-9+20;';

JSConsole.Complier.Log(code1+code2)
var tokens=JSComplier.Tokenize(code1+code2);
var ast=JSComplier.Parse(code2+code1);

JSConsole.Complier.Log(ast);
*/

//外部通达信的变量 这些需要外部自己计算
JSComplier.AddVariant({ Name:'DHIGH',   Description:'不定周期最高价' } );
JSComplier.AddVariant({ Name:'DOPEN',   Description:'不定周期开盘价' } );
JSComplier.AddVariant({ Name:'DLOW',    Description:'不定周期最低价' } );
JSComplier.AddVariant({ Name:'DCLOSE',  Description:'不定周期收盘价' } );
JSComplier.AddVariant({ Name:'DVOL',    Description:'不定周期成交量价' } );






