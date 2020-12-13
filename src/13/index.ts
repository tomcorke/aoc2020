import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "13", "input");
const getTestInput = readFileSeparated("\n", "13", "input-test");

const process = (input: string[]) => {
  const time = parseInt(input[0]);
  const buses = input[1]
    .split(",")
    .filter((b) => b !== "x")
    .map((b) => parseInt(b));
  let minTime: number | undefined;
  let minBus: number | undefined;
  for (let busNumber of buses) {
    const offset = busNumber - (time % busNumber);
    if (minTime === undefined || offset < minTime) {
      minTime = offset;
      minBus = busNumber;
    }
  }
  if (minTime !== undefined && minBus !== undefined) {
    return minBus * minTime;
  }
};

const process2 = (input: string[]) => {
  return -1;
};

const solution: Solution = async () => {
  const input = await getInput;

  return NaN;
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 295);
  // await expect(() => process2(['', '']), -1);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput, getTestInput];

export default solution;
