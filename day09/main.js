const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const map = input.map(l => l.split('').map(n => parseInt(n)));

function isLocalMinimum(map, x, y) {
  const h = map[y][x];
  return (x === 0 || map[y][x - 1] > h) &&
    (x === map[0].length - 1 || map[y][x + 1] > h) &&
    (y === 0 || map[y - 1][x] > h) &&
    (y === map.length - 1 || map[y + 1][x] > h);
}

const minimums = map.flatMap((r, y) => r.filter((_, x) => isLocalMinimum(map, x, y)));

console.log(sum(minimums.map(m => m + 1)));

const Map = {
  RIDGE: 1,
  BASIN: 0,
  MARKED: 2,
}

const basinMap = map.map(l => l.map(h => h === 9 ? Map.RIDGE : Map.BASIN));
const sizes = [];

function neighbors(map, x, y) {
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([x, y]) => x >= 0 && x < map[0].length && y >= 0 && y < map.length);
}

function fillBasin(map, x, y) {
  map[y][x] = Map.MARKED;
  let size = 1;
  for (const [nx, ny] of neighbors(map, x, y)) {
    if (map[ny][nx] === Map.BASIN) {
      size += fillBasin(map, nx, ny);
    }
  }
  return size;
}

for (let y = 0; y < basinMap.length; y++) {
  for (let x = 0; x < basinMap[y].length; x++) {
    if (basinMap[y][x] === Map.BASIN) {
      sizes.push(fillBasin(basinMap, x, y));
    }
  }
}

console.log(sizes.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b, 1));