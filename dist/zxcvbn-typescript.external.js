!function(n,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t=e();for(var l in t)("object"==typeof exports?exports:n)[l]=t[l]}}(this,function(){return function(n){function e(l){if(t[l])return t[l].exports;var r=t[l]={i:l,l:!1,exports:{}};return n[l].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var t={};return e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,l){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:l})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="",e(e.s=4)}([function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(2),r=t(1);e.BRUTEFORCE_CARDINALITY=10,e.DATE_MAX_YEAR=2050,e.DATE_MIN_YEAR=1e3,e.MIN_GUESSES_BEFORE_GROWING_SEQUENCE=1e4,e.MIN_SUBMATCH_GUESSES_SINGLE_CHAR=10,e.MIN_SUBMATCH_GUESSES_MULTI_CHAR=50,e.MAX_DELTA=5,e.REFERENCE_YEAR=(new Date).getFullYear(),e.MIN_YEAR_SPACE=20,e.REGEX_RECENT_YEAR=/19\d\d|200\d|201\d/g,e.REGEX_DATE_NO_SEPARATOR=/^\d{4,8}$/,e.REGEX_DATE_WITH_SEPARATOR=/^(\d{1,4})([\s\/\\_.-])(\d{1,2})\2(\d{1,4})$/,e.REGEX_START=/[az019]/i,e.REGEX_DIGIT=/\d/,e.REGEX_SHIFTED=/[~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL: "ZXCVBNM<>?]/,e.REGEX_SEQUENCE_LOWER=/^[a-z]+$/,e.REGEX_SEQUENCE_UPPER=/^[A-Z]+$/,e.REGEX_SEQUENCE_DIGIT=/^\d+$/,e.REGEX_START_UPPER=/^[A-Z][^A-Z]+$/,e.REGEX_END_UPPER=/^[^A-Z]+[A-Z]$/,e.REGEX_ALL_UPPER=/^[^a-z]+$/,e.REGEX_ALL_LOWER=/^[^A-Z]+$/,e.KEYBOARD_AVERAGE_DEGREE=r.Helpers.calcAvarageDegree(l.ADJACENCY_GRAPHS.qwerty),e.KEYPAD_AVERAGE_DEGREE=r.Helpers.calcAvarageDegree(l.ADJACENCY_GRAPHS.keypad),e.KEYBOARD_STARTING_POSITIONS=r.Helpers.countKeys(l.ADJACENCY_GRAPHS.qwerty),e.KEYPAD_STARTING_POSITIONS=r.Helpers.countKeys(l.ADJACENCY_GRAPHS.keypad)},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function n(){}return n.sortMatches=function(n){return n.sort(function(n,e){return n.i-e.i||n.j-e.j})},n.log10=function(n){return Math.log(n)/Math.log(10)},n.countKeys=function(n){return function(){var e=0;for(var t in n)e++;return e}()},n.calcAvarageDegree=function(n){var e=0,t=0;for(var l in n)e+=n[l].filter(function(n){return Boolean(n)}).length,t++;return e/=t},n.nCk=function(n,e){if(e>n)return 0;if(0===e)return 1;for(var t=1,l=1;l<=e;l++)t*=n,t/=l,n-=1;return t},n}();e.Helpers=l},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FREQUENCY_LIST=void 0,e.ADJACENCY_GRAPHS={qwerty:{"!":["`~",null,null,"2@","qQ",null],'"':[";:","[{","]}",null,null,"/?"],"#":["2@",null,null,"4$","eE","wW"],$:["3#",null,null,"5%","rR","eE"],"%":["4$",null,null,"6^","tT","rR"],"&":["6^",null,null,"8*","uU","yY"],"'":[";:","[{","]}",null,null,"/?"],"(":["8*",null,null,"0)","oO","iI"],")":["9(",null,null,"-_","pP","oO"],"*":["7&",null,null,"9(","iI","uU"],"+":["-_",null,null,null,"]}","[{"],",":["mM","kK","lL",".>",null,null],"-":["0)",null,null,"=+","[{","pP"],".":[",<","lL",";:","/?",null,null],"/":[".>",";:","'\"",null,null,null],0:["9(",null,null,"-_","pP","oO"],1:["`~",null,null,"2@","qQ",null],2:["1!",null,null,"3#","wW","qQ"],3:["2@",null,null,"4$","eE","wW"],4:["3#",null,null,"5%","rR","eE"],5:["4$",null,null,"6^","tT","rR"],6:["5%",null,null,"7&","yY","tT"],7:["6^",null,null,"8*","uU","yY"],8:["7&",null,null,"9(","iI","uU"],9:["8*",null,null,"0)","oO","iI"],":":["lL","pP","[{","'\"","/?",".>"],";":["lL","pP","[{","'\"","/?",".>"],"<":["mM","kK","lL",".>",null,null],"=":["-_",null,null,null,"]}","[{"],">":[",<","lL",";:","/?",null,null],"?":[".>",";:","'\"",null,null,null],"@":["1!",null,null,"3#","wW","qQ"],A:[null,"qQ","wW","sS","zZ",null],B:["vV","gG","hH","nN",null,null],C:["xX","dD","fF","vV",null,null],D:["sS","eE","rR","fF","cC","xX"],E:["wW","3#","4$","rR","dD","sS"],F:["dD","rR","tT","gG","vV","cC"],G:["fF","tT","yY","hH","bB","vV"],H:["gG","yY","uU","jJ","nN","bB"],I:["uU","8*","9(","oO","kK","jJ"],J:["hH","uU","iI","kK","mM","nN"],K:["jJ","iI","oO","lL",",<","mM"],L:["kK","oO","pP",";:",".>",",<"],M:["nN","jJ","kK",",<",null,null],N:["bB","hH","jJ","mM",null,null],O:["iI","9(","0)","pP","lL","kK"],P:["oO","0)","-_","[{",";:","lL"],Q:[null,"1!","2@","wW","aA",null],R:["eE","4$","5%","tT","fF","dD"],S:["aA","wW","eE","dD","xX","zZ"],T:["rR","5%","6^","yY","gG","fF"],U:["yY","7&","8*","iI","jJ","hH"],V:["cC","fF","gG","bB",null,null],W:["qQ","2@","3#","eE","sS","aA"],X:["zZ","sS","dD","cC",null,null],Y:["tT","6^","7&","uU","hH","gG"],Z:[null,"aA","sS","xX",null,null],"[":["pP","-_","=+","]}","'\"",";:"],"\\":["]}",null,null,null,null,null],"]":["[{","=+",null,"\\|",null,"'\""],"^":["5%",null,null,"7&","yY","tT"],_:["0)",null,null,"=+","[{","pP"],"`":[null,null,null,"1!",null,null],a:[null,"qQ","wW","sS","zZ",null],b:["vV","gG","hH","nN",null,null],c:["xX","dD","fF","vV",null,null],d:["sS","eE","rR","fF","cC","xX"],e:["wW","3#","4$","rR","dD","sS"],f:["dD","rR","tT","gG","vV","cC"],g:["fF","tT","yY","hH","bB","vV"],h:["gG","yY","uU","jJ","nN","bB"],i:["uU","8*","9(","oO","kK","jJ"],j:["hH","uU","iI","kK","mM","nN"],k:["jJ","iI","oO","lL",",<","mM"],l:["kK","oO","pP",";:",".>",",<"],m:["nN","jJ","kK",",<",null,null],n:["bB","hH","jJ","mM",null,null],o:["iI","9(","0)","pP","lL","kK"],p:["oO","0)","-_","[{",";:","lL"],q:[null,"1!","2@","wW","aA",null],r:["eE","4$","5%","tT","fF","dD"],s:["aA","wW","eE","dD","xX","zZ"],t:["rR","5%","6^","yY","gG","fF"],u:["yY","7&","8*","iI","jJ","hH"],v:["cC","fF","gG","bB",null,null],w:["qQ","2@","3#","eE","sS","aA"],x:["zZ","sS","dD","cC",null,null],y:["tT","6^","7&","uU","hH","gG"],z:[null,"aA","sS","xX",null,null],"{":["pP","-_","=+","]}","'\"",";:"],"|":["]}",null,null,null,null,null],"}":["[{","=+",null,"\\|",null,"'\""],"~":[null,null,null,"1!",null,null]},dvorak:{"!":["`~",null,null,"2@","'\"",null],'"':[null,"1!","2@",",<","aA",null],"#":["2@",null,null,"4$",".>",",<"],$:["3#",null,null,"5%","pP",".>"],"%":["4$",null,null,"6^","yY","pP"],"&":["6^",null,null,"8*","gG","fF"],"'":[null,"1!","2@",",<","aA",null],"(":["8*",null,null,"0)","rR","cC"],")":["9(",null,null,"[{","lL","rR"],"*":["7&",null,null,"9(","cC","gG"],"+":["/?","]}",null,"\\|",null,"-_"],",":["'\"","2@","3#",".>","oO","aA"],"-":["sS","/?","=+",null,null,"zZ"],".":[",<","3#","4$","pP","eE","oO"],"/":["lL","[{","]}","=+","-_","sS"],0:["9(",null,null,"[{","lL","rR"],1:["`~",null,null,"2@","'\"",null],2:["1!",null,null,"3#",",<","'\""],3:["2@",null,null,"4$",".>",",<"],4:["3#",null,null,"5%","pP",".>"],5:["4$",null,null,"6^","yY","pP"],6:["5%",null,null,"7&","fF","yY"],7:["6^",null,null,"8*","gG","fF"],8:["7&",null,null,"9(","cC","gG"],9:["8*",null,null,"0)","rR","cC"],":":[null,"aA","oO","qQ",null,null],";":[null,"aA","oO","qQ",null,null],"<":["'\"","2@","3#",".>","oO","aA"],"=":["/?","]}",null,"\\|",null,"-_"],">":[",<","3#","4$","pP","eE","oO"],"?":["lL","[{","]}","=+","-_","sS"],"@":["1!",null,null,"3#",",<","'\""],A:[null,"'\"",",<","oO",";:",null],B:["xX","dD","hH","mM",null,null],C:["gG","8*","9(","rR","tT","hH"],D:["iI","fF","gG","hH","bB","xX"],E:["oO",".>","pP","uU","jJ","qQ"],F:["yY","6^","7&","gG","dD","iI"],G:["fF","7&","8*","cC","hH","dD"],H:["dD","gG","cC","tT","mM","bB"],I:["uU","yY","fF","dD","xX","kK"],J:["qQ","eE","uU","kK",null,null],K:["jJ","uU","iI","xX",null,null],L:["rR","0)","[{","/?","sS","nN"],M:["bB","hH","tT","wW",null,null],N:["tT","rR","lL","sS","vV","wW"],O:["aA",",<",".>","eE","qQ",";:"],P:[".>","4$","5%","yY","uU","eE"],Q:[";:","oO","eE","jJ",null,null],R:["cC","9(","0)","lL","nN","tT"],S:["nN","lL","/?","-_","zZ","vV"],T:["hH","cC","rR","nN","wW","mM"],U:["eE","pP","yY","iI","kK","jJ"],V:["wW","nN","sS","zZ",null,null],W:["mM","tT","nN","vV",null,null],X:["kK","iI","dD","bB",null,null],Y:["pP","5%","6^","fF","iI","uU"],Z:["vV","sS","-_",null,null,null],"[":["0)",null,null,"]}","/?","lL"],"\\":["=+",null,null,null,null,null],"]":["[{",null,null,null,"=+","/?"],"^":["5%",null,null,"7&","fF","yY"],_:["sS","/?","=+",null,null,"zZ"],"`":[null,null,null,"1!",null,null],a:[null,"'\"",",<","oO",";:",null],b:["xX","dD","hH","mM",null,null],c:["gG","8*","9(","rR","tT","hH"],d:["iI","fF","gG","hH","bB","xX"],e:["oO",".>","pP","uU","jJ","qQ"],f:["yY","6^","7&","gG","dD","iI"],g:["fF","7&","8*","cC","hH","dD"],h:["dD","gG","cC","tT","mM","bB"],i:["uU","yY","fF","dD","xX","kK"],j:["qQ","eE","uU","kK",null,null],k:["jJ","uU","iI","xX",null,null],l:["rR","0)","[{","/?","sS","nN"],m:["bB","hH","tT","wW",null,null],n:["tT","rR","lL","sS","vV","wW"],o:["aA",",<",".>","eE","qQ",";:"],p:[".>","4$","5%","yY","uU","eE"],q:[";:","oO","eE","jJ",null,null],r:["cC","9(","0)","lL","nN","tT"],s:["nN","lL","/?","-_","zZ","vV"],t:["hH","cC","rR","nN","wW","mM"],u:["eE","pP","yY","iI","kK","jJ"],v:["wW","nN","sS","zZ",null,null],w:["mM","tT","nN","vV",null,null],x:["kK","iI","dD","bB",null,null],y:["pP","5%","6^","fF","iI","uU"],z:["vV","sS","-_",null,null,null],"{":["0)",null,null,"]}","/?","lL"],"|":["=+",null,null,null,null,null],"}":["[{",null,null,null,"=+","/?"],"~":[null,null,null,"1!",null,null]},keypad:{"*":["/",null,null,null,"-","+","9","8"],"+":["9","*","-",null,null,null,null,"6"],"-":["*",null,null,null,null,null,"+","9"],".":["0","2","3",null,null,null,null,null],"/":[null,null,null,null,"*","9","8","7"],0:[null,"1","2","3",".",null,null,null],1:[null,null,"4","5","2","0",null,null],2:["1","4","5","6","3",".","0",null],3:["2","5","6",null,null,null,".","0"],4:[null,null,"7","8","5","2","1",null],5:["4","7","8","9","6","3","2","1"],6:["5","8","9","+",null,null,"3","2"],7:[null,null,null,"/","8","5","4",null],8:["7",null,"/","*","9","6","5","4"],9:["8","/","*","-","+",null,"6","5"]},mac_keypad:{"*":["/",null,null,null,null,null,"-","9"],"+":["6","9","-",null,null,null,null,"3"],"-":["9","/","*",null,null,null,"+","6"],".":["0","2","3",null,null,null,null,null],"/":["=",null,null,null,"*","-","9","8"],0:[null,"1","2","3",".",null,null,null],1:[null,null,"4","5","2","0",null,null],2:["1","4","5","6","3",".","0",null],3:["2","5","6","+",null,null,".","0"],4:[null,null,"7","8","5","2","1",null],5:["4","7","8","9","6","3","2","1"],6:["5","8","9","-","+",null,"3","2"],7:[null,null,null,"=","8","5","4",null],8:["7",null,"=","/","9","6","5","4"],9:["8","=","/","*","-","+","6","5"],"=":[null,null,null,null,"/","9","8","7"]}},e.L33T_TABLE={a:["4","@"],b:["8"],c:["(","{","[","<"],e:["3"],g:["6","9"],i:["1","!","|"],l:["1","|","7"],o:["0"],s:["$","5"],t:["+","7"],x:["%"],z:["2"]},e.DATE_SPLITS={4:[[1,2],[2,3]],5:[[1,3],[2,3]],6:[[1,2],[2,4],[4,5]],7:[[1,3],[2,3],[4,5],[4,6]],8:[[2,4],[4,6]]}},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(1),u=t(15),a=t(16),i=t(17),o=t(18),c=t(19),s=t(20),f=t(21),p=function(){function n(){}return n.estimateGuesses=function(n,e){if(e.guesses)return e.guesses;return e.token.length<n.length&&(1==e.token.length?l.MIN_SUBMATCH_GUESSES_SINGLE_CHAR:l.MIN_SUBMATCH_GUESSES_MULTI_CHAR),e.guesses=this.estimationFunctions[e.pattern].estimate(e),e.guessesLog10=r.Helpers.log10(e.guesses),e.guesses},n.updateOptimal=function(n,e,t,r,u){var a=t.j,i=this.estimateGuesses(n,t);r>1&&(i*=e.pi[t.i-1][r-1]);var o=this.factorial(r)*i;u||(o+=Math.pow(l.MIN_GUESSES_BEFORE_GROWING_SEQUENCE,r-1));for(var c in e.g[a])if(!(parseInt(c)>r)&&e.g[a][r]<=o)return;e.g[a][r]=o,e.m[a][r]=t,e.pi[a][r]=i},n.bruteforceUpdate=function(n,e,t,l){var r=this.makeBruteforceMatch(n,0,t);this.updateOptimal(n,e,r,1,l);for(var u=1;u<=t;u++){r=this.makeBruteforceMatch(n,u,t);for(var a in e.m[u-1]){"bruteforce"!==e.m[u-1][a].pattern&&this.updateOptimal(n,e,r,parseInt(a)+1,l)}}},n.makeBruteforceMatch=function(n,e,t){return{pattern:"bruteforce",token:n.slice(e,t+1),i:e,j:t}},n.unwind=function(n,e){var t,l=new Array,r=e-1,u=1/0;for(var a in n.g[r]){var i=parseInt(a),o=n.g[r][i];o>=u||(t=i,u=o)}for(;r>=0;){var c=n.m[r][t];l.unshift(c),r=c.i-1,t--}return l},n.mostGuessableMatchSequence=function(n,e,t){var l=this;void 0===t&&(t=!1);var u=n.length,a=Array.apply({},new Array(u)),i=a.map(function(n){return[]});e.forEach(function(n){return i[n.j].push(n)}),i.forEach(function(n){return n.sort(function(n,e){return n.i-e.i})});for(var o={m:a.map(function(n){return[]}),pi:a.map(function(n){return[]}),g:a.map(function(n){return[]})},c=0;c<u;c++)i[c].forEach(function(e){if(e.i>0)for(var r in o.m[e.i-1])l.updateOptimal(n,o,e,parseInt(r)+1,t);else l.updateOptimal(n,o,e,1,t)}),this.bruteforceUpdate(n,o,c,t);var s=this.unwind(o,u),f=s.length,p=1;return n.length>0&&(p=o.g[u-1][f]),{password:n,sequence:s,guesses:p,guessesLog10:r.Helpers.log10(p)}},n}();p.estimationFunctions={bruteforce:new u.BruteforceCalculator,dictionary:new i.DictionaryCalculator,date:new a.DateCalculator,regex:new o.RegexCalculator,repeat:new c.RepeatCalculator,sequence:new s.SequenceCalculator,spatial:new f.SpatialCalculator},p.factorial=function(n){if(n<2)return 1;for(var e=1,t=2;t<=n;t++)e*=t;return e},e.Scoring=p},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(6),r=t(7),u=t(3),a=function(){function n(){}return Object.defineProperty(n,"matching",{get:function(){return this._matching||(this._matching=new r.Matching),this._matching},set:function(n){this._matching=n},enumerable:!0,configurable:!0}),n.check=function(n,e){void 0===e&&(e=[]);var t=(new Date).getTime();e=e.map(function(n){return n.toLowerCase()}),this.matching.setUserInputDictionary(e);var l=this.matching.omnimatch(n),r=u.Scoring.mostGuessableMatchSequence(n,l);return r.feedback="none",r.calc_time=(new Date).getTime()-t,r},n}();a.config=l.Config,e.Zxcvbn=a},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(1),r=function(){function n(n){this.rankedDictionaries=n}return n.prototype.match=function(n){var e=new Array,t=n.toLowerCase(),r=new Array;for(var u in this.rankedDictionaries)for(var a=this.rankedDictionaries[u],i=0;i<n.length;i++)for(var o=i;o<n.length;o++){var c=t.slice(i,o+1);if(c in a&&!(c in r)){var s=a[c];e.push({pattern:"dictionary",i:i,j:o,token:n.slice(i,o+1),matchedWord:c,rank:s,dictionaryName:u,reversed:!1,l33t:!1})}}return l.Helpers.sortMatches(e)},n}();e.DictionaryMatcher=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Config={frequencyList:"frequency_list.json"}},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(2),r=t(1),u=t(4),a=t(8),i=t(5),o=t(12),c=t(9),s=t(10),f=t(11),p=t(13),h=t(14),E=function(){function n(n){void 0===n&&(n=l.FREQUENCY_LIST),this.RankedDictionaries={},void 0===n&&console.log("ToDo: magically load frequency_list.json at:",u.Zxcvbn.config.frequencyList);for(var e in n){var t=n[e].split(",");this.RankedDictionaries[e]=this.buildRankedDictionary(t)}var r=new i.DictionaryMatcher(this.RankedDictionaries);this.Matchers=[new a.DateMatcher,r,new o.ReverseDictionaryMatcher(this.RankedDictionaries),new c.L33tMatcher(this.RankedDictionaries,r),new s.RegexMatcher,new f.RepeatMatcher(this),new p.SequenceMatcher,new h.SpatialMatcher]}return n.prototype.buildRankedDictionary=function(n){var e={};return n.forEach(function(n,t){e[n]=t+1}),e},n.prototype.setUserInputDictionary=function(n){return this.RankedDictionaries.user_inputs=this.buildRankedDictionary(n.slice())},n.prototype.omnimatch=function(n){var e=this.Matchers.map(function(e){return e.match(n)}).reduce(function(n,e){return n.concat(e)});return r.Helpers.sortMatches(e)},n}();e.Matching=E},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(2),u=t(1),a=function(){function n(){}return n.prototype.mapIntsToDMY=function(n){var e=this;if(!(n[1]>31||n[1]<=0)){var t=0,r=0,u=0;if(!n.some(function(n){return n>l.DATE_MAX_YEAR||n>=99&&n<l.DATE_MIN_YEAR||(n>31&&r++,n>12&&t++,n<=0&&u++,2==r||3==t||2==u||void 0)})){var a=[n[0],n[2]],i=[n.slice(1,3),n.slice(0,2)],o=a.map(function(n,e){return{valid:n<=l.DATE_MAX_YEAR&&n>=l.DATE_MIN_YEAR,index:e}}).filter(function(n){return n.valid}).map(function(n){return n.index});if(o.length>0){var c=o[0],s=a[c],f=this.mapIntsToDM(i[c]);return f?{year:s,month:f.month,day:f.day}:void 0}var p=i.map(function(n,t){return{dm:e.mapIntsToDM(n),year:a[t]}}).filter(function(n){return n.dm}).map(function(n){var t=n.dm,l=t.month,r=t.day;return{year:e.twoToFourDigitYear(n.year),month:l,day:r}});return p.length>0?p[0]:void 0}}},n.prototype.twoToFourDigitYear=function(n){return n>99?n:n>50?n+1900:n+2e3},n.prototype.mapIntsToDM=function(n){var e=n[0],t=n[1];return e>=1&&e<=31&&t>=1&&t<=12?{day:e,month:t}:(e=n[1],t=n[0],e>=1&&e<=31&&t>=1&&t<=12?{day:e,month:t}:void 0)},n.prototype.match=function(n){for(var e=this,t=new Array,a=0;a<=n.length-4;a++)for(var i=a+3;i<=a+7&&i<n.length;i++)!function(u){var i=n.slice(a,u+1);if(!l.REGEX_DATE_NO_SEPARATOR.test(i))return"continue";var o=new Array;if(r.DATE_SPLITS[i.length].forEach(function(n){var t=n[0],l=n[1],r=e.mapIntsToDMY([parseInt(i.slice(0,t)),parseInt(i.slice(t,l)),parseInt(i.slice(l))]);r&&o.push(r)}),0===o.length)return"continue";var c=function(n){return Math.abs(n.year-l.REFERENCE_YEAR)},s=o[0],f=c(s);o.forEach(function(n){var e=c(n);e<f&&(s=n,f=e)}),t.push({pattern:"date",token:i,i:a,j:u,separator:"",year:s.year,month:s.month,day:s.day})}(i);for(var a=0;a<=n.length-6;a++)for(var i=a+5;i<=a+9&&i<n.length;i++){var o=n.slice(a,i+1),c=l.REGEX_DATE_WITH_SEPARATOR.exec(o);if(c){var s=this.mapIntsToDMY([parseInt(c[1]),parseInt(c[3]),parseInt(c[4])]);s&&t.push({pattern:"date",token:o,i:a,j:i,separator:c[2],year:s.year,month:s.month,day:s.day})}}return u.Helpers.sortMatches(t.filter(function(n){return!t.some(function(e){if(n!==e)return e.i<=n.i&&e.j>=n.j})}))},n}();e.DateMatcher=a},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(1),r=t(2),u=function(){function n(n,e){this.rankedDictionaries=n,this.dictionaryMatcher=e}return n.prototype.relevantL33tSubtable=function(n){var e=n.split("").reduce(function(n,e){return n[e]=!0,n},{}),t={};for(var l in r.L33T_TABLE){var u=r.L33T_TABLE[l],a=u.filter(function(n){return n in e});a.length>0&&(t[l]=a)}return t},n.prototype.deduplicate=function(n){var e=[],t={};return n.forEach(function(n){var l=n.map(function(n,e){return[n,e]});l.sort();var r=l.map(function(n,e){return n+","+e}).join(",");r in t||(t[r]=!0,e.push(n))}),e},n.prototype.enumerateL33tSubsHelper=function(n,e){if(!n.length)return e;var t=n.shift(),l=new Array;return r.L33T_TABLE[t].forEach(function(n){e.forEach(function(e){var r=-1;if(e.some(function(e,t){return e[0]===n&&(r=t,!0)}),-1===r){var u=e.concat([[n,t]]);l.push(u)}else{var a=e.slice(0);a.splice(r,1),a.push(n,t),l.push(e),l.push(a)}})}),l=this.deduplicate(l),this.enumerateL33tSubsHelper(n,l)},n.prototype.enumerateL33tSubs=function(n){var e=function(){var e=new Array;for(var t in n)e.push(t);return e}();return this.enumerateL33tSubsHelper(e,[[]]).map(function(n){return n.reduce(function(n,e){return n[e[0]]=e[1],n},{})})},n.prototype.match=function(n){var e=this,t=new Array,r=this.relevantL33tSubtable(n),u=this.enumerateL33tSubs(r),a={};return u.forEach(function(l){var r=!1;for(var u in l){r=!0;break}if(r){var i=n.split("").map(function(n){return l[n]||n}).join("");e.dictionaryMatcher.match(i).forEach(function(e){var r=n.slice(e.i,e.j+1);if(!(r.length<=1)){var u=r.toLowerCase();if(u!==e.matchedWord&&!a[u]){a[u]=!0;var i={};for(var o in l){var c=l[o];-1!==r.indexOf(o)&&(i[o]=c)}var s=function(){var n=new Array;for(var e in i)n.push(e+" -> "+i[e]);return n}().join(", ");t.push({pattern:e.pattern,i:e.i,j:e.j,matchedWord:e.matchedWord,rank:e.rank,dictionaryName:e.dictionaryName,reversed:e.reversed,token:r,l33t:!0,sub:i,subDisplay:s})}}})}}),l.Helpers.sortMatches(t)},n}();e.L33tMatcher=u},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(1),u={recentYear:l.REGEX_RECENT_YEAR},a=function(){function n(){}return n.prototype.match=function(n){var e=new Array;for(var t in u){var l=u[t];l.lastIndex=0;for(var a=void 0;a=l.exec(n);){var i=a[0];e.push({pattern:"regex",token:i,i:a.index,j:a.index+i.length-1,regexName:t,regexpMatch:a})}}return r.Helpers.sortMatches(e)},n}();e.RegexMatcher=a},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(3),r=function(){function n(n){this.matching=n}return n.prototype.match=function(n){for(var e,t,r=new Array,u=/(.+)\1+/g,a=/(.+?)\1+/g,i=/^(.+?)\1+$/,o=0;o<n.length;){u.lastIndex=o,a.lastIndex=o;var c=u.exec(n);if(!c)break;var s=a.exec(n);c[0].length>s[0].length?(e=c,t=i.exec(e[0])[1]):(e=s,t=e[1]);var f={i:e.index,j:e.index+e[0].length-1},p=f.i,h=f.j,E=l.Scoring.mostGuessableMatchSequence(t,this.matching.omnimatch(t));r.push({pattern:"repeat",i:p,j:h,token:e[0],baseToken:t,baseGuesses:E.guesses,baseMatches:E.sequence,repeatCount:e[0].length/t.length}),o=h+1}return r},n}();e.RepeatMatcher=r},function(n,e,t){"use strict";var l=this&&this.__extends||function(){var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,e){n.__proto__=e}||function(n,e){for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t])};return function(e,t){function l(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(l.prototype=t.prototype,new l)}}();Object.defineProperty(e,"__esModule",{value:!0});var r=t(5),u=t(1),a=function(n){function e(e){return n.call(this,e)||this}return l(e,n),e.prototype.match=function(e){var t,l=e.split("").reverse().join(""),r=n.prototype.match.call(this,l);return r.forEach(function(n){t={i:e.length-1-n.j,j:e.length-1-n.i},n.i=t.i,n.j=t.j,n.token=n.token.split("").reverse().join(""),n.reversed=!0}),u.Helpers.sortMatches(r)},e}(r.DictionaryMatcher);e.ReverseDictionaryMatcher=a},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=function(){function n(){}return n.prototype.update=function(n,e,t,r,u){var a=Math.abs(u);if((r-t>1||1===a)&&!(a<0||a>l.MAX_DELTA)){var i,o,c=e.slice(t,r+1);l.REGEX_SEQUENCE_LOWER.test(c)?(i="lower",o=26):l.REGEX_SEQUENCE_UPPER.test(c)?(i="upper",o=26):l.REGEX_SEQUENCE_DIGIT.test(c)?(i="digits",o=10):(i="unicode",o=26),n.push({pattern:"sequence",i:t,j:r,token:c,sequenceName:i,sequenceSpace:o,ascending:u>0})}},n.prototype.match=function(n){var e=new Array;if(n.length<=1)return e;for(var t,l=0,r=0,u=1;u<n.length;u++){var a=n.charCodeAt(u)-n.charCodeAt(u-1);t||(t=a),t!==a&&(r=u-1,this.update(e,n,l,r,t),l=r,t=a)}return this.update(e,n,l,n.length-1,t),e},n}();e.SequenceMatcher=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(2),u=t(1),a=function(){function n(){}return n.prototype.matchHelper=function(n,e,t){for(var r=new Array,u=0;u<n.length-1;)!function(){var a,i=u+1,o=0,c=0;"qwerty"!==e&&"dvorak"!==e||!l.REGEX_SHIFTED.test(n.charAt(u))||(c=1);for(var s=!0;s;)!function(){s=!1;var l=n.charAt(i-1),f=t[l]||[],p=-1,h=-1;if(i<n.length){var E=n.charAt(i);s=f.some(function(n){return h++,!(!n||-1===n.indexOf(E))&&(p=h,1===n.indexOf(E)&&c++,a!==p&&(o++,a=p),!0)})}s?i++:(i-u>2&&r.push({pattern:"spatial",i:u,j:i-1,token:n.slice(u,i),graph:e,turns:o,shiftedCount:c}),u=i)}()}();return r},n.prototype.match=function(n){var e=new Array;for(var t in r.ADJACENCY_GRAPHS){var l=r.ADJACENCY_GRAPHS[t];this.matchHelper(n,t,l).forEach(function(n){return e.push(n)})}return u.Helpers.sortMatches(e)},n}();e.SpatialMatcher=a},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=function(){function n(){}return n.prototype.estimate=function(n){var e=Math.pow(l.BRUTEFORCE_CARDINALITY,n.token.length);e===Number.POSITIVE_INFINITY&&(e=Number.MAX_VALUE);var t=(1==n.token.length?l.MIN_SUBMATCH_GUESSES_SINGLE_CHAR:l.MIN_SUBMATCH_GUESSES_MULTI_CHAR)+1;return Math.max(e,t)},n}();e.BruteforceCalculator=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=function(){function n(){}return n.prototype.estimate=function(n){var e=Math.max(Math.abs(n.year-l.REFERENCE_YEAR),l.MIN_YEAR_SPACE),t=365*e;return n.separator&&(t*=4),t},n}();e.DateCalculator=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(1),u=function(){function n(){}return n.prototype.countUppercaseVariations=function(n){var e=n.token;if(l.REGEX_ALL_LOWER.test(e)||e.toLowerCase()===e)return 1;if([l.REGEX_START_UPPER,l.REGEX_END_UPPER,l.REGEX_ALL_UPPER].some(function(n){return n.test(e)}))return 2;for(var t=e.split("").filter(function(n){return/[A-Z]/.test(n)}).length,u=e.split("").filter(function(n){return/[a-z]/.test(n)}).length,a=0,i=1;i<=t&&i<=u;i++)a+=r.Helpers.nCk(t+u,i);return a},n.prototype.countL33tVariations=function(n){var e=1;if(!n.l33t)return e;for(var t in n.sub)!function(t){var l=n.sub[t],u=n.token.toLowerCase().split(""),a=u.filter(function(n){return n===t}).length,i=u.filter(function(n){return n===l}).length;if(0===a||0===i)e*=2;else{for(var o=0,c=1;c<=i&&c<=a;c++)o+=r.Helpers.nCk(i+a,c);e*=o}}(t);return e},n.prototype.estimate=function(n){n.baseGuesses=n.rank,n.uppercaseVariations=this.countUppercaseVariations(n),n.l33tVariations=this.countL33tVariations(n);var e=n.reversed?2:1;return n.baseGuesses*n.uppercaseVariations*n.l33tVariations*e},n}();e.DictionaryCalculator=u},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=function(){function n(){}return n.prototype.estimate=function(n){switch(n.regexName){case"recentYear":var e=Math.abs(parseInt(n.regexpMatch[0])-l.REFERENCE_YEAR);return e=Math.max(e,l.MIN_YEAR_SPACE)}},n}();e.RegexCalculator=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function n(){}return n.prototype.estimate=function(n){return n.baseGuesses*n.repeatCount},n}();e.RepeatCalculator=l},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=function(){function n(){}return n.prototype.estimate=function(n){var e=n.token.charAt(0),t=0;return t=l.REGEX_START.test(e)?4:l.REGEX_DIGIT.test(e)?10:26,n.ascending||(t*=2),t*n.token.length},n}();e.SequenceCalculator=r},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t(0),r=t(1),u=function(){function n(){}return n.prototype.estimate=function(n){var e,t;"qwerty"===n.graph||"dvorak"===n.graph?(e=l.KEYBOARD_STARTING_POSITIONS,t=l.KEYBOARD_AVERAGE_DEGREE):(e=l.KEYPAD_STARTING_POSITIONS,t=l.KEYPAD_AVERAGE_DEGREE);for(var u=0,a=n.token.length,i=n.turns,o=2;o<=a;o++)for(var c=Math.min(i,o-1),s=1;s<=c;s++)u+=r.Helpers.nCk(o-1,s-1)*e*Math.pow(t,s);if(n.shiftedCount){var f=n.shiftedCount,p=n.token.length-f;if(0===f||0===p)u*=2;else{for(var h=0,o=1;o<=f&&o<=p;o++)h+=r.Helpers.nCk(f+p,o);u*=h}}return u},n}();e.SpatialCalculator=u}])});