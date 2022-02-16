import { Order } from "@/models/order";

import Err from "err";
import HTTP_STATUS from "http-status";
import { DateTime } from "luxon";
import { Limits } from "@/services/limits";

interface ServiceInterface {
  limits: Limits;
}

export class Orders {
  orders: Record<string, Order> = {};

  private readonly services: ServiceInterface;

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor(services: ServiceInterface) {
    this.services = services;
  }

  /**
   * Assert that user exists
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  // async assertUserExists(userId: string): Promise<void> {
  //   if (!(await this.services.users.exists(userId))) {
  //     throw new Err(`user: ${userId} not found`, HTTP_STATUS.NOT_FOUND);
  //   }
  // }

  /**
   * Assert that user owns record
   *
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async assertUserRecord(id: string): Promise<void> {
    const record = await this.get(id);

    if (!record) {
      throw new Err("record not found", HTTP_STATUS.BAD_REQUEST);
    }
  }

  create(order: Order): Order {
    // await this.assertUserExists(record.trader); // useful
    this.orders[order.id] = order;
    this.services.limits.update(order);

    // return prev/next to attach to order
    return order;
  }

  /**
   * Get record
   *
   * @param {string} id
   * @returns {Promise<Order | null>}
   */
  async get(id: string): Promise<Order | null> {
    // return this.services.firestore.get(id);
    return null;
  }

  /**
   * Patch field on record
   *
   * @param {string} id
   * @param {number} value
   * @param {Date} curDate
   * @returns {Promise<Order>}
   */
  async patch(
    id: string,
    value: number,
    curDate = DateTime.utc().toJSDate()
  ): Promise<Order> {
    // const updated = await this.services.firestore.patch(id, { value }, curDate);
    //
    // await this.services.events.emit({
    //   namespace: EVENT_NAMESPACES.RECORDS,
    //   action: RECORDS_ACTIONS.UPDATED,
    //   metadata: {
    //     modelId: updated.id,
    //   },
    // });
    //
    // return updated;
    return (null as unknown) as Order;
  }
}
