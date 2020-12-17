import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const getInput = readFileSeparated("\n", "17", "input");

export const addArrays = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    throw Error("Mismatched array length");
  }
  return a.map((an, i) => an + b[i]);
};

export const getRange = (
  dimensions: number,
  min: number,
  max: number
): number[][] => {
  const range: number[][] = [];
  for (let i = min; i <= max; i++) {
    if (dimensions > 1) {
      const subRanges = getRange(dimensions - 1, min, max);
      subRanges.forEach((sr) => range.push([i, ...sr]));
    } else {
      range.push([i]);
    }
  }
  return range;
};

export const getDimensionalRange = (
  dimensions: number,
  min: number[],
  max: number[]
): number[][] => {
  const range: number[][] = [];
  for (let i = min[0]; i <= max[0]; i++) {
    if (dimensions > 1) {
      const subRanges = getDimensionalRange(
        dimensions - 1,
        min.slice(1),
        max.slice(1)
      );
      subRanges.forEach((sr) => range.push([i, ...sr]));
    } else {
      range.push([i]);
    }
  }
  return range;
};

export class HyperGrid<T> {
  private dimensions: number;
  private defaultValue: T;
  private subGrids = new Map<number, HyperGrid<T>>();
  private data = new Map<number, T>();

  constructor(dimensions: number, defaultValue: T) {
    if (dimensions <= 0) {
      throw Error("Dimensions must be greater than or equal to zero");
    }
    this.dimensions = dimensions;
    this.defaultValue = defaultValue;
  }

  getDimensions() {
    return this.dimensions;
  }

  set(coords: number[], value: T) {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
    const i = coords[0];
    if (this.dimensions > 1) {
      if (!this.subGrids.has(i)) {
        this.subGrids.set(
          i,
          new HyperGrid<T>(this.dimensions - 1, this.defaultValue)
        );
      }
      this.subGrids.get(i)!.set(coords.slice(1), value);
    } else {
      if (this.data.get(i) !== undefined || value !== this.defaultValue) {
        this.data.set(i, value);
      }
    }
  }

  get(coords: number[]): T {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
    const i = coords[0];
    if (this.dimensions > 1) {
      if (this.subGrids.has(i)) {
        return this.subGrids.get(i)!.get(coords.slice(1));
      }
      return this.defaultValue;
    } else {
      const data = this.data.get(i);
      return data !== undefined ? data : this.defaultValue;
    }
  }

  *getAdjacents(coords: number[]) {
    if (coords.length < this.dimensions) {
      throw Error("Coords length must match dimensions");
    }
    const deltas = getRange(this.dimensions, -1, 1).filter(
      (d) => !d.every((n) => n === 0)
    );
    const results: T[] = [];
    for (let delta of deltas) {
      yield this.get(addArrays(coords, delta));
    }
  }

  countAdjacents(
    coords: number[],
    selector: (value: T) => boolean,
    limit?: number
  ) {
    const adjacents = this.getAdjacents(coords);
    let count = 0;
    for (let adjacent of adjacents) {
      if (selector(adjacent)) {
        count++;
        if (limit && count >= limit) {
          break;
        }
      }
    }
    return count;
  }

  count(selector: (value: T | undefined) => boolean): number {
    if (this.dimensions > 1) {
      return Array.from(this.subGrids.values()).reduce(
        (sum, sg) => sum + sg.count(selector),
        0
      );
    } else {
      return Array.from(this.data.values()).filter(selector).length;
    }
  }

  getBounds(): number[][] {
    const keys = this.keys();
    const min = Math.min(...keys);
    const max = Math.max(...keys);
    if (this.dimensions > 1) {
      const subGridBounds = Array.from(this.subGrids.values()).map((sg) =>
        sg.getBounds()
      );
      const [
        minSubGridBounds,
        maxSubGridBounds,
      ]: number[][] = subGridBounds.reduce(([minB, maxB], [minSGB, maxSGB]) => {
        return [
          minSGB.map((sgb, i) =>
            Math.min(minB?.[i] !== undefined ? minB?.[i] : sgb, sgb)
          ),
          maxSGB.map((sgb, i) =>
            Math.max(maxB?.[i] !== undefined ? maxB?.[i] : sgb, sgb)
          ),
        ];
      }, []);
      return [
        [min, ...minSubGridBounds],
        [max, ...maxSubGridBounds],
      ];
    } else {
      return [[min], [max]];
    }
  }

  getOuterBounds(): number[][] {
    const [min, max] = this.getBounds();
    const outerMin = min.map((m) => m - 1);
    const outerMax = max.map((m) => m + 1);
    return [outerMin, outerMax];
  }

  getSize(): number[] {
    const [min, max] = this.getBounds();
    let size: number[] = [];
    max.forEach((m, i) => size.push(m - min[i]));
    return size;
  }

  keys(): number[] {
    if (this.dimensions > 1) {
      return Array.from(this.subGrids.keys());
    } else {
      return Array.from(this.data.keys());
    }
  }

  clone(): HyperGrid<T> {
    const newGrid = new HyperGrid<T>(this.dimensions, this.defaultValue);
    if (this.dimensions > 1) {
      for (let [k, v] of this.subGrids.entries()) {
        newGrid.subGrids.set(k, v.clone());
      }
    } else {
      for (let [k, v] of this.data.entries()) {
        newGrid.data.set(k, v);
      }
    }
    return newGrid;
  }

  prettyPrint() {
    if (this.dimensions > 3) {
      console.warn("No pretty printing above 3 dimensions");
      return;
    }

    const [min, max] = this.getOuterBounds();

    console.log(min, max);
    for (let z = min[0]; z <= max[0]; z++) {
      for (let y = min[1]; y <= max[1]; y++) {
        const line: string[] = [];
        for (let x = min[2]; x <= max[2]; x++) {
          line.push(this.get([z, y, x]) ? "#" : ".");
        }
        console.log(line.join(""));
      }
      console.log("");
    }
  }
}

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
    const points = getDimensionalRange(grid.getDimensions(), min, max);
    points.forEach((p) => {
      const state = grid.get(p);
      const adjacents = grid.countAdjacents(p, (c) => c === true, 4);
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
