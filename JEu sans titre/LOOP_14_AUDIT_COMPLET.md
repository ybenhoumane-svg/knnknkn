# LOOP 14 — audit complet

## Objectif

Cette itération part directement du LOOP 13 et traite les problèmes observés pendant le test réel sur iPhone :
- écran intermédiaire incompréhensible après une réponse ;
- absence de feedback visuel satisfaisant ;
- bruit tic-tac trop présent ;
- risque de double-avancement sur CONTROL ;
- incohérences de reprise de session ;
- banque d’énigmes trop petite et trop répétitive ;
- nécessité de revalider les énigmes mathématiques ;
- besoin d’une banque d’au moins 200 défis éditoriaux réellement distincts.

## Feedback de réponse

### Bonne réponse
- la réponse sélectionnée est conservée dans le feedback ;
- feedback vert ;
- affichage 1,1 s ;
- son positif court en montée ;
- texte alterné : « Bien joué ! », « Super ! », « T’es un génie ! », « T’es un crack ! ».

### Mauvaise réponse
- feedback rouge/sombre ;
- son descendant de type « huuuunn » de jeu télé ;
- affichage 0,9 s ;
- le message n’utilise plus « On vérifie avec une autre configuration ».

### Tic-tac
Le tic-tac n’est activé que pendant les défis RULE / MATH / VERBAL. Il est coupé pendant le feedback et absent des autres familles.

## CONTROL — sécurisation

Le moteur utilise maintenant la référence de l’index de contrôle pour empêcher un ancien événement tactile ou timer de faire avancer deux fois le même essai. L’index de contrôle est synchronisé avant la mise à jour React.

## Session

Le stockage et le chargement utilisent maintenant tous les deux `version: 4` et `lvi-session-v4`.

## Banque éditoriale

**200 défis distincts** :
- 92 RULE
- 50 MATH
- 58 VERBAL

Chaque entrée possède :
- identifiant unique ;
- question unique ;
- quatre réponses uniques ;
- réponse attendue présente dans les choix ;
- explication ;
- type/mécanisme ;
- source/mécanisme de provenance.

La banque mélange des créations originales et des mécanismes inspirés de questions publiquement décrites de formats comme The 1% Club et 100 % Logique. Elle ne constitue pas une copie de leurs catalogues.

## Vérification de la banque

Chaque entrée de la banque a été testée individuellement par le générateur puis passée dans `auditItem`.

Résultat :
- 200 / 200 sélectionnables ;
- 200 / 200 audités ;
- 200 / 200 réponses cohérentes avec l’entrée de banque ;
- 200 / 200 identifiants uniques ;
- 200 / 200 prompts uniques.

## Stress test moteur

Avec `runQualitySuite(100)` :
- 7 000 défis générés ;
- 7 000 audits réussis ;
- 0 échec ;
- 7 000 IDs uniques ;
- sélection : 12 occurrences par famille sur 120 sélections ;
- playtest : 500 instances par famille ;
- 0 échec d’audit ;
- 0 échec de contenu.

## Couverture observée du playtest

- RULE : 96 variantes dans l’échantillon, 96 prompts uniques
- SPATIAL : 4 variantes
- MEMORY : 8 variantes
- CONTROL : 4 variantes
- AUDIO : 6 variantes
- SOCIAL : 6 variantes
- NATURALISTIC : 6 variantes
- META : 5 variantes et 398 prompts dans l’échantillon
- MATH : 56 variantes, 226 prompts
- VERBAL : 64 variantes, 64 prompts

Les variantes procédurales sont comptées séparément des 200 défis éditoriaux.

## Vérification mathématique ciblée

Les 50 entrées MATH de la banque ont été vérifiées individuellement avant intégration. Le cas de l’horloge HH:MM:SS a notamment été recalculé par énumération de toutes les secondes d’une journée : les six chiffres changent simultanément exactement 3 fois (09:59:59→10:00:00, 19:59:59→20:00:00, 23:59:59→00:00:00).

## TypeScript

- moteur TypeScript : PASS
- aucune erreur de syntaxe détectée sur `main.tsx` ; les seules erreurs restantes lors de la vérification isolée de l’application proviennent de l’absence des dépendances npm/React dans l’environnement d’audit.
- `npm install` n’a pas terminé dans l’environnement d’audit ; le build Vite complet n’a donc pas pu être exécuté ici.

## Recherche de conception

La banque et la logique d’alternance s’inspirent notamment des principes publics de ces formats :
- The 1% Club : questions de logique/common sense, difficulté progressive et nombreuses variantes internationales.
- 100 % Logique : logique/observation/déduction, questions relues et testées plusieurs fois, et alternance des types de logique.

La recherche a servi à identifier des mécanismes de défi, pas à copier un catalogue télévisé.
