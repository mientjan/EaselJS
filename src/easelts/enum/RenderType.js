define(["require", "exports"], function (require, exports) {
    "use strict";
    var RenderType;
    (function (RenderType) {
        RenderType[RenderType["UNKNOWN"] = 0] = "UNKNOWN";
        RenderType[RenderType["CANVAS"] = 1] = "CANVAS";
        RenderType[RenderType["WEBGL"] = 2] = "WEBGL";
    })(RenderType || (RenderType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RenderType;
});
