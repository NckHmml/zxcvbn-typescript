import { Matching } from "../";
import { IMatch, IMatcher } from "../interfaces";
import { Helpers } from "~/helpers";
import { Scoring } from "~/scoring";

export interface IRepeatMatch extends IMatch {
  baseToken: string;
  baseGuesses: number;
  baseMatches;
  repeatCount: number;
}

/**
 * Matches repeats (aaa, abcabcabc) and sequences (abcdef)
 */
export class RepeatMatcher implements IMatcher {
  constructor(private matching: Matching)
  { }

  public match(password: string): Array<IRepeatMatch> {
    const matches = new Array<IRepeatMatch>();
    const greedy = /(.+)\1+/g;
    const lazy = /(.+?)\1+/g;
    const lazyAnchored = /^(.+?)\1+$/;
    let lastIndex = 0;
    let match: RegExpExecArray;
    let baseToken: string;

    while (lastIndex < password.length) {
      greedy.lastIndex = lastIndex;
      lazy.lastIndex = lastIndex;

      const greedyMatch = greedy.exec(password);
      if (!greedyMatch) break;

      const lazyMatch = lazy.exec(password);

      if (greedyMatch[0].length > lazyMatch[0].length) {
        // greedy beats lazy for 'aabaab'
        //   greedy: [aabaab, aab]
        //   lazy:   [aa,     a]
        match = greedyMatch;
        // greedy's repeated string might itself be repeated, eg.
        // aabaab in aabaabaabaab.
        // run an anchored lazy match on greedy's repeated string
        // to find the shortest repeated string
        baseToken = lazyAnchored.exec(match[0])[1];
      } else {
        // lazy beats greedy for 'aaaaa'
        //   greedy: [aaaa,  aa]
        //   lazy:   [aaaaa, a]
        match = lazyMatch;
        baseToken = match[1];
      }

      const { i, j } = {
        i: match.index,
        j: match.index + match[0].length - 1
      };

      const baseAnalysis = Scoring.mostGuessableMatchSequence(
        baseToken,
        this.matching.omnimatch(baseToken)
      );

      matches.push({
        pattern: "repeat",
        i,
        j,
        token: match[0],
        baseToken,
        baseGuesses: baseAnalysis.guesses,
        baseMatches: baseAnalysis.sequence,
        repeatCount: match[0].length / baseToken.length
      });
      lastIndex = j + 1;
    }

    return matches;
  }
}