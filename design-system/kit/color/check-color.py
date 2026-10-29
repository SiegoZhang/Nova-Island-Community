"""Check that HTML/CSS files follow the Nova Island colour module.

  python3 check-color.py page.html [more files...]

Errors (exit code 1):
- a colour literal (#hex, rgb(), hsl(), or a named colour such as red / blue) that is not in the Nova palette
- a var(--…) colour token from a Nova group (surface, text, border, action, accent, status, badge, …) that does not exist
- the accent blue used as a button background (blue means "where you are", not "do this")
- more than one primary (black) button declared with the same class inside one file is NOT detected; check it by eye

Notes (no failure): a palette colour written as a literal instead of its Token.
Files named colors.css are skipped, since they define the Tokens.
"""
import re, sys
from pathlib import Path

TOKENS = set('''surface-canvas surface-default surface-secondary surface-hover text-heading text-primary text-secondary text-disabled
border-strong border-default border-subtle action-primary action-primary-hover text-on-action accent accent-text accent-surface
accent-surface-soft accent-border text-link text-on-accent focus-ring progress-track progress-fill status-success status-success-bg
status-success-text status-danger status-danger-bg status-danger-text status-info status-info-bg badge-green-bg badge-green-text
badge-red-bg badge-red-text badge-blue-bg badge-blue-text badge-amber-bg badge-amber-text badge-purple-bg badge-purple-text
badge-yellow-bg badge-yellow-text article-surface-blue article-surface-yellow article-surface-red article-surface-blue-hover
article-surface-yellow-hover article-surface-red-hover feed-surface-neutral-hover reaction-liked reaction-saved-icon
reaction-saved-text fill-subtle fill-hover fill-selected fill-border glass-fill glass-fill-strong
blue-50 blue-100 blue-200 blue-300 blue-400 blue-500 blue-600 blue-700 neutral-0 neutral-50 neutral-100 neutral-200 neutral-300
neutral-400 neutral-600 neutral-800 neutral-900'''.split())
GROUPS = ('surface-', 'text-', 'border-', 'action-', 'accent', 'status-', 'badge-', 'article-surface', 'feed-surface', 'reaction-', 'fill-', 'glass-', 'focus-', 'progress-', 'blue-', 'neutral-')
PALETTE = {c.upper() for c in '''#F2F5FF #E0E8FF #BDCDFF #8FABFF #5C84FF #0140FF #0033CC #082A99 #FFFFFF #F7F7F9 #F2F2F2 #DEDEE0 #CCCCCF #949494
#626262 #333333 #000000 #276545 #EAF6EF #EE8C94 #FFF5F6 #A23845 #F9D8C7 #8C4029 #FFF4DE #845B16 #F0E8FA #65418B #FFF3C9 #80631B
#FFF6DF #FFF3EB #EAF0FF #FFF0CC #FFEBDD #F0F0F4 #BF2531 #F5C842 #242424 #191919 #DEDEE0 #B3B3AC #707070 #F7F7F5 #DEDED8 #1A1A18
#322326 #F3AEB4 #203B2D #9DDBB5 #684332 #FFDDCC #42361E #EDCC89 #352740 #D8B9F2 #40371F #F0D77E #393324 #442E25 #1C2747 #443C28 #51362B #3B3B3F'''.split()}
NAMED = r'\b(red|blue|green|yellow|orange|purple|pink|gray|grey|navy|teal|gold|silver|brown|cyan|magenta|lime|maroon|olive|aqua|violet|indigo|crimson|coral|salmon|tomato)\b'
COLOR_PROPS = r'(color|background(?:-color)?|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke|text-decoration-color|caret-color|accent-color)'

def norm(h):
    h = h.upper()
    return '#' + ''.join(c * 2 for c in h[1:4]) if len(h) == 4 else h[:7]

errors, notes = [], []
for name in sys.argv[1:]:
    if Path(name).name == 'colors.css': continue
    text = re.sub(r'/\*.*?\*/', '', Path(name).read_text(encoding='utf-8', errors='ignore'), flags=re.S)
    for m in re.finditer(rf'(?<![\w-]){COLOR_PROPS}\s*:\s*([^;"}}]+)', text, re.I):
        prop, value = m.group(1).lower(), m.group(2).strip()
        for h in re.findall(r'#[0-9a-fA-F]{3,8}\b', value):
            (notes if norm(h) in PALETTE else errors).append(f'{name}: {prop}: {value}' + ('（调色板里的颜色，建议改用 Token）' if norm(h) in PALETTE else '（不在调色板里）'))
        if re.search(r'\b(rgba?|hsla?)\(', value): errors.append(f'{name}: {prop}: {value}（用 Token，不写 rgb / hsl）')
        if re.search(NAMED, value, re.I) and 'var(' not in value: errors.append(f'{name}: {prop}: {value}（命名颜色不在调色板里）')
        for t in re.findall(r'var\(--([\w-]+)', value):
            if t.startswith(GROUPS) and t not in TOKENS: errors.append(f'{name}: {prop}: var(--{t})（没有这个颜色 Token）')
    for m in re.finditer(r'([^{}]*)\{([^{}]*)\}', text):
        sel, body = m.group(1), m.group(2)
        if re.search(r'button|btn|\.cta', sel, re.I) and re.search(r'background(?:-color)?\s*:\s*var\(--(accent|blue-[3-7]00)\)', body):
            errors.append(f'{name}: {sel.strip()[:60]}（按钮底色用了蓝色；主按钮用 --action-primary）')
print('\n'.join(errors) or 'OK：颜色都来自 Nova 调色板和 Token。')
if notes: print('\n提示：\n' + '\n'.join(notes))
sys.exit(1 if errors else 0)
