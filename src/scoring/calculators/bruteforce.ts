import { BRUTEFORCE_CARDINALITY, MIN_SUBMATCH_GUESSES_SINGLE_CHAR, MIN_SUBMATCH_GUESSES_MULTI_CHAR } from "~/constants";
import { IMatch } from "~/matching/interfaces";

import { ICalculator } from "../interfaces";
import { Scoring } from "../";

export class BruteforceCalculator implements ICalculator {
  public estimate(match: IMatch): number {
    let guesses = Math.pow(BRUTEFORCE_CARDINALITY, match.token.length);
    if (guesses === Number.POSITIVE_INFINITY)
      guesses = Number.MAX_VALUE;

    // small detail: make bruteforce matches at minimum one guess bigger than smallest allowed
    // submatch guesses, such that non-bruteforce submatches over the same [i..j] take precedence.
    const minGuesses = (match.token.length == 1 ? MIN_SUBMATCH_GUESSES_SINGLE_CHAR : MIN_SUBMATCH_GUESSES_MULTI_CHAR) + 1;

    return Math.max(guesses, minGuesses);
  }
}