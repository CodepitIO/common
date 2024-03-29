const _ = require("lodash");

const SUPPORTED_LANGS = {
  C: "c",
  CPP14: ["cpp14", "cpp11", "cpp"],
  CPP17: ["cpp17", "cpp14", "cpp11", "cpp"],
  JAVA: "java",
  PYTH: "python2.7",
  "PYTH 3.6": "python3",
  GO: "go",
  HASK: "haskell",
};

module.exports = {
  name: "CodeChef",
  submitLang: {
    c: "11",
    cpp: "44",
    cpp11: "44",
    cpp14: "44",
    cpp17: "63",
    java: "10",
    "python2.7": "4",
    python3: "116",
    go: "114",
    haskell: "21",
  },
  verdictId: {
    compiling: -4,
    running: -3,
    accepted: 1,
    wrong: 2,
    time: 3,
    compilation: 4,
    runtime: 5,
    internal: 11,
    "/misc/loader-icon.gif": -3,
    "/misc/tick-icon.gif": 1,
    "/misc/cross-icon.gif": 2,
    "/misc/clock_error.png": 3,
    "/misc/alert-icon.gif": 4,
    "/misc/runtime-error.png": 5,
  },
  url: "https://www.codechef.com",
  getProblemPath: (id) => {
    return `/problems/${id}`;
  },
  getSupportedLangs: (langString) => {
    let supported = _.chain(langString)
      .split(", ")
      .filter((o) => !!SUPPORTED_LANGS[o])
      .map((o) => SUPPORTED_LANGS[o])
      .flatten()
      .uniq()
      .value();
    return supported;
  },
};
