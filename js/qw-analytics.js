/**
 * qingqingzhiboke · 访客统计采集
 * 轻量级：页面加载记录访问 + 每 30s 心跳保活
 */
(function () {
  'use strict';
  if (window.__qwAnalyticsLoaded) return;
  window.__qwAnalyticsLoaded = true;

  var API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';

  // 简短 UA hash（防止隐私泄露，只用于去重）
  function uaHash() {
    var ua = navigator.userAgent + '|' + screen.width + 'x' + screen.height;
    var h = 0;
    for (var i = 0; i < ua.length; i++) {
      h = ((h << 5) - h + ua.charCodeAt(i)) | 0;
    }
    return (h >>> 0).toString(36);
  }

  function post(eventName, extra) {
    var body = Object.assign({ event: eventName }, extra || {});
    // 忽略错误（后台埋点不能影响主站体验）
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(function () {});
  }

  var hash = uaHash();
  var path = location.pathname + location.search;
  var referrer = document.referrer || '';

  // 1) 记录访问日志
  post('QW_STATS_VISIT_RECORD', {
    page: path,
    referrer: referrer,
    uaHash: hash,
  });

  // 2) 心跳保活（在线人数统计）
  var beat = function () {
    post('QW_ONLINE_PING', {
      page: path,
      uaHash: hash,
    });
  };
  beat(); // 立即发一次
  setInterval(beat, 30000); // 每 30 秒

  // 页面隐藏时发送一次（确保关闭也能被记录）
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') beat();
  });

  // ==================== 隐藏后台入口 ====================
  // Ctrl+Shift+A → 跳转 admin.html
  // 三击页面底部空白处 → 显示入口
  (function () {
    var ADMIN_URL = 'admin.html';
    var konamiBuffer = [];
    var KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','a','d','m','i','n'];

    document.addEventListener('keydown', function (e) {
      // 快捷键 1：Ctrl+Shift+A (Cmd+Shift+A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        location.href = ADMIN_URL;
        return;
      }
      // 快捷键 2：Konami "admin" 输入序列
      konamiBuffer.push(e.key);
      if (konamiBuffer.length > KONAMI_CODE.length) konamiBuffer.shift();
      if (konamiBuffer.length === KONAMI_CODE.length) {
        var match = true;
        for (var i = 0; i < KONAMI_CODE.length; i++) {
          if (konamiBuffer[i] !== KONAMI_CODE[i]) { match = false; break; }
        }
        if (match) {
          // 输入正确后延迟一点跳转，给用户看到反馈
          flashHint('🔓 Admin 入口已激活');
          setTimeout(function () { location.href = ADMIN_URL; }, 400);
        }
      }
    });

    // 提示闪烁（极短暂的视觉反馈）
    function flashHint(text) {
      var el = document.createElement('div');
      el.textContent = text;
      el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(8,127,168,0.9);color:#fff;border-radius:8px;font-size:13px;z-index:2147483647;backdrop-filter:blur(10px);box-shadow:0 4px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.2s;';
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.style.opacity = '1'; });
      setTimeout(function () { el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 200); }, 800);
    }
  })();
})();
