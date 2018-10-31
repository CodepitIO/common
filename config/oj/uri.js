const SUPPORTED_LANGS = ['c', 'cpp', 'cpp11', 'java', 'python2.7', 'python3'];

module.exports = {
  name: 'URI',
  submitLang: {
    'c'         : '1',
    'cpp'       : '2',
    'cpp11'     : '2',
    'java'      : '3',
    'python2.7' : '4',
    'python3'   : '5',
  },
  verdictId: {
    9 : 11,
    0 : -1,
    2 : 4,
    3 : 5,
    4: 3,
    6 : 2,
    5 : 8,
    1 : 1,
  },
  url: 'https://www.urionlinejudge.com.br',
  getProblemPath: (id) => {
    return '/repository/UOJ_' + id + '.html';
  },
  getSupportedLangs: () => SUPPORTED_LANGS,
  intervalPerAdapter: 6000,
  submissionTTL: 60 * 60 * 1000,
};
