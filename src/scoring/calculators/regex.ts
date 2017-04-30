import { REFERENCE_YEAR, MIN_YEAR_SPACE } from "~/constants";
import { ICalculator } from "../interfaces";
import { IRegexMatch } from "~/matching/matchers/regex";

export class RegexCalculator implements ICalculator {
  public estimate(match: IRegexMatch): number {
    switch (match.regexName) {
      case "recentYear":
        // conservative estimate of year space: num years from REFERENCE_YEAR.
        // if year is close to REFERENCE_YEAR, estimate a year space of MIN_YEAR_SPACE.
        let yearSpace = Math.abs(parseInt(match.regexpMatch[0]) - REFERENCE_YEAR);
        yearSpace = Math.max(yearSpace, MIN_YEAR_SPACE);
        return yearSpace;
    }
  }
}