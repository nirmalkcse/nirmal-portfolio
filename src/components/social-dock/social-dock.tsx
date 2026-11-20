"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { useRef, type ReactElement } from "react";
import { motion } from "framer-motion";
import { useHeroReveal } from "@/context/hero-reveal-context";
import { useOnDarkSurface } from "@/hooks/use-on-dark-surface";
import {
  credentialLinks,
  publicationLinks,
  socialLinks
} from "@/data/links";
import type { LinkStatus, Viewer } from "@/data/types";
import { Logo } from "@/components/brand/logo";
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

const dockIconSources = {
  databricks: "/assets/social-dock/databricks.png",
  github: "/assets/social-dock/github.png",
  ieee: "/assets/social-dock/ieee.png",
  leetcode: "/assets/social-dock/leetcode.png",
  // Same mark with only the black bracket turned white — orange and grey are
  // pixel-identical. Cross-faded in when the dock sits on a dark surface.
  leetcodeOnDark: "/assets/social-dock/leetcode-on-dark.png",
  linkedin: "/assets/social-dock/linkedin.png",
  microsoftLearn: "/assets/social-dock/microsoft-learn.png"
} as const;

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
  return <DockAssetIcon className={className} src={dockIconSources.linkedin} />;
}

function GithubIcon({ className }: DockIconProps) {
  return <DockAssetIcon className={className} src={dockIconSources.github} />;
}

function MicrosoftLearnIcon({ className }: DockIconProps) {
  return <DockAssetIcon className={className} src={dockIconSources.microsoftLearn} />;
}

function DatabricksIcon({ className }: DockIconProps) {
  return <DockAssetIcon className={className} src={dockIconSources.databricks} />;
}

function IeeeIcon({ className }: DockIconProps) {
  return <DockAssetIcon className={className} src={dockIconSources.ieee} />;
}

function LeetCodeIcon({ className }: DockIconProps) {
  return (
    <span className={styles.swapIcon}>
      <DockAssetIcon
        className={`${className ?? ""} ${styles.swapIconBase}`}
        src={dockIconSources.leetcode}
      />
      <DockAssetIcon
        className={`${className ?? ""} ${styles.swapIconAlt}`}
        src={dockIconSources.leetcodeOnDark}
      />
    </span>
  );
}

function FutureSlotIcon({ className }: DockIconProps) {
  return <Plus aria-hidden="true" className={className} strokeWidth={1.8} />;
}

function DockAssetIcon({ className, src }: DockIconProps & { src: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`${className ?? ""} ${styles.iconImage}`}
      height={24}
      src={src}
      unoptimized
      width={24}
    />
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
          description: `${microsoftLinks.length} Microsoft Learn credential links available.`,
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
          description: databricks.note ?? "Databricks credential reference link.",
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
            "Publication reference link.",
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
  showFutureSlots = false,
  className
}: SocialDockProps) {
  const pathname = usePathname();
  const { isRevealed } = useHeroReveal();
  const shellRef = useRef<HTMLElement | null>(null);
  // Whether the page surface behind the dock is currently dark — drives the
  // GitHub mark's flip to white so it stays visible over dark sections.
  const onDarkSurface = useOnDarkSurface(shellRef);
  const items: readonly DockItem[] = showFutureSlots
    ? [...socialDockItems, ...futureSlots]
    : socialDockItems;

  if ((pathname === "/" && !isRevealed) || pathname === "/profile") {
    return null;
  }

  return (
    <motion.aside
      ref={shellRef}
      className={cx(styles.shell, className)}
      data-on-dark={onDarkSurface}
      aria-label="Profile dock"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: pathname === "/" ? 1.0 : 0 }}
    >
      <nav className={styles.rail} aria-label="External profile and credential links">
        <span className={styles.brandMark} aria-hidden="true">
          <span aria-hidden="true" className={styles.brandPulse} />
          <Logo isMonogram={true} />
        </span>

        <ul className={styles.list}>
          {items.map((item) => {
            const tooltipId = `social-dock-${item.id}-tooltip`;

            return (
              <li className={styles.item} key={item.id}>
                {item.kind === "link" ? (
                  <a
                    aria-describedby={tooltipId}
                    aria-label={`${item.label}. ${item.description} Opens in a new tab.`}
                    className={styles.control}
                    data-id={item.id}
                    data-emphasis={isEmphasized(item, viewer)}
                    data-status={item.status}
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className={styles.controlSheen} aria-hidden="true" />
                    <span className={styles.iconFrame}>
                      <item.icon className={styles.icon} />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.statusDot} aria-hidden="true" />
                    <ExternalLink
                      aria-hidden="true"
                      className={styles.externalIcon}
                      strokeWidth={1.8}
                    />
                    <span className={styles.tooltip} id={tooltipId} role="tooltip">
                      <strong>{item.label}</strong>
                    </span>
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    aria-describedby={tooltipId}
                    aria-label={`${item.label}. ${item.description}`}
                    className={cx(styles.control, styles.slot)}
                    data-id={item.id}
                    role="link"
                  >
                    <span className={styles.controlSheen} aria-hidden="true" />
                    <span className={styles.iconFrame}>
                      <FutureSlotIcon className={styles.icon} />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.tooltip} id={tooltipId} role="tooltip">
                      <strong>{item.label}</strong>
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}

