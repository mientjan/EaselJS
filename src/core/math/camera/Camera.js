define(["require", "exports", "../Matrix4", "../Quaternion", "../Vector3"], function (require, exports, Matrix4_1, Quaternion_1, Vector3_1) {
    var Camera = (function () {
        function Camera() {
            this.getWorldDirection = (function () {
                var quaternion = new Quaternion_1.Quaternion();
                return function (optionalTarget) {
                    var result = optionalTarget || new Vector3_1.Vector3();
                    this.getWorldQuaternion(quaternion);
                    return result.set(0, 0, -1).applyQuaternion(quaternion);
                };
            })();
            this.lookAt = (function () {
                var m1 = new Matrix4_1.Matrix4();
                return function (vector) {
                    m1.lookAt(this.position, vector, this.up);
                    this.quaternion.setFromRotationMatrix(m1);
                };
            })();
            this.matrixWorldInverse = new Matrix4_1.Matrix4();
            this.projectionMatrix = new Matrix4_1.Matrix4();
        }
        Camera.prototype.copy = function (source) {
            //THREE.Object3D.prototype.copy.call( this, source );
            this.matrixWorldInverse.copy(source.matrixWorldInverse);
            this.projectionMatrix.copy(source.projectionMatrix);
            return this;
        };
        return Camera;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Camera;
});
