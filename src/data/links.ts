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
    publicUse: "Primary professional social link.",
    status: "manual-verification-needed"
  },
  {
    label: "GitHub",
    platform: "GitHub",
    url: "https://github.com/nirmalkcse",
    icon: "Github",
    priority: 2,
    viewerRelevance: ["engineer", "explorer"],
    publicUse: "Engineering profile link with selected repository context.",
    status: "verified"
  },
  {
    label: "LeetCode",
    platform: "LeetCode",
    url: "https://leetcode.com/u/nirmalkcse/",
    icon: "Code2",
    priority: 3,
    viewerRelevance: ["engineer"],
    publicUse: "Coding practice profile for supporting technical context.",
    status: "manual-verification-needed"
  },
  {
    label: "IEEE",
    platform: "IEEE Xplore",
    url: "https://ieeexplore.ieee.org/document/10544873",
    icon: "FileText",
    priority: 2,
    viewerRelevance: ["engineer", "explorer"],
    publicUse: "Publication reference link.",
    status: "verified"
  }
] satisfies readonly SocialLink[];

export const credentialLinks = [
  {
    label: "Microsoft Learn credential candidate 1",
    url: microsoftCredentialCandidateUrls[0],
    status: "verified",
    note: "Confirm exact DP-700 or DP-600 mapping before using as a direct credential link."
  },
  {
    label: "Microsoft Learn credential candidate 2",
    url: microsoftCredentialCandidateUrls[1],
    status: "verified",
    note: "Confirm exact DP-700 or DP-600 mapping before using as a direct credential link."
  },
  {
    label: "Databricks credential candidate",
    url: databricksCredentialUrl,
    status: "verified",
    note: "Credential URL available; confirm exact issue and expiry dates on the public page."
  }
] satisfies readonly PortfolioLink[];

export const resumeLinks = [
  {
    label: "One-page resume source",
    url: null,
    status: "pending",
    note: "One-page resume download is available through the site document route."
  },
  {
    label: "Master resume source",
    url: null,
    status: "pending",
    note: "Expanded master resume; not the default public resume download."
  }
] satisfies readonly PortfolioLink[];

export const publicationLinks = [
  {
    label: "IEEE article",
    url: "https://ieeexplore.ieee.org/document/10544873",
    status: "verified",
    note: "Public IEEE article."
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
