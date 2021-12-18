const { readFileSync } = require('fs');
const { pairwise } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);

function deepCopy(n) {
  if (isPrimitive(n)) return n;
  return [deepCopy(n[0]), deepCopy(n[1])];
}

function add(a, b) {
  return [a, b];
}

function reduce(n) {
  let result;
  do {
    result = explode(n);
    if (!result) {
      result = split(n);
    }
    if (result) {
      a = result.number;
      // console.log(result.operation);
    }
  } while (result);

  return n;
}

function explode(n) {
  const iter = iterator(n);
  for (let _i = 0; _i < iter.length - 1; _i++) {
    if (iter[_i].length > 4 && iter[_i].length === iter[_i + 1].length) {
      const lval = access(n, iter[_i]);
      if (_i > 0) {
        set(n, iter[_i - 1], val => val + lval);
      }
      const rval = access(n, iter[_i + 1])
      if (_i + 2 < iter.length) {
        set(n, iter[_i + 2], val => val + rval);
      }
      set(n, iter[_i].slice(0, -1), 0);
      return { number: n, operation: `exploded [${lval},${rval}] at ${iter[_i].join('')}` };
    }
  }
  return null;
}

function split(n) {
  const iter = iterator(n);
  for (const i of iter) {
    const v = access(n, i);
    if (v >= 10) {
      set(n, i, [Math.floor(v / 2), Math.ceil(v / 2)]);
      return { number: n, operation: `split ${v} at ${i.join('')}` };
    }
  }
  return null;
}

function iterator(n) {
  if (isPrimitive(n)) return [[]];
  return [...iterator(n[0]).map(s => [0, ...s]), ...iterator(n[1]).map(s => [1, ...s])];
}

function access(n, idx) {
  if (idx.length === 0) return n;
  return access(n[idx[0]], idx.slice(1));
}

function set(n, idx, val) {
  if (idx.length === 1) {
    if (typeof val === 'function') {
      n[idx] = val(n[idx]);
    } else {
      n[idx] = val;
    }
  } else {
    set(n[idx[0]], idx.slice(1), val);
  }
}

function isPrimitive(n) {
  return typeof n === 'number';
}

function magnitude(n) {
  if (isPrimitive(n)) {
    return n;
  }
  return 3 * magnitude(n[0]) + 2 * magnitude(n[1]);
}

const numbers = input.map(l => JSON.parse(l));
const result = numbers.slice(1).reduce((sum, n) => reduce(add(sum, deepCopy(n))), deepCopy(numbers[0]));
console.log(magnitude(result));

const mags = pairwise(numbers).flatMap(([a, b]) =>
  [magnitude(reduce(add(deepCopy(a), deepCopy(b)))), magnitude(reduce(add(deepCopy(b), deepCopy(a))))]
);
console.log(Math.max(...mags));
