const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/).map(e => parseInt(e));
const differences = input.slice(1).map((e, i) => e - input[i]);
const part1 = differences.filter(e => e > 0).length;

console.log(part1);

const conv = input.slice(2).map((e, i) => e + input[i] + input[i + 1]);
const convDifferences = conv.slice(1).map((e, i) => e - conv[i]);
const part2 = convDifferences.filter(e => e > 0).length;

console.log(part2);

console.log(
  input
    .slice(3)
    .map((e, i) => e - input[i])
    .filter(e => e > 0)
    .length
);