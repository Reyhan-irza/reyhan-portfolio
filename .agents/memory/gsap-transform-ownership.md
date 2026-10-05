---
name: GSAP transform ownership
description: Avoid stacked CSS transforms when a drawer's position is animated with GSAP percentages.
---

When GSAP controls an element's position with `xPercent` or `yPercent`, do not also leave a CSS `translateX()` or `translateY()` on that same element. The translations compose, so the element can remain offscreen even when the GSAP value reaches zero.

**Why:** A mobile navigation panel appeared open in state but remained outside the viewport because its CSS percentage translation stacked with GSAP's `xPercent`.

**How to apply:** Give one system ownership of positional transforms on an animated element. Remove conflicting inline or utility transforms and verify the element's bounding box at the target viewport.
