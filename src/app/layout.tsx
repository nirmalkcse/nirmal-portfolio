import type { Metadata } from "next";
import { HiddenDelightLayer } from "@/components/hidden-delight";
import { SiteFooter, SiteHeader } from "@/components/site";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nirmal Kumar",
    template: "%s | Nirmal Kumar"
  },
  description:
    "Portfolio foundation for Nirmal Kumar: data engineering, AI / ML, cloud engineering, and software systems work.",
  applicationName: "Nirmal Kumar Portfolio",
  authors: [{ name: "Nirmal Kumar" }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <HiddenDelightLayer />
      </body>
    </html>
  );
}
