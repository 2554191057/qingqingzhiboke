# 一键部署到 Cloudflare Pages
# 用法：在项目目录右键 PowerShell 运行，或：.\deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "==> 部署到 Cloudflare Pages..." -ForegroundColor Cyan
wrangler pages deploy . --project-name qingqingzhiboke --branch main --commit-dirty=true

Write-Host "`n==> 完成！访问 https://qqzttkx.eu.cc" -ForegroundColor Green
