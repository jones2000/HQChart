# 说明

如果函数没有说明, 都是HQChart实例的成员函数， 都在图形实例完成初始化设置(SetOption)调用以后才能调用

# 一、基础函数

## 1.1 周期切换 ChangePeriod

```javascript
ChangePeriod=function(period, option)
```

- period 周期数据 周期数值详见 "K线图数据格式详解.md"中的"1.4 周期对应数值表"
- option 额外设置 (可选)


## 1.2 切换品种 ChangeSymbol

```javascript
ChangeSymbol=function(symbol, option)
```

- symbol 品种代码
- option 额外设置 (可选)

## 1.3 销毁实例 ChartDestroy

```javascript
ChartDestroy()
```

外部可以通过变量IsDestroy， 来判断插件是否已经销毁无效了

```javascript
chart.JSChartContainer.IsDestroy;
```

## 1.4 K线切换类型 ChangeKLineDrawType

```javascript
ChangeKLineDrawType(drawType)
```

- drawType K线切换类型  

|K线类型数值 |说明 |
|----|----|
|0 |实心K线柱子|
|1 |收盘价线 |
|2 |美国线 |
|3 |空心K线柱子|
|4 |收盘价面积图|
|5 |订单流|
|6 |空心K线柱子2(全部空心)|
|7 |订单流样式2|
|8 |订单流样式3|
|9 |自定义颜色K线| 
|10|renko |
|11|Heikin Ashi |
|12|line break |
|13|high low |
|14|外部自定义图 |
|15|HLC Area |
|16|kagi |
|17|订单流样式4 |
|18|订单流样式5 |
|19|HLC bars |
|20|空心K线柱子3(阴实心 阳空心)|
|21|订单流样式6 |

## 1.5 切换复权 ChangeRight

```javascript
ChangeRight(rightID)
```
- rightID 复权ID<br> 0 不复权<br> 1 前复权<br> 2 后复权

## 1.6 设置指标窗口个数 ChangeIndexWindowCount
```javascript
ChangeIndexWindowCount (count)
```
- count 窗口个数

## 1.7 删除指标窗口 RemoveIndexWindow 
```javascript
RemoveIndexWindow(windowIndex)
```
- windowIndex 窗口索引 从0开始


# 二、窗口指标函数

## 2.1 切换指标 ChangeIndex

```javascript
ChangeIndex(windowIndex,indexID,option)
```
- windowIndex 窗口索引 从0开始
- indexID 指标唯一的ID
- option 可选设置 可以设置API指标或设置指标参数
```javascript
var option=
{
    StringFormat: 标题数据格式, 
    FloatPrecision: 小数位数, 
    Args: 参数列表数组,
    IsShortTitle: 是否使用缩写标题,
    TitleFont:标题字体
        //使用API挂接指标数据
    API:{ Name:指标名字, Script:指标脚本可以为空, Args:参数可以为空, Url:指标执行地址 },
    Window:	//窗口属性设置 (可选)
    {
        Modify:true/false,	//修改指标参数按钮
        Change:true/false,	//切换指标按钮
        Close:true/false,     //关闭指标窗口按钮
        Overlay:true/false,  //叠加指标按钮
        HorizontalReserved:{ Top:上预留高度, Bottom:下预留高度 } //Y轴预留高度
    },
    Lock:  //上锁
    {
        IsLocked: true, 
        //......
    }
} 
```

```javascript
Chart.AddIndexWindow(indexID, option);
```

- indexID 指标唯一的ID
- option 可选设置
```javascript
var option=
{
    StringFormat: 标题数据格式, 
    FloatPrecision: 小数位数, 
    Args: 参数列表数组,
    
    IsShortTitle: 是否使用缩写标题,
    TitleFont:标题字体,
    Window:	//窗口属性设置
    {
        Modify:true/false,	//修改指标参数按钮
        Change:true/false,	//切换指标按钮
        Close:true/false,     //关闭指标窗口按钮
        Overlay:true/false,  //叠加指标按钮
        Export:true/false,   //导出按钮
        MaxMin:true/false, //最大最小化按钮
        TitleWindow:true/false, //标题栏模式按钮
        IsDrawTitleBG: true/false, //指标名称增加背景色 并支持点击事件
        IsShowNameArrow: true/false  //指标名后增加箭头
    },
    IsShowLeftText:
    IsShowRightText:
    TitleHeight:
    IsShowTitleArraw:
    IsShowIndexName:
    IsShowOverlayIndexName:
    IndexParamSpace:
    IsShowXLine:
    IsShowYLine:
    IsShowIndexTitle:
    Height:  窗口高度比例
    Lock:  {   }  //上锁
 } 

```

## 2.3 增加一个自定义通达信脚本指标窗口 AddScriptIndexWindow

```javascript
AddScriptIndexWindow(indexInfo, option);
```

- indexInfo 自定义指标内容
{ Name:指标名字 , Script:指标脚本, Args:参数, }

- option 可选设置 (参见AddIndexWindow中的option)

## 2.4 增加一个远程指标窗口 AddAPIIndexWindow

```javascript
AddAPIIndexWindow(indexData, option);
```

- indexData 远程指标信息
```javascript
{ 
	API:{ Name:指标名字, Script:指标脚本可以为空, Args:参数可以为空, Url:指标执行地址 } ,
	Lock:{ } //上锁 可选
}
```
- option 可选设置 (参见AddIndexWindow中的option)

## 2.5 切换自定义指标 ChangeScriptIndex

```javascript
ChangeScriptIndex(windowIndex,indexData);
```

- windowIndex 窗口索引 从0开始
- indexData 自定义指标 {Name：指标名字, Script：指标脚本, Args：指标参数(数组) }


## 2.6 切换五彩K线或交易指示 ChangeInstructionIndex
这些指标都显示在主图窗口里
```javascript
ChangeInstructionIndex(indexID) 
```

- indexID 五彩K线或交易指示 ID

## 2.7 取消显示五彩K线或交易指示 CancelInstructionIndex
```javascript
CancelInstructionIndex() 
```

## 2.8 切换自定义五彩K线|交易指示 ChangeInstructionScriptIndex
```javascript
ChangeInstructionScriptIndex(indexData) 
```

- indexData 自定义指标 {Name：指标名字, Script：指标脚本, Args：指标参数 (数组)， InstructionType： 指标类型 2=五彩K线 1=交易指示 }

# 三、信息地雷

目前支持 “互动易”,“大宗交易”,‘龙虎榜’,“调研”,“业绩预告”,“公告”

## 3.1 增加一个信息地雷 AddKLineInfo

```javascript
AddKLineInfo(infoName, bUpdate)
```

- infoName 信息地雷名字 “互动易”,“大宗交易”,‘龙虎榜’,“调研”,“业绩预告”,“公告”
- bUpdate 是否立即更新,如果当前增加的信息地雷已存在,不会更新.

## 3.2 删除一个信息地雷 DeleteKLineInfo

```javascript
DeleteKLineInfo(infoName)
```
- infoName 删除信息地雷的名字

## 3.3 删除所有信息地雷 ClearKLineInfo

```javascript
ClearKLineInfo()
```

## 3.4 重新设置信息地雷 SetKLineInfo

```javascript
SetKLineInfo(aryInfo,bUpdate)
```

函数清空所有的信息地雷,然后重新设置.

- aryInfo 信息地雷名字,数组类型
- bUpdate 是否立即更新

## 3.5 更新信息地雷列表 UpdateKLineInfo
```javascript
UpdateKLineInfo(infoName,option)
```

- infoName 添加的信息地雷名称
- option 添加方式 { InsertNew:true/false 如果没有找到对应的地雷，是否插入新的地雷, Update:true/false 是否立即请求数据  }


# 四、监听事件

## 4.1 动态注册监听事件 AddEventCallback
```javascript
AddEventCallback(obj)
```

- obj 事件ID及回调函数 { event:事件ID, callback:回调函数 }
```javascript
//实例:主图指标回调
chart.AddEventCallback(
{
    event:JSCHART_EVENT_ID.RECV_INDEX_DATA,
    callback:(event, data, chart)=>{ }
});
```

## 4.2 删除监听事件 RemoveEventCallback
```javascript
RemoveEventCallback(eventid)
```

- eventid 事件ID