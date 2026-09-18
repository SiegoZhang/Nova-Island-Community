# 新岛设计体系 · 1.1

沿用 Oxigen 的编辑式层级、留白与深浅场景切换，结合用户提供的四阶蓝色参考图，形成中文、圆角的产品设计体系。

## 配色

- 深海蓝 `#091540`：深色背景、浅色模式主要文字。
- 品牌蓝 `#1B2CC1`：浅色模式主要操作与交互强调。
- 柔光蓝 `#7692FF`：深色模式主要操作，搭配深海蓝文字。
- 晴空蓝 `#ABD2FA`：辅助图形与轻量强调。
- 派生中性色：纸白 `#F5F7FF`、浅蓝 `#EAF0FF`、云白 `#F8FAFF`、正文灰蓝 `#475677`。

前四种颜色直接采用用户图片标注的十六进制值。派生表面用于保持阅读对比度，不将浅蓝直接作为浅色页面的小号正文。

## 圆角与排版

标签 8px；按钮、输入框 12px；卡片、色卡 20px；场景容器 28px。采用表面色差形成层次，不增加重阴影。

全部文字统一使用苹方、思源黑体、微软雅黑等无衬线字体；数字采用等宽排列。标题行高 1.2，叙述行高 1.8。页面、提示、按钮、导航与无障碍名称均使用中文。字体使用本地回退，无外部字体依赖。

## 使用方式

依次引入 `tokens.css` 与 `components.css`。`guide.css`、`guide.js` 仅供指南页面使用。

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
<section class="ox-theme" data-theme="light">
  <h2 class="ox-heading ox-display">让好想法，清晰发生。</h2>
  <p class="ox-copy">在这里，认真交流，分享理解。</p>
  <a class="ox-button ox-button--solid" href="/explore">开始探索</a>
</section>
```

`data-theme` 支持 `light` 和 `dark`。React 中使用 `className` 替换 `class`。沿用 `ox-` 前缀以保持已有组件接口兼容；新增 `--ox-brand`、`--ox-periwinkle`、`--ox-sky`、`--ox-tint` 等产品色变量。旧 `teal`、`gold` 变量保留为兼容别名，当前分别映射至品牌蓝和浅蓝表面。

`tokens.json` 导出颜色、间距与圆角。字体、语义主题与动效在 `tokens.css` 中。卡片使用原生 `details` / `summary`，支持鼠标、触摸与键盘。

## 本地预览

在本目录执行：

```sh
python3 -m http.server 4187 --bind 127.0.0.1
```

打开 http://127.0.0.1:4187/ 。也可直接打开 `index.html`；复制色值功能推荐使用本地 HTTP 预览。

## 来源与范围

布局参考 https://www.oxigen.sa/ ，原始快照保存于 `RECON/reference.html`，仅用于本地查阅，不作为应用入口。字体三层角色参考原始快照 18–20 行，标题尺度参考 163–180 行，按钮参考 187–195 行，卡片参考 343–371 行。当前配色、圆角与中文排版以用户要求为准，不再声称与原站数值一致。

未复制原站的标志、授权字体或 WebGL 场景。此目录是独立设计体系，不会自动改变 NovaIsland 业务页面。
