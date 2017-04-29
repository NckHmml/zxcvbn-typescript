import { IMatch, IMatcher, IRankedDictionaries } from "../interfaces";
import { Helpers } from "~/helpers";

export interface IDictionaryMatch extends IMatch {
  matchedWord: string;
  rank: number;
  dictionaryName: string;
  reversed: boolean;
  l33t: boolean;
}

/**
 * Dictionary match (common passwords, english, last names, etc)
 */
export class DictionaryMatcher implements IMatcher {
  constructor(private rankedDictionaries: IRankedDictionaries)
  { }

  public match(password: string): Array<IDictionaryMatch> {
    const matches = new Array<IDictionaryMatch>();
    const passwordLower = password.toLowerCase();
    const words = new Array<string>();

    for (const dictionaryName in this.rankedDictionaries) {
      const rankedDict = this.rankedDictionaries[dictionaryName];
      for (let i = 0; i < password.length; i++) {
        for (let j = i; j < password.length; j++) {
          const word = passwordLower.slice(i, j + 1);
          if (word in rankedDict && !(word in words)) {
            const rank = rankedDict[word];
            matches.push({
              pattern: "dictionary",
              i: i,
              j: j,
              token: password.slice(i, j + 1),
              matchedWord: word,
              rank: rank,
              dictionaryName: dictionaryName,
              reversed: false,
              l33t: false
            });
          }
        }
      }
    }
    return Helpers.sortMatches(matches);
  }
}