---
name: React motion standards
description: User's required entrance motion rules for the React + TypeScript portfolio.
---

For portfolio entrance effects, use native Framer Motion with `m` under `LazyMotion`/`domAnimation`. Hero groups enter on mount for 0.8s with no delay. Other groups reveal once at 15% visibility with a 0.1s base delay, 1s duration, opacity 0→1, and `cubic-bezier(0.22, 1, 0.36, 1)`. Copy and mixed-content groups travel 12px on desktop and 8px on phones; standalone media scales 0.98→1 without translation. Keep heading/copy/actions together, media and card collections separate, and only stagger 2–4 progression siblings by 0.1s on larger screens. Remove nonessential movement and sequencing for reduced motion. Do not layer GSAP entrance tweens on content already using a Framer reveal.

**Why:** the user supplied and approved portfolio-wide motion guidance that replaces conflicting legacy entrance choreography.

**How to apply:** use this for new portfolio entrance work; keep continuous tracks, pinned project interactions, controls, backgrounds, dividers, and hover/press feedback separate from entrances.
