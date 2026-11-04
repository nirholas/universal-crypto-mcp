# Documentation Site Deployment

The documentation at [mcp.giving](https://mcp.giving) is a MkDocs Material site.
It is hosted on Cloudflare Pages in the project `mcp-giving`.

| Item | Value |
|------|-------|
| Source | `docs/content/` (config: `docs/mkdocs.yml`) |
| Host | Cloudflare Pages, project `mcp-giving` |
| Production domains | `https://mcp.giving`, `https://www.mcp.giving` |
| Security headers | `docs/content/_headers` (copied into the build) |
| DNS | `mcp.giving` zone on Cloudflare; both hostnames are Pages custom domains |

## Build

```bash
pip install -r docs/requirements.txt
cd docs
mkdocs build            # output: docs/site/
```

## Deploy

Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment, then:

```bash
npx wrangler@4 pages deploy docs/site --project-name=mcp-giving --branch=main
```

The repository's GitHub workflows are stored as `.md` files in `.github/workflows/` and are disabled.
Deploys are manual.

## Verify

```bash
curl -sI https://mcp.giving | head -1          # HTTP/2 200
curl -sI https://www.mcp.giving | head -1      # HTTP/2 200
curl -sI https://mcp.giving | grep -i x-content-type-options
```

## Rollback

In the Cloudflare dashboard, open **Workers & Pages → mcp-giving → Deployments**.
Choose an earlier production deployment and select **Rollback to this deployment**.
