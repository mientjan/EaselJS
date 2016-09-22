define(["require", "exports", "../../display/Container"], function (require, exports, Container_1) {
    "use strict";
    var SystemRenderer = (function () {
        function SystemRenderer(system, width, height, options) {
            if (options === void 0) { options = {}; }
            this.type = CONST.RENDERER_TYPE.UNKNOWN;
            this.width = 800;
            this.height = 600;
            this.blendModes = null;
            this._backgroundColor = 0x000000;
            this._backgroundColorRgba = [0, 0, 0, 0];
            this._backgroundColorString = '#000000';
            this._tempDisplayObjectParent = new Container_1.Container();
            this._lastObjectRendered = this._tempDisplayObjectParent;
            this.view = options.view || document.createElement('canvas');
            this.preserveDrawingBuffer = options.preserveDrawingBuffer;
            this.clearBeforeRender = options.clearBeforeRender;
            this.roundPixels = options.roundPixels;
            this.resolution = options.resolution;
            this.transparent = options.transparent;
            this.backgroundColor = options.backgroundColor || 0x000000;
            this.autoResize = options.autoResize || false;
        }
        Object.defineProperty(SystemRenderer.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (val) {
                this._backgroundColor = val;
            },
            enumerable: true,
            configurable: true
        });
        SystemRenderer.prototype.resize = function (width, height) {
            this.width = width * this.resolution;
            this.height = height * this.resolution;
            this.view.width = this.width;
            this.view.height = this.height;
            if (this.autoResize) {
                this.view.style.width = this.width / this.resolution + 'px';
                this.view.style.height = this.height / this.resolution + 'px';
            }
        };
        SystemRenderer.prototype.generateTexture = function (displayObject, scaleMode, resolution) {
            var bounds = displayObject.getLocalBounds();
            var renderTexture = RenderTexture.create(bounds.width | 0, bounds.height | 0, scaleMode, resolution);
            tempMatrix.tx = -bounds.x;
            tempMatrix.ty = -bounds.y;
            this.render(displayObject, renderTexture, false, tempMatrix, true);
            return renderTexture;
        };
        SystemRenderer.prototype.destroy = function (removeView) {
            if (removeView && this.view.parentNode) {
                this.view.parentNode.removeChild(this.view);
            }
            this.type = CONST.RENDERER_TYPE.UNKNOWN;
            this.width = 0;
            this.height = 0;
            this.view = null;
            this.resolution = 0;
            this.transparent = false;
            this.autoResize = false;
            this.blendModes = null;
            this.preserveDrawingBuffer = false;
            this.clearBeforeRender = false;
            this.roundPixels = false;
            this._backgroundColor = 0;
            this._backgroundColorRgba = null;
            this._backgroundColorString = null;
            this.backgroundColor = 0;
            this._tempDisplayObjectParent = null;
            this._lastObjectRendered = null;
        };
        return SystemRenderer;
    }());
    exports.SystemRenderer = SystemRenderer;
});
