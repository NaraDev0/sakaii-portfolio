import { spawn } from "node:child_process";

const directusURL = process.env.DIRECTUS_URL || "http://directus:8055";

await waitForDirectus();
await run("npm", ["run", "build"]);
await run("npm", ["exec", "--", "serve", "dist", "-l", "4321", "-s"]);

async function waitForDirectus() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const res = await fetch(`${directusURL}/server/health`);
      if (res.ok) return;
    } catch {
      // Directus et le seed peuvent encore être en cours de démarrage.
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Directus indisponible sur ${directusURL}`);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} a échoué avec le code ${code}`));
    });
  });
}
