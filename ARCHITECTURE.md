# SyncPad Architecture

## Current Shape

The current implementation has two front doors over one shared store:

- Electron desktop shell
- Private web client served by a small Node HTTP server
- Host/client configuration stored in a local config file
- Local JSON storage under `LOCALAPPDATA\MyData\SyncPad`
- Server-Sent Events for live note refresh across connected devices

## Storage Model

The app stores a single JSON file:

- `notes.json`

The structure is:

```json
{
  "notes": [],
  "lastOpenNoteId": null
}
```

Each note contains:

- `id`
- `title`
- `content`
- `createdAt`
- `updatedAt`

## Server Model

`src/server.js` serves:

- the browser client from `src/renderer`
- `/api/notes` endpoints for CRUD
- `/api/backup` endpoints for export and import
- `/api/events` for live updates
- `/api/status` for client status and hosting details

By default the server binds to:

- `127.0.0.1:3210`

but it can instead bind to a Tailscale IP such as:

- `100.x.y.z:3210`

`src/config.js` stores:

- whether this machine is the `host` or a `client`
- the bind IP
- the port
- the remote host origin for client machines

## Why This Direction

- Fast to start
- Good fit for Windows desktop use
- Also works well from Safari on iPad or a browser on another Windows machine
- Keeps the app local-first and private
- Leaves room for richer sync without rebuilding everything

## Sync Safety

SyncPad currently uses a lightweight safe-write model:

- clients save against the note timestamp they last loaded
- if another device changed that note first, the save is rejected
- the client then creates a conflict copy so the local edit is still preserved

This is intentionally simpler than a full collaborative editor, but it is much safer than silent last-write-wins overwrites.
