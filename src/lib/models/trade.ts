import { DateTime } from "luxon";

export enum RECORD_TYPE {
  BUY = "buy",
  SELL = "sell",
}

interface TradeInterface {
  ticker: string;
  price: number;
  quantity: number;
  buyer: string;
  seller: string;
}

/**
 * @class
 */
export class Trade implements TradeInterface {
  /**
   * @param {OrderInterface} params
   * @param {boolean} validate
   */
  constructor(params: TradeInterface) {
    // ticker | price | quantity | buyer | seller |

    this.ticker = params.ticker;
    this.price = params.price;
    this.quantity = params.quantity;
    this.buyer = params.buyer;
    this.seller = params.seller;
  }

  ticker: string;

  price: number;

  quantity: number;

  buyer: string;

  seller: string;

  static create(
    trade: TradeInterface,
    curDate = DateTime.utc().toJSDate()
  ): Trade {
    return new Trade({ ...trade });
  }
}
