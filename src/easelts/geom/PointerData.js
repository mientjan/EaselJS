define(["require", "exports"], function (require, exports) {
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
    })();
    return PointerData;
});
