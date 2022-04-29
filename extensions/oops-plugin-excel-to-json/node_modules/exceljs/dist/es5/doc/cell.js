"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable max-classes-per-file */
var colCache = require('../utils/col-cache');

var _ = require('../utils/under-dash');

var Enums = require('./enums');

var _require = require('../utils/shared-formula'),
    slideFormula = _require.slideFormula;

var Note = require('./note'); // Cell requirements
//  Operate inside a worksheet
//  Store and retrieve a value with a range of types: text, number, date, hyperlink, reference, formula, etc.
//  Manage/use and manipulate cell format either as local to cell or inherited from column or row.


var Cell = /*#__PURE__*/function () {
  function Cell(row, column, address) {
    _classCallCheck(this, Cell);

    if (!row || !column) {
      throw new Error('A Cell needs a Row');
    }

    this._row = row;
    this._column = column;
    colCache.validateAddress(address);
    this._address = address; // TODO: lazy evaluation of this._value

    this._value = Value.create(Cell.Types.Null, this);
    this.style = this._mergeStyle(row.style, column.style, {});
    this._mergeCount = 0;
  }

  _createClass(Cell, [{
    key: "destroy",
    // help GC by removing cyclic (and other) references
    value: function destroy() {
      delete this.style;
      delete this._value;
      delete this._row;
      delete this._column;
      delete this._address;
    } // =========================================================================
    // Styles stuff

  }, {
    key: "_mergeStyle",
    value: function _mergeStyle(rowStyle, colStyle, style) {
      var numFmt = rowStyle && rowStyle.numFmt || colStyle && colStyle.numFmt;
      if (numFmt) style.numFmt = numFmt;
      var font = rowStyle && rowStyle.font || colStyle && colStyle.font;
      if (font) style.font = font;
      var alignment = rowStyle && rowStyle.alignment || colStyle && colStyle.alignment;
      if (alignment) style.alignment = alignment;
      var border = rowStyle && rowStyle.border || colStyle && colStyle.border;
      if (border) style.border = border;
      var fill = rowStyle && rowStyle.fill || colStyle && colStyle.fill;
      if (fill) style.fill = fill;
      var protection = rowStyle && rowStyle.protection || colStyle && colStyle.protection;
      if (protection) style.protection = protection;
      return style;
    } // =========================================================================
    // return the address for this cell

  }, {
    key: "toCsvString",
    value: function toCsvString() {
      return this._value.toCsvString();
    } // =========================================================================
    // Merge stuff

  }, {
    key: "addMergeRef",
    value: function addMergeRef() {
      this._mergeCount++;
    }
  }, {
    key: "releaseMergeRef",
    value: function releaseMergeRef() {
      this._mergeCount--;
    }
  }, {
    key: "merge",
    value: function merge(master, ignoreStyle) {
      this._value.release();

      this._value = Value.create(Cell.Types.Merge, this, master);

      if (!ignoreStyle) {
        this.style = master.style;
      }
    }
  }, {
    key: "unmerge",
    value: function unmerge() {
      if (this.type === Cell.Types.Merge) {
        this._value.release();

        this._value = Value.create(Cell.Types.Null, this);
        this.style = this._mergeStyle(this._row.style, this._column.style, {});
      }
    }
  }, {
    key: "isMergedTo",
    value: function isMergedTo(master) {
      if (this._value.type !== Cell.Types.Merge) return false;
      return this._value.isMergedTo(master);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.text;
    }
  }, {
    key: "_upgradeToHyperlink",
    value: function _upgradeToHyperlink(hyperlink) {
      // if this cell is a string, turn it into a Hyperlink
      if (this.type === Cell.Types.String) {
        this._value = Value.create(Cell.Types.Hyperlink, this, {
          text: this._value.value,
          hyperlink: hyperlink
        });
      }
    } // =========================================================================
    // Formula stuff

  }, {
    key: "addName",
    value: function addName(name) {
      this.workbook.definedNames.addEx(this.fullAddress, name);
    }
  }, {
    key: "removeName",
    value: function removeName(name) {
      this.workbook.definedNames.removeEx(this.fullAddress, name);
    }
  }, {
    key: "removeAllNames",
    value: function removeAllNames() {
      this.workbook.definedNames.removeAllNames(this.fullAddress);
    } // =========================================================================
    // Data Validation stuff

  }, {
    key: "worksheet",
    get: function get() {
      return this._row.worksheet;
    }
  }, {
    key: "workbook",
    get: function get() {
      return this._row.worksheet.workbook;
    }
  }, {
    key: "numFmt",
    get: function get() {
      return this.style.numFmt;
    },
    set: function set(value) {
      this.style.numFmt = value;
    }
  }, {
    key: "font",
    get: function get() {
      return this.style.font;
    },
    set: function set(value) {
      this.style.font = value;
    }
  }, {
    key: "alignment",
    get: function get() {
      return this.style.alignment;
    },
    set: function set(value) {
      this.style.alignment = value;
    }
  }, {
    key: "border",
    get: function get() {
      return this.style.border;
    },
    set: function set(value) {
      this.style.border = value;
    }
  }, {
    key: "fill",
    get: function get() {
      return this.style.fill;
    },
    set: function set(value) {
      this.style.fill = value;
    }
  }, {
    key: "protection",
    get: function get() {
      return this.style.protection;
    },
    set: function set(value) {
      this.style.protection = value;
    }
  }, {
    key: "address",
    get: function get() {
      return this._address;
    }
  }, {
    key: "row",
    get: function get() {
      return this._row.number;
    }
  }, {
    key: "col",
    get: function get() {
      return this._column.number;
    }
  }, {
    key: "$col$row",
    get: function get() {
      return "$".concat(this._column.letter, "$").concat(this.row);
    } // =========================================================================
    // Value stuff

  }, {
    key: "type",
    get: function get() {
      return this._value.type;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return this._value.effectiveType;
    }
  }, {
    key: "isMerged",
    get: function get() {
      return this._mergeCount > 0 || this.type === Cell.Types.Merge;
    }
  }, {
    key: "master",
    get: function get() {
      if (this.type === Cell.Types.Merge) {
        return this._value.master;
      }

      return this; // an unmerged cell is its own master
    }
  }, {
    key: "isHyperlink",
    get: function get() {
      return this._value.type === Cell.Types.Hyperlink;
    }
  }, {
    key: "hyperlink",
    get: function get() {
      return this._value.hyperlink;
    } // return the value

  }, {
    key: "value",
    get: function get() {
      return this._value.value;
    } // set the value - can be number, string or raw
    ,
    set: function set(v) {
      // special case - merge cells set their master's value
      if (this.type === Cell.Types.Merge) {
        this._value.master.value = v;
        return;
      }

      this._value.release(); // assign value


      this._value = Value.create(Value.getType(v), this, v);
    }
  }, {
    key: "note",
    get: function get() {
      return this._comment && this._comment.note;
    },
    set: function set(note) {
      this._comment = new Note(note);
    }
  }, {
    key: "text",
    get: function get() {
      return this._value.toString();
    }
  }, {
    key: "html",
    get: function get() {
      return _.escapeHtml(this.text);
    }
  }, {
    key: "formula",
    get: function get() {
      return this._value.formula;
    }
  }, {
    key: "result",
    get: function get() {
      return this._value.result;
    }
  }, {
    key: "formulaType",
    get: function get() {
      return this._value.formulaType;
    } // =========================================================================
    // Name stuff

  }, {
    key: "fullAddress",
    get: function get() {
      var worksheet = this._row.worksheet;
      return {
        sheetName: worksheet.name,
        address: this.address,
        row: this.row,
        col: this.col
      };
    }
  }, {
    key: "name",
    get: function get() {
      return this.names[0];
    },
    set: function set(value) {
      this.names = [value];
    }
  }, {
    key: "names",
    get: function get() {
      return this.workbook.definedNames.getNamesEx(this.fullAddress);
    },
    set: function set(value) {
      var _this = this;

      var definedNames = this.workbook.definedNames;
      definedNames.removeAllNames(this.fullAddress);
      value.forEach(function (name) {
        definedNames.addEx(_this.fullAddress, name);
      });
    }
  }, {
    key: "_dataValidations",
    get: function get() {
      return this.worksheet.dataValidations;
    }
  }, {
    key: "dataValidation",
    get: function get() {
      return this._dataValidations.find(this.address);
    },
    set: function set(value) {
      this._dataValidations.add(this.address, value);
    } // =========================================================================
    // Model stuff

  }, {
    key: "model",
    get: function get() {
      var model = this._value.model;
      model.style = this.style;

      if (this._comment) {
        model.comment = this._comment.model;
      }

      return model;
    },
    set: function set(value) {
      this._value.release();

      this._value = Value.create(value.type, this);
      this._value.model = value;

      if (value.comment) {
        switch (value.comment.type) {
          case 'note':
            this._comment = Note.fromModel(value.comment);
            break;
        }
      }

      if (value.style) {
        this.style = value.style;
      } else {
        this.style = {};
      }
    }
  }]);

  return Cell;
}();

Cell.Types = Enums.ValueType; // =============================================================================
// Internal Value Types

var NullValue = /*#__PURE__*/function () {
  function NullValue(cell) {
    _classCallCheck(this, NullValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Null
    };
  }

  _createClass(NullValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return '';
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return '';
    }
  }, {
    key: "value",
    get: function get() {
      return null;
    },
    set: function set(value) {// nothing to do
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Null;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Null;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return NullValue;
}();

var NumberValue = /*#__PURE__*/function () {
  function NumberValue(cell, value) {
    _classCallCheck(this, NumberValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Number,
      value: value
    };
  }

  _createClass(NumberValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.value.toString();
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Number;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Number;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return NumberValue;
}();

var StringValue = /*#__PURE__*/function () {
  function StringValue(cell, value) {
    _classCallCheck(this, StringValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.String,
      value: value
    };
  }

  _createClass(StringValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return "\"".concat(this.model.value.replace(/"/g, '""'), "\"");
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value;
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.String;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.String;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return StringValue;
}();

var RichTextValue = /*#__PURE__*/function () {
  function RichTextValue(cell, value) {
    _classCallCheck(this, RichTextValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.String,
      value: value
    };
  }

  _createClass(RichTextValue, [{
    key: "toString",
    value: function toString() {
      return this.model.value.richText.map(function (t) {
        return t.text;
      }).join('');
    }
  }, {
    key: "toCsvString",
    value: function toCsvString() {
      return "\"".concat(this.text.replace(/"/g, '""'), "\"");
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.RichText;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.RichText;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return RichTextValue;
}();

var DateValue = /*#__PURE__*/function () {
  function DateValue(cell, value) {
    _classCallCheck(this, DateValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Date,
      value: value
    };
  }

  _createClass(DateValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.value.toISOString();
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Date;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Date;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return DateValue;
}();

var HyperlinkValue = /*#__PURE__*/function () {
  function HyperlinkValue(cell, value) {
    _classCallCheck(this, HyperlinkValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Hyperlink,
      text: value ? value.text : undefined,
      hyperlink: value ? value.hyperlink : undefined
    };

    if (value && value.tooltip) {
      this.model.tooltip = value.tooltip;
    }
  }

  _createClass(HyperlinkValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.hyperlink;
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.text;
    }
  }, {
    key: "value",
    get: function get() {
      var v = {
        text: this.model.text,
        hyperlink: this.model.hyperlink
      };

      if (this.model.tooltip) {
        v.tooltip = this.model.tooltip;
      }

      return v;
    },
    set: function set(value) {
      this.model = {
        text: value.text,
        hyperlink: value.hyperlink
      };

      if (value.tooltip) {
        this.model.tooltip = value.tooltip;
      }
    }
  }, {
    key: "text",
    get: function get() {
      return this.model.text;
    },
    set: function set(value) {
      this.model.text = value;
    }
    /*
    get tooltip() {
      return this.model.tooltip;
    }
      set tooltip(value) {
      this.model.tooltip = value;
    } */

  }, {
    key: "hyperlink",
    get: function get() {
      return this.model.hyperlink;
    },
    set: function set(value) {
      this.model.hyperlink = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Hyperlink;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Hyperlink;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return HyperlinkValue;
}();

var MergeValue = /*#__PURE__*/function () {
  function MergeValue(cell, master) {
    _classCallCheck(this, MergeValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Merge,
      master: master ? master.address : undefined
    };
    this._master = master;

    if (master) {
      master.addMergeRef();
    }
  }

  _createClass(MergeValue, [{
    key: "isMergedTo",
    value: function isMergedTo(master) {
      return master === this._master;
    }
  }, {
    key: "toCsvString",
    value: function toCsvString() {
      return '';
    }
  }, {
    key: "release",
    value: function release() {
      this._master.releaseMergeRef();
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.value.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this._master.value;
    },
    set: function set(value) {
      if (value instanceof Cell) {
        if (this._master) {
          this._master.releaseMergeRef();
        }

        value.addMergeRef();
        this._master = value;
      } else {
        this._master.value = value;
      }
    }
  }, {
    key: "master",
    get: function get() {
      return this._master;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Merge;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return this._master.effectiveType;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return MergeValue;
}();

var FormulaValue = /*#__PURE__*/function () {
  function FormulaValue(cell, value) {
    _classCallCheck(this, FormulaValue);

    this.cell = cell;
    this.model = {
      address: cell.address,
      type: Cell.Types.Formula,
      shareType: value ? value.shareType : undefined,
      ref: value ? value.ref : undefined,
      formula: value ? value.formula : undefined,
      sharedFormula: value ? value.sharedFormula : undefined,
      result: value ? value.result : undefined
    };
  }

  _createClass(FormulaValue, [{
    key: "_copyModel",
    value: function _copyModel(model) {
      var copy = {};

      var cp = function cp(name) {
        var value = model[name];

        if (value) {
          copy[name] = value;
        }
      };

      cp('formula');
      cp('result');
      cp('ref');
      cp('shareType');
      cp('sharedFormula');
      return copy;
    }
  }, {
    key: "validate",
    value: function validate(value) {
      switch (Value.getType(value)) {
        case Cell.Types.Null:
        case Cell.Types.String:
        case Cell.Types.Number:
        case Cell.Types.Date:
          break;

        case Cell.Types.Hyperlink:
        case Cell.Types.Formula:
        default:
          throw new Error('Cannot process that type of result value');
      }
    }
  }, {
    key: "_getTranslatedFormula",
    value: function _getTranslatedFormula() {
      if (!this._translatedFormula && this.model.sharedFormula) {
        var worksheet = this.cell.worksheet;
        var master = worksheet.findCell(this.model.sharedFormula);
        this._translatedFormula = master && slideFormula(master.formula, master.address, this.model.address);
      }

      return this._translatedFormula;
    }
  }, {
    key: "toCsvString",
    value: function toCsvString() {
      return "".concat(this.model.result || '');
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.result ? this.model.result.toString() : '';
    }
  }, {
    key: "value",
    get: function get() {
      return this._copyModel(this.model);
    },
    set: function set(value) {
      this.model = this._copyModel(value);
    }
  }, {
    key: "dependencies",
    get: function get() {
      // find all the ranges and cells mentioned in the formula
      var ranges = this.formula.match(/([a-zA-Z0-9]+!)?[A-Z]{1,3}\d{1,4}:[A-Z]{1,3}\d{1,4}/g);
      var cells = this.formula.replace(/([a-zA-Z0-9]+!)?[A-Z]{1,3}\d{1,4}:[A-Z]{1,3}\d{1,4}/g, '').match(/([a-zA-Z0-9]+!)?[A-Z]{1,3}\d{1,4}/g);
      return {
        ranges: ranges,
        cells: cells
      };
    }
  }, {
    key: "formula",
    get: function get() {
      return this.model.formula || this._getTranslatedFormula();
    },
    set: function set(value) {
      this.model.formula = value;
    }
  }, {
    key: "formulaType",
    get: function get() {
      if (this.model.formula) {
        return Enums.FormulaType.Master;
      }

      if (this.model.sharedFormula) {
        return Enums.FormulaType.Shared;
      }

      return Enums.FormulaType.None;
    }
  }, {
    key: "result",
    get: function get() {
      return this.model.result;
    },
    set: function set(value) {
      this.model.result = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Formula;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      var v = this.model.result;

      if (v === null || v === undefined) {
        return Enums.ValueType.Null;
      }

      if (v instanceof String || typeof v === 'string') {
        return Enums.ValueType.String;
      }

      if (typeof v === 'number') {
        return Enums.ValueType.Number;
      }

      if (v instanceof Date) {
        return Enums.ValueType.Date;
      }

      if (v.text && v.hyperlink) {
        return Enums.ValueType.Hyperlink;
      }

      if (v.formula) {
        return Enums.ValueType.Formula;
      }

      return Enums.ValueType.Null;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return FormulaValue;
}();

var SharedStringValue = /*#__PURE__*/function () {
  function SharedStringValue(cell, value) {
    _classCallCheck(this, SharedStringValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.SharedString,
      value: value
    };
  }

  _createClass(SharedStringValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.value.toString();
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.SharedString;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.SharedString;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return SharedStringValue;
}();

var BooleanValue = /*#__PURE__*/function () {
  function BooleanValue(cell, value) {
    _classCallCheck(this, BooleanValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Boolean,
      value: value
    };
  }

  _createClass(BooleanValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.value ? 1 : 0;
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Boolean;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Boolean;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return BooleanValue;
}();

var ErrorValue = /*#__PURE__*/function () {
  function ErrorValue(cell, value) {
    _classCallCheck(this, ErrorValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.Error,
      value: value
    };
  }

  _createClass(ErrorValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.toString();
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value.error.toString();
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.value;
    },
    set: function set(value) {
      this.model.value = value;
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.Error;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.Error;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return ErrorValue;
}();

var JSONValue = /*#__PURE__*/function () {
  function JSONValue(cell, value) {
    _classCallCheck(this, JSONValue);

    this.model = {
      address: cell.address,
      type: Cell.Types.String,
      value: JSON.stringify(value),
      rawValue: value
    };
  }

  _createClass(JSONValue, [{
    key: "toCsvString",
    value: function toCsvString() {
      return this.model.value;
    }
  }, {
    key: "release",
    value: function release() {}
  }, {
    key: "toString",
    value: function toString() {
      return this.model.value;
    }
  }, {
    key: "value",
    get: function get() {
      return this.model.rawValue;
    },
    set: function set(value) {
      this.model.rawValue = value;
      this.model.value = JSON.stringify(value);
    }
  }, {
    key: "type",
    get: function get() {
      return Cell.Types.String;
    }
  }, {
    key: "effectiveType",
    get: function get() {
      return Cell.Types.String;
    }
  }, {
    key: "address",
    get: function get() {
      return this.model.address;
    },
    set: function set(value) {
      this.model.address = value;
    }
  }]);

  return JSONValue;
}(); // Value is a place to hold common static Value type functions


var Value = {
  getType: function getType(value) {
    if (value === null || value === undefined) {
      return Cell.Types.Null;
    }

    if (value instanceof String || typeof value === 'string') {
      return Cell.Types.String;
    }

    if (typeof value === 'number') {
      return Cell.Types.Number;
    }

    if (typeof value === 'boolean') {
      return Cell.Types.Boolean;
    }

    if (value instanceof Date) {
      return Cell.Types.Date;
    }

    if (value.text && value.hyperlink) {
      return Cell.Types.Hyperlink;
    }

    if (value.formula || value.sharedFormula) {
      return Cell.Types.Formula;
    }

    if (value.richText) {
      return Cell.Types.RichText;
    }

    if (value.sharedString) {
      return Cell.Types.SharedString;
    }

    if (value.error) {
      return Cell.Types.Error;
    }

    return Cell.Types.JSON;
  },
  // map valueType to constructor
  types: [{
    t: Cell.Types.Null,
    f: NullValue
  }, {
    t: Cell.Types.Number,
    f: NumberValue
  }, {
    t: Cell.Types.String,
    f: StringValue
  }, {
    t: Cell.Types.Date,
    f: DateValue
  }, {
    t: Cell.Types.Hyperlink,
    f: HyperlinkValue
  }, {
    t: Cell.Types.Formula,
    f: FormulaValue
  }, {
    t: Cell.Types.Merge,
    f: MergeValue
  }, {
    t: Cell.Types.JSON,
    f: JSONValue
  }, {
    t: Cell.Types.SharedString,
    f: SharedStringValue
  }, {
    t: Cell.Types.RichText,
    f: RichTextValue
  }, {
    t: Cell.Types.Boolean,
    f: BooleanValue
  }, {
    t: Cell.Types.Error,
    f: ErrorValue
  }].reduce(function (p, t) {
    p[t.t] = t.f;
    return p;
  }, []),
  create: function create(type, cell, value) {
    var T = this.types[type];

    if (!T) {
      throw new Error("Could not create Value of type ".concat(type));
    }

    return new T(cell, value);
  }
};
module.exports = Cell;
//# sourceMappingURL=cell.js.map
