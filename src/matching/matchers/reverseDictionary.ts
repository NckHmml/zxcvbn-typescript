import { IMatcher, IRankedDictionaries } from "../interfaces";
import { DictionaryMatcher, IDictionaryMatch } from "./dictionary";
import { Helpers } from "~/helpers";

/**
 * Dictionary match, reversed (common passwords, english, last names, etc)
 */
export class ReverseDictionaryMatcher extends DictionaryMatcher {
  constructor(rankedDictionaries: IRankedDictionaries) {
    super(rankedDictionaries);
  }
  public match(password: string): Array<IDictionaryMatch> {
    const reversed_password = password.split("").reverse().join("");
    const matches = super.match(reversed_password) as Array<IDictionaryMatch>;

    let ref: {
      i: number,
      j: number
    };
    matches.forEach(match => {
      // Map coordinates back to original string
      ref = {
        i: password.length - 1 - match.j,
        j: password.length - 1 - match.i
      };
      match.i = ref.i;
      match.j = ref.j;
      // Reverse back
      match.token = match.token.split("").reverse().join("");
      match.reversed = true;
    });

    return Helpers.sortMatches(matches);
  }
}