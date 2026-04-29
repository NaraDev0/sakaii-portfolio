import http from "node:http";
import { about, certifications, experiences, projects, settings, skills } from "../seed-data.mjs";

const port = Number(process.env.MOCK_DIRECTUS_PORT || 8055);

const collections = {
  projects: projects.filter((project) => project.visibility === "published").sort(bySort),
  experiences: [...experiences].sort(bySort),
  skills: [...skills].sort(bySort),
  certifications: [...certifications].sort(bySort),
  about,
  settings
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (url.pathname === "/server/health") {
    return send(res, { status: "ok" });
  }

  const match = url.pathname.match(/^\/items\/([^/]+)$/);
  if (match) {
    const data = collections[match[1]];
    if (data) return send(res, { data });
  }

  res.statusCode = 404;
  send(res, { errors: [{ message: "Not found" }] });
});

server.listen(port, () => {
  console.log(`Mock Directus prêt sur http://localhost:${port}`);
});

function send(res, payload) {
  res.end(JSON.stringify(payload));
}

function bySort(a, b) {
  return Number(a.sort || 0) - Number(b.sort || 0);
}
