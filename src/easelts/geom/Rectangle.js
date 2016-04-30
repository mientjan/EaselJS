define(["require", "exports"], function (require, exports) {
    "use strict";
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.setProperies(x, y, width, height);
        }
        Rectangle.prototype.setProperies = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Rectangle.prototype.copy = function (rectangle) {
            return this.setProperies(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        };
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.toString = function () {
            return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]";
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
