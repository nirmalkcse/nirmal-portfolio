# Repository Structure

Proposed implementation structure:

```txt
.
├── docs/
│   ├── README.md
│   ├── strategy/
│   ├── design/
│   ├── features/
│   ├── architecture/
│   ├── content/
│   ├── roadmap/
│   ├── sessions/
│   ├── tracking/
│   ├── learnings/
│   └── validation/
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
│   │   ├── resume/
│   │   └── documents/
│   ├── components/
│   │   ├── cinematic/
│   │   ├── role-gateway/
│   │   ├── proof-graph/
│   │   ├── timeline/
│   │   ├── certification-console/
│   │   ├── project-case-file/
│   │   ├── social-dock/
│   │   ├── resume-lens/
│   │   ├── documents/
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
│   │   ├── documents/
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

## Documentation Rule

When a session changes a major decision, update:

1. The relevant domain file.
2. [Progress Tracker](../tracking/progress-tracker.md).
3. [Decision Log](../learnings/decision-log.md).
4. The current session file.
5. [Session Learnings](../learnings/session-learnings.md).

