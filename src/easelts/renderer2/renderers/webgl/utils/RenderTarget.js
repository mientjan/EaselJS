define(["require", "exports"], function (require, exports) {
    "use strict";
    var math = require('../../../math'), CONST = require('../../../const'), Transform2d = require('../../../c2d/Transform2d'), GLFramebuffer = require('pixi-gl-core').GLFramebuffer;
    var RenderTarget = (function () {
        function RenderTarget(gl, width, height, scaleMode, resolution, root) {
            this.frameBuffer = null;
            this.texture = null;
            this.clearColor = [0, 0, 0, 0];
            this.size = new math.Rectangle(0, 0, 1, 1);
            this.resolution = resolution || CONST.RESOLUTION;
            this.projection2d = new Transform2d();
            this.worldProjection = null;
            this.transform = null;
            this.frame = null;
            this.defaultFrame = new math.Rectangle();
            this.destinationFrame = null;
            this.sourceFrame = null;
            this.stencilBuffer = null;
            this.stencilMaskStack = [];
            this.filterStack = [
                {
                    renderTarget: this,
                    filter: [],
                    bounds: this.size
                }
            ];
            this.gl = gl;
            this.frameBuffer = null;
            this.texture = null;
            this.clearColor = [0, 0, 0, 0];
            this.size = new math.Rectangle(0, 0, 1, 1);
            this.resolution = resolution || CONST.RESOLUTION;
            this.projection2d = new Transform2d();
            this.worldProjection = null;
            this.transform = null;
            this.frame = null;
            this.defaultFrame = new math.Rectangle();
            this.destinationFrame = null;
            this.sourceFrame = null;
            this.stencilBuffer = null;
            this.stencilMaskStack = [];
            this.filterStack = [
                {
                    renderTarget: this,
                    filter: [],
                    bounds: this.size
                }
            ];
            this.scaleMode = scaleMode || CONST.SCALE_MODES.DEFAULT;
            this.root = root;
            if (!this.root) {
                this.frameBuffer = GLFramebuffer.createRGBA(gl, 100, 100);
                if (this.scaleMode === CONST.SCALE_MODES.NEAREST) {
                    this.frameBuffer.texture.enableNearestScaling();
                }
                else {
                    this.frameBuffer.texture.enableLinearScaling();
                }
                this.texture = this.frameBuffer.texture;
            }
            else {
                this.frameBuffer = new GLFramebuffer(gl, 100, 100);
                this.frameBuffer.framebuffer = null;
            }
            this.setFrame();
            this.resize(width, height);
        }
        Object.defineProperty(RenderTarget.prototype, "projectionMatrix", {
            get: function () {
                return this.worldProjection ? this.worldProjection.matrix : this.projection2d.matrix;
            },
            enumerable: true,
            configurable: true
        });
        RenderTarget.prototype.setWorldProjection = function (worldProjection) {
            if (worldProjection) {
                this.worldProjection = worldProjection.updateChildReverseTransform(this.worldProjection, this.projection2d);
            }
            else {
                this.worldProjection = null;
            }
        };
        RenderTarget.prototype.checkWorldProjection = function (worldProjection) {
            if (worldProjection) {
                if (!this.worldProjection) {
                    return true;
                }
                return worldProjection.checkChildReverseTransform(this.worldProjection, this.projection2d);
            }
            else {
                return this.worldProjection !== null;
            }
        };
        RenderTarget.prototype.clear = function (clearColor) {
            var cc = clearColor || this.clearColor;
            this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]);
        };
        RenderTarget.prototype.attachStencilBuffer = function () {
            if (!this.root) {
                this.frameBuffer.enableStencil();
            }
        };
        RenderTarget.prototype.setFrame = function (destinationFrame, sourceFrame) {
            this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
            this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
        };
        RenderTarget.prototype.activate = function (worldProjection) {
            var gl = this.gl;
            this.frameBuffer.bind();
            this.calculateProjection(this.destinationFrame, this.sourceFrame);
            if (this.transform) {
                this.projection2d.matrix2d.append(this.transform);
                this.projection2d.version++;
            }
            this.setWorldProjection(worldProjection);
            if (this.destinationFrame !== this.sourceFrame) {
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, (this.destinationFrame.width * this.resolution) | 0, (this.destinationFrame.height * this.resolution) | 0);
            }
            else {
                gl.disable(gl.SCISSOR_TEST);
            }
            gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, (this.destinationFrame.width * this.resolution) | 0, (this.destinationFrame.height * this.resolution) | 0);
        };
        RenderTarget.prototype.calculateProjection = function (destinationFrame, sourceFrame) {
            var p = this.projection2d;
            var pm = p.matrix2d;
            sourceFrame = sourceFrame || destinationFrame;
            pm.identity();
            if (!this.root) {
                pm.a = 1 / destinationFrame.width * 2;
                pm.d = 1 / destinationFrame.height * 2;
                pm.tx = -1 - sourceFrame.x * pm.a;
                pm.ty = -1 - sourceFrame.y * pm.d;
            }
            else {
                pm.a = 1 / destinationFrame.width * 2;
                pm.d = -1 / destinationFrame.height * 2;
                pm.tx = -1 - sourceFrame.x * pm.a;
                pm.ty = 1 - sourceFrame.y * pm.d;
            }
        };
        RenderTarget.prototype.resize = function (width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (this.size.width === width && this.size.height === height) {
                return;
            }
            this.size.width = width;
            this.size.height = height;
            this.defaultFrame.width = width;
            this.defaultFrame.height = height;
            this.frameBuffer.resize(width * this.resolution, height * this.resolution);
            var projectionFrame = this.frame || this.size;
            this.calculateProjection(projectionFrame);
        };
        RenderTarget.prototype.destroy = function () {
            this.frameBuffer.destroy();
            this.frameBuffer = null;
            this.texture = null;
        };
        return RenderTarget;
    }());
    exports.RenderTarget = RenderTarget;
});
