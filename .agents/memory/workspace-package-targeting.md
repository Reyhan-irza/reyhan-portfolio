---
name: Workspace package targeting
description: Dependency installation in the monorepo must target the intended artifact rather than the workspace root.
---

When adding a dependency used by one artifact, update that artifact's package manifest and install with an explicit workspace filter; an unscoped package install attempts to modify the root and is rejected by pnpm.

**Why:** The workspace has multiple packages and pnpm protects the root from accidental dependency additions.

**How to apply:** Keep artifact-only dependencies in `artifacts/<name>/package.json`, use the artifact filter for installation, then verify that artifact's typecheck and build.