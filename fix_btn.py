with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = """'<button class="log-del" data-act="blk" data-mail="' + escAttr(c.mail || '') + '" data-ip="' + escAttr(c.ip || '') + '" title="拉黑" style="float:right;margin-left:6px;background:var(--jp-danger,#e05b5b);color:#fff;border:none;border-radius:6px;font-size:10px;padding:2px 9px;cursor:pointer">拉黑</button></div>'"""

new = """'<button class="log-del" data-act="del" data-id="' + escAttr(c._id || '') + '" title="删除" style="float:right;margin-left:6px;background:var(--jp-danger,#e05b5b);color:#fff;border:none;border-radius:6px;font-size:10px;padding:2px 9px;cursor:pointer">删除</button><button class="log-del" data-act="blk" data-mail="' + escAttr(c.mail || '') + '" data-ip="' + escAttr(c.ip || '') + '" title="拉黑" style="float:right;margin-left:6px;background:var(--jp-danger,#e05b5b);color:#fff;border:none;border-radius:6px;font-size:10px;padding:2px 9px;cursor:pointer">拉黑</button></div>'"""

if old in content:
    content = content.replace(old, new)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('OK: 加了删除按钮')
else:
    print('未找到匹配字符串')
