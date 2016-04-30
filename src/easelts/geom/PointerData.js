define(["require", "exports"], function (require, exports) {
    "use strict";
    var PointerData = (function () {
        function PointerData(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
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
    exports.PointerData = PointerData;
});
