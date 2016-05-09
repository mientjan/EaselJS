var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var WebGLManager = require('./WebGLManager');
    var StencilMaskManager = (function (_super) {
        __extends(StencilMaskManager, _super);
        function StencilMaskManager(renderer) {
            _super.call(this, renderer);
            this.stencilMaskStack = null;
        }
        StencilMaskManager.prototype.setMaskStack = function (stencilMaskStack) {
            this.stencilMaskStack = stencilMaskStack;
            var gl = this.renderer.gl;
            if (stencilMaskStack.length === 0) {
                gl.disable(gl.STENCIL_TEST);
            }
            else {
                gl.enable(gl.STENCIL_TEST);
            }
        };
        StencilMaskManager.prototype.pushStencil = function (graphics) {
            this.renderer.setObjectRenderer(this.renderer.plugins.graphics);
            this.renderer._activeRenderTarget.attachStencilBuffer();
            var gl = this.renderer.gl, sms = this.stencilMaskStack;
            if (sms.length === 0) {
                gl.enable(gl.STENCIL_TEST);
                gl.clear(gl.STENCIL_BUFFER_BIT);
                gl.stencilFunc(gl.ALWAYS, 1, 1);
            }
            sms.push(graphics);
            gl.colorMask(false, false, false, false);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            this.renderer.plugins.graphics.render(graphics);
            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        };
        StencilMaskManager.prototype.popStencil = function () {
            this.renderer.setObjectRenderer(this.renderer.plugins.graphics);
            var gl = this.renderer.gl, sms = this.stencilMaskStack;
            var graphics = sms.pop();
            if (sms.length === 0) {
                gl.disable(gl.STENCIL_TEST);
            }
            else {
                gl.colorMask(false, false, false, false);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                this.renderer.plugins.graphics.render(graphics);
                gl.colorMask(true, true, true, true);
                gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            }
        };
        StencilMaskManager.prototype.destroy = function () {
            _super.prototype.de;
            this.stencilMaskStack.stencilStack = null;
        };
        return StencilMaskManager;
    }(WebGLManager));
    exports.StencilMaskManager = StencilMaskManager;
});
