---
name: Projects modal focus return
description: Focus restoration behavior for project detail dialogs inside the desktop pinned story.
---

When a project detail dialog closes from the desktop-pinned Projects story, restoring `body` overflow can trigger a brief ScrollTrigger remeasurement that moves the horizontal track and blurs an opener focused too early. Defer focus restoration until after that refresh settles, and cancel the pending restore if another project dialog opens. If section or browser-history navigation dismisses the dialog, skip restoring focus to its old opener.

**Why:** Immediate and one-frame restoration repeatedly focused the opener before pin remeasurement; the panel briefly moved away and the browser dropped focus. After section navigation, restoring focus to the opener would pull focus back to a project control outside the selected section.

**How to apply:** Preserve this delay/cancellation behavior when changing the Projects dialog, body scroll lock, or pinned-story lifecycle. Verify Escape, backdrop, and close-button dismissal while the story is pinned. When a hash link or browser-history change closes the dialog, restore body scrolling but leave focus in the destination flow.
