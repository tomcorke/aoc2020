import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "16", "input");
const getTestInput = readFileSeparated("\n", "16", "input-test");

const process = (input: string[]) => {
  return -1;
};

const solution: Solution = async () => {
  const input = await getInput;

  return NaN;
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 71);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput, getTestInput];

export default solution;
