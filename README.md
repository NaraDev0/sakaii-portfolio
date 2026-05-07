# Sakaii Portfolio

Portfolio professionnel de **Mikael Bouchet**, technicien reseau en alternance, construit avec Astro, Directus et Docker Compose.

Production cible :

- Site : [sakaii.org](https://sakaii.org)
- Admin Directus : [admin.sakaii.org](https://admin.sakaii.org)

## Stack

| Composant | Technologie |
| --- | --- |
| Frontend | Astro 6, SSG |
| CMS | Directus 11 |
| Base de donnees | SQLite |
| Orchestration | Docker Compose |
| Runtime frontend | Node 20 + `serve` |
| Hebergement cible | Proxmox + Cloudflare Tunnel |

## Lancement local sans Docker

Le mock Directus permet de tester le site sans installer Directus.

Terminal 1, depuis la racine :

```bash
node scripts/mock-directus.mjs
```

Terminal 2 :

```bash
cd frontend
DIRECTUS_URL=http://localhost:8055 PUBLIC_DIRECTUS_URL=http://localhost:8055 npm run dev
```

Ouvrir ensuite `http://localhost:4321`.

Sur PowerShell :

```powershell
cd frontend
$env:DIRECTUS_URL = "http://localhost:8055"
$env:PUBLIC_DIRECTUS_URL = "http://localhost:8055"
npm run dev
```

## Validation frontend

```bash
cd frontend
npm install
npx astro check
DIRECTUS_URL=http://localhost:8055 PUBLIC_DIRECTUS_URL=http://localhost:8055 npm run build
```

Le build Astro est statique. Il a besoin de Directus, ou du mock, au moment du build.

## Deploiement rapide

Sur une VM/LXC Debian 12 ou Ubuntu 24.04 :

```bash
curl -fsSL https://raw.githubusercontent.com/NaraDev0/sakaii-portfolio/main/deploy.sh | bash
```

Ou depuis un clone local :

```bash
git clone https://github.com/NaraDev0/sakaii-portfolio.git
cd sakaii-portfolio
sudo bash deploy.sh
```

Le script installe Docker, Docker Compose, Node.js 20, genere `.env`, lance la stack et execute le seed Directus.

## Structure

```text
sakaii-portfolio/
├── docker-compose.yml
├── deploy.sh
├── update.sh
├── backup.sh
├── seed.mjs
├── seed-data.mjs
├── scripts/
│   └── mock-directus.mjs
├── directus/
│   ├── database/
│   ├── uploads/
│   └── extensions/
└── frontend/
    ├── src/
    ├── public/
    ├── Dockerfile
    └── docker-entrypoint.mjs
```

## Configuration

Copier `.env.example` vers `.env`, ou laisser `deploy.sh` le faire automatiquement.

| Variable | Description |
| --- | --- |
| `DIRECTUS_KEY` | Cle de securite Directus |
| `DIRECTUS_SECRET` | Secret Directus |
| `ADMIN_EMAIL` | Email administrateur Directus |
| `ADMIN_PASSWORD` | Mot de passe administrateur Directus |
| `DIRECTUS_URL` | URL Directus cote build/runtime |
| `SITE_URL` | URL publique du site frontend |
| `DIRECTUS_PUBLIC_URL` | URL publique de l'admin Directus |
| `PUBLIC_DIRECTUS_URL` | URL publique utilisee pour les assets Directus |

## Docker Compose

La stack contient trois services :

- `directus` : Directus 11 avec SQLite.
- `seed` : initialise collections, champs, donnees et permissions publiques.
- `frontend` : attend Directus, build Astro au demarrage, puis sert `dist/` sur le port 4321.

Commandes utiles :

```bash
docker compose up -d --build
docker compose logs -f
docker compose restart
docker compose down
docker compose up -d --build frontend
DIRECTUS_URL=http://localhost:8055 node seed.mjs
```

## Fonctionnalites frontend

- Sections portfolio : hero, a propos, parcours, formation, projets, competences, certifications, contact.
- Dark/light mode avec preference sauvegardee.
- Pages FR et EN pour les chaines statiques.
- Filtres projets cote client.
- Terminal easter egg avec commandes `help`, `about`, `skills`, `contact`, `stack`, `ls`, `whoami`, `neofetch`, `sudo`, `clear`, `exit`.
- Responsive mobile avec navbar compacte.

## Maintenance

```bash
bash update.sh
bash backup.sh
```

`update.sh` met a jour depuis GitHub et relance la stack. `backup.sh` archive la base SQLite et les uploads Directus.

---

Heberge avec fierte sur Proxmox.
