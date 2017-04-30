import { REFERENCE_YEAR, MIN_YEAR_SPACE } from "~/constants";
import { ICalculator } from "../interfaces";
import { IDateMatch } from "~/matching/matchers/date";

export class DateCalculator implements ICalculator {
  public estimate(match: IDateMatch): number {
    // base guesses: (year distance from REFERENCE_YEAR) * num_days * num_years
    const yearSpace = Math.max(Math.abs(match.year - REFERENCE_YEAR), MIN_YEAR_SPACE);
    let guesses = yearSpace * 365;
    // add factor of 4 for separator selection (one of ~4 choices)
    if (match.separator)
      guesses *= 4;
    return guesses;
  }
}