import { Record } from "@/models/record";

import { Users } from "@/services/users";
import Err from "err";
import HTTP_STATUS from "http-status";
import { DateTime } from "luxon";
import { CentralLimitOrderBook } from "@/services/centralLimitOrderBook";

interface ServiceInterface {
  users: Users;
  centralLimitOrderBook: CentralLimitOrderBook;
}

/**
 * @class
 * Example service/dal
 */
export class Records {
  records: Record[] = [];

  private readonly services: ServiceInterface;

  /**
   * @param {ServiceInterface} services
   * @param {ConfigInterface} config
   */
  constructor(services: ServiceInterface) {
    this.services = services;
  }

  /**
   * Assert that user exists
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async assertUserExists(userId: string): Promise<void> {
    if (!(await this.services.users.exists(userId))) {
      throw new Err(`user: ${userId} not found`, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Assert that user owns record
   *
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async assertUserRecord(id: string): Promise<void> {
    const record = await this.get(id);

    if (!record) {
      throw new Err("record not found", HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Create record in db
   *
   * @param {Record} record
   * @returns {Promise<Record>}
   */
  create(record: Record): Record {
    // await this.assertUserExists(record.trader); // useful
    this.records.push(record);
    this.services.centralLimitOrderBook.update(record);
    return record;
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
