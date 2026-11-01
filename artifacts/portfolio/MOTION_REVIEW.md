# Motion and theme review

Scope: this frontend update, reviewed against the requested anti-slop direction in `DESIGN.md`. Existing copy, projects, achievements and backend behavior are retained.

## Verification

- PASS: workspace typecheck and all workspace production builds.
- PASS: 22 browser tests, including intro skip/Escape, reduced motion, asset failure recovery, hidden-tab pause/resume, CPU throttling, short-screen menu, resize, desktop project pinning, certificates, rating recovery and render fallback.
- PASS: new theme tests cover system changes before an explicit preference, reload persistence, keyboard activation, cross-tab synchronization and blocked theme storage.
- PASS: both themes checked at 320, 390, 768 and 1280 px; no horizontal page overflow; theme control at least 44 x 44 px.
- PASS: project detail opens and Escape closes its body portal in both themes.
- PASS: desktop production preview visually inspected in light/dark, including hero, About, feedback, archive, music and comment form. Fixed a mobile scroll-cue translation issue and low-contrast neutral status text found during review.

## Anti-slop delivery review

- Hard gate PASS for changed controls and motion: native named toggle, visible focus, keyboard operation, reduced-motion handling, cleanup on media changes and preserved intro escape routes. Theme state never depends on successful storage writes. No new claims, testimonials, logos or invented content.
- Purpose gate PASS: palette, type, layout and motion reasons are recorded in `DESIGN.md`. Removed the ambient aurora, hero grid/orbit, decorative indicator and endless typing loop. Existing RV artwork and real project screenshots remain the focal visuals.
- Liveliness PASS: ENERGY 2 / RHYTHM 3 / MOTION 3. The intro hands off to a staggered name reveal; the name and monogram move at different depths; mobile screenshots settle with scroll; desktop preserves the horizontal project sequence. Forms and reading copy remain stable.
- Craftsmanship PASS for this change: a single semantic palette supplies both reading themes and project portals; no dependency or deployment configuration change; existing features preserved; no generated build output included.

## Limits

Automated browser tests mock external services and font requests to avoid production writes and network flakiness. Mobile test screenshots therefore exercise fallback fonts; desktop cloud preview also checked the actual web fonts. The local preview has no production Supabase credentials, so service-error states were inspected there and rating success was tested with mocks. This is not a full accessibility certification or a claim of measured real-device frame rates or Core Web Vitals. Vite still reports the existing nonblocking large-chunk warning. Review the Vercel preview before merging.
