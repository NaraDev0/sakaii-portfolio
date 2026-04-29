export const projects = [
  {
    title: "Sakaii Project",
    slug: "sakaii-project",
    excerpt: "Écosystème self-hosted regroupant tous mes services personnels sous une même marque.",
    description:
      "Sakaii Project est ma marque / mon écosystème parapluie qui regroupe l'ensemble de mes projets self-hosted : Jellyfin (Sakaii+), Nextcloud, Vaultwarden, ce portfolio, et d'autres services à venir. Tout est hébergé sur Proxmox, orchestré avec Docker, et exposé via Cloudflare Tunnel.",
    category: "perso",
    status: "en_cours",
    visibility: "published",
    featured: true,
    tags: ["Proxmox", "Docker", "Cloudflare", "Self-hosted"],
    sort: 1
  },
  {
    title: "Sakaii+ (Jellyfin)",
    slug: "sakaii-plus",
    excerpt: "Serveur multimédia conçu pour 10 personnes avec la suite *Arr, Jellyfin et qBittorrent.",
    description:
      "Serveur multimédia complet sous Sakaii Project, conçu pour ~10 utilisateurs. Utilise la suite *Arr (Sonarr, Radarr, Prowlarr) pour l'automatisation, Jellyfin comme lecteur multimédia, qBittorrent comme client torrent et Qui comme interface par-dessus qBittorrent.",
    category: "perso",
    status: "termine",
    visibility: "published",
    featured: true,
    tags: ["Jellyfin", "Suite *Arr", "qBittorrent", "Docker"],
    sort: 2
  },
  {
    title: "Nextcloud",
    slug: "nextcloud",
    excerpt: "Cloud personnel pour 4 personnes avec sauvegarde quotidienne automatisée via rclone.",
    description:
      "Instance Nextcloud self-hosted sous Sakaii Project, destinée à ma famille et mes amis (~4 utilisateurs). Sauvegarde quotidienne automatisée via rclone. Hébergé sur Proxmox dans un conteneur Docker.",
    category: "perso",
    status: "termine",
    visibility: "published",
    featured: false,
    tags: ["Nextcloud", "rclone", "Docker", "Proxmox"],
    sort: 3
  },
  {
    title: "Vaultwarden Personnel",
    slug: "vaultwarden-perso",
    excerpt: "Gestionnaire de mots de passe self-hosted avec backup quotidien via Proxmox.",
    description:
      "Instance Vaultwarden personnelle compatible Bitwarden, avec backup quotidien automatisé via les snapshots Proxmox.",
    category: "perso",
    status: "termine",
    visibility: "published",
    featured: false,
    tags: ["Vaultwarden", "Proxmox", "Sécurité"],
    sort: 4
  },
  {
    title: "Serveur IA Local",
    slug: "serveur-ia-local",
    excerpt: "Serveur d'intelligence artificielle en local avec Ollama et Open WebUI pour l'entreprise.",
    description:
      "Projet en cours chez Carpe Diem IT : déploiement d'un serveur IA en local avec Ollama comme backend LLM et Open WebUI comme interface utilisateur. Objectif : permettre aux collaborateurs d'utiliser l'IA sans dépendre de services cloud.",
    category: "pro",
    status: "en_cours",
    visibility: "published",
    featured: false,
    tags: ["Ollama", "Open WebUI", "IA", "Docker"],
    sort: 5
  },
  {
    title: "Vaultwarden Entreprise",
    slug: "vaultwarden-entreprise",
    excerpt: "Déploiement de Vaultwarden pour l'usage interne et potentiellement proposé aux clients.",
    description:
      "Déploiement de Vaultwarden pour Carpe Diem IT : usage interne pour les collaborateurs, avec la possibilité de commercialiser ce service auprès des clients de l'entreprise.",
    category: "pro",
    status: "en_cours",
    visibility: "published",
    featured: false,
    tags: ["Vaultwarden", "Sécurité", "Client"],
    sort: 6
  },
  {
    title: "Le Singe du Numérique",
    slug: "le-singe-du-numerique",
    excerpt: "Association co-fondée dédiée à l'enseignement numérique et la transmission des compétences tech.",
    description:
      "Association co-fondée avec mon père, dédiée à l'enseignement numérique, l'inclusion et la transmission des compétences tech. Recherche de local en cours pour organiser des cours d'informatique accessibles à tous.",
    category: "asso",
    status: "en_cours",
    visibility: "published",
    featured: true,
    tags: ["Association", "Enseignement", "Numérique"],
    sort: 7
  }
];

export const experiences = [
  {
    type: "experience",
    title: "Technicien réseau & systèmes (alternance)",
    organization: "Carpe Diem IT",
    period: "Sept. 2024 — Aujourd'hui",
    description:
      "Support client, maintenance des infrastructures réseau, déploiement des demandes clients. Gestion de tout type de problème informatique.",
    tags: ["M365", "Stormshield", "Active Directory", "Omada", "Proxmox", "Windows Server", "HP", "Beemo", "SHV"],
    sort: 1
  },
  {
    type: "experience",
    title: "Co-Président",
    organization: "Le Singe du Numérique",
    period: "2024 — Aujourd'hui",
    description:
      "Co-fondation et co-présidence d'une association dédiée à l'enseignement numérique et la transmission des compétences tech.",
    tags: ["Association", "Gestion", "Enseignement"],
    sort: 2
  },
  {
    type: "experience",
    title: "Créateur & Administrateur",
    organization: "Sakaii Project",
    period: "2023 — Aujourd'hui",
    description:
      "Création et maintenance d'un écosystème self-hosted complet : serveur multimédia (Jellyfin), cloud (Nextcloud), gestionnaire de mots de passe (Vaultwarden), portfolio. Tout sur Proxmox + Docker + Cloudflare Tunnel.",
    tags: ["Proxmox", "Docker", "Cloudflare", "Self-hosted"],
    sort: 3
  },
  {
    type: "experience",
    title: "Stage technicien réseau",
    organization: "Carpe Diem IT",
    period: "2024 (stage)",
    description: "Stage de découverte de l'entreprise avant l'alternance. Premières missions de support et de maintenance réseau.",
    tags: ["Réseau", "Support", "Stage"],
    sort: 4
  },
  {
    type: "formation",
    title: "BTS SIO option SISR",
    organization: "Lycée (région lyonnaise)",
    period: "2024 — 2026",
    description:
      "BTS Services Informatiques aux Organisations, option Solutions d'Infrastructure, Systèmes et Réseaux. En alternance chez Carpe Diem IT.",
    icon: "🎓",
    tags: ["BTS", "SISR", "Alternance"],
    sort: 5
  },
  {
    type: "formation",
    title: "Bac Pro SN option RISC",
    organization: "Lycée (région lyonnaise)",
    period: "2021 — 2024",
    description: "Bac Professionnel Systèmes Numériques, option Réseaux Informatiques et Systèmes Communicants.",
    icon: "📘",
    tags: ["Bac Pro", "RISC", "Réseau"],
    sort: 6
  }
];

export const skills = [
  { name: "Windows / Windows Server", level: 75, category: "Systèmes", sort: 1 },
  { name: "Fedora / Linux", level: 55, category: "Systèmes", sort: 2 },
  { name: "Active Directory", level: 65, category: "Systèmes", sort: 3 },
  { name: "Microsoft 365", level: 70, category: "Systèmes", sort: 4 },
  { name: "Stormshield (SNS)", level: 72, category: "Réseau & Sécurité", sort: 5 },
  { name: "TP-Link Omada", level: 78, category: "Réseau & Sécurité", sort: 6 },
  { name: "HP Networking", level: 55, category: "Réseau & Sécurité", sort: 7 },
  { name: "Beemo", level: 50, category: "Réseau & Sécurité", sort: 8 },
  { name: "Proxmox VE", level: 72, category: "Virtualisation & Conteneurs", sort: 9 },
  { name: "Docker / Docker Compose", level: 45, category: "Virtualisation & Conteneurs", sort: 10 },
  { name: "HTML / CSS", level: 50, category: "Développement", sort: 11 },
  { name: "Bash / PowerShell", level: 40, category: "Développement", sort: 12 },
  { name: "Anglais", level: 70, category: "Langues", sort: 13 },
  { name: "Français", level: 100, category: "Langues", sort: 14 }
];

export const certifications = [
  {
    name: "OCNA — Omada Cloud Network Administrator",
    issuer: "TP-Link",
    detail: "Score : 97%",
    date: "2024",
    sort: 1
  },
  {
    name: "Pix",
    issuer: "Pix (certification nationale)",
    detail: "Compétences numériques",
    date: "2024",
    sort: 2
  }
];

export const about = {
  name: "Mikaël BOUCHET",
  title: "Technicien réseau en alternance · Co-Président associatif",
  bio: "16 ans, passionné d'informatique depuis toujours. Actuellement en alternance chez Carpe Diem IT en tant que technicien réseau & systèmes, et en BTS SIO option SISR. Co-président de l'association Le Singe du Numérique. Je gère un homelab complet sous Proxmox (Sakaii Project) avec une dizaine de services self-hosted.",
  instagram: "@mikael_bch",
  github: "NaraDev0",
  email: "mikael@sakaii.org"
};

export const settings = {
  site_title: "Mikaël BOUCHET — Portfolio",
  site_description:
    "Portfolio de Mikaël Bouchet, technicien réseau en alternance. Projets self-hosted, homelab Proxmox, et compétences réseau & systèmes.",
  domain: "sakaii.org",
  default_lang: "fr",
  enable_i18n: true,
  enable_analytics: false,
  analytics_url: ""
};

export const seedData = {
  projects,
  experiences,
  skills,
  certifications,
  about,
  settings
};
