# Troubleshooting

## The app does not start

- Make sure dependencies are installed with `npm.cmd install`
- Re-run `npm.cmd run check` to catch syntax problems quickly
- If the desktop shell is the problem, try `npm.cmd run serve` first to confirm the private web app still starts cleanly

## Notes are not appearing

- Run `npm.cmd run smoke-store`
- Run `npm.cmd run smoke-server`
- Check that the local data directory is writable

## Another device cannot reach SyncPad

- Confirm you started SyncPad on your Tailscale IP, not only on `127.0.0.1`
- `start-host.cmd` is the simplest way to do that on the host machine
- Confirm the host machine is still running SyncPad
- Open the exact URL shown by SyncPad, for example `http://100.119.231.37:3210/`
- Confirm Tailscale is connected on both devices

## Backup import issues

- Make sure you are importing a SyncPad JSON backup file
- Imported notes merge with local notes and keep the newer version when IDs match
- If nothing imports, open the file and confirm it contains a `notes` array

## Local data path

SyncPad stores notes by default in:

`C:\Users\<you>\AppData\Local\MyData\SyncPad\notes.json`

You can override that root with `MYDATA_DIR`.

## Electron window issues

- Close any stuck Electron processes
- Start the app again with `npm.cmd start`
- SyncPad already disables hardware acceleration to avoid the GPU launch crash seen on some Windows machines
- If you only need the host server, use `start-host.cmd` instead of the full desktop app

## Windows build issues

- The Windows installer build now works on this machine with `signAndEditExecutable` disabled
- If you rebuild and get a code-signing or symlink error again, re-run `npm.cmd run dist:win` from this repo after dependencies are installed

## A note changed on another device while I was typing

- SyncPad protects your work by creating a `conflict copy`
- The newer remote version stays in place
- Your unsaved local edit is kept as a separate note so nothing is silently lost
