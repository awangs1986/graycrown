# Builds a Noto Sans SC subset (SIL OFL 1.1) containing only the characters the compositions use.
import glob, sys
from fontTools.ttLib import TTCollection
from fontTools import subset
chars = set()
for path in glob.glob('remotion/src/*') + glob.glob('web/courses/olympiad/*.mjs'):
    chars |= set(open(path, encoding='utf-8').read())
chars |= set('0123456789 第步：先读题，想一想……已移动年后分')
for weight, src in [('Regular', 'NotoSansCJK-Regular.ttc'), ('Bold', 'NotoSansCJK-Bold.ttc')]:
    col = TTCollection('/usr/share/fonts/opentype/noto/' + src)
    font = next(f for f in col.fonts if 'Noto Sans CJK SC' in f['name'].getDebugName(1))
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    sub = subset.Subsetter(opts); sub.populate(text=''.join(chars)); sub.subset(font)
    font.flavor = 'woff2'; font.save(f'remotion/public/NotoSansSC-{weight}-subset.woff2')
# ZCOOL KuaiLe (SIL OFL 1.1) hand-written font for the crayon style; Noto subsets above stay as fallback for symbols it lacks.
import os, urllib.request
src = '/tmp/fonts/kuaile.ttf'
if not os.path.exists(src):
    os.makedirs('/tmp/fonts', exist_ok=True)
    urllib.request.urlretrieve('https://github.com/google/fonts/raw/main/ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf', src)
from fontTools.ttLib import TTFont
font = TTFont(src)
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
sub = subset.Subsetter(opts); sub.populate(text=''.join(chars)); sub.subset(font)
font.flavor = 'woff2'; font.save('remotion/public/ZCOOLKuaiLe-subset.woff2')
print(len(chars))
