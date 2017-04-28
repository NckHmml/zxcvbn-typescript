import { ICalculator } from "../interfaces";
import { IRepeatMatch } from "~/matching/matchers/repeat";

export class RepeatCalculator implements ICalculator {
  public estimate(match: IRepeatMatch): number {
    return match.baseGuesses * match.repeatCount;
  }
}