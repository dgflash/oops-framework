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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('../../../utils/under-dash');

var utils = require('../../../utils/utils');

var colCache = require('../../../utils/col-cache');

var BaseXform = require('../base-xform');

var Range = require('../../../doc/range');

function assign(definedName, attributes, name, defaultValue) {
  var value = attributes[name];

  if (value !== undefined) {
    definedName[name] = value;
  } else if (defaultValue !== undefined) {
    definedName[name] = defaultValue;
  }
}

function parseBool(value) {
  switch (value) {
    case '1':
    case 'true':
      return true;

    default:
      return false;
  }
}

function assignBool(definedName, attributes, name, defaultValue) {
  var value = attributes[name];

  if (value !== undefined) {
    definedName[name] = parseBool(value);
  } else if (defaultValue !== undefined) {
    definedName[name] = defaultValue;
  }
}

function optimiseDataValidations(model) {
  // Squeeze alike data validations together into rectangular ranges
  // to reduce file size and speed up Excel load time
  var dvList = _.map(model, function (dataValidation, address) {
    return {
      address: address,
      dataValidation: dataValidation,
      marked: false
    };
  }).sort(function (a, b) {
    return _.strcmp(a.address, b.address);
  });

  var dvMap = _.keyBy(dvList, 'address');

  var matchCol = function matchCol(addr, height, col) {
    for (var i = 0; i < height; i++) {
      var otherAddress = colCache.encodeAddress(addr.row + i, col);

      if (!model[otherAddress] || !_.isEqual(model[addr.address], model[otherAddress])) {
        return false;
      }
    }

    return true;
  };

  return dvList.map(function (dv) {
    if (!dv.marked) {
      var addr = colCache.decodeEx(dv.address);

      if (addr.dimensions) {
        dvMap[addr.dimensions].marked = true;
        return _objectSpread(_objectSpread({}, dv.dataValidation), {}, {
          sqref: dv.address
        });
      } // iterate downwards - finding matching cells


      var height = 1;
      var otherAddress = colCache.encodeAddress(addr.row + height, addr.col);

      while (model[otherAddress] && _.isEqual(dv.dataValidation, model[otherAddress])) {
        height++;
        otherAddress = colCache.encodeAddress(addr.row + height, addr.col);
      } // iterate rightwards...


      var width = 1;

      while (matchCol(addr, height, addr.col + width)) {
        width++;
      } // mark all included addresses


      for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
          otherAddress = colCache.encodeAddress(addr.row + i, addr.col + j);
          dvMap[otherAddress].marked = true;
        }
      }

      if (height > 1 || width > 1) {
        var bottom = addr.row + (height - 1);
        var right = addr.col + (width - 1);
        return _objectSpread(_objectSpread({}, dv.dataValidation), {}, {
          sqref: "".concat(dv.address, ":").concat(colCache.encodeAddress(bottom, right))
        });
      }

      return _objectSpread(_objectSpread({}, dv.dataValidation), {}, {
        sqref: dv.address
      });
    }

    return null;
  }).filter(Boolean);
}

var DataValidationsXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(DataValidationsXform, _BaseXform);

  var _super = _createSuper(DataValidationsXform);

  function DataValidationsXform() {
    _classCallCheck(this, DataValidationsXform);

    return _super.apply(this, arguments);
  }

  _createClass(DataValidationsXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var optimizedModel = optimiseDataValidations(model);

      if (optimizedModel.length) {
        xmlStream.openNode('dataValidations', {
          count: optimizedModel.length
        });
        optimizedModel.forEach(function (value) {
          xmlStream.openNode('dataValidation');

          if (value.type !== 'any') {
            xmlStream.addAttribute('type', value.type);

            if (value.operator && value.type !== 'list' && value.operator !== 'between') {
              xmlStream.addAttribute('operator', value.operator);
            }

            if (value.allowBlank) {
              xmlStream.addAttribute('allowBlank', '1');
            }
          }

          if (value.showInputMessage) {
            xmlStream.addAttribute('showInputMessage', '1');
          }

          if (value.promptTitle) {
            xmlStream.addAttribute('promptTitle', value.promptTitle);
          }

          if (value.prompt) {
            xmlStream.addAttribute('prompt', value.prompt);
          }

          if (value.showErrorMessage) {
            xmlStream.addAttribute('showErrorMessage', '1');
          }

          if (value.errorStyle) {
            xmlStream.addAttribute('errorStyle', value.errorStyle);
          }

          if (value.errorTitle) {
            xmlStream.addAttribute('errorTitle', value.errorTitle);
          }

          if (value.error) {
            xmlStream.addAttribute('error', value.error);
          }

          xmlStream.addAttribute('sqref', value.sqref);
          (value.formulae || []).forEach(function (formula, index) {
            xmlStream.openNode("formula".concat(index + 1));

            if (value.type === 'date') {
              xmlStream.writeText(utils.dateToExcel(new Date(formula)));
            } else {
              xmlStream.writeText(formula);
            }

            xmlStream.closeNode();
          });
          xmlStream.closeNode();
        });
        xmlStream.closeNode();
      }
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case 'dataValidations':
          this.model = {};
          return true;

        case 'dataValidation':
          {
            this._address = node.attributes.sqref;
            var dataValidation = {
              type: node.attributes.type || 'any',
              formulae: []
            };

            if (node.attributes.type) {
              assignBool(dataValidation, node.attributes, 'allowBlank');
            }

            assignBool(dataValidation, node.attributes, 'showInputMessage');
            assignBool(dataValidation, node.attributes, 'showErrorMessage');

            switch (dataValidation.type) {
              case 'any':
              case 'list':
              case 'custom':
                break;

              default:
                assign(dataValidation, node.attributes, 'operator', 'between');
                break;
            }

            assign(dataValidation, node.attributes, 'promptTitle');
            assign(dataValidation, node.attributes, 'prompt');
            assign(dataValidation, node.attributes, 'errorStyle');
            assign(dataValidation, node.attributes, 'errorTitle');
            assign(dataValidation, node.attributes, 'error');
            this._dataValidation = dataValidation;
            return true;
          }

        case 'formula1':
        case 'formula2':
          this._formula = [];
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      if (this._formula) {
        this._formula.push(text);
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      var _this = this;

      switch (name) {
        case 'dataValidations':
          return false;

        case 'dataValidation':
          {
            if (!this._dataValidation.formulae || !this._dataValidation.formulae.length) {
              delete this._dataValidation.formulae;
              delete this._dataValidation.operator;
            } // The four known cases: 1. E4:L9 N4:U9  2.E4 L9  3. N4:U9  4. E4


            var list = this._address.split(/\s+/g) || [];
            list.forEach(function (addr) {
              if (addr.includes(':')) {
                var range = new Range(addr);
                range.forEachAddress(function (address) {
                  _this.model[address] = _this._dataValidation;
                });
              } else {
                _this.model[addr] = _this._dataValidation;
              }
            });
            return true;
          }

        case 'formula1':
        case 'formula2':
          {
            var formula = this._formula.join('');

            switch (this._dataValidation.type) {
              case 'whole':
              case 'textLength':
                formula = parseInt(formula, 10);
                break;

              case 'decimal':
                formula = parseFloat(formula);
                break;

              case 'date':
                formula = utils.excelToDate(parseFloat(formula));
                break;

              default:
                break;
            }

            this._dataValidation.formulae.push(formula);

            this._formula = undefined;
            return true;
          }

        default:
          return true;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'dataValidations';
    }
  }]);

  return DataValidationsXform;
}(BaseXform);

module.exports = DataValidationsXform;
//# sourceMappingURL=data-validations-xform.js.map
