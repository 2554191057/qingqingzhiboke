// Cloudflare Pages Function: 在线人数心跳+查询
// POST /api/online  body: {}  -> 自动注册心跳并返回当前在线人数
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://2554191057_db_user:Twikoo2026%21Netlify@cluster0.4qgll4q.mongodb.net/sjk?retryWrites=true&w=majority&authSource=admin';
const ONLINE_WINDOW = 2 * 60 * 1000; // 2分钟内有心跳算在线

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
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const db = await getDb();
    const now = Date.now();

    // 注册心跳
    await db.collection('qw_online').updateOne(
      { ip },
      { $set: { ip, lastPing: now } },
      { upsert: true }
    );

    // 统计2分钟内活跃IP数
    const count = await db.collection('qw_online').countDocuments({
      lastPing: { $gt: now - ONLINE_WINDOW }
    });

    return new Response(JSON.stringify({ code: 0, count }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ code: -1, count: 0, message: e.message }), { headers });
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
