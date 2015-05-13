define(["require", "exports", './../util/NumberUtil'], function (require, exports, NumberUtil) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.copy = function (point) {
            return new Point(point.x, point.y);
        };
        Point.prototype.toNumber = function () {
            return NumberUtil.pair(this.x, this.y);
        };
        Point.prototype.fromNumber = function (value) {
            var xy = NumberUtil.depair(value);
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
    })();
    return Point;
});
