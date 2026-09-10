# LOOP 21 — audit sérieux / crash / qualité des épreuves

## 1. Incident terrain
Le test iPhone a établi un comportement précis : une mauvaise réponse pouvait aboutir à « Un défi a rencontré un problème ». L'ErrorBoundary protégeait l'application mais ne corrigeait pas la cause.

## 2. Stabilisation du chemin d'erreur
- `finishEncounter` englobe maintenant tout le traitement d'une réponse : trial, profil, persistance, adaptation et feedback.
- Une erreur de traitement ne remonte plus jusqu'au crash global : le défi est ignoré proprement et la session passe au suivant.
- Le rendu d'un défi est isolé par `ChallengeBoundary` + `ChallengeContent` afin qu'une donnée de défi mal formée ne fasse pas tomber toute la session.
- CONTROL vérifie explicitement qu'un sous-essai existe avant rendu.
- Les erreurs restent journalisées dans la console pour permettre une reproduction future, sans exposer l'utilisateur à un écran technique.
- L'audio est non critique : création/reprise de contexte et lecture sont protégées.

## 3. Refonte qualité des énigmes
La priorité n'est plus le nombre brut de questions mais la diversité des mécanismes.

### RULE
Ajout d'une banque de 20 problèmes de déduction/condition/stratégie. La banque profonde est sélectionnée régulièrement et respecte la difficulté demandée.

### MATH
Ajout de 10 problèmes multi-étapes : proportions, pourcentages successifs, équations simples, probabilité, optimisation, moyenne.

### AUDIO
18 motifs rythmiques déterministes et lecture via un `AudioContext` partagé. L'icône d'écoute reste indépendante du bouton de validation.

### NATURALISTIC
10 situations sémantiques distinctes : cycle, métamorphose, chaîne, camouflage, ramification, classification, symétrie, niche, saison, adaptation. Les formulations ne reposent plus sur un seul prompt générique.

### SPATIAL
La représentation garde la géométrie comme donnée et enrichit la diversité des variantes par transformation, rotation, miroir et double transformation.

### MEMORY / CONTROL / SOCIAL
Les familles restent fonctionnellement valides mais sont identifiées comme prochains chantiers de variété de mécanismes. On ne gonfle pas artificiellement leur nombre de variantes.

## 4. Tests exécutés
- `npm run engine:check` : PASS.
- 5 000 défis générés et audités : PASS.
- 5 000 IDs uniques : PASS.
- 0 échec d'audit.
- 0 échec de génération dans l'échantillon.
- Variantes observées sur 500 items/famille : RULE 107, SPATIAL 46, MEMORY 8, CONTROL 4, AUDIO 18, SOCIAL 6, NATURALISTIC 500, META 5, MATH 66, VERBAL 74.
- Transpilation du moteur + générateurs : PASS.

## 5. Limite honnête
Safari iOS réel n'est pas simulable fidèlement depuis cet environnement. La correction du crash est donc renforcée par code et tests, mais la preuve finale doit encore venir d'un nouveau test sur iPhone, notamment sur plusieurs mauvaises réponses successives.

## 6. Décision
Ne pas appeler la V1 « terminée » uniquement parce que les tests passent. Le prochain cycle doit continuer sur la qualité perceptible : mécanismes réellement différents, intérêt des énigmes, variété des interactions et absence de répétition artificielle.
