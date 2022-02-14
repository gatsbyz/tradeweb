/* eslint no-process-exit: "off" */

import debug from "debug";
import * as app from "./app";
import ConfigLoader from "./configLoader";
import { Server } from "./server";

const log = debug("error");

const { ServiceManager } = app;
const startingConfig = ConfigLoader.load();

(async (): Promise<void> => {
  const serviceManager = new ServiceManager(startingConfig);
  const server = new Server(serviceManager);

  // Graceful shutdown from SIGTERM
  process.on("SIGTERM", async () => {
    log("SIGTERM received stopping server...");

    await server.stop();
    process.exit(0);
  });

  process.on("unhandledRejection", (r, p) => {
    log("Unhandled rejection at: ", p);
    process.exit(1);
  });

  await server.start();
})();
