import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const process = (input: number[], limit: number = 2020): number => {
  const m = new Map<number, number>();

  for (let turn = 1; turn <= input.length; turn++) {
    m.set(input[turn - 1], turn);
  }

  let last = input[input.length - 1];
  let lastM = -1;

  for (let turn = input.length + 1; turn <= limit; turn++) {
    last = lastM > 0 ? turn - 1 - lastM : 0;
    lastM = m.get(last) || 0;
    m.set(last, turn);
  }

  return last;
};

const solution: Solution = () => {
  const input = [2, 0, 1, 9, 5, 19];
  return process(input);
};

solution.tests = async () => {
  await expect(() => process([0, 3, 6]), 436);
  expect(() => process([0, 3, 6], 30000000), 175594);
};

solution.partTwo = () => {
  const input = [2, 0, 1, 9, 5, 19];
  return process(input, 30000000);
};

solution.inputs = [];

export default solution;
