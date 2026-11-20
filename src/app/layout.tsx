import type { Metadata, Viewport } from "next";
import { HiddenDelightLayer } from "@/components/hidden-delight";
import { SiteHeader, SiteScrollProgress } from "@/components/site";
import { ConditionalFooter } from "@/components/site/conditional-footer";
import { SocialDock } from "@/components/social-dock";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PageTransition } from "@/components/page-transition";
import { RouteCurtain } from "@/components/signature/route-curtain";
import { TabPresence } from "@/components/signature/tab-presence";
import { HeroRevealProvider, portfolioEnteredScript } from "@/context/hero-reveal-context";
import { siteConfig } from "@/lib/seo";
import { fontVariables } from "./fonts";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.title,
    template: "%s | Nirmal Kumar"
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: "Nirmal Kumar Portfolio",
  authors: [{ name: "Nirmal Kumar", url: "https://www.linkedin.com/in/nirmalkumar6/" }],
  creator: "Nirmal Kumar",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description
  },
  formatDetection: { telephone: false, email: false, address: false }
};

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the head script may mark <html> as a return
    // visit before React hydrates it.
    <html className={fontVariables} lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: portfolioEnteredScript }} />
      </head>
      <body>
        <SmoothScroll>
          <HeroRevealProvider>
            <SiteScrollProgress />
            <SiteHeader />
            <PageTransition>{children}</PageTransition>
            <ConditionalFooter />
            <SocialDock />
            <HiddenDelightLayer />
            <RouteCurtain />
            <TabPresence />
          </HeroRevealProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
