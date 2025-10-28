# diagram-generator

Generate Mermaid/ASCII diagrams from descriptions.

## Activation Keywords
- "diagram", "ASCII", "Mermaid", "flowchart", "architecture", "sequence diagram"

## When to Use
- Creating architecture diagrams
- Visualizing user workflows
- Drawing sequence diagrams
- System design documentation

## What This Does
Generates diagrams in Mermaid format (renders in GitHub/Markdown):
- **Flowcharts** (user flows, decision trees)
- **Sequence diagrams** (API interactions, service calls)
- **Architecture diagrams** (system components, data flow)
- **ER diagrams** (database relationships)
- **Gantt charts** (timeline/roadmap)
- **State diagrams** (state machines)

Also supports ASCII art for simple diagrams.

## Output
Mermaid code blocks ready for markdown files

## Example Activation
User: "Draw user login flow"
Skill: Generates:
```mermaid
flowchart TD
    A[User opens login page] --> B[Enter email & password]
    B --> C[Click submit]
    C --> D{Valid credentials?}
    D -->|No| E[Show error message]
    E --> B
    D -->|Yes| F[Generate JWT token]
    F --> G[Redirect to dashboard]
    G --> H[User logged in]

    style D fill:#ff9999
    style H fill:#99ff99
```

Architecture diagram example:
```mermaid
graph LR
    Client[Frontend Client]
    API[API Server]
    DB[(Database)]
    Cache[Redis Cache]
    Auth[Auth Service]

    Client -->|HTTP Request| API
    API -->|Query| DB
    API -->|Lookup| Cache
    API -->|Verify Token| Auth
    Auth -->|Check User| DB
```
