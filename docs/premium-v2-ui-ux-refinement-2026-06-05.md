# Premium V2 UI/UX Refinement

Date: 2026-06-05

## Research Inputs

- Nielsen Norman Group visual design principles: scale, hierarchy, balance, contrast, and Gestalt should improve usability, not only decoration.
- Nielsen Norman Group F-pattern research: visitors scan before reading, so first lines, left-side anchors, headings, and compact proof points need to carry the story quickly.
- Nielsen Norman Group menu guidance: navigation should keep strong information scent, clear labels, easy targets, and persistent access on long pages.
- Stanford Web Credibility Guidelines: make information easy to verify, keep third-party proof close to claims, and let professional visual design support trust.
- Awwwards current portfolio inspiration: modern premium portfolios rely on memorable interaction, clear art direction, and craft details, but the polish must not overwhelm the task.

## Working Direction

Visual thesis:

- Luminous Dossier: warm porcelain precision, graphite evidence, champagne thread, cool trust accents, and tactile motion that responds like a refined instrument.

Content plan:

- First viewport: identity, role fit, proof, and one obvious action.
- Deep pages: strong headline, quick scan metrics, then proof-rich detail.
- Support pages: keep resume, documents, credentials, and contact routes practical before ornamental.
- Closing moments: resume/contact/proof links should feel like a clean handoff, not a marketing footer.

Interaction thesis:

- Route chrome must be visible at first paint.
- Motion can stage content, but it must not create a blank page before hydration.
- Repeated cards should share one restrained material cue: satin border, faint Gold Thread, and small hover response.

## Changes Applied

- Removed first-paint blankness from the shared header by preventing the fixed navigation from server-rendering as hidden.
- Removed first-paint blankness from the homepage hero text by keeping identity, role, CTAs, and proof metrics visible immediately.
- Removed first-paint blankness from the project index by avoiding a hidden route-level Framer initial state.
- Tightened the profile page first viewport by aligning the hero copy to the top beside the contact card instead of bottom-aligning it.
- Added a subtle global luminous field with cool/emerald undertones so the light theme reads less one-note cream.
- Added a faint shared Gold Thread hairline to repeated card surfaces, expanding it on hover/selected states for a more crafted material response.
- Replaced negative `tracking-tight` usage in project case-file typography with explicit zero tracking.
- Normalized older CSS typography so premium homepage and timeline surfaces no longer scale font size from raw viewport width.
- Removed unused decorative hero orb styles and kept the hero art direction on material planes, grids, thread lines, and proof surfaces.
- Added global scrollbar styling so long proof, credential, and document surfaces feel like part of the same premium instrument panel.
- Added a restrained porcelain/glass highlight layer to reusable motion cards, case cards, and lens choices without changing card structure or adding clutter.
- Gave Gold Thread rails a subtle cool/warm glow so case-file and roadmap edges read as intentional craft details.
- Added a desktop case-file reading path to project-detail pages so long case studies have persistent information scent without adding mobile clutter.
- Added a project-detail case-file closeout that summarizes proof counts, offers Work/Skills/Resume continuation routes, and promotes the next case study before the shared footer.
- Added direct-link visibility safeguards for scroll-revealed sections so anchored routes open on readable content rather than hidden animation states.
- Added a project-detail visibility guard so long case-study sections render fully in full-page review, screenshots, and exports instead of relying on scroll-timeline reveal state.
- Tightened the case-file rail CTA contrast by reusing the shared primary action treatment and explicit label/icon coloring.
- Reduced the mobile and tablet fixed-header offset so pages begin with meaningful content sooner while anchored sections still clear the navigation.
- Added a credentials verification ledger that separates active third-party links, historical support, and public-link gaps before the visitor reaches the credential cards.
- Added a selected-credential proof receipt so the evidence method, public-link state, validity window, and caveat stay close to the inspected credential.
- Removed scroll-reveal dependency from lower document-handoff sections so full-page captures, exports, and long reviews show the credential summary, case-study roadmap, available routes, and publishing rule without false blank space.
- Reworked the profile public-links area so LinkedIn reads as the primary outreach path while GitHub, LeetCode, and IEEE sit in a supporting-proof lane.
- Added a compact contact protocol to the profile hero so LinkedIn, one-page resume, and work proof read as an ordered review path rather than repeated actions.
- Tightened the resume page review desk by preventing summary cards from stretching into empty panels and adding a compact handoff sequence from resume download to credentials to case studies.
- Replaced loose resume hero metadata chips with an ordered review path so one-page scan, master context, and proof follow-up become the first-screen story.
- Added a document review-order rail so the Documents hero clarifies PDF first, role packet second, and proof depth third before the visitor reaches the packet grid.
- Added signal rails to future-project cards so source anchors, proof outputs, and stack scope are visible before the visitor opens the detail panel.
- Added a selected-track promotion gate to future projects, moving the source-anchor action into the sticky header and framing planned work as governed, public-safe, and evidence-backed.
- Moved the sound toggle into a CSS module and hid it on compact touch layouts so optional audio chrome does not cover mobile reading paths.
- Added a compact timeline reading spine between the role lens and atlas so visitors can scan the career arc before opening individual milestones.
- Reordered the timeline inspector above the long milestone navigator on collapsed layouts, keeping the selected story detail close to the atlas heading on mobile and tablet.
- Added a selected-milestone receipt to the timeline inspector so date, track, lens fit, and proof density sit beside the active chapter.
- Added a credibility-route checklist to proof node details so source, relationship map, review route, and proof state sit beside the selected claim.
- Reordered the proof detail panel above the long mobile evidence chain while keeping the desktop graph and sticky inspector layout intact.
- Added route-signal strips to project index case cards so route type, proof notes, verified links, skills, and credential depth are visible near the summary instead of buried near the footer.
- Consolidated project index card proof cues into one premium evidence-profile band, removing the repeated lower proof-stat grid so each case reads as an authored dossier rather than a dashboard stack.
- Added homepage direct-anchor reveal guards so deep links into selected work, skills, and credentials land on readable content instead of hidden scroll-reveal states.
- Reworked compact mobile navigation drawer content so hidden routes include short route descriptions and a clearer resume action, improving information scent without expanding the main header.
- Added a polished skip-to-content route before the fixed header, with a focus-only gold service tab and shared `main-content` landmarks across every route.
- Added a site-wide Gold Thread reading-progress cue so long pages provide quiet orientation without adding another visible navigation control.
- Rebuilt the shared footer as a closing route atlas with proof signals, primary proof paths, a resume-to-work review handoff, and a final contact route instead of a generic utility grid.
- Added a custom not-found recovery page so broken or mistyped routes still present a premium portfolio recovery path with primary actions, proof signals, and a compact route console.
- Reworked the generated OpenGraph/Twitter share image into a premium dossier-cover preview with NK seal, strong identity, role positioning, route cues, and proof ledger metrics.
- Added browser/app chrome polish: SVG favicon wiring, high-resolution generated NK app icons, Apple touch icon support, theme-color metadata, mask icon, and a web app manifest.
- Added a full-bleed Three.js proof artifact to the homepage hero so the first viewport has a sculptural, designer-portfolio focal point while preserving the existing identity, CTAs, and proof map.
- Restored the breathable homepage proof-card composition as the right-side hero anchor, keeping the warm cream-gold background while removing the oversized 3D monogram treatment.
- Tuned the shared page selector opacity and scroll behavior so the route selector hides on intentional downward scroll, returns on upward scroll, and keeps a more legible satin/glass active state.
- Reworked the homepage one-minute-review text transition from a visible left-to-right sheen into a soft ambient bloom with blur-based text dissolve.
- Tightened the one-minute-review bloom so it responds to scroll with a faster spring, shorter pulse, and overlapping scene handoff instead of feeling like a delayed loading effect.

## Page Notes

- Home: the first viewport now shows the brand, name, role summary, primary action, secondary actions, and proof metrics immediately on desktop and mobile.
- Home Awwwards pass: the hero now pairs the proof map with a masked WebGL artifact, making the first viewport feel like an authored interactive scene rather than a static portfolio header.
- Home proof-card restoration: the first viewport again pairs the identity column with the breathable portfolio-map card, using only a quiet atmospheric trace behind it so the proof routes remain readable.
- Home deep links: selected-work, skills, and credentials anchors now reveal their narrative and proof surfaces immediately, which keeps section-level routes useful during QA, sharing, and future in-page navigation.
- Global navigation: desktop remains a restrained route bar, while the compact drawer now behaves more like a miniature route index with labels, one-line context, active state, and a distinct resume handoff.
- Global navigation selector: the active droplet now has stronger opacity, clearer border definition, and direction-aware hide/reveal timing so it feels premium without becoming heavy chrome during scroll.
- Global orientation: every route now has a top-edge scroll-progress thread that helps long proof, project, and footer journeys keep their place while staying visually subordinate to the fixed header.
- Global keyboard navigation: keyboard visitors now get a refined skip-to-content affordance before the fixed header, and every page-level `main` landmark exposes the same target.
- Global footer: the site now ends with identity, quantified proof, primary proof routes, a recruiter-friendly resume/work sequence, and a compact supporting-route stack, giving every page a stronger closing handoff.
- Projects: the case-study index no longer appears blank at first paint; active navigation and project cards are visible immediately.
- Projects index cards: case selection now has stronger information scent near the title and summary, with quick cues for Case versus Review, proof note count, verified-link count, skills, and credentials before the visitor reaches the CTA.
- Projects index evidence profile: case cards now present route state, public-link readiness, visual-proof readiness, skill depth, credential count, and evidence-note count once near the summary, then let the lower evidence note and public-safety block breathe.
- Project detail: shared header is visible at first paint, the case-study hero remains readable on desktop and mobile, long proof sections now have a sticky desktop path through architecture, decisions, proof, public notes, context, and related proof, and each case ends with a proof-count closeout plus next-route handoff.
- Proof / Skills: material cue is subtle enough to unify proof cards and metric tiles without adding clutter.
- Proof / Skills mobile: reclaimed excess first-viewport dead air above the headline by matching page top spacing to the compact premium header.
- Proof / Skills detail flow: selected nodes now show the credibility route before deeper descriptions, and mobile visitors see the selected proof before the complete evidence chain.
- Certifications: verification console now reads more like a trust ledger, with visible confidence lanes, selected evidence status, and lower-emphasis public-link gaps.
- Certifications selected detail: proof receipt now summarizes method, link state, validity, and caveat before public links, skills, and project references.
- Timeline: header now appears immediately while the cinematic hero keeps its existing layout; heading scale is now stable across unusual desktop and mobile widths.
- Timeline reading flow: the page now bridges hero, role lens, and atlas with a five-step career spine, then surfaces the active milestone before the long navigator on collapsed layouts.
- Profile: contact identity is now visible near the top of the first viewport instead of delayed by excess vertical ceremony.
- Profile public links: LinkedIn now has primary route emphasis; secondary public profiles stay useful without competing with the outreach CTA.
- Profile contact protocol: the first viewport now shows a quiet three-step path from outreach to resume fit check to case-study proof before the supporting contact card.
- Documents: mobile first paint now includes header, headline, CTA, and metrics with no blank route-load state; full-page document flow now stays continuous through credential summary, roadmap, route matrix, and publishing rule.
- Documents review order: the hero now gives download visitors a three-step packet path, then the role focus panel and packet grid handle deeper selection.
- Resume: retained the practical first action while the shared material layer gives the preview and recommendation panels a more finished editorial feel.
- Resume review path: the hero now opens with one-page scan, master context, and proof follow-up as a deliberate order instead of a row of generic metadata chips.
- Resume review desk: preview summary cards now size to content, and the page uses a three-step handoff sequence to keep recruiter, credential, and case-study routes in a clear order.
- Future projects: roadmap guardrails, stage cards, and selected exploration now share the same premium edge language as proof and case-study pages.
- Future projects roadmap cards: each track now exposes source, proof, and stack signals in a compact rail so planned work feels curated instead of speculative.
- Future projects detail panel: the selected exploration now opens with a source-anchor CTA, readiness metrics, and a promotion gate that explains the public-safe path before deeper proof lists.
- Timeline selected detail: the active milestone now reads like an inspected chapter, with a receipt for date, track, role-lens fit, and linked proof density before metadata and actions.
- Not found: unknown URLs now land on a designed recovery dossier with Work, Home, and Resume actions above the fold, a 404 proof ledger, and a dark recovery console linking to the strongest public evidence routes.
- Social previews: `/opengraph-image` and `/twitter-image` now use the same Luminous Dossier hierarchy as the site, with identity first, proof ledger second, and review routes visible at thumbnail scale.
- Browser/app chrome: tabs, bookmarks, touch icons, pinned/masked icons, saved-app surfaces, and install metadata now carry the NK Gold Thread identity instead of relying on unstyled defaults.

## Reusable Learnings

- Premium motion should never hide essential first-viewport content before hydration.
- A light premium palette needs at least one cool or trust-toned counterweight to avoid a flat cream impression.
- Repeated cards need a shared edge treatment, but the cue should be thinner than the content hierarchy.
- Profile/contact pages should answer quickly; whitespace is useful only after the identity and primary route are clear.
- The resume page is the best current reference for practical premium balance: one direct action, one proof surface, one supporting rail.
- Typography can stay dramatic without viewport-width font scaling; use stable rem values plus breakpoint-specific composition.
- Premium craft improves when old decorative experiments are removed, not only when new detail is added.
- Scrollbars, card rails, and hover hairlines are small details, but they reinforce that long pages and dense proof surfaces belong to one system.
- Long case studies need left-edge scan anchors and proof counts on desktop; mobile should keep the same content sequence without a persistent rail.
- Scroll-triggered reveal systems must explicitly protect `:target` sections so deep links, shared URLs, and browser reloads never land on invisible content.
- Long proof pages should not depend on scroll-timeline reveal for core content. If a page is used for full-page screenshots, exports, or review, core sections must render visibly even before the visitor scrolls to them.
- Fixed-header offsets should be measured against the closed navigation shell, not inherited from older safer layouts; otherwise mobile pages feel hesitant before the first headline.
- Credential pages should separate current verification, historical/supporting records, and missing public references before the detailed card list; this keeps credibility high without hiding weaker evidence.
- Selected credential panels should lead with a compact proof receipt before metadata lists; method, link state, validity, and caveat need to sit near the credential claim.
- Document/download hubs should avoid scroll-hidden lower sections when those sections explain publishing policy, route availability, or export readiness; they need to render in full-page review as well as in normal scrolling.
- Contact pages should not give every social link equal visual weight. The primary outreach route should be unmistakable, with coding/publication profiles grouped as supporting proof.
- Contact pages benefit from a small ordered protocol when multiple CTAs appear together. It turns LinkedIn, resume, and work proof into a scan path without adding a new navigation surface.
- Resume pages should not leave large empty balancing zones beside download rails. Use compact review-sequence content to turn empty space into a purposeful handoff.
- Resume hero metadata should not compete with review order. Put file freshness in the CTA/recommendation surface, then use the hero rail to explain scan, context, and proof.
- Download hubs should name the review order before the grid. PDF first, role packet second, and proof depth third keeps the first pass calm while preserving deeper routes.
- Future-roadmap pages should make the promotion rule visible. Planned ideas feel more credible when the page shows source anchors, proof packets, scope counts, and public-safe gates.
- Optional floating chrome should disappear or move on compact layouts if it overlaps the reading path; delight should never compete with body copy.
- Timeline and chronology pages need an explicit story spine before dense controls. Give the visitor the arc first, then the filters, then the complete list.
- On collapsed layouts, selected detail should come before long navigators. Mobile visitors need the active story while the context is fresh.
- Selected timeline details should consolidate date, track, lens fit, and proof density into a receipt. This keeps the active chapter recognizable even when the chronology below is long.
- Evidence-heavy pages should keep claim, source, relationship count, proof level, and review route close together. This follows credibility guidance by keeping verification near the claim instead of burying it.
- If a proof graph collapses into stacked cards, put the selected inspector before the full chain. Recognition beats recall when visitors can see what the active node means immediately.
- Case-study indexes should expose the reason to open a card near the summary: route state, proof-note count, verified-link count, and skill/credential depth should appear before deeper problem/system/impact copy or footer CTAs.
- Avoid duplicating proof stats inside the same card. If an evidence profile already explains route, public links, visuals, skills, credentials, and notes near the summary, the footer should shift to evidence quality, safety, and action instead of repeating counts.
- Homepage section anchors need the same reveal protection as proof and case-detail pages. If a scroll-staged section can be addressed by URL, the target state must show headline, proof surface, and first action without waiting for scroll animation.
- Hidden mobile navigation needs stronger route scent than visible desktop navigation. When routes are tucked behind a menu, pair the label with a short context line so the visitor does not have to remember what each destination contains.
- Long pages benefit from a persistent orientation cue, but it should sit at the edge of vision. A 2-3px scroll thread can support position awareness without adding labels, badges, or a second nav rail.
- Skip links should feel designed, not bolted on. Place the focus reveal where it clears fixed chrome, keep the target consistent across pages, and preserve the premium visual language even for accessibility affordances.
- Footer navigation should close the argument, not simply list links. Pair brand identity with two or three proof signals, then offer a clear route atlas and one decisive handoff sequence.
- Error and empty states should preserve the site narrative. A not-found page should recover with route scent, a primary action, and proof-oriented alternatives instead of stopping at an apology.
- Dark console panels in the warm-light system need inverse text tokens. The default `ivory` and `warm-silver` tokens are tuned for light surfaces and can lose contrast on intentionally dark panels.
- Social preview images should be treated as first-contact UI. Keep the name dominant, copy short, proof metrics visible, and route cues present without trying to reproduce the full website.
- Browser chrome is first-contact UI too. Favicon, app icon, Apple touch icon, manifest, theme color, and mask icon should use the same simplified NK mark and pass tiny-size rendering checks.
- Awwwards-style 3D belongs in the narrative plane, not inside a decorative preview card. It should reinforce the proof system, stay behind primary content, respect reduced motion, and be verified with desktop/mobile screenshots plus pixel/detail checks.
- If a 3D hero starts to feel abstract, busy, or logo-heavy, protect the breathable proof card first. The card provides review routes and credibility context, so any 3D atmosphere must stay behind it and never replace it.
- Navigation that hides on scroll must respond to the first real downward gesture, not wait for a second scroll event. Seed the scroll sample on mount/route change, then reveal on upward intent, menu expansion, drag, and route change.
- Text transitions in premium scroll stories should avoid obvious wipe lines over readable copy. Use ambient light, opacity, blur, and small depth movement so the section feels continuous while the content changes.
- Scroll-linked bloom should be scrubbed by the gesture. Use a responsive spring and short pulse windows near content changes, then drop opacity quickly so the light feels interactive rather than slow.

## Validation

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- Screenshot QA covered first paint and waited states across home, projects, project detail, proof, timeline, certifications, profile, and documents mobile.
- Continuation screenshot QA covered typography and surface changes on home, timeline, certifications, documents mobile, proof, project detail, profile, resume, and future projects.
- Case-file wayfinder screenshot QA covered desktop and mobile direct links to `#proof-artifacts`, including sticky rail behavior and CTA contrast.
- Project-detail closeout screenshot QA covered desktop and mobile direct links to `#case-study-closeout`, plus desktop and mobile full-page case-study flows after adding the visibility guard.
- Header-offset screenshot QA covered `/proof` mobile first paint and a mobile direct link to `/projects/icore-enterprise-mdm-entity-resolution#proof-artifacts`.
- Credentials screenshot QA covered desktop first viewport and mobile full-page flow after adding the verification ledger.
- Credentials proof-receipt QA covered desktop and mobile full-page flows after adding the selected credential receipt.
- Documents full-page screenshot QA covered desktop and mobile continuity after removing lower-section reveal blankness.
- Profile screenshot QA covered desktop and mobile full-page contact hierarchy after separating primary outreach from supporting public links.
- Profile contact-protocol QA covered desktop first viewport and mobile full-page flow after adding the ordered review path below the hero actions.
- Documents review-order QA covered desktop first viewport and mobile full-page flow after adding the packet-order rail below the hero actions.
- Resume screenshot QA covered desktop and mobile full-page flow after tightening summary card sizing and adding the handoff sequence.
- Resume review-path QA covered desktop first viewport and mobile full-page flow after replacing hero metadata chips with the ordered scan/context/proof rail.
- Future projects screenshot QA covered desktop and mobile full-page flow after adding track signal rails, the promotion gate, and the mobile-safe sound-toggle behavior.
- Timeline screenshot QA covered desktop and mobile full-page flow after adding the reading spine and moving the selected milestone inspector before the collapsed navigator.
- Timeline milestone-receipt QA covered waited desktop `#timeline-path` and waited mobile full-page captures after consolidating selected milestone context.
- Proof screenshot QA covered desktop and mobile full-page flow after adding the credibility route and moving the selected proof detail above the collapsed evidence chain.
- Projects index screenshot QA covered desktop and mobile full-page flow after adding route-signal strips to the case cards.
- Projects evidence-profile QA covered desktop and mobile full-page Work flows after consolidating card proof cues and removing the repeated lower proof-stat grid.
- Homepage anchor screenshot QA covered desktop `#skills` and `#credentials`, plus mobile `#skills`, after adding direct-anchor reveal guards.
- Navigation screenshot QA covered desktop and mobile closed header states after adding descriptive compact-menu route content.
- Scroll-progress QA covered home top state plus desktop and mobile deep footer-anchor states after adding the site-wide top-edge progress thread.
- Skip-link QA covered source coverage for 12 page-level `main` landmarks and desktop/mobile visible-state screenshots for the focus-style skip affordance.
- Footer screenshot QA covered desktop and mobile targeted/footer full-page flows after adding the route atlas and resume handoff.
- Not-found screenshot QA covered desktop and mobile unknown-route recovery before/after states, plus a full mobile flow through the shared footer.
- OpenGraph/Twitter image screenshot QA covered `/opengraph-image` and `/twitter-image` after fitting the proof ledger and footer rail inside the 1200x630 frame.
- Browser/app chrome QA covered `/icon`, `/apple-icon`, `/manifest.webmanifest`, rendered head discovery tags, and production-build static route output for the generated icon and manifest routes.
- Awwwards hero QA covered desktop and mobile first-viewport screenshots after adding the Three.js artifact, with browser-side canvas presence and pixel-detail checks for the artifact region.
- Proof-card restoration QA covered desktop and mobile first-viewport screenshots after removing the oversized monogram, confirming the portfolio-map panel is visible again, the warm background is retained, and the 3D canvas remains quiet without horizontal overflow.
- Navigation selector QA confirmed the header translates out and opacity reaches `0` on downward scroll, then returns to near-full opacity on upward scroll.
- One-minute-review transition QA covered desktop and mobile screenshots after replacing the left text sheen with a softer bloom/dissolve.
