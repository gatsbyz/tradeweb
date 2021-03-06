import { Router } from "express";

import {
  ExpressControllersInterface,
  ExpressMiddlewareInterface,
} from "@/serviceManager";

import book from "./book";
import orders from "./orders";
import trades from "./trades";

export default (
  middleware: ExpressMiddlewareInterface,
  controllers: ExpressControllersInterface
): Router => {
  const router = Router();
  router.use("/book", book(middleware, controllers));
  router.use("/orders", orders(middleware, controllers));
  router.use("/trades", trades(middleware, controllers));

  return router;
};
