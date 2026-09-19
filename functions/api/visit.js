// Cloudflare Pages Function: 访问日志上报 (KV 存储)
// POST /api/visit  body: { page, referrer, uaHash }
export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    let body;
    try { body = await context.request.json(); } catch { body = {}; }
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const page = body.page || '/';
    const referrer = body.referrer || '';
    const ua = context.request.headers.get('User-Agent') || '';
    const uaHash = body.uaHash || '';

    const visit = {
      ip, page, referrer, ua: ua.slice(0, 200), uaHash,
      time: new Date().toISOString()
    };

    // 按日期存储，每天一个 key
    const today = new Date().toISOString().slice(0, 10);
    const key = `visits_${today}`;
    const existing = await context.env.QW_VISITS.get(key, 'json') || [];
    existing.push(visit);
    // 每天最多存5000条，超出丢旧的
    if (existing.length > 5000) existing.splice(0, existing.length - 5000);
    await context.env.QW_VISITS.put(key, JSON.stringify(existing), { expirationTtl: 60 * 60 * 24 * 30 });

    return new Response(JSON.stringify({ code: 0 }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, error: e.message }), { headers });
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
