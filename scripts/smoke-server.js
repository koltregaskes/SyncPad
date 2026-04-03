const fs = require("fs");
const os = require("os");
const path = require("path");

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "syncpad-server-"));
process.env.MYDATA_DIR = tempRoot;
process.env.SYNC_PAD_HOST = "127.0.0.1";
process.env.SYNC_PAD_PORT = "3222";

const { createSyncPadServer } = require("../src/server");

async function main() {
  const server = await createSyncPadServer({
    host: "127.0.0.1",
    port: 3222
  }).start();

  try {
    const createdResponse = await fetch(`${server.origin}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Server note",
        content: "# Hello\n\nThis is a synced note."
      })
    });
    const created = await createdResponse.json();

    await fetch(`${server.origin}/api/notes/${created.note.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Server note",
        content: "# Hello\n\nThis is a synced note.\n\nUpdated."
      })
    });

    const listResponse = await fetch(`${server.origin}/api/notes`);
    const listPayload = await listResponse.json();

    console.log(JSON.stringify({
      noteCount: listPayload.notes.length,
      firstTitle: listPayload.notes[0]?.title,
      origin: server.origin
    }, null, 2));
  } finally {
    await server.stop();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
