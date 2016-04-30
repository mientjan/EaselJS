define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (CalculationUnitType) {
        CalculationUnitType[CalculationUnitType["ADDITION"] = 0] = "ADDITION";
        CalculationUnitType[CalculationUnitType["SUBSTRACTION"] = 1] = "SUBSTRACTION";
        CalculationUnitType[CalculationUnitType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
        CalculationUnitType[CalculationUnitType["DIVISION"] = 3] = "DIVISION";
    })(exports.CalculationUnitType || (exports.CalculationUnitType = {}));
    var CalculationUnitType = exports.CalculationUnitType;
});
