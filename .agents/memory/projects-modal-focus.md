---
name: Projects modal focus return
description: Focus restoration behavior for project detail dialogs inside the desktop pinned story.
---

When a project detail dialog closes from the desktop-pinned Projects story, restoring `body` overflow can trigger a brief ScrollTrigger remeasurement that moves the horizontal track and blurs an opener focused too early. Defer focus restoration until after that refresh settles, and cancel the pending restore if another project dialog opens.

**Why:** Immediate and one-frame restoration repeatedly focused the opener before pin remeasurement; the panel briefly moved away and the browser dropped focus.

**How to apply:** Preserve this delay/cancellation behavior when changing the Projects dialog, body scroll lock, or pinned-story lifecycle. Verify Escape, backdrop, and close-button dismissal while the story is pinned.
