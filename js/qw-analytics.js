/**
 * qingqingzhiboke · 访客统计采集
 * 轻量级：页面加载记录访问 + 每 30s 心跳保活
 */
(function () {
  'use strict';
  if (window.__qwAnalyticsLoaded) return;
  window.__qwAnalyticsLoaded = true;

  var VISIT_API = '/api/visit';
  var ONLINE_API = '/api/online';

  // 简短 UA hash（防止隐私泄露，只用于去重）
  function uaHash() {
    var ua = navigator.userAgent + '|' + screen.width + 'x' + screen.height;
    var h = 0;
    for (var i = 0; i < ua.length; i++) {
      h = ((h << 5) - h + ua.charCodeAt(i)) | 0;
    }
    return (h >>> 0).toString(36);
  }

  function postVisit(extra) {
    fetch(VISIT_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(extra || {}), keepalive: true }).catch(function () {});
  }
  function postOnline(extra) {
    fetch(ONLINE_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(extra || {}), keepalive: true }).catch(function () {});
  }

  var hash = uaHash();
  var path = location.pathname + location.search;
  var referrer = document.referrer || '';

  // 1) 记录访问日志
  postVisit({ page: path, referrer: referrer, uaHash: hash });

  // 2) 心跳保活（在线人数统计）
  var beat = function () {
    postOnline({ page: path, uaHash: hash });
  };
  beat(); // 立即发一次
  setInterval(beat, 30000); // 每 30 秒

  // 页面隐藏时发送一次（确保关闭也能被记录）
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') beat();
  });

  // ==================== 隐藏后台入口 ====================
  // Ctrl+Alt+Q (Mac: Cmd+Alt+Q) → 跳转 admin.html
  (function () {
    var ADMIN_URL = 'admin.html';

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        flashHint('🔓 Admin 入口已激活');
        setTimeout(function () { location.href = ADMIN_URL; }, 250);
      }
    });

    function flashHint(text) {
      var el = document.createElement('div');
      el.textContent = text;
      el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(8,127,168,0.9);color:#fff;border-radius:8px;font-size:13px;z-index:2147483647;backdrop-filter:blur(10px);box-shadow:0 4px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.2s;';
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.style.opacity = '1'; });
      setTimeout(function () { el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 200); }, 800);
    }
  
  // ==================== 滚动区块访问记录 ====================
  // 当用户滚动到 #blog / #resources 等区块时，记录对应访问
  var trackedSections = {};
  var sections = [
    { id: 'blog', path: '/boke#blog' },
    { id: 'resources', path: '/boke#resources' }
  ];
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        var id = entry.target.id;
        if (!trackedSections[id]) {
          trackedSections[id] = true;
          var section = sections.find(function(s) { return s.id === id; });
          if (section) {
            postVisit({ page: section.path, referrer: referrer, uaHash: hash });
          }
        }
      }
    });
  }, { threshold: [0.3] });
  sections.forEach(function(s) {
    var el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
})();

  // ==================== 滚动区块访问记录 ====================
  // 当用户滚动到 #blog / #resources 等区块时，记录对应访问
  var trackedSections = {};
  var sections = [
    { id: 'blog', path: '/boke#blog' },
    { id: 'resources', path: '/boke#resources' }
  ];
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        var id = entry.target.id;
        if (!trackedSections[id]) {
          trackedSections[id] = true;
          var section = sections.find(function(s) { return s.id === id; });
          if (section) {
            postVisit({ page: section.path, referrer: referrer, uaHash: hash });
          }
        }
      }
    });
  }, { threshold: [0.3] });
  sections.forEach(function(s) {
    var el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
})();
