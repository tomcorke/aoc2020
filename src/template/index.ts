import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated(",", "xx", "input").then((values) =>
  values.map(toNumber)
);

const test = async (pendingInput: any, expectedResult: any): Promise<void> => {
  const input = await pendingInput;
  const actual = 123 as any;
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const solution: Solution = async () => {
  const input = await getInput;

  return NaN;
};

solution.tests = async () => {
  await test(getInput, 123);
};

solution.partTwo = async () => {
  const input = await getInput;

  return NaN;
};

solution.inputs = [getInput];

export default solution;
