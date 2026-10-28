# Nova Island AI 社区设计系统 v0.5

整理日期：2026-09-24。以 `html-pages/prototype/` 当前本地实现为依据；可视入口为 [AI 社区规范](ai-community.html)。本文件描述当前设计事实及维护约定，不把尚未实现的状态写成已完成组件。

## 组件库与 Agent 使用

入口 [组件库](ai-community.html)，基础规范移至 [foundations.html](foundations.html)。当前按六类组织 **50 个组件族、199 个可视形态与状态**；逐项索引见 [COMPONENTS.md](COMPONENTS.md)。

开发时先在组件库搜索目标组件，再阅读它的使用场景、结构尺寸、属性、交互与键盘约定。选择需要的形态复制结构代码，并打开对应原型 CSS / JS 实现。`library/catalog.json` 提供相同的机器可读契约，Agent 应按组件 id 定位，避免全文猜测。

- 样本展示默认、悬停、焦点、选中、禁用、加载、空值、错误等适用状态；每项的具体覆盖以其状态清单为准。
- “已有”来自现有结构与样式；“组合示例”和其他标记为文档组合或建议状态，不能据此宣称原型业务已经实现。
- 预览引用原型真实 CSS，独立 iframe 隔离样本；源函数输出由 `scripts/extract-specimens.cjs` 提取。手写组合与实际来源都记录在目录中。
- `library/preview.js` 仅提供内存演示，不发布内容、不保存草稿、不修改原型存储。接入命令为注释示例。真实数据处理必须使用或适配业务实现。
- 当前是 HTML/CSS/JS 参考库，尚未封装为 React/Vue 包。结构依赖 `.nova-ds`、页面上下文和源 CSS 顺序，不可只复制单个 class。
- `spec-hover` / `spec-active` / `spec-focus` 是文档冻结状态，复制代码时会移除。实际页面使用原生伪类和真实属性。
- 深色仅用于检查 Token 映射，尚未完成全组件验收。

建议给 Agent 的任务描述：

> 先阅读 design-system/SYSTEM.md，并在 library/catalog.json 中查找目标组件。复用其结构、语义变量和对应源文件；保留列出的适用状态与键盘交互。缺少形态时先补组件契约和展示，再用于业务页面。完成后核对桌面与 390px、长文本、空值、焦点及真实业务状态。

## 产品方向

面向在岛内发现工具、阅读经验、学习课程、分享实践的成员。设计语言围绕频道、文件夹、内容卡片、阅读目录、学习进度、岛民与贡献展开。白色阅读表面、浅灰画布、黑色主操作、文件夹蓝、分类浅色背景组成主要色彩。标志性模式是蓝色文件夹、柔和内容卡、双层筛选胶囊、连续玻璃边缘、分组侧栏和阅读目录。

沿用已经落地的视觉选择：阅读主导布局，内容卡不强制统一高度，真实内容图片保留来源，品牌标志不统一染色。不要把通用仪表盘卡片、任意装饰渐变或生成封面引入现有内容体系。

## 信息架构

- 首页。
- 知识学习：课程、专栏、资讯。
- 社区参与：论坛、活动、实战、Token 榜。
- 全局层：搜索、通知、账号菜单、入门指南。
- 详情层：文章、课程、帖子、作者资料；返回保留来源。

专栏、活动、实战目前保留已设计空状态，不宣称已有真实业务数据。Token 榜已有交互页面，参考 2026-09-20 本地快照，部分趋势与周期数值由演示算法生成。

## 颜色

| 层级 | 当前规则 |
| --- | --- |
| 蓝色原始值 | 50 #F2F5FF / 100 #E0E8FF / 200 #BDCDFF / 300 #8FABFF / 400 #5C84FF / 500 #0140FF / 600 #0033CC / 700 #082A99 |
| 浅背景与选中 | accent-surface-soft → blue-50；accent-surface → blue-100 |
| 边框、文字、强调 | accent-border → blue-200；accent-text → blue-600；accent-active → blue-500 |
| 插画 | illustration-blue → blue-500；illustration-blue-depth → blue-700 |
| 图表 | chart-codex → blue-400；chart-codex-ink → neutral-ink；其他工具可保留专属图表色 |
| 页面 | shell-bg #F7F7F9；surface-default #FFFFFF；surface-secondary #F2F2F2 |
| 主操作 | action-primary #000000；hover #333333；文字 #FFFFFF |
| 正文 | heading #000000；primary #333333 |
| 次要文字 | 全站 secondary #626262；tertiary、helper 为其别名；#949494 只用于禁用与占位（2026-10-28 统一，取消榜单覆盖） |
| 边界 | strong #CCCCCF / default #DEDEE0 / subtle #F2F2F2 |
| 成功 | #276545 文字 / #EAF6EF 背景；成功不再借用蓝色 |
| 阅读互动 | liked #BF2531；saved Token 为 #80631B，但 article-interactions.css 最终覆盖为 #F5C842；复用时检查最终级联 |

Token 分为原始值、语义、组件三层，另有插画与图表用的表现色板，结构见 [tokens.html#structure](tokens.html#structure)。全部变量名称和值见 [tokens.css](tokens.css)，保留语义别名，不将原始颜色复制到新组件中。深色已存在基础映射，但不是已验收主题。

## 排版与空间

字体 Inter / PingFang SC / Microsoft YaHei；等宽字体 SFMono-Regular / Consolas。字号阶梯 11 / 12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 40px，角色与行高见 [SCALE-PROPOSAL.md](SCALE-PROPOSAL.md)；UI 文字最小 11px；字重 400、500、600；基础正文行高 1.65，阅读正文 16px / 1.75。

页面标题桌面 30px / 42px / 500，手机 24px / 32px；描述 13px / 22px。插画内文字与字形图标不纳入阶梯（豁免清单见提案）。

间距阶梯 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64px；命名例外仅有外壳 gap 6px、筛选胶囊 padding 3px、2px 细微偏移。全局侧栏宽 224px。圆角阶梯 4 / 8 / 12 / 20 / 24px + full：小元素 4，按钮与输入框 8（--radius-sm），嵌套面板 12，浮层与筛选容器 20，主外壳与主要卡片 24。内层圆角约等于外层圆角减内边距。

主体层次依靠浅色表面与轻边界，弹层使用轻阴影。筛选容器使用 62% 表面色、16px 模糊；弹层 78%、24px 模糊，有不支持 backdrop-filter 时的实色回退。工作空间边缘使用独立连续遮罩与 24px 模糊。卡片悬停使用相邻色阶，不使用黑色覆盖层。

## 组件索引

| 组件 | 实现来源（prototype/assets 下） | 使用约定 |
| --- | --- | --- |
| 工作空间 | workspace-header.css/js、detail-shell.css/js | 搜索在主卡外；最大 560px、最小高度 40px；头像按钮 44px |
| 频道 / 内容卡 | home.css/js、channel-gooey.css/js、catalog.js | 图片和纯文字卡分开；真实配图来自 original-media |
| 筛选胶囊 | feed-filters.css/js | 桌面内层 30px + 容器 padding 3px；触控内层 38px；多选溢出折叠为 +N |
| 论坛 | forum.css/js | 桌面 2fr / 1fr，32px gap；正文列表独立滚动；手机合并阅读流 |
| 发布 | forum.js、articles.js | 论坛标题最多 200 字、正文 50000；草稿本地存储；资讯发布需要本地 admin 角色样例 |
| 阅读 | article-contents.css、article-interactions.css/js、home.css | 目录、返回、赞藏、阅读数、作者卡共同构成阅读界面 |
| 作者资料 | member-profiles.css/js | 作者入口与资料页复用成员信息 |
| 学习进度 | guide-progress.css/js、course.html | 当前、完成、未解锁分开；课程与指南不是同一进度数据 |
| 榜单 | ranking.css/js、ranking-data.js | 工具 / 模型 / 月份筛选、数值、分布、排行；快照日期不能当实时状态 |
| 加载与空状态 | page-loading.css/js、home.css/js | 明确无内容原因及可继续的入口 |

## 交互与页面验收

保持路由与筛选的 hash 状态。详情返回来源，不能统一跳首页。默认、hover、选中、focus-visible、disabled 应按组件适用性覆盖。赞藏提供 aria-pressed 或状态文字，避免只靠颜色。

断点只有四个：≤600px（手机单列）、≤760px（侧栏变抽屉）、≤1100px（双栏变单栏）、≥1440px（宽屏加列）；min-width 写作上一档加 1。组件内部响应优先使用容器查询。独立筛选按钮触控高度至少 44px，现有胶囊内层为 38px；后续需结合容器边界验收实际命中区域。

滚动标题淡出和吸顶跟随滚动位置；底部终点留白 24px。遵循 prefers-reduced-motion。动效不阻碍高频筛选与阅读。部分搜索框移除了焦点轮廓，需补齐等效键盘反馈。加载、空、错误状态应分别验收，不能用一个空态替代所有异常。

## 来源、同步与边界

1. `html-pages/prototype/assets/tokens.css` 是当前产品 Token 来源。
2. 执行 `python3 design-system/scripts/sync-tokens.py` 更新 `design-system/tokens.css`、`assets/community-tokens.css` 和 `tokens.json`。
3. JSON 保留别名；themes.light 为基础，themes.dark 为覆盖；contextualOverrides 为条件覆盖，blocks 保留原始级联顺序。普通页与榜单的文字差异不能压成单一浅色值。
4. 手册网站读取 `assets/community-tokens.css`：与产品 Token 相同，另外把浅色值挂在 `:root` 上，供手册自身样式使用。
5. 范围：设计系统只服务 AI Community 网站，唯一视觉语言是产品 Token。退役方案（legacy-brand、mist-blue、早期 Figma 稿、RECON、手册编排方案、v0.4 展示资源、官网规范快照）已移入仓库根目录 `archive/`，见 `archive/README.md`；它们都不是设计依据。

待完善：全页面深色验收、搜索键盘焦点、错误状态矩阵、触控命中范围与长标签压力检查。此次整理不代表这些产品实现问题已修复。
