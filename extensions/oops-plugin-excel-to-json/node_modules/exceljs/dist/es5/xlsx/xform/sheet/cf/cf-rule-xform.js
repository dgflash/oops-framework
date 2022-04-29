"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var BaseXform = require('../../base-xform');

var CompositeXform = require('../../composite-xform');

var Range = require('../../../../doc/range');

var DatabarXform = require('./databar-xform');

var ExtLstRefXform = require('./ext-lst-ref-xform');

var FormulaXform = require('./formula-xform');

var ColorScaleXform = require('./color-scale-xform');

var IconSetXform = require('./icon-set-xform');

var extIcons = {
  '3Triangles': true,
  '3Stars': true,
  '5Boxes': true
};

var getTextFormula = function getTextFormula(model) {
  if (model.formulae && model.formulae[0]) {
    return model.formulae[0];
  }

  var range = new Range(model.ref);
  var tl = range.tl;

  switch (model.operator) {
    case 'containsText':
      return "NOT(ISERROR(SEARCH(\"".concat(model.text, "\",").concat(tl, ")))");

    case 'containsBlanks':
      return "LEN(TRIM(".concat(tl, "))=0");

    case 'notContainsBlanks':
      return "LEN(TRIM(".concat(tl, "))>0");

    case 'containsErrors':
      return "ISERROR(".concat(tl, ")");

    case 'notContainsErrors':
      return "NOT(ISERROR(".concat(tl, "))");

    default:
      return undefined;
  }
};

var getTimePeriodFormula = function getTimePeriodFormula(model) {
  if (model.formulae && model.formulae[0]) {
    return model.formulae[0];
  }

  var range = new Range(model.ref);
  var tl = range.tl;

  switch (model.timePeriod) {
    case 'thisWeek':
      return "AND(TODAY()-ROUNDDOWN(".concat(tl, ",0)<=WEEKDAY(TODAY())-1,ROUNDDOWN(").concat(tl, ",0)-TODAY()<=7-WEEKDAY(TODAY()))");

    case 'lastWeek':
      return "AND(TODAY()-ROUNDDOWN(".concat(tl, ",0)>=(WEEKDAY(TODAY())),TODAY()-ROUNDDOWN(").concat(tl, ",0)<(WEEKDAY(TODAY())+7))");

    case 'nextWeek':
      return "AND(ROUNDDOWN(".concat(tl, ",0)-TODAY()>(7-WEEKDAY(TODAY())),ROUNDDOWN(").concat(tl, ",0)-TODAY()<(15-WEEKDAY(TODAY())))");

    case 'yesterday':
      return "FLOOR(".concat(tl, ",1)=TODAY()-1");

    case 'today':
      return "FLOOR(".concat(tl, ",1)=TODAY()");

    case 'tomorrow':
      return "FLOOR(".concat(tl, ",1)=TODAY()+1");

    case 'last7Days':
      return "AND(TODAY()-FLOOR(".concat(tl, ",1)<=6,FLOOR(").concat(tl, ",1)<=TODAY())");

    case 'lastMonth':
      return "AND(MONTH(".concat(tl, ")=MONTH(EDATE(TODAY(),0-1)),YEAR(").concat(tl, ")=YEAR(EDATE(TODAY(),0-1)))");

    case 'thisMonth':
      return "AND(MONTH(".concat(tl, ")=MONTH(TODAY()),YEAR(").concat(tl, ")=YEAR(TODAY()))");

    case 'nextMonth':
      return "AND(MONTH(".concat(tl, ")=MONTH(EDATE(TODAY(),0+1)),YEAR(").concat(tl, ")=YEAR(EDATE(TODAY(),0+1)))");

    default:
      return undefined;
  }
};

var opType = function opType(attributes) {
  var type = attributes.type,
      operator = attributes.operator;

  switch (type) {
    case 'containsText':
    case 'containsBlanks':
    case 'notContainsBlanks':
    case 'containsErrors':
    case 'notContainsErrors':
      return {
        type: 'containsText',
        operator: type
      };

    default:
      return {
        type: type,
        operator: operator
      };
  }
};

var CfRuleXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(CfRuleXform, _CompositeXform);

  var _super = _createSuper(CfRuleXform);

  function CfRuleXform() {
    var _this;

    _classCallCheck(this, CfRuleXform);

    _this = _super.call(this);
    _this.map = {
      dataBar: _this.databarXform = new DatabarXform(),
      extLst: _this.extLstRefXform = new ExtLstRefXform(),
      formula: _this.formulaXform = new FormulaXform(),
      colorScale: _this.colorScaleXform = new ColorScaleXform(),
      iconSet: _this.iconSetXform = new IconSetXform()
    };
    return _this;
  }

  _createClass(CfRuleXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      switch (model.type) {
        case 'expression':
          this.renderExpression(xmlStream, model);
          break;

        case 'cellIs':
          this.renderCellIs(xmlStream, model);
          break;

        case 'top10':
          this.renderTop10(xmlStream, model);
          break;

        case 'aboveAverage':
          this.renderAboveAverage(xmlStream, model);
          break;

        case 'dataBar':
          this.renderDataBar(xmlStream, model);
          break;

        case 'colorScale':
          this.renderColorScale(xmlStream, model);
          break;

        case 'iconSet':
          this.renderIconSet(xmlStream, model);
          break;

        case 'containsText':
          this.renderText(xmlStream, model);
          break;

        case 'timePeriod':
          this.renderTimePeriod(xmlStream, model);
          break;
      }
    }
  }, {
    key: "renderExpression",
    value: function renderExpression(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'expression',
        dxfId: model.dxfId,
        priority: model.priority
      });
      this.formulaXform.render(xmlStream, model.formulae[0]);
      xmlStream.closeNode();
    }
  }, {
    key: "renderCellIs",
    value: function renderCellIs(xmlStream, model) {
      var _this2 = this;

      xmlStream.openNode(this.tag, {
        type: 'cellIs',
        dxfId: model.dxfId,
        priority: model.priority,
        operator: model.operator
      });
      model.formulae.forEach(function (formula) {
        _this2.formulaXform.render(xmlStream, formula);
      });
      xmlStream.closeNode();
    }
  }, {
    key: "renderTop10",
    value: function renderTop10(xmlStream, model) {
      xmlStream.leafNode(this.tag, {
        type: 'top10',
        dxfId: model.dxfId,
        priority: model.priority,
        percent: BaseXform.toBoolAttribute(model.percent, false),
        bottom: BaseXform.toBoolAttribute(model.bottom, false),
        rank: BaseXform.toIntValue(model.rank, 10, true)
      });
    }
  }, {
    key: "renderAboveAverage",
    value: function renderAboveAverage(xmlStream, model) {
      xmlStream.leafNode(this.tag, {
        type: 'aboveAverage',
        dxfId: model.dxfId,
        priority: model.priority,
        aboveAverage: BaseXform.toBoolAttribute(model.aboveAverage, true)
      });
    }
  }, {
    key: "renderDataBar",
    value: function renderDataBar(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'dataBar',
        priority: model.priority
      });
      this.databarXform.render(xmlStream, model);
      this.extLstRefXform.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "renderColorScale",
    value: function renderColorScale(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'colorScale',
        priority: model.priority
      });
      this.colorScaleXform.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "renderIconSet",
    value: function renderIconSet(xmlStream, model) {
      // iconset is all primitive or all extLst
      if (!CfRuleXform.isPrimitive(model)) {
        return;
      }

      xmlStream.openNode(this.tag, {
        type: 'iconSet',
        priority: model.priority
      });
      this.iconSetXform.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "renderText",
    value: function renderText(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: model.operator,
        dxfId: model.dxfId,
        priority: model.priority,
        operator: BaseXform.toStringAttribute(model.operator, 'containsText')
      });
      var formula = getTextFormula(model);

      if (formula) {
        this.formulaXform.render(xmlStream, formula);
      }

      xmlStream.closeNode();
    }
  }, {
    key: "renderTimePeriod",
    value: function renderTimePeriod(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'timePeriod',
        dxfId: model.dxfId,
        priority: model.priority,
        timePeriod: model.timePeriod
      });
      var formula = getTimePeriodFormula(model);

      if (formula) {
        this.formulaXform.render(xmlStream, formula);
      }

      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel(_ref) {
      var attributes = _ref.attributes;
      return _objectSpread(_objectSpread({}, opType(attributes)), {}, {
        dxfId: BaseXform.toIntValue(attributes.dxfId),
        priority: BaseXform.toIntValue(attributes.priority),
        timePeriod: attributes.timePeriod,
        percent: BaseXform.toBoolValue(attributes.percent),
        bottom: BaseXform.toBoolValue(attributes.bottom),
        rank: BaseXform.toIntValue(attributes.rank),
        aboveAverage: BaseXform.toBoolValue(attributes.aboveAverage)
      });
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      switch (name) {
        case 'dataBar':
        case 'extLst':
        case 'colorScale':
        case 'iconSet':
          // merge parser model with ours
          Object.assign(this.model, parser.model);
          break;

        case 'formula':
          // except - formula is a string and appends to formulae
          this.model.formulae = this.model.formulae || [];
          this.model.formulae.push(parser.model);
          break;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'cfRule';
    }
  }], [{
    key: "isPrimitive",
    value: function isPrimitive(rule) {
      // is this rule primitive?
      if (rule.type === 'iconSet') {
        if (rule.custom || extIcons[rule.iconSet]) {
          return false;
        }
      }

      return true;
    }
  }]);

  return CfRuleXform;
}(CompositeXform);

module.exports = CfRuleXform;
//# sourceMappingURL=cf-rule-xform.js.map
