---
name: Portfolio motion references
description: How to adapt scroll-animation references without changing the portfolio's identity or accessibility.
---

Use external animation references for pacing, panel transitions, and layered movement only. Adapt those patterns to Reyhan Irza Alvano's portfolio; do not copy a reference site's name, copy, assets, or identity. Preserve the portfolio's existing content, links, achievements, detail modal, community/admin integrations, and routes. Keep mobile layouts usable and honor reduced-motion preferences.

**Why:** The user requested this boundary while refining the portfolio's scroll animation and emphasized preserving existing content and behavior.

**How to apply:** When using a reference for this portfolio, borrow motion patterns but retain the site's own branding and functionality. Check responsive and reduced-motion behavior after scroll-animation changes.

For a horizontal project track, derive the displayed active index from the nearest slide position (`round(progress × travel / slide width)`) rather than completed-slide count (`floor`). The latter can leave the final panel unselected until the track reaches its exact end.

**Why:** The portfolio's three-panel track showed the middle panel too late and the final panel only at the terminal scroll position when the index used `floor`.

**How to apply:** Test the index and progress indicator at several points through the full scrub range, then reverse-scroll to confirm they return to earlier panels.
