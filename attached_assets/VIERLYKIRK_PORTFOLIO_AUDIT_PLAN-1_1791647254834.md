# Vierlykirk Portfolio — Public Audit Findings & Staged Correction Plan for Replit Agent

> **Purpose:** Correct the current portfolio in small, verifiable stages. This document is the implementation specification. Follow it in order, inspect the existing code before editing, and do not replace the whole website with a fresh template.
>
> **Repository:** `Reyhan-irza/reyhan-portfolio`
>
> **Project identity:** Reyhan Irza Alvano — Student Developer  
> **Creative signature:** Vierlykirk  
> **Brand mark:** RV geometric monogram  
> **School context:** SMK Negeri 2 Lubuk Basung — TJKT
>
> **Important:** Treat the repository's current source as the implementation baseline. Verify file paths and current behavior before changing anything. Some findings below come from source inspection rather than a live visual/browser audit. Do not claim a visual issue is fixed until you have run the app and inspected desktop and mobile layouts.


## 0A. Latest public-domain audit — findings to carry into implementation

**Audit source:** a browser audit of `https://vierlykirk.my.id/`, which redirected to `https://www.vierlykirk.my.id/` and returned HTTP 200. The audit report states it inspected the public page at desktop 1440×900 and mobile 402×874. This is a report supplied to this implementation plan; do not represent it as a new independent test performed by the implementing agent.

### Confirmed in the supplied public audit

**P1 — Project cards do not show the actual products.** Three project panels rely on typography/wordmarks such as “TJKT” instead of real product-interface screenshots. The descriptions, technology labels, live links, and repository links are present. Improve the image evidence with genuine desktop/mobile screenshots when available; never fabricate product UI.

**P1 — Intro can delay access to the portfolio.** Source/local preview indicated a fullscreen intro dialog that blocks the main content until completion or skip, and a low-prominence Skip control. The public-domain visitor did not verify the intro at first load because it had already finished. Treat the concern as source/local-preview evidence, not a confirmed live first-load defect. Make Skip easy to see and keyboard-accessible, and keep the intro brief without removing the RV identity animation.

**P2 — Journey active navigation state is wrong.** The public audit opened `#journey` and saw Journey on screen while “Activity” remained marked active. Since this state is also communicated with `aria-current`, fix it as a real navigation/accessibility bug. Test direct hash navigation, scrolling down, scrolling up, and menu navigation.

**P2 — Desktop Projects section uses a long pinned/scroll-driven sequence.** The reported Projects section height was approximately 3,790 px on desktop for three projects. Keep the storytelling only if progress is clear and users can move through it comfortably. Verify touch/mobile behavior and reduced-motion behavior rather than assuming the desktop interaction is appropriate everywhere.

**P2 — Technology bands show icons without visible names.** Some icons are hard to identify and appear dim; the names are currently only available through accessibility attributes. Add visible names or reliable hover/focus labels on desktop, and a non-hover-dependent readable treatment on touch screens.

**P2 — Optimize favicon first, then measure cold load.** The supplied browser transfer observations report `favicon.png` around 145 KB, JavaScript around 233 KB, CSS around 37 KB, and roughly 911 KB same-origin transfer across a session that had scrolled and loaded certificate assets. These are session transfer observations, **not** cold-load totals, Lighthouse results, or proof of poor production speed. Inspect the favicon dimensions/format and measure a true cold load before broader bundling work.

**P2/P3 — Small metadata is difficult to read.** Some kicker, index, and monospaced metadata labels were reported at about 9–10 px on desktop. Increase size and/or contrast only where labels carry meaningful information; preserve the editorial type scale where it remains legible.

**P3 — Project entry appears late after a large opening block.** The whitespace is stylistically defensible, but consider a clearer project/progress cue earlier in the section.

**P3 — Contact-card supporting text could use slightly stronger contrast.** Preserve the current palette and hierarchy; avoid broad restyling for a minor issue.

### Areas reported as working

- Consistent Manrope/DM Mono typography, dark palette, and blue/violet accents.
- Hero hierarchy, primary “Explore My Work” CTA, and RV mark.
- About/Journey content structure and visible certificate with view/download links.
- Basic responsive layout at 402 px without observed horizontal overflow.
- Mobile menu opens, changes `aria-expanded` to `true`, and locks page scrolling while open.
- The code contains a skip link, landmarks, dialog labeling, focus indicators, alt attributes, menu state, and reduced-motion rules. Presence in source does not substitute for full assistive-technology verification.

### Audit coverage limits — do not overclaim

The audit report says it inspected the hero, About, Projects opening/first card, Technology Bands, Journey, Award, Contact, and mobile menu. It did **not** fully test every project hover, all ScrollTrigger motion manually, physical mobile devices, screen readers, Lighthouse/cold-load performance, reduced-motion emulation, or the mobile timeline. These must remain marked as unverified until tested.

### How this audit changes the plan

- Do not make a broad palette/hero redesign simply for the sake of redesign: the audit describes both as generally working. Change them only if code inspection or a reproduced test demonstrates a specific defect.
- Start implementation with genuine project imagery (P1), then correct the Journey active-state bug and improve the intro skip affordance. Continue with technology labels and targeted scroll/motion testing.
- Keep each phase narrow. A finding marked “verified” means it was observed in the supplied audit, not that the fix has already been made or retested.

---

## 0. Non-negotiable rules

1. **Do not rebuild from scratch.** Preserve the current component structure, project links, working features, existing content, Supabase integrations, GitHub activity, comments, visitor tracking/admin features, music controls, achievement interactions, intro animation, and navigation unless a task explicitly changes one of them.
2. **Work one phase at a time.** Complete and test a phase before moving to the next. Do not combine all phases into one giant refactor.
3. **No invented facts.** Do not invent project metrics, users, awards, dates, school names, competition names, scores, technologies, testimonials, or deployment status.
4. **Do not fake screenshots.** Project imagery must come from real screenshots/assets of the actual project. If a screenshot is not available, create a restrained branded placeholder that is clearly a placeholder, and report the missing asset.
5. **Preserve the established brand direction.** Premium Tech × Editorial × Geometric × Personal × Interactive. Dark, calm, precise, ambitious, and creative. Avoid generic AI gradients, cyberpunk, gaming aesthetics, neon overload, excessive glassmorphism, random 3D blobs, floating code symbols, and generic developer-starter layouts.
6. **One centralized palette.** Do not introduce new arbitrary accent colors. Use the tokens defined below.
7. **Desktop and mobile both matter.** Desktop may use richer pointer/scroll interactions. Mobile must remain clear, responsive, touch-friendly, and performant. No essential content may exist only on hover.
8. **Motion must be reversible where scroll-driven.** Use GSAP ScrollTrigger scrub for scroll-linked animations so scrolling upward reverses the animation naturally. Avoid adding entrance animations to every single element.
9. **Accessibility is required.** Semantic markup, keyboard access, visible focus, adequate contrast, Escape-to-close where appropriate, reduced-motion support, and meaningful alt text.
10. **Do not claim success without evidence.** Run available checks, inspect the result, and report what was actually verified plus anything still blocked.

---

## 1. Design system — establish and enforce first

### Brand direction

- Premium Tech
- Editorial layout
- Geometric identity derived from the RV monogram
- Personal, credible student-developer portfolio
- Interactive but restrained
- Consistent across hero, projects, technology bands, journey, awards, navigation, intro, footer, favicon, and social metadata

### Color tokens

Use existing CSS custom properties if they already represent these values. Consolidate duplicate/competing definitions rather than adding another layer of overrides.

```css
--rv-bg: #05070B;
--rv-surface: #0A0E15;
--rv-surface-raised: #101621;
--rv-text: #F5F7FA;
--rv-secondary: #C9D0DC;
--rv-muted: #8B93A3;
--rv-border: rgba(255, 255, 255, 0.07);
--rv-blue: #667CFF;
--rv-violet: #8B6CFF;
--rv-blue-wash: rgba(102, 124, 255, 0.15);
--rv-violet-wash: rgba(139, 108, 255, 0.12);
```

### Rules

- Main backgrounds: `#05070B`, with `#0A0E15` and `#101621` for surface hierarchy.
- Main text: `#F5F7FA`.
- Secondary text: `#C9D0DC`.
- Muted metadata: `#8B93A3`.
- Accent: blue `#667CFF` and violet `#8B6CFF`; use sparingly.
- Borders: subtle white at roughly 7% opacity.
- No legacy rust/red, acid green, or random brand colors for UI decoration.
- Technology brand logos should be monochrome silver/white by default. If a logo cannot be safely recolored because it is a raster asset, use an appropriate monochrome asset or a controlled CSS filter; do not distort the logo.
- Keep brand colors inside actual project screenshots/logos only when those are part of the original product.
- Do not use dark icons on dark backgrounds. All interactive and informational icons need adequate contrast.

### Typography and spacing

- Primary typeface: Manrope, as already selected.
- Use the existing mono font only for small labels, indices, and technical metadata.
- Preserve strong headline scale and generous whitespace, but avoid headings wrapping into awkward single-word lines on narrow devices.
- Use the same section-kicker style and consistent border/divider language.
- Use asymmetry intentionally; do not force every section into the same card grid.

### Phase 1 acceptance criteria

- [ ] No old accent color remains in the final visible RV theme for UI elements.
- [ ] Shared tokens are the single source of truth.
- [ ] No text/icon becomes low-contrast on the dark background.
- [ ] Existing section layouts and functionality still work.
- [ ] Check 320px, 360px, 390px, 414px, tablet, and desktop widths.
- [ ] `prefers-reduced-motion: reduce` remains respected.

---

## 2. Phase A — project visuals: show the actual products

### Current source finding

`artifacts/portfolio/src/components/ProjectsSection.tsx` currently builds project visuals from decorative grid elements, a project number, and a large text wordmark. The component does not currently render an actual screenshot image for each project.

### Objective

Make the selected-work section credible and product-led. Visitors should see what each project actually looks like, not only its name.

### Required changes

1. Inspect the existing public assets and project directories before creating new assets.
2. Look for genuine screenshots of:
   - TJKT department website
   - VIREON Library
   - Reyhan WhatsApp Portfolio
3. If screenshots are available:
   - Add them using the project's existing asset conventions.
   - Use responsive images with correct intrinsic dimensions and `object-fit: cover` or `contain` based on the screenshot.
   - Add useful `alt` text.
   - Use `loading="lazy"` and appropriate `decoding="async"` for below-the-fold images.
   - Avoid layout shift by providing width/height or `aspect-ratio`.
   - Add subtle visual depth through a restrained frame, clip reveal, slight parallax, or scroll-linked crop. Do not pile on all effects at once.
4. If genuine screenshots are **not** available:
   - Do not fabricate product UI or imply a mockup is the actual live product.
   - Keep a refined branded fallback using the RV palette.
   - Add a clear TODO note in the code or final report naming the exact screenshot assets still needed.
   - Do not block other phases solely because screenshots are missing.
5. Preserve the existing project information and working links:
   - TJKT live: `https://tjkt-tech.vercel.app`
   - TJKT GitHub: `https://github.com/Reyhan-irza/TJKT`
   - VIREON live: `https://vireon-lib.vercel.app`
   - VIREON GitHub: `https://github.com/Reyhan-irza/Library`
   - Reyhan WhatsApp Portfolio live: `https://reyhan-watsap-portfolio.vercel.app`
   - Portfolio GitHub: `https://github.com/Reyhan-irza/reyhan-portfolio`
6. Retain project detail modal, keyboard behavior, project progress indicator, and horizontal desktop showcase unless a tested correction is necessary.
7. Keep the mobile presentation vertical and readable. Do not force the desktop pinned horizontal story onto mobile.
8. The screenshot itself must not be stretched or cropped in a way that hides the important interface. If it is a full-page capture, consider a contained viewport preview with a controlled image position.

### Visual target

- Editorial case-study composition, not a generic three-card grid.
- Real project UI is the focal point.
- Project title, short description, technology labels, live link, repository link, and details remain easy to scan.
- Each project can have a slightly different composition while using the same design system.

### Acceptance criteria

- [ ] Actual project screenshots are used when genuine assets exist.
- [ ] Missing screenshots are reported rather than fabricated.
- [ ] No broken image requests.
- [ ] Project links and detail modal still work.
- [ ] Horizontal scroll story works both forward and backward on desktop.
- [ ] Mobile project list is usable without horizontal overflow.
- [ ] Images do not cause layout shift.

---

## 3. Phase B0 — fix the Journey active-navigation state (P2)

### Confirmed public audit finding

Opening `#journey` brought the Journey section into view, but the navigation continued to mark “Activity” as active. The active item is also reflected through `aria-current`, so this is a functional and accessibility issue, not merely a visual preference.

### Required changes

1. Inspect the source that assigns active navigation state, including any `IntersectionObserver`, scroll listener, hash-change listener, GSAP ScrollTrigger, and mobile-menu navigation handler.
2. Reproduce the issue before changing code if the current runtime is available. Do not assume the old report proves the bug still exists after unrelated changes.
3. Make active-state selection track the section actually in view and keep `aria-current` synchronized with the visual state.
4. Ensure direct navigation to `#journey` sets the right state after page load and after fonts/images/layout settle.
5. Test navigating between sections, scrolling down and back up, browser back/forward, and selecting a destination from the mobile menu.
6. Prevent competing active-state mechanisms from racing each other. If GSAP ScrollTrigger is already the section observer, do not add a second mechanism without a clear reason.
7. Preserve keyboard focus and current menu behavior.

### Acceptance criteria

- [ ] Journey is marked active when its section meets the existing active-section rule.
- [ ] Activity is no longer incorrectly active while Journey is selected/in view.
- [ ] Visual active state and `aria-current` agree.
- [ ] Direct hash navigation, normal scrolling, upward scrolling, and mobile navigation all work.
- [ ] No duplicate listeners or ScrollTriggers are introduced.

---

## 4. Phase B — global color and component consistency

### Current source findings

Source inspection found legacy accents in the project and journey implementations, including `#a43f2d` and `#1b1c18`, as well as technology logos with brand-specific colors. The global stylesheet contains repeated RV theme overrides, so a late selector can override an earlier correction.

Relevant files to inspect:
- `artifacts/portfolio/src/index.css`
- `artifacts/portfolio/src/components/ProjectsSection.tsx`
- `artifacts/portfolio/src/components/JourneySection.tsx`
- `artifacts/portfolio/src/components/TechnologyBands.tsx`
- Any global component stylesheet imported by these files

### Required changes

1. Search the full source for legacy colors such as:
   - `#a43f2d`
   - `#1b1c18`
   - `#c7dc62`
   - Any older red/rust/acid-green values used for visible UI
2. Distinguish between:
   - actual project brand colors inside original product screenshots,
   - achievement certificate content,
   - UI decoration belonging to the portfolio.
3. Replace legacy **portfolio UI** colors with RV tokens. Do not alter colors inside an original certificate or genuine project screenshot.
4. Fix journey icons so all icons remain visible against dark surfaces.
5. Make section kickers, index numbers, active states, hover states, focus rings, buttons, dividers, modal borders, and scrollbar treatment use the same design tokens.
6. Technology logos should use a consistent monochrome treatment, while retaining recognizable shapes and readable sizing.
7. Do not use accent blue and violet on every element. The majority of the page should remain dark, neutral, and readable.
8. Consolidate CSS:
   - Prefer one clear base rule and one final theme rule per component.
   - Remove obsolete selectors only after verifying no remaining component depends on them.
   - Avoid a chain of repeated `.portfolio-shell .projects-section` and similar overrides.
   - Do not rewrite all CSS mechanically.
   - Keep responsive and reduced-motion rules.
9. Search for low contrast after the change, including muted text, disabled controls, active nav, modal text, and small labels.

### Acceptance criteria

- [ ] No legacy accent colors remain in portfolio UI unless explicitly justified.
- [ ] No dark icon on a dark surface.
- [ ] CSS no longer depends on a confusing stack of duplicate theme overrides for the corrected components.
- [ ] All hover/focus/active states match the RV palette.
- [ ] No regression in intro, navbar, footer, award section, or secondary archive.

---

## 5. Phase C — hero composition on mobile and desktop

### Current source finding

In `artifacts/portfolio/src/components/HeroSection.tsx`, the large hero logo stage appears to use `hidden lg:block`, which means the desktop composition is not rendered below the large-screen breakpoint. Verify the current markup before editing.

### Objective

The RV monogram should remain part of the identity on every screen size, without crowding the main headline.

### Required changes

1. Keep the desktop hero composition as the desktop baseline unless a visual test demonstrates a problem.
2. Create a mobile/tablet-specific logo composition:
   - Smaller logo stage.
   - Same RV geometry, palette, and lighting language.
   - No desktop-sized empty space left behind when the desktop logo stage is hidden.
   - No clipping into browser safe areas or behind the navigation.
3. Maintain the headline and primary CTA as the main reading focus.
4. Use responsive font sizes and `clamp()` where appropriate.
5. Avoid awkward title wrapping at 320px and 360px.
6. Keep CTA targets comfortably tappable, ideally at least 44px high.
7. Do not add a giant floating cursor or hover-only visual effect.
8. Desktop pointer interaction may remain subtle; disable hover-specific scaling on touch devices.
9. Check the hero against the existing intro animation so the handoff from intro to hero does not feel like a sudden jump.
10. Do not duplicate accessible logo announcements. Decorative logo images should use empty alt text when the nearby text already identifies the brand.

### Acceptance criteria

- [ ] RV mark is visible and intentionally composed on mobile, tablet, and desktop.
- [ ] No dead empty area from hidden desktop-only content.
- [ ] Headline, supporting text, and CTA remain clear.
- [ ] No horizontal overflow at 320px.
- [ ] Intro-to-hero transition is visually continuous.
- [ ] Keyboard focus and reduced-motion behavior remain correct.

---

## 6. Phase D — technology bands: retain motion, improve comprehension

### Current source finding

`artifacts/portfolio/src/components/TechnologyBands.tsx` contains BUILD, SYSTEM, and NETWORK bands, duplicate sequences for seamless marquee movement, GSAP animation, and a touch-active icon state. The current touch state highlights an icon but does not reveal its name.

### Objective

Keep the kinetic, monochrome, editorial technology bands while making each technology identifiable and accessible.

### Required changes

1. Preserve the three categories:
   - **BUILD:** React, TypeScript, JavaScript, HTML, CSS, C#, Node.js, Git, GitHub, Tailwind
   - **SYSTEM:** Windows, Linux, Android, Visual Studio, VS Code, Termux, Kali Linux, Debian
   - **NETWORK:** MikroTik, Cisco, Router, Switch, VLAN, TCP/IP, Network Infrastructure
2. Do not add a PLATFORM band to this component.
3. Keep the current opposite motion directions and restrained pace unless testing shows the motion is distracting.
4. Keep logos monochrome by default and consistent in visual weight.
5. Desktop:
   - Hover/focus should reveal a concise technology name.
   - Keyboard users must be able to identify each item.
   - Do not require mouse hover for essential content.
6. Mobile:
   - Provide a visible, readable name on tap or a stable label treatment that does not require hover.
   - Ensure touch targets and labels do not overlap adjacent items.
   - Do not create a modal or tooltip that blocks scrolling.
7. Motion:
   - Pause or gently reduce movement on deliberate interaction if useful.
   - Preserve seamless looping without a visible jump.
   - Keep scroll-velocity response restrained.
   - Disable continuous animation for `prefers-reduced-motion: reduce`.
8. Keep the bands inside the viewport. No horizontal page overflow.
9. Do not imply that every listed tool is an expert-level skill. These are technologies and systems the developer works with or studies.

### Acceptance criteria

- [ ] Exactly three bands: BUILD, SYSTEM, NETWORK.
- [ ] No PLATFORM band in this component.
- [ ] Technology names are available on desktop and mobile.
- [ ] Marquee loops seamlessly.
- [ ] No layout shift or page-level horizontal overflow.
- [ ] Reduced-motion users receive a readable static alternative.

---

## 7. Phase E — education timeline and achievements

### Current source finding

`artifacts/portfolio/src/components/JourneySection.tsx` currently mixes school context, a project, awards, a CTF result, and an ongoing milestone. It does not show the complete four-period education history below as a distinct education timeline.

### Verified education data

Use exactly these periods. The last entry must be labeled **SMK / Vocational High School**, not generic SMA, because the current school is SMK Negeri 2 Lubuk Basung.

| Period | Level | Display label |
|---|---|---|
| 2014–2015 | TK | Kindergarten |
| 2015–2021 | SD | Elementary School |
| 2021–2024 | SMP | Junior High School |
| 2024–Present | SMK | Vocational High School |
| Current school | School | SMK Negeri 2 Lubuk Basung |
| Current program | Major | TJKT |

### Required changes

1. Create a distinct Education Timeline within the journey section or as a clearly connected sub-section.
2. Show the four periods in chronological order, with the current SMK entry highlighted.
3. Do not invent names of TK, SD, or SMP.
4. Do not imply a specific month for the transition between school levels.
5. Keep the project and achievement milestones available, but visually distinguish them from formal education history.
6. If the existing JourneySection is refactored, preserve achievement unlock behavior and any existing data-testid values or update tests accordingly.
7. Timeline visual:
   - Vertical connected line.
   - Four clear nodes.
   - Current entry highlighted in blue/violet.
   - Calm editorial layout, not four generic cards.
8. Scroll animation:
   - Draw the line using GSAP ScrollTrigger with `scrub`.
   - Scrolling upward must reverse the line and node animations.
   - Avoid one-way entrance-only animations for the timeline.
   - Reduced-motion mode should show the full timeline without requiring scrolling through animations.
9. Mobile:
   - Keep dates readable.
   - Prevent the timeline line and nodes from overlapping text.
   - Stack content cleanly.
10. Preserve the verified achievements:
    - Juara I, LKS IT Software Solution For Business, Kabupaten Agam, 2025.
    - CTF Competition — 2nd place; no event name, date, or score should be invented.
    - VIREON Library as a school-context digital library project.

### Acceptance criteria

- [ ] Four education periods appear in correct order.
- [ ] Current education is clearly SMK Negeri 2 Lubuk Basung, TJKT.
- [ ] No unverified school names or dates are invented.
- [ ] Education and achievements are visually distinct.
- [ ] Scroll animation reverses naturally.
- [ ] Existing achievement logic still works.

---

## 8. Phase F — motion system audit, not a motion rewrite

### Existing motion foundations

The current project already includes:
- RV intro logo assembly in `IntroAnimation.tsx`
- GSAP / ScrollTrigger project story
- Horizontal pinned project presentation on wide desktop
- Scroll-driven journey line
- Technology marquees
- Lenis desktop smooth scrolling in `useLenis.ts`
- Hero/logo hover treatment and navigation motion

Do not replace these systems simply to make the code look different.

### Motion principles

Before implementing motion changes, use the relevant official skills available in the Replit workspace: `gsap-react`, `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, and `gsap-performance`. Use `gsap-plugins` or `gsap-utils` only where a concrete requirement justifies them. Read the applicable skill instructions before editing GSAP code. The Markdown plan defines what needs fixing; the skills guide safe implementation.

**Intro-specific requirements from the audit:**
- Inspect `IntroAnimation.tsx` and confirm exactly when the fullscreen intro appears, how it is dismissed, and whether it traps access to meaningful content.
- Keep a prominent, readable Skip control with keyboard focus styling and a sufficiently large target; do not make it visible only on hover.
- Confirm Skip works immediately and cannot leave scroll locking, overlays, or intro-only styles stuck on the page.
- Keep the RV logo assembly identity, but shorten or streamline the sequence if it delays the hero unnecessarily.
- Support `prefers-reduced-motion` by skipping or simplifying the sequence without delaying access to the portfolio.
- The supplied public audit did not verify first-load intro behavior. Re-test it from a fresh page load and report precisely how it was tested.

1. **One dominant motion idea per section.**
   - Hero: brand reveal and typography.
   - Technology: continuous but restrained kinetic bands.
   - Projects: cinematic horizontal progression on desktop; stacked scroll experience on mobile.
   - Journey: line draw and active milestone.
   - Navigation: controlled panel transition.
2. Avoid adding a fade-up animation to every element.
3. Scroll-linked animation must use `scrub` when reversible motion is intended.
4. Use `gsap.context()` / `useLayoutEffect()` cleanup consistently and kill/dispose observers, triggers, timelines, and delayed calls.
5. Avoid animating expensive properties continuously. Prefer transforms and opacity; use clip-path sparingly.
6. Do not animate layout-affecting properties like width/height on every frame unless there is a compelling reason.
7. Respect `prefers-reduced-motion`. Reduced motion should disable marquees, pinning, and nonessential transforms while keeping content fully available.
8. Avoid scroll hijacking. Preserve native touch scrolling on mobile.
9. Keep Lenis desktop-only behavior unless testing supports a change. Ensure it does not fight with modals, navigation scroll locks, or ScrollTrigger refreshes.
10. Avoid competing fixed/pinned sections that make it difficult to reach the footer.
11. Test fast scroll, slow scroll, stopping mid-animation, scrolling upward, browser resize, opening/closing navigation, and reduced-motion mode.

### Acceptance criteria

- [ ] No duplicate ScrollTriggers after hot reload or resize.
- [ ] Animations reverse when scrolling upward.
- [ ] No jump in scroll position when pinned sections start/end.
- [ ] No horizontal overflow.
- [ ] Mobile scrolling remains native and responsive.
- [ ] Reduced-motion mode is usable and complete.
- [ ] No new console warnings or animation errors.

---

## 9. Phase G — stylesheet consolidation and maintainability

### Objective

Make future visual changes predictable. Do not make a cosmetic cleanup that silently changes unrelated sections.

### Required changes

1. Inspect `artifacts/portfolio/src/index.css` and all imported component styles.
2. Identify duplicated selector blocks and obsolete pre-RV theme overrides.
3. Consolidate rules in small component-scoped groups:
   - Global RV tokens
   - Hero
   - Navigation
   - Technology bands
   - Projects
   - Journey / education
   - Awards
   - Contact / footer
   - Responsive rules
   - Reduced-motion rules
4. Preserve all existing working styles before deleting anything.
5. Prefer component classes over fragile selectors such as `article > p:last-child` when the component can have a stable named class.
6. Avoid scattering `!important`. Remove it only after checking the cascade; do not start a cascade war with a bigger hammer.
7. Keep mobile breakpoints and reduced-motion behavior in one discoverable location where practical.
8. Avoid unrelated formatting changes in the same commit.

### Acceptance criteria

- [ ] Duplicate overrides for corrected sections are consolidated.
- [ ] No dead CSS is removed without confirming it is unused.
- [ ] Visual regression checks pass for every main section.
- [ ] Responsive and reduced-motion behavior remains intact.
- [ ] Build and lint/type checks pass where configured.

---

## 10. Phase H — final responsive, accessibility, and regression QA

Perform this only after phases A–G have been reviewed.

### Viewport matrix

Test at minimum:
- 320 × 700
- 360 × 800
- 390 × 844
- 414 × 896
- 768 × 1024
- 1024 × 768
- 1366 × 768
- 1440 × 900

### Manual interaction checklist

- [ ] Intro animation completes and Skip works.
- [ ] Intro respects reduced motion.
- [ ] Navbar opens and closes by mouse, touch, and keyboard.
- [ ] Escape closes overlays/modals where appropriate.
- [ ] Focus remains visible and is not trapped behind closed overlays.
- [ ] Project live links and GitHub links open correctly.
- [ ] Project detail modal opens, closes, and restores focus.
- [ ] Desktop project story scrolls horizontally and reverses on upward scroll.
- [ ] Mobile project presentation remains vertical.
- [ ] Technology bands do not create page-level horizontal scrolling.
- [ ] Education timeline is legible and its line animation reverses.
- [ ] LKS award and certificate links still work.
- [ ] CTF remains recorded as 2nd place without invented details.
- [ ] GitHub activity still loads or has a graceful fallback.
- [ ] Comments, Supabase-backed functionality, visitor tracking/admin, and music controls remain intact.
- [ ] Contact links work.
- [ ] Footer is reachable without getting trapped in a pinned section.
- [ ] No broken images, failed asset requests, or runtime errors.
- [ ] Contrast and focus states are usable.
- [ ] Reduced-motion mode preserves all information.
- [ ] No horizontal overflow at any viewport in the matrix.

### Performance and legibility checks informed by the public audit

- Inspect `favicon.png` actual pixel dimensions, file size, and current usage. Re-encode/resize only if the source dimensions or format justify it; preserve sharpness and transparency if present.
- Record a genuine cold-load measurement using available browser tooling before claiming performance improvement. Do not treat the supplied ~911 KB session transfer as a cold-load measurement.
- Do not report Lighthouse scores unless Lighthouse was actually run. If Lighthouse is unavailable, state that limitation.
- Inspect informative kicker/index/metadata text around the reported 9–10 px range. Increase size and/or contrast for labels that are hard to read, especially on mobile; do not indiscriminately enlarge every label.
- Slightly improve contact-card supporting-text contrast only if a direct rendered check confirms it is too faint.
- Reconsider the large Projects intro whitespace only if doing so improves access to the first project without undermining the editorial composition.

### Build / repository checks

Run the package's available commands after each phase:
- Inspect `package.json` first.
- Run the existing build command.
- Run lint/typecheck/test commands if they exist.
- Do not invent a passing result if a command is unavailable.
- Review `git diff` before committing.
- Use one focused commit per phase if the agent has repository write access.
- Do not push to production or change deployment settings without explicit authorization.

---

## 11. Required execution protocol for the agent

For every phase:

1. **Inspect:** identify exact files, selectors, components, and dependencies.
2. **Plan:** summarize the smallest set of changes.
3. **Implement:** modify only files needed for that phase.
4. **Verify:** run relevant checks and inspect rendered output.
5. **Report:** list files changed, what was tested, results, and remaining blockers.
6. **Stop:** do not continue to the next phase until the phase report is complete.

### Phase order — updated using the latest public audit

1. **Phase A — Actual project visuals (P1).** Inspect real assets and use genuine screenshots where available. If assets are missing, report the exact missing files and use only a clearly labeled fallback.
2. **Phase B0 — Journey active-navigation fix (P2, concrete bug).** Reproduce and correct the mismatch between the visible section, visual active state, and `aria-current`.
3. **Phase F — Targeted intro and motion audit (P1/P2).** First improve intro Skip/access timing, then test the existing GSAP/ScrollTrigger project story and reduced-motion/mobile behavior. Do not rewrite the motion system wholesale.
4. **Phase D — Technology-band labels/accessibility (P2).** Make technology names readable without relying on hover.
5. **Phase 1 — Design tokens and visual consistency.** The public audit reported the overall palette and hierarchy as consistent, so make only targeted corrections proven necessary; do not restyle working sections without cause.
6. **Phase B — Remaining confirmed color/component inconsistencies.** Fix legacy UI colors only when still present in the current runtime/source and distinguish them from real project/certificate colors.
7. **Phase C — Hero mobile composition.** The public audit found the hero broadly effective; reproduce any actual small-screen issue before changing the design.
8. **Phase E — Education timeline.** Confirm that missing education periods remain a source/runtime gap before implementing the new timeline, and preserve achievement data.
9. **Phase G — Targeted CSS consolidation.** Do this only after functional and visual corrections, and avoid a large mechanical refactor.
10. **Phase H — Final responsive, accessibility, performance, and regression QA.** Include the explicit unverified tests listed in the public-audit supplement.

Every phase must be implemented, tested, and reported separately. If screenshot assets are missing, do not invent them or silently skip the gap.

### Final report format

```text
PHASE:
STATUS: Complete / Partial / Blocked

FILES CHANGED:
- ...

IMPLEMENTED:
- ...

VERIFICATION:
- Build:
- Typecheck/lint/tests:
- Viewports inspected:
- Motion / accessibility tested:

REMAINING ISSUES:
- ...

NEXT PHASE:
- ...
```

### Start instruction

Start with **Phase A only: actual project visuals**. Inspect the current repository, public/project assets, and `ProjectsSection` before editing. Implement only the smallest verified change for this phase, run the available checks, and report changed files, test results, whether genuine screenshots were found, and any blockers. Do not start Phase B0 or any other phase until instructed.
