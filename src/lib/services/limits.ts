import { Order } from "@/models/order";
import { Limit, Limit as LimitModel } from "@/models/limit";

import { CLOB } from "@/services/clob";
import { RedBlackTree } from "@/services/redblacktree";

interface ServiceInterface {
  clob: CLOB;
}

interface LimitsTable {
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
export class Limits {
  private readonly services: ServiceInterface;

  limitTable: LimitsTable = {};
  buyTree: RedBlackTree;
  sellTree: RedBlackTree;


  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor(services: ServiceInterface) {
    this.services = services;
    this.buyTree = new RedBlackTree();
    this.sellTree = new RedBlackTree();
  }

  checkOrder(order: Order) {
    const limitEntry = this.limitTable[order.ticker];
    const limitPrice = order.limitPrice;
    const checkSide = order.side === 'buy' ? 'sell' : 'buy';

    if (!limitEntry[limitPrice.toString()] || !limitEntry[limitPrice.toString()][checkSide]) {

    }
  }

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
      if (order.side === 'buy') {
        this.buyTree.add(newLimit);
      } else {
        this.sellTree.add(newLimit);
      }
    } else {
      limitEntry[limitPrice.toString()][order.side].meta.tail.next = order;
      order.prev = limitEntry[limitPrice.toString()][order.side].tail;
    }
  }
  
}
