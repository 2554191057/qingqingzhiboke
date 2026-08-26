# AGENTS.md — 本项目工作规则

## 版本控制与防误删（必须遵守）

本项目已用 Git 做本地版本控制（无远程仓库）。第一个基线快照 commit 为 `0c9df61`，所有代码都在版本库里，任何改动都可回溯。

### 修改前必做：先提交检查点
- 动手修改/删除/覆盖任何代码文件之前，先执行 `git status` 确认工作区状态。
- 若工作区有未提交的改动，必须先 `git add -A` 并 `git commit -m "检查点：<本次改动说明>"` 保存当前状态，再开始修改。
- **严禁在未提交的情况下直接覆盖或删除已有代码文件**——这是本项目唯一的"事故来源"，必须杜绝。
- 删除任何文件前，先确认该文件已存在于最近一次提交中（`git ls-files <文件路径>`），否则先提交再做删除。

### 推送远程（双保险，必须执行）
- 本项目已关联 Gitee 私有远程仓库：`https://gitee.com/qingqingzhinb/qingqingzhiboke.git`（Gitee 账号：qingqingzhinb）。
- 每次 `git commit` 之后，**必须**执行 `git push origin master` 把改动同步到远程，作为本地之外的第二重备份。
- 若远程与本地不一致（提示 non-fast-forward），先 `git pull --rebase origin master` 再推送，禁止直接 force push。

### 常用命令
- 查看历史快照：`git log --oneline`
- 查看某次快照改了什么：`git show <commit>`
- 撤销未提交的改动（还原到最近提交）：`git restore .`
- 恢复被误删的文件：`git restore <文件路径>` 或 `git checkout HEAD -- <文件路径>`
- 回退到某次快照：`git reset --hard <commit>`（误操作后仍可用 `git reflog` 找回）
- 回溯统一走 Git/Gitee：本地每次提交都已同步到 Gitee 远程仓库，需要回退时直接用上面的 Git 命令即可。

## 环境
- Git 安装在 `D:\Git\cmd`。若当前终端找不到 `git` 命令，把 `D:\Git\cmd` 加入 PATH 或使用完整路径 `D:\Git\cmd\git.exe`。
- 本仓库的 git 提交身份（local 级 user.name / user.email）已配置，请勿改动。
