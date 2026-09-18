# Nova Island 独立 HTML 导出

打开 `index.html` 查看全部 103 个页面及状态，每个链接对应一个独立 HTML 文件。

## 导入 Figma

1. 从目录中选择需要的页面，例如 `home.html`（首页）、`courses.html`（课程列表）、`course-detail.html`（课程详情）。
2. 在你使用的 HTML 转 Figma 插件中选择导入 HTML 文件；若插件支持粘贴源码，也可以复制该文件的全部内容。
3. 建议使用 **1440px** 桌面宽度；页面高度随内容展开。
4. 每个页面分别导入为一个 Frame。目录页 `index.html` 仅供查找页面，无需导入。

如果插件只支持 URL 导入，需要将本目录放到插件能够访问的 HTTP 网站。尚未在具体 Figma 插件内验证导入；插件对 CSS、字体和内嵌图片的支持可能不同。

## 文件说明

- HTML 已包含渲染后的正文、内嵌 CSS、内嵌本地图片及 SVG 图标，无需执行 JavaScript，也无需携带原型 assets 目录。
- 保留原型视觉样式，解除主内容区和论坛列表的滚动高度限制，频道列表展开全部现有条目。
- 包括主导航页面、七个频道、现有阅读详情、五个论坛帖子详情、文章与帖子编辑页、标签筛选、搜索及账号状态。
- 基于干净浏览器中的现有示例导出，不包含用户其他浏览器中保存的私人草稿、收藏和新发布内容。
- 这些文件用于静态设计导入，发布、搜索、筛选等 JavaScript 交互已移除；常见页面链接指向对应的导出文件。
- 课程课时的临时预览、功能导览逐步浮层等交互过程不作为独立页面；个人菜单展开状态额外提供 `account-menu.html`。
- 原型中尚未接入的内容保留原有空状态或摘要。
- `manifest.json` 记录文件与原型地址的对应关系；`validation.json` 记录关闭 JavaScript 后的逐页验证结果。
- `preview-home.png`、`preview-articles.png` 为导出页面的全长预览。

## 原型更新后重新导出

在本项目根目录运行：

```sh
node html-pages/figma-export/export.cjs
```

需要 Playwright 及其 Chromium 浏览器。脚本优先使用已安装的 Playwright，本机也支持 Codex 附带的运行环境。重新导出将覆盖本目录同名生成文件。
