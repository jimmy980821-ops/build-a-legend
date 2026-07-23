/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

type SiteSettings = {
  legendEnabled: boolean;
  perfectEnabled: boolean;
  unlimitedTeamSpins: boolean;
  showComingSoon: boolean;
};

const defaultSettings:SiteSettings={legendEnabled:true,perfectEnabled:true,unlimitedTeamSpins:true,showComingSoon:true};
const corsHeaders={
  "Access-Control-Allow-Origin":"https://jimmy980821-ops.github.io",
  "Access-Control-Allow-Headers":"Content-Type, Authorization",
  "Access-Control-Allow-Methods":"GET, POST, PUT, OPTIONS",
  "Cache-Control":"no-store",
};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:corsHeaders});

async function ensureSettings(db:D1Database){
  await db.prepare(`CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY,
    legend_enabled INTEGER NOT NULL DEFAULT 1,
    perfect_enabled INTEGER NOT NULL DEFAULT 1,
    unlimited_team_spins INTEGER NOT NULL DEFAULT 1,
    show_coming_soon INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
    client_id TEXT PRIMARY KEY,
    failures INTEGER NOT NULL DEFAULT 0,
    window_started_at INTEGER NOT NULL
  )`).run();
}

const fromRow=(row:Record<string,unknown>|null):SiteSettings=>row?{
  legendEnabled:Boolean(row.legend_enabled),
  perfectEnabled:Boolean(row.perfect_enabled),
  unlimitedTeamSpins:Boolean(row.unlimited_team_spins),
  showComingSoon:Boolean(row.show_coming_soon),
}:defaultSettings;

const normalized=(value:unknown):SiteSettings=>{
  const input=(value&&typeof value==="object"?value:{}) as Partial<SiteSettings>;
  return {legendEnabled:Boolean(input.legendEnabled),perfectEnabled:Boolean(input.perfectEnabled),unlimitedTeamSpins:Boolean(input.unlimitedTeamSpins),showComingSoon:Boolean(input.showComingSoon)};
};

const base64Url=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
async function sessionSignature(payload:string,secret:string){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(payload))));
}
async function createSession(secret:string){
  const expiresAt=Date.now()+30*60*1000;
  const payload=`${expiresAt}.${crypto.randomUUID()}`;
  return {token:`${payload}.${await sessionSignature(payload,secret)}`,expiresAt};
}
async function validSession(request:Request,secret:string){
  const token=request.headers.get("Authorization")?.replace(/^Bearer\s+/,"")||"";
  const pieces=token.split(".");if(pieces.length!==3)return false;
  const payload=`${pieces[0]}.${pieces[1]}`;
  const expiresAt=Number(pieces[0]);if(!Number.isFinite(expiresAt)||expiresAt<Date.now())return false;
  return pieces[2]===await sessionSignature(payload,secret);
}
function clientId(request:Request){
  return request.headers.get("CF-Connecting-IP")||request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()||"unknown";
}
async function loginBlocked(db:D1Database,id:string){
  const row=await db.prepare("SELECT failures, window_started_at FROM admin_login_attempts WHERE client_id = ?").bind(id).first<{failures:number;window_started_at:number}>();
  return Boolean(row&&Date.now()-row.window_started_at<15*60*1000&&row.failures>=5);
}
async function recordFailure(db:D1Database,id:string){
  const now=Date.now();
  await db.prepare(`INSERT INTO admin_login_attempts (client_id,failures,window_started_at) VALUES (?,1,?)
    ON CONFLICT(client_id) DO UPDATE SET
    failures=CASE WHEN ?-window_started_at>=900000 THEN 1 ELSE failures+1 END,
    window_started_at=CASE WHEN ?-window_started_at>=900000 THEN ? ELSE window_started_at END`)
    .bind(id,now,now,now,now).run();
}

async function handleSettings(request:Request,env:Env){
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders});
  const read=async()=>{
    await ensureSettings(env.DB);
    const row=await env.DB.prepare("SELECT * FROM site_settings WHERE id = ?").bind("global").first<Record<string,unknown>>();
    return {settings:fromRow(row),updatedAt:Number(row?.updated_at||0)};
  };
  if(request.method==="GET"){
    try{return json(await read());}catch{return json({error:"Settings database unavailable"},503);}
  }
  try{
    const body=await request.json() as {username?:unknown;password?:unknown;settings?:unknown;expectedUpdatedAt?:unknown};
    if(request.method==="POST"){
      await ensureSettings(env.DB);const id=clientId(request);
      if(await loginBlocked(env.DB,id))return json({error:"Too many attempts"},429);
      if(body.username!==env.ADMIN_USERNAME||body.password!==env.ADMIN_PASSWORD){await recordFailure(env.DB,id);return json({error:"Unauthorized"},401);}
      await env.DB.prepare("DELETE FROM admin_login_attempts WHERE client_id = ?").bind(id).run();
      const session=await createSession(env.SESSION_SECRET);
      return json({ok:true,...session,...await read()});
    }
    if(request.method!=="PUT")return json({error:"Method not allowed"},405);
    if(!await validSession(request,env.SESSION_SECRET))return json({error:"Session expired"},401);
    const current=await read();const expected=Number(body.expectedUpdatedAt||0);
    if(current.updatedAt!==expected)return json({error:"Settings changed",...current},409);
    const next=normalized(body.settings);const updatedAt=Date.now();
    await env.DB.prepare(`INSERT INTO site_settings
      (id,legend_enabled,perfect_enabled,unlimited_team_spins,show_coming_soon,updated_at)
      VALUES (?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
      legend_enabled=excluded.legend_enabled,
      perfect_enabled=excluded.perfect_enabled,
      unlimited_team_spins=excluded.unlimited_team_spins,
      show_coming_soon=excluded.show_coming_soon,
      updated_at=excluded.updated_at`)
      .bind("global",Number(next.legendEnabled),Number(next.perfectEnabled),Number(next.unlimitedTeamSpins),Number(next.showComingSoon),updatedAt).run();
    return json({ok:true,settings:next,updatedAt});
  }catch{return json({error:"Invalid request"},400);}
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/settings") {
      return handleSettings(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
