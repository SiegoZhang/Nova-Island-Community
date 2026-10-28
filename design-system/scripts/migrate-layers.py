"""COMPONENT-LAYER.md C1–C2: one entry stylesheet with cascade layers, and !important moved into an overrides layer.

Kept on purpose: !important inside prefers-reduced-motion (must beat inline animation styles) and
display:none (hiding must win). Everything else becomes a plain declaration in overrides.css,
which sits in the last layer and therefore wins without !important.
  python3 design-system/scripts/migrate-layers.py
"""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
proto = root / 'html-pages/prototype'
assets = proto / 'assets'

# Union of the three pages' load orders; index.html and the detail pages agree except for forum.css,
# which follows home.css here (index.html order). Computed-style checks confirm the result.
ORDER = ['styles', 'page-entrance', 'article-contents', 'article-reader', 'course-detail', 'html-pages', 'home',
         'detail-shell', 'forum', 'guide-progress', 'member-profiles', 'page-loading', 'ranking', 'workspace-header',
         'section-headings', 'site-tour', 'back-buttons', 'feed-filters', 'scroll-glass', 'channel-gooey',
         'article-interactions']

def keep_important(media, prop, value):
    return 'prefers-reduced-motion' in media or (prop == 'display' and value.startswith('none'))

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

overrides = []
def walk(css, media):
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0: out.append(css[i:]); break
        head = css[i:j]; depth, k = 1, j + 1
        while depth and k < len(css):
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]; h = re.sub(r'\x00\d+\x00', '', head).strip()
        if h.startswith(('@media', '@supports')):
            out.append(head + '{' + walk(body, media + [h]) + '}')
        elif h.startswith('@'):
            out.append(head + '{' + body + '}')
        else:
            keep, moved = [], []
            for d in split_decls(body):
                m = re.match(r'(\s*)([\w-]+)(\s*:\s*)(.*?)\s*!important\s*$', d, re.S)
                if m and not keep_important(' '.join(media), m.group(2), m.group(4)):
                    moved.append(f'{m.group(2)}:{m.group(4)}')
                else: keep.append(d)
            if moved: overrides.append((media, h, moved))
            out.append(head + '{' + ';'.join(keep) + '}')
        i = k
    return ''.join(out)

for name in ORDER:
    f = assets / f'{name}.css'
    comments = []
    def mask(m): comments.append(m.group(0)); return f'\x00{len(comments) - 1}\x00'
    css = walk(re.sub(r'/\*.*?\*/', mask, f.read_text(), flags=re.S), [])
    f.write_text(re.sub(r'\x00(\d+)\x00', lambda m: comments[int(m.group(1))], css))

lines = ['/* Declarations that must win over component and page rules. Former !important, now ordered by the',
         '   overrides layer in nova.css. Keep this file short; prefer fixing the component instead. */']
for media, sel, decls in overrides:
    rule = f'{sel}{{{";".join(decls)}}}'
    for q in reversed(media): rule = f'{q}{{{rule}}}'
    lines.append(rule)
(assets / 'overrides.css').write_text('\n'.join(lines) + '\n')

entry = ['/* Nova Island prototype stylesheet entry. Layers decide precedence; load order inside a layer still matters. */',
         '@layer tokens, components, overrides;',
         '@import url("tokens.css") layer(tokens);']
entry += [f'@import url("{n}.css") layer(components);' for n in ORDER]
entry += ['@import url("overrides.css") layer(overrides);']
(assets / 'nova.css').write_text('\n'.join(entry) + '\n')

for page in ['index.html', 'article.html', 'course.html']:
    p = proto / page; t = p.read_text()
    links = re.findall(r'<link rel="stylesheet" href="assets/[\w-]+\.css[^"]*">\n?', t)
    first = t.index(links[0])
    for l in links: t = t.replace(l, '', 1)
    t = t[:first] + '<link rel="stylesheet" href="assets/nova.css?v=layers-20261028">\n' + t[first:]
    p.write_text(t)
print('moved', sum(len(d) for _, _, d in overrides), 'declarations into overrides.css;',
      'kept', sum(f.read_text().count('!important') for f in assets.glob('*.css')), '!important')
