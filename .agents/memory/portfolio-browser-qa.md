---
name: Portfolio browser QA
description: Pitfalls when testing keyboard, pointer, marquee, and smooth-scroll behavior in the portfolio preview.
---

For CDP-based interaction checks, include `text` and `unmodifiedText` on native Enter events; send Space with key value `" "` and code `Space`. In pages using Lenis or smooth scrolling, avoid chaining scroll interactions behind fixed short sleeps. Wait for target geometry to settle or reset scrolling to instant between checks. For deep-section captures, dismiss the portfolio intro first, then scroll the mounted section into view; an initial URL fragment can resolve before React mounts its target.

For the intro modal, focus the dialog container on mount rather than Skip. Keep Skip reachable by Tab with a restrained but visible keyboard focus outline.

For hover checks, explicitly emulate a mouse-capable pointer in headless Chromium; default headless mode may report no hover/fine pointer despite accepting CDP mouse input. Moving marquees can also make saved hit-test coordinates stale.

**Why:** Missing CDP text fields made native `<details>` activation appear inert. Chained smooth-scroll actions kept the animation in flight and caused later focus and keyboard checks to produce false negatives. Focusing Skip on intro mount also made its focus ring dominate the composition without improving keyboard access. Headless pointer media and moving track geometry caused false-negative hover checks. The intro can also cover a section capture when a fragment is evaluated before the client-rendered section exists.

**How to apply:** Isolate native keyboard checks and assert that the target section is visible rather than requiring an exact scroll offset. For deep-section captures, wait until Skip is mounted, dismiss it, then scroll the target into view. For the intro, verify initial dialog focus, Tab focus on Skip with a restrained but visible outline, and Escape dismissal. Emulate a fine hover pointer for desktop styles; use reduced motion or fresh element geometry for marquee hit tests.