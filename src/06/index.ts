import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n\n", "06", "input");

const getDistinct = (input: string) => {
  return new Set(input.match(/(\w)/g));
};

const countDistinct = (input: string) => {
  return getDistinct(input).size;
};

const countAnyYes = (input: string[]) => {
  return input.reduce((acc, group) => acc + countDistinct(group), 0);
};

const countAllYes = (input: string[]) => {
  return input.reduce((acc, group) => {
    const distinct = Array.from(getDistinct(group));
    const persons = group.split("\n");
    const count = distinct.filter((d) => persons.every((p) => p.includes(d)))
      .length;
    return acc + count;
  }, 0);
};

const test = (input: string, expectedResult: number) => {
  const inputLines = input.split("\n\n");
  const actual = countAnyYes(inputLines);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const test2 = (input: string, expectedResult: number) => {
  const inputLines = input.split("\n\n");
  const actual = countAllYes(inputLines);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const solution: Solution = async () => {
  const input = await getInput;

  return countAnyYes(input);
};

solution.tests = async () => {
  const testInput = `abc

  a
  b
  c

  ab
  ac

  a
  a
  a
  a

  b`;
  await test(testInput, 11);
  await test2(testInput, 6);
};

solution.partTwo = async () => {
  const input = await getInput;
  return countAllYes(input);
};

solution.inputs = [getInput];

export default solution;
