# Nova Island 设计系统 · Agent 入口

做任何 AI Community 界面任务前先读这份文件。它告诉你读什么、按什么顺序读、遇到没有现成答案的需求时怎么处理。

> 状态：Guidelines 层（原则、扩展协议、页面模式）是 2026-10-27 的草案，标为**待确认**。确认之前作为推理依据，不作为强制规则。`DISCUSSION.md` 中“已确认”的规则优先级最高。

## 阅读顺序

| 顺序 | 文件 | 回答什么 |
| --- | --- | --- |
| 1 | [principles.html](principles.html) | 为什么这样设计，原则冲突时怎么取舍 |
| 2 | [DISCUSSION.md](DISCUSSION.md) 的“已确认”部分 | 人已经拍板的规则，不能违反 |
| 3 | 对应的页面模式，目前只有 [pattern-feed.html](pattern-feed.html) | 页面骨架、必须实现的状态、行为规则 |
| 4 | [library/catalog.json](library/catalog.json) | 有哪些组件，契约、状态和源文件是什么 |
| 5 | [tokens.json](tokens.json) / [tokens.css](tokens.css) | 语义 Token 及其取值 |
| 6 | [extend.html](extend.html) | 组件库里没有的东西，怎么推导、实现和登记 |
| 7 | [SYSTEM.md](SYSTEM.md) | 实现基线、来源、同步流程和已知限制 |

HTML 页面也可以直接读源码；正文在 `<main>` 中。

## 处理任务的流程

1. **归类需求。** 这是哪种页面模式？用户要完成什么任务？
2. **查组件。** 在 catalog.json 中按意图搜 `summary`、`usage`、`avoid`，不要只按名称搜。
3. **选复用级别。** 依次判断：直接复用 → 给现有组件加形态 → 用现有组件组合 → 新建。详见 extend.html#reuse-level。
4. **推导样式。** 先确定元素的角色，再查 extend.html#derive 的决策表取语义 Token。不要在组件里写原始色值。
5. **补全状态。** 按 extend.html#states 的矩阵逐项处理，包括加载、空、错误、长文本、390px 和键盘操作。
6. **登记。** 新增的形态或组件写进 `scripts/build-library.py`，运行同步脚本，状态标为“建议”。

## 必须停下来交给人确认的情况

- 需要新颜色，或者决策表里没有的字号、圆角、间距
- 要改变现有组件的外观或行为
- 要引入新的交互方式（拖拽、手势、全屏弹窗、自动播放）
- 和 `DISCUSSION.md` 中“已确认”的规则冲突
- 原则之间冲突，按优先级仍然无法判断

做法：在 `DISCUSSION.md` 的“待确认”中写下需求、方案和理由，不要静默引入。

## 不要做的事

- 不要把“建议”或“组合示例”写成“已有”。
- 不要以 `assets/tokens.css`、`components.css`、`legacy-brand/`、`mist-blue/`、`RECON/` 为依据，它们是历史资源。
- 不要直接修改 `design-system/tokens.css`。Token 的来源是 `html-pages/prototype/assets/tokens.css`，改完运行 `scripts/sync-tokens.py`。
- 不要把榜单的演示数据当成实时数据。
