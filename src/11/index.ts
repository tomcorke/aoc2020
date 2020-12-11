import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

enum STATE {
  Occupied,
  Empty,
}

interface Seat {
  state: STATE;
  adjacentSeats: Seat[];
}

type SeatRow = (Seat | undefined)[];
type SeatMap = SeatRow[];

const parse = (lines: string[]) => {
  const charLines = lines.map((line) => line.split(""));
  let seatMap: SeatMap = charLines.map((line) => {
    return line.map((c) => {
      switch (c) {
        case "L":
          return { state: STATE.Empty, adjacentSeats: [] };
        case "#":
          return { state: STATE.Occupied, adjacentSeats: [] };
        case ".":
          return undefined;
        default:
          throw Error(`Error mapping seat: "${line}" "${c}"`);
      }
    });
  });
  return seatMap;
};

const getInput = readFileSeparated("\n", "11", "input").then(parse);
const getTestInput = readFileSeparated("\n", "11", "input-test").then(parse);

const getAdjacents = (seatMap: SeatMap): SeatMap => {
  const maxY = seatMap.length - 1;
  const maxX = seatMap[0].length - 1;

  const tryAdd = (x: number, y: number, adjacents: Seat[]) => {
    if (x < 0 || y < 0 || x > maxX || y > maxY) {
      return;
    }
    const seat = seatMap[y][x];
    if (seat) {
      adjacents.push(seat);
    }
  };

  const newSeatMap: SeatMap = [];

  for (let y = 0; y <= maxY; y++) {
    const row: SeatRow = [];
    newSeatMap.push(row);
    for (let x = 0; x <= maxX; x++) {
      const seat = seatMap[y][x];
      if (!seat) {
        row.push(undefined);
        continue;
      }
      const adjacentSeats: Seat[] = [];
      tryAdd(x - 1, y - 1, adjacentSeats);
      tryAdd(x, y - 1, adjacentSeats);
      tryAdd(x + 1, y - 1, adjacentSeats);
      tryAdd(x - 1, y, adjacentSeats);
      tryAdd(x + 1, y, adjacentSeats);
      tryAdd(x - 1, y + 1, adjacentSeats);
      tryAdd(x, y + 1, adjacentSeats);
      tryAdd(x + 1, y + 1, adjacentSeats);
      row.push({ ...seat, adjacentSeats });
    }
  }

  return newSeatMap;
};

const process = (input: SeatMap) => {
  let seatMap = input;

  let changed = true;
  while (changed) {
    const next = getAdjacents(seatMap);
    next.forEach((row) =>
      row.forEach((seat) => {
        if (!seat) {
          return;
        }
        if (
          seat.state === STATE.Empty &&
          seat.adjacentSeats.every((s) => s.state === STATE.Empty)
        ) {
          seat.state = STATE.Occupied;
        } else if (
          seat.state === STATE.Occupied &&
          seat.adjacentSeats.filter((s) => s.state === STATE.Occupied).length >=
            4
        ) {
          seat.state = STATE.Empty;
        }
      })
    );
    const prevStates = seatMap
      .flatMap((row) => row.map((r) => (r ? r.state : ".")))
      .join("");
    const nextStates = next
      .flatMap((row) => row.map((r) => (r ? r.state : ".")))
      .join("");
    changed = prevStates !== nextStates;
    seatMap = next;
  }

  return seatMap
    .flatMap((row) => row)
    .reduce(
      (sum, seat) => sum + (seat && seat.state === STATE.Occupied ? 1 : 0),
      0
    );
};

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

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const input = await getTestInput;
  await expect(() => process(input), 37);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput, getTestInput];

export default solution;
