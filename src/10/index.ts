import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "10", "input").then((values) =>
  values.map((v) => parseInt(v))
);
const getTestInput = readFileSeparated(
  "\n",
  "10",
  "input-test"
).then((values) => values.map((v) => parseInt(v)));
const getTestInput2 = readFileSeparated(
  "\n",
  "10",
  "input-test-2"
).then((values) => values.map((v) => parseInt(v)));

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

const process = (adapters: number[]) => {
  const deviceAdapter = Math.max(...adapters) + 3;
  const sorted = [...adapters].sort((a, b) => a - b);
  let jumps: number[] = [0, 0, 1];
  let last: number = 0;
  for (let i = 0; i < sorted.length; i++) {
    const diff = sorted[i] - last;
    jumps[diff - 1] += 1;
    last = sorted[i];
  }
  console.log(jumps);
  return jumps[0] * jumps[2];
};

const processBranches = (adapters: number[]) => {
  const sorted = [0, ...adapters].sort((a, b) => a - b);
  let j = 1;
  const max = Math.max(...sorted);
  let s = "";
  for (let i = 0; i <= max; i++) {
    s = s + (sorted.includes(i) ? "1" : "0");
  }
  const sections = s.split("00");
  // console.log("--");
  // console.log(sections.filter((s) => s.length > 2).map((s) => s.slice(1)));
  const combinations = sections
    .filter((s) => s.length > 2)
    .map((s) => {
      const coms = [1, 1, 2, 4, 7, 13];
      return coms[s.length - 1];
    });
  // console.log(combinations);
  const total = combinations.reduce((sum, c) => sum * c, 1);
  // console.log(total);
  return total;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => process(testInput), 35);
  await expect(() => process(testInput2), 220);
  await expect(() => processBranches(testInput), 8);
  await expect(() => processBranches(testInput2), 19208);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processBranches(input);
};

solution.inputs = [getInput, getTestInput];

export default solution;
