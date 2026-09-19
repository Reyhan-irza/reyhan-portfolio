---
name: Workspace production builds
description: Why every Vite artifact in the workspace needs build-safe runtime defaults.
---

Recursive workspace builds run every package build without the environment variables supplied by an individual Replit workflow. Vite configs must therefore use valid defaults for runtime-only values such as PORT and BASE_PATH, while still honoring those variables when the app is actually served.

**Why:** A root build can fail in an unrelated package before the deploy target is built if one artifact treats runtime configuration as mandatory during static compilation.

**How to apply:** When adding or changing a Vite artifact, keep compile-time configuration independent from workflow-only environment variables and validate with the root `pnpm run build`.