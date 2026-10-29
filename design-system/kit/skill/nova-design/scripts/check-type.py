"""Check that HTML/CSS files only use the Nova Island type scale.

  python3 check-type.py page.html [more files...]

Reports every font-size outside the 10-step scale (11, 12, 13, 14, 16, 18, 20, 24, 30, 40px or the
--type-* variables) and every font-weight other than 400 / 500 / 600. Exit code 1 when anything is found.
"""
import re, sys
from pathlib import Path

SCALE = {11, 12, 13, 14, 16, 18, 20, 24, 30, 40}
WEIGHTS = {'400', '500', '600', 'normal', 'inherit', 'var(--weight-regular)', 'var(--weight-medium)', 'var(--weight-semibold)'}
problems = []
for name in sys.argv[1:]:
    text = Path(name).read_text(encoding='utf-8', errors='ignore')
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    for m in re.finditer(r'font-size\s*:\s*([^;"}]+)', text):
        v = m.group(1).strip()
        if v.startswith('var(--type-') or v in ('inherit', '100%') or 'clamp' in v: continue
        px = re.fullmatch(r'(\d+(?:\.\d+)?)px', v)
        rem = re.fullmatch(r'(\d+(?:\.\d+)?)rem', v)
        size = float(px.group(1)) if px else float(rem.group(1)) * 16 if rem else None
        if size is None or size not in SCALE:
            problems.append(f'{name}: font-size {v}')
    for m in re.finditer(r'font-weight\s*:\s*([^;"}]+)', text):
        if m.group(1).strip() not in WEIGHTS:
            problems.append(f'{name}: font-weight {m.group(1).strip()}')
    for m in re.finditer(r'\bfont\s*:\s*(\d{3})?\s*(\d+(?:\.\d+)?)px', text):
        if float(m.group(2)) not in SCALE:
            problems.append(f'{name}: font shorthand {m.group(0)}')
print('\n'.join(problems) or 'OK：只使用了文字模块中的字号和字重。')
sys.exit(1 if problems else 0)
