/*
 * Point
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
define(["require", "exports", "./../util/NumberUtil"], function (require, exports, NumberUtil_1) {
    /**
     * @module easelts
     */
    /**
     * Represents a point on a 2 dimensional x / y coordinate system.
     *
     * <h4>Example</h4>
     *
     *      var point = new createjs.Point(0, 100);
     *
     * @class Point
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @constructor
     **/
    var Point = (function () {
        /**
         * Initialization method. Can also be used to reinitialize the instance.
         * @method initialize
         * @param {Number} [x=0] X position.
         * @param {Number} [y=0] Y position.
         * @return {Point} This instance. Useful for chaining method calls.
         */
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * Copies all properties from the specified point to this point.
         * @method copy
         * @param {Point} point The point to copy properties from.
         * @return {Point} This point. Useful for chaining method calls.
         */
        Point.prototype.copy = function (point) {
            return new Point(point.x, point.y);
        };
        Point.prototype.toNumber = function () {
            return NumberUtil_1.default.pair(this.x, this.y);
        };
        Point.prototype.fromNumber = function (value) {
            var xy = NumberUtil_1.default.depair(value);
            this.x = xy[0];
            this.y = xy[1];
        };
        /**
         * Returns a clone of the Point instance.
         * @method clone
         * @return {Point} a clone of the Point instance.
         **/
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        Point.prototype.toString = function () {
            return "[Point (x=" + this.x + " y=" + this.y + ")]";
        };
        return Point;
    })();
    exports.default = Point;
});
