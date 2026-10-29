请按 Nova Island 的颜色规范配色。

核心规则：
1. 黑色表示“去做”：主按钮是黑底白字。一个区块最多一个黑色主按钮；列表和卡片里的操作用次按钮或文字按钮。
2. 蓝色表示“在哪里”：只用于当前位置、选中、链接、进度、键盘焦点。蓝色不做按钮底色，不表示成功。
3. 绿色表示“已完成 / 成功”，红色表示“错误 / 危险”。没有黄色或橙色的提醒色。
4. 分类色（六种浅底色 + 深色字）只区分内容类型，可以互换，不表达状态。
5. 卡片不加阴影；悬停时换成相邻的浅色底，不加黑色遮罩。
6. 状态不能只靠颜色：选中、点赞、收藏要同时有文字或 aria-pressed / aria-current。
7. 不发明新颜色。

元素对应的颜色（能引入 colors.css 时用 Token，不能时用后面的色值）：
| 元素 | Token | 浅色值 |
| --- | --- | --- |
| 页面背景 | --surface-canvas | #F7F7F9 |
| 卡片、弹层 | --surface-default | #FFFFFF |
| 次级区块、输入框底 | --surface-secondary | #F2F2F2 |
| 列表行 / 中性卡片悬停 | --feed-surface-neutral-hover | #F0F0F4 |
| 标题 | --text-heading | #000000 |
| 正文 | --text-primary | #333333 |
| 元信息、说明、时间 | --text-secondary | #626262 |
| 禁用、占位 | --text-disabled | #949494 |
| 输入框等控件描边 | --border-strong | #CCCCCF |
| 卡片边框 | --border-default | #DEDEE0 |
| 分隔线 | --border-subtle | #F2F2F2 |
| 主按钮 底 / 字 / 悬停 | --action-primary / --text-on-action / --action-primary-hover | #000000 / #FFFFFF / #333333 |
| 次按钮 底 / 描边 / 字 / 悬停底 | --surface-default / --border-default / --text-primary / --surface-hover | #FFFFFF / #DEDEE0 / #333333 / #F7F7F9 |
| 文字按钮 字 / 悬停底 | --text-secondary / --surface-hover | #626262 / #F7F7F9 |
| 链接 | --text-link | #0033CC |
| 当前导航、已选筛选 底 / 字 | --accent-surface / --accent-text | #E0E8FF / #0033CC |
| 进度 轨道 / 填充 | --progress-track / --progress-fill | #BDCDFF / #0140FF |
| 键盘焦点轮廓（2px，偏移 2px） | --focus-ring | #0140FF |
| 成功标签 底 / 字 | --status-success-bg / --status-success-text | #EAF6EF / #276545 |
| 错误文字、危险按钮 底 / 字 | --status-danger-text、--status-danger-bg | #A23845 / #FFF5F6 |
| 输入框错误边框 | --status-danger | #EE8C94 |
| 中性提示 底 / 字 | --status-info-bg / --status-info | #F2F2F2 / #626262 |
| 标签、话题的中性底色 默认 / 悬停 / 选中 | --fill-subtle / --fill-hover / --fill-selected | 黑色 3% / 6% / 10% 叠加在白色上 |
| 分类标签 | --badge-{green,red,blue,amber,purple,yellow}-bg / -text | 绿 #EAF6EF/#276545 · 红 #F9D8C7/#8C4029 · 蓝 #E0E8FF/#0033CC · 琥珀 #FFF4DE/#845B16 · 紫 #F0E8FA/#65418B · 黄 #FFF3C9/#80631B |
| 没有配图的文字卡 底 / 悬停 | --article-surface-{blue,yellow,red} / -hover | 蓝 #F2F5FF/#EAF0FF · 黄 #FFF6DF/#FFF0CC · 红 #FFF3EB/#FFEBDD |
| 点赞 | --reaction-liked | #BF2531 |
| 收藏 图标 / 文字 | --reaction-saved-icon / --reaction-saved-text | #F5C842 / #80631B |
| 浮动控件、弹层的玻璃底 | --glass-fill / --glass-fill-strong | 白色 62% / 78% |

分类色的固定对应（与产品一致）：文章 蓝、课程 紫、论坛 黄、实战 黄、活动 红、外部教程 红。新增内容类型时，先从还没用到的绿、琥珀里选。

深色模式：给 html 或容器加 data-theme="dark"，所有 Token 自动切换；组件里不写死任何色值。
