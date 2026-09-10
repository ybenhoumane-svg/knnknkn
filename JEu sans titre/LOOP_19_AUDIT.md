
LOOP 19 changes

- CONTROL: fixed false-alarm accounting on no-go trials and wrong-target accounting on go trials; these errors now affect accuracy/reliability.
- Cleanup: removed stray `src/generators/extended.ts.tmp`.
- Mobile: kept the existing compact layout; no global UI shrink was introduced for the rare long symbol-line prompts.
- Engine verification: `npm run engine:check` PASS; quality suite 3,500 generated/audited items PASS; 500-item playtest per family PASS with 0 audit/content failures.
- Remaining human validation: real iPhone viewport/touch/audio perception and deployed PWA behavior.
