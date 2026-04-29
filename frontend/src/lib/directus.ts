const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || "http://localhost:8055";
const PUBLIC_DIRECTUS_URL = import.meta.env.PUBLIC_DIRECTUS_URL || "https://admin.sakaii.org";

export type AssetRef = string | { id?: string } | null | undefined;

export type Project = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  category: "pro" | "perso" | "asso" | "ecole";
  status: "termine" | "en_cours" | "en_pause";
  visibility: "published" | "draft";
  featured: boolean;
  cover?: AssetRef;
  tags: string[];
  sort: number;
};

export type Experience = {
  id?: number;
  type: "experience" | "formation";
  title: string;
  organization: string;
  period: string;
  description: string;
  tags: string[];
  icon?: string;
  sort: number;
};

export type Skill = {
  id?: number;
  name: string;
  level: number;
  category: string;
  sort: number;
};

export type Certification = {
  id?: number;
  name: string;
  issuer: string;
  detail: string;
  date: string;
  sort: number;
};

export type About = {
  id?: number;
  name: string;
  title: string;
  bio: string;
  photo?: AssetRef;
  cv?: AssetRef;
  instagram: string;
  github: string;
  email: string;
};

export type Settings = {
  id?: number;
  site_title: string;
  site_description: string;
  domain: string;
  default_lang: string;
  enable_i18n: boolean;
  enable_analytics: boolean;
  analytics_url?: string;
};

async function fetchDirectus<T>(path: string): Promise<T> {
  const res = await fetch(`${DIRECTUS_URL}/items/${path}`, {
    headers: { Accept: "application/json" }
  });

  if (!res.ok) {
    throw new Error(`Directus ${path} a répondu ${res.status}. Vérifie que Directus ou le mock local est lancé.`);
  }

  const json = await res.json();
  return json.data as T;
}

export async function getProjects() {
  return fetchDirectus<Project[]>("projects?filter[visibility][_eq]=published&sort=sort");
}

export async function getExperiences() {
  return fetchDirectus<Experience[]>("experiences?sort=sort");
}

export async function getSkills() {
  return fetchDirectus<Skill[]>("skills?sort=sort");
}

export async function getCertifications() {
  return fetchDirectus<Certification[]>("certifications?sort=sort");
}

export async function getAbout() {
  return fetchDirectus<About>("about");
}

export async function getSettings() {
  return fetchDirectus<Settings>("settings");
}

export function resolveAssetId(file: AssetRef): string | null {
  if (!file) return null;
  if (typeof file === "string") return file;
  return file.id || null;
}

export function getAssetURL(file: AssetRef): string | null {
  const fileId = resolveAssetId(file);
  return fileId ? `${PUBLIC_DIRECTUS_URL}/assets/${fileId}` : null;
}
