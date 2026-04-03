@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0cleanup-packaging-lock-on-reboot.ps1"
