import { MIN_SUBMATCH_GUESSES_SINGLE_CHAR, MIN_SUBMATCH_GUESSES_MULTI_CHAR} from "~/constants";
import { IMatch } from "~/matching/interfaces";
import { IScoringResult, ICalculator } from "./interfaces";

import { BruteforceCalculator } from "./calculators/bruteforce";
import { RepeatCalculator } from "./calculators/repeat";
import { SequenceCalculator } from "./calculators/sequence";


export class Scoring {

  static estimationFunctions: { [key: string]: ICalculator } = {
    "bruteforce": new BruteforceCalculator(),
    "repeat": new RepeatCalculator(),
    "sequence": new SequenceCalculator()
    // "bruteforce": this.bruteforceGuesses,
    // "dictionary": this.dictionaryGuesses,
    // "spatial": this.spatialGuesses,
    // "repeat": this.repeatGuesses,
    // "sequence": this.sequenceGuesses,
    // "regex": this.regexGuesses,
    // "date": this.dateGuesses
  };

  private static nCk = (n: number, k: number): number => {
    // http://blog.plover.com/math/choose.html
    if (k > n)
      return 0;
    if (k === 0)
      return 1;

    let r = 1;
    for (let d = 1; d < k; d++) {
      r *= n;
      r /= d;
      n -= 1;
    }

    return r;
  }

  private static log10 = (n: number): number =>
    Math.log(n) / Math.log(10)

  private static log2 = (n: number): number =>
    Math.log(n) / Math.log(2)

  /** unoptimized, called only on small n */
  private static factorial = (n: number): number => {
    if (n < 2)
      return 1;

    let f = 1;
    for (let i = 2; i < n; i++)
      f *= i;
    return f;
  }

  /** guess estimation -- one function per match pattern */
  private static estimateGuesses(password: string, match: IMatch): number {
    // a match's guess estimate doesn't change. cache it.
    if (match.guesses)
      return match.guesses;

    let minGuesses = 1;
    if (match.token.length < password.length)
      minGuesses = match.token.length == 1 ? MIN_SUBMATCH_GUESSES_SINGLE_CHAR : MIN_SUBMATCH_GUESSES_MULTI_CHAR;

    match.guesses = this.estimationFunctions[match.pattern].estimate(match);
    match.guessesLog10 = Scoring.log10(match.guesses);

    return match.guesses;
  }

  private static spatialGuesses(match: IMatch): number {
    return 0;
  }

  private static regexGuesses(match: IMatch): number {
    return 0;
  }

  private static dateGuesses(match: IMatch): number {
    return 0;
  }

  /**
   * search most guessable match sequence
   * @summary takes a sequence of overlapping matches, returns the non-overlapping sequence with
   * minimum guesses. the following is a O(l_max * (n + m)) dynamic programming algorithm
   * for a length-n password with m candidate matches. l_max is the maximum optimal
   * sequence length spanning each prefix of the password. In practice it rarely exceeds 5 and the
   * search terminates rapidly.
   *
   * the optimal "minimum guesses" sequence is here defined to be the sequence that
   * minimizes the following function:
   *
   *    g = l! * Product(m.guesses for m in sequence) + D^(l - 1)
   *
   * where l is the length of the sequence.
   *
   * the factorial term is the number of ways to order l patterns.
   *
   * the D^(l-1) term is another length penalty, roughly capturing the idea that an
   * attacker will try lower-length sequences first before trying length-l sequences.
   *
   * for example, consider a sequence that is date-repeat-dictionary.
   *  - an attacker would need to try other date-repeat-dictionary combinations,
   *    hence the product term.
   *  - an attacker would need to try repeat-date-dictionary, dictionary-repeat-date,
   *    ..., hence the factorial term.
   *  - an attacker would also likely try length-1 (dictionary) and length-2 (dictionary-date)
   *    sequences before length-3. assuming at minimum D guesses per pattern type,
   *    D^(l-1) approximates Sum(D^i for i in [1..l-1]
   */
  public static mostGuessableMatchSequence(password: string, matches: Array<IMatch>, excludeAdditive = false): IScoringResult {
    const n = password.length;

    // partition matches into sublists according to ending index j
    const matchesByJ: [Array<IMatch>] = Array.apply({}, new Array(n)).map(i => []);
    matches.forEach(match => matchesByJ[match.j].push(match));
    // small detail: for deterministic output, sort each sublist by i.
    matchesByJ.forEach(list => list.sort((m1, m2) => m1.i - m2.i));

    const optimal = {
      // optimal.m[k][l] holds final match in the best length-l match sequence covering the
      // password prefix up to k, inclusive.
      // if there is no length-l sequence that scores better (fewer guesses) than
      // a shorter match sequence spanning the same prefix, optimal.m[k][l] is undefined.
      m: Array.apply({}, new Array(n)),
      // same structure as optimal.m -- holds the product term Prod(m.guesses for m in sequence).
      // optimal.pi allows for fast (non-looping) updates to the minimization function.
      pi: Array.apply({}, new Array(n)),
      // same structure as optimal.m -- holds the overall metric.
      g: Array.apply({}, new Array(n))
    };

    // helper: considers whether a length-l sequence ending at match m is better (fewer guesses)
    // than previously encountered sequences, updating state if so.
    const update = (match: IMatch, l) => {
      let k = match.j;
      let pi = this.estimateGuesses(password, match);
    };

    return {
      sequence: undefined,
      guesses: 0
    };
  }
}