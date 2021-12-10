const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);

function canonize(segments) {
  return segments.split('').sort().join('');
}

const puzzles = input.map(line => {
  const [patterns, outputs] = line.split(' | ');
  return {
    patterns: patterns.split(' ').map(canonize),
    outputs: outputs.split(' ').map(canonize),
  };
});

console.log(sum(puzzles.map(p => p.outputs.filter(o => o.length === 2 || o.length === 3 || o.length === 4 || o.length === 7).length)));

function digitOverlaps(a, b) {
  return !a.split('').some(s => !b.includes(s));
}

function setSubtract(a, b) {
  return a.split('').filter(s => !b.includes(s)).join('');
}

function solve(puzzle) {
  const one = puzzle.find(n => n.length === 2);
  const seven = puzzle.find(n => n.length === 3);
  const four = puzzle.find(n => n.length === 4);
  const eight = puzzle.find(n => n.length === 7);
  const six = puzzle.find(n => n.length === 6 && !digitOverlaps(one, n));
  const five = puzzle.find(n => n.length === 5 && digitOverlaps(n, six));
  const c = setSubtract(eight, six);
  const e = setSubtract(setSubtract(eight, five), c);
  const nine = puzzle.find(n => n.length === 6 && digitOverlaps(n, setSubtract(eight, e)));
  const f = setSubtract(one, c);
  const two = puzzle.find(n => n.length === 5 && !n.includes(f));
  const zero = puzzle.find(n => n.length === 6 && n !== six && n !== nine);
  const three = puzzle.find(n => n.length === 5 && n !== two && n !== five);

  return {
    [zero]: 0,
    [one]: 1,
    [two]: 2,
    [three]: 3,
    [four]: 4,
    [five]: 5,
    [six]: 6,
    [seven]: 7,
    [eight]: 8,
    [nine]: 9,
  };
};

function decode(puzzle) {
  const digits = solve(puzzle.patterns);
  const answer = puzzle.outputs.map(o => digits[o]);
  return parseInt(answer.join(''));
}

console.log(sum(puzzles.map(decode)));