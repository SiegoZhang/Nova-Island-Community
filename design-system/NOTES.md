# 新岛设计系统 v0.5

更新日期：2026-09-24。入口 [组件库](ai-community.html)，[基础规范](foundations.html)，[开发约定](SYSTEM.md)，[组件索引](COMPONENTS.md)。

组件库含六类、47 个组件族、186 个可视形态与状态。每项提供真实样式预览、使用场景、结构尺寸、属性、键盘交互、按形态复制代码和源码链接。可搜索、切换 390px 预览、独立打开样本、重置演示。

## 更新流程

从项目根依次运行：

```sh
python3 design-system/scripts/sync-tokens.py
node design-system/scripts/extract-specimens.cjs
python3 design-system/scripts/build-library.py
```

原型 CSS 实时引用；HTML 函数输出是提取快照，原型结构变化后必须重新提取。组件描述和组合示例修改 `scripts/build-library.py`，再生成 `library/catalog.json`；新增/删除组件时同步 COMPONENTS.md。源文件事实优先于文档摘要，注意页面末尾覆盖。

用 `python3 -m http.server 4198 --bind 127.0.0.1` 启动本地预览，打开 `/design-system/ai-community.html`。必须通过 HTTP 读取目录 JSON。

## 验证与边界

`library-audit.html` 逐项加载所有组件，检查样本选择器、图片错误与全局横向溢出；支持 1000px / 390px。另需人工检查视觉、键盘、筛选、编辑器、点赞收藏和复制代码。结构检测不等于完整可访问性或业务验收。

预览仅操作内存，不读写产品本地存储。结构代码并非完整业务组件；需结合来源实现路由、数据与持久化。深色标为待验收。原型榜单包含生成的演示数据，不能当作实时统计。

新库使用原型实际 CSS。旧展示资源、历史主题和官网规范快照已移入仓库根目录 `archive/`；设计系统只服务 AI Community 网站。

本轮检查：1000px 与 390px 各完成 47 个组件 / 186 个样本，选择器、图片和根容器溢出检查均为 0 项问题；筛选、编辑器预览、点赞切换及代码复制已操作核对。JavaScript 语法与组件源码路径检查通过。
