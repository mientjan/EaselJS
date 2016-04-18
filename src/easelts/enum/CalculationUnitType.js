define(["require", "exports"], function (require, exports) {
    "use strict";
    var CalculationUnitType;
    (function (CalculationUnitType) {
        CalculationUnitType[CalculationUnitType["ADDITION"] = 0] = "ADDITION";
        CalculationUnitType[CalculationUnitType["SUBSTRACTION"] = 1] = "SUBSTRACTION";
        CalculationUnitType[CalculationUnitType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
        CalculationUnitType[CalculationUnitType["DIVISION"] = 3] = "DIVISION";
    })(CalculationUnitType || (CalculationUnitType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CalculationUnitType;
});
