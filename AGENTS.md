# AGENTS.md — 本项目工作规则

## 版本控制与防误删（必须遵守）

本项目已用 Git 做本地版本控制，第一个基线快照 commit 为 `0c9df61`，所有代码都在版本库里，任何改动都可回溯。

### 修改前必做：先提交检查点
- 动手修改/删除/覆盖任何代码文件之前，先执行 `git status` 确认工作区状态。
- 若工作区有未提交的改动，必须先 `git add -A` 并 `git commit -m "检查点：<本次改动说明>"` 保存当前状态，再开始修改。
- **严禁在未提交的情况下直接覆盖或删除已有代码文件**——这是本项目唯一的"事故来源"，必须杜绝。
- 删除任何文件前，先确认该文件已存在于最近一次提交中（`git ls-files <文件路径>`），否则先提交再做删除。

### 推送远程（双保险，必须执行）
- **Gitee（主备份，国内稳定）**：`origin` = https://gitee.com/qingqingzhinb/qingqingzhiboke.git（Gitee 账号：qingqingzhinb）。每次 `git commit` 后**必须** `git push origin master`。
- **GitHub（网站部署）**：`github` = https://github.com/2554191057/qingqingzhiboke.git（GitHub 账号：2554191057，已部署 GitHub Pages：https://2554191057.github.io/qingqingzhiboke/）。每次提交后**也尝试** `git push github master`（GitHub 国内网络可能不稳定，若失败稍后重试；Gitee 是可靠兜底）。
- 若远程与本地不一致（non-fast-forward），先 `git pull --rebase origin master` 再推送，禁止直接 force push。

### 常用命令
- 查看历史快照：`git log --oneline`
- 查看某次快照改了什么：`git show <commit>`
- 撤销未提交的改动（还原到最近提交）：`git restore .`
- 恢复被误删的文件：`git restore <文件路径>` 或 `git checkout HEAD -- <文件路径>`
- 回退到某次快照：`git reset --hard <commit>`（误操作后仍可用 `git reflog` 找回）
- 回溯统一走 Git：本地每次提交都已同步到 Gitee/GitHub 远程，需要回退时直接用上面的 Git 命令即可。

## 环境
- Git 安装在 `D:\Git\cmd`。若当前终端找不到 `git` 命令，把 `D:\Git\cmd` 加入 PATH 或使用完整路径 `D:\Git\cmd\git.exe`。
- 本仓库的 git 提交身份（local 级 user.name / user.email）已配置，请勿改动。

## 在线部署（每次修改后必须执行）
**用户固定要求（2026-09-15 确认）：部署链接一律为 `https://qqzttkx.ficp.fun/`。免费档资源二次更新返回 403（update function is disabled），故每次部署=新建资源 + 花生壳控制台删旧绑主域名（用户已接受该方案）。**

- 公网入口为 `yanzheng.html`（图形验证码，验证通过跳 boke.html；背景已改为樱花引导页 NianBroken/Personal_Sakura_Guide_Page 同款 WebGL 樱花飘落：深色 #1b1f22 背景 + 全屏 #sakura canvas，脚本在 `js/sakura/`，按 config→math→shaders→gl-utils→renderer→bootstrap 顺序引入）；主域名 `https://qqzttkx.ficp.fun/` 当前绑定资源 `9oxmby`（resource_id 1789556341694980066；临时域名 https://9oxmby.gicp.fun，2026-09-16 部署，已线上验证气泡布局 chat-widget.js 与 yanzheng/boke/fklts 200）。
- 页面：boke（首页）/ wenzhang（文章）/ wangpan（资源）/ fklts（访客聊天室独立页，Twikoo path 仍为 'chat' 保证旧评论不丢；可直接访问）/ shengri（生日）/ yanzheng（验证入口）。
- **全站悬浮访客聊天室（2026-09-16 改造，用户要求"悬浮在页面上不跳转"）**：`chat-widget.js`（新文件）自包含注入 CSS+HTML+Twikoo 资源，实现 qiguangji ChatRoom 形态——右下角悬浮按钮 `.qw-launcher`（毛玻璃、accent 边框、绿点）→ 点击打开 `.qw-backdrop` 遮罩（blur）+ `.qw-panel` 460px 居中面板（--jp-surface、圆角 18px、--jp-glow 辉光），关闭走 X/遮罩/Esc，不跳转回原页面；已接入 boke/wenzhang/wangpan/shengri（script.js 或 site-config.js 之后一行引用）；导航里指向 fklts.html/chat.html 的链接被拦截为打开弹窗；Twikoo init 首次打开时懒加载（envId=Netlify 端点、el:'#tcomment'、path:'chat'）；色板 --jp-* 由 chat-widget.js 注入，日夜跟随页面 data-theme。fklts.html 保留为独立页（整页 qiguangji 布局），直接访问可用。

## 访客聊天室（Twikoo + Netlify + MongoDB Atlas，2026-09-16 接入，替代原 CloudBase 方案）
- 后端（评论存储）：MongoDB Atlas 免费 M0 集群 Cluster0（AWS us-east-1），数据库用户 `2554191057_db_user`（SCRAM，密码 `Twikoo2026!Netlify`，连接串中需 URL 编码为 `Twikoo2026%21Netlify`），IP 白名单 `0.0.0.0/0`（备注 Netlify Twikoo）。连接串已设到 Netlify 环境变量 MONGODB_URI（含 `&authSource=admin`）。
- 函数（Twikoo 云函数）：Netlify 站点 `qqzttkx-twikoo`（Project ID `6a4ab111-b5a1-47de-b9ca-df6512402615`），URL `https://qqzttkx-twikoo.netlify.app`；函数端点即前端 envId：`https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo`（curl 用文件方式传 body，避免 PowerShell 转义；`{"code":0,...}` 即正常；`bad auth : Authentication failed.` 表示 MongoDB 认证失败——检查密码/连接串）。
- 部署源：本地 `D:\Download\twikoo-netlify`（git clone 自 github.com/twikoojs/twikoo-netlify，netlify/functions/twikoo.js 依赖 twikoo-netlify:latest；本地 `npm install` 装好 node_modules）。重部署：`netlify login`（CLI 已授权）→ `netlify deploy --prod --dir . --functions netlify/functions`。
- 前端：fklts.html（原 chat.html）引入 `https://registry.npmmirror.com/twikoo/1.7.24/files/dist/twikoo.all.min.(js|css)`，`twikoo.init({envId: 'https://qqzttkx-twikoo.netlify.app/.netlify/functions/twikoo', el: '#tcomment', path: 'chat', lang: 'zh-CN'})`（无 region）。**必须传 `el: '#tcomment'`：Twikoo 1.7.24 前端无 el 参数时静默不渲染（2026-09-16 实测踩坑，commit 6f1be7e）。**
- 历史（勿复用 envId）：原 CloudBase 免费体验版 `qqzchat-d4gzkl19e2eab7a75`（因免费版无法配置 Web 安全域名而弃用，环境仍在线到期 2027-03-16）。
- 资源链（每代删旧绑新）：…→ kfibxa(1789526813930880719，已删) → prjgi7(1789533091330468453，已删) → qyizjt(1789542275151980223，已删) → qxam0b(1789543501665508287，已删) → ewro0s(1789545586308913470，误删) → dqlwk6(1789545803195246821，已删) → 6xakqh(1789547319089375540，已删) → 5rp7l7(resource_id 未录，已删) → 85rw4s(resource_id 未录，已删) → w52pl5(1789550401975329912，已删) → la58ao(1789550839303866721，已删) → v0uwgo(1789551196548961937，已删) → jns0r2(1789551496350318014，已删) → 4fobm8(1789551905956966529，已删) → nfbqmt(1789552427885979097，已删) → scj6yt(1789553652545030793，已删) → **9oxmby(1789556341694980066，当前)**。控制台"分配自定义域名"弹窗：选闲置域名下拉选 qqzttkx.ficp.fun → 自动绑定生效（可用 bu.select 或 JS 设 select.value+dispatch change；若 JS 查询 selVal 显示 none 但弹窗已变"已生效"即成功；点"添加"有时需 JS 精确 dispatch pointer 事件链到行内 <a>）。注意：控制台"删除资源"按钮（Vue 组件）自动化点击/键盘均无法触发，需用户接管手动删除（2026-09-16 实测）。

**每次 git 提交后必须同步执行一次在线部署（新建资源）：**

```bash
hsk-cli file-hosting "D:\Download\qingqingzhiboke" --entry-file yanzheng.html --format json
```

- 返回 `data.resource_id` 与 `data.public_url`（临时域名）。随后在花生壳控制台（console-hsk-ng.oray.com → 静态托管应用）删除旧资源并给新资源绑定主域名 `qqzttkx.ficp.fun`（bu 自动化序列：点行内"删除资源"→弹窗"确定"→刷新→点新资源行"添加"→select 选 qqzttkx.ficp.fun 不含 qqzttkxpd → dispatch change，弹窗显示"已生效"即成功）。
- hsk-cli 已全局安装（@aweray/hsk-cli，当前版本 0.7.13），API Key 已保存在 `~/.hsk/api_key.json`（file_hosting 场景），无需重复配置；找不到 `hsk-cli` 命令时先 `npm install -g @aweray/hsk-cli` 并 `hsk-cli update`。业务命令前须先跑 `hsk-cli context wizard --format json` 建立画像（见 https://hsk.oray.com/doc/cli-setup.md）。
- 部署成功后用 `curl https://qqzttkx.ficp.fun/yanzheng.html` 和 `curl https://qqzttkx.ficp.fun/boke.html` 验证线上内容与本地一致（boke.html 应含"看板娘"集成标记）。
- 每次部署完成后更新本文件"当前绑定资源"为新 resource_id，并提交推送。









