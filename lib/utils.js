import _ from "lodash";

const http = require(`http`);
const qs = require(`querystring`);
const crypto = require(`crypto`);
const fs = require(`fs`);
const request = require(`request`);
const path = require(`path`);
const url = require(`url`);

const C = require(`../constants`);

const OJConfigs = {};

// Validate related functions
export const isValidId = (req, res, next) => {
  req.check(`id`).isMongoId();
  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      return next();
    }
    return res.sendStatus(400);
  });
};

function ValidatorCtor(fields) {
  _.each(fields, (fn, key) => {
    this[_.camelCase([`see`, key])] = function () {
      fn.apply(this.check(key), _.toArray(arguments));
      return this;
    };
  });
  this.ok = function () {
    return !this.validationErrors();
  };
  this.notOk = function () {
    return !!this.validationErrors();
  };
  this.asyncOk = function () {
    return this.asyncValidationErrors();
  };
}

export const validateChain = (fields) => {
  const chain = new ValidatorCtor(fields);
  return (req) => _.assign(chain, req);
};

export const getTime = (req, res) =>
  res.json({
    date: new Date(),
  });

export const cmpToString = (a, b) => _.toString(a) === _.toString(b);

export const cmpDiffStringFn = (rhs) => (lhs) =>
  _.toString(lhs) !== _.toString(rhs);

export const getScoreboardStatusName = (verdict) => {
  if (verdict <= 0) {
    return `PENDING`;
  }
  if (verdict === 1) {
    return `ACCEPTED`;
  }
  if (verdict < 11) {
    return `REJECTED`;
  }
  return `ERROR`;
};

export const getExtension = (lang) =>
  ({
    c: `.c`,
    java: `.java`,
    cpp: `.cpp`,
    pascal: `.pas`,
    cpp11: `.cpp`,
    python3: `.py`,
  }[lang]);

export const commentCode = function (code, lang) {
  if (lang === `python3`) {
    return `${code}\n# ${new Date().getTime()}\n`;
  }
  if (lang == `c`) {
    return `${code}\n/* ${new Date().getTime()} */\n`;
  }
  return `${code}\n// ${new Date().getTime()}\n`;
};

export const getURIFromS3Metadata = function (details) {
  const s3path = details.key.replace(/^assets\//, ``);
  return `${C.STATIC_ASSETS_DOMAIN}/${s3path}`;
};

export const getOJConfig = function (oj) {
  return require(`../config/oj/${oj}`);
};

export const getVerdict = function (oj, verdict) {
  const config = getOJConfig(oj);
  if (verdict == null) {
    return null;
  }
  if (config.verdictId[verdict]) {
    return config.verdictId[verdict];
  }
  if (verdict === ``) {
    return null;
  }
  verdict = _.toLower(verdict);
  return _.find(config.verdictId, (v, k) =>
    _.startsWith(verdict, _.toLower(k))
  );
};

export const adjustAnchors = function ($, uri) {
  $(`a`).each((i, elem) => {
    elem = $(elem);
    const link = elem.attr(`href`);
    if (!link) return;
    elem.attr(`href`, url.resolve(uri, link));
  });
};

/**
 * Removes surrounding quote chars (" or ') from a string.
 * Any whitespace surrounded by the quote chars are preserved but
 * whitespaces outside of the quote chars are removed. If no quote chars
 * are present the entire string is trimmed of whitespaces.
 * The string is processed adhering to the following rules:
 * - the starting and ending quote chars must be the same.
 * - if the starting or ending quote char is present, the other must also
 *    be present, that is, there must be no unmatched quote char.
 * <pre>
 * Examples:
 * String s = "  ' hello '  "; // unquote(s) returns "' hello '"
 * String s = "  'hello   ";   // unquote(s) will throw an exception
 * String s = " hello ";       // unquote(s) returns "hello"
 * </pre>
 * @param s
 * @exception if at least one
 * of the rules is violated.
 */
export const unquote = function (s) {
  s = s.trim();
  if (s.length >= 1) {
    const start = s.charAt(0);
    const end = s.length >= 2 ? s.charAt(s.length - 1) : 0;
    const isQuote =
      start === `"` || start === `'` || end === `"` || end === `'`;

    if (isQuote) {
      if (start === end) return s.substring(1, s.length - 1);

      throw { message: `mismatched quote chars` };
    }
  }

  return s;
};

/**
 * Parses an HTML fragment containing attribute pairs without the
 * tag name, in to a map.
 * This is a forgiving parser that does not adhere strictly to XML rules,
 * but well-formed XML are guaranteed to be parsed correctly.
 * @param html This must be in the format: attrib1="value" attrib2="value"
 * @return Map of attrib-value pairs. The names and values are NOT HTML
 * decoded.
 */
export const parseAttribs = function (html) {
  const ATTRIB_PATTERN =
    // group 1: attrib name (allowing namespace)
    // group 2: value including quote chars if any
    /([\w:]+)\s*=\s*("[^"]*"|'[^']*'|\S*)/gi;

  let match;
  const pairs = {};
  while ((match = ATTRIB_PATTERN.exec(html))) {
    pairs[match[1]] = unquote(match[2]);
  }
  return pairs;
};

export const getUserHomePath = function () {
  const p = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
  if (p) return p;
  throw { message: `Cannot determine user home dir` };
};

export const htmlDecodeSimple = function (s) {
  return s
    .replace(/&apos;/g, `'`)
    .replace(/&lt;/g, `<`)
    .replace(/&gt;/g, `>`)
    .replace(/&quot;/g, `"`)
    .replace(/&amp;/g, `&`);
};

/**
 * @param method GET or POST
 * @param host domain name
 * @param path Absolute path e.g. /index.html
 * @param callback response callback function
 */
export const createReq = function (method, host, path, callback) {
  // encodeURI leaves the path components alone
  path = encodeURI(path);

  const options = {
    hostname: host,
    path,
    method,

    // typical headers to disguise our identity
    headers: {
      Referer: `http://${host}${path}`,
      "Accept-Charset": `utf-8,ISO-8859-1`,

      // NOTE: chunked is implied if content-length is missing,
      // explicitly putting it will confuse node.js which will leave
      // the connection dangling
      // 'Transfer-Encoding': 'chunked',

      // no gzip :(
      // 'Accept-Encoding': 'gzip,deflate',

      "Accept-Language": `en-US,en;q=0.8`,
      "User-Agent":
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) ` +
        `AppleWebKit/537.17 (KHTML, like Gecko) ` +
        `Chrome/24.0.1312.57 Safari/537.17`,
      Accept: `text/html, application/xml, text/xml, */*`,
    },
  };

  return http.request(options, callback);
};

export const writePostData = function (httpReq, data) {
  const qstr = qs.stringify(data);
  httpReq.setHeader(
    `Content-Type`,
    `application/x-www-form-urlencoded; charset=UTF-8`
  );
  httpReq.end(qstr, `utf8`);
};

export const writeFormData = function (httpReq, data) {
  const boundBytes = crypto.pseudoRandomBytes(16);
  const boundStr = Buffer.from(boundBytes).toString(`hex`);

  httpReq.setHeader(
    `Content-Type`,
    `multipart/form-data; boundary=${boundStr}`
  );

  const bufCap = 1 << 16;
  const buf = new Buffer(bufCap);

  for (const key in data) {
    const val = data[key];
    httpReq.write(`--${boundStr}`, `ascii`);

    // file upload?
    if (typeof val === `object` && val.filePath) {
      httpReq.write(
        `\r\nContent-Disposition: form-data; name="${key}"; filename="${val.filePath}"\r\n` +
          `Content-Type: application/octet-stream\r\n` +
          `Content-Transfer-Encoding: binary\r\n\r\n`,
        `utf8`
      );

      const fd = fs.openSync(val.filePath, `r`);
      let bufSize = 0;

      while (true) {
        // read til buffer is full
        while (bufSize < bufCap) {
          const nread = fs.readSync(fd, buf, bufSize, bufCap - bufSize, null);
          if (nread == 0) break;
          bufSize += nread;
        }

        if (bufSize === bufCap) {
          bufSize = 0;
          httpReq.write(buf);
          continue;
        }

        httpReq.write(buf.slice(0, bufSize));
        break;
      }

      fs.closeSync(fd);
      httpReq.write(`\r\n`, `ascii`);
    } else {
      httpReq.write(
        `\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n`,
        `utf8`
      );
      httpReq.write(`${val}\r\n`, `utf8`);
    }
  }

  httpReq.end(`--${boundStr}--\r\n`, `ascii`);
};

/**
 * Gets a semi-colon-separated list of cookies from the Set-Cookie headers,
 * without the cookies' metadata such as expiry and path.
 * The cookie keys and values are not decoded.
 * @return null if the cookies are not found.
 */
export const getCookies = function (inMsg) {
  let cookies = inMsg.headers[`set-cookie`];
  if (typeof cookies === `string`) {
    cookies = [cookies];
  } else if (!cookies) return null;

  function get(line) {
    const tokens = line.split(`;`);

    // Cookie should be the first token
    if (tokens.length >= 1) {
      const pair = tokens[0].split(`=`);
      if (pair.length != 2) return null;

      const key = pair[0].trim();
      const value = pair[1].trim();

      return { key, value };
    }

    return null;
  }

  let z = ``;
  let sep = ``;
  for (let i = 0; i < cookies.length; i++) {
    const cookie = get(cookies[i]);
    if (!cookie) continue;
    z += `${sep + cookie.key}=${cookie.value}`;
    sep = `; `;
  }

  return z;
};

export const parseForm = function (formPat, html) {
  let match = formPat.exec(html);
  if (!match) return null;

  const attribs = match[1];
  const contents = match[2];
  let atts = parseAttribs(attribs);
  const r = { contents, data: {} };

  for (var key in atts) {
    if (key.toLowerCase() === `action`) {
      r.action = htmlDecodeSimple(atts[key]);
      break;
    }
  }

  const inputPattern = /<input([^>]+?)\/?>/gi;
  while ((match = inputPattern.exec(contents))) {
    atts = parseAttribs(match[1]);
    let value = null;
    let name = null;
    let isText = false;

    for (var key in atts) {
      const val = htmlDecodeSimple(atts[key]);
      const keyLower = key.toLowerCase();
      const valLower = val.toLowerCase();

      switch (keyLower) {
        case `type`:
          isText = valLower === `password` || valLower === `text`;
          break;
        case `name`:
          name = val;
          break;
        case `value`:
          value = val;
          break;
      }
    }

    if (name !== null && isText) {
      const nameLower = name.toLowerCase();
      if (nameLower.indexOf(`user`) >= 0) r.userField = name;
      else if (nameLower.indexOf(`pass`) >= 0) r.passField = name;
    } else if (value !== null && name !== null) {
      r.data[name] = value;
    }
  }

  return r;
};

function skipWhitespace(s, startIdx) {
  for (let i = startIdx; i < s.length; i++) {
    const cur = s.charAt(i);

    if (cur !== ` ` && cur !== `\t`) return i;
  }

  return -1;
}

export const parseArgs = function (s) {
  let startQuote = null;
  const args = [];
  let curToken = ``;

  let i = skipWhitespace(s, 0);
  if (i < 0) return args;

  for (; i < s.length; ) {
    const cur = s.charAt(i);

    // inside a quoted arg?
    if (startQuote) {
      if (cur === startQuote) {
        args.push(curToken.trim());
        curToken = ``;
        startQuote = null;
        i = skipWhitespace(s, i + 1);
        if (i < 0) return args;
      } else {
        curToken += cur;
        i++;
      }
    } else if (cur == `"` || cur == `'`) {
      curToken = curToken.trim();

      if (curToken !== ``) {
        args.push(curToken);
        curToken = ``;
      }

      startQuote = cur;
      i++;
    } else if (cur == ` ` || cur == `\t`) {
      args.push(curToken.trim());
      curToken = ``;
      i = skipWhitespace(s, i + 1);
      if (i < 0) return args;
    } else {
      curToken += cur;
      i++;
    }
  }

  if (startQuote) throw new Error(`unmatched quote`);

  if (curToken !== ``) args.push(curToken.trim());

  return args;
};
