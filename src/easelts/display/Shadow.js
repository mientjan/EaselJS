define(["require", "exports"], function (require, exports) {
    var Shadow = (function () {
        function Shadow(color, offsetX, offsetY, blur) {
            this.color = null;
            this.offsetX = 0;
            this.offsetY = 0;
            this.blur = 0;
            this.color = color;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.blur = blur;
        }
        Shadow.prototype.toString = function () {
            return "[Shadow]";
        };
        Shadow.prototype.clone = function () {
            return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
        };
        Shadow.identity = null;
        return Shadow;
    })();
    Shadow.identity = new Shadow("transparent", 0, 0, 0);
    return Shadow;
});
