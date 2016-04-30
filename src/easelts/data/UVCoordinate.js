define(["require", "exports"], function (require, exports) {
    "use strict";
    var UVCoordinate = (function () {
        function UVCoordinate(arr, offset) {
            this.x0 = 0.0;
            this.y0 = 0.0;
            this.x1 = 1.0;
            this.y1 = 0.0;
            this.x2 = 1.0;
            this.y2 = 1.0;
            this.x3 = 0.0;
            this.y3 = 1.0;
            if (arr) {
                this.setByArray(arr, offset);
            }
        }
        UVCoordinate.prototype.setByArray = function (arr, offset) {
            if (offset === void 0) { offset = 0; }
            if (arr.length < (offset + 8)) {
                throw new Error('Array out of scope.');
            }
            this.x0 = arr[0];
            this.y0 = arr[1];
            this.x1 = arr[2];
            this.y1 = arr[3];
            this.x2 = arr[4];
            this.y2 = arr[5];
            this.x3 = arr[6];
            this.y3 = arr[7];
        };
        UVCoordinate.prototype.setByTexture = function (texture, rectangle) {
            var tw = texture.width;
            var th = texture.height;
            this.x0 = rectangle.x / tw;
            this.y0 = rectangle.y / th;
            this.x1 = (rectangle.x + rectangle.width) / tw;
            this.y1 = rectangle.y / th;
            this.x2 = (rectangle.x + rectangle.width) / tw;
            this.y2 = (rectangle.y + rectangle.height) / th;
            this.x3 = rectangle.x / tw;
            this.y3 = (rectangle.y + rectangle.height) / th;
        };
        return UVCoordinate;
    }());
    exports.UVCoordinate = UVCoordinate;
});
