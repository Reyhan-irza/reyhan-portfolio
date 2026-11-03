# GSAP + Lenis motion implementation

The existing portfolio layout, content, assets, services, and RV identity are preserved. Motion is coordinated through GSAP/ScrollTrigger and one Lenis instance. No dependency or backend changes are required.

| PRD phase | Implementation |
| --- | --- |
| 0 — Audit | Existing section components and interactions retained; animation ownership consolidated. |
| 1 — Scroll foundation | `lib/scroll.ts`, `lib/motion.ts`, `useLenis`: shared tokens, lerp 0.1, GSAP ticker integration, resize/font/image refresh, cleanup, modal/menu locking and anchor focus. Lenis starts after the intro to preserve intro pacing. |
| 2 — Navigation | Vertical menu timeline, staggered links, hamburger transition, reverse close, focus trap/Escape, deferred anchor navigation. Live reduced-motion changes reset transforms explicitly. |
| 3 — Hero | RV entrance, staggered typography/controls, background-only scroll parallax, GSAP typing loop. Intro skip, image-error recovery and visibility pause retained. |
| 4 — Reveals | Shared once-only reveals, 40px entry, power3.out easing, 0.07s stagger. Completed content remains visible after reverse scrolling, resize and preference changes. |
| 5 — Section themes | Section-boundary body color transitions, scoped text/surface contrast and static rounded corners; reduced motion applies colors immediately. |
| 6 — Marquee | Two matching copies, 25s linear CSS loop, opposite direction, hover/focus pause and reduced-motion stop. No per-frame JavaScript marquee work. |
| 7 — Project cards | 60px once-only entrances, screenshot zoom settles at 1, desktop hover and arrow motion. Existing horizontal story remains pinned with direct scrub; snap removed. Modal locks scrolling and restores focus. |
| 8 — Testimonials | Not applicable: the existing portfolio has no testimonial section or supplied authentic quotes. No content was invented. |
| 9 — Validation | Production build and TypeScript pass. Browser results and measurement limits below. |

## Validation recorded 2026-11-03

- TypeScript `tsc -p tsconfig.json --noEmit`: passed.
- Vite production build: passed. Main JavaScript: 818.11 kB / 261.93 kB gzip. Existing >500 kB chunk warning remains.
- Production-build browser suite: **32 passed, 0 failed, 2 skipped** (34 tests, 83.0 seconds).
- Widths: 360, 390, 430, 768 and 1280px; no horizontal overflow in marquee acceptance. Reading content, responsive project motion and desktop pinning verified.
- Intro, short-screen menu reachability, keyboard/modal focus, live reduced motion, theme persistence, route cleanup, certificates and mocked rating persistence covered.
- Motion acceptance collected no browser console errors or warnings.
- CPU 4x: intro completed in 3145ms. A 180-frame scrolling sample recorded median 16.7ms, p95 16.8ms and 3 intervals above 50ms; scrolling progressed beyond 1000px with no hidden reading content. This is a headless Chromium sample, not a guarantee of 60fps on physical phones.
- Two source-only tests are skipped in production-build mode: injected render failure and direct ScrollTrigger refresh counting during address-bar resize. Their existing source-mode coverage remains available.
- Lighthouse score comparison, CLS baseline comparison and physical mid-range phone profiling have **not** been measured in this run. These remain validation limits, not claimed passes.

## Reproduce production-build browser checks

Build the frontend with its normal public environment configuration, then run from `artifacts/portfolio`:

```sh
PORTFOLIO_BUILD_DIRECTORY="$PWD/dist/public" \
CHROMIUM_PATH=/absolute/path/to/chromium \
node --test --test-concurrency=1 tests/*.browser.test.mjs
```

The build-mode fixture serves the local build through Playwright request routing at `http://localhost:4173`; it does not start another HTTP server. External services are mocked for deterministic checks. Omitting `PORTFOLIO_BUILD_DIRECTORY` preserves the existing source-mode test setup.
