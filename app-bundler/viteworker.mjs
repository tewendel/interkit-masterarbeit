import express from "express";
import cluster from "cluster";
import fs from "fs";
import http from "http";
import { createServer as createViteServer } from "vite";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

const port = Number(process.env.PORT) || 8000;
const projectPath = process.env.PROJECT_PATH || process.cwd();
const pathPrefix = process.env.PATH_PREFIX || "";
const interkitPath = process.env.INTERKIT_PATH || ".";

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return html.replace(/<\/head>/, `<base href='/${pathPrefix}/'></head>`);
    },
  };
};

async function createServer() {
  const app = express();

  // Start the server
  const server = app.listen(port, () => {
    console.log(
      `[Vite Worker ${cluster?.worker?.id}] Running on port ${port}`
    );
    //console.log(`Server projectPath: ${projectPath}`);
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    root: projectPath,
    //configFile: false,
    plugins: [htmlPlugin()],
    base: `/${pathPrefix}`,
    server: {
      base: `/${pathPrefix}`,
      middlewareMode: true,
      hmr: {
        server,
      },
      fs: {
        allow: [
          projectPath,
          interkitPath,
          '/var/packages/interkit' // for dockerized environment
        ],
      },
    },
    appType: "spa", // don't include Vite's default HTML handling middlewares
  });

  app.use("*", async (req, res, next) => {
    req.url = req.headers["x-forwarded-url"] || req.url;
    //console.log(`Worker ${cluster?.worker?.id} serving request`, req.url);
    next();
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use("/", express.static(projectPath));
}

createServer();
