/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    分析家语法编译器
*/

//日志
import { JSConsole } from "./umychart.console.wechat.js"
import { JSCommonData } from "./umychart.data.wechat.js";     //行情数据结构体 及涉及到的行情算法(复权,周期等)  
import { JSNetwork } from "./umychart.network.wechart.js"
//配色资源
import {
    g_JSChartResource,
    JSCHART_LANGUAGE_ID,
    g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import 
{ 
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

import
{
    JSIndexScript,
} from './umychart.index.data.wechat.js'

import {
    HQ_DATA_TYPE,
    ChartData,  HistoryData,
    SingleData, MinuteData,
} from "./umychart.data.wechat.js";

import 
{ 
    g_MinuteCoordinateData,
    MARKET_SUFFIX_NAME ,
} from "./umychart.coordinatedata.wechat.js";

var g_JSComplierResource=
{
    Domain : "http://127.0.0.1:8080",               //API域名
    CacheDomain : "http://127.0.0.1:8087",     //缓存域名

    CustomFunction: //定制函数
    {
        Data:new Map()  //自定义函数 key=函数名, Value:{ID:函数名, Callback: }
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

    CustomVariant:  //自定义变量
    {
        Data:new Map()  //自定义函数 key=变量名, Value:{ Name:变量名, Description:描述信息 }
    },

    IsCustomFunction:function(name)
    {
        if (g_JSComplierResource.CustomFunction.Data.has(name)) return true;
        return false;
    },

    IsCustomDataFunction:function(name)
    {
        if (g_JSComplierResource.CustomDataFunction.Data.has(name)) return true;
        return false;
    },

    IsCustomVariant:function(name)
    {
        if (g_JSComplierResource.CustomVariant.Data.has(name)) return true;
        return false;
    },

    GetDrawTextIcon:function(id)
    {
        //图标对应的字符代码
        let mapIcon=new Map(
        [
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

    this.CreateError=function(index, line, col, description)
    {
        let msg='Line ' + line + ': ' + description;
        let error=this.ConstructError(msg,col);
        error.Index=index;
        error.LineNumber=line;
        error.Description=description;
        return error;
    }

    this.ThrowError=function(index, line, col, description)
    {
        let error=this.CreateError(index,line,col,description);
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
                    if (str === '&&' || str === '||' || str === '==' || str === '!=' || str === '<>' || str === '<=' || str === '>=' || str === '=>' || str==':=' || str=='OR')
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
            else if (ch == 0x7B)      //{ }  注释
            {
                this.Index += 1;
                let comment = this.SkipMultiLineComment();
            }
            else 
            {
                break;
            }
        }

        return comments;
    }

    this.SkipMultiLineComment = function () 
    {
        var comments = [];
        while (!this.IsEOF()) 
        {
            var ch = this.Source.charCodeAt(this.Index);
            if (Character.IsLineTerminator(ch)) 
            {
                ++this.LineNumber;
                ++this.Index;
                this.LineStart = this.Index;
            }
            else if (ch == 0x7D) 
            {
                this.Index += 1;
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

    this.ThrowUnecpectedToken=function(message)
    {
        if (!message) message = Messages.UnexpectedTokenIllegal;
	    return this.ErrorHandler.ThrowError(this.Index, this.LineNumber, this.Index - this.LineStart + 1, message);
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


function Node()
{
    this.IsNeedIndexData=false;         //是否需要大盘数据
    this.IsNeedLatestData=false;        //是否需要最新的个股行情数据
    this.IsNeedSymbolData=false;        //是否需要下载股票数据
    this.IsNeedMarginData = new Set();
    this.IsNeedNewsAnalysisData = new Set();      //新闻统计数据
    this.IsNeedBlockIncreaseData = new Set();     //是否需要市场涨跌股票数据统计
    this.IsNeedSymbolExData = new Set();          //下载股票行情的其他数据

    this.FunctionData=[];   //{ID:,  Args:,  FunctionName: } FINVALUE(ID),FINONE(ID,Y,MMDD), FINANCE(ID)
    this.Dynainfo=[];       //{ID:,  Args:,  FunctionName: }  DYNAINFO()

    this.IsAPIData = []       //加载API数据

    this.ExecuteIndex=[];       //执行调用指标
    this.OtherSymbolData=[];    //其他股票数据 key=股票代码(小写)
    this.PeriodSymbolData=[];   //跨周期数据 { Period:, VarName: }
    this.ErrorHandler=ErrorHandler;

    this.GetDataJobList=function()  //下载数据任务列表
    {
        let jobs=[];
        if (this.IsNeedSymbolData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA});
        if (this.IsNeedIndexData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA});

        //最新的个股行情数据
        for(var i=0;i<this.Dynainfo.length;++i)
        {
            var item=this.Dynainfo[i];
            jobs.push(item);
        }

        //涨跌停家数统计
        for (var blockSymbol of this.IsNeedBlockIncreaseData) 
        {
            jobs.push({ ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA, Symbol: blockSymbol });
        }

        //加载融资融券
        for (var jobID of this.IsNeedMarginData) 
        {
            jobs.push({ID:jobID});
        }

        //加载新闻统计
        for (var jobID of this.IsNeedNewsAnalysisData) 
        {
            jobs.push({ID:jobID});
        }

        for (var i in this.IsAPIData) 
        {
            var item = this.IsAPIData[i];
            jobs.push(item);
        }

        for(var i in this.ExecuteIndex)
        {
            var item=this.ExecuteIndex[i];
            jobs.push(item);
        }

        //行情其他数据
        for (var jobID of this.IsNeedSymbolExData) 
        {
            jobs.push({ ID:jobID });
        }

        for(var i in this.FunctionData)
        {
            var item=this.FunctionData[i];
            jobs.push(item);
        }

        for(var i in this.OtherSymbolData)
        {
            var item=this.OtherSymbolData[i];
            jobs.push(item);
        }

        return jobs;
    }

    this.VerifySymbolVariable = function (varName, token)
    {
        let setIndexName = new Set(['INDEXA', 'INDEXC', 'INDEXH', 'INDEXL', "INDEXO", "INDEXV", 'INDEXDEC', 'INDEXADV']);
        if (setIndexName.has(varName)) 
        {
            this.IsNeedIndexData=true;
            return;
        }

        let setSymbolDataName=new Set(['CLOSE','C','VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT']);
        if (setSymbolDataName.has(varName)) 
        {
            this.IsNeedSymbolData=true;
            return;
        }

        if (varName === 'VOLR') 
        {
            if (!this.IsNeedSymbolExData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA))
                this.IsNeedSymbolExData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA);
            return;
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

        if (g_JSComplierResource.IsCustomVariant(varName)) //自定义函数
        {
            var item={ VariantName:varName, ID:JS_EXECUTE_JOB_ID.JOB_CUSTOM_VARIANT_DATA };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.FunctionData.push(item);
            return;
        }
    }

    this.VerifySymbolFunction = function (callee, args, token)
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

        if (callee.Name === 'MARGIN') 
        {
            let jobID = JS_EXECUTE_JOB_ID.GetMarginJobID(args[0].Value);
            if (jobID && !this.IsNeedMarginData.has(jobID)) this.IsNeedMarginData.add(jobID);
            return;
        }

        if (callee.Name === 'NEWS') 
        {
            let jobID = JS_EXECUTE_JOB_ID.GetNewsAnalysisID(args[0].Value);
            if (jobID && !this.IsNeedNewsAnalysisData.has(jobID)) this.IsNeedNewsAnalysisData.add(jobID);
            return;
        }

        if (callee.Name == 'COST' || callee.Name == 'WINNER' || callee.Name=='PWINNER')   //筹码都需要换手率
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

        if (callee.Name === 'BETA')    //beta需要下载上证指数
        {
            this.IsNeedIndexData = true;
            return;
        }

        if (callee.Name == 'UPCOUNT' || callee.Name == 'DOWNCOUNT')    //上涨下跌个数
        {
            var blockSymbol = args[0].Value;
            if (!this.IsNeedBlockIncreaseData.has(blockSymbol)) this.IsNeedBlockIncreaseData.add(blockSymbol);
            return;
        }

        if (callee.Name=='STKINDI' || callee.Name=='CALCSTOCKINDEX') //指标调用
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX, Args:args,  FunctionName:callee.Name };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.ExecuteIndex.push(item);
            return;
        }

        if (callee.Type==Syntax.Literal)    //指标调用 "MA.MA1"(10,5,5)"
        {
            var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX, Args:args,  FunctionName:callee.Value, DynamicName:callee.Value };
            if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
            this.ExecuteIndex.push(item);
            return;
        }

        if (callee.Name == "LOADAPIDATA") //加载API数据
        {
            var item = { Name: callee.Name, ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA, Args: args };
            if (token) item.Token = { Index: token.Start, Line: token.LineNumber };

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

    this.Identifier = function (name, token)
    {
        this.VerifySymbolVariable(name, token);

        return { Type:Syntax.Identifier, Name:name};
    }

    this.AssignmentExpression=function (operator, left, right) 
    {
        return { Type:Syntax.AssignmentExpression, Operator:operator, Left:left, Right:right };
    }

    //成员变量, 不需要检测
    this.MemberIdentifier=function(name, token)
    {
        return { Type:Syntax.Identifier, Name:name};
    }

    this.UnaryExpression=function(operator, argument) 
    {
        return { Type:Syntax.UnaryExpression, Operator:operator, Argument:argument, Prefix:true };
    }

    this.EmptyStatement=function() 
    {
        return { Type:Syntax.EmptyStatement };
    }

    this.CallExpression = function (callee, args, token) 
    {
        this.VerifySymbolFunction(callee, args, token);

        return { Type:Syntax.CallExpression, Callee:callee, Arguments:args };
    }

    this.StaticMemberExpression = function (object, property,token) 
    {
        this.VerifyMemberVariable(object,property, token);
        return { Type: Syntax.MemberExpression, Computed: false, Object: object, Property: property };
    }

    this.VerifyMemberVariable=function(object,property,token)
    {
        var item={ ID:JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX,  Member:{Object:object, Property:property} };
        if (token) item.Token={ Index:token.Start, Line:token.LineNumber };
        this.ExecuteIndex.push(item);
        return;
    }
}



function JSParser(code)
{
    this.ErrorHandler=new ErrorHandler();
    this.Scanner=new Scanner(code, this.ErrorHandler);
    this.Node=new Node();   //节点创建

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
        '=': 6,
        '==': 6,
        '!=': 6,
        '<>': 6,
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

    this.Expect=function(value)
    {
        let token=this.NextToken();
        if (token.Type!=7 /*Punctuator*/ || token.Value!=value)
            this.ThrowUnexpectedToken(token);
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
                expr = this.Finalize(this.StartNode(startToken), this.Node.CallExpression(expr, args, startToken));
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
    this.IsIdentifierName = function (token) 
    {
        return token.Type === 3 //Identifier 
            || token.Type === 4 //Keyword 
            || token.Type === 1 //BooleanLiteral 
            || token.Type === 5;//NullLiteral;
    }

    this.ParseIdentifierName = function () 
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
        this.Expect(',');
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
                token = this.NextToken();
                expr = this.Finalize(node, this.Node.Identifier(token.Value, token));
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
function JSAlgorithm(errorHandler, symbolData)
{
    this.ErrorHandler=errorHandler;
    this.SymbolData = symbolData; //股票数据

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
                    if ( this.IsNumber(data[i]) && this.IsNumber(data2[i]) ) result[i]=data[i]-data2[i];
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

                    result[i]=(data[i]>data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;
                result[i]=(data>data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data[i])) continue;
                if (!IFrameSplitOperator.IsVaild(data2)) continue;
                result[i]=(data[i]>data2 ? 1 : 0);
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

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;
                result[i]=(data>=data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
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

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data<data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
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

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!IFrameSplitOperator.IsVaild(data)) continue;
                if (!IFrameSplitOperator.IsVaild(data2[i])) continue;
                result[i]=(data<=data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
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

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data==data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
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
    this.NEQ = function (data, data2) 
    {
        let isNumber=IFrameSplitOperator.IsNumber(data);
        let isNumber2=IFrameSplitOperator.IsNumber(data2);

        //单数值比较
        if (isNumber && isNumber2) return (data != data2 ? 1 : 0);

        //都是数组比较
        let result = [];
        if (Array.isArray(data) && Array.isArray(data2))
        {
            let count = Math.max(data.length, data2.length);
            for (let i = 0; i < count; ++i) 
            {
                result[i] = null; //初始化

                if (i < data.length && i < data2.length) 
                {
                    if (!isNaN(data[i]) && !isNaN(data2[i])) result[i] = (data[i] != data2[i] ? 1 : 0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for (let i in data2) 
            {
                result[i] = null;
                if (!isNaN(data) && !isNaN(data2[i])) result[i] = (data != data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for (let i in data) 
            {
                result[i] = null;
                if (!isNaN(data[i]) && !isNaN(data2)) result[i] = (data[i] != data2 ? 1 : 0);
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
    
                for(let i=0;i<n;++i)
                    result.unshift(null);
            }
        }
        else    //n 为数组的情况
        {
            for(let i=0;i<data.length;++i)
            {
                result[i]=null;
                if (i>=n.length) continue;
                var value=n[i];
                if (value>0 && value<=i) result[i]=data[i-value];
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
            if (n>=data.length) return result;

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
            dayCount=parseInt(dayCount);
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
            dayCount=parseInt(dayCount);
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

    this.XMA = function (data, n) 
    {
        var result = [];
        var offset = 0;
        for (; offset < data.length; ++offset) 
        {
            if (this.IsNumber(data[offset])) break;
        }

        var p = parseInt((n - 2) / 2);
        var sum = 0;
        var count = 0, start = 0, end = 0;

        for (var i = offset, j=0; i < data.length; ++i) 
        {
            start = i - p - 1;
            end = i + (n - p) - 1;
            for (j = start; j < end; ++j) 
            {
                if (j >= 0 && j < data.length) 
                {
                    if (this.IsNumber(data[j])) 
                    {
                        sum += data[j];
                        ++count;
                    }
                }
            }

            if (count != 0) result[i] = (sum / count);
            else result[i] = null;

            sum = 0;
            count = 0;
        }

        return result;
    }

    /* 
        SMA 移动平均
        返回移动平均。
        用法：　SMA(X，N，M)　X的M日移动平均，M为权重，如Y=(X*M+Y'*(N-M))/N 
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
                if (data[index]<1)
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
    this.WMA = function (data, dayCount) 
    {
        let result = [];
        if (!data || !data.length) return result;
        if (dayCount < 1) dayCount = 1;
        var i = 0;
        for (i = 0; i < data.length && !this.IsNumber(data[i]); ++i) 
        {
            result[i] = null;
        }
        var data = data.slice(0);
        for (var days = 0; i < data.length; ++i, ++days) 
        {
            if (days < dayCount - 1) 
            {
                result[i] = null;
                continue;
            }
            var preValue = data[i - (dayCount - 1)];
            var sum = 0;
            var count = 0;
            for (var j = dayCount - 1; j >= 0; --j) 
            {
                var value = data[i - j];
                if (!this.IsNumber(value)) 
                {
                    value = preValue;
                    data[i - j] = value;
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

    /*
    返回平滑移动平均
    用法:MEMA(X,N):X的N日平滑移动平均,如Y=(X+Y'*(N-1))/N
    MEMA(X,N)相当于SMA(X,N,1)
    */
    this.MEMA = function (data, dayCount) 
    {
        let result = [];
        if (!data || !data.length) return result;
        var i = 0, j = 0;
        for (j = 0; j < data.length && !this.IsNumber(data[j]); ++j) 
        {
            result[j] = null;
        }
        i = j;
        if (dayCount < 1 || i + dayCount >= data.length) return result;
        var sum = 0;
        var data = data.slice(0);
        for (; i < j + dayCount; ++i) 
        {
            result[i] = null;
            if (!this.IsNumber(data[i]) && i - 1 >= 0)
                data[i] = data[i - 1];
            sum += data[i];
        }
        result[i - 1] = sum / dayCount;
        for (; i < data.length; ++i) 
        {
            if (this.IsNumber(result[i - 1]) && this.IsNumber(data[i]))
                result[i] = (data[i] + result[i - 1] * (dayCount - 1)) / dayCount;
            else if (i - 1 > -1 && this.IsNumber(result[i - 1]))
                result[i] = result[i - 1];
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
    this.SUMBARS = function (data, data2) 
    {
        var result = [];
        if (!data || !data.length || !data2 || !data2.length) return result;
        var start = 0, i = 0, j = 0;
        for (; start < data.length && !this.IsNumber(data[start]); ++start) 
        {
            result[start] = null;
        }
        var total = 0;
        for (i = data.length - 1; i >= start; --i) 
        {
            for (j = i, total = 0; j >= start && total < data2[i]; --j)
                total += data[j];
            if (j < start) result[i] = null;
            else result[i] = i - j;
        }
        for (i = start + 1; i < data.length; ++i) 
        {
            if (result[i] == null)
                result[i] = result[i - 1];
        }
        return result;
    }

    /*
    求相反数.
    用法:REVERSE(X)返回-X.
    例如:REVERSE(CLOSE)返回-CLOSE
     */
    this.REVERSE = function (data) 
    {
        if (this.IsNumber(data))
        {
            return 0-data;
        }
        
        var result = [];
        var i = 0;
        for (; i < data.length && !this.IsNumber(data[i]); ++i) 
        {
            result[i] = null;
        }
        for (; i < data.length; ++i) 
        {
            if (!this.IsNumber(data[i]))
                result[i] = null;
            else
                result[i] = 0 - data[i];
        }
        return result;
    }

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
            var max = null;
            for (var i = 0, j = 0; i < data.length; ++i) 
            {
                result[i] = null;
                if (i >= n.length) continue;

                max = null;
                var count = n[i];
                if (count > 0 && count <= i) 
                {
                    for (j = i - count; j <= i; ++j) 
                    {
                        if (max == null || max < data[j]) max = data[j];
                    }
                }
                else 
                {
                    count = i;
                    for (j = 0; j <= i; ++j) 
                    {
                        if (max == null || max < data[j]) max = data[j];
                    }
                }

                result[i] = max;
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

            var nMax = nStart;
            if (nMax < data.length) result[nMax] = data[nMax];
            for (var i = nMax + 1, j = 2; i < data.length && j < n; ++i, ++j) 
            {
                if (data[i] >= data[nMax]) nMax = i;
                result[i] = data[nMax];
            }

            for (; i < data.length; ++i) 
            {
                if (i - nMax < n) 
                {
                    nMax = data[i] < data[nMax] ? nMax : i;
                }
                else 
                {
                    for (j = nMax = (i - n + 1); j <= i; ++j) 
                    {
                        nMax = data[j] < data[nMax] ? nMax : j;
                    }
                }

                result[i] = data[nMax];
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
            for (var i = 0; i < data.length; ++i) 
            {
                result[i] = null;
                if (i >= n.length) continue;

                var min = null;
                var count = n[i];
                if (count > 0 && count <= i) 
                {
                    for (var j = i - count; j <= i; ++j) 
                    {
                        if (min == null || min > data[j]) min = data[j];
                    }
                }
                else 
                {
                    count = i;
                    for (var j = 0; j <= i; ++j) 
                    {
                        if (min == null || min > data[j]) min = data[j];
                    }
                }

                result[i] = min;
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
        var result = [];
        if (Array.isArray(data) && Array.isArray(data2)) 
        {
            if (data.length != data2.length) return result = [];

            var index = 0;
            for (; index < data.length; ++index) 
            {
                if (this.IsNumber(data[index]) && this.IsNumber(data2[index]))
                    break;
            }

            for (++index; index < data.length; ++index) 
            {
                result[index] = (data[index] > data2[index] && data[index - 1] < data2[index - 1]) ? 1 : 0;
            }
        }
        else if (Array.isArray(data) && typeof (data2) == 'number') 
        {
            var index = 0;
            for (; index < data.length; ++index) 
            {
                if (this.IsNumber(data[index])) break;
            }

            for (++index; index < data.length; ++index) 
            {
                result[index] = (data[index] > data2 && data[index - 1] < data2) ? 1 : 0;
            }
        }
        else if (typeof (data) == 'number' && Array.isArray(data2)) 
        {
            var index = 0;
            for (; index < data2.length; ++index) 
            {
                if (this.IsNumber(data2[index])) break;
            }

            for (++index; index < data2.length; ++index) 
            {
                result[index] = (data2[index] < data && data2[index - 1] > data) ? 1 : 0;
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

    //累乘
    this.MULAR=function(data,n)
    {
        var result=[];
        if(data.length<n) return result;

        var index=n;
        for(;index<data.length;++index)
        {
            if (data[index]!=null && !isNaN(data[index]))
            {
                result[index]=data[index];
                break;
            }
        }

        for(++index;index<data.length;++index)
        {
            result[index]=result[index-1]*data[index];
        }

        return result;
    }

    this.SUM=function(data,n)
    {
        var result=[];

        if (!Array.isArray(n))
        { 
            if (n==0)
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
                if (!this.IsNumber(data[i])) contnue;

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
            for (j = 0, x = num; j < num && j <= i; ++j,--x)
           {
               Ex +=x;
               Ey += data[i - j];
           }
           Ex /= num;
           Ey /= num;
            for (j = 0, x = num; j < num && j <= i; ++j, --x)
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
        for (i = 0; i < datanum && !this.IsNumber(data[i]); ++i)
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

    this.EXIST=function(data,n)
    {
        n=parseInt(n);

        if (typeof(data)=='number') return 0;

        var latestID; //最新满足条件的数据索引
        var result=[];
        var value;
        for(let i=0;i<data.length;++i)
        {
            result[i]=null;
            value=data[i];
            if (this.IsNumber(value) && value>0) latestID==i;

            if (i-latestID<n) result[i]=1;
            else result[i]=0;
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
    this.FILTER = function (data, n) 
    {
        var result = [];
        for (let i = 0, j = 0; i < data.length; ++i) 
        {
            if (data[i]) 
            {
                result[i] = 1;
                for (j = 0; j < n && j + i + 1 < data.length; ++j) 
                {
                    result[j + i + 1] = 0;
                }
                i += n;
            }
            else 
            {
                result[i] = 0;
            }
        }

        return result;
    }

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

    /*
    N周期内第一个条件成立到当前的周期数.
    用法:
    BARSSINCEN(X,N):N周期内第一次X不为0到现在的天数,N为常量
    例如:
    BARSSINCEN(HIGH>10,10)表示10个周期内股价超过10元时到当前的周期数
    */
    this.BARSSINCEN = function (data, n) 
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
    this.BARSSINCE = function (data) 
    {
        var result = [];
        var day = null;

        for (let i = 0; i < data.length; ++i) 
        {
            result[i] = null;
            if (day == null) 
            {
                if (data[i]) day = 0;
            }
            else 
            {
                ++day;
            }

            if (day) result[i] = day;
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
    this.Trigonometric = function (data, func) 
    {
        if (!Array.isArray(data)) 
        {
            if (this.IsNumber(data)) return func(data);

            return null;
        }
        else 
        {
            var result = [];
            for (let i in data) 
            {
                var item = data[i];
                if (this.IsNumber(item)) result[i] = func(item);
                else result[i] = null;
            }

            return result;
        }
    }

    //反正弦值. 用法: ASIN(X)返回X的反正弦值
    this.ASIN = function (data) 
    {
        if (!Array.isArray(data)) 
        {
            if (this.IsNumber(data)) return Math.acos(data);
            return null;
        }
        else 
        {
            var result = [];
            for (let i in data) 
            {
                var item = data[i];
                result[i] = null;
                if (this.IsNumber(item)) 
                {
                    if (item >= -1 && item <= 1) 
                    {
                        result[i] = Math.asin(item);
                    }
                    else if (i - 1 >= 0) 
                    {
                        var preItem = result[i - 1];
                        if (this.IsNumber(preItem)) result[i] = preItem;
                    }
                }
            }

            return result;
        }
    }


    //反余弦值. 用法: ACOS(X)返回X的反余弦值
    this.ACOS = function (data) 
    {
        if (!Array.isArray(data)) 
        {
            if (this.IsNumber(data)) return Math.acos(data);

            return null;
        }
        else 
        {
            var result = [];
            for (let i in data) 
            {
                var item = data[i];
                result[i] = null;
                if (this.IsNumber(item)) 
                {
                    if (item >= -1 && item <= 1) 
                    {
                        result[i] = Math.acos(item);
                    }
                    else if (i - 1 >= 0)    //超出范围使用上一个数值
                    {
                        var preItem = result[i - 1];
                        if (this.IsNumber(preItem)) result[i] = preItem;
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
    this.LAST = function (data, n, n2) 
    {
        var result = [];
        if (n2 <= 0) n2 = data.length - 1;
        if (n2 > n) return result;

        var day = 0;

        for (let i = 0, j = 0; i < data.length; ++i) {
            result[i] = 0;
            day = 0;
            var start = i - n;
            var end = i - n2;
            if (start < 0 || end < 0) continue;

            for (j = start; j < data.length && j <= end; ++j, ++day) {
                if (!data[j]) break;
            }

            if (day == end - start + 1)   //[start,end]
                result[i] = 1;
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


    this.GetFirstVaildIndex=function(data)
    {
        for (var i = 0; i <data.length; ++i)
        {
            if (this.IsNumber(data[i]))
                return i;
        }
        return data.length;
    }

    this.JSDraw = null;
    this.CalculateZIGLine = function (firstData, secondData, thridData, data, result) 
    {
        if (this.JSDraw == null) this.JSDraw = new JSDraw(this.ErrorHandler);
        var isUp = secondData.Up;
        var findData = firstData;
        if (isUp) 
        {
            for (var i = firstData.ID + 1; i < thridData.ID; ++i)  //查找最高点
            {
                var subItem = data[i];
                if (!this.IsNumber(subItem)) continue;
                if (findData.Value < subItem) findData = { ID: i, Value: subItem };
            }
        }
        else 
        {
            for (var i = firstData.ID + 1; i < thridData.ID; ++i)  //查找最低点
            {
                var subItem = data[i];
                if (!this.IsNumber(subItem)) continue;
                if (findData.Value > subItem) findData = { ID: i, Value: subItem };
            }
        }

        secondData.Value = findData.Value;
        secondData.ID = findData.ID;

        var lineCache = { Start: { ID: firstData.ID, Value: firstData.Value }, End: { ID: secondData.ID, Value: secondData.Value } };
        var lineData = this.JSDraw.CalculateDrawLine(lineCache);//计算2个点的线上 其他点的数值
        for (var i in lineData) 
        {
            var lineItem = lineData[i];
            result[lineItem.ID] = lineItem.Value;
        }

        if (thridData.ID == data.length - 1)    //最后一组数据
        {
            //最后2个点的数据连成线
            lineCache = { Start: { ID: secondData.ID, Value: secondData.Value }, End: { ID: thridData.ID, Value: thridData.Value } };
            lineData = this.JSDraw.CalculateDrawLine(lineCache);//计算2个点的线上 其他点的数值
            for (var i in lineData) 
            {
                var lineItem = lineData[i];
                result[lineItem.ID] = lineItem.Value;
            }
        }
        else 
        {
            firstData.ID = secondData.ID;
            firstData.Value = secondData.Value;

            secondData.ID = thridData.ID;
            secondData.Value = thridData.Value;
            secondData.Up = firstData.Value < secondData.Value;
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
    this.EVERY = function (data, n) 
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
    this.COST = function (data, node) 
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

        if (dMinPrice > 5000 || dMinPrice < 0 || dMaxPrice>5000 || dMinPrice < 0)
            this.ThrowUnexpectedNode(node,'COST() 历史K线最大最小值错误, 超出(0,5000)范围');

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
    获利盘比例.
    用法:
    WINNER(CLOSE),表示以当前收市价卖出的获利盘比例,例如返回0.1表示10%获利盘;WINNER(10.5)表示10.5元价格的获利盘比例
    该函数仅对日线分析周期有效
    ！！！！计算比较耗时间
    */
    this.WINNER = function (data,node) 
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

    //计算截至到某一天的历史所有筹码
    this.CalculateChip = function (index, exchangeData, hisData, dRate) 
    {
        var result = { Min: null, Max: null, Data: [] };
        var seed = 1;//筹码历史衰减换手系数
        var max = null, min = null;
        for (let i = index; i >= 0; --i) 
        {
            let item = {};    //Vol:量 High:最高 Low:最低
            var kData = hisData[i];
            if (i == index) item.Vol = kData.Vol * exchangeData[i];
            else item.Vol = kData.Vol * seed;

            item.Date = kData.Date;
            item.High = kData.High;
            item.Low = kData.Low;

            if (max == null) max = item.High;
            else if (max < item.High) max = item.High;
            if (min == null) min = item.Low;
            else if (min < item.Low) min = item.Low;

            result.Data[i] = item;

            seed *= (1 - (exchangeData[i] / 100) * dRate);	//换手率累乘
        }

        result.Max = max;
        result.Min = min;

        return result;
    }

    /*
    返回是否连涨周期数.
    用法:
    UPNDAY(CLOSE,M)
    表示连涨M个周期,M为常量
    */
    this.UPNDAY = function (data, n) 
    {
        var result = [];
        if (n < 1) return result;
        if (data == null || n > data.length) return result;

        var days = 0;
        for (let i = 0; i < data.length; ++i) 
        {
            result[i] = 0;
            if (i - 1 < 0) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data[i - 1])) //无效数都不算连涨
            {
                days = 0;
                continue;
            }

            if (data[i] > data[i - 1])++days;
            else days = 0;

            if (days == n) 
            {
                result[i] = 1;
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
    this.DOWNNDAY = function (data, n) 
    {
        var result = [];
        if (n < 1) return result;
        if (data == null || n > data.length) return result;

        var days = 0;
        for (let i = 0; i < data.length; ++i) 
        {
            result[i] = 0;
            if (i - 1 < 0) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data[i - 1])) //无效数都不算连涨
            {
                days = 0;
                continue;
            }

            if (data[i] < data[i - 1])++days;
            else days = 0;

            if (days == n) 
            {
                result[i] = 1;
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
    this.NDAY = function (data, data2, n) 
    {
        var result = [];
        if (n < 1) return result;
        if (!Array.isArray(data) && !Array.isArray(data2)) return result;
        if (data == null || data2 == null) return result;

        if (Array.isArray(data) && Array.isArray(data2)) 
        {
            if (n >= data.length || n >= data2.length) return result;
            var count = Math.max(data.length, data2.length);
            var days = 0;
            for (let i = 0; i < count; ++i) 
            {
                result[i] = 0;
                if (i >= data.length || i >= data2.length) continue;
                if (!this.IsNumber(data[i]) || !this.IsNumber(data2[i])) 
                {
                    days = 0;
                    continue;
                }

                if (data[i] > data2[i])++days;
                else days = 0;

                if (days == n) 
                {
                    result[i] = 1;
                    --days;
                }
            }
        }
        else if (Array.isArray(data) && !Array.isArray(data2)) 
        {
            if (n >= data.length || !this.IsNumber(data2)) return;
            var days = 0;
            for (let i in data) 
            {
                result[i] = 0;
                if (!this.IsNumber(data[i])) 
                {
                    days = 0;
                    continue;
                }

                if (data[i] > data2)++days;
                else days = 0;

                if (days == n) 
                {
                    result[i] = 1;
                    --days;
                }
            }
        }
        else if (!Array.isArray(data) && Array.isArray(data2)) 
        {
            if (n >= data2.length || !this.IsNumber(data)) return;
            var days = 0;
            for (let i in data2) 
            {
                result[i] = 0;
                if (!this.IsNumber(data2[i])) 
                {
                    days = 0;
                    continue;
                }

                if (data > data2[i])++days;
                else days = 0;

                if (days == n) 
                {
                    result[i] = 1;
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
    this.LONGCROSS = function (data, data2, n) 
    {
        var result = [];
        var count = Math.max(data.length, data2.length);
        for (let i = 0; i < count; ++i) 
        {
            result[i] = 0;
            if (i - 1 < 0) continue;
            if (i >= data.length || i >= data2.length) continue;
            if (!this.IsNumber(data[i]) || !this.IsNumber(data2[i]) || !this.IsNumber(data[i - 1]) || !this.IsNumber(data2[i - 1])) continue;

            if (data[i] > data2[i] && data[i - 1] < data2[i - 1]) result[i] = 1;
        }

        for (let i = 0, j = 0; i < count; ++i) 
        {
            if (!result[i]) continue;

            for (j = 1; j <= n && i - j >= 0; ++j) 
            {
                if (data[i - j] >= data2[i - j]) 
                {
                    result[i] = 0;
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
    this.EXISTR = function (data, n, n2) 
    {
        var result = [];
        if (!Array.isArray(data)) return result;

        n = parseInt(n);
        n2 = parseInt(n2);
        if (n <= 0) n = data.length;
        if (n2 <= 0) n2 = 1;
        if (n2 > n) return result;

        var result = [];
        var value;
        for (let i = 0, j = 0; i < data.length; ++i) 
        {
            result[i] = null;
            if (i - n < 0 || i - n2 < 0) continue;

            result[i] = 0;
            for (j = n; j >= n2; --j) 
            {
                var value = data[i - j];
                if (this.IsNumber(value) && value) 
                {
                    result[i] = 1;
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
    this.RELATE = function (data, data2, n) 
    {
        var result = [];
        if (n < 1) n = 1;

        if (!Array.isArray(data) || !Array.isArray(data2)) return result;

        var dataAverage = this.CalculateAverage(data, n);
        var data2Average = this.CalculateAverage(data2, n);

        var count = Math.max(data.length, data2.length);
        for (let i = 0, j = 0; i < count; ++i) 
        {
            result[i] = null;

            if (i >= data.length || i >= data2.length || i >= dataAverage.length || i >= data2Average.length) continue;

            var average = dataAverage[i];
            var average2 = data2Average[i];

            var total = 0, total2 = 0, total3 = 0;
            for (j = i - n + 1; j <= i; ++j) 
            {
                total += (data[j] - average) * (data2[j] - average2);   //∑[(Xi-Avg(X))(Yi-Avg(y))])
                total2 += Math.pow(data[j] - average, 2);            //∑(Xi-Avg(X))^2
                total3 += Math.pow(data2[j] - average2, 2);          //∑(Yi-Avg(Y))^2)
            }

            result[i] = (total / n) / (Math.sqrt(total2 / n) * Math.sqrt(total3 / n));
        }

        return result;
    }

    //计算数组n周期内的均值
    this.CalculateAverage = function (data, n) 
    {
        var result = [];
        if (n < 1) return result;

        var total = 0;

        for (var i = 0; i < data.length; ++i)  //去掉开始的无效数
        {
            if (this.IsNumber(data[i])) break;
        }

        for (; i < data.length && i < n; ++i)  //计算第1个周期的数据
        {
            result[i] = null;
            var value = data[i];
            if (!this.IsNumber(value)) continue;
            total += value;
        }
        result[i - 1] = total / n;

        for (; i < data.length; ++i)         //计算后面的周期数据
        {
            var value = data[i];
            var preValue = data[i - n];     //上一个周期的第1个数据
            if (!this.IsNumber(value)) value = 0;
            if (!this.IsNumber(preValue)) preValue = 0;

            total = total - preValue + value; //当前周期的数据 等于上一个周期数据 去掉上一个周期的第1个数据 加上这个周期的最后1个数据
            result[i] = total / n;
        }

        return result;
    }

    /*
    COVAR(X,Y,N) 返回X和Y的N周期的协方差
    */
    this.COVAR = function (data, data2, n) 
    {
        if (this.IsNumber(data) || this.IsNumber(data2)) return 0;

        var result = [];
        if (n < 1) n = 1;

        if (!Array.isArray(data) || !Array.isArray(data2)) return result;

        var dataAverage = this.CalculateAverage(data, n);
        var data2Average = this.CalculateAverage(data2, n);

        var count = Math.max(data.length, data2.length);

        var count = Math.max(data.length, data2.length);
        for (let i = 0, j = 0; i < count; ++i) 
        {
            result[i] = null;

            if (i >= data.length || i >= data2.length || i >= dataAverage.length || i >= data2Average.length) continue;

            var average = dataAverage[i];
            var average2 = data2Average[i];

            var total = 0;
            for (j = i - n + 1; j <= i; ++j) 
            {
                total += (data[j] - average) * (data2[j] - average2);
            }

            result[i] = (total / n);
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
    this.HHVBARS = function (data, n) 
    {
        var result = [];
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
            if (n < 1) n = data.length;

            var nMax = null;  //最大值索引
            for (var i = 0; i < data.length; ++i) 
            {
                result[i] = null;
                if (this.IsNumber(data[i])) {
                    nMax = i;
                    break;
                }
            }

            var j = 0;
            for (i = nMax + 1; i < data.length && j < n; ++i, ++j) //求第1个最大值
            {
                if (data[i] >= data[nMax]) nMax = i;
                if (n == data.length) result[i] = (i - nMax);
            }

            for (; i < data.length; ++i) 
            {
                if (i - nMax < n) 
                {
                    if (data[i] >= data[nMax]) nMax = i;
                }
                else 
                {
                    nMax = i - n + 1;
                    for (j = nMax; j <= i; ++j)    //计算区间最大值
                    {
                        if (data[j] >= data[nMax]) nMax = j;
                    }
                }

                result[i] = i - nMax;
            }
        }

        return result;
    }

    /*
    求上一低点到当前的周期数.
    用法: LLVBARS(X,N):求N周期内X最低值到当前周期数,N=0表示从第一个有效值开始统计
    例如: LLVBARS(HIGH,20)求得20日最低点到当前的周期数
    */
    this.LLVBARS = function (data, n) 
    {
        var result = [];
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
            if (n < 1) n = data.length;

            var nMin = null;  //最小值索引
            for (var i = 0; i < data.length; ++i)
            {
                result[i] = null;
                if (this.IsNumber(data[i])) 
                {
                    nMin = i;
                    break;
                }
            }

            var j = 0;
            for (i = nMin + 1; i < data.length && j < n; ++i, ++j) //求第1个最大值
            {
                if (data[i] <= data[nMin]) nMin = i;
                if (n == data.length) result[i] = (i - nMin);
            }

            for (; i < data.length; ++i) 
            {
                if (i - nMin < n) 
                {
                    if (data[i] <= data[nMin]) nMin = i;
                }
                else 
                {
                    nMin = i - n + 1;
                    for (j = nMin; j <= i; ++j)    //计算区间最小值
                    {
                        if (data[j] <= data[nMin]) nMin = j;
                    }
                }

                result[i] = i - nMin;
            }
        }

        return result;
    }

    /*
    β(Beta)系数
    BETA(N) 返回当前证券N周期收益与对应大盘指数收益相比的贝塔系数
    需要下载上证指数历史数据
    涨幅(X)=(现价-上一个交易日收盘价）/上一个交易日收盘价
    公式=股票和指数协方差/股票方差
    */
    this.BETA = function (n) 
    {
        var result = [];
        var stockData = this.SymbolData.Data;
        var indexData = this.SymbolData.IndexData;
        if (n <= 0) n = 1;

        var stockProfit = []; //股票涨幅
        var indexProfit = []; //指数涨幅

        for (let i = 0; i < stockData.Data.length; ++i) 
        {
            stockProfit[i] = 0;
            indexProfit[i] = 0;

            var stockItem = stockData.Data[i];
            var indexItem = indexData.Data[i];

            if (stockItem.Close > 0 && stockItem.YClose > 0) stockProfit[i] = (stockItem.Close - stockItem.YClose) / stockItem.YClose;
            if (indexItem.Close > 0 && indexItem.YClose > 0) indexProfit[i] = (indexItem.Close - indexItem.YClose) / indexItem.YClose;
        }

        //计算均值数组
        var averageStockProfit = this.CalculateAverage(stockProfit, n);
        var averageIndexProfit = this.CalculateAverage(indexProfit, n);

        for (var i = 0, j = 0; i < stockData.Data.length; ++i) 
        {
            result[i] = null;
            if (i >= stockProfit.length || i >= indexProfit.length || i >= averageStockProfit.length || i >= averageIndexProfit.length) continue;

            var averageStock = averageStockProfit[i];
            var averageIndex = averageIndexProfit[i];

            var covariance = 0;   //协方差
            var variance = 0;     //方差
            for (j = i - n + 1; j <= i; ++j) 
            {
                var value = (indexProfit[j] - averageIndex);
                var value2 = (stockProfit[j] - averageStock);
                covariance += value * value2;
                variance += value * value;
            }

            if (this.IsDivideNumber(variance) && this.IsNumber(covariance))
                result[i] = covariance / variance;  //(covariance/n)/(variance/n)=covariance/variance;
        }

        return result;
    }

    /*
    用法:BETA2(X,Y,N)为X与Y的N周期相关放大系数,表示Y变化1%,则X将变化N%
    例如:BETA2(CLOSE,INDEXC,10)表示收盘价与大盘指数之间的10周期相关放大率
    */
    this.BETA2 = function (x, y, n) 
    {
        var result = [];
        if (n <= 0) n = 1;

        var xProfit = [null]; //x数据的涨幅
        var yProfit = [null]; //y数据的涨幅

        var count = Math.max(x.length, y.length);

        var lastItem = { X: x[0], Y: y[0] };
        for (var i = 1; i < count; ++i) 
        {
            xProfit[i] = 0;
            yProfit[i] = 0;

            var xItem = x[i];
            var yItem = y[i];

            if (lastItem.X > 0) xProfit[i] = (xItem - lastItem.X) / lastItem.X;
            if (lastItem.Y > 0) yProfit[i] = (yItem - lastItem.Y) / lastItem.Y;

            lastItem = { X: xItem, Y: yItem };
        }

        //计算均值数组
        var averageXProfit = this.CalculateAverage(xProfit, n);
        var averageYProfit = this.CalculateAverage(yProfit, n);

        for (var i = 0, j = 0; i < count; ++i) 
        {
            result[i] = null;

            if (i >= xProfit.length || i >= yProfit.length || i >= averageXProfit.length || i >= averageYProfit.length) continue;

            var averageX = averageXProfit[i];
            var averageY = averageYProfit[i];

            var covariance = 0;   //协方差
            var variance = 0;     //方差
            for (j = i - n + 1; j <= i; ++j) 
            {
                var value = (xProfit[j] - averageX);
                var value2 = (yProfit[j] - averageY);
                covariance += value * value2;
                variance += value * value;
            }

            if (this.IsDivideNumber(variance) && this.IsNumber(covariance))
                result[i] = covariance / variance;  //(covariance/n)/(variance/n)=covariance/variance;
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
    this.SAR = function (n, step, exValue) 
    {
        var result = [];
        var stockData = this.SymbolData.Data;
        if (n >= stockData.Data.length) return result;

        var high = null, low = null;
        for (var i = 0; i < n; ++i) 
        {
            var item = stockData.Data[i];
            if (high == null) high = item.High;
            else if (high < item.High) high = item = high;
            if (low == null) low = item.Low;
            else if (low > item.Low) low = item.Low;
        }

        const SAR_LONG = 0, SAR_SHORT = 1;
        var position = SAR_LONG;
        result[n - 1] = low;
        var nextSar = low, sip = stockData.Data[0].High, af = exValue / 100;
        for (var i = n; i < stockData.Data.length; ++i) 
        {
            var ysip = sip;
            var item = stockData.Data[i];
            var yitem = stockData.Data[i - 1];

            if (position == SAR_LONG) 
            {
                if (item.Low < result[i - 1]) 
                {
                    position = SAR_SHORT;
                    sip = item.Low;
                    af = step / 100;
                    nextSar = Math.max(item.High, yitem.High);
                    nextSar = Math.max(nextSar, ysip + af * (sip - ysip));
                }
                else 
                {
                    position = SAR_LONG;
                    if (item.High > ysip) 
                    {
                        sip = item.High;
                        af = Math.min(af + step / 100, exValue / 100);
                    }
                    nextSar = Math.min(item.Low, yitem.Low);
                    nextSar = Math.min(nextSar, result[i - 1] + af * (sip - result[i - 1]));
                }
            }
            else if (position == SAR_SHORT) 
            {
                if (item.High > result[i - 1]) 
                {
                    position = SAR_LONG;
                    sip = item.High;
                    af = step / 100;
                    nextSar = Math.min(item.Low, yitem.Low);
                    nextSar = Math.min(nextSar, result[i - 1] + af * (sip - ysip));
                }
                else 
                {
                    position = SAR_SHORT;
                    if (item.Low < ysip) 
                    {
                        sip = item.Low;
                        af = Math.min(af + step / 100, exValue / 100);
                    }
                    nextSar = Math.max(item.High, yitem.High);
                    nextSar = Math.max(nextSar, result[i - 1] + af * (sip - result[i - 1]));
                }
            }

            result[i] = nextSar;
        }

        return result;
    }

    /*
    抛物转向点.
    用法:
    SARTURN(N,S,M),N为计算周期,S为步长,M为极值,若发生向上转向则返回1,若发生向下转向则返回-1,否则为0
    其用法与SAR函数相同
    */
    this.SARTURN = function (n, step, exValue) 
    {
        var result = [];
        var sar = this.SAR(n, step, exValue);
        var stockData = this.SymbolData.Data;
        var index = 0;
        for (index = 0; index < sar.length; ++index) 
        {
            if (this.IsNumber(sar[index])) break;
        }
        var flag = 0;
        if (index < stockData.Data.length) flag = stockData.Data[index].Close > sar[index];

        for (var i = index + 1; i < stockData.Data.length; ++i) 
        {
            var item = stockData.Data[i];
            if (item.Close < sar[i] && flag) result[i] = -1;
            else result[i] = (item.Close > sar[i] && !flag) ? 1 : 0;

            flag = item.Close > sar[i];
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
    this.BACKSET = function (condition, n) 
    {
        var result = [];
        if (!condition) return result;
        var dataCount = condition.length;
        if (!this.IsNumber(dataCount) || dataCount <= 0) return result;
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
            for (var i = 0; i < dataCount; ++i)    //初始化0
            {
                result[i] = 0;
            }

            for (var pos = 0; pos < dataCount; ++pos) 
            {
                if (this.IsNumber(condition[pos])) break;
            }
            if (pos == dataCount) return result;

            var num = Math.min(dataCount - pos, Math.max(n, 1));

            for (var i = dataCount - 1, j = 0; i >= 0; --i) 
            {
                var value = condition[i];
                if (this.IsNumber(value) && value) 
                {
                    for (j = i; j > i - num; --j) 
                    {
                        result[j] = 1;
                    }
                }
            }

            if (condition[i]) 
            {
                for (j = i; j >= pos; --j) result[j] = 1;
            }
        }

        return result;
    }

    //STRCAT(A,B):将两个字符串A,B(非序列化)相加成一个字符串C.
    //用法: STRCAT('多头','开仓')将两个字符串'多头','开仓'相加成一个字符串'多头开仓'
    this.STRCAT = function (str1, str2) 
    {
        var result=[];
        if (this.IsString(str1) && this.IsString(str2))
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
                    if (this.IsString(item)) 
                        strValue+=item;
                }

                if (i<data2.length)
                {
                    var item=data2[i];
                    if (this.IsString(item)) 
                        strValue+=item;
                }

                if (strValue!="")
                    result[i]=strValue;
            }
        }
        else if (this.IsString(data) && Array.isArray(data2))
        {
            for(var i=0;i<data2.length;++i)
            {
                result[i]=null;
                var item=data2[i];
                if (this.IsString(item))
                {
                    result[i]=data+item;
                }
            }            
        }
        else if (Array.isArray(data) && this.IsString(data2))
        {
            for(var i=0;i<data.length;++i)
            {
                result[i]=null;
                var item=data[i];
                if (this.IsString(item))
                {
                    result[i]=item+data2;
                }
            }          
        }
        else if (this.IsString(data) && this.IsString(data2))
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
                if (TouchList.IsString(item))
                    result[i]=item+' ';
            }
        }
        else
        {
            if (this.IsString(data))
                result=data+" ";
        }

        return result;
    }

    //CON2STR(A,N):取A最后的值(非序列值)转为字符串,小数位数N.
    //用法: CON2STR(FINANCE(20),3)表示取营业收入,以3位小数转为字符串
    this.CON2STR = function (data, n) 
    {
        var result = [];
        if (Array.isArray(data)) 
        {
            for (var i = data.length - 1; i >= 0; --i) 
            {
                var item = data[i];
                if (this.IsNumber(item)) 
                {
                    result = item.toFixed(n);
                    return result;
                }
            }
        }
        else 
        {
            if (this.IsNumber(data))
                result = data.toFixed(n);
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

    this.ZTPRICE = function (data, rate) 
    {
        if (!this.IsNumber(rate)) return null;

        if (Array.isArray(data)) 
        {
            var result = [];
            for (var i in data) 
            {
                var item = data[i];
                if (this.IsNumber(item)) result[i] = (1 + rate) * item;
                else result[i] = null;
            }

            return result;
        }
        else if (this.IsNumber(data)) 
        {
            var result = (1 + rate) * data;
            return result;
        }
    }

    this.DTPRICE = function (data, rate) 
    {
        if (!this.IsNumber(rate)) return null;

        if (Array.isArray(data)) 
        {
            var result = [];
            for (var i in data) 
            {
                var item = data[i];
                if (this.IsNumber(item)) result[i] = (1 - rate) * item;
                else result[i] = null;
            }

            return result;
        }
        else if (this.IsNumber(data)) 
        {
            var result = (1 - rate) * data;
            return result;
        }

    }

    /*
    FRACPART(A)	 取得小数部分
    含义:FRACPART(A)返回数值的小数部分
    阐释:例如FRACPART(12.3)求得0.3,FRACPART(-3.5)求得-0.5
    */
    this.FRACPART = function (data) 
    {
        if (Array.isArray(data)) 
        {
            var result = [];
            var integer = 0;
            for (var i in data) 
            {
                var item = data[i];
                if (this.IsNumber(item))
                {
                    integer = parseInt(item);
                    result[i] = item - integer;
                }
                else result[i] = null;
            }

            return result;
        }
        else if (this.IsNumber(data)) 
        {
            integer = parseInt(data);
            var result = data - integer;
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
            if (count>0) return data[count-1];
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
        else if (this.IsNumber(data) && Array.isArray(n))
        {
            for(var i=0;i<n.length;++i)
            {
                var item=n[i];
                if (this.IsNumber(item)) result[i]=Math.pow(data,item);
                else result[i]=null;
            }
        }
        else if (this.IsNumber(data) && this.IsNumber(n))
        {
            return Math.pow(data,n);
        }
        else if (Array.isArray(data) && this.IsNumber(n))
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


    this.PWINNER=function(n, data, node)
    {
        var result=[];
        return result;
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

    //格式化字符串 "{0}-{1}", C, O;
    this.STRFORMAT=function(strFormat,args,node)
    {
        var aryParam=strFormat.match(/{\d+}/g);

        if (!IFrameSplitOperator.IsNonEmptyArray(aryParam)) return null;

        var mapParam=new Map(); //key=index, value={Text}
        var maxIndex=-1;
        for(var i=0;i<aryParam.length;++i)
        {
            var item=aryParam[i];
            if (item.length<3) continue;

            var value=item.slice(1, item.length-1);
            var index=parseInt(value);

            var paramItem={ Src:item, Index:index, Text:null};

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
                            if (value) text=`${value}`;
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
    this.CallFunction=function(name,args,node)
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
            case "HV":
                return this.HV(args[0], args[1]);
            case 'HHVBARS':
                return this.HHVBARS(args[0], args[1]);
            case 'MULAR':
                return this.MULAR(args[0], args[1]);
            case 'CROSS':
                return this.CROSS(args[0], args[1]);
            case "CROSSDOWN":
                return this.CROSSDOWN(args[0], args[1]);
            case 'LONGCROSS':
                return this.LONGCROSS(args[0], args[1], args[2]);
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
                return this.EXISTR(args[0], args[1], args[2]);
            case "ISVALID":
                return this.ISVALID(args[0]);
            case 'FILTER':
                return this.FILTER(args[0], args[1]);
            case 'TFILTER':
                return this.TFILTER(args[0],args[1],args[2]);
            case 'SLOPE':
                return this.SLOPE(args[0],args[1]);
            case 'BARSLAST':
                return this.BARSLAST(args[0]);
            case 'BARSCOUNT':
                return this.BARSCOUNT(args[0]);
            case 'BARSSINCEN':
                return this.BARSSINCEN(args[0], args[1]);
            case 'BARSSINCE':
                return this.BARSSINCE(args[0]);
            case 'LAST':
                return this.LAST(args[0], args[1], args[2]);
            case 'EVERY':
                return this.EVERY(args[0], args[1]);
            case 'ZIG':
                return this.ZIG(args[0], args[1]);
            case 'TROUGHBARS':
                return this.TROUGHBARS(args[0], args[1], args[2]);
            case "TROUGH":
                return this.TROUGH(args[0],args[1],args[2]);
            case 'PEAKBARS':
                return this.PEAKBARS(args[0], args[1], args[2]);
            case 'PEAK':
                return this.PEAK(args[0],args[1],args[2]);
            case 'COST':
                return this.COST(args[0], node);
            case 'WINNER':
                return this.WINNER(args[0], node);
            case "PWINNER":
                return this.PWINNER(args[0],args[1],node);
            case 'UPNDAY':
                return this.UPNDAY(args[0], args[1]);
            case 'DOWNNDAY':
                return this.DOWNNDAY(args[0], args[1]);
            case 'NDAY':
                return this.NDAY(args[0], args[1], args[2]);
            case 'DEVSQ':
                return this.DEVSQ(args[0], args[1]);
            case 'FORCAST':
                return this.FORCAST(args[0], args[1]);
            case 'STDP':
                return this.STDP(args[0], args[1]);
            case 'VAR':
                return this.VAR(args[0], args[1]);
            case 'VARP':
                return this.VARP(args[0], args[1]);
            case 'RELATE':
                return this.RELATE(args[0], args[1], args[2]);
            case 'COVAR':
                return this.COVAR(args[0], args[1], args[2]);
            case 'BETA':
                return this.BETA(args[0]);
            case 'BETA2':
                return this.BETA2(args[0], args[1], args[2]);
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
            case 'STRCAT':
                return this.STRCAT(args[0], args[1]);
            case "VARCAT":
                return this.VARCAT(args[0], args[1]);
            case "VAR2STR":
                return this.VAR2STR(args[0], args[1]);
            case 'CON2STR':
                return this.CON2STR(args[0], args[1]);
            case "STRSPACE":
                return this.STRSPACE(args[0]);
            case 'FINDSTR':
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
            case 'MOD':
                return this.MOD(args[0],args[1]);
            case 'POW':
                return this.POW(args[0],args[1]);
            case 'CEILING':
                return this.CEILING(args[0]);
            case 'FLOOR':
                return this.FLOOR(args[0]);
            case "BETWEEN":
                return this.BETWEEN(args[0], args[1],args[2]);

            case "ANY":
                return this.ANY(args[0],args[1]);
            case "ALL":
                return this.ALL(args[0],args[1]);
            case "ALIGNRIGHT":
                return this.ALIGNRIGHT(args[0]);

            //三角函数
            case 'ATAN':
                return this.Trigonometric(args[0], Math.atan);
            case 'ACOS':
                return this.ACOS(args[0]);
            case 'ASIN':
                return this.ASIN(args[0]);
            case 'COS':
                return this.Trigonometric(args[0], Math.cos);
            case 'SIN':
                return this.Trigonometric(args[0], Math.sin);
            case 'TAN':
                return this.Trigonometric(args[0], Math.tan);
            case 'LN':
                return this.Trigonometric(args[0], Math.log);
            case 'LOG':
                return this.Trigonometric(args[0], Math.log10);
            case 'EXP':
                return this.Trigonometric(args[0], Math.exp);
            case 'SQRT':
                return this.Trigonometric(args[0], Math.sqrt);
            default:
                this.ThrowUnexpectedNode(node,'函数'+name+'不存在');
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

    this.ThrowUnexpectedNode=function(node,message)
    {
        let marker=node.Marker;
        let msg=message || "执行异常";
       
        return this.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg);
       
    }
}

//是否有是有效的数字
JSAlgorithm.prototype.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//是否是整形
JSAlgorithm.prototype.IsInteger=function(x) 
{
    return (typeof x === 'number') && (x % 1 === 0);
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


//是否是字符串
JSAlgorithm.prototype.IsString=function(value)
{
    if (value && typeof(value)=='string') return true;
    return false;
}

/*
   绘图函数 
*/
function JSDraw(errorHandler, symbolData)
{
    this.ErrorHandler=errorHandler;
    this.SymbolData = symbolData;

    this.DRAWTEXT=function(condition,price,text)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'DRAWTEXT',Text:text};

        if (Array.isArray(condition))
        {
            var IsNumber=this.IsNumber(price);
            var isFixedPosition=false;
            if (price==="TOP"|| price==="BOTTOM")
            {
                result.FixedPosition=price;
                isFixedPosition=true;
            }
            for(var i=0; i<condition.length; ++i)
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
        let result={Position:null, DrawType:'DRAWTEXT_FIX',Text:text};
        if (condition.length<=0) return result;

        for(var i in condition)
        {
            if (isNaN(condition[i]) || !condition[i]) continue;

            result.Position={X:x, Y:y, Type:type};
            return result;
        }

        return result;
    }

    //direction 文字Y轴位置 0=middle 1=价格的顶部 2=价格的底部
    //offset 文字Y轴偏移
    this.SUPERDRAWTEXT = function (condition, price, text, direction, offset) 
    {
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'SUPERDRAWTEXT', Text: text, YOffset: offset, Direction: direction, TextAlign: 'center' };
        if (condition.length <= 0) return result;

        var IsNumber = typeof (price) == "number";

        for (var i in condition) 
        {
            drawData[i] = null;

            if (isNaN(condition[i]) || !condition[i]) continue;

            if (IsNumber) 
            {
                drawData[i] = price;
            }
            else 
            {
                if (this.IsNumber(price[i])) drawData[i] = price[i];
            }
        }

        return result;
    }

    this.STICKLINE=function(condition,data,data2,width,type)
    {
        let drawData=[];
        let result={DrawData:drawData, DrawType:'STICKLINE',Width:width, Type:type};

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
        else
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
                    if (!this.IsNumber(data2[i])) continue;
                    drawData[i]={Value:data,Value2:data2[i]};
                }
                else if (!IsNumber && IsNumber2)
                {
                    if (!this.IsNumber(data[i])) continue;
                    drawData[i]={Value:data[i],Value2:data2};
                }
                else
                {
                    if (!this.IsNumber(data[i]) || !this.IsNumber(data2[i])) continue;
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
                    if (!bCondition2) continue;

                    if (bCondition2)
                    {
                        bSecondPont=true;
                        lineCache.End={ID:i, Value:data2[i]};   //第2个点
                    }
                }
                
                if (bFirstPoint==true && bSecondPont==true)    //2个点都有了, 等待下一次的点出现
                {
                    let lineData=this.CalculateDrawLine(lineCache);     //计算2个点的线上 其他点的数值

                    for(let j in lineData)
                    {
                        let item=lineData[j];
                        drawData[item.ID]=item.Value;
                    }

                    bFirstPoint=bSecondPont=false;
                    lineCache={Start:{ },End:{ }};
                }
            }
        }
        if (expand==1) //右延长线
        {
            var x2=null;
            for(var i=drawData.length-1;i>=0;--i)
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
                for(var i=x2+1;i<drawData.length;++i)
                {
                    var y1=drawData[x1];
                    var y2=drawData[x2];
                    var y3=(y1-y2)*(i-x1)/(x2-x1);
                    drawData[i]=y1-y3;
                }
            }
        }
        
        return result;
    }

    /*
    画出带状线.
    用法: DRAWBAND(VAL1,COLOR1,VAL2,COLOR2),当VAL1>VAL2时,在VAL1和VAL2之间填充COLOR1;当VAL1<VAL2时,填充COLOR2,这里的颜色均使用RGB函数计算得到.
    例如: DRAWBAND(OPEN,RGB(0,224,224),CLOSE,RGB(255,96,96));
    */
    this.DRAWBAND=function(data,color,data2,color2)
    {
        let drawData=[];
        let result = { DrawData: drawData, DrawType: 'DRAWBAND', Color: [color.toLowerCase(), color2.toLowerCase()]};
        let count=Math.max(data.length, data2.length);

        for(let i=0;i<count;++i)
        {
            let item={Value:null, Value2:null};
            if (i<data.length) item.Value=data[i];
            if (i<data2.length) item.Value2=data2[i];

            drawData.push(item);
        }

        return result;
    }

    this.DRAWKLINE = function (high, open, low, close) 
    {
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'DRAWKLINE' };
        let count = Math.max(high.length, open.length, low.length, close.length);

        for (let i = 0; i < count; ++i) 
        {
            let item = { Open: null, High: null, Low: null, Close: null };

            if (i < high.length && i < open.length && i < low.length && i < close.length) 
            {
                item.Open = open[i];
                item.High = high[i];
                item.Low = low[i];
                item.Close = close[i];
            }

            drawData[i] = item;
        }

        return result;
    }

    //满足条件画一根K线
    this.DRAWKLINE_IF = function (condition, high, open, low, close) 
    {
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'DRAWKLINE_IF' };
        let count = Math.max(condition.length, high.length, open.length, low.length, close.length);

        for (let i = 0; i < count; ++i) {
            let item = { Open: null, High: null, Low: null, Close: null };

            if (i < high.length && i < open.length && i < low.length && i < close.length && i < condition.length) 
            {
                if (condition[i]) 
                {
                    item.Open = open[i];
                    item.High = high[i];
                    item.Low = low[i];
                    item.Close = close[i];
                }
            }

            drawData[i] = item;
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
    this.POLYLINE = function (condition, data) 
    {
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'POLYLINE' };
        let isNumber = typeof (data) == 'number';

        let bFirstPoint = false;
        let bSecondPont = false;
        if (isNumber) 
        {
            for (let i in condition) 
            {
                drawData[i] = null;
                if (bFirstPoint == false) 
                {
                    if (!condition[i]) continue;

                    drawData[i] = data;
                    bFirstPoint = true;
                }
                else {
                    drawData[i] = data;
                }
            }
        }
        else 
        {
            let lineCache = { Start: {}, End: {}, List: new Array() };
            for (let i in condition) 
            {
                drawData[i] = null;
                if (bFirstPoint == false && bSecondPont == false) 
                {
                    if (condition[i] == null || !condition[i]) continue;
                    if (i >= data.length || !this.IsNumber(data[i])) continue;

                    bFirstPoint = true;
                    lineCache.Start = { ID: parseInt(i), Value: data[i] };  //第1个点
                }
                else if (bFirstPoint == true && bSecondPont == false) 
                {
                    if (condition[i] == null || !condition[i]) continue;
                    if (i >= data.length || !this.IsNumber(data[i])) continue;

                    lineCache.End = { ID: parseInt(i), Value: data[i] };   //第2个点
                    //根据起始点和结束点 计算中间各个点的数据
                    let lineData = this.CalculateDrawLine(lineCache);     //计算2个点的线上 其他点的数值

                    for (let j in lineData) 
                    {
                        let item = lineData[j];
                        drawData[item.ID] = item.Value;
                    }

                    let start = { ID: lineCache.End.ID, Value: lineCache.End.Value };
                    lineCache = { Start: start, End: {} };
                }
            }
        }

        return result
    }

    /*
    画出数字.
    用法:
    DRAWNUMBER(COND,PRICE,NUMBER),当COND条件满足时,在PRICE位置书写数字NUMBER.
    例如:
    DRAWNUMBER(CLOSE/OPEN>1.08,LOW,C)表示当日实体阳线大于8%时在最低价位置显示收盘价.
    */
    this.DRAWNUMBER = function (condition, data, data2,decimal) 
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
    在图形上绘制小图标.
    用法:
    DRAWICON(COND,PRICE,TYPE),当COND条件满足时,在PRICE位置画TYPE号图标(TYPE为1--41).
    例如:
    DRAWICON(CLOSE>OPEN,LOW,1)表示当收阳时在最低价位置画1号图标.
    */
    this.DRAWICON = function (condition, data, type, markID) 
    {
        if (IFrameSplitOperator.IsString(type)) //把ICO1=>1
        {
            var value=type.replace('ICO',"");
            type=parseInt(value);
        } 

        let icon =  g_JSComplierResource.GetDrawTextIcon(type);
        if (!icon) icon = { Symbol: '●', Color: 'rgb(0,139,69)'};
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'DRAWICON', Icon: icon , IconID:type};
        if (markID) result.MarkID=markID;
        if (condition.length <= 0) return result;

        var IsNumber = typeof (data) == "number";
        if (typeof (condition) == 'number') 
        {
            if (!condition) return result;

            for (var i = 0; i < this.SymbolData.Data.Data.length; ++i) 
            {
                if (IsNumber) 
                {
                    drawData[i] = data;
                }
                else 
                {
                    if (i < data.length && this.IsNumber(data[i])) drawData[i] = data[i];
                    else drawData[i] = null;
                }
            }
            return result;
        }
        
        for (var i in condition) 
        {
            drawData[i] = null;

            if (!condition[i]) continue;

            if (IsNumber) 
            {
                drawData[i] = data;
            }
            else 
            {
                if (this.IsNumber(data[i])) drawData[i] = data[i];
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

       var icon=g_JSComplierResource.GetDrawTextIcon(type);
       if (!icon) icon={ Symbol: '●', Color: 'rgb(0,139,69)'};

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

    // 相对位置上画矩形.
    //用法: DRAWRECTREL(LEFT,TOP,RIGHT,BOTTOM,COLOR),以图形窗口(LEFT,TOP)为左上角,(RIGHT,BOTTOM)为右下角绘制矩形,坐标单位是窗口沿水平和垂直方向的1/1000,取值范围是0—999,超出范围则可能显示在图形窗口外,矩形中间填充颜色COLOR,COLOR为0表示不填充.
    //例如: DRAWRECTREL(0,0,500,500,RGB(255,255,0))表示在图形最左上部1/4位置用黄色绘制矩形
    this.DRAWRECTREL = function (left, top, right, bottom, color) 
    {

        let drawData = 
        { 
            Rect: 
            { 
                Left: Math.min(left,right), Top: Math.min(top,bottom), 
                Right: Math.max(left,right), Bottom: Math.max(top,bottom) 
            }, 
            Color: color 
        };
        if (color == 0) drawData.Color = null;
        let result = { DrawData: drawData, DrawType: 'DRAWRECTREL' };

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

    this.RGB = function (r, g, b) 
    {
        var rgb = `rgb(${r},${g},${b})`;
        return rgb;
    }

    this.RGBA = function (r, g, b, a) 
    {
        var rgba = `rgba(${r},${g},${b},${a})`;
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

    //该函数和DRAWTEXT, DRAWNUMBER连用
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
JSDraw.prototype.IsNumber = function (value)
{
    if (value == null) return false;
    if (isNaN(value)) return false;

    return true;
}

//是否是整形
JSDraw.prototype.IsInteger=function(x) 
{
    return (typeof x === 'number') && (x % 1 === 0);
}

JSDraw.prototype.IsDrawFunction=function(name)
{
    let setFunctionName = new Set(
    [
        "STICKLINE", "DRAWTEXT", 'SUPERDRAWTEXT', "DRAWTEXT_FIX", 'DRAWLINE', 'DRAWBAND', "DRAWKLINE1","DRAWCOLORKLINE",
        'DRAWKLINE', 'DRAWKLINE_IF', 'PLOYLINE', 'POLYLINE', 'DRAWNUMBER', 'DRAWICON',"ICON",
        'DRAWRECTREL', "DRAWTEXTABS","DRAWTEXTREL", "DRAWGBK", "DRAWGBK2","DRAWGBK_DIV"
    ]);
    if (setFunctionName.has(name)) return true;

    return false;
}

//http://www.newone.com.cn/helpcontroller/index?code=zszy_pc
var DYNAINFO_ARGUMENT_ID=
{
    YCLOSE:3,
    OPEN:4,
    HIGH:5,
    LOW:6,
    CLOSE: 7,
    VOL: 8,
    AMOUNT: 10,
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
    this.SourceData = null;     //不复权的个股数据
    this.MarketValue = null;    //总市值
    this.Period=0;              //周期
    this.Right=0;               //复权
    this.DataType = 0;          //默认K线数据 2=分钟走势图数据

    this.KLineApiUrl = g_JSComplierResource.Domain+"/API/KLine2";                   //日线
    this.MinuteKLineApiUrl = g_JSComplierResource.Domain +'/API/KLine3';             //分钟K线
    this.RealtimeApiUrl = g_JSComplierResource.Domain +'/API/stock';                 //实时行情
    this.StockHistoryDayApiUrl = g_JSComplierResource.Domain +'/API/StockHistoryDay';  //历史财务数据
    this.StockHistoryDay3ApiUrl = g_JSComplierResource.Domain +'/API/StockHistoryDay3';  //历史财务数据
    this.StockNewsAnalysisApiUrl = g_JSComplierResource.CacheDomain+'/cache/newsanalyze';                 //新闻分析数据
    this.MaxRequestDataCount=1000;
    this.MaxRequestMinuteDayCount=5;
    this.KLineDateTimeRange;        //请求的K线日期范围

    this.LatestData=new Map();            //最新行情
    this.IndexData;             //大盘指数
    this.MarginData = new Map();  //融资融券
    this.NewsAnalysisData = new Map();    //新闻统计
    this.ExtendData = new Map();          //其他的扩展数据
    this.ScriptIndexOutData=new Map();    //调用脚本执行返回的数据
    this.OtherSymbolData=new Map();       //其他股票信息 key=symbol value=[historydata]

    //股票数据缓存 key=函数名(参数)  { Data: value=拟合的数据 , Error: } 
    //FinValue(id)
    this.StockData=new Map();  

    this.NetworkFilter;                   //网络请求回调 function(data, callback);
    this.DrawInfo;                        //当前屏信息

    //使用option初始化
    if (option)
    {
        if (option.HQDataType) this.DataType = option.HQDataType;
        if (option.Data) 
        {
            this.Data=option.Data;
            if (this.DataType != 2)   //2=分钟走势图数据 没有周期和复权
            {
                this.Period=option.Data.Period; //周期
                this.Right=option.Data.Right;   //复权
            }
            //this.Data=null;
        }

        if (option.SourceData) this.SourceData = option.SourceData;
        if (option.Symbol) this.Symbol=option.Symbol;
        if (option.Symbol) this.Symbol = option.Symbol;
        if (option.MaxRequestDataCount>0) this.MaxRequestDataCount=option.MaxRequestDataCount;
        if (option.MaxRequestMinuteDayCount>0) this.MaxRequestMinuteDayCount=option.MaxRequestMinuteDayCount;
        if (option.KLineApiUrl) this.KLineApiUrl=option.KLineApiUrl;
        if (option.NetworkFilter) this.NetworkFilter = option.NetworkFilter;
        if (option.DayCount>0) this.DayCount=option.DayCount;
        if (option.IsApiPeriod) this.IsApiPeriod=option.IsApiPeriod;

        if (option.Right) this.Right=option.Right;
        if (option.Period) this.Period=option.Period;
        if (option.KLineRange) this.KLineDateTimeRange=option.KLineRange;
        if (option.DrawInfo) this.DrawInfo=option.DrawInfo;
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
        JSNetwork.HttpRequest({
            url: self.RealtimeApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","exchangerate","amplitude"],
                "symbol": [this.Symbol]
            },
            method:"POST",
            dataType: "json",
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

    this.RecvLatestData = function (recvData)
    {
        let data=recvData.data;
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
    this.RecvLatestDataVer2=function(recvData)
    {
        let data=recvData.data;
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
        if (this.LatestData && this.LatestData.has(dataname)) return this.LatestData.get(dataname);

        return null;
    }

    this.GetVolRateData = function (job, node) 
    {
        var volrKey = job.ID.toString() + '-VolRate-' + this.Symbol;
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

    this.RecvVolRateData = function (recvData, key) 
    {
        var data=recvData.data;
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
                method: "POST",
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
                method: "POST",
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
    this.RecvOtherSymbolKData=function(recvData,job)
    {
        var data=recvData.data;
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

    this.RecvOtherSymbolKDayData=function(recvData,job)
    {
        var data=recvData.data;
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

    this.RecvOtherSymbolKMinuteData=function(recvData, job)
    {
        var data=recvData.data;
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

    //获取大盘指数数据
    this.GetIndexData=function()
    {
        if (this.IndexData) return this.Execute.RunNextJob();

        var self=this;
        if (JSCommonData.ChartData.IsDayPeriod(this.Period,true))     //请求日线数据
        {
            JSNetwork.HttpRequest({
                url: self.KLineApiUrl,
                data:
                {
                    "field": ["name", "symbol", "yclose", "open", "price", "high", "low", "vol", 'up', 'down', 'stop', 'unchanged'],
                    "symbol": '000001.sh',
                    "start": -1,
                    "count": self.MaxRequestDataCount+500   //多请求2年的数据 确保股票剔除停牌日期以后可以对上
                },
                method: 'POST',
                dataType: "json",
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
        else if (JSCommonData.ChartData.IsMinutePeriod(this.Period, true))          //请求分钟数据
        {
            JSNetwork.HttpRequest({
                url: self.MinuteKLineApiUrl,
                data:
                {
                    "field": ["name","symbol","yclose","open","price","high","low","vol"],
                    "symbol": '000001.sh',
                    "start": -1,
                    "count": self.MaxRequestMinuteDayCount+5
                },
                method: 'POST',
                dataType: "json",
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

    this.RecvIndexHistroyData=function(recvData)
    {
        let data = recvData.data;
        JSConsole.Complier.Log('[JSSymbolData::RecvIndexHistroyData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        this.IndexData = new JSCommonData.ChartData();
        this.IndexData.DataType=0; /*日线数据 */
        this.IndexData.Data=hisData;

        var aryOverlayData = this.SourceData.GetOverlayData(this.IndexData.Data);      //和主图数据拟合以后的数据
        this.IndexData.Data=aryOverlayData;

        if (JSCommonData.ChartData.IsDayPeriod(this.Period, false))   //周期数据
        {
            let periodData=this.IndexData.GetPeriodData(this.Period);
            this.IndexData.Data=periodData;
        }
    }

    this.RecvIndexMinuteHistroyData = function (recvData)
    {
        let data = recvData.data;
        JSConsole.Complier.Log('[JSSymbolData::RecvIndexMinuteHistroyData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        this.IndexData = new JSCommonData.ChartData();
        this.IndexData.DataType=1; /*分钟线数据 */
        this.IndexData.Data=hisData;

        if (JSCommonData.ChartData.IsMinutePeriod(this.Period, false))   //周期数据
        {
            let periodData=this.IndexData.GetPeriodData(this.Period);
            this.IndexData.Data=periodData;
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

    //分钟涨幅股票个数统计数据下载
    this.GetIndexIncreaseData = function (job) 
    {
        var upKey = job.ID.toString() + '-UpCount-' + job.Symbol;
        var downKey = job.ID.toString() + '-DownCount-' + job.Symbol;
        if (this.ExtendData.has(upKey) && this.ExtendData.has(downKey)) return this.Execute.RunNextJob();

        var symbol = job.Symbol;
        symbol = symbol.replace('.CI', '.ci');
        var self = this;
        var apiUrl = g_JSComplierResource.CacheDomain + '/cache/analyze/increaseanalyze/' + symbol + '.json';
        JSConsole.Complier.Log('[JSSymbolData::GetIndexIncreaseData] Get url=', apiUrl);
        JSNetwork.HttpRequest({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (data) 
            {
                self.RecvMinuteIncreaseData(data, { UpKey: upKey, DownKey: downKey });
                self.Execute.RunNextJob();
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvMinuteIncreaseData = function (recvData, key) 
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteIncreaseData] recv data', recvData);
        var data=recvData.data;
        if (!data.minute) return;
        var minuteData = data.minute;
        if (!minuteData.time || !minuteData.up || !minuteData.down) return;
        var upData = [], downData = [];
        for (var i = 0; i < minuteData.time.length; ++i) {
            upData[i] = minuteData.up[i];
            downData[i] = minuteData.down[i];
        }

        this.ExtendData.set(key.UpKey, upData);
        this.ExtendData.set(key.DownKey, downData);
    }

    //分钟涨幅股票个数统计数据
    this.GetIndexIncreaseCacheData = function (funcName, symbol, node) {
        var key;
        if (funcName == 'UPCOUNT') key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA.toString() + '-UpCount-' + symbol;
        else if (funcName == 'DOWNCOUNT') key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA.toString() + '-DownCount-' + symbol;

        if (!key || !this.ExtendData.has(key)) this.Execute.ThrowUnexpectedNode(node, '不支持函数' + funcName + '(' + symbol + ')');

        return this.ExtendData.get(key);
    }

    this.GetSymbolData=function()
    {
        if (this.Data) return this.Execute.RunNextJob();
           
        let self=this;

        if (this.DataType === 2)  //当天分钟数据
        {
            JSNetwork.HttpRequest({
                url: self.RealtimeApiUrl,
                data:
                {
                    "field": ["name", "symbol", "yclose", "open", "price", "high", "low", "vol", "amount", "date", "minute", "time", "minutecount"],
                    "symbol": [self.Symbol],
                    "start": -1
                },
                method: 'POST',
                dataType: "json",
                async: true,
                success: function (recvData) {
                    self.RecvMinuteData(recvData);
                    self.Execute.RunNextJob();
                }
            });
            return;
        }

        if (JSCommonData.ChartData.IsDayPeriod(this.Period,true))     //请求日线数据
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
                method: 'POST',
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
        else if (JSCommonData.ChartData.IsMinutePeriod(this.Period, true))               //请求分钟数据
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
                method: 'POST',
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

    this.RecvHistroyData=function(recvData)
    {
        let data=recvData.data;
        JSConsole.Complier.Log('[JSSymbolData::RecvHistroyData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        this.Data=new JSCommonData.ChartData();
        this.Data.DataType=0; /*日线数据 */
        this.Data.Data=hisData;
        this.SourceData = new JSCommonData.ChartData;
        this.SourceData.Data = hisData;

        if (this.IsApiPeriod)   //后台周期 前端不处理
        {

        }
        else
        {
            if (this.Right>0)    //复权
            {
                let rightData=this.Data.GetRightDate(this.Right);
                this.Data.Data=rightData;
            }
    
            if (JSCommonData.ChartData.IsDayPeriod(this.Period, false))   //周期数据
            {
                let periodData=this.Data.GetPeriodData(this.Period);
                this.Data.Data=periodData;
            }
        }
        
        this.Data.Right=this.Right;
        this.Data.Period=this.Period;
        this.Name = data.name;
    }

    this.RecvMinuteHistroyData = function (recvData)
    {
        let data = recvData.data;
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteHistroyData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        this.Data = new JSCommonData.ChartData();
        this.Data.DataType=1; /*分钟线数据 */
        this.Data.Data=hisData;
        this.SourceData = new JSCommonData.ChartData;
        this.SourceData.Data = hisData;

        if (this.IsApiPeriod)   //后台周期 前端不处理
        {

        }
        else
        {
            if (JSCommonData.ChartData.IsMinutePeriod(this.Period, false))   //周期数据
            {
                let periodData=this.Data.GetPeriodData(this.Period);
                this.Data.Data=periodData;
            }
        }
        
        this.Data.Period=this.Period;
        this.Name = data.name;
    }

    //最新的分钟数据走势图
    this.RecvMinuteData = function (recvData) 
    {
        let data = recvData.data;
        JSConsole.Complier.Log('[JSSymbolData::RecvMinuteData] recv data', data);

        var aryMinuteData = this.JsonDataToMinuteData(data);
        this.Data = new JSCommonData.ChartData();
        this.Data.DataType = 2; /*分钟走势图数据 */
        this.Data.Data = aryMinuteData;

        this.Name = data.stock[0].name;
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
            case 'VOLINSTK':
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

    this.GetCurrBarsCount=function()
    {
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return new Array();

        let lCount=this.Data.Data.length;
        let result=[];
        for(let i=lCount-1;i>=0;--i)
            result.push(i);

        return result;
    }

    this.GetTotalBarsCount=function()
    {
        let lCount=this.Data.Data.length;
        return lCount;
    }

    this.GetTotalTradeMinuteCount=function()
    {
        var data=g_MinuteCoordinateData.GetCoordinateData(this.Symbol);
        if (data && data.Count>0) return data.Count-1;
        return 242;
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

    this.GetIsLastBar = function () 
    {
        let result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result

        let lCount = this.Data.Data.length;
        for (let i = 0; i < lCount; ++i) 
        {
            if (i == lCount - 1) result.push(1);
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

    //融资融券函数
    this.GetMarginCacheData = function (id, node) 
    {
        let jobID = JS_EXECUTE_JOB_ID.GetMarginJobID(id);
        if (!jobID) this.Execute.ThrowUnexpectedNode(node, '不支持MARGIN(' + id + ')');
        if (this.MarginData.has(jobID)) return this.MarginData.get(jobID);

        return [];
    }

    //下融资融券
    this.GetMarginData = function (jobID) 
    {
        if (this.MarginData.has(jobID)) return this.Execute.RunNextJob();

        JSConsole.Complier.Log('[JSSymbolData::GetMarginData] jobID=', jobID);
        var self = this;
        let fieldList = ["name", "date", "symbol"];

        switch (jobID) 
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
                    "orderfield": "date"
                },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (recvData) {
                self.RecvMarginData(recvData, jobID);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvMarginData = function (recvData, jobID) 
    {
        var data = recvData.data;
        //JSConsole.Complier.Log(data);
        if (!data.stock || data.stock.length != 1) return;

        let stock = data.stock[0];
        var aryData = new Array();
        var aryData2 = [], aryData3 = [], aryData4 = [];  //其他3个数据
        for (let i in stock.stockday) 
        {
            var item = stock.stockday[i];
            var marginData = item.margin;
            if (!marginData) continue;

            let indexData = new JSCommonData.SingleData();
            indexData.Date = item.date;

            switch (jobID) 
            {
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:
                    if (!this.IsNumber(marginData.balance)) continue;
                    indexData.Value = marginData.balance; //融资融券余额
                    aryData.push(indexData);
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:
                    if (!this.IsNumber(marginData.rate)) continue;
                    indexData.Value = marginData.rate;    //融资占比
                    aryData.push(indexData);
                    break;

                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE:       //买入信息-融资余额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT:        //买入信息-买入额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY:         //买入信息-偿还额
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET:           //买入信息-融资净买入
                    var buyData = marginData.buy;
                    if (!buyData) continue;
                    if (!this.IsNumber(buyData.balance) || !this.IsNumber(buyData.amount) || !this.IsNumber(buyData.repay) || !this.IsNumber(buyData.net)) continue;

                    indexData.Value = buyData.balance;
                    var indexData2 = new JSCommonData.SingleData();
                    indexData2.Date = item.date;
                    indexData2.Value = buyData.amount;
                    var indexData3 = new JSCommonData.SingleData();
                    indexData3.Date = item.date;
                    indexData3.Value = buyData.repay;
                    var indexData4 = new JSCommonData.SingleData();
                    indexData4.Date = item.date;
                    indexData4.Value = buyData.net;

                    aryData.push(indexData);
                    aryData2.push(indexData2);
                    aryData3.push(indexData3);
                    aryData4.push(indexData4);
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE:      //卖出信息-融券余量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME:       //卖出信息-卖出量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY:        //卖出信息-偿还量
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET:          //卖出信息-融券净卖出
                    var sellData = marginData.sell;
                    if (!sellData) continue;
                    if (!this.IsNumber(sellData.balance) || !this.IsNumber(sellData.volume) || !this.IsNumber(sellData.repay) || !this.IsNumber(sellData.net)) continue;

                    indexData.Value = buyData.balance;
                    var indexData2 = new JSCommonData.SingleData();
                    indexData2.Date = item.date;
                    indexData2.Value = buyData.volume;
                    var indexData3 = new JSCommonData.SingleData();
                    indexData3.Date = item.date;
                    indexData3.Value = buyData.repay;
                    var indexData4 = new JSCommonData.SingleData();
                    indexData4.Date = item.date;
                    indexData4.Value = buyData.net;

                    aryData.push(indexData);
                    aryData2.push(indexData2);
                    aryData3.push(indexData3);
                    aryData4.push(indexData4);
                    break;
                default:
                    continue;
            }
        }

        var allData = [];
        if (jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE || jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE) 
        {
            allData.push({ JobID: jobID, Data: aryData });
        }
        else if (jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE || jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT ||
            jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY || jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET) 
        {
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE, Data: aryData });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT, Data: aryData2 });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY, Data: aryData3 });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET, Data: aryData4 });
        }
        else if (jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE || jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME ||
            jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY || jobID === JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET) 
        {
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE, Data: aryData });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME, Data: aryData2 });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY, Data: aryData3 });
            allData.push({ JobID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET, Data: aryData4 });
        }

        for (let i in allData) 
        {
            let aryFixedData = this.Data.GetFittingData(allData[i].Data);

            var bindData = new JSCommonData.ChartData();
            bindData.Data = aryFixedData;
            bindData.Period = this.Period;    //周期

            if (bindData.Period > 0)          //周期数据
            {
                var periodData = bindData.GetPeriodSingleData(bindData.Period);
                bindData.Data = periodData;
            }

            let data = bindData.GetValue();
            this.MarginData.set(allData[i].JobID, data);
        }
    }

    this.GetNewsAnalysisCacheData = function (id, node) 
    {

        let jobID = JS_EXECUTE_JOB_ID.GetNewsAnalysisID(id);
        if (!jobID) this.Execute.ThrowUnexpectedNode(node, '不支持NEWS(' + id + ')');
        if (this.NewsAnalysisData.has(jobID)) return this.NewsAnalysisData.get(jobID);

        return [];
    }

    //下载新闻统计
    this.GetNewsAnalysisData = function (jobID) 
    {
        if (this.NewsAnalysisData.has(jobID)) return this.Execute.RunNextJob();

        var self = this;
        var mapFolder = new Map([
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE, "negative"],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH, 'research'],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT, 'interact'],
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE, 'holderchange'],        //NEWS(4)   股东增持
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2, 'holderchange'],       //NEWS(5)   股东减持
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER, 'trustholder'],          //NEWS(6)   信托持股
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING, 'Blocktrading'],        //NEWS(7)   大宗交易
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS, 'companynews'],          //NEWS(8)   官网新闻
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS, 'topmanagers'],          //NEWS(9)   高管要闻
            [JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE, 'Pledge'],            //NEWS(10)  股权质押
        ]);

        if (!mapFolder.has(jobID)) 
        {
            this.Execute.RunNextJob();
            return;
        }

        var folderName = mapFolder.get(jobID);
        var url = this.StockNewsAnalysisApiUrl + '/' + folderName + '/' + this.Symbol + '.json';

        //请求数据
        JSNetwork.HttpRequest({
            url: url,
            method: 'GET',
            dataType: "json",
            async: true,
            success: function (recvData) 
            {
                if (recvData.statusCode==200)
                    self.RecvNewsAnalysisData(recvData, jobID);
                else
                    self.RecvNewsAnalysisDataError(recvData, jobID);
                self.Execute.RunNextJob();
            },
            fail: function (request, textStatus) 
            {
                //self.RecvNewsAnalysisDataError(request, textStatus, jobID);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvNewsAnalysisDataError = function (recvData, jobID) 
    {
        JSConsole.Complier.Log('[JSSymbolData::RecvNewsAnalysisDataError] request error.', recvData.statusCode);

        //没有新闻使用0数据填充
        var aryData = [];
        for (var i = 0; i < this.Data.Data.length; ++i) 
        {
            var item = new JSCommonData.SingleData();
            item.Date = this.Data.Data[i].Date;
            item.Value = 0
            aryData.push(item);
        }

        var bindData = new JSCommonData.ChartData();
        bindData.Data = aryData;
        this.NewsAnalysisData.set(jobID, bindData.GetValue());
    }

    this.RecvNewsAnalysisData = function (recvData, jobID) 
    {
        var data=recvData.data;
        if (!data.data || !data.date) return;
        if (data.data.length <= 0 || data.data.length != data.date.length) return;

        JSConsole.Complier.Log('[JSSymbolData::RecvNewsAnalysisData] jobID', jobID, data.update);
        if (jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE || jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2) 
        {
            var aryData = [], aryData2 = [];
            for (var i = 0; i < data.data.length; ++i) 
            {
                var item = new JSCommonData.SingleData();
                item.Date = data.date[i];
                item.Value = data.data[i];
                if (this.IsNumber(item.Value)) aryData.push(item);

                if (i < data.data2.length) 
                {
                    item = new JSCommonData.SingleData();
                    item.Date = data.date[i];
                    item.Value = data.data2[i];
                    if (this.IsNumber(item.Value)) aryData2.push(item);
                }
            }

            let aryFixedData = this.Data.GetFittingData2(aryData, 0);
            var bindData = new JSCommonData.ChartData();
            bindData.Data = aryFixedData;
            this.NewsAnalysisData.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE, bindData.GetValue());

            aryFixedData = this.Data.GetFittingData2(aryData2, 0);
            bindData = new JSCommonData.ChartData();
            bindData.Data = aryFixedData;
            this.NewsAnalysisData.set(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2, bindData.GetValue());
        }
        else
        {
            var aryData = [];
            for (var i = 0; i < data.data.length; ++i) 
            {
                var item = new JSCommonData.SingleData();
                item.Date = data.date[i];
                item.Value = data.data[i];
                aryData.push(item);
            }

            let aryFixedData = this.Data.GetFittingData2(aryData, 0);

            var bindData = new JSCommonData.ChartData();
            bindData.Data = aryFixedData;

            this.NewsAnalysisData.set(jobID, bindData.GetValue());
        }
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
                self.RecvStockValue(recvData,jobItem,key,0);
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
                Name:'JSSymbolData::GetVariantData', //类名::
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
                Request:{ Url:"数据地址", Type:'POST', Data:{ VariantName:jobItem.VariantName, symbol: this.Symbol, daterange:dateRange } },
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
                        JobItem:jobItem //函数编译信息
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
                    if (JSCommonData.ChartData.IsDayPeriod(this.Period,true))
                        aryFittingData=kdata.GetFittingFinanceData(recvData);        //数据和主图K线拟合
                    else if (JSCommonData.ChartData.IsMinutePeriod(this.Period,true))
                        aryFittingData=kdata.GetMinuteFittingFinanceData(recvData);  //数据和主图K线拟合
                    else 
                        return;
                }
                else
                {
                    aryFittingData=kdata.GetMinuteFittingFinanceData(recvData);  //数据和主图分时拟合
                }
        
                var bindData=new JSCommonData.ChartData();
                bindData.Data=aryFittingData;
                var result=bindData.GetValue();

                if (key=="EXCHANGE")    //计算换手率=成交量/流通股本*100
                {
                    for(var i in result)
                    {
                        var kitem=kdata.Data[i];
                        if (result[i]>0)
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
        else if (dataType==2)   //数据不做平滑处理
        {
            var kdata=this.Data;   //K线
            var aryFittingData;
            if (this.DataType==HQ_DATA_TYPE.KLINE_ID)
            {
                if (JSCommonData.ChartData.IsDayPeriod(this.Period,true))
                    aryFittingData=kdata.GetFittingTradeData(recvData, 0, false);        //数据和主图K线拟合
                else if (JSCommonData.ChartData.IsMinutePeriod(this.Period,true))
                    aryFittingData=kdata.GetMinuteFittingTradeData(recvData, 0, false);  //数据和主图K线拟合
                else 
                    return;
            }
            else
            {
                aryFittingData=kdata.GetMinuteFittingTradeData(recvData, 0);  //数据和主图分钟拟合
            }
        
            var bindData=new JSCommonData.ChartData();
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
            if (this.IsNumber(item))
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

    this.DownloadCustomAPIData = function (job) 
    {
        if (!this.NetworkFilter) return this.Execute.RunNextJob();

        var args = [];
        for (var i in job.Args) 
        {
            var item = job.Args[i];
            if (item.Type == Syntax.Literal) 
            {
                args.push(item.Value);
            }
            else if (item.Type == Syntax.Identifier)  //变量 !!只支持默认的变量值
            {
                var isFind = false;
                for (var j in this.Arguments) 
                {
                    const argItem = this.Arguments[j];
                    if (argItem.Name == item.Name) 
                    {
                        args.push(argItem.Value);
                        isFind = true;
                        break;
                    }
                }

                if (!isFind) 
                {
                    var token = job.Token;
                    this.Execute.ErrorHandler.ThrowError(token.Index, token.Line, 0, `LoadAPIData() Error: can't read ${item.Name}`);
                }
            }
            else 
            {
                return this.Execute.RunNextJob();
            }
        }

        var self = this;
        var obj =
        {
            Name: 'JSSymbolData::DownloadCustomAPIData', //类名::函数名
            Explain: '下载自定义api数据',
            Period: this.Period,
            Right: this.Right,
            Symbol: this.Symbol,
            KData: this.Data,        //K线数据
            Cache: this.CustomAPIData,
            Args: args,
            Self: this,
            PreventDefault: false
        };

        this.NetworkFilter(obj, function (data) {
            self.RecvCustomAPIData(data, args);
            self.Execute.RunNextJob();
        });

        if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求

        this.Execute.RunNextJob();
    }

    this.RecvCustomAPIData = function (recvData, args) 
    {
        if (!recvData || !recvData.data) return;

        var data = recvData.data;
        var apiKey = this.GenerateCustomAPIKey(args);
        if (JSCommonData.ChartData.IsMinutePeriod(this.Period, true)) 
        {
            if (!data.date || !data.time) return;

            var date = data.date;
            var time = data.time;
            for (var key in data) 
            {
                if (key == 'date' || key == 'time') continue;
                var item = data[key];
            }
        }
        else if (JSCommonData.ChartData.IsDayPeriod(this.Period, true)) 
        {
            if (!data.date) return;

            var date = data.date;
            var result = { __Type__: "Object" };
            for (var key in data) {
                if (key == 'date') continue;

                var item = data[key];
                if (Array.isArray(item)) 
                {
                    var value = this.FittingCustomAPIArray(item, date);
                    result[key] = value;
                }
                else if (this.IsNumber(item)) 
                {
                    result[key] = item;
                }
            }

            this.CustomAPIData.set(apiKey, result);
        }
    }

    this.FittingCustomAPIArray = function (data, date, time) 
    {
        var kdata = this.Data;   //K线

        var arySingleData = [];
        for (var i in data) 
        {
            var value = data[i];
            var indexItem = new JSCommonData.SingleData(); //单列指标数据
            indexItem.Date = date[i];
            if (time && i < time.length) indexItem.Time = time[i];
            indexItem.Value = value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (JSCommonData.ChartData.IsDayPeriod(this.Period, true))
            aryFittingData = kdata.GetFittingData(arySingleData);        //数据和主图K线拟合
        else if (JSCommonData.ChartData.IsMinutePeriod(this.Period, true))
            aryFittingData = kdata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合
        else
            return null;

        var bindData = new JSCommonData.ChartData();
        bindData.Data = aryFittingData;
        var result = bindData.GetValue();
        return result;
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
        var up = 8, down = 9, stop = 10, unchanged = 11;
        for (var i = 0; i < list.length; ++i)
        {
            var item = new JSCommonData.HistoryData();

            item.Date = list[i][date];
            item.Open = list[i][open];
            item.YClose = list[i][yclose];
            item.Close = list[i][close];
            item.High = list[i][high];
            item.Low = list[i][low];
            item.Vol = list[i][vol];    //原始单位股
            item.Amount = list[i][amount];

            if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除

            //上涨 下跌家数
            if (list[i].length > up) item.Up = list[i][up];
            if (list[i].length > down) item.Down = list[i][down];
            if (list[i].length > stop) item.Stop = list[i][stop];
            if (list[i].length > unchanged) item.Unchanged = list[i][unchanged];

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
            let item = new JSCommonData.HistoryData();

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
    this.JsonDataToMinuteData = function (data) 
    {
        var aryMinuteData = new Array();
        for (var i in data.stock[0].minute) 
        {
            var jsData = data.stock[0].minute[i];
            var item = new JSCommonData.MinuteData();

            item.Close = jsData.price;
            item.Open = jsData.open;
            item.High = jsData.high;
            item.Low = jsData.low;
            item.Vol = jsData.vol; //股
            item.Amount = jsData.amount;
            if (i == 0)      //第1个数据 写死9：25
                item.DateTime = data.stock[0].date.toString() + " 0925";
            else
                item.DateTime = data.stock[0].date.toString() + " " + jsData.time.toString();
            item.Date = data.stock[0].date;
            item.Time = jsData.time;
            item.Increate = jsData.increate;
            item.Risefall = jsData.risefall;
            item.AvPrice = jsData.avprice;

            aryMinuteData[i] = item;
        }

        return aryMinuteData;
    }

    //CODELIKE 模糊股票代码
    this.CODELIKE=function(value)
    {
        if (this.Symbol.indexOf(value)==0) return 1;

        return 0;
    }

    this.NAMELIKE = function (value) 
    {
        if (this.Name && this.Name.indexOf(value) == 0) return 1;
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

    this.GetSymbol = function () { return this.Symbol; }

    this.GetName = function () { return this.Name; }

    this.TIME=function()
    {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for(let i in this.Data.Data)
        {
            var item=this.Data.Data[i];
            if (this.IsNumber(item.Time))
                result[i]=item.Time;
            else
                result[i]=0;
        }

        return result;
    }

    this.DATE = function () 
    {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for (let i in this.Data.Data) 
        {
            var item = this.Data.Data[i];
            result[i] = item.Date - 19000000;;
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
    
    this.YEAR = function () 
    {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for (let i in this.Data.Data) 
        {
            var item = this.Data.Data[i];
            if (this.IsNumber(item.Date))
                result[i] = parseInt(item.Date / 10000);
            else
                result[i] = null;
        }

        return result;
    }

    this.MONTH = function () 
    {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for (let i in this.Data.Data) 
        {
            var item = this.Data.Data[i];
            if (this.IsNumber(item.Date))
                result[i] = parseInt(item.Date % 10000 / 100);
            else
                result[i] = null;
        }

        return result;
    }

    //星期 1-7
    this.WEEK = function ()
     {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        var tempDate = new Date();
        for (let i in this.Data.Data) 
        {
            var item = this.Data.Data[i];
            result[i] = null;
            if (!this.IsNumber(item.Date)) continue;

            var year = parseInt(item.Date / 10000);
            var month = parseInt(item.Date % 10000 / 100);
            var day = item.Date % 100;

            tempDate.setFullYear(year, month - 1, day);
            result[i] = tempDate.getDay();
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

    this.REFDATE = function (data, date) 
    {
        var result = null;

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

        var index = null;
        for (let i in this.Data.Data)   //查找日期对应的索引
        {
            if (this.Data.Data[i].Date == findDate) 
            {
                index = parseInt(i);
                break;
            }
        }

        if (index == null || index >= data.length) return null;

        return data[index];
    }

    //用法:结果从0到11,依次分别是1/5/15/30/60分钟,日/周/月,多分钟,多日,季,年
    this.PERIOD=function()
    {
        //Period周期 0=日线 1=周线 2=月线 3=年线 9=季线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
        const PERIOD_MAP=[5,6,7,11, 0,1,2,3,4,5, 9];
        if (this.Period >= 0 && this.Period <= PERIOD_MAP.length - 1)
            return PERIOD_MAP[this.Period];
        
        return this.Period;
    } 

    this.GetDrawNull = function () 
    {
        var result = [];
        if (!this.Data || !this.Data.Data || !this.Data.Data.length) return result;

        for (let i in this.Data.Data) 
        {
            result[i] = null;
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
}

//是否有是有效的数字
JSSymbolData.prototype.IsNumber = function (value) 
{
    if (value == null) return false;
    if (isNaN(value)) return false;

    return true;
}

JSSymbolData.prototype.IsDivideNumber = function (value) 
{
    if (value == null) return false;
    if (isNaN(value)) return false;
    if (value == 0) return false;

    return true;
}

JSSymbolData.prototype.JsonDataToFinance = function (data)
 {
    var financeData;

    for (let i = 1; i <= 4; ++i) 
    {
        switch (i) 
        {
            case 1:
                var finance = data.finance1;
                var announcement = data.announcement1;
                break;
            case 2:
                var finance = data.finance2;
                var announcement = data.announcement2;
                break;
            case 3:
                var finance = data.finance3;
                var announcement = data.announcement3;
                break;
            case 4:
                var finance = data.finance4;
                var announcement = data.announcement4;
                break;
            default:
                break;
        }

        if (!finance || !announcement || !this.IsNumber(announcement.year) || !this.IsNumber(announcement.quarter)) continue;
        if (financeData)    //如果存在1天公布多个报告期数据 只取最新的一个公告期数据
        {
            if (financeData.Announcement.year < announcement.year)
                financeData = { Date: data.date, Finance: finance, Announcement: announcement };
        }
        else 
        {
            financeData = { Date: data.date, Finance: finance, Announcement: announcement };
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
    JOB_DOWNLOAD_INDEX_INCREASE_DATA: 4, //涨跌股票个数统计数据
    JOB_DOWNLOAD_VOLR_DATA: 5,           //5日量比均量下载量比数据
    JOB_DOWNLOAD_OTHER_SYMBOL_DATA:9,   //下载其他股票的K线数据

    JOB_DOWNLOAD_FINVALUE:301,                  //引用专业财务数据 FINVALUE(ID),ID为数据编号
    JOB_DOWNLOAD_FINONE:302,                    //引用指定年和月日的某类型的财务数据 FINONE(ID,Y,MMDD),ID为数据编号,Y和MMDD表示年和月日.
    JOB_DOWNLOAD_FINANCE:303,                   //FINANCE(ID) 基础财务数据
    JOB_DOWNLOAD_GPJYVALUE:304,                 //引用股票交易类数据 GPJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
    JOB_DOWNLOAD_VARIANT:305,                   //CAPITAL , TOTALCAPITAL, EXCHANGE

    JOB_CUSTOM_FUNCTION_DATA:6000,       //自定义函数
    JOB_CUSTOM_VARIANT_DATA:6001,        //自定义变量
    JOB_CUSTOM_DATA_FUNCTION:6002,     //自定义数据函数

    JOB_DOWNLOAD_MARGIN_BALANCE: 1000,           //融资融券余额
    JOB_DOWNLOAD_MARGIN_RATE: 1001,              //融资占比

    JOB_DOWNLOAD_MARGIN_BUY_BALANCE: 1010,       //买入信息-融资余额
    JOB_DOWNLOAD_MARGIN_BUY_AMOUNT: 1011,        //买入信息-买入额
    JOB_DOWNLOAD_MARGIN_BUY_REPAY: 1012,         //买入信息-偿还额
    JOB_DOWNLOAD_MARGIN_BUY_NET: 1013,           //买入信息-融资净买入

    JOB_DOWNLOAD_MARGIN_SELL_BALANCE: 1020,      //卖出信息-融券余量
    JOB_DOWNLOAD_MARGIN_SELL_VOLUME: 1021,       //卖出信息-卖出量
    JOB_DOWNLOAD_MARGIN_SELL_REPAY: 1022,        //卖出信息-偿还量
    JOB_DOWNLOAD_MARGIN_SELL_NET: 1023,          //卖出信息-融券净卖出

    JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE: 2000,             //负面新闻统计
    JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH: 2001,             //机构调研
    JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT: 2002,             //互动易
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE: 2003,         //股东增持
    JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2: 2004,        //股东减持
    JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER: 2005,          //信托持股
    JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING: 2006,         //大宗交易
    JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS: 2007,          //官网新闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS: 2008,          //高管要闻
    JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE: 2009,               //股权质押

    JOB_DOWNLOAD_CUSTOM_API_DATA: 30000,    //自定义数据

    //调用其他脚本指标 
    //KDJ.K , KDJ.K#WEEK
    //STKINDI('600000.sh','MA.MA1#WEEK',5,10,20,30,60,120);
    JOB_EXECUTE_INDEX:30010,  

    JOB_RUN_SCRIPT:10000, //执行脚本

    //融资融券
    GetMarginJobID: function (value) 
    {
        let dataMap = new Map([
            [1, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE],          //MARGIN(1)   融资融券余额
            [2, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE],             //MARGIN(2)   融资占比

            [3, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE],       //MARGIN(3)   买入信息-融资余额
            [4, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT],        //MARGIN(4)   买入信息-买入额
            [5, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY],         //MARGIN(5)   买入信息-偿还额
            [6, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET],           //MARGIN(6)   买入信息-融资净买入

            [7, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE],      //MARGIN(7)   卖出信息-融券余量
            [8, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME],       //MARGIN(8)   卖出信息-卖出量
            [9, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY],        //MARGIN(9)   卖出信息-偿还量
            [10, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET],         //MARGIN(10)  卖出信息-融券净卖出
        ]);

        if (dataMap.has(value)) return dataMap.get(value);

        return null;
    },

    GetNewsAnalysisID: function (value) 
    {
        let dataMap = new Map([
            [1, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE],          //NEWS(1)   负面新闻统计
            [2, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH],          //NEWS(2)   机构调研统计
            [3, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT],          //NEWS(3)   互动易
            [4, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE],      //NEWS(4)   股东增持
            [5, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2],     //NEWS(5)   股东减持
            [6, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER],       //NEWS(6)   信托持股
            [7, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING],      //NEWS(7)   大宗交易
            [8, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS],       //NEWS(8)   官网新闻
            [9, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS],       //NEWS(9)   高管要闻
            [10, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE],           //NEWS(10)  股权质押    
        ]);

        if (dataMap.has(value)) return dataMap.get(value);

        return null;
    }

};

function JSExecute(ast,option)
{
    this.AST=ast;   //语法树

    this.ErrorHandler=new ErrorHandler();
    this.VarTable=new Map();        //变量表
    this.VarDrawTable=new Map();    //绘图变量表
    this.OutVarTable=new Array();   //输出变量
    this.Arguments=[];

    //脚本自动变量表, 只读
    this.ConstVarTable=new Map([
        //个股数据
        ['CLOSE', null], ['VOL', null], ['OPEN', null], ['HIGH', null], ['LOW', null], ['AMOUNT', null], ['AMO', null], 
        ['C', null], ['V', null], ['O', null], ['H', null], ['L', null], 
        ['VOLR', null],
        ['VOLINSTK',null], ["OPI",null],    //持仓量
        ["QHJSJ",null], ["SETTLE",null],    //结算价
        ["ZSTJJ",null],     //分时图均价线,对于分时图周期指标有效.
        ["ISEQUAL",null], ["ISUP",null],["ISDOWN"], //ISUP=收阳 ISEQUAL=平盘 ISDOWN=收阴

        //日期类
        ['DATE', null], ['YEAR', null], ['MONTH', null], ['PERIOD', null], ['WEEK', null],['WEEKDAY',null],["TIME",null],["DATETIME",null],["TIME2",null],
        ["WEEKOFYEAR", null],["DAYSTOTODAY", null],

        ["HOUR",null],["MINUTE",null],
        
        //大盘数据
        ['INDEXA',null],['INDEXC',null],['INDEXH',null],['INDEXL',null],['INDEXO',null],['INDEXV',null],
        ['INDEXADV', null], ['INDEXDEC', null],

        ['FROMOPEN',null],      //已开盘有多长分钟
        ['TOTALFZNUM', null],   //该品种的每天的总交易分钟数.

        ['CURRBARSCOUNT', null], //到最后交易日的周期数
        ['TOTALBARSCOUNT',null],
        ['ISLASTBAR', null],     //判断是否为最后一个周期
        ['BARSTATUS',null],     //BARSTATUS返回数据位置信息,1表示第一根K线,2表示最后一个数据,0表示中间位置.

        ["BARPOS", null],   //返回从第一根K线开始到当前的周期数
        
        ["TOTALCAPITAL",null],  //总股本
        ['CAPITAL', null],   //流通股本（手）
        ['EXCHANGE', null],  //换手率
        ['SETCODE', null],   //市场类型
        ['CODE', null],      //品种代码
        ['STKNAME', null],   //品种名称 
        ["TQFLAG",null],    //TQFLAG  当前的复权状态,0:无复权 1:前复权 2:后复权 

        ['HYBLOCK', null],   //所属行业板块
        ['DYBLOCK', null],   //所属地域板块
        ['GNBLOCK', null],    //所属概念
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

        ['DRAWNULL', null],
        ["NULL",null], 

        ["MACHINEDATE",null],["MACHINETIME",null],["MACHINEWEEK",null],

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
    ]);   

    this.SymbolData=new JSSymbolData(this.AST,option,this);
    this.Algorithm = new JSAlgorithm(this.ErrorHandler, this.SymbolData);
    this.Draw = new JSDraw(this.ErrorHandler, this.SymbolData);
    this.JobList=[];    //执行的任务队列

    this.UpdateUICallback=null; //回调
    this.CallbackParam=null;

    this.Interrupt={ Exit:false };  //中断信息

    if (option)
    {
        if (option.Callback) this.UpdateUICallback=option.Callback;
        if (option.CallbackParam) this.CallbackParam=option.CallbackParam;
        if (option.Arguments) this.Arguments=option.Arguments;
    }

    this.Execute=function()
    {
        JSConsole.Complier.Log('[JSExecute::Execute] JobList', this.JobList);
        this.RunNextJob();
    }

    this.RunNextJob=function()
    {
        if (this.JobList.length<=0) return;

        var jobItem=this.JobList.shift();

        switch (jobItem.ID)
        {
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA:
                return this.SymbolData.GetSymbolData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA:
                return this.SymbolData.GetIndexData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA:
                return this.SymbolData.GetIndexIncreaseData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA:
                return this.SymbolData.GetLatestData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA:  //量比
                return this.SymbolData.GetVolRateData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_OTHER_SYMBOL_DATA:  //指定股票数据
                return this.SymbolData.GetOtherSymbolData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINONE:
                return this.SymbolData.GetFinOne(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINVALUE:
                return this.SymbolData.GetFinValue(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FINANCE:
                return this.SymbolData.GetFinance(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GPJYVALUE:
                return this.SymbolData.GetGPJYValue(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VARIANT:    //CAPITAL, TOTALCAPITAL 
                return this.SymbolData.GetVariantData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_VARIANT_DATA:
                return this.SymbolData.GetCustomVariantData(jobItem);

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_FUNCTION_DATA:
                return this.SymbolData.GetCustomFunctionData(jobItem);  

            case JS_EXECUTE_JOB_ID.JOB_CUSTOM_DATA_FUNCTION:
                    return this.SymbolData.GetCustomFunctionDataV2(jobItem);

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

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA:
                return this.SymbolData.DownloadCustomAPIData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_EXECUTE_INDEX:
                return this.SymbolData.CallScriptIndex(jobItem, this.VarTable);

            case JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT:
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

            //大盘数据
            case 'INDEXA':
            case 'INDEXC':
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
            
            case 'TIME':
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
            case 'PERIOD':
                return this.SymbolData.PERIOD();

            case 'DRAWNULL':
            case "NULL":
                return this.SymbolData.GetDrawNull();

            case "HOUR":
                return this.SymbolData.HOUR();
            case "MINUTE":
                return this.SymbolData.MINUTE();

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
            default:
                this.ThrowUnexpectedNode(node, '变量'+name+'不存在', name);
        }
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

        if (name.indexOf("COLOR")==0)
        {
            var colorValue=JSComplier.ColorVarToRGB(name);
            if (colorValue) return colorValue;
        }

        this.ThrowUnexpectedNode(node, '变量'+name+'不存在');
        return null;
    }

    this.ReadMemberVariable = function (node) 
    {
        var obj = node.Object;
        var member = node.Property;

        let maiObj;
        if (obj.Type == Syntax.BinaryExpression || obj.Type == Syntax.LogicalExpression)
            maiObj = this.VisitBinaryExpression(obj);
        else if (obj.Type == Syntax.CallExpression)
            maiObj = this.VisitCallExpression(obj);
        else
            maiObj = this.GetNodeValue(obj);

        if (!maiObj) return null;
        var value = maiObj[member.Name];
        if (value) return value;

        return null;
    }

    //单数据转成数组 个数和历史数据一致
    this.SingleDataToArrayData = function (value) 
    {
        let count = this.SymbolData.Data.Data.length;
        let result = [];
        for (let i = 0; i < count; ++i) 
        {
            result[i] = value;
        }

        return result;
    }

    this.RunAST=function()
    {
        //预定义的变量
        for(var i=0; i<this.Arguments.length; ++i)
        {
            var item =this.Arguments[i];
            this.VarTable.set(item.Name,item.Value);
        }

        if (!this.AST) this.ThrowError();
        if (!this.AST.Body) this.ThrowError();

        for(var i=0;i<this.AST.Body.length; ++i)
        {
            var item =this.AST.Body[i];
            this.VisitNode(item);

            //输出变量
            if (item.Type==Syntax.ExpressionStatement && item.Expression)
            {
                if (item.Expression.Type==Syntax.AssignmentExpression && item.Expression.Operator==':' && item.Expression.Left)
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
                        if (!Array.isArray(outVar)) 
                        {
                            if (typeof (outVar) == 'string') 
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
                            else outVar = this.SingleDataToArrayData(outVar);
                        }

                        this.OutVarTable.push({Name:varName, Data:outVar,Type:type});
                    }
                }
                else if (item.Expression.Type==Syntax.CallExpression)
                {
                    let callItem=item.Expression;
                    if (this.Draw.IsDrawFunction(callItem.Callee.Name))
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
                    if (!Array.isArray(outVar)) 
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
                    var varName;
                    var draw;
                    var color, upColor, downColor, stickType;
                    var lineWidth;
                    var colorStick=false;
                    var pointDot=false;
                    var upDownDot=false;
                    var circleDot=false;
                    var lineStick=false;
                    var stick=false;
                    var volStick=false;
                    var lineArea=false;
                    var stepLine=false;
                    var isShow = true;
                    var isExData = false;
                    var isDotLine = false;
                    var isOverlayLine = false;    //叠加线
                    var isSingleLine=false;     //独立线段
                    var isNoneName=false;
                    var isShowTitle=true;
                    //显示在位置之上,对于DRAWTEXT和DRAWNUMBER等函数有用,放在语句的最后面(不能与LINETHICK等函数共用),比如:
                    //DRAWNUMBER(CLOSE>OPEN,HIGH,CLOSE),DRAWABOVE;
                    var isDrawAbove=false;  
                    //VALIGN0,VALIGN1,VALIGN2 设置文字垂直对齐方式（上中下）
                    //ALIGN0,ALIGN1,ALIGN2 设置文字水平对齐方式（左中右）
                    var drawAlign=-1, drawVAlign=-1;
                    var fontSize=-1;
                    var bgConfig=null;
                    var vLineConfig=null;
                    var xOffset=null, yOffset=null;
                    for(var j=0 ; j<item.Expression.Expression.length; ++j)
                    {
                        let itemExpression=item.Expression.Expression[j];
                        if (itemExpression.Type==Syntax.AssignmentExpression && itemExpression.Operator==':' && itemExpression.Left)
                        {
                            if (j==0)
                            {
                                varName = itemExpression.Left.Name;
                                let varValue = this.VarTable.get(varName);
                                if (this.VarDrawTable.has(varName))         //绘图函数赋值
                                {
                                    draw=this.VarDrawTable.get(varName);
                                }
                                else if (!Array.isArray(varValue)) 
                                {
                                    varValue = this.SingleDataToArrayData(varValue);
                                    this.VarTable.set(varName, varValue);            //把常量放到变量表里
                                } 
                            }
                        }
                        else if (itemExpression.Type==Syntax.Identifier)
                        {
                            let value=itemExpression.Name;
                            if (value==='COLORSTICK') colorStick=true;
                            else if (value==='POINTDOT') pointDot=true;
                            else if (value=="UPDOWNDOT") upDownDot=true;
                            else if (value==='CIRCLEDOT') circleDot=true;
                            else if (value == 'DOTLINE') isDotLine = true;
                            else if (value==='LINESTICK') lineStick=true;
                            else if (value==='STICK') stick=true;
                            else if (value==='VOLSTICK') volStick=true;
                            else if (value=="LINEAREA") lineArea=true;
                            else if (value=="STEPLINE") stepLine=true;
                            else if (value==="DRAWABOVE") isDrawAbove=true;
                            else if (value==="SINGLELINE") isSingleLine=true;
                            else if (value.indexOf('COLOR')==0) color=value;
                            else if (value.indexOf("RGBX")==0 && value.length==10) color=value; //RGBX+“RRGGBB”
                            else if (value.indexOf('LINETHICK')==0) lineWidth=value;

                            else if (value=="ALIGN0") drawAlign=0;
                            else if (value=="ALIGN1") drawAlign=1;
                            else if (value=="ALIGN2") drawAlign=2;
                           
                            else if (value=="VALIGN0") drawVAlign=0;
                            else if (value=="VALIGN1") drawVAlign=1;
                            else if (value=="VALIGN2") drawVAlign=2;

                            else if (value.indexOf('NODRAW') == 0) isShow = false;
                            else if (value.indexOf('EXDATA') == 0) isExData = true; //扩展数据, 不显示再图形里面
                            else if (value.indexOf('LINEOVERLAY') == 0) isOverlayLine = true;
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
                        else if (itemExpression.Type == Syntax.Literal)    //常量
                        {
                            if (j==0)
                            {
                                let aryValue = this.SingleDataToArrayData(itemExpression.Value);
                                varName = itemExpression.Value.toString();
                                this.VarTable.set(varName, aryValue);    //把常量放到变量表里
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
                        let value={Name:varName, Data:outVar, Radius:g_JSChartResource.POINTDOT.Radius, Type:3};
                        if (color) value.Color=color;
                        if (lineWidth) value.LineWidth = lineWidth;
                        this.OutVarTable.push(value);
                    }
                    else if (circleDot && varName)  //圆点
                    {
                        let outVar=this.VarTable.get(varName);
                        let value={Name:varName, Data:outVar, Radius:g_JSChartResource.CIRCLEDOT.Radius, Type:3};
                        if (color) value.Color=color;
                        if (lineWidth) value.LineWidth = lineWidth;
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
                        let value={Name:varName, Data:outVar, Color:color, Type:0};
                        if (lineWidth) value.LineWidth=lineWidth;
                        if (isShow == false) value.IsShow = false;
                        if (isExData == true) value.IsExData = true;
                        if (isDotLine == true) value.IsDotLine = true;
                        if (isOverlayLine == true) value.IsOverlayLine = true;
                        if (isSingleLine == true) value.IsSingleLine = true;
                        if (isNoneName==true) value.NoneName=true;
                        if (isShowTitle==false) value.IsShowTitle=false;
                        if (stepLine==true) value.Type=7;
                        this.OutVarTable.push(value);
                    }
                    else if (draw)  //绘图函数
                    {
                        var outVar = { Name: draw.Name, Draw: draw, Type: 1 };
                        if (color) outVar.Color = color;
                        if (lineWidth) outVar.LineWidth = lineWidth;
                        if (isDrawAbove) outVar.IsDrawAbove=true;
                        if (drawAlign>=0) outVar.DrawAlign=drawAlign;
                        if (drawVAlign>=0) outVar.DrawVAlign=drawVAlign;
                        if (fontSize>0) outVar.DrawFontSize=fontSize;
                        if (bgConfig) outVar.Background=bgConfig;
                        if (vLineConfig) outVar.VerticalLine=vLineConfig;
                        if (IFrameSplitOperator.IsNumber(xOffset)) outVar.XOffset=xOffset;
                        if (IFrameSplitOperator.IsNumber(yOffset)) outVar.YOffset=yOffset;
                        this.OutVarTable.push(outVar);
                    }
                    else if (varName) 
                    {
                        let outVar = this.VarTable.get(varName);
                        let value = { Name: varName, Data: outVar, Type: 0 };
                        if (color) value.Color = color;
                        if (lineWidth) value.LineWidth = lineWidth;
                        if (isShow == false) value.IsShow = false;
                        if (isExData == true) value.IsExData = true;
                        if (isDotLine == true) value.IsDotLine = true;
                        if (isOverlayLine == true) value.IsOverlayLine = true;
                        if (isSingleLine == true) value.IsSingleLine = true;
                        if (isShowTitle==false) value.IsShowTitle=false;
                        if (stepLine==true) value.Type=7;
                        this.OutVarTable.push(value);
                    }
                }
            }

            if (this.Interrupt && this.Interrupt.Exit)
            {
                JSConsole.Complier.Log('[JSExecute::RunAST] Interrupt', this.Interrupt);    //中断退出
                break;
            }
        }

        JSConsole.Complier.Log('[JSExecute::RunAST]', this.VarTable);

        return this.OutVarTable;
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
        let data=this.RunAST();//执行脚本
        JSConsole.Complier.Log('[JSComplier.Run] execute finish', data);
        
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
            var tempValue=this.GetNodeValueEx(node.Argument);
            var value=this.Algorithm.Subtract(0,tempValue);
        }
        else 
        {
            var value=node.Argument.Value;
        }

        return value;
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
        let funcName=node.Callee.Name;
        let args=[];
        for(let i=0; i<node.Arguments.length; ++i)
        {
            let item=node.Arguments[i];
            let value;
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

        if (node.Callee.Type==Syntax.Literal)   //指标调用'MA.MA1'(6,12,18)
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

        //if (JS_EXECUTE_DEBUG_LOG) JSConsole.Complier.Log('[JSExecute::VisitCallExpression]' , funcName, '(', args.toString() ,')');
        if (g_JSComplierResource.IsCustomFunction(funcName))    //自定义函数 
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
            case 'SUPERDRAWTEXT':
                node.Draw = this.Draw.SUPERDRAWTEXT(args[0], args[1], args[2], args[3], args[4]);
                node.Out = [];
                break;
            case 'DRAWTEXT_FIX':
                node.Draw=this.Draw.DRAWTEXT_FIX(args[0],args[1],args[2],args[3],args[4]);
                node.Out=[];
                break;
            case 'DRAWICON':
                node.Draw = this.Draw.DRAWICON(args[0], args[1], args[2], args[3]);
                node.Out = [];
                break;
            case "ICON":
                node.Draw=this.Draw.ICON(args[0],args[1]);
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
            case 'DRAWKLINE':
            case "DRAWKLINE1":
                node.Draw = this.Draw.DRAWKLINE(args[0], args[1], args[2], args[3]);
                node.Out = [];
                break;
            case 'DRAWKLINE_IF':
                node.Draw = this.Draw.DRAWKLINE_IF(args[0], args[1], args[2], args[3], args[4]);
                node.Out = [];
                break;
            case "DRAWCOLORKLINE":
                node.Draw=this.Draw.DRAWCOLORKLINE(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case 'PLOYLINE':
            case 'POLYLINE':
                node.Draw = this.Draw.POLYLINE(args[0], args[1]);
                node.Out = node.Draw.DrawData;
                break;
            case 'DRAWNUMBER':
                node.Draw = this.Draw.DRAWNUMBER(args[0], args[1], args[2], args[3]);
                node.Out = node.Draw.DrawData.Value;
                break;
            case 'RGB':
                node.Out = this.Draw.RGB(args[0], args[1], args[2]);
                break;
            case 'RGBA':
                node.Out = this.Draw.RGBA(args[0], args[1], args[2],args[3]);
                break;
            case "UPCOLOR":
                node.Out=this.Draw.UPCOLOR(args[0]);
                break;
            case "DOWNCOLOR":
                node.Out=this.Draw.DOWNCOLOR(args[0]);
                break;
            case "STICKTYPE":
                node.Out=this.Draw.STICKTYPE(args[0]);
                break;
            case "XMOVE":
                node.Out=this.Draw.XMOVE(args[0]);
                break;
            case "YMOVE":
                node.Out=this.Draw.YMOVE(args[0]);
                break;
            case 'DRAWRECTREL':
                node.Draw = this.Draw.DRAWRECTREL(args[0], args[1], args[2], args[3], args[4]);
                node.Out = [];
                break;
            case "DRAWTEXTREL":
                node.Draw=this.Draw.DRAWTEXTREL(args[0],args[1],args[2]);
                node.Out=[];
                break;
            case "DRAWTEXTABS":
                node.Draw=this.Draw.DRAWTEXTABS(args[0],args[1],args[2]);
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
            case 'CODELIKE':
                node.Out=this.SymbolData.CODELIKE(args[0]);
                break;
            case 'NAMELIKE':
            case "NAMEINCLUDE":
                node.Out = this.SymbolData.NAMELIKE(args[1]);
                break;
            case 'REFDATE':
                node.Out = this.SymbolData.REFDATE(args[0], args[1]);
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
            case "MARGIN":
                node.Out = this.SymbolData.GetMarginCacheData(args[0], node);
                break;
            case "NEWS":
                node.Out = this.SymbolData.GetNewsAnalysisCacheData(args[0], node);
                break;
            case 'UPCOUNT':
            case 'DOWNCOUNT':
                node.Out = this.SymbolData.GetIndexIncreaseCacheData(funcName, args[0], node);
                break;
            case 'LOADAPIDATA':
                node.Out = this.SymbolData.GetCustomApiData(args);
                break;
            case "STKINDI":
            case "CALCSTOCKINDEX":
                node.Out=this.SymbolData.GetScriptIndexOutData(args,node,funcName);
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

            default:
                node.Out=this.Algorithm.CallFunction(funcName, args,node);
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
        let value=null,drawValue=null;
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
        else if (right.Type == Syntax.MemberExpression)
            value = this.ReadMemberVariable(right);
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
                        case '=':
                            value.Out=this.Algorithm.EQ(leftValue,rightValue);
                            break;
                        case '!=':
                        case '<>':
                            value.Out = this.Algorithm.NEQ(leftValue, rightValue);
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
                var  value=this.VisitUnaryExpression(node);
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

//颜色转rgb
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
    var asyncExecute= function()
    {
        try
        {
            JSConsole.Complier.Log('[JSComplier.Execute] code ',code);

            JSConsole.Complier.Log('[JSComplier.Execute] parser .....');
            let parser=new JSParser(code);
            parser.Initialize();
            let program=parser.ParseScript(); 
            
            let ast=program;
            JSConsole.Complier.Log('[JSComplier.Execute] parser finish.', ast);

            JSConsole.Complier.Log('[JSComplier.Execute] execute .....');
            let execute=new JSExecute(ast,option);
            execute.JobList=parser.Node.GetDataJobList();
            execute.JobList.push({ID:JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT});

            let result=execute.Execute();

        }catch(error)
        {
            JSConsole.Complier.Log(error);

            if (errorCallback) errorCallback(error);
        }
    }

    asyncExecute();

    JSConsole.Complier.Log('[JSComplier.Execute] async execute.');
}

JSComplier.SetDomain = function (domain, cacheDomain) 
{
    if (domain) g_JSComplierResource.Domain = domain;
    if (cacheDomain) g_JSComplierResource.CacheDomain = cacheDomain;
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//数据下载
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
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.RealtimeDataToHQChartData(recvData.data);
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
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData.data);
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
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData.data);
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
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData.data);
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
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                var data=self.ToHQChartData(recvData.data);
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
            method:"post",
            dataType: "json",
            async:true, 
            success: function (recvData)
            {
                var data=self.RecvGroupName(recvData.data);
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

var JSCommonComplier=
{
    JSComplier: JSComplier,
    g_JSComplierResource: g_JSComplierResource,
};

export
{
    JSCommonComplier,

    ErrorHandler,
    JSComplier,
    JSParser,
    Syntax,
    JS_EXECUTE_JOB_ID,
    g_JSComplierResource,
};

/*
module.exports =
{
    JSCommonComplier:
    {
        JSComplier: JSComplier,
        g_JSComplierResource: g_JSComplierResource,
    },

     //单个类导出
     JSCommonComplier_ErrorHandler: ErrorHandler,
     JSCommonComplier_JSComplier:JSComplier,
     JSCommonComplier_JSParser:JSParser,
     JSCommonComplier_Syntax:Syntax,
     JS_EXECUTE_JOB_ID:JS_EXECUTE_JOB_ID,
     g_JSComplierResource:g_JSComplierResource,
};
*/