"""Sync the current prototype tokens. CSS selectors and aliases remain intact."""
from pathlib import Path
import re, json, hashlib
root = Path(__file__).resolve().parents[2]
source = root / 'html-pages/prototype/assets/tokens.css'
css = source.read_text()
clean = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
blocks = []
for selector, body in re.findall(r'([^{}]+)\{([^{}]*)\}', clean):
    values = dict(re.findall(r'(--[\w-]+)\s*:\s*([^;]+);?', body))
    blocks.append({'selector': selector.strip(), 'tokens': {k:v.strip() for k,v in values.items()}})
light, dark, contexts = {}, {}, []
for block in blocks:
    if block['selector'] == '.nova-ds': light.update(block['tokens'])
    elif block['selector'] == '.nova-ds[data-theme="dark"]': dark.update(block['tokens'])
    else: contexts.append(block)
def tier(name):
    if name.startswith(('--illus-', '--chart-')): return 'expressive'
    if name.startswith(('--blue-', '--neutral-', '--type-', '--space-', '--radius-')): return 'primitive'
    return 'semantic'
tiers = {'primitive': {}, 'semantic': {}, 'expressive': {}}
for k, v in light.items(): tiers[tier(k)][k] = v
data = {'version':'0.6', 'updatedAt':'2026-10-28', 'tiers':tiers, 'source':str(source.relative_to(root)), 'sourceSha256':hashlib.sha256(css.encode()).hexdigest(), 'description':'tiers groups light values: components use semantic only; primitive is referenced inside tokens.css; expressive serves illustrations and charts. Aliases are preserved. Apply themes.light, then themes.dark for dark mode, then matching contextualOverrides in source order. blocks preserves the complete CSS cascade.', 'themes':{'light':light, 'dark':dark}, 'contextualOverrides':contexts, 'blocks':blocks}
(root/'design-system/tokens.css').write_text(css)
# Handbook pages read the same light tokens from :root.
(root/'design-system/assets/community-tokens.css').write_text(re.sub(r'^\.nova-ds(\s*\{)', r'.nova-ds,:root\1', css, flags=re.M))
(root/'design-system/tokens.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
print(f'Synced {len(light)} base tokens, {len(dark)} dark overrides, {len(contexts)} contextual blocks.')
