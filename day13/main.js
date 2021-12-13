const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n\r?\n/).map(part => part.split(/\r?\n/));

const dots = input[0].map(l => l.split(',').map(n => parseInt(n)));
const instructions = input[1].map(l => l.match(/(x|y)=(\d+)/)).map(match => ({ axis: match[1], index: parseInt(match[2]) }));

function fold(dots, instruction) {
  if (instruction.axis === 'x') {
    return dots.map(([x, y]) => x > instruction.index ? [2 * instruction.index - x, y] : [x, y]);
  } else {
    return dots.map(([x, y]) => y > instruction.index ? [x, 2 * instruction.index - y] : [x, y]);
  }
}

function removeDuplicateDots(dots) {
  return dots.filter((d, i) => dots.findIndex(d2 => d[0] === d2[0] && d[1] === d2[1]) === i);
}

console.log(removeDuplicateDots(fold(dots, instructions[0])).length);

function visualize(dots) {
  const block = '█';
  const space = ' ';
  const maxX = Math.max(...dots.map(([x]) => x));
  const maxY = Math.max(...dots.map(([_, y]) => y));
  const map = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));
  return map.map((r, y) => r.map((_, x) => dots.some(([px, py]) => px === x && py === y) ? block : space).join('')).join('\n');
}

const foldedDots = removeDuplicateDots(instructions.reduce((dots, instruction) => fold(dots, instruction), dots))

console.log(visualize(foldedDots));