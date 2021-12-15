const { readFileSync } = require('fs');
const { PriorityQueue } = require('../lib/PriorityQueue');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/).map(l => l.split('').map(e => parseInt(e)));

function openNeighbors(node, map) {
  return [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => [dx + node.location[0], dy + node.location[1]])
    .filter(([x, y]) => x >= 0 && x < map[0].length && y >= 0 && y < map.length)
    .map(([x, y]) => map[y][x])
    .filter(n => n.isOpen);
}

function pathFind(map) {
  const mapWidth = map[0].length;
  const mapHeight = map.length;
  const annotatedMap = map.map((l, y) => l.map((e, x) => ({
    cost: e,
    location: [x, y],
    isOpen: true,
    weight: 0,
    heuristic: (mapWidth - 1 - x) + (mapHeight - 1 - y),
    parent: null,
  })));

  let startingNode = annotatedMap[0][0];
  startingNode.isOpen = false;

  let heads = new PriorityQueue(node => node.weight + node.heuristic);
  heads.queue(startingNode);
  while (heads.list.length) {
    const cheapestHead = heads.dequeue();
    for (const neighbor of openNeighbors(cheapestHead, annotatedMap)) {
      neighbor.isOpen = false;
      neighbor.weight = cheapestHead.weight + neighbor.cost;
      neighbor.parent = cheapestHead;
      if (neighbor.location[0] === mapWidth - 1 && neighbor.location[1] === mapHeight - 1) {
        return neighbor;
      }
      heads.queue(neighbor);
    }
  }

  return annotatedMap[mapHeight - 1][mapWidth - 1];
}

console.log(pathFind(input).weight);

const MAP_WIDTH = input[0].length;
const MAP_HEIGHT = input.length;
const BIGGER_MAP_WIDTH = MAP_WIDTH * 5;
const BIGGER_MAP_HEIGHT = MAP_HEIGHT * 5;

const biggerMap = [];
for (let y = 0; y < BIGGER_MAP_HEIGHT; y++) {
  biggerMap[y] = [];
  for (let x = 0; x < BIGGER_MAP_WIDTH; x++) {
    const xBlock = Math.floor(x / MAP_WIDTH);
    const yBlock = Math.floor(y / MAP_HEIGHT);
    biggerMap[y][x] = (parseInt(input[y % MAP_HEIGHT][x % MAP_WIDTH]) - 1 + xBlock + yBlock) % 9 + 1;
  }
}

console.log(pathFind(biggerMap).weight);