# 一键部署：Cloudflare Pages + 花生壳
# 用法：在项目目录运行 .\deploy.ps1

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

Write-Host "==> [1/2] 部署到 Cloudflare Pages (qqzttkx.eu.cc)..." -ForegroundColor Cyan
wrangler pages deploy . --project-name qingqingzhiboke --branch main --commit-dirty=true

Write-Host "`n==> [2/2] 部署到花生壳 (qqzttkx.ficp.fun)..." -ForegroundColor Cyan
hsk-cli file-hosting "D:\Download\qingqingzhiboke" --entry-file yanzheng.html --format json

Write-Host "`n==> 完成！" -ForegroundColor Green
Write-Host "  Cloudflare: https://qqzttkx.eu.cc"
Write-Host "  花生壳:     https://qqzttkx.ficp.fun"
Write-Host "  注意：花生壳是新资源，需到控制台把旧的删了、新资源绑回主域名。" -ForegroundColor Yellow
