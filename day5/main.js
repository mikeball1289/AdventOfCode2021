const { readFileSync } = require('fs');

class Point {
  constructor(x, y) {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }
}

class Line {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  isCardinal() {
    return this.from.x === this.to.x || this.from.y === this.to.y;
  }

  *coords() {
    const [start, end] = this.from.x < this.to.x ? [this.from, this.to] : [this.to, this.from];
    if (start.x === end.x) {
      for (let i = Math.min(start.y, end.y); i <= Math.max(start.y, end.y); i++) {
        yield new Point(start.x, i);
      }
    } else {
      for (let i = start.x; i <= end.x; i++) {
        yield new Point(i, (end.y - start.y) * ((i - start.x) / (end.x - start.x)) + start.y);
      }
    }
  }
}

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const lines = input.map(l => l.split(' -> ').map(part => new Point(...part.split(',')))).map(([from, to]) => new Line(from, to));

// const cardinalLines = lines.filter(l => l.isCardinal());
// let map1 = {};
// for (const line of cardinalLines) {
//   for (const coord of line.coords()) {
//     const idx = `${coord.x},${coord.y}`;
//     map1[idx] = (map1[idx] || 0) + 1;
//   }
// }

// console.log(Object.keys(map1).filter(k => map1[k] > 1).length);

let map2 = {};
for (const line of lines) {
  for (const coord of line.coords()) {
    const idx = `${coord.x},${coord.y}`;
    map2[idx] = (map2[idx] || 0) + 1;
  }
}
console.log(Object.keys(map2).filter(k => map2[k] > 1).length);
