const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii')
  .split(/\r?\n/)
  .map(l => l.split(' '));
const forward = input
  .filter(l => l[0] === 'forward')
  .map(l => parseInt(l[1], 10));
const depth = input
  .filter(l => l[0] === 'down' || l[0] === 'up')
  .map(l => parseInt(l[1]) * (l[0] === 'up' ? -1 : 1));

console.log(sum(forward) * sum(depth));

let x = 0, y = 0, aim = 0;
for (const [command, unitString] of input) {
  const units = parseInt(unitString, 10);
  switch (command) {
    case 'up':
      aim -= units;
      break;
    case 'down':
      aim += units;
      break;
    case 'forward':
      x += units;
      y += units * aim;
      break;
  }
}

console.log(x * y);