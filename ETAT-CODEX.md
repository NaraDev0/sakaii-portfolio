# État du chantier Codex — Portfolio Sakaii

Date de note : 2026-04-28  
Dossier de travail : `C:\Users\mikael.bouchet\Documents\NC - Site\Portfolio`

## Demande initiale

Le projet partait de zéro, avec toutes les consignes dans :

`C:\Users\mikael.bouchet\Downloads\prompt-codex-sakaii.md`

Objectif : construire une preview locale du futur portfolio `sakaii.org`, basé sur Astro + Directus + SQLite + Docker Compose, avec design Apple-like, dark/light mode, i18n FR/EN, seed Directus et easter egg terminal.

Tu as ensuite précisé que ce n’est pas encore pour le serveur, mais surtout pour voir le rendu local.

## Ce qui a été créé

### Racine du projet

- `docker-compose.yml`
  - Service `directus`
  - Service `seed`
  - Service `frontend`
  - Healthcheck Directus
  - Le frontend dépend du seed, pour que le build Astro puisse récupérer les données depuis Directus.

- `.env.example`
  - Exemple de configuration Directus.

- `.env`
  - Valeurs locales de test créées pour faciliter un lancement futur.
  - Le mot de passe admin reste `ChangeMePlease!`, donc à changer avant tout vrai déploiement.

- `.gitignore`
  - Ignore `.env`, `node_modules`, `dist`, `.astro`, DB Directus et uploads.

- `seed-data.mjs`
  - Toutes les données du prompt :
    - projets
    - expériences
    - formations
    - compétences
    - certifications
    - about
    - settings

- `seed.mjs`
  - Script Node d’initialisation Directus.
  - Attend `/server/health`.
  - Login avec l’admin.
  - Crée les collections et champs.
  - Upsert les données pour éviter les doublons.
  - Configure la lecture publique via les policies Directus actuelles.

- `scripts/mock-directus.mjs`
  - Petit serveur local qui imite les endpoints Directus nécessaires :
    - `/server/health`
    - `/items/projects`
    - `/items/experiences`
    - `/items/skills`
    - `/items/certifications`
    - `/items/about`
    - `/items/settings`
  - Sert les données depuis `seed-data.mjs`.
  - Utile pour voir le rendu sans Docker ni vrai serveur Directus.

- Dossiers Directus préparés :
  - `directus/database/.gitkeep`
  - `directus/uploads/.gitkeep`
  - `directus/extensions/.gitkeep`

### Frontend Astro

- `frontend/package.json`
  - Astro `6.1.10`
  - `@astrojs/sitemap`
  - `@astrojs/check`
  - `typescript`
  - `serve`

- `frontend/astro.config.mjs`
  - Site : `https://sakaii.org`
  - Output statique
  - Sitemap activé

- `frontend/tsconfig.json`

- `frontend/Dockerfile`
  - Node 20 Alpine
  - Installe les dépendances
  - Lance `docker-entrypoint.mjs`

- `frontend/docker-entrypoint.mjs`
  - Attend Directus
  - Lance `npm run build`
  - Sert `dist` sur le port `4321`

- `frontend/.dockerignore`

- `frontend/src/lib/directus.ts`
  - Client Directus en `fetch` natif.
  - Fonctions :
    - `getProjects`
    - `getExperiences`
    - `getSkills`
    - `getCertifications`
    - `getAbout`
    - `getSettings`
    - `getAssetURL`
    - `resolveAssetId`
  - Le frontend consomme bien `/items/...`, donc le mock local peut remplacer Directus pour la preview.

- `frontend/src/i18n/fr.json`
  - Chaînes statiques françaises.

- `frontend/src/i18n/en.json`
  - Chaînes statiques anglaises.

- `frontend/src/styles/global.css`
  - Variables dark/light.
  - Accent `#6279CD`.
  - Navbar glassmorphism.
  - Hero.
  - À propos.
  - Timeline.
  - Formation.
  - Projets avec filtres.
  - Skills avec barres animées.
  - Certifications.
  - Contact.
  - Footer.
  - Terminal modal.
  - Responsive mobile.
  - Animations reveal/hover/progress.

- Layout :
  - `frontend/src/layouts/Layout.astro`
  - SEO dynamique depuis `settings`.
  - Open Graph.
  - JSON-LD `Person`.
  - Google Fonts `DM Sans` et `JetBrains Mono`.
  - Navbar, footer, terminal et scroll reveal intégrés.

- Pages :
  - `frontend/src/pages/index.astro`
  - `frontend/src/pages/en/index.astro`
  - Les deux pages récupèrent le contenu via `directus.ts`.

- Composants :
  - `Navbar.astro`
  - `ThemeToggle.astro`
  - `LangToggle.astro`
  - `Hero.astro`
  - `About.astro`
  - `Timeline.astro`
  - `Formation.astro`
  - `Projects.astro`
  - `ProjectCard.astro`
  - `Skills.astro`
  - `Certifications.astro`
  - `Contact.astro`
  - `Footer.astro`
  - `Terminal.astro`
  - `ScrollReveal.astro`

- Public :
  - `frontend/public/favicon.svg`
  - `frontend/public/robots.txt`

## Choix techniques importants

- Docker n’est pas disponible sur cette machine actuellement : la commande `docker --version` échoue.
- Pour voir le rendu local, j’ai ajouté `scripts/mock-directus.mjs`.
- Les données dynamiques ne sont pas directement codées dans les composants Astro : elles passent par le client `directus.ts`, qui peut parler au mock local ou à Directus.
- J’ai vérifié les docs Directus récentes : Directus 11 utilise des `policies` pour les permissions. Le seed cherche donc la policy publique et crée les règles de lecture dessus.
- Le Dockerfile frontend ne build pas l’app pendant l’image Docker : il attend Directus au démarrage, puis build. C’est volontaire, car Astro SSG a besoin des données Directus au moment du build.

## État exact au moment de l’arrêt

- Le code frontend est écrit, mais pas encore validé par `astro check` ou `astro build`.
- `npm install` a été lancé dans `frontend`, mais a dépassé le timeout.
- Le processus `npm install` restant a été arrêté.
- `frontend/node_modules` existe peut-être partiellement.
- `frontend/package-lock.json` n’existe pas encore.
- Aucun serveur Astro local n’a encore été lancé.
- Aucun screenshot/rendu navigateur n’a encore été vérifié.
- `README.md` n’a pas encore été écrit.

## Reprise conseillée

Depuis la racine du projet :

```powershell
Remove-Item -Recurse -Force .\frontend\node_modules
cd .\frontend
npm install
```

Puis, dans un terminal depuis la racine :

```powershell
node .\scripts\mock-directus.mjs
```

Dans un deuxième terminal :

```powershell
cd .\frontend
$env:DIRECTUS_URL = "http://localhost:8055"
$env:PUBLIC_DIRECTUS_URL = "http://localhost:8055"
npm run dev
```

Ensuite ouvrir l’URL Astro affichée, normalement `http://localhost:4321`.

## À faire ensuite

1. Relancer proprement `npm install`.
2. Corriger les éventuelles erreurs TypeScript/Astro.
3. Lancer le mock Directus.
4. Lancer `npm run build` avec `DIRECTUS_URL=http://localhost:8055`.
5. Lancer `npm run dev` pour voir le rendu local.
6. Ajuster le design après inspection visuelle.
7. Écrire `README.md`.
8. Plus tard seulement : tester le vrai `docker compose up -d` sur une machine avec Docker.
