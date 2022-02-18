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
  router.put("/", controllers.orders.create);
  router.put("/batch", controllers.orders.batchCreate);
  // router.put("/:recordId", controllers.orders.patch);
  // router.delete("/:recordId", controllers.orders.remove);
  return router;
};
