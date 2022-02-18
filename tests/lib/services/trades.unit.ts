import { expect } from "chai";
import { Limits } from "@/services/Limits";
import { Orders } from "@/services/orders";
import { Trades } from "@/services/trades";
// import sinon from "sinon";
import { Order, RECORD_TYPE } from "../../../src/lib/models/order";

describe("limits unit test", () => {
  it("check no trade created", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };
    const orders = new Orders(services);

    /*
 Scenario: Multiple valid orders are accepted into the limit order book  Given an empty order book for "TW"
 When the following orders are created:
 | ticker | trader | side | limit | quantity |
 | TW | trader1 | buy | $99.50 | 100 |
 | TW | trader2 | sell | $99.60 | 200 |
 Then the limit order book should be:
 | ticker | trader | side | limit | quantity | filledQty | status |
| TW | trader1 | buy | $99.50 | 100 | 0 | open |
| TW | trader2 | sell | $99.60 | 200 | 0 | open |

      */

    const order1 = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: RECORD_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: RECORD_TYPE.SELL,
      limitPrice: 99.60,
      quantity: 200
    });

    orders.create(order1)
    orders.create(order2)

    expect(LimitServices.trades.trades).to.eql({});
  });

  it.only("check limit creation", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };
    const orders = new Orders(services);

    /*
 Scenario: Two tradable orders result in a trade
 Given an empty order book for "TW"
 When the following orders are created:
 | ticker | trader | side | limit | quantity |
 | TW | trader1 | buy | $99.50 | 100 |
 | TW | trader2 | sell | $99.50 | 100 |
 Then the limit order book should be:
 | ticker | trader | side | limit | quantity | filledQty | status |
 | TW | trader1 | buy | $99.50 | 100 | 100 | completed |
 | TW | trader2 | sell | $99.50 | 100 | 100 | completed |
 And the following trades are created:
 | ticker | price | quantity | buyer | seller |
 | TW | $99.50 | 100 | trader1 | trader2 |
  */

    const order1 = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: RECORD_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: RECORD_TYPE.SELL,
      limitPrice: 99.50,
      quantity: 100
    });

    orders.create(order1)
    orders.create(order2)

    expect(LimitServices.trades.trades).to.eql({});
  });
});
