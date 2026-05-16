/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  FileDown,
  Layers3,
  ShieldCheck
} from "lucide-react";
import { useMemo } from "react";
import { useRoleLens } from "@/context/role-lens-context";
import { profile } from "@/data";
import {
  getBalancedGatewayModel,
  getRoleGatewayModel,
  type RoleCta
} from "@/lib/role-lens";
import styles from "./cinematic-hero.module.css";

const proofSignals = [
  {
    label: "Source systems",
    value: "3",
    detail: "Telecom Fabric migration PoC"
  },
  {
    label: "Daily incrementals",
    value: "18-24",
    detail: "Tables supported in migration flow"
  },
  {
    label: "Report trust",
    value: "90%",
    detail: "Fewer validation discrepancies"
  },
  {
    label: "BI coverage",
    value: "15+",
    detail: "Reports validated for migration"
  }
] as const;

const proofPath = [
  "Fabric lakehouse",
  "Databricks data product",
  "Power BI trust layer",
  "Governance trail"
] as const;

export function CinematicHero() {
  const { isHydrated, role } = useRoleLens();
  const activeModel = useMemo(
    () => (role ? getRoleGatewayModel(role) : getBalancedGatewayModel()),
    [role]
  );
  const activeLabel = isHydrated ? activeModel.label : "Balanced";

  return (
    <section
      aria-labelledby="home-title"
      className={styles.hero}
      data-lens={role ?? "balanced"}
      id="home"
    >
      <div className={styles.scene} aria-hidden="true">
        <span className={styles.thread} />
        <span className={styles.scanline} />
        <span className={styles.topRule} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <img
            alt=""
            className={styles.wordmark}
            decoding="async"
            fetchPriority="high"
            height={96}
            loading="eager"
            src="/assets/brand/nk-threadline-wordmark-one-color-ivory.svg"
            width={420}
          />

          <p className={styles.eyebrow}>Data engineering portfolio</p>

          <h1 className={styles.title} id="home-title">
            {profile.displayName}
          </h1>

          <p className={styles.headline}>{profile.headline}</p>
          <p className={styles.summary}>{profile.shortBio}</p>

          <div className={styles.actions} aria-label={`${activeLabel} hero actions`}>
            {activeModel.ctas.map((cta, index) => (
              <HeroCta cta={cta} index={index} key={`${cta.label}-${cta.href}`} />
            ))}
          </div>

          <Link className={styles.roleCue} href="#role-gateway">
            <ArrowDown aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{activeLabel} lens active</span>
          </Link>
        </div>

        <div className={styles.visual} aria-label="Portfolio proof signals">
          <div className={styles.identityStage}>
            <img
              alt=""
              className={styles.avatar}
              decoding="async"
              height={512}
              loading="eager"
              src="/assets/brand/social-avatar.svg"
              width={512}
            />

            <div className={styles.stageCopy}>
              <span className={styles.stageLabel}>Gold Thread</span>
              <strong>Proof-backed systems, carried end to end.</strong>
            </div>
          </div>

          <ul className={styles.proofGrid}>
            {proofSignals.map((signal) => (
              <li
                aria-label={`${signal.label}: ${signal.value}. ${signal.detail}.`}
                className={styles.proofItem}
                key={signal.label}
              >
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <em>{signal.detail}</em>
              </li>
            ))}
          </ul>

          <ol className={styles.proofPath} aria-label="Core proof path">
            {proofPath.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

type HeroCtaProps = {
  cta: RoleCta;
  index: number;
};

function HeroCta({ cta, index }: HeroCtaProps) {
  return (
    <Link
      className={styles.cta}
      data-emphasis={index === 0 ? "primary" : cta.emphasis}
      href={cta.href}
    >
      <span>{cta.label}</span>
      {renderCtaIcon(cta)}
    </Link>
  );
}

function renderCtaIcon(cta: RoleCta) {
  const iconProps = {
    "aria-hidden": true,
    size: 16,
    strokeWidth: 1.8
  } as const;

  if (cta.href === "/resume") {
    return <FileDown {...iconProps} />;
  }

  if (cta.href === "/certifications") {
    return <ShieldCheck {...iconProps} />;
  }

  if (cta.href.startsWith("/projects")) {
    return <Layers3 {...iconProps} />;
  }

  return <ArrowRight {...iconProps} />;
}
