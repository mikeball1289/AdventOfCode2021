module.exports.napply = function (fn, initialInput, n) {
  return new Array(n).fill(0).reduce(next => fn(next), initialInput);
}