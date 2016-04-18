define(["require", "exports"], function (require, exports) {
    "use strict";
    var BitmapType;
    (function (BitmapType) {
        BitmapType[BitmapType["UNKNOWN"] = 0] = "UNKNOWN";
        BitmapType[BitmapType["IMAGE"] = 1] = "IMAGE";
        BitmapType[BitmapType["VIDEO"] = 2] = "VIDEO";
        BitmapType[BitmapType["CANVAS"] = 3] = "CANVAS";
    })(BitmapType || (BitmapType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BitmapType;
});
