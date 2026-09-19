// Cloudflare Pages Function: 访问日志上报
// POST /api/visit  body: { page, referrer }
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://2554191057_db_user:Twikoo2026%21Netlify@cluster0.4qgll4q.mongodb.net/sjk?retryWrites=true&w=majority&authSource=admin';

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient.db('sjk');
}

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

    const db = await getDb();
    await db.collection('qw_visits').insertOne({
      ip, page, referrer, ua,
      time: new Date(),
      created: Date.now()
    });
    return new Response(JSON.stringify({ code: 0, message: 'ok' }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, message: e.message }), { headers });
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
