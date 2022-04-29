"use strict";

var fs = require('fs'); // useful stuff


var inherits = function inherits(cls, superCtor, statics, prototype) {
  // eslint-disable-next-line no-underscore-dangle
  cls.super_ = superCtor;

  if (!prototype) {
    prototype = statics;
    statics = null;
  }

  if (statics) {
    Object.keys(statics).forEach(function (i) {
      Object.defineProperty(cls, i, Object.getOwnPropertyDescriptor(statics, i));
    });
  }

  var properties = {
    constructor: {
      value: cls,
      enumerable: false,
      writable: false,
      configurable: true
    }
  };

  if (prototype) {
    Object.keys(prototype).forEach(function (i) {
      properties[i] = Object.getOwnPropertyDescriptor(prototype, i);
    });
  }

  cls.prototype = Object.create(superCtor.prototype, properties);
}; // eslint-disable-next-line no-control-regex


var xmlDecodeRegex = /[<>&'"\x7F\x00-\x08\x0B-\x0C\x0E-\x1F]/;
var utils = {
  nop: function nop() {},
  promiseImmediate: function promiseImmediate(value) {
    return new Promise(function (resolve) {
      if (global.setImmediate) {
        setImmediate(function () {
          resolve(value);
        });
      } else {
        // poorman's setImmediate - must wait at least 1ms
        setTimeout(function () {
          resolve(value);
        }, 1);
      }
    });
  },
  inherits: inherits,
  dateToExcel: function dateToExcel(d, date1904) {
    return 25569 + d.getTime() / (24 * 3600 * 1000) - (date1904 ? 1462 : 0);
  },
  excelToDate: function excelToDate(v, date1904) {
    var millisecondSinceEpoch = Math.round((v - 25569 + (date1904 ? 1462 : 0)) * 24 * 3600 * 1000);
    return new Date(millisecondSinceEpoch);
  },
  parsePath: function parsePath(filepath) {
    var last = filepath.lastIndexOf('/');
    return {
      path: filepath.substring(0, last),
      name: filepath.substring(last + 1)
    };
  },
  getRelsPath: function getRelsPath(filepath) {
    var path = utils.parsePath(filepath);
    return "".concat(path.path, "/_rels/").concat(path.name, ".rels");
  },
  xmlEncode: function xmlEncode(text) {
    var regexResult = xmlDecodeRegex.exec(text);
    if (!regexResult) return text;
    var result = '';
    var escape = '';
    var lastIndex = 0;
    var i = regexResult.index;

    for (; i < text.length; i++) {
      var charCode = text.charCodeAt(i);

      switch (charCode) {
        case 34:
          // "
          escape = '&quot;';
          break;

        case 38:
          // &
          escape = '&amp;';
          break;

        case 39:
          // '
          escape = '&apos;';
          break;

        case 60:
          // <
          escape = '&lt;';
          break;

        case 62:
          // >
          escape = '&gt;';
          break;

        case 127:
          escape = '';
          break;

        default:
          {
            if (charCode <= 31 && (charCode <= 8 || charCode >= 11 && charCode !== 13)) {
              escape = '';
              break;
            }

            continue;
          }
      }

      if (lastIndex !== i) result += text.substring(lastIndex, i);
      lastIndex = i + 1;
      if (escape) result += escape;
    }

    if (lastIndex !== i) return result + text.substring(lastIndex, i);
    return result;
  },
  xmlDecode: function xmlDecode(text) {
    return text.replace(/&([a-z]*);/g, function (c) {
      switch (c) {
        case '&lt;':
          return '<';

        case '&gt;':
          return '>';

        case '&amp;':
          return '&';

        case '&apos;':
          return '\'';

        case '&quot;':
          return '"';

        default:
          return c;
      }
    });
  },
  validInt: function validInt(value) {
    var i = parseInt(value, 10);
    return !Number.isNaN(i) ? i : 0;
  },
  isDateFmt: function isDateFmt(fmt) {
    if (!fmt) {
      return false;
    } // must remove all chars inside quotes and []


    fmt = fmt.replace(/\[[^\]]*]/g, '');
    fmt = fmt.replace(/"[^"]*"/g, ''); // then check for date formatting chars

    var result = fmt.match(/[ymdhMsb]+/) !== null;
    return result;
  },
  fs: {
    exists: function exists(path) {
      return new Promise(function (resolve) {
        fs.access(path, fs.constants.F_OK, function (err) {
          resolve(!err);
        });
      });
    }
  },
  toIsoDateString: function toIsoDateString(dt) {
    return dt.toIsoString().subsstr(0, 10);
  }
};
module.exports = utils;
//# sourceMappingURL=utils.js.map
