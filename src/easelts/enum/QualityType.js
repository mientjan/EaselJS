define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (QualityType) {
        QualityType[QualityType["NORMAL"] = 0] = "NORMAL";
        QualityType[QualityType["LOW"] = 1] = "LOW";
    })(exports.QualityType || (exports.QualityType = {}));
    var QualityType = exports.QualityType;
});
