import { expect } from "chai";
import { Limits } from "@/services/Limits";
import { Orders } from "@/services/orders";
import { Trades } from "@/services/trades";
// import sinon from "sinon";
import { Order, ORDER_SIDE_TYPE } from "../../../src/lib/models/order";

describe("trades unit test", () => {
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
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.60,
      quantity: 200
    });

    orders.create(order1)
    orders.create(order2)

    expect(LimitServices.trades.trades).to.eql({});
  });

  it("Two tradable orders result in a trade", async () => {
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
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.50,
      quantity: 100
    });

    const createdOrder1 = orders.create(order1);
    const createdOrder2 = orders.create(order2);

    expect(createdOrder1.status).to.eql('completed');
    expect(createdOrder2.status).to.eql('completed');

    const tradesByTrader1 = LimitServices.trades.get('trader1')[0];
    expect(LimitServices.trades.get('trader1')[0]).to.eql({
      id: tradesByTrader1.id,
      ticker: 'TW',
      price: 99.5,
      quantity: 100,
      buyer: 'trader1',
      seller: 'trader2'

    });
  });

  it("Two tradable orders with different quantities are partially filled", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };
    const orders = new Orders(services);

    /*
 Scenario: Two tradable orders with different quantities are partially filled
Given an empty orderbook for "TW"
 When the following orders are created:
 | ticker | trader | side | limit | quantity |
 | TW | trader1 | buy | $99.50 | 100 |
 | TW | trader2 | sell | $99.50 | 300 |
 Then the limit orderbook should be:
 | ticker | trader | side | limit | quantity | filledQty | status |
 | TW | trader1 | buy | $99.50 | 100 | 100 | completed |
 | TW | trader2 | sell | $99.50 | 300 | 100 | open |
And the following trades are created:
| ticker | price | quantity | buyer | seller |
| TW | $99.50 | 100 | trader1 | trader2 |
  */

    const order1 = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.50,
      quantity: 300
    });

    const createdOrder1 = orders.create(order1);
    const createdOrder2 = orders.create(order2);

    expect(createdOrder1.status).to.eql('completed');
    expect(createdOrder2.status).to.eql('open');

    const tradesByTrader1 = LimitServices.trades.get('trader1')[0];
    expect(LimitServices.trades.get('trader1')[0]).to.eql({
      id: tradesByTrader1.id,
      ticker: 'TW',
      price: 99.5,
      quantity: 100,
      buyer: 'trader1',
      seller: 'trader2'

    });
  });

  it("A valid single buy order is able to sweep the book", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };
    const orders = new Orders(services);

    /*
 Scenario: A valid single order is able to sweep the book
 Given an empty orderbook for "TW"
 When the following orders are created:
 | ticker | trader | side | limit | quantity |
 | TW | trader1 | buy | $99.50 | 100 |
 | TW | trader2 | buy | $99.45 | 300 |
 | TW | trader3 | buy | $99.35 | 500 |
 | TW | trader4 | sell | $99.30 | 1000 |
 Then the limit orderbook should be:
 | ticker | trader | side | limit | quantity | filledQty | status |
| TW | trader1 | buy | $99.50 | 100 | 100 | completed |
| TW | trader2 | buy | $99.45 | 300 | 300 | completed |
| TW | trader3 | buy | $99.35 | 500 | 500 | completed |
| TW | trader4 | sell | $99.30 | 1000 | 900 | open |
And the following trades are created:
 | ticker | price | quantity | buyer | seller |
 | TW | $99.50 | 100 | trader1 | trader4 |
 | TW | $99.45 | 300 | trader2 | trader4 |
 | TW | $99.35 | 500 | trader3 | trader4 |

  */

    const order1 = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.45,
      quantity: 300
    });

    const order3 = new Order({
      ticker: 'TW',
      trader: 'trader3',
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.35,
      quantity: 500
    });

    const order4 = new Order({
      ticker: 'TW',
      trader: 'trader4',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.30,
      quantity: 1000
    });

    const createdOrder1 = orders.create(order1);
    const createdOrder2 = orders.create(order2);
    const createdOrder3 = orders.create(order3);
    const createdOrder4 = orders.create(order4);
    // console.log(createdOrder4);

    expect(createdOrder1.status).to.eql('completed');
    expect(createdOrder2.status).to.eql('completed');
    expect(createdOrder3.status).to.eql('completed');
    expect(createdOrder4.status).to.eql('open');


    const tradesByTrader4 = LimitServices.trades.get('trader4');
    expect(tradesByTrader4).to.eql([{
      id: tradesByTrader4[0].id,
      ticker: 'TW',
      price: 99.35,
      quantity: 500,
      buyer: 'trader3',
      seller: 'trader4'

    },{
      id: tradesByTrader4[1].id,
      ticker: 'TW',
      price: 99.45,
      quantity: 300,
      buyer: 'trader2',
      seller: 'trader4'

    },{
      id: tradesByTrader4[2].id,
      ticker: 'TW',
      price: 99.5,
      quantity: 100,
      buyer: 'trader1',
      seller: 'trader4'

    }]);
  });

  it("A valid single sell order is able to sweep the book", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };
    const orders = new Orders(services);

    /*
 Scenario: A valid single order is able to sweep the book
 Given an empty orderbook for "TW"
 When the following orders are created:
 | ticker | trader | side | limit | quantity |
 | TW | trader1 | sell | $99.30 | 100 |
 | TW | trader2 | sell | $99.35 | 300 |
 | TW | trader3 | sell | $99.45 | 500 |
 | TW | trader4 | buy | $99.50 | 1000 |
 Then the limit orderbook should be:
 | ticker | trader | side | limit | quantity | filledQty | status |
| TW | trader1 | sell | $99.30 | 100 | 100 | completed |
| TW | trader2 | sell | $99.35 | 300 | 300 | completed |
| TW | trader3 | sell | $99.45 | 500 | 500 | completed |
| TW | trader4 | buy | $99.50 | 1000 | 900 | open |
And the following trades are created:
 | ticker | price | quantity | buyer | seller |
 | TW | $99.30 | 100 | trader4 | trader1 |
 | TW | $99.35 | 300 | trader4 | trader2 |
 | TW | $99.45 | 500 | trader4 | trader3 |
  */

    const order1 = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.30,
      quantity: 100
    });

    const order2 = new Order({
      ticker: 'TW',
      trader: 'trader2',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.35,
      quantity: 300
    });

    const order3 = new Order({
      ticker: 'TW',
      trader: 'trader3',
      side: ORDER_SIDE_TYPE.SELL,
      limitPrice: 99.45,
      quantity: 500
    });

    const order4 = new Order({
      ticker: 'TW',
      trader: 'trader4',
      side: ORDER_SIDE_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 1000
    });

    const createdOrder1 = orders.create(order1);
    const createdOrder2 = orders.create(order2);
    const createdOrder3 = orders.create(order3);
    const createdOrder4 = orders.create(order4);
    // console.log(createdOrder4);

    expect(createdOrder1.status).to.eql('completed');
    expect(createdOrder2.status).to.eql('completed');
    expect(createdOrder3.status).to.eql('completed');
    expect(createdOrder4.status).to.eql('open');

    const tradesByTrader4 = LimitServices.trades.get('trader4');
    expect(tradesByTrader4).to.eql([{
      id: tradesByTrader4[0].id,
      ticker: 'TW',
      price: 99.45,
      quantity: 500,
      buyer: 'trader4',
      seller: 'trader3'
    },{
      id: tradesByTrader4[1].id,
      ticker: 'TW',
      price: 99.35,
      quantity: 300,
      buyer: 'trader4',
      seller: 'trader2'
    },{
      id: tradesByTrader4[2].id,
      ticker: 'TW',
      price: 99.30,
      quantity: 100,
      buyer: 'trader4',
      seller: 'trader1'
    }]);
  });
});
