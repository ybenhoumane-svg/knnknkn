# LOOP 26 — Audit

## Scope
- Integrated the user-provided cognitive bank into the existing game.
- Intrapersonal items are routed through `META` and contribute to the `intrapersonal` domain.
- Interpersonal items are routed through `SOCIAL` and contribute to the `interpersonal` domain.
- Logical-mathematical items are routed through `MATH` and contribute to the `logical` domain.
- No new question content was invented.
- The pasted bank contains 85 numbered items (25 intrapersonal + 30 interpersonal + 30 logical-mathematical); four explicitly excluded by the user are 64, 68, 78 and 85, leaving 81 integrated items.

## Content checks
- Intrapersonal: 25
- Interpersonal: 30
- Logical-mathematical after exclusions: 26
- Total integrated: 81
- IDs unique inside each bank: PASS
- Every item has exactly 4 choices: PASS
- Every answer exists in its choices: PASS
- Excluded items are not integrated: PASS

## Runtime / engine checks
- Engine TypeScript check: PASS
- Main TSX transpilation/syntax check: PASS
- 5,000 generated audited items: PASS
- 5,000 unique generated IDs: PASS
- Generation audit failures: 0
- Bank-specific generation test: PASS
- Bank-specific audit failures: 0
- Spatial review metadata remains string-safe: PASS by serialization path
- Naturalistic mobile choice layout: targeted single-column / wrapping fix retained

## Important implementation detail
The three editorial banks use existing families rather than creating a new family, preserving the existing 9-domain profile architecture:
- `META` -> intrapersonal
- `SOCIAL` -> interpersonal
- `MATH` -> logical-mathematical

Bank items bypass the numeric META comparison/confidence interaction and the old SOCIAL scene wrapper so the supplied questions are presented as normal four-choice challenges. Their editorial explanations are stored with the trial and displayed in the answer review.

## Exclusions
The following supplied items were deliberately excluded because the supplied correction identified them as invalid/ambiguous:
- 64 — contradictory truth/lie constraints
- 68 — insufficiently specified four-switch problem
- 78 — no answer satisfies all stated constraints
- 85 — ambiguous displacement wording

## Environment limitation
The source tree has been typechecked at engine level and the main TSX has passed a TypeScript transpilation/syntax check. A full Vite production build was not executable in this isolated audit environment because the temporary environment could not complete dependency installation; the user's local environment already has the project dependencies installed.
