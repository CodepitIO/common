const _ = require('lodash');

const SUPPORTED_LANGS = ['c', 'cpp', 'cpp11', 'java', 'python2.7', 'python3'];
const TRACKED_GROUPS = [ 'kZPk3ZTzR5' ];

module.exports = {
  name: 'Codeforces Gym',
  submitLang: {
    'c'         : '10',
    'cpp'       : '1',
    'cpp11'     : '42',
    'cpp14'     : '50',
    'java'      : '36',
    'python2.7' : '7',
    'python3'   : '31',
  },
  verdictId: {
    'IN_QUEUE': -1,
    'FAILED' : 2,
    'OK' : 1,
    'PARTIAL' : 2,
    'COMPILATION_ERROR' : 4,
    'RUNTIME_ERROR' : 5,
    'WRONG_ANSWER' : 2,
    'PRESENTATION_ERROR' : 8,
    'TIME_LIMIT_EXCEEDED' : 3,
    'MEMORY_LIMIT_EXCEEDED' : 6,
    'IDLENESS_LIMIT_EXCEEDED' : 3,
    'SECURITY_VIOLATED' : 10,
    'CRASHED' : 5,
    'INPUT_PREPARATION_CRASHED' : 11,
    'CHALLENGED' : 2,
    'SKIPPED' : 11,
    'TESTING' : -3,
    'REJECTED' : 11,
  },
  url: 'http://codeforces.com',
  getProblemPath: (id) => {
    let split = _.split(id, '/');
    return `/group/${split[0]}/contest/${split[1]}/problem/${split[2]}`;
  },
  getSupportedLangs: () => SUPPORTED_LANGS,
  getTrackedGroups: () => TRACKED_GROUPS,
  submissionTTL: 60 * 60 * 1000,
};
