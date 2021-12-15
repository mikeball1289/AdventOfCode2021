module.exports.sum = function (list) {
  return list.reduce((a, b) => a + b, 0);
}

module.exports.pairwise = function (list) {
  return list.flatMap((el1, i) => list.slice(i + 1).map(el2 => [el1, el2]));
}

module.exports.median = function (list) {
  return list.sort((a, b) => a - b)[Math.floor(list.length / 2)];
}

module.exports.zip = function (listA, listB) {
  const l = listA.length > listB.length ? listA.slice(0, listB.length) : listA;
  return l.map((e, i) => [e, listB[i]]);
}

module.exports.count = function (list, by) {
  return list.filter(by).length;
}

module.exports.uniq = function (list) {
  return list.filter((e, i) => list.indexOf(e) === i);
}