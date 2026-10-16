---
name: Mobile menu transform ownership
description: Prevent CSS open-state rules from competing with the GSAP hamburger-to-close morph.
---

Keep the hamburger lines' static positions in CSS and let GSAP own their open/close transform. Do not leave `.is-open` CSS rules that also move or rotate those lines.

**Why:** Legacy open-state selectors overrode each line's CSS `top` and applied a second rotation while GSAP animated `y` and rotation, moving the strokes outside the glyph frame.

**How to apply:** When adjusting the portfolio menu icon, inspect every matching CSS selector as well as its GSAP timeline; verify stroke bounds at rest and midway through both opening and closing.
