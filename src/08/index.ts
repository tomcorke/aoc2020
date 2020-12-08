import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "08", "input");
const getInputFixed = readFileSeparated("\n", "08", "input-fixed");
const getTestInput = readFileSeparated("\n", "08", "input-test");
const getTestInput2 = readFileSeparated("\n", "08", "input-test-2");

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

const runCommand = (
  [cmd, valueString]: [string, string],
  pointer: number,
  acc: number
) => {
  let value = parseInt(valueString.substr(1));
  if (valueString.substr(0, 1) === "-") {
    value = 0 - value;
  }

  switch (cmd) {
    case "nop":
      return [pointer + 1, acc];
    case "acc":
      return [pointer + 1, acc + value];
    case "jmp":
      return [pointer + value, acc];
    default:
      throw Error(`Unrecognised command "${cmd}"`);
  }
};

const process = (input: string[]) => {
  const commands = input.map((i) => i.split(" ") as [string, string]);
  const visited: number[] = [];

  let pointer = 0;
  let accumulator = 0;

  let loops = 0;
  const MAX_LOOPS = 1000000000;

  let exitCode = 0;

  while (true) {
    if (pointer < 0 || pointer >= commands.length) {
      break;
    }
    if (visited.includes(pointer)) {
      exitCode = 1;
      break;
    }
    visited.push(pointer);
    if (loops > MAX_LOOPS) {
      exitCode = 2;
      throw Error("Exceeded arbitrary maximum run time");
    }
    loops += 1;
    [pointer, accumulator] = runCommand(
      commands[pointer],
      pointer,
      accumulator
    );
  }

  return [accumulator, exitCode];
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const input = await getTestInput;
  const input2 = await getTestInput2;
  expect(() => {
    const [result] = process(input);
    return result;
  }, 5);
  expect(() => {
    const [result] = process(input2);
    return result;
  }, 8);
};

solution.partTwo = async () => {
  const input = await getInput;
  for (let i = 0; i < input.length; i++) {
    const cmd = input[i].split(" ")[0];
    const modifiedInput = input.slice();
    if (cmd === "nop") {
      modifiedInput[i] = "jmp" + input[i].substr(3);
    } else if (cmd === "jmp") {
      modifiedInput[i] = "nop" + input[i].substr(3);
    }
    const [result, exitCode] = process(modifiedInput);
    if (exitCode === 0) {
      console.log(
        `Program terminated normally with modification to line ${i + 1}: "${
          input[i]
        }" -> "${modifiedInput[i]}"`
      );
      return result;
    }
  }
  throw Error("Could not find modified input with exit code 0");
};

solution.inputs = [getInput];

export default solution;
