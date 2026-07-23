"use client";

import { useState, type FormEvent } from "react";
import type { SiteSettings } from "./site-settings";
import { GlowCard } from "@/components/ui/spotlight-card";

const ADMIN_USERNAME = "jimmy";
const ADMIN_PASSWORD = "980821";

function SpringSwitch({on,onChange,label}:{on:boolean;onChange:()=>void;label:string}){
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={on?"switch on":"switch"} onClick={onChange}><span className="switch-knob"/></button>;
}

export default function AdminPanel({settings,onChange,onExit}:{settings:SiteSettings;onChange:(next:SiteSettings)=>void;onExit:()=>void}){
  const [loggedIn,setLoggedIn]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(false);
  const [saved,setSaved]=useState(false);
  const login=(event:FormEvent)=>{event.preventDefault();if(username.trim().toLowerCase()===ADMIN_USERNAME&&password===ADMIN_PASSWORD){setLoggedIn(true);setError(false);setUsername("");setPassword("");}else{setError(true);setPassword("");}};
  const toggle=(key:keyof SiteSettings)=>{onChange({...settings,[key]:!settings[key]});setSaved(true);window.setTimeout(()=>setSaved(false),1400);};

  if(!loggedIn)return <main className="admin-shell"><header className="admin-nav"><button onClick={onExit}>← 返回</button><span>FULL COURT LAB</span></header><section className="admin-login screen-enter"><GlowCard glowColor="orange" customSize className="admin-login-card"><div className="admin-orb">⌁</div><h1>管理員<em>登入</em></h1><form onSubmit={login}><input aria-label="管理員帳號" autoFocus type="text" autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError(false);}} placeholder="帳號" aria-invalid={error}/><input aria-label="管理密碼" type="password" inputMode="numeric" autoComplete="current-password" maxLength={6} value={password} onChange={e=>{setPassword(e.target.value.replace(/\D/g,""));setError(false);}} placeholder="密碼" aria-invalid={error}/>{error&&<div className="login-error">帳號或密碼錯誤</div>}<button className="kinetic-action" type="submit" disabled={!username.trim()||password.length!==6}><span>登入</span><b>→</b></button></form></GlowCard></section></main>;

  return <main className="admin-shell"><header className="admin-nav"><button onClick={onExit}>← 返回大廳</button><span>CONTROL ROOM</span><i className="online">ADMIN ONLINE</i></header><section className="admin-dashboard screen-enter"><div className="admin-heading"><div><h1>遊戲<br/><em>控制台</em></h1></div><div className="admin-count"><b>{Number(settings.legendEnabled)+Number(settings.perfectEnabled)}</b><span>GAMES LIVE</span></div></div><div className="admin-grid"><article className="admin-card"><header><span>01</span><i>GAME ACCESS</i></header><div className="admin-row"><div><b>BUILD-A-LEGEND</b><span>第一款球員養成遊戲</span></div><SpringSwitch on={settings.legendEnabled} onChange={()=>toggle("legendEnabled")} label="切換第一款遊戲"/></div><div className="admin-row"><div><b>PERFECT 82</b><span>第二款夢幻先發遊戲</span></div><SpringSwitch on={settings.perfectEnabled} onChange={()=>toggle("perfectEnabled")} label="切換第二款遊戲"/></div><div className="admin-row locked"><div><b>PLAYER JOURNEY</b><span>第三款尚未開發完成</span></div><em>COMING SOON</em></div></article><article className="admin-card accent-card"><header><span>02</span><i>GAME 01 PERMISSION</i></header><div className="admin-feature"><div className="feature-glyph">↻</div><div><b>無限重抽球隊</b><p>開啟後，玩家可一直重抽本輪球隊；關閉後，抽到球隊便不能再次更換。</p></div></div><div className="admin-row featured"><div><b>{settings.unlimitedTeamSpins?"目前允許重抽":"目前禁止重抽"}</b><span>只影響 BUILD-A-LEGEND</span></div><SpringSwitch on={settings.unlimitedTeamSpins} onChange={()=>toggle("unlimitedTeamSpins")} label="切換無限重抽球隊"/></div></article></div><div className={saved?"admin-toast show":"admin-toast"}>✓ 設定已儲存到此裝置</div><button className="admin-logout" onClick={()=>setLoggedIn(false)}>登出管理員</button></section></main>;
}
