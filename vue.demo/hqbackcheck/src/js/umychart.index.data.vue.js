/*
    指标数据脚本 系统内置指标都写在这里
    Name：指标名字
    Description：指标描述信息
    IsMainIndex：是否是主图指标 true=主图指标 false=副图指标
    KLineType:K线设置 -1=主图不显示K线(只在主图有效) 0=在副图显示K线 1=在副图显示K线(收盘价线) 2=在副图显示K线(美国线)
    InstructionType: 1=专家指示  2=五彩K线
    FloatPrecision: 小数位数 缺省=2
    YSplitScale:  Y固定刻度 [1,8,10]
    YSpecificMaxMin: 固定Y轴最大最小值 { Max: 9, Min: 0, Count: 3 };
    Condition: 限制条件 { Symbol:'Index'/'Stock'(只支持指数/股票),Period:[](支持的周期), }
*/

//周期条件枚举
var CONDITION_PERIOD=
{
    MINUTE_ID:101,            //分钟      走势图
    MULTIDAY_MINUTE_ID:102,   //多日分钟  走势图
    HISTORY_MINUTE_ID:103,    //历史分钟  走势图

    //K线周期
    KLINE_DAY_ID:0,
    KLINE_WEEK_ID:1,
    KLINE_MONTH_ID:2,
    KLINE_YEAR_ID:3,
    KLINE_MINUTE_ID:4,
    KLINE_5_MINUTE_ID:5,
    KLINE_15_MINUTE_ID:6,
    KLINE_30_MINUTE_ID:7,
    KLINE_60_MINUTE_ID:8

};

function JSIndexScript()
{
    this.DataMap=new Map(
        [
            ['MA', this.MA],['均线', this.MA],['BOLL', this.BOLL],['BBI', this.BBI],
            ['DKX', this.DKX],['MIKE', this.MIKE],['PBX', this.PBX],
            ['ENE', this.ENE],['MACD', this.MACD],['KDJ', this.KDJ],
            ['VOL', this.VOL],['RSI', this.RSI],['BRAR', this.BRAR],
            ['WR', this.WR],['BIAS', this.BIAS],['OBV', this.OBV],
            ['DMI', this.DMI],['CR', this.CR],['PSY', this.PSY],
            ['CCI', this.CCI],['DMA', this.DMA],['TRIX', this.TRIX],
            ['VR', this.VR],['EMV', this.EMV],['ROC', this.ROC],
            ['MTM', this.MIM],['FSL', this.FSL],['CYR', this.CYR],
            ['MASS', this.MASS],['WAD', this.WAD],['CHO', this.CHO],
            ['ADTM', this.ADTM],['HSL', this.HSL],['BIAS36', this.BIAS36],
            ['BIAS_QL', this.BIAS_QL],['DPO', this.DPO],['OSC', this.OSC],
            ['ATR', this.ATR],['NVI', this.NVI],['PVI', this.PVI],
            ['UOS', this.UOS],['CYW', this.CYW],['LON', this.LON],
            ['NDB', this.NDB],['SKDJ',this.SKDJ],['KD',this.KD],['FKX',this.FKX],
            ['DKCOL',this.DKCOL],['UDL',this.UDL],['MFI',this.MFI],['LWR',this.LWR],
            ['MARSI',this.MARSI],['CYD',this.CYD],['CYF',this.CYF],['TAPI',this.TAPI],
            ['VMACD',this.VMACD],['QACD',this.QACD],['VPT',this.VPT],['WVAD',this.WVAD],
            ['DBQR',this.DBQR],['JS',this.JS],['CYE',this.CYE],['QR',this.QR],['GDX',this.GDX],
            ['JLHB',this.JLHB],['PCNT',this.PCNT],['BTX', this.BTX],['AMO',this.AMO],
            ['VRSI',this.VRSI],['HSCOL',this.HSCOL],['DBQRV',this.DBQRV],['DBLB',this.DBLB],
            ['ACD',this.ACD],['EXPMA',this.EXPMA],['EXPMA_S',this.EXPMA_S],['HMA',this.HMA],
            ['LMA',this.LMA],['VMA',this.VMA],['AMV',this.AMV],['BBIBOLL',this.BBIBOLL],
            ['ALLIGAT',this.ALLIGAT],['ZX',this.ZX],['XS',this.XS],['XS2',this.XS2],
            ['SG-XDT',this.SG_XDT],['SG-SMX',this.SG_SMX],['SG-LB',this.SG_LB],['SG-PF',this.SG_PF],
            ['RAD',this.RAD],['SHT',this.SHT],['ZLJC',this.ZLJC],['ZLMM',this.ZLMM],['SLZT',this.SLZT],
            ['ADVOL',this.ADVOL],['CYC',this.CYC],['CYS',this.CYS],['CYQKL',this.CYQKL],
            ['SCR',this.SCR],['ASR',this.ASR],['SAR',this.SAR],['TJCJL',this.TJCJL],['量比',this.VOLRate],

            ['飞龙四式', this.Dragon4_Main],['飞龙四式-附图', this.Dragon4_Fig],
            ['资金分析', this.FundsAnalysis],['融资占比',this.MarginProportion],['负面新闻', this.NewsNegative],
            ['涨跌趋势', this.UpDownAnalyze],

            ['Zealink-资金吸筹', this.Zealink_Index1], ['Zealink-牛熊区间', this.Zealink_Index2],['Zealink-持仓信号', this.Zealink_Index3],
            ['Zealink-增减持',this.Zealink_Index4],['Zealink-大宗交易', this.Zealink_Index5], ['Zealink-信托持股', this.Zealink_Index6],
            ['Zealink-官网新闻', this.Zealink_Index7], ['Zealink-高管要闻', this.Zealink_Index8],['Zealink-股权质押', this.Zealink_Index9],
            ['Zealink-操盘BS点', this.Zealink_Index10],['Zealink-操盘BS点2', this.Zealink_Index11],
            
            //外包指标
            ['放心股-操盘BS点',this.FXG_BSPoint],
            ['放心股-涨停多空线',this.FXG_INDEX],
            ['放心股-涨停吸筹区',this.FXG_INDEX2],
            ['放心股-量能黄金点',this.FXG_INDEX3],

            //五彩K线(函数COLOR_开头)
            ['五彩K线-十字星',this.COLOR_KSTAR1],['五彩K线-早晨之星',this.COLOR_KSTAR2],['五彩K线-黄昏之星',this.COLOR_KSTAR3],['五彩K线-长十字',this.COLOR_SHI1],
            ['五彩K线-身怀六甲',this.COLOR_K220],['五彩K线-三个白武士',this.COLOR_K300],['五彩K线-三只乌鸦',this.COLOR_K310],['五彩K线-光头阳线',this.COLOR_K380],
            ['五彩K线-光脚阴线',this.COLOR_K390],['五彩K线-垂死十字',this.COLOR_K134],['五彩K线-早晨十字星',this.COLOR_K140],['五彩K线-黄昏十字星',this.COLOR_K150],
            ['五彩K线-射击之星',this.COLOR_K160],['五彩K线-倒转锤头',this.COLOR_K165],['五彩K线-锤头',this.COLOR_K170],['五彩K线-吊颈',this.COLOR_K180],
            ['五彩K线-穿头破脚',this.COLOR_K190],['五彩K线-出水芙蓉',this.COLOR_CSFR],['五彩K线-乌云盖顶',this.COLOR_WYGD],['五彩K线-曙光初现',this.COLOR_SGCJ],
            ['五彩K线-十字胎',this.COLOR_SZTAI],['五彩K线-剑',this.COLOR_SWORD],['五彩K线-平顶',this.COLOR_PINGDING],['五彩K线-平底',this.COLOR_PINGDI],
            ['五彩K线-大阳烛',this.COLOR_DAYANZHU],['五彩K线-大阴烛',this.COLOR_DAYINGZHU],
            
            ['五彩K线-好友反攻',this.COLOR_HYFG],['五彩K线-跳空缺口',this.COLOR_TKQK],
            ['五彩K线-双飞乌鸦',this.COLOR_SFWY],['五彩K线-上升三部曲',this.COLOR_SSSBQ],['五彩K线-下跌三部曲',this.COLOR_XDSBQ],['五彩K线-长下影',this.COLOR_CHXY],
            ['五彩K线-长上影',this.COLOR_CHSY],['五彩K线-分离',this.COLOR_FENLI],

            //交易系统
            ['交易系统-BIAS',this.TRADE_BIAS],['交易系统-CCI',this.TRADE_CCI],['交易系统-DMI',this.TRADE_DMI],['交易系统-KD',this.TRADE_KD],
            ['交易系统-BOLL',this.TRADE_BOLL],['交易系统-KDJ',this.TRADE_KDJ],['交易系统-MA',this.TRADE_MA],['交易系统-MACD',this.TRADE_MACD],
            ['交易系统-MTM',this.TRADE_MTM],['交易系统-PSY',this.TRADE_PSY],['交易系统-ROC',this.TRADE_ROC],['交易系统-RSI',this.TRADE_RSI],
            ['交易系统-VR',this.TRADE_VR],['交易系统-DPSJ',this.TRADE_DPSJ],

            ['TEST', this.TEST] //测试用
        ]);
}

JSIndexScript.prototype.Get=function(id)
{
    //console.log('[JSIndexScript] load index data. count=',DataMap.size);
    var func=this.DataMap.get(id);
    if (func) return func();

    return null;
}

JSIndexScript.prototype.Search=function(name)
{
    var result=[];
    var reg = new RegExp(name,'i');
    this.DataMap.forEach(function(value,key)
    {
        if (key.indexOf('交易系统-')!=0 && key.indexOf('五彩K线-')!=0  && key.search(reg)>=0) 
            result.push(key);
    });

    return result;
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
        Name:'VOL', Description:'成交量', IsMainIndex:false,FloatPrecision:0,
        Args:[ { Name:'M1', Value:5}, { Name:'M2', Value:10} ],
        Script: //脚本
'VOL:VOL,VOLSTICK;\n\
MA1:MA(VOL,M1);\n\
MA2:MA(VOL,M2);'

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

JSIndexScript.prototype.MTM=function()
{
    let data=
    {
        Name:'MTM', Description:'动量线', IsMainIndex:false,
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
ADTM:IF(STM>SBM,(STM-SBM)/STM,IF(STM==SBM,0,(STM-SBM)/SBM));\n\
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

JSIndexScript.prototype.SKDJ = function () 
{
    let data =
    {
        Name: 'SKDJ', Description: '慢速随机指标', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 9 }, { Name: 'M', Value: 3 }],
        Script: //脚本
'LOWV:=LLV(LOW,N);\n\
HIGHV:=HHV(HIGH,N);\n\
RSV:=EMA((CLOSE-LOWV)/(HIGHV-LOWV)*100,M);\n\
K:EMA(RSV,M);\n\
D:MA(K,M);'

    };

    return data;
}

JSIndexScript.prototype.KD = function () 
{
    let data =
    {
        Name: 'KD', Description: '随机指标KD', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 9 }, { Name: 'M1', Value: 3 },{ Name: 'M2', Value: 3 }],
        Script: //脚本
'RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
K:SMA(RSV,M1,1);\n\
D:SMA(K,M2,1);'

    };

    return data;
}

JSIndexScript.prototype.FKX=function()
{
    let data=
    {
        Name:'FKX', Description:'反K线', IsMainIndex:true,
        Args:[  ],
        Script: //脚本
            'DRAWKLINE(-LOW, -OPEN, -HIGH, -CLOSE);'
    };

    return data;
}

JSIndexScript.prototype.DKCOL = function () 
{
    let data =
    {
        Name: 'DKCOL', Description: '多空能量柱(适用于分时主图)', IsMainIndex: true,
        Args: [{ Name: 'N', Value: 5 }],
        Script: //脚本
'FF:=(C-REF(C,N))/REF(C,N);\n\
STICKLINE(FF>0,DYNAINFO(3),DYNAINFO(3)*(1+FF),0.5,0),COLORRED;\n\
STICKLINE(FF<0,DYNAINFO(3),DYNAINFO(3)*(1+FF),0.5,0),COLORGREEN;'

    };

    return data;
}

JSIndexScript.prototype.UDL = function () 
{
    let data =
    {
        Name: 'UDL', Description: '引力线', IsMainIndex: false,
        Args: [{ Name: 'N1', Value: 3 },{ Name: 'N2', Value: 5 },{ Name: 'N3', Value: 10 },{ Name: 'N4', Value: 20 },{ Name: 'M', Value: 6 }],
        Script: //脚本
'UDL:(MA(CLOSE,N1)+MA(CLOSE,N2)+MA(CLOSE,N3)+MA(CLOSE,N4))/4;\n\
MAUDL:MA(UDL,M);'

    };

    return data;
}

JSIndexScript.prototype.MFI = function () 
{
    let data =
    {
        Name: 'MFI', Description: '资金流量指标', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 14 },{ Name: 'N2', Value: 6 }],
        Script: //脚本
'TYP := (HIGH + LOW + CLOSE)/3;\n\
V1:=SUM(IF(TYP>REF(TYP,1),TYP*VOL,0),N)/SUM(IF(TYP<REF(TYP,1),TYP*VOL,0),N);\n\
MFI:100-(100/(1+V1));'

    };

    return data;
}


JSIndexScript.prototype.LWR = function () 
{
    let data =
    {
        Name: 'LWR', Description: 'LWR威廉指标', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 9 },{ Name: 'M1', Value: 3 },{ Name: 'M2', Value: 3 }],
        Script: //脚本
'RSV:= (HHV(HIGH,N)-CLOSE)/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
LWR1:SMA(RSV,M1,1);\n\
LWR2:SMA(LWR1,M2,1);'

    };

    return data;
}

JSIndexScript.prototype.MARSI = function () 
{
    let data =
    {
        Name: 'MARSI', Description: '相对强弱平均线', IsMainIndex: false,
        Args: [{ Name: 'M1', Value: 10 },{ Name: 'M2', Value: 6 }],
        Script: //脚本
'DIF:=CLOSE-REF(CLOSE,1);\n\
VU:=IF(DIF>=0,DIF,0);\n\
VD:=IF(DIF<0,-DIF,0);\n\
MAU1:=MEMA(VU,M1);\n\
MAD1:=MEMA(VD,M1);\n\
MAU2:=MEMA(VU,M2);\n\
MAD2:=MEMA(VD,M2);\n\
RSI10:MA(100*MAU1/(MAU1+MAD1),M1);\n\
RSI6:MA(100*MAU2/(MAU2+MAD2),M2);'

    };

    return data;
}

JSIndexScript.prototype.CYD = function () 
{
    let data =
    {
        Name: 'CYD', Description: '承接因子', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 21 }],
        Script: //脚本
'CYDS:WINNER(CLOSE)/(VOL/CAPITAL);\n\
CYDN:WINNER(CLOSE)/MA(VOL/CAPITAL,N);'

    };

    return data;
}

JSIndexScript.prototype.CYF = function () 
{
    let data =
    {
        Name: 'CYF', Description: '市场能量', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 21 }],
        Script: //脚本
'CYF:100-100/(1+EMA(HSL,N));'

    };

    return data;
}

JSIndexScript.prototype.TAPI = function () 
{
    let data =
    {
        Name: 'TAPI', Description: '加权指数成交值', IsMainIndex: false,
        Args: [{ Name: 'M', Value: 6 }],
        Script: //脚本
'TAPI:AMOUNT/INDEXC;\n\
MATAIP:MA(TAPI,M);'

    };

    return data;
}

JSIndexScript.prototype.VMACD = function () 
{
    let data =
    {
        Name: 'VMACD', Description: '量平滑异同平均', IsMainIndex: false,
        Args: [{ Name: 'SHORT', Value: 12 },{ Name: 'LONG', Value: 26 },{ Name: 'MID', Value: 9 }],
        Script: //脚本
'DIF:EMA(VOL,SHORT)-EMA(VOL,LONG);\n\
DEA:EMA(DIF,MID);\n\
MACD:DIF-DEA,COLORSTICK;'

    };

    return data;
}

JSIndexScript.prototype.QACD = function () 
{
    let data =
    {
        Name: 'QACD', Description: '快速异同平均', IsMainIndex: false,
        Args: [{ Name: 'N1', Value: 12 },{ Name: 'N2', Value: 26 },{ Name: 'M', Value: 9 }],
        Script: //脚本
'DIF:EMA(CLOSE,N1)-EMA(CLOSE,N2);\n\
MACD:EMA(DIF,M);\n\
DDIF:DIF-MACD;'

    };

    return data;
}

JSIndexScript.prototype.VPT = function () 
{
    let data =
    {
        Name: 'VPT', Description: '量价曲线', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 51 },{ Name: 'M', Value: 6 }],
        Script: //脚本
'VPT:SUM(VOL*(CLOSE-REF(CLOSE,1))/REF(CLOSE,1),N);\n\
MAVPT:MA(VPT,M);'

    };

    return data;
}

JSIndexScript.prototype.WVAD = function () 
{
    let data =
    {
        Name: 'WVAD', Description: '威廉变异离散量', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 24 },{ Name: 'M', Value: 6 }],
        Script: //脚本
'WVAD:SUM((CLOSE-OPEN)/(HIGH-LOW)*VOL,N)/10000;\n\
MAWVAD:MA(WVAD,M);'

    };

    return data;
}

JSIndexScript.prototype.DBQR = function () 
{
    let data =
    {
        Name: 'WVAD', Description: '对比强弱', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 },{ Name: 'M1', Value: 10 },{ Name: 'M2', Value: 20 },{ Name: 'M3', Value: 60 }],
        Script: //脚本
'ZS:(INDEXC-REF(INDEXC,N))/REF(INDEXC,N);\n\
GG:(CLOSE-REF(CLOSE,N))/REF(CLOSE,N);\n\
MADBQR1:MA(GG,M1);\n\
MADBQR2:MA(GG,M2);\n\
MADBQR3:MA(GG,M3);'

    };

    return data;
}

JSIndexScript.prototype.JS = function () 
{
    let data =
    {
        Name: 'JS', Description: '加速线', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 },{ Name: 'M1', Value: 5 },{ Name: 'M2', Value: 10 },{ Name: 'M3', Value: 20 }],
        Script: //脚本
'JS:100*(CLOSE-REF(CLOSE,N))/(N*REF(CLOSE,N));\n\
MAJS1:MA(JS,M1);\n\
MAJS2:MA(JS,M2);\n\
MAJS3:MA(JS,M3);'

    };

    return data;
}

JSIndexScript.prototype.CYE = function () 
{
    let data =
    {
        Name: 'CYE', Description: '市场趋势', IsMainIndex: false,
        Args: [ ],
        Script: //脚本
'MAL:=MA(CLOSE,5);\n\
MAS:=MA(MA(CLOSE,20),5);\n\
CYEL:(MAL-REF(MAL,1))/REF(MAL,1)*100;\n\
CYES:(MAS-REF(MAS,1))/REF(MAS,1)*100;'

    };

    return data;
}

JSIndexScript.prototype.QR = function () 
{
    let data =
    {
        Name: 'QR', Description: '强弱指标', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 21 } ],
        Script: //脚本
'个股: (CLOSE-REF(CLOSE,N))/REF(CLOSE,N)*100; \n\
大盘: (INDEXC-REF(INDEXC,N))/REF(INDEXC,N)*100; \n\
强弱值:EMA(个股-大盘,2),COLORSTICK;'

    };

    return data;
}

JSIndexScript.prototype.GDX = function () 
{
    let data =
    {
        Name: 'GDX', Description: '轨道线', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 30 } ,{ Name: 'M', Value: 9 }],
        Script: //脚本
'AA:=ABS((2*CLOSE+HIGH+LOW)/4-MA(CLOSE,N))/MA(CLOSE,N); \n\
轨道:DMA(CLOSE,AA);\n\
压力线:(1+M/100)*轨道; \n\
支撑线:(1-M/100)*轨道;'

    };

    return data;
}

JSIndexScript.prototype.JLHB = function () 
{
    let data =
    {
        Name: 'JLHB', Description: '绝路航标', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 7 } ,{ Name: 'M', Value: 5 }],
        Script: //脚本
'VAR1:=(CLOSE-LLV(LOW,60))/(HHV(HIGH,60)-LLV(LOW,60))*80; \n\
B:SMA(VAR1,N,1); \n\
VAR2:SMA(B,M,1); \n\
绝路航标:IF(CROSS(B,VAR2) AND B<40,50,0);'

    };

    return data;
}

JSIndexScript.prototype.PCNT = function () 
{
    let data =
    {
        Name: 'PCNT', Description: '幅度比', IsMainIndex: false,
        Args: [{ Name: 'M', Value: 5 }],
        Script: //脚本
'PCNT:(CLOSE-REF(CLOSE,1))/CLOSE*100;\n\
MAPCNT:EXPMEMA(PCNT,M);'

    };

    return data;
}

JSIndexScript.prototype.BTX = function () 
{
    let data =
    {
        Name: 'BTX', Description: '宝塔线', IsMainIndex: false,
        Args: [],
        Script: //脚本
            'B1:=REF(C,1);\n\
B2:= REF(C, 2);\n\
SS:= IF(C > REF(C, 1) AND REF(C, 1) >= REF(C, 2), 1, IF(C < REF(C, 1) AND REF(C, 1) <= REF(C, 2), -1, IF(C > REF(C, 2) AND REF(C, 2) > REF(C, 1), 2, IF(C < REF(C, 2) AND REF(C, 2) < REF(C, 1), -2, 0))));\n\
SM:= IF(REF(SS, 1) <> 0, REF(SS, 1), IF(REF(SS, 2) <> 0, REF(SS, 2), IF(REF(SS, 3) <> 0, REF(SS, 3), IF(REF(SS, 5) <> 0, REF(SS, 5), IF(REF(SS, 6) <> 0, REF(SS, 6), IF(REF(SS, 7) <> 0, REF(SS, 7), 0))))));\n\
MC:= IF(REF(SS, 1) <> 0, B2, IF(SM > 0, MIN(B1, B2), MAX(B1, B2)));\n\
TOW1:= IF(C > REF(C, 1), C, REF(C, 1));\n\
TOW2:= IF((SS == -1 OR SS == -2) AND SM > 0, B2, TOW1);\n\
TOWER:= IF(TOW1 > TOW2, TOW1, TOW2);\n\
STICKLINE(SS == 1 OR SM >= 1 AND SS == 0, B1, C, 10, 1), COLORRED;\n\
STICKLINE(SS == -1 OR SM <= -1 AND SS == 0, B1, C, 10, 0), COLORCYAN;\n\
STICKLINE(SS == 2, B2, C, 10, 1), COLORRED;\n\
STICKLINE(SS == -2, B2, C, 10, 0), COLORCYAN;\n\
STICKLINE((SS == -1 OR SS == -2) AND SM > 0, B2, B1, 10, 1), COLORRED;\n\
STICKLINE((SS == 1 OR SS == 2) AND SM < 0, B2, B1, 10, 0), COLORCYAN;'
        };

    return data;
}

JSIndexScript.prototype.AMO = function () 
{
    let data =
    {
        Name: 'AMO', Description: '成交金额', IsMainIndex: false,
        Args: [{ Name: 'M1', Value: 5 },{ Name: 'M2', Value: 10 }],
        Script: //脚本
'AMOW:AMOUNT/10000.0,VOLSTICK;\n\
AMO1:MA(AMOW,M1);\n\
AMO2:MA(AMOW,M2);'

    };

    return data;
}

JSIndexScript.prototype.VRSI = function () 
{
    let data =
    {
        Name: 'VRSI', Description: '相对强弱量', IsMainIndex: false,
        Args: [{ Name: 'N1', Value: 6 },{ Name: 'N2', Value: 12 },{ Name: 'N3', Value: 24 }],
        Script: //脚本
'LC:=REF(VOL,1);\n\
RSI1:SMA(MAX(VOL-LC,0),N1,1)/SMA(ABS(VOL-LC),N1,1)*100;\n\
RSI2:SMA(MAX(VOL-LC,0),N2,1)/SMA(ABS(VOL-LC),N2,1)*100;\n\
RSI3:SMA(MAX(VOL-LC,0),N3,1)/SMA(ABS(VOL-LC),N3,1)*100;'

    };

    return data;
}

JSIndexScript.prototype.HSCOL = function () 
{
    let data =
    {
        Name: 'HSCOL', Description: '换手柱', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 }],
        Script: //脚本
'HSCOL:IF((SETCODE==0||SETCODE==1),100*VOL,VOL)/(FINANCE(7)/100),VOLSTICK;\n\
MAHSL:MA(HSCOL,N);'

    };

    return data;
}

JSIndexScript.prototype.DBQRV = function () 
{
    let data =
    {
        Name: 'DBQRV', Description: '对比强弱量(需下载日线)', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 }],
        Script: //脚本
'ZS:(INDEXV-REF(INDEXV,N))/REF(INDEXV,N);\n\
GG:(VOL-REF(VOL,N))/REF(VOL,N);'

    };

    return data;
}

JSIndexScript.prototype.DBLB = function () 
{
    let data =
    {
        Name: 'DBLB', Description: '对比量比(需下载日线)', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 },{ Name: 'M', Value: 5 }],
        Script: //脚本
'GG:=VOL/SUM(REF(VOL,1),N);\n\
ZS:=INDEXV/SUM(REF(INDEXV,1),N);\n\
DBLB:GG/ZS;\n\
MADBLB:MA(DBLB,M);'

    };

    return data;
}

JSIndexScript.prototype.ACD = function () 
{
    let data =
    {
        Name: 'ACD', Description: '升降线', IsMainIndex: false,
        Args: [{ Name: 'M', Value: 20 }],
        Script: //脚本
'LC:=REF(CLOSE,1);\n\
DIF:=CLOSE-IF(CLOSE>LC,MIN(LOW,LC),MAX(HIGH,LC));\n\
ACD:SUM(IF(CLOSE==LC,0,DIF),0);\n\
MAACD:EXPMEMA(ACD,M);'

    };

    return data;
}

JSIndexScript.prototype.EXPMA = function () 
{
    let data =
    {
        Name: 'EXPMA', Description: '指数平均线', IsMainIndex: true,
        Args: [{ Name: 'M1', Value: 12 },{ Name: 'M2', Value: 50 }],
        Script: //脚本
'EXP1:EMA(CLOSE,M1);\n\
EXP2:EMA(CLOSE,M2);'

    };

    return data;
}

JSIndexScript.prototype.EXPMA_S = function () 
{
    let data =
    {
        Name: 'EXPMA_S', Description: '指数平均线-副图', IsMainIndex: false,
        Args: [{ Name: 'M1', Value: 12 },{ Name: 'M2', Value: 50 }],
        Script: //脚本
'EXP1:EMA(CLOSE,M1);\n\
EXP2:EMA(CLOSE,M2);'

    };

    return data;
}

JSIndexScript.prototype.HMA = function () 
{
    let data =
    {
        Name: 'HMA', Description: '高价平均线', IsMainIndex: true,
        Args: [{ Name: 'M1', Value: 6 },{ Name: 'M2', Value: 12 },{ Name: 'M3', Value: 30 },{ Name: 'M4', Value: 72 },{ Name: 'M5', Value: 144 }],
        Script: //脚本
'HMA1:MA(HIGH,M1);\n\
HMA2:MA(HIGH,M2);\n\
HMA3:MA(HIGH,M3);\n\
HMA4:MA(HIGH,M4);\n\
HMA5:MA(HIGH,M5);'

    };

    return data;
}

JSIndexScript.prototype.LMA = function () 
{
    let data =
    {
        Name: 'LMA', Description: '低价平均线', IsMainIndex: true,
        Args: [{ Name: 'M1', Value: 6 },{ Name: 'M2', Value: 12 },{ Name: 'M3', Value: 30 },{ Name: 'M4', Value: 72 },{ Name: 'M5', Value: 144 }],
        Script: //脚本
'LMA1:MA(LOW,M1);\n\
LMA2:MA(LOW,M2);\n\
LMA3:MA(LOW,M3);\n\
LMA4:MA(LOW,M4);\n\
LMA5:MA(LOW,M5);'

    };

    return data;
}

JSIndexScript.prototype.VMA = function () 
{
    let data =
    {
        Name: 'VMA', Description: '变异平均线', IsMainIndex: true,
        Args: [{ Name: 'M1', Value: 6 },{ Name: 'M2', Value: 12 },{ Name: 'M3', Value: 30 },{ Name: 'M4', Value: 72 },{ Name: 'M5', Value: 144 }],
        Script: //脚本
'VV:=(HIGH+OPEN+LOW+CLOSE)/4;\n\
VMA1:MA(VV,M1);\n\
VMA2:MA(VV,M2);\n\
VMA3:MA(VV,M3);\n\
VMA4:MA(VV,M4);\n\
VMA5:MA(VV,M5);'

    };

    return data;
}


JSIndexScript.prototype.AMV = function () 
{
    let data =
    {
        Name: 'AMV', Description: '成本价均线', IsMainIndex: false,
        Args: [{ Name: 'M1', Value: 6 },{ Name: 'M2', Value: 12 },{ Name: 'M3', Value: 30 },{ Name: 'M4', Value: 72 },{ Name: 'M5', Value: 144 }],
        Script: //脚本
'AMOV:=VOL*(OPEN+CLOSE)/2;\n\
AMV1:SUM(AMOV,M1)/SUM(VOL,M1);\n\
AMV2:SUM(AMOV,M2)/SUM(VOL,M2);\n\
AMV3:SUM(AMOV,M3)/SUM(VOL,M3);\n\
AMV4:SUM(AMOV,M4)/SUM(VOL,M4);'

    };

    return data;
}

JSIndexScript.prototype.BBIBOLL = function () 
{
    let data =
    {
        Name: 'BBIBOLL', Description: '多空布林线', IsMainIndex: true,
        Args: [{ Name: 'N', Value: 11 },{ Name: 'M', Value: 6 }],
        Script: //脚本
'CV:=CLOSE;\n\
BBIBOLL:(MA(CV,3)+MA(CV,6)+MA(CV,12)+MA(CV,24))/4;\n\
UPR:BBIBOLL+M*STD(BBIBOLL,N);\n\
DWN:BBIBOLL-M*STD(BBIBOLL,N);'

    };

    return data;
}

JSIndexScript.prototype.ALLIGAT = function () 
{
    let data =
    {
        Name: 'ALLIGAT', Description: '鳄鱼线', IsMainIndex: true,
        Args: [],
        Script: //脚本
'NN:=(H+L)/2;\n\
上唇:REF(MA(NN,5),3),COLOR40FF40;\n\
牙齿:REF(MA(NN,8),5),COLOR0000C0;\n\
下颚:REF(MA(NN,13),8),COLORFF4040;'

    };

    return data;
}

JSIndexScript.prototype.ZX = function () 
{
    let data =
    {
        Name: 'ZX', Description: '重心线', IsMainIndex: false,
        Args: [],
        Script: //脚本
'AV:0.01*AMOUNT/VOL;'

    };

    return data;
}

JSIndexScript.prototype.XS = function () 
{
    let data =
    {
        Name: 'XS', Description: '薛斯通道', IsMainIndex: true,
        Args: [{ Name: 'N', Value: 13 }],
        Script: //脚本
'VAR2:=CLOSE*VOL;\n\
VAR3:=EMA((EMA(VAR2,3)/EMA(VOL,3)+EMA(VAR2,6)/EMA(VOL,6)+EMA(VAR2,12)/EMA(VOL,12)+EMA(VAR2,24)/EMA(VOL,24))/4,N);\n\
SUP:1.06*VAR3;\n\
SDN:VAR3*0.94;\n\
VAR4:=EMA(CLOSE,9);\n\
LUP:EMA(VAR4*1.14,5);\n\
LDN:EMA(VAR4*0.86,5);'

    };

    return data;
}

JSIndexScript.prototype.XS2 = function () 
{
    let data =
    {
        Name: 'XS2', Description: '薛斯通道II', IsMainIndex: true,
        Args: [{ Name: 'N', Value: 102 },{ Name: 'M', Value: 7 }],
        Script: //脚本
'AA:=MA((2*CLOSE+HIGH+LOW)/4,5); \n\
通道1:AA*N/100; \n\
通道2:AA*(200-N)/100; \n\
CC:=ABS((2*CLOSE+HIGH+LOW)/4-MA(CLOSE,20))/MA(CLOSE,20); \n\
DD:=DMA(CLOSE,CC); \n\
通道3:(1+M/100)*DD; \n\
通道4:(1-M/100)*DD;'

    };

    return data;
}

JSIndexScript.prototype.SG_XDT = function () 
{
    let data =
    {
        Name: 'SG-XDT', Description: '心电图(需下载日线)', IsMainIndex: false,
        Args: [{ Name: 'P1', Value: 5 },{ Name: 'P2', Value: 10 }],
        Script: //脚本
'QR:CLOSE/INDEXC*1000;\n\
MQR1:MA(QR,5);\n\
MQR2:MA(QR,10);'

    };

    return data;
}

JSIndexScript.prototype.SG_SMX = function () 
{
    let data =
    {
        Name: 'SG-SMX', Description: '生命线(需下载日线)', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 50 }],
        Script: //脚本
'H1:=HHV(HIGH,N);\n\
L1:=LLV(LOW,N);\n\
H2:=HHV(INDEXH,N);\n\
L2:=LLV(INDEXL,N);\n\
ZY:=CLOSE/INDEXC*2000;\n\
ZY1:EMA(ZY,3);\n\
ZY2:EMA(ZY,17);\n\
ZY3:EMA(ZY,34);'

    };

    return data;
}

JSIndexScript.prototype.SG_LB = function () 
{
    let data =
    {
        Name: 'SG-LB', Description: '量比(需下载日线)', IsMainIndex: false,
        Args: [],
        Script: //脚本
'ZY2:=VOL/INDEXV*1000;\n\
量比:ZY2;\n\
MA5:MA(ZY2,5);\n\
MA10:MA(ZY2,10);'

    };

    return data;
}

JSIndexScript.prototype.SG_PF = function () 
{
    let data =
    {
        Name: 'SG-PF', Description: '强势股评分(需下载日线)', IsMainIndex: false,
        Args: [],
        Script: //脚本
'ZY1:=CLOSE/INDEXC*1000;\n\
A1:=IF(ZY1>HHV(ZY1,3),10,0);\n\
A2:=IF(ZY1>HHV(ZY1,5),15,0);\n\
A3:=IF(ZY1>HHV(ZY1,10),20,0);\n\
A4:=IF(ZY1>HHV(ZY1,2),10,0);\n\
A5:=COUNT(ZY1>REF(ZY1,1) ,9)*5;\n\
强势股评分:A1+A2+A3+A4+A5;'

    };

    return data;
}

JSIndexScript.prototype.RAD = function () 
{
    let data =
    {
        Name: 'RAD', Description: '威力雷达(需下载日线)', IsMainIndex: false,
        Args: [{ Name: 'D', Value: 3 },{ Name: 'S', Value: 30 },{ Name: 'M', Value: 30 }],
        Script: //脚本
'SM:=(OPEN+HIGH+CLOSE+LOW)/4;\n\
SMID:=MA(SM,D);\n\
IM:=(INDEXO+INDEXH+INDEXL+INDEXC)/4;\n\
IMID:=MA(IM,D);\n\
SI1:=(SMID-REF(SMID,1))/SMID;\n\
II:=(IMID-REF(IMID,1))/IMID;\n\
RADER1:SUM((SI1-II)*2,S)*1000;\n\
RADERMA:SMA(RADER1,M,1);'

    };

    return data;
}

JSIndexScript.prototype.SHT = function () 
{
    let data =
    {
        Name: 'SHT', Description: '龙系短线', IsMainIndex: false,
        Args: [{ Name: 'N', Value: 5 }],
        Script: //脚本
'VAR1:=MA((VOL-REF(VOL,1))/REF(VOL,1),5);\n\
VAR2:=(CLOSE-MA(CLOSE,24))/MA(CLOSE,24)*100;\n\
MY: VAR2*(1+VAR1);\n\
SHT: MY, COLORSTICK;\n\
SHTMA: MA(SHT,N);'

    };

    return data;
}

JSIndexScript.prototype.ZLJC = function () 
{
    let data =
    {
        Name: 'ZLJC', Description: '主力进出', IsMainIndex: false,
        Args: [],
        Script: //脚本
'VAR1:=(CLOSE+LOW+HIGH)/3; \n\
VAR2:=SUM(((VAR1-REF(LOW,1))-(HIGH-VAR1))*VOL/100000/(HIGH-LOW),0); \n\
VAR3:=EMA(VAR2,1); \n\
JCS:VAR3; \n\
JCM:MA(VAR3,12); \n\
JCL:MA(VAR3,26);'

    };

    return data;
}

JSIndexScript.prototype.ZLMM = function () 
{
    let data =
    {
        Name: 'ZLMM', Description: '主力买卖', IsMainIndex: false,
        Args: [],
        Script: //脚本
'LC :=REF(CLOSE,1);\n\
RSI2:=SMA(MAX(CLOSE-LC,0),12,1)/SMA(ABS(CLOSE-LC),12,1)*100;\n\
RSI3:=SMA(MAX(CLOSE-LC,0),18,1)/SMA(ABS(CLOSE-LC),18,1)*100;\n\
MMS:MA(3*RSI2-2*SMA(MAX(CLOSE-LC,0),16,1)/SMA(ABS(CLOSE-LC),16,1)*100,3);\n\
MMM:EMA(MMS,8);\n\
MML:MA(3*RSI3-2*SMA(MAX(CLOSE-LC,0),12,1)/SMA(ABS(CLOSE-LC),12,1)*100,5);'

    };

    return data;
}

JSIndexScript.prototype.SLZT = function () 
{
    let data =
    {
        Name: 'SLZT', Description: '神龙在天', IsMainIndex: false,
        Args: [],
        Script: //脚本
'白龙: MA(CLOSE,125);\n\
黄龙: 白龙+2*STD(CLOSE,170);\n\
紫龙: 白龙-2*STD(CLOSE,145);\n\
青龙: SAR(125,1,7), LINESTICK;\n\
VAR2:=HHV(HIGH,70);\n\
VAR3:=HHV(HIGH,20);\n\
红龙: VAR2*0.83;\n\
蓝龙: VAR3*0.91;'

    };

    return data;
}

JSIndexScript.prototype.ADVOL = function () 
{
    let data =
    {
        Name: 'ADVOL', Description: '龙系离散量', IsMainIndex: false,
        Args: [],
        Script: //脚本
'A:=SUM(((CLOSE-LOW)-(HIGH-CLOSE))*VOL/10000/(HIGH-LOW),0);\n\
ADVOL:A;\n\
MA1:MA(A,30);\n\
MA2:MA(MA1,100);'

    };

    return data;
}

JSIndexScript.prototype.CYC = function () 
{
    let data =
    {
        Name: 'CYC', Description: '成本均线', IsMainIndex: true,
        Args: [{ Name: 'P1', Value: 5 },{ Name: 'P2', Value: 13 },{ Name: 'P3', Value: 34 }],
        Script: //脚本
'JJJ:=IF(DYNAINFO(8)>0.01,0.01*DYNAINFO(10)/DYNAINFO(8),DYNAINFO(3));\n\
DDD:=(DYNAINFO(5)<0.01 || DYNAINFO(6)<0.01);\n\
JJJT:=IF(DDD,1,(JJJ<(DYNAINFO(5)+0.01) && JJJ>(DYNAINFO(6)-0.01)));\n\
CYC1:IF(JJJT,0.01*EMA(AMOUNT,P1)/EMA(VOL,P1),EMA((HIGH+LOW+CLOSE)/3,P1));\n\
CYC2:IF(JJJT,0.01*EMA(AMOUNT,P2)/EMA(VOL,P2),EMA((HIGH+LOW+CLOSE)/3,P2));\n\
CYC3:IF(JJJT,0.01*EMA(AMOUNT,P3)/EMA(VOL,P3),EMA((HIGH+LOW+CLOSE)/3,P3));\n\
CYC4:IF(JJJT,DMA(AMOUNT/(100*VOL),100*VOL/FINANCE(7)),EMA((HIGH+LOW+CLOSE)/3,120));'

    };

    return data;
}

JSIndexScript.prototype.CYS = function () 
{
    let data =
    {
        Name: 'CYS', Description: '市场盈亏', IsMainIndex: false,
        Args: [],
        Script: //脚本
'CYC13:EMA(AMOUNT,13)/EMA(VOL,13);\n\
CYS:(CLOSE-CYC13)/CYC13*100;'

    };

    return data;
}

JSIndexScript.prototype.CYQKL = function () 
{
    let data =
    {
        Name: 'CYQKL', Description: '博弈K线长度', IsMainIndex: false,
        Args: [],
        Script: //脚本
'KL:100*(WINNER(CLOSE)-WINNER(OPEN));'

    };

    return data;
}

JSIndexScript.prototype.SCR = function () 
{
    let data =
    {
        Name: 'SCR', Description: '筹码集中度', IsMainIndex: false,
        Args: [{ Name: 'P1', Value: 90 }],
        Script: //脚本
'A:=P1+(100-P1)/2;\n\
B:=(100-P1)/2;\n\
CC:=COST(A);\n\
DD:=COST(B);\n\
SCR:(CC-DD)/(CC+DD)*100/2;'

    };

    return data;
}


JSIndexScript.prototype.ASR = function () 
{
    let data =
    {
        Name: 'ASR', Description: '浮筹比例', IsMainIndex: false,
        Args: [],
        Script: //脚本
'ASR:(WINNER(C*1.1)-WINNER(C*0.9))/WINNER(HHV(H,0))*100;'

    };

    return data;
}

JSIndexScript.prototype.SAR = function () 
{
    let data =
    {
        Name: 'SAR', Description: '抛物转向', IsMainIndex: true,
        Args: [{ Name: 'P', Value: 10 },{ Name: 'STEP', Value: 2 },{ Name: 'MAXP', Value: 20 }],
        Script: //脚本
'S:SAR(P,STEP,MAXP),CIRCLEDOT;'

    };

    return data;
}

JSIndexScript.prototype.TJCJL = function () 
{
    let data =
    {
        Name: '太极成交量', Description: '太极成交量', IsMainIndex: true,
        Args: [],
        Script: //脚本
'总手:VOL,NODRAW;\n\
ZZ:=IF(REF(C,1)>REF(O,1) AND O>REF(C,1)*1.014 AND C<O*1.02,1,3);\n\
V5:=MA(V,5);\n\
V12:=MA(V,12);\n\
V34:=MA(V,34);\n\
C6:=MA(C,6);\n\
STICKLINE(VOL,0,VOL,10,0),COLORLIGRAY;\n\
STICKLINE(CROSS(C,C6) AND V>V5*1.2 AND V>V12*1.2 AND ZZ>2 AND C>H*0.975,0,VOL,10,0),COLORRED;\n\
STICKLINE(CROSS(C6,C) AND V>V5*1.2 AND V>V12*1.2,0,VOL,10,0),COLORGREEN;\n\
STICKLINE(VOL>MA(VOL,5)*2 AND V>V34*3 AND C<REF(C,1)*1.05,0,VOL,10,0),COLORYELLOW;\n\
STICKLINE(VOL<MA(VOL,5)/2 AND V<V12/2,0,VOL,10,0),COLORBLUE;\n\
STICKLINE(VOL>MA(VOL,5)*2 AND V>V34*3 AND C<REF(C,1)*1.05 AND CROSS(C,C6) AND V>V5*1.2 AND V>V12*1.2 AND ZZ>2 AND C>H*0.975,VOL*0.5,0,10,0),COLORRED;\n\
STICKLINE(VOL>MA(VOL,5)*2 AND V>V34*3 AND C<REF(C,1)*1.05 AND CROSS(C6,C) AND V>V5*1.2 AND V>V12*1.2,VOL*0.5,0,10,0),COLORRED;'

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
        Condition: { Period:[CONDITION_PERIOD.KLINE_DAY_ID] },
        Args: [],
        Script: //脚本
        '占比:MARGIN(2);'
    };

    return data; 
}

JSIndexScript.prototype.FXG_BSPoint=function()
{
    let data =
    {
        Name: '操盘BS点', Description: '操盘BS点', IsMainIndex: true,
        Args: [],
        Script: //脚本
        'MA5:MA(CLOSE,5);\n\
        MA13:MA(CLOSE,13);\n\
        MA21:MA(CLOSE,21);\n\
        MA34:MA(CLOSE,34);\n\
        {MA55:MA(CLOSE,55),COLOR0000FF;}\n\
        {MA120:=MA(CLOSE,120),COLORFFFF00;}\n\
        天使:=EMA(C,2),COLOR000000;\n\
        魔鬼:=EMA(SLOPE(C,21)*20+C,42),COLOR000000;\n\
        买:=CROSS(天使,魔鬼);\n\
        卖:=CROSS(魔鬼,天使);\n\
        DRAWICON(买,L*0.97,13);\n\
        DRAWICON(卖,H*1.03,14);\n\
        DRAWKLINE_IF(天使>=魔鬼,HIGH,CLOSE,LOW,OPEN),COLORRED;\n\
        DRAWKLINE_IF(天使<魔鬼,HIGH,CLOSE,LOW,OPEN),COLORBLUE;\n\
        DRAWKLINE_IF(CROSS(天使,魔鬼),HIGH,CLOSE,LOW,OPEN),COLORYELLOW;\n\
        DRAWKLINE_IF(CROSS(魔鬼,天使),HIGH,CLOSE,LOW,OPEN),COLORBLACK;'
    };

    return data; 
}

JSIndexScript.prototype.FXG_INDEX=function()
{
    let data =
    {
        Name: '涨停多空线', Description: '涨停多空线', IsMainIndex: false,
        Args: [],
        Script: //脚本
'做多能量线: SMA((CLOSE-LLV(LOW,9))/(HHV(HIGH,9)-LLV(LOW,9))*100,5,1)-8,COLORRED,LINETHICK3;\n\
做空能量线: SMA((HHV(HIGH,36)-CLOSE)/(HHV(HIGH,36)-LLV(LOW,36))*100,2,1),COLORGREEN,LINETHICK3;\n\
20,POINTDOT,COLORF00FF0;\n\
50,POINTDOT,COLORGREEN;\n\
80,POINTDOT,COLORLIBLUE;'
    };

    return data; 
}

JSIndexScript.prototype.FXG_INDEX2=function()
{
    let data =
    {
        Name: '涨停吸筹区', Description: '涨停吸筹区', IsMainIndex: false,
        Args: [],
        Script: //脚本
'VAR0:=EMA(HHV(HIGH,500),21); \n\
VAR1:=EMA(HHV(HIGH,250),21);\n\
VAR2:=EMA(HHV(HIGH,90),21); \n\
VAR3:=EMA(LLV(LOW,500),21); \n\
VAR4:=EMA(LLV(LOW,250),21); \n\
VAR5:=EMA(LLV(LOW,90),21);\n\
\n\
VAR6:=EMA((VAR3*0.96+VAR4*0.96+VAR5*0.96+VAR0*0.558+VAR1*0.558+VAR2*0.558)/6,21); \n\
VAR7:=EMA((VAR3*1.25+VAR4*1.23+VAR5*1.2+VAR0*0.55+VAR1*0.55+VAR2*0.65)/6,21); \n\
VAR8:=EMA((VAR3*1.3+VAR4*1.3+VAR5*1.3+VAR0*0.68+VAR1*0.68+VAR2*0.68)/6,21); \n\
VAR9:=EMA((VAR6*3+VAR7*2+VAR8)/6*1.738,21); \n\
VAR10:=REF(LOW,1); \n\
VAR11:=SMA(ABS(LOW-VAR10),3,1)/SMA(MAX(LOW-VAR10,0),3,1)*100; \n\
VAR12:=EMA(IFF(CLOSE*1.35<=VAR9,VAR11*10,VAR11/10),3); \n\
VAR13:=LLV(LOW,30); \n\
VAR14:=HHV(VAR12,30); \n\
VAR15:=IFF(MA(CLOSE,58),1,0); \n\
VAR16:=EMA(IFF(LOW<=VAR13,(VAR12+VAR14*2)/2,0),3)/618*VAR15;\n\
\n\
资金入场:IFF(VAR16>0,VAR16,0),LINETHICK,LINETHICK2, COLORFF0000; \n\
\n\
A1:IFF(资金入场>0,资金入场*1.2,0),STICK,LINETHICK5, COLORFF0000;\n\
A2:IFF(资金入场>0,资金入场*0.8,0),STICK,LINETHICK5, COLORFF6600;\n\
A3:IFF(资金入场>0,资金入场*0.6,0),STICK,LINETHICK5, COLORFF9900;\n\
A4:IFF(资金入场>0,资金入场*0.4,0) ,STICK,LINETHICK5,COLORFFCC00;\n\
A5:IFF(资金入场>0,资金入场*0.2,0) ,STICK,LINETHICK5,COLORFFFF00;'
    };

    return data; 
}

JSIndexScript.prototype.FXG_INDEX3=function()
{
    let data =
    {
        Name: '量能黄金点', Description: '量能黄金点', IsMainIndex: false,FloatPrecision:0,
        Args: [],
        Script: //脚本
'A:=IFF((CLOSE>126.32),VOL,VOL); \n\
主力:=MA(A,4),COLORRED;\n\
游资:=MA(A,8),COLORYELLOW;\n\
大户:=MA(A,16),COLORF0F000;\n\
散户:=MA(A,32),COLOR00FF00;\n\
主比:=ABS(((主力)/(主力 + 游资 + 大户 + 散户))*(100)),LINESTICK,COLORRED;\n\
游比:=ABS(((游资)/(主力 + 游资 + 大户 + 散户))*(100)),LINESTICK,COLORYELLOW;\n\
大比:=ABS(((大户)/(主力 + 游资 + 大户 + 散户))*(100)),LINESTICK,COLORF0F000;\n\
散比:=ABS(((散户)/(主力 + 游资 + 大户 + 散户))*(100)),LINESTICK,COLOR00FF00;\n\
警戒线:MA(A,180),COLORFF66FF;\n\
STICKLINE((主力 > 0),0,主力,2.5,0),COLOR1020BB;\n\
STICKLINE((主力 > 0),0,主力,0.7,0),COLORRED;\n\
STICKLINE((游资 > 0),0,游资,2.5,0),COLOR009CFF;\n\
STICKLINE((游资 > 0),0,游资,0.7,0),COLORYELLOW;\n\
STICKLINE((大户 > 0),0,大户,2.5,0),COLORFF8800;\n\
STICKLINE((大户 > 0),0,大户,0.7,0),COLORLIBLUE;\n\
STICKLINE((散户 > 0),0,散户,2.5,0),COLOR00CA00;\n\
STICKLINE((散户 > 0),0,散户,0.7,0),COLORGREEN;'
    };

    return data; 
}


JSIndexScript.prototype.NewsNegative=function()
{
    let data=
        {
            Name: '负面新闻', Description: '负面新闻统计', IsMainIndex: false,FloatPrecision:0,
            Args: [{ Name: 'N', Value: 5 }, { Name: 'N2', Value: 10 }],
            Script: //脚本
'负面:NEWS(1);\n\
MA1:MA(负面,N);\n\
MA2:MA(负面,N2);'
        };

    return data;
}

JSIndexScript.prototype.UpDownAnalyze=function()
{
    let data=
    {
        Name: '涨跌趋势', Description: '涨跌趋势', IsMainIndex: false,FloatPrecision:0, Condition: { Period:[CONDITION_PERIOD.MINUTE_ID,CONDITION_PERIOD.KLINE_DAY_ID] },
        Args: [],
        Script: //脚本
"上涨家数:UPCOUNT('CNA.CI'),COLORRED;\n\
下跌家数:DOWNCOUNT('CNA.CI'),COLORGREEN;"
    };

    return data;
}

JSIndexScript.prototype.VOLRate=function()
{
    let data=
    {
        Name: '量比', Description: '量比', IsMainIndex: false,  Condition: { Period:[CONDITION_PERIOD.MINUTE_ID] },
        Args: [],
        Script: //脚本
            "LIANGBI:VOLR;"
    };

    return data;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//五彩K线

JSIndexScript.prototype.COLOR_KSTAR1=function()
{
    let data=
    {
        Name: '十字星', Description: '十字星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:CLOSE==OPEN&&HIGH>LOW;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_KSTAR2=function()
{
    let data=
    {
        Name: '早晨之星', Description: '早晨之星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:(REF(CLOSE,2)/REF(OPEN,2)<0.95) && (REF(OPEN,1) < REF(CLOSE,2)) && (ABS(REF(OPEN,1)-REF(CLOSE,1))/REF(CLOSE,1)<0.03) && CLOSE/OPEN>1.05 && CLOSE>REF(CLOSE,2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_KSTAR3=function()
{
    let data=
    {
        Name: '黄昏之星', Description: '黄昏之星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:REF(CLOSE,2)/REF(OPEN,2)>1.05 && REF(OPEN,1)>REF(CLOSE,2) && ABS(REF(OPEN,1)-REF(CLOSE,1))/REF(CLOSE,1)<0.03 && CLOSE/OPEN<0.95 && CLOSE<REF(CLOSE,2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SHI1=function()
{
    let data=
    {
        Name: '长十字', Description: '长十字', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:CLOSE==OPEN&&HIGH/LOW>1.03;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K220=function()
{
    let data=
    {
        Name: '身怀六甲', Description: '身怀六甲', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:ABS(REF(CLOSE,1)-REF(OPEN,1))/REF(CLOSE,1)>0.04&&\n\
            ABS(CLOSE-OPEN)/CLOSE<0.005&&\n\
            MAX(CLOSE,OPEN)<MAX(REF(CLOSE,1),REF(OPEN,1))&&\n\
            MIN(CLOSE,OPEN)>MIN(REF(CLOSE,1),REF(OPEN,1));'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K300=function()
{
    let data=
    {
        Name: '三个白武士', Description: '三个白武士', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:UPNDAY(CLOSE,3)&&NDAY(CLOSE,OPEN,3);'
    };

    return data;
}


JSIndexScript.prototype.COLOR_K310=function()
{
    let data=
    {
        Name: '三只乌鸦', Description: '三只乌鸦', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:DOWNNDAY(CLOSE,3)&&NDAY(OPEN,CLOSE,3);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K380=function()
{
    let data=
    {
        Name: '光头阳线', Description: '光头阳线', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:HIGH==CLOSE&&HIGH>LOW;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K390=function()
{
    let data=
    {
        Name: '光脚阴线', Description: '光脚阴线', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:LOW==CLOSE&&HIGH>LOW;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K134=function()
{
    let data=
    {
        Name: '垂死十字', Description: '垂死十字', IsMainIndex: true, InstructionType:2,
        Script: //脚本
            'KSTAR:CLOSE==OPEN&&CLOSE==LOW&&CLOSE<HIGH;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K140=function()
{
    let data=
    {
        Name: '早晨十字星', Description: '早晨十字星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'KSTAR:REF(CLOSE,2)/REF(OPEN,2)<0.95&&\n\
REF(OPEN,1)<REF(CLOSE,2)&&\n\
REF(OPEN,1)==REF(CLOSE,1)&&\n\
CLOSE/OPEN>1.05&&CLOSE>REF(CLOSE,2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K150=function()
{
    let data=
    {
        Name: '黄昏十字星', Description: '黄昏十字星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'KSTAR:REF(CLOSE,2)/REF(OPEN,2)>1.05&&\n\
REF(OPEN,1)>REF(CLOSE,2)&&\n\
REF(OPEN,1)=REF(CLOSE,1)&&\n\
CLOSE/OPEN<0.95&&CLOSE<REF(CLOSE,2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K160=function()
{
    let data=
    {
        Name: '射击之星', Description: '射击之星', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'KSTAR:MIN(OPEN,CLOSE)==LOW&&\n\
HIGH-LOW>3*(MAX(OPEN,CLOSE)-LOW)&&\n\
CLOSE>MA(CLOSE,5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K165=function()
{
    let data=
    {
        Name: '倒转锤头', Description: '倒转锤头', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'KSTAR:MIN(OPEN,CLOSE)==LOW&&\n\
HIGH-LOW>3*(MAX(OPEN,CLOSE)-LOW)&&\n\
CLOSE<MA(CLOSE,5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K170=function()
{
    let data=
    {
        Name: '锤头', Description: '锤头', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'OUT:HIGH==MAX(OPEN,CLOSE)&&\n\
HIGH-LOW>3*(HIGH-MIN(OPEN,CLOSE))&&\n\
CLOSE<MA(CLOSE,5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K180=function()
{
    let data=
    {
        Name: '吊颈', Description: '吊颈', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'OUT:HIGH==MAX(OPEN,CLOSE)&&\n\
HIGH-LOW>3*(HIGH-MIN(OPEN,CLOSE))&&\n\
CLOSE>MA(CLOSE,5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_K190=function()
{
    let data=
    {
        Name: '穿头破脚', Description: '穿头破脚', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'OUT:(REF(CLOSE,1)/REF(OPEN,1)>1.03&&\n\
CLOSE/OPEN<0.96&&\n\
CLOSE<REF(OPEN,1)&&OPEN>REF(CLOSE,1))||\n\
(REF(CLOSE,1)/REF(OPEN,1)<0.97&&\n\
CLOSE/OPEN>1.04&&\n\
CLOSE>REF(OPEN,1)&&OPEN<REF(CLOSE,1));'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SWORD=function()
{
    let data=
    {
        Name: '剑', Description: '剑', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'AA:=VOL>REF(VOL,1)||VOL>(CAPITAL*0.1);\n\
BB:=OPEN>=(REF(HIGH,1))&&REF(HIGH,1)>(REF(HIGH,2)*1.06);\n\
CC:=CLOSE>(REF(CLOSE,1))-(REF(CLOSE,1)*0.01);\n\
DD:=CLOSE<(HIGH*0.965) && HIGH>(OPEN*1.05);\n\
EE:=LOW<OPEN && LOW<CLOSE&&HIGH>(REF(CLOSE,1)*1.06);\n\
FF:=(HIGH-(MAX(OPEN,CLOSE)))/2>(MIN(OPEN,CLOSE))-LOW;\n\
GG:=(ABS(OPEN-CLOSE))/2<(MIN(OPEN,CLOSE)-LOW);\n\
SWORDO:AA&&BB&&CC&&DD&&EE&&FF&&GG;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_CSFR=function()
{
    let data=
    {
        Name: '出水芙蓉', Description: '出水芙蓉', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'A:=CLOSE>OPEN;\n\
B:=A&&CLOSE>MA(CLOSE,S)&&CLOSE>MA(CLOSE,M)&&CLOSE>MA(CLOSE,LL);\n\
CC:=B&&OPEN<MA(CLOSE,M)&&OPEN<MA(CLOSE,LL);\n\
CSFRO:CC&&(CLOSE-OPEN)>0.0618*CLOSE;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_WYGD=function()
{
    let data=
    {
        Name: '乌云盖顶', Description: '乌云盖顶', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( \n\
REF(CLOSE,1)/REF(OPEN,1)>1.03 AND \n\
CLOSE/OPEN<0.97 AND \n\
OPEN>REF(CLOSE,1) AND CLOSE<REF(CLOSE,1), 3);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SGCJ=function()
{
    let data=
    {
        Name: '乌云盖顶', Description: '乌云盖顶', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( \n\
REF(CLOSE,1)/REF(OPEN,1)<0.97 AND \n\
CLOSE/OPEN>1.03 AND \n\
OPEN<REF(CLOSE,1) AND CLOSE>REF(CLOSE,1), 3);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SZTAI=function()
{
    let data=
    {
        Name: '十字胎', Description: '十字胎', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( ABS(REF(CLOSE,1)-REF(OPEN,1))/REF(CLOSE,1) > 0.04 AND \n\
CLOSE==OPEN AND CLOSE < MAX(REF(CLOSE,1),REF(OPEN,1)) AND \n\
CLOSE > MIN(REF(CLOSE,1),REF(OPEN,1)), 2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_PINGDING=function()
{
    let data=
    {
        Name: '平顶', Description: '平顶', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET(ABS(HIGH-REF(HIGH,1))/HIGH<0.001,2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_PINGDI=function()
{
    let data=
    {
        Name: '平底', Description: '平底', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET((ABS(LOW-REF(LOW,1))/LOW<0.001 AND \n\
ABS(REF(LOW,1)-REF(LOW,2))/REF(LOW,1)<=0.001),2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_DAYANZHU=function()
{
    let data=
    {
        Name: '大阳烛', Description: '大阳烛', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:CLOSE/OPEN>1.05 AND HIGH/LOW < CLOSE/OPEN+0.018;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_DAYINGZHU=function()
{
    let data=
    {
        Name: '大阴烛', Description: '大阴烛', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:OPEN/CLOSE > 1.05 AND HIGH/LOW < OPEN/CLOSE+0.018;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_HYFG=function()
{
    let data=
    {
        Name: '好友反攻', Description: '好友反攻', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( (REF(CLOSE,1)<REF(OPEN,1) AND \n\
CLOSE>OPEN AND ABS(CLOSE-REF(CLOSE,1))/CLOSE<0.002),2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_TKQK=function()
{
    let data=
    {
        Name: '跳空缺口', Description: '跳空缺口', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( HIGH<REF(LOW,1) OR LOW>REF(HIGH,1),2);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SFWY=function()
{
    let data=
    {
        Name: '双飞乌鸦', Description: '双飞乌鸦', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( REF(CLOSE,1)<REF(OPEN,1) AND CLOSE<OPEN AND CLOSE/OPEN<0.98,1);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_SSSBQ=function()
{
    let data=
    {
        Name: '上升三部曲', Description: '上升三部曲', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( \n\
REF(CLOSE,4)/REF(OPEN,4)>1.03 AND \n\
REF(CLOSE,3)<REF(OPEN,3) AND \n\
REF(CLOSE,2)<REF(OPEN,2) AND \n\
REF(CLOSE,1)<REF(OPEN,1) AND \n\
REF(LOW,4)<REF(LOW,3) AND \n\
REF(LOW,4)<REF(LOW,2) AND \n\
REF(LOW,4)<REF(LOW,1) AND \n\
REF(HIGH,4)>REF(HIGH,3) AND \n\
REF(HIGH,4)>REF(HIGH,2) AND \n\
REF(HIGH,4)>REF(HIGH,1) AND \n\
CLOSE/OPEN>1.03 AND \n\
CLOSE>REF(CLOSE,4), 5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_XDSBQ=function()
{
    let data=
    {
        Name: '下跌三部曲', Description: '下跌三部曲', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( \n\
REF(CLOSE,4)/REF(OPEN,4)<0.97 AND \n\
REF(CLOSE,3)>REF(OPEN,3) AND \n\
REF(CLOSE,2)>REF(OPEN,2) AND \n\
REF(CLOSE,1)>REF(OPEN,1) AND \n\
REF(LOW,4)<REF(LOW,3) AND \n\
REF(LOW,4)<REF(LOW,2) AND \n\
REF(LOW,4)<REF(LOW,1) AND \n\
REF(HIGH,4)>REF(HIGH,3) AND \n\
REF(HIGH,4)>REF(HIGH,2) AND \n\
REF(HIGH,4)>REF(HIGH,1) AND \n\
CLOSE/OPEN<0.97 AND \n\
CLOSE<REF(CLOSE,4), 5);'
    };

    return data;
}

JSIndexScript.prototype.COLOR_CHXY=function()
{
    let data=
    {
        Name: '长下影', Description: '长下影', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR2:(MIN(CLOSE,OPEN)-LOW)/(HIGH-LOW)>0.667;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_CHSY=function()
{
    let data=
    {
        Name: '长上影', Description: '长上影', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR2:(HIGH-MAX(CLOSE,OPEN))/(HIGH-LOW)>0.667,COLORBLUE;'
    };

    return data;
}

JSIndexScript.prototype.COLOR_FENLI=function()
{
    let data=
    {
        Name: '分离', Description: '分离', IsMainIndex: true, InstructionType:2,
        Script: //脚本
'VAR1:BACKSET( OPEN==REF(OPEN,1) AND (CLOSE-OPEN)*(REF(CLOSE,1)-REF(OPEN,1))<0,2);'
    };

    return data;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//交易系统

JSIndexScript.prototype.TRADE_BIAS = function () 
{
    let data =
    {
        Name: 'BIAS', Description: '乖离率专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 12 }, { Name: 'LL', Value: 6 },{ Name: 'LH', Value: 6 }],
        Script: //脚本
'BIAS:=(CLOSE-MA(CLOSE,N))/MA(CLOSE,N)*100;\n\
ENTERLONG:CROSS(-LL,BIAS);\n\
EXITLONG:CROSS(BIAS,LH);'

    };

    return data;
}

JSIndexScript.prototype.TRADE_CCI = function () 
{
    let data =
    {
        Name: 'CCI', Description: 'CCI专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 14 }],
        Script: //脚本
'TYP:=(HIGH+LOW+CLOSE)/3;\n\
CCI:=(TYP-MA(TYP,N))/(0.015*AVEDEV(TYP,N));\n\
INDEX:=CCI;\n\
ENTERLONG:CROSS(INDEX,-100);\n\
EXITLONG:CROSS(100,INDEX);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_DMI = function () 
{
    let data =
    {
        Name: 'DMI', Description: '趋向专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 14 }],
        Script: //脚本
'MTR:=SUM(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(LOW-REF(CLOSE,1))),N);\n\
HD :=HIGH-REF(HIGH,1);\n\
LD :=REF(LOW,1)-LOW;\n\
PDM:=SUM(IF(HD>0&&HD>LD,HD,0),N);\n\
MDM:=SUM(IF(LD>0&&LD>HD,LD,0),N);\n\
PDI:=PDM*100/MTR;\n\
MDI:=MDM*100/MTR;\n\
ENTERLONG:CROSS(PDI,MDI);\n\
EXITLONG:CROSS(MDI,PDI);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_KD = function () 
{
    let data =
    {
        Name: 'KD', Description: 'KD指标专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 9 },{ Name: 'M1', Value: 3 },{ Name: 'M2', Value: 3 }],
        Script: //脚本
'WRSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
WK:=SMA(WRSV,M1,1);\n\
D:=SMA(WK,M2,1);\n\
ENTERLONG:CROSS(WK,D)&&WK<20;\n\
EXITLONG:CROSS(D,WK)&&WK>80;'
    };

    return data;
}

JSIndexScript.prototype.TRADE_BOLL = function () 
{
    let data =
    {
        Name: 'BOLL', Description: '布林带专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 20 }],
        Script: //脚本
'MID :=MA(CLOSE,N);\n\
UPPER:=MID+2*STD(CLOSE,N);\n\
LOWER:=MID-2*STD(CLOSE,N);\n\
ENTERLONG:CROSS(CLOSE,LOWER);\n\
EXITLONG:CROSS(CLOSE,UPPER);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_KDJ = function () 
{
    let data =
    {
        Name: 'KDJ', Description: 'KDJ专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 9 },{ Name: 'M1', Value: 3 }],
        Script: //脚本
'RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;\n\
K:=SMA(RSV,M1,1);\n\
D:=SMA(K,M1,1);\n\
J:=3*K-2*D;\n\
ENTERLONG:CROSS(J,0);\n\
EXITLONG:CROSS(100,J);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_MA = function () 
{
    let data =
    {
        Name: 'MA', Description: '均线专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'SHORT', Value: 5 },{ Name: 'LONG', Value: 20 }],
        Script: //脚本
'ENTERLONG:CROSS(MA(CLOSE,SHORT),MA(CLOSE,LONG));\n\
EXITLONG:CROSS(MA(CLOSE,LONG),MA(CLOSE,SHORT));'
    };

    return data;
}

JSIndexScript.prototype.TRADE_MACD = function () 
{
    let data =
    {
        Name: 'MACD', Description: 'MACD专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'LONG', Value: 26 }, { Name: 'SHORT', Value: 12 }, { Name: 'M', Value: 9 }],
        Script: //脚本
'DIFF:=EMA(CLOSE,SHORT) - EMA(CLOSE,LONG);\n\
DEA  := EMA(DIFF,M);\n\
MACD := 2*(DIFF-DEA);\n\
ENTERLONG:CROSS(MACD,0);\n\
EXITLONG:CROSS(0,MACD);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_MTM = function () 
{
    let data =
    {
        Name: 'MTM', Description: '动力指标专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 6 }],
        Script: //脚本
'WMTM:=C-REF(C,N);\n\
ENTERLONG:CROSS(WMTM,0);\n\
EXITLONG:CROSS(0,WMTM);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_PSY = function () 
{
    let data =
    {
        Name: 'PSY', Description: 'PSY心理线专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 12 },{ Name: 'LL', Value: 10 },{ Name: 'LH', Value: 85 }],
        Script: //脚本
'MYPSY:=COUNT(CLOSE>REF(CLOSE,1),N)/N*100;\n\
ENTERLONG:CROSS(LL,MYPSY);\n\
EXITLONG:CROSS(MYPSY,LH);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_ROC = function () 
{
    let data =
    {
        Name: 'ROC', Description: '变动速率专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 12 },{ Name: 'M', Value: 6 }],
        Script: //脚本
'WROC:=MA(100*(CLOSE-REF(CLOSE,N))/REF(CLOSE,N),M);\n\
ENTERLONG:CROSS(WROC,0);\n\
EXITLONG:CROSS(0,WROC);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_RSI = function () 
{
    let data =
    {
        Name: 'RSI', Description: '相对强弱专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 6 },{ Name: 'LL', Value: 20 },{ Name: 'LH', Value: 80 }],
        Script: //脚本
'LC:=REF(CLOSE,1);\n\
WRSI:=SMA(MAX(CLOSE-LC,0),N,1)/SMA(ABS(CLOSE-LC),N,1)*100;\n\
ENTERLONG:CROSS(WRSI,LL);\n\
EXITLONG:CROSS(LH,WRSI);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_VR = function () 
{
    let data =
    {
        Name: 'VR', Description: 'VR容量比率专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N', Value: 26 },{ Name: 'LL', Value: 70 },{ Name: 'LH', Value: 250 }],
        Script: //脚本
'WVR := SUM((IF(CLOSE>OPEN,VOL,0)+IF(CLOSE=OPEN,VOL/2,0)),N)/SUM((IF(CLOSE<OPEN,VOL,0)+IF(CLOSE=OPEN,VOL/2,0)),N)*100;\n\
ENTERLONG:CROSS(LL,WVR);\n\
EXITLONG:CROSS(WVR,LH);'
    };

    return data;
}

JSIndexScript.prototype.TRADE_DPSJ = function () 
{
    let data =
    {
        Name: 'DPSJ', Description: '大盘随机专家系统', IsMainIndex: true, InstructionType:1,
        Args: [{ Name: 'N1', Value: 18 },{ Name: 'N2', Value: 12 }],
        Script: //脚本
'RSV:=(INDEXC-LLV(INDEXL,N1))/(HHV(INDEXH,N1)-LLV(INDEXL,N1))*100;\n\
K:=SMA(RSV,N2,1);\n\
HSL:VOL/100/(FINANCE(7));\n\
ENTERLONG: CROSS(K,20);\n\
EXITLONG: (CROSS(HSL,5) OR CROSS(K,80));'
    };

    return data;
}


JSIndexScript.prototype.Zealink_Index1 = function () 
{
    let data =
    {
        Name: '资金吸筹', Description: '资金吸筹', IsMainIndex: false,
        Args: [],
        Script: //脚本
'VAR1:=REF((LOW+OPEN+CLOSE+HIGH)/4,1);  \n\
VAR2:= SMA(ABS(LOW - VAR1), 13, 1) / SMA(MAX(LOW - VAR1, 0), 10, 1);\n\
VAR3:= EMA(VAR2, 10);\n\
VAR4:= LLV(LOW, 33);\n\
VAR5:= EMA(IF(LOW <= VAR4, VAR3, 0), 3) * 0.2;\n\
主力进场: IF(VAR5 > REF(VAR5, 1), VAR5,0), COLORRED, NODRAW;\n\
洗盘: IF(VAR5 < REF(VAR5, 1),  VAR5,0), COLORYELLOW, NODRAW;\n\
STICKLINE(VAR5> REF(VAR5, 1),0, VAR5, 20, 0), COLORRED;\n\
STICKLINE(VAR5 < REF(VAR5, 1), 0, VAR5, 20, 0), COLORYELLOW;'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index2 = function () 
{
    let data =
    {
        Name: '牛熊区间', Description: '牛熊区间', IsMainIndex: false,YSpecificMaxMin:{Max:100,Min:1,Count:4},YSplitScale:[1,50,100],
        Args: [],
        Script: //脚本
'短高H:=(20*H+19*REF(H,1)+18*REF(H,2)+17*REF(H,3)+16*REF(H,4)+15*REF(H,5)+14*REF(H,6)\n\
+ 13 * REF(H, 7) + 12 * REF(H, 8) + 11 * REF(H, 9) + 10 * REF(H, 10) + 9 * REF(H, 11) + 8 * REF(H, 12)\n\
+ 7 * REF(H, 13) + 6 * REF(H, 14) + 5 * REF(H, 15) + 4 * REF(H, 16) + 3 * REF(H, 17) + 2 * REF(H, 18) +\n\
REF(H, 20))/ 210, COLORBLUE, LINETHICK1;\n\
短低L:= (20 * L + 19 * REF(L, 1) + 18 * REF(L, 2) + 17 * REF(L, 3) + 16 * REF(L, 4) + 15 * REF(L, 5) + 14 * REF(L, 6)\n\
+ 13 * REF(L, 7) + 12 * REF(L, 8) + 11 * REF(L, 9) + 10 * REF(L, 10) + 9 * REF(L, 11) + 8 * REF(L, 12)\n\
+ 7 * REF(L, 13) + 6 * REF(L, 14) + 5 * REF(L, 15) + 4 * REF(L, 16) + 3 * REF(L, 17) + 2 * REF(L, 18) +\n\
REF(L, 20)) / 210, COLORBLUE, LINETHICK1;\n\
D90H:= EMA(短高H, 90), COLORRED, LINETHICK1;\n\
D90L:= EMA(短低L, 90), COLORRED, LINETHICK1;\n\
D90差:= D90H - D90L;\n\
D90顶:= D90H + D90差 * 2, COLORRED, LINETHICK1;\n\
D90底:= D90L - D90差 * 2, COLORRED, LINETHICK1;\n\
高0:= (EMA(EMA(H, 25), 25) - EMA(EMA(L, 25), 25)) * 1 + EMA(EMA(H, 25), 25), LINETHICK1, COLORWHITE;\n\
低0:= EMA(EMA(L, 25), 25) - (EMA(EMA(H, 25), 25) - EMA(EMA(L, 25), 25)) * 1, LINETHICK1, COLORWHITE;\n\
多头定位:= 低0 >= D90底 AND 高0 >= D90顶;\n\
空头定位:= 高0 <= D90顶 AND 低0 <= D90底;\n\
震荡定位:= 低0 >= D90底 AND 高0 <= D90顶;\n\
牛市: IF(多头定位 == 1, 100, 1), COLORRED, NODRAW;\n\
熊市: IF(空头定位 == 1, 100, 1), COLORGREEN, NODRAW;\n\
震荡: IF(震荡定位 == 1, 100, 1), COLORGRAY, NODRAW;\n\
STICKLINE(多头定位 == 1, 100, 1, 100, 0), COLORRED;\n\
STICKLINE(空头定位 == 1, 100, 1, 100, 0), COLORGREEN;\n\
STICKLINE(震荡定位 == 1, 100, 1, 100, 0), COLORGRAY;'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index3 = function () 
{
    let data =
    {
        Name: '持仓信号', Description: '持仓信号', IsMainIndex: true,
        Args: [],
        Script: //脚本
'买线:=EMA(C,2);\n\
卖线:=EMA(SLOPE(C,30)*5+C,20); \n\
BU:=CROSS(买线,卖线);\n\
SEL:=CROSS(卖线,买线);\n\
\n\
STICKLINE(买线>=卖线 AND CLOSE>OPEN,LOW,HIGH,0,1),COLORRED;\n\
STICKLINE(买线>=卖线 AND CLOSE<OPEN,LOW,HIGH,0,1),COLORRED;\n\
STICKLINE(买线>=卖线 AND CLOSE>OPEN,CLOSE,OPEN,50,1),COLORRED;\n\
STICKLINE(买线>=卖线 AND CLOSE<OPEN,CLOSE,OPEN,50,0),COLORRED;\n\
STICKLINE(买线<卖线 AND CLOSE<OPEN,LOW,HIGH,0,1),COLORGREEN;\n\
STICKLINE(买线<卖线 AND CLOSE>OPEN,LOW,HIGH,0,1),COLORGREEN;\n\
STICKLINE(买线<卖线 AND CLOSE<OPEN,CLOSE,OPEN,50,0),COLORGREEN;\n\
STICKLINE(买线<卖线 AND CLOSE>OPEN,CLOSE,OPEN,50,1),COLORGREEN;\n\
\n\
HHJSJDA:=(3*CLOSE+OPEN+LOW+HIGH)/6;\n\
HHJSJDB:(19*HHJSJDA+19*REF(HHJSJDA,1)+18*REF(HHJSJDA,2)+17*REF(HHJSJDA,3)+16*REF(HHJSJDA,4)+15*REF(HHJSJDA,5)+14*REF(HHJSJDA,6)\n\
+13*REF(HHJSJDA,7)+12*REF(HHJSJDA,8)+11*REF(HHJSJDA,9)+10*REF(HHJSJDA,10)+9*REF(HHJSJDA,11)+8*REF(HHJSJDA,12)+7*REF(HHJSJDA,13)+6*REF(HHJSJDA,14)+5*REF(HHJSJDA,15)+4*REF(HHJSJDA,16)+3*REF(HHJSJDA,17)+2*REF\n\
(HHJSJDA,20)+REF(HHJSJDA,19))/210,COLORYELLOW;\n\
HHJSJDC:MA(HHJSJDB,5),COLORRED;\n\
\n\
SVAR11:=HHV(HIGH,34);\n\
SVAR14:=CLOSE-REF(CLOSE,1);\n\
SVAR15:=MAX(SVAR14,0);\n\
SVAR16:=ABS(SVAR14);\n\
SVAR17:=SMA(SVAR15,7,1)/SMA(SVAR16,7,1)*100;\n\
SVAR18:=SMA(SVAR15,13,1)/SMA(SVAR16,13,1)*100;\n\
SVAR19:=BARSCOUNT(CLOSE);\n\
SVAR20:=SMA(MAX(SVAR14,0),6,1)/SMA(ABS(SVAR14),6,1)*100;\n\
SVAR21:=(-200)*(HHV(HIGH,60)-CLOSE)/(HHV(HIGH,60)-LLV(LOW,60))+100;\n\
SVAR1A:=(CLOSE-LLV(LOW,15))/(HHV(HIGH,15)-LLV(LOW,15))*100;\n\
SVAR1B:=SMA((SMA(SVAR1A,4,1)-50)*2,3,1);\n\
SVAR1C:=(INDEXC-LLV(INDEXL,14))/(HHV(INDEXH,14)-LLV(INDEXL,14))*100;\n\
SVAR1D:=SMA(SVAR1C,4,1);\n\
SVAR1E:=SMA(SVAR1D,3,1);\n\
SVAR1F:=(HHV(HIGH,30)-CLOSE)/CLOSE*100;\n\
SVAR22:=SVAR20<=25 AND SVAR21<-95 AND SVAR1F>20 AND SVAR1B<-30 AND SVAR1E<30 AND SVAR11-CLOSE>=-0.25 AND SVAR17<22 AND SVAR18<28 AND SVAR19>50;\n\
BUY3:=CROSS(SVAR22,0.5) AND COUNT(SVAR22==1,10)==1;\n\
\n\
SVARF:=LOW*0.9;\n\
SVAR10X:=100-3*SMA((OPEN-LLV(LOW,75))/(HHV(HIGH,75)-LLV(LOW,75))*100,20,1)+2*SMA(SMA((OPEN-LLV(LOW,75))/(HHV(HIGH,75)-LLV(LOW,75))*100,20,1),15,1);\n\
SVAR11X:=SVARF<REF(SVAR10X,1) AND VOL>REF(VOL,1) AND CLOSE>REF(CLOSE,1);\n\
BUY2:=SVAR11X AND COUNT(SVAR11X,30)==1;\n\
\n\
VAR1:=(CLOSE+HIGH+LOW+OPEN)/4;\n\
VAR2:=SUMBARS(VOL,CAPITAL);\n\
VAR3:=HHV(VAR1,VAR2);\n\
VAR4:=LLV(VAR1,VAR2);\n\
VAR5:=(2*VAR1-VAR4-REF(VAR4,1))/(VAR3-VAR4);\n\
VAR6:=(VAR1-VAR4)/(VAR3-VAR4);\n\
VAR7:=IF(VAR1<=VAR4,VAR5*60,VAR6*60);\n\
VAR8:=600*(EMA(CLOSE,3)-EMA(LOW,30))/EMA(LOW,30);\n\
VAR9:=EMA(VAR8,7);\n\
VARC:=HHV(HIGH,9)-LLV(LOW,9);\n\
VARD:=HHV(HIGH,9)-CLOSE;\n\
VARE:=CLOSE-LLV(LOW,9);\n\
VARF:=VARD/VARC*100-70;\n\
VAR10:=(CLOSE-LLV(LOW,60))/(HHV(HIGH,60)-LLV(LOW,60))*100;\n\
VAR11:=(2*CLOSE+HIGH+LOW)/4;\n\
VAR12:=SMA(VARE/VARC*100,3,1);\n\
VAR13:=LLV(LOW,34);\n\
VAR14:=SMA(VAR12,3,1)-SMA(VARF,9,1);\n\
VAR15:=IF(VAR14>100,VAR14-100,0);\n\
VAR16:=HHV(HIGH,34);\n\
VAR17:=EMA((VAR11-VAR13)/(VAR16-VAR13)*100,8);\n\
VAR18:=EMA(VAR17,5);\n\
BUY:=STICKLINE(VAR17-VAR18>0,VAR17,VAR18,8,1),COLORRED;\n\
SELL:=STICKLINE(VAR17-VAR18<0,VAR17,VAR18,8,1),COLORGREEN;\n\
BUY1:=VAR17>VAR18 AND REF(VAR17,1)<REF(VAR18,1);\n\
SELL1:=VAR17<VAR18 AND REF(VAR17,1)>REF(VAR18,1);\n\
\n\
短高H:=(20*H+19*REF(H,1)+18*REF(H,2)+17*REF(H,3)+16*REF(H,4)+15*REF(H,5)+14*REF(H,6)\n\
+13*REF(H,7)+12*REF(H,8)+11*REF(H,9)+10*REF(H,10)+9*REF(H,11)+8*REF(H,12)\n\
+7*REF(H,13)+6*REF(H,14)+5*REF(H,15)+4*REF(H,16)+3*REF(H,17)+2*REF(H,18)+\n\
REF(H,20))/210,COLORBLUE,LINETHICK1;\n\
短低L:=(20*L+19*REF(L,1)+18*REF(L,2)+17*REF(L,3)+16*REF(L,4)+15*REF(L,5)+14*REF(L,6)\n\
+13*REF(L,7)+12*REF(L,8)+11*REF(L,9)+10*REF(L,10)+9*REF(L,11)+8*REF(L,12)\n\
+7*REF(L,13)+6*REF(L,14)+5*REF(L,15)+4*REF(L,16)+3*REF(L,17)+2*REF(L,18)+\n\
REF(L,20))/210,COLORBLUE,LINETHICK1;\n\
D90H:=EMA(短高H,90),COLORRED,LINETHICK1;\n\
D90L:=EMA(短低L,90),COLORRED,LINETHICK1;\n\
D90差:=D90H-D90L;\n\
D90顶:=D90H+D90差*2,COLORRED,LINETHICK1;\n\
D90底:=D90L-D90差*2,COLORRED,LINETHICK1;\n\
高0:=(EMA(EMA(H,25),25)-EMA(EMA(L,25),25))*1+EMA(EMA(H,25),25),LINETHICK1,COLORWHITE;\n\
低0:=EMA(EMA(L,25),25)-(EMA(EMA(H,25),25)-EMA(EMA(L,25),25))*1,LINETHICK1,COLORWHITE;\n\
多头定位:=低0>=D90底 AND 高0>=D90顶;\n\
空头定位:=高0<=D90顶 AND 低0<=D90底;\n\
震荡定位:=低0>=D90底 AND 高0<=D90顶;\n\
\n\
牛市:=多头定位==1;\n\
熊市:=空头定位==1;\n\
震荡:=震荡定位==1;\n\
\n\
非牛市:=熊市 OR 震荡;\n\
非熊市:=牛市 OR 震荡;\n\
\n\
BUY11:=BUY1 AND 非熊市;\n\
SELL11:=SELL1 AND 震荡定位==0;\n\
\n\
BUY111:=BUY11 AND COUNT(BUY11,10)<2;\n\
BUY0:=BUY111 AND COUNT(BUY111,21)==1;\n\
SELL111:=SELL11 AND COUNT(SELL11,10)<2;\n\
SELL0:=SELL111 AND COUNT(SELL111,10)==1;\n\
\n\
XK1:=EMA(100*(CLOSE-LLV(LOW,34))/(HHV(HIGH,34)-LLV(LOW,34)),3)/4;\n\
上穿:=REF(XK1,1)<5 AND XK1>=5;\n\
BUY4:=上穿 AND COUNT(XK1<2,12)<1;\n\
\n\
SELL2:=REF(XK1,1)<=22.5 AND XK1>22.5 AND COUNT(REF(XK1,1)>=22.5 AND XK1<22.5,5)>0;\n\
SELL3:=REF(XK1,1)>=21.5 AND XK1<21.5 AND COUNT(REF(XK1,1)>=22.5 AND XK1<22.5,12)>1;\n\
SELL4:=SELL2 OR SELL3 AND COUNT((SELL2 OR SELL3)==1,5)==1;\n\
\n\
SUPERDRAWTEXT(BUY0,L,"机会",2,10),COLORRED;\n\
SUPERDRAWTEXT(SELL0,H,"风险",1,10),COLORGREEN;\n\
SUPERDRAWTEXT(BUY2,L,"机会",2,10),COLORRED;\n\
SUPERDRAWTEXT(BUY4,L,"机会",2,10),COLORRED;\n\
SUPERDRAWTEXT(SELL4,H,"风险",1,10),COLORGREEN;'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index4 = function () 
{
    let data =
    {
        Name: '股东实际增减持', Description: '股东实际增减持', IsMainIndex: false, FloatPrecision:0,
        Args: [],
        Script: //脚本
'增持:NEWS(4),NODRAW,COLORRED;\n\
减持:NEWS(5),NODRAW,COLORGREEN;\n\
STICKLINE(增持>0,0,增持,1,0),COLORRED;\n\
STICKLINE(减持<0,0,减持,1,0),COLORGREEN;'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index5 = function () 
{
    let data =
    {
        Name: '大宗交易', Description: '大宗交易', IsMainIndex: false, FloatPrecision: 0,
        Args: [],
        Script: //脚本
            '交易次数:NEWS(7);'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index6 = function () 
{
    let data =
    {
        Name: '信托持股', Description: '信托持股', IsMainIndex: false, FloatPrecision: 0,
        Args: [],
        Script: //脚本
            '家数:NEWS(6);'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index7 = function () 
{
    let data =
    {
        Name: '官网新闻', Description: '官网新闻', IsMainIndex: false, FloatPrecision: 0,
        Args: [],
        Script: //脚本
            '个数:NEWS(8);'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index8 = function () 
{
    let data =
    {
        Name: '高管要闻', Description: '高管要闻', IsMainIndex: false, FloatPrecision: 0,
        Args: [],
        Script: //脚本
            '个数:NEWS(9);'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index9 = function () 
{
    let data =
    {
        Name: '股权质押', Description: '股权质押', IsMainIndex: false, FloatPrecision: 0,
        Args: [],
        Script: //脚本
            '次数:NEWS(10);'
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index10 = function () 
{
    let data =
    {
        Name: '操盘BS点', Description: '操盘BS点', IsMainIndex: true, FloatPrecision: 0,
        Args: [],
        Script: //脚本
"JJ:=(CLOSE+HIGH+LOW)/3; \n\
A:=EMA(JJ,10); \n\
B:=REF(A,1);\n\
M1:=EMA(CLOSE,3);\n\
M2:=EMA(CLOSE,8); \n\
M3:=EMA(M2,13); \n\
M4:=EMA(M2,55); \n\
B1:=A>B AND REF(A,1)<REF(B,1);\n\
S1:=A<B AND REF(A,1)>REF(B,1);\n\
INDEXCLOSE:INDEXC,EXDATA;\n\
INDEXOPEN:INDEXO,EXDATA;\n\
DRAWICON(REF(B1,1),L*0.97,13);\n\
DRAWICON(REF(S1,1),H*1.03,14);"
    };

    return data;
}

JSIndexScript.prototype.Zealink_Index11 = function () 
{
    let data =
    {
        Name: '操盘BS点', Description: '操盘BS点', IsMainIndex: true, FloatPrecision: 0,
        Args: [],
        Script: //脚本
"JJ:=(CLOSE+HIGH+LOW)/3;\n\
A:=EMA(JJ,10);\n\
B:=REF(A,1);\n\
M1:=EMA(CLOSE,3);\n\
M2:=EMA(CLOSE,8); \n\
M3:=EMA(M2,13);\n\
M4:=EMA(M2,55);\n\
持股区域:=STICKLINE(A>B,A,B,2,0),COLORYELLOW; \n\
持币区域:=STICKLINE(A<B,A,B,2,0),COLORBLUE;\n\
\n\
VR1:=(C+O+REF(C,1))/3;\n\
VR3:=HHV(VR1,21);\n\
VR4:=LLV(VR1,21);\n\
VR5:=(2*VR1-VR4-REF(VR4,1))/(VR3-VR4);\n\
VR6:=(VR1-VR4)/(VR3-VR4);\n\
VR7:=IF(VR1<=VR4,VR5*60,VR6*60);\n\
VR8:=600*(EMA(C,3)-EMA(L,30))/EMA(L,30);\n\
VR9:=EMA(VR8,7);\n\
VRA:=(WINNER(120*C/100)-WINNER(100*C/100))*100;\n\
VRB:=(-100)*(WINNER(120*C/100)-WINNER(100*C/100))+5;\n\
VRC:=HHV(H,9)-LLV(L,9);\n\
VRD:=HHV(H,9)-C;\n\
VRE:=C-LLV(L,9);\n\
VRF:=VRD/VRC*100-70;\n\
VR10:=(C-LLV(L,60))/(HHV(H,60)-LLV(L,60))*100;\n\
VR11:=(2*C+H+L)/4;\n\
VR12:=SMA(VRE/VRC*100,3,1);\n\
VR13:=LLV(L,34);\n\
VR14:=SMA(VR12,3,1)-SMA(VRF,9,1);\n\
VR15:=IF(VR14>100,VR14-100,0);\n\
VR16:=HHV(H,34);\n\
VR17:=EMA((VR11-VR13)/(VR16-VR13)*100,8);\n\
VR18:=EMA(VR17,5);\n\
\n\
B1:=A>B AND REF(A,1)<REF(B,1);\n\
S1:=A<B AND REF(A,1)>REF(B,1);\n\
\n\
B9:=BARSLAST(REF(B1,1) AND (REF(VR17>VR18,1) OR MIN(VR17,VR18)>REF(MAX(VR17,VR18),1)));\n\
S9:=BARSLAST(REF(S1,1) AND (REF(VR17<VR18,1) OR MAX(VR17,VR18)<REF(MIN(VR17,VR18),1)));\n\
\n\
DRAWICON(REF(B1,1) AND (REF(VR17>VR18,1) OR MIN(VR17,VR18)>REF(MAX(VR17,VR18),1)) AND REF(B9,2)>=S9,L*0.97,13);\n\
DRAWICON(REF(S1,1) AND (REF(VR17<VR18,1) OR MAX(VR17,VR18)<REF(MIN(VR17,VR18),1)) AND REF(S9,1)>=B9,H*1.03,14);\n\
\n\
DRAWKLINE_IF(VR17>VR18,HIGH,CLOSE,LOW,OPEN),COLORRED;\n\
DRAWKLINE_IF(VR17<VR18,HIGH,CLOSE,LOW,OPEN),COLORBLUE;\n\
\n\
INDEXCLOSE:INDEXC,EXDATA;		//取指数的收盘价 回测的时候计算BATE系数用 "
    };

    return data;
}




JSIndexScript.prototype.TEST = function () 
{
    let data =
        {
            Name: 'TEST', Description: '测试脚本', IsMainIndex: false,
            Args: [{ Name: 'N', Value: 10 }],
            Script: //脚本
                'VAR2:C,STICK,LINETHICK5;'
        };

    return data;
}

export default {
    JSIndexScript:JSIndexScript
}

