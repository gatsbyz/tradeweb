import { Order } from "@/models/order";
import { Limit as LimitModel } from "@/models/limit";

import { RedBlackTree } from "@/services/redblacktree";
import { Trades } from "@/services/trades";

interface ServiceInterface {
  trades: Trades;
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

    if (limitEntry[limitPrice.toString()] && limitEntry[limitPrice.toString()][checkSide]) {
      let checkLimit = limitEntry[limitPrice.toString()][checkSide];
      let filledQuantity = 0;
      let toBeFilledOrder = checkLimit.meta.head;
      while (order.quantity > filledQuantity) {
        console.log('order', order);
        console.log('quantity', order.quantity, filledQuantity, toBeFilledOrder.quantity, toBeFilledOrder.filledQuantity);
        console.log('toBeFilledOrder', toBeFilledOrder);
        if (order.quantity <= (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity)) {
          toBeFilledOrder.filledQuantity += order.quantity
          filledQuantity += order.quantity;
          checkLimit.totalQuantity -= order.quantity;
          order.filledQuantity += order.quantity;
          // break
          this.services.trades.create({
            ticker: order.ticker,
            price: order.limitPrice,
            quantity: order.quantity,
            buyer: order.side === 'buy' ? order.trader : toBeFilledOrder.trader,
            seller: order.side === 'sell' ? order.trader : toBeFilledOrder.trader,
          })
        } else {
          toBeFilledOrder.filledQuantity = toBeFilledOrder.quantity;
          toBeFilledOrder.status = 'completed'
          filledQuantity += (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity);
          checkLimit.totalQuantity -= (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity);
          order.filledQuantity += (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity);
          this.services.trades.create({
            ticker: order.ticker,
            price: order.limitPrice,
            quantity: (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity),
            buyer: order.side === 'buy' ? order.trader : toBeFilledOrder.trader,
            seller: order.side === 'sell' ? order.trader : toBeFilledOrder.trader,
          })

          toBeFilledOrder = toBeFilledOrder.next;
          checkLimit.meta.head = toBeFilledOrder;
          if (toBeFilledOrder) {
            toBeFilledOrder.prev = null;
          }
          if (filledQuantity === 0 && order.quantity > filledQuantity) {
            checkLimit = checkLimit.parent; // more logic here.
          }
        }
      }
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
    this.checkOrder(order);
    if (!limitEntry[limitPrice.toString()] || !limitEntry[limitPrice.toString()][order.side]) {
      newLimit.meta.head = order;
      newLimit.meta.tail = order;
      newLimit.totalQuantity = order.quantity - order.filledQuantity;
      limitEntry[limitPrice.toString()] = {
        [order.side]: newLimit
      };
      // add to limit tree
      if (order.side === 'buy') {
        this.buyTree.add(newLimit);
      } else {
        this.sellTree.add(newLimit);
      }
    } else { // if order is open ...?
      limitEntry[limitPrice.toString()][order.side].meta.tail.next = order;
      limitEntry[limitPrice.toString()][order.side].totalQuantity += (order.quantity - order.filledQuantity);
      order.prev = limitEntry[limitPrice.toString()][order.side].tail;
    }
  }
  
}
