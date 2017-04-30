import { REGEX_START_UPPER, REGEX_END_UPPER, REGEX_ALL_UPPER, REGEX_ALL_LOWER } from "~/constants";
import { Helpers } from "~/helpers";

import { ICalculator } from "../interfaces";
import { IDictionaryMatch } from "~/matching/matchers/dictionary";
import { IL33tMatch } from "~/matching/matchers/l33t";

export class DictionaryCalculator implements ICalculator {
  private countUppercaseVariations(match: IDictionaryMatch): number {
    const word = match.token;
    if (REGEX_ALL_LOWER.test(word) || word.toLowerCase() === word)
      return 1;

    // a capitalized word is the most common capitalization scheme,
    // so it only doubles the search space (uncapitalized + capitalized).
    // allcaps and end-capitalized are common enough too, underestimate as 2x factor to be safe.
    const regexList = [REGEX_START_UPPER, REGEX_END_UPPER, REGEX_ALL_UPPER];
    if (regexList.some(regex => regex.test(word)))
      return 2;

    // otherwise calculate the number of ways to capitalize U+L uppercase+lowercase letters
    // with U uppercase letters or less. or, if there's more uppercase than lower (for eg. PASSwORD),
    // the number of ways to lowercase U+L letters with L lowercase letters or less.
    const U = word.split("").filter(chr => /[A-Z]/.test(chr)).length;
    const L = word.split("").filter(chr => /[a-z]/.test(chr)).length;

    let variations = 0;
    for (let i = 1; i <= U && i <= L; i++)
      variations += Helpers.nCk(U + L, i);
    return variations;
  }

  private countL33tVariations(match: IL33tMatch): number {
    let variations = 1;
    if (!match.l33t)
      return variations;

    for (const subbed in match.sub) {
      const unsubbed = match.sub[subbed];
      // lower-case match.token before calculating: capitalization shouldn't affect l33t calc
      const chrs = match.token.toLowerCase().split("");
      const S = chrs.filter(chr => chr === subbed).length;
      const U = chrs.filter(chr => chr === unsubbed).length;
      if (S === 0 || U === 0) {
        // for this sub, password is either fully subbed (444) or fully unsubbed (aaa)
        // treat that as doubling the space (attacker needs to try fully subbed chars in addition to
        // unsubbed.)
        variations *= 2;
      } else {
        // this case is similar to capitalization:
        // with aa44a, U = 3, S = 2, attacker needs to try unsubbed + one sub + two subs
        let possibilities = 0;
        for (let i = 1; i <= U && i <= S; i++)
          possibilities += Helpers.nCk(U + S, i);
        variations *= possibilities;
      }
    }

    return variations;
  }

  public estimate(match: IDictionaryMatch): number {
    match.baseGuesses = match.rank;
    match.uppercaseVariations = this.countUppercaseVariations(match);
    match.l33tVariations = this.countL33tVariations(match as IL33tMatch);
    const reversedVariations = match.reversed ? 2 : 1;
    return match.baseGuesses * match.uppercaseVariations * match.l33tVariations * reversedVariations;
  }
}