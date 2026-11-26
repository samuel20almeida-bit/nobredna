// Run after npm run build. Ensure public cart/animation layout isn't bundled into admin.
import assert from "node:assert/strict";
import fs from "node:fs";
import {gzipSync} from "node:zlib";
const manifest=JSON.parse(fs.readFileSync(".next/app-build-manifest.json","utf8"));
const keys=["/layout","/admin/layout","/admin/page","/admin/loading"];
const files=[...new Set(keys.flatMap(k=>manifest.pages[k]??[]))].filter(f=>f.endsWith(".js"));
const publicLayout=manifest.pages["/(site)/layout"]??[];
assert.ok(files.length&&publicLayout.length,"both layouts must have independent bundle entries");
assert.ok(publicLayout.some(f=>f.endsWith(".js")&&!files.includes(f)),"public layout must have its own chunks");
const buffers=files.map(file=>fs.readFileSync(".next/"+file));
const source=buffers.map(x=>x.toString()).join("\n");
for(const cartKey of ["nobre-dna:sacola","nobredna:consulta-livros-v1","nobredna:commercial-cart-v1"]){assert.ok(!source.includes(cartKey),"admin must not include public cart code: "+cartKey)}
console.log("PASS admin layout isolated",Math.round(buffers.reduce((n,b)=>n+gzipSync(b).length,0)/1024)+" KiB gzip");
