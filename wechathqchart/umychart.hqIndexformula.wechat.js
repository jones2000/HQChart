/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    指标计算方法 2.0 版本使用的算法
*/

function HQIndexFormula()
{

}

//指数平均数指标 EMA(close,10)
HQIndexFormula.EMA=function(data,dayCount)
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

HQIndexFormula.SMA=function(data,n,m)
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
HQIndexFormula.DMA=function(data,data2)
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


HQIndexFormula.HHV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var max=-10000;
    for(var i=n,j=0;i<data.length;++i,++j)
    {
        if(i<n+max)
        {
            max=data[i]<data[max]?max:i;
        }
        else
        {
            for(j=(max=i-n+1)+1;j<=i;++j)
            {
                if(data[j]>data[max])
                    max = j;
            }
        }

        result[i] = data[max];
    }

    return result;
}

HQIndexFormula.LLV=function(data,n)
{
    var result = [];
    if (n>data.length) return result;

    var min=-10000;

    for(var i=n;i<data.length;++i,++j)
    {
        if(i<n+min)
        {
            min=data[i]>data[min]?min:i;
        }
        else
        {
            for(var j=(min=i-n+1)+1;j<=i;++j)
            {
                if(data[j]<data[min])
                    min = j;
            }
        }
        result[i] = data[min];
    }

    return result;
}

HQIndexFormula.REF=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;
    if (n>=data.length) return result;

    result=data.slice(0,data.length-n);

    for(var i=0;i<n;++i)
        result.unshift(null);

    return result;
}

HQIndexFormula.REFDATE=function(data,n)
{
    var result=[];

    if (data.length<=0) return result;

    //暂时写死取最后一个
    n=data.length-1;
    for(var i in data)
    {
        result[i]=data[n];
    }

    return result;
}



HQIndexFormula.SUM=function(data,n)
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

//两个数组相减
HQIndexFormula.ARRAY_SUBTRACT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null || isNaN(data[i]))
                result[i]=null;
            else
                result[i]=data[i]-data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=data[i]-data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data>=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_GTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]>=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]>=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LT=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data<=data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_LTE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]<=data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=data[i]<=data2[i] ? 1:0;
            else
                result[i]=null;
        }
    }

    return result;
}

//数组 data==data2比较 返回 0/1 数组
HQIndexFormula.ARRAY_EQ=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i]==data2 ? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i]==data2[i] ? 1:0);
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.ARRAY_IF=function(data,trueData,falseData)
{
    var result=[];
    var IsNumber=[typeof(trueData)=="number",typeof(falseData)=="number"];
    for(var i in data)
    {
        if (data[i])
        {
            if (IsNumber[0]) result[i]=trueData;
            else result[i]=trueData[i];
        }
        else
        {
            if (IsNumber[1]) result[i]=falseData;
            else result[i]=falseData[i];
        }
    }

    return result;
}

HQIndexFormula.ARRAY_AND=function(data,data2)
{
   var result=[];
    var IsNumber=typeof(trueData)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] && data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
                result[i]=(data[i] && data2[i] ? 1:0);
            else
                result[i]=0;
        }
    }

    return result;
}
HQIndexFormula.ARRAY_OR=function(data, data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=(data[i] || data2? 1:0);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length)

        for(var i=0;i<count;++i)
        {
            if (i < data.length && data[i])
            {
                result[i] = 1;
                continue;
            }
            if (i < data2.length && data2[i])
            {
                result[i] = 1;
                continue;
            }
            result[i] = 0;    
        }
    }

    return result;
}
//数组相乘
//支持多个参数累乘 如:HQIndexFormula.ARRAY_MULTIPLY(data,data2,data3,data3) =data*data2*data3*data4
HQIndexFormula.ARRAY_MULTIPLY=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                if (data[i]==null || isNaN(data[i]))
                    result[i]=null;
                else
                    result[i]=data[i]*data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                    result[i]=data[i]*data2[i];
                else
                    result[i]=null;
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_MULTIPLY(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_MULTIPLY(result,arguments[i]);
    }

    return result;
}

//数组相除
HQIndexFormula.ARRAY_DIVIDE=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            result[i]=data[i]/data2;
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if(data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i]))
                    result[i]=null;
                else if (data2[i]==0)
                    result[i]=null;
                else
                    result[i]=data[i]/data2[i];
            }
            else
                result[i]=null;
        }
    }

    return result;
}

//数组相加
//支持多个参数累加 如:HQIndexFormula.ARRAY_ADD(data,data2,data3,data3) =data+data2+data3+data4
HQIndexFormula.ARRAY_ADD=function(data,data2)
{
    if (arguments.length==2)
    {
        var result=[];
        var IsNumber=typeof(data2)=="number";
        if (IsNumber)
        {
            for(var i in data)
            {
                result[i]=data[i]+data2;
            }
        }
        else
        {
            var count=Math.max(data.length,data2.length);
            for(var i=0;i<count;++i)
            {
                if (i<data.length && i<data2.length)
                {
                    if (data[i]==null || data2[i]==null || isNaN(data[i]) || isNaN(data2[i])) result[i]=null
                    else result[i]=data[i]+data2[i];
                }
                else
                {
                    result[i]=null;
                }
            }
        }

        return result;
    }

    var result=HQIndexFormula.ARRAY_ADD(arguments[0],arguments[1]);

    for(var i=2;i<arguments.length;++i)
    {
        result=HQIndexFormula.ARRAY_ADD(result,arguments[i]);
    }

    return result;
}

HQIndexFormula.MAX=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.max(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.max(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}

HQIndexFormula.MIN=function(data,data2)
{
    var result=[];
    var IsNumber=typeof(data2)=="number";
    if (IsNumber)
    {
        for(var i in data)
        {
            if (data[i]==null) result[i]=null;
            else result[i]=Math.min(data[i],data2);
        }
    }
    else
    {
        var count=Math.max(data.length,data2.length);
        for(var i=0;i<count;++i)
        {
            if (i<data.length && i<data2.length)
            {
                if (data[i]==null || data2[i]==null) result[i]=null;
                else result[i]=Math.min(data[i],data2[i]);
            }
            else
                result[i]=null;
        }
    }

    return result;
}


HQIndexFormula.ABS=function(data)
{
    var result=[];
    for(var i in data)
    {
        if (data[i]==null) result[i]=null;
        else result[i]=Math.abs(data[i]);
    }

    return result;
}


HQIndexFormula.MA=function(data,dayCount)
{
    var result=[];

    for (var i = 0, len = data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += data[i - j];
        }
        result[i]=sum / dayCount;
    }
    return result;
}

/*
    加权移动平均
    返回加权移动平均
    用法:EXPMA(X,M):X的M日加权移动平均
    EXPMA[i]=buffer[i]*para+(1-para)*EXPMA[i-1] para=2/(1+__para)
*/
HQIndexFormula.EXPMA=function(data,dayCount)
{
    var result=[];
    if (dayCount>=data.length) return result;

    var i=dayCount;
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
HQIndexFormula.EXPMEMA=function(data,dayCount)
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


HQIndexFormula.STD=function(data,n)
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
HQIndexFormula.AVEDEV=function(data,n)
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

HQIndexFormula.COUNT=function(data,n)
{
    var result=[];


    for(var i=n-1;i<data.length;++i)
    {
        var count=0;
        for(var j=0;j<n;++j)
        {
            if (data[i-j]) ++count;
        }

        result[i]=count;
    }

    return result;
}

//上穿
HQIndexFormula.CROSS=function(data,data2)
{
    var result=[];
    if (data.length!=data2.length) return result=[];

    var index=0;
    for(;index<data.length;++index)
    {
        if (data[index]!=null && !isNaN(data[index])  && data2[index]!=null && isNaN(data2[index]))
            break;
    }

    for(++index;index<data.length;++index)
    {
        result[index]= (data[index]>data2[index]&&data[index-1]<data2[index-1])?1:0;
    }

    return result;
}

//累乘
HQIndexFormula.MULAR=function(data,n)
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


HQIndexFormula.STICKLINE=function(data,price1,price2)
{
    var result=[];
    if(data.length<=0) return result;

    var IsNumber=typeof(price1)=="number";
    var IsNumber2=typeof(price2)=="number";

    for(var i in data)
    {
        result[i]=null;
        if (isNaN(data[i])) continue;
        if (!data[i]) continue;

        if (IsNumber && IsNumber2)
        {
            result[i]={Value:price1,Value2:price2};
        }
        else if (IsNumber && !IsNumber2)
        {
            if (isNaN(price2[i])) continue;
            result[i]={Value:price1,Value2:price2[i]};
        }
        else if (!IsNumber && IsNumber2)
        {
            if (isNaN(price1[i])) continue;
            result[i]={Value:price1[i],Value2:price2};
        }
        else
        {
            if (isNaN(price1[i]) || isNaN(price2[i])) continue;
            result[i]={Value:price1[i],Value2:price2[i]};
        }
    }

    return result;
}

//导出统一使用JSCommon命名空间名
module.exports =
{
    //单个类导出
    JSCommon_HQIndexFormula: HQIndexFormula
};