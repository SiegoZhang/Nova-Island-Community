# 文字模块

请按 Nova Island 的文字规范排版。

字体：Inter, "PingFang SC", "Microsoft YaHei", sans-serif；代码用 SFMono-Regular, Consolas, monospace。
页面默认文字：body 档（14px / 1.65 / 400）。

只允许使用下面 10 档（字号 / 行高 / 字重）：
- display 40 / 48 / 500（屏宽 ≤760px：30 / 42）
- page 30 / 42 / 500（屏宽 ≤760px：24 / 32）
- title-lg 24 / 32 / 500
- title-md 20 / 28 / 500
- title-sm 18 / 26 / 500
- body-lg 16 / 1.75 / 400
- body 14 / 1.65 / 400
- small 13 / 20 / 400
- caption 12 / 18 / 400
- micro 11 / 16 / 500
正文类（body-lg、body）的行高是倍数，其余是像素。

元素对应哪一档：
| 元素 | 档位 |
| --- | --- |
| 页面 H1（每页一个） | page |
| 首页大标题、引导横幅 | display |
| 页面里的区块标题、空状态标题 | title-md |
| 列表行标题（帖子、活动行） | title-sm，字重 600 |
| 网格卡片标题 | body-lg 字号，行高 1.4，字重 600（屏宽 ≤760px 用 body 字号） |
| 统计大数字 | title-lg |
| 阅读正文、导语 | body-lg |
| 默认文字、按钮文字（按钮字重 500） | body |
| 表单标签 | body，字重 500 |
| 学习路径、目录里的小节行 | caption，字重 400 |
| 卡片摘要、页面说明 | small |
| 元信息、时间、计数、阅读数、筛选胶囊、点赞收藏按钮、表单错误提示、“已经看完”列表终点 | caption |
| 徽章、状态标签、图表注释 | micro |
| 行内代码 | small，等宽字体 |

规则：
1. 不使用以上之外的字号；界面文字不小于 11px。
2. 字重只用 400、500、600（normal 等同 400）。600 只用于卡片标题、列表行标题和需要强调的数字。
3. display、page、title-lg 字距 -0.035em。
4. 数字用 font-variant-numeric: tabular-nums。
5. 标题完整换行，不截断。

如果可以引入 CSS，直接使用 type.css：它为 body 设好默认文字；变量 --type-*；类 .nv-page、.nv-title-sm、.nv-card-title、.nv-row-title、.nv-caption 等。

## 用法示例

```html
<link rel="stylesheet" href="type.css">
<h1 class="nv-page">活动</h1>
<p class="nv-small">近期的线上与线下分享。</p>
<article>
  <span class="nv-micro">线下</span>
  <h2 class="nv-card-title">AI 工作流线下分享会</h2>
  <p class="nv-caption">11 月 8 日 · 上海 · <span class="nv-num">128</span> 人报名</p>
</article>
<p class="nv-caption">已经看完全部活动</p>
```
