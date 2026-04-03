const fs = require("fs");
const os = require("os");
const path = require("path");

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "syncpad-"));
process.env.MYDATA_DIR = tempRoot;

const store = require("../src/store");

async function main() {
  const first = await store.createNote("First note");
  await store.saveNote(first.id, {
    title: "First note",
    content: "Hello from SyncPad"
  });

  const notes = await store.listNotes();
  const loaded = await store.getNote(first.id);

  console.log(
    JSON.stringify(
      {
        noteCount: notes.length,
        firstTitle: loaded.title,
        firstContent: loaded.content
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
