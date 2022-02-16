import { enumError, ValidatedBase } from "validated-base";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import shorthash from "shorthash";
import { DateTime } from "luxon";
import { toDate } from "simple-cached-firestore";
import { CreateOrder } from "@/requests/createOrder";
import { v4 as uuid } from 'uuid';
import {Limit} from "@/models/limit";

export enum RECORD_TYPE {
  BUY = "buy",
  SELL = "sell",
}

interface OrderInterface {
  ticker: string;
  trader: string;
  side: RECORD_TYPE;
  limitPrice: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class
 */
export class Order extends ValidatedBase implements OrderInterface {
  /**
   * @param {OrderInterface} params
   * @param {boolean} validate
   */
  constructor(params: OrderInterface) {
    super();

    this.id = uuid();
    this.ticker = params.ticker;
    this.trader = params.trader;
    this.side = params.side;
    this.limitPrice = params.limitPrice;
    this.limit = null;
    this.quantity = params.quantity;
    this.next = null;
    this.prev = null;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);
  }

  @IsString()
  id: string;

  @IsString()
  ticker: string;

  @IsString()
  trader: string;

  @IsEnum(RECORD_TYPE, { message: enumError(RECORD_TYPE) })
  side: RECORD_TYPE;

  @IsNumber()
  limitPrice: number;

  limit: Limit | null;

  @IsNumber()
  quantity: number;

  prev: Order | null;

  next: Order | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Generate ID for model based on userId, type and createdAt
   *
   * @param {string} userId
   * @param {RECORD_TYPE} type
   * @param {Date} createdAt
   * @returns {string}
   */
  static generateId(
    userId: string,
    type: RECORD_TYPE,
    createdAt: Date
  ): string {
    return shorthash.unique(userId + type + createdAt.toISOString());
  }

  /**
   * Create instance of model
   *
   * @param {string} ticker
   * @param {string} trader
   * @param {RECORD_TYPE} side
   * @param {number} limit
   * @param {number} quantity
   * @param {DateTime} curDate
   * @returns {Order}
   */
  static create(
    order: CreateOrder,
    curDate = DateTime.utc().toJSDate()
  ): Order {
    return new Order({ ...order, createdAt: curDate, updatedAt: curDate });
  }
}
