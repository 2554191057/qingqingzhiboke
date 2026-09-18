with open('admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. 第785行（0-indexed 784）：在删除按钮后加拉黑按钮
old_line = lines[784]
print("原工具栏:", old_line.strip()[:150])
lines[784] = old_line.replace(
    '<button class="t-btn danger" data-act="chat-del-sel" disabled>删除(0)</button>',
    '<button class="t-btn danger" data-act="chat-del-sel" disabled>删除(0)</button>' +
    '<button class="t-btn danger" data-act="chat-blk-sel" disabled style="margin-left:6px;background:#e67e22">拉黑(0)</button>'
)

# 2. 第798行（0-indexed 797）：删掉每条的拉黑按钮
old_btn = lines[797]
print("原拉黑按钮行:", old_btn.strip()[:150])
lines[797] = old_btn.replace(
    """'<button class="log-del" data-act="blk" data-mail="' + escAttr(c.mail || '') + '" data-ip="' + escAttr(c.ip || '') + '" title="拉黑" style="float:right;margin-left:6px;background:var(--jp-danger,#e05b5b);color:#fff;border:none;border-radius:6px;font-size:10px;padding:2px 9px;cursor:pointer">拉黑</button></div>';""",
    "'</div>';"
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("OK")
