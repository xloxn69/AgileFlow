#!/bin/bash
# MCP Wrapper Script for Postgres (example for servers without ${VAR} support)
#
# PURPOSE: Some MCP servers don't support ${VAR} environment variable substitution
# in .mcp.json. This wrapper script loads .env and passes values to the server.
#
# USAGE IN .mcp.json:
# {
#   "mcpServers": {
#     "postgres": {
#       "command": "bash",
#       "args": ["./scripts/mcp-wrapper-postgres.sh"]
#     }
#   }
# }
#
# SETUP:
# 1. Copy this template to your project: cp templates/mcp-wrapper-postgres.sh scripts/
# 2. Make executable: chmod +x scripts/mcp-wrapper-postgres.sh
# 3. Add to .mcp.json using the format above
# 4. Add Postgres credentials to .env:
#    POSTGRES_HOST=localhost
#    POSTGRES_PORT=5432
#    POSTGRES_USER=your_username
#    POSTGRES_PASSWORD=your_password
#    POSTGRES_DATABASE=your_database

set -euo pipefail

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

# Validate required environment variables
: "${POSTGRES_HOST:?ERROR: POSTGRES_HOST not set in .env}"
: "${POSTGRES_PORT:?ERROR: POSTGRES_PORT not set in .env}"
: "${POSTGRES_USER:?ERROR: POSTGRES_USER not set in .env}"
: "${POSTGRES_PASSWORD:?ERROR: POSTGRES_PASSWORD not set in .env}"
: "${POSTGRES_DATABASE:?ERROR: POSTGRES_DATABASE not set in .env}"

# Execute Postgres MCP server with credentials
# Replace with actual Postgres MCP server command (example placeholder)
exec npx -y @modelcontextprotocol/server-postgres \
  --host "$POSTGRES_HOST" \
  --port "$POSTGRES_PORT" \
  --user "$POSTGRES_USER" \
  --password "$POSTGRES_PASSWORD" \
  --database "$POSTGRES_DATABASE"
