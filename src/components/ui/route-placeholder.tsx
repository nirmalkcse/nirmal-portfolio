import Link from "next/link";

type RouteLink = {
  href: string;
  label: string;
  ownerSession?: string;
};

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  links?: readonly RouteLink[];
};

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  links = []
}: RoutePlaceholderProps) {
  return (
    <main
      className="min-h-screen px-6 pb-10 pt-[calc(var(--site-header-offset)+var(--space-5))] sm:px-10 lg:px-16"
      id="main-content"
      tabIndex={-1}
    >
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase text-[var(--color-muted-champagne)]">
            {eyebrow}
          </p>
          <h1 className="editorial-title editorial-title--section editorial-title--inherit">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
            {description}
          </p>
        </div>

        {links.length > 0 ? (
          <nav aria-label="Portfolio routes" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Link
                className="rounded-[var(--radius-surface)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] px-4 py-3 transition hover:border-[var(--color-antique-gold)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-antique-gold)]"
                href={link.href}
                key={link.href}
              >
                <span className="block text-sm font-medium">{link.label}</span>
                {link.ownerSession ? (
                  <span className="mt-1 block font-mono text-xs text-[var(--color-warm-silver)]">
                    {link.ownerSession}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
