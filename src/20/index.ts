import * as fs from "fs";

import { readFile, expect } from "../helpers";
import { Solution } from "..";

const getInput = readFile("20", "input");
const getTestInput = readFile("20", "input-test");

const reverse = (value: string) => value.split("").reverse().join("");

const parseAsBinary = (value: string) =>
  parseInt(
    value
      .split("")
      .map((v) => (v === "#" ? 1 : 0))
      .join(""),
    2
  );

const stringSquareFlipH = (lines: string[]) => {
  if (!lines.every((line) => line.length === lines.length)) {
    throw Error("Must be square");
  }
  return lines.map((line) => reverse(line));
};

const stringSquareFlipV = (lines: string[]) => {
  if (!lines.every((line) => line.length === lines.length)) {
    throw Error("Must be square");
  }
  return lines.slice().reverse();
};

const stringSquareRot = (lines: string[]) => {
  if (!lines.every((line) => line.length === lines.length)) {
    throw Error("Must be square");
  }
  const size = lines[0].length;
  const la = lines.map((l) => l.split(""));
  const rl: string[] = [];
  for (let y = 0; y < size; y++) {
    const l: string[] = [];
    for (let x = 0; x < size; x++) {
      l.push(la[size - x - 1][y]);
    }
    rl.push(l.join(""));
  }
  return rl;
};

class Tile {
  tileGroup: TileGroup | undefined;
  lines: string[];
  private topString: string;
  private bottomString: string;
  private leftString: string;
  private rightString: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
  constructor(lines: string[]) {
    this.lines = lines;
    const topString = lines[0];
    const rightString = lines.map((line) => line.split("")[9]).join("");
    const bottomString = lines[9];
    const leftString = lines.map((line) => line.split("")[0]).join("");
    this.topString = topString;
    this.bottomString = bottomString;
    this.leftString = leftString;
    this.rightString = rightString;
    this.top = parseAsBinary(topString);
    this.bottom = parseAsBinary(bottomString);
    this.left = parseAsBinary(leftString);
    this.right = parseAsBinary(rightString);
  }
  flipH() {
    return new Tile(this.lines.map((line) => reverse(line)));
  }
  flipV() {
    return new Tile(this.lines.slice().reverse());
  }
  rot() {
    const la = this.lines.map((l) => l.split(""));
    const size = this.lines[0].length;
    const rl: string[] = [];
    for (let y = 0; y < size; y++) {
      const l: string[] = [];
      for (let x = 0; x < size; x++) {
        l.push(la[size - x - 1][y]);
      }
      rl.push(l.join(""));
    }
    return new Tile(rl);
  }

  print() {
    console.log(this.lines.join("\n"));
    console.log("");
  }

  equals(o: Tile) {
    return this.lines.join("") == o.lines.join("");
  }

  joinsOnRight(o: Tile) {
    return this.left === o.right;
  }

  joinsOnLeft(o: Tile) {
    return this.right === o.left;
  }

  joinsBelow(o: Tile) {
    return this.top === o.bottom;
  }

  joinsAbove(o: Tile) {
    return this.bottom === o.top;
  }
}

class TileGroup {
  num: number;
  variants: Tile[];
  constructor(num: number, variants: Tile[]) {
    this.num = num;
    this.variants = variants;
    this.variants.forEach((tv) => (tv.tileGroup = this));
  }
  equals(o?: TileGroup) {
    return this.num === o?.num;
  }
}

const parse = (input: string): TileGroup[] => {
  const tileInputs = input.split("\n\n");
  return tileInputs
    .map((lines) => lines.split("\n"))
    .map((lines, i) => {
      const num = parseInt(lines[0].substring(5, 9));
      const tileLines = lines.slice(1);
      const normal = new Tile(tileLines);
      const variants: Tile[] = [];
      let t: Tile = normal;
      variants.push(normal);
      for (let i = 0; i < 4; i++) {
        t = t.rot();
        [t, t.flipH(), t.flipV()].forEach((v) => {
          if (!variants.some((ov) => ov.equals(v))) {
            variants.push(v);
          }
        });
      }
      return new TileGroup(num, variants);
    });
};

type TileGrid = (Tile | undefined)[][];

const cloneGrid = (grid: TileGrid, width: number, height: number) => {
  const newGrid: TileGrid = [];
  for (let y = 0; y < height; y++) {
    newGrid[y] = [];
    for (let x = 0; x < width; x++) {
      newGrid[y][x] = grid[y]?.[x];
    }
  }
  return newGrid;
};

const isFullGrid = (grid: TileGrid) => {
  return grid.every((row) => row.every((cell) => cell !== undefined));
};

const tryFillGrid = function* (
  initialGrid: TileGrid,
  tiles: TileGroup[],
  width: number,
  height: number
): IterableIterator<TileGrid> {
  const grid = cloneGrid(initialGrid, width, height);

  const usedTiles: Tile[] = [];
  grid.forEach((row) => row.forEach((cell) => cell && usedTiles.push(cell)));

  let attempted = false;
  for (let y = 0; y < height; y++) {
    if (attempted) {
      break;
    }
    for (let x = 0; x < width; x++) {
      if (attempted) {
        break;
      }

      if (grid[y][x] === undefined) {
        attempted = true;
        // Look for tile to fill this, and pass recursively to find next spaces
        const tileLeft = grid[y]?.[x - 1];
        const tileAbove = grid[y - 1]?.[x];
        const tileRight = grid[y]?.[x + 1];
        const tileBelow = grid[y + 1]?.[x];

        const possibleTileGroups = tiles.filter(
          (t) => !usedTiles.some((ut) => ut.tileGroup === t)
        );
        for (const [tgi, tg] of possibleTileGroups.entries()) {
          for (const [tgvi, tgv] of tg.variants.entries()) {
            if (tileLeft && !tgv.joinsOnRight(tileLeft)) {
              continue;
            }
            if (tileAbove && !tgv.joinsBelow(tileAbove)) {
              continue;
            }
            if (tileRight && !tgv.joinsOnLeft(tileRight)) {
              continue;
            }
            if (tileBelow && !tgv.joinsAbove(tileBelow)) {
              continue;
            }
            // This tile is valid! Clone the grid and put the tile variant in
            const clonedGrid = cloneGrid(grid, width, height);
            clonedGrid[y][x] = tgv;
            // If we've filled the grid, return it
            if (isFullGrid(clonedGrid)) {
              yield clonedGrid;
            } else {
              // Otherwise pass the partially filled grid off to have the rest of the spots filled
              for (const result of tryFillGrid(
                clonedGrid,
                tiles,
                width,
                height
              )) {
                yield result;
              }
            }
          }
        }
      }
    }
  }
};

const process = (input: string) => {
  const tiles = parse(input);
  let foundGrid: TileGrid | undefined;
  const tileCount = tiles.length;
  const size = Math.sqrt(tileCount);
  for (const grid of tryFillGrid([], tiles, size, size)) {
    foundGrid = grid;
    break;
  }
  if (foundGrid !== undefined) {
    const sum = [
      [0, 0],
      [size - 1, 0],
      [0, size - 1],
      [size - 1, size - 1],
    ].reduce((sum, [x, y]) => {
      const g = foundGrid!;
      return sum * g[y][x]!.tileGroup!.num;
    }, 1);
    return { grid: foundGrid, sum };
  }
  return { sum: NaN };
};

const process2 = (input: string) => {
  const { grid } = process(input);
  if (!grid) {
    return NaN;
  }

  const trimmedTileGrid = grid.map((row) =>
    row.map((cell) =>
      cell?.lines
        .slice(1, cell.lines.length - 1)
        .map((line) => line.substring(1, line.length - 1))
    )
  );

  const ttg: string[] = [];
  trimmedTileGrid.forEach((row, ri) => {
    const firstCell = row[0]!;
    for (let i = 0; i < firstCell.length; i++) {
      ttg.push(row.map((cell) => cell![i]).join(""));
    }
  });

  const SEA_MONSTER = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
  ];

  const seaMonsterCoords = SEA_MONSTER.flatMap((row, y) => {
    const xC: number[][] = [];
    for (let x = 0; x < row.length; x++) {
      if (SEA_MONSTER[y][x] === "#") {
        xC.push([x, y]);
      }
    }
    return xC;
  });

  const seaMonsterWidth = SEA_MONSTER[0].length;
  const seaMonsterHeight = SEA_MONSTER.length;

  let found = 0;
  let mod_ttg = ttg;
  let flipOrRot = 0;

  let ops = 0;

  while (found === 0 && ops < 8) {
    for (let y = 0; y < ttg.length - seaMonsterHeight; y++) {
      for (let x = 0; x < ttg[0].length - seaMonsterWidth; x++) {
        if (
          seaMonsterCoords.every(([dx, dy]) => {
            return mod_ttg[y + dy][x + dx] === "#";
          })
        ) {
          found += 1;
          seaMonsterCoords.forEach(([dx, dy]) => {
            const line = mod_ttg[y + dy].split("");
            line[x + dx] = "O";
            mod_ttg[y + dy] = line.join("");
          });
        }
      }
    }
    if (found === 0) {
      if (flipOrRot === 0) {
        mod_ttg = stringSquareRot(mod_ttg);
      } else {
        mod_ttg = stringSquareFlipH(mod_ttg);
      }
      flipOrRot = 1 - flipOrRot;
      ops += 1;
    }
  }

  // fs.writeFileSync("sea.txt", mod_ttg.join("\n"));

  console.log(`Found ${found} sea monsters!`);
  const total = ttg.reduce(
    (sum, row) => sum + row.split("").filter((c) => c === "#").length,
    0
  );
  console.log(`Sea roughness: ${total} - ${found * seaMonsterCoords.length}`);
  return total; // - found * seaMonsterCoords.length;
};

const solution: Solution = async () => {
  const input = await getInput;
  const { grid, sum } = process(input);
  return sum;
};

solution.tests = async () => {
  const input = await getTestInput;
  await expect(() => process(input).sum, 20899048083289);
  await expect(() => process2(input), 273);
};

solution.partTwo = async () => {
  const input = await getInput;
  const roughness = process2(input);
  return roughness;
};

solution.inputs = [getInput, getTestInput];

export default solution;
