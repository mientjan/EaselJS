define(["require", "exports"], function (require, exports) {
    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["FRAGMENT"] = 0] = "FRAGMENT";
        ShaderType[ShaderType["VERTEX"] = 1] = "VERTEX";
    })(ShaderType || (ShaderType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShaderType;
});
