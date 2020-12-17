import { readFileLines, expect } from "../helpers";
import { Solution } from "..";

import { HyperGrid, getDimensionalRange } from "./hyper-grid";

const getInput = readFileLines("17", "input");

const process = (input: string[], dimensions: number, cycles: number) => {
  let grid = new HyperGrid<boolean>(dimensions, false);

  // Initialise with 2-dimensional data;
  input.forEach((line, y) => {
    line.split("").forEach((c, x) => {
      const coords = new Array(dimensions);
      coords.fill(0);
      coords[dimensions - 2] = y;
      coords[dimensions - 1] = x;
      grid.set(coords, c === "#");
    });
  });

  for (let cycle = 0; cycle < cycles; cycle++) {
    const newGrid = grid.clone();
    const [min, max] = grid.getOuterBounds();
    const neighbours = grid.makeNeighboursGrid((c) => c === true);
    const points = getDimensionalRange(grid.getDimensions(), min, max);
    points.forEach((p) => {
      const state = grid.get(p);
      const adjacents = neighbours.get(p);
      if (state === true && adjacents !== 2 && adjacents !== 3) {
        newGrid.set(p, false);
      } else if (state === false && adjacents === 3) {
        newGrid.set(p, true);
      }
    });
    grid = newGrid;
    // const gd = points.map((p) => (grid.get(p) ? "#" : "."));
    // console.log(`After cycle ${cycle + 1}:`);
    // grid.prettyPrint();
  }

  return grid.count((c) => c === true);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input, 3, 6);
};

solution.tests = async () => {
  const testInput = `.#.
..#
###`.split("\n");
  await expect(() => process(testInput, 3, 2), 21);
  await expect(() => process(testInput, 3, 6), 112);
  await expect(() => process(testInput, 4, 6), 848);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process(input, 4, 6);
};

solution.inputs = [getInput];

export default solution;
