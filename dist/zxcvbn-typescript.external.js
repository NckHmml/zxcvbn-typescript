(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lists_1 = __webpack_require__(2);
var Matching = (function () {
    function Matching() {
        var _this = this;
        this.RankedDictionaries = {};
        /**
         * Dictionary match (common passwords, english, last names, etc)
         */
        this.dictionaryMatch = function (password) {
            var matches = new Array();
            var passwordLower = password.toLowerCase();
            for (var dictionaryName in _this.RankedDictionaries) {
                var rankedDict = _this.RankedDictionaries[dictionaryName];
                for (var i = 0; i < password.length; i++) {
                    for (var j = i; j < password.length; j++) {
                        var word = passwordLower.slice(i, j + 1);
                        if (word in rankedDict) {
                            var rank = rankedDict[word];
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
            return _this.sorted(matches);
        };
        /**
         * Dictionary match, reversed (common passwords, english, last names, etc)
         */
        this.reverseDictionaryMatch = function (password) {
            var reversed_password = password.split("").reverse().join("");
            var matches = _this.dictionaryMatch(reversed_password);
            var ref;
            matches.forEach(function (match) {
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
            return _this.sorted(matches);
        };
        // Loads the json if it's an external build
        if (lists_1.FREQUENCY_LIST === undefined) {
            // ToDo: magically load frequency_list.json
            console.log("ToDo: magically load frequency_list.json at:", Matching.frequencyList);
        }
        // Build the ranked dictionary
        for (var name_1 in lists_1.FREQUENCY_LIST) {
            var list = lists_1.FREQUENCY_LIST[name_1].split(",");
            this.RankedDictionaries[name_1] = this.buildRankedDictionary(list);
        }
    }
    /**
     * Builds the ranked dictionary
     */
    Matching.prototype.buildRankedDictionary = function (orderedList) {
        var result = {};
        orderedList.forEach(function (word, index) {
            result[word] = index;
        });
        return result;
    };
    /**
     * Sorts matches
     */
    Matching.prototype.sorted = function (matches) {
        // sort on i primary, j secondary
        return matches.sort(function (m1, m2) {
            return (m1.i - m2.i) || (m1.j - m2.j);
        });
    };
    /**
     * Appends the user input to the dictionaries
     * @param orderedList A list of ordered words
     */
    Matching.prototype.setUserInputDictionary = function (orderedList) {
        return this.RankedDictionaries["user_inputs"] = this.buildRankedDictionary(orderedList.slice());
    };
    /**
     * Runs all passwords matches
     * @param password password to match with
     */
    Matching.prototype.omnimatch = function (password) {
        var matchers = [this.dictionaryMatch, this.reverseDictionaryMatch];
        // Run matchers
        var matches = matchers
            .map(function (matcher) { return matcher(password); })
            .reduce(function (previous, next) { return previous.concat(next); });
        return this.sorted(matches);
    };
    return Matching;
}());
Matching.frequencyList = "frequency_list.json";
exports.Matching = Matching;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var matching_1 = __webpack_require__(0);
var Zxcvbn = (function () {
    function Zxcvbn() {
    }
    /**
     * Checks the strength of a password
     * @param password password to check
     * @param user_inputs additional dictionary information
     */
    Zxcvbn.check = function (password, user_inputs) {
        if (user_inputs === void 0) { user_inputs = []; }
        var start = new Date().getTime();
        // Sanitize and set user inputs
        user_inputs = user_inputs.map(function (input) { return input.toLowerCase(); });
        Zxcvbn.matching.setUserInputDictionary(user_inputs);
        // Get matches
        var matches = Zxcvbn.matching.omnimatch(password);
        console.log(matches);
        var calc_time = new Date().getTime() - start;
        return {
            feedback: "none",
            calc_time: calc_time
        };
    };
    return Zxcvbn;
}());
Zxcvbn.matching = new matching_1.Matching();
exports.Zxcvbn = Zxcvbn;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FREQUENCY_LIST = undefined;
exports.ADJACENCY_GRAPHS = {
    qwerty: {
        "!": ["`~", null, null, "2@", "qQ", null],
        "\"": [";:", "[{", "]}", null, null, "/?"],
        "#": ["2@", null, null, "4$", "eE", "wW"],
        "$": ["3#", null, null, "5%", "rR", "eE"],
        "%": ["4$", null, null, "6^", "tT", "rR"],
        "&": ["6^", null, null, "8*", "uU", "yY"],
        "'": [";:", "[{", "]}", null, null, "/?"],
        "(": ["8*", null, null, "0)", "oO", "iI"],
        ")": ["9(", null, null, "-_", "pP", "oO"],
        "*": ["7&", null, null, "9(", "iI", "uU"],
        "+": ["-_", null, null, null, "]}", "[{"],
        ",": ["mM", "kK", "lL", ".>", null, null],
        "-": ["0)", null, null, "=+", "[{", "pP"],
        ".": [",<", "lL", ";:", "/?", null, null],
        "/": [".>", ";:", "'\"", null, null, null],
        "0": ["9(", null, null, "-_", "pP", "oO"],
        "1": ["`~", null, null, "2@", "qQ", null],
        "2": ["1!", null, null, "3#", "wW", "qQ"],
        "3": ["2@", null, null, "4$", "eE", "wW"],
        "4": ["3#", null, null, "5%", "rR", "eE"],
        "5": ["4$", null, null, "6^", "tT", "rR"],
        "6": ["5%", null, null, "7&", "yY", "tT"],
        "7": ["6^", null, null, "8*", "uU", "yY"],
        "8": ["7&", null, null, "9(", "iI", "uU"],
        "9": ["8*", null, null, "0)", "oO", "iI"],
        ":": ["lL", "pP", "[{", "'\"", "/?", ".>"],
        ";": ["lL", "pP", "[{", "'\"", "/?", ".>"],
        "<": ["mM", "kK", "lL", ".>", null, null],
        "=": ["-_", null, null, null, "]}", "[{"],
        ">": [",<", "lL", ";:", "/?", null, null],
        "?": [".>", ";:", "'\"", null, null, null],
        "@": ["1!", null, null, "3#", "wW", "qQ"],
        "A": [null, "qQ", "wW", "sS", "zZ", null],
        "B": ["vV", "gG", "hH", "nN", null, null],
        "C": ["xX", "dD", "fF", "vV", null, null],
        "D": ["sS", "eE", "rR", "fF", "cC", "xX"],
        "E": ["wW", "3#", "4$", "rR", "dD", "sS"],
        "F": ["dD", "rR", "tT", "gG", "vV", "cC"],
        "G": ["fF", "tT", "yY", "hH", "bB", "vV"],
        "H": ["gG", "yY", "uU", "jJ", "nN", "bB"],
        "I": ["uU", "8*", "9(", "oO", "kK", "jJ"],
        "J": ["hH", "uU", "iI", "kK", "mM", "nN"],
        "K": ["jJ", "iI", "oO", "lL", ",<", "mM"],
        "L": ["kK", "oO", "pP", ";:", ".>", ",<"],
        "M": ["nN", "jJ", "kK", ",<", null, null],
        "N": ["bB", "hH", "jJ", "mM", null, null],
        "O": ["iI", "9(", "0)", "pP", "lL", "kK"],
        "P": ["oO", "0)", "-_", "[{", ";:", "lL"],
        "Q": [null, "1!", "2@", "wW", "aA", null],
        "R": ["eE", "4$", "5%", "tT", "fF", "dD"],
        "S": ["aA", "wW", "eE", "dD", "xX", "zZ"],
        "T": ["rR", "5%", "6^", "yY", "gG", "fF"],
        "U": ["yY", "7&", "8*", "iI", "jJ", "hH"],
        "V": ["cC", "fF", "gG", "bB", null, null],
        "W": ["qQ", "2@", "3#", "eE", "sS", "aA"],
        "X": ["zZ", "sS", "dD", "cC", null, null],
        "Y": ["tT", "6^", "7&", "uU", "hH", "gG"],
        "Z": [null, "aA", "sS", "xX", null, null],
        "[": ["pP", "-_", "=+", "]}", "'\"", ";:"],
        "\\": ["]}", null, null, null, null, null],
        "]": ["[{", "=+", null, "\\|", null, "'\""],
        "^": ["5%", null, null, "7&", "yY", "tT"],
        "_": ["0)", null, null, "=+", "[{", "pP"],
        "`": [null, null, null, "1!", null, null],
        "a": [null, "qQ", "wW", "sS", "zZ", null],
        "b": ["vV", "gG", "hH", "nN", null, null],
        "c": ["xX", "dD", "fF", "vV", null, null],
        "d": ["sS", "eE", "rR", "fF", "cC", "xX"],
        "e": ["wW", "3#", "4$", "rR", "dD", "sS"],
        "f": ["dD", "rR", "tT", "gG", "vV", "cC"],
        "g": ["fF", "tT", "yY", "hH", "bB", "vV"],
        "h": ["gG", "yY", "uU", "jJ", "nN", "bB"],
        "i": ["uU", "8*", "9(", "oO", "kK", "jJ"],
        "j": ["hH", "uU", "iI", "kK", "mM", "nN"],
        "k": ["jJ", "iI", "oO", "lL", ",<", "mM"],
        "l": ["kK", "oO", "pP", ";:", ".>", ",<"],
        "m": ["nN", "jJ", "kK", ",<", null, null],
        "n": ["bB", "hH", "jJ", "mM", null, null],
        "o": ["iI", "9(", "0)", "pP", "lL", "kK"],
        "p": ["oO", "0)", "-_", "[{", ";:", "lL"],
        "q": [null, "1!", "2@", "wW", "aA", null],
        "r": ["eE", "4$", "5%", "tT", "fF", "dD"],
        "s": ["aA", "wW", "eE", "dD", "xX", "zZ"],
        "t": ["rR", "5%", "6^", "yY", "gG", "fF"],
        "u": ["yY", "7&", "8*", "iI", "jJ", "hH"],
        "v": ["cC", "fF", "gG", "bB", null, null],
        "w": ["qQ", "2@", "3#", "eE", "sS", "aA"],
        "x": ["zZ", "sS", "dD", "cC", null, null],
        "y": ["tT", "6^", "7&", "uU", "hH", "gG"],
        "z": [null, "aA", "sS", "xX", null, null],
        "{": ["pP", "-_", "=+", "]}", "'\"", ";:"],
        "|": ["]}", null, null, null, null, null],
        "}": ["[{", "=+", null, "\\|", null, "'\""],
        "~": [null, null, null, "1!", null, null]
    },
    dvorak: {
        "!": ["`~", null, null, "2@", "'\"", null],
        "\"": [null, "1!", "2@", ",<", "aA", null],
        "#": ["2@", null, null, "4$", ".>", ",<"],
        "$": ["3#", null, null, "5%", "pP", ".>"],
        "%": ["4$", null, null, "6^", "yY", "pP"],
        "&": ["6^", null, null, "8*", "gG", "fF"],
        "'": [null, "1!", "2@", ",<", "aA", null],
        "(": ["8*", null, null, "0)", "rR", "cC"],
        ")": ["9(", null, null, "[{", "lL", "rR"],
        "*": ["7&", null, null, "9(", "cC", "gG"],
        "+": ["/?", "]}", null, "\\|", null, "-_"],
        ",": ["'\"", "2@", "3#", ".>", "oO", "aA"],
        "-": ["sS", "/?", "=+", null, null, "zZ"],
        ".": [",<", "3#", "4$", "pP", "eE", "oO"],
        "/": ["lL", "[{", "]}", "=+", "-_", "sS"],
        "0": ["9(", null, null, "[{", "lL", "rR"],
        "1": ["`~", null, null, "2@", "'\"", null],
        "2": ["1!", null, null, "3#", ",<", "'\""],
        "3": ["2@", null, null, "4$", ".>", ",<"],
        "4": ["3#", null, null, "5%", "pP", ".>"],
        "5": ["4$", null, null, "6^", "yY", "pP"],
        "6": ["5%", null, null, "7&", "fF", "yY"],
        "7": ["6^", null, null, "8*", "gG", "fF"],
        "8": ["7&", null, null, "9(", "cC", "gG"],
        "9": ["8*", null, null, "0)", "rR", "cC"],
        ":": [null, "aA", "oO", "qQ", null, null],
        ";": [null, "aA", "oO", "qQ", null, null],
        "<": ["'\"", "2@", "3#", ".>", "oO", "aA"],
        "=": ["/?", "]}", null, "\\|", null, "-_"],
        ">": [",<", "3#", "4$", "pP", "eE", "oO"],
        "?": ["lL", "[{", "]}", "=+", "-_", "sS"],
        "@": ["1!", null, null, "3#", ",<", "'\""],
        "A": [null, "'\"", ",<", "oO", ";:", null],
        "B": ["xX", "dD", "hH", "mM", null, null],
        "C": ["gG", "8*", "9(", "rR", "tT", "hH"],
        "D": ["iI", "fF", "gG", "hH", "bB", "xX"],
        "E": ["oO", ".>", "pP", "uU", "jJ", "qQ"],
        "F": ["yY", "6^", "7&", "gG", "dD", "iI"],
        "G": ["fF", "7&", "8*", "cC", "hH", "dD"],
        "H": ["dD", "gG", "cC", "tT", "mM", "bB"],
        "I": ["uU", "yY", "fF", "dD", "xX", "kK"],
        "J": ["qQ", "eE", "uU", "kK", null, null],
        "K": ["jJ", "uU", "iI", "xX", null, null],
        "L": ["rR", "0)", "[{", "/?", "sS", "nN"],
        "M": ["bB", "hH", "tT", "wW", null, null],
        "N": ["tT", "rR", "lL", "sS", "vV", "wW"],
        "O": ["aA", ",<", ".>", "eE", "qQ", ";:"],
        "P": [".>", "4$", "5%", "yY", "uU", "eE"],
        "Q": [";:", "oO", "eE", "jJ", null, null],
        "R": ["cC", "9(", "0)", "lL", "nN", "tT"],
        "S": ["nN", "lL", "/?", "-_", "zZ", "vV"],
        "T": ["hH", "cC", "rR", "nN", "wW", "mM"],
        "U": ["eE", "pP", "yY", "iI", "kK", "jJ"],
        "V": ["wW", "nN", "sS", "zZ", null, null],
        "W": ["mM", "tT", "nN", "vV", null, null],
        "X": ["kK", "iI", "dD", "bB", null, null],
        "Y": ["pP", "5%", "6^", "fF", "iI", "uU"],
        "Z": ["vV", "sS", "-_", null, null, null],
        "[": ["0)", null, null, "]}", "/?", "lL"],
        "\\": ["=+", null, null, null, null, null],
        "]": ["[{", null, null, null, "=+", "/?"],
        "^": ["5%", null, null, "7&", "fF", "yY"],
        "_": ["sS", "/?", "=+", null, null, "zZ"],
        "`": [null, null, null, "1!", null, null],
        "a": [null, "'\"", ",<", "oO", ";:", null],
        "b": ["xX", "dD", "hH", "mM", null, null],
        "c": ["gG", "8*", "9(", "rR", "tT", "hH"],
        "d": ["iI", "fF", "gG", "hH", "bB", "xX"],
        "e": ["oO", ".>", "pP", "uU", "jJ", "qQ"],
        "f": ["yY", "6^", "7&", "gG", "dD", "iI"],
        "g": ["fF", "7&", "8*", "cC", "hH", "dD"],
        "h": ["dD", "gG", "cC", "tT", "mM", "bB"],
        "i": ["uU", "yY", "fF", "dD", "xX", "kK"],
        "j": ["qQ", "eE", "uU", "kK", null, null],
        "k": ["jJ", "uU", "iI", "xX", null, null],
        "l": ["rR", "0)", "[{", "/?", "sS", "nN"],
        "m": ["bB", "hH", "tT", "wW", null, null],
        "n": ["tT", "rR", "lL", "sS", "vV", "wW"],
        "o": ["aA", ",<", ".>", "eE", "qQ", ";:"],
        "p": [".>", "4$", "5%", "yY", "uU", "eE"],
        "q": [";:", "oO", "eE", "jJ", null, null],
        "r": ["cC", "9(", "0)", "lL", "nN", "tT"],
        "s": ["nN", "lL", "/?", "-_", "zZ", "vV"],
        "t": ["hH", "cC", "rR", "nN", "wW", "mM"],
        "u": ["eE", "pP", "yY", "iI", "kK", "jJ"],
        "v": ["wW", "nN", "sS", "zZ", null, null],
        "w": ["mM", "tT", "nN", "vV", null, null],
        "x": ["kK", "iI", "dD", "bB", null, null],
        "y": ["pP", "5%", "6^", "fF", "iI", "uU"],
        "z": ["vV", "sS", "-_", null, null, null],
        "{": ["0)", null, null, "]}", "/?", "lL"],
        "|": ["=+", null, null, null, null, null],
        "}": ["[{", null, null, null, "=+", "/?"],
        "~": [null, null, null, "1!", null, null]
    },
    keypad: {
        "*": ["/", null, null, null, "-", "+", "9", "8"],
        "+": ["9", "*", "-", null, null, null, null, "6"],
        "-": ["*", null, null, null, null, null, "+", "9"],
        ".": ["0", "2", "3", null, null, null, null, null],
        "/": [null, null, null, null, "*", "9", "8", "7"],
        "0": [null, "1", "2", "3", ".", null, null, null],
        "1": [null, null, "4", "5", "2", "0", null, null],
        "2": ["1", "4", "5", "6", "3", ".", "0", null],
        "3": ["2", "5", "6", null, null, null, ".", "0"],
        "4": [null, null, "7", "8", "5", "2", "1", null],
        "5": ["4", "7", "8", "9", "6", "3", "2", "1"],
        "6": ["5", "8", "9", "+", null, null, "3", "2"],
        "7": [null, null, null, "/", "8", "5", "4", null],
        "8": ["7", null, "/", "*", "9", "6", "5", "4"],
        "9": ["8", "/", "*", "-", "+", null, "6", "5"]
    },
    mac_keypad: {
        "*": ["/", null, null, null, null, null, "-", "9"],
        "+": ["6", "9", "-", null, null, null, null, "3"],
        "-": ["9", "/", "*", null, null, null, "+", "6"],
        ".": ["0", "2", "3", null, null, null, null, null],
        "/": ["=", null, null, null, "*", "-", "9", "8"],
        "0": [null, "1", "2", "3", ".", null, null, null],
        "1": [null, null, "4", "5", "2", "0", null, null],
        "2": ["1", "4", "5", "6", "3", ".", "0", null],
        "3": ["2", "5", "6", "+", null, null, ".", "0"],
        "4": [null, null, "7", "8", "5", "2", "1", null],
        "5": ["4", "7", "8", "9", "6", "3", "2", "1"],
        "6": ["5", "8", "9", "-", "+", null, "3", "2"],
        "7": [null, null, null, "=", "8", "5", "4", null],
        "8": ["7", null, "=", "/", "9", "6", "5", "4"],
        "9": ["8", "=", "/", "*", "-", "+", "6", "5"],
        "=": [null, null, null, null, "/", "9", "8", "7"]
    }
};
exports.L33T_TABLE = {
    a: ["4", "@"],
    b: ["8"],
    c: ["(", "{", "[", "<"],
    e: ["3"],
    g: ["6", "9"],
    i: ["1", "!", "|"],
    l: ["1", "|", "7"],
    o: ["0"],
    s: ["$", "5"],
    t: ["+", "7"],
    x: ["%"],
    z: ["2"]
};
exports.DATE_SPLITS = {
    4: [[1, 2], [2, 3]],
    5: [[1, 3], [2, 3]],
    6: [[1, 2], [2, 4], [4, 5]],
    7: [[1, 3], [2, 3], [4, 5], [4, 6]],
    8: [[2, 4], [4, 6]]
};


/***/ })
/******/ ]);
});