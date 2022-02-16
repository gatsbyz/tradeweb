import autoBind from "auto-bind";
import { isNumber } from "lodash";
import Err from "err";
import HTTP_STATUS from "http-status";

import { Orders as RecordsService } from "@/services/orders";
import { Order } from "@/models/order";
import { CreateOrder } from "@/requests/CreateOrder";
import { assertProperties } from "../utils";

interface ServicesInterface {
  records: RecordsService;
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
    const order = new CreateOrder(request.body);

    return this.services.records.create(Order.create(order));
  }

  /**
   * Batch create record
   *
   * @param {Request} request
   * @returns {Order[]}
   */
  batchCreate(request): Order[] {
    const records = request.body.map((body) => new CreateOrder(body));
    return records.map((record: Order) =>
      this.services.records.create(Order.create(record))
    );
  }

  /**
   * Get record
   *
   * @param {Request} request
   * @returns {Promise<Order>}
   */
  async get(request): Promise<Order> {
    assertProperties(request.locals, ["user"]);
    assertProperties(request.params, ["recordId"]);
    const { recordId }: { recordId: string } = request.params;

    // await this.services.records.assertUserRecord(recordId, user.id);

    const record = await this.services.records.get(recordId);

    if (!record) {
      throw new Err("record not found", HTTP_STATUS.NOT_FOUND);
    }

    return record;
  }

  /**
   * Patch record
   *
   * @param {Request} request
   * @returns {Promise<Order>}
   */
  async patch(request): Promise<Order> {
    assertProperties(request.locals, ["user"]);
    assertProperties(request.params, ["recordId"]);
    const { recordId }: { recordId: string } = request.params;

    const { value } = request.body;

    if (!isNumber(value)) {
      throw new Err("value must be a number", HTTP_STATUS.BAD_REQUEST);
    }

    // await this.services.records.assertUserRecord(recordId, user.id);

    return this.services.records.patch(recordId, value);
  }

  /**
   * Remove record
   *
   * @param {Request} request
   * @returns {Promise<void>}
   */
  async remove(request): Promise<void> {
    assertProperties(request.locals, ["user"]);
    // const { user }: { user: UserModel } = request.locals;
    assertProperties(request.params, ["recordId"]);
    // const { recordId }: { recordId: string } = request.params;

    // await this.services.records.assertUserRecord(recordId, user.id);
  }
}
