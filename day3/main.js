const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const digits = input.map(l => l.split('').map(d => parseInt(d, 10)));

const totals = digits[0].map((_, i) => sum(digits.map(l => l[i])));
const gamma = parseInt(totals.map(t => t > input.length / 2 ? '1' : '0').join(''), 2);
const epsilon = parseInt(totals.map(t => t < input.length / 2 ? '1' : '0').join(''), 2);

console.log(gamma * epsilon);

const mostCommon = (inPlace, numbers) => Number(sum(numbers.map(l => l[inPlace])) >= numbers.length / 2);
const ogr = digits[0].reduce((acc, _, i) => {
  if (acc.length === 1) return acc;
  const mostCommonNumber = mostCommon(i, acc);
  return acc.filter(l => l[i] === mostCommonNumber);
}, digits)[0].join('');

const csr = digits[0].reduce((acc, _, i) => {
  if (acc.length === 1) return acc;
  const leastCommonNumber = Number(!mostCommon(i, acc));
  return acc.filter(l => l[i] === leastCommonNumber);
}, digits)[0].join('');

console.log(parseInt(ogr, 2) * parseInt(csr, 2));