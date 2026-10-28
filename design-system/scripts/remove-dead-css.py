"""Remove CSS selectors whose classes never appear in the prototype or the design-system site (COMPONENT-LAYER.md C3).

A class is in use when it appears as a literal in any HTML, JS or JSON source, or matches a template
prefix such as `ranking-tool-${tool}` / 'cover-' + x. A selector is dead when it needs a dead class
outside :not(); dead selectors are dropped from selector lists and empty rules are removed.
  python3 design-system/scripts/remove-dead-css.py           report only
  python3 design-system/scripts/remove-dead-css.py --apply   rewrite html-pages/prototype/assets/*.css
"""
from pathlib import Path
import re, sys, json

root = Path(__file__).resolve().parents[2]
assets = root / 'html-pages/prototype/assets'
sources = [*assets.glob('*.js'), *(root / 'html-pages/prototype').glob('*.html'), *(root / 'html-pages').glob('*.html'),
           *(root / 'design-system').glob('*.html'), *(root / 'design-system/library').glob('*'),
           *(root / 'design-system/assets').glob('*.js'), root / 'design-system/scripts/build-library.py']
text = '\n'.join(p.read_text(errors='ignore') for p in sources if p.is_file())
words = set(re.findall(r'[A-Za-z][\w-]+', text))
prefixes = set(re.findall(r'([a-z][\w-]*-)\$\{', text)) | set(re.findall(r'["\'`]([a-z][\w-]*-)["\'`]\s*\+', text))

def used(cls): return cls in words or any(cls.startswith(p) for p in prefixes)

def selector_dead(sel):
    outside = re.sub(r':not\((?:[^()]|\([^()]*\))*\)', '', sel)  # classes inside :not() keep the selector alive
    return any(not used(c) for c in re.findall(r'\.([A-Za-z][\w-]*)', outside))

def split_list(sel):
    parts, depth, start = [], 0, 0
    for i, ch in enumerate(sel):
        if ch == '(': depth += 1
        elif ch == ')': depth -= 1
        elif ch == ',' and depth == 0: parts.append(sel[start:i]); start = i + 1
    parts.append(sel[start:]); return parts

removed = {}
def walk(css, name):
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0: out.append(css[i:]); break
        head = css[i:j]; depth, k = 1, j + 1
        while depth and k < len(css):
            depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        h = re.sub(r'\x00\d+\x00', '', head).strip()
        if h.startswith(('@media', '@supports', '@container', '@layer')):
            inner = walk(body, name)
            out.append(head + '{' + inner + '}' if inner.strip() else re.sub(r'[^\x00\d\s].*$', '', head, flags=re.S))
        elif h.startswith('@'):
            out.append(head + '{' + body + '}')
        else:
            lead = re.match(r'(\s|\x00\d+\x00)*', head).group(0)
            parts = split_list(head[len(lead):])
            alive = [p for p in parts if not selector_dead(re.sub(r'\x00\d+\x00', '', p))]
            dead = [p.strip() for p in parts if p not in alive]
            if dead: removed.setdefault(name, []).extend(dead)
            if alive: out.append(lead + ','.join(alive) + '{' + body + '}')
            else: out.append(lead)
        i = k
    return ''.join(out)

apply = '--apply' in sys.argv
for f in sorted(assets.glob('*.css')):
    if f.name == 'tokens.css': continue
    comments = []
    def mask(m): comments.append(m.group(0)); return f'\x00{len(comments) - 1}\x00'
    css = walk(re.sub(r'/\*.*?\*/', mask, f.read_text(), flags=re.S), f.name)
    css = re.sub(r'\x00(\d+)\x00', lambda m: comments[int(m.group(1))], css)
    if apply: f.write_text(css)
report = {k: len(v) for k, v in removed.items()}
(root / 'design-system/scale-preview/dead-css.json').write_text(json.dumps(removed, ensure_ascii=False, indent=1))
print(('removed' if apply else 'would remove'), sum(report.values()), 'selectors', report)
