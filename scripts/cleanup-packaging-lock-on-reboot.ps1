$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$targets = @(
  (Join-Path $repoRoot "dist\win-unpacked"),
  (Join-Path $repoRoot "dist-final\win-unpacked")
)

$cleanupScript = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$targets = @(
$(($targets | ForEach-Object { "  '" + ($_ -replace "'", "''") + "'" }) -join ",`r`n")
)
foreach (`$target in `$targets) {
  if (Test-Path -LiteralPath `$target) {
    Remove-Item -LiteralPath `$target -Recurse -Force
  }
}
Remove-Item -LiteralPath 'HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce\SyncPadCleanupPackagingLock' -Force
"@

$encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($cleanupScript))

New-ItemProperty `
  -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce" `
  -Name "SyncPadCleanupPackagingLock" `
  -PropertyType String `
  -Value "powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand $encodedCommand" `
  -Force | Out-Null

Write-Host "Cleanup queued for next sign-in after reboot."
Write-Host "Targets:"
$targets | ForEach-Object { Write-Host " - $_" }
