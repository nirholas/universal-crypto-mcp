# Troubleshooting Guide

## Common Issues

### Terminal not closing after commands

**Symptoms**: Copilot runs a command, but the terminal stays open.

**Solutions**:

1. **Reload VS Code**
   - Press `Ctrl+Shift+P`
   - Type "Developer: Reload Window"
   - Press Enter

2. **Check setting is applied**
   - Open Settings (`Ctrl+,`)
   - Search for "autoCloseTerminal"
   - Verify it's set to `true`

3. **Check for conflicting settings**
   - User settings may override workspace settings
   - Check both locations

4. **Verify JSON syntax**
   ```json
   {
     "github.copilot.chat.runCommand.autoCloseTerminal": true
   }
   ```
   - No trailing commas
   - Proper quotes
   - Valid JSON structure

### Setting not appearing in VS Code

**Symptoms**: Can't find the setting in VS Code settings UI.

**Cause**: VS Code version is too old.

**Solution**: Update VS Code to version 1.80 or later.

### Manual terminals also closing

**Symptoms**: Terminals you open manually are closing.

**Reality**: This shouldn't happen. The setting only affects Copilot-created terminals.

**If this occurs**:
1. This is likely a different issue
2. Check for shell configuration issues
3. Check for other extensions affecting terminals

### Background processes terminating

**Symptoms**: Long-running processes (servers, watch modes) are being killed.

**Solutions**:

1. **Use VS Code Tasks for servers**
   ```json
   {
     "label": "dev server",
     "type": "shell",
     "command": "npm run dev",
     "isBackground": true,
     "presentation": {
       "close": false
     }
   }
   ```

2. **Run servers in separate terminal**
   - Manually open a terminal
   - Run the server there (won't be affected by the setting)

### Output disappearing too fast

**Symptoms**: Terminal closes before you can see the output.

**Reality**: Output is captured in Copilot chat.

**If you need persistent output**:
1. Check the Copilot chat response
2. Temporarily disable the setting for debugging
3. Use logging to a file instead of console

## Verification Steps

### Check if setting is active

```bash
# In VS Code terminal
code --list-extensions | grep -i copilot
```

Then check Settings (`Ctrl+,`) → search "autoCloseTerminal"

### Check settings.json location

```bash
# Find your settings file
# Windows
cat "$APPDATA/Code/User/settings.json"

# macOS
cat ~/Library/Application\ Support/Code/User/settings.json

# Linux
cat ~/.config/Code/User/settings.json
```

### Check workspace settings

```bash
cat .vscode/settings.json
```

## Getting Help

### Information to include when reporting issues

1. VS Code version (`Help → About`)
2. Copilot extension version
3. Contents of `.vscode/settings.json`
4. Operating system
5. Steps to reproduce

### Where to report

- [GitHub Issues](https://github.com/nirholas/copilot-terminal-autoclose/issues)

## FAQ

**Q: Can I undo this setting?**

A: Yes, set to `false` or remove the line:
```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": false
}
```

**Q: Does this affect VS Code Tasks?**

A: No. For tasks, use `"presentation": { "close": true }` in `tasks.json`.

**Q: Will this break anything?**

A: No. It only changes when terminals close. All functionality remains the same.
