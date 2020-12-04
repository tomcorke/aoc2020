import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";
import { count } from "console";

interface Passport {
  [key: string]: string;
}
const PASSPORT_FIELDS = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
  "cid",
];

const ALLOWED_MISSING_FIELDS = ["cid"];

const yearRange = (min: number, max: number) => (value: string) => {
  if (value.length !== 4) {
    return false;
  }
  try {
    const vn = parseInt(value);
    return vn >= min && vn <= max;
  } catch (e) {
    return false;
  }
};

const FIELD_VALIDATORS: { [key: string]: (value: string) => boolean } = {
  byr: yearRange(1920, 2002),
  iyr: yearRange(2010, 2020),
  eyr: yearRange(2020, 2030),
  hgt: (v) => {
    const HEIGHT_PATTERN = /^(\d+)(cm|in)$/;
    const m = v.match(HEIGHT_PATTERN);
    if (!m) {
      return false;
    }
    const mn = parseInt(m[1]);
    if (m[2] === "cm") {
      return mn >= 150 && mn <= 193;
    } else if (m[2] === "in") {
      return mn >= 59 && mn <= 76;
    }
    return false;
  },
  hcl: (v) => /^#[0-9a-f]{6}$/.test(v),
  ecl: (v) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
  pid: (v) => /^[0-9]{9}$/.test(v),
};

const parseInput = (values: string[]) => {
  const DATA_PATTERN = /(\w{3}):([#a-z0-9]+)/g;
  return values.map((v) => {
    const ma = v.match(DATA_PATTERN);
    let passport: Passport = {};
    ma &&
      ma.forEach((m) => {
        const [code, value] = m.split(":");
        passport[code] = value;
      });
    return passport;
  });
};
const getInput = readFileSeparated("\n\n", "04", "input").then(parseInput);
const getTestInput = readFileSeparated("\n\n", "04", "input-test").then(
  parseInput
);

const countValidPassports = (
  passports: Passport[],
  withValidation: boolean = false
) => {
  return passports.filter((p) =>
    PASSPORT_FIELDS.every((key) => {
      if (ALLOWED_MISSING_FIELDS.includes(key)) {
        return true;
      }
      if (!p[key]) return false;
      if (!withValidation) return true;
      const valid = FIELD_VALIDATORS[key]?.(p[key]);
      if (!valid) {
        console.log("Invalid field in passport", key, p[key]);
      }
      return valid;
    })
  ).length;
};

const test = async (
  pendingInput: Promise<Passport[]>,
  expectedResult: number
): Promise<void> => {
  const input = await pendingInput;
  const actual = countValidPassports(input);
  if (actual !== expectedResult) {
    throw Error(
      `Test failed, expected result ${expectedResult}, actual result ${actual}`
    );
  }
};

const solution: Solution = async () => {
  const input = await getInput;
  return countValidPassports(input);
};

solution.tests = async () => {
  await test(getTestInput, 2);
};

solution.partTwo = async () => {
  const input = await getInput;
  return countValidPassports(input, true);
};

solution.inputs = [getInput, getTestInput];

export default solution;
