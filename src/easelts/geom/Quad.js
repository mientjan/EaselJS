define(["require", "exports"], function (require, exports) {
    var Quad = (function () {
        function Quad() {
            this.elements = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
        }
        return Quad;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Quad;
});
