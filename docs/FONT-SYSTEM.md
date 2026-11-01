# Font System

Two voices, two jobs.

## The Rule

| Voice | Class | Use for | Examples |
|-------|-------|---------|----------|
| **Serif** (DM Serif) | `font-serif` | Reading text — anything a teacher reads as prose or narrative | Arc statement, learning targets, function summaries, synthesis prompts, friction descriptions, destination text, move explanations |
| **Sans** (DM Sans) | default (body) | Scanning text — anything a teacher glances at to orient | Activity titles, labels, durations, tiles, UI chrome, section headers, metadata |

## Decision Test

Ask: **"Will this text be read or scanned?"**

- **Read** → serif. Sentences, paragraphs, explanations, anything over ~10 words that forms a thought.
- **Scan** → sans. Labels, single words, numbers, short phrases under ~10 words, anything that functions as a heading or tag.

## Implementation

- The serif font is mapped via `--font-serif: var(--font-dm-serif)` in `globals.css`.
- Tailwind v4 auto-generates the `font-serif` utility from that variable.
- Never hardcode `fontFamily` in inline styles. Always use the `font-serif` class.
- The body defaults to DM Sans (set on `<body>` in `globals.css`). No class needed for sans.

## What This Replaces

Previously, 22 components used `style={{ fontFamily: 'var(--font-dm-serif), serif' }}` as an ad-hoc inline declaration. There was no enforcement, so it applied unevenly — some reading text got serif, some didn't, and there was no rule to reference when adding new components.

This document is that rule.