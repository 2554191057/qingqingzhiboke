// Cloudflare Pages Function: 在线人数 (D1，2分钟TTL)
// POST /api/online  -> 注册心跳并返回当前在线人数
export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const twoMin = 120000;

    // 注册心跳（upsert）
    await context.env.DB.prepare(
      'INSERT INTO online (ip, last_seen) VALUES (?, ?) ON CONFLICT(ip) DO UPDATE SET last_seen = ?'
    ).bind(ip, now, now).run();

    // 清理过期 + 统计在线人数
    await context.env.DB.prepare('DELETE FROM online WHERE last_seen < ?').bind(now - twoMin).run();
    const row = await context.env.DB.prepare('SELECT COUNT(*) as cnt FROM online').first();
    const count = row ? row.cnt : 0;

    return new Response(JSON.stringify({ code: 0, count }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, count: 0, error: e.message }), { headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
