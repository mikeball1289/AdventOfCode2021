const { readFileSync } = require('fs');
const { napply } = require('../lib/func');
const { sum } = require('../lib/list');

const input = readFileSync('./test.txt', 'ascii');

const fishAges = input.split(',').map(e => parseInt(e));
const fishByAge = new Array(9).fill(0).map((_, i) => fishAges.filter(a => a === i).length);

function generation(fish) {
  const [spawning, ...rest] = fish;
  return [...rest.slice(0, 6), rest[6] + spawning, rest[7], spawning];
}

console.log(sum(napply(generation, fishByAge, 256)));