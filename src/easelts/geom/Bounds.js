define(["require", "exports"], function (require, exports) {
    "use strict";
    var Bounds = (function () {
        function Bounds() {
            this.x0 = 0;
            this.y0 = 0;
            this.x1 = 0;
            this.y1 = 0;
            this.width = 0;
            this.height = 0;
        }
        return Bounds;
    }());
    exports.Bounds = Bounds;
});
