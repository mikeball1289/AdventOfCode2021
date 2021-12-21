const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const startSquares = input.map(l => parseInt(l.match(/\d+$/)[0]) - 1);
let squares = startSquares.slice();
let die = 0;
let scores = [0, 0];
let turn = 0;
let rolls = 0;

while (scores[0] < 1000 && scores[1] < 1000) {
  const move = (die * 3 + 6) % 10;
  die = (die + 3) % 10;
  rolls += 3;
  squares[turn] = (squares[turn] + move) % 10;
  scores[turn] += squares[turn] + 1;
  turn = Number(!turn);
}
console.log(scores[turn] * rolls);

const results = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];

let memo = {};

function v2add(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function playGame(squares, scores, universes, turnPlayer) {
  if (scores[Number(!turnPlayer)] >= 21) {
    return turnPlayer === 0 ? [0, universes] : [universes, 0];
  }
  const key = `${squares[0]},${squares[1]},${scores[0]},${scores[1]},${turnPlayer}`;
  if (memo[key]) {
    return [memo[key][0] * universes, memo[key][1] * universes];
  }
  let winningUnis = [0, 0];
  for (const [move, unis] of results) {
    let sq = squares.slice();
    sq[turnPlayer] = (sq[turnPlayer] + move) % 10;
    let sc = scores.slice();
    sc[turnPlayer] = sc[turnPlayer] + (sq[turnPlayer]) % 10 + 1;
    const res = playGame(sq, sc, unis, Number(!turnPlayer));
    winningUnis = v2add(winningUnis, res);
  }

  memo[key] = winningUnis;
  return [winningUnis[0] * universes, winningUnis[1] * universes];
}

console.log(Math.max(...playGame(startSquares, [0, 0], 1, 0)));
