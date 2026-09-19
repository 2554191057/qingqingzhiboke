/* =============================================
   庆庆纸博客 · 后台管理系统 Admin JS
   Twikoo Netlify 后端 API 对接 + SPA 状态管理
   ============================================= */
(function () {
    'use strict';

    // ===== 配置 =====
    const TWIKOO_API = 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo';
    const API_BASE = TWIKOO_API; // 统一入口
    const BACKEND_URL = TWIKOO_API;
    const ADMIN_TOKEN_KEY = 'qw_admin_token';
    const ADMIN_AUTH_KEY = 'qw_admin_auth_time';
    const TOKEN_TTL = 1800000; // 30 分钟

    // ===== 全局状态 =====
    const state = {
        token: localStorage.getItem(ADMIN_TOKEN_KEY) || '',
        currentTab: 'dashboard',
        sidebarCollapsed: false,
        autoRefresh: true,
        autoRefreshTimer: null,
        charts: { visit: null, source: null },
        comments: { list: [], filtered: [], page: 1, pageSize: 10, total: 0 },
        whitelist: [],
        blocklist: [],
        visits: [],
    };

    // ========== API 层 ==========
    function api(event, extra) {
        const body = Object.assign({ event }, extra || {});
        if (state.token) body.accessToken = state.token;
        return fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then(r => r.json()).catch(err => ({ code: -1, message: '网络错误: ' + err.message }));
    }

    // Twikoo 评论列表（用原生 COMMENT_GET_FOR_ADMIN）
    function fetchComments(options) {
        const opts = options || {};
        const body = {
            event: 'COMMENT_GET_FOR_ADMIN',
            per: opts.per || 20,
            page: opts.page || 1,
            keyword: opts.keyword || '',
            type: opts.type || '',
            accessToken: state.token,
        };
        return fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then(r => r.json()).catch(err => ({ code: -1, data: [], count: 0 }));
    }

    function deleteComment(id) {
        return api('COMMENT_DELETE_FOR_ADMIN', { id });
    }

    function blockEmail(email, reason) {
        return api('QW_BLOCK_ADD', { mail: email, reason: reason || '' });
    }

    function fetchBlocklist() {
        return api('QW_BLOCK_LIST');
    }

    function removeBlocked(delKey) {
        const [type, val] = (delKey || '').split(':');
        const body = {};
        if (type === 'ip') body.ip = val;
        else if (type === 'nick') body.nick = val;
        else body.mail = val;
        return api('QW_BLOCK_DELETE', body);
    }

    function fetchWhitelist() {
        return api('QW_IP_WHITELIST_LIST');
    }

    function addWhitelist(ip, note) {
        return api('QW_IP_WHITELIST_ADD', { ip, note: note || '' });
    }

    function removeWhitelist(id) {
        return api('QW_IP_WHITELIST_DELETE', { ip: id });
    }

    function fetchVisitLogs() {
        return fetch('/api/visits?days=7')
            .then(r => r.json())
            .catch(() => ({ code: 0, data: [] }));
    }
    function fetchOnlineCount() {
        return fetch('/api/online', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
            .then(r => r.json())
            .catch(() => ({ code: 0, count: 0 }));
    }

    function changePassword(oldPwd, newPwd, code) {
        return api('QW_SET_PASSWORD', {
            oldPassword: oldPwd,
            newPassword: newPwd,
            code: code || '',
        });
    }

    function sendAdminCode() {
        return api('QW_ADMIN_SEND_CODE', {});
    }

    // ========== Toast ==========
    const toastContainer = document.getElementById('toastContainer');
    function toast(msg, type) {
        const t = document.createElement('div');
        t.className = 'toast ' + (type || '');
        const iconMap = { '': 'fa-circle-info', ok: 'fa-circle-check', err: 'fa-circle-exclamation', warn: 'fa-triangle-exclamation' };
        t.innerHTML = `<i class="fa-solid ${iconMap[type || ''] || iconMap['']}"></i><span></span>`;
        t.querySelector('span').textContent = msg;
        toastContainer.appendChild(t);
        setTimeout(() => {
            t.classList.add('fade-out');
            setTimeout(() => t.remove(), 300);
        }, 3000);
    }

    // ========== Confirm ==========
    const confirmModal = document.getElementById('confirmModal');
    function confirmDialog(opts) {
        return new Promise(resolve => {
            const o = Object.assign({ title: '确认操作', text: '确定要执行此操作吗？', okText: '确定', cancelText: '取消', type: '' }, opts);
            confirmModal.hidden = false;
            confirmModal.querySelector('#confirmTitle').textContent = o.title;
            confirmModal.querySelector('#confirmText').textContent = o.text;
            const icon = confirmModal.querySelector('#confirmIcon');
            icon.className = 'modal-icon' + (o.type ? ' ' + o.type : '');
            const btnOk = confirmModal.querySelector('#confirmOk');
            btnOk.textContent = o.okText;
            confirmModal.querySelector('#confirmCancel').textContent = o.cancelText;
            const cleanup = (result) => {
                confirmModal.hidden = true;
                btnOk.removeEventListener('click', onOk);
                confirmModal.querySelector('#confirmCancel').removeEventListener('click', onCancel);
                resolve(result);
            };
            const onOk = () => cleanup(true);
            const onCancel = () => cleanup(false);
            btnOk.addEventListener('click', onOk);
            confirmModal.querySelector('#confirmCancel').addEventListener('click', onCancel);
            // ESC
            const escHandler = (e) => {
                if (e.key === 'Escape') { cleanup(false); document.removeEventListener('keydown', escHandler); }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    // ========== 登录 ==========
    function checkLogin() {
        if (state.token) {
            const authTime = parseInt(localStorage.getItem(ADMIN_AUTH_KEY) || '0', 10);
            if (authTime && Date.now() - authTime < TOKEN_TTL) {
                enterApp();
                return true;
            } else {
                logout();
            }
        }
        return false;
    }

    function enterApp() {
        document.getElementById('loginGate').hidden = true;
        const app = document.getElementById('adminApp');
        app.hidden = false;
        initAdmin();
    }

    function logout() {
        state.token = '';
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_AUTH_KEY);
        document.getElementById('adminApp').hidden = true;
        document.getElementById('loginGate').hidden = false;
        if (state.autoRefreshTimer) clearInterval(state.autoRefreshTimer);
    }

    // Turnstile 回调（注意：全局函数）
    let _captchaToken = null;
    var _tsTimer = setTimeout(function(){
        var el = document.getElementById('loginTip');
        if (el && !el.dataset.done) { el.className='login-tip'; el.textContent='请勾选验证小方块继续'; }
    }, 10000);
    window.onAdminTurnstileSuccess = function (token) {
        clearTimeout(_tsTimer);
        _captchaToken = token;
        const btn = document.getElementById('btnLogin');
        btn.disabled = false;
        btn.querySelector('span').textContent = '进入管理';
    };
    window.onAdminTurnstileError = function () {
        const tip = document.getElementById('loginTip');
        tip.className = 'login-tip err';
        tip.textContent = '人机验证加载失败，请刷新页面重试';
    };

    // 登录 API —— 原生 LOGIN + QW_BLOCK_LIST 二次验证
    async function verifyAdminLogin(password) {
        // Step 1: 原生 LOGIN 验证密码
        const loginRes = await api('LOGIN', { password });
        if (loginRes && loginRes.code === 0) {
            return { ok: true };
        }
        // Step 2: 如果数据库还没设密码（PASS_NOT_EXIST / CREDENTIALS_NOT_EXIST），
        // 自动设置第一个密码（首次安装场景）
        if (loginRes && (loginRes.code === 1021 || loginRes.code === 1022)) {
            const setRes = await api('QW_SET_PASSWORD', { newPassword: password });
            if (setRes && setRes.code === 0) return { ok: true };
            return { ok: false, msg: (setRes && setRes.message) || '首次设置密码失败' };
        }
        return { ok: false, msg: (loginRes && loginRes.message) || '密码错误' };
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 登录表单
        const loginForm = document.getElementById('loginForm');
        const pwdInput = document.getElementById('adminPassword');
        const togglePwd = document.getElementById('togglePwd');

        togglePwd.addEventListener('click', function () {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                togglePwd.querySelector('i').className = 'fa-solid fa-eye-slash';
            } else {
                pwdInput.type = 'password';
                togglePwd.querySelector('i').className = 'fa-solid fa-eye';
            }
        });

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const tip = document.getElementById('loginTip');
            const btn = document.getElementById('btnLogin');
            const pwd = pwdInput.value.trim();
            if (!pwd) {
                tip.className = 'login-tip err';
                tip.textContent = '请输入管理密码';
                return;
            }
            btn.disabled = true;
            btn.querySelector('span').textContent = '验证中...';
            tip.className = 'login-tip';
            tip.textContent = '';

            try {
                // Step 1: 用原生 LOGIN 验证密码
                const result = await verifyAdminLogin(pwd);
                if (result.ok) {
                    // Step 2: 把密码明文存为管理员 token
                    state.token = pwd;
                    localStorage.setItem(ADMIN_TOKEN_KEY, pwd);
                    localStorage.setItem(ADMIN_AUTH_KEY, Date.now().toString());
                    tip.className = 'login-tip ok';
                    tip.textContent = '登录成功，正在进入...';
                    setTimeout(enterApp, 400);
                } else {
                    tip.className = 'login-tip err';
                    tip.textContent = result.msg || '密码错误或鉴权失败';
                    btn.disabled = false;
                    btn.querySelector('span').textContent = '进入管理';
                }
            } catch (err) {
                tip.className = 'login-tip err';
                tip.textContent = '网络错误，请稍后重试';
                btn.disabled = false;
                btn.querySelector('span').textContent = '进入管理';
            }
        });

        // ===== 忘记密码 =====
        const forgotModal = document.getElementById('forgotModal');
        const forgotSendBtn = document.getElementById('btnForgotSend');
        let forgotCountdown = 0;

        document.getElementById('btnForgotPwd').addEventListener('click', () => {
            forgotModal.hidden = false;
            document.getElementById('forgotCode').focus();
        });
        document.getElementById('forgotClose').addEventListener('click', () => { forgotModal.hidden = true; });
        forgotModal.addEventListener('click', (e) => { if (e.target === forgotModal) forgotModal.hidden = true; });

        forgotSendBtn.addEventListener('click', async function () {
            const tip = document.getElementById('forgotTip');
            const btn = this;
            if (forgotCountdown > 0) return;
            btn.disabled = true;
            btn.textContent = '发送中...';
            tip.className = 'forgot-tip'; tip.textContent = '';
            try {
                const r = await api({ event: 'QW_FORGOT_SEND_CODE', email: '2554191057@qq.com' });
                if (r.code === 0) {
                    tip.className = 'forgot-tip ok'; tip.textContent = '✅ 验证码已发，请查收邮箱';
                    // 60 秒倒计时
                    forgotCountdown = 60;
                    const timer = setInterval(() => {
                        forgotCountdown--;
                        if (forgotCountdown <= 0) {
                            clearInterval(timer);
                            btn.disabled = false;
                            btn.textContent = '发送验证码';
                        } else {
                            btn.textContent = `${forgotCountdown}s`;
                        }
                    }, 1000);
                } else {
                    tip.className = 'forgot-tip err'; tip.textContent = '❌ ' + (r.message || '发送失败');
                    btn.disabled = false; btn.textContent = '发送验证码';
                }
            } catch (e) {
                tip.className = 'forgot-tip err'; tip.textContent = '❌ 网络错误';
                btn.disabled = false; btn.textContent = '发送验证码';
            }
        });

        document.getElementById('btnForgotReset').addEventListener('click', async function () {
            const code = document.getElementById('forgotCode').value.trim();
            const pwd = document.getElementById('forgotNewPwd').value;
            const pwd2 = document.getElementById('forgotNewPwd2').value;
            const tip = document.getElementById('forgotTip');
            if (!code || !pwd || !pwd2) { tip.className = 'forgot-tip err'; tip.textContent = '请填完整'; return; }
            if (pwd.length < 6) { tip.className = 'forgot-tip err'; tip.textContent = '密码至少 6 位'; return; }
            if (pwd !== pwd2) { tip.className = 'forgot-tip err'; tip.textContent = '两次密码不一致'; return; }
            this.disabled = true; this.textContent = '重置中...';
            try {
                const r = await api({ event: 'QW_FORGOT_RESET_PASSWORD', email: '2554191057@qq.com', code, newPass: pwd });
                if (r.code === 0) {
                    tip.className = 'forgot-tip ok'; tip.textContent = '✅ 密码已重置，请用新密码登录';
                    setTimeout(() => { forgotModal.hidden = true; this.disabled = false; this.textContent = '重置密码'; }, 1500);
                } else {
                    tip.className = 'forgot-tip err'; tip.textContent = '❌ ' + (r.message || '重置失败');
                    this.disabled = false; this.textContent = '重置密码';
                }
            } catch (e) {
                tip.className = 'forgot-tip err'; tip.textContent = '❌ 网络错误';
                this.disabled = false; this.textContent = '重置密码';
            }
        });

        // 先尝试自动登录
        checkLogin();
    });

    // ========== Admin 初始化 ==========
    function initAdmin() {
        setupNavigation();
        setupTopbar();
        setupTheme();
        setupMobileNav();
        setupAutoRefresh();
        bindTabs();
        bindComments();
        bindWhitelist();
        bindBlocklist();
        bindVisits();
        bindSettings();
        bindDashboard();
        // 首次加载
        loadTabContent('dashboard');
    }

    function setupNavigation() {
        const sidebar = document.getElementById('sidebar');
        const collapseBtn = document.getElementById('sidebarCollapse');
        collapseBtn.addEventListener('click', function () {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        });
    }

    function setupTopbar() {
        document.getElementById('logoutBtn').addEventListener('click', function () {
            confirmDialog({
                title: '退出登录',
                text: '确定要退出管理员账户吗？',
                type: 'warning',
            }).then(ok => { if (ok) logout(); });
        });

        document.getElementById('topbarAutoRefresh').addEventListener('click', function () {
            state.autoRefresh = !state.autoRefresh;
            this.setAttribute('aria-pressed', state.autoRefresh ? 'true' : 'false');
            this.title = state.autoRefresh ? '自动刷新：开' : '自动刷新：关';
            this.classList.toggle('on', state.autoRefresh);
            localStorage.setItem('admin_auto_refresh', state.autoRefresh ? '1' : '0');
            if (state.autoRefresh) setupAutoRefresh();
            else if (state.autoRefreshTimer) clearInterval(state.autoRefreshTimer);
        });

        document.getElementById('topbarMenuBtn').addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('mobile-open');
        });
    }

    function setupTheme() {
        const saved = localStorage.getItem('admin_theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
            updateThemeButtons(saved);
        }
        document.getElementById('themeToggleAdmin').addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const next = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('admin_theme', next);
            updateThemeButtons(next);
            // 刷新 Chart.js 颜色
            setTimeout(loadTabContent, 100);
        });
    }

    function updateThemeButtons(theme) {
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeOpt === theme);
        });
    }

    function setupMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        mobileNav.addEventListener('click', function (e) {
            const item = e.target.closest('.mnav-item');
            if (!item) return;
            e.preventDefault();
            document.getElementById('sidebar').classList.remove('mobile-open');
        });
    }

    function setupAutoRefresh() {
        if (!state.autoRefresh) {
            const saved = localStorage.getItem('admin_auto_refresh');
            state.autoRefresh = saved !== '0';
        }
        if (state.autoRefreshTimer) clearInterval(state.autoRefreshTimer);
        state.autoRefreshTimer = setInterval(() => {
            if (document.hidden) return;
            if (state.currentTab === 'dashboard' || state.currentTab === 'visits') {
                loadTabContent(state.currentTab, true);
            }
        }, 60000);
    }

    // ========== Tab 切换 ==========
    function bindTabs() {
        document.querySelectorAll('.nav-item[data-tab], .mnav-item[data-tab], [data-tab-link]').forEach(el => {
            el.addEventListener('click', function (e) {
                if (el.id === 'selectAllComments') return;
                e.preventDefault();
                const tab = el.dataset.tab || el.dataset.tabLink;
                switchTab(tab);
            });
        });
    }

    function switchTab(tab) {
        state.currentTab = tab;
        // 侧边栏高亮
        document.querySelectorAll('.nav-item[data-tab], .mnav-item[data-tab]').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tab);
        });
        // 显示面板
        document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.dataset.tab === tab);
        });
        // 顶栏标题
        const titleMap = {
            dashboard: '数据概览',
            comments: '评论管理',
            whitelist: 'IP 白名单',
            blocklist: '黑名单管理',
            visits: '访问日志',
            settings: '系统设置',
        };
        document.getElementById('topbarTitle').textContent = titleMap[tab] || '管理后台';
        loadTabContent(tab);
    }

    function loadTabContent(tab, silent) {
        if (!silent) {
            // 显示加载骨架
            const panel = document.querySelector(`.tab-panel[data-tab="${tab}"]`);
            if (panel) {
                const placeholders = panel.querySelectorAll('.empty-state p');
                placeholders.forEach(p => p.textContent = '加载中...');
            }
        }
        switch (tab) {
            case 'dashboard': loadDashboard(silent); break;
            case 'comments': loadComments(); break;
            case 'whitelist': loadWhitelist(); break;
            case 'blocklist': loadBlocklist(); break;
            case 'visits': loadVisits(); break;
            case 'settings': loadSettings(); break;
        }
    }

    // ========== Dashboard ==========
    function bindDashboard() {
        document.querySelectorAll('.chip-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadDashboard();
            });
        });
    }

    async function loadDashboard(silent) {
        try {
            // 并行获取数据
            const [online, whitelist, visits, commentsRes] = await Promise.all([
                fetchOnlineCount(),
                fetchWhitelist(),
                fetchVisitLogs().catch(() => ({ code: 0, data: [] })),
                fetchComments({ page: 1, per: 1 }).catch(() => ({ code: 0, data: [], count: 0 })),
            ]);

            // 在线人数
            const onlineCount = (online && typeof online.count === 'number') ? online.count : 0;
            document.getElementById('statOnline').textContent = onlineCount;

            // 白名单数量
            const wlCount = (whitelist && whitelist.data && whitelist.data.length) || 0;
            document.getElementById('statWhitelist').textContent = wlCount;

            // 访问日志（QW_LOG_LIST 返回所有日志，过滤出 visit_ 开头的访问记录）
            const allLogs = (visits && visits.data) || [];
            const visitData = allLogs.filter(v => !v.type || String(v.type).indexOf('visit') === 0 || v.page);
            const today0 = new Date(); today0.setHours(0,0,0,0);
            const todayTs = today0.getTime();
            const todayVisits = allLogs.filter(v => new Date(v.time).getTime() >= todayTs).length;
            document.getElementById('statToday').textContent = todayVisits;
            // 总评论数 = 真实评论条数
            const commentTotal = (commentsRes && typeof commentsRes.count === 'number') ? commentsRes.count : 0;
            document.getElementById('statComments').textContent = commentTotal + '+';

            // 最近访问列表
            renderRecentVisits(visitData.slice(0, 5));
            // 最近评论
            renderRecentComments();

            // 渲染图表
            renderVisitChart(visitData);
            renderSourceChart(visitData);
        } catch (err) {
            if (!silent) toast('Dashboard 数据加载失败: ' + err.message, 'err');
        }
    }

    function renderRecentVisits(list) {
        const wrap = document.getElementById('recentVisitsList');
        if (!list.length) {
            wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>暂无访问记录</p></div>`;
            return;
        }
        wrap.innerHTML = list.map(v => `
            <div style="padding:12px 16px;border-bottom:1px solid var(--jp-line);display:flex;gap:12px;align-items:center;">
                <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--jp-accent-light);color:var(--jp-accent);border-radius:8px;font-size:14px;flex-shrink:0;">
                    <i class="fa-solid fa-eye"></i>
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:600;color:var(--jp-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(pageName(v.page, v.type))}</div>
                    <div style="font-size:11px;color:var(--jp-muted);">${formatTime(v.time)}</div>
                </div>
                <div style="font-size:11px;font-family:Consolas,monospace;color:var(--jp-muted);">${escapeHtml(v.ip || '--')}</div>
            </div>
        `).join('');
    }

    function pageName(page, type) {
        var p = String(page || '').split('?')[0];
        if (type === '访问聊天室' || type === '登录') return type;
        if (p === '/boke' || p === '/boke#home') return '博客首页';
        if (p === '/yanzheng') return '验证页';
        if (p === '/shengri') return '生日页';
        if (p === '/lts') return '聊天室页';
        if (p === '/admin.html' || p === '/admin') return '后台管理';
        return p || '/';
    }

    async function renderRecentComments() {
        const wrap = document.getElementById('recentCommentsList');
        try {
            const res = await fetchComments({ page: 1, per: 5 });
            const list = (res && res.data && res.data.slice) ? res.data.slice(0, 5) : [];
            state.comments.total = (res && res.count) || 0;
            if (!list.length) {
                wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>暂无评论</p></div>`;
                return;
            }
            wrap.innerHTML = list.map(c => {
                const nickname = (c.nick || '匿名').replace(/[<>]/g, '');
                const content = stripHtml(c.comment || '').slice(0, 80);
                return `
                    <div style="padding:12px 16px;border-bottom:1px solid var(--jp-line);display:flex;gap:12px;align-items:flex-start;">
                        <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--jp-accent-light);color:var(--jp-accent);border-radius:50%;font-size:13px;font-weight:700;flex-shrink:0;">
                            ${escapeHtml(nickname.charAt(0).toUpperCase())}
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:12px;font-weight:600;color:var(--jp-ink);margin-bottom:2px;">${escapeHtml(nickname)}</div>
                            <div style="font-size:12px;color:var(--jp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(content)}</div>
                            <div style="font-size:11px;color:var(--jp-muted);margin-top:2px;">${formatTime(c.created)}</div>
                        </div>
                    </div>
                `;
            }).join('');
            // 更新评论 badge
            const badge = document.getElementById('commentsBadge');
            if (state.comments.total > 0) {
                badge.hidden = false;
                badge.textContent = state.comments.total;
            }
        } catch (err) {
            wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-exclamation"></i><p>评论加载失败</p></div>`;
        }
    }

    function renderVisitChart(visitData) {
        const canvas = document.getElementById('visitChart');
        if (!canvas) return;

        const range = document.querySelector('.chip-btn.active');
        const days = range ? parseInt(range.dataset.range) : 7;

        // 生成最近 N 天的数据
        const labels = [];
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0,0,0,0);
            const next = new Date(d.getTime() + 86400000);
            const key = d.toISOString().slice(0, 10);
            labels.push(days <= 7 ? `${d.getMonth() + 1}/${d.getDate()}` : key);
            data.push(visitData.filter(v => {
                const t = Number(v.time);
                return t >= d.getTime() && t < next.getTime();
            }).length);
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#8a9dbd' : '#62728e';
        const gridColor = isDark ? 'rgba(35,50,79,0.5)' : 'rgba(206,218,237,0.5)';
        const accentColor = isDark ? '#50d3f6' : '#087fa8';
        const bgGradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 220);
        bgGradient.addColorStop(0, isDark ? 'rgba(80,211,246,0.3)' : 'rgba(8,127,168,0.2)');
        bgGradient.addColorStop(1, 'rgba(0,0,0,0)');

        if (state.charts.visit) state.charts.visit.destroy();
        var _existing = Chart.getChart(canvas); if (_existing) _existing.destroy();
        state.charts.visit = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: '访问次数',
                    data,
                    fill: true,
                    backgroundColor: bgGradient,
                    borderColor: accentColor,
                    borderWidth: 2,
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: accentColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? '#0f182b' : '#fff',
                        titleColor: isDark ? '#e5edff' : '#182641',
                        bodyColor: textColor,
                        borderColor: gridColor,
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                    },
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { size: 11 } },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { size: 11 }, stepSize: 1 },
                    },
                },
                interaction: { intersect: false, mode: 'index' },
            },
        });
    }

    function renderSourceChart(visitData) {
        const canvas = document.getElementById('sourceChart');
        if (!canvas) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#8a9dbd' : '#62728e';

        // 按路径前缀统计
        const sourceMap = {};
        visitData.forEach(v => {
            const p = (v.page || '/').split('?')[0];
            let label = '其他';
            if (p.includes('yanzheng')) label = '验证页';
            else if (p.includes('boke')) label = '博客首页';
            else if (p.includes('lts')) label = '聊天室';
            else if (p.includes('shengri')) label = '生日页';
            else label = '其他';
            sourceMap[label] = (sourceMap[label] || 0) + 1;
        });

        const labels = Object.keys(sourceMap);
        const values = labels.map(l => sourceMap[l]);
        const colors = ['#087fa8', '#4c67eb', '#50d3f6', '#8291ff', '#e8a33d', '#2e9e5b', '#e05b5b'];

        if (state.charts.source) state.charts.source.destroy();
        state.charts.source = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: isDark ? '#0f182b' : '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: textColor,
                            font: { size: 12 },
                            padding: 16,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#0f182b' : '#fff',
                        titleColor: isDark ? '#e5edff' : '#182641',
                        bodyColor: textColor,
                        padding: 12,
                        cornerRadius: 8,
                    },
                },
            },
        });
    }

    // ========== 评论管理 ==========
    function bindComments() {
        const search = document.getElementById('commentSearch');
        const sort = document.getElementById('commentSort');
        const selectAll = document.getElementById('selectAllComments');
        const batchDel = document.getElementById('batchDeleteComments');

        if (search) search.addEventListener('input', debounce(loadComments, 250));
        if (sort) sort.addEventListener('change', loadComments);
        if (selectAll) selectAll.addEventListener('change', function () {
            document.querySelectorAll('.comment-row-check').forEach(cb => {
                if (!cb.disabled) cb.checked = this.checked;
            });
            updateBatchBtn();
        });
        if (batchDel) batchDel.addEventListener('click', batchDeleteComments);
    }

    function updateBatchBtn() {
        const checked = document.querySelectorAll('.comment-row-check:checked').length;
        const btn = document.getElementById('batchDeleteComments');
        if (btn) {
            btn.disabled = checked === 0;
            btn.innerHTML = `<i class="fa-solid fa-trash-can"></i> 批量删除 (${checked})`;
        }
    }

    async function loadComments() {
        try {
            const sort = document.getElementById('commentSort');
            const search = document.getElementById('commentSearch');
            const res = await fetchComments({
                page: state.comments.page,
                sort: sort ? sort.value : 'newest',
            });
            const list = (res && res.data && res.data.slice) ? res.data : [];
            const total = (res && typeof res.count === 'number') ? res.count : list.length;
            state.comments.list = list;
            state.comments.total = total;

            const keyword = search ? search.value.trim().toLowerCase() : '';
            let filtered = list;
            if (keyword) {
                filtered = list.filter(c => {
                    const text = [c.nick, c.mail, c.comment].join(' ').toLowerCase();
                    return text.includes(keyword);
                });
            }
            state.comments.filtered = filtered;
            renderCommentsTable();
            renderPagination(state.comments.total, state.comments.page, state.comments.pageSize, 'commentsPagination', (p) => {
                state.comments.page = p;
                loadComments();
            });
        } catch (err) {
            const tbody = document.getElementById('commentsTableBody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="empty-row"><div class="empty-state"><i class="fa-solid fa-circle-exclamation"></i><p>加载失败：${err.message}</p></div></td></tr>`;
        }
    }

    function renderCommentsTable() {
        const tbody = document.getElementById('commentsTableBody');
        const list = state.comments.filtered;
        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-row"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>暂无评论${state.comments.filtered !== state.comments.list ? '（搜索无结果）' : ''}</p></div></td></tr>`;
            updateBatchBtn();
            return;
        }
        tbody.innerHTML = list.map(c => {
            const id = c._id;
            const nickname = escapeHtml(c.nick || '匿名');
            const email = escapeHtml((c.mail || '').replace(/@.*/, '@***'));
            const fullEmail = escapeHtml(c.mail || '');
            const ip = escapeHtml(c.ip || '--');
            const time = formatTime(c.created);
            const rawContent = stripHtml(c.comment || '');
            const isLong = rawContent.length > 100;
            return `
                <tr>
                    <td><input type="checkbox" class="comment-row-check" data-id="${id}"></td>
                    <td>
                        <div class="comment-content">
                            <div class="preview">${escapeHtml(rawContent.slice(0, 100))}</div>
                            ${isLong ? `<div class="full">${escapeHtml(rawContent)}</div><div class="comment-expand" data-expand>展开完整内容</div>` : ''}
                        </div>
                    </td>
                    <td><strong>${nickname}</strong></td>
                    <td title="${fullEmail}">${email}</td>
                    <td><span class="ip-cell">${ip}</span></td>
                    <td><span class="time-cell">${time}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn warn" data-action="block" data-email="${fullEmail}" ${fullEmail ? '' : 'disabled'}>
                                <i class="fa-solid fa-ban"></i> 拉黑邮箱
                            </button>
                            <button class="row-action-btn danger" data-action="delete" data-id="${id}">
                                <i class="fa-solid fa-trash-can"></i> 删除
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.comment-row-check').forEach(cb => {
            cb.addEventListener('change', updateBatchBtn);
        });
        tbody.querySelectorAll('[data-expand]').forEach(btn => {
            btn.addEventListener('click', function () {
                const content = this.closest('.comment-content');
                content.classList.toggle('expanded');
                this.textContent = content.classList.contains('expanded') ? '收起' : '展开完整内容';
            });
        });
        tbody.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function () {
                const action = this.dataset.action;
                const id = this.dataset.id;
                const email = this.dataset.email;
                if (action === 'delete') deleteCommentRow(id);
                else if (action === 'block') blockCommentRow(email);
            });
        });
        updateBatchBtn();
    }

    async function deleteCommentRow(id) {
        if (!id) { toast('缺少评论 ID', 'err'); return; }
        const ok = await confirmDialog({
            title: '删除评论',
            text: '确定要删除这条评论吗？此操作不可恢复。',
            type: 'danger',
            okText: '删除',
        });
        if (!ok) return;
        toast('删除中...', '');
        const res = await deleteComment(id);
        if (res && res.code === 0) {
            toast('评论已删除', 'ok');
            loadComments();
        } else {
            toast((res && res.message) || '删除失败', 'err');
        }
    }

    async function blockCommentRow(email) {
        if (!email) return;
        const ok = await confirmDialog({
            title: '拉黑邮箱',
            text: `确定要将 ${email} 加入黑名单吗？该邮箱的所有新评论将被拦截。`,
            type: 'danger',
            okText: '拉黑',
        });
        if (!ok) return;
        const res = await blockEmail(email, '从评论管理页拉黑');
        if (res && res.code === 0) {
            toast('已加入黑名单', 'ok');
        } else {
            toast((res && res.message) || '操作失败', 'err');
        }
    }

    async function batchDeleteComments() {
        const checked = document.querySelectorAll('.comment-row-check:checked');
        if (!checked.length) return;
        const ok = await confirmDialog({
            title: '批量删除',
            text: `确定要删除选中的 ${checked.length} 条评论吗？此操作不可恢复。`,
            type: 'danger',
            okText: '批量删除',
        });
        if (!ok) return;
        let done = 0, fail = 0;
        for (const cb of checked) {
            const id = cb.dataset.id;
            const res = await deleteComment(id);
            if (res && res.code === 0) done++;
            else fail++;
        }
        toast(`完成：删除 ${done} 条${fail ? `，${fail} 条失败` : ''}`, fail ? 'warn' : 'ok');
        loadComments();
    }

    // ========== IP 白名单 ==========
    function bindWhitelist() {
        document.getElementById('addWlBtn').addEventListener('click', addNewWhitelist);
        document.getElementById('newWlIp').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') addNewWhitelist();
        });
        const search = document.getElementById('wlSearch');
        if (search) search.addEventListener('input', debounce(renderWhitelist, 200));
    }

    async function loadWhitelist() {
        const res = await fetchWhitelist();
        state.whitelist = (res && res.data) || [];
        renderWhitelist();
    }

    function renderWhitelist() {
        const grid = document.getElementById('whitelistGrid');
        const keyword = (document.getElementById('wlSearch') || {}).value || '';
        const list = state.whitelist.filter(i => {
            if (!keyword) return true;
            return (i.ip || '').includes(keyword) || (i.note || '').includes(keyword);
        });
        if (!list.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-shield-halved"></i><p>${state.whitelist.length === 0 ? '暂无白名单 IP' : '无匹配结果'}</p></div>`;
            return;
        }
        grid.innerHTML = list.map(i => `
            <div class="ip-card">
                <div class="ip-card-icon"><i class="fa-solid fa-check"></i></div>
                <div class="ip-card-info">
                    <div class="ip-card-ip">${escapeHtml(i.ip)}</div>
                    <div class="ip-card-note">${escapeHtml(i.note || '无备注')}</div>
                </div>
                <button class="ip-card-del" data-id="${i.ip}" title="移除">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
        grid.querySelectorAll('.ip-card-del').forEach(btn => {
            btn.addEventListener('click', function () { removeFromWhitelist(this.dataset.id); });
        });
    }

    async function addNewWhitelist() {
        const ipInput = document.getElementById('newWlIp');
        const noteInput = document.getElementById('newWlNote');
        const ip = ipInput.value.trim();
        const note = noteInput.value.trim();
        if (!ip) { toast('请输入 IP 地址', 'warn'); return; }
        if (!/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(ip) && !/^[0-9a-fA-F:.]+$/.test(ip)) {
            toast('IP 格式不正确', 'warn');
            return;
        }
        const res = await addWhitelist(ip, note);
        if (res && res.code === 0) {
            toast('已添加到白名单', 'ok');
            ipInput.value = ''; noteInput.value = '';
            loadWhitelist();
        } else {
            toast((res && res.message) || '添加失败', 'err');
        }
    }

    async function removeFromWhitelist(id) {
        const ok = await confirmDialog({
            title: '移除白名单',
            text: '确定要将此 IP 从白名单中移除吗？',
            type: 'warning',
            okText: '移除',
        });
        if (!ok) return;
        const res = await removeWhitelist(id);
        if (res && res.code === 0) {
            toast('已移除', 'ok');
            loadWhitelist();
        } else {
            toast((res && res.message) || '操作失败', 'err');
        }
    }

    // ========== 黑名单 ==========
    function bindBlocklist() {
        document.getElementById('addBlBtn').addEventListener('click', addNewBlock);
        document.getElementById('newBlEmail').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') addNewBlock();
        });
        const search = document.getElementById('blSearch');
        if (search) search.addEventListener('input', debounce(renderBlocklist, 200));
    }

    async function loadBlocklist() {
        const res = await fetchBlocklist();
        state.blocklist = (res && res.data) || [];
        renderBlocklist();
    }

    function renderBlocklist() {
        const wrap = document.getElementById('blocklistWrap');
        const keyword = (document.getElementById('blSearch') || {}).value || '';
        const list = state.blocklist.filter(i => {
            if (!keyword) return true;
            const hay = [i.mail, i.nick, i.ip].join(' ').toLowerCase();
            return hay.includes(keyword);
        });
        if (!list.length) {
            wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>${state.blocklist.length === 0 ? '暂无黑名单记录' : '无匹配结果'}</p></div>`;
            return;
        }
        wrap.innerHTML = list.map(i => {
            const display = i.mail || i.nick || i.ip || '未知';
            const sub = [i.nick ? '昵称:' + i.nick : '', i.ip ? 'IP:' + i.ip : ''].filter(Boolean).join('  ');
            const delKey = i.mail ? 'mail:' + i.mail : (i.ip ? 'ip:' + i.ip : 'nick:' + i.nick);
            return `
            <div class="bl-item">
                <div class="bl-icon"><i class="fa-solid fa-ban"></i></div>
                <div class="bl-info">
                    <div class="bl-email">${escapeHtml(display)}</div>
                    <div class="bl-reason">${escapeHtml(sub || '无备注')}</div>
                </div>
                <button class="bl-remove" data-delkey="${escapeHtml(delKey)}" title="移除">
                    <i class="fa-solid fa-xmark"></i> 移除
                </button>
            </div>`;
        }).join('');
        wrap.querySelectorAll('.bl-remove').forEach(btn => {
            btn.addEventListener('click', function () { removeFromBlocklist(this.dataset.delkey); });
        });
    }

    async function addNewBlock() {
        const emailInput = document.getElementById('newBlEmail');
        const reasonInput = document.getElementById('newBlReason');
        const email = emailInput.value.trim();
        const reason = reasonInput.value.trim();
        if (!email) { toast('请输入邮箱', 'warn'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('邮箱格式不正确', 'warn'); return; }
        const res = await blockEmail(email, reason);
        if (res && res.code === 0) {
            toast('已加入黑名单', 'ok');
            emailInput.value = ''; reasonInput.value = '';
            loadBlocklist();
        } else {
            toast((res && res.message) || '添加失败', 'err');
        }
    }

    async function removeFromBlocklist(id) {
        const ok = await confirmDialog({
            title: '移除黑名单',
            text: '确定要将此邮箱从黑名单中移除吗？',
            type: 'warning',
            okText: '移除',
        });
        if (!ok) return;
        const res = await removeBlocked(id);
        if (res && res.code === 0) {
            toast('已移除', 'ok');
            loadBlocklist();
        } else {
            toast((res && res.message) || '操作失败', 'err');
        }
    }

    // ========== 访问日志 ==========
    function bindVisits() {
        const search = document.getElementById('visitSearch');
        const filter = document.getElementById('visitFilter');
        if (search) search.addEventListener('input', debounce(renderVisits, 200));
        if (filter) filter.addEventListener('change', renderVisits);
    }

    async function loadVisits() {
        const res = await fetchVisitLogs();
        const all = (res && res.data) || [];
        state.visits = all.filter(v => !v.type || String(v.type).indexOf('visit') === 0 || v.page);
        renderVisits();
    }

    function renderVisits() {
        const tbody = document.getElementById('visitsTableBody');
        const keyword = (document.getElementById('visitSearch') || {}).value || '';
        const filter = (document.getElementById('visitFilter') || {}).value || 'all';
        const now = new Date();
        const today0 = new Date(); today0.setHours(0,0,0,0);
        const yest0 = new Date(today0.getTime() - 86400000);

        let list = state.visits;
        if (filter === 'today') list = list.filter(v => Number(v.time) >= today0.getTime());
        else if (filter === 'yesterday') list = list.filter(v => { const t = Number(v.time); return t >= yest0.getTime() && t < today0.getTime(); });
        if (keyword) list = list.filter(v => {
            const text = [(v.page || ''), (v.ip || ''), (v.referrer || '')].join(' ').toLowerCase();
            return text.includes(keyword.toLowerCase());
        });
        list = list.slice(0, 200); // 限制条数

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="3" class="empty-row"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>暂无访问记录</p></div></td></tr>`;
            return;
        }
        tbody.innerHTML = list.map(v => `
            <tr>
                <td><span class="time-cell">${formatTime(v.time)}</span></td>
                <td><span class="path-cell">${escapeHtml(v.page || '/')}</span>
                    <div style="font-size:11px;color:var(--jp-muted);margin-top:2px;">IP: <span class="ip-cell">${escapeHtml(v.ip || '--')}</span></div>
                </td>
                <td><span class="source-cell" title="${escapeHtml(v.referrer || '')}">${escapeHtml(v.referrer || '直接访问')}</span></td>
            </tr>
        `).join('');
    }

    // ========== 设置 ==========
    function bindSettings() {
        document.getElementById('changePwdBtn').addEventListener('click', changePasswordClick);
        const newPwd = document.getElementById('settingNewPwd');
        if (newPwd) newPwd.addEventListener('input', updatePwdStrength);

        // 发送验证码按钮
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        const sendCodeTip = document.getElementById('sendCodeTip');
        let codeCooldown = 0;
        const oldPwdInput = document.getElementById('settingOldPwd');
        const newPwdInput = document.getElementById('settingNewPwd');
        const newPwd2Input = document.getElementById('settingNewPwd2');

        // 检查是否所有必要输入都已填写，启用发送验证码按钮
        function checkSendCodeReady() {
            if (!sendCodeBtn) return;
            const ready = oldPwdInput.value && newPwdInput.value && newPwd2Input.value && codeCooldown === 0;
            sendCodeBtn.disabled = !ready;
        }
        if (oldPwdInput) oldPwdInput.addEventListener('input', checkSendCodeReady);
        if (newPwdInput) newPwdInput.addEventListener('input', checkSendCodeReady);
        if (newPwd2Input) newPwd2Input.addEventListener('input', checkSendCodeReady);

        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', async function () {
                sendCodeBtn.disabled = true;
                const origText = sendCodeBtn.innerHTML;
                sendCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 发送中...';
                try {
                    const res = await sendAdminCode();
                    if (res && res.code === 0) {
                        toast('验证码已发送到管理员邮箱', 'ok');
                        sendCodeTip.textContent = '验证码有效期 10 分钟，请到邮箱查看';
                        // 60 秒防重发
                        codeCooldown = 60;
                        const cdTimer = setInterval(() => {
                            codeCooldown--;
                            if (codeCooldown <= 0) {
                                clearInterval(cdTimer);
                                sendCodeBtn.innerHTML = origText;
                                checkSendCodeReady();
                            } else {
                                sendCodeBtn.innerHTML = `<i class="fa-solid fa-clock"></i> ${codeCooldown}s`;
                            }
                        }, 1000);
                    } else {
                        toast((res && res.message) || '验证码发送失败', 'err');
                        sendCodeBtn.innerHTML = origText;
                        sendCodeBtn.disabled = false;
                    }
                } catch (err) {
                    toast('网络错误，验证码发送失败', 'err');
                    sendCodeBtn.innerHTML = origText;
                    sendCodeBtn.disabled = false;
                }
            });
        }

        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const opt = this.dataset.themeOpt;
                let theme = opt;
                if (opt === 'auto') {
                    const h = new Date().getHours();
                    theme = (h >= 19 || h < 7) ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('admin_theme', theme);
                setTimeout(loadDashboard, 100);
            });
        });

        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', function () {
                state.autoRefresh = this.checked;
                localStorage.setItem('admin_auto_refresh', state.autoRefresh ? '1' : '0');
                document.getElementById('topbarAutoRefresh').setAttribute('aria-pressed', state.autoRefresh ? 'true' : 'false');
                if (state.autoRefresh) setupAutoRefresh();
                else if (state.autoRefreshTimer) clearInterval(state.autoRefreshTimer);
            });
        }
    }

    function loadSettings() {
        document.getElementById('backendUrl').textContent = BACKEND_URL;
        // 显示当前时间
        const updateTime = () => {
            document.getElementById('currentTime').textContent = new Date().toLocaleString('zh-CN', { hour12: false });
        };
        updateTime();
        if (!state._timeTimer) state._timeTimer = setInterval(updateTime, 1000);
        // 加载主题设置
        const savedTheme = localStorage.getItem('admin_theme') || 'auto';
        document.querySelectorAll('.theme-opt').forEach(b => b.classList.toggle('active', b.dataset.themeOpt === savedTheme));
        // 加载自动刷新设置
        const ar = localStorage.getItem('admin_auto_refresh');
        document.getElementById('autoRefreshToggle').checked = ar !== '0';
    }

    function updatePwdStrength() {
        const pwd = this.value;
        const el = document.getElementById('pwdStrength');
        el.hidden = false;
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;
        const levels = [
            { text: '', cls: '' },
            { text: '弱（至少 6 位）', cls: 'strength-weak' },
            { text: '中等', cls: 'strength-medium' },
            { text: '良好', cls: 'strength-medium' },
            { text: '强', cls: 'strength-strong' },
            { text: '极强', cls: 'strength-strong' },
        ];
        const level = levels[Math.min(score, levels.length - 1)];
        el.textContent = level.text;
        el.className = 'pwd-strength ' + level.cls;
    }

    async function changePasswordClick() {
        const oldPwd = document.getElementById('settingOldPwd').value;
        const newPwd = document.getElementById('settingNewPwd').value;
        const newPwd2 = document.getElementById('settingNewPwd2').value;
        const code = document.getElementById('settingCode').value.trim();
        const msg = document.getElementById('changePwdMsg');
        msg.className = 'msg-area'; msg.textContent = '';

        if (!oldPwd || !newPwd) { msg.className = 'msg-area err'; msg.textContent = '请填写完整'; return; }
        if (newPwd.length < 6) { msg.className = 'msg-area err'; msg.textContent = '新密码至少 6 位'; return; }
        if (newPwd !== newPwd2) { msg.className = 'msg-area err'; msg.textContent = '两次输入的新密码不一致'; return; }
        if (oldPwd === newPwd) { msg.className = 'msg-area err'; msg.textContent = '新密码不能与旧密码相同'; return; }
        if (!code) { msg.className = 'msg-area err'; msg.textContent = '请输入邮箱验证码（先点发送验证码按钮）'; return; }
        if (!/^\d{4,6}$/.test(code)) { msg.className = 'msg-area err'; msg.textContent = '验证码格式不正确'; return; }

        msg.textContent = '修改中...';
        const res = await changePassword(oldPwd, newPwd, code);
        if (res && res.code === 0) {
            msg.className = 'msg-area ok';
            msg.textContent = '密码修改成功！请使用新密码重新登录。';
            toast('密码修改成功', 'ok');
            setTimeout(logout, 1500);
        } else {
            msg.className = 'msg-area err';
            msg.textContent = (res && res.message) || '修改失败（可能是密码或验证码不正确）';
            toast((res && res.message) || '修改失败', 'err');
        }
    }

    // ========== 通用工具 ==========
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    function stripHtml(str) {
        if (!str) return '';
        return String(str).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
    }

    function formatTime(t) {
        if (!t) return '--';
        const d = new Date(t);
        if (isNaN(d.getTime())) return String(t);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return '刚刚';
        if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
        if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
        return d.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            hour12: false,
        });
    }

    function debounce(fn, ms) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, arguments), ms);
        };
    }

    function renderPagination(total, current, pageSize, containerId, onChange) {
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const container = document.getElementById(containerId);
        if (!container) return;
        if (totalPages <= 1) { container.innerHTML = ''; return; }
        let html = `<button class="page-btn" ${current === 1 ? 'disabled' : ''} data-page="${current - 1}">上一页</button>`;
        const start = Math.max(1, current - 2);
        const end = Math.min(totalPages, start + 4);
        for (let i = start; i <= end; i++) {
            html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        html += `<button class="page-btn" ${current === totalPages ? 'disabled' : ''} data-page="${current + 1}">下一页</button>`;
        container.innerHTML = html;
        container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const p = parseInt(this.dataset.page);
                if (!isNaN(p)) onChange(p);
            });
        });
    }

    // ===== 全局暴露给 onclick =====
    window.forgotSendCodeClick = async function () {
        const btn = document.getElementById('btnForgotSend');
        const tip = document.getElementById('forgotTip');
        if (!btn || !tip) return;
        if (btn.disabled && btn.textContent !== '发送验证码') return;
        btn.disabled = true; btn.textContent = '发送中...';
        tip.className = 'forgot-tip'; tip.textContent = '';
        try {
            const r = await fetch(TWIKOO_API, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'QW_FORGOT_SEND_CODE', email: '2554191057@qq.com' })
            }).then(r => r.json());
            if (r.code === 0) {
                tip.className = 'forgot-tip ok'; tip.textContent = '✅ 验证码已发，请查收邮箱';
                let cd = 60;
                const t = setInterval(() => {
                    cd--;
                    if (cd <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = '发送验证码'; }
                    else { btn.textContent = cd + 's'; }
                }, 1000);
            } else {
                tip.className = 'forgot-tip err'; tip.textContent = '❌ ' + (r.message || '发送失败');
                btn.disabled = false; btn.textContent = '发送验证码';
            }
        } catch (e) {
            tip.className = 'forgot-tip err'; tip.textContent = '❌ 网络错误';
            btn.disabled = false; btn.textContent = '发送验证码';
        }
    };

    window.forgotResetClick = async function () {
        const code = document.getElementById('forgotCode').value.trim();
        const pwd = document.getElementById('forgotNewPwd').value;
        const pwd2 = document.getElementById('forgotNewPwd2').value;
        const tip = document.getElementById('forgotTip');
        const btn = document.getElementById('btnForgotReset');
        if (!code || !pwd || !pwd2) { tip.className = 'forgot-tip err'; tip.textContent = '请填完整'; return; }
        if (pwd.length < 6) { tip.className = 'forgot-tip err'; tip.textContent = '密码至少 6 位'; return; }
        if (pwd !== pwd2) { tip.className = 'forgot-tip err'; tip.textContent = '两次密码不一致'; return; }
        btn.disabled = true; btn.textContent = '重置中...';
        try {
            const r = await fetch(TWIKOO_API, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'QW_FORGOT_RESET_PASSWORD', email: '2554191057@qq.com', code, newPass: pwd })
            }).then(r => r.json());
            if (r.code === 0) {
                tip.className = 'forgot-tip ok'; tip.textContent = '✅ 密码已重置，请用新密码登录';
                setTimeout(() => { document.getElementById('forgotModal').hidden = true; btn.disabled = false; btn.textContent = '重置密码'; }, 1500);
            } else {
                tip.className = 'forgot-tip err'; tip.textContent = '❌ ' + (r.message || '重置失败');
                btn.disabled = false; btn.textContent = '重置密码';
            }
        } catch (e) {
            tip.className = 'forgot-tip err'; tip.textContent = '❌ 网络错误';
            btn.disabled = false; btn.textContent = '重置密码';
        }
    };
})();
