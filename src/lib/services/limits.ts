import { Order, ORDER_SIDE_TYPE } from "@/models/order";
import { Limit, Limit as LimitModel } from "@/models/limit";

import { RedBlackTree } from "@/services/redblacktree";
import { Trades } from "@/services/trades";
import { Book } from "@/services/book";
import { Trade } from "@/models/trade";

interface ServiceInterface {
  trades: Trades;
  book: Book;
}

interface LimitsTable {
  [ticker: string]: {
    [price: string]: {
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
  buyTree: Record<string, RedBlackTree>;
  sellTree: Record<string, RedBlackTree>;


  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor(services: ServiceInterface) {
    this.services = services;
    this.buyTree = {};
    this.sellTree = {};
  }

  update(order: Order): any {
    this.createTree(order.ticker, order.side)
    this.createLimitTable(order.ticker);

    this.checkOrder(order);
    if (order.status === 'open') {
      this.services.book.updateBook(order.ticker, order.side, order.limitPrice);
    }

    const tree = order.side === 'buy' ? this.buyTree[order.ticker] : this.sellTree[order.ticker]
    const limitEntry = this.limitTable[order.ticker];
    const limitPrice = order.limitPrice;
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
      tree.add(newLimit);
    } else { // if order is open ...?
      const tail = limitEntry[limitPrice.toString()][order.side].getTail();
      if (tail) {
        tail.setNext(order);
      }
      limitEntry[limitPrice.toString()][order.side].totalQuantity += (order.quantity - order.filledQuantity);
      order.prev = limitEntry[limitPrice.toString()][order.side].tail;
    }
  }

  private createTree(ticker: string, side: ORDER_SIDE_TYPE) {
    if (side === ORDER_SIDE_TYPE.BUY && this.buyTree[ticker] === undefined) {
      this.buyTree[ticker] = new RedBlackTree();
    } else if (side === ORDER_SIDE_TYPE.SELL && this.sellTree[ticker] === undefined) {
      this.sellTree[ticker] = new RedBlackTree();
    }
  }

  private createLimitTable(ticker: string) {
    if (!this.limitTable[ticker]) {
      this.limitTable[ticker] = {};
    }
  }

  private findLimit(ticker: string, limitPrice: number, side: string): Limit | undefined {
    const limitEntry = this.limitTable[ticker];
    if (limitEntry[limitPrice.toString()] && limitEntry[limitPrice.toString()][side]) {
      return limitEntry[limitPrice.toString()][side];
    } else {
      const treeToLook = side === ORDER_SIDE_TYPE.BUY ? this.buyTree[ticker] : this.sellTree[ticker];
      if (!treeToLook) {
        return;
      }

      const searchFunction = side === ORDER_SIDE_TYPE.BUY ? treeToLook.searchGreater.name : treeToLook.searchLess.name;
      const value = treeToLook[searchFunction](treeToLook.root, limitPrice,
        side === ORDER_SIDE_TYPE.BUY ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);

      if (side === ORDER_SIDE_TYPE.BUY && value === Number.POSITIVE_INFINITY ||
        side === ORDER_SIDE_TYPE.SELL && value === Number.NEGATIVE_INFINITY ) {
        return;
      }

      return limitEntry[value][side];
    }
  }

  private updateQuantity(quantity, order, overlapOrder, currentLimit) {
    order.filledQuantity += quantity;
    overlapOrder.filledQuantity += quantity;
    currentLimit.totalQuantity -= quantity;
  }

  private checkOrder(order: Order) {

    let filledQuantity = 0;
    let currentLimit: Limit | undefined;
    let overlapOrder

    currentLimit = this.findLimit(order.ticker, order.limitPrice,
      order.side === ORDER_SIDE_TYPE.BUY ? ORDER_SIDE_TYPE.SELL : ORDER_SIDE_TYPE.BUY);
    if (!currentLimit) {
      return;
    }

    while (order.quantity > filledQuantity) {
      if (!currentLimit) {
        break;
      }
      if (currentLimit.totalQuantity > 0) {
        overlapOrder = currentLimit.head;
        const availableOverlapOrderQuantity = overlapOrder.quantity - overlapOrder.filledQuantity;
        const buyer = order.side === 'buy' ? order.trader : overlapOrder.trader;
        const seller = order.side === 'sell' ? order.trader : overlapOrder.trader;
        const orderQuantity = order.quantity - filledQuantity;

        const quantity = orderQuantity < availableOverlapOrderQuantity ? orderQuantity : availableOverlapOrderQuantity;

        this.updateQuantity(quantity, order, overlapOrder, currentLimit);
        filledQuantity += quantity;
        this.services.trades.create(new Trade({
          ticker: order.ticker,
          price: orderQuantity < availableOverlapOrderQuantity ? order.limitPrice : overlapOrder.limitPrice,
          quantity,
          buyer,
          seller,
        }));

        // Overlap order fulfilled completely. Move on to next order.
        if (overlapOrder.quantity === overlapOrder.filledQuantity) {
          overlapOrder.status = 'completed';
          if (currentLimit.totalQuantity === 0 && currentLimit.parent) {
            this.services.book.updateBook(overlapOrder.ticker, overlapOrder.side, currentLimit.parent.limitPrice);
          } else {
            this.services.book.updateBook(overlapOrder.ticker, overlapOrder.side, undefined);
          }
          overlapOrder = overlapOrder.next;
          currentLimit.setHead(overlapOrder);
          if (!overlapOrder) {
            currentLimit.setTail(null);
          }
        }
      } else { // limit does not have any open orders
        //  add logic for SSS B sweep
        const delta = 0.00001;
        currentLimit = this.findLimit(order.ticker,
          currentLimit.limitPrice + delta * (order.side === ORDER_SIDE_TYPE.BUY ? -1 : 1),
          order.side === ORDER_SIDE_TYPE.BUY ? ORDER_SIDE_TYPE.SELL : ORDER_SIDE_TYPE.BUY);
      }
    }
    if (order.quantity === filledQuantity) {
      order.status = 'completed';
    }
  }
}
