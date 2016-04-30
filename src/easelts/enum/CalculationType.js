define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (CalculationType) {
        CalculationType[CalculationType["UNKOWN"] = 0] = "UNKOWN";
        CalculationType[CalculationType["PERCENT"] = 1] = "PERCENT";
        CalculationType[CalculationType["STATIC"] = 2] = "STATIC";
        CalculationType[CalculationType["CALC"] = 3] = "CALC";
    })(exports.CalculationType || (exports.CalculationType = {}));
    var CalculationType = exports.CalculationType;
});
