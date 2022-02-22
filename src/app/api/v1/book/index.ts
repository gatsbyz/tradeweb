import { Router } from "express";

import {
  ExpressControllersInterface,
  ExpressMiddlewareInterface,
} from "@/serviceManager";

export default (
  middleware: ExpressMiddlewareInterface,
  controllers: ExpressControllersInterface
): Router => {
  const router = Router();
  router.get("/symbols", controllers.book.getSymbols);
  router.get("/topOfTheBook", controllers.book.getTopOfTheBook);
  return router;
};
