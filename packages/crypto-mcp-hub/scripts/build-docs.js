#!/usr/bin/env node
// Regenerate SERVERS.md and THIRD_PARTY_NOTICES.md from catalog/servers.json.
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { categoriesOf, loadCatalog } from "../src/catalog.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const catalog = loadCatalog(join(root, "catalog", "servers.json"))
const servers = catalog.servers
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")
const source = (s) =>
  s.source.type === "npm"
    ? `[npm](https://www.npmjs.com/package/${s.source.package}/v/${s.source.version})`
    : s.source.type === "pypi"
      ? `[PyPI](https://pypi.org/project/${s.source.package}/${s.source.version}/)`
      : `[git@${s.source.ref.slice(0, 7)}](https://github.com/${s.source.repo}/tree/${s.source.ref})`
const keys = (s) => {
  const req = s.env.filter((e) => e.required).map((e) => `\`${e.name}\``)
  const opt = s.env.filter((e) => !e.required).map((e) => `\`${e.name}\``)
  return [req.length ? `needs ${req.join(", ")}` : "keyless", opt.length ? `optional ${opt.join(", ")}` : ""].filter(Boolean).join("; ")
}

const toolTotal = servers.reduce((n, s) => n + s.tools.length, 0)
const keyless = servers.filter((s) => !s.env.some((e) => e.required)).length
const rows = servers.map(
  (s) =>
    `| \`${s.id}\` | [${cell(s.name)}](https://github.com/${s.repo}) | ${s.stars ?? ""} | ${cell(s.license)} | ${s.tools.length} | ${cell(s.categories.join(", "))} | ${source(s)} | ${keys(s)} |`,
)
writeFileSync(
  join(root, "SERVERS.md"),
  `# Servers in the catalog

Generated from [catalog/servers.json](catalog/servers.json) by \`npm run docs\`. Do not edit by hand.

${servers.length} servers, ${toolTotal} tools. ${keyless} run without any API key; the rest unlock when you set the keys listed. Every server here was launched in a network-only sandbox (no credentials, no host files), completed the MCP handshake and listed its tools on ${catalog.generated}.

Categories: ${categoriesOf(catalog).map(([c, n]) => `${c} (${n})`).join(", ")}.

| id | Project | Stars | License | Tools | Categories | Pinned source | Keys |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
${rows.join("\n")}
`,
)

const byLicense = new Map()
for (const s of servers) byLicense.set(s.license, [...(byLicense.get(s.license) ?? []), s])
writeFileSync(
  join(root, "THIRD_PARTY_NOTICES.md"),
  `# Third-party notices

crypto-mcp-hub does not bundle or redistribute any of the servers below. Each one is downloaded by the end user's machine at runtime from its own registry (npm, PyPI, or its GitHub repository at a pinned commit) and runs under its own license. The catalog stores each project's name, description, repository link and tool names/descriptions so the hub can route requests without starting every server.

Copyright in each project belongs to its authors. Licenses, as declared by each project:

${[...byLicense.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .map(([lic, list]) => `## ${lic} (${list.length})\n\n${list.map((s) => `- ${s.name}: https://github.com/${s.repo}`).join("\n")}`)
  .join("\n\n")}
`,
)
console.log(`SERVERS.md and THIRD_PARTY_NOTICES.md written for ${servers.length} servers`)
