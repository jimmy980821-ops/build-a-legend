import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the complete mobile basketball arcade", async () => {
  const [page, layout, css, nbaData, allTimeData, hub, perfect, perfectData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/nba-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/all-time-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game-hub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/perfect-82.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/perfect-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /BUILD-A-LEGEND/);
  assert.match(page, /GameHub/);
  assert.match(page, /Perfect82/);
  assert.match(hub, /GAME 01 · LIVE/);
  assert.match(hub, /GAME 02 · NEW/);
  assert.match(hub, /未上線・敬請期待/);
  assert.match(hub, /他是誰？/);
  assert.match(perfect, /CLASSIC/);
  assert.match(perfect, /HOOP IQ/);
  assert.match(perfect, /換候選球員/);
  assert.match(perfect, /換年代/);
  assert.match(perfect, /projectWins/);
  assert.match(perfect, /!excludeNames\.includes\(p\.name\)/);
  assert.match(perfect, /roster\.some\(p=>p\.name===player\.name\)/);
  assert.match(perfect, /team-totals/);
  assert.match(perfectData, /Wilt Chamberlain/);
  assert.match(perfectData, /Victor Wembanyama/);
  assert.match(layout, /FULL COURT LAB/);
  assert.match(layout, /og-full-court-lab\.png/);
  assert.match(page, /localStorage/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /20 項能力：/);
  assert.match(page, /stats\.pts\.toFixed/);
  assert.match(page, /statLine\("常規賽",season\.stats\)/);
  assert.match(page, /statLine\("季後賽",playoffs\.stats\)/);
  assert.match(page, /本季榮譽：/);
  assert.match(page, /完整資料已複製/);
  assert.match(page, /navigator\.canShare/);
  assert.match(page, /error\.name==="AbortError"/);
  assert.match(page, /document\.execCommand\("copy"\)/);
  assert.match(page, /此瀏覽器不支援分享，完整資料已複製/);
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
  assert.match(allTimeData, /"Michael Jordan": \{ threePT:83, MID:98/);
  assert.match(allTimeData, /"Kobe Bryant": \{ threePT:85, MID:98/);
  assert.match(allTimeData, /"Hakeem Olajuwon": \{[^\n]*BLK:99/);
  assert.match(allTimeData, /"Kareem Abdul-Jabbar": \{[^\n]*BLK:95/);
  assert.match(allTimeData, /legendOverrides\[name\]/);
  assert.match(allTimeData, /2K校準/);
  assert.match(allTimeData, /"Shai Gilgeous-Alexander": \{ FT:95, FOUL:99 \}/);
  assert.match(allTimeData, /"Evan Mobley","埃文-莫布利"/);
  assert.match(nbaData, /"name": "Shai Gilgeous-Alexander"[\s\S]{0,500}"FT": 95,[\s\S]{0,30}"FOUL": 99/);
  assert.match(nbaData, /"name": "Evan Mobley"[\s\S]{0,80}"cname": "埃文-莫布利"/);
  assert.match(nbaData, /"name": "Trey Lyles"[\s\S]{0,80}"cname": "崔-萊爾斯"/);
  assert.match(nbaData, /"name": "Adam Flagler"[\s\S]{0,80}"cname": "亞當-弗拉格勒"/);
  assert.match(nbaData, /"name": "Tamar Bates"[\s\S]{0,80}"cname": "塔馬爾-貝茲"/);
  assert.match(nbaData, /"name": "Mo Bamba"[\s\S]{0,80}"cname": "穆罕默德-班巴"/);
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
