#!/usr/bin/env node
/**
 * Generate Dashboard Components from MCP Tools
 * 
 * Scans all MCP tool definitions and generates corresponding
 * dashboard UI components with forms and displays.
 * 
 * Usage: node scripts/webapp/generate-tool-ui.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(__dirname, '../..');
const SRC_DIR = join(ROOT_DIR, 'src');
const WEBAPP_DIR = join(ROOT_DIR, 'website-unified');
const COMPONENTS_DIR = join(WEBAPP_DIR, 'components');
const TOOLS_OUTPUT_DIR = join(COMPONENTS_DIR, 'tools');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

// ============================================================
// Tool Discovery
// ============================================================

function findToolFiles(dir, maxDepth = 5) {
  const files = [];
  
  function walk(currentDir, depth) {
    if (depth > maxDepth || !existsSync(currentDir)) return;
    
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
          walk(fullPath, depth + 1);
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          // Look for tool definitions
          try {
            const content = readFileSync(fullPath, 'utf-8');
            if (content.includes('server.tool(') || content.includes('defineTool(') || content.includes('createTool(')) {
              files.push(fullPath);
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
  
  walk(dir, 0);
  return files;
}

function extractToolDefinitions(content) {
  const tools = [];
  
  // Match server.tool() calls
  const toolRegex = /server\.tool\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    tools.push({
      name: match[1],
      description: match[2],
    });
  }
  
  // Match tool definitions with zod schemas
  const zodToolRegex = /name:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]/g;
  while ((match = zodToolRegex.exec(content)) !== null) {
    tools.push({
      name: match[1],
      description: match[2],
    });
  }
  
  return tools;
}

// ============================================================
// Component Generation
// ============================================================

function generateToolCard(tool) {
  const componentName = tool.name
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') + 'Tool';
  
  return {
    name: componentName,
    content: `'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Play, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ${componentName}Props {
  className?: string;
}

export function ${componentName}({ className }: ${componentName}Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  async function handleExecute() {
    setLoading(true);
    try {
      const response = await fetch('/api/tools/${tool.name}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // TODO: Add form data
      });
      const data = await response.json();
      setResult(data);
      toast.success('Tool executed successfully');
    } catch (error) {
      toast.error('Failed to execute tool');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">${tool.name}</span>
        </CardTitle>
        <CardDescription>
          ${tool.description || 'Execute this MCP tool'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* TODO: Generate form fields from tool schema */}
        <div className="space-y-2">
          <Label>Input Parameters</Label>
          <Input placeholder="Enter parameters..." />
        </div>
        
        {result && (
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExecute} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Execute Tool
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
`,
  };
}

function generateToolsGrid(tools) {
  const imports = tools.map(t => {
    const name = t.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Tool';
    return `import { ${name} } from './${name}';`;
  }).join('\n');

  const exports = tools.map(t => {
    const name = t.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Tool';
    return `export { ${name} } from './${name}';`;
  }).join('\n');

  return {
    index: exports + '\n',
    grid: `'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

${imports}

const tools = ${JSON.stringify(tools.map(t => ({
  name: t.name,
  component: t.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Tool',
  category: t.name.split('-')[0] || 'general',
})), null, 2)};

export function ToolsGrid() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(tools.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map(tool => {
          const Component = {
            ${tools.map(t => {
              const name = t.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Tool';
              return `'${name}': ${name}`;
            }).join(',\n            ')}
          }[tool.component];
          return Component ? <Component key={tool.name} /> : null;
        })}
      </div>
    </div>
  );
}
`,
  };
}

// ============================================================
// File Writer
// ============================================================

function writeFile(filePath, content) {
  const relativePath = relative(ROOT_DIR, filePath);
  
  if (DRY_RUN) {
    console.log(`   [DRY] ${relativePath}`);
    return;
  }
  
  if (existsSync(filePath)) {
    console.log(`   ⏭️  ${relativePath} (exists)`);
    return;
  }
  
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  console.log(`   ✅ ${relativePath}`);
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('================================================');
  console.log('🔧 Tool UI Generator');
  console.log('================================================\n');

  if (DRY_RUN) console.log('🔍 DRY RUN MODE\n');

  // Find tool files
  console.log('📄 Scanning for tool definitions...');
  const toolFiles = findToolFiles(SRC_DIR);
  console.log(`   Found ${toolFiles.length} files with tool definitions\n`);

  // Extract tools
  const allTools = [];
  for (const file of toolFiles) {
    const content = readFileSync(file, 'utf-8');
    const tools = extractToolDefinitions(content);
    allTools.push(...tools);
  }

  // Deduplicate
  const uniqueTools = Array.from(
    new Map(allTools.map(t => [t.name, t])).values()
  );
  console.log(`📦 Found ${uniqueTools.length} unique tools\n`);

  // Generate components
  console.log('🧩 Generating tool components...\n');
  
  mkdirSync(TOOLS_OUTPUT_DIR, { recursive: true });

  for (const tool of uniqueTools) {
    const component = generateToolCard(tool);
    const filePath = join(TOOLS_OUTPUT_DIR, `${component.name}.tsx`);
    writeFile(filePath, component.content);
  }

  // Generate grid
  console.log('\n📊 Generating tools grid...\n');
  const grid = generateToolsGrid(uniqueTools);
  writeFile(join(TOOLS_OUTPUT_DIR, 'index.ts'), grid.index);
  writeFile(join(TOOLS_OUTPUT_DIR, 'ToolsGrid.tsx'), grid.grid);

  console.log('\n================================================');
  console.log(`✅ Generated ${uniqueTools.length} tool components`);
  console.log('================================================');
}

main().catch(console.error);
