const { readFileSync } = require('fs');
const { sum, median } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const StatusCode = {
  VALID: 0,
  INCOMPLETE: 1,
  INVALID: 2,
};
const closes = {
  '(': ')',
  '{': '}',
  '[': ']',
  '<': '>',
};
const missingScores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

function validate(line) {
  const stack = [];
  for (const char of line.split('')) {
    if ('({[<'.includes(char)) {
      stack.push(char);
    } else if (')}]>'.includes(char)) {
      const last = stack.pop();
      if (char !== closes[last]) {
        return { code: StatusCode.INVALID, failedOn: char };
      }
    }
  }
  if (stack.length !== 0) {
    return { code: StatusCode.INCOMPLETE, missing: stack.reverse().map(c => closes[c]) };
  }
  return { code: StatusCode.VALID };
}

console.log(
  sum(
    input.map(validate)
      .filter(({ code }) => code === StatusCode.INVALID)
      .map(({ failedOn }) => missingScores[failedOn])
  )
);

const autocompleteScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};
function scoreAutoComplete(missing) {
  return missing.reduce((curr, next) => curr * 5 + autocompleteScores[next], 0);
}

console.log(
  median(
    input.map(validate)
      .filter(({ code }) => code === StatusCode.INCOMPLETE)
      .map(({ missing }) => scoreAutoComplete(missing))
  )
);