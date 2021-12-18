const { readFileSync } = require('fs');
const { sum } = require('../lib/list');

const input = readFileSync('./input.txt', 'ascii').split(/\r?\n/).map(l => l.split(''));
const binaryString = input.map(l => l.map(c => ('0000' + parseInt(c, 16).toString(2)).slice(-4)).join(''));

function readVersion(bits) {
  const version = parseInt(bits.slice(0, 3), 2);
  return [version, bits.slice(3)];
}

function readPacketTypeId(bits) {
  const packetTypeId = parseInt(bits.slice(0, 3), 2);
  return [packetTypeId, bits.slice(3)];
}

function readLengthTypeId(bits) {
  return [parseInt(bits[0], 2), bits.slice(1)];
}

function readSubPacketLength(bits) {
  return [parseInt(bits.slice(0, 15), 2), bits.slice(15)];
}

function readSubPacketAmount(bits) {
  return [parseInt(bits.slice(0, 11), 2), bits.slice(11)];
}

function readLiteral(bits) {
  let blockIdx = 0;
  while (bits[blockIdx] !== '0') {
    blockIdx += 5;
  }
  const bitBlock = bits.slice(0, blockIdx + 5);
  const rest = bits.slice(blockIdx + 5);
  const n = bitBlock.replace(/.(.{4})/g, '$1');
  return [parseInt(n, 2), rest];
}

function readOperator(bits) {
  const [lengthTypeId, rb1] = readLengthTypeId(bits);
  let subPackets = [];

  if (lengthTypeId === 0) {
    const [length, rb2] = readSubPacketLength(rb1);
    let subPacketBits = rb2.slice(0, length);
    while (subPacketBits.length > 0) {
      const [subPacket, rb3] = readPacket(subPacketBits);
      subPacketBits = rb3;
      subPackets.push(subPacket);
    }
    bits = rb2.slice(length);
  } else {
    const [amount, rb2] = readSubPacketAmount(rb1);
    bits = rb2;
    for (let i = 0; i < amount; i++) {
      const [subPacket, rb3] = readPacket(bits);
      bits = rb3;
      subPackets.push(subPacket);
    }
  }

  return [{
    lengthTypeId,
    subPackets
  }, bits];
}

function readPacket(bits) {
  const [version, rb1] = readVersion(bits);
  const [packetTypeId, rb2] = readPacketTypeId(rb1);
  if (packetTypeId === 4) {
    const [literalValue, remainder] = readLiteral(rb2);
    return [{
      version, packetTypeId, literalValue
    }, remainder];
  } else {
    const [operator, remainder] = readOperator(rb2);
    return [{
      version, packetTypeId, operator
    }, remainder];
  }
}

function sumVersions(packet) {
  if (packet.operator) {
    return packet.version + sum(packet.operator.subPackets.map(sp => sumVersions(sp)));
  } else {
    return packet.version;
  }
}

console.log(binaryString.map(s => sumVersions(readPacket(s)[0])));

const PacketTypeId = {
  SUM: 0,
  PROD: 1,
  MIN: 2,
  MAX: 3,
  LITERAL: 4,
  GT: 5,
  LT: 6,
  EQ: 7,
};

function compute(packet) {
  switch (packet.packetTypeId) {
    case PacketTypeId.SUM:
      return sum(packet.operator.subPackets.map(sp => compute(sp)));
    case PacketTypeId.PROD:
      return packet.operator.subPackets.map(sp => compute(sp))
        .reduce((acc, el) => acc * el, 1);
    case PacketTypeId.MIN:
      return Math.min(...packet.operator.subPackets.map(sp => compute(sp)));
    case PacketTypeId.MAX:
      return Math.max(...packet.operator.subPackets.map(sp => compute(sp)));
    case PacketTypeId.LITERAL:
      return packet.literalValue;
  }

  const [a, b] = packet.operator.subPackets.map(sp => compute(sp));
  switch (packet.packetTypeId) {
    case PacketTypeId.GT:
      return Number(a > b);
    case PacketTypeId.LT:
      return Number(a < b);
    case PacketTypeId.EQ:
      return Number(a === b);
  }
}

console.log(binaryString.map(s => compute(readPacket(s)[0])));
