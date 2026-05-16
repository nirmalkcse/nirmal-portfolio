/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, FileDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { plannedRoutes } from "@/lib/constants/routes";

const primaryRoutes = plannedRoutes.filter((route) => route.showInPrimaryNav);
const utilityRoutes = plannedRoutes.filter((route) => !route.showInPrimaryNav);

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const activeLink = activeLinkRef.current;
    const nav = navRef.current;

    if (!activeLink || !nav || nav.scrollWidth <= nav.clientWidth) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    activeLink.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-obsidian)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--layout-wide-max)] flex-wrap items-center gap-3 px-[var(--layout-gutter)] py-3 xl:flex-nowrap xl:justify-between">
        <Link
          aria-label="Nirmal Kumar home"
          className="group order-1 mr-auto inline-flex min-h-10 min-w-0 items-center gap-3 rounded-[var(--radius-control)] pr-3 xl:mr-0"
          href="/"
          prefetch={false}
        >
          <img
            alt=""
            className="h-8 w-auto"
            height={48}
            loading="eager"
            src="/assets/brand/nk-threadline-monogram-one-color-ivory.svg"
            width={48}
          />
          <span className="grid leading-none">
            <span className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-ivory)]">
              {profile.displayName}
            </span>
            <span className="mt-1 hidden font-mono text-[var(--text-micro)] text-[var(--color-warm-silver)] sm:block">
              Data engineering portfolio
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary portfolio navigation"
          className="order-3 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:order-2 xl:w-auto xl:flex-1 xl:flex-wrap xl:justify-center xl:overflow-visible xl:pb-0"
          ref={navRef}
        >
          {primaryRoutes.map((route) => {
            const isActive = isActiveRoute(pathname, route.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`motion-lens-choice inline-flex min-h-9 shrink-0 items-center rounded-[var(--radius-control)] border px-3 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
                  isActive
                    ? "border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_16%,transparent)] text-[var(--color-ivory)]"
                    : "border-transparent text-[var(--color-warm-silver)] hover:border-[var(--border-subtle)] hover:bg-[color-mix(in_srgb,var(--color-carbon)_74%,transparent)] hover:text-[var(--color-ivory-soft)]"
                }`}
                href={route.href}
                key={route.href}
                prefetch={false}
                ref={isActive ? activeLinkRef : undefined}
              >
                {route.shortLabel}
              </Link>
            );
          })}
        </nav>

        <Link
          className="motion-cta order-2 inline-flex min-h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-carbon)_76%,var(--color-antique-gold))] px-4 text-sm font-semibold text-[var(--color-ivory)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:bg-[color-mix(in_srgb,var(--color-carbon)_64%,var(--color-antique-gold))] xl:order-3"
          href="/resume"
          prefetch={false}
        >
          <FileDown aria-hidden="true" className="h-4 w-4" />
          Resume
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_42%,transparent)]">
      <div className="mx-auto grid max-w-[var(--layout-wide-max)] gap-8 px-[var(--layout-gutter)] py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_minmax(220px,0.7fr)]">
        <div>
          <Link
            aria-label="Nirmal Kumar home"
            className="hidden-delight-footer-mark inline-flex items-center gap-3 rounded-[var(--radius-control)]"
            href="/"
            prefetch={false}
          >
            <img
              alt=""
              className="h-9 w-auto"
              height={48}
              loading="lazy"
              src="/assets/brand/nk-threadline-monogram-one-color-ivory.svg"
              width={48}
            />
            <span className="font-[var(--font-display)] text-base font-semibold text-[var(--color-ivory)]">
              {profile.displayName}
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--color-warm-silver)]">
            {profile.headline}
          </p>
        </div>

        <nav
          aria-label="Portfolio route index"
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plannedRoutes.map((route) => (
            <Link
              className="motion-card group rounded-[var(--radius-control)] border border-transparent px-3 py-2 transition duration-[var(--duration-feedback)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-panel)]"
              href={route.href}
              key={route.href}
              prefetch={false}
            >
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-[var(--color-ivory-soft)]">
                {route.shortLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                />
              </span>
              <span className="mt-1 block text-xs leading-5 text-[var(--color-warm-silver)]">
                {route.description}
              </span>
            </Link>
          ))}
        </nav>

        <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-4">
          <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
            Utility
          </p>
          <div className="mt-3 grid gap-2">
            {utilityRoutes.map((route) => (
              <Link
                className="motion-cta inline-flex min-h-9 items-center justify-between gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)] transition hover:border-[var(--border-gold)]"
                href={route.href}
                key={route.href}
                prefetch={false}
              >
                {route.label}
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
