#!/usr/bin/env tsx
/**
 * Crypto MCP Server Integration Script
 * Clones, refactors, and rebrands top crypto MCP servers for integration
 * 
 * Author: nirholas (nich) - x.com/nichxbt - github.com/nirholas
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

const AUTHOR = {
  name: 'nirholas',
  displayName: 'nich',
  twitter: 'x.com/nichxbt',
  github: 'github.com/nirholas',
  githubUrl: 'https://github.com/nirholas',
  email: 'nich@nichxbt.com'
}

const TARGET_DIR = path.join(process.cwd(), 'packages/integrations/external-mcp')

interface MCPServer {
  rank: number
  name: string
  repo: string
  description: string
  license: string
  features: string[]
}

async function loadServers(): Promise<MCPServer[]> {
  const serversFile = path.join(process.cwd(), 'scripts/top-crypto-mcp-servers.json')
  const data = JSON.parse(fs.readFileSync(serversFile, 'utf-8'))
  return data.servers
}

function execCommand(cmd: string, cwd?: string): string {
  try {
    return execSync(cmd, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf-8'
    })
  } catch (error: any) {
    console.error(chalk.red(`Command failed: ${cmd}`))
    console.error(error.message)
    return ''
  }
}

function checkIfRepoExists(repoUrl: string): boolean {
  try {
    execCommand(`git ls-remote ${repoUrl}`)
    return true
  } catch {
    return false
  }
}

function cloneRepository(repo: string, targetPath: string): boolean {
  const repoUrl = `https://github.com/${repo}.git`
  
  console.log(chalk.blue(`  Checking ${repo}...`))
  
  if (!checkIfRepoExists(repoUrl)) {
    console.log(chalk.yellow(`  ⚠️  Repository not found: ${repo}`))
    return false
  }

  console.log(chalk.blue(`  Cloning ${repo}...`))
  execCommand(`git clone --depth 1 ${repoUrl} ${targetPath}`)
  
  // Remove .git directory to make it our own
  if (fs.existsSync(path.join(targetPath, '.git'))) {
    fs.rmSync(path.join(targetPath, '.git'), { recursive: true })
  }
  
  return true
}

function rebrandFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Replace common author patterns
  const replacements = [
    // Email addresses
    [/@[\w\.-]+@[\w\.-]+\.\w+/g, AUTHOR.email],
    // GitHub URLs
    [/https?:\/\/github\.com\/[\w-]+(?!\/universal-crypto-mcp)/g, AUTHOR.githubUrl],
    // Twitter/X handles
    [/twitter\.com\/\w+/g, AUTHOR.twitter],
    [/x\.com\/\w+/g, AUTHOR.twitter],
    // Copyright notices
    [/Copyright \(c\) \d{4}[- ]\d{4}? [\w\s]+/gi, `Copyright (c) ${new Date().getFullYear()} ${AUTHOR.displayName}`],
    [/Copyright \(c\) \d{4} [\w\s]+/gi, `Copyright (c) ${new Date().getFullYear()} ${AUTHOR.displayName}`],
    // Author fields
    [/"author":\s*"[^"]+"/g, `"author": "${AUTHOR.displayName} <${AUTHOR.email}>"`],
    [/'author':\s*'[^']+'/g, `'author': '${AUTHOR.displayName} <${AUTHOR.email}>'`],
  ]
  
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern as RegExp, replacement as string)
  }
  
  fs.writeFileSync(filePath, content, 'utf-8')
}

function rebrandPackageJson(packageJsonPath: string, serverName: string): void {
  if (!fs.existsSync(packageJsonPath)) return
  
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  
  // Update package details
  pkg.name = `@nirholas/${serverName}`
  pkg.author = `${AUTHOR.displayName} <${AUTHOR.email}>`
  pkg.repository = {
    type: 'git',
    url: `${AUTHOR.githubUrl}/universal-crypto-mcp.git`,
    directory: `packages/integrations/external-mcp/${serverName}`
  }
  pkg.homepage = `${AUTHOR.githubUrl}/universal-crypto-mcp`
  
  // Add our keywords
  if (!pkg.keywords) pkg.keywords = []
  pkg.keywords.push('nirholas', 'universal-crypto-mcp', 'crypto-mcp')
  pkg.keywords = [...new Set(pkg.keywords)]
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
}

function addAttribution(targetPath: string, server: MCPServer): void {
  const attributionContent = `# Attribution

This MCP server was originally from: ${server.repo}
Original License: ${server.license}

## Integration and Modifications

Integrated into Universal Crypto MCP by:
- **Author**: ${AUTHOR.displayName} (${AUTHOR.name})
- **Twitter/X**: ${AUTHOR.twitter}
- **GitHub**: ${AUTHOR.github}
- **Repository**: ${AUTHOR.githubUrl}/universal-crypto-mcp

## Original License

Please see LICENSE file for the original ${server.license} license terms.

## Modifications

- Rebranded for Universal Crypto MCP
- Integrated with unified tooling
- Added TypeScript types and documentation
- Restructured for monorepo architecture

---

*Maintained as part of the Universal Crypto MCP project*
*For issues and contributions, visit: ${AUTHOR.githubUrl}/universal-crypto-mcp*
`
  
  fs.writeFileSync(path.join(targetPath, 'ATTRIBUTION.md'), attributionContent)
}

function restructureForMonorepo(targetPath: string, serverName: string): void {
  // Create standard directory structure
  const dirs = ['src', 'dist', 'test', 'docs']
  dirs.forEach(dir => {
    const dirPath = path.join(targetPath, dir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  })
  
  // Create tsconfig.json if it doesn't exist
  const tsconfigPath = path.join(targetPath, 'tsconfig.json')
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfig = {
      extends: '../../../tsconfig.json',
      compilerOptions: {
        outDir: './dist',
        rootDir: './src',
        declaration: true,
        declarationMap: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'test']
    }
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n')
  }
  
  // Create README.md with our branding
  const readmePath = path.join(targetPath, 'README.md')
  let readmeContent = fs.existsSync(readmePath) 
    ? fs.readFileSync(readmePath, 'utf-8')
    : `# ${serverName}\n\nCrypto MCP Server`
  
  // Add header
  const header = `> **Part of [Universal Crypto MCP](${AUTHOR.githubUrl}/universal-crypto-mcp)**  
> By [${AUTHOR.displayName}](${AUTHOR.twitter})  
> See [ATTRIBUTION.md](./ATTRIBUTION.md) for original source

---

`
  
  if (!readmeContent.includes('Universal Crypto MCP')) {
    readmeContent = header + readmeContent
  }
  
  fs.writeFileSync(readmePath, readmeContent)
}

async function integrateServer(server: MCPServer): Promise<boolean> {
  console.log(chalk.cyan(`\n${'='.repeat(60)}`))
  console.log(chalk.cyan(`📦 Integrating: ${server.name} (Rank ${server.rank})`))
  console.log(chalk.cyan(`${'='.repeat(60)}`))
  
  const serverPath = path.join(TARGET_DIR, server.name)
  
  // Skip if already exists
  if (fs.existsSync(serverPath)) {
    console.log(chalk.yellow(`  ⚠️  Already exists, skipping...`))
    return false
  }
  
  // Clone repository
  if (!cloneRepository(server.repo, serverPath)) {
    return false
  }
  
  console.log(chalk.blue(`  Rebranding files...`))
  
  // Rebrand common files
  const filesToRebrand = [
    'package.json',
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'tsconfig.json'
  ]
  
  filesToRebrand.forEach(file => {
    const filePath = path.join(serverPath, file)
    if (fs.existsSync(filePath)) {
      rebrandFile(filePath)
    }
  })
  
  // Update package.json specifically
  const packageJsonPath = path.join(serverPath, 'package.json')
  rebrandPackageJson(packageJsonPath, server.name)
  
  // Add attribution
  addAttribution(serverPath, server)
  
  // Restructure for monorepo
  restructureForMonorepo(serverPath, server.name)
  
  console.log(chalk.green(`  ✅ Successfully integrated!`))
  
  return true
}

async function main() {
  console.log(chalk.bold.cyan(`
╔════════════════════════════════════════════════════════════╗
║   Universal Crypto MCP - External Server Integration      ║
║   Author: ${AUTHOR.displayName} (@${AUTHOR.name})                           ║
║   ${AUTHOR.twitter}                              ║
╚════════════════════════════════════════════════════════════╝
`))
  
  // Create target directory
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true })
    console.log(chalk.green(`Created directory: ${TARGET_DIR}`))
  }
  
  // Load servers list
  const servers = await loadServers()
  console.log(chalk.blue(`\nFound ${servers.length} servers to integrate\n`))
  
  // Integrate each server
  let successCount = 0
  let skipCount = 0
  let failCount = 0
  
  for (const server of servers) {
    const result = await integrateServer(server)
    if (result) {
      successCount++
    } else {
      if (fs.existsSync(path.join(TARGET_DIR, server.name))) {
        skipCount++
      } else {
        failCount++
      }
    }
  }
  
  // Summary
  console.log(chalk.cyan(`\n${'='.repeat(60)}`))
  console.log(chalk.bold.cyan('📊 Integration Summary'))
  console.log(chalk.cyan(`${'='.repeat(60)}`))
  console.log(chalk.green(`✅ Successfully integrated: ${successCount}`))
  console.log(chalk.yellow(`⚠️  Skipped (already exists): ${skipCount}`))
  console.log(chalk.red(`❌ Failed: ${failCount}`))
  console.log(chalk.cyan(`${'='.repeat(60)}\n`))
  
  console.log(chalk.bold.green(`🎉 Integration complete!`))
  console.log(chalk.blue(`\nNext steps:`))
  console.log(chalk.white(`  1. Review the integrated servers in: ${TARGET_DIR}`))
  console.log(chalk.white(`  2. Run: pnpm install`))
  console.log(chalk.white(`  3. Test each integration`))
  console.log(chalk.white(`  4. Commit changes\n`))
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error)
  process.exit(1)
})
