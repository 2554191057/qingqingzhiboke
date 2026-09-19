// Cloudflare Pages Function: 管理端查询访问日志 (D1)
// GET /api/visits?days=7  -> 返回最近N天的访问日志
export async function onRequestGet(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    const url = new URL(context.request.url);
    const days = Math.min(parseInt(url.searchParams.get('days') || '7', 10), 30);
    const since = Date.now() - days * 86400000;

    const { results } = await context.env.DB.prepare(
      'SELECT ip, page, referrer, ua, ua_hash as uaHash, time FROM visits WHERE time >= ? ORDER BY time DESC LIMIT 500'
    ).bind(since).all();

    // 转换 time 为 ISO 字符串（前端 formatTime 兼容）
    const data = (results || []).map(r => ({ ...r, time: new Date(r.time).toISOString() }));
    return new Response(JSON.stringify({ code: 0, data, total: data.length }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, data: [], error: e.message }), { headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
