with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改updateChatSelBtn，同时更新拉黑按钮
old = """function updateChatSelBtn() {
  var n = document.querySelectorAll('#panel-chat .chat-chk:checked').length;
  var b = document.querySelector('#panel-chat [data-act="chat-del-sel"]');
  if (b) { b.disabled = n === 0; b.textContent = '删除(' + n + ')'; }
}"""

new = """function updateChatSelBtn() {
  var n = document.querySelectorAll('#panel-chat .chat-chk:checked').length;
  var b = document.querySelector('#panel-chat [data-act="chat-del-sel"]');
  if (b) { b.disabled = n === 0; b.textContent = '删除(' + n + ')'; }
  var blk = document.querySelector('#panel-chat [data-act="chat-blk-sel"]');
  if (blk) { blk.disabled = n === 0; blk.textContent = '拉黑(' + n + ')'; }
}"""

content = content.replace(old, new)

# 2. 在批量删除逻辑后加批量拉黑逻辑
old2 = """  var chatDel = document.querySelector('#panel-chat [data-act="chat-del-sel"]');
  if (chatDel) chatDel.addEventListener('click', function () {
    var ids = [];
    document.querySelectorAll('#panel-chat .chat-chk:checked').forEach(function (b) { ids.push(b.getAttribute('data-id')); });
    if (!ids.length) return;
    if (!confirm('确定删除选中的 ' + ids.length + ' 条聊天吗？此操作不可恢复。')) return;
    showQwLoading('删除中…');
    adminPost({ event: 'QW_COMMENT_DELETE_MANY', accessToken: adminToken, ids: ids }).then(function (r) {
      hideQwLoading();
      if (r && r.code === 0) renderManageView();
      else alert((r && r.message) || '删除失败');
    }).catch(function () { hideQwLoading(); alert('网络异常，删除失败'); });
  });"""

new2 = """  var chatDel = document.querySelector('#panel-chat [data-act="chat-del-sel"]');
  if (chatDel) chatDel.addEventListener('click', function () {
    var ids = [];
    document.querySelectorAll('#panel-chat .chat-chk:checked').forEach(function (b) { ids.push(b.getAttribute('data-id')); });
    if (!ids.length) return;
    if (!confirm('确定删除选中的 ' + ids.length + ' 条聊天吗？此操作不可恢复。')) return;
    showQwLoading('删除中…');
    adminPost({ event: 'QW_COMMENT_DELETE_MANY', accessToken: adminToken, ids: ids }).then(function (r) {
      hideQwLoading();
      if (r && r.code === 0) renderManageView();
      else alert((r && r.message) || '删除失败');
    }).catch(function () { hideQwLoading(); alert('网络异常，删除失败'); });
  });
  var chatBlk = document.querySelector('#panel-chat [data-act="chat-blk-sel"]');
  if (chatBlk) chatBlk.addEventListener('click', function () {
    var mails = [], ips = [];
    document.querySelectorAll('#panel-chat .chat-chk:checked').forEach(function (b) {
      var item = b.closest('.log-item');
      if (item) {
        var mail = item.querySelector('[data-mail]');
        var ip = item.querySelector('[data-ip]');
        if (mail && mail.getAttribute('data-mail')) mails.push(mail.getAttribute('data-mail'));
        if (ip && ip.getAttribute('data-ip')) ips.push(ip.getAttribute('data-ip'));
      }
    });
    if (!mails.length && !ips.length) return;
    if (!confirm('确定拉黑选中的 ' + (mails.length + ips.length) + ' 个用户吗？')) return;
    showQwLoading('拉黑中…');
    Promise.all(mails.map(function(m) { return adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: m, ip: '' }); })
      .concat(ips.map(function(ip) { return adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: '', ip: ip }); }))
    ).then(function() {
      hideQwLoading();
      renderManageView();
    }).catch(function() { hideQwLoading(); alert('网络异常，拉黑失败'); });
  });"""

content = content.replace(old2, new2)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK")
