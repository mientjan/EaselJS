define(["require", "exports"], function (require, exports) {
    "use strict";
    var QualityType;
    (function (QualityType) {
        QualityType[QualityType["NORMAL"] = 0] = "NORMAL";
        QualityType[QualityType["LOW"] = 1] = "LOW";
    })(QualityType || (QualityType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QualityType;
});
