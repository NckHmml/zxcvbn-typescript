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
export declare class Matching {
    static frequencyList: string;
    private RankedDictionaries;
    constructor();
    /**
     * Builds the ranked dictionary
     */
    private buildRankedDictionary(orderedList);
    /**
     * Sorts matches
     */
    private sorted(matches);
    /**
     * Dictionary match (common passwords, english, last names, etc)
     */
    private dictionaryMatch;
    /**
     * Dictionary match, reversed (common passwords, english, last names, etc)
     */
    private reverseDictionaryMatch;
    /**
     * Appends the user input to the dictionaries
     * @param orderedList A list of ordered words
     */
    setUserInputDictionary(orderedList: string[]): {
        [word: string]: number;
    };
    /**
     * Runs all passwords matches
     * @param password password to match with
     */
    omnimatch(password: string): Array<IMatch>;
}
