define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (ValueType) {
        ValueType[ValueType["NUMBER"] = 0] = "NUMBER";
        ValueType[ValueType["ARRAY"] = 1] = "ARRAY";
        ValueType[ValueType["STRING"] = 2] = "STRING";
        ValueType[ValueType["OBJECT"] = 3] = "OBJECT";
    })(exports.ValueType || (exports.ValueType = {}));
    var ValueType = exports.ValueType;
});
