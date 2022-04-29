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

/* eslint-disable max-classes-per-file */
var CompositeXform = require('../composite-xform');

var ConditionalFormattingsExt = require('./cf-ext/conditional-formattings-ext-xform');

var ExtXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(ExtXform, _CompositeXform);

  var _super = _createSuper(ExtXform);

  function ExtXform() {
    var _this;

    _classCallCheck(this, ExtXform);

    _this = _super.call(this);
    _this.map = {
      'x14:conditionalFormattings': _this.conditionalFormattings = new ConditionalFormattingsExt()
    };
    return _this;
  }

  _createClass(ExtXform, [{
    key: "hasContent",
    value: function hasContent(model) {
      return this.conditionalFormattings.hasContent(model.conditionalFormattings);
    }
  }, {
    key: "prepare",
    value: function prepare(model, options) {
      this.conditionalFormattings.prepare(model.conditionalFormattings, options);
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('ext', {
        uri: '{78C0D931-6437-407d-A8EE-F0AAD7539E65}',
        'xmlns:x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main'
      });
      this.conditionalFormattings.render(xmlStream, model.conditionalFormattings);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {};
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      this.model[name] = parser.model;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'ext';
    }
  }]);

  return ExtXform;
}(CompositeXform);

var ExtLstXform = /*#__PURE__*/function (_CompositeXform2) {
  _inherits(ExtLstXform, _CompositeXform2);

  var _super2 = _createSuper(ExtLstXform);

  function ExtLstXform() {
    var _this2;

    _classCallCheck(this, ExtLstXform);

    _this2 = _super2.call(this);
    _this2.map = {
      ext: _this2.ext = new ExtXform()
    };
    return _this2;
  }

  _createClass(ExtLstXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      this.ext.prepare(model, options);
    }
  }, {
    key: "hasContent",
    value: function hasContent(model) {
      return this.ext.hasContent(model);
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      if (!this.hasContent(model)) {
        return;
      }

      xmlStream.openNode('extLst');
      this.ext.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {};
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      Object.assign(this.model, parser.model);
    }
  }, {
    key: "tag",
    get: function get() {
      return 'extLst';
    }
  }]);

  return ExtLstXform;
}(CompositeXform);

module.exports = ExtLstXform;
//# sourceMappingURL=ext-lst-xform.js.map
