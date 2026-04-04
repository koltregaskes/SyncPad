@echo off
setlocal
if not "%~1"=="" set "SYNC_PAD_HOST=%~1"
if "%SYNC_PAD_HOST%"=="" (
  echo Please provide your Tailscale IP or set SYNC_PAD_HOST first.
  echo Example: start-tailscale.cmd 100.x.y.z
  exit /b 1
)
if "%SYNC_PAD_PORT%"=="" set SYNC_PAD_PORT=3210
echo Starting SyncPad on http://%SYNC_PAD_HOST%:%SYNC_PAD_PORT%
echo Open that address on your Windows machines or iPad while this app stays running.
npm.cmd start
