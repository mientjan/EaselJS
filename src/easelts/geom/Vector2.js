/*
 * The MIT License
 *
 * Copyright &copy; 2010-2014 three.js authors
 * Copyright &copy; 2014-2015 easelts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
define(["require", "exports"], function (require, exports) {
    /**
     * @module easelts
     */
    /**
     * @class Vector2
     * @author mrdoob / http://mrdoob.com/
     * @author philogb / http://blog.thejit.org/
     * @author egraether / http://egraether.com/
     * @author zz85 / http://www.lab4games.net/zz85/blog
     * @author Mient-jan Stelling
     */
    var Vector2 = (function () {
        /**
         * X position.
         * @property x
         * @type Number
         **/
        /**
         * Y position.
         * @property y
         * @type Number
         **/
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.pair = function () {
            var value = this.x << 16 & 0xffff0000 | this.y & 0x0000ffff;
            if (Number.MAX_VALUE < value) {
                throw 'pair created greater than allowed max uint value';
            }
            return value;
        };
        Vector2.prototype.depair = function (p) {
            return new Vector2(p >> 16 & 0xFFFF, p & 0xFFFF);
        };
        Vector2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector2.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector2.prototype.setComponent = function (index, value) {
            switch (index) {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                default:
                    throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.getComponent = function (index) {
            switch (index) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vector2.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        Vector2.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            return this;
        };
        Vector2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vector2.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        Vector2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vector2.prototype.multiplyScalar = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        Vector2.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vector2.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
                this.y *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
            }
            return this;
        };
        Vector2.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            return this;
        };
        Vector2.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            return this;
        };
        Vector2.prototype.clamp = function (min, max) {
            // This function assumes min < max, if this assumption isn't true it will not operate correctly
            if (this.x < min.x) {
                this.x = min.x;
            }
            else if (this.x > max.x) {
                this.x = max.x;
            }
            if (this.y < min.y) {
                this.y = min.y;
            }
            else if (this.y > max.y) {
                this.y = max.y;
            }
            return this;
        };
        Vector2.prototype.clampScalar = function (minVal, maxVal) {
            if (this.__min === void 0) {
                this.__min = new Vector2(0, 0);
                this.__max = new Vector2(0, 0);
            }
            this.__min.set(minVal, minVal);
            this.__max.set(maxVal, maxVal);
            return this.clamp(this.__min, this.__max);
        };
        Vector2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        Vector2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        Vector2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        Vector2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return this;
        };
        Vector2.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vector2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector2.prototype.distanceTo = function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        };
        Vector2.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        };
        Vector2.prototype.setLength = function (l) {
            var oldLength = this.length();
            if (oldLength !== 0 && l !== oldLength) {
                this.multiplyScalar(l / oldLength);
            }
            return this;
        };
        Vector2.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            return this;
        };
        Vector2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        Vector2.prototype.fromArray = function (array, offset) {
            if (offset === undefined) {
                offset = 0;
            }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        Vector2.prototype.toArray = function (array, offset) {
            if (array === undefined) {
                array = [];
            }
            if (offset === undefined) {
                offset = 0;
            }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            return array;
        };
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        return Vector2;
    })();
    return Vector2;
});
