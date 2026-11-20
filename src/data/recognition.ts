/*
 * Product-level recognition, kept apart from personal certifications.
 *
 * Wording agreed with Nirmal on 2026-10-16: Databricks may be named; the
 * company that holds the accreditation is not. The claim is about the
 * product: iCORE, designed and built end to end, is the solution behind the
 * accreditation. See docs/content/achievement-discovery-workbook.md.
 */
export const brickbuilderRecognition = {
  id: "databricks-brickbuilder",
  issuer: "Databricks",
  name: "Databricks Brickbuilder",
  title: "Databricks Brickbuilder accreditation",
  productName: "iCORE",
  projectSlug: "icore-enterprise-mdm-entity-resolution",
  /** One line, for seals and highlight cards. */
  line: "The solution behind a Databricks Brickbuilder accreditation.",
  /** Who built it, kept to the fact. */
  role: "Designed and built end to end.",
  /** For the Credentials page, where it sits beside personal certifications. */
  scope: "A company-level accreditation, earned with a product built end to end."
} as const;
