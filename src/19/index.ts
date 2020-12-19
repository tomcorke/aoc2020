import { readFile, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFile("19", "input");
const getTestInput = readFile("19", "testInput");
const getTestInput2 = readFile("19", "testInput2");

type RuleMatchResult = {
  value: string;
  remaining: string;
};

interface Rule {
  id: string | undefined;
  match(value: string): Iterable<RuleMatchResult>;
}

class StringRule implements Rule {
  id: string | undefined;
  pattern: string;
  constructor(pattern: string) {
    this.pattern = pattern;
  }
  *match(value: string): Iterable<RuleMatchResult> {
    if (value.startsWith(this.pattern)) {
      yield {
        value: value,
        remaining: value.substring(this.pattern.length),
      };
    }
  }
}

class SequenceRule implements Rule {
  id: string | undefined;
  rules: Rule[];
  constructor(rules: Rule[]) {
    this.rules = rules;
  }
  *match(value: string): Iterable<RuleMatchResult> {
    const seqMatch = function* (
      seqValue: string,
      rules: Rule[]
    ): Iterable<RuleMatchResult> {
      const r = rules[0];
      for (const result of r.match(seqValue)) {
        if (rules.length > 1) {
          if (result.remaining.length > 0) {
            const nextRules = rules.slice(1);
            for (const seqResult of seqMatch(result.remaining, nextRules)) {
              yield seqResult;
            }
          }
        } else {
          yield result;
        }
      }
    };
    for (const result of seqMatch(value, this.rules)) {
      yield result;
    }
  }
}

class OrRule implements Rule {
  id: string | undefined;
  rules: Rule[];
  constructor(rules: Rule[]) {
    this.rules = rules;
  }
  *match(value: string): Iterable<RuleMatchResult> {
    for (const rule of this.rules) {
      yield* rule.match(value);
    }
  }
}

class RefRule implements Rule {
  id: string | undefined;
  ref: string;
  ruleMap: RuleMap;
  constructor(ref: string, ruleMap: RuleMap) {
    this.ref = ref;
    this.ruleMap = ruleMap;
  }
  get rule() {
    return this.ruleMap.get(this.ref);
  }
  *match(value: string): Iterable<RuleMatchResult> {
    if (!this.rule) {
      throw Error(`Could not find rule "${this.ref}" in rule map`);
    }
    for (const result of this.rule.match(value)) {
      yield result;
    }
  }
}

type RuleMap = Map<string, Rule>;

const parse = (value: string, rules: RuleMap): Rule => {
  if (value.includes("|")) {
    return new OrRule(value.split("|").map((v) => parse(v.trim(), rules)));
  } else if (value.includes('"')) {
    return new StringRule(value.substring(1, value.length - 1));
  } else if (value.includes(" ")) {
    return new SequenceRule(value.split(" ").map((v) => parse(v, rules)));
  }
  return new RefRule(value, rules);
};

const parseInput = (input: string) => {
  const ruleMap = new Map<string, Rule>();
  const [ruleInput, messages] = input.split("\n\n").map((s) => s.split("\n"));
  ruleInput.forEach((line) => {
    const [ref, ruleDef] = line.split(": ");
    const rule = parse(ruleDef, ruleMap);
    rule.id = ref;
    ruleMap.set(ref, rule);
  });
  return { ruleMap, messages };
};

const process = (input: string) => {
  const { ruleMap, messages } = parseInput(input);
  return messages.filter((m) => {
    let isFullMatch = false;
    for (const result of ruleMap.get("0")!.match(m)) {
      if (result.remaining.length === 0) {
        isFullMatch = true;
        break;
      }
    }
    return isFullMatch;
  }).length;
};

const process2 = (input: string) => {
  const modifiedInput = input
    .replace("\n8: 42\n", "\n8: 42 | 42 8\n")
    .replace("\n11: 42 31\n", "\n11: 42 31 | 42 11 31\n");
  return process(modifiedInput);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;

  await expect(() => process(testInput), 2);
  await expect(() => process(testInput2), 3);
  await expect(() => process2(testInput2), 12);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput, getTestInput];

export default solution;
