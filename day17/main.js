const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii');
const [_, _xmin, _xmax, _ymin, _ymax] = input.match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
const xmin = parseInt(_xmin);
const xmax = parseInt(_xmax);
const ymin = parseInt(_ymin);
const ymax = parseInt(_ymax);
const t = n => n * (n + 1) / 2;
const tp = n => (Math.sqrt(8 * n + 1) - 1) / 2;

function hitsTarget(xs, ys) {
  let x = 0;
  let y = 0;
  while (x <= xmax && y >= ymin) {
    x += xs;
    y += ys;
    if (xs > 0) xs--;
    ys--;
    if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
      return true;
    }
  }
  return false;
}

let hits = [];
let bestY = 0;
for (let x = Math.floor(tp(xmin)); x <= xmax; x++) {
  for (let y = ymin; y <= -ymin - 1; y++) {
    if (hitsTarget(x, y)) {
      hits.push([x, y]);
      if (y > bestY) {
        bestY = y;
      }
    }
  }
}

console.log(t(bestY));
console.log(hits.length);