import * as expressControllers from "@/express/controllers";
import * as expressMiddleware from "@/express/middleware";
import { Book } from "@/services/book";
import { Limits } from "@/services/limits";
import { Orders } from "@/services/orders";
import { Trades } from "@/services/trades";
import { ConfigInterface } from "@/config";

import { ResponseBuilder } from "@/lib/express/responseBuilder";
import { createAndWrapClasses } from "instawrap";

export interface ServicesInterface {
  records: Orders;
  responseBuilder: ResponseBuilder;
}

export interface ExpressMiddlewareInterface {
  exceptionHandler: expressMiddleware.ExceptionHandler;
}

export interface ExpressControllersInterface {
  orders: expressControllers.Orders;
  trades: expressControllers.Trades;
  book: expressControllers.Book;
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

    const trades = new Trades();
    const book = new Book();
    const limits = new Limits({
      trades,
      book,
    });

    const records = new Orders({
      // users,
      limits,
    });

    return {
      records,
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
    const { responseBuilder } = services;

    return {
      exceptionHandler: new expressMiddleware.ExceptionHandler({
        responseBuilder,
      }),
    };
  }
}
