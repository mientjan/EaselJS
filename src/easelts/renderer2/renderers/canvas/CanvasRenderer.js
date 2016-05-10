var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../SystemRenderer", "./utils/CanvasMaskManager"], function (require, exports, SystemRenderer_1, CanvasMaskManager_1) {
    "use strict";
    var CanvasRenderer = (function (_super) {
        __extends(CanvasRenderer, _super);
        function CanvasRenderer(width, height, options) {
            if (options === void 0) { options = {}; }
            _super.call(this, 'Canvas', width, height, options);
            this.type = 1;
            this.refresh = true;
            this.maskManager = new CanvasMaskManager_1.CanvasMaskManager(this);
            this.smoothProperty = 'imageSmoothingEnabled';
            this.rootContext = this.view.getContext('2d', { alpha: this.transparent });
            this.rootResolution = this.resolution;
            if (!this.rootContext['imageSmoothingEnabled']) {
                if (this.rootContext['webkitImageSmoothingEnabled']) {
                    this.smoothProperty = 'webkitImageSmoothingEnabled';
                }
                else if (this.rootContext['mozImageSmoothingEnabled']) {
                    this.smoothProperty = 'mozImageSmoothingEnabled';
                }
                else if (this.rootContext['oImageSmoothingEnabled']) {
                    this.smoothProperty = 'oImageSmoothingEnabled';
                }
                else if (this.rootContext['msImageSmoothingEnabled']) {
                    this.smoothProperty = 'msImageSmoothingEnabled';
                }
            }
            this.blendModes = mapCanvasBlendModesToPixi();
            this._activeBlendMode = null;
            this.context = null;
            this.renderingToScreen = false;
            this.resize(width, height);
        }
        CanvasRenderer.prototype.render = function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            if (!this.view) {
                return;
            }
            this.renderingToScreen = !renderTexture;
            this.emit('prerender');
            if (renderTexture) {
                renderTexture = renderTexture.baseTexture || renderTexture;
                if (!renderTexture._canvasRenderTarget) {
                    renderTexture._canvasRenderTarget = new CanvasRenderTarget(renderTexture.width, renderTexture.height, renderTexture.resolution);
                    renderTexture.source = renderTexture._canvasRenderTarget.canvas;
                    renderTexture.valid = true;
                }
                this.context = renderTexture._canvasRenderTarget.context;
                this.resolution = renderTexture._canvasRenderTarget.resolution;
            }
            else {
                this.context = this.rootContext;
                this.resolution = this.rootResolution;
            }
            var context = this.context;
            this._lastObjectRendered = displayObject;
            if (!skipUpdateTransform) {
                var cacheParent = displayObject.parent;
                var tempWt = this._tempDisplayObjectParent.projectionMatrix2d;
                if (transform) {
                    transform.copy(tempWt);
                }
                else {
                    tempWt.identity();
                }
                displayObject.parent = this._tempDisplayObjectParent;
                displayObject.updateTransform();
                displayObject.parent = cacheParent;
            }
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalAlpha = 1;
            context.globalCompositeOperation = this.blendModes[CONST.BLEND_MODES.NORMAL];
            if (navigator.isCocoonJS && this.view.screencanvas) {
                context.fillStyle = 'black';
                context.clear();
            }
            if (clear || this.clearBeforeRender) {
                if (this.transparent) {
                    context.clearRect(0, 0, this.width, this.height);
                }
                else {
                    context.fillStyle = this._backgroundColorString;
                    context.fillRect(0, 0, this.width, this.height);
                }
            }
            var tempContext = this.context;
            this.context = context;
            displayObject.renderCanvas(this);
            this.context = tempContext;
            this.emit('postrender');
        };
        CanvasRenderer.prototype.setBlendMode = function (blendMode) {
            if (this._activeBlendMode === blendMode) {
                return;
            }
            this.context.globalCompositeOperation = this.blendModes[blendMode];
        };
        CanvasRenderer.prototype.destroy = function (removeView) {
            this.destroyPlugins();
            SystemRenderer_1.SystemRenderer.prototype.destroy.call(this, removeView);
            this.context = null;
            this.refresh = true;
            this.maskManager.destroy();
            this.maskManager = null;
            this.smoothProperty = null;
        };
        CanvasRenderer.prototype.resize = function (w, h) {
            this.super(w, h);
            if (this.smoothProperty) {
                this.rootContext[this.smoothProperty] = (CONST.SCALE_MODES.DEFAULT === CONST.SCALE_MODES.LINEAR);
            }
        };
        return CanvasRenderer;
    }(SystemRenderer_1.SystemRenderer));
    exports.CanvasRenderer = CanvasRenderer;
});
