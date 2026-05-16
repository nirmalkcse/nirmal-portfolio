# Data Models

These schemas will guide `src/data/*` implementation.

## Profile

Fields:

- name
- headline
- shortBio
- location
- email
- resumeOnePage
- resumeMaster
- roles
- socialLinks

## Social Link

Fields:

- label
- platform
- url
- icon
- priority
- viewerRelevance

## Project

Fields:

- title
- slug
- status
- type
- summary
- problem
- architecture
- stack
- decisions
- tradeoffs
- impact
- links
- media
- relatedSkills
- relatedCredentials
- timelineDate
- viewerPriority

## Certification

Fields:

- title
- issuer
- category
- date
- expiry
- credentialUrl
- image
- verificationStatus
- relatedSkills
- relatedProjects

## Timeline Event

Fields:

- id
- title
- category
- startDate
- endDate
- description
- proofLinks
- relatedProjects
- relatedCertifications
- importance
- viewerPriority

## Future Project

Fields:

- title
- concept
- whyItMatters
- plannedStack
- plannedProof
- status
- targetOutcome

Public status language should prefer "currently exploring" unless a project is actively being built.

## Document Packet

Fields:

- title
- slug
- audience
- description
- sourceDocuments
- includedProjects
- includedCredentials
- format
- downloadUrl
- generatedAt

