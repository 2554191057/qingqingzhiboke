/* =============================================
   搴嗗簡绾稿崥瀹?路 鍏ㄧ珯鎮诞鑱婂ぉ瀹わ紙qiguangji ChatRoom 椋庢牸 路 Twikoo 鍚庣锛?   鍙充笅瑙掓偓娴寜閽?鈫?鐐瑰嚮寮瑰嚭 460px 灞呬腑闈㈡澘锛涘叧闂悗鍥炲埌鍘熼〉闈紝涓嶈烦杞€?   寮曠敤鏂瑰紡锛?script src="chat-widget.js?v=1"></script>锛堟斁鍦?script.js 涔嬪悗锛?   ============================================= */
(function () {
  'use strict';
  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  var CSS = [
    '/* ===== 鎮诞鑱婂ぉ瀹わ紙qiguangji 涓婚鑹叉澘锛?===== */',
    ':root { --jp-paper:#edf2fa; --jp-surface:rgba(255,255,255,.94); --jp-ink:#182641; --jp-muted:#62728e; --jp-line:#cedaed; --jp-accent:#087fa8; --jp-blue:#4c67eb; --jp-glow:rgba(16,147,195,.14); }',
    '[data-theme="dark"] { --jp-paper:#080e1c; --jp-surface:rgba(15,24,43,.96); --jp-ink:#e5edff; --jp-muted:#8a9dbd; --jp-line:#23324f; --jp-accent:#50d3f6; --jp-blue:#8291ff; --jp-glow:rgba(63,199,249,.12); }',
    '/* 鍙充笅瑙掓偓娴寜閽?*/',
    '.qw-launcher{position:fixed;z-index:45;right:22px;bottom:340px;display:flex;gap:9px;align-items:center;border:1px solid var(--jp-accent);padding:12px 17px;background:var(--jp-surface);border-radius:10px;box-shadow:0 0 30px var(--jp-glow),0 8px 24px rgba(0,0,0,.18);font-size:12px;color:var(--jp-accent);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}',
    '.qw-launcher:hover{transform:translateY(-3px);box-shadow:0 0 40px var(--jp-glow),0 12px 30px rgba(0,0,0,.22);}',
    '.qw-launcher svg{flex-shrink:0;}',
    '.qw-launcher .qw-dot{width:5px;height:5px;border-radius:50%;background:#3ecf6a;box-shadow:0 0 6px rgba(62,207,106,.7);}',
    '/* 閬僵 + 闈㈡澘 */',
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
    '/* ===== Twikoo 鈫?qiguangji 瑕嗙洊 ===== */',
    '/* 娑堟伅娴佸湪涓娿€佽緭鍏ュ尯鍦ㄥ簳閮紙qiguangji 鑱婂ぉ瀹ら『搴忥級 */',
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
    /* 搴曢儴杈撳叆鍖猴細甯告樉鑱婂ぉ妗嗭紙鍘?鍐欒瘎璁?鎶樺彔鎸夐挳宸茬Щ闄わ級 */
    '.qw-comment-btn{display:none!important;}',
    /* 鑱婂ぉ妗嗗竷灞€锛氭樀绉?閭涓€琛?+ 杈撳叆妗?+ 鍙戦€侊紙绱у噾锛?*/
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
    /* Twikoo 鍘熺敓鍥炲鎻愮ず鏉￠殣钘忥紙鐢ㄨ嚜缁?.qw-reply-bar 鏇夸唬锛?*/
    '.qw-body #twikoo [class*=comment-parent]{display:none!important;}',
    /* 寰俊椋庯細鍙戦€佹寜閽笌杈撳叆妗嗗悓琛屽彸渚?*/
    '.qw-body #twikoo .tk-row-actions-start{display:flex!important;justify-content:flex-end!important;margin-top:6px!important;}',
    /* 鑷粯寰俊椋庡洖澶嶉瑙堟潯 */
    '.qw-reply-bar{display:flex;align-items:center;gap:8px;background:var(--jp-paper)!important;border:1px solid var(--jp-line)!important;border-radius:8px;padding:6px 10px;margin:0 0 8px;font-size:11px;color:var(--jp-muted);}',
    '.qw-reply-bar .qw-reply-nick{color:var(--jp-accent)!important;font-weight:600;flex-shrink:0;}',
    '.qw-reply-bar .qw-reply-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.qw-reply-bar .qw-reply-cancel{cursor:pointer;color:var(--jp-muted);flex-shrink:0;padding:0 4px;font-size:14px;line-height:1;}',
    '.qw-reply-bar .qw-reply-cancel:hover{color:var(--jp-ink);}',
    /* 璁垮鐧诲綍锛歨eader 鐧诲綍鎸夐挳 */
    '.qw-login-btn{background:transparent;border:1px solid var(--jp-line);color:var(--jp-muted);border-radius:7px;padding:5px 11px;font-size:11px;cursor:pointer;transition:all .15s ease;}',
    '.qw-login-btn:hover{border-color:var(--jp-accent);color:var(--jp-accent);}',
    '.qw-login-btn.qw-logged-in{color:var(--jp-accent);border-color:var(--jp-accent);font-weight:600;}',
    /* 鐧诲綍寮圭獥 */
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
    /* 鏈櫥褰曪細搴曢儴鐧诲綍鏉★紙qiguangji 椋庢牸锛?*/
    '.qw-login-bar{display:none;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid var(--jp-line);flex-shrink:0;}',
    '.qw-login-mask.qw-needs-login .qw-login-bar{display:flex;}',
    '.qw-login-mask.qw-needs-login .qw-body #twikoo .tk-submit{display:none!important;}',
    '.qw-login-bar .qw-lb-text h4{margin:0 0 3px;font-size:13px;color:var(--jp-ink);font-weight:700;}',
    '.qw-login-bar .qw-lb-text p{margin:0;font-size:10px;color:var(--jp-muted);}',
    '.qw-login-bar .qw-lb-btn{background:linear-gradient(120deg,#087fae,#4866db);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;}',
    '.qw-login-bar .qw-lb-btn:hover{opacity:.92;}',
    '.qw-login-bar .qw-lb-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}',
    '.qw-login-bar .qw-lb-right p{margin:0;font-size:10px;color:var(--jp-muted);}',
    /* ===== 鑱婂ぉ姘旀场甯冨眬锛氳嚜宸卞彸渚с€佸埆浜哄乏渚?===== */
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
    /* ===== 鏄电О绉诲埌姘旀场宸︿笂鏂?===== */
    '.qw-body #twikoo .tk-comment{flex-wrap:nowrap!important;}',
    '.qw-body #twikoo .tk-comment .tk-nick{display:block!important;margin:0 0 3px!important;padding:0 4px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-nick{text-align:right!important;}',
    '.qw-body #twikoo .tk-nick strong{color:var(--jp-accent)!important;font-weight:700!important;font-size:12.5px!important;}',
    '.qw-body #twikoo .tk-comment .tk-row .tk-nick,.qw-body #twikoo .tk-comment .tk-row-head .tk-nick,.qw-body #twikoo .tk-comment .tk-head .tk-nick{display:none!important;}',
    '.qw-body #twikoo .tk-comment .tk-row .tk-mail,.qw-body #twikoo .tk-comment .tk-row-head .tk-mail{display:inline!important;}',
    /* 鏄电О/鎿嶄綔绉昏蛋鍚庯紝澶撮儴琛屽彧浣欓殣钘忔椂闂达紝鐩存帴闅愯棌 */
    '.qw-body #twikoo .tk-comment .tk-row{display:none!important;}',
    /* ===== 姘旀场锛氳嚜閫傚簲瀹藉害 + 灏忓熬宸磋鏍囷紝涓庡ご鍍忓钩榻?===== */
    '.qw-body #twikoo .tk-content{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--jp-surface)!important;border:1px solid var(--jp-line)!important;border-radius:12px 12px 12px 4px!important;padding:7px 12px!important;font-size:12px!important;line-height:1.55!important;margin:0!important;box-shadow:0 1px 2px rgba(16,40,80,.06)!important;width:fit-content!important;max-width:100%!important;min-width:0!important;position:relative!important;}',
    '.qw-body #twikoo .tk-content:before{content:""!important;position:absolute!important;top:12px!important;left:-6px!important;border:6px solid transparent!important;border-left-width:0!important;border-right-color:var(--jp-surface)!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content{background:linear-gradient(120deg,rgba(16,147,195,.16),rgba(72,102,219,.14))!important;border-color:rgba(16,147,195,.28)!important;border-radius:12px 12px 4px 12px!important;}',
    '.qw-body #twikoo .tk-comment.tk-self>.tk-main>.tk-content:before{left:auto!important;right:-6px!important;border-right-width:0!important;border-left-width:6px!important;border-right-color:transparent!important;border-left-color:rgba(16,147,195,.16)!important;}',
    /* ===== 鎿嶄綔鎸夐挳锛氱Щ鍒版皵娉′笅鏂规í鎺掞紙甯告樉闀挎潯锛?===== */
    '.qw-body #twikoo .tk-action{margin-left:0!important;display:flex!important;gap:16px!important;align-items:center!important;padding:5px 8px 0!important;opacity:1!important;}',
    /* 宸茬偣璧為珮浜紙鏈湴璁板綍锛屾湇鍔＄ liked 鐘舵€佷笉鍙敤锛?*/
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
    /* ===== 寰俊鑱婂ぉ娴侊細闅愯棌璇勮鍖哄厓绱狅紙缁熻/鎺掑簭/璁惧/footer锛?===== */
    '.qw-body #twikoo .tk-comments-title,.qw-body #twikoo .tk-action-bar,.qw-body #twikoo .tk-comments-switch,.qw-body #twikoo .tk-extra,.qw-body #twikoo .tk-extras,.qw-body #twikoo .tk-footer{display:none!important;}',
    '.qw-body #twikoo .tk-comments-container{padding-top:6px!important;}',
    /* 鏃堕棿鐢ㄥ眳涓椂闂存潯鏄剧ず锛堝井淇″紡锛夛紝闅愯棌姣忔潯灏忔椂闂?*/
    '.qw-body #twikoo .tk-time{display:none!important;}',
    '.qw-body #twikoo .qw-time-sep{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:10px 0 6px!important;opacity:.8!important;letter-spacing:.5px!important;}',
    /* 姘旀场锛堢揣鍑戯級 */
    '.qw-body #twikoo .tk-comment{margin-bottom:7px!important;}',
    '.qw-body #twikoo .tk-comment .tk-avatar{width:38px!important;height:38px!important;font-size:17px!important;}',
    '.qw-body #twikoo .tk-comment .tk-main{max-width:calc(100% - 48px)!important;}',
    /* ===== QQ寮忓紩鐢ㄥ洖澶嶏細姘旀场鍐呭紩鐢ㄦ爮锛堢粏娣＄伆鏉★級 ===== */
    '.qw-body #twikoo .qw-quote{background:rgba(128,142,168,.1)!important;border-left:3px solid var(--jp-accent)!important;border-radius:4px!important;padding:4px 9px!important;font-size:11px!important;line-height:1.5!important;color:var(--jp-muted)!important;margin:0 0 5px!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;white-space:normal!important;text-align:left!important;opacity:.85;}',
    '.qw-body #twikoo .tk-replies,.qw-body #twikoo .tk-children{display:none!important;}',
    '.qw-body #twikoo .tk-expand-wrap,.qw-body #twikoo .tk-expand{display:none!important;}',
    '.qw-body #twikoo .tk-footer{text-align:center!important;font-size:10px!important;color:var(--jp-muted)!important;padding:12px 0 0!important;background:transparent!important;}',
    '.qw-body #twikoo .tk-footer a,.qw-body #twikoo .tk-footer .tk-action-link{color:var(--jp-muted)!important;}',
    /* Twikoo 绠＄悊鎶藉眽锛堥殣钘忥紝鏀圭敤鑷粯绠＄悊闈㈡澘锛?*/
    '.qw-body #twikoo .tk-admin-container{display:none!important;}',
    /* ===== 鑷粯绠＄悊鍛橀潰鏉匡紙姣涚幓鐠?路 鏃ュ鑷€傚簲锛?===== */
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
    /* 鑱婂ぉ瀹ょ櫥褰曢伄缃?*/
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
    '<button id="qw-launcher" class="qw-launcher" aria-label="鎵撳紑鑱婂ぉ瀹? title="鑱婂ぉ瀹?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>' +
    '<span>鑱婂ぉ瀹?/span><i class="qw-dot"></i></button>' +
    '<div id="qw-backdrop" class="qw-backdrop">' +
    '<div class="qw-panel" role="dialog" aria-modal="true" aria-labelledby="qw-title">' +
'<div class="qw-resize-handle" id="qw-resize-handle"></div>' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>' +
    '<div><h2 id="qw-title">鑱婂ぉ瀹?/h2><p><span class="qw-dot"></span>瀹炴椂鍚屾 路 Powered by Twikoo</p></div>' +

    '<button class="qw-admin-btn" id="qw-admin-trigger" aria-label="鑱婂ぉ鍚庡彴" title="鑱婂ぉ鍚庡彴"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>' +
    '<button class="qw-settings-btn" id="qw-settings-btn" title="璐﹀彿璁剧疆"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>' +
    '<button class="qw-logout-btn" id="qw-logout-btn" title="閫€鍑虹櫥褰?>閫€鍑?/button>' +
    '<button type="button" class="qw-icon-btn" id="qw-chat-refresh" aria-label="鍒锋柊鑱婂ぉ" title="鍒锋柊鑱婂ぉ"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>' +
    '<button class="qw-close" aria-label="鍏抽棴鑱婂ぉ瀹? title="鍏抽棴"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</header>' +
    '<p class="qw-notice">搴嗗簡绾稿崥瀹㈠叕鍏遍閬?路 鍙嚜鐢辨祻瑙堬紝鐧诲綍鍚庡嵆鍙彂瑷€銆?/p>' +
    '<div class="qw-login-mask" id="qw-login-mask">' +
    '<div class="qw-body"><div id="tcomment"></div><button id="qw-comment-btn" class="qw-comment-btn" aria-label="鍐欒瘎璁?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>鍐欒瘎璁衡€?/button></div>' +
    '<div class="qw-login-bar"><div class="qw-lb-text"><h4>韬唤楠岃瘉</h4><p>鏄电О鍜屽ご鍍忎娇鐢ㄤ綘鐨勯偖绠卞叕寮€璧勬枡</p></div><div class="qw-lb-right"><p>鐧诲綍鍚庢墠鍙互鍙戦€佹秷鎭?/p><button class="qw-lb-btn" id="qw-login-bar-btn">鐧?褰?/button></div></div></div>' +
    '</div></div>' +
    /* 璁垮鐧诲綍寮圭獥 */
    '<div id="qw-settings-modal" class="qw-login-backdrop">' +
    '<div class="qw-login-panel">' +
    '<div class="qw-login-head">' +
    '<div class="qw-login-logo"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>' +
    '<h3 id="qw-set-current-nick">璐﹀彿璁剧疆</h3><p id="qw-set-current-email">淇敼鏄电О銆佸瘑鐮佹垨閭</p>' +
    '</div>' +
    '<div class="qw-login-tabs">' +
    '<button type="button" class="qw-login-tab qw-active" id="qw-set-tab-nick" data-set="nick">鏀规樀绉?/button>' +
    '<button type="button" class="qw-login-tab" id="qw-set-tab-pwd" data-set="pwd">鏀瑰瘑鐮?/button>' +
    '<button type="button" class="qw-login-tab" id="qw-set-tab-email" data-set="email">鏀归偖绠?/button>' +
    '</div>' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-x" id="qw-settings-close-x" style="position:absolute;top:14px;right:16px;cursor:pointer;font-size:18px;line-height:1;color:var(--jp-muted);user-select:none;z-index:3;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease;">&times;</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-nick">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">涓€鍛ㄦ渶澶氭敼3娆★紝娆℃棩0鐐瑰悗鎵嶈兘鍐嶆敼锛涘垰鐢ㄨ繃鐨勬樀绉?绉掑悗灏辫兘鏀瑰洖</p>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><input type="text" id="qw-set-nick" placeholder="鏂版樀绉? maxlength="20" autocomplete="off"></div>' +
    '<button class="qw-submit" id="qw-set-nick-save" style="margin-top:6px">淇濆瓨鏄电О</button>' +
    '</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-pwd" style="display:none">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">涓€鍛ㄦ渶澶氭敼3娆★紝娆℃棩0鐐瑰悗鎵嶈兘鍐嶆敼</p>' +
    '<div class="qw-login-field" id="qw-pwd-old-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-pwd-old-pwd" placeholder="褰撳墠瀵嗙爜"></div>' +
    '<div class="qw-login-field" id="qw-pwd-code-field" style="display:none"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-pwd-code" placeholder="閭楠岃瘉鐮? style="flex:1"><button type="button" class="qw-send-code" id="qw-set-pwd-sendcode">鍙戠爜</button></div></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-new-pwd1" placeholder="鏂板瘑鐮侊紙鑷冲皯4浣嶏級"></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="qw-set-new-pwd2" placeholder="纭鏂板瘑鐮?></div>' +
    '<button class="qw-submit" id="qw-set-pwd-save" style="margin-top:6px">淇濆瓨瀵嗙爜</button>' +
    '<button type="button" id="qw-pwd-forgot" style="display:block;width:100%;margin-top:8px;border:none;background:none;color:var(--jp-accent);font-size:11px;cursor:pointer;text-decoration:underline;padding:4px 0;">蹇樿瀵嗙爜锛熼€氳繃閭楠岃瘉鐮侀噸缃?/button>' +
    '</div>' +
    '<div class="qw-set-pane" id="qw-set-pane-email" style="display:none">' +
    '<p style="font-size:11px;opacity:.6;margin:0 0 8px">涓€鍛ㄦ渶澶氭敼3娆★紝娆℃棩0鐐瑰悗鎵嶈兘鍐嶆敼锛涢渶楠岃瘉鏂版棫涓や釜閭</p>' +
    '<div class="qw-login-field" style="padding-left:0"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-email-oldcode" placeholder="鍘熼偖绠遍獙璇佺爜" style="flex:1"><button type="button" class="qw-send-code" id="qw-set-email-sendold">鍙戠爜</button></div></div>' +
    '<div class="qw-login-field"><span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><input type="email" id="qw-set-new-email" placeholder="鏂伴偖绠?></div>' +
    '<div class="qw-login-field" style="padding-left:0"><div style="display:flex;gap:6px;width:100%"><input type="text" id="qw-set-email-newcode" placeholder="鏂伴偖绠遍獙璇佺爜" style="flex:1"><button type="button" class="qw-send-code" id="qw-set-email-sendnew">鍙戠爜</button></div></div>' +
    '<button class="qw-submit" id="qw-set-email-save" style="margin-top:6px">淇濆瓨閭</button>' +
    '</div>' +
    '<p class="qw-login-msg" id="qw-set-msg"></p>' +
    '</div></div></div>' +
    '<div id="qw-login-backdrop" class="qw-login-backdrop">' +
    '<div class="qw-login-panel">' +
    '<div class="qw-login-head">' +
    '<div class="qw-login-logo"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg></div>' +
    '<h3 id="qw-login-title">鐧诲綍鍙戣█</h3><p id="qw-login-sub">杈撳叆閭鎴栨樀绉板拰瀵嗙爜鐧诲綍</p>' +
    '</div>' +
    '<div class="qw-login-tabs">' +
    '<button type="button" class="qw-login-tab qw-active" id="qw-tab-login" data-mode="login">鐧?褰?/button>' +
    '<button type="button" class="qw-login-tab" id="qw-tab-register" data-mode="register">娉?鍐?/button>' +
    '</div>' +
    '<div class="qw-login-body">' +
    '<div class="qw-login-x" id="qw-login-x" style="position:absolute;top:14px;right:16px;cursor:pointer;font-size:18px;line-height:1;color:var(--jp-muted);user-select:none;z-index:3;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s ease;">&times;</div>' +
    '<div class="qw-login-field" id="qw-nick-field" style="display:none">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>' +
    '<input type="text" id="qw-login-nick" placeholder="鏄电О锛堟€庝箞绉板懠浣狅級" maxlength="20">' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>' +
    '<input type="text" id="qw-login-email" placeholder="閭鎴栨樀绉?>' +
    '</div>' +
    '<div class="qw-login-code-row" id="qw-code-row">' +
    '<input type="text" id="qw-login-code" class="qw-c-input" placeholder="6浣嶉獙璇佺爜" maxlength="6">' +
    '<button id="qw-send-code" type="button" class="qw-send-code">鍙戦€侀獙璇佺爜</button>' +
    '</div>' +
    '<div class="qw-login-field">' +
    '<span class="qw-f-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' +
    '<input type="password" id="qw-login-pwd" placeholder="瀵嗙爜">' +
    '</div>' +
    '<button id="qw-login-submit" class="qw-submit">鐧?褰?/button>' +
    '<p id="qw-login-toggle" class="qw-login-toggle"><span>娌℃湁璐﹀彿锛?/span><b id="qw-toggle-link">鐐瑰嚮娉ㄥ唽</b></p>' +
    '<p id="qw-login-msg" class="qw-login-msg"></p>' +
    '</div>' +
    '</div></div>' +
    /* 鑷粯绠＄悊鍛橀潰鏉?*/
    '<div id="qw-admin-backdrop" class="qw-admin-backdrop">' +
    '<div class="qw-admin-panel" role="dialog" aria-modal="true" aria-labelledby="qw-admin-title">' +
    '<header>' +
    '<div class="qw-head-icon"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
    '<div><h2 id="qw-admin-title">鑱婂ぉ鍚庡彴</h2><p>绠＄悊鍛?路 鍒犻櫎娑堟伅 / 鎷夐粦閭</p></div>' +
    '<button type="button" class="qw-icon-btn" id="qw-admin-refresh" aria-label="鍒锋柊鏁版嵁" title="鍒锋柊鏁版嵁" style="margin-left:auto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>' +
    '<button class="qw-close" data-qw-admin-close aria-label="鍏抽棴" title="鍏抽棴"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
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
  // 澶村儚鍔犺浇澶辫触鏃舵樉绀烘樀绉伴瀛楁瘝
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
  // Twikoo 璇勮鍔犺浇鍚庢墽琛?  var _origOnCommentLoaded = window.twikoo && window.twikoo.onCommentLoaded;
      twikoo.init({
        envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo',
        el: '#tcomment',
        path: 'chat',
        lang: 'zh-CN',
        requiredMeta: ['nick', 'mail'],
        onCommentLoaded: function () { scheduleMark(); fixAvatars(); }
        ,onCommentSubmit: function (e) { try { logAction('鍙戣█', '鍐呭:' + String((e && e.comment) || '').slice(0, 50)); } catch (ex) {} }
      });
    } catch (e) { twikooInited = false; }
  }

  // ===== 绉婚櫎宸︿笅瑙掕〃鎯呮寜閽紙Twikoo OwO锛岀敤涓嶅埌鐩存帴鍒犳帀 DOM锛?=====
  function removeOwO() {
    document.querySelectorAll('.qw-body #twikoo .tk-submit-action-icon.OwO, .qw-body #twikoo .OwO-logo, .qw-body #twikoo .tk-submit .OwO').forEach(function (el) {
      el.remove();
    });
  }
  // ===== 绉婚櫎 M+锛圡arkdown 鎸夐挳锛夊拰"棰勮"鎸夐挳锛堢敤涓嶅埌鐩存帴鍒犳帀 DOM锛?=====
  function removeSubmitExtras() {
    document.querySelectorAll('.qw-body #twikoo .tk-submit-action-icon.__markdown, .qw-body #twikoo .tk-preview').forEach(function (el) {
      el.remove();
    });
  }
  // ===== 娣诲姞鍥剧墖涓婁紶鎸夐挳 =====
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
      if (file.size > 5 * 1024 * 1024) { alert('鍥剧墖涓嶈兘瓒呰繃5MB'); return; }
      var ta = submit.querySelector('textarea');
      var oldText = ta.value;
      var reader = new FileReader();
      reader.onload = function(e) {
        // 鐢?base64 鐩存帴鎻掑叆鍥剧墖锛堟棤鍚庣鍥惧簥渚濊禆锛?        var imgMd = '\n![鍥剧墖](' + e.target.result + ')\n';
        ta.value = oldText + imgMd;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });
    submit.insertBefore(btn, sendBtn);
  }
  // ===== 鎶婄偣璧?鍥炲绛夋搷浣滄寜閽粠澶撮儴琛岀Щ鍒版皵娉′笅鏂规í鎺?=====
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
  // ===== 鎶婃樀绉扮Щ鍒版皵娉″乏涓婃柟锛?tk-main 寮€澶达紝澶村儚鍙充晶绗竴琛岋級 =====
  function moveNickTop() {
    document.querySelectorAll('.qw-body #twikoo .tk-comment').forEach(function (c) {
      var nick = c.querySelector('.tk-nick');
      var main = c.querySelector(':scope > .tk-main');
      if (!nick || !main) return;
      if (nick.parentNode === main) return; // 宸茬Щ鍔?      main.insertBefore(nick, main.firstChild);
    });
  }
  // ===== 鑱婂ぉ姘旀场锛氳瘑鍒?鑷繁"鐨勬秷鎭紙瀵规瘮 localStorage 鏄电О锛夆啋 鍙充晶 =====
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
        badge.textContent = '绠＄悊鍛?;
        nickEl.appendChild(badge);
      }
    }
  }
  function renameEmpty() {
    var els = document.querySelectorAll('.qw-body #twikoo *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length === 0 && el.textContent.trim() === '娌℃湁璇勮') el.textContent = '鏆傛棤娑堟伅';
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
  // ===== QQ寮忓紩鐢ㄥ洖澶嶏細鎶婂祵濂楀瓙璇勮閲嶇粍涓?鐙珛姘旀场 + 姘旀场鍐呭紩鐢ㄥ潡" =====
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
        // 绉诲嚭宓屽鍒楄〃 鈫?鐖惰瘎璁哄悗闈㈢殑鐙珛姘旀场
        parentComment.parentNode.insertBefore(reply, parentComment.nextSibling);
        // 姘旀场鍐呭椤堕儴鎻掑叆寮曠敤鍧楋紙琚紩鐢ㄤ汉鐨勬樀绉?+ 鍘熸枃锛?        var contentEl = reply.querySelector('.tk-content');
        if (contentEl && parentText) {
          var quote = document.createElement('div');
          quote.className = 'qw-quote';
          quote.textContent = (parentNick ? parentNick + '锛? : '') + parentText;
          contentEl.insertBefore(quote, contentEl.firstChild);
          // 鍒犻櫎 Twikoo 鑷姩鍔犵殑"鍥炲 @鏄电О : "鍓嶇紑锛堝紩鐢ㄥ潡宸茶鏄庯級
          var preSpans = contentEl.querySelectorAll(':scope > span');
          for (var k = 0; k < preSpans.length; k++) {
            if (preSpans[k].querySelector('.tk-ruser')) { preSpans[k].remove(); break; }
          }
        }
      }
      replies.style.display = 'none';
    }
  }
  // ===== 娑堟伅鏃堕棿姝ｅ簭锛堟棭鍙戣█鍦ㄤ笂锛? 鍏蜂綋鏃堕棿鏄剧ず =====
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
  // ===== 灞呬腑鏃堕棿鏉★紙寰俊寮忥級锛氱浉閭绘秷鎭棿闅旇秴杩?5 鍒嗛挓鏃舵彃鍏?=====
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
      // 姣忔闅旂锛氱偣璧?韪╁悗 Twikoo 灞€閮ㄩ噸娓叉煋鍙兘浜х敓涓嶅畬鏁?DOM锛屼换涓€姝ユ姤閿欎笉寰楅樆鏂珮浜仮澶?      var steps = [removeOwO, removeSubmitExtras, addImgButton, setSubmitPlaceholders, moveNickTop,
        moveActionBelow, restructureReplies, sortComments, insertTimeSep, renameEmpty, markSelf];
      try { refreshLoginUI(); } catch (eR) {}
      try { markLiked(); } catch (e0) {}
      steps.forEach(function (fn) { try { fn(); } catch (err) {} });
      try { markLiked(); } catch (e1) {}
    }, 250);
  }
  // ===== 杈撳叆鍖哄崰浣嶆彁绀猴紙鏄电О/閭/鍙戣█妗嗭級 =====
  function setSubmitPlaceholders() {
    var submit = document.querySelector('.qw-body #twikoo .tk-submit');
    if (!submit) return;
    var inners = submit.querySelectorAll('.tk-meta-input .el-input__inner');
    if (inners.length >= 1) inners[0].placeholder = '鏄电О';
    if (inners.length >= 2) inners[1].placeholder = '閭';
    var ta = submit.querySelector('textarea');
    if (ta && (!ta.placeholder || ta.placeholder === '鍙嬪杽浜ゆ祦锛屾枃鏄庡彂瑷€鈥?)) ta.placeholder = '鍙嬪杽浜ゆ祦锛屾枃鏄庡彂瑷€鈥?;
  }
  // 鐩戝惉璇勮鍒楄〃鍙樺寲锛堟柊澧?鍔犺浇锛夎嚜鍔ㄩ噸鏂版爣璁?  var tcommentEl = document.getElementById('tcomment');
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
    logAction('璁块棶鑱婂ぉ瀹?, '鎵撳紑鑱婂ぉ瀹?);
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
  // 鎵撳紑鑱婂ぉ瀹ゅ悗鍒锋柊鐧诲綍鎬?  var _origOpen = openChat;
  openChat = function () {
    _origOpen.apply(this, arguments);
    setTimeout(refreshLoginUI, 300);
  };
  var loginBarBtn = document.getElementById('qw-login-bar-btn');
  if (loginBarBtn) loginBarBtn.addEventListener('click', openLogin);
  var loginSubmit = document.getElementById('qw-login-submit');
  if (loginSubmit) loginSubmit.addEventListener('click', doLogin);
  // 鍙戦€侀偖绠遍獙璇佺爜锛?0s 鍊掕鏃讹級
  var sendCodeBtn = document.getElementById('qw-send-code');
  if (sendCodeBtn) sendCodeBtn.addEventListener('click', function () {
    var email = (document.getElementById('qw-login-email') || {}).value ? document.getElementById('qw-login-email').value.trim() : '';
    var msgEl = document.getElementById('qw-login-msg');
    if (!email || email.indexOf('@') < 0) { if (msgEl) msgEl.textContent = '璇峰厛杈撳叆鏈夋晥閭'; return; }
    var btn = this;
    btn.disabled = true; btn.textContent = '鍙戦€佷腑鈥?;
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event: 'QW_SEND_CODE', email: email })
    }).then(function(r){return r.json();}).then(function(r){
      btn.disabled = false;
      if (r.code !== 0) { btn.textContent = '鍙戦€侀獙璇佺爜'; if (msgEl) msgEl.textContent = r.message || '鍙戦€佸け璐?; return; }
      if (msgEl) msgEl.textContent = '楠岃瘉鐮佸凡鍙戦€侊紝璇锋煡鏀堕偖绠?;
      var sec = 60; btn.disabled = true; btn.textContent = sec + 's 鍚庨噸鍙?;
      var t = setInterval(function(){ sec--; if (sec <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = '鍙戦€侀獙璇佺爜'; } else btn.textContent = sec + 's 鍚庨噸鍙?; }, 1000);
    }).catch(function(){ btn.disabled = false; btn.textContent = '鍙戦€侀獙璇佺爜'; if (msgEl) msgEl.textContent = '缃戠粶閿欒锛岃閲嶈瘯'; });
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

  // 鍙充笅瑙掕嚜鐢辩缉鏀?  var resizeHandle = document.getElementById('qw-resize-handle');
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
      overlay.innerHTML = '姝ｅ湪鍒锋柊鑱婂ぉ鏁版嵁<span class="qw-dots"></span>';
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
  // 浠?X 鎸夐挳鍜?Esc 鍏抽棴锛屼笉鍝嶅簲閬僵鐐瑰嚮

  // ===== 绠＄悊鍛橀潰鏉匡紙鑷粯锛氱櫥褰?鈫?璇勮绠＄悊 / 鍒犻櫎 / 鎷夐粦閭锛?=====
  var adminBtn = document.getElementById('qw-admin-trigger');
  var adminBackdrop = document.getElementById('qw-admin-backdrop');
  var adminBody = document.getElementById('qw-admin-body');
  var adminToken = '';
  var adminLogFilter = 'all'; // 鏃ュ織鍒嗙被: all/account/interact/other
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
        adminBody.innerHTML = '<div class="qw-admin-loading">妫€鏌ユ潈闄愨€?/div>';
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
      '<h3>绠＄悊鍛樼櫥褰?/h3>' +
      '<p class="qw-sub">鐧诲綍鍚庡彲鍒犻櫎璁垮璇勮銆佹煡鐪嬮偖绠卞苟鎷夐粦</p>' +
      '<input id="qw-admin-pwd" type="password" placeholder="璇疯緭鍏ョ鐞嗗瘑鐮? autocomplete="off">' +
      '<button class="qw-login" id="qw-admin-login-btn">鐧?褰?/button>' +
      '<div class="qw-admin-err" id="qw-admin-err"></div>' +
      '</div>';
    var input = document.getElementById('qw-admin-pwd');
    var btn = document.getElementById('qw-admin-login-btn');
    input.focus();
    var doLogin = function () {
      var pwd = input.value.trim();
      if (!pwd) { document.getElementById('qw-admin-err').textContent = '璇疯緭鍏ョ鐞嗗瘑鐮?; return; }
      btn.disabled = true; btn.textContent = '鐧诲綍涓€?;
      adminPost({ event: 'LOGIN', password: pwd }).then(function (res) {
        if (res && res.code === 0) {
          try { localStorage.setItem('qw_admin_token', pwd); } catch (e) {}
          adminToken = pwd;
          adminBtn.classList.add('qw-admin-on');
          renderManageView();
        } else {
          document.getElementById('qw-admin-err').textContent = (res && res.message) || '鐧诲綍澶辫触';
          btn.disabled = false; btn.textContent = '鐧?褰?;
        }
      }).catch(function () {
        document.getElementById('qw-admin-err').textContent = '缃戠粶寮傚父锛岃閲嶈瘯';
        btn.disabled = false; btn.textContent = '鐧?褰?;
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
    adminBody.innerHTML = '<div class="qw-admin-loading">鍔犺浇鑱婂ぉ鏁版嵁鈥?/div>';
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
        adminBody.innerHTML = '<div class="qw-admin-loading">' + ((r1 && r1.message) || '鐧诲綍宸插け鏁堬紝璇烽噸鏂扮櫥褰?) + '</div>';
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
      adminBody.innerHTML = '<div class="qw-admin-loading">缃戠粶寮傚父锛屽姞杞藉け璐?br><small style="opacity:.6">' + (e && e.message ? e.message : '') + '</small></div>';
    });
  }

  // 鐐硅禐浜轰俊鎭細浜烘暟浠?Twikoo ups 涓哄噯锛岀偣璧炰汉 IP 鏉ヨ嚜鍚庣鏃佽矾璁板綍锛堟槑鏂囷級
  function likeInfoHtml(c, likeMap) {
    var ups = c.ups || c.likes || [];
    if (!ups.length) return '';
    var ips = (likeMap && likeMap[c._id]) || [];
    return '<div class="qw-like-info">馃憤 ' + ups.length + ' 浜? +
      (ips.length ? ' 路 ' + escHtml(ips.join('銆?)) : '') + '</div>';
  }

  function renderManageList(comments, blocks, wlist, likeMap, logs) {
    adminLogs = logs || [];
    var html = '';
    html += '<div class="qw-admin-stats">' +
      '<div><b>' + (comments.length || 0) + '</b><span>鍏ㄩ儴娑堟伅</span></div>' +
      '<div><b>' + (blocks.length || 0) + '</b><span>榛戝悕鍗?/span></div>' +
      '<div><b>' + (wlist.length || 0) + '</b><span>鐧藉悕鍗?/span></div>' +
      '</div>';
    html += '<div class="qw-admin-list">';
    if (!comments.length) {
      html += '<div class="qw-admin-empty">鏆傛棤娑堟伅</div>';
    } else {
      for (var i = 0; i < comments.length; i++) {
        var c = comments[i];
        html += '<div class="qw-admin-item" data-id="' + c._id + '">' +
          '<div class="qw-hd"><span class="qw-nick">' + escHtml(c.nick || '鍖垮悕') + '</span>' +
          (c.mail ? '<span class="qw-mail">' + escHtml(c.mail) + '</span>' : '') +
          (c.ip ? '<span class="qw-ip">' + escHtml(c.ip) + '</span>' : '') +
          '<span class="qw-tm">' + fmtTime(c.created) + '</span></div>' +
          '<div class="qw-cmt">' + escHtml(stripHtml(c.comment)) + '</div>' +
          likeInfoHtml(c, likeMap) +
          (adminReadOnly ? '' : '<div class="qw-ops">' +
          '<button class="qw-del" data-act="del" data-id="' + c._id + '">鍒犻櫎</button>' +
          (c.mail ? '<button class="qw-blk" data-act="blk" data-mail="' + escAttr(c.mail) + '">鎷夐粦</button>' : '') +
          '</div>') +
          '</div>';
      }
    }
    html += '</div>';
    if (!adminReadOnly) {
      html += '<div class="qw-mgmt-section"><h4>榛戝悕鍗曪紙鎷夐粦鍚庢棤娉曞彂瑷€锛?/h4>';
      if (!blocks.length) {
        html += '<div class="qw-admin-empty" style="padding:10px 0">鏆傛棤榛戝悕鍗?/div>';
      } else {
        for (var b = 0; b < blocks.length; b++) {
          var bk = typeof blocks[b] === 'string' ? { mail: blocks[b], ip: '' } : (blocks[b] || {});
          var bkLabel = bk.mail + (bk.ip ? '锛圛P ' + bk.ip + '锛? : '');
          html += '<div class="qw-mgmt-item"><span>' + escHtml(bkLabel) + '</span><button data-act="unblk" data-mail="' + escAttr(bk.mail) + '">瑙ｉ櫎</button></div>';
        }
      }
      html += '<div class="qw-mgmt-input-row"><input type="text" id="qw-blk-input" placeholder="杈撳叆閭鎴栨樀绉拌繘琛屾媺榛?><button class="qw-add-blk" data-act="add-blk">鎷夐粦</button></div></div>';
      html += '<div class="qw-mgmt-section"><h4>鐧藉悕鍗曪紙鏄剧ず绠＄悊鍛樺ご琛旓級</h4>';
      if (!wlist.length) {
        html += '<div class="qw-admin-empty" style="padding:10px 0">鏆傛棤鐧藉悕鍗?/div>';
      } else {
        for (var w = 0; w < wlist.length; w++) {
          var wl = typeof wlist[w] === 'string' ? { email: wlist[w] } : (wlist[w] || {});
          html += '<div class="qw-mgmt-item"><span>' + escHtml(wl.email || '') + '</span><button data-act="unwl" data-email="' + escAttr(wl.email || '') + '">绉婚櫎</button></div>';
        }
      }
      html += '<div class="qw-mgmt-input-row"><input type="text" id="qw-wl-input" placeholder="杈撳叆閭鎴栨樀绉板姞鍏ョ櫧鍚嶅崟"><button class="qw-add-wl" data-act="add-wl">娣诲姞</button></div></div>';
      html += '<div class="qw-mgmt-section" id="qw-log-section">' + buildLogHtml(logs) + '</div>';
      html += '<button class="qw-admin-logout" data-act="logout">閫€鍑虹櫥褰?/button>';
    } else {
      html += '<div style="text-align:center;padding:16px 0 4px;font-size:11px;color:var(--jp-muted);">鍙妯″紡 路 鍙祻瑙堬紝鎿嶄綔闇€楠岃瘉瀵嗙爜</div>';
      html += '<button class="qw-admin-logout" data-act="verify-pwd" style="color:var(--jp-accent);text-decoration:none;border:1px solid var(--jp-line);border-radius:8px;">杈撳叆绠＄悊瀵嗙爜杩涜鎿嶄綔</button>';
    }
    adminBody.innerHTML = html;
    enrichIps();

    adminBody.querySelectorAll('.qw-admin-item .qw-ops button, .qw-mgmt-item button, .qw-admin-logout, .qw-mgmt-input-row button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-act');
        if (act === 'del') {
          var id = btn.getAttribute('data-id');
          if (confirm('纭畾鍒犻櫎杩欐潯璇勮鍚楋紵')) {
            adminPost({ event: 'COMMENT_DELETE_FOR_ADMIN', accessToken: adminToken, id: id }).then(function (r) {
              if (r && r.code === 0) renderManageView();
              else alert((r && r.message) || '鍒犻櫎澶辫触');
            });
          }
        } else if (act === 'blk') {
          var mail = btn.getAttribute('data-mail');
          if (confirm('纭畾鎷夐粦 ' + mail + ' 鍚楋紵')) {
            adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: mail }).then(function (r) {
              if (r && r.code === 0) renderManageView();
              else alert((r && r.message) || '鎷夐粦澶辫触');
            });
          }
        } else if (act === 'unblk') {
          var umail = btn.getAttribute('data-mail');
          adminPost({ event: 'QW_BLOCK_DELETE', accessToken: adminToken, mail: umail }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '鎿嶄綔澶辫触');
          });
        } else if (act === 'add-blk') {
          var blkVal = ((document.getElementById('qw-blk-input') || {}).value || '').trim();
          if (!blkVal) { alert('璇疯緭鍏ラ偖绠辨垨鏄电О'); return; }
          adminPost({ event: 'QW_BLOCK_ADD', accessToken: adminToken, mail: blkVal }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '鎿嶄綔澶辫触');
          });
        } else if (act === 'add-wl') {
          var wlVal = ((document.getElementById('qw-wl-input') || {}).value || '').trim();
          if (!wlVal) { alert('璇疯緭鍏ラ偖绠辨垨鏄电О'); return; }
          adminPost({ event: 'QW_ADMIN_WHITELIST_ADD', accessToken: adminToken, email: wlVal }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '鎿嶄綔澶辫触');
          });
        } else if (act === 'unwl') {
          var uwl = btn.getAttribute('data-email');
          adminPost({ event: 'QW_ADMIN_WHITELIST_DELETE', accessToken: adminToken, email: uwl }).then(function (r) {
            if (r && r.code === 0) renderManageView();
            else alert((r && r.message) || '鎿嶄綔澶辫触');
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

  // 鎶婃祻瑙堝櫒 UA 缈昏瘧鎴愪汉璇?  function parseUa(ua) {
    if (!ua) return '鏈煡璁惧';
    var s = ua;
    var isMobile = /Mobile|Android|iPhone/i.test(s);
    var isPad = /iPad|Tablet/i.test(s);
    var dev = isPad ? '骞虫澘' : (isMobile ? '鎵嬫満' : '鐢佃剳');
    var os = '鏈煡绯荤粺';
    if (/Windows NT 10/.test(s)) os = 'Windows';
    else if (/iPhone|iPad/.test(s)) os = 'iOS';
    else if (/Mac OS X/.test(s)) os = 'Mac';
    else if (/Android/.test(s)) os = 'Android';
    else if (/Linux/.test(s)) os = 'Linux';
    var br = '娴忚鍣?;
    if (/Edg\//.test(s)) br = 'Edge';
    else if (/Chrome\//.test(s) && !/OPR/.test(s)) br = 'Chrome';
    else if (/Firefox\//.test(s)) br = 'Firefox';
    else if (/Safari\//.test(s)) br = 'Safari';
    else if (/OPR\//.test(s)) br = 'Opera';
    return dev + ' 路 ' + os + ' 路 ' + br;
  }

  // 鏋勫缓鎿嶄綔鏃ュ織鍖哄潡 HTML锛堝惈绛涢€夋寜閽級锛岄厤鍚堝眬閮ㄥ埛鏂?  function buildLogHtml(logs) {
    var cats = [
      { key:'all', label:'鍏ㄩ儴' },
      { key:'account', label:'璐﹀彿' },
      { key:'interact', label:'浜掑姩' },
      { key:'other', label:'鍏朵粬' }
    ];
    var catMap = {
      '娉ㄥ唽':'account','鐧诲綍':'account','閫€鍑?:'account','鏀规樀绉?:'account','鏀瑰瘑鐮?:'account','鏀归偖绠?:'account',
      '鍙戣█':'interact','鐐硅禐':'interact','鐐硅俯':'interact',
      '璁块棶鑱婂ぉ瀹?:'other'
    };
    var h = '<h4 style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">鎿嶄綔鏃ュ織锛堟渶杩?00鏉★級';
    h += '<div style="display:flex;gap:4px">';
    for (var ci=0;ci<cats.length;ci++) {
      var c = cats[ci];
      h += '<button data-act="set-logcat" data-cat="'+c.key+'" style="font-size:10px;padding:3px 10px;border:1px solid var(--jp-line);border-radius:6px;background:'+(adminLogFilter===c.key?'var(--jp-accent)':'transparent')+';color:'+(adminLogFilter===c.key?'#fff':'var(--jp-accent)')+';cursor:pointer">'+c.label+'</button>';
    }
    h += '</div></h4>';
    if (!logs || !logs.length) {
      h += '<div class="qw-admin-empty" style="padding:10px 0">鏆傛棤鏃ュ織</div>';
    } else {
      var logList = adminLogFilter === 'all' ? logs : logs.filter(function(x) { return catMap[x.type] === adminLogFilter; });
      if (!logList.length) h += '<div class="qw-admin-empty" style="padding:10px 0">鏆傛棤姝ょ被鏃ュ織</div>';
      for (var li = 0; li < logList.length; li++) {
        var lg = logList[li];
        var tstr = new Date(lg.time).toLocaleString('zh-CN');
        h += '<div class="qw-log-item" data-log-id="' + escAttr(lg._id || '') + '">' + escHtml(tstr) + ' 路 ' + escHtml(lg.type) + ' 路 ' + escHtml(lg.nick || lg.email || '鍖垮悕') + ' 路 ' + escHtml(lg.detail || '') + '<span class="qw-log-sub">IP ' + escHtml(lg.ip || '鏈煡') + ' 路 ' + parseUa(lg.ua) + '</span><button class="qw-log-del" data-act="del-log" data-id="' + escAttr(lg._id || '') + '" title="鍒犻櫎杩欐潯鏃ュ織" style="float:right;margin-left:8px;border:none;background:none;color:var(--jp-muted);font-size:11px;cursor:pointer;">鉁?/button></div>';
      }
    }
    return h + '</div>';
  }
  // IP 褰掑睘鍦版煡璇紙ipwho.is锛屽厤璐硅法鍩燂紝缁撴灉缂撳瓨鏈湴锛?  var ipLocCache = {};
  try {
    var rawCache = JSON.parse(localStorage.getItem('qw_ip_loc') || '{}');
    if (rawCache._v === 2) ipLocCache = rawCache.data || {};
  } catch (e) {}
  var provinceMap = {
    'beijing': '鍖椾含', 'shanghai': '涓婃捣', 'tianjin': '澶╂触', 'chongqing': '閲嶅簡',
    'guangdong': '骞夸笢', 'jiangsu': '姹熻嫃', 'zhejiang': '娴欐睙', 'shandong': '灞变笢',
    'henan': '娌冲崡', 'hebei': '娌冲寳', 'hunan': '婀栧崡', 'hubei': '婀栧寳', 'sichuan': '鍥涘窛',
    'fujian': '绂忓缓', 'anhui': '瀹夊窘', 'jiangxi': '姹熻タ', 'liaoning': '杈藉畞',
    'shanxi': '灞辫タ', 'shaanxi': '闄曡タ', 'heilongjiang': '榛戦緳姹?, 'jilin': '鍚夋灄',
    'guangxi': '骞胯タ', 'yunnan': '浜戝崡', 'guizhou': '璐靛窞', 'gansu': '鐢樿們',
    'inner mongolia': '鍐呰挋鍙?, 'xinjiang': '鏂扮枂', 'xizang': '瑗胯棌', 'qinghai': '闈掓捣',
    'ningxia': '瀹佸', 'hainan': '娴峰崡', 'hong kong': '棣欐腐', 'macau': '婢抽棬', 'taiwan': '鍙版咕'
  };
  var cityMap = {
    'beijing': '鍖椾含', 'shanghai': '涓婃捣', 'tianjin': '澶╂触', 'chongqing': '閲嶅簡',
    'guangzhou': '骞垮窞', 'shenzhen': '娣卞湷', 'dongguan': '涓滆帪', 'foshan': '浣涘北',
    'zhuhai': '鐝犳捣', 'zhongshan': '涓北', 'huizhou': '鎯犲窞', 'jiangmen': '姹熼棬',
    'chengdu': '鎴愰兘', 'hangzhou': '鏉窞', 'ningbo': '瀹佹尝', 'wenzhou': '娓╁窞',
    'jiaxing': '鍢夊叴', 'shaoxing': '缁嶅叴', 'suzhou': '鑻忓窞', 'nanjing': '鍗椾含',
    'wuxi': '鏃犻敗', 'changzhou': '甯稿窞', 'nantong': '鍗楅€?, 'xuzhou': '寰愬窞',
    'jinan': '娴庡崡', 'qingdao': '闈掑矝', 'yantai': '鐑熷彴', 'weifang': '娼嶅潑',
    'zhengzhou': '閮戝窞', 'luoyang': '娲涢槼', 'wuhan': '姝︽眽', 'xiangyang': '瑗勯槼',
    'changsha': '闀挎矙', 'zhuzhou': '鏍床', 'xiangtan': '婀樻江', 'hengyang': '琛￠槼',
    'yueyang': '宀抽槼', 'yiyang': '鐩婇槼', 'changde': '甯稿痉', 'zhangjiajie': '寮犲鐣?,
    'nanchang': '鍗楁槍', 'jiujiang': '涔濇睙', 'hefei': '鍚堣偉', 'wuhu': '鑺滄箹',
    'fuzhou': '绂忓窞', 'xiamen': '鍘﹂棬', 'quanzhou': '娉夊窞', 'putian': '鑾嗙敯',
    'shenyang': '娌堥槼', 'dalian': '澶ц繛', 'changchun': '闀挎槬', 'harbin': '鍝堝皵婊?,
    'shijiazhuang': '鐭冲搴?, 'taiyuan': '澶師', 'xian': '瑗垮畨', 'xianyang': '鍜搁槼',
    'kunming': '鏄嗘槑', 'guiyang': '璐甸槼', 'nanning': '鍗楀畞', 'haikou': '娴峰彛',
    'lanzhou': '鍏板窞', 'xining': '瑗垮畞', 'urumqi': '涔岄瞾鏈ㄩ綈', 'lhasa': '鎷夎惃',
    'hohhot': '鍛煎拰娴╃壒', 'yinchuan': '閾跺窛'
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
      if (/CHINANET|China Telecom/i.test(org)) org = '鐢典俊';
      else if (/CHINA UNICOM|China Unicom/i.test(org)) org = '鑱旈€?;
      else if (/CHINA MOBILE|China Mobile/i.test(org)) org = '绉诲姩';
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
  // 缁欑鐞嗛潰鏉块噷鎵€鏈?IP 琛岃ˉ涓婂綊灞炲湴
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
          var dot = document.createTextNode(' 路 ' + loc);
          target.appendChild(dot);
        }
      });
    });
  }
  // 灞€閮ㄥ垏鎹㈡棩蹇楀垎绫伙細鍙噸寤烘棩蹇楀尯鍧楋紝涓嶉噸杞芥暣涓亰澶╁悗鍙?  function handleSetLogCat(cat) {
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
            alert((r && r.message) || '鍒犻櫎澶辫触');
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
  // ===== 璐﹀彿璁剧疆寮圭獥 =====
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
      if (fBtn) fBtn.textContent = '蹇樿瀵嗙爜锛熼€氳繃閭楠岃瘉鐮侀噸缃?;
    }
  }
  document.querySelectorAll('#qw-settings-modal .qw-login-tab').forEach(function(tab){
    tab.addEventListener('click', function(){ setTab(tab.getAttribute('data-set')); });
  });
  function openSettings() {
    var v = getVisitor();
    document.getElementById('qw-set-current-nick').textContent = v.nick || '鏈缃樀绉?;
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
    // 澶撮儴鏄剧ず褰撳墠鐧诲綍璐﹀彿
    var headSub = document.querySelector('#qw-settings-modal .qw-login-head p');
    if (headSub) headSub.textContent = (v.nick || '鏈櫥褰?) + ' 路 ' + (v.email || '');
    setTab('nick');
    settingsModal.classList.add('qw-open');
  }
  function closeSettings() { settingsModal.classList.remove('qw-open'); }
  document.getElementById('qw-settings-btn').addEventListener('click', openSettings);
  settingsModal.addEventListener('click', function(e) { if (e.target === settingsModal) closeSettings(); });
  document.getElementById('qw-settings-close-x').addEventListener('click', closeSettings);
  function setBtnLoading(btn, text) { btn.disabled = true; btn.textContent = text; }
  function setBtnRestore(btn, text) { btn.disabled = false; btn.textContent = text; }
  // 鏀规樀绉帮細涓嶉渶瑕佸瘑鐮?  document.getElementById('qw-set-nick-save').addEventListener('click', function() {
    var v = getVisitor();
    var nick = document.getElementById('qw-set-nick').value.trim();
    if (!nick) { showSetMsg('璇疯緭鍏ユ柊鏄电О', false); return; }
    var btn = this; setBtnLoading(btn, '淇濆瓨涓€?);
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event:'QW_USER_UPDATE', email: v.email, newNick: nick })
    }).then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '淇濆瓨鏄电О');
      if (r.code === 0) {
        localStorage.setItem(QW_NICK, nick);
        showSetMsg('鏄电О宸蹭慨鏀?, true);
        logAction('鏀规樀绉?, '鏄电О鏀逛负: ' + nick);
        setTimeout(function(){ closeSettings(); refreshLoginUI(); }, 800);
      } else showSetMsg(r.message || '淇敼澶辫触', false);
    }).catch(function(){ setBtnRestore(btn, '淇濆瓨鏄电О'); showSetMsg('缃戠粶閿欒', false); });
  });
  // 鏀瑰瘑鐮侊細鏃у瘑鐮?/ 閭楠岃瘉鐮?鍒囨崲锛堥€氳繃"蹇樿瀵嗙爜"閾炬帴锛?  var pwdMode = 'old';
  var forgotBtn = document.getElementById('qw-pwd-forgot');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', function() {
      if (pwdMode === 'old') {
        pwdMode = 'code';
        document.getElementById('qw-pwd-old-field').style.display = 'none';
        document.getElementById('qw-pwd-code-field').style.display = 'block';
        forgotBtn.textContent = '鎯宠捣鏉ヤ簡锛熺敤褰撳墠瀵嗙爜淇敼';
      } else {
        pwdMode = 'old';
        document.getElementById('qw-pwd-old-field').style.display = 'block';
        document.getElementById('qw-pwd-code-field').style.display = 'none';
        forgotBtn.textContent = '蹇樿瀵嗙爜锛熼€氳繃閭楠岃瘉鐮侀噸缃?;
      }
    });
  }
  // 鏀瑰瘑鐮侊細鍙?reset 楠岃瘉鐮?  function bindSendCode(btnId, emailVal, type, msgEl) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', function() {
      var email = typeof emailVal === 'function' ? emailVal() : emailVal;
      if (!email || email.indexOf('@') < 0) { showSetMsg('璇峰厛濉偖绠?, false); return; }
      btn.disabled = true; var s = 60;
      btn.textContent = s + 's';
      var timer = setInterval(function(){
        s--; if (s <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = '鍙戠爜'; }
        else btn.textContent = s + 's';
      }, 1000);
      fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ event:'QW_SEND_CODE', email: email, type: type })
      }).then(function(r){return r.json();}).then(function(r){
        showSetMsg(r.code === 0 ? '楠岃瘉鐮佸凡鍙戦€? : (r.message || '鍙戦€佸け璐?), r.code === 0);
      }).catch(function(){ showSetMsg('缃戠粶閿欒', false); });
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
    if (!p1 || p1.length < 4) { showSetMsg('鏂板瘑鐮佽嚦灏?浣?, false); return; }
    if (p1 !== p2) { showSetMsg('涓ゆ瀵嗙爜涓嶄竴鑷?, false); return; }
    var body = { event:'QW_USER_UPDATE', email: v.email, newPassword: p1 };
    if (pwdMode === 'old') {
      var oldP = document.getElementById('qw-set-pwd-old-pwd').value;
      if (!oldP) { showSetMsg('璇疯緭鍏ュ綋鍓嶅瘑鐮?, false); return; }
      body.oldPassword = oldP;
    } else {
      var code = document.getElementById('qw-set-pwd-code').value.trim();
      if (!code) { showSetMsg('璇疯緭鍏ラ偖绠遍獙璇佺爜', false); return; }
      body.code = code;
    }
    var btn = this; setBtnLoading(btn, '淇濆瓨涓€?);
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    .then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '淇濆瓨瀵嗙爜');
      if (r.code === 0) {
        showSetMsg('瀵嗙爜宸蹭慨鏀?, true);
        logAction('鏀瑰瘑鐮?, '瀵嗙爜宸蹭慨鏀?);
        setTimeout(closeSettings, 800);
      } else showSetMsg(r.message || '淇敼澶辫触', false);
    }).catch(function(){ setBtnRestore(btn, '淇濆瓨瀵嗙爜'); showSetMsg('缃戠粶閿欒', false); });
  });
  // 鏀归偖绠憋細鏃ч偖绠遍獙璇佺爜 + 鏂伴偖绠遍獙璇佺爜
  document.getElementById('qw-set-email-save').addEventListener('click', function() {
    var v = getVisitor();
    var ne = document.getElementById('qw-set-new-email').value.trim();
    var oc = document.getElementById('qw-set-email-oldcode').value.trim();
    var nc = document.getElementById('qw-set-email-newcode').value.trim();
    if (!ne || ne.indexOf('@') < 0) { showSetMsg('璇疯緭鍏ユ湁鏁堟柊閭', false); return; }
    if (!oc || !nc) { showSetMsg('璇疯緭鍏ヤ袱涓偖绠辩殑楠岃瘉鐮?, false); return; }
    var btn = this; setBtnLoading(btn, '淇濆瓨涓€?);
    fetch(TWIKOO_API, { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event:'QW_CHANGE_EMAIL', email: v.email, newEmail: ne, oldCode: oc, newCode: nc })
    }).then(function(r){return r.json();}).then(function(r){
      setBtnRestore(btn, '淇濆瓨閭');
      if (r.code === 0) {
        localStorage.setItem(QW_EMAIL, ne);
        showSetMsg('閭宸蹭慨鏀?, true);
        logAction('鏀归偖绠?, '閭鏀逛负: ' + ne);
        setTimeout(function(){ closeSettings(); refreshLoginUI(); }, 800);
      } else showSetMsg(r.message || '淇敼澶辫触', false);
    }).catch(function(){ setBtnRestore(btn, '淇濆瓨閭'); showSetMsg('缃戠粶閿欒', false); });
  });
  // 绠＄悊鍛橀潰鏉垮彧鑳界偣 X 鍏抽棴锛堜笉鍝嶅簲 Esc 鍜岄伄缃╃偣鍑伙級

  // 璧?韪╂搷浣滐細璧炰笌韪╀簰鏂ヨ嚜鍔ㄥ垏鎹紙宸茶禐鐐硅俯=鍙栨秷璧炲彉韪╋紝鍙嶄箣浜︾劧锛夛紱鍐嶇偣鍚屼竴涓?鍙栨秷锛涙寔涔呴珮浜?  document.addEventListener('click', function (e) {
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
      // 鎵嬪姩璁剧疆 Twikoo 鍐呴儴 parentComment
      try {
        var vm = document.querySelector('#twikoo').__vue__;
        if (vm) { vm.parentComment = comment; }
      } catch (eSet) {}
      showReplyBar(nick, content);
      return;
    }
    if (!isLike && !isDislike) return; // 璧?韪╀箣澶栫殑鍏朵粬鎸夐挳涓嶅鐞?    function block(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    function saveSets() {
      try { localStorage.setItem(LK, JSON.stringify(likedSet)); } catch (e2) {}
      try { localStorage.setItem(DK, JSON.stringify(dislikedSet)); } catch (e2) {}
    }
    // 浜掓枼锛氬凡璧炴椂鐐硅俯 = 鍙栨秷璧炲彉韪╋紱宸茶俯鏃剁偣璧?= 鍙栨秷韪╁彉璧烇紱鍐嶇偣鍚屼竴涓?= 鍙栨秷
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
        // 宸茶禐鍐嶇偣 = 鍙栨秷璧烇紙鏀捐缁?Twikoo toggle锛?        delete likedSet[id];
        likeBtn.classList.remove('qw-liked');
        saveSets();
        return;
      }
      likedSet[id] = 1;
      likeBtn.classList.add('qw-liked');
      saveSets();
      logAction('鐐硅禐', '娑堟伅ID:' + id);
    } else if (isDislike) {
      if (dislikedSet[id]) {
        // 宸茶俯鍐嶇偣 = 鍙栨秷韪?        delete dislikedSet[id];
        dislikeBtn.classList.remove('qw-disliked');
        saveSets();
        return;
      }
      dislikedSet[id] = 1;
      dislikeBtn.classList.add('qw-disliked');
      saveSets();
      logAction('鐐硅俯', '娑堟伅ID:' + id);
    }
  }, true);

  // 鎷︽埅瀵艰埅閲岀殑"鑱婂ぉ瀹?閾炬帴锛坒klts.html / chat.html锛夆啋 鎵撳紑鎮诞寮圭獥锛屼笉璺宠浆
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href$="fklts.html"], a[href$="chat.html"]') : null;
    if (a) { e.preventDefault(); openChat(); }
  }, true);

  // ===== 鐐硅禐闃插埛锛氬悓涓€娴忚鍣ㄥ彧鑳界偣涓€娆¤禐锛堣法绐楀彛鍏变韩 localStorage锛?=====
  // 閰嶅悎鍚庣鎸?IP 鍘婚噸锛氬悓 IP 澶氳澶囦篃鍒蜂笉浜嗭紱鎹?IP/鎹㈡祻瑙堝櫒鐞嗚涓婂彲鍒凤紝鏃犳硶鏍规不
  var LK = 'qw_liked_v1';
  var likedSet = {};
  try { likedSet = JSON.parse(localStorage.getItem(LK) || '{}'); } catch (e) { likedSet = {}; }
  // ===== 宸茬偣璧為珮浜仮澶嶏細鏈湴璁板綍杩囩殑璇勮锛岀偣璧炴寜閽浐瀹氭樉绀轰负宸茶禐锛堟湇鍔＄ liked 鐘舵€佸洜 IP 闃插埛涓嶅彲鐢級 =====
  // ===== 鐧诲綍闂細鏈～鏄电О+閭涓嶈兘鍙戣█ =====
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
  // 寰俊椋庡洖澶嶉瑙堟潯
  function showReplyBar(nick, text) {
    var submit = document.querySelector('.qw-body .tk-submit');
    if (!submit) return;
    var old = submit.querySelector('.qw-reply-bar');
    if (old) old.remove();
    var bar = document.createElement('div');
    bar.className = 'qw-reply-bar';
    bar.innerHTML = '<span class="qw-reply-nick">鍥炲 ' + (nick || '') + '锛?/span>' +
      '<span class="qw-reply-text"></span>' +
      '<span class="qw-reply-cancel">脳</span>';
    bar.querySelector('.qw-reply-text').textContent = text || '';
    bar.querySelector('.qw-reply-cancel').addEventListener('click', function () {
      bar.remove();
      // 鍚屾椂鍙栨秷 Twikoo 鍐呴儴 parentComment锛圴ue锛?      try {
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
  // 鐐瑰彂閫佸悗鑷姩娓呴櫎鍥炲鏉?  document.addEventListener('click', function(e) {
    var sendBtn = e.target && e.target.closest ? e.target.closest('.qw-body .tk-send') : null;
    if (sendBtn) setTimeout(clearReplyBar, 500);
  }, true);

  // ===== 璁垮鐧诲綍锛堥偖绠?鏄电О锛宭ocalStorage 璁颁綇锛?=====
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
      titleEl.textContent = '娉ㄥ唽璐﹀彿';
      subEl.textContent = '璁剧疆鏄电О銆侀偖绠卞拰瀵嗙爜';
      var emailEl = document.getElementById('qw-login-email');
      if (emailEl) emailEl.placeholder = '閭锛堢敤浜庢帴鏀堕獙璇佺爜锛?;
      btnEl.textContent = '娉?鍐?;
      if (toggleEl) toggleEl.innerHTML = '<span>宸叉湁璐﹀彿锛?/span><b id="qw-toggle-link">鐐瑰嚮鐧诲綍</b>';
      if (tabLogin) tabLogin.classList.remove('qw-active');
      if (tabReg) tabReg.classList.add('qw-active');
    } else {
      if (nickEl) nickEl.style.display = 'none';
      if (nickField) nickField.style.display = 'none';
      var codeRow2 = document.getElementById('qw-code-row');
      if (codeRow2) codeRow2.style.display = 'none';
      titleEl.textContent = '鐧诲綍鍙戣█';
      subEl.textContent = '杈撳叆閭鍜屽瘑鐮佺櫥褰?;
      var emailEl2 = document.getElementById('qw-login-email');
      if (emailEl2) emailEl2.placeholder = '閭鎴栨樀绉?;
      btnEl.textContent = '鐧?褰?;
      if (toggleEl) toggleEl.innerHTML = '<span>娌℃湁璐﹀彿锛?/span><b id="qw-toggle-link">鐐瑰嚮娉ㄥ唽</b>';
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
    if (loginMode === 'register' && !nick) { msgEl.textContent = '璇疯緭鍏ユ樀绉?; return; }
    if (!email) { msgEl.textContent = '璇疯緭鍏ラ偖绠辨垨鏄电О'; return; } if (loginMode === 'register' && email.indexOf('@') < 0) { msgEl.textContent = '璇疯緭鍏ユ湁鏁堥偖绠?; return; }
    if (!pwd) { msgEl.textContent = '璇疯緭鍏ュ瘑鐮?; return; }
    var btn = document.getElementById('qw-login-submit');
    if (btn) btn.disabled = true;
    var bodyData = { event: 'QW_USER_AUTH', email: email, password: pwd };
    if (loginMode === 'register') { bodyData.nick = nick; bodyData.code = (document.getElementById('qw-login-code') || {}).value ? document.getElementById('qw-login-code').value.trim() : ''; }
    fetch('https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(bodyData)
    }).then(function(r){return r.json();}).then(function(r){
      if (btn) btn.disabled = false;
      if (r.code !== 0) { msgEl.textContent = r.message || '鎿嶄綔澶辫触'; return; }
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
        if (act === 'registered') logAction('娉ㄥ唽', '鏂拌处鍙锋敞鍐? ' + nick);
        else if (act === 'logged_in') logAction('鐧诲綍', '璐﹀彿鐧诲綍: ' + (r.data.nick || nick));
      } catch (e2) {}
    }).catch(function(){
      if (btn) btn.disabled = false;
      msgEl.textContent = '缃戠粶閿欒锛岃閲嶈瘯';
    });
  }
  function logout() {
    try {
      var lv = getVisitor();
      if (lv.nick || lv.email) logAction('閫€鍑?, '璐﹀彿閫€鍑? ' + (lv.nick || lv.email));
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
      // 鍒犻櫎/缂栬緫鎸夐挳鍙樉绀虹粰璇勮浣滆€呰嚜宸憋細
      // 鍓?涓寜閽槸 璧?韪?鍥炲锛岀4涓強浠ュ悗鏄垹闄?缂栬緫绛夌鐞嗘寜閽?      try {
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

  // 澶栭儴鍙皟鐢?  window.openChatRoom = openChat;
  window.closeChatRoom = closeChat;
})();
