---
name: GSAP media conditions
description: A matching-condition pitfall in GSAP matchMedia callback registration.
---

When `gsap.matchMedia().add()` receives an object of conditions, its callback only runs when at least one condition matches. Represent all intended modes, such as both reduced-motion and no-preference, or include a wide-screen condition when desktop behavior genuinely differs. Do not add unused viewport conditions to a persistent drawer animation: crossing them can rebuild its timeline and desynchronize it from the open state. If a relevant media preference changes while open, restore the new timeline to the current open state.

**Why:** The portfolio's desktop reveals were absent when no listed GSAP condition matched. Later, removing unused width conditions prevented resize resets, while omitting the complementary motion condition stopped animation setup for standard motion settings.

**How to apply:** Enumerate the actual behavior variants, ensure at least one condition matches each supported preference, and verify that resizing or changing motion preferences cannot leave visible UI inconsistent with its application state.

GSAP context cleanup reverts GSAP-owned changes, not direct DOM styles set by callbacks such as `ResizeObserver`. Keep a reference to elements that receive responsive inline properties and explicitly remove those properties in the matching media cleanup.

**Why:** A project slide-width custom property remained on the track after switching to mobile or reduced motion, even though its desktop pin and triggers were correctly removed.

**How to apply:** When responsive setup writes `element.style` directly, verify both the style value and trigger/pin count after leaving and re-entering that media condition.