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

class HyperGrid<T> {
  private dimensions: number;
  private defaultValue: T;
  private grid: { [index: number]: HyperGrid<T> } = {};
  private gridData: { [index: number]: T } = {};
  constructor(dimensions: number, defaultValue: T) {
    this.dimensions = dimensions;
    this.defaultValue = defaultValue;
  }
  set(coords: number[], value: T) {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
    const i = coords[0];
    if (this.dimensions > 1) {
      if (!this.grid[i]) {
        this.grid[i] = new HyperGrid<T>(this.dimensions - 1, this.defaultValue);
      }
      this.grid[i].set(coords.slice(1), value);
    } else {
      this.gridData[i] = value;
    }
  }
  get(coords: number[]): T {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
    const i = coords[0];
    if (this.dimensions > 1) {
      if (this.grid[i]) {
        return this.grid[i].get(coords.slice(1));
      }
      return this.defaultValue;
    } else {
      return this.gridData[i] || this.defaultValue;
    }
  }
  getAdjacents(coords: number[]) {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
  }
}

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

const clone = (grid: Grid): Grid => {
  return JSON.parse(JSON.stringify(grid)) as Grid;
};
const cloneAndExpand = (grid: Grid): Grid => {
  let newGrid = clone(grid);

  let ySize = grid[0].length;
  let xSize = grid[0][0].length;

  // expand x right
  if (newGrid.some((y) => y.some((x) => x[xSize - 1] === "#"))) {
    newGrid = newGrid.map((z) => z.map((y) => [...y, "."]));
  }

  // expand x left
  if (newGrid.some((y) => y.some((x) => x[0] === "#"))) {
    newGrid = newGrid.map((z) => z.map((y) => [".", ...y]));
  }

  xSize = newGrid[0][0].length;

  // expand y up
  if (newGrid.some((y) => y[0].some((x) => x === "#"))) {
    newGrid = newGrid.map((y) => [Array(xSize).fill("."), ...y]);
    ySize = newGrid[0].length;
  }

  // expand y down
  if (newGrid.some((y) => y[ySize - 1].some((x) => x === "#"))) {
    newGrid = newGrid.map((z) => [...z, Array(xSize).fill(".")]);
    ySize = newGrid[0].length;
  }

  // expand z down
  if (newGrid[0].some((x) => x.some((c) => c === "#"))) {
    const newLayer = Array(ySize);
    for (let i = 0; i < ySize; i++) {
      newLayer[i] = Array(xSize).fill(".");
    }
    newGrid.splice(0, 0, newLayer);
  }

  // expand z up
  const maxZ = newGrid.length;
  if (newGrid[maxZ - 1].some((x) => x.some((c) => c === "#"))) {
    const newLayer = Array(ySize);
    for (let i = 0; i < ySize; i++) {
      newLayer[i] = Array(xSize).fill(".");
    }
    newGrid.splice(maxZ, 0, newLayer);
  }
  return newGrid;
};

const getAdjacents = (grid: Grid, z: number, y: number, x: number) => {
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
  const found = deltas.filter(([dz, dy, dx]) => {
    return grid[z + dz]?.[y + dy]?.[x + dx] === "#";
  });
  // console.log(z, y, x, found);
  return found.length;
};

const process = (input: string[], cycles: number = 6) => {
  let grid: Grid = [input.map((line) => line.split(""))];
  // console.log(`Initial grid:`);
  // prettyPrint(grid);
  for (let i = 0; i < cycles; i++) {
    const newGrid = cloneAndExpand(grid);
    const newGridClone = clone(newGrid);
    const maxZ = newGrid.length;
    const maxY = newGrid[0].length;
    const maxX = newGrid[0][0].length;
    for (let z = 0; z < maxZ; z++) {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          try {
            const g = newGrid[z][y][x];
            const a = getAdjacents(newGrid, z, y, x);
            if (g === "#" && a !== 2 && a !== 3) {
              newGridClone[z][y][x] = ".";
            } else if (g === "." && a === 3) {
              newGridClone[z][y][x] = "#";
            }
          } catch (e) {
            console.log(newGrid);
            console.log(z, y, x);
            throw e;
          }
        }
      }
    }
    grid = newGridClone;
    // console.log(`After cycle ${i + 1}:`);
    // prettyPrint(grid);
  }
  return grid.reduce(
    (zsum, y) =>
      zsum + y.reduce((ysum, x) => ysum + x.filter((c) => c === "#").length, 0),
    0
  );
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
