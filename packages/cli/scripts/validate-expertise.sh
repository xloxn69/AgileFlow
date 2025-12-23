#!/bin/bash
#
# validate-expertise.sh - Validate Agent Expert expertise.yaml files
#
# Purpose: Ensure expertise files remain accurate and useful over time
#
# Checks performed:
#   1. Schema validation (required fields: domain, last_updated, version)
#   2. Staleness check (last_updated > 30 days old)
#   3. File size check (warn if > 200 lines)
#   4. Learnings check (warn if empty - never self-improved)
#
# Usage:
#   ./scripts/validate-expertise.sh           # Validate all expertise files
#   ./scripts/validate-expertise.sh database  # Validate specific domain
#   ./scripts/validate-expertise.sh --help    # Show help
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed (warnings don't cause failure)
#

set -e

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EXPERTS_DIR="packages/cli/src/core/experts"
STALE_THRESHOLD_DAYS=30
MAX_LINES=200

# Counters
TOTAL=0
PASSED=0
WARNINGS=0
FAILED=0

# Help message
show_help() {
    echo "Usage: $0 [domain]"
    echo ""
    echo "Validate Agent Expert expertise.yaml files"
    echo ""
    echo "Options:"
    echo "  domain    Validate only the specified domain (e.g., 'database', 'testing')"
    echo "  --help    Show this help message"
    echo ""
    echo "Checks performed:"
    echo "  - Schema validation (domain, last_updated, version fields)"
    echo "  - Staleness check (last_updated > $STALE_THRESHOLD_DAYS days)"
    echo "  - File size check (> $MAX_LINES lines)"
    echo "  - Learnings check (empty learnings array)"
    echo ""
    echo "Examples:"
    echo "  $0                 # Validate all expertise files"
    echo "  $0 database        # Validate only database domain"
    echo "  $0 --help          # Show this help"
}

# Check if yq is available (for better YAML parsing)
has_yq() {
    command -v yq &> /dev/null
}

# Extract YAML field using grep (fallback if yq not available)
get_yaml_field() {
    local file="$1"
    local field="$2"
    grep "^${field}:" "$file" 2>/dev/null | sed "s/^${field}:[[:space:]]*//" | tr -d '"' || echo ""
}

# Check if learnings is empty
learnings_empty() {
    local file="$1"
    # Check for "learnings: []" or learnings with only comments
    if grep -q "^learnings: \[\]" "$file" 2>/dev/null; then
        return 0  # Empty
    fi
    # Check if there's actual content after learnings:
    local after_learnings
    after_learnings=$(sed -n '/^learnings:/,/^[a-z]/p' "$file" | grep -v "^#" | grep -v "^learnings:" | grep -v "^$" | head -1)
    if [ -z "$after_learnings" ]; then
        return 0  # Empty
    fi
    return 1  # Has content
}

# Get file line count
get_line_count() {
    wc -l < "$1" | tr -d ' '
}

# Calculate days since date
days_since() {
    local date_str="$1"
    local date_epoch
    local now_epoch

    # Handle different date formats
    if [[ "$date_str" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        date_epoch=$(date -d "$date_str" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$date_str" +%s 2>/dev/null)
    else
        echo "999"  # Invalid date
        return
    fi

    now_epoch=$(date +%s)
    echo $(( (now_epoch - date_epoch) / 86400 ))
}

# Validate a single expertise file
validate_expertise() {
    local domain="$1"
    local file="$EXPERTS_DIR/$domain/expertise.yaml"
    local status="PASS"
    local issues=()

    TOTAL=$((TOTAL + 1))

    # Check file exists
    if [ ! -f "$file" ]; then
        echo -e "${RED}FAIL${NC}  $domain - File not found: $file"
        FAILED=$((FAILED + 1))
        return 1
    fi

    # Schema validation
    local domain_field version last_updated
    domain_field=$(get_yaml_field "$file" "domain")
    version=$(get_yaml_field "$file" "version")
    last_updated=$(get_yaml_field "$file" "last_updated")

    if [ -z "$domain_field" ]; then
        issues+=("missing 'domain' field")
        status="FAIL"
    fi

    if [ -z "$version" ]; then
        issues+=("missing 'version' field")
        status="FAIL"
    fi

    if [ -z "$last_updated" ]; then
        issues+=("missing 'last_updated' field")
        status="FAIL"
    fi

    # Staleness check
    if [ -n "$last_updated" ]; then
        local days_old
        days_old=$(days_since "$last_updated")
        if [ "$days_old" -gt "$STALE_THRESHOLD_DAYS" ]; then
            issues+=("stale (${days_old} days since update)")
            if [ "$status" = "PASS" ]; then
                status="WARN"
            fi
        fi
    fi

    # File size check
    local line_count
    line_count=$(get_line_count "$file")
    if [ "$line_count" -gt "$MAX_LINES" ]; then
        issues+=("large file (${line_count} lines > ${MAX_LINES})")
        if [ "$status" = "PASS" ]; then
            status="WARN"
        fi
    fi

    # Learnings check
    if learnings_empty "$file"; then
        issues+=("no learnings recorded (never self-improved)")
        if [ "$status" = "PASS" ]; then
            status="WARN"
        fi
    fi

    # Output result
    case "$status" in
        PASS)
            echo -e "${GREEN}PASS${NC}  $domain"
            PASSED=$((PASSED + 1))
            ;;
        WARN)
            echo -e "${YELLOW}WARN${NC}  $domain - ${issues[*]}"
            WARNINGS=$((WARNINGS + 1))
            ;;
        FAIL)
            echo -e "${RED}FAIL${NC}  $domain - ${issues[*]}"
            FAILED=$((FAILED + 1))
            ;;
    esac
}

# Main
main() {
    # Handle help
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_help
        exit 0
    fi

    # Find script directory and change to repo root
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$script_dir/.."

    # Check experts directory exists
    if [ ! -d "$EXPERTS_DIR" ]; then
        echo -e "${RED}Error:${NC} Experts directory not found: $EXPERTS_DIR"
        echo "Are you running this from the repository root?"
        exit 1
    fi

    echo -e "${BLUE}Validating Agent Expert Files${NC}"
    echo "================================"
    echo ""

    # Validate specific domain or all
    if [ -n "$1" ]; then
        # Single domain
        if [ ! -d "$EXPERTS_DIR/$1" ]; then
            echo -e "${RED}Error:${NC} Domain not found: $1"
            echo "Available domains:"
            ls -1 "$EXPERTS_DIR" | grep -v templates | grep -v README
            exit 1
        fi
        validate_expertise "$1"
    else
        # All domains
        for dir in "$EXPERTS_DIR"/*/; do
            local domain
            domain=$(basename "$dir")
            # Skip templates directory
            if [ "$domain" = "templates" ]; then
                continue
            fi
            validate_expertise "$domain"
        done
    fi

    # Summary
    echo ""
    echo "================================"
    echo -e "Total: $TOTAL | ${GREEN}Passed: $PASSED${NC} | ${YELLOW}Warnings: $WARNINGS${NC} | ${RED}Failed: $FAILED${NC}"

    # Exit code
    if [ "$FAILED" -gt 0 ]; then
        exit 1
    fi
    exit 0
}

main "$@"
