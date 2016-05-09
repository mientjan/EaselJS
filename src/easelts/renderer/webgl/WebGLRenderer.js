define(["require", "exports", "../../../core/event/Signal"], function (require, exports, Signal_1) {
    "use strict";
    var WebGLRenderer = (function () {
        function WebGLRenderer() {
            this._autoClear = true;
            this.drawstartSignal = new Signal_1.Signal();
            this.drawendSignal = new Signal_1.Signal();
        }
        WebGLRenderer.prototype._initContext = function () {
            var gl = this._context;
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
        };
        WebGLRenderer.prototype.setElement = function (element) {
            this._element = element;
            this._context = element.getContext();
        };
        WebGLRenderer.prototype.render = function (item) {
            var gl = this._context;
            var element = this._element;
            var autoClear = this._autoClear;
            this.drawstartSignal.emit();
            if (autoClear) {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            this.drawendSignal.emit();
        };
        return WebGLRenderer;
    }());
    exports.WebGLRenderer = WebGLRenderer;
});
