---
name: nova-design
description: Use when designing or building any page, prototype or component in the Nova Island (新岛) AI Community visual style, or when the user asks to apply Nova Island typography, colors, spacing, icons, illustration style, components or page patterns to new work. Each part is a separate module; load only the modules the task needs.
---

# Nova Island 设计系统

AI Community 网站的设计规范，拆成可以单独使用的模块。只读当前任务需要的模块。

## 模块

| 模块 | 状态 | 读什么 | 用什么 |
| --- | --- | --- | --- |
| 文字 | 可用 | `references/type.md` | `assets/type.css`、`scripts/check-type.py` |
| 颜色 | 可用 | `references/color.md` | `assets/colors.css`、`scripts/check-color.py` |
| 尺寸（间距、圆角、断点） | 制作中 | — | — |
| 图标 | 制作中 | — | — |
| 插画 | 制作中 | — | — |
| 组件 | 制作中 | — | — |
| 页面模式 | 制作中 | — | — |

用户只要求某一部分（例如“用 Nova 的字号”）时，只应用那个模块，其他部分按项目原有的做法处理。

## 步骤

1. 判断任务需要哪些模块，读对应的 `references/*.md`。
2. 能引入 CSS 时，复制 `assets/` 中的文件，使用其中的变量和类；不能引入时，按 reference 中的数值直接写。
3. 在所用模块管辖的范围内，不使用模块以外的数值；确实需要新值时，先告诉用户。没有用到的模块不限制，例如只用文字模块时，颜色和间距按项目原有做法处理。
4. 完成后运行对应的检查脚本。脚本在本 Skill 文件夹的 `scripts/` 下，用完整路径调用：

   ```bash
   python3 <本 Skill 文件夹>/scripts/check-type.py 你的页面.html    # 用了文字模块
   python3 <本 Skill 文件夹>/scripts/check-color.py 你的页面.html   # 用了颜色模块
   ```

   每个脚本都输出 OK 才算完成。脚本只能检查数值；元素是否用对了档位或颜色角色，还要对照 reference 里的对应表自查。同时用多个模块时，CSS 按 colors.css、type.css 的顺序引入。
