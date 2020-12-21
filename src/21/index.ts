import { readFileLines, expect } from "../helpers";
import { Solution } from "..";
import { POINT_CONVERSION_COMPRESSED } from "constants";

const getInput = readFileLines("21", "input");
const testInput = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`.split("\n");

const parse = (input: string[]) => {
  const allergensMap = new Map<string, string[]>();
  const allIngredients: string[] = [];

  for (const line of input) {
    const [ingredientsString, allergensString] = line
      .substr(0, line.length - 1)
      .split(" (contains ");
    const ingredients = ingredientsString.split(" ");
    const allergens = allergensString.split(", ");
    for (const allergen of allergens) {
      if (!allergensMap.has(allergen)) {
        allergensMap.set(allergen, ingredients);
      } else {
        const currentAllergenIngredients = allergensMap.get(allergen)!;
        const filtered = currentAllergenIngredients.filter((cai) =>
          ingredients.includes(cai)
        );
        allergensMap.set(allergen, filtered);
      }
    }
    for (const ingredient of ingredients) {
      allIngredients.push(ingredient);
    }
  }

  return { allergensMap, allIngredients };
};

const process = (input: string[]) => {
  const { allergensMap, allIngredients } = parse(input);

  const nonAllergenIngredients = allIngredients.filter((ingredient) => {
    for (const allergens of allergensMap.values()) {
      if (allergens.includes(ingredient)) {
        return false;
      }
    }
    return true;
  });

  return nonAllergenIngredients.length;
};

const process2 = (input: string[]) => {
  const { allergensMap } = parse(input);

  const identifiedIngredients = new Map<string, string>();
  let unidentifiedIngredients = new Set<string>();
  for (const [allergen, ingredients] of allergensMap.entries()) {
    for (const ingredient of ingredients) {
      unidentifiedIngredients.add(ingredient);
    }
  }

  console.log(unidentifiedIngredients);

  while (unidentifiedIngredients.size > 0) {
    for (const [allergen, ingredients] of allergensMap.entries()) {
      if (ingredients.length === 1) {
        const ingredient = ingredients[0];
        unidentifiedIngredients.delete(ingredient);
        console.log("Identified", ingredient, allergen);
        identifiedIngredients.set(ingredient, allergen);
        allergensMap.delete(allergen);
        for (const [
          otherAllergen,
          otherAllergenIngredients,
        ] of allergensMap.entries()) {
          if (otherAllergenIngredients.includes(ingredient)) {
            console.log(
              `Removing ${ingredient} from ${otherAllergen} (${otherAllergenIngredients.join(
                ", "
              )})`
            );
            allergensMap.set(
              otherAllergen,
              otherAllergenIngredients.filter((i) => i !== ingredient)
            );
          }
        }
      }
    }
  }

  const orderedIngredients = Array.from(
    identifiedIngredients.keys()
  ).sort((a, b) =>
    identifiedIngredients.get(a)! < identifiedIngredients.get(b)! ? -1 : 1
  );

  return orderedIngredients.join(",");
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const input = testInput;
  await expect(() => process(input), 5);
  await expect(() => process2(input), "mxmxvkd,sqjhc,fvjkl");
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput];

export default solution;
