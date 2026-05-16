import type { PortfolioLink, SocialLink } from "./types";

export const microsoftCredentialCandidateUrls = [
  "https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-1452/credentials/98a858605e1a0462?ref=https%3A%2F%2Fwww.linkedin.com%2F",
  "https://learn.microsoft.com/en-us/users/nirmalkumarpukazhenthi-8576/credentials/10ddec229a8ad859?ref=https%3A%2F%2Fwww.linkedin.com%2F"
] satisfies readonly string[];

export const databricksCredentialUrl =
  "https://credentials.databricks.com/7005c6fc-6aa7-47bc-bd61-4f1ccbaa13cf#acc.LXjiDu8c";

export const socialLinks = [
  {
    label: "LinkedIn",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/nirmalkumar6/",
    icon: "Linkedin",
    priority: 1,
    viewerRelevance: ["recruiter", "leader"],
    publicUse: "Primary professional social link; manual profile verification pending.",
    status: "manual-verification-needed"
  },
  {
    label: "GitHub",
    platform: "GitHub",
    url: "https://github.com/nirmalkcse",
    icon: "Github",
    priority: 2,
    viewerRelevance: ["engineer", "explorer"],
    publicUse: "Social/profile link only until repositories are curated.",
    status: "verified"
  },
  {
    label: "LeetCode",
    platform: "LeetCode",
    url: "https://leetcode.com/u/nirmalkcse/",
    icon: "Code2",
    priority: 3,
    viewerRelevance: ["engineer"],
    publicUse: "Low-emphasis social link only; automated request returned 403, so browser/manual verification is still needed.",
    status: "manual-verification-needed"
  },
  {
    label: "IEEE",
    platform: "IEEE Xplore",
    url: "https://ieeexplore.ieee.org/document/10544873",
    icon: "FileText",
    priority: 2,
    viewerRelevance: ["engineer", "explorer"],
    publicUse: "Publication proof link; exact publication metadata still pending.",
    status: "verified"
  }
] satisfies readonly SocialLink[];

export const credentialLinks = [
  {
    label: "Microsoft Learn credential candidate 1",
    url: microsoftCredentialCandidateUrls[0],
    status: "verified",
    note: "Exact mapping to DP-700 or DP-600 still needs rendered-page verification."
  },
  {
    label: "Microsoft Learn credential candidate 2",
    url: microsoftCredentialCandidateUrls[1],
    status: "verified",
    note: "Exact mapping to DP-700 or DP-600 still needs rendered-page verification."
  },
  {
    label: "Databricks credential candidate",
    url: databricksCredentialUrl,
    status: "verified",
    note: "Captured credential URL; exact metadata still needs manual verification."
  }
] satisfies readonly PortfolioLink[];

export const resumeLinks = [
  {
    label: "One-page resume source",
    url: null,
    status: "pending",
    note: "Source file captured locally; public hosting path is not decided yet."
  },
  {
    label: "Master resume source",
    url: null,
    status: "pending",
    note: "Deep-dive source only; not the default public resume download."
  }
] satisfies readonly PortfolioLink[];

export const publicationLinks = [
  {
    label: "IEEE article",
    url: "https://ieeexplore.ieee.org/document/10544873",
    status: "verified",
    note: "Exact citation metadata pending."
  }
] satisfies readonly PortfolioLink[];

export const allPortfolioLinks = [
  ...socialLinks.map(({ label, url, status, publicUse }) => ({
    label,
    url,
    status,
    note: publicUse
  })),
  ...credentialLinks,
  ...resumeLinks,
  ...publicationLinks
] satisfies readonly PortfolioLink[];
