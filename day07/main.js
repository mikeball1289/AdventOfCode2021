const { readFileSync } = require('fs');
const { sum, median } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(',').map(e => parseInt(e)).sort((a, b) => a - b);

function requiredFuel(crabs, toPosition, costFn = n => n) {
  return crabs.reduce((fuel, c) => fuel + costFn(Math.abs(c - toPosition)), 0);
}

console.log(requiredFuel(input, median(input)));

function triangular(n) {
  return n * (n + 1) / 2;
}

function mean(list) {
  return sum(list) / list.length;
}

// check both and take the smaller of the two
console.log(requiredFuel(input, Math.floor(mean(input)), triangular));
console.log(requiredFuel(input, Math.ceil(mean(input)), triangular));
