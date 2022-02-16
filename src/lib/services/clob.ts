import { Limit } from "@/models/limit";
import { CLOB as CLOBModel } from "@/models/clob";

interface TradeWebCLOB {
  [ticker: string]: CLOBModel;
}

/**
 * @class
 * Example service/dal
 */
export class CLOB {
  // private readonly services: ServiceInterface;

  clob: TradeWebCLOB = {
  };

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
  // add(ticker: string, side: string, limit: Limit): any {
  //   const clob = this.get(ticker);
  //   if ()
  //   clob.
  // }

  get(ticker: string): CLOBModel {
    return this.clob[ticker];
  }

}
