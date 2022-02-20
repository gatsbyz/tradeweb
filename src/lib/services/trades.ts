import { Trade } from "@/models/trade";

export class Trades {
  tradeLink: Record<string, string[]> = {};
  trades: Record<string, Trade> = {};

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor() {
  }

  create(trade: Trade): Trade {
    this.trades[trade.id] = trade;
    if (!this.tradeLink[trade.buyer]) {
      this.tradeLink[trade.buyer] = [];
    }
    if (!this.tradeLink[trade.seller]) {
      this.tradeLink[trade.seller] = [];
    }
    this.tradeLink[trade.buyer].push(trade.id);
    this.tradeLink[trade.seller].push(trade.id);
    return trade;
  }

  get(trader: string): Trade[] {
    return this.tradeLink[trader].map(id => this.trades[id]);
  }
}
