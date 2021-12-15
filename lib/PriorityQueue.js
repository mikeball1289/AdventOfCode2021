module.exports.PriorityQueue = class {
  constructor(priorityFn) {
    this.list = [];
    this.fn = priorityFn;
  }

  // This could be O(log n) but I'm lazy and this solves in under 1 second on my machine so ok
  queue(item) {
    const priority = this.fn(item);
    let idx = 0;
    while (idx < this.list.length && priority < this.list[idx][0]) {
      idx++;
    }
    this.list.splice(idx, 0, [priority, item]);
  }

  dequeue() {
    if (this.list.length === 0) return undefined;
    return this.list.pop()[1];
  }
}