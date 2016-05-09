var WebGLManager = require('./WebGLManager'), AlphaMaskFilter = require('../filters/spriteMask/SpriteMaskFilter');
function MaskManager(renderer) {
    WebGLManager.call(this, renderer);
    this.scissor = false;
    this.enableScissor = true;
    this.alphaMaskPool = [];
    this.alphaMaskIndex = 0;
}
MaskManager.prototype = Object.create(WebGLManager.prototype);
MaskManager.prototype.constructor = MaskManager;
module.exports = MaskManager;
MaskManager.prototype.pushMask = function (target, maskData) {
    if (maskData.texture) {
        this.pushSpriteMask(target, maskData);
    }
    else {
        if (this.enableScissor && !this.scissor && !this.renderer.stencilManager.stencilMaskStack.length && maskData.graphicsData[0].shape.type === 1) {
            var matrix = maskData.projectionMatrix2d;
            var rot = Math.atan2(matrix.b, matrix.a);
            rot = Math.round(rot * (180 / Math.PI));
            if (rot % 90) {
                this.pushStencilMask(maskData);
            }
            else {
                this.pushScissorMask(target, maskData);
            }
        }
        else {
            this.pushStencilMask(maskData);
        }
    }
};
MaskManager.prototype.popMask = function (target, maskData) {
    if (maskData.texture) {
        this.popSpriteMask(target, maskData);
    }
    else {
        if (this.enableScissor && !this.renderer.stencilManager.stencilMaskStack.length) {
            this.popScissorMask(target, maskData);
        }
        else {
            this.popStencilMask(target, maskData);
        }
    }
};
MaskManager.prototype.pushSpriteMask = function (target, maskData) {
    var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
    if (!alphaMaskFilter) {
        alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new AlphaMaskFilter(maskData)];
    }
    alphaMaskFilter[0].maskSprite = maskData;
    target.filterArea = maskData.getBounds();
    this.renderer.filterManager.pushFilter(target, alphaMaskFilter);
    this.alphaMaskIndex++;
};
MaskManager.prototype.popSpriteMask = function () {
    this.renderer.filterManager.popFilter();
    this.alphaMaskIndex--;
};
MaskManager.prototype.pushStencilMask = function (maskData) {
    this.renderer.currentRenderer.stop();
    this.renderer.stencilManager.pushStencil(maskData);
};
MaskManager.prototype.popStencilMask = function () {
    this.renderer.currentRenderer.stop();
    this.renderer.stencilManager.popStencil();
};
MaskManager.prototype.pushScissorMask = function (target, maskData) {
    maskData.renderable = true;
    var renderTarget = this.renderer._activeRenderTarget;
    var bounds = maskData.getBounds();
    bounds.fit(renderTarget.size);
    maskData.renderable = false;
    this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
    this.renderer.gl.scissor(bounds.x, renderTarget.root ? renderTarget.size.height - bounds.y - bounds.height : bounds.y, bounds.width, bounds.height);
    this.scissor = true;
};
MaskManager.prototype.popScissorMask = function () {
    this.scissor = false;
    var gl = this.renderer.gl;
    gl.disable(gl.SCISSOR_TEST);
};
