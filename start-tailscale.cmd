@echo off
setlocal
set SYNC_PAD_HOST=100.119.231.37
set SYNC_PAD_PORT=3210
echo Starting SyncPad on http://%SYNC_PAD_HOST%:%SYNC_PAD_PORT%
echo Open that address on your Windows machines or iPad while this app stays running.
npm.cmd start
