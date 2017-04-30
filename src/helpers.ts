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

  /**
   * Calculate log10
   * @param n number to calculate log10 for
   */
  public static log10(n: number): number {
    return Math.log(n) / Math.log(10);
  }

  /**
   * Counts the keys in a dictionary
   * @param dictionary dictionary to count keys for
   */
  public static countKeys(dictionary: { [key: string]: {} }): number {
    return (() => {
      let result = 0;
      for (const key in dictionary)
        result++;
      return result;
    })();
  }

  public static calcAvarageDegree(map: { [key: string]: string[] }): number {
    let avarage = 0;
    let keys = 0;
    for (const key in map) {
      avarage += map[key].filter(item => Boolean(item)).length;
      keys++;
    }
    avarage /= keys;
    return avarage;
  }


  public static nCk(n: number, k: number): number {
    // http://blog.plover.com/math/choose.html
    if (k > n)
      return 0;
    if (k === 0)
      return 1;

    let r = 1;
    for (let d = 1; d <= k; d++) {
      r *= n;
      r /= d;
      n -= 1;
    }

    return r;
  }
}