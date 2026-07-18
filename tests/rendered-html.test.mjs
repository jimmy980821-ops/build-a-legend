import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the complete mobile game and removes starter metadata", async () => {
  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /BUILD-A-LEGEND/);
  assert.match(page, /localStorage/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /13 項能力/);
  assert.match(page, /隨機抽取球隊/);
  assert.match(page, /繼續上次進度/);
  assert.match(page, /setResumeScreen\(data\.screen\)/);
  assert.match(page, /NBA2K_DATA/);
  assert.match(page, /prefers-reduced-motion|screen-enter/);
  assert.match(layout, /zh-Hant/);
  assert.doesNotMatch(layout + page, /codex-preview|SkeletonPreview|Starter Project/);
  assert.match(css, /100svh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});
