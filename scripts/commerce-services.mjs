import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const action = process.argv[2] ?? "status";

const services = [
  {
    name: "ohmydress-medusa-postgres",
    image: "postgres:16-alpine",
    args: [
      "-e",
      "POSTGRES_USER=medusa",
      "-e",
      "POSTGRES_PASSWORD=medusa",
      "-e",
      "POSTGRES_DB=ohmydress_medusa",
      "-p",
      "5433:5432",
      "-v",
      `${resolve(rootDir, ".medusa/postgres")}:/var/lib/postgresql/data`,
    ],
    prepare() {
      mkdirSync(resolve(rootDir, ".medusa/postgres"), { recursive: true });
    },
  },
  {
    name: "ohmydress-medusa-redis",
    image: "redis:7-alpine",
    args: ["-p", "6379:6379"],
  },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.status !== 0 && !options.allowFailure) {
    process.exit(result.status ?? 1);
  }

  return result.stdout?.trim() ?? "";
}

function containerExists(name) {
  const output = run(
    "docker",
    ["ps", "-a", "--filter", `name=^/${name}$`, "--format", "{{.Names}}"],
    { capture: true, allowFailure: true }
  );

  return output.split("\n").includes(name);
}

function startService(service) {
  service.prepare?.();

  if (containerExists(service.name)) {
    run("docker", ["start", service.name]);
    return;
  }

  run("docker", [
    "run",
    "-d",
    "--name",
    service.name,
    ...service.args,
    service.image,
  ]);
}

if (action === "start") {
  for (const service of services) {
    startService(service);
  }
  run("docker", [
    "ps",
    "--filter",
    "name=ohmydress-medusa",
    "--format",
    "table {{.Names}}\t{{.Status}}\t{{.Ports}}",
  ]);
} else if (action === "stop") {
  for (const service of services) {
    if (containerExists(service.name)) {
      run("docker", ["stop", service.name]);
    }
  }
} else if (action === "status") {
  run("docker", [
    "ps",
    "-a",
    "--filter",
    "name=ohmydress-medusa",
    "--format",
    "table {{.Names}}\t{{.Status}}\t{{.Ports}}",
  ]);
} else {
  console.error(`Unknown action: ${action}`);
  process.exit(1);
}
