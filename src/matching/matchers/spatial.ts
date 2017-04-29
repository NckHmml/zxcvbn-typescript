import { REGEX_SHIFTED } from "~/constants";
import { ADJACENCY_GRAPHS } from "~/lists";

import { Helpers } from "~/helpers";
import { IMatch, IMatcher } from "../interfaces";

export interface ISpatialMatch extends IMatch {
  graph: string;
  turns: number;
  shiftedCount: number;
}

/**
 * Spatial match (qwerty/dvorak/keypad)
 */
export class SpatialMatcher implements IMatcher {
  private matchHelper(password: string, graphName: string, graph: { [key: string]: Array<string> }): Array<ISpatialMatch> {
    const matches = new Array<ISpatialMatch>();
    let i = 0;
    while (i < password.length - 1) {
      let j = i + 1;
      let lastDirection;
      let turns = 0;
      let shiftedCount = 0;

      // Check if initial character is shifted
      if ((graphName === "qwerty" || graphName === "dvorak") && REGEX_SHIFTED.test(password.charAt(i)))
        shiftedCount = 1;

      let found = true;
      while (found) {
        found = false;

        const prevChar = password.charAt(j - 1);
        const adjecents = graph[prevChar] || [];

        let foundDirection = -1;
        let curDirection = -1;

        // consider growing pattern by one character if j hasn't gone over the edge.
        if (j < password.length) {
          const curChar = password.charAt(j);
          found = adjecents.some(adjecent => {
            curDirection++;

            if (adjecent && adjecent.indexOf(curChar) !== -1) {
              foundDirection = curDirection;

              // index 1 in the adjacency means the key is shifted,
              // 0 means unshifted: A vs a, % vs 5, etc.
              // for example, 'q' is adjacent to the entry '2@'.
              // @ is shifted w/ index 1, 2 is unshifted.
              if (adjecent.indexOf(curChar) === 1)
                shiftedCount++;
              if (lastDirection !== foundDirection) {
                // adding a turn is correct even in the initial case when last_direction is null:
                // every spatial pattern starts with a turn.
                turns++;
                lastDirection = foundDirection;
              }
              // break;
              return true;
            }

            // continue
            return false;
          });
        }

        // if the current pattern continued, extend j and try to grow again
        if (found) {
          j++;
          // otherwise push the pattern discovered so far, if any...
        } else {
          // don't consider length 1 or 2 chains
          if (j - i > 2) {
            matches.push({
              pattern: "spatial",
              i: i,
              j: j - 1,
              token: password.slice(i, j),
              graph: graphName,
              turns: turns,
              shiftedCount: shiftedCount
            });
          }
          i = j;
        }
      }
    }

    return matches;
  }

  public match(password: string): Array<ISpatialMatch> {
    const matches = new Array<ISpatialMatch>();

    for (const name in ADJACENCY_GRAPHS) {
      const graph = ADJACENCY_GRAPHS[name];
      this.matchHelper(password, name, graph).forEach(match => matches.push(match));
    }

    return Helpers.sortMatches(matches);
  }
}