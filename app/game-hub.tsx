"use client";

export default function GameHub({onLegend,onPerfect}:{onLegend:()=>void;onPerfect:()=>void}){
  return <main className="arcade-shell">
    <header className="arcade-header"><div className="arcade-logo"><span>FULL</span> COURT <i>LAB</i></div><div className="live-dot">2 GAMES LIVE</div></header>
    <section className="arcade-intro"><div className="eyebrow">BASKETBALL GAME SERIES</div><h1>每一場，都是<br/><em>新的籃球難題。</em></h1><p>打造球星、組建跨年代夢幻隊，接下來還有更多考驗籃球記憶的遊戲。</p></section>
    <section className="game-library" aria-label="遊戲列表">
      <button className="game-tile legend-tile" onClick={onLegend}>
        <span className="game-index">GAME 01 · LIVE</span><div className="tile-art legend-art"><b>99</b><i>?</i><span>🏀</span></div>
        <div className="tile-copy"><small>PLAYER BUILDER</small><h2>BUILD-A-LEGEND</h2><p>抽球隊、選球員，奪取20項能力打造你的夢幻球星。</p><strong>進入遊戲 <i>→</i></strong></div>
      </button>
      <button className="game-tile perfect-tile" onClick={onPerfect}>
        <span className="game-index">GAME 02 · NEW</span><div className="tile-art perfect-art"><b>82</b><i>–0</i><span>PERFECT?</span></div>
        <div className="tile-copy"><small>ALL-TIME DRAFT</small><h2>完美賽季</h2><p>跨七個年代挑出五位傳奇，看看這支球隊能拿下幾勝。</p><strong>開始挑戰 <i>→</i></strong></div>
      </button>
      <div className="game-tile locked-tile" aria-disabled="true">
        <span className="game-index">GAME 03 · COMING SOON</span><div className="tile-art journey-art"><span>ATL</span><span>→</span><span>LAL</span><span>→</span><span>MIA</span></div>
        <div className="tile-copy"><small>PLAYER JOURNEY</small><h2>他是誰？</h2><p>根據球員效力過的球隊順序，猜出這位神秘球員。</p><strong>未上線・敬請期待</strong></div>
      </div>
    </section>
    <footer>FULL COURT LAB · 球迷創作遊戲系列</footer>
  </main>;
}
