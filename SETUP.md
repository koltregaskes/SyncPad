# Setup

## Requirements

- Windows
- Node.js
- npm

## Install

```powershell
npm.cmd install
```

## Run The Desktop App

```powershell
npm.cmd start
```

This starts the Electron app and the embedded SyncPad server together.

## Run The Private Web App Only

```powershell
npm.cmd run serve
```

That keeps SyncPad browser-based and local to this machine on `127.0.0.1:3210` by default.

## Run Over Tailscale

To make SyncPad available on your own devices over Tailscale:

```powershell
$env:SYNC_PAD_HOST="100.119.231.37"
$env:SYNC_PAD_PORT="3210"
npm.cmd start
```

Or on Windows Command Prompt:

```cmd
start-tailscale.cmd
```

Then open:

`http://100.119.231.37:3210/`

from your other Windows machine or iPad while the app stays running.

## Verify

```powershell
npm.cmd run check
npm.cmd run smoke-store
npm.cmd run smoke-server
```

## Local Data

By default, SyncPad stores notes in:

`C:\Users\<you>\AppData\Local\MyData\SyncPad\notes.json`

You can override the base directory with:

`MYDATA_DIR`

## Hosting Rule

- `127.0.0.1` for one machine only
- `100.x.x.x` Tailscale IP for your own devices
- no `0.0.0.0` required
