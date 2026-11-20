/* Editorial layer for the three flagship case studies. Facts come from
   src/data/projects.ts; this adds a display name, a two-tone line, and
   three highlights lifted from each project's summary and impact. */

export type Highlight =
  | { kind: "number"; value: number; suffix?: string; label: string }
  | { kind: "range"; from: number; to: number; label: string }
  | { kind: "text"; value: string; label: string };

export type Flagship = {
  slug: string;
  name: string;
  lede: string;
  tail: string;
  highlights: readonly Highlight[];
};

export const flagships: readonly Flagship[] = [
  {
    slug: "icore-enterprise-mdm-entity-resolution",
    name: "iCORE",
    lede: "Enterprise MDM and entity resolution.",
    tail: "Many records in. One trusted golden record out.",
    highlights: [
      { kind: "text", value: "End to end", label: "Ownership" },
      { kind: "text", value: "Databricks", label: "Hosted on Databricks Apps" },
      { kind: "text", value: "RBAC", label: "Governed, audited, explainable" }
    ]
  },
  {
    slug: "telecom-fabric-migration-poc",
    name: "Teradata to Fabric",
    lede: "A lakehouse migration for a tier-1 European telecom.",
    tail: "Rebuilt as Bronze, Silver and Gold.",
    highlights: [
      { kind: "number", value: 3, label: "Source systems" },
      { kind: "range", from: 18, to: 24, label: "Daily incremental tables" },
      { kind: "text", value: "SCD2", label: "History kept with CDC" }
    ]
  },
  {
    slug: "bi-migration-validation-analytics",
    name: "BI Migration",
    lede: "MicroStrategy to Fabric. Tableau to Power BI.",
    tail: "Validated line by line, report by report.",
    highlights: [
      { kind: "number", value: 15, suffix: "+", label: "Reports validated" },
      { kind: "number", value: 90, suffix: "%", label: "Fewer discrepancies" },
      { kind: "number", value: 6, label: "Tableau reports migrated" }
    ]
  }
];
