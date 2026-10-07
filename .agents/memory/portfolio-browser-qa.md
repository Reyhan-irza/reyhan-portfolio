---
name: Portfolio browser QA
description: Pitfalls when testing native keyboard behavior and smooth scrolling in the portfolio preview.
---

For CDP-based interaction checks, include `text` and `unmodifiedText` on native Enter events; send Space with key value `" "` and code `Space`. In pages using Lenis or smooth scrolling, avoid chaining scroll interactions behind fixed short sleeps. Wait for target geometry to settle or reset scrolling to instant between checks.

For the intro modal, focus the dialog container on mount rather than Skip. Keep Skip reachable by Tab with a restrained but visible keyboard focus outline.

**Why:** Missing CDP text fields made native `<details>` activation appear inert. Chained smooth-scroll actions kept the animation in flight and caused later focus and keyboard checks to produce false negatives. Focusing Skip on intro mount also made its focus ring dominate the composition without improving keyboard access.

**How to apply:** Isolate native keyboard checks and assert that the target section is visible rather than requiring an exact scroll offset. For the intro, verify initial dialog focus, Tab focus on Skip with a restrained but visible outline, and Escape dismissal.