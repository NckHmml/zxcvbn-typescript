import { KEYPAD_STARTING_POSITIONS, KEYPAD_AVERAGE_DEGREE, KEYBOARD_STARTING_POSITIONS, KEYBOARD_AVERAGE_DEGREE } from "~/constants";
import { Helpers } from "~/helpers";

import { ICalculator } from "../interfaces";
import { ISpatialMatch } from "~/matching/matchers/spatial";

export class SpatialCalculator implements ICalculator {
  public estimate(match: ISpatialMatch): number {
    let s: number, d: number;
    if (match.graph === "qwerty" || match.graph === "dvorak") {
      s = KEYBOARD_STARTING_POSITIONS;
      d = KEYBOARD_AVERAGE_DEGREE;
    } else {
      s = KEYPAD_STARTING_POSITIONS;
      d = KEYPAD_AVERAGE_DEGREE;
    }
    let guesses = 0;
    const L = match.token.length;
    const t = match.turns;
    for (let i = 2; i <= L; i++) {
      const possibleTurns = Math.min(t, i - 1);
      for (let j = 1; j <= possibleTurns; j++) {
        guesses += Helpers.nCk(i - 1, j - 1) * s * Math.pow(d, j);
      }
    }

    if (match.shiftedCount) {
      // add extra guesses for shifted keys. (% instead of 5, A instead of a.)
      // math is similar to extra guesses of l33t substitutions in dictionary matches.
      const S = match.shiftedCount;
      const U = match.token.length - S; // unshifted count
      if (S === 0 || U === 0) {
        guesses *= 2;
      } else {
        let shiftedVariations = 0;
        for (let i = 1; i <= S && i <= U; i++)
          shiftedVariations += Helpers.nCk(S + U, i);
        guesses *= shiftedVariations;
      }
    }

    return guesses;
  }
}