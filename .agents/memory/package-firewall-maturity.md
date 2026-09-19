---
name: Package firewall maturity
description: Dependency installation can reject newly published packages even when they are valid semver matches.
---

When the workspace package firewall rejects a dependency because it is newer than the configured minimum release age, pin the newest established version that satisfies the package's API needs instead of disabling the age check.

**Why:** The project intentionally uses a minimum release-age safeguard, and cloning a repository should not weaken that protection just to make installation pass.

**How to apply:** Check the package publish dates, choose a mature exact version, update the direct dependency and lockfile, then run the relevant package typecheck/build.