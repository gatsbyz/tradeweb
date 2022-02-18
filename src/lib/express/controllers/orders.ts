import autoBind from "auto-bind";
// import { isNumber } from "lodash";
// import Err from "err";
// import HTTP_STATUS from "http-status";

import { Orders as OrdersService } from "@/services/orders";
import { Order } from "@/models/order";
// import { assertProperties } from "../utils";

interface ServicesInterface {
  orders: OrdersService;
}

/**
 * @class
 */
export class Orders {
  private readonly services: ServicesInterface;

  /**
   * @param {ServicesInterface} services
   * @param {any} config
   * @param {boolean} doAutoBind
   */
  constructor(services: ServicesInterface, config?, doAutoBind = true) {
    this.services = services;

    if (doAutoBind) {
      autoBind(this);
    }
  }

  /**
   * Create record
   *
   * @param {Request} request
   * @returns {Promise<Order>}
   */
  create(request): Order {
    return this.services.orders.create(request.body);
  }

  /**
   * Batch create record
   *
   * @param {Request} request
   * @returns {Order[]}
   */
  batchCreate(request): Order[] {
    return request.body.map((order: Order) =>
      this.services.orders.create(order)
    );
  }

  // /**
  //  * Get record
  //  *
  //  * @param {Request} request
  //  * @returns {Promise<Order>}
  //  */
  // async get(request): Promise<Order> {
  //   assertProperties(request.locals, ["user"]);
  //   assertProperties(request.params, ["recordId"]);
  //   const { recordId }: { recordId: string } = request.params;
  //
  //   // await this.services.records.assertUserRecord(recordId, user.id);
  //
  //   const record = await this.services.records.get(recordId);
  //
  //   if (!record) {
  //     throw new Err("record not found", HTTP_STATUS.NOT_FOUND);
  //   }
  //
  //   return record;
  // }
  //
  // /**
  //  * Patch record
  //  *
  //  * @param {Request} request
  //  * @returns {Promise<Order>}
  //  */
  // async patch(request): Promise<Order> {
  //   assertProperties(request.locals, ["user"]);
  //   assertProperties(request.params, ["recordId"]);
  //   const { recordId }: { recordId: string } = request.params;
  //
  //   const { value } = request.body;
  //
  //   if (!isNumber(value)) {
  //     throw new Err("value must be a number", HTTP_STATUS.BAD_REQUEST);
  //   }
  //
  //   // await this.services.records.assertUserRecord(recordId, user.id);
  //
  //   return this.services.records.patch(recordId, value);
  // }
  //
  // /**
  //  * Remove record
  //  *
  //  * @param {Request} request
  //  * @returns {Promise<void>}
  //  */
  // async remove(request): Promise<void> {
  //   assertProperties(request.locals, ["user"]);
  //   // const { user }: { user: UserModel } = request.locals;
  //   assertProperties(request.params, ["recordId"]);
  //   // const { recordId }: { recordId: string } = request.params;
  //
  //   // await this.services.records.assertUserRecord(recordId, user.id);
  // }
}
