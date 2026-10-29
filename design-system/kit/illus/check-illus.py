"""Check that HTML pages and image prompts follow the Nova Island illustration module.

  python3 check-illus.py page.html [image-prompt.txt ...]

For HTML (errors, exit code 1):
- an <img> without an alt attribute
- an illustration (src from the kit's assets, or a class containing illus / art / hero / trophy) that is not alt="" + aria-hidden="true"
- a stock or placeholder image service (unsplash, picsum, placeholder.com, pexels, …)
- a kit illustration used as a content cover (class or id containing cover)
- an illustration image larger than half its card is NOT detected; check it by eye

For prompt files (.txt / .md), errors when the prompt:
- misses the required style words: glass, transparent background, no text
- asks for a banned style: cartoon, flat, outline, line art, mascot, character, person, people, face, emoji, clipart, photo
  (unless the same sentence or clause puts no / without / not / avoid / never before it)
"""
import re, sys
from pathlib import Path

ASSETS = ('glass-geometry', 'glass-elements', 'glass-ribbon', 'trophy-glass', 'trophies-metals', 'trophy-gold', 'trophy-silver', 'trophy-bronze')
STOCK = r'unsplash|picsum|placeholder\.com|placehold|pexels|pixabay|dummyimage|loremflickr'
BANNED = ['cartoon', 'flat', 'outline', 'line art', 'mascot', 'character', 'person', 'people', 'face', 'emoji', 'clipart', 'photo']
REQUIRED = [('glass', 'glass'), ('transparent background', 'transparent background'), ('no text', 'no text')]

def attr(tag, name):
    m = re.search(rf'\b{name}\s*=\s*("([^"]*)"|\'([^\']*)\')', tag)
    return None if not m else (m.group(2) if m.group(2) is not None else m.group(3))

errors = []
for name in sys.argv[1:]:
    text = Path(name).read_text(encoding='utf-8', errors='ignore')
    if name.endswith(('.txt', '.md')):
        low = text.lower()
        for word, label in REQUIRED:
            if word not in low: errors.append(f'{name}: 缺少“{label}”')
        for w in BANNED:
            for m in re.finditer(rf'\b{w}s?\b', low):
                start = max(low.rfind('.', 0, m.start()), low.rfind('\n', 0, m.start()), low.rfind(';', 0, m.start()))
                before = low[start + 1:m.start()]
                if not re.search(r'\b(no|without|not|avoid|never)\b', before): errors.append(f'{name}: 用了“{w}”（插画是玻璃质感物件，不要这种风格）'); break
        continue
    body = re.sub(r'<!--.*?-->|<(script|style)\b.*?</\1>', '', text, flags=re.S | re.I)
    for m in re.finditer(r'<img\b[^>]*>', body, re.I):
        tag = m.group(0); src = attr(tag, 'src') or ''; cls = attr(tag, 'class') or ''
        if attr(tag, 'alt') is None: errors.append(f'{name}: {tag[:80]}（图片要写 alt）')
        if re.search(STOCK, src, re.I): errors.append(f'{name}: {src}（不用图库或占位图片）')
        if any(a in src for a in ASSETS) and re.search(r'cover', cls + ' ' + (attr(tag, 'id') or ''), re.I):
            errors.append(f'{name}: {tag[:80]}（插画不能当内容封面）')
        if any(a in src for a in ASSETS) or re.search(r'illus|\bart\b|hero|trophy', cls):
            if attr(tag, 'alt') != '' or attr(tag, 'aria-hidden') != 'true':
                errors.append(f'{name}: {tag[:80]}（插画是装饰：alt="" aria-hidden="true"）')
    for m in re.finditer(r'url\(([^)]*)\)', text):
        if re.search(STOCK, m.group(1), re.I): errors.append(f'{name}: url({m.group(1)})（不用图库或占位图片）')
print('\n'.join(dict.fromkeys(errors)) or 'OK：插画用法和生图 Prompt 符合 Nova 规范。')
sys.exit(1 if errors else 0)
