define(["require", "exports"], function (require, exports) {
    "use strict";
    var WebGLManager = (function () {
        function WebGLManager(renderer) {
            this.renderer = renderer;
            this.renderer.on('context', this.onContextChange, this);
        }
        WebGLManager.prototype.onContextChange = function () {
        };
        WebGLManager.prototype.destroy = function () {
            this.renderer.off('context', this.onContextChange, this);
            this.renderer = null;
        };
        return WebGLManager;
    }());
    exports.WebGLManager = WebGLManager;
});
