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

var BaseXform = require('./base-xform');
/* 'virtual' methods used as a form of documentation */

/* eslint-disable class-methods-use-this */
// base class for xforms that are composed of other xforms
// offers some default implementations


var CompositeXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(CompositeXform, _BaseXform);

  var _super = _createSuper(CompositeXform);

  function CompositeXform() {
    _classCallCheck(this, CompositeXform);

    return _super.apply(this, arguments);
  }

  _createClass(CompositeXform, [{
    key: "createNewModel",
    value: function createNewModel(node) {
      return {};
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      // Typical pattern for composite xform
      this.parser = this.parser || this.map[node.name];

      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      if (node.name === this.tag) {
        this.model = this.createNewModel(node);
        return true;
      }

      return false;
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      // Default implementation. Send text to child parser
      if (this.parser) {
        this.parser.parseText(text);
      }
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      // parseClose has seen a child parser close
      // now need to incorporate into this.model somehow
      this.model[name] = parser.model;
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      // Default implementation
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.onParserClose(name, this.parser);
          this.parser = undefined;
        }

        return true;
      }

      return name !== this.tag;
    }
  }]);

  return CompositeXform;
}(BaseXform);

module.exports = CompositeXform;
//# sourceMappingURL=composite-xform.js.map
