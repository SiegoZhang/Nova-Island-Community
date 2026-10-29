"""Check that HTML/CSS files follow the Nova Island size module.

  python3 check-size.py page.html [more files...]

Errors (exit code 1):
- padding / margin / gap / inset / top / right / bottom / left in px that is not on the spacing scale
  (0 4 8 12 16 20 24 32 40 48 64, the exceptions 1 2 3 6, or the negative of a scale step); px inside calc() counts too
- border-radius that is not 0, 4, 8, 12, 20, 24, 999px, 50%, inherit or a --radius-* variable
- a @media width that is not one of the breakpoints 600 / 760 / 1100 / 1440 (601 / 761 / 1101 / 1439 also pass)
- an unknown --space-* / --radius-* / --control-* / --avatar-* variable

Not checked: width, height and transform (content decides them), and whether an element uses the right step;
compare that against the tables in the reference by eye. Files named size.css are skipped.
"""
import re, sys
from pathlib import Path

SPACE = {0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64}
EXTRA = {1, 2, 3, 6}
RADIUS = {0, 4, 8, 12, 20, 24, 999}
BREAKS = {600, 601, 760, 761, 1100, 1101, 1439, 1440}
VARS = set('''space-0 space-1 space-2 space-3 space-4 space-5 space-6 space-8 space-10 space-12 space-16 shell-gap capsule-pad
radius-none radius-xs radius-sm radius-md radius-lg radius-card radius-full control-sm control-md control-lg touch-target
avatar-xs avatar-sm avatar-md avatar-lg avatar-xl sidebar-width card-padding card-gap split-gap field-gap'''.split())
SPACING_PROPS = r'(padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?'

def px_values(value):
    value = re.sub(r'var\([^)]*\)', '', value)
    return [float(n) for n in re.findall(r'(-?\d*\.?\d+)px', value)]

errors = []
for name in sys.argv[1:]:
    if Path(name).name == 'size.css': continue
    text = re.sub(r'/\*.*?\*/', '', Path(name).read_text(encoding='utf-8', errors='ignore'), flags=re.S)
    for m in re.finditer(rf'(?<![\w-]){SPACING_PROPS}\s*:\s*([^;"}}]+)', text):
        prop, value = m.group(0).split(':')[0].strip(), m.group(2).strip()
        for n in px_values(value):
            a = abs(n)
            if not (a in SPACE or (n > 0 and a in EXTRA)):
                errors.append(f'{name}: {prop}: {value}（{n:g}px 不在间距阶梯内）')
    for m in re.finditer(r'border(?:-[a-z]+)*-radius\s*:\s*([^;"}]+)', text):
        value = m.group(1).replace('!important', '').strip()
        for n in px_values(value):
            if n not in RADIUS: errors.append(f'{name}: border-radius: {value}（{n:g}px 不在圆角阶梯内）')
        for pct in re.findall(r'(\d+)%', value):
            if pct != '50': errors.append(f'{name}: border-radius: {value}（百分比只用 50%）')
    for m in re.finditer(r'@media[^{]*', text):
        for n in re.findall(r'(?:min|max)-width\s*:\s*(\d+)px', m.group(0)):
            if int(n) not in BREAKS: errors.append(f'{name}: {m.group(0).strip()}（断点只用 600 / 760 / 1100 / 1440）')
    for t in re.findall(r'var\(--((?:space|radius|control|avatar)-[\w-]+)', text):
        if t not in VARS: errors.append(f'{name}: var(--{t})（没有这个尺寸变量）')
print('\n'.join(dict.fromkeys(errors)) or 'OK：间距、圆角和断点都在尺寸模块的阶梯内。')
sys.exit(1 if errors else 0)
