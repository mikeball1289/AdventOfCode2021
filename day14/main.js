const { readFileSync } = require('fs');
const { napply, is } = require('../lib/func');
const { zip, uniq, count } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n\r?\n/);
const startingPolymer = input[0].split('');
const replacements = input[1].split(/\r?\n/).map(r => r.split(' -> ')).map(([match, replace]) => [match.split(''), replace]);

function polymerize(polymer, replacements) {
  return [polymer[0], ...zip(polymer, polymer.slice(1)).flatMap(([a, b]) => {
    const replacement = replacements.find(([[ra, rb]]) => ra === a && rb === b);
    if (replacement) {
      return [replacement[1], b];
    } else {
      return [b];
    }
  })];
}

const finalPolymer = napply(polymer => polymerize(polymer, replacements), startingPolymer, 10);
const counts = uniq(finalPolymer).map(l => count(finalPolymer, is(l)));

console.log(Math.max(...counts) - Math.min(...counts));

let pairs = {};
for (const pair of zip(startingPolymer, startingPolymer.slice(1)).map(p => p.join(''))) {
  pairs[pair] = (pairs[pair] ?? 0) + 1;
}

let replacementMap = {};
for (const [match, insert] of replacements) {
  replacementMap[match.join('')] = [match[0] + insert, insert + match[1]];
}

function polymerize2(pairs, replacements) {
  const newPairs = {};
  for (const pair of Object.keys(pairs)) {
    const r = replacements[pair];
    if (!r) {
      newPairs[pair] = (newPairs[pair] ?? 0) + pairs[pair];
    } else {
      newPairs[r[0]] = (newPairs[r[0]] ?? 0) + pairs[pair];
      newPairs[r[1]] = (newPairs[r[1]] ?? 0) + pairs[pair];
    }
  }
  return newPairs;
}

function countLetters(pairs, lastLetter) {
  const counts = {};
  for (const pair of Object.keys(pairs)) {
    const letter = pair.slice(0, 1);
    counts[letter] = (counts[letter] ?? 0) + pairs[pair];
  }
  counts[lastLetter] = (counts[lastLetter] ?? 0) + 1;
  return counts;
}

const finalCounts = countLetters(napply(pairs => polymerize2(pairs, replacementMap), pairs, 40), startingPolymer.slice(-1));

console.log(Math.max(...Object.values(finalCounts)) - Math.min(...Object.values(finalCounts)));
