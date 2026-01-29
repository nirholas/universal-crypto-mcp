# Release Process

This guide covers the release process for Universal Crypto MCP.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

## Release Types

### Stable Releases

Regular releases for production use:

```bash
# Patch release (bug fixes)
pnpm version patch

# Minor release (new features)
pnpm version minor

# Major release (breaking changes)
pnpm version major
```

### Pre-releases

For testing before stable release:

```bash
# Alpha release
pnpm version prerelease --preid alpha

# Beta release
pnpm version prerelease --preid beta

# Release candidate
pnpm version prerelease --preid rc
```

## Release Workflow

### 1. Prepare Release

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Run all checks
pnpm ci
```

### 2. Update Changelog

Update `CHANGELOG.md` with changes:

```markdown
## [1.2.0] - 2024-01-15

### Added
- New trading tools for Binance futures
- Support for Base chain

### Changed
- Improved gas estimation accuracy

### Fixed
- Fixed balance calculation for ERC20 tokens
```

### 3. Version Bump

```bash
# Bump version in all packages
pnpm version minor
```

This will:
- Update version in root `package.json`
- Update versions in all workspace packages
- Create a git tag

### 4. Push Release

```bash
# Push commits and tags
git push origin main --tags
```

### 5. Publish to npm

```bash
# Publish all packages
pnpm publish -r --access public
```

## Automated Releases

Releases are automated via GitHub Actions:

### On Tag Push

When a tag is pushed (e.g., `v1.2.0`):

1. CI runs all tests
2. Packages are built
3. Packages are published to npm
4. GitHub Release is created
5. Changelog is attached

### Workflow Configuration

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
          
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      
      - run: pnpm publish -r --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          
      - uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

## Package Publishing

### npm Configuration

Each package has its own `package.json`:

```json
{
  "name": "@universal-crypto-mcp/core",
  "version": "1.2.0",
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist",
    "README.md"
  ]
}
```

### Scoped Packages

All packages use the `@universal-crypto-mcp` scope:

```
@universal-crypto-mcp/core
@universal-crypto-mcp/trading-binance
@universal-crypto-mcp/wallet-evm
```

### Main Package

The main package `@nirholas/universal-crypto-mcp` bundles everything:

```json
{
  "name": "@nirholas/universal-crypto-mcp",
  "dependencies": {
    "@universal-crypto-mcp/core": "^1.2.0",
    "@universal-crypto-mcp/trading-binance": "^1.2.0",
    "@universal-crypto-mcp/wallet-evm": "^1.2.0"
  }
}
```

## Changelog Generation

We use [git-cliff](https://git-cliff.org/) for automated changelog generation:

```bash
# Generate changelog
git cliff -o CHANGELOG.md

# Preview next release
git cliff --unreleased
```

Configuration in `cliff.toml`:

```toml
[changelog]
header = "# Changelog"
body = """
{% for group, commits in commits | group_by(attribute="group") %}
### {{ group | upper_first }}
{% for commit in commits %}
- {{ commit.message | upper_first }} ([{{ commit.id | truncate(length=7, end="") }}]({{ commit.link }}))\
{% endfor %}
{% endfor %}
"""

[git]
conventional_commits = true
commit_parsers = [
  { message = "^feat", group = "Features" },
  { message = "^fix", group = "Bug Fixes" },
  { message = "^doc", group = "Documentation" },
  { message = "^perf", group = "Performance" },
  { message = "^refactor", group = "Refactoring" },
]
```

## Hotfix Process

For urgent fixes to production:

```bash
# Create hotfix branch from tag
git checkout -b hotfix/1.2.1 v1.2.0

# Make fix
git commit -m "fix: critical bug"

# Version and release
pnpm version patch
git push origin hotfix/1.2.1 --tags

# Merge back to main
git checkout main
git merge hotfix/1.2.1
```

## Breaking Changes

When making breaking changes:

1. **Document the change** in CHANGELOG.md
2. **Provide migration guide** if needed
3. **Use major version bump**
4. **Announce in release notes**

Example migration guide:

```markdown
## Migration from v1.x to v2.0

### Breaking Changes

#### `getPrice` returns different format

Before:
```typescript
const price = await getPrice("BTC"); // number
```

After:
```typescript
const { price, symbol } = await getPrice("BTC"); // object
```

### Migration Steps

1. Update all `getPrice` calls to destructure result
2. Update any code that depends on numeric return value
```

## Release Checklist

Before each release:

- [ ] All tests passing
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Breaking changes documented
- [ ] Migration guide if needed
- [ ] Version bumped correctly
- [ ] Package.json files updated

## Next Steps

- [Development Guide](development.md) - Development workflow
- [Testing Guide](testing.md) - Writing tests
