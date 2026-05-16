import { socialLinks } from "./links";
import type { PortfolioProfile } from "./types";

export const profile = {
  name: "Nirmal Kumar P",
  displayName: "Nirmal Kumar",
  headline:
    "Data Engineer building Fabric lakehouses, Databricks data products, and proof-backed BI systems.",
  alternateHeadline:
    "Data Engineer | Microsoft Fabric & Databricks | SQL, PySpark, Power BI",
  shortBio:
    "Nirmal Kumar is a data engineer focused on Microsoft Fabric and Databricks lakehouse delivery across ingestion, CDC/SCD Type 2, validation, BI migration, and data-product workflows.",
  expandedBio:
    "Nirmal Kumar builds enterprise-style data systems across Microsoft Fabric, Databricks, SQL, PySpark, and Power BI. His strongest work spans telecom migration assets for 3 source systems and 18-24 daily incremental tables, BI validation that reduced report discrepancies by 90%, Tableau-to-Power BI migrations, and a Databricks-hosted MDM/entity-resolution product with governance, orchestration, auditability, and explainability built in.",
  location: "Chennai, India",
  email: null,
  resumeOnePage: {
    label: "One-page resume",
    path: "C:\\Users\\nirma\\Downloads\\Nirmal_Kumar_Data_Engineer_Resume_One_Page_v7_revised.docx",
    publicDefault: true,
    note: "Default recruiter download once the public asset path is confirmed."
  },
  resumeMaster: {
    label: "Master resume",
    path: "C:\\Users\\nirma\\Downloads\\Nirmal_Kumar_Data_Engineer_Master_Resume_v7_revised.docx",
    publicDefault: false,
    note: "Deep-dive and proof-packet source, not the default public download."
  },
  roles: [
    {
      title: "Software Engineer Trainee",
      organization: "iLink Systems",
      discipline: "Data Engineering & Product Development",
      startDate: "2024-09",
      endDate: "Present",
      location: "Chennai, India"
    }
  ],
  education: {
    degree: "Bachelor of Engineering in Computer Science and Engineering",
    institution: "Sathyabama Institute of Science and Technology",
    completionYear: "2024",
    cgpa: "9.11/10"
  },
  socialLinks,
  viewerPositioning: {
    recruiter:
      "Lead with Data Engineer positioning, Fabric and Databricks certifications, enterprise delivery experience, quantified outcomes, and the one-page resume.",
    engineer:
      "Lead with implementation depth across PySpark, SQL, CDC/SCD2, Delta, Fabric pipelines, Databricks APIs, Unity Catalog, RBAC, audit logging, and orchestration.",
    leader:
      "Lead with ownership, governance workflows, validation systems, discrepancy reduction, delivery discipline, and business-facing modernization.",
    explorer:
      "Lead with the hybrid arc across data engineering, analytics, AI/data agents, product engineering, certifications, research, demos, and learning momentum."
  },
  achievements: [
    "Supported 3 telecom source systems in a Microsoft Fabric migration PoC.",
    "Supported roughly 18-24 daily incremental source tables.",
    "Validated 15+ MicroStrategy-to-Fabric reports.",
    "Reduced validation discrepancies by 90%.",
    "Migrated 6 Tableau reports to Power BI.",
    "Improved performance rating from 4.4/5 to 4.8/5.",
    "Completed undergraduate degree with 9.11/10 CGPA."
  ]
} satisfies PortfolioProfile;
