const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/);
const connections = input.map(l => l.split('-'));

const NodeType = {
  START: 'START',
  END: 'END',
  BIG: 'BIG',
  SMALL: 'SMALL',
}

class Node {
  constructor(label) {
    this.label = label;
    this.type = label === 'start' ? NodeType.START :
      label === 'end' ? NodeType.END :
        label.match(/^[A-Z]+$/) ? NodeType.BIG :
          NodeType.SMALL;
    this.connects = [];
  }
}

function constructCaves(connections) {
  const system = {};
  for (const [from, to] of connections) {
    const fromCave = system[from] || (system[from] = new Node(from));
    const toCave = system[to] || (system[to] = new Node(to));
    fromCave.connects.push(toCave);
    toCave.connects.push(fromCave);
  }

  return system;
}

function traverse(node, freeVisits = 0, visited = []) {
  if (node.type === NodeType.END) {
    return [[node.label]];
  }
  if (node.type !== NodeType.BIG) {
    visited = [...visited, node.label];
  }
  const freePaths = node.connects
    .filter(n => !visited.includes(n.label))
    .flatMap(n => traverse(n, freeVisits, visited).map(l => ([node.label, ...l])));

  if (freeVisits > 0) {
    const revisitPaths = node.connects
      .filter(n => n.type === NodeType.SMALL && visited.includes(n.label))
      .flatMap(n => traverse(n, freeVisits - 1, visited).map(l => ([node.label, ...l])));

    return [...freePaths, ...revisitPaths];
  } else {
    return freePaths;
  }
}

const system = constructCaves(connections);
console.log(traverse(system['start']).length);

console.log(traverse(system['start'], 1).length);