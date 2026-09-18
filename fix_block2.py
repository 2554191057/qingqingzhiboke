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

# 2. 修改updateUserSelBtn，同时更新拉黑按钮
old2 = """function updateUserSelBtn() {
  var n = document.querySelectorAll('#panel-users .user-chk:checked').length;
  var b = document.querySelector('#panel-users [data-act="user-del-sel"]');
  if (b) { b.disabled = n === 0; b.textContent = '删除(' + n + ')'; }
}"""
new2 = """function updateUserSelBtn() {
  var n = document.querySelectorAll('#panel-users .user-chk:checked').length;
  var b = document.querySelector('#panel-users [data-act="user-del-sel"]');
  if (b) { b.disabled = n === 0; b.textContent = '删除(' + n + ')'; }
  var blk = document.querySelector('#panel-users [data-act="user-blk-sel"]');
  if (blk) { blk.disabled = n === 0; blk.textContent = '拉黑(' + n + ')'; }
}"""
content = content.replace(old2, new2)

# 3. 在聊天信息批量删除后加批量拉黑
old3 = """  var chatDel = document.querySelector('#panel-chat [data-act="chat-del-sel"]');
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
new3 = old3 + """
  var chatBlk = document.querySelector('#panel-chat [data-act="chat-blk-sel"]');
  if (chatBlk) chatBlk.addEventListener('click', function () {
    var mails = [], ips = [];
    document.querySelectorAll('#panel-chat .chat-chk:checked').forEach(function (b) {
      var item = b.closest('.log-item');
      if (item) {
        var ipBtn = item.querySelector('.log-copy-ip');
        if (ipBtn && ipBtn.getAttribute('data-ip')) ips.push(ipBtn.getAttribute('data-ip'));
      }
    });
    if (!mails.length && !ips.length) return;
    if (!confirm('确定拉黑选中的 ' + (mails.length + ips.length) + ' 个用户吗？')) return;
    showQwLoading('拉黑中…');
    Promise.all(ips.map(function(ip) { return adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: '', ip: ip }); }))
      .then(function() { hideQwLoading(); renderManageView(); })
      .catch(function() { hideQwLoading(); alert('网络异常，拉黑失败'); });
  });"""
content = content.replace(old3, new3)

# 4. 在账号管理批量删除后加批量拉黑
old4 = """  var userDel = document.querySelector('#panel-users [data-act="user-del-sel"]');
  if (userDel) userDel.addEventListener('click', function () {"""
new4 = """  var userBlk = document.querySelector('#panel-users [data-act="user-blk-sel"]');
  if (userBlk) userBlk.addEventListener('click', function () {
    var mails = [];
    document.querySelectorAll('#panel-users .user-chk:checked').forEach(function (b) {
      var mail = b.getAttribute('data-mail');
      if (mail) mails.push(mail);
    });
    if (!mails.length) return;
    if (!confirm('确定拉黑选中的 ' + mails.length + ' 个账号邮箱吗？')) return;
    showQwLoading('拉黑中…');
    Promise.all(mails.map(function(mail) { return adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: mail, ip: '' }); }))
      .then(function() { hideQwLoading(); renderManageView(); })
      .catch(function() { hideQwLoading(); alert('网络异常，拉黑失败'); });
  });
  var userDel = document.querySelector('#panel-users [data-act="user-del-sel"]');
  if (userDel) userDel.addEventListener('click', function () {"""
content = content.replace(old4, new4)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: JS逻辑已添加")
