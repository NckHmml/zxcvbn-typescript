import { REGEX_DATE_NO_SEPARATOR, REGEX_DATE_WITH_SEPARATOR, DATE_MAX_YEAR, DATE_MIN_YEAR, REFERENCE_YEAR } from "~/constants";
import { DATE_SPLITS } from "~/lists";

import { Helpers } from "~/helpers";
import { IMatch, IMatcher } from "../interfaces";

export interface IDateMatch extends IMatch, IDMY {
  separator: string;
}

export interface IDMY {
  day: number;
  month: number;
  year: number;
}

/**
 * Date matching
 * @summary
 *   a "date" is recognized as:
 *   any 3-tuple that starts or ends with a 2- or 4-digit year,
 *   with 2 or 0 separator chars (1.1.91 or 1191),
 *   maybe zero-padded (01-01-91 vs 1-1-91),
 *   a month between 1 and 12,
 *   a day between 1 and 31.
 *
 * note: this isn't true date parsing in that "feb 31st" is allowed,
 * this doesn't check for leap years, etc.
 *
 * recipe:
 * start with regex to find maybe-dates, then attempt to map the integers
 * onto month-day-year to filter the maybe-dates into dates.
 * finally, remove matches that are substrings of other matches to reduce noise.
 *
 * note: instead of using a lazy or greedy regex to find many dates over the full string,
 * this uses a ^...$ regex against every substring of the password -- less performant but leads
 * to every possible date match.
 */
export class DateMatcher implements IMatcher {
  /**
   * Converts a 3-tuple to day, month, year
   */
  private mapIntsToDMY(ints: Array<number>): IDMY {
    /* given a 3-tuple, discard if:
     *   middle int is over 31 (for all dmy formats, years are never allowed in the middle)
     *   middle int is zero
     *   any int is over the max allowable year
     *   any int is over two digits but under the min allowable year
     *   2 ints are over 31, the max allowable day
     *   2 ints are zero
     *   all ints are over 12, the max allowable month
     */
    if (ints[1] > 31 || ints[1] <= 0)
      return;

    let over12 = 0;
    let over31 = 0;
    let under1 = 0;

    const invalids = ints.some(int => {
      if (int > DATE_MAX_YEAR || (int >= 99 && int < DATE_MIN_YEAR))
        return true;
      if (int > 31) over31++;
      if (int > 12) over12++;
      if (int <= 0) under1++;
      if (over31 == 2 || over12 == 3 || under1 == 2)
        return true;
    });

    if (invalids)
      return;

    const years = [ints[0], ints[2]];
    const rests = [ints.slice(1, 3), ints.slice(0, 2)];

    // first look for a four digit year: yyyy + daymonth or daymonth + yyyy
    const validYears = years
      .map((year, index) => {
        return {
          valid: year <= DATE_MAX_YEAR && year >= DATE_MIN_YEAR,
          index: index
        };
      })
      .filter(item => item.valid)
      .map(item => item.index);

    if (validYears.length > 0) {
      const index = validYears[0];
      const year = years[index];
      const dm = this.mapIntsToDM(rests[index]);
      if (dm) {
        return {
          year: year,
          month: dm.month,
          day: dm.day
        };
      } else {
        // for a candidate that includes a four-digit year,
        // when the remaining ints don't match to a day and month,
        // it is not a date.
        return;
      }
    }

    // given no four-digit year, two digit years are the most flexible int to match, so
    // try to parse a day-month out of ints[0..1] or ints[1..0]
    const validDMs: Array<IDMY> = rests
      .map((pair, index) => {
        return {
          dm: this.mapIntsToDM(pair),
          year: years[index]
        };
      })
      .filter(item => item.dm)
      .map(item => {
        const { month, day } = item.dm;
        return {
          year: this.twoToFourDigitYear(item.year),
          month: month,
          day: day
        };
      });

    if (validDMs.length > 0)
      return validDMs[0];
  }

  private twoToFourDigitYear(year: number): number {
    if (year > 99)
      return year;
    if (year > 50)
      // 87 -> 1987
      return year + 1900;
    // 15 -> 2015
    return year + 2000;
  }

  private mapIntsToDM(ints: number[]): { day: number, month: number } {
    let d = ints[0];
    let m = ints[1];

    if (d >= 1 && d <= 31 && m >= 1 && m <= 12)
      return {
        day: d,
        month: m
      };

    // Reverse
    d = ints[1];
    m = ints[0];

    if (d >= 1 && d <= 31 && m >= 1 && m <= 12)
      return {
        day: d,
        month: m
      };
  }

  public match(password: string): Array<IDateMatch> {
    const matches = new Array<IDateMatch>();

    // dates without separators are between length 4 '1191' and 8 '11111991'
    for (let i = 0; i <= password.length - 4; i++) {
      for (let j = i + 3; j <= i + 7 && j < password.length; j++) {
        const token = password.slice(i, j + 1);

        if (!REGEX_DATE_NO_SEPARATOR.test(token))
          continue;

        const candidates = new Array<IDMY>();
        DATE_SPLITS[token.length].forEach(pair => {
          const k = pair[0];
          const l = pair[1];
          const dmy = this.mapIntsToDMY([
            parseInt(token.slice(0, k)),
            parseInt(token.slice(k, l)),
            parseInt(token.slice(l)),
          ]);

          if (dmy)
            candidates.push(dmy);
        });
        if (candidates.length === 0)
          continue;

        // at this point: different possible dmy mappings for the same i,j substring.
        // match the candidate date that likely takes the fewest guesses: a year closest to 2000.
        // (scoring.REFERENCE_YEAR).
        //
        // ie, considering '111504', prefer 11-15-04 to 1-1-1504
        // (interpreting '04' as 2004)
        const metric = (candidate: IDMY) => Math.abs(candidate.year - REFERENCE_YEAR);

        let bestCandidate = candidates[0];
        let minDistance = metric(bestCandidate);

        candidates.forEach(candidate => {
          const distance = metric(candidate);
          if (distance < minDistance) {
            bestCandidate = candidate;
            minDistance = distance;
          }
        });

        matches.push({
          pattern: "date",
          token: token,
          i: i,
          j: j,
          separator: "",
          year: bestCandidate.year,
          month: bestCandidate.month,
          day: bestCandidate.day
        });
      }
    }

    // dates with separators are between length 6 '1/1/91' and 10 '11/11/1991'
    for (let i = 0; i <= password.length - 6; i++) {
      for (let j = i + 5; j <= i + 9 && j < password.length; j++) {
        const token = password.slice(i, j + 1);
        const regexMatch = REGEX_DATE_WITH_SEPARATOR.exec(token);
        if (!regexMatch)
          continue;

        const dmy = this.mapIntsToDMY([
          parseInt(regexMatch[1]),
          parseInt(regexMatch[3]),
          parseInt(regexMatch[4]),
        ]);

        if (!dmy)
          continue;

        matches.push({
          pattern: "date",
          token: token,
          i: i,
          j: j,
          separator: regexMatch[2],
          year: dmy.year,
          month: dmy.month,
          day: dmy.day
        });
      }
    }

    // matches now contains all valid date strings in a way that is tricky to capture
    // with regexes only. while thorough, it will contain some unintuitive noise:
    //
    // '2015_06_04', in addition to matching 2015_06_04, will also contain
    // 5(!) other date matches: 15_06_04, 5_06_04, ..., even 2015 (matched as 5/1/2020)
    //
    // to reduce noise, remove date matches that are strict substrings of others
    return Helpers.sortMatches(
      matches.filter(match =>
        !matches.some(otherMatch => {
          if (match !== otherMatch)
            return otherMatch.i <= match.i && otherMatch.j >= match.j;
        })
      )
    );
  }
}