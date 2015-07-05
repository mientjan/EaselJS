define(["require", "exports", '../Quaternion', '../Vector3', '../Matrix4'], function (require, exports, q, v3, m4) {
    var AbstractMath3d = (function () {
        function AbstractMath3d() {
            this._quaternion = {};
            this._vector3 = {};
            this._matrix4 = {};
        }
        AbstractMath3d.prototype.getQuaternion = function (value) {
            if (!this._quaternion[value]) {
                this._quaternion[value] = new q.Quaternion();
            }
            return this._quaternion[value];
        };
        AbstractMath3d.prototype.getVector3 = function (value) {
            if (!this._vector3[value]) {
                this._vector3[value] = new v3.Vector3();
            }
            return this._vector3[value];
        };
        AbstractMath3d.prototype.getMatrix4 = function (value) {
            if (!this._matrix4[value]) {
                this._matrix4[value] = new m4.Matrix4();
            }
            return this._matrix4[value];
        };
        return AbstractMath3d;
    })();
    exports.AbstractMath3d = AbstractMath3d;
});
