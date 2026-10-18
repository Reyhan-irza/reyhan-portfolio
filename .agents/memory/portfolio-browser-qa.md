---
name: Portfolio browser QA
description: Pitfalls when testing keyboard, pointer, marquee, and smooth-scroll behavior in the portfolio preview.
---

For CDP-based interaction checks, include `text` and `unmodifiedText` on native Enter events; send Space with key value `" "` and code `Space`. In pages using Lenis or smooth scrolling, avoid chaining scroll interactions behind fixed short sleeps. Wait for target geometry to settle or reset scrolling to instant between checks. For deep-section captures, dismiss the portfolio intro first, then scroll the mounted section into view; an initial URL fragment can resolve before React mounts its target. Let the app hydrate at default viewport dimensions before applying CDP device metrics; applying mobile metrics before navigation produced an empty DOM in this preview.

For the intro modal, focus the dialog container on mount rather than Skip. Keep Skip reachable by Tab with a restrained but visible keyboard focus outline.

For hover checks, explicitly emulate a mouse-capable pointer in headless Chromium; default headless mode may report no hover/fine pointer despite accepting CDP mouse input. Moving marquees can also make saved hit-test coordinates stale.

When a responsive ResizeObserver changes pinned GSAP geometry, defer ScrollTrigger.refresh() to requestAnimationFrame and cancel queued work when the media scope reverts. Refreshing synchronously inside the observer can emit a ResizeObserver loop error during viewport changes.

At a mapped breakpoint inside ScrollTrigger.refresh(), inspect the paused frame's `this` for trigger state; evaluating `self` in the minified bundle can resolve to the browser global instead. A breakpoint in `refresh()` observes remeasurement, not normal scroll updates.

**Why:** Missing CDP text fields made native `<details>` activation appear inert. Chained smooth-scroll actions kept the animation in flight and caused later focus and keyboard checks to produce false negatives. Focusing Skip on intro mount also made its focus ring dominate the composition without improving keyboard access. Headless pointer media and moving track geometry caused false-negative hover checks. The intro can also cover a section capture when a fragment is evaluated before the client-rendered section exists. Early CDP viewport emulation prevented the app DOM from mounting in one portfolio browser session.

**Why:** A synchronous ScrollTrigger refresh during ResizeObserver delivery can create browser resize-loop warnings while responsive track sizes are changing.

**Why:** In the production bundle, `self` evaluated as the global object and omitted trigger details; the `this` binding exposed the instance. Normal scroll updates do not call this refresh breakpoint.

**How to apply:** Isolate native keyboard checks and assert that the target section is visible rather than requiring an exact scroll offset. For deep-section captures, wait until Skip is mounted, dismiss it, then scroll the target into view. For the intro, verify initial dialog focus, Tab focus on Skip with a restrained but visible outline, and Escape dismissal. Emulate a fine hover pointer for desktop styles; use reduced motion or fresh element geometry for marquee hit tests. For viewport checks, navigate and wait for React hydration first, then apply device metrics and re-check layout. Schedule pinned-layout refreshes from ResizeObserver on the next animation frame and cancel them on media-scope cleanup.

**How to apply:** When tracing a refresh breakpoint, read trigger properties from `this`, map stack locations through the temporary sourcemap, and instrument scroll updates separately if those are in scope.