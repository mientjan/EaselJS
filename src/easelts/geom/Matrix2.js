/// <reference path="../display/DisplayObject.ts" />
define(["require", "exports"], function (require, exports) {
    var Matrix2 = (function () {
        function Matrix2(a, b, c, d, tx, ty) {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            this.alpha = 1;
            this.shadow = null;
            this.compositeOperation = null;
            this.visible = true;
            this._initialize(a, b, c, d, tx, ty);
        }
        Matrix2.prototype._initialize = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        };
        Matrix2.prototype.prepend = function (a, b, c, d, tx, ty) {
            var tx1 = this.tx;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = a1 * a + this.b * c;
                this.b = a1 * b + this.b * d;
                this.c = c1 * a + this.d * c;
                this.d = c1 * b + this.d * d;
            }
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;
            return this;
        };
        Matrix2.prototype.append = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        };
        Matrix2.prototype.prependMatrix = function (matrix) {
            this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.prependProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation, matrix.visible);
            return this;
        };
        Matrix2.prototype.appendMatrix = function (matrix) {
            this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.appendProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation, matrix.visible);
            return this;
        };
        Matrix2.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * Matrix2.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            if (regX || regY) {
                this.tx -= regX;
                this.ty -= regY;
            }
            if (skewX || skewY) {
                skewX *= Matrix2.DEG_TO_RAD;
                skewY *= Matrix2.DEG_TO_RAD;
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            }
            else {
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            return this;
        };
        Matrix2.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * Matrix2.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                skewX *= Matrix2.DEG_TO_RAD;
                skewY *= Matrix2.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            }
            else {
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            if (regX || regY) {
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        };
        Matrix2.prototype.rotate = function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;
            this.a = a1 * cos - this.b * sin;
            this.b = a1 * sin + this.b * cos;
            this.c = c1 * cos - this.d * sin;
            this.d = c1 * sin + this.d * cos;
            this.tx = tx1 * cos - this.ty * sin;
            this.ty = tx1 * sin + this.ty * cos;
            return this;
        };
        Matrix2.prototype.skew = function (skewX, skewY) {
            skewX = skewX * Matrix2.DEG_TO_RAD;
            skewY = skewY * Matrix2.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        };
        Matrix2.prototype.scale = function (x, y) {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;
            return this;
        };
        Matrix2.prototype.translate = function (x, y) {
            this.tx += x;
            this.ty += y;
            return this;
        };
        Matrix2.prototype.identity = function () {
            this.alpha = this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            this.shadow = this.compositeOperation = null;
            this.visible = true;
            return this;
        };
        Matrix2.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;
            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;
            return this;
        };
        Matrix2.prototype.isIdentity = function () {
            return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
        };
        Matrix2.prototype.transformPoint = function (x, y, pt) {
            pt = pt || {};
            pt.x = x * this.a + y * this.c + this.tx;
            pt.y = x * this.b + y * this.d + this.ty;
            return pt;
        };
        Matrix2.prototype.decompose = function (target) {
            if (target == null) {
                target = {};
            }
            target.x = this.tx;
            target.y = this.ty;
            target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
            target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
            var skewX = Math.atan2(-this.c, this.d);
            var skewY = Math.atan2(this.b, this.a);
            if (skewX == skewY) {
                target.rotation = skewY / Matrix2.DEG_TO_RAD;
                if (this.a < 0 && this.d >= 0) {
                    target.rotation += (target.rotation <= 0) ? 180 : -180;
                }
                target.skewX = target.skewY = 0;
            }
            else {
                target.skewX = skewX / Matrix2.DEG_TO_RAD;
                target.skewY = skewY / Matrix2.DEG_TO_RAD;
            }
            return target;
        };
        Matrix2.prototype.reinitialize = function (a, b, c, d, tx, ty, alpha, shadow, compositeOperation, visible) {
            this._initialize(a, b, c, d, tx, ty);
            this.alpha = alpha == null ? 1 : alpha;
            this.shadow = shadow;
            this.compositeOperation = compositeOperation;
            this.visible = visible == null ? true : visible;
            return this;
        };
        Matrix2.prototype.copy = function (matrix) {
            return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty, matrix.alpha, matrix.shadow, matrix.compositeOperation, matrix.visible);
        };
        Matrix2.prototype.appendProperties = function (alpha, shadow, compositeOperation, visible) {
            this.alpha *= alpha;
            this.shadow = shadow || this.shadow;
            this.compositeOperation = compositeOperation || this.compositeOperation;
            this.visible = this.visible && visible;
            return this;
        };
        Matrix2.prototype.prependProperties = function (alpha, shadow, compositeOperation, visible) {
            this.alpha *= alpha;
            this.shadow = this.shadow || shadow;
            this.compositeOperation = this.compositeOperation || compositeOperation;
            this.visible = this.visible && visible;
            return this;
        };
        Matrix2.prototype.clone = function () {
            var m = new Matrix2(this.a, this.b, this.c, this.d, this.tx, this.ty);
            m.alpha = this.alpha;
            m.shadow = this.shadow;
            m.compositeOperation = this.compositeOperation;
            m.visible = this.visible;
            return m;
        };
        Matrix2.prototype.toString = function () {
            return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
        };
        Matrix2.identity = null;
        Matrix2.DEG_TO_RAD = Math.PI / 180;
        return Matrix2;
    })();
    exports.Matrix2 = Matrix2;
});
