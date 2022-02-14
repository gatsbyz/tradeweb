import { Record } from "@/models/record";
import { DateTime } from "luxon";

// interface ServiceInterface {
//   users: Users;
// }

/**
 * @class
 * Example service/dal
 */
export class CentralLimitOrderBook {
  // private readonly services: ServiceInterface;
  limitOrderbook = {};

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor() {}

  /**
   * Create record in db
   *
   * @param {Record} record
   * @returns {Promise<Record>}
   */
  update(record: Record): any {
    if (!this.limitOrderbook[record.ticker]) {
      this.limitOrderbook[record.ticker] = {};
    }
    if (!this.limitOrderbook[record.ticker][record.side]) {
      this.limitOrderbook[record.ticker][record.side] = []; // BIDS / OFFERS
    }
    this.limitOrderbook[record.ticker][record.side].push({
      ...record,
      filledQty: 0,
      status: "open",
    });
  }

  /**
   * Get record
   *
   * @param {string} id
   * @returns {Promise<Record | null>}
   */
  async get(id: string): Promise<Record | null> {
    // return this.services.firestore.get(id);
    return null;
  }

  /**
   * Patch field on record
   *
   * @param {string} id
   * @param {number} value
   * @param {Date} curDate
   * @returns {Promise<Record>}
   */
  async patch(
    id: string,
    value: number,
    curDate = DateTime.utc().toJSDate()
  ): Promise<Record> {
    // const updated = await this.services.firestore.patch(id, { value }, curDate);
    //
    // await this.services.events.emit({
    //   namespace: EVENT_NAMESPACES.RECORDS,
    //   action: RECORDS_ACTIONS.UPDATED,
    //   metadata: {
    //     modelId: updated.id,
    //   },
    // });
    //
    // return updated;
    return (null as unknown) as Record;
  }
}
