import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "13", "input");
const getTestInput = readFileSeparated("\n", "13", "input-test");

const process = (input: string[]) => {
  const time = parseInt(input[0]);
  const buses = input[1]
    .split(",")
    .filter((b) => b !== "x")
    .map((b) => parseInt(b));
  let minTime: number | undefined;
  let minBus: number | undefined;
  for (let busNumber of buses) {
    const offset = busNumber - (time % busNumber);
    if (minTime === undefined || offset < minTime) {
      minTime = offset;
      minBus = busNumber;
    }
  }
  if (minTime !== undefined && minBus !== undefined) {
    return minBus * minTime;
  }
  throw Error("Could not find bus");
};

const process2 = (input: string[]) => {
  const buses = input[1]
    .split(",")
    .map((b, i) => ({ number: b === "x" ? -1 : parseInt(b), offset: i }))
    .filter((b) => b.number !== -1);
  const firstBus = buses[0];
  const otherBuses = buses.slice(1);

  let startTime = 0;
  let timeIter = firstBus.number;

  let loops = 0;
  while (true) {
    startTime += timeIter;
    const iterParts = [firstBus.number];
    for (let ob of otherBuses) {
      if ((startTime + ob.offset) % ob.number === 0) {
        iterParts.push(ob.number);
        const mul = iterParts.reduce((sum, p) => sum * p, 1);
        if (mul > timeIter) {
          timeIter = mul;
        }
      } else {
        break;
      }
    }
    if (otherBuses.every((ob) => (startTime + ob.offset) % ob.number === 0)) {
      return startTime;
    }
    loops++;
    if (loops > 100000) {
      break;
    }
  }

  throw Error("Could not find answer in reasonable time");
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 295);
  await expect(() => process2(testInput), 1068781);
  await expect(() => process2(["", "17,x,13,19"]), 3417);
  await expect(() => process2(["", "67,7,59,61"]), 754018);
  await expect(() => process2(["", "67,x,7,59,61"]), 779210);
  await expect(() => process2(["", "67,7,x,59,61"]), 1261476);
  await expect(() => process2(["", "1789,37,47,1889"]), 1202161486);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput, getTestInput];

export default solution;
