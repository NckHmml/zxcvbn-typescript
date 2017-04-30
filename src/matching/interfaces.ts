export interface IMatch {
  pattern: "bruteforce" | "date" | "dictionary" | "regex" | "repeat" | "spatial" | "sequence";
  i: number;
  j: number;
  token: string;
  guesses?: number;
  guessesLog10?: number;
}

export interface IMatcher {
  match: (password: string) => Array<IMatch>;
}

export interface IRankedDictionaries {
  [name: string]: {
    [word: string]: number;
  };
}