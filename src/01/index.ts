import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "01", "input").then(values =>
  values.map(toNumber)
);

const findTwoNumbersThatSumTo = (input: number[], desiredSum: number) => {
  for(let i = 0; i < input.length - 1; i++) {
    const a = input[i];
    for(let j = i + 1; j < input.length; j++) {
      const b = input[j];
      if (a + b === desiredSum) {
        return [a, b];
      }
    }
  }
  throw Error(`Could not find numbers that sum to ${desiredSum}`);
}

const findThreeNumbersThatSumTo = (input: number[], desiredSum: number) => {
  for(let i = 0; i < input.length - 2; i++) {
    const a = input[i];
    if (a >= 2020) { continue; }
    for(let j = i + 1; j < input.length - 1; j++) {
      const b = input[j];
      if (a + b > 2020) { continue; }
      for(let k = i + j + 1; k < input.length; k++) {
        const c = input[k];
        if (a + b + c === desiredSum) {
          return [a, b, c];
        }
      }
    }
  }
  throw Error(`Could not find numbers that sum to ${desiredSum}`);
}

const solution: Solution = async () => {
  const input = await getInput;
  const [a, b] = findTwoNumbersThatSumTo(input, 2020);
  return [a, b, a * b];
};

const test = async <T extends number>(
  pendingInput: T[] | Promise<T[]>,
  expectedResult: T
): Promise<void> => {
  const input = await pendingInput;

  const [a, b] = findTwoNumbersThatSumTo(input, 2020);
  const actual = a * b;
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const test2 = async <T extends number>(
  pendingInput: T[] | Promise<T[]>,
  expectedResult: T
): Promise<void> => {
  const input = await pendingInput;

  const [a, b, c] = findThreeNumbersThatSumTo(input, 2020);
  const actual = a * b * c;
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

solution.tests = async () => {
  await test([1721, 979, 366, 299, 675, 1456], 514579);
  await test2([1721, 979, 366, 299, 675, 1456], 241861950);
};

solution.partTwo = async () => {
  const input = await getInput;
  const [a, b,c] = findThreeNumbersThatSumTo(input, 2020);
  return [a, b, c, a * b * c];
};

solution.inputs = [getInput];

export default solution;
