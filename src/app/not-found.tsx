import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  FileDown,
  FileSearch,
  Home,
  Route
} from "lucide-react";
import { profile } from "@/data";
import { plannedRoutes } from "@/lib/constants/routes";

const recoveryRouteOrder = ["/projects", "/proof", "/certifications", "/resume"] as const;

const recoveryRoutes = recoveryRouteOrder
  .map((href) => plannedRoutes.find((route) => route.href === href))
  .filter((route): route is NonNullable<typeof route> => Boolean(route));

const recoverySignals = [
  {
    value: "404",
    label: "Route status",
    detail: "Requested path is outside the public index."
  },
  {
    value: "Work",
    label: "Best recovery",
    detail: "Case studies restore context fastest."
  },
  {
    value: "Resume",
    label: "Review route",
    detail: "One-page handoff remains available."
  }
] as const;

export const metadata: Metadata = {
  title: "Route not found | Nirmal Kumar",
  description:
    "The requested portfolio route was not found. Continue to Nirmal Kumar's work, skills, credentials, resume, or contact page.",
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <main
      className="relative isolate overflow-hidden px-[var(--layout-gutter)] pb-12 pt-[calc(var(--site-header-offset)+var(--space-5))]"
      id="main-content"
      tabIndex={-1}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[var(--site-header-offset)] h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-antique-gold)_42%,transparent),transparent)]"
      />
      {/* The numeral, set once and very large, as an outline behind the page. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] m-0 select-none text-[clamp(14rem,42vw,40rem)] font-light leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--color-lacquer-soft)_22%,transparent)] [font-family:var(--font-serif)]"
      >
        404
      </p>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[24rem] w-[min(66rem,92vw)] -translate-x-1/2 rounded-[var(--radius-panel)] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-antique-gold)_13%,transparent),transparent_68%)] blur-3xl"
      />

      <section className="relative mx-auto grid min-h-[calc(100svh-var(--site-header-offset)-4rem)] max-w-[var(--layout-wide-max)] gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.54fr)] lg:items-center lg:py-16">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_72%,transparent)] px-3 font-mono text-xs uppercase text-[var(--color-antique-gold)]">
              <Compass aria-hidden="true" className="h-4 w-4" />
              Route recovery
            </span>
            <span className="inline-flex h-10 items-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ink-muted)]">
              Portfolio index remains online
            </span>
          </div>

          <h1 className="editorial-title editorial-title--section mt-7 max-w-4xl">
            This route is <em>outside</em> the portfolio index<span className="editorial-accent">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-ink-muted)] sm:text-lg">
            The requested page is unavailable, but the public review path is
            intact. Continue through the work, proof, credentials, or resume
            routes below.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="motion-cta inline-flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_16%,transparent)] px-4 text-sm font-semibold text-[var(--color-ink-strong)] transition hover:bg-[color-mix(in_srgb,var(--color-antique-gold)_22%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-gold)] sm:min-w-44"
              href="/projects"
              prefetch={false}
            >
              <span className="inline-flex items-center gap-2">
                <FileSearch aria-hidden="true" className="h-4 w-4" />
                Open work
              </span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
            <Link
              className="motion-card inline-flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_62%,transparent)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--border-gold)] hover:bg-[color-mix(in_srgb,var(--surface-panel)_82%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-gold)] sm:min-w-44"
              href="/"
              prefetch={false}
            >
              <span className="inline-flex items-center gap-2">
                <Home aria-hidden="true" className="h-4 w-4" />
                Return home
              </span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
            <Link
              className="motion-card inline-flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_44%,transparent)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--border-gold)] hover:bg-[color-mix(in_srgb,var(--surface-panel)_76%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-gold)] sm:min-w-44"
              href="/resume"
              prefetch={false}
            >
              <span className="inline-flex items-center gap-2">
                <FileDown aria-hidden="true" className="h-4 w-4" />
                Resume
              </span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <dl className="mt-9 grid overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_72%,transparent)] sm:grid-cols-3">
            {recoverySignals.map((signal) => (
              <div
                className="border-b border-[var(--border-subtle)] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                key={signal.label}
              >
                <dt className="text-[0.68rem] font-semibold uppercase text-[var(--color-antique-gold)]">
                  {signal.label}
                </dt>
                <dd className="mt-1 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-ink-strong)]">
                  {signal.value}
                </dd>
                <dd className="mt-2 text-xs leading-5 text-[var(--color-ink-muted)]">
                  {signal.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-ink)_94%,#fff8ee_6%),color-mix(in_srgb,var(--color-ink)_98%,#fff8ee_2%))] p-5 text-[var(--color-text-inverse)] shadow-[0_22px_90px_color-mix(in_srgb,var(--color-ink)_28%,transparent)]">
          <div
            aria-hidden="true"
            className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-antique-gold)_72%,transparent),transparent)]"
          />
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
              Recovery console
            </p>
            <Route aria-hidden="true" className="h-4 w-4 text-[var(--color-antique-gold)]" />
          </div>
          <p className="mt-4 font-[var(--font-display)] text-2xl font-semibold leading-tight">
            Route map restored.
          </p>
          <p className="mt-3 text-sm leading-6 text-[color-mix(in_srgb,var(--color-text-inverse)_70%,transparent)]">
            The strongest public evidence routes for {profile.displayName} are
            queued below in the order most visitors need them.
          </p>

          <nav aria-label="Fast recovery routes" className="mt-6 grid gap-2">
            {recoveryRoutes.map((route, index) => (
              <Link
                className="motion-card group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-[var(--radius-control)] border border-[color-mix(in_srgb,var(--color-text-inverse)_15%,transparent)] bg-[color-mix(in_srgb,var(--color-text-inverse)_6%,transparent)] p-3 transition hover:border-[var(--border-gold)] hover:bg-[color-mix(in_srgb,var(--color-text-inverse)_9%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-gold)]"
                href={route.href}
                key={route.href}
                prefetch={false}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-[color-mix(in_srgb,var(--color-antique-gold)_36%,transparent)] font-mono text-xs text-[var(--color-antique-gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[var(--color-text-inverse)]">
                    {route.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[color-mix(in_srgb,var(--color-text-inverse)_66%,transparent)]">
                    {route.description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 h-3.5 w-3.5 text-[var(--color-antique-gold)] transition group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </nav>
        </aside>
      </section>
    </main>
  );
}
