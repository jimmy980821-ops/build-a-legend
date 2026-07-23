/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
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
  "Access-Control-Allow-Headers":"Content-Type",
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

async function handleSettings(request:Request,env:Env){
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders});
  const read=async()=>{await ensureSettings(env.DB);return fromRow(await env.DB.prepare("SELECT * FROM site_settings WHERE id = ?").bind("global").first<Record<string,unknown>>());};
  if(request.method==="GET"){
    try{return json({settings:await read()});}catch{return json({error:"Settings database unavailable"},503);}
  }
  try{
    const body=await request.json() as {username?:unknown;password?:unknown;credentials?:{username?:unknown;password?:unknown};settings?:unknown};
    const credentials=request.method==="POST"?body:body.credentials;
    if(credentials?.username!==env.ADMIN_USERNAME||credentials?.password!==env.ADMIN_PASSWORD)return json({error:"Unauthorized"},401);
    if(request.method==="POST")return json({ok:true,settings:await read()});
    if(request.method!=="PUT")return json({error:"Method not allowed"},405);
    const next=normalized(body.settings);await ensureSettings(env.DB);
    await env.DB.prepare(`INSERT INTO site_settings
      (id,legend_enabled,perfect_enabled,unlimited_team_spins,show_coming_soon,updated_at)
      VALUES (?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
      legend_enabled=excluded.legend_enabled,
      perfect_enabled=excluded.perfect_enabled,
      unlimited_team_spins=excluded.unlimited_team_spins,
      show_coming_soon=excluded.show_coming_soon,
      updated_at=excluded.updated_at`)
      .bind("global",Number(next.legendEnabled),Number(next.perfectEnabled),Number(next.unlimitedTeamSpins),Number(next.showComingSoon),Date.now()).run();
    return json({ok:true,settings:next});
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
