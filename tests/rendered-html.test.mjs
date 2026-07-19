import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the complete mobile game and removes starter metadata", async () => {
  const [page, layout, css, nbaData, allTimeData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/nba-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/all-time-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /BUILD-A-LEGEND/);
  assert.match(page, /localStorage/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /20 項能力/);
  assert.match(page, /label: "造犯規"/);
  assert.match(page, /label: "罰球"/);
  assert.match(page, /label: "抄截"/);
  assert.match(page, /label: "進攻籃板"/);
  assert.match(page, /label: "傳球判斷"/);
  assert.match(page, /label: "積極性"/);
  assert.match(page, /label: "耐久度"/);
  assert.match(page, /playerRating/);
  assert.match(page, /隨機抽取球隊/);
  assert.match(page, /繼續上次進度/);
  assert.match(page, /setResumeScreen\(data\.screen\)/);
  assert.match(page, /NBA2K_DATA/);
  assert.match(page, /ALL_TIME_DATA/);
  assert.match(page, /傳奇聯盟/);
  assert.match(page, /leagueMode==="all-time"/);
  assert.match(page, /const STARTER_OVR = 85/);
  assert.match(page, /const starter=overall>=STARTER_OVR/);
  assert.match(page, /85 OVR 以上為先發/);
  assert.match(allTimeData, /Michael Jordan/);
  assert.match(allTimeData, /史蒂芬-柯瑞/);
  assert.match(allTimeData, /Magic Johnson/);
  assert.match(page, /player\.cname\|\|player\.name/);
  assert.match(nbaData, /斯蒂芬-柯瑞/);
  assert.match(nbaData, /塞思-柯瑞/);
  assert.doesNotMatch(nbaData, /庫裡/);
  assert.match(nbaData, /盧卡-東契奇/);
  assert.match(nbaData, /維克托-文班亞馬/);
  assert.doesNotMatch(nbaData, /斯蒂芬-库里|卢卡-东契奇|维克托-文班亚马/);
  assert.match(page, /同位置最相似的 3 位球員/);
  assert.match(page, /player\.pos\.split\(" \/ "\)\.includes\(selectedPosition\)/);
  assert.match(layout, /favicon-basketball\.png/);
  assert.match(page, /加入球隊並模擬 82 場/);
  assert.match(page, /年度第一隊/);
  assert.match(page, /年度防守第一隊/);
  assert.match(page, /MVP/);
  assert.match(page, /DPOY/);
  assert.match(page, /最佳第六人/);
  assert.match(page, /非替補球員，無參選資格/);
  assert.match(page, /已當選 MVP，無參選資格/);
  assert.match(page, /label: "控球"/);
  assert.doesNotMatch(page, /label: "護球"/);
  assert.match(page, /年度關鍵球員/);
  assert.match(page, /分區冠軍賽 MVP/);
  assert.match(page, /FMVP/);
  assert.match(page, /PLAYOFFS 數據/);
  assert.match(page, /cdn\.nba\.com\/logos/);
  assert.match(page, /prefers-reduced-motion|screen-enter/);
  assert.match(layout, /zh-Hant/);
  assert.doesNotMatch(layout + page, /codex-preview|SkeletonPreview|Starter Project/);
  assert.match(css, /100svh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});
