const fs = require('fs');
const p = 'D:/Download/qingqingzhiboke/chat-widget.js';
let s = fs.readFileSync(p, 'utf8');

// 用纯英文部分匹配
const old1 = `    '<button class="qw-close" aria-label="关闭聊天室" title="关闭">`;
const new1 = `    '<button class="qw-admin-btn" id="qw-admin-trigger" aria-label="聊天管理" title="聊天管理"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
    '<button class="qw-close" aria-label="关闭聊天室" title="关闭">`;

if (!s.includes(old1)) {
  // 尝试找 qw-close 那行的实际内容
  const idx = s.indexOf('qw-close');
  console.log('NOT FOUND 1, context around qw-close:');
  console.log(JSON.stringify(s.substring(idx-100, idx+100)));
  process.exit(1);
}
s = s.replace(old1, new1);

const old2 = `  var adminBtn = document.createElement('div'); // 虚拟元素（原按钮已删，保留 classList 兼容）
  // 连续点左上角图标 10 次触发管理员登录
  var _headIcon = document.querySelector('.qw-panel > header .qw-head-icon');
  var _tapCount = 0, _tapTimer = null;
  if (_headIcon) {
    _headIcon.style.cursor = 'pointer';
    _headIcon.addEventListener('click', function () {
      _tapCount++;
      clearTimeout(_tapTimer);
      _tapTimer = setTimeout(function () { _tapCount = 0; }, 1500);
      if (_tapCount >= 10) {
        _tapCount = 0;
        openAdmin();
      }
    });
  }`;
const new2 = `  var adminBtn = document.getElementById('qw-admin-trigger');`;

if (!s.includes(old2)) { console.log('NOT FOUND 2'); process.exit(1); }
s = s.replace(old2, new2);

fs.writeFileSync(p, s);
console.log('OK');
