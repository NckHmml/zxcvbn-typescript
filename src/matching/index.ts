import { FREQUENCY_LIST, ADJACENCY_GRAPHS } from "../lists";
import { Scoring } from "../scoring";
import { Helpers } from "../helpers";
import { Checker } from "../";

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
  private Matchers: Array<IMatcher>;

  constructor(frequencyList = FREQUENCY_LIST) {
    const build = () => {
      // Build the ranked dictionary
      for (const name in frequencyList) {
        const list = frequencyList[name].split(",");
        this.RankedDictionaries[name] = this.buildRankedDictionary(list);
      }

      // Build matchers
      const dictionaryMatcher = new DictionaryMatcher(this.RankedDictionaries);
      this.Matchers = [
        new DateMatcher(),
        dictionaryMatcher,
        new ReverseDictionaryMatcher(this.RankedDictionaries),
        new L33tMatcher(this.RankedDictionaries, dictionaryMatcher),
        new RegexMatcher(),
        new RepeatMatcher(this),
        new SequenceMatcher(),
        new SpatialMatcher()
      ];
    };

    // Loads the json if it's an external build
    if (frequencyList === undefined) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", Checker.config.frequencyList, true);
      xhr.responseType = "json";
      xhr.onload = () => {
        const status = xhr.status;
        if (status === 200) {
          frequencyList = xhr.response;
        }
        build();
      };
      xhr.send();
    } else {
      build();
    }
  }

  /**
   * Builds the ranked dictionary
   */
  private buildRankedDictionary(orderedList: string[]) {
    const result: { [word: string]: number } = {};

    orderedList.forEach((word, index) => {
      result[word] = index + 1;
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
    // Run matchers
    const matches: Array<IMatch> = this.Matchers
      .map(matcher => matcher.match(password))
      .reduce((previous, next) => previous.concat(next));
    return Helpers.sortMatches(matches);
  }
}