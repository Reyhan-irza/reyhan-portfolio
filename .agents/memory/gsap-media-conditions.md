---
name: GSAP media conditions
description: A matching-condition pitfall in GSAP matchMedia callback registration.
---

When `gsap.matchMedia().add()` receives an object of conditions, its callback only runs when at least one condition matches. If the listed conditions are only `reduced motion` and `compact viewport`, an ordinary desktop with reduced motion off and compact off matches none, so its animations are never registered. Include an explicit wide-screen condition when desktop behavior is intended.

**Why:** The portfolio's desktop reveals were absent even though its compact and reduced-motion branches worked; adding the desktop condition restored animation setup.

**How to apply:** For multi-condition GSAP media setups, enumerate the full intended viewport/motion states and check the default desktop combination, not only the special cases.