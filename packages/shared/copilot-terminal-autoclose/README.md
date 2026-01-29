# Copilot Terminal Auto-Close

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension%20Setting-blue.svg)](https://code.visualstudio.com/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Compatible-green.svg)](https://github.com/features/copilot)

> Automatically close VS Code terminals after GitHub Copilot agent commands complete.

## The Problem

When GitHub Copilot (or other AI coding agents) runs terminal commands, they create new terminal instances that remain open after the command finishes. This leads to:

- 🗂️ **Terminal clutter** - Dozens of orphaned terminals
- 🔍 **Reduced visibility** - Hard to find the terminal you need
- 🧹 **Manual cleanup** - Constantly closing terminals yourself
- 💻 **Resource waste** - Memory used by idle terminal processes

## The Solution

A single VS Code setting that automatically closes agent-created terminals after commands complete:

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

## Quick Start

### Option 1: Copy the setting

Add to your `.vscode/settings.json`:

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true,
  "terminal.integrated.enablePersistentSessions": false,
  "terminal.integrated.allowChords": false
}
```

### Option 2: Use this package

```bash
# Clone or copy the .vscode folder to your project
cp -r .vscode /path/to/your/project/
```

### Option 3: Global setting

Add to your VS Code User Settings (`Ctrl+,` → Open Settings JSON):

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    WITHOUT AUTO-CLOSE                        │
├─────────────────────────────────────────────────────────────┤
│  Copilot runs command → Terminal opens → Command finishes   │
│                                    ↓                         │
│                         Terminal stays open ❌               │
│                                    ↓                         │
│                      Manual close required 😤                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     WITH AUTO-CLOSE                          │
├─────────────────────────────────────────────────────────────┤
│  Copilot runs command → Terminal opens → Command finishes   │
│                                    ↓                         │
│                    Terminal closes automatically ✅          │
│                                    ↓                         │
│                         Clean workspace 🎉                   │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Options

### Core Setting

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `github.copilot.chat.runCommand.autoCloseTerminal` | boolean | `false` | Auto-close terminals after Copilot commands complete |
| `terminal.integrated.enablePersistentSessions` | boolean | `true` | Disable to prevent terminal session persistence across restarts |
| `terminal.integrated.allowChords` | boolean | `true` | Disable to prevent chord key conflicts in terminal |

### Related Settings

```json
{
  // Core: Auto-close Copilot terminals
  "github.copilot.chat.runCommand.autoCloseTerminal": true,
  
  // Disable persistent sessions (clears on VS Code restart)
  "terminal.integrated.enablePersistentSessions": false,
  
  // Prevent chord conflicts
  "terminal.integrated.allowChords": false,
  
  // Optional: Smooth scrolling in terminal
  "terminal.integrated.smoothScrolling": true
}
```

## Known Limitations

### Terminal Still Opens During Execution

The terminal will still briefly appear while commands run. There is currently **no VS Code setting** to run agent terminals completely hidden. The `autoCloseTerminal` setting only closes them *after* completion.

### Agent Waits for Terminal Completion

AI agents will wait for a terminal command to finish before running the next one. If a terminal gets stuck or runs a long process, this can block workflow. Solutions:

1. **Reload VS Code** after enabling `autoCloseTerminal`
2. **Manually kill stuck terminals** with `Ctrl+Shift+` ` → trash icon
3. **Avoid long-running commands** in agent workflows (servers, watch modes)

## Task-Based Terminal Killing

For more control, use VS Code tasks to terminate all terminals/tasks. Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Terminate All Tasks",
      "command": "echo ${input:terminate}",
      "type": "shell",
      "problemMatcher": [],
      "presentation": { "close": true }
    },
    {
      "label": "Kill All Terminals",
      "command": "echo ${input:killTerminals}",
      "type": "shell",
      "problemMatcher": [],
      "presentation": { "close": true }
    }
  ],
  "inputs": [
    {
      "id": "terminate",
      "type": "command",
      "command": "workbench.action.tasks.terminate",
      "args": "terminateAll"
    },
    {
      "id": "killTerminals",
      "type": "command",
      "command": "workbench.action.terminal.killAll"
    }
  ]
}
```

Run via `Ctrl+Shift+P` → "Tasks: Run Task" → select "Kill All Terminals" or "Terminate All Tasks".

### Keyboard Shortcuts

Add to `keybindings.json` for quick access:

```json
[
  {
    "key": "ctrl+shift+k",
    "command": "workbench.action.terminal.killAll"
  },
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.terminate",
    "args": "terminateAll"
  }
]
```

## Compatibility

| Agent/Tool | Compatible | Notes |
|------------|------------|-------|
| GitHub Copilot Chat | ✅ | Full support |
| GitHub Copilot Edits | ✅ | Full support |
| Copilot Agent Mode | ✅ | Full support |
| VS Code Tasks | ⚠️ | Use `presentation.close` in tasks.json |
| Manual terminals | ❌ | Not affected (by design) |

## FAQ

### Does this affect my manual terminals?

No. This setting only affects terminals created by GitHub Copilot when running commands. Your manually opened terminals are not affected.

### What if a command fails?

The terminal still closes after the command completes (success or failure). The output is captured in the Copilot response, so you won't lose error messages.

### Can I see the output before it closes?

Yes - Copilot captures and displays the terminal output in the chat. The terminal closes, but you retain full visibility of what happened.

### Does this work with background processes?

For long-running processes (servers, watch modes), Copilot typically handles these differently and the terminal may remain open as expected.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [VS Code Terminal Documentation](https://code.visualstudio.com/docs/terminal/basics)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Report Issues](https://github.com/nirholas/copilot-terminal-autoclose/issues)
