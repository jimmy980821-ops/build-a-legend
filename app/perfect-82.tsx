"use client";

import { useEffect, useMemo, useState } from "react";
import { COURT_POSITIONS, TEAM_ERAS, TEAM_NAMES, type CourtPosition, type TeamEra, type TeamEraPlayer } from "./perfect-team-data";

type BattleMode = "solo" | "cpu" | "local";
type View = "home" | "draft" | "result";
type Lineup = Record<CourtPosition, TeamEraPlayer | null>;

const TEAM_IDS:Record<string,number>={BOS:1610612738,CHI:1610612741,GSW:1610612744,LAL:1610612747,MIA:1610612748,MIL:1610612749,PHI:1610612755,PHX:1610612756,SAS:1610612759,OKC:1610612760};
const statKeys=["PTS","REB","AST","STL","BLK"] as const;
const emptyLineup=():Lineup=>({PG:null,SG:null,SF:null,PF:null,C:null});
const shuffle=<T,>(items:T[])=>[...items].sort(()=>Math.random()-.5);
const teamLogo=(team:string)=>`https://cdn.nba.com/logos/nba/${TEAM_IDS[team]}/primary/L/logo.svg`;
const lineupPlayers=(lineup:Lineup)=>COURT_POSITIONS.map(p=>lineup[p]).filter(Boolean) as TeamEraPlayer[];
const openPositions=(lineup:Lineup)=>COURT_POSITIONS.filter(p=>!lineup[p]);
const canUse=(player:TeamEraPlayer,lineup:Lineup)=>player.positions.some(p=>!lineup[p]);

function totals(players:TeamEraPlayer[]){return {pts:players.reduce((s,p)=>s+p.pts,0),reb:players.reduce((s,p)=>s+p.reb,0),ast:players.reduce((s,p)=>s+p.ast,0),stl:players.reduce((s,p)=>s+p.stl,0),blk:players.reduce((s,p)=>s+p.blk,0)};}
function rate(lineup:Lineup){const players=lineupPlayers(lineup);const t=totals(players);const raw=t.pts*.42+t.reb*.32+t.ast*.48+t.stl*1.7+t.blk*1.55;return Math.max(60,Math.min(99,Math.round(raw/1.18)));}
function projectWins(lineup:Lineup){const strength=rate(lineup);return Math.max(28,Math.min(82,Math.round(29+53*Math.pow(strength/99,2.3))));}
function stableNoise(players:TeamEraPlayer[]){return players.reduce((sum,p)=>sum+[...p.name].reduce((s,c)=>s+c.charCodeAt(0),0),0)%9-4;}
function gameScore(a:Lineup,b:Lineup){const ap=lineupPlayers(a),bp=lineupPlayers(b);const aScore=Math.round(100+(rate(a)-rate(b))*.55+stableNoise(ap));const bScore=Math.round(100+(rate(b)-rate(a))*.55+stableNoise(bp));return aScore===bScore?[aScore+1,bScore]:[aScore,bScore];}

function buildCpuLineup(excluded:Set<string>){
  const lineup=emptyLineup();
  for(const slot of COURT_POSITIONS){
    const pool=TEAM_ERAS.flatMap(t=>t.players).filter(p=>p.positions.includes(slot)&&!excluded.has(p.name));
    const ranked=[...pool].sort((a,b)=>(b.pts+b.reb*.7+b.ast*.8+b.stl*2+b.blk*2)-(a.pts+a.reb*.7+a.ast*.8+a.stl*2+a.blk*2));
    const pick=ranked[Math.floor(Math.random()*Math.min(7,ranked.length))];
    if(pick){lineup[slot]=pick;excluded.add(pick.name);}
  }
  return lineup;
}

function Court({lineup,pending,onPlace}:{lineup:Lineup;pending:TeamEraPlayer|null;onPlace:(pos:CourtPosition)=>void}){
  return <div className="lineup-court" aria-label="先發五人球場配置">
    <div className="court-key"/><div className="court-circle"/><div className="court-arc"/>
    {COURT_POSITIONS.map(pos=>{const player=lineup[pos];const valid=!!pending&&pending.positions.includes(pos)&&!player;return <button key={pos} className={`court-slot slot-${pos.toLowerCase()} ${player?"occupied":""} ${valid?"valid":""}`} onClick={()=>valid&&onPlace(pos)} disabled={!valid} aria-label={`${pos}${player?`：${player.cname}`:valid?"，可以放置":"，尚未選人"}`}><b>{pos}</b>{player&&<><span>{player.cname}</span><small>{player.era}</small></>}</button>})}
  </div>;
}

export default function Perfect82({onExit}:{onExit:()=>void}){
  const [view,setView]=useState<View>("home");
  const [battle,setBattle]=useState<BattleMode>("solo");
  const [lineups,setLineups]=useState<[Lineup,Lineup]>([emptyLineup(),emptyLineup()]);
  const [side,setSide]=useState<0|1>(0);
  const [teamEra,setTeamEra]=useState<TeamEra>(TEAM_ERAS[0]);
  const [pending,setPending]=useState<TeamEraPlayer|null>(null);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState<"ALL"|CourtPosition>("ALL");
  const [teamShuffle,setTeamShuffle]=useState(true);
  const [eraShuffle,setEraShuffle]=useState(true);
  const [drawing,setDrawing]=useState(false);
  const [drawPreview,setDrawPreview]=useState<TeamEra|null>(null);

  useEffect(()=>{if(!drawing)return;let tick=0;const reel=setInterval(()=>{setDrawPreview(TEAM_ERAS[tick%TEAM_ERAS.length]);tick+=1;},75);const finish=setTimeout(()=>{clearInterval(reel);setDrawPreview(null);setDrawing(false);},1050);return()=>{clearInterval(reel);clearTimeout(finish);};},[drawing]);

  const active=lineups[side];
  const usedNames=useMemo(()=>new Set(lineups.flatMap(lineupPlayers).map(p=>p.name)),[lineups]);
  const available=useMemo(()=>teamEra.players.filter(p=>!usedNames.has(p.name)).filter(p=>filter==="ALL"||p.positions.includes(filter)).filter(p=>`${p.name}${p.cname}`.toLowerCase().includes(search.toLowerCase())),[teamEra,usedNames,filter,search]);
  const count=lineupPlayers(active).length;
  const shownTeamEra=drawing&&drawPreview?drawPreview:teamEra;

  const eligibleTeamEras=(lineup:Lineup,extraExcluded=new Set<string>())=>TEAM_ERAS.filter(t=>t.players.some(p=>!extraExcluded.has(p.name)&&!usedNames.has(p.name)&&canUse(p,lineup)));
  const beginDraw=(target:TeamEra)=>{setTeamEra(target);setDrawPreview(shuffle(TEAM_ERAS)[0]);setDrawing(false);requestAnimationFrame(()=>setDrawing(true));};
  const drawNext=(lineup:Lineup)=>{const excluded=new Set([...usedNames,...lineupPlayers(lineup).map(p=>p.name)]);const pool=eligibleTeamEras(lineup,excluded);const different=pool.filter(t=>t.team!==teamEra.team||t.era!==teamEra.era);beginDraw(shuffle(different.length?different:pool)[0]||TEAM_ERAS[0]);setPending(null);setSearch("");setFilter("ALL");setTeamShuffle(true);setEraShuffle(true);};
  const start=(mode:BattleMode)=>{const next:[Lineup,Lineup]=[emptyLineup(),emptyLineup()];setBattle(mode);setLineups(next);setSide(0);setTeamShuffle(true);setEraShuffle(true);setPending(null);setView("draft");beginDraw(shuffle(TEAM_ERAS)[0]);};
  const reset=()=>{setView("home");setLineups([emptyLineup(),emptyLineup()]);setPending(null);};
  const place=(pos:CourtPosition)=>{
    if(!pending||active[pos]||!pending.positions.includes(pos)||usedNames.has(pending.name))return;
    const nextLineup={...active,[pos]:pending};
    const nextLineups:[Lineup,Lineup]=[lineups[0],lineups[1]];nextLineups[side]=nextLineup;setLineups(nextLineups);setPending(null);
    if(lineupPlayers(nextLineup).length<5){drawNext(nextLineup);return;}
    if(battle==="solo"){setView("result");return;}
    if(battle==="cpu"){nextLineups[1]=buildCpuLineup(new Set(lineupPlayers(nextLineup).map(p=>p.name)));setLineups([...nextLineups] as [Lineup,Lineup]);setView("result");return;}
    if(side===0){setSide(1);setTeamShuffle(true);setEraShuffle(true);beginDraw(shuffle(TEAM_ERAS)[0]);setSearch("");setFilter("ALL");return;}
    setView("result");
  };
  const changeTeam=()=>{if(!teamShuffle||drawing)return;const sameEra=eligibleTeamEras(active).filter(t=>t.era===teamEra.era&&t.team!==teamEra.team);beginDraw(shuffle(sameEra.length?sameEra:eligibleTeamEras(active).filter(t=>t.team!==teamEra.team))[0]||teamEra);setPending(null);setTeamShuffle(false);};
  const changeEra=()=>{if(!eraShuffle||drawing)return;const sameTeam=eligibleTeamEras(active).filter(t=>t.team===teamEra.team&&t.era!==teamEra.era);beginDraw(shuffle(sameTeam.length?sameTeam:eligibleTeamEras(active).filter(t=>t.era!==teamEra.era))[0]||teamEra);setPending(null);setEraShuffle(false);};
  const scores=battle==="solo"?null:gameScore(lineups[0],lineups[1]);

  return <main className="perfect-game-v2">
    <header className="perfect-nav"><button className="perfect-logo" onClick={reset}>PERFECT <i>82</i></button><div><button onClick={onExit} aria-label="回到遊戲大廳">⌂</button>{view!=="home"&&<button onClick={()=>start(battle)} aria-label="重新開始">↻</button>}</div></header>

    {view==="home"&&<section className="perfect-home-v2 screen-enter">
      <div className="eyebrow">BUILD FIVE · OWN EVERY POSITION</div><h1>組出你的<br/><em>完美先發</em></h1><p>每輪抽出一支球隊與年代，從該隊完整候選名單挑一位球員，再把他放進合法位置。雙位置球員可以自由換位。</p>
      <div className="home-court"><Court lineup={emptyLineup()} pending={null} onPlace={()=>{}}/><strong>PG · SG · SF · PF · C</strong></div>
      <div className="battle-modes"><button onClick={()=>start("solo")}><span>82–0 CHALLENGE</span><b>單人完美賽季</b><i>組隊後模擬 82 場戰績 →</i></button><button onClick={()=>start("cpu")}><span>1 VS CPU</span><b>挑戰電腦</b><i>完成陣容後立即對決 →</i></button><button onClick={()=>start("local")}><span>LOCAL 1 VS 1</span><b>同機雙人對戰</b><i>兩位玩家輪流組隊 →</i></button></div>
    </section>}

    {view==="draft"&&<section className="roster-builder screen-enter">
      <div className="draft-status"><div><small>{battle==="local"?`玩家 ${side+1}`:side===0?"你的球隊":"電腦"}</small><b>Round {count+1}/5</b></div><div>{COURT_POSITIONS.map(p=><i key={p} className={active[p]?"filled":""}/>)}</div></div>
      <div className={drawing?"drawn-team is-drawing":"drawn-team"}><img src={teamLogo(shownTeamEra.team)} alt={`${TEAM_NAMES[shownTeamEra.team]}標誌`}/><div><small>{drawing?"抽選中…":"本輪球隊"}</small><b>{shownTeamEra.label}</b><span>{shownTeamEra.team} · {shownTeamEra.era}</span></div><div className="redraws"><button onClick={changeTeam} disabled={!teamShuffle||drawing}>↻ Team</button><button onClick={changeEra} disabled={!eraShuffle||drawing}>↻ Era</button></div>{drawing&&<div className="draw-reel" aria-live="polite"><span>TEAM</span><i>×</i><span>ERA</span></div>}</div>
      <div className={drawing?"builder-grid drawing-locked":"builder-grid"}>
        <div className="player-browser"><div className="player-tools"><div>{["ALL",...COURT_POSITIONS].map(p=><button key={p} className={filter===p?"active":""} onClick={()=>setFilter(p as "ALL"|CourtPosition)}>{p}</button>)}</div><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋球員…" aria-label="搜尋球員"/></div><p><b>{available.length}</b> 位球員可選 <span>{pending?`已選 ${pending.cname}，請點球場位置`:`先選球員，再點球場位置`}</span></p><div className="team-player-list">{available.map(player=>{const usable=canUse(player,active);return <button key={player.name} className={pending?.name===player.name?"selected":""} disabled={drawing||!usable} onClick={()=>setPending(player)}><div><b>{player.cname}</b><span>{player.name} · {player.pos}</span></div><div className="mini-stats">{statKeys.map(k=><span key={k}><b>{player[k.toLowerCase() as "pts"].toFixed(1)}</b><small>{k}</small></span>)}</div>{!usable&&<i>無可用位置</i>}</button>})}</div></div>
        <div className="court-column"><Court lineup={active} pending={pending} onPlace={place}/><div className={pending?"placement-tip active":"placement-tip"}>{pending?`正在放置：${pending.cname}（${pending.pos}）— 點選發亮位置`:`從左側選擇球員，再點球場位置`}</div></div>
      </div>
    </section>}

    {view==="result"&&<section className="battle-result screen-enter">
      <div className="eyebrow">SIMULATION COMPLETE</div>{battle==="solo"?<><div className={projectWins(lineups[0])===82?"solo-record perfect":"solo-record"}><small>FINAL RECORD</small><div><b>{projectWins(lineups[0])}</b><span>–{82-projectWins(lineups[0])}</span></div><strong>{projectWins(lineups[0])===82?"PERFECT SEASON":"賽季挑戰完成"}</strong></div></>:<div className="versus-score"><small>{scores![0]>scores![1]?"玩家 1 獲勝":"對手獲勝"}</small><div><b>{scores![0]}</b><i>:</i><b>{scores![1]}</b></div><span>FINAL · 1 VS 1</span></div>}
      <div className="result-lineups">{lineups.slice(0,battle==="solo"?1:2).map((lineup,index)=><div key={index}><header><span>{index===0?"玩家 1":battle==="cpu"?"CPU":"玩家 2"}</span><b>{rate(lineup)} OVR</b></header>{COURT_POSITIONS.map(pos=>{const p=lineup[pos]!;return <div className="result-player" key={pos}><strong>{pos}</strong><div><b>{p.cname}</b><span>{p.era} · {TEAM_NAMES[p.team]} · {p.pos}</span></div><i>{p.pts.toFixed(1)} PTS</i></div>})}</div>)}</div>
      <div className="result-actions"><button className="primary-button" onClick={()=>start(battle)}><span>再玩一次</span><b>↻</b></button><button className="secondary-button wide" onClick={onExit}>回到遊戲大廳</button></div>
    </section>}
  </main>;
}
