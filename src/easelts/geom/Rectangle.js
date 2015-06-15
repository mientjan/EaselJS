/*
 * Rectangle
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
define(["require", "exports"], function (require, exports) {
    /**
     * @module EaselJS
     */
    /**
     * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
     *
     * <h4>Example</h4>
     *
     *      var rect = new createjs.Rectangle(0, 0, 100, 100);
     *
     * @class Rectangle
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @param {Number} [width=0] The width of the Rectangle.
     * @param {Number} [height=0] The height of the Rectangle.
     * @constructor
     **/
    var Rectangle = (function () {
        // constructor:
        /**
         * Initialization method. Can also be used to reinitialize the instance.
         * @method initialize
         * @param {Number} [x=0] X position.
         * @param {Number} [y=0] Y position.
         * @param {Number} [width=0] The width of the Rectangle.
         * @param {Number} [height=0] The height of the Rectangle.
         * @return {Rectangle} This instance. Useful for chaining method calls.
         */
        function Rectangle(x, y, width, height) {
            // public properties:
            /**
             * X position.
             * @property x
             * @type Number
             **/
            this.x = 0;
            /**
             * Y position.
             * @property y
             * @type Number
             **/
            this.y = 0;
            /**
             * Width.
             * @property width
             * @type Number
             **/
            this.width = 0;
            /**
             * Height.
             * @property height
             * @type Number
             **/
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
        // public methods:
        /**
         * Copies all properties from the specified rectangle to this rectangle.
         * @method copy
         * @param {Rectangle} rectangle The rectangle to copy properties from.
         * @return {Rectangle} This rectangle. Useful for chaining method calls.
         */
        Rectangle.prototype.copy = function (rectangle) {
            return this.setProperies(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        };
        /**
         * Returns a clone of the Rectangle instance.
         * @method clone
         * @return {Rectangle} a clone of the Rectangle instance.
         **/
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        Rectangle.prototype.toString = function () {
            return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]";
        };
        return Rectangle;
    })();
    return Rectangle;
});
