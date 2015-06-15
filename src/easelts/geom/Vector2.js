define(["require", "exports"], function (require, exports) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.getRadiansFromDegree = function (value) {
            return value * Vector2.degreeToRad;
        };
        Vector2.getDegreeFromRadians = function (value) {
            return value * Vector2.radToDegree;
        };
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
        Vector2.prototype.copy = function (a) {
            var v = this.clone();
            v.x = a.x;
            v.y = a.y;
            return v;
        };
        Vector2.prototype.add = function (a) {
            var v = this.clone();
            v.x += a.x;
            v.y += a.y;
            return v;
        };
        Vector2.prototype.addVectors = function (a, b) {
            var v = this.clone();
            v.x = a.x + b.x;
            v.y = a.y + b.y;
            return v;
        };
        Vector2.prototype.addScalar = function (s) {
            var v = this.clone();
            v.x += s;
            v.y += s;
            return this;
        };
        Vector2.prototype.diff = function (a) {
            var v = this.clone();
            v.x = (this.x + a.x) / 2;
            v.y = (this.y + a.y) / 2;
            return v;
        };
        Vector2.prototype.rotateByVector2 = function (a, radians) {
            var v = this.clone();
            v.x = a.x + (((this.x - a.x) * Math.cos(radians)) - ((this.y - a.y) * Math.sin(radians)));
            v.y = a.y + (((this.x - a.x) * Math.sin(radians)) + ((this.y - a.y) * Math.cos(radians)));
            return v;
        };
        Vector2.prototype.sub = function (a) {
            var v = this.clone();
            v.x -= a.x;
            v.y -= a.y;
            return v;
        };
        Vector2.prototype.subVectors = function (a, b) {
            var v = this.clone();
            v.x = a.x - b.x;
            v.y = a.y - b.y;
            return this;
        };
        Vector2.prototype.multiply = function (a) {
            var v = this.clone();
            v.x *= a.x;
            v.y *= a.y;
            return v;
        };
        Vector2.prototype.multiplyScalar = function (s) {
            var v = this.clone();
            v.x *= s;
            v.y *= s;
            return v;
        };
        Vector2.prototype.divide = function (a) {
            var v = this.clone();
            this.x /= a.x;
            this.y /= a.y;
            return this;
        };
        Vector2.prototype.divideScalar = function (s) {
            var v = this.clone();
            if (s !== 0) {
                var invScalar = 1 / s;
                v.x *= invScalar;
                v.y *= invScalar;
            }
            else {
                v.x = 0;
                v.y = 0;
            }
            return v;
        };
        Vector2.prototype.min = function (a) {
            var v = this.clone();
            if (v.x > a.x) {
                v.x = a.x;
            }
            if (v.y > a.y) {
                v.y = a.y;
            }
            return v;
        };
        Vector2.prototype.max = function (a) {
            var v = this.clone();
            if (v.x < a.x) {
                v.x = a.x;
            }
            if (v.y < a.y) {
                v.y = a.y;
            }
            return v;
        };
        Vector2.prototype.clamp = function (min, max) {
            var v = this.clone();
            if (v.x < min.x) {
                v.x = min.x;
            }
            else if (v.x > max.x) {
                v.x = max.x;
            }
            if (v.y < min.y) {
                v.y = min.y;
            }
            else if (v.y > max.y) {
                v.y = max.y;
            }
            return v;
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
            var v = this.clone();
            v.x = Math.floor(this.x);
            v.y = Math.floor(this.y);
            return v;
        };
        Vector2.prototype.ceil = function () {
            var v = this.clone();
            v.x = Math.ceil(this.x);
            v.y = Math.ceil(this.y);
            return this;
        };
        Vector2.prototype.round = function () {
            var v = this.clone();
            v.x = Math.round(this.x);
            v.y = Math.round(this.y);
            return v;
        };
        Vector2.prototype.roundToZero = function () {
            var v = this.clone();
            v.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            v.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return v;
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
        Vector2.prototype.getAngleInRadians = function (v) {
            return Math.atan2(v.y - this.y, v.x - this.x);
        };
        Vector2.prototype.getAngleInDegrees = function (v) {
            return this.getAngleInRadians(v) * 180 / Math.PI;
        };
        Vector2.prototype.setFromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        Vector2.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            return array;
        };
        Vector2.prototype.toString = function () {
            return '[Vector2(x=' + this.x + ', y=' + this.y + ')]';
        };
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        Vector2.radToDegree = 180 / Math.PI;
        Vector2.degreeToRad = Math.PI / 180;
        return Vector2;
    })();
    return Vector2;
});
