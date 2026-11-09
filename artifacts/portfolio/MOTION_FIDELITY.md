# Motion review • Reyhan portfolio

Review the [mobile film](docs/motion-evidence/mobile.mp4), [desktop film](docs/motion-evidence/desktop.mp4), [intro comparison](docs/motion-evidence/intro.jpg), [menu and project comparison](docs/motion-evidence/scenes.jpg), [Ibra menu frames](docs/motion-evidence/ibra-menu.jpg) and [Ibra scroll frames](docs/motion-evidence/ibra-scroll.jpg). The films contain actual Chromium frames with slow wheel steps, fast impulses, holds and reverse input. There are cuts between distant sections to make each interaction easy to find. Mobile includes a touch gesture.

## What the recordings establish

The supplied IbraCode capture (`382096.mp4`, 720×1604, about 52 seconds) shows a horizontal menu curtain, masked text, normal vertical reading flow, shallow image depth and a sequenced contact ending. Its camera input, easing curves and underlying animation engine cannot be recovered from pixels. The Ibra times below are approximate observations. The implementation values are explicit design choices. The supplied `index (1).html` governs the RV intro. Its four embedded WebP images were extracted byte-for-byte. The portfolio loads GSAP from its existing dependency.

## Intro and handoff

| Time after decoding | Action |
|---|---|
| 0–1.2 s | A centered hairline grows horizontally over the dark vignette. |
| 0.4–1.45 s | Three fragments enter along separate diagonals. Their offsets start at (−46%,−26%), (−34%,60%) and (46%,−40%). Each decelerates into a small hover offset over .85 s, with .1 s between starts. |
| 1.2–2.1 s | The stage scales up to 1.02. Fragments lock in the order middle, left, right over .5 s with power4.in. |
| 2.1–3.48 s | The full monogram takes over on the last lock. Its centered scale settles from 1.045 to 1 over .9 s. A masked sheen traverses the metal over .75 s. |
| 2.5–3.85 s | Logo rises 7% and scales to .9. The rule draws from center. Name characters lift 115% from a shared mask with .02 s stagger. The Creative Developer subtitle follows at 3.2 s. |
| 3.95–4.85 s | The name fades, and the logo flies toward the measured center and width of `.portfolio-nav-logo` with power3.inOut. The background dissolves at 4.1 s. The hero starts at 4.4 s. The intro releases the interaction lock at 4.85 s. |

The stage size tracks `min(108vw,720px,112vh)` on both form factors. Resize during docking finishes the transition safely. The integrated version preserves the newer Enter control in addition to Skip, Escape, focus containment and reduced motion. Tab cycles through both buttons. Reduced motion and asset failure release the content. Hidden tabs pause the timeline. The production version transfers focus to the real main section and starts the existing scrolling lifecycle. The source mock homepage had separate navigation, content and a replay control.

## Scene audit and implementation

| Ibra time / portfolio scene | Starting and ending pose, layering | Timing / input / reverse |
|---|---|---|
| 0–4 s, hero | RV image scales from 1.15 to 1. Three name lines enter from y110% and 3° behind masks, pivoting at their lower left. Rule draws from left. Supporting copy moves 18 px. | Entrance labels at 0, .18 and .65 s. Title duration 1.05 s and stagger .09 s. Scroll is independent of the entrance. |
| 4.7–8.5 s, mobile navigation | Panel travels from x100% to 0 from the right. Links lift out of their masks. Footer enters 14 px laterally stable below the links. | Curtain .85 s, power4.inOut. Links start at .24 s, .065 s stagger. Footer starts .4 s. Close reverses the same timeline. Short menus scroll internally. |
| 9.5–12 s, hero exit | Outer title rises up to 90 px while art moves down 24% and scales to 1.06. Scroll cue fades early. | Linear scrub with .35 s catch-up from section top/top to bottom/top. Moving backward restores the pose. |
| 12–14 s, technology lanes | Existing text lanes continue crossing the viewport. | Continuous CSS marquee. Reduced motion presents a static layout. |
| 14–20 s, headings and rules | SplitText lines rise from y110% and 2° about the bottom-left edge. Paragraphs enter 16 px behind the heading. Divider scaleX draws from center. | Heading starts at top/88% and plays once. Copy overlaps by starting at .2 s. Dividers scrub between top/95% and top/55% and reverse. |
| 20–27 s, reading | About row titles slide from x24. Individual body lines brighten from .35 to 1 opacity. | Headings enter once at top/88%. Reading runs from row top/86% to bottom/66%, linear scrub .35. Reversing dims the lines in reverse order. |
| 27–34 s, projects | Outer frame opens from 14% top/bottom inset with a 36 px lift. Nested screenshot depth travels y7% to −7% while scaling 1.14 to 1.05. Copy follows from 24 px with .08 s stagger. | Frame opens over 1.15 s. Copy starts .18 s later. Card entrance plays once. Depth tracks row top/bottom to bottom/top both ways. Mobile/tablet use vertical cards. Desktop pins the linear horizontal track only at ≥1024 px width and ≥720 px height. |
| 34–46 s, original portfolio records | Journey rows enter from x24 as one group. The education progress rail tracks the current milestone. Awards, certificates and GitHub activity retain their own content. | Rows use .65 s and .09 s stagger. Progress responds to reverse scroll and resize. Ibra's clients and testimonial sequences have no equivalent portfolio content. |
| 46–52 s, closing | Contact lines rise behind masks. Description follows. Links enter from x32. Email enters from y24. Footer inner content settles from y64. | Contact begins at top/78%. Supporting layers start at .2, .25 and .5 s. Contact reverses before its entry point. Footer scrubs from top/bottom to bottom/bottom. |

## Engineering and refinements

`HeroSection`, `Navbar`, `Reveal`, `ProjectsSection` and `SectionBoundary` previously emphasized time-based reveals and one-time project zoom. The rebuilt scenes use independent outer/inner transform owners for entrance, scroll and hover. `motion.ts` registers SplitText with ScrollTrigger. `useEditorialScenes` scopes the reading and closing timelines with matchMedia and context cleanup. `useLenis` and `scroll.ts` already synchronize one Lenis instance with the GSAP ticker. Touch uses native scrolling. Framer Motion handles existing React dialogs.

Visual review changed the menu from a vertical entrance to the observed right-hand curtain. Checking short viewports exposed flex shrinking in the menu. Checking resize exposed unread education milestones. Comparing project frames showed the first letters of the actual site capture being cropped. The final pass preserves the whole screenshot with an inner margin while its wrapper continues to move. A lighter scrim keeps the outgoing hero readable as the menu enters. Removing the CSS opacity transition from the navbar lets the GSAP handoff settle on time.

## Acceptance and outstanding differences

TypeScript and the production build pass. The [browser suite](docs/motion-evidence/browser-tests.txt) passed 32 tests with two dev-server-only checks skipped in build mode (injected render failure and direct trigger refresh instrumentation). The [five-width capture results](docs/motion-evidence/acceptance.json) cover 360, 390, 430, 768 and 1280 px, including viewport overflow, reverse position, stopped-state drift and live reduced motion. The 390 px run verifies emulated touch. Production APIs and Google Fonts use test fixtures in these recordings. The backend was outside the change.

The strongest visual matches are the supplied RV intro assembly, the menu direction and ordering, masked heading entrances and reversible image depth. The RV hero uses typography and monogram artwork where Ibra uses a full-screen landscape. About lacks the large portrait. Section order, menu density and closing length differ. The desktop pin is an adaptation from a mobile-only reference.

Synthetic CPU throttling measures frame intervals under one Chromium workload. Physical Android/iOS GPU performance, thermal throttling, production fonts and sustained battery impact remain unmeasured. See the log for the measured intervals. Vite still reports a main bundle above 500 kB. These results do not establish 60 FPS or percentage fidelity.

To reproduce, build the frontend and point `PORTFOLIO_BUILD_DIRECTORY` at `dist/public`. Set `CHROMIUM_PATH`, then run `node --test --test-concurrency=1 tests/*.browser.test.mjs`. Use `node tests/record-motion.mjs` with `MOTION_EVIDENCE_DIR` and optional `INTRO_REFERENCE_HTML` to regenerate the scene captures. Recording requires Playwright's ffmpeg encoder. The official GSAP project guides and source lock come from https://github.com/greensock/gsap-skills.
