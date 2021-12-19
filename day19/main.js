const { readFileSync } = require('fs');
const { pairwise } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n\r?\n/).map(b => b.split(/\r?\n/));

class Scanner {
  constructor(number, beacons) {
    this.number = number;
    this.beacons = beacons;
    this.position = null;
    this.rotation = null;
    for (let beacon of beacons) {
      beacon.beams = beacons
        .filter(b2 => beacon !== b2)
        .map(b2 => [
          b2.location[0] - beacon.location[0],
          b2.location[1] - beacon.location[1],
          b2.location[2] - beacon.location[2],
        ]);
    }
  }
}

class Beacon {
  constructor(location) {
    this.location = location;
    this.beams = [];
  }
}

let open = input.map(b => {
  const scannerNumber = parseInt(b[0].match(/--- scanner (\d+)/)[1]);
  const beacons = b.slice(1).map(l => new Beacon(l.split(',').map(e => parseInt(e))));
  return new Scanner(scannerNumber, beacons);
});

const convolutions = [
  [0, 1, 2], [5, 1, 0],
  [3, 1, 5], [2, 1, 3],
  [0, 2, 4], [1, 2, 0],
  [3, 2, 1], [4, 2, 3],
  [0, 4, 5], [2, 4, 0],
  [3, 4, 2], [5, 4, 3],
  [0, 5, 1], [4, 5, 0],
  [3, 5, 4], [1, 5, 3],
  [1, 3, 2], [5, 3, 1],
  [4, 3, 5], [2, 3, 4],
  [1, 0, 5], [2, 0, 1],
  [4, 0, 2], [5, 0, 4],
];

function findOverlaps(scanner, possibilities) {
  const solutions = [];
  for (const other of possibilities) {
    const solution = hasOverlap(scanner, other);
    if (solution) {
      other.position = solution.position;
      other.rotation = solution.rotation;
      solutions.push(other);
    }
  }
  return [solutions, possibilities.filter(b => !solutions.includes(b))];
}

function hasOverlap(scanner, other) {
  for (const beacon of scanner.beacons.slice(0, -11)) {
    for (const otherBeacon of other.beacons) {
      for (const conv of convolutions) {
        const overlap = beacon.beams.filter(b => {
          const c = convolve(b, conv);
          return otherBeacon.beams.some(([x, y, z]) => c[0] === x && c[1] === y && c[2] === z);
        });
        if (overlap.length >= 11) {
          console.log(beacon.location, otherBeacon.location, scanner.position, conv);
          return {
            rotation: addConvolution(conv, scanner.rotation),
            position: v3subtract(
              v3add(
                undoConvolution(beacon.location, scanner.rotation),
                scanner.position
              ),
              undoConvolution(undoConvolution(otherBeacon.location, conv), scanner.rotation)
            ),
          };
        }
      }
    }
  }
}

function v3subtract(vec3, other) {
  return [vec3[0] - other[0], vec3[1] - other[1], vec3[2] - other[2]];
}

function v3add(vec3, other) {
  return [vec3[0] + other[0], vec3[1] + other[1], vec3[2] + other[2]];
}

function addConvolution(conv, other) {
  return conv.map(c => {
    const idx = c % 3;
    if (c > 2) {
      return {
        0: 3, 1: 4, 2: 5, 3: 0, 4: 1, 5: 2,
      }[other[idx]];
    }
    return other[idx];
  });
}

function selectAxis(c, v) {
  switch (c) {
    case 0: return v[0];
    case 1: return v[1];
    case 2: return v[2];
    case 3: return -v[0];
    case 4: return -v[1];
    case 5: return -v[2];
  }
}

function convolve(vector, convolution) {
  return convolution.map(c => selectAxis(c, vector));
}

function undoConvolution(vector, convolution) {
  let vec = [];
  for (let i = 0; i < 3; i++) {
    vec[convolution[i] % 3] = vector[i] * (convolution[i] > 2 ? -1 : 1);
  }
  return vec;
}

let scanner0 = open[0];
open = open.slice(1);
scanner0.position = [0, 0, 0];
scanner0.rotation = [0, 1, 2];

let solved = [scanner0];
for (const scanner of solved) {
  const [figuredOut, remaining] = findOverlaps(scanner, open);
  solved.push(...figuredOut);
  open = remaining;
}

const allBeacons = solved.flatMap(s => s.beacons.map(b => v3add(undoConvolution(b.location, s.rotation), s.position)));
console.log(
  allBeacons
    .filter(([x, y, z], i) => allBeacons.findIndex(([ox, oy, oz]) => x === ox && y === oy && z === oz) === i)
    .length
);

function manhattanDistance(v1, v2) {
  return Math.abs(v1[0] - v2[0]) + Math.abs(v1[1] - v2[1]) + Math.abs(v1[2] - v2[2]);
}

console.log(Math.max(...pairwise(solved).map(([b1, b2]) => manhattanDistance(b1.position, b2.position))));