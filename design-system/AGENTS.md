# Nova Island 设计系统 · Agent 入口

做任何 AI Community 界面任务前先读这份文件。它告诉你读什么、按什么顺序读、遇到没有现成答案的需求时怎么处理。

> Guidelines 中的“设计规则”和“决策记录”只收录已确认的内容；“页面模式”和“扩展协议”中的示例为推导演示。

## 阅读顺序

| 顺序 | 文件 | 回答什么 |
| --- | --- | --- |
| 1 | [principles.html](principles.html) | 20 条必须满足的设计规则，每条带反例和检查方式 |
| 2 | [decisions.html](decisions.html) | 已拍板的决定及理由；遇到规则没覆盖的情况，按最接近的决定推理 |
| 3 | 对应的页面模式，目前只有 [pattern-feed.html](pattern-feed.html) | 页面骨架、必须实现的状态、行为规则 |
| 4 | [library/catalog.json](library/catalog.json) | 有哪些组件，契约、状态和源文件是什么 |
| 5 | [tokens.json](tokens.json) / [tokens.css](tokens.css) | Token 及其取值，按原始值、语义、表现色板分组 |
| 6 | [extend.html](extend.html) | 组件库里没有的东西：复用级别、按角色取 Token 的决策表、何时停下来问人 |
| 7 | [SYSTEM.md](SYSTEM.md) | 实现基线、来源、同步流程和已知限制 |

HTML 页面也可以直接读源码；正文在 `<main>` 中。

## 处理任务的流程

1. **归类需求。** 这是哪种页面模式？用户要完成什么任务？
2. **查组件。** 在 catalog.json 中按意图搜 `summary`、`usage`、`avoid`，不要只按名称搜。
3. **选复用级别并取 Token。** 见 extend.html。组件里只写语义 Token，不写色值和阶梯外的数值。
4. **补全状态。** 加载、两种空状态、原位错误、到底；长文本、390px、键盘。
5. **检查。** 运行 `python3 design-system/scripts/check-design.py`，新增违规必须为 0。脚本只报告你的改动带来的问题，已知的历史问题记在 `check-baseline.json`。
6. **登记。** 新增的形态或组件写进 `scripts/build-library.py`，状态标为“建议”；新的设计决定写进 `DISCUSSION.md` 的“待确认”。

## 必须停下来交给人确认的情况

- 需要新颜色，或者决策表里没有的字号、圆角、间距
- 要改变现有组件的外观或行为
- 要引入新的交互方式（拖拽、手势、全屏弹窗、自动播放）
- 和 `DISCUSSION.md` 中“已确认”的规则冲突
- 原则之间冲突，按优先级仍然无法判断

做法：在 `DISCUSSION.md` 的“待确认”中写下需求、方案和理由，不要静默引入。

## 不要做的事

- 不要把“建议”或“组合示例”写成“已有”。
- 不要以仓库根目录 `archive/` 中的任何内容为依据，它们是退役方案和旧资源。设计系统只服务 AI Community 网站，官网和 Unico 不在范围内。
- 不要直接修改 `design-system/tokens.css`。Token 的来源是 `html-pages/prototype/assets/tokens.css`，改完运行 `scripts/sync-tokens.py`。
- 不要把榜单的演示数据当成实时数据。
