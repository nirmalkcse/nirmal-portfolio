import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const nextCli = resolve("node_modules", "next", "dist", "bin", "next");

const result = spawnSync(process.execPath, [nextCli, "build"], {
  env: {
    ...process.env,
    CF_PAGES: "1"
  },
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

/*
 * Next 16's static export writes segment prefetch payloads into folders,
 * e.g. out/profile/__next.profile/__PAGE__.txt, but the client router
 * requests them dot-joined: /profile/__next.profile.__PAGE__.txt. On a
 * static host those requests 404, every prefetch misses, and in-app
 * navigation falls back to full page loads. Write each payload a second
 * time under the name the router asks for (never overwriting a real file).
 */
const outDir = resolve("out");
let flattened = 0;

function flattenSegmentDir(segmentDir) {
  const routeDir = resolve(segmentDir, "..");
  const prefix = segmentDir.slice(routeDir.length + 1);

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      const flatName = [prefix, ...relative(segmentDir, path).split(sep)].join(".");
      const target = join(routeDir, flatName);
      if (!existsSync(target)) {
        copyFileSync(path, target);
        flattened += 1;
      }
    }
  };

  walk(segmentDir);
}

function findSegmentDirs(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (!statSync(path).isDirectory() || entry === "_next") continue;
    if (entry.startsWith("__next.")) {
      flattenSegmentDir(path);
    } else {
      findSegmentDirs(path);
    }
  }
}

if (existsSync(outDir)) {
  findSegmentDirs(outDir);
  console.log(`Cloudflare Pages: wrote ${flattened} dot-joined segment prefetch files.`);
}
