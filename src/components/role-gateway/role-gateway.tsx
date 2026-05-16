"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRoleLens } from "@/context/role-lens-context";
import {
  getBalancedGatewayModel,
  getRoleGatewayModel,
  roleOrder,
  type RoleCta,
  type RoleGatewayModel
} from "@/lib/role-lens";
import styles from "./role-gateway.module.css";

const roleModels = roleOrder.map((role) => getRoleGatewayModel(role));
const ROLE_GATEWAY_DETAIL_ID = "role-gateway-detail";

export function RoleGateway() {
  const { clearRole, isHydrated, role, setRole } = useRoleLens();
  const activeModel = useMemo(
    () => (role ? getRoleGatewayModel(role) : getBalancedGatewayModel()),
    [role]
  );
  const activeLabel = isHydrated ? activeModel.label : "Balanced";

  return (
    <section
      aria-labelledby="role-gateway-title"
      className={`${styles.section} motion-section gold-thread-section`}
      id="role-gateway"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Soft role lens</p>
            <h2 className={styles.title} id="role-gateway-title">
              Choose how the proof should lean.
            </h2>
            <p className={styles.copy}>
              This lens changes emphasis and next steps without blocking the
              rest of the portfolio. Keeping the balanced path is always valid.
            </p>
          </div>

          <div className={`${styles.statusPanel} motion-panel-enter`} aria-live="polite">
            <span className={styles.statusLabel}>Active lens</span>
            <strong>{activeLabel}</strong>
            <button
              aria-controls={ROLE_GATEWAY_DETAIL_ID}
              aria-pressed={role === null}
              className={`${styles.skipButton} motion-cta motion-lens-choice`}
              data-selected={role === null}
              onClick={clearRole}
              type="button"
            >
              Keep balanced
            </button>
          </div>
        </div>

        <div
          aria-label="Role lens options"
          className={`${styles.cardGrid} motion-list`}
          role="group"
        >
          {roleModels.map((model) => (
            <RoleCard
              isSelected={role === model.role}
              key={model.role}
              model={model}
              onSelect={() => setRole(model.role)}
            />
          ))}
        </div>

        <div
          aria-labelledby={`${ROLE_GATEWAY_DETAIL_ID}-title`}
          aria-live="polite"
          className={`${styles.detailPanel} motion-detail-swap`}
          id={ROLE_GATEWAY_DETAIL_ID}
          key={activeModel.label}
          role="region"
        >
          <div className={styles.detailCopy}>
            <p className={styles.detailEyebrow}>{activeModel.eyebrow}</p>
            <h3
              className={styles.detailTitle}
              id={`${ROLE_GATEWAY_DETAIL_ID}-title`}
            >
              {activeModel.title}
            </h3>
            <p className={styles.detailSummary}>{activeModel.summary}</p>
            <p className={styles.nextStep}>{activeModel.nextStep}</p>

            <div className={styles.actions} aria-label={`${activeLabel} actions`}>
              {activeModel.ctas.map((cta) => (
                <CtaLink cta={cta} key={`${cta.label}-${cta.href}`} />
              ))}
            </div>

            <div
              aria-label="Change role lens"
              className={styles.switcher}
              role="group"
            >
              <button
                aria-controls={ROLE_GATEWAY_DETAIL_ID}
                aria-pressed={role === null}
                className={`${styles.switcherButton} motion-lens-choice`}
                data-selected={role === null}
                onClick={clearRole}
                type="button"
              >
                Balanced
              </button>
              {roleModels.map((model) => (
                <button
                  aria-controls={ROLE_GATEWAY_DETAIL_ID}
                  aria-pressed={role === model.role}
                  className={`${styles.switcherButton} motion-lens-choice`}
                  data-selected={role === model.role}
                  key={model.role}
                  onClick={() => setRole(model.role)}
                  type="button"
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.evidencePanel}>
            <p className={styles.evidenceTitle}>Featured proof for this lens</p>
            <ul className={styles.evidenceList}>
              {activeModel.evidence.map((item) => (
                <li className={styles.evidenceItem} key={`${item.kind}-${item.label}`}>
                  <span className={styles.evidenceKind}>{item.kind}</span>
                  <Link className={styles.evidenceLink} href={item.href}>
                    {item.label}
                  </Link>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

type RoleCardProps = {
  model: RoleGatewayModel;
  isSelected: boolean;
  onSelect: () => void;
};

function RoleCard({ isSelected, model, onSelect }: RoleCardProps) {
  return (
    <button
      aria-controls={ROLE_GATEWAY_DETAIL_ID}
      aria-pressed={isSelected}
      className={`${styles.card} motion-card motion-lens-choice`}
      data-role={model.role}
      data-selected={isSelected}
      onClick={onSelect}
      type="button"
    >
      <span className={styles.cardTopline}>
        <span className={styles.cardLabel}>{model.label}</span>
        <span className={styles.cardState}>
          {isSelected ? "Selected" : "Choose"}
        </span>
      </span>
      <span className={styles.cardTitle}>{model.cardTitle}</span>
      <span className={styles.cardSummary}>{model.cardSummary}</span>
      <span className={styles.cardProof}>
        <span>{model.cardProofLabel}</span>
        {model.cardProofValue}
      </span>
    </button>
  );
}

type CtaLinkProps = {
  cta: RoleCta;
};

function CtaLink({ cta }: CtaLinkProps) {
  return (
    <Link
      className={`${styles.cta} motion-cta`}
      data-emphasis={cta.emphasis}
      href={cta.href}
    >
      {cta.label}
    </Link>
  );
}
