#!/usr/bin/env node
/**
 * 🏗️ Next.js Architecture Audit
 *
 * Runs as part of CI after lint/tsc to catch structural issues that
 * ESLint and TypeScript don't detect.
 *
 * Checks:
 *  1. Duplicate files (server/actions/ vs app/(server)/actions/)
 *  2. "use server" files exporting non-function values (runtime crashes)
 *  3. Plain <img> tags (should use next/image)
 *  4. console.log() in production code
 *  5. Dead barrel exports (exports no one imports)
 *  6. Missing "use client" in _components/ using React hooks
 *  7. Missing generateMetadata in page.tsx files (SEO)
 *  8. Cross-route-group imports (boundary violations)
 *  9. Circular imports (via madge if available)
 * 10. Admin UI importing from API routes (bypassing server actions)
 * 11. File naming conventions in app/ route groups
 *
 * Usage: node scripts/check-architecture.mjs
 * Exit code: 0 = clean, 2 = errors (warnings are non-fatal)
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, relative, resolve, basename, dirname } from "path";
import { execSync } from "child_process";

const ROOT = resolve(import.meta.dirname, "..");
const IGNORE_DIRS = new Set(["node_modules", ".next", "out", "build", ".git", "playwright-report", "scratch"]);
const IGNORE_FILES = new Set(["next-env.d.ts", "package-lock.json"]);

// React hooks that only work in client components
const CLIENT_HOOKS = [
  "useState", "useEffect", "useContext", "useReducer",
  "useCallback", "useMemo", "useRef", "useImperativeHandle",
  "useLayoutEffect", "useDebugValue", "useSyncExternalStore",
  "useTransition", "useDeferredValue", "useOptimistic",
  "useActionState",
];

let errors = [];
let warnings = [];

function walk(dir, fn, prefix = "") {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name) || IGNORE_FILES.has(entry.name)) continue;
      if (entry.name.startsWith(".")) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath, fn, join(prefix, entry.name));
      else if (entry.isFile()) fn(fullPath, relative(ROOT, fullPath));
    }
  } catch { /* permission denied, skip */ }
}

function readFile(path) {
  try {
    return readFileSync(path, "utf-8");
  } catch { return ""; }
}

function info(msg) {
  console.log(`   ℹ️  ${msg}`);
}

// ─── 1. Duplicate files ─────────────────────────────────────────────────

function checkDuplicates() {
  const serverActions = join(ROOT, "server/actions");
  const appServerActions = join(ROOT, "app/(server)/actions");
  if (!existsSync(serverActions) || !existsSync(appServerActions)) return;

  const serverFiles = new Set(readdirSync(serverActions).filter(f => f.endsWith(".ts")));
  const appFiles = readdirSync(appServerActions).filter(f => f.endsWith(".ts"));

  for (const file of appFiles) {
    if (!serverFiles.has(file)) continue;
    const s = readFileSync(join(serverActions, file), "utf-8");
    const a = readFileSync(join(appServerActions, file), "utf-8");
    if (s === a) {
      warnings.push(`Duplicate file: app/(server)/actions/${file} == server/actions/${file}`);
    }
  }
}

// ─── 2. "use server" non-function exports ──────────────────────────────

function checkUseServerFiles() {
  for (const dir of ["app/(server)/actions", "server/actions"]) {
    const fullPath = join(ROOT, dir);
    if (!existsSync(fullPath)) continue;

    for (const file of readdirSync(fullPath)) {
      if (!file.endsWith(".ts")) continue;
      const content = readFileSync(join(fullPath, file), "utf-8");
      if (!content.includes('"use server"')) continue;

      for (const line of content.split("\n")) {
        const t = line.trim();
        if (/^export\s+(const|let|var)\s/.test(t) && !t.includes("=>")) {
          const m = t.match(/^export\s+(const|let|var)\s+(\w+)/);
          if (m) {
            warnings.push(
              `${dir}/${file}: exported const '${m[2]}' in a "use server" file` +
              ` — will crash at runtime. Move to a shared lib.`
            );
          }
        }
      }
    }
  }
}

// ─── 3. Plain <img> tags ──────────────────────────────────────────────

function checkImgTags() {
  walk(join(ROOT, "app"), (filePath) => {
    if (!filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) return;
    const content = readFile(filePath);
    if (!content) return;

    const matches = content.match(/<img[\s>][^>]*\/?>/g) || [];
    if (matches.length === 0) return;

    const hasReal = matches.some(m => {
      const idx = content.indexOf(m);
      const before = content.slice(Math.max(0, idx - 80), idx);
      return !before.includes("// eslint-disable-next-line");
    });

    if (hasReal) {
      warnings.push(`${filePath}: uses plain <img> — should use next/image with fill + sized container`);
    }
  });
}

// ─── 4. console.log in production ─────────────────────────────────────

function checkConsoleLog() {
  walk(join(ROOT, "app"), (filePath) => {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
    const content = readFile(filePath);
    if (!content) return;

    content.split("\n").forEach((line, i) => {
      if (/console\.log\(/.test(line) && !line.trim().startsWith("//")) {
        warnings.push(`${filePath}:${i + 1}: console.log() in production code`);
      }
    });
  });
}

// ─── 5. Dead barrel exports ──────────────────────────────────────────

function checkStaleBarrelExports() {
  // Collect all barrel files
  const barrelFiles = [];
  walk(join(ROOT, "app"), (filePath) => {
    if (filePath.endsWith("index.ts") || filePath.endsWith("index.tsx")) {
      barrelFiles.push(filePath);
    }
  });

  // Pre-collect all import statements for fast lookup
  const allImports = new Map(); // name → Set<filePath>
  walk(join(ROOT, "app"), (filePath) => {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
    const content = readFile(filePath);
    if (!content) return;

    // Find all imports: import { X, Y } from "..."
    const importBlocks = content.match(/import\s*\{[^}]+\}\s*from\s*['"][^'"]+['"]/g) || [];
    for (const block of importBlocks) {
      const names = block.replace(/import\s*\{/, "").replace(/\}\s*from\s*['"][^'"]+['"]/, "");
      names.split(",").forEach(p => {
        const name = p.trim().split(/\s+as\s+/)[0].trim();
        if (name) {
          if (!allImports.has(name)) allImports.set(name, new Set());
          allImports.get(name).add(filePath);
        }
      });
    }
  });

  for (const barrelPath of barrelFiles) {
    const content = readFile(barrelPath);
    if (!content) continue;

    const exportBlocks = content.match(/export\s*\{[^}]+\}\s*;?/g) || [];
    if (exportBlocks.length === 0) continue;

    const names = new Set();
    for (const block of exportBlocks) {
      const inner = block.replace(/export\s*\{/, "").replace(/\}\s*;?\s*$/, "");
      inner.split(",").forEach(p => {
        const name = p.trim().split(/\s+as\s+/)[0].trim();
        if (name && !name.startsWith(".")) names.add(name);
      });
    }

    for (const name of names) {
      if (name === "default") continue;
      // Check if name is imported by any file other than the barrel itself
      const consumers = allImports.get(name);
      const hasConsumer = consumers && [...consumers].some(f => f !== barrelPath);
      if (!hasConsumer) {
        warnings.push(`${barrelPath}: export '${name}' is never imported — dead barrel export`);
      }
    }
  }
}

// ─── 6. Missing "use client" in _components/ using React hooks ────────

function checkMissingUseClient() {
  // Find all _components/ directories
  const componentDirs = [];
  walk(join(ROOT, "app"), (filePath) => {
    if (filePath.endsWith("/_components") && statSync(filePath).isDirectory()) {
      componentDirs.push(filePath);
    }
  });

  const hookPattern = new RegExp(
    `\\b(${CLIENT_HOOKS.join("|")})\\s*\\(`,
    "g"
  );

  for (const dir of componentDirs) {
    try {
      for (const entry of readdirSync(dir)) {
        if (!entry.endsWith(".tsx") && !entry.endsWith(".jsx")) continue;
        const filePath = join(dir, entry);
        const content = readFileSync(filePath, "utf-8");

        // Check for "use client" directive
        if (content.includes('"use client"') || content.includes("'use client'")) continue;

        // Check for React hook usage (not in comments or strings)
        let match;
        while ((match = hookPattern.exec(content)) !== null) {
          // Check context: is this before a JSX return or in a React function?
          // Simple heuristic: find the nearest "export default function" or "export function" before the match
          const beforeMatch = content.slice(0, match.index);
          // If the hook is used in a place that looks like a React component, flag it
          if (
            /export\s+(default\s+)?function\s+\w/.test(beforeMatch) ||
            /const\s+\w+\s*=\s*\(/.test(beforeMatch)
          ) {
            const rel = relative(ROOT, filePath);
            warnings.push(`${rel}: uses '${match[1]}' but is missing "use client" directive`);
            break; // one warning per file
          }
        }
      }
    } catch { /* skip unreadable */ }
  }
}

// ─── 7. Missing generateMetadata in page.tsx ─────────────────────────

function checkMissingMetadata() {
  walk(join(ROOT, "app"), (filePath) => {
    if (!filePath.endsWith("/page.tsx") && !filePath.endsWith("/page.ts")) return;

    // Skip non-data pages
    const filename = basename(filePath);
    if (filename === "loading.tsx" || filename === "error.tsx" ||
        filename === "not-found.tsx" || filename === "layout.tsx") return;

    const content = readFile(filePath);
    if (!content) return;

    // Check for generateMetadata function or static metadata export
    const hasGenerateMetadata = /\bgenerateMetadata\b/.test(content);
    const hasStaticMetadata = /\bexport\s+(const\s+metadata\b|let\s+metadata\b)/.test(content);

    if (!hasGenerateMetadata && !hasStaticMetadata) {
      warnings.push(`${filePath}: missing generateMetadata() — no SEO metadata for this page`);
    }
  });
}

// ─── 8. Cross-route-group imports (boundary violations) ──────────────

function checkImportBoundaries() {
  walk(join(ROOT, "app"), (filePath) => {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;

    const content = readFile(filePath);
    if (!content) return;

    // Determine which route group this file belongs to
    const isInAdmin = filePath.includes("(dashboard)/admin/");
    const isInWeb = filePath.includes("(web)/");
    const isInServer = filePath.includes("(server)/");
    const isInAuth = filePath.includes("(auth)");

    // Extract all import paths
    const imports = content.match(/from\s+['"][^'"]+['"]/g) || [];
    for (const imp of imports) {
      const path = imp.replace(/from\s+['"]/, "").replace(/['"]$/, "");

      // Resolve relative imports
      let resolved = "";
      if (path.startsWith("@/")) {
        resolved = path.slice(2);
      } else if (path.startsWith(".")) {
        const dir = dirname(filePath);
        resolved = resolve(dir, path);
        // Make relative to ROOT for pattern matching
        resolved = relative(ROOT, resolved);
      } else {
        continue; // npm package, skip
      }

      // Admin importing from web route group
      if (isInAdmin && resolved.includes("(web)/")) {
        warnings.push(
          `${filePath}: imports from web route group (${path}) — ` +
          `admin should not depend on public page code`
        );
      }

      // Web importing from admin route group
      if (isInWeb && resolved.includes("(dashboard)/admin/")) {
        warnings.push(
          `${filePath}: imports from admin route group (${path}) — ` +
          `public pages should not depend on admin code`
        );
      }

      // Server actions importing from UI components
      if (isInServer && resolved.includes("_components/")) {
        warnings.push(
          `${filePath}: server code imports from _components/ (${path}) — ` +
          `server actions should not depend on UI components`
        );
      }
    }
  });
}

// ─── 9. Circular imports (madge if available) ────────────────────────

function checkCircularImports() {
  try {
    // Check if madge is available
    const result = execSync("npx --yes madge --help 2>&1 || true", {
      cwd: ROOT,
      timeout: 15000,
      encoding: "utf-8",
    });

    if (result.includes("Usage") || result.includes("Options")) {
      info("Checking circular imports via madge...");
      const madgeResult = execSync(
        `npx madge --circular --extensions ts,tsx app/ scripts/ server/ --warning 2>&1 || true`,
        { cwd: ROOT, timeout: 30000, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
      );

      const lines = madgeResult.trim().split("\n").filter(Boolean);
      const circulars = lines.filter(l => l.includes("→") || l.startsWith("└"));

      if (circulars.length > 0) {
        for (const line of circulars) {
          warnings.push(`Circular import: ${line}`);
        }
      } else {
        info("No circular imports detected.");
      }
    } else {
      info("madge not available — skipping circular import check.");
      info("Install with: npm install --save-dev madge");
    }
  } catch (e) {
    info(`madge skipped (${e.message?.split("\n")[0] || "not available"}).`);
    info("Install with: npm install --save-dev madge");
  }
}

// ─── 10. Admin UI importing from API routes ─────────────────────────

function checkApiRouteLeaks() {
  walk(join(ROOT, "app/(dashboard)/admin"), (filePath) => {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;

    const content = readFile(filePath);
    if (!content) return;

    // Check 1: Direct imports from API route files
    const imports = content.match(/from\s+['"][^'"]+['"]/g) || [];
    for (const imp of imports) {
      const path = imp.replace(/from\s+['"]/, "").replace(/['"]$/, "");
      const resolved = path.startsWith("@/") ? path.slice(2) : path;
      if (resolved.includes("/(server)/api/") || resolved.includes("(server)/api/")) {
        warnings.push(
          `${filePath}: imports from API route (${path}) — ` +
          `admin UI should use server actions, not API routes`
        );
      }
    }

    // Check 2: fetch() calls to /api/ paths
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fetchMatch = line.match(/fetch\s*\(\s*['"`](\/api\/[^'"`]+)/);
      if (fetchMatch && !line.trim().startsWith("//")) {
        warnings.push(
          `${filePath}:${i + 1}: fetch() to API route '${fetchMatch[1]}' — ` +
          `admin UI should use server actions instead`
        );
      }
    }
  });
}

// ─── 11. File naming conventions ─────────────────────────────────────

function checkFileNaming() {
  walk(join(ROOT, "app"), (filePath) => {
    if (!statSync(filePath).isDirectory()) return;

    const name = basename(filePath);

    // Skip route group params like [id], [slug], [...catchAll]
    if (name.startsWith("[") && name.endsWith("]")) return;
    // Skip private folders (_components, _metadata, _schemas, etc.)
    if (name.startsWith("_")) return;
    // Skip route groups like (web), (dashboard), (server), (auth)
    if (name.startsWith("(") && name.endsWith(")")) return;

    // Check for PascalCase directory names — should be kebab-case
    if (/^[A-Z]/.test(name) && name.length > 1 && !name.includes("-")) {
      warnings.push(
        `${filePath}: directory '${name}' uses PascalCase — should be kebab-case (e.g., '${name.toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}')`
      );
    }

    // Check for camelCase directory names
    if (/[a-z][A-Z]/.test(name)) {
      const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      warnings.push(
        `${filePath}: directory '${name}' uses camelCase — should be kebab-case ('${kebab}')`
      );
    }

    // Check for uppercase in file names (excluding route params and special Next.js files)
    const entries = readdirSync(filePath).filter(e => e.endsWith(".ts") || e.endsWith(".tsx"));
    for (const entry of entries) {
      if (entry === "page.tsx" || entry === "layout.tsx" || entry === "loading.tsx" ||
          entry === "error.tsx" || entry === "not-found.tsx" || entry === "template.tsx") continue;
      if (entry.startsWith("_")) continue; // private file

      // Check for PascalCase component files — should NOT be in route directories
      if (/^[A-Z]/.test(entry) && !filePath.includes("_components")) {
        warnings.push(
          `${join(filePath, entry)}: PascalCase component file outside _components/` +
          ` — component files should live in _components/`
        );
      }
    }
  });
}

// ─── Main ─────────────────────────────────────────────────────────────

console.log("🔍 Next.js Architecture Audit\n");

checkDuplicates();
checkUseServerFiles();
checkImgTags();
checkConsoleLog();
checkStaleBarrelExports();
checkMissingUseClient();
checkMissingMetadata();
checkImportBoundaries();
checkCircularImports();
checkApiRouteLeaks();
checkFileNaming();

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ No architecture issues found.");
  process.exit(0);
}

if (errors.length > 0) {
  console.log("❌ Errors:\n");
  for (const e of errors) console.log(`   ${e}`);
  console.log();
}

if (warnings.length > 0) {
  console.log(`⚠️  Warnings (${warnings.length}):\n`);
  for (const w of warnings) console.log(`   ${w}`);
  console.log();
}

const exitCode = errors.length > 0 ? 2 : 0;
const label = errors.length > 0 ? "FAILED" : warnings.length > 0 ? "PASSED (with warnings)" : "PASSED";
console.log(`📋 Result: ${label} (${errors.length} errors, ${warnings.length} warnings)\n`);
process.exit(exitCode);
