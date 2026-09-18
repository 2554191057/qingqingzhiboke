with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 聊天信息工具栏：加拉黑按钮
old_chat_toolbar = """'<button class="t-btn danger" data-act="chat-del-sel" disabled>删除(0)</button></span></h3>' + chatToolbarHtml();"""
new_chat_toolbar = """'<button class="t-btn danger" data-act="chat-del-sel" disabled>删除(0)</button>' +
    '<button class="t-btn danger" data-act="chat-blk-sel" disabled style="margin-left:6px;background:#e67e22">拉黑(0)</button></span></h3>' + chatToolbarHtml();"""
content = content.replace(old_chat_toolbar, new_chat_toolbar)

# 2. 聊天信息每条：删掉单独的拉黑按钮
old_chat_btn = """'<button class="log-del" data-act="blk" data-mail="' + escAttr(c.mail || '') + '" data-ip="' + escAttr(c.ip || '') + '" title="拉黑" style="float:right;margin-left:6px;background:var(--jp-danger,#e05b5b);color:#fff;border:none;border-radius:6px;font-size:10px;padding:2px 9px;cursor:pointer">拉黑</button></div>';"""
new_chat_btn = "'</div>';"
content = content.replace(old_chat_btn, new_chat_btn)

# 3. 账号管理工具栏：加拉黑按钮
old_user_toolbar = """'<button class="t-btn danger" data-act="user-del-sel" disabled>删除(0)</button></span></h3>' + userToolbarHtml();"""
new_user_toolbar = """'<button class="t-btn danger" data-act="user-del-sel" disabled>删除(0)</button>' +
    '<button class="t-btn danger" data-act="user-blk-sel" disabled style="margin-left:6px;background:#e67e22">拉黑(0)</button></span></h3>' + userToolbarHtml();"""
content = content.replace(old_user_toolbar, new_user_toolbar)

# 4. 账号管理每条：删掉单独的拉黑按钮
old_user_btn = """'<button data-act="blk" data-mail="' + escAttr(ac.email) + '" data-ip="" title="拉黑该账号邮箱">拉黑</button></div>';"""
new_user_btn = "'</div>';"
content = content.replace(old_user_btn, new_user_btn)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: 聊天信息和账号管理加拉黑按钮到工具栏")
