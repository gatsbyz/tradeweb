import { Order } from "@/models/order";
import { Limit as LimitModel } from "@/models/limit";

// interface ServiceInterface {
//   users: Users;
// }

interface LimitTable {
  [ticker: string]: {
    [price: number]: {
      [side: string]: LimitModel
    }
  }
}

/**
 * @class
 * Example service/dal
 */
export class Limit {
  // private readonly services: ServiceInterface;
  limitTable: LimitTable = {};
  limitOrderbook = {};

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor() {}

  /**
   * Create order in db
   *
   * @param {Order} order
   * @returns {Promise<Order>}
   */
  update(order: Order): any {
    if (!this.limitTable[order.ticker]) {
      this.limitTable[order.ticker] = {};
    }
    const limitEntry = this.limitTable[order.ticker];
    const limitPrice = order.limitPrice;
    const newLimit: LimitModel = LimitModel.create({
      limitPrice
    });
    if (!limitEntry[limitPrice.toString()] || !limitEntry[limitPrice.toString()][order.side]) {
      newLimit.meta.head = order;
      newLimit.meta.tail = order;
      newLimit.totalQuantity = order.quantity;
      limitEntry[limitPrice.toString()] = {
        [order.side]: newLimit
      };
      // add to limit tree
    } else {
      this.limitTable[order.ticker][limitPrice.toString()][order.side].meta.tail.next = order;
      order.prev = this.limitTable[order.ticker][limitPrice.toString()][order.side].tail;
    }
  }
  
}
