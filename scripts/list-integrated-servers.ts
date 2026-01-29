#!/usr/bin/env tsx
/**
 * List Integrated MCP Servers
 * Shows what external MCP servers have been integrated
 * 
 * Author: nirholas (nich) - x.com/nichxbt - github.com/nirholas
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

const TARGET_DIR = path.join(process.cwd(), 'packages/integrations/external-mcp')

interface IntegratedServer {
  name: string
  path: string
  hasPackageJson: boolean
  hasAttribution: boolean
  packageName?: string
  description?: string
  version?: string
}

function listIntegratedServers(): IntegratedServer[] {
  if (!fs.existsSync(TARGET_DIR)) {
    return []
  }

  const entries = fs.readdirSync(TARGET_DIR, { withFileTypes: true })
  const servers: IntegratedServer[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      const serverPath = path.join(TARGET_DIR, entry.name)
      const packageJsonPath = path.join(serverPath, 'package.json')
      const attributionPath = path.join(serverPath, 'ATTRIBUTION.md')

      const server: IntegratedServer = {
        name: entry.name,
        path: serverPath,
        hasPackageJson: fs.existsSync(packageJsonPath),
        hasAttribution: fs.existsSync(attributionPath),
      }

      if (server.hasPackageJson) {
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          server.packageName = pkg.name
          server.description = pkg.description
          server.version = pkg.version
        } catch (error) {
          // Ignore parse errors
        }
      }

      servers.push(server)
    }
  }

  return servers
}

function main() {
  console.log(chalk.bold.cyan(`
╔════════════════════════════════════════════════════════════╗
║   Integrated MCP Servers - Status Report                  ║
║   Author: nich (@nirholas) - x.com/nichxbt                ║
╚════════════════════════════════════════════════════════════╝
`))

  const servers = listIntegratedServers()

  if (servers.length === 0) {
    console.log(chalk.yellow('No integrated servers found.\n'))
    console.log(chalk.blue('Run: pnpm run integrate:mcp-servers\n'))
    return
  }

  console.log(chalk.bold(`Found ${servers.length} integrated server(s):\n`))

  servers.forEach((server, index) => {
    const num = chalk.gray(`${index + 1}.`)
    const name = chalk.bold.cyan(server.name)
    const status = server.hasPackageJson && server.hasAttribution
      ? chalk.green('✓')
      : chalk.yellow('⚠')

    console.log(`${num} ${status} ${name}`)
    
    if (server.packageName) {
      console.log(chalk.gray(`   Package: ${server.packageName}`))
    }
    
    if (server.description) {
      console.log(chalk.gray(`   Description: ${server.description.substring(0, 80)}...`))
    }
    
    if (server.version) {
      console.log(chalk.gray(`   Version: ${server.version}`))
    }

    if (!server.hasPackageJson) {
      console.log(chalk.yellow(`   ⚠  Missing package.json`))
    }
    
    if (!server.hasAttribution) {
      console.log(chalk.yellow(`   ⚠  Missing ATTRIBUTION.md`))
    }

    console.log()
  })

  // Statistics
  const withPackageJson = servers.filter(s => s.hasPackageJson).length
  const withAttribution = servers.filter(s => s.hasAttribution).length
  const fullyIntegrated = servers.filter(s => s.hasPackageJson && s.hasAttribution).length

  console.log(chalk.cyan('─'.repeat(60)))
  console.log(chalk.bold('Statistics:'))
  console.log(chalk.white(`  Total servers: ${servers.length}`))
  console.log(chalk.green(`  Fully integrated: ${fullyIntegrated}`))
  console.log(chalk.gray(`  With package.json: ${withPackageJson}`))
  console.log(chalk.gray(`  With attribution: ${withAttribution}`))
  console.log(chalk.cyan('─'.repeat(60)))
  console.log()

  if (fullyIntegrated < servers.length) {
    console.log(chalk.yellow('⚠  Some servers are not fully integrated'))
    console.log(chalk.blue('   Run: pnpm run integrate:mcp-servers\n'))
  } else {
    console.log(chalk.green('✓ All servers are fully integrated!\n'))
  }
}

main()
