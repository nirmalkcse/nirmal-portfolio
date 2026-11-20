import { GrOracle } from "react-icons/gr";
import { SiDatabricks, SiGithub } from "react-icons/si";

/*
 * Official issuer and platform marks, in one place.
 *
 * Databricks, GitHub and Oracle use the vector marks published by Simple
 * Icons and Grommet (via react-icons), in each brand's own colour. Microsoft
 * and Google use their published geometry and palette directly. Earlier
 * hand-traced paths (an "Oracle" wordmark that rendered as "OPACI", an
 * approximate Databricks stack) are gone; render issuers through here.
 */

type MarkProps = { size?: number; className?: string; title?: string };

export function MicrosoftMark({ size = 28, className, title = "Microsoft" }: MarkProps) {
  return (
    <svg aria-label={title} className={className} height={size} role="img" viewBox="0 0 23 23" width={size}>
      <path d="M1 1h10v10H1z" fill="#F35325" />
      <path d="M12 1h10v10H12z" fill="#81BC06" />
      <path d="M1 12h10v10H1z" fill="#05A6F0" />
      <path d="M12 12h10v10H12z" fill="#FFBA08" />
    </svg>
  );
}

export function GoogleMark({ size = 28, className, title = "Google" }: MarkProps) {
  return (
    <svg aria-label={title} className={className} height={size} role="img" viewBox="0 0 24 24" width={size}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function DatabricksMark({ size = 28, className, title = "Databricks" }: MarkProps) {
  return <SiDatabricks aria-label={title} className={className} color="#FF3621" role="img" size={size} />;
}

export function OracleMark({ size = 28, className, title = "Oracle" }: MarkProps) {
  return <GrOracle aria-label={title} className={className} color="#C74634" role="img" size={size} />;
}

export function GitHubMark({ size = 28, className, title = "GitHub" }: MarkProps) {
  return <SiGithub aria-label={title} className={className} color="#181717" role="img" size={size} />;
}

export type IssuerName = "Microsoft" | "Databricks" | "Google" | "Oracle" | "GitHub";

export function normalizeIssuer(issuer: string): IssuerName | null {
  if (/microsoft/i.test(issuer)) return "Microsoft";
  if (/databricks/i.test(issuer)) return "Databricks";
  if (/google/i.test(issuer)) return "Google";
  if (/oracle/i.test(issuer)) return "Oracle";
  if (/github/i.test(issuer)) return "GitHub";
  return null;
}

/** The issuer's own mark, or null when there isn't one to show. */
export function IssuerMark({ issuer, size = 28, className }: { issuer: string } & MarkProps) {
  switch (normalizeIssuer(issuer)) {
    case "Microsoft":
      return <MicrosoftMark className={className} size={size} />;
    case "Databricks":
      return <DatabricksMark className={className} size={size} />;
    case "Google":
      return <GoogleMark className={className} size={size} />;
    case "Oracle":
      return <OracleMark className={className} size={size} />;
    case "GitHub":
      return <GitHubMark className={className} size={size} />;
    default:
      return null;
  }
}
