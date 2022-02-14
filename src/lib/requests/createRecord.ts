import { enumError, ValidatedBase } from "validated-base";
import { RECORD_TYPE } from "@/models/record";
import { IsEnum, IsNumber, IsString } from "class-validator";

interface CreateRecordInterface {
  ticker: string;
  trader: string;
  side: RECORD_TYPE;
  limit: number;
  quantity: number;
}

/**
 * @class
 */
export class CreateRecord extends ValidatedBase
  implements CreateRecordInterface {
  /**
   * @param {CreateRecordInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRecordInterface, validate = true) {
    super();

    this.ticker = params.ticker;
    this.trader = params.trader;
    this.side = params.side;
    this.limit = params.limit;
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
  limit: number;

  @IsNumber()
  quantity: number;
}
