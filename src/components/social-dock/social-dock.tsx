/* eslint-disable @next/next/no-img-element */
import { BookOpenCheck, ExternalLink, Plus } from "lucide-react";
import type { ReactElement } from "react";
import {
  credentialLinks,
  publicationLinks,
  socialLinks
} from "@/data/links";
import type { LinkStatus, Viewer } from "@/data/types";
import styles from "./social-dock.module.css";

type DockIconProps = {
  className?: string;
};

type DockLinkItem = {
  kind: "link";
  id: string;
  label: string;
  href: string;
  icon: (props: DockIconProps) => ReactElement;
  status: LinkStatus;
  description: string;
  viewerRelevance: readonly Viewer[];
  priority: number;
  count?: number;
};

type DockSlotItem = {
  kind: "slot";
  id: string;
  label: string;
  description: string;
};

type DockItem = DockLinkItem | DockSlotItem;

type SocialDockProps = {
  viewer?: Viewer;
  showFutureSlots?: boolean;
  className?: string;
};

const statusCopy: Record<LinkStatus, string> = {
  verified: "Verified",
  "link-captured": "Link captured",
  "manual-verification-needed": "Manual check needed",
  pending: "Pending"
};

const futureSlots: readonly DockSlotItem[] = [
  {
    kind: "slot",
    id: "future-kaggle",
    label: "Kaggle",
    description: "Reserved for a future public learning or notebook profile."
  },
  {
    kind: "slot",
    id: "future-hugging-face",
    label: "HF",
    description: "Reserved for future model, dataset, or agent demos."
  },
  {
    kind: "slot",
    id: "future-writing",
    label: "Writing",
    description: "Reserved for future technical writing profiles."
  }
];

function LinkedinIcon({ className }: DockIconProps) {
  return <DockGlyph className={className} label="in" />;
}

function GithubIcon({ className }: DockIconProps) {
  return <DockGlyph className={className} label="GH" />;
}

function MicrosoftLearnIcon({ className }: DockIconProps) {
  return (
    <BookOpenCheck aria-hidden="true" className={className} strokeWidth={1.8} />
  );
}

function DatabricksIcon({ className }: DockIconProps) {
  return <DockGlyph className={className} label="DB" />;
}

function IeeeIcon({ className }: DockIconProps) {
  return <DockGlyph className={className} label="IEEE" />;
}

function LeetCodeIcon({ className }: DockIconProps) {
  return <DockGlyph className={className} label="LC" />;
}

function FutureSlotIcon({ className }: DockIconProps) {
  return <Plus aria-hidden="true" className={className} strokeWidth={1.8} />;
}

function DockGlyph({ className, label }: DockIconProps & { label: string }) {
  return (
    <span aria-hidden="true" className={`${className ?? ""} ${styles.iconGlyph}`}>
      {label}
    </span>
  );
}

function findSocialLink(label: string) {
  return socialLinks.find((link) => link.label === label);
}

function dockLink(item: Omit<DockLinkItem, "kind">): DockLinkItem {
  return {
    kind: "link",
    ...item
  };
}

function buildDockItems(): readonly DockLinkItem[] {
  const linkedin = findSocialLink("LinkedIn");
  const github = findSocialLink("GitHub");
  const leetcode = findSocialLink("LeetCode");
  const ieeeSocial = findSocialLink("IEEE");
  const ieeePublication = publicationLinks.find((link) =>
    link.label.toLowerCase().includes("ieee")
  );
  const microsoftLinks = credentialLinks.filter((link) =>
    link.label.startsWith("Microsoft Learn")
  );
  const databricks = credentialLinks.find((link) =>
    link.label.toLowerCase().includes("databricks")
  );

  const items: Array<DockLinkItem | null> = [
    linkedin
      ? dockLink({
          id: "linkedin",
          label: linkedin.label,
          href: linkedin.url,
          icon: LinkedinIcon,
          status: linkedin.status,
          description: linkedin.publicUse,
          viewerRelevance: linkedin.viewerRelevance,
          priority: linkedin.priority
        })
      : null,
    github
      ? dockLink({
          id: "github",
          label: github.label,
          href: github.url,
          icon: GithubIcon,
          status: github.status,
          description: github.publicUse,
          viewerRelevance: github.viewerRelevance,
          priority: github.priority
        })
      : null,
    microsoftLinks[0]?.url
      ? dockLink({
          id: "microsoft-learn",
          label: "Microsoft Learn",
          href: microsoftLinks[0].url,
          icon: MicrosoftLearnIcon,
          status: microsoftLinks[0].status,
          description: `${microsoftLinks.length} credential links captured from Microsoft Learn.`,
          viewerRelevance: ["recruiter", "engineer", "leader"] as const,
          priority: 2,
          count: microsoftLinks.length
        })
      : null,
    databricks?.url
      ? dockLink({
          id: "databricks",
          label: "Databricks",
          href: databricks.url,
          icon: DatabricksIcon,
          status: databricks.status,
          description: databricks.note ?? "Databricks credential proof link.",
          viewerRelevance: ["recruiter", "engineer", "leader"] as const,
          priority: 2
        })
      : null,
    ieeeSocial || ieeePublication?.url
      ? dockLink({
          id: "ieee",
          label: "IEEE",
          href: ieeeSocial?.url ?? ieeePublication?.url ?? "",
          icon: IeeeIcon,
          status: ieeeSocial?.status ?? ieeePublication?.status ?? "pending",
          description:
            ieeeSocial?.publicUse ??
            ieeePublication?.note ??
            "Publication proof link.",
          viewerRelevance: ieeeSocial?.viewerRelevance ?? [
            "engineer",
            "explorer"
          ] as const,
          priority: ieeeSocial?.priority ?? 2
        })
      : null,
    leetcode
      ? dockLink({
          id: "leetcode",
          label: leetcode.label,
          href: leetcode.url,
          icon: LeetCodeIcon,
          status: leetcode.status,
          description: leetcode.publicUse,
          viewerRelevance: leetcode.viewerRelevance,
          priority: leetcode.priority
        })
      : null
  ];

  return items.filter((item): item is DockLinkItem => Boolean(item));
}

export const socialDockItems: readonly DockLinkItem[] = buildDockItems();

function isEmphasized(item: DockLinkItem, viewer: Viewer) {
  return item.viewerRelevance.includes(viewer) || item.priority === 1;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SocialDock({
  viewer = "recruiter",
  showFutureSlots = true,
  className
}: SocialDockProps) {
  const items: readonly DockItem[] = showFutureSlots
    ? [...socialDockItems, ...futureSlots]
    : socialDockItems;

  return (
    <aside className={cx(styles.shell, className)} aria-label="Profile dock">
      <nav className={styles.rail} aria-label="External profile and proof links">
        <span className={styles.brandMark} aria-hidden="true">
          <img
            alt=""
            height="28"
            loading="lazy"
            src="/assets/brand/nk-threadline-monogram-one-color-ivory.svg"
            width="28"
          />
        </span>

        <ul className={styles.list}>
          {items.map((item) => {
            const tooltipId = `social-dock-${item.id}-tooltip`;

            return (
              <li className={styles.item} key={item.id}>
                {item.kind === "link" ? (
                  <a
                    aria-describedby={tooltipId}
                    aria-label={`${item.label}. ${item.description} ${statusCopy[item.status]}. Opens in a new tab.`}
                    className={styles.control}
                    data-emphasis={isEmphasized(item, viewer)}
                    data-status={item.status}
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className={styles.iconFrame}>
                      <item.icon className={styles.icon} />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    {item.count ? (
                      <span
                        aria-label={`${item.count} links`}
                        className={styles.count}
                      >
                        {item.count}
                      </span>
                    ) : null}
                    <span className={styles.statusDot} aria-hidden="true" />
                    <ExternalLink
                      aria-hidden="true"
                      className={styles.externalIcon}
                      strokeWidth={1.8}
                    />
                    <span className={styles.tooltip} id={tooltipId} role="tooltip">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                      <em>{statusCopy[item.status]}</em>
                    </span>
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    aria-describedby={tooltipId}
                    aria-label={`${item.label}. ${item.description}`}
                    className={cx(styles.control, styles.slot)}
                    role="link"
                  >
                    <span className={styles.iconFrame}>
                      <FutureSlotIcon className={styles.icon} />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.tooltip} id={tooltipId} role="tooltip">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                      <em>Reserved slot</em>
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
