# SKILLS.md - Agent Skills & Capabilities

## Skill: Terminal Management

### Name
`copilot-terminal-autoclose`

### Description
Automatically close VS Code terminals after GitHub Copilot agent commands complete, maintaining a clean workspace.

### Category
- Developer Experience
- VS Code Configuration
- AI Agent Optimization

### Prerequisites
- VS Code 1.80+
- GitHub Copilot extension
- GitHub Copilot Chat extension

### Activation
This skill is activated by adding a VS Code setting. No runtime dependencies.

### Input
None required. The setting works automatically once configured.

### Output
Clean terminal management - terminals close after commands complete.

### Configuration

```json
{
  "github.copilot.chat.runCommand.autoCloseTerminal": true
}
```

### Use Cases

| Scenario | Benefit |
|----------|---------|
| Multi-step refactoring | No terminal buildup during large changes |
| Build/test cycles | Each run cleans up after itself |
| Git operations | Push/pull/commit don't leave orphan terminals |
| Package management | Install commands close cleanly |

### Limitations

- Only affects Copilot-created terminals
- Does not affect VS Code Tasks (use `presentation.close` instead)
- Does not affect manually opened terminals
- Background processes may still persist

### Related Skills

- `vscode-tasks-autoclose` - Auto-close for VS Code Tasks
- `terminal-cleanup` - Manual terminal management
- `workspace-hygiene` - General workspace cleanliness

### Version History

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial release |

### Maintainer
nirholas
