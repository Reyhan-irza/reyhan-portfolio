# Portfolio 2.0

The frontend lives in `artifacts/portfolio/` in the existing pnpm workspace.
The API server, shared libraries, mockup sandbox, deployment settings, and
Replit artifact metadata are retained.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/portfolio exec playwright-core install chromium
CHROMIUM_PATH=/path/to/chromium pnpm --filter @workspace/portfolio run test:browser
```

Use the Chromium executable reported by Playwright, or an installed system
Chromium. Tests use local assets, fixture GitHub/Supabase responses, and system
fonts; they do not send production visitor telemetry. Live service availability,
Google Fonts rendering, and real Supabase permissions require a deployment check.

## Deployment

Keep the existing Vercel/Replit settings and `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` environment variables. Never put a Supabase service-role
key or database password in the frontend or commit environment files.

The new rating feature requires applying `supabase/portfolio-schema.sql` to the
same Supabase project used by the deployment. The schema preserves existing rows
and existing legacy-table policies/grants, except for the documented anonymous
comment-insert permission. Newly created tables receive RLS and minimal public
access. `enable-public-comment-insert.sql` is the standalone comment permission
migration; it is already included in the full schema migration.

Ratings use a browser-generated UUID to deduplicate votes, not authenticated
identity or abuse prevention. The public view exposes aggregates only. The
existing admin login remains unchanged and requires the existing `admins` table;
this migration does not bootstrap or secure the legacy admin authentication.
Existing permissive database policies must be reviewed separately because RLS
policies combine with OR and this migration intentionally preserves them.

SQL files are supplied for review and are not applied automatically to production.
Until the rating migration and environment variables are configured, the page
shows an explicit database-unavailable state. No database credentials were
provided for a live integration check.
