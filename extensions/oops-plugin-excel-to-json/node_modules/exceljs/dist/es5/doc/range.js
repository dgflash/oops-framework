"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var colCache = require('../utils/col-cache'); // used by worksheet to calculate sheet dimensions


var Range = /*#__PURE__*/function () {
  function Range() {
    _classCallCheck(this, Range);

    this.decode(arguments);
  }

  _createClass(Range, [{
    key: "setTLBR",
    value: function setTLBR(t, l, b, r, s) {
      if (arguments.length < 4) {
        // setTLBR(tl, br, s)
        var tl = colCache.decodeAddress(t);
        var br = colCache.decodeAddress(l);
        this.model = {
          top: Math.min(tl.row, br.row),
          left: Math.min(tl.col, br.col),
          bottom: Math.max(tl.row, br.row),
          right: Math.max(tl.col, br.col),
          sheetName: b
        };
        this.setTLBR(tl.row, tl.col, br.row, br.col, s);
      } else {
        // setTLBR(t, l, b, r, s)
        this.model = {
          top: Math.min(t, b),
          left: Math.min(l, r),
          bottom: Math.max(t, b),
          right: Math.max(l, r),
          sheetName: s
        };
      }
    }
  }, {
    key: "decode",
    value: function decode(argv) {
      switch (argv.length) {
        case 5:
          // [t,l,b,r,s]
          this.setTLBR(argv[0], argv[1], argv[2], argv[3], argv[4]);
          break;

        case 4:
          // [t,l,b,r]
          this.setTLBR(argv[0], argv[1], argv[2], argv[3]);
          break;

        case 3:
          // [tl,br,s]
          this.setTLBR(argv[0], argv[1], argv[2]);
          break;

        case 2:
          // [tl,br]
          this.setTLBR(argv[0], argv[1]);
          break;

        case 1:
          {
            var value = argv[0];

            if (value instanceof Range) {
              // copy constructor
              this.model = {
                top: value.model.top,
                left: value.model.left,
                bottom: value.model.bottom,
                right: value.model.right,
                sheetName: value.sheetName
              };
            } else if (value instanceof Array) {
              // an arguments array
              this.decode(value);
            } else if (value.top && value.left && value.bottom && value.right) {
              // a model
              this.model = {
                top: value.top,
                left: value.left,
                bottom: value.bottom,
                right: value.right,
                sheetName: value.sheetName
              };
            } else {
              // [sheetName!]tl:br
              var tlbr = colCache.decodeEx(value);

              if (tlbr.top) {
                this.model = {
                  top: tlbr.top,
                  left: tlbr.left,
                  bottom: tlbr.bottom,
                  right: tlbr.right,
                  sheetName: tlbr.sheetName
                };
              } else {
                this.model = {
                  top: tlbr.row,
                  left: tlbr.col,
                  bottom: tlbr.row,
                  right: tlbr.col,
                  sheetName: tlbr.sheetName
                };
              }
            }

            break;
          }

        case 0:
          this.model = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          };
          break;

        default:
          throw new Error("Invalid number of arguments to _getDimensions() - ".concat(argv.length));
      }
    }
  }, {
    key: "expand",
    value: function expand(top, left, bottom, right) {
      if (!this.model.top || top < this.top) this.top = top;
      if (!this.model.left || left < this.left) this.left = left;
      if (!this.model.bottom || bottom > this.bottom) this.bottom = bottom;
      if (!this.model.right || right > this.right) this.right = right;
    }
  }, {
    key: "expandRow",
    value: function expandRow(row) {
      if (row) {
        var dimensions = row.dimensions,
            number = row.number;

        if (dimensions) {
          this.expand(number, dimensions.min, number, dimensions.max);
        }
      }
    }
  }, {
    key: "expandToAddress",
    value: function expandToAddress(addressStr) {
      var address = colCache.decodeEx(addressStr);
      this.expand(address.row, address.col, address.row, address.col);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.range;
    }
  }, {
    key: "intersects",
    value: function intersects(other) {
      if (other.sheetName && this.sheetName && other.sheetName !== this.sheetName) return false;
      if (other.bottom < this.top) return false;
      if (other.top > this.bottom) return false;
      if (other.right < this.left) return false;
      if (other.left > this.right) return false;
      return true;
    }
  }, {
    key: "contains",
    value: function contains(addressStr) {
      var address = colCache.decodeEx(addressStr);
      return this.containsEx(address);
    }
  }, {
    key: "containsEx",
    value: function containsEx(address) {
      if (address.sheetName && this.sheetName && address.sheetName !== this.sheetName) return false;
      return address.row >= this.top && address.row <= this.bottom && address.col >= this.left && address.col <= this.right;
    }
  }, {
    key: "forEachAddress",
    value: function forEachAddress(cb) {
      for (var col = this.left; col <= this.right; col++) {
        for (var row = this.top; row <= this.bottom; row++) {
          cb(colCache.encodeAddress(row, col), row, col);
        }
      }
    }
  }, {
    key: "top",
    get: function get() {
      return this.model.top || 1;
    },
    set: function set(value) {
      this.model.top = value;
    }
  }, {
    key: "left",
    get: function get() {
      return this.model.left || 1;
    },
    set: function set(value) {
      this.model.left = value;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.model.bottom || 1;
    },
    set: function set(value) {
      this.model.bottom = value;
    }
  }, {
    key: "right",
    get: function get() {
      return this.model.right || 1;
    },
    set: function set(value) {
      this.model.right = value;
    }
  }, {
    key: "sheetName",
    get: function get() {
      return this.model.sheetName;
    },
    set: function set(value) {
      this.model.sheetName = value;
    }
  }, {
    key: "_serialisedSheetName",
    get: function get() {
      var sheetName = this.model.sheetName;

      if (sheetName) {
        if (/^[a-zA-Z0-9]*$/.test(sheetName)) {
          return "".concat(sheetName, "!");
        }

        return "'".concat(sheetName, "'!");
      }

      return '';
    }
  }, {
    key: "tl",
    get: function get() {
      return colCache.n2l(this.left) + this.top;
    }
  }, {
    key: "$t$l",
    get: function get() {
      return "$".concat(colCache.n2l(this.left), "$").concat(this.top);
    }
  }, {
    key: "br",
    get: function get() {
      return colCache.n2l(this.right) + this.bottom;
    }
  }, {
    key: "$b$r",
    get: function get() {
      return "$".concat(colCache.n2l(this.right), "$").concat(this.bottom);
    }
  }, {
    key: "range",
    get: function get() {
      return "".concat(this._serialisedSheetName + this.tl, ":").concat(this.br);
    }
  }, {
    key: "$range",
    get: function get() {
      return "".concat(this._serialisedSheetName + this.$t$l, ":").concat(this.$b$r);
    }
  }, {
    key: "shortRange",
    get: function get() {
      return this.count > 1 ? this.range : this._serialisedSheetName + this.tl;
    }
  }, {
    key: "$shortRange",
    get: function get() {
      return this.count > 1 ? this.$range : this._serialisedSheetName + this.$t$l;
    }
  }, {
    key: "count",
    get: function get() {
      return (1 + this.bottom - this.top) * (1 + this.right - this.left);
    }
  }]);

  return Range;
}();

module.exports = Range;
//# sourceMappingURL=range.js.map
