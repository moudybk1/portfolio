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
    schemaReady = client
      .execute(
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
      )
      .then(() => undefined);
  }
  await schemaReady;

  return client;
}
