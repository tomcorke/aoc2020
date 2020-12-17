import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "17", "input");

type Grid = string[][][];

const prettyPrint = (grid: Grid) => {
  for (let z of grid) {
    for (let y of z) {
      console.log(y.join(""));
    }
    console.log("");
  }
  console.log("-");
  console.log("");
};

const addLayers = (grid: Grid): Grid => {
  const ySize = grid[0].length;
  const xSize = grid[0][0].length;
  let newGrid = grid.slice();
  if (grid[0].some((y) => y.some((x) => x === "#"))) {
    const newLayer = Array(ySize);
    for (let i = 0; i < xSize; i++) {
      newLayer[i] = Array(xSize).fill(".");
    }
    newGrid.splice(0, 0, newLayer);
  }
  const maxZ = newGrid.length;
  if (newGrid[maxZ - 1].some((y) => y.some((x) => x === "#"))) {
    const newLayer = Array(ySize);
    for (let i = 0; i < xSize; i++) {
      newLayer[i] = Array(xSize).fill(".");
    }
    newGrid.splice(maxZ, 0, newLayer);
  }
  return newGrid;
};

const getAdjacents = (grid: Grid, x: number, y: number, z: number) => {
  const deltas: [number, number, number][] = [
    [-1, -1, -1],
    [-1, -1, 0],
    [-1, -1, 1],
    [-1, 0, -1],
    [-1, 0, 0],
    [-1, 0, 1],
    [-1, 1, -1],
    [-1, 1, 0],
    [-1, 1, 1],
    [0, -1, -1],
    [0, -1, 0],
    [0, -1, 1],
    [0, 0, -1],
    // [0, 0, 0],
    [0, 0, 1],
    [0, 1, -1],
    [0, 1, 0],
    [0, 1, 1],
    [1, -1, -1],
    [1, -1, 0],
    [1, -1, 1],
    [1, 0, -1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, -1],
    [1, 1, 0],
    [1, 1, 1],
  ];
  return deltas.filter(([dx, dy, dz]) => {
    return grid[z + dz]?.[y + dy]?.[x + dx] === "#";
  }).length;
};

const process = (input: string[], cycles: number = 6) => {
  const grid: Grid = [input.map((line) => line.split(""))];
  const ng = addLayers(grid);
  // ng[2][1][1] = "#";
  const a = getAdjacents(ng, 1, 1, 2);
  console.log(a);
  prettyPrint(ng);
  return -1;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input, 6);
};

solution.tests = async () => {
  const testInput = `.#.
..#
###`.split("\n");
  await expect(() => process(testInput, 6), 112);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput];

export default solution;
