import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const process = (input: number[], limit: number = 2020): number => {
  const mem: { [key: number]: number[] } = {};

  let last: number | undefined;
  for (let turn = 1; turn <= 2020; turn++) {
    if (turn <= input.length) {
      last = input[turn - 1];
      mem[last] = [turn];
      // console.log(`Turn ${turn}: ${last}`);
      continue;
    }
    let output: number;
    if (last === undefined) {
      throw Error("No last number");
    }
    const m = mem[last];
    // console.log(`Checking for ${last}: ${m}`);
    if (m === undefined || m.length === 1) {
      output = 0;
    } else {
      output = m[0] - m[1];
    }
    // console.log(`Turn ${turn}: ${output}`);
    const prev = mem[output] ? [mem[output][0]] : [];
    mem[output] = [turn, ...prev];
    last = output;
  }

  if (last === undefined) {
    throw Error("No last number");
  }

  return last;
};

const solution: Solution = () => {
  const input = [2, 0, 1, 9, 5, 19];
  return process(input);
};

solution.tests = () => {
  expect(() => process([0, 3, 6]), 436);
  // expect(() => process([0, 3, 6], 30000000), 175594);
};

solution.partTwo = () => {
  const input = [2, 0, 1, 9, 5, 19];
  return -1;
  return process(input, 30000000);
};

solution.inputs = [];

export default solution;
