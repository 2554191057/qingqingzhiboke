// Cloudflare Pages Function: 管理端查询访问日志
// GET /api/visits?days=7  -> 返回最近N天的访问日志
export async function onRequestGet(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    const url = new URL(context.request.url);
    const days = Math.min(parseInt(url.searchParams.get('days') || '7', 10), 30);
    const all = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const key = `visits_${d}`;
      const dayData = await context.env.QW_VISITS.get(key, 'json');
      if (Array.isArray(dayData)) all.push(...dayData);
    }
    // 按时间倒序
    all.reverse();
    return new Response(JSON.stringify({ code: 0, data: all, total: all.length }), { headers });
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
