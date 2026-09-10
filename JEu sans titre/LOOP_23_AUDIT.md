# LOOP 22–23 — audit final

## Objectif
Fusion des deux boucles demandées : améliorer les mécaniques, l’adaptation et surtout rendre la fin de partie plus satisfaisante sans transformer le produit en test de QI.

## Gameplay
- Ajout d’un scoring de session sur 100 combinant réussite pondérée, difficulté, fiabilité et vitesse secondaire.
- Ajout d’une série maximale, du niveau maximal atteint et d’un badge de session.
- Nouveau rendu de fin avec anneau de score, statistiques et point fort du profil.
- Bouton de rejouer directement depuis le résultat.

## Adaptation
- La montée de difficulté tient maintenant compte de la vitesse, de la fiabilité et d’une courte série de réponses correctes.
- Les bons résultats rapides et fiables peuvent accélérer la montée ; une erreur suffisamment fiable peut faire redescendre la difficulté.
- La logique de couverture des familles existante est conservée pour éviter les répétitions excessives.

## Contenu
- La banque de déduction avancée a été entièrement remplacée par 20 items réécrits et vérifiés manuellement pour éviter les réponses multiples ou incohérentes repérées dans l’ancienne banque.
- Correction éditoriale supplémentaire : `PLIer` → `PLIER`.
- Les mécanismes sont inspirés de formats de logique, de raisonnement conditionnel, de séquences et de problèmes de stratégie observés dans des jeux/quiz cognitifs publics ; aucune question protégée n’a été recopiée textuellement.

## Vérifications
- `npm run engine:check` : PASS
- Transpilation TypeScript des fichiers principaux : PASS
- 5 000 générations/audits : PASS
- 5 000 IDs uniques : PASS
- 0 échec d’audit/génération : PASS
- Vérification de 1 400 tirages de banque RULE : 0 index de réponse invalide
- Aucun `Huuuunn`, `Huuunn`, `huuu` ou `huun` trouvé dans `src/`

## Variété observée sur 500 items/famille
- RULE : 106 variantes
- SPATIAL : 51
- MEMORY : 8
- CONTROL : 4
- AUDIO : 18
- SOCIAL : 6
- NATURALISTIC : 496
- META : 5
- MATH : 66
- VERBAL : 73

Ces chiffres ne sont pas tous des mécanismes cognitifs indépendants : certaines familles utilisent des paramètres génératifs.

## Références consultées
- The 1% Club / exemples et analyse publique des formats : inspiration pour la progression et les pièges logiques.
- Travaux sur les évaluations cognitives gamifiées : intérêt d’une adaptation pour éviter que le jeu soit trop facile ou trop difficile et intérêt d’un feedback clair.
- Travaux récents sur l’équilibre engagement/validité : les points et feedback peuvent améliorer l’engagement, tandis que la pression temporelle peut modifier la stratégie.

## Limite honnête
Le build frontend complet n’a pas été exécuté avec `npm install` dans cet environnement, car l’installation des dépendances réseau a déjà expiré. Le moteur compile et les fichiers frontend ont été contrôlés par transpilation/syntaxe. Une validation réelle Safari/iPhone reste nécessaire.
