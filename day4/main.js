const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n\r?\n/);
const [callsString, ...boardStrings] = input;
const calls = callsString.split(',').map(e => parseInt(e, 10));

class Board {
  constructor(fromString) {
    this.cells = fromString.split(/\r?\n/).map(l => l.trim().split(/\s+/).map(e => parseInt(e, 10)));
    this.hasWon = false;
  }

  mark(n) {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (this.cells[x][y] === n) {
          this.cells[x][y] = -1;
          return this.checkForWinAtXY(x, y);
        }
      }
    }
    return false;
  }

  checkForWinAtX(x) {
    for (let i = 0; i < 5; i++) {
      if (this.cells[x][i] !== -1) return false;
    }
    return true;
  }

  checkForWinAtY(y) {
    for (let i = 0; i < 5; i++) {
      if (this.cells[i][y] !== -1) return false;
    }
    return true;
  }

  checkForWinAtXY(x, y) {
    return this.hasWon = (this.checkForWinAtX(x) || this.checkForWinAtY(y));
  }

  score() {
    return sum(this.cells.map(row => sum(row.filter(cell => cell >= 0))));
  }
}

let boards = boardStrings.map(bs => new Board(bs));
for (let call of calls) {
  for (let board of boards) {
    if (board.mark(call)) {
      console.log(board.score() * call);
    }
  }
  boards = boards.filter(b => !b.hasWon);
}