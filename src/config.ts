import { ValidatedBase } from "validated-base";
import { IsNumber, IsString } from "class-validator";

/* eslint-disable require-jsdoc */

export interface ConfigInterface {
  port: number;
  name: string;
  version: string;
}

/**
 * @class
 */
export class Config extends ValidatedBase implements ConfigInterface {
  constructor(params: ConfigInterface, validate = true) {
    super();
    this.port = params.port;
    this.name = params.name;
    this.version = params.version;

    if (validate) {
      this.validate();
    }
  }

  @IsNumber()
  port: number;

  @IsString()
  name: string;

  @IsString()
  version: string;
}

/* eslint-enable require-jsdoc */
