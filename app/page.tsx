"use client";

import { useEffect, useMemo, useState } from "react";

type Position = "控球後衛" | "得分後衛" | "小前鋒" | "大前鋒" | "中鋒";
type AttributeKey = "finishing" | "shooting" | "handles" | "passing" | "defense" | "athleticism";
type Player = { name: string; team: string; accent: string; values: Record<AttributeKey, number> };

const attributes: Array<{ key: AttributeKey; label: string; short: string; icon: string }> = [
  { key: "finishing", label: "終結", short: "FIN", icon: "💥" },
  { key: "shooting", label: "投射", short: "SHO", icon: "🎯" },
  { key: "handles", label: "控球", short: "HAN", icon: "🪄" },
  { key: "passing", label: "組織", short: "PAS", icon: "🧠" },
  { key: "defense", label: "防守", short: "DEF", icon: "🔒" },
  { key: "athleticism", label: "體能", short: "ATH", icon: "⚡" },
];

const players: Player[] = [
  { name: "S. Curry", team: "灣區", accent: "#f4c542", values: { finishing: 91, shooting: 99, handles: 97, passing: 93, defense: 79, athleticism: 84 } },
  { name: "L. James", team: "洛城", accent: "#b896ff", values: { finishing: 98, shooting: 88, handles: 91, passing: 97, defense: 90, athleticism: 96 } },
  { name: "N. Jokić", team: "丹佛", accent: "#72b7ff", values: { finishing: 95, shooting: 89, handles: 83, passing: 99, defense: 85, athleticism: 78 } },
  { name: "G. Antetokounmpo", team: "密爾瓦基", accent: "#58d08b", values: { finishing: 99, shooting: 76, handles: 88, passing: 88, defense: 96, athleticism: 99 } },
  { name: "L. Dončić", team: "達拉斯", accent: "#59c8ff", values: { finishing: 94, shooting: 94, handles: 96, passing: 98, defense: 78, athleticism: 83 } },
  { name: "K. Durant", team: "休士頓", accent: "#ff9f68", values: { finishing: 96, shooting: 98, handles: 91, passing: 88, defense: 86, athleticism: 89 } },
  { name: "A. Edwards", team: "明尼蘇達", accent: "#9fe870", values: { finishing: 96, shooting: 91, handles: 91, passing: 83, defense: 88, athleticism: 98 } },
  { name: "V. Wembanyama", team: "聖安東尼奧", accent: "#d9d9de", values: { finishing: 93, shooting: 90, handles: 87, passing: 86, defense: 99, athleticism: 95 } },
  { name: "S. Gilgeous-Alexander", team: "奧克拉荷馬", accent: "#ff825f", values: { finishing: 98, shooting: 93, handles: 96, passing: 90, defense: 91, athleticism: 94 } },
];

const positions: Position[] = ["控球後衛", "得分後衛", "小前鋒", "大前鋒", "中鋒"];
const positionCode: Record<Position, string> = { 控球後衛: "PG", 得分後衛: "SG", 小前鋒: "SF", 大前鋒: "PF", 中鋒: "C" };

export default function Home() {
  const [screen, setScreen] = useState<"home" | "position" | "build" | "result">("home");
  const [position, setPosition] = useState<Position>("控球後衛");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<Partial<Record<AttributeKey, { value: number; player: string }>>>({});
  const [candidate, setCandidate] = useState<Player | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rerolls, setRerolls] = useState(1);
  const [name, setName] = useState("我的傳奇");
  const [toast, setToast] = useState("");
  const [career, setCareer] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("build-a-legend-save");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.screen && data.screen !== "home") {
        setScreen(data.screen); setPosition(data.position); setRound(data.round);
        setPicked(data.picked || {}); setRerolls(data.rerolls ?? 1); setName(data.name || "我的傳奇");
      }
    } catch { localStorage.removeItem("build-a-legend-save"); }
  }, []);

  useEffect(() => {
    if (screen !== "home") localStorage.setItem("build-a-legend-save", JSON.stringify({ screen, position, round, picked, rerolls, name }));
  }, [screen, position, round, picked, rerolls, name]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [screen, round]);

  const currentAttribute = attributes[round];
  const overall = useMemo(() => {
    const values = attributes.map((a) => picked[a.key]?.value).filter((v): v is number => typeof v === "number");
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  }, [picked]);

  function resetGame() {
    setScreen("position"); setRound(0); setPicked({}); setCandidate(null); setRerolls(1); setCareer(false);
    localStorage.removeItem("build-a-legend-save");
  }

  function spin(useReroll = false) {
    if (rolling || !currentAttribute) return;
    if (useReroll) setRerolls(0);
    setRolling(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setCandidate(players[Math.floor(Math.random() * players.length)]);
      ticks++;
      if (ticks > 17) {
        window.clearInterval(timer);
        setCandidate(players[Math.floor(Math.random() * players.length)]);
        setRolling(false);
      }
    }, 75);
  }

  function claim() {
    if (!candidate || !currentAttribute || rolling) return;
    setPicked((p) => ({ ...p, [currentAttribute.key]: { value: candidate.values[currentAttribute.key], player: candidate.name } }));
    setCandidate(null);
    if (round === attributes.length - 1) setScreen("result"); else setRound((r) => r + 1);
  }

  async function shareResult() {
    const text = `我打造了 ${overall} OVR 的 ${positionCode[position]}「${name}」！你能超越我嗎？`;
    try {
      if (navigator.share) await navigator.share({ title: "BUILD-A-LEGEND", text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); setToast("戰績已複製"); }
    } catch { /* user cancelled */ }
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => setScreen("home")} aria-label="回到首頁">BUILD-A-<i>LEGEND</i></button>
        {screen !== "home" && <button className="icon-button" onClick={resetGame} aria-label="重新開始">↻</button>}
      </header>

      {screen === "home" && (
        <section className="home-screen screen-enter">
          <div className="eyebrow">SPIN · STEAL · BECOME LEGEND</div>
          <h1>打造你的<br /><em>夢幻球星</em></h1>
          <p className="lead">轉動命運，從頂尖球員身上奪取六項能力。每一次選擇，都讓你的傳奇更接近完美。</p>
          <div className="hero-card" aria-hidden="true">
            <div className="hero-no">99</div><div className="hero-pos">?</div>
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-ball">🏀</div>
            <div className="hero-name">YOUR<br />LEGEND</div>
            <div className="scanline" />
          </div>
          <button className="primary-button" onClick={() => setScreen("position")}><span>開始建模</span><b>→</b></button>
          <div className="feature-row"><span>免登入</span><span>約 2 分鐘</span><span>自動保存</span></div>
        </section>
      )}

      {screen === "position" && (
        <section className="content-screen screen-enter">
          <Progress current={0} />
          <div className="step-kicker">STEP 01</div><h2>先決定你的場上位置</h2><p className="muted">位置不限制抽取結果，選你最想統治的區域。</p>
          <div className="position-court">
            {positions.map((p, i) => <button key={p} className={position === p ? "position active" : "position"} onClick={() => setPosition(p)} style={{ "--delay": `${i * 40}ms` } as React.CSSProperties}><b>{positionCode[p]}</b><span>{p}</span></button>)}
          </div>
          <label className="name-field"><span>球員名稱</span><input maxLength={12} value={name} onChange={(e) => setName(e.target.value)} placeholder="輸入你的球員名稱" /></label>
          <button className="primary-button sticky-action" onClick={() => setScreen("build")}><span>確認位置</span><b>→</b></button>
        </section>
      )}

      {screen === "build" && currentAttribute && (
        <section className="content-screen build-screen screen-enter">
          <Progress current={round + 1} />
          <div className="round-meta"><span>第 {round + 1} / {attributes.length} 輪</span><span>{positionCode[position]} · {name}</span></div>
          <div className="attribute-title"><span>{currentAttribute.icon}</span><div><div className="step-kicker">正在建造</div><h2>{currentAttribute.label}</h2></div></div>
          <div className={rolling ? "roulette-card rolling" : "roulette-card"} style={{ "--accent": candidate?.accent || "#ff5f36" } as React.CSSProperties}>
            {candidate ? <><div className="player-team">{candidate.team}</div><div className="player-initial">{candidate.name.charAt(0)}</div><div className="player-copy"><strong>{candidate.name}</strong><span>{currentAttribute.label}能力</span></div><div className="player-rating">{candidate.values[currentAttribute.key]}</div></> : <><div className="waiting-orb">?</div><strong className="waiting-title">命運轉盤等待中</strong><span className="waiting-copy">點擊下方按鈕抽取球員</span></>}
          </div>
          <div className="picked-strip">{attributes.map((a, i) => <div key={a.key} className={i === round ? "mini-stat current" : picked[a.key] ? "mini-stat done" : "mini-stat"}><span>{a.short}</span><b>{picked[a.key]?.value || "—"}</b></div>)}</div>
          {!candidate ? <button className="primary-button" onClick={() => spin()} disabled={rolling}><span>{rolling ? "轉動中…" : "轉動命運"}</span><b>{rolling ? "◌" : "↻"}</b></button> : <div className="action-pair"><button className="secondary-button" disabled={rerolls === 0 || rolling} onClick={() => spin(true)}>重抽 {rerolls}/1</button><button className="primary-button compact" onClick={claim}><span>奪取 {candidate.values[currentAttribute.key]}</span><b>✓</b></button></div>}
          <p className="microcopy">每場僅有一次重抽機會，請謹慎使用。</p>
        </section>
      )}

      {screen === "result" && (
        <section className="result-screen screen-enter">
          <Progress current={7} />
          <div className="result-heading"><div className="step-kicker">BUILD COMPLETE</div><h2>你的傳奇，正式誕生</h2></div>
          <div className="final-card">
            <div className="card-glow" /><div className="card-top"><div><b className="ovr">{overall}</b><span>OVR</span></div><div className="card-position">{positionCode[position]}</div></div>
            <div className="silhouette"><span>🏀</span></div>
            <div className="final-name">{name || "我的傳奇"}</div>
            <div className="rating-grid">{attributes.map((a) => <div key={a.key}><b>{picked[a.key]?.value}</b><span>{a.short}</span></div>)}</div>
            <div className="card-footer"><span>BUILD-A-LEGEND</span><span>{overall >= 95 ? "神話級" : overall >= 90 ? "巨星級" : "全明星級"}</span></div>
          </div>
          {!career ? <div className="result-actions"><button className="primary-button" onClick={() => setCareer(true)}><span>模擬新秀賽季</span><b>▶</b></button><button className="secondary-button wide" onClick={shareResult}>分享球員卡</button></div> : <Career overall={overall} position={positionCode[position]} />}
          <button className="text-button" onClick={resetGame}>重新打造另一位球星</button>
        </section>
      )}
      {toast && <div className="toast">✓ {toast}</div>}
      <footer>球迷創作遊戲 · 非 NBA 官方產品</footer>
    </main>
  );
}

function Progress({ current }: { current: number }) {
  return <div className="progress-wrap"><div className="progress-label"><span>BUILD PROGRESS</span><b>{Math.min(current, 7)}/7</b></div><div className="progress-track"><i style={{ width: `${(Math.min(current, 7) / 7) * 100}%` }} /></div></div>;
}

function Career({ overall, position }: { overall: number; position: string }) {
  const wins = Math.min(67, Math.round(38 + (overall - 80) * 1.45));
  const points = (14 + (overall - 80) * .72).toFixed(1);
  return <div className="career-panel screen-enter"><div className="career-header"><span>ROOKIE SEASON</span><b>{wins}–{82 - wins}</b></div><div className="career-stats"><div><b>{points}</b><span>PTS</span></div><div><b>{(4 + (overall - 80) * .21).toFixed(1)}</b><span>REB</span></div><div><b>{(3.5 + (overall - 80) * .25).toFixed(1)}</b><span>AST</span></div></div><div className="career-awards"><span>🏆 年度最佳新秀</span>{overall >= 91 && <span>⭐ 全明星 {position}</span>}{overall >= 94 && <span>👑 聯盟總冠軍</span>}</div></div>;
}
