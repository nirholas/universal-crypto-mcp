# crypto-mcp-hub: one MCP endpoint for 100+ crypto MCP servers.
#   docker build -t crypto-mcp-hub packages/crypto-mcp-hub
#   docker run -p 8787:8787 -e HUB_AUTH_TOKEN=$(openssl rand -hex 24) --env-file .env crypto-mcp-hub
# Upstream servers are fetched on first use (npx / uvx) and cached in the
# container; mount a volume on /home/hub/.cache to keep that cache across runs.
FROM node:22-bookworm-slim

COPY --from=ghcr.io/astral-sh/uv:0.9.5 /uv /uvx /usr/local/bin/
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates python3 tini \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --create-home hub

USER hub
WORKDIR /home/hub/app
COPY --chown=hub package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --chown=hub bin ./bin
COPY --chown=hub src ./src
COPY --chown=hub catalog ./catalog

ENV HOST=0.0.0.0 \
    PORT=8787 \
    UV_PYTHON_PREFERENCE=managed \
    NODE_ENV=production
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/healthz').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
ENTRYPOINT ["/usr/bin/tini", "--", "node", "bin/crypto-mcp-hub.js"]
CMD ["--http"]
