"""Audit hardcoded scale values in the prototype CSS.

Usage: python3 design-system/scripts/audit-scale.py html-pages/prototype out.json
       python3 design-system/scripts/audit-scale.py html-pages/prototype /dev/null where 13px,15px font-size
"""
import re, sys, json
from pathlib import Path
from collections import Counter, defaultdict

root = Path(sys.argv[1])
files = sorted(p for p in (root / 'assets').glob('*.css') if p.name != 'tokens.css')

decls = []  # (file, media, selector, prop, value)
def walk(css, file, media=''):
    i = 0
    while i < len(css):
        j = css.find('{', i)
        if j < 0: break
        head = css[i:j].strip()
        depth, k = 1, j + 1
        while depth and k < len(css):
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        if head.startswith('@media') or head.startswith('@supports') or head.startswith('@container'):
            walk(body, file, (media + ' ' + head).strip())
        elif head.startswith('@keyframes') or head.startswith('@font-face'):
            pass
        else:
            for prop, val in re.findall(r'([\w-]+)\s*:\s*([^;]+)', body):
                decls.append((file, media, head, prop.strip().lower(), val.strip()))
        i = k

for f in files:
    css = re.sub(r'/\*.*?\*/', '', f.read_text(), flags=re.S)
    walk(css, f.name)

out = {}
# Font sizes
fs = Counter(); fs_files = defaultdict(Counter); fs_lh = defaultdict(Counter)
rules = defaultdict(dict)
for f, m, s, p, v in decls: rules[(f, m, s)][p] = v
for (f, m, s), props in rules.items():
    size = props.get('font-size')
    lh = props.get('line-height')
    if 'font' in props:
        mm = re.match(r'(?:[\w-]+\s+)*?(\d+(?:\.\d+)?px)(?:/([\d.]+(?:px)?))?', props['font'])
        if mm: size = size or mm.group(1); lh = lh or mm.group(2)
    if size:
        fs[size] += 1; fs_files[size][f] += 1
        if lh: fs_lh[size][lh] += 1
out['font_size'] = {k: {'count': c, 'files': dict(fs_files[k]), 'line_heights': dict(fs_lh[k])} for k, c in fs.most_common()}

# Radius
rad = Counter(); rad_files = defaultdict(Counter)
for f, m, s, p, v in decls:
    if 'radius' in p:
        for t in re.findall(r'var\([^)]*\)|calc\([^)]*\)|[\d.]+(?:px|%|em|rem)?', v):
            rad[t] += 1; rad_files[t][f] += 1
out['radius'] = {k: {'count': c, 'files': dict(rad_files[k])} for k, c in rad.most_common()}

# Spacing
sp = Counter(); sp_prop = defaultdict(Counter)
for f, m, s, p, v in decls:
    if re.fullmatch(r'(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?|(row-|column-)?gap', p):
        for t in re.findall(r'var\([^)]*\)|-?[\d.]+px', v):
            sp[t] += 1; sp_prop[t][p.split('-')[0]] += 1
out['spacing'] = {k: {'count': c, 'props': dict(sp_prop[k])} for k, c in sp.most_common()}

# Breakpoints
bp = Counter(); bp_files = defaultdict(Counter)
for f in files:
    for q in re.findall(r'@media([^{]*)\{', f.read_text()):
        for w in re.findall(r'(max|min)-width:\s*(\d+)px', q):
            key = f'{w[0]}-{w[1]}'; bp[key] += 1; bp_files[key][f.name] += 1
out['breakpoints'] = {k: {'count': c, 'files': dict(bp_files[k])} for k, c in bp.most_common()}

# Colors
col = Counter(); col_ctx = defaultdict(Counter); col_files = defaultdict(Counter)
for f, m, s, p, v in decls:
    if p.startswith('--'): pass
    for t in re.findall(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)', v):
        t = t.upper() if t.startswith('#') else re.sub(r'\s+', '', t)
        col[t] += 1; col_ctx[t][p] += 1; col_files[t][f] += 1
out['color'] = {k: {'count': c, 'props': dict(col_ctx[k]), 'files': dict(col_files[k])} for k, c in col.most_common()}

# Tokens actually referenced
tok = Counter()
for f, m, s, p, v in decls:
    for t in re.findall(r'var\((--[\w-]+)', v): tok[t] += 1
out['token_usage'] = dict(tok.most_common())
out['important'] = sum(v.count('!important') for *_, v in decls)
out['files'] = [f.name for f in files]
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)

def show(name, n=60):
    d = out[name]
    print(f'== {name}: {len(d)} distinct, {sum(x["count"] for x in d.values())} uses')
    print('  '.join(f'{k}×{v["count"]}' for k, v in list(d.items())[:n]))
for n in ['font_size', 'radius', 'spacing', 'breakpoints']: show(n)
show('color', 80)
print('important', out['important'])

if len(sys.argv) > 3 and sys.argv[3] == 'where':
    want = set(sys.argv[4].split(','))
    prop = sys.argv[5] if len(sys.argv) > 5 else 'font-size'
    for (f, m, s), props in rules.items():
        v = props.get(prop)
        if v is None and prop == 'font-size' and 'font' in props:
            mm = re.search(r'(\d+px)', props['font']); v = mm and mm.group(1)
        if v and any(re.search(r'(?<![\d.])' + re.escape(w) + r'(?![\d])', v) for w in want):
            print(f'{v:10} {f:22} {m[:30]:30} {s[:110]}')
