import { ValidatedBase } from "validated-base";
import { Limit } from "@/models/limit";

interface CLOBInterface {
}

/**
 * @class
 */
export class CLOB extends ValidatedBase implements CLOBInterface {

  constructor() {
    super();

    this.buyLimits = null
    this.sellLimits = null
    this.lowestSell = null
    this.highestBuy = null
  }

  buyLimits: Limit | null;
  sellLimits: Limit | null;
  lowestSell: Limit | null;
  highestBuy: Limit | null;

  /**
   * Create instance of model
   *
   * @param {string} ticker
   * @param {string} trader
   * @param {ORDER_SIDE_TYPE} side
   * @param {number} limit
   * @param {number} quantity
   * @param {DateTime} curDate
   * @returns {Limit}
   */
  static create(
  ): CLOB {
    return new CLOB();
  }

}
