import { Matching } from "./matching";

export interface IResult {
  feedback: string;
  calc_time: number;
}

export class Zxcvbn {
  public static matching = new Matching();

  /**
   * Checks the strength of a password
   * @param password password to check
   * @param user_inputs additional dictionary information
   */
  public static check(password: string, user_inputs: Array<string> = []): IResult {
    const start = new Date().getTime();

    // Sanitize and set user inputs
    user_inputs = user_inputs.map(input => input.toLowerCase());
    Zxcvbn.matching.setUserInputDictionary(user_inputs);

    // Get matches
    const matches = Zxcvbn.matching.omnimatch(password);
    console.log(matches);

    const calc_time = new Date().getTime() - start;

    return {
      feedback: "none",
      calc_time: calc_time
    };
  }
}