define(["require", "exports"], function (require, exports) {
    "use strict";
    var FlumpMtx = (function () {
        function FlumpMtx(a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        return FlumpMtx;
    }());
    return FlumpMtx;
});
