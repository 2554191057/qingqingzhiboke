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
})();
