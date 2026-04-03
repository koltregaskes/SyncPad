# Troubleshooting

## The app does not start

- Make sure dependencies are installed with `npm.cmd install`
- Re-run `npm.cmd run check` to catch syntax problems quickly

## Notes are not appearing

- Run `npm.cmd run smoke-store`
- Check that the local data directory is writable

## Local data path

SyncPad stores notes by default in:

`C:\Users\<you>\AppData\Local\MyData\SyncPad\notes.json`

You can override that root with `MYDATA_DIR`.

## Electron window issues

- Close any stuck Electron processes
- Start the app again with `npm.cmd start`
