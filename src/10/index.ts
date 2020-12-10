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
  const sorted = [...adapters].sort((a, b) => a - b);
  let combinations = 1;
  let j = 1;
  const max = Math.max(...sorted);
  while (j < max) {
    const hasPlusOne = sorted.includes(j + 1);
    const hasPlusTwo = sorted.includes(j + 2);
    const hasPlusThree = sorted.includes(j + 3);
    const num = [hasPlusOne, hasPlusTwo, hasPlusThree].filter((b) => b).length;
    combinations += [1, 1, 2, 4][num];
    j++;
  }
  let s = "";
  for (let i = 1; i < max; i++) {
    s = s + (sorted.includes(i) ? ` ${i}` : "");
  }
  console.log(s);
  return combinations;
};

/*

  1 0 0 1 1 1 1 0 0 1 1 1 0 0 1 1 0 0 (1)

  1             7         4       2       1

*/

/*
1 1 1 1 0 0 1 0 0 1 1 0 0 1 1 1 1 1 0 0 1 0 0 1 1 1 0 0 1 1 1 1 0 0 1 0 0 1 1 1 1 1 0 0 1 1 1 1 0
1 1 1 1                         7
        0 0 1                   1
              0 0 1 1           2
                      0 0 1 1 1 1 1                      13
                                    0 0 1                 1
                                          0 0 1 1 1                    4
                                                    0 0 1 1 1 1        7
                                                                0 0 1                               1
                                                                      0 0 1 1 1 1 1                13
                                                                                    0 0 1 1 1 1     7

*/

/*

1 1 1 1 0 0 1 1 1 1 1 0 0 1 0 0 1 1 1 1 0 0 1 1 1 0 0 1 0 0 1 1 1 1 1 0 0 1 1 0 0 1 0 0 1 1 1 1

        7             13    1           7         4     1             13      2     1           7

*/

/// 1 2 3 4
/// 1     4
/// 1   3 4
/// 1 2   4
//      3 4
//    2 3 4
//    2   4

// 1 2 3
// 1   3
//   2 3
//     3

// 1 2 3 4 5   1
// 1 2 3   5   1
// 1 2   4 5
// 1   3 4 5   2
// 1   3   5
// 1     4 5
// 1 2     5   3
//   2 3 4 5
//   2   4 5
//   2 3   5
//   2     5   4
//     3 4 5
//     3   5

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
  return NaN;
};

solution.inputs = [getInput, getTestInput];

export default solution;
