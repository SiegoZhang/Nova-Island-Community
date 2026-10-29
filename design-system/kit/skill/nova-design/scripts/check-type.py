"""Check that HTML/CSS files follow the Nova Island typography module.

  python3 check-type.py page.html [more files...]

Checks: font-size and the size inside the font shorthand are on the 10-step scale (11, 12, 13, 14, 16,
18, 20, 24, 30, 40px) or a known --type-* variable; clamp() bounds are on the scale; font-weight is
400 / 500 / 600 (or normal / inherit / a --weight-* variable), including keywords such as bold; each
HTML page has at most one <h1>. Exit code 1 when anything is found.

Not checked: line-height, letter-spacing, tabular-nums and which tier an element uses. An OK means the
values are on the scale, not that every element sits on the right tier.
"""
import re, sys
from pathlib import Path

SCALE = {11, 12, 13, 14, 16, 18, 20, 24, 30, 40}
ROLES = {'display', 'page', 'title-lg', 'title-md', 'title-sm', 'body-lg', 'body', 'small', 'caption', 'micro'}
WEIGHT_OK = {'400', '500', '600', 'normal', 'inherit', 'var(--weight-regular)', 'var(--weight-medium)', 'var(--weight-semibold)'}
WEIGHT_WORDS = {'bold', 'bolder', 'lighter', '100', '200', '300', '700', '800', '900'}

def size_ok(v):
    v = v.strip().rstrip(' !important')
    m = re.fullmatch(r'var\(--type-([\w-]+?)\)', v)
    if m: return m.group(1) in ROLES
    if v in ('inherit', '100%', '1em'): return True
    m = re.fullmatch(r'clamp\((.+)\)', v)
    if m:
        bounds = [b.strip() for b in m.group(1).split(',')]
        return len(bounds) == 3 and size_ok(bounds[0]) and size_ok(bounds[2])
    m = re.fullmatch(r'(\d+(?:\.\d+)?)(px|rem)', v)
    if m: return (float(m.group(1)) * (16 if m.group(2) == 'rem' else 1)) in SCALE
    return False

problems = []
for name in sys.argv[1:]:
    text = re.sub(r'/\*.*?\*/', '', Path(name).read_text(encoding='utf-8', errors='ignore'), flags=re.S)
    for m in re.finditer(r'font-size\s*:\s*([^;"}]+)', text):
        if not size_ok(m.group(1)): problems.append(f'{name}: font-size {m.group(1).strip()}')
    for m in re.finditer(r'font-weight\s*:\s*([^;"}]+)', text):
        if m.group(1).strip().replace('!important', '').strip() not in WEIGHT_OK: problems.append(f'{name}: font-weight {m.group(1).strip()}')
    for m in re.finditer(r'(?<![\w-])font\s*:\s*([^;"}]+)', text):
        parts = re.split(r'\s+(?![^(]*\))', m.group(1).strip())
        size = next((p.split('/')[0] for p in parts if re.match(r'(\d|var\(--type|clamp)', p.split('/')[0]) and not re.fullmatch(r'\d{3}', p)), None)
        if any(p in WEIGHT_WORDS for p in parts): problems.append(f'{name}: font {m.group(1).strip()}（字重不在 400/500/600 内）')
        if size is None or not size_ok(size): problems.append(f'{name}: font {m.group(1).strip()}（字号不在阶梯内）')
    h1 = len(re.findall(r'<h1[\s>]', text, re.I))
    if name.endswith('.html') and h1 > 1:
        problems.append(f'{name}: 有 {h1} 个 <h1>，每页只能有一个')
print('\n'.join(problems) or 'OK：字号和字重都在文字模块的阶梯内，页面只有一个 H1。')
sys.exit(1 if problems else 0)
