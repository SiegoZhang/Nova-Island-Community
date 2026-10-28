# Token 整理提案

> **状态（2026-10-28）**：T1–T7、T10、T12、T13 已实施（`scripts/migrate-tokens.py`）。迁移前后在 5 个页面、1440 / 390px 以及深色模式下逐元素比对计算样式，差异为 0。实施时的三处调整：T12 的工具色暂按原值移入 `--chart-*`，三个绿色合并留到视觉批次；`--journey-green` 移入 `--illus-journey-green`，未改为成功色（色值不同）；文章和课程详情标题仍为 36px，暂留 `--font-3xl`，在视觉批次中处理。T8、T9、T11 待做对比页。

2026-10-28。成熟度第 2 项，同时收尾第 1 项遗留的 D9–D11。统计范围是 `html-pages/prototype/assets/` 下的 tokens.css 和其余全部 CSS / JS。

第 1 项把数值统一到了阶梯上；这一项要让这些数值**只在 tokens.css 定义一次**。做完以后，改一个 Token，全站跟着变。

## 一、现状

| 问题 | 数据 |
| --- | --- |
| 数值写死，绕过 Token | 字号 540 处写死、74 处用 Token；间距约 1370 处写死、约 230 处用 Token；圆角 98 处写死；阴影声明 66 处：32 处为 none，4 处用 Token，其余 30 处写死 |
| 同一个值有多个名字 | #0140FF 有 7 个名字（`--nova-accent`、`--brand-primary`、`--accent-active`、`--focus-ring`…），#FFFFFF 有 6 个，#F2F2F2 有 6 个，#626262 有 5 个 |
| 定义了没人用 | 11 个：`--text-link`、`--neutral-slate`、`--neutral-cool-gray`、`--text-disabled`、`--border-muted`、`--border-card-hover`、`--brand-hover`、`--brand-subtle`、`--shadow-none`、`--shadow-sm`、`--icon-size` |
| 名字和值对不上 | `--radius-md` 和 `--radius-lg` 现在都是 8px；`--font-3xl` 是 36px，但阶梯里已经没有 36 |
| 命名体系混用 | 蓝色用数字色阶（blue-500），中性色用诗意名（ink、graphite、iron、linen、pearl…） |
| Token 散落在组件文件里 | 组件 CSS 里另外定义了 95 个变量，其中封面、portal、星星、旅程、榜单模型色等直接写了色值 |
| 页面级覆盖 | `.nova-ds:not(:has(.ranking-page))` 区块在 D8 之后只剩互动色，已无存在理由 |

做得好的地方：组件里的大部分局部变量（`--tag-fill`、`--feed-card-surface`、`--journey-accent` 等）都引用语义 Token，这正是要推广的写法。

## 二、建议的结构：三层

| 层 | 作用 | 举例 | 规则 |
| --- | --- | --- | --- |
| 1. 原始值 Primitive | 定义“有哪些值” | `--blue-500`、`--neutral-200`、`--space-4`、`--type-14` | 只在 tokens.css 中定义；**组件不能直接引用** |
| 2. 语义 Semantic | 定义“值用来做什么” | `--text-secondary`、`--surface-hover`、`--accent`、`--radius-card`、`--shadow-md` | 浅色和深色各有取值；组件只用这一层 |
| 3. 组件 Component | 某个组件内部的可调参数 | `--tag-fill`、`--feed-card-surface` | 写在组件自己的 CSS 里，只能引用语义层，不能写原始色值 |

另外两类单独管理，不算在三层里：

- **表现色板**：插画用的 `--illus-*`、图表用的 `--chart-*`，定义在 tokens.css 的独立分组中。它们不表达界面语义，只给插画和数据图使用。
- **运行时变量**：由 JS 实时写入的 `--heading-opacity`、`--folder-x`、`--arrow-x`、`--wave`、`--distribution-color` 等，保留原样，在文档中列出。

## 三、需要你确认的决策

| 编号 | 决策 | 视觉变化 |
| --- | --- | --- |
| T1 | 采用上面的三层结构和引用规则 | 无 |
| T2 | 合并重复别名，按第四节对照表改名 | 无 |
| T3 | 删除 11 个未使用的 Token（`--text-link`、`--text-disabled` 改为补上用途后保留） | 无 |
| T4 | 圆角改名：`xs 4 / sm 8 / md 12 / lg 20 / card 24 / full` | 无 |
| T5 | 字号改为角色 Token：`--type-micro` 到 `--type-display`，每档配一个行高 Token | 无 |
| T6 | 写死的字号、间距、圆角全部换成 Token（插画豁免项除外） | 无 |
| T7 | 中性色改为数字色阶 `--neutral-0` 到 `--neutral-900` | 无 |
| T8（D9） | 阴影统一为 3 级，色相统一为深蓝 `rgb(9 21 64)` | **有**：卡片和弹层的阴影略偏冷 |
| T9 | 玻璃材质统一为 2 档 Token | **有**：几处模糊强度和透明度会对齐 |
| T10（D10） | 收藏色拆为图标色和文字色两个 Token | 无（修正 Token 与实际不符） |
| T11 | 中性填充统一为 4 档：`--fill-subtle 3% / hover 6% / selected 10% / border 20%` | **有**：4%、5%、7%、8% 四处会就近取档 |
| T12（D11） | 插画和图表色移入 tokens.css 的 `--illus-*` / `--chart-*` 分组 | 无 |
| T13 | 删除榜单页上下文覆盖区块，互动色移入基础层 | 无 |

T1–T7、T10、T12、T13 只改写法、不改样子，可以通过迁移前后逐像素截图对比来验证。T8、T9、T11 会有细微变化，会和上次一样先放进对比页给你看。

## 四、别名合并对照表（T2、T7）

### 颜色

| 新名称 | 值（浅色） | 合并掉的旧名称（使用次数） |
| --- | --- | --- |
| `--accent` | #0140FF | `--nova-accent`(48)、`--brand-primary`(2)、`--accent-active`(2) |
| `--accent-text` | #0033CC | `--text-hover`(14)、`--brand-hover`(0)、`--selection-text`(2) |
| `--text-link` | → `--accent-text` | 保留为链接专用语义名 |
| `--accent-surface` | #E0E8FF | `--brand-subtle`(0)、`--selection-bg`(3) |
| `--accent-surface-soft` | #F2F5FF | — |
| `--accent-border` | #BDCDFF | `--border-card-hover`(0) |
| `--focus-ring`、`--progress-fill`、`--progress-track` | 引用 accent 系列 | 保留，角色不同 |
| `--surface-canvas` | #F7F7F9 | `--shell-bg`(7) |
| `--surface-default` | #FFFFFF | `--bg-primary`(4)、`--shell-surface`(1) |
| `--surface-secondary` | #F2F2F2 | `--bg-secondary`(3)、`--control-bg`(1) |
| `--surface-hover` | #F7F7F9 | — |
| `--text-heading` | #000000 | — |
| `--text-primary` | #333333 | — |
| `--text-secondary` | #626262 | `--text-tertiary`(53)、`--text-helper`(6)，即 D8 留下的过渡别名 |
| `--text-disabled` | #949494 | 原本无人使用；占位文字和禁用状态改用它 |
| `--text-on-accent` | #FFFFFF | `--text-on-brand`(1) |
| `--border-strong` | #CCCCCF | `--border-control`(6)、`--control-border`(1) |
| `--border-default` | #DEDEE0 | `--border-muted`(0) |
| `--border-subtle` | #F2F2F2 | — |

### 中性色原始值

| 新名称 | 值 | 旧名称 |
| --- | --- | --- |
| `--neutral-0` | #FFFFFF | `--neutral-paper` |
| `--neutral-50` | #F7F7F9 | `--neutral-linen` |
| `--neutral-100` | #F2F2F2 | `--neutral-ash` |
| `--neutral-200` | #DEDEE0 | `--neutral-pearl` |
| `--neutral-300` | #CCCCCF | `--neutral-mist` |
| `--neutral-400` | #949494 | `--neutral-fog` |
| `--neutral-600` | #626262 | `--neutral-iron` |
| `--neutral-800` | #333333 | `--neutral-graphite` |
| `--neutral-900` | #000000 | `--neutral-ink` |

删除：`--neutral-slate` #707070、`--neutral-cool-gray` #6B7280、`--neutral-steel` #7E8389。目前有 2 处使用 `--neutral-steel`，改为 `--text-secondary`。

### 圆角（T4）

| 新名称 | 值 | 旧名称 |
| --- | --- | --- |
| `--radius-xs` | 4px | `--radius-sm` |
| `--radius-sm` | 8px | `--radius-md`、`--radius-lg` |
| `--radius-md` | 12px | 新增，替换写死的 12px |
| `--radius-lg` | 20px | 新增，替换写死的 20px |
| `--radius-card` | 24px | `--shell-radius` |
| `--radius-full` | 999px | 写死的 999px |

注意：`--radius-sm` 和 `--radius-md` 的含义会改变，迁移脚本按旧名到新名一次性替换，避免中途出现混用。

### 字号（T5）

| Token | 字号 / 行高 | 替换的旧名称 |
| --- | --- | --- |
| `--type-micro` / `--type-micro-lh` | 11 / 16px | `--font-xs` |
| `--type-caption` / `-lh` | 12 / 18px | `--font-sm` |
| `--type-small` / `-lh` | 13 / 20px | — |
| `--type-body` / `-lh` | 14px / 1.65 | `--font-md`、`--line-body` |
| `--type-body-lg` / `-lh` | 16px / 1.75 | `--font-lg` |
| `--type-title-sm` / `-lh` | 18 / 26px | — |
| `--type-title-md` / `-lh` | 20 / 28px | `--font-xl` |
| `--type-title-lg` / `-lh` | 24 / 32px | `--font-2xl` |
| `--type-page` / `-lh` | 30 / 42px | — |
| `--type-display` / `-lh` | 40 / 48px | `--font-3xl`（36px，删除） |

T6 只替换字号，不强制行高。现有的行高写法保持不变，避免产生视觉变化；行高统一留到组件层（第 3 项）逐个组件处理。

## 五、会有视觉变化的三项

### T8 阴影（D9）

| Token | 值 | 用途 | 替换 |
| --- | --- | --- | --- |
| `--shadow-color` | `9 21 64` | 阴影色相 | — |
| `--shadow-sm` | `0 1px 2px rgb(var(--shadow-color) / .06)` | 悬浮的小控件、贴边元素 | 2 处细阴影（模糊 ≤4px） |
| `--shadow-md` | `0 4px 16px rgb(var(--shadow-color) / .08)` | 菜单、弹层、提示 | 现有 `--shadow-popover`（4 处）和 16 处同类阴影（模糊 5–20px） |
| `--shadow-lg` | `0 12px 32px rgb(var(--shadow-color) / .12)` | 引导浮层、对话框 | 5 处大阴影（模糊 >20px） |

另有 4 处 0 模糊的描边环（焦点或选中描边）和 3 处纯内阴影（玻璃高光），不并入阴影：描边环改用 `--focus-ring` 或边框 Token，内阴影归入 T9。

### T9 玻璃

| Token | 值 | 用途 |
| --- | --- | --- |
| `--glass-fill` | `color-mix(in srgb, var(--surface-default) 62%, transparent)` | 筛选胶囊、浮动控件 |
| `--glass-fill-strong` | 78% | 弹层 |
| `--glass-blur` | `blur(16px) saturate(115%)` | 对应 fill |
| `--glass-blur-strong` | `blur(24px) saturate(115%)` | 对应 fill-strong |
| `--glass-border` | `rgb(255 255 255 / .6)` | 玻璃描边 |
| `--glass-highlight` | `inset 0 1px 0 rgb(255 255 255 / .65)` | 顶部高光 |

引导文件夹的 `blur(7px) saturate(.8)` 属于插画效果，豁免。`guide-progress.css` 里 15 种白色透明度会就近归入以上几档。

### T11 中性填充

现有 8 处 `color-mix(var(--text-heading) N%)`，N 从 3 到 20 共 8 种，统一为 4 档：

| Token | 混合比例 | 用途 |
| --- | --- | --- |
| `--fill-subtle` | 3% | 标签和话题的默认底色 |
| `--fill-hover` | 6% | 悬停（吸收 4%、5%、7%） |
| `--fill-selected` | 10% | 选中（吸收 8%） |
| `--fill-border` | 20% | 选中描边 |

## 六、其余几项

- **T10 收藏色**：`--reaction-liked` #BF2531；`--reaction-saved-icon` #F5C842（图标填充）；`--reaction-saved-text` #80631B（文字）。深色模式各配一个值。写死的 #BF2531、#F5C842、#E6AE25 一并替换。
- **T12 表现色板**：home.css 中的 `--cover-*`、`--portal-*`、`--star-*` 移入 tokens.css，改名为 `--illus-cover-*`、`--illus-portal-*`、`--illus-star-*`。ranking.css 中的工具色改为 `--chart-codex`、`--chart-claude`、`--chart-kimi`…，每个工具一个色，三个相近的绿色合并为一个。`--journey-green` 改为 `--status-success-bg`，`--journey-peach` 移入插画分组。
- **T13**：删除 `.nova-ds:not(:has(.ranking-page))` 区块，互动色移入基础层，同时去掉 `:has()` 带来的选择器开销。

## 七、执行顺序

1. **改写法，不改样子**（T1–T7、T10、T12、T13）：用脚本按对照表替换，然后对首页、论坛、Token 榜、文章、课程在 1440px 和 390px 下截图，与迁移前逐像素比较，差异必须为 0。
2. **有视觉变化的项**（T8、T9、T11）：放进对比页，你看过确认后再迁移。
3. 迁移完成后：运行 `sync-tokens.py`，tokens.json 按三层分组输出；在 foundations.html 中补一节“Token 结构”，SYSTEM.md 同步更新。
4. 推送到 GitHub，网站自动更新。
