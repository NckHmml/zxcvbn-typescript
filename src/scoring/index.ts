import { MIN_GUESSES_BEFORE_GROWING_SEQUENCE, MIN_SUBMATCH_GUESSES_SINGLE_CHAR, MIN_SUBMATCH_GUESSES_MULTI_CHAR } from "~/constants";
import { IMatch } from "~/matching/interfaces";
import { Helpers } from "~/helpers";
import { IScoringResult, ICalculator } from "./interfaces";

import { BruteforceCalculator } from "./calculators/bruteforce";
import { DateCalculator } from "./calculators/date";
import { DictionaryCalculator } from "./calculators/dictionary";
import { RegexCalculator } from "./calculators/regex";
import { RepeatCalculator } from "./calculators/repeat";
import { SequenceCalculator } from "./calculators/sequence";
import { SpatialCalculator } from "./calculators/spatial";

interface IOptimal {
  m: Array<{ [l: number]: IMatch }>;
  pi: Array<{ [l: number]: number }>;
  g: Array<{ [l: number]: number }>;
}

export class Scoring {
  private static estimationFunctions: { [key: string]: ICalculator } = {
    "bruteforce": new BruteforceCalculator(),
    "dictionary": new DictionaryCalculator(),
    "date": new DateCalculator(),
    "regex": new RegexCalculator(),
    "repeat": new RepeatCalculator(),
    "sequence": new SequenceCalculator(),
    "spatial": new SpatialCalculator()
  };

  /** unoptimized, called only on small n */
  private static factorial = (n: number): number => {
    if (n < 2)
      return 1;

    let f = 1;
    for (let i = 2; i <= n; i++)
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
    match.guessesLog10 = Helpers.log10(match.guesses);

    return match.guesses;
  }

  /**
   * @summary considers whether a length-l sequence ending at match m is better (fewer guesses)
   * than previously encountered sequences, updating state if so.
   */
  private static updateOptimal(password: string, optimal: IOptimal, match: IMatch, l: number, excludeAdditive: boolean) {
    const k = match.j;
    let pi = this.estimateGuesses(password, match);

    if (l > 1)
      // we're considering a length-l sequence ending with match m:
      // obtain the product term in the minimization function by multiplying m's guesses
      // by the product of the length-(l-1) sequence ending just before m, at m.i - 1.
      pi *= optimal.pi[match.i - 1][l - 1];

    // calculate the minimization func
    let g = this.factorial(l) * pi;
    if (!excludeAdditive)
      g += Math.pow(MIN_GUESSES_BEFORE_GROWING_SEQUENCE, l - 1);

    // update state if new best.
    // first see if any competing sequences covering this prefix, with l or fewer matches,
    // fare better than this sequence. if so, skip it and return.
    for (const competingL in optimal.g[k]) {
      if (parseInt(competingL) > l)
        continue;

      if (optimal.g[k][l] <= g)
        return;
    }

    // this sequence might be part of the final optimal sequence.
    optimal.g[k][l] = g;
    optimal.m[k][l] = match;
    optimal.pi[k][l] = pi;
  }

  /**
   * evaluate bruteforce matches ending at k.
   */
  private static bruteforceUpdate(password: string, optimal: IOptimal, k: number, excludeAdditive: boolean) {
    // see if a single bruteforce match spanning the k-prefix is optimal.
    let match = this.makeBruteforceMatch(password, 0, k);
    this.updateOptimal(password, optimal, match, 1, excludeAdditive);
    for (let i = 1; i <= k; i++) {
      // generate k bruteforce matches, spanning from (i=1, j=k) up to (i=k, j=k).
      // see if adding these new matches to any of the sequences in optimal[i-1]
      // leads to new bests.
      match = this.makeBruteforceMatch(password, i, k);
      for (const l in optimal.m[i - 1]) {
        const lastMatch = optimal.m[i - 1][l];
        // corner: an optimal sequence will never have two adjacent bruteforce matches.
        // it is strictly better to have a single bruteforce match spanning the same region:
        // same contribution to the guess product with a lower length.
        // --> safe to skip those cases.
        if (lastMatch.pattern === "bruteforce")
          continue;
        this.updateOptimal(password, optimal, match, parseInt(l) + 1, excludeAdditive);
      }
    }
  }

  /**
   * make bruteforce match objects spanning i to j, inclusive.
   */
  private static makeBruteforceMatch(password: string, i: number, j: number): IMatch {
    return {
      pattern: "bruteforce",
      token: password.slice(i, j + 1),
      i: i,
      j: j
    };
  }

  private static unwind(optimal: IOptimal, n: number): Array<IMatch> {
    const optimalMatchSequence = new Array<IMatch>();
    let k = n - 1;
    // find the final best sequence length and score
    let l: number;
    let g: number = Infinity;
    for (const key in optimal.g[k]) {
      const candidateL = parseInt(key);
      const candidateG = optimal.g[k][candidateL];
      if (candidateG >= g) continue;
      l = candidateL;
      g = candidateG;
    }

    while (k >= 0) {
      const match = optimal.m[k][l];
      optimalMatchSequence.unshift(match);
      k = match.i - 1;
      l--;
    }

    return optimalMatchSequence;
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
    const baseArray = Array.apply({}, new Array(n));

    // partition matches into sublists according to ending index j
    const matchesByJ: [Array<IMatch>] = baseArray.map(i => []);
    matches.forEach(match => matchesByJ[match.j].push(match));
    // small detail: for deterministic output, sort each sublist by i.
    matchesByJ.forEach(list => list.sort((m1, m2) => m1.i - m2.i));

    const optimal: IOptimal = {
      // optimal.m[k][l] holds final match in the best length-l match sequence covering the
      // password prefix up to k, inclusive.
      // if there is no length-l sequence that scores better (fewer guesses) than
      // a shorter match sequence spanning the same prefix, optimal.m[k][l] is undefined.
      m: baseArray.map(i => []),
      // same structure as optimal.m -- holds the product term Prod(m.guesses for m in sequence).
      // optimal.pi allows for fast (non-looping) updates to the minimization function.
      pi: baseArray.map(i => []),
      // same structure as optimal.m -- holds the overall metric.
      g: baseArray.map(i => [])
    };

    for (let k = 0; k < n; k++) {
      matchesByJ[k].forEach(match => {
        if (match.i > 0) {
          for (const l in optimal.m[match.i - 1])
            this.updateOptimal(password, optimal, match, parseInt(l) + 1, excludeAdditive);
        } else {
          this.updateOptimal(password, optimal, match, 1, excludeAdditive);
        }
      });
      this.bruteforceUpdate(password, optimal, k, excludeAdditive);
    }

    const optimalMatchSequence = this.unwind(optimal, n);
    const optimalL = optimalMatchSequence.length;

    let guesses = 1;
    // corner: empty password
    if (password.length > 0)
      guesses = optimal.g[n - 1][optimalL];

    return {
      password: password,
      sequence: optimalMatchSequence,
      guesses: guesses,
      guessesLog10: Helpers.log10(guesses)
    };
  }
}