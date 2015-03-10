/**
 * Created by pieters on 10-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var Circle = (function () {
        function Circle(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        Circle.prototype.setProperies = function (x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            return this;
        };
        /**
         * Copies all properties from the specified circle to this circle.
         * @method copy
         * @param {Circle} circle The circle to copy properties from.
         * @return {Circle} This circle. Useful for chaining method calls.
         */
        Circle.prototype.copy = function (circle) {
            return this.setProperies(circle.x, circle.y, circle.radius);
        };
        /**
         * Determines whether the specified point is contained within the circular region defined by this Circle object.
         * @method contains
         * @param {number} x The x coordinate (horizontal position) of the point.
         * @param {number} y The y coordinate (vertical position) of the point.
         * @return {boolean} A value of true if the Circle object contains the specified point; otherwise false.
         */
        Circle.prototype.contains = function (x, y) {
            x -= this.x;
            y -= this.y;
            return (x * x + y * y < this.radius * this.radius);
        };
        /**
         * Returns a clone of the Circle instance.
         * @method clone
         * @return {Circle} a clone of the Circle instance.
         **/
        Circle.prototype.clone = function () {
            return new Circle(this.x, this.y, this.radius);
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        Circle.prototype.toString = function () {
            return "[Circle (x=" + this.x + " y=" + this.y + " radius=" + this.radius + ")]";
        };
        return Circle;
    })();
    return Circle;
});
