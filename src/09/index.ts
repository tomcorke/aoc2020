import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "09", "input").then((values) =>
  values.map((value) => parseInt(value))
);
const getTestInput = readFileSeparated(
  "\n",
  "09",
  "input-test"
).then((values) => values.map((value) => parseInt(value)));

const expect = async <T>(
  test: () => T | Promise<T>,
  expected: T
): Promise<void> => {
  const actual = await test();
  if (actual !== expected) {
    throw Error(
      `Test failed, expected result ${expected}, actual result ${actual}`
    );
  }
};

const process = (values: number[], preambleLength: number = 25) => {
  const preambleValues = values.slice(0, preambleLength);
  const preambleCombinations = preambleValues.map((v) => [
    ...preambleValues.map((v2) => v2 !== v && v + v2),
  ]);
  for (let i = preambleLength; i < values.length; i++) {
    const value = values[i];
    if (!preambleCombinations.some((pc) => pc.includes(value))) {
      return value;
    }
    //update preamble
    preambleValues.shift();
    preambleValues.push(value);
    preambleCombinations.shift();
    preambleCombinations.push(
      preambleValues.map((v2) => v2 !== value && value + v2)
    );
  }
  throw Error("Could not find missing number");
};

const sum = (...values: number[]) => {
  return values.reduce((sum, v) => sum + v, 0);
};

const findContiguous = (values: number[], search: number) => {
  for (let i = 1; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      const subset = values.slice(j, i);
      if (sum(...subset) === search) {
        return Math.min(...subset) + Math.max(...subset);
      }
    }
  }
  throw Error("Could not find numbers that sum to value");
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  expect(() => process(testInput, 5), 127);
  expect(() => findContiguous(testInput, 127), 62);
};

solution.partTwo = async () => {
  const input = await getInput;
  return findContiguous(input, 1504371145);
};

solution.inputs = [getInput, getTestInput];

export default solution;
