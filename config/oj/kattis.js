const SUPPORTED_LANGS = [
  "c",
  "cpp",
  "cpp11",
  "cpp14",
  "cpp17",
  "java",
  "python2.7",
  ",python3",
  "go",
  "haskell",
];

module.exports = {
  name: "Kattis",
  submitLang: {
    c: "C",
    cpp: "C++",
    cpp11: "C++",
    cpp14: "C++",
    cpp17: "C++",
    java: "Java",
    "python2.7": "Python 2",
    python3: "Python 3",
    go: "Go",
    haskell: "Haskell",
  },
  verdictId: {
    New: -1,
    Running: -3,
    Compiling: -4,
    "Judge Error": 11,
    "Output Limit Exceeded": 7,
    "Memory Limit Exceeded": 6,
    "Run Time Error": 5,
    "Compile Error": 4,
    "Time Limit Exceeded": 3,
    "Wrong Answer": 2,
    Accepted: 1,
  },
  url: "https://open.kattis.com",
  getProblemPath: (id) => {
    return `/problems/${id}`;
  },
  getSupportedLangs: () => SUPPORTED_LANGS,
};
