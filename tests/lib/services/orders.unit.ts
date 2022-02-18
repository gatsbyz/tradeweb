// import { expect } from "chai";
import { Limits } from "@/services/Limits";
import { Orders } from "@/services/orders";
import { Trades } from "@/services/trades";
// import sinon from "sinon";
import { Order, RECORD_TYPE } from "../../../src/lib/models/order";

describe("orders unit test", () => {
  it("found getByToken", async () => {
    const LimitServices = {
      trades: new Trades(),
    };

    const services = {
      limits: new Limits(LimitServices),
    };

    // const user = { id: "ogt-id" } as any;

    const orders = new Orders(services);

    // const getStub = sinon.stub(orders, "create").resolves(user);

    /*
    Scenario: A single valid order is accepted into the limit order book  Given an empty orderbook for "TW"
     When the following orders are created:
     | ticker | trader | side | limit | quantity |
     | TW | trader1 | buy | $99.50 | 100 |
     Then the limit orderbook should be:
     | ticker | trader | side | limit | quantity | filledQty | status |
     | TW | trader1 | buy | $99.50 | 100 | 0 | open |
      */

    const order = new Order({
      ticker: 'TW',
      trader: 'trader1',
      side: RECORD_TYPE.BUY,
      limitPrice: 99.50,
      quantity: 100
    });

    console.log(orders.create(order))

    // expect(await orders.getByToken("token")).to.eql(user);
    // expect(getStub.args).to.eql([["user-id"]]);
  });
  //
  // it("not found getByToken", async () => {
  //   const services = {
  //     auth: { verifyIdToken: sinon.stub().rejects("boom verify") } as any,
  //   };
  //
  //   const users = new Users(services);
  //   const getStub = sinon.stub(users, "get").rejects("boom");
  //
  //   expect(await users.getByToken("token")).to.eql(null);
  //   expect(getStub.args).to.eql([]);
  // });
  //
  // it("get found", async () => {
  //   const services = {
  //     auth: { getUser: sinon.stub().resolves({ uid: "user-id" }) } as any,
  //   };
  //
  //   const users = new Users(services);
  //   expect(await users.get("token")).to.eql({
  //     id: "user-id",
  //     user: { uid: "user-id" },
  //   });
  // });
  //
  // it("get not found", async () => {
  //   const services = {
  //     auth: { getUser: sinon.stub().rejects("boom") } as any,
  //   };
  //
  //   const users = new Users(services);
  //   expect(await users.get("token")).to.eql(null);
  // });
});
