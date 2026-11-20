import type { Metadata } from "next";
import { OnTheRecord } from "@/components/testimonials/on-the-record";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Testimonials",
  description:
    "Signed notes from collaborators on working with Nirmal Kumar — ownership, reliability, and delivery under real project pressure.",
  path: "/testimonials"
});

export default function TestimonialsPage() {
  return <OnTheRecord />;
}
