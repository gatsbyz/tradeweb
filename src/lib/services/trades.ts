import { Trade } from "@/models/trade";

export class Trades {
  trades: Record<string, Trade[]> = {};

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor() {
  }

  create(trade: Trade): Trade {
    if (!trade[trade.ticker]) {
      this.trades[trade.ticker] = [];
    }
    // console.log('this.trades', this.trades);
    this.trades[trade.ticker].push(trade);
    return trade;
  }

  async get(id: string): Promise<Trade | null> {
    // return this.services.firestore.get(id);
    return null;
  }
}
