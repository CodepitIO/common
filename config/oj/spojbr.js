const _ = require("lodash");

const SUPPORTED_LANGS = {
  "C-CLANG": "c",
  C: "c",
  CPP: "cpp",
  "C++": "cpp",
  CPP14: ["cpp14", "cpp11", "cpp"],
  JAVA: "java",
  PYTHON: "python2.7",
  PYTHON3: "python3",
  GO: "go",
  HASKELL: "haskell",
};

function getContained(langString) {
  return _.chain(langString)
    .split(" ")
    .filter((o) => !!SUPPORTED_LANGS[o])
    .map((o) => SUPPORTED_LANGS[o])
    .flatten()
    .uniq()
    .value();
}

module.exports = {
  name: "SpojBR",
  submitLang: {
    c: "11",
    cpp: "1",
    cpp11: "44",
    cpp14: "44",
    java: "10",
    "python2.7": "4",
    python3: "116",
    go: "114",
    haskell: "21",
  },
  verdictId: {
    0: -1,
    1: -4,
    3: -3,
    5: -3,
    11: 4,
    12: 5,
    13: 3,
    14: 2,
    15: 1,
    20: 11,
  },
  url: "http://br.spoj.com",
  getProblemPath: (id) => {
    return "/problems/" + id;
  },
  getSupportedLangs: (langString) => {
    if (langString && !_.startsWith(langString, "Todas")) {
      return getContained(langString);
    }
    let accepted = _.chain(SUPPORTED_LANGS).values().flatten().uniq().value();
    return _.difference(accepted, langString);
  },
};
