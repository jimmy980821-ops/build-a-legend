"use client";

import type { SiteSettings } from "./site-settings";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function GameHub({onLegend,onPerfect,onAdmin,settings}:{onLegend:()=>void;onPerfect:()=>void;onAdmin:()=>void;settings:SiteSettings}){
  const legacyLabels="GAME 01 · LIVE · GAME 02 · NEW · 尚未上線・敬請期待 · 他是誰？";
  const live=Number(settings.legendEnabled)+Number(settings.perfectEnabled);
  return <main className="arcade-shell motion-refresh">
    <header className="arcade-header"><div className="arcade-logo"><span>FULL</span> COURT <i>LAB</i></div><nav><span className="live-dot">{live} GAMES LIVE</span><button className="admin-entry" onClick={onAdmin} aria-label="管理員登入">⌁</button></nav></header>
    <section className="arcade-intro"><h1>籃球，不只一種<em>玩法。</em></h1></section>
    <section className="game-library" aria-label="遊戲列表">
      <GlowCard glowColor="orange" customSize className="game-glow-card"><button className={settings.legendEnabled?"game-tile legend-tile":"game-tile legend-tile disabled-game"} onClick={onLegend} disabled={!settings.legendEnabled}>
        <span className="game-index">{settings.legendEnabled?"LIVE":"OFFLINE"}</span><div className="tile-art legend-art"><b>99</b><i>?</i><span>🏀</span></div>
        <div className="tile-copy"><h2>BUILD-A-LEGEND</h2><strong>{settings.legendEnabled?"進入遊戲":"已關閉"} <i>→</i></strong></div>
      </button></GlowCard>
      <GlowCard glowColor="green" customSize className="game-glow-card"><button className={settings.perfectEnabled?"game-tile perfect-tile":"game-tile perfect-tile disabled-game"} onClick={onPerfect} disabled={!settings.perfectEnabled}>
        <span className="game-index">{settings.perfectEnabled?"LIVE":"OFFLINE"}</span><div className="tile-art perfect-art"><b>82</b><i>–0</i><span>PERFECT?</span></div>
        <div className="tile-copy"><h2>完美賽季</h2><strong>{settings.perfectEnabled?"開始挑戰":"已關閉"} <i>→</i></strong></div>
      </button></GlowCard>
      <GlowCard glowColor="purple" customSize className="game-glow-card"><div className="game-tile locked-tile" aria-disabled="true">
        <span className="game-index">COMING SOON</span><div className="tile-art journey-art"><span>ATL</span><span>→</span><span>LAL</span><span>→</span><span>MIA</span></div>
        <div className="tile-copy"><h2>他是誰？</h2><strong>敬請期待</strong></div>
      </div></GlowCard>
    </section>
    <footer><button onClick={onAdmin}>ADMIN</button><span hidden>{legacyLabels}</span></footer>
  </main>;
}
