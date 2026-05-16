# Nirmal Kumar Portfolio: Comprehensive Build Plan

> Archive/reference note: this was the original single-file plan. Future sessions should use the structured documentation hierarchy starting at [README.md](README.md), with progress in [progress-tracker.md](tracking/progress-tracker.md), learnings in [session-learnings.md](learnings/session-learnings.md), and per-session files in [sessions](sessions/README.md).

Last updated: 2026-05-16

## 1. North Star

Build a premium, cinematic, Apple-like minimal portfolio for Nirmal Kumar that feels less like a resume page and more like a polished professional product experience.

The portfolio should communicate a hybrid identity:

- Data Engineer
- AI / ML Engineer
- Cloud Engineer
- Software Engineer
- Systems thinker

The experience should be memorable, tactile, elegant, and unusually satisfying to use, while staying professional enough for recruiters, engineers, hiring managers, and technical leaders.

## 2. Core Creative Positioning

### Recommended Concept

**Cinematic Engineering Dossier**

The site behaves like a refined product interface that lets visitors inspect Nirmal's career, proof, projects, credentials, and future direction through different professional lenses.

It should feel:

- Apple-like in restraint and polish
- Luxurious without looking decorative or loud
- Cinematic without becoming theatrical
- Data-rich without feeling like a dashboard template
- Memorable without using gimmicks
- Professional enough to send to recruiters, leaders, and senior engineers

### Why This Direction

A mere portfolio usually shows sections: About, Skills, Projects, Resume, Contact.

This portfolio should do more. It should create a guided professional experience:

- Let visitors choose a viewing mode
- Reorder the story based on their intent
- Reveal proof progressively
- Show career momentum visually
- Connect every skill to evidence
- Make credentials and projects feel verified and inspectable
- Give users satisfying microinteractions at every step

## 3. Strategic Experience Decision

### Recommended Site Shape

Use a **cinematic homepage plus structured deep-dive pages**.

This gives the most professional result.

#### Homepage

The homepage acts as the premium first impression and guided narrative:

- Cinematic identity reveal
- Soft role gateway / viewer lens
- Hybrid positioning
- Selected proof graph
- Featured projects
- Career timeline preview
- Certification console preview
- Social profile dock
- Resume and contact CTA

#### Deep-Dive Pages

Separate pages provide professional depth without overloading the homepage:

- `/projects`
- `/projects/[slug]`
- `/certifications`
- `/timeline`
- `/profile`
- `/resume`
- `/documents`

#### Why Not Single Page Only

A single-page site can feel impressive, but complex professional content often becomes hard to scan. A hybrid structure gives cinematic impact plus serious credibility.

## 4. Role-Based Viewing Model

Default viewer roles:

1. **Recruiter**
   - Prioritizes summary, impact, resume, certifications, role fit, contact.
   - Shows clear CTA: download resume, view LinkedIn, contact.

2. **Engineer**
   - Prioritizes stack, architecture, code, GitHub, problem solving, tradeoffs.
   - Shows project case files and technical diagrams earlier.

3. **Leader**
   - Prioritizes business outcomes, ownership, reliability, cloud/data impact, communication.
   - Shows metrics, systems thinking, project outcomes, leadership signals.

4. **Explorer**
   - Prioritizes personality, full journey, experiments, future projects, hidden interactions.
   - Shows the richest cinematic experience.

### Recommended Behavior

The role gateway should not block the site permanently.

Recommended interaction:

- First visit opens with the cinematic hero, so the first impression is immediate and premium.
- The role gateway appears as a soft intro section after the hero, framed as "Choose your lens."
- Visitor can choose a role or continue with the default full experience.
- Role can be changed from a subtle top control.
- Selected role changes ordering, emphasis, CTA labels, and visible details.

This keeps the idea memorable without creating friction before the portfolio has made its first impression.

## 5. Research-Backed Design Psychology

The goal is not manipulative addiction. The goal is ethical memorability and professional fascination.

### Aesthetic-Usability Effect

Research from Nielsen Norman Group and Laws of UX describes how attractive interfaces are often perceived as more usable. For this portfolio, beauty is not surface decoration; it should make the experience feel orderly, trustworthy, and premium.

Implementation:

- Refined spacing
- Minimal palette
- High-quality typography
- Carefully staged reveals
- Clean hierarchy
- No clutter

### Motion With Purpose

Nielsen Norman Group's guidance on UX animation is clear: motion should be brief, subtle, communicative, and useful for feedback, state changes, and navigation metaphors.

Implementation:

- Motion shows what changed.
- Motion confirms user actions.
- Motion helps users understand where they are.
- Motion avoids constant distraction.
- Major cinematic scenes happen only at intentional narrative moments.

### Peak-End Rule

People remember the emotional high point and the ending more than every individual moment.

Implementation:

- Create one unforgettable peak: the cinematic identity reveal or proof graph.
- Create a strong ending: final contact/resume CTA that feels like a closing title card.
- Avoid making every section equally loud.

### Von Restorff Effect

Distinctive items are remembered more easily.

Implementation:

- Give one signature visual device to the site: the **Gold Thread**.
- Use distinctive treatment for the strongest proof points.
- Avoid highlighting everything.

### Serial Position Effect

People tend to remember the first and last items in a sequence.

Implementation:

- Start with hybrid identity and strongest credibility.
- End with resume/contact/social links.
- Put secondary details in the middle or deep-dive pages.

### Doherty Threshold

Fast feedback keeps users engaged. Interaction feedback should generally feel immediate.

Implementation:

- Hover and tap feedback within 100-200ms.
- Larger state transitions under 400ms where possible.
- Cinematic scroll scenes can be slower because the user controls them.

### Virality / Shareability

Jonah Berger's STEPPS model highlights social currency, triggers, emotion, public visibility, practical value, and stories as drivers of sharing.

Application to portfolio:

- Social currency: make the site feel impressive enough that people want to say "look at this portfolio."
- Triggers: create a recognizable signature motif, such as the Gold Thread or Proof Graph.
- Emotion: give visitors a sense of polish, momentum, and discovery.
- Public: make credentials and links easy to verify and share.
- Practical value: recruiters and engineers can quickly find what they need.
- Stories: projects should be told as problem -> system -> impact, not just cards.

## 6. Signature Experience Features

### P0: Must-Have Signature Features

These define the site and should be built first.

#### 1. Personal Brand Mark And Wordmark

Create a recognizable identity system for Nirmal, not only a decorative logo.

Recommended direction:

- **Primary mark:** `NK` monogram built from a refined gold thread and branching data-path geometry.
- **Wordmark:** `Nirmal Kumar` in a precise Apple-like sans-serif with one custom typographic detail.
- **Signature motif:** the vertical stroke of `N` becomes the Gold Thread used throughout the site.
- **Submark:** simplified `NK` or single `N` symbol for favicon, social avatar, loading state, and mobile nav.

Why this can be memorable:

- It is simple enough to recognize at small sizes.
- It ties directly into the site's Gold Thread interaction.
- It suggests data paths, engineering structure, and forward motion without becoming literal.
- It works as a professional personal brand, not a gimmick.

Rules:

- Must work in one color.
- Must work at 16px favicon size.
- Must work on black, ivory, and transparent backgrounds.
- Must not try to encode every skill into the mark.
- Must feel premium before it feels clever.

#### 2. Role Gateway

A premium "Who's viewing?" soft intro inspired by profile selection, but made professional and elegant.

Placement:

- Appears after the cinematic hero rather than before it.
- Does not block access to the portfolio.
- Lets the visitor pick a professional lens once the site has already established its premium identity.

Suggested roles:

- Recruiter
- Engineer
- Leader
- Explorer

Visual direction:

- Minimal cards
- Gold outline on hover
- Smooth reveal
- No cartoon avatars
- Each role has a symbol, not a character

#### 3. Cinematic Identity Reveal

Hero section where the name, hybrid identity, and proof elements assemble as the user scrolls.

Possible sequence:

1. Dark field with faint gold line.
2. Name appears with restrained typography.
3. Role phrase resolves: "Hybrid Data, AI, Cloud & Software Engineer."
4. Micro-nodes appear for GitHub, LeetCode, Microsoft Learn, Databricks.
5. Lines connect into a refined system diagram.
6. CTA layer appears: View Work, Download Resume, Open Profiles.

#### 4. Gold Thread

A thin gold progress line that travels through the page and lights up sections.

Purpose:

- Scroll progress
- Narrative continuity
- Signature visual memory
- Premium tactile feel

#### 5. Proof Graph

A graph that connects skills to evidence.

Example:

- Azure -> Microsoft credential -> cloud project -> resume bullet
- Databricks -> credential -> data engineering project -> architecture diagram
- Python -> ML project -> GitHub repo -> measurable outcome
- SQL -> data modeling -> dashboard/reporting outcome

This is one of the most distinctive portfolio ideas and should be prioritized.

#### 6. Career Timeline Instrument

A scroll-driven career timeline that feels like a precision instrument, not a static chart.

Tracks:

- Education
- Work
- Certifications
- Projects
- Planned future projects

Behavior:

- Year marker follows scroll.
- Items glide into focus.
- Hover/tap opens details.
- Mobile version becomes vertical.

#### 7. Certification Console

A premium verification console for achievements.

Initial known credentials:

- Microsoft Learn credential 1
- Microsoft Learn credential 2
- Databricks credential

Known links:

- LinkedIn: https://www.linkedin.com/in/nirmalkumar6/
- LeetCode: https://leetcode.com/u/nirmalkcse/
- GitHub: https://github.com/nirmalkcse
- Microsoft Learn credential: https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-1452/credentials/98a858605e1a0462?ref=https%3A%2F%2Fwww.linkedin.com%2F
- Databricks credential: https://credentials.databricks.com/7005c6fc-6aa7-47bc-bd61-4f1ccbaa13cf#acc.LXjiDu8c
- Microsoft Learn credential: https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-8576/credentials/10ddec229a8ad859?ref=https%3A%2F%2Fwww.linkedin.com%2F

Console interactions:

- Filter by provider
- Filter by category
- Verify link
- Credential detail drawer
- Future course placeholders

#### 8. Project Case Files

Project cards should expand into serious case files.

Each case file should include:

- Problem
- Context
- Architecture
- Stack
- Key decisions
- Tradeoffs
- Result / impact
- Links
- Future improvements

Use polished transitions when opening and closing case files.

#### 9. Social Profile Dock

A floating or section-based dock with profile CTAs.

Initial links:

- LinkedIn
- GitHub
- LeetCode
- Microsoft Learn
- Databricks

Future links:

- Kaggle
- Hugging Face
- Medium
- Dev.to
- Portfolio PDF
- Email

### P1: Premium Differentiators

These make the site stand out further.

#### 1. Signal Mode Toggle

Viewer can switch between:

- Executive View
- Engineer View
- Full Dossier

This can exist in addition to role selection, or as a simpler version of role selection on deep pages.

#### 2. Architecture Storyboards

Animated system diagrams for major projects.

Flow example:

Ingestion -> Transformation -> Feature Engineering -> Model / Analytics -> Serving -> Monitoring

This gives technical credibility and visual satisfaction.

#### 3. Resume Lens

Instead of only offering a download:

- One-page resume preview
- Master resume preview
- Highlights extracted from both
- Download CTAs
- Role-aware resume recommendation
- Recruiter-friendly quick summary

Known local files:

- `C:\Users\nirma\Downloads\Nirmal_Kumar_Data_Engineer_Resume_One_Page_v7_revised.docx`
- `C:\Users\nirma\Downloads\Nirmal_Kumar_Data_Engineer_Master_Resume_v7_revised.docx`

Future upgrade:

- Personalized document downloads based on visitor intent.
- Examples:
  - Recruiter packet
  - Data Engineer resume
  - AI / ML Engineer resume
  - Cloud Engineer resume
  - Project case-study PDF
  - Certification proof packet
  - One-page executive summary

#### 4. Future Projects Observatory

A section for planned/future projects, shown as polished "currently exploring" items rather than promises.

Purpose:

- Shows ambition
- Makes the site feel alive
- Lets future sessions add new ideas easily

Suggested states:

- Currently exploring
- Concept
- Building
- Shipped
- Archived

Default presentation:

- Use "currently exploring" as the public-facing language.
- Keep dates and commitments soft unless a project is already underway.
- Treat future projects as curiosity and direction, not overpromised deliverables.

#### 5. Command Palette

A keyboard-first search/action layer.

Example commands:

- Open GitHub
- Show Databricks credential
- Filter AI projects
- Download resume
- View timeline
- Show recruiter version

This is rare in portfolio sites and feels highly professional when done well.

### P2: Delight Layer

Small tactile details that create the "oddly satisfying" feeling.

- Magnetic CTA buttons
- Soft metallic hover glints
- Smooth tab underlines
- Section transitions with gentle blur-to-sharp reveal
- Hover cards with depth and light movement
- Scroll-synced section labels
- Tiny verification chime animation, visual only
- Copy-to-clipboard email with satisfying confirmation
- Project cards that subtly "breathe" on focus
- Cursor-following light only in desktop and only with restraint

### P3: Advanced Bells And Whistles Backlog

These are optional but intentionally ambitious. They should be introduced after the core site feels polished and professional.

#### Professional Utility Features

- **Personalized Document Builder:** visitor selects a target lens and receives the most relevant resume or portfolio packet.
- **Role-Specific Share Links:** URLs like `?view=recruiter` or `/for/engineer` open with the right emphasis.
- **Credential Proof Packet:** downloadable PDF or page collecting certificates, verification links, and related skills.
- **Project Case-Study Export:** selected projects can be exported as a polished PDF one-pager.
- **Contact Card Download:** `.vcf` contact card with LinkedIn, GitHub, email, and portfolio.
- **Recruiter Quick Copy:** one-click copy of a short professional summary.
- **Interview Prep Mode:** quickly surfaces projects, architecture diagrams, resume bullets, and proof links likely to matter in interviews.
- **Availability / Contact Intent Form:** optional lightweight form where visitors choose hiring, collaboration, referral, or networking.
- **Print-Perfect Portfolio Mode:** clean print stylesheet for resume/project/certification pages.

#### Hidden Delight And Easter Eggs

- **Dossier Vault:** hidden command-palette entry that reveals extra experiments, learning logs, or currently exploring ideas.
- **Gold Thread Unlock:** after scrolling the full page, the Gold Thread completes the NK mark in the footer.
- **Console Commands:** tasteful commands like `show proof`, `open vault`, `timeline focus`, `verify credentials`.
- **Konami-Style Shortcut:** optional keyboard easter egg that changes the interface into a subtle "systems map" mode.
- **LeetCode Pulse:** a small visual signal near the LeetCode CTA that feels alive without needing noisy gamification.
- **Hidden Build Notes:** a behind-the-scenes craft note explaining how the portfolio was designed and engineered.
- **Signature Loading Moment:** the NK mark draws itself once, then stays out of the way.
- **Achievement Stamp Animation:** credentials receive a restrained verification stamp when opened.

Guardrails:

- Easter eggs must be opt-in or hidden.
- No joke should weaken professional credibility.
- No interaction should block recruiters from getting the resume quickly.
- Every advanced feature should have a reduced-motion and mobile-friendly version.

## 7. Visual Direction

### Preferred Tone

Apple-like minimal premium with a luxurious undercurrent.

### Palette

Use restraint. Avoid a one-note dark blue/slate theme.

Suggested palette:

- Obsidian: `#070707`
- Carbon: `#111111`
- Soft black: `#181613`
- Ivory: `#F4EFE4`
- Muted champagne: `#D8C28A`
- Antique gold: `#B9974A`
- Deep emerald accent: `#12372A`
- Warm silver: `#B8B6AD`
- Signal blue, very limited: `#7EA7D8`

### Typography

Recommended:

- Editorial serif for hero and major cinematic titles
- Clean sans-serif for UI and readable content
- Monospace only for console/code-like areas

### Premium Font Strategy

The desired feel is similar to Apple's SF Pro: neutral, crisp, legible, modern, and quietly premium.

Important licensing note:

- Apple's SF Pro is intended for Apple-platform design and development contexts. Do not self-host or embed SF Pro font files in the public portfolio unless the license is explicitly cleared.
- Use the native system font stack so Apple devices render San Francisco naturally through the operating system.
- Use strong legal fallbacks for non-Apple devices.

Recommended production stack:

```css
--font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-display: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-editorial: "Cormorant Garamond", "New York", Georgia, serif;
--font-mono: "Geist Mono", "SF Mono", "Cascadia Code", Consolas, monospace;
```

Recommended implementation:

- Use `system-ui` / `-apple-system` for most interface text to get the SF Pro feel on macOS and iOS.
- Use **Geist** or **Inter** as the cross-platform sans-serif fallback if a consistent downloadable web font is needed.
- Use an editorial serif sparingly for cinematic title moments, not dense content.
- Use a clean mono only in the certification console, command palette, code snippets, and technical metadata.

Possible font direction:

- Serif: Cormorant Garamond, Canela-like alternative, or Playfair Display if needed
- Sans: Inter, Geist, or Neue Haas-like alternative
- Mono: JetBrains Mono or Geist Mono

Recommended final pairing:

- UI/body: system stack, with Geist fallback if installed as a web font
- Hero/display: Geist or a tightly tuned system stack
- Luxury accent: Cormorant Garamond for select cinematic headings
- Console: Geist Mono

### Iconic Typography And Logo System

The portfolio should have a recognizable identity that people can describe after leaving the site.

Recommended identity system:

1. **NK Gold Thread Monogram**
   - A minimal `NK` symbol where the `N` contains the Gold Thread and the `K` branches like a data lineage path.
   - This becomes the favicon, loading mark, social preview mark, and nav emblem.

2. **Nirmal Kumar Wordmark**
   - Clean Apple-like typography.
   - One custom letter treatment only, likely the `N` or `K`.
   - Use restrained tracking and optical alignment.

3. **Dossier Seal**
   - A secondary circular or square seal for resume preview, project case files, and certificate console.
   - Should feel like a luxury verification stamp, not a university crest.

4. **Typographic Signature Line**
   - A short repeated brand phrase, for example:
     - `Hybrid Systems. Verified Proof.`
     - `Data. AI. Cloud. Systems.`
     - `Engineering proof, elegantly composed.`

Recommended logo principles:

- Simple silhouette beats clever detail.
- Distinctive negative space is more memorable than extra decoration.
- The logo must be identifiable in monochrome.
- The logo must survive tiny UI placements.
- The wordmark and symbol must work independently.
- The mark should become meaningful through repeated use across the experience.

Logo acceptance tests:

- 16px favicon test
- 32px mobile nav test
- 96px social avatar test
- One-color test
- Black background test
- Ivory background test
- Five-second recall test: after seeing the homepage briefly, a viewer should remember the Gold Thread / NK mark.

### Layout Principles

- Dense enough to feel professional
- Spacious enough to feel premium
- No oversized marketing fluff
- No nested cards
- Cards only for repeated items, modals, case files, and console entries
- Sections should feel like cinematic bands or instrument panels

## 8. Motion Direction

### Motion Personality

- Calm
- Weighted
- Precise
- Smooth
- Tactile
- Intentional

### Motion Rules

- Animate `transform` and `opacity` wherever possible.
- Avoid layout-shifting animations.
- Use scroll-driven scenes for major narrative beats only.
- Use Motion for component transitions.
- Use GSAP ScrollTrigger for authored cinematic/pinned sequences.
- Use CSS scroll-driven animations where support and simplicity make sense.
- Respect `prefers-reduced-motion`.
- Provide a visible motion toggle if looping/ambient motion lasts more than five seconds.

### Interaction Timings

- Hover/tap feedback: 100-180ms
- Small state transition: 180-280ms
- Modal/case file open: 320-480ms
- Page/view transition: 350-650ms
- Scroll-scrubbed cinematic scenes: user-controlled

## 9. Technical Recommendation

### Main Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- GSAP ScrollTrigger
- Motion
- D3
- shadcn/ui selectively
- Lucide icons

### Supporting Tools

- MDX or typed data files for content
- Next metadata API
- Next image optimization
- Vercel deployment
- Playwright for visual verification

### Why This Stack

Next.js gives professional routing, SEO, metadata, and deployment quality.

GSAP handles complex scroll scenes better than hand-rolled code.

Motion handles tactile component-level animation cleanly.

D3 handles timeline scales and data-driven visualizations.

Tailwind gives speed and consistency without locking the visual style into a template.

shadcn/ui gives accessibility foundations for tabs, dialogs, tooltips, and command palette, but should be heavily styled to match the premium direction.

## 10. Proposed Repository Structure

```txt
.
├── docs/
│   ├── portfolio-comprehensive-plan.md
│   ├── portfolio-brief.md
│   ├── content-inventory.md
│   ├── design-system.md
│   ├── build-log.md
│   ├── session-learnings.md
│   └── validation-decisions.md
├── public/
│   ├── assets/
│   │   ├── certificates/
│   │   ├── project-media/
│   │   ├── profile/
│   │   └── og/
│   └── resume/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── projects/
│   │   ├── certifications/
│   │   ├── timeline/
│   │   ├── profile/
│   │   └── resume/
│   ├── components/
│   │   ├── cinematic/
│   │   ├── role-gateway/
│   │   ├── proof-graph/
│   │   ├── timeline/
│   │   ├── certification-console/
│   │   ├── project-case-file/
│   │   ├── social-dock/
│   │   ├── resume-lens/
│   │   └── ui/
│   ├── data/
│   │   ├── profile.ts
│   │   ├── links.ts
│   │   ├── projects.ts
│   │   ├── certifications.ts
│   │   ├── timeline.ts
│   │   ├── skills.ts
│   │   └── future-projects.ts
│   ├── lib/
│   │   ├── animation/
│   │   ├── constants/
│   │   ├── utils/
│   │   └── validators/
│   └── styles/
│       ├── globals.css
│       ├── tokens.css
│       └── motion.css
└── tests/
    ├── visual/
    └── accessibility/
```

## 11. Data Model Plan

### Profile Data

Fields:

- name
- headline
- shortBio
- location
- email
- resumeOnePage
- resumeMaster
- roles
- socialLinks

### Project Data

Fields:

- title
- slug
- status
- type
- summary
- problem
- architecture
- stack
- decisions
- tradeoffs
- impact
- links
- media
- relatedSkills
- relatedCredentials
- timelineDate

### Certification Data

Fields:

- title
- issuer
- category
- date
- expiry
- credentialUrl
- image
- verificationStatus
- relatedSkills
- relatedProjects

### Timeline Data

Fields:

- id
- title
- category
- startDate
- endDate
- description
- proofLinks
- relatedProjects
- relatedCertifications
- importance
- viewerPriority

### Future Project Data

Fields:

- title
- concept
- whyItMatters
- plannedStack
- plannedProof
- status
- targetOutcome

## 12. Multi-Session Roadmap

| Session | Goal | Deliverables | Learning Captured | Status |
|---|---|---|---|---|
| 0 | Initial direction | Stack and creative direction | Hybrid identity, premium cinematic preference | Complete |
| 1 | Master plan | Comprehensive markdown plan and validation gates | Apple-like luxury, professional dossier structure | In progress |
| 2 | Resume/content extraction | Parse one-page and master resumes | Accurate skills, roles, projects, education, achievements | Pending |
| 3 | Content inventory | Build structured content docs and data draft | Canonical source of truth for profile content | Pending |
| 4 | Information architecture | Define pages, sections, viewer journeys | Role-specific content ordering | Pending |
| 5 | Brand identity | Wordmark, NK mark, favicon direction, signature typography | Personal brand recognition rules | Pending |
| 6 | Design system | Colors, typography, components, motion tokens | Premium visual rules | Pending |
| 7 | App scaffold | Next.js, TypeScript, Tailwind, linting, folder structure | Repo conventions and baseline setup | Pending |
| 8 | Data layer | `src/data/*` files for profile, links, timeline, certs | Stable content schema | Pending |
| 9 | Role gateway | Entry experience and role state | Viewer-role behavior rules | Pending |
| 10 | Cinematic hero | Identity reveal, Gold Thread start, CTAs | Animation budget and scroll behavior | Pending |
| 11 | Social dock | Profile link system and CTA polish | Link taxonomy and interaction model | Pending |
| 12 | Proof graph | Skill-to-proof visualization | Evidence graph structure | Pending |
| 13 | Career timeline | Scroll-driven D3/React timeline | Timeline mobile/desktop behavior | Pending |
| 14 | Certification console | Credential filters, cards, verification links | Credential schema and UI states | Pending |
| 15 | Project case files | Project cards and deep-dive pages | Project storytelling format | Pending |
| 16 | Future projects observatory | Planned project roadmap | Future-proof content workflow | Pending |
| 17 | Resume lens | Resume previews and downloads | Resume content mapping | Pending |
| 18 | Personalized documents | Role-aware downloads, proof packet, export flows | Document builder scope and templates | Pending |
| 19 | Hidden delight layer | Easter eggs, command shortcuts, dossier vault | Professional boundaries for playful details | Pending |
| 20 | Motion polish | Tactile transitions and microinteractions | Motion rules and reduced-motion handling | Pending |
| 21 | Accessibility pass | Keyboard, contrast, reduced motion, ARIA | Accessibility checklist | Pending |
| 22 | Responsive QA | Desktop, laptop, tablet, mobile | Breakpoint fixes and text fitting | Pending |
| 23 | Performance pass | Lighthouse, bundle, image optimization | Performance budget | Pending |
| 24 | Deployment | Production build and Vercel deployment | Launch checklist | Pending |

## 13. Progress Tracker

| Area | Progress | Status |
|---|---:|---|
| Research and concept | 100% | Complete |
| Comprehensive plan | 95% | Core decisions validated; palette can be refined later |
| Content extraction | 0% | Pending |
| Information architecture | 0% | Pending |
| Brand identity / logo system | 0% | Pending |
| Advanced feature backlog | 0% | Captured for later prioritization |
| Design system | 0% | Pending |
| App scaffold | 0% | Pending |
| Role gateway | 0% | Pending |
| Cinematic hero | 0% | Pending |
| Gold Thread | 0% | Pending |
| Proof graph | 0% | Pending |
| Timeline | 0% | Pending |
| Certification console | 0% | Pending |
| Social dock | 0% | Pending |
| Project case files | 0% | Pending |
| Future projects | 0% | Pending |
| Resume lens | 0% | Pending |
| Responsive QA | 0% | Pending |
| Accessibility | 0% | Pending |
| Performance | 0% | Pending |
| Deployment | 0% | Pending |

## 14. Session Learning Log

### Session 0 Learnings

- User wants a hybrid identity, not a single-role positioning.
- Preferred tone is premium, cinematic, elegant, royal, and rich.
- User likes dynamic scroll animation similar to Apple and Bettina Sosa.
- User likes role-wise viewership similar to profile selection.
- User wants a career timeline and certification/course console.
- User has existing professional links and resumes.
- User prefers optimized 2D animation over heavy 3D.

### Session 1 Learnings

- User wants the site to stand out and create a memorable experience.
- User wants Apple-like minimal premium with luxury feeling.
- User wants elements that feel satisfying, tactile, and compelling.
- Future/planned projects should be included.
- Professional experience matters more than "mere portfolio site."
- Recommended structure is cinematic homepage plus deep-dive pages.
- Recommended central motif is Cinematic Engineering Dossier.
- User wants professional Apple-like fonts plus an iconic typography/logo direction for mass recognition.
- Recommended personal identity system is an `NK Gold Thread Monogram` plus a refined `Nirmal Kumar` wordmark.
- Concept name should stay behind the scenes; the public site should not over-explain itself.
- Role gateway should appear as a soft intro after the hero, not as a blocking first screen.
- Palette can start with the proposed luxury palette and be refined during visual design.
- User wants all possible professional utility features and tasteful hidden delights captured, including custom document downloads and easter eggs.
- Planned projects should be framed as "currently exploring."
- Personal identity should use both the `NK` monogram and full `Nirmal Kumar` wordmark.

## 15. Validated Decisions

These decisions are now accepted and should guide implementation:

1. Concept use:
   - **Cinematic Engineering Dossier** is an internal creative direction, not a public-facing label.

2. Site shape:
   - Build a cinematic homepage plus professional deep-dive pages.

3. Role gateway behavior:
   - Place role selection as a soft intro section after the hero.
   - Do not block the first impression.
   - Keep role switching available later.

4. Signature motif:
   - Use Gold Thread + Proof Graph as the memorable system.

5. Visual tone:
   - Apple-like minimal premium with luxury details.

6. Palette:
   - Start with the proposed luxury palette and refine during design.

7. Future projects:
   - Include Future Projects Observatory.
   - Use "currently exploring" language.

8. Motion intensity:
   - Cinematic in hero/timeline, restrained elsewhere.

9. Personal brand mark:
   - Use both `NK Gold Thread Monogram` and `Nirmal Kumar` wordmark.

10. Advanced features:
   - Capture and eventually prioritize professional bells and whistles, including personalized document downloads, proof packets, hidden easter eggs, command palette actions, and polished utility flows.

## 16. Build Principles

- The site must be professional before it is flashy.
- Motion must clarify or reward, not distract.
- The best proof should be visible quickly.
- Every skill claim should connect to evidence.
- Visual richness should come from composition, typography, spacing, and motion, not decoration.
- The site must be usable without motion.
- Mobile must feel intentionally designed, not reduced.
- The portfolio should be easy to update as new links, projects, and credentials arrive.

## 17. Remaining Open Questions

These can be answered later during design and implementation:

1. Final palette balance:
   - Start with the proposed luxury palette.
   - Refine after first visual mockup.

2. Contact behavior:
   - Recommended default: direct profile links, email CTA, resume downloads, and optional contact-intent form.
   - Decide final form fields after content extraction.

3. Personalized document builder scope:
   - Decide whether v1 ships with static role-specific downloads or a more dynamic document builder.

4. Easter egg intensity:
   - Keep hidden delight tasteful.
   - Decide after core site is polished.

5. Public wording for future projects:
   - Use "currently exploring" by default.
   - Refine project labels after project inventory is known.

## 18. Source Notes

Research references used for planning:

- Nielsen Norman Group, "The Aesthetic-Usability Effect"
- Nielsen Norman Group, "The Role of Animation and Motion in UX"
- Laws of UX, "Peak-End Rule"
- Laws of UX, "Von Restorff Effect"
- Laws of UX, "Serial Position Effect"
- Laws of UX, "Doherty Threshold"
- MDN, "Scroll-driven animation timelines"
- MDN, "View Transition API"
- web.dev, "How to create high-performance CSS animations"
- W3C WCAG, "Understanding Success Criterion 2.2.2: Pause, Stop, Hide"
- Knowledge at Wharton, "Contagious: Jonah Berger on Why Things Catch On"
- Sage Journals, "The Apple of the mind's eye: Everyday attention, metamemory, and reconstructive memory for the Apple logo"
