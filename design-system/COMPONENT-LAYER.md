# 组件层提案 待确认

2026-10-28。成熟度第 3 项。统计对象是 `html-pages/prototype/assets/` 下除 tokens.css 以外的 21 个 CSS 文件（约 328KB），以及全部 JS 和 HTML。

目标：组件有自己的样式文件和统一的写法，页面只负责排布。改一个组件只需要改一个文件，Agent 和设计师也能直接找到组件的“真身”。

## 一、现状

| 问题 | 数据 |
| --- | --- |
| 样式按页面拆分，不按组件拆分 | 文件名是 home.css（81KB）、ranking.css（66KB）、guide-progress.css（45KB）、forum.css（29KB）……组件库里 50 个组件中有 49 个的样式分散在 2–4 个文件里 |
| 大量死样式 | 定义了 790 个类名，其中 **242 个（31%）** 在页面和脚本中从未出现：home.css 124 个、ranking.css 61 个、styles.css 27 个、guide-progress.css 15 个……主要是已被真实配图取代的插画封面（`cover-*`）、旧版首页 portal、旧版榜单面板 |
| 跨文件互相覆盖 | 91 个类名在 2 个以上的文件里都写了样式，例如 home.css 和 guide-progress.css 重叠 7 个、feed-filters.css 和 ranking.css 重叠 7 个。最终样式取决于文件加载顺序 |
| 靠 `!important` 抢优先级 | 28 处，分布在 home.css（7）、styles.css（6）、ranking.css（5）等 9 个文件 |
| 命名没有统一规则 | 30 多种前缀：`ds-`、`forum-`、`ranking-`、`journey-`、`feed-`、`channel-`、`portal-`、`reader-`、`is-`…… |
| 只在组件库样本中使用的基础样式 | 19 个类（`ds-card`、`ds-field`、`ds-textarea`、`ds-spinner`、`ds-icon-button` 等）只出现在组件库里，产品页面没有使用 |

统计方法：类名在 JS、HTML 中以字面量出现，或者匹配模板拼接前缀（例如 `ranking-tool-${tool}`），就算“使用中”。死样式名单已经人工抽查，比如 `cover-*` 插画封面已被 `coverMarkup()` 中的真实图片取代。

## 二、建议的结构

```
assets/
  nova.css            唯一入口，按层引入下面所有文件
  tokens.css          Token（已完成）
  base.css            重置、正文排版、焦点样式、减少动效
  components/         一个组件族一个文件
    button.css  tag.css  avatar.css  field.css  content-card.css  forum-post.css
    filter-capsule.css  sidebar-nav.css  global-search.css  account-menu.css
    reading-outline.css  reactions.css  skeleton.css  empty-state.css  ……
  patterns/           页面骨架，只管排布
    shell.css（外壳与工作区）  feed.css（内容流）  reader.css（详情阅读）  ranking.css（榜单页）  journey.css（学习旅程）
  illustrations/      文件夹、导览、奖杯等插画样式（不属于组件）
```

`nova.css` 用 CSS 层级（`@layer`）声明优先级：

```css
@layer tokens, base, components, patterns, illustrations, overrides;
```

后面的层天然覆盖前面的层，与加载顺序无关，`!important` 就不再需要。

## 三、需要你确认的决策

| 编号 | 决策 | 外观变化 |
| --- | --- | --- |
| C1 | 采用上面的目录结构，三个原型页面改为只引用 `nova.css` | 无 |
| C2 | 用 `@layer` 管理优先级，去掉 28 处 `!important` | 无 |
| C3 | 删除 242 个死样式类，以及只为它们服务的 Token（如 `--illus-cover-*`） | 无（这些类没有任何元素使用） |
| C4 | 91 个跨文件覆盖逐个归位：组件本身的样式进组件文件，页面里的特殊情况写成组件的变体或页面骨架的上下文规则 | 无 |
| C5 | 只在组件库中使用的 19 个基础样式保留，归入对应组件文件，在组件库中继续标为“基础样式” | 无 |
| C6 | 每个组件文件开头写一段契约注释：用途、使用的 Token、变体、状态；`catalog.json` 中每个组件的 `source` 指向唯一的组件文件 | 无 |
| C7 | **命名分两步走**：这一轮只移动、不改类名，避免同时改动 JS 模板；类名统一（`ds-组件名`、`ds-组件名__部件`、变体用修饰类，状态用原生属性和 `aria-*`）等组件被实际修改时再逐个进行 | 无 |

全部决策都不改变外观。每一步完成后用前两轮验证过的方法检查：5 个页面加发帖页，在 1440 / 390px 和深色模式下，逐元素比对计算样式，差异必须为 0。

## 四、执行顺序

1. **删死样式（C3）**：先做，因为它会让后面的拆分工作量减少三成。
2. **建入口和层级（C1、C2）**：现有 21 个文件原样放进对应的层，去掉 `!important`，比对无差异。
3. **按组件拆分（C4、C5）**：从 styles.css 开始，再到 home.css、forum.css、ranking.css，每拆完一个文件比对一次。
4. **契约与组件库（C6）**：补组件文件头注释，更新 `build-library.py` 中的 `source`，重新生成组件库。
5. 更新 SYSTEM.md、COMPONENTS.md、扩展协议中的“实现与登记”步骤，推送上线。

## 五、不在这一轮做的

- 改类名（见 C7）。
- 组件的视觉和交互改进，例如搜索框焦点、胶囊触控高度。这些属于第 4 项“状态与质量缺口”，组件层建好后单个修改会更容易。
- 打包成 React / Vue 组件。原型目前是原生 HTML 与 JS，先把 CSS 层理顺。
