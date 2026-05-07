import { readFile } from "node:fs/promises";
import { about, certifications, experiences, projects, settings, skills } from "./seed-data.mjs";

const env = await loadEnv();
const DIRECTUS_URL = process.env.DIRECTUS_URL || env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || "mikael@sakaii.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD || "ChangeMePlease!";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || env.ADMIN_TOKEN || "";

let accessToken = "";

const collections = [
  {
    name: "projects",
    icon: "rocket_launch",
    note: "Projets affichés sur le portfolio.",
    fields: [
      stringField("title", "Nom du projet"),
      stringField("slug", "Slug unique", { unique: true }),
      textField("excerpt", "Résumé court", { interfaceName: "input-multiline" }),
      textField("description", "Description complète", { interfaceName: "input-rich-text-md" }),
      selectField("category", "Catégorie", ["pro", "perso", "asso", "ecole"]),
      selectField("status", "Statut", ["termine", "en_cours", "en_pause"]),
      selectField("visibility", "Visibilité", ["published", "draft"], "published"),
      booleanField("featured", "Mis en avant"),
      fileField("cover", "Image de couverture", "file-image"),
      jsonField("tags", "Tags"),
      integerField("sort", "Ordre d'affichage"),
      timestampField("date_created", "Date de création", "date-created"),
      timestampField("date_updated", "Date de mise à jour", "date-updated")
    ]
  },
  {
    name: "experiences",
    icon: "work_history",
    note: "Expériences professionnelles et formations.",
    fields: [
      selectField("type", "Type", ["experience", "formation"]),
      stringField("title", "Titre"),
      stringField("organization", "Organisation"),
      stringField("period", "Période"),
      textField("description", "Description", { interfaceName: "input-multiline" }),
      jsonField("tags", "Tags"),
      stringField("icon", "Icône", { nullable: true }),
      integerField("sort", "Ordre")
    ]
  },
  {
    name: "skills",
    icon: "query_stats",
    note: "Compétences regroupées par catégorie.",
    fields: [
      stringField("name", "Nom de la compétence"),
      integerField("level", "Niveau"),
      stringField("category", "Catégorie"),
      integerField("sort", "Ordre")
    ]
  },
  {
    name: "certifications",
    icon: "workspace_premium",
    note: "Certifications et validations.",
    fields: [
      stringField("name", "Nom"),
      stringField("issuer", "Organisme"),
      stringField("detail", "Détail", { nullable: true }),
      stringField("date", "Date"),
      integerField("sort", "Ordre")
    ]
  },
  {
    name: "about",
    icon: "person",
    singleton: true,
    note: "Profil principal du portfolio.",
    fields: [
      stringField("name", "Nom"),
      stringField("title", "Titre professionnel"),
      textField("bio", "Bio", { interfaceName: "input-rich-text-md" }),
      fileField("photo", "Photo de profil", "file-image"),
      fileField("cv", "CV PDF", "file"),
      stringField("instagram", "Instagram"),
      stringField("github", "GitHub"),
      stringField("email", "Email")
    ]
  },
  {
    name: "settings",
    icon: "tune",
    singleton: true,
    note: "Réglages SEO et site.",
    fields: [
      stringField("site_title", "Titre du site"),
      textField("site_description", "Meta description", { interfaceName: "input-multiline" }),
      stringField("domain", "Domaine"),
      stringField("default_lang", "Langue par défaut"),
      booleanField("enable_i18n", "Activer i18n", true),
      booleanField("enable_analytics", "Activer analytics"),
      stringField("analytics_url", "URL analytics", { nullable: true })
    ]
  }
];

await main();

async function main() {
  console.log(`Connexion à Directus : ${DIRECTUS_URL}`);
  await waitForDirectus();
  accessToken = await getAccessToken();

  for (const collection of collections) {
    await ensureCollection(collection);
  }

  await upsertMany("projects", projects, ["slug"]);
  await upsertMany("experiences", experiences, ["title", "organization"]);
  await upsertMany("skills", skills, ["name", "category"]);
  await upsertMany("certifications", certifications, ["name", "issuer"]);
  await upsertSingleton("about", about);
  await upsertSingleton("settings", settings);

  await ensurePublicReadPermissions(["projects", "experiences", "skills", "certifications", "about", "settings", "directus_files"]);
  console.log("Seed terminé sans duplication.");
}

async function loadEnv() {
  try {
    const raw = await readFile(new URL(".env", import.meta.url), "utf8");
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const [key, ...value] = line.split("=");
          return [key, value.join("=")];
        })
    );
  } catch {
    return {};
  }
}

async function waitForDirectus() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const res = await fetch(`${DIRECTUS_URL}/server/health`);
      if (res.ok) return;
    } catch {
      // Directus démarre encore, on retente calmement.
    }

    await sleep(2000);
    process.stdout.write(".");
  }

  throw new Error("Directus n'a pas répondu sur /server/health après 120 secondes.");
}

async function getAccessToken() {
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    try {
      return await login();
    } catch (error) {
      if (!ADMIN_TOKEN) throw error;
      console.warn(`Login admin impossible, tentative avec ADMIN_TOKEN: ${error.message}`);
    }
  }

  if (ADMIN_TOKEN) return ADMIN_TOKEN;

  throw new Error("Aucun acces admin disponible pour le seed. Configure ADMIN_EMAIL/ADMIN_PASSWORD ou ADMIN_TOKEN.");
}

async function login() {
  const json = await request("/auth/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  });

  const token = json.data?.access_token;
  if (!token) {
    throw new Error("Connexion Directus reussie sans access_token. Configure ADMIN_TOKEN ou verifie les identifiants admin.");
  }

  return token;
}

async function ensureCollection(collection) {
  const exists = await request(`/collections/${collection.name}`, { allow404: true });

  if (!exists) {
    await request("/collections", {
      method: "POST",
      body: {
        collection: collection.name,
        meta: {
          collection: collection.name,
          icon: collection.icon,
          note: collection.note,
          singleton: Boolean(collection.singleton)
        },
        schema: {},
        fields: [primaryKeyField()]
      }
    });
    console.log(`Collection créée : ${collection.name}`);
  }

  for (const field of collection.fields) {
    await ensureField(collection.name, field);
  }
}

async function ensureField(collection, field) {
  const exists = await request(`/fields/${collection}/${field.field}`, { allow404: true });

  if (exists) return;

  await request(`/fields/${collection}`, {
    method: "POST",
    body: field
  });
  console.log(`Champ créé : ${collection}.${field.field}`);
}

async function upsertMany(collection, rows, uniqueFields) {
  for (const row of rows) {
    const query = uniqueFields.map((field) => `filter[${field}][_eq]=${encodeURIComponent(row[field])}`).join("&");
    const existing = await request(`/items/${collection}?${query}&limit=1`);
    const item = existing.data?.[0];

    if (item?.id) {
      await request(`/items/${collection}/${item.id}`, { method: "PATCH", body: row });
    } else {
      await request(`/items/${collection}`, { method: "POST", body: row });
    }
  }
}

async function upsertSingleton(collection, row) {
  const existing = await request(`/items/${collection}`, { allow404: true });

  if (existing?.data?.id) {
    await request(`/items/${collection}`, { method: "PATCH", body: row });
  } else {
    await request(`/items/${collection}`, { method: "POST", body: row });
  }
}

async function ensurePublicReadPermissions(collectionNames) {
  const policies = await request("/policies?limit=-1", { allow404: true });
  const publicPolicy = policies?.data?.find((policy) => {
    const name = String(policy.name || "").toLowerCase();
    return policy.icon === "public" || name === "public" || policy.name === "$t:public_label";
  });

  if (!publicPolicy?.id) {
    throw new Error("Impossible de trouver la policy publique Directus.");
  }

  for (const collection of collectionNames) {
    const query = `/permissions?filter[policy][_eq]=${publicPolicy.id}&filter[collection][_eq]=${collection}&filter[action][_eq]=read&limit=1`;
    const existing = await request(query);
    const body = {
      policy: publicPolicy.id,
      collection,
      action: "read",
      permissions: null,
      validation: null,
      presets: null,
      fields: ["*"]
    };

    if (existing.data?.[0]?.id) {
      await request(`/permissions/${existing.data[0].id}`, { method: "PATCH", body });
    } else {
      await request("/permissions", { method: "POST", body });
    }
  }
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (options.allow404 && res.status === 404) return null;

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} -> ${res.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

function primaryKeyField() {
  return {
    field: "id",
    type: "integer",
    meta: { hidden: true, readonly: true, interface: "input", sort: 1 },
    schema: {
      is_primary_key: true,
      has_auto_increment: true,
      data_type: "integer",
      is_nullable: false
    }
  };
}

function stringField(field, note, options = {}) {
  return {
    field,
    type: "string",
    meta: { interface: "input", note, width: "full", required: !options.nullable },
    schema: {
      data_type: "varchar",
      max_length: 255,
      is_nullable: Boolean(options.nullable),
      is_unique: Boolean(options.unique)
    }
  };
}

function textField(field, note, options = {}) {
  return {
    field,
    type: "text",
    meta: { interface: options.interfaceName || "input-multiline", note, width: "full" },
    schema: { data_type: "text", is_nullable: true }
  };
}

function integerField(field, note) {
  return {
    field,
    type: "integer",
    meta: { interface: "input", note, width: "half" },
    schema: { data_type: "integer", is_nullable: false, default_value: 0 }
  };
}

function booleanField(field, note, defaultValue = false) {
  return {
    field,
    type: "boolean",
    meta: { interface: "boolean", note, width: "half" },
    schema: { data_type: "boolean", is_nullable: false, default_value: defaultValue }
  };
}

function jsonField(field, note) {
  return {
    field,
    type: "json",
    meta: { interface: "tags", note, width: "full" },
    schema: { data_type: "json", is_nullable: true }
  };
}

function selectField(field, note, choices, defaultValue = choices[0]) {
  return {
    field,
    type: "string",
    meta: {
      interface: "select-dropdown",
      note,
      width: "half",
      options: {
        choices: choices.map((choice) => ({ text: choice, value: choice }))
      }
    },
    schema: { data_type: "varchar", max_length: 255, is_nullable: false, default_value: defaultValue }
  };
}

function fileField(field, note, interfaceName) {
  return {
    field,
    type: "uuid",
    meta: {
      interface: interfaceName,
      special: ["file"],
      note,
      width: "full"
    },
    schema: { data_type: "char", max_length: 36, is_nullable: true }
  };
}

function timestampField(field, note, special) {
  return {
    field,
    type: "timestamp",
    meta: {
      interface: "datetime",
      special: [special],
      readonly: true,
      note,
      width: "half",
      hidden: true
    },
    schema: { data_type: "datetime", is_nullable: true }
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
