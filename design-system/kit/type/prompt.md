请按 Nova Island 的文字规范排版。

字体：Inter, "PingFang SC", "Microsoft YaHei", sans-serif；代码用 SFMono-Regular, Consolas, monospace。

只允许使用下面 10 档（字号 / 行高 / 字重 · 用途）：
- display 40 / 48 / 500 · 首页大标题、引导横幅（屏宽 ≤760px 时用 30 / 42）
- page 30 / 42 / 500 · 页面 H1（屏宽 ≤760px 时用 24 / 32）
- title-lg 24 / 32 / 500 · 重要区块标题、大数字
- title-md 20 / 28 / 500 · 区块标题、空状态标题
- title-sm 18 / 26 / 500 · 帖子标题、模块小标题
- body-lg 16 / 1.75 / 400 · 阅读正文、导语；卡片标题用 500
- body 14 / 1.65 / 400 · 默认界面文字
- small 13 / 20 / 400 · 卡片摘要、分区说明
- caption 12 / 18 / 400 · 元信息、时间、计数
- micro 11 / 16 / 500 · 徽章、标签、图表注释

规则：
1. 不使用以上之外的字号；界面文字不小于 11px。
2. 字重只用 400、500、600。
3. 每页只有一个 H1，用 page 档。display、page、title-lg 三档标题字距 -0.035em。
4. 阅读数、排名、金额等数字用 font-variant-numeric: tabular-nums。
5. 标题完整换行，不截断成一行。

如果可以引入 CSS，直接使用 type.css：变量 --type-*（如 var(--type-caption)），或类 .nv-page、.nv-title-sm、.nv-caption 等。
