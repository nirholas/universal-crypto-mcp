# Configuration Guide

## Core Setting

The primary setting for this package:

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

## Setting Locations

VS Code settings can be defined at multiple levels, with more specific levels taking precedence:

### 1. User Settings (Global)

Applies to all VS Code windows and projects.

**Location**: 
- Windows: `%APPDATA%\Code\User\settings.json`
- macOS: `~/Library/Application Support/Code/User/settings.json`
- Linux: `~/.config/Code/User/settings.json`

### 2. Workspace Settings (Per-Project)

Applies only to the current project.

**Location**: `.vscode/settings.json` in project root

### 3. Folder Settings (Multi-root Workspaces)

For multi-root workspaces, each folder can have its own settings.

**Location**: `.vscode/settings.json` in each folder

## Related Settings

### Terminal Persistence

Disable terminal session persistence across VS Code restarts:

```json
{
  "terminal.integrated.enablePersistentSessions": false
}
```

### Task Auto-Close

For VS Code Tasks (defined in `tasks.json`), use the presentation option:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "npm run build",
      "presentation": {
        "close": true
      }
    }
  ]
}
```

## Complete Example

A comprehensive `.vscode/settings.json`:

```json
{
  // Auto-close Copilot terminals
  "github.copilot.chat.runCommand.autoCloseTerminal": true,
  
  // Don't persist terminal sessions
  "terminal.integrated.enablePersistentSessions": false,
  
  // Terminal appearance (optional)
  "terminal.integrated.smoothScrolling": true,
  "terminal.integrated.cursorBlinking": true
}
```

## Conditional Configuration

### Enable for Specific Projects Only

Only add the setting to projects where you want it active. Don't add it globally if you need terminal persistence in some projects.

### Disable for Debugging

When debugging, you may want terminal output to persist. Consider:

1. Temporarily disabling the setting
2. Using a separate debug profile
3. Using the Debug Console instead of terminal

## Merging with Existing Settings

If you already have a `.vscode/settings.json`:

```json
{
  // Your existing settings
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  
  // Add this line
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

## Workspace Settings File

For `.code-workspace` files:

```json
{
  "folders": [
    { "path": "." }
  ],
  "settings": {
    "github.copilot.chat.runCommand.autoCloseTerminal": true
  }
}
```
