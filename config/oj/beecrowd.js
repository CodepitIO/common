const SUPPORTED_LANGS = [
  "c",
  "cpp",
  "cpp11",
  "cpp14",
  "cpp17",
  "java",
  "python2.7",
  "python3",
  "go",
  "haskell",
];

module.exports = {
  name: "Beecrowd",
  submitLang: {
    c: "1",
    cpp: "2",
    cpp11: "16",
    cpp14: "16",
    cpp17: "16",
    java: "3",
    "python2.7": "4",
    python3: "35",
    go: "12",
    haskell: "17",
  },
  verdictId: {
    Closed: 11,
    "Thinking...": -3,
    "- In queue -": -1,
    "Compilation error": 4,
    "Runtime error": 5,
    "Possible runtime error": 5,
    "Time limit exceeded": 3,
    "Wrong answer": 2,
    "Presentation error": 8,
    Accepted: 1,
    "Submission error": 12,
  },
  url: "https://www.beecrowd.com.br",
  getProblemPath: (id) => {
    return "/repository/UOJ_" + id + ".html";
  },
  getSupportedLangs: () => SUPPORTED_LANGS,
  intervalPerAdapter: 6000,
  submissionTTL: 60 * 60 * 1000,
};
