import { Router } from "express";

import {
  ExpressControllersInterface,
  ExpressMiddlewareInterface,
} from "@/serviceManager";

import user from "./user";
import records from "./records";

export default (
  middleware: ExpressMiddlewareInterface,
  controllers: ExpressControllersInterface
): Router => {
  const router = Router();
  router.use("/user", user(middleware, controllers));
  router.use("/records", records(middleware, controllers));

  return router;
};
