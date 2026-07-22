"use client";

import type { SiteSettings } from "./site-settings";

export default function GameHub({onLegend,onPerfect,onAdmin,settings}:{onLegend:()=>void;onPerfect:()=>void;onAdmin:()=>void;settings:SiteSettings}){
  const legacyLabels="GAME 01 · LIVE · GAME 02 · NEW · 尚未上線・敬請期待 · 他是誰？";
  const live=Number(settings.legendEnabled)+Number(settings.perfectEnabled);
  return <main className="arcade-shell motion-refresh">
    <header className="arcade-header"><div className="arcade-logo"><span>FULL</span> COURT <i>LAB</i></div><nav><span className="live-dot">{live} GAMES LIVE</span><button className="admin-entry" onClick={onAdmin} aria-label="管理員登入">⌁</button></nav></header>
    <section className="arcade-intro"><div className="eyebrow">BASKETBALL GAME SERIES</div><h1>籃球，不只一種<br/><em>玩法。</em></h1><p>打造傳奇、組出完美先發，接著挑戰球員旅程。每款遊戲都為手機觸控重新設計。</p><div className="hub-metrics"><span><b>02</b> LIVE</span><span><b>01</b> BUILDING</span><span><b>∞</b> LINEUPS</span></div></section>
    <section className="game-library" aria-label="遊戲列表">
      <button className={settings.legendEnabled?"game-tile legend-tile":"game-tile legend-tile disabled-game"} onClick={onLegend} disabled={!settings.legendEnabled}>
        <span className="game-index">GAME 01 · {settings.legendEnabled?"LIVE":"OFFLINE"}</span><div className="tile-art legend-art"><b>99</b><i>?</i><span>🏀</span></div>
        <div className="tile-copy"><small>PLAYER BUILDER</small><h2>BUILD-A-LEGEND</h2><p>抽球隊、選球員，逐項奪取能力，打造你心中的終極球員。</p><strong>{settings.legendEnabled?"進入遊戲":"管理員已關閉"} <i>→</i></strong></div>
      </button>
      <button className={settings.perfectEnabled?"game-tile perfect-tile":"game-tile perfect-tile disabled-game"} onClick={onPerfect} disabled={!settings.perfectEnabled}>
        <span className="game-index">GAME 02 · {settings.perfectEnabled?"LIVE":"OFFLINE"}</span><div className="tile-art perfect-art"><b>82</b><i>–0</i><span>PERFECT?</span></div>
        <div className="tile-copy"><small>ALL-TIME DRAFT</small><h2>完美賽季</h2><p>抽球隊與年代，依照五個位置完成先發，挑戰電腦或朋友。</p><strong>{settings.perfectEnabled?"開始挑戰":"管理員已關閉"} <i>→</i></strong></div>
      </button>
      <div className="game-tile locked-tile" aria-disabled="true">
        <span className="game-index">GAME 03 · COMING SOON</span><div className="tile-art journey-art"><span>ATL</span><span>→</span><span>LAL</span><span>→</span><span>MIA</span></div>
        <div className="tile-copy"><small>PLAYER JOURNEY</small><h2>他是誰？</h2><p>根據球員待過的球隊順序，在提示用完前猜出正確答案。</p><strong>尚未上線・敬請期待</strong></div>
      </div>
    </section>
    <footer><button onClick={onAdmin}>ADMIN</button><span>FULL COURT LAB · MOBILE BASKETBALL ARCADE</span><span hidden>{legacyLabels}</span></footer>
  </main>;
}
