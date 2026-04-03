# SyncPad

`SyncPad` is a desktop-first notes app for Windows with local storage today and a future cloud sync path.

The goal is straightforward: something that feels as quick and lightweight as Notepad, but keeps notes synced between machines automatically.

## Product Idea

- Desktop-first, not web-first
- Fast note editing with minimal friction
- Local files or local cache first
- Background cloud sync between Windows devices
- Simple enough to live open all day

## Intended User Experience

- Open the app and start typing immediately
- Notes autosave locally
- Changes sync quietly in the background
- The same notes appear on another machine after sync
- No heavy workspace or document-management overhead

## First Version Scope

- Plain text or markdown notes
- Note list and editor view
- Create, rename, delete, and search notes
- Autosave
- Sync status indicator
- Basic conflict handling when the same note changes on two devices

## Likely Technical Direction

This repo is currently just the starting point, but the intended build direction is:

- Windows desktop app
- Offline-first local storage
- Cloud-backed sync service
- Lightweight UI focused on speed and reliability

## Non-Goals For The First Version

- Browser-first experience
- Team collaboration
- Rich document formatting
- Complex workspace/project management
- Feature bloat

## Current Status

- Desktop Electron scaffold is in place
- Local note storage works through a JSON store under `LOCALAPPDATA\MyData\SyncPad`
- Note list, search, create, delete, and autosave are implemented
- Cloud sync is still the next major phase

## Next Steps

1. Refine the local note experience and keyboard shortcuts
2. Decide the first sync backend
3. Add device-to-device sync
4. Add conflict handling and sync recovery
5. Add polish such as markdown preview only if it still feels lightweight

## Positioning

SyncPad is meant to be the simplest possible answer to:

"I want my notes to feel local and instant, but I also want them available on all my Windows machines."

## Repo Layout

- `src/main.js` - Electron main process
- `src/preload.js` - safe renderer bridge
- `src/store.js` - local note storage
- `src/renderer/` - desktop UI
- `scripts/smoke-store.js` - quick storage smoke test
- `SETUP.md` - install and run notes
- `ARCHITECTURE.md` - storage and app shape
