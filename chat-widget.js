/* =============================================
   庆庆纸博客 · 全站悬浮访客聊天室（qiguangji ChatRoom 风格 · Twikoo 后端）
   右下角悬浮按钮 → 点击弹出 460px 居中面板；关闭后回到原页面，不跳转。
   引用方式：<script src="chat-widget.js?v=1"></script>（放在 script.js 之后）
   ============================================= */
(function () {
  'use strict';
  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  var CSS = [
    '/* ===== 悬浮聊天室（qiguangji 主题色板） ===== */',
    ':root { --jp-paper:#edf2fa; --jp-surface:rgba(255,255,255,.94); --jp-ink:#182641; --jp-muted:#62728e; --jp-line:#cedaed; --jp-accent:#087fa8; --jp-blue:#4c67eb; --jp-glow:rgba(16,147,195,.14); }',
    '[data-theme="dark"] { --jp-paper:#080e1c; --jp-surface:rgba(15,24,43,.96); --jp-ink:#e5edff; --jp-muted:#8a9dbd; --jp-line:#23324f; --jp-accent:#50d3f6; --jp-blue:#8291ff; --jp-glow:rgba(63,199,249,.12); }',
    '/* 右下角悬浮按钮 */',
    '.qw-launcher{position:fixed;z-index:45;right:22px;bottom:340px;display:flex;gap:9px;align-items:center;border:1px solid var(--jp-accent);padding:12px 17px;background:var(--jp-surface);border-radius:10px;box-shadow:0 0 30px var(--jp-glow),0 8px 24px rgba(0,0,0,.18);font-size:12px;color:var(--jp-accent);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}',
    '.qw-launcher:hover{transform:translateY(-3px);box-shadow:0 0 40px var(--jp-glow),0 12px 30px rgba(0,0,0,.22);}',
    '.qw-launcher svg{flex-shrink:0;}',
    '.qw-launcher .qw-dot{width:5px;height:5px;border-radius:50%;background:#3ecf6a;box-shadow:0 0 6px rgba(62,207,106,.7);}',
    '/* 遮罩 + 面板 */',
    '.qw-backdrop{position:fixed;inset:0;z-index:100;background:rgba(1,6,17,.65);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;padding:20px;}',
    '.qw-backdrop.qw-open{display:flex;animation:qwFade .25s ease;}',
    '.qw-panel{width:min(680px,100%);max-width:100%;max-height:calc(100dvh - 40px);display:flex;flex-direction:column;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:18px;box-shadow:0 28px 100px rgba(0,0,0,.4),0 0 40px var(--jp-glow);overflow:hidden;color:var(--jp-ink);animation:qwPop .3s cubic-bezier(.16,1,.3,1);}',
    '@keyframes qwFade{from{opacity:0}to{opacity:1}}',
    '@keyframes qwPop{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
    '.qw-panel>header{display:flex;align-items:center;gap:13px;padding:18px 20px;border-bottom:1px solid var(--jp-line);background:linear-gradient(110deg,var(--jp-glow),transparent);}',
    '.qw-head-icon{padding:10px;background:var(--jp-glow);border-radius:11px;color:var(--jp-accent);display:flex;align-items:center;justify-content:center;}',
    '.qw-panel h2{margin:0;font-weight:650;font-size:18px;color:var(--jp-ink);}',
    '.qw-panel header p{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--jp-muted);margin:5px 0 0;}',
    '.qw-panel header p .qw-dot{width:6px;height:6px;border-radius:50%;background:#3ecf6a;box-shadow:0 0 6px rgba(62,207,106,.7);}',
    '.qw-close{margin-left:auto;padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-close:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-notice{font-size:10px;color:var(--jp-muted);padding:12px 20px;background:var(--jp-glow);}',
    '.qw-body{padding:0 20px 18px;overflow:hidden;display:flex;flex-direction:column;flex:1;min-height:0;}',
    '/* ===== Twikoo → qiguangji 覆盖 ===== */',
    '/* 消息流在上、输入区在底部（qiguangji 聊天室顺序） */',
    '.qw-body #tcomment{--twikoo-bg:transparent;--twikoo-theme-bg:transparent;display:flex;flex:1;min-height:0;}',
    '.qw-body #twikoo{background:transparent!important;display:flex!important;flex-direction:column!important;min-height:0!important;flex:1!important;}',
    '.qw-body #twikoo .tk-comments{order:1!important;flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;}',
    '.qw-body #twikoo .tk-comments-container{flex:1!important;max-height:none!important;overflow-y:auto!important;padding:10px 0 12px;background:transparent!important;overscroll-behavior:contain;}',
    '.qw-body #twikoo .tk-submit{order:2!important;flex-shrink:0!important;background:transparent!important;padding:14px 0 0;border-top:1px solid var(--jp-line);display:none!important;}',
    '.qw-body #twikoo .tk-submit.qw-open{display:block!important;}',
    '.qw-body #twikoo .tk-submit .tk-row{background:transparent!important;margin:0!important;}',
    '.qw-body #twikoo .tk-submit .tk-row>.tk-avatar{display:none!important;}',
    '.qw-body #twikoo .tk-submit .tk-col{width:100%!important;padding:0!important;}',
    '.qw-body #twikoo .tk-meta-input{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;}',
    '.qw-body #twikoo .tk-meta-input .el-input{margin:0!important;min-width:0!important;width:100%!important;}',
    '.qw-body #twikoo .tk-meta-input .el-input:nth-child(3){display:none!important;}',
    '.qw-body #twikoo .el-input-group__prepend{display:none!important;}',
    '.qw-body #twikoo .el-input__inner{border:1px solid var(--jp-line)!important;border-radius:7px!important;background:var(--jp-paper)!important;color:var(--jp-ink)!important;font-size:12px!important;padding:8px 11px!important;height:auto!important;box-shadow:none!important;min-width:0!important;flex:1!important;}',
    '.qw-body #twikoo .el-input__inner:focus{outline:1px solid var(--jp-accent)!important;}',
    '.qw-body #twikoo .el-input-group{display:flex!important;align-items:center!important;}',
    '.qw-body #twikoo .tk-input.el-textarea{margin-top:10px!important;}',
    '.qw-body #twikoo .tk-input textarea{border:1px solid var(--jp-line)!important;border-radius:7px!important;background:var(--jp-paper)!important;color:var(--jp-ink)!important;font-size:12px!important;padding:9px 11px!important;resize:vertical;max-height:140px;box-shadow:none!important;width:100%!important;}',
    '.qw-body #twikoo .tk-input textarea:focus{outline:1px solid var(--jp-accent)!important;}',
    '.qw-body #twikoo .el-input__count{color:var(--jp-muted)!important;font-size:10px!important;}',
    '/* 底部"评论"按钮（点击展开输入区） */',
    '.qw-comment-btn{margin-top:12px;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;border:1px dashed var(--jp-line);border-radius:10px;background:var(--jp-paper);color:var(--jp-muted);font-size:12px;cursor:pointer;transition:border-color .2s ease,color .2s ease,background .2s ease;}',
    '.qw-comment-btn:hover{border-color:var(--jp-accent);color:var(--jp-accent);background:var(--jp-glow);}',
    '.qw-comment-btn svg{width:15px;height:15px;flex-shrink:0;}',
    '.qw-comment-btn.qw-hide{display:none!important;}',
    '.qw-body #twikoo .tk-submit-action-icon{color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-submit-action-icon svg{width:15px;height:15px;}',
    '.qw-body #twikoo .tk-row-actions-start .tk-submit-action-icon,.qw-body #twikoo .tk-row-actions-start button{color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-send{background:linear-gradient(120deg,#087fae,#4866db)!important;color:#fff!important;border-radius:7px!important;font-size:11px!important;padding:10px 14px!important;display:flex;align-items:center;gap:7px;border:none!important;}',
    '.qw-body #twikoo .tk-send:disabled{opacity:.45!important;cursor:not-allowed!important;}',
    '.qw-body #twikoo .tk-comment{display:flex!important;align-items:flex-start!important;gap:12px!important;margin-bottom:22px!important;padding:0!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:50px!important;height:50px!important;border-radius:50%!important;overflow:hidden!important;flex-shrink:0;margin:0!important;background:var(--jp-glow);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--jp-accent);}',
    '.qw-body #twikoo .tk-comment .tk-avatar img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{min-width:0!important;max-width:calc(100% - 62px)!important;padding:0!important;}',
    '.qw-body #twikoo .tk-comment .tk-row{display:block!important;margin:0 0 6px!important;}',
    '.qw-body #twikoo .tk-meta{display:flex;align-items:baseline;gap:12px;font-size:10px!important;color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-nick strong{color:var(--jp-accent)!important;font-weight:700!important;font-size:13px!important;}',
    '.qw-body #twikoo .tk-time time{font-size:10px!important;color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-action{margin-left:auto!important;display:flex!important;gap:10px!important;align-items:center!important;}',
    '.qw-body #twikoo .tk-action .tk-action-link{color:var(--jp-muted)!important;font-size:10px!important;padding:0!important;}',
    '.qw-body #twikoo .tk-action-icon svg{width:12px!important;height:12px!important;}',
    '.qw-body #twikoo .tk-content{white-space:pre-wrap;overflow-wrap:anywhere;padding:2px 0!important;background:transparent!important;border:none!important;border-radius:0!important;font-size:13px!important;line-height:1.75!important;margin:0!important;}',
    '.qw-body #twikoo .tk-content p{color:var(--jp-ink)!important;margin:0!important;}',
    '.qw-body #twikoo .tk-content a{color:var(--jp-accent)!important;}',
    '.qw-body #twikoo .tk-children{margin-left:62px!important;padding-left:0!important;}',
    '.qw-body #twikoo .tk-children .tk-comment{margin-bottom:12px!important;}',
    '.qw-body #twikoo .tk-children .tk-content{font-size:11px!important;}',
    '.qw-body #twikoo .tk-footer{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:12px 0 0!important;background:transparent!important;}',
    '.qw-body #twikoo .tk-footer a,.qw-body #twikoo .tk-footer .tk-action-link{color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-admin-container{display:none!important;}',
    '@media(max-width:640px){.qw-launcher{right:14px;bottom:16px;padding:11px 14px;}.qw-backdrop{padding:12px;}.qw-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-panel>header{padding:15px 16px;}.qw-body{padding:0 15px 14px;}.qw-notice{padding:10px 16px;font-size:9px;}.qw-body #twikoo .tk-comment .tk-avatar{width:40px!important;height:40px!important;}.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 52px)!important;}.qw-body #twikoo .tk-children{margin-left:52px!important;}}',
    '@media(prefers-reduced-motion:reduce){.qw-launcher,.qw-backdrop,.qw-panel{animation:none!important;transition:none!important}}'
  ].join('\n');

  var HTML = '' +
    '<button id="qw-launcher" class="qw-launcher" aria-label="打开访客聊天室" title="访客聊天室">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>' +
    '<span>聊天室</span><i class="qw-dot"></i></button>' +
    '<div id="qw-backdrop" class="qw-backdrop">' +
    '<div class="qw-panel" role="dialog" aria-modal="true" aria-labelledby="qw-title">' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>' +
    '<div><h2 id="qw-title">访客聊天室</h2><p><span class="qw-dot"></span>实时同步 · Powered by Twikoo</p></div>' +
    '<button class="qw-close" aria-label="关闭聊天室" title="关闭"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<p class="qw-notice">庆庆纸博客公共频道 · 可自由浏览，填写昵称后即可参与交流。</p>' +
    '<div class="qw-body"><div id="tcomment"></div><button id="qw-comment-btn" class="qw-comment-btn" aria-label="写评论"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>写评论…</button></div>' +
    '</div></div>';

  var style = document.createElement('style');
  style.id = 'chat-widget-style';
  style.textContent = CSS;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', HTML);

  var launcher = document.getElementById('qw-launcher');
  var backdrop = document.getElementById('qw-backdrop');
  var panel = backdrop.querySelector('.qw-panel');
  var closeBtn = panel.querySelector('.qw-close');
  var assetsLoaded = false;
  var twikooInited = false;

  function loadAssets(cb) {
    if (assetsLoaded) { cb(); return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://registry.npmmirror.com/twikoo/1.7.24/files/dist/twikoo.css';
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = 'https://registry.npmmirror.com/twikoo/1.7.24/files/dist/twikoo.all.min.js';
    s.onload = function () { assetsLoaded = true; cb(); };
    s.onerror = function () { assetsLoaded = true; cb(); };
    document.head.appendChild(s);
  }

  function initTwikoo() {
    if (twikooInited || !window.twikoo) return;
    twikooInited = true;
    try {
      twikoo.init({
        envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo',
        el: '#tcomment',
        path: 'chat',
        lang: 'zh-CN',
        onCommentLoaded: function () {}
      });
    } catch (e) { twikooInited = false; }
  }

  function openChat() {
    backdrop.classList.add('qw-open');
    document.body.style.overflow = 'hidden';
    loadAssets(function () { initTwikoo(); });
  }
  function closeChat() {
    backdrop.classList.remove('qw-open');
    document.body.style.overflow = '';
  }

  launcher.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeChat(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(); });

  // 底部"评论"按钮 → 展开 Twikoo 输入区（昵称/邮箱/网址 + 消息框）
  var commentBtn = document.getElementById('qw-comment-btn');
  commentBtn.addEventListener('click', function () {
    if (!backdrop.classList.contains('qw-open')) openChat();
    var submit = document.querySelector('.qw-body #twikoo .tk-submit');
    if (!submit) { setTimeout(function () { commentBtn.click(); }, 300); return; }
    submit.classList.add('qw-open');
    commentBtn.classList.add('qw-hide');
    var ta = submit.querySelector('textarea');
    // 把"必填"占位提示改为 昵称/邮箱
    var inners = submit.querySelectorAll('.tk-meta-input .el-input__inner');
    if (inners.length >= 1) inners[0].placeholder = '昵称';
    if (inners.length >= 2) inners[1].placeholder = '邮箱';
    if (ta) { ta.placeholder = '友善交流，文明发言…'; setTimeout(function () { ta.focus(); }, 50); }
  });

  // 拦截导航里的"聊天室"链接（fklts.html / chat.html）→ 打开悬浮弹窗，不跳转
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href$="fklts.html"], a[href$="chat.html"]') : null;
    if (a) { e.preventDefault(); openChat(); }
  }, true);

  // 外部可调用
  window.openChatRoom = openChat;
  window.closeChatRoom = closeChat;
})();
