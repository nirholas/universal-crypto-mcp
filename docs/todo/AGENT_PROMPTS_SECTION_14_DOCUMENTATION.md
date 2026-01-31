# AGENT 18: DOCUMENTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: API DOCUMENTATION SYSTEM

**Context:** Build comprehensive API documentation for all platform endpoints.

**Objective:** Create interactive API documentation with examples and testing.

**Requirements:**
1. **OpenAPI Specification** (`website-unified/docs/openapi.yaml`)
   ```yaml
   openapi: 3.1.0
   info:
     title: Universal Crypto MCP API
     version: 1.0.0
     description: |
       Complete API documentation for the Universal Crypto MCP platform.
       
       ## Authentication
       All authenticated endpoints require a valid API key or session token.
       
       ## Rate Limiting
       - Free tier: 100 requests/minute
       - Pro tier: 1000 requests/minute
       - Enterprise: Unlimited
   
   servers:
     - url: https://api.universalcrypto.dev/v1
       description: Production
     - url: https://api-staging.universalcrypto.dev/v1
       description: Staging
   
   components:
     securitySchemes:
       ApiKeyAuth:
         type: apiKey
         in: header
         name: X-API-Key
       BearerAuth:
         type: http
         scheme: bearer
   
     schemas:
       Service:
         type: object
         properties:
           id:
             type: string
           name:
             type: string
           description:
             type: string
           category:
             type: string
           pricing:
             $ref: '#/components/schemas/Pricing'
   
   paths:
     /marketplace/services:
       get:
         summary: List all services
         tags: [Marketplace]
         parameters:
           - name: category
             in: query
             schema:
               type: string
           - name: page
             in: query
             schema:
               type: integer
               default: 1
         responses:
           '200':
             description: List of services
             content:
               application/json:
                 schema:
                   type: object
                   properties:
                     services:
                       type: array
                       items:
                         $ref: '#/components/schemas/Service'
   ```

2. **API Documentation Site** (`website-unified/app/(docs)/api/page.tsx`)
   ```typescript
   import { RedocStandalone } from '@redoc/redoc-standalone';
   
   export default function APIDocsPage() {
     return (
       <div className="api-docs">
         <RedocStandalone
           specUrl="/api/openapi.json"
           options={{
             theme: {
               colors: { primary: { main: '#6366f1' } },
             },
             hideDownloadButton: false,
             requiredPropsFirst: true,
             sortPropsAlphabetically: true,
           }}
         />
       </div>
     );
   }
   ```

3. **API Reference Generator** (`website-unified/scripts/generateApiDocs.ts`)
   ```typescript
   import { generateOpenAPI } from '@/lib/docs/openapi';
   import { getApiRoutes } from '@/lib/docs/routeScanner';
   import { writeFileSync } from 'fs';
   
   async function generateApiDocs() {
     // Scan all API routes
     const routes = await getApiRoutes('app/api');
     
     // Generate OpenAPI spec
     const spec = generateOpenAPI(routes, {
       title: 'Universal Crypto MCP API',
       version: '1.0.0',
       servers: [
         { url: 'https://api.universalcrypto.dev/v1' },
       ],
     });
     
     // Write spec
     writeFileSync('public/openapi.json', JSON.stringify(spec, null, 2));
     
     // Generate TypeScript types
     const types = generateTypes(spec);
     writeFileSync('lib/api/types.generated.ts', types);
     
     console.log('API documentation generated successfully');
   }
   
   generateApiDocs();
   ```

4. **Try It Out Component** (`website-unified/components/docs/ApiPlayground.tsx`)
   ```typescript
   interface ApiPlaygroundProps {
     endpoint: string;
     method: 'GET' | 'POST' | 'PUT' | 'DELETE';
     parameters?: Parameter[];
     body?: object;
   }
   
   export function ApiPlayground({ endpoint, method, parameters, body }: ApiPlaygroundProps) {
     const [response, setResponse] = useState<unknown>(null);
     const [loading, setLoading] = useState(false);
     
     const executeRequest = async () => {
       setLoading(true);
       try {
         const res = await fetch(buildUrl(endpoint, parameters), {
           method,
           headers: { 'Content-Type': 'application/json' },
           body: body ? JSON.stringify(body) : undefined,
         });
         setResponse(await res.json());
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div className="api-playground">
         <ParameterEditor parameters={parameters} />
         <BodyEditor body={body} />
         <Button onClick={executeRequest} loading={loading}>
           Try It
         </Button>
         <ResponseViewer response={response} />
       </div>
     );
   }
   ```

**Technical Stack:**
- OpenAPI 3.1
- Redoc or Stoplight
- Auto-generation
- Interactive testing
- TypeScript types

**Deliverables:**
- OpenAPI specification
- API documentation site
- Route scanner/generator
- Interactive playground

---

## PROMPT 2: SDK DOCUMENTATION

**Context:** Create documentation for TypeScript and Python SDKs.

**Objective:** Build comprehensive SDK guides with examples and tutorials.

**Requirements:**
1. **TypeScript SDK Docs** (`website-unified/docs/content/sdk/typescript/`)
   ```mdx
   ---
   title: TypeScript SDK
   description: Official TypeScript SDK for Universal Crypto MCP
   ---
   
   # TypeScript SDK
   
   ## Installation
   
   ```bash
   npm install @ucm/sdk
   # or
   pnpm add @ucm/sdk
   ```
   
   ## Quick Start
   
   ```typescript
   import { UCMClient } from '@ucm/sdk';
   
   const client = new UCMClient({
     apiKey: process.env.UCM_API_KEY,
   });
   
   // Get service
   const service = await client.marketplace.getService('service-id');
   
   // Execute tool
   const result = await client.tools.execute('getBalance', {
     address: '0x...',
     chain: 'ethereum',
   });
   ```
   
   ## Authentication
   
   The SDK supports multiple authentication methods:
   
   ### API Key
   ```typescript
   const client = new UCMClient({
     apiKey: 'your-api-key',
   });
   ```
   
   ### Wallet Authentication
   ```typescript
   const client = new UCMClient({
     wallet: connectedWallet,
   });
   ```
   ```

2. **Python SDK Docs** (`website-unified/docs/content/sdk/python/`)
   ```mdx
   ---
   title: Python SDK
   description: Official Python SDK for Universal Crypto MCP
   ---
   
   # Python SDK
   
   ## Installation
   
   ```bash
   pip install ucm-sdk
   # or
   poetry add ucm-sdk
   ```
   
   ## Quick Start
   
   ```python
   from ucm import UCMClient
   
   client = UCMClient(api_key="your-api-key")
   
   # Get service
   service = client.marketplace.get_service("service-id")
   
   # Execute tool
   result = client.tools.execute(
       tool_id="getBalance",
       params={"address": "0x...", "chain": "ethereum"}
   )
   ```
   
   ## Async Support
   
   ```python
   import asyncio
   from ucm import AsyncUCMClient
   
   async def main():
       async with AsyncUCMClient(api_key="your-api-key") as client:
           result = await client.tools.execute("getBalance", {...})
   
   asyncio.run(main())
   ```
   ```

3. **Code Examples Library** (`website-unified/docs/content/examples/`)
   ```mdx
   ---
   title: Examples
   description: Code examples for common use cases
   ---
   
   # Examples
   
   ## Marketplace
   
   ### Subscribe to a Service
   
   <CodeTabs>
   <Tab label="TypeScript">
   ```typescript
   import { UCMClient } from '@ucm/sdk';
   
   const client = new UCMClient({ apiKey: 'your-key' });
   
   // Find service
   const services = await client.marketplace.search({
     category: 'trading',
     query: 'signals',
   });
   
   // Subscribe
   const subscription = await client.marketplace.subscribe({
     serviceId: services[0].id,
     tier: 'professional',
   });
   
   console.log(`Subscribed! API Key: ${subscription.apiKey}`);
   ```
   </Tab>
   <Tab label="Python">
   ```python
   from ucm import UCMClient
   
   client = UCMClient(api_key="your-key")
   
   # Find service
   services = client.marketplace.search(
       category="trading",
       query="signals"
   )
   
   # Subscribe
   subscription = client.marketplace.subscribe(
       service_id=services[0].id,
       tier="professional"
   )
   
   print(f"Subscribed! API Key: {subscription.api_key}")
   ```
   </Tab>
   </CodeTabs>
   ```

4. **Interactive Tutorials** (`website-unified/components/docs/Tutorial.tsx`)
   ```typescript
   interface TutorialProps {
     title: string;
     steps: TutorialStep[];
   }
   
   interface TutorialStep {
     title: string;
     description: string;
     code: string;
     language: string;
     expectedOutput?: string;
     interactive?: boolean;
   }
   
   export function Tutorial({ title, steps }: TutorialProps) {
     const [currentStep, setCurrentStep] = useState(0);
     const [completed, setCompleted] = useState<Set<number>>(new Set());
     
     return (
       <div className="tutorial">
         <h2>{title}</h2>
         <ProgressBar current={currentStep} total={steps.length} />
         
         <div className="step">
           <h3>{steps[currentStep].title}</h3>
           <p>{steps[currentStep].description}</p>
           
           <CodeEditor
             code={steps[currentStep].code}
             language={steps[currentStep].language}
             interactive={steps[currentStep].interactive}
             onRun={(output) => {
               if (output === steps[currentStep].expectedOutput) {
                 setCompleted(prev => new Set([...prev, currentStep]));
               }
             }}
           />
         </div>
         
         <Navigation
           onPrevious={() => setCurrentStep(s => s - 1)}
           onNext={() => setCurrentStep(s => s + 1)}
           canGoNext={completed.has(currentStep)}
         />
       </div>
     );
   }
   ```

**Technical Requirements:**
- Multi-language examples
- Interactive code editor
- Step-by-step tutorials
- Copy buttons
- Syntax highlighting

**Deliverables:**
- TypeScript SDK docs
- Python SDK docs
- Code examples library
- Interactive tutorials

---

## PROMPT 3: TOOL DOCUMENTATION

**Context:** Document all 380+ MCP tools with schemas, examples, and use cases.

**Objective:** Create searchable tool documentation with auto-generation.

**Requirements:**
1. **Tool Documentation Generator** (`website-unified/scripts/generateToolDocs.ts`)
   ```typescript
   import { getAllTools } from '@/packages/core';
   import { generateMDX } from '@/lib/docs/mdxGenerator';
   
   async function generateToolDocs() {
     const tools = await getAllTools();
     
     for (const tool of tools) {
       const mdx = generateMDX({
         title: tool.name,
         description: tool.description,
         category: tool.category,
         schema: tool.inputSchema,
         outputSchema: tool.outputSchema,
         examples: tool.examples,
       });
       
       const path = `docs/content/tools/${tool.category}/${tool.id}.mdx`;
       writeFileSync(path, mdx);
     }
     
     // Generate index
     generateToolIndex(tools);
   }
   ```

2. **Tool Documentation Template** (`website-unified/docs/templates/tool.mdx`)
   ```mdx
   ---
   title: {{name}}
   description: {{description}}
   category: {{category}}
   ---
   
   # {{name}}
   
   {{description}}
   
   ## Parameters
   
   <ParameterTable schema={{{inputSchema}}} />
   
   ## Returns
   
   <SchemaViewer schema={{{outputSchema}}} />
   
   ## Examples
   
   {{#each examples}}
   ### {{this.title}}
   
   {{this.description}}
   
   <CodeBlock language="typescript">
   {{{this.code}}}
   </CodeBlock>
   
   <OutputBlock>
   {{{this.output}}}
   </OutputBlock>
   {{/each}}
   
   ## Related Tools
   
   <RelatedTools category="{{category}}" exclude="{{id}}" />
   ```

3. **Tool Search Index** (`website-unified/lib/docs/toolSearch.ts`)
   ```typescript
   import Fuse from 'fuse.js';
   import { Tool } from '@/types';
   
   export function createToolSearchIndex(tools: Tool[]) {
     const fuse = new Fuse(tools, {
       keys: [
         { name: 'name', weight: 2 },
         { name: 'description', weight: 1 },
         { name: 'category', weight: 1.5 },
         { name: 'tags', weight: 1 },
       ],
       threshold: 0.3,
       includeScore: true,
       includeMatches: true,
     });
     
     return {
       search: (query: string) => fuse.search(query),
       searchByCategory: (category: string) =>
         tools.filter(t => t.category === category),
       getRelated: (toolId: string) => {
         const tool = tools.find(t => t.id === toolId);
         return tools.filter(t =>
           t.category === tool?.category && t.id !== toolId
         ).slice(0, 5);
       },
     };
   }
   ```

4. **Schema Viewer Component** (`website-unified/components/docs/SchemaViewer.tsx`)
   ```typescript
   interface SchemaViewerProps {
     schema: JSONSchema;
     title?: string;
     expandDepth?: number;
   }
   
   export function SchemaViewer({ schema, title, expandDepth = 2 }: SchemaViewerProps) {
     return (
       <div className="schema-viewer">
         {title && <h4>{title}</h4>}
         <PropertyList
           properties={schema.properties}
           required={schema.required}
           expandDepth={expandDepth}
         />
       </div>
     );
   }
   
   function PropertyList({ properties, required, depth = 0, expandDepth }) {
     return (
       <ul className="property-list">
         {Object.entries(properties).map(([name, prop]) => (
           <PropertyItem
             key={name}
             name={name}
             property={prop}
             isRequired={required?.includes(name)}
             depth={depth}
             expandDepth={expandDepth}
           />
         ))}
       </ul>
     );
   }
   ```

**Technical Requirements:**
- Auto-generation from schemas
- Full-text search
- Category organization
- Related tools
- Interactive examples

**Deliverables:**
- Tool doc generator
- MDX templates
- Search index
- Schema viewer

---

## PROMPT 4: INTEGRATION GUIDES

**Context:** Create step-by-step integration guides for common platforms.

**Objective:** Build comprehensive guides for integrating with popular frameworks.

**Requirements:**
1. **Integration Index** (`website-unified/docs/content/integrations/index.mdx`)
   ```mdx
   ---
   title: Integrations
   description: Integrate Universal Crypto MCP with your stack
   ---
   
   # Integrations
   
   Connect Universal Crypto MCP with your favorite tools and frameworks.
   
   <IntegrationGrid>
     <IntegrationCard
       title="LangChain"
       icon="langchain"
       href="/docs/integrations/langchain"
       description="Build AI agents with LangChain"
     />
     <IntegrationCard
       title="AutoGPT"
       icon="autogpt"
       href="/docs/integrations/autogpt"
       description="Autonomous agents with AutoGPT"
     />
     <IntegrationCard
       title="Claude"
       icon="claude"
       href="/docs/integrations/claude"
       description="Use with Claude Desktop"
     />
     <IntegrationCard
       title="Cursor"
       icon="cursor"
       href="/docs/integrations/cursor"
       description="Code with Cursor IDE"
     />
   </IntegrationGrid>
   ```

2. **LangChain Guide** (`website-unified/docs/content/integrations/langchain.mdx`)
   ```mdx
   ---
   title: LangChain Integration
   description: Build AI agents with Universal Crypto MCP and LangChain
   ---
   
   # LangChain Integration
   
   Integrate Universal Crypto MCP tools into your LangChain agents.
   
   ## Installation
   
   ```bash
   pip install langchain ucm-langchain
   ```
   
   ## Basic Setup
   
   ```python
   from langchain.agents import initialize_agent
   from ucm_langchain import UCMToolkit
   
   # Initialize toolkit
   toolkit = UCMToolkit(api_key="your-key")
   
   # Get tools
   tools = toolkit.get_tools()
   
   # Create agent
   agent = initialize_agent(
       tools=tools,
       llm=llm,
       agent="zero-shot-react-description",
   )
   
   # Run
   result = agent.run("What is the current price of ETH?")
   ```
   
   ## Available Tools
   
   The UCM toolkit provides these categories of tools:
   
   <ToolCategoryList toolkit="langchain" />
   
   ## Custom Tool Selection
   
   ```python
   # Select specific categories
   tools = toolkit.get_tools(
       categories=["market-data", "defi"],
       exclude=["trading"]  # Exclude trading tools
   )
   ```
   
   ## Error Handling
   
   ```python
   from ucm_langchain import UCMError
   
   try:
       result = agent.run("Swap 1 ETH for USDC")
   except UCMError as e:
       print(f"Tool error: {e.message}")
   ```
   ```

3. **Claude Desktop Guide** (`website-unified/docs/content/integrations/claude.mdx`)
   ```mdx
   ---
   title: Claude Desktop Integration
   description: Use Universal Crypto MCP with Claude Desktop
   ---
   
   # Claude Desktop Integration
   
   Connect Claude to blockchain tools via Universal Crypto MCP.
   
   ## Prerequisites
   
   - Claude Desktop installed
   - Node.js 18+
   - Universal Crypto MCP server
   
   ## Configuration
   
   Add to your Claude Desktop config:
   
   ```json
   {
     "mcpServers": {
       "universal-crypto": {
         "command": "npx",
         "args": ["-y", "@anthropic/ucm-server"],
         "env": {
           "ETHERSCAN_API_KEY": "your-key",
           "COINGECKO_API_KEY": "your-key"
         }
       }
     }
   }
   ```
   
   ## Usage Examples
   
   Once configured, you can ask Claude:
   
   - "What's the current price of Bitcoin?"
   - "Check my wallet balance at 0x..."
   - "Find the best swap rate for 1 ETH to USDC"
   
   <ExampleConversation
     messages={[
       { role: 'user', content: 'What is my wallet balance?' },
       { role: 'assistant', content: 'I\'ll check your wallet balance...' },
       { role: 'tool', name: 'getBalance', content: '...' },
       { role: 'assistant', content: 'Your wallet contains...' },
     ]}
   />
   ```

4. **Troubleshooting Guide** (`website-unified/docs/content/troubleshooting/index.mdx`)
   ```mdx
   ---
   title: Troubleshooting
   description: Common issues and solutions
   ---
   
   # Troubleshooting
   
   <Accordion title="Connection Issues">
   
   ### MCP Server Not Connecting
   
   1. Verify server is running:
      ```bash
      npx @anthropic/ucm-server --health
      ```
   
   2. Check configuration path
   3. Restart Claude Desktop
   
   </Accordion>
   
   <Accordion title="Authentication Errors">
   
   ### API Key Invalid
   
   - Verify key is correct
   - Check key hasn't expired
   - Ensure proper permissions
   
   </Accordion>
   
   <Accordion title="Rate Limiting">
   
   ### Too Many Requests
   
   Default limits:
   - Free: 100 req/min
   - Pro: 1000 req/min
   
   Upgrade your plan or implement backoff.
   
   </Accordion>
   ```

**Technical Requirements:**
- Step-by-step guides
- Copy-paste configs
- Example conversations
- Troubleshooting
- Video tutorials

**Deliverables:**
- Integration index
- Framework guides
- Configuration examples
- Troubleshooting docs

---

## PROMPT 5: DOCUMENTATION INFRASTRUCTURE

**Context:** Build documentation site infrastructure with search, versioning, and feedback.

**Objective:** Create production-ready documentation platform.

**Requirements:**
1. **Documentation Layout** (`website-unified/app/(docs)/layout.tsx`)
   ```typescript
   import { Sidebar } from '@/components/docs/Sidebar';
   import { TableOfContents } from '@/components/docs/TableOfContents';
   import { DocSearch } from '@/components/docs/DocSearch';
   
   export default function DocsLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="docs-layout">
         <Sidebar />
         <main className="docs-content">
           <DocSearch />
           <article>{children}</article>
           <DocFeedback />
         </main>
         <TableOfContents />
       </div>
     );
   }
   ```

2. **Documentation Search** (`website-unified/lib/docs/search.ts`)
   ```typescript
   import { createClient } from '@algolia/client-search';
   
   const client = createClient(
     process.env.ALGOLIA_APP_ID!,
     process.env.ALGOLIA_API_KEY!
   );
   
   export async function indexDocs() {
     const docs = await getAllDocs();
     
     const records = docs.map(doc => ({
       objectID: doc.slug,
       title: doc.title,
       description: doc.description,
       content: doc.content,
       category: doc.category,
       url: `/docs/${doc.slug}`,
     }));
     
     await client.saveObjects({
       indexName: 'docs',
       objects: records,
     });
   }
   
   export function searchDocs(query: string) {
     return client.search({
       requests: [{
         indexName: 'docs',
         query,
         hitsPerPage: 10,
       }],
     });
   }
   ```

3. **Version Selector** (`website-unified/components/docs/VersionSelector.tsx`)
   ```typescript
   interface VersionSelectorProps {
     versions: string[];
     currentVersion: string;
     onChange: (version: string) => void;
   }
   
   export function VersionSelector({ versions, currentVersion, onChange }: VersionSelectorProps) {
     return (
       <Select value={currentVersion} onValueChange={onChange}>
         <SelectTrigger>
           <SelectValue placeholder="Select version" />
         </SelectTrigger>
         <SelectContent>
           {versions.map(version => (
             <SelectItem key={version} value={version}>
               {version}
               {version === versions[0] && <Badge>Latest</Badge>}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>
     );
   }
   ```

4. **Feedback System** (`website-unified/components/docs/DocFeedback.tsx`)
   ```typescript
   export function DocFeedback() {
     const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
     const [comment, setComment] = useState('');
     const pathname = usePathname();
     
     const submitFeedback = async () => {
       await fetch('/api/docs/feedback', {
         method: 'POST',
         body: JSON.stringify({
           page: pathname,
           helpful: feedback === 'helpful',
           comment,
         }),
       });
     };
     
     return (
       <div className="doc-feedback">
         <p>Was this page helpful?</p>
         <div className="feedback-buttons">
           <Button
             variant={feedback === 'helpful' ? 'primary' : 'outline'}
             onClick={() => setFeedback('helpful')}
           >
             👍 Yes
           </Button>
           <Button
             variant={feedback === 'not-helpful' ? 'primary' : 'outline'}
             onClick={() => setFeedback('not-helpful')}
           >
             👎 No
           </Button>
         </div>
         
         {feedback && (
           <div className="feedback-form">
             <Textarea
               placeholder="How can we improve this page?"
               value={comment}
               onChange={(e) => setComment(e.target.value)}
             />
             <Button onClick={submitFeedback}>Submit</Button>
           </div>
         )}
       </div>
     );
   }
   ```

**Technical Requirements:**
- Full-text search (Algolia)
- Version management
- Feedback collection
- Analytics tracking
- Edit on GitHub

**Deliverables:**
- Documentation layout
- Search integration
- Version selector
- Feedback system

---

**Integration Notes:**
- MDX content from docs/content
- Auto-generation from code
- Search indexing on deploy
- Analytics tracking
- GitHub integration

**Success Criteria:**
- Complete API coverage
- All tools documented
- Interactive examples
- Fast search
- User feedback loop
- Version support
- Mobile responsive
