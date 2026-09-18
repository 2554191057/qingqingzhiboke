// Cloudflare Pages Function: Turnstile 后端验证
// POST /api/turnstile-verify  body: { token: "..." }
const SECRET_KEY = '0x4AAAAAAE5EV3OVawEM2msNoyRLY56vlng';

export async function onRequestPost(context) {
  let body;
  try { body = await context.request.json(); } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'invalid_json' }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  }
  const token = body.token;
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'missing_token' }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  }
  try {
    const formData = new FormData();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);
    const ip = context.request.headers.get('CF-Connecting-IP') || '';
    if (ip) formData.append('remoteip', ip);
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(8000)
    });
    const data = await resp.json();
    return new Response(JSON.stringify({ success: !!data.success, errorCodes: data['error-codes'] || [] }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'verify_failed' }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
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
