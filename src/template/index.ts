import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "xx", "input").then(
  (values) => values
);

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

const solution: Solution = async () => {
  const input = await getInput;

  return NaN;
};

solution.tests = async () => {
  await expect(() => 123, 123);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput];

export default solution;
