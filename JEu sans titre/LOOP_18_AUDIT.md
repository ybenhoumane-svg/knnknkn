# LOOP 18 — audit ciblé après retour iPhone

## Changements
- Transition inter-défis conservée depuis LOOP 16/17 et session versionnée en v5 pour éviter de reprendre un ancien snapshot incompatible.
- Suppression totale de la chaîne de feedback familière interdite; aucun `Huuuunn`, `Huuunn` ou variante n'est présent dans `src/`.
- Famille AUDIO remplacée par une épreuve de reproduction de rythme: écoute, frappe sur une grande zone tactile, possibilité de recommencer, puis validation.
- Lecture sonore séparée de toute validation: le bouton 🔊 ne répond jamais comme une réponse au défi.
- Famille SOCIAL réécrite pour éviter les ambiguïtés de perspective, notamment le cas Nora/rideau.
- Banque éditoriale: 200 entrées conservées, 200 IDs uniques, 200 prompts uniques, 4 choix uniques et réponse présente pour chaque entrée. Plusieurs formulations manifestement ambiguës ou non adaptées au français ont été réécrites.
- Mise en page mobile compactée pour limiter le défilement sur iPhone; règles plus serrées pour petits écrans.
- Error boundary ajouté: une exception React ne doit plus laisser uniquement un écran gris sans indication.

## Contrôles exécutés
- Typecheck moteur TypeScript: PASS.
- Compilation des modules moteur/générateurs en CommonJS: PASS.
- Suite qualité avec 50 rounds: PASS.
  - 3500 défis générés/audités.
  - 0 échec d'audit.
  - 3500 IDs uniques dans le run.
  - banque: 200/200 structurellement valides.
  - sélection: 12 passages par famille sur le test de couverture.
  - playtest: 500 items par famille, 0 échec de contenu/audit.
  - famille AUDIO: 6 variantes de rythme détectées.
  - famille SOCIAL: 6 variantes détectées.
- Recherche texte: aucune occurrence interdite de `Huuuunn`/`Huuunn`/variantes dans `src/`.

## Point restant
La suite moteur ne peut pas simuler le vrai navigateur iPhone à 100 %. Le prochain test réel doit donc vérifier:
1. question 1 → question 2;
2. question 9 → question 10;
3. aucun écran gris;
4. AUDIO: écouter sans valider, taper, recommencer, valider;
5. SOCIAL: lecture claire sur petit écran.
