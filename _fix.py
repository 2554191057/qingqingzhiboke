# -*- coding: utf-8 -*-
import io, os

# 1. 创建占位SVG
os.makedirs('images/avatar', exist_ok=True)
svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="#2a3a52"/><text x="50%" y="50%" fill="#5a7a9a" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em">图片加载失败</text></svg>'
with io.open('images/avatar/placeholder.svg', 'w', encoding='utf-8') as f:
    f.write(svg)
print('placeholder created')

# 2. 替换 script.js
with io.open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

old = '<img class="blog-cover-img" src="${p.image}" alt="" decoding="async">'
new = '<img class="blog-cover-img" src="${p.image}" alt="" decoding="async" onerror="this.onerror=null;this.src=\'images/avatar/placeholder.svg\'">'

if old in content:
    content = content.replace(old, new)
    with io.open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('OK: coverImg onerror added')
else:
    for i, line in enumerate(content.split('\n')):
        if 'coverImg' in line and 'blog-cover-img' in line:
            print(f'Line {i+1}: {line.strip()[:160]}')
