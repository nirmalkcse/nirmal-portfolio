/*
 * Each case study keeps the site's ivory ground and ink, and takes one accent
 * from its own world: Databricks ember for iCORE, Fabric teal for the
 * telecom migration, Power BI amber for the BI work, IEEE blue for the
 * research, and so on. The accent tints the kicker, numerals, rules and the
 * project's hairline drawing; nothing else changes colour, so the pages stay
 * one family.
 *
 * Copy here is editorial framing only (a short name and a two-tone line);
 * every fact on the page comes from src/data/projects.ts.
 */
export type CaseTheme = {
  /** Short display name, set large. */
  name: string;
  /** The quieter second half of the headline. */
  tail: string;
  /** Accent: kicker, numerals, rules, motif highlights. AA on ivory. */
  accent: string;
  /** A very light wash of the accent for the hero visual's ground. */
  wash: string;
};

const fallback: CaseTheme = {
  name: "Case study",
  tail: "How it was built.",
  accent: "#9a5637",
  wash: "rgba(154, 86, 55, 0.1)"
};

export const caseThemes: Record<string, CaseTheme> = {
  "icore-enterprise-mdm-entity-resolution": {
    name: "iCORE",
    tail: "Many records in. One trusted golden record out.",
    accent: "#b0452c",
    wash: "rgba(176, 69, 44, 0.1)"
  },
  "telecom-fabric-migration-poc": {
    name: "Teradata to Fabric",
    tail: "Rebuilt as Bronze, Silver and Gold.",
    accent: "#11766a",
    wash: "rgba(17, 118, 106, 0.1)"
  },
  "bi-migration-validation-analytics": {
    name: "BI Migration",
    tail: "Validated line by line, report by report.",
    accent: "#946708",
    wash: "rgba(201, 146, 18, 0.12)"
  },
  "ieee-semiconductor-chip-analysis-medallion": {
    name: "IEEE research",
    tail: "Semiconductor chip analysis on a medallion lakehouse.",
    accent: "#2c5c9a",
    wash: "rgba(44, 92, 154, 0.1)"
  },
  "fabcon25-talk-to-your-data-demo": {
    name: "Talk to Your Data",
    tail: "A Fabric demo with Copilot and Data Agents.",
    accent: "#6a4fb3",
    wash: "rgba(106, 79, 179, 0.1)"
  },
  "insurance-analytics-copilot-data-agent-poc": {
    name: "Insurance analytics",
    tail: "Semantic models, with an AI assistant on top.",
    accent: "#3d6b52",
    wash: "rgba(61, 107, 82, 0.1)"
  },
  "vitac-skincare-market-analysis": {
    name: "VITAC",
    tail: "Sizing a skincare market, then telling its story.",
    accent: "#a64d5d",
    wash: "rgba(166, 77, 93, 0.1)"
  },
  align: {
    name: "GitHub Align",
    tail: "A repository, still under review.",
    accent: "#585c66",
    wash: "rgba(88, 92, 102, 0.1)"
  }
};

export function getCaseTheme(slug: string): CaseTheme {
  return caseThemes[slug] ?? fallback;
}
