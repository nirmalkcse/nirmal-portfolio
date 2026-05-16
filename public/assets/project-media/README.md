# Project Media Asset Staging

This folder is for approved public portfolio media. Do not stage raw client/internal screenshots, private source documents, exported dashboards with real data, internal diagrams, or files containing hidden/private metadata here.

## Folder Map

| Folder | Use | Public-Safety Rule |
|---|---|---|
| `{project-slug}/screenshots/` | Sanitized UI/report/workflow screenshots | Use synthetic data, redactions, or recreated visuals only |
| `{project-slug}/diagrams/` | Public-safe architecture, workflow, and validation diagrams | Use generic system labels; avoid private source names, client logos, hostnames, and table names |
| `{project-slug}/proof-packet/` | Project-specific proof packet assets | Include only approved public media and source references |
| `_shared/sanitized-architecture/` | Reusable architecture visuals across pages | Keep diagrams abstract enough for homepage/proof graph reuse |
| `_shared/proof-packets/` | Cross-project proof packets | Confirm every included asset has an approved source note |

## Filename Convention

Use lowercase kebab-case:

`{project-slug}-{asset-purpose}-{public-status}.{ext}`

Examples:

- `telecom-fabric-migration-poc-medallion-architecture-approved.svg`
- `bi-migration-validation-analytics-validation-matrix-redacted.png`
- `icore-enterprise-mdm-entity-resolution-workflow-synthetic.png`

## Intake Checklist

- [ ] Client names and logos are removed unless already public and explicitly approved.
- [ ] Internal product names, source-system names, workspace names, hostnames, URLs, table names, and code paths are removed or generalized.
- [ ] Dataset rows, employee/customer names, emails, IDs, account numbers, financial values, tokens, and secrets are absent.
- [ ] Visual either uses synthetic data or is recreated as a sanitized diagram.
- [ ] Permission/source status is recorded in `docs/content/source-links.md`.
- [ ] Asset has a planned alt-text line and a target UI surface before final wiring.
