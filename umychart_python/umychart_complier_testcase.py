import sys
from umychart_complier_jscomplier import JSComplier

def Test_Tokenize():
    code1='VARHIGH:=IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;'
    code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);'
    tokens=JSComplier.Tokenize(code1+code2)
    return True if tokens else False

def Test_Parse():
    code1='VARHIGH:=IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;'
    code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);'
    ast=JSComplier.Parse(code1+code2)
    return True if ast else False

def Test_REF():
    result=JSComplier.Execute('VAR2:C-REF(O,1)')
    return True if result else False

def Test_Add() :
    result=JSComplier.Execute('VAR2:C+100')
    return True if result else False 

def Test_Multiply():
    code=[
        'VAR2:C*O;', 
        "VAR3:100*100;"
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 


def Test_MAX_MIN():
    code=[
        'VAR2:MAX(C,O);', 
        "VAR3:MAX(C,100);",
        "VAR4:MAX(100,C);",
        'VAR5:MIN(C,O);',
        'VAR5:MIN(C,4);'
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[4]+code[3])
    return True if result else False 

def Test_MA() :
    code=[
        'VAR2:MA(C,5);', 
        'VAR3:MA(C,10);',
        'VAR4:MA(C,15);',
        'VAR4:MA(C,30);', 
        ]

    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_EMA():
    code=[
        'VAR2:EMA(C,5);', 
        'VAR3:EMA(C,10);',
        'VAR4:EMA(C,15);',
        'VAR4:EMA(C,30);', 
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_SMA():
    code=[
        'VAR2:SMA(C,5,10);', 
        'VAR3:SMA(C,10,10);',
        'VAR4:SMA(C,15,10);',
        'VAR4:SMA(C,30,10);', 
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_DMA():
    code=[
        'VAR3:C;',
        'VAR2:DMA(C,O/C);', 
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 

def Test_WMA() :
    code=[
        'VAR3:C;',
        'VAR2:WMA(C,20);', 
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 

def Test_SUMBARS() :
    code=[
        'VAR3:SUMBARS(C,O)',
        'VAR2:C;', 
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 


Test_Add()
Test_Multiply()
Test_MAX_MIN()
Test_SUMBARS()