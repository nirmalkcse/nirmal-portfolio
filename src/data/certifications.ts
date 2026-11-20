import {
  databricksCredentialUrl,
  microsoftCredentialCandidateUrls
} from "./links";
import type { Certification } from "./types";

export const certifications = [
  {
    title: "Microsoft Certified: Fabric Data Engineer Associate (DP-700)",
    slug: "fabric-data-engineer-associate",
    issuer: "Microsoft",
    category: "Data engineering",
    date: null,
    expiry: null,
    credentialUrl: null,
    candidateCredentialUrls: microsoftCredentialCandidateUrls,
    image: null,
    verificationStatus: "link-captured",
    relatedSkills: [
      "Microsoft Fabric",
      "Data Factory",
      "Lakehouse",
      "Warehouse",
      "PySpark",
      "SQL",
      "Delta",
      "CDC/SCD2"
    ],
    relatedProjects: [
      "telecom-fabric-migration-poc",
      "bi-migration-validation-analytics"
    ],
    group: "Microsoft Fabric",
    note:
      "Microsoft Learn links are available; exact DP-700 versus DP-600 mapping should be confirmed before assigning a direct credential link."
  },
  {
    title: "Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)",
    slug: "fabric-analytics-engineer-associate",
    issuer: "Microsoft",
    category: "Analytics engineering",
    date: null,
    expiry: null,
    credentialUrl: null,
    candidateCredentialUrls: microsoftCredentialCandidateUrls,
    image: null,
    verificationStatus: "link-captured",
    relatedSkills: [
      "Power BI",
      "semantic modeling",
      "DAX",
      "Power Query",
      "Fabric"
    ],
    relatedProjects: [
      "bi-migration-validation-analytics",
      "fabcon25-talk-to-your-data-demo",
      "insurance-analytics-copilot-data-agent-poc"
    ],
    group: "Microsoft Fabric",
    note:
      "Microsoft Learn links are available; exact DP-700 versus DP-600 mapping should be confirmed before assigning a direct credential link."
  },
  {
    title: "Databricks Certified Data Engineer Associate",
    slug: "databricks-data-engineer-associate",
    issuer: "Databricks",
    category: "Data engineering",
    date: null,
    expiry: null,
    credentialUrl: databricksCredentialUrl,
    image: null,
    verificationStatus: "link-captured",
    relatedSkills: [
      "Databricks",
      "SQL Warehouse",
      "Delta",
      "Jobs",
      "orchestration"
    ],
    relatedProjects: [
      "icore-enterprise-mdm-entity-resolution",
      "telecom-fabric-migration-poc"
    ],
    group: "Databricks",
    note: "Credential link available. Issue and expiry dates should be confirmed on the public credential page."
  },
  {
    title: "Databricks UC Upgrade Delivery Specialization",
    slug: "databricks-uc-upgrade-delivery-specialization",
    issuer: "Databricks",
    category: "Governance / Unity Catalog",
    date: null,
    expiry: null,
    credentialUrl: null,
    image: null,
    verificationStatus: "resume-claimed",
    relatedSkills: [
      "Unity Catalog",
      "governance",
      "access control",
      "data management"
    ],
    relatedProjects: ["icore-enterprise-mdm-entity-resolution"],
    group: "Databricks",
    note: "Public verification path to attach before promotion."
  },
  {
    title: "Databricks Accredited Databricks Fundamentals",
    slug: "databricks-fundamentals",
    issuer: "Databricks",
    category: "Platform fundamentals",
    date: null,
    expiry: null,
    credentialUrl: null,
    image: null,
    verificationStatus: "resume-claimed",
    relatedSkills: ["Databricks fundamentals", "lakehouse concepts"],
    relatedProjects: ["icore-enterprise-mdm-entity-resolution"],
    group: "Databricks",
    note: "Public verification path to attach before promotion."
  },
  {
    title: "Microsoft GitHub Copilot",
    slug: "github-copilot",
    issuer: "Microsoft / GitHub",
    category: "Developer productivity",
    date: null,
    expiry: null,
    credentialUrl: null,
    image: null,
    verificationStatus: "resume-claimed",
    relatedSkills: ["GitHub Copilot", "developer workflow"],
    relatedProjects: [
      "icore-enterprise-mdm-entity-resolution",
      "fabcon25-talk-to-your-data-demo"
    ],
    group: "Developer productivity",
    note: "Public verification path to attach before promotion."
  },
  {
    title: "Google Data Analytics Professional Certificate",
    slug: "google-data-analytics-professional",
    issuer: "Google",
    category: "Analytics",
    date: null,
    expiry: null,
    credentialUrl: null,
    image: null,
    verificationStatus: "resume-claimed",
    relatedSkills: [
      "Analytics",
      "BI",
      "data preparation",
      "visualization"
    ],
    relatedProjects: [
      "bi-migration-validation-analytics",
      "vitac-skincare-market-analysis"
    ],
    group: "Analytics and cloud",
    note: "Public verification path to attach before promotion."
  },
  {
    title: "Oracle Cloud Infrastructure Foundations Associate",
    slug: "oracle-cloud-infrastructure-foundations",
    issuer: "Oracle",
    category: "Cloud fundamentals",
    date: null,
    expiry: null,
    credentialUrl: null,
    image: null,
    verificationStatus: "resume-claimed",
    relatedSkills: ["Cloud fundamentals"],
    relatedProjects: [],
    group: "Analytics and cloud",
    note: "Public verification path to attach before promotion."
  }
] satisfies readonly Certification[];

export const certificationGroups = [
  "Microsoft Fabric",
  "Databricks",
  "Analytics and cloud",
  "Developer productivity"
] satisfies readonly string[];
