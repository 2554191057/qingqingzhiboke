/* =========================================================
 * 全站实时人数统计（2026-09-18 新增）
 * 自包含注入：左下角"实时人数 · X 人"小标签
 * 每 20 秒向 Twikoo 后端发心跳(QW_ONLINE_PING)+查询(QW_ONLINE_COUNT)
 * 在线数 = 最近 2 分钟内有心跳的去重 IP 数（后端 MongoDB 统计）
 * 样式跟随站点毛玻璃主题（--jp-* 由 chat-widget.js 注入，含后备色）
 * ========================================================= */
(function () {
  if (window.__qwOnlineStats) return; window.__qwOnlineStats = true;
  var API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';

  var style = document.createElement('style');
  style.textContent =
    '.qw-os-tag{position:fixed;left:16px;bottom:16px;z-index:90;display:flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;font-size:12px;line-height:1;color:var(--jp-text,#94a3b8);background:var(--jp-surface,rgba(255,255,255,.85));border:1px solid var(--jp-line,rgba(148,163,184,.28));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 4px 14px rgba(0,0,0,.12);pointer-events:none;user-select:none;opacity:.92;transition:opacity .3s ease;}' +
    '.qw-os-tag:hover{opacity:1;}' +
    '.qw-os-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.85);animation:qwOsPulse 2s ease-in-out infinite;}' +
    '.qw-os-tag b{font-weight:700;color:var(--jp-accent,#0ea5e9);font-size:13px;}' +
    '@keyframes qwOsPulse{0%,100%{opacity:1;}50%{opacity:.4;}}' +
    '@media(max-width:640px){.qw-os-tag{left:12px;bottom:14px;padding:6px 11px;font-size:11px;}}';
  document.head.appendChild(style);

  var el = document.createElement('div');
  el.className = 'qw-os-tag';
  el.setAttribute('title', '实时在线人数（全站心跳去重统计）');
  el.innerHTML = '<span class="qw-os-dot"></span>实时人数 <b id="qw-os-count">--</b> 人';
  document.body.appendChild(el);

  // 访问日志：页面打开即上报一次（全站统一由本脚本发送；boke.html 原内联已移除避免重复）
  // page 带 hash：锚点（#about 关于 / #social 联系 等）会推导为 visit_about / visit_social，后台显示"访问关于/访问联系"
  var lastVisitPage = '';
  function reportVisit(page) {
    if (page === lastVisitPage) return; // 同页同锚点不重复上报
    lastVisitPage = page;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'QW_VISIT', page: page, referrer: document.referrer }) }).catch(function () {});
  }
  reportVisit(location.pathname + location.search + location.hash);
  // 锚点区块访问日志：script.js 平滑滚动对 # 链接 preventDefault，hashchange 永不触发，改用捕获阶段 click 直接上报
  var anchorWhitelist = { about: 1, social: 1, contact: 1, gy: 1, lx: 1, birthdaycard: 1, birthdayCard: 1, home: 1, top: 1 };
  document.addEventListener('click', function (e) {
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var h = String(a.getAttribute('href') || '').replace(/^#/, '').trim().toLowerCase();
      if (!h || !anchorWhitelist[h]) return;
      reportVisit(location.pathname + location.search + '#' + h);
    } catch (err) {}
  }, true);
  function ping() {
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'QW_ONLINE_PING' }) }).catch(function () {});
  }
  function count() {
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'QW_ONLINE_COUNT' }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && typeof d.count === 'number') {
          var c = document.getElementById('qw-os-count');
          if (c) c.textContent = d.count;
        }
      })
      .catch(function () {});
  }
  ping();
  count();
  setInterval(function () { ping(); count(); }, 20000);
})();
