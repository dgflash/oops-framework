"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var toString = Object.prototype.toString;
var escapeHtmlRegex = /["&<>]/;
var _ = {
  each: function each(obj, cb) {
    if (obj) {
      if (Array.isArray(obj)) {
        obj.forEach(cb);
      } else {
        Object.keys(obj).forEach(function (key) {
          cb(obj[key], key);
        });
      }
    }
  },
  some: function some(obj, cb) {
    if (obj) {
      if (Array.isArray(obj)) {
        return obj.some(cb);
      }

      return Object.keys(obj).some(function (key) {
        return cb(obj[key], key);
      });
    }

    return false;
  },
  every: function every(obj, cb) {
    if (obj) {
      if (Array.isArray(obj)) {
        return obj.every(cb);
      }

      return Object.keys(obj).every(function (key) {
        return cb(obj[key], key);
      });
    }

    return true;
  },
  map: function map(obj, cb) {
    if (obj) {
      if (Array.isArray(obj)) {
        return obj.map(cb);
      }

      return Object.keys(obj).map(function (key) {
        return cb(obj[key], key);
      });
    }

    return [];
  },
  keyBy: function keyBy(a, p) {
    return a.reduce(function (o, v) {
      o[v[p]] = v;
      return o;
    }, {});
  },
  isEqual: function isEqual(a, b) {
    var aType = _typeof(a);

    var bType = _typeof(b);

    var aArray = Array.isArray(a);
    var bArray = Array.isArray(b);

    if (aType !== bType) {
      return false;
    }

    switch (_typeof(a)) {
      case 'object':
        if (aArray || bArray) {
          if (aArray && bArray) {
            return a.length === b.length && a.every(function (aValue, index) {
              var bValue = b[index];
              return _.isEqual(aValue, bValue);
            });
          }

          return false;
        }

        return _.every(a, function (aValue, key) {
          var bValue = b[key];
          return _.isEqual(aValue, bValue);
        });

      default:
        return a === b;
    }
  },
  escapeHtml: function escapeHtml(html) {
    var regexResult = escapeHtmlRegex.exec(html);
    if (!regexResult) return html;
    var result = '';
    var escape = '';
    var lastIndex = 0;
    var i = regexResult.index;

    for (; i < html.length; i++) {
      switch (html.charAt(i)) {
        case '"':
          escape = '&quot;';
          break;

        case '&':
          escape = '&amp;';
          break;

        case '\'':
          escape = '&apos;';
          break;

        case '<':
          escape = '&lt;';
          break;

        case '>':
          escape = '&gt;';
          break;

        default:
          continue;
      }

      if (lastIndex !== i) result += html.substring(lastIndex, i);
      lastIndex = i + 1;
      result += escape;
    }

    if (lastIndex !== i) return result + html.substring(lastIndex, i);
    return result;
  },
  strcmp: function strcmp(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  },
  isUndefined: function isUndefined(val) {
    return toString.call(val) === '[object Undefined]';
  },
  isObject: function isObject(val) {
    return toString.call(val) === '[object Object]';
  },
  deepMerge: function deepMerge() {
    var target = arguments[0] || {};
    var length = arguments.length; // eslint-disable-next-line one-var

    var src, clone, copyIsArray;

    function assignValue(val, key) {
      src = target[key];
      copyIsArray = Array.isArray(val);

      if (_.isObject(val) || copyIsArray) {
        if (copyIsArray) {
          copyIsArray = false;
          clone = src && Array.isArray(src) ? src : [];
        } else {
          clone = src && _.isObject(src) ? src : {};
        }

        target[key] = _.deepMerge(clone, val);
      } else if (!_.isUndefined(val)) {
        target[key] = val;
      }
    }

    for (var i = 0; i < length; i++) {
      _.each(arguments[i], assignValue);
    }

    return target;
  }
};
module.exports = _;
//# sourceMappingURL=under-dash.js.map
