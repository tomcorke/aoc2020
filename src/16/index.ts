import { readFile, toNumber, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFile("16", "input");
const getTestInput = readFile("16", "input-test");
const getTestInput2 = readFile("16", "input-test-2");

interface Rule {
  name: string;
  ranges: { min: number; max: number }[];
}

const parse = (input: string) => {
  const [rulesInput, ticketInput, otherTicketsInput] = input.split("\n\n");

  const rules: Rule[] = [];
  rulesInput.split("\n").forEach((line) => {
    const [name, rangesInput] = line.split(": ");
    const rule: Rule = { name, ranges: [] };
    rangesInput.split(" or ").forEach((range) => {
      const [min, max] = range.split("-");
      rule.ranges.push({ min: parseInt(min), max: parseInt(max) });
    });
    rules.push(rule);
  });

  const ticket = ticketInput.split("\n")[1].split(",").map(toNumber);

  const otherTickets = otherTicketsInput
    .split("\n")
    .slice(1)
    .map((line) => line.split(",").map(toNumber));

  return { rules, ticket, otherTickets };
};

const sum = (values: number[]) => values.reduce((s, v) => s + v, 0);
const sumOver = <T>(items: T[], selector: (values: T) => number[]) => {
  return items.reduce((s, i) => s + sum(selector(i)), 0);
};

const process = (input: string) => {
  const { rules, ticket, otherTickets } = parse(input);

  const invalidTicketValues = otherTickets
    .map((t) =>
      t.filter(
        (num) =>
          !rules.some((rule) =>
            rule.ranges.some((range) => num >= range.min && num <= range.max)
          )
      )
    )
    .filter((t) => t.length > 0);

  return sumOver(invalidTicketValues, (t) => t);
};

const process2 = (
  input: string,
  ruleFilter: (rule: Rule) => boolean = (r) => true
) => {
  const { rules, ticket, otherTickets } = parse(input);

  const validTickets = otherTickets.filter((t) =>
    t.every((v) =>
      rules.some((rule) =>
        rule.ranges.some((range) => v >= range.min && v <= range.max)
      )
    )
  );

  const ticketLength = ticket.length;

  let possibleRules: Rule[][] = [];

  for (let i = 0; i < ticketLength; i++) {
    const values = validTickets.map((t) => t[i]);
    let validRules = rules.filter((rule) =>
      values.every((v) => rule.ranges.some((r) => v >= r.min && v <= r.max))
    );
    possibleRules.push(validRules);
  }

  let reduces = 0;
  while (possibleRules.some((pr) => pr.length > 1)) {
    const singleRules = possibleRules.filter((pr) => pr.length === 1);
    possibleRules = possibleRules.map((pr) => {
      if (pr.length === 1) {
        return pr;
      }
      return pr.filter((r) => !singleRules.some((sr) => sr.includes(r)));
    });
    reduces++;
    if (reduces > 1000) {
      throw Error("Something has gone horribly wrong");
    }
  }

  const matchingRules = possibleRules.map((pr) => pr[0]);

  const answer = matchingRules.reduce((sum, rule, i) => {
    if (ruleFilter(rule)) {
      // console.log(`${rule.name} (${i}): ${ticket[i]}`);
      return sum * ticket[i];
    }
    return sum;
  }, 1);

  return answer;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => process(testInput), 71);
  await expect(() => process2(testInput2), 12 * 11 * 13);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input, (rule) => rule.name.startsWith("departure"));
};

solution.inputs = [getInput, getTestInput, getTestInput2];

export default solution;
