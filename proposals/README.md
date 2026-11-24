# Proposals — corpus edits awaiting human review

Post-build reflection (`tooling/reflect.mjs` or the `/reflect` slash command) writes proposed
corpus edits here. **Nothing in this folder is part of the corpus.** It's a staging area for ideas
the system noticed while building real UI — a reusable pattern the corpus lacks, a principle worth
refining, a new anti-pattern.

## Flow

1. After a real build, run `/reflect` (in session) or `node tooling/reflect.mjs --target <path>`.
2. A dated proposal lands here (`YYYY-MM-DD-<build>.md`).
3. **You review it.** Fold the good items into `corpus/`, `references/`, or `tokens/` by hand
   (or via a PR). Delete the proposal once actioned.

This mirrors the Phase 3 principle: the system *proposes*, a human *approves*. Reflection never
edits the corpus directly — unsupervised, the corpus drifts toward trend-chasing and degrades.
