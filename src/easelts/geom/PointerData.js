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
define(["require", "exports"], function (require, exports) {
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
    var PointerData = (function () {
        function PointerData(x, y) {
            /**
             * @property inBounds
             * @type boolean
             */
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
