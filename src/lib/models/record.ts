import { enumError, ValidatedBase } from "validated-base";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import shorthash from "shorthash";
import { DateTime } from "luxon";
import { toDate } from "simple-cached-firestore";
import { CreateRecord } from "@/requests/createRecord";

export enum RECORD_TYPE {
  BUY = "buy",
  SELL = "sell",
}

interface RecordInterface {
  ticker: string;
  trader: string;
  side: RECORD_TYPE;
  limit: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class
 */
export class Record extends ValidatedBase implements RecordInterface {
  /**
   * @param {RecordInterface} params
   * @param {boolean} validate
   */
  constructor(params: RecordInterface, validate = true) {
    super();

    this.ticker = params.ticker;
    this.trader = params.trader;
    this.side = params.side;
    this.limit = params.limit;
    this.quantity = params.quantity;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  ticker: string;

  @IsString()
  trader: string;

  @IsEnum(RECORD_TYPE, { message: enumError(RECORD_TYPE) })
  side: RECORD_TYPE;

  @IsNumber()
  limit: number;

  @IsNumber()
  quantity: number;

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
   * @returns {Record}
   */
  static create(
    record: CreateRecord,
    curDate = DateTime.utc().toJSDate()
  ): Record {
    return new Record({ ...record, createdAt: curDate, updatedAt: curDate });
  }
}
