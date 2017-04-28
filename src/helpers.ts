import { IMatch } from "./matching/interfaces";

export class Helpers {
  /**
   * Sorts matches
   * @summary sort on i primary, j secondary
   */
  public static sortMatches<T extends IMatch>(matches: Array<T>): Array<T> {
    return matches.sort((m1, m2) =>
      (m1.i - m2.i) || (m1.j - m2.j)
    );
  }
}