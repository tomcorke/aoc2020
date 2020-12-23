import { expect, toInteger } from "../helpers";
import { Solution } from "..";

class Node {
  value: number;
  next: Node;
  constructor(value: number) {
    this.value = value;
    this.next = this;
  }
}

const moveNodes = (
  currentNode: Node,
  nodeMap: Map<number, Node>,
  max: number
) => {
  const selected = [
    currentNode.next,
    currentNode.next.next,
    currentNode.next.next.next,
  ];
  currentNode.next = selected[2].next;

  let destination = currentNode.value - 1;
  while (destination < 1 || selected.some((c) => c.value === destination)) {
    destination -= 1;
    if (destination < 1) {
      destination = max;
    }
  }

  const destinationNode = nodeMap.get(destination)!;
  const destNext = destinationNode.next;
  destinationNode.next = selected[0];
  selected[2].next = destNext;

  return currentNode.next;
};

const cupsToNodes = (cups: number[]) => {
  const nodes = cups.map((c) => new Node(c));
  const nodeMap = new Map<number, Node>();
  nodes.forEach((node, i) => {
    nodeMap.set(node.value, node);
    node.next = nodes[i + 1] || nodes[0];
  });
  return { nodes, nodeMap };
};

const process = (input: string, moves: number = 100) => {
  let cups = input.split("").map(toInteger);
  const { nodes, nodeMap } = cupsToNodes(cups);
  const maxCup = Math.max(...cups);

  let currentNode = nodes[0];
  for (let i = 0; i < moves; i++) {
    currentNode = moveNodes(currentNode, nodeMap, maxCup);
  }
  const nodeOne = nodeMap.get(1)!;
  let results: number[] = [];
  let nextNode = nodeOne.next;
  while (nextNode !== nodeOne) {
    results.push(nextNode.value);
    nextNode = nextNode.next;
  }
  return results.join("");
};

const process2 = (input: string) => {
  let cups = input.split("").map(toInteger);
  let index = 0;

  const totalCups = 1000000;
  cups = cups.concat(
    Array(totalCups - cups.length)
      .fill(0)
      .map((_, i) => i + cups.length + 1)
  );

  const { nodes, nodeMap } = cupsToNodes(cups);
  const maxCup = totalCups;

  let currentNode = nodes[0];
  const moves = 10000000;
  for (let i = 0; i < moves; i++) {
    currentNode = moveNodes(currentNode, nodeMap, maxCup);
  }

  const nodeOne = nodeMap.get(1)!;
  const results = [nodeOne.next.value, nodeOne.next.next.value];
  console.log(results);
  return results.reduce((sum, v) => sum * v, 1);
};

const solution: Solution = async () => {
  return process("135468729");
};

solution.tests = async () => {
  await expect(() => process("389125467", 10), "92658374");
  await expect(() => process("389125467"), "67384529");
  await expect(() => process2("389125467"), 149245887792);
};

solution.partTwo = async () => {
  return process2("135468729");
};

solution.inputs = [];

export default solution;
