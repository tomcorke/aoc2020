import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

interface PasswordEntry {
  min: number;
  max: number;
  letter: string;
  password: string;
}

const passwordPattern = /^(\d+)-(\d+) (\w): (\w+)$/;
const parseInputRow = (input: string): PasswordEntry => {
  const [_, min, max, l, p] = input.match(passwordPattern) || [];
  if (!p) {
    throw Error(
      `Unrecognised input: ${input} - ${JSON.stringify(
        input.match(passwordPattern)
      )}`
    );
  }
  const entry: PasswordEntry = {
    min: parseInt(min),
    max: parseInt(max),
    letter: l,
    password: p,
  };
  return entry;
};

const getInput = readFileSeparated("\n", "02", "input").then((values) =>
  values.map(parseInputRow)
);

const testPassword = (p: PasswordEntry) => {
  const count = p.password.split("").filter((c) => c === p.letter).length;
  return count >= p.min && count <= p.max;
};

const testPasswordTwo = (p: PasswordEntry) => {
  const chars = [p.password[p.min - 1], p.password[p.max - 1]];
  return (
    chars.some((c) => c === p.letter) && !chars.every((c) => c === p.letter)
  );
};

const solution: Solution = async () => {
  const input = await getInput;
  return input.map((i) => testPassword(i)).filter((isValid) => isValid).length;
};

const test = async <I extends PasswordEntry>(
  pendingInput: I[] | Promise<I[]>,
  expectedResult: number
): Promise<void> => {
  const input = await pendingInput;
  const actual = input.map((i) => testPassword(i)).filter((isValid) => isValid)
    .length;
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const test2 = async <I extends PasswordEntry>(
  pendingInput: I[] | Promise<I[]>,
  expectedResult: number
): Promise<void> => {
  const input = await pendingInput;
  const actual = input
    .map((inputRow) => {
      const result = testPasswordTwo(inputRow);
      console.log(inputRow, result);
      return result;
    })
    .filter((isValid) => isValid).length;
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

solution.tests = async () => {
  await test(
    ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"].map(parseInputRow),
    2
  );
  await test2(
    ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"].map(parseInputRow),
    1
  );
};

solution.partTwo = async () => {
  const input = await getInput;
  return input.map((i) => testPasswordTwo(i)).filter((isValid) => isValid)
    .length;
};

solution.inputs = [getInput];

export default solution;
