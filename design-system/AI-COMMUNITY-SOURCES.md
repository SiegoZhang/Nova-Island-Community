# AI 社区规范来源 v0.5

日期：2026-09-24。本轮仅以本地 `html-pages/prototype/` 的当前实现为依据，未重新采集线上网站。原型含已有未提交修改，整理以工作区实际文件为准。

| 规范 | 直接来源 |
| --- | --- |
| 语义变量、深色、标签、正文对比 | assets/tokens.css（包含文件末尾的条件覆盖） |
| 导航与工作空间 | index.html、assets/workspace-header.css/js、detail-shell.css/js |
| 内容卡片、频道、真实图片 | assets/home.css/js、catalog.js、channel-gooey.css/js、original-media/sources.json |
| 论坛和资讯 | assets/forum.css/js、articles.js |
| 筛选与玻璃弹层 | assets/feed-filters.css/js |
| 标题、滚动与底部边缘 | assets/section-headings.css/js、scroll-glass.css/js |
| 阅读与作者 | article.html、assets/article-contents.css、article-interactions.css/js、member-profiles.css/js |
| 学习 | assets/guide-progress.css/js、site-tour.css/js |
| Token 榜 | assets/ranking.css/js、ranking-data.js；数据快照 2026-09-20 |
| 加载与空状态 | assets/page-loading.css/js、home.css/js |

路径均相对 `html-pages/prototype/`。可视规范的筛选胶囊直接引用当前 feed-filters.css；文字与色板使用同步的 community-tokens.css。页面模式跳转当前原型，不宣称概括表格还原了完整页面交互。

同期同步规则：运行 `design-system/scripts/sync-tokens.py` 生成 Token 快照与导出，JSON 包含源文件 SHA-256 和完整声明块顺序。退役方案与官网快照在仓库根目录 `archive/`，不混入当前社区设计事实。

## 组件级来源

详见 [COMPONENTS.md](COMPONENTS.md) 与 `library/catalog.json` 的 source / variants 字段。`source-fixtures.json` 是原型函数输出快照，由 `scripts/extract-specimens.cjs` 自动提取。`component-preview.html` 直接加载原型 CSS；`preview.css` 只负责展示舞台与隔离固定布局。`preview.js` 的内存演示不能代替原型业务脚本。

最终视觉例外：收藏颜色由 article-interactions.css 覆盖为 #F5C842；目录轨道由 shared.js 实现；导航玻璃图标由 nav-glass.js 实现；榜单的部分周期/趋势数据为生成演示。
