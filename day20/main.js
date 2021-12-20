const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n\r?\n/);
const decoder = input[0].split('').map(c => c === '#' ? 1 : 0);
const map = input[1].split(/\r?\n/).map(l => l.split('').map(c => c === '#' ? 1 : 0));

function lookup(points, decoder) {
  const idx = sum(points.map((e, i) => e * (2 ** (8 - i))));
  return decoder[idx];
}

function getOrOob(map, x, y, oob) {
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
    return oob;
  }
  return map[y][x];
}

function expand(map, decoder, oob) {
  let newMap = [];
  for (let y = 0; y < map.length + 2; y++) {
    newMap[y] = [];
    for (let x = 0; x < map[0].length + 2; x++) {
      newMap[y][x] = lookup([
        getOrOob(map, x - 2, y - 2, oob),
        getOrOob(map, x - 1, y - 2, oob),
        getOrOob(map, x, y - 2, oob),

        getOrOob(map, x - 2, y - 1, oob),
        getOrOob(map, x - 1, y - 1, oob),
        getOrOob(map, x, y - 1, oob),

        getOrOob(map, x - 2, y, oob),
        getOrOob(map, x - 1, y, oob),
        getOrOob(map, x, y, oob),
      ], decoder);
    }
  }
  return newMap;
}

function render(map) {
  return map.map(l => l.map(c => c === 1 ? '#' : ' ').join('')).join('\n');
}

function expandNTimes(map, decoder, n) {
  let oob = 0;
  for (let i = 0; i < n; i++) {
    map = expand(map, decoder, oob);
    oob = lookup([oob, oob, oob, oob, oob, oob, oob, oob, oob], decoder);
  }
  return map;
}

console.log(sum(expandNTimes(map, decoder, 2).map(l => sum(l))));

console.log(sum(expandNTimes(map, decoder, 50).map(l => sum(l))));
