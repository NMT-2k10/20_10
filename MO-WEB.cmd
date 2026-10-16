@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Can cai Node.js tu https://nodejs.org truoc khi chay.
  pause
  exit /b 1
)
node tools/start.mjs
pause
