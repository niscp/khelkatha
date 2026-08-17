import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the WonderTaps product at the root domain", async () => {
  const [html, page] = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
  ]);

  assert.match(html, /WonderTaps/);
  assert.match(page, /Moonlight Meadow/);
  assert.match(page, /Moonlight Animal Safari/);
  assert.match(page, /Firefly Garden/);
  assert.match(page, /Who is Calling/);
  assert.match(page, /Rhythm Parade/);
  assert.match(html, /\/_next\/static\//);
  assert.doesNotMatch(html, /\/khelkatha\//);
});

test("ships the complete animal sound set and social preview", async () => {
  await Promise.all([
    "horse.ogg",
    "elephant.ogg",
    "lion.ogg",
    "monkey.ogg",
    "cow.ogg",
    "parrot.ogg",
  ].map((name) => access(new URL(`public/sounds/${name}`, root))));

  await access(new URL("public/wondertaps-animal-world.png", root));
  await access(new URL("public/og.png", root));
});

test("contains no personalized character references", async () => {
  const [page, css, handoff] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("HANDOFF.md", root), "utf8"),
  ]);

  assert.doesNotMatch(`${page}\n${css}\n${handoff}`, /gauri/i);
});
