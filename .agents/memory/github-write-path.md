---
name: GitHub write path
description: Handling remote repository writes when the workspace's HTTPS git remote cannot authenticate pushes.
---

**Rule:** Use the added GitHub App connection for remote writes rather than requesting a personal access token or retrying an unauthenticated Git push.

**Why:** On 2026-10-08, fetch from origin worked but push failed with invalid username/token; the configured GitHub App could create scoped commits through the GitHub REST API.

**How to apply:** Build the commit on top of the fetched target branch, make the tree path-limited, update its ref with `force:false` only while the parent remains current, then verify changed paths via compare and fetch the updated ref.
