import { Order } from "@/models/order";
import { Limit as LimitModel } from "@/models/limit";

import { RedBlackTree } from "@/services/redblacktree";
import { Trades } from "@/services/trades";
import { Trade } from "@/models/trade";

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

    let filledQuantity = 0;
    let checkLimit;
    let toBeFilledOrder
    if (limitEntry[limitPrice.toString()] && limitEntry[limitPrice.toString()][checkSide]) {
      checkLimit = limitEntry[limitPrice.toString()][checkSide];
      toBeFilledOrder = checkLimit.head;
    } else {
      // find nearest value
      const treeToLook = checkSide === 'buy' ? this.buyTree : this.sellTree;
      let value;
      if (checkSide === 'buy') {
        value = treeToLook.searchGreater(treeToLook.root, order.limitPrice, Number.POSITIVE_INFINITY);
      } else {
        value = treeToLook.searchLess(treeToLook.root, order.limitPrice, Number.NEGATIVE_INFINITY);
      }
      if (checkSide === 'buy' && value < Number.POSITIVE_INFINITY ||
        checkSide === 'sell' && value > Number.NEGATIVE_INFINITY ) {
        checkLimit = limitEntry[value][checkSide];
        toBeFilledOrder = checkLimit.head;
      }
    }
    while (order.quantity > filledQuantity && toBeFilledOrder) {
        if (order.quantity < (toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity)) {
          toBeFilledOrder.filledQuantity += order.quantity
          filledQuantity += order.quantity;
          checkLimit.totalQuantity -= order.quantity;
          order.filledQuantity += order.quantity;
          // break
          this.services.trades.create(new Trade({
            ticker: order.ticker,
            price: order.limitPrice,
            quantity: order.quantity,
            buyer: order.side === 'buy' ? order.trader : toBeFilledOrder.trader,
            seller: order.side === 'sell' ? order.trader : toBeFilledOrder.trader,
          }))
        } else {
          const newAddedQuantity = toBeFilledOrder.quantity - toBeFilledOrder.filledQuantity;
          toBeFilledOrder.filledQuantity = toBeFilledOrder.quantity; // fill to end
          toBeFilledOrder.status = 'completed';
          filledQuantity += newAddedQuantity;
          checkLimit.totalQuantity -= newAddedQuantity;
          order.filledQuantity += newAddedQuantity;
          this.services.trades.create(new Trade({
            ticker: order.ticker,
            price: toBeFilledOrder.limitPrice,
            quantity: newAddedQuantity,
            buyer: order.side === 'buy' ? order.trader : toBeFilledOrder.trader,
            seller: order.side === 'sell' ? order.trader : toBeFilledOrder.trader,
          }))

          if (order.quantity > filledQuantity) {
            toBeFilledOrder = toBeFilledOrder.next;
            checkLimit.setHead(toBeFilledOrder);
            if (toBeFilledOrder) {
              toBeFilledOrder.prev = null;
            }
            // console.log('toBeFilledOrder', toBeFilledOrder, checkLimit, filledQuantity);
            if (checkLimit.totalQuantity === 0 && order.quantity > filledQuantity) { //  add logic for SSS B sweep
              checkLimit = checkLimit.right ? checkLimit.right : checkLimit.parent;
              if (checkLimit) {
                toBeFilledOrder = checkLimit.head;
              }
            }
          }
        }
      }
    if (order.quantity === filledQuantity) {
      order.status = 'completed';
    }
  }

  update(order: Order): any {
    if (!this.limitTable[order.ticker]) {
      this.limitTable[order.ticker] = {};
    }
    const limitEntry = this.limitTable[order.ticker];
    const limitPrice = order.limitPrice;
    this.checkOrder(order);
    if (!limitEntry[limitPrice.toString()] || !limitEntry[limitPrice.toString()][order.side]) {
      const newLimit: LimitModel = LimitModel.create({
        limitPrice
      });
      newLimit.setHead(order);
      newLimit.setTail(order);
      newLimit.totalQuantity = order.quantity - order.filledQuantity;
      limitEntry[limitPrice.toString()] = {
        ...limitEntry[limitPrice.toString()],
        [order.side]: newLimit
      };
      // add to limit tree
      if (order.side === 'buy') {
        this.buyTree.add(newLimit);
      } else {
        this.sellTree.add(newLimit);
      }
    } else { // if order is open ...?
      limitEntry[limitPrice.toString()][order.side].getTail().setNext(order);
      limitEntry[limitPrice.toString()][order.side].totalQuantity += (order.quantity - order.filledQuantity);
      order.prev = limitEntry[limitPrice.toString()][order.side].tail;
    }
  }
  
}
