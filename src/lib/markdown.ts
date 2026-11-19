// Shared by the article page and the admin preview, so it must stay pure.

// Lines that carry on the block above them: lists, quotes, tables, indents.
const CONTINUES = /^(\s|[-*+] |\d+[.)] |>|\|)/;
const FENCE = /^\s*(```|~~~)/;

// Writers press Enter once to start a new paragraph, as in any editor, but
// Markdown joins such lines into one paragraph. Give each line its own block,
// except lines that continue a list, quote, table or code block.
// ponytail: hard-wrapped Markdown (lines broken at 80 columns) splits too.
export function splitParagraphs(markdown: string): string {
  const lines = markdown.split(/\r\n?|\n/);
  let inFence = false;
  return lines
    .map((line, index) => {
      const keep =
        inFence ||
        index === 0 ||
        !lines[index - 1].trim() ||
        !line.trim() ||
        CONTINUES.test(line);
      if (FENCE.test(line)) inFence = !inFence;
      return keep ? line : `\n${line}`;
    })
    .join("\n");
}
