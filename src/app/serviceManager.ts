import * as expressControllers from "@/express/controllers";
import * as expressMiddleware from "@/express/middleware";
import { Records } from "@/services/records";
import { Users } from "@/services/users";
import { ConfigInterface } from "@/config";

import { ResponseBuilder } from "@/lib/express/responseBuilder";
import { createAndWrapClasses } from "instawrap";
import { CentralLimitOrderBook } from "@/services/centralLimitOrderBook";

export interface ServicesInterface {
  records: Records;
  users: Users;
  responseBuilder: ResponseBuilder;
}

export interface ExpressMiddlewareInterface {
  exceptionHandler: expressMiddleware.ExceptionHandler;
  user: expressMiddleware.User;
}

export interface ExpressControllersInterface {
  user: expressControllers.User;
  records: expressControllers.Records;
}

/**
 * @class
 */
export class ServiceManager {
  readonly config: ConfigInterface;

  readonly services: ServicesInterface;

  readonly expressMiddleware: ExpressMiddlewareInterface;

  readonly expressControllers: ExpressControllersInterface;

  /**
   * @param {Config} config service configuration
   */
  constructor(config: ConfigInterface) {
    this.config = config;
    this.services = ServiceManager.buildServices(this.config);
    this.expressMiddleware = ServiceManager.buildExpressMiddleware(
      config,
      this.services
    );
    this.expressControllers = ServiceManager.buildExpressControllers(
      config,
      this.services
    );
  }

  /**
   * Build services
   *
   * @param {ClientsInterface} clients
   * @param {ConfigInterface} config
   * @returns {ServicesInterface}
   */
  static buildServices(config: ConfigInterface): ServicesInterface {
    const responseBuilder = new ResponseBuilder({});

    const users = new Users();
    const centralLimitOrderBook = new CentralLimitOrderBook();

    const records = new Records({
      users,
      centralLimitOrderBook,
    });

    return {
      records,
      users,
      responseBuilder,
    };
  }

  /**
   * Build all controllers
   *
   * @param {ConfigInterface} config
   * @param {ServicesInterface} services
   * @returns {ExpressControllersInterface}
   */
  static buildExpressControllers(
    config: ConfigInterface,
    services: ServicesInterface
  ): ExpressControllersInterface {
    const controllerInstances = createAndWrapClasses(
      (func) => services.responseBuilder.wrap(func),
      expressControllers,
      services,
      {
        ...config,
      }
    );

    return {
      ...controllerInstances,
    };
  }

  /**
   * Build all middleware
   *
   * @param {ConfigInterface} config
   * @param {ServicesInterface} services
   * @returns {ExpressMiddlewareInterface}
   */
  static buildExpressMiddleware(
    config: ConfigInterface,
    services: ServicesInterface
  ): ExpressMiddlewareInterface {
    const { responseBuilder, users } = services;

    return {
      exceptionHandler: new expressMiddleware.ExceptionHandler({
        responseBuilder,
      }),
      user: new expressMiddleware.User({ users, responseBuilder }),
    };
  }
}