// Cloudflare Pages Function: IP 归属地代理
const PROV_MAP = {
  'beijing':'北京','shanghai':'上海','tianjin':'天津','chongqing':'重庆',
  'guangdong':'广东','jiangsu':'江苏','zhejiang':'浙江','shandong':'山东',
  'henan':'河南','hebei':'河北','hunan':'湖南','hubei':'湖北','sichuan':'四川',
  'fujian':'福建','anhui':'安徽','jiangxi':'江西','liaoning':'辽宁',
  'shanxi':'山西','shaanxi':'陕西','heilongjiang':'黑龙江','jilin':'吉林',
  'guangxi':'广西','yunnan':'云南','guizhou':'贵州','gansu':'甘肃',
  'inner mongolia':'内蒙古','xinjiang':'新疆','xizang':'西藏','qinghai':'青海',
  'ningxia':'宁夏','hainan':'海南','hong kong':'香港','macau':'澳门','taiwan':'台湾'
};
const CITY_MAP = {
  'beijing':'北京','shanghai':'上海','tianjin':'天津','chongqing':'重庆',
  'guangzhou':'广州','shenzhen':'深圳','dongguan':'东莞','foshan':'佛山',
  'zhuhai':'珠海','zhongshan':'中山','huizhou':'惠州','jiangmen':'江门',
  'chengdu':'成都','hangzhou':'杭州','ningbo':'宁波','wenzhou':'温州',
  'jiaxing':'嘉兴','shaoxing':'绍兴','suzhou':'苏州','nanjing':'南京',
  'wuxi':'无锡','changzhou':'常州','nantong':'南通','xuzhou':'徐州',
  'jinan':'济南','qingdao':'青岛','yantai':'烟台','weifang':'潍坊',
  'zhengzhou':'郑州','luoyang':'洛阳','wuhan':'武汉','xiangyang':'襄阳',
  'changsha':'长沙','zhuzhou':'株洲','xiangtan':'湘潭','hengyang':'衡阳',
  'yueyang':'岳阳','yiyang':'益阳','changde':'常德','zhangjiajie':'张家界',
  'chenzhou':'郴州','shaoyang':'邵阳','yongzhou':'永州','huaihua':'怀化',
  'loudi':'娄底','nanchang':'南昌','jiujiang':'九江','hefei':'合肥',
  'wuhu':'芜湖','fuzhou':'福州','xiamen':'厦门','quanzhou':'泉州','putian':'莆田',
  'shenyang':'沈阳','dalian':'大连','changchun':'长春','harbin':'哈尔滨',
  'shijiazhuang':'石家庄','taiyuan':'太原','xian':'西安','xianyang':'咸阳',
  'kunming':'昆明','guiyang':'贵阳','nanning':'南宁','haikou':'海口',
  'lanzhou':'兰州','xining':'西宁','urumqi':'乌鲁木齐','lhasa':'拉萨',
  'hohhot':'呼和浩特','yinchuan':'银川'
};
function cnCity(c) { return CITY_MAP[String(c||'').toLowerCase().replace(/\s+/g,'')] || c || ''; }
function json(o) { return new Response(JSON.stringify(o), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } }); }

export async function onRequestPost(context) {
  const { request } = context;
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const ip = String(body.ip || '').trim();
  if (!ip || !/^([0-9a-fA-F:.]*[0-9a-fA-F]|(\d{1,3}\.){3}\d{1,3})$/.test(ip)) return json({ code: 0, loc: '' });

  // vore.top：带浏览器 UA 头，确保 ?ip= 参数被正确处理
  try {
    const resp = await fetch('https://api.vore.top/api/IPdata?ip=' + encodeURIComponent(ip), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://api.vore.top/'
      },
      signal: AbortSignal.timeout(5000)
    });
    const d = await resp.json();
    if (d && d.code === 200 && d.ipdata) {
      let p = String(d.ipdata.info1 || '').replace(/省$/, '');
      let c = String(d.ipdata.info2 || '').replace(/市$/, '');
      let dist = String(d.ipdata.info3 || '');
      if (dist === '基站' || dist === '街道' || dist === '区县') dist = '';
      let isp = String(d.ipdata.isp || '');
      if (/Amazon|AWS|EC2/i.test(isp)) isp = '亚马逊云';
      const parts = [];
      if (p) parts.push(p);
      if (c && c !== p) parts.push(c);
      if (dist && dist !== c) parts.push(dist);
      if (isp) parts.push(isp);
      if (parts.length) return json({ code: 0, loc: parts.join(' ') });
    }
  } catch (e) {}
  return json({ code: 0, loc: '' });
}
export async function onRequestOptions() {
  return new Response('', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
