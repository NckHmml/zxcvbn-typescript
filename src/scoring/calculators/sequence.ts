import { REGEX_START, REGEX_DIGIT } from "~/constants";

import { ICalculator } from "../interfaces";
import { ISequenceMatch } from "~/matching/matchers/sequence";

export class SequenceCalculator implements ICalculator {
  public estimate(match: ISequenceMatch): number {
    const firstChr = match.token.charAt(0);
    let basesGuesses = 0;

    // lower guesses for obvious starting points
    if (REGEX_START.test(firstChr))
      basesGuesses = 4;
    // digits
    else if (REGEX_DIGIT.test(firstChr))
      basesGuesses = 10;
    // could give a higher base for uppercase,
    // assigning 26 to both upper and lower sequences is more conservative.
    else
      basesGuesses = 26;

    // need to try a descending sequence in addition to every ascending sequence ->
    // 2x guesses
    if (!match.ascending)
      basesGuesses *= 2;

    return basesGuesses * match.token.length;
  }
}