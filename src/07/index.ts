import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "07", "input");
const getTestInput = readFileSeparated("\n", "07", "test-input");
const getTestInput2 = readFileSeparated("\n", "07", "test-input-2");

const BAG_PATTERN = /^(\w+\s\w+) bags?/;
const CONTENTS_PATTERN = /(\d+) (\w+\s\w+) bags?/;

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

interface BagTree {}

interface Bag {
  color: string;
  contents: BagContents;
}

interface BagContents {
  [color: string]: number;
}

const extractData = (line: string): Bag => {
  const [containerString, contentsString] = line.split("contain");
  const container = containerString.match(BAG_PATTERN);
  const contents = contentsString
    .split(",")
    .map((c) => c.match(CONTENTS_PATTERN));
  if (!container) {
    throw Error(`Could not parse line: "${line}"`);
  }
  const bagContents: BagContents = {};
  contents.forEach((c) => {
    if (c) {
      bagContents[c[2]] = parseInt(c[1]);
    }
  });
  return {
    color: container[1],
    contents: bagContents,
  };
};

const processBagLines = (lines: string[]) => {
  return lines.map((l) => extractData(l));
};

const findContainersFor = (bags: Bag[], bagColor: string): string[] => {
  const containers = bags
    .filter((b) => Object.keys(b.contents).includes(bagColor))
    .map((c) => c.color);
  const parents: string[] = [];
  containers.forEach((c) => {
    const cParents = findContainersFor(bags, c);
    parents.push(...cParents);
  });
  return [...containers, ...parents];
};

const findNumContainersForBag = (
  bagLines: string[],
  bagColor: string
): number => {
  const bags = processBagLines(bagLines);
  const containers = Array.from(new Set(findContainersFor(bags, bagColor)));
  return containers.length;
};

const findContentsFor = (bags: Bag[], bagColor: string) => {
  const contents = bags.find((b) => b.color === bagColor)?.contents;
  if (!contents) {
    return [];
  }
  const contentBags = Object.entries(contents);
  const resultBags: [string, number][] = [...contentBags];
  contentBags.forEach(([color, num]) => {
    const subContents = findContentsFor(bags, color);
    subContents?.forEach(([subColor, subNum]) => {
      resultBags.push([subColor, subNum * num]);
    });
  });
  return resultBags;
};

const findNumContentsForBag = (bagLines: string[], bagColor: string) => {
  const bags = processBagLines(bagLines);
  const contents = findContentsFor(bags, bagColor);
  const total = contents.reduce((sum, c) => sum + c[1], 0);
  return total;
};

const solution: Solution = async () => {
  const input = await getInput;
  return findNumContainersForBag(input, "shiny gold");
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => findNumContainersForBag(testInput, "shiny gold"), 4);
  await expect(() => findNumContentsForBag(testInput, "shiny gold"), 32);
  await expect(() => findNumContentsForBag(testInput2, "shiny gold"), 126);
};

solution.partTwo = async () => {
  const input = await getInput;
  return findNumContentsForBag(input, "shiny gold");
};

solution.inputs = [getInput];

export default solution;
