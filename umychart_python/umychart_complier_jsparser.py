#######################################################################################
#
#
#
#######################################################################################

import sys
from umychart_complier_util import xrange, unicode, uchr, uord
from umychart_complier_scanner import Scanner, RawToken, ErrorHandler, Error, Messages
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem


TOKEN_NAME={ }
TOKEN_NAME[1] = 'Boolean'           # BooleanLiteral
TOKEN_NAME[2] = '<end>'             # EOF
TOKEN_NAME[3] = 'Identifier'        # Identifier
TOKEN_NAME[4] = 'Keyword'           # Keyword
TOKEN_NAME[5] = 'Null'              # NullLiteral
TOKEN_NAME[6] = 'Numeric'           # NumericLiteral
TOKEN_NAME[7] = 'Punctuator'        # Punctuator
TOKEN_NAME[8] = 'String'            # StringLiteral
TOKEN_NAME[9] = 'RegularExpression' #RegularExpression
TOKEN_NAME[10] = 'Template'         #Template

class BufferEntry():
    def __init__(self, type, value, regex=None, range=None, loc=None):
        self.Type = type
        self.Value = value
        #self.regex = regex
        #self.range = range
        #self.loc = loc

class Tokenizer():
    def __init__(self, code) :
        self.ErrorHandler=ErrorHandler()   #错误信息处理类
        self.Scanner=Scanner(code,self.ErrorHandler)
        self.Buffer=[]

    def GetNextToken(self) :
        if len(self.Buffer) <=0 :
            comments=self.Scanner.ScanComments()
            if not self.Scanner.IsEOF() :
                token=self.Scanner.Lex()

                entry= BufferEntry( type=TOKEN_NAME[token.Type], value=self.Scanner.Source[token.Start: token.End])

                self.Buffer.append(entry)

        if len(self.Buffer) <=0 : return None

        return self.Buffer.pop(0)


class Syntax:
    AssignmentExpression= 'AssignmentExpression'
    AssignmentPattern= 'AssignmentPattern'
    ArrayExpression= 'ArrayExpression'
    ArrayPattern= 'ArrayPattern'
    ArrowFunctionExpression= 'ArrowFunctionExpression'
    AwaitExpression= 'AwaitExpression'
    BlockStatement= 'BlockStatement'
    BinaryExpression= 'BinaryExpression'
    BreakStatement= 'BreakStatement'
    CallExpression= 'CallExpression'
    CatchClause= 'CatchClause'
    ClassBody= 'ClassBody'
    ClassDeclaration= 'ClassDeclaration'
    ClassExpression= 'ClassExpression'
    ConditionalExpression= 'ConditionalExpression'
    ContinueStatement= 'ContinueStatement'
    DoWhileStatement= 'DoWhileStatement'
    DebuggerStatement= 'DebuggerStatement'
    EmptyStatement= 'EmptyStatement'
    ExportAllDeclaration= 'ExportAllDeclaration'
    ExportDefaultDeclaration= 'ExportDefaultDeclaration'
    ExportNamedDeclaration= 'ExportNamedDeclaration'
    ExportSpecifier= 'ExportSpecifier'
    ExpressionStatement= 'ExpressionStatement'
    ForStatement= 'ForStatement'
    ForOfStatement= 'ForOfStatement'
    ForInStatement= 'ForInStatement'
    FunctionDeclaration= 'FunctionDeclaration'
    FunctionExpression= 'FunctionExpression'
    Identifier= 'Identifier'
    IfStatement= 'IfStatement'
    ImportDeclaration= 'ImportDeclaration'
    ImportDefaultSpecifier= 'ImportDefaultSpecifier'
    ImportNamespaceSpecifier= 'ImportNamespaceSpecifier'
    ImportSpecifier= 'ImportSpecifier'
    Literal= 'Literal'
    LabeledStatement= 'LabeledStatement'
    LogicalExpression= 'LogicalExpression'
    MemberExpression= 'MemberExpression'
    MetaProperty= 'MetaProperty'
    MethodDefinition= 'MethodDefinition'
    NewExpression= 'NewExpression'
    ObjectExpression= 'ObjectExpression'
    ObjectPattern= 'ObjectPattern'
    Program= 'Program'
    Property= 'Property'
    RestElement= 'RestElement'
    ReturnStatement= 'ReturnStatement'
    SequenceExpression= 'SequenceExpression'
    SpreadElement= 'SpreadElement'
    Super= 'Super'
    SwitchCase= 'SwitchCase'
    SwitchStatement= 'SwitchStatement'
    TaggedTemplateExpression= 'TaggedTemplateExpression'
    TemplateElement= 'TemplateElement'
    TemplateLiteral= 'TemplateLiteral'
    ThisExpression= 'ThisExpression'
    ThrowStatement= 'ThrowStatement'
    TryStatement= 'TryStatement'
    UnaryExpression= 'UnaryExpression'
    UpdateExpression= 'UpdateExpression'
    VariableDeclaration= 'VariableDeclaration'
    VariableDeclarator= 'VariableDeclarator'
    WhileStatement= 'WhileStatement'
    WithStatement= 'WithStatement'
    YieldExpression= 'YieldExpression'


class Identifier():
    def __init__(self, name):
        self.Type = Syntax.Identifier
        self.Name = name

class BinaryExpression():
    def __init__(self, type, operator, left, right):
        self.Type = type
        self.Operator = operator
        self.Left = left
        self.Right = right

class Literal():
    def __init__(self, value, raw):
        self.Type = Syntax.Literal
        self.Value = value
        self.Raw = raw

class CallExpression():
    def __init__(self, callee, arguments):
        self.Type = Syntax.CallExpression
        self.Callee = callee
        self.Arguments = arguments

class AssignmentExpression():
    def __init__(self, operator, left, right):
        self.Type = Syntax.AssignmentExpression
        self.Operator = operator
        self.Left = left
        self.Right = right

class Script():
    def __init__(self, body, sourceType):
        self.Type = Syntax.Program
        self.SourceType = sourceType
        self.Body = body

class SequenceExpression():
    def __init__(self, expressions):
        self.Type = Syntax.SequenceExpression
        self.Expression = expressions

class ExpressionStatement():
    def __init__(self, expression):
        self.Type = Syntax.ExpressionStatement
        self.Expression = expression

class UnaryExpression():
    def __init__(self, operator, argument):
        self.Type = Syntax.UnaryExpression
        self.Prefix = True
        self.Operator = operator
        self.Argument = argument

class EmptyStatement():
    def __init__(self):
        self.Type = Syntax.EmptyStatement


class Node:
    def __init__(self) :
        self.IsNeedIndexData=False         # 是否需要大盘数据
        self.IsNeedLatestData=False        # 是否需要最新的个股行情数据
        self.IsNeedSymbolData=False        # 是否需要下载股票数据
        self.IsNeedFinanceData=set()       # 需要下载的财务数据
        self.IsNeedMarginData = set()      # 融资融券
        self.IsNeedNewsAnalysisData = set()      # 新闻统计数据
        self.IsNeedBlockIncreaseData = set()     # 是否需要市场涨跌股票数据统计

    def GetDataJobList(self) :  #下载数据任务列表
        jobs=[]
        if self.IsNeedSymbolData :
            jobs.append(JobItem(id=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA))
        if self.IsNeedIndexData :
            jobs.append(JobItem(id=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA))
        if self.IsNeedLatestData :
            jobs.append(JobItem(id=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA))

        # 涨跌停家数统计
        for blockSymbol in self.IsNeedBlockIncreaseData :
            jobs.append(JobItem(id=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA, symbol=blockSymbol ))

        # 加载财务数据
        for jobID in self.IsNeedFinanceData :
            if jobID == JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA :      # 股息率 需要总市值
                jobs.append(JobItem(id=JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA))

            jobs.append(JobItem(id=jobID))

        # 加载融资融券
        for jobID in self.IsNeedMarginData :
            jobs.append(JobItem(id=jobID))

        # 加载新闻统计
        for jobID in self.IsNeedNewsAnalysisData :
            jobs.append(JobItem(id=jobID))

        return jobs


    def VerifySymbolVariable(self, varName):
        if varName in ('INDEXA', 'INDEXC', 'INDEXH', 'INDEXL', "INDEXO", "INDEXV", 'INDEXDEC', 'INDEXADV') :
            self.IsNeedIndexData=True
            return

        if varName in ('CLOSE','C','VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT')  :
            self.IsNeedSymbolData=True
            return

        #流通股本（手）
        if varName=='CAPITAL' :
            if JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA not in self.IsNeedFinanceData :
                self.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA)

        if varName == 'EXCHANGE' :
            if JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA not in self.IsNeedFinanceData :
                self.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA)


    def VerifySymbolFunction(self, callee,args) :
        if callee.Name=='DYNAINFO' :
            self.IsNeedLatestData=True
            return

        # 财务函数
        if callee.Name=='FINANCE' :
            jobID=JS_EXECUTE_JOB_ID.GetFinnanceJobID(args[0].Value)
            if jobID not in self.IsNeedFinanceData :
                self.IsNeedFinanceData.add(jobID)
            return

        if callee.Name == 'MARGIN' :
            jobID = JS_EXECUTE_JOB_ID.GetMarginJobID(args[0].Value)
            if jobID not in self.IsNeedMarginData :
                self.IsNeedMarginData.add(jobID)
            return

        if callee.Name == 'NEWS' :
            jobID = JS_EXECUTE_JOB_ID.GetNewsAnalysisID(args[0].Value)
            if jobID not in self.IsNeedNewsAnalysisData :
                self.IsNeedNewsAnalysisData.add(jobID)
            return

        if callee.Name == 'COST' or callee.Name == 'WINNER' :   # 筹码都需要换手率
            if JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA not in self.IsNeedFinanceData :
                self.IsNeedFinanceData.add(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA)
            return

        if callee.Name == 'BETA' :  # beta需要下载上证指数
            self.IsNeedIndexData = True
            return

        if callee.Name == 'UPCOUNT' or callee.Name == 'DOWNCOUNT' :   # 上涨下跌个数
            blockSymbol = args[0].Value
            if blockSymbol not in self.IsNeedBlockIncreaseData:
                self.IsNeedBlockIncreaseData.add(blockSymbol)
            return


    def ExpressionStatement(self, expression) :
        return ExpressionStatement(expression=expression) # { Type:Syntax.ExpressionStatement, Expression:expression }

    def Script(self, body) :
        return Script(body=body, sourceType='通达信脚本') #{Type:Syntax.Program, Body:body, SourceType:'通达信脚本' }

    def SequenceExpression(self, expression) :
        return SequenceExpression(expressions=expression) # {Type:Syntax.SequenceExpression, Expression:expression }

    def BinaryExpression(self, operator, left, right) :
        logical = operator in ( '||' ,'&&' ,'AND' , 'OR')
        type = Syntax.LogicalExpression if logical else Syntax.BinaryExpression
        return BinaryExpression(type=type, operator=operator, left=left, right=right) # { Type:type, Operator:operator, Left:left, Right:right }

    def Literal(self,value,raw) :
        return Literal(value=value, raw=raw) # { Type:Syntax.Literal, Value:value, Raw:raw }

    def Identifier(self, name) :
        self.VerifySymbolVariable(name)
        return Identifier(name=name) # { Type:Syntax.Identifier, Name:name}

    def AssignmentExpression(self, operator, left, right) :
        return AssignmentExpression(operator=operator, left=left, right=right) # { Type:Syntax.AssignmentExpression, Operator:operator, Left:left, Right:right }

    def UnaryExpression(self, operator, argument) :
        return UnaryExpression(operator=operator,argument=argument) # { Type:Syntax.UnaryExpression, Operator:operator, Argument:argument, Prefix:True }

    def EmptyStatement(self) : 
        return EmptyStatement() # { Type:Syntax.EmptyStatement }

    def CallExpression(self, callee, args) :
        self.VerifySymbolFunction(callee, args)
        return CallExpression(callee=callee, arguments=args) # { Type:Syntax.CallExpression, Callee:callee, Arguments:args }


####################################################################################
#
#   语法分析
#
#######################################################################################
class Marker():
    def __init__(self, index=None, line=None, column=None):
        self.Index = index
        self.Line = line
        self.Column = column

class Context(object):
    def __init__(self, isModule=False, allowAwait=False, allowIn=True, allowStrictDirective=True, allowYield=True, firstCoverInitializedNameError=None, isAssignmentTarget=False, isBindingElement=False, inFunctionBody=False, inIteration=False, inSwitch=False, labelSet=None, strict=False):
        self.IsModule = isModule
        self.AllowAwait = allowAwait
        self.AllowIn = allowIn
        self.AllowStrictDirective = allowStrictDirective
        self.AllowYield = allowYield
        self.FirstCoverInitializedNameError = firstCoverInitializedNameError
        self.IsAssignmentTarget = isAssignmentTarget
        self.IsBindingElement = isBindingElement
        self.InFunctionBody = inFunctionBody
        self.InIteration = inIteration
        self.InSwitch = inSwitch
        self.LabelSet = {} if labelSet is None else labelSet
        self.Strict = strict

class JSParser:
    def __init__(self, code, options={}, delegate=None) :
        self.ErrorHandler=ErrorHandler()
        self.Scanner=Scanner(code, self.ErrorHandler)
        self.Node= Node()   #节点创建

        self.LookAhead=RawToken(type=2, value='', lineNumber=self.Scanner.LineNumber, lineStart=0, start=0, end=0 )
        self.HasLineTerminator=False
        self.Context = Context(isModule=False, allowAwait=False, allowIn=True, allowStrictDirective=True, allowYield= True,
            firstCoverInitializedNameError=None, isAssignmentTarget=False, isBindingElement=False, inFunctionBody=False,
            inIteration=False,inSwitch=False, labelSet= {}, strict=False)

        self.OperatorPrecedence = {
            ')': 0,
            ';': 0,
            ',': 0,
            '=': 0,
            ']': 0,
            '||': 1,
            'OR':1,
            '&&': 2,
            'AND':2,
            '|': 3,
            '^': 4,
            '&': 5,
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
            '%': 11,
        }

        self.StartMarker = Marker(index=0, line=self.Scanner.LineNumber, column=0)
        self.LastMarker = Marker(index=0, line=self.Scanner.LineNumber, column=0)

    def Initialize(self) :
        self.NextToken()
        self.LastMarker=Marker(index=self.Scanner.Index, line=self.Scanner.LineNumber, column=self.Scanner.Index-self.Scanner.LineStart)

    def CreateNode(self) :
        return Marker(index=self.StartMarker.Index, line=self.StartMarker.Line, column=self.StartMarker.Column)

    def StartNode(self, token, lastLineStart=0):
        column = token.Start - token.LineStart
        line = token.LineNumber
        if column < 0 :
	        column += lastLineStart
	        line-=1

        return Marker(index=token.Start, line= line, column=column)

    def Match(self, value) : 
        return self.LookAhead.Type==7  and self.LookAhead.Value==value # 7=Punctuator

    def Expect(self, value) :
        token=self.NextToken()
        if token.Type!=7  or token.Value!=value :  # 7=Punctuator
            self.ThrowUnexpectedToken(token)

    # 是否是赋值操作符
    def MatchAssign(self) :
        if self.LookAhead.Type!=7 :
            return False  #7=Punctuator
        op=self.LookAhead.Value
        return op in ('=', ':', ':=')

    def GetTokenRaw(self, token) :
        return self.Scanner.Source[token.Start : token.End]

    def NextToken(self) :
        token=self.LookAhead
        self.LastMarker.Index=self.Scanner.Index
        self.LastMarker.Line=self.Scanner.LineNumber
        self.LastMarker.Column=self.Scanner.Index-self.Scanner.LineStart
        self.CollectComments() # 过滤注释 空格

        if self.Scanner.Index != self.StartMarker.Index :
            self.StartMarker.Index = self.Scanner.Index
            self.StartMarker.Line = self.Scanner.LineNumber
            self.StartMarker.Column = self.Scanner.Index - self.Scanner.LineStart

        next=self.Scanner.Lex()
        self.HasLineTerminator= token.LineNumber!=next.LineNumber 
        if next and self.Context.Strict and next.Type==3 : #3=Identifier
            print ('[JSParser::NextToken] not support')

        self.LookAhead=next

        return token

    def CollectComments(self) :
        self.Scanner.ScanComments()

    def ParseScript(self) :
        node=self.CreateNode()
        body=self.ParseDirectivePrologues()
        
        while self.LookAhead.Type!=2: #2=/*EOF*/)
            body.append(self.ParseStatementListItem())

        return self.Finalize(node,self.Node.Script(body))

    # https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
    def ParseDirective(self):
        token=self.LookAhead
        node=self.CreateNode()
        expr=self.ParseExpression()
        return None

    def ParseDirectivePrologues(self) :
        firstRestricted=None
        body=[]
        while True :
            token=self.LookAhead
            if token.Type!=8 : #8=/*StringLiteral*
                break
            statement = self.ParseDirective()
            body.append(statement)

        return body

    # https://tc39.github.io/ecma262/#sec-block
    def ParseStatementListItem(self) :
        statement=None
        self.Context.IsAssignmentTarget=True
        self.Context.IsBindingElement=True
        if self.LookAhead.Type==4 : # 4=/*Keyword*/
            pass
        else :
            statement=self.ParseStatement()

        return statement

    # https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
    def ParseStatement(self):
        statement=None
        type = self.LookAhead.Type
        if type in (1,5,6,8,10,9) : # BooleanLiteral, NullLiteral, NumericLiteral, StringLiteral, Template, RegularExpression
            statement = self.ParseExpressionStatement()

        elif  type==7 :     # 7=/* Punctuator */:
            value = self.LookAhead.Value
            if value == '(' :
                statement = self.ParseExpressionStatement()
            elif value == ';' :
                statement = self.ParseEmptyStatement()
            else :
                statement = self.ParseExpressionStatement()

        elif type==3 : # 3=/* Identifier */:  
            statement = self.ParseLabelledStatement()
           
        elif type==4: # 4= /* Keyword */
            print('[JSParser::ParseStatementListItem] not support Keyword')
        else :
            statement="error"

        return statement


    # https://tc39.github.io/ecma262/#sec-empty-statement
    def ParseEmptyStatement(self):
        node=self.CreateNode()
        self.Expect(';')
        return self.Finalize(node, self.Node.EmptyStatement())


    # https://tc39.github.io/ecma262/#sec-labelled-statements
    def ParseLabelledStatement(self):
        node=self.CreateNode()
        expr=self.ParseExpression()
        self.ConsumeSemicolon()
        statement = self.Node.ExpressionStatement(expr)

        return self.Finalize(node, statement)

    #  https://tc39.github.io/ecma262/#sec-comma-operator
    def ParseExpression(self) :
        startToken=self.LookAhead
        expr=self.IsolateCoverGrammar(self.ParseAssignmentExpression)
        if self.Match(',') :
            expressions=[]
            expressions.append(expr)
            while self.LookAhead.Type!=2 : #/*EOF*/
                if not self.Match(',') :
                    break
                self.NextToken()
                expressions.append(self.IsolateCoverGrammar(self.ParseAssignmentExpression))

            expr=self.Finalize(self.StartNode(startToken),self.Node.SequenceExpression(expressions))

        return expr

    def ParseAssignmentExpression(self) :
        expr=None
        startToken=self.LookAhead
        token=startToken
        expr=self.ParseConditionalExpression()

        if self.MatchAssign() :
            if not self.Context.IsAssignmentTarget :
                marker=expr.Marker
                self.ThrowUnexpectedError(marker.Index,marker.Line,marker.Column,Messages.InvalidLHSInAssignment)

            if not self.Match('=') and not self.Match(':') :
                self.Context.IsAssignmentTarget=False
                self.Context.IsBindingElement=False
            else :
                self.ReinterpretExpressionAsPattern(expr)

            token=self.NextToken()
            operator=token.Value
            right=self.IsolateCoverGrammar(self.ParseAssignmentExpression)
            expr=self.Finalize(self.StartNode(startToken), self.Node.AssignmentExpression(operator, expr, right))
            self.Context.FirstCoverInitializedNameError=None

        return expr

    def ParseConditionalExpression(self) :
        startToken=self.LookAhead
        expr=self.InheritCoverGrammar(self.ParseBinaryExpression)

        return expr

    def ParseBinaryExpression(self) :
        startToken=self.LookAhead
        expr=self.InheritCoverGrammar(self.ParseExponentiationExpression)
        token=self.LookAhead
        prec=self.BinaryPrecedence(token)
        if prec>0 :
            self.NextToken()
            self.Context.IsAssignmentTarget=False
            self.Context.IsBindingElement=False
            markers=[startToken,self.LookAhead]
            left=expr
            right=self.IsolateCoverGrammar(self.ParseExponentiationExpression)
            stack=[left,token.Value,right]
            precedences = [prec]
            while True :
                prec=self.BinaryPrecedence(self.LookAhead)
                if prec<=0 : 
                    break

                while len(stack)>2 and prec<=precedences[-1] :
                    right=stack.pop()
                    operator=stack.pop()
                    precedences.pop()
                    left=stack.pop()
                    markers.pop()
                    node=self.StartNode(markers[-1])
                    stack.append(self.Finalize(node, self.Node.BinaryExpression(operator, left, right)))

                # Shift
                stack.append(self.NextToken().Value)
                precedences.append(prec)
                markers.append(self.LookAhead)
                stack.append(self.IsolateCoverGrammar(self.ParseExponentiationExpression))

            i=len(stack)-1
            expr=stack[i]
            lastMarker=markers.pop()
            while i>1 :
                marker=markers.pop()
                lastLineStart=lastMarker and lastMarker.LineStart
                node=self.StartNode(marker, lastLineStart)
                operator=stack[i-1]
                expr=self.Finalize(node, self.Node.BinaryExpression(operator, stack[i - 2], expr))
                i-=2
                lastMarker=marker

        return expr
    
    def ParseExponentiationExpression(self) :
        startToken=self.LookAhead
        expr=self.InheritCoverGrammar(self.ParseUnaryExpression)

        return expr

    def ParseUnaryExpression(self) :
        expr=None
        if self.Match('+') or self.Match('-') :
            node=self.StartNode(self.LookAhead)
            token=self.NextToken()
            expr=self.InheritCoverGrammar(self.ParseUnaryExpression)
            expr=self.Finalize(node, self.Node.UnaryExpression(token.Value, expr))
            self.Context.IsAssignmentTarget=False
            self.Context.IsBindingElement=False
        else :
            expr=self.ParseUpdateExpression()

        return expr

    # https://tc39.github.io/ecma262/#sec-update-expressions
    def ParseUpdateExpression(self) :
        startToken=self.LookAhead
        expr=self.InheritCoverGrammar(self.ParseLeftHandSideExpressionAllowCall)

        return expr

    def ParseLeftHandSideExpressionAllowCall(self) :
        startToken=self.LookAhead
        expr=self.InheritCoverGrammar(self.ParsePrimaryExpression)

        while True :
            if self.Match('(') :
                self.Context.IsBindingElement=False
                self.Context.IsAssignmentTarget=False
                args=self.ParseArguments() # 解析 调用参数
                expr=self.Finalize(self.StartNode(startToken), self.Node.CallExpression(expr,args))
            else :
                break

        return expr

    # https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
    def ParseArguments(self) :
        self.Expect('(')
        args=[]
        if not self.Match(')') :
            while True :
                expr=self.IsolateCoverGrammar(self.ParseAssignmentExpression)
                args.append(expr)

                if self.Match(')') :
                    break

                self.ExpectCommaSeparator()

                if self.Match(')'):
                    break

        self.Expect(')')
        return args

    # Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
    def ExpectCommaSeparator(self) :
        self.Expect(',')

    # https://tc39.github.io/ecma262/#sec-primary-expression
    def ParsePrimaryExpression(self) :
        node=self.CreateNode()
        type=self.LookAhead.Type
        if type==3 : # Identifier 
            expr=self.Finalize(node, self.Node.Identifier(self.NextToken().Value))
        elif type in (6,8) : # 6=NumericLiteral, 8=StringLiteral
            self.Context.IsAssignmentTarget=False
            self.Context.IsBindingElement=False
            token=self.NextToken()
            raw=self.GetTokenRaw(token)
            expr=self.Finalize(node, self.Node.Literal(token.Value,raw))
        elif type==7 : # 7=Punctuator
            value=self.LookAhead.Value
            if value=='(':
                self.Context.IsBindingElement=False
                expr=self.InheritCoverGrammar(self.ParseGroupExpression)
            else :
                self.ThrowUnexpectedToken(self.NextToken())
        else :
            self.ThrowUnexpectedToken(self.NextToken())

        return expr

    def ParseGroupExpression(self) :
        self.Expect('(')
        if self.Match(')') :
            self.NextToken()
        else :
            startToken=self.LookAhead
            params=[]
            arrow=False
            self.Context.IsBindingElement=True
            expr=self.InheritCoverGrammar(self.ParseAssignmentExpression)
            if self.Match(',') :
                expressions=[]
                self.Context.IsAssignmentTarget=False
                expressions.append(expr)
                while self.LookAhead.Type!=2 :  # /* EOF */)
                    if not self.Match(',') :
                        break

                    self.NextToken()
                    if not self.Match(')') :
                        self.NextToken()
                    
            if not arrow :
                self.Expect(')')
                self.Context.IsBindingElement=False

        return expr

    # https://tc39.github.io/ecma262/#sec-expression-statement
    def ParseExpressionStatement(self) :
        node=self.CreateNode()
        expr=self.ParseExpression()
        self.ConsumeSemicolon()

        return self.Finalize(node,self.Node.ExpressionStatement(expr))

    def ConsumeSemicolon(self) :
        if self.Match(';') :
            self.NextToken()
        elif not self.HasLineTerminator :
            # if (this.LookAhead.Type!=2/*EOF*/ && !this.Match('}'))

            self.LastMarker.Index=self.StartMarker.Index
            self.LastMarker.Line=self.StartMarker.Line
            self.LastMarker.Column=self.StartMarker.Column

    def ReinterpretExpressionAsPattern(self, expr) :
        if expr.Type in (Syntax.Identifier, Syntax.AssignmentExpression) :
            pass
        else :
            pass

    def Finalize(self,marker,node) :
        node.Marker=Marker( line=marker.Line, column=marker.Column, index=marker.Index )
        return node

    def BinaryPrecedence(self, token) :
        op = token.Value

        if token.Type == 7 :    # /* Punctuator */
            precedence = self.OperatorPrecedence.get(op, 0)
        else :
            precedence = 0
        
        return precedence

    def IsolateCoverGrammar(self, parseFunction) :
        previousIsBindingElement=self.Context.IsBindingElement
        previousIsAssignmentTarget=self.Context.IsAssignmentTarget
        previousFirstCoverInitializedNameError=self.Context.FirstCoverInitializedNameError

        self.Context.IsBindingElement=True
        self.Context.IsAssignmentTarget=True
        self.Context.FirstCoverInitializedNameError=None
        result=parseFunction()

        if self.Context.FirstCoverInitializedNameError is not None :
            # 错误 this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
            pass

        self.Context.IsBindingElement=previousIsBindingElement
        self.Context.IsAssignmentTarget=previousIsAssignmentTarget
        self.Context.FirstCoverInitializedNameError=previousFirstCoverInitializedNameError

        return result

    def InheritCoverGrammar(self,parseFunction) :
        previousIsBindingElement = self.Context.IsBindingElement
        previousIsAssignmentTarget = self.Context.IsAssignmentTarget
        previousFirstCoverInitializedNameError = self.Context.FirstCoverInitializedNameError
        self.Context.IsBindingElement = True
        self.Context.IsAssignmentTarget = True
        self.Context.FirstCoverInitializedNameError = None

        result = parseFunction()

        self.Context.IsBindingElement = self.Context.IsBindingElement and previousIsBindingElement
        self.Context.IsAssignmentTarget = self.Context.IsAssignmentTarget and previousIsAssignmentTarget
        self.Context.FirstCoverInitializedNameError = previousFirstCoverInitializedNameError or self.Context.FirstCoverInitializedNameError

        return result

    def ThrowUnexpectedToken(self, token=None,message=None) :
        raise self.UnexpectedTokenError(token,message)

    def ThrowUnexpectedError(self, index,line,column,message=None) :
        if message is not None : 
            msg=message
        else :
            msg="执行异常"

        return self.ErrorHandler.ThrowError(index,line,column,msg)

    def UnexpectedTokenError(self,token=None,message=None) :
        msg=message or Messages.UnexpectedToken
        value='ILLEGAL'
        if token :
            if not message :
                pass
            value=token.Value

        msg=msg.replace("%0",unicode(value),1)
        if token and isinstance(token.LineNumber, int) :
            index=token.Start
            line=token.LineNumber
            lastMarkerLineStart=self.LastMarker.Index-self.LastMarker.Column
            column=token.Start-lastMarkerLineStart+1
            return self.ErrorHandler.CreateError(index,line,column,msg)
        else :
            index=self.LastMarker.Index
            line=self.LastMarker.Line
            column=self.LastMarker.Column+1
            return self.ErrorHandler.CreateError(index,line,column,msg)