# VIERLYKIRK — Responsive Motion Design System PRD

**Project:** VIERLYKIRK / Reyhan Irza Alvano portfolio  
**Document type:** Product + interaction + animation + engineering specification  
**Version:** 2.0 — detailed implementation brief  
**Status:** Planning / approval required before implementation  
**Primary target:** Responsive mobile and desktop web  
**Core stack assumption:** Existing React + GSAP + ScrollTrigger + current smooth-scroll implementation, subject to source audit  

> **Important:** This document specifies the intended experience. It is not evidence that any behavior has already been implemented or tested. The coding agent must audit the current repository first and report what actually exists before changing source files.

---

## 0. Executive brief

Upgrade VIERLYKIRK from a portfolio with separate entrance effects into a coherent, signature-led motion experience. It should feel active, crafted, responsive, and premium on both mobile and desktop without making the page slow, difficult to navigate, or visually exhausting.

The objective is **not maximum animation density**. The objective is meaningful motion density: every major section either has a distinct motion role or intentionally uses stillness to give the previous moment space to land.

### Desired user impression

1. The opening establishes a recognizable personal identity, not a generic developer template.
2. Scrolling feels guided, fluid, and continuous rather than like a stack of unrelated cards.
3. Different sections have different motion behaviors, while sharing the same visual grammar.
4. The mobile experience feels designed for touch and a narrow viewport, not merely compressed from desktop.
5. Motion stays smooth and comprehensible on ordinary mobile devices, even when some decorative effects are reduced.
6. All content remains accessible and usable if animation is disabled, delayed, interrupted, or unsupported.

### Product priorities

1. Preserve correctness and usability of the existing portfolio.
2. Establish one repeatable motion language.
3. Add distinctive section choreography where it improves storytelling.
4. Adapt the choreography per breakpoint.
5. Validate performance, reverse scrolling, accessibility, and regression.

---

## 1. Project identity and visual constraints

### 1.1 Identity

- Brand: VIERLYKIRK; portfolio owner: Reyhan Irza Alvano.
- Signature: geometric RV monogram.
- Character: premium tech, editorial, geometric, personal, interactive.
- Mood: dark, calm, precise, intelligent, ambitious, crafted.
- Motion should feel controlled and confident, not loud, playful by default, or like a gaming interface.

### 1.2 Existing visual tokens to preserve unless audit identifies a real inconsistency

| Token | Value | Intended role |
|---|---|---|
| Background | `#05070B` | Main canvas |
| Surface | `#0A0E15` | Primary surface |
| Elevated surface | `#101621` | Selected panels and overlays |
| Primary text | `#F5F7FA` | Main content |
| Silver secondary | `#C9D0DC` | Secondary content / signature accents |
| Muted text | `#8B93A3` | Supporting metadata |
| Border | `rgba(255,255,255,0.07)` | Fine structure |
| Signature blue | `#667CFF` | Active states and selective emphasis |
| Violet accent | `#8B6CFF` | Secondary accent, used sparingly |
| Blue ambient | `rgba(102,124,255,0.15)` | Restrained light falloff |
| Violet ambient | `rgba(139,108,255,0.12)` | Restrained light falloff |
| Headings | Manrope | Primary editorial typography |
| Technical labels | DM Mono | Indices, labels, metadata |

Do not automatically repaint the website, replace its type system, or add gradients everywhere as part of the motion task.

### 1.3 Explicit anti-goals

Do not introduce:

- One identical `fade-up` preset for every section.
- Random floating particles, blobs, code symbols, or unrelated 3D objects.
- A large animated cursor or cursor-following light that becomes the main attraction.
- Constant rotation or perpetual movement on every card, logo, or heading.
- Heavy full-screen blur effects or multiple large animated filters.
- Scroll hijacking, long mobile pin sequences, or forced horizontal scrolling on touch devices.
- Hover-only functionality that is inaccessible on touch and keyboard.
- Animation that hides essential content while waiting for JavaScript.
- Fake project screenshots, invented achievements, fake certificate details, or fictional metrics.
- Replacement of working project, comments, music, visitor-tracking, admin, navigation, or modal functionality without explicit approval.

---

## 2. Current-state audit is mandatory

Before writing code, the agent must inspect the actual repository and establish a baseline.

### 2.1 Inspect

- Git branch, current `HEAD`, working tree status, and pre-existing user changes.
- App framework, routing, current dependencies, build/typecheck scripts.
- Existing GSAP timelines, ScrollTriggers, CSS animations, SVG animations, and component-local effects.
- Current smooth-scrolling library and how it is synchronized with GSAP, if present.
- Existing intro animation, Skip behavior, navbar active-section tracking, and focus handling.
- Projects' horizontal desktop / vertical mobile behavior and modal focus management.
- Journey / Education timeline and separate Achievements / Awards content.
- Reduced-motion handling, responsive CSS breakpoints, and content visibility before hydration.
- Image sizes, loading behavior, fonts, layout shifts, and existing console errors.

### 2.2 Required baseline report

Create a table with these columns:

| Field | Required information |
|---|---|
| Section | Actual section/component name |
| Existing motion | What exists in source and what was visually inspected |
| Trigger | Load, click, hover/focus, viewport entry, scroll progress, or continuous loop |
| Scroll behavior | `scrub`, `pin`, `toggleActions`, or no ScrollTrigger, as applicable |
| Reverse behavior | What happens when scrolling upward |
| Responsive behavior | Desktop, tablet, mobile, reduced-motion |
| Lifecycle | Setup, cleanup, possible duplicate triggers / event listeners |
| Performance risk | Low / medium / high, with reason |
| Proposed action | Keep, fix, refine, replace, or leave still |
| Evidence | Source path, test output, screenshot, or clearly marked assumption |

### 2.3 Baseline safety rules

- Do not overwrite uncommitted work.
- Do not install dependencies during the read-only audit.
- Do not commit, push, fetch, deploy, or mutate task state unless explicitly authorized.
- Do not inspect or change production database contents for motion work.
- Do not claim a physical-device test unless it was actually performed on a device.
- If an available preview or browser cannot reach Supabase, external URLs, music, or visitor tracking, record the blocker separately instead of treating it as a motion failure.

**Phase 0 must end with a report and stop for approval. No source edits during Phase 0.**

---

## 3. Experience architecture: one motion language, multiple movement styles

The portfolio should use four reusable visual signatures. Their shape, scale, and timing may vary by section, but they must feel related.

### 3.1 Signature A — Geometric trace

A thin line or sequence of angular line segments derived from the RV mark. It can reveal, extend, connect, or terminate at meaningful points. It must not become random decorative wiring.

**Use:** Hero, selected section transitions, Journey progress, contact/footer closure.  
**Avoid:** drawing the same large line across every section or placing it behind dense text.

### 3.2 Signature B — Active node

A small marker identifies the current section, timeline point, or active project. It may use a restrained opacity/scale transition or a short line extension.

**Use:** Journey milestones, project index/progress, current section indicator where useful.  
**Rule:** active state must be tied to actual UI/scroll state, not a decorative animation running independently.

### 3.3 Signature C — Editorial index

Monospaced section numbers, project indexes, dates, and small labels create a technical/editorial rhythm. They can count, reveal, or update when the associated content becomes active.

**Use:** Projects, Journey, Achievements, selected section headers.  
**Rule:** numbers must reflect real sequence/state and must not imply fabricated metrics.

### 3.4 Signature D — Ambient light / movement

A faint, slow-moving light or very low-amplitude position change creates depth. It is secondary atmosphere, never the main focal point.

**Use:** One or two deliberate locations at a time, preferably Hero and/or lower-page closure.  
**Rule:** decorative loops must be inexpensive, non-blocking, and disabled or simplified under reduced motion. No many-layer full-screen animated blur.

### 3.5 Composition rhythm

Create contrast across the scroll journey:

- **Signature moments:** stronger choreography, such as Hero and Projects.
- **Progression moments:** motion communicates sequence, such as Journey.
- **Evidence moments:** subtle reveal frames real achievements/certificates.
- **Quiet moments:** content is allowed to sit still so the page does not feel constantly busy.

The system should feel consistent through design grammar, not because everything moves in the same way.

---

## 4. Motion tokens and animation rules

These are initial design ranges. Audit the actual site and tune them through visual QA before standardizing them.

### 4.1 Duration families

| Family | Suggested range | Use |
|---|---:|---|
| Micro feedback | 100–200 ms | Button press, active marker, compact UI |
| UI transition | 180–320 ms | Menu, tab/index change, modal state |
| Small reveal | 300–550 ms | Label, short line, supporting text |
| Section reveal | 450–800 ms | Headline mask, image crop, milestone |
| Signature sequence | 700–1200 ms | Logo construction or rare focal transition |
| Ambient loop | Usually 6–16 s | Subtle decorative movement only, not essential content |

Long durations are allowed only when the user remains in control and the motion does not block access to content. Do not delay every section with a long sequence.

### 4.2 Easing vocabulary

Define a small reusable vocabulary rather than choosing random easing per tween.

- **Crisp:** small UI response with no overshoot.
- **Editorial:** confident deceleration for text/image reveals.
- **Smooth continuation:** movement linked directly to scroll progress; use linear mapping where appropriate.
- **Ambient:** gradual movement with no attention-grabbing start/stop.

Use supported GSAP eases and existing project conventions. Avoid elastic/bounce movement unless a real interaction specifically benefits from it. Scroll-linked motion should not add arbitrary easing that makes the element lag or drift away from the actual scroll position.

### 4.3 Distance and scale

Initial suggested ranges:

- Micro displacement: 4–12 px.
- Normal reveal: 8–24 px.
- Large editorial shift: 24–64 px, only for specific desktop moments.
- Mobile displacement: generally 4–18 px.
- Scale changes: small enough not to look like a pop or cause clipping; avoid scaling text as the default reveal method.

Values are starting points, not mandatory constants. Tune against typography, viewport, and actual motion performance.

### 4.4 Stagger rules

- Stagger should make hierarchy legible, not force users to wait through every element.
- Use two or three meaningful groups instead of animating each word or character by default.
- Stagger order must follow reading order and not create confusing keyboard/screen-reader sequencing.
- On mobile, reduce the number of staged items when the section contains many elements.

### 4.5 Scroll-linked versus entrance animation

Use the correct interaction model:

- **Entrance/reveal:** triggered by viewport entry; should not continuously fight the user's scroll.
- **Scrub:** used when movement should represent scroll progress, such as a line drawing or desktop horizontal project track.
- **Pin:** used only when temporarily holding a section adds clear narrative value.
- **Interaction timeline:** triggered by click, focus, or menu/modal state.
- **Ambient loop:** independent of scroll only when it adds real value and remains low-cost.

Do not combine conflicting trigger strategies on the same tween. In particular, avoid mixing `scrub` with `toggleActions` as though they control the same behavior.

---

## 5. Section-by-section specification

Each section must define its entry, in-section state, exit, reverse behavior, mobile variation, and reduced-motion behavior. Exact selectors and trigger boundaries must be set after source inspection.

### 5.1 Intro / loading experience

**Purpose:** Introduce the signature mark quickly and hand over to the actual page. It must not feel like an unnecessary gate.

**Entry / sequence**
1. Keep the existing RV mark construction if it is stable and matches the brand.
2. Prioritize silhouette/geometry over flashy glow.
3. Keep the Skip control visible, keyboard accessible, and easy to tap.
4. Finish directly into the Hero composition; avoid an awkward blank-frame pause.

**Behavior**
- The intro must not repeatedly replay on normal scroll or ordinary internal navigation unless the existing product intentionally requires it.
- Escape/Skip should end the sequence and restore normal scrolling and focus correctly.
- If JavaScript or animation initialization fails, essential portfolio content must still be reachable.

**Mobile**
- Use a simpler logo build if the full sequence creates long wait time or excessive rendering cost.
- Keep Skip comfortably tappable and visible without covering the mark.

**Reduced motion**
- Skip or simplify the construction and expose the page immediately.

**Acceptance**
- No stuck scroll lock.
- No unreachable page because the intro did not finish.
- Skip and Escape behavior verified where supported.
- No repeated animation initialization after mount/remount.

### 5.2 Hero

**Purpose:** Establish identity, role, personality, and a clear next action. This is the primary motion signature of the site.

**Composition**
- The RV mark is the visual anchor.
- Headline is the primary text anchor.
- Role/short introduction and primary action remain readable and quickly available.
- Geometry supports the composition but cannot compete with the headline.

**Desktop choreography**
1. A short mark/trace resolution or alignment moment.
2. Headline reveals by line/mask with controlled stagger.
3. Supporting text and primary action resolve in a separate beat.
4. Geometric trace connects to or points toward the next section.
5. On scroll away, selected layers move at different but restrained rates to create depth; content must not linger awkwardly over the following section.

**Mobile choreography**
1. Keep the same visual hierarchy, adapted to a narrow column.
2. Use line-level headline reveals instead of character-by-character animation.
3. Reduce parallax amplitude and remove decorative layers that cause crowding or overlap.
4. Keep CTA and first-screen identity visible without a prolonged sequence.
5. Do not bind the full screen to a long scrubbed timeline.

**Trigger model**
- Entrance can use a short timeline on initial page readiness.
- Scroll exit/parallax may be scroll-linked only if it remains smooth and does not hide the Hero content too early.

**Reduced motion**
- Show all Hero text and actions immediately; the mark can appear in its final state.

**Acceptance**
- Hero remains visually convincing at 320 px through wide desktop.
- Text does not clip, overlap, or become unreadable during transition.
- No perpetual multi-layer motion competing with the primary content.

### 5.3 Navigation and section index

**Purpose:** Make location within the page understandable and make movement feel responsive.

**Behavior**
- Current section indication must follow actual section state and remain consistent with hash navigation, click navigation, browser back/forward, and desktop/mobile menu states.
- Any active marker/line should transition quickly and accurately.
- Menu open/close motion should be short and should not delay interaction.
- Avoid animated navigation that causes layout shift or changes header height unexpectedly.

**Desktop**
- Use restrained active underline, marker movement, or label emphasis.
- Hover may add feedback but must not be required to understand link affordance.

**Mobile**
- Menu open/close should be clear and touch-friendly.
- Do not introduce a generic top drawer if the existing navigation uses another deliberate pattern.
- After navigation, close the menu, restore appropriate focus, and synchronize current section.

**Acceptance**
- Active state is correct on direct hash, click, and history navigation.
- Keyboard focus remains visible.
- Menu Escape/focus behavior works when applicable.

### 5.4 About / profile / proof section

Use the exact existing section name and content found in source.

**Purpose:** Shift from identity to credibility without repeating the Hero's signature reveal.

**Choreography**
- Introduce one visual anchor first, then one or two groups of supporting content.
- Use varied but related behavior, such as a label reveal, offset image/line reveal, or a controlled mask transition.
- Keep paragraphs readable; do not split every character.
- Avoid making all elements move upward by the same distance.

**Mobile**
- Use a simple reading-order reveal with shorter travel distances.
- Avoid simultaneous animations on a long stack of text blocks.

**Reduced motion**
- Content is displayed immediately. Decorative geometry can remain static.

**Acceptance**
- Section tells a different motion story from Hero.
- Reading flow is uninterrupted and all content stays discoverable.

### 5.5 Technology bands / tech stack

**Purpose:** Communicate technical familiarity without turning technologies into a distracting ticker wall.

**Choreography**
- If the current stack uses a marquee, audit its speed, loop seam, duplicate accessibility text, and pause behavior.
- Prefer slow, stable movement. Do not run multiple high-speed marquees simultaneously.
- Individual items may use small active/focus feedback rather than floating and rotating.

**Desktop**
- Hover/focus may pause the relevant marquee or reveal a brief label/description if content already supports it.

**Mobile**
- Ensure touch users can read all technologies without precision gestures.
- Allow static/wrapped rows or a slower, simpler track when necessary.

**Reduced motion**
- Pause marquee and show a complete static representation with no missing labels.

**Acceptance**
- No high-speed unreadable ticker.
- No page-width overflow caused by the track.
- Keyboard and touch can discover all items.

### 5.6 Projects / selected work

**Purpose:** The main storytelling section. Show actual work with enough visual depth to feel crafted while keeping the project facts and links clear.

**Content rules**
- Use actual project screenshots and verified project details only.
- Preserve live/demo and GitHub links where they currently exist.
- Project detail modal, close behavior, Escape handling, focus return, and inactive-panel focus protection must keep working.

**Desktop choreography**
1. Enter the section through a deliberate visual transition.
2. Use horizontal pinned storytelling only if the existing layout supports it and it is beneficial to narrative.
3. The project image may use a restrained crop/position reveal.
4. The text and index should respond to the active project state.
5. Use layered parallax sparingly; image, title, and background must not drift so far apart that the composition breaks.
6. Progress indicator reflects actual track progress.
7. When the track ends, release the pin cleanly so normal scrolling resumes.

**Mobile choreography**
1. Use a vertical project sequence by default.
2. Avoid a long pin that forces the user to scroll through many horizontal panels.
3. Use short image reveals and lightweight index changes.
4. Keep important links and buttons visible without requiring hover.
5. Avoid turning a native vertical scroll into a nested swipe maze.

**Trigger/lifecycle**
- Re-evaluate ScrollTrigger measurement after images and relevant layout dimensions settle.
- Ensure only one intended pin/trigger exists for the active breakpoint.
- Use responsive teardown/rebuild correctly when crossing breakpoints.
- Avoid animating pin-spacer/layout dimensions unnecessarily.
- Verify that active panel and keyboard focus stay aligned.

**Reverse behavior**
- Scrolling upward reverses scrubbed movement naturally.
- Active panel/index returns to the correct earlier state.
- A modal opened from a project stays independent of the page's scroll timeline.

**Reduced motion**
- Use the vertical/static project list or another clear non-pinned arrangement.
- Keep all project content and links available; do not hide inactive content from assistive technology without correct interaction semantics.

**Acceptance**
- Desktop pin begins and ends at intended boundaries.
- No duplicated pin after resize/remount.
- Mobile does not force horizontal page overflow.
- All links remain operable by keyboard and touch.
- Reverse scroll and project modal focus restoration are verified.

### 5.7 GitHub activity / live data / content-driven sections

**Purpose:** Show actual activity or dynamic content without implying that decorative motion is real data.

**Rules**
- Data visualization or activity levels must remain grounded in actual data returned by the existing integration.
- Use subtle reveal or highlight for the visualization; do not animate fake counts or fabricate activity.
- Loading, unavailable, and error states must not depend on animation to communicate status.

**Mobile**
- Preserve legibility and prevent wide graphs or grids from creating horizontal overflow.

**Acceptance**
- Data state and animation state cannot be confused.
- Errors/loading are understandable with motion disabled.

### 5.8 Journey / Education timeline

**Purpose:** Communicate chronological progression. This is a timeline, not the same content or motion style as Achievements.

**Known timeline to preserve**
- TK: 2014–2015.
- SD: 2015–2021.
- SMP: 2021–2024.
- SMK: 2024–present.

Use only school, department, and period details already verified in source/user-provided records. Do not infer graduation status or invent education milestones.

**Choreography**
1. The timeline line draws as the user progresses through the section.
2. The active node changes when its real milestone reaches the defined activation point.
3. Milestone title/date appears with a restrained reveal.
4. Supporting details appear only after the associated milestone is clear.
5. The progress line and active node reverse correctly while scrolling upward.

**Desktop**
- Use available width for an editorial timeline layout if present; preserve readable line lengths.
- The line can be scrubbed to show progression across the sequence.

**Mobile**
- Prefer a vertical timeline with simple line drawing and compact milestone reveals.
- Keep all dates and content readable at 320 px.
- Do not rely on left/right positioning that creates overflow.

**Reduced motion**
- Render the complete line and every milestone in the correct order immediately.

**Acceptance**
- Education remains distinct from formal awards and project work.
- Scroll-up state is correct.
- No timeline content is hidden by pinning or unsupported SVG behavior.

### 5.9 Achievements / awards / certificate evidence

**Purpose:** Establish credibility through real outcomes and visual evidence. Its language should feel like verification and recognition rather than a second education timeline.

**Known items that may appear if supported by the existing content**
- First place, LKS IT Software Solution For Business, Kabupaten Agam, 2025.
- Second place, CTF competition; do not invent event name/date/score unless verified.
- Digital library project VIREON.
- School certificate for digital library innovation, using the actual certificate image and the wording visible on that certificate.

**Choreography**
- A geometric frame or line reveal introduces the evidence.
- The achievement title/label receives primary emphasis.
- Date/category/source details enter as secondary information.
- Certificate preview or modal opens through a deliberate interaction, not through an unexpected scroll gesture.
- Avoid fake seals, fake stamps, fabricated scores, or exaggerated parallax on document images.

**Mobile**
- Certificate images must retain an understandable crop and provide a way to view the full document.
- Tap targets must be generous and keyboard behavior must be mirrored where relevant.

**Reduced motion**
- Show all awards and evidence without staged reveals.

**Acceptance**
- Every visible claim can be traced to actual user-provided or existing project evidence.
- No interaction depends on hover.
- Certificate remains legible and reachable on mobile.

### 5.10 News / comments / visitor/admin / music

**Purpose:** Preserve the existing interactive product features while making state transitions feel polished.

**Rules**
- Motion work must not silently rewrite database logic, authentication, admin permissions, comment submission, tracking, or music behavior.
- Use short, useful state feedback for loading, success, error, open/closed, and active states where the app already supports those states.
- Do not animate fake visitor counts or falsely imply a comment/music action succeeded before the actual result returns.
- Forms must keep labels, validation feedback, keyboard focus, and screen-reader semantics.
- Modal and panel animations must not break focus trap or focus return.

**Mobile**
- Buttons remain immediately available and tappable.
- Avoid large transition delays when opening menus, comments, or certificate views.

**Acceptance**
- Underlying data/auth behavior is unchanged by animation work.
- Existing unavailable-backend states remain truthful and visible.
- Keyboard and touch interaction are verified where testing capability allows.

### 5.11 Contact

**Purpose:** Make the next action clear and personal, not an afterthought after the main content.

**Choreography**
- Use a distinctive headline reveal or geometric trace that feels like the page is converging toward a final invitation.
- Contact links/buttons receive crisp feedback on hover, focus, and press.
- Keep contact information visually dominant over decoration.

**Mobile**
- Use a compact but high-contrast composition.
- Do not place important contact actions behind hover or scroll-triggered delayed content.

**Acceptance**
- Contact action is obvious with motion on or off.
- Decorative linework never reduces contrast or overlaps the action.

### 5.12 Secondary Archive and Footer

**Purpose:** Make the lower page feel finished and intentional instead of like a generic template appended at the end.

**Choreography**
- Carry the RV geometric trace or editorial index toward the closing section.
- Choose one restrained ambient element only if the composition benefits from it.
- Finish with a visual closure, such as a line resolving, index settling, or geometry aligning. Avoid a big theatrical finale.
- Secondary Archive must have a clear purpose based on its actual content. If it is intentionally empty or incomplete, report that content problem instead of masking it with animation.

**Mobile**
- Keep the footer compact, readable, and touch-friendly.
- Avoid large fixed decorative canvases that cost GPU without adding clarity.

**Acceptance**
- Footer links remain usable.
- No empty-looking section is hidden behind motion.
- No continuous animation competes with contact details.

---

## 6. Responsive behavior matrix

Breakpoints must follow the project's current CSS conventions after audit. Do not create multiple slightly different breakpoint systems without a reason.

| Viewport class | Suggested QA widths | Motion behavior |
|---|---|---|
| Small mobile | 320, 360 px | Minimal travel, vertical flow, no horizontal overflow, small ambient footprint |
| Standard mobile | 390, 430 px | Full mobile choreography, short parallax, line reveals, touch-first interaction |
| Tablet / small laptop | 768, 1024 px | Test transition between touch layout and desktop pin behavior; avoid breakpoint flicker |
| Desktop | 1280, 1366, 1440 px | Horizontal Projects story where justified, layered depth, larger editorial composition |
| Narrow resized desktop | Test 900–1100 px around actual breakpoint | Pin cleanup/rebuild, no duplicate ScrollTriggers, no abrupt layout state mismatch |

### 6.1 Breakpoint transitions

- Use the actual viewport media query rather than assuming mobile from user-agent alone.
- When a breakpoint changes, clean up the old animation and initialize the correct one.
- Avoid two active timelines controlling the same element.
- Avoid a visible jump in scroll position when moving between pinned and unpinned layouts.
- Recalculate trigger positions after actual layout changes, not on every arbitrary render.

### 6.2 Touch and pointer

- `hover` is an enhancement, never a requirement.
- Use pointer capability/media features when interaction is genuinely different for coarse and fine pointers.
- Press feedback should be short and subtle, and must not move the hit target under the user's finger.

---

## 7. Performance requirements: keep the quality, optimize the implementation

### 7.1 Performance philosophy

Do not make all animation static just to call it lightweight. Keep the signature motion; reduce unnecessary work, expensive properties, duplicate observers, and excessive simultaneous effects.

### 7.2 Property priorities

**Prefer where visually appropriate:**
- `transform` (translate/scale/rotate, used in moderation).
- `opacity`.
- SVG path progress for a limited number of simple paths.
- Mask/clip transitions only when tested on the supported browsers and devices.

**Use carefully and profile:**
- `clip-path` on large images or large surfaces.
- Large sticky/pinned scenes with several layers.
- Text splitting across long paragraphs.
- SVG filters and multiple translucent overlays.

**Avoid as a repeated animation technique:**
- Continuously animating `filter: blur()` over large regions.
- Animating expensive layout properties such as `width`, `height`, `top`, `left`, or large box shadows every frame when transform can achieve the result.
- Applying `will-change` globally or permanently to every animated element.
- Dozens of simultaneous infinite loops.

These are engineering priorities, not guarantees that any single CSS property is always inexpensive. Measure the resulting page in the target browser.

### 7.3 Concurrency budget

Use this as a review heuristic, not a universal browser limit:

- Keep continuous decorative motion to one or two deliberate motifs in the visible viewport.
- Do not run simultaneous large image parallax, several blur fields, multiple marquees, and continuous text motion in one viewport.
- Pause or simplify offscreen ambient behavior if it does not need to run.
- Prefer scroll progress updates through GSAP/ScrollTrigger instead of custom per-frame scroll handlers that repeatedly set React state.
- Keep expensive sequences event-driven or scroll-driven, not continuously polling.

### 7.4 FPS and responsiveness

- Aim for stable motion approaching 60 FPS on capable devices under representative test conditions.
- Report actual observed frame or trace evidence when tools make it available.
- Do not promise 60 FPS on every device or report fabricated FPS.
- Look for frame drops, input delay, layout shifts, scroll hitching, and excessive CPU/GPU activity.
- If a browser automation tool cannot measure frame rate, report that limitation and use observable scroll/console checks without claiming a performance score.

### 7.5 Loading and layout stability

- Reserve image aspect ratios and dimensions before images load.
- Avoid shifting ScrollTrigger start/end positions as fonts and images load without a corrective refresh strategy.
- Avoid hiding the full page behind a long animation while assets load.
- Lazy-load offscreen imagery where appropriate without leaving pinned scenes with zero-height placeholders.

### 7.6 Bundle/dependency budget

- Do not add Framer Motion or another animation runtime solely because motion feels weak; evaluate whether existing GSAP can meet the requirement first.
- Playwright CLI and documentation skills are development/testing aids, not production runtime dependencies.
- Record any added production dependency and explain its measurable benefit.
- Record build bundle-size before and after if the environment supports it.

---

## 8. GSAP / ScrollTrigger engineering requirements

### 8.1 Lifecycle and cleanup

- Use the project's existing recommended React + GSAP pattern, such as `useGSAP` if available and appropriate, or a correctly scoped `gsap.context()` cleanup.
- Scope selectors to the component/root rather than querying broad global selectors unnecessarily.
- Clean up timelines, ScrollTriggers, listeners, observers, and temporary styles when the component unmounts or the media condition changes.
- Ensure Strict Mode/remount behavior does not leave duplicate triggers.
- Do not make each React render create a new timeline.

### 8.2 Trigger strategy

For every ScrollTrigger, document:

- Target(s).
- Start/end logic and why it matches the composition.
- Whether it is scrubbed or event-triggered.
- Whether a pin is genuinely necessary.
- How upward scrolling behaves.
- What happens at mobile breakpoints and reduced motion.
- How layout changes or image loading affect its measurements.

Avoid arbitrary hard-coded trigger lengths without visual justification. Prefer start/end conditions that match the section's actual geometry and behavior.

### 8.3 `scrub` and `toggleActions`

- Use `scrub` when progress should map to scroll position.
- Use `toggleActions` for discrete enter/leave timeline behavior where that model is suitable.
- Do not attach conflicting assumptions to both for the same animation.
- For scroll-mapped horizontal tracks, use direct scroll mapping (typically linear mapping) rather than easing the tween independently of scroll position.

### 8.4 Pinning

- Pin only one major narrative unit at a time unless the layout and nested interactions are deliberately designed and tested.
- Avoid nesting pins without evidence that the composition requires it.
- Test actual pin duration, entry/exit, browser history, resize, and scroll restoration.
- Ensure pin spacers do not create overflow or a large blank region on mobile.
- Pinning is not allowed to trap touch users in a long sideways experience.

### 8.5 Smooth scrolling integration

- Audit whether the current smooth-scroll library is necessary and how it integrates with GSAP/ScrollTrigger.
- Do not add a second smooth-scroll system.
- If Lenis or another scroll utility is present, verify ticker/update synchronization and avoid duplicate scroll event pipelines.
- Native scrolling must remain usable when reduced motion is enabled or smooth scrolling is disabled.
- Do not interpret “smooth” as adding inertial scroll everywhere regardless of touch-device behavior.

### 8.6 Dynamic content and refresh

- Refresh ScrollTrigger after meaningful layout changes, such as image dimension settling or a responsive mode change, when appropriate.
- Do not call refresh on every render or on a tight loop.
- Verify that modal open/close does not unintentionally alter pinned layout measurements.
- Make loading/error/empty states geometrically stable where possible.

### 8.7 Text animation and accessibility

- Preserve a readable accessible text equivalent when splitting text into lines/words/characters.
- Avoid requiring screen readers to announce each animated character separately.
- Do not permanently set essential text to invisible before the animation has initialized.
- If text-splitting changes DOM structure, restore/clean up safely when responsive settings change.

---

## 9. Motion accessibility and user control

### 9.1 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Disable or simplify non-essential parallax, long scrub sequences, decorative loops, and large spatial shifts.
- Avoid pinned narrative sections where pinning is not necessary to access content.
- Render all information in its correct reading order.
- Show the final state of line drawing and reveal masks.
- Preserve navigation, modals, project links, forms, and active state.
- Never remove content simply because animation has been reduced.

### 9.2 Keyboard and focus

- Maintain visible focus indicators with sufficient contrast.
- Hover and focus should have consistent meaningful feedback.
- Menus/modals must preserve focus trap and focus return where applicable.
- Inactive panels must not keep focusable controls reachable when the intended interaction makes them inactive.
- Animation must never continually move the focused control away from the user.

### 9.3 Content and contrast

- Text must be readable over animated backgrounds in every frame.
- Do not use opacity as a permanent substitute for visual hierarchy if it harms contrast.
- Do not rely on color alone for selected/active state.
- Essential text must remain available when CSS animation or JavaScript fails.

### 9.4 Interaction comfort

- Avoid flashing, sharp high-frequency changes, or constant high-amplitude motion.
- Ambient movement should be subtle enough to ignore.
- Do not move targets on press in a way that makes touch interaction unreliable.

---

## 10. QA protocol and test matrix

Every implementation phase must run the tests relevant to the changed components. The final regression phase must run the complete matrix available in the environment.

### 10.1 Responsive viewport matrix

At minimum:

- 320 × 700.
- 360 × 800.
- 390 × 844 (or the closest available device viewport).
- 430 × 900.
- 768 × 1024.
- 1024 × 768.
- 1280 × 800.
- 1366 × 768.
- 1440 × 900.
- One resize sequence across the active desktop/mobile breakpoint.

If a viewport is unavailable, state that it was not tested; do not imply otherwise.

### 10.2 Required behavioral tests

- Scroll down through every animated section.
- Scroll back upward through those same sections.
- Enter a pinned Projects section, reach its end, then reverse direction.
- Resize while near/inside the Projects section and verify pin teardown/rebuild.
- Navigate using the navbar, direct hash, browser back, and browser forward.
- Open and close project details; test Escape and focus return where applicable.
- Test mobile touch/menu interactions; do not rely only on desktop emulation if physical touch is material.
- Enable reduced-motion preference and verify essential content and all links remain available.
- Load/reload when images/fonts are cached and uncached if possible.
- Verify no horizontal overflow and no unintentional blank vertical pin space.
- Check console errors and warnings.
- Check external integrations separately; classify network/backend failures as blockers where appropriate.

### 10.3 Automated checks

Use whichever tools the workspace actually supports:

- Existing typecheck/lint/build commands.
- `git diff --check`.
- Playwright CLI or an existing browser automation tool for repeatable viewport/navigation/console checks.
- Screenshots before/after at representative mobile and desktop sizes.
- Browser performance traces when supported.

Installing Playwright CLI or other tools requires reporting the exact install scope first if the environment/task constraints prohibit installing without approval. Do not add testing tooling to the shipped site's runtime dependencies.

### 10.4 Report format

For each phase report:

1. Summary of intent and implementation.
2. Files changed.
3. Motion behavior added/changed by section.
4. Devices/viewports and actual tests executed.
5. Build/typecheck/diff-check results.
6. Runtime/console issues and performance observations.
7. Known untested items or blockers.
8. Git status and any dependency changes.
9. Confirmation that no unapproved commit, push, deploy, or production data mutation occurred.

---

## 11. Proposed implementation phases and exit gates

### Phase 0 — Read-only audit

**Goal:** Understand reality before changing it.

Deliverables:
- Motion inventory per section.
- Existing breakpoint and smooth-scroll behavior.
- Duplicate/expensive/broken motion risks.
- Baseline desktop/mobile screenshots if available.
- Top 3–5 high-value changes ranked by impact, risk, and effort.

**Gate:** Stop and obtain approval. No source changes.

### Phase 1 — Motion foundations

**Goal:** Define reusable motion tokens, reduced-motion behavior, GSAP lifecycle pattern, and responsive motion policy.

Deliverables:
- Motion token document or scoped CSS/TS constants as appropriate.
- Documented naming conventions for timelines/triggers.
- Decision on current GSAP and smooth-scroll integration.
- One low-risk example or prototype only if approved.

**Gate:** Confirm foundations before touching all sections.

### Phase 2 — Hero signature prototype

**Goal:** Prove the visual language on one important section before rolling it out.

Deliverables:
- Distinct desktop and mobile Hero choreography.
- Reduced-motion fallback.
- Before/after screenshots and behavior notes.
- Cleanup and resize checks.

**Gate:** Review motion quality, not just code/build success.

### Phase 3 — Global transitions and navigation

**Goal:** Connect sections with a consistent but varied rhythm and correct active-section states.

Deliverables:
- Carefully chosen section-boundary transitions.
- Navbar/index state verified.
- No repeated generic reveal preset across every section.

**Gate:** Confirm scroll behavior both directions.

### Phase 4 — Projects storytelling

**Goal:** Improve project depth and progress without destabilizing existing behavior.

Deliverables:
- Desktop horizontal story refined if justified.
- Mobile vertical story refined.
- Pin lifecycle, resize, active panel, modal/focus behavior verified.

**Gate:** No duplicated ScrollTriggers or forced horizontal mobile flow.

### Phase 5 — Journey and Achievements

**Goal:** Make education progression and achievement evidence feel distinct.

Deliverables:
- Reversible scroll-linked Education line/node behavior.
- Separate evidence-focused award/certificate reveal.
- Accurate content and accessible non-animated state.

**Gate:** Check chronology, provenance, and reduced motion.

### Phase 6 — Technology, live content, contact, archive, footer

**Goal:** Complete the motion language without filling every quiet space with animation.

Deliverables:
- Tech stack behavior audited and refined.
- Interactive states polished without altering backend behavior.
- Contact hierarchy and page ending strengthened.
- Deliberate stillness retained where motion would be decorative noise.

**Gate:** No generic animation added just to meet a count.

### Phase 7 — Full regression and performance

**Goal:** Confirm that the new motion survives responsive layouts and everyday interaction.

Deliverables:
- Viewport test matrix.
- Scroll down/up and breakpoint resize reports.
- Reduced-motion and keyboard results.
- Build/bundle comparison where available.
- Remaining performance risks with evidence.

**Gate:** Final review before any commit/deploy; those actions require separate authorization.

---

## 12. Acceptance criteria

The PRD is considered implemented only when the following statements have evidence, or a specific unsupported item is clearly declared untested.

### Visual quality

- [ ] Motion feels varied yet recognizably part of the same VIERLYKIRK identity.
- [ ] Hero and Projects have clear signature moments.
- [ ] Journey communicates chronological progress.
- [ ] Achievements communicate verified evidence, not game-like decoration.
- [ ] Contact/footer feel intentional and complete.
- [ ] Some areas remain still to preserve contrast and breathing room.

### Responsive quality

- [ ] Desktop uses immersive behavior only where it serves the story.
- [ ] Mobile feels intentionally designed for touch and vertical flow.
- [ ] No horizontal overflow at target widths.
- [ ] Pinning and breakpoints do not cause jumps, duplicate triggers, or blank space.
- [ ] Hover is never the only way to discover or operate content.

### Motion correctness

- [ ] Scroll-linked animations reverse correctly.
- [ ] Every timeline/trigger has valid cleanup.
- [ ] Resize across breakpoints leaves only the correct animation mode active.
- [ ] Progress/active indices reflect actual content state.
- [ ] The intro cannot trap the user behind a loading state.

### Performance

- [ ] No avoidable large-area blur/filter loops or excessive continuous animations.
- [ ] Scroll handling does not cause unnecessary React renders on every frame.
- [ ] Images/layout are stable enough for reliable ScrollTrigger measurements.
- [ ] Build/bundle changes are reported honestly.
- [ ] Any performance claim is tied to actual measurement or explicitly qualified.

### Accessibility and integrity

- [ ] Reduced-motion users can access all content and functionality.
- [ ] Keyboard focus remains visible and modal/menu focus behavior is preserved.
- [ ] Essential content does not depend on successful animation initialization.
- [ ] Real projects, awards, dates, and metrics remain truthful.
- [ ] No unapproved backend, authentication, dependency, Git, or deployment changes.

---

## 13. Required agent workflow

- Work one phase at a time.
- Never begin the next phase without reviewing the previous report and receiving approval.
- Do not mass-rewrite components or styles.
- Make small scoped edits, preserving existing working features.
- Read official, version-appropriate GSAP documentation/skills if available; verify skill names and instructions rather than guessing.
- Use Playwright or another available browser automation path for regression when possible.
- If a tool is unavailable, say so and use an honest fallback.
- Do not install every suggested skill/tool at once.
- Use Context7 only if supported and helpful for current-version documentation.
- Do not add Framer Motion solely because the motion is currently minimal; the existing GSAP system is the first candidate to improve.
- Supabase tooling is out of scope unless a separate backend issue requires it.
- Strix/security tooling is out of scope for this motion task.
- Never print secrets or copy credentials into output.
- No commit, push, deploy, or production database change unless separately authorized.

---

## 14. First task prompt — copy into Replit Agent

Read `VIERLYKIRK_MOTION_PRD_V2_DETAILED.md` completely before acting.

**Perform Phase 0 only: read-only motion audit.**

Inspect the current source, installed dependencies, GSAP/ScrollTrigger/Lenis setup, responsive styles, reduced-motion handling, and Git state. Create the motion inventory required by Section 2. Report the actual behavior of Hero, navigation, About/proof, tech stack, Projects, Journey, Achievements, live/content sections, Contact, Archive, and Footer. Identify repeated/generic effects, missing motion opportunities, expensive effects, lifecycle risks, breakpoint problems, and reverse-scroll bugs.

If browser preview and automation are available, inspect representative mobile and desktop viewport sizes, scroll both downward and upward, and capture evidence. If a behavior cannot be tested, mark it untested. Do not claim runtime results from source inspection alone.

Rank the highest-value 3–5 improvements by user impact, visual distinctiveness, mobile benefit, performance risk, and implementation risk. Recommend only the skills/tools genuinely useful for the current environment. Do not install dependencies or skills during this audit unless explicitly approved.

**Strict read-only constraints:** Do not edit source files, dependencies, task state, secrets, database, Git history, remotes, or deployment. Do not commit, push, fetch, or deploy. Do not investigate or change Supabase backend configuration as part of this motion audit.

Return the audit, evidence, uncertainties, and recommended phase sequence. Stop and wait for approval. Do not start Phase 1.

---

## 15. Reference tools

- GSAP Skills: https://github.com/greensock/gsap-skills
- GSAP ScrollTrigger documentation: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Playwright CLI: https://github.com/microsoft/playwright-cli
- Context7: https://github.com/upstash/context7
- Optional design-system reconnaissance: https://github.com/amaancoderx/npxskillui
- Supabase AI tools (separate backend work only): https://supabase.com/docs/guides/ai-tools/plugins
- Strix (separate security work only): https://github.com/usestrix/strix

These resources support the workflow; they do not replace auditing the actual project or verifying the installed versions and runtime behavior.
