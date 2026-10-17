---
name: Project index and focus
description: Rules for keeping the pinned Projects rail accurate while preserving keyboard focus visibility.
---

For the desktop pinned Projects sequence, derive the rail and active-panel state from ScrollTrigger progress. A project row that owns keyboard focus may guide the snap destination so its controls remain visible, but focus events must not directly set the active index.

**Why:** Direct focus updates can make the rail contradict the track position, while normal scroll progress can carry a focused control offscreen.

**How to apply:** When changing pinned Projects focus or snap behavior, keep focus validity and visibility, index state, reverse scrolling, and reduced-motion vertical layout aligned.
