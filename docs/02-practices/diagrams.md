# Diagram Generation Practice

How to create and maintain Mermaid diagrams that work on GitHub (including mobile) with proper light/dark theme support.

## Quick Start

```bash
# Generate light version
npx mmdc -i diagram.mmd -o diagram.light.svg -c mermaid.light.json -b transparent

# Generate dark version
npx mmdc -i diagram.mmd -o diagram.dark.svg -c mermaid.dark.json -b transparent
```

## Why Two SVGs?

GitHub's most reliable approach for theme-aware images is generating **separate light and dark versions** and using `<picture>` tags. Single-SVG CSS media query approaches can be inconsistent on iOS Safari and GitHub mobile.

**Sources:**
- [GitHub Changelog: picture + prefers-color-scheme](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/)
- [Mermaid CLI docs](https://github.com/mermaid-js/mermaid-cli)

## Config Files

### mermaid.light.json

Located at project root. Uses GitHub Primer light palette:
- Nodes: `#f6f8fa` (light gray)
- Text: `#24292f` (dark)
- Edges: `#57606a` (medium gray)
- Notes: `#fff8c5` (yellow tint)

### mermaid.dark.json

Located at project root. Uses GitHub Primer dark palette:
- Nodes: `#161b22` (dark)
- Text: `#e6edf3` (light)
- Edges: `#8b949e` (medium gray)
- Notes: `#332b00` (dark yellow)

## Embedding in Markdown

Use GitHub's `<picture>` element:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/diagram-name.dark.svg">
  <img alt="Diagram description" src="images/diagram-name.light.svg">
</picture>
```

**Always add a caption comment below each diagram** using blockquote syntax:

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/my-diagram.dark.svg">
  <img alt="My Diagram" src="images/my-diagram.light.svg">
</picture>

> Brief description of what the diagram shows and its key insights.
```

This provides context for readers and improves accessibility.

**Alternative (older method):**
```markdown
![](./diagram.dark.svg#gh-dark-mode-only)
![](./diagram.light.svg#gh-light-mode-only)
```

## Workflow for New Diagrams

1. **Write Mermaid source** in `.mmd` file:
   ```mermaid
   flowchart LR
       A[Start] --> B[Process]
       B --> C[End]
   ```

2. **Generate both versions:**
   ```bash
   npx mmdc -i my-diagram.mmd -o images/my-diagram.light.svg -c mermaid.light.json -b transparent
   npx mmdc -i my-diagram.mmd -o images/my-diagram.dark.svg -c mermaid.dark.json -b transparent
   ```

3. **Embed with picture tag** in your markdown

4. **Keep the .mmd source** in `/tmp/mermaid-extract/` or version control for future edits

## Regenerating All Diagrams

If you need to regenerate all diagrams (e.g., after config changes):

```bash
for mmd in /tmp/mermaid-extract/*.mmd; do
  name=$(basename "$mmd" .mmd)
  npx mmdc -i "$mmd" -o "docs/04-architecture/images/${name}.light.svg" -c mermaid.light.json -b transparent
  npx mmdc -i "$mmd" -o "docs/04-architecture/images/${name}.dark.svg" -c mermaid.dark.json -b transparent
done
```

## Color Palette Reference

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `transparent` | `transparent` |
| Node fill | `#f6f8fa` | `#161b22` |
| Node border | `#d0d7de` | `#30363d` |
| Text | `#24292f` | `#e6edf3` |
| Edges/arrows | `#57606a` | `#8b949e` |
| Edge label bg | `#ffffff` | `#0d1117` |
| Note fill | `#fff8c5` | `#332b00` |
| Note border | `#d4a72c` | `#9e6a03` |
| Cluster fill | `#ffffff` | `#0d1117` |

These colors are based on [GitHub Primer](https://primer.style/) design system for consistent, accessible contrast in both modes.

## Tips

- **Keep diagrams horizontal** (`flowchart LR`) when possible - they display better on mobile
- **Use transparent background** (`-b transparent`) so diagrams blend with GitHub's page background
- **Avoid special characters** in node labels - escape or rephrase if needed
- **Test on GitHub mobile** after pushing to verify rendering
- **Add blockquote captions** (`> Description...`) below every diagram to explain what it shows

## Related

- [Research: Mermaid SVG Styling](../10-research/20251217-mermaid-svg-styling.md)
- [Architecture Diagrams](../04-architecture/)
