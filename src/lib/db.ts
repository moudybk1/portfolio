import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;

  if (url) {
    return createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  // Local development fallback: SQLite file in data/
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  return createClient({
    url: `file:${path.join(dataDir, "portfolio.db")}`,
  });
}

export async function getDb(): Promise<Client> {
  if (!client) client = createDbClient();

  if (!schemaReady) {
    schemaReady = (async () => {
      await client.execute(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          tags TEXT NOT NULL DEFAULT '',
          published INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`
      );
      // Databases created before cover images existed gain the column here.
      const columns = await client.execute("PRAGMA table_info(posts)");
      if (!columns.rows.some((column) => column.name === "cover_image")) {
        await client
          .execute(
            "ALTER TABLE posts ADD COLUMN cover_image TEXT NOT NULL DEFAULT ''"
          )
          .catch((error: unknown) => {
            // Another instance may have added it between the check and here.
            if (!String(error).includes("duplicate column")) throw error;
          });
      }
      await client.execute(
        `CREATE TABLE IF NOT EXISTS media (
          id TEXT PRIMARY KEY,
          mime TEXT NOT NULL,
          data BLOB NOT NULL,
          width INTEGER NOT NULL,
          height INTEGER NOT NULL,
          size INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`
      );
      await client.execute(
        `CREATE TABLE IF NOT EXISTS login_attempts (
          ip_hash TEXT PRIMARY KEY,
          attempts INTEGER NOT NULL DEFAULT 0,
          window_start INTEGER NOT NULL DEFAULT 0,
          locked_until INTEGER NOT NULL DEFAULT 0
        )`
      );
    })().catch((error: unknown) => {
      // A temporary connection failure must not poison every later request.
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;

  return client;
}
