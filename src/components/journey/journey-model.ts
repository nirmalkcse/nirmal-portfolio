import { certifications, profile, projects, type Certification, type Project } from "@/data";

/* ─── Story model ────────────────────────────────────────────────────────
   Facts come from src/data. This layer only decides which element carries
   which chapter of the work, and the two-tone line that opens each one. */

export type ElementKey = "earth" | "water" | "fire" | "air" | "ether";

export const ELEMENT_ORDER: readonly ElementKey[] = ["earth", "water", "fire", "air", "ether"];

export type Figure = {
  /** Numbers scrub up with the scroll; strings ("→", "–") render as written. */
  parts: readonly (number | string)[];
  decimals?: number;
  suffix?: string;
  label: string;
};

export type ChapterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Proof = {
  label: string;
  detail: string;
  href?: string;
};

/** The second beat of a chapter: what was built, with what, proven how. */
export type Dossier = {
  period: string;
  context: string;
  status: string;
  built: readonly string[];
  stack: readonly string[];
  proof: readonly Proof[];
};

export type Chapter = {
  key: ElementKey;
  /** "Earth" */
  name: string;
  /** The landform the element is staged as. */
  landform: string;
  kicker: string;
  headline: string;
  tail: string;
  description: string;
  figures: readonly Figure[];
  dossier: Dossier;
  links: readonly ChapterLink[];
  tone: "light" | "dark";
  objectTitle: string;
  objectHint: string;
};

export type Segue = {
  from: ElementKey;
  to: ElementKey;
  line: string;
  tail: string;
  /** A dated milestone from the timeline, carried across the segue. */
  milestone: { when: string; what: string };
};

/** Per-element palette shared by CSS (via data attributes) and the canvas. */
export const ELEMENT_PALETTE: Record<
  ElementKey,
  { base: string; baseRgb: readonly [number, number, number]; accent: string; tone: "light" | "dark" }
> = {
  earth: { base: "#f3ebdc", baseRgb: [243, 235, 220], accent: "#9a5637", tone: "light" },
  water: { base: "#e3eeec", baseRgb: [227, 238, 236], accent: "#2f6f78", tone: "light" },
  fire: { base: "#140e0b", baseRgb: [20, 14, 11], accent: "#ff9f5a", tone: "dark" },
  air: { base: "#edf2f5", baseRgb: [237, 242, 245], accent: "#5b7a94", tone: "light" },
  ether: { base: "#070a14", baseRgb: [7, 10, 20], accent: "#d9b26f", tone: "dark" }
};

function projectBySlug(slug: string): Project {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`Project "${slug}" is missing from src/data/projects.ts`);
  return project;
}

const ieee = projectBySlug("ieee-semiconductor-chip-analysis-medallion");
const telecom = projectBySlug("telecom-fabric-migration-poc");
const biMigration = projectBySlug("bi-migration-validation-analytics");
const fabcon = projectBySlug("fabcon25-talk-to-your-data-demo");
const insurance = projectBySlug("insurance-analytics-copilot-data-agent-poc");
const icore = projectBySlug("icore-enterprise-mdm-entity-resolution");

const ieeeLink = ieee.links.find((link) => link.status === "verified" && link.url);

function credential(slug: string): Proof {
  const cert = certifications.find((candidate) => candidate.slug === slug);
  if (!cert) throw new Error(`Certification "${slug}" is missing from src/data/certifications.ts`);
  const code = /\((DP-\d+)\)/.exec(cert.title)?.[1];
  return {
    label: cert.title.replace(/^Microsoft Certified:\s*/, "").replace(/\s*\(DP-\d+\)$/, ""),
    detail: code ? `${cert.issuer} · ${code}` : cert.issuer,
    href: cert.credentialUrl ?? undefined
  };
}

export const chapters: readonly Chapter[] = [
  {
    key: "earth",
    name: "Earth",
    landform: "Bedrock strata",
    kicker: "Foundation",
    headline: "It starts with the ground.",
    tail: "A degree, a paper, and the layers under every pipeline since.",
    description: `${profile.education.degree} at ${profile.education.institution}, class of ${profile.education.completionYear}. Then an IEEE publication on semiconductor chip analysis, built on Medallion architecture, Microsoft Fabric, and Power BI: raw, refined, and served, in layers.`,
    figures: [
      { parts: [9.11], decimals: 2, suffix: "/10", label: "CGPA" },
      { parts: [1], label: "IEEE publication" },
      { parts: [3], label: "Medallion layers" }
    ],
    dossier: {
      period: `Class of ${profile.education.completionYear}`,
      context: `${profile.education.institution} · ${profile.location}`,
      status: "Published",
      built: [
        "Medallion architecture for semiconductor chip analysis: raw, refined and served layers.",
        "A Microsoft Fabric lakehouse feeding Power BI, written up and published on IEEE Xplore.",
        `${profile.education.degree}, finished with a ${profile.education.cgpa} CGPA.`
      ],
      stack: [...ieee.stack, "SQL", "Research communication"],
      proof: [
        ...(ieeeLink?.url
          ? [{ label: "IEEE Xplore article", detail: "Public publication", href: ieeeLink.url }]
          : []),
        credential("google-data-analytics-professional"),
        credential("oracle-cloud-infrastructure-foundations")
      ]
    },
    links: [
      { label: "Read the case file", href: `/projects/${ieee.slug}` },
      ...(ieeeLink?.url ? [{ label: "IEEE article", href: ieeeLink.url, external: true }] : [])
    ],
    tone: "light",
    objectTitle: "Core sample",
    objectHint: "Drag the drill down to read each layer."
  },
  {
    key: "water",
    name: "Water",
    landform: "River delta",
    kicker: "Flow",
    headline: "Then the data began to move.",
    tail: "Teradata to Fabric, for a tier-1 European telecom.",
    description:
      "Metadata-driven ingestion carried three source systems through Bronze, Silver, and Gold, with MD5-hash CDC, SCD Type 2 validity windows, and idempotent, retryable runs. Eighteen to twenty-four tables arrived every day, and could be trusted on arrival.",
    figures: [
      { parts: [3], label: "Source systems" },
      { parts: [18, "–", 24], label: "Daily incremental tables" }
    ],
    dossier: {
      period: telecom.dates.replace(" - ", " – "),
      context: `${profile.roles[0].organization} · Tier-1 European telecom, anonymized`,
      status: "Complete",
      built: [
        "Metadata-driven ingestion from Teradata and BTEQ sources into Bronze, Silver and Gold.",
        "MD5-hash CDC with SCD Type 2 validity windows, active/deleted tracking and idempotent reruns.",
        "Schema correction, UTF-8 standardization and JSON flattening ahead of Warehouse serving."
      ],
      stack: telecom.stack,
      proof: [credential("fabric-data-engineer-associate"), credential("fabric-analytics-engineer-associate")]
    },
    links: [{ label: "Read the case file", href: `/projects/${telecom.slug}` }],
    tone: "light",
    objectTitle: "Confluence",
    objectHint: "Drag each source into the river."
  },
  {
    key: "fire",
    name: "Fire",
    landform: "Caldera forge",
    kicker: "Refinement",
    headline: "Heat is how you find the truth.",
    tail: "Validation that burned discrepancies down by 90%.",
    description:
      "MicroStrategy reports crossing into Fabric were checked line by line: SQL regression checks, Gold-to-BI comparisons, rebuilt semantic models, and DAX. Six Tableau reports were re-forged in Power BI along the way.",
    figures: [
      { parts: [15], suffix: "+", label: "Reports validated" },
      { parts: [90], suffix: "%", label: "Fewer discrepancies" },
      { parts: [6], label: "Tableau reports to Power BI" }
    ],
    dossier: {
      period: biMigration.dates.replace(" - ", " – "),
      context: `${profile.roles[0].organization} · enterprise reporting, clients anonymized`,
      status: "Complete",
      built: [
        "SQL regression checks and Gold-to-BI comparisons for MicroStrategy-to-Fabric parity.",
        "Semantic models, DAX measures and Power Query transformations rebuilt for every migrated report.",
        "Six Tableau reports rebuilt in Power BI, each through accessibility and usability review."
      ],
      stack: biMigration.stack,
      proof: [
        credential("fabric-analytics-engineer-associate"),
        credential("google-data-analytics-professional"),
        { label: "Performance rating 4.4 → 4.8", detail: "Outstanding ratings on record" }
      ]
    },
    links: [{ label: "Read the case file", href: `/projects/${biMigration.slug}` }],
    tone: "dark",
    objectTitle: "The forge",
    objectHint: "Strike, or hold, to validate each report."
  },
  {
    key: "air",
    name: "Air",
    landform: "Alpine summit",
    kicker: "Elevation",
    headline: "Then the work learned to speak.",
    tail: "Talk to Your Data, at FabCon25 Europe.",
    description:
      "A Fabric Lakehouse and semantic model wired into Power BI Chat with Data, in-report Copilot, Data Agent root-cause analysis, Copilot Studio orchestration, and JIRA incident context. Recognized by senior company and Microsoft leadership.",
    figures: [
      { parts: [4.4, "→", 4.8], decimals: 1, suffix: "/5", label: "Performance rating" },
      { parts: [2], label: "AI-assisted analytics builds" }
    ],
    dossier: {
      period: fabcon.dates,
      context: "FabCon25 Europe · senior company and Microsoft leadership in the room",
      status: "Recognized",
      built: [
        "Lakehouse and semantic model wired into Power BI Chat with Data and in-report Copilot.",
        "Data Agent root-cause analysis orchestrated through Copilot Studio, with JIRA MCP incident context.",
        "Insurance analytics PoC: prompt libraries, verified response patterns and a parameterized SQL data agent."
      ],
      stack: [...fabcon.stack, "DAX", "Power Query"],
      proof: [
        credential("github-copilot"),
        credential("fabric-analytics-engineer-associate"),
        { label: "Insurance analytics PoC", detail: "Synthetic data, semantic models, data agent", href: `/projects/${insurance.slug}` }
      ]
    },
    links: [
      { label: "Read the case file", href: `/projects/${fabcon.slug}` },
      { label: "Insurance analytics PoC", href: `/projects/${insurance.slug}` }
    ],
    tone: "light",
    objectTitle: "Updraft",
    objectHint: "Catch a question and let it rise."
  },
  {
    key: "ether",
    name: "Ether",
    landform: "Night sky",
    kicker: "Resolution",
    headline: "In the space between records, identity.",
    tail: "iCORE: entity resolution, owned end to end on Databricks.",
    description:
      "A Databricks-hosted MDM product with reusable connectors, source mappings, canonical attributes, golden records, governed review queues, audit logging, and role-based controls. Every match decision can be reviewed, explained, and traced.",
    figures: [
      { parts: [1], label: "Golden record, many sources" },
      { parts: [certifications.length], label: "Credentials behind the work" }
    ],
    dossier: {
      period: icore.dates.replace(" - ", " – "),
      context: `${profile.roles[0].organization} · Databricks-hosted MDM product, client anonymized`,
      status: "Current",
      built: [
        "Re-architected connector-centric workflows into a Master Entity model with golden records and history.",
        "Next.js and TypeScript on Databricks Apps, over SQL Warehouse, Jobs API, Secrets API and Unity Catalog.",
        "Review queues, approval chains, RBAC, audit logging and evidence trails behind every match decision."
      ],
      stack: icore.stack,
      proof: [
        credential("databricks-data-engineer-associate"),
        credential("databricks-uc-upgrade-delivery-specialization"),
        credential("databricks-fundamentals")
      ]
    },
    links: [
      { label: "Read the case file", href: `/projects/${icore.slug}` },
      { label: "See every credential", href: "/certifications" }
    ],
    tone: "dark",
    objectTitle: "Constellation",
    objectHint: "Tap a record to resolve its identity."
  }
];

export const segues: readonly Segue[] = [
  {
    from: "earth",
    to: "water",
    line: "Bedrock gives way to current.",
    tail: "What was layered begins to flow.",
    milestone: {
      when: "Sep 2024",
      what: `Joined ${profile.roles[0].organization} as ${profile.roles[0].title}, in data engineering and product development.`
    }
  },
  {
    from: "water",
    to: "fire",
    line: "Pressed hard enough, water becomes steam.",
    tail: "What remains is what is true.",
    milestone: {
      when: "2024 – 2025",
      what: "Performance rating rose from 4.4 to 4.8 out of 5, with Outstanding ratings on record."
    }
  },
  {
    from: "fire",
    to: "air",
    line: "What burned, lifts.",
    tail: "Ash to cloud, cloud to altitude.",
    milestone: {
      when: "2025",
      what: "FabCon25 Europe: a Talk to Your Data demo recognized by senior company and Microsoft leadership."
    }
  },
  {
    from: "air",
    to: "ether",
    line: "Above the wind, stillness.",
    tail: "Where every point of light finds its place.",
    milestone: {
      when: "Jan 2026",
      what: "Took end-to-end ownership of iCORE, an enterprise MDM and entity-resolution product on Databricks."
    }
  }
];

const verificationLabels: Record<Certification["verificationStatus"], string> = {
  verified: "Verified",
  "link-captured": "Link on file",
  "resume-claimed": "On résumé"
};

/** Every credential, for the outro. */
export const credentialList = certifications.map((cert) => ({
  slug: cert.slug,
  label: cert.title.replace(/^Microsoft Certified:\s*/, "").replace(/\s*\(DP-\d+\)$/, ""),
  issuer: cert.issuer,
  code: /\((DP-\d+)\)/.exec(cert.title)?.[1] ?? null,
  href: cert.credentialUrl,
  status: verificationLabels[cert.verificationStatus]
}));

export const hero = {
  eyebrow: "Journey",
  /* Chennai, where the ground under all of this is. */
  coordinates: "13.0827° N · 80.2707° E",
  span: "Five elements. One practice.",
  lineOne: "Built from the elements.",
  lineTwo: "Earth to ether, in one scroll.",
  sub: "How a data engineer's work took shape: the ground it stands on, the way it flows, the heat that proves it, the lift that lets it speak, and the space where records resolve."
} as const;

export const outro = {
  kicker: "Five elements. One practice.",
  headline: "Every system carries all five.",
  tail: "Ground, flow, heat, lift, and the space to resolve.",
  summaries: [
    { key: "earth", line: "Foundations that hold." },
    { key: "water", line: "Pipelines that flow, daily." },
    { key: "fire", line: "Validation that proves." },
    { key: "air", line: "Analytics that speak." },
    { key: "ether", line: "Identity that resolves." }
  ] as readonly { key: ElementKey; line: string }[]
} as const;

export const chapterIndex = (key: ElementKey) => ELEMENT_ORDER.indexOf(key);
