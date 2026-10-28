"""Check prototype CSS against the scriptable design rules (design-system/principles.html).

  python3 design-system/scripts/check-design.py                    new violations only (exit 1 if any)
  python3 design-system/scripts/check-design.py --all              every violation, including known ones
  python3 design-system/scripts/check-design.py --update-baseline  accept the current state as known

Known violations live in design-system/check-baseline.json, so an agent sees only what its own
change introduced. Fixing an old violation is welcome; it simply disappears from the report.
"""
from pathlib import Path
import re, sys, json
from collections import Counter

root = Path(__file__).resolve().parents[2]
assets = root / 'html-pages/prototype/assets'
baseline_file = root / 'design-system/check-baseline.json'

# Illustrations, glyph icons and avatar initials are exempt from the scale rules.
ILLUS = re.compile(r'mini-|browser-bar|portal-|paper-|memory-|cover-|flow-node|task-tickets|folder|tour-folder|art-label|'
                   r'voice-bubbles|soundwave|note-source|note-dest|review-|tools-title|process-loop|guide-mini|guide-banner|'
                   r'loose-logo|trophy|model-symbol|avatar|top-search>span|journey-lesson-arrow|forum-format-tools button|'
                   r'mobile-close|dismiss-guide|course-arrow|orb|skeleton|reaction-burst|site-tour-ring')
TYPE_OK = re.compile(r'^var\(--type-[\w-]+\)$')
BREAKPOINTS = {600, 601, 760, 761, 1100, 1101, 1440, 1441}
SCALE = {4, 8, 12, 16, 20, 24, 32, 40, 48, 64}
COLOR = re.compile(r'#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)')

def split_decls(body):
    parts, depth, quote, start = [], 0, None, 0
    for i, ch in enumerate(body):
        if quote:
            if ch == quote: quote = None
        elif ch in '"\'': quote = ch
        elif ch == '(': depth += 1
        elif ch == ')': depth -= 1
        elif ch == ';' and depth == 0: parts.append(body[start:i]); start = i + 1
    parts.append(body[start:]); return parts

found = []
def report(rule, file, sel, detail): found.append({'rule': rule, 'file': file, 'selector': sel[:120], 'detail': detail[:140]})

def check_decl(file, media, sel, prop, value):
    p = prop.lower(); v = value.strip(); illus = bool(ILLUS.search(sel))
    if v.endswith('!important') and 'prefers-reduced-motion' not in media and not (p == 'display' and v.startswith('none')):
        report('R19', file, sel, f'{p}: {v}')
    v = v.replace('!important', '').strip()
    if p.startswith('--') or illus: return
    if 'mask' not in p and COLOR.search(v):
        report('R1', file, sel, f'{p}: {v}')
    if p == 'font-size' and not TYPE_OK.match(v) and not re.search(r'clamp|em\b|%|inherit', v):
        report('R2', file, sel, f'{p}: {v}')
    if 'radius' in p and re.search(r'(?<![\w.-])[1-9]\d*px', v) and not re.search(r'calc|var\(', v):
        report('R4', file, sel, f'{p}: {v}')
    if re.match(r'(padding|margin|gap|row-gap|column-gap)(-|$)', p) and not re.search(r'calc|clamp|min\(|max\(', v):
        for n in re.findall(r'(?<![\w.-])(-?\d+(?:\.\d+)?)px', v):
            n = float(n)
            # Negative offsets that mirror a scale step are layout compensation, not new spacing.
            if n in (0, 2) or (n == 3 and file == 'feed-filters.css') or abs(n) >= 72 or (n < 0 and abs(n) in SCALE): continue
            report('R5', file, sel, f'{p}: {v}'); break
    if p == 'box-shadow' and v != 'none' and 'var(--shadow' not in v:
        outer = [s for s in re.split(r',(?![^(]*\))', v) if 'inset' not in s]
        if outer: report('R11', file, sel, f'{p}: {v}')
    if p in ('outline', 'outline-style') and re.match(r'(none|0)\b', v):
        report('R18', file, sel, f'{p}: {v}')

def walk(css, file, media=''):
    i = 0
    while True:
        j = css.find('{', i)
        if j < 0: return
        head = css[i:j].strip(); depth, k = 1, j + 1
        while depth and k < len(css):
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        if head.startswith('@media'):
            for w in re.findall(r'(?:max|min)-width:\s*(\d+)px', head):
                if int(w) not in BREAKPOINTS: report('R6', file, head, head)
            walk(body, file, media + ' ' + head)
        elif head.startswith(('@supports', '@container', '@layer')):
            walk(body, file, media)
        elif not head.startswith('@'):
            for d in split_decls(body):
                m = re.match(r'\s*([\w-]+)\s*:\s*(.+?)\s*$', d, re.S)
                if m: check_decl(file, media, head, m.group(1), m.group(2))
        i = k

for f in sorted(assets.glob('*.css')):
    if f.name in ('tokens.css', 'nova.css', 'app.css', 'reader.css', 'course.css'): continue
    walk(re.sub(r'/\*.*?\*/', '', f.read_text(), flags=re.S), f.name)

key = lambda x: f"{x['rule']}|{x['file']}|{x['selector']}|{x['detail']}"
if '--update-baseline' in sys.argv:
    baseline_file.write_text(json.dumps(sorted(Counter(map(key, found)).items()), ensure_ascii=False, indent=0))
    print(f'Baseline updated: {len(found)} known violations.'); sys.exit()

known = Counter(dict(json.loads(baseline_file.read_text()))) if baseline_file.exists() else Counter()
shown = found if '--all' in sys.argv else []
if not shown:
    seen = Counter()
    for x in found:
        seen[key(x)] += 1
        if seen[key(x)] > known[key(x)]: shown.append(x)
names = {'R1': '写死的颜色', 'R2': '阶梯外字号', 'R4': '写死的圆角', 'R5': '阶梯外间距', 'R6': '非标准断点',
         'R11': '写死的阴影', 'R18': '去掉了焦点轮廓', 'R19': '新增 !important'}
for x in shown:
    print(f"{x['rule']} {names[x['rule']]}  {x['file']}  {x['selector']}\n      {x['detail']}")
label = '全部违规' if '--all' in sys.argv else '新增违规'
print(f"\n{label} {len(shown)} 处" + (f"（已知 {sum(known.values())} 处，见 check-baseline.json）" if '--all' not in sys.argv else '')
      + '：' + '、'.join(f'{r} {n}' for r, n in sorted(Counter(x['rule'] for x in shown).items())))
sys.exit(1 if shown and '--all' not in sys.argv else 0)
