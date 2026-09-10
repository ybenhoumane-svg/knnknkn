LOOP 23 — robustesse du flux de réponse, feedback et cache PWA

# La vraie intelligence — LOOP 23

Prototype mobile-first local d’un jeu d’évaluation ludique de différentes capacités cognitives.

## Base technique
- React + TypeScript + Vite
- PWA
- stockage local
- aucune API cognitive distante
- moteur de génération/audit

## LOOP 21
- feedback positif/négatif sonore et visuel
- tic-tac limité aux énigmes
- sécurisation du moteur CONTROL
- session v4 cohérente
- banque éditoriale de 200 défis
- audit automatique et playtest multi-pass

Voir `LOOP_14_AUDIT_COMPLET.md` pour les résultats détaillés.

## Lancer

```bash
npm install
npm run dev -- --host
```

Pour tester sur iPhone, ouvrir l’adresse `Network` fournie par Vite lorsque le Mac et l’iPhone sont reliés au même réseau local / partage de connexion.
