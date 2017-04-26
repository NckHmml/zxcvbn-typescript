import { FREQUENCY_LIST, ADJACENCY_GRAPHS } from "./lists";

export interface IMatch {
  pattern: "dictionary";
  i: number;
  j: number;
  token: string;
  matchedWord: string;
  rank: number;
  dictionaryName: string;
  reversed: boolean;
  l33t: boolean;
}

export interface IMatcher {
  (password: string): Array<IMatch>;
}

export class Matching {
  public static frequencyList: string = "frequency_list.json";

  private RankedDictionaries: {
    [name: string]: {
      [word: string]: number;
    }
  } = {};

  constructor() {
    // Loads the json if it's an external build
    if (FREQUENCY_LIST === undefined) {
      // ToDo: magically load frequency_list.json
      console.log("ToDo: magically load frequency_list.json at:", Matching.frequencyList);
    }
    // Build the ranked dictionary
    for (const name in FREQUENCY_LIST) {
      const list = FREQUENCY_LIST[name].split(",");
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
   * Sorts matches
   */
  private sorted(matches: Array<IMatch>): Array<IMatch> {
    // sort on i primary, j secondary
    return matches.sort((m1, m2) =>
      (m1.i - m2.i) || (m1.j - m2.j)
    );
  }

  /**
   * Dictionary match (common passwords, english, last names, etc)
   */
  private dictionaryMatch = (password: string): Array<IMatch> =>  {
    const matches = new Array<IMatch>();
    const passwordLower = password.toLowerCase();

    for (const dictionaryName in this.RankedDictionaries) {
      const rankedDict = this.RankedDictionaries[dictionaryName];
      for (let i = 0; i < password.length; i++) {
        for (let j = i; j < password.length; j++) {
          const word = passwordLower.slice(i, j + 1);
          if (word in rankedDict) {
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
    return this.sorted(matches);
  }

  /**
   * Dictionary match, reversed (common passwords, english, last names, etc)
   */
  private reverseDictionaryMatch = (password: string): Array<IMatch> => {
    const reversed_password = password.split("").reverse().join("");
    const matches: Array<IMatch> = this.dictionaryMatch(reversed_password);

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

    return this.sorted(matches);
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
    const matchers: Array<IMatcher> = [this.dictionaryMatch, this.reverseDictionaryMatch];
    // Run matchers
    const matches: Array<IMatch> = matchers
      .map(matcher => matcher(password))
      .reduce((previous, next) => previous.concat(next));
    return this.sorted(matches);
  }
}