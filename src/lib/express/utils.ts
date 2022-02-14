import assert from "assert";
import { isNil, isObject } from "lodash";

/**
 * Assert properties of object
 *
 * @param {{}} obj
 * @param {string[]} properties
 * @returns {void}
 */
export function assertProperties(obj: any, properties: string[]): void {
  if (!isObject(obj)) throw new Error("not object");
  if (properties.length === 0) throw new Error("no properties provided");

  properties.map((prop) =>
    assert(!isNil(obj[prop]), `${prop} not found on obj`)
  );
}
