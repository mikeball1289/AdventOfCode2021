module.exports.sum = function (list) {
  return list.reduce((a, b) => a + b, 0);
}

module.exports.pairwise = function (list) {
  return list.flatMap((el1, i) => list.slice(i + 1).map(el2 => [el1, el2]));
}

module.exports.median = function (list) {
  return list.sort((a, b) => a - b)[Math.floor(list.length / 2)];
}