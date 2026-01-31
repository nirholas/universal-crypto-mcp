/**
 * Code Generator - Generate code snippets from tool executions
 * @module lib/playground/code-generator
 */

import { McpTool, CodeLanguage, GeneratedCode, ExecutionResult } from './types';

/**
 * Generate code for a tool execution in multiple languages
 */
export function generateCode(
  tool: McpTool,
  parameters: Record<string, unknown>,
  language: CodeLanguage
): GeneratedCode {
  switch (language) {
    case 'typescript':
      return generateTypeScript(tool, parameters);
    case 'javascript':
      return generateJavaScript(tool, parameters);
    case 'python':
      return generatePython(tool, parameters);
    case 'rust':
      return generateRust(tool, parameters);
    case 'go':
      return generateGo(tool, parameters);
    case 'curl':
      return generateCurl(tool, parameters);
    default:
      return generateTypeScript(tool, parameters);
  }
}

/**
 * Generate TypeScript code
 */
function generateTypeScript(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const paramString = JSON.stringify(parameters, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n');

  const code = `import { UniversalCryptoMCP } from '@universal-crypto-mcp/sdk';

// Initialize the MCP client
const mcp = new UniversalCryptoMCP({
  apiKey: process.env.MCP_API_KEY,
});

// Execute the ${tool.name} tool
async function main() {
  try {
    const result = await mcp.tools.${tool.id.replace(/-/g, '_')}(${paramString});
    
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main();
`;

  return {
    language: 'typescript',
    code,
    sdkVersion: '1.0.0',
    dependencies: ['@universal-crypto-mcp/sdk'],
  };
}

/**
 * Generate JavaScript code
 */
function generateJavaScript(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const paramString = JSON.stringify(parameters, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n');

  const code = `const { UniversalCryptoMCP } = require('@universal-crypto-mcp/sdk');

// Initialize the MCP client
const mcp = new UniversalCryptoMCP({
  apiKey: process.env.MCP_API_KEY,
});

// Execute the ${tool.name} tool
async function main() {
  try {
    const result = await mcp.tools.${tool.id.replace(/-/g, '_')}(${paramString});
    
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main();
`;

  return {
    language: 'javascript',
    code,
    sdkVersion: '1.0.0',
    dependencies: ['@universal-crypto-mcp/sdk'],
  };
}

/**
 * Generate Python code
 */
function generatePython(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const paramLines = Object.entries(parameters)
    .map(([key, value]) => `    ${key}=${JSON.stringify(value)},`)
    .join('\n');

  const code = `from universal_crypto_mcp import UniversalCryptoMCP
import os

# Initialize the MCP client
mcp = UniversalCryptoMCP(
    api_key=os.environ.get("MCP_API_KEY")
)

# Execute the ${tool.name} tool
def main():
    try:
        result = mcp.tools.${tool.id.replace(/-/g, '_')}(
${paramLines}
        )
        
        print("Result:", result)
        return result
    except Exception as error:
        print("Error:", error)
        raise

if __name__ == "__main__":
    main()
`;

  return {
    language: 'python',
    code,
    sdkVersion: '1.0.0',
    dependencies: ['universal-crypto-mcp'],
  };
}

/**
 * Generate Rust code
 */
function generateRust(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const paramLines = Object.entries(parameters)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `    .${key}("${value}")`;
      }
      return `    .${key}(${JSON.stringify(value)})`;
    })
    .join('\n');

  const code = `use universal_crypto_mcp::UniversalCryptoMCP;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the MCP client
    let mcp = UniversalCryptoMCP::new(
        env::var("MCP_API_KEY")?
    );
    
    // Execute the ${tool.name} tool
    let result = mcp
        .tools()
        .${tool.id.replace(/-/g, '_')}()
${paramLines}
        .execute()
        .await?;
    
    println!("Result: {:?}", result);
    
    Ok(())
}
`;

  return {
    language: 'rust',
    code,
    sdkVersion: '1.0.0',
    dependencies: ['universal-crypto-mcp', 'tokio'],
  };
}

/**
 * Generate Go code
 */
function generateGo(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const paramLines = Object.entries(parameters)
    .map(([key, value]) => {
      const capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
      if (typeof value === 'string') {
        return `\t\t${capitalKey}: "${value}",`;
      }
      return `\t\t${capitalKey}: ${JSON.stringify(value)},`;
    })
    .join('\n');

  const code = `package main

import (
    "fmt"
    "log"
    "os"
    
    mcp "github.com/universal-crypto-mcp/go-sdk"
)

func main() {
    // Initialize the MCP client
    client, err := mcp.NewClient(os.Getenv("MCP_API_KEY"))
    if err != nil {
        log.Fatal(err)
    }
    
    // Execute the ${tool.name} tool
    result, err := client.Tools.${tool.id.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}(&mcp.${tool.id.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Params{
${paramLines}
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Result: %+v\\n", result)
}
`;

  return {
    language: 'go',
    code,
    sdkVersion: '1.0.0',
    dependencies: ['github.com/universal-crypto-mcp/go-sdk'],
  };
}

/**
 * Generate cURL command
 */
function generateCurl(tool: McpTool, parameters: Record<string, unknown>): GeneratedCode {
  const jsonBody = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: tool.id,
      arguments: parameters,
    },
  }, null, 2);

  const code = `curl -X POST https://api.universal-crypto-mcp.com/v1/mcp \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $MCP_API_KEY" \\
  -d '${jsonBody.replace(/'/g, "\\'")}'
`;

  return {
    language: 'curl',
    code,
  };
}

/**
 * Generate code from an execution result
 */
export function generateCodeFromExecution(
  execution: ExecutionResult,
  tool: McpTool,
  language: CodeLanguage
): GeneratedCode {
  return generateCode(tool, execution.parameters, language);
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): { id: CodeLanguage; name: string; icon: string }[] {
  return [
    { id: 'typescript', name: 'TypeScript', icon: 'typescript' },
    { id: 'javascript', name: 'JavaScript', icon: 'javascript' },
    { id: 'python', name: 'Python', icon: 'python' },
    { id: 'rust', name: 'Rust', icon: 'rust' },
    { id: 'go', name: 'Go', icon: 'go' },
    { id: 'curl', name: 'cURL', icon: 'terminal' },
  ];
}

/**
 * Get file extension for a language
 */
export function getFileExtension(language: CodeLanguage): string {
  switch (language) {
    case 'typescript':
      return 'ts';
    case 'javascript':
      return 'js';
    case 'python':
      return 'py';
    case 'rust':
      return 'rs';
    case 'go':
      return 'go';
    case 'curl':
      return 'sh';
    default:
      return 'txt';
  }
}
