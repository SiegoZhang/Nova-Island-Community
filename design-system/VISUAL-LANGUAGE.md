# 统一视觉语言提案

> **状态（2026-10-28）**：V1–V8 已执行。退役内容移入仓库根目录 `archive/`（见 `archive/README.md`），Unico 占位页删除，Figma 导出的删除已提交，跳转页改指向原型页面。手册改用产品 Token：handbook.css 的 38 种写死色值全部换成 Token，比对时只出现近似色收敛（如 #111→#000、#777→#626262、#50545C→#333）。

2026-10-28。成熟度第 5 项。

**范围（已确认）**：设计规范和设计系统只服务 AI Community 网站。官网、Unico 不在范围内。

目标：仓库里只留下一套正在使用的视觉语言，其他方案归档并写明来历，避免设计师和 Agent 拿错依据。

## 一、盘点：仓库里现在有 14 处视觉来源

| # | 位置 | 是什么 | 主要特征 | 最后更新 | 现状 |
| --- | --- | --- | --- | --- | --- |
| 1 | `html-pages/prototype/assets/tokens.css` | **AI 社区产品语言** | 文件夹蓝 #0140FF、黑色主操作、#F7F7F9 画布、白色阅读表面、Inter / 苹方 | 10-28 | 刚完成尺度和 Token 整理，产品与手册都基于它 |
| 2 | 产品首页 portal 区（home.css） | 首页编辑推荐区的表现色板 | 深海军蓝 #172B40、雾蓝、纸色 | 9 月 | 已归入 `--illus-portal-*`，属于产品的一部分 |
| 3 | `design-system/landing.html` | **官网规范**（novaisland.cn 采集） | 暖灰画布 #F2F3F5、暖灰文字、蓝紫 #7692FF、动态球体、Arial | 9-14 快照 | 独立页面，不在手册侧栏中；未重新采集 |
| 4 | `design-system/legacy-brand/` | 新岛设计体系 1.1 | 深海蓝 #091540、品牌蓝 #1B2CC1、柔光蓝 #7692FF | 9-18 | 已被 1 取代，无页面引用 |
| 5 | `design-system/mist-blue/` | 雾蓝独立版 | 湖蓝 #3F72AF、藏青 #112D4E | 9-18 | 配色探索，未采用，无页面引用 |
| 6 | `design-system/community/` | AI 社群早期 Figma 导出稿 | 使用 4 的配色 #1B2CC1 / #7692FF | 9-18 | 已被 1 取代，无页面引用 |
| 7 | `design-system/RECON/` | 外部参考站的设计 DNA 采集 | 参考资料 | 9-18 | 无页面引用 |
| 8 | `design-system/strategy-20261015/` | 手册编排的三种方案（A 图鉴 / B 双轨 / C Agent 契约） | 使用 1 的配色 | 10-15 | 方案阶段产物，已由正式手册取代 |
| 9 | `design-system/unico.html` | Unico 分区 | 只有“待补充”占位文字 | 9 月 | 空页面 |
| 10 | `design-system/` 下的旧展示资源 | v0.4 展示页：`course.html`、`article.html`、`components.css`、`guide.css/js`、`assets/tokens.css`、`assets/styles.css` 等 | 旧 Token 名称与旧数值 | 9-14 | SYSTEM.md 已标为历史资源，但仍放在正式目录里 |
| 11 | `design-system/assets/handbook.css` | **手册网站自身的样式** | 直接写了 38 种色值，其中 #0866E9 是系统外的另一种蓝 | 10-27 | 手册没有使用自己的 Token |
| 12 | `html-pages/home.html` | 原型首页的旧副本 | 9 月的导航和样式版本 | 9 月 | 过期；本地还有一处你未提交的修改 |
| 13 | `html-pages/index.html`、`article.html`、`course.html` | 跳转页 | 标题“设计系统入口已统一” | 9 月 | 只用于旧链接跳转 |
| 14 | `html-pages/figma-export/`、`figma-export 2/`、`Nova-Island-Figma-HTML.zip` | Figma 导出的 HTML | 220 个文件 | 9 月 | 你已在本地删除，但删除还没提交，GitHub 上仍然存在 |

另有两个文件夹不在 git 中，本次不处理：`figma-sync/`（Figma 同步脚本，里面还在用旧 Token 名称）和 `html-pages/prototype/RECON/`。

## 二、核心问题

1. **范围外的内容混在规范里。** 官网规范和 Unico 占位页与 AI Community 放在同一目录，容易被当成同一套系统。
2. **退役方案没有退场。** 4–8 和 10 都已经不用，但还放在正式目录里，名字看上去和正式规范差不多。比如 `legacy-brand/tokens.css` 与正式的 `tokens.css` 同名。
3. **手册自己不守规范。** 手册的样式表直接写死颜色，还混进了一种系统外的蓝。设计系统的第一个使用者，本来就应该是它自己的网站。

## 三、需要你确认的决策

| 编号 | 决策 | 建议 |
| --- | --- | --- |
| V1 | 唯一的视觉语言 | AI 社区产品语言（1）。设计系统、手册和今后的产品页面都以它为准 |
| V2 | 官网规范页（3） | 不在范围内，移入 `archive/`，README 中注明是 2026-09-14 的官网采集快照，供以后参考 |
| V3 | 退役方案的去向 | 在仓库根目录建 `archive/`，把 4–8、10、12 移进去，并写一份 `archive/README.md`，说明每项是什么、为什么退役。不上线，git 历史保留 |
| V4 | Unico 分区 | 不在范围内，删除占位页 |
| V5 | 手册使用产品 Token | handbook.css 改为引用 Token，去掉 #0866E9，38 种写死色值收敛到语义 Token；手册资源版本号一并更新 |
| V6 | 首页 portal 深海军蓝色板 | 保留为产品的表现色板（已在 `--illus-portal-*` 中），不另立一套语言 |
| V7 | Figma 导出文件夹（14） | 提交你本地的删除，并从 `.vercelignore` 中移除对应条目 |
| V8 | 跳转页（13） | 保留。它们只负责把旧链接引到新地址，没有视觉 |


## 四、确认后的执行顺序

1. 建 `archive/` 并移动退役内容，写 README；检查手册和原型中没有任何链接指向被移走的文件。
2. 手册改用产品 Token（V5），用计算样式比对确认只有 #0866E9 那一处颜色发生变化。
3. 处理 Unico 和 Figma 导出（V4、V7）。
4. 更新 SYSTEM.md、AGENTS.md 和 `.vercelignore`，推送上线。
