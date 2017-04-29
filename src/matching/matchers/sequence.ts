import { MAX_DELTA, REGEX_SEQUENCE_LOWER, REGEX_SEQUENCE_UPPER, REGEX_SEQUENCE_DIGIT } from "~/constants";
import { IMatch, IMatcher } from "../interfaces";

export interface ISequenceMatch extends IMatch {
  sequenceName: "lower" | "upper" | "digits" | "unicode";
  sequenceSpace: number;
  ascending: boolean;
}

/**
 * Identifies sequences by looking for repeated differences in unicode codepoint
 * @summary this allows skipping, such as 9753, and also matches some extended unicode sequences
 * such as Greek and Cyrillic alphabets.
 *
 * for example, consider the input 'abcdb975zy'
 *
 * password: a   b   c   d   b    9   7   5   z   y
 * index:    0   1   2   3   4    5   6   7   8   9
 * delta:      1   1   1  -2  -41  -2  -2  69   1
 *
 * expected result:
 * [(i, j, delta), ...] = [(0, 3, 1), (5, 7, -2), (8, 9, 1)]
 */
export class SequenceMatcher implements IMatcher {
  private update(matches: Array<ISequenceMatch>, password: string, i: number, j: number, delta: number) {
    const abs = Math.abs(delta);
    if (!(j - i > 1 || abs === 1)) return;
    if (abs < 0 || abs > MAX_DELTA) return;

    const token = password.slice(i, j + 1);
    let sequenceName: "lower" | "upper" | "digits" | "unicode";
    let sequenceSpace: number;

    if (REGEX_SEQUENCE_LOWER.test(token)) {
      sequenceName = "lower";
      sequenceSpace = 26;
    } else if (REGEX_SEQUENCE_UPPER.test(token)) {
      sequenceName = "upper";
      sequenceSpace = 26;
    } else if (REGEX_SEQUENCE_DIGIT.test(token)) {
      sequenceName = "digits";
      sequenceSpace = 10;
    } else {
      // conservatively stick with roman alphabet size.
      sequenceName = "unicode";
      sequenceSpace = 26;
    }

    matches.push({
      pattern: "sequence",
      i: i,
      j: j,
      token: token,
      sequenceName: sequenceName,
      sequenceSpace: sequenceSpace,
      ascending: delta > 0
    });
  }

  public match(password: string): Array<ISequenceMatch> {
    const matches = new Array<ISequenceMatch>();
    if (password.length <= 1)
      return matches;

    let lastDelta;
    let i = 0;
    let j = 0;

    for (let k = 1; k <= password.length; k++) {
      const delta = password.charCodeAt(k) - password.charCodeAt(k - 1);
      if (!lastDelta)
        lastDelta = delta;
      if (lastDelta === delta)
        continue;

      j = k - 1;
      this.update(matches, password, i, j, lastDelta);
      i = j;
      lastDelta = delta;
    }

    this.update(matches, password, i, password.length - 1, lastDelta);

    return matches;
  }
}