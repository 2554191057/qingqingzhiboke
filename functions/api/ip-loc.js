// Cloudflare Pages Function: 代理 vore.top IP 归属地查询（避免浏览器端 CORS/网络不稳定）
export async function onRequestPost(context) {
  const { request } = context
  let body = {}
  try { body = await request.json() } catch (e) {}
  const ip = String(body.ip || '').trim()
  if (!ip || !/^([0-9a-fA-F:.]*[0-9a-fA-F]|(\d{1,3}\.){3}\d{1,3})$/.test(ip)) {
    return new Response(JSON.stringify({ code: 0, loc: '' }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    })
  }
  try {
    const resp = await fetch('https://api.vore.top/api/IPdata?ip=' + encodeURIComponent(ip))
    const d = await resp.json()
    if (d && d.code === 200 && d.ipdata) {
      let p = String(d.ipdata.info1 || '').replace(/省$/, '')
      let c = String(d.ipdata.info2 || '').replace(/市$/, '')
      let dist = String(d.ipdata.info3 || '')
      if (dist === '基站' || dist === '街道' || dist === '区县') dist = ''
      let isp = String(d.ipdata.isp || '')
      if (/Amazon|AWS|EC2/i.test(isp)) isp = '亚马逊云'
      const parts = []
      if (p) parts.push(p)
      if (c && c !== p) parts.push(c)
      if (dist && dist !== c) parts.push(dist)
      if (isp) parts.push(isp)
      return new Response(JSON.stringify({ code: 0, loc: parts.join(' ') }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
      })
    }
  } catch (e) {}
  return new Response(JSON.stringify({ code: 0, loc: '' }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
  })
}
export async function onRequestOptions() {
  return new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
