"use client";

import { useEffect, useMemo, useState } from "react";
import { NBA2K_DATA } from "./nba-data";
import { ALL_TIME_DATA } from "./all-time-data";
import GameHub from "./game-hub";
import Perfect82 from "./perfect-82";
import AdminPanel from "./admin-panel";
import { DEFAULT_SETTINGS, SETTINGS_KEY, type SiteSettings } from "./site-settings";

type Position = "控球後衛" | "得分後衛" | "小前鋒" | "大前鋒" | "中鋒";
type LeagueMode = "current" | "all-time";
type BaseAttributeKey = "threePT" | "MID" | "FIN" | "DNK" | "HAN" | "PAS" | "PDEF" | "IDEF" | "BLK" | "REB" | "ATH" | "STR" | "CLU";
type AttributeKey = BaseAttributeKey | "FT" | "FOUL" | "PASSIQ" | "STL" | "OREB" | "HSTL" | "DUR";
type Screen = "home" | "position" | "build" | "result" | "career-team" | "season" | "playoffs" | "summary";
type RosterPlayer = { name: string; cname?: string; pos: string; height: string; type: string; ovr: number } & Record<BaseAttributeKey, number> & Partial<Record<AttributeKey,number>>;
type PickedAttribute = { value: number; player: string; team: string };
type StatLine = { games: number; pts: number; reb: number; ast: number; stl: number; blk: number; fg: number; three: number };
type Ballot = { name: string; result: string; won: boolean };
type SeasonData = { wins: number; losses: number; seed: number; starter: boolean; stats: StatLine; teams: string[]; ballots: Ballot[] };
type Series = { round: string; opponent: string; wins: number; losses: number; won: boolean };
type PlayoffData = { stats: StatLine; series: Series[]; honors: string[] };

const currentLeagueData = NBA2K_DATA as unknown as Record<string, RosterPlayer[]>;
const allTimeLeagueData = ALL_TIME_DATA as unknown as Record<string, RosterPlayer[]>;
const attributes: Array<{ key: AttributeKey; label: string; short: string; icon: string }> = [
  { key: "threePT", label: "三分", short: "3PT", icon: "◎" }, { key: "MID", label: "中投", short: "MID", icon: "◉" },
  { key: "FIN", label: "終結", short: "FIN", icon: "◆" }, { key: "DNK", label: "灌籃", short: "DNK", icon: "↓" },
  { key: "FT", label: "罰球", short: "FT", icon: "○" }, { key: "FOUL", label: "造犯規", short: "FOUL", icon: "!" },
  { key: "HAN", label: "控球", short: "HAN", icon: "∞" }, { key: "PAS", label: "傳球", short: "PAS", icon: "↗" }, { key: "PASSIQ", label: "傳球判斷", short: "PIQ", icon: "⌘" },
  { key: "PDEF", label: "外防", short: "PDEF", icon: "◇" }, { key: "IDEF", label: "內防", short: "IDEF", icon: "▣" }, { key: "STL", label: "抄截", short: "STL", icon: "✦" },
  { key: "BLK", label: "阻攻", short: "BLK", icon: "╳" }, { key: "OREB", label: "進攻籃板", short: "OREB", icon: "⇧" }, { key: "REB", label: "防守籃板", short: "DREB", icon: "⇡" },
  { key: "ATH", label: "運動", short: "ATH", icon: "ϟ" }, { key: "STR", label: "力量", short: "STR", icon: "▲" }, { key: "HSTL", label: "積極性", short: "HSTL", icon: "≈" },
  { key: "DUR", label: "耐久度", short: "DUR", icon: "♥" }, { key: "CLU", label: "關鍵", short: "CLU", icon: "★" },
];
const teamNames: Record<string, string> = {
  ATL:"老鷹",BOS:"塞爾提克",BKN:"籃網",CHA:"黃蜂",CHI:"公牛",CLE:"騎士",DAL:"獨行俠",DEN:"金塊",DET:"活塞",GSW:"勇士",
  HOU:"火箭",IND:"溜馬",LAC:"快艇",LAL:"湖人",MEM:"灰熊",MIA:"熱火",MIL:"公鹿",MIN:"灰狼",NOP:"鵜鶘",NYK:"尼克",
  OKC:"雷霆",ORL:"魔術",PHI:"76人",PHX:"太陽",POR:"拓荒者",SAC:"國王",SAS:"馬刺",TOR:"暴龍",UTA:"爵士",WAS:"巫師",
};
const teamIds: Record<string, number> = {
  ATL:1610612737,BOS:1610612738,CLE:1610612739,NOP:1610612740,CHI:1610612741,DAL:1610612742,DEN:1610612743,GSW:1610612744,HOU:1610612745,
  LAC:1610612746,LAL:1610612747,MIA:1610612748,MIL:1610612749,MIN:1610612750,BKN:1610612751,NYK:1610612752,ORL:1610612753,IND:1610612754,
  PHI:1610612755,PHX:1610612756,POR:1610612757,SAC:1610612758,SAS:1610612759,OKC:1610612760,TOR:1610612761,UTA:1610612762,MEM:1610612763,
  WAS:1610612764,DET:1610612765,CHA:1610612766,
};
const positions: Position[] = ["控球後衛", "得分後衛", "小前鋒", "大前鋒", "中鋒"];
const positionCode: Record<Position, string> = { 控球後衛:"PG", 得分後衛:"SG", 小前鋒:"SF", 大前鋒:"PF", 中鋒:"C" };
const SAVE_PREFIX = "build-a-legend-save-v5";
const STARTER_OVR = 85;
const SETTINGS_API=`${process.env.NEXT_PUBLIC_SETTINGS_API_URL||""}/api/settings`;
type AdminSession={token:string;expiresAt:number};
type SaveResult="ok"|"conflict"|"unauthorized"|"error";

function shuffled<T>(items: T[]) { return [...items].sort(() => Math.random() - .5); }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function one(value: number) { return Math.round(value * 10) / 10; }
function grade(value: number) { return value >= 95 ? "S" : value >= 90 ? "A+" : value >= 85 ? "A" : value >= 80 ? "B+" : value >= 75 ? "B" : value >= 70 ? "C+" : "C"; }
function playerRating(player:RosterPlayer,key:AttributeKey){
  const direct=player[key]; if(typeof direct==="number")return direct;
  const weighted:Record<Exclude<AttributeKey,BaseAttributeKey>,number>={
    FT:player.MID*.55+player.threePT*.35+player.CLU*.1,
    FOUL:player.FIN*.5+player.DNK*.25+player.ATH*.15+player.STR*.1,
    PASSIQ:player.PAS*.7+player.HAN*.2+player.CLU*.1,
    STL:player.PDEF*.65+player.ATH*.2+player.HAN*.15,
    OREB:player.REB*.65+player.STR*.2+player.ATH*.15,
    HSTL:player.ATH*.4+player.PDEF*.25+player.REB*.2+player.CLU*.15,
    DUR:player.ATH*.35+player.STR*.25+player.CLU*.2+14,
  };
  return clamp(Math.round(weighted[key as Exclude<AttributeKey,BaseAttributeKey>]),40,99);
}
function teamAccent(code: string) { const colors=["#ff5f36","#66b8ff","#d8ff55","#b896ff","#f4c542","#58d08b"]; return colors[Math.abs(code.split("").reduce((a,c)=>a+c.charCodeAt(0),0))%colors.length]; }
function teamLogo(code: string) { return teamIds[code] ? `https://cdn.nba.com/logos/nba/${teamIds[code]}/primary/L/logo.svg` : ""; }

export default function Home(){
  const [game,setGame]=useState<"hub"|"legend"|"perfect"|"admin">("hub");
  const [settings,setSettings]=useState<SiteSettings>(DEFAULT_SETTINGS);
  const [settingsRevision,setSettingsRevision]=useState(0);
  const [lastSyncedAt,setLastSyncedAt]=useState<number|null>(null);
  useEffect(()=>{
    let active=true;
    const pull=()=>fetch(SETTINGS_API,{cache:"no-store"}).then(response=>response.ok?response.json():Promise.reject()).then(data=>{
      if(active&&data.settings){const synced={...DEFAULT_SETTINGS,...data.settings};setSettings(synced);setSettingsRevision(Number(data.updatedAt||0));setLastSyncedAt(Date.now());localStorage.setItem(SETTINGS_KEY,JSON.stringify(synced));}
    }).catch(()=>{try{const stored=localStorage.getItem(SETTINGS_KEY);if(active&&stored)setSettings({...DEFAULT_SETTINGS,...JSON.parse(stored)});}catch{}});
    void pull();
    const interval=window.setInterval(()=>{void pull();},15000);
    const onVisibility=()=>{if(document.visibilityState==="visible")void pull();};
    document.addEventListener("visibilitychange",onVisibility);
    return()=>{active=false;window.clearInterval(interval);document.removeEventListener("visibilitychange",onVisibility);};
  },[]);
  const authenticateAdmin=async(username:string,password:string)=>{
    try{
      const response=await fetch(SETTINGS_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
      if(!response.ok)return null;
      const data=await response.json();if(data.settings)setSettings({...DEFAULT_SETTINGS,...data.settings});setSettingsRevision(Number(data.updatedAt||0));setLastSyncedAt(Date.now());
      return {token:String(data.token),expiresAt:Number(data.expiresAt)} as AdminSession;
    }catch{return null;}
  };
  const updateSettings=async(next:SiteSettings,session:AdminSession):Promise<SaveResult>=>{
    try{
      const response=await fetch(SETTINGS_API,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.token}`},body:JSON.stringify({settings:next,expectedUpdatedAt:settingsRevision})});
      const data=await response.json().catch(()=>({}));
      if(response.status===409){if(data.settings)setSettings({...DEFAULT_SETTINGS,...data.settings});setSettingsRevision(Number(data.updatedAt||0));setLastSyncedAt(Date.now());return "conflict";}
      if(response.status===401)return "unauthorized";
      if(!response.ok)return "error";
      const saved={...DEFAULT_SETTINGS,...data.settings};setSettings(saved);setSettingsRevision(Number(data.updatedAt||0));setLastSyncedAt(Date.now());localStorage.setItem(SETTINGS_KEY,JSON.stringify(saved));return "ok";
    }catch{return "error";}
  };
  if(game==="hub")return <GameHub settings={settings} onLegend={()=>settings.legendEnabled&&setGame("legend")} onPerfect={()=>settings.perfectEnabled&&setGame("perfect")} onAdmin={()=>setGame("admin")}/>;
  if(game==="admin")return <AdminPanel settings={settings} lastSyncedAt={lastSyncedAt} onLogin={authenticateAdmin} onChange={updateSettings} onExit={()=>setGame("hub")}/>;
  if(game==="perfect")return <Perfect82 onExit={()=>setGame("hub")}/>;
  return <BuildALegend onExit={()=>setGame("hub")} allowUnlimitedTeamSpins={settings.unlimitedTeamSpins}/>;
}

function BuildALegend({onExit,allowUnlimitedTeamSpins}:{onExit:()=>void;allowUnlimitedTeamSpins:boolean}) {
  const [screen,setScreen]=useState<Screen>("home");
  const [leagueMode,setLeagueMode]=useState<LeagueMode>("current");
  const [position,setPosition]=useState<Position>("控球後衛");
  const [name,setName]=useState("我的傳奇");
  const [picked,setPicked]=useState<Partial<Record<AttributeKey,PickedAttribute>>>({});
  const [teamCode,setTeamCode]=useState<string|null>(null);
  const [reelCode,setReelCode]=useState("NBA");
  const [roster,setRoster]=useState<RosterPlayer[]>([]);
  const [selectedPlayer,setSelectedPlayer]=useState<RosterPlayer|null>(null);
  const [teamRolling,setTeamRolling]=useState(false);
  const [teamRerolls,setTeamRerolls]=useState(3);
  const [rerolls,setRerolls]=useState(3);
  const [usedPlayers,setUsedPlayers]=useState<string[]>([]);
  const [careerTeam,setCareerTeam]=useState<string|null>(null);
  const [careerReel,setCareerReel]=useState("NBA");
  const [careerRolling,setCareerRolling]=useState(false);
  const [season,setSeason]=useState<SeasonData|null>(null);
  const [playoffs,setPlayoffs]=useState<PlayoffData|null>(null);
  const [toast,setToast]=useState("");
  const [resumeScreen,setResumeScreen]=useState<Exclude<Screen,"home">|null>(null);

  const leagueData=leagueMode==="all-time"?allTimeLeagueData:currentLeagueData;
  const teamCodes=Object.keys(leagueData);

  const lockedCount=Object.keys(picked).length;
  const overall=useMemo(()=>{ const values=attributes.map(a=>picked[a.key]?.value).filter((v):v is number=>typeof v==="number"); return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0; },[picked]);
  const similarPlayers=useMemo(()=>{
    if(lockedCount!==attributes.length) return [];
    const selectedPosition=positionCode[position];
    return Object.entries(leagueData).flatMap(([team,players])=>players.filter(player=>player.pos.split(" / ").includes(selectedPosition)).map(player=>{
      const distance=Math.sqrt(attributes.reduce((sum,a)=>sum+Math.pow((picked[a.key]?.value??75)-playerRating(player,a.key),2),0)/attributes.length);
      return {player,team,distance,match:clamp(Math.round(100-distance*2.25),55,99)};
    })).sort((a,b)=>a.distance-b.distance).slice(0,3);
  },[lockedCount,picked,position,leagueMode]);

  useEffect(()=>{
    const lastMode=(localStorage.getItem(`${SAVE_PREFIX}-last`) as LeagueMode)||"current";
    const saved=localStorage.getItem(`${SAVE_PREFIX}-${lastMode}`); if(!saved)return;
    try { const data=JSON.parse(saved); const timer=window.setTimeout(()=>{ if(data.screen&&data.screen!=="home") { setLeagueMode(lastMode);setResumeScreen(data.screen);setPosition(data.position||"控球後衛");setName(data.name||"我的傳奇");setPicked(data.picked||{});setTeamRerolls(data.teamRerolls??3);setRerolls(data.rerolls??3);setUsedPlayers(data.usedPlayers||[]);setCareerTeam(data.careerTeam||null);setSeason(data.season||null);setPlayoffs(data.playoffs||null); } },0); return ()=>window.clearTimeout(timer); }
    catch { localStorage.removeItem(`${SAVE_PREFIX}-${lastMode}`); }
  },[]);
  useEffect(()=>{ if(screen!=="home") {localStorage.setItem(`${SAVE_PREFIX}-${leagueMode}`,JSON.stringify({screen,position,name,picked,teamRerolls,rerolls,usedPlayers,careerTeam,season,playoffs}));localStorage.setItem(`${SAVE_PREFIX}-last`,leagueMode);} },[screen,leagueMode,position,name,picked,teamRerolls,rerolls,usedPlayers,careerTeam,season,playoffs]);
  useEffect(()=>{ window.scrollTo({top:0,left:0,behavior:"auto"}); },[screen,lockedCount]);

  function resetGame(){ setScreen("position");setPicked({});setTeamCode(null);setReelCode("NBA");setRoster([]);setSelectedPlayer(null);setTeamRerolls(3);setRerolls(3);setUsedPlayers([]);setCareerTeam(null);setCareerReel("NBA");setSeason(null);setPlayoffs(null);setResumeScreen(null);localStorage.removeItem(`${SAVE_PREFIX}-${leagueMode}`); }
  function chooseLeague(mode:LeagueMode){ if(mode!==leagueMode)setResumeScreen(null);setLeagueMode(mode); }
  function goHome(){ if(screen!=="home")setResumeScreen(screen);setScreen("home"); }
  function getRoster(code:string,omit:string[]=[]){ const available=(leagueData[code]||[]).filter(p=>!usedPlayers.includes(p.name)&&!omit.includes(p.name));const source=available.length>=5?available:(leagueData[code]||[]).filter(p=>!usedPlayers.includes(p.name));return shuffled(source.length?source:leagueData[code]||[]).slice(0,5); }
  function spinTeam(){ const isReroll=teamCode!==null;if(teamRolling||(isReroll&&!allowUnlimitedTeamSpins&&teamRerolls<=0))return;if(isReroll&&!allowUnlimitedTeamSpins)setTeamRerolls(count=>count-1);setTeamRolling(true);setSelectedPlayer(null);setRoster([]);setTeamCode(null);let ticks=0;const timer=window.setInterval(()=>{setReelCode(teamCodes[Math.floor(Math.random()*teamCodes.length)]);if(++ticks>24){window.clearInterval(timer);const chosen=teamCodes[Math.floor(Math.random()*teamCodes.length)];setReelCode(chosen);setTeamCode(chosen);setRoster(getRoster(chosen));setTeamRolling(false);}},70); }
  function rerollRoster(){ if(!teamCode||rerolls<=0)return;setRoster(getRoster(teamCode,roster.map(p=>p.name)));setSelectedPlayer(null);setRerolls(r=>r-1); }
  function lockAttribute(key:AttributeKey){ if(!selectedPlayer||picked[key])return;setPicked(old=>({...old,[key]:{value:playerRating(selectedPlayer,key),player:selectedPlayer.cname||selectedPlayer.name,team:teamCode||"NBA"}}));setUsedPlayers(old=>[...old,selectedPlayer.name]);setSelectedPlayer(null);setRoster([]);setTeamCode(null);setReelCode("NBA");if(lockedCount+1===attributes.length)setScreen("result"); }
  function drawCareerTeam(){ if(careerRolling)return;setCareerRolling(true);setCareerTeam(null);let ticks=0;const timer=window.setInterval(()=>{setCareerReel(teamCodes[Math.floor(Math.random()*teamCodes.length)]);if(++ticks>24){window.clearInterval(timer);const chosen=teamCodes[Math.floor(Math.random()*teamCodes.length)];setCareerReel(chosen);setCareerTeam(chosen);setCareerRolling(false);}},70); }
  function value(key:AttributeKey){ return picked[key]?.value??75; }

  function simulateSeason(){
    const attack=(value("threePT")+value("MID")+value("FIN")+value("DNK")+value("FT")+value("FOUL")+value("HAN"))/7;
    const defense=(value("PDEF")+value("IDEF")+value("BLK")+value("REB"))/4;
    const starter=overall>=STARTER_OVR;
    const games=Math.round(clamp(70+(value("DUR")-70)*.35+Math.random()*4,60,82));
    const stats:StatLine={games,pts:one(clamp(13+(attack-75)*.55+(value("FOUL")-70)*.08+(starter?3:0)+Math.random()*3,8,36)),reb:one(clamp(3+(value("REB")-70)*.12+(value("OREB")-70)*.07+(value("STR")-75)*.04,2,14)),ast:one(clamp(2.5+(value("PAS")-70)*.13+(value("PASSIQ")-70)*.1+(value("HAN")-75)*.05,1.5,12)),stl:one(clamp(.5+(value("STL")-65)*.04,0.4,2.8)),blk:one(clamp(.3+(value("BLK")-65)*.045,0.2,3.5)),fg:one(clamp(42+(attack-70)*.25,39,58)),three:one(clamp(30+(value("threePT")-65)*.3,25,46))};
    const impact=stats.pts*.78+stats.reb*.42+stats.ast*.55+stats.stl*2+stats.blk*1.7+(overall-80)*.6;
    const wins=Math.round(clamp(31+(overall-80)*1.15+(Math.random()*10-3),34,68));
    const seed=clamp(Math.ceil((69-wins)/5),1,8);
    const teams:string[]=[];
    if(impact>=31)teams.push("年度第一隊");else if(impact>=26)teams.push("年度第二隊");else if(impact>=21)teams.push("年度第三隊");
    if(defense>=89)teams.push("年度防守第一隊");else if(defense>=82)teams.push("年度防守第二隊");
    const ballot=(award:string,score:number,winAt:number):Ballot=>{const won=score>=winAt;const rank=won?1:clamp(Math.round(18-(score-winAt+12)*.75),2,18);return {name:award,won,result:won?"當選":score>=winAt-14?`票選第 ${rank} 名`:"未入選"};};
    const mvp=ballot("MVP",impact,36);
    const sixthManScore=impact+(wins-41)*.18;
    const sixthMan:Ballot=starter
      ? {name:"最佳第六人",won:false,result:"非替補球員，無參選資格"}
      : mvp.won
        ? {name:"最佳第六人",won:false,result:"已當選 MVP，無參選資格"}
        : ballot("最佳第六人",sixthManScore,28);
    const ballots=[mvp,ballot("DPOY",defense,94),ballot("最佳新秀",impact+5,27),sixthMan,ballot("年度關鍵球員",value("CLU")+(stats.pts-20)*.8,94)];
    setSeason({wins,losses:82-wins,seed,starter,stats,teams,ballots});setScreen("season");
  }

  function simulatePlayoffs(){
    if(!season||!careerTeam)return;
    const conference=["ATL","BOS","BKN","CHA","CHI","CLE","DET","IND","MIA","MIL","NYK","ORL","PHI","TOR","WAS"].includes(careerTeam)?"東區":"西區";
    const same=teamCodes.filter(c=>c!==careerTeam&&(["ATL","BOS","BKN","CHA","CHI","CLE","DET","IND","MIA","MIL","NYK","ORL","PHI","TOR","WAS"].includes(c)===(conference==="東區")));
    const other=teamCodes.filter(c=>![...same,careerTeam].includes(c));
    const rounds=["首輪","分區準決賽",`${conference}冠軍賽`,"NBA 總決賽"];
    const series:Series[]=[];let alive=true;
    rounds.forEach((round,index)=>{ if(!alive)return;const opponent=shuffled(index===3?other:same.filter(c=>!series.some(s=>s.opponent===c)))[0];const chance=clamp(.48+(overall-84)*.018+(season.wins-45)*.006-index*.025,.25,.82);const won=Math.random()<chance;const losses=won?Math.floor(Math.random()*4):4;const wins=won?4:Math.floor(Math.random()*4);series.push({round,opponent,wins,losses,won});alive=won; });
    const games=series.reduce((sum,s)=>sum+s.wins+s.losses,0);
    const base=season.stats;const stats:StatLine={games,pts:one(base.pts+(value("CLU")-80)*.08+Math.random()*2),reb:one(base.reb+Math.random()*.8),ast:one(base.ast+Math.random()*.7),stl:one(base.stl+Math.random()*.25),blk:one(base.blk+Math.random()*.25),fg:one(base.fg-1+Math.random()*2),three:one(base.three-1+Math.random()*2)};
    const honors:string[]=[];if(series[2]?.won)honors.push(`${conference}冠軍`,`分區冠軍賽 MVP`);if(series[3]?.won)honors.push("NBA 總冠軍","FMVP");
    setPlayoffs({stats,series,honors});setScreen("playoffs");
  }
  async function shareResult(){
    const statLine=(label:string,stats:StatLine)=>`${label}：${stats.games} 場｜${stats.pts.toFixed(1)} PTS｜${stats.reb.toFixed(1)} REB｜${stats.ast.toFixed(1)} AST｜${stats.stl.toFixed(1)} STL｜${stats.blk.toFixed(1)} BLK｜${stats.fg.toFixed(1)} FG%｜${stats.three.toFixed(1)} 3P%`;
    const abilityLine=attributes.map(a=>`${a.short} ${picked[a.key]?.value??"—"}`).join("・");
    const lines=[
      "🏀 BUILD-A-LEGEND",
      `${name||"我的傳奇"}｜${overall} OVR｜${positionCode[position]}｜${leagueMode==="all-time"?"ALL-TIME 傳奇聯盟":"現役聯盟"}`,
      `20 項能力：${abilityLine}`,
      season&&careerTeam?`球隊：${teamNames[careerTeam]}｜戰績 ${season.wins}-${season.losses}｜分區第 ${season.seed}｜${season.starter?"先發":"替補"}`:null,
      season?statLine("常規賽",season.stats):null,
      playoffs?statLine("季後賽",playoffs.stats):null,
      season?`本季榮譽：${allHonors.length?allHonors.join("、"):"無"}`:null,
    ].filter((line):line is string=>Boolean(line));
    const text=lines.join("\n");
    const fullText=`${text}\n${location.href}`;
    const shareData={title:`${name||"我的傳奇"}｜${overall} OVR`,text,url:location.href};
    const copyFallback=async()=>{
      let copied=false;
      try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(fullText);copied=true;}}catch{}
      if(!copied){
        const field=document.createElement("textarea");field.value=fullText;field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();
        try{copied=document.execCommand("copy");}catch{}finally{document.body.removeChild(field);}
      }
      setToast(copied?"此瀏覽器不支援分享，完整資料已複製":"此瀏覽器無法分享，請改用系統瀏覽器開啟");
    };
    try{
      const canNativeShare=typeof navigator.share==="function"&&(!navigator.canShare||navigator.canShare(shareData));
      if(canNativeShare){await navigator.share(shareData);setToast("分享完成");}
      else await copyFallback();
    }catch(error){if(!(error instanceof DOMException&&error.name==="AbortError"))await copyFallback();}
    window.setTimeout(()=>setToast(""),1800);
  }

  const allHonors=season?[...season.teams,...season.ballots.filter(a=>a.won).map(a=>a.name),...(playoffs?.honors||[])]:[];

  return <main className="app-shell">
    <header className="topbar"><button className="wordmark" onClick={goHome} aria-label="回到遊戲首頁">BUILD-A-<i>LEGEND</i></button><div className="top-actions"><button className="hub-button" onClick={onExit} aria-label="回到遊戲大廳">⌂</button>{screen!=="home"&&<button className="icon-button" onClick={resetGame} aria-label="重新開始">↻</button>}</div></header>
    {screen==="home"&&<section className="home-screen screen-enter"><div className="eyebrow">SPIN A TEAM · STEAL A SKILL</div><h1>打造你的<br/><em>夢幻球星</em></h1><p className="lead">先選聯盟、再抽球隊與球員，從他的 20 項 2K 風格能力中奪取一項，展開完整傳奇賽季。</p><div className="league-picker" aria-label="選擇聯盟模式"><button className={leagueMode==="current"?"league-option active":"league-option"} onClick={()=>chooseLeague("current")}><span>CURRENT</span><b>現役聯盟</b><i>524 位現役球員</i></button><button className={leagueMode==="all-time"?"league-option active all-time":"league-option all-time"} onClick={()=>chooseLeague("all-time")}><span>ALL-TIME</span><b>傳奇聯盟</b><i>30 隊隊史球星</i></button></div><div className={leagueMode==="all-time"?"hero-card all-time-hero":"hero-card"} aria-hidden="true"><div className="hero-no">99</div><div className="hero-pos">{leagueMode==="all-time"?"∞":"?"}</div><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-ball">🏀</div><div className="hero-name">{leagueMode==="all-time"?<>ALL-TIME<br/>LEGENDS</>:<>YOUR<br/>LEGEND</>}</div><div className="scanline"/></div><button className="primary-button" onClick={resetGame}><span>開始{leagueMode==="all-time"?"傳奇聯盟":"現役聯盟"}建模</span><b>→</b></button>{resumeScreen&&<button className="secondary-button wide resume-button" onClick={()=>setScreen(resumeScreen)}><span>繼續上次進度</span><b>{lockedCount}/{attributes.length} →</b></button>}<div className="feature-row"><span>30 支球隊</span><span>20 項能力</span><span>{leagueMode==="all-time"?"隊史傳奇":"現役名單"}</span></div></section>}
    {screen==="position"&&<section className="content-screen screen-enter"><Progress current={0}/><div className="step-kicker">STEP 01 · {leagueMode==="all-time"?"ALL-TIME LEAGUE":"CURRENT LEAGUE"}</div><h2>先決定你的場上位置</h2><p className="muted">跨位置奪取能力也沒問題，建立你心中最理想的模板。</p><div className="position-court">{positions.map((p,i)=><button key={p} className={position===p?"position active":"position"} onClick={()=>setPosition(p)} style={{"--delay":`${i*40}ms`} as React.CSSProperties}><b>{positionCode[p]}</b><span>{p}</span></button>)}</div><label className="name-field"><span>球員名稱</span><input maxLength={12} value={name} onChange={e=>setName(e.target.value)} placeholder="輸入你的球員名稱"/></label><button className="primary-button" onClick={()=>setScreen("build")}><span>進入選隊抽籤</span><b>→</b></button></section>}
    {screen==="build"&&<section className="content-screen build-screen screen-enter"><Progress current={lockedCount}/><div className="round-meta"><span>第 {lockedCount+1} / {attributes.length} 輪</span><span>{positionCode[position]} · {name}</span></div><div className="build-title"><div><div className="step-kicker">ROUND {String(lockedCount+1).padStart(2,"0")}</div><h2>{teamCode?"從名單選一位球員":"抽出你的下一支球隊"}</h2></div><div className="build-tokens"><div className="reroll-token">換球員 <b>{rerolls}</b></div><div className="reroll-token team-reroll-token">換球隊 <b>{allowUnlimitedTeamSpins?"∞":teamRerolls}</b></div></div></div><TeamSlot code={reelCode} rolling={teamRolling}/>{!teamCode&&<button className="primary-button" onClick={spinTeam} disabled={teamRolling}><span>{teamRolling?"選隊轉盤運轉中…":"隨機抽取球隊"}</span><b>{teamRolling?"◌":"↻"}</b></button>}{teamCode&&<><div className="team-result"><div><span>本輪球隊</span><b>{teamNames[teamCode]} <i>{teamCode}</i></b></div><button onClick={spinTeam} disabled={teamRolling||(!allowUnlimitedTeamSpins&&teamRerolls===0)}>{allowUnlimitedTeamSpins?"重抽球隊 ∞":teamRerolls>0?`重抽球隊（剩餘 ${teamRerolls} 次）`:"球隊重抽次數已用完"}</button></div><div className="roster-list">{roster.map(player=><button key={player.name} className={selectedPlayer?.name===player.name?"roster-player selected":"roster-player"} onClick={()=>setSelectedPlayer(player)}><span className="roster-ovr">{player.ovr}</span><div><b>{player.cname||player.name}</b><span>{player.name} · {player.pos} · {player.type}</span></div><i>{selectedPlayer?.name===player.name?"✓":"+"}</i></button>)}</div><button className="secondary-button reroll-button" onClick={rerollRoster} disabled={rerolls===0}>更換這批球員（剩餘 {rerolls} 次）</button></>}<div className="attribute-section"><div className="section-heading"><b>{selectedPlayer?`選擇 ${selectedPlayer.cname||selectedPlayer.name} 的一項能力`:`${attributes.length} 項能力槽`}</b><span>{lockedCount}/{attributes.length}</span></div><div className="attribute-grid">{attributes.map(a=>{const locked=picked[a.key],v=selectedPlayer?playerRating(selectedPlayer,a.key):undefined;return <button key={a.key} className={locked?"attribute-slot locked":selectedPlayer?"attribute-slot available":"attribute-slot"} disabled={!!locked||!selectedPlayer} onClick={()=>lockAttribute(a.key)}><span className="attr-icon">{a.icon}</span><span className="attr-label">{a.label}</span><b>{locked?.value??v??"+"}</b><i>{locked?locked.player:v?grade(v):a.short}</i></button>;})}</div></div><p className="microcopy">選定球員後，點擊尚未鎖定的能力即可奪取；同一位球員每局只能使用一次。</p></section>}
    {screen==="result"&&<section className="result-screen screen-enter"><Progress current={attributes.length}/><div className="result-heading"><div className="step-kicker">ALL {attributes.length} ATTRIBUTES COMPLETE</div><h2>你的傳奇，正式誕生</h2></div><PlayerCard name={name} overall={overall} position={positionCode[position]} picked={picked}/><section className="similar-section"><div className="section-title"><span>PLAYER TEMPLATE · {positionCode[position]}</span><h3>同位置最相似的 3 位球員</h3></div><div className="similar-list">{similarPlayers.map(({player,team,match},i)=><div className="similar-player" key={`${team}-${player.name}`}><b className="similar-rank">0{i+1}</b><div><strong>{player.cname||player.name}</strong><span>{teamNames[team]} · {player.pos} · {player.ovr} OVR</span></div><i>{match}%</i></div>)}</div></section><div className="result-actions"><button className="primary-button" onClick={()=>setScreen("career-team")}><span>抽取生涯球隊</span><b>→</b></button><button className="secondary-button wide" onClick={shareResult}>分享球員卡</button></div><button className="text-button" onClick={resetGame}>重新打造另一位球星</button></section>}
    {screen==="career-team"&&<section className="content-screen career-screen screen-enter"><div className="step-kicker">ROOKIE DESTINATION</div><h2>抽出你的第一支 NBA 球隊</h2><p className="muted">命運將決定你的新秀賽季從哪座城市開始。</p><div className="career-draw"><TeamSlot code={careerReel} rolling={careerRolling}/></div>{!careerTeam?<button className="primary-button" onClick={drawCareerTeam} disabled={careerRolling}><span>{careerRolling?"球隊抽籤中…":"隨機抽取生涯球隊"}</span><b>↻</b></button>:<><div className="destination-card"><img src={teamLogo(careerTeam)} alt={`${teamNames[careerTeam]}標誌`}/><span>你將加入</span><h3>{teamNames[careerTeam]} <i>{careerTeam}</i></h3><p>以 {positionCode[position]} 身分展開新秀賽季</p></div><button className="primary-button" onClick={simulateSeason}><span>加入球隊並模擬 82 場</span><b>▶</b></button><button className="secondary-button wide small-gap" onClick={drawCareerTeam}>重新抽取</button></>}</section>}
    {screen==="season"&&season&&<section className="content-screen career-screen screen-enter"><CareerHeader kicker={leagueMode==="all-time"?"ALL-TIME REGULAR SEASON":"REGULAR SEASON COMPLETE"} title="82 場常規賽結束" team={careerTeam}/><div className="record-card"><div><span>球隊戰績</span><b>{season.wins}–{season.losses}</b></div><div><span>分區種子</span><b>第 {season.seed} 名</b></div><div><span>球隊角色</span><b>{season.starter?"先發":"替補"}</b></div></div><div className="role-rule"><b>{season.starter?"先發資格達成":"最佳第六人資格啟用"}</b><span>85 OVR 以上為先發；低於 85 OVR 固定從替補出發</span></div><StatPanel title="常規賽數據" stats={season.stats}/><Awards teams={season.teams} ballots={season.ballots}/><button className="primary-button" onClick={simulatePlayoffs}><span>進入 PLAYOFFS</span><b>→</b></button></section>}
    {screen==="playoffs"&&playoffs&&<section className="content-screen career-screen screen-enter"><CareerHeader kicker="PLAYOFF RUN COMPLETE" title="季後賽征途完成" team={careerTeam}/><div className="series-list">{playoffs.series.map(s=><div className="series-row" key={s.round}><div><span>{s.round}</span><b>vs {teamNames[s.opponent]} {s.opponent}</b></div><strong className={s.won?"won":"lost"}>{s.wins}–{s.losses} · {s.won?"晉級":"淘汰"}</strong></div>)}</div><StatPanel title="季後賽數據" stats={playoffs.stats}/>{playoffs.honors.length>0&&<div className="honor-wall">{playoffs.honors.map(h=><span key={h}>🏆 {h}</span>)}</div>}<button className="primary-button" onClick={()=>setScreen("summary")}><span>查看賽季最終結算</span><b>→</b></button></section>}
    {screen==="summary"&&season&&playoffs&&<section className="content-screen career-screen summary-screen screen-enter"><CareerHeader kicker="SEASON LEGACY" title={`${name} 的新秀賽季`} team={careerTeam}/><StatPanel title="常規賽數據" stats={season.stats}/><StatPanel title="PLAYOFFS 數據" stats={playoffs.stats}/><div className="award-panel final-honors"><div className="section-title"><span>HONORS</span><h3>本季所有榮譽</h3></div>{allHonors.length?<div className="honor-wall">{allHonors.map((h,i)=><span key={`${h}-${i}`}>🏆 {h}</span>)}</div>:<p className="empty-copy">本季沒有獲得獎項，但傳奇才剛開始。</p>}</div><button className="primary-button" onClick={shareResult}><span>分享我的傳奇賽季</span><b>↗</b></button><button className="text-button" onClick={resetGame}>打造下一位球星</button></section>}
    {toast&&<div className="toast">✓ {toast}</div>}<footer>球迷創作遊戲 · 非 NBA 官方產品</footer>
  </main>;
}

function TeamSlot({code,rolling}:{code:string;rolling:boolean}){return <div className={rolling?"team-slot rolling":"team-slot"} style={{"--team-accent":teamAccent(code)} as React.CSSProperties}>{teamLogo(code)&&<img className="team-logo" src={teamLogo(code)} alt={`${teamNames[code]}標誌`}/>}<span className="slot-label">TEAM DRAW</span><b className="slot-code">{code}</b><strong>{teamNames[code]||"等待抽籤"}</strong><div className="slot-lines"/></div>;}
function Progress({current}:{current:number}){return <div className="progress-wrap"><div className="progress-label"><span>ATTRIBUTES LOCKED</span><b>{current}/{attributes.length}</b></div><div className="progress-track"><i style={{width:`${current/attributes.length*100}%`}}/></div></div>;}
function PlayerCard({name,overall,position,picked}:{name:string;overall:number;position:string;picked:Partial<Record<AttributeKey,PickedAttribute>>}){return <div className="final-card final-card-13"><div className="card-glow"/><div className="card-top"><div><b className="ovr">{overall}</b><span>OVR</span></div><div className="card-position">{position}</div></div><div className="silhouette compact-ball"><span>🏀</span></div><div className="final-name">{name||"我的傳奇"}</div><div className="rating-grid rating-grid-13">{attributes.map(a=><div key={a.key}><b>{picked[a.key]?.value}</b><span>{a.short}</span></div>)}</div><div className="card-footer"><span>BUILD-A-LEGEND</span><span>{overall>=95?"神話級":overall>=90?"巨星級":"全明星級"}</span></div></div>;}
function CareerHeader({kicker,title,team}:{kicker:string;title:string;team:string|null}){return <div className="career-heading">{team&&<img src={teamLogo(team)} alt={`${teamNames[team]}標誌`}/>}<div><div className="step-kicker">{kicker}</div><h2>{title}</h2>{team&&<p>{teamNames[team]} · {team}</p>}</div></div>;}
function StatPanel({title,stats}:{title:string;stats:StatLine}){const items:[[string,string|number],[string,string|number],[string,string|number],[string,string|number],[string,string|number],[string,string|number],[string,string|number],[string,string|number]]=[["GP",stats.games],["PTS",stats.pts.toFixed(1)],["REB",stats.reb.toFixed(1)],["AST",stats.ast.toFixed(1)],["STL",stats.stl.toFixed(1)],["BLK",stats.blk.toFixed(1)],["FG%",stats.fg.toFixed(1)],["3P%",stats.three.toFixed(1)]];return <section className="stat-panel"><div className="section-title"><span>PLAYER STATS</span><h3>{title}</h3></div><div className="career-stats stat-grid">{items.map(([label,v])=><div key={label}><b>{v}</b><span>{label}</span></div>)}</div></section>;}
function Awards({teams,ballots}:{teams:string[];ballots:Ballot[]}){return <section className="award-panel"><div className="section-title"><span>AWARD RESULTS</span><h3>賽季獎項評選</h3></div><div className="team-awards">{teams.length?teams.map(t=><span key={t}>★ {t}</span>):<span>未入選年度陣容</span>}</div><div className="ballot-list">{ballots.map(a=><div className={a.won?"ballot-row selected":"ballot-row"} key={a.name}><b>{a.name}</b><span>（{a.result}）</span></div>)}</div></section>;}
