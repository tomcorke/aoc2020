import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "14", "input");
const getTestInput = readFileSeparated("\n", "14", "input-test");
const getTestInput2 = readFileSeparated("\n", "14", "input-test-2");

const applyMasks = (value: number, orMask: number, andMask: number): number => {
  return Number((BigInt(value) | BigInt(orMask)) & BigInt(andMask));
};

const process = (inputs: string[]) => {
  let positiveMaskValue: number | undefined;
  let negativeMaskValue: number | undefined;
  // or the positive
  // and the negative

  const memory: { [key: number]: number } = {};

  inputs.forEach((line) => {
    if (line.startsWith("mask =")) {
      const maskString = line.match(/^mask = ([X01]+)$/)![1];
      const positiveMaskString = maskString
        .split("")
        .map((m) => (m === "1" ? "1" : "0"))
        .join("");
      const negativeMaskString = maskString
        .split("")
        .map((m) => (m === "0" ? "0" : "1"))
        .join("");
      positiveMaskValue = parseInt(positiveMaskString, 2);
      negativeMaskValue = parseInt(negativeMaskString, 2);
    } else {
      if (positiveMaskValue === undefined || negativeMaskValue === undefined) {
        throw Error("Expected to have masks!");
      }
      const assignmentString = line.match(/^mem\[(\d+)\] = (\d+)$/)!;
      const [, addressString, valueString] = assignmentString;
      const addressValue = parseInt(addressString);
      const originalValue = parseInt(valueString);
      const value = applyMasks(
        originalValue,
        positiveMaskValue,
        negativeMaskValue
      );
      memory[addressValue] = value;
    }
  });

  // console.log(memory);
  return Object.values(memory).reduce((sum, value) => sum + value, 0);
};

const permutMask = (mask: string[]): string[][] => {
  const i = mask.indexOf("X");
  if (i > -1) {
    mask[i] = "1";
    const withOne = mask.slice();
    mask[i] = "0";
    const withZero = mask.slice();
    return [...permutMask(withOne), ...permutMask(withZero)];
  } else {
    return [mask];
  }
};

const applyMasks2 = (
  value: number,
  orMask: number,
  wildMask: number
): number[] => {
  const fixedValue = (BigInt(value) | BigInt(orMask)) & ~BigInt(wildMask);

  const wildMasks = permutMask(
    wildMask.toString(2).replace(/1/g, "X").split("")
  );
  const wildValues = wildMasks.map((m) => parseInt(m.join(""), 2));
  return wildValues.map((w) => Number(BigInt(w) | fixedValue));
};

const process2 = (inputs: string[]) => {
  let _maskString: string | undefined;
  let positiveMaskValue: number | undefined;
  let wildMaskValue: number | undefined;
  // or the positive

  const memory: { [key: number]: number } = {};

  inputs.forEach((line) => {
    if (line.startsWith("mask =")) {
      const maskString = line.match(/^mask = ([X01]+)$/)![1];
      _maskString = maskString;
      const positiveMaskString = maskString
        .split("")
        .map((m) => (m === "1" ? "1" : "0"))
        .join("");
      const wildMaskString = maskString
        .split("")
        .map((m) => (m === "X" ? "1" : "0"))
        .join("");
      positiveMaskValue = parseInt(positiveMaskString, 2);
      wildMaskValue = parseInt(wildMaskString, 2);
    } else {
      if (positiveMaskValue === undefined || wildMaskValue === undefined) {
        throw Error("Expected to have masks!");
      }
      const assignmentString = line.match(/^mem\[(\d+)\] = (\d+)$/)!;

      const [, addressString, valueString] = assignmentString;
      const originalAddressValue = parseInt(addressString);
      const value = parseInt(valueString);
      const addressValues = applyMasks2(
        originalAddressValue,
        positiveMaskValue,
        wildMaskValue
      );
      addressValues.forEach((addressValue) => {
        /*
        console.log(
          addressValue.toString(2).padStart(36, "0"),
          addressValue,
          value
        );
        */
        memory[addressValue] = value;
      });
    }
  });

  // console.log(memory);
  return Object.values(memory).reduce((sum, value) => sum + value, 0);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => process(testInput), 165);
  await expect(() => process2(testInput2), 208);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput, getTestInput, getTestInput2];

export default solution;
