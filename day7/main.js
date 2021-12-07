const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(',').map(e => parseInt(e)).sort((a, b) => a - b);

function requiredFuel(crabs, toPosition) {
  return crabs.reduce((fuel, c) => fuel + Math.abs(c - toPosition), 0);
}

const min = Math.min(...input);
const max = Math.max(...input);

console.log(
  new Array(max - min)
    .fill(0)
    .map((_, i) => i + min)
    .map(e => ([e, requiredFuel(input, e)]))
    .join('\n')
  // .reduce((best, curr) => curr[1] < best[1] ? curr : best, [-1, Infinity])
);

// function median(list) {
//   return input.sort((a, b) => a - b)[Math.ceil(input.length / 2)];
// }

// console.log(input.map((_, i) => requiredFuel(input, i)).join('\n'));
// console.log(requiredFuel(input, 10));
// console.log(requiredFuel(input, median(input)));
// console.log(median(input));
