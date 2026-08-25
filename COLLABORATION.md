# Working Together on DSST

*A short working agreement between the two of us (and our AI coding agents)*

Robert —

We are both developing DSST now, each with our own AI assistant, in the same codebase. Most of our coordination has lived in email and chat so far. That's fine, and none of this replaces those channels for scheduling and discussion. But anything that needs to survive six months shouldn't live in a thread someone has to remember to scroll to find. This page pins down the durable part: a handful of working agreements, and where they physically live.

It is deliberately short. If a rule stops earning its keep, delete it. If we trip over something new, add one line. The aim is boring.

## The rules

**1. Ship small, self-contained, and tested.**
New capability lands in its own files, with its tests beside it. Your MLR lookup table (`mlrSelection.ts`) is the model of this: isolated, predictable, covered by its own test file. Resist growing the shared plumbing — if your next change means reaching into `llm-client.ts`, pause and look for a smaller way to hang it off instead.

**2. Change behavior with configuration, not prose.**
Anything that changes what the app does — which model runs, which routine pairing is chosen, what gets displayed — belongs in a table, a constant, or an environment variable, with a comment explaining why. Production prompts are treated as frozen artifacts, edited only on purpose. Both sides are now following this (single model constant, env-var configuration); keep new work inside it.

**3. The description carries the reasoning.**
Every branch or pull request gets a plain-language description answering three things: what changed, why, and — most importantly — **did this change what a teacher or a student sees?** Our assistant drafts these automatically, and yours presumably does too. In six months nobody will remember the conversation that produced the change, but the git history will still answer it. Write for the stranger.

**4. Same file = coordinate before finishing.**
If both sides touch the same source file in the same stretch, the later work yields: pull the other side's version in deliberately, reapply our changes on top, and leave a note in the branch description saying the reconciliation happened. Right now, the files both sides have touched since the branches split: `src/lib/llm-client.ts` and `src/app/api/analyze/route.ts`. Whoever finishes second handles the join, on purpose.

**5. Announce big moves; pull on your own schedule.**
When one side moves or deletes shared files — like this week's prompt reorganization — announce it in the repo (a commit or PR description, not just in chat, so the announcement lasts too): one line on what moved where and what may break until pulled. Nobody is expected to pull mid-flight. Notice, then pull whenever your work flow allows it.

## Where this lives

Proposal: this document sits at the root of the repository as `COLLABORATION.md`, with one pointer line added to each side's assistant instruction file, so both agents read it at the start of every session. One page maximum. Updates happen by adding or removing a single line at a time. The repository becomes the shared memory; this file is its front door.

## First real use (Monday)

Your `variance-response-schema` branch started before this week's reorganization, so the tree has moved underneath it: prompt files relocated to `prompt-dev/` and the old `src/lib/prompts.ts` entry point was removed. Two clean paths, and it's your call:

1. You rebase your branch onto the new main, or
2. We reapply your three pieces of work (constrained output checking, the MLR table, the lesson-identity cache) onto the current layout.

Either is roughly an hour of skilled work. Pick whichever best protects your changes. Until it is merged, the branch is yours, and nothing reaches production until you say so.

— Neil