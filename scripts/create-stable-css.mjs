import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const cssDir=join(process.cwd(),"out","_next","static","chunks");
const files=(await readdir(cssDir)).filter(file=>file.endsWith(".css")).sort();
if(!files.length)throw new Error("No exported CSS chunks found");
const css=(await Promise.all(files.map(file=>readFile(join(cssDir,file),"utf8")))).join("\n");
await writeFile(join(process.cwd(),"out","site-stable.css"),css,"utf8");
console.log(`Created stable CSS fallback from ${files.length} chunk(s)`);

