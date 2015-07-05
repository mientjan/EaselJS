define(["require", "exports", './Matrix4', './Quaternion', '../util/MathUtil'], function (require, exports, m4, q, MathUtil) {
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this._quaternion = {};
            this._vector3 = {};
            this._matrix4 = {};
            this._dotProjectOnVector = null;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.getQuaternion = function (value) {
            if (!this._quaternion[value]) {
                this._quaternion[value] = new q.Quaternion();
            }
            return this._quaternion[value];
        };
        Vector3.prototype.getVector3 = function (value) {
            if (!this._vector3[value]) {
                this._vector3[value] = new Vector3();
            }
            return this._vector3[value];
        };
        Vector3.prototype.getMatrix4 = function (value) {
            if (!this._matrix4[value]) {
                this._matrix4[value] = new m4.Matrix4();
            }
            return this._matrix4[value];
        };
        Vector3.prototype.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector3.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector3.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Vector3.prototype.setComponent = function (index, value) {
            switch (index) {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                case 2:
                    this.z = value;
                    break;
                default:
                    throw new Error('index is out of range: ' + index);
            }
        };
        Vector3.prototype.getComponent = function (index) {
            switch (index) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw new Error('index is out of range: ' + index);
            }
        };
        Vector3.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        Vector3.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        Vector3.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            this.z += s;
            return this;
        };
        Vector3.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        Vector3.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        };
        Vector3.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            return this;
        };
        Vector3.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        Vector3.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        };
        Vector3.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };
        Vector3.prototype.multiplyVectors = function (a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            return this;
        };
        Vector3.prototype.applyEuler = function (euler) {
            var v = this.getQuaternion('_quaternionApplyEuler');
            this.applyQuaternion(v.setFromEuler(euler));
            return this;
        };
        Vector3.prototype.applyAxisAngle = function (axis, angle) {
            var q1 = this.getQuaternion('quaternionApplyAxisAngle');
            this.applyQuaternion(q1.setFromAxisAngle(axis, angle));
            return this;
        };
        Vector3.prototype.applyMatrix3 = function (m) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[3] * y + e[6] * z;
            this.y = e[1] * x + e[4] * y + e[7] * z;
            this.z = e[2] * x + e[5] * y + e[8] * z;
            return this;
        };
        Vector3.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        };
        Vector3.prototype.applyProjection = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
            return this;
        };
        Vector3.prototype.applyQuaternion = function (q) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        };
        Vector3.prototype.project = function (camera) {
            var m1 = this.getMatrix4('_projectMatrix');
            m1.multiplyMatrices(camera.projectionMatrix, m1.getInverse(camera.matrixWorld));
            return this.applyProjection(m1);
        };
        Vector3.prototype.unproject = function (camera) {
            var m1 = this.getMatrix4('_unprojectMatrix');
            m1.multiplyMatrices(camera.matrixWorld, m1.getInverse(camera.projectionMatrix));
            return this.applyProjection(m1);
        };
        Vector3.prototype.transformDirection = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z;
            this.normalize();
            return this;
        };
        Vector3.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            return this;
        };
        Vector3.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
                this.y *= invScalar;
                this.z *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        };
        Vector3.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            if (this.z > v.z) {
                this.z = v.z;
            }
            return this;
        };
        Vector3.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            if (this.z < v.z) {
                this.z = v.z;
            }
            return this;
        };
        Vector3.prototype.clamp = function (min, max) {
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
            if (this.z < min.z) {
                this.z = min.z;
            }
            else if (this.z > max.z) {
                this.z = max.z;
            }
            return this;
        };
        Vector3.prototype.clampScalar = function (minVal, maxVal) {
            var min = this.getVector3('_minClampScalar');
            var max = this.getVector3('_maxClampScalar');
            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);
            return this.clamp(min, max);
        };
        Vector3.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z);
            return this;
        };
        Vector3.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z);
            return this;
        };
        Vector3.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z);
            return this;
        };
        Vector3.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
            return this;
        };
        Vector3.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        Vector3.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        };
        Vector3.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.lengthManhattan = function () {
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        };
        Vector3.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector3.prototype.setLength = function (l) {
            var oldLength = this.length();
            if (oldLength !== 0 && l !== oldLength) {
                this.multiplyScalar(l / oldLength);
            }
            return this;
        };
        Vector3.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        };
        Vector3.prototype.lerpVectors = function (v1, v2, alpha) {
            this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
            return this;
        };
        Vector3.prototype.cross = function (v) {
            var x = this.x, y = this.y, z = this.z;
            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x;
            return this;
        };
        Vector3.prototype.crossVectors = function (a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        };
        Vector3.prototype.projectOnVector = function (v) {
            var v1 = this.getVector3('_v1ProjectOnVector');
            v1.copy(v).normalize();
            this._dotProjectOnVector = this.dot(v1);
            return this.copy(v1).multiplyScalar(this._dotProjectOnVector);
        };
        Vector3.prototype.projectOnPlane = function (planeNormal) {
            var v1 = this.getVector3('_v1ProjectOnPlane');
            v1.copy(this).projectOnVector(planeNormal);
            return this.sub(v1);
        };
        Vector3.prototype.reflect = function (normal) {
            var v1 = this.getVector3('_v1Reflect');
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
        };
        Vector3.prototype.angleTo = function (v) {
            var theta = this.dot(v) / (this.length() * v.length());
            return Math.acos(MathUtil.clamp(theta, -1, 1));
        };
        Vector3.prototype.distanceTo = function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        };
        Vector3.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            var dz = this.z - v.z;
            return dx * dx + dy * dy + dz * dz;
        };
        Vector3.prototype.setFromMatrixPosition = function (m) {
            this.x = m.elements[12];
            this.y = m.elements[13];
            this.z = m.elements[14];
            return this;
        };
        Vector3.prototype.setFromMatrixScale = function (m) {
            var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
            var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
            var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
            this.x = sx;
            this.y = sy;
            this.z = sz;
            return this;
        };
        Vector3.prototype.setFromMatrixColumn = function (index, matrix) {
            var offset = index * 4;
            var me = matrix.elements;
            this.x = me[offset];
            this.y = me[offset + 1];
            this.z = me[offset + 2];
            return this;
        };
        Vector3.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
        };
        Vector3.prototype.fromArray = function (array, offset) {
            if (offset === undefined) {
                offset = 0;
            }
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            return this;
        };
        Vector3.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            return array;
        };
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        return Vector3;
    })();
    exports.Vector3 = Vector3;
});
