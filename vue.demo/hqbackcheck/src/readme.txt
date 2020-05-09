修改编辑器的关键字：
1.在App.vue中，对编辑器配置：mode: 'text/javascript',
2.修改对应的mode文件：
    路径：node_modules/codemirror/mode/javascript/javascript.js
    修改点：将keywords()替换成如下代码：

    var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var FUNCTION_NAME=kw('functionname'); //函数名
    var DATA_NAME={type: "dataname", style:'variable-2'}; //行情数据变量
    var LINE_WIDTH_NAME=kw('linewidth');
    var DRAW_NAME=kw("drawname");

    //颜色
    var COLORBLACK={type: "colorname", style:'colorblack'};
    var COLORBLUE={type: "colorname", style:'colorblue'};
    var COLORGREEN={type: "colorname", style:'colorgreen'};
    var COLORCYAN={type: "colorname", style:'colorcyan'};
    var COLORRED={type: "colorname", style:'colorred'};
    var COLORMAGENTA={type: "colorname", style:'colormagenta'};
    var COLORBROWN={type: "colorname", style:'colorbrown'};
    var COLORLIGRAY={type: "colorname", style:'colorligray'};
    var COLORGRAY={type: "colorname", style:'colorgray'};
    var COLORLIBLUE={type: "colorname", style:'colorliblue'};
    var COLORLIGREEN={type: "colorname", style:'colorligreen'};
    var COLORLICYAN={type: "colorname", style:'colorlicyan'};
    var COLORLIRED={type: "colorname", style:'colorlired'};
    var COLORLIMAGENTA={type: "colorname", style:'colorlimagenta'};
    var COLORWHITE={type: "colorname", style:'colorwhite'};
    var COLORYELLOW={type: "colorname", style:'coloryellow'};

    /*
    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };
    */

   var jsKeywords = 
   {
      "MA":FUNCTION_NAME,"MAX":FUNCTION_NAME,"REF":FUNCTION_NAME,"EXPMEMA":FUNCTION_NAME,"IF":FUNCTION_NAME,'IFF':FUNCTION_NAME,
      "ABS":FUNCTION_NAME,"SUM":FUNCTION_NAME,"HHV":FUNCTION_NAME,"LLV":FUNCTION_NAME,"EMA":FUNCTION_NAME,
      "SUM":FUNCTION_NAME,'RANGE':FUNCTION_NAME,'EXIST':FUNCTION_NAME,'TFILTER':FUNCTION_NAME,'CODELIKE':FUNCTION_NAME,
      'BARSLAST':FUNCTION_NAME,'SMA':FUNCTION_NAME,'BARSCOUNT':FUNCTION_NAME,'VOLSTICK':FUNCTION_NAME,'CROSS':FUNCTION_NAME,
      'NOT':FUNCTION_NAME,'SLOPE':FUNCTION_NAME,'NAMELIKE':FUNCTION_NAME,'BARSSINCEN':FUNCTION_NAME,'BARSSINCE':FUNCTION_NAME,
      'ATAN':FUNCTION_NAME,'ACOS':FUNCTION_NAME,'ASIN':FUNCTION_NAME,'COS':FUNCTION_NAME,'SIN':FUNCTION_NAME,'TAN':FUNCTION_NAME,
      'LAST':FUNCTION_NAME,'LN':FUNCTION_NAME,'LOG':FUNCTION_NAME,'EXP':FUNCTION_NAME,'SQRT':FUNCTION_NAME,"REFDATE":FUNCTION_NAME,
      'DEVSQ':FUNCTION_NAME,'MIN':FUNCTION_NAME,'ZIG':FUNCTION_NAME,'TROUGHBARS':FUNCTION_NAME,'PEAKBARS':FUNCTION_NAME,'EVERY':FUNCTION_NAME,
      'COST':FUNCTION_NAME,'WINNER':FUNCTION_NAME,'COUNT':FUNCTION_NAME,'FORCAST':FUNCTION_NAME,'STDP':FUNCTION_NAME,'VAR':FUNCTION_NAME,
      'VARP':FUNCTION_NAME,'NDAY':FUNCTION_NAME,'UPNDAY':FUNCTION_NAME,'DOWNNDAY':FUNCTION_NAME,'LONGCROSS':FUNCTION_NAME,'EXISTR':FUNCTION_NAME,
      'RELATE':FUNCTION_NAME,'COVAR':FUNCTION_NAME,'HHVBARS':FUNCTION_NAME,'LLVBARS':FUNCTION_NAME,'BETA':FUNCTION_NAME,
      'DRAWKLINE_IF':FUNCTION_NAME,'BACKSET':FUNCTION_NAME,'SARTURN':FUNCTION_NAME,'SAR':FUNCTION_NAME,'REVERSE':FUNCTION_NAME,'SUMBARS':FUNCTION_NAME,
      'MEMA':FUNCTION_NAME,'WMA':FUNCTION_NAME,

      //动态行情函数
      "DYNAINFO":FUNCTION_NAME,

      //财务数据函数
      'FINANCE':FUNCTION_NAME,

      //融资融券
      'MARGIN':FUNCTION_NAME,

      //新闻统计
      'NEWS':FUNCTION_NAME,

      //日期类
      'DATE':DATA_NAME,'MONTH':DATA_NAME,'YEAR':DATA_NAME,

      //绘图函数
      'DRAWTEXT':FUNCTION_NAME,'STICKLINE':FUNCTION_NAME,'DRAWBAND':FUNCTION_NAME,'DRAWKLINE':FUNCTION_NAME,
      'PLOYLINE':FUNCTION_NAME,'POLYLINE':FUNCTION_NAME,'DRAWNUMBER':FUNCTION_NAME,'DRAWICON':FUNCTION_NAME,'SUPERDRAWTEXT':FUNCTION_NAME,

      //个股行情数据
      "CLOSE":DATA_NAME, "C":DATA_NAME,"VOL":DATA_NAME, "V":DATA_NAME, 
      "OPEN":DATA_NAME, "O":DATA_NAME, "HIGH":DATA_NAME, "H":DATA_NAME, "LOW":DATA_NAME,"L":DATA_NAME,"AMOUNT":DATA_NAME,
      "CURRBARSCOUNT":DATA_NAME,

      //大盘数据
      "INDEXA":DATA_NAME,"INDEXC":DATA_NAME,"INDEXH":DATA_NAME,"INDEXL":DATA_NAME,"INDEXO":DATA_NAME,"INDEXV":DATA_NAME,'INDEXADV':DATA_NAME,'INDEXDEC':DATA_NAME,
      'UPCOUNT':FUNCTION_NAME,'DOWNCOUNT':FUNCTION_NAME,

      //线段宽度
      'LINETHICK1':LINE_WIDTH_NAME,'LINETHICK2':LINE_WIDTH_NAME,'LINETHICK3':LINE_WIDTH_NAME,'LINETHICK4':LINE_WIDTH_NAME,'LINETHICK5':LINE_WIDTH_NAME,
      'LINETHICK6':LINE_WIDTH_NAME,'LINETHICK7':LINE_WIDTH_NAME,'LINETHICK8':LINE_WIDTH_NAME,'LINETHICK9':LINE_WIDTH_NAME,'LINETHICK10':LINE_WIDTH_NAME,

      'COLORSTICK':DRAW_NAME,'CIRCLEDOT':DRAW_NAME,'POINTDOT':DRAW_NAME,'LINESTICK':DRAW_NAME,'STICK':DRAW_NAME,'NODRAW':DRAW_NAME,

      //颜色
      'COLORYELLOW':COLORYELLOW,'COLORBLACK':COLORBLACK,'COLORBLUE':COLORBLUE,'COLORGREEN':COLORGREEN,'COLORCYAN':COLORCYAN,'COLORRED':COLORRED,
      'COLORMAGENTA':COLORMAGENTA,'COLORBROWN':COLORBROWN,'COLORLIGRAY':COLORLIGRAY,'COLORGRAY':COLORGRAY,'COLORLIBLUE':COLORLIBLUE,'COLORLIGREEN':COLORLIGREEN,
      'COLORLICYAN':COLORLICYAN,'COLORLIRED':COLORLIRED,'COLORLIMAGENTA':COLORLIMAGENTA,'COLORWHITE':COLORWHITE
   };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        // types
        "string": type, "number": type, "bool": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();