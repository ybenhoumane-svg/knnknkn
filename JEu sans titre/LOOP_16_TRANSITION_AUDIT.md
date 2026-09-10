# LOOP 16 — Audit de transition

## Autorisation
Modification limitée au mécanisme de transition entre défis, conformément à l'autorisation donnée après l'audit du LOOP 15.

## Cause traitée
Le flux précédent partageait un même timer entre plusieurs responsabilités (mémoire, contrôle et transition de feedback) et faisait dépendre la transition de plusieurs mutations d'état React successives. Le callback de transition était également couplé à `makeNext()`, qui pouvait invalider le token de transition.

## Correction
- Ajout d'un `transitionTimer` dédié au feedback.
- Le timer de transition n'est plus partagé avec les timers de gameplay.
- `makeNext()` ne modifie plus le token de transition.
- `finishEncounter()` crée une transition explicite et unique (`pendingTransition`).
- Une seule `useEffect` est propriétaire de l'avancement après le feedback.
- Le callback vérifie toujours le token avant d'avancer.
- Le timer est nettoyé lors de tout changement pertinent et au démontage.
- Le feedback reste inchangé visuellement et textuellement par rapport au LOOP 15.
- Aucun générateur, aucune banque de questions, aucun scoring, aucune logique de profil n'a été modifié.

## Contrôles
- Le moteur (`tsconfig.engine.json`) compile sans erreur.
- Vérification statique : `transitionToken` n'est plus incrémenté dans `makeNext()`.
- Vérification statique : la transition utilise `transitionTimer`, séparé du timer de gameplay.
- Vérification statique : un seul site de création du timer de transition existe.
- Vérification statique : les anciens messages de feedback indésirables restent absents.

## Limite
Le build Vite complet n'a pas pu être exécuté dans l'environnement de travail car l'installation npm dépasse le délai disponible. Aucun résultat de build n'est donc présenté comme réussi.
