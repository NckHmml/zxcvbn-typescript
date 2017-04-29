import { IMatcher, IRankedDictionaries } from "../interfaces";
import { DictionaryMatcher, IDictionaryMatch } from "./dictionary";
import { Helpers } from "~/helpers";
import { L33T_TABLE } from "~/lists";

interface IL33tSubTable {
  [key: string]: Array<string>;
}

export interface IL33tMatch extends IDictionaryMatch {
  l33t: boolean;
  sub: { [key: string]: string };
  subDisplay: string;
}

/**
 * Dictionary match with common l33t substitutions
 */
export class L33tMatcher implements IMatcher {
  constructor(
    private rankedDictionaries: IRankedDictionaries,
    private dictionaryMatcher: DictionaryMatcher
  )
  { }

  /** Makes a pruned copy of l33t_table that only includes password's possible substitutions */
  private relevantL33tSubtable(password: string): IL33tSubTable {
    const passwordChrs: { [key: string]: boolean } = password
      .split("")
      .reduce((container, next) => {
        container[next] = true;
        return container;
      }, {});
    const subTable: IL33tSubTable = {};

    for (const letter in L33T_TABLE) {
      const subs = L33T_TABLE[letter];
      const relevantSubs = subs.filter(sub => sub in passwordChrs);
      if (relevantSubs.length > 0)
        subTable[letter] = relevantSubs;
    }

    return subTable;
  }

  private deduplicate(subs: Array<Array<{}>>): Array<Array<{}>> {
    const dedupped = [];
    const members = {};

    subs.forEach(sub => {
      const assoc = sub.map((value, index) => [value, index]);
      assoc.sort();
      const label = assoc.map((value, index) => `${value},${index}`).join(",");
      if (!(label in members)) {
        members[label] = true;
        dedupped.push(sub);
      }
    });

    return dedupped;
  }

  private enumerateL33tSubsHelper(keys: Array<string>, subs: Array<Array<{}>>): Array<Array<{}>> {
    if (!keys.length)
      return subs;

    const firstKey = keys.shift();
    let nextSubs = new Array<Array<{}>>();

    L33T_TABLE[firstKey].forEach(l33t => {
      subs.forEach(sub => {
        let duplicateL33tIndex = -1;
        sub.some((value, index) => {
          if (value[0] === l33t) {
            duplicateL33tIndex = index;
            return true;
          }
          return false;
        });

        if (duplicateL33tIndex === -1) {
          const subExtensions = sub.concat([[l33t, firstKey]]);
          nextSubs.push(subExtensions);
        } else {
          const subAlternative = sub.slice(0);
          subAlternative.splice(duplicateL33tIndex, 1);
          subAlternative.push(l33t, firstKey);
          nextSubs.push(sub);
          nextSubs.push(subAlternative);
        }
      });
    });

    nextSubs = this.deduplicate(nextSubs);
    return this.enumerateL33tSubsHelper(keys, nextSubs);
  }

  /** Returns the list of possible 1337 replacement dictionaries for a given password */
  private enumerateL33tSubs(table: IL33tSubTable): Array<{ [key: string]: string }> {
    const keys = (() => {
      const results = new Array<string>();
      for (const key in table)
        results.push(key);
      return results;
    })();

    const subs = this.enumerateL33tSubsHelper(keys, [[]]);

    return subs.map(sub =>
      sub.reduce((container, value) => {
        container[value[0]] = value[1];
        return container;
      }, {})
    );
  }

  public match(password: string): Array<IL33tMatch> {
    const matches = new Array<IL33tMatch>();
    const relevantL33tSubtable = this.relevantL33tSubtable(password);
    const subs = this.enumerateL33tSubs(relevantL33tSubtable);
    const matchedTokens: { [key: string]: boolean } = {};

    subs.forEach(sub => {
      let anySub = false;
      for (const key in sub) {
        anySub = true;
        break;
      }
      if (!anySub) return;

      const subbedPassword = password.split("").map(chr => sub[chr] || chr).join("");
      this.dictionaryMatcher.match(subbedPassword).forEach(match => {
        const token = password.slice(match.i, match.j + 1);
        // filter single-character l33t matches to reduce noise.
        // otherwise '1' matches 'i', '4' matches 'a', both very common English words
        // with low dictionary rank.
        if (token.length <= 1)
          return;

        const lowerToken = token.toLowerCase();
        // only return the matches that contain an actual substitution
        if (lowerToken === match.matchedWord)
          return;

        // only return each token once
        if (matchedTokens[lowerToken])
          return;
        matchedTokens[lowerToken] = true;

        // subset of mappings in sub that are in use for this match
        const matchedSub: { [key: string]: string } = {};
        for (const key in sub) {
          const chr = sub[key];
          if (token.indexOf(key) !== -1) {
            matchedSub[key] = chr;
          }
        }

        const subDisplay = (() => {
          const results = new Array<string>();
          for (const key in matchedSub)
            results.push(`${key} -> ${matchedSub[key]}`);
          return results;
        })().join(", ");

        matches.push({
          pattern: match.pattern,
          i: match.i,
          j: match.j,
          matchedWord: match.matchedWord,
          rank: match.rank,
          dictionaryName: match.dictionaryName,
          reversed: match.reversed,
          token: token,
          l33t: true,
          sub: matchedSub,
          subDisplay: subDisplay
        });
      });
    });

    return Helpers.sortMatches(matches);
  }
}