const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const map = input.map(l => l.split('').map(n => parseInt(n)));

const MAP_SIZE = 10;

function* neighbors(x, y) {
  for (const [dx, dy] of [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
  ]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < MAP_SIZE && ny >= 0 && ny < MAP_SIZE)
      yield [nx, ny];
  }
}

function step(map) {
  let flashes = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      map[y][x]++;
      if (map[y][x] > 9) {
        flashes.push([x, y]);
      }
    }
  }

  for (const [x, y] of flashes) {
    for (const [nx, ny] of neighbors(x, y)) {
      map[ny][nx]++;
      if (map[ny][nx] > 9 && !flashes.some(([fx, fy]) => fx === nx && fy === ny)) {
        flashes.push([nx, ny]); // Note that adding to flashes will cause the loop to extend
      }
    }
  }

  for (const [x, y] of flashes) {
    map[y][x] = 0;
  }

  return flashes.length;
}

let totalFlashes = 0;
let i = 0;
for (; i < 100; i++) { // quick and dirty for part 2
  totalFlashes += step(map);
}
console.log(totalFlashes);

function containsNonZero(map) {
  return map.some(l => l.some(n => n !== 0));
}

while (containsNonZero(map)) {
  step(map);
  i++;
}
console.log(i);