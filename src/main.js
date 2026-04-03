const path = require("path");
const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const store = require("./store");
const { createSyncPadServer, getClientOrigin } = require("./server");

app.disableHardwareAcceleration();

let embeddedServerHandle = null;
const embeddedHost = process.env.SYNC_PAD_HOST || "127.0.0.1";
const embeddedPort = Number(process.env.SYNC_PAD_PORT || 3210);

function createWindow(origin) {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#f5f1e8",
    title: "SyncPad",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.loadURL(origin);
}

ipcMain.handle("app:status", async () => ({
  ...(await store.getStatus()),
  sync: embeddedHost === "127.0.0.1" ? "Local-only desktop app" : "Private Tailscale sync app"
}));

ipcMain.handle("notes:list", () => store.listNotes());
ipcMain.handle("notes:get", (_, noteId) => store.getNote(noteId));
ipcMain.handle("notes:create", (_, title) => store.createNote(title));
ipcMain.handle("notes:duplicate", (_, noteId) => store.duplicateNote(noteId));
ipcMain.handle("notes:save", (_, noteId, updates) => store.saveNote(noteId, updates));
ipcMain.handle("notes:delete", (_, noteId) => store.deleteNote(noteId));
ipcMain.handle("backup:export", async () => {
  const backup = await store.exportBackup();
  const defaultPath = path.join(app.getPath("documents"), `syncpad-backup-${new Date().toISOString().slice(0, 10)}.json`);
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Export SyncPad backup",
    defaultPath,
    filters: [{ name: "JSON backup", extensions: ["json"] }]
  });

  if (canceled || !filePath) {
    return { canceled: true };
  }

  await fs.writeFile(filePath, JSON.stringify(backup, null, 2), "utf-8");
  return {
    canceled: false,
    filePath,
    noteCount: backup.noteCount
  };
});
ipcMain.handle("backup:import", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Import SyncPad backup",
    properties: ["openFile"],
    filters: [{ name: "JSON backup", extensions: ["json"] }]
  });

  if (canceled || !filePaths.length) {
    return { canceled: true };
  }

  const raw = await fs.readFile(filePaths[0], "utf-8");
  const parsed = JSON.parse(raw);
  const result = await store.importBackup(parsed);

  return {
    canceled: false,
    filePath: filePaths[0],
    ...result
  };
});

app.whenReady().then(async () => {
  embeddedServerHandle = await createSyncPadServer({
    host: embeddedHost,
    port: embeddedPort
  }).start();

  createWindow(getClientOrigin(embeddedHost, embeddedServerHandle.port));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(getClientOrigin(embeddedHost, embeddedServerHandle.port));
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (event) => {
  if (!embeddedServerHandle) {
    return;
  }

  event.preventDefault();
  const activeHandle = embeddedServerHandle;
  embeddedServerHandle = null;
  await activeHandle.stop();
  app.quit();
});
