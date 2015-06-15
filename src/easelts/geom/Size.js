/*
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
     * @module createts
     */
    /**
     * Represents a size on a 2 dimensional displayObject.
     *
     * <h4>Example</h4>
     *
     *      var size = new Size(0, 100);
     *
     * @class Point
     * @param {Number} [x=0] width position.
     * @param {Number} [y=0] Y position.
     * @constructor
     **/
    var Size = (function () {
        /**
         * @constructor
         * @param {Number} [width=0] width.
         * @param {Number} [height=0] height.
         * @return {Point} This instance. Useful for chaining method calls.
         */
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        /**
         * Copies all properties from the specified point to this point.
         * @method copy
         * @param {Size} point The point to copy properties from.
         * @return {Size} This point. Useful for chaining method calls.
         */
        Size.prototype.copy = function (size) {
            return new Size(size.width, size.height);
        };
        /**
         * Returns a clone of the Point instance.
         *
         * @method clone
         * @return {Size} a clone of the Size instance.
         **/
        Size.prototype.clone = function () {
            return new Size(this.width, this.height);
        };
        /**
         * Returns a string representation of this object.
         *
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        Size.prototype.toString = function () {
            return "[Size (x=" + this.width + " y=" + this.height + ")]";
        };
        return Size;
    })();
    return Size;
});
