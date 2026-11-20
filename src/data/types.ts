export type Viewer = "recruiter" | "engineer" | "leader" | "explorer";

export type Priority = "low" | "medium" | "high";

export type ViewerPriority = Partial<Record<Viewer, Priority>>;

export type LinkStatus =
  | "verified"
  | "link-captured"
  | "manual-verification-needed"
  | "pending";

export type VerificationStatus = "verified" | "link-captured" | "resume-claimed";

export type MediaStatus = "pending" | "available";

export type ProjectStatus = "current" | "complete" | "published" | "observed";

export type EvidenceType =
  | "metric"
  | "project-detail"
  | "credential-url"
  | "publication-link"
  | "code-or-demo-link"
  | "sanitized-diagram"
  | "screenshot"
  | "testimonial-or-recommendation"
  | "learning-or-reflection";

export type EvidencePublicStatus =
  | "publicly-verifiable"
  | "sanitized-for-confidentiality"
  | "summarized-from-internal-work"
  | "credential-verified"
  | "evidence-still-being-collected"
  | "planned-public-artifact";

export type EvidenceConfidence = "high" | "medium" | "needs-review";

export type EvidenceNote = {
  claim: string;
  evidenceType: EvidenceType;
  source: string;
  publicStatus: EvidencePublicStatus;
  confidence: EvidenceConfidence;
  relatedProject: string;
  confidentialityBoundary: string;
};

export type TimelineCategory =
  | "education"
  | "publication"
  | "work"
  | "project"
  | "demo"
  | "recognition";

export type Importance = "low" | "medium" | "high" | "very-high";

export type FutureProjectStatus = "currently exploring" | "actively building";

export type PortfolioLink = {
  label: string;
  url: string | null;
  status: LinkStatus;
  note?: string;
};

export type SocialLink = {
  label: string;
  platform: string;
  url: string;
  icon: string;
  priority: number;
  viewerRelevance: readonly Viewer[];
  publicUse: string;
  status: LinkStatus;
};

export type ResumeDocument = {
  label: string;
  path: string | null;
  publicDefault: boolean;
  note: string;
};

export type RoleRecord = {
  title: string;
  organization: string;
  discipline: string;
  startDate: string;
  endDate: string;
  location?: string;
};

export type EducationRecord = {
  degree: string;
  institution: string;
  completionYear: string;
  cgpa: string;
};

export type PortfolioProfile = {
  name: string;
  displayName: string;
  headline: string;
  alternateHeadline: string;
  shortBio: string;
  expandedBio: string;
  location: string;
  email: string | null;
  resumeOnePage: ResumeDocument;
  resumeMaster: ResumeDocument;
  roles: readonly RoleRecord[];
  education: EducationRecord;
  socialLinks: readonly SocialLink[];
  viewerPositioning: Record<Viewer, string>;
  achievements: readonly string[];
};

export type MediaAsset = {
  label: string;
  type: "screenshot" | "diagram" | "thumbnail" | "citation-card" | "document";
  url: string | null;
  status: MediaStatus;
  note?: string;
};

export type Project = {
  title: string;
  slug: string;
  status: ProjectStatus;
  dates: string;
  type: string;
  publicSensitivity: string;
  summary: string;
  problem: string;
  architecture: string;
  stack: readonly string[];
  decisions: readonly string[];
  tradeoffs: string;
  impact: string;
  links: readonly PortfolioLink[];
  media: readonly MediaAsset[];
  evidenceNotes?: readonly EvidenceNote[];
  relatedSkills: readonly string[];
  relatedCredentials: readonly string[];
  timelineDate: string | null;
  viewerPriority: ViewerPriority;
};

export type Certification = {
  title: string;
  slug: string;
  issuer: string;
  category: string;
  date: string | null;
  expiry: string | null;
  credentialUrl: string | null;
  candidateCredentialUrls?: readonly string[];
  image: string | null;
  verificationStatus: VerificationStatus;
  relatedSkills: readonly string[];
  relatedProjects: readonly string[];
  group: string;
  note?: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  category: TimelineCategory;
  startDate: string | null;
  endDate: string | null;
  description: string;
  proofLinks: readonly PortfolioLink[];
  relatedProjects: readonly string[];
  relatedCertifications: readonly string[];
  importance: Importance;
  viewerPriority: ViewerPriority;
};

export type SkillCluster = {
  id: string;
  title: string;
  priority: number;
  portfolioRole: string;
  canonicalSkills: readonly string[];
  evidenceProjects: readonly string[];
  evidenceStrength: "medium" | "medium-high" | "high";
  proofPoints: readonly string[];
  relatedCredentials: readonly string[];
  publicFraming: string;
  viewerPriority: ViewerPriority;
};

export type ProofGraphEdge = {
  from: string;
  relationship: string;
  to: string;
};

export type FutureProject = {
  title: string;
  slug: string;
  concept: string;
  whyItMatters: string;
  plannedStack: readonly string[];
  plannedProof: readonly string[];
  status: FutureProjectStatus;
  targetOutcome: string;
  sourceBasis: readonly string[];
};
