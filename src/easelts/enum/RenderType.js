define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (RenderType) {
        RenderType[RenderType["UNKNOWN"] = 0] = "UNKNOWN";
        RenderType[RenderType["CANVAS"] = 1] = "CANVAS";
        RenderType[RenderType["WEBGL"] = 2] = "WEBGL";
    })(exports.RenderType || (exports.RenderType = {}));
    var RenderType = exports.RenderType;
});
