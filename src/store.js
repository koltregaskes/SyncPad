const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

function getBaseDir() {
  if (process.env.MYDATA_DIR) {
    return process.env.MYDATA_DIR;
  }

  if (process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, "MyData");
  }

  return path.join(process.cwd(), ".data");
}

function getStoreDir() {
  return path.join(getBaseDir(), "SyncPad");
}

function getStoreFile() {
  return path.join(getStoreDir(), "notes.json");
}

async function ensureStore() {
  const dir = getStoreDir();
  const file = getStoreFile();

  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(
      file,
      JSON.stringify({ notes: [], lastOpenNoteId: null }, null, 2),
      "utf-8"
    );
  }

  return file;
}

async function loadState() {
  const file = await ensureStore();
  const raw = await fs.readFile(file, "utf-8");
  const parsed = JSON.parse(raw);

  return {
    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    lastOpenNoteId: parsed.lastOpenNoteId || null
  };
}

async function saveState(state) {
  const file = await ensureStore();
  await fs.writeFile(file, JSON.stringify(state, null, 2), "utf-8");
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function normaliseNote(note) {
  if (!note || typeof note !== "object") {
    return null;
  }

  const now = new Date().toISOString();
  const title = typeof note.title === "string" && note.title.trim()
    ? note.title.trim()
    : "Untitled note";
  const content = typeof note.content === "string" ? note.content : "";
  const createdAt = typeof note.createdAt === "string" && note.createdAt
    ? note.createdAt
    : now;
  const updatedAt = typeof note.updatedAt === "string" && note.updatedAt
    ? note.updatedAt
    : createdAt;

  return {
    id: typeof note.id === "string" && note.id ? note.id : randomUUID(),
    title,
    content,
    createdAt,
    updatedAt
  };
}

async function listNotes() {
  const state = await loadState();
  return sortNotes(state.notes);
}

async function getStatus() {
  const state = await loadState();
  return {
    noteCount: state.notes.length,
    lastOpenNoteId: state.lastOpenNoteId || null,
    storageFile: getStoreFile()
  };
}

async function getNote(noteId) {
  const state = await loadState();
  return state.notes.find((note) => note.id === noteId) || null;
}

async function createNote(title = "Untitled note") {
  const state = await loadState();
  const now = new Date().toISOString();
  const note = {
    id: randomUUID(),
    title,
    content: "",
    createdAt: now,
    updatedAt: now
  };

  state.notes.push(note);
  state.lastOpenNoteId = note.id;
  await saveState(state);

  return note;
}

async function duplicateNote(noteId) {
  const state = await loadState();
  const source = state.notes.find((item) => item.id === noteId);

  if (!source) {
    throw new Error("Note not found");
  }

  const now = new Date().toISOString();
  const note = {
    id: randomUUID(),
    title: `${source.title || "Untitled note"} copy`,
    content: source.content || "",
    createdAt: now,
    updatedAt: now
  };

  state.notes.push(note);
  state.lastOpenNoteId = note.id;
  await saveState(state);

  return note;
}

async function saveNote(noteId, updates) {
  const state = await loadState();
  const note = state.notes.find((item) => item.id === noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  note.title = (updates.title || note.title || "Untitled note").trim() || "Untitled note";
  note.content = updates.content ?? note.content;
  note.updatedAt = new Date().toISOString();
  state.lastOpenNoteId = note.id;

  await saveState(state);
  return note;
}

async function deleteNote(noteId) {
  const state = await loadState();
  const filtered = state.notes.filter((note) => note.id !== noteId);

  if (filtered.length === state.notes.length) {
    return false;
  }

  state.notes = filtered;
  if (state.lastOpenNoteId === noteId) {
    state.lastOpenNoteId = filtered[0]?.id || null;
  }

  await saveState(state);
  return true;
}

async function exportBackup() {
  const state = await loadState();
  return {
    exportedAt: new Date().toISOString(),
    noteCount: state.notes.length,
    lastOpenNoteId: state.lastOpenNoteId || null,
    notes: sortNotes(state.notes).map((note) => ({ ...note }))
  };
}

async function importBackup(payload) {
  const importedNotes = Array.isArray(payload?.notes)
    ? payload.notes.map(normaliseNote).filter(Boolean)
    : [];

  if (!importedNotes.length) {
    throw new Error("Backup does not contain any notes");
  }

  const state = await loadState();
  const merged = new Map();

  for (const note of state.notes.map(normaliseNote).filter(Boolean)) {
    merged.set(note.id, note);
  }

  for (const note of importedNotes) {
    const existing = merged.get(note.id);
    if (!existing) {
      merged.set(note.id, note);
      continue;
    }

    merged.set(
      note.id,
      existing.updatedAt >= note.updatedAt ? existing : note
    );
  }

  const nextState = {
    notes: Array.from(merged.values()),
    lastOpenNoteId: payload?.lastOpenNoteId || state.lastOpenNoteId || importedNotes[0].id
  };

  await saveState(nextState);

  return {
    imported: importedNotes.length,
    total: nextState.notes.length,
    lastOpenNoteId: nextState.lastOpenNoteId
  };
}

module.exports = {
  createNote,
  deleteNote,
  duplicateNote,
  exportBackup,
  getNote,
  getStatus,
  getStoreFile,
  importBackup,
  listNotes,
  loadState,
  saveNote
};
