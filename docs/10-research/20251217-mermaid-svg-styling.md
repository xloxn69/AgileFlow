# Mermaid SVG Diagram Styling for GitHub

**Research Date**: 2025-12-17
**Topic**: Mermaid SVG diagram styling themes templates for GitHub light/dark mode
**Sources**: Mermaid.js docs, GitHub docs, Primer design system

## Summary

The most reliable approach for GitHub (including mobile) is to **generate two SVGs (light + dark) and let GitHub choose** using `<picture>` tags with `prefers-color-scheme`. This avoids edge cases where `@media (prefers-color-scheme)` inside SVG is inconsistently honored in WebKit/Safari.

GitHub officially supports theme-specific images via:
- `<picture>` + `prefers-color-scheme` (recommended)
- URI fragments `#gh-dark-mode-only` / `#gh-light-mode-only` (older but documented)

## Professional Adaptive Palette (GitHub Primer-style)

### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| Canvas/background | `transparent` | Lets GitHub page background show |
| Text | `#24292f` | Primary text |
| Node fill | `#f6f8fa` | Node backgrounds |
| Node stroke | `#d0d7de` | Node borders |
| Edge/arrow | `#57606a` | Lines and arrows |
| Edge label bg | `#ffffff` | Edge label backgrounds |
| Note fill | `#fff8c5` | Note backgrounds (yellow tint) |
| Note stroke | `#d4a72c` | Note borders |

### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| Canvas/background | `transparent` | Lets GitHub page background show |
| Text | `#e6edf3` | Primary text |
| Node fill | `#161b22` | Node backgrounds |
| Node stroke | `#30363d` | Node borders |
| Edge/arrow | `#8b949e` | Lines and arrows |
| Edge label bg | `#0d1117` | Edge label backgrounds |
| Note fill | `#332b00` | Note backgrounds |
| Note stroke | `#9e6a03` | Note borders |

## Mermaid Config Files

### mermaid.light.json

```json
{
  "theme": "base",
  "themeVariables": {
    "fontFamily": "-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif",
    "fontSize": "14px",
    "background": "transparent",
    "primaryColor": "#f6f8fa",
    "primaryBorderColor": "#d0d7de",
    "primaryTextColor": "#24292f",
    "lineColor": "#57606a",
    "mainBkg": "#f6f8fa",
    "nodeBorder": "#d0d7de",
    "clusterBkg": "#ffffff",
    "clusterBorder": "#d0d7de",
    "defaultLinkColor": "#57606a",
    "edgeLabelBackground": "#ffffff",
    "titleColor": "#24292f",
    "actorBkg": "#f6f8fa",
    "actorBorder": "#d0d7de",
    "actorTextColor": "#24292f",
    "signalColor": "#57606a",
    "signalTextColor": "#24292f",
    "noteBkgColor": "#fff8c5",
    "noteBorderColor": "#d4a72c",
    "noteTextColor": "#24292f",
    "labelColor": "#24292f",
    "altBackground": "#ffffff"
  }
}
```

### mermaid.dark.json

```json
{
  "theme": "base",
  "themeVariables": {
    "fontFamily": "-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif",
    "fontSize": "14px",
    "background": "transparent",
    "primaryColor": "#161b22",
    "primaryBorderColor": "#30363d",
    "primaryTextColor": "#e6edf3",
    "lineColor": "#8b949e",
    "mainBkg": "#161b22",
    "nodeBorder": "#30363d",
    "clusterBkg": "#0d1117",
    "clusterBorder": "#30363d",
    "defaultLinkColor": "#8b949e",
    "edgeLabelBackground": "#0d1117",
    "titleColor": "#e6edf3",
    "actorBkg": "#161b22",
    "actorBorder": "#30363d",
    "actorTextColor": "#e6edf3",
    "signalColor": "#8b949e",
    "signalTextColor": "#e6edf3",
    "noteBkgColor": "#332b00",
    "noteBorderColor": "#9e6a03",
    "noteTextColor": "#e6edf3",
    "labelColor": "#e6edf3",
    "altBackground": "#0d1117"
  }
}
```

## CLI Commands

```bash
# Generate light version
mmdc -i diagram.mmd -o diagram.light.svg -c mermaid.light.json -b transparent

# Generate dark version
mmdc -i diagram.mmd -o diagram.dark.svg -c mermaid.dark.json -b transparent
```

## GitHub README Embedding

### Option 1: `<picture>` (Recommended)

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./diagram.dark.svg">
  <img alt="Diagram" src="./diagram.light.svg">
</picture>
```

### Option 2: URI Fragments (Older)

```markdown
![](./diagram.dark.svg#gh-dark-mode-only)
![](./diagram.light.svg#gh-light-mode-only)
```

## Key Mermaid SVG Classes

### Flowchart
- `.node` (contains rect/circle/polygon/path)
- `.nodeLabel`, `.label`
- `.edgePath path`, `.flowchart-link`
- `.edgeLabel`, `.edgeLabel rect`, `.edgeLabel text`
- `.arrowheadPath`, `marker path`
- `.cluster rect`, `.cluster-label`

### Sequence
- `.actor`, `.actor-man`, `.actor-woman`
- `.actor-line`
- `.messageLine0`, `.messageLine1`
- `.messageText`
- `.note`, `.noteText`

### State
- `.statediagram-state`, `.state`
- `.stateLabel`
- `.transition`
- `.stateGroup`

## Best Practices

1. **Token-driven colors** - Don't hardcode random hexes per diagram
2. **Low-chroma neutrals + one accent** - Better scannability than rainbow diagrams
3. **Transparent canvas** - Avoid big white/dark boxes in wrong mode
4. **Consistent line weights** - One for outlines, one for edges
5. **Don't fight Mermaid inline styles** - Use themeVariables correctly OR override with !important

## Common Pitfalls

1. Expecting GitHub page CSS to affect `![](image.svg)` (SVG is its own document)
2. Relying on single-SVG `@media` solution without testing GitHub mobile/iOS Safari
3. Too-light edge colors in light mode or too-dark fills in dark mode

## References

- [Mermaid Theme Configuration](https://mermaid.js.org/config/theming.html) (2025-12-17)
- [Mermaid CLI README](https://github.com/mermaid-js/mermaid-cli) (2025-12-17)
- [GitHub Changelog - picture + prefers-color-scheme](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/) (2022-05-19)
- [GitHub Changelog - URI fragments](https://github.blog/changelog/2021-11-24-specify-theme-context-for-images-in-markdown/) (2021-11-24)
- [Primer Color Usage](https://primer.style/product/getting-started/foundations/color-usage) (2025-12-17)
- [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) (2025-12-05)
