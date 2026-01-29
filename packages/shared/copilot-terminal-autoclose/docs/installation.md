# Installation Guide

## Prerequisites

- Visual Studio Code 1.80 or later
- GitHub Copilot extension installed
- GitHub Copilot Chat extension installed

## Installation Methods

### Method 1: Direct Copy (Quickest)

1. Create a `.vscode` folder in your project root (if it doesn't exist)
2. Create or edit `.vscode/settings.json`
3. Add the setting:

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

### Method 2: Clone Repository

```bash
git clone https://github.com/nirholas/copilot-terminal-autoclose.git
cp -r copilot-terminal-autoclose/.vscode /path/to/your/project/
```

### Method 3: Global Installation

For all projects, add to your VS Code User Settings:

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Preferences: Open User Settings (JSON)"
4. Add:

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

### Method 4: Via npm (for Node.js projects)

```bash
npm install copilot-terminal-autoclose --save-dev
npm run install-setting
```

## Verification

To verify the setting is active:

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "autoCloseTerminal"
3. Confirm the setting is enabled

Or check via command palette:

1. Press `Ctrl+Shift+P`
2. Type "Preferences: Open Workspace Settings (JSON)"
3. Look for `github.copilot.chat.runCommand.autoCloseTerminal`

## Troubleshooting

### Setting not taking effect

1. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Check for conflicting settings in User vs Workspace settings
3. Ensure the JSON is valid (no trailing commas, proper quotes)

### Setting not appearing in search

Your VS Code version may be too old. Update to 1.80 or later.

## Next Steps

- See [Configuration](configuration.md) for additional options
- See [Troubleshooting](troubleshooting.md) for common issues
