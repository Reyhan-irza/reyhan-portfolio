---
name: RV intro and navigation behavior
description: User-approved behavior contract for the portfolio introduction and responsive navigation.
---

For Vierlykirk's portfolio, retain the supplied RV mark and its animation. Make the intro cinematic without delaying access excessively, provide a clear working Skip control, and honor `prefers-reduced-motion`. Navbar must work with pointer/tap and keyboard, respond to Escape, and keep focus correctly managed while open and after closing.

**Why:** The user designated these decisions as the authoritative brief for intro and brand regressions.

**How to apply:** When changing the portfolio's intro, RV brand, or responsive navigation, verify natural intro completion, Skip, reduced motion, pointer/tap input, keyboard focus cycling, and Escape focus restoration.
