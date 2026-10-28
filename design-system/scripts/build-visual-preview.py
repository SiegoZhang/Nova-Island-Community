"""Preview the visual batch of TOKEN-PROPOSAL.md (T8 shadows, T9 glass, T11 fills) plus leftovers.

  python3 design-system/scripts/build-visual-preview.py          writes design-system/scale-preview/visual/
  python3 design-system/scripts/build-visual-preview.py --apply  rewrites html-pages/prototype/assets in place
Open design-system/scale-preview/index.html?after=visual/&changes=visual-changes.json to compare.
"""
from pathlib import Path
import re, sys, json

root = Path(__file__).resolve().parents[2]
source = root / 'html-pages/prototype/assets'
apply = '--apply' in sys.argv
target = source if apply else root / 'design-system/scale-preview/visual'

SHADOW, GLASS, FILL, TITLE, CHART, JOURNEY = '阴影', '玻璃', '中性填充', '详情标题', '图表色', '旅程完成色'
# (file or None for every file, pattern, replacement, group, note)
RULES = [
    ('feed-filters.css', r'box-shadow:0 12px 40px #00000018', 'box-shadow:var(--shadow-lg)', SHADOW, '筛选弹层'),
    ('home.css', r'box-shadow:0 12px 48px #172b401f', 'box-shadow:var(--shadow-lg)', SHADOW, '账号菜单'),
    ('site-tour.css', r'box-shadow:0 12px 40px #0002', 'box-shadow:var(--shadow-lg)', SHADOW, '功能导览面板'),
    ('ranking.css', r'box-shadow:0 4px 14px rgb\(0 0 0 / \.16\)', 'box-shadow:var(--shadow-md)', SHADOW, '榜单数据提示'),
    ('ranking.css', r'box-shadow:0 1px 3px rgb\(0 0 0 / \.06\)', 'box-shadow:var(--shadow-sm)', SHADOW, '操作系统分段选中'),
    ('guide-progress.css', r'box-shadow:0 4px 24px rgb\(52 56 73 / 3%\)', 'box-shadow:var(--shadow-sm)', SHADOW, '学习周卡片'),
    ('home.css', r'--card-hover-shadow:0 2px 4px color-mix\([^;]*?7%,transparent\)', '--card-hover-shadow:var(--shadow-md)', SHADOW, '内容卡悬停'),
    (None, r'var\(--shadow-popover\)', 'var(--shadow-md)', SHADOW, '提示、轻提示、指南菜单、引导卡片'),
    (None, r'((?:-webkit-)?backdrop-filter:)blur\(16px\) saturate\(115%\)', r'\1var(--glass-blur)', GLASS, '浮动控件（外观不变）'),
    (None, r'((?:-webkit-)?backdrop-filter:)blur\(24px\) saturate\(115%\)', r'\1var(--glass-blur-strong)', GLASS, '筛选弹层（外观不变）'),
    ('member-profiles.css', r'((?:-webkit-)?backdrop-filter:)blur\(16px\)(?! saturate)', r'\1var(--glass-blur)', GLASS, '作者主页分段导航，增加 115% 饱和度'),
    ('scroll-glass.css', r'((?:-webkit-)?backdrop-filter:)blur\(24px\)(?! saturate)', r'\1var(--glass-blur-strong)', GLASS, '滚动边缘，增加 115% 饱和度'),
    (None, r'color-mix\(in srgb,var\(--surface-default\) 62%,transparent\)', 'var(--glass-fill)', GLASS, '玻璃底色 62%（外观不变）'),
    (None, r'color-mix\(in srgb,var\(--surface-default\) 78%,transparent\)', 'var(--glass-fill-strong)', GLASS, '玻璃底色 78%（外观不变）'),
    ('forum.css', r'color-mix\(in srgb,var\(--text-heading\) 3%,var\(--surface-default\)\)', 'var(--fill-subtle)', FILL, '标签底色（外观不变）'),
    ('forum.css', r'color-mix\(in srgb,var\(--text-heading\) 6%,var\(--surface-default\)\)', 'var(--fill-hover)', FILL, '标签悬停（外观不变）'),
    ('forum.css', r'color-mix\(in srgb,var\(--text-heading\) 10%,var\(--surface-default\)\)', 'var(--fill-selected)', FILL, '标签选中（外观不变）'),
    ('forum.css', r'color-mix\(in srgb,var\(--text-heading\) 8%,var\(--surface-default\)\)', 'var(--fill-selected)', FILL, '标签描边 8% → 10%'),
    ('forum.css', r'color-mix\(in srgb,var\(--text-heading\) 20%,var\(--surface-default\)\)', 'var(--fill-border)', FILL, '标签选中描边（外观不变）'),
    (None, r'var\(--font-3xl\)', 'var(--type-page)', TITLE, '文章、课程详情标题 36px → 30px'),
    ('ranking.css', r'(\.ranking-(?:tree|person-tile)-codex\{[^}]*?background:)var\(--chart-violet\)', r'\1var(--chart-codex)', CHART, 'Codex 在树图中由紫色改为 Codex 蓝'),
    ('ranking.css', r'(\.ranking-(?:tree-claude|person-tile-claude-code)\{[^}]*?background:)var\(--chart-green\)', r'\1var(--chart-claude)', CHART, 'Claude 在树图中由绿色改为 Claude 色'),
    ('ranking.css', r'var\(--chart-green-strong\)', 'var(--status-success)', CHART, '接入完成圆点改用成功色'),
    ('ranking.css', r'var\(--chart-green-text\)', 'var(--status-success-text)', CHART, '个人 KPI 增长文字改用成功色'),
    ('guide-progress.css', r'var\(--illus-journey-green\)', 'var(--status-success-bg)', JOURNEY, '已完成周的底色改用成功色'),
    ('guide-progress.css', r'var\(--illus-journey-success-text\)', 'var(--status-success-text)', JOURNEY, '已完成周的文字改用成功色'),
]

TOKENS_ADD = """
/* ---------- Visual batch (T8, T9, T11) ---------- */
.nova-ds {
 --shadow-color:9 21 64;
 --shadow-sm:0 1px 3px rgb(var(--shadow-color) / .08);
 --shadow-md:0 4px 16px rgb(var(--shadow-color) / .08);
 --shadow-lg:0 12px 40px rgb(var(--shadow-color) / .12);
 --glass-fill:color-mix(in srgb,var(--surface-default) 62%,transparent);
 --glass-fill-strong:color-mix(in srgb,var(--surface-default) 78%,transparent);
 --glass-blur:blur(16px) saturate(115%);
 --glass-blur-strong:blur(24px) saturate(115%);
 --fill-subtle:color-mix(in srgb,var(--text-heading) 3%,var(--surface-default));
 --fill-hover:color-mix(in srgb,var(--text-heading) 6%,var(--surface-default));
 --fill-selected:color-mix(in srgb,var(--text-heading) 10%,var(--surface-default));
 --fill-border:color-mix(in srgb,var(--text-heading) 20%,var(--surface-default));
}
"""
# Tokens no longer referenced once the batch lands.
TOKENS_DROP = [r' --shadow-popover:0 4px 16px #1A1A1814;\n', r' /\* Pending: article and course detail titles[^\n]*\n --font-3xl:36px;\n',
               r' --chart-violet:#8070E9; --chart-green:#46AC79; --chart-green-strong:#43A77A; --chart-green-text:#31966A;',
               r' --illus-journey-green:#DDF5EC;', r' --illus-journey-success-text:#326653;', r'\s*/\* Elevation \*/\n']

changes = []
target.mkdir(parents=True, exist_ok=True)
for f in sorted(source.glob('*.css')):
    text = f.read_text()
    for file, pat, new, group, note in RULES:
        if file and file != f.name: continue
        text, n = re.subn(pat, new, text)
        if n: changes.append(dict(file=f.name, media='', selector=note, prop=group, old=pat.replace('\\', ''), new=new, kind=group, count=n))
    if f.name == 'tokens.css':
        for pat in TOKENS_DROP: text = re.sub(pat, '', text)
        text = text.replace(' --chart-orange:#EF9565;', ' --chart-orange:#EF9565;') + TOKENS_ADD
    (target / f.name).write_text(text)

summary = {}
for c in changes: summary[c['kind']] = summary.get(c['kind'], 0) + c['count']
out = root / 'design-system/scale-preview' / ('visual-applied.json' if apply else 'visual-changes.json')
out.write_text(json.dumps({'summary': summary, 'changes': changes}, ensure_ascii=False, indent=1))
print('applied' if apply else 'preview', summary)
