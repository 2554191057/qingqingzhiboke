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
**用户固定要求（2026-09-15 确认）：部署链接一律为 `https://qqzttkx.ficp.fun/`，严禁新建 HSK 资源。**

- 公网域名 `https://qqzttkx.ficp.fun/` 已由用户在花生壳后台绑定到资源 `1789472958204165095`（已重绑，当前域名即最新内容，已验证 style v=266 / script v=73）。
- 旧资源 `1787743956892235141` / `1789471342039255230` / `1789471753168216449` / `1789472499149792180` 均已被平台禁用更新（403 update function is disabled），不得再用于部署。

**每次修改 index.html / style.css / script.js（或任意网站文件）并 git 提交后，必须同步执行一次在线部署：**

```bash
hsk-cli file-hosting "D:\Download\qingqingzhiboke" --entry-file index.html --resource-id 1789472958204165095 --format json
```

- hsk-cli 已全局安装（@aweray/hsk-cli，当前版本 0.7.13），API Key 已保存在 `~/.hsk/api_key.json`（file_hosting 场景），无需重复配置；找不到 `hsk-cli` 命令时先 `npm install -g @aweray/hsk-cli` 并 `hsk-cli update`。业务命令前须先跑 `hsk-cli context wizard --format json` 建立画像（见 https://hsk.oray.com/doc/cli-setup.md）。
- 部署成功后用 `curl https://qqzttkx.ficp.fun/` 验证线上版本（index.html 里的 style.css/script.js 版本号）与本地一致。
- **严禁新建任何 HSK 资源**（用户明确要求）：若复用资源 `1789472958204165095` 更新返回 403（免费资源更新被平台禁用），**停止部署并如实向用户说明，等待用户指示**（可选项：开通正式版 / 转 GitHub Pages），不得擅自创建新资源。







