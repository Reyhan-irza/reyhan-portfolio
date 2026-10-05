---
name: Portfolio Supabase preview DNS
description: Check hostname resolution before debugging database-backed portfolio behavior in preview.
---

The workspace browser preview and container-side DNS lookup both returned `ENOTFOUND` for the configured Supabase host during portfolio QA on 2026-10-06. The Supabase environment variable names were present, so this was not the missing-variable fallback.

**Why:** Rewriting visitor tracking, News, or Comments to suppress transport errors could hide an environment/project connection problem and change production data behavior.

**How to apply:** Before debugging these components or their schema, verify the configured host resolves and the browser can reach the project. If DNS still fails, repair the workspace environment through the secrets flow or confirm the Supabase project is available; keep existing app data contracts unchanged while diagnosing.
