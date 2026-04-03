# SyncPad Architecture

## Current Shape

The first implementation is intentionally small:

- Electron desktop shell
- Local JSON storage under `LOCALAPPDATA\MyData\SyncPad`
- Renderer UI for note list, search, and editing
- IPC bridge between the renderer and the local store

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

## Why This Direction

- Fast to start
- Good fit for Windows desktop use
- Keeps the app offline-first
- Leaves a clean place to add sync later without rebuilding the whole app

## Future Sync Layer

The sync layer should eventually:

- upload note changes from the local store
- pull remote updates down to the local store
- handle conflicts safely
- expose sync state in the UI

That work is intentionally deferred until the local note experience feels right.
