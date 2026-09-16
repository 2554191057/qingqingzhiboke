const fs = require('fs');
let c = fs.readFileSync('chat-widget.js', 'utf8');

// 1. Update login description
c = c.replace(
  "'<h3>登录发言</h3><p>填昵称和邮箱即可加入聊天，下次自动登录</p>' +",
  "'<h3>登录发言</h3><p>设置昵称、邮箱和密码，多设备可同步登录</p>' +"
);

// 2. Add password input after email input
c = c.replace(
  "'<input type=\"email\" id=\"qw-login-email\" placeholder=\"邮箱（仅用于身份识别，不公开）\">' +\n    '<button",
  "'<input type=\"email\" id=\"qw-login-email\" placeholder=\"邮箱（仅用于身份识别，不公开）\">' +\n    '<input type=\"password\" id=\"qw-login-pass\" placeholder=\"密码（多设备登录用，至少4位）\" maxlength=\"32\">' +\n    '<button"
);

fs.writeFileSync('chat-widget.js', c, 'utf8');
console.log('login HTML updated');
