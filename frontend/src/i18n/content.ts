import type { About, Certification, Experience, Project, Settings, Skill } from "../lib/directus";

type PortfolioContent = {
  about: About;
  settings: Settings;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  certifications: Certification[];
};

const tagTranslations: Record<string, string> = {
  Association: "Non-profit",
  Alternance: "Apprenticeship",
  Client: "Client",
  Enseignement: "Teaching",
  Gestion: "Management",
  IA: "AI",
  Langues: "Languages",
  Numérique: "Digital",
  Réseau: "Network",
  "Réseau & Sécurité": "Network & Security",
  Sécurité: "Security",
  "Suite *Arr": "*Arr stack",
  Stage: "Internship",
  Systèmes: "Systems",
  "Virtualisation & Conteneurs": "Virtualization & Containers",
  Développement: "Development"
};

const projectTranslations: Record<string, Partial<Project>> = {
  "sakaii-project": {
    excerpt: "Self-hosted ecosystem gathering all my personal services under one identity.",
    description:
      "Sakaii Project is my umbrella ecosystem for self-hosted projects: Jellyfin (Sakaii+), Nextcloud, Vaultwarden, this portfolio, and future services. Everything runs on Proxmox, with Docker and Cloudflare Tunnel."
  },
  "sakaii-plus": {
    excerpt: "Media server designed for 10 people with the *Arr stack, Jellyfin and qBittorrent.",
    description:
      "Complete media server under Sakaii Project, designed for around 10 users. It uses the *Arr stack (Sonarr, Radarr, Prowlarr) for automation, Jellyfin as the media player, qBittorrent as the torrent client and Qui as a qBittorrent interface."
  },
  nextcloud: {
    excerpt: "Personal cloud for 4 people with automated daily backup through rclone.",
    description:
      "Self-hosted Nextcloud instance under Sakaii Project, used by family and friends. It includes automated daily backups with rclone and runs in Docker on Proxmox."
  },
  "vaultwarden-perso": {
    title: "Personal Vaultwarden",
    excerpt: "Self-hosted password manager with daily backup through Proxmox.",
    description: "Personal Bitwarden-compatible Vaultwarden instance with automated daily backups through Proxmox snapshots."
  },
  "serveur-ia-local": {
    title: "Local AI Server",
    excerpt: "Local AI server with Ollama and Open WebUI for company use.",
    description:
      "In-progress project at Carpe Diem IT: deploying a local AI server with Ollama as the LLM backend and Open WebUI as the user interface. The goal is to let staff use AI without relying on cloud services."
  },
  "vaultwarden-entreprise": {
    title: "Business Vaultwarden",
    excerpt: "Vaultwarden deployment for internal use and potential client services.",
    description:
      "Vaultwarden deployment for Carpe Diem IT: internal use for staff, with the option to offer the service to company clients."
  },
  "le-singe-du-numerique": {
    excerpt: "Co-founded non-profit focused on digital education and sharing tech skills.",
    description:
      "Non-profit co-founded with my father, focused on digital education, inclusion and sharing tech skills. We are looking for a venue to run accessible computer classes."
  }
};

const experienceTranslations: Record<string, Partial<Experience>> = {
  "Technicien réseau & systèmes (alternance)": {
    title: "Network & systems technician (apprenticeship)",
    period: "Sept. 2024 — Today",
    description: "Customer support, network infrastructure maintenance and customer request deployments. Troubleshooting a wide range of IT issues."
  },
  "Co-Président": {
    title: "Co-president",
    period: "2024 — Today",
    description: "Co-founding and co-leading a non-profit dedicated to digital education and sharing technical skills."
  },
  "Créateur & Administrateur": {
    title: "Creator & administrator",
    period: "2023 — Today",
    description:
      "Creation and maintenance of a complete self-hosted ecosystem: media server (Jellyfin), cloud (Nextcloud), password manager (Vaultwarden), portfolio. Everything runs on Proxmox, Docker and Cloudflare Tunnel."
  },
  "Stage technicien réseau": {
    title: "Network technician internship",
    period: "2024 (internship)",
    description: "Company discovery internship before the apprenticeship, with first support and network maintenance assignments."
  },
  "BTS SIO option SISR": {
    title: "BTS SIO, SISR track",
    organization: "High school (Lyon area)",
    description:
      "French IT services diploma, infrastructure, systems and networks track. Completed as an apprenticeship at Carpe Diem IT."
  },
  "Bac Pro SN option RISC": {
    title: "Vocational diploma, SN RISC track",
    organization: "High school (Lyon area)",
    description: "French vocational diploma in digital systems, computer networks and communicating systems track."
  }
};

const skillNameTranslations: Record<string, string> = {
  Anglais: "English",
  Français: "French"
};

const certificationTranslations: Record<string, Partial<Certification>> = {
  Pix: {
    issuer: "Pix (French national certification)",
    detail: "Digital skills"
  }
};

export function localizeContent(lang: string, content: PortfolioContent): PortfolioContent {
  if (lang !== "en") return content;

  return {
    about: {
      ...content.about,
      title: "Network technician apprentice · Non-profit co-president",
      bio:
        "16 years old, passionate about IT for as long as I can remember. I currently work as a network and systems technician apprentice at Carpe Diem IT while studying BTS SIO, SISR track. I am also co-president of Le Singe du Numérique and maintain a complete Proxmox homelab under Sakaii Project with around ten self-hosted services."
    },
    settings: {
      ...content.settings,
      site_description:
        "Portfolio of Mikael Bouchet, network technician apprentice. Self-hosted projects, Proxmox homelab, and network & systems skills."
    },
    projects: content.projects.map((project) => ({
      ...project,
      ...projectTranslations[project.slug],
      tags: translateTags(project.tags)
    })),
    experiences: content.experiences.map((experience) => ({
      ...experience,
      ...experienceTranslations[experience.title],
      tags: translateTags(experience.tags)
    })),
    skills: content.skills.map((skill) => ({
      ...skill,
      name: skillNameTranslations[skill.name] || skill.name,
      category: tagTranslations[skill.category] || skill.category
    })),
    certifications: content.certifications.map((certification) => ({
      ...certification,
      ...certificationTranslations[certification.name]
    }))
  };
}

function translateTags(tags: string[] = []) {
  return tags.map((tag) => tagTranslations[tag] || tag);
}
