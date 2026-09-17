/* =============================================
   庆庆纸博客 · 全站悬浮聊天室（qiguangji ChatRoom 风格 · Twikoo 后端）
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
    '.qw-panel{position:relative;width:620px;max-width:95vw;max-height:calc(100dvh - 40px);min-width:380px;min-height:500px;height:720px;display:flex;flex-direction:column;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:18px;box-shadow:0 28px 100px rgba(0,0,0,.4),0 0 40px var(--jp-glow);overflow:hidden;color:var(--jp-ink);animation:qwPop .3s cubic-bezier(.16,1,.3,1);resize:none;}',
'.qw-resize-handle{position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:9999;background:linear-gradient(135deg,transparent 50%,rgba(128,128,128,.4) 50%,rgba(128,128,128,.4) 60%,transparent 60%,transparent 70%,rgba(128,128,128,.4) 70%,rgba(128,128,128,.4) 80%,transparent 80%,transparent 90%,rgba(128,128,128,.4) 90%,rgba(128,128,128,.4) 100%);border-bottom-right-radius:18px;pointer-events:auto;}',
    '@keyframes qwFade{from{opacity:0}to{opacity:1}}',
    '@keyframes qwPop{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
    '.qw-panel>header{display:flex;align-items:center;gap:13px;padding:18px 20px;border-bottom:1px solid var(--jp-line);background:linear-gradient(110deg,var(--jp-glow),transparent);}',
    '.qw-head-icon{padding:10px;background:var(--jp-glow);border-radius:11px;color:var(--jp-accent);display:flex;align-items:center;justify-content:center;}',
    '.qw-panel h2{margin:0;font-weight:650;font-size:18px;color:var(--jp-ink);}',
    '.qw-panel header p{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--jp-muted);margin:5px 0 0;}',
    '.qw-panel header p .qw-dot{width:6px;height:6px;border-radius:50%;background:#3ecf6a;box-shadow:0 0 6px rgba(62,207,106,.7);}',
    '.qw-close{padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-icon-btn{padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-icon-btn:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-icon-btn.qw-spinning svg{animation:qwSpin .8s linear infinite;}',
    '@keyframes qwSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}',
    '.qw-dots{display:inline-block;width:20px;text-align:left;}',
    '.qw-dots::after{content:"";animation:qwDots 1.2s steps(4,end) infinite;}',
    '@keyframes qwDots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}',
    '.qw-logout-btn{display:none;padding:6px 10px;font-size:11px;border:1px solid var(--jp-line);border-radius:7px;background:var(--jp-paper);color:var(--jp-muted);cursor:pointer;transition:all .2s ease;}',
    '.qw-logout-btn:hover{color:#e05b5b;border-color:#e05b5b;}',
    '.qw-panel.qw-logged-in .qw-logout-btn{display:block;}',
    '.qw-settings-btn{display:none;padding:8px;color:var(--jp-muted);cursor:pointer;border-radius:8px;background:none;border:none;}',
    '.qw-panel.qw-logged-in .qw-settings-btn{display:flex;}',
    '.qw-settings-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(1,6,17,.6);backdrop-filter:blur(4px);}',
    '.qw-settings-modal.qw-open{display:flex;}',
    '.qw-settings-panel{width:min(380px,90vw);background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:14px;padding:20px;color:var(--jp-ink);}',
    '.qw-settings-panel h3{margin:0 0 4px;font-size:15px;}',
    '.qw-settings-panel .qw-set-sub{font-size:10px;color:var(--jp-muted);margin:0 0 14px;}',
    '.qw-settings-panel input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);border-radius:8px;background:var(--jp-paper);color:var(--jp-ink);padding:9px 11px;font-size:12px;margin-bottom:8px;outline:none;}',
    '.qw-settings-panel input:focus{border-color:var(--jp-accent);}',
    '.qw-settings-panel .qw-set-row{display:flex;gap:8px;margin-top:4px;}',
    '.qw-settings-panel .qw-set-row button{flex:1;padding:9px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;}',
    '.qw-settings-panel .qw-set-save{background:linear-gradient(120deg,#087fae,#4866db);color:#fff;}',
    '.qw-settings-panel .qw-set-cancel{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-settings-panel .qw-set-msg{font-size:11px;margin-top:6px;min-height:16px;}',
    '.qw-settings-panel .qw-set-ok{color:#2e9e5b;}',
    '.qw-settings-panel .qw-set-err{color:#e05b5b;}',
    '.qw-settings-section{border-top:1px solid var(--jp-line);padding-top:12px;margin-top:12px;}',
    '.qw-close:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-admin-btn{margin-left:auto;padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-admin-btn:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-admin-btn.qw-admin-on{color:#e8a33d;}',
    '.qw-close:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-notice{font-size:10px;color:var(--jp-muted);padding:12px 20px;background:var(--jp-glow);}',
    '.qw-login-mask{display:flex;flex-direction:column;flex:1;min-height:0;}',
'.qw-body{padding:0 20px 18px;overflow:hidden;display:flex;flex-direction:column;flex:1;min-height:0;}',
    '/* ===== Twikoo → qiguangji 覆盖 ===== */',
    '/* 消息流在上、输入区在底部（qiguangji 聊天室顺序） */',
    '.qw-body #tcomment{--twikoo-bg:transparent;--twikoo-theme-bg:transparent;display:flex;flex:1;min-height:0;}',
    '.qw-body #twikoo{background:transparent!important;display:flex!important;flex-direction:column!important;min-height:0!important;flex:1!important;}',
    '.qw-body #twikoo .tk-comments{order:1!important;flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;}',
    '.qw-body #twikoo .tk-comments-container{flex:1!important;max-height:none!important;overflow-y:auto!important;padding:10px 0 12px;background:transparent!important;overscroll-behavior:contain;}',
    '.qw-body #twikoo .tk-submit{order:2!important;flex-shrink:0!important;background:transparent!important;padding:14px 0 0;border-top:1px solid var(--jp-line);display:block!important;}',
    '.qw-body #twikoo .tk-submit .tk-row{background:transparent!important;margin:0!important;}',
    '.qw-body #twikoo .tk-submit .tk-row>.tk-avatar{display:none!important;}',
    '.qw-body #twikoo .tk-submit .tk-col{width:100%!important;padding:0!important;}',
    '.qw-body #twikoo .tk-meta-input{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;}',
    '.qw-body #twikoo .tk-meta-input .el-input{margin:0!important;min-width:0!important;width:100%!important;}',
    '.qw-body #twikoo .tk-meta-input .el-input:nth-child(3){display:none!important;}',
    '.qw-panel.qw-logged-in .qw-body #twikoo .tk-meta-input{display:none!important;}',
    '.qw-body #twikoo .el-input-group__prepend{display:none!important;}',
    '.qw-body #twikoo .el-input__inner{border:1px solid var(--jp-line)!important;border-radius:7px!important;background:var(--jp-paper)!important;color:var(--jp-ink)!important;font-size:12px!important;padding:8px 11px!important;height:auto!important;box-shadow:none!important;min-width:0!important;flex:1!important;}',
    '.qw-body #twikoo .el-input__inner:focus{outline:1px solid var(--jp-accent)!important;}',
    '.qw-body #twikoo .el-input-group{display:flex!important;align-items:center!important;}',
    '.qw-body #twikoo .tk-input.el-textarea{margin-top:10px!important;}',
    '.qw-body #twikoo .tk-input textarea{border:1px solid var(--jp-line)!important;border-radius:7px!important;background:var(--jp-paper)!important;color:var(--jp-ink)!important;font-size:12px!important;padding:9px 11px!important;resize:vertical;max-height:140px;box-shadow:none!important;width:100%!important;}',
    '.qw-body #twikoo .tk-input textarea:focus{outline:1px solid var(--jp-accent)!important;}',
    '.qw-body #twikoo .el-input__count{color:var(--jp-muted)!important;font-size:10px!important;}',
    /* 底部输入区：常显聊天框（原"写评论"折叠按钮已移除） */
    '.qw-comment-btn{display:none!important;}',
    /* 聊天框布局：昵称/邮箱一行 + 输入框 + 发送（紧凑） */
    '.qw-body #twikoo .tk-meta-input{grid-template-columns:1fr 1fr;gap:8px;}',
    '.qw-body #twikoo .tk-input.el-textarea{margin-top:10px!important;}',
    '.qw-body #twikoo .tk-input textarea{min-height:44px!important;max-height:110px;resize:none!important;border-radius:10px!important;font-size:13px!important;line-height:1.6!important;}',
    '.qw-body #twikoo .tk-row-actions-start{margin-top:8px!important;}',
    '.qw-body #twikoo .tk-submit-action-icon{color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-submit-action-icon svg{width:15px;height:15px;}',
    '.qw-body #twikoo .tk-row-actions-start .tk-submit-action-icon,.qw-body #twikoo .tk-row-actions-start button{color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-submit .OwO,.qw-body #twikoo .OwO,.qw-body #twikoo .OwO-logo,.qw-body #twikoo .tk-submit-action-icon.OwO{display:none!important;}',
    '.qw-body #twikoo .tk-submit .__markdown,.qw-body #twikoo .tk-submit-action-icon.__markdown,.qw-body #twikoo .markdown-icon{display:none!important;}',
    '.qw-body #twikoo .tk-submit .tk-preview,.qw-body #twikoo .tk-preview,.qw-body #twikoo .preview-icon,.qw-body #twikoo .tk-preview-btn{display:none!important;}',
    '.qw-body #twikoo .qw-img-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;background:var(--jp-glow);border-radius:7px;cursor:pointer;color:var(--jp-muted);flex-shrink:0;}',
    '.qw-body #twikoo .qw-img-btn:hover{color:var(--jp-accent);}',
    '.qw-body #twikoo .qw-img-btn input{display:none;}',
    '.qw-body #twikoo .tk-none{display:none!important;}',
    '.qw-body #twikoo .tk-comments-container:empty{display:none!important;}',
    '.qw-body #twikoo .tk-comments-container:only-child{display:none!important;}',
    '.qw-body #twikoo .tk-pagination{display:none!important;}',
    '.qw-body #twikoo .tk-send{background:linear-gradient(120deg,#087fae,#4866db)!important;color:#fff!important;border-radius:7px!important;font-size:11px!important;padding:10px 14px!important;display:flex;align-items:center;gap:7px;border:none!important;}',
    '.qw-body #twikoo .tk-send:disabled{opacity:.45!important;cursor:not-allowed!important;}',
    /* Twikoo 原生回复提示条隐藏（用自绘 .qw-reply-bar 替代） */
    '.qw-body #twikoo [class*=comment-parent]{display:none!important;}',
    /* 微信风：发送按钮与输入框同行右侧 */
    '.qw-body #twikoo .tk-row-actions-start{display:flex!important;justify-content:flex-end!important;margin-top:6px!important;}',
    /* 自绘微信风回复预览条 */
    '.qw-reply-bar{display:flex;align-items:center;gap:8px;background:var(--jp-paper)!important;border:1px solid var(--jp-line)!important;border-radius:8px;padding:6px 10px;margin:0 0 8px;font-size:11px;color:var(--jp-muted);}',
    '.qw-reply-bar .qw-reply-nick{color:var(--jp-accent)!important;font-weight:600;flex-shrink:0;}',
    '.qw-reply-bar .qw-reply-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.qw-reply-bar .qw-reply-cancel{cursor:pointer;color:var(--jp-muted);flex-shrink:0;padding:0 4px;font-size:14px;line-height:1;}',
    '.qw-reply-bar .qw-reply-cancel:hover{color:var(--jp-ink);}',
    /* 访客登录：header 登录按钮 */
    '.qw-login-btn{background:transparent;border:1px solid var(--jp-line);color:var(--jp-muted);border-radius:7px;padding:5px 11px;font-size:11px;cursor:pointer;transition:all .15s ease;}',
    '.qw-login-btn:hover{border-color:var(--jp-accent);color:var(--jp-accent);}',
    '.qw-login-btn.qw-logged-in{color:var(--jp-accent);border-color:var(--jp-accent);font-weight:600;}',
    /* 登录弹窗 */
    '.qw-login-backdrop{position:fixed;inset:0;z-index:200;background:rgba(1,6,17,.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:20px;}',
    '.qw-login-backdrop.qw-open{display:flex;animation:qwFade .2s ease;}',
    '.qw-login-panel{position:relative;width:340px;max-width:100%;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:18px;padding:0;box-shadow:0 18px 60px rgba(0,0,0,.45),0 0 30px var(--jp-glow);overflow:hidden;animation:qwPop .25s cubic-bezier(.16,1,.3,1);}',
    '.qw-login-head{position:relative;padding:26px 24px 18px;text-align:center;background:linear-gradient(135deg,rgba(8,127,174,.16),rgba(72,102,219,.16));border-bottom:1px solid var(--jp-line);}',
    '.qw-login-head .qw-login-logo{width:44px;height:44px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#087fae,#4866db);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 18px rgba(8,127,174,.4);}',
    '.qw-login-head h3{margin:0 0 3px;font-size:17px;color:var(--jp-ink);font-weight:700;}',
    '.qw-login-head p{margin:0;font-size:11px;color:var(--jp-muted);}',
    '.qw-login-tabs{display:flex;margin:0 24px;padding-top:14px;gap:8px;}',
    '.qw-login-tab{flex:1;padding:9px 0;border:none;border-radius:10px;background:transparent;color:var(--jp-muted);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s ease;}',
    '.qw-login-tab.qw-active{background:linear-gradient(120deg,#087fae,#4866db);color:#fff;box-shadow:0 4px 14px rgba(8,127,174,.35);}',
    '.qw-login-body{padding:16px 24px 24px;}',
    '.qw-login-field{position:relative;margin-bottom:10px;}',
    '.qw-login-field .qw-f-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--jp-muted);display:flex;pointer-events:none;}',
    '.qw-login-panel input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);background:var(--jp-paper);color:var(--jp-ink);border-radius:10px;padding:10px 11px 10px 34px;font-size:13px;outline:none;transition:border-color .15s ease,box-shadow .15s ease;}',
    '.qw-login-panel input:focus{border-color:var(--jp-accent);box-shadow:0 0 0 3px rgba(8,127,174,.15);}',
    '.qw-login-code-row{display:none;gap:6px;margin-bottom:10px;}',
    '.qw-login-code-row .qw-c-input{flex:1;padding-left:11px;}',
    '.qw-login-panel .qw-send-code{width:auto;flex-shrink:0;padding:0 12px;white-space:nowrap;border:none;border-radius:10px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:11px;cursor:pointer;transition:opacity .15s ease;}',
    '.qw-login-panel .qw-send-code:hover{opacity:.9;}',
    '.qw-login-panel .qw-send-code:disabled{opacity:.5;cursor:not-allowed;}',
    '.qw-login-panel .qw-submit{width:100%;padding:11px;border:none;border-radius:10px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:2px;transition:opacity .15s ease,transform .1s ease;margin-top:2px;}',
    '.qw-login-panel .qw-submit:hover{opacity:.92;transform:translateY(-1px);}',
    '.qw-login-panel .qw-submit:disabled{opacity:.55;cursor:not-allowed;}',
    '.qw-login-toggle{text-align:center;margin:12px 0 0;font-size:11px;color:var(--jp-muted);}',
    '.qw-login-toggle b{color:var(--jp-accent);cursor:pointer;font-weight:600;}',
    '.qw-login-msg{text-align:center;margin:8px 0 0;font-size:11px;color:#e74c3c;min-height:14px;}',
    '.qw-login-msg.qw-ok{color:#2ecc71;}',
    /* 未登录：底部登录条（qiguangji 风格） */
    '.qw-login-bar{display:none;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid var(--jp-line);flex-shrink:0;}',
    '.qw-login-mask.qw-needs-login .qw-login-bar{display:flex;}',
    '.qw-login-mask.qw-needs-login .qw-body #twikoo .tk-submit{display:none!important;}',
    '.qw-login-bar .qw-lb-text h4{margin:0 0 3px;font-size:13px;color:var(--jp-ink);font-weight:700;}',
    '.qw-login-bar .qw-lb-text p{margin:0;font-size:10px;color:var(--jp-muted);}',
    '.qw-login-bar .qw-lb-btn{background:linear-gradient(120deg,#087fae,#4866db);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;}',
    '.qw-login-bar .qw-lb-btn:hover{opacity:.92;}',
    '.qw-login-bar .qw-lb-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}',
    '.qw-login-bar .qw-lb-right p{margin:0;font-size:10px;color:var(--jp-muted);}',
    /* ===== 聊天气泡布局：自己右侧、别人左侧 ===== */
    '.qw-body #twikoo .tk-comment{display:flex!important;align-items:center!important;gap:10px!important;margin-bottom:16px!important;padding:0!important;flex-direction:row!important;}',
    '.qw-body #twikoo .tk-comment.tk-self{flex-direction:row-reverse!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:38px!important;height:38px!important;border-radius:50%!important;overflow:hidden!important;flex-shrink:0;margin:0!important;background:var(--jp-glow)!important;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--jp-accent)!important;font-weight:600;}.qw-body #twikoo .tk-comment .tk-avatar, .qw-body #twikoo .tk-comment .tk-nick a, .qw-body #twikoo .tk-comment .tk-nick{pointer-events:none!important;cursor:default!important;text-decoration:none!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{min-width:0!important;max-width:calc(100% - 48px)!important;padding:0!important;display:flex!important;flex-direction:column!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main{align-items:flex-end!important;}',
    '.qw-body #twikoo .tk-comment .tk-row{display:flex!important;align-items:center!important;gap:8px!important;margin:0 0 4px!important;padding:0 4px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-row{flex-direction:row-reverse!important;}',
    '.qw-body #twikoo .tk-meta{display:flex;align-items:baseline;gap:10px;font-size:10px!important;color:var(--jp-muted)!important;}',
    '.qw-body #twikoo .tk-nick strong{color:var(--jp-accent)!important;font-weight:700!important;font-size:12.5px!important;}',
    '.qw-body #twikoo .tk-time time{font-size:10px!important;color:var(--jp-muted)!important;}',
    /* ===== 昵称移到气泡左上方 ===== */
    '.qw-body #twikoo .tk-comment{flex-wrap:nowrap!important;}',
    '.qw-body #twikoo .tk-comment .tk-nick{display:block!important;margin:0 0 3px!important;padding:0 4px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-nick{text-align:right!important;}',
    '.qw-body #twikoo .tk-nick strong{color:var(--jp-accent)!important;font-weight:700!important;font-size:12.5px!important;}',
    '.qw-body #twikoo .tk-comment .tk-row .tk-nick,.qw-body #twikoo .tk-comment .tk-row-head .tk-nick,.qw-body #twikoo .tk-comment .tk-head .tk-nick{display:none!important;}',
    '.qw-body #twikoo .tk-comment .tk-row .tk-mail,.qw-body #twikoo .tk-comment .tk-row-head .tk-mail{display:inline!important;}',
    /* 昵称/操作移走后，头部行只余隐藏时间，直接隐藏 */
    '.qw-body #twikoo .tk-comment .tk-row{display:none!important;}',
    /* ===== 气泡：自适应宽度 + 小尾巴角标，与头像平齐 ===== */
    '.qw-body #twikoo .tk-content{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--jp-surface)!important;border:1px solid var(--jp-line)!important;border-radius:12px 12px 12px 4px!important;padding:7px 12px!important;font-size:12px!important;line-height:1.55!important;margin:0!important;box-shadow:0 1px 2px rgba(16,40,80,.06)!important;width:fit-content!important;max-width:100%!important;min-width:0!important;position:relative!important;}',
    '.qw-body #twikoo .tk-content:before{content:""!important;position:absolute!important;top:12px!important;left:-6px!important;border:6px solid transparent!important;border-left-width:0!important;border-right-color:var(--jp-surface)!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content{background:linear-gradient(120deg,rgba(16,147,195,.16),rgba(72,102,219,.14))!important;border-color:rgba(16,147,195,.28)!important;border-radius:12px 12px 4px 12px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content:before{left:auto!important;right:-6px!important;border-right-width:0!important;border-left-width:6px!important;border-right-color:transparent!important;border-left-color:rgba(16,147,195,.16)!important;}',
    /* ===== 操作按钮：移到气泡下方横排（常显长条） ===== */
    '.qw-body #twikoo .tk-action{margin-left:0!important;display:flex!important;gap:16px!important;align-items:center!important;padding:5px 8px 0!important;opacity:1!important;}',
    /* 已点赞高亮（本地记录，服务端 liked 状态不可用） */
    '.qw-body #twikoo .tk-action-link.qw-liked{color:var(--jp-accent)!important;font-weight:600!important;}',
    '.qw-body #twikoo .tk-action-link.qw-liked .tk-action-icon{transform:scale(1.08);}',
    '.qw-body #twikoo .tk-action-link.qw-disliked{color:#e74c3c!important;font-weight:600!important;}',
    '.qw-body #twikoo .tk-action-link.qw-disliked .tk-action-icon{transform:scale(1.08);}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-action{justify-content:flex-end!important;}',
    '.qw-body #twikoo .tk-action .tk-action-link{color:var(--jp-muted)!important;font-size:11px!important;padding:0!important;display:inline-flex!important;align-items:center!important;gap:3px!important;transition:color .15s ease!important;}',
    '.qw-body #twikoo .tk-action .tk-action-link:hover{color:var(--jp-accent)!important;}',
    '.qw-body #twikoo .tk-action-icon svg{width:13px!important;height:13px!important;}',
    '.qw-body #twikoo .tk-action-count{font-size:10px!important;}',
    '.qw-body #twikoo .tk-content p{color:var(--jp-ink)!important;margin:0!important;}',
    '.qw-body #twikoo .tk-content a{color:var(--jp-accent)!important;}',
    /* ===== 微信聊天流：隐藏评论区元素（统计/排序/设备/footer） ===== */
    '.qw-body #twikoo .tk-comments-title,.qw-body #twikoo .tk-action-bar,.qw-body #twikoo .tk-comments-switch,.qw-body #twikoo .tk-extra,.qw-body #twikoo .tk-extras,.qw-body #twikoo .tk-footer{display:none!important;}',
    '.qw-body #twikoo .tk-comments-container{padding-top:6px!important;}',
    /* 时间用居中时间条显示（微信式），隐藏每条小时间 */
    '.qw-body #twikoo .tk-time{display:none!important;}',
    '.qw-body #twikoo .qw-time-sep{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:10px 0 6px!important;opacity:.8!important;letter-spacing:.5px!important;}',
    /* 气泡（紧凑） */
    '.qw-body #twikoo .tk-comment{margin-bottom:7px!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:38px!important;height:38px!important;font-size:17px!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 48px)!important;}',
    /* ===== QQ式引用回复：气泡内引用栏（细淡灰条） ===== */
    '.qw-body #twikoo .qw-quote{background:rgba(128,142,168,.1)!important;border-left:3px solid var(--jp-accent)!important;border-radius:4px!important;padding:4px 9px!important;font-size:11px!important;line-height:1.5!important;color:var(--jp-muted)!important;margin:0 0 5px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;white-space:normal!important;text-align:left!important;opacity:.85;}',
    '.qw-body #twikoo .tk-replies,.qw-body #twikoo .tk-children{display:none!important;}',
    '.qw-body #twikoo .tk-expand-wrap,.qw-body #twikoo .tk-expand{display:none!important;}',
    '.qw-body #twikoo .tk-footer{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:12px 0 0!important;background:transparent!important;}',
    '.qw-body #twikoo .tk-footer a,.qw-body #twikoo .tk-footer .tk-action-link{color:var(--jp-muted)!important;}',
    /* Twikoo 管理抽屉（隐藏，改用自绘管理面板） */
    '.qw-body #twikoo .tk-admin-container{display:none!important;}',
    /* ===== 自绘管理员面板（毛玻璃 · 日夜自适应） ===== */
    '.qw-admin-backdrop{position:fixed;inset:0;z-index:130;background:rgba(1,6,17,.68);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:20px;}',
    '.qw-admin-backdrop.qw-open{display:flex;animation:qwFade .25s ease;}',
    '.qw-admin-panel{width:min(560px,100%);max-height:calc(100dvh - 40px);display:flex;flex-direction:column;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:18px;box-shadow:0 28px 100px rgba(0,0,0,.45),0 0 40px var(--jp-glow);overflow:hidden;color:var(--jp-ink);animation:qwPop .3s cubic-bezier(.16,1,.3,1);}',
    '.qw-admin-panel>header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--jp-line);background:linear-gradient(110deg,var(--jp-glow),transparent);}',
    '.qw-admin-panel h2{margin:0;font-weight:650;font-size:17px;color:var(--jp-ink);}',
    '.qw-admin-panel header p{margin:4px 0 0;font-size:10px;color:var(--jp-muted);}',
    '.qw-admin-body{padding:18px 20px 20px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:none;-ms-overflow-style:none;}',
    '.qw-admin-body::-webkit-scrollbar{display:none;}',
    '.qw-admin-form{max-width:320px;margin:40px auto;text-align:center;}',
    '.qw-admin-form .qw-lock{width:58px;height:58px;margin:0 auto 14px;border-radius:50%;background:var(--jp-glow);color:var(--jp-accent);display:flex;align-items:center;justify-content:center;}',
    '.qw-admin-form h3{margin:0 0 6px;font-size:17px;color:var(--jp-ink);}',
    '.qw-admin-form .qw-sub{font-size:11px;color:var(--jp-muted);margin:0 0 18px;}',
    '.qw-admin-form input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);border-radius:9px;background:var(--jp-paper);color:var(--jp-ink);font-size:13px;padding:11px 14px;outline:none;transition:border-color .2s ease,box-shadow .2s ease;}',
    '.qw-admin-form input:focus{border-color:var(--jp-accent);box-shadow:0 0 0 3px var(--jp-glow);}',
    '.qw-admin-form button.qw-login{width:100%;margin-top:12px;padding:11px;border:none;border-radius:9px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .2s ease,transform .2s ease;}',
    '.qw-admin-form button.qw-login:hover{opacity:.9;transform:translateY(-1px);}',
    '.qw-admin-form button.qw-login:disabled{opacity:.55;cursor:not-allowed;}',
    /* 聊天室登录遮罩 */
    '.qw-login-overlay{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(15,20,30,.88);backdrop-filter:blur(12px);border-radius:inherit;}',
    '.qw-login-card{width:82%;max-width:300px;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:16px;padding:22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.4);}',
    '.qw-login-card h3{margin:0 0 4px;font-size:16px;color:var(--jp-ink);font-weight:700;text-align:center;}',
    '.qw-login-card .qw-login-sub{margin:0 0 16px;font-size:11px;color:var(--jp-muted);text-align:center;}',
    '.qw-login-card input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);border-radius:9px;background:var(--jp-paper);color:var(--jp-ink);font-size:13px;padding:10px 12px;margin-bottom:10px;outline:none;}',
    '.qw-login-card input:focus{outline:1.5px solid var(--jp-accent);}',
    '.qw-login-card .qw-login-btn{width:100%;padding:11px;border:none;border-radius:9px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:13px;font-weight:600;cursor:pointer;}',
    '.qw-login-card .qw-login-err{color:#e74c3c;font-size:11px;text-align:center;margin-top:6px;min-height:14px;}',
    '.qw-admin-err{font-size:11px;color:#e05b5b;margin-top:10px;min-height:15px;}',
    '.qw-admin-stats{display:flex;gap:10px;margin-bottom:14px;}',
    '.qw-admin-stats div{flex:1;text-align:center;padding:12px 8px;border:1px solid var(--jp-line);border-radius:10px;background:var(--jp-paper);}',
    '.qw-admin-stats b{display:block;font-size:20px;color:var(--jp-accent);}',
    '.qw-admin-stats span{font-size:10px;color:var(--jp-muted);}',
    '.qw-admin-list{display:flex;flex-direction:column;gap:9px;}',
    '.qw-admin-item{border:1px solid var(--jp-line);border-radius:11px;background:var(--jp-paper);padding:10px 12px;font-size:11px;}',
    '.qw-admin-item .qw-hd{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}',
    '.qw-admin-item .qw-nick{font-weight:700;color:var(--jp-ink);font-size:12px;}',
    '.qw-admin-item .qw-mail{color:var(--jp-accent);word-break:break-all;}',
    '.qw-admin-item .qw-ip{color:var(--jp-muted);}',
    '.qw-admin-item .qw-tm{color:var(--jp-muted);margin-left:auto;font-size:10px;}',
    '.qw-admin-item .qw-cmt{color:var(--jp-ink);margin:7px 0;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;}',
    '.qw-admin-item .qw-ops{display:flex;gap:7px;justify-content:flex-end;}',
    '.qw-admin-item .qw-like-info{margin:6px 0 0;font-size:10px;color:var(--jp-accent);opacity:.9;word-break:break-all;line-height:1.5;}',
    '.qw-admin-item .qw-ops button{border:1px solid var(--jp-line);background:var(--jp-surface);color:var(--jp-muted);font-size:10px;padding:5px 10px;border-radius:7px;cursor:pointer;transition:all .2s ease;}',
    '.qw-admin-item .qw-ops button.qw-del:hover{border-color:#e05b5b;color:#e05b5b;background:rgba(224,91,91,.08);}',
    '.qw-admin-item .qw-ops button.qw-blk:hover{border-color:#e8a33d;color:#e8a33d;background:rgba(232,163,61,.08);}',
    '.qw-admin-blocks{margin-top:16px;border-top:1px dashed var(--jp-line);padding-top:13px;}',
    '.qw-admin-blocks h4{font-size:12px;color:var(--jp-muted);margin:0 0 9px;font-weight:600;}',
    '.qw-admin-blocks .qw-blk-item{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px dashed var(--jp-line);font-size:11px;}',
    '.qw-admin-blocks .qw-blk-item span{color:var(--jp-accent);word-break:break-all;flex:1;}',
    '.qw-admin-blocks .qw-blk-item button{border:none;background:none;color:var(--jp-muted);font-size:10px;cursor:pointer;text-decoration:underline;padding:2px 6px;}',
    '.qw-admin-blocks .qw-blk-item button:hover{color:#e05b5b;}',
    '.qw-admin-empty{text-align:center;color:var(--jp-muted);font-size:12px;padding:30px 0;}',
    '.qw-mgmt-section{margin-top:16px;border-top:1px dashed var(--jp-line);padding-top:13px;}',
    '.qw-mgmt-section h4{font-size:12px;color:var(--jp-muted);margin:0 0 9px;font-weight:600;}',
    '.qw-mgmt-item{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px dashed var(--jp-line);font-size:11px;}',
    '.qw-mgmt-item span{color:var(--jp-accent);word-break:break-all;flex:1;}',
    '.qw-mgmt-item button{border:none;background:none;color:var(--jp-muted);font-size:10px;cursor:pointer;text-decoration:underline;padding:2px 6px;}',
    '.qw-mgmt-item button:hover{color:#e05b5b;}',
    '.qw-log-item{padding:7px 0;border-bottom:1px dashed var(--jp-line);font-size:11px;color:var(--jp-text);line-height:1.5;word-break:break-all;}',
    '.qw-log-item .qw-log-sub{display:block;color:var(--jp-muted);font-size:10px;line-height:1.4;margin-top:2px;}',
    '.qw-mgmt-input-row{display:flex;gap:6px;margin:8px 0;}',
    '.qw-mgmt-input-row input{flex:1;border:1px solid var(--jp-line);border-radius:7px;background:var(--jp-paper);color:var(--jp-ink);padding:7px 10px;font-size:11px;outline:none;}',
    '.qw-mgmt-input-row input:focus{border-color:var(--jp-accent);}',
    '.qw-mgmt-input-row button{border:none;border-radius:7px;padding:7px 12px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;}',
    '.qw-mgmt-input-row .qw-add-blk{background:#e05b5b;color:#fff;}',
    '.qw-mgmt-input-row .qw-add-wl{background:linear-gradient(120deg,#087fae,#4866db);color:#fff;}',
    '.qw-admin-badge{display:inline-block;font-size:9px;background:linear-gradient(120deg,#f59e0b,#ef4444);color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px;vertical-align:middle;font-weight:600;}',
    '.qw-admin-logout{margin:16px auto 0;display:block;border:none;background:none;color:var(--jp-muted);font-size:11px;cursor:pointer;text-decoration:underline;padding:6px 12px;}',
    '.qw-admin-logout:hover{color:#e05b5b;}',
    '.qw-admin-loading{text-align:center;color:var(--jp-muted);font-size:12px;padding:26px 0;}',
    '@media(max-width:640px){.qw-admin-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-admin-body{padding:14px 15px 16px;}}',
    '@media(max-width:640px){.qw-launcher{right:14px;bottom:16px;padding:11px 14px;}.qw-backdrop{padding:12px;}.qw-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-panel>header{padding:15px 16px;}.qw-body{padding:0 15px 14px;}.qw-notice{padding:10px 16px;font-size:9px;}.qw-body #twikoo .tk-comment .tk-avatar{width:32px!important;height:32px!important;}.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 42px)!important;}.qw-body #twikoo .tk-children{margin-left:42px!important;}}',
    '@media(prefers-reduced-motion:reduce){.qw-launcher,.qw-backdrop,.qw-panel{animation:none!important;transition:none!important}}'
  ].join('\n');

  var HTML = '' +
    '<button id="qw-launcher" class="qw-launcher" aria-label="打开聊天室" title="聊天室">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>' +
    '<span>聊天室</span><i class="qw-dot"></i></button>' +
    '<div id="qw-backdrop" class="qw-backdrop">' +
    '<div class="qw-panel" role="dialog" aria-modal="true" aria-labelledby="qw-title">' +
'<div class="qw-resize-handle" id="qw-resize-handle"></div>' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>' +
    '<div><h2 id="qw-title">聊天室</h2><p><span class="qw-dot"></span>实时同步 · Powered by Twikoo</p></div>' +

    '<button class="qw-admin-btn" id="qw-admin-trigger" aria-label="聊天后台" title="聊天后台"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
    '<button class="qw-settings-btn" id="qw-settings-btn" title="账号设置"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>' +
    '<button class="qw-logout-btn" id="qw-logout-btn" title="退出登录">退出</button>' +
    '<button type="button" class="qw-icon-btn" id="qw-resize-hint" aria-label="右下角缩放" title="右下角缩放" style="font-size:10px;gap:3px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>右下角缩放</button>' +
    '<button type="button" class="qw-icon-btn" id="qw-chat-refresh" aria-label="刷新聊天" title="刷新聊天"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>' +
    '<button class="qw-close" aria-label="关闭聊天室" title="关闭"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<p class="qw-notice">庆庆纸博客公共频道 · 可自由浏览，登录后即可发言。</p>' +
    '<div class="qw-login-mask" id="qw-login-mask">' +
    '<div class="qw-body"><div id="tcomment"></div><button id="qw-comment-btn" class="qw-comment-btn" aria-label="写评论"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>写评论…</button></div>' +
    '<div class="qw-login-bar"><div class="qw-lb-text"><h4>身份验证</h4><p>昵称和头像使用你的邮箱公开资料</p></div><div class="qw-lb-right"><p>登录后才可以发送消息</p><button class="qw-lb-btn" id="qw-login-bar-btn">登 录</button></div></div></div>' +
    '</div></div>' +
    /* 访客登录弹窗 */
    '<div id="qw-settings-modal" class="qw-login-backdrop">' +
    '<div class="qw-login-panel">' +
    '<div class="qw-login-head">' +
    '<div class="qw-login-logo"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>' +
    '<h3 id="qw-set-current-nick">账号设置</h3><p id="qw-set-current-email">修改昵称、密码或邮箱</p>' +
    '</div>' +
    '<div class="qw-login-tabs">' +
    '<button type="button" class="qw-login-tab qw-active" id="qw-set-tab-nick" data-set="nick">改昵称</button>' +
    '<button type="button" class="qw-login-tab" id="qw-set-tab-pwd" data-set="pwd">改密码</button>' +
    '<button type="button" class="qw-login-tab" id="qw-set-tab-email" data-set="email">改邮箱</button>' +
    '</div>' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-x" id="qw-settings-close-x" style="position:absolute;top:14px;right:16px;cursor:pointer;font-size:18px;line-height:1;color:var(--jp-muted);user-select:none;z-index:3;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease;">&times;</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-nick">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">一周最多改3次，次日0点后才能再改；刚用过的昵称5秒后就能改回</p>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><input type="text" id="qw-set-nick" placeholder="新昵称" maxlength="20" autocomplete="off"></div>' +
    '<button class="qw-submit" id="qw-set-nick-save" style="margin-top:6px">保存昵称</button>' +
    '</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-pwd" style="display:none">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">一周最多改3次，次日0点后才能再改</p>' +
    '<div class="qw-login-field" id="qw-pwd-old-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-pwd-old-pwd" placeholder="当前密码"></div>' +
    '<div class="qw-login-field" id="qw-pwd-code-field" style="display:none"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-pwd-code" placeholder="邮箱验证码" style="flex:1"><button type="button" class="qw-send-code" id="qw-set-pwd-sendcode">发码</button></div></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-new-pwd1" placeholder="新密码（至少4位）"></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-new-pwd2" placeholder="确认新密码"></div>' +
    '<button class="qw-submit" id="qw-set-pwd-save" style="margin-top:6px">保存密码</button>' +
    '<button type="button" id="qw-pwd-forgot" style="display:block;width:100%;margin-top:8px;border:none;background:none;color:var(--jp-accent);font-size:11px;cursor:pointer;text-decoration:underline;padding:4px 0;">忘记密码？通过邮箱验证码重置</button>' +
    '</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-email" style="display:none">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">一周最多改3次，次日0点后才能再改；需验证新旧两个邮箱</p>' +
    '<div class="qw-login-field" style="padding-left:0"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-email-oldcode" placeholder="原邮箱验证码" style="flex:1"><button type="button" class="qw-send-code" id="qw-set-email-sendold">发码</button></div></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><input type="email" id="qw-set-new-email" placeholder="新邮箱"></div>' +
    '<div class="qw-login-field" style="padding-left:0"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-email-newcode" placeholder="新邮箱验证码" style="flex:1"><button type="button" class="qw-send-code" id="qw-set-email-sendnew">发码</button></div></div>' +
    '<button class="qw-submit" id="qw-set-email-save" style="margin-top:6px">保存邮箱</button>' +
    '</div>' +
    '<p class="qw-login-msg" id="qw-set-msg"></p>' +
    '</div></div></div>' +
    '<div id="qw-login-backdrop" class="qw-login-backdrop">' +
    '<div class="qw-login-panel">' +
    '<div class="qw-login-head">' +
    '<div class="qw-login-logo"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg></div>' +
    '<h3 id="qw-login-title">登录发言</h3><p id="qw-login-sub">输入邮箱或昵称和密码登录</p>' +
    '</div>' +
    '<div class="qw-login-tabs">' +
    '<button type="button" class="qw-login-tab qw-active" id="qw-tab-login" data-mode="login">登 录</button>' +
    '<button type="button" class="qw-login-tab" id="qw-tab-register" data-mode="register">注 册</button>' +
    '</div>' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-x" id="qw-login-x" style="position:absolute;top:14px;right:16px;cursor:pointer;font-size:18px;line-height:1;color:var(--jp-muted);user-select:none;z-index:3;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease;">&times;</div>' +
    '<div class="qw-login-field" id="qw-nick-field" style="display:none">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>' +
    '<input type="text" id="qw-login-nick" placeholder="昵称（怎么称呼你）" maxlength="20">' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>' +
    '<input type="text" id="qw-login-email" placeholder="邮箱或昵称">' +
    '</div>' +
    '<div class="qw-login-code-row" id="qw-code-row">' +
    '<input type="text" id="qw-login-code" class="qw-c-input" placeholder="6位验证码" maxlength="6">' +
    '<button id="qw-send-code" type="button" class="qw-send-code">发送验证码</button>' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
    '<input type="password" id="qw-login-pwd" placeholder="密码">' +
    '</div>' +
    '<button id="qw-login-submit" class="qw-submit">登 录</button>' +
    '<p id="qw-login-toggle" class="qw-login-toggle"><span>没有账号？</span><b id="qw-toggle-link">点击注册</b></p>' +
    '<p id="qw-login-msg" class="qw-login-msg"></p>' +
    '</div>' +
    '</div></div>' +
    /* 自绘管理员面板 */
    '<div id="qw-admin-backdrop" class="qw-admin-backdrop">' +
    '<div class="qw-admin-panel" role="dialog" aria-modal="true" aria-labelledby="qw-admin-title">' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
    '<div><h2 id="qw-admin-title">聊天后台</h2><p>管理员 · 删除消息 / 拉黑邮箱</p></div>' +
    '<button type="button" class="qw-icon-btn" id="qw-admin-refresh" aria-label="刷新数据" title="刷新数据" style="margin-left:auto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>' +
    '<button class="qw-close" data-qw-admin-close aria-label="关闭" title="关闭"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<div class="qw-admin-body" id="qw-admin-body"></div>' +
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
  // 头像加载失败时显示昵称首字母
  function fixAvatars(){
    document.querySelectorAll('.qw-body #twikoo .tk-comment .tk-avatar').forEach(function(av){
      if(av.dataset.fixed) return;
      var nick = '';
      var item = av.closest('.tk-comment');
      if(item){
        var nickEl = item.querySelector('.tk-nick');
        if(nickEl) nick = nickEl.textContent.trim();
      }
      var img = av.querySelector('img');
      if(!img){
        // No img - show first letter
        av.textContent = nick ? nick[0].toUpperCase() : '?';
        av.dataset.fixed = '1';
      } else {
        // Set onerror fallback
        img.onerror = function(){
          if(av.contains(img)){
            av.textContent = nick ? nick[0].toUpperCase() : '?';
            img.remove();
          }
        };
        // If already broken
        if(img.complete && img.naturalWidth === 0){
          av.textContent = nick ? nick[0].toUpperCase() : '?';
          img.remove();
        }
      }
    });
  }
  // Twikoo 评论加载后执行
  var _origOnCommentLoaded = window.twikoo && window.twikoo.onCommentLoaded;
      twikoo.init({
        envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo',
        el: '#tcomment',
        path: 'chat',
        lang: 'zh-CN',
        requiredMeta: ['nick', 'mail'],
        onCommentLoaded: function () { scheduleMark(); fixAvatars(); }
        ,onCommentSubmit: function (e) { try { logAction('发言', '内容:' + String((e && e.comment) || '').slice(0, 50)); } catch (ex) {} }
      });
    } catch (e) { twikooInited = false; }
  }

  // ===== 移除左下角表情按钮（Twikoo OwO，用不到直接删掉 DOM） =====
  function removeOwO() {
    document.querySelectorAll('.qw-body #twikoo .tk-submit-action-icon.OwO, .qw-body #twikoo .OwO-logo, .qw-body #twikoo .tk-submit .OwO').forEach(function (el) {
      el.remove();
    });
  }
  // ===== 移除 M+（Markdown 按钮）和"预览"按钮（用不到直接删掉 DOM） =====
  function removeSubmitExtras() {
    document.querySelectorAll('.qw-body #twikoo .tk-submit-action-icon.__markdown, .qw-body #twikoo .tk-preview').forEach(function (el) {
      el.remove();
    });
  }
  // ===== 添加图片上传按钮 =====
  function addImgButton() {
    var submit = document.querySelector('.qw-body #twikoo .tk-submit');
    if (!submit || submit.querySelector('.qw-img-btn')) return;
    var sendBtn = submit.querySelector('.tk-send');
    if (!sendBtn) return;
    var btn = document.createElement('label');
    btn.className = 'qw-img-btn';
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><input type="file" accept="image/*">';
    var fileInput = btn.querySelector('input');
    fileInput.addEventListener('change', function() {
      var file = fileInput.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('图片不能超过5MB'); return; }
      var ta = submit.querySelector('textarea');
      var oldText = ta.value;
      var reader = new FileReader();
      reader.onload = function(e) {
        // 用 base64 直接插入图片（无后端图床依赖）
        var imgMd = '\n![图片](' + e.target.result + ')\n';
        ta.value = oldText + imgMd;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });
    submit.insertBefore(btn, sendBtn);
  }
  // ===== 把点赞/回复等操作按钮从头部行移到气泡下方横排 =====
  function moveActionBelow() {
    document.querySelectorAll('.qw-body #twikoo .tk-comment').forEach(function (c) {
      var main = c.querySelector(':scope > .tk-main');
      if (!main) return;
      var row = main.querySelector(':scope > .tk-row');
      var action = row ? row.querySelector(':scope > .tk-action') : null;
      var content = main.querySelector(':scope > .tk-content');
      if (action && content && action.parentNode === row) {
        main.insertBefore(action, content.nextSibling);
      }
    });
  }
  // ===== 把昵称移到气泡左上方（.tk-main 开头，头像右侧第一行） =====
  function moveNickTop() {
    document.querySelectorAll('.qw-body #twikoo .tk-comment').forEach(function (c) {
      var nick = c.querySelector('.tk-nick');
      var main = c.querySelector(':scope > .tk-main');
      if (!nick || !main) return;
      if (nick.parentNode === main) return; // 已移动
      main.insertBefore(nick, main.firstChild);
    });
  }
  // ===== 聊天气泡：识别"自己"的消息（对比 localStorage 昵称）→ 右侧 =====
  var wlEmailSet = {};
  function loadWhitelist() {
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event:'QW_ADMIN_CHECK_WHITELIST', email: (function(){try{return localStorage.getItem('qw_visitor_email')||'';}catch(e){return '';}})() })
    }).then(function(r){return r.json();}).then(function(r){
      if (r && r.code === 0 && r.data.whitelisted) {
        var v = getVisitor();
        if (v.email) wlEmailSet[v.email] = 1;
        addWlBadges();
      }
    }).catch(function(){});
  }
  function addWlBadges() {
    var list = document.querySelectorAll('.qw-body #twikoo .tk-comment');
    for (var i = 0; i < list.length; i++) {
      var cc = list[i];
      var nickEl = cc.querySelector('.tk-nick');
      if (!nickEl) continue;
      var cMail = '';
      try {
        var vue = cc.__vue__;
        if (vue && vue.comment) cMail = (vue.comment.mail || '').trim().toLowerCase();
      } catch(e) {}
      if (cMail && wlEmailSet[cMail] && !nickEl.querySelector('.qw-admin-badge')) {
        var badge = document.createElement('span');
        badge.className = 'qw-admin-badge';
        badge.textContent = '管理员';
        nickEl.appendChild(badge);
      }
    }
  }
  function renameEmpty() {
    var els = document.querySelectorAll('.qw-body #twikoo *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length === 0 && el.textContent.trim() === '没有评论') el.textContent = '暂无消息';
    }
  }
  function markSelf() {
    var info = {};
    try { info = JSON.parse(localStorage.getItem('twikoo') || '{}'); } catch (e) {}
    var myNick = (info.nick || '').trim();
    var myMail = (info.mail || '').trim().toLowerCase();
    try {
      var qn = localStorage.getItem('qw_visitor_nick') || '';
      var qe = (localStorage.getItem('qw_visitor_email') || '').trim().toLowerCase();
      if (qn) myNick = qn;
      if (qe) myMail = qe;
    } catch (e) {}
    var list = document.querySelectorAll('.qw-body #twikoo .tk-comment');
    for (var i = 0; i < list.length; i++) {
      var cc = list[i];
      var nickEl = cc.querySelector('.tk-nick');
      var nick = nickEl ? nickEl.textContent.trim() : '';
      var isSelf = false;
      try {
        var vue = cc.__vue__;
        if (vue && vue.comment) {
          var cMail = (vue.comment.mail || '').trim().toLowerCase();
          if (myMail && cMail === myMail) isSelf = true;
        }
      } catch (e) {}
      if (!isSelf && myNick && nick === myNick) isSelf = true;
      if (isSelf) cc.classList.add('tk-self');
      else cc.classList.remove('tk-self');
    }
  }
  // ===== QQ式引用回复：把嵌套子评论重组为"独立气泡 + 气泡内引用块" =====
  function restructureReplies() {
    var scope = document.querySelector('.qw-body #twikoo');
    if (!scope) return;
    var containers = scope.querySelectorAll('.tk-replies, .tk-children');
    for (var i = 0; i < containers.length; i++) {
      var replies = containers[i];
      var parentComment = replies.closest('.tk-comment');
      if (!parentComment) continue;
      var parentContentEl = parentComment.querySelector('.tk-content');
      var parentNickEl = parentComment.querySelector('.tk-nick');
      var parentText = parentContentEl ? parentContentEl.textContent.trim() : '';
      var parentNick = parentNickEl ? parentNickEl.textContent.trim() : '';
      var kids = replies.querySelectorAll(':scope > .tk-comment');
      for (var j = 0; j < kids.length; j++) {
        var reply = kids[j];
        if (reply.dataset.qwQuoted) continue;
        reply.dataset.qwQuoted = '1';
        // 移出嵌套列表 → 父评论后面的独立气泡
        parentComment.parentNode.insertBefore(reply, parentComment.nextSibling);
        // 气泡内容顶部插入引用块（被引用人的昵称 + 原文）
        var contentEl = reply.querySelector('.tk-content');
        if (contentEl && parentText) {
          var quote = document.createElement('div');
          quote.className = 'qw-quote';
          quote.textContent = (parentNick ? parentNick + '：' : '') + parentText;
          contentEl.insertBefore(quote, contentEl.firstChild);
          // 删除 Twikoo 自动加的"回复 @昵称 : "前缀（引用块已说明）
          var preSpans = contentEl.querySelectorAll(':scope > span');
          for (var k = 0; k < preSpans.length; k++) {
            if (preSpans[k].querySelector('.tk-ruser')) { preSpans[k].remove(); break; }
          }
        }
      }
      replies.style.display = 'none';
    }
  }
  // ===== 消息时间正序（早发言在上）+ 具体时间显示 =====
  function getMsgTime(c) {
    var t = c.querySelector('.tk-time time');
    if (t) {
      var ts = t.getAttribute('datetime') || t.getAttribute('title') || t.textContent;
      var v = Date.parse(ts);
      if (!isNaN(v)) return v;
    }
    return 0;
  }
  function sortComments() {
    var container = document.querySelector('.qw-body #twikoo .tk-comments-container');
    if (!container) return;
    var comments = Array.prototype.slice.call(container.querySelectorAll(':scope > .tk-comment'));
    comments.sort(function (a, b) { return getMsgTime(a) - getMsgTime(b); });
    for (var i = 0; i < comments.length; i++) container.appendChild(comments[i]);
  }
  // ===== 居中时间条（微信式）：相邻消息间隔超过 5 分钟时插入 =====
  function insertTimeSep() {
    var container = document.querySelector('.qw-body #twikoo .tk-comments-container');
    if (!container) return;
    container.querySelectorAll('.qw-time-sep').forEach(function (s) { s.remove(); });
    var comments = Array.prototype.slice.call(container.querySelectorAll(':scope > .tk-comment'));
    var lastTs = 0;
    for (var i = 0; i < comments.length; i++) {
      var ts = getMsgTime(comments[i]);
      if (lastTs === 0 || ts - lastTs > 5 * 60 * 1000) {
        var d = new Date(ts);
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var label = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
          pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
        var sep = document.createElement('div');
        sep.className = 'qw-time-sep';
        sep.textContent = label;
        container.insertBefore(sep, comments[i]);
      }
      lastTs = ts;
    }
  }
  function fixTimeText() {
    var now = new Date();
    document.querySelectorAll('.qw-body #twikoo .tk-time time').forEach(function (t) {
      var ts = t.getAttribute('datetime') || t.getAttribute('title');
      if (!ts) return;
      var d = new Date(ts);
      if (isNaN(d.getTime())) return;
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      var s = pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      if (d.getFullYear() !== now.getFullYear()) s = d.getFullYear() + '-' + s;
      t.textContent = s;
    });
  }
  var markTimer = null;
  function scheduleMark() {
    if (markTimer) clearTimeout(markTimer);
    markTimer = setTimeout(function () {
      // 每步隔离：点赞/踩后 Twikoo 局部重渲染可能产生不完整 DOM，任一步报错不得阻断高亮恢复
      var steps = [removeOwO, removeSubmitExtras, addImgButton, setSubmitPlaceholders, moveNickTop,
        moveActionBelow, restructureReplies, sortComments, insertTimeSep, renameEmpty, markSelf];
      try { refreshLoginUI(); } catch (eR) {}
      try { markLiked(); } catch (e0) {}
      steps.forEach(function (fn) { try { fn(); } catch (err) {} });
      try { markLiked(); } catch (e1) {}
    }, 250);
  }
  // ===== 输入区占位提示（昵称/邮箱/发言框） =====
  function setSubmitPlaceholders() {
    var submit = document.querySelector('.qw-body #twikoo .tk-submit');
    if (!submit) return;
    var inners = submit.querySelectorAll('.tk-meta-input .el-input__inner');
    if (inners.length >= 1) inners[0].placeholder = '昵称';
    if (inners.length >= 2) inners[1].placeholder = '邮箱';
    var ta = submit.querySelector('textarea');
    if (ta && (!ta.placeholder || ta.placeholder === '友善交流，文明发言…')) ta.placeholder = '友善交流，文明发言…';
  }
  // 监听评论列表变化（新增/加载）自动重新标记
  var tcommentEl = document.getElementById('tcomment');
  if (tcommentEl && window.MutationObserver) {
    var mo = new MutationObserver(function () { scheduleMark(); });
    mo.observe(tcommentEl, { childList: true, subtree: true });
  loadWhitelist();
  }

  function logAction(type, detail) {
    var v = getVisitor();
    try {
      fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ event:'QW_LOG_WRITE', type:type, email: v.email||'', nick: v.nick||'', detail: detail||'' })
      });
    } catch(e){}
  }
  function syncLikesByEmail() {
    var v = getVisitor();
    if (!v.email) return;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_LIKES_BY_EMAIL', email: v.email })
    }).then(function(r){return r.json();}).then(function(r){
      if (r && r.code === 0 && Array.isArray(r.data)) {
        r.data.forEach(function(id){ likedSet[id] = 1; });
        try { localStorage.setItem(LK, JSON.stringify(likedSet)); } catch(e){}
        markLiked();
      }
    }).catch(function(){});
  }
  var _refreshTimer = null;
  function refreshComments() {
    try {
      var vm = document.querySelector('#twikoo').__vue__;
      if (vm && vm.getCommentsList) vm.getCommentsList();
      else if (window.twikoo) window.twikoo.getCommentsList({ reset: true });
    } catch(e) {}
  }
  function openChat() {
    backdrop.classList.add('qw-open');
    logAction('访问聊天室', '打开聊天室');
    document.body.style.overflow = 'hidden';
    loadAssets(function () {
      initTwikoo();
      setTimeout(function(){
        refreshLoginUI();
        syncLikesByEmail();
        refreshComments();
      }, 200);
      setTimeout(function(){ refreshComments(); syncLikesByEmail(); }, 800);
    });
    refreshComments();
    syncLikesByEmail();
    if (_refreshTimer) clearInterval(_refreshTimer);
    _refreshTimer = setInterval(function(){
      if (backdrop.classList.contains('qw-open')) refreshComments();
    }, 3000);
  }

  function closeChat() {
    backdrop.classList.remove('qw-open');
    document.body.style.overflow = '';
    if (_refreshTimer) { clearInterval(_refreshTimer); _refreshTimer = null; }
  }

  launcher.addEventListener('click', openChat);
  document.addEventListener('DOMContentLoaded', refreshLoginUI);
  // 打开聊天室后刷新登录态
  var _origOpen = openChat;
  openChat = function () {
    _origOpen.apply(this, arguments);
    setTimeout(refreshLoginUI, 300);
  };
  var loginBarBtn = document.getElementById('qw-login-bar-btn');
  if (loginBarBtn) loginBarBtn.addEventListener('click', openLogin);
  var loginSubmit = document.getElementById('qw-login-submit');
  if (loginSubmit) loginSubmit.addEventListener('click', doLogin);
  // 发送邮箱验证码（60s 倒计时）
  var sendCodeBtn = document.getElementById('qw-send-code');
  if (sendCodeBtn) sendCodeBtn.addEventListener('click', function () {
    var email = (document.getElementById('qw-login-email') || {}).value ? document.getElementById('qw-login-email').value.trim() : '';
    var msgEl = document.getElementById('qw-login-msg');
    if (!email || email.indexOf('@') < 0) { if (msgEl) msgEl.textContent = '请先输入有效邮箱'; return; }
    var btn = this;
    btn.disabled = true; btn.textContent = '发送中…';
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_SEND_CODE', email: email })
    }).then(function(r){return r.json();}).then(function(r){
      btn.disabled = false;
      if (r.code !== 0) { btn.textContent = '发送验证码'; if (msgEl) msgEl.textContent = r.message || '发送失败'; return; }
      if (msgEl) msgEl.textContent = '验证码已发送，请查收邮箱';
      var sec = 60; btn.disabled = true; btn.textContent = sec + 's 后重发';
      var t = setInterval(function(){ sec--; if (sec <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = '发送验证码'; } else btn.textContent = sec + 's 后重发'; }, 1000);
    }).catch(function(){ btn.disabled = false; btn.textContent = '发送验证码'; if (msgEl) msgEl.textContent = '网络错误，请重试'; });
  });
  var loginCloseBtn = document.getElementById('qw-login-x');
  if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);
  var loginClose = document.querySelector('#qw-login-backdrop .qw-login-panel');
  if (loginClose) loginClose.addEventListener('click', function (e) { e.stopPropagation(); });
  document.getElementById('qw-login-backdrop').addEventListener('click', function(e){ if(e.target.id==='qw-login-backdrop') closeLogin(); });
  var tabLogin = document.getElementById('qw-tab-login');
  var tabReg = document.getElementById('qw-tab-register');
  if (tabLogin) tabLogin.addEventListener('click', function(){ setLoginMode('login'); });
  if (tabReg) tabReg.addEventListener('click', function(){ setLoginMode('register'); });
  var toggleEl2 = document.getElementById('qw-login-toggle');
  if (toggleEl2) toggleEl2.addEventListener('click', function(e){
    if (e.target && e.target.id === 'qw-toggle-link') setLoginMode(loginMode === 'login' ? 'register' : 'login');
  });
  closeBtn.addEventListener('click', closeChat);

  // 右下角自由缩放
  var resizeHandle = document.getElementById('qw-resize-handle');
  if (resizeHandle) {
    resizeHandle.addEventListener('mousedown', startResize);
    resizeHandle.addEventListener('touchstart', startResize, {passive:false});
  }
  function startResize(e) {
    e.preventDefault();
    e.stopPropagation();
    var pt = e.touches ? e.touches[0] : e;
    var startX = pt.clientX, startY = pt.clientY;
    var startW = panel.offsetWidth, startH = panel.offsetHeight;
    function onMove(ev) {
      var p = ev.touches ? ev.touches[0] : ev;
      var nw = Math.max(380, startW + (p.clientX - startX));
      var nh = Math.max(500, startH + (p.clientY - startY));
      var maxW = window.innerWidth - 20;
      var maxH = window.innerHeight - 20;
      panel.style.width = Math.min(nw, maxW) + 'px';
      panel.style.height = Math.min(nh, maxH) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
  }
  var chatRefreshBtn = document.getElementById('qw-chat-refresh');
  if (chatRefreshBtn) {
    chatRefreshBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      chatRefreshBtn.classList.add('qw-spinning');
      var body = document.querySelector('.qw-body');
      if (!body) return;
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;inset:0;background:var(--jp-surface);display:flex;align-items:center;justify-content:center;z-index:10;font-size:13px;color:var(--jp-muted);';
      overlay.innerHTML = '正在刷新聊天数据<span class="qw-dots"></span>';
      body.style.position = 'relative';
      body.appendChild(overlay);
      setTimeout(function() {
        if (window.twikoo) {
          window.twikoo.init({ envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', el: '#tcomment', path: 'chat', lang: 'zh-CN' });
        }
        setTimeout(function(){ overlay.remove(); chatRefreshBtn.classList.remove('qw-spinning'); }, 1500);
      }, 800);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(); });
  // 仅 X 按钮和 Esc 关闭，不响应遮罩点击

  // ===== 管理员面板（自绘：登录 → 评论管理 / 删除 / 拉黑邮箱） =====
  var adminBtn = document.getElementById('qw-admin-trigger');
  var adminBackdrop = document.getElementById('qw-admin-backdrop');
  var adminBody = document.getElementById('qw-admin-body');
  var adminToken = '';
  var adminLogFilter = 'all'; // 日志分类: all/account/interact/other
  var adminLogs = [];
  var TWIKOO_API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';

  function adminPost(data) {
    return fetch(TWIKOO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  var adminReadOnly = false;
  function openAdmin() {
    adminBackdrop.classList.add('qw-open');
    document.body.style.overflow = 'hidden';
    adminToken = '';
    adminReadOnly = false;
    try { adminToken = localStorage.getItem('qw_admin_token') || ''; } catch (e) {}
    if (adminToken) {
      adminBtn.classList.add('qw-admin-on');
      renderManageView();
    } else {
      // Check if current user is whitelisted
      var v = getVisitor();
      if (v.email) {
        adminBody.innerHTML = '<div class="qw-admin-loading">检查权限…</div>';
        adminBackdrop.classList.add('qw-open');
        fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ event:'QW_ADMIN_CHECK_WHITELIST', email: v.email })
        }).then(function(r){return r.json();}).then(function(r){
          if (r && r.code === 0 && r.data.whitelisted) {
            adminReadOnly = true;
            adminBtn.classList.add('qw-admin-on');
            renderManageView();
          } else {
            adminBtn.classList.remove('qw-admin-on');
            renderLoginView();
          }
        }).catch(function(){ renderLoginView(); });
      } else {
        adminBtn.classList.remove('qw-admin-on');
        renderLoginView();
      }
    }
  }
  function closeAdmin() {
    adminBackdrop.classList.remove('qw-open');
    if (!backdrop.classList.contains('qw-open')) document.body.style.overflow = '';
  }
  adminBackdrop.addEventListener('click', function (e) { if (e.target === adminBackdrop) e.stopPropagation(); });
  adminBackdrop.querySelector('[data-qw-admin-close]').addEventListener('click', closeAdmin);
  var adminRefreshBtn = document.getElementById('qw-admin-refresh');
  if (adminRefreshBtn) {
    adminRefreshBtn.addEventListener('click', function(e) {
      e.preventDefault();
      adminRefreshBtn.classList.add('qw-spinning');
      if (adminToken) renderManageView();
      setTimeout(function(){ adminRefreshBtn.classList.remove('qw-spinning'); }, 1500);
    });
  }

  function renderLoginView() {
    adminBody.innerHTML =
      '<div class="qw-admin-form">' +
      '<div class="qw-lock"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
      '<h3>管理员登录</h3>' +
      '<p class="qw-sub">登录后可删除访客评论、查看邮箱并拉黑</p>' +
      '<input id="qw-admin-pwd" type="password" placeholder="请输入管理密码" autocomplete="off">' +
      '<button class="qw-login" id="qw-admin-login-btn">登 录</button>' +
      '<div class="qw-admin-err" id="qw-admin-err"></div>' +
      '</div>';
    var input = document.getElementById('qw-admin-pwd');
    var btn = document.getElementById('qw-admin-login-btn');
    input.focus();
    var doLogin = function () {
      var pwd = input.value.trim();
      if (!pwd) { document.getElementById('qw-admin-err').textContent = '请输入管理密码'; return; }
      btn.disabled = true; btn.textContent = '登录中…';
      adminPost({ event: 'LOGIN', password: pwd }).then(function (res) {
        if (res && res.code === 0) {
          try { localStorage.setItem('qw_admin_token', pwd); } catch (e) {}
          adminToken = pwd;
          adminBtn.classList.add('qw-admin-on');
          renderManageView();
        } else {
          document.getElementById('qw-admin-err').textContent = (res && res.message) || '登录失败';
          btn.disabled = false; btn.textContent = '登 录';
        }
      }).catch(function () {
        document.getElementById('qw-admin-err').textContent = '网络异常，请重试';
        btn.disabled = false; btn.textContent = '登 录';
      });
    };
    btn.addEventListener('click', doLogin);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
  }

  function fmtTime(ts) {
    if (!ts) return '';
    var d = new Date(Number(ts));
    if (isNaN(d.getTime())) return '';
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var s = pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (d.getFullYear() !== new Date().getFullYear()) s = d.getFullYear() + '-' + s;
    return s;
  }

  function renderManageView() {
    adminBody.innerHTML = '<div class="qw-admin-loading">加载聊天数据…</div>';
    var blocks = [], wlist = [], logs = [];
    var likeMap = {};
    adminPost({ event: 'QW_LIKE_LIST', accessToken: adminToken }).then(function (lr) {
      if (lr && lr.code === 0) {
        (lr.data || []).forEach(function (x) { likeMap[x.commentId] = x.ips || []; });
      }
      return adminPost({ event: 'QW_BLOCK_LIST', accessToken: adminToken });
    }).then(function (r) {
      if (r && r.code === 0) blocks = r.data || [];
      return adminPost({ event: 'QW_ADMIN_WHITELIST', accessToken: adminToken });
    }).then(function (rw) {
      if (rw && rw.code === 0) wlist = rw.data || [];
      return adminPost({ event: 'QW_LOG_LIST', accessToken: adminToken, per: 100 });
    }).then(function (rl) {
      if (rl && rl.code === 0) logs = rl.data || [];
      return adminPost({ event: 'COMMENT_GET_FOR_ADMIN', accessToken: adminToken, per: 50, page: 1 });
    }).then(function (r1) {
      if (!r1 || r1.code !== 0) {
        adminBody.innerHTML = '<div class="qw-admin-loading">' + ((r1 && r1.message) || '登录已失效，请重新登录') + '</div>';
        if (r1 && r1.code !== 0) { try { localStorage.removeItem('qw_admin_token'); } catch (e) {} adminBtn.classList.remove('qw-admin-on'); }
        return;
      }
      var all = (r1.data || []).slice();
      var count = r1.count || all.length;
      var pages = Math.ceil(count / 50);
      var seq = Promise.resolve();
      for (var p = 2; p <= pages; p++) {
        seq = seq.then(function (pg) {
          return adminPost({ event: 'COMMENT_GET_FOR_ADMIN', accessToken: adminToken, per: 50, page: pg }).then(function (r) {
            if (r && r.code === 0) all = all.concat(r.data || []);
          });
        }.bind(null, p));
      }
      seq.then(function () { renderManageList(all, blocks, wlist, likeMap, logs); });
    }).catch(function (e) {
      console.error('admin load error:', e);
      adminBody.innerHTML = '<div class="qw-admin-loading">网络异常，加载失败<br><small style="opacity:.6">' + (e && e.message ? e.message : '') + '</small></div>';
    });
  }

  // 点赞人信息：人数以 Twikoo ups 为准，点赞人 IP 来自后端旁路记录（明文）
  function likeInfoHtml(c, likeMap) {
    var ups = c.ups || c.likes || [];
    if (!ups.length) return '';
    var ips = (likeMap && likeMap[c._id]) || [];
    return '<div class="qw-like-info">👍 ' + ups.length + ' 人' +
      (ips.length ? ' · ' + escHtml(ips.join('、')) : '') + '</div>';
  }

  function renderManageList(comments, blocks, wlist, likeMap, logs) {
    adminLogs = logs || [];
    var html = '';
    html += '<div class="qw-admin-stats">' +
      '<div><b>' + (comments.length || 0) + '</b><span>全部消息</span></div>' +
      '<div><b>' + (blocks.length || 0) + '</b><span>黑名单</span></div>' +
      '<div><b>' + (wlist.length || 0) + '</b><span>白名单</span></div>' +
      '</div>';
    html += '<div class="qw-admin-list">';
    if (!comments.length) {
      html += '<div class="qw-admin-empty">暂无消息</div>';
    } else {
      for (var i = 0; i < comments.length; i++) {
        var c = comments[i];
        html += '<div class="qw-admin-item" data-id="' + c._id + '">' +
          '<div class="qw-hd"><span class="qw-nick">' + escHtml(c.nick || '匿名') + '</span>' +
          (c.mail ? '<span class="qw-mail">' + escHtml(c.mail) + '</span>' : '') +
          (c.ip ? '<span class="qw-ip">' + escHtml(c.ip) + '</span>' : '') +
          '<span class="qw-tm">' + fmtTime(c.created) + '</span></div>' +
          '<div class="qw-cmt">' + escHtml(stripHtml(c.comment)) + '</div>' +
          likeInfoHtml(c, likeMap) +
          (adminReadOnly ? '' : '<div class="qw-ops">' +
          '<button class="qw-del" data-act="del" data-id="' + c._id + '">删除</button>' +
          (c.mail ? '<button class="qw-blk" data-act="blk" data-mail="' + escAttr(c.mail) + '">拉黑</button>' : '') +
          '</div>') +
          '</div>';
      }
    }
    html += '</div>';
    if (!adminReadOnly) {
      html += '<div class="qw-mgmt-section"><h4>黑名单（拉黑后无法发言）</h4>';
      if (!blocks.length) {
        html += '<div class="qw-admin-empty" style="padding:10px 0">暂无黑名单</div>';
      } else {
        for (var b = 0; b < blocks.length; b++) {
          var bk = typeof blocks[b] === 'string' ? { mail: blocks[b], ip: '' } : (blocks[b] || {});
          var bkLabel = bk.mail + (bk.ip ? '（IP ' + bk.ip + '）' : '');
          html += '<div class="qw-mgmt-item"><span>' + escHtml(bkLabel) + '</span><button data-act="unblk" data-mail="' + escAttr(bk.mail) + '">解除</button></div>';
        }
      }
      html += '<div class="qw-mgmt-input-row"><input type="text" id="qw-blk-input" placeholder="输入邮箱或昵称进行拉黑"><button class="qw-add-blk" data-act="add-blk">拉黑</button></div></div>';
      html += '<div class="qw-mgmt-section"><h4>白名单（显示管理员头衔）</h4>';
      if (!wlist.length) {
        html += '<div class="qw-admin-empty" style="padding:10px 0">暂无白名单</div>';
      } else {
        for (var w = 0; w < wlist.length; w++) {
          var wl = typeof wlist[w] === 'string' ? { email: wlist[w] } : (wlist[w] || {});
          html += '<div class="qw-mgmt-item"><span>' + escHtml(wl.email || '') + '</span><button data-act="unwl" data-email="' + escAttr(wl.email || '') + '">移除</button></div>';
        }
      }
      html += '<div class="qw-mgmt-input-row"><input type="text" id="qw-wl-input" placeholder="输入邮箱或昵称加入白名单"><button class="qw-add-wl" data-act="add-wl">添加</button></div></div>';
      html += '<div class="qw-mgmt-section" id="qw-log-section">' + buildLogHtml(logs) + '</div>';
      html += '<button class="qw-admin-logout" data-act="logout">退出登录</button>';
    } else {
      html += '<div style="text-align:center;padding:16px 0 4px;font-size:11px;color:var(--jp-muted);">只读模式 · 可浏览，操作需验证密码</div>';
      html += '<button class="qw-admin-logout" data-act="verify-pwd" style="color:var(--jp-accent);text-decoration:none;border:1px solid var(--jp-line);border-radius:8px;">输入管理密码进行操作</button>';
    }
    adminBody.innerHTML = html;
    enrichIps();

    adminBody.querySelectorAll('.qw-admin-item .qw-ops button, .qw-mgmt-item button, .qw-admin-logout, .qw-mgmt-input-row button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-act');
        if (act === 'del') {
          var id = btn.getAttribute('data-id');
          if (confirm('确定删除这条评论吗？')) {
            adminPost({ event: 'COMMENT_DELETE_FOR_ADMIN', accessToken: adminToken, id: id }).then(function (r) {
              if (r && r.code === 0) renderManageView();
              else alert((r && r.message) || '删除失败');
            });
          }
        } else if (act === 'blk') {
          var mail = btn.getAttribute('data-mail');
          if (confirm('确定拉黑 ' + mail + ' 吗？')) {
            adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: mail }).then(function (r) {
              if (r && r.code === 0) renderManageView();
              else alert((r && r.message) || '拉黑失败');
            });
          }
        } else if (act === 'unblk') {
          var umail = btn.getAttribute('data-mail');
          adminPost({ event: 'QW_BLOCK_DELETE', accessToken: adminToken, mail: umail }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '操作失败');
          });
        } else if (act === 'add-blk') {
          var blkVal = ((document.getElementById('qw-blk-input') || {}).value || '').trim();
          if (!blkVal) { alert('请输入邮箱或昵称'); return; }
          adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: blkVal }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '操作失败');
          });
        } else if (act === 'add-wl') {
          var wlVal = ((document.getElementById('qw-wl-input') || {}).value || '').trim();
          if (!wlVal) { alert('请输入邮箱或昵称'); return; }
          adminPost({ event: 'QW_ADMIN_WHITELIST_ADD', accessToken: adminToken, email: wlVal }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '操作失败');
          });
        } else if (act === 'unwl') {
          var uwl = btn.getAttribute('data-email');
          adminPost({ event: 'QW_ADMIN_WHITELIST_DELETE', accessToken: adminToken, email: uwl }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '操作失败');
          });
        } else if (act === 'logout') {
          if (act === 'verify-pwd') {
            adminReadOnly = false;
            renderLoginView();
            return;
          }
          try { localStorage.removeItem('qw_admin_token'); } catch (e) {}
          adminToken = '';
          adminBtn.classList.remove('qw-admin-on');
          renderLoginView();
        }
      });
    });
    bindLogToggle();
  }

  // 把浏览器 UA 翻译成人话
  function parseUa(ua) {
    if (!ua) return '未知设备';
    var s = ua;
    var isMobile = /Mobile|Android|iPhone/i.test(s);
    var isPad = /iPad|Tablet/i.test(s);
    var dev = isPad ? '平板' : (isMobile ? '手机' : '电脑');
    var os = '未知系统';
    if (/Windows NT 10/.test(s)) os = 'Windows';
    else if (/iPhone|iPad/.test(s)) os = 'iOS';
    else if (/Mac OS X/.test(s)) os = 'Mac';
    else if (/Android/.test(s)) os = 'Android';
    else if (/Linux/.test(s)) os = 'Linux';
    var br = '浏览器';
    if (/Edg\//.test(s)) br = 'Edge';
    else if (/Chrome\//.test(s) && !/OPR/.test(s)) br = 'Chrome';
    else if (/Firefox\//.test(s)) br = 'Firefox';
    else if (/Safari\//.test(s)) br = 'Safari';
    else if (/OPR\//.test(s)) br = 'Opera';
    return dev + ' · ' + os + ' · ' + br;
  }

  // 构建操作日志区块 HTML（含筛选按钮），配合局部刷新
  function buildLogHtml(logs) {
    var cats = [
      { key:'all', label:'全部' },
      { key:'account', label:'账号' },
      { key:'interact', label:'互动' },
      { key:'other', label:'其他' }
    ];
    var catMap = {
      '注册':'account','登录':'account','退出':'account','改昵称':'account','改密码':'account','改邮箱':'account',
      '发言':'interact','点赞':'interact','点踩':'interact',
      '访问聊天室':'other'
    };
    var h = '<h4 style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">操作日志（最近100条）';
    h += '<div style="display:flex;gap:4px">';
    for (var ci=0;ci<cats.length;ci++) {
      var c = cats[ci];
      h += '<button data-act="set-logcat" data-cat="'+c.key+'" style="font-size:10px;padding:3px 10px;border:1px solid var(--jp-line);border-radius:6px;background:'+(adminLogFilter===c.key?'var(--jp-accent)':'transparent')+';color:'+(adminLogFilter===c.key?'#fff':'var(--jp-accent)')+';cursor:pointer">'+c.label+'</button>';
    }
    h += '</div></h4>';
    if (!logs || !logs.length) {
      h += '<div class="qw-admin-empty" style="padding:10px 0">暂无日志</div>';
    } else {
      var logList = adminLogFilter === 'all' ? logs : logs.filter(function(x) { return catMap[x.type] === adminLogFilter; });
      if (!logList.length) h += '<div class="qw-admin-empty" style="padding:10px 0">暂无此类日志</div>';
      for (var li = 0; li < logList.length; li++) {
        var lg = logList[li];
        var tstr = new Date(lg.time).toLocaleString('zh-CN');
        h += '<div class="qw-log-item" data-log-id="' + escAttr(lg._id || '') + '">' + escHtml(tstr) + ' · ' + escHtml(lg.type) + ' · ' + escHtml(lg.nick || lg.email || '匿名') + ' · ' + escHtml(lg.detail || '') + '<span class="qw-log-sub">IP ' + escHtml(lg.ip || '未知') + ' · ' + parseUa(lg.ua) + '</span><button class="qw-log-del" data-act="del-log" data-id="' + escAttr(lg._id || '') + '" title="删除这条日志" style="float:right;margin-left:8px;border:none;background:none;color:var(--jp-muted);font-size:11px;cursor:pointer;">✕</button></div>';
      }
    }
    return h + '</div>';
  }
  // IP 归属地查询（ipwho.is，免费跨域，结果缓存本地）
  var ipLocCache = {};
  try {
    var rawCache = JSON.parse(localStorage.getItem('qw_ip_loc') || '{}');
    if (rawCache._v === 2) ipLocCache = rawCache.data || {};
  } catch (e) {}
  var provinceMap = {
    'beijing': '北京', 'shanghai': '上海', 'tianjin': '天津', 'chongqing': '重庆',
    'guangdong': '广东', 'jiangsu': '江苏', 'zhejiang': '浙江', 'shandong': '山东',
    'henan': '河南', 'hebei': '河北', 'hunan': '湖南', 'hubei': '湖北', 'sichuan': '四川',
    'fujian': '福建', 'anhui': '安徽', 'jiangxi': '江西', 'liaoning': '辽宁',
    'shanxi': '山西', 'shaanxi': '陕西', 'heilongjiang': '黑龙江', 'jilin': '吉林',
    'guangxi': '广西', 'yunnan': '云南', 'guizhou': '贵州', 'gansu': '甘肃',
    'inner mongolia': '内蒙古', 'xinjiang': '新疆', 'xizang': '西藏', 'qinghai': '青海',
    'ningxia': '宁夏', 'hainan': '海南', 'hong kong': '香港', 'macau': '澳门', 'taiwan': '台湾'
  };
  var cityMap = {
    'beijing': '北京', 'shanghai': '上海', 'tianjin': '天津', 'chongqing': '重庆',
    'guangzhou': '广州', 'shenzhen': '深圳', 'dongguan': '东莞', 'foshan': '佛山',
    'zhuhai': '珠海', 'zhongshan': '中山', 'huizhou': '惠州', 'jiangmen': '江门',
    'chengdu': '成都', 'hangzhou': '杭州', 'ningbo': '宁波', 'wenzhou': '温州',
    'jiaxing': '嘉兴', 'shaoxing': '绍兴', 'suzhou': '苏州', 'nanjing': '南京',
    'wuxi': '无锡', 'changzhou': '常州', 'nantong': '南通', 'xuzhou': '徐州',
    'jinan': '济南', 'qingdao': '青岛', 'yantai': '烟台', 'weifang': '潍坊',
    'zhengzhou': '郑州', 'luoyang': '洛阳', 'wuhan': '武汉', 'xiangyang': '襄阳',
    'changsha': '长沙', 'zhuzhou': '株洲', 'xiangtan': '湘潭', 'hengyang': '衡阳',
    'yueyang': '岳阳', 'yiyang': '益阳', 'changde': '常德', 'zhangjiajie': '张家界',
    'nanchang': '南昌', 'jiujiang': '九江', 'hefei': '合肥', 'wuhu': '芜湖',
    'fuzhou': '福州', 'xiamen': '厦门', 'quanzhou': '泉州', 'putian': '莆田',
    'shenyang': '沈阳', 'dalian': '大连', 'changchun': '长春', 'harbin': '哈尔滨',
    'shijiazhuang': '石家庄', 'taiyuan': '太原', 'xian': '西安', 'xianyang': '咸阳',
    'kunming': '昆明', 'guiyang': '贵阳', 'nanning': '南宁', 'haikou': '海口',
    'lanzhou': '兰州', 'xining': '西宁', 'urumqi': '乌鲁木齐', 'lhasa': '拉萨',
    'hohhot': '呼和浩特', 'yinchuan': '银川'
  };
  function cnCity(city) {
    if (!city) return '';
    var key = city.toLowerCase().replace(/\s+/g, '');
    return cityMap[key] || city;
  }
  function getIpLocation(ip, cb) {
    if (!ip || !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return cb('');
    if (ipLocCache[ip]) return cb(ipLocCache[ip]);
    fetch('https://ipwho.is/' + ip).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || d.success === false) return cb('');
      var prov = (d.region || '').toLowerCase().replace(/\s*(sheng|province|auto autonomous|region)\s*/g, '').trim();
      var provCn = provinceMap[prov] || d.region || '';
      var cityCn = cnCity(d.city || '');
      var org = (d.connection && d.connection.org) || (d.connection && d.connection.isp) || '';
      if (/CHINANET|China Telecom/i.test(org)) org = '电信';
      else if (/CHINA UNICOM|China Unicom/i.test(org)) org = '联通';
      else if (/CHINA MOBILE|China Mobile/i.test(org)) org = '移动';
      else if (/Tencent|Alibaba|Huawei|Huaweicloud/i.test(org)) org = '';
      else org = org ? org.slice(0, 20) : '';
      var loc = (provCn ? provCn + ' ' : '') + cityCn + (org ? ' ' + org : '');
      loc = loc.trim();
      if (loc) {
        ipLocCache[ip] = loc;
        try { localStorage.setItem('qw_ip_loc', JSON.stringify({ _v: 2, data: ipLocCache })); } catch (e) {}
      }
      cb(loc);
    }).catch(function () { cb(''); });
  }
  // 给管理面板里所有 IP 行补上归属地
  function enrichIps() {
    var rows = document.querySelectorAll('#qw-admin-body .qw-log-item, #qw-admin-body .qw-admin-item');
    rows.forEach(function (it) {
      if (it.getAttribute('data-ip-done')) return;
      var sub = it.querySelector('.qw-log-sub') || it.querySelector('.qw-ip');
      var text = it.innerText || '';
      var m = text.match(/IP\s*([0-9.]+)/);
      if (!m) return;
      it.setAttribute('data-ip-done', '1');
      var ip = m[1];
      getIpLocation(ip, function (loc) {
        if (!loc) return;
        var target = sub || it;
        if (target && target.textContent.indexOf(loc) < 0) {
          var dot = document.createTextNode(' · ' + loc);
          target.appendChild(dot);
        }
      });
    });
  }
  // 局部切换日志分类：只重建日志区块，不重载整个聊天后台
  function handleSetLogCat(cat) {
    adminLogFilter = cat;
    var sec = document.getElementById('qw-log-section');
    if (sec) {
      sec.innerHTML = buildLogHtml(adminLogs);
      bindLogToggle();
      enrichIps();
    }
  }
  function bindLogToggle() {
    var btns = document.querySelectorAll('#qw-log-section [data-act="set-logcat"]');
    btns.forEach(function(b){
      b.addEventListener('click', function(){ handleSetLogCat(b.getAttribute('data-cat') || 'all'); });
    });
    document.querySelectorAll('#qw-log-section [data-act="del-log"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        if (!id) return;
        adminPost({ event: 'QW_LOG_DELETE', accessToken: adminToken, id: id }).then(function (r) {
          if (r && r.code === 0) {
            var row = btn.closest('.qw-log-item');
            if (row) row.parentNode.removeChild(row);
          } else {
            alert((r && r.message) || '删除失败');
          }
        });
      });
    });
  }

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function stripHtml(html) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    return d.textContent || '';
  }
  function escAttr(s) {
    return escHtml(s).replace(/'/g, '&#39;');
  }

  adminBtn.addEventListener('click', function () {
    openAdmin();
  });
  document.getElementById('qw-logout-btn').addEventListener('click', function () {
    logout();
  });
  // ===== 账号设置弹窗 =====
  var settingsModal = document.getElementById('qw-settings-modal');
  var setMsg = document.getElementById('qw-set-msg');
  function showSetMsg(text, ok) {
    setMsg.textContent = text;
    setMsg.className = 'qw-login-msg' + (ok ? ' qw-ok' : '');
  }
  function setTab(tabName) {
    var tabs = document.querySelectorAll('#qw-settings-modal .qw-login-tab');
    var panes = document.querySelectorAll('#qw-settings-modal .qw-set-pane');
    tabs.forEach(function(t){ t.classList.toggle('qw-active', t.getAttribute('data-set') === tabName); });
    panes.forEach(function(p){ p.style.display = p.id === 'qw-set-pane-' + tabName ? 'block' : 'none'; });
    if (tabName === 'pwd') {
      pwdMode = 'old';
      var oldF = document.getElementById('qw-pwd-old-field');
      var codeF = document.getElementById('qw-pwd-code-field');
      var fBtn = document.getElementById('qw-pwd-forgot');
      if (oldF) oldF.style.display = 'block';
      if (codeF) codeF.style.display = 'none';
      if (fBtn) fBtn.textContent = '忘记密码？通过邮箱验证码重置';
    }
  }
  document.querySelectorAll('#qw-settings-modal .qw-login-tab').forEach(function(tab){
    tab.addEventListener('click', function(){ setTab(tab.getAttribute('data-set')); });
  });
  function openSettings() {
    var v = getVisitor();
    document.getElementById('qw-set-current-nick').textContent = v.nick || '未设置昵称';
    document.getElementById('qw-set-current-email').textContent = v.email || '';
    document.getElementById('qw-set-nick').value = '';
    document.getElementById('qw-set-new-pwd1').value = '';
    document.getElementById('qw-set-new-pwd2').value = '';
    document.getElementById('qw-set-pwd-old-pwd').value = '';
    document.getElementById('qw-set-pwd-code').value = '';
    document.getElementById('qw-set-new-email').value = '';
    document.getElementById('qw-set-email-oldcode').value = '';
    document.getElementById('qw-set-email-newcode').value = '';
    setMsg.textContent = '';
    // 头部显示当前登录账号
    var headSub = document.querySelector('#qw-settings-modal .qw-login-head p');
    if (headSub) headSub.textContent = (v.nick || '未登录') + ' · ' + (v.email || '');
    setTab('nick');
    settingsModal.classList.add('qw-open');
  }
  function closeSettings() { settingsModal.classList.remove('qw-open'); }
  document.getElementById('qw-settings-btn').addEventListener('click', openSettings);
  settingsModal.addEventListener('click', function(e) { if (e.target === settingsModal) closeSettings(); });
  document.getElementById('qw-settings-close-x').addEventListener('click', closeSettings);
  function setBtnLoading(btn, text) { btn.disabled = true; btn.textContent = text; }
  function setBtnRestore(btn, text) { btn.disabled = false; btn.textContent = text; }
  // 改昵称：不需要密码
  document.getElementById('qw-set-nick-save').addEventListener('click', function() {
    var v = getVisitor();
    var nick = document.getElementById('qw-set-nick').value.trim();
    if (!nick) { showSetMsg('请输入新昵称', false); return; }
    var btn = this; setBtnLoading(btn, '保存中…');
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event:'QW_USER_UPDATE', email: v.email, newNick: nick })
    }).then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '保存昵称');
      if (r.code === 0) {
        localStorage.setItem(QW_NICK, nick);
        showSetMsg('昵称已修改', true);
        logAction('改昵称', '昵称改为: ' + nick);
        setTimeout(function(){ closeSettings(); refreshLoginUI(); }, 800);
      } else showSetMsg(r.message || '修改失败', false);
    }).catch(function(){ setBtnRestore(btn, '保存昵称'); showSetMsg('网络错误', false); });
  });
  // 改密码：旧密码 / 邮箱验证码 切换（通过"忘记密码"链接）
  var pwdMode = 'old';
  var forgotBtn = document.getElementById('qw-pwd-forgot');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', function() {
      if (pwdMode === 'old') {
        pwdMode = 'code';
        document.getElementById('qw-pwd-old-field').style.display = 'none';
        document.getElementById('qw-pwd-code-field').style.display = 'block';
        forgotBtn.textContent = '想起来了？用当前密码修改';
      } else {
        pwdMode = 'old';
        document.getElementById('qw-pwd-old-field').style.display = 'block';
        document.getElementById('qw-pwd-code-field').style.display = 'none';
        forgotBtn.textContent = '忘记密码？通过邮箱验证码重置';
      }
    });
  }
  // 改密码：发 reset 验证码
  function bindSendCode(btnId, emailVal, type, msgEl) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', function() {
      var email = typeof emailVal === 'function' ? emailVal() : emailVal;
      if (!email || email.indexOf('@') < 0) { showSetMsg('请先填邮箱', false); return; }
      btn.disabled = true; var s = 60;
      btn.textContent = s + 's';
      var timer = setInterval(function(){
        s--; if (s <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = '发码'; }
        else btn.textContent = s + 's';
      }, 1000);
      fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ event:'QW_SEND_CODE', email: email, type: type })
      }).then(function(r){return r.json();}).then(function(r){
        showSetMsg(r.code === 0 ? '验证码已发送' : (r.message || '发送失败'), r.code === 0);
      }).catch(function(){ showSetMsg('网络错误', false); });
    });
  }
  var v0 = getVisitor();
  bindSendCode('qw-set-pwd-sendcode', function(){ return getVisitor().email; }, 'reset');
  bindSendCode('qw-set-email-sendold', function(){ return getVisitor().email; }, 'changeemail');
  bindSendCode('qw-set-email-sendnew', function(){ return document.getElementById('qw-set-new-email').value.trim(); }, 'register');
  document.getElementById('qw-set-pwd-save').addEventListener('click', function() {
    var v = getVisitor();
    var p1 = document.getElementById('qw-set-new-pwd1').value;
    var p2 = document.getElementById('qw-set-new-pwd2').value;
    if (!p1 || p1.length < 4) { showSetMsg('新密码至少4位', false); return; }
    if (p1 !== p2) { showSetMsg('两次密码不一致', false); return; }
    var body = { event:'QW_USER_UPDATE', email: v.email, newPassword: p1 };
    if (pwdMode === 'old') {
      var oldP = document.getElementById('qw-set-pwd-old-pwd').value;
      if (!oldP) { showSetMsg('请输入当前密码', false); return; }
      body.oldPassword = oldP;
    } else {
      var code = document.getElementById('qw-set-pwd-code').value.trim();
      if (!code) { showSetMsg('请输入邮箱验证码', false); return; }
      body.code = code;
    }
    var btn = this; setBtnLoading(btn, '保存中…');
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    .then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '保存密码');
      if (r.code === 0) {
        showSetMsg('密码已修改', true);
        logAction('改密码', '密码已修改');
        setTimeout(closeSettings, 800);
      } else showSetMsg(r.message || '修改失败', false);
    }).catch(function(){ setBtnRestore(btn, '保存密码'); showSetMsg('网络错误', false); });
  });
  // 改邮箱：旧邮箱验证码 + 新邮箱验证码
  document.getElementById('qw-set-email-save').addEventListener('click', function() {
    var v = getVisitor();
    var ne = document.getElementById('qw-set-new-email').value.trim();
    var oc = document.getElementById('qw-set-email-oldcode').value.trim();
    var nc = document.getElementById('qw-set-email-newcode').value.trim();
    if (!ne || ne.indexOf('@') < 0) { showSetMsg('请输入有效新邮箱', false); return; }
    if (!oc || !nc) { showSetMsg('请输入两个邮箱的验证码', false); return; }
    var btn = this; setBtnLoading(btn, '保存中…');
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event:'QW_CHANGE_EMAIL', email: v.email, newEmail: ne, oldCode: oc, newCode: nc })
    }).then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '保存邮箱');
      if (r.code === 0) {
        localStorage.setItem(QW_EMAIL, ne);
        showSetMsg('邮箱已修改', true);
        logAction('改邮箱', '邮箱改为: ' + ne);
        setTimeout(function(){ closeSettings(); refreshLoginUI(); }, 800);
      } else showSetMsg(r.message || '修改失败', false);
    }).catch(function(){ setBtnRestore(btn, '保存邮箱'); showSetMsg('网络错误', false); });
  });
  // 管理员面板只能点 X 关闭（不响应 Esc 和遮罩点击）

  // 赞/踩操作：赞与踩互斥自动切换（已赞点踩=取消赞变踩，反之亦然）；再点同一个=取消；持久高亮
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.qw-body #twikoo .tk-comment .tk-action-link') : null;
    if (!btn) return;
    var comment = btn.closest('.tk-comment');
    var id = comment && comment.id ? comment.id : '';
    if (!id) return;
    var links = comment.querySelectorAll('.tk-action-link');
    var likeBtn = links[0];
    var dislikeBtn = links[1];
    var isLike = links.length && btn === likeBtn;
    var isDislike = links.length > 1 && btn === dislikeBtn;
    var isReply = links.length > 2 && btn === links[2];
    if ((isLike || isDislike) && !isLoggedIn()) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      openLogin(); return;
    }
    if (isReply) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      var nickEl = comment.querySelector('.tk-nick');
      var nick = nickEl ? nickEl.textContent.trim() : '';
      var contentEl = comment.querySelector('.tk-content, .tk-row-content');
      var content = contentEl ? contentEl.textContent.trim().slice(0, 60) : '';
      // 手动设置 Twikoo 内部 parentComment
      try {
        var vm = document.querySelector('#twikoo').__vue__;
        if (vm) { vm.parentComment = comment; }
      } catch (eSet) {}
      showReplyBar(nick, content);
      return;
    }
    if (!isLike && !isDislike) return; // 赞/踩之外的其他按钮不处理
    function block(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    function saveSets() {
      try { localStorage.setItem(LK, JSON.stringify(likedSet)); } catch (e2) {}
      try { localStorage.setItem(DK, JSON.stringify(dislikedSet)); } catch (e2) {}
    }
    // 互斥：已赞时点踩 = 取消赞变踩；已踩时点赞 = 取消踩变赞；再点同一个 = 取消
    if (isLike && dislikedSet[id]) {
      delete dislikedSet[id];
      dislikeBtn.classList.remove('qw-disliked');
    }
    if (isDislike && likedSet[id]) {
      delete likedSet[id];
      likeBtn.classList.remove('qw-liked');
    }
    if (isLike) {
      if (likedSet[id]) {
        // 已赞再点 = 取消赞（放行给 Twikoo toggle）
        delete likedSet[id];
        likeBtn.classList.remove('qw-liked');
        saveSets();
        return;
      }
      likedSet[id] = 1;
      likeBtn.classList.add('qw-liked');
      saveSets();
      logAction('点赞', '消息ID:' + id);
    } else if (isDislike) {
      if (dislikedSet[id]) {
        // 已踩再点 = 取消踩
        delete dislikedSet[id];
        dislikeBtn.classList.remove('qw-disliked');
        saveSets();
        return;
      }
      dislikedSet[id] = 1;
      dislikeBtn.classList.add('qw-disliked');
      saveSets();
      logAction('点踩', '消息ID:' + id);
    }
  }, true);

  // 拦截导航里的"聊天室"链接（fklts.html / chat.html）→ 打开悬浮弹窗，不跳转
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href$="fklts.html"], a[href$="chat.html"]') : null;
    if (a) { e.preventDefault(); openChat(); }
  }, true);

  // ===== 点赞防刷：同一浏览器只能点一次赞（跨窗口共享 localStorage） =====
  // 配合后端按 IP 去重：同 IP 多设备也刷不了；换 IP/换浏览器理论上可刷，无法根治
  var LK = 'qw_liked_v1';
  var likedSet = {};
  try { likedSet = JSON.parse(localStorage.getItem(LK) || '{}'); } catch (e) { likedSet = {}; }
  // ===== 已点赞高亮恢复：本地记录过的评论，点赞按钮固定显示为已赞（服务端 liked 状态因 IP 防刷不可用） =====
  // ===== 登录门：未填昵称+邮箱不能发言 =====
  var QW_NICK_KEY = 'qw_user_nick';
  var QW_MAIL_KEY = 'qw_user_mail';
  function getSavedUser() {
    try { return { nick: localStorage.getItem(QW_NICK_KEY) || '', mail: localStorage.getItem(QW_MAIL_KEY) || '' }; }
    catch (e) { return { nick: '', mail: '' }; }
  }
  function setTwikooField(sel, val) {
    var el = document.querySelector(sel);
    if (!el || !val) return;
    var proto = Object.getPrototypeOf(el);
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function applySavedUser() {
    var u = getSavedUser();
    if (!u.nick && !u.mail) return;
    setTwikooField('.qw-body .tk-meta-input input[name=nick]', u.nick);
    setTwikooField('.qw-body .tk-meta-input input[name=mail]', u.mail);
  }
  // 微信风回复预览条
  function showReplyBar(nick, text) {
    var submit = document.querySelector('.qw-body .tk-submit');
    if (!submit) return;
    var old = submit.querySelector('.qw-reply-bar');
    if (old) old.remove();
    var bar = document.createElement('div');
    bar.className = 'qw-reply-bar';
    bar.innerHTML = '<span class="qw-reply-nick">回复 ' + (nick || '') + '：</span>' +
      '<span class="qw-reply-text"></span>' +
      '<span class="qw-reply-cancel">×</span>';
    bar.querySelector('.qw-reply-text').textContent = text || '';
    bar.querySelector('.qw-reply-cancel').addEventListener('click', function () {
      bar.remove();
      // 同时取消 Twikoo 内部 parentComment（Vue）
      try {
        var vm = document.querySelector('#twikoo').__vue__;
        if (vm) { vm.parentComment = null; }
      } catch (e) {}
    });
    var input = submit.querySelector('.tk-input');
    submit.insertBefore(bar, input);
    input && input.querySelector('textarea') && input.querySelector('textarea').focus();
  }
  function clearReplyBar() {
    var bar = document.querySelector('.qw-reply-bar');
    if (bar) bar.remove();
    try { var vm = document.querySelector('#twikoo').__vue__; if (vm) vm.parentComment = null; } catch(e){}
  }
  // 点发送后自动清除回复条
  document.addEventListener('click', function(e) {
    var sendBtn = e.target && e.target.closest ? e.target.closest('.qw-body .tk-send') : null;
    if (sendBtn) setTimeout(clearReplyBar, 500);
  }, true);

  // ===== 访客登录（邮箱+昵称，localStorage 记住） =====
  var QW_NICK = 'qw_visitor_nick';
  var QW_EMAIL = 'qw_visitor_email';
  function getVisitor() {
    try { return { nick: localStorage.getItem(QW_NICK) || '', email: localStorage.getItem(QW_EMAIL) || '' }; }
    catch (e) { return { nick: '', email: '' }; }
  }
  function isLoggedIn() {
    var v = getVisitor();
    return !!(v.nick && v.email);
  }
  function setNativeValue(input, value) {
    if (!input) return;
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value', input);
    if (setter && setter.set) setter.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function applyVisitorToTwikoo() {
    var v = getVisitor();
    if (!v.nick) return;
    var inputs = document.querySelectorAll('.qw-body .tk-meta-input input');
    if (inputs[0]) setNativeValue(inputs[0], v.nick);
    if (inputs[1]) setNativeValue(inputs[1], v.email);
  }
  function refreshLoginUI() {
    var mask = document.getElementById('qw-login-mask');
    var panel = document.querySelector('.qw-panel');
    if (!mask) return;
    if (isLoggedIn()) {
      mask.classList.remove('qw-needs-login');
      if (panel) panel.classList.add('qw-logged-in');
      applyVisitorToTwikoo();
    } else {
      mask.classList.add('qw-needs-login');
      if (panel) panel.classList.remove('qw-logged-in');
    }
  }
  var loginMode = 'login'; // 'login' or 'register'
  function setLoginMode(mode) {
    loginMode = mode;
    var nickEl = document.getElementById('qw-login-nick');
    var nickField = document.getElementById('qw-nick-field');
    var titleEl = document.getElementById('qw-login-title');
    var subEl = document.getElementById('qw-login-sub');
    var btnEl = document.getElementById('qw-login-submit');
    var toggleEl = document.getElementById('qw-login-toggle');
    var tabLogin = document.getElementById('qw-tab-login');
    var tabReg = document.getElementById('qw-tab-register');
    if (mode === 'register') {
      if (nickEl) nickEl.style.display = '';
      if (nickField) nickField.style.display = '';
      var codeRow = document.getElementById('qw-code-row');
      if (codeRow) codeRow.style.display = 'flex';
      var codeInput = document.getElementById('qw-login-code');
      if (codeInput) codeInput.value = '';
      titleEl.textContent = '注册账号';
      subEl.textContent = '设置昵称、邮箱和密码';
      var emailEl = document.getElementById('qw-login-email');
      if (emailEl) emailEl.placeholder = '邮箱（用于接收验证码）';
      btnEl.textContent = '注 册';
      if (toggleEl) toggleEl.innerHTML = '<span>已有账号？</span><b id="qw-toggle-link">点击登录</b>';
      if (tabLogin) tabLogin.classList.remove('qw-active');
      if (tabReg) tabReg.classList.add('qw-active');
    } else {
      if (nickEl) nickEl.style.display = 'none';
      if (nickField) nickField.style.display = 'none';
      var codeRow2 = document.getElementById('qw-code-row');
      if (codeRow2) codeRow2.style.display = 'none';
      titleEl.textContent = '登录发言';
      subEl.textContent = '输入邮箱和密码登录';
      var emailEl2 = document.getElementById('qw-login-email');
      if (emailEl2) emailEl2.placeholder = '邮箱或昵称';
      btnEl.textContent = '登 录';
      if (toggleEl) toggleEl.innerHTML = '<span>没有账号？</span><b id="qw-toggle-link">点击注册</b>';
      if (tabLogin) tabLogin.classList.add('qw-active');
      if (tabReg) tabReg.classList.remove('qw-active');
    }
    var msgEl = document.getElementById('qw-login-msg');
    if (msgEl) { msgEl.textContent = ''; msgEl.classList.remove('qw-ok'); }
  }
  function openLogin() {
    var bd = document.getElementById('qw-login-backdrop');
    if (!bd) return;
    var v = getVisitor();
    setLoginMode('login');
    document.getElementById('qw-login-nick').value = '';
    document.getElementById('qw-login-email').value = v.email || '';
    var pwdEl = document.getElementById('qw-login-pwd');
    if (pwdEl) pwdEl.value = localStorage.getItem('qw_user_pwd') || '';
    bd.classList.add('qw-open');
    setTimeout(function(){ document.getElementById('qw-login-email').focus(); }, 100);
  }
  function closeLogin() {
    document.getElementById('qw-login-backdrop').classList.remove('qw-open');
  }
  function doLogin() {
    var nick = document.getElementById('qw-login-nick').value.trim();
    var email = document.getElementById('qw-login-email').value.trim();
    var pwd = document.getElementById('qw-login-pwd').value || '';
    var msgEl = document.getElementById('qw-login-msg');
    if (loginMode === 'register' && !nick) { msgEl.textContent = '请输入昵称'; return; }
    if (!email) { msgEl.textContent = '请输入邮箱或昵称'; return; } if (loginMode === 'register' && email.indexOf('@') < 0) { msgEl.textContent = '请输入有效邮箱'; return; }
    if (!pwd) { msgEl.textContent = '请输入密码'; return; }
    var btn = document.getElementById('qw-login-submit');
    if (btn) btn.disabled = true;
    var bodyData = { event: 'QW_USER_AUTH', email: email, password: pwd };
    if (loginMode === 'register') { bodyData.nick = nick; bodyData.code = (document.getElementById('qw-login-code') || {}).value ? document.getElementById('qw-login-code').value.trim() : ''; }
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(bodyData)
    }).then(function(r){return r.json();}).then(function(r){
      if (btn) btn.disabled = false;
      if (r.code !== 0) { msgEl.textContent = r.message || '操作失败'; return; }
      try {
        localStorage.setItem(QW_NICK, r.data.nick);
        localStorage.setItem(QW_EMAIL, (r.data.email || email).trim().toLowerCase());
        localStorage.setItem('qw_user_pwd', pwd);
      } catch (e) {}
      closeLogin();
      refreshLoginUI();
      syncLikesByEmail();
      try {
        var act = (r.data && r.data.action) || '';
        if (act === 'registered') logAction('注册', '新账号注册: ' + nick);
        else if (act === 'logged_in') logAction('登录', '账号登录: ' + (r.data.nick || nick));
      } catch (e2) {}
    }).catch(function(){
      if (btn) btn.disabled = false;
      msgEl.textContent = '网络错误，请重试';
    });
  }
  function logout() {
    try {
      var lv = getVisitor();
      if (lv.nick || lv.email) logAction('退出', '账号退出: ' + (lv.nick || lv.email));
      localStorage.removeItem(QW_NICK); localStorage.removeItem(QW_EMAIL);
    } catch (e) {}
    refreshLoginUI();
  }

  function recordLikeSideChannel(commentId) {
    var v = getVisitor();
    if (!v.email || !commentId) return;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'COMMENT_LIKE', commentId: commentId, email: v.email })
    }).catch(function(){});
  }
  function markLiked() {
    var myEmail = (getVisitor().email || '').trim().toLowerCase();
    document.querySelectorAll('.qw-body #twikoo .tk-comment').forEach(function (c) {
      var id = c.id || '';
      var links = c.querySelectorAll('.tk-action-link');
      if (!links.length) return;
      var likeBtn = links[0];
      var dislikeBtn = links[1] || null;
      if (likedSet[id]) {
        likeBtn.classList.add('qw-liked');
      } else {
        likeBtn.classList.remove('qw-liked');
      }
      if (dislikeBtn) {
        if (dislikedSet[id]) {
          dislikeBtn.classList.add('qw-disliked');
        } else {
          dislikeBtn.classList.remove('qw-disliked');
        }
      }
      // 删除/编辑按钮只显示给评论作者自己：
      // 前3个按钮是 赞/踩/回复，第4个及以后是删除/编辑等管理按钮
      try {
        var cmp = c.__vue__;
        var commentMail = cmp && cmp.comment ? (cmp.comment.mail || '').trim().toLowerCase() : '';
        var isMine = myEmail && commentMail === myEmail;
        for (var li = 3; li < links.length; li++) {
          links[li].style.display = isMine ? '' : 'none';
        }
      } catch (eHide) {}
    });
  }

  var DK = 'qw_disliked_v1';
  var dislikedSet = {};
  try { dislikedSet = JSON.parse(localStorage.getItem(DK) || '{}'); } catch (e) { dislikedSet = {}; }

  // 外部可调用
  window.openChatRoom = openChat;
  window.closeChatRoom = closeChat;
})();
