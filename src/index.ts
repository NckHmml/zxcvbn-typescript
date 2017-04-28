import { Config } from "./config";
import { Matching } from "./matching";
import { Scoring } from "./scoring";
import { IScoringResult } from "./scoring/interfaces";

export interface IResult extends IScoringResult {
  feedback: string;
  calc_time: number;
}

export class Zxcvbn {
  private static _matching: Matching;
  public static get matching(): Matching {
    // Lazy loading
    if (!this._matching)
      this._matching = new Matching();
    return this._matching;
  }
  public static set matching(instance: Matching) {
    this._matching = instance;
  }

  // Expose config
  public static config = Config;

  /**
   * Checks the strength of a password
   * @param password password to check
   * @param userInputs additional dictionary information
   */
  public static check(password: string, userInputs: Array<string> = []): IResult {
    const start = new Date().getTime();

    // Sanitize and set user inputs
    userInputs = userInputs.map(input => input.toLowerCase());
    this.matching.setUserInputDictionary(userInputs);

    // Get matches
    const matches = this.matching.omnimatch(password);
    console.log(matches);
    // Get result
    const result = Scoring.mostGuessableMatchSequence(password, matches) as IResult;

    result.feedback = "none";
    result.calc_time = new Date().getTime() - start;
    return result;
  }
}