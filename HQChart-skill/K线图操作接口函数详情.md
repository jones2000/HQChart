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

## 1.3 销毁实例

```javascript
ChartDestroy()
```

外部可以通过变量IsDestroy， 来判断插件是否已经销毁无效了

```javascript
chart.JSChartContainer.IsDestroy;
```
