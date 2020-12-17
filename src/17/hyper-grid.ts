const addArrays = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    throw Error("Mismatched array length");
  }
  return a.map((an, i) => an + b[i]);
};

const getRange = (dimensions: number, min: number, max: number): number[][] => {
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

const getRangeGen = function* (
  dimensions: number,
  min: number,
  max: number
): IterableIterator<number[]> {
  for (let i = min; i <= max; i++) {
    if (dimensions > 1) {
      const subRanges = getRangeGen(dimensions - 1, min, max);
      for (let range of subRanges) {
        yield [i, ...range];
      }
    } else {
      yield [i];
    }
  }
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
    if (dimensions < 1) {
      throw Error("Dimensions must be greater than or equal to one");
    }
    this.dimensions = dimensions;
    this.defaultValue = defaultValue;
  }

  getDimensions() {
    return this.dimensions;
  }

  set(coords: number[], value: T) {
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
      this.data.set(i, value);
    }
  }

  get(coords: number[]): T {
    const i = coords[0];
    if (this.dimensions > 1) {
      return this.subGrids.get(i)?.get(coords.slice(1)) ?? this.defaultValue;
    } else {
      return this.data.get(i) ?? this.defaultValue;
    }
  }

  *getAdjacentCoords(coords: number[]) {
    const deltas = getRangeGen(this.dimensions, -1, 1);
    for (let delta of deltas) {
      if (delta.some((n) => n !== 0)) {
        yield addArrays(coords, delta);
      }
    }
  }

  *getActiveRange(
    selector: (value: T | undefined) => boolean
  ): IterableIterator<number[]> {
    if (this.dimensions > 1) {
      for (const [k, subGrid] of this.subGrids.entries()) {
        for (const point of subGrid.getActiveRange(selector)) {
          yield [k, ...point];
        }
      }
    } else {
      for (const [k, v] of this.data.entries()) {
        yield [k];
      }
    }
  }

  makeNeighboursGrid(selector: (value: T | undefined) => boolean) {
    const ag = new HyperGrid<number>(this.dimensions, 0);
    for (const point of this.getActiveRange(selector)) {
      if (selector(this.get(point))) {
        const adjacents = this.getAdjacentCoords(point);
        for (const a of adjacents) {
          ag.set(a, ag.get(a) + 1);
        }
      }
    }
    return ag;
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

  keys(): number[] {
    if (this.dimensions > 1) {
      return Array.from(this.subGrids.keys());
    } else {
      return Array.from(this.data.keys());
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
          minSGB.map((sgb, i) => Math.min(minB?.[i] ?? sgb, sgb)),
          maxSGB.map((sgb, i) => Math.max(maxB?.[i] ?? sgb, sgb)),
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
}
