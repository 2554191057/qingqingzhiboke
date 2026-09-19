// Cloudflare Pages Function: 后台 CMS 配置读写
// GET  /api/cms-config  → 公开读取全站可配置内容（文章/网盘/Hero/关于/社交等）
// POST /api/cms-config  → 管理员密码鉴权后保存配置到 KV
//
// body: { password: "xxx", config: { ... } }
// KV binding: SITE_CMS, key = site_config_v1

const KV_KEY = 'site_config_v1';
const DEFAULT_PASSWORD = '123';

function json(obj, init = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return new Response(JSON.stringify(obj), { ...init, headers: { ...headers, ...(init.headers || {}) } });
}

export async function onRequestOptions() {
  return json({ code: 0 }, { status: 204 });
}

export async function onRequestGet(context) {
  const kv = context.env.SITE_CMS;
  if (!kv) return json({ code: 500, msg: 'KV 未绑定' }, { status: 500 });
  try {
    const raw = await kv.get(KV_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return json({ code: 0, data });
  } catch (e) {
    return json({ code: 500, msg: '读取失败: ' + (e && e.message) }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const kv = context.env.SITE_CMS;
  if (!kv) return json({ code: 500, msg: 'KV 未绑定' }, { status: 500 });

  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return json({ code: 400, msg: '请求体不是合法 JSON' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  const expected = (typeof context.env.ADMIN_PASS === 'string' && context.env.ADMIN_PASS) ? context.env.ADMIN_PASS : DEFAULT_PASSWORD;
  if (password !== expected) {
    return json({ code: 403, msg: '密码错误' }, { status: 403 });
  }

  const config = body.config;
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return json({ code: 400, msg: 'config 必须是对象' }, { status: 400 });
  }

  // 简单体积上限，防止误传超大对象
  const text = JSON.stringify(config);
  if (text.length > 512 * 1024) {
    return json({ code: 413, msg: '配置过大（>512KB），请精简后再保存' }, { status: 413 });
  }

  try {
    await kv.put(KV_KEY, text);
    return json({ code: 0, msg: '保存成功', size: text.length });
  } catch (e) {
    return json({ code: 500, msg: '保存失败: ' + (e && e.message) }, { status: 500 });
  }
}
