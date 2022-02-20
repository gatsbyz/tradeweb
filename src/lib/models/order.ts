import { DateTime } from "luxon";
import { toDate } from "simple-cached-firestore";
import { v4 as uuid } from 'uuid';
import {Limit} from "@/models/limit";

export enum ORDER_SIDE_TYPE {
  BUY = "buy",
  SELL = "sell",
}

interface OrderInterface {
  ticker: string;
  trader: string;
  side: ORDER_SIDE_TYPE;
  limitPrice: number;
  quantity: number;
}

/**
 * @class
 */
export class Order implements OrderInterface {
  /**
   * @param {OrderInterface} params
   * @param {boolean} validate
   */
  constructor(params: OrderInterface, curDate = DateTime.utc().toJSDate()) {
    this.id = uuid();
    this.ticker = params.ticker;
    this.trader = params.trader;
    this.side = params.side;
    this.limitPrice = params.limitPrice;
    this.limit = null;
    this.quantity = params.quantity;
    this.filledQuantity = 0;
    this.status = 'open';
    this.next = null;
    this.prev = null;
    this.createdAt = toDate(curDate);
    this.updatedAt = toDate(curDate);
  }

  id: string;

  ticker: string;

  trader: string;

  side: ORDER_SIDE_TYPE;

  limitPrice: number;

  limit: Limit | null;

  quantity: number;

  filledQuantity: number;

  status: string;

  prev: Order | null;

  next: Order | null;

  createdAt: Date;

  updatedAt: Date;


  setNext(node) {
    this.next = node;
  }
}
