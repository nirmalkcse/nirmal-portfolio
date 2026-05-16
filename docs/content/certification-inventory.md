# Certification Inventory

Status: Canonical draft with rendered verification updates
Last updated: 2026-05-16
Primary source: [Session 02 Resume Content Extraction](../sessions/session-02-resume-content-extraction.md)
Verification pass: Rendered public credential/profile checks on 2026-05-16

## Verification Rule

Public UI should distinguish between:

- Verified: credential page manually checked and metadata captured.
- Verified, expired: credential page manually checked, but the credential is no longer current.
- Indirectly supported: a verified page supports a claim, but is not the direct credential page.
- Link captured: URL exists, but metadata still needs rendered verification.
- Resume claimed: appears in resume, but no verification URL captured yet.

Do not publish credential dates, credential IDs, certificate numbers, or status labels unless they appear on a public verification page or are explicitly approved for public use.

## Credential Records

| Title | Issuer | Category | Issue Date | Expiry | Verification Status | Credential URL | Public Metadata Captured | Related Skills | Related Projects |
|---|---|---|---|---|---|---|---|---|---|
| Microsoft Certified: Fabric Data Engineer Associate (DP-700) | Microsoft | Data engineering | 2025-04-30 | 2026-05-01 | Verified, expired | [Microsoft Learn](https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-1452/credentials/98a858605e1a0462?ref=https%3A%2F%2Fwww.linkedin.com%2F) | Credential ID: `98A858605E1A0462`; certification number: `00TC69-32B50C`; public profile name: Nirmal Kumar Pukazhenthi | Microsoft Fabric, Data Factory, Lakehouse, Warehouse, PySpark, SQL, Delta, CDC/SCD2 | Telecom Fabric Migration PoC, BI Migration/Validation |
| Microsoft Certified: Fabric Analytics Engineer Associate (DP-600) | Microsoft | Analytics engineering | 2024-06-22 | 2026-06-23 | Verified | [Microsoft Learn](https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-8576/credentials/10ddec229a8ad859?ref=https%3A%2F%2Fwww.linkedin.com%2F) | Credential ID: `10DDEC229A8AD859`; certification number: `F147EA-AF8E4C`; public profile name: Nirmal Kumar P | Power BI, semantic modeling, DAX, Power Query, Fabric | BI Migration/Validation, FabCon25 demo, Insurance Analytics PoC |
| Databricks Certified Data Engineer Associate | Databricks | Data engineering | Pending | Pending | Indirectly supported; direct URL pending | Pending direct credential URL | Verified UC Upgrade badge states it is granted to Databricks Certified Data Engineer Associates in the partner community; do not treat this as a direct standalone credential page. | Databricks, SQL Warehouse, Delta, Jobs, orchestration | iCORE Enterprise MDM, Telecom Fabric Migration PoC |
| Databricks UC Upgrade Delivery Specialization | Databricks Academy | Governance / Unity Catalog | 2026-02-18 | 2028-02-18 | Verified | [Databricks credential](https://credentials.databricks.com/7005c6fc-6aa7-47bc-bd61-4f1ccbaa13cf#acc.LXjiDu8c) | Accredible credential UUID: `7005c6fc-6aa7-47bc-bd61-4f1ccbaa13cf`; numeric reference visible on certificate image: `174788872`; owner verified as Nirmal Kumar Pukazhenthi | Unity Catalog, governance, access control, data management, UCX readiness | iCORE Enterprise MDM |
| Databricks Accredited Databricks Fundamentals | Databricks | Platform fundamentals | Pending | Pending | Resume claimed | Pending | No public verification URL captured yet. | Databricks fundamentals, lakehouse concepts | iCORE Enterprise MDM |
| Microsoft GitHub Copilot | Microsoft / GitHub | Developer productivity | Pending | Pending | Resume claimed | Pending | No public verification URL captured yet. | GitHub Copilot, developer workflow | iCORE Enterprise MDM, product engineering workflows |
| Google Data Analytics Professional Certificate | Google | Analytics | Pending | Pending | Resume claimed | Pending | No public verification URL captured yet. | Analytics, BI, data preparation, visualization | BI Migration/Validation, VITAC |
| Oracle Cloud Infrastructure Foundations Associate | Oracle | Cloud fundamentals | Pending | Pending | Resume claimed | Pending | No public verification URL captured yet. | Cloud fundamentals | General profile support |

## Credential Console Grouping

Recommended groups:

- Microsoft Fabric: DP-700, DP-600
- Databricks: Data Engineer Associate, UC Upgrade Delivery Specialization, Fundamentals
- Analytics and cloud: Google Data Analytics, Oracle Cloud Infrastructure Foundations
- Developer productivity: Microsoft GitHub Copilot

## Public Copy Notes

- Lead with Microsoft Fabric and Databricks credentials, but show status truthfully.
- DP-700 expired on 2026-05-01. Do not present it as current unless a renewed verification page is captured.
- DP-600 is verified through 2026-06-23.
- Databricks UC Upgrade Delivery Specialization is verified through 2028-02-18.
- Keep Databricks Certified Data Engineer Associate as indirectly supported until the direct credential page is captured.
- Avoid exposing credential IDs or certification numbers in polished UI unless there is a deliberate verification-detail drawer.

## Remaining Metadata Needed

- Direct public verification URL for Databricks Certified Data Engineer Associate.
- Public verification URL for Databricks Accredited Databricks Fundamentals.
- Public verification URLs and dates for Microsoft GitHub Copilot, Google Data Analytics Professional Certificate, and Oracle Cloud Infrastructure Foundations Associate.
- Renewed DP-700 verification page if the credential has been renewed after 2026-05-01.
- Public-safe certificate thumbnails or screenshots after deciding whether credential IDs should be visible in UI imagery.
- Authenticated/manual LinkedIn headline verification if profile copy will be reused.
