define(["require", "exports", "./../util/NumberUtil"], function (require, exports, NumberUtil_1) {
    "use strict";
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.setXY = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.copy = function (point) {
            return new Point(point.x, point.y);
        };
        Point.prototype.toNumber = function () {
            return NumberUtil_1.NumberUtil.pair(this.x, this.y);
        };
        Point.prototype.fromNumber = function (value) {
            var xy = NumberUtil_1.NumberUtil.depair(value);
            this.x = xy[0];
            this.y = xy[1];
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.toString = function () {
            return "[Point (x=" + this.x + " y=" + this.y + ")]";
        };
        return Point;
    }());
    exports.Point = Point;
});
