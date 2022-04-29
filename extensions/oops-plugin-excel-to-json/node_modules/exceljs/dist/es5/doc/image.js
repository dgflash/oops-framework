"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var colCache = require('../utils/col-cache');

var Anchor = require('./anchor');

var Image = /*#__PURE__*/function () {
  function Image(worksheet, model) {
    _classCallCheck(this, Image);

    this.worksheet = worksheet;
    this.model = model;
  }

  _createClass(Image, [{
    key: "model",
    get: function get() {
      switch (this.type) {
        case 'background':
          return {
            type: this.type,
            imageId: this.imageId
          };

        case 'image':
          return {
            type: this.type,
            imageId: this.imageId,
            hyperlinks: this.range.hyperlinks,
            range: {
              tl: this.range.tl.model,
              br: this.range.br && this.range.br.model,
              ext: this.range.ext,
              editAs: this.range.editAs
            }
          };

        default:
          throw new Error('Invalid Image Type');
      }
    },
    set: function set(_ref) {
      var type = _ref.type,
          imageId = _ref.imageId,
          range = _ref.range,
          hyperlinks = _ref.hyperlinks;
      this.type = type;
      this.imageId = imageId;

      if (type === 'image') {
        if (typeof range === 'string') {
          var decoded = colCache.decode(range);
          this.range = {
            tl: new Anchor(this.worksheet, {
              col: decoded.left,
              row: decoded.top
            }, -1),
            br: new Anchor(this.worksheet, {
              col: decoded.right,
              row: decoded.bottom
            }, 0),
            editAs: 'oneCell'
          };
        } else {
          this.range = {
            tl: new Anchor(this.worksheet, range.tl, 0),
            br: range.br && new Anchor(this.worksheet, range.br, 0),
            ext: range.ext,
            editAs: range.editAs,
            hyperlinks: hyperlinks || range.hyperlinks
          };
        }
      }
    }
  }]);

  return Image;
}();

module.exports = Image;
//# sourceMappingURL=image.js.map
