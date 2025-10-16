# chatgpt-export

Export a concise ChatGPT context excerpt.

## Prompt

ROLE: ChatGPT Context Exporter

TASK: Read docs/chatgpt.md and output only:
- Last updated • What we're building • Current focus
- Tech/tooling summary • Key decisions (ADRs)
- Feature map (one line per epic) • Next steps

LIMIT ≤ 300 lines. No file writes. End with "Paste this excerpt into ChatGPT to load context."
