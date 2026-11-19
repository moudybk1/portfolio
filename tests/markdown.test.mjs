import assert from "node:assert/strict";
import { test } from "node:test";
import { createLoader } from "./helpers/load-ts.mjs";

const { splitParagraphs } = createLoader()("src/lib/markdown.ts");

test("each line typed with Enter becomes its own paragraph", () => {
  assert.equal(
    splitParagraphs("First.\r\nSecond.\r\n\r\nThird.\nFourth."),
    "First.\n\nSecond.\n\nThird.\n\nFourth.",
  );
});

test("lists, quotes, tables and code keep their single line breaks", () => {
  const blocks = [
    "Intro:\n- one\n- two\n  still two",
    "1. one\n2. two",
    "> quoted\n> more",
    "| a | b |\n| - | - |\n| 1 | 2 |",
    "```\nline one\nline two\n```",
  ];
  for (const block of blocks) {
    assert.equal(splitParagraphs(block), block);
  }
});

test("text after a list or code block starts a new paragraph", () => {
  assert.equal(splitParagraphs("- item\nAfter."), "- item\n\nAfter.");
  assert.equal(splitParagraphs("```\ncode\n```\nAfter."), "```\ncode\n```\n\nAfter.");
});
