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
    '.qw-admin-btn{margin-left:auto;padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-admin-btn:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-admin-btn.qw-admin-on{color:#e8a33d;}',
    '.qw-close{margin-left:0;padding:8px;color:var(--jp-muted);font-size:15px;cursor:pointer;border-radius:8px;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,color .2s ease;}',
    '.qw-close:hover{background:var(--jp-glow);color:var(--jp-ink);}',
    '.qw-notice{font-size:10px;color:var(--jp-muted);padding:12px 20px;background:var(--jp-glow);}',
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
    '.qw-body #twikoo .tk-send{background:linear-gradient(120deg,#087fae,#4866db)!important;color:#fff!important;border-radius:7px!important;font-size:11px!important;padding:10px 14px!important;display:flex;align-items:center;gap:7px;border:none!important;}',
    '.qw-body #twikoo .tk-send:disabled{opacity:.45!important;cursor:not-allowed!important;}',
    /* 微信风回复预览条（点回复后输入框上方显示"回复 XX：..."） */
    '.qw-body #twikoo [class*=comment-parent]{display:flex!important;align-items:center;gap:6px;background:var(--jp-paper)!important;border:1px solid var(--jp-line)!important;border-radius:8px!important;padding:6px 10px!important;margin-bottom:8px!important;font-size:11px!important;color:var(--jp-muted)!important;}',
    '.qw-body #twikoo [class*=comment-parent] [class*=nick]{color:var(--jp-accent)!important;font-weight:600;}',
    '.qw-body #twikoo [class*=comment-parent] [class*=cancel],.qw-body #twikoo [class*=comment-parent] button{cursor:pointer;color:var(--jp-muted)!important;margin-left:auto;padding:0 4px!important;border:none!important;background:transparent!important;font-size:14px!important;line-height:1;}',
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
    '.qw-login-backdrop{position:fixed;inset:0;z-index:200;background:rgba(1,6,17,.6);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:20px;}',
    '.qw-login-backdrop.qw-open{display:flex;}',
    '.qw-login-panel{width:320px;max-width:100%;background:var(--jp-surface);border:1px solid var(--jp-line);border-radius:14px;padding:20px;box-shadow:0 12px 40px rgba(0,0,0,.4);}',
    '.qw-login-panel h3{margin:0 0 4px;font-size:15px;color:var(--jp-ink);}',
    '.qw-login-panel p{margin:0 0 14px;font-size:11px;color:var(--jp-muted);}',
    '.qw-login-panel input{width:100%;box-sizing:border-box;border:1px solid var(--jp-line);background:var(--jp-paper);color:var(--jp-ink);border-radius:8px;padding:9px 11px;font-size:12px;margin-bottom:9px;outline:none;}',
    '.qw-login-panel input:focus{border-color:var(--jp-accent);}',
    '.qw-login-panel button{width:100%;padding:10px;border:none;border-radius:8px;background:linear-gradient(120deg,#087fae,#4866db);color:#fff;font-size:12px;font-weight:600;cursor:pointer;}',
    /* 未登录：底部登录条（qiguangji 风格） */
    '.qw-login-bar{display:none;align-items:center;justify-content:space-between;gap:12px;padding:14px 4px;border-top:1px solid var(--jp-line);}',
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
    '.qw-body #twikoo .tk-comment .tk-avatar{width:38px!important;height:38px!important;border-radius:50%!important;overflow:hidden!important;flex-shrink:0;margin:0!important;background:var(--jp-glow);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--jp-accent);}',
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
    '.qw-body #twikoo .qw-quote{background:rgba(128,142,168,.08)!important;border-left:2px solid var(--jp-line)!important;border-radius:3px!important;padding:3px 8px!important;font-size:11px!important;line-height:1.5!important;color:var(--jp-muted)!important;margin:0 0 5px!important;display:-webkit-box!important;-webkit-line-clamp:1!important;-webkit-box-orient:vertical!important;overflow:hidden!important;white-space:normal!important;text-align:left!important;}',
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
    '.qw-admin-body{padding:18px 20px 20px;overflow-y:auto;flex:1;min-height:0;}',
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
    '.qw-admin-logout{margin:16px auto 0;display:block;border:none;background:none;color:var(--jp-muted);font-size:11px;cursor:pointer;text-decoration:underline;padding:6px 12px;}',
    '.qw-admin-logout:hover{color:#e05b5b;}',
    '.qw-admin-loading{text-align:center;color:var(--jp-muted);font-size:12px;padding:26px 0;}',
    '@media(max-width:640px){.qw-admin-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-admin-body{padding:14px 15px 16px;}}',
    '@media(max-width:640px){.qw-launcher{right:14px;bottom:16px;padding:11px 14px;}.qw-backdrop{padding:12px;}.qw-panel{max-height:calc(100dvh - 24px);border-radius:16px;}.qw-panel>header{padding:15px 16px;}.qw-body{padding:0 15px 14px;}.qw-notice{padding:10px 16px;font-size:9px;}.qw-body #twikoo .tk-comment .tk-avatar{width:32px!important;height:32px!important;}.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 42px)!important;}.qw-body #twikoo .tk-children{margin-left:42px!important;}}',
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
    '<button id="qw-admin-btn" class="qw-admin-btn" aria-label="管理员" title="管理员登录"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
    '<button class="qw-close" aria-label="关闭聊天室" title="关闭"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<p class="qw-notice">庆庆纸博客公共频道 · 可自由浏览，登录后即可发言。</p>' +
    '<div class="qw-login-mask" id="qw-login-mask">' +
    '<div class="qw-body"><div id="tcomment"></div><button id="qw-comment-btn" class="qw-comment-btn" aria-label="写评论"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>写评论…</button></div>' +
    '<div class="qw-login-bar"><div class="qw-lb-text"><h4>身份验证</h4><p>昵称和头像使用你的邮箱公开资料</p></div><div class="qw-lb-right"><p>登录后才可以发送消息</p><button class="qw-lb-btn" id="qw-login-bar-btn">登 录</button></div></div></div>' +
    '</div></div>' +
    /* 访客登录弹窗 */
    '<div id="qw-login-backdrop" class="qw-login-backdrop">' +
    '<div class="qw-login-panel">' +
    '<h3>登录发言</h3><p>填昵称和邮箱即可加入聊天，下次自动登录</p>' +
    '<input type="text" id="qw-login-nick" placeholder="昵称（怎么称呼你）" maxlength="20">' +
    '<input type="email" id="qw-login-email" placeholder="邮箱（仅用于身份识别，不公开）">' +
    '<button id="qw-login-submit">登 录</button>' +
    '</div></div>' +
    /* 自绘管理员面板 */
    '<div id="qw-admin-backdrop" class="qw-admin-backdrop">' +
    '<div class="qw-admin-panel" role="dialog" aria-modal="true" aria-labelledby="qw-admin-title">' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
    '<div><h2 id="qw-admin-title">聊天管理</h2><p>管理员 · 删除消息 / 拉黑邮箱</p></div>' +
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
      twikoo.init({
        envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo',
        el: '#tcomment',
        path: 'chat',
        lang: 'zh-CN',
        requiredMeta: ['nick', 'mail'],
        onCommentLoaded: function () { scheduleMark(); }
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
  function markSelf() {
    var info = {};
    try { info = JSON.parse(localStorage.getItem('twikoo') || '{}'); } catch (e) {}
    var myNick = (info.nick || '').trim();
    var list = document.querySelectorAll('.qw-body #twikoo .tk-comment');
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var nickEl = c.querySelector('.tk-nick');
      var nick = nickEl ? nickEl.textContent.trim() : '';
      if (myNick && nick === myNick) c.classList.add('tk-self');
      else c.classList.remove('tk-self');
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
      var steps = [removeOwO, removeSubmitExtras, setSubmitPlaceholders, moveNickTop,
        moveActionBelow, restructureReplies, sortComments, insertTimeSep, markSelf];
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
  }

  function openChat() {
    backdrop.classList.add('qw-open');
    document.body.style.overflow = 'hidden';
    loadAssets(function () {
      initTwikoo();
      setTimeout(refreshLoginUI, 400);
    });
  }

  function closeChat() {
    backdrop.classList.remove('qw-open');
    document.body.style.overflow = '';
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
  var loginClose = document.querySelector('#qw-login-backdrop .qw-login-panel');
  if (loginClose) loginClose.addEventListener('click', function (e) { e.stopPropagation(); });
  document.getElementById('qw-login-backdrop').addEventListener('click', closeLogin);
  closeBtn.addEventListener('click', closeChat);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeChat(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(); });

  // ===== 管理员面板（自绘：登录 → 评论管理 / 删除 / 拉黑邮箱） =====
  var adminBtn = document.getElementById('qw-admin-btn');
  var adminBackdrop = document.getElementById('qw-admin-backdrop');
  var adminBody = document.getElementById('qw-admin-body');
  var adminToken = '';
  var TWIKOO_API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';

  function adminPost(data) {
    return fetch(TWIKOO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  function openAdmin() {
    adminBackdrop.classList.add('qw-open');
    document.body.style.overflow = 'hidden';
    adminToken = '';
    try { adminToken = localStorage.getItem('qw_admin_token') || ''; } catch (e) {}
    if (adminToken) {
      adminBtn.classList.add('qw-admin-on');
      renderManageView();
    } else {
      adminBtn.classList.remove('qw-admin-on');
      renderLoginView();
    }
  }
  function closeAdmin() {
    adminBackdrop.classList.remove('qw-open');
    if (!backdrop.classList.contains('qw-open')) document.body.style.overflow = '';
  }
  adminBackdrop.addEventListener('click', function (e) { if (e.target === adminBackdrop) closeAdmin(); });
  adminBackdrop.querySelector('[data-qw-admin-close]').addEventListener('click', closeAdmin);

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
    adminBody.innerHTML = '<div class="qw-admin-loading">加载评论数据…</div>';
    var blocks = [];
    var likeMap = {};
    adminPost({ event: 'QW_LIKE_LIST', accessToken: adminToken }).then(function (lr) {
      if (lr && lr.code === 0) {
        (lr.data || []).forEach(function (x) { likeMap[x.commentId] = x.ips || []; });
      }
      return adminPost({ event: 'QW_BLOCK_LIST', accessToken: adminToken });
    }).then(function (r) {
      if (r && r.code === 0) blocks = r.data || [];
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
      seq.then(function () { renderManageList(all, blocks, likeMap); });
    }).catch(function () {
      adminBody.innerHTML = '<div class="qw-admin-loading">网络异常，加载失败</div>';
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

  function renderManageList(comments, blocks, likeMap) {
    var root = comments.filter(function (c) { return !c.rid; });
    var html = '';
    html += '<div class="qw-admin-stats">' +
      '<div><b>' + (comments.length || 0) + '</b><span>全部评论</span></div>' +
      '<div><b>' + (root.length || 0) + '</b><span>根评论</span></div>' +
      '<div><b>' + (blocks.length || 0) + '</b><span>已拉黑邮箱</span></div>' +
      '</div>';
    html += '<div class="qw-admin-list">';
    if (!comments.length) {
      html += '<div class="qw-admin-empty">暂无评论</div>';
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
          '<div class="qw-ops">' +
          '<button class="qw-del" data-act="del" data-id="' + c._id + '">删除</button>' +
          (c.mail ? '<button class="qw-blk" data-act="blk" data-mail="' + escAttr(c.mail) + '">拉黑邮箱</button>' : '') +
          '</div></div>';
      }
    }
    html += '</div>';
    html += '<div class="qw-admin-blocks"><h4>已拉黑邮箱（拉黑后无法发言）</h4>';
    if (!blocks.length) {
      html += '<div class="qw-admin-empty" style="padding:10px 0">暂无拉黑</div>';
    } else {
      for (var b = 0; b < blocks.length; b++) {
        var bk = typeof blocks[b] === 'string' ? { mail: blocks[b], ip: '' } : (blocks[b] || {});
        var bkLabel = bk.mail + (bk.ip ? '（IP ' + bk.ip + '）' : '');
        html += '<div class="qw-blk-item"><span>' + escHtml(bkLabel) + '</span><button data-act="unblk" data-mail="' + escAttr(bk.mail) + '">解除</button></div>';
      }
    }
    html += '</div>';
    html += '<button class="qw-admin-logout" data-act="logout">退出登录</button>';
    adminBody.innerHTML = html;

    adminBody.querySelectorAll('.qw-admin-item .qw-ops button, .qw-admin-blocks button, .qw-admin-logout').forEach(function (btn) {
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
          if (confirm('确定拉黑 ' + mail + ' 吗？\n将删除该邮箱的全部历史评论，并同步拦截其登录 IP（换邮箱也无法发言）。')) {
            adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: mail }).then(function (r) {
              if (r && r.code === 0) {
                alert((r.message) || '已拉黑');
                renderManageView();
              } else alert((r && r.message) || '拉黑失败');
            });
          }
        } else if (act === 'unblk') {
          var umail = btn.getAttribute('data-mail');
          if (confirm('确定解除拉黑 ' + umail + ' 吗？')) {
            adminPost({ event: 'QW_BLOCK_DELETE', accessToken: adminToken, mail: umail }).then(function (r) {
              if (r && r.code === 0) renderManageView();
              else alert((r && r.message) || '操作失败');
            });
          }
        } else if (act === 'logout') {
          try { localStorage.removeItem('qw_admin_token'); } catch (e) {}
          adminToken = '';
          adminBtn.classList.remove('qw-admin-on');
          renderLoginView();
        }
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
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAdmin(); });

  // 赞/踩操作：赞与踩互斥自动切换（已赞点踩=取消赞变踩，反之亦然）；再点同一个=取消；持久高亮
  document.addEventListener('click', function (e) {
    if (qwProgrammatic) return; // 编程触发：只交给 Twikoo 处理，不再改本地状态
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
    if (isReply) {
      var nickEl = comment.querySelector('.tk-nick');
      var nick = nickEl ? nickEl.textContent.trim() : '';
      var contentEl = comment.querySelector('.tk-content, .tk-row-content');
      var content = contentEl ? contentEl.textContent.trim().slice(0, 40) : '';
      showReplyBar(nick, content);
      return;
    }
    if (!isLike && !isDislike) return; // 赞/踩之外的其他按钮不处理
    function block(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    }
    function saveSets() {
      try { localStorage.setItem(LK, JSON.stringify(likedSet)); } catch (e2) {}
      try { localStorage.setItem(DK, JSON.stringify(dislikedSet)); } catch (e2) {}
    }
    // 互斥：已赞时点踩 / 已踩时点赞 = 静默拦截（不提示）；再点同一个 = 取消
    if (isLike && dislikedSet[id]) { block(e); return; }
    if (isDislike && likedSet[id]) { block(e); return; }
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
    if (!mask) return;
    if (isLoggedIn()) {
      mask.classList.remove('qw-needs-login');
      applyVisitorToTwikoo();
    } else {
      mask.classList.add('qw-needs-login');
    }
  }
  function openLogin() {
    var bd = document.getElementById('qw-login-backdrop');
    if (!bd) return;
    var v = getVisitor();
    document.getElementById('qw-login-nick').value = v.nick;
    document.getElementById('qw-login-email').value = v.email;
    bd.classList.add('qw-open');
    setTimeout(function(){ document.getElementById('qw-login-nick').focus(); }, 100);
  }
  function closeLogin() {
    document.getElementById('qw-login-backdrop').classList.remove('qw-open');
  }
  function doLogin() {
    var nick = document.getElementById('qw-login-nick').value.trim();
    var email = document.getElementById('qw-login-email').value.trim();
    if (!nick) { document.getElementById('qw-login-nick').focus(); return; }
    if (!email || email.indexOf('@') < 0) { document.getElementById('qw-login-email').focus(); return; }
    try {
      localStorage.setItem(QW_NICK, nick);
      localStorage.setItem(QW_EMAIL, email);
    } catch (e) {}
    closeLogin();
    refreshLoginUI();
    alert('欢迎，' + nick);
  }
  function logout() {
    try { localStorage.removeItem(QW_NICK); localStorage.removeItem(QW_EMAIL); } catch (e) {}
    refreshLoginUI();
  }

  function markLiked() {
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
    });
  }

  var DK = 'qw_disliked_v1';
  var dislikedSet = {};
  try { dislikedSet = JSON.parse(localStorage.getItem(DK) || '{}'); } catch (e) { dislikedSet = {}; }

  // 外部可调用
  window.openChatRoom = openChat;
  window.closeChatRoom = closeChat;
})();
