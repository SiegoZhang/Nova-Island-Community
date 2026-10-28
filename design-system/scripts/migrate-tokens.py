"""Apply TOKEN-PROPOSAL.md T2–T7, T10, T12, T13 without visual change.

Renames merged aliases, replaces on-scale literals with tokens and moves expressive
colors into tokens.css. Run once from the project root; prints what is left over.
  python3 design-system/scripts/migrate-tokens.py
"""
from pathlib import Path
import re, json

root = Path(__file__).resolve().parents[2]
proto = root / 'html-pages/prototype'

RENAME = {
    'nova-accent': 'accent', 'brand-primary': 'accent', 'accent-active': 'accent',
    'text-hover': 'accent-text', 'brand-hover': 'accent-text', 'selection-text': 'accent-text',
    'selection-bg': 'accent-surface', 'brand-subtle': 'accent-surface', 'border-card-hover': 'accent-border',
    'shell-bg': 'surface-canvas', 'bg-primary': 'surface-default', 'shell-surface': 'surface-default',
    'bg-secondary': 'surface-secondary', 'control-bg': 'surface-secondary',
    'text-tertiary': 'text-secondary', 'text-helper': 'text-secondary', 'text-on-brand': 'text-on-accent',
    'border-control': 'border-strong', 'control-border': 'border-strong', 'border-muted': 'border-default',
    'neutral-paper': 'neutral-0', 'neutral-linen': 'neutral-50', 'neutral-ash': 'neutral-100', 'neutral-pearl': 'neutral-200',
    'neutral-mist': 'neutral-300', 'neutral-fog': 'neutral-400', 'neutral-iron': 'neutral-600',
    'neutral-graphite': 'neutral-800', 'neutral-ink': 'neutral-900',
    'radius-sm': 'radius-xs', 'radius-md': 'radius-sm', 'radius-lg': 'radius-sm', 'shell-radius': 'radius-card',
    'font-xs': 'type-micro', 'font-sm': 'type-caption', 'font-md': 'type-body', 'font-lg': 'type-body-lg',
    'font-xl': 'type-title-md', 'font-2xl': 'type-title-lg', 'line-body': 'type-body-lh',
    'illustration-blue': 'illus-blue', 'illustration-blue-depth': 'illus-blue-depth',
    'reaction-saved': 'reaction-saved-text',
    **{f'cover-{k}': f'illus-cover-{k}' for k in ['ink', 'blue', 'paper', 'lilac', 'sage', 'dark', 'on-dark', 'subtle-on-dark']},
    **{f'portal-{k}': f'illus-portal-{k}' for k in ['navy', 'mist', 'soft', 'paper', 'accent']},
    **{f'journey-{k}': f'illus-journey-{k}' for k in ['green', 'peach', 'success-text']},
}
REMOVED = ['neutral-slate', 'neutral-cool-gray', 'neutral-steel', 'shadow-none', 'shadow-sm', 'icon-size']
# Definitions that move into tokens.css (T12) are dropped from component files.
MOVED_DEFS = re.compile(r'--(?:cover-(?:ink|blue|paper|lilac|sage|dark|on-dark|subtle-on-dark)|portal-(?:navy|mist|soft|paper|accent)|journey-(?:green|peach|success-text))\s*:[^;}]*;?')
COLORS = [
    (r'var\(--reaction-liked,\s*#BF2531\)', 'var(--reaction-liked)'),
    (r'var\(--reaction-saved,\s*#80631B\)', 'var(--reaction-saved-text)'),
    (r'#F5C842\b', 'var(--reaction-saved-icon)'), (r'#E6AE25\b', 'var(--reaction-saved-icon-deep)'),
    (r'#8070E9\b', 'var(--chart-violet)'), (r'#46AC79\b', 'var(--chart-green)'), (r'#43A77A\b', 'var(--chart-green-strong)'),
    (r'#31966A\b', 'var(--chart-green-text)'), (r'#EF9565\b', 'var(--chart-orange)'), (r'#542712\b', 'var(--chart-claude-ink)'),
    (r'--ranking-claude:\s*#D99B80', '--ranking-claude:var(--chart-claude)'),
    (r'--ranking-claude:\s*#C7A794', '--ranking-claude:var(--chart-claude-soft)'),
    (r'--ranking-claude:\s*#EB976D', '--ranking-claude:var(--chart-claude-bright)'),
    (r'--star-light:\s*#FFF4C7;\s*--star-color:\s*#DFB452', '--star-light:var(--illus-star-gold-light);--star-color:var(--illus-star-gold)'),
    (r'--star-light:\s*#F1F6FF;\s*--star-color:\s*#9AAEC7', '--star-light:var(--illus-star-silver-light);--star-color:var(--illus-star-silver)'),
    (r'--star-light:\s*#FFE6CF;\s*--star-color:\s*#CB895E', '--star-light:var(--illus-star-bronze-light);--star-color:var(--illus-star-bronze)'),
]

ILLUS = re.compile(r'mini-site|browser-bar|portal-book|portal-note|portal-quote|paper-|memory-|cover-|flow-node|task-tickets|'
                   r'folder-[\w-]*cover|tour-folder|art-label|art-caption|voice-bubbles|soundwave|note-source|note-dest|review-title|'
                   r'tools-title|process-loop|mini-workflow|guide-mini|guide-folder-(?:lines|symbol|sheet|front|back)|model-symbol|'
                   r'avatar|top-search>span|journey-lesson-arrow|forum-format-tools button|mobile-close|dismiss-guide|course-arrow')
TYPE = {11: 'micro', 12: 'caption', 13: 'small', 14: 'body', 16: 'body-lg', 18: 'title-sm', 20: 'title-md', 24: 'title-lg', 30: 'page', 40: 'display'}
SPACE = {4: 1, 8: 2, 12: 3, 16: 4, 20: 5, 24: 6, 32: 8, 40: 10, 48: 12, 64: 16}
RADIUS = {4: 'xs', 8: 'sm', 12: 'md', 20: 'lg', 24: 'card', 999: 'full'}
COMPUTED = re.compile(r'calc|clamp|min\(|max\(|var\(|cqw|vw|vh')

log = {'rename': 0, 'font-size': 0, 'spacing': 0, 'radius': 0, 'color': 0, 'moved-defs': 0}

def literal(value, table, fmt):
    def rep(m):
        n = float(m.group(1))
        if n.is_integer() and int(n) in table:
            return fmt(table[int(n)])
        return m.group(0)
    return re.sub(r'(?<![\w.-])(\d+(?:\.\d+)?)px', rep, value)

def rewrite(sel, prop, value):
    p = prop.lower()
    if ILLUS.search(sel) or COMPUTED.search(value):
        return value, None
    if p == 'font-size':
        return literal(value, TYPE, lambda t: f'var(--type-{t})'), 'font-size'
    if 'radius' in p:
        return literal(value, RADIUS, lambda t: f'var(--radius-{t})'), 'radius'
    if re.match(r'(padding|margin|gap|row-gap|column-gap)(-|$)', p):
        return literal(value, SPACE, lambda t: f'var(--space-{t})'), 'spacing'
    return value, None

def split_decls(body):
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

def walk(css):
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
        if h.startswith(('@media', '@supports', '@container', '@layer')):
            out.append(head + '{' + walk(body) + '}')
        elif h.startswith('@'):
            out.append(head + '{' + body + '}')
        else:
            decls = []
            for d in split_decls(body):
                m = re.match(r'((?:\s|\x00\d+\x00)*)([\w-]+)(\s*:\s*)(.*?)((?:\s|\x00\d+\x00)*)$', d, re.S)
                if not m or m.group(2).startswith('--'): decls.append(d); continue
                new, kind = rewrite(h, m.group(2), m.group(4))
                if kind and new != m.group(4): log[kind] += new.count('var(--') - m.group(4).count('var(--')
                decls.append(m.group(1) + m.group(2) + m.group(3) + new + m.group(5))
            out.append(head + '{' + ';'.join(decls) + '}')
        i = k
    return ''.join(out)

def rename(text):
    def rep(m):
        log['rename'] += 1
        return '--' + RENAME[m.group(1)]
    names = '|'.join(sorted(map(re.escape, RENAME), key=len, reverse=True))
    return re.sub(rf'--({names})(?![\w-])', rep, text)

def migrate_css(text):
    comments = []
    def mask(m): comments.append(m.group(0)); return f'\x00{len(comments) - 1}\x00'
    text = re.sub(r'/\*.*?\*/', mask, text, flags=re.S)
    text, n = MOVED_DEFS.subn('', text); log['moved-defs'] += n
    for pat, new in COLORS:
        text, n = re.subn(pat, new, text, flags=re.I); log['color'] += n
    text = rename(text)
    text = walk(text)
    text = re.sub(r'\{\s*;*\s*\}', '{}', text)  # rules emptied by moved definitions stay valid
    return re.sub(r'\x00(\d+)\x00', lambda m: comments[int(m.group(1))], text)

targets = [p for p in (proto / 'assets').glob('*.css') if p.name != 'tokens.css']
for f in targets:
    f.write_text(migrate_css(f.read_text()))
for f in list((proto / 'assets').glob('*.js')) + list(proto.glob('*.html')):
    t = f.read_text(); n = rename(t)
    if n != t: f.write_text(n)
# Design-system library previews reuse product tokens.
for f in [root / 'design-system/library/library.css', root / 'design-system/library/preview.css',
          root / 'design-system/library/preview.js', root / 'design-system/library/library.js',
          root / 'design-system/scripts/build-library.py']:
    t = f.read_text(); n = rename(t)
    if n != t: f.write_text(n)

# Leftovers: old names still referenced anywhere in the prototype.
old = '|'.join(sorted(map(re.escape, list(RENAME) + REMOVED), key=len, reverse=True))
left = {}
for f in list((proto / 'assets').glob('*')) + list(proto.glob('*.html')):
    if f.suffix in ('.css', '.js', '.html'):
        hits = re.findall(rf'--(?:{old})(?![\w-])', f.read_text())
        if hits: left[f.name] = sorted(set(hits))
print(json.dumps({'changes': log, 'leftover-old-names': left}, ensure_ascii=False, indent=1))
