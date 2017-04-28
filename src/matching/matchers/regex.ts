import { REGEX_RECENT_YEAR } from "~/constants";

import { Helpers } from "~/helpers";
import { IMatch, IMatcher } from "../interfaces";

const REGEXEN: { [name: string]: RegExp } = {
  recentYear: REGEX_RECENT_YEAR
};

export interface IRegexMatch extends IMatch {
  regexName: string;
  regexpMatch: RegExpExecArray;
}

/**
 * Regex matching
 */
export class RegexMatcher implements IMatcher {
  public match(password: string): Array<IRegexMatch> {
    const matches = new Array<IRegexMatch>();

    for (const name in REGEXEN) {
      const regexp = REGEXEN[name];

      // Keeps regex_match stateless
      regexp.lastIndex = 0;

      let regexpMatch: RegExpExecArray;
      while (regexpMatch = regexp.exec(password)) {
        const token = regexpMatch[0];
        matches.push({
          pattern: "regex",
          token,
          i: regexpMatch.index,
          j: regexpMatch.index + token.length - 1,
          regexName: name,
          regexpMatch
        });
      }
    }

    return Helpers.sortMatches(matches);
  }
}