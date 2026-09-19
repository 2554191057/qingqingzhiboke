// Cloudflare Pages Function: 在线人数 (KV 存储，2分钟TTL)
// POST /api/online  -> 注册心跳并返回当前在线人数
export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const safeIp = ip.replace(/[^a-zA-Z0-9]/g, '_');
    const key = `online_${safeIp}`;

    // 注册心跳（2分钟过期）
    await context.env.QW_VISITS.put(key, Date.now().toString(), { expirationTtl: 120 });

    // 统计在线人数
    const list = await context.env.QW_VISITS.list({ prefix: 'online_' });
    const count = list.keys.length;

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
