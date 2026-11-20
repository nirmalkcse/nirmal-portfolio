# Portfolio V1 Implementation Brief

Status: Canonical V1 build brief
Created: 2026-05-30
Source docs:
- `docs/world-class-portfolio-site-blueprint.md`
- `docs/professional-language-and-standout-ideas.md`

## Purpose

Build a focused, credible portfolio for Nirmal Kumar that helps recruiters, engineers, academic reviewers, and leaders understand the work quickly and inspect the evidence behind important claims.

The portfolio should feel like a professional product about reliable data work, not a digital resume or a design experiment. The first version should prioritize clarity, proof, speed, accessibility, and maintainability.

## Core Positioning

Primary public hook:

```text
Building reliable data systems from messy enterprise context.
```

Supporting line:

```text
Data Engineer focused on Microsoft Fabric, Databricks, SQL, PySpark,
Power BI, and validation-led migration work.
```

Professional bio:

```text
I care about the quiet engineering work that makes data useful:
clear pipelines, traceable decisions, reliable validation, and
documentation that helps teams trust what they ship.
```

Use this idea internally:

```text
Nirmal proves skills through work evidence.
```

Avoid making the public copy sound like a courtroom, a startup pitch, or a novelty interface. Use "proof" only where it earns its place.

## V1 Outcome

V1 is successful when a visitor can answer these questions within one minute:

- Who is Nirmal?
- What kind of roles or opportunities fit him?
- What are his strongest technical areas?
- Which three projects best prove the work?
- Which outcomes are measurable?
- Which credentials are verifiable?
- Where are the resume, LinkedIn, GitHub, and contact routes?
- What evidence is public, summarized, or withheld for confidentiality?

## V1 Scope

Ship these first:

- Homepage hero
- One-minute review section
- Three project case studies
- Resume and documents section
- Credentials section with verification links
- Contact section
- Lean skills section
- Evidence notes on important claims and case studies
- Mobile responsive layout
- Accessibility baseline
- Performance baseline
- SEO metadata

Defer these until the core site is credible:

- Interactive proof graph
- Full role-lens system
- Command palette
- No Fluff Mode
- Future Lab
- Human footnotes
- Heavy cinematic or 3D visual systems
- Large content archive

Do not build hidden or clever navigation before resume, work, credentials, and contact are obvious.

## Information Architecture

Use a compact V1 navigation:

- `Work`
- `Skills`
- `Credentials`
- `Resume`
- `Contact`

Optional secondary links:

- `Profile`
- `Research`
- `Site notes`

Avoid showing nav items for pages that do not exist yet. If a section is not ready, keep it out of primary navigation.

## Homepage Structure

The homepage should do the most career work.

Recommended order:

1. Hero
2. One-minute review
3. Selected work
4. Lean skills
5. Credentials
6. Resume and documents
7. Short professional profile
8. Contact close

### Hero

Must include:

- `Nirmal Kumar`
- role line
- primary hook
- short supporting line
- three to five proof chips
- primary CTA to work
- secondary CTA to resume
- contact route visible without hunting

Suggested hero copy:

```text
Nirmal Kumar
Building reliable data systems from messy enterprise context.

Data Engineer focused on Microsoft Fabric, Databricks, SQL, PySpark,
Power BI, and validation-led migration work.
```

Suggested proof chips:

```text
90% fewer validation discrepancies
18-24 daily incremental tables supported
15+ migrated BI reports validated
6 Tableau reports moved to Power BI
9.11/10 CSE CGPA
```

Each proof chip must map to an evidence note before launch.

Suggested CTAs:

```text
View selected work
Open resume
Contact Nirmal
```

Avoid public CTA labels like `Follow the Proof Path` for V1.

### One-Minute Review

Purpose: Give busy reviewers a fast, respectful route.

Content:

- role fit
- top technical areas
- top three outcomes
- current role or current focus
- strongest credentials
- resume link
- LinkedIn and GitHub links
- contact link

Suggested label:

```text
One-minute review
```

Do not make this an overlay in V1 unless the implementation is simple and accessible. A compact section is enough.

### Selected Work

Use `Selected work` or `Project case studies` as the public label.

Show three primary case studies:

- Fabric migration or lakehouse work
- BI validation or report migration work
- Databricks-backed product or entity-resolution workflow

Each case study card should include:

- one-line project summary
- role
- stack
- outcome
- evidence status
- CTA: `Read case study`

Keep each card scannable in under five seconds.

## Case Study Template

Use this structure for each V1 project:

1. Title
2. One-sentence summary
3. Role and ownership boundary
4. Context and confidentiality boundary
5. Problem
6. System or workflow
7. Key decisions
8. Tradeoffs
9. Outcome
10. Evidence note
11. Reflection
12. Related skills and credentials

Use this copy formula:

```text
Outcome or scope + method + context.
```

Examples:

```text
Reduced BI validation discrepancies by 90% through SQL-based
reconciliation and report-level parity checks.
```

```text
Supported 18-24 daily incremental tables in a Microsoft Fabric
migration PoC using metadata-driven ingestion and Delta processing.
```

For sensitive work, use this formula:

```text
What can be said + what is withheld + why.
```

Example:

```text
This case study uses sanitized architecture notes and anonymized scope
metrics because the original implementation involved internal enterprise
systems.
```

## Evidence Notes

Every major claim needs an evidence note.

Use this model:

```text
Claim:
Evidence type:
Source:
Public status:
Confidence:
Related project:
Confidentiality boundary:
```

Evidence types:

- metric
- project detail
- credential URL
- publication link
- code or demo link
- sanitized diagram
- screenshot
- testimonial or recommendation
- learning or reflection note

Public status labels:

- `Publicly verifiable`
- `Sanitized for confidentiality`
- `Summarized from internal work`
- `Credential verified`
- `Evidence still being collected`
- `Planned public artifact`

Do not publish fake metrics, private architecture, proprietary screenshots, secrets, client data, or unverifiable bragging.

## Lean Skills Section

Purpose: Replace generic skill lists with evidence-backed competence.

Recommended groups:

- Data engineering: Microsoft Fabric, Databricks, Delta Lake, PySpark, SQL
- Analytics and BI: Power BI, MicroStrategy validation, Tableau migration, KPI reconciliation
- Cloud and platform: Azure ecosystem, lakehouse architecture, orchestration, governance
- Product engineering: audit logs, RBAC, explainability, review workflows, documentation
- Professional skills: communication, teamwork, problem solving, analytical reasoning

For each skill or group, show:

- status: `Used in production`, `Used in PoC`, or `Learning`
- related project
- one concrete example

Avoid percentage skill bars and logo clouds without context.

## Credentials

Purpose: Make credentials easy to verify.

Each credential should show:

- credential name
- issuer
- date
- status
- verification URL
- related skills
- related project evidence when available

Suggested public copy:

```text
Credential verification with clear status labels.
```

Status labels:

- `Verified`
- `Expired`
- `Pending`
- `Indirectly supported`

## Resume And Documents

Purpose: Let reviewers get the right artifact quickly.

V1 should include:

- one-page resume PDF
- LinkedIn
- GitHub
- credential links
- optional academic or proof packet placeholder only if clearly labeled as planned

Use labels like:

- `Resume`
- `Supporting documents`
- `Available now`
- `Planned export`

Avoid vague phrases like `document flows` or unfinished packet concepts that sound shipped.

## Contact

Contact should be direct and low-friction.

Include:

- email or contact form
- LinkedIn
- GitHub
- location or time zone
- availability note

Suggested close:

```text
Need someone who can make data easier to validate, maintain, and trust?
Start with the resume, then open the case studies.
```

## Writing Rules

The public voice should be calm, evidence-led engineering writing with a human pulse.

Use more:

- validated
- documented
- delivered
- supported
- reduced
- mapped
- built
- maintained
- designed
- migrated
- reconciled
- governed
- reviewed
- measured
- publicly verifiable
- sanitized
- confidentiality boundary

Use less:

- signal
- surface
- dossier
- routeable
- inspectable
- high-fidelity
- proof path
- proof ledger
- lens
- hand-waving
- systems under pressure
- future tracks
- portfolio-ready
- claim

Better labels:

| Avoid | Use |
|---|---|
| `Follow the Proof Path` | `View selected work` |
| `Open Case Files` | `Read case studies` |
| `Role Lens` | `Reviewer view` or omit in V1 |
| `Claim Receipts` | `Evidence notes` |
| `Proof ledger` | `Work evidence` |
| `public-safe` | `sanitized for confidentiality` |
| `future tracks` | `current learning and upcoming work` |

Avoid:

- `world-class`, `elite`, `visionary`, or `10x` in public copy
- generic passion statements
- jokes that distract from credibility
- fake AI chatbots without strict source grounding
- overuse of "proof"

Every sentence should pass this test:

```text
Would a senior engineer, recruiter, or professor believe this is specific,
honest, and useful?
```

## Visual Direction

Mood:

- calm
- precise
- premium
- technical
- human

Use:

- warm white or neutral background
- graphite text
- muted secondary text
- one restrained accent for evidence links or progress
- real diagrams, sanitized screenshots, credential visuals, and system maps

Avoid:

- random abstract tech backgrounds
- heavy decorative 3D
- huge skill-logo clouds
- nested cards
- scroll-jacking
- autoplay audio
- visual gimmicks that hide resume, work, or contact

The site can be visually memorable, but the memory should come from clarity, evidence, and craft.

## Accessibility Baseline

V1 must support:

- semantic headings
- keyboard navigation
- visible focus states
- useful link text
- alt text for informative images
- sufficient color contrast
- mobile tap targets
- reduced-motion support
- no critical text embedded only in images
- accessible fallbacks for diagrams or visual evidence

Manual checks:

- keyboard-only navigation
- 390px mobile width
- 200% browser zoom
- reduced motion
- Lighthouse accessibility pass

## Performance Baseline

Targets:

- LCP: 2.5s or better
- INP: 200ms or better
- CLS: 0.1 or lower

Implementation guidance:

- optimize images
- use responsive image sizes
- reserve layout dimensions for media
- lazy-load noncritical visuals
- keep heavy animation optional
- avoid animating blur, layout, and heavy filters
- preload the hero image only if it is the LCP element

Performance is part of credibility. A premium portfolio should feel fast and stable.

## SEO And Sharing

V1 should include:

- unique page titles
- meta descriptions
- clean URLs
- sitemap
- robots.txt
- canonical URLs
- Open Graph image
- structured data for `Person`
- useful image alt text
- last updated date

Suggested title:

```text
Nirmal Kumar - Data Engineer | Fabric, Databricks, BI Validation
```

Suggested meta description:

```text
Data engineering portfolio of Nirmal Kumar, focused on Microsoft Fabric,
Databricks, SQL, PySpark, Power BI, validation-led migration work,
credentials, and evidence-backed project outcomes.
```

## Launch Acceptance Checklist

Before launch, confirm:

- hero explains value in ten seconds
- one-minute review is visible near the top
- resume is reachable from hero and navigation
- contact is reachable from hero, navigation, and footer
- three case studies are complete enough to trust
- each major metric has an evidence note
- confidential work is sanitized and clearly labeled
- credentials have verification links or status labels
- skill claims link to project or credential evidence
- no nav item points to an unfinished page
- no broken links
- no placeholder public copy
- no fake metrics
- no inaccessible interaction traps
- mobile layout is readable
- reduced motion works
- performance is acceptable on mobile
- last updated date is visible

## Build Order

1. Normalize public copy and navigation labels.
2. Build or revise homepage hero.
3. Add one-minute review section.
4. Create three case study data entries.
5. Add evidence notes for metrics and confidential work.
6. Tighten skills into evidence-backed groups.
7. Verify credentials and document links.
8. Simplify contact and footer.
9. Run accessibility, responsive, and performance checks.
10. Defer advanced interactions until V1 is already useful.

## What To Do Next

Use this brief as the source of truth for implementation. The next practical step is to audit the current app against the V1 scope, then update route labels, homepage copy, project cards, and evidence notes before adding new features.
