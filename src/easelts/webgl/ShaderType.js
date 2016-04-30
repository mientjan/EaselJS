define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (ShaderType) {
        ShaderType[ShaderType["FRAGMENT"] = 0] = "FRAGMENT";
        ShaderType[ShaderType["VERTEX"] = 1] = "VERTEX";
    })(exports.ShaderType || (exports.ShaderType = {}));
    var ShaderType = exports.ShaderType;
});
