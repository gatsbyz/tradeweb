import { ValidatedBase } from "validated-base";
import { IsNumber } from "class-validator";
import {Order} from "@/models/order";

interface LimitInterface {
  limitPrice: number;
}

const LEFT = 'left'
const RIGHT = 'right'

/**
 * @class
 */
export class Limit extends ValidatedBase implements LimitInterface {
  /**
   * @param {LimitInterface} params
   * @param {boolean} validate
   */
  constructor(limitPrice: number) {
    super();

    this.limitPrice = limitPrice;
    this.value = limitPrice;
    this.totalQuantity = 0;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.parentSide = null;
    this.meta = {
      head: null,
      tail: null,
      color: null
    };
  }

  limitPrice: number;

  value: number;

  @IsNumber()
  totalQuantity: number;

  left: Limit | null;

  right: Limit | null;

  parent: Limit | null;

  parentSide: string | null;

  meta: {
    head: Order | null;

    tail: Order | null;

    color: string | null;
  }

  /**
   * Create instance of model
   *
   * @param {string} ticker
   * @param {string} trader
   * @param {RECORD_TYPE} side
   * @param {number} limit
   * @param {number} quantity
   * @param {DateTime} curDate
   * @returns {Limit}
   */
  static create(
    limit: LimitInterface,
  ): Limit {
    return new Limit(limit.limitPrice);
  }

  setLeftAndUpdateParent(node) {
    this.left = node;
    if (node) {
      node.parent = this;
      node.parentSide = LEFT;
    }
  }
  setRightAndUpdateParent(node) {
    this.right = node;
    if (node) {
      node.parent = this;
      node.parentSide = RIGHT;
    }
  }
  get parentChildSide() {
    if (this.parent) {
      return this.isParentLeftChild ? 'left' : 'right';
    }

    return 'root';
  }
  get isParentLeftChild() {
    return this.parentSide === LEFT;
  }

  /**
   * Return true if this node is its parent right child
   */
  get isParentRightChild() {
    return this.parentSide === RIGHT;
  }

  /**
   * Node is leaf is it has no descendants
   */
  get isLeaf() {
    return !this.left && !this.right;
  }

  /**
   * Get sibling of current node
   */
  get sibling() {
    const { parent } = this;
    if (!parent) return null;
    return parent.right === this ? parent.left : parent.right;
  }

  /**
   * Get parent sibling = uncle (duh)
   */
  get uncle() {
    const { parent } = this;
    if (!parent) return null;
    return parent.sibling;
  }

  get grandparent() {
    const { parent } = this;
    return parent && parent.parent;
  }

  /**
   * Get color
   */
  get color() {
    return this.meta.color;
  }

  /**
   * Set Color
   */
  set color(value) {
    this.meta.color = value;
  }

  // tag::avl[]
  /**
   * @returns {Number} left subtree height or 0 if no left child
   */
  get leftSubtreeHeight() {
    return this.left ? this.left.height + 1 : 0;
  }

  /**
   * @returns {Number} right subtree height or 0 if no right child
   */
  get rightSubtreeHeight() {
    return this.right ? this.right.height + 1 : 0;
  }

  /**
   * Get the max height of the subtrees.
   *
   * It recursively goes into each children calculating the height
   *
   * Height: distance from the deepest leaf to this node
   */
  get height() {
    return Math.max(this.leftSubtreeHeight, this.rightSubtreeHeight);
  }

  /**
   * Returns the difference the heights on the left and right subtrees
   */
  get balanceFactor() {
    return this.leftSubtreeHeight - this.rightSubtreeHeight;
  }
  // end::avl[]

  /**
   * Serialize node's values
   */
  toValues() {
    return {
      value: this.limitPrice,
      left: this.left && this.left.limitPrice,
      right: this.right && this.right.limitPrice,
      parent: this.parent && this.parent.limitPrice,
      parentSide: this.parentSide,
    };
  }
  //
  // /**
  //  * Get and Set data value
  //  * @param {any} value (optional) if not provided is a getter, otherwise a setter.
  //  */
  // data(value) {
  //   if (value === undefined) {
  //     return this.meta.data;
  //   }
  //   this.meta.data = value;
  //   return this;
  // }

}
