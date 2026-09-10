# LOOP 20 — audit / correction / qualité

## Incident iPhone
Le test réel sur iPhone a montré que l'écran gris a été remplacé par l'ErrorBoundary, mais qu'une réponse incorrecte peut encore provoquer l'écran « Un défi a rencontré un problème ». Le chemin de rétroaction négative est donc traité comme suspect prioritaire.

## Corrections
- Audio de feedback rendu non bloquant : aucune erreur Web Audio ne peut interrompre une réponse.
- AudioContext réutilisé, reprise protégée et création de tonalités protégée par try/catch.
- `answer()` protégé : une erreur pendant le traitement d'une réponse ne doit plus faire tomber l'interface ; la session reste dans un feedback contrôlé.
- Sélection de la banque éditoriale désormais alignée sur la difficulté demandée (écart maximal de 1 niveau quand possible).
- Banque RULE enrichie de 20 énigmes originales supplémentaires, en français.
- Audio enrichi de 18 motifs rythmiques déterministes au lieu de 6.
- Générateur VERBAL enrichi à 18 relations au lieu de 6.
- Générateur NATURALISTIC enrichi avec des relations explicites (cycle, classification, écosystème, camouflage, croissance, etc.).
- Audit NATURALISTIC adapté à la nouvelle représentation sémantique.
- Le texte interdit « Huuuunn » reste absent.

## Tests exécutés
- Compilation TypeScript du moteur/générateurs : PASS.
- Suite qualité avec 50 items par famille et par niveau : PASS.
- 3 500 items générés/audités : PASS.
- 3 500 IDs uniques : PASS.
- 0 échec d'audit.
- 0 échec de contenu.
- Les 10 familles sont sélectionnées 12 fois chacune dans le test de sélection.
- Banque éditoriale : 220 items, IDs uniques, prompts uniques.
- Transpilation syntaxique de `main.tsx` : PASS.

## Problèmes encore identifiés par l'audit
La conformité technique ne signifie pas encore que le contenu est assez riche.
- SPATIAL : seulement 4 modes structuraux.
- MEMORY : seulement 8 modes.
- CONTROL : 4 modes et prompt quasi identique.
- NATURALISTIC : encore peu de diversité de présentation.
- AUDIO : beaucoup plus de motifs, mais le prompt reste unique.
- SOCIAL : 6 scènes.
Ces familles doivent faire l'objet d'un prochain enrichissement ciblé plutôt que d'augmenter artificiellement le nombre de questions.

## Validation iPhone restante
Impossible de simuler fidèlement Safari iOS depuis cet environnement. Le test réel doit vérifier : mauvaise réponse, son négatif, passage au défi suivant, puis répétition sur plusieurs familles. Si l'ErrorBoundary réapparaît, le code affiché sera la preuve nécessaire pour isoler le prochain défaut.
