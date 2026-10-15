import assert from "node:assert/strict";
import { test } from "node:test";
import { createLoader } from "./helpers/load-ts.mjs";

test("database initialization can recover after a transient failure", async () => {
  let fail = true;
  const client = {
    execute: async () => {
      if (fail) {
        fail = false;
        throw new Error("Transient connection failure");
      }
      return { rows: [] };
    },
  };
  const load = createLoader({ "@libsql/client": { createClient: () => client } });
  const { getDb } = load("src/lib/db.ts");
  await assert.rejects(getDb(), /Transient connection failure/);
  assert.equal(await getDb(), client);
});
