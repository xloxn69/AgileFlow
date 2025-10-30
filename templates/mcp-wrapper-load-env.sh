#!/bin/bash
# MCP Environment Loader - loads .env and exports variables
# This wrapper script allows MCP servers to access environment variables from .env files
# without requiring system-level environment variable configuration.
#
# Usage: bash mcp-wrapper-load-env.sh <command> [args...]
# Example: bash mcp-wrapper-load-env.sh npx -y @modelcontextprotocol/server-github

# Find project root (assumes wrapper is in scripts/mcp-wrappers/)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# Load .env file if it exists
if [ -f "$ENV_FILE" ]; then
  # Read .env line by line, skipping comments and empty lines
  while IFS='=' read -r key value; do
    # Skip comments
    [[ $key =~ ^#.*$ ]] && continue
    # Skip empty lines
    [[ -z $key ]] && continue
    # Trim whitespace from value
    value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    # Export the variable
    export "$key=$value"
  done < <(grep -v '^#' "$ENV_FILE" | grep -v '^$')
fi

# Execute the command passed as arguments
exec "$@"
