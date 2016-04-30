define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (ScaleType) {
        ScaleType[ScaleType["LINEAR"] = 0] = "LINEAR";
        ScaleType[ScaleType["NEAREST"] = 1] = "NEAREST";
    })(exports.ScaleType || (exports.ScaleType = {}));
    var ScaleType = exports.ScaleType;
});
