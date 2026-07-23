"use client";

import { useState, type FormEvent } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "./site-settings";

function SpringSwitch({on,onChange,label}:{on:boolean;onChange:()=>void;label:string}){
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={on?"switch on":"switch"} onClick={onChange}><span className="switch-knob"/></button>;
}

type Credentials={username:string;password:string};

export default function AdminPanel({settings,onLogin,onChange,onExit}:{settings:SiteSettings;onLogin:(username:string,password:string)=>Promise<boolean>;onChange:(next:SiteSettings,credentials:Credentials)=>Promise<boolean>;onExit:()=>void}){
  const [loggedIn,setLoggedIn]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState(false);
  const [busy,setBusy]=useState(false);
  const [saved,setSaved]=useState(false);
  const notifySaved=()=>{setSaved(true);window.setTimeout(()=>setSaved(false),1400);};
  const login=async(event:FormEvent)=>{
    event.preventDefault();
    setBusy(true);const valid=await onLogin(username.trim().toLowerCase(),password);setBusy(false);
    if(valid){setLoggedIn(true);setError(false);}else{setError(true);setPassword("");}
  };
  const save=async(next:SiteSettings)=>{setBusy(true);const ok=await onChange(next,{username:username.trim().toLowerCase(),password});setBusy(false);if(ok)notifySaved();else setError(true);};
  const toggle=(key:keyof SiteSettings)=>{void save({...settings,[key]:!settings[key]});};
  const resetSettings=()=>{void save({...DEFAULT_SETTINGS});};

  if(!loggedIn)return <main className="admin-shell admin-signin-shell">
    <header className="admin-nav"><button onClick={onExit}>← 返回</button><span>FULL COURT LAB</span></header>
    <section className="admin-login screen-enter">
      <div className="signin-stage" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
      <div className="admin-login-card">
        <div className="signin-logo">🏀</div>
        <span className="signin-kicker">CONTROL ROOM</span>
        <h1>歡迎<em>回來</em></h1>
        <p>登入管理員控制台</p>
        <form onSubmit={login}>
          <label><span>帳號</span><div className="signin-field"><i>◎</i><input aria-label="管理員帳號" autoFocus type="text" autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError(false);}} placeholder="輸入管理員帳號" aria-invalid={error}/></div></label>
          <label><span>密碼</span><div className="signin-field"><i>◇</i><input aria-label="管理密碼" type={showPassword?"text":"password"} inputMode="numeric" autoComplete="current-password" maxLength={6} value={password} onChange={e=>{setPassword(e.target.value.replace(/\D/g,""));setError(false);}} placeholder="輸入 6 位數密碼" aria-invalid={error}/><button type="button" className="password-peek" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?"隱藏密碼":"顯示密碼"}>{showPassword?"隱藏":"顯示"}</button></div></label>
          {error&&<div className="login-error" role="alert">帳號或密碼錯誤，請再試一次</div>}
          <button className="signin-submit" type="submit" disabled={busy||!username.trim()||password.length!==6}><span>{busy?"驗證中…":"登入控制台"}</span><b>{busy?"◌":"→"}</b></button>
        </form>
        <small>僅供授權管理員使用</small>
      </div>
    </section>
  </main>;

  return <main className="admin-shell">
    <header className="admin-nav"><button onClick={onExit}>← 返回大廳</button><span>CONTROL ROOM</span><i className="online">ADMIN ONLINE</i></header>
    <section className="admin-dashboard screen-enter">
      <div className="admin-heading"><div><h1><span>遊戲</span><em>控制台</em></h1></div><div className="admin-count"><b>{Number(settings.legendEnabled)+Number(settings.perfectEnabled)}</b><span>GAMES LIVE</span></div></div>
      <div className="admin-grid">
        <article className="admin-card"><header><span>01</span><i>GAME ACCESS</i></header>
          <div className="admin-row"><div><b>BUILD-A-LEGEND</b><span>第一款球員養成遊戲</span></div><SpringSwitch on={settings.legendEnabled} onChange={()=>!busy&&toggle("legendEnabled")} label="切換第一款遊戲"/></div>
          <div className="admin-row"><div><b>PERFECT 82</b><span>第二款夢幻先發遊戲</span></div><SpringSwitch on={settings.perfectEnabled} onChange={()=>!busy&&toggle("perfectEnabled")} label="切換第二款遊戲"/></div>
          <div className="admin-row"><div><b>PLAYER JOURNEY 預告</b><span>控制首頁是否顯示第三款遊戲</span></div><SpringSwitch on={settings.showComingSoon} onChange={()=>!busy&&toggle("showComingSoon")} label="切換第三款遊戲預告"/></div>
        </article>
        <article className="admin-card accent-card"><header><span>02</span><i>GAME 01 PERMISSION</i></header>
          <div className="admin-feature"><div className="feature-glyph">↻</div><div><b>無限重抽球隊</b><p>開啟後可無限重抽；關閉後，每次建立球員仍保留 3 次球隊重抽機會。</p></div></div>
          <div className="admin-row featured"><div><b>{settings.unlimitedTeamSpins?"目前為無限次":"目前限制為 3 次"}</b><span>只影響 BUILD-A-LEGEND</span></div><SpringSwitch on={settings.unlimitedTeamSpins} onChange={()=>!busy&&toggle("unlimitedTeamSpins")} label="切換無限重抽球隊"/></div>
        </article>
        <article className="admin-card admin-system-card"><header><span>03</span><i>SYSTEM</i></header>
          <div className="admin-system-copy"><b>全站同步</b><p>設定儲存在雲端，手機或電腦修改後會套用到所有玩家與裝置。</p></div>
          <button className="reset-settings" type="button" onClick={resetSettings} disabled={busy}>{busy?"儲存中…":"恢復預設設定"}</button>
        </article>
      </div>
      <div className={saved?"admin-toast show":"admin-toast"}>✓ 全站設定已同步</div>
      <button className="admin-logout" onClick={()=>setLoggedIn(false)}>登出管理員</button>
    </section>
  </main>;
}
