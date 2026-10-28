# 归档

这里存放已经退役的视觉方案和旧资源。2026-10-28 从正式目录移入，依据是 [design-system/VISUAL-LANGUAGE.md](../design-system/VISUAL-LANGUAGE.md)。

**这些内容都不是设计依据。** Nova Island 设计系统只服务 AI Community 网站，唯一的视觉语言是 `html-pages/prototype/assets/tokens.css`，规范入口是 `design-system/`。归档内容不部署上线（见 `.vercelignore`），也不再维护，其中的页面可能因为相对路径变化而显示不完整。完整的修改历史仍保留在 git 中。

| 文件夹 | 原位置 | 是什么 | 为什么退役 |
| --- | --- | --- | --- |
| `legacy-brand/` | `design-system/legacy-brand/` | 新岛设计体系 1.1：深海蓝 #091540、品牌蓝 #1B2CC1、柔光蓝 #7692FF，参考 Oxigen 的编辑式层级 | 已被 AI Community 产品语言取代 |
| `mist-blue/` | `design-system/mist-blue/` | 雾蓝独立版：湖蓝 #3F72AF、藏青 #112D4E | 配色探索，未采用 |
| `community-figma/` | `design-system/community/` | AI 社群早期 Figma 导出稿，使用 legacy-brand 配色 | 已被当前原型取代 |
| `recon/` | `design-system/RECON/` | 外部参考站的设计 DNA 采集 | 前期调研资料 |
| `handbook-strategy-20261015/` | `design-system/strategy-20261015/` | 手册编排的三种方案：A 视觉图鉴、B 双轨规范、C Agent 契约 | 方案阶段产物，已由正式手册取代 |
| `design-system-v04/` | `design-system/` 根目录与 `assets/` | v0.4 展示资源：旧课程页、旧文章页、`components.css`、`guide.css/js`、旧 `tokens.css` 和 `styles.css`；以及 **官网落地页规范**（`landing.html`、`LANDING-SOURCES.md`，novaisland.cn 2026-09-14 采集快照） | v0.4 资源已被当前原型和手册取代；官网不在设计系统范围内 |
| `screenshots/` | `design-system/` | 手册和导航的验收截图 | 过程记录 |
| `prototype-home-copy/` | `html-pages/home.html` | 原型首页的旧副本（9 月导航版本） | 过期副本，当前首页是 `html-pages/prototype/index.html` |

同一天删除的内容：

- `design-system/unico.html`：Unico 分区的占位页，只有“待补充”文字。Unico 不在设计系统范围内。
- `html-pages/figma-export/`、`html-pages/figma-export 2/`、`html-pages/Nova-Island-Figma-HTML.zip`：Figma 导出的 HTML，此前已在本地删除，这次一并提交。需要时可从 git 历史恢复。
