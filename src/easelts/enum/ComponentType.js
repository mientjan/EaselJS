define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (ComponentType) {
        ComponentType[ComponentType["UNKNOWN"] = 0] = "UNKNOWN";
        ComponentType[ComponentType["STAGE"] = 1] = "STAGE";
        ComponentType[ComponentType["CONTAINER"] = 2] = "CONTAINER";
        ComponentType[ComponentType["IMAGE"] = 3] = "IMAGE";
        ComponentType[ComponentType["BUTTON"] = 4] = "BUTTON";
        ComponentType[ComponentType["TEXT"] = 5] = "TEXT";
        ComponentType[ComponentType["SHAPE"] = 6] = "SHAPE";
        ComponentType[ComponentType["DEBUG"] = 7] = "DEBUG";
    })(exports.ComponentType || (exports.ComponentType = {}));
    var ComponentType = exports.ComponentType;
});
