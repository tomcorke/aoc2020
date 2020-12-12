import { readFileSeparated, toNumber } from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "12", "input");

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

const process = (input: string[]) => {
  let x = 0;
  let y = 0;
  let facing = [1, 0];

  const move = (dx: number, dy: number, m: number) => {
    x += dx * m;
    y += dy * m;
  };

  const turnLeft = (degrees: number) => {
    if (degrees % 90 !== 0) {
      throw Error("Non-90-degree turn!");
    }
    while (degrees > 0) {
      const fx = facing[0];
      const fy = facing[1];
      facing[1] = 0 - fx;
      facing[0] = fy;
      degrees -= 90;
    }
  };

  const turnRight = (degrees: number) => {
    if (degrees % 90 !== 0) {
      throw Error("Non-90-degree turn!");
    }
    while (degrees > 0) {
      const fx = facing[0];
      const fy = facing[1];
      facing[1] = fx;
      facing[0] = 0 - fy;
      degrees -= 90;
    }
  };

  input.forEach((i) => {
    const c = i[0];
    const v = parseInt(i.substr(1), 10);
    switch (c) {
      case "N":
        move(0, -1, v);
        break;
      case "S":
        move(0, 1, v);
        break;
      case "E":
        move(1, 0, v);
        break;
      case "W":
        move(-1, 0, v);
        break;
      case "L":
        turnLeft(v);
        break;
      case "R":
        turnRight(v);
        break;
      case "F":
        move(facing[0], facing[1], v);
        break;
    }
  });
  return Math.abs(x) + Math.abs(y);
};

const processWaypoint = (input: string[], wx: number, wy: number) => {
  let x = 0;
  let y = 0;
  let waypoint = [wx, wy];

  const moveWaypoint = (dx: number, dy: number, m: number) => {
    waypoint[0] += dx * m;
    waypoint[1] += dy * m;
  };

  const moveShipToWaypoint = (m: number) => {
    const wx = waypoint[0];
    const wy = waypoint[1];
    x += wx * m;
    y += wy * m;
  };

  const turnLeft = (degrees: number) => {
    if (degrees % 90 !== 0) {
      throw Error("Non-90-degree turn!");
    }
    while (degrees > 0) {
      const fx = waypoint[0];
      const fy = waypoint[1];
      waypoint[1] = 0 - fx;
      waypoint[0] = fy;
      degrees -= 90;
    }
  };

  const turnRight = (degrees: number) => {
    if (degrees % 90 !== 0) {
      throw Error("Non-90-degree turn!");
    }
    while (degrees > 0) {
      const fx = waypoint[0];
      const fy = waypoint[1];
      waypoint[1] = fx;
      waypoint[0] = 0 - fy;
      degrees -= 90;
    }
  };

  input.forEach((i) => {
    const c = i[0];
    const v = parseInt(i.substr(1), 10);
    switch (c) {
      case "N":
        moveWaypoint(0, -1, v);
        break;
      case "S":
        moveWaypoint(0, 1, v);
        break;
      case "E":
        moveWaypoint(1, 0, v);
        break;
      case "W":
        moveWaypoint(-1, 0, v);
        break;
      case "L":
        turnLeft(v);
        break;
      case "R":
        turnRight(v);
        break;
      case "F":
        moveShipToWaypoint(v);
        break;
    }
  });
  return Math.abs(x) + Math.abs(y);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = `F10
N3
F7
R90
F11`.split("\n");

  await expect(() => process(testInput), 25);
  await expect(() => processWaypoint(testInput, 10, -1), 286);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processWaypoint(input, 10, -1);
};

solution.inputs = [getInput];

export default solution;
