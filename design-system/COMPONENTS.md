# 组件索引 v0.5

47 个组件族，186 个可视形态与状态。详细用法与代码以可视页面和 `library/catalog.json` 为准。

## 基础控件

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [按钮](ai-community.html#buttons) | 主操作、次操作、弱操作、悬停、按下、键盘焦点、禁用、加载中、小 / 中 / 大、危险操作 | styles.css |
| [图标按钮与返回](ai-community.html#icon-buttons) | 返回、悬停、焦点、通知、未读通知 | back-buttons.css, workspace-header.css, home.css |
| [输入框](ai-community.html#fields) | 空值、已填写、焦点、错误、禁用 | styles.css, forum.css, forum.js |
| [多行输入](ai-community.html#textarea) | 帖子正文、已有内容、评论输入、错误 | styles.css, forum.css, forum.js |
| [复选与单选](ai-community.html#selection) | 未选择、已选择、键盘焦点、禁用、单选月份 | feed-filters.css, feed-filters.js |
| [状态与分类标签](ai-community.html#badges) | 业务状态、内容类型、六种色阶、帖子标签 | tokens.css, styles.css, home.css, forum.css |
| [头像与身份](ai-community.html#avatars) | 列表 20px、顶栏 32px、榜单 36px、阅读作者 48px、成员 80px、长名字 | home.css, workspace-header.css, ranking.css, member-profiles.css |
| [功能图标](ai-community.html#icons) | 常用功能、图标 + 文字、独立动作、禁用动作 | home.js, forum.js, styles.css |

## 导航与筛选

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [分组侧栏](ai-community.html#sidebar) | 完整分组、资讯选中、悬停 / 焦点 | home.css, home.js, nav-glass.js |
| [全局搜索](ai-community.html#global-search) | 默认、输入内容、聚焦、结果反馈、无结果 | workspace-header.css, workspace-header.js, home.js |
| [账号菜单](ai-community.html#account-menu) | 展开菜单、触发器、焦点入口 | home.css, home.js, workspace-header.css |
| [频道导航](ai-community.html#channel-nav) | 推荐选中、主题选中、悬停 / 焦点 | home.css, catalog.js, channel-gooey.css, channel-gooey.js |
| [分段导航](ai-community.html#tabs) | 通知、成员内容、作者主页、统计口径、操作系统 | home.css, member-profiles.css, ranking.css |
| [筛选胶囊](ai-community.html#filter-capsule) | 无筛选、单项、多项、溢出折叠、精选开关、我的帖子已选 | feed-filters.css, feed-filters.js |
| [筛选面板](ai-community.html#filter-panel) | 展开 / 已选、搜索结果、搜索无结果、单选 | feed-filters.css, feed-filters.js |
| [阅读目录](ai-community.html#outline) | 默认、当前第二节、焦点 | article-contents.css, article-reader.css, shared.js |

## 内容与交流

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [图文内容卡](ai-community.html#content-card) | 带封面、纯文字 / 蓝、纯文字 / 黄、纯文字 / 红、悬停、长标题 | catalog.js, home.css, article-interactions.css |
| [论坛帖子卡](ai-community.html#forum-post) | 默认、悬停、长内容、草稿 | forum.css, forum.js, article-interactions.css |
| [点赞、评论与收藏](ai-community.html#reactions) | 帖子默认、已点赞 / 已收藏、卡片紧凑、详情、悬停 / 焦点 | forum.js, forum.css, article-interactions.css |
| [作者、阅读数与元信息](ai-community.html#metadata) | 文章元信息、长姓名 | home.css, article-interactions.css |
| [作者信息卡](ai-community.html#author-card) | 文章作者、帖子作者、更多作品 | home.js, home.css, forum.js, forum.css |
| [成员身份与统计](ai-community.html#member-profile) | 普通成员、作者主页、没有内容 | member-profiles.css, member-profiles.js |
| [活跃讨论者](ai-community.html#active-members) | 成员列表、悬停、键盘焦点 | forum.js, feed-filters.css |
| [评论与回复](ai-community.html#comments) | 评论列表、回复层级、无评论、回复输入 | forum.css, forum.js |
| [发布编辑器](ai-community.html#editor) | 空白编辑器、恢复草稿、正文预览 | forum.js, forum.css, articles.js |
| [排版工具与标签选择](ai-community.html#editor-toolbar) | 工具栏、标签选择、保存中反馈、保存失败 | forum.css, forum.js |
| [阅读正文与信息块](ai-community.html#article-prose) | 正文与引用、大字号阅读、步骤信息、提示与代码、延伸阅读 | article-reader.css, article.js |

## 学习与导览

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [进度与继续学习](ai-community.html#progress) | 未开始、进行中、全部完成、继续学习卡、指南继续卡 | styles.css, guide-progress.css, guide-progress.js |
| [入门指南文件夹](ai-community.html#guide-folder) | 开始旅程、进行中、已完成 | guide-progress.css, guide-progress.js, home.css |
| [学习周与任务](ai-community.html#journey-week) | 当前周、未开始、已完成、单个任务、任务完成 | guide-progress.css, guide-progress.js |
| [功能导览](ai-community.html#onboarding) | 邀请卡、第一步、最后一步 | site-tour.css, site-tour.js |
| [学习动态球体](ai-community.html#fluid-orb) | 动态、暂停、无 WebGL 回退 | styles.css, orb.js |

## 榜单与数据

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [成员排名行](ai-community.html#ranking-row) | 前三名、悬停、定位自己、无匹配成员 | ranking.css, ranking.js |
| [排名奖杯与首页榜单](ai-community.html#trophies) | 第一名 / 金、第二名 / 银、第三名 / 铜、普通名次、首页三人榜 | home.css, home.js, ranking.css |
| [社区用量总览](ai-community.html#ranking-summary) | 总览、当前筛选 | ranking.css, ranking.js |
| [用量趋势图](ai-community.html#trend-chart) | 每日趋势、数据点焦点、提示气泡 | ranking.css, ranking.js |
| [模型分布](ai-community.html#distribution) | 行内条形、矩形树图、单一模型 | ranking.css, ranking.js |
| [我的排行](ai-community.html#personal-rank) | 未连接、已连接、筛选无记录 | ranking.css, ranking.js |
| [接入步骤与命令](ai-community.html#connection) | 接入流程、状态完成 | ranking.css, ranking.js |

## 反馈与页面模式

| 组件 | 形态与状态 | 实现来源 |
| --- | --- | --- |
| [空状态](ai-community.html#empty-states) | 专栏未开放、搜索无结果、没有收藏、没有草稿 | home.css, home.js |
| [加载骨架](ai-community.html#skeletons) | 图文卡片、纯文字卡片、论坛帖子、榜单行 | page-loading.css, page-loading.js |
| [错误与恢复](ai-community.html#error-states) | 页面加载失败、帖子不存在、本地保存失败、字段错误 | home.js, home.css, forum.js, styles.css |
| [轻提示](ai-community.html#toast) | 成功提示、失败提示、交互演示 | home.css, home.js |
| [数据提示](ai-community.html#tooltips) | 趋势数据、模型数据、基础提示 | ranking.css, ranking.js, styles.css |
| [列表终点](ai-community.html#feed-footer) | 全部展示、加载更多、结束标记 | catalog.js, home.css, section-headings.css, section-headings.js |
| [页面标题与分区标题](ai-community.html#section-heading) | 页面标题、带发布动作、内容分区、滚动后 | section-headings.css, section-headings.js, home.css |
| [玻璃与滚动边缘](ai-community.html#glass-surfaces) | 普通表面、玻璃筛选、连续滚动边缘 | feed-filters.css, scroll-glass.css, scroll-glass.js |
