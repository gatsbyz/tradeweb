import { Router } from "express";

import {
  ExpressControllersInterface,
  ExpressMiddlewareInterface,
} from "@/serviceManager";

import orders from "./orders";

export default (
  middleware: ExpressMiddlewareInterface,
  controllers: ExpressControllersInterface
): Router => {
  const router = Router();
  router.use("/trades", orders(middleware, controllers));

  return router;
};
