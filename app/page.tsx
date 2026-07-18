"use client";

import { useEffect, useMemo, useState } from "react";
import { NBA2K_DATA } from "./nba-data";

type Position = "控球後衛" | "得分後衛" | "小前鋒" | "大前鋒" | "中鋒";
type AttributeKey = "threePT" | "MID" | "FIN" | "DNK" | "HAN" | "PAS" | "PDEF" | "IDEF" | "BLK" | "REB" | "ATH" | "STR" | "CLU";
type RosterPlayer = { name: string; cname?: string; pos: string; height: string; type: string; ovr: number } & Record<AttributeKey, number>;
type PickedAttribute = { value: number; player: string; team: string };

const leagueData = NBA2K_DATA as unknown as Record<string, RosterPlayer[]>;
const attributes: Array<{ key: AttributeKey; label: string; short: string; icon: string }> = [
  { key: "threePT", label: "三分", short: "3PT", icon: "◎" },
  { key: "MID", label: "中投", short: "MID", icon: "◉" },
  { key: "FIN", label: "終結", short: "FIN", icon: "◆" },
  { key: "DNK", label: "灌籃", short: "DNK", icon: "↓" },
  { key: "HAN", label: "護球", short: "HAN", icon: "∞" },
  { key: "PAS", label: "傳球", short: "PAS", icon: "↗" },
  { key: "PDEF", label: "外防", short: "PDEF", icon: "◇" },
  { key: "IDEF", label: "內防", short: "IDEF", icon: "▣" },
  { key: "BLK", label: "阻攻", short: "BLK", icon: "╳" },
  { key: "REB", label: "籃板", short: "REB", icon: "⇡" },
  { key: "ATH", label: "運動", short: "ATH", icon: "ϟ" },
  { key: "STR", label: "力量", short: "STR", icon: "▲" },
  { key: "CLU", label: "關鍵", short: "CLU", icon: "★" },
];

const teamNames: Record<string, string> = {
  ATL: "老鷹", BOS: "塞爾提克", BKN: "籃網", CHA: "黃蜂", CHI: "公牛", CLE: "騎士",
  DAL: "獨行俠", DEN: "金塊", DET: "活塞", GSW: "勇士", HOU: "火箭", IND: "溜馬",
  LAC: "快艇", LAL: "湖人", MEM: "灰熊", MIA: "熱火", MIL: "公鹿", MIN: "灰狼",
  NOP: "鵜鶘", NYK: "尼克", OKC: "雷霆", ORL: "魔術", PHI: "76人", PHX: "太陽",
  POR: "拓荒者", SAC: "國王", SAS: "馬刺", TOR: "暴龍", UTA: "爵士", WAS: "巫師",
};
const teamCodes = Object.keys(leagueData);
const positions: Position[] = ["控球後衛", "得分後衛", "小前鋒", "大前鋒", "中鋒"];
const positionCode: Record<Position, string> = { 控球後衛: "PG", 得分後衛: "SG", 小前鋒: "SF", 大前鋒: "PF", 中鋒: "C" };

function shuffled<T>(items: T[]) { return [...items].sort(() => Math.random() - .5); }
function grade(value: number) { return value >= 95 ? "S" : value >= 90 ? "A+" : value >= 85 ? "A" : value >= 80 ? "B+" : value >= 75 ? "B" : value >= 70 ? "C+" : "C"; }
function teamAccent(code: string) { const colors = ["#ff5f36", "#66b8ff", "#d8ff55", "#b896ff", "#f4c542", "#58d08b"]; return colors[Math.abs(code.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length]; }

export default function Home() {
  const [screen, setScreen] = useState<"home" | "position" | "build" | "result">("home");
  const [position, setPosition] = useState<Position>("控球後衛");
  const [name, setName] = useState("我的傳奇");
  const [picked, setPicked] = useState<Partial<Record<AttributeKey, PickedAttribute>>>({});
  const [teamCode, setTeamCode] = useState<string | null>(null);
  const [reelCode, setReelCode] = useState("NBA");
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<RosterPlayer | null>(null);
  const [teamRolling, setTeamRolling] = useState(false);
  const [rerolls, setRerolls] = useState(3);
  const [usedPlayers, setUsedPlayers] = useState<string[]>([]);
  const [career, setCareer] = useState(false);
  const [toast, setToast] = useState("");

  const lockedCount = Object.keys(picked).length;
  const overall = useMemo(() => {
    const values = attributes.map((a) => picked[a.key]?.value).filter((v): v is number => typeof v === "number");
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  }, [picked]);

  useEffect(() => {
    const saved = localStorage.getItem("build-a-legend-save-v2");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.screen && data.screen !== "home") {
        setScreen(data.screen); setPosition(data.position); setName(data.name || "我的傳奇");
        setPicked(data.picked || {}); setRerolls(data.rerolls ?? 3); setUsedPlayers(data.usedPlayers || []);
      }
    } catch { localStorage.removeItem("build-a-legend-save-v2"); }
  }, []);

  useEffect(() => {
    if (screen !== "home") localStorage.setItem("build-a-legend-save-v2", JSON.stringify({ screen, position, name, picked, rerolls, usedPlayers }));
  }, [screen, position, name, picked, rerolls, usedPlayers]);

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [screen, lockedCount]);

  function resetGame() {
    setScreen("position"); setPicked({}); setTeamCode(null); setReelCode("NBA"); setRoster([]);
    setSelectedPlayer(null); setRerolls(3); setUsedPlayers([]); setCareer(false);
    localStorage.removeItem("build-a-legend-save-v2");
  }

  function getRoster(code: string, omit: string[] = []) {
    const available = (leagueData[code] || []).filter((p) => !usedPlayers.includes(p.name) && !omit.includes(p.name));
    const source = available.length >= 5 ? available : (leagueData[code] || []).filter((p) => !usedPlayers.includes(p.name));
    return shuffled(source.length ? source : leagueData[code] || []).slice(0, 5);
  }

  function spinTeam() {
    if (teamRolling) return;
    setTeamRolling(true); setSelectedPlayer(null); setRoster([]); setTeamCode(null);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setReelCode(teamCodes[Math.floor(Math.random() * teamCodes.length)]);
      ticks++;
      if (ticks > 24) {
        window.clearInterval(timer);
        const chosen = teamCodes[Math.floor(Math.random() * teamCodes.length)];
        setReelCode(chosen); setTeamCode(chosen); setRoster(getRoster(chosen)); setTeamRolling(false);
      }
    }, 70);
  }

  function rerollRoster() {
    if (!teamCode || rerolls <= 0) return;
    setRoster(getRoster(teamCode, roster.map((p) => p.name))); setSelectedPlayer(null); setRerolls((r) => r - 1);
  }

  function lockAttribute(key: AttributeKey) {
    if (!selectedPlayer || picked[key]) return;
    setPicked((old) => ({ ...old, [key]: { value: selectedPlayer[key], player: selectedPlayer.name, team: teamCode || "NBA" } }));
    setUsedPlayers((old) => [...old, selectedPlayer.name]);
    setSelectedPlayer(null); setRoster([]); setTeamCode(null); setReelCode("NBA");
    if (lockedCount + 1 === attributes.length) setScreen("result");
  }

  async function shareResult() {
    const text = `我打造了 ${overall} OVR 的 ${positionCode[position]}「${name}」，集滿 13 項能力！`;
    try {
      if (navigator.share) await navigator.share({ title: "BUILD-A-LEGEND", text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); setToast("戰績已複製"); }
    } catch { /* sharing cancelled */ }
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => setScreen("home")} aria-label="回到首頁">BUILD-A-<i>LEGEND</i></button>
        {screen !== "home" && <button className="icon-button" onClick={resetGame} aria-label="重新開始">↻</button>}
      </header>

      {screen === "home" && <section className="home-screen screen-enter">
        <div className="eyebrow">SPIN A TEAM · STEAL A SKILL</div>
        <h1>打造你的<br /><em>夢幻球星</em></h1>
        <p className="lead">先抽球隊、再選球員，從他的 13 項能力中奪取一項。集滿整張能力表，打造真正的聯盟傳奇。</p>
        <div className="hero-card" aria-hidden="true"><div className="hero-no">99</div><div className="hero-pos">?</div><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-ball">🏀</div><div className="hero-name">YOUR<br />LEGEND</div><div className="scanline" /></div>
        <button className="primary-button" onClick={() => setScreen("position")}><span>開始建模</span><b>→</b></button>
        <div className="feature-row"><span>30 支球隊</span><span>13 項能力</span><span>自動保存</span></div>
      </section>}

      {screen === "position" && <section className="content-screen screen-enter">
        <Progress current={0} />
        <div className="step-kicker">STEP 01</div><h2>先決定你的場上位置</h2><p className="muted">跨位置奪取能力也沒問題，建立你心中最理想的模板。</p>
        <div className="position-court">{positions.map((p, i) => <button key={p} className={position === p ? "position active" : "position"} onClick={() => setPosition(p)} style={{ "--delay": `${i * 40}ms` } as React.CSSProperties}><b>{positionCode[p]}</b><span>{p}</span></button>)}</div>
        <label className="name-field"><span>球員名稱</span><input maxLength={12} value={name} onChange={(e) => setName(e.target.value)} placeholder="輸入你的球員名稱" /></label>
        <button className="primary-button" onClick={() => setScreen("build")}><span>進入選隊抽籤</span><b>→</b></button>
      </section>}

      {screen === "build" && <section className="content-screen build-screen screen-enter">
        <Progress current={lockedCount} />
        <div className="round-meta"><span>第 {lockedCount + 1} / 13 輪</span><span>{positionCode[position]} · {name}</span></div>
        <div className="build-title"><div><div className="step-kicker">ROUND {String(lockedCount + 1).padStart(2, "0")}</div><h2>{teamCode ? "從名單選一位球員" : "抽出你的下一支球隊"}</h2></div><div className="reroll-token">換人 <b>{rerolls}</b></div></div>

        <div className={teamRolling ? "team-slot rolling" : "team-slot"} style={{ "--team-accent": teamAccent(reelCode) } as React.CSSProperties}>
          <span className="slot-label">TEAM DRAW</span><b className="slot-code">{reelCode}</b><strong>{teamNames[reelCode] || "等待抽籤"}</strong>
          <div className="slot-lines" />
        </div>

        {!teamCode && <button className="primary-button" onClick={spinTeam} disabled={teamRolling}><span>{teamRolling ? "選隊轉盤運轉中…" : "隨機抽取球隊"}</span><b>{teamRolling ? "◌" : "↻"}</b></button>}

        {teamCode && <>
          <div className="team-result"><div><span>本輪球隊</span><b>{teamNames[teamCode]} <i>{teamCode}</i></b></div><button onClick={spinTeam} disabled={teamRolling}>重抽球隊</button></div>
          <div className="roster-list">{roster.map((player) => <button key={player.name} className={selectedPlayer?.name === player.name ? "roster-player selected" : "roster-player"} onClick={() => setSelectedPlayer(player)}>
            <span className="roster-ovr">{player.ovr}</span><div><b>{player.name}</b><span>{player.pos} · {player.type}</span></div><i>{selectedPlayer?.name === player.name ? "✓" : "+"}</i>
          </button>)}</div>
          <button className="secondary-button reroll-button" onClick={rerollRoster} disabled={rerolls === 0}>更換這批球員（剩餘 {rerolls} 次）</button>
        </>}

        <div className="attribute-section">
          <div className="section-heading"><b>{selectedPlayer ? `選擇 ${selectedPlayer.name} 的一項能力` : "13 項能力槽"}</b><span>{lockedCount}/13</span></div>
          <div className="attribute-grid">{attributes.map((a) => {
            const locked = picked[a.key]; const value = selectedPlayer?.[a.key];
            return <button key={a.key} className={locked ? "attribute-slot locked" : selectedPlayer ? "attribute-slot available" : "attribute-slot"} disabled={!!locked || !selectedPlayer} onClick={() => lockAttribute(a.key)}>
              <span className="attr-icon">{a.icon}</span><span className="attr-label">{a.label}</span>
              <b>{locked?.value ?? value ?? "+"}</b><i>{locked ? locked.player : value ? grade(value) : a.short}</i>
            </button>;
          })}</div>
        </div>
        <p className="microcopy">選定球員後，點擊尚未鎖定的能力即可奪取；同一位球員每局只能使用一次。</p>
      </section>}

      {screen === "result" && <section className="result-screen screen-enter">
        <Progress current={13} />
        <div className="result-heading"><div className="step-kicker">ALL 13 ATTRIBUTES COMPLETE</div><h2>你的傳奇，正式誕生</h2></div>
        <div className="final-card final-card-13"><div className="card-glow" /><div className="card-top"><div><b className="ovr">{overall}</b><span>OVR</span></div><div className="card-position">{positionCode[position]}</div></div><div className="silhouette compact-ball"><span>🏀</span></div><div className="final-name">{name || "我的傳奇"}</div>
          <div className="rating-grid rating-grid-13">{attributes.map((a) => <div key={a.key}><b>{picked[a.key]?.value}</b><span>{a.short}</span></div>)}</div>
          <div className="card-footer"><span>BUILD-A-LEGEND</span><span>{overall >= 95 ? "神話級" : overall >= 90 ? "巨星級" : "全明星級"}</span></div>
        </div>
        {!career ? <div className="result-actions"><button className="primary-button" onClick={() => setCareer(true)}><span>模擬新秀賽季</span><b>▶</b></button><button className="secondary-button wide" onClick={shareResult}>分享球員卡</button></div> : <Career overall={overall} position={positionCode[position]} />}
        <button className="text-button" onClick={resetGame}>重新打造另一位球星</button>
      </section>}
      {toast && <div className="toast">✓ {toast}</div>}
      <footer>球迷創作遊戲 · 非 NBA 官方產品</footer>
    </main>
  );
}

function Progress({ current }: { current: number }) { return <div className="progress-wrap"><div className="progress-label"><span>ATTRIBUTES LOCKED</span><b>{current}/13</b></div><div className="progress-track"><i style={{ width: `${(current / 13) * 100}%` }} /></div></div>; }

function Career({ overall, position }: { overall: number; position: string }) {
  const wins = Math.min(67, Math.round(38 + (overall - 80) * 1.45)); const points = (14 + (overall - 80) * .72).toFixed(1);
  return <div className="career-panel screen-enter"><div className="career-header"><span>ROOKIE SEASON</span><b>{wins}–{82 - wins}</b></div><div className="career-stats"><div><b>{points}</b><span>PTS</span></div><div><b>{(4 + (overall - 80) * .21).toFixed(1)}</b><span>REB</span></div><div><b>{(3.5 + (overall - 80) * .25).toFixed(1)}</b><span>AST</span></div></div><div className="career-awards"><span>🏆 年度最佳新秀</span>{overall >= 91 && <span>⭐ 全明星 {position}</span>}{overall >= 94 && <span>👑 聯盟總冠軍</span>}</div></div>;
}
