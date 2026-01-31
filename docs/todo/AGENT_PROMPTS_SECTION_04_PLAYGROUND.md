# AGENT 6: TOOL PLAYGROUND ADAPTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: INTERACTIVE TOOL EXPLORER

**Context:** Adapt existing playground components to provide interactive access to all 380+ MCP tools.

**Objective:** Build comprehensive tool exploration interface with search, categories, and documentation.

**Requirements:**
1. **Tool Explorer Page** (`website-unified/app/(playground)/tools/page.tsx`)
   - Grid/list view of all 380+ tools
   - Category sidebar (19 categories)
   - Full-text search with fuzzy matching
   - Tool cards with description, category, complexity
   - Favorite tools quick access
   - Recently used tools
   - Tool popularity indicators

2. **Category Navigation** (`website-unified/components/playground/CategoryNav.tsx`)
   - Collapsible category tree
   - Tool count per category
   - Subcategory support
   - Category icons
   - Quick filter chips
   - Categories:
     - Blockchain (EVM, Solana, Multi-chain)
     - DeFi (Lending, DEX, Staking, Yield)
     - Trading (CEX, Bots, Signals)
     - Market Data (Prices, Analytics, On-chain)
     - Wallets (Management, Signing, ENS)
     - NFT (Trading, Analytics, Metadata)
     - Security (Audit, Scanning, Monitoring)
     - AI Agents (Frameworks, Orchestration)
     - And 11 more...

3. **Tool Search** (`website-unified/components/playground/ToolSearch.tsx`)
   - Instant search as you type
   - Search by name, description, parameters
   - Filter by input/output types
   - Advanced query syntax
   - Search history
   - Suggested searches

4. **Tool Card** (`website-unified/components/playground/ToolCard.tsx`)
   - Tool name and icon
   - Brief description
   - Category badge
   - Complexity indicator (beginner/advanced)
   - Required permissions
   - Quick try button
   - Documentation link

**Technical Stack:**
- Fuse.js for fuzzy search
- React virtualization for large lists
- Tool metadata from packages/
- TypeScript for tool schemas
- Responsive grid layout

**Deliverables:**
- Tool explorer with 380+ tools
- Category navigation system
- Advanced search functionality
- Tool card components

---

## PROMPT 2: TOOL EXECUTION INTERFACE

**Context:** Create interface for executing individual tools with parameter input and output display.

**Objective:** Build interactive tool execution environment with real-time feedback.

**Requirements:**
1. **Tool Detail Page** (`website-unified/app/(playground)/tool/[id]/page.tsx`)
   - Tool documentation
   - Parameter schema display
   - Live execution interface
   - Output display
   - Example inputs
   - Related tools
   - Usage history

2. **Parameter Form** (`website-unified/components/playground/ParameterForm.tsx`)
   - Auto-generated form from JSON schema
   - Input types:
     - Text, number, boolean
     - Address (with validation)
     - Token selector
     - Chain selector
     - Date/time picker
     - JSON editor
     - File upload
   - Required vs optional indicators
   - Default values
   - Validation feedback
   - Parameter documentation tooltips

3. **Execution Panel** (`website-unified/components/playground/ExecutionPanel.tsx`)
   - Execute button with loading state
   - Cancel execution option
   - Execution timer
   - Progress indicators
   - Error handling with details
   - Retry mechanism
   - Save execution as preset

4. **Output Display** (`website-unified/components/playground/OutputDisplay.tsx`)
   - JSON tree viewer
   - Table view for arrays
   - Chart view for numeric data
   - Raw JSON toggle
   - Copy output button
   - Download as file
   - Share output link

**Technical Requirements:**
- JSON Schema form generation
- Real-time validation
- WebSocket for streaming output
- Syntax highlighting for JSON
- Output transformation options

**Deliverables:**
- Tool execution interface
- Dynamic parameter forms
- Execution management
- Rich output display

---

## PROMPT 3: WORKFLOW BUILDER (TOOL CHAINING)

**Context:** Create visual workflow builder for chaining multiple tools together.

**Objective:** Build drag-and-drop workflow editor for creating automated tool sequences.

**Requirements:**
1. **Workflow Canvas** (`website-unified/app/(playground)/workflows/page.tsx`)
   - Drag-and-drop canvas
   - Tool node placement
   - Connection drawing between nodes
   - Zoom and pan controls
   - Minimap navigation
   - Grid snap option
   - Undo/redo support

2. **Tool Nodes** (`website-unified/components/playground/WorkflowNode.tsx`)
   - Tool selector dropdown
   - Inline parameter editing
   - Input/output ports
   - Execution status indicator
   - Error display
   - Collapse/expand
   - Duplicate/delete node

3. **Data Flow** (`website-unified/components/playground/DataFlow.tsx`)
   - Output-to-input mapping
   - Data transformation nodes
   - Conditional branching
   - Loop constructs
   - Variable storage
   - Expression evaluation
   - Type compatibility checking

4. **Workflow Execution** (`website-unified/components/playground/WorkflowRunner.tsx`)
   - Execute entire workflow
   - Step-by-step execution
   - Breakpoints
   - Variable inspector
   - Execution log
   - Error recovery options
   - Save execution results

**Technical Requirements:**
- React Flow or similar canvas library
- Workflow state management
- DAG (Directed Acyclic Graph) validation
- Async execution engine
- Progress tracking per node

**Deliverables:**
- Visual workflow builder
- Tool chaining system
- Conditional logic support
- Workflow execution engine

---

## PROMPT 4: CODE GENERATION & SDK

**Context:** Generate code snippets and SDK examples from tool executions.

**Objective:** Build code generation system that converts tool usage into reusable code.

**Requirements:**
1. **Code Generator** (`website-unified/components/playground/CodeGenerator.tsx`)
   - Generate from tool execution
   - Multiple languages:
     - TypeScript/JavaScript
     - Python
     - Rust
     - Go
     - cURL
   - SDK vs raw API versions
   - Copy to clipboard
   - Download as file

2. **SDK Playground** (`website-unified/app/(playground)/sdk/page.tsx`)
   - Interactive code editor
   - Syntax highlighting
   - Auto-completion
   - Inline documentation
   - Run in browser (JS/TS)
   - Output panel
   - Error highlighting

3. **Template Library** (`website-unified/components/playground/TemplateLibrary.tsx`)
   - Pre-built code templates
   - Common use cases:
     - Swap tokens
     - Check balances
     - Monitor prices
     - Execute DeFi operations
   - Template customization
   - Save custom templates
   - Share templates

4. **API Reference** (`website-unified/components/playground/APIReference.tsx`)
   - OpenAPI documentation
   - Endpoint explorer
   - Request/response schemas
   - Authentication guide
   - Rate limits display
   - Error codes reference
   - SDK installation

**Technical Requirements:**
- Code generation templates
- Monaco editor integration
- In-browser code execution
- SDK documentation sync
- Multi-language support

**Deliverables:**
- Code generator for 5 languages
- Interactive SDK playground
- Template library
- API documentation

---

## PROMPT 5: PLAYGROUND WORKSPACE & HISTORY

**Context:** Create persistent workspace for saving executions, workflows, and experiments.

**Objective:** Build workspace system for organizing and sharing playground work.

**Requirements:**
1. **Workspace Dashboard** (`website-unified/app/(playground)/workspace/page.tsx`)
   - Saved executions list
   - Saved workflows list
   - Quick re-run buttons
   - Workspace organization (folders)
   - Search workspace
   - Sort by date, name, tool
   - Import/Export workspace

2. **Execution History** (`website-unified/components/playground/ExecutionHistory.tsx`)
   - Complete execution log
   - Filter by tool, date, status
   - Execution details view
   - Re-run with same parameters
   - Compare executions
   - Execution analytics
   - Clear history option

3. **Sharing System** (`website-unified/components/playground/SharingSystem.tsx`)
   - Share execution as link
   - Share workflow as template
   - Public/private visibility
   - Embed code for docs
   - Fork shared items
   - Comments on shared items
   - Usage analytics

4. **Presets Manager** (`website-unified/components/playground/PresetsManager.tsx`)
   - Save parameter presets
   - Preset categories
   - Quick apply preset
   - Edit preset
   - Share presets
   - Import community presets
   - Preset versioning

**Technical Requirements:**
- Local storage for history
- Database for saved items (Agent 13)
- Shareable URL generation
- Access control for shared items
- Data export functionality

**Deliverables:**
- Workspace organization system
- Execution history tracking
- Sharing and collaboration
- Presets management

---

**Integration Notes:**
- Connect to MCP server for tool execution
- Use packages/core for tool schemas
- Integrate with Auth (Agent 12) for saved data
- Database storage (Agent 13) for persistence
- Real-time updates via WebSocket (Agent 11)

**Success Criteria:**
- All 380+ tools accessible and executable
- Parameter forms validate correctly
- Workflows execute without errors
- Code generation produces working code
- History persists across sessions
- Sharing generates valid links
- Mobile-friendly interface
