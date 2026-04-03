@echo off
setlocal
echo Starting SyncPad host using your saved config...
echo If your config is in host mode, this machine will serve notes to your own devices.
node src\server.js
