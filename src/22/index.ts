import { readFileSeparated, toInteger, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n\n", "22", "input");
const getTestInput = readFileSeparated("\n\n", "22", "input-test");

const combat = (deckA: number[], deckB: number[]): [number, number[]] => {
  const a = deckA.slice();
  const b = deckB.slice();
  while (a.length > 0 && b.length > 0) {
    const cards = [a, b].map((d) => d.shift()!);
    const highest = Math.max(...cards);
    const lowest = Math.min(...cards);
    const owner = [a, b][cards.findIndex((c) => c === highest)];
    owner.push(highest);
    owner.push(lowest);
  }
  // Return winning index, winning deck
  if (a.length === 0) {
    return [1, b];
  }
  return [0, a];
};

const process = (inputs: string[]) => {
  const playerDecks = inputs.map((input) => {
    const lines = input.split("\n");
    const deck = lines.slice(1).map(toInteger);
    return deck;
  });

  const [winningPlayerIndex, winningDeck] = combat(
    playerDecks[0],
    playerDecks[1]
  );

  const score = winningDeck
    .slice()
    .reverse()
    .reduce((sum, card, i) => sum + card * (i + 1), 0);

  return score;
};

const recursiveCombat = (
  deckA: number[],
  deckB: number[],
  level: number = 1
): [number, number[]] => {
  const a = deckA.slice();
  const b = deckB.slice();

  const stateHistory: string[] = [];

  //console.log(`Recurive combat level ${level}!`);

  while (a.length > 0 && b.length > 0) {
    const state = [a, b].map((d) => d.join(",")).join("/");
    if (stateHistory.includes(state)) {
      return [0, a];
    }
    stateHistory.push(state);

    const cards = [a, b].map((d) => d.shift()!);

    if (a.length >= cards[0] && b.length >= cards[1]) {
      const [winnerIndex] = recursiveCombat(
        a.slice(0, cards[0]),
        b.slice(0, cards[1]),
        level + 1
      );
      const owner = [a, b][winnerIndex];
      owner.push(cards[winnerIndex]);
      owner.push(cards[1 - winnerIndex]);
    } else {
      const highest = Math.max(...cards);
      const lowest = Math.min(...cards);
      const owner = [a, b][cards.findIndex((c) => c === highest)];
      owner.push(highest);
      owner.push(lowest);
    }
  }
  // Return winning index, winning deck
  if (a.length === 0) {
    return [1, b];
  }
  return [0, a];
};

const process2 = (inputs: string[]) => {
  const playerDecks = inputs.map((input) => {
    const lines = input.split("\n");
    const deck = lines.slice(1).map(toInteger);
    return deck;
  });

  const [winningPlayerIndex, winningDeck] = recursiveCombat(
    playerDecks[0],
    playerDecks[1]
  );

  const score = winningDeck
    .slice()
    .reverse()
    .reduce((sum, card, i) => sum + card * (i + 1), 0);

  return score;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const input = await getTestInput;
  await expect(() => process(input), 306);
  await expect(() => process2(input), 291);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput, getTestInput];

export default solution;
