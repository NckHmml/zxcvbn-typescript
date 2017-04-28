import { IMatch } from "~/matching/interfaces";

export interface IScoringResult {
  sequence;
  guesses: number;
}

export interface ICalculator {
  estimate: (match: IMatch) => number;
}