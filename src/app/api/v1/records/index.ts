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
  router.put("/", controllers.records.create);
  router.put("/batch", controllers.records.batchCreate);
  router.put("/:recordId", controllers.records.patch);
  router.delete("/:recordId", controllers.records.remove);
  return router;
};
