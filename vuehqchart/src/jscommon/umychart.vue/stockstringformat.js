function StockStringFormat(){}
//字符串格式化 千分位分割
StockStringFormat.FormatValueThousandsString=function(value,floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    var result='';
    var num=value.toFixed(floatPrecision);
    if(floatPrecision>0){
        var numFloat = num.split('.')[1];
        var numM = num.split('.')[0];
        var numMa = Number(numM);
        var isLowZero = null;
        if(numMa < 0){
            numMa = Math.abs(numMa);
            isLowZero = true;
        }
        numMa = numMa.toString();
        while (numMa.length > 3)
        {
            result = ',' + numMa.slice(-3) + result;
            numMa = numMa.slice(0, numMa.length - 3);
        }
        if (numMa) { result = isLowZero != null ? ('-' + numMa + result + '.' + numFloat) : (numMa + result + '.' + numFloat); }
    }else{
        var numNF = Number(num);
        var isLowZero = null;
        if(numNF < 0){
            numNF = Math.abs(numNF);
            isLowZero = true;
        }
        numNF = numNF.toString();
        while (numNF.length > 3)
        {
            result = ',' + numNF.slice(-3) + result;
            numNF = numNF.slice(0, numNF.length - 3);
        }
        if (numNF) { result = isLowZero != null ? ('-' + numNF + result) : (numNF + result); }
    }
    
    return result;
}

//数据输出格式化 floatPrecision=小数位数
StockStringFormat.FormatValueString=function(value, floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    if (value<0.00000000001 && value>-0.00000000001)
    {
        return "0";
    }

    var absValue = Math.abs(value);
    if (absValue < 10000)
    {
        return value.toFixed(floatPrecision);
    }
    else if (absValue < 100000000)
    {
        return (value/10000).toFixed(floatPrecision)+"万";
    }
    else if (absValue < 1000000000000)
    {
        return (value/100000000).toFixed(floatPrecision)+"亿";
    }
    else
    {
        return (value/1000000000000).toFixed(floatPrecision)+"万亿";
    }

    return TRUE;
}

StockStringFormat.NumberToString=function(value)
{
    if (value<10) return '0'+value.toString();
    return value.toString();
}

StockStringFormat.FormatDateString=function(value,format)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var day=value%100;

    switch(format)
    {
        case 'MM-DD':
            return StockStringFormat.NumberToString(month) + '-' + StockStringFormat.NumberToString(day);
        default:
            return year.toString() + '-' + StockStringFormat.NumberToString(month) + '-' + StockStringFormat.NumberToString(day);
    }
}

StockStringFormat.FormatTimeString=function(value)
{
    if (value<10000)
    {
        var hour=parseInt(value/100);
        var minute=value%100;
        return StockStringFormat.NumberToString(hour)+':'+ StockStringFormat.NumberToString(minute);
    }
    else
    {
        var hour=parseInt(value/10000);
        var minute=parseInt((value%10000)/100);
        var second=value%100;
        return StockStringFormat.NumberToString(hour)+':'+ StockStringFormat.NumberToString(minute) + ':' + StockStringFormat.NumberToString(second);
    }
}

//报告格式化
StockStringFormat.FormatReportDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var monthText;
    switch(month)
    {
        case 3:
            monthText="一季度报";
            break;
        case 6:
            monthText="半年报";
            break;
        case 9:
            monthText="三季度报";
            break;
        case 12:
            monthText="年报";
            break;
    }

    return year.toString()+ monthText;
}

StockStringFormat.FormatDateTimeString=function(value,isShowDate)
{
    var aryValue=value.split(' ');
    if (aryValue.length<2) return "";
    var time=parseInt(aryValue[1]);
    var minute=time%100;
    var hour=parseInt(time/100);
    var text=(hour<10? ('0'+hour.toString()):hour.toString()) + ':' + (minute<10?('0'+minute.toString()):minute.toString());

    if (isShowDate==true)
    {
        var date=parseInt(aryValue[0]);
        var year=parseInt(date/10000);
        var month=parseInt(date%10000/100);
        var day=date%100;
        text=year.toString() +'-'+ (month<10? ('0'+month.toString()) :month.toString()) +'-'+ (day<10? ('0'+day.toString()):day.toString()) +" " +text;
    }

    return text;
}

//字段颜色格式化
StockStringFormat.FormatValueColor = function (value, value2) 
{
    if (value != null && value2 == null)  //只传一个值的 就判断value正负
    {
        if (value == 0) return 'PriceNull';
        else if (value > 0) return 'PriceUp';
        else return 'PriceDown';
    }

    //2个数值对比 返回颜色
    if (value == null || value2 == null) return 'PriceNull';
    if (value == value2) return 'PriceNull';
    else if (value > value2) return 'PriceUp';
    else return 'PriceDown';
}

StockStringFormat.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//判断是否是正数
StockStringFormat.IsPlusNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return value>0;
}

//判断字段是否存在
StockStringFormat.IsObjectExist=function(obj)
{
    if (obj===undefined) return false;
    if (obj==null) return false;
    
    return true;
}

StockStringFormat.Guid = function()
{
    function S4()
    {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


export default{
    StockStringFormat:StockStringFormat
}