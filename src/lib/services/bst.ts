import {Limit as BinaryTreeNode} from '../models/limit'

export class BinarySearchTree {
  root: BinaryTreeNode | null;
  size;

  constructor() {
    this.root = null;
    this.size = 0;
  }
  // end::snippet[]

  // tag::add[]
  /**
   * Insert value on the BST.
   *
   * If the value is already in the tree,
   * then it increases the multiplicity value
   * @param {any} value node's value to insert in the tree
   * @returns {BinaryTreeNode} newly added node
   */
  add(node) {
    // let node = new BinaryTreeNode(value);
    const value = node.value;
    if (this.root) {
      const { found, parent } = this.findNodeAndParent(value); // <1>
      if (found) { // duplicated: value already exist on the tree
        found.meta.multiplicity = (found.meta.multiplicity || 1) + 1; // <2>
        node = found;
      } else if (value < parent.value) {
        parent.setLeftAndUpdateParent(node);
      } else {
        parent.setRightAndUpdateParent(node);
      }
    } else {
      this.root = node;
    }

    this.size += 1;
    return node;
  }
  // end::add[]

  /**
   * Find if a node is present or not
   * @param {any} value node to find
   * @returns {boolean} true if is present, false otherwise
   */
  has(value) {
    return !!this.find(value);
  }

  // tag::find[]
  /**
   * @param {any} value value to find
   * @returns {BinaryTreeNode|null} node if it found it or null if not
   */
  find(value) {
    return this.findNodeAndParent(value).found;
  }


  /**
   * Recursively finds the node matching the value.
   * If it doesn't find, it returns the leaf `parent` where the new value should be appended.
   * @param {any} value Node's value to find
   * @param {BinaryTreeNode} node first element to start the search (root is default)
   * @param {BinaryTreeNode} parent keep track of parent (usually filled by recursion)
   * @returns {object} node and its parent like {node, parent}
   */
  findNodeAndParent(value, node = this.root, parent?) {
    if (!node || node.value === value) {
      return { found: node, parent };
    } if (value < node.value) {
      return this.findNodeAndParent(value, node.left, node);
    }
    return this.findNodeAndParent(value, node.right, node);
  }

  getRightmost(node = this.root) {
    if (!node || !node.right) {
      return node;
    }
    return this.getRightmost(node.right);
  }

  getLeftmost(node = this.root) {
    if (!node || !node.left) {
      return node;
    }
    return this.getLeftmost(node.left);
  }

  remove(value) {
    const { found: nodeToRemove, parent } = this.findNodeAndParent(value); // <1>

    if (!nodeToRemove) return false; // <2>

    // Combine left and right children into one subtree without nodeToRemove
    const removedNodeChildren = this.combineLeftIntoRightSubtree(nodeToRemove); // <3>

    if (nodeToRemove.meta.multiplicity && nodeToRemove.meta.multiplicity > 1) { // <4>
      nodeToRemove.meta.multiplicity -= 1; // handles duplicated
    } else if (nodeToRemove === this.root) { // <5>
      // Replace (root) node to delete with the combined subtree.
      this.root = removedNodeChildren;
      if (this.root) { this.root.parent = null; } // clearing up old parent
    } else if (nodeToRemove.isParentLeftChild) { // <6>
      // Replace node to delete with the combined subtree.
      parent.setLeftAndUpdateParent(removedNodeChildren);
    } else {
      parent.setRightAndUpdateParent(removedNodeChildren);
    }

    this.size -= 1;
    return true;
  }

  combineLeftIntoRightSubtree(node) {
    if (node.right) {
      const leftmost = this.getLeftmost(node.right);
      leftmost.setLeftAndUpdateParent(node.left);
      return node.right;
    }
    return node.left;
  }
  // end::combine[]

  // tag::bfs[]
  /**
   * Breath-first search for a tree (always starting from the root element).
   * @yields {BinaryTreeNode}
   */
  bfs() {
    const queue: BinaryTreeNode[] = [];

    queue.push(this.root as BinaryTreeNode);

    while (queue.length !== 0) {
      const node = queue.shift();
      if (!node) throw('something is wrong')
      if (node.left) { queue.push(node.left); }
      if (node.right) { queue.push(node.right); }
    }
  }

  // toArray() {
  //   const array = [];
  //   const queue = new Queue();
  //   const visited = new Map();
  //
  //   if (this.root) { queue.add(this.root); }
  //
  //   while (!queue.isEmpty()) {
  //     const current = queue.remove();
  //     array.push(current && current.value);
  //
  //     if (current) { visited.set(current); }
  //
  //     if (current && !visited.has(current.left)) { queue.add(current.left); }
  //     if (current && !visited.has(current.right)) { queue.add(current.right); }
  //   }
  //
  //   return array;
  // }
}
