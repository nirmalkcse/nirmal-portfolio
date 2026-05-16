# Certificate Asset Staging

This folder is for public-safe credential assets only. Do not place raw downloads, private screenshots, signed-in browser captures, or files containing hidden/private metadata here.

## Folder Map

| Folder | Use | Public-Safety Rule |
|---|---|---|
| `thumbnails/{credential-slug}/` | Cropped certificate thumbnails for the certification console | Hide credential IDs, certificate numbers, email, account UI, and browser chrome unless explicitly approved |
| `verification-screenshots/` | Public verification-page screenshots used as proof references | Capture only public pages; crop to credential name, issuer, owner name, status, and date when safe |
| `proof-packets/` | Future public credential proof packets | Include only verified public links and approved thumbnails/screenshots |

## Filename Convention

Use lowercase kebab-case:

`{credential-slug}-{asset-type}-{public-status}.{ext}`

Examples:

- `microsoft-fabric-analytics-engineer-associate-dp-600-thumbnail-approved.png`
- `databricks-uc-upgrade-delivery-specialization-verification-cropped.png`
- `credential-proof-packet-public-v1.pdf`

## Intake Checklist

- [ ] Source is a public verification page or an explicitly approved user-supplied asset.
- [ ] No private client/internal data is visible.
- [ ] No account menu, session token, signed-in browser state, internal URL, or email is visible.
- [ ] Credential IDs and certificate numbers are hidden unless the portfolio intentionally exposes them in a verification-detail view.
- [ ] Source URL and verification status are recorded in `docs/content/source-links.md`.
- [ ] Asset is compressed enough for web use and has descriptive alt-text ready before UI wiring.
