# RV: motion and reading themes

Direction from Rey: cinematic, smooth, responsive, alive; the precision and confidence of Apple/Tesla product presentations, with RV's own identity. No blinking decorative dots or generic template treatment.

Design read: a personal portfolio for people evaluating Reyhan's work, using a mineral editorial language. ENERGY 2 / RHYTHM 3 / MOTION 3.

- Palette: graphite and warm mineral white keep real project screenshots dominant. The blue comes from the existing silver/blue RV mark. Light mode uses a deeper blue for readable contrast.
- Typography: Outfit's geometric forms echo the RV monogram in the name and project titles; Manrope remains the quieter reading face. Mono is reserved for indexes and technical labels.
- Composition: the name establishes identity; actual screenshots establish ability; biography, chronology and awards supply context. Existing feature order and content are preserved.
- Motion: intro assembly hands off to a staggered, masked name reveal. Scroll moves the name out with depth, then project images settle into their frames. Desktop retains the horizontal project story; touch retains native vertical scroll.
- Ownership: GSAP handles timelines and scroll-linked inner targets. Motion handles Reveal wrappers and button/toggle feedback. They never animate the same element's transform.
- Restraint: remove ambient aurora, blueprint grid, orbit decoration while retaining the requested typing loop. Reading content stays still after its entrance. Existing technology motion has a pause control; reduced motion bypasses the intro and scroll choreography.
- Theme: follow system on first visit, persist an explicit toggle, sync tabs, and remain usable if storage is unavailable. Apply tokens to body portals as well as page content. Keep the brief identity intro on a dark stage.
- Surfaces: flat panels group real content; border rules separate rows. Shadows only establish modal elevation. Sun/moon icons communicate the theme, arrows indicate actual navigation.
- Scope: frontend only. No deployment settings, backend, workspace, credentials or Supabase changes.


## Mobile and palette correction
The previous hero h1 selector also styled the intro name, overriding its responsive size. Hero size rules now target only the hero section; intro name and location wrap within the viewport. The original typing loop is restored with its reduced-motion summary and hidden-tab pause. Light mode uses silver-blue layered surfaces aligned with the RV artwork. Music bars and volume controls share the theme and shrink inside their card. Mobile logo pieces now assemble from distinct directions; hero depth and project screenshot/copy scroll travel are stronger without pinning the phone viewport. Regression tests cover intro bounds at 320/390, changing typing text, and volume bounds. All 23 browser tests and workspace builds/typecheck passed. Live service writes and real-device frame rate remain unverified.
