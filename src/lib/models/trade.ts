import { DateTime } from "luxon";
import { v4 as uuid } from 'uuid';

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

    this.id = uuid();
    this.ticker = params.ticker;
    this.price = params.price;
    this.quantity = params.quantity;
    this.buyer = params.buyer;
    this.seller = params.seller;
  }

  id: string;

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
