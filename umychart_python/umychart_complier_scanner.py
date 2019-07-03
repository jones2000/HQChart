#################################################################
#
#
#
####################################################################
import sys
import unicodedata
from collections import defaultdict

from umychart_complier_util import xrange, unicode, uchr, uord


class Messages:
    BadGetterArity = 'Getter must not have any formal parameters'
    BadSetterArity= 'Setter must have exactly one formal parameter'
    BadSetterRestParameter= 'Setter function argument must not be a rest parameter'
    ConstructorIsAsync= 'Class constructor may not be an async method'
    ConstructorSpecialMethod= 'Class constructor may not be an accessor'
    DeclarationMissingInitializer= 'Missing initializer in %0 declaration'
    DefaultRestParameter= 'Unexpected token ='
    DuplicateBinding= 'Duplicate binding %0'
    DuplicateConstructor= 'A class may only have one constructor'
    DuplicateProtoProperty= 'Duplicate __proto__ fields are not allowed in object literals'
    ForInOfLoopInitializer= '%0 loop variable declaration may not have an initializer'
    GeneratorInLegacyContext= 'Generator declarations are not allowed in legacy contexts'
    IllegalBreak= 'Illegal break statement'
    IllegalContinue= 'Illegal continue statement'
    IllegalExportDeclaration= 'Unexpected token'
    IllegalImportDeclaration= 'Unexpected token'
    IllegalLanguageModeDirective= 'Illegal \'use strict\' directive in function with non-simple parameter list'
    IllegalReturn= 'Illegal return statement'
    InvalidEscapedReservedWord= 'Keyword must not contain escaped characters'
    InvalidHexEscapeSequence= 'Invalid hexadecimal escape sequence'
    InvalidLHSInAssignment= 'Invalid left-hand side in assignment'
    InvalidLHSInForIn= 'Invalid left-hand side in for-in'
    InvalidLHSInForLoop= 'Invalid left-hand side in for-loop'
    InvalidModuleSpecifier= 'Unexpected token'
    InvalidRegExp= 'Invalid regular expression'
    LetInLexicalBinding= 'let is disallowed as a lexically bound name'
    MissingFromClause= 'Unexpected token'
    MultipleDefaultsInSwitch= 'More than one default clause in switch statement'
    NewlineAfterThrow= 'Illegal newline after throw'
    NoAsAfterImportNamespace= 'Unexpected token'
    NoCatchOrFinally= 'Missing catch or finally after try'
    ParameterAfterRestParameter= 'Rest parameter must be last formal parameter'
    Redeclaration= '%0 \'%1\' has already been declared'
    StaticPrototype= 'Classes may not have static property named prototype'
    StrictCatchVariable= 'Catch variable may not be eval or arguments in strict mode'
    StrictDelete= 'Delete of an unqualified identifier in strict mode.'
    StrictFunction= 'In strict mode code, functions can only be declared at top level or inside a block'
    StrictFunctionName= 'Function name may not be eval or arguments in strict mode'
    StrictLHSAssignment= 'Assignment to eval or arguments is not allowed in strict mode'
    StrictLHSPostfix= 'Postfix increment/decrement may not have eval or arguments operand in strict mode'
    StrictLHSPrefix= 'Prefix increment/decrement may not have eval or arguments operand in strict mode'
    StrictModeWith= 'Strict mode code may not include a with statement'
    StrictOctalLiteral= 'Octal literals are not allowed in strict mode.'
    StrictParamDupe= 'Strict mode function may not have duplicate parameter names'
    StrictParamName= 'Parameter name eval or arguments is not allowed in strict mode'
    StrictReservedWord= 'Use of future reserved word in strict mode'
    StrictVarName= 'Variable name may not be eval or arguments in strict mode'
    TemplateOctalLiteral= 'Octal literals are not allowed in template strings.'
    UnexpectedEOS= 'Unexpected end of input'
    UnexpectedIdentifier= 'Unexpected identifier'
    UnexpectedNumber= 'Unexpected number'
    UnexpectedReserved= 'Unexpected reserved word'
    UnexpectedString= 'Unexpected string'
    UnexpectedTemplate= 'Unexpected quasi %0'
    UnexpectedToken= 'Unexpected token %0'
    UnexpectedTokenIllegal= 'Unexpected token ILLEGAL'
    UnknownLabel= 'Undefined label \'%0\''
    UnterminatedRegExp= 'Invalid regular expression: missing /'


# http://stackoverflow.com/questions/14245893/efficiently-list-all-characters-in-a-given-unicode-category
U_CATEGORIES = defaultdict(list)
for c in map(chr, range(sys.maxunicode + 1)): 
    U_CATEGORIES[unicodedata.category(c)].append(c)

UNICODE_LETTER = set(U_CATEGORIES['Lu'] + U_CATEGORIES['Ll'] +U_CATEGORIES['Lt'] + U_CATEGORIES['Lm'] +U_CATEGORIES['Lo'] + U_CATEGORIES['Nl'])

UNICODE_OTHER_ID_START = set((
    # Other_ID_Start
    '\u1885', '\u1886', '\u2118', '\u212E', '\u309B', '\u309C',
    # New in Unicode 8.0
    '\u08B3', '\u0AF9', '\u13F8', '\u9FCD', '\uAB60', '\U00010CC0', '\U000108E0', '\U0002B820',
    # New in Unicode 9.0
    '\u1C80', '\U000104DB', '\U0001E922',
    '\U0001EE00', '\U0001EE06', '\U0001EE0A',
))

UNICODE_OTHER_ID_CONTINUE = set((
    # Other_ID_Continue
    '\xB7', '\u0387', '\u1369', '\u136A', '\u136B', '\u136C',
    '\u136D', '\u136E', '\u136F', '\u1370', '\u1371', '\u19DA',
    # New in Unicode 8.0
    '\u08E3', '\uA69E', '\U00011730',
    # New in Unicode 9.0
    '\u08D4', '\u1DFB', '\uA8C5', '\U00011450',
    '\U0001EE03', '\U0001EE0B',
))

UNICODE_COMBINING_MARK = set(U_CATEGORIES['Mn'] + U_CATEGORIES['Mc'])
IDENTIFIER_START = UNICODE_LETTER.union(UNICODE_OTHER_ID_START).union(set(('$', '_', '\\')))
UNICODE_CONNECTOR_PUNCTUATION = set(U_CATEGORIES['Pc'])

DECIMAL_CONV = dict((c, n) for n, c in enumerate('0123456789'))
OCTAL_CONV = dict((c, n) for n, c in enumerate('01234567'))
HEX_CONV = dict((c, n) for n, c in enumerate('0123456789abcdef'))
for n, c in enumerate('ABCDEF', 10): 
    HEX_CONV[c] = n

#空格
WHITE_SPACE = set(('\x09', '\x0B', '\x0C', '\x20', '\xA0','\u1680', '\u180E', '\u2000', '\u2001', '\u2002','\u2003', '\u2004', '\u2005', '\u2006', '\u2007','\u2008', '\u2009', '\u200A', '\u202F', '\u205F','\u3000', '\uFEFF',))
#换行
LINE_TERMINATOR = set(('\x0A', '\x0D', '\u2028', '\u2029'))
#数字
UNICODE_DIGIT = set(U_CATEGORIES['Nd'])
DECIMAL_DIGIT = set(DECIMAL_CONV.keys())
OCTAL_DIGIT = set(OCTAL_CONV.keys())
HEX_DIGIT = set(HEX_CONV.keys())
#合法的起始字符
IDENTIFIER_START = UNICODE_LETTER.union(UNICODE_OTHER_ID_START).union(set(('$', '_', '\\')))
#合法的中间字符
IDENTIFIER_PART = IDENTIFIER_START.union(UNICODE_COMBINING_MARK).union(UNICODE_DIGIT).union(UNICODE_CONNECTOR_PUNCTUATION).union(set(('\u200D', '\u200C'))).union(UNICODE_OTHER_ID_CONTINUE)

class Character:
    @staticmethod   # 返回ASCII字符
    def FromCodePoint(cp): return uchr(cp) 

    @staticmethod   # 是否是空格 https://tc39.github.io/ecma262/#sec-white-space
    def IsWhiteSpace(cp): return cp in WHITE_SPACE
    
    @staticmethod   # 是否换行 https://tc39.github.io/ecma262/#sec-line-terminators
    def IsLineTerminator(cp): return cp in LINE_TERMINATOR

    @staticmethod   # https://tc39.github.io/ecma262/#sec-names-and-keywords
    def IsIdentifierStart(cp): return cp in IDENTIFIER_START

    @staticmethod 
    def IsIdentifierPart(cp): return cp in IDENTIFIER_PART

    @staticmethod   # 0..9 https://tc39.github.io/ecma262/#sec-literals-numeric-literals
    def IsDecimalDigit(cp): return cp in DECIMAL_DIGIT

    @staticmethod
    def IsHexDigit(cp):  return cp in HEX_DIGIT

    @staticmethod   #0..7
    def IsOctalDigit(cp): return cp in OCTAL_DIGIT



######################################################################
#
# 错误信息类
#
######################################################################
class Error(Exception):
    def __init__(self, message, name=None, index=None, lineNumber=None, column=None, description=None):
        super(Error, self).__init__(message)
        self.Message = message
        self.Name = name
        self.Index = index
        self.LineNumber = lineNumber
        self.Column = column
        # self.description = description

    def ToString(self):
        return '%s: %s' % (self.__class__.__name__, self)

    def ToDict(self):
        d = dict((unicode(k), v) for k, v in self.__dict__.items() if v is not None)
        d['message'] = self.ToString()
        return d

######################################################################
#
# 编译异常, 错误类
#
######################################################################
class ErrorHandler:
    def __init__(self):
        self.Error=[]

    def RecordError(self, error):
        self.Error.append(error.ToDict())

    def CreateError(self, index, line, col, description):
        # msg='Line ' + line + ': ' + description
        msg = 'Line %s: %s' % (line, description)
        return Error(msg,index=index,lineNumber=line, column=col, description=description)

    def ThrowError(self, index, line, col, description):
        error=self.CreateError(index,line,col,description)
        raise  error

######################################################################
#
# 扫描状态信息类
#
######################################################################
class ScannerState:
    def __init__(self, index=None, lineNumber=None, lineStart=None):
        self.Index = index
        self.LineNumber = lineNumber
        self.LineStart = lineStart

class RawToken():
    def __init__(self, type=None, value=None, pattern=None, flags=None, regex=None, octal=None, cooked=None, head=None, tail=None, lineNumber=None, lineStart=None, start=None, end=None):
        self.Type = type
        self.Value = value
        #self.Pattern = pattern
        #self.Flags = flags
        #self.regex = regex
        #self.octal = octal
        #self.cooked = cooked
        #self.head = head
        #self.tail = tail
        self.LineNumber = lineNumber
        self.LineStart = lineStart
        self.Start = start
        self.End = end


#######################################################################################
#
#   扫描类
#
#######################################################################################
class Scanner:
    def __init__(self, code, ErrorHandler):
        self.Source=unicode(code) + '\x00'
        self.ErrorHandler=ErrorHandler
        self.Length=len(code)
        self.Index=0
        self.LineNumber=1 if (self.Length>0) else 0
        self.LineStart=0
        self.CurlyStack=[]

    def SaveState(self):   # 保存当前扫描状态
        return ScannerState(index=self.Index, lineNumber=self.LineNumber, lineStart=self.LineStart)

    def RestoreState(self, state):   #还原扫描状态
        self.Index=state.Index
        self.LineNumber=state.LineNumber
        self.LineStart=state.LineStart

    def IsEOF(self):     #否是已经结束
        return self.Index>=self.Length

    def IsKeyword(self,id):
        return False

    def CodePointAt (self, i):
        return uord(self.Source[i:i + 2])

    def Lex(self):
        if (self.IsEOF()):
            return RawToken( type=2, value='', lineNumber=self.LineNumber, lineStart=self.LineStart, start=self.Index, end=self.Index )  # 2=EOF
        cp=self.Source[self.Index]

        # 变量名 或 关键字
        if (Character.IsIdentifierStart(cp)):
            return self.ScanIdentifier()

        # ( ) ; 开头 操作符扫描
        if cp in ('(', ')', ';'): 
            return self.ScanPunctuator()

        # ' " 开头 字符串扫描
        if cp in ('\'', '"'):
            return self.ScanStringLiteral()

        # . 开头 浮点型
        if cp == '.':
            if Character.IsDecimalDigit(self.Source[self.Index + 1]):
                return self.ScanNumericLiteral()
            return self.ScanPunctuator()

        # 数字
        if Character.IsDecimalDigit(cp):
            return self.ScanNumericLiteral()
        
        cp1=ord(cp)
        if  cp1 >= 0xD800 and cp1 < 0xDFFF :
            cp1 = self.CodePointAt(self.Index)
            cp = Character.FromCodePoint(cp1)
            if Character.IsIdentifierStart(cp):
                return self.ScanIdentifier()

        return self.ScanPunctuator()

    # 关键字 变量名 https://tc39.github.io/ecma262/#sec-names-and-keywords
    def ScanIdentifier(self):
        type=0
        start=self.Index
        # \\ 反斜杠
        id=self.GetComplexIdentifier() if self.Source[start] == '\\' else self.GetIdentifier()

        if len(id) == 1:
            type=3                      # Identifier
        elif self.IsKeyword(id):
            type=4                       # Keyword
        elif id=='null':
            type=5                       # NullLiteral
        elif id=='true' or id=='false':
            type=1                       # BooleanLiteral
        else:
            type=3                       # Identifier

        if type!=3  and start+len(id)!=self.Index :
            # restore=self.Index
            self.Index=start
            raise Messages.InvalidEscapedReservedWord
            # self.Index=restore

        if id=='AND' or id=='OR' :
            type=7                      #Punctuator*/

        return RawToken( type=type, value=id, lineNumber=self.LineNumber, lineStart=self.LineStart, start=start, end=self.Index )

    def GetIdentifier(self):
        start=self.Index        # start 保存进来的位置
        self.Index+=1
        while not self.IsEOF():
            ch=self.Source[self.Index]
            if ch=='\\':
                self.Index=start
                return self.GetComplexIdentifier()
            else:
                cp = ord(ch)
                if cp >= 0xD800 and cp < 0xDFFF :
                    self.Index=start
                    return self.GetComplexIdentifier()

            if Character.IsIdentifierPart(ch):
                self.Index+=1
            else:
                break

        return self.Source[start:self.Index]

    # 操作符 https://tc39.github.io/ecma262/#sec-punctuators
    def ScanPunctuator(self):
        start=self.Index
        str=self.Source[self.Index]
        if str=='(':
            self.Index+=1
        elif str in (')',';',','): 
            self.Index+=1
        else :
            str=self.Source[self.Index:self.Index+3]
            if str=='AND' :
                self.Index+=3
            else :
                str = self.Source[self.Index:self.Index+2]
                if str in ( '&&', '||', '==' , '!=', '<>', '<=', '>=', '=>', ':=', 'OR') :
                    self.Index += 2
                else  :
                    str=self.Source[self.Index]
                    if str in '<>=!+-*%&|^/:' :
                        self.Index += 1

        if self.Index==start :
           self.ThrowUnexpectedToken()

        return RawToken( type=7, value=str, lineNumber=self.LineNumber, lineStart=self.LineStart, start=start, end=self.Index )    #7=Punctuator

    # 字符串 https://tc39.github.io/ecma262/#sec-literals-string-literals
    def ScanStringLiteral(self):
        start=self.Index
        quote=self.Source[self.Index]

        self.Index+=1
        # octal=False
        str=''
        while not self.IsEOF():
            ch=self.Source[self.Index]
            self.Index+=1
            if ch==quote: 
                quote=''
                break
            elif ch=='\\':  #字符串转义
                raise "not complete"
            elif Character.IsLineTerminator(ch) :
                break
            else :
                str+=ch

        if quote!='' :
            self.Index=start
            self.ThrowUnexpectedToken()

        return RawToken( type=8, value=str, lineNumber=self.LineNumber, lineStart=self.LineStart, start=start, end=self.Index) # 8=StringLiteral

    def ScanNumericLiteral(self) :
        start=self.Index
        ch=self.Source[self.Index]
        num=''
        if ch!='.' :
            num=self.Source[self.Index]
            self.Index+=1
            ch=self.Source[self.Index]
            # Hex number starts with '0x'. 16进制
            if num=='0' :
                if ch in ('x', 'X') :
                    self.Index+=1
                    return self.ScanHexLiteral(start)

            while Character.IsDecimalDigit(self.Source[self.Index]):
                num+=self.Source[self.Index]
                self.Index+=1
            
            ch=self.Source[self.Index]

        if ch=='.' :
            num+=self.Source[self.Index]
            self.Index+=1
            while Character.IsDecimalDigit(self.Source[self.Index]) :
                num+=self.Source[self.Index]
                self.Index+=1

            ch=self.Source[self.Index]

        # 科学计数法
        if ch in ('e', 'E'):
            num+=self.Source[self.Index]
            self.Index+=1
            ch=self.Source[self.Index]
            if ch in ('+' ,'-'):
                num+=self.Source[self.Index]
                self.Index+=1
            if Character.IsDecimalDigit(self.Source[self.Index]) :
                while Character.IsDecimalDigit(self.Source[self.Index]) :
                    num+=self.Source[self.Index]
                    self.Index+=1
            else :
                self.ThrowUnexpectedToken()

        if Character.IsIdentifierStart(self.Source[self.Index]) :
            self.ThrowUnexpectedToken()

        value = float(num)
        return RawToken( type=6, value=value, lineNumber=self.LineNumber, lineStart=self.LineStart, start=start, end=self.Index )  #6=NumericLiteral

    # 16进制数值
    def ScanHexLiteral(self, start):
        num = ''
        while not self.IsEOF() :
            if not Character.IsHexDigit(self.Source[self.Index]):
                break

            num += self.Source[self.Index]
            self.Index += 1

        if len(num) == 0:
            self.ThrowUnexpectedToken()

        if Character.IsIdentifierStart(self.Source[self.Index]):
            self.ThrowUnexpectedToken()

        return RawToken(type=6, value=int(num, 16), lineNumber=self.LineNumber, lineStart=self.LineStart, start=start, end=self.Index)   # 6=NumericLiteral,

    # 不支持
    def GetComplexIdentifier(self):
        self.ThrowUnexpectedToken()
        return id

    # 空格 或 注释
    def ScanComments(self) :
        comments=[]
        start= self.Index==0 
        while not self.IsEOF() :
            ch=self.Source[self.Index]
            if Character.IsWhiteSpace(ch) : # 过滤掉空格
                self.Index+=1

            elif Character.IsLineTerminator(ch):
                self.Index+=1
                if ch=='\r' and self.Source[self.Index]=='\n' :
                     self.Index+=1     #回车+换行

                self.LineNumber+=1
                self.LineStart=self.Index
                start=True

            elif ch=='/' :          # //注释
                ch=self.Source[self.Index+1]
                if ch=='/' :
                    self.Index+=2
                    comment=self.SkipSingleLineComment(2)
                    start=True
                else :
                    break

            elif ch== '{' :      #{ }  注释
                self.Index += 1
                comment = self.SkipMultiLineComment()
            else :
                break

        return comments
    
    # 多行注释
    def SkipMultiLineComment(self) :
        comments = []
        while not self.IsEOF() :
            ch = self.Source[self.Index]
            if Character.IsLineTerminator(ch) : 
                self.LineNumber+=1
                self.Index+=1
                self.LineStart = self.Index
            elif ch == '*' :
                if self.Source[self.Index + 1] == '/':
                    self.Index += 2
                    return comments

                self.Index+=1
            else :
                self.Index+=1

        return comments

    
    # 单行注释 https://tc39.github.io/ecma262/#sec-comments
    def SkipSingleLineComment(self, offset) :
        comments=[]
        while not self.IsEOF() :
            ch=self.Source[self.Index]
            self.Index+=1
            if Character.IsLineTerminator(ch) :
                if ch=='\r' and self.Source[self.Index] =='\n' :
                    self.Index+=1

                self.LineNumber+=1
                self.LineStart=self.Index
                return comments

        return comments

    # 抛异常
    def ThrowUnexpectedToken(self, message= Messages.UnexpectedTokenIllegal) :
	    return self.ErrorHandler.ThrowError(self.Index, self.LineNumber, self.Index - self.LineStart + 1, message)


