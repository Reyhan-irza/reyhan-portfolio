# RV · Spatial motion and typography revision

17 November 2026. Branch `feat/rv-spatial-typography`, based on main `a1044b9`. Existing VIREON artwork and all functional sections retained.

This is a response to Rey’s latest direction. The latest instruction moves running text before contact, removes its pause button and adds an opposite-direction row. It supersedes the older footer-marquee and serif-font decisions in `MOTION_FIDELITY.md`.

## Motion fidelity matrix · before / after

| Scene | Observed baseline / request | Implemented behavior | Remaining difference |
| --- | --- | --- | --- |
| Intro | Existing supplied RV assembly film; no Enter button | Film preserved. Expensive editorial setup waits until intro finishes | CPU 4× intro test remains above its 7 s threshold; do not call it complete on slow hardware |
| Hero | Existing staged name, typing and outer parallax | Inner RV monogram rotates X 8°→−6°, Y −14°→20°, Z −32→50 px as hero scrolls. Outer entrance and inner rotation have separate owners | New spatial interpretation of RV identity; not an observed Ibra 3D scene |
| Navigation | Existing reversible editorial overlay and keyboard controls | Preserved; inspected in both recordings | No new claim of exact reference timing |
| About | Story notes shared near-identical reveal timing | Alternating lateral headings, reading lines and later right column on desktop | Intentional adaptation, not measured Ibra source values |
| Projects | Existing sequential vertical project masks | Three distinct X/Y/Z poses settle flat. Dedicated stationary article triggers top 78%→12%, scrub .42 s. Original split-image, title, detail and actions stay coordinated | Perspective is deliberately restrained on mobile (5° base versus 10° desktop); no horizontal pin |
| Awards | Three records with nested generic reveals | Four records, including original Dicoding Fabric certificate. Copy reveals top 90%→56%; paper straightens independently at top 92%→46% mobile or 82%→46% desktop | Certificate authenticity not verified against issuer; represented as supplied |
| Technology logos | Existing scroll-linked logo bands | Kept, sans labels; actual logo sizes 39.19 px mobile / 66.23 px desktop in recordings | This revision does not redesign the technology band structure |
| Running text | One bottom strip and pause button | Standalone two-row transition before contact. 28 s leftward / 32 s rightward seamless cycles; scroll velocity smoothly changes speed up to 1.6× without flipping either direction | Intentional new user-directed scene; not claimed as reference choreography |
| Contact / footer | Existing heading/copy sequence | Masked heading with X rotation; description, labels and CTA overlap at distinct phases. Footer handoff preserved | Physical-device timing still unmeasured |

Reference history and existing Ibra footage comparison remain in `MOTION_FIDELITY.md` and `docs/motion-evidence/`. This revision’s new evidence compares the actual main a1044b9 baseline with this branch. It does not re-measure the unavailable original uploaded reference video or assert visual equivalence.

## Typography

Use native Apple system sans where available: `-apple-system, BlinkMacSystemFont, Helvetica Neue`, then self-hosted Manrope and Arial. DM Mono remains for technical metadata. No SF font is redistributed. Removed the visible Fraunces/Georgia/RV Editorial, Outfit and condensed display declarations, including the separate TechnologyBands stylesheet. Legacy `font-serif` maps to sans. Assets and licenses remain available, but unused faces are no longer loaded by CSS.

CSS declarations and actual rendered glyph fonts were checked at six viewports via Chromium CDP. Hero, project accent and GitHub description use Manrope on the Linux test host; none uses Times or Georgia. The internal variable-font family may be reported as “Manrope ExtraLight”; requested weights remain 400–700. SF rendering on Apple hardware has not been tested.

## Lifecycle and accessibility

One existing Lenis instance and GSAP ticker remain. No new library. New 3D planes use separate inner wrappers so existing mask/entrance/parallax timelines do not compete for their transforms. GSAP context and responsive matchMedia clean up on unmount and preference changes. Reduced motion removes spatial transforms and shows static readable marquee rows. The marquee has no pause button; keyboard focus and mouse hover pause it, hidden tabs/offscreen pause automatically. Duplicate cycles are hidden from assistive technology.

## Evidence

- [Mobile recording](docs/motion-evidence/spatial/mobile.mp4) · native touch, slow/fast/stop/reverse plus scene inspection
- [Desktop recording](docs/motion-evidence/spatial/desktop.mp4) · wheel input, slow/fast/stop/reverse plus scene inspection
- [Mobile project comparison](docs/motion-evidence/spatial/comparison-1.jpg)
- [Marquee placement comparison](docs/motion-evidence/spatial/comparison-2.jpg)
- [GitHub font comparison](docs/motion-evidence/spatial/comparison-3.jpg)
- [Mobile certificate](docs/motion-evidence/spatial/certificate-mobile.png)
- [Six viewport measurements](docs/motion-evidence/spatial/six-viewports.json)

Recordings include deliberate jumps between inspection scenes; they are not presented as one uninterrupted natural scroll. Screenshots inspect composition; motion direction and pacing require watching the videos. Visual review led to a refinement: the first 3D implementation settled before the image was visible, so project perspective was moved to its own longer scroll interval. Sans heading tracking was also relaxed after inspecting the desktop layout.

## Verification and limits

| Check | Result |
| --- | --- |
| TypeScript | Pass |
| Production build | Pass, 17.42 s; existing >500 kB chunk warning remains |
| Final production scene suites | 19 tests: 16 pass, 3 development-only checks skipped, 0 fail |
| Six viewport spatial/font suite | Pass at 360×800, 390×844, 430×932, 768×1024, 1280×900, 1440×900 |
| Runtime / overflow | No page errors; 0 px horizontal overflow in all six spatial cases |
| Project reversibility | All three masks return to sampled progress; 0 measured layout shift in corresponding recorder samples |
| Four certificates | Preview, full-size open and download exercised; original JPEG served correctly |
| Development lifecycle | All resize/address-bar/route-cleanup cases passed. Initial combined run failed the rating summary assertion; isolated rerun with explicit fixture Supabase configuration passed all 8 reduced-motion/feature tests. Logs retained |
| Final intro suite | 9 tests: 7 pass, 2 fail (one CPU 4× case and its parent). Intro visible 8,022 ms, exceeding the unchanged 7,000 ms assertion |
| Performance sampling | Earlier CPU 4× scroll sample: median 16.7 ms, p95 50 ms, 6/180 intervals >50 ms. Sample predates final deferred editorial setup; not a stable FPS measurement |

[Scene log](docs/motion-evidence/spatial/final-scenes.txt), [intro failure log](docs/motion-evidence/spatial/intro-refined.txt), [typecheck](docs/motion-evidence/spatial/typecheck.txt), [build](docs/motion-evidence/spatial/build.txt).

The intro issue improved from 10,930 ms to 8,022 ms after deferring below-fold setup, but remains unresolved. No test assertion was weakened. Production Supabase mutations were not performed: tests use isolated service fixtures. Physical iOS/Android devices, Safari, Apple-system-font metrics and sustained GPU/frame delivery remain unmeasured. No 100% fidelity or stable 60 FPS claim. The supplied certificate image is preserved unchanged, not redrawn; issuer validation is not asserted.

## Modified areas

`index.css`, `theme.css`, `TechnologyBands.css`: font stack, weight/spacing and perspective styling. `HeroSection`, `ProjectsSection`: separate spatial wrappers. `AwardSection`: fourth certificate and removal of competing nested reveal ownership. `useEditorialScenes`: responsive story, paper and contact choreography. `ClosingMarquee`, `Home`, `Footer`: two opposing tracks moved before contact. Tests and recorder updated for four certificates, real font inspection, reverse poses, no pause button and JPEG fixtures. Backend, monorepo, intro branding and portfolio content are preserved.
