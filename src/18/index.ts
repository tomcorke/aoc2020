import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const getInput = readFileLines("18", "input");

const PAREN_PATTERN = /\([^()]+\)/g;

const calc = (input: string) => {
  // console.log(input);

  while (true) {
    const parens = input.match(PAREN_PATTERN);
    parens?.forEach((p) => {
      const pr = calc(p.substring(1, p.length - 1));
      const prs = pr.toString();
      // console.log(`${p} = ${prs}`);
      input = input.replace(p, prs);
    });
    if (!parens) {
      break;
    }
  }
  let acc: number = 0;
  let op: string;
  input.split(" ").forEach((s, i) => {
    if (i === 0) {
      acc = parseInt(s, 10);
      return;
    }
    if (["-", "+", "*", "/"].includes(s)) {
      op = s;
    } else {
      const v = parseInt(s, 10);
      // console.log(s, v);
      switch (op) {
        case "*":
          acc = acc * v;
          break;
        case "+":
          acc = acc + v;
          break;
        default:
          throw Error(`Unexpected op ${op}`);
      }
    }
  });
  return acc;
};

const ADD_PATTERN_G = /\-?\d+ \+ \-?\d+/g;
const ADD_PATTERN = /^(\-?\d+) \+ (\-?\d+)$/;

const calc2 = (input: string) => {
  // console.log(input);
  const oi = input;

  while (true) {
    const parens = input.match(PAREN_PATTERN);
    parens?.forEach((p) => {
      const pr = calc2(p.substring(1, p.length - 1));
      const prs = pr.toString();
      // console.log(`${p} = ${prs}`);
      input = input.replace(p, prs);
    });
    if (!parens) {
      break;
    }
  }
  while (true) {
    const adds = input.match(ADD_PATTERN_G);
    adds?.forEach((p) => {
      const ap = p.match(ADD_PATTERN);
      const [, as, bs] = Array.from(ap || []);
      const r = parseInt(as) + parseInt(bs);
      // console.log(`${as} + ${bs} = ${r}`);
      input = input.replace(p, r.toString());
    });
    if (!adds) {
      break;
    }
  }
  let acc: number = 0;
  let op: string;
  input.split(" ").forEach((s, i) => {
    if (i === 0) {
      acc = parseInt(s, 10);
      return;
    }
    if (["-", "+", "*", "/"].includes(s)) {
      op = s;
    } else {
      const v = parseInt(s, 10);
      // console.log(s, v);
      switch (op) {
        case "*":
          acc = acc * v;
          break;
        default:
          throw Error(`Unexpected op ${op}`);
      }
    }
  });
  return acc;
};

const process = (input: string[]) => {
  return input.reduce((sum, line) => sum + calc(line), 0);
};

const process2 = (input: string[]) => {
  return input.reduce((sum, line) => sum + calc2(line), 0);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  await expect(() => process(["2 * 3 + (4 * 5)"]), 26);
  await expect(() => process(["1 + 2 * 3 + 4 * 5 + 6"]), 71);
  await expect(() => process(["5 + (8 * 3 + 9 + 3 * 4 * 3)"]), 437);
  await expect(
    () => process(["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"]),
    12240
  );
  await expect(
    () => process(["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"]),
    13632
  );

  await expect(() => process2(["1 + (2 * 3) + (4 * (5 + 6))"]), 51);
  await expect(() => process2(["2 * 3 + (4 * 5)"]), 46);
  await expect(() => process2(["5 + (8 * 3 + 9 + 3 * 4 * 3)"]), 1445);
  await expect(
    () => process2(["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"]),
    669060
  );
  await expect(
    () => process2(["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"]),
    23340
  );
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput];

export default solution;
