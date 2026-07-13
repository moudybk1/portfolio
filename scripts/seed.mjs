import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "portfolio.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare("SELECT COUNT(*) AS n FROM posts").get();
if (existing.n > 0) {
  console.log("Posts already exist, skipping seed.");
  process.exit(0);
}

db.prepare(
  `INSERT INTO posts (slug, title, excerpt, content, tags, published)
   VALUES (?, ?, ?, ?, ?, 1)`
).run(
  "hello-world",
  "Hello, world — why I started writing",
  "A short note on why this articles section exists and what I plan to write about here.",
  `## Why this space exists

I spend my days helping people in fast-moving Web3 communities — answering questions, triaging tickets, and turning repeated issues into better docs. A lot of small lessons come out of that work, and until now they had nowhere to live.

This is that place. Expect notes about:

- **Web3 support** — patterns from Discord, Telegram, and ticketing tools
- **Community operations** — moderation, escalation, and keeping channels human
- **Anything else** — books, tools, or thoughts that don't fit a category

## Writing in Markdown

Articles here support full Markdown, so I can include \`inline code\`, tables, and code blocks:

\`\`\`text
listen carefully → answer clearly → document → escalate with context
\`\`\`

Thanks for reading. More soon.`,
  "meta, writing"
);

console.log("Seeded 1 article.");
