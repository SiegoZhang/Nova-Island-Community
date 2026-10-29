请按 Nova Island 的图标规范使用图标。

两套图标，不混用：
1. 线性图标（界面里所有地方）：24 × 24 网格，描边 1.6，圆头圆角（stroke-linecap / stroke-linejoin: round），不填充（fill="none"），颜色用 currentColor 跟随文字。
2. 玻璃导航图标（只用于左侧主导航）：64 × 64 网格，三层叠放：后层白色片、前层半透明磨砂玻璃（模糊折射后层）、最上面 3px 白色细节线。显示为 28 × 28。当前导航项的折射层变成蓝色 #5C84FF。只有 8 个：home 首页、book 实战、column 专栏、file 文章、chat 论坛、calendar 活动、trophy 榜单、layers 合集。不要自己画新的玻璃图标；新的导航项先告诉用户。
   - 主导航用 <nav> 包住；玻璃图标不能出现在 <nav> 以外。
   - 侧栏底色 --surface-canvas（浅灰），没有右边框。导航分组：首页单独一项，其余放在“知识学习”“社区参与”两组下；组名 11 号、字重 500、--text-secondary，左边和导航文字对齐，组与组之间 20。
   - 导航项：高 44，圆角 24（胶囊形），左右内边距 20，玻璃图标在文字左边，间距 12，项与项之间 4。文字 14 号、--text-secondary，不加底色。
   - 当前项：白色胶囊底 --surface-default，文字 --text-heading、字重 500，没有描边和阴影；玻璃图标的折射层变成蓝色（前后两层重叠的地方透出蓝色），其余图标保持灰白。当前项的链接写 aria-current="page"（icons.css 靠它把折射层变蓝，也认 .selected）。不要用浅蓝底、蓝字或左侧色条表示当前项。
   - 可以直接用 icons.css 里的 .nv-nav、.nv-nav-group、.nv-nav-label、.nv-nav-item，结构见下方示例。
   - 玻璃图标只能由 icons.js 画出来。不能运行 JS 时，导航改用同名线性图标，尺寸 20。
   - 深色模式下玻璃图标保持不变；线性图标跟随文字颜色，自动适配。

导航示例（需要 icons.css、icons.js，配合 colors.css、type.css）：

```html
<nav class="nv-nav" aria-label="主导航">
  <a class="nv-nav-item" href="#home" aria-current="page"><span data-nv-glass="home"></span>首页</a>
  <div class="nv-nav-group" role="group" aria-label="知识学习">
    <div class="nv-nav-label" aria-hidden="true">知识学习</div>
    <a class="nv-nav-item" href="#courses"><span data-nv-glass="book"></span>实战</a>
    <a class="nv-nav-item" href="#columns"><span data-nv-glass="column"></span>专栏</a>
    <a class="nv-nav-item" href="#articles"><span data-nv-glass="file"></span>文章</a>
  </div>
  <div class="nv-nav-group" role="group" aria-label="社区参与">
    <div class="nv-nav-label" aria-hidden="true">社区参与</div>
    <a class="nv-nav-item" href="#forum"><span data-nv-glass="chat"></span>论坛</a>
    <a class="nv-nav-item" href="#events"><span data-nv-glass="calendar"></span>活动</a>
    <a class="nv-nav-item" href="#ranking"><span data-nv-glass="trophy"></span>Token 榜</a>
  </div>
</nav>
```

线性图标的尺寸只用这 6 档：
| 尺寸 | 用在哪里 |
| --- | --- |
| 12 | 胶囊里的下拉箭头 |
| 14 | 只读的元信息：阅读数、计数（时间、作者不加图标） |
| 16 | 按钮里的图标（包括点赞、评论、收藏、分享这些 caption 字号的互动按钮）、搜索框里的放大镜、带文字的返回链接 |
| 18 | 只有图标的小按钮里（筛选、放大） |
| 20 | 只有图标的顶栏按钮（通知）、只有图标的返回按钮、无 JS 时的导航图标 |
| 24 | 卡片里需要突出的状态图标（例如学习阶段）。区块标题不加图标；空状态用预览卡片（见插画模块），不用单个图标 |
尺寸变化时描边仍是 1.6，不随尺寸缩放。图标与旁边文字的间距：按钮里 8，只读元信息里 4。

常见位置：
- 互动按钮（点赞、评论、收藏、分享）：高 36，内边距 8 × 12，圆角 full，文字 caption，图标 16，间距 8，颜色 --text-secondary。
- 头像按钮：44 × 44 的圆形点击区，里面放 32 的头像图片（没有图片时放名字首字），不用 user 图标。
- 返回按钮：只在详情页和二级页，放在页面标题左边或标题上方。只有图标时 44 × 44 圆形、图标 20、aria-label="返回"；带“返回”文字时图标 16、间距 8。一级页面（首页、论坛等）不放返回按钮。

颜色：
- 默认跟随文字颜色。和次要文字同行时一起用 --text-secondary。
- 状态由所在按钮决定，填充写在 CSS 里，svg 标签上仍写 fill="none"。其他图标不填充：
  [data-action="like"][aria-pressed="true"] { color: var(--reaction-liked); }
  [data-action="save"][aria-pressed="true"] { color: var(--reaction-saved-text); }
  [data-action="save"][aria-pressed="true"] svg { color: var(--reaction-saved-icon); }
  [aria-pressed="true"] svg { fill: currentColor; }
  收藏图标的黄色对比度低，所以已收藏时图标必须填充，并且旁边的数字或文字用 --reaction-saved-text，不能只靠图标的颜色表达状态。
- 不给图标单独加颜色底块；需要容器时用所在按钮的样式。

可访问性：
- 装饰性图标加 aria-hidden="true"。
- 只有图标的按钮必须有 aria-label（例如 aria-label="通知"），点击区域至少 44 × 44，图标本身仍按上表取尺寸。
- 不用 emoji 或图标字体（Font Awesome、Material Icons 等）代替图标。

线性图标全集（28 个，只用这些；需要新的图标时先告诉用户。新图标要按同样的 24 网格、1.6 描边、圆头画）：
| 名称 | 分组 · 用途 | SVG 内容（放在下面的 svg 里） |
| --- | --- | --- |
| home | 导航与页面 · 首页 | `<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>` |
| search | 导航与页面 · 搜索 | `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>` |
| bell | 导航与页面 · 通知 | `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>` |
| user | 导航与页面 · 个人资料 | `<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>` |
| settings | 导航与页面 · 账号设置 | `<circle cx="12" cy="12" r="4"/><path d="M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z"/>` |
| logout | 导航与页面 · 退出登录 | `<path d="M10 3H4v18h6M10 12h11m-4-4 4 4-4 4"/>` |
| back | 导航与页面 · 返回 | `<path d="M19 12H5m7-7-7 7 7 7"/>` |
| chevron-down | 导航与页面 · 下拉、展开筛选 | `<path d="m6 9 6 6 6-6"/>` |
| expand | 导航与页面 · 放大查看 | `<path d="M9 3H3v6m12 12h6v-6M3 3l6 6m6 6 6 6"/>` |
| filter | 导航与页面 · 筛选 | `<path d="M4 6h16M7 12h10M10 18h4"/>` |
| info | 导航与页面 · 规则、说明 | `<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".8" fill="currentColor" stroke="none"/>` |
| grid | 导航与页面 · 管理后台 | `<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/>` |
| book | 内容类型 · 课程、入门指南（玻璃导航里 book 表示“实战”，那是导航专用的对应） | `<path d="M12 7c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1Zm0 0v14M8 3h8"/>` |
| file | 内容类型 · 文章、草稿 | `<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/>` |
| column | 内容类型 · 专栏 | `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>` |
| chat | 内容类型 · 论坛、讨论 | `<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8m-8 4h5"/>` |
| calendar | 内容类型 · 活动、日期 | `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/>` |
| code | 内容类型 · 实战、代码（导航以外表示“实战”用它） | `<rect x="3" y="4" width="18" height="15" rx="3"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3"/>` |
| layers | 内容类型 · 合集、分层 | `<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>` |
| trophy | 内容类型 · 榜单、成就 | `<path d="M7 3h10v5c0 5-10 5-10 0zM7 5H3v3c0 3 4 4 5 4M17 5h4v3c0 3-4 4-5 4M12 12v7M7 21h10M9 19h6"/>` |
| plug | 内容类型 · 连接、接入工具 | `<path d="M8 3v4m8-4v4M6 7h12v3a6 6 0 0 1-12 0V7Zm6 9v5"/>` |
| sun | 内容类型 · 学习路线、阶段 | `<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/><circle cx="12" cy="12" r="4"/>` |
| spark | 内容类型 · AI、亮点 | `<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>` |
| like | 互动 · 点赞 | `<path d="M7 10v11H3V10h4Zm0 0 5-8c3 0 2 5 1 7h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"/>` |
| comment | 互动 · 评论 | `<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-10.5a9.5 9.5 0 0 1 19 0Z"/>` |
| bookmark | 互动 · 收藏 | `<path d="M6 3h12v18l-6-4-6 4V3Z"/>` |
| share | 互动 · 分享、互动 | `<path d="M12 16V3m-4 4 4-4 4 4M5 12v9h14v-9"/>` |
| eye | 互动 · 阅读数 | `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>` |

线性图标的外壳：
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">（SVG 内容）</svg>

如果可以引入文件：用 icons.js（写 <span data-nv-icon="bell" class="nv-icon-20"></span>，玻璃导航图标写 <span data-nv-glass="home"></span>），配合 icons.css 的尺寸类 .nv-icon-12 / 14 / 16 / 18 / 20 / 24。不能引入时，按上表把 SVG 直接写进页面。
