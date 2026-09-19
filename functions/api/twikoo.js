// Cloudflare Pages Function: Twikoo API 代理
// 浏览器 -> qqzttkx.eu.cc/api/twikoo (国内可达) -> Netlify (Cloudflare 边缘转发)
const NETLIFY_API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };
  try {
    const body = await context.request.text();
    const resp = await fetch(NETLIFY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const data = await resp.text();
    return new Response(data, { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, message: '代理错误: ' + e.message }), { headers });
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
