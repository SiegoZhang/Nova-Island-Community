"""Check that HTML files follow the Nova Island icon module.

  python3 check-icon.py page.html [more files...]

Errors (exit code 1):
- an inline icon <svg> whose viewBox is not 0 0 24 24 (64 × 64 is only for the glass nav icons that icons.js draws)
- a line icon without stroke="currentColor", stroke-width="1.6", round caps and joins, or fill="none" on the svg
- an icon size (width / height attribute, or .nv-icon-N class) that is not 12, 14, 16, 18, 20 or 24
- an unknown data-nv-icon / data-nv-glass name
- an icon-only button or link without aria-label, or an icon svg without aria-hidden="true" / an accessible name
- emoji or an icon font (Font Awesome, Material Icons, Bootstrap Icons, iconfont …) used as an icon

Also: emoji anywhere in the text, data-nv-glass outside <nav>, and stroke-width / px sizes on svg or icon selectors inside <style>.
Not checked: whether the right icon or size step was chosen, CSS in separate files, and SVG that icons.js draws at run time.
Large SVGs (illustrations, charts: width or viewBox over 64) are skipped.
"""
import re, sys
from pathlib import Path

LINE = set('''home search bell user settings logout back chevron-down expand filter info grid book file column chat calendar code layers
trophy plug sun spark like comment bookmark share eye'''.split())
GLASS = {'home', 'book', 'column', 'file', 'chat', 'calendar', 'trophy', 'layers'}
SIZES = {12, 14, 16, 18, 20, 24}
EMOJI = re.compile('[\U0001F300-\U0001FAFF\u2600-\u26FF\u2764\u2B50]')
FONTS = re.compile(r'\b(fa|fas|far|fab|fa-[\w-]+|material-icons|material-symbols[\w-]*|bi-[\w-]+|iconfont|icon-font|glyphicon[\w-]*)\b')

def attr(tag, name):
    m = re.search(rf'\b{name}\s*=\s*"([^"]*)"', tag) or re.search(rf"\b{name}\s*=\s*'([^']*)'", tag)
    return m.group(1) if m else None

errors = []
for name in sys.argv[1:]:
    text = re.sub(r'<!--.*?-->', '', Path(name).read_text(encoding='utf-8', errors='ignore'), flags=re.S)
    body = re.sub(r'<(script|style)\b.*?</\1>', '', text, flags=re.S | re.I)
    for m in re.finditer(r'<svg\b[^>]*>', body, re.I):
        tag = m.group(0); vb = attr(tag, 'viewBox') or ''
        nums = [float(x) for x in vb.split()] if vb else []
        w = attr(tag, 'width')
        if (len(nums) == 4 and max(nums[2:]) > 64) or (w and w.replace('px', '').isdigit() and int(w.replace('px', '')) > 64): continue
        where = f'{name}: {tag[:80]}'
        if vb != '0 0 24 24': errors.append(f'{where}（viewBox 用 0 0 24 24）'); continue
        for a, want in (('fill', 'none'), ('stroke', 'currentColor'), ('stroke-width', '1.6'), ('stroke-linecap', 'round'), ('stroke-linejoin', 'round')):
            if attr(tag, a) != want: errors.append(f'{where}（{a}="{want}"）')
        for a in ('width', 'height'):
            v = attr(tag, a)
            if v and not (v.replace('px', '').isdigit() and int(v.replace('px', '')) in SIZES): errors.append(f'{where}（{a} 只用 12/14/16/18/20/24）')
        if attr(tag, 'aria-hidden') != 'true' and not (attr(tag, 'aria-label') or attr(tag, 'role') == 'img'):
            errors.append(f'{where}（装饰性图标加 aria-hidden="true"）')
    for m in re.finditer(r'data-nv-icon\s*=\s*"([^"]*)"', body):
        if m.group(1) not in LINE: errors.append(f'{name}: data-nv-icon="{m.group(1)}"（没有这个图标）')
    for m in re.finditer(r'data-nv-glass\s*=\s*"([^"]*)"', body):
        if m.group(1) not in GLASS: errors.append(f'{name}: data-nv-glass="{m.group(1)}"（没有这个玻璃导航图标）')
    for m in re.finditer(r'\bnv-icon-(\d+)\b', body):
        if int(m.group(1)) not in SIZES: errors.append(f'{name}: nv-icon-{m.group(1)}（尺寸只用 12/14/16/18/20/24）')
    for m in re.finditer(r'<(button|a)\b([^>]*)>(.*?)</\1>', body, re.S | re.I):
        attrs, inner = m.group(2), m.group(3)
        visible = re.sub(r'<(\w+)\b[^>]*aria-hidden="true"[^>]*>.*?</\1>|<svg\b.*?</svg>|<[^>]+>', '', inner, flags=re.S).strip()
        has_icon = '<svg' in inner or 'data-nv-icon' in inner or 'data-nv-glass' in inner
        if has_icon and not visible and 'aria-label' not in attrs and 'aria-labelledby' not in attrs:
            errors.append(f'{name}: <{m.group(1)}{attrs[:60]}>（只有图标的按钮要有 aria-label）')
    for e in sorted(set(EMOJI.findall(re.sub(r'<[^>]+>', ' ', body)))): errors.append(f'{name}: {e}（不用 emoji 当图标）')
    fonts = [m.group(1) for m in re.finditer(r'class\s*=\s*"([^"]*)"', body) if FONTS.search(m.group(1))]
    if fonts or re.search(r'<link[^>]+(font-awesome|fontawesome|material-icons|material-symbols|bootstrap-icons)|@import[^;]+(font-awesome|material)', text, re.I):
        errors.append(f'{name}: 用了图标字体' + (f'（class="{fonts[0]}"）' if fonts else ''))
    navs = ''.join(re.findall(r'<nav\b.*?</nav>', body, re.S | re.I))
    glass_tags = lambda s: len(re.findall(r'<[^>]*\bdata-nv-glass\s*=', s))
    if glass_tags(body) > glass_tags(navs): errors.append(f'{name}: data-nv-glass 只能放在 <nav> 主导航里')
    css = ''.join(re.findall(r'<style\b[^>]*>(.*?)</style>', text, re.S | re.I))
    for sel, decl in re.findall(r'([^{}]*(?:svg|nv-icon|data-nv-icon)[^{}]*)\{([^{}]*)\}', css):
        for v in re.findall(r'stroke-width\s*:\s*([^;]+)', decl):
            if v.strip() != '1.6': errors.append(f'{name}: {sel.strip()[:50]} stroke-width: {v.strip()}（描边固定 1.6）')
        for prop, v in re.findall(r'(?<![\w-])(width|height)\s*:\s*(\d+)px', decl):
            if 'glass' not in sel and int(v) not in SIZES: errors.append(f'{name}: {sel.strip()[:50]} {prop}: {v}px（图标尺寸只用 12/14/16/18/20/24）')
print('\n'.join(dict.fromkeys(errors)) or 'OK：图标都来自 Nova 图标集，规格正确。')
sys.exit(1 if errors else 0)
