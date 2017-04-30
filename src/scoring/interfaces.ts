import { IMatch } from "~/matching/interfaces";

export interface IScoringResult {
  password: string;
  sequence: Array<IMatch>;
  guesses: number;
  guessesLog10: number;
}

export interface ICalculator {
  estimate: (match: IMatch) => number;
}