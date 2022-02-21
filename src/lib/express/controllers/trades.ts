import autoBind from "auto-bind";

import { Trades as TradesService } from "@/services/trades";
import { Trade } from "@/models/trade";

interface ServicesInterface {
  trades: TradesService;
}

/**
 * @class
 */
export class Trades {
  private readonly services: ServicesInterface;

  /**
   * @param {ServicesInterface} services
   * @param {any} config
   * @param {boolean} doAutoBind
   */
  constructor(services: ServicesInterface, config?, doAutoBind = true) {
    this.services = services;

    if (doAutoBind) {
      autoBind(this);
    }
  }

  getTrades(request): Trade[] {
    const { traderId }: { traderId: string } = request.params;
    return this.services.trades.get(traderId);
  }

  // async get(request): Promise<Order> {
  //   assertProperties(request.locals, ["user"]);
  //   assertProperties(request.params, ["recordId"]);
  //   const { recordId }: { recordId: string } = request.params;
  //
  //   // await this.services.records.assertUserRecord(recordId, user.id);
  //
  //   const record = await this.services.records.get(recordId);
  //
  //   if (!record) {
  //     throw new Err("record not found", HTTP_STATUS.NOT_FOUND);
  //   }
  //
  //   return record;
  // }

  // async remove(request): Promise<void> {
  //   assertProperties(request.locals, ["user"]);
  //   // const { user }: { user: UserModel } = request.locals;
  //   assertProperties(request.params, ["recordId"]);
  //   // const { recordId }: { recordId: string } = request.params;
  //
  //   // await this.services.records.assertUserRecord(recordId, user.id);
  // }
}
