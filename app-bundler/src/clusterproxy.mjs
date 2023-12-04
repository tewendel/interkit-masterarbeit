import http from "http";
import net from "net";
import cluster from "cluster";

let _portrange = [8001, 8100];
let workerIdCounter = 0;

const debug = false

function initCluster({ settings, portrange, app, server }) {
  cluster.settings = { ...cluster.settings, ...settings };

  if (portrange) {
    _portrange = portrange;
  }

  //const server = http.createServer(app)

  app.use("/", (req, res, next) => {
    if (debug) console.log("primary request", req.url, "baseUrl", req.baseUrl);

    const worker = selectWorker(req, cluster.workers);

    if (worker) {
      if (debug) console.log("redirecting request to worker", worker.id, "-", req.url);
      const targetPort = worker.port;
      // remove the port number from the host
      //req.headers.host = req.headers.host.replace(/:\d+$/, '')
      // remove pathPrefix at the beginning of the url
      const forwardedUrl = req.url
        .replace(worker.pathPrefix, "")
        .replace("//", "/");
      const proxy = http.request(
        {
          ...req,
          host: "localhost",
          port: targetPort,
          headers: {
            ...req.headers,
            "X-Forwarded-Url": forwardedUrl,
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        }
      );

      req.pipe(proxy, { end: true });

      proxy.on("error", (err) => {
        console.error("Error while proxying request:", err);
        res.writeHead(500);
        res.end("Internal server error");
      });
    } else {
      next();
      //res.writeHead(404)
      //res.end('Not Found (primary)')
    }
  });

  // WebSocket proxy
  server.on("upgrade", (req, socket, head) => {
    if (debug) console.log("websocket upgrade request", req.url);
    // Custom logic to select a worker based on the request
    const selectedWorker = selectWorker(req, cluster.workers);

    if (!selectedWorker) {
      if (debug) console.log("no worker found for websocket upgrade request", req.url);
      // ignore this request
      return;
    }

    const targetPort = selectedWorker.port;

      if (debug) {
        console.log(
          "redirecting websocket upgrade request to worker",
          selectedWorker.id,
          "-",
          req.url
        );
      }

    // Create a socket to forward the request to the worker
    const workerSocket = net.connect(targetPort, "localhost", () => {
      // Forward the upgrade request headers to the worker
      workerSocket.write(
        `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
          `${req.rawHeaders
            .map((v, i) => (i % 2 === 0 ? `${v}: ` : `${v}\r\n`))
            .join("")}` +
          "\r\n",
        "utf-8"
      );

      // Forward the remaining data to the worker
      workerSocket.write(head);

      // Pipe the sockets together
      socket.pipe(workerSocket).pipe(socket);

      /*workerSocket.on("error", (err) => {
        console.error("Error while proxying websocket upgrade request:", err);
        socket.destroy();
      });
      */
      workerSocket.on("end", () => {
        console.log("Worker socket ended");
        socket.end();
      });
      workerSocket.on("close", () => {
        console.log("Worker socket closed");
        socket.destroy();
      });
    });
  });

  process.on('exit', (code) => {
    console.log(`Master process exited with code ${code} – removing all workers`);
    for (const worker of Object.values(cluster.workers)) {
      //console.log("Gonna kill worker", worker.id);
      worker.kill();
    }
  });

  return cluster.workers;
  
}

function selectWorker(req, workers) {
  const selectedWorker = Object.values(workers).find(
    (worker) =>
      req.url.startsWith("/" + worker.pathPrefix) &&
      worker.isConnected() &&
      !worker.isDead() &&
      !worker.beingKilled
  );

  if (selectedWorker) {
    if (debug) {
      console.log(
        "selected worker",
        selectedWorker.id,
        "for path url",
        req.url
      );
    }
    return selectedWorker;
  }
}

function getUnusedPort() {
  //console.log("checking port", Object.values(cluster.workers).map((w) => w.port + " " + w.state + " " + w.isDead() + " " + w.isConnected()));
  for (let port = _portrange[0]; port <= _portrange[1]; port++) {
    if (
      !Object.values(cluster.workers).find((worker) => worker.port === port && worker.isConnected() && !worker.isDead())
    ) {
      return port;
    }
  }
  throw new Error("No more ports available");
}

function addWorker({ pathPrefix, env, id }) {
  const workerPort = getUnusedPort();

  const worker = cluster.fork({
    ...env,
    PATH_PREFIX: pathPrefix,
    PORT: workerPort,
  });
  worker.pathPrefix = pathPrefix;
  worker.id = id || workerIdCounter++;
  worker.port = workerPort;
  console.log(
    "Vite Worker",
    worker.id,
    "started on port",
    workerPort,
    "with path prefix",
    pathPrefix,
    "pid",
    worker.process.pid
  );

    worker.on("exit", (code, signal) => {
      if (signal) {
        console.log(
          `Vite Worker ${worker.id} was terminated by signal: ${signal}.`
        );
      } else if (code === 0) {
        console.log(`Vite Worker ${worker.id} exited with code: ${code}.`);
      } /*else {
        console.log(
          `Vite Worker ${worker.id} died with code: ${code} and signal: ${signal}. Restarting in 10s...`
        );
        setTimeout(() => {
          addWorker({ pathPrefix, env, id });
        }, 10000);
      }*/
    });

    worker.on("error", (error) => {
      console.error(`Error in worker ${worker.id}:`, error);

    });

  return worker;
}

function removeWorker(workerId) {
  for (let worker of Object.values(cluster.workers)) {
    if (worker.id === workerId && worker.isConnected() && !worker.isDead() && !worker.beingKilled)
    {
      worker.beingKilled = true;
      worker.kill();
      console.log("Killing worker", worker.id);
    }
  }
}

export { initCluster, addWorker, removeWorker };
