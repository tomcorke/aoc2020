import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "05", "input");

const binaryFilter = (
  min: number,
  max: number,
  lowerSelector: string,
  upperSelector: string,
  code: string
): number => {
  code.split("").forEach((c) => {
    if (c === lowerSelector) {
      max = min + Math.floor((max - min) / 2);
    } else if (c === upperSelector) {
      min = Math.ceil((max - min) / 2 + min);
    } else {
      throw Error(
        `Unexpected character "${c}" in code "${code}", expected "${lowerSelector}" or "${upperSelector}"`
      );
    }
  });
  if (min !== max) {
    throw Error("Unexpected unresolved filter");
  }
  return min;
};

const getSeat = (code: string): number => {
  const rowCode = code.substr(0, 7);
  const colCode = code.substr(7, 3);
  const row = binaryFilter(0, 127, "F", "B", rowCode);
  const col = binaryFilter(0, 7, "L", "R", colCode);
  return row * 8 + col;
};

const test = async (code: string, expectedResult: number): Promise<void> => {
  const actual = getSeat(code);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const solution: Solution = async () => {
  const input = await getInput;

  const seatIds = input.map((code) => getSeat(code));
  return Math.max(...seatIds);
};

solution.tests = async () => {
  await test("FBFBBFFRLR", 357);
  await test("BFFFBBFRRR", 567);
  await test("FFFBBBFRRR", 119);
  await test("BBFFBBFRLL", 820);
};

solution.partTwo = async () => {
  const input = await getInput;

  const seatIds = input.map((code) => getSeat(code));
  const max = Math.max(...seatIds);
  const min = Math.min(...seatIds);
  for (let i = min; i <= max; i++) {
    if (!seatIds.includes(i)) {
      return i;
    }
  }

  return NaN;
};

solution.inputs = [getInput];

export default solution;
