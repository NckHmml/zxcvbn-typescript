export const BRUTEFORCE_CARDINALITY              = 10;

export const DATE_MAX_YEAR                       = 2050;
export const DATE_MIN_YEAR                       = 1000;

export const MIN_GUESSES_BEFORE_GROWING_SEQUENCE = 10000;
export const MIN_SUBMATCH_GUESSES_SINGLE_CHAR    = 10;
export const MIN_SUBMATCH_GUESSES_MULTI_CHAR     = 50;

export const MAX_DELTA                           = 5;

export const REFERENCE_YEAR                      = new Date().getFullYear();

export const REGEX_RECENT_YEAR                   = /19\d\d|200\d|201\d/g;
export const REGEX_DATE_NO_SEPARATOR             = /^\d{4,8}$/;
export const REGEX_DATE_WITH_SEPARATOR           = /^(\d{1,4})([\s\/\\_.-])(\d{1,2})\2(\d{1,4})$/;
export const REGEX_START                         = /[az019]/i;
export const REGEX_DIGIT                         = /\d/;
export const REGEX_SHIFTED                       = /[~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL: "ZXCVBNM<>?]/;
export const REGEX_SEQUENCE_LOWER                = /^[a-z]+$/;
export const REGEX_SEQUENCE_UPPER                = /^[A-Z]+$/;
export const REGEX_SEQUENCE_DIGIT                = /^\d+$/;