import { constants, copyFile, readFileSync, writeFileSync } from "fs";
import { getConnectionById } from "../data/connections";
import { exec } from "child_process";
import * as path from "path";
import Docker from "dockerode";

const baseRepo = process.env.repo;
const nginxPath = "/nginx";
const containersPath = "/containers";

export async function createConnection(id: string) {
  const connection = await getConnectionById(id);

  await cloneWppServer(connection);
  setupWppConfig(connection);
  createNginxConf(connection);
  await runDockerContainer(connection);
  await new Promise((r) => setTimeout(r, 10000));
  await resetNginx();
  await generateToken(connection);
}

function replaceInFile(replaces: { [key: string]: string }, filename: string) {
  let data = readFileSync(filename).toString();
  for (let key in replaces) {
    data = data.replace(key, replaces[key]);
  }

  writeFileSync(filename, data);
}

function cloneWppServer(connection: any) {
  console.log(`Cloning wpp-server in ${containersPath}/${connection.name}`);
  return new Promise((resolve, reject) => {
    try {
      exec(
        `git clone ${baseRepo} ${connection.name}`,
        {
          cwd: containersPath,
        },
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          resolve(stdout);
        }
      );
    } catch (e) {
      console.log("e", e);
    }
  });
}

function setupWppConfig(connection: any) {
  console.log(`Writing instance settings`);

  replaceInFile(
    {
      __SECRET__: connection.secret,
    },
    `${containersPath}/${connection.name}/src/config.ts`
  );

  replaceInFile(
    {
      __PORT__: connection.port,
    },
    `${containersPath}/${connection.name}/docker-compose.yml`
  );
}

async function runDockerContainer(connection: any) {
  console.log(`Running docker from ${connection.name}`);
  return new Promise((resolve, reject) => {
    exec(
      "docker-compose up -d",
      {
        cwd: `${containersPath}/${connection.name}`,
      },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(stdout);
      }
    );
  });
}

function createNginxConf(connection: any) {
  console.log("Setting up nginx conf", connection);
  const confFile = `${nginxPath}/${connection.name}.conf`;

  let data = readFileSync(path.resolve("./base.conf")).toString();
  data = data.replaceAll("__NAME__", connection.name);
  data = data.replace("__PORT__", connection.port);

  writeFileSync(confFile, data);
}

async function resetNginx() {
  console.log(`Restarting nginx`);
  const docker = new Docker();

  const containerNameOrId = process.env.NGINX_CONTAINER;
  const container = docker.getContainer(containerNameOrId);

  try {
    await container.stop();
    await container.start();

    console.log("Nginx restarted.");
  } catch (err) {
    console.log("Nginx restart error");
    console.log(err);
  }
}

async function generateToken(connection: any) {
  return new Promise((resolve, reject) => {
    console.log(`Generating tokent to ${connection.name} instance`);
    exec(
      `curl http://localhost:3000/api/generateToken/${connection.key}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(stdout);
      }
    );
  });
}
