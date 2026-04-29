# Etat Codex - Portfolio Sakaii

Date de validation : 2026-04-29
Dossier : `C:\Users\mikael.bouchet\Documents\NC - Site\Portfolio`

## Etat actuel

Le projet Astro + Directus + Docker Compose est maintenant valide pour une preview locale avec mock Directus et pret pour un test de deploiement sur une machine Linux avec Docker.

## Validations effectuees

- `frontend/node_modules` et `frontend/package-lock.json` ont ete supprimes puis regeneres avec `npm install`.
- `npm install` reussit dans `frontend/`.
- `npm audit` retourne 0 vulnerabilite apres override de `yaml` en `^2.8.3`.
- `npx astro check` retourne 0 erreur, 0 warning, 0 hint.
- `npm run build` reussit avec :
  - `DIRECTUS_URL=http://localhost:8055`
  - `PUBLIC_DIRECTUS_URL=http://localhost:8055`
- `scripts/mock-directus.mjs` repond aux endpoints attendus :
  - `/server/health`
  - `/items/projects` -> `{ data: [...] }`
  - `/items/experiences` -> `{ data: [...] }`
  - `/items/skills` -> `{ data: [...] }`
  - `/items/certifications` -> `{ data: [...] }`
  - `/items/about` -> `{ data: { ... } }`
  - `/items/settings` -> `{ data: { ... } }`
- Le rendu local sur `http://localhost:4321` a ete inspecte dans le navigateur integre.
- La route `/en/` affiche bien les chaines statiques anglaises.
- Le toggle dark/light fonctionne et persiste dans `localStorage`.
- Le terminal s'ouvre, execute les commandes, gere `clear` et ferme avec `exit`.
- Le filtrage projets a ete valide par harness DOM sur le script client.
- Les scripts suivants sont syntaxiquement valides avec `node --check` :
  - `seed.mjs`
  - `scripts/mock-directus.mjs`
  - `frontend/docker-entrypoint.mjs`

## Corrections appliquees

- Image Docker Directus epinglee sur `directus/directus:11` au lieu de `latest`.
- Hints Astro supprimes via `is:inline` explicite.
- Initialisation terminal/theme rendue robuste en dev/HMR avec des guards par element DOM.
- Terminal renforce avec gestion explicite de la touche `Enter`.
- Navbar mobile ajustee pour eviter le debordement sur largeur tres etroite.
- Lockfile frontend regenere et audit npm assaini.

## Verification Directus / seed

Le script `seed.mjs` :

- attend `/server/health`,
- se connecte via `/auth/login`,
- cree les collections via `POST /collections`,
- cree les champs via `POST /fields/{collection}`,
- configure `about` et `settings` comme singletons via `meta.singleton: true`,
- fait des upserts pour eviter les doublons,
- cherche la policy publique via `/policies`,
- cree ou met a jour les permissions publiques de lecture via `/permissions`.

Les docs Directus 11 confirment que les permissions sont assignees aux policies.

## Limites de validation locale

Docker et Bash ne sont pas disponibles sur cette machine Windows :

- `docker --version` echoue car Docker n'est pas installe.
- `bash -n deploy.sh` ne peut pas etre lance car Bash n'est pas installe.

Le `docker-compose.yml`, le `Dockerfile`, `docker-entrypoint.mjs` et `deploy.sh` ont donc ete verifies par lecture et par validation syntaxique Node lorsque applicable. Le test final `docker compose up -d --build` reste a faire sur Debian 12 ou Ubuntu 24.04.
