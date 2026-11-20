import { socialLinks } from "./links";
import type { PortfolioProfile } from "./types";

export const profile = {
  name: "Nirmal Kumar P",
  displayName: "Nirmal Kumar",
  headline:
    "Data Engineer building Microsoft Fabric, Databricks, SQL, PySpark, and Power BI systems for migration, validation, and reporting trust.",
  alternateHeadline:
    "Data Engineer | Microsoft Fabric & Databricks | SQL, PySpark, Power BI",
  shortBio:
    "Nirmal Kumar builds reliable data systems across Fabric lakehouse delivery, Databricks data products, SQL/PySpark validation, and BI modernization.",
  expandedBio:
    "Nirmal Kumar builds data systems that make migration, reporting, and validation easier to trust. His strongest work spans telecom migration assets for 3 source systems and 18-24 daily incremental tables, BI validation that reduced report discrepancies by 90%, Tableau-to-Power BI migrations, and a Databricks-hosted MDM/entity-resolution product with governed orchestration, reviewable decisions, and role-based controls.",
  location: "Chennai, India",
  email: null,
  resumeOnePage: {
    label: "One-page resume",
    path: "C:\\Users\\nirma\\Downloads\\Nirmal_Kumar_Data_Engineer_Resume_One_Page_v7_revised.docx",
    publicDefault: true,
    note: "Default recruiter download."
  },
  resumeMaster: {
    label: "Master resume",
    path: "C:\\Users\\nirma\\Downloads\\Nirmal_Kumar_Data_Engineer_Master_Resume_v7_revised.docx",
    publicDefault: false,
    note: "Expanded master resume, not the default public download."
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
      "Lead with ownership, governed workflows, validation systems, discrepancy reduction, delivery discipline, and business-facing modernization.",
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
