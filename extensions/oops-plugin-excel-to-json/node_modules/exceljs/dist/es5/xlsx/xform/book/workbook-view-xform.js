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

var WorkbookViewXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(WorkbookViewXform, _BaseXform);

  var _super = _createSuper(WorkbookViewXform);

  function WorkbookViewXform() {
    _classCallCheck(this, WorkbookViewXform);

    return _super.apply(this, arguments);
  }

  _createClass(WorkbookViewXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var attributes = {
        xWindow: model.x || 0,
        yWindow: model.y || 0,
        windowWidth: model.width || 12000,
        windowHeight: model.height || 24000,
        firstSheet: model.firstSheet,
        activeTab: model.activeTab
      };

      if (model.visibility && model.visibility !== 'visible') {
        attributes.visibility = model.visibility;
      }

      xmlStream.leafNode('workbookView', attributes);
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (node.name === 'workbookView') {
        var model = this.model = {};

        var addS = function addS(name, value, dflt) {
          var s = value !== undefined ? model[name] = value : dflt;

          if (s !== undefined) {
            model[name] = s;
          }
        };

        var addN = function addN(name, value, dflt) {
          var n = value !== undefined ? model[name] = parseInt(value, 10) : dflt;

          if (n !== undefined) {
            model[name] = n;
          }
        };

        addN('x', node.attributes.xWindow, 0);
        addN('y', node.attributes.yWindow, 0);
        addN('width', node.attributes.windowWidth, 25000);
        addN('height', node.attributes.windowHeight, 10000);
        addS('visibility', node.attributes.visibility, 'visible');
        addN('activeTab', node.attributes.activeTab, undefined);
        addN('firstSheet', node.attributes.firstSheet, undefined);
        return true;
      }

      return false;
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose() {
      return false;
    }
  }]);

  return WorkbookViewXform;
}(BaseXform);

module.exports = WorkbookViewXform;
//# sourceMappingURL=workbook-view-xform.js.map
