import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

interface Slope {
  right: number;
  down: number;
}
const getTestInput = readFileSeparated(
  "\n",
  "03",
  "input-test"
).then((values) =>
  values.map((row) => row.split("").map((v) => (v === "#" ? 1 : 0)))
);
const getInput = readFileSeparated("\n", "03", "input").then((values) =>
  values.map((row) => row.split("").map((v) => (v === "#" ? 1 : 0)))
);

const traverse = (map: number[][], slope: Slope) => {
  let trees = 0;
  let x = 0;
  const width = map[0].length;
  for (let y = slope.down; y < map.length; y += slope.down) {
    x += slope.right;
    while (x >= width) {
      x -= width;
    }
    if (map[y][x] === 1) {
      trees += 1;
    }
  }
  return trees;
};

const test = async (
  pendingInput: number[][] | Promise<number[][]>,
  slope: Slope,
  expectedResult: number
): Promise<void> => {
  const input = await pendingInput;
  const actual = traverse(input, slope);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
  console.log("Test passed");
};

const test2 = async (
  pendingInput: number[][] | Promise<number[][]>,
  slopes: number[][],
  expectedResult: number
): Promise<void> => {
  const input = await pendingInput;
  const actual = slopes
    .map(([right, down]) => ({ right, down }))
    .reduce((sum, slope) => {
      const trees = traverse(input, slope);
      console.log(slope, trees);
      return sum * trees;
    }, 1);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
  console.log("Test passed");
};

const solution: Solution = async () => {
  const input = await getInput;
  return traverse(input, { right: 3, down: 1 });
};

solution.tests = async () => {
  await test(getTestInput, { right: 3, down: 1 }, 7);
  await test2(
    getTestInput,
    [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ],
    336
  );
};

solution.partTwo = async () => {
  const input = await getInput;
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];
  return slopes
    .map(([right, down]) => ({ right, down }))
    .reduce((sum, slope) => {
      const trees = traverse(input, slope);
      console.log(slope, trees);
      return sum * trees;
    }, 1);
};

solution.inputs = [getTestInput, getInput];

export default solution;
