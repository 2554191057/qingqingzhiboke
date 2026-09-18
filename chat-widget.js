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
    ':root { --jp-paper:#edf2fa; --jp-surface:rgba(255,255,255,.94); --jp-ink:#182641; --jp-muted:#62728e; --jp-line:#cedaed; --jp-accent:#087fa8; --jp-blue:#4c67eb; --jp-glow:rgba(16,147,195,.14); --qw-danger:#e05b5b; }',
    '[data-theme="dark"] { --jp-paper:#080e1c; --jp-surface:rgba(15,24,43,.96); --jp-ink:#e5edff; --jp-muted:#8a9dbd; --jp-line:#23324f; --jp-accent:#50d3f6; --jp-blue:#8291ff; --jp-glow:rgba(63,199,249,.12); --qw-danger:#f87171; }',
    '/* 右下角悬浮按钮 */',
    '.qw-launcher:hover{transform:translateY(-3px);box-shadow:0 0 40px var(--jp-glow),0 12px 30px rgba(0,0,0,.22);}',
    '.qw-launcher svg{flex-shrink:0;}',
    '.qw-launcher .qw-dot{width:5px;height:5px;border-radius:50%;background:#3ecf6a;box-shadow:0 0 6px rgba(62,207,106,.7);}',
    '/* 遮罩 + 面板 */',
    '.qw-backdrop{position:fixed;inset:0;z-index:100;background:rgba(1,6,17,.65);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;padding:20px;}',
    '.qw-backdrop.qw-open{display:flex;animation:qwFade .25s ease;}',
    '.qw-panel{position:relative;width:620px;max-width:95vw;max-height:calc(100dvh - 40px);min-width:380px;min-height:500px;height:720px;display:flex;flex-direction:column;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:18px;box-shadow:0 28px 100px rgba(0,0,0,.4),0 0 40px var(--jp-glow);overflow:hidden;color:var(--jp-ink);animation:qwPop .3s cubic-bezier(.16,1,.3,1);resize:none;}',
'.qw-resize-handle{position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:50;background:linear-gradient(135deg,transparent 50%,rgba(128,128,128,.4) 50%,rgba(128,128,128,.4) 60%,transparent 60%,transparent 70%,rgba(128,128,128,.4) 70%,rgba(128,128,128,.4) 80%,transparent 80%,transparent 90%,rgba(128,128,128,.4) 90%,rgba(128,128,128,.4) 100%);border-bottom-right-radius:18px;pointer-events:auto;}',
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
    '.qw-login-head .qw-login-logo{width:44px;height:44px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#087fae,#4866db);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 18px rgba(8,127,174,.4);overflow:hidden;font-weight:700;font-size:19px;text-transform:uppercase;}',
    '.qw-login-head .qw-login-logo img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;border:none;}',
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
    /* 登录弹窗：找回密码 + 自动登录/记住密码 + 账号选择 */
    '.qw-login-pwd-row{display:flex;justify-content:flex-end;margin:-4px 0 6px;}',
    '.qw-login-pwd-row a{font-size:11px;color:var(--jp-accent);cursor:pointer;text-decoration:none;}',
    '.qw-login-pwd-row a:hover{text-decoration:underline;}',
    '.qw-login-opts{display:flex;justify-content:space-between;align-items:center;margin:0 2px 12px;}',
    '.qw-opt{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--jp-muted);cursor:pointer;user-select:none;transition:color .15s ease;}',
    '.qw-opt:hover{color:var(--jp-ink);}',
    '.qw-opt input{accent-color:var(--jp-accent);width:14px;height:14px;margin:0;cursor:pointer;}',
    '.qw-account-list{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;max-height:210px;overflow-y:auto;}',
    '.qw-account-list::-webkit-scrollbar{display:none;}',
    '.qw-body #twikoo::-webkit-scrollbar,.qw-body #twikoo *::-webkit-scrollbar{display:none!important;}',
    '.qw-body #twikoo,.qw-body #twikoo *{scrollbar-width:none!important;-ms-overflow-style:none!important;}',
    '.qw-acct{display:flex;align-items:center;gap:10px;padding:8px 26px 8px 10px;border:1px solid var(--jp-line);border-radius:12px;cursor:pointer;background:var(--jp-paper);position:relative;transition:border-color .15s ease,background .15s ease;}',
    '.qw-acct:hover{border-color:var(--jp-accent);}',
    '.qw-acct.qw-sel{border-color:var(--jp-accent);background:rgba(8,127,174,.08);}',
    '.qw-acct .qw-acct-av{width:34px;height:34px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#087fae,#4866db);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;}',
    '.qw-acct .qw-acct-av img{width:100%;height:100%;object-fit:cover;}',
    '.qw-acct .qw-acct-mid{flex:1;min-width:0;}',
    '.qw-acct .qw-acct-mid b{display:block;font-size:13px;color:var(--jp-ink);}',
    '.qw-acct .qw-acct-mid span{display:block;font-size:10px;color:var(--jp-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.qw-acct .qw-acct-check{color:var(--jp-accent);font-weight:700;font-size:15px;font-style:normal;flex-shrink:0;}',
    '.qw-acct .qw-acct-del{position:absolute;top:4px;right:6px;font-size:13px;color:var(--jp-muted);cursor:pointer;padding:1px 5px;border-radius:50%;line-height:1.2;}',
    '.qw-acct .qw-acct-del:hover{color:#e74c3c;background:rgba(231,76,60,.1);}',
    '.qw-acct-empty{text-align:center;padding:18px 0;font-size:12px;color:var(--jp-muted);}',
    '.qw-account-add{display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border:1px dashed var(--jp-line);border-radius:12px;color:var(--jp-muted);font-size:12px;cursor:pointer;margin-bottom:10px;transition:border-color .15s ease,color .15s ease;background:transparent;}',
    '.qw-account-add:hover{border-color:var(--jp-accent);color:var(--jp-accent);}',
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
    '.qw-body #twikoo .tk-comment{display:flex!important;align-items:flex-start!important;gap:8px!important;margin-bottom:10px!important;padding:0!important;flex-direction:row!important;flex-wrap:nowrap!important;}',
    '.qw-body #twikoo .tk-comment.tk-self{flex-direction:row-reverse!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:36px!important;height:36px!important;border-radius:50%!important;overflow:hidden!important;flex-shrink:0;margin:2px 0 0!important;background:var(--jp-glow)!important;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--jp-accent)!important;font-weight:600;pointer-events:none!important;cursor:default!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{min-width:0!important;max-width:calc(100% - 44px)!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main{align-items:flex-end!important;}',
    '.qw-body #twikoo .tk-comment .tk-nick{display:block!important;width:fit-content!important;margin:0 0 2px!important;padding:0 2px!important;line-height:1.3!important;pointer-events:none!important;cursor:default!important;}',
    '.qw-body #twikoo .tk-comment .tk-nick a{color:var(--jp-muted)!important;font-weight:500!important;font-size:11px!important;text-decoration:none!important;pointer-events:none!important;cursor:default!important;}',
    '.qw-body #twikoo .tk-nick strong{color:var(--jp-muted)!important;font-weight:500!important;font-size:11px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-nick{text-align:right!important;}',
    '.qw-body #twikoo .tk-comment .tk-row{display:none!important;}',
    '.qw-body #twikoo .tk-time{display:none!important;}',
    /* ===== 气泡：自适应宽度 + 小尾巴角标，与头像平齐 ===== */
    '.qw-body #twikoo .tk-content{white-space:pre-wrap;overflow-wrap:anywhere;background:#fff!important;border:1px solid rgba(120,140,170,.14)!important;border-radius:8px!important;padding:6px 10px!important;font-size:12.5px!important;line-height:1.5!important;margin:0!important;box-shadow:0 1px 2px rgba(16,40,80,.05)!important;width:fit-content!important;max-width:100%!important;min-width:0!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content{background:linear-gradient(120deg,rgba(16,147,195,.15),rgba(72,102,219,.13))!important;border-color:rgba(16,147,195,.26)!important;}',
    '.qw-body #twikoo .tk-content:before,.qw-body #twikoo .tk-content:after{display:none!important;}',
    '/* ===== 夜间模式气泡适配：对方深灰、自己深蓝，避免纯白刺眼 ===== */',
    '[data-theme="dark"] .qw-body #twikoo .tk-content{background:rgba(30,41,59,.92)!important;border-color:rgba(148,163,184,.16)!important;box-shadow:0 1px 3px rgba(0,0,0,.25)!important;}',
    '[data-theme="dark"] .qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content{background:linear-gradient(120deg,rgba(8,145,178,.28),rgba(79,70,229,.24))!important;border-color:rgba(56,189,248,.26)!important;}',
    '[data-theme="dark"] .qw-body #twikoo .qw-quote{background:rgba(148,163,184,.08)!important;border-left-color:rgba(56,189,248,.7)!important;}',
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
    '.qw-body #twikoo .tk-comments-title,.qw-body #twikoo .tk-action-bar,.qw-body #twikoo .tk-comments-switch,.qw-body #twikoo .tk-extra,.qw-body #twikoo .tk-extras,.qw-body #twikoo .tk-footer,.qw-body #twikoo .tk-comments-actions,.qw-body #twikoo .tk-comments-sort,.qw-body #twikoo .tk-comments-search,.qw-body #twikoo .tk-comments-count{display:none!important;}',
    '.qw-body #twikoo .tk-comments-container{padding-top:6px!important;}',
    /* 时间用居中时间条显示（微信式），隐藏每条小时间 */
    '.qw-body #twikoo .tk-time{display:none!important;}',
    '.qw-body #twikoo .qw-time-sep{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:10px 0 6px!important;opacity:.8!important;letter-spacing:.5px!important;}',
    /* 气泡（紧凑） */
    '.qw-body #twikoo .tk-comment{margin-bottom:8px!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:36px!important;height:36px!important;font-size:15px!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 44px)!important;}',
    /* ===== QQ式引用回复：气泡内引用栏（细淡灰条） ===== */
    '.qw-body #twikoo .qw-quote{background:rgba(128,142,168,.1)!important;border-left:3px solid var(--jp-accent)!important;border-radius:4px!important;padding:4px 9px!important;font-size:11px!important;line-height:1.5!important;color:var(--jp-muted)!important;margin:0 0 5px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;white-space:normal!important;text-align:left!important;opacity:.85;}',
    '.qw-body #twikoo .tk-replies,.qw-body #twikoo .tk-children{display:none!important;}',
    '.qw-body #twikoo .tk-expand-wrap,.qw-body #twikoo .tk-expand{display:none!important;}',
    '.qw-body #twikoo .tk-footer{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:12px 0 0!important;background:transparent!important;}',
    '.qw-body #twikoo .tk-footer a,.qw-body #twikoo .tk-footer .tk-action-link{color:var(--jp-muted)!important;}',
    /* Twikoo 管理抽屉（隐藏，改用自绘管理面板） */
    '.qw-body #twikoo .tk-admin-container{display:none!important;}',

    /* 聊天室登录遮罩 */
    '.qw-login-overlay{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(15,20,30,.88);backdrop-filter:blur(12px);border-radius:inherit;}',
    '.qw-login-card{width:82%;max-width:300px;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:16px;padding:22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.4);}',
    '.qw-login-card h3{margin:0 0 4px;font-size:16px;color:var(--jp-ink);font-weight:700;text-align:center;}',
    '.qw-login-card .qw-login-sub{margin:0 0 16px;font-size:11px;color:var(--jp-muted);text-align:center;}',
    '.qw-login-card input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);border-radius:9px;background:var(--jp-paper);color:var(--jp-ink);font-size:13px;padding:10px 12px;margin-bottom:10px;outline:none;}',
    '.qw-login-card input:focus{outline:1.5px solid var(--jp-accent);}',
    '.qw-login-card .qw-login-btn{width:100%;padding:11px;border:none;border-radius:9px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:13px;font-weight:600;cursor:pointer;}',
    '.qw-login-card .qw-login-err{color:#e74c3c;font-size:11px;text-align:center;margin-top:6px;min-height:14px;}',

    '@media(max-width:640px){.qw-launcher{right:14px;bottom:16px;padding:11px 14px;}.qw-backdrop{padding:12px;}.qw-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-panel>header{padding:15px 16px;}.qw-body{padding:0 15px 14px;}.qw-notice{padding:10px 16px;font-size:9px;}.qw-body #twikoo .tk-comment .tk-avatar{width:32px!important;height:32px!important;}.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 40px)!important;}.qw-body #twikoo .tk-children{margin-left:40px!important;}}',
    '@media(prefers-reduced-motion:reduce){.qw-launcher,.qw-backdrop,.qw-panel{animation:none!important;transition:none!important}}'
  ].join('\n');

  var HTML = '' +
    '<div id="qw-backdrop" class="qw-backdrop">' +
    '<div class="qw-panel" role="dialog" aria-modal="true" aria-labelledby="qw-title">' +
'<div class="qw-resize-handle" id="qw-resize-handle"></div>' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>' +
    '<div><h2 id="qw-title">聊天室</h2><p><span class="qw-dot"></span>实时同步</p></div>' +

    '<button class="qw-admin-btn" id="qw-admin-trigger" aria-label="后台管理" title="后台管理"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
    '<button class="qw-settings-btn" id="qw-settings-btn" title="账号设置"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>' +
    '<button class="qw-logout-btn" id="qw-logout-btn" title="退出登录">退出</button>' +
    '<button type="button" class="qw-icon-btn" id="qw-chat-refresh" aria-label="刷新聊天" title="刷新聊天"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>' +
    '<button class="qw-close" aria-label="关闭聊天室" title="关闭"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<p class="qw-notice">庆庆纸博客公共频道 · 可自由浏览，登录后即可发言。</p>' +
    '<div class="qw-login-mask" id="qw-login-mask">' +
    '<div class="qw-body"><div id="tcomment"></div><button id="qw-comment-btn" class="qw-comment-btn" aria-label="写评论"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>写评论…</button></div>' +
    '<div class="qw-login-bar"><div class="qw-lb-text"><h4>加入聊天</h4><p>注册账号后即可发言，支持QQ邮箱头像</p></div><div class="qw-lb-right"><p>登录后即可发言</p><button class="qw-lb-btn" id="qw-login-bar-btn">登 录</button></div></div></div>' +
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
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-new-pwd1" placeholder="新密码（至少8位，需含字母和数字/符号）"></div>' +
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
    '<div class="qw-login-logo" id="qw-login-logo"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>' +
    '<h3 id="qw-login-title">选择账号登录</h3><p id="qw-login-sub">选择已保存的账号快速登录</p>' +
    '</div>' +
    '<div class="qw-login-x" id="qw-login-x" style="position:absolute;top:14px;right:16px;cursor:pointer;font-size:18px;line-height:1;color:var(--jp-muted);user-select:none;z-index:3;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease;">&times;</div>' +
    /* ===== 视图A：昵称登录 / 邮箱登录 / 注册 ===== */
    '<div id="qw-login-view-form">' +
    '<div class="qw-login-tabs">' +
    '<button type="button" class="qw-login-tab qw-active" id="qw-tab-nick" data-mode="nick">昵称登录</button>' +
    '<button type="button" class="qw-login-tab" id="qw-tab-email" data-mode="email">邮箱登录</button>' +
    '</div>' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-field" id="qw-nick-field" style="display:none">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>' +
    '<input type="text" id="qw-login-nick" placeholder="昵称（怎么称呼你）" maxlength="20">' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>' +
    '<input type="text" id="qw-login-email" placeholder="昵称">' +
    '</div>' +
    '<div class="qw-login-code-row" id="qw-code-row">' +
    '<input type="text" id="qw-login-code" class="qw-c-input" placeholder="6位验证码" maxlength="6">' +
    '<button id="qw-send-code" type="button" class="qw-send-code">发送验证码</button>' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
    '<input type="password" id="qw-login-pwd" placeholder="密码">' +
    '</div>' +
    '<div class="qw-login-pwd-row"><a id="qw-login-forgot">找回密码</a></div>' +
    '<div class="qw-login-opts">' +
    '<label class="qw-opt"><input type="checkbox" id="qw-auto-login"><span>自动登录</span></label>' +
    '<label class="qw-opt"><input type="checkbox" id="qw-remember"><span>记住密码</span></label>' +
    '</div>' +
    '<button id="qw-login-submit" class="qw-submit">登 录</button>' +
    '<p id="qw-login-toggle" class="qw-login-toggle"><span>没有账号？</span><b id="qw-toggle-link">点击注册</b></p>' +
    '<p id="qw-login-msg" class="qw-login-msg"></p>' +
    '</div>' +
    '</div>' +
    /* ===== 视图B：选择账号登录 ===== */
    '<div id="qw-login-view-accounts" style="display:none">' +
    '<div class="qw-login-body">' +
    '<div class="qw-account-list" id="qw-account-list"></div>' +
    '<div class="qw-account-add" id="qw-account-add">＋ 添加账号</div>' +
    '<div class="qw-login-opts">' +
    '<label class="qw-opt"><input type="checkbox" id="qw-auto-login2"><span>自动登录</span></label>' +
    '</div>' +
    '<button id="qw-login-submit2" class="qw-submit">登 录</button>' +
    '<p id="qw-login-msg2" class="qw-login-msg"></p>' +
    '</div>' +
    '</div>' +
    /* ===== 视图C：找回密码 ===== */
    '<div id="qw-login-view-reset" style="display:none">' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>' +
    '<input type="text" id="qw-reset-email" placeholder="邮箱">' +
    '</div>' +
    '<div class="qw-login-code-row" id="qw-reset-code-row" style="display:flex">' +
    '<input type="text" id="qw-reset-code" class="qw-c-input" placeholder="6位验证码" maxlength="6">' +
    '<button id="qw-reset-sendcode" type="button" class="qw-send-code">发送验证码</button>' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
    '<input type="password" id="qw-reset-pwd1" placeholder="新密码（至少8位，需含字母和数字/符号）">' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
    '<input type="password" id="qw-reset-pwd2" placeholder="确认新密码">' +
    '</div>' +
    '<button id="qw-reset-submit" class="qw-submit">重置密码</button>' +
    '<p id="qw-login-back" class="qw-login-toggle"><span>想起密码了？</span><b id="qw-back-link">返回登录</b></p>' +
    '<p id="qw-login-msg3" class="qw-login-msg"></p>' +
    '</div>' +
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
  var TWIKOO_API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';
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
        onCommentLoaded: function () { scheduleMark(); fixAvatars(); followScroll(); }
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
  // ===== 清理气泡结尾换行符（<p>x</p>\n 在 pre-wrap 下产生空行，气泡被撑成竖条） =====
  function trimBubbleText() {
    var contents = document.querySelectorAll('.qw-body #twikoo .tk-content');
    for (var k = 0; k < contents.length; k++) {
      var cn = contents[k].childNodes;
      for (var ci = 0; ci < cn.length; ci++) {
        var cn0 = cn[ci];
        if (cn0 && cn0.nodeType === 3 && /^\s*$/.test(cn0.nodeValue || '')) {
          cn0.parentNode.removeChild(cn0);
        }
      }
    }
    var spans = document.querySelectorAll('.qw-body #twikoo .tk-content span');
    for (var i = 0; i < spans.length; i++) {
      var sp = spans[i];
      var kids = sp.childNodes;
      if (!kids.length) continue;
      var last = kids[kids.length - 1];
      if (last && last.nodeType === 3 && /^\s*$/.test(last.nodeValue || '')) {
        sp.removeChild(last);
      }
      var ps = sp.querySelectorAll('p');
      for (var j = 0; j < ps.length; j++) {
        var ln = ps[j].lastChild;
        if (ln && ln.nodeType === 3 && /^\s+$/.test(ln.nodeValue || '')) {
          ps[j].removeChild(ln);
        }
      }
    }
  }
  function markSelf() {
    var loggedIn = isLoggedIn();
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
      if (!loggedIn) { cc.classList.remove('tk-self'); continue; }
      var nickEl = cc.querySelector('.tk-nick');
      var nick = nickEl ? nickEl.textContent.trim() : '';
      var isSelf = false;
      try {
        var vue = cc.__vue__;
        if (vue && vue.comment) {
          var cMail = (vue.comment.mail || '').trim().toLowerCase();
          if (myMail && cMail === myMail) {
            isSelf = true;
            // 统一昵称：改昵称后旧消息也显示最新昵称，避免一个邮箱两个昵称
            if (myNick) {
              var nickTarget = nickEl.querySelector('a') || nickEl.querySelector('strong') || nickEl;
              if (nickTarget && nickTarget.textContent.trim() !== myNick) nickTarget.textContent = myNick;
            }
          }
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
        moveActionBelow, restructureReplies, sortComments, insertTimeSep, renameEmpty, trimBubbleText, markSelf, hookSendScroll];
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
    if (ta && (!ta.placeholder || ta.placeholder === '友善交流，文明发言…')) ta.placeholder = '发消息…';
  }
  // 监听评论列表变化（新增/加载）自动重新标记
  // 注意：Twikoo init 会把 #tcomment 替换成 #twikoo 根节点，观察器必须挂在稳定的 .qw-body 上
  var tcommentEl = document.querySelector('.qw-body');
  if (tcommentEl && window.MutationObserver) {
    var mo = new MutationObserver(function () { scheduleMark(); });
    mo.observe(tcommentEl, { childList: true, subtree: true });
  loadWhitelist();
  }

  function getVisitor() {
    try { return { nick: sessionStorage.getItem('qw_visitor_nick') || localStorage.getItem('qw_visitor_nick') || '', email: sessionStorage.getItem('qw_visitor_email') || localStorage.getItem('qw_visitor_email') || '' }; }
    catch (e) { return { nick: '', email: '' }; }
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
  var _scrollCtx = null;
  var _pendingScrollToBottom = false;
  function refreshComments() {
    try {
      var sc = document.querySelector('.qw-body .tk-comments-container');
      if (sc) {
        _scrollCtx = { top: sc.scrollTop, bottom: (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 40) };
      }
      var vm = document.querySelector('#twikoo').__vue__;
      if (vm && vm.getCommentsList) vm.getCommentsList();
      else if (window.twikoo) window.twikoo.getCommentsList({ reset: true });
    } catch(e) {}
  }
  // 新消息/发消息后自动滚到底部；向上翻阅历史时保持原位置不跳动
  function followScroll() {
    var sc = document.querySelector('.qw-body .tk-comments-container');
    if (!sc) return;
    if (_pendingScrollToBottom) {
      _pendingScrollToBottom = false; _scrollCtx = null;
      sc.scrollTop = sc.scrollHeight;
      return;
    }
    if (_scrollCtx) {
      var ctx = _scrollCtx; _scrollCtx = null;
      if (ctx.bottom) { sc.scrollTop = sc.scrollHeight; return; }
      var t = ctx.top;
      setTimeout(function () {
        var sc2 = document.querySelector('.qw-body .tk-comments-container');
        if (sc2) sc2.scrollTop = t;
      }, 40);
      return;
    }
    // 无上下文：不干预（如点赞/删除触发的重渲染）
  }
  // 发送按钮点击 → 下次列表加载后滚到底部
  function hookSendScroll() {
    var btns = document.querySelectorAll('.qw-body #twikoo .tk-send');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute('data-qw-send-hooked')) continue;
      btns[i].setAttribute('data-qw-send-hooked', '1');
      btns[i].addEventListener('click', function () { _pendingScrollToBottom = true; });
    }
  }
  function openChat() {
    backdrop.classList.add('qw-open');
    _pendingScrollToBottom = true;
    logAction('访问聊天室', '打开聊天室');
    document.body.style.overflow = 'hidden';
    loadAssets(function () {
      tryAutoLogin(function () { initTwikoo(); });
      setTimeout(function(){
        refreshLoginUI();
        verifyLoginState();
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

  if(launcher) launcher.addEventListener('click', openChat);
  window.openChatRoom = openChat;
  window.closeChatRoom = closeChat;
  document.addEventListener('DOMContentLoaded', refreshLoginUI);
  // 页面访问上报已由 js/online-stats.js 统一发送（避免重复日志）；本文件不再上报
  // 锚点区块访问日志由 js/online-stats.js 的 hashchange 监听统一发送（避免重复），本文件不再上报
  // 打开聊天室后刷新登录态
  var _origOpen = openChat;
  openChat = function () {
    _origOpen.apply(this, arguments);
    setTimeout(refreshLoginUI, 300);
  };
  window.openChatRoom = openChat;
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
  var tabNick = document.getElementById('qw-tab-nick');
  var tabEmail = document.getElementById('qw-tab-email');
  if (tabNick) tabNick.addEventListener('click', function(){ showLoginView('form'); setLoginMode('login'); setLoginTab('nick'); });
  if (tabEmail) tabEmail.addEventListener('click', function(){ showLoginView('form'); setLoginMode('login'); setLoginTab('email'); });
  var toggleEl2 = document.getElementById('qw-login-toggle');
  if (toggleEl2) toggleEl2.addEventListener('click', function(e){
    if (e.target && e.target.id === 'qw-toggle-link') setLoginMode(loginMode === 'login' ? 'register' : 'login');
  });
  // ===== 登录弹窗：视图切换 / 账号选择 / 自动登录 / 找回密码 =====
  var loginTab = 'nick'; // 'nick' | 'email'
  function setLoginTab(t) {
    loginTab = t;
    var tn = document.getElementById('qw-tab-nick');
    var te = document.getElementById('qw-tab-email');
    if (tn) tn.classList.toggle('qw-active', t === 'nick');
    if (te) te.classList.toggle('qw-active', t === 'email');
    var idEl = document.getElementById('qw-login-email');
    if (idEl && loginMode !== 'register') idEl.placeholder = t === 'nick' ? '昵称' : '邮箱';
    var forgot = document.getElementById('qw-login-forgot');
    if (forgot) forgot.style.display = (loginMode === 'login' && t === 'email') ? '' : 'none';
    var titleEl = document.getElementById('qw-login-title');
    var subEl = document.getElementById('qw-login-sub');
    if (loginMode === 'login') {
      titleEl.textContent = t === 'nick' ? '昵称登录' : '邮箱登录';
      subEl.textContent = t === 'nick' ? '输入昵称和密码登录' : '输入邮箱和密码登录';
    }
  }
  function showLoginView(view) {
    var form = document.getElementById('qw-login-view-form');
    var acc = document.getElementById('qw-login-view-accounts');
    var rst = document.getElementById('qw-login-view-reset');
    if (form) form.style.display = view === 'form' ? '' : 'none';
    if (acc) acc.style.display = view === 'accounts' ? '' : 'none';
    if (rst) rst.style.display = view === 'reset' ? '' : 'none';
    var titleEl = document.getElementById('qw-login-title');
    var subEl = document.getElementById('qw-login-sub');
    if (view === 'accounts') {
      titleEl.textContent = '选择账号登录';
      subEl.textContent = '选择已保存的账号快速登录';
    } else if (view === 'reset') {
      titleEl.textContent = '找回密码';
      subEl.textContent = '通过邮箱验证码重置密码';
    } else if (loginMode === 'register') {
      titleEl.textContent = '注册账号';
      subEl.textContent = '设置昵称、邮箱和密码';
    } else {
      titleEl.textContent = loginTab === 'nick' ? '昵称登录' : '邮箱登录';
      subEl.textContent = loginTab === 'nick' ? '输入昵称和密码登录' : '输入邮箱和密码登录';
    }
    var a1 = document.getElementById('qw-auto-login');
    var a2 = document.getElementById('qw-auto-login2');
    try {
      var cur = localStorage.getItem(QW_AUTO) === '1';
      if (view === 'accounts' && a1 && a2) a2.checked = a1.checked || cur;
      if (view === 'form' && a1 && a2) a1.checked = a2.checked || cur;
    } catch (e) {}
  }
  var acctSelIndex = 0;
  function renderAccounts() {
    var list = savedAccounts();
    var el = document.getElementById('qw-account-list');
    if (!el) return;
    if (acctSelIndex >= list.length) acctSelIndex = 0;
    el.innerHTML = list.map(function (a, i) {
      var m = String(a.email || '').toLowerCase().match(/^(\d+)@qq\.com$/);
      var av = m ? '<img src="https://q1.qlogo.cn/g?b=qq&nk=' + m[1] + '&s=100" alt="">' : '<span>' + escHtml((a.nick || '?').charAt(0).toUpperCase()) + '</span>';
      var sel = i === acctSelIndex ? ' qw-sel' : '';
      return '<div class="qw-acct' + sel + '" data-i="' + i + '">' +
        '<div class="qw-acct-av">' + av + '</div>' +
        '<div class="qw-acct-mid"><b>' + escHtml(a.nick || '') + '</b><span>' + escHtml(a.email || '') + '</span></div>' +
        (sel ? '<i class="qw-acct-check">✓</i>' : '') +
        '<i class="qw-acct-del" data-del="' + i + '" title="删除该账号">×</i>' +
        '</div>';
    }).join('') || '<div class="qw-acct-empty">暂无已保存账号</div>';
    var acc = list[acctSelIndex];
    var logo = document.getElementById('qw-login-logo');
    if (logo && acc) renderAccountAvatar(logo, acc.nick, acc.email);
  }
  var acctListEl = document.getElementById('qw-account-list');
  if (acctListEl) acctListEl.addEventListener('click', function (e) {
    var del = e.target.closest('.qw-acct-del');
    if (del) {
      var di = parseInt(del.getAttribute('data-del'), 10);
      var list = savedAccounts();
      var acc = list[di];
      if (acc && window.confirm('删除已保存账号 ' + (acc.nick || acc.email) + ' ？')) {
        removeAccount(acc.email);
        if (acctSelIndex >= savedAccounts().length) acctSelIndex = 0;
        renderAccounts();
        if (!savedAccounts().length) { showLoginView('form'); setLoginTab(loginTab); }
      }
      return;
    }
    var card = e.target.closest('.qw-acct');
    if (card) {
      acctSelIndex = parseInt(card.getAttribute('data-i'), 10);
      renderAccounts();
    }
  });
  var acctAddBtn = document.getElementById('qw-account-add');
  if (acctAddBtn) acctAddBtn.addEventListener('click', function () {
    showLoginView('form');
    setLoginMode('login');
    setLoginTab('email');
    document.getElementById('qw-login-email').value = '';
    document.getElementById('qw-login-pwd').value = '';
    setTimeout(function(){ document.getElementById('qw-login-email').focus(); }, 60);
  });
  var loginSubmit2 = document.getElementById('qw-login-submit2');
  if (loginSubmit2) loginSubmit2.addEventListener('click', function () {
    var list = savedAccounts();
    var acc = list[acctSelIndex] || list[0];
    if (!acc) { showLoginView('form'); return; }
    var msgEl = document.getElementById('qw-login-msg2');
    var btn = loginSubmit2;
    btn.disabled = true;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_USER_AUTH', email: acc.email, password: acc.pwd })
    }).then(function(r){return r.json();}).then(function(r){
      btn.disabled = false;
      if (r.code !== 0) {
        msgEl.textContent = (r.message || '登录失败') + '，请重新输入密码';
        showLoginView('form');
        document.getElementById('qw-login-email').value = acc.email && acc.email.indexOf('@') >= 0 ? acc.email : (acc.nick || '');
        document.getElementById('qw-login-pwd').value = '';
        setLoginTab(acc.email && acc.email.indexOf('@') >= 0 ? 'email' : 'nick');
        document.getElementById('qw-login-msg').textContent = '该账号密码可能已变更，请重新登录';
        var a1 = document.getElementById('qw-auto-login');
        var a2 = document.getElementById('qw-auto-login2');
        if (a1 && a2) a1.checked = a2.checked;
        return;
      }
      var resNick = r.data.nick;
      var resEmail = (r.data.email || acc.email || '').trim().toLowerCase();
      var a2 = document.getElementById('qw-auto-login2');
      var auto2 = a2 && a2.checked;
      try {
        sessionStorage.setItem(QW_NICK, resNick);
        sessionStorage.setItem(QW_EMAIL, resEmail);
        saveAccount({ nick: resNick, email: resEmail, pwd: acc.pwd });
        if (auto2) {
          localStorage.setItem(QW_NICK, resNick);
          localStorage.setItem(QW_EMAIL, resEmail);
        } else {
          localStorage.removeItem(QW_NICK);
          localStorage.removeItem(QW_EMAIL);
        }
        localStorage.setItem(QW_AUTO, auto2 ? '1' : '0');
      } catch (e) {}
      closeLogin();
      refreshLoginUI();
      verifyLoginState();
      syncLikesByEmail();
      try { logAction('登录', '账号登录: ' + resNick); } catch (e3) {}
    }).catch(function(){ btn.disabled = false; msgEl.textContent = '网络错误，请重试'; });
  });
  function tryAutoLogin(cb) {
    cb = cb || function () {};
    if (isLoggedIn()) { cb(); return; }
    var auto = '';
    try { auto = localStorage.getItem(QW_AUTO); } catch (e) {}
    if (auto !== '1') { cb(); return; }
    var list = savedAccounts();
    var acc = list[0];
    if (!acc || !acc.email || !acc.pwd) { cb(); return; }
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_USER_AUTH', email: acc.email, password: acc.pwd })
    }).then(function(r){return r.json();}).then(function(r){
      if (r.code === 0) {
        try {
          var em = (r.data.email || acc.email).trim().toLowerCase();
          sessionStorage.setItem(QW_NICK, r.data.nick);
          sessionStorage.setItem(QW_EMAIL, em);
          localStorage.setItem(QW_NICK, r.data.nick);
          localStorage.setItem(QW_EMAIL, em);
          saveAccount({ nick: r.data.nick, email: em, pwd: acc.pwd });
        } catch (e) {}
        refreshLoginUI();
      } else {
        try { localStorage.setItem(QW_AUTO, '0'); } catch (e) {}
        refreshLoginUI();
      }
      cb();
    }).catch(function(){ cb(); });
  }
  var forgotLink = document.getElementById('qw-login-forgot');
  if (forgotLink) forgotLink.addEventListener('click', function () {
    var v = getVisitor();
    var re = document.getElementById('qw-reset-email');
    var saved = savedAccounts();
    if (re) re.value = v.email || (saved[0] ? saved[0].email : '');
    var msg3 = document.getElementById('qw-login-msg3');
    if (msg3) { msg3.textContent = ''; msg3.classList.remove('qw-ok'); }
    showLoginView('reset');
  });
  var backLink = document.getElementById('qw-back-link');
  if (backLink) backLink.addEventListener('click', function () {
    showLoginView('form');
    setLoginTab('email');
  });
  var resetSendBtn = document.getElementById('qw-reset-sendcode');
  if (resetSendBtn) resetSendBtn.addEventListener('click', function () {
    var email = (document.getElementById('qw-reset-email') || {}).value ? document.getElementById('qw-reset-email').value.trim() : '';
    var msgEl = document.getElementById('qw-login-msg3');
    if (!email || email.indexOf('@') < 0) { if (msgEl) msgEl.textContent = '请先输入有效邮箱'; return; }
    var btn = resetSendBtn;
    btn.disabled = true; btn.textContent = '发送中…';
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_SEND_CODE', email: email, type: 'reset' })
    }).then(function(r){return r.json();}).then(function(r){
      btn.disabled = false;
      if (r.code !== 0) { btn.textContent = '发送验证码'; if (msgEl) msgEl.textContent = r.message || '发送失败'; return; }
      if (msgEl) msgEl.textContent = '验证码已发送，请查收邮箱';
      var sec = 60; btn.disabled = true; btn.textContent = sec + 's 后重发';
      var t = setInterval(function(){ sec--; if (sec <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = '发送验证码'; } else btn.textContent = sec + 's 后重发'; }, 1000);
    }).catch(function(){ btn.disabled = false; btn.textContent = '发送验证码'; if (msgEl) msgEl.textContent = '网络错误，请重试'; });
  });
  var resetSubmitBtn = document.getElementById('qw-reset-submit');
  if (resetSubmitBtn) resetSubmitBtn.addEventListener('click', function () {
    var email = (document.getElementById('qw-reset-email') || {}).value ? document.getElementById('qw-reset-email').value.trim() : '';
    var code = (document.getElementById('qw-reset-code') || {}).value ? document.getElementById('qw-reset-code').value.trim() : '';
    var p1 = (document.getElementById('qw-reset-pwd1') || {}).value || '';
    var p2 = (document.getElementById('qw-reset-pwd2') || {}).value || '';
    var msgEl = document.getElementById('qw-login-msg3');
    if (!email || email.indexOf('@') < 0) { msgEl.textContent = '请输入有效邮箱'; return; }
    if (!code) { msgEl.textContent = '请输入验证码'; return; }
    if (!qwPwdOk(p1)) { msgEl.textContent = '新密码至少8位，且需包含字母和数字/符号（不能纯数字）'; return; }
    if (p1 !== p2) { msgEl.textContent = '两次密码不一致'; return; }
    var btn = resetSubmitBtn;
    btn.disabled = true;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_RESET_PASSWORD', email: email, code: code, newPwd: p1 })
    }).then(function(r){return r.json();}).then(function(r){
      btn.disabled = false;
      if (r.code !== 0) { msgEl.textContent = r.message || '重置失败'; return; }
      showLoginView('form');
      setLoginTab('email');
      document.getElementById('qw-login-email').value = email;
      document.getElementById('qw-login-pwd').value = '';
      var mEl = document.getElementById('qw-login-msg');
      if (mEl) { mEl.textContent = '密码已重置，请用新密码登录'; mEl.classList.add('qw-ok'); }
    }).catch(function(){ btn.disabled = false; msgEl.textContent = '网络错误，请重试'; });
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

  // ===== 管理员入口：锁图标跳转独立后台管理页（admin.html 与聊天室共用 qw_admin_token，登录态自动带入） =====
  var adminBtn = document.getElementById('qw-admin-trigger');
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }


  // 复制IP（事件委托，兼容日志区块局部刷新）
  // ===== 点赞防刷：同一浏览器只能点一次赞（跨窗口共享 localStorage） =====
  var LK = 'qw_liked_v1';
  var likedSet = {};
  try { likedSet = JSON.parse(localStorage.getItem(LK) || '{}'); } catch (e) { likedSet = {}; }
  // ===== 登录门：未填昵称+邮箱不能发言 =====
  var QW_NICK_KEY = 'qw_user_nick';
  var QW_MAIL_KEY = 'qw_user_mail';
  // ===== 访客登录（邮箱+昵称） =====
  var QW_NICK = 'qw_visitor_nick';
  var QW_EMAIL = 'qw_visitor_email';
  var QW_ACCOUNTS = 'qw_accounts';
  var QW_AUTO = 'qw_auto_login';
  function savedAccounts() {
    try { var a = JSON.parse(localStorage.getItem(QW_ACCOUNTS) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function saveAccount(acc) {
    if (!acc || !acc.email) return;
    try {
      var list = savedAccounts().filter(function (x) { return x.email !== acc.email; });
      list.unshift(acc);
      if (list.length > 5) list.length = 5;
      localStorage.setItem(QW_ACCOUNTS, JSON.stringify(list));
    } catch (e) {}
  }
  function removeAccount(email) {
    try {
      var list = savedAccounts().filter(function (x) { return x.email !== email; });
      localStorage.setItem(QW_ACCOUNTS, JSON.stringify(list));
    } catch (e) {}
  }

  adminBtn.addEventListener('click', function () {
    closeChat();
    // 聊天室锁图标 → 跳转独立后台管理页（admin.html 与聊天室共用 qw_admin_token，登录态自动带入）；先记来源页供后台返回按钮使用
    try { sessionStorage.setItem('qw_admin_from', location.href); } catch (e) {}
    try { sessionStorage.setItem('qw_admin_from_chat', '1'); } catch (e) {}
    location.href = 'admin.html';
  });
  document.getElementById('qw-logout-btn').addEventListener('click', function () {
    logout();
  });
  // ===== 账号设置弹窗 =====
  var settingsModal = document.getElementById('qw-settings-modal');
  var setMsg = document.getElementById('qw-set-msg');
  document.querySelectorAll('#qw-settings-modal .qw-login-tab').forEach(function(tab){
    tab.addEventListener('click', function(){ setTab(tab.getAttribute('data-set')); });
  });
  document.getElementById('qw-settings-btn').addEventListener('click', openSettings);
  settingsModal.addEventListener('click', function(e) { if (e.target === settingsModal) closeSettings(); });
  document.getElementById('qw-settings-close-x').addEventListener('click', closeSettings);
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
        // 同步已保存账号列表里同邮箱的昵称，否则选择账号登录还显示旧昵称
        try {
          var accList = savedAccounts().map(function(a){
            if (a.email && a.email.toLowerCase() === v.email.toLowerCase()) a.nick = nick;
            return a;
          });
          localStorage.setItem(QW_ACCOUNTS, JSON.stringify(accList));
        } catch (eAcc) {}
        // 同步 Twikoo 昵称字段，否则发新评论和聊天室显示仍用旧昵称
        applyVisitorToTwikoo();
        // 同步账号设置弹窗里显示的当前昵称
        var curNickEl = document.getElementById('qw-set-current-nick');
        if (curNickEl) curNickEl.textContent = nick;
        showSetMsg('昵称已修改', true);
        logAction('改昵称', '昵称改为: ' + nick);
        setTimeout(function(){
          closeSettings();
          refreshLoginUI();
          // 重新加载聊天室评论列表，实时刷新消息气泡的昵称和头像
          twikooInited = false;
          var tc = document.getElementById('tcomment');
          if (tc) tc.innerHTML = '';
          initTwikoo();
        }, 800);
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
  // 改密码/改邮箱：发验证码
  bindSendCode('qw-set-pwd-sendcode', function(){ return getVisitor().email; }, 'reset');
  bindSendCode('qw-set-email-sendold', function(){ return getVisitor().email; }, 'changeemail');
  bindSendCode('qw-set-email-sendnew', function(){ return document.getElementById('qw-set-new-email').value.trim(); }, 'register');
  document.getElementById('qw-set-pwd-save').addEventListener('click', function() {
    var v = getVisitor();
    var p1 = document.getElementById('qw-set-new-pwd1').value;
    var p2 = document.getElementById('qw-set-new-pwd2').value;
    if (!qwPwdOk(p1)) { showSetMsg('密码至少8位，且需包含字母和数字/符号（不能纯数字）', false); return; }
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
        localStorage.setItem('qw_user_pwd', p1);
        try {
          var accPwdList = savedAccounts().map(function(a){
            if (a.email && a.email.toLowerCase() === v.email.toLowerCase()) a.pwd = p1;
            return a;
          });
          localStorage.setItem(QW_ACCOUNTS, JSON.stringify(accPwdList));
        } catch (ePwd) {}
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
        applyVisitorToTwikoo();
        try {
          var accEmailList = savedAccounts().map(function(a){
            if (a.email && a.email.toLowerCase() === v.email.toLowerCase()) a.email = ne;
            return a;
          });
          localStorage.setItem(QW_ACCOUNTS, JSON.stringify(accEmailList));
        } catch (eEm) {}
        showSetMsg('邮箱已修改', true);
        logAction('改邮箱', '邮箱改为: ' + ne);
        setTimeout(function(){ closeSettings(); refreshLoginUI(); }, 800);
      } else showSetMsg(r.message || '修改失败', false);
    }).catch(function(){ setBtnRestore(btn, '保存邮箱'); showSetMsg('网络错误', false); });
  });

  var DK = 'qw_disliked_v1';
  var dislikedSet = {};
  try { dislikedSet = JSON.parse(localStorage.getItem(DK) || '{}'); } catch (e) { dislikedSet = {}; }
  // 点赞/点踩日志：委托监听气泡下操作按钮（第1个=赞，第2个=踩，第3个=回复）
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('.qw-body #twikoo .tk-comment .tk-action-link') : null;
    if (!link) return;
    var cEl = link.closest('.tk-comment');
    if (!cEl) return;
    var links = cEl.querySelectorAll('.tk-action-link');
    var idx = Array.prototype.indexOf.call(links, link);
    if (idx !== 0 && idx !== 1) return;
    var nick = '', content = '';
    try {
      var v = cEl.__vue__;
      if (v && v.comment) { nick = v.comment.nick || ''; content = String(v.comment.comment || '').slice(0, 20); }
    } catch (ex) {}
    if (idx === 0) logAction('点赞', (nick ? '给 ' + nick + ' 的消息点赞' : '点赞消息') + (content ? '：「' + content + '」' : ''));
    else logAction('点踩', (nick ? '点踩了 ' + nick + ' 的消息' : '点踩消息') + (content ? '：「' + content + '」' : ''));
  });
  document.addEventListener('dblclick', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.qw-log-copy') : null;
    if (!btn) return;
    var ip = btn.getAttribute('data-ip');
    if (!ip) return;
    function copied() {
      btn.textContent = '已复制';
      btn.classList.add('ok');
      setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('ok'); }, 1500);
    }
    function legacyCopy() {
      var ta = document.createElement('textarea');
      ta.value = ip;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;';
      ta.style.webkitUserSelect = 'text';
      ta.style.userSelect = 'text';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      if (ok) copied();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ip).then(copied, legacyCopy);
    } else {
      legacyCopy();
    }
  });

  function applySavedUser() {
    var u = getSavedUser();
    if (!u.nick && !u.mail) return;
    setTwikooField('.qw-body .tk-meta-input input[name=nick]', u.nick);
    setTwikooField('.qw-body .tk-meta-input input[name=mail]', u.mail);
  }
  function applyVisitorToTwikoo() {
    var v = getVisitor();
    if (!v.nick) return;
    document.cookie = 'twikoo-nick=' + encodeURIComponent(v.nick) + ';path=/;max-age=31536000';
    document.cookie = 'twikoo-mail=' + encodeURIComponent(v.email || '') + ';path=/;max-age=31536000';
    // Twikoo 的 tk-meta-input 从 localStorage('twikoo') 初始化，且 3 秒刷新会重建组件；
    // 必须直接写入，否则重建后 metaData 为空、发送按钮永久禁用
    try { localStorage.setItem('twikoo', JSON.stringify({ nick: v.nick, mail: v.email || '', link: '' })); } catch (eLS) {}
    var inputs = document.querySelectorAll('.qw-body .tk-meta-input input');
    if (inputs[0]) setNativeValue(inputs[0], v.nick);
    if (inputs[1]) setNativeValue(inputs[1], v.email);
    // 直接驱动 tk-meta-input 组件完成 updateMeta 事件链（绕开输入事件与重建的时序竞态）
    try {
      var tw = document.getElementById('twikoo');
      var vm = tw && tw.__vue__;
      if (vm) {
        var queue = [vm], seen = {}, mi = null;
        for (var qi = 0; qi < queue.length && qi < 60; qi++) {
          var cur = queue[qi];
          if (!cur || seen[cur._uid]) continue;
          seen[cur._uid] = 1;
          var d = cur.$data || {};
          if (d.metaInputs !== undefined && d.metaData !== undefined) { mi = cur; break; }
          if (cur.$children) for (var ci = 0; ci < cur.$children.length; ci++) queue.push(cur.$children[ci]);
        }
        if (mi) {
          mi.metaData.nick = v.nick;
          mi.metaData.mail = v.email || '';
          if (mi.metaData.link === undefined) mi.metaData.link = '';
          if (mi.updateMeta) mi.updateMeta();
        }
      }
    } catch (eA) {}
  }
  // ===== 注册态核验：本地登录态仅凭 localStorage 昵称+邮箱，需向后端确认邮箱确实注册过账号 =====
  function checkRegistered(email, cb) {
    if (!email || email.indexOf('@') < 0) { cb(false); return; }
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_USER_CHECK', email: email })
    }).then(function(r){ return r.json(); }).then(function(r){
      cb(!!(r && r.code === 0 && r.data && r.data.registered));
    }).catch(function(){ cb(null); });
  }
  // 打开聊天室/登录后核验：邮箱未注册则清除残留登录态并回到登录门，避免"看得到聊天框却发不出"的假登录态
  function verifyLoginState() {
    var v = getVisitor();
    if (!v.email) return;
    checkRegistered(v.email, function (reg) {
      if (reg === false) {
        try {
          sessionStorage.removeItem(QW_NICK);
          sessionStorage.removeItem(QW_EMAIL);
          localStorage.removeItem(QW_NICK);
          localStorage.removeItem(QW_EMAIL);
          localStorage.removeItem('qw_user_pwd');
        } catch (e) {}
        refreshLoginUI();
        var tip = document.querySelector('.qw-login-bar .qw-lb-text p');
        if (tip) {
          tip.textContent = '该邮箱未注册账号，请注册或登录后发言';
          setTimeout(function(){ tip.textContent = '注册账号后即可发言，支持QQ邮箱头像'; }, 6000);
        }
      }
    });
  }
  // 账号设置弹窗头部头像：QQ 邮箱显示 QQ 头像，其他邮箱显示昵称首字
  function renderAccountAvatar(el, nick, email) {
    if (!el) return;
    var m = String(email || '').trim().toLowerCase().match(/^(\d+)@qq\.com$/);
    var ch = nick && nick.trim() ? nick.trim()[0].toUpperCase() : '?';
    if (m) {
      var qq = m[1];
      el.innerHTML = '<img src="https://q1.qlogo.cn/g?b=qq&nk=' + qq + '&s=100" alt="" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + ch + '\'">';
    } else {
      el.textContent = ch;
    }
  }
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
  function block(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
  function clearReplyBar() {
    var bar = document.querySelector('.qw-reply-bar');
    if (bar) bar.remove();
    try { var vm = document.querySelector('#twikoo').__vue__; if (vm) vm.parentComment = null; } catch(e){}
  }
  function closeLogin() {
    document.getElementById('qw-login-backdrop').classList.remove('qw-open');
  }
  function closeSettings() { settingsModal.classList.remove('qw-open'); }
  function doLogin() {
    var nick = document.getElementById('qw-login-nick').value.trim();
    var loginId = document.getElementById('qw-login-email').value.trim();
    var pwd = document.getElementById('qw-login-pwd').value || '';
    var msgEl = document.getElementById('qw-login-msg');
    if (loginMode === 'register') {
      if (!nick) { msgEl.textContent = '请输入昵称'; return; }
      if (loginId.indexOf('@') < 0) { msgEl.textContent = '注册请输入邮箱'; return; }
    } else if (!loginId) { msgEl.textContent = '请输入昵称或邮箱'; return; }
    if (!pwd) { msgEl.textContent = '请输入密码'; return; }
    if (loginMode === 'register' && !qwPwdOk(pwd)) { msgEl.textContent = '密码至少8位，且需包含字母和数字/符号（不能纯数字）'; return; }
    var btn = document.getElementById('qw-login-submit');
    if (btn) btn.disabled = true;
    var bodyData = { event: 'QW_USER_AUTH', email: loginId, password: pwd };
    if (loginMode === 'register') { bodyData.nick = nick; bodyData.code = (document.getElementById('qw-login-code') || {}).value ? document.getElementById('qw-login-code').value.trim() : ''; }
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(bodyData)
    }).then(function(r){return r.json();}).then(function(r){
      if (btn) btn.disabled = false;
      if (r.code !== 0) { msgEl.textContent = r.message || '操作失败'; return; }
      var resNick = r.data.nick;
      var resEmail = (r.data.email || '').trim().toLowerCase();
      var remember = !!(document.getElementById('qw-remember') && document.getElementById('qw-remember').checked);
      var auto = !!(document.getElementById('qw-auto-login') && document.getElementById('qw-auto-login').checked);
      if (auto) remember = true; // 自动登录隐含记住密码
      try {
        sessionStorage.setItem(QW_NICK, resNick);
        sessionStorage.setItem(QW_EMAIL, resEmail);
        if (remember) {
          localStorage.setItem('qw_user_pwd', pwd);
          saveAccount({ nick: resNick, email: resEmail, pwd: pwd });
          if (auto) {
            localStorage.setItem(QW_NICK, resNick);
            localStorage.setItem(QW_EMAIL, resEmail);
          } else {
            localStorage.removeItem(QW_NICK);
            localStorage.removeItem(QW_EMAIL);
          }
        } else {
          localStorage.removeItem(QW_NICK);
          localStorage.removeItem(QW_EMAIL);
          localStorage.removeItem('qw_user_pwd');
          removeAccount(resEmail);
        }
        localStorage.setItem(QW_AUTO, auto ? '1' : '0');
      } catch (e) {}
      closeLogin();
      refreshLoginUI();
      verifyLoginState();
      syncLikesByEmail();
      try {
        var act = (r.data && r.data.action) || '';
        if (act === 'registered') logAction('注册', '新账号注册: ' + resNick);
        else if (act === 'logged_in') logAction('登录', '账号登录: ' + resNick);
      } catch (e2) {}
    }).catch(function(){
      if (btn) btn.disabled = false;
      msgEl.textContent = '网络错误，请重试';
    });
  }
  function getSavedUser() {
    try { return { nick: localStorage.getItem(QW_NICK_KEY) || '', mail: localStorage.getItem(QW_MAIL_KEY) || '' }; }
    catch (e) { return { nick: '', mail: '' }; }
  }
  function isLoggedIn() {
    var v = getVisitor();
    return !!(v.nick && v.email);
  }
  function logout() {
    try {
      var lv = getVisitor();
      if (lv.nick || lv.email) logAction('退出', '账号退出: ' + (lv.nick || lv.email));
      sessionStorage.removeItem(QW_NICK); sessionStorage.removeItem(QW_EMAIL);
      localStorage.removeItem(QW_NICK); localStorage.removeItem(QW_EMAIL);
      localStorage.setItem(QW_AUTO, '0');
    } catch (e) {}
    refreshLoginUI();
  }
  function markLiked() {
    var myEmail = (getVisitor().email || '').trim().toLowerCase();
    var loggedIn = isLoggedIn();
    document.querySelectorAll('.qw-body #twikoo .tk-comment').forEach(function (c) {
      var id = c.id || '';
      var links = c.querySelectorAll('.tk-action-link');
      if (!links.length) return;
      // 未登录：隐藏全部操作按钮（赞/踩/回复/删除/编辑），防止游客刷赞/踩和误触管理
      if (!loggedIn) {
        for (var li = 0; li < links.length; li++) {
          try { links[li].style.setProperty('display', 'none', 'important'); } catch (eD) { links[li].style.display = 'none'; }
        }
        return;
      }
      // 登录后先清除游客态可能遗留的 display:none!important 内联样式，恢复 CSS 显示
      for (var li0 = 0; li0 < links.length; li0++) {
        try { links[li0].style.removeProperty('display'); } catch (eC) { links[li0].style.display = ''; }
      }
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
          if (isMine) {
            try { links[li].style.removeProperty('display'); } catch (eR2) { links[li].style.display = ''; }
          } else {
            try { links[li].style.setProperty('display', 'none', 'important'); } catch (eD2) { links[li].style.display = 'none'; }
          }
        }
      } catch (eHide) {}
    });
  }
  function openLogin() {
    var bd = document.getElementById('qw-login-backdrop');
    if (!bd) return;
    var v = getVisitor();
    setLoginMode('login');
    var accts = savedAccounts();
    if (accts.length) {
      showLoginView('accounts');
      renderAccounts();
    } else {
      showLoginView('form');
      setLoginTab(loginTab);
      document.getElementById('qw-login-email').value = loginTab === 'nick' ? (v.nick || '') : (v.email || '');
      var pwdEl = document.getElementById('qw-login-pwd');
      if (pwdEl) pwdEl.value = localStorage.getItem('qw_user_pwd') || '';
      var rm = document.getElementById('qw-remember');
      if (rm) rm.checked = !!localStorage.getItem('qw_user_pwd');
      var au = document.getElementById('qw-auto-login');
      if (au) au.checked = localStorage.getItem(QW_AUTO) === '1';
    }
    bd.classList.add('qw-open');
    setTimeout(function(){ var e = document.querySelector('#qw-login-view-form .qw-login-field input'); if (e) e.focus(); }, 100);
  }
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
    renderAccountAvatar(document.querySelector('#qw-settings-modal .qw-login-logo'), v.nick, v.email);
    setTab('nick');
    settingsModal.classList.add('qw-open');
  }
  function recordLikeSideChannel(commentId) {
    var v = getVisitor();
    if (!v.email || !commentId) return;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'COMMENT_LIKE', commentId: commentId, email: v.email })
    }).catch(function(){});
  }
  function refreshLoginUI() {
    var mask = document.getElementById('qw-login-mask');
    var panel = document.querySelector('.qw-panel');
    if (!mask) return;
    if (isLoggedIn()) {
      mask.classList.remove('qw-needs-login');
      if (panel) panel.classList.add('qw-logged-in');
      applyVisitorToTwikoo();
      hideMetaInput(true);
    } else {
      mask.classList.add('qw-needs-login');
      if (panel) panel.classList.remove('qw-logged-in');
      hideMetaInput(false);
    }
    try { markLiked(); } catch (eM) {}
  }
  // 已登录时只留发言框：隐藏昵称/邮箱输入行（JS 强制，CSS 双保险）
  function hideMetaInput(hide) {
    var mi = document.querySelector('.qw-body #twikoo .tk-meta-input');
    if (mi) mi.style.display = hide ? 'none' : '';
  }
  function saveSets() {
      try { localStorage.setItem(LK, JSON.stringify(likedSet)); } catch (e2) {}
      try { localStorage.setItem(DK, JSON.stringify(dislikedSet)); } catch (e2) {}
    }
  function setBtnLoading(btn, text) { btn.disabled = true; btn.textContent = text; }
  function setBtnRestore(btn, text) { btn.disabled = false; btn.textContent = text; }
  var loginMode = 'login'; // 'login' or 'register'
  function qwPwdOk(pw) {
    if (!pw || pw.length < 8) return false;
    var hasDigit = /\d/.test(pw);
    var hasLetter = /[A-Za-z]/.test(pw);
    var hasSym = /[^A-Za-z0-9]/.test(pw);
    return (hasDigit && hasLetter) || (hasDigit && hasSym) || (hasLetter && hasSym);
  }
  function setLoginMode(mode) {
    loginMode = mode;
    var nickEl = document.getElementById('qw-login-nick');
    var nickField = document.getElementById('qw-nick-field');
    var titleEl = document.getElementById('qw-login-title');
    var subEl = document.getElementById('qw-login-sub');
    var btnEl = document.getElementById('qw-login-submit');
    var toggleEl = document.getElementById('qw-login-toggle');
    var tabNick = document.getElementById('qw-tab-nick');
    var tabEmail = document.getElementById('qw-tab-email');
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
      if (tabNick) tabNick.classList.remove('qw-active');
      if (tabEmail) tabEmail.classList.add('qw-active');
      var forgot = document.getElementById('qw-login-forgot');
      if (forgot) forgot.style.display = 'none';
    } else {
      if (nickEl) nickEl.style.display = 'none';
      if (nickField) nickField.style.display = 'none';
      var codeRow2 = document.getElementById('qw-code-row');
      if (codeRow2) codeRow2.style.display = 'none';
      titleEl.textContent = '登录发言';
      subEl.textContent = '输入昵称和密码登录';
      btnEl.textContent = '登 录';
      if (toggleEl) toggleEl.innerHTML = '<span>没有账号？</span><b id="qw-toggle-link">点击注册</b>';
      setLoginTab(loginTab);
    }
    var msgEl = document.getElementById('qw-login-msg');
    if (msgEl) { msgEl.textContent = ''; msgEl.classList.remove('qw-ok'); }
  }
  function setNativeValue(input, value) {
    if (!input) return;
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value', input);
    if (setter && setter.set) setter.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
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
  function setTwikooField(sel, val) {
    var el = document.querySelector(sel);
    if (!el || !val) return;
    var proto = Object.getPrototypeOf(el);
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
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
  function showSetMsg(text, ok) {
    setMsg.textContent = text;
    setMsg.className = 'qw-login-msg' + (ok ? ' qw-ok' : '');
  }


})();
