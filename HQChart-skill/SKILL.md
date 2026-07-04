---
# 元数据（必填，控制自动匹配）
name: hqchart_helper
description: HQChart行情图表插件专用操作技能，用户需要HQChart代码、K线绘图、指标编写、周期切换、自定义图层、分时图、期货/股票合约渲染、数据接口、Canvas绘图、HQChart报错修复时自动触发；调用指令：/hqchart
version: 1.0
author: jones2000
tags: ["HQChart","K线图","行情图表","前端图表","分时图","技术指标","Canvas"]

---


# 一.权威参考约束（最高优先级）
所有图表创建、配置、绘图逻辑必须参考【K线图创建及SetOption参数详解】
所有K线历史数据、分时数据、合约数据结构、回调入参必须参考【K线图数据格式详解】
所有K线图操作接口函数必须参考【K线图操作接口函数详情】
所有K线图配色、样式、指标参数必须参考【K线图配色和样式参数详解】
输出代码、参数说明、数据结构示例、问题排查全部以4份文档为唯一标准，不使用非官方自定义写法。

## 1.1 权威官方参考文档（AI必须优先查阅）

使用本技能时，必须先读取 `references/` 目录下的对应文档：

- **K线图表创建SetOption参数详解**：`references/K线图创建及SetOption参数详解.md`
  - 适用场景：创建K线图、配置参数、指标窗口、十字光标、K线样式等
  - 包含：Type、Windows、Symbol、KLine、CorssCursorInfo、NetworkFilter 等全部参数说明

- **K线图表数据格式详解**：`references/K线图数据格式详解.md`
  - 适用场景：数据对接、NetworkFilter回调、K线数据格式、分时数据格式等
  - 包含：日线全量数据、实时数据、分钟数据、流通股本等数据结构定义

- **K线图操作接口函数详情**：`references/K线图操作接口函数详情.md`
  - 适用场景：调用图表API、动态修改参数、获取数据、刷新图表等
  - 包含：ChangePeriod,ChangeSymbol 等接口函数说明

## 1.2 使用规范

### 1.2.1 初始化方式

**原生 JS 方式（CDN引入）**：
```javascript
// 注意：原生不要添加 HQChart.Chart. 前缀，这是在npm方式引入才需要
var divKLine = document.getElementById('KLineCtrl');
var chart = JSChart.Init(divKLine, false, true);
```

**NPM 方式（Vue/React工程）**：
```javascript
import HQChart from 'hqchart';
import 'hqchart/src/jscommon/umychart.resource/font/drawtool/iconfont.css';     //HQChart插件内部使用的iconfont图标
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'   //HQChart插件内置样式

var chart = HQChart.Chart.JSChart.Init(this.$refs.KLineChart);
```

### 1.2.2 CDN 引入顺序（必须严格按顺序）

```html
<!-- HQChart插件内置样式和iconfont图标文件 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/css/tools.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/font/iconfont.css" />
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/webfont.js"></script>
<!-- HQChart源码地址 -->
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart/umychart.min.js"></script>
```

## 1.2.3 NPM 安装（Vue/React 工程）

```bash

# npm
npm install hqchart --save
# yarn
yarn add hqchart
# pnpm
pnpm add hqchart

```


## 二.常见问题排查

### HQChart 加载失败
1. 检查 CDN 路径是否正确（使用 `cdn.jsdelivr.net/npm/hqchart`）
2. 检查 JS 文件加载顺序（jquery → webfont → umychart.min.js）
3. 检查 CSS 文件是否正确引入（tools.css + iconfont.css）
4. 确认 DOM 容器设置了 `position: relative`

### 图表不显示
1. 检查 DOM 容器是否有明确的宽高
2. 检查 NetworkFilter 回调是否正确返回数据
3. 检查数据格式是否符合官方规范
4. 检查 `data.PreventDefault = true` 是否已设置

### 数据格式错误
1. 日期必须是 yyyymmdd 格式的整数（如 20260702）
2. 每条 K 线数据至少包含 8 个字段
3. 数据必须按日期升序排列
4. 成交量、成交金额单位需与官方文档一致

## 资源说明

### references/
包含 HQChart 官方参考文档：
- `K线图创建及SetOption参数详解.md` - SetOption 全部参数说明
- `K线图数据格式详解.md` - 所有数据格式定义
- `K线图操作接口函数详情.md` - API 接口函数说明
- `K线图配色和样式参数详解.md` - 配色、样式参数说明

