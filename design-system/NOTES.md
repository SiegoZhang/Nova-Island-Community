# 新岛产品设计系统 0.2

以 `html-pages/prototype/` 当前原型为视觉依据，更新日期 2026-09-14。唯一入口为 `design-system/index.html`。`html-pages/index.html` 仅跳转到此入口，旧课程和文章地址也跳转到本目录对应示例；不再维护页面或资源副本。原型独立维护，规范更新不会自动覆盖原型。

## 视觉与变量

白色内容表面、#F7F7F9 画布、黑色主操作、#7692FF 柔光蓝强调。文字分为标题 #000000、正文 #333333、次要 #707070、辅助 #6B7280、弱化 #949494。边框使用 #CCCCCF、#DEDEE0、#F2F2F2 三层。

字体 Inter / 苹方 / 微软雅黑；基础字号 11、12、14、16、20、24、36px，字重 400 / 500 / 600，正文行高 1.65。内容阅读与论坛按页面使用更宽松行高。基础间距 4px；圆角 4 / 6 / 8px，外壳 12px；控件高度 32 / 40 / 48px。卡片使用浅边框，弹层使用轻阴影。

`tokens.css` 与 `assets/tokens.css` 为原型变量快照；`tokens.json` 包含浅色变量及深色覆盖值，保留 CSS 别名。深色变量是已有基础能力，当前原型的页面验收以浅色为准。`components.css` 与 `assets/styles.css` 为原型共享组件快照。依次引入 tokens.css、components.css，并在根容器设置 class="nova-ds" data-theme="light"。

## 原型模式

组件库新增工作空间顶栏、底部指南、频道、图文卡片和论坛反馈示例。精确尺寸及响应式行为在“当前原型模式”中说明。页面模式样式从原型 home.css、workspace-header.css、forum.css 复制，使用 CSS nesting 限定于 .prototype-specimens，避免页面级选择器污染指南。需要支持 CSS nesting 的现代浏览器。

课程与文章示例保留在本目录。所有展示资源独立存放在 assets，无需后端。论坛筛选和赞同收藏演示只改变展示状态，不向线上发送数据。

文案不使用居中圆点分隔词语；并列元信息用独立元素和 gap 排版。焦点必须可见；保留 hover、disabled、loading、empty、error 以及减少动效状态示例。

## 维护与预览

从项目根运行 `python3 -m http.server 4198 --bind 127.0.0.1`，访问 `/design-system/`。同步时先检查原型最终 CSS 覆盖规则，再更新组件库及变量导出；不要反向覆盖原型。

旧蓝色品牌规范归档至 legacy-brand/，mist-blue/、community/ 和 RECON/ 保留为历史参考，不是当前产品规范。

## 本轮检查

入口与课程、文章的本地资源链接检查通过；新增脚本通过 Node 语法检查。浏览器无控制台错误；已检查桌面与 390px 布局、组件搜索与清空恢复、论坛赞同切换。390px 下文档宽度为 390px，无横向溢出。

## 一级路由

左侧一级导航：官网落地页 landing.html、AI社区 ai-community.html、Unico unico.html。index.html 为默认跳转入口，保留查询参数和锚点。当前组件库归属 AI社区，组件搜索和目录位于正文内部；其余两个分区待补充。

## AI社区原型核对更新

AI社区现按用户指定的 8091 原型整理，内容依据见 AI-COMMUNITY-SOURCES.md。原有通用组件演示已移除，二级目录位于 main 左侧，复用 ArticleContents。交互示例使用 community-guide.js，不再加载 playground.js。

## 官网落地页规范

landing.html 已根据 novaisland.cn 当前官网补齐配色、字号、Space、导航按钮、章节、联系弹窗与响应式动效。来源与示例边界见 LANDING-SOURCES.md。
