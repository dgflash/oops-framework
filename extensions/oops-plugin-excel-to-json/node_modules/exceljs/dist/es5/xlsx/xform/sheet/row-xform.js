"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BaseXform = require('../base-xform');

var CellXform = require('./cell-xform');

var RowXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(RowXform, _BaseXform);

  var _super = _createSuper(RowXform);

  function RowXform(options) {
    var _this;

    _classCallCheck(this, RowXform);

    _this = _super.call(this);
    _this.maxItems = options && options.maxItems;
    _this.map = {
      c: new CellXform()
    };
    return _this;
  }

  _createClass(RowXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      var styleId = options.styles.addStyleModel(model.style);

      if (styleId) {
        model.styleId = styleId;
      }

      var cellXform = this.map.c;
      model.cells.forEach(function (cellModel) {
        cellXform.prepare(cellModel, options);
      });
    }
  }, {
    key: "render",
    value: function render(xmlStream, model, options) {
      xmlStream.openNode('row');
      xmlStream.addAttribute('r', model.number);

      if (model.height) {
        xmlStream.addAttribute('ht', model.height);
        xmlStream.addAttribute('customHeight', '1');
      }

      if (model.hidden) {
        xmlStream.addAttribute('hidden', '1');
      }

      if (model.min > 0 && model.max > 0 && model.min <= model.max) {
        xmlStream.addAttribute('spans', "".concat(model.min, ":").concat(model.max));
      }

      if (model.styleId) {
        xmlStream.addAttribute('s', model.styleId);
        xmlStream.addAttribute('customFormat', '1');
      }

      xmlStream.addAttribute('x14ac:dyDescent', '0.25');

      if (model.outlineLevel) {
        xmlStream.addAttribute('outlineLevel', model.outlineLevel);
      }

      if (model.collapsed) {
        xmlStream.addAttribute('collapsed', '1');
      }

      var cellXform = this.map.c;
      model.cells.forEach(function (cellModel) {
        cellXform.render(xmlStream, cellModel, options);
      });
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      if (node.name === 'row') {
        this.numRowsSeen += 1;
        var spans = node.attributes.spans ? node.attributes.spans.split(':').map(function (span) {
          return parseInt(span, 10);
        }) : [undefined, undefined];
        var model = this.model = {
          number: parseInt(node.attributes.r, 10),
          min: spans[0],
          max: spans[1],
          cells: []
        };

        if (node.attributes.s) {
          model.styleId = parseInt(node.attributes.s, 10);
        }

        if (node.attributes.hidden === true || node.attributes.hidden === 'true' || node.attributes.hidden === 1 || node.attributes.hidden === '1') {
          model.hidden = true;
        }

        if (node.attributes.bestFit) {
          model.bestFit = true;
        }

        if (node.attributes.ht) {
          model.height = parseFloat(node.attributes.ht);
        }

        if (node.attributes.outlineLevel) {
          model.outlineLevel = parseInt(node.attributes.outlineLevel, 10);
        }

        if (node.attributes.collapsed) {
          model.collapsed = true;
        }

        return true;
      }

      this.parser = this.map[node.name];

      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      return false;
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      if (this.parser) {
        this.parser.parseText(text);
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model.cells.push(this.parser.model);

          if (this.maxItems && this.model.cells.length > this.maxItems) {
            throw new Error("Max column count (".concat(this.maxItems, ") exceeded"));
          }

          this.parser = undefined;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      model.style = model.styleId ? options.styles.getStyleModel(model.styleId) : {};

      if (model.styleId !== undefined) {
        model.styleId = undefined;
      }

      var cellXform = this.map.c;
      model.cells.forEach(function (cellModel) {
        cellXform.reconcile(cellModel, options);
      });
    }
  }, {
    key: "tag",
    get: function get() {
      return 'row';
    }
  }]);

  return RowXform;
}(BaseXform);

module.exports = RowXform;
//# sourceMappingURL=row-xform.js.map
