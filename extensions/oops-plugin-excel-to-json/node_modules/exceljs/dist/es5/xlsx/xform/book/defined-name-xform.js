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

var colCache = require('../../../utils/col-cache');

var DefinedNamesXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(DefinedNamesXform, _BaseXform);

  var _super = _createSuper(DefinedNamesXform);

  function DefinedNamesXform() {
    _classCallCheck(this, DefinedNamesXform);

    return _super.apply(this, arguments);
  }

  _createClass(DefinedNamesXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      // <definedNames>
      //   <definedName name="name">name.ranges.join(',')</definedName>
      //   <definedName name="_xlnm.Print_Area" localSheetId="0">name.ranges.join(',')</definedName>
      // </definedNames>
      xmlStream.openNode('definedName', {
        name: model.name,
        localSheetId: model.localSheetId
      });
      xmlStream.writeText(model.ranges.join(','));
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case 'definedName':
          this._parsedName = node.attributes.name;
          this._parsedLocalSheetId = node.attributes.localSheetId;
          this._parsedText = [];
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      this._parsedText.push(text);
    }
  }, {
    key: "parseClose",
    value: function parseClose() {
      this.model = {
        name: this._parsedName,
        ranges: extractRanges(this._parsedText.join(''))
      };

      if (this._parsedLocalSheetId !== undefined) {
        this.model.localSheetId = parseInt(this._parsedLocalSheetId, 10);
      }

      return false;
    }
  }]);

  return DefinedNamesXform;
}(BaseXform);

function isValidRange(range) {
  try {
    colCache.decodeEx(range);
    return true;
  } catch (err) {
    return false;
  }
}

function extractRanges(parsedText) {
  var ranges = [];
  var quotesOpened = false;
  var last = '';
  parsedText.split(',').forEach(function (item) {
    if (!item) {
      return;
    }

    var quotes = (item.match(/'/g) || []).length;

    if (!quotes) {
      if (quotesOpened) {
        last += "".concat(item, ",");
      } else if (isValidRange(item)) {
        ranges.push(item);
      }

      return;
    }

    var quotesEven = quotes % 2 === 0;

    if (!quotesOpened && quotesEven && isValidRange(item)) {
      ranges.push(item);
    } else if (quotesOpened && !quotesEven) {
      quotesOpened = false;

      if (isValidRange(last + item)) {
        ranges.push(last + item);
      }

      last = '';
    } else {
      quotesOpened = true;
      last += "".concat(item, ",");
    }
  });
  return ranges;
}

module.exports = DefinedNamesXform;
//# sourceMappingURL=defined-name-xform.js.map
