---
name: React motion standards
description: User's required performance and choreography rules for React + TypeScript UI animations.
---

For UI animations in this React + TypeScript project, animate only transforms and opacity; never animate layout-triggering properties. When using Framer Motion, wrap components in `LazyMotion` with `domAnimation` and use `m`. Prefer custom editorial cubic-bezier easing for reveals and spring physics (`stiffness: 300`, `damping: 24`, `mass: 0.8`) for interactive elements. Use masked vertical text reveals, parent-child stagger (`staggerChildren: 0.06`, `delayChildren: 0.1`), subtle hover/tap motion, and one-time scroll triggers with `viewport={{ once: true, margin: "-10%" }}`.

**Why:** the user explicitly required these motion and mobile-performance constraints for this project.

**How to apply:** follow these when building or refactoring UI animations; preserve existing animation-library and reduced-motion conventions where compatible.
