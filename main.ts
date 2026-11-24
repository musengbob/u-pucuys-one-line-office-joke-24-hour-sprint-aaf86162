import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one-line office joke: the office printer only ever jams when the
// CEO walks past, and IT has given up fixing it and started taking bets
// on his next visit instead. The joke is a small, concrete office scene
// everyone recognises — the printer that works fine until the one person
// who matters is watching — and the punchline flips IT from fixers to
// bookmakers on the last clause.
//
// Why this angle: it is specific (a printer, the CEO walking past, IT
// hiding behind it) rather than a generic complaint about meetings or
// emails, it is one tight sentence with the payoff at the end, and it
// needs no explanation. It avoids the worn "this meeting should have
// been an email" line the bounty description itself uses as its example.

const JOKE =
  "The office printer only jams when the CEO walks past, so IT now hides behind it taking bets on his next visit.";

// The gate allows 1 to 200 characters; count code points, not UTF-16
// units, so any astral-plane character would count once. The line as
// written is 110 code points, comfortably inside the gate, and the
// program re-checks the written file rather than trusting the constant.
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR?.trim()
  ? process.env.MAKEFUN_OUTPUT_DIR.trim()
  : join(process.cwd(), "output");

mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, JOKE, "utf8");

const written = readFileSync(entryPath, "utf8");
if (written !== JOKE) fail("entry.txt is not byte-identical to the joke.");

const length = [...written].length;
if (length < 1 || length > MAX_CHARS) {
  fail(`entry is ${length} characters, must be 1-${MAX_CHARS}.`);
}
if (written.trim().length === 0) fail("entry is only whitespace.");
if (written.includes("\n")) fail("entry must be a single line.");

console.log(`Wrote ${length} characters to ${entryPath}:`);
console.log(written);
console.log("Validation passed: single line, byte-identical, 1-200 characters.");
