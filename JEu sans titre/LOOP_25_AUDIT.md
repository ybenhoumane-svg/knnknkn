# LOOP 25 — Audit

## Scope
- Correct React crash caused by rendering SPATIAL choice arrays as React children during feedback/result review.
- Keep the existing challenge catalogue; no new challenge mechanisms added.
- Target the naturalistic answer-overlap issue without globally shrinking the interface.

## Fixes
1. Added `choiceLabel()` to serialize non-text answer values before rendering/storing review labels.
2. Feedback answer rendering now uses `choiceLabel()` for every family.
3. Spatial stored review labels are human-readable serialized descriptions, never raw objects.
4. Naturalistic choices use a dedicated single-column mobile layout, normal wrapping, and optional semantic emoji icons.
5. Naturalistic sequence elements use compact visual emoji where available, while preserving the original text in `title`.
6. Package version bumped to 0.25.0.

## Verification
- Main TSX transpilation: required.
- TypeScript engine compilation: required.
- Generation/audit smoke test: required.
- Search for direct rendering of spatial choice objects: required.
- npm build: required when dependencies/network are available.
