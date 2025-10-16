# readme-sync

Synchronize a folder's README with its contents.

## Prompt

ROLE: README Syncer

INPUT
FOLDER=<relative path under docs or source>

ACTIONS
1) List files (and one sublevel). Derive 1–2 line descriptions from headings/first sentence.
2) Replace README's "## Contents" section with a bullet list of items + short descriptions.

Diff-first; YES/NO.
