# 🌐 Sakaii Portfolio

Portfolio professionnel de **Mikaël Bouchet** - Technicien reseau en alternance.

> [sakaii.org](https://sakaii.org)

![Screenshot placeholder](https://placehold.co/1200x630/111827/e5e7eb?text=Sakaii+Portfolio)

## 🚀 Deploiement rapide

Sur une VM/LXC vierge (Debian 12 ou Ubuntu 24.04) :

```bash
curl -fsSL https://raw.githubusercontent.com/NaraDev0/sakaii-portfolio/main/deploy.sh | bash
```

Ou, si le depot est prive :

```bash
git clone https://github.com/NaraDev0/sakaii-portfolio.git
cd sakaii-portfolio
sudo bash deploy.sh
```

C'est tout. Le script installe Docker, Node.js, build le projet, lance Directus et seed les donnees.

## 🛠️ Stack technique

| Composant | Techno |
|---|---|
| Frontend | Astro (SSG) |
| CMS | Directus |
| Base de donnees | SQLite |
| Orchestration | Docker Compose |
| Hebergement | Proxmox + Cloudflare Tunnel |

## 📁 Structure du projet

```text
sakaii-portfolio/
├── docker-compose.yml    # Orchestration
├── deploy.sh             # Deploiement automatique
├── update.sh             # Mise a jour
├── backup.sh             # Backup BDD + uploads
├── seed.mjs              # Initialisation Directus
├── directus/             # Donnees Directus (runtime)
└── frontend/             # Site Astro
```

## ⚙️ Configuration

Copier `.env.example` vers `.env` et adapter les valeurs, ou laisser `deploy.sh` le faire automatiquement.

Variables principales :

| Variable | Description |
|---|---|
| `DIRECTUS_KEY` | Clef de securite Directus generee automatiquement |
| `DIRECTUS_SECRET` | Secret Directus genere automatiquement |
| `ADMIN_EMAIL` | Email du compte administrateur Directus |
| `ADMIN_PASSWORD` | Mot de passe du compte administrateur Directus |
| `DIRECTUS_URL` | URL interne Directus utilisee par Docker |
| `PUBLIC_DIRECTUS_URL` | URL publique du CMS |

## 📋 Commandes utiles

| Commande | Description |
|---|---|
| `docker compose up -d` | Lancer le projet |
| `docker compose logs -f` | Voir les logs |
| `docker compose down` | Arreter le projet |
| `docker compose up -d --build` | Rebuild apres modif |
| `docker compose up -d --build frontend` | Rebuild uniquement le frontend |
| `DIRECTUS_URL=http://localhost:8055 node seed.mjs` | Relancer le seed Directus depuis la VM |
| `bash update.sh` | Mettre a jour depuis GitHub |
| `bash backup.sh` | Backup base + uploads |

## 🔒 Acces

- **Site** : [sakaii.org](https://sakaii.org) (port 4321)
- **Admin Directus** : [admin.sakaii.org](https://admin.sakaii.org) (port 8055)

---

Heberge avec fierte sur Proxmox 🖥️
