define(["require", "exports"], function (require, exports) {
    var ValueType;
    (function (ValueType) {
        ValueType[ValueType["NUMBER"] = 0] = "NUMBER";
        ValueType[ValueType["ARRAY"] = 1] = "ARRAY";
        ValueType[ValueType["STRING"] = 2] = "STRING";
        ValueType[ValueType["OBJECT"] = 3] = "OBJECT";
    })(ValueType || (ValueType = {}));
});
