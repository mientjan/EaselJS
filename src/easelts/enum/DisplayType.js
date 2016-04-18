define(["require", "exports"], function (require, exports) {
    "use strict";
    var DisplayType;
    (function (DisplayType) {
        DisplayType[DisplayType["UNKNOWN"] = 1] = "UNKNOWN";
        DisplayType[DisplayType["DISPLAYOBJECT"] = 2] = "DISPLAYOBJECT";
        DisplayType[DisplayType["STAGE"] = 4] = "STAGE";
        DisplayType[DisplayType["CONTAINER"] = 8] = "CONTAINER";
        DisplayType[DisplayType["SHAPE"] = 16] = "SHAPE";
        DisplayType[DisplayType["BITMAP"] = 32] = "BITMAP";
        DisplayType[DisplayType["MOVIECLIP"] = 64] = "MOVIECLIP";
        DisplayType[DisplayType["SPRITESHEET"] = 128] = "SPRITESHEET";
        DisplayType[DisplayType["BITMAPVIDEO"] = 256] = "BITMAPVIDEO";
        DisplayType[DisplayType["BITMAPTEXT"] = 512] = "BITMAPTEXT";
        DisplayType[DisplayType["TEXTURE"] = 1024] = "TEXTURE";
        DisplayType[DisplayType["FLUMPSYMBOL"] = 2048] = "FLUMPSYMBOL";
    })(DisplayType || (DisplayType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayType;
});
