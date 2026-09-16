const fs = require('fs');
let c = fs.readFileSync('D:/Download/twikoo-netlify/netlify/functions/twikoo.js', 'utf8');
const old = `  // 检查当前用户是否在管理员白名单（不需要admin token）
  if (body.event === 'QW_ADMIN_CHECK_WHITELIST') {`;
const neu = `  // 清空所有聊天记录和点赞数据（需管理密码）
  if (body.event === 'QW_WIPE_ALL') {
    const ok = await isAdminToken(body.accessToken || '')
    if (!ok) return { statusCode: 200, headers, body: JSON.stringify({ code: 401, message: '无权限' }) }
    const client = await getClient()
    const db = client.db()
    const r1 = await db.collection('comment').deleteMany({ path: 'chat' })
    const r2 = await db.collection('qw_likes').deleteMany({})
    return { statusCode: 200, headers, body: JSON.stringify({ code: 0, message: '已清空 ' + r1.deletedCount + ' 条评论, ' + r2.deletedCount + ' 条点赞' }) }
  }
  // 检查当前用户是否在管理员白名单（不需要admin token）
  if (body.event === 'QW_ADMIN_CHECK_WHITELIST') {`;
if (c.includes(old)) c = c.replace(old, neu);
else { const o=old.replace(/\n/g,'\r\n'); if(c.includes(o)){c=c.replace(o,neu.replace(/\n/g,'\r\n'));} else {console.log('nf');process.exit(1);} }
fs.writeFileSync('D:/Download/twikoo-netlify/netlify/functions/twikoo.js', c, 'utf8');
console.log('ok');
