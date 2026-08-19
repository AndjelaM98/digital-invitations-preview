/**
 * Architecture: invitation templates as layered React experiences
 *
 * ============================================================================
 * Canva (or similar) produces SEPARATE graphic assets.
 * React owns structure, dynamic content, interaction, and Framer Motion.
 *
 * Forbidden as the invitation itself
 * - one giant PNG of the whole invite
 * - one static MP4/WebM as the invite
 *
 * Allowed from Canva
 * - envelope body, flap, seal, paper card
 * - florals, lace, ornaments, backgrounds, illustrations
 * - photo frames / masks (empty slots filled by React with client photos)
 *
 * Mobile-first (non-negotiable)
 * Most guests open invites on iPhone / Android.
 * Author for ~390px width first, then enhance with min-width queries.
 * Do NOT design desktop and “shrink” it.
 *
 * Mobile checklist
 * - envelope size fits one hand viewport (see --inv-envelope-max)
 * - layer proportions via % placement, not fixed desktop pixels
 * - opener animations stay fluid; prefer transform/opacity
 * - text placement readable without overflow or horizontal scroll
 * - decorative assets scale with the stage, never force page width
 * - tap targets ≥ 44px for seal / CTAs
 * - overflow-x: clip on shell; no sideways scroll
 * - desktop is an enhancement via placementDesktop + min-width CSS
 *
 * Mental model
 *
 *   Template
 *   |-- assets/          Canva exports (transparent layers)
 *   |-- config.ts        layout, layer ids, phases, section list
 *   |-- content.ts       names, dates, copy, photo URLs (client data)
 *   |-- scenes/          interactive openers (optional)
 *   |-- sections/        full digital invitation (scroll experience)
 *   |-- Template.tsx     composes scene + sections
 *
 * Shared system (`shared/`)
 * - types.ts     InvitationContent + TemplateAsset / TemplateLayer / config
 * - layers.tsx   LayerStage, AssetLayer, TextLayer (mobile-first placement)
 * - viewport.ts  breakpoints + min tap size
 * - motion.ts    Framer Motion easings + ceremonial variants
 * - InvitationShell, ScrollReveal
 *
 * Registry (`index.ts`)
 * New template = new folder + assets + config + register one entry.
 * No new app shell.
 *
 * Typical opener flow (example)
 * 1. closed envelope (layers: body, flap, seal)
 * 2. user taps seal (interactive layer)
 * 3. flap animates (Framer Motion hinge)
 * 4. invitation card rises (separate asset + text layers)
 * 5. handoff into full-page sections (story, venue, rsvp, …)
 *
 * Content vs design
 * - content.ts changes per couple / client
 * - config.ts + assets change per visual template
 * - section components bind content fields; they do not hardcode names
 *
 * Animation rule
 * Use Framer Motion for scene and section motion unless a clearer
 * native CSS solution fits a tiny local case.
 * Prefer transform + opacity for mobile GPU performance.
 */

export {};
