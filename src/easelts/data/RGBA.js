define(["require", "exports"], function (require, exports) {
    var RGBA = (function () {
        function RGBA(r, g, b, a) {
            if (r === void 0) { r = 0.0; }
            if (g === void 0) { g = 0.0; }
            if (b === void 0) { b = 0.0; }
            if (a === void 0) { a = 0.0; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        RGBA.prototype.toString = function () {
            return 'rgba(' + this.r + ',' + this.g + ',';
            this.b + ',' + this.a + ')';
        };
        return RGBA;
    })();
    return RGBA;
});
