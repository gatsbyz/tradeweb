import {Limit as BinaryTreeNode} from '../models/limit'

export class BinarySearchTree {
  root: BinaryTreeNode | null;
  size;

  constructor() {
    this.root = null;
    this.size = 0;
  }

  // when order is sell
  searchGreater(n, x, best_so_far) { //  Find number nearest and greater than the key
    if (!n) {
      return best_so_far;
    } else if (n.value === x) {
      return x;
    } else if (n.value > x) {
      return this.searchGreater(n.left, x, Math.min(best_so_far, n.value));
    } else if (n.value < x) {
      return this.searchGreater(n.right, x, best_so_far)
    }
  }

  // when order is buy
  searchLess(n, x, best_so_far) { //  Find number nearest and less than the key
    if (!n) {
      return best_so_far;
    } else if (n.value == x) {
      return x;
    } else if (n.value > x) {
      return this.searchLess(n.left, x, best_so_far);
    } else if (n.value < x) {
      return this.searchLess(n.right, x, Math.max(best_so_far, n.value))
    }
  }

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

  has(value) {
    return !!this.find(value);
  }

  find(value) {
    return this.findNodeAndParent(value).found;
  }

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
