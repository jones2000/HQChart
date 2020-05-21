/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    分析家语法编译器
*/

import { JSCommonData } from "./umychart.data.wechat.js";     //行情数据结构体 及涉及到的行情算法(复权,周期等)  

var g_JSComplierResource=
{
    Domain : "https://opensource.zealink.com",               //API域名
    CacheDomain : "https://opensourcecache.zealink.com"      //缓存域名
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
            ((cp >= 0x80) && Regex.NonAsciiIdentifierStart.test(Character.FromCodePoint(cp)));
    },

    IsIdentifierPart: function (cp) 
    {
        return (cp === 0x24) || (cp === 0x5F) ||
            (cp >= 0x41 && cp <= 0x5A) ||
            (cp >= 0x61 && cp <= 0x7A) ||
            (cp >= 0x30 && cp <= 0x39) ||
            (cp === 0x5C) ||
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
    this.IsNeedFinanceData=new Set();   //需要下载的财务数据
    this.IsNeedMarginData = new Set();
    this.IsNeedNewsAnalysisData = new Set();      //新闻统计数据
    this.IsNeedBlockIncreaseData = new Set();     //是否需要市场涨跌股票数据统计
    this.IsNeedSymbolExData = new Set();          //下载股票行情的其他数据

    this.IsAPIData = []       //加载API数据

    this.GetDataJobList=function()  //下载数据任务列表
    {
        let jobs=[];
        if (this.IsNeedSymbolData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA});
        if (this.IsNeedIndexData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA});
        if (this.IsNeedLatestData) jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA});

        //涨跌停家数统计
        for (var blockSymbol of this.IsNeedBlockIncreaseData) 
        {
            jobs.push({ ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA, Symbol: blockSymbol });
        }

        //加载财务数据
        for(var jobID of this.IsNeedFinanceData)
        {
            if (jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA)      //股息率 需要总市值
                jobs.push({ID:JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA});

            jobs.push({ID:jobID});
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

        //行情其他数据
        for (var jobID of this.IsNeedSymbolExData) 
        {
            jobs.push({ ID:jobID });
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
        }

        if (varName == 'HYBLOCK' || varName == 'DYBLOCK' || varName == 'GNBLOCK') 
        {
            if (!this.IsNeedSymbolExData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA))
                this.IsNeedSymbolExData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA);
        }

        //流通股本（手）
        if (varName==='CAPITAL')
        {
            if (!this.IsNeedFinanceData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA))
                this.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA);
        }

        if (varName === 'EXCHANGE') 
        {
            if (!this.IsNeedFinanceData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA))
                this.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA);
        }
    }

    this.VerifySymbolFunction = function (callee, args, token)
    {
        if (callee.Name=='DYNAINFO') 
        {
            this.IsNeedLatestData=true;
            return;
        }

        //财务函数
        if (callee.Name=='FINANCE')
        {
            let jobID=JS_EXECUTE_JOB_ID.GetFinnanceJobID(args[0].Value);
            if (jobID && !this.IsNeedFinanceData.has(jobID))  this.IsNeedFinanceData.add(jobID);
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

        if (callee.Name == 'COST' || callee.Name == 'WINNER')   //筹码都需要换手率
        {
            if (!this.IsNeedFinanceData.has(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA))
                this.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA);
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

        if (callee.Name == "LOADAPIDATA") //加载API数据
        {
            var item = { Name: callee.Name, ID: JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA, Args: args };
            if (token) item.Token = { Index: token.Start, Line: token.LineNumber };

            this.IsAPIData.push(item);
            return;
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

    this.Literal=function(value,raw)
    {
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

    this.StaticMemberExpression = function (object, property) 
    {
        return { Type: Syntax.MemberExpression, Computed: false, Object: object, Property: property };
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
                const property = this.ParseIdentifierName();
                expr = this.Finalize(this.StartNode(startToken), this.Node.StaticMemberExpression(expr, property));
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
                expr=this.Finalize(node, this.Node.Literal(token.Value,raw));
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
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=data[i]+data2[i];
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
            if (!isNaN(aryData[i]) && !isNaN(value)) result[i]=value+aryData[i];
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
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=data[i]-data2[i];
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if (!isNaN(data) && !isNaN(data2[i])) result[i]=data-data2[i];
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if (!isNaN(data[i]) && !isNaN(data2)) result[i]=data[i]-data2;
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
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=data[i]*data2[i];
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
            if (!isNaN(aryData[i]) && !isNaN(value)) result[i]=value*aryData[i];
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
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值比较
        if (isNumber && isNumber2) return (data>data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]>data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data>data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]>data2 ? 1 : 0);
            }
        }

        return result;
    }

    //大于等于
    this.GTE=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值比较
        if (isNumber && isNumber2) return (data>=data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]>=data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data>=data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]>=data2 ? 1 : 0);
            }
        }

        return result;
    }

    //小于
    this.LT=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值比较
        if (isNumber && isNumber2) return (data<data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]<data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data<data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]<data2 ? 1 : 0);
            }
        }

        return result;
    }

    //小于等于
    this.LTE=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值比较
        if (isNumber && isNumber2) return (data>=data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=(data[i]<=data2[i] ? 1:0);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=(data<=data2[i] ? 1 : 0);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=(data[i]<=data2 ? 1 : 0);
            }
        }

        return result;
    }

    //等于
    this.EQ=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值比较
        if (isNumber && isNumber2) return (data==data2 ? 1 : 0);

        //都是数组比较
        let result=[];
        if (!isNumber && !isNumber2)
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
        let isNumber = typeof (data) == 'number';
        let isNumber2 = typeof (data2) == 'number';

        //单数值比较
        if (isNumber && isNumber2) return (data != data2 ? 1 : 0);

        //都是数组比较
        let result = [];
        if (!isNumber && !isNumber2) 
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
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(trueData)=='number';
        let isNumber3=typeof(falseData)=='number';
        
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
                else result[i]=trueData[i];
            }
            else
            {
                if (isNumber3) result[i]=falseData;
                else result[i]=falseData[i];
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
            if (data.length<=0) return result;
            if (n>=data.length) return result;

            result=data.slice(0,data.length-n);

            for(let i=0;i<n;++i)
                result.unshift(null);
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

    this.MAX=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值
        if (isNumber && isNumber2) return Math.max(data,data2);

        //都是数组
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=Math.max(data[i], data2[i]);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=Math.max(data, data2[i]);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=Math.max(data[i], data2);
            }
        }

        return result;
    }

    this.MIN=function(data,data2)
    {
        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(data2)=='number';

        //单数值
        if (isNumber && isNumber2) return Math.min(data,data2);

        //都是数组
        let result=[];
        if (!isNumber && !isNumber2)
        {
            let count=Math.max(data.length, data2.length);
            for(let i=0;i<count;++i)
            {
                result[i]=null; //初始化

                if (i<data.length && i<data2.length)
                {
                    if ( !isNaN(data[i]) && !isNaN(data2[i]) ) result[i]=Math.min(data[i], data2[i]);
                }
            }

            return result;
        }

        if (isNumber)   //单数据-数组
        {
            for(let i in data2)
            {
                result[i]=null;
                if ( !isNaN(data) && !isNaN(data2[i]) ) result[i]=Math.min(data, data2[i]);
            }
        }
        else            //数组-单数据
        {
            for(let i in data)
            {
                result[i]=null;
                if ( !isNaN(data[i]) && !isNaN(data2) ) result[i]=Math.min(data[i], data2);
            }
        }

        return result;
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
        if (dayCount <= 0) return [];

        let result = [];
        if (!data || !data.length) return result;
        
        for (var i = 0; i < data.length; ++i) 
        {
            result[i] = null;
            if (this.IsNumber(data[i])) break;
        }

        var data = data.slice(0); //复制一份数据出来 需要把data数据里的null数据用前一个数据覆盖
        for (var days = 0; i < data.length; ++i, ++days) 
        {
            if (days < dayCount - 1) 
            {
                result[i] = null;
                continue;
            }

            let preValue = data[i - (dayCount - 1)];
            let sum = 0;
            for (let j = dayCount - 1; j >= 0; --j) 
            {
                var value = data[i - j];
                if (!this.IsNumber(value)) 
                {
                    value = preValue;  //空数据就取上一个数据
                    data[i - j] = value; 
                }
                else 
                {
                    preValue = value;
                }
                sum += value;
            }

            result[i] = sum / dayCount;
        }

        return result;
    }

    //指数平均数指标 EMA(close,10)
    this.EMA=function(data,dayCount)
    {
        var result = [];

        var offset=0;
        if (offset>=data.length) return result;

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

        var i=0;
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
        var result = [];
        var i = 0;
        for (; i < data.length && !this.isNumber(data[i]); ++i) 
        {
            result[i] = null;
        }
        for (; i < data.length; ++i) 
        {
            if (!this.isNumber(data[i]))
                result[i] = null;
            else
                result[i] = 0 - data[i];
        }
        return result;
    }

    this.COUNT=function(data,n)
    {
        let result=[];

        for(let i=0; i<data.length; ++i)
        {
            let count=0;
            for (let j = 0; j < n && i - j >= 0; ++j) 
            {
                if (data[i - j])++count;
            }

            result[i]=count;
        }

        return result;
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
            if (n > data.length) return result;
            if (n <= 0) n = data.length - 1;

            var nMax = 0;
            for (nMax = 0; nMax < data.length; ++nMax) 
            {
                if (this.IsNumber(data[nMax])) break;
            }

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
                    for (j = nMax = (i - n + 2); j <= i; ++j) 
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
            if (n > data.length) return result;
            if (n <= 0) n = data.length - 1;

            var min = null;
            for (var i = n; i < data.length; ++i, ++j) 
            {
                if (min == null || i < n + min)    //最小值是否在当前周期里面
                {
                    min = data[i] > data[min] ? min : i;
                }
                else 
                {
                    for (var j = (min = i - n + 1) + 1; j <= i; ++j) 
                    {
                        if (data[j] < data[min]) min = j;
                    }
                }
                result[i] = data[min];
            }
        }

        return result;
    }

    this.STD=function(data,n)
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
                total+=Math.pow((data[i-j]-averageData[i]),2);
            }

            result[i]=Math.sqrt(total/n);
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
        
        if (n==0)
        {
            result[0]=data[0];
    
            for (var i=1; i<data.length; ++i)
            {
                result[i] = result[i-1]+data[i];
            }
        }
        else
        {
            for(var i=n-1,j=0;i<data.length;++i,++j)
            {
                for(var k=0;k<n;++k)
                {
                    if (k==0) result[i]=data[k+j];
                    else result[i]+=data[k+j];
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
        var result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        var i = 0, j = 0, k = 0;
        var E = 0, DEV = 0;
        for(i = 0; i < datanum && !this.isNumber(data[i]); ++i)
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
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        if (num < 1 || num >= datanum)
            return result;
        var i = 0, j = 0;
        for(i = 0; i < datanum && !this.isNumber(data[i]); ++i)
        {
            result[i] = null;
        }
        var SigmaPowerX = 0, SigmaX = 0, MidResult;
        for (; i < datanum && j < num; ++i, ++j)
        {
            SigmaPowerX += data[i] * data[i];
            SigmaX += data[i];
        }
        if (j == num)
        {
            MidResult = num*SigmaPowerX - SigmaX*SigmaX;
            result[i-1] = Math.sqrt(MidResult) / num;
        }
        for(; i < datanum; ++i)
        {
            SigmaPowerX += data[i]*data[i] - data[i-num]*data[i-num];
            SigmaX += data[i] - data[i-num];
            MidResult = num*SigmaPowerX - SigmaX*SigmaX;
            result[i] = Math.sqrt(MidResult) / num;
        }
    }

    //VAR 估算样本方差
    //VAR(X，N)　 返回估算样本方差。
    this.VAR=function(data,n)
    {
        var result=[];
        if (typeof(n)!='number') n=parseInt(n); //字符串的转成数值型
        var num = n;
        var datanum = data.length;
        if (num <= 1 || num >= datanum)
            return result;
        var i, j;
        for (i = 0; i < datanum && !this.IsNumber(data[i]); ++i)
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

    this.TFILTER=function(data,data2,n)
    {
        n=parseInt(n);

        var result=[];

        let isNumber=typeof(data)=='number';
        let isNumber2=typeof(range)=='number';

        let count=Math.max(data.length, data2.length);
        for(let i=0;i<count;++i)
        {

        }


        return result;
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
                if (data[i]) 
                {
                    if (day + 1 < n)++day;
                }
                else {
                    day = null;
                }
            }

            if (day) result[i] = day;
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
    this.ZIG = function (data, n) 
    {
        var hisData = this.SymbolData.Data;
        var result = [];
        if (typeof (data) == 'number') 
        {
            switch (data) 
            {
                case 0:
                    data = hisData.GetOpen();
                    break;
                case 1:
                    data = hisData.GetHigh();
                    break;
                case 2:
                    data = hisData.GetLow();
                    break;
                case 3:
                    data = hisData.GetClose();
                    break;
                default:
                    return result;
            }
        }

        var bFirstPoint = false;
        var bSecondPont = false;
        var firstData = {}, secondData = {}, thridData = {};
        var lastData = {};
        for (let i in data) 
        {
            result[i] = null;
            var item = data[i];
            if (!this.IsNumber(item)) continue;

            if (bFirstPoint == false) 
            {
                bFirstPoint = true;
                firstData = { ID: parseInt(i), Value: item };  //第1个点
            }
            else if (bFirstPoint == true && bSecondPont == false) 
            {
                var temp = (item - firstData.Value) / firstData.Value * 100;
                if (temp > n) 
                {
                    secondData = { ID: parseInt(i), Value: item, Up: true };
                    lastData = { ID: parseInt(i), Value: item };
                    bSecondPont = true;
                }
                else if (temp < -n) 
                {
                    secondData = { ID: parseInt(i), Value: item, Up: false };
                    lastData = { ID: parseInt(i), Value: item };
                    bSecondPont = true;
                }
            }
            else if (bFirstPoint == true && bSecondPont == true) 
            {
                var temp = (item - lastData.Value) / lastData.Value * 100;
                if (secondData.Up == true)    //找下跌的点
                {
                    if (temp < -n) 
                    {
                        thridData = { ID: parseInt(i), Value: item, Up: false };
                        this.CalculateZIGLine(firstData, secondData, thridData, data, result);
                        lastData = { ID: parseInt(i), Value: item };
                    }
                    else 
                    {
                        if (item > lastData.Value) lastData = { ID: parseInt(i), Value: item };
                    }
                }
                else {
                    if (temp > n) 
                    {
                        thridData = { ID: parseInt(i), Value: item, Up: true };
                        this.CalculateZIGLine(firstData, secondData, thridData, data, result);
                        lastData = { ID: parseInt(i), Value: item };
                    }
                    else
                    {
                        if (item < lastData.Value) lastData = { ID: parseInt(i), Value: item };
                    }
                }
            }
        }

        //计算最后1组数据
        thridData = { ID: data.length - 1, Value: data[data.length - 1], Up: !secondData.Up };
        this.CalculateZIGLine(firstData, secondData, thridData, data, result);

        return result;
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
    this.TROUGHBARS = function (data, n, n2) 
    {
        var zigData = this.ZIG(data, n);   //计算ZIG
        var i = 0, result = [];
        for (i = 0; i < zigData.length; ++i) 
        {
            result[i] = null;
            if (this.IsNumber(zigData[i])) break;
        }

        var trough = [];
        var start = i, j = 0;
        for (; i < zigData.length; ++i)  //第1个波谷
        {
            if (i + 1 < zigData.length && i - 1 >= 0 && zigData[i] < zigData[i - 1] && zigData[i] < zigData[i + 1]) //波谷
            {
                trough[0] = i;
                break;
            }
        }

        for (i += 1; i < zigData.length; ++i) 
        {
            result[i] = null;
            if (i + 1 < zigData.length && i - 1 >= 0 && zigData[i] < zigData[i - 1] && zigData[i] < zigData[i + 1]) //波谷
            {
                console.log('[TROUGHBARS] i', i, zigData[i]);
                ++j;
                trough[j] = i;
                if (j + 1 == n2) 
                {
                    result[i] = i - start;
                }
                else if (j + 1 > n2) 
                {
                    trough.shift(); //大于计算的波谷数,去掉第1个波谷
                    start = trough[0];
                    --j;
                    result[i] = i - start;
                }
            }
            else 
            {
                if (j + 1 === n2) result[i] = i - start;
            }
        }

        return result;
    }

    /*
    属于未来函数,前M个ZIG转向波峰到当前距离.
    用法:
    PEAKBARS(K,N,M)表示之字转向ZIG(K,N)的前M个波峰到当前的周期数,M必须大于等于1
    例如:
    PEAKBARS(0,5,1)表示%5开盘价ZIG转向的上一个波峰到当前的周期数
    */
    this.PEAKBARS = function (data, n, n2) 
    {
        var zigData = this.ZIG(data, n);   //计算ZIG
        var i = 0, result = [];
        for (i = 0; i < zigData.length; ++i) 
        {
            result[i] = null;
            if (this.IsNumber(zigData[i])) break;
        }

        var trough = [];
        var start = i, j = 0;
        for (; i < zigData.length; ++i)  //第1个波峰
        {
            if (i + 1 < zigData.length && i - 1 >= 0 && zigData[i] > zigData[i - 1] && zigData[i] > zigData[i + 1]) //波峰
            {
                trough[0] = i;
                break;
            }
        }

        for (i += 1; i < zigData.length; ++i) 
        {
            result[i] = null;
            if (i + 1 < zigData.length && i - 1 >= 0 && zigData[i] > zigData[i - 1] && zigData[i] > zigData[i + 1]) //波峰
            {
                console.log('[TROUGHBARS] i', i, zigData[i]);
                ++j;
                trough[j] = i;
                if (j + 1 == n2)
                {
                    result[i] = i - start;
                }
                else if (j + 1 > n2) 
                {
                    trough.shift(); //大于计算的波谷数,去掉第1个波谷
                    start = trough[0];
                    --j;
                    result[i] = i - start;
                }
            }
            else 
            {
                if (j + 1 === n2) result[i] = i - start;
            }
        }

        return result;
    }

    /*
    一直存在.
    例如:
    EVERY(CLOSE>OPEN,N) 
    表示N日内一直阳线(N应大于0,小于总周期数,N支持变量)
    */
    this.EVERY = function (data, n) 
    {
        var result = [];
        if (n < 1) return result;
        var i = 0;
        for (; i < data.length; ++i) 
        {
            result[i] = null;
            if (this.IsNumber(data[i])) break;
        }

        var flag = 0;
        for (; i < data.length; ++i) 
        {
            if (data[i]) flag += 1;
            else flag = 0;

            if (flag == n) 
            {
                result[i] = 1;
                --flag;
            }
            else 
            {
                result[i] = 0;
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
    this.COST = function (data) 
    {
        var result = [];
        var exchangeID = 201;
        var exchangeData = this.SymbolData.GetFinanceCacheData(exchangeID);    //换手率
        if (!exchangeData) return result;

        var isNumber = Array.isArray(data) ? false : true;
        var singleData = null;
        if (isNumber) singleData = parseFloat(data);
        var compareData = null;

        for (let i = this.SymbolData.Data.Data.length - 1, j = 0, k = 0; i >= 0; --i) 
        {
            result[i] = null;
            var chipData = this.CalculateChip(i, exchangeData, this.SymbolData.Data.Data, 1);
            if (chipData.Max == null || chipData.Min == null || chipData.Max <= 0 || chipData.Min <= 0) continue;

            var max = parseInt(chipData.Max * 100);
            var min = parseInt(chipData.Min * 100);

            if (singleData != null) 
            {
                compareData = singleData;
            }
            else 
            {
                if (i >= data.length) continue;
                compareData = data[i];
            }

            var totalVol = 0, vol = 0;
            var aryMap = new Map();
            for (j = i; j >= 0; --j) 
            {
                var item = chipData.Data[j];
                var start = parseInt(item.Low * 100);
                var end = parseInt(item.High * 100);
                if ((end - start + 1) <= 0) continue;

                var iAverageVolume = item.Vol;
                iAverageVolume = iAverageVolume / (end - start + 1);
                if (iAverageVolume <= 0) continue;

                for (k = start; k <= end && k <= max; ++k) 
                {
                    if (aryMap.has(k)) 
                    {
                        vol = aryMap.get(k);
                        aryMap.set(k, vol + iAverageVolume);
                    }
                    else 
                    {
                        aryMap.set(k, iAverageVolume);
                    }
                }

                totalVol += item.Vol;
            }

            //计算获利盘
            vol = 0;
            for (var priceData of aryMap) 
            {
                vol += priceData[1];
                result[i] = priceData[0] / 100;
                if (vol / totalVol * 100 > compareData)
                    break;
            }
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
    this.WINNER = function (data) 
    {
        var result = [];
        var exchangeID = 201;
        var exchangeData = this.SymbolData.GetFinanceCacheData(exchangeID);    //换手率
        if (!exchangeData) return result;

        var isNumber = Array.isArray(data) ? false : true;
        var singleData = null;
        if (isNumber) singleData = parseInt(parseFloat(data) * 100);
        var compareData = null;

        for (let i = this.SymbolData.Data.Data.length - 1, j = 0, k = 0; i >= 0; --i) 
        {
            result[i] = null;
            var chipData = this.CalculateChip(i, exchangeData, this.SymbolData.Data.Data, 1);
            if (chipData.Max == null || chipData.Min == null || chipData.Max <= 0 || chipData.Min <= 0) continue;

            var max = parseInt(chipData.Max * 100);
            var min = parseInt(chipData.Min * 100);

            if (singleData != null) 
            {
                compareData = singleData;
            }
            else 
            {
                if (i >= data.length) continue;
                compareData = parseInt(data[i] * 100);
            }

            var totalVol = 0, vol = 0;
            for (j = i; j >= 0; --j) 
            {
                var item = chipData.Data[j];
                var start = parseInt(item.Low * 100);
                var end = parseInt(item.High * 100);
                if ((end - start + 1) <= 0) continue;

                var iAverageVolume = item.Vol;
                iAverageVolume = iAverageVolume / (end - start + 1);
                if (iAverageVolume <= 0) continue;

                var profitVol = 0;    //获利的成交量
                if (compareData > end) profitVol = item.Vol;
                else if (compareData < start) profitVol = 0;
                else profitVol = item.Vol * (compareData - start + 1) / (end - start + 1);

                vol += profitVol;
                totalVol += item.Vol;
            }

            if (totalVol > 0) result[i] = vol / totalVol;
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

        return result;
    }

    //STRCAT(A,B):将两个字符串A,B(非序列化)相加成一个字符串C.
    //用法: STRCAT('多头','开仓')将两个字符串'多头','开仓'相加成一个字符串'多头开仓'
    this.STRCAT = function (str1, str2) 
    {
        var result = str1 + str2;
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

    //函数调用
    this.CallFunction=function(name,args,node)
    {
        switch(name)
        {
            case 'MAX':
                return this.MAX(args[0], args[1]);
            case 'MIN':
                return this.MIN(args[0], args[1]);
            case 'REF':
                return this.REF(args[0], args[1]);
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
            case 'LLVBARS':
                return this.LLVBARS(args[0], args[1]);
            case 'HHV':
                return this.HHV(args[0], args[1]);
            case 'HHVBARS':
                return this.HHVBARS(args[0], args[1]);
            case 'MULAR':
                return this.MULAR(args[0], args[1]);
            case 'CROSS':
                return this.CROSS(args[0], args[1]);
            case 'LONGCROSS':
                return this.LONGCROSS(args[0], args[1], args[2]);
            case 'AVEDEV':
                return this.AVEDEV(args[0], args[1]);
            case 'STD':
                return this.STD(args[0], args[1]);
            case 'IF':
            case 'IFF':
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
            case 'PEAKBARS':
                return this.PEAKBARS(args[0], args[1], args[2]);
            case 'COST':
                return this.COST(args[0]);
            case 'WINNER':
                return this.WINNER(args[0]);
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
            case 'CON2STR':
                return this.CON2STR(args[0], args[1]);
            case 'DTPRICE':
                return this.DTPRICE(args[0], args[1]);
            case 'ZTPRICE':
                return this.ZTPRICE(args[0], args[1]);
            case 'FRACPART':
                return this.FRACPART(args[0]);
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

//是否有是有效的除数
JSAlgorithm.prototype.IsDivideNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;
    if (value==0) return false;

    return true;
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

        if(condition.length<=0) return result;

        var IsNumber=typeof(data)=="number";
        var IsNumber2=typeof(data2)=="number";
   
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
    this.DRAWNUMBER = function (condition, data, data2) 
    {
        let drawData = { Value: new Array(), Text: new Array() };
        let result = { DrawData: drawData, DrawType: 'DRAWNUMBER' };

        let isNumber = typeof (data2) == 'number';
        let text;
        if (isNumber) text=data2.toFixed(2);

        for (let i in condition) 
        {
            drawData.Value[i] = null;
            if (!condition[i]) continue;
            if (i >= data.length || !this.IsNumber(data[i])) continue;

            if (isNumber) 
            {
                drawData.Value[i] = data[i];
                drawData.Text[i] = text;
            }
            else 
            {
                if (i >= data2.length || !data2[i]) continue;
                drawData.Value[i] = data[i];
                if (typeof(data2[i])=='number')
                    drawData.Text[i] = data2[i].toFixed(2);
                else
                    drawData.Text[i] = data2[i].toString();
            }
        }

        return result;
    }

    /*
    在图形上绘制小图标.
    用法:
    DRAWICON(COND,PRICE,TYPE),当COND条件满足时,在PRICE位置画TYPE号图标(TYPE为1--41).
    例如:
    DRAWICON(CLOSE>OPEN,LOW,1)表示当收阳时在最低价位置画1号图标.
    */
    this.DRAWICON = function (condition, data, type) 
    {
        //图标对应的字符代码
        let mapIcon = new Map([
            [1, { Symbol: '↑', Color: 'rgb(238,44,44)' }], [2, { Symbol: '↓', Color: 'rgb(0,139,69)' }],
            [3, { Symbol: '😧' }], [4, { Symbol: '😨' }], [5, { Symbol: '😁' }], [6, { Symbol: '😱' }],
            [7, { Symbol: '◼', Color: 'rgb(238,44,44)' }], [8, { Symbol: '◆', Color: 'rgb(0,139,69)' }],
            [9, { Symbol: '💰' }], [10, { Symbol: '📪' }], [11, { Symbol: '👆' }], [12, { Symbol: '👇' }],
            [13, { Symbol: 'B', Color: 'rgb(178,34,34)' },], [14, { Symbol: 'S', Color: 'rgb(0,139,69)' }],
            [36, { Symbol: 'Χ', Color: 'rgb(238,44,44)' }], [37, { Symbol: 'X', Color: 'rgb(0,139,69)' }],
            [38, { Symbol: '▲', Color: 'rgb(238,44,44)' }], [39, { Symbol: '▼', Color: 'rgb(0,139,69)' }],
        ]);

        let icon = mapIcon.get(type);
        if (!icon) icon = { Symbol: '●', Color: 'rgb(0,139,69)'};
        let drawData = [];
        let result = { DrawData: drawData, DrawType: 'DRAWICON', Icon: icon };
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

    // 相对位置上画矩形.
    //用法: DRAWRECTREL(LEFT,TOP,RIGHT,BOTTOM,COLOR),以图形窗口(LEFT,TOP)为左上角,(RIGHT,BOTTOM)为右下角绘制矩形,坐标单位是窗口沿水平和垂直方向的1/1000,取值范围是0—999,超出范围则可能显示在图形窗口外,矩形中间填充颜色COLOR,COLOR为0表示不填充.
    //例如: DRAWRECTREL(0,0,500,500,RGB(255,255,0))表示在图形最左上部1/4位置用黄色绘制矩形
    this.DRAWRECTREL = function (left, top, right, bottom, color) 
    {

        let drawData = { Rect: { Left: left, Top: top, Right: right, Bottom: bottom }, Color: color };
        if (color == 0) drawData.Color = null;
        let result = { DrawData: drawData, DrawType: 'DRAWRECTREL' };

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

JSDraw.prototype.IsDrawFunction=function(name)
{
    let setFunctionName = new Set(["STICKLINE", "DRAWTEXT", 'SUPERDRAWTEXT', 'DRAWLINE', 'DRAWBAND', 'DRAWKLINE', 'DRAWKLINE_IF', 'PLOYLINE', 'POLYLINE', 'DRAWNUMBER', 'DRAWICON','DRAWRECTREL']);
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
    this.MaxReqeustDataCount=1000;
    this.MaxRequestMinuteDayCount=5;

    this.LatestData;            //最新行情
    this.IndexData;             //大盘指数
    this.FinanceData=new Map(); //财务数据
    this.MarginData = new Map();  //融资融券
    this.NewsAnalysisData = new Map();    //新闻统计
    this.ExtendData = new Map();          //其他的扩展数据
    this.NetworkFilter;                   //网络请求回调 function(data, callback);
   
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
        if (option.MaxReqeustDataCount>0) this.MaxReqeustDataCount=option.MaxReqeustDataCount;
        if (option.MaxRequestMinuteDayCount>0) this.MaxRequestMinuteDayCount=option.MaxRequestMinuteDayCount;
        if (option.KLineApiUrl) this.KLineApiUrl=option.KLineApiUrl;
        if (option.NetworkFilter) this.NetworkFilter = option.NetworkFilter;
    }

    //最新行情
    this.GetLatestData=function()
    {
        if (this.LatestData) return this.Execute.RunNextJob();

        var self=this;
        wx.request({
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
        if (!data.stock || data.stock.length!=1) return;

        let stock=data.stock[0];
        this.LatestData={ Symbol:stock.symbol, Name:stock.name, Date:stock.date, Time:stock.time,
            YClose:stock.yclose,Price:stock.price, Open:stock.open, High:stock.high, Low:stock.low, Vol:stock.vol, Amount:stock.amount, 
            Increase:stock.increase, Exchangerate:stock.exchangerate, Amplitude:stock.amplitude};

        console.log('[JSSymbolData::RecvLatestData]', this.LatestData);
    }

    this.GetLatestCacheData=function(dataname)
    {
        if (!this.LatestData) return  null;

        switch(dataname)
        {
            case DYNAINFO_ARGUMENT_ID.YCLOSE:
                return this.LatestData.YClose;
            case DYNAINFO_ARGUMENT_ID.OPEN:
                return this.LatestData.Open;
            case DYNAINFO_ARGUMENT_ID.HIGH:
                return this.LatestData.High;
            case DYNAINFO_ARGUMENT_ID.LOW:
                return this.LatestData.Low;
            case DYNAINFO_ARGUMENT_ID.VOL:
                return this.LatestData.Vol;
            case DYNAINFO_ARGUMENT_ID.AMOUNT:
                return this.LatestData.Amount;
            case DYNAINFO_ARGUMENT_ID.INCREASE:
                return this.LatestData.Increase;
            case DYNAINFO_ARGUMENT_ID.EXCHANGERATE:
                return this.LatestData.Exchangerate;
            case DYNAINFO_ARGUMENT_ID.AMPLITUDE:
                return this.LatestData.Amplitude;
            case DYNAINFO_ARGUMENT_ID.CLOSE:
                return this.LatestData.Price;
            default:
                return null;
        }
    }

    this.GetVolRateData = function (job, node) {
        var volrKey = job.ID.toString() + '-VolRate-' + this.Symbol;
        if (this.ExtendData.has(volrKey)) return this.Execute.RunNextJob();

        var self = this;
        wx.request({
            url: self.RealtimeApiUrl,
            data:
            {
                "field": ["name", "symbol", "avgvol5", 'date'],
                "symbol": [this.Symbol]
            },
            method: "POST",
            dataType: "json",
            async: true,
            success: function (recvData) 
            {
                self.RecvVolRateData(recvData, volrKey);
                self.Execute.RunNextJob();
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvVolRateData = function (recvData, key) 
    {
        var data=recvData.data;
        if (!data.stock || data.stock.length != 1) return;
        var avgVol5 = data.stock[0].avgvol5;
        var date = data.stock[0].date;
        var item = { AvgVol5: avgVol5, Date: date };
        this.ExtendData.set(key, item);

        console.log('[JSSymbolData::RecvVolRateData]', item);
    }

    this.GetVolRateCacheData = function (node) 
    {
        var key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA.toString() + '-VolRate-' + this.Symbol;
        if (!key || !this.ExtendData.has(key)) this.Execute.ThrowUnexpectedNode(node, '不支持VOLR');

        var result = [];
        var value = this.ExtendData.get(key);
        var avgVol5 = value.AvgVol5 / 241;
        var totalVol = 0;
        //5日成交总量只取了最新一天的,历史的暂时没有取,所以数据计算的时候只计算最新的一天, 其他都空
        for (var i = 0, j = 0; i < this.Data.Data.length; ++i) 
        {
            result[i] = null;
            var item = this.Data.Data[i];
            var dateTime = item.DateTime; //日期加时间
            if (!dateTime) continue;
            var aryValue = dateTime.split(' ');
            if (aryValue.length != 2) continue;
            var date = parseInt(aryValue[0]);
            if (date != value.Date) continue;

            totalVol += item.Vol;
            if (avgVol5 > 0) result[i] = totalVol / (j + 1) / avgVol5 * 100;
            ++j;
        }

        return result;
    }

    this.GetGroupData = function (job) 
    {
        var key = job.ID.toString() + '-Group-' + this.Symbol;
        if (this.ExtendData.has(key)) return this.Execute.RunNextJob();

        var self = this;

        if (this.NetworkFilter) {
            var obj =
            {
                Name: 'JSSymbolData::GetGroupData', //类名::
                Explain: 'HYBLOCK|DYBLOCK',
                Request: {
                    Url: self.RealtimeApiUrl, Type: 'POST',
                    Data: { symbol: [this.Symbol], field: ["name", "symbol", "industry", 'concept', 'region'] }
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvGroupData(data, key);
                self.Execute.RunNextJob();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }


        wx.request({
            url: self.RealtimeApiUrl,
            data:
            {
                "field": ["name", "symbol", "industry", 'concept', 'region'],
                "symbol": [this.Symbol]
            },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (recvData) 
            {
                self.RecvGroupData(recvData, key);
                self.Execute.RunNextJob();
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvGroupData = function (recvData, key) 
    {
        var data = recvData.data;
        if (!data.stock) return;
        if (data.stock.length != 1) return;
        var stock = data.stock[0];
        var industry = stock.industry;
        var concept = stock.concept;
        var region = stock.region;

        var groupData = { Industry: [], Concept: [], Region: [] };
        if (industry) 
        {
            for (var i in industry) 
            {
                var item = industry[i];
                groupData.Industry.push({ Name: item.name, Symbol: item.symbol });
            }
        }

        if (concept) 
        {
            for (var i in concept) 
            {
                var item = concept[i];
                groupData.Concept.push({ Name: item.name, Symbol: item.symbol });
            }
        }

        if (region) 
        {
            for (var i in region) 
            {
                var item = region[i];
                groupData.Region.push({ Name: item.name, Symbol: item.symbol });
            }
        }

        this.ExtendData.set(key, groupData);
    }


    //获取大盘指数数据
    this.GetIndexData=function()
    {
        if (this.IndexData) return this.Execute.RunNextJob();

        var self=this;
        if (JSCommonData.ChartData.IsDayPeriod(this.Period,true))     //请求日线数据
        {
            wx.request({
                url: self.KLineApiUrl,
                data:
                {
                    "field": ["name", "symbol", "yclose", "open", "price", "high", "low", "vol", 'up', 'down', 'stop', 'unchanged'],
                    "symbol": '000001.sh',
                    "start": -1,
                    "count": self.MaxReqeustDataCount+500   //多请求2年的数据 确保股票剔除停牌日期以后可以对上
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
            wx.request({
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
        console.log('[JSSymbolData::RecvIndexHistroyData] recv data' , data);

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
        console.log('[JSSymbolData::RecvIndexMinuteHistroyData] recv data' , data);

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
        console.log('[JSSymbolData::GetIndexIncreaseData] Get url=', apiUrl);
        wx.request({
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
        console.log('[JSSymbolData::RecvMinuteIncreaseData] recv data', recvData);
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
            wx.request({
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
            wx.request({
                url: self.KLineApiUrl,
                data:
                {
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol"],
                    "symbol": self.Symbol,
                    "start": -1,
                    "count": self.MaxReqeustDataCount
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
            wx.request({
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
        console.log('[JSSymbolData::RecvHistroyData] recv data' , data);

        let hisData=this.JsonDataToHistoryData(data);
        this.Data=new JSCommonData.ChartData();
        this.Data.DataType=0; /*日线数据 */
        this.Data.Data=hisData;
        this.SourceData = new JSCommonData.ChartData;
        this.SourceData.Data = hisData;

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

        this.Name = data.name;
    }

    this.RecvMinuteHistroyData = function (recvData)
    {
        let data = recvData.data;
        console.log('[JSSymbolData::RecvMinuteHistroyData] recv data' , data);

        let hisData=this.JsonDataToMinuteHistoryData(data);
        this.Data = new JSCommonData.ChartData();
        this.Data.DataType=1; /*分钟线数据 */
        this.Data.Data=hisData;
        this.SourceData = new JSCommonData.ChartData;
        this.SourceData.Data = hisData;

        if (JSCommonData.ChartData.IsMinutePeriod(this.Period, false))   //周期数据
        {
            let periodData=this.Data.GetPeriodData(this.Period);
            this.Data.Data=periodData;
        }

        this.Name = data.name;
    }

    //最新的分钟数据走势图
    this.RecvMinuteData = function (recvData) 
    {
        let data = recvData.data;
        console.log('[JSSymbolData::RecvMinuteData] recv data', data);

        var aryMinuteData = this.JsonDataToMinuteData(data);
        this.Data = new JSCommonData.ChartData();
        this.Data.DataType = 2; /*分钟走势图数据 */
        this.Data.Data = aryMinuteData;

        this.Name = data.stock[0].name;
    }

    this.GetSymbolCacheData=function(dataName)
    {
        if (!this.Data) return new Array();

        switch(dataName)
        {
            case 'CLOSE':
            case 'C':
                return this.Data.GetClose();
            case 'VOL':
            case 'V':
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
            case 'VOLINSTK':
                return this.Data.GetPosition();
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

    //财务函数
    this.GetFinanceCacheData=function(id, node)
    {
        let jobID=JS_EXECUTE_JOB_ID.GetFinnanceJobID(id);
        if (!jobID) this.Execute.ThrowUnexpectedNode(node,'不支持FINANCE('+id+')');
        if(this.FinanceData.has(jobID)) return this.FinanceData.get(jobID);

        return [];
    }

    this.GetCompanyReleaseDate = function (jobID) 
    {
        if (this.FinanceData.has(jobID)) return this.Execute.RunNextJob();

        var self = this;
        wx.request({
            url: self.RealtimeApiUrl,
            data:
                {
                    "field": ["name", "symbol", "company.releasedate"],   //公司上司日期
                    "symbol": [this.Symbol]
                },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (recvData) 
            {
                self.RecvCompanyReleaseDate(jobID, recvData);
                self.Execute.RunNextJob();
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvCompanyReleaseDate = function (jobID, recvData) 
    {
        let data=recvData.data;
        if (!data.stock || data.stock.length != 1) return;
        let value = data.stock[0].company.releasedate;
        let releaseDate = new Date(value / 10000, value % 10000 / 100, value % 100);

        let aryData = [];
        for (let i in this.Data.Data) 
        {
            value = this.Data.Data[i].Date;
            let date = new Date(value / 10000, value % 10000 / 100, value % 100);
            let item = new JSCommonData.SingleData();
            item.Date = value;
            item.Value = parseInt((date - releaseDate) / (1000 * 60 * 60 * 24));
            aryData[i] = item;
        }

        //console.log('[JSSymbolData::RecvCompanyReleaseDate] jobID=', jobID, aryData)

        var bindData = new JSCommonData.ChartData();
        bindData.Data = aryData;
        bindData.Period = this.Period;    //周期

        if (bindData.Period > 0)          //周期数据
        {
            var periodData = bindData.GetPeriodSingleData(bindData.Period);
            bindData.Data = periodData;
        }

        let stockData = bindData.GetValue();
        this.FinanceData.set(jobID, stockData);
    }

    //下载财务数据
    this.GetFinanceData=function(jobID)
    {
        if (this.FinanceData.has(jobID)) return this.Execute.RunNextJob();

        console.log('[JSSymbolData::GetFinanceData] jobID=', jobID);
        var self=this;
        let fieldList=["name","date","symbol"];
        
        switch(jobID)
        {
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA:   //流通股本（万股）
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA:       //流通股本（手）
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA:   //流通市值
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA:
                fieldList.push("capital.a");
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA:  //总股本（万股）
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:   //总市值
                fieldList.push('capital.total');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
                fieldList.push('finance.peruprofit');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
                fieldList.push('finance.pernetasset');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
                fieldList.push('finance.percreserve');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA:
                fieldList.push('finance.persearning');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
                fieldList.push('finance.nprofit');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
                fieldList.push('finance.alratio');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
                fieldList.push('finance.profityoy');
                break;
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:    //过去4个季度现金分红总额
                fieldList.push('execdividend.quarter4');
                break;
        }

         //请求数据
        wx.request({
            url: this.StockHistoryDayApiUrl,
            data:
            {
                "field": fieldList,
                "symbol": [this.Symbol],
            },
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvFinanceData(recvData,jobID);
                self.Execute.RunNextJob();
            }
        });
    }

    this.RecvFinanceData=function(recvData,jobID)
    {
        switch(jobID)
        {
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:
                return this.RecvStockDayData(recvData,jobID);
        }
    }

    this.RecvStockDayData=function(recvData,jobID)
    {
        let data=recvData.data;
        console.log(data);
        if (!data.stock || data.stock.length!=1) return;

        let stock = data.stock[0];
        var aryData=new Array();
        var bFinanceData = false; //是否是定期的财务数据
        var bMarketValue = false; //是否计算市值
        for(let i in stock.stockday)
        {
            var item=stock.stockday[i];
            let indexData=new JSCommonData.SingleData();
            indexData.Date=item.date;

            switch (jobID) 
            {
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA:
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.a)) continue;
                    indexData.Value = financeData.a / 100;    //流通股本（手）
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA:
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.total)) continue;
                    indexData.Value = financeData.total / 10000; //总股本（万股）
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA:
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.a)) continue;
                    indexData.Value = financeData.a / 10000; //流通股本（万股）
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA:   //流通市值
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.a)) continue;
                    indexData.Value = financeData.a; //流通股本
                    bMarketValue = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:       //总市值
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.total)) continue;
                    indexData.Value = financeData.total; //总股本
                    bMarketValue = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA:          //换手率
                    var financeData = item.capital;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.a)) continue;
                    indexData.Value = financeData.a; //流通股本
                    bFinanceData = true;
                    break;

                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.peruprofit)) continue;
                    indexData.Value = financeData.Finance.peruprofit;        //每股未分配利润
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.pernetasset)) continue;
                    indexData.Value = financeData.Finance.pernetasset;       //每股净资产
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.percreserve)) continue;
                    indexData.Value = financeData.Finance.percreserve;       //每股资本公积金
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.persearning)) continue;
                    indexData.Value = financeData.Finance.persearning;       //每股收益
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.persearning)) continue;
                    indexData.Value = financeData.Finance.persearning / financeData.Announcement.quarter * 4;       //每股收益(折算为全年收益)  报告期每股收益/报告期*4
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.nprofit)) continue;
                    indexData.Value = financeData.Finance.nprofit;       //净利润
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.alratio)) continue;
                    indexData.Value = financeData.Finance.alratio;       //资产负债率
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
                    var financeData = this.JsonDataToFinance(item);
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.Finance.profityoy)) continue;
                    indexData.Value = financeData.Finance.profityoy;       //净利润同比增长率
                    bFinanceData = true;
                    break;
                case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:
                    var financeData = item.execdividend;
                    if (!financeData) continue;
                    if (!this.IsNumber(financeData.quarter4)) continue;
                    indexData.Value = financeData.quarter4;       //过去4个季度现金分红总额
                    break;
                default:
                    continue;
            }

            aryData.push(indexData);
        }

        if (jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA) //当前流通股本 单数值
        {
            var value = null;
            if (aryData.length > 0) 
            {
                value = parseInt(aryData[aryData.length - 1].Value);
            }
            this.FinanceData.set(jobID, value);
            return;
        }

        let aryFixedData;
        if (bFinanceData) 
        {
            aryFixedData = this.Data.GetFittingFinanceData(aryData);
        }
        else if (bMarketValue) 
        {
            if (this.SourceData) aryFixedData = this.SourceData.GetFittingMarketValueData(aryData);   //总市值用不复权的价格计算
            else aryFixedData = this.Data.GetFittingMarketValueData(aryData);

            if (jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA) this.MarketValue = aryFixedData;  //总市值保存下 算其他数据可能要用
        }
        else if (jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA)          //股息率TTM：过去4个季度现金分红总额/总市值 * 100%
        {
            aryFixedData = this.CalculateDividendYield(aryData);
        }
        else 
        {
            aryFixedData = this.Data.GetFittingData(aryData);
        }

        var bindData = new JSCommonData.ChartData();
        bindData.Data=aryFixedData;
        bindData.Period=this.Period;    //周期

        if (bindData.Period>0)          //周期数据
        {
            var periodData=bindData.GetPeriodSingleData(bindData.Period);
            bindData.Data=periodData;
        }

        if (jobID===JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA)   //计算换手率 成交量/流通股本*100
        {
            for (let i in this.Data.Data) 
            {
                if (this.IsNumber(bindData.Data[i].Value) && bindData.Data[i].Value != 0)
                    bindData.Data[i].Value = this.Data.Data[i].Vol / bindData.Data[i].Value * 100;
                else
                    bindData.Data[i].Value = 1;
            }
        }

        let stockData=bindData.GetValue();
        this.FinanceData.set(jobID, stockData);
    }

    //计算股息率 股息率TTM：过去4个季度现金分红总额/总市值 * 100%
    //计算股息率 股息率TTM：过去4个季度现金分红总额/总市值 * 100%
    this.CalculateDividendYield = function (cashData) 
    {
        var dividendYield = [];
        if (!this.MarketValue) return dividendYield;

        for (let i = 0, j = 0; i < this.Data.Data.length; ++i) 
        {
            var day = this.Data.Data[i];
            var market = this.MarketValue[i];
            if (!day || !market) continue;

            let item = new JSCommonData.SingleData();
            item.Date = day.Date;
            item.Value = 0;

            if (j + 1 < cashData.length) 
            {
                if (cashData[j].Date < day.Date && cashData[j + 1].Date <= day.Date) 
                {
                    ++j;
                    --i;
                    continue;
                }
            }

            if (j < cashData.length) 
            {
                var cash = cashData[j];
                var endDate = cash.Date + 10000;    //1年有效

                if (day.Date >= cash.Date && day.Date <= endDate && this.IsDivideNumber(market.Value) && this.IsNumber(cash.Value)) 
                {
                    item.Value = (cash.Value / market.Value) * 100;
                }
            }

            dividendYield.push(item);
        }

        return dividendYield;
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

        console.log('[JSSymbolData::GetMarginData] jobID=', jobID);
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
        wx.request({
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
        //console.log(data);
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
        wx.request({
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
        console.log('[JSSymbolData::RecvNewsAnalysisDataError] request error.', recvData.statusCode);

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

        console.log('[JSSymbolData::RecvNewsAnalysisData] jobID', jobID, data.update);
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

    this.GetIndustry = function () //行业
    {
        var key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA.toString() + '-Group-' + this.Symbol;
        if (!this.ExtendData.has(key)) return '';

        var group = this.ExtendData.get(key);
        if (!group.Industry || group.Industry.length <= 0) return '';

        var result = '';
        for (var i in group.Industry) 
        {
            var item = group.Industry[i];
            if (result.length > 0) result += ' ';
            result += item.Name;
        }

        return result;
    }

    this.GetRegion = function ()    //地区
    {
        var key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA.toString() + '-Group-' + this.Symbol;
        if (!this.ExtendData.has(key)) return '';

        var group = this.ExtendData.get(key);
        if (!group.Region || group.Region.length <= 0) return '';

        var result = '';
        for (var i in group.Region) 
        {
            var item = group.Region[i];
            if (result.length > 0) result += ' ';
            result += item.Name;
        }

        return result;
    }

    this.GetConcept = function () //概念
    {
        var key = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA.toString() + '-Group-' + this.Symbol;
        if (!this.ExtendData.has(key)) return '';

        var group = this.ExtendData.get(key);
        if (!group.Concept || group.Concept.length <= 0) return '';

        var result = '';
        for (var i in group.Concept) 
        {
            var item = group.Concept[i];
            if (result.length > 0) result += ' ';
            result += item.Name;
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

            tempDate.setFullYear(year);
            tempDate.setMonth(month - 1);
            tempDate.setDate(day);

            result[i] = tempDate.getDay();
        }

        return result;
    }

    this.REFDATE = function (data, date) 
    {
        var result = null;
        var index = null;
        for (let i in this.Data.Data)   //查找日期对应的索引
        {
            if (this.Data.Data[i].Date == date) 
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
                financeData = { Date: item.date, Finance: finance, Announcement: announcement };
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
    JOB_DOWNLOAD_GROUP_DATA: 6,          //所属行业|地区|概念

    //财务函数
    JOB_DOWNLOAD_TOTAL_EQUITY_DATA: 100,          //总股本（万股）
    JOB_DOWNLOAD_FLOW_EQUITY_DATA: 101,           //流通股本（万股）
    JOB_DOWNLOAD_PER_U_PROFIT_DATA: 102,          //每股未分配利润
    JOB_DOWNLOAD_PER_NETASSET_DATA: 103,          //每股净资产
    JOB_DOWNLOAD_PER_C_RESERVE_DATA: 104,         //每股资本公积金
    JOB_DOWNLOAD_PER_S_EARNING_DATA: 105,         //每股收益 
    JOB_DOWNLOAD_PER_S_EARNING2_DATA: 106,        //每股收益(折算为全年收益),对于沪深品种有效
    JOB_DOWNLOAD_RELEASE_DATE_DATA: 107,          //上市的天数
    JOB_DOWNLOAD_N_PROFIT_DATA: 108,              //净利润
    JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA: 109,      //流通市值
    JOB_DOWNLOAD_MARKETVALUE_DATA: 110,           //总市值
    JOB_DOWNLOAD_PROFIT_YOY_DATA: 111,            //利润同比 (Profit year on year)
    JOB_DOWNLOAD_AL_RATIO_DATA: 112,              //资产负债率 (asset-liability ratio)
    JOB_DOWNLOAD_DIVIDEND_YIELD_DATA: 113,        //股息率


    JOB_DOWNLOAD_CAPITAL_DATA: 200,               //流通股本（手）
    JOB_DOWNLOAD_EXCHANGE_DATA: 201,              //换手率 成交量/流通股本*100

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

    JOB_CUSTOM_FUNCTION_DATA: 6000,       //自定义函数
    JOB_CUSTOM_VARIANT_DATA: 6001,        //自定义变量

    JOB_DOWNLOAD_CUSTOM_API_DATA: 30000,    //自定义数据

    JOB_RUN_SCRIPT:10000, //执行脚本

    GetFinnanceJobID:function(value)
    {
        let dataMap=new Map([
            [1, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA],       //FINANCE(1)   总股本（万股）
            [7, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA],        //FINANCE(7)   流通股本（万股）
            [9, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA],           //FINANCE(9)   资产负债率 (asset-liability ratio)
            [18, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA],     //FINANCE(18)  每股公积金
            [30, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA],          //FINANCE(30)  净利润
            [32, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA],      //FINANCE(32)  每股未分配利润
            [33, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA],    //FINANCE(33)  每股收益(折算为全年收益),对于沪深品种有效
            [34, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA],      //FINANCE(34)  每股净资产
            [38, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA],     //FINANCE(38)  每股收益(最近一期季报)
            [40, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA],  //FINANCE(40)  流通市值 
            [41, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA],       //FINANCE(41)  总市值
            [42, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_RELEASE_DATE_DATA],      //FINANCE(42)  上市的天数
            [43, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA],        //FINANCE(43)  利润同比 (Profit year on year)
            [45, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA],    //FINANCE(45)  股息率

            [200, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA],          //流通股本（手）
            [201, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA]          //换手率 成交量/流通股本*100
        ]);
    
        if (dataMap.has(value)) return dataMap.get(value);
    
        return null;
    },

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
    this.OutVarTable=new Array();   //输出变量
    this.Arguments=[];

    //脚本自动变量表, 只读
    this.ConstVarTable=new Map([
        //个股数据
        ['CLOSE', null], ['VOL', null], ['OPEN', null], ['HIGH', null], ['LOW', null], ['AMOUNT', null], ['AMO', null], ['VOLINSTK',null],
        ['C', null], ['V', null], ['O', null], ['H', null], ['L', null], ['VOLR', null],

        //日期类
        ['DATE', null], ['YEAR', null], ['MONTH', null], ['PERIOD', null], ['WEEK', null],

        //大盘数据
        ['INDEXA',null],['INDEXC',null],['INDEXH',null],['INDEXL',null],['INDEXO',null],['INDEXV',null],
        ['INDEXADV', null], ['INDEXDEC', null],

        ['CURRBARSCOUNT', null], //到最后交易日的周期数
        ['ISLASTBAR', null],     //判断是否为最后一个周期
        
        ['CAPITAL', null],   //流通股本（手）
        ['EXCHANGE', null],  //换手率
        ['SETCODE', null],   //市场类型
        ['CODE', null],      //品种代码
        ['STKNAME', null],   //品种名称 

        ['HYBLOCK', null],   //所属行业板块
        ['DYBLOCK', null],   //所属地域板块
        ['GNBLOCK', null],    //所属概念

        ['DRAWNULL', null]   
    ]);   

    this.SymbolData=new JSSymbolData(this.AST,option,this);
    this.Algorithm = new JSAlgorithm(this.ErrorHandler, this.SymbolData);
    this.Draw = new JSDraw(this.ErrorHandler, this.SymbolData);
    this.JobList=[];    //执行的任务队列

    this.UpdateUICallback=null; //回调
    this.CallbackParam=null;

    if (option)
    {
        if (option.Callback) this.UpdateUICallback=option.Callback;
        if (option.CallbackParam) this.CallbackParam=option.CallbackParam;
        if (option.Arguments) this.Arguments=option.Arguments;
    }

    this.Execute=function()
    {
        console.log('[JSExecute::Execute] JobList', this.JobList);
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
                return this.SymbolData.GetLatestData();
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_VOLR_DATA:  //量比
                return this.SymbolData.GetVolRateData(jobItem);
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_GROUP_DATA:
                return this.SymbolData.GetGroupData(jobItem); //行业|概念|地区

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:
                return this.SymbolData.GetFinanceData(jobItem.ID);
            
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

            case JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CUSTOM_API_DATA:
                return this.SymbolData.DownloadCustomAPIData(jobItem);

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
            case 'VOLINSTK':
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
            case 'ISLASTBAR':
                return this.SymbolData.GetIsLastBar();
            case 'CAPITAL':
                return this.SymbolData.GetFinanceCacheData(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA);
            case 'EXCHANGE':
                return this.SymbolData.GetFinanceCacheData(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA);
            case 'SETCODE':
                return this.SymbolData.SETCODE();

            case 'CODE':
                return this.SymbolData.GetSymbol();
            case 'STKNAME':
                return this.SymbolData.GetName();
            case 'HYBLOCK':
                return this.SymbolData.GetIndustry();
            case 'DYBLOCK':
                return this.SymbolData.GetRegion();
            case 'GNBLOCK':
                return this.SymbolData.GetConcept();
            
            case 'DATE':
                return this.SymbolData.DATE();
            case 'YEAR':
                return this.SymbolData.YEAR();
            case 'MONTH':
                return this.SymbolData.MONTH();
            case 'WEEK':
                return this.SymbolData.WEEK();
            case 'PERIOD':
                return this.SymbolData.PERIOD();

            case 'DRAWNULL':
                return this.SymbolData.GetDrawNull();
        }
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

        if (this.VarTable.has(name)) return this.VarTable.get(name);

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
        for(let i in this.Arguments)
        {
            let item =this.Arguments[i];
            this.VarTable.set(item.Name,item.Value);
        }

        if (!this.AST) this.ThrowError();
        if (!this.AST.Body) this.ThrowError();

        for(let i in this.AST.Body)
        {
            let item =this.AST.Body[i];
            this.VisitNode(item);

            //输出变量
            if (item.Type==Syntax.ExpressionStatement && item.Expression)
            {
                if (item.Expression.Type==Syntax.AssignmentExpression && item.Expression.Operator==':' && item.Expression.Left)
                {
                    let assignmentItem=item.Expression;
                    let varName=assignmentItem.Left.Name;
                    let outVar=this.VarTable.get(varName);
                    if (!Array.isArray(outVar)) 
                    {
                        if (typeof (outVar) == 'string') outVar = this.SingleDataToArrayData(parseFloat(outVar));
                        else outVar = this.SingleDataToArrayData(outVar);
                    }

                    this.OutVarTable.push({Name:varName, Data:outVar,Type:0});
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
                }
                else if (item.Expression.Type==Syntax.SequenceExpression)
                {
                    let varName;
                    let draw;
                    let color;
                    let lineWidth;
                    let colorStick=false;
                    let pointDot=false;
                    let circleDot=false;
                    let lineStick=false;
                    let stick=false;
                    let volStick=false;
                    let isShow = true;
                    let isExData = false;
                    let isDotLine = false;
                    let isOverlayLine = false;    //叠加线
                    for(let j in item.Expression.Expression)
                    {
                        let itemExpression=item.Expression.Expression[j];
                        if (itemExpression.Type==Syntax.AssignmentExpression && itemExpression.Operator==':' && itemExpression.Left)
                        {
                            varName = itemExpression.Left.Name;
                            let varValue = this.VarTable.get(varName);
                            if (!Array.isArray(varValue)) 
                            {
                                varValue = this.SingleDataToArrayData(varValue);
                                this.VarTable.set(varName, varValue);            //把常量放到变量表里
                            } 
                        }
                        else if (itemExpression.Type==Syntax.Identifier)
                        {
                            let value=itemExpression.Name;
                            if (value==='COLORSTICK') colorStick=true;
                            else if (value==='POINTDOT') pointDot=true;
                            else if (value==='CIRCLEDOT') circleDot=true;
                            else if (value == 'DOTLINE') isDotLine = true;
                            else if (value==='LINESTICK') lineStick=true;
                            else if (value==='STICK') stick=true;
                            else if (value==='VOLSTICK') volStick=true;
                            else if (value.indexOf('COLOR')==0) color=value;
                            else if (value.indexOf('LINETHICK')==0) lineWidth=value;
                            else if (value.indexOf('NODRAW') == 0) isShow = false;
                            else if (value.indexOf('EXDATA') == 0) isExData = true; //扩展数据, 不显示再图形里面
                            else if (value.indexOf('LINEOVERLAY') == 0) isOverlayLine = true;
                        }
                        else if (itemExpression.Type == Syntax.Literal)    //常量
                        {
                            let aryValue = this.SingleDataToArrayData(itemExpression.Value);
                            varName = itemExpression.Value.toString();
                            this.VarTable.set(varName, aryValue);    //把常量放到变量表里
                        }
                        else if (itemExpression.Type==Syntax.CallExpression && this.Draw.IsDrawFunction(itemExpression.Callee.Name))
                        {
                            draw=itemExpression.Draw;
                            draw.Name=itemExpression.Callee.Name;
                        }
                    }

                    if (pointDot && varName)   //圆点
                    {
                        let outVar=this.VarTable.get(varName);
                        let value={Name:varName, Data:outVar, Radius:2, Type:3};
                        if (color) value.Color=color;
                        if (lineWidth) value.LineWidth = lineWidth;
                        this.OutVarTable.push(value);
                    }
                    else if (circleDot && varName)  //圆点
                    {
                        let outVar=this.VarTable.get(varName);
                        let value={Name:varName, Data:outVar, Radius:1.3, Type:3};
                        if (color) value.Color=color;
                        if (lineWidth) value.LineWidth = lineWidth;
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
                        this.OutVarTable.push(value);
                    }
                    else if (varName && color) 
                    {
                        let outVar=this.VarTable.get(varName);
                        let value={Name:varName, Data:outVar, Color:color, Type:0};
                        if (lineWidth) value.LineWidth=lineWidth;
                        if (isShow == false) value.IsShow = false;
                        if (isExData == true) value.IsExData = true;
                        if (isDotLine == true) value.IsDotLine = true;
                        if (isOverlayLine == true) value.IsOverlayLine = true;
                        this.OutVarTable.push(value);
                    }
                    else if (draw)
                    {
                        var outVar = { Name: draw.Name, Draw: draw, Type: 1 };
                        if (color) outVar.Color = color;
                        if (lineWidth) outVar.LineWidth = lineWidth;
                        this.OutVarTable.push(outVar);
                    }
                    else if (colorStick && varName)  //CYW: SUM(VAR4,10)/10000, COLORSTICK; 画上下柱子
                    {
                        let outVar=this.VarTable.get(varName);
                        let value={Name:varName, Data:outVar, Color:color, Type:2};
                        this.OutVarTable.push(value);
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
                        this.OutVarTable.push(value);
                    }
                }
            }
        }

        console.log('[JSExecute::Run]', this.VarTable);

        return this.OutVarTable;
    }

    this.Run=function()
    {                        
        let data=this.RunAST();//执行脚本
        console.log('[JSComplier.Run] execute finish', data);
        
        if (this.UpdateUICallback) 
        {
            console.log('[JSComplier.Run] invoke UpdateUICallback.');
            this.UpdateUICallback(data,this.CallbackParam);
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

        if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitCallExpression]' , funcName, '(', args.toString() ,')');

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
            case 'DRAWICON':
                node.Draw = this.Draw.DRAWICON(args[0], args[1], args[2]);
                node.Out = [];
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
                node.Draw = this.Draw.DRAWKLINE(args[0], args[1], args[2], args[3]);
                node.Out = [];
                break;
            case 'DRAWKLINE_IF':
                node.Draw = this.Draw.DRAWKLINE_IF(args[0], args[1], args[2], args[3], args[4]);
                node.Out = [];
                break;
            case 'PLOYLINE':
            case 'POLYLINE':
                node.Draw = this.Draw.POLYLINE(args[0], args[1]);
                node.Out = node.Draw.DrawData;
                break;
            case 'DRAWNUMBER':
                node.Draw = this.Draw.DRAWNUMBER(args[0], args[1], args[2]);
                node.Out = node.Draw.DrawData.Value;
                break;
            case 'RGB':
                node.Out = this.Draw.RGB(args[0], args[1], args[2]);
                break;
            case 'DRAWRECTREL':
                node.Draw = this.Draw.DRAWRECTREL(args[0], args[1], args[2], args[3], args[4]);
                node.Out = [];
                break;
            case 'CODELIKE':
                node.Out=this.SymbolData.CODELIKE(args[0]);
                break;
            case 'NAMELIKE':
                node.Out = this.SymbolData.NAMELIKE(args[1]);
                break;
            case 'REFDATE':
                node.Out = this.SymbolData.REFDATE(args[0], args[1]);
                break;
            case 'FINANCE':
                node.Out=this.SymbolData.GetFinanceCacheData(args[0],node);
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
        let value=null;
        if (right.Type==Syntax.BinaryExpression || right.Type==Syntax.LogicalExpression)
            value=this.VisitBinaryExpression(right);
        else if (right.Type==Syntax.CallExpression)
            value=this.VisitCallExpression(right);
        else if (right.Type==Syntax.Literal)
            value=right.Value;
        else if (right.Type==Syntax.Identifier) //右值是变量
            value=this.ReadVariable(right.Name,right);
        else if (right.Type == Syntax.MemberExpression)
            value = this.ReadMemberVariable(right);

        if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitAssignmentExpression]' , varName, ' = ',value);
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

                    if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitBinaryExpression] BinaryExpression',value , leftValue, rightValue);
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

                    if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitBinaryExpression] BinaryExpression',value);
                }
                else if (value.Type==Syntax.LogicalExpression)
                {
                    let leftValue=this.GetNodeValue(value.Left);
                    let rightValue=this.GetNodeValue(value.Right);

                    if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitBinaryExpression] LogicalExpression',value , leftValue, rightValue);
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

                    if (JS_EXECUTE_DEBUG_LOG) console.log('[JSExecute::VisitBinaryExpression] LogicalExpression',value);
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
                    return this.Algorithm.Subtract(0,value);
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
    console.log('[JSComplier.Tokenize]', code);
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
    console.log('[JSComplier.Parse]',code);

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
    option.MaxReqeustDataCount=请求数据的最大个数
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
            console.log('[JSComplier.Execute]',code,option);

            console.log('[JSComplier.Execute] parser .....');
            let parser=new JSParser(code);
            parser.Initialize();
            let program=parser.ParseScript(); 
            
            let ast=program;
            console.log('[JSComplier.Execute] parser finish.', ast);

            console.log('[JSComplier.Execute] execute .....');
            let execute=new JSExecute(ast,option);
            execute.JobList=parser.Node.GetDataJobList();
            execute.JobList.push({ID:JS_EXECUTE_JOB_ID.JOB_RUN_SCRIPT});

            let result=execute.Execute();

        }catch(error)
        {
            console.log(error);

            if (errorCallback) errorCallback(error);
        }
    }

    asyncExecute();

    console.log('[JSComplier.Execute] async execute.');
}

JSComplier.SetDomain = function (domain, cacheDomain) 
{
    if (domain) g_JSComplierResource.Domain = domain;
    if (cacheDomain) g_JSComplierResource.CacheDomain = cacheDomain;
}



/* 测试例子
var code1='VARHIGH:IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;';
var code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);';
var code3='mm1=1-2*-9+20;';

console.log(code1+code2)
var tokens=JSComplier.Tokenize(code1+code2);
var ast=JSComplier.Parse(code2+code1);

console.log(ast);
*/


module.exports =
{
    JSCommonComplier:
    {
        JSComplier: JSComplier
    }
};