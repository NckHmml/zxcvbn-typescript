import { FREQUENCY_LIST, ADJACENCY_GRAPHS } from "../lists";
import { Scoring } from "../scoring";
import { Helpers } from "../helpers";
import { Zxcvbn } from "../";

import { IMatch, IMatcher, IRankedDictionaries } from "./interfaces";
import { DateMatcher } from "./matchers/date";
import { DictionaryMatcher } from "./matchers/dictionary";
import { ReverseDictionaryMatcher } from "./matchers/reverseDictionary";
import { L33tMatcher } from "./matchers/l33t";
import { RegexMatcher } from "./matchers/regex";
import { RepeatMatcher } from "./matchers/repeat";
import { SequenceMatcher } from "./matchers/sequence";
import { SpatialMatcher } from "./matchers/spatial";

export class Matching {
  private RankedDictionaries: IRankedDictionaries = {};

  constructor(frequencyList = FREQUENCY_LIST) {
    // Loads the json if it's an external build
    if (frequencyList === undefined) {
      // ToDo: magically load frequency_list.json
      console.log("ToDo: magically load frequency_list.json at:", Zxcvbn.config.frequencyList);
    }
    // Build the ranked dictionary
    for (const name in frequencyList) {
      const list = frequencyList[name].split(",");
      this.RankedDictionaries[name] = this.buildRankedDictionary(list);
    }
  }

  /**
   * Builds the ranked dictionary
   */
  private buildRankedDictionary(orderedList: string[]) {
    const result: { [word: string]: number } = {};

    orderedList.forEach((word, index) => {
      result[word] = index;
    });

    return result;
  }

  /**
   * Appends the user input to the dictionaries
   * @param orderedList A list of ordered words
   */
  public setUserInputDictionary(orderedList: string[]) {
    return this.RankedDictionaries["user_inputs"] = this.buildRankedDictionary(orderedList.slice());
  }

  /**
   * Runs all passwords matches
   * @param password password to match with
   */
  public omnimatch(password: string): Array<IMatch> {
    const dictionaryMatcher = new DictionaryMatcher(this.RankedDictionaries);

    const matchers: Array<IMatcher> = [
      new DateMatcher(),
      dictionaryMatcher,
      new ReverseDictionaryMatcher(this.RankedDictionaries),
      new L33tMatcher(this.RankedDictionaries, dictionaryMatcher),
      new RegexMatcher(),
      new RepeatMatcher(this),
      new SequenceMatcher(),
      new SpatialMatcher()
    ];
    // Run matchers
    const matches: Array<IMatch> = matchers
      .map(matcher => matcher.match(password))
      .reduce((previous, next) => previous.concat(next));
    return Helpers.sortMatches(matches);
  }
}