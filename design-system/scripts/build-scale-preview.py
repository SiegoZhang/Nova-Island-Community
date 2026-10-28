"""Map prototype CSS onto the SCALE-PROPOSAL.md scale (D1–D8).

The mapping below is the executable form of the proposal's migration tables.
  python3 design-system/scripts/build-scale-preview.py          writes a normalized copy to design-system/scale-preview/
  python3 design-system/scripts/build-scale-preview.py --apply  rewrites html-pages/prototype/assets/*.css in place, keeping comments
"""
from pathlib import Path
import re, json, sys

root = Path(__file__).resolve().parents[2]
source = root / 'html-pages/prototype/assets'
target = root / 'design-system/scale-preview/normalized'

# Illustration text, glyph icons and avatar initials stay outside the scale.
ILLUS = re.compile(r'mini-site|browser-bar|portal-book|portal-note|portal-quote|paper-|memory-|cover-|flow-node|task-tickets|'
                   r'folder-[\w-]*cover|tour-folder|art-label|art-caption|voice-bubbles|soundwave|note-source|note-dest|review-title|'
                   r'tools-title|process-loop|mini-workflow|guide-mini|guide-folder-(?:lines|symbol|sheet|front|back)|model-symbol|'
                   r'avatar|top-search>span|journey-lesson-arrow|forum-format-tools button|mobile-close|dismiss-guide|course-arrow')
MAX_BP = {1150: 1100, 1200: 1100, 1000: 1100, 980: 1100, 900: 1100, 850: 760, 800: 760,
          650: 600, 540: 600, 520: 600, 480: 600, 400: 600, 380: 600}
MIN_BP = {1201: 1441, 1200: 1440, 1001: 1101, 901: 1101, 651: 601, 1500: 1440, 1600: 1440, 1800: 1440}

changes = []

def px(n): return f'{n:g}px'

def font_size(n, sel, mobile):
    if ILLUS.search(sel): return n
    if n in (6, 7, 8): return 11 if 'ranking-badges' in sel else n
    if n in (9, 10): return 11
    if n == 15: return 16
    if n == 17: return 16 if 'reader-intro' in sel else 18
    if n == 19: return 18
    if n == 20: return 24 if mobile and 'feed-heading h1' in sel else 20
    if n == 21: return 20
    if n == 22:
        if 'feed-heading h1' in sel: return 24 if mobile else 30
        if re.search(r'kpis b|stats dd', sel): return 24
        return 20
    if n == 25: return 24
    if n == 26: return 30 if not mobile and 'h1' in sel else 24
    if n in (28, 32): return 30
    if n == 42: return 40
    return n

def radius(n, sel):
    if ILLUS.search(sel): return n
    if n in (2, 3, 5): return 4
    if n in (6, 7, 9): return 8
    if n in (10, 16, 18): return 12
    if n == 14: return 20
    if n == 24 and re.search(r'ranking-connect-tabs|site-tour button', sel): return 999
    return n

SPACE = {5: 4, 6: 8, 7: 8, 9: 8, 22: 24, 36: 32, 42: 40, 46: 48, 52: 48, 60: 64, -10: -8}
SPACE_BY_KIND = {10: {'padding': 12, 'gap': 8, 'margin': 12}, 14: {'padding': 12, 'gap': 12, 'margin': 16},
                 18: {'padding': 16, 'gap': 16, 'margin': 20}, 28: {'padding': 24, 'gap': 24, 'margin': 32},
                 44: {'padding': 40, 'gap': 40, 'margin': 48}, 56: {'padding': 48, 'gap': 48, 'margin': 64}}

def spacing(n, kind, sel, file):
    if ILLUS.search(sel): return n
    if n == 2: return 4 if kind == 'gap' else 2
    if n == 3: return 3 if file == 'feed-filters.css' else 4
    if n in SPACE_BY_KIND: return SPACE_BY_KIND[n][kind]
    return SPACE.get(n, n)

def map_px(value, fn):
    return re.sub(r'(?<![\w.-])(-?\d+(?:\.\d+)?)px', lambda m: px(fn(float(m.group(1)))), value)

def rewrite(file, media, sel, prop, value):
    mobile = bool(re.search(r'max-width:\s*(\d+)px', media)) and min(int(x) for x in re.findall(r'max-width:\s*(\d+)px', media)) <= 760
    p = prop.lower()
    if p == 'font-size' and not re.search(r'clamp|calc|var|cqw|vw', value):
        return map_px(value, lambda n: font_size(n, sel, mobile)), 'font-size'
    if p == 'font':
        return re.sub(r'(?<![\w./-])(\d+(?:\.\d+)?)px', lambda m: px(font_size(float(m.group(1)), sel, mobile)), value, count=1), 'font-size'
    if p == 'font-weight' and value.startswith('700'):
        return value.replace('700', '600', 1), 'font-weight'
    if 'radius' in p and not re.search(r'calc|var', value):
        return map_px(value, lambda n: radius(n, sel)), 'radius'
    kind = re.match(r'(padding|margin|gap|row-gap|column-gap)(?:-|$)', p)
    if kind and not re.search(r'calc|var|clamp|min\(|max\(', value):
        k = 'gap' if 'gap' in kind.group(1) else kind.group(1)
        return map_px(value, lambda n: spacing(n, k, sel, file)), 'spacing'
    return value, None

def split_decls(body):
    """Split on ; outside quotes and parentheses (data URIs contain semicolons)."""
    parts, depth, quote, start = [], 0, None, 0
    for i, ch in enumerate(body):
        if quote:
            if ch == quote: quote = None
        elif ch in '"\'': quote = ch
        elif ch == '(': depth += 1
        elif ch == ')': depth -= 1
        elif ch == ';' and depth == 0:
            parts.append(body[start:i]); start = i + 1
    parts.append(body[start:])
    return parts

def remap_media(head):
    head = re.sub(r'max-width:\s*(\d+)px', lambda m: f'max-width:{MAX_BP.get(int(m.group(1)), int(m.group(1)))}px', head)
    return re.sub(r'min-width:\s*(\d+)px', lambda m: f'min-width:{MIN_BP.get(int(m.group(1)), int(m.group(1)))}px', head)

def walk(css, file, media=''):
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0: out.append(css[i:]); break
        head = css[i:j]
        depth, k = 1, j + 1
        while depth and k < len(css):
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        h = re.sub(r'\x00\d+\x00', '', head).strip()
        if h.startswith('@media'):
            new_head = remap_media(head)
            if new_head != head: changes.append(dict(file=file, media=media, selector=h, prop='@media', old=h, new=new_head.strip(), kind='breakpoint'))
            out.append(new_head + '{' + walk(body, file, (media + ' ' + h).strip()) + '}')
        elif h.startswith(('@supports', '@container', '@layer')):
            out.append(head + '{' + walk(body, file, media) + '}')
        elif h.startswith('@'):
            out.append(head + '{' + body + '}')
        else:
            decls = []
            for d in split_decls(body):
                m = re.match(r'((?:\s|\x00\d+\x00)*)([\w-]+)(\s*:\s*)(.*?)((?:\s|\x00\d+\x00)*)$', d, re.S)
                if not m or m.group(2).startswith('--'): decls.append(d); continue
                new, kind = rewrite(file, media, h, m.group(2), m.group(4))
                if kind and new != m.group(4):
                    changes.append(dict(file=file, media=media, selector=h, prop=m.group(2), old=m.group(4), new=new, kind=kind))
                decls.append(m.group(1) + m.group(2) + m.group(3) + new + m.group(5))
            out.append(head + '{' + ';'.join(decls) + '}')
        i = k
    return ''.join(out)

if '--apply' in sys.argv:
    # Comments are masked so braces and semicolons inside them cannot confuse the walker.
    for f in sorted(source.glob('*.css')):
        if f.name == 'tokens.css': continue
        comments = []
        def mask(m): comments.append(m.group(0)); return f'\x00{len(comments) - 1}\x00'
        css = walk(re.sub(r'/\*.*?\*/', mask, f.read_text(), flags=re.S), f.name)
        f.write_text(re.sub(r'\x00(\d+)\x00', lambda m: comments[int(m.group(1))], css))
    kinds = {}
    for c in changes: kinds[c['kind']] = kinds.get(c['kind'], 0) + 1
    (root / 'design-system/scale-preview/applied-changes.json').write_text(json.dumps({'summary': kinds, 'changes': changes}, ensure_ascii=False, indent=1))
    print('applied', kinds, 'total', len(changes))
    sys.exit()

target.mkdir(parents=True, exist_ok=True)
for f in sorted(source.glob('*.css')):
    css = re.sub(r'/\*.*?\*/', '', f.read_text(), flags=re.S)
    if f.name == 'tokens.css':
        # D5 control radius; D8 one readable secondary gray on every page.
        css = css.replace('--radius-md:6px', '--radius-md:8px')
        css += ('\n.nova-ds:not([data-theme="dark"]),.nova-ds:not([data-theme="dark"]):not(:has(.ranking-page)){'
                '--text-secondary:#626262;--text-tertiary:#626262;--text-helper:#626262}\n')
        changes += [dict(file=f.name, media='', selector='.nova-ds', prop='--radius-md', old='6px', new='8px', kind='radius'),
                    dict(file=f.name, media='', selector='.nova-ds', prop='--text-secondary / tertiary / helper',
                         old='#707070 / #949494 / #6B7280（榜单）；#626262 / #666666（普通页）', new='#626262', kind='color')]
    else:
        css = walk(css, f.name)
    (target / f.name).write_text(css)

kinds = {}
for c in changes: kinds[c['kind']] = kinds.get(c['kind'], 0) + 1
(target.parent / 'changes.json').write_text(json.dumps({'summary': kinds, 'changes': changes}, ensure_ascii=False, indent=1))
print('changes', kinds, 'total', len(changes))
