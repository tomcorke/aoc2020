import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

enum STATE {
  Occupied = 1,
  Empty = 0,
  Floor = -1,
}

type SeatRow = STATE[];
type SeatMap = SeatRow[];

const parse = (lines: string[]) => {
  const charLines = lines.map((line) => line.split(""));
  let seatMap: SeatMap = charLines.map((line) => {
    return line.map((c) => {
      switch (c) {
        case "L":
          return STATE.Empty;
        case "#":
          return STATE.Occupied;
        case ".":
          return STATE.Floor;
        default:
          throw Error(`Error mapping seat: "${line}" "${c}"`);
      }
    });
  });
  return seatMap;
};

const getInput = readFileSeparated("\n", "11", "input").then(parse);
const getTestInput = readFileSeparated("\n", "11", "input-test").then(parse);

const getAdjacents = (seatMap: SeatMap, x: number, y: number) => {
  const maxY = seatMap.length - 1;
  const maxX = seatMap[0].length - 1;
  let checks: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  return checks.filter(([dx, dy]) => {
    return seatMap[y + dy]?.[x + dx] === STATE.Occupied;
  }).length;
};

const getVisibleAdjacents = (seatMap: SeatMap, x: number, y: number) => {
  const maxY = seatMap.length - 1;
  const maxX = seatMap[0].length - 1;
  let checks: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  const inc = (v: [number, number], i: [number, number]): [number, number] => [
    v[0] + i[0],
    v[1] + i[1],
  ];
  return checks.filter(([dx, dy]) => {
    let offset: [number, number] = [dx, dy];
    while (true) {
      const seat = seatMap[y + offset[1]]?.[x + offset[0]];
      if (seat === undefined) {
        return false;
      }
      if (seat !== STATE.Floor) {
        return seat === STATE.Occupied;
      }
      offset = inc(offset, [dx, dy]);
    }
    return false;
  }).length;
};

const isEqualSeatMap = (a: SeatMap, b: SeatMap) => {
  const maxY = a.length - 1;
  const maxX = a[0].length - 1;
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (a[y][x] !== b[y][x]) {
        return false;
      }
    }
  }
  return true;
};

const cloneSeatMap = (original: SeatMap) => {
  return original.map((row) => [...row]);
};

const prettyPrint = (seatMap: SeatMap) => {
  seatMap.forEach((row) => {
    console.log(
      row
        .map((seat) => {
          switch (seat) {
            case STATE.Occupied:
              return "L";
            case STATE.Empty:
              return "#";
            case STATE.Floor:
              return ".";
            default:
              return "_";
          }
        })
        .join("")
    );
  });
  console.log("");
};

const process = (
  input: SeatMap,
  getAdjacentsFn = getAdjacents,
  tolerance: number = 4
) => {
  const maxY = input.length - 1;
  const maxX = input[0].length - 1;

  let seatMap = cloneSeatMap(input);
  let changed = true;

  while (changed) {
    const next = cloneSeatMap(seatMap);
    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        const seat = seatMap[y][x];
        if (seat === STATE.Floor) {
          continue;
        }
        const adjacents = getAdjacentsFn(seatMap, x, y);
        if (seat === STATE.Empty && adjacents === 0) {
          next[y][x] = STATE.Occupied;
        } else if (seat === STATE.Occupied && adjacents >= tolerance) {
          next[y][x] = STATE.Empty;
        }
      }
    }
    changed = !isEqualSeatMap(seatMap, next);
    seatMap = next;

    // prettyPrint(seatMap);
  }

  return seatMap
    .flatMap((row) => row)
    .reduce((sum, seat) => sum + (seat === STATE.Occupied ? 1 : 0), 0);
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

  console.log("Test part 1...");
  await expect(() => process(input), 37);
  console.log("Test part 2...");
  await expect(() => process(input, getVisibleAdjacents, 5), 26);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process(input, getVisibleAdjacents, 5);
};

solution.inputs = [getTestInput];

export default solution;
