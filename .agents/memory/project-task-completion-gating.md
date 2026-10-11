---
name: Project-task completion gating
description: A project task's displayed state alone may not authorize the main agent to mark it complete.
---

Check whether the task is actually assigned as the current main task before relying on `markTaskComplete`. A task can appear `IN_PROGRESS` in project-task queries and still be rejected as not active for the main agent.

**Why:** The task API reported `IN_PROGRESS`, but `markTaskComplete` rejected it because it was not an active main task.

**How to apply:** Do not retry or alter task state to bypass the assignment gate. Report the completed work and the task-tracking limitation clearly.
