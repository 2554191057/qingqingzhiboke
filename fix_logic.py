with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 在add-blk逻辑后加chat-add-blk和user-add-blk
old = """      } else if (act === 'add-blk') {
        var blkVal = ((document.getElementById('blkInput') || {}).value || '').trim();
        if (!blkVal) { alert('请输入邮箱、昵称或 IP'); return; }
        var blkPayload = { event: 'QW_BLOCK_ADD', accessToken: adminToken };
        if (blkVal.indexOf('@') >= 0) blkPayload.mail = blkVal;
        else if (/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(blkVal)) blkPayload.ip = blkVal;
        else blkPayload.nick = blkVal;
        adminPost(blkPayload).then(function (r) {
          if (r && r.code === 0) renderManageView();
          else alert((r && r.message) || '操作失败');
        });
      } else if (act === 'add-wl') {"""

new = """      } else if (act === 'add-blk' || act === 'chat-add-blk' || act === 'user-add-blk') {
        var inputId = act === 'chat-add-blk' ? 'chatBlkInput' : (act === 'user-add-blk' ? 'userBlkInput' : 'blkInput');
        var blkVal = ((document.getElementById(inputId) || {}).value || '').trim();
        if (!blkVal) { alert('请输入邮箱、昵称或 IP'); return; }
        var blkPayload = { event: 'QW_BLOCK_ADD', accessToken: adminToken };
        if (blkVal.indexOf('@') >= 0) blkPayload.mail = blkVal;
        else if (/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(blkVal)) blkPayload.ip = blkVal;
        else blkPayload.nick = blkVal;
        adminPost(blkPayload).then(function (r) {
          if (r && r.code === 0) renderManageView();
          else alert((r && r.message) || '操作失败');
        });
      } else if (act === 'add-wl') {"""

content = content.replace(old, new)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: 底部拉黑输入框逻辑已添加")
