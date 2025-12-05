# AgileFlow Connectedness Playbook

**Version**: 2.0 (Revised - Plugin-Focused)
**Philosophy**: AgileFlow should feel like **one living system** where decisions, stories, agents, and artifacts automatically link, update, and suggest next steps—not a collection of disconnected tools.

---

## Current State (v2.19.8)

✅ **What we have**:
- 23 skills with standardized skeleton (ROLE, FIRST ACTION, RELATED COMMANDS, HANDOFFS)
- 27 subagents that update status.json and bus/log.jsonl
- 38 slash commands for workflow automation
- ADRs, epics, stories, tech-debt tracking
- Architecture context extraction
- Hooks system for automation

❌ **What's missing**:
- **Cross-links aren't mandatory** - ADRs, stories, changelog entries don't automatically reference each other
- **Handoffs are manual** - Agents update status.json, but transitions aren't automatic
- **No "big picture" view** - Data exists in status.json, bus, ADRs, but no unified dashboard
- **Commands run in isolation** - `/adr-new` doesn't suggest `/tech-debt`, etc.
- **MCP setup is fragile** - No validation that .env, wrapper scripts are working

**Goal**: Make AgileFlow feel like **one interconnected organism** instead of separate parts.

---

## The 9 Connectedness Rules

### 1. Cross-Links as First-Class Requirement

**Current**: ADRs mention "Supersedes" and "Related" in examples, but it's optional.

**New**: **Mandatory Links block** in every ADR, story, tech-debt item, and changelog entry.

**Implementation**:

```markdown
## Links (REQUIRED)

**Supersedes**: [ADR-0003](../03-decisions/ADR-0003-session-auth.md) - Session-based auth
**Related Stories**: [US-0042](../06-stories/US-0042-jwt-tokens.md), [US-0043](../06-stories/US-0043-refresh-tokens.md)
**Tech Debt**: [TD-012](../08-quality/tech-debt.md#td-012) - Remove session tables
**Informs**: [CHANGELOG v2.5.0](../../CHANGELOG.md#250---2025-11-01)
```

**Validation** (optional command users can run):
```bash
# /AgileFlow:validate-links
# Checks if ADR lacks "## Links" block
# Checks if story references ADR that doesn't exist
# Checks if changelog entry lacks issue/PR IDs
```

**Files to update**:
- `templates/adr-template.md` - Add mandatory Links block
- `templates/story-template.md` - Add mandatory Links block
- `templates/tech-debt-template.md` - Add Links section
- `commands/adr-new.md` - Enforce Links creation
- `agents/agileflow-adr-writer.md` - Auto-populate Links from context

**Example diff**:
```diff
--- a/templates/adr-template.md
+++ b/templates/adr-template.md
@@ -15,6 +15,14 @@

 [Clear, concise description of the architectural decision and why it matters]

+## Links (REQUIRED)
+
+**Supersedes**: [ADR-XXXX](path/to/adr.md) or "None"
+**Related Stories**: [US-XXXX](path/to/story.md), [US-YYYY](path/to/story.md)
+**Tech Debt Created**: [TD-XXX](../08-quality/tech-debt.md#td-xxx) or "None"
+**Informs**: [CHANGELOG vX.Y.Z](../../CHANGELOG.md#xyz) or "Pending"
+**References**: Links to external docs, RFCs, similar decisions in other projects
+
 ## Context
```

---

### 2. Unified Agent Handoffs via Status.json + Bus Protocol

**Current**: Agents update status.json and bus/log.jsonl, but handoffs are implicit.

**New**: **Explicit handoff protocol** - every agent transition triggers a bus message and status update.

**Implementation**:

**Handoff Contract**:
```jsonl
// AG-UI completes → triggers AG-DEVOPS deployment check
{"ts":"2025-10-30T14:00:00Z","from":"AG-UI","to":"AG-DEVOPS","type":"handoff","story":"US-0042","text":"UI component ready, requesting deployment to staging"}

// AG-INTEGRATIONS detects webhook failure → alerts AG-API
{"ts":"2025-10-30T14:05:00Z","from":"AG-INTEGRATIONS","to":"AG-API","type":"alert","story":"US-0078","text":"Stripe webhook health check failing (500 errors), needs investigation"}

// AG-SECURITY completes audit → unblocks AG-DEVOPS
{"ts":"2025-10-30T14:10:00Z","from":"AG-SECURITY","to":"AG-DEVOPS","type":"unblock","story":"US-0090","text":"Security audit passed, approved for production deployment"}
```

**Agent Updates**:
```diff
--- a/agents/agileflow-ui.md
+++ b/agents/agileflow-ui.md
@@ -280,6 +280,14 @@
    - Invoke `/AgileFlow:github-sync`
 17. Use `/AgileFlow:pr-template` command to generate PR description
 18. After merge: update status.json: status → done, sync externally
+19. **[HANDOFF]** If deployment required:
+    - Append bus message: `{"ts":"<ISO>","from":"AG-UI","to":"AG-DEVOPS","type":"handoff","story":"<US_ID>","text":"UI ready, requesting deployment to staging"}`
+    - AG-DEVOPS will pick up automatically via SessionStart hook
+20. **[HANDOFF]** If integration needed:
+    - Append bus message: `{"ts":"<ISO>","from":"AG-UI","to":"AG-INTEGRATIONS","type":"question","story":"<US_ID>","text":"Need Stripe checkout integration, see AC3"}`
```

**Validation** (optional command):
```bash
# /AgileFlow:validate-handoffs
# Checks recent handoffs in bus/log.jsonl
# Warns if no handoffs found (agents may not be coordinating)
```

---

### 3. Connectedness Dashboard (Auto-Generated)

**Current**: Data scattered across status.json, bus, ADRs, epics, CHANGELOG.

**New**: **Daily snapshot** combining all sources into one "living board."

**Implementation**:

**New Command**: `/AgileFlow:dashboard` or `/AgileFlow:connectedness`

```markdown
# AgileFlow Connectedness Dashboard
**Generated**: 2025-10-30 14:30:00 UTC
**Data Sources**: status.json (45 stories), bus/log.jsonl (128 messages), 12 ADRs, 8 epics, CHANGELOG v2.19.8

---

## 🎯 Current Focus
- **Epic**: EP-0003 "Payment Integration" (3/8 stories done, 62% complete)
- **Active Stories**: 8 in-progress (AG-API: 3, AG-UI: 2, AG-INTEGRATIONS: 2, AG-DEVOPS: 1)
- **Blockers**: 2 stories blocked (US-0078 waiting on Stripe API keys, US-0082 security review)

## 🏗️ What We're Building
- Payment checkout flow (US-0075 ✅, US-0076 ✅, US-0077 🔄)
- Webhook processing (US-0078 🚫 blocked, US-0079 pending)
- Refund system (US-0080 pending, US-0081 pending, US-0082 🚫 blocked)

## 📋 Key Decisions (Recent ADRs)
- **ADR-0012**: Use Stripe Payment Intents API (supersedes ADR-0008 Charges API) → Tech Debt: TD-042 (migrate old charges)
- **ADR-0013**: Implement idempotency with request IDs → Stories: US-0079, US-0080

## 📈 Recent Progress (Last 7 Days)
- ✅ 8 stories completed (AG-API: 3, AG-UI: 4, AG-CI: 1)
- 🔧 3 tech-debt items resolved (TD-038, TD-039, TD-041)
- 🚀 2 deployments to staging (v2.19.7, v2.19.8)
- 🔴 1 production incident (Stripe webhook timeout, resolved in 45min)

## ⚠️ Risks & Dependencies
- **External Dependency**: Stripe API keys pending (blocks US-0078, US-0082)
- **Tech Debt**: TD-042 migration needed before v3.0 release (45 story points)
- **Agent Handoff**: AG-INTEGRATIONS → AG-SECURITY (webhook signature validation)

## 🔜 Next Steps (Auto-Suggested)
1. Unblock US-0078: Request Stripe API keys via `/AgileFlow:context MODE=research TOPIC="Stripe test mode setup"`
2. Complete US-0077: AG-API merge pending, handoff to AG-UI for checkout UI
3. Schedule TD-042 migration: Create epic via `/AgileFlow:epic` (migration stories)
4. Security review: AG-SECURITY to audit US-0082 before production deployment
```

**Data Sources**:
- `docs/09-agents/status.json` - Story states, owners, dependencies
- `docs/09-agents/bus/log.jsonl` - Recent coordination (last 7 days)
- `docs/03-decisions/*.md` - ADRs (parse frontmatter for status, supersedes)
- `docs/05-epics/*.md` - Epic progress
- `CHANGELOG.md` - Recent releases
- `docs/08-quality/tech-debt.md` - Active tech debt

**Automation** (optional - users can add to their hooks):
```bash
# hooks/hooks.json - Generate dashboard on SessionStart
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "bash scripts/generate-dashboard.sh > docs/00-meta/DASHBOARD.md 2>&1 &"
        }
      ]
    }
  ]
}
```

---

### 4. Slash Verbs That Chain by Default

**Current**: Commands run in isolation.

**New**: **Auto-suggest next commands** based on context and outcomes.

**Implementation**:

**Command Chaining Examples**:

```markdown
# After /AgileFlow:adr-new completes
✅ ADR-0012 created: Use Stripe Payment Intents API

**Next Steps** (auto-suggested):
- `/AgileFlow:tech-debt` → Document migration from old Charges API (TD-042)
- `/AgileFlow:story` → Create implementation story for Payment Intents integration
- `/AgileFlow:context MODE=research TOPIC="Stripe Payment Intents best practices"`
```

```markdown
# After /AgileFlow:context MODE=full completes
✅ Research complete: Payment processing security best practices

**Next Steps** (auto-suggested):
- `/AgileFlow:adr-new` → Document PCI compliance decisions
- `/AgileFlow:github-sync` → Sync research findings to GitHub issue
- `/AgileFlow:notion DATABASE=research` → Save to Notion research database
```

```markdown
# After /AgileFlow:epic completes
✅ Epic EP-0005 created: Payment Integration (8 stories)

**Next Steps** (auto-suggested):
- `/AgileFlow:story-validate US-0075` → Validate first story before assignment
- `/AgileFlow:board` → Visualize epic progress
- `/AgileFlow:github-sync` → Create GitHub milestone for epic
```

**Implementation**:
```diff
--- a/commands/adr-new.md
+++ b/commands/adr-new.md
@@ -45,6 +45,17 @@
 5. Confirm with user before writing file
 6. Update ADR index (docs/03-decisions/README.md)
 7. Output success message with file path
+8. **[NEW]** Suggest next commands based on ADR content:
+   - If "Negatives" section has items → Suggest `/AgileFlow:tech-debt` to document migration/cleanup
+   - If "Supersedes" an old ADR → Suggest creating migration story
+   - If introduces new pattern → Suggest `/AgileFlow:story` to implement in codebase
+   - If mentions external research → Suggest `/AgileFlow:context MODE=research`
+
+   **Output format**:
+   ```
+   ✅ ADR-XXXX created successfully!
+
+   **Suggested next steps**:
+   - /AgileFlow:tech-debt → Document migration from [old pattern]
+   - /AgileFlow:story → Create implementation story
+   ```
```

---

### 6. Decisions Ripple Automatically

**Current**: ADRs are created, but follow-up work (tech debt, migration stories, changelog) is manual.

**New**: **Auto-generate** tech-debt items, migration stories, and changelog stubs when ADR is accepted.

**Implementation**:

**Workflow** (agileflow-adr-writer agent):
```markdown
## WORKFLOW

...existing steps...

8. **[NEW]** After ADR is written and confirmed:
   a. If "Negatives" section has items:
      - Auto-create tech-debt item: `TD-XXX: Migrate from [old decision] to [new decision]`
      - Link back to ADR: `Related ADR: ADR-XXXX`
      - Calculate priority score based on ADR status (Accepted = High Priority)

   b. If "Supersedes" another ADR:
      - Auto-create migration story: `US-XXXX: Migrate [component] from [old pattern] to [new pattern]`
      - Owner: Same as ADR author or AG-REFACTOR
      - Dependencies: Link superseded ADR

   c. If status = "Accepted":
      - Create changelog stub in CHANGELOG.md:
        ```markdown
        ## [Unreleased]

        ### Changed
        - **Architecture**: Implemented ADR-XXXX ([title]) - [brief description]
        ```

   d. Append bus message for coordination:
      ```jsonl
      {"ts":"2025-10-30T15:00:00Z","from":"ADR-WRITER","type":"status","adr":"ADR-0012","text":"ADR accepted, created TD-042 (migration) and US-0085 (implementation)"}
      ```
```

**Example Output**:
```markdown
✅ ADR-0012 created: Use Stripe Payment Intents API

**Ripple effects** (auto-generated):
1. Tech Debt: [TD-042](../08-quality/tech-debt.md#td-042) - Migrate from Charges API to Payment Intents
   - Priority: High (supersedes deprecated API)
   - Estimated effort: 13 story points

2. Migration Story: [US-0085](../06-stories/US-0085-migrate-charges-api.md) - Migrate existing charge processing
   - Owner: AG-REFACTOR
   - Dependencies: ADR-0012, TD-042

3. Changelog stub added: CHANGELOG.md (Unreleased → v2.20.0)

**Next steps**:
- Review TD-042 priority and estimate
- Assign US-0085 to AG-REFACTOR or AG-API
- Run `/AgileFlow:board` to see updated status
```

---

### 7. Mobile + Web: Shared System

**Current**: AG-MOBILE and AG-UI exist but coordination is implicit.

**New**: **Explicit coordination notes** for platform-specific nuances while sharing tokens/components.

**Implementation**:

**Platform Coordination Block** (added to stories):
```markdown
## Platform Coordination

**Web (AG-UI)**:
- Component: `PaymentCheckoutForm` (src/components/payment/)
- Tokens: Uses `colors.primary`, `spacing.md`, `typography.body`
- Accessibility: Keyboard nav, ARIA labels, screen reader tested

**Mobile (AG-MOBILE)**:
- Component: `PaymentCheckoutScreen` (src/screens/payment/)
- Tokens: **Same as Web** (colors.primary, spacing.md, typography.body)
- Platform nuances:
  - iOS: Use native payment sheet (Apple Pay)
  - Android: Use Google Pay integration
  - Fallback: Web-based checkout for other platforms

**Shared**:
- API endpoint: `POST /api/payments/checkout` (AG-API)
- Validation: Zod schema `paymentCheckoutSchema` (shared)
- Error handling: Same error codes (400, 401, 500)

**Coordination Notes**:
- AG-UI completes first → AG-MOBILE reuses component logic
- Design tokens must match exactly (visual consistency)
- Bus message when UI ready: `{"from":"AG-UI","to":"AG-MOBILE","type":"unblock","text":"Checkout UI complete, ready for mobile adaptation"}`
```

**Agent Updates**:
```diff
--- a/agents/agileflow-mobile.md
+++ b/agents/agileflow-mobile.md
@@ -45,6 +45,16 @@
 - Coordination with AG-UI (shared components, design tokens)
 - Coordination with AG-API (mobile-specific endpoints if needed)

+**AG-UI Coordination** (CRITICAL for consistency):
+- Check bus/log.jsonl for AG-UI completion before starting mobile work
+- Reuse component logic, tokens, validation schemas from Web
+- Platform-specific code only where necessary (native features, OS differences)
+- Example bus check:
+  ```bash
+  # Check if Web component ready
+  grep -A 2 '"from":"AG-UI".*"to":"AG-MOBILE"' docs/09-agents/bus/log.jsonl | tail -1
+  ```
+
 **Coordination Rules**:
 - Always check docs/09-agents/bus/log.jsonl (last 10 messages) before starting work
```

---

### 8. Compliance & Security: One Playbook

**Current**: AG-COMPLIANCE and AG-SECURITY have separate docs.

**New**: **Unified playbook** showing "who does what" with linked outputs.

**Implementation**:

**New Document**: `docs/02-practices/security-compliance-playbook.md`

```markdown
# Security & Compliance Playbook

**Owners**: AG-SECURITY (technical controls) + AG-COMPLIANCE (regulatory adherence)

---

## Who Does What

| Responsibility | Security (AG-SECURITY) | Compliance (AG-COMPLIANCE) | Outputs |
|----------------|------------------------|----------------------------|---------|
| **Threat Modeling** | Identify attack vectors, create threat models | Ensure threats mapped to regulatory controls (GDPR, HIPAA) | docs/09-security/threat-models/ |
| **Vulnerability Scanning** | Run SAST/DAST, dependency scans | Document scan cadence per regulation | docs/09-security/scan-results/ |
| **Incident Response** | Triage, mitigate, patch | Log for audit trail, report breaches per GDPR Art. 33 | docs/09-security/incidents/, docs/11-compliance/breach-logs/ |
| **Access Control** | Implement RBAC, auth policies | Verify against least-privilege requirements | docs/04-architecture/auth-spec.md, docs/11-compliance/access-matrix.md |
| **Audit Trails** | Configure logging (who/what/when) | Ensure logs meet retention requirements (7 years HIPAA, etc.) | docs/11-compliance/audit-logs/ |
| **Penetration Testing** | Conduct/coordinate pen tests | Schedule per compliance timeline (annual for PCI-DSS) | docs/09-security/pen-test-reports/ |

---

## Coordination Protocol

**AG-SECURITY → AG-COMPLIANCE**:
```jsonl
{"ts":"2025-10-30T16:00:00Z","from":"AG-SECURITY","to":"AG-COMPLIANCE","type":"handoff","text":"Quarterly vulnerability scan complete, 3 high-severity findings remediated, report attached"}
```

**AG-COMPLIANCE → AG-SECURITY**:
```jsonl
{"ts":"2025-10-30T16:15:00Z","from":"AG-COMPLIANCE","to":"AG-SECURITY","type":"question","text":"GDPR audit requires MFA for admin access - can we implement by Q4?"}
```

---

## Incident Runbook (Joint Ownership)

1. **Detection** (AG-SECURITY): Monitor alerts, triage severity
2. **Containment** (AG-SECURITY): Isolate affected systems, patch vulnerability
3. **Documentation** (AG-COMPLIANCE): Log incident details, timeline, affected data
4. **Notification** (AG-COMPLIANCE): Report breach per GDPR/HIPAA timeline (72h/60 days)
5. **Post-Mortem** (Both): Root cause analysis, preventive measures
6. **ADR** (AG-SECURITY): Document architectural changes from incident

**Linked Outputs**:
- Incident log: `docs/09-security/incidents/INC-YYYY-MM-DD.md`
- Compliance report: `docs/11-compliance/breach-reports/BR-YYYY-MM-DD.md`
- Post-mortem ADR: `docs/03-decisions/ADR-XXXX-incident-prevention.md`
```

---

### 9. Story Crafting Feels Guided

**Current**: User describes feature → manually create epic → manually create stories.

**New**: **Auto-propose epic** with success metrics, stories, owners, dependencies, then one-click create.

**Implementation**:

**Enhanced `/AgileFlow:epic` command**:

```markdown
User: "I need payment processing with Stripe"

Assistant (agileflow-epic-planner):
```
🎯 Epic Preview: Stripe Payment Integration

**Success Metrics**:
- Users can complete checkout in <30 seconds
- Payment success rate >95%
- Zero stored credit card data (PCI compliance)
- Support refunds and disputes

**Proposed Stories** (8 total, 34 story points):

1. **US-0075**: Payment checkout UI (AG-UI, 5 points)
   - Owner: AG-UI
   - Dependencies: None
   - AC: User can enter card details, see validation errors, submit payment

2. **US-0076**: Stripe Payment Intent API integration (AG-API, 8 points)
   - Owner: AG-API
   - Dependencies: ADR needed (Payment Intents vs Charges API)
   - AC: Backend creates payment intent, handles 3D Secure, returns client secret

3. **US-0077**: Webhook processing (AG-INTEGRATIONS, 5 points)
   - Owner: AG-INTEGRATIONS
   - Dependencies: US-0076 (needs API endpoints)
   - AC: Receive payment.succeeded webhook, update order status, send confirmation email

4. **US-0078**: Refund flow (AG-API, 3 points)
   - Owner: AG-API
   - Dependencies: US-0076
   - AC: Admin can issue full/partial refund, updates reflected in dashboard

5. **US-0079**: Payment security audit (AG-SECURITY, 2 points)
   - Owner: AG-SECURITY
   - Dependencies: US-0076, US-0077
   - AC: PCI DSS checklist validated, no card data stored, TLS enforced

6. **US-0080**: Payment analytics dashboard (AG-UI, 5 points)
   - Owner: AG-UI
   - Dependencies: US-0076, US-0077
   - AC: Admin sees revenue, success rate, failed payments, refunds

7. **US-0081**: E2E payment tests (AG-CI, 3 points)
   - Owner: AG-CI
   - Dependencies: US-0075, US-0076
   - AC: Playwright tests cover success, failure, 3D Secure flows

8. **US-0082**: Production deployment (AG-DEVOPS, 3 points)
   - Owner: AG-DEVOPS
   - Dependencies: US-0079 (security audit must pass)
   - AC: Deployed to prod with feature flag, monitoring alerts configured

**Create this epic?** (YES/NO)
- YES → Creates EP-0005, all 8 stories, updates status.json, syncs to GitHub/Notion
- NO → Revise and show again
```

**After YES**:
```markdown
✅ Epic EP-0005 created: Stripe Payment Integration

**Files created**:
- docs/05-epics/EP-0005-payment-integration.md
- docs/06-stories/US-0075-payment-checkout-ui.md
- docs/06-stories/US-0076-stripe-payment-intent-api.md
- ... (6 more story files)
- docs/07-testing/test-cases/US-0075.md (test stubs for all)

**Status.json updated**:
- 8 stories added (status: ready)
- Dependencies linked (US-0077 blocks on US-0076, etc.)

**External sync**:
- GitHub: Milestone "Payment Integration" created with 8 issues
- Notion: Epic added to product roadmap

**Next steps** (auto-suggested):
1. `/AgileFlow:adr-new` → Document Payment Intents vs Charges API decision
2. `/AgileFlow:story-validate US-0075` → Validate first story before AG-UI starts
3. `/AgileFlow:board` → Visualize epic progress
4. `/AgileFlow:context MODE=research TOPIC="Stripe Payment Intents security best practices"`
```

---

## Implementation Roadmap

### Phase 1: Foundation (v2.20.0 - 1 week)
**Goal**: Establish cross-linking and command chaining

- [ ] **Cross-Links as First-Class** (Rule #1)
  - Update templates (ADR, story, tech-debt) with mandatory Links blocks
  - Update skills/agents to enforce linking
  - Create `/AgileFlow:validate-links` command
  - Estimated: 3 days

- [ ] **Command Chaining** (Rule #4)
  - Update commands to suggest next steps
  - Implement suggestion logic in key commands (adr-new, epic, chatgpt)
  - Estimated: 2 days

**Deliverable**: Cross-links enforced, commands chain logically

---

### Phase 2: Agent Coordination (v2.21.0 - 1 week)
**Goal**: Automate agent handoffs and platform coordination

- [ ] **Unified Handoff Protocol** (Rule #2)
  - Update all 27 subagents with handoff patterns
  - Standardize bus message format
  - Create `/AgileFlow:validate-handoffs` command
  - Estimated: 4 days

- [ ] **Mobile/Web Coordination** (Rule #6)
  - Update AG-MOBILE and AG-UI with coordination blocks
  - Add platform coordination to story template
  - Estimated: 2 days

- [ ] **Security/Compliance Playbook** (Rule #7)
  - Create `docs/02-practices/security-compliance-playbook.md`
  - Update AG-SECURITY and AG-COMPLIANCE with coordination
  - Estimated: 1 day

**Deliverable**: Agents coordinate automatically via bus, platform collaboration documented

---

### Phase 3: Auto-Generation (v2.22.0 - 2 weeks)
**Goal**: Auto-generate artifacts and provide big-picture view

- [ ] **Connectedness Dashboard** (Rule #3)
  - Create `/AgileFlow:dashboard` command
  - Create `scripts/generate-dashboard.sh`
  - Add optional SessionStart hook template
  - Estimated: 5 days

- [ ] **ADR Ripple Effects** (Rule #5)
  - Update agileflow-adr-writer to auto-create tech-debt, stories, changelog
  - Add ripple effect validation
  - Estimated: 4 days

- [ ] **Guided Epic Creation** (Rule #8)
  - Update agileflow-epic-planner with auto-proposal
  - Add preview + one-click create workflow
  - Estimated: 4 days

**Deliverable**: Dashboard shows system state, ADRs trigger follow-up work, epic creation is guided

---

## Success Metrics

After full implementation, AgileFlow should achieve:

**Connectedness Metrics**:
- ✅ **100% cross-linked artifacts** - Every ADR links stories, every story links test, every changelog links issues
- ✅ **Zero orphaned stories** - No stories without test stubs or acceptance criteria
- ✅ **Agent handoffs logged** - All agent transitions recorded in bus/log.jsonl
- ✅ **Auto-generated artifacts** - ADRs create tech-debt + stories, epics propose full story sets
- ✅ **Commands suggest next steps** - Every command completion shows what to do next

**Developer Experience**:
- ⏱️ **50% faster story creation** - Guided epic creation auto-proposes stories with owners
- 🔗 **Instant context** - Dashboard shows "what we're building, where we are, what's next"
- 🤝 **Automatic coordination** - Agents hand off via bus messages, no manual status updates
- 🔍 **Validated setup** - MCP health check catches configuration issues early
- 📊 **Visible progress** - Connectedness dashboard updated on demand or via hook

**System Health**:
- 🔍 **Traceable decisions** - Every feature links back to ADR, every ADR links forward to implementation
- 📈 **Measurable velocity** - Dashboard tracks story completion, tech debt reduction, epic progress
- 🔔 **Proactive suggestions** - Commands chain logically, showing next best action
- 🔐 **Security/compliance integrated** - Not siloed, part of unified workflow with clear handoffs

---

## Example: Full Connectedness Flow

Let's trace a feature from idea to deployment showing all 9 rules in action:

### 1. User Request
```
User: "We need to add two-factor authentication"
```

### 2. Guided Epic Creation (Rule #9)
```
Assistant: 🎯 Epic Preview: Two-Factor Authentication

**Success Metrics**:
- 95% of users enable 2FA within 30 days
- Zero account takeovers for 2FA users
- <10 seconds to set up TOTP

**Proposed Stories** (6 total, 21 story points):
1. US-0090: Research 2FA options (AG-RESEARCH, 2 points)
2. US-0091: ADR for TOTP vs SMS (AG-MENTOR, 1 point)
3. US-0092: TOTP backend implementation (AG-API, 5 points)
4. US-0093: 2FA setup UI with QR code (AG-UI, 5 points)
5. US-0094: Security audit (AG-SECURITY, 3 points)
6. US-0095: E2E tests (AG-CI, 5 points)

**Create?** YES
```

### 3. ADR Created with Ripple Effects (Rule #6)
```
✅ ADR-0015 created: Use TOTP for Two-Factor Authentication

**Ripple effects** (auto-generated):
- Tech Debt: TD-045 - Deprecate SMS-based 2FA fallback (priority: medium)
- Implementation: US-0092 (already created in epic)
- Changelog: Stub added to CHANGELOG.md (v2.23.0)

**Links block** (Rule #1):
Supersedes: None
Related Stories: US-0092, US-0093
Tech Debt: TD-045
Informs: CHANGELOG v2.23.0
```

### 4. Agent Handoff (Rule #2)
```
AG-API completes US-0092, appends bus message:
{"ts":"2025-11-05T10:00:00Z","from":"AG-API","to":"AG-UI","type":"handoff","story":"US-0092","text":"TOTP backend complete, API endpoint /api/auth/totp ready, unblocking US-0093"}

AG-UI picks up automatically via SessionStart hook, sees handoff, starts US-0093
```

### 5. Command Chaining (Rule #4)
```
✅ Epic EP-0008 complete: Two-Factor Authentication (6/6 stories done)

**Suggested next steps**:
- `/AgileFlow:dashboard` → View updated system state
- `/AgileFlow:github-sync` → Sync completion to GitHub
- `/AgileFlow:context MODE=research TOPIC="2FA recovery codes best practices"` → Research next iteration
```

### 6. Connectedness Dashboard (Rule #3)
```
# AgileFlow Connectedness Dashboard
**Generated**: 2025-11-05 14:00:00 UTC

## 🎯 Current Focus
- Epic EP-0008 "Two-Factor Authentication" ✅ COMPLETE (6/6 stories, 100%)
- Active Stories: 0 in-progress, 12 ready, 2 blocked

## 📋 Key Decisions
- ADR-0015: Use TOTP for 2FA (accepted) → TD-045 (deprecate SMS fallback)

## 📈 Recent Progress
- ✅ 6 stories completed this week (EP-0008 delivered)
- 🔧 1 tech-debt item created (TD-045 from ADR-0015)
- 🚀 Deployed v2.23.0 to production

## 🔜 Next Steps
1. Start EP-0009: User profile enhancements (8 stories ready)
2. Address TD-045: Deprecate SMS 2FA (5 story points)
3. Research: 2FA recovery codes (suggested by epic completion)
```

### 7. Security/Compliance Handoff (Rule #8)
```
AG-UI → AG-SECURITY:
{"from":"AG-UI","to":"AG-SECURITY","type":"question","text":"2FA UI complete, can you audit US-0094 before prod deployment?"}

AG-SECURITY completes audit:
{"from":"AG-SECURITY","to":"AG-DEVOPS","type":"unblock","text":"US-0094 security audit passed, approved for prod deployment"}
```

### 8. Validation Commands (Optional)
```
User runs validation:

/AgileFlow:validate-links
✅ All stories have test stubs
✅ ADR-0015 links US-0092, US-0093
✅ Changelog v2.23.0 references ADR-0015, US-0092
✅ Cross-references valid (no broken links)

/AgileFlow:validate-handoffs
✅ Found 6 handoffs in bus (agents coordinating properly)

/AgileFlow:mcp-check
✅ GitHub MCP configured and token present
✅ Notion MCP configured and token present
✅ MCP setup validated - external sync ready!
```

---

## What Changed from v1.0?

**Removed (5 rules)** - These assumed AgileFlow controls user CI pipeline or MCP setup:
- ❌ Definition-of-Ready CI enforcement
- ❌ README-as-UI Contract CI gates
- ❌ Design→Dev→CI quality checklist enforcement
- ❌ CI enforces connectedness validation
- ❌ MCP health check (setup validation - removed for context efficiency)

**Kept (8 rules)** - These fit AgileFlow's scope as a plugin:
- ✅ Cross-links (templates, commands, validation)
- ✅ Agent handoffs (bus/status.json coordination)
- ✅ Dashboard (data aggregation from docs)
- ✅ Command chaining (UX suggestions)
- ✅ ADR ripples (auto-generate artifacts)
- ✅ Mobile/Web coordination (platform guidance)
- ✅ Security/Compliance playbook (specialized docs)
- ✅ Guided epic creation (workflow improvement)

**Key Insight**: AgileFlow is a **coordination layer**, not a **enforcement layer**. It:
- ✅ Provides workflows, suggestions, validation commands
- ✅ Coordinates agents via status.json and bus/log.jsonl
- ✅ Auto-generates artifacts from decisions
- ❌ Does NOT control user's CI/CD pipeline
- ❌ Does NOT enforce gates in arbitrary tech stacks

---

## Next Steps

1. **Review this revised playbook** - Does it fit AgileFlow's actual scope?
2. **Prioritize 3-5 rules** for initial implementation
3. **Prototype one rule** - Start with Rule #1 (cross-links) or Rule #4 (command chaining)
4. **Create implementation epic** - Turn roadmap into actionable stories

**Want me to**:
- ✅ Create epic for Phase 1 (cross-links + command chaining + MCP check)?
- ✅ Prototype Rule #1 with example template updates?
- ✅ Create `/AgileFlow:validate-links` command as MVP?
- ✅ Update CHANGELOG.md to document this as v2.20.0 roadmap?

---

**This playbook transforms AgileFlow from "collection of tools" to "one living system" where everything connects, updates flow automatically, and next steps are always suggested—within the realistic scope of what a plugin can actually do.**
