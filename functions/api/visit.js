// Cloudflare Pages Function: 访问日志上报 (D1)
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
    const ua = (context.request.headers.get('User-Agent') || '').slice(0, 200);
    const uaHash = body.uaHash || '';
    const now = Date.now();

    await context.env.DB.prepare(
      'INSERT INTO visits (ip, page, referrer, ua, ua_hash, time) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(ip, page, referrer, ua, uaHash, now).run();

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
