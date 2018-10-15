/*
    指标数据脚本
*/

function JSIndexScript()
{

}

JSIndexScript.prototype.Get=function(id)
{
    var DataMap=new Map(
        [
            ['MA', this.MA],['均线', this.MA],['BOLL', this.BOLL],['BBI', this.BBI],
            ['DKX', this.DKX],['MIKE', this.MIKE],['PBX', this.PBX],
            ['ENE', this.ENE],['MACD', this.MACD],['KDJ', this.KDJ],
            ['VOL', this.VOL],['RSI', this.RSI],['BRAR', this.BRAR],
            ['WR', this.WR],['BIAS', this.BIAS],['OBV', this.OBV],
            ['DMI', this.DMI],['CR', this.CR],['PSY', this.PSY],
            ['CCI', this.CCI],['DMA', this.DMA],['TRIX', this.TRIX],
            ['VR', this.VR],['EMV', this.EMV],['ROC', this.ROC],
            ['MIM', this.MIM],['FSL', this.FSL],['CYR', this.CYR],
            ['MASS', this.MASS],['WAD', this.WAD],['CHO', this.CHO],
            ['ADTM', this.ADTM],['HSL', this.HSL],['BIAS36', this.BIAS36],
            ['BIAS_QL', this.BIAS_QL],['DPO', this.DPO],['OSC', this.OSC],
            ['ATR', this.ATR],['NVI', this.NVI],['PVI', this.PVI],
            ['UOS', this.UOS],['CYW', this.CYW],['LON', this.LON],
            ['NDB', this.NDB],

            ['飞龙四式', this.Dragon4_Main],['飞龙四式-附图', this.Dragon4_Fig],
            ['资金分析', this.FundsAnalysis],['融资占比',this.MarginProportion]
        ]
    );

    var func=DataMap.get(id);
    if (func) return func();

    return null;
}

JSIndexScript.prototype.MA=function()
{
    let data=
    {
        Name:'MA', Description:'均线', IsMainIndex:true,
        Args:[ { Name:'M1', Value:5}, { Name:'M2', Value:10 }, { Name:'M3', Value:20} ],
        Script: //脚本
'MA1:MA(CLOSE,M1);\n\
MA2:MA(CLOSE,M2);\n\
MA3:MA(CLOSE,M3);'

    };

    return data;
}

JSIndexScript.prototype.BOLL=function()
{
    let data=
    {
        Name:'BOLL', Description:'布林线', IsMainIndex:true,
        Args:[ { Name:'M', Value:20} ],
        Script: //脚本
'BOLL:MA(CLOSE,M);\n\
UB:BOLL+2*STD(CLOSE,M);\n\
LB:BOLL-2*STD(CLOSE,M);'

    };

    return data;
}

JSIndexScript.prototype.BBI=function()
{
    let data=
    {
        Name:'BBI', Description:'多空均线', IsMainIndex:true,
        Args:[ { Name:'M1', Value:3}, { Name:'M2', Value:6}, { Name:'M3', Value:12}, { Name:'M4', Value:24} ],
        Script: //脚本
        'BBI:(MA(CLOSE,M1)+MA(CLOSE,M2)+MA(CLOSE,M3)+MA(CLOSE,M4))/4;'

    };

    return data;
}

JSIndexScript.prototype.DKX=function()
{
    let data=
    {
        Name:'DKX', Description:'多空线', IsMainIndex:false,
        Args:[ { Name:'M', Value:10} ],
        Script: //脚本
'MID:=(3*CLOSE+LOW+OPEN+HIGH)/6;\n\
DKX:(20*MID+19*REF(MID,1)+18*REF(MID,2)+17*REF(MID,3)+\n\
16*REF(MID,4)+15*REF(MID,5)+14*REF(MID,6)+\n\
13*REF(MID,7)+12*REF(MID,8)+11*REF(MID,9)+\n\
10*REF(MID,10)+9*REF(MID,11)+8*REF(MID,12)+\n\
7*REF(MID,13)+6*REF(MID,14)+5*REF(MID,15)+\n\
4*REF(MID,16)+3*REF(MID,17)+2*REF(MID,18)+REF(MID,20))/210;\n\
MADKX:MA(DKX,M);'

    };

    return data;
}

JSIndexScript.prototype.MIKE=function()
{
    let data=
    {
        Name:'MIKE', Description:'麦克支撑压力', IsMainIndex:true,
        Args:[ { Name:'N', Value:10} ],
        Script: //脚本
'HLC:=REF(MA((HIGH+LOW+CLOSE)/3,N),1);\n\
HV:=EMA(HHV(HIGH,N),3);\n\
LV:=EMA(LLV(LOW,N),3);\n\
STOR:EMA(2*HV-LV,3);\n\
MIDR:EMA(HLC+HV-LV,3);\n\
WEKR:EMA(HLC*2-LV,3);\n\
WEKS:EMA(HLC*2-HV,3);\n\
MIDS:EMA(HLC-HV+LV,3);\n\
STOS:EMA(2*LV-HV,3);'

    };

    return data;
}

JSIndexScript.prototype.PBX=function()
{
    let data=
    {
        Name:'PBX', Description:'瀑布线', IsMainIndex:true,
        Args:[ { Name:'M1', Value:4}, { Name:'M2', Value:6}, { Name:'M3', Value:9}, { Name:'M4', Value:13},{ Name:'M5', Value:18},{ Name:'M6', Value:24} ],
        Script: //脚本
'PBX1:(EMA(CLOSE,M1)+MA(CLOSE,M1*2)+MA(CLOSE,M1*4))/3;\n\
PBX2:(EMA(CLOSE,M2)+MA(CLOSE,M2*2)+MA(CLOSE,M2*4))/3;\n\
PBX3:(EMA(CLOSE,M3)+MA(CLOSE,M3*2)+MA(CLOSE,M3*4))/3;\n\
PBX4:(EMA(CLOSE,M4)+MA(CLOSE,M4*2)+MA(CLOSE,M4*4))/3;\n\
PBX5:(EMA(CLOSE,M5)+MA(CLOSE,M5*2)+MA(CLOSE,M5*4))/3;\n\
PBX6:(EMA(CLOSE,M6)+MA(CLOSE,M6*2)+MA(CLOSE,M6*4))/3;'

    };

    return data;
}

JSIndexScript.prototype.ENE=function()
{
    let data=
    {
        Name:'ENE', Description:'轨道线', IsMainIndex:true,
        Args:[ { Name:'N', Value:25}, { Name:'M1', Value:6}, { Name:'M2', Value:6} ],
        Script: //脚本
'UPPER:(1+M1/100)*MA(CLOSE,N);\n\
LOWER:(1-M2/100)*MA(CLOSE,N);\n\
ENE:(UPPER+LOWER)/2;'

    };

    return data;
}

JSIndexScript.prototype.MACD=function()
{
    let data=
    {
        Name:'MACD', Description:'平滑异同平均', IsMainIndex:false,
        Args:[ { Name:'SHORT', Value:12}, { Name:'LONG', Value:26}, { Name:'MID', Value:9} ],
        Script: //脚本
'DIF:EMA(CLOSE,SHORT)-EMA(CLOSE,LONG);\n\
DEA:EMA(DIF,MID);\n\
MACD:(DIF-DEA)*2,COLORSTICK;'

    };

    return data;
}

JSIndexScript.prototype.KDJ=function()
{
    let data=
    {
        Name:'KDJ', Description:'随机指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:9}, { Name:'M1', Value:3}, { Name:'M2', Value:3} ],
        Script: //脚本
'RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
K:SMA(RSV,M1,1);\n\
D:SMA(K,M2,1);\n\
J:3*K-2*D;'

    };

    return data;
}

JSIndexScript.prototype.VOL=function()
{
    let data=
    {
        Name:'VOL', Description:'成交量', IsMainIndex:false,
        Args:[ { Name:'M1', Value:5}, { Name:'M2', Value:10} ],
        Script: //脚本
'VOLUME:VOL,VOLSTICK;\n\
MAVOL1:MA(VOLUME,M1);\n\
MAVOL2:MA(VOLUME,M2);'

    };

    return data;
}

JSIndexScript.prototype.RSI=function()
{
    let data=
    {
        Name:'RSI', Description:'相对强弱指标', IsMainIndex:false,
        Args:[ { Name:'N1', Value:6}, { Name:'N2', Value:12}, { Name:'N3', Value:24}  ],
        Script: //脚本
'LC:=REF(CLOSE,1);\n\
RSI1:SMA(MAX(CLOSE-LC,0),N1,1)/SMA(ABS(CLOSE-LC),N1,1)*100;\n\
RSI2:SMA(MAX(CLOSE-LC,0),N2,1)/SMA(ABS(CLOSE-LC),N2,1)*100;\n\
RSI3:SMA(MAX(CLOSE-LC,0),N3,1)/SMA(ABS(CLOSE-LC),N3,1)*100;'

    };

    return data;
}

JSIndexScript.prototype.BRAR=function()
{
    let data=
    {
        Name:'BRAR', Description:'情绪指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:26} ],
        Script: //脚本
'BR:SUM(MAX(0,HIGH-REF(CLOSE,1)),N)/SUM(MAX(0,REF(CLOSE,1)-LOW),N)*100;\n\
AR:SUM(HIGH-OPEN,N)/SUM(OPEN-LOW,N)*100;'

    };

    return data;
}

JSIndexScript.prototype.WR=function()
{
    let data=
    {
        Name:'WR', Description:'威廉指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:10}, { Name:'N1', Value:6} ],
        Script: //脚本
'WR1:100*(HHV(HIGH,N)-CLOSE)/(HHV(HIGH,N)-LLV(LOW,N));\n\
WR2:100*(HHV(HIGH,N1)-CLOSE)/(HHV(HIGH,N1)-LLV(LOW,N1));'

    };

    return data;
}

JSIndexScript.prototype.BIAS=function()
{
    let data=
    {
        Name:'BIAS', Description:'乖离率', IsMainIndex:false,
        Args:[ { Name:'N1', Value:6}, { Name:'N2', Value:12}, { Name:'N3', Value:24} ],
        Script: //脚本
'BIAS1 :(CLOSE-MA(CLOSE,N1))/MA(CLOSE,N1)*100;\n\
BIAS2 :(CLOSE-MA(CLOSE,N2))/MA(CLOSE,N2)*100;\n\
BIAS3 :(CLOSE-MA(CLOSE,N3))/MA(CLOSE,N3)*100;'

    };

    return data;
}

JSIndexScript.prototype.OBV=function()
{
    let data=
    {
        Name:'OBV', Description:'累积能量线', IsMainIndex:false,
        Args:[ { Name:'M', Value:30} ],
        Script: //脚本
'VA:=IF(CLOSE>REF(CLOSE,1),VOL,-VOL);\n\
OBV:SUM(IF(CLOSE==REF(CLOSE,1),0,VA),0);\n\
MAOBV:MA(OBV,M);'

    };

    return data;
}

JSIndexScript.prototype.DMI=function()
{
    let data=
    {
        Name:'DMI', Description:'趋向指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:14}, { Name:'MM', Value:6} ],
        Script: //脚本
'MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N);\n\
HD :=HIGH-REF(HIGH,1);\n\
LD :=REF(LOW,1)-LOW;\n\
DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);\n\
DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);\n\
PDI: DMP*100/MTR;\n\
MDI: DMM*100/MTR;\n\
ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);\n\
ADXR:EXPMEMA(ADX,MM);'

    };

    return data;
}

JSIndexScript.prototype.CR=function()
{
    let data=
    {
        Name:'CR', Description:'带状能量线', IsMainIndex:false,
        Args:[ { Name:'N', Value:26}, { Name:'M1', Value:10},{ Name:'M2', Value:20},{ Name:'M3', Value:40},{ Name:'M4', Value:62} ],
        Script: //脚本
'MID:=REF(HIGH+LOW,1)/2;\n\
CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;\n\
MA1:REF(MA(CR,M1),M1/2.5+1);\n\
MA2:REF(MA(CR,M2),M2/2.5+1);\n\
MA3:REF(MA(CR,M3),M3/2.5+1);\n\
MA4:REF(MA(CR,M4),M4/2.5+1);'

    };

    return data;
}

JSIndexScript.prototype.PSY=function()
{
    let data=
    {
        Name:'PSY', Description:'心理线', IsMainIndex:false,
        Args:[ { Name:'N', Value:12}, { Name:'M', Value:6} ],
        Script: //脚本
'PSY:COUNT(CLOSE>REF(CLOSE,1),N)/N*100;\r\
PSYMA:MA(PSY,M);'

    };

    return data;
}

JSIndexScript.prototype.CCI=function()
{
    let data=
    {
        Name:'CCI', Description:'商品路径指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:14} ],
        Script: //脚本
'TYP:=(HIGH+LOW+CLOSE)/3;\n\
CCI:(TYP-MA(TYP,N))/(0.015*AVEDEV(TYP,N));'

    };

    return data;
}

JSIndexScript.prototype.DMA=function()
{
    let data=
    {
        Name:'DMA', Description:'平均差', IsMainIndex:false,
        Args:[ { Name:'N1', Value:10},{ Name:'N2', Value:50},{ Name:'M', Value:10} ],
        Script: //脚本
'DIF:MA(CLOSE,N1)-MA(CLOSE,N2);\n\
DIFMA:MA(DIF,M);'

    };

    return data;
}

JSIndexScript.prototype.TRIX=function()
{
    let data=
    {
        Name:'TRIX', Description:'三重指数平均线', IsMainIndex:false,
        Args:[ { Name:'N', Value:12},{ Name:'M', Value:9} ],
        Script: //脚本
'MTR:=EMA(EMA(EMA(CLOSE,N),N),N);\n\
TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;\n\
MATRIX:MA(TRIX,M) ;'

    };

    return data;
}

JSIndexScript.prototype.VR=function()
{
    let data=
    {
        Name:'VR', Description:'成交量变异率', IsMainIndex:false,
        Args:[ { Name:'N', Value:26},{ Name:'M', Value:6} ],
        Script: //脚本
'TH:=SUM(IF(CLOSE>REF(CLOSE,1),VOL,0),N);\n\
TL:=SUM(IF(CLOSE<REF(CLOSE,1),VOL,0),N);\n\
TQ:=SUM(IF(CLOSE==REF(CLOSE,1),VOL,0),N);\n\
VR:100*(TH*2+TQ)/(TL*2+TQ);\n\
MAVR:MA(VR,M);'

    };

    return data;
}

JSIndexScript.prototype.EMV=function()
{
    let data=
    {
        Name:'EMV', Description:'简易波动指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:14},{ Name:'M', Value:9} ],
        Script: //脚本
'VOLUME:=MA(VOL,N)/VOL;\n\
MID:=100*(HIGH+LOW-REF(HIGH+LOW,1))/(HIGH+LOW);\n\
EMV:MA(MID*VOLUME*(HIGH-LOW)/MA(HIGH-LOW,N),N);\n\
MAEMV:MA(EMV,M);'

    };

    return data;
}

JSIndexScript.prototype.ROC=function()
{
    let data=
    {
        Name:'ROC', Description:'变动率指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:12},{ Name:'M', Value:6} ],
        Script: //脚本
'ROC:100*(CLOSE-REF(CLOSE,N))/REF(CLOSE,N);\n\
MAROC:MA(ROC,M);'

    };

    return data;
}

JSIndexScript.prototype.MIM=function()
{
    let data=
    {
        Name:'MIM', Description:'动量线', IsMainIndex:false,
        Args:[ { Name:'N', Value:12},{ Name:'M', Value:6} ],
        Script: //脚本
'MTM:CLOSE-REF(CLOSE,N);\n\
MAMTM:MA(MTM,M);'

    };

    return data;
}

JSIndexScript.prototype.FSL=function()
{
    let data=
    {
        Name:'FSL', Description:'分水岭', IsMainIndex:false,
        Args:[ ],
        Script: //脚本
'SWL:(EMA(CLOSE,5)*7+EMA(CLOSE,10)*3)/10;\n\
SWS:DMA(EMA(CLOSE,12),MAX(1,100*(SUM(VOL,5)/(3*CAPITAL))));'

    };

    return data;
}

JSIndexScript.prototype.CYR=function()
{
    let data=
    {
        Name:'CYR', Description:'市场强弱', IsMainIndex:false,
        Args:[ { Name:'N', Value:13},{ Name:'M', Value:5}],
        Script: //脚本
'DIVE:=0.01*EMA(AMOUNT,N)/EMA(VOL,N);\n\
CYR:(DIVE/REF(DIVE,1)-1)*100;\n\
MACYR:MA(CYR,M);'

    };

    return data;
}

JSIndexScript.prototype.MASS=function()
{
    let data=
    {
        Name:'MASS', Description:'市场强弱', IsMainIndex:false,
        Args:[ { Name:'N1', Value:9},{ Name:'N2', Value:25}, { Name:'M', Value:6}],
        Script: //脚本
'MASS:SUM(MA(HIGH-LOW,N1)/MA(MA(HIGH-LOW,N1),N1),N2);\n\
MAMASS:MA(MASS,M);'

    };

    return data;
}

JSIndexScript.prototype.WAD=function()
{
    let data=
    {
        Name:'WAD', Description:'威廉多空力度线', IsMainIndex:false,
        Args:[ { Name:'M', Value:30}],
        Script: //脚本
'MIDA:=CLOSE-MIN(REF(CLOSE,1),LOW);\n\
MIDB:=IF(CLOSE<REF(CLOSE,1),CLOSE-MAX(REF(CLOSE,1),HIGH),0);\n\
WAD:SUM(IF(CLOSE>REF(CLOSE,1),MIDA,MIDB),0);\n\
MAWAD:MA(WAD,M);'

    };

    return data;
}

JSIndexScript.prototype.CHO=function()
{
    let data=
    {
        Name:'CHO', Description:'佳庆指标', IsMainIndex:false,
        Args:[ { Name:'N1', Value:10}, { Name:'N2', Value:20}, { Name:'M', Value:6}],
        Script: //脚本
'MID:=SUM(VOL*(2*CLOSE-HIGH-LOW)/(HIGH+LOW),0);\n\
CHO:MA(MID,N1)-MA(MID,N2);\n\
MACHO:MA(CHO,M);'

    };

    return data;
}

JSIndexScript.prototype.ADTM=function()
{
    let data=
    {
        Name:'ADTM', Description:'动态买卖气指标', IsMainIndex:false,
        Args:[ { Name:'N', Value:23}, { Name:'M', Value:8}],
        Script: //脚本
'DTM:=IF(OPEN<=REF(OPEN,1),0,MAX((HIGH-OPEN),(OPEN-REF(OPEN,1))));\n\
DBM:=IF(OPEN>=REF(OPEN,1),0,MAX((OPEN-LOW),(OPEN-REF(OPEN,1))));\n\
STM:=SUM(DTM,N);\n\
SBM:=SUM(DBM,N);\n\
ADTM:IF(STM>SBM,(STM-SBM)/STM,IF(STM=SBM,0,(STM-SBM)/SBM));\n\
MAADTM:MA(ADTM,M);'

    };

    return data;
}

JSIndexScript.prototype.HSL=function()
{
    let data=
    {
        Name:'HSL', Description:'换手线', IsMainIndex:false,
        Args:[ { Name:'N', Value:5} ],
        Script: //脚本
'HSL:IF((SETCODE==0||SETCODE==1),100*VOL,VOL)/(FINANCE(7)/100);\n\
MAHSL:MA(HSL,N);'

    };

    return data;
}

JSIndexScript.prototype.BIAS36=function()
{
    let data=
    {
        Name:'BIAS36', Description:'三六乖离', IsMainIndex:false,
        Args:[ { Name:'M', Value:6} ],
        Script: //脚本
'BIAS36:MA(CLOSE,3)-MA(CLOSE,6);\n\
BIAS612:MA(CLOSE,6)-MA(CLOSE,12);\n\
MABIAS:MA(BIAS36,M);'

    };

    return data;
}

JSIndexScript.prototype.BIAS_QL=function()
{
    let data=
    {
        Name:'BIAS_QL', Description:'乖离率-传统版', IsMainIndex:false,
        Args:[ { Name:'N', Value:6}, { Name:'M', Value:6} ],
        Script: //脚本
'BIAS :(CLOSE-MA(CLOSE,N))/MA(CLOSE,N)*100;\n\
BIASMA :MA(BIAS,M);'

    };

    return data;
}

JSIndexScript.prototype.DPO=function()
{
    let data=
    {
        Name:'DPO', Description:'区间震荡线', IsMainIndex:false,
        Args:[ { Name:'N', Value:20}, { Name:'M', Value:6} ],
        Script: //脚本
'DPO:CLOSE-REF(MA(CLOSE,N),N/2+1);\n\
MADPO:MA(DPO,M);'

    };

    return data;
}

JSIndexScript.prototype.OSC=function()
{
    let data=
    {
        Name:'OSC', Description:'变动速率线', IsMainIndex:false,
        Args:[ { Name:'N', Value:20}, { Name:'M', Value:6} ],
        Script: //脚本
'OSC:100*(CLOSE-MA(CLOSE,N));\n\
MAOSC:EXPMEMA(OSC,M);'

    };

    return data;
}

JSIndexScript.prototype.ATR=function()
{
    let data=
    {
        Name:'ATR', Description:'真实波幅', IsMainIndex:false,
        Args:[ { Name:'N', Value:14}],
        Script: //脚本
'MTR:MAX(MAX((HIGH-LOW),ABS(REF(CLOSE,1)-HIGH)),ABS(REF(CLOSE,1)-LOW));\n\
ATR:MA(MTR,N);'

    };

    return data;
}

JSIndexScript.prototype.NVI=function()
{
    let data=
    {
        Name:'ATR', Description:'负成交量', IsMainIndex:false,
        Args:[ { Name:'N', Value:72} ],
        Script: //脚本
'NVI:100*MULAR(IF(V<REF(V,1),C/REF(C,1),1),0);\n\
MANVI:MA(NVI,N);'

    };

    return data;
}

JSIndexScript.prototype.PVI=function()
{
    let data=
    {
        Name:'PVI', Description:'正成交量', IsMainIndex:false,
        Args:[ { Name:'N', Value:72} ],
        Script: //脚本
'NVI:100*MULAR(IF(V>REF(V,1),C/REF(C,1),1),0);\n\
MANVI:MA(NVI,N);'

    };

    return data;
}

JSIndexScript.prototype.UOS=function()
{
    let data=
    {
        Name:'UOS', Description:'终极指标', IsMainIndex:false,
        Args:[ { Name:'N1', Value:7} ,{ Name:'N2', Value:14},{ Name:'N3', Value:28},{ Name:'M', Value:6}],
        Script: //脚本
'TH:=MAX(HIGH,REF(CLOSE,1));\n\
TL:=MIN(LOW,REF(CLOSE,1));\n\
ACC1:=SUM(CLOSE-TL,N1)/SUM(TH-TL,N1);\n\
ACC2:=SUM(CLOSE-TL,N2)/SUM(TH-TL,N2);\n\
ACC3:=SUM(CLOSE-TL,N3)/SUM(TH-TL,N3);\n\
UOS:(ACC1*N2*N3+ACC2*N1*N3+ACC3*N1*N2)*100/(N1*N2+N1*N3+N2*N3);\n\
MAUOS:EXPMEMA(UOS,M);'

    };

    return data;
}

JSIndexScript.prototype.CYW=function()
{
    let data=
    {
        Name:'CYW', Description:'主力控盘', IsMainIndex:false,
        Args:[ ],
        Script: //脚本
'VAR1:=CLOSE-LOW;\n\
VAR2:=HIGH-LOW;\n\
VAR3:=CLOSE-HIGH;\n\
VAR4:=IF(HIGH>LOW,(VAR1/VAR2+VAR3/VAR2)*VOL,0);\n\
CYW: SUM(VAR4,10)/10000, COLORSTICK;'

    };

    return data;
}

JSIndexScript.prototype.LON=function()
{
    let data=
    {
        Name:'LON', Description:'龙系长线', IsMainIndex:false,
        Args:[ { Name:'N', Value:10} ],
        Script: //脚本
'LC := REF(CLOSE,1);\n\
VID := SUM(VOL,2)/(((HHV(HIGH,2)-LLV(LOW,2)))*100);\n\
RC := (CLOSE-LC)*VID;\n\
LONG := SUM(RC,0);\n\
DIFF := SMA(LONG,10,1);\n\
DEA := SMA(LONG,20,1);\n\
LON : DIFF-DEA;\n\
LONMA : MA(LON,10);\n\
LONT : LON, COLORSTICK;'

    };

    return data;
}

JSIndexScript.prototype.NDB = function () 
{
    let data =
    {
        Name: 'NDB', Description: '脑电波', IsMainIndex: false,
        Args: [{ Name: 'P1', Value: 5 }, { Name: 'P2', Value: 10 }],
        Script: //脚本
'HH:=IF(C/REF(C,1)>1.098 AND L>REF(H,1),2*C-REF(C,1)-H,2*C-H-L);\n\
V1:= BARSCOUNT(C) - 1;\n\
V2:= 2 * REF(C, V1) - REF(H, V1) - REF(L, V1);\n\
DK: SUM(HH, 0) + V2;\n\
MDK5: MA(DK, P1);\n\
MDK10: MA(DK, P2);'

    };

    return data;
}

/*
    飞龙四式-主图
*/
JSIndexScript.prototype.Dragon4_Main = function () 
{
    let data =
    {
        Name: '飞龙四式', Description: '飞龙四式', IsMainIndex: true,
        Args: [{ Name: 'N1', Value: 5 }, { Name: 'N2', Value: 10 }, { Name: 'N3', Value: 50 }, { Name: 'N4', Value: 60 }],
        Script: //脚本
'蜻蜓点水:=EMA(CLOSE,N1),COLORGRAY;\n\
魔界:=EMA(CLOSE,N2),COLORGREEN;\n\
水:=EMA(CLOSE,N3),COLORRED;\n\
DRAWKLINE(HIGH,OPEN,LOW,CLOSE);\n\
生命线:MA(CLOSE,N4),COLORBLUE,LINETHICK2;\n\
DRAWBAND(魔界,\'RGB(186,225,250)\',水,\'RGB(253,194,124)\');\n\
DRAWBAND(蜻蜓点水,\'RGB(128,138,135)\',魔界,\'RGB(0,0,255)\');'

    };

    return data;
}

JSIndexScript.prototype.Dragon4_Fig=function()
{
    let data =
    {
        Name: '飞龙四式', Description: '飞龙四式', IsMainIndex: false,
        Args: [],
        Script: //脚本
'倍:VOL>=REF(V,1)*1.90 AND C>REF(C,1),COLORYELLOW;\n\
低:VOL<REF(LLV(VOL,13),1),COLORGREEN;\n\
地:VOL<REF(LLV(VOL,100),1),COLORMAGENTA; \n\
平:=ABS(VOL-HHV(REF(VOL,1),5))/HHV(REF(VOL,1),5)<=0.03 OR ABS(VOL-REF(VOL,1))/REF(VOL,1)<=0.03,NODRAW,COLORWHITE;\n\
倍缩:VOL<=REF(V,1)*0.5,COLORFF8000;\n\
梯量:COUNT(V>REF(V,1),3)==3 AND COUNT(C>O,3)==3,COLORBROWN;\n\
缩量涨:COUNT(C>REF(C,1),2)==2 AND COUNT(V<REF(V,1),2)==2,COLORBLUE;\n\
STICKLINE(C>=REF(C,1),V,0,2,0),COLORRED;\n\
STICKLINE(C<REF(C,1),V,0,2,0),COLORGREEN;\n\
STICKLINE(倍,0,V,2,0),COLORYELLOW;\n\
STICKLINE(低,0,V,2,0),COLORGREEN;\n\
STICKLINE(地,0,V,2,0),COLORLIMAGENTA;\n\
STICKLINE(平,0,V,2,0),COLORGRAY;\n\
STICKLINE(倍缩,0,V,2,0),COLORFF8000;\n\
STICKLINE(梯量,0,V,2,0),COLORBROWN;\n\
STICKLINE(缩量涨,0,V,2,0),COLORBLUE;'

    };

    return data;
}


/*
能图-资金分析
M:=55;
N:=34;
LC:=REF(CLOSE,1);
RSI:=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);
FF:=EMA(CLOSE,3);
MA15:=EMA(CLOSE,21); DRAWTEXT(CROSS(85,RSI),75,'▼'),COLORGREEN;
VAR1:=IF(YEAR>=2038 AND MONTH>=1,0,1);
VAR2:=REF(LOW,1)*VAR1;
VAR3:=SMA(ABS(LOW-VAR2),3,1)/SMA(MAX(LOW-VAR2,0),3,1)*100*VAR1;
VAR4:=EMA(IF(CLOSE*1.3,VAR3*10,VAR3/10),3)*VAR1;
VAR5:=LLV(LOW,30)*VAR1;
VAR6:=HHV(VAR4,30)*VAR1;
VAR7:=IF(MA(CLOSE,58),1,0)*VAR1;
VAR8:=EMA(IF(LOW<=VAR5,(VAR4+VAR6*2)/2,0),3)/618*VAR7*VAR1;
吸筹A:IF(VAR8>100,100,VAR8)*VAR1,COLORRED;
吸筹B:STICKLINE(吸筹A>-150,0,吸筹A,8,0),COLORRED;

散户线: 100*(HHV(HIGH,M)-CLOSE)/(HHV(HIGH,M)-LLV(LOW,M)),COLORFFFF00,LINETHICK2;
RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;
K:=SMA(RSV,3,1);
D:=SMA(K,3,1);
J:=3*K-2*D;
主力线:EMA(J,5),COLORFF00FF,LINETHICK2;
DRAWICON(CROSS(主力线,散户线),主力线,1);
DRAWICON(CROSS(散户线,主力线),主力线,2);
*/

JSIndexScript.prototype.FundsAnalysis=function()
{
    let data =
    {
        Name: '资金分析', Description: '资金分析', IsMainIndex: false,
        Args: [{ Name: 'M', Value: 55 }, { Name: 'N', Value: 34 }],
        Script: //脚本
'LC:=REF(CLOSE,1);\n\
RSI:=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);\n\
FF:=EMA(CLOSE,3);\n\
MA15:=EMA(CLOSE,21); DRAWTEXT(CROSS(85,RSI),75,\'▼\'),COLORGREEN;\n\
VAR1:=IF(YEAR>=2038 AND MONTH>=1,0,1);\n\
VAR2:=REF(LOW,1)*VAR1;\n\
VAR3:=SMA(ABS(LOW-VAR2),3,1)/SMA(MAX(LOW-VAR2,0),3,1)*100*VAR1;\n\
VAR4:=EMA(IF(CLOSE*1.3,VAR3*10,VAR3/10),3)*VAR1;\n\
VAR5:=LLV(LOW,30)*VAR1;\n\
VAR6:=HHV(VAR4,30)*VAR1;\n\
VAR7:=IF(MA(CLOSE,58),1,0)*VAR1;\n\
VAR8:=EMA(IF(LOW<=VAR5,(VAR4+VAR6*2)/2,0),3)/618*VAR7*VAR1;\n\
吸筹A:IF(VAR8>100,100,VAR8)*VAR1,COLORFB2F3B;\n\
{吸筹B}STICKLINE(吸筹A>-150,0,吸筹A,8,0),COLORFB2F3B;\n\
\n\
散户线: 100*(HHV(HIGH,M)-CLOSE)/(HHV(HIGH,M)-LLV(LOW,M)),COLORAA89BD,LINETHICK2;\n\
RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
K:=SMA(RSV,3,1);\n\
D:=SMA(K,3,1);\n\
J:=3*K-2*D;\n\
主力线:EMA(J,5),COLORF39800,LINETHICK2;\n\
DRAWICON(CROSS(主力线,散户线),主力线,1);\n\
DRAWICON(CROSS(散户线,主力线),主力线,2);'
    };

    return data; 
}

JSIndexScript.prototype.MarginProportion=function()
{
    let data =
    {
        Name: '融资占比(%)', Description: '融资占比', IsMainIndex: false,
        Args: [],
        Script: //脚本
        '占比:MARGIN(1);'
    };

    return data; 
}




