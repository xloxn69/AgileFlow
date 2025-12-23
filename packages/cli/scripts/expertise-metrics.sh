#!/bin/bash
#
# expertise-metrics.sh - Metrics dashboard for Agent Expert system
#
# Purpose: Track the health and activity of Agent Expert expertise files
#
# Metrics tracked:
#   1. Total experts count
#   2. Experts with learnings (self-improved at least once)
#   3. Average file size (lines)
#   4. Staleness distribution (how old are the files)
#   5. Recent activity (updated in last 7 days)
#
# Usage:
#   ./scripts/expertise-metrics.sh           # Show metrics dashboard
#   ./scripts/expertise-metrics.sh --json    # Output as JSON (for logging)
#   ./scripts/expertise-metrics.sh --csv     # Output as CSV
#   ./scripts/expertise-metrics.sh --help    # Show help
#

set -e

# Configuration
EXPERTS_DIR="packages/cli/src/core/experts"

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Help message
show_help() {
    echo "Usage: $0 [--json | --csv | --help]"
    echo ""
    echo "Metrics dashboard for Agent Expert expertise files"
    echo ""
    echo "Options:"
    echo "  --json    Output metrics as JSON"
    echo "  --csv     Output metrics as CSV"
    echo "  --help    Show this help message"
    echo ""
    echo "Metrics tracked:"
    echo "  - Total experts count"
    echo "  - Experts with learnings (self-improved)"
    echo "  - Average file size (lines)"
    echo "  - Staleness distribution"
    echo "  - Recent activity (last 7 days)"
}

# Extract YAML field
get_yaml_field() {
    local file="$1"
    local field="$2"
    grep "^${field}:" "$file" 2>/dev/null | sed "s/^${field}:[[:space:]]*//" | tr -d '"' || echo ""
}

# Check if learnings is empty
has_learnings() {
    local file="$1"
    # Check for non-empty learnings
    if grep -q "^learnings: \[\]" "$file" 2>/dev/null; then
        return 1  # Empty
    fi
    # Check if there's actual content after learnings:
    local after_learnings
    after_learnings=$(sed -n '/^learnings:/,/^[a-z]/p' "$file" | grep -v "^#" | grep -v "^learnings:" | grep -v "^$" | grep "^  -" | head -1)
    if [ -n "$after_learnings" ]; then
        return 0  # Has content
    fi
    return 1  # Empty
}

# Get file line count
get_line_count() {
    wc -l < "$1" | tr -d ' '
}

# Calculate days since date
days_since() {
    local date_str="$1"
    local date_epoch now_epoch

    if [[ "$date_str" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        date_epoch=$(date -d "$date_str" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$date_str" +%s 2>/dev/null)
    else
        echo "999"
        return
    fi

    now_epoch=$(date +%s)
    echo $(( (now_epoch - date_epoch) / 86400 ))
}

# Count learnings entries
count_learnings() {
    local file="$1"
    local count
    # Count lines starting with "  - date:" in learnings section
    count=$(grep -c "^  - date:" "$file" 2>/dev/null) || count=0
    echo "$count"
}

# Main collection
collect_metrics() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$script_dir/.."

    # Initialize counters
    local total=0
    local with_learnings=0
    local total_lines=0
    local recent_updates=0
    local stale_7d=0
    local stale_30d=0
    local stale_90d=0
    local total_learnings=0

    # Collect data
    local domains=()
    local details=()

    for dir in "$EXPERTS_DIR"/*/; do
        local domain
        domain=$(basename "$dir")
        [ "$domain" = "templates" ] && continue

        local file="$dir/expertise.yaml"
        [ ! -f "$file" ] && continue

        total=$((total + 1))
        domains+=("$domain")

        # File size
        local lines
        lines=$(get_line_count "$file")
        total_lines=$((total_lines + lines))

        # Learnings
        local learnings_count
        learnings_count=$(count_learnings "$file")
        total_learnings=$((total_learnings + learnings_count))
        if [ "$learnings_count" -gt 0 ]; then
            with_learnings=$((with_learnings + 1))
        fi

        # Staleness
        local last_updated days_old
        last_updated=$(get_yaml_field "$file" "last_updated")
        days_old=$(days_since "$last_updated")

        if [ "$days_old" -le 7 ]; then
            recent_updates=$((recent_updates + 1))
        elif [ "$days_old" -le 30 ]; then
            stale_7d=$((stale_7d + 1))
        elif [ "$days_old" -le 90 ]; then
            stale_30d=$((stale_30d + 1))
        else
            stale_90d=$((stale_90d + 1))
        fi

        # Store detail
        details+=("$domain,$lines,$learnings_count,$days_old")
    done

    # Calculate averages
    local avg_lines=0
    if [ "$total" -gt 0 ]; then
        avg_lines=$((total_lines / total))
    fi

    # Output based on format
    local format="${1:-dashboard}"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    case "$format" in
        json)
            echo "{"
            echo "  \"timestamp\": \"$timestamp\","
            echo "  \"total_experts\": $total,"
            echo "  \"with_learnings\": $with_learnings,"
            echo "  \"self_improve_rate\": $(awk -v w="$with_learnings" -v t="$total" 'BEGIN {printf "%.1f", (w / t) * 100}'),"
            echo "  \"total_learnings\": $total_learnings,"
            echo "  \"avg_file_lines\": $avg_lines,"
            echo "  \"staleness\": {"
            echo "    \"recent_7d\": $recent_updates,"
            echo "    \"stale_8_30d\": $stale_7d,"
            echo "    \"stale_31_90d\": $stale_30d,"
            echo "    \"stale_90d_plus\": $stale_90d"
            echo "  }"
            echo "}"
            ;;
        csv)
            local csv_rate
            csv_rate=$(awk -v w="$with_learnings" -v t="$total" 'BEGIN {printf "%.1f", (w / t) * 100}')
            echo "timestamp,total_experts,with_learnings,self_improve_rate,total_learnings,avg_file_lines,recent_7d,stale_8_30d,stale_31_90d,stale_90d_plus"
            echo "$timestamp,$total,$with_learnings,$csv_rate,$total_learnings,$avg_lines,$recent_updates,$stale_7d,$stale_30d,$stale_90d"
            ;;
        dashboard)
            echo ""
            echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
            echo -e "${BLUE}║        Agent Expert Metrics Dashboard          ║${NC}"
            echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${GREEN}Summary${NC}"
            echo "─────────────────────────────────────────────────"
            printf "%-30s %s\n" "Total Experts:" "$total"
            local pct
            pct=$(awk -v w="$with_learnings" -v t="$total" 'BEGIN {printf "%.0f", (w / t) * 100}')
            printf "%-30s %s (%s%%)\n" "With Learnings:" "$with_learnings" "$pct"
            printf "%-30s %s\n" "Total Learnings Recorded:" "$total_learnings"
            printf "%-30s %s lines\n" "Avg File Size:" "$avg_lines"
            echo ""
            echo -e "${YELLOW}Staleness Distribution${NC}"
            echo "─────────────────────────────────────────────────"
            printf "%-30s %s\n" "Updated in last 7 days:" "$recent_updates"
            printf "%-30s %s\n" "8-30 days old:" "$stale_7d"
            printf "%-30s %s\n" "31-90 days old:" "$stale_30d"
            printf "%-30s %s\n" "90+ days old:" "$stale_90d"
            echo ""
            echo -e "${BLUE}Self-Improve Health${NC}"
            echo "─────────────────────────────────────────────────"
            if [ "$with_learnings" -eq 0 ]; then
                echo "No agents have self-improved yet"
                echo "   Run agents and they will update expertise.yaml"
            elif [ "$with_learnings" -lt $((total / 2)) ]; then
                local rate
                rate=$(awk -v w="$with_learnings" -v t="$total" 'BEGIN {printf "%.0f", (w / t) * 100}')
                echo "$with_learnings/$total agents have started learning"
                echo "   Self-improve rate: ${rate}%"
            else
                local avg
                avg=$(awk -v l="$total_learnings" -v t="$total" 'BEGIN {printf "%.1f", l / t}')
                echo "Good adoption: $with_learnings/$total agents learning"
                echo "   Average learnings per expert: $avg"
            fi
            echo ""
            echo "Generated: $timestamp"
            ;;
    esac
}

# Main
main() {
    case "$1" in
        --help|-h)
            show_help
            exit 0
            ;;
        --json)
            collect_metrics "json"
            ;;
        --csv)
            collect_metrics "csv"
            ;;
        *)
            collect_metrics "dashboard"
            ;;
    esac
}

main "$@"
