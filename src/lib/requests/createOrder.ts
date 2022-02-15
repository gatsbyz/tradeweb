import { enumError, ValidatedBase } from "validated-base";
import { RECORD_TYPE } from "@/models/order";
import { IsEnum, IsNumber, IsString } from "class-validator";

interface CreateOrderInterface {
  ticker: string;
  trader: string;
  side: RECORD_TYPE;
  limitPrice: number;
  quantity: number;
}

/**
 * @class
 */
export class CreateOrder extends ValidatedBase
  implements CreateOrderInterface {
  /**
   * @param {CreateOrderInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateOrderInterface, validate = true) {
    super();

    this.ticker = params.ticker;
    this.trader = params.trader;
    this.side = params.side;
    this.limitPrice = params.limitPrice;
    this.quantity = params.quantity;

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
  limitPrice: number;

  @IsNumber()
  quantity: number;
}
