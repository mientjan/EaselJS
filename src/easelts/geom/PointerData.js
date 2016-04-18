define(["require", "exports"], function (require, exports) {
    "use strict";
    var PointerData = (function () {
        function PointerData(x, y) {
            this.inBounds = false;
            this.target = null;
            this.posEvtObj = null;
            this.rawX = 0;
            this.rawY = 0;
            this.x = x;
            this.y = y;
        }
        return PointerData;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointerData;
});
